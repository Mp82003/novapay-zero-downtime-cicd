variable "vpc_cidr" {
  description = "CIDR block for NovaPay VPC"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}
