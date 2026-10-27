# 📦 AWS S3 — Simple Storage Service (Complete Guide)

---

## 📚 What You'll Learn

- What Amazon S3 is and why it's one of the most important AWS services
- Key concepts: Buckets, Objects, Keys, and Regions
- All 7 S3 Storage Classes and when to use each one
- Versioning, Lifecycle Rules, and Replication
- Security: Bucket Policies, ACLs, IAM Policies, and Encryption
- Static Website Hosting, Transfer Acceleration, and Event Notifications
- S3 vs EBS vs EFS — how to choose the right storage
- Real-world use cases and best practices
- 20+ interview questions with answers

---

## ✅ Prerequisites

- Basic understanding of cloud computing concepts
- An AWS account (free tier works)
- Familiarity with files and folders on your computer
- Basic understanding of IAM (covered in earlier docs)

---

## 1. What is Amazon S3? 🤔

**Amazon S3 (Simple Storage Service)** is an object storage service that lets you store and retrieve **any amount of data**, at **any time**, from **anywhere on the internet**.

### 🏠 Real-World Analogy

Imagine you have an **unlimited storage locker in the cloud**:

- You can store **anything** in it — documents, photos, videos, backups, code, databases
- You can access your locker from **anywhere in the world** using the internet
- Your locker is **super secure** — only people you give the key to can open it
- Your locker **never runs out of space** — it grows as you need it
- Your items are **stored in multiple copies** across different locations, so even if one location has a disaster, your stuff is safe
- You only **pay for what you store** — no need to buy a huge locker upfront

That's exactly what S3 does, but for digital data!

```
📦 Your Computer                    ☁️ Amazon S3
┌──────────────┐                   ┌──────────────────────────┐
│  photo.jpg   │ ── Upload ──────> │  my-bucket/photo.jpg     │
│  report.pdf  │ ── Upload ──────> │  my-bucket/report.pdf    │
│  backup.zip  │ ── Upload ──────> │  my-bucket/backup.zip    │
└──────────────┘                   └──────────────────────────┘
                                   │ 99.999999999% Durability │
                                   │ Unlimited Storage        │
                                   │ Access from Anywhere     │
                                   └──────────────────────────┘
```

### Why is S3 So Important?

- **S3 was one of the FIRST AWS services** launched in 2006
- It stores **trillions of objects** globally
- Almost every AWS service integrates with S3
- It's the backbone of data lakes, backups, websites, and big data processing

---

## 2. S3 Key Concepts 🔑

### 2.1 Buckets

A **bucket** is a **container** for storing objects (files) in S3.

**Analogy:** Think of a bucket like a **top-level folder** or a **storage drive** on your computer.

```
☁️ AWS S3
├── 🪣 my-photos-bucket
│   ├── vacation/beach.jpg
│   ├── vacation/sunset.jpg
│   └── family/birthday.jpg
├── 🪣 my-website-bucket
│   ├── index.html
│   ├── style.css
│   └── script.js
└── 🪣 company-backups-bucket
    ├── db-backup-2025-01-01.sql
    └── db-backup-2025-01-02.sql
```

**Important Rules about Buckets:**

| Rule | Details |
|------|---------|
| Globally Unique Name | No two buckets in the ENTIRE world can have the same name |
| Region-Specific | A bucket is created in a specific AWS Region |
| Flat Structure | S3 doesn't have real folders — it simulates them using prefixes |
| Limit | 100 buckets per account by default (can request increase) |
| Cannot be nested | You cannot create a bucket inside another bucket |

### 2.2 Objects

An **object** is the actual **file** you store in S3, along with its **metadata**.

**Analogy:** If a bucket is a folder, an object is a file inside that folder — but it also carries a label with extra information.

Every S3 object consists of:

| Component | Description | Example |
|-----------|-------------|---------|
| **Key** | The name/path of the object | `photos/vacation/beach.jpg` |
| **Value** | The actual data (file content) | The bytes of the image |
| **Version ID** | Unique version identifier (if versioning is enabled) | `3sL4kqtJlcpXroDTDmJ+rmSpXd3dIbrHY` |
| **Metadata** | Key-value pairs describing the object | `Content-Type: image/jpeg` |
| **Sub-resources** | ACLs, Torrent info | Access control settings |

### 2.3 Keys

A **key** is the **unique identifier** (name) for an object within a bucket.

**Analogy:** Think of a key as the **full file path** on your computer.

```
Bucket: my-company-data
Key:    projects/2025/reports/quarterly-report.pdf

Full S3 Path: s3://my-company-data/projects/2025/reports/quarterly-report.pdf
```

> 💡 **Pro Tip:** S3 doesn't actually have folders. The `/` in the key is just part of the name. S3 treats `projects/2025/reports/quarterly-report.pdf` as one flat name. The AWS Console just shows it as folders for convenience.

### 2.4 Regions

Every S3 bucket is created in a specific **AWS Region**.

**Why Regions Matter:**

- **Latency** — Store data close to your users for faster access
- **Compliance** — Some regulations require data to stay in a specific country
- **Cost** — Pricing varies slightly by region
- **Disaster Recovery** — Replicate data across regions for safety

