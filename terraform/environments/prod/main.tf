
module "vpc" {
  source = "../../modules/vpc"

  vpc_cidr    = "10.2.0.0/16"
  environment = "prod"
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

