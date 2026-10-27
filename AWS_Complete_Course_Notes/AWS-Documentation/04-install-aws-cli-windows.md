# 💻 Install AWS CLI on Windows — Complete Guide

## 📚 What You'll Learn

- What AWS CLI is and why you need it
- How AWS CLI compares to the AWS Console (web browser)
- Three different methods to install AWS CLI on Windows
- How to verify your installation is working
- Understanding AWS CLI command structure
- Where AWS CLI files are stored on Windows
- Basic AWS CLI commands to test your setup
- How to update and uninstall AWS CLI
- What AWS CloudShell is and when to use it instead
- Environment variables used by AWS CLI

---

## 🔑 Prerequisites

| Requirement | Details |
|---|---|
| ✅ Windows 10 or 11 | 64-bit operating system |
| ✅ AWS Account | You need an AWS account (see `03-aws-free-tier-account.md`) |
| ✅ Admin Access | You need administrator privileges to install software |
| ✅ Internet Connection | To download the installer |
| ✅ PowerShell or Command Prompt | Pre-installed on all Windows machines |

---

## 🤔 What is AWS CLI?

### Simple Explanation

**AWS CLI (Command Line Interface)** is a tool that lets you control AWS services by typing commands in your terminal (PowerShell or Command Prompt) instead of clicking around in a web browser.

### Real-World Analogy

Think of it like ordering food:
- **AWS Console (Web Browser)** = Going to a restaurant, reading the menu, talking to a waiter, pointing at what you want → Works great, but takes time
- **AWS CLI (Command Line)** = Calling the restaurant and saying "I want 2 pizzas, 1 coke" → Faster, more efficient, can be automated

### Why Do We Need AWS CLI?

| Reason | Explanation |
|---|---|
| ⚡ **Speed** | Type one command instead of clicking through 5 pages |
| 🔄 **Automation** | Write scripts to do repetitive tasks automatically |
| 📋 **Scripting** | Use in shell scripts, batch files, or CI/CD pipelines |
| 🧪 **Testing** | Quickly test API calls without navigating the console |
| 💼 **Professional Use** | Most DevOps/Cloud engineers use CLI daily |
| 📜 **Repeatability** | Commands can be saved and re-run exactly the same way |

---

## ⚖️ AWS CLI vs AWS Console — Comparison

| Feature | AWS Console (Browser) | AWS CLI (Terminal) |
|---|---|---|
| **Interface** | Graphical (point and click) | Text-based (type commands) |
| **Learning Curve** | Easier for beginners | Requires learning command syntax |
| **Speed** | Slower (multiple page loads) | Faster (single command) |
| **Automation** | Difficult to automate | Easy to script and automate |
| **Bulk Operations** | Tedious for many resources | Excellent with loops and scripts |
| **Accessibility** | Needs a browser | Works from any terminal |
| **Offline Help** | No | Yes (`aws help`, `aws ec2 help`) |
| **Best For** | Exploring, learning, one-off tasks | Automation, scripting, DevOps work |

> 💡 **Pro Tip:** Real-world cloud engineers use BOTH. They use the Console to explore and visualize, and the CLI to automate and manage. Learn both!

---

## 📦 Method 1: Install Using MSI Installer (Recommended)

This is the **official and recommended** way to install AWS CLI on Windows.

### Step 1: Download the AWS CLI MSI Installer

1. Open your web browser
2. Go to the official download page:

```
https://awscli.amazonaws.com/AWSCLIV2.msi
```

3. The download will start automatically (file size: ~30-40 MB)
4. Save the file to your **Downloads** folder

> 💡 **What is an MSI file?** MSI stands for "Microsoft Software Installer" — it's a standard Windows installer package format.

### Step 2: Run the Installer

1. Go to your **Downloads** folder
2. Double-click the file: **`AWSCLIV2.msi`**
3. If you see a **"Windows protected your PC"** popup:
   - Click **"More info"**
   - Click **"Run anyway"**
