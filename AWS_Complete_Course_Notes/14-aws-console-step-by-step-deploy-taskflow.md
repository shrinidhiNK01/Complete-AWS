# AWS Console Step-By-Step Deployment: Taskflow On S3, CloudFront, ECR, ECS Fargate, ALB, RDS, Secrets Manager

## Phase 1: What Are We Building?

We are deploying Taskflow manually using the AWS Console:

1. VPC networking.
2. RDS PostgreSQL database.
3. Secrets Manager database URL.
4. ECR backend repository.
5. ECS Fargate backend service.
6. Application Load Balancer.
7. S3 private frontend bucket.
8. CloudFront distribution with Origin Access Control.
9. Route 53 and ACM optional custom domains.
10. CloudWatch logs.

## Phase 2: Why Console Deployment Exists?

The console teaches what AWS is actually creating. Terraform and CI/CD are easier to understand after you manually create the resources once.

## Phase 3: Real World Use Case

A startup wants to deploy a production webapp. The frontend must be globally fast. The backend must autoscale. The database must be private. Logs must be visible. Secrets must not be committed.

## Phase 4: Architecture Diagram

```mermaid
flowchart TD
    Browser["Browser"] --> CloudFront["CloudFront"]
    CloudFront --> S3["Private S3 Bucket"]
    Browser --> ALB["Application Load Balancer"]
    ALB --> ECS["ECS Fargate Tasks"]
    ECS --> RDS["RDS PostgreSQL"]
    ECS --> Secrets["Secrets Manager"]
    ECS --> Logs["CloudWatch Logs"]
```

## Phase 5: Prerequisites

You need:

1. AWS account.
2. Admin access.
3. Docker image built locally.
4. AWS CLI for pushing image to ECR.
5. Taskflow source code from `13-aws-taskflow-webapp-complete-source-code.md`.

## Phase 6: Choose AWS Region

Use `us-east-1` for this guide.

Console steps:

1. Open `https://console.aws.amazon.com`.
2. Sign in.
3. In the top-right region selector, choose `N. Virginia us-east-1`.

Why:
CloudFront certificates for custom domains must be in `us-east-1`. Keeping the learning stack in one region reduces confusion.

## Phase 7: Create VPC

Console steps:

1. Open AWS Console.
2. Search `VPC`.
3. Click `VPC`.
4. Click `Create VPC`.
5. Select `VPC and more`.
6. Name tag auto-generation: enter `taskflow-dev`.
7. IPv4 CIDR block: `10.30.0.0/16`.
8. IPv6 CIDR block: `No IPv6 CIDR block`.
9. Tenancy: `Default`.
10. Number of Availability Zones: `2`.
11. Number of public subnets: `2`.
12. Number of private subnets: `2`.
13. NAT gateways: `1 per AZ` for production, `In 1 AZ` for lower-cost dev.
14. VPC endpoints: choose `None` for beginner deployment.
15. DNS options: keep both enabled.
16. Click `Create VPC`.

Expected result:
AWS creates VPC, subnets, route tables, internet gateway, NAT gateway, and routes.

Common issue:
NAT Gateway has hourly cost.

Cost fix:
For short practice sessions, destroy the stack after learning.

## Phase 8: Create Security Groups

### ALB Security Group

1. Open `VPC`.
2. Click `Security groups`.
3. Click `Create security group`.
4. Name: `taskflow-dev-alb-sg`.
5. Description: `Public access to API load balancer`.
6. VPC: select `taskflow-dev-vpc`.
7. Inbound rule:
   - Type: `HTTP`
   - Source: `Anywhere-IPv4`
8. Add another inbound rule:
   - Type: `HTTPS`
   - Source: `Anywhere-IPv4`
9. Outbound: leave default.
10. Click `Create security group`.

### ECS Security Group

1. Click `Create security group`.
2. Name: `taskflow-dev-ecs-sg`.
3. Description: `Allow ALB to reach ECS tasks`.
4. VPC: select `taskflow-dev-vpc`.
5. Inbound rule:
   - Type: `Custom TCP`
   - Port: `8000`
   - Source: select `taskflow-dev-alb-sg`.
6. Outbound: leave default.
7. Click `Create security group`.

### RDS Security Group