```
🌍 AWS Regions for S3
┌─────────────────────────────────────────────────┐
│  US East (N. Virginia)  - us-east-1             │
│  US West (Oregon)       - us-west-2             │
│  Europe (Ireland)       - eu-west-1             │
│  Asia Pacific (Mumbai)  - ap-south-1            │
│  ... and 30+ more regions                       │
└─────────────────────────────────────────────────┘
```

---

## 3. S3 Features ⭐

### 3.1 Unlimited Storage

There is **no limit** on how much data you can store in S3. You can store 1 file or 1 billion files. AWS manages the infrastructure behind the scenes.

### 3.2 Object Size

| Detail | Value |
|--------|-------|
| Minimum object size | 0 bytes (empty file) |
| Maximum object size | **5 TB** (5 terabytes) |
| Maximum single PUT upload | 5 GB |
| Use multipart upload for | Files larger than 100 MB (recommended) |
| Multipart upload required for | Files larger than 5 GB |

### 3.3 Durability — 99.999999999% (11 9's)

**Durability** means how safe your data is from being lost.

**What does 11 9's durability mean?**

If you store **10,000,000 (10 million) objects** in S3, you can expect to lose **1 object every 10,000 years**.

That's insanely reliable! S3 achieves this by automatically storing your data across **at least 3 Availability Zones** within a region.

### 3.4 Availability — 99.99%

**Availability** means how often you can access your data.

99.99% availability = your data might be unavailable for about **52.6 minutes per year**. That's extremely high availability for a storage service.

---

## 4. S3 Storage Classes 📊

S3 offers **7 storage classes** designed for different use cases. Think of them as different levels of a parking garage — the premium spots cost more but are faster to access.

### Detailed Comparison Table

| Storage Class | Durability | Availability | Min Storage Duration | Retrieval Fee | AZs | Best For |
|--------------|------------|-------------|---------------------|--------------|-----|----------|
| **S3 Standard** | 11 9's | 99.99% | None | None | ≥ 3 | Frequently accessed data |
| **S3 Intelligent-Tiering** | 11 9's | 99.9% | None | None | ≥ 3 | Unknown or changing access patterns |
| **S3 Standard-IA** | 11 9's | 99.9% | 30 days | Per GB | ≥ 3 | Infrequently accessed, but needs fast retrieval |
| **S3 One Zone-IA** | 11 9's | 99.5% | 30 days | Per GB | 1 | Infrequent access, re-creatable data |
| **S3 Glacier Instant Retrieval** | 11 9's | 99.9% | 90 days | Per GB | ≥ 3 | Archive data needing millisecond access |
| **S3 Glacier Flexible Retrieval** | 11 9's | 99.99% | 90 days | Per GB | ≥ 3 | Archive data, minutes to hours retrieval |
| **S3 Glacier Deep Archive** | 11 9's | 99.99% | 180 days | Per GB | ≥ 3 | Long-term archive, 12-48 hour retrieval |

### Storage Class Details

#### 🟢 S3 Standard
- **Use Case:** Websites, apps, gaming, big data analytics
- **Cost:** Highest storage cost, no retrieval cost
- **Analogy:** A filing cabinet on your desk — always within arm's reach

#### 🔵 S3 Intelligent-Tiering
- **Use Case:** Data with unpredictable access patterns
- **Cost:** Small monthly monitoring fee per object; automatically moves data between tiers
- **How it works:**
  - **Frequent Access Tier** — accessed regularly (same price as Standard)
  - **Infrequent Access Tier** — not accessed for 30 days (40% cheaper)
  - **Archive Instant Access Tier** — not accessed for 90 days (68% cheaper)
  - **Archive Access Tier** — optional, not accessed for 90+ days
  - **Deep Archive Access Tier** — optional, not accessed for 180+ days
- **Analogy:** A smart closet that automatically moves clothes you don't wear to the back

#### 🟡 S3 Standard-IA (Infrequent Access)
- **Use Case:** Disaster recovery, backups, data you need quickly but rarely
- **Cost:** Lower storage cost than Standard, but you pay per GB when retrieving data
- **Minimum:** 128 KB minimum object charge, 30-day minimum storage
- **Analogy:** A storage unit across town — cheap rent, but it costs gas to drive there

#### 🟠 S3 One Zone-IA
- **Use Case:** Secondary backups, data you can recreate if lost
- **Cost:** 20% cheaper than Standard-IA
- **Risk:** Data is stored in only ONE Availability Zone — if that AZ goes down, data is lost
- **Analogy:** A storage locker that's cheap but doesn't have insurance

#### 🔴 S3 Glacier Instant Retrieval
- **Use Case:** Medical images, news media archives — rarely accessed but need instant access when needed
- **Cost:** Very low storage cost, higher retrieval cost
- **Retrieval:** Milliseconds (as fast as Standard)
- **Minimum:** 90-day minimum storage, 128 KB minimum object size

