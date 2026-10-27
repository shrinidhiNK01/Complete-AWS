# 03. AWS IAM & Security: Complete Identity and Access Management Guide

AWS Identity and Access Management (IAM) is the most critical service in AWS. It controls **who** (Authentication) is allowed to do **what** (Authorization) to **which resources** in your AWS account. 

IAM is a **global service**, meaning you do not select a region when working with IAM. The settings apply across your entire AWS account globally.

---

## 1. IAM Identities: The Core Pillars

To manage access, IAM uses five types of identities. Let's break them down:

```
+-----------------------------------------------------------------+
|                           IAM GROUPS                            |
|  (Contains IAM Users. Policies attached here apply to all users)|
|                                                                 |
|      [ IAM USER: Alice ]           [ IAM USER: Bob ]            |
|      (Human credentials)           (Human credentials)          |
+-----------------------------------------------------------------+
                                |
                   (Uses IAM Roles to act)
                                |
                                v
                       +-----------------+
                       |    IAM ROLE     | (Assumed by services/users)
                       +-----------------+
                                |
                  (Governed by JSON Policies)
                                |
                                v
                       +-----------------+
                       |   IAM POLICY    | (JSON rules defining access)
                       +-----------------+
```

### 1. IAM Users
*   **What it is:** An identity representing a physical person or an application that needs to interact with AWS.
*   **Credentials:** A user can have two types of credentials:
    1.  **Console Password:** To log into the web-based AWS Management Console.
    2.  **Access Keys (Access Key ID & Secret Access Key):** Used to authenticate CLI commands or API calls in program code. *Never share these keys!*
*   **Best Practice:** Do not create IAM users for long-term API access. Use IAM Roles instead.

### 2. IAM Groups
*   **What it is:** A collection of IAM Users. You cannot log in as a group. Groups are used solely to bundle permissions.
*   **Example:** You create a group called `Developers` and attach a policy allowing code deployment. Then, when a new developer joins, you simply add their IAM user to the `Developers` group. They inherit all permissions automatically.
*   *Note:* Groups cannot contain other groups (no nested groups).

### 3. IAM Roles
*   **What it is:** An identity that does not have permanent credentials (like a password or access keys). Instead, it provides **temporary security credentials** that expire.
*   **How it works:** A user, application, or AWS service (like EC2 or Lambda) "assumes" a role. When they assume a role, AWS generates temporary credentials valid for a short time (e.g., 1 hour).
*   **Common Use Case:** 
    *   *Service Role:* An EC2 instance needs to read configuration files from an S3 bucket. You create an IAM Role with S3 read access, and attach it to the EC2 instance (Instance Profile). The EC2 instance automatically gets temporary keys to read from S3.
    *   *Cross-Account Access:* Allowing a user in Account A to access resources in Account B without creating a new user in Account B.

### 4. Service-Linked Roles
*   **What it is:** A unique type of IAM role that is linked directly to an AWS service.
*   **Purpose:** The service creates and manages this role for you. It contains predefined permissions that the service requires to call other AWS services on your behalf. You cannot delete these roles unless the service itself is cleaned up.

---

## 2. IAM Policies & JSON Structure

All permissions in IAM are defined using **JSON (JavaScript Object Notation) documents** called **Policies**. 

### The Structure of an IAM Policy
An IAM policy contains one or more **Statements**. Each Statement is built of the following keys:
*   **Version:** The policy language version. Always use `"2012-10-17"`.
*   **Sid (Statement ID):** An optional label to describe what this statement does.
*   **Effect:** Either `"Allow"` or `"Deny"`.
*   **Principal:** The account, user, role, or service that is allowed or denied access. (Only used in Resource-based policies like S3 Bucket Policies).
*   **Action:** A list of AWS API calls the policy allows or denies (e.g., `s3:GetObject`, `ec2:StartInstances`).
*   **Resource:** The specific AWS resources the actions apply to, identified by their **ARN (Amazon Resource Name)**.
*   **Condition:** Optional rules that must be met for the policy to take effect (e.g., IP address restrictions, time of day, MFA status).

