# 🖥️ What is Amazon EC2? — Complete Beginner's Guide

---

## 📚 What You'll Learn

By the end of this guide, you will understand:

- ✅ What Amazon EC2 is and why it exists
- ✅ Real-world use cases for EC2 (10+ examples)
- ✅ All EC2 Instance Types and how to choose the right one
- ✅ EC2 Pricing Models — On-Demand, Reserved, Spot, Savings Plans, Dedicated Hosts
- ✅ The EC2 Instance Lifecycle (Pending → Running → Stopped → Terminated)
- ✅ Amazon Machine Images (AMIs) — what they are and how to create custom ones
- ✅ Key Pairs — how SSH authentication works with `.pem` and `.ppk` files
- ✅ Security Groups — the virtual firewall protecting your instances
- ✅ Elastic IP Addresses — static public IPs for your cloud servers
- ✅ EC2 Instance Store vs EBS — storage options compared
- ✅ EBS Volume Types — gp2, gp3, io1, io2, st1, sc1 in detail
- ✅ Placement Groups — Cluster, Spread, and Partition strategies
- ✅ User Data — bootstrap scripts to automate instance setup
- ✅ Instance Metadata — how your instance knows about itself
- ✅ Auto Scaling — automatically adjusting capacity to meet demand
- ✅ Load Balancers — distributing traffic across multiple instances (ALB, NLB, CLB)
- ✅ 20+ Interview Questions with detailed answers

---

## 🎯 Prerequisites

Before diving into EC2, you should have a basic understanding of:

| Prerequisite | Why It's Needed |
|---|---|
| AWS Account | You need an active AWS account to launch EC2 instances |
| Basic Networking (IP, Ports) | EC2 instances communicate over networks using IPs and ports |
| What is a Server? | EC2 is essentially a virtual server — knowing what a server does helps |
| Linux/Windows Basics | You'll connect to EC2 instances via SSH (Linux) or RDP (Windows) |
| IAM Basics | Understanding roles and permissions helps secure your instances |
| VPC Basics | EC2 instances live inside a VPC (Virtual Private Cloud) |

> 💡 **Don't worry** if you're not an expert in these yet. This guide explains everything in simple language with real-world analogies!

---

## 🔥 Main Content

---

### 1. What is EC2? (Elastic Compute Cloud)

**Amazon EC2 (Elastic Compute Cloud)** is a web service provided by AWS that lets you **rent virtual computers** (called **instances**) in the cloud. Instead of buying and maintaining physical servers, you can launch a virtual server in minutes, use it for as long as you need, and shut it down when you're done.

#### 🏠 Real-World Analogy: Renting a Computer in the Cloud

Think of EC2 like **renting an apartment** instead of buying a house:

| Buying a House (Physical Server) | Renting an Apartment (EC2 Instance) |
|---|---|
| 💰 Huge upfront cost | 💵 Pay only for what you use (hourly/secondly) |
| 🔧 You maintain everything (roof, plumbing, electrical) | 🛠️ AWS maintains the hardware |
| 📦 Fixed size — can't easily add rooms | 📐 Easily resize — upgrade or downgrade anytime |
| ⏳ Takes weeks/months to set up | ⚡ Ready in seconds/minutes |
| 🏚️ Sits idle when you don't need it | 🔄 Turn off when not needed, stop paying |
| 📍 Fixed location | 🌍 Available in 30+ regions worldwide |

#### What Does "Elastic" Mean?

The word **"Elastic"** in EC2 means **flexible and scalable**:

- **Scale UP** → Need more power? Upgrade to a bigger instance (more CPU, RAM)
- **Scale DOWN** → Traffic dropped? Downgrade to save money
- **Scale OUT** → Need more servers? Launch 100 instances in minutes
- **Scale IN** → Don't need them? Terminate instances and stop paying

> 🎯 **Key Takeaway:** EC2 = Virtual computers you can rent by the hour/second in AWS's data centers around the world.

---

### 2. Why Do We Need EC2?

Here are the **key reasons** why EC2 is essential:

| # | Reason | Explanation |
|---|---|---|
| 1 | **No Upfront Investment** | No need to buy expensive physical servers. Start with $0 upfront. |
| 2 | **Instant Provisioning** | Launch a server in under 60 seconds. No waiting for hardware delivery. |
| 3 | **Pay-As-You-Go** | Only pay for the compute time you actually use. Stop the instance = stop paying. |
| 4 | **Global Availability** | Deploy servers in 30+ AWS Regions worldwide, close to your users. |
| 5 | **Elasticity** | Automatically scale up/down based on demand. Handle traffic spikes effortlessly. |
| 6 | **Variety of Instance Types** | Choose from 400+ instance types optimized for different workloads. |
| 7 | **Security** | Built-in security with Security Groups, VPCs, IAM, and encryption. |
| 8 | **Reliability** | AWS guarantees 99.99% SLA for EC2 instances across multiple AZs. |
| 9 | **Integration** | Seamlessly connects with 200+ AWS services (S3, RDS, Lambda, etc.). |
| 10 | **Full Control** | Root access to your instances. Install any software, configure any way you want. |
| 11 | **Multiple OS Support** | Run Linux (Amazon Linux, Ubuntu, RHEL) or Windows Server. |
| 12 | **Cost Optimization** | Multiple pricing models (Spot, Reserved, Savings Plans) can save up to 90%. |

---

### 3. EC2 Use Cases (10+ Real Examples)

EC2 is incredibly versatile. Here are **real-world use cases**:

#### 🌐 Use Case 1: Web Application Hosting
Host your website or web application on EC2 instances. Run Apache, Nginx, Node.js, Django, or any web framework.
> **Example:** A startup hosts its e-commerce website on a fleet of EC2 instances behind a load balancer.

#### 📱 Use Case 2: Mobile App Backend
Build and run the backend API for your mobile application on EC2.
> **Example:** A food delivery app runs its order management API on EC2 instances that auto-scale during lunch and dinner rush hours.

#### 🎮 Use Case 3: Game Servers
Host multiplayer game servers that need low latency and high performance.
> **Example:** A gaming company runs dedicated game servers on EC2 C5 (Compute Optimized) instances in multiple regions for global players.

#### 🤖 Use Case 4: Machine Learning & AI Training
Train deep learning models using GPU-powered EC2 instances.
> **Example:** A research lab trains computer vision models on EC2 P3 instances with NVIDIA Tesla V100 GPUs.

#### 🎬 Use Case 5: Video Encoding & Streaming
Transcode and process video files at scale using compute-optimized instances.
> **Example:** A media company uses EC2 C5 instances to encode thousands of videos into multiple formats (720p, 1080p, 4K).

#### 📊 Use Case 6: Big Data Processing
Process large datasets using frameworks like Apache Spark, Hadoop, or EMR on EC2.
> **Example:** An analytics company processes 10 TB of log data daily using a cluster of EC2 instances running Apache Spark.

#### 🧪 Use Case 7: Development & Testing Environments
Spin up temporary environments for developers to test code before deploying to production.
> **Example:** A dev team launches EC2 instances for each feature branch, runs automated tests, and terminates them after testing.

#### 💾 Use Case 8: Database Hosting
Run self-managed databases (MySQL, PostgreSQL, MongoDB) on EC2 for full control.
> **Example:** A company runs a MongoDB cluster on EC2 R5 (Memory Optimized) instances for a real-time analytics dashboard.

#### 🔬 Use Case 9: High-Performance Computing (HPC)
Run scientific simulations, weather modeling, and genomics analysis.
> **Example:** A pharmaceutical company runs drug discovery simulations on EC2 HPC clusters with hundreds of instances.

#### 🏢 Use Case 10: Enterprise Applications
Run SAP, Oracle, Microsoft applications in the cloud.
> **Example:** A manufacturing company migrates its SAP ERP system from on-premises to EC2 X1 (Memory Optimized) instances.

#### 🔐 Use Case 11: VPN & Bastion Hosts
Use a small EC2 instance as a jump server (bastion host) to securely access private resources in your VPC.
> **Example:** A security-conscious company routes all SSH access through a hardened t3.micro bastion host.

#### 📧 Use Case 12: Batch Processing
Run scheduled batch jobs — data imports, report generation, file processing.
> **Example:** A fintech company uses Spot Instances to run nightly risk calculation batch jobs, saving 70% on compute costs.

---

### 4. EC2 Instance Types — Explained in Detail

AWS offers **400+ instance types** grouped into **families**. Each family is optimized for specific workloads. Think of it like choosing a vehicle — you pick the one that fits your need (sedan for commuting, truck for hauling, sports car for speed).

#### 🔤 Instance Type Naming Convention

```
  m  5  .  xlarge
  │  │     │
  │  │     └── Size (nano, micro, small, medium, large, xlarge, 2xlarge, ...)
  │  └──────── Generation (higher = newer & better)
  └─────────── Family (m = general purpose, c = compute, r = memory, ...)
```

**Example:** `t3.medium`
- `t` = Burstable family
- `3` = 3rd generation
- `medium` = medium size (2 vCPUs, 4 GiB RAM)

---

#### 🟢 General Purpose (t2, t3, m5, m6i)

**Best for:** Balanced workloads that need a mix of CPU, memory, and networking.

**Real-world analogy:** A **sedan car** — good for everyday driving. Not the fastest, not the most spacious, but perfect for most situations.

