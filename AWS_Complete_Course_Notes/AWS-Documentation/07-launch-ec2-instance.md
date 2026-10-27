# 📘 Module 7: Launch Your First EC2 Instance — Complete Step-by-Step Guide

---

## 📋 Table of Contents

1. [What You'll Learn](#1--what-youll-learn)
2. [Prerequisites](#2--prerequisites)
3. [Main Content — Step-by-Step Launch Guide](#3--main-content--step-by-step-launch-guide)
4. [Hands-On Practice](#4--hands-on-practice)
5. [Common Mistakes](#5--common-mistakes)
6. [Quick Summary](#6--quick-summary)
7. [Interview Questions (15+)](#7--interview-questions-15)
8. [What's Next](#8--whats-next)

---

## 1. 🎯 What You'll Learn

By the end of this module, you will be able to:

- ✅ Launch an EC2 instance from scratch using the AWS Management Console
- ✅ Choose the right AMI (Amazon Machine Image) for your workload
- ✅ Select a suitable instance type and understand free tier limits
- ✅ Create and manage key pairs for SSH access
- ✅ Configure network settings — VPC, subnets, public IPs, and security groups
- ✅ Attach and configure storage volumes
- ✅ Use **User Data** scripts to automate instance setup on first boot
- ✅ Navigate and understand every panel on the EC2 Dashboard
- ✅ Manage instance lifecycle — start, stop, reboot, terminate
- ✅ Resize (change) an instance type
- ✅ Create a custom AMI from a running instance
- ✅ Allocate, associate, and release Elastic IPs
- ✅ Apply tagging best practices for cost management and organization
- ✅ Set up CloudWatch basic monitoring
- ✅ Estimate costs and stay within the AWS Free Tier
- ✅ Troubleshoot common launch errors
- ✅ Answer 15+ EC2 interview questions confidently

---

## 2. 🔧 Prerequisites

Before you begin, make sure you have the following ready:

### 2.1 AWS Account

- A valid **AWS account** (see Module 2 for sign-up instructions)
- A **credit/debit card** linked to the account (required even for free tier)
- Access to the **AWS Management Console** at [https://console.aws.amazon.com](https://console.aws.amazon.com)

### 2.2 IAM User with Proper Permissions

> ⚠️ **Never use your root account** for daily tasks. Always create an IAM user.

Your IAM user needs at minimum these permissions:

| Permission Policy              | Purpose                                      |
|---------------------------------|----------------------------------------------|
| `AmazonEC2FullAccess`          | Launch, manage, and terminate EC2 instances  |
| `AmazonVPCReadOnlyAccess`     | View VPC and subnet information              |
| `IAMUserChangePassword`       | Allow the user to change their own password  |
| `CloudWatchReadOnlyAccess`    | View monitoring metrics                      |

**Quick IAM Setup:**

```
1. Go to IAM Console → Users → Add User
2. Username: ec2-admin
3. Access type: ✅ AWS Management Console access
4. Attach policies: AmazonEC2FullAccess, AmazonVPCReadOnlyAccess
5. Download the credentials CSV file
```

### 2.3 Other Prerequisites

- 🌐 A modern web browser (Chrome, Firefox, or Edge)
- 📝 A text editor to save key pair files (Notepad, VS Code)
- 💻 An SSH client:
  - **macOS/Linux**: Built-in Terminal
  - **Windows**: PuTTY, Windows Terminal, or Git Bash

---

## 3. 🚀 Main Content — Step-by-Step Launch Guide

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     AWS CLOUD                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │                   REGION (e.g., us-east-1)        │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │          VPC (Virtual Private Cloud)        │  │  │
│  │  │  ┌───────────────────────────────────────┐  │  │  │
│  │  │  │     PUBLIC SUBNET (e.g., 10.0.1.0/24) │  │  │  │
│  │  │  │                                       │  │  │  │
│  │  │  │   ┌─────────────────────────────┐     │  │  │  │
│  │  │  │   │      EC2 INSTANCE           │     │  │  │  │
│  │  │  │   │  ┌───────┐  ┌────────────┐  │     │  │  │  │
│  │  │  │   │  │  AMI  │  │  Key Pair   │  │     │  │  │  │
│  │  │  │   │  └───────┘  └────────────┘  │     │  │  │  │
│  │  │  │   │  ┌───────┐  ┌────────────┐  │     │  │  │  │
│  │  │  │   │  │  EBS  │  │  Sec Group  │  │     │  │  │  │
│  │  │  │   │  └───────┘  └────────────┘  │     │  │  │  │
│  │  │  │   └─────────────────────────────┘     │  │  │  │
│  │  │  └───────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Internet Gateway ←→ Public IP / Elastic IP             │
└─────────────────────────────────────────────────────────┘
```

---

### Step 1: Login to AWS Console 🔐

1. Open your browser and go to **[https://console.aws.amazon.com](https://console.aws.amazon.com)**
2. Select **"IAM user"** (not root user)
3. Enter your **Account ID** (12-digit number) or **Account alias**
4. Click **Next**
5. Enter your **IAM username** and **password**
6. Click **Sign in**
7. If MFA is enabled, enter your 6-digit code from your authenticator app

> 💡 **Tip:** Bookmark the sign-in URL: `https://<account-id>.signin.aws.amazon.com/console`

**After Login:**
- You'll land on the **AWS Management Console Home** page
- The top-right corner shows your current **Region** (e.g., `US East (N. Virginia) us-east-1`)
- ⚠️ **Always verify your region** before launching resources — instances are region-specific!

---

### Step 2: Navigate to EC2 Dashboard 🗺️

There are three ways to get to the EC2 Dashboard:

**Method 1 — Search Bar (Fastest):**
1. Click the **search bar** at the top of the console (or press `Alt + S`)
2. Type **"EC2"**
3. Click **"EC2"** under Services

**Method 2 — Services Menu:**
1. Click **"Services"** in the top-left corner
2. Under **"Compute"**, click **"EC2"**

**Method 3 — Pin to Navigation:**
1. After finding EC2, click the ⭐ **star icon** to pin it to your favorites bar
2. Next time, it will appear in the top navigation bar

You are now on the **EC2 Dashboard** — the central hub for all EC2 operations.

---

### Step 3: Click Launch Instance ▶️

1. On the EC2 Dashboard, find the **"Launch instance"** button (bright orange)
2. Click **"Launch instance"**
3. You'll see a **new wizard page** with multiple configuration sections

> 🆕 AWS now uses the **new launch experience** (single-page wizard) that shows all settings on one page.

The wizard sections from top to bottom:
1. Name and tags
2. Application and OS Images (AMI)
3. Instance type
4. Key pair (login)
5. Network settings
6. Configure storage
7. Advanced details

---

### Step 4: Name and Tags 🏷️

1. In the **"Name"** field, type a descriptive name for your instance
   - Example: `my-first-web-server`
2. Click **"Add additional tags"** to add more tags (optional but recommended)

**Recommended Tags:**

| Tag Key       | Tag Value               | Purpose                        |
|---------------|-------------------------|--------------------------------|
| `Name`        | `my-first-web-server`   | Identifies the instance        |
| `Environment` | `Development`           | Tracks environment type        |
| `Project`     | `Learning-AWS`          | Groups resources by project    |
| `Owner`       | `your-name`             | Identifies who created it      |
| `CostCenter`  | `training`              | For billing/cost allocation    |

> 💡 **Best Practice:** Always tag every resource. It makes billing, searching, and organizing 100x easier.

---

### Step 5: Choose AMI (Amazon Machine Image) 🖼️

An **AMI** is a template that contains the operating system, application server, and applications. Think of it as a "snapshot" or "template" to create your server.

Click on **"Browse more AMIs"** to see all options, or use the Quick Start tab.

#### Common AMI Choices:

| AMI                     | Description                                          | Best For                           | Free Tier? |
|-------------------------|------------------------------------------------------|------------------------------------|------------|
| **Amazon Linux 2023**   | AWS's own Linux distribution, optimized for AWS      | General purpose, AWS-native apps   | ✅ Yes     |
| **Amazon Linux 2**      | Previous gen AWS Linux, long-term support             | Legacy apps, stable environments   | ✅ Yes     |
| **Ubuntu Server 22.04** | Popular, community-driven Linux distribution          | Web servers, development, Docker   | ✅ Yes     |
| **Ubuntu Server 24.04** | Latest Ubuntu LTS release                            | Newest features and packages       | ✅ Yes     |
| **Red Hat Enterprise**  | Enterprise-grade Linux with commercial support       | Enterprise / production workloads  | ❌ No      |
| **Windows Server 2022** | Microsoft Windows with full GUI or Core              | .NET apps, Active Directory, IIS   | ✅ Yes     |
| **SUSE Linux**          | Enterprise Linux from SUSE                           | SAP workloads                      | ❌ No      |

#### Detailed AMI Explanations:

**🐧 Amazon Linux 2023 (AL2023):**
- AWS's own Linux OS — built and maintained by AWS
- Pre-installed with AWS CLI, SSM Agent, and CloudWatch agent
- Optimized for best performance on EC2
- Uses `dnf` package manager (like Fedora)
- Default user for SSH: `ec2-user`
- **Recommended for beginners** — tightest integration with AWS services

**🐧 Ubuntu Server:**
- The most popular Linux distribution worldwide
- Huge community support and extensive documentation
- Uses `apt` package manager
- Default user for SSH: `ubuntu`
- Excellent for web servers, containers, and development
- LTS (Long Term Support) versions get 5 years of security updates

**🪟 Windows Server:**
- Full Microsoft Windows environment
- Connect via **RDP (Remote Desktop Protocol)** on port 3389 (not SSH)
- Comes in **Full Desktop** (with GUI) or **Core** (command-line only) editions
- Default user: `Administrator`
- Password is decrypted using your key pair after launch
- ⚠️ Windows instances use **more memory** — `t2.micro` may feel slow

**For this guide, select: ✅ Amazon Linux 2023 AMI (Free tier eligible)**

Make sure the architecture is set to **64-bit (x86)**.

---

### Step 6: Choose Instance Type 💻

The **instance type** determines the hardware (CPU, memory, network) of your server.

#### Instance Type Naming Convention:

```
   t2.micro
   │ │  │
   │ │  └── Size (nano, micro, small, medium, large, xlarge, 2xlarge...)
   │ └──── Generation (1, 2, 3, 4, 5...)
   └────── Family (t=burstable, m=general, c=compute, r=memory, g=GPU...)
```

#### Common Instance Types:

| Instance Type | vCPUs | Memory (GiB) | Network        | Free Tier? | Use Case                     |
|---------------|-------|---------------|----------------|------------|------------------------------|
| `t2.micro`    | 1     | 1             | Low to Moderate| ✅ Yes     | Learning, small apps         |
| `t2.small`    | 1     | 2             | Low to Moderate| ❌ No      | Light production workloads   |
| `t2.medium`   | 2     | 4             | Low to Moderate| ❌ No      | Small databases, dev servers |
| `t3.micro`    | 2     | 1             | Up to 5 Gbps   | ✅ Yes*    | Similar to t2, newer gen     |
| `m5.large`    | 2     | 8             | Up to 10 Gbps  | ❌ No      | General-purpose production   |
| `c5.large`    | 2     | 4             | Up to 10 Gbps  | ❌ No      | Compute-intensive tasks      |
| `r5.large`    | 2     | 16            | Up to 10 Gbps  | ❌ No      | Memory-intensive tasks       |

> 🆓 **Free Tier:** `t2.micro` (or `t3.micro` in regions where t2 is unavailable) gives you **750 hours/month** for the first **12 months**. That's enough to run one instance 24/7 for free!

**For this guide, select: ✅ t2.micro (Free tier eligible)**

#### Understanding Burstable Instances (T-family):

T2/T3 instances earn **CPU credits** when idle and spend them during bursts of activity:

```
CPU Credits:
  ┌─────────────────────────────────────┐
  │ Idle      ████░░░░░░░ Earning       │
  │ Burst     ░░░░░░████████ Spending   │
  │ Baseline  ███████████ Steady 10%    │
  └─────────────────────────────────────┘
  
  t2.micro baseline = 10% CPU
  When credits run out = performance drops to baseline
```

---

### Step 7: Key Pair (Login) 🔑

A **key pair** is a set of cryptographic keys used to securely connect to your instance via SSH. AWS keeps the public key; you download the private key.

#### Create a New Key Pair:

1. Click **"Create new key pair"**
2. **Key pair name:** `my-first-keypair` (use a descriptive name)
3. **Key pair type:** Choose `RSA` (widely supported)
4. **Private key file format:**

| Format  | Used With               | OS                  |
|---------|-------------------------|---------------------|
| `.pem`  | OpenSSH, Terminal, Git Bash | macOS, Linux, Windows (OpenSSH) |
| `.ppk`  | PuTTY                   | Windows (PuTTY)     |

5. Click **"Create key pair"**
6. The `.pem` or `.ppk` file **downloads automatically** to your computer

> ⚠️ **CRITICAL:** You can only download the private key **ONCE**. If you lose it, you cannot connect to your instance via SSH. You'll need to create a new key pair.

#### Save Your Key Pair Securely:

```bash
# On macOS/Linux — move to a safe directory and set permissions
mkdir -p ~/.ssh
mv ~/Downloads/my-first-keypair.pem ~/.ssh/
chmod 400 ~/.ssh/my-first-keypair.pem

# On Windows — move to a known folder
# Move the .pem file to C:\Users\YourName\.ssh\
# Right-click → Properties → Security → Remove all users except your own
```

> 💡 **Tip:** If you chose `.pem` but need `.ppk` for PuTTY later, use **PuTTYgen** to convert it.

---

### Step 8: Network Settings 🌐

This is one of the most important sections. It controls who can access your instance and how.

#### 8.1 VPC (Virtual Private Cloud)

- A **VPC** is your own isolated network within AWS
- AWS creates a **default VPC** in every region automatically
- For beginners: **Use the default VPC**
- Each VPC has a CIDR block (e.g., `172.31.0.0/16`)

#### 8.2 Subnet

- Subnets divide your VPC into smaller segments
- Each subnet lives in one **Availability Zone** (AZ)
- **Public subnets** have a route to the Internet Gateway
- For beginners: Select **"No preference"** (AWS picks a public subnet for you)

#### 8.3 Auto-assign Public IP

- Set to **"Enable"** — this gives your instance a public IP address
- Without a public IP, you cannot reach the instance from the internet
- ⚠️ Public IPs are **dynamic** — they change when you stop/start the instance
- For a **static** public IP, use an **Elastic IP** (covered later)

#### 8.4 Security Group Rules 🛡️

A **Security Group** acts as a virtual firewall for your instance. It controls what traffic is allowed IN (inbound) and OUT (outbound).

**Click "Create security group"** and configure:

**Security Group Name:** `my-web-server-sg`
**Description:** `Allow SSH, HTTP, and HTTPS access`

**Inbound Rules:**

| Type   | Protocol | Port Range | Source          | Description                  |
|--------|----------|------------|-----------------|------------------------------|
| SSH    | TCP      | 22         | My IP           | SSH access from your IP only |
| HTTP   | TCP      | 80         | 0.0.0.0/0       | Web traffic from anywhere    |
| HTTPS  | TCP      | 443        | 0.0.0.0/0       | Secure web traffic           |

**Outbound Rules (Default):**

| Type        | Protocol | Port Range | Destination | Description            |
|-------------|----------|------------|-------------|------------------------|
| All traffic | All      | All        | 0.0.0.0/0   | Allow all outbound     |

> 🔒 **Security Best Practice:**
> - **Never** set SSH source to `0.0.0.0/0` (anywhere) — this allows the entire internet to try connecting
> - Use **"My IP"** to restrict SSH to your current IP address only
> - You can always update security group rules later without relaunching the instance

**Adding Rules Step-by-Step:**
1. Click **"Add security group rule"**
2. Select **Type** → SSH
3. Set **Source type** → My IP (auto-fills your current IP address)
4. Click **"Add security group rule"** again
5. Select **Type** → HTTP
6. Set **Source type** → Anywhere (0.0.0.0/0)
7. Repeat for HTTPS if needed

---

### Step 9: Configure Storage 💾

Storage determines the disk space attached to your instance.

#### Default Settings:

| Setting         | Default Value | Description                           |
|-----------------|---------------|---------------------------------------|
| Volume type     | gp3           | General Purpose SSD (latest gen)      |
| Size            | 8 GiB         | Sufficient for most learning purposes |
| IOPS            | 3000          | Input/Output operations per second    |
| Throughput      | 125 MiB/s     | Data transfer speed                   |
| Delete on term. | ✅ Yes        | Volume is deleted when instance dies  |
| Encryption      | ❌ No         | Not encrypted by default              |

#### EBS Volume Types:

| Volume Type | Name                  | Max IOPS  | Max Throughput | Use Case                    | Cost       |
|-------------|-----------------------|-----------|----------------|-----------------------------|------------|
| `gp3`       | General Purpose SSD   | 16,000    | 1,000 MiB/s    | Most workloads (default)    | $0.08/GiB  |
| `gp2`       | General Purpose SSD   | 16,000    | 250 MiB/s      | Previous default            | $0.10/GiB  |
| `io1`/`io2` | Provisioned IOPS SSD  | 64,000    | 1,000 MiB/s    | High-performance databases  | $0.125/GiB |
| `st1`       | Throughput Optimized HDD| 500     | 500 MiB/s      | Big data, data warehouses   | $0.045/GiB |
| `sc1`       | Cold HDD              | 250       | 250 MiB/s      | Infrequently accessed data  | $0.015/GiB |

> 🆓 **Free Tier:** 30 GiB of EBS storage (gp2/gp3) per month for 12 months.

**For this guide:** Keep the default 8 GiB gp3. You can always increase the size later (but you can't shrink it).

**To modify storage:**
1. Change size from 8 to your desired amount (e.g., 20 GiB)
2. Optionally change volume type
3. ⚠️ Uncheck **"Delete on termination"** if you want to keep the data after the instance is terminated

---

### Step 10: Advanced Details — User Data Script 📜

**User Data** is a powerful feature that lets you run scripts automatically when your instance **first boots up**. It's perfect for installing software, configuring settings, or downloading files.

Scroll down to **"Advanced details"** → find the **"User data"** text box.

#### Example: Install and Start Apache Web Server

```bash
#!/bin/bash
# Update the system
yum update -y

# Install Apache web server
yum install -y httpd

# Start Apache
systemctl start httpd

# Enable Apache to start on boot
systemctl enable httpd

# Create a simple web page
echo "<html>
<head><title>My First EC2 Instance</title></head>
<body style='text-align:center; font-family:Arial; padding:50px;'>
  <h1>🎉 Hello from EC2!</h1>
  <p>This page is served from my first AWS EC2 instance.</p>
  <p>Instance launched on: $(date)</p>
  <p>Hostname: $(hostname)</p>
</body>
</html>" > /var/www/html/index.html

# Print completion message to logs
echo "User data script completed successfully" >> /var/log/user-data.log
```

> 💡 **User Data Tips:**
> - Scripts must start with `#!/bin/bash` (Linux) or `<powershell>` (Windows)
> - Scripts run as **root** user — no need for `sudo`
> - Scripts run **only once** on the first boot (by default)
> - Logs are stored at `/var/log/cloud-init-output.log`
> - Maximum size: **16 KB** (use S3 for larger scripts)
> - If the script fails, the instance still launches — check logs to debug

#### Windows User Data Example:

```powershell
<powershell>
# Install IIS Web Server
Install-WindowsFeature -name Web-Server -IncludeManagementTools

# Create a simple web page
Set-Content -Path "C:\inetpub\wwwroot\index.html" -Value "<h1>Hello from Windows EC2!</h1>"
</powershell>
```

---

### Step 11: Review and Launch ✅

1. **Review all settings** in the **Summary panel** on the right side:
   - Number of instances: `1`
   - AMI: Amazon Linux 2023
   - Instance type: `t2.micro`
   - Key pair: `my-first-keypair`
   - Network: Default VPC with public IP enabled
   - Security group: SSH (22), HTTP (80), HTTPS (443)
   - Storage: 8 GiB gp3
2. Click the big orange **"Launch instance"** button
3. You'll see a **success message** with the instance ID (e.g., `i-0abcdef1234567890`)
4. Click **"View all instances"** to go to the Instances page

> 🎉 **Congratulations!** Your EC2 instance is now launching!

---

### EC2 Dashboard Walkthrough 📊

After launching, let's explore the EC2 Dashboard panels:

```
┌──────────────────────────────────────────────────────────┐
│                    EC2 DASHBOARD                         │
├────────────────────┬─────────────────────────────────────┤
│  LEFT SIDEBAR      │  MAIN CONTENT AREA                  │
│                    │                                     │
│  📦 Instances      │  Resources Summary:                 │
│    ├─ Instances    │  ┌─────────┬─────────┬─────────┐   │
│    ├─ Instance     │  │Running  │Stopped  │Volumes  │   │
│    │  Types        │  │ 1       │ 0       │ 1       │   │
│    └─ Launch       │  └─────────┴─────────┴─────────┘   │
│       Templates    │                                     │
│                    │  Service Health:                     │
│  🖼️ Images         │  ┌─────────────────────────────┐   │
│    ├─ AMIs         │  │ All services operational ✅  │   │
│    └─ AMI Catalog  │  └─────────────────────────────┘   │
│                    │                                     │
│  💾 EBS            │  Account Attributes:                │
│    ├─ Volumes      │  ┌─────────────────────────────┐   │
│    └─ Snapshots    │  │ Default VPC: vpc-xxxxxx      │   │
│                    │  │ Supported: All instance types│   │
│  🌐 Network       │  └─────────────────────────────┘   │
│    ├─ Security     │                                     │
│    │  Groups       │  Scheduled Events:                  │
│    ├─ Elastic IPs  │  ┌─────────────────────────────┐   │
│    ├─ Placement    │  │ No scheduled events          │   │
│    │  Groups       │  └─────────────────────────────┘   │
│    └─ Key Pairs    │                                     │
│                    │                                     │
│  ⚖️ Load Balancing │                                     │
│  📈 Auto Scaling   │                                     │
└────────────────────┴─────────────────────────────────────┘
```

#### Key Dashboard Panels Explained:

| Panel              | What It Shows                                                  |
|--------------------|---------------------------------------------------------------|
| **Instances**      | All your EC2 instances with status, type, IPs, and more       |
| **Instance Types** | Browse all available instance types and their specifications   |
| **Launch Templates**| Saved configurations for quickly launching similar instances  |
| **AMIs**           | Your custom AMIs and shared AMIs available to you             |
| **Volumes**        | EBS volumes (disks) attached to or available for instances     |
| **Snapshots**      | Point-in-time backups of your EBS volumes                     |
| **Security Groups**| Firewall rules controlling instance traffic                   |
| **Elastic IPs**    | Static public IP addresses you've allocated                   |
| **Key Pairs**      | SSH key pairs for instance access                             |
| **Load Balancers** | Distribute traffic across multiple instances                  |
| **Auto Scaling**   | Automatically adjust instance count based on demand           |

---

### Instance States Explained 🔄

An EC2 instance goes through several states during its lifecycle:

```
  ┌──────────┐     ┌──────────┐     ┌──────────┐
  │ PENDING  │────▶│ RUNNING  │────▶│ STOPPING │
  │ (yellow) │     │ (green)  │     │ (yellow) │
  └──────────┘     └────┬─────┘     └────┬─────┘
                        │                │
                        │                ▼
                        │           ┌──────────┐
                        │           │ STOPPED  │
                        │           │ (red)    │
                        │           └────┬─────┘
                        │                │
                        ▼                │ (can restart)
                   ┌────────────┐        │
                   │ SHUTTING   │        │
                   │ DOWN       │◀───────┘ (or terminate)
                   │ (yellow)   │
                   └─────┬──────┘
                         │
                         ▼
                   ┌────────────┐
                   │ TERMINATED │
                   │ (red)      │
                   └────────────┘
```

| State            | Icon Color | Description                                           | Billing?  |
|------------------|------------|-------------------------------------------------------|-----------|
| **Pending**      | 🟡 Yellow  | Instance is preparing to launch                       | ❌ No     |
| **Running**      | 🟢 Green   | Instance is fully operational and accessible           | ✅ Yes    |
| **Stopping**     | 🟡 Yellow  | Instance is in the process of stopping                 | ❌ No     |
| **Stopped**      | 🔴 Red     | Instance is shut down but can be restarted             | ❌ No*    |
| **Shutting-down** | 🟡 Yellow | Instance is being permanently terminated               | ❌ No     |
| **Terminated**   | 🔴 Red     | Instance is permanently deleted (visible for ~1 hour)  | ❌ No     |

> \* **Stopped instances** don't incur compute charges, but you **still pay for EBS storage** and any Elastic IPs not attached to a running instance.

---

### Managing Instances 🛠️

#### Start an Instance

1. Go to **EC2 → Instances**
2. Select the **stopped instance** (checkbox)
3. Click **Instance state** (dropdown at top) → **Start instance**
4. The instance transitions: `Stopped → Pending → Running`
5. ⚠️ The **public IP will change** after restart (unless you have an Elastic IP)

#### Stop an Instance

1. Select the **running instance**
2. Click **Instance state** → **Stop instance**
3. Click **"Stop"** in the confirmation dialog
4. The instance transitions: `Running → Stopping → Stopped`
5. 💡 Data on EBS volumes is **preserved** — nothing is lost
6. ⚠️ Data on **instance store** (ephemeral) volumes **is lost**

#### Reboot an Instance

1. Select the **running instance**
2. Click **Instance state** → **Reboot instance**
3. Click **"Reboot"** in the confirmation dialog
4. The instance restarts but **does not change** its public IP
5. This is equivalent to an OS-level `sudo reboot`
6. 💡 **Reboot is safer than stop/start** — no IP change, faster recovery

#### Terminate an Instance ☠️

1. Select the instance
2. Click **Instance state** → **Terminate instance**
3. Click **"Terminate"** in the confirmation dialog

> ⚠️ **WARNINGS:**
> - Termination is **PERMANENT** — the instance cannot be recovered
> - All data on the **root EBS volume** is deleted (if "Delete on Termination" is checked)
> - Additional EBS volumes may or may not be deleted based on their settings
> - The instance appears as "terminated" for about 1 hour, then disappears
> - **Enable "Termination Protection"** to prevent accidental deletion:
>   - Right-click instance → Instance Settings → Change Termination Protection → Enable

---

### Resize / Change Instance Type 📐

You can change the instance type (e.g., from `t2.micro` to `t2.small`) if you need more CPU or memory.

**Steps:**

1. **Stop** the instance first (Instance state → Stop)
2. Wait until the state shows **"Stopped"**
3. Select the instance → **Actions** → **Instance settings** → **Change instance type**
4. Select the new instance type from the dropdown (e.g., `t2.small`)
5. Click **"Apply"**
6. **Start** the instance (Instance state → Start)

```
  STOP instance
       │
       ▼
  Change instance type
  (Actions → Instance settings → Change instance type)
       │
       ▼
  Select new type (e.g., t2.small)
       │
       ▼
  START instance
       │
       ▼
  Instance runs with new hardware ✅
```

> ⚠️ **Important Notes:**
> - The instance **must be stopped** before changing the type
> - The public IP address **will change** (unless you have an Elastic IP)
> - Not all instance type changes are compatible (e.g., some require different virtualization types)
> - You will be billed at the **new instance type's rate** after starting

---

### Create a Custom AMI from Running Instance 📸

A **custom AMI** is a snapshot of your instance that you can use to launch identical copies.

**Use Cases:**
- Save a configured instance as a template
- Deploy multiple identical servers
- Share your setup with team members
- Create backups before major changes

**Steps:**

1. Select the instance you want to image
2. Click **Actions** → **Image and templates** → **Create image**
3. Fill in the details:
   - **Image name:** `my-web-server-ami-v1`
   - **Image description:** `Amazon Linux 2023 with Apache web server configured`
   - **No reboot:** ⚠️ Uncheck this unless you want the instance to continue running (may result in inconsistent data)
4. Review the **EBS snapshots** that will be included
5. Click **"Create image"**
6. Go to **EC2 → AMIs** (left sidebar) to see your new AMI
7. Status will change from `Pending` → `Available` (takes a few minutes)

**Launch from Custom AMI:**
1. Go to **EC2 → AMIs**
2. Select your custom AMI
3. Click **"Launch instance from AMI"**
4. Follow the normal launch wizard (the AMI is pre-selected)

---

### Elastic IP: Allocate, Associate, Disassociate, Release 🌍

An **Elastic IP (EIP)** is a static, public IPv4 address that you own until you release it. Unlike regular public IPs, it does not change when you stop/start your instance.

#### Allocate an Elastic IP:

1. Go to **EC2 → Elastic IPs** (left sidebar under Network & Security)
2. Click **"Allocate Elastic IP address"**
3. Keep the default settings (Amazon's pool of IPv4 addresses)
4. Add a tag: `Name` = `my-web-server-eip`
5. Click **"Allocate"**
6. You'll see your new Elastic IP (e.g., `54.123.45.67`)

#### Associate with an Instance:

1. Select the Elastic IP
2. Click **Actions** → **Associate Elastic IP address**
3. **Resource type:** Instance
4. **Instance:** Select your running instance from the dropdown
5. **Private IP address:** Keep default
6. ✅ Check **"Allow this Elastic IP address to be reassociated"** (optional)
7. Click **"Associate"**

Now your instance has a **permanent public IP** that won't change!

#### Disassociate from an Instance:

1. Select the Elastic IP
2. Click **Actions** → **Disassociate Elastic IP address**
3. Click **"Disassociate"**

> ⚠️ Once disassociated, your instance goes back to a dynamic public IP (or no public IP).

#### Release an Elastic IP:

1. Select the Elastic IP (must be disassociated first)
2. Click **Actions** → **Release Elastic IP address**
3. Click **"Release"**

> 💰 **Billing Warning:** AWS charges **$0.005/hour** (~$3.60/month) for Elastic IPs that are:
> - Allocated but **not associated** with a running instance
> - Associated with a **stopped** instance
> - You have **more than one** EIP associated with an instance
>
> **Rule of thumb:** If you're not using it, release it!

---

### Tags: Best Practices and Examples 🏷️

Tags are key-value pairs that help you organize, manage, and track costs of AWS resources.

#### Tagging Strategy:

| Tag Key            | Example Value           | Purpose                              |
|--------------------|-------------------------|--------------------------------------|
| `Name`             | `prod-web-server-01`   | Human-readable identifier            |
| `Environment`      | `Production`           | Dev / Staging / Production           |
| `Project`          | `E-Commerce`           | Project or application name          |
| `Owner`            | `team-backend`         | Team or person responsible           |
| `CostCenter`       | `CC-1234`              | Billing allocation                   |
| `Application`      | `WordPress`            | Software running on the instance     |
| `Backup`           | `Daily`                | Backup schedule                      |
| `ExpirationDate`   | `2026-12-31`           | When the resource should be reviewed |

#### Tag Best Practices:

1. ✅ **Be consistent** — use the same tag keys across all resources
2. ✅ **Use CamelCase or hyphens** — `CostCenter` or `cost-center` (pick one and stick with it)
3. ✅ **Tag at launch** — easier than tagging later
4. ✅ **Use AWS Tag Editor** to manage tags in bulk (Resource Groups → Tag Editor)
5. ✅ **Enable Cost Allocation Tags** in the Billing console to track costs by tag
6. ❌ **Don't use `aws:` prefix** — it's reserved for AWS-created tags
7. ❌ **Don't include sensitive data** in tag values

---

### CloudWatch Basic Monitoring 📈

**Amazon CloudWatch** automatically collects metrics from your EC2 instances.

#### What You Get for Free:

| Metric              | Description                              | Frequency    |
|---------------------|------------------------------------------|-------------|
| CPUUtilization      | Percentage of CPU being used             | Every 5 min |
| NetworkIn           | Bytes received on all network interfaces | Every 5 min |
| NetworkOut          | Bytes sent on all network interfaces     | Every 5 min |
| DiskReadOps         | Number of read operations                | Every 5 min |
| DiskWriteOps        | Number of write operations               | Every 5 min |
| StatusCheckFailed   | Has the instance passed status checks?   | Every 1 min |

#### How to View Metrics:

1. Select your instance in the EC2 console
2. Click the **"Monitoring"** tab at the bottom
3. You'll see graphs for CPU, Network, Disk, and Status checks
4. Click **"View in CloudWatch"** for more detailed views

#### Enable Detailed Monitoring (Optional):

- Changes metric collection from **every 5 minutes** to **every 1 minute**
- Select instance → **Actions** → **Monitor and troubleshoot** → **Manage detailed monitoring**
- ⚠️ Detailed monitoring costs **$3.50/month per instance** (7 metrics × $0.30 each + first 10 free)

#### Set Up a Billing Alarm (Recommended!):

1. Go to **CloudWatch** console
2. Click **Alarms** → **Create alarm**
3. Click **Select metric** → **Billing** → **Total Estimated Charge**
4. Set threshold: e.g., when `EstimatedCharges > $5`
5. Add notification: Enter your email address
6. Name the alarm: `billing-alarm-5-dollars`
7. Click **Create alarm**
8. ✅ **Confirm the email** you receive from SNS

> 💡 **This is the #1 thing you should do** to avoid surprise AWS bills!

---

### Cost Estimation 💰

#### Free Tier Limits (First 12 Months):

| Service     | Free Tier Allowance                          | After Free Tier          |
|-------------|----------------------------------------------|--------------------------|
| EC2         | 750 hrs/month of t2.micro (Linux or Windows) | ~$0.0116/hr (us-east-1)  |
| EBS         | 30 GiB of gp2/gp3 storage                   | ~$0.08/GiB/month (gp3)   |
| Data Transfer| 100 GB/month outbound (for first 12 months) | ~$0.09/GB after that     |
| Elastic IP  | 1 EIP associated with running instance       | $0.005/hr if unused      |
| CloudWatch  | 10 custom metrics, 10 alarms                | $0.30/metric/month       |

#### Monthly Cost Estimate (Free Tier):

```
Running 1x t2.micro 24/7 for a month:
  EC2 compute:  750 hrs × $0.00 = $0.00  (free tier)
  EBS storage:  8 GiB × $0.00  = $0.00  (within 30 GiB free)
  Data transfer: Minimal        = $0.00  (within 100 GB free)
  ─────────────────────────────────────────
  TOTAL:                          $0.00/month ✅
```

#### Monthly Cost Estimate (After Free Tier):

```
Running 1x t2.micro 24/7 for a month:
  EC2 compute:  730 hrs × $0.0116 = $8.47
  EBS storage:  8 GiB × $0.08    = $0.64
  Data transfer: 10 GB × $0.09   = $0.90
  ─────────────────────────────────────────
  TOTAL:                           ~$10.01/month
```

> 💡 **Cost Saving Tips:**
> - 🛑 **Stop instances** when not in use (evenings, weekends)
> - 🗑️ **Terminate instances** you no longer need
> - 📊 **Use AWS Cost Explorer** to track spending
> - ⏰ **Set billing alarms** (see CloudWatch section above)
> - 🆓 **Use only free-tier eligible** instance types during the learning phase

---

### Common Launch Errors and Fixes 🐛

#### Error 1: InsufficientInstanceCapacity

```
Error: We currently do not have sufficient <instance-type> capacity 
in the Availability Zone you requested.
```

**Cause:** AWS doesn't have enough hardware in the chosen AZ.

**Fixes:**
1. Wait a few minutes and try again
2. Try a **different Availability Zone** (change the subnet)
3. Try a **different instance type** (e.g., `t3.micro` instead of `t2.micro`)
4. Try a **different Region**

---

#### Error 2: InstanceLimitExceeded

```
Error: You have requested more instances than your current instance 
limit allows for the specified instance type.
```

**Cause:** Every AWS account has a default limit on the number of instances per region.

| Instance Family | Default Limit (On-Demand) |
|-----------------|--------------------------|
| Standard (A, C, D, H, I, M, R, T, Z) | 5 vCPUs     |
| All others      | Varies                   |

**Fixes:**
1. **Terminate unused instances** in that region
2. **Request a limit increase:**
   - Go to **Service Quotas** console
   - Search for "Running On-Demand Standard instances"
   - Click **"Request quota increase"**
   - Enter the desired new limit
   - AWS usually approves within 24-48 hours

---

#### Error 3: Invalid Key Pair

```
Error: The key pair 'my-keypair' does not exist.
```

**Cause:** The key pair name you specified doesn't exist in the current region.

**Fixes:**
1. Key pairs are **region-specific** — make sure you're in the correct region
2. Go to **EC2 → Key Pairs** to verify existing key pairs
3. Create a new key pair if needed
4. If you lost the `.pem` file, create a new key pair (you can't recover the old private key)

---

#### Error 4: VPC/Subnet Issues

```
Error: No default VPC for this user / No default subnet found.
```

**Cause:** The default VPC was deleted or doesn't exist in this region.

**Fixes:**
1. **Create a default VPC:**
   - Go to **VPC Console**
   - Click **"Actions"** → **"Create default VPC"**
2. **Or create a custom VPC:**
   - VPC Console → Create VPC
   - Create a subnet
   - Create and attach an Internet Gateway
   - Update route tables

---

#### Error 5: Connection Timeout (SSH)

```
ssh: connect to host <ip> port 22: Connection timed out
```

**Cause:** Security group, network, or key issues.

**Fixes Checklist:**

| Check                                    | How to Fix                                   |
|------------------------------------------|----------------------------------------------|
| Security group allows port 22?           | Add inbound rule: SSH, TCP, 22, Your IP      |
| Instance has a public IP?                | Check instance details or assign Elastic IP   |
| Key pair file permissions correct?       | Run `chmod 400 key.pem` (Linux/Mac)           |
| Using the right username?                | Amazon Linux: `ec2-user`, Ubuntu: `ubuntu`    |
| Instance is in "Running" state?          | Check instance state in console               |
| Your IP changed? (VPN, ISP)             | Update security group source IP               |

---

## 4. 🧪 Hands-On Practice

### Exercise 1: Launch and Connect to an EC2 Instance

**Goal:** Launch a t2.micro instance and connect via SSH.

```bash
# Step 1: Launch instance following the guide above
# Step 2: Wait for "Running" state
# Step 3: Copy the public IP address from the console
# Step 4: Connect via SSH

# For Amazon Linux / Ubuntu:
ssh -i ~/.ssh/my-first-keypair.pem ec2-user@<PUBLIC_IP>

# For Ubuntu:
ssh -i ~/.ssh/my-first-keypair.pem ubuntu@<PUBLIC_IP>

# You should see:
#   __|  __|_  )
#   _|  (     /   Amazon Linux 2023
#  ___|\___|___|
```

### Exercise 2: Deploy a Web Server

**Goal:** Install Apache and verify it's serving pages.

```bash
# After SSHing into the instance:

# Install Apache
sudo yum install -y httpd

# Start Apache
sudo systemctl start httpd
sudo systemctl enable httpd

# Create a custom web page
sudo bash -c 'cat > /var/www/html/index.html << EOF
<!DOCTYPE html>
<html>
<head><title>My EC2 Web Server</title></head>
<body>
  <h1>🚀 My EC2 Web Server is Live!</h1>
  <p>Served from: $(hostname)</p>
  <p>Region: $(curl -s http://169.254.169.254/latest/meta-data/placement/region)</p>
</body>
</html>
EOF'

# Open a browser and go to: http://<PUBLIC_IP>
# You should see your custom web page! 🎉
```

### Exercise 3: Create a Custom AMI and Re-Launch

**Goal:** Save your configured instance as a custom AMI and launch a new instance from it.

1. Follow the "Create a Custom AMI" section above
2. Wait for AMI status to become `Available`
3. Launch a new instance from your custom AMI
4. Verify the new instance has Apache pre-installed
5. Terminate both instances when done

### Exercise 4: Elastic IP Practice

**Goal:** Allocate an Elastic IP, associate it, stop/start the instance, and verify the IP doesn't change.

1. Note your instance's current public IP
2. Allocate an Elastic IP
3. Associate it with your instance
4. Stop the instance, then start it again
5. Verify the public IP is the **same** (Elastic IP persists)
6. Disassociate and release the Elastic IP when done

---

## 5. ❌ Common Mistakes

| # | Mistake                                        | Why It's Bad                                         | How to Avoid                                        |
|---|------------------------------------------------|------------------------------------------------------|-----------------------------------------------------|
| 1 | Using root account for EC2                    | Security risk; no audit trail                        | Always use IAM users with proper permissions         |
| 2 | SSH source set to `0.0.0.0/0`                | Anyone on the internet can attempt SSH               | Use "My IP" or a specific CIDR range                 |
| 3 | Losing the `.pem` key file                   | Can't SSH into instance ever again                   | Store in `~/.ssh/` with `chmod 400`, back up safely  |
| 4 | Forgetting to stop/terminate unused instances | You keep getting billed for compute                  | Set billing alarms; terminate when done              |
| 5 | Not tagging resources                         | Impossible to track costs or ownership               | Tag every resource at creation time                  |
| 6 | Leaving Elastic IPs unassociated             | AWS charges $0.005/hr (~$3.60/mo) for unused EIPs    | Release EIPs you're not using                        |
| 7 | Using wrong AMI username for SSH             | `Permission denied (publickey)` error                 | Amazon Linux: `ec2-user`, Ubuntu: `ubuntu`            |
| 8 | Launching in wrong region                    | Resources are region-specific; can cause confusion    | Always check the region dropdown (top-right corner)   |
| 9 | Ignoring security group outbound rules       | Instance may not be able to download packages         | Ensure outbound rules allow necessary traffic        |
| 10| Not setting up billing alerts                | Surprise bills from forgotten resources               | Set a CloudWatch billing alarm immediately           |

---

## 6. 📝 Quick Summary

```
┌──────────────────────────────────────────────────────────────┐
│                EC2 LAUNCH CHEAT SHEET                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Login → AWS Console                                     │
│  2. Navigate → EC2 Dashboard                                │
│  3. Click → Launch Instance                                 │
│  4. Name → Give a descriptive name + tags                   │
│  5. AMI → Amazon Linux 2023 (free tier) ✅                  │
│  6. Type → t2.micro (free tier) ✅                          │
│  7. Key Pair → Create new (.pem for SSH) 🔑                │
│  8. Network → Default VPC, Public IP: Enable                │
│     Security Group → SSH(22), HTTP(80), HTTPS(443)          │
│  9. Storage → 8 GiB gp3 (default) 💾                       │
│  10. User Data → Optional bash script 📜                    │
│  11. Review → Launch! 🚀                                    │
│                                                              │
│  INSTANCE STATES:                                           │
│  Pending → Running → Stopping → Stopped                    │
│                  └→ Shutting-down → Terminated              │
│                                                              │
│  KEY CONCEPTS:                                              │
│  • AMI = OS template    • Security Group = Firewall         │
│  • Key Pair = SSH key   • EBS = Storage disk                │
│  • Elastic IP = Static public IP (costs $ if unused)        │
│  • User Data = Boot script (runs once on first launch)      │
│  • CloudWatch = Monitoring (CPU, Network, Disk)             │
│                                                              │
│  FREE TIER: 750 hrs/mo t2.micro + 30 GiB EBS (12 months)  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. 🎓 Interview Questions (15+)

### Q1: What is an EC2 instance?
**Answer:** An EC2 (Elastic Compute Cloud) instance is a virtual server in the AWS cloud. It provides resizable compute capacity, allowing you to run applications without investing in hardware. You can launch instances with different operating systems, CPU, memory, and storage configurations based on your needs.

---

### Q2: What is an AMI and why is it important?
**Answer:** An AMI (Amazon Machine Image) is a pre-configured template that contains the operating system, application server, and applications needed to launch an instance. It's important because it ensures consistency — you can launch multiple identical instances from the same AMI, and you can create custom AMIs to save your configurations.

---

### Q3: Explain the difference between stopping and terminating an instance.
**Answer:**
- **Stopping** an instance shuts it down but preserves the instance and its EBS volumes. You can restart it later. You don't pay for compute, but you still pay for EBS storage.
- **Terminating** an instance permanently deletes it. The root EBS volume is also deleted by default. This action is irreversible. You stop paying for everything.

---

### Q4: What is a Security Group? How is it different from a NACL?
**Answer:** A **Security Group** is a virtual firewall at the **instance level** that controls inbound and outbound traffic. It is **stateful** (return traffic is automatically allowed). A **Network ACL (NACL)** operates at the **subnet level**, is **stateless** (you must explicitly allow return traffic), and processes rules in order. Security Groups only have "allow" rules, while NACLs have both "allow" and "deny" rules.

---

### Q5: What happens to the public IP when you stop and start an EC2 instance?
**Answer:** The public IP address **changes** every time you stop and start an instance. To keep a static public IP, you need to allocate and associate an **Elastic IP** address. Elastic IPs remain the same until you release them.

---

### Q6: What is User Data in EC2?
**Answer:** User Data is a feature that allows you to pass a script (bash for Linux or PowerShell for Windows) that runs automatically when the instance **first boots**. It's commonly used to install software, configure settings, or download application code. The script runs as root and has a maximum size of 16 KB.

---

### Q7: Explain EC2 instance types. What does t2.micro mean?
**Answer:** EC2 instance types define the hardware (CPU, memory, storage, network) available to your instance. The naming convention is `<family><generation>.<size>`. For `t2.micro`: `t` = burstable performance family, `2` = second generation, `micro` = smallest size (1 vCPU, 1 GiB RAM). The T-family uses CPU credits — it earns credits when idle and spends them during bursts.

---

### Q8: What is an Elastic IP? When would you use one?
**Answer:** An Elastic IP is a static, public IPv4 address that you allocate to your AWS account. Unlike regular public IPs, it doesn't change when you stop/start instances. Use it when you need a fixed IP for DNS records, whitelisting, or when your application requires a consistent endpoint. AWS charges for unused EIPs to discourage waste.

---

### Q9: How do you change the instance type of a running EC2 instance?
**Answer:** You cannot change the instance type while the instance is running. You must: (1) **Stop** the instance, (2) Go to Actions → Instance Settings → **Change Instance Type**, (3) Select the new type, (4) **Start** the instance. Note that the public IP will change unless you have an Elastic IP.

---

### Q10: What is the difference between EBS-backed and Instance Store-backed instances?
**Answer:**
- **EBS-backed:** Root volume is an EBS volume. Data persists after stop/start. You can stop and start the instance. Can be resized.
- **Instance Store-backed:** Root volume is an ephemeral instance store. Data is **lost** when the instance stops or terminates. Cannot be stopped (only terminated or rebooted). Useful for temporary data, caches, and buffers.

---

### Q11: What are the different EBS volume types and when would you use each?
**Answer:**
- **gp3/gp2 (General Purpose SSD):** Balanced price/performance for most workloads — boot volumes, development, small databases.
- **io1/io2 (Provisioned IOPS SSD):** High-performance for critical applications needing guaranteed IOPS — large databases (Oracle, SAP).
- **st1 (Throughput Optimized HDD):** Large sequential workloads — big data, data warehouses, log processing.
- **sc1 (Cold HDD):** Lowest cost for infrequent access — backups, archives.

---

### Q12: How do you create a custom AMI? Why would you?
**Answer:** To create a custom AMI: select the instance → Actions → Image and Templates → Create Image → name it → create. It takes a snapshot of the EBS volumes and registers it as a new AMI. You'd create one to: save a configured server as a template, launch identical copies quickly, share configurations across teams, or create a backup before major changes.

---

### Q13: What is a key pair? What happens if you lose the private key?
**Answer:** A key pair consists of a **public key** (stored by AWS on the instance) and a **private key** (downloaded by you as a `.pem` or `.ppk` file). It's used for secure SSH access. If you lose the private key, you **cannot download it again**. Your options are: (1) Create a new key pair, (2) Use EC2 Instance Connect or Session Manager if configured, (3) Detach the root volume, attach to another instance, add a new public key, then reattach.

---

### Q14: What is the difference between `.pem` and `.ppk` key formats?
**Answer:** `.pem` is the Privacy Enhanced Mail format used by OpenSSH (Linux, macOS, Windows OpenSSH). `.ppk` is the PuTTY Private Key format used by PuTTY on Windows. You can convert between them using **PuTTYgen** (PuTTY Key Generator).

---

### Q15: How does EC2 pricing work? What's included in the free tier?
**Answer:** EC2 pricing has several models: **On-Demand** (pay per second/hour), **Reserved Instances** (1-3 year commitment for up to 75% discount), **Spot Instances** (bid for unused capacity, up to 90% discount but can be interrupted), and **Savings Plans** (flexible commitment-based discount). The **Free Tier** includes 750 hours/month of t2.micro (or t3.micro) for 12 months, 30 GiB EBS, and 100 GB data transfer out.

---

### Q16: What is CloudWatch and how does it monitor EC2?
**Answer:** **Amazon CloudWatch** is AWS's monitoring service. For EC2, it automatically collects metrics like CPU utilization, network traffic, disk operations, and status checks. **Basic monitoring** (free) collects data every 5 minutes. **Detailed monitoring** (paid) collects every 1 minute. You can create **alarms** to trigger notifications or auto-scaling actions when metrics cross thresholds.

---

### Q17: What are EC2 instance states? Which states incur charges?
**Answer:** EC2 instance states are: **Pending** (launching), **Running** (operational), **Stopping** (shutting down), **Stopped** (shut down, preservable), **Shutting-down** (being terminated), and **Terminated** (permanently deleted). Only the **Running** state incurs compute charges. However, EBS storage charges apply in all states except Terminated (if volumes are deleted), and unused Elastic IPs incur charges.

---

### Q18: How do you troubleshoot "Connection Timed Out" when SSHing to an EC2 instance?
**Answer:** Check these in order: (1) Security group allows inbound SSH (TCP port 22) from your IP, (2) Instance has a public IP or Elastic IP, (3) Instance is in "Running" state, (4) Key file permissions are correct (`chmod 400`), (5) You're using the correct username (`ec2-user`, `ubuntu`, `Administrator`), (6) VPC has an Internet Gateway and correct route table, (7) NACL allows traffic on port 22, (8) Your local firewall/VPN isn't blocking outbound port 22.

---

## 8. ➡️ What's Next

Now that you can launch and manage EC2 instances, here's what to learn next:

| Next Topic                         | What You'll Learn                                           |
|------------------------------------|-------------------------------------------------------------|
| **Module 8: SSH & Connect to EC2** | Detailed SSH setup, PuTTY config, Session Manager, EC2 Instance Connect |
| **Module 9: Security Groups Deep Dive** | Advanced firewall rules, referencing other SGs, best practices |
| **Module 10: EBS Volumes & Snapshots** | Attach/detach volumes, create snapshots, cross-region copy |
| **Module 11: Load Balancers**      | Distribute traffic across multiple instances (ALB, NLB)     |
| **Module 12: Auto Scaling**        | Automatically add/remove instances based on demand          |
| **Module 13: AMI & Launch Templates** | Advanced AMI management, launch templates for automation  |

> 🎯 **Recommended Next Step:** Practice launching 2-3 instances with different AMIs and instance types. Try connecting via SSH, deploying a web server, and then **terminate all instances** to avoid charges.

---

> 📅 *Last updated: June 2026*
> 📝 *Part of the AWS DevOps Learning Series*
