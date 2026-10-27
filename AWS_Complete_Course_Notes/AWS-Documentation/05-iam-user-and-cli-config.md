# 🔐 IAM User Creation & AWS CLI Configuration — Complete Guide

## 📚 What You'll Learn

- What IAM is and why it's the cornerstone of AWS security
- Why you should NEVER use the root account for daily work
- IAM key concepts: Users, Groups, Roles, and Policies
- How IAM Policies work (with JSON structure explained line by line)
- The 3 types of IAM Policies (AWS Managed, Customer Managed, Inline)
- Step-by-step: Create an IAM User from the AWS Console
- Step-by-step: Create Access Keys for CLI access
- How to configure AWS CLI with your credentials
- How to use named profiles for multiple accounts/environments
- How to test your CLI configuration
- IAM best practices every cloud engineer should follow
- Understanding ARN (Amazon Resource Name) format
- Differences between IAM Users, Groups, and Roles
- Common IAM errors and how to fix them

---

## 🔑 Prerequisites

| Requirement | Details |
|---|---|
| ✅ AWS Account | Created and activated (see `03-aws-free-tier-account.md`) |
| ✅ Root Account Access | You need root credentials for the initial IAM user setup |
| ✅ AWS CLI Installed | Installed on your Windows PC (see `04-install-aws-cli-windows.md`) |
| ✅ Web Browser | To access the AWS Management Console |

---

## 🤔 What is IAM?

### Simple Explanation

**IAM (Identity and Access Management)** is the AWS service that controls **WHO** can access your AWS account and **WHAT** they can do.

### Real-World Analogy

Think of your AWS account as a **large office building**:

| Concept | Office Building Analogy | AWS IAM |
|---|---|---|
| **Root Account** | Building owner with master key | Full unrestricted access to everything |
| **IAM User** | An employee with an ID badge | A person or application with specific permissions |
| **IAM Group** | A department (e.g., Engineering, HR) | A collection of users who share the same permissions |
| **IAM Role** | A visitor badge with temporary access | Temporary permissions that can be assumed by users, services, or applications |
| **IAM Policy** | The rules on the ID badge (which rooms you can enter) | A JSON document that defines what actions are allowed or denied |

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS ACCOUNT (The Building)                │
│                                                             │
│   👑 ROOT USER (Building Owner)                             │
│   ├── Has ALL keys to ALL rooms                             │
│   └── Should only be used for building-level decisions      │
│                                                             │
│   👤 IAM USER (Employee)                                    │
│   ├── Has a badge for specific rooms                        │
│   └── Can have a login (console) or keys (CLI/API)         │
│                                                             │
│   👥 IAM GROUP (Department)                                 │
│   ├── All members share the same room access                │
│   └── Add/remove members easily                            │
│                                                             │
│   🎭 IAM ROLE (Visitor Badge)                               │
│   ├── Temporary access, anyone can "wear" it               │
│   └── Used by services (EC2, Lambda) to access resources    │
│                                                             │
│   📜 IAM POLICY (Access Rules)                              │
│   ├── Written in JSON format                                │
│   └── Defines Allow/Deny for specific actions               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Why NOT Use the Root Account?

The root account is the **most powerful** account in AWS. Using it for daily work is like using a master key to open every door — if someone steals it, they can do ANYTHING.

### Risks of Using Root Account

| Risk | What Could Happen |
|---|---|
| 🔓 **Full access** | Root can delete ALL resources, close the account, change billing |
| 🎯 **Prime target** | Hackers target root accounts because they have unlimited power |
| 📝 **No audit trail** | Hard to track who did what if everyone uses the same root account |
| 🚫 **Can't restrict** | You cannot limit root account permissions — it ALWAYS has full access |
| 💰 **Financial risk** | Root can change payment methods, subscribe to expensive services |

### What Root Should Be Used For (ONLY)

- Changing the account email address
- Changing the AWS support plan
- Closing the AWS account
- Enabling MFA on the root account
- Creating the FIRST IAM administrator user
- Restoring IAM user permissions (if locked out)
- Viewing certain tax invoices
- Modifying certain billing settings

> 🔑 **Golden Rule:** Create an IAM user with admin permissions → use THAT for everything → lock the root credentials in a safe.

---

## 📖 IAM Key Concepts Explained

### 1. IAM Users

An IAM User represents a **person or application** that interacts with AWS.