4. The AWS CLI Setup Wizard opens
5. Click **"Next"**
6. Read and accept the **License Agreement** → Check "I accept the terms" → Click **"Next"**
7. Choose the installation location:
   - Default: `C:\Program Files\Amazon\AWSCLIV2\`
   - Keep the default unless you have a specific reason to change it
8. Click **"Next"**
9. Click **"Install"**
10. If prompted by **User Account Control (UAC)**, click **"Yes"**
11. Wait for the installation to complete (usually takes 30-60 seconds)
12. Click **"Finish"**

```
Default Installation Path:
  C:\Program Files\Amazon\AWSCLIV2\
```

### Step 3: Verify the Installation

1. **Close any open terminal windows** (Command Prompt or PowerShell) — this is important because the PATH environment variable needs to be refreshed
2. Open a **new** PowerShell window:
   - Press `Win + X`
   - Click **"Windows Terminal"** or **"PowerShell"**
3. Type the following command and press Enter:

```powershell
aws --version
```

4. You should see output similar to:

```
aws-cli/2.27.31 Python/3.13.3 Windows/10 exe/AMD64 prompt/off
```

If you see the version information, **congratulations! AWS CLI is installed!** 🎉

> ⚠️ **If you get "aws is not recognized":**
> - Close ALL terminal windows and open a new one
> - If it still doesn't work, restart your computer
> - If it STILL doesn't work, see the Troubleshooting section below

---

## 📦 Method 2: Install Using Chocolatey

**Chocolatey** is a package manager for Windows (like apt for Linux or brew for macOS).

### Step 1: Install Chocolatey (if not already installed)

1. Open **PowerShell as Administrator**:
   - Press `Win + X`
   - Click **"Windows Terminal (Admin)"** or **"PowerShell (Admin)"**
2. Run this command:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

3. Wait for the installation to complete
4. Verify Chocolatey is installed:

```powershell
choco --version
```

### Step 2: Install AWS CLI via Chocolatey

```powershell
choco install awscli -y
```

> The `-y` flag automatically confirms the installation without asking you to type "yes".

### Step 3: Verify Installation

Close and reopen your terminal, then run:

```powershell
aws --version
```

---

## 📦 Method 3: Install Using winget

**winget** is Microsoft's official package manager, built into Windows 10 (version 1809+) and Windows 11.

### Step 1: Install AWS CLI via winget

1. Open **PowerShell** or **Windows Terminal**
2. Run:

```powershell
winget install Amazon.AWSCLI
```

3. Follow any prompts that appear
4. Accept the license agreement if prompted

### Step 2: Verify Installation

Close and reopen your terminal, then run:

```powershell
aws --version
```

### Comparison of Installation Methods

| Method | Ease | Auto-Updates | Best For |
|---|---|---|---|
| **MSI Installer** | ⭐⭐⭐ Easy | Manual updates | Most users, first-time install |
| **Chocolatey** | ⭐⭐ Moderate | `choco upgrade awscli` | Users who already use Chocolatey |
| **winget** | ⭐⭐⭐ Easy | `winget upgrade` | Windows 10/11 users who prefer CLI |

---

## 📁 AWS CLI File Locations on Windows

After installing and configuring AWS CLI, it stores files in specific locations:

| File/Folder | Path | Purpose |
|---|---|---|
| **AWS CLI Executable** | `C:\Program Files\Amazon\AWSCLIV2\aws.exe` | The CLI program itself |
| **Configuration File** | `C:\Users\<YourUsername>\.aws\config` | Stores default region, output format |
| **Credentials File** | `C:\Users\<YourUsername>\.aws\credentials` | Stores Access Key ID and Secret Key |
| **CLI Cache** | `C:\Users\<YourUsername>\.aws\cli\cache\` | Cached authentication tokens |

```
📁 C:\Users\YourName\
  └── 📁 .aws\
      ├── 📄 config          ← Region and output settings
      ├── 📄 credentials     ← Access keys (KEEP SECRET!)
      └── 📁 cli\
          └── 📁 cache\      ← Temporary auth tokens