| Instance | vCPUs | Memory (GiB) | Network (Gbps) | Use Case |
|---|---|---|---|---|
| t2.micro | 1 | 1 | Low to Moderate | Free Tier, dev/test |
| t2.small | 1 | 2 | Low to Moderate | Small websites |
| t2.medium | 2 | 4 | Low to Moderate | Light production apps |
| t3.micro | 2 | 1 | Up to 5 | Free Tier (newer) |
| t3.small | 2 | 2 | Up to 5 | Small web apps |
| t3.medium | 2 | 4 | Up to 5 | Medium workloads |
| t3.large | 2 | 8 | Up to 5 | Medium web apps |
| m5.large | 2 | 8 | Up to 10 | Production web servers |
| m5.xlarge | 4 | 16 | Up to 10 | Mid-tier databases |
| m5.2xlarge | 8 | 32 | Up to 10 | Application servers |
| m6i.large | 2 | 8 | Up to 12.5 | Latest gen, better perf |
| m6i.xlarge | 4 | 16 | Up to 12.5 | Latest gen workloads |

> 💡 **T-series (t2, t3) are "burstable"** — they earn CPU credits when idle and spend them when busy. Great for workloads that don't need constant high CPU.

> ⚠️ **When to use:** Web servers, small/medium databases, development environments, code repositories.

---

#### 🔵 Compute Optimized (c5, c6i, c6g)

**Best for:** CPU-intensive workloads that need raw processing power.

**Real-world analogy:** A **sports car** — built for speed and performance.

| Instance | vCPUs | Memory (GiB) | Network (Gbps) | Use Case |
|---|---|---|---|---|
| c5.large | 2 | 4 | Up to 10 | Batch processing |
| c5.xlarge | 4 | 8 | Up to 10 | Scientific modeling |
| c5.2xlarge | 8 | 16 | Up to 10 | Video encoding |
| c5.4xlarge | 16 | 32 | Up to 10 | Gaming servers |
| c5.9xlarge | 36 | 72 | 10 | HPC workloads |
| c5.18xlarge | 72 | 144 | 25 | Large-scale compute |
| c6i.large | 2 | 4 | Up to 12.5 | Latest gen compute |
| c6i.xlarge | 4 | 8 | Up to 12.5 | Better price-perf |
| c6g.large | 2 | 4 | Up to 10 | ARM-based (Graviton2) |
| c6g.xlarge | 4 | 8 | Up to 10 | Cost-efficient compute |

> ⚠️ **When to use:** Batch processing, media transcoding, scientific modeling, gaming servers, machine learning inference, ad serving.

---

#### 🟣 Memory Optimized (r5, r6i, x1, x2idn)

**Best for:** Workloads that need to process large datasets in memory (RAM).

**Real-world analogy:** A **cargo van with a massive trunk** — built to carry large loads in memory.

| Instance | vCPUs | Memory (GiB) | Network (Gbps) | Use Case |
|---|---|---|---|---|
| r5.large | 2 | 16 | Up to 10 | In-memory caching |
| r5.xlarge | 4 | 32 | Up to 10 | Redis/Memcached |
| r5.2xlarge | 8 | 64 | Up to 10 | Real-time analytics |
| r5.4xlarge | 16 | 128 | Up to 10 | In-memory databases |
| r5.12xlarge | 48 | 384 | 10 | SAP HANA (small) |
| r6i.large | 2 | 16 | Up to 12.5 | Latest gen memory |
| x1.16xlarge | 64 | 976 | 10 | SAP HANA (large) |
| x1.32xlarge | 128 | 1,952 | 25 | Massive in-memory DBs |
| x2idn.large | 4 | 32 | Up to 25 | Latest gen extreme mem |
| x2idn.32xlarge | 128 | 2,048 | 50 | Largest memory available |

> ⚠️ **When to use:** In-memory databases (Redis, Memcached, SAP HANA), real-time big data analytics, high-performance databases.

---

#### 🟠 Storage Optimized (i3, i3en, d2, d3)

**Best for:** Workloads requiring high sequential read/write access to very large datasets on local storage.

**Real-world analogy:** A **warehouse with massive shelves** — built to store and access huge amounts of data quickly.

| Instance | vCPUs | Memory (GiB) | Storage | Network (Gbps) | Use Case |
|---|---|---|---|---|---|
| i3.large | 2 | 15.25 | 1 x 475 GB NVMe SSD | Up to 10 | NoSQL databases |
| i3.xlarge | 4 | 30.5 | 1 x 950 GB NVMe SSD | Up to 10 | Elasticsearch |
| i3.2xlarge | 8 | 61 | 1 x 1.9 TB NVMe SSD | Up to 10 | Data warehousing |
| i3.4xlarge | 16 | 122 | 2 x 1.9 TB NVMe SSD | Up to 10 | Cassandra clusters |
| i3en.large | 2 | 16 | 1 x 1.25 TB NVMe SSD | Up to 25 | Dense storage |
| i3en.xlarge | 4 | 32 | 1 x 2.5 TB NVMe SSD | Up to 25 | Distributed file systems |
| d2.xlarge | 4 | 30.5 | 3 x 2 TB HDD | Moderate | MapReduce, HDFS |
| d2.2xlarge | 8 | 61 | 6 x 2 TB HDD | Moderate | Data lake storage |
| d3.xlarge | 4 | 32 | 3 x 1.98 TB HDD | Up to 15 | Latest gen dense HDD |
| d3.2xlarge | 8 | 64 | 6 x 1.98 TB HDD | Up to 15 | Distributed file systems |

> ⚠️ **When to use:** NoSQL databases (Cassandra, MongoDB), data warehousing, distributed file systems (HDFS), log processing.

---

#### 🔴 Accelerated Computing (p3, p4, g4dn, g5, inf1)

**Best for:** GPU-intensive workloads — machine learning training, graphics rendering, video processing.

**Real-world analogy:** A **Formula 1 race car** — specialized, extremely powerful, and expensive. Only use when you need maximum performance.

| Instance | vCPUs | Memory (GiB) | GPUs | GPU Memory | Use Case |
|---|---|---|---|---|---|
| p3.2xlarge | 8 | 61 | 1 x V100 | 16 GB | ML training (small) |
| p3.8xlarge | 32 | 244 | 4 x V100 | 64 GB | ML training (medium) |
| p3.16xlarge | 64 | 488 | 8 x V100 | 128 GB | ML training (large) |
| p4d.24xlarge | 96 | 1,152 | 8 x A100 | 320 GB | Large-scale ML training |
| g4dn.xlarge | 4 | 16 | 1 x T4 | 16 GB | ML inference |
| g4dn.2xlarge | 8 | 32 | 1 x T4 | 16 GB | Graphics rendering |
| g5.xlarge | 4 | 16 | 1 x A10G | 24 GB | Graphics & ML |
| g5.2xlarge | 8 | 32 | 1 x A10G | 24 GB | Video transcoding |
| inf1.xlarge | 4 | 8 | 1 x Inferentia | N/A | ML inference (low cost) |
| inf1.6xlarge | 24 | 48 | 4 x Inferentia | N/A | High-throughput inference |

> ⚠️ **When to use:** Deep learning training, machine learning inference, 3D rendering, video encoding, computational fluid dynamics, financial modeling.

---

#### 📊 Instance Family Comparison Table

| Family | Optimized For | CPU:Memory Ratio | Best Use Case | Example |
|---|---|---|---|---|
| **General Purpose (M, T)** | Balance | 1:4 | Web servers, small DBs | m5.large |
| **Compute Optimized (C)** | CPU | 1:2 | Batch processing, HPC | c5.xlarge |
| **Memory Optimized (R, X)** | RAM | 1:8 or higher | In-memory DBs, caching | r5.2xlarge |
| **Storage Optimized (I, D)** | Disk I/O | High IOPS/throughput | NoSQL, data warehouses | i3.xlarge |
| **Accelerated (P, G, Inf)** | GPU/Custom HW | GPU-powered | ML training, rendering | p3.2xlarge |

> 🎯 **Quick Tip:** If you're unsure, start with a **General Purpose (t3 or m5)** instance. You can always change the instance type later!

---

### 5. EC2 Pricing Models — Detailed Explanation

One of the biggest advantages of EC2 is its **flexible pricing**. AWS offers multiple pricing models so you can optimize costs based on your workload.

#### 💵 5.1 On-Demand Instances

**What:** Pay by the hour or second (minimum 60 seconds) with no upfront commitment.

**Real-world analogy:** Like taking a **taxi** — you pay for the ride, no commitments, but it's the most expensive option per mile.

| Feature | Detail |
|---|---|
| **Billing** | Per second (Linux), Per hour (Windows) |
| **Commitment** | None |
| **Upfront Cost** | $0 |
| **Discount** | None (full price) |
| **Best For** | Short-term, unpredictable workloads |
| **Flexibility** | Launch/terminate anytime |

**When to use On-Demand:**
- Applications with unpredictable traffic
- First-time workloads where you're testing
- Short-term projects (days/weeks)
- Applications that can't be interrupted

**Example pricing (us-east-1):**
```
t3.micro  → ~$0.0104/hour → ~$7.49/month
t3.medium → ~$0.0416/hour → ~$29.95/month
m5.large  → ~$0.096/hour  → ~$69.12/month
c5.xlarge → ~$0.17/hour   → ~$122.40/month
```

---

#### 💰 5.2 Reserved Instances (RI)

**What:** Commit to using a specific instance type for **1 or 3 years** in exchange for a significant discount (up to 72% off On-Demand).