#### ❄️ S3 Glacier Flexible Retrieval (formerly Glacier)
- **Use Case:** Yearly compliance archives, old project data
- **Cost:** Very low storage cost
- **Retrieval Options:**
  - **Expedited:** 1-5 minutes
  - **Standard:** 3-5 hours
  - **Bulk:** 5-12 hours
- **Analogy:** A warehouse far away — cheap to store, but takes time to get your stuff

#### 🧊 S3 Glacier Deep Archive
- **Use Case:** Financial records (7+ years), healthcare records, regulatory archives
- **Cost:** Cheapest storage class (as low as $1/TB/month)
- **Retrieval Options:**
  - **Standard:** 12 hours
  - **Bulk:** 48 hours
- **Analogy:** A vault buried underground — extremely cheap, but takes a long time to dig out

### Cost Comparison (Approximate — us-east-1)

| Storage Class | Storage (per GB/month) | Retrieval Cost |
|--------------|----------------------|----------------|
| S3 Standard | $0.023 | Free |
| Intelligent-Tiering (Frequent) | $0.023 | Free |
| Standard-IA | $0.0125 | $0.01/GB |
| One Zone-IA | $0.01 | $0.01/GB |
| Glacier Instant Retrieval | $0.004 | $0.03/GB |
| Glacier Flexible Retrieval | $0.0036 | $0.01/GB (Standard) |
| Glacier Deep Archive | $0.00099 | $0.02/GB (Standard) |

---

## 5. S3 Bucket Naming Rules 📝

Your bucket name must follow these rules:

| Rule | Example |
|------|---------|
| 3-63 characters long | ✅ `my-bucket` ❌ `ab` |
| Lowercase letters, numbers, hyphens only | ✅ `my-bucket-2025` ❌ `My_Bucket!` |
| Must start with a letter or number | ✅ `data-bucket` ❌ `-bucket` |
| Cannot end with a hyphen | ✅ `my-bucket` ❌ `my-bucket-` |
| Cannot have consecutive periods | ✅ `my.bucket` ❌ `my..bucket` |
| Cannot be formatted as an IP address | ❌ `192.168.1.1` |
| Must be globally unique across ALL AWS accounts | ✅ `john-company-data-2025` |
| No uppercase letters | ❌ `MyBucket` |

> 💡 **Pro Tip:** Use a naming convention like `<company>-<project>-<environment>-<region>` for bucket names. Example: `acme-webapp-prod-us-east-1`

---

## 6. S3 Versioning 📋

**Versioning** keeps **multiple versions** of the same object in your bucket. This way, if you accidentally overwrite or delete a file, you can recover the previous version.

### How Versioning Works

```
Without Versioning:
Upload photo.jpg (v1) → Upload photo.jpg (v2) → v1 is GONE forever

With Versioning:
Upload photo.jpg (v1) → Upload photo.jpg (v2) → Both v1 and v2 are KEPT
```

**Analogy:** Think of versioning like Google Docs version history — you can see and restore every previous version of a document.

### Key Points about Versioning

| Point | Details |
|-------|---------|
| Enabled at bucket level | You turn versioning ON for the entire bucket |
| Once enabled, cannot be disabled | You can only SUSPEND it (existing versions remain) |
| Each version has a unique Version ID | Used to retrieve specific versions |
| Delete doesn't permanently remove | Adds a "delete marker" instead |
| Permanently delete | Must specify the Version ID to truly delete |
| Storage cost | You pay for ALL versions stored |

### Versioning States

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Unversioned    │ ──> │    Versioning     │ ──> │    Versioning    │
│   (Default)      │     │    Enabled        │     │    Suspended     │
└──────────────────┘     └──────────────────┘     └──────────────────┘
       │                        │                        │
  No version IDs         All uploads get          New uploads get
  on objects             unique version IDs       null version ID
                         Old versions kept        Old versions kept
```

---

## 7. S3 Lifecycle Rules ♻️

**Lifecycle rules** automatically move objects between storage classes or delete them after a set time.

**Analogy:** Think of it like a library system — new books are on the shelf (Standard), after 30 days they go to the back room (IA), after 1 year they go to the archive (Glacier), and after 7 years they're recycled (deleted).

### Types of Lifecycle Actions

| Action | What it Does | Example |
|--------|-------------|---------|
| **Transition** | Move objects to a cheaper storage class | Move to Glacier after 90 days |
| **Expiration** | Permanently delete objects | Delete after 365 days |

### Example Lifecycle Rule

```
Day 0:    Object uploaded → S3 Standard
Day 30:   Transition → S3 Standard-IA
Day 90:   Transition → S3 Glacier Flexible Retrieval
Day 365:  Transition → S3 Glacier Deep Archive
Day 2555: Expiration → Object permanently deleted (7 years)
```

### Lifecycle Rule Constraints

- Cannot transition from Glacier back to Standard (one-way)
- Minimum 30 days in Standard before transitioning to IA classes
- Cannot transition smaller objects (< 128 KB) to IA or Glacier
- Rules can apply to entire bucket, specific prefixes, or specific tags

```
📅 Lifecycle Timeline
──────────────────────────────────────────────────────►
Day 0        Day 30         Day 90         Day 365     Day 2555
  │            │              │              │            │
  ▼            ▼              ▼              ▼            ▼
