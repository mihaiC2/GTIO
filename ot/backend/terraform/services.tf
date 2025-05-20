###############################################
# ECS Services
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
}

resource "aws_ecs_service" "frontend" {
  name            = "nextjs-frontend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = var.launch_type

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend-alb-tg.arn
    container_name   = "nextjs-frontend"
    container_port   = 3000
  }

  network_configuration {
    subnets         = var.subnet_ids
    security_groups = [var.security_group_id]
  }
}

resource "aws_ecs_service" "kong" {
  name            = "kong"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.kong.arn
  desired_count   = 1
  launch_type     = var.launch_type

  ## Consumer Load Balancer
  load_balancer {
    target_group_arn = aws_lb_target_group.kong.arn
    container_name   = "kong"
    container_port   = 8000
  }

  ## Admin Load Balancer
  load_balancer {
    target_group_arn = aws_lb_target_group.kong-admin-tg.arn
    container_name   = "kong"
    container_port   = 8001
  }

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = false
  }

  depends_on = [aws_ecs_service.kong_database]
}

resource "aws_ecs_service" "kong_database" {
  name            = "kong-database"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.kong_database.arn
  desired_count   = 1
  launch_type     = var.launch_type

  deployment_controller {
    type = "ECS"
  }

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = false
  }


  #   service_registries {
  #     registry_arn = aws_service_discovery_service.kong_db_sd.arn
  #   }
}

// CORTADA DE ALAS LEGENDARIA

# resource "aws_service_discovery_private_dns_namespace" "ecs" {
#   name        = "service.local"
#   description = "Private namespace for ECS services"
#   vpc         = var.vpc_id
# }

# resource "aws_service_discovery_service" "kong_db_sd" {
#   name = "kong-db"

#   dns_config {
#     namespace_id = aws_service_discovery_private_dns_namespace.ecs.id

#     dns_records {
#       type = "A"
#       ttl  = 10
#     }

#     routing_policy = "WEIGHTED"
#   }

#   health_check_custom_config {
#     failure_threshold = 1
#   }
# }

resource "aws_ecs_service" "konga" {
  name            = "konga"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.konga.arn
  desired_count   = 1
  launch_type     = var.launch_type

  load_balancer {
    target_group_arn = aws_lb_target_group.konga.arn
    container_name   = "konga"
    container_port   = 1337
  }

  network_configuration {
    subnets          = var.subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = false
  }

  depends_on = [aws_lb_listener.http]
}

