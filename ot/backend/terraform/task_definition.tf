###############################################
# ECS Task Definitions (Microservices + Kong)
###############################################

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
