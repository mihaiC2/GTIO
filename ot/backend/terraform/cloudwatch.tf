###############################################
# CloudWatch Logs
###############################################
resource "aws_cloudwatch_log_group" "ecs_lg" {
  name              = "/ecs/microservices_lg"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "kong_lg" {
  name              = "/ecs/kong_lg"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "kong_db" {
  name              = "/ecs/kong-database"
  retention_in_days = 7
}

resource "aws_cloudwatch_dashboard" "ecs_dashboard" {
  dashboard_name = "ECS-Microservices-Dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "Microservice Errors"
          view   = "timeSeries"
          region = var.aws_region
          metrics = [
            ["Custom/Microservices", "MicroserviceErrors"],
          ]
          period = 60
          stat   = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "Kong Errors"
          view   = "timeSeries"
          region = var.aws_region
          metrics = [
            ["Custom/Kong", "KongErrors"],
          ]
          period = 60
          stat   = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          title  = "CPU Utilization by Service"
          view   = "timeSeries"
          region = var.aws_region
          metrics = [
            ["ECS/ContainerInsights", "CPUUtilization", "ServiceName", "auth-service", "ClusterName", aws_ecs_cluster.main.name],
            [".", "CPUUtilization", "ServiceName", "user-service", "ClusterName", aws_ecs_cluster.main.name],
            [".", "CPUUtilization", "ServiceName", "singer-service", "ClusterName", aws_ecs_cluster.main.name],
            [".", "CPUUtilization", "ServiceName", "vote-service", "ClusterName", aws_ecs_cluster.main.name]
          ]
          stat   = "Average"
          period = 60
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          title  = "Memory Utilization by Service"
          view   = "timeSeries"
          region = var.aws_region
          metrics = [
            ["ECS/ContainerInsights", "MemoryUtilization", "ServiceName", "auth-service", "ClusterName", aws_ecs_cluster.main.name],
            [".", "MemoryUtilization", "ServiceName", "user-service", "ClusterName", aws_ecs_cluster.main.name],
            [".", "MemoryUtilization", "ServiceName", "singer-service", "ClusterName", aws_ecs_cluster.main.name],
            [".", "MemoryUtilization", "ServiceName", "vote-service", "ClusterName", aws_ecs_cluster.main.name]
          ]
          stat   = "Average"
          period = 60
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 12
        height = 6
        properties = {
          title  = "Running Tasks Count"
          view   = "timeSeries"
          region = var.aws_region
          metrics = [
            ["ECS/ContainerInsights", "RunningTaskCount", "ServiceName", "auth-service", "ClusterName", aws_ecs_cluster.main.name],
            [".", "RunningTaskCount", "ServiceName", "user-service", "ClusterName", aws_ecs_cluster.main.name],
            [".", "RunningTaskCount", "ServiceName", "singer-service", "ClusterName", aws_ecs_cluster.main.name],
            [".", "RunningTaskCount", "ServiceName", "vote-service", "ClusterName", aws_ecs_cluster.main.name]
          ]
          stat   = "Average"
          period = 60
        }
      }
    ]
  })
}

resource "aws_cloudwatch_log_metric_filter" "microservices_errors" {
  name           = "MicroservicesErrorCount"
  log_group_name = aws_cloudwatch_log_group.ecs_lg.name

  # Busca patrones de error comunes
  pattern = "?ERROR ?Error ?error"

  metric_transformation {
    name      = "MicroserviceErrors"
    namespace = "Custom/Microservices"
    value     = "1"
  }
}

resource "aws_cloudwatch_metric_alarm" "microservices_error_alarm" {
  alarm_name          = "MicroservicesHighErrorRate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = aws_cloudwatch_log_metric_filter.microservices_errors.metric_transformation[0].name
  namespace           = "Custom/Microservices"
  period              = 60
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "Más de 5 errores detectados en los logs de microservicios en 1 minuto"
  alarm_actions       = [] # opcional: SNS, Lambda, etc.
}

