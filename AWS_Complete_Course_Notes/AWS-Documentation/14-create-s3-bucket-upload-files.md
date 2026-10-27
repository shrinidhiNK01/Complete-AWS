# 🪣 Create S3 Bucket & Upload Files — Complete Step-by-Step Guide

---

## 📚 What You'll Learn

- How to create an S3 bucket using the AWS Console (step-by-step with every option explained)
- How to upload, download, and manage files in S3
- How to make S3 objects public (with bucket policies)
- How to use all essential AWS CLI commands for S3
- How to generate Presigned URLs for temporary access
- How to set up S3 Static Website Hosting
- How to configure CORS, Access Logs, Lifecycle Rules, and Versioning
- Common S3 errors and how to fix them
- 15+ interview questions with answers

---

## ✅ Prerequisites

- An AWS account (free tier works perfectly)
- AWS Console access (login at https://console.aws.amazon.com)
- AWS CLI installed and configured (for CLI sections)
- Basic understanding of S3 concepts (covered in **13-what-is-s3.md**)
- A sample file to upload (any text file, image, or PDF)

---

## 1. Create an S3 Bucket (AWS Console) 🖥️

### Step 1: Login to AWS Console

1. Open your browser and go to **https://console.aws.amazon.com**
2. Enter your **Account ID** (or account alias), **Username**, and **Password**
3. Click **Sign in**
4. You should see the AWS Management Console dashboard

### Step 2: Navigate to S3 Service

1. In the top search bar, type **"S3"**
2. Click on **"S3"** under Services
3. You'll see the S3 dashboard showing all your existing buckets (empty if this is your first time)

```
AWS Console Search Bar
┌─────────────────────────────────────────────┐
│  🔍  S3                                     │
├─────────────────────────────────────────────┤
│  Services                                    │
│    📦 S3 - Scalable Storage in the Cloud    │  ← Click this
│  Features                                    │
│    S3 Buckets                               │
│    S3 Access Points                         │
└─────────────────────────────────────────────┘
```

### Step 3: Click 'Create Bucket'

1. On the S3 dashboard, click the orange **"Create bucket"** button
2. This opens the bucket creation wizard with several configuration sections

### Step 4: Enter Bucket Name (Globally Unique)

```
General configuration
┌─────────────────────────────────────────────┐
│  Bucket name:  [my-first-bucket-2025-demo ] │
│                                             │
│  ⚠️ Bucket name must be globally unique     │
│  across ALL AWS accounts worldwide          │
└─────────────────────────────────────────────┘
```

**Rules for bucket names:**
- 3-63 characters
- Only lowercase letters, numbers, and hyphens
- Must start and end with a letter or number
- Cannot look like an IP address (e.g., 192.168.1.1)
- Must be globally unique (no other AWS account can have the same name)

> 💡 **Pro Tip:** Use a naming convention to avoid conflicts. Example: `<your-name>-<project>-<purpose>-<date>` like `john-webapp-uploads-2025`

### Step 5: Choose AWS Region

```
AWS Region
┌─────────────────────────────────────────────┐
│  AWS Region: [US East (N. Virginia) us-east-1 ▼] │
└─────────────────────────────────────────────┘
```

**How to choose a region:**
| Factor | Recommendation |
|--------|---------------|
| User Location | Choose the region closest to your users for lowest latency |
| Compliance | Some regulations require data in specific countries |
| Cost | Pricing varies slightly between regions |
| Service Availability | Not all AWS services are available in every region |

**Common regions:**
- `us-east-1` (N. Virginia) — Most services, cheapest
- `us-west-2` (Oregon) — Good for West Coast US
- `eu-west-1` (Ireland) — Good for Europe
- `ap-south-1` (Mumbai) — Good for India
- `ap-southeast-1` (Singapore) — Good for Southeast Asia

### Step 6: Object Ownership Settings

```
Object Ownership
┌─────────────────────────────────────────────┐
│  ◉ ACLs disabled (recommended)              │
│    Bucket owner enforced - All objects are   │
│    owned by this account. ACLs are disabled. │
│                                             │
│  ○ ACLs enabled                             │
│    Objects can be owned by other accounts    │
└─────────────────────────────────────────────┘
```

**Choose: ACLs disabled (recommended)**

| Option | When to Use |
|--------|-------------|
| ACLs disabled (recommended) | 99% of the time. Modern best practice. Access is controlled via bucket policies and IAM. |
| ACLs enabled | Only when you need other AWS accounts to directly own objects they upload to your bucket (rare legacy use case). |

### Step 7: Block Public Access Settings

This is one of the **most important security settings** in S3.

```
Block Public Access settings for this bucket
┌─────────────────────────────────────────────┐
│  ☑ Block all public access   (RECOMMENDED)  │
│                                             │
│  Individual settings:                        │
│  ☑ Block public access to buckets and       │
│    objects granted through NEW ACLs          │
│  ☑ Block public access to buckets and       │
│    objects granted through ANY ACLs          │
│  ☑ Block public access to buckets and       │
│    objects granted through new public        │
│    bucket or access point policies           │
│  ☑ Block public and cross-account access    │
│    to buckets and objects through any        │
│    public bucket or access point policies    │
└─────────────────────────────────────────────┘
```

**What each option does:**

| Setting | What It Blocks |
|---------|---------------|
| **Block NEW public ACLs** | Prevents anyone from adding new ACLs that make objects public |
| **Block ANY public ACLs** | Ignores ALL existing ACLs that grant public access |
| **Block NEW public bucket policies** | Prevents adding bucket policies that grant public access |
| **Block ANY public bucket/access point policies** | Ignores ANY bucket policy that grants public access |

**Recommendations:**

| Use Case | Setting |
|----------|---------|
| Private data (default) | ✅ Block ALL public access |
| Static website hosting | ❌ Uncheck all blocks (then use bucket policy) |
| Specific public objects | ❌ Uncheck, but carefully craft bucket policy |

> ⚠️ **Warning:** Only disable Block Public Access when you intentionally want to make content public (like hosting a website). Accidental public access is one of the most common S3 security issues!

### Step 8: Bucket Versioning

```
Bucket Versioning
┌─────────────────────────────────────────────┐
│  ○ Disable  (default)                       │
│  ◉ Enable                                   │
└─────────────────────────────────────────────┘
```

| Option | When to Use |
|--------|-------------|
| Disable | Testing, temporary data, when you don't need file history |
| Enable | Production data, important documents, when you need rollback capability |

> 💡 **Pro Tip:** Always enable versioning for production buckets. It protects against accidental deletions and overwrites.

### Step 9: Tags

Tags are key-value pairs for organizing and tracking costs.

```
Tags (optional)
┌─────────────────────────────────────────────┐
│  Key: [Environment]  Value: [Production]    │
│  Key: [Project]      Value: [WebApp]        │
│  Key: [Team]         Value: [Engineering]   │
└─────────────────────────────────────────────┘
```

**Common tags:**

| Key | Example Values |
|-----|---------------|
| Environment | Production, Staging, Development |
| Project | WebApp, DataPipeline, Marketing |
| Owner | john@company.com |
| CostCenter | CC-1234 |

### Step 10: Default Encryption

```
Default encryption
┌─────────────────────────────────────────────┐
│  Encryption type:                            │
│  ◉ Server-side encryption with Amazon S3    │
│    managed keys (SSE-S3)                     │
│  ○ Server-side encryption with AWS KMS      │
│    keys (SSE-KMS)                            │
│                                             │
│  Bucket Key: ◉ Enable  ○ Disable            │
└─────────────────────────────────────────────┘
```

| Encryption Type | When to Use |
|----------------|-------------|
| SSE-S3 (default) | Most use cases. Simple, free, automatic. |
| SSE-KMS | When you need audit trail (CloudTrail logs), key rotation control, or cross-account key sharing. |

> 💡 **Note:** Since January 2023, ALL new S3 buckets have SSE-S3 encryption enabled by default. You cannot create an unencrypted bucket.

### Step 11: Review and Create

1. Scroll down and review all your settings
2. Click the orange **"Create bucket"** button
3. You should see a green success banner: **"Successfully created bucket"**
4. Your new bucket now appears in the S3 bucket list

```
✅ Successfully created bucket "my-first-bucket-2025-demo"
```

---

## 2. Upload Files to S3 📤

### Step 1: Open Your Bucket

1. On the S3 dashboard, click on your bucket name
2. You'll see an empty bucket with the **Objects** tab selected

### Step 2: Click Upload

1. Click the orange **"Upload"** button
2. This opens the upload wizard

### Step 3: Add Files or Folders

```
Upload
┌─────────────────────────────────────────────┐
│                                             │
│    🔼 Drag and drop files and folders here  │
│                                             │
│    [Add files]  [Add folder]                │
│                                             │
│    Files:                                    │
│    📄 my-document.pdf      (2.3 MB)         │
│    🖼️ profile-photo.jpg    (456 KB)         │
│    📝 notes.txt            (12 KB)          │
└─────────────────────────────────────────────┘
```

**Options:**
- **Add files** — Select individual files from your computer
- **Add folder** — Upload an entire folder (preserves folder structure)
- **Drag and drop** — Drag files from your file explorer directly into the browser

### Step 4: Set Permissions (Optional)

Under the **Permissions** section, you can set:
- **Predefined ACLs** (if ACLs are enabled on the bucket)
- By default, objects inherit the bucket's permissions

### Step 5: Set Storage Class

```
Properties
┌─────────────────────────────────────────────┐
│  Storage class:                              │
│  ◉ Standard                                 │
│  ○ Intelligent-Tiering                      │
│  ○ Standard-IA                              │
│  ○ One Zone-IA                              │
│  ○ Glacier Instant Retrieval                │
│  ○ Glacier Flexible Retrieval               │
│  ○ Glacier Deep Archive                     │
└─────────────────────────────────────────────┘
```

Choose **Standard** for most use cases. Only change this if you know the data will be infrequently accessed.

### Step 6: Upload

1. Click the orange **"Upload"** button at the bottom
2. Wait for the upload to complete
3. You should see a green success banner

```
Upload: status
┌─────────────────────────────────────────────┐
│  ✅ Upload succeeded                        │
│                                             │
│  Files uploaded:                             │
│  📄 my-document.pdf      ✅ Succeeded       │
│  🖼️ profile-photo.jpg    ✅ Succeeded       │
│  📝 notes.txt            ✅ Succeeded       │
└─────────────────────────────────────────────┘
```

4. Click **"Close"** to return to the bucket view
5. You should now see your files listed in the bucket

---

## 3. Making Objects Public 🌍

By default, all S3 objects are **private**. Here's how to make them publicly accessible.

### Step 1: Disable 'Block Public Access' on Bucket

1. Go to your bucket → **Permissions** tab
2. Under **Block public access (bucket settings)**, click **Edit**
3. **Uncheck** "Block all public access"
4. Click **Save changes**
5. Type **"confirm"** in the confirmation dialog
6. Click **Confirm**

```
⚠️ Warning: Public access granted
You've turned off Block Public Access. Objects in this bucket
can be made publicly accessible.
```

### Step 2: Add a Bucket Policy

1. Still on the **Permissions** tab, scroll down to **Bucket policy**
2. Click **Edit**
3. Paste the following JSON policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME-HERE/*"
        }
    ]
}
```

4. **Replace** `YOUR-BUCKET-NAME-HERE` with your actual bucket name
5. Click **Save changes**

**What this policy does (line by line):**

| Line | Meaning |
|------|---------|
| `"Version": "2012-10-17"` | Policy language version (always use this date) |
| `"Sid": "PublicReadGetObject"` | A friendly name for this policy statement |
| `"Effect": "Allow"` | Allow the action (not deny) |
| `"Principal": "*"` | Anyone in the world |
| `"Action": "s3:GetObject"` | Can download/view objects |
| `"Resource": "arn:aws:s3:::bucket-name/*"` | Applies to all objects in this bucket |

### Step 3: Access Object via URL

Now any object in your bucket is publicly accessible via its URL:

```
https://YOUR-BUCKET-NAME.s3.REGION.amazonaws.com/OBJECT-KEY

Example:
https://my-first-bucket-2025-demo.s3.us-east-1.amazonaws.com/profile-photo.jpg
```

---

## 4. S3 Object URL Format Explained 🔗

S3 objects can be accessed via different URL formats:

| Format | URL Pattern | Example |
|--------|-------------|---------|
| **Path-style** (legacy) | `https://s3.region.amazonaws.com/bucket/key` | `https://s3.us-east-1.amazonaws.com/my-bucket/photo.jpg` |
| **Virtual-hosted-style** (recommended) | `https://bucket.s3.region.amazonaws.com/key` | `https://my-bucket.s3.us-east-1.amazonaws.com/photo.jpg` |
| **S3 URI** (for AWS CLI/SDK) | `s3://bucket/key` | `s3://my-bucket/photo.jpg` |
| **Website endpoint** | `http://bucket.s3-website-region.amazonaws.com/key` | `http://my-bucket.s3-website-us-east-1.amazonaws.com/index.html` |
| **ARN** (for policies) | `arn:aws:s3:::bucket/key` | `arn:aws:s3:::my-bucket/photo.jpg` |

> ⚠️ **Important:** Path-style URLs are being deprecated by AWS. Always use virtual-hosted-style URLs for new applications.

---

## 5. S3 Operations Using AWS CLI 💻

The AWS CLI is a powerful way to manage S3 from the command line. Here are all the essential commands:

### Prerequisites

```bash
# Install AWS CLI (if not already installed)
# Download from: https://aws.amazon.com/cli/

# Verify installation
aws --version

# Configure credentials
aws configure
# Enter:
#   AWS Access Key ID: YOUR_ACCESS_KEY
#   AWS Secret Access Key: YOUR_SECRET_KEY
#   Default region name: us-east-1
#   Default output format: json
```

### 5.1 Create a Bucket

```bash
# Create a new S3 bucket
aws s3 mb s3://my-cli-bucket-2025-demo

# What it does:
# mb = "make bucket"
# Creates a new bucket named "my-cli-bucket-2025-demo" in your default region

# Create a bucket in a specific region
aws s3 mb s3://my-cli-bucket-eu --region eu-west-1
```

**Output:**
```
make_bucket: my-cli-bucket-2025-demo
```

### 5.2 List All Buckets

```bash
# List all your S3 buckets
aws s3 ls

# What it does: Shows all buckets in your AWS account with creation dates
```

**Output:**
```
2025-01-15 10:30:00 my-cli-bucket-2025-demo
2025-01-10 08:15:00 my-website-bucket
2024-12-20 14:45:00 company-backups
```

### 5.3 List Objects in a Bucket

```bash
# List objects in a specific bucket
aws s3 ls s3://my-cli-bucket-2025-demo

# List objects with a specific prefix (folder)
aws s3 ls s3://my-cli-bucket-2025-demo/images/

# List ALL objects recursively (including subfolders)
aws s3 ls s3://my-cli-bucket-2025-demo --recursive

# List with human-readable file sizes
aws s3 ls s3://my-cli-bucket-2025-demo --recursive --human-readable --summarize
```

**Output (with `--human-readable --summarize`):**
```
2025-01-15 10:35:00    2.3 MiB photos/beach.jpg
2025-01-15 10:35:00  456.0 KiB photos/sunset.jpg
2025-01-15 10:36:00   12.0 KiB notes.txt

Total Objects: 3
   Total Size: 2.8 MiB
```

### 5.4 Upload Files (cp)

```bash
# Upload a single file
aws s3 cp myfile.txt s3://my-cli-bucket-2025-demo/
# What it does: Copies myfile.txt from your computer to the bucket root

# Upload a file to a specific "folder" (prefix)
aws s3 cp myfile.txt s3://my-cli-bucket-2025-demo/documents/
# What it does: Uploads to the "documents/" prefix

# Upload a file with a different name
aws s3 cp myfile.txt s3://my-cli-bucket-2025-demo/renamed-file.txt

# Upload with a specific storage class
aws s3 cp myfile.txt s3://my-cli-bucket-2025-demo/ --storage-class STANDARD_IA

# Upload all files from a local directory
aws s3 cp ./my-folder/ s3://my-cli-bucket-2025-demo/my-folder/ --recursive
```

### 5.5 Download Files (cp)

```bash
# Download a single file
aws s3 cp s3://my-cli-bucket-2025-demo/myfile.txt ./downloaded-file.txt
# What it does: Downloads the file from S3 to your current directory

# Download all files from a bucket to a local folder
aws s3 cp s3://my-cli-bucket-2025-demo/ ./local-folder/ --recursive
```

### 5.6 Sync (Synchronize Directories)

```bash
# Sync a local directory TO S3
aws s3 sync ./my-website/ s3://my-cli-bucket-2025-demo/
# What it does: Uploads only NEW or CHANGED files (much faster than cp --recursive)

# Sync FROM S3 to local directory
aws s3 sync s3://my-cli-bucket-2025-demo/ ./local-backup/

# Sync and delete files that don't exist in source
aws s3 sync ./my-website/ s3://my-cli-bucket-2025-demo/ --delete
# What it does: Makes the S3 bucket an exact mirror of your local folder

# Sync excluding certain files
aws s3 sync ./my-project/ s3://my-cli-bucket-2025-demo/ --exclude "*.log" --exclude "node_modules/*"

# Dry run (preview changes without actually syncing)
aws s3 sync ./my-website/ s3://my-cli-bucket-2025-demo/ --dryrun
```

### 5.7 Move Files (mv)

```bash
# Move a file (upload + delete local copy)
aws s3 mv myfile.txt s3://my-cli-bucket-2025-demo/

# Move a file within S3
aws s3 mv s3://my-cli-bucket-2025-demo/old-name.txt s3://my-cli-bucket-2025-demo/new-name.txt

# Move a file between buckets
aws s3 mv s3://source-bucket/file.txt s3://destination-bucket/file.txt
```

### 5.8 Delete Objects (rm)

```bash
# Delete a single object
aws s3 rm s3://my-cli-bucket-2025-demo/myfile.txt
# What it does: Permanently deletes the object (or adds delete marker if versioning is on)

# Delete all objects in a "folder"
aws s3 rm s3://my-cli-bucket-2025-demo/old-logs/ --recursive

# Delete all objects in a bucket
aws s3 rm s3://my-cli-bucket-2025-demo/ --recursive
```

### 5.9 Delete a Bucket (rb)

```bash
# Delete an EMPTY bucket
aws s3 rb s3://my-cli-bucket-2025-demo
# What it does: rb = "remove bucket". Only works if the bucket is empty.

# Delete a bucket AND all its contents (force)
aws s3 rb s3://my-cli-bucket-2025-demo --force
# What it does: Deletes all objects first, then removes the bucket.
# ⚠️ WARNING: This is irreversible!
```

### 5.10 AWS CLI Command Summary Table

| Command | Purpose | Example |
|---------|---------|---------|
| `aws s3 mb` | Make (create) bucket | `aws s3 mb s3://bucket-name` |
| `aws s3 rb` | Remove bucket | `aws s3 rb s3://bucket-name --force` |
| `aws s3 ls` | List buckets or objects | `aws s3 ls s3://bucket-name` |
| `aws s3 cp` | Copy files (upload/download) | `aws s3 cp file.txt s3://bucket/` |
| `aws s3 mv` | Move files | `aws s3 mv file.txt s3://bucket/` |
| `aws s3 rm` | Delete objects | `aws s3 rm s3://bucket/file.txt` |
| `aws s3 sync` | Sync directories | `aws s3 sync ./folder/ s3://bucket/` |
| `aws s3 presign` | Generate presigned URL | `aws s3 presign s3://bucket/file.txt` |

---

## 6. S3 Presigned URLs (Temporary Access) 🔐

A **presigned URL** gives **temporary access** to a private S3 object without requiring AWS credentials.

**Analogy:** It's like giving someone a time-limited guest pass to a private building. The pass works for a set time, then expires.

### Generate a Presigned URL (CLI)

```bash
# Generate a presigned URL (default: 1 hour expiration)
aws s3 presign s3://my-cli-bucket-2025-demo/private-report.pdf

# Generate with custom expiration (in seconds)
aws s3 presign s3://my-cli-bucket-2025-demo/private-report.pdf --expires-in 3600
# 3600 seconds = 1 hour

# Generate a presigned URL valid for 7 days (maximum)
aws s3 presign s3://my-cli-bucket-2025-demo/private-report.pdf --expires-in 604800
# 604800 seconds = 7 days
```

**Output:**
```
https://my-cli-bucket-2025-demo.s3.us-east-1.amazonaws.com/private-report.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA...&X-Amz-Date=20250115T...&X-Amz-Expires=3600&X-Amz-Signature=abc123...
```

Anyone with this URL can download the file for the next hour — no AWS account needed!

### Generate Presigned URL (AWS SDK — Node.js)

```javascript
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({ region: "us-east-1" });

async function generatePresignedUrl() {
    const command = new GetObjectCommand({
        Bucket: "my-cli-bucket-2025-demo",
        Key: "private-report.pdf",
    });

    // URL expires in 1 hour (3600 seconds)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log("Presigned URL:", url);
    return url;
}

generatePresignedUrl();
```

### Use Cases for Presigned URLs

| Use Case | How |
|----------|-----|
| Share a private file temporarily | Generate a presigned GET URL |
| Allow user upload without credentials | Generate a presigned PUT URL |
| Email a download link | Include presigned URL in the email |
| Frontend file upload to S3 | Backend generates presigned URL, frontend uploads directly |

---

## 7. Setting Up S3 for Static Website Hosting 🌐

### Step-by-Step Guide

#### Step 1: Create a Bucket

Create a bucket (follow Section 1 above). For a custom domain, name the bucket to match your domain (e.g., `www.mywebsite.com`).

#### Step 2: Disable Block Public Access

1. Go to bucket → **Permissions** tab
2. Edit **Block public access** → Uncheck all → Save

#### Step 3: Add Bucket Policy for Public Access

Add this bucket policy (replace `YOUR-BUCKET-NAME`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

#### Step 4: Enable Static Website Hosting

1. Go to bucket → **Properties** tab
2. Scroll to the very bottom to **Static website hosting**
3. Click **Edit**
4. Select **Enable**
5. Hosting type: **Host a static website**
6. Index document: `index.html`
7. Error document: `error.html` (optional but recommended)
8. Click **Save changes**

```
Static website hosting
┌─────────────────────────────────────────────┐
│  Static website hosting: ◉ Enable           │
│                                             │
│  Hosting type: ◉ Host a static website      │
│                                             │
│  Index document: [index.html          ]     │
│  Error document: [error.html          ]     │
│                                             │
│  Redirection rules: (optional)              │
└─────────────────────────────────────────────┘
```

#### Step 5: Upload Website Files

Create and upload these files:

**index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My S3 Website</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
            background-color: #f0f8ff;
        }
        h1 { color: #232f3e; }
        p { color: #666; font-size: 18px; }
        .badge {
            background: #ff9900;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>🎉 Welcome to My S3 Website!</h1>
    <p>This website is hosted entirely on Amazon S3.</p>
    <p>No servers needed — just HTML, CSS, and JavaScript!</p>
    <div class="badge">Powered by AWS S3</div>
</body>
</html>
```

**error.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>404 - Page Not Found</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #fff3f3;
        }
        h1 { color: #d32f2f; }
    </style>
</head>
<body>
    <h1>😕 404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a href="/">Go back to homepage</a>
</body>
</html>
```

#### Step 6: Access Your Website

After enabling static website hosting, you'll see the website endpoint URL:

```
Bucket website endpoint:
http://YOUR-BUCKET-NAME.s3-website-us-east-1.amazonaws.com
```

Open this URL in your browser — you should see your website!

> 💡 **Pro Tip:** S3 website hosting only supports HTTP (not HTTPS). For HTTPS, put a CloudFront distribution in front of your S3 bucket.

---

## 8. CORS Configuration for S3 ⚙️

**CORS (Cross-Origin Resource Sharing)** is needed when a website on one domain needs to access resources in your S3 bucket.

**Example:** Your website at `https://myapp.com` needs to load images from `https://my-bucket.s3.amazonaws.com`. Without CORS, the browser will block this.

### Add CORS Configuration

1. Go to bucket → **Permissions** tab
2. Scroll to **Cross-origin resource sharing (CORS)**
3. Click **Edit**
4. Paste this JSON:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

**What each field means:**

| Field | Meaning | Example |
|-------|---------|---------|
| `AllowedHeaders` | HTTP headers allowed in requests | `["*"]` = all headers |
| `AllowedMethods` | HTTP methods allowed | `["GET", "PUT"]` |
| `AllowedOrigins` | Which websites can make requests | `["https://myapp.com"]` or `["*"]` for any |
| `ExposeHeaders` | Headers the browser can access in the response | `["ETag"]` |
| `MaxAgeSeconds` | How long the browser caches the CORS config | `3000` = 50 minutes |

> ⚠️ **Security Tip:** In production, replace `"AllowedOrigins": ["*"]` with your actual domain, like `["https://myapp.com"]`. Using `*` allows any website to access your S3 resources.

---

## 9. S3 Access Logs 📝

S3 can log all requests made to your bucket — who accessed what, when, and from where.

### Enable Access Logging

1. Go to your bucket → **Properties** tab
2. Scroll to **Server access logging**
3. Click **Edit**
4. Select **Enable**
5. **Target bucket**: Choose a DIFFERENT bucket to store logs (never log to the same bucket — it creates an infinite loop!)
6. **Target prefix**: `logs/` (optional, helps organize)
7. Click **Save changes**

```
Server access logging
┌─────────────────────────────────────────────┐
│  ◉ Enable                                   │
│                                             │
│  Target bucket: [my-logs-bucket       ▼]   │
│  Target prefix: [access-logs/         ]    │
└─────────────────────────────────────────────┘
```

### Sample Log Entry

```
79a59df900b949e55d96a1e698fbacedfd6e09d98eacf8f8d5218e7cd47ef2be
my-bucket [15/Jan/2025:10:30:00 +0000] 192.168.1.1
arn:aws:iam::123456789:user/john
REST.GET.OBJECT photos/beach.jpg
"GET /photos/beach.jpg HTTP/1.1" 200 - 2345678 234 15 12
"-" "Mozilla/5.0" -
```

> ⚠️ **Warning:** Never set the target logging bucket to the SAME bucket you're logging. This creates an infinite loop where every log entry generates another log entry, resulting in massive storage costs!

---

## 10. Lifecycle Rules Setup (Step-by-Step) ♻️

### Create a Lifecycle Rule

1. Go to your bucket → **Management** tab
2. Under **Lifecycle rules**, click **Create lifecycle rule**
3. Configure:

```
Lifecycle rule configuration
┌─────────────────────────────────────────────────────┐
│  Rule name: [move-to-glacier-after-90-days  ]       │
│                                                     │
│  Rule scope:                                         │
│  ○ Limit the scope using one or more filters         │
│  ◉ Apply to all objects in the bucket                │
│                                                     │
│  ☑ I acknowledge that this rule will apply to all   │
│    objects in the bucket.                            │
│                                                     │
│  Lifecycle rule actions:                             │
│  ☑ Transition current versions of objects            │
│  ☑ Transition previous versions of objects           │
│  ☐ Expire current versions of objects                │
│  ☐ Delete expired object delete markers              │
│  ☑ Delete incomplete multipart uploads               │
│                                                     │
│  Transition current versions:                        │
│  ┌──────────────────────────────────────────────┐   │
│  │ Storage class: Standard-IA | Days: 30        │   │
│  │ Storage class: Glacier FR  | Days: 90        │   │
│  │ Storage class: Deep Archive| Days: 365       │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  Delete incomplete multipart uploads:                │
│  Number of days: [7]                                 │
└─────────────────────────────────────────────────────┘
```

4. Click **Create rule**

**This rule does:**
- After 30 days → Move to Standard-IA (cheaper storage)
- After 90 days → Move to Glacier Flexible Retrieval (archive)
- After 365 days → Move to Glacier Deep Archive (cheapest)
- Delete incomplete multipart uploads after 7 days (saves money!)

---

## 11. Versioning Demo 📋

Let's see versioning in action by uploading the same file multiple times.

### Step 1: Enable Versioning

1. Go to bucket → **Properties** tab
2. Under **Bucket Versioning**, click **Edit**
3. Select **Enable** → **Save changes**

### Step 2: Upload a File

Create a file called `hello.txt` with content: `Hello World - Version 1`

Upload it to your bucket.

### Step 3: Upload the Same File Again (Modified)

Change the content of `hello.txt` to: `Hello World - Version 2`

Upload it again to the same bucket with the same name.

### Step 4: View Versions

1. In your bucket, click on the **"Show versions"** toggle (top of the objects list)
2. You should see BOTH versions of `hello.txt`:

```
Objects (Show versions: ON)
┌──────────────────────────────────────────────────────┐
│  Name         │ Version ID         │ Size  │ Date    │
├──────────────────────────────────────────────────────┤
│  hello.txt    │ abc123def456...    │ 25 B  │ 10:35  │  ← Version 2 (latest)
│  hello.txt    │ xyz789ghi012...    │ 25 B  │ 10:30  │  ← Version 1 (previous)
└──────────────────────────────────────────────────────┘
```

### Step 5: Delete the File

1. Select `hello.txt` and click **Delete**
2. Type "permanently delete" and confirm
3. Turn ON **"Show versions"** toggle
4. You'll see a **"Delete marker"** has been added — the file isn't truly deleted!

```
Objects (Show versions: ON)
┌──────────────────────────────────────────────────────────┐
│  Name         │ Type           │ Version ID  │ Date      │
├──────────────────────────────────────────────────────────┤
│  hello.txt    │ Delete marker  │ mno345...   │ 10:40    │  ← Delete marker
│  hello.txt    │ Version        │ abc123...   │ 10:35    │  ← Version 2
│  hello.txt    │ Version        │ xyz789...   │ 10:30    │  ← Version 1
└──────────────────────────────────────────────────────────┘
```

### Step 6: Restore the File

1. Select the **Delete marker** and delete IT
2. The file is now restored to the latest version!

---

## 12. Common S3 Errors and Fixes 🔧

### Error: 403 Forbidden / Access Denied

```
<Error>
  <Code>AccessDenied</Code>
  <Message>Access Denied</Message>
</Error>
```

**Common causes and fixes:**

| Cause | Fix |
|-------|-----|
| Block Public Access is ON | Disable Block Public Access in bucket settings |
| No bucket policy | Add a bucket policy allowing `s3:GetObject` |
| IAM user lacks permissions | Add S3 permissions to the IAM user/role |
| Wrong bucket/object ARN in policy | Double-check the ARN in your bucket policy |
| Object is not public | Make the object public or use presigned URL |
| Requesting from wrong region | Use the correct region endpoint |

### Error: 404 Not Found

```
<Error>
  <Code>NoSuchKey</Code>
  <Message>The specified key does not exist.</Message>
</Error>
```

**Fixes:**
- Check the object key (name) — it's case-sensitive!
- Verify the bucket name is correct
- Check if the object was deleted

### Error: 409 Conflict — BucketAlreadyExists

```
<Error>
  <Code>BucketAlreadyExists</Code>
  <Message>The requested bucket name is not available.</Message>
</Error>
```

**Fix:** Choose a different, globally unique bucket name. Someone else already has this name.

### Error: 400 Bad Request — InvalidBucketName

```
<Error>
  <Code>InvalidBucketName</Code>
  <Message>The specified bucket is not valid.</Message>
</Error>
```

**Fix:** Check bucket naming rules — lowercase only, no underscores, no uppercase, 3-63 characters, no IP format.

### Error: CORS Error in Browser

```
Access to XMLHttpRequest at 'https://bucket.s3.amazonaws.com/file'
from origin 'https://myapp.com' has been blocked by CORS policy
```

**Fix:** Add a CORS configuration to your bucket (see Section 8 above).

### Error: 503 Slow Down

```
<Error>
  <Code>SlowDown</Code>
  <Message>Please reduce your request rate.</Message>
</Error>
```

**Fix:** You're sending too many requests too quickly. S3 supports 5,500 GET and 3,500 PUT requests per second per prefix. Use exponential backoff and spread requests across multiple prefixes.

### Error: EntityTooLarge

```
<Error>
  <Code>EntityTooLarge</Code>
  <Message>Your proposed upload exceeds the maximum allowed size</Message>
</Error>
```

**Fix:** Use multipart upload for files > 5 GB. Single PUT upload max is 5 GB.

### Error: Bucket Not Empty — Cannot Delete

```
<Error>
  <Code>BucketNotEmpty</Code>
</Error>
```

**Fix:** Delete all objects (including versions and delete markers) before deleting the bucket.

```bash
# CLI solution:
aws s3 rb s3://my-bucket --force
```

---

## 🔄 Quick Summary

```
┌─────────────────────────────────────────────────────────────┐
│              S3 BUCKET & FILES QUICK SUMMARY                │
├─────────────────────────────────────────────────────────────┤
│ ✅ Create Bucket: Console → S3 → Create bucket             │
│ ✅ Upload: Open bucket → Upload → Add files → Upload        │
│ ✅ Public Access: Disable BPA + Add bucket policy           │
│ ✅ CLI Upload: aws s3 cp file.txt s3://bucket/              │
│ ✅ CLI Sync: aws s3 sync ./folder/ s3://bucket/             │
│ ✅ Presigned URL: aws s3 presign s3://bucket/file           │
│ ✅ Static Website: Enable in Properties + bucket policy     │
│ ✅ CORS: Add JSON config in Permissions tab                 │
│ ✅ Lifecycle: Management tab → Create lifecycle rule        │
│ ✅ Versioning: Properties → Enable bucket versioning        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎤 Interview Questions (15+)

### Basic Questions

**Q1: How do you create an S3 bucket?**
> Through the AWS Console (S3 → Create bucket), AWS CLI (`aws s3 mb s3://bucket-name`), or AWS SDK. You must provide a globally unique name and select a region.

**Q2: What makes a valid S3 bucket name?**
> 3-63 characters, lowercase letters, numbers, and hyphens only. Must start/end with a letter or number. Cannot look like an IP address. Must be globally unique across all AWS accounts.

**Q3: How do you upload a file to S3 using the CLI?**
> `aws s3 cp local-file.txt s3://bucket-name/`. For directories, add `--recursive`. For syncing, use `aws s3 sync source destination`.

**Q4: What is the difference between `aws s3 cp` and `aws s3 sync`?**
> `cp` copies all specified files every time. `sync` only copies files that are new or changed — it compares source and destination. `sync` is more efficient for ongoing updates, while `cp` is better for one-time transfers.

**Q5: How do you make an S3 object publicly accessible?**
> 1) Disable Block Public Access on the bucket. 2) Add a bucket policy allowing `s3:GetObject` for `Principal: "*"`. 3) The object is now accessible via its public URL.

### Intermediate Questions

**Q6: What is an S3 presigned URL? When would you use it?**
> A presigned URL provides temporary access to a private S3 object without requiring AWS credentials. It includes authentication info in the URL query parameters and expires after a set time (default 1 hour, max 7 days). Use cases: sharing private files, allowing frontend uploads without exposing AWS keys, email download links.

**Q7: How do you host a static website on S3?**
> 1) Create a bucket, 2) Disable Block Public Access, 3) Add a public read bucket policy, 4) Enable Static Website Hosting in bucket Properties, 5) Set index.html as the index document, 6) Upload website files. The website URL is `http://bucket.s3-website-region.amazonaws.com`.

**Q8: What is CORS and why is it needed for S3?**
> CORS (Cross-Origin Resource Sharing) is a security mechanism that controls which websites can access resources in your S3 bucket. Without CORS, a browser will block requests from a website at one domain to S3 at a different domain. You configure CORS with allowed origins, methods, and headers.

**Q9: How does S3 versioning protect against accidental deletion?**
> When versioning is enabled, deleting an object doesn't actually remove it — S3 adds a "delete marker" instead. All previous versions are preserved. To restore, simply delete the delete marker. To permanently delete, you must specify the exact Version ID.

**Q10: What is S3 Lifecycle Rule and how do you set one up?**
> A lifecycle rule automatically transitions objects between storage classes or deletes them based on age. Set up: Go to Management tab → Create lifecycle rule → Choose actions (transition/expire) → Set days. Example: Move to IA after 30 days, Glacier after 90 days, delete after 365 days.

### Advanced Questions

**Q11: What is the difference between `aws s3` and `aws s3api` commands?**
> `aws s3` provides high-level commands (cp, sync, ls, rm) that are easier to use. `aws s3api` provides low-level, direct API calls (put-object, get-object, create-bucket) with more options and control. For example, `aws s3 cp` handles multipart upload automatically, while `aws s3api put-object` requires you to handle it manually.

**Q12: How do you troubleshoot a 403 Access Denied error in S3?**
> Check: 1) Block Public Access settings, 2) Bucket policy syntax and ARN, 3) IAM user/role permissions, 4) S3 ACLs (if enabled), 5) VPC endpoint policy (if accessing via VPC), 6) KMS key permissions (if SSE-KMS encryption). Use the IAM Policy Simulator and S3 Access Analyzer to debug.

**Q13: How would you set up S3 to log all access requests?**
> Enable Server Access Logging in bucket Properties. Specify a DIFFERENT target bucket to store logs (never the same bucket — infinite loop). Optionally set a prefix. Logs include requester IP, time, operation, HTTP status, and more.

**Q14: How do you delete a bucket that has versioned objects?**
> You must delete ALL object versions AND delete markers first, then delete the bucket. CLI shortcut: `aws s3 rb s3://bucket-name --force`. Programmatically, use `list-object-versions` to find all versions, then `delete-objects` to remove them in batches.

**Q15: What is the S3 object URL format and what are the different styles?**
> Virtual-hosted style (recommended): `https://bucket.s3.region.amazonaws.com/key`. Path style (legacy): `https://s3.region.amazonaws.com/bucket/key`. S3 URI (CLI/SDK): `s3://bucket/key`. Website endpoint: `http://bucket.s3-website-region.amazonaws.com/key`.

**Q16: How do you copy large files (> 5 GB) to S3?**
> Use multipart upload. The AWS CLI `aws s3 cp` handles this automatically. Programmatically, use the S3 Transfer Manager or manually: 1) InitiateMultipartUpload, 2) UploadPart (5 MB to 5 GB each, max 10,000 parts), 3) CompleteMultipartUpload. Always abort incomplete multipart uploads to avoid storage charges.

**Q17: What are S3 access points and when would you use them?**
> S3 Access Points are named network endpoints with dedicated access policies that simplify data access management. Instead of one complex bucket policy handling 100 different applications, you create separate access points (each with its own policy) for each application. Each access point has its own hostname and can be restricted to a specific VPC.

---

## 🚀 What's Next?

In the next guide, we'll build a **real-world application** that uploads files from a **Next.js web app** to S3 using the AWS SDK:
- Create a full-stack file upload component
- Use presigned URLs for secure uploads
- Handle file validation, progress bars, and error handling

Move on to: **15-nextjs-s3-file-upload.md** →