Standard → Standard-IA → Glacier Flex → Deep Archive → DELETE
 $0.023      $0.0125       $0.0036        $0.00099     
```

---

## 8. S3 Security: Bucket Policies vs ACLs vs IAM Policies 🔒

S3 offers multiple ways to control access. Here's how they differ:

### Comparison Table

| Feature | Bucket Policy | ACL (Access Control List) | IAM Policy |
|---------|--------------|--------------------------|------------|
| **Attached to** | S3 Bucket | Bucket or Object | IAM User/Role/Group |
| **Written in** | JSON | XML | JSON |
| **Scope** | Entire bucket or prefixes | Individual objects or bucket | Specific users/roles |
| **Cross-account** | ✅ Yes | ✅ Yes (limited) | ❌ No (use bucket policy) |
| **Complexity** | Medium | Simple | Medium |
| **Recommended** | ✅ Yes | ⚠️ Discouraged (legacy) | ✅ Yes |
| **Granularity** | Bucket-level with conditions | Object-level or bucket-level | User-level |

### Bucket Policy Example

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::my-website-bucket/*"
        }
    ]
}
```

**Explanation:**
- `"Principal": "*"` — Anyone (public access)
- `"Action": "s3:GetObject"` — Can only read/download objects
- `"Resource"` — Applies to all objects in `my-website-bucket`

### IAM Policy Example (Attached to a User)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::my-app-bucket/*"
        }
    ]
}
```

### Access Decision Flow

```
Request to access S3 object
         │
         ▼
┌─────────────────┐   NO    ┌──────────────┐
│ Is there an      │ ──────> │   DENIED     │
│ explicit DENY?   │         └──────────────┘
│ (Bucket Policy,  │
│  IAM Policy,     │   NO DENY
│  or ACL)         │ ──────────┐
└─────────────────┘           ▼
                     ┌─────────────────┐   YES   ┌──────────────┐
                     │ Is there an      │ ──────> │   ALLOWED    │
                     │ explicit ALLOW?  │         └──────────────┘
                     │ (any policy)     │
                     └─────────────────┘
                              │ NO
                              ▼
                     ┌──────────────┐
                     │   DENIED     │
                     │ (implicit)   │
                     └──────────────┘
```

> 💡 **Pro Tip:** AWS now recommends disabling ACLs entirely and using bucket policies + IAM policies for all access control. When you create a new bucket, "ACLs disabled" is the default setting.

---

## 9. S3 Encryption 🔐

S3 supports **encryption at rest** (data stored on disk) and **encryption in transit** (data moving over the network).

### Encryption at Rest — 4 Methods

| Method | Key Management | Who Manages Keys | Use Case |
|--------|---------------|-------------------|----------|
| **SSE-S3** | S3 Managed Keys | AWS | Default, simplest option |
| **SSE-KMS** | KMS Managed Keys | AWS (you control key policies) | When you need audit trail or key rotation control |
| **SSE-C** | Customer-Provided Keys | YOU provide the key with every request | When you must manage your own keys |
| **Client-Side** | You encrypt before uploading | YOU handle encryption/decryption | Maximum control, compliance requirements |

### SSE-S3 (Server-Side Encryption with S3 Managed Keys)
- **Default encryption** for all new buckets (since Jan 2023)
- AWS manages the keys entirely
- Uses **AES-256** encryption
- Header: `x-amz-server-side-encryption: AES256`

### SSE-KMS (Server-Side Encryption with KMS Keys)
- Uses AWS Key Management Service (KMS)
- You can create and manage your own KMS keys
- Provides **audit trail** via CloudTrail (you can see who used the key and when)
- Header: `x-amz-server-side-encryption: aws:kms`
- ⚠️ Be aware of KMS API rate limits (5,500-30,000 requests/sec depending on region)

### SSE-C (Server-Side Encryption with Customer-Provided Keys)
- YOU provide the encryption key with every request
- AWS does NOT store your key — you must manage it yourself
- Must use **HTTPS** (not HTTP) for all requests
- If you lose the key, you lose the data!

### Client-Side Encryption
- YOU encrypt the data BEFORE sending it to S3
- YOU decrypt the data AFTER downloading from S3
- AWS never sees your unencrypted data
- Use the AWS Encryption SDK or your own encryption library

### Encryption in Transit
- Always use **HTTPS** (TLS/SSL) endpoints
- S3 endpoints: `https://s3.amazonaws.com`
- You can enforce HTTPS-only access using a bucket policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "ForceHTTPS",
            "Effect": "Deny",
            "Principal": "*",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::my-bucket",
                "arn:aws:s3:::my-bucket/*"
            ],
            "Condition": {
                "Bool": {
                    "aws:SecureTransport": "false"
                }
            }
        }
    ]
}
```

---

## 10. S3 Static Website Hosting 🌐

S3 can host **static websites** (HTML, CSS, JavaScript, images) — no server needed!

**Analogy:** Instead of renting a web server, you just put your website files in S3 and tell S3 to serve them as a website. It's like displaying a poster in a window instead of hiring a person to hold it.

### What S3 Static Hosting Supports

| Supported | Not Supported |
|-----------|--------------|
| HTML, CSS, JavaScript | Server-side code (PHP, Python, Node.js) |
| Images, Videos, Fonts | Databases |
| Single Page Apps (React, Angular, Vue) | Dynamic content generation |
| Custom error pages | WebSockets |
| Redirects | Server-side sessions |

### S3 Website URL Format

```
http://<bucket-name>.s3-website-<region>.amazonaws.com
OR
http://<bucket-name>.s3-website.<region>.amazonaws.com

