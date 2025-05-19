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

locals {
  microservices = [
    { name = "auth-service", port = 5000 },
    { name = "user-service", port = 5002 },
    { name = "singer-service", port = 5001 },
    { name = "vote-service", port = 5003 }
  ]

  kong_admin_url = "http://${aws_lb.alb.dns_name}:8001"

  microservice_ports = {
    for svc in local.microservices : svc.name => svc.port
  }
}

###############################################
# ECS Cluster
###############################################
resource "aws_ecs_cluster" "main" {
  name = "ecs-cluster"
}

###############################################
# EC2
###############################################
resource "aws_launch_template" "ecs_lt" {
  name_prefix   = "ecs-"
  image_id      = var.ecs_ami_id
  instance_type = "t3.small"
  key_name      = "vockey"

  iam_instance_profile {
    name = "LabInstanceProfile"
  }

  user_data = base64encode(<<EOF
                #!/bin/bash
                echo ECS_CLUSTER=${aws_ecs_cluster.main.name} >> /etc/ecs/ecs.config
                EOF
  )

  network_interfaces {
    device_index                = 0
    subnet_id                   = var.subnet_ids[0]
    associate_public_ip_address = true
    security_groups             = [var.security_group_id]
  }

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "ecs-container-instance"
    }
  }
}