```

> ⚠️ **Security Warning:** The `credentials` file contains your AWS access keys in PLAIN TEXT. Never share this file, never upload it to GitHub, and set appropriate file permissions.

---

## 🧱 Understanding AWS CLI Command Structure

Every AWS CLI command follows this pattern:

```
aws  <service>  <command>  [options]
```

### Breaking it Down

```
aws       → The base command (always starts with 'aws')
 │
 ├── s3          → The AWS service you want to use
 │    │
 │    ├── ls           → The action you want to perform
 │    │
 │    └── --bucket my-bucket  → Options/parameters
 │
 └── ec2         → Another service
      │
      └── describe-instances  → Action for EC2
```

### Examples

```powershell
# List all S3 buckets
aws s3 ls

# Describe all EC2 instances
aws ec2 describe-instances

# Get your IAM user identity
aws sts get-caller-identity

# List IAM users
aws iam list-users

# Get help for any service
aws ec2 help

# Get help for a specific command
aws s3 ls help
```

### Common AWS CLI Options

| Option | Short | Description | Example |
|---|---|---|---|
| `--region` | | Specify AWS region | `--region us-east-1` |
| `--output` | | Output format (json, table, text) | `--output table` |
| `--profile` | | Use a named profile | `--profile dev` |
| `--query` | | Filter output using JMESPath | `--query 'Reservations[*]'` |
| `--dry-run` | | Test without making changes | `--dry-run` |
| `--no-paginate` | | Disable automatic pagination | `--no-paginate` |

---

## 🧪 Basic AWS CLI Commands to Test

> ⚠️ **Note:** Most of these commands require AWS CLI to be configured with credentials. See `05-iam-user-and-cli-config.md` for setup.

### Commands That Don't Need Configuration

```powershell
# Check AWS CLI version
aws --version

# Get help
aws help

# Get help for a specific service
aws s3 help

# List all available services
aws help | Select-String "o  "
```

### Commands That Need Configuration (After Setting Up Credentials)

```powershell
# Check who you are logged in as
aws sts get-caller-identity

# Example output:
# {
#     "UserId": "AIDAEXAMPLEID",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/myuser"
# }

# List S3 buckets
aws s3 ls

# List EC2 instances
aws ec2 describe-instances

# List IAM users
aws iam list-users

# Get your account's available regions
aws ec2 describe-regions --output table
```

---

## 🔄 Updating AWS CLI

AWS regularly releases updates with new features, bug fixes, and new service support.

### Check Current Version

```powershell
aws --version
```

### Update Using MSI (Re-download and Install)

1. Download the latest MSI from: `https://awscli.amazonaws.com/AWSCLIV2.msi`
2. Run the installer — it will automatically update the existing installation
3. Verify the new version:

```powershell
aws --version
```

### Update Using Chocolatey

```powershell
choco upgrade awscli -y
```

### Update Using winget

```powershell
winget upgrade Amazon.AWSCLI
```

---

## 🗑️ Uninstalling AWS CLI

### Method 1: Using Windows Settings

1. Press `Win + I` to open **Settings**
2. Go to **Apps** → **Installed apps** (or **Apps & features** on Win 10)
3. Search for **"AWS Command Line Interface"**
4. Click the **three dots (⋯)** next to it
5. Click **"Uninstall"**
6. Confirm the uninstall

### Method 2: Using PowerShell

```powershell
# Using winget
winget uninstall Amazon.AWSCLI

# Using Chocolatey
choco uninstall awscli -y
```

### Clean Up Configuration Files (Optional)

After uninstalling, you may want to remove the configuration files:

```powershell
# Remove the .aws directory (contains config and credentials)
Remove-Item -Recurse -Force "$env:USERPROFILE\.aws"
```

