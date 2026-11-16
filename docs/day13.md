
# Day 13 — Terraform & Infrastructure as Code

## Objective
Implement reusable Terraform modules and configure
separate Dev, Staging and Production environments.

## Tools
- Terraform v1.16.0
- AWS Provider v5.100.0
- AWS Region: ap-south-1

## Terraform Modules

### 1. VPC Module
- Creates AWS VPC configuration.
- Configurable CIDR block.
- Environment-specific resource tags.
- Exposes VPC ID and CIDR outputs.

### 2. EC2 Module
- Reusable EC2 instance configuration.
- Configurable AMI and instance type.
- Accepts subnet and security group IDs.
- Exposes instance ID and public IP.

### 3. Security Group Module
- Configurable VPC association.
- HTTP and HTTPS ingress rules.
- Configurable allowed CIDR blocks.
- Outbound traffic configuration.

## Environments

| Environment | VPC CIDR |
|---|---|
| Dev | 10.0.0.0/16 |
| Staging | 10.1.0.0/16 |
| Production | 10.2.0.0/16 |

## Terraform Commands

```bash
terraform init
terraform fmt -recursive
terraform validate
terraform plan
```

## Validation Results
- Dev: Init and Validate passed.
- Staging: Init and Validate passed.
- Production: Init and Validate passed.
- Terraform formatting check passed.
- Dev VPC plan generated successfully:
  1 to add, 0 to change, 0 to destroy.

## Security
- Terraform state files excluded from Git.
- Terraform provider directories excluded.
- Sensitive tfvars excluded.
- Kubernetes secrets excluded.
- Terraform lock files retained for version consistency.

## Deployment Status
Terraform configurations were validated and plans
were reviewed. No AWS infrastructure was applied
during this implementation.

## Deliverables
- Reusable VPC module
- Reusable EC2 module
- Reusable Security Group module
- Three environment configurations
- Terraform validation evidence
- Git security configuration

