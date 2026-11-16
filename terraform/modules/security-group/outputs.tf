
output "security_group_id" {
  description = "NovaPay security group ID"
  value       = aws_security_group.novapay_sg.id
}

output "security_group_name" {
  description = "NovaPay security group name"
  value       = aws_security_group.novapay_sg.name
}

