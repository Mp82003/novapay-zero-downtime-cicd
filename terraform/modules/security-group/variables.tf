
variable "vpc_id" {
  description = "VPC ID for security group"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "allowed_cidr_blocks" {
  description = "Allowed inbound CIDR blocks"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