1. Click `Create security group`.
2. Name: `taskflow-dev-rds-sg`.
3. Description: `Allow ECS to reach PostgreSQL`.
4. VPC: select `taskflow-dev-vpc`.
5. Inbound rule:
   - Type: `PostgreSQL`
   - Port: `5432`
   - Source: select `taskflow-dev-ecs-sg`.
6. Outbound: leave default.
7. Click `Create security group`.

Why:
Only ALB can reach backend tasks. Only backend tasks can reach the database.

## Phase 9: Create RDS PostgreSQL

Console steps:

1. Search `RDS`.
2. Click `RDS`.
3. Click `Databases`.
4. Click `Create database`.
5. Choose `Standard create`.
6. Engine type: `PostgreSQL`.
7. Templates: `Free tier` for learning if available, otherwise `Dev/Test`.
8. DB instance identifier: `taskflow-dev-db`.
9. Master username: `taskflow`.
10. Credentials management: choose `Self managed`.
11. Master password: enter a strong password and store it in a password manager.
12. DB instance class: choose smallest available burstable class for dev, for example `db.t4g.micro` where available.
13. Storage type: `gp3` or default.
14. Allocated storage: `20 GiB`.
15. Enable storage autoscaling: enabled.
16. VPC: select `taskflow-dev-vpc`.
17. DB subnet group: create or select one using private subnets.
18. Public access: `No`.
19. VPC security group: choose existing `taskflow-dev-rds-sg`.
20. Availability Zone: no preference for dev.
21. Database authentication: `Password authentication`.
22. Initial database name: `taskflow`.
23. Backup retention: `7 days`.
24. Encryption: enabled.
25. Deletion protection: disabled for dev, enabled for production.
26. Click `Create database`.

Expected result:
RDS status becomes `Available` after several minutes.

Write down:

```text
RDS endpoint
Database name: taskflow
Username: taskflow
Password: your password
Port: 5432
```

## Phase 10: Create Secrets Manager Secret

Create database URL:

```text
postgresql+psycopg://taskflow:YOUR_PASSWORD@RDS_ENDPOINT:5432/taskflow
```

Console steps:

1. Search `Secrets Manager`.
2. Click `Secrets Manager`.
3. Click `Store a new secret`.
4. Secret type: `Other type of secret`.
5. Key/value:
   - Key: `DATABASE_URL`
   - Value: paste the database URL.
6. Encryption key: use default AWS managed key for dev.
7. Click `Next`.
8. Secret name: `taskflow/dev/api`.
9. Description: `Taskflow dev API secrets`.
10. Click `Next`.
11. Automatic rotation: disabled for beginner deployment.
12. Click `Next`.
13. Click `Store`.

Why:
ECS can inject secrets into the container without hardcoding them in the image or task definition.

## Phase 11: Create ECR Repository

Console steps:

1. Search `ECR`.
2. Click `Elastic Container Registry`.
3. Click `Repositories`.
4. Click `Create repository`.
5. Visibility: `Private`.
6. Repository name: `taskflow-api`.
7. Tag immutability: enabled for production, disabled for first beginner deploy if you use `latest`.
8. Scan on push: enabled.
9. Encryption: AES-256.
10. Click `Create repository`.

Push image:

1. Open repository `taskflow-api`.
2. Click `View push commands`.
3. Run the login command.
4. Run the build command from `taskflow/backend`.
5. Run the tag command.
6. Run the push command.

Example:

```bash
aws ecr get-login-password --region us-east-1 --profile learning-admin \
  | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

docker build -t taskflow-api ./backend
docker tag taskflow-api:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/taskflow-api:1
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/taskflow-api:1
```

Purpose:
Uploads the backend container image to AWS.

Expected output:

```text
pushed
```

Common error:

```text
no basic auth credentials
```

Fix:
Run the ECR login command again.

## Phase 12: Create CloudWatch Log Group

Console steps:

1. Search `CloudWatch`.
2. Click `CloudWatch`.
3. Click `Logs`.
4. Click `Log groups`.
5. Click `Create log group`.
6. Log group name: `/ecs/taskflow-dev-api`.
7. Retention: `7 days` for dev, `30` or more for production.
8. Click `Create`.

## Phase 13: Create ECS Cluster

Console steps:

