# Ubuntu CLI: AWS Environment, SDK, and IaC Setup Guide

This guide provides the complete, step-by-step shell commands to set up, configure, and run AWS CLI commands, Python Boto3 SDK scripts, and Terraform configurations within an Ubuntu Linux terminal (including native Ubuntu servers, VMs, and Windows Subsystem for Linux - WSL).

---

## 1. Install AWS CLI v2 on Ubuntu
To interact with AWS services from the terminal, install the official AWS CLI v2 binary. Do not use `apt install awscli` as it distributes outdated versions.

```bash
# 1. Update Ubuntu packages
sudo apt update && sudo apt upgrade -y

# 2. Install curl and unzip (required for extracting the installer)
sudo apt install curl unzip -y

# 3. Download the AWS CLI v2 installation package
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

# 4. Extract the zip archive
unzip awscliv2.zip

# 5. Run the installer script
sudo ./aws/install

# 6. Verify the installation
aws --version
# Output should show: aws-cli/2.x.x Python/3.x.x Linux/x.x.x...
```

---

## 2. Configure AWS Credentials
To authorize your terminal to communicate with AWS, you must configure your access keys.

```bash
# 1. Start the configuration wizard
aws configure

# 2. Enter your credentials when prompted:
# AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
# AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
# Default region name [None]: us-east-1
# Default output format [None]: json
```

Under the hood, these values are stored inside your home directory:
*   **Credentials File:** `~/.aws/credentials`
*   **Config File:** `~/.aws/config`

To verify that your credentials are authenticated:
```bash
aws sts get-caller-identity
```

---

## 3. Set Up Python & Boto3 Virtual Environment
To write and run Python scripts using the `boto3` SDK, configure a separate virtual environment to avoid dependency conflicts.

```bash
# 1. Install Python3, pip, and virtualenv package managers
sudo apt install python3 python3-pip python3-venv -y

# 2. Navigate to your project directory (or create one)
mkdir -p ~/aws-boto3-projects && cd ~/aws-boto3-projects

# 3. Create a python virtual environment named 'venv'
python3 -m venv venv

# 4. Activate the virtual environment
source venv/bin/activate

# 5. Upgrade pip inside the virtual environment
pip install --upgrade pip

# 6. Install Boto3 and cryptography libraries
pip install boto3 cryptography

# 7. Verify the installation inside Python REPL
python3 -c "import boto3; print('Boto3 Version:', boto3.__version__)"
```

To exit the virtual environment at any time, run:
```bash
deactivate
```

---

## 4. Install Terraform on Ubuntu
To build infrastructure declaratively, install HashiCorp Terraform using the official apt repository.

```bash
# 1. Install GPG and software-properties-common
sudo apt-get install -y gnupg software-properties-common curl

# 2. Install the HashiCorp GPG key
wget -O- https://apt.releases.hashicorp.com/gpg | \
gpg --dearmor | \
sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null

# 3. Add the official HashiCorp repository
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
https://apt.releases.hashicorp.com/ $(lsb_release -cs) main" | \
sudo tee /etc/apt/sources.list.d/hashicorp.list

# 4. Update index and install Terraform
sudo apt update && sudo apt-get install terraform -y

# 5. Verify the installation
terraform --version
```

---

## 5. Complete Step-by-Step Ubuntu CLI Operations

This section details the actual Ubuntu terminal operations to perform complete, production-grade cloud setups.

### A. Network Architecture (Custom VPC, Subnets, Gateways)
Setup a secure, custom virtual network.

```bash
# 1. Create a Custom VPC (10.0.0.0/16)
VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'Vpc.VpcId' --output text)
echo "Created VPC: $VPC_ID"

# 2. Tag the VPC
aws ec2 create-tags --resources $VPC_ID --tags Key=Name,Value=Ubuntu-Prod-VPC

# 3. Create a Public Subnet (10.0.1.0/24) in AZ us-east-1a
PUB_SUBNET_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 --availability-zone us-east-1a --query 'Subnet.SubnetId' --output text)
echo "Public Subnet ID: $PUB_SUBNET_ID"
aws ec2 create-tags --resources $PUB_SUBNET_ID --tags Key=Name,Value=Ubuntu-Public-Subnet

# 4. Create a Private Subnet (10.0.2.0/24) in AZ us-east-1b
PRIV_SUBNET_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 --availability-zone us-east-1b --query 'Subnet.SubnetId' --output text)
echo "Private Subnet ID: $PRIV_SUBNET_ID"
aws ec2 create-tags --resources $PRIV_SUBNET_ID --tags Key=Name,Value=Ubuntu-Private-Subnet

# 5. Create and Attach an Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID
echo "Attached IGW: $IGW_ID to VPC: $VPC_ID"

# 6. Create a Route Table for the Public Subnet
RT_ID=$(aws ec2 create-route-table --vpc-id $VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id $RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID
aws ec2 associate-route-table --subnet-id $PUB_SUBNET_ID --route-table-id $RT_ID
echo "Public Subnet routed to IGW via Route Table: $RT_ID"
```

### B. Firewalls & Instance Deployment (Security Groups, EC2 Web Servers)
Deploy an EC2 node inside our public network.

