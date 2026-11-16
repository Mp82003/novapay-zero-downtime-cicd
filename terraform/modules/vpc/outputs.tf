
output "vpc_id" {
  description = "ID of NovaPay VPC"
  value       = aws_vpc.novapay_vpc.id
}

output "vpc_cidr" {
  description = "CIDR block of NovaPay VPC"
  value       = aws_vpc.novapay_vpc.cidr_block
}