1. Search `ECS`.
2. Click `Elastic Container Service`.
3. Click `Clusters`.
4. Click `Create cluster`.
5. Cluster name: `taskflow-dev-cluster`.
6. Infrastructure: select `AWS Fargate`.
7. Monitoring: enable Container Insights for production; optional for dev.
8. Click `Create`.

## Phase 14: Create ECS Task Execution Role Permission For Secrets

Console steps:

1. Search `IAM`.
2. Click `Roles`.
3. Click `Create role`.
4. Trusted entity type: `AWS service`.
5. Service or use case: `Elastic Container Service`.
6. Use case: `Elastic Container Service Task`.
7. Click `Next`.
8. Attach policy: `AmazonECSTaskExecutionRolePolicy`.
9. Click `Next`.
10. Role name: `taskflow-dev-ecs-task-execution-role`.
11. Click `Create role`.
12. Open the role.
13. Click `Add permissions`.
14. Click `Create inline policy`.
15. Choose JSON.
16. Paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:123456789012:secret:taskflow/dev/api-*"
    }
  ]
}
```

17. Replace account ID with your account ID.
18. Click `Next`.
19. Policy name: `taskflow-dev-read-api-secret`.
20. Click `Create policy`.

## Phase 15: Create ECS Task Definition

Console steps:

1. Open `ECS`.
2. Click `Task definitions`.
3. Click `Create new task definition`.
4. Task definition family: `taskflow-dev-api`.
5. Launch type: `AWS Fargate`.
6. Operating system: `Linux/X86_64`.
7. Task size:
   - CPU: `0.25 vCPU`
   - Memory: `0.5 GB`
8. Task execution role: `taskflow-dev-ecs-task-execution-role`.
9. Task role: create a separate role later if app needs AWS API calls; leave blank for now.
10. Container name: `api`.
11. Image URI: paste ECR image URI ending with `:1`.
12. Essential container: yes.
13. Port mappings:
   - Container port: `8000`
   - Protocol: `TCP`
14. Environment variables:
   - `ENVIRONMENT` = `dev`
   - `CORS_ORIGIN` = later CloudFront URL, temporarily `http://localhost:5173`
15. Secrets:
   - Name: `DATABASE_URL`
   - Value from: select `taskflow/dev/api:DATABASE_URL::`
16. Logging:
   - Log driver: `awslogs`
   - Log group: `/ecs/taskflow-dev-api`
   - Region: `us-east-1`
   - Stream prefix: `ecs`
17. Click `Create`.

## Phase 16: Create Target Group

Console steps:

1. Search `EC2`.
2. Click `EC2`.
3. In left menu, click `Target Groups`.
4. Click `Create target group`.
5. Target type: `IP addresses`.
6. Target group name: `taskflow-dev-api-tg`.
7. Protocol: `HTTP`.
8. Port: `8000`.
9. VPC: `taskflow-dev-vpc`.
10. Protocol version: `HTTP1`.
11. Health check path: `/health`.
12. Healthy threshold: `2`.
13. Unhealthy threshold: `3`.
14. Timeout: `5 seconds`.
15. Interval: `30 seconds`.
16. Click `Next`.
17. Do not register targets manually.
18. Click `Create target group`.

## Phase 17: Create Application Load Balancer

Console steps:

1. Open EC2.
2. Click `Load Balancers`.
3. Click `Create load balancer`.
4. Choose `Application Load Balancer`.
5. Click `Create`.
6. Name: `taskflow-dev-alb`.
7. Scheme: `Internet-facing`.
8. IP address type: `IPv4`.
9. VPC: `taskflow-dev-vpc`.
10. Select both public subnets.
11. Security groups: choose `taskflow-dev-alb-sg`.
12. Listener:
   - Protocol: `HTTP`
   - Port: `80`
   - Default action: forward to `taskflow-dev-api-tg`.
13. Click `Create load balancer`.

Expected result:
ALB state becomes `Active`.

Copy DNS name:

```text
taskflow-dev-alb-123.us-east-1.elb.amazonaws.com
```

## Phase 18: Create ECS Service

Console steps:

1. Open ECS.
2. Click `Clusters`.
3. Click `taskflow-dev-cluster`.
4. Click `Services`.
5. Click `Create`.
6. Launch type: `Fargate`.
7. Task definition family: `taskflow-dev-api`.
8. Revision: latest.
9. Service name: `taskflow-dev-api`.
10. Desired tasks: `1` for dev, `2` or more for production.
11. Networking:
    - VPC: `taskflow-dev-vpc`
    - Subnets: select private subnets.
    - Security group: `taskflow-dev-ecs-sg`
    - Public IP: `Off`