> ⚠️ **Warning:** This permanently deletes your AWS configuration and credentials. Make sure you have backups of any important profiles.

### Verify Uninstallation

```powershell
aws --version
# Should return: "aws is not recognized as an internal or external command"
```

---

## ❌ Common Installation Errors and Fixes

### Error 1: "aws is not recognized as an internal or external command"

**Cause:** The AWS CLI installation directory is not in your system PATH.

**Fix:**
1. Close ALL terminal windows
2. Open a **new** terminal window
3. If it still doesn't work, add AWS CLI to PATH manually:

```powershell
# Check if the exe exists
Test-Path "C:\Program Files\Amazon\AWSCLIV2\aws.exe"

# If true, add to PATH
$env:PATH += ";C:\Program Files\Amazon\AWSCLIV2\"

# To make it permanent, add to System PATH:
# 1. Press Win + R, type "sysdm.cpl", press Enter
# 2. Click "Advanced" tab → "Environment Variables"
# 3. Under "System variables", find "Path", click "Edit"
# 4. Click "New" and add: C:\Program Files\Amazon\AWSCLIV2\
# 5. Click OK on all dialogs
# 6. Restart your terminal
```

### Error 2: "Access Denied" During Installation

**Cause:** You don't have administrator privileges.

**Fix:** Run the installer as Administrator:
1. Right-click on `AWSCLIV2.msi`
2. Select **"Run as administrator"**
3. Click **"Yes"** on the UAC prompt

### Error 3: "Another version of this product is already installed"

**Cause:** An older version of AWS CLI is already installed.

**Fix:**
1. Uninstall the existing version first (see Uninstalling section above)
2. Restart your computer
3. Install the new version

### Error 4: PowerShell Execution Policy Error

**Cause:** PowerShell blocks script execution by default.

**Fix:**
```powershell
# Check current policy
Get-ExecutionPolicy

# Set to RemoteSigned (recommended for development)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# Try your command again
```

### Error 5: SSL/TLS Certificate Errors

**Cause:** Your system's date/time is wrong, or a proxy is intercepting connections.

**Fix:**
1. Check your system date and time are correct
2. If you're behind a corporate proxy, configure it:

```powershell
# Set proxy for AWS CLI
$env:HTTP_PROXY="http://proxy.company.com:8080"
$env:HTTPS_PROXY="http://proxy.company.com:8080"
```

---

## ☁️ AWS CLI vs AWS CloudShell

**AWS CloudShell** is a browser-based terminal that comes pre-installed with AWS CLI. It's available directly from the AWS Console.

| Feature | AWS CLI (Local) | AWS CloudShell (Browser) |
|---|---|---|
| **Installation** | Must install on your computer | Pre-installed, nothing to set up |
| **Authentication** | Requires access keys configuration | Uses your console login automatically |
| **Persistent Storage** | Your local file system | 1 GB persistent storage per region |
| **Access** | From any terminal on your PC | Only from AWS Console in a browser |
| **Customization** | Full control over tools and versions | Limited to pre-installed tools |
| **Offline Use** | Yes (for help commands) | No, needs internet |
| **Scripting** | Full automation capability | Can run scripts but limited |
| **Cost** | Free | Free (included with AWS account) |
| **Best For** | Daily development, CI/CD, automation | Quick tasks, learning, testing |

### How to Access CloudShell

1. Log in to the **AWS Management Console**
2. Click the **CloudShell icon** ( `>_` ) in the top-right toolbar
3. Wait for the terminal to load (first time takes ~30 seconds)
4. You're ready to use AWS CLI commands!

```
┌─────────────────────────────────────────────────────────┐
│  AWS Console     [Services ▼]   🔍      >_ 🔔  Region │
│                                          ↑              │
│                               CloudShell icon           │
└─────────────────────────────────────────────────────────┘
```

