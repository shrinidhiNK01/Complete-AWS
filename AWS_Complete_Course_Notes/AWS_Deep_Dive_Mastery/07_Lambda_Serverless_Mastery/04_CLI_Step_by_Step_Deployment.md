# Step-by-Step CLI Deployment: AWS Lambda

Doing things via the console is slow. True professionals use the AWS CLI.

## Step 1: Configure AWS CLI Credentials
Open your terminal/command prompt and type:
```bash
aws configure
```
You will be prompted for 4 pieces of information:
1. **AWS Access Key ID:** Paste your Access Key here.
2. **AWS Secret Access Key:** Paste your Secret Key here.
3. **Default region name:** Enter your target region (e.g., `us-west-2`).
4. **Default output format:** Enter `json`.

## Step 2: Verify Connectivity
Run the following command to ensure you are authenticated:
```bash
aws sts get-caller-identity
```
*Expected Output:* A JSON object showing your UserId, Account number, and IAM Arn.

## Step 3: Execute AWS Lambda Commands
Depending on the specific resource for AWS Lambda, the command structure follows this pattern:
`aws <service-name> <action> --parameter1 value1 --parameter2 value2`

*Example (Listing resources):*
```bash
aws aws list-resources # Note: actual command varies by service
```

## Step 4: Automating with Bash Scripts
Create a shell script to deploy multiple resources at once:
```bash
#!/bin/bash
echo "Starting deployment for AWS Lambda..."

# Generic AWS CLI command placeholder
# aws aws create-... 

echo "Deployment completed successfully!"
```
Make the script executable: `chmod +x deploy.sh` and run `./deploy.sh`.