| Property | Description |
|---|---|
| **Username** | Unique name within the account (e.g., `john`, `deploy-bot`) |
| **Console Access** | Optional — allows login via browser with password |
| **Programmatic Access** | Optional — Access Key ID + Secret Key for CLI/API/SDK |
| **Permissions** | Determined by attached policies |
| **MFA** | Can enable multi-factor authentication for extra security |

### 2. IAM Groups

An IAM Group is a **collection of IAM Users**. Permissions attached to a group apply to ALL users in that group.

```
👥 Group: "Developers"
├── 👤 alice    → Gets all Developer permissions
├── 👤 bob      → Gets all Developer permissions
└── 👤 charlie  → Gets all Developer permissions

👥 Group: "Admins"
├── 👤 dave     → Gets all Admin permissions
└── 👤 alice    → Gets Developer AND Admin permissions (she's in both groups)
```

**Key facts about groups:**
- A user can belong to **multiple groups**
- Groups CANNOT be nested (no groups inside groups)
- Groups are NOT identity — you can't use a group in a resource policy
- There's a default limit of **300 groups** per account

### 3. IAM Roles

An IAM Role is an **identity with temporary permissions** that can be "assumed" by users, services, or applications.

**Real-world analogy:** A contractor badge at a company. You don't own it permanently — you check it out, use it for a specific purpose, and return it.

| Use Case | Example |
|---|---|
| **EC2 instance needs S3 access** | Attach a role to EC2 that allows reading from S3 |
| **Lambda function needs DynamoDB** | Lambda assumes a role with DynamoDB permissions |
| **Cross-account access** | User in Account A assumes a role in Account B |
| **Federation** | External users (Google, SAML) assume a role to access AWS |

**Key facts about roles:**
- Roles don't have passwords or permanent access keys
- Roles provide **temporary security credentials** (typically 1-12 hours)
- Services like EC2, Lambda, and ECS commonly use roles

### 4. IAM Policies

An IAM Policy is a **JSON document** that defines permissions — what actions are allowed or denied on which resources.

---

## 📜 IAM Policies Explained (JSON Structure)

### Anatomy of an IAM Policy

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowS3ReadAccess",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::my-bucket",
                "arn:aws:s3:::my-bucket/*"
            ],
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": "203.0.113.0/24"
                }
            }
        }
    ]
}
```

### Line-by-Line Explanation

| Field | Value | Meaning |
|---|---|---|
| `Version` | `"2012-10-17"` | The policy language version (always use this date — it's the latest) |
| `Statement` | `[...]` | An array of permission rules (you can have multiple) |
| `Sid` | `"AllowS3ReadAccess"` | Statement ID — a friendly name for this rule (optional) |
| `Effect` | `"Allow"` or `"Deny"` | Whether to ALLOW or DENY the specified actions |
| `Action` | `["s3:GetObject", ...]` | The specific API actions allowed/denied (format: `service:action`) |
| `Resource` | `["arn:aws:s3:::my-bucket"]` | The specific AWS resources this rule applies to (ARN format) |
| `Condition` | `{...}` | Optional conditions that must be true for the rule to apply |

### Policy Examples

#### Example 1: Full Admin Access (Used for Learning)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}
```
> This is the **AdministratorAccess** policy — it allows ALL actions on ALL resources. Use for learning only!

#### Example 2: Read-Only S3 Access

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:GetBucketLocation",
                "s3:ListBucket",
                "s3:ListAllMyBuckets"
            ],
            "Resource": "*"
        }
    ]
}
```

#### Example 3: Allow EC2 Start/Stop Only in a Specific Region

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:StartInstances",
                "ec2:StopInstances"
            ],
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "aws:RequestedRegion": "us-east-1"
                }
            }
        }
    ]
}
```

