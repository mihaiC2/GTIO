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
