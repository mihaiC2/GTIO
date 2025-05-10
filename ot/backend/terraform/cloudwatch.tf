###############################################
# CloudWatch Logs
###############################################
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/microservices"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "kong" {
  name              = "/ecs/kong"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_metric_filter" "microservices_errors" {
  name           = "MicroservicesErrorCount"
  log_group_name = aws_cloudwatch_log_group.ecs.name

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
      }
    ]
  })
}
