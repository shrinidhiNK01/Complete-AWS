# 🌐 AWS Free Tier Account — Complete Step-by-Step Guide

## 📚 What You'll Learn

- What the AWS Free Tier is and the 3 types of free offerings
- A complete list of popular free tier services and their limits
- How to create an AWS account from scratch (every click, every page)
- How to log in for the first time and navigate the AWS Console
- How to set up billing alerts so you never get a surprise bill
- How to create a budget alarm step by step
- Common mistakes beginners make (and how to avoid them)
- How to close/delete your AWS account safely
- Security best practices every new AWS user must follow

---

## 🔑 Prerequisites

Before you start, make sure you have these ready:

| Requirement | Details |
|---|---|
| ✅ Email Address | A valid email you can access (Gmail, Outlook, etc.). Each email can only be linked to ONE AWS account. |
| ✅ Phone Number | A mobile or landline number for verification (SMS or voice call). |
| ✅ Credit or Debit Card | A valid international Visa, MasterCard, or Amex. AWS will place a temporary $1 (or ₹2) hold to verify the card — this is refunded. |
| ✅ Web Browser | Chrome, Firefox, Edge, or Safari (latest version recommended). |

> ⚠️ **Important:** You MUST have a credit or debit card. Prepaid cards may not work in all regions. AWS needs the card to verify your identity and charge you if you exceed free tier limits.

---

## 🆓 What is AWS Free Tier?

Think of it like a **free trial at a gym**. AWS lets you try out their services for free — but with limits. If you go beyond those limits, you start paying.

### Real-World Analogy

Imagine a buffet restaurant that says:
- "You can eat 5 appetizers for free **forever**" → **Always Free**
- "For the first 12 months, you get free desserts" → **12 Months Free**
- "Try our special dish free for 30 days" → **Free Trials**

### The 3 Types of AWS Free Tier

| Type | Duration | Example |
|---|---|---|
| **Always Free** | Never expires. Free forever (within limits). | AWS Lambda — 1 million requests/month |
| **12 Months Free** | Free for 12 months after you create your account. | EC2 — 750 hours/month of t2.micro or t3.micro |
| **Free Trials** | Short-term trial (30, 60, or 90 days). | Amazon SageMaker — 2 months free trial |

> 💡 **Pro Tip:** The 12-month clock starts ticking THE DAY you create your account — even if you don't use any services. So create your account only when you're ready to learn!

---

## 📋 Complete List of Popular Free Tier Services

### Always Free Services (Never Expire)

| Service | Free Limit | What It Does |
|---|---|---|
| **AWS Lambda** | 1 million requests/month, 400,000 GB-seconds | Run code without servers |
| **Amazon DynamoDB** | 25 GB storage, 25 read/write capacity units | NoSQL database |
| **Amazon SNS** | 1 million publishes/month | Send notifications (email, SMS) |
| **Amazon SQS** | 1 million requests/month | Message queue service |
| **Amazon CloudWatch** | 10 custom metrics, 10 alarms | Monitor your AWS resources |
| **AWS CloudFormation** | Free (you pay only for resources created) | Infrastructure as Code |
| **AWS IAM** | Always free | Manage users and permissions |
| **Amazon SES** | 62,000 outbound emails/month (from EC2) | Send emails |
| **AWS Step Functions** | 4,000 state transitions/month | Orchestrate workflows |

### 12 Months Free Services (From Account Creation Date)

| Service | Free Limit (per month) | What It Does |
|---|---|---|
| **Amazon EC2** | 750 hours of t2.micro or t3.micro (Linux/Windows) | Virtual servers in the cloud |
| **Amazon S3** | 5 GB storage, 20,000 GET requests, 2,000 PUT requests | Object storage (files, images, videos) |
| **Amazon RDS** | 750 hours of db.t2.micro or db.t3.micro, 20 GB storage | Managed relational database |
| **Amazon EBS** | 30 GB of General Purpose (SSD) storage | Block storage for EC2 |
| **Amazon CloudFront** | 1 TB data transfer out, 10 million requests | Content Delivery Network (CDN) |
| **Amazon VPC** | Always free (part of networking) | Virtual Private Cloud |
| **Elastic Load Balancing** | 750 hours/month, 15 GB data processing | Distribute traffic across servers |
| **Amazon API Gateway** | 1 million API calls/month | Create and manage APIs |
| **Amazon ElastiCache** | 750 hours of cache.t2.micro or cache.t3.micro | In-memory caching |

