# AWS CLI Step-By-Step Deployment: ECR, ECS Fargate, ALB, RDS, Secrets, S3, CloudFront

## Phase 1: What Are We Building?

We are deploying Taskflow with AWS CLI commands:

1. ECR repository.
2. Docker image push.
3. Secrets Manager secret.
4. CloudWatch log group.
5. ECS task definition.
6. ECS service.
7. S3 frontend deployment.
8. CloudFront invalidation.

This guide assumes VPC, subnets, security groups, RDS, ALB, and target group already exist from the console guide or Terraform guide.

## Phase 2: Why CLI Deployment Exists

CLI deployment is faster than clicking and easier to automate. CI/CD pipelines use the same operations.

## Phase 3: Variables

Set these variables.

Linux/macOS:

```bash
export AWS_PROFILE=learning-admin
export AWS_REGION=us-east-1
export ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export PROJECT=taskflow
export ENVIRONMENT=dev
export ECR_REPO=taskflow-api
export IMAGE_TAG=1
export CLUSTER_NAME=taskflow-dev-cluster
export SERVICE_NAME=taskflow-dev-api
export TASK_FAMILY=taskflow-dev-api
export LOG_GROUP=/ecs/taskflow-dev-api
export SECRET_NAME=taskflow/dev/api
export CONTAINER_NAME=api
export CONTAINER_PORT=8000
```

Windows PowerShell:

```powershell
$env:AWS_PROFILE="learning-admin"
$env:AWS_REGION="us-east-1"
$env:ACCOUNT_ID=(aws sts get-caller-identity --query Account --output text)
$env:PROJECT="taskflow"
$env:ENVIRONMENT="dev"
$env:ECR_REPO="taskflow-api"
$env:IMAGE_TAG="1"
$env:CLUSTER_NAME="taskflow-dev-cluster"
$env:SERVICE_NAME="taskflow-dev-api"
$env:TASK_FAMILY="taskflow-dev-api"
$env:LOG_GROUP="/ecs/taskflow-dev-api"
$env:SECRET_NAME="taskflow/dev/api"
$env:CONTAINER_NAME="api"
$env:CONTAINER_PORT="8000"
```

Verify:

```bash
aws sts get-caller-identity
```

Expected output:

```json
{
  "Account": "123456789012"
}
```

## Phase 4: Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name taskflow-api \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256 \
  --region us-east-1
```

Purpose:
Creates private container registry for backend images.

Common error:

```text
RepositoryAlreadyExistsException
```

Fix:
Continue. The repository already exists.

## Phase 5: Login To ECR

```bash
aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

Purpose:
Allows Docker to push to ECR.

Expected output:

```text
Login Succeeded
```

## Phase 6: Build And Push Backend Image

From the folder that contains `taskflow`:

```bash
docker build -t taskflow-api:$IMAGE_TAG ./taskflow/backend
docker tag taskflow-api:$IMAGE_TAG $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/taskflow-api:$IMAGE_TAG
docker push $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/taskflow-api:$IMAGE_TAG
```

Purpose:
Builds the backend container and uploads it to AWS.

Expected output:

```text
latest: digest: sha256:...
```

## Phase 7: Create CloudWatch Log Group

```bash
aws logs create-log-group \
  --log-group-name /ecs/taskflow-dev-api \
  --region us-east-1
```

Set retention:

```bash
aws logs put-retention-policy \
  --log-group-name /ecs/taskflow-dev-api \
  --retention-in-days 7 \
  --region us-east-1
```

Common error:

```text
ResourceAlreadyExistsException
```

Fix:
Continue.

## Phase 8: Create Secret

Replace password and endpoint:

```bash
aws secretsmanager create-secret \
  --name taskflow/dev/api \
  --secret-string '{"DATABASE_URL":"postgresql+psycopg://taskflow:YOUR_PASSWORD@taskflow-dev-db.xxxxxx.us-east-1.rds.amazonaws.com:5432/taskflow"}' \
  --region us-east-1
```

Update existing secret:

```bash
aws secretsmanager put-secret-value \
  --secret-id taskflow/dev/api \
  --secret-string '{"DATABASE_URL":"postgresql+psycopg://taskflow:YOUR_PASSWORD@taskflow-dev-db.xxxxxx.us-east-1.rds.amazonaws.com:5432/taskflow"}' \
  --region us-east-1
```

## Phase 9: Create IAM Task Execution Role

Create trust policy `ecs-task-trust.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Command:

```bash
aws iam create-role \
  --role-name taskflow-dev-ecs-task-execution-role \
  --assume-role-policy-document file://ecs-task-trust.json
```

Attach AWS managed policy:

```bash
aws iam attach-role-policy \
  --role-name taskflow-dev-ecs-task-execution-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

Create `read-secret-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "secretsmanager:GetSecretValue",
      "Resource": "arn:aws:secretsmanager:us-east-1:123456789012:secret:taskflow/dev/api-*"
    }
  ]
}
```

Replace account ID, then run:

```bash
aws iam put-role-policy \
  --role-name taskflow-dev-ecs-task-execution-role \
  --policy-name taskflow-dev-read-secret \
  --policy-document file://read-secret-policy.json
```

## Phase 10: Register Task Definition

Create `task-definition.json`:

```json
{
  "family": "taskflow-dev-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::123456789012:role/taskflow-dev-ecs-task-execution-role",
  "containerDefinitions": [
    {
      "name": "api",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/taskflow-api:1",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 8000,
          "hostPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ENVIRONMENT",
          "value": "dev"
        },
        {
          "name": "CORS_ORIGIN",
          "value": "https://CLOUDFRONT_DOMAIN_NAME"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:taskflow/dev/api:DATABASE_URL::"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/taskflow-dev-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 30
      }
    }
  ]
}
```

