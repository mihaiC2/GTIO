###############################################
# Kong
###############################################

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
        { name = "KONG_DATABASE", value = "postgres" },
        { name = "KONG_PG_HOST", value = var.kong_db_ip },
        { name = "KONG_PG_USER", value = var.kong_db_user },
        { name = "KONG_PG_PASSWORD", value = var.kong_db_password },
        { name = "KONG_ADMIN_LISTEN", value = "0.0.0.0:8001" },
        { name = "KONG_PROXY_ACCESS_LOG", value = "/dev/stdout" },
        { name = "KONG_ADMIN_ACCESS_LOG", value = "/dev/stdout" },
        { name = "KONG_PROXY_ERROR_LOG", value = "/dev/stderr" },
        { name = "KONG_ADMIN_ERROR_LOG", value = "/dev/stderr" },
        { name = "KONG_LOG_LEVEL", value = "debug" },
        { name = "KONG_PG_LOG_QUERIES", value = "on" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.kong_lg.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "kong"
          mode                  = "non-blocking"
        }
      }
      command = ["/bin/sh", "-c", "kong migrations bootstrap || echo 'migración ya hecha'; kong start"]
    },
  ])
}
