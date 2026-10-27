# 21. AWS Advanced CLI Automations and DevOps Scripts for Ubuntu

This guide contains complete, fully operational bash scripts to automate complex AWS operations using the AWS CLI on Ubuntu. It covers comprehensive deployments, tear-downs, and maintenance operations.

## 1. Complete Automated VPC & EKS Cluster Provisioning Script

This script provisions a complete network architecture and creates an EKS Kubernetes cluster using `eksctl` and `aws` CLI.

```bash
#!/bin/bash
# save as create_eks_cluster.sh and run: chmod +x create_eks_cluster.sh && ./create_eks_cluster.sh

CLUSTER_NAME="prod-cluster"
REGION="us-east-1"
NODE_TYPE="t3.medium"
NODE_COUNT=3

echo "Starting deployment of EKS cluster $CLUSTER_NAME in $REGION..."

# Verify AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

# Deploy cluster using eksctl
eksctl create cluster \
  --name $CLUSTER_NAME \
  --region $REGION \
  --nodegroup-name standard-workers \
  --node-type $NODE_TYPE \
  --nodes $NODE_COUNT \
  --nodes-min 1 \
  --nodes-max 5 \
  --managed \
  --with-oidc \
  --alb-ingress-access \
  --full-ecr-access

echo "EKS Cluster provisioned successfully!"

# Update local kubeconfig to interact with the new cluster
aws eks update-kubeconfig --region $REGION --name $CLUSTER_NAME

# Verify connection
kubectl get nodes
```

## 2. Automated S3 Bucket Backup and Sync Script

A production script used in cron jobs to sync a local directory to an S3 bucket with server-side encryption and standard logging.

```bash
#!/bin/bash
# save as s3_backup.sh

LOCAL_DIR="/var/log/myapp/"
BUCKET_NAME="company-production-logs-backup-$(date +%Y)"
REGION="us-east-1"

# 1. Create the bucket if it does not exist
if ! aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo "Creating bucket $BUCKET_NAME..."
    aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$REGION"
    
    # Enable versioning
    aws s3api put-bucket-versioning --bucket "$BUCKET_NAME" --versioning-configuration Status=Enabled
    
    # Block public access
    aws s3api put-public-access-block --bucket "$BUCKET_NAME" \
        --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
fi

# 2. Sync files with SSE-S3 encryption and delete files that no longer exist locally
echo "Starting sync..."
aws s3 sync "$LOCAL_DIR" "s3://$BUCKET_NAME/" --delete --sse AES256

echo "Backup complete at $(date)"
```

## 3. Automated RDS Snapshot and Restore Script

Automate the process of taking a manual snapshot of an RDS instance before running risky database migrations.

```bash
#!/bin/bash
# save as rds_snapshot.sh

DB_INSTANCE="production-db"
SNAPSHOT_ID="${DB_INSTANCE}-snapshot-$(date +%s)"

echo "Creating manual snapshot: $SNAPSHOT_ID for instance: $DB_INSTANCE"

aws rds create-db-snapshot \
    --db-instance-identifier "$DB_INSTANCE" \
    --db-snapshot-identifier "$SNAPSHOT_ID"

echo "Waiting for snapshot to complete..."
aws rds wait db-snapshot-completed --db-snapshot-identifier "$SNAPSHOT_ID"

echo "Snapshot complete!"
```

## 4. Total Complete AWS Resource Cleanup (Nuke Script)

A script to tear down specific tagged resources to stop billing. Use with extreme caution.

