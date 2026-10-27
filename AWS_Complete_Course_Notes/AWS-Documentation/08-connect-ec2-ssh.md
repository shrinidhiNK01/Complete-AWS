# 🔐 Connecting to EC2 Instances via SSH — The Complete Guide

---

## 📋 Table of Contents

1. [What You'll Learn](#1--what-youll-learn)
2. [Prerequisites](#2--prerequisites)
3. [What is SSH?](#3--what-is-ssh)
4. [How SSH Works](#4--how-ssh-works)
5. [Prerequisites for SSH Connection](#5--prerequisites-for-ssh-connection)
6. [Default Usernames for AMIs](#6--default-usernames-for-amis)
7. [Method 1: Terminal (Mac/Linux)](#7--method-1-terminal-maclinux)
8. [Method 2: PuTTY (Windows)](#8--method-2-putty-windows)
9. [Method 3: Windows PowerShell / CMD](#9--method-3-windows-powershell--cmd)
10. [Method 4: EC2 Instance Connect (Browser-Based)](#10--method-4-ec2-instance-connect-browser-based)
11. [Method 5: AWS Systems Manager Session Manager](#11--method-5-aws-systems-manager-session-manager)
12. [Method 6: VS Code Remote SSH](#12--method-6-vs-code-remote-ssh)
13. [Troubleshooting](#13--troubleshooting)
14. [SSH Config File](#14--ssh-config-file-sshconfig)
15. [SSH Tunneling / Port Forwarding](#15--ssh-tunneling--port-forwarding)
16. [SCP File Transfer](#16--scp-file-transfer)
17. [Hands-On Practice](#17--hands-on-practice)
18. [Common Mistakes](#18--common-mistakes)
19. [Quick Summary](#19--quick-summary)
20. [Interview Questions](#20--interview-questions-15)
21. [What's Next](#21--whats-next)

---

## 1. 📚 What You'll Learn

By the end of this guide, you will be able to:

- ✅ Understand what SSH is and why it's essential for cloud computing
- ✅ Explain how SSH public/private key cryptography works
- ✅ Connect to an EC2 instance using **6 different methods**
- ✅ Know the correct **default username** for every major AMI type
- ✅ Troubleshoot **every common SSH connection error** with confidence
- ✅ Set up an **SSH config file** for quick, alias-based connections
- ✅ Use **SSH tunneling** and **port forwarding** for secure data transfer
- ✅ Transfer files to/from EC2 using **SCP**
- ✅ Connect to EC2 from **VS Code** for a full development experience
- ✅ Use **Session Manager** for key-less, port-less connections
- ✅ Answer **15+ interview questions** on SSH and EC2 connectivity

---

## 2. 🧰 Prerequisites

Before starting this guide, make sure you have:

| # | Prerequisite | Why You Need It |
|---|-------------|-----------------|
| 1 | **AWS Account** | To launch and manage EC2 instances |
| 2 | **A running EC2 instance** | The machine you'll connect to |
| 3 | **Key Pair (.pem file)** | Your private key for authentication |
| 4 | **Public IP or Elastic IP** | The address to reach your instance |
| 5 | **Security Group with Port 22 open** | Firewall rule allowing SSH traffic |
| 6 | **Terminal / PuTTY / PowerShell** | The tool you'll use to connect |
| 7 | **Basic understanding of EC2** | Covered in previous chapters |

> 💡 **Tip:** If you haven't launched an EC2 instance yet, go back to the previous chapter on launching EC2 instances first.

---

## 3. 🔑 What is SSH?

### Simple Definition

**SSH (Secure Shell)** is a network protocol that lets you **securely connect** to a remote computer over an unsecured network (like the internet). It provides a **command-line interface** to the remote machine, as if you were sitting right in front of it.

### Real-World Analogy 🏠

> Think of SSH like a **secure tunnel** between your house and a bank vault.
>
> - 🏠 **Your computer** = Your house
> - 🏦 **EC2 instance** = The bank vault
> - 🔒 **SSH** = An armored, underground tunnel connecting them
>
> Without SSH, it's like shouting your bank password across a crowded street — anyone can hear it. With SSH, you walk through an **encrypted, private tunnel** where nobody can see or hear what you're doing.

### Why SSH Matters

```
Without SSH (Telnet - OLD & INSECURE):
┌──────────┐        PLAIN TEXT         ┌──────────┐
│  Your PC │ ───── password123 ──────► │  Server  │
└──────────┘    Anyone can read!       └──────────┘

With SSH (MODERN & SECURE):
┌──────────┐     ENCRYPTED TUNNEL      ┌──────────┐
│  Your PC │ ═══ #@$!*&^%$#@ ════════► │  Server  │
└──────────┘   Nobody can read!        └──────────┘
```

### Key Features of SSH

| Feature | Description |
|---------|-------------|
| **Encryption** | All data is encrypted in transit — passwords, commands, output |
| **Authentication** | Verifies identity using passwords or key pairs |
| **Integrity** | Ensures data isn't tampered with during transfer |
| **Port** | Uses TCP port **22** by default |
| **Protocol** | Currently on SSH-2 (SSH-1 is deprecated and insecure) |

---

## 4. 🔐 How SSH Works

### Public/Private Key Cryptography

SSH uses **asymmetric encryption**, which means there are **two keys** that work together:

| Key | Where It Lives | What It Does | Analogy |
|-----|---------------|--------------|---------|
| **Public Key** | On the EC2 instance (server) | Encrypts data / verifies identity | A **lock** on a door — anyone can see it |
| **Private Key** | On your local machine (.pem file) | Decrypts data / proves identity | The **key** to that lock — only you have it |

### The Lock and Key Analogy 🔐

> Imagine you buy a **padlock** (public key) and its **matching key** (private key).
>
> 1. You send the **padlock** (public key) to your friend and keep the **key** (private key)
> 2. Your friend puts a message in a box and **locks it** with your padlock
> 3. Only **you** can open it because only **you** have the matching key
> 4. Even if someone intercepts the locked box, they **cannot open it**

### SSH Connection Flow (Step-by-Step)

```
Step 1: CLIENT initiates connection
┌──────────┐                          ┌──────────┐
│  Your PC │ ──── "Hello, Server!" ──►│   EC2    │
│ (Client) │                          │ (Server) │
└──────────┘                          └──────────┘

Step 2: SERVER sends its public key
┌──────────┐                          ┌──────────┐
│  Your PC │ ◄── Server Public Key ───│   EC2    │
│ (Client) │    "Here's my identity"  │ (Server) │
└──────────┘                          └──────────┘

Step 3: Both agree on a SESSION KEY (symmetric encryption)
┌──────────┐                          ┌──────────┐
│  Your PC │ ══ Diffie-Hellman Key ══ │   EC2    │
│ (Client) │    Exchange Algorithm    │ (Server) │
└──────────┘                          └──────────┘

Step 4: CLIENT authenticates using PRIVATE KEY
┌──────────┐                          ┌──────────┐
│  Your PC │ ── Signed with .pem ───► │   EC2    │
│ (Client) │   "Prove it's you"       │ (Server) │
└──────────┘                          └──────────┘

Step 5: ENCRYPTED SESSION ESTABLISHED ✅
┌──────────┐ ════════════════════════ ┌──────────┐
│  Your PC │ ══ Encrypted Tunnel ═══ │   EC2    │
│ (Client) │ ════════════════════════ │ (Server) │
└──────────┘                          └──────────┘
```

### How AWS Handles Key Pairs

When you create a key pair in AWS:

1. **AWS generates** both the public key and the private key
2. **Public key** → Stored on the EC2 instance (in `~/.ssh/authorized_keys`)
3. **Private key** → Downloaded to your computer as a **`.pem`** file
4. **AWS does NOT keep** a copy of your private key
5. **If you lose the .pem file**, you cannot connect to your instance via SSH

> ⚠️ **Critical:** Treat your `.pem` file like your house key. If you lose it, you're locked out. If someone else gets it, they can break in.

---

## 5. ✅ Prerequisites for SSH Connection

Before you can SSH into an EC2 instance, you need **ALL** of these:

### Checklist

```
☑ 1. Key Pair file (.pem) downloaded to your computer
☑ 2. EC2 instance is in "Running" state
☑ 3. Instance has a Public IPv4 address (or Elastic IP)
☑ 4. Security Group allows inbound SSH (port 22)
☑ 5. Correct username for the AMI type
☑ 6. SSH client installed (Terminal, PuTTY, etc.)
```

### Where to Find Each Prerequisite

| Prerequisite | Where to Find It |
|-------------|-------------------|
| Key pair file | Downloaded when you created the key pair (check Downloads folder) |
| Instance state | EC2 Dashboard → Instances → check "Instance State" column |
| Public IP | EC2 Dashboard → Instances → select instance → "Public IPv4 address" |
| Security Group | EC2 Dashboard → Instances → select instance → Security tab |
| Username | See the table in the next section |

### Security Group Rule for SSH

Your security group MUST have this inbound rule:

| Type | Protocol | Port Range | Source | Description |
|------|----------|-----------|--------|-------------|
| SSH | TCP | 22 | 0.0.0.0/0 (or your IP) | Allow SSH access |

> 🛡️ **Best Practice:** Instead of `0.0.0.0/0` (open to the world), use **My IP** which restricts access to only your current IP address. This is much more secure.

---

## 6. 👤 Default Usernames for AMIs

One of the most common mistakes is using the **wrong username**. Each AMI type has a specific default user:

| AMI (Operating System) | Default Username | Login Command Example |
|----------------------|------------------|-----------------------|
| **Amazon Linux 2 / Amazon Linux 2023** | `ec2-user` | `ssh -i key.pem ec2-user@<IP>` |
| **Ubuntu** | `ubuntu` | `ssh -i key.pem ubuntu@<IP>` |
| **CentOS** | `centos` | `ssh -i key.pem centos@<IP>` |
| **Debian** | `admin` | `ssh -i key.pem admin@<IP>` |
| **RHEL (Red Hat)** | `ec2-user` | `ssh -i key.pem ec2-user@<IP>` |
| **SUSE Linux** | `ec2-user` | `ssh -i key.pem ec2-user@<IP>` |
| **Fedora** | `fedora` | `ssh -i key.pem fedora@<IP>` |
| **Windows** | `Administrator` | Connect via **RDP** (not SSH) |

> 🧠 **Memory Trick:**
> - Amazon Linux, RHEL, and SUSE all use → `ec2-user`
> - Ubuntu uses → `ubuntu`
> - Debian is the odd one → `admin`
> - Windows doesn't use SSH → `Administrator` via **RDP**

> ⚠️ **Important:** Using `root` as the username will be **rejected** by most AMIs. Always use the default user listed above, then `sudo` for root privileges.

---

## 7. 💻 Method 1: Terminal (Mac/Linux)

This is the **simplest and most common** method for Mac and Linux users.

### Step 1: Open Terminal

- **Mac:** Press `Cmd + Space`, type "Terminal", press Enter
- **Linux:** Press `Ctrl + Alt + T`

### Step 2: Navigate to Your Key File

```bash
# If your key is in Downloads:
cd ~/Downloads

# Verify the key file exists:
ls -la my-key.pem
```

### Step 3: Set Correct Permissions on Key File

```bash
chmod 400 my-key.pem
```

#### Why `chmod 400`? 🤔

The `.pem` file contains your **private key** — the most sensitive piece of your SSH setup. SSH requires that this file is **only readable by you** (the owner). If the file is too open (readable by others), SSH will **refuse to use it** for security reasons.

```
Permission Breakdown:
┌───────────────────────────────────────┐
│  chmod 400 = r-- --- ---              │
│                                       │
│  4 = Owner can READ only              │
│  0 = Group has NO permissions         │
│  0 = Others have NO permissions       │
│                                       │
│  This means ONLY YOU can read the     │
│  file. Nobody else. Not even write.   │
└───────────────────────────────────────┘
```

If you skip this step, you'll see this error:

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0644 for 'my-key.pem' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "my-key.pem": bad permissions
Permission denied (publickey).
```

### Step 4: Connect via SSH

```bash
ssh -i "my-key.pem" ec2-user@54.123.45.67
```

#### Breaking Down the Command:

```
ssh -i "my-key.pem" ec2-user@54.123.45.67
│    │       │          │        │
│    │       │          │        └── Public IP of your EC2 instance
│    │       │          └─────────── Default username for the AMI
│    │       └────────────────────── Path to your private key file
│    └────────────────────────────── Flag: "identity file" (key file)
└─────────────────────────────────── SSH command
```

### Step 5: Accept the Host Key (First Connection Only)

On your **first** connection, you'll see:

```
The authenticity of host '54.123.45.67 (54.123.45.67)' can't be established.
ED25519 key fingerprint is SHA256:AbCdEfGhIjKlMnOpQrStUvWxYz1234567890.
This key fingerprint is also known by the following other names/addresses:
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '54.123.45.67' (ED25519) to the list of known hosts.
```

Type `yes` and press Enter.

### Step 6: You're Connected! 🎉

```
   ,     #_
   ~\_  ####_        Amazon Linux 2023
  ~~  \_#####\       AL2023
  ~~     \###|
  ~~       \#/ ___   https://aws.amazon.com/linux/amazon-linux-2023
   ~~       V~' '->
    ~~~         /
      ~~._.   _/
         _/ _/
       _/m/'
Last login: Mon Jun 09 16:45:22 2026 from 203.0.113.42
[ec2-user@ip-172-31-20-100 ~]$
```

You now have a **terminal session** on your EC2 instance! Try some commands:

```bash
# Check who you are
whoami
# Output: ec2-user

# Check the operating system
cat /etc/os-release

# Check available disk space
df -h

# Check memory
free -m

# Exit the SSH session
exit
```

---

## 8. 🖥️ Method 2: PuTTY (Windows)

PuTTY is a free SSH client for Windows. It's widely used because older versions of Windows didn't have a built-in SSH client.

### Step 1: Download PuTTY and PuTTYgen

1. Go to: **https://www.putty.org/**
2. Download the **MSI installer** (recommended) or the standalone `.exe`
3. The installer includes both **PuTTY** (SSH client) and **PuTTYgen** (key converter)
4. Install with default settings

### Step 2: Convert `.pem` to `.ppk` Using PuTTYgen

PuTTY does **not** understand `.pem` files. You must convert to `.ppk` format.

```
Why? PuTTY uses its own key format (.ppk = PuTTY Private Key).
AWS gives you .pem format (OpenSSH standard).
PuTTYgen converts between these formats.

.pem file ──────► PuTTYgen ──────► .ppk file
(OpenSSH)        (Converter)       (PuTTY)
```

#### Conversion Steps:

1. Open **PuTTYgen** (search in Start Menu)
2. Click **"Load"** button
3. Change the file filter from "PuTTY Private Key Files (*.ppk)" to **"All Files (*.*)"**
4. Navigate to and select your **`.pem`** file
5. You'll see: "Successfully imported foreign key"
6. Click **"Save private key"**
7. When asked "Are you sure you want to save this key without a passphrase?" → Click **Yes**
8. Save the file as **`my-key.ppk`** in a memorable location
9. Close PuTTYgen

### Step 3: Configure PuTTY

1. Open **PuTTY**
2. In the **"Session"** category (left panel):
   - **Host Name:** `ec2-user@54.123.45.67` (username@public-ip)
   - **Port:** `22`
   - **Connection type:** `SSH`

3. In the left panel, navigate to: **Connection → SSH → Auth → Credentials**
   - Click **"Browse"** next to "Private key file for authentication"
   - Select your **`.ppk`** file

4. (Optional) Save the session for later:
   - Go back to **Session** in the left panel
   - In "Saved Sessions", type a name like `My-EC2-Server`
   - Click **"Save"**
   - Next time, just double-click the saved session name!

### Step 4: Connect

1. Click **"Open"**
2. On first connection, you'll see a **Security Alert**:

```
┌────────────────────────────────────────────┐
│          PuTTY Security Alert              │
│                                            │
│ The host key is not cached for this server │
│ You have no guarantee that the server is   │
│ the computer you think it is.              │
│                                            │
│ If you trust this host, press "Accept"     │
│ to add the key to PuTTY's cache.           │
│                                            │
│    [Accept]  [Connect Once]  [Cancel]      │
└────────────────────────────────────────────┘
```

3. Click **"Accept"** (this saves the host key so you won't see this again)
4. You're now connected! 🎉

### PuTTY Quick Reference

| Setting | Location in PuTTY | Value |
|---------|-------------------|-------|
| Hostname | Session | `ec2-user@<Public-IP>` |
| Port | Session | `22` |
| Connection type | Session | `SSH` |
| Private key | Connection → SSH → Auth → Credentials | Path to `.ppk` file |
| Keep alive | Connection | `30` seconds (optional, prevents timeout) |

---

## 9. ⌨️ Method 3: Windows PowerShell / CMD

Windows 10 (1809+) and Windows 11 have a **built-in OpenSSH client**. This means you can use the same `ssh` command as Mac/Linux — no PuTTY needed!

### Step 1: Verify OpenSSH is Installed

```powershell
# Open PowerShell and run:
ssh -V
# Expected output: OpenSSH_for_Windows_8.x or similar
```

If not installed:
```powershell
# Install via PowerShell (Admin):
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

### Step 2: Set File Permissions (Windows Way)

On Windows, `chmod` doesn't work. Instead, use `icacls`:

```powershell
# Step 2a: Remove inheritance
icacls "C:\Users\YourName\Downloads\my-key.pem" /inheritance:r

# Step 2b: Remove all existing permissions
icacls "C:\Users\YourName\Downloads\my-key.pem" /remove:g "Everyone"
icacls "C:\Users\YourName\Downloads\my-key.pem" /remove:g "BUILTIN\Users"
icacls "C:\Users\YourName\Downloads\my-key.pem" /remove:g "NT AUTHORITY\Authenticated Users"

# Step 2c: Grant read-only permission to ONLY your user
icacls "C:\Users\YourName\Downloads\my-key.pem" /grant:r "%USERNAME%:R"
```

#### Why These Commands?

```
icacls = Windows equivalent of chmod

What we're doing:
1. /inheritance:r     → Remove inherited permissions from parent folder
2. /remove:g          → Remove access for "Everyone" and other groups
3. /grant:r "%USERNAME%:R" → Give ONLY your user Read-only access

Result: Only YOU can read the key file (same as chmod 400 on Linux)
```

### Step 3: Connect

```powershell
ssh -i "C:\Users\YourName\Downloads\my-key.pem" ec2-user@54.123.45.67
```

### Step 4: Accept Host Key and You're In!

Same experience as Mac/Linux — type `yes` when prompted about the host key fingerprint.

### Alternative: Simple Permission Fix (Quick Method)

If the `icacls` commands feel complex, you can do this instead:

1. Right-click the `.pem` file → **Properties**
2. Go to the **Security** tab
3. Click **Advanced**
4. Click **Disable inheritance** → "Convert inherited permissions"
5. Remove all entries **except** your own user
6. Set your user to **Read** only
7. Click **OK** → **OK**

---

## 10. 🌐 Method 4: EC2 Instance Connect (Browser-Based)

EC2 Instance Connect lets you SSH into an instance **directly from the AWS Console** — no key file, no terminal needed!

### How to Use

1. Go to **EC2 Dashboard** → **Instances**
2. Select your instance
3. Click **"Connect"** button at the top
4. Choose the **"EC2 Instance Connect"** tab
5. Verify the username (e.g., `ec2-user`)
6. Click **"Connect"**
7. A new browser tab opens with a **terminal session** 🎉

### How It Works Behind the Scenes

```
┌──────────────┐                              ┌──────────────┐
│  AWS Console │ ── 1. Generate temp key ────► │  EC2 Instance │
│  (Browser)   │                              │              │
│              │ ── 2. Push public key via ──► │  authorized  │
│              │     EC2 Instance Connect API  │  _keys       │
│              │                              │              │
│              │ ── 3. Connect using the ────► │  SSH on      │
│              │     temporary private key     │  port 22     │
│              │                              │              │
│  Temp key    │                              │  Key auto-   │
│  expires in  │                              │  removed     │
│  60 seconds  │                              │  after 60s   │
└──────────────┘                              └──────────────┘
```

### Requirements

| Requirement | Details |
|-------------|---------|
| AMI support | Amazon Linux 2, Amazon Linux 2023, Ubuntu 20.04+ |
| Network | Instance must have a **public IP** address |
| Security Group | Port **22** must be open |
| Agent | EC2 Instance Connect package must be installed (pre-installed on supported AMIs) |
| Region | Available in all standard AWS regions |

### When to Use EC2 Instance Connect

| Use Case | Recommended? |
|----------|-------------|
| Quick one-off connection | ✅ Yes |
| Lost your .pem key file | ✅ Yes |
| Teaching / demo purposes | ✅ Yes |
| Long development sessions | ❌ No (use VS Code Remote SSH) |
| Automated scripts | ❌ No (use SSM or direct SSH) |
| Production servers | ❌ No (use Session Manager) |

### Limitations

- ⚠️ Session timeout after inactivity
- ⚠️ Only works with specific AMI types
- ⚠️ Requires public IP (doesn't work with private-only instances)
- ⚠️ Browser-based terminal has limited features compared to native terminals

---

## 11. 🛡️ Method 5: AWS Systems Manager Session Manager

Session Manager is the **most secure** way to connect to EC2 instances. It requires **no SSH keys**, **no open ports**, and **no public IP**.

### Why Session Manager?

```
Traditional SSH:                    Session Manager:
┌──────┐     Port 22     ┌────┐    ┌──────┐    HTTPS     ┌─────┐    ┌────┐
│ User │ ──────────────► │ EC2│    │ User │ ──────────► │ SSM │ ──►│ EC2│
└──────┘   Open port     └────┘    └──────┘  Port 443   │ API │    └────┘
           to internet                       (standard)  └─────┘  No open
           = RISKY                           = SECURE            port 22!
```

### Benefits

| Benefit | Description |
|---------|-------------|
| 🔒 No SSH keys | No `.pem` file management headaches |
| 🚫 No port 22 | Don't need to open SSH port in security group |
| 🌐 No public IP | Works with instances in **private subnets** |
| 📝 Audit logging | All sessions are logged in **CloudTrail** |
| 🔑 IAM-based | Access controlled through **IAM policies** |
| 📋 Session history | Full command history available |

### Prerequisites

#### 1. IAM Role for EC2

Your EC2 instance needs an **IAM Role** with the `AmazonSSMManagedInstanceCore` policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssm:UpdateInstanceInformation",
                "ssmmessages:CreateControlChannel",
                "ssmmessages:CreateDataChannel",
                "ssmmessages:OpenControlChannel",
                "ssmmessages:OpenDataChannel"
            ],
            "Resource": "*"
        }
    ]
}
```

Or simply attach the AWS managed policy: **`AmazonSSMManagedInstanceCore`**

#### 2. SSM Agent

- **Amazon Linux 2/2023, Ubuntu 20.04+:** SSM Agent is **pre-installed** ✅
- **Other AMIs:** Install manually:

```bash
# Amazon Linux / RHEL / CentOS
sudo yum install -y amazon-ssm-agent
sudo systemctl enable amazon-ssm-agent
sudo systemctl start amazon-ssm-agent

# Ubuntu / Debian
sudo apt-get install -y amazon-ssm-agent
sudo systemctl enable amazon-ssm-agent
sudo systemctl start amazon-ssm-agent
```

#### 3. Network Connectivity

The instance needs **outbound HTTPS (port 443)** access to these SSM endpoints:
- `ssm.<region>.amazonaws.com`
- `ssmmessages.<region>.amazonaws.com`
- `ec2messages.<region>.amazonaws.com`

### Connect via AWS Console

1. Go to **EC2 Dashboard** → **Instances**
2. Select your instance
3. Click **"Connect"**
4. Choose **"Session Manager"** tab
5. Click **"Connect"**
6. A browser-based shell opens 🎉

### Connect via AWS CLI

```bash
# Install the Session Manager plugin first:
# https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html

# Then connect:
aws ssm start-session --target i-0abc123def456789

# Starting session with SessionId: user-0abc123def
# sh-4.2$
```

---

## 12. 🆚 Method 6: VS Code Remote SSH

This is the **best method for developers** who want a full IDE experience on a remote EC2 instance.

### What You Get

- 📝 Full VS Code editor on remote files
- 🔍 IntelliSense and code completion for remote projects
- 🖥️ Integrated terminal on the EC2 instance
- 📁 File explorer for remote directories
- 🐛 Debugging support for remote applications
- 🔌 Extensions can run remotely

### Step 1: Install the Remote-SSH Extension

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for **"Remote - SSH"** (by Microsoft)
4. Click **"Install"**

### Step 2: Configure SSH Config File

Create or edit the SSH config file:

- **Mac/Linux:** `~/.ssh/config`
- **Windows:** `C:\Users\YourName\.ssh\config`

Add this entry:

```
Host my-ec2-server
    HostName 54.123.45.67
    User ec2-user
    IdentityFile ~/.ssh/my-key.pem
    Port 22
    StrictHostKeyChecking no
```

For Windows, the `IdentityFile` path would be:
```
    IdentityFile C:\Users\YourName\.ssh\my-key.pem
```

### Step 3: Connect from VS Code

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac) to open the Command Palette
2. Type **"Remote-SSH: Connect to Host"**
3. Select **`my-ec2-server`** from the list
4. VS Code opens a **new window** connected to your EC2 instance
5. Choose **Linux** when asked about the platform
6. Wait for VS Code Server to install on the remote machine (~30 seconds first time)
7. You're connected! 🎉

### Step 4: Open a Remote Folder

1. Click **"Open Folder"** in the Explorer panel
2. Navigate to your project directory (e.g., `/home/ec2-user/my-app`)
3. Click **"OK"**
4. You now have a full IDE experience on your EC2 instance!

### Benefits for Development

| Feature | Description |
|---------|-------------|
| **Edit files** | Edit remote files as if they were local |
| **Terminal** | Integrated terminal runs on the EC2 instance |
| **Git** | Use VS Code's Git integration with remote repos |
| **Debugging** | Set breakpoints and debug remote applications |
| **Port forwarding** | Automatically forward ports for web apps |
| **Extensions** | Install extensions on the remote machine |

### Pro Tips 💡

```
1. VS Code automatically forwards ports:
   If your app runs on port 3000 on EC2,
   VS Code makes it available at localhost:3000 on your machine!

2. Save your SSH config once — connect anytime with one click.

3. Install extensions like Python, Node.js on the remote:
   They'll run on the EC2 instance, not your local machine.
```

---

## 13. 🔧 Troubleshooting

### Issue 1: Permission Denied (publickey)

This is the **most common** SSH error. Here are ALL the possible causes and fixes:

```
$ ssh -i "my-key.pem" ec2-user@54.123.45.67
Permission denied (publickey,gssapi-keyex,gssapi-with-mic).
```

#### Cause A: Wrong Username ❌

| You Used | But AMI Is | Correct Username |
|----------|-----------|------------------|
| `root` | Amazon Linux | `ec2-user` |
| `ec2-user` | Ubuntu | `ubuntu` |
| `ubuntu` | CentOS | `centos` |
| `admin` | Amazon Linux | `ec2-user` |

**Fix:** Use the correct username from the [Default Usernames Table](#6--default-usernames-for-amis).

#### Cause B: Wrong Key File Permissions 🔒

```bash
# Check current permissions:
ls -la my-key.pem
# If you see: -rw-r--r-- (644) → TOO OPEN!

# Fix:
chmod 400 my-key.pem
# Now: -r-------- (400) → CORRECT!
```

#### Cause C: Wrong Key File 🔑

You might be using a key pair that doesn't match the one assigned to the instance.

**Fix:**
1. Go to EC2 Console → select instance → Details tab
2. Check the **"Key pair name"** field
3. Make sure you're using the `.pem` file that matches this key pair name
4. If you lost the correct key, use **EC2 Instance Connect** or **Session Manager** instead

#### Cause D: Security Group Missing SSH Rule 🛡️

**Fix:**
1. Go to EC2 Console → select instance → **Security** tab
2. Click the security group link
3. Click **"Edit inbound rules"**
4. Add rule: Type = **SSH**, Port = **22**, Source = **My IP** (or 0.0.0.0/0 for testing)
5. Click **"Save rules"**

#### Cause E: Instance Not in Running State ⏹️

```
Instance State: "stopped" or "terminated"
→ You can't SSH into a stopped or terminated instance!
```

**Fix:** Start the instance from EC2 Console → right-click → Instance State → Start

#### Cause F: Wrong IP Address 🌐

The public IP changes every time you **stop and start** an instance (unless you use an Elastic IP).

**Fix:**
1. Go to EC2 Console → select instance
2. Copy the **current** "Public IPv4 address"
3. Use this new IP in your SSH command

---

### Issue 2: Connection Timed Out

```
$ ssh -i "my-key.pem" ec2-user@54.123.45.67
ssh: connect to host 54.123.45.67 port 22: Connection timed out
```

This means your SSH request is **not reaching** the EC2 instance at all.

#### Cause A: Security Group Issues

The security group is not allowing inbound traffic on port 22.

**Fix:** Add an inbound rule for SSH (port 22) from your IP address.

#### Cause B: Network ACL (NACL) Issues

NACLs are subnet-level firewalls. Unlike security groups, they have **explicit deny rules**.

**Fix:**
1. Go to VPC Dashboard → Subnets → select your instance's subnet
2. Check the **Network ACL** tab
3. Ensure there's an **ALLOW** rule for:
   - Inbound: TCP port 22 from your IP
   - Outbound: TCP ephemeral ports (1024-65535) — for response traffic

#### Cause C: Route Table Issues

The subnet might not have a route to the **Internet Gateway**.

**Fix:**
1. Go to VPC Dashboard → Route Tables
2. Find the route table for your subnet
3. Ensure there's a route: `0.0.0.0/0` → `igw-xxxxxxxx` (Internet Gateway)

#### Cause D: Instance in Private Subnet

If your instance is in a **private subnet** (no Internet Gateway route), it has no public IP and can't be reached directly.

**Fix:**
- Use a **Bastion Host** (jump box) in a public subnet
- Use **Session Manager** (no public IP needed)
- Move the instance to a public subnet

---

### Issue 3: Host Key Verification Failed

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Host key verification failed.
```

#### Why It Happens

- You **stopped and started** the instance (it got a new IP that was previously used by another instance)
- You **terminated** an instance and created a new one with the same IP
- The instance's host key was regenerated

#### How to Fix

```bash
# Remove the old host key for the IP:
ssh-keygen -R 54.123.45.67

# Or remove the old key for a hostname:
ssh-keygen -R my-ec2-server

# Then try connecting again:
ssh -i "my-key.pem" ec2-user@54.123.45.67
# Accept the new host key when prompted
```

On Windows, the known hosts file is at:
```
C:\Users\YourName\.ssh\known_hosts
```

You can edit it manually and remove the line with the old IP.

---

### Troubleshooting Quick Reference

```
┌─────────────────────────────────────────────────────────────────┐
│              SSH TROUBLESHOOTING FLOWCHART                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Error: "Permission denied"                                     │
│  ├── Check username (ec2-user? ubuntu? centos?)                │
│  ├── Check key file permissions (chmod 400)                     │
│  ├── Check key pair matches instance                            │
│  ├── Check security group has port 22                           │
│  └── Check instance is running                                  │
│                                                                 │
│  Error: "Connection timed out"                                  │
│  ├── Check security group (port 22 inbound)                    │
│  ├── Check Network ACL (allow port 22)                          │
│  ├── Check route table (has igw route)                          │
│  └── Check instance is in public subnet                         │
│                                                                 │
│  Error: "Host key verification failed"                          │
│  └── Run: ssh-keygen -R <IP-address>                           │
│                                                                 │
│  Error: "Connection refused"                                    │
│  ├── SSH service not running on instance                        │
│  └── Run: sudo systemctl start sshd                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 14. 📝 SSH Config File (~/.ssh/config)

The SSH config file lets you create **shortcuts** for SSH connections. Instead of typing long commands, you use simple aliases.

### Without Config File (Painful) 😫

```bash
ssh -i "~/.ssh/my-key.pem" -p 22 ec2-user@54.123.45.67
```

### With Config File (Easy) 😊

```bash
ssh my-server
```

### Config File Location

| OS | Path |
|----|------|
| Mac/Linux | `~/.ssh/config` |
| Windows | `C:\Users\YourName\.ssh\config` |

### Syntax

```
Host <alias>
    HostName <IP-or-domain>
    User <username>
    IdentityFile <path-to-key>
    Port <port-number>
```

### Single Host Example

```
Host my-ec2
    HostName 54.123.45.67
    User ec2-user
    IdentityFile ~/.ssh/my-key.pem
    Port 22
```

Now just type: `ssh my-ec2` ✨

### Multiple Host Configurations

```
# Development Server
Host dev-server
    HostName 54.123.45.67
    User ec2-user
    IdentityFile ~/.ssh/dev-key.pem
    Port 22

# Staging Server
Host staging
    HostName 54.200.100.50
    User ubuntu
    IdentityFile ~/.ssh/staging-key.pem
    Port 22

# Production Server (via Bastion)
Host bastion
    HostName 54.300.200.10
    User ec2-user
    IdentityFile ~/.ssh/bastion-key.pem
    Port 22

Host production
    HostName 10.0.1.50
    User ec2-user
    IdentityFile ~/.ssh/prod-key.pem
    Port 22
    ProxyJump bastion
```

### Useful Config Options

| Option | Description | Example |
|--------|-------------|---------|
| `HostName` | IP address or domain name | `54.123.45.67` |
| `User` | SSH username | `ec2-user` |
| `IdentityFile` | Path to private key | `~/.ssh/my-key.pem` |
| `Port` | SSH port (default: 22) | `22` |
| `ProxyJump` | Jump through a bastion host | `bastion` |
| `ServerAliveInterval` | Send keep-alive every N seconds | `60` |
| `ServerAliveCountMax` | Max keep-alive failures before disconnect | `3` |
| `StrictHostKeyChecking` | Skip host key confirmation | `no` |
| `ForwardAgent` | Forward SSH agent (for key forwarding) | `yes` |
| `LocalForward` | Set up port forwarding | `8080 localhost:80` |

### Wildcard Configuration

Apply settings to **all hosts**:

```
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
    AddKeysToAgent yes
    IdentitiesOnly yes
```

---

## 15. 🔀 SSH Tunneling / Port Forwarding

SSH tunneling creates **encrypted tunnels** through which you can forward network traffic. This is extremely useful for accessing services on your EC2 instance securely.

### Types of Port Forwarding

```
┌──────────────────────────────────────────────────────────────┐
│                  SSH PORT FORWARDING TYPES                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. LOCAL: Your machine ──tunnel──► EC2 ──► Remote Service  │
│     "I want to access a remote service locally"              │
│                                                              │
│  2. REMOTE: Remote Service ──► EC2 ──tunnel──► Your machine │
│     "I want the EC2 to access my local service"              │
│                                                              │
│  3. DYNAMIC: Your machine ──tunnel──► EC2 ──► ANY service   │
│     "I want to route ALL traffic through EC2 (SOCKS proxy)" │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 1. Local Port Forwarding (`-L`)

Forward a port on **your machine** to a port on the **remote machine** (or a machine accessible from it).

```bash
ssh -i "key.pem" -L <local-port>:<remote-host>:<remote-port> ec2-user@<EC2-IP>
```

#### Example: Access RDS Database Locally

Your RDS database is in a private subnet and can only be accessed from EC2. You want to connect to it from your local machine.

```bash
# Forward local port 3306 to RDS on port 3306 through EC2
ssh -i "key.pem" -L 3306:my-database.abc123.us-east-1.rds.amazonaws.com:3306 ec2-user@54.123.45.67
```

Now on your local machine, you can connect to the RDS database at `localhost:3306`!

```
Your Machine               EC2 Instance                RDS (Private)
┌──────────┐              ┌──────────┐              ┌──────────┐
│localhost │ ═══ SSH ════ │          │ ───────────► │  MySQL   │
│  :3306   │   Tunnel     │          │  Port 3306   │  :3306   │
└──────────┘              └──────────┘              └──────────┘
```

#### Example: Access a Web App Running on EC2

```bash
# Your app runs on port 3000 on EC2
# Forward it to port 8080 on your machine
ssh -i "key.pem" -L 8080:localhost:3000 ec2-user@54.123.45.67
```

Now open `http://localhost:8080` in your browser to access the app!

### 2. Remote Port Forwarding (`-R`)

Forward a port on the **remote machine** to a port on **your local machine**.

```bash
ssh -i "key.pem" -R <remote-port>:localhost:<local-port> ec2-user@<EC2-IP>
```

#### Example: Expose Local Dev Server to EC2

```bash
# Your local app runs on port 4000
# Make it accessible on EC2's port 9000
ssh -i "key.pem" -R 9000:localhost:4000 ec2-user@54.123.45.67
```

### 3. Dynamic Port Forwarding / SOCKS Proxy (`-D`)

Creates a **SOCKS proxy** that routes ALL traffic through the SSH tunnel. This is like a mini-VPN.

```bash
ssh -i "key.pem" -D 1080 ec2-user@54.123.45.67
```

Then configure your browser to use `localhost:1080` as a SOCKS5 proxy.

#### Use Cases for Dynamic Forwarding

| Use Case | Description |
|----------|-------------|
| Access private AWS resources | Route browser traffic through EC2 to reach private endpoints |
| Secure browsing on public WiFi | All your web traffic goes through encrypted tunnel to EC2 |
| Testing geo-restricted content | Access content available only in the EC2's region |

### Useful Flags for Tunneling

```bash
# -N : Don't execute a remote command (just keep the tunnel open)
# -f : Run in background
# -L : Local port forwarding
# -R : Remote port forwarding
# -D : Dynamic (SOCKS) proxy

# Background tunnel (no interactive shell):
ssh -i "key.pem" -N -f -L 8080:localhost:3000 ec2-user@54.123.45.67
```

---

## 16. 📂 SCP File Transfer

**SCP (Secure Copy Protocol)** uses SSH to securely transfer files between your local machine and EC2 instances.

### Upload a File to EC2

```bash
scp -i "key.pem" <local-file> <user>@<EC2-IP>:<remote-path>
```

#### Example:

```bash
# Upload index.html to the home directory on EC2
scp -i "my-key.pem" index.html ec2-user@54.123.45.67:~

# Upload to a specific directory
scp -i "my-key.pem" app.py ec2-user@54.123.45.67:/home/ec2-user/my-app/

# Upload with a new filename
scp -i "my-key.pem" local-config.json ec2-user@54.123.45.67:~/config.json
```

### Download a File from EC2

```bash
scp -i "key.pem" <user>@<EC2-IP>:<remote-file> <local-path>
```

#### Example:

```bash
# Download a log file from EC2 to current directory
scp -i "my-key.pem" ec2-user@54.123.45.67:/var/log/app.log .

# Download to a specific local directory
scp -i "my-key.pem" ec2-user@54.123.45.67:~/data.csv ~/Downloads/
```

### Upload an Entire Directory

```bash
# Use -r flag for recursive copy
scp -i "key.pem" -r <local-directory> <user>@<EC2-IP>:<remote-path>
```

#### Example:

```bash
# Upload entire project folder
scp -i "my-key.pem" -r ./my-project ec2-user@54.123.45.67:~/

# Download entire directory
scp -i "my-key.pem" -r ec2-user@54.123.45.67:~/my-project ./local-backup/
```

### SCP Quick Reference

| Action | Command |
|--------|---------|
| Upload file | `scp -i key.pem file.txt ec2-user@IP:~` |
| Download file | `scp -i key.pem ec2-user@IP:~/file.txt .` |
| Upload directory | `scp -i key.pem -r ./dir ec2-user@IP:~` |
| Download directory | `scp -i key.pem -r ec2-user@IP:~/dir .` |
| Upload with port | `scp -i key.pem -P 2222 file.txt ec2-user@IP:~` |

### Alternative: rsync (Better for Large Transfers)

```bash
# rsync only transfers CHANGED files (much faster for updates)
rsync -avz -e "ssh -i key.pem" ./my-project/ ec2-user@54.123.45.67:~/my-project/

# Flags:
# -a = archive mode (preserves permissions, timestamps)
# -v = verbose
# -z = compress during transfer
# -e = specify SSH command
```

---

## 17. 🧪 Hands-On Practice

### Exercise 1: Basic SSH Connection

```
📝 Task: Connect to an EC2 instance using Terminal/PowerShell

1. Launch an Amazon Linux 2023 EC2 instance (t2.micro)
2. Create and download a new key pair
3. Configure security group with SSH access
4. Set key permissions (chmod 400 or icacls)
5. Connect using: ssh -i "key.pem" ec2-user@<Public-IP>
6. Run: whoami, hostname, uname -a
7. Exit the connection
```

### Exercise 2: SSH Config File

```
📝 Task: Create an SSH config for quick connections

1. Create/edit ~/.ssh/config
2. Add a host entry for your EC2 instance
3. Connect using just: ssh my-ec2
4. Add a second entry with different settings
5. Test connecting to both using aliases
```

### Exercise 3: File Transfer with SCP

```
📝 Task: Transfer files between your machine and EC2

1. Create a simple text file locally
2. Upload it to EC2 using SCP
3. Verify the file exists on EC2 (via SSH)
4. Modify the file on EC2 (echo "new content" >> file.txt)
5. Download the modified file back to your machine
6. Verify the changes are present locally
```

### Exercise 4: Port Forwarding

```
📝 Task: Set up local port forwarding

1. SSH into your EC2 instance
2. Install a simple web server: sudo yum install -y httpd
3. Start the web server: sudo systemctl start httpd
4. Create a test page: echo "Hello SSH Tunnel!" | sudo tee /var/www/html/index.html
5. Exit the SSH session
6. Set up local port forwarding:
   ssh -i "key.pem" -L 8080:localhost:80 ec2-user@<IP>
7. Open http://localhost:8080 in your browser
8. You should see "Hello SSH Tunnel!"
```

### Exercise 5: EC2 Instance Connect

```
📝 Task: Connect via browser

1. Go to EC2 Dashboard → Instances
2. Select your instance → Click "Connect"
3. Choose "EC2 Instance Connect" tab
4. Click "Connect"
5. Run: cat /etc/os-release
6. Verify you're on the correct instance
```

### Exercise 6: VS Code Remote SSH

```
📝 Task: Set up VS Code for remote development

1. Install "Remote - SSH" extension in VS Code
2. Create SSH config entry for your EC2 instance
3. Connect to EC2 from VS Code
4. Open a folder on the remote instance
5. Create and edit a new file
6. Open an integrated terminal
7. Run commands on the EC2 instance from VS Code
```

---

## 18. ⚠️ Common Mistakes

| # | Mistake | Impact | Fix |
|---|---------|--------|-----|
| 1 | Using `root` as username | Permission denied error | Use the correct default user (ec2-user, ubuntu, etc.) |
| 2 | Forgetting `chmod 400` on .pem file | "Unprotected Private Key File" warning | Run `chmod 400 key.pem` |
| 3 | Using the wrong .pem file | Permission denied error | Match key pair name in EC2 console |
| 4 | Not opening port 22 in security group | Connection timed out | Add SSH inbound rule to security group |
| 5 | Using old public IP after stop/start | Connection refused or times out | Get current IP from EC2 console |
| 6 | Using .pem in PuTTY directly | PuTTY can't read .pem | Convert to .ppk with PuTTYgen |
| 7 | Instance in stopped state | Connection failure | Start the instance first |
| 8 | Instance in private subnet | No public IP, can't reach | Use bastion host or Session Manager |
| 9 | Forgetting `-i` flag | Uses wrong/default key | Always specify `-i "key.pem"` |
| 10 | Deleting the .pem file | Locked out of instance | Use Instance Connect or Session Manager as backup |
| 11 | Setting security group source to wrong IP | Can't connect from your location | Use "My IP" option in security group |
| 12 | Using HTTP (port 80) instead of SSH (port 22) | Wrong protocol | SSH uses port 22, HTTP uses 80 |

---

## 19. 📋 Quick Summary

### 6 Connection Methods Comparison

| Method | Best For | Key Needed? | Port 22? | Public IP? | Difficulty |
|--------|----------|-------------|----------|-----------|------------|
| **Terminal (Mac/Linux)** | Daily use | ✅ Yes | ✅ Yes | ✅ Yes | ⭐ Easy |
| **PuTTY (Windows)** | Windows without OpenSSH | ✅ Yes (.ppk) | ✅ Yes | ✅ Yes | ⭐⭐ Medium |
| **PowerShell/CMD** | Modern Windows | ✅ Yes | ✅ Yes | ✅ Yes | ⭐ Easy |
| **EC2 Instance Connect** | Quick browser access | ❌ No | ✅ Yes | ✅ Yes | ⭐ Easy |
| **Session Manager** | Production / secure | ❌ No | ❌ No | ❌ No | ⭐⭐ Medium |
| **VS Code Remote** | Development | ✅ Yes | ✅ Yes | ✅ Yes | ⭐⭐ Medium |

### SSH Command Cheat Sheet

```bash
# Basic connection
ssh -i "key.pem" ec2-user@<IP>

# With verbose output (debugging)
ssh -v -i "key.pem" ec2-user@<IP>

# With specific port
ssh -i "key.pem" -p 2222 ec2-user@<IP>

# Local port forwarding
ssh -i "key.pem" -L 8080:localhost:80 ec2-user@<IP>

# Remote port forwarding
ssh -i "key.pem" -R 9000:localhost:3000 ec2-user@<IP>

# SOCKS proxy
ssh -i "key.pem" -D 1080 ec2-user@<IP>

# Background tunnel
ssh -i "key.pem" -N -f -L 8080:localhost:80 ec2-user@<IP>

# SCP upload
scp -i "key.pem" file.txt ec2-user@<IP>:~

# SCP download
scp -i "key.pem" ec2-user@<IP>:~/file.txt .

# SCP directory
scp -i "key.pem" -r ./dir ec2-user@<IP>:~

# Fix permissions (Linux/Mac)
chmod 400 key.pem

# Fix permissions (Windows)
icacls "key.pem" /inheritance:r /grant:r "%USERNAME%:R"

# Remove old host key
ssh-keygen -R <IP>

# Using SSH config
ssh my-alias
```

### Key Concepts to Remember

```
🔐 SSH = Secure Shell (encrypted remote access)
🔑 Key Pair = Public key (on server) + Private key (your .pem file)
📦 Port 22 = Default SSH port
👤 Default users: ec2-user (Amazon Linux), ubuntu (Ubuntu), centos (CentOS)
🔒 chmod 400 = Owner read-only (required for .pem files)
🌐 Public IP = Required for direct SSH (changes on stop/start)
🛡️ Security Group = Must allow port 22 inbound
📁 ~/.ssh/config = SSH shortcut configuration
🔀 SSH Tunneling = Encrypted port forwarding
📂 SCP = Secure file copy over SSH
```

---

## 20. 🎯 Interview Questions (15+)

### Q1: What is SSH and why is it used with EC2?
**Answer:** SSH (Secure Shell) is a cryptographic network protocol used for secure remote access to servers over an unsecured network. In AWS, SSH is the primary method to connect to Linux-based EC2 instances for administration, deployment, and troubleshooting. It provides encrypted communication, ensuring that commands, passwords, and data transmitted between the client and the EC2 instance cannot be intercepted or tampered with. SSH uses **TCP port 22** by default and supports authentication via **key pairs** (preferred in AWS) or passwords.

---

### Q2: How does SSH key-based authentication work?
**Answer:** SSH key-based authentication uses **asymmetric cryptography** with a pair of keys:

1. **Public Key**: Placed on the server (EC2 instance) in `~/.ssh/authorized_keys`
2. **Private Key**: Kept securely on the client (your local machine) as a `.pem` file

When connecting, the SSH client proves its identity by **signing a challenge** with the private key. The server verifies this signature using the stored public key. If the signature is valid, access is granted — **no password is transmitted**. This is more secure than passwords because the private key never leaves the client machine and is virtually impossible to brute-force.

---

### Q3: What is the default SSH username for Amazon Linux, Ubuntu, and CentOS instances?
**Answer:**
- **Amazon Linux** → `ec2-user`
- **Ubuntu** → `ubuntu`
- **CentOS** → `centos`
- **Debian** → `admin`
- **RHEL** → `ec2-user`
- **Fedora** → `fedora`
- **SUSE** → `ec2-user`

Using the wrong username is one of the most common causes of "Permission denied" errors.

---

### Q4: Why do we need to run `chmod 400` on the .pem file?
**Answer:** The `chmod 400` command sets the private key file to **read-only for the owner** and removes all access for group and others. SSH enforces strict permission checks on private key files for security reasons. If the file is accessible by other users (e.g., permissions like 644 or 755), SSH will **refuse to use it** and display an "UNPROTECTED PRIVATE KEY FILE" warning. This prevents other users on the same machine from reading your private key and potentially accessing your servers. On Windows, the equivalent is using `icacls` to restrict file access.

---

### Q5: What are the prerequisites for SSH connection to an EC2 instance?
**Answer:** Five prerequisites are required:
1. **Key Pair (.pem file)** — Your private key for authentication
2. **Instance in Running state** — Stopped/terminated instances cannot be reached
3. **Public IPv4 address** (or Elastic IP) — The addressable endpoint
4. **Security Group allowing port 22** — Firewall rule permitting SSH traffic inbound
5. **Correct username** — Matches the AMI type (e.g., `ec2-user` for Amazon Linux)

Additionally, the instance must be in a **public subnet** with a route to an Internet Gateway (unless using Session Manager or a bastion host).

---

### Q6: What is the difference between EC2 Instance Connect and Session Manager?
**Answer:**

| Feature | EC2 Instance Connect | Session Manager |
|---------|---------------------|-----------------|
| Key pair needed | No (generates temporary) | No |
| Port 22 needed | Yes | No |
| Public IP needed | Yes | No |
| IAM role needed | No | Yes (SSMManagedInstanceCore) |
| Audit logging | Limited | Full (CloudTrail) |
| Works in private subnets | No | Yes |
| Agent needed | EC2 Instance Connect agent | SSM Agent |
| Protocol | SSH over port 22 | HTTPS over port 443 |

Session Manager is preferred for **production environments** because it doesn't require opening port 22, works without public IPs, and provides comprehensive audit logging.

---

### Q7: Explain SSH tunneling. What are the three types?
**Answer:** SSH tunneling (port forwarding) creates encrypted tunnels for forwarding network traffic:

1. **Local Port Forwarding (-L):** Forwards a local port to a remote service through the SSH tunnel. Example: Accessing a private RDS database from your laptop by forwarding `localhost:3306` to the RDS endpoint through an EC2 bastion.

2. **Remote Port Forwarding (-R):** Forwards a remote port to a local service. Example: Exposing your local development server to an EC2 instance.

3. **Dynamic Port Forwarding (-D):** Creates a SOCKS proxy that routes all traffic through the SSH tunnel. Example: Browsing private AWS resources through an EC2 instance acting as a proxy. Command: `ssh -D 1080 ec2-user@IP`

---

### Q8: How would you troubleshoot a "Permission denied (publickey)" error?
**Answer:** I would systematically check:
1. **Username:** Verify the correct default user for the AMI (ec2-user vs ubuntu vs centos)
2. **Key file permissions:** Ensure `chmod 400` on the .pem file
3. **Correct key file:** Match the .pem file with the key pair name shown in the EC2 console
4. **Security group:** Verify port 22 is open from my IP
5. **Instance state:** Confirm the instance is in "Running" state
6. **IP address:** Verify the public IP hasn't changed (after stop/start)
7. **Verbose mode:** Run `ssh -v -i key.pem user@IP` to see detailed connection logs

---

### Q9: What is the SSH config file and how does it simplify connections?
**Answer:** The SSH config file (`~/.ssh/config`) stores connection settings as named aliases. Instead of typing `ssh -i "~/.ssh/key.pem" -p 22 ec2-user@54.123.45.67` each time, you configure:

```
Host my-server
    HostName 54.123.45.67
    User ec2-user
    IdentityFile ~/.ssh/key.pem
```

Then simply type `ssh my-server`. It supports multiple host entries, wildcard configurations (`Host *`), proxy jumps through bastion hosts (`ProxyJump`), keep-alive settings, and port forwarding rules — making it essential for managing multiple servers.

---

### Q10: What happens if you lose your .pem key file?
**Answer:** If you lose your private key:
1. **You cannot SSH directly** into the instance using traditional methods
2. **Alternative access methods:**
   - **EC2 Instance Connect** — Generates a temporary key pair (if the instance supports it)
   - **Session Manager** — Doesn't require SSH keys at all (if SSM agent and IAM role are configured)
   - **Create a new key pair** — Stop the instance, detach root volume, attach to another instance, add new public key to `authorized_keys`, reattach and restart
3. **Prevention:** Always store `.pem` files securely (e.g., in a password manager or encrypted storage) and consider setting up Session Manager as a backup access method.

---

### Q11: What is the difference between SCP and SFTP?
**Answer:**
- **SCP (Secure Copy Protocol)** — Uses SSH to transfer files. It's simple and fast, best for single file or directory transfers. Syntax: `scp -i key.pem file user@IP:path`. SCP is non-interactive — you specify the source and destination in one command.
- **SFTP (SSH File Transfer Protocol)** — Also uses SSH but provides an interactive file transfer session with commands like `ls`, `cd`, `get`, `put`, `mkdir`. It's better for browsing remote directories and managing multiple files. SFTP also supports resuming interrupted transfers, which SCP does not.

Both are secure (encrypted via SSH), but SFTP is more feature-rich while SCP is simpler for scripted transfers.

---

### Q12: Why might a "Connection timed out" error occur when SSHing to EC2?
**Answer:** "Connection timed out" means packets aren't reaching the instance. Possible causes:
1. **Security Group:** No inbound rule for SSH (port 22) from the client's IP
2. **Network ACL:** Explicit DENY rule blocking port 22 at the subnet level
3. **Route Table:** Missing route to an Internet Gateway for the subnet
4. **Private Subnet:** Instance has no public IP and no path to the internet
5. **Wrong IP:** Using a stale IP address (changed after instance stop/start)
6. **VPN/Firewall:** Client-side network blocking outbound port 22

I would check these in order, starting with the security group as it's the most common cause.

---

### Q13: How does AWS Systems Manager Session Manager work without SSH?
**Answer:** Session Manager uses **HTTPS (port 443)** instead of SSH (port 22). The SSM Agent running on the EC2 instance establishes an **outbound connection** to the SSM service endpoint. When a user initiates a session (via Console or CLI), the SSM service facilitates a **WebSocket connection** between the client and the agent. This means:
- No inbound ports need to be opened in the security group
- No public IP is required (the instance only needs outbound HTTPS access)
- Authentication is handled through **IAM** instead of SSH keys
- All sessions are logged in **CloudTrail** for audit compliance
- The EC2 instance needs an IAM role with the `AmazonSSMManagedInstanceCore` policy

---

### Q14: What is a bastion host (jump server) and when would you use one?
**Answer:** A bastion host (or jump server) is an EC2 instance in a **public subnet** that serves as a gateway to instances in **private subnets**. You SSH to the bastion first, then SSH from the bastion to private instances. This adds a layer of security because:
- Private instances have **no public IP** and **no direct internet access**
- Only the bastion host's port 22 is exposed to the internet
- All access is funneled through a **single, hardened entry point**
- Access can be monitored and logged centrally

You use it when instances are in private subnets for security compliance. SSH config can simplify this with the `ProxyJump` directive. Alternatively, **Session Manager** eliminates the need for bastion hosts entirely.

---

### Q15: How would you set up VS Code to develop on an EC2 instance?
**Answer:**
1. Install the **Remote - SSH** extension in VS Code
2. Create an SSH config file entry with the EC2's IP, username, and key path
3. Use Command Palette → **"Remote-SSH: Connect to Host"** → select the alias
4. VS Code installs its **server component** on the EC2 instance
5. You can then open remote folders, edit files, use the integrated terminal, debug, and use Git — all as if working locally

Benefits include automatic **port forwarding** (if your app runs on port 3000, it's accessible at localhost:3000), running extensions on the remote machine, and full IntelliSense support for remote codebases.

---

### Q16: What are Elastic IPs and why are they important for SSH?
**Answer:** An Elastic IP is a **static, public IPv4 address** that you can allocate and associate with an EC2 instance. When you stop and start an EC2 instance, its regular public IP **changes**. This means your SSH config, scripts, and DNS entries would break. An Elastic IP **remains the same** across stop/start cycles. This is important for SSH because:
- Your SSH config file entries remain valid
- Automated scripts don't need IP updates
- DNS records (if pointing to the IP) stay current
- Team members always use the same address

However, AWS charges for Elastic IPs that are **not associated** with a running instance, so always release unused ones.

---

### Q17: What is the difference between SSH-1 and SSH-2?
**Answer:** SSH-1 is the original protocol version, which had several **security vulnerabilities** (including susceptibility to man-in-the-middle attacks and a weaker integrity check algorithm). **SSH-2** is the current standard, featuring:
- Stronger encryption algorithms (AES, ChaCha20)
- Better key exchange (Diffie-Hellman Group Exchange)
- Improved integrity checking (HMAC)
- Support for SFTP (built-in)
- Multiple channels over a single connection

All modern AWS instances and SSH clients use **SSH-2 exclusively**. SSH-1 is deprecated and should never be used.

---

### Q18: How would you restrict SSH access to only specific IP addresses?
**Answer:** There are multiple layers of control:
1. **Security Group:** Set the source of the SSH inbound rule to specific IPs (e.g., `203.0.113.0/24`) instead of `0.0.0.0/0`
2. **Network ACL:** Add explicit rules at the subnet level to allow SSH only from trusted CIDRs
3. **SSH config on instance:** Edit `/etc/ssh/sshd_config` and use `AllowUsers ec2-user@203.0.113.*`
4. **IAM (for Session Manager):** Create IAM policies restricting who can start sessions
5. **AWS Systems Manager:** Use Session Manager which authenticates via IAM, avoiding port 22 entirely

Best practice is to use at least **security group restrictions** combined with **Session Manager** for production environments.

---

## 21. 🚀 What's Next

Now that you can connect to EC2 instances, you're ready to explore:

| Next Topic | What You'll Learn |
|-----------|-------------------|
| **EC2 Instance Storage (EBS)** | Attach and manage disk volumes |
| **Security Groups Deep Dive** | Advanced firewall rules and best practices |
| **Elastic Load Balancing** | Distribute traffic across multiple instances |
| **Auto Scaling** | Automatically scale EC2 instances based on demand |
| **AWS CLI** | Manage AWS services from the command line |
| **IAM Roles for EC2** | Grant permissions to EC2 instances securely |
| **VPC Networking** | Design custom networks for your instances |
| **Deploy Applications** | Host web apps on EC2 with Nginx/Apache |

> 🎯 **Recommended Next Step:** Learn about **EC2 Instance Storage (EBS)** to understand how to add, resize, and manage disk volumes on your EC2 instances.

---

> 📝 **Document Version:** 1.0
> 📅 **Last Updated:** June 2026
> 👨‍💻 **Part of:** AWS DevOps Learning Series