#### Example 4: Deny Everything Except Read (Explicit Deny)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        },
        {
            "Effect": "Deny",
            "Action": [
                "ec2:TerminateInstances",
                "rds:DeleteDBInstance",
                "s3:DeleteBucket"
            ],
            "Resource": "*"
        }
    ]
}
```
> ⚠️ **Important:** An explicit `Deny` ALWAYS overrides an `Allow`. This is a core IAM rule.

---

## 📋 Types of IAM Policies

| Type | Description | Who Creates It | Can Be Reused? |
|---|---|---|---|
| **AWS Managed** | Pre-built by AWS (e.g., `AdministratorAccess`, `AmazonS3ReadOnlyAccess`) | AWS | ✅ Yes, across all users/groups/roles |
| **Customer Managed** | Created by you for your specific needs | You | ✅ Yes, across all users/groups/roles in your account |
| **Inline** | Embedded directly into a single user, group, or role | You | ❌ No, only for the specific entity it's attached to |

### When to Use Which?

| Scenario | Use This Policy Type |
|---|---|
| Common permissions (read-only, admin, etc.) | **AWS Managed** |
| Custom permissions specific to your organization | **Customer Managed** |
| One-off, highly specific permissions for one entity | **Inline** |

> 💡 **Pro Tip:** Always prefer **AWS Managed** policies first, then **Customer Managed** if you need customization. Avoid **Inline** policies unless absolutely necessary — they're harder to manage and audit.

---

## 🛠️ Step-by-Step: Create an IAM User

### Step 1: Login to AWS Console as Root

1. Go to **[https://console.aws.amazon.com/](https://console.aws.amazon.com/)**
2. Select **"Root user"**
3. Enter your **root email address**
4. Enter your **root password**
5. Click **"Sign in"**

### Step 2: Navigate to IAM Service

1. In the search bar at the top, type **"IAM"**
2. Click on **"IAM"** from the dropdown results
3. You'll land on the **IAM Dashboard**

```
🔍 Search: "IAM"
   ↓
Click: IAM (Manage access to AWS resources)
```

The IAM Dashboard shows a security status summary:

```
┌─────────────────────────────────────────────────────────────┐
│  IAM Dashboard                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Security recommendations:                                  │
│  ⚠️ Root user MFA: Not enabled                             │
│  ⚠️ No IAM users created                                   │
│                                                             │
│  IAM resources:                                             │
│    Users: 0                                                 │
│    User groups: 0                                           │
│    Roles: X (some are created by default)                   │
│    Policies: X                                              │
│    Identity providers: 0                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Step 3: Click Users → Create User

1. In the left sidebar, click **"Users"**
2. Click the **"Create user"** button (top-right)

### Step 4: Set Username

1. Enter a **username**: e.g., `admin-user` or `yourname-admin`
2. Check ✅ **"Provide user access to the AWS Management Console"** (if you want this user to log in via browser too)
3. Select **"I want to create an IAM user"**
4. Choose password option:
   - **"Custom password"** → Type your own password
   - **"Autogenerated password"** → AWS creates one for you
5. Optionally uncheck **"Users must create a new password at next sign-in"** (for personal learning)
6. Click **"Next"**

```
Username: admin-user
Console access: ✅ Enabled
Password: MyIAM@User2025!
```

### Step 5: Set Permissions

You have three options:

| Option | Description | Recommended For |
|---|---|---|
| **Add user to group** | Create or pick an existing group with policies | ✅ Best practice |
| **Copy permissions from existing user** | Clone another user's permissions | Quick duplication |
| **Attach policies directly** | Attach policies directly to the user | Quick setup for learning |

**For Learning (Quick Setup):**

1. Select **"Attach policies directly"**
2. In the search box, type **"AdministratorAccess"**
3. Check ✅ the policy named **"AdministratorAccess"**
   - This grants full access to all AWS services and resources
4. Click **"Next"**

**For Best Practice (Using Groups):**

1. Select **"Add user to group"**
2. Click **"Create group"**
3. Group name: `Administrators`
4. Search for and check ✅ **"AdministratorAccess"**
5. Click **"Create user group"**
6. Make sure the new group is selected
7. Click **"Next"**

> 💡 **Pro Tip:** In real-world scenarios, always use groups. It's much easier to manage permissions when you add/remove users from groups rather than attaching policies to individual users.

### Step 6: Review and Create

1. Review the user details:
   - Username
   - AWS access type
   - Permissions summary
2. Optionally add **tags** (key-value pairs for organization):
   - Key: `Environment`, Value: `Learning`
   - Key: `Team`, Value: `DevOps`
3. Click **"Create user"**

### Step 7: Download Credentials

After the user is created, you'll see a success page.

1. **IMPORTANT:** If console access was enabled, you'll see:
   - Console sign-in URL (save this!)
   - Username
   - Password (if auto-generated)
2. Click **"Download .csv file"** to save the credentials
3. Store this file **securely** — you won't see the password again!

```
Console sign-in URL:
  https://123456789012.signin.aws.amazon.com/console

Username: admin-user
Password: ************ (shown once, download the CSV!)
```

> ⚠️ **CRITICAL:** The console sign-in URL contains your 12-digit account number. Bookmark this URL — IAM users use this URL (not the root user login page) to sign in.

---

## 🔑 Step-by-Step: Create Access Keys for CLI

Access Keys are how the AWS CLI authenticates with your account. Think of them as a username (Access Key ID) and password (Secret Access Key) for the command line.