12. Load balancing: choose `Application Load Balancer`.
13. Container: `api:8000`.
14. Listener: choose ALB HTTP listener.
15. Target group: `taskflow-dev-api-tg`.
16. Health check grace period: `60 seconds`.
17. Click `Create`.

Verify:

1. Open service.
2. Click `Tasks`.
3. Wait for task status `Running`.
4. Open EC2 Target Groups.
5. Open `taskflow-dev-api-tg`.
6. Click `Targets`.
7. Confirm target is `Healthy`.

Test:

```text
http://ALB_DNS_NAME/health
```

Expected:

```json
{"status":"ok"}
```

## Phase 19: Run Database Migration In ECS

Beginner console path:

1. Open ECS.
2. Open cluster `taskflow-dev-cluster`.
3. Click `Tasks`.
4. Click `Run new task`.
5. Launch type: `Fargate`.
6. Task definition: `taskflow-dev-api`.
7. Cluster: `taskflow-dev-cluster`.
8. VPC: `taskflow-dev-vpc`.
9. Subnets: private subnets.
10. Security group: `taskflow-dev-ecs-sg`.
11. Public IP: disabled.
12. Override container command:

```text
alembic upgrade head
```

13. Click `Create`.
14. Wait until task stops.
15. Open stopped task.
16. Check logs.
17. Confirm migration succeeded.

If the console does not expose command override clearly, use the CLI deployment guide.

## Phase 20: Build Frontend For AWS

Use ALB URL:

```bash
cd taskflow/frontend
npm install
VITE_API_BASE_URL=http://ALB_DNS_NAME npm run build
```

Windows PowerShell:

```powershell
cd taskflow\frontend
npm install
$env:VITE_API_BASE_URL="http://ALB_DNS_NAME"
npm run build
```

## Phase 21: Create S3 Frontend Bucket

Console steps:

1. Search `S3`.
2. Click `S3`.
3. Click `Create bucket`.
4. Bucket name: `taskflow-dev-frontend-123456789012`.
5. Region: `us-east-1`.
6. Object Ownership: `ACLs disabled`.
7. Block Public Access: keep all enabled.
8. Bucket Versioning: enable for production, optional for dev.
9. Default encryption: enable SSE-S3.
10. Click `Create bucket`.

Upload frontend:

1. Open the bucket.
2. Click `Upload`.
3. Click `Add files`.
4. Select all files inside `frontend/dist`.
5. Click `Add folder`.
6. Add folders inside `frontend/dist`, usually `assets`.
7. Click `Upload`.

Important:
Do not disable Block Public Access. CloudFront will access the private bucket through OAC.

## Phase 22: Create CloudFront Distribution With OAC

Console steps:

1. Search `CloudFront`.
2. Click `CloudFront`.
3. Click `Origin access`.
4. Click `Create control setting`.
5. Name: `taskflow-dev-frontend-oac`.
6. Origin type: `S3`.
7. Signing behavior: `Sign requests`.
8. Click `Create`.
9. Click `Distributions`.
10. Click `Create distribution`.
11. Origin domain: choose the S3 bucket, not the website endpoint.
12. Origin access: choose `Origin access control settings`.
13. Origin access control: choose `taskflow-dev-frontend-oac`.
14. Viewer protocol policy: `Redirect HTTP to HTTPS`.
15. Allowed HTTP methods: `GET, HEAD`.
16. Cache policy: `CachingOptimized`.
17. Web Application Firewall: disable for beginner dev, enable for production.
18. Default root object: `index.html`.
19. Click `Create distribution`.

After creation:

1. Open the distribution.
2. Copy distribution ID.
3. Copy distribution domain name.
4. CloudFront will show a banner to update S3 bucket policy.
5. Click `Copy policy`.
6. Open S3 bucket.
7. Click `Permissions`.
8. Click `Bucket policy`.
9. Paste the CloudFront policy.
10. Click `Save changes`.

Test:

```text
https://CLOUDFRONT_DOMAIN_NAME
```

## Phase 23: Fix Backend CORS For CloudFront

After CloudFront URL exists, update ECS task definition:

