terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.94.1"
    }
  }

  required_version = ">= 1.5.7"
}

provider "aws" {
  region = "us-east-1"
}

###############################################
# ECS Cluster
###############################################
resource "aws_ecs_cluster" "main" {
  name = "ecs-cluster"
}

###############################################
# Application Load Balancer
###############################################

resource "aws_lb" "alb" {
  name               = "ecs-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.security_group_id]
  subnets            = var.subnet_ids
}

resource "aws_lb_target_group" "tg" {
  for_each = local.microservice_ports

  name        = "${each.key}-tg"
  port        = each.value
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path                = "/health"
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

# Target group para Kong
resource "aws_lb_target_group" "kong" {
  name        = "kong-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    # path                = "/status"
    # protocol            = "HTTP"
    # interval            = 30
    # timeout             = 5
    # healthy_threshold   = 2
    # unhealthy_threshold = 2
    path     = "/"
    protocol = "HTTP"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

resource "aws_lb_listener_rule" "auth_service" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 2

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg["auth-service"].arn
  }

  condition {
    path_pattern {
      values = ["/auth*", "/auth/*"]
    }
  }
}

resource "aws_lb_listener_rule" "user_service" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 3

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg["user-service"].arn
  }

  condition {
    path_pattern {
      values = ["/user*", "/user/*"]
    }
  }
}

resource "aws_lb_listener_rule" "singer_service" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 6

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg["singer-service"].arn
  }

  condition {
    path_pattern {
      values = ["/singer*", "/singer/*"]
    }
  }
}

resource "aws_lb_listener_rule" "vote_service" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 5

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg["vote-service"].arn
  }

  condition {
    path_pattern {
      values = ["/vote*", "/vote/*"]
    }
  }
}

resource "aws_lb_listener_rule" "kong_rule" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 50

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.kong.arn
  }

  condition {
    path_pattern {
      values = ["/kong*", "/kong/*"]
    }
  }
}

###############################################
# ECS Task Definitions (Microservices + Kong)
###############################################

locals {
  microservices = [
    { name = "auth-service", port = 5000 },
    { name = "user-service", port = 5002 },
    { name = "singer-service", port = 5001 },
    { name = "vote-service", port = 5003 }
  ]

  microservice_ports = {
    for svc in local.microservices : svc.name => svc.port
  }
}

resource "aws_ecs_task_definition" "microservices" {
  for_each = { for svc in local.microservices : svc.name => svc }

  family                   = each.key
  requires_compatibilities = ["EC2"]
  network_mode             = "awsvpc"
  task_role_arn            = var.ecs_task_role_arn
  execution_role_arn       = var.ecs_task_execution_role_arn

  cpu    = 512
  memory = 512

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = each.key
      image     = "${var.aws_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${each.key}:latest"
      essential = true
      cpu       = 512
      memory    = 512
      portMappings = [
        {
          name          = "${each.key}-${each.value.port}-tcp"
          containerPort = each.value.port
          hostPort      = each.value.port
          protocol      = "tcp",
          appProtocol   = "http"
        }
      ]
      environment = [
        { name = "SUPABASE_URL", value = var.supabase_url },
        { name = "SUPABASE_KEY", value = var.supabase_key },
        { name = "KONG_DATABASE", value = "postgres" },
        { name = "KONG_PG_HOST", value = "kong-db.ckozktn4ihau.us-east-1.rds.amazonaws.com" },
        { name = "KONG_PG_USER", value = var.kong_db_user },
        { name = "KONG_PG_PASSWORD", value = var.kong_db_password }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = each.key
          mode                  = "non-blocking"
        }
      }
    }
  ])
}

# Kong Task Definition
resource "aws_ecs_task_definition" "kong" {
  family                   = "kong"
  requires_compatibilities = ["EC2"]
  network_mode             = "awsvpc"
  cpu                      = 870
  memory                   = 870
  task_role_arn            = var.ecs_task_role_arn
  execution_role_arn       = var.ecs_task_execution_role_arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "kong"
      image     = "public.ecr.aws/docker/library/kong:3.6"
      cpu       = 870
      memory    = 870
      essential = true
      portMappings = [
        {
          containerPort = 8000,
          hostPort      = 8000,
          protocol      = "tcp",
          appProtocol   = "http"
        },
        { containerPort = 8001,
          hostPort      = 8001,
          protocol      = "tcp",
          appProtocol   = "http"
        }
      ]
      environment = [
        { name = "SUPABASE_URL", value = var.supabase_url },
        { name = "SUPABASE_KEY", value = var.supabase_key },
        { name = "KONG_DATABASE", value = "postgres" },
        { name = "KONG_PG_HOST", value = "kong-db.ckozktn4ihau.us-east-1.rds.amazonaws.com" },
        { name = "KONG_PG_USER", value = var.kong_db_user },
        { name = "KONG_PG_PASSWORD", value = var.kong_db_password },
        { name = "KONG_ADMIN_LISTEN", value = "0.0.0.0:8001" },
        { name = "KONG_PROXY_ACCESS_LOG", value = "/dev/stdout" },
        { name = "KONG_ADMIN_ACCESS_LOG", value = "/dev/stdout" },
        { name = "KONG_PROXY_ERROR_LOG", value = "/dev/stderr" },
        { name = "KONG_ADMIN_ERROR_LOG", value = "/dev/stderr" },
        { name = "KONG_LOG_LEVEL", value = "debug" },
        { name = "KONG_PG_LOG_QUERIES", value = "on" },
        { name = "KONG_PG_SSL", value = "on" },
        { name = "KONG_PG_SSL_VERIFY", value = "off" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.kong.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "kong"
          mode                  = "non-blocking"
        }
      }
    },
  ])
}

