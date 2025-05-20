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
        { name = "MONGODB_URL", value = var.mongodb_url }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_lg.name
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
          awslogs-group         = aws_cloudwatch_log_group.ecs_lg.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "frontend"
        }
      }
    }
  ])
}

resource "aws_ecs_task_definition" "kong_database" {
  family                   = "kong-database"
  network_mode             = "awsvpc"
  requires_compatibilities = ["EC2"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "kong-database"
      image     = "postgres:13"
      essential = true
      environment = [
        { name = "POSTGRES_USER", value = var.kong_db_user },
        { name = "POSTGRES_PASSWORD", value = var.kong_db_password },
        { name = "POSTGRES_DB", value = var.kong_db_name }
      ],
      mountPoints = [],
      portMappings = [
        {
          containerPort = 5432
          hostPort      = 5432
        }
      ],
      healthCheck = {
        command     = ["CMD-SHELL", "pg_isready -U ${var.kong_db_user}"]
        interval    = 10
        timeout     = 5
        retries     = 3
        startPeriod = 10
      },

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.kong_db_lg.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "kong-db"
        }
      }
    }
  ])
  task_role_arn = var.ecs_task_execution_role_arn

}

resource "aws_ecs_task_definition" "konga" {
  family                   = "konga"
  network_mode             = "awsvpc"
  requires_compatibilities = ["EC2"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "konga"
      image     = "pantsel/konga:latest"
      essential = true
      environment = [
        { name = "KONG_ADMIN_URL", value = local.kong_admin_url },
        { name = "KONGA_PORT", value = "1337" }
      ],
      portMappings = [
        {
          containerPort = 1337
          hostPort      = 1337
        }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.konga_lg.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "konga"
        }
      }
    }
  ])
  depends_on    = [aws_lb.alb]
  task_role_arn = var.ecs_task_execution_role_arn
}