```bash
#!/bin/bash
# save as nuke_dev_resources.sh

ENVIRONMENT="dev"
REGION="us-east-1"

echo "WARNING: This will delete resources tagged with Environment=$ENVIRONMENT"

# 1. Delete EC2 Instances
INSTANCE_IDS=$(aws ec2 describe-instances \
    --filters "Name=tag:Environment,Values=$ENVIRONMENT" "Name=instance-state-name,Values=running,stopped" \
    --query "Reservations[].Instances[].InstanceId" \
    --output text --region $REGION)

if [ ! -z "$INSTANCE_IDS" ]; then
    echo "Terminating EC2 instances: $INSTANCE_IDS"
    aws ec2 terminate-instances --instance-ids $INSTANCE_IDS --region $REGION
    aws ec2 wait instance-terminated --instance-ids $INSTANCE_IDS --region $REGION
fi

# 2. Delete Load Balancers
ALB_ARNS=$(aws elbv2 describe-load-balancers --region $REGION --query "LoadBalancers[].LoadBalancerArn" --output text)
for ARN in $ALB_ARNS; do
    TAGS=$(aws elbv2 describe-tags --resource-arns $ARN --region $REGION --query "TagDescriptions[0].Tags")
    if echo $TAGS | grep -q "\"Key\": \"Environment\", \"Value\": \"$ENVIRONMENT\""; then
        echo "Deleting Load Balancer: $ARN"
        aws elbv2 delete-load-balancer --load-balancer-arn $ARN --region $REGION
    fi
done

# 3. Delete ECS Clusters
CLUSTERS=$(aws ecs list-clusters --region $REGION --query "clusterArns[]" --output text)
for CLUSTER in $CLUSTERS; do
    if [[ $CLUSTER == *"$ENVIRONMENT"* ]]; then
        echo "Deleting ECS Cluster: $CLUSTER"
        
        # Stop tasks
        TASKS=$(aws ecs list-tasks --cluster $CLUSTER --region $REGION --query "taskArns[]" --output text)
        for TASK in $TASKS; do
            aws ecs stop-task --cluster $CLUSTER --task $TASK --region $REGION
        done
        
        # Delete services
        SERVICES=$(aws ecs list-services --cluster $CLUSTER --region $REGION --query "serviceArns[]" --output text)
        for SERVICE in $SERVICES; do
            aws ecs update-service --cluster $CLUSTER --service $SERVICE --desired-count 0 --region $REGION > /dev/null
            aws ecs delete-service --cluster $CLUSTER --service $SERVICE --force --region $REGION > /dev/null
        done
        
        # Finally delete cluster
        aws ecs delete-cluster --cluster $CLUSTER --region $REGION
    fi
done

echo "Cleanup phase complete."
```

## 5. Automated Route53 DNS Failover Configuration

Configure health checks and failover routing in Route 53 via CLI.

```bash
#!/bin/bash
# save as configure_route53_failover.sh

DOMAIN="api.example.com"
PRIMARY_IP="1.2.3.4"
SECONDARY_IP="5.6.7.8"
HOSTED_ZONE_ID="Z0123456789ABCDEF"

# 1. Create Health Check for Primary
CALLER_REF=$(uuidgen)
HC_ID=$(aws route53 create-health-check \
    --caller-reference "$CALLER_REF" \
    --health-check-config "IPAddress=$PRIMARY_IP,Port=80,Type=HTTP,ResourcePath=/health,RequestInterval=30,FailureThreshold=3" \
    --query "HealthCheck.Id" --output text)

echo "Created Health Check: $HC_ID"

# 2. Create DNS Records with Failover Routing
cat << EOF > change-batch.json
{
  "Comment": "Setup failover routing",
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "$DOMAIN",
        "Type": "A",
        "SetIdentifier": "Primary",
        "Failover": "PRIMARY",
        "TTL": 60,
        "ResourceRecords": [{ "Value": "$PRIMARY_IP" }],
        "HealthCheckId": "$HC_ID"
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "$DOMAIN",
        "Type": "A",
        "SetIdentifier": "Secondary",
        "Failover": "SECONDARY",
        "TTL": 60,
        "ResourceRecords": [{ "Value": "$SECONDARY_IP" }]
      }
    }
  ]
}
EOF

aws route53 change-resource-record-sets \
    --hosted-zone-id "$HOSTED_ZONE_ID" \
    --change-batch file://change-batch.json

echo "Failover DNS configured successfully."
```

These scripts demonstrate production-grade operations that replace slow manual AWS console usage with fast, reliable, and version-controllable Ubuntu CLI commands.