> 💡 **Pro Tip:** Use CloudShell when you're learning and testing. Use the locally installed CLI when you're building real projects and need automation.

---

## 🔧 Environment Variables for AWS CLI

AWS CLI uses environment variables to configure behavior. These override the values in config/credentials files.

| Variable | Description | Example |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | Your access key ID | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | Your secret access key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_SESSION_TOKEN` | Temporary session token (for STS) | Token string |
| `AWS_DEFAULT_REGION` | Default AWS region | `us-east-1` |
| `AWS_DEFAULT_OUTPUT` | Default output format | `json`, `table`, or `text` |
| `AWS_PROFILE` | Named profile to use | `dev`, `prod` |
| `AWS_CONFIG_FILE` | Custom path to config file | `C:\custom\config` |
| `AWS_SHARED_CREDENTIALS_FILE` | Custom path to credentials file | `C:\custom\credentials` |
| `HTTP_PROXY` | HTTP proxy URL | `http://proxy:8080` |
| `HTTPS_PROXY` | HTTPS proxy URL | `https://proxy:8443` |
| `AWS_CA_BUNDLE` | Custom CA certificate bundle | Path to `.pem` file |

### Setting Environment Variables in PowerShell

```powershell
# Temporary (current session only)
$env:AWS_DEFAULT_REGION = "us-east-1"
$env:AWS_DEFAULT_OUTPUT = "table"

# Verify
echo $env:AWS_DEFAULT_REGION
```

### Setting Environment Variables Permanently

```powershell
# Set user-level environment variable (persists across sessions)
[System.Environment]::SetEnvironmentVariable("AWS_DEFAULT_REGION", "us-east-1", "User")
```

### Order of Precedence

AWS CLI reads configuration in this order (first found wins):

```
1. Command line options     (--region us-west-2)        ← Highest priority
2. Environment variables    ($env:AWS_DEFAULT_REGION)
3. CLI credentials file     (~\.aws\credentials)
4. CLI config file          (~\.aws\config)
5. Container credentials    (ECS task role)
6. Instance profile         (EC2 instance role)          ← Lowest priority
```

---

## 📝 Quick Summary