### Step 1: Go to IAM → Users → Your User

1. Go to the **IAM Console**
2. Click **"Users"** in the left sidebar
3. Click on your **user name** (e.g., `admin-user`)

### Step 2: Go to Security Credentials Tab

1. Click the **"Security credentials"** tab
2. Scroll down to the **"Access keys"** section

### Step 3: Create Access Key

1. Click **"Create access key"**
2. You'll see a page asking about the **use case**

### Step 4: Choose Use Case — CLI

1. Select **"Command Line Interface (CLI)"**
2. Read the recommendation notice (AWS suggests using IAM Identity Center for CLI — but for learning, access keys are fine)
3. Check the **acknowledgment checkbox** at the bottom
4. Click **"Next"**

### Step 5: Set Description Tag (Optional)

1. Enter a description: e.g., `My Windows laptop CLI access`
2. Click **"Create access key"**

### Step 6: Download the .csv File

You'll see your new access key:

```
Access key ID:     AKIAIOSFODNN7EXAMPLE
Secret access key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

1. Click **"Download .csv file"** — **DO THIS NOW!**
2. Store the CSV file in a **secure location**
3. Click **"Done"**

> ⚠️ **CRITICAL WARNING:**
> - The **Secret Access Key** is shown **ONLY ONCE**. If you lose it, you must delete the key and create a new one.
> - **NEVER** share your access keys with anyone
> - **NEVER** commit access keys to Git/GitHub
> - **NEVER** paste access keys in emails or chat messages
> - **NEVER** hard-code access keys in your application code

---

## ⚙️ AWS CLI Configuration

Now let's connect your installed AWS CLI to your AWS account using the access keys you just created.

### The `aws configure` Command

1. Open **PowerShell** or **Command Prompt**
2. Run:

```powershell
aws configure
```

3. You'll be prompted for 4 pieces of information:

```
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]: json
```

| Prompt | What to Enter | Explanation |
|---|---|---|
| **Access Key ID** | `AKIAIOSFODNN7EXAMPLE` | From the CSV file you downloaded |
| **Secret Access Key** | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | From the CSV file you downloaded |
| **Default region** | `us-east-1` | The AWS region closest to you or the one you want to use by default |
| **Default output** | `json` | Output format: `json`, `table`, or `text` |

### Choosing a Default Region

| Region Code | Location | Best For |
|---|---|---|
| `us-east-1` | N. Virginia, USA | Most services available first, popular for learning |
| `us-west-2` | Oregon, USA | Good alternative to us-east-1 |
| `eu-west-1` | Ireland, Europe | Users in Europe |
| `ap-south-1` | Mumbai, India | Users in India |
| `ap-southeast-1` | Singapore | Users in Southeast Asia |
| `ap-northeast-1` | Tokyo, Japan | Users in Japan |

> 💡 **Pro Tip:** For learning, use `us-east-1` — it's the oldest region, has the most services, and most tutorials use it.

### Choosing Output Format

| Format | Description | Best For |
|---|---|---|
| `json` | JavaScript Object Notation (default) | Scripting, programmatic access |
| `table` | Human-readable ASCII table | Reading in terminal |
| `text` | Tab-separated plain text | Piping to other commands |

**Example outputs for `aws sts get-caller-identity`:**

```json
// json format
{
    "UserId": "AIDAEXAMPLEID",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/admin-user"
}
```

```
# table format
-------------------------------------------------------------
|                     GetCallerIdentity                      |
+-----------+-------------------------+----------------------+
|  Account  |          Arn            |       UserId         |
+-----------+-------------------------+----------------------+
| 123456789 | arn:aws:iam::123456789  | AIDAEXAMPLEID        |
+-----------+-------------------------+----------------------+
```

```
# text format
AIDAEXAMPLEID   123456789012    arn:aws:iam::123456789012:user/admin-user
```

### What Happens Behind the Scenes

When you run `aws configure`, it creates two files:

**File 1: `C:\Users\<YourName>\.aws\credentials`**
```ini
[default]
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

**File 2: `C:\Users\<YourName>\.aws\config`**
```ini
[default]
region = us-east-1
output = json
```

You can also edit these files directly with a text editor instead of running `aws configure`.

---

## 👥 AWS CLI Profiles (Named Profiles)

Named profiles let you manage **multiple sets of credentials** — useful if you have different AWS accounts for development, staging, and production.

### Creating a Named Profile

```powershell
aws configure --profile dev
```

```
AWS Access Key ID [None]: AKIADEV123456789
AWS Secret Access Key [None]: DevSecretKey123456789
Default region name [None]: us-west-2
Default output format [None]: json
```