Example:
http://my-website-bucket.s3-website-us-east-1.amazonaws.com
```

### Setup Steps (Overview)

1. Create a bucket with the name matching your domain (optional)
2. Enable static website hosting in bucket properties
3. Set the index document (e.g., `index.html`)
4. Set the error document (e.g., `error.html`)
5. Disable "Block Public Access"
6. Add a bucket policy to allow public reads
7. Upload your website files

> 💡 **Pro Tip:** For production websites, put **CloudFront** (AWS CDN) in front of your S3 website for HTTPS support, custom domains, and faster loading.

---

## 11. S3 Transfer Acceleration 🚀

**Transfer Acceleration** speeds up uploads to S3 by routing data through **AWS CloudFront edge locations**.

**Analogy:** Instead of mailing a package from India to the US directly (slow), you drop it off at a nearby express shipping center (edge location) that has a dedicated fast lane to the US warehouse (S3 bucket).

### How It Works

```
Without Transfer Acceleration:
User (Mumbai) ──── Slow Internet ────> S3 Bucket (US East)

With Transfer Acceleration:
User (Mumbai) ──> Edge Location (Mumbai) ══ AWS Backbone ══> S3 Bucket (US East)
                  (Fast nearby connection)   (Fast internal)
```

### Key Points

- Enable per bucket in bucket properties
- Uses the endpoint: `<bucket>.s3-accelerate.amazonaws.com`
- Can improve upload speed by **50-500%** for long-distance transfers
- AWS charges extra for Transfer Acceleration
- Only works for uploads — doesn't speed up downloads (use CloudFront for that)
- You can use the [S3 Transfer Acceleration Speed Comparison tool](http://s3-accelerate-speedtest.s3-accelerate.amazonaws.com/en/accelerate-speed-comparsion.html) to test

---

## 12. S3 Event Notifications 📬

S3 can **trigger actions** when certain events happen in your bucket (like a file being uploaded).

**Analogy:** It's like setting up a doorbell camera — when someone (a file) arrives at your door (bucket), you get a notification.

### Supported Events

| Event | Trigger |
|-------|---------|
| `s3:ObjectCreated:*` | Any object created (PUT, POST, COPY, Multipart) |
| `s3:ObjectRemoved:*` | Any object deleted |
| `s3:ObjectRestore:*` | Object restored from Glacier |
| `s3:Replication:*` | Replication events |
| `s3:LifecycleExpiration:*` | Object expired by lifecycle rule |

### Notification Destinations

```
S3 Event ──> Amazon SNS (Send emails, SMS)
S3 Event ──> Amazon SQS (Queue for processing)
S3 Event ──> AWS Lambda (Run code automatically)
S3 Event ──> Amazon EventBridge (Route to 20+ AWS services)
```

### Example Use Cases

- **Image uploaded** → Lambda function creates a thumbnail
- **Log file uploaded** → SQS queue triggers processing pipeline
- **Video uploaded** → Lambda function starts transcoding job
- **File deleted** → SNS sends alert to admin email

---

## 13. S3 Replication 🔄

S3 Replication automatically copies objects from one bucket to another.

### Two Types of Replication

| Feature | CRR (Cross-Region Replication) | SRR (Same-Region Replication) |
|---------|-------------------------------|------------------------------|
| **Source & Destination** | Different AWS Regions | Same AWS Region |
| **Use Case** | Disaster recovery, latency reduction | Log aggregation, compliance |
| **Compliance** | Meet regulatory requirements for geographic redundancy | Keep replicas for audit purposes |
| **Example** | US bucket → EU bucket | Production bucket → Audit bucket |

### Replication Requirements

- ✅ Versioning must be enabled on BOTH source and destination buckets
- ✅ S3 must have IAM permissions to replicate objects
- ✅ Buckets can be in different AWS accounts
- ⚠️ Only NEW objects are replicated (existing objects are NOT replicated automatically)
- ⚠️ Delete markers are NOT replicated by default (can be enabled)
- ⚠️ No "chaining" — if Bucket A replicates to Bucket B, and Bucket B replicates to Bucket C, objects in A are NOT automatically replicated to C

### Replication Diagram

```
Cross-Region Replication (CRR):
┌──────────────────┐                    ┌──────────────────┐
│  Source Bucket    │  ── Replicates ─>  │  Destination     │
│  (us-east-1)     │     Automatically   │  Bucket          │
│  🪣 my-data      │                    │  (eu-west-1)     │
│  [Versioning ON] │                    │  🪣 my-data-eu   │
└──────────────────┘                    │  [Versioning ON] │
                                        └──────────────────┘