```
┌─────────────────────────────────────────────────────────────────┐
│               AWS CLI INSTALLATION SUMMARY                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  What: A command-line tool to control AWS from your terminal    │
│                                                                 │
│  Install (pick one):                                            │
│    🟢 MSI Installer → Download from AWS, double-click, done    │
│    🔵 Chocolatey    → choco install awscli -y                   │
│    🟡 winget        → winget install Amazon.AWSCLI              │
│                                                                 │
│  Verify:  aws --version                                         │
│                                                                 │
│  Config files location:                                         │
│    📁 C:\Users\<You>\.aws\config        (region, output)        │
│    📁 C:\Users\<You>\.aws\credentials   (access keys)           │
│                                                                 │
│  Command structure:                                             │
│    aws <service> <command> [options]                             │
│    Example: aws s3 ls --region us-east-1                        │
│                                                                 │
│  Update:                                                        │
│    Re-download MSI / choco upgrade / winget upgrade              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Interview Questions

### Basic Level

**Q1: What is AWS CLI?**
> **A:** AWS CLI (Command Line Interface) is an open-source tool from Amazon that allows you to interact with AWS services using commands in your terminal. It provides direct access to the public APIs of AWS services, enabling you to manage resources, automate tasks, and write scripts.

**Q2: What is the command to check the AWS CLI version?**
> **A:** `aws --version` — This outputs the CLI version, the Python version it uses, the operating system, and the architecture.

**Q3: What is the general structure of an AWS CLI command?**
> **A:** The structure is `aws <service> <command> [subcommand] [options]`. For example: `aws s3 ls --region us-east-1` where `s3` is the service, `ls` is the command, and `--region` is an option.

**Q4: Where does AWS CLI store configuration files on Windows?**
> **A:** In the `.aws` folder under the user's home directory: `C:\Users\<Username>\.aws\`. This contains two key files: `config` (for region and output settings) and `credentials` (for access keys).

**Q5: What are the three methods to install AWS CLI on Windows?**
> **A:** (1) MSI Installer — download and run the official `.msi` file from AWS, (2) Chocolatey — run `choco install awscli`, and (3) winget — run `winget install Amazon.AWSCLI`.

### Intermediate Level

**Q6: What is the difference between AWS CLI and AWS CloudShell?**
> **A:** AWS CLI is installed locally on your machine, requires credential configuration, and offers full automation capability. AWS CloudShell is a browser-based shell available in the AWS Console that comes pre-configured with your console credentials — no installation or key setup needed. CloudShell is best for quick tasks, while local CLI is better for development and automation.

**Q7: What is the order of precedence for AWS CLI configuration?**
> **A:** From highest to lowest priority: (1) Command-line options, (2) Environment variables, (3) CLI credentials file, (4) CLI config file, (5) Container credentials, (6) Instance profile credentials. Higher-priority sources override lower-priority ones.

**Q8: How do you specify the output format in AWS CLI?**
> **A:** Three ways: (1) In the command: `--output json` (or `table`, `text`), (2) Environment variable: `AWS_DEFAULT_OUTPUT=json`, (3) Config file: set `output = json` in `~/.aws/config`. The default is `json`.

**Q9: How do you update AWS CLI on Windows?**
> **A:** Download the latest MSI installer from the AWS website and run it — it updates the existing installation in place. Alternatively, use `choco upgrade awscli` (Chocolatey) or `winget upgrade Amazon.AWSCLI` (winget).

**Q10: What happens if AWS CLI is installed but `aws --version` returns "not recognized"?**
> **A:** This means the AWS CLI installation directory is not in the system's PATH environment variable. The fix is to either restart the terminal (PATH is read at terminal startup), restart the computer, or manually add `C:\Program Files\Amazon\AWSCLIV2\` to the system PATH variable.

### Advanced Level

**Q11: How do you configure AWS CLI to use a proxy server?**
> **A:** Set the environment variables `HTTP_PROXY` and `HTTPS_PROXY` to your proxy URL (e.g., `http://proxy.company.com:8080`). For HTTPS proxies with custom certificates, set `AWS_CA_BUNDLE` to the path of your CA certificate bundle file.

**Q12: What is the `--query` option in AWS CLI and what language does it use?**
> **A:** The `--query` option uses JMESPath, a query language for JSON, to filter and transform the output of AWS CLI commands. For example, `aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name]' --output table` shows only instance IDs and their states in a table format.

**Q13: Can you run AWS CLI v1 and v2 side by side on the same machine?**
> **A:** Yes, but it's not recommended. If needed, you can install v2 in a custom directory, add its path to PATH, and use `aws2` as an alias. However, AWS recommends migrating fully to v2 as v1 is in maintenance mode and will reach end of support.

**Q14: How would you automate AWS resource creation using AWS CLI in a script?**
> **A:** Create a PowerShell or Bash script with AWS CLI commands. Use `--query` and `--output text` to capture resource IDs, store them in variables, and pass them to subsequent commands. Use `aws ... --no-paginate` for consistent output. Handle errors with `$LASTEXITCODE` (PowerShell) or `$?` (Bash). Use named profiles with `--profile` for different environments.

---

## ➡️ What's Next?

Now that AWS CLI is installed, you need to:

1. **Create an IAM User** → For secure access (don't use root!)
2. **Configure AWS CLI with credentials** → `aws configure`
3. **Start using CLI commands** to manage AWS resources

👉 See the next guide: **`05-iam-user-and-cli-config.md`**

---

> 📌 **Remember:** Installing AWS CLI is just the first step. It won't work until you configure it with valid AWS credentials (Access Key ID and Secret Access Key).

*Last updated: June 2025*