### Using a Named Profile

```powershell
# Use a specific profile for a command
aws s3 ls --profile dev

# Use a specific profile for all commands in this session
$env:AWS_PROFILE = "dev"
aws s3 ls  # Uses 'dev' profile automatically
```

### What the Files Look Like with Multiple Profiles

**`~\.aws\credentials`**
```ini
[default]
aws_access_key_id = AKIADEFAULT123456789
aws_secret_access_key = DefaultSecretKey123456789

[dev]
aws_access_key_id = AKIADEV123456789
aws_secret_access_key = DevSecretKey123456789

[prod]
aws_access_key_id = AKIAPROD123456789
aws_secret_access_key = ProdSecretKey123456789
```

**`~\.aws\config`**
```ini
[default]
region = us-east-1
output = json

[profile dev]
region = us-west-2
output = json

[profile prod]
region = eu-west-1
output = table
```

> ⚠️ **Notice:** In the `credentials` file, profiles are `[dev]`. In the `config` file, profiles are `[profile dev]` (with the word "profile" prefix). This inconsistency is important!

### List All Configured Profiles

```powershell
aws configure list-profiles
```

### View Current Profile Settings

```powershell
# View default profile settings
aws configure list

# View a specific profile's settings
aws configure list --profile dev
```

---

## ✅ Testing CLI Configuration

The most important test command after configuring AWS CLI:

### The `get-caller-identity` Command

```powershell
aws sts get-caller-identity
```

**Expected Output:**

```json
{
    "UserId": "AIDAEXAMPLE12345",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/admin-user"
}
```

| Field | Meaning |
|---|---|
| `UserId` | The unique ID of the IAM user |
| `Account` | Your 12-digit AWS account number |
| `Arn` | The Amazon Resource Name of the authenticated identity |

If you see this output, your CLI is configured correctly! 🎉

### Additional Test Commands

```powershell
# List S3 buckets (should return empty list if you haven't created any)
aws s3 ls

# List IAM users
aws iam list-users

# Describe EC2 instances (should return empty if you haven't launched any)
aws ec2 describe-instances

# List available regions
aws ec2 describe-regions --output table
```

---

## 🏆 IAM Best Practices

These are AWS's official recommendations for IAM security:

### 1. Enable MFA Everywhere

```
✅ Enable MFA on root account (CRITICAL)
✅ Enable MFA on all IAM users with console access
✅ Consider requiring MFA for sensitive API actions
```

### 2. Follow the Principle of Least Privilege

Give users ONLY the permissions they need to do their job — nothing more.

```
❌ Bad:  Give everyone AdministratorAccess
✅ Good: Give developers only EC2 and S3 access
✅ Best: Give developers access only to specific EC2 instances and S3 buckets
```

### 3. Use Groups for Permissions

```
❌ Bad:  Attach policies to individual users
✅ Good: Create groups, attach policies to groups, add users to groups
```

### 4. Rotate Access Keys Regularly

```powershell
# Check the age of your access keys
aws iam list-access-keys --user-name admin-user

# Create a new access key
aws iam create-access-key --user-name admin-user

# Delete the old access key
aws iam delete-access-key --user-name admin-user --access-key-id AKIAOLDKEY
```

### 5. Use Roles Instead of Long-Term Keys

For services (EC2, Lambda, etc.), use IAM Roles instead of embedding access keys.

### 6. Monitor with IAM Access Analyzer

IAM Access Analyzer helps you identify resources shared with external entities.

### 7. Use IAM Conditions for Extra Security

Restrict actions based on IP address, time, MFA status, etc.

### 8. Review IAM Credentials Report

```powershell
# Generate credentials report
aws iam generate-credential-report

# Download credentials report
aws iam get-credential-report --output text --query Content | 
  [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_))
```

### Summary Checklist

```
✅  Don't use root account for daily tasks
✅  Enable MFA on all human users
✅  Use groups to assign permissions
✅  Follow least privilege principle
✅  Rotate access keys every 90 days
✅  Remove unused users and keys
✅  Use roles for EC2/Lambda/services
✅  Enable CloudTrail for auditing
✅  Review credentials report monthly
✅  Use IAM Access Analyzer
```

---

## 🌐 Understanding ARN (Amazon Resource Name)

Every resource in AWS has a unique identifier called an **ARN**. It's like a full address for any AWS resource.

### ARN Format

```
arn:partition:service:region:account-id:resource-type/resource-id
```

### Breaking Down Each Part