```bash
# 1. Create a Security Group
SG_ID=$(aws ec2 create-security-group --group-name WebServerSG --description "HTTP & SSH access" --vpc-id $VPC_ID --query 'GroupId' --output text)
echo "Security Group ID: $SG_ID"

# 2. Add Rules: Allow SSH (Port 22) and HTTP (Port 80)
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0

# 3. Create a Key Pair for login (saves private key to file)
aws ec2 create-key-pair --key-name UbuntuProdKey --query 'KeyMaterial' --output text > UbuntuProdKey.pem
chmod 400 UbuntuProdKey.pem
echo "Saved key pair to UbuntuProdKey.pem"

# 4. Launch EC2 instance with bootstrapping script
cat << 'EOF' > userdata.sh
#!/bin/bash
apt update -y
apt install -y nginx
systemctl start nginx
systemctl enable nginx
EOF

INSTANCE_ID=$(aws ec2 run-instances \
    --image-id ami-0c7217cdde317cfec \
    --count 1 \
    --instance-type t2.micro \
    --key-name UbuntuProdKey \
    --security-group-ids $SG_ID \
    --subnet-id $PUB_SUBNET_ID \
    --user-data file://userdata.sh \
    --query 'Instances[0].InstanceId' \
    --output text)
echo "Launched EC2 instance: $INSTANCE_ID"

# 5. Fetch Public IP
PUBLIC_IP=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
echo "Access Nginx at: http://$PUBLIC_IP"
```

### C. Persistent Storage Management (EBS Volumes)
Provision and attach a network block storage device to the instance.

```bash
# 1. Create a 10 GB gp3 volume in AZ us-east-1a (Must match instance AZ)
VOLUME_ID=$(aws ec2 create-volume --size 10 --volume-type gp3 --availability-zone us-east-1a --query 'VolumeId' --output text)
echo "Created EBS Volume: $VOLUME_ID"

# 2. Wait for volume to become available
aws ec2 wait volume-available --volume-ids $VOLUME_ID

# 3. Attach volume to EC2 instance
aws ec2 attach-volume --volume-id $VOLUME_ID --instance-id $INSTANCE_ID --device /dev/sdf
echo "Attached Volume: $VOLUME_ID to Instance: $INSTANCE_ID"
```

### D. Secure Data Storage (Amazon S3 operations)
Set up bucket versioning, lifecycles, and run uploads.

```bash
# 1. Create S3 Bucket (bucket names must be globally unique)
BUCKET_NAME="ubuntu-enterprise-data-vault-$(date +%s)"
aws s3api create-bucket --bucket $BUCKET_NAME --region us-east-1
echo "Created S3 Bucket: $BUCKET_NAME"

# 2. Enable versioning
aws s3api put-bucket-versioning --bucket $BUCKET_NAME --versioning-configuration Status=Enabled

# 3. Upload file with encryption
echo "Secret log data" > security.log
aws s3 cp security.log s3://$BUCKET_NAME/security.log --sse AES256

# 4. Apply Lifecycle policy to move logs to Glacier after 30 days
cat << 'EOF' > lifecycle.json
{
  "Rules": [
    {
      "ID": "ArchiveRule",
      "Status": "Enabled",
      "Filter": {
        "Prefix": ""
      },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
EOF
aws s3api put-bucket-lifecycle-configuration --bucket $BUCKET_NAME --lifecycle-configuration file://lifecycle.json
echo "Lifecycle policy configured."
```

### E. Database Tiers (RDS PostgreSQL Instance)
Create a managed transactional databases block.

```bash
# 1. Create DB Subnet Group (RDS requires at least 2 subnets in different AZs)
# Note: Ensure you have a second subnet created in us-east-1b
SUBNET_B_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.3.0/24 --availability-zone us-east-1b --query 'Subnet.SubnetId' --output text)

aws rds create-db-subnet-group \
    --db-subnet-group-name db-subnets \
    --db-subnet-group-description "Production RDS Subnet Group" \
    --subnet-ids "$PUB_SUBNET_ID" "$SUBNET_B_ID"

# 2. Create PostgreSQL database
aws rds create-db-instance \
    --db-name prod_db \
    --db-instance-identifier pg-instance \
    --allocated-storage 20 \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username postgresdb \
    --master-user-password "SecurePass123!" \
    --db-subnet-group-name db-subnets \
    --no-publicly-accessible

echo "RDS Database Instance initialization started."
```

### F. Serverless Deployments (AWS Lambda & API Gateway)
Create and invoke a Serverless calculator.

```bash
# 1. Write the Lambda function code
cat << 'EOF' > index.py
def handler(event, context):
    return {
        'statusCode': 200,
        'body': 'Hello from Serverless Ubuntu CLI Lambda!'
    }
EOF
zip lambda.zip index.py

# 2. Create Execution Role for Lambda
cat << 'EOF' > trust.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
ROLE_ARN=$(aws iam create-role --role-name LambdaExecRoleCli --assume-role-policy-document file://trust.json --query 'Role.Arn' --output text)
aws iam attach-role-policy --role-name LambdaExecRoleCli --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Wait a few seconds for IAM role replication
sleep 10

# 3. Create Lambda Function
aws lambda create-function \
    --function-name CLI-Processor \
    --zip-file fileb://lambda.zip \
    --handler index.handler \
    --runtime python3.9 \
    --role $ROLE_ARN

# 4. Invoke Lambda function from shell
aws lambda invoke --function-name CLI-Processor response.json
cat response.json
```

---

## 6. Cleanup Operations
To prevent unexpected charges, tear down your deployed resources when done.

```bash
# 1. Terminate EC2
aws ec2 terminate-instances --instance-ids $INSTANCE_ID

# 2. Delete S3 Bucket objects and bucket
aws s3 rm s3://$BUCKET_NAME --recursive
aws s3api delete-bucket --bucket $BUCKET_NAME

# 3. Delete RDS DB instance
aws rds delete-db-instance --db-instance-identifier pg-instance --skip-final-snapshot
```