```

---

## 14. S3 Pricing Explained 💰

S3 pricing is based on several factors:

### What You Pay For

| Component | Description |
|-----------|-------------|
| **Storage** | Per GB stored per month (varies by storage class) |
| **Requests** | Per 1,000 GET, PUT, LIST requests |
| **Data Transfer OUT** | Per GB downloaded FROM S3 to the internet |
| **Data Transfer IN** | **FREE** — uploading to S3 is always free |
| **Management Features** | Inventory, analytics, object tagging |
| **Replication** | Transfer costs between regions |
| **Transfer Acceleration** | Extra charge per GB when enabled |

### Example Cost Calculation (us-east-1, S3 Standard)

```
Scenario: You store 100 GB in S3 Standard
- 10,000 PUT requests (uploads) per month
- 50,000 GET requests (downloads) per month
- 10 GB data transferred out to internet

Storage:     100 GB × $0.023    = $2.30/month
PUT requests: 10,000 × $0.005/1000 = $0.05/month
GET requests: 50,000 × $0.0004/1000 = $0.02/month
Data out:    10 GB × $0.09     = $0.90/month
Data in:     FREE               = $0.00/month
─────────────────────────────────────────────
Total:                          ≈ $3.27/month
```

> 💡 **Pro Tip:** The biggest cost surprise is usually **data transfer OUT**. Uploading is free, but downloading from S3 to the internet costs money. Use CloudFront to reduce data transfer costs.

### Free Tier (First 12 Months)

- 5 GB of S3 Standard storage
- 20,000 GET requests
- 2,000 PUT requests

---

## 15. S3 vs EBS vs EFS Comparison 📊

| Feature | S3 | EBS (Elastic Block Store) | EFS (Elastic File System) |
|---------|-----|--------------------------|--------------------------|
| **Type** | Object Storage | Block Storage | File Storage |
| **Analogy** | Dropbox/Google Drive | Hard drive attached to PC | Network shared drive |
| **Access** | Via HTTP/HTTPS (API) | Attached to ONE EC2 instance | Shared across MULTIPLE EC2 instances |
| **Structure** | Flat (objects with keys) | File system (ext4, NTFS) | File system (NFS) |
| **Max Size** | Unlimited | 64 TB per volume | Unlimited (elastic) |
| **Durability** | 11 9's | 99.999% | 11 9's |
| **Performance** | High throughput | Very low latency, high IOPS | Moderate latency |
| **Use Case** | Backups, data lakes, websites | OS drives, databases | Shared application files |
| **Pricing** | Per GB stored + requests | Per GB provisioned | Per GB used |
| **Multi-AZ** | ✅ By default | ❌ Single AZ (unless io2) | ✅ Multi-AZ |
| **Access from Internet** | ✅ Yes (with permissions) | ❌ No (EC2 only) | ❌ No (EC2/on-premises only) |

### When to Use What?

```
Need to store files accessed via the internet?        → S3
Need a boot drive for EC2?                            → EBS
Need a database volume for EC2?                       → EBS
Need shared file storage across multiple EC2?         → EFS
Need to host a static website?                        → S3
Need to store backups?                                → S3
Need a high-performance file system for Linux apps?   → EFS
```

---

## 16. S3 Use Cases 🎯

Here are 15+ real-world use cases for Amazon S3:

| # | Use Case | Description |
|---|----------|-------------|
| 1 | **Static Website Hosting** | Host HTML/CSS/JS websites without a server |
| 2 | **Backup & Recovery** | Store database backups, system snapshots |
| 3 | **Data Lake** | Central repository for big data analytics |
| 4 | **Media Hosting** | Store and serve images, videos, audio files |
| 5 | **Software Distribution** | Distribute software packages and updates |
| 6 | **Log Storage** | Store application logs, access logs, audit trails |
| 7 | **Machine Learning** | Store training datasets for ML models |
| 8 | **Disaster Recovery** | Cross-region replication for business continuity |
| 9 | **Archive/Compliance** | Long-term storage for regulatory compliance (Glacier) |
| 10 | **Content Delivery** | Origin storage for CloudFront CDN |
| 11 | **Mobile App Backend** | Store user uploads (photos, documents) from mobile apps |
| 12 | **CI/CD Artifacts** | Store build artifacts, deployment packages |
| 13 | **Email Attachments** | Store email attachments via Amazon SES |
| 14 | **IoT Data Storage** | Store sensor data from IoT devices |
| 15 | **Data Migration** | Staging area when migrating data to AWS |

---

## 17. S3 Best Practices ✅

### Security Best Practices
1. **Block Public Access** — Enable it by default, only disable when absolutely necessary
2. **Use Bucket Policies** over ACLs — ACLs are legacy
3. **Enable Encryption** — SSE-S3 at minimum, SSE-KMS for sensitive data
4. **Enable Versioning** — Protect against accidental deletion
5. **Enable MFA Delete** — Require MFA to permanently delete versions
6. **Use VPC Endpoints** — Access S3 from EC2 without going through the internet
7. **Enable Access Logging** — Track who accesses what
8. **Use least privilege IAM policies** — Don't give more permissions than needed

### Performance Best Practices
9. **Use multipart upload** for files > 100 MB
10. **Use Transfer Acceleration** for long-distance uploads
11. **Use CloudFront** for frequently accessed content
12. **Use random prefixes** if you have extremely high request rates (S3 handles this automatically now, but it's still good practice)
13. **Use S3 Select** to retrieve only the data you need from an object (instead of downloading the whole file)

### Cost Best Practices
14. **Use Lifecycle Rules** — Automatically transition to cheaper storage classes
15. **Use Intelligent-Tiering** — For data with unknown access patterns
16. **Delete incomplete multipart uploads** — They cost money!
17. **Monitor with S3 Analytics** — Understand your access patterns
18. **Use S3 Inventory** — Get reports on your objects and their storage classes
19. **Enable Requester Pays** — For shared datasets where the downloader pays

---

## 🔄 Quick Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS S3 QUICK SUMMARY                      │
├─────────────────────────────────────────────────────────────┤
│ ✅ S3 = Object storage (unlimited, durable, available)      │
│ ✅ Buckets = Containers | Objects = Files | Keys = Names    │
│ ✅ 7 Storage Classes (Standard → Glacier Deep Archive)      │
│ ✅ 11 9's durability = almost impossible to lose data       │
│ ✅ Security = Bucket Policies + IAM + Encryption            │
│ ✅ Versioning = Keep all versions of files                  │
│ ✅ Lifecycle = Auto-transition or delete objects over time   │
│ ✅ Replication = Auto-copy to another bucket/region         │
│ ✅ Static Hosting = Serve websites directly from S3         │
│ ✅ Pay only for what you use (storage + requests + egress)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎤 Interview Questions (20+)

### Basic Questions

**Q1: What is Amazon S3?**
> S3 (Simple Storage Service) is an object storage service that offers unlimited, highly durable (11 9's), and available storage. You can store and retrieve any amount of data from anywhere on the internet. Data is organized into buckets (containers) and objects (files).

**Q2: What is the maximum size of a single S3 object?**
> 5 TB (terabytes). For uploads larger than 5 GB, you must use multipart upload. AWS recommends multipart upload for files larger than 100 MB.

**Q3: What does "11 nines of durability" mean?**
> 99.999999999% durability means that if you store 10 million objects in S3, you can statistically expect to lose a single object once every 10,000 years. S3 achieves this by storing data across at least 3 Availability Zones.

**Q4: What is the difference between an S3 bucket and an S3 object?**
> A bucket is a container/folder that holds objects. An object is the actual file (data + metadata) stored in the bucket. Bucket names must be globally unique, while object names (keys) must be unique within a bucket.

**Q5: Are S3 bucket names globally unique or region-specific?**
> Globally unique. No two S3 buckets across ALL AWS accounts in the entire world can have the same name. However, buckets are created in a specific region.

### Intermediate Questions

**Q6: Explain the different S3 storage classes.**
> S3 offers 7 storage classes: S3 Standard (frequently accessed data), Intelligent-Tiering (auto-moves between tiers), Standard-IA (infrequent access), One Zone-IA (single AZ, infrequent), Glacier Instant Retrieval (archive, ms retrieval), Glacier Flexible Retrieval (archive, mins-hours retrieval), and Glacier Deep Archive (long-term archive, 12-48 hours retrieval). Each class trades off storage cost vs retrieval cost and speed.

**Q7: What is S3 Versioning and why would you enable it?**
> Versioning keeps multiple versions of an object in the same bucket. If you overwrite or delete a file, previous versions are preserved. Benefits: protection against accidental deletion, ability to recover previous versions, audit trail. Once enabled, versioning can only be suspended, not disabled.

**Q8: What is the difference between S3 Bucket Policy and IAM Policy?**
> Bucket policies are attached to S3 buckets and define what actions are allowed/denied on the bucket (resource-based). IAM policies are attached to IAM users/roles/groups and define what AWS resources the user can access (identity-based). Bucket policies support cross-account access; IAM policies do not directly support cross-account S3 access.

**Q9: How does S3 Lifecycle work?**
> Lifecycle rules automate transitioning objects between storage classes or deleting them. You define rules based on age (days since creation) or date. For example: move to IA after 30 days, move to Glacier after 90 days, delete after 365 days. This helps optimize costs automatically.

**Q10: What types of encryption does S3 support?**
> S3 supports 4 types of server-side encryption: SSE-S3 (S3-managed keys, AES-256, default), SSE-KMS (AWS KMS-managed keys with audit trail), SSE-C (customer-provided keys), and client-side encryption (you encrypt before uploading). S3 also encrypts data in transit using HTTPS/TLS.

**Q11: What is S3 Transfer Acceleration?**
> Transfer Acceleration speeds up long-distance uploads to S3 by routing data through AWS CloudFront edge locations. The data reaches the nearest edge location via the public internet, then travels over AWS's optimized private backbone network to the S3 bucket. It can improve upload speed by 50-500%.

**Q12: Explain Cross-Region Replication (CRR) vs Same-Region Replication (SRR).**
> CRR copies objects between buckets in different AWS regions (for disaster recovery, compliance, latency reduction). SRR copies objects between buckets in the same region (for log aggregation, environment replication). Both require versioning enabled on source and destination. Only new objects are replicated — existing objects require a one-time batch operation.

### Advanced Questions

**Q13: How would you make an S3 bucket publicly accessible for a static website?**
> 1) Disable "Block Public Access" settings on the bucket. 2) Add a bucket policy granting `s3:GetObject` to `Principal: "*"` for all objects. 3) Enable Static Website Hosting in bucket properties. 4) Set index and error documents. The website URL will be `http://<bucket>.s3-website-<region>.amazonaws.com`.