| Part | Description | Examples |
|---|---|---|
| `arn` | Always starts with "arn" | Always `arn` |
| `partition` | The AWS partition | `aws` (standard), `aws-cn` (China), `aws-us-gov` (GovCloud) |
| `service` | The AWS service | `s3`, `ec2`, `iam`, `lambda` |
| `region` | The AWS region | `us-east-1`, `eu-west-1` (empty for global services like IAM and S3) |
| `account-id` | Your 12-digit account number | `123456789012` (empty for some S3 resources) |
| `resource-type/resource-id` | The specific resource | `user/admin-user`, `instance/i-1234567890abcdef0` |

### ARN Examples

```
# IAM user
arn:aws:iam::123456789012:user/admin-user

# IAM role
arn:aws:iam::123456789012:role/MyEC2Role

# IAM policy
arn:aws:iam::aws:policy/AdministratorAccess

# S3 bucket
arn:aws:s3:::my-bucket-name

# S3 object
arn:aws:s3:::my-bucket-name/folder/file.txt

# EC2 instance
arn:aws:ec2:us-east-1:123456789012:instance/i-1234567890abcdef0

# Lambda function
arn:aws:lambda:us-east-1:123456789012:function:my-function

# DynamoDB table
arn:aws:dynamodb:us-east-1:123456789012:table/my-table

# RDS database
arn:aws:rds:us-east-1:123456789012:db:my-database
```

> 💡 **Pro Tip:** Notice that IAM ARNs don't have a region (because IAM is a global service), and S3 bucket ARNs don't have a region or account ID (because bucket names are globally unique).

---

## 🔄 IAM Roles vs Users vs Groups — Comparison

| Feature | IAM User | IAM Group | IAM Role |
|---|---|---|---|
| **What it represents** | A person or application | A collection of users | A set of temporary permissions |
| **Has password?** | Yes (optional) | No | No |
| **Has access keys?** | Yes (optional) | No | No (uses temporary credentials) |
| **Has policies?** | Yes | Yes (applied to all members) | Yes |
| **Can log into console?** | Yes | No | No (but can switch roles in console) |
| **Credentials** | Long-term (permanent until rotated) | N/A | Temporary (expire after 1-12 hours) |
| **Best for** | Individual people | Organizing users | Services, cross-account access, federation |
| **Example** | `john-developer` | `Development-Team` | `EC2-S3-Access-Role` |

### When to Use What?

```
📌 Use IAM USER when:
   → A specific person needs AWS access
   → An application needs permanent credentials (last resort)

📌 Use IAM GROUP when:
   → Multiple users need the same permissions
   → You want to manage permissions efficiently

📌 Use IAM ROLE when:
   → An AWS service needs to access another service (EC2 → S3)
   → You need cross-account access
   → You need temporary credentials
   → External users need access (federation/SSO)
```

---

## ❌ Common IAM Errors and Fixes

### Error 1: "An error occurred (AccessDenied) when calling the ... operation"

**Cause:** Your IAM user doesn't have permission for this action.

**Fix:**
1. Check what policy is attached to your user:
```powershell
aws iam list-attached-user-policies --user-name admin-user
```
2. Add the required permission policy
3. If using groups, check group policies:
```powershell
aws iam list-groups-for-user --user-name admin-user
```

### Error 2: "The security token included in the request is invalid"

**Cause:** Your access key is wrong, expired, or deactivated.

**Fix:**
1. Verify your credentials:
```powershell
aws configure list
```
2. Check if the access key is active in the IAM console
3. Re-run `aws configure` with the correct keys

### Error 3: "The security token included in the request is expired"

**Cause:** You're using temporary credentials (STS) that have expired.

**Fix:**
1. Re-assume the role or request new temporary credentials
2. If using SSO: `aws sso login --profile your-profile`

### Error 4: "Unable to locate credentials"

**Cause:** AWS CLI can't find any credentials — no config file, no environment variables, no instance profile.

**Fix:**
1. Run `aws configure` to set up credentials
2. Check if the credentials file exists:
```powershell
Test-Path "$env:USERPROFILE\.aws\credentials"
```
3. If using environment variables, verify they're set:
```powershell
echo $env:AWS_ACCESS_KEY_ID
```

### Error 5: "User: arn:aws:iam::...:user/... is not authorized to perform: iam:CreateUser"

**Cause:** Your user has admin access to some services but not IAM.

**Fix:** Attach the `IAMFullAccess` policy or `AdministratorAccess` policy to your user.

### Error 6: "InvalidClientTokenId: The security token included in the request is invalid"