**Real-world analogy:** Like signing a **1-year apartment lease** — you commit to staying, but you get a much lower monthly rent.

##### Types of Reserved Instances:

| Type | Flexibility | Discount | Details |
|---|---|---|---|
| **Standard RI** | Low (can't change instance family) | Up to 72% | Best discount, least flexible |
| **Convertible RI** | Medium (can change instance family) | Up to 54% | Can convert to different instance type |
| **Scheduled RI** | Time-based (specific hours) | Varies | For predictable recurring schedules |

##### Payment Options:

| Payment Option | Upfront Cost | Discount Level |
|---|---|---|
| **All Upfront** | Pay 100% now | Highest discount |
| **Partial Upfront** | Pay ~50% now | Medium discount |
| **No Upfront** | Pay nothing now | Lowest discount (still saves vs On-Demand) |

**When to use Reserved Instances:**
- Steady-state applications (production databases, web servers)
- Applications you know you'll run for 1-3 years
- Predictable workloads with consistent resource needs

**Example savings:**
```
m5.large On-Demand:    $69.12/month
m5.large 1-yr RI:      $43.80/month  (37% savings)
m5.large 3-yr RI:      $27.38/month  (60% savings)
```

---

#### 🏷️ 5.3 Spot Instances

**What:** Bid on unused EC2 capacity at up to **90% discount**. AWS can reclaim (interrupt) your instance with a **2-minute warning** when it needs the capacity back.

**Real-world analogy:** Like flying **standby** on an airline — you get a massive discount, but you might get bumped if the flight fills up.

| Feature | Detail |
|---|---|
| **Discount** | Up to 90% off On-Demand |
| **Interruption** | AWS can terminate with 2-min notice |
| **Best For** | Fault-tolerant, flexible workloads |
| **Worst For** | Critical databases, stateful apps |

**When to use Spot Instances:**
- Batch processing jobs
- Data analysis and big data workloads
- CI/CD build runners
- Machine learning training (with checkpointing)
- Stateless web servers (behind a load balancer)
- Image/video rendering

**Example savings:**
```
c5.xlarge On-Demand:  $0.17/hour
c5.xlarge Spot:       $0.051/hour  (70% savings!)
```

> ⚠️ **Important:** Always design Spot workloads to handle interruptions gracefully. Save your work frequently!

---

#### 📋 5.4 Savings Plans

**What:** Commit to a consistent amount of compute usage (measured in $/hour) for 1 or 3 years. More flexible than Reserved Instances.

**Real-world analogy:** Like a **gym membership** — you commit to spending $X/month, and you can use any equipment (instance type).

| Type | Flexibility | Discount |
|---|---|---|
| **Compute Savings Plan** | Any instance family, size, OS, region, tenancy | Up to 66% |
| **EC2 Instance Savings Plan** | Specific instance family in a region | Up to 72% |

**When to use Savings Plans:**
- When you want RI-level discounts but more flexibility
- When your instance types might change over time
- When you use multiple instance families

---

#### 🏢 5.5 Dedicated Hosts

**What:** A physical server fully dedicated to your use. No other AWS customer shares the hardware.

**Real-world analogy:** Like renting an **entire house** instead of an apartment — you have the whole building to yourself.

| Feature | Detail |
|---|---|
| **Isolation** | Full physical server dedicated to you |
| **Compliance** | Meets regulatory requirements (HIPAA, etc.) |
| **Licensing** | Use existing server-bound software licenses (BYOL) |
| **Cost** | Most expensive option |
| **Best For** | Compliance, licensing, regulatory needs |

**When to use Dedicated Hosts:**
- Regulatory compliance requirements (healthcare, finance, government)
- Software licenses tied to physical cores/sockets (Oracle, SQL Server)
- Workloads that require physical isolation

---

#### 📊 Pricing Model Comparison Table

| Model | Discount | Commitment | Interruption | Best For |
|---|---|---|---|---|
| **On-Demand** | 0% | None | No | Unpredictable workloads |
| **Reserved (1yr)** | Up to 40% | 1 year | No | Steady-state production |
| **Reserved (3yr)** | Up to 72% | 3 years | No | Long-term production |
| **Spot** | Up to 90% | None | Yes (2-min warning) | Fault-tolerant batch jobs |
| **Savings Plan** | Up to 72% | 1-3 years | No | Flexible commitments |
| **Dedicated Host** | Varies | On-Demand or Reserved | No | Compliance, BYOL licensing |

---

### 6. EC2 Instance Lifecycle

Every EC2 instance goes through a defined lifecycle. Understanding these states is crucial for managing instances effectively.

#### 📊 Instance States

```
                    ┌─────────────────────────────────────────────┐
                    │           EC2 Instance Lifecycle            │
                    └─────────────────────────────────────────────┘

  ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌────────────┐
  │          │      │          │ Stop │          │      │            │
  │ PENDING  │─────▶│ RUNNING  │─────▶│ STOPPING │─────▶│  STOPPED   │
  │          │      │          │      │          │      │            │
  └──────────┘      └────┬─────┘      └──────────┘      └─────┬──────┘
       │                 │                                     │
       │                 │ Terminate                Start      │
       │                 ▼                                     │
       │           ┌──────────────┐                            │
       │           │              │                            │
       │           │ SHUTTING-DOWN │◀───────────────────────────┘
       │           │              │          Terminate
       │           └──────┬───────┘
       │                  │
       │                  ▼
       │           ┌──────────────┐
       │           │              │
       └──────────▶│  TERMINATED  │
                   │              │
                   └──────────────┘
```

#### State Descriptions:

| State | Description | Billing? |
|---|---|---|
| **Pending** | Instance is being launched. AWS is allocating resources. | ❌ No |
| **Running** | Instance is up and ready. You can connect to it. | ✅ Yes |
| **Stopping** | Instance is being stopped (only EBS-backed instances). | ❌ No |
| **Stopped** | Instance is shut down. EBS data is preserved. | ❌ No (but EBS charges apply) |
| **Shutting-down** | Instance is being terminated. | ❌ No |
| **Terminated** | Instance is deleted. Cannot be restarted. | ❌ No |

> 💡 **Key Points:**
> - You are **only billed** when the instance is in the **Running** state (for compute).
> - **Stopped** instances still incur **EBS storage charges** (your disk is still there).
> - **Terminated** instances are **gone forever** — all instance store data is lost.
> - You can **stop and start** EBS-backed instances. You **cannot** stop instance store-backed instances.

#### Stop vs Terminate:

| Action | What Happens | Data? | Can Restart? |
|---|---|---|---|
| **Stop** | Instance shuts down, EBS volumes preserved | ✅ EBS data saved | ✅ Yes |
| **Terminate** | Instance is deleted, instance store data lost | ❌ Instance store lost | ❌ No |
| **Reboot** | Instance restarts (like restarting your laptop) | ✅ All data preserved | N/A (auto-restarts) |

---

### 7. Amazon Machine Images (AMI)

#### What is an AMI?

An **Amazon Machine Image (AMI)** is a **template** that contains the software configuration (OS, application server, applications) required to launch an EC2 instance.

**Real-world analogy:** An AMI is like a **phone backup/snapshot**. When you set up a new phone, you can restore from a backup and get all your apps, settings, and data back instantly. An AMI works the same way for servers.

#### What's Inside an AMI?

```
┌────────────────────────────────────┐
│            AMI Contains            │
├────────────────────────────────────┤
│  📀 Operating System               │
│     (Amazon Linux, Ubuntu, etc.)   │
│                                    │
│  📦 Pre-installed Software         │
│     (Apache, Node.js, Docker, etc.)│
│                                    │
│  ⚙️  Configuration & Settings      │
│     (Firewall rules, env vars)     │
│                                    │
│  💾 Block Device Mapping           │
│     (EBS volumes, instance store)  │
│                                    │
│  🔐 Launch Permissions             │
│     (Who can use this AMI)         │
└────────────────────────────────────┘
```

#### Types of AMIs:

| Type | Description | Cost | Example |
|---|---|---|---|
| **AWS-Provided** | Official AMIs from AWS | Free (OS cost only) | Amazon Linux 2, Ubuntu |
| **Marketplace AMI** | Pre-configured by third parties | May have license fee | WordPress, Jenkins |
| **Community AMI** | Shared by other AWS users | Free | Various configurations |
| **Custom AMI** | Created by you from your instance | Free to create | Your configured server |

#### Creating a Custom AMI:

```
Step 1: Launch an EC2 instance
Step 2: Install and configure all your software
Step 3: Create an AMI from the running instance
Step 4: Use that AMI to launch identical instances

    ┌──────────┐     Configure     ┌──────────┐     Create AMI     ┌──────────┐
    │ Launch   │ ──────────────▶  │ Working  │ ──────────────▶   │  Custom  │
    │ Instance │     (install     │ Instance │     (snapshot)    │   AMI    │
    └──────────┘   software,etc)  └──────────┘                   └────┬─────┘
                                                                      │
                                         Launch identical instances    │
                                  ┌──────────┐  ┌──────────┐         │
                                  │ Clone 1  │◀─┤ Clone 2  │◀────────┘
                                  └──────────┘  └──────────┘
```

> 💡 **Why Create Custom AMIs?**
> - Faster instance launches (software is pre-installed)
> - Consistency across all instances (identical setup)
> - Quick disaster recovery (launch a replacement from AMI)
> - Share configurations across teams

---

### 8. EC2 Key Pairs

#### What are Key Pairs?

A **Key Pair** is a set of **cryptographic keys** (public key + private key) used to securely connect to your EC2 instance via SSH (Linux) or RDP (Windows).

**Real-world analogy:** A key pair is like a **lock and key** for your house:
- **Public Key** = The lock (installed on the EC2 instance)
- **Private Key** = The key (kept by you, never shared)

#### How Key Pairs Work:

```
    YOU (Local Machine)                     EC2 Instance
    ┌────────────────────┐                 ┌────────────────────┐
    │                    │                 │                    │
    │  🔑 Private Key    │ ◄── matches ──▶│  🔒 Public Key     │
    │  (my-key.pem)      │                 │  (authorized_keys) │
    │                    │                 │                    │
    │  SSH Connect ──────│────────────────▶│  Verifies match    │
    │                    │                 │  ✅ Access Granted  │
    └────────────────────┘                 └────────────────────┘
```

#### .pem vs .ppk Files:

| Format | Used By | OS | How to Convert |
|---|---|---|---|
| **.pem** | SSH (OpenSSH), Terminal | Linux, macOS | Native format from AWS |
| **.ppk** | PuTTY | Windows | Convert .pem → .ppk using PuTTYgen |

#### Connecting to EC2 via SSH:

```bash
# Linux/macOS — Using .pem file
chmod 400 my-key.pem                              # Set correct permissions
ssh -i "my-key.pem" ec2-user@<public-ip>           # Connect to Amazon Linux
ssh -i "my-key.pem" ubuntu@<public-ip>             # Connect to Ubuntu

# Windows — Using PuTTY with .ppk file
# 1. Open PuTTY
# 2. Enter the public IP in "Host Name"
# 3. Go to Connection → SSH → Auth → Credentials
# 4. Browse and select your .ppk file
# 5. Click "Open" to connect
```

> ⚠️ **Critical Rules:**
> - **Never share your private key** — anyone with it can access your instance
> - **AWS doesn't store your private key** — if you lose it, you can't recover it
> - **Set permissions to 400** — SSH will refuse to connect if the key file is too open
> - **One key pair can be used for multiple instances**

---

### 9. Security Groups — The Virtual Firewall

#### What is a Security Group?

A **Security Group** acts as a **virtual firewall** that controls inbound (incoming) and outbound (outgoing) traffic to your EC2 instance.

**Real-world analogy:** A Security Group is like a **bouncer at a nightclub**:
- The bouncer checks everyone trying to enter (inbound rules)
- The bouncer also checks everyone trying to leave (outbound rules)
- If you're not on the list, you don't get in!

#### Key Characteristics:

| Feature | Description |
|---|---|
| **Default Behavior** | All inbound traffic is **DENIED** by default |
| **Default Outbound** | All outbound traffic is **ALLOWED** by default |
| **Stateful** | If you allow inbound traffic, the response is automatically allowed out |
| **Rules are ALLOW only** | You can only create ALLOW rules (no DENY rules) |
| **Multiple SGs** | You can attach multiple Security Groups to one instance |
| **VPC Scoped** | Security Groups belong to a specific VPC |

#### Inbound Rules Example:

| Type | Protocol | Port Range | Source | Description |
|---|---|---|---|---|
| SSH | TCP | 22 | 203.0.113.0/32 | Allow SSH from my IP |
| HTTP | TCP | 80 | 0.0.0.0/0 | Allow web traffic from anywhere |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Allow secure web traffic |
| MySQL | TCP | 3306 | sg-0abc1234 | Allow DB access from app SG |
| Custom TCP | TCP | 8080 | 10.0.0.0/16 | Allow from VPC only |

#### Outbound Rules Example:

| Type | Protocol | Port Range | Destination | Description |
|---|---|---|---|---|
| All Traffic | All | All | 0.0.0.0/0 | Allow all outbound (default) |

#### Security Group Best Practices:

```
✅ DO:
  • Use specific IP ranges (CIDR blocks) instead of 0.0.0.0/0
  • Create separate Security Groups for different tiers (web, app, db)
  • Reference other Security Groups in rules (SG-to-SG)
  • Use descriptive names (e.g., "web-server-sg", "database-sg")
  • Regularly audit your Security Group rules

❌ DON'T:
  • Open port 22 (SSH) to 0.0.0.0/0 (the entire internet!)
  • Use a single Security Group for all instances
  • Leave unused rules in place
  • Open port 3306 (MySQL) to the internet
  • Forget to remove temporary rules after testing
```

#### Example Architecture with Security Groups:

```
Internet
    │
    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Web SG      │     │  App SG      │     │  DB SG       │
│ Inbound:     │     │ Inbound:     │     │ Inbound:     │
│  80, 443     │────▶│  8080        │────▶│  3306        │
│  from: any   │     │  from: Web SG│     │  from: App SG│
│              │     │              │     │              │
│ [Web Server] │     │ [App Server] │     │ [Database]   │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

### 10. Elastic IP Addresses

#### What is an Elastic IP?

An **Elastic IP (EIP)** is a **static, public IPv4 address** that you can allocate to your AWS account and associate with any EC2 instance.

**Real-world analogy:** An Elastic IP is like a **permanent phone number**. Even if you switch phones (instances), your number stays the same.

#### Why Do We Need Elastic IPs?

By default, when you stop and start an EC2 instance, it gets a **new public IP address**. This is a problem if:
- You've configured DNS to point to that IP
- Other services depend on that IP address
- You need a consistent endpoint

#### Elastic IP Facts:

| Feature | Detail |
|---|---|
| **Cost (in use)** | ✅ **Free** when associated with a running instance |
| **Cost (NOT in use)** | ❌ **$0.005/hour** (~$3.60/month) when NOT associated |
| **Limit** | 5 Elastic IPs per region (can request increase) |
| **Portability** | Can move between instances in the same region |
| **Remapping** | Can quickly remap to another instance for failover |

#### Elastic IP Workflow:

```
Step 1: Allocate    →  AWS assigns you a static IP from their pool
Step 2: Associate   →  Attach the IP to your EC2 instance
Step 3: Use         →  Your instance is now reachable at that IP
Step 4: Disassociate → Detach the IP when no longer needed
Step 5: Release     →  Return the IP to AWS's pool (stop charges)
```

> ⚠️ **Important:** AWS charges you for Elastic IPs that are **NOT associated** with a running instance. Always release EIPs you're not using!

> 💡 **Best Practice:** Instead of using Elastic IPs, consider using a **Load Balancer** or **Route 53 DNS** for high-availability setups.

---

### 11. EC2 Instance Store vs EBS

EC2 instances can use two types of storage: **Instance Store** and **EBS (Elastic Block Store)**.

#### 📊 Comparison Table:

| Feature | Instance Store | EBS (Elastic Block Store) |
|---|---|---|
| **Persistence** | ❌ Ephemeral (data lost on stop/terminate) | ✅ Persistent (data survives stop/restart) |
| **Durability** | ❌ Not durable (tied to physical host) | ✅ Highly durable (replicated within AZ) |
| **Speed** | ⚡ Very fast (physically attached SSDs/HDDs) | 🏃 Fast (network-attached) |
| **Cost** | ✅ Free (included with instance) | 💵 Pay per GB/month + IOPS |
| **Backup** | ❌ No snapshots | ✅ EBS Snapshots to S3 |
| **Resize** | ❌ Fixed size | ✅ Can increase size |
| **Detach/Reattach** | ❌ Cannot detach | ✅ Can detach and attach to another instance |
| **Encryption** | ❌ Not natively | ✅ AES-256 encryption |
| **Use Case** | Temporary data, caches, buffers | Databases, OS volumes, persistent data |

**Real-world analogy:**
- **Instance Store** = The **built-in RAM** on your laptop — super fast, but loses data when you turn off
- **EBS** = An **external hard drive** — slightly slower, but your data is safe even when the computer is off

> 🎯 **Rule of Thumb:** Use EBS for anything you can't afford to lose. Use Instance Store for temporary/cached data where speed matters most.

---

### 12. EBS Volume Types — Detailed Comparison

EBS offers **6 volume types** optimized for different workloads:

#### 📊 EBS Volume Types Comparison Table:

| Feature | gp2 | gp3 | io1 | io2 | st1 | sc1 |
|---|---|---|---|---|---|---|
| **Type** | General Purpose SSD | General Purpose SSD | Provisioned IOPS SSD | Provisioned IOPS SSD | Throughput Optimized HDD | Cold HDD |
| **Volume Size** | 1 GiB - 16 TiB | 1 GiB - 16 TiB | 4 GiB - 16 TiB | 4 GiB - 16 TiB | 125 GiB - 16 TiB | 125 GiB - 16 TiB |
| **Max IOPS** | 16,000 | 16,000 | 64,000 | 64,000 | 500 | 250 |
| **Max Throughput** | 250 MiB/s | 1,000 MiB/s | 1,000 MiB/s | 1,000 MiB/s | 500 MiB/s | 250 MiB/s |
| **Baseline IOPS** | 3 IOPS/GiB (burst to 3,000) | 3,000 (independent of size) | Provisioned | Provisioned | N/A | N/A |
| **Latency** | Single-digit ms | Single-digit ms | Single-digit ms | Sub-millisecond | N/A | N/A |
| **Durability** | 99.8-99.9% | 99.8-99.9% | 99.8-99.9% | 99.999% | 99.8-99.9% | 99.8-99.9% |
| **Boot Volume?** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Multi-Attach?** | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Price** | $0.10/GiB/month | $0.08/GiB/month | $0.125/GiB/month + IOPS | $0.125/GiB/month + IOPS | $0.045/GiB/month | $0.015/GiB/month |
| **Best For** | Default, boot volumes, dev/test | Most workloads (cost-effective) | Critical databases (Oracle, SAP) | Critical databases (high durability) | Big data, data warehouses, log processing | Infrequent access, archives |

#### When to Use Each Volume Type:

```
gp2  → Legacy default. Use gp3 instead for new workloads.
gp3  → ⭐ BEST DEFAULT CHOICE. 20% cheaper than gp2, better baseline performance.
io1  → Critical databases needing guaranteed high IOPS.
io2  → Same as io1 but with 99.999% durability (use for mission-critical DBs).
st1  → Big data, streaming, log processing (high throughput, sequential reads).
sc1  → Cheapest. Infrequent access (cold data, archives, backups).
```

> 💡 **Pro Tip:** Always choose **gp3** over **gp2** for new workloads. gp3 gives you 3,000 baseline IOPS regardless of volume size, and it's 20% cheaper!

---

### 13. EC2 Placement Groups

**Placement Groups** let you control how your EC2 instances are physically placed on the underlying hardware. This is important for performance, fault tolerance, and compliance.

#### Three Types of Placement Groups:

##### 🔵 1. Cluster Placement Group

**What:** All instances are placed **close together** in the **same rack** within a single Availability Zone.

**Analogy:** Like sitting **next to each other at a table** — communication is instant.

```
┌─────────────────────────────────────┐
│         Same Rack / Same AZ         │
│                                     │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐   │
│  │ i1 │  │ i2 │  │ i3 │  │ i4 │   │
│  └────┘  └────┘  └────┘  └────┘   │
│        ◄── Low Latency ──▶        │
│        ◄── High Throughput ──▶     │
└─────────────────────────────────────┘
```

| Pros | Cons |
|---|---|
| ✅ Lowest latency (10 Gbps between instances) | ❌ If rack fails, ALL instances fail |
| ✅ Highest throughput | ❌ Single AZ only |
| ✅ Best for HPC | ❌ Limited instance types |

**Use Case:** HPC, big data analytics, low-latency applications

---

##### 🟢 2. Spread Placement Group

**What:** Each instance is placed on a **different physical rack** with independent power and network. Max 7 instances per AZ.

**Analogy:** Like putting **each egg in a different basket** — if one basket drops, the others are safe.

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Rack 1  │  │  Rack 2  │  │  Rack 3  │
│          │  │          │  │          │
│  ┌────┐  │  │  ┌────┐  │  │  ┌────┐  │
│  │ i1 │  │  │  │ i2 │  │  │  │ i3 │  │
│  └────┘  │  │  └────┘  │  │  └────┘  │
│          │  │          │  │          │
└──────────┘  └──────────┘  └──────────┘
    AZ-1           AZ-2          AZ-3
```

| Pros | Cons |
|---|---|
| ✅ High availability | ❌ Max 7 instances per AZ |
| ✅ Reduced risk of simultaneous failure | ❌ Not suitable for large clusters |
| ✅ Spans multiple AZs | |

**Use Case:** Critical applications, databases, instances that must be isolated from each other

---

##### 🟠 3. Partition Placement Group

**What:** Instances are divided into **partitions** (groups), and each partition is on a separate rack. Good for large distributed workloads.

**Analogy:** Like dividing students into **different classrooms** in different buildings — each classroom is isolated.

```
┌─────────────────────────────────────────────────┐
│              Partition Placement Group           │
│                                                  │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐   │
│  │Partition 1│  │Partition 2│  │Partition 3│   │
│  │ (Rack A)  │  │ (Rack B)  │  │ (Rack C)  │   │
│  │ ┌──┐ ┌──┐│  │ ┌──┐ ┌──┐│  │ ┌──┐ ┌──┐│   │
│  │ │i1│ │i2││  │ │i3│ │i4││  │ │i5│ │i6││   │
│  │ └──┘ └──┘│  │ └──┘ └──┘│  │ └──┘ └──┘│   │
│  └───────────┘  └───────────┘  └───────────┘   │
└─────────────────────────────────────────────────┘
```

| Pros | Cons |
|---|---|
| ✅ Up to 7 partitions per AZ | ❌ Not for every use case |
| ✅ Hundreds of instances | ❌ More complex to manage |
| ✅ Partition-aware (Hadoop, Cassandra, Kafka) | |

**Use Case:** HDFS, HBase, Cassandra, Kafka — large distributed databases that are partition-aware

---

#### Placement Group Comparison:

| Feature | Cluster | Spread | Partition |
|---|---|---|---|
| **Strategy** | Pack close together | Spread apart | Divide into groups |
| **Latency** | ⚡ Lowest | Medium | Medium |
| **Fault Tolerance** | ❌ Low | ✅ Highest | ✅ High |
| **Max Instances** | No hard limit | 7 per AZ | 100s per partition |
| **AZ Scope** | Single AZ | Multiple AZs | Multiple AZs |
| **Best For** | HPC, low latency | Critical apps | Big distributed DBs |

---

### 14. User Data — Bootstrap Scripts

#### What is User Data?

**User Data** is a script that runs **automatically when an EC2 instance launches for the first time**. It's used to automate setup tasks.

**Real-world analogy:** User Data is like leaving **setup instructions** for a new employee on their first day — "install this software, configure that setting, start this service."

#### How User Data Works:

```
   Launch Instance
        │
        ▼
   Instance enters "Pending" state
        │
        ▼
   AWS runs User Data script (as root)
        │
        ▼
   Instance enters "Running" state
        │
        ▼
   Your instance is ready with everything installed! ✅
```

#### User Data Examples:

##### Example 1: Install and Start a Web Server (Amazon Linux 2)

```bash
#!/bin/bash
# Update the system
yum update -y

# Install Apache web server
yum install -y httpd

# Start Apache and enable it to start on boot
systemctl start httpd
systemctl enable httpd

# Create a simple welcome page
echo "<h1>Hello from EC2! Instance ID: $(curl -s http://169.254.169.254/latest/meta-data/instance-id)</h1>" > /var/www/html/index.html
```

##### Example 2: Install Docker and Run a Container

```bash
#!/bin/bash
# Update system
yum update -y

# Install Docker
amazon-linux-extras install docker -y

# Start Docker service
systemctl start docker
systemctl enable docker

# Add ec2-user to docker group
usermod -aG docker ec2-user

# Pull and run Nginx container
docker run -d -p 80:80 nginx
```

##### Example 3: Install Node.js Application

```bash
#!/bin/bash
# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Create application directory
mkdir -p /home/ec2-user/app
cd /home/ec2-user/app

# Create a simple Express app
cat > server.js << 'EOF'
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello from EC2 Node.js App!'));
app.listen(3000, () => console.log('Server running on port 3000'));
EOF

# Install dependencies and start
npm init -y
npm install express
node server.js &
```

##### Example 4: Install and Configure MySQL

```bash
#!/bin/bash
# Install MySQL
yum install -y mysql-server

# Start MySQL service
systemctl start mysqld
systemctl enable mysqld

# Secure MySQL installation
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';"
mysql -e "DELETE FROM mysql.user WHERE User='';"
mysql -e "FLUSH PRIVILEGES;"

echo "MySQL installed and configured successfully!"
```

> 💡 **Key Points about User Data:**
> - Runs **only on the first boot** (by default)
> - Runs as **root** user
> - Maximum size: **16 KB**
> - Can be **base64 encoded**
> - Logs are saved to `/var/log/cloud-init-output.log`
> - You can view user data from the instance metadata endpoint

---

### 15. Instance Metadata

#### What is Instance Metadata?

**Instance Metadata** is information about your EC2 instance that you can access **from within the instance itself**. It includes details like instance ID, public IP, AMI ID, security groups, and more.

**Real-world analogy:** Instance Metadata is like a **name badge** — your instance can "look at its own badge" to find out who it is, what its address is, and what team it belongs to.

#### How to Access Instance Metadata:

Instance metadata is available at a special link-local IP address:

```bash
# IMDSv1 (older, less secure)
curl http://169.254.169.254/latest/meta-data/

# IMDSv2 (recommended, more secure — uses token-based authentication)
# Step 1: Get a token
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")

# Step 2: Use the token to query metadata
curl -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/
```

#### Common Metadata Endpoints:

| Endpoint | Returns | Example Output |
|---|---|---|
| `/latest/meta-data/instance-id` | Instance ID | `i-0abc123def456789` |
| `/latest/meta-data/instance-type` | Instance type | `t3.medium` |
| `/latest/meta-data/ami-id` | AMI ID | `ami-0abcdef1234567890` |
| `/latest/meta-data/public-ipv4` | Public IP | `54.123.45.67` |
| `/latest/meta-data/local-ipv4` | Private IP | `10.0.1.25` |
| `/latest/meta-data/hostname` | Hostname | `ip-10-0-1-25.ec2.internal` |
| `/latest/meta-data/security-groups` | Security Groups | `my-web-server-sg` |
| `/latest/meta-data/placement/availability-zone` | AZ | `us-east-1a` |
| `/latest/meta-data/placement/region` | Region | `us-east-1` |
| `/latest/meta-data/iam/info` | IAM Role info | JSON with role details |
| `/latest/user-data` | User Data script | Your bootstrap script |

#### IMDSv1 vs IMDSv2:

| Feature | IMDSv1 | IMDSv2 |
|---|---|---|
| **Method** | Simple GET request | Token-based (PUT then GET) |
| **Security** | ⚠️ Vulnerable to SSRF attacks | ✅ Protected against SSRF |
| **AWS Recommendation** | ❌ Deprecated (avoid) | ✅ Recommended |
| **Token Required?** | No | Yes (TTL up to 6 hours) |

> ⚠️ **Best Practice:** Always use **IMDSv2** and disable IMDSv1 to prevent Server-Side Request Forgery (SSRF) attacks.

---

### 16. Auto Scaling Basics

#### What is Auto Scaling?

**Auto Scaling** automatically adjusts the number of EC2 instances in your application based on demand. It ensures you have the right number of instances running at all times.

**Real-world analogy:** Auto Scaling is like a **restaurant that adds or removes tables based on how busy it is**:
- 🍽️ Lunch rush? → Add more tables (launch more instances)
- 🌙 Late night? → Remove extra tables (terminate instances)
- 📊 Always enough seats for customers, never too many empty tables

#### Why Do We Need Auto Scaling?

| Benefit | Description |
|---|---|
| **High Availability** | Automatically replaces unhealthy instances |
| **Cost Optimization** | Scales down when demand drops (saves money) |
| **Performance** | Scales up when demand increases (handles traffic spikes) |
| **Fault Tolerance** | Distributes instances across multiple AZs |

#### Auto Scaling Group (ASG) Components:

```
┌─────────────────────────────────────────────────────┐
│              Auto Scaling Group (ASG)                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📋 Launch Template / Launch Configuration          │
│     • AMI ID                                        │
│     • Instance Type                                 │
│     • Key Pair                                      │
│     • Security Groups                               │
│     • User Data                                     │
│                                                     │
│  📏 Scaling Configuration                           │
│     • Minimum Capacity:   2  (always running)       │
│     • Desired Capacity:   4  (target right now)     │
│     • Maximum Capacity:  10  (upper limit)          │
│                                                     │
│  🎯 Scaling Policies                                │
│     • Target Tracking                               │
│     • Step Scaling                                   │
│     • Scheduled Scaling                              │
│     • Predictive Scaling                             │
│                                                     │
│  ❤️ Health Checks                                   │
│     • EC2 Status Checks                             │
│     • ELB Health Checks                             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### Scaling Policies Explained:

| Policy Type | How It Works | Example |
|---|---|---|
| **Target Tracking** | Maintain a specific metric value | Keep average CPU at 50% |
| **Step Scaling** | Add/remove instances in steps based on alarm thresholds | CPU > 70% → add 2, CPU > 90% → add 4 |
| **Scheduled Scaling** | Scale at specific times | Scale up every Monday at 8 AM |
| **Predictive Scaling** | Uses ML to predict traffic and scale proactively | Learns from weekly patterns |

#### Auto Scaling in Action — ASCII Diagram:

```
Traffic Load:  Low ──────────▶ Medium ─────────▶ High ──────────▶ Medium ─────────▶ Low

Instances:     ██               ██ ██              ██ ██ ██ ██       ██ ██            ██
               ██               ██ ██              ██ ██ ██ ██       ██ ██            ██
               
Count:         2 (min)          4 (desired)        8 (scaling up)    4 (scaling down) 2 (min)

Cost:          $$$              $$$$$$             $$$$$$$$$$        $$$$$$            $$$

               Scale OUT ──────────────────────▶  Scale IN ────────────────────────▶
               (add instances)                     (remove instances)
```

#### Auto Scaling Example Configuration:

```
Launch Template:
  - AMI: ami-0abcdef1234567890 (Amazon Linux 2)
  - Instance Type: t3.medium
  - Key Pair: my-web-key
  - Security Group: sg-web-server
  - User Data: install-apache.sh

ASG Settings:
  - Min: 2       ← Always have at least 2 instances running
  - Desired: 4   ← Currently running 4 instances
  - Max: 10      ← Never exceed 10 instances
  - AZs: us-east-1a, us-east-1b, us-east-1c

Scaling Policy:
  - Type: Target Tracking
  - Metric: Average CPU Utilization
  - Target: 50%
  - Cooldown: 300 seconds (5 minutes between scaling actions)
```

---

### 17. Load Balancer Basics

#### What is a Load Balancer?

A **Load Balancer** distributes incoming traffic across multiple EC2 instances to ensure no single instance gets overwhelmed.

**Real-world analogy:** A Load Balancer is like a **receptionist** at a busy doctor's office — the receptionist directs patients to different doctors so no single doctor is overwhelmed.

#### Why Do We Need Load Balancers?

```
WITHOUT Load Balancer:                WITH Load Balancer:

   Users                              Users
   │ │ │ │ │ │                        │ │ │ │ │ │
   │ │ │ │ │ │                        │ │ │ │ │ │
   ▼ ▼ ▼ ▼ ▼ ▼                       ▼ ▼ ▼ ▼ ▼ ▼
┌──────────────┐                   ┌──────────────┐
│              │                   │ Load Balancer│
│  Single      │                   └──────┬───────┘
│  Instance    │                     ┌────┼────┐
│  (OVERLOADED)│                     ▼    ▼    ▼
│  😰          │               ┌────┐┌────┐┌────┐
└──────────────┘               │ i1 ││ i2 ││ i3 │
                               │ 😊 ││ 😊 ││ 😊 │
                               └────┘└────┘└────┘
```

#### Types of AWS Load Balancers:

##### 1. Application Load Balancer (ALB) — Layer 7

The **ALB** operates at the application layer (HTTP/HTTPS). It can route traffic based on URL paths, hostnames, headers, and query strings.

```
ALB Routing Example:

  www.example.com/api/*      → API Instance Group
  www.example.com/images/*   → Image Instance Group
  www.example.com/*          → Web Instance Group
  mobile.example.com/*       → Mobile Backend Group
```

##### 2. Network Load Balancer (NLB) — Layer 4

The **NLB** operates at the transport layer (TCP/UDP). It's designed for extreme performance — handles millions of requests per second with ultra-low latency.

##### 3. Classic Load Balancer (CLB) — Layer 4 & 7

The **CLB** is the original AWS load balancer. It's now considered **legacy** and is not recommended for new applications.

#### Load Balancer Comparison Table:

| Feature | ALB | NLB | CLB (Legacy) |
|---|---|---|---|
| **OSI Layer** | Layer 7 (HTTP/HTTPS) | Layer 4 (TCP/UDP/TLS) | Layer 4 & 7 |
| **Protocol** | HTTP, HTTPS, gRPC | TCP, UDP, TLS | HTTP, HTTPS, TCP, SSL |
| **Performance** | Good | ⚡ Extreme (millions of req/sec) | Basic |
| **Static IP** | ❌ No (use DNS) | ✅ Yes (1 per AZ) | ❌ No |
| **Path-based Routing** | ✅ Yes | ❌ No | ❌ No |
| **Host-based Routing** | ✅ Yes | ❌ No | ❌ No |
| **WebSocket** | ✅ Yes | ✅ Yes | ❌ No |
| **Lambda Targets** | ✅ Yes | ❌ No | ❌ No |
| **Health Checks** | HTTP/HTTPS | TCP/HTTP/HTTPS | TCP/HTTP |
| **SSL Termination** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Sticky Sessions** | ✅ Yes | ❌ No | ✅ Yes |
| **Cross-Zone LB** | ✅ Always enabled | Optional | Optional |
| **Pricing** | Per hour + LCU | Per hour + NLCU | Per hour + data |
| **Best For** | Web apps, microservices, APIs | Gaming, IoT, ultra-low latency | Legacy apps |
| **AWS Recommendation** | ✅ Recommended | ✅ Recommended | ❌ Migrate away |

#### When to Choose Which:

```
Choose ALB when:
  ✅ You need HTTP/HTTPS traffic routing
  ✅ You want path-based or host-based routing
  ✅ You're running microservices or containers
  ✅ You need Lambda function targets

Choose NLB when:
  ✅ You need ultra-low latency (< 100ms)
  ✅ You need static IPs
  ✅ You're handling millions of requests per second
  ✅ You need TCP/UDP traffic (not just HTTP)
  ✅ Gaming, IoT, or real-time applications

Choose CLB when:
  ❌ Don't choose CLB for new applications!
  ⚠️ Only if maintaining legacy systems
```

---

## 🔧 Hands-On Practice

### Lab 1: Launch Your First EC2 Instance

```
Step 1:  Log in to AWS Console → Navigate to EC2 Dashboard
Step 2:  Click "Launch Instance"
Step 3:  Name: "my-first-ec2"
Step 4:  AMI: Amazon Linux 2023 (Free Tier eligible)
Step 5:  Instance Type: t2.micro (Free Tier)
Step 6:  Key Pair: Create new → "my-key-pair" → Download .pem file
Step 7:  Security Group: Allow SSH (port 22) from "My IP"
Step 8:  Storage: 8 GB gp3 (default)
Step 9:  Click "Launch Instance"
Step 10: Wait for instance to reach "Running" state
```

### Lab 2: Connect to Your Instance via SSH

```bash
# On your local machine (Linux/macOS)
chmod 400 my-key-pair.pem
ssh -i "my-key-pair.pem" ec2-user@<your-public-ip>

# Verify you're connected
hostname
whoami        # Should show: ec2-user
curl http://169.254.169.254/latest/meta-data/instance-id
```

### Lab 3: Install a Web Server

```bash
# After connecting via SSH
sudo yum update -y
sudo yum install -y httpd
sudo systemctl start httpd
sudo systemctl enable httpd
echo "<h1>Hello from my EC2 instance!</h1>" | sudo tee /var/www/html/index.html

# Now visit http://<your-public-ip> in a browser
# (Make sure your Security Group allows port 80 inbound!)
```

### Lab 4: Create a Custom AMI

```
Step 1:  In EC2 Console, select your running instance
Step 2:  Actions → Image and templates → Create Image
Step 3:  Name: "my-webserver-ami"
Step 4:  Description: "Amazon Linux 2023 with Apache pre-installed"
Step 5:  Click "Create Image"
Step 6:  Go to AMIs section → Wait for status: "available"
Step 7:  Launch a new instance from your custom AMI — Apache is pre-installed!
```

### Lab 5: Practice with Security Groups

```
Step 1:  Go to EC2 → Security Groups → Your instance's SG
Step 2:  Add Inbound Rule: HTTP (port 80) from 0.0.0.0/0
Step 3:  Verify: Visit http://<public-ip> — should show your web page
Step 4:  Remove the rule → Refresh browser → Should timeout
Step 5:  Add the rule back → Works again
```

---

## ❌ Common Mistakes

| # | Mistake | Why It's Bad | How to Fix |
|---|---|---|---|
| 1 | Opening SSH (port 22) to `0.0.0.0/0` | Exposes your server to brute-force attacks from the entire internet | Use "My IP" or specific CIDR blocks |
| 2 | Losing the private key (.pem file) | You can't connect to your instance ever again | Store keys securely, use AWS Systems Manager instead |
| 3 | Forgetting to stop/terminate unused instances | You keep paying even when not using them | Set billing alerts, use auto-shutdown scripts |
| 4 | Using t2.micro for production | t2 has CPU credits; when they run out, performance drops dramatically | Use t3 (unlimited mode) or m5 for production |
| 5 | Not using Elastic IPs (for static-IP workloads) | Public IP changes every time you stop/start | Allocate an Elastic IP, or better — use a Load Balancer |
| 6 | Running everything as root | Security risk — compromised app = compromised server | Create application-specific users with limited permissions |
| 7 | Not backing up EBS volumes | Disk corruption or accidental deletion = data loss | Set up automated EBS snapshots |
| 8 | Using gp2 instead of gp3 for new volumes | gp2 is 20% more expensive with lower baseline performance | Always use gp3 for new workloads |
| 9 | Not enabling IMDSv2 | IMDSv1 is vulnerable to SSRF attacks (e.g., Capital One breach) | Enforce IMDSv2 with IAM policies |
| 10 | Choosing the wrong instance type | Overpaying for resources you don't need | Right-size using CloudWatch metrics and AWS Compute Optimizer |
| 11 | Putting database on instance store | Data is lost when instance stops or terminates | Always use EBS for persistent data |
| 12 | Not using Auto Scaling for production | Single instance = single point of failure | Use ASG with min 2 instances across 2+ AZs |

---

## 📝 Quick Summary

```
┌─────────────────────────────────────────────────────────────┐
│                   EC2 CHEAT SHEET                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🖥️  EC2 = Virtual servers in the cloud                     │
│                                                             │
│  📦 Instance Types:                                         │
│     T/M = General Purpose (balanced)                        │
│     C   = Compute Optimized (CPU-heavy)                     │
│     R/X = Memory Optimized (RAM-heavy)                      │
│     I/D = Storage Optimized (disk-heavy)                    │
│     P/G = Accelerated Computing (GPU)                       │
│                                                             │
│  💰 Pricing (cheapest to most expensive):                   │
│     Spot (up to 90% off) < Reserved < Savings Plan          │
│     < On-Demand < Dedicated Hosts                           │
│                                                             │
│  🔒 Security Group = Virtual firewall                       │
│     • Inbound: DENY all by default                          │
│     • Outbound: ALLOW all by default                        │
│     • Stateful: responses automatically allowed             │
│                                                             │
│  📀 AMI = Template/snapshot for launching instances          │
│  🔑 Key Pair = SSH keys for secure access                   │
│  🌐 Elastic IP = Static public IP address                   │
│                                                             │
│  💾 Storage:                                                │
│     EBS = Persistent (survives stop/restart)                │
│     Instance Store = Ephemeral (lost on stop)               │
│     gp3 > gp2 (use gp3 for new workloads!)                 │
│                                                             │
│  📊 Placement Groups:                                       │
│     Cluster = Low latency (same rack)                       │
│     Spread = High availability (different racks)            │
│     Partition = Large distributed systems                   │
│                                                             │
│  ⚖️  Auto Scaling = Automatically adjust instance count     │
│  🔀 Load Balancer = Distribute traffic                      │
│     ALB (Layer 7) | NLB (Layer 4) | CLB (Legacy)           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎤 Interview Questions (20+ with Detailed Answers)

### Q1: What is Amazon EC2?

**Answer:** Amazon EC2 (Elastic Compute Cloud) is a web service that provides resizable compute capacity in the cloud. It allows you to rent virtual servers (called instances) on-demand, pay only for what you use, and scale up or down as needed. EC2 eliminates the need to invest in hardware upfront, so you can develop and deploy applications faster.

---

### Q2: What does "Elastic" mean in EC2?

**Answer:** "Elastic" means the service can **scale automatically** based on your needs:
- **Scale UP:** Upgrade to a more powerful instance type (vertical scaling)
- **Scale DOWN:** Downgrade to a smaller instance type
- **Scale OUT:** Add more instances (horizontal scaling)
- **Scale IN:** Remove instances when demand drops

You can increase or decrease capacity within minutes, and you only pay for what you use.

---

### Q3: What are the different EC2 instance types? When would you use each?

**Answer:**
| Family | Use Case |
|---|---|
| **General Purpose (T, M)** | Web servers, small databases — balanced CPU/memory |
| **Compute Optimized (C)** | Batch processing, gaming, HPC — high CPU performance |
| **Memory Optimized (R, X)** | In-memory databases (Redis, SAP HANA) — large RAM |
| **Storage Optimized (I, D)** | NoSQL databases, data warehousing — high disk I/O |
| **Accelerated Computing (P, G)** | Machine learning, 3D rendering — GPU-powered |

Choose based on your workload's primary bottleneck: CPU, memory, storage, or GPU.

---

### Q4: Explain the EC2 pricing models. Which is the cheapest?

**Answer:** AWS offers 5 pricing models:
1. **On-Demand** — Pay per hour/second, no commitment (most flexible, most expensive)
2. **Reserved Instances** — 1-3 year commitment, up to 72% discount
3. **Spot Instances** — Bid on unused capacity, up to 90% discount (can be interrupted)
4. **Savings Plans** — Commit to $/hour usage, up to 72% discount (more flexible than RI)
5. **Dedicated Hosts** — Full physical server (for compliance/licensing)

**Cheapest:** Spot Instances (up to 90% off), but they can be interrupted. For guaranteed compute, Reserved Instances or Savings Plans are the cheapest.

---

### Q5: What is the difference between stopping and terminating an EC2 instance?

**Answer:**
| | Stop | Terminate |
|---|---|---|
| **Instance** | Shuts down, can be restarted | Permanently deleted |
| **EBS Volumes** | Preserved (root volume stays) | Root volume deleted by default (unless "Delete on Termination" is disabled) |
| **Instance Store** | Data lost | Data lost |
| **Public IP** | Released (gets new IP on restart) | Released |
| **Private IP** | Retained | Released |
| **Billing** | Stops (but EBS charges continue) | Stops completely |

---

### Q6: What is an AMI? Can you create a custom AMI?

**Answer:** An AMI (Amazon Machine Image) is a template containing the OS, application server, applications, and configuration needed to launch an EC2 instance. Yes, you can create a custom AMI by:
1. Launching an instance
2. Installing and configuring all software
3. Creating an image from that instance (Actions → Create Image)

Custom AMIs are useful for faster deployments, consistent environments, and disaster recovery.

---

### Q7: What is a Security Group? How is it different from a NACL?

**Answer:**

| Feature | Security Group | NACL (Network ACL) |
|---|---|---|
| **Level** | Instance level | Subnet level |
| **Rules** | ALLOW only | ALLOW and DENY |
| **Stateful/Stateless** | Stateful (return traffic auto-allowed) | Stateless (must explicitly allow return traffic) |
| **Default** | Deny all inbound, allow all outbound | Allow all inbound and outbound |
| **Evaluation** | All rules evaluated together | Rules evaluated in order (lowest number first) |

---

### Q8: What is an Elastic IP? Why would you use one?

**Answer:** An Elastic IP is a static, public IPv4 address you can allocate and associate with an EC2 instance. You use it when you need a **consistent public IP** that doesn't change when you stop/start an instance. It's useful for DNS entries, whitelisting, and failover (quickly remap to another instance). Important: AWS charges for unused Elastic IPs.

---

### Q9: What is the difference between EBS and Instance Store?

**Answer:**
- **EBS:** Network-attached persistent storage. Data survives stop/restart. Supports snapshots, encryption, and can be detached/reattached.
- **Instance Store:** Physically attached storage on the host. Extremely fast but ephemeral — data is lost when the instance stops or terminates.

**Use EBS for:** Databases, OS volumes, anything you can't afford to lose.
**Use Instance Store for:** Caches, buffers, temporary processing data.

---

### Q10: Explain the different EBS volume types.

**Answer:**
- **gp3 (General Purpose SSD):** Default choice. 3,000 baseline IOPS, up to 16,000. Best value.
- **gp2 (General Purpose SSD):** Older version. IOPS scales with volume size (3 IOPS/GiB).
- **io1/io2 (Provisioned IOPS SSD):** For databases needing guaranteed high IOPS (up to 64,000). io2 has higher durability.
- **st1 (Throughput Optimized HDD):** For big data, streaming. High sequential throughput, low cost.
- **sc1 (Cold HDD):** Cheapest. For infrequent access/archival data.

---

### Q11: What are Placement Groups? Name the types.

**Answer:** Placement Groups control how instances are placed on physical hardware:
1. **Cluster:** All instances on the same rack. Lowest latency, highest throughput. Risk: rack failure affects all.
2. **Spread:** Each instance on a separate rack. Highest availability. Max 7 instances per AZ.
3. **Partition:** Instances divided into partitions on separate racks. Good for HDFS, Cassandra, Kafka.

---

### Q12: What is User Data in EC2?

**Answer:** User Data is a bootstrap script that runs automatically when an instance launches for the first time. It runs as root and is used to automate setup tasks like installing software, configuring services, or pulling code from a repository. Maximum size is 16 KB. Logs go to `/var/log/cloud-init-output.log`.

---

### Q13: What is Instance Metadata? How do you access it?

**Answer:** Instance Metadata provides information about the running instance (instance ID, IP, AMI, etc.) accessible from within the instance via the link-local address `http://169.254.169.254/latest/meta-data/`. AWS recommends using **IMDSv2** (token-based) for security. You first get a token via a PUT request, then use it in subsequent GET requests.

---

### Q14: What is Auto Scaling? What are its components?

**Answer:** Auto Scaling automatically adjusts the number of EC2 instances based on demand. Components:
1. **Launch Template:** Defines the instance configuration (AMI, type, SG, etc.)
2. **Auto Scaling Group (ASG):** Defines min, desired, and max instance counts
3. **Scaling Policies:** Rules for when to scale (Target Tracking, Step, Scheduled, Predictive)
4. **Health Checks:** Monitors instance health and replaces unhealthy ones

---

### Q15: What is the difference between ALB and NLB?

**Answer:**
| | ALB | NLB |
|---|---|---|
| **Layer** | Layer 7 (HTTP/HTTPS) | Layer 4 (TCP/UDP) |
| **Routing** | Path-based, host-based, header-based | Connection-based |
| **Performance** | Good | Millions of requests/sec, ultra-low latency |
| **Static IP** | No (uses DNS name) | Yes (1 per AZ) |
| **Use Case** | Web apps, microservices, APIs | Gaming, IoT, real-time streaming |

---

### Q16: What happens when a Spot Instance is interrupted?

**Answer:** When AWS needs the capacity back, it sends a **2-minute warning** via the instance metadata (accessible at `/latest/meta-data/spot/instance-action`). The instance can be:
- **Terminated** (default)
- **Stopped** (if EBS-backed and configured)
- **Hibernated** (if configured)

Best practice: Design applications to handle interruptions gracefully — save state, use checkpointing, distribute across multiple Spot pools.

---

### Q17: How do you make an EC2 instance highly available?

**Answer:** To achieve high availability:
1. **Use multiple AZs** — Deploy instances in at least 2 Availability Zones
2. **Use Auto Scaling** — Automatically replace failed instances
3. **Use a Load Balancer** — Distribute traffic and detect unhealthy instances
4. **Use EBS snapshots** — Regular backups of your data
5. **Use Elastic IP or DNS** — Quick failover to replacement instances
6. **Use a multi-AZ database** — RDS Multi-AZ for database layer

---

### Q18: What is the difference between horizontal and vertical scaling?

**Answer:**
| | Vertical Scaling (Scale Up) | Horizontal Scaling (Scale Out) |
|---|---|---|
| **Method** | Upgrade to a bigger instance type | Add more instances |
| **Example** | t3.micro → t3.xlarge | 1 instance → 10 instances |
| **Downtime** | Yes (must stop to resize) | No (add instances live) |
| **Limit** | Hardware limits (max instance size) | Virtually unlimited |
| **Cost** | Can get expensive | More cost-effective |
| **Best For** | Databases (often need vertical) | Web servers, stateless apps |

---

### Q19: What is the difference between a Launch Template and a Launch Configuration?

**Answer:**
| Feature | Launch Template | Launch Configuration |
|---|---|---|
| **Versioning** | ✅ Supports versions | ❌ No versioning |
| **Modification** | ✅ Create new versions | ❌ Must create a new one |
| **Instance Types** | ✅ Multiple types | ❌ Single type |
| **Spot + On-Demand Mix** | ✅ Supported | ❌ Not supported |
| **AWS Recommendation** | ✅ Recommended | ❌ Legacy (being deprecated) |

Always use **Launch Templates** for new deployments.

---

### Q20: What are EC2 Status Checks?

**Answer:** EC2 has two types of status checks:
1. **System Status Check** — Checks the underlying AWS hardware/infrastructure. If it fails, it's AWS's problem (hardware failure, network issue). **Fix:** Stop and start the instance (moves to new hardware) or wait for AWS.
2. **Instance Status Check** — Checks the software/OS on your instance. If it fails, it's your problem (kernel panic, out of memory, corrupted file system). **Fix:** Reboot the instance, fix the OS configuration.

---

### Q21: Can you change the instance type of a running EC2 instance?

**Answer:** No, you **cannot** change the instance type while the instance is running. You must:
1. **Stop** the instance
2. **Change** the instance type (Actions → Instance Settings → Change Instance Type)
3. **Start** the instance

Note: The public IP will change unless you have an Elastic IP attached.

---

### Q22: What is EC2 Hibernation?

**Answer:** EC2 Hibernation saves the **in-memory (RAM) state** to the root EBS volume when you hibernate the instance. When you start it again, the RAM contents are loaded back, and the instance resumes exactly where it left off — like **closing and reopening a laptop lid**.

Requirements:
- Root volume must be EBS (encrypted)
- RAM size must be less than 150 GB
- Instance family must support it (C, M, R, T families)
- Must be enabled at launch time

---

### Q23: How do you troubleshoot if you can't SSH into an EC2 instance?

**Answer:** Check these in order:
1. **Security Group** — Is port 22 (SSH) open for your IP address?
2. **Key Pair** — Are you using the correct .pem file? Are permissions set to 400?
3. **Public IP** — Does the instance have a public IP or Elastic IP?
4. **Instance State** — Is the instance in "Running" state?
5. **Network ACL** — Does the subnet's NACL allow SSH traffic?
6. **Route Table** — Does the subnet have a route to an Internet Gateway?
7. **Username** — Are you using the right username? (`ec2-user` for Amazon Linux, `ubuntu` for Ubuntu, `admin` for Debian)
8. **OS Firewall** — Is `iptables` or `firewalld` blocking connections?
9. **Instance Status Checks** — Are both status checks passing?

---

### Q24: What is the difference between a public and private subnet in the context of EC2?

**Answer:**
| | Public Subnet | Private Subnet |
|---|---|---|
| **Internet Access** | Has route to Internet Gateway | No direct internet access |
| **Public IP** | Instances can have public IPs | Instances only have private IPs |
| **Use Case** | Web servers, bastion hosts | Databases, application servers |
| **Outbound Internet** | Via Internet Gateway | Via NAT Gateway (if needed) |

Best practice: Place web-facing instances in public subnets and backend/database instances in private subnets.

---

### Q25: What is the EC2 Free Tier?

**Answer:** AWS provides a Free Tier for new accounts that includes:
- **750 hours/month** of t2.micro or t3.micro (Linux or Windows) for **12 months**
- **30 GB** of EBS storage (gp2/gp3)
- **2 million I/O** operations
- **1 GB** of snapshots
- **100 GB** of bandwidth out

That's enough to run **one instance 24/7 for a year** for free. After 12 months or if you exceed the limits, standard pricing applies.

---

## 🔮 What's Next?

Now that you understand EC2, here's what to learn next:

| Order | Topic | Why |
|---|---|---|
| 1 | **VPC Deep Dive** | Understand the networking layer that EC2 lives in |
| 2 | **EBS & Snapshots** | Master persistent storage, backups, and disaster recovery |
| 3 | **Auto Scaling Advanced** | Configure scaling policies, lifecycle hooks, warm pools |
| 4 | **Elastic Load Balancing** | Set up ALB/NLB with health checks, SSL, and target groups |
| 5 | **IAM Roles for EC2** | Securely grant AWS permissions to your instances |
| 6 | **AWS Systems Manager** | Manage EC2 at scale — patching, sessions, parameter store |
| 7 | **CloudWatch for EC2** | Monitor metrics, create alarms, set up dashboards |
| 8 | **EC2 + S3 Integration** | Upload/download files between EC2 and S3 |
| 9 | **ECS & Docker on EC2** | Run containerized applications on EC2 |
| 10 | **Lambda vs EC2** | Know when to use serverless vs. traditional compute |

---

> 📖 **Created as part of the AWS DevOps Learning Path**
> 
> 📅 Last Updated: June 2026
> 
> ⭐ If this guide helped you, share it with others learning AWS!

---