### Free Trials (Limited Duration)

| Service | Trial Duration | What It Does |
|---|---|---|
| **Amazon SageMaker** | 2 months | Machine Learning platform |
| **Amazon Redshift** | 2 months (750 hours of dc2.large) | Data warehousing |
| **Amazon QuickSight** | 30 days | Business Intelligence dashboards |
| **Amazon Inspector** | 15 days | Security vulnerability scanning |
| **Amazon GuardDuty** | 30 days | Threat detection |

> 📌 **Full list:** Visit [https://aws.amazon.com/free/](https://aws.amazon.com/free/) for the complete and up-to-date list.

---

## 🛠️ Step-by-Step: Create an AWS Free Tier Account

### Step 1: Go to the AWS Website

1. Open your web browser (Chrome recommended)
2. Go to **[https://aws.amazon.com/](https://aws.amazon.com/)**
3. You'll see the AWS homepage with a big orange button

```
🌐 URL: https://aws.amazon.com/
```

### Step 2: Click "Create an AWS Account"

1. Look at the **top-right corner** of the page
2. Click the **"Create an AWS Account"** button (orange button)
3. You will be redirected to the sign-up page

> 💡 **Pro Tip:** If you already have an account, you'll see "Sign In to the Console" instead. Click "Create a new AWS account" link below the sign-in form.

### Step 3: Enter Email and Account Name

On the sign-up page, you'll see two fields:

| Field | What to Enter |
|---|---|
| **Root user email address** | Your personal email (e.g., `yourname@gmail.com`) |
| **AWS account name** | Any name you want (e.g., `MyLearningAccount`, `JohnDoe-Dev`) |

1. Type your **email address** in the first field
2. Type an **account name** in the second field (you can change this later)
3. Click **"Verify email address"**

```
Example:
  Email: john.doe.aws@gmail.com
  Account Name: JohnDoe-Learning
```

> ⚠️ **Important:** This email becomes your **root user** email. The root user has FULL access to everything in the account. Keep this email secure!

### Step 4: Verify Your Email with OTP

1. AWS sends a **verification code** (OTP) to the email you entered
2. Open your email inbox (check spam/junk folder if you don't see it)
3. Find the email from **Amazon Web Services** with the subject: "AWS Email Verification"
4. Copy the **6-digit verification code**
5. Paste it into the verification field on the AWS page
6. Click **"Verify"**

```
Example OTP: 482917
```

> ⚠️ **Troubleshooting:** If you don't receive the OTP within 2 minutes:
> - Check your spam/junk folder
> - Make sure you typed the email correctly
> - Click "Resend code"

### Step 5: Set Your Root Password

1. You'll be asked to create a **root user password**
2. Enter a **strong password** that meets these requirements:

| Requirement | Example |
|---|---|
| At least 8 characters | ✅ |
| At least one uppercase letter | `A-Z` |
| At least one lowercase letter | `a-z` |
| At least one number | `0-9` |
| At least one special character | `!@#$%^&*` |

3. Confirm the password by typing it again
4. Click **"Continue"**

```
Example of a strong password: MyAWS@2025!Secure
(Don't use this exact password — make your own!)
```

> 🔑 **Pro Tip:** Use a password manager (like Bitwarden, LastPass, or 1Password) to generate and store a strong password. NEVER reuse passwords from other sites.

### Step 6: Choose Account Type — Personal or Business

You'll see two options:

| Option | Choose If... |
|---|---|
| **Personal** | You're learning, doing personal projects, or experimenting |
| **Business** | You're creating an account for your company or organization |

1. Select **"Personal"** (recommended for learning)
2. Click **"Continue"**

> 💡 **Note:** There is NO difference in features or services between Personal and Business accounts. The only difference is in the information you'll be asked to provide.

### Step 7: Enter Contact Information

Fill in your personal details:

| Field | What to Enter |
|---|---|
| **Full Name** | Your legal name |
| **Phone Number** | Your mobile number with country code (e.g., +91 9876543210) |
| **Country/Region** | Select your country from the dropdown |
| **Address** | Your street address |
| **City** | Your city |
| **State/Province** | Your state or province |
| **Postal Code** | Your ZIP or PIN code |

1. Fill in ALL the fields
2. Read and accept the **AWS Customer Agreement** checkbox
3. Click **"Continue"**

### Step 8: Enter Payment Information

> ⚠️ **"Why does AWS need my credit card if it's free?"**
>
> Great question! AWS asks for your card because:
> 1. **Identity Verification** — To confirm you're a real person
> 2. **Safety Net** — If you accidentally use more than the free tier allows, AWS needs a way to charge you
> 3. **Fraud Prevention** — To prevent people from creating thousands of fake accounts
>
> **AWS will place a temporary hold of $1 USD (or ₹2 INR)** on your card. This is NOT a charge — it will be refunded within 3-5 business days.

1. Enter your **credit or debit card number**
2. Enter the **expiration date**
3. Enter the **cardholder's name**
4. Enter the **billing address** (or check "Use my contact address")
5. Click **"Verify and Continue"**

```
Supported Cards:
  ✅ Visa
  ✅ MasterCard
  ✅ American Express
  ✅ Discover
  ✅ JCB

  ❌ Prepaid cards may NOT work in all regions
  ❌ Virtual cards may be rejected
```

### Step 9: Phone Verification (Identity Confirmation)

1. Choose your verification method:
   - **Text message (SMS)** — Recommended
   - **Voice call**
2. Enter your **phone number** with country code
3. Enter the **CAPTCHA** code shown on screen
4. Click **"Send SMS"** (or "Call me now")
5. You'll receive a **4-digit code** via SMS or voice call
6. Enter the code in the verification field
7. Click **"Verify Code"**

```
Example SMS code: 7293
```

### Step 10: Choose Your Support Plan

You'll see 4 support plan options:

| Plan | Cost | Best For |
|---|---|---|
| **Basic Support (Free)** | $0/month | ✅ Learning, personal projects |
| Developer Support | $29/month | Development and testing |
| Business Support | $100+/month | Production workloads |
| Enterprise Support | $15,000+/month | Large enterprises |

1. Select **"Basic Support - Free"** ✅
2. Click **"Complete sign up"**

> ⚠️ **IMPORTANT:** ALWAYS choose **Basic Support (Free)** unless you're running a production business. You can upgrade later at any time.

### Step 11: Account Creation Complete! 🎉

1. You'll see a **"Congratulations!"** page
2. AWS will send a confirmation email to your registered email address
3. Click **"Go to the AWS Management Console"**

> 💡 **Note:** It may take a few minutes (up to 24 hours in rare cases) for your account to be fully activated. If you see errors logging in, wait and try again.

---

## 🔐 First Login Walkthrough

### Logging into Your AWS Account

1. Go to **[https://console.aws.amazon.com/](https://console.aws.amazon.com/)**
2. Select **"Root user"**
3. Enter your **root user email address**
4. Click **"Next"**
5. Enter your **password**
6. Click **"Sign in"**

```
URL: https://console.aws.amazon.com/

Login Type: Root user
Email: john.doe.aws@gmail.com
Password: ••••••••••
```

### AWS Management Console Overview

After logging in, you'll see the **AWS Management Console** — your main dashboard.

```
┌─────────────────────────────────────────────────────────────────────┐
│  AWS Management Console                            🔔  Region ▼   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🔍 Search for services (e.g., "EC2", "S3", "IAM")                │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Recently     │  │  Favorites   │  │  All         │              │
│  │  Visited      │  │  ⭐          │  │  Services    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  AWS Health Dashboard    |    Cost Explorer    |    Billing         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Key areas to know:**

| Area | Where | What It Does |
|---|---|---|
| **Search Bar** | Top center | Search for any AWS service by name |
| **Region Selector** | Top-right | Choose which data center region to use (e.g., `us-east-1`, `ap-south-1`) |
| **Account Menu** | Top-right (your name) | Access account settings, billing, security credentials |
| **Notification Bell** | Top-right | Alerts and notifications |
| **CloudShell Icon** | Top-right | Open a terminal in your browser |
| **Services Menu** | Top-left hamburger menu | Browse all AWS services by category |

> 💡 **Pro Tip:** Pin your most-used services (EC2, S3, IAM) by clicking the ⭐ star icon next to them. They'll appear in your Favorites bar.

---

## 💰 Setting Up Billing Alerts (CRITICAL!)

> ⚠️ **This is the MOST IMPORTANT thing you should do immediately after creating your account.** Without billing alerts, you could accidentally rack up a huge bill and not know until the end of the month!

### Why Billing Alerts Matter — A Cautionary Tale

Many beginners have accidentally left an EC2 instance running for weeks, or launched a large RDS database, and received a bill of $50, $100, or even $1,000+. Billing alerts are your safety net.

### Step-by-Step: Enable Billing Alerts

1. Sign in to the **AWS Management Console** as the Root user
2. Click your **account name** in the top-right corner
3. Select **"Billing and Cost Management"**
4. In the left sidebar, click **"Billing preferences"**
5. Under **"Alert preferences"**, click **"Edit"**
6. Check ✅ **"Receive AWS Free Tier alerts"**
7. Enter your **email address** for notifications
8. Check ✅ **"Receive CloudWatch billing alerts"**
9. Click **"Save preferences"**

### Step-by-Step: Create a Budget Alarm

AWS Budgets lets you set a spending limit and get notified when you approach it.

1. Go to the **AWS Management Console**
2. Search for **"Budgets"** in the search bar (or go to Billing → Budgets)
3. Click **"Create a budget"**
4. Choose **"Use a template (simplified)"**
5. Select **"Zero spend budget"** (alerts you if you spend ANY money)
6. Enter a **budget name**: `MyFreeTierBudget`
7. Enter your **email** for notifications
8. Click **"Create budget"**

```
Budget Settings Example:
  Template: Zero spend budget
  Budget Name: MyFreeTierBudget
  Amount: $0.01 (any spend triggers alert)
  Notification Email: john.doe.aws@gmail.com
```

> 💡 **Pro Tip:** You can also create a **Monthly cost budget** with a specific amount (e.g., $5) if you plan to do some paid experiments.

### Alternative: Create a Custom Budget

1. Go to **Billing → Budgets → Create budget**
2. Choose **"Customize (advanced)"**
3. Select **"Cost budget"**
4. Set **budget amount**: `$5.00` (or whatever your limit is)
5. Set **period**: Monthly
6. Under **"Configure alerts"**:
   - Set threshold to **80%** of budgeted amount
   - Add your email address
   - Optionally set a **second alert** at **100%**
7. Click **"Create budget"**

---

## ❌ Common Mistakes New Users Make

| # | Mistake | Why It's Dangerous | How to Avoid |
|---|---|---|---|
| 1 | **Forgetting to stop EC2 instances** | You're charged per hour even if you're not using it | Always STOP or TERMINATE instances when done practicing |
| 2 | **Launching resources in multiple regions** | You might forget about resources in other regions | Stick to ONE region for learning (e.g., `us-east-1`) |
| 3 | **Not setting billing alerts** | You won't know you're being charged until the bill arrives | Set up billing alerts immediately (see above) |
| 4 | **Using the root account for daily work** | Root has unlimited access — if compromised, everything is at risk | Create an IAM user for daily work |
| 5 | **Not enabling MFA** | Anyone with your password can access everything | Enable Multi-Factor Authentication on root account |
| 6 | **Sharing access keys publicly** | Hackers scan GitHub for AWS keys and mine cryptocurrency on your account | NEVER commit keys to Git. Use `.gitignore` |
| 7 | **Choosing the wrong instance type** | Non-free-tier instances cost money from minute one | Always select `t2.micro` or `t3.micro` for free tier |
| 8 | **Ignoring the region selector** | Services and resources are region-specific | Always check which region you're in |
| 9 | **Not reading the free tier limits** | Exceeding limits triggers charges silently | Check [aws.amazon.com/free](https://aws.amazon.com/free) regularly |
| 10 | **Leaving EBS volumes and Elastic IPs** | These cost money even when not attached to instances | Delete unused EBS volumes and release Elastic IPs |

---

## 🗑️ How to Close/Delete Your AWS Account

> ⚠️ **Warning:** Closing your account is PERMANENT. All data, resources, and services will be deleted. Make sure you download any data you need before closing.

### Before You Close

1. **Terminate ALL running resources** (EC2 instances, RDS databases, etc.)
2. **Delete ALL S3 buckets** and their contents
3. **Release ALL Elastic IPs**
4. **Download any data** you want to keep
5. **Check ALL regions** for running resources (this is easily forgotten!)

### Step-by-Step: Close Your Account

1. Sign in as the **Root user**
2. Click your **account name** in the top-right corner
3. Select **"Account"**
4. Scroll down to the very bottom of the page
5. Find the section **"Close Account"**
6. Read the information carefully
7. Check ALL the acknowledgment boxes
8. Click **"Close Account"**
9. Confirm by clicking **"Close Account"** again

> 📌 **Important Notes:**
> - Your account enters a 90-day **suspension period** before permanent deletion
> - During the suspension period, you can reopen your account by contacting AWS Support
> - Any remaining charges will still be billed to your card
> - After 90 days, all data is permanently destroyed

---

## 🔒 Security Best Practices for New Accounts

These are things you should do RIGHT AFTER creating your account:

### 1. Enable MFA on Root Account

Multi-Factor Authentication adds a second layer of security.

1. Go to **IAM** in the AWS Console
2. Click **"Add MFA"** under the Security recommendations
3. Choose **"Virtual MFA device"**
4. Scan the QR code with an authenticator app (Google Authenticator, Authy, Microsoft Authenticator)
5. Enter two consecutive MFA codes
6. Click **"Assign MFA"**

### 2. Create an IAM User (Don't Use Root!)

The root account is like a master key. You should:
- Create an **IAM user** with admin permissions for daily work
- Only use root for billing and account-level tasks
- (See the next documentation file: `05-iam-user-and-cli-config.md`)

### 3. Enable CloudTrail

CloudTrail records all API calls made in your account — like a security camera.

1. Go to **CloudTrail** in the AWS Console
2. Click **"Create trail"**
3. Name it: `my-learning-trail`
4. Choose to store logs in an S3 bucket
5. Click **"Create"**

### 4. Review Security Hub Recommendations

1. Go to **Security Hub** in the AWS Console
2. Enable Security Hub
3. Review and follow the security recommendations

### Security Checklist

```
✅  Enable MFA on root account
✅  Create IAM user for daily use
✅  Set up billing alerts and budgets
✅  Enable CloudTrail
✅  Don't share access keys
✅  Use strong, unique passwords
✅  Review IAM credentials report regularly
✅  Don't store secrets in code
```

---

## 📝 Quick Summary

```
┌────────────────────────────────────────────────────────────────┐
│                    AWS FREE TIER SUMMARY                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  3 Types:                                                      │
│    🟢 Always Free   → Never expires (Lambda, DynamoDB, IAM)   │
│    🔵 12 Months     → Free for 1 year (EC2, S3, RDS)          │
│    🟡 Free Trials   → Short trials (SageMaker, Redshift)      │
│                                                                │
│  Account Creation Needs:                                       │
│    📧 Email + 📱 Phone + 💳 Card                              │
│                                                                │
│  After Creating Account:                                       │
│    1. Set up billing alerts                                    │
│    2. Enable MFA                                               │
│    3. Create IAM user                                          │
│    4. Never use root for daily work                            │
│                                                                │
│  Remember:                                                     │
│    ⚠️  12-month clock starts on sign-up day                   │
│    ⚠️  Always STOP/TERMINATE resources when done              │
│    ⚠️  Check ALL regions for forgotten resources              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Interview Questions

### Basic Level

**Q1: What is the AWS Free Tier?**
> **A:** The AWS Free Tier lets new and existing customers explore and try out AWS services for free, within specified limits. It has three types: Always Free (never expires), 12 Months Free (free for the first year after account creation), and Free Trials (short-term trials for specific services).

**Q2: What are the 3 types of AWS Free Tier?**
> **A:**
> 1. **Always Free** — Services that are free forever within usage limits (e.g., Lambda: 1M requests/month)
> 2. **12 Months Free** — Services free for the first 12 months after account creation (e.g., EC2 t2.micro: 750 hours/month)
> 3. **Free Trials** — Short-term trials that start when you activate a service (e.g., SageMaker: 2 months)

**Q3: What is a root user in AWS?**
> **A:** The root user is the account owner who created the AWS account. It has unrestricted access to ALL services and resources. It's identified by the email address used during account creation. AWS strongly recommends not using the root user for everyday tasks.

**Q4: Why does AWS ask for a credit card during free tier account creation?**
> **A:** AWS requires a credit/debit card for three reasons: (1) Identity verification to confirm you're a real person, (2) As a payment method in case you exceed free tier limits, and (3) Fraud prevention to stop creation of fake accounts. A small temporary hold ($1/₹2) is placed and refunded.

**Q5: How much does the AWS Basic Support plan cost?**
> **A:** The Basic Support plan is completely FREE ($0/month). It includes access to documentation, whitepapers, support forums, AWS Trusted Advisor (limited checks), and AWS Personal Health Dashboard.

### Intermediate Level

**Q6: What happens when the 12-month free tier period expires?**
> **A:** After 12 months, you are charged standard on-demand rates for any services that were in the "12 Months Free" category. Always Free services continue to be free within their limits. You should set up billing alerts before the period ends to avoid unexpected charges.

**Q7: Is the free tier 750 hours per instance or per account?**
> **A:** The 750 hours of EC2 t2.micro/t3.micro is **per account per month**, NOT per instance. If you run two t2.micro instances for the entire month (2 × 730 hours = 1,460 hours), you'll exceed the 750-hour limit and be charged for the extra 710 hours.

**Q8: How do you monitor free tier usage in AWS?**
> **A:** You can monitor free tier usage through: (1) The Billing Dashboard → Free Tier page, (2) AWS Budgets with alerts, (3) CloudWatch billing alarms, (4) AWS Cost Explorer, and (5) Email notifications if you enabled free tier alerts in Billing Preferences.

**Q9: Can you have multiple AWS free tier accounts?**
> **A:** Technically, each unique email address can create one AWS account, and each new account gets its own free tier. However, AWS's Terms of Service prohibit creating multiple accounts solely to abuse the free tier. AWS may terminate accounts found violating this policy.

**Q10: What is the difference between stopping and terminating an EC2 instance?**
> **A:**
> - **Stopping** an instance is like putting it to sleep — the instance state is saved, EBS volumes are preserved, and you can restart it later. You are NOT charged for compute but ARE charged for EBS storage.
> - **Terminating** an instance is like deleting it permanently — the instance and its root EBS volume are destroyed. No further charges occur.

### Advanced Level

**Q11: What services are NOT covered under the AWS Free Tier?**
> **A:** Many services have no free tier at all, including: Amazon Managed Streaming for Apache Kafka (MSK), AWS Direct Connect, Amazon Elastic Kubernetes Service (EKS) control plane ($0.10/hour), most of AWS Outposts, and many advanced AI/ML services beyond their trial period.

**Q12: How does AWS billing work across multiple regions?**
> **A:** Free tier limits are typically aggregate across ALL regions. For example, the 750 hours of EC2 t2.micro is the TOTAL across all regions. If you run a t2.micro in us-east-1 for 400 hours and another in eu-west-1 for 400 hours, that's 800 hours total — exceeding the 750-hour free tier limit.

**Q13: What is the AWS Organizations relationship with free tier?**
> **A:** In AWS Organizations, the free tier benefits apply to the consolidated billing family as a whole. The management (master) account's free tier is shared across all member accounts. Only ONE free tier benefit is available per organization, not one per member account.

**Q14: How would you design a cost-optimization strategy for a new AWS account?**
> **A:** A cost-optimization strategy includes: (1) Setting up billing alerts and budgets on day one, (2) Using only free-tier-eligible instance types, (3) Enabling AWS Cost Explorer, (4) Using AWS Trusted Advisor's cost recommendations, (5) Scheduling non-production resources to shut down outside business hours, (6) Using Reserved Instances or Savings Plans for predictable workloads, (7) Regularly reviewing the Cost and Usage Report.

---

## ➡️ What's Next?

Now that you have your AWS account ready, the next steps are:

1. **Install AWS CLI on your computer** → See `04-install-aws-cli-windows.md`
2. **Create an IAM user and configure CLI** → See `05-iam-user-and-cli-config.md`
3. Start building with AWS services (EC2, S3, and more)!

---

> 📌 **Bookmark this page** and refer back whenever you need to check free tier limits or troubleshoot account issues.

*Last updated: June 2025*