###############################################
# ECS Services (Microservices + Kong)
###############################################

resource "aws_ecs_service" "microservices" {
  for_each = aws_ecs_task_definition.microservices

  name            = each.key
  cluster         = aws_ecs_cluster.main.id
  task_definition = each.value.arn
  desired_count   = 1
  launch_type     = var.launch_type

  load_balancer {
    target_group_arn = aws_lb_target_group.tg[each.key].arn
    container_name   = each.key
    container_port   = local.microservice_ports[each.key]
  }

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = false
  }

  depends_on = [aws_lb_listener.http]
}

resource "aws_ecs_service" "kong" {
  name            = "kong"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.kong.arn
  desired_count   = 1
  launch_type     = var.launch_type

  load_balancer {
    target_group_arn = aws_lb_target_group.kong.arn
    container_name   = "kong"
    container_port   = 8000
  }

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = false
  }

  depends_on = [aws_lb_listener.http, aws_db_instance.kong_db]
}

# ###############################################
# # RDS Postgres (Kong Database)
# ###############################################
resource "aws_db_instance" "kong_db" {
  identifier        = "kong-db"
  engine            = "postgres"
  instance_class    = "db.t3.medium"
  allocated_storage = 20

  db_name  = "kong"
  username = var.kong_db_user
  password = var.kong_db_password

  publicly_accessible    = true
  vpc_security_group_ids = [var.security_group_id]
  db_subnet_group_name   = aws_db_subnet_group.db_subnets.name

  skip_final_snapshot = true
}

resource "aws_db_subnet_group" "db_subnets" {
  name       = "db-subnet-group"
  subnet_ids = var.subnet_ids
}

###############################################
# EC2
###############################################
resource "aws_launch_template" "ecs_lt" {
  name_prefix   = "ecs-"
  image_id      = var.ecs_ami_id
  instance_type = "t3.small"
  key_name      = "vockey"

  iam_instance_profile {
    name = "LabInstanceProfile"
  }

  user_data = base64encode(<<EOF
                #!/bin/bash
                echo ECS_CLUSTER=${aws_ecs_cluster.main.name} >> /etc/ecs/ecs.config
                EOF
  )

  network_interfaces {
    device_index                = 0
    subnet_id                   = var.subnet_ids[0]
    associate_public_ip_address = true
    security_groups             = [var.security_group_id]
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "ecs-container-instance"
    }
  }
}

resource "aws_autoscaling_group" "ecs_asg" {
  name                = "ecs-asg"
  desired_capacity    = 6
  max_size            = 6
  min_size            = 1
  vpc_zone_identifier = var.subnet_ids

  launch_template {
    id      = aws_launch_template.ecs_lt.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "ecs-container-instance"
    propagate_at_launch = true
  }
}

resource "aws_vpc_security_group_egress_rule" "rds_sg_egress" {
  security_group_id = var.security_group_id

  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 80
  ip_protocol = "tcp"
  to_port     = 80
}

resource "aws_vpc_security_group_ingress_rule" "rds_sg_ingress" {
  security_group_id            = var.security_group_id
  referenced_security_group_id = var.security_group_id
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
}

###############################################
# FrontEnd
###############################################
resource "aws_ecs_task_definition" "frontend" {
  family                   = "nextjs-frontend"
  requires_compatibilities = [var.launch_type]
  network_mode             = "awsvpc"
  cpu                      = 870
  memory                   = 870
  task_role_arn            = var.ecs_task_role_arn
  execution_role_arn       = var.ecs_task_execution_role_arn

  container_definitions = jsonencode([
    {
      name      = "nextjs-frontend"
      image     = "${var.aws_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/frontend-nextjs:latest"
      cpu       = 870
      memory    = 870
      essential = true
      portMappings = [
        { containerPort = 3000, hostPort = 3000, protocol = "tcp", appProtocol = "http" }
      ]
      environment = [
        { name = "NODE_ENV", value = "production" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "frontend"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "frontend" {
  name            = "nextjs-frontend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = var.launch_type

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "nextjs-frontend"
    container_port   = 3000
  }

  network_configuration {
    subnets         = var.subnet_ids
    security_groups = [var.security_group_id]
  }

  depends_on = [aws_lb_listener.http]
}

resource "aws_lb_target_group" "frontend" {
  name        = "frontend-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path = "/"
    port = "3000"
  }
}

resource "aws_lb_listener_rule" "frontend_rule" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }

  condition {
    path_pattern {
      values = ["/frontend/*"]
    }
  }
}

###############################################
# Kong Migration
###############################################
resource "aws_ecs_task_definition" "kong-migration" {
  family                   = "kong-migration"
  requires_compatibilities = [var.launch_type]
  network_mode             = "awsvpc"
  cpu                      = 512
  memory                   = 512
  task_role_arn            = var.ecs_task_role_arn
  execution_role_arn       = var.ecs_task_execution_role_arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "kong-migration"
      image     = "public.ecr.aws/docker/library/kong:3.6"
      essential = true
      cpu       = 512
      memory    = 512
      command   = ["kong", "migrations", "bootstrap"]
      environment = [
        { name = "KONG_DATABASE", value = "postgres" },
        { name = "KONG_PG_HOST", value = "kong-db.ckozktn4ihau.us-east-1.rds.amazonaws.com" },
        { name = "KONG_PG_USER", value = var.kong_db_user },
        { name = "KONG_PG_PASSWORD", value = var.kong_db_password },
        { name = "KONG_PG_SSL", value = "on" },
        { name = "KONG_PG_SSL_VERIFY", value = "off" },
        { name = "KONG_LOG_LEVEL", value = "debug" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = "/ecs/kong"
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "kong-migration"
        }
      }
    }
  ])
}