1. Open ECS.
2. Click `Task definitions`.
3. Open `taskflow-dev-api`.
4. Click `Create new revision`.
5. Edit environment variable:
   - `CORS_ORIGIN` = `https://CLOUDFRONT_DOMAIN_NAME`
6. Click `Create`.
7. Open ECS service.
8. Click `Update service`.
9. Select new task definition revision.
10. Click `Update`.
11. Wait for rollout to finish.

Verify:

1. Open CloudFront URL.
2. Create a task.
3. Refresh page.
4. Confirm task remains.

## Phase 24: Optional Custom Domain With Route 53 And ACM

### Create Certificate

1. Search `Certificate Manager`.
2. Click `AWS Certificate Manager`.
3. Confirm region is `us-east-1`.
4. Click `Request`.
5. Choose `Request a public certificate`.
6. Domain names:
   - `app.example.com`
   - `api.example.com`
7. Validation method: `DNS validation`.
8. Click `Request`.
9. Open certificate.
10. Click `Create records in Route 53`.
11. Click `Create records`.
12. Wait for status `Issued`.

### Add API HTTPS Listener

1. Open EC2 Load Balancers.
2. Open `taskflow-dev-alb`.
3. Click `Listeners`.
4. Click `Add listener`.
5. Protocol: `HTTPS`.
6. Port: `443`.
7. Certificate: choose ACM certificate.
8. Default action: forward to `taskflow-dev-api-tg`.
9. Click `Add`.

### Route 53 Records

1. Search `Route 53`.
2. Click `Hosted zones`.
3. Open your hosted zone.
4. Click `Create record`.
5. Record name: `api`.
6. Record type: `A`.
7. Alias: enabled.
8. Route traffic to: Application Load Balancer.
9. Choose region and ALB.
10. Click `Create records`.
11. Create another record:
    - Name: `app`
    - Alias target: CloudFront distribution.

### Update Frontend Build

```bash
cd frontend
VITE_API_BASE_URL=https://api.example.com npm run build
aws s3 sync dist s3://taskflow-dev-frontend-123456789012 --delete --profile learning-admin
aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID --paths "/*" --profile learning-admin
```

### Update Backend CORS

Set:

```text
CORS_ORIGIN=https://app.example.com
```

Deploy new ECS task definition revision.

## Phase 25: Monitoring

Check ECS:

1. Open ECS.
2. Open cluster.
3. Open service.
4. Click `Tasks`.
5. Confirm tasks are running.
6. Click `Logs`.

Check ALB:

1. Open EC2.
2. Open Target Groups.
3. Open target group.
4. Confirm targets are healthy.

Check RDS:

1. Open RDS.
2. Open database.
3. Check CPU, connections, storage.

## Phase 26: Debugging

### ECS Task Stops

1. Open ECS service.
2. Click stopped task.
3. Read `Stopped reason`.
4. Open `Logs`.

Common causes:

1. Wrong image URI.
2. Missing database secret permission.
3. Wrong database URL.
4. Security group blocks RDS.
5. Migration not run.

### ALB Target Unhealthy

Check:

1. Target group health details.
2. ECS security group allows port 8000 from ALB security group.
3. Container exposes port 8000.
4. `/health` returns 200.

### Frontend Loads But API Fails

Check:

1. Browser DevTools Network tab.
2. API URL.
3. CORS origin.
4. ALB URL or DNS.
5. HTTPS mixed-content issue if frontend uses HTTPS and API uses HTTP.

Fix:
Use HTTPS for API with ACM certificate.

## Phase 27: Production Hardening

1. Use HTTPS only.
2. Enable WAF on CloudFront.
3. Enable ALB access logs.
4. Enable RDS deletion protection.
5. Use Multi-AZ RDS.
6. Desired ECS tasks at least 2.
7. Enable ECS autoscaling.
8. Set CloudWatch alarms.
9. Use private ECS tasks only.
10. Use least privilege IAM.

## Phase 28: Cost Cleanup

Delete in this order when done:

1. CloudFront distribution.
2. S3 bucket objects.
3. S3 bucket.
4. ECS service.
5. ECS cluster.
6. ALB.
7. Target group.
8. NAT Gateway.
9. RDS database.
10. ECR images.
11. ECR repository.
12. Secrets Manager secret.
13. CloudWatch log group.
14. VPC.

