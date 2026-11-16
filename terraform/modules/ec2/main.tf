
resource "aws_instance" "novapay_ec2" {
  ami           = var.ami_id
  instance_type = var.instance_type
  subnet_id     = var.subnet_id

  vpc_security_group_ids = var.security_group_ids

  tags = {
    Name        = "${var.environment}-novapay-ec2"
    Environment = var.environment
    Project     = "NovaPay"
  }
}