### Understanding ARNs (Amazon Resource Names)
An ARN uniquely identifies any resource in AWS. The general format is:
`arn:partition:service:region:account-id:resource-id`
*   *S3 Example:* `arn:aws:s3:::my-company-data-bucket` (No region or account-id needed for S3 buckets because bucket names are globally unique).
*   *EC2 Example:* `arn:aws:ec2:us-east-1:123456789012:instance/i-0abcd1234efgh5678`

---

## 3. Complete IAM JSON Policy Examples

Here are production-ready JSON policies to copy, paste, and analyze.

### Example 1: Read and Write Access to a Specific S3 Bucket
This policy allows a user to list the bucket contents, read files, and upload files to `my-secure-bucket-99`, but restricts deleting files.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucketContents",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::my-secure-bucket-99"
      ]
    },
    {
      "Sid": "ReadWriteObjects",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::my-secure-bucket-99/*"
      ]
    }
  ]
}
```

### Example 2: Restrict Access Based on IP Address (Condition)
This policy allows starting and stopping EC2 instances, but *only* if the request comes from the company's office public IP address (`203.0.113.50`).

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EC2ManagementWithIPRestriction",
      "Effect": "Allow",
      "Action": [
        "ec2:StartInstances",
        "ec2:StopInstances"
      ],
      "Resource": "arn:aws:ec2:us-east-1:123456789012:instance/*",
      "Condition": {
        "NotIpAddress": {
          "aws:SourceIp": "203.0.113.50/32"
        }
      }
    }
  ]
}
```
*Note: In this logic, if the request does NOT come from `203.0.113.50`, the Allow statement is bypassed.*

---

## 4. Policy Evaluation Logic (How AWS decides to Allow or Deny)

When a request is made to AWS, the IAM engine evaluates all policies in the account to decide if the request is allowed. 

AWS follows a strict **Evaluation Flow**:

```
[ Request Made ]
       |
       v
+-----------------------------+
|    Is there an EXPLICIT     | -- Yes --> [ DENIED (Stop) ]
|           DENY?             |
+-----------------------------+
       | No
       v
+-----------------------------+
|    Is there an EXPLICIT     | -- Yes --> [ ALLOWED (Stop) ]
|          ALLOW?             |
+-----------------------------+
       | No
       v
[ DEFAULT DENY (Implicit Deny) ] -> [ DENIED ]
```

### The Three Rules of Evaluation:
1.  **Explicit Deny overrides everything:** If a single policy matches the action and has `"Effect": "Deny"`, the request is immediately blocked, even if ten other policies say `"Allow"`.
2.  **Default Deny:** By default, all requests are blocked. If there is no explicit `"Allow"`, the user cannot access the resource.
3.  **Explicit Allow:** If there is no explicit Deny, and there is an explicit `"Allow"`, the request is permitted.

---

## 5. Advanced Security & Access Guardrails

### 1. Permissions Boundaries
*   **What it is:** An advanced feature where you set the **maximum permissions** that an IAM user or role can have.
*   **Use Case:** You want to delegate admin rights to a developer so they can create IAM roles for their applications. However, you don't want them to create a role with `AdministratorAccess` that lets them hack the account. 
*   You apply a Permissions Boundary to their IAM user. Even if they create a role with full admin access, that role can only perform actions allowed by the boundary.

### 2. Service Control Policies (SCPs)
*   Used in **AWS Organizations** to manage permissions across multiple AWS accounts.
*   They set the absolute maximum permissions for all accounts in an Organization. If an SCP denies `s3:DeleteBucket` at the Organization level, even the Root account of a child member account cannot delete an S3 bucket.

### 3. IAM Access Analyzer
*   A tool that monitors your resource policies (like S3 Bucket Policies, KMS Keys, SQS Queues) and alerts you if any of them allow access to external users outside your AWS Organization. This prevents accidental data leaks.

---

## 6. Authentication and MFA (Multi-Factor Authentication)
*   **The Root User:** The single email login that created the AWS account. It has absolute power.
    *   **Rule:** Lock the root user account with a strong password and physical hardware MFA (like a YubiKey). Generate zero access keys for it. Delete it from daily use.
*   **MFA Types:**
    *   *Virtual MFA:* Authenticator apps like Google Authenticator or Authy (installed on a phone).
    *   *FIDO Security Keys:* Hardware USB keys (YubiKey) which are phishing-resistant.
    *   *Hardware Key Fobs:* Physical tokens displaying changing numbers.

---

## 7. AWS IAM Identity Center (Single Sign-On / SSO)
In modern cloud architectures, you should **never** create local IAM users inside each AWS account.
*   **AWS IAM Identity Center** is the recommended successor to AWS Single Sign-On.
*   It lets you connect your corporate directory (Active Directory, Okta, Microsoft Entra ID) to AWS.
*   Users sign into a central portal once and can click to access multiple AWS accounts and applications with temporary, automated permissions.

---

## 8. AWS Cognito: App Authentication for Developers
While IAM is for managing access for employees, developers, and internal services, **AWS Cognito** is for managing logins for **external users/customers** of your web or mobile applications.

*   **Cognito User Pools (CUP):**
    *   A user directory. It handles sign-up, sign-in, password reset, and email verification.
    *   Supports social sign-in (Google, Facebook, Apple) and enterprise SAML/OIDC.
    *   Returns JSON Web Tokens (JWT) upon successful login.
*   **Cognito Identity Pools (Federated Identities):**
    *   Takes tokens from Cognito User Pools (or Google/Facebook) and exchanges them for **temporary AWS credentials**.
    *   Allows your app users to upload files directly to an S3 bucket or write to a DynamoDB table securely.



## 10. Interactive Hands-On Lab: Managing IAM

In this practical lab, we will configure an IAM user, group, and policy using the AWS CLI, Python Boto3 SDK, and Terraform.

### A. AWS CLI v2 Command Line Operations
```bash
# 1. Create a new IAM User
aws iam create-user --user-name production-worker-user

# 2. Create an IAM Group for developers
aws iam create-group --group-name developer-group

# 3. Add the user to the group
aws iam add-user-to-group --user-name production-worker-user --group-name developer-group

# 4. Create an IAM Policy from a local JSON file (policy.json)
# Content of policy.json:
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Action": "s3:ListAllMyBuckets",
#       "Resource": "*"
#     }
#   ]
# }
aws iam create-policy --policy-name S3ListOnlyPolicy --policy-document file://policy.json

# 5. Attach the policy to the group
aws iam attach-group-policy --group-name developer-group --policy-arn arn:aws:iam::123456789012:policy/S3ListOnlyPolicy
```

### B. Python Boto3 SDK Script
```python
import boto3
from botocore.exceptions import ClientError

# Initialize a session using your AWS credentials profile
session = boto3.Session(profile_name='default')
iam_client = session.client('iam')

def create_iam_user_and_attach_policy(username, policy_arn):
    try:
        # Create User
        print(f"Creating IAM User: {username}...")
        response = iam_client.create_user(UserName=username)
        print("User created successfully:", response['User']['Arn'])
        
        # Attach policy
        print(f"Attaching policy {policy_arn} to {username}...")
        iam_client.attach_user_policy(
            UserName=username,
            PolicyArn=policy_arn
        )
        print("Policy attached successfully!")
        
    except ClientError as e:
        print("Error encountered:", e.response['Error']['Message'])

if __name__ == '__main__':
    create_iam_user_and_attach_policy(
        username='boto3-sdk-developer',
        policy_arn='arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess'
    )
```

### C. Terraform IaC Configuration
```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_iam_user" "worker" {
  name = "tf-worker-user"
  path = "/system/"
}

resource "aws_iam_policy" "s3_read" {
  name        = "TF_S3ReadOnly"
  description = "Terraform-managed S3 Read Only Policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["s3:Get*", "s3:List*"]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "attach_s3" {
  user       = aws_iam_user.worker.name
  policy_arn = aws_iam_policy.s3_read.arn
}
```
