###############################################
# Application Load Balancer
###############################################

###### Microservicios ###### 
resource "aws_lb" "micro_albs" {
  for_each           = aws_ecs_task_definition.microservices
  name               = "${each.key}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.security_group_id]
  subnets            = var.subnet_ids
}

resource "aws_lb_target_group" "tg" {
  for_each    = aws_ecs_task_definition.microservices
  name        = "${each.key}-tg"
  port        = local.microservice_ports[each.key]
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path     = "/health"
    protocol = "HTTP"
  }
}

resource "aws_lb_listener" "micro_listener" {
  for_each          = aws_lb.micro_albs
  load_balancer_arn = each.value.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.tg[each.key].arn
  }
}

###### Front ######
resource "aws_lb_target_group" "frontend-alb-tg" {
  name        = "frontend-alb-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path     = "/"
    protocol = "HTTP"
  }
}

resource "aws_lb" "front-alb" {
  name               = "front-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.security_group_id]
  subnets            = var.subnet_ids
}

resource "aws_lb_listener" "front_listener" {
  load_balancer_arn = aws_lb.front-alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend-alb-tg.arn
  }
}

###### Kong ###### 
resource "aws_lb" "alb" {
  name               = "ecs-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.security_group_id]
  subnets            = var.subnet_ids
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.kong.arn
  }
}

resource "aws_lb_target_group" "kong" {
  name        = "kong-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path     = "/"
    protocol = "HTTP"
  }
}
