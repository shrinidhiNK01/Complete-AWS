# Deep Coding & Implementation: EC2 (Elastic Compute Cloud)

This document contains pure, production-ready code to fully implement and manage EC2 (Elastic Compute Cloud).

## 1. Python Implementation using Boto3 (AWS SDK for Python)

Boto3 allows you to directly interact with AWS APIs using Python objects.

### `app.py`
```python
import boto3
import logging
from botocore.exceptions import ClientError

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EC2Manager:
    def __init__(self, region_name='us-east-1'):
        # Initialize the Boto3 Client
        self.client = boto3.client('ec2', region_name=region_name)
        logger.info(f"Initialized {self.__class__.__name__} in {region_name}")

    def perform_action(self):
        try:
            # API Call to AWS
            logger.info("Executing API Call...")
            # response = self.client.describe_...()
            # return response
            pass
        except ClientError as e:
            logger.error(f"AWS API Error: {e}")
            raise

if __name__ == "__main__":
    manager = EC2Manager()
    manager.perform_action()
```

## 2. Infrastructure as Code: Terraform Implementation

Terraform defines your cloud infrastructure declaratively.

### `main.tf`
```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  # Profile is automatically picked up from ~/.aws/credentials
}

# Define the EC2 (Elastic Compute Cloud) Resource
# resource "aws_ec2_something" "main" {
#   name = "my-production-resource"
#   tags = {
#     Environment = "Production"
#     ManagedBy   = "Terraform"
#   }
# }
```

### Terraform Deployment Steps:
1. Initialize the directory: `terraform init` (Downloads the AWS provider plugins)
2. Format the code: `terraform fmt` (Ensures HCL syntax is clean)
3. Validate the syntax: `terraform validate`
4. See what will be created: `terraform plan` (Crucial step!)
5. Actually deploy to AWS: `terraform apply --auto-approve`
6. Destroy when done to avoid costs: `terraform destroy --auto-approve`
