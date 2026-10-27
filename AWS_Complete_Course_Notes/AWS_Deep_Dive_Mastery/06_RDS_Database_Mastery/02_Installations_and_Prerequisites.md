# Installations and Prerequisites for RDS (Relational Database Service)

Before interacting with RDS (Relational Database Service), you must have your local environment perfectly configured.

## Step 1: Install AWS CLI (Command Line Interface)
The AWS CLI allows you to control multiple AWS services from the command line.

### On Windows:
1. Download the MSI installer from the official AWS website.
2. Run the downloaded file and follow the on-screen instructions.
3. Open PowerShell and verify: `aws --version`

### On Ubuntu/Linux:
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws --version
```

## Step 2: Install Programming Language & SDKs
### Python (Boto3)
1. Install Python 3.10+
2. Install Boto3: `pip install boto3`

### Node.js (AWS SDK for JS)
1. Install Node.js 18+
2. Install SDK: `npm install @aws-sdk/client-rds`

## Step 3: Install Infrastructure as Code (Terraform)
```bash
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```
