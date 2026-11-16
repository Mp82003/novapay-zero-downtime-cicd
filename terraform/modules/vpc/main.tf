
resource "aws_vpc" "novapay_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.environment}-novapay-vpc"
    Environment = var.environment
    Project     = "NovaPay"
  }
}

