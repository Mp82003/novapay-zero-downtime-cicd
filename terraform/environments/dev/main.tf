
module "vpc" {
  source = "../../modules/vpc"

  vpc_cidr    = "10.0.0.0/16"
  environment = "dev"
}

output "vpc_id" {
  description = "NovaPay Dev VPC ID"
  value       = module.vpc.vpc_id
}

output "vpc_cidr" {
  description = "NovaPay Dev VPC CIDR"
  value       = module.vpc.vpc_cidr
}

