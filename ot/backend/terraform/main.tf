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
# Networking (VPC, Subnets, SG)
###############################################

variable "aws_region" {
  default = "us-east-1"
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
  default     = "vpc-02b6a00e0a7992c00" # visto - cambiado
}

# para verlo
# aws ec2 describe-subnets --query "Subnets[*].{ID:SubnetId, AZ:AvailabilityZone}" --region us-east-1
variable "subnet_ids" {
  description = "Subnet IDs"
  type        = list(string)
  default     = [
    "subnet-00886bfc24068cf25",
    "subnet-06f9963806a225b3f",
    "subnet-06fd0ed8cb7fd4476",
    "subnet-0594bada3fb3fa148",
    "subnet-0d33db4305b91a8fc"
  ]
}

variable "security_group_id" {
  description = "Security Group ID"
  type        = string
  default     = "sg-0dd6ec0d822c28e8a" # ir a ver a la pagina
}

###############################################
# ECS Cluster
###############################################

resource "aws_ecs_cluster" "main" {
  name = "ecs-cluster"
}

###############################################
# CloudWatch Logs
###############################################

resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/microservices"
  retention_in_days = 7
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
  port        = 8000  # Puerto donde Kong escucha
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path                = "/"
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

# Listener en puerto 80 → Por defecto manda todo a Kong
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80  # Puerto donde Kong escucha
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.kong.arn
  }
}

resource "aws_lb_listener_rule" "auth_service" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 10

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
  priority     = 20

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
  priority     = 30

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
  priority     = 40

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

      cpu       = 870
      memory    = 870

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

// SUPABASE_URL=https://vucnrhorxrruxlsaumxo.supabase.co
  container_definitions = jsonencode([
    {
      name      = each.key
      image     = "${var.aws_account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${each.key}:latest"
      essential = true
      cpu       = 870
      memory    = 870
      portMappings = [
        {
          name = "${each.key}-${each.value.port}-tcp"
          containerPort = each.value.port
          hostPort      = each.value.port
          protocol: "tcp",
            appProtocol: "http"
        }
      ]
      environment = [
        { name = "SUPABASE_URL", value = "https://vucnrhorxrruxlsaumxo.supabase.co" },
        { name = "SUPABASE_KEY", value = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1Y25yaG9yeHJydXhsc2F1bXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2OTAwMjksImV4cCI6MjA1NjI2NjAyOX0.47UFGmsvsx_w_pJImBU7mexSAJpl8IP_56PmPm5MzVU" },
        { name = "KONG_DATABASE", value = "postgres" },
        { name = "KONG_PG_HOST", value = aws_db_instance.kong_db.address },
        { name = "KONG_PG_USER", value = var.kong_db_user },
        { name = "KONG_PG_PASSWORD", value = var.kong_db_password }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = each.key
          mode = "non-blocking"
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

  container_definitions = jsonencode([
    {
      name  = "kong"
      image = "kong:3.6"
        cpu                      = 870
  memory                   = 870
      essential = true
      portMappings = [
        { containerPort = 8000, hostPort = 8000 },
        { containerPort = 8001, hostPort = 8001 }
      ]
      environment = [
        { name = "SUPABASE_URL", value = "https://vucnrhorxrruxlsaumxo.supabase.co" },
        { name = "SUPABASE_KEY", value = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1Y25yaG9yeHJydXhsc2F1bXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2OTAwMjksImV4cCI6MjA1NjI2NjAyOX0.47UFGmsvsx_w_pJImBU7mexSAJpl8IP_56PmPm5MzVU" },
        { name = "KONG_DATABASE", value = "postgres" },
        { name = "KONG_PG_HOST", value = aws_db_instance.kong_db.address },
        { name = "KONG_PG_USER", value = var.kong_db_user },
        { name = "KONG_PG_PASSWORD", value = var.kong_db_password }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "kong"
        }
      }
    }
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
  launch_type     = "EC2"

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
  launch_type     = "EC2"

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

###############################################
# RDS Postgres (Kong Database)
###############################################

variable "kong_db_user" { default = "kong" } # ojoooo !!!!!!!!!!!!!!!!!!!!!!!!!
variable "kong_db_password" { default = "StrongPassword123!" } # ojoooo !!!!!!!!!!!!!!!!!!!!!!!!!

resource "aws_db_instance" "kong_db" {
  identifier        = "kong-db"
  engine            = "postgres"
  instance_class    = "db.t3.micro"
  allocated_storage = 20

  db_name              = "kong"
  username          = var.kong_db_user
  password          = var.kong_db_password

 # vpc_security_group_ids = [var.security_group_id]
    vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.db_subnets.name

  skip_final_snapshot = true
}

resource "aws_db_subnet_group" "db_subnets" {
  name       = "db-subnet-group"
  subnet_ids = var.subnet_ids
}

###############################################
# Variables IAM Roles
###############################################

variable "ecs_task_role_arn" {
  description = "Task Role ARN"
  type        = string
  default     = "arn:aws:iam::669278498447:role/LabRole"
}

variable "ecs_task_execution_role_arn" {
  description = "Execution Role ARN"
  type        = string
  default     = "arn:aws:iam::669278498447:role/LabRole"
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
  default     = "669278498447" # visto, cuenta de jasmin
}

###############################################
# EC2
###############################################
variable "ecs_ami_id" {
  description = "ECS Optimized Amazon Linux 2 AMI ID (latest)"
  type        = string
  default     = "ami-02f4fd63896659509"
}

resource "aws_launch_template" "ecs_lt" {
  name_prefix   = "ecs-"
    image_id      = var.ecs_ami_id
  instance_type = "t3.micro"
  key_name      = "vockey"

  iam_instance_profile {
    name = "LabInstanceProfile"
  }

  user_data = base64encode(<<EOF
                #!/bin/bash
                echo ECS_CLUSTER=${aws_ecs_cluster.main.name} >> /etc/ecs/ecs.config
                EOF
    )

  //vpc_security_group_ids = [var.security_group_id]
  network_interfaces {
    device_index = 0
    subnet_id = var.subnet_ids[0] # ⚠️ Asignar explícitamente una subnet pública aquí si quieres
    associate_public_ip_address = true
    security_groups = [var.security_group_id]
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "ecs-container-instance"
    }
  }
}

resource "aws_autoscaling_group" "ecs_asg" {
  name                 = "ecs-asg"
  desired_capacity     = 5
  max_size             = 5
  min_size             = 1
  vpc_zone_identifier  = var.subnet_ids

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

# resource "aws_security_group_rule" "allow_all_inbound" {
#   type              = "ingress"
#   from_port         = 0
#   to_port           = 0
#   protocol          = "-1"
#   security_group_id = var.security_group_id
#   cidr_blocks       = ["0.0.0.0/0"]
# }

# resource "aws_security_group_rule" "allow_all_outbound" {
#   type              = "egress"
#   from_port         = 0
#   to_port           = 0
#   protocol          = "-1"
#   security_group_id = var.security_group_id
#   cidr_blocks       = ["0.0.0.0/0"]
# }

resource "aws_security_group" "rds_sg" {
  name        = "rds-sg"
  description = "Security group for Kong PostgreSQL DB"
  vpc_id      = var.vpc_id
}

resource "aws_security_group_rule" "allow_kong_to_rds" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds_sg.id
  source_security_group_id = var.security_group_id  # el de ECS (Kong)
}