Replace:

1. Account ID.
2. Image tag.
3. Secret ARN.
4. CloudFront domain.

Register:

```bash
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json \
  --region us-east-1
```

Expected output:

```json
{
  "taskDefinition": {
    "family": "taskflow-dev-api",
    "revision": 1
  }
}
```

## Phase 11: Create ECS Cluster

```bash
aws ecs create-cluster \
  --cluster-name taskflow-dev-cluster \
  --region us-east-1
```

## Phase 12: Create ECS Service

You need:

1. Private subnet IDs.
2. ECS security group ID.
3. Target group ARN.

Get VPC data:

```bash
aws ec2 describe-subnets \
  --filters "Name=tag:Name,Values=*private*" \
  --query "Subnets[*].[SubnetId,Tags]" \
  --output table
```

Create service:

```bash
aws ecs create-service \
  --cluster taskflow-dev-cluster \
  --service-name taskflow-dev-api \
  --task-definition taskflow-dev-api \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-private-1,subnet-private-2],securityGroups=[sg-ecs],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/taskflow-dev-api-tg/abc123,containerName=api,containerPort=8000" \
  --health-check-grace-period-seconds 60 \
  --region us-east-1
```

Check status:

```bash
aws ecs describe-services \
  --cluster taskflow-dev-cluster \
  --services taskflow-dev-api \
  --query "services[0].events[0:5]"
```

## Phase 13: Run Migration Task

Create `migration-overrides.json`:

```json
{
  "containerOverrides": [
    {
      "name": "api",
      "command": ["alembic", "upgrade", "head"]
    }
  ]
}
```

Run:

```bash
aws ecs run-task \
  --cluster taskflow-dev-cluster \
  --launch-type FARGATE \
  --task-definition taskflow-dev-api \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-private-1,subnet-private-2],securityGroups=[sg-ecs],assignPublicIp=DISABLED}" \
  --overrides file://migration-overrides.json \
  --region us-east-1
```

Check stopped task logs:

```bash
aws logs tail /ecs/taskflow-dev-api --since 10m --region us-east-1
```

## Phase 14: Deploy Frontend To S3

Build:

```bash
cd taskflow/frontend
npm install
VITE_API_BASE_URL=https://api.example.com npm run build
```

Create bucket:

```bash
aws s3api create-bucket \
  --bucket taskflow-dev-frontend-123456789012 \
  --region us-east-1
```

Enable encryption:

```bash
aws s3api put-bucket-encryption \
  --bucket taskflow-dev-frontend-123456789012 \
  --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
```

Keep public access blocked:

```bash
aws s3api put-public-access-block \
  --bucket taskflow-dev-frontend-123456789012 \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

Upload:

```bash
aws s3 sync dist s3://taskflow-dev-frontend-123456789012 --delete
```

## Phase 15: Create CloudFront Invalidation

After CloudFront exists:

```bash
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

Purpose:
Forces CloudFront to fetch the latest frontend files.

## Phase 16: Update ECS Service With New Image

New image:

```bash
export IMAGE_TAG=2
docker build -t taskflow-api:$IMAGE_TAG ./taskflow/backend
docker tag taskflow-api:$IMAGE_TAG $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/taskflow-api:$IMAGE_TAG
docker push $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/taskflow-api:$IMAGE_TAG
```

Update task definition JSON image tag from `:1` to `:2`.

Register:

```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

Deploy:

```bash
aws ecs update-service \
  --cluster taskflow-dev-cluster \
  --service taskflow-dev-api \
  --task-definition taskflow-dev-api
```

Wait:

```bash
aws ecs wait services-stable \
  --cluster taskflow-dev-cluster \
  --services taskflow-dev-api
```

## Phase 17: Monitoring Commands

ECS:

```bash
aws ecs describe-services --cluster taskflow-dev-cluster --services taskflow-dev-api
aws ecs list-tasks --cluster taskflow-dev-cluster --service-name taskflow-dev-api
aws ecs describe-tasks --cluster taskflow-dev-cluster --tasks TASK_ARN
```

Logs:

```bash
aws logs tail /ecs/taskflow-dev-api --follow
```

ALB target health:

```bash
aws elbv2 describe-target-health \
  --target-group-arn TARGET_GROUP_ARN
```

## Phase 18: Debugging

Task keeps stopping:

```bash
aws ecs describe-tasks --cluster taskflow-dev-cluster --tasks TASK_ARN \
  --query "tasks[0].stoppedReason"
aws logs tail /ecs/taskflow-dev-api --since 30m
```

Service cannot pull image:

1. Confirm task execution role has ECR permissions through `AmazonECSTaskExecutionRolePolicy`.
2. Confirm image URI exists:

```bash
aws ecr describe-images --repository-name taskflow-api
```

Secret access denied:

1. Confirm secret ARN.
2. Confirm execution role has `secretsmanager:GetSecretValue`.
3. Confirm secret is in same region.

## Phase 19: Cleanup CLI

Use only when you want to delete dev resources:

```bash
aws ecs update-service --cluster taskflow-dev-cluster --service taskflow-dev-api --desired-count 0
aws ecs delete-service --cluster taskflow-dev-cluster --service taskflow-dev-api --force
aws ecs delete-cluster --cluster taskflow-dev-cluster
aws ecr delete-repository --repository-name taskflow-api --force
aws secretsmanager delete-secret --secret-id taskflow/dev/api --force-delete-without-recovery
aws logs delete-log-group --log-group-name /ecs/taskflow-dev-api
```

