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
        # { name = "KONG_PG_HOST", value = aws_db_instance.kong_db.address },
        { name = "KONG_PG_USER", value = var.kong_db_user },
        { name = "KONG_PG_PASSWORD", value = var.kong_db_password },
        { name = "KONG_ADMIN_LISTEN", value = "0.0.0.0:8001" },
        { name = "KONG_PROXY_ACCESS_LOG", value = "/dev/stdout" },
        { name = "KONG_ADMIN_ACCESS_LOG", value = "/dev/stdout" },
        { name = "KONG_PROXY_ERROR_LOG", value = "/dev/stderr" },
        { name = "KONG_ADMIN_ERROR_LOG", value = "/dev/stderr" },
        { name = "KONG_LOG_LEVEL", value = "debug" },
        { name = "KONG_PG_LOG_QUERIES", value = "on" },
        # { name = "KONG_PG_SSL", value = "on" },
        # { name = "KONG_PG_SSL_VERIFY", value = "off" }
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
    },
  ])
}

# resource "aws_db_subnet_group" "db_subnets" {
#   name       = "db-subnet-group"
#   subnet_ids = var.subnet_ids
# }

# resource "aws_db_instance" "kong_db" {
#   identifier        = "kong-db"
#   engine            = "postgres"
#   instance_class    = "db.t3.medium"
#   allocated_storage = 20

#   db_name  = "kong"
#   username = var.kong_db_user
#   password = var.kong_db_password

#   publicly_accessible    = true
#   vpc_security_group_ids = [var.security_group_id]
#   db_subnet_group_name   = aws_db_subnet_group.db_subnets.name

#   skip_final_snapshot = true
# }

# resource "aws_ecs_task_definition" "kong-migration" {
#   family                   = "kong-migration"
#   requires_compatibilities = [var.launch_type]
#   network_mode             = "awsvpc"
#   cpu                      = 512
#   memory                   = 512
#   task_role_arn            = var.ecs_task_role_arn
#   execution_role_arn       = var.ecs_task_execution_role_arn

#   runtime_platform {
#     operating_system_family = "LINUX"
#     cpu_architecture        = "X86_64"
#   }

#   container_definitions = jsonencode([
#     {
#       name      = "kong-migration"
#       image     = "kong:3.6"
#       essential = true
#       cpu       = 512
#       memory    = 512
#       command   = ["kong", "migrations", "bootstrap"]

#       environment = [
#         { name = "KONG_DATABASE", value = "postgres" },
#         { name = "KONG_PG_HOST", value = aws_db_instance.kong_db.address },
#         { name = "KONG_PG_USER", value = var.kong_db_user },
#         { name = "KONG_PG_PASSWORD", value = var.kong_db_password },
#         { name = "KONG_PG_SSL", value = "on" },
#         { name = "KONG_PG_SSL_VERIFY", value = "off" },
#         { name = "KONG_LOG_LEVEL", value = "debug" }
#       ]
#       logConfiguration = {
#         logDriver = "awslogs"
#         options = {
#           awslogs-group         = aws_cloudwatch_log_group.kong_lg.name
#           awslogs-region        = var.aws_region
#           awslogs-stream-prefix = "kong-migration"
#         }
#       }
#     }
#   ])
# }

# resource "null_resource" "run_kong_migration" {
#   provisioner "local-exec" {
#     command = <<EOT
# #!/bin/bash
# set -e
# echo "🚀 Ejecutando migración de Kong..."

# TASK_ARN=$(aws ecs run-task \
#   --cluster ${aws_ecs_cluster.main.name} \
#   --launch-type EC2 \
#   --network-configuration "awsvpcConfiguration={subnets=[${join(",", var.subnet_ids)}],securityGroups=["${var.security_group_id}"],assignPublicIp="DISABLED"}" \
#   --task-definition ${aws_ecs_task_definition.kong-migration.arn} \
#   --query 'tasks[0].taskArn' \
#   --output text)

# echo "Esperando a que termine el task: $TASK_ARN"
# aws ecs wait tasks-stopped --cluster ${aws_ecs_cluster.main.name} --tasks $TASK_ARN

# EXIT_CODE=$(aws ecs describe-tasks \
#   --cluster ${aws_ecs_cluster.main.name} \
#   --tasks $TASK_ARN \
#   --query 'tasks[0].containers[0].exitCode' \
#   --output text)

# if [ "$EXIT_CODE" -ne 0 ]; then
#   echo "❌ La migración de Kong falló con código $EXIT_CODE"
#   exit 1
# fi

# echo "✅ Migración de Kong completada con éxito."
# EOT
#   }

#   triggers = {
#     always_run = timestamp()
#   }

#   depends_on = [
#     aws_ecs_task_definition.kong-migration,
#     aws_db_instance.kong_db
#   ]
# }