**Q14: How do you secure data in S3?**
> Use multiple layers: 1) Block Public Access (default ON), 2) Bucket policies with least-privilege, 3) IAM policies for user access control, 4) SSE-S3 or SSE-KMS encryption at rest, 5) HTTPS for encryption in transit, 6) Versioning + MFA Delete to prevent accidental deletion, 7) VPC endpoints for private access from EC2, 8) S3 Access Logs and CloudTrail for auditing, 9) Object Lock for WORM (Write Once Read Many) compliance.

**Q15: What is S3 Select?**
> S3 Select lets you use SQL expressions to retrieve only a subset of data from an object (CSV, JSON, Parquet). Instead of downloading a 1 GB CSV file to find 10 rows, S3 Select runs the query on S3's side and returns only the matching rows. This reduces data transfer and processing time by up to 400%.

**Q16: What is S3 Object Lock?**
> Object Lock lets you store objects in a WORM (Write Once Read Many) model. Once locked, an object version cannot be deleted or overwritten for a fixed retention period or indefinitely (legal hold). It's used for regulatory compliance (financial records, healthcare data). Requires versioning to be enabled.

**Q17: How would you optimize S3 costs for a company storing 100 TB of data?**
> 1) Analyze access patterns using S3 Analytics, 2) Use Intelligent-Tiering for unknown patterns, 3) Set up lifecycle rules to move old data to IA → Glacier → Deep Archive, 4) Delete incomplete multipart uploads, 5) Use S3 Inventory to find and clean up unnecessary data, 6) Use Requester Pays for shared datasets, 7) Compress files before uploading, 8) Use S3 Select instead of downloading full objects.

