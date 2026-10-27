# 11. AWS Security Suite: KMS, Secrets Manager, WAF, Shield, GuardDuty, and Security Hub

Security is priority zero in AWS. Beyond IAM, AWS provides a robust suite of services to handle encryption, threat detection, web firewalls, and secret storage.

---

## 1. AWS Key Management Service (KMS)
AWS KMS is a managed service that makes it easy to create and control cryptographic keys used to encrypt your data. 

### Core Concepts:
*   **Customer Managed Key (CMK):** Key created and configured by you. You control key policies, rotation, and usage permissions.
*   **AWS Managed Key:** Keys automatically created by AWS services (e.g., `aws/s3`, `aws/rds`). You cannot modify their key policies.
*   **Symmetric vs. Asymmetric:**
    *   *Symmetric:* Single key used to encrypt and decrypt data (default).
    *   *Asymmetric:* Public key to encrypt, private key to decrypt (used for digital signing).
*   **Key Rotation:** Automatic rotation can be enabled (rotates once a year).

### KMS Key Policy (JSON Example)
KMS keys are secured by Key Policies. Without a key policy allowing access, even the root user cannot use the key.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowRootFullAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:root"
      },
      "Action": "kms:*",
      "Resource": "*"
    },
    {
      "Sid": "AllowAppToDecryptOnly",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/AppExecutionRole"
      },
      "Action": [
        "kms:Decrypt",
        "kms:DescribeKey"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 2. AWS Secrets Manager
AWS Secrets Manager allows you to protect database credentials, API keys, and other secrets.

*   **Secrets Manager vs. Parameter Store:**
    *   *Parameter Store (SSM):* Used for basic configuration data. Free for standard parameters. Does not support automatic rotation.
    *   *Secrets Manager:* Paid service. Specifically designed for passwords and keys. Supports **automatic rotation** of secrets using Lambda integration.
*   **Automatic Rotation:** Can automatically rotate credentials (e.g., database passwords) on a schedule without application downtime by updating both the database and the secret.

### Python Code Example: Retrieve Secret from Secrets Manager
```python
import boto3
from botocore.exceptions import ClientError
import json

def get_secret():
    secret_name = "production/database/credentials"
    region_name = "us-east-1"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        raise e

    # Decrypts secret using the associated KMS key
    secret = get_secret_value_response['SecretString']
    return json.loads(secret)

# Usage
db_creds = get_secret()
print(f"Connecting to database at {db_creds['host']} with user {db_creds['username']}")
```

---

## 3. Web Threat Protection: AWS WAF & Shield

To defend your web interfaces from external attacks:

### AWS WAF (Web Application Firewall)
*   **What it does:** Protects web applications from common web exploits that can affect availability, compromise security, or consume excessive resources. It operates at **Layer 7** (Application).
*   **Integrates with:** Application Load Balancer (ALB), Amazon API Gateway, Amazon CloudFront, AWS AppSync.
*   **Rules configuration:**
    *   *SQL Injection (SQLi) protection.*
    *   *Cross-Site Scripting (XSS) protection.*
    *   *IP blocklists / allowlists.*
    *   *Rate Limiting (e.g., block any IP sending more than 200 requests per 5 minutes).*

### AWS Shield (DDoS Protection)
*   **Shield Standard:**
    *   Automatically active for all AWS customers at no extra cost.
    *   Protects against common Layer 3 and Layer 4 DDoS attacks (like SYN floods, UDP reflection).
*   **Shield Advanced:**
    *   Paid subscription service ($3,000/month).
    *   24/7 access to the AWS DDoS Response Team (SRT).
    *   Financial protection: Reimburses you for scaling costs incurred by load balancers or EC2s during a DDoS attack.

---

## 4. Threat Detection & Compliance

To audit and identify security vulnerabilities in your active environments:

### Amazon GuardDuty
*   **What it is:** A threat detection service that continuously monitors your AWS accounts and workloads for malicious activity.
*   **How it works:** Uses machine learning and threat intelligence feeds to scan logs:
    *   *VPC Flow Logs* (detects port scanning, unusual traffic).
    *   *CloudTrail Management & Data Logs* (detects compromised API keys, unauthorized configuration changes).
    *   *DNS Query Logs* (detects EC2 instances communicating with malware servers).
*   **Impact:** Operates out-of-band, meaning it does **not** affect network performance or database latency.

### AWS Security Hub
*   **What it is:** A cloud security posture management service.
*   **Purpose:** Aggregates, organizes, and prioritizes security alerts (findings) from multiple AWS services (GuardDuty, Inspector, Macie, IAM Access Analyzer) into a single console.
*   It checks your environment against compliance standards (like CIS Foundations Benchmark, PCI-DSS).

### Amazon Inspector
*   **What it is:** Automated software vulnerability assessment service.
*   **Scans:**
    *   *EC2 Instances* (looks for missing patch levels, open ports, exposed vulnerabilities).
    *   *ECR Container Images* (scans software packages in container images).
    *   *Lambda functions* (scans code packages for security flaws).

### Amazon Macie
*   **What it is:** A data security and privacy service.
*   **Purpose:** Uses Machine Learning and pattern matching to scan your S3 buckets and identify sensitive data.
*   **Finds:** Personally Identifiable Information (PII) like social security numbers, credit card numbers, passport details, or unencrypted private keys.
