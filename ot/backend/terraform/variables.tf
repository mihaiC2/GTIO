variable "aws_region" {
  default = "us-east-1"
}

###############################################
# Networking (VPC, Subnets, SG)
###############################################
variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "launch_type" {
  description = "Launch type"
  type        = string
  default     = "EC2"
}

# aws ec2 describe-subnets --query "Subnets[*].{ID:SubnetId, AZ:AvailabilityZone}" --region us-east-1
variable "subnet_ids" {
  description = "Subnet IDs"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security Group ID"
  type        = string
}

###############################################
# RDS Postgres (Kong Database)
###############################################

variable "kong_db_user" {
  description = "Kong user name"
  type        = string
}
variable "kong_db_password" {
  description = "Kong user password"
  type        = string
}

###############################################
# IAM Roles
###############################################

variable "ecs_task_role_arn" {
  description = "Task Role ARN"
  type        = string
}

variable "ecs_task_execution_role_arn" {
  description = "Execution Role ARN"
  type        = string
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
}

###############################################
# EC2
###############################################
variable "ecs_ami_id" {
  description = "ECS Optimized Amazon Linux 2 AMI ID (latest)"
  type        = string
}

###############################################
# SUPABASE
###############################################
variable "supabase_url" {
  description = "Supabase url"
  type        = string
}

variable "supabase_key" {
  description = "Supabase key"
  type        = string
}