**Q18: What is an S3 presigned URL?**
> A presigned URL grants temporary, time-limited access to a private S3 object. You generate the URL using your AWS credentials, and anyone with the URL can upload or download the object until the URL expires. Default expiration is 1 hour (max 7 days with IAM user credentials). It's commonly used for allowing frontend apps to upload directly to S3 without exposing AWS credentials.

**Q19: What happens when you delete an object in a versioned bucket?**
> S3 doesn't actually delete the object. Instead, it inserts a "delete marker" as the current version. The object appears deleted, but all previous versions still exist. To truly delete, you must specify the exact Version ID. To restore, delete the delete marker.

**Q20: What is S3 Event Notification and what destinations does it support?**
> S3 Event Notifications trigger actions when events occur in a bucket (object created, deleted, restored, etc.). Supported destinations: Amazon SNS (notifications), Amazon SQS (message queuing), AWS Lambda (serverless functions), and Amazon EventBridge (event routing to 20+ services). Use case example: trigger a Lambda function to create image thumbnails when a photo is uploaded.

**Q21: How does S3 handle consistency?**
> As of December 2020, S3 provides strong read-after-write consistency for all operations. This means: immediately after a PUT (new or overwrite), a GET will return the latest version. Immediately after a DELETE, a GET will reflect the deletion. There is no longer "eventual consistency" for overwrite PUTs or DELETEs.

**Q22: What is the difference between S3 and EBS and EFS?**
> S3 is object storage (HTTP API access, unlimited, for files/backups/websites). EBS is block storage (attached to a single EC2 instance, like a hard drive, for OS and databases). EFS is file storage (shared NFS across multiple EC2 instances, for shared application data). S3 is accessed via API, EBS via mount point on EC2, EFS via NFS mount across multiple EC2 instances.

**Q23: What is S3 Multipart Upload?**
> Multipart upload breaks a large file into smaller parts, uploads them in parallel, and then assembles them on S3. Benefits: improved throughput (parallel uploads), resume after failure (only re-upload failed parts), begin upload before knowing total size. Required for files > 5 GB, recommended for files > 100 MB. Parts can be 5 MB to 5 GB each, maximum 10,000 parts.

---

## 🚀 What's Next?

In the next guide, we'll get hands-on and learn how to:
- Create an S3 bucket step-by-step in the AWS Console
- Upload, download, and manage files
- Make objects public
- Use AWS CLI to manage S3
- Set up static website hosting
- Configure lifecycle rules and versioning

Move on to: **14-create-s3-bucket-upload-files.md** →