**Cause:** The Access Key ID itself is wrong (not just the secret key).

**Fix:**
1. Double-check the Access Key ID — make sure there are no extra spaces
2. Verify the key exists in IAM console → Users → Security credentials → Access keys
3. Re-configure with `aws configure`

---

## 📝 Quick Summary

```
┌──────────────────────────────────────────────────────────────────┐
│              IAM & CLI CONFIGURATION SUMMARY                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  IAM = Identity & Access Management                              │
│    👤 Users    → People or apps with long-term credentials       │
│    👥 Groups   → Collections of users sharing permissions        │
│    🎭 Roles    → Temporary credentials for services/federation   │
│    📜 Policies → JSON rules defining Allow/Deny permissions      │
│                                                                  │
│  Policy Types:                                                   │
│    🟢 AWS Managed      → Pre-built by AWS                       │
│    🔵 Customer Managed → Created by you                          │
│    🟡 Inline           → Embedded in a single entity             │
│                                                                  │
│  CLI Setup:                                                      │
│    1. Create IAM User in AWS Console                             │
│    2. Create Access Keys (Security Credentials tab)              │
│    3. Run: aws configure                                         │
│    4. Enter: Access Key, Secret Key, Region, Output Format       │
│    5. Test:  aws sts get-caller-identity                         │
│                                                                  │
│  Golden Rules:                                                   │
│    🔑 Never use root for daily work                              │
│    🔑 Enable MFA on root and all users                           │
│    🔑 Follow least privilege principle                           │
│    🔑 Use groups for permission management                       │
│    🔑 Rotate access keys every 90 days                           │
│    🔑 Never commit keys to Git                                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Interview Questions

### Basic Level

**Q1: What is IAM in AWS?**
> **A:** IAM (Identity and Access Management) is an AWS service that enables you to securely control access to AWS resources. It lets you manage users, groups, roles, and policies to define who can access what in your AWS account. IAM is a global service (not region-specific) and is free to use.

**Q2: What are the four main components of IAM?**
> **A:** (1) **Users** — individual identities (people or applications), (2) **Groups** — collections of users with shared permissions, (3) **Roles** — temporary identities that can be assumed by users or services, and (4) **Policies** — JSON documents that define what actions are allowed or denied on which resources.

**Q3: Why should you not use the root account for everyday tasks?**
> **A:** The root account has unrestricted access to all AWS resources and billing. If compromised, an attacker could delete all resources, change billing information, close the account, or incur massive charges. AWS recommends creating IAM users for daily tasks and using root only for account-level operations like changing the support plan or closing the account.

**Q4: What is the command to configure AWS CLI?**
> **A:** `aws configure` — This prompts for four inputs: Access Key ID, Secret Access Key, Default Region, and Default Output Format. It stores the credentials in `~/.aws/credentials` and settings in `~/.aws/config`.

**Q5: What command verifies your AWS CLI configuration is working?**
> **A:** `aws sts get-caller-identity` — This returns the UserId, Account number, and ARN of the IAM user whose credentials are being used. If it returns successfully, the CLI is properly configured.

### Intermediate Level

**Q6: What is the difference between an IAM User and an IAM Role?**
> **A:** An IAM User has long-term credentials (password and/or access keys) and represents a specific person or application. An IAM Role has no permanent credentials — it provides temporary security credentials that expire. Roles are meant to be "assumed" by users, AWS services (like EC2 or Lambda), or federated users. Use Users for people, Roles for services and cross-account access.

**Q7: What is the Principle of Least Privilege?**
> **A:** It means granting only the minimum permissions necessary for a user, group, or role to perform their required tasks — nothing more. For example, a developer who only needs to deploy to S3 should only get S3 put permissions, not full admin access. This minimizes the potential damage from compromised credentials or mistakes.

**Q8: What is an ARN? Give an example.**
> **A:** ARN stands for Amazon Resource Name — a unique identifier for every AWS resource. Format: `arn:partition:service:region:account-id:resource-type/resource-id`. Example: `arn:aws:iam::123456789012:user/admin-user` identifies an IAM user named "admin-user" in account 123456789012.

**Q9: What are the three types of IAM policies?**
> **A:** (1) **AWS Managed Policies** — pre-built by AWS, reusable across multiple entities (e.g., AdministratorAccess), (2) **Customer Managed Policies** — custom policies created by the account owner, reusable within the account, and (3) **Inline Policies** — policies embedded directly into a single user, group, or role, not reusable.

**Q10: What happens when there is both an Allow and a Deny in IAM policies?**
> **A:** An explicit Deny ALWAYS wins over an Allow. The evaluation order is: (1) If there is an explicit Deny → Access Denied, (2) If there is an explicit Allow (and no Deny) → Access Allowed, (3) If there is no explicit Allow → Access Denied (implicit deny). This is known as the "deny by default" principle.

**Q11: How do named profiles work in AWS CLI?**
> **A:** Named profiles allow you to store multiple sets of credentials and settings in the same CLI installation. You create them with `aws configure --profile <name>` and use them with `--profile <name>` flag or by setting the `AWS_PROFILE` environment variable. Credentials are stored in `~/.aws/credentials` under `[profile-name]` sections, and settings in `~/.aws/config` under `[profile profile-name]` sections.

**Q12: What is the difference between the `credentials` and `config` files?**
> **A:** The `credentials` file (`~/.aws/credentials`) stores sensitive data — Access Key ID and Secret Access Key. The `config` file (`~/.aws/config`) stores non-sensitive settings like default region, output format, and role assumptions. In the credentials file, profile sections are named `[profile-name]`, while in the config file, they use `[profile profile-name]` format (except for `[default]`).

### Advanced Level

**Q13: How does IAM policy evaluation work when a user is in multiple groups with different policies?**
> **A:** When a user has multiple policies (from direct attachment, multiple groups, etc.), AWS evaluates ALL policies together using these rules: (1) By default, all requests are denied (implicit deny), (2) An explicit Allow in any policy overrides the implicit deny, (3) An explicit Deny in ANY policy overrides ALL Allows, (4) The order of evaluation doesn't matter — all applicable policies are combined. So if Group A allows EC2 access and Group B denies EC2 access, the Deny wins.

**Q14: What is the difference between identity-based policies and resource-based policies?**
> **A:** **Identity-based policies** are attached to IAM users, groups, or roles and specify what that identity can do (e.g., "this user can read S3 buckets"). **Resource-based policies** are attached to AWS resources (like S3 buckets or SQS queues) and specify who can access that resource and what they can do (e.g., "anyone from account 123456789012 can read this bucket"). Resource-based policies use a `Principal` element to specify who, while identity-based policies don't need a `Principal` because they're attached to an identity.

**Q15: Explain IAM Roles for cross-account access.**
> **A:** Cross-account access allows a user in Account A to access resources in Account B. The process: (1) Account B creates an IAM Role with a trust policy that allows Account A to assume it, (2) Account B attaches permissions to the role for the specific resources, (3) A user in Account A calls `sts:AssumeRole` to get temporary credentials for the role in Account B, (4) The user uses those temporary credentials to access Account B's resources. This avoids sharing long-term credentials between accounts.

**Q16: What is IAM Identity Center (formerly AWS SSO) and how does it differ from IAM?**
> **A:** IAM Identity Center is a centralized service for managing workforce access to multiple AWS accounts and business applications. Key differences: (1) IAM Identity Center provides SSO (Single Sign-On) across multiple accounts — users log in once, (2) It integrates with external identity providers (Active Directory, Okta, etc.), (3) It uses temporary credentials exclusively (more secure), (4) It's better for organizations with many accounts. Traditional IAM is per-account, while IAM Identity Center works across an entire AWS Organization.

**Q17: How would you design an IAM strategy for a team of 50 developers across multiple projects?**
> **A:** I would: (1) Set up AWS Organizations with separate accounts for dev/staging/prod, (2) Enable IAM Identity Center for SSO across accounts, (3) Create permission sets (predefined roles) for different job functions, (4) Use IAM Groups within each account for additional local permissions, (5) Implement Service Control Policies (SCPs) at the organization level to set guardrails, (6) Follow least privilege — start with minimal permissions and add as needed, (7) Enable CloudTrail for auditing, (8) Use IAM Access Analyzer to identify overly permissive policies, (9) Enforce MFA for all users, (10) Set up automated credential rotation, (11) Tag all IAM resources for cost allocation and management.

---

## ➡️ What's Next?

Now that you have:
- ✅ An AWS account
- ✅ AWS CLI installed
- ✅ An IAM user created
- ✅ CLI configured with credentials

You're ready to start using AWS services! Next steps:
1. **Launch your first EC2 instance** (virtual server)
2. **Create your first S3 bucket** (file storage)
3. **Explore VPC** (networking)

---

> 📌 **Security Reminder:** Treat your AWS access keys like passwords. Never share them, never commit them to version control, and rotate them regularly.

*Last updated: June 2025*
