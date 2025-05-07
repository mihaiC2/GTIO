variable "aws_region" {
  default = "us-east-1"
}

###############################################
# Networking (VPC, Subnets, SG)
###############################################
variable "vpc_id" {
  description = "VPC ID"
  type        = string
  default     = "vpc-02b6a00e0a7992c00" # visto - cambiado
}

variable "launch_type" {
  description = "Launch type"
  type        = string
  default     = "EC2"
}

# para verlo
# aws ec2 describe-subnets --query "Subnets[*].{ID:SubnetId, AZ:AvailabilityZone}" --region us-east-1
variable "subnet_ids" {
  description = "Subnet IDs"
  type        = list(string)
  default     = [
    "subnet-00886bfc24068cf25",
    "subnet-06f9963806a225b3f",
    "subnet-06fd0ed8cb7fd4476",
    "subnet-0594bada3fb3fa148",
    "subnet-0d33db4305b91a8fc"
  ]
}

variable "security_group_id" {
  description = "Security Group ID"
  type        = string
  default     = "sg-0dd6ec0d822c28e8a" # ir a ver a la pagina
}

###############################################
# RDS Postgres (Kong Database)
###############################################

variable "kong_db_user" { default = "kong" } # ojoooo !!!!!!!!!!!!!!!!!!!!!!!!!
variable "kong_db_password" { default = "StrongPassword123!" } # ojoooo !!!!!!!!!!!!!!!!!!!!!!!!!

###############################################
# IAM Roles
###############################################

variable "ecs_task_role_arn" {
  description = "Task Role ARN"
  type        = string
  default     = "arn:aws:iam::669278498447:role/LabRole"
}

variable "ecs_task_execution_role_arn" {
  description = "Execution Role ARN"
  type        = string
  default     = "arn:aws:iam::669278498447:role/LabRole"
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
  default     = "669278498447" # visto, cuenta de jasmin
}

###############################################
# EC2
###############################################
variable "ecs_ami_id" {
  description = "ECS Optimized Amazon Linux 2 AMI ID (latest)"
  type        = string
  default     = "ami-02f4fd63896659509"
}

###############################################
# SUPABASE
###############################################
variable "supabase_url" {
  description = "Supabase url"
  type        = string
  default     = "https://vucnrhorxrruxlsaumxo.supabase.co"
}

variable "supabase_key" {
  description = "Supabase key"
  type        = string
  default     = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1Y25yaG9yeHJydXhsc2F1bXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2OTAwMjksImV4cCI6MjA1NjI2NjAyOX0.47UFGmsvsx_w_pJImBU7mexSAJpl8IP_56PmPm5MzVU"
}