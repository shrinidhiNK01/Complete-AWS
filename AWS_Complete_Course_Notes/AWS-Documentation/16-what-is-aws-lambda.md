# 16. What is AWS Lambda & Serverless Computing?

## 📋 Table of Contents

1. [What You'll Learn](#what-youll-learn)
2. [Prerequisites](#prerequisites)
3. [What is Serverless Computing?](#what-is-serverless-computing)
4. [Serverless Does NOT Mean No Servers](#serverless-does-not-mean-no-servers)
5. [What is AWS Lambda?](#what-is-aws-lambda)
6. [How Lambda Works](#how-lambda-works)
7. [Lambda Key Concepts](#lambda-key-concepts)
8. [Lambda Execution Flow](#lambda-execution-flow)
9. [Cold Start vs Warm Start](#cold-start-vs-warm-start)
10. [Lambda Pricing](#lambda-pricing)
11. [Lambda Limits](#lambda-limits)
12. [Lambda Use Cases](#lambda-use-cases)
13. [Lambda vs EC2](#lambda-vs-ec2)
14. [Lambda vs ECS vs Fargate](#lambda-vs-ecs-vs-fargate)
15. [AWS Serverless Ecosystem](#aws-serverless-ecosystem)
16. [Lambda Event Sources](#lambda-event-sources)
17. [Lambda Best Practices](#lambda-best-practices)
18. [Hands-On Practice](#hands-on-practice)
19. [Common Mistakes](#common-mistakes)
20. [Quick Summary](#quick-summary)
21. [Interview Questions](#interview-questions)
22. [What's Next](#whats-next)

---

## What You'll Learn

After reading this guide, you will understand:

- What serverless computing means and why it matters
- What AWS Lambda is and how it works
- The event-driven execution model
- Key concepts: Functions, Triggers, Runtimes, Handlers, Layers, Concurrency
- Cold starts vs warm starts and how to optimize
- Lambda pricing with real-world calculations
- Lambda limits and quotas
- 10+ real-world use cases
- How Lambda compares to EC2, ECS, and Fargate
- The complete AWS serverless ecosystem
- Best practices for production Lambda functions
- How to answer Lambda interview questions confidently

---

## Prerequisites

Before starting this guide, you should know:

- **AWS Account** — You need an active AWS account
- **Basic Programming** — Familiarity with JavaScript (Node.js) or Python
- **AWS Basics** — Understanding of IAM, S3, and the AWS Console
- **Previous Guides** — You should have read our guides on EC2 and S3

---

## What is Serverless Computing?

### The Taxi vs Car Analogy

Imagine you need to travel from your home to your office every day.

**Option 1: Own a Car (Traditional Servers / EC2)**
- You buy a car (purchase/rent a server)
- You pay for insurance, maintenance, fuel even when parked (pay even when idle)
- You worry about oil changes, tire pressure, engine health (manage OS, patches, updates)
- If 5 friends need a ride, your 5-seat car can't handle it (scaling is limited)
- You pay the full monthly EMI whether you drive 5 km or 500 km (fixed cost regardless of usage)

**Option 2: Take a Taxi / Uber (Serverless / Lambda)**
- You don't own a car (no servers to manage)
- You pay only for the ride (pay only when code runs)
- The taxi company handles maintenance (cloud provider manages infrastructure)
- Need 5 rides at once? Just book 5 taxis (automatic scaling)
- Short trip = small bill, long trip = bigger bill (pay for actual usage)

```text
┌─────────────────────────────────────────────────────────┐
│                  Traditional (EC2)                       │
│                                                         │
│   You buy the car     ──►  You buy/rent the server      │
│   You maintain it     ──►  You patch, update, secure    │
│   You pay always      ──►  You pay 24/7 even if idle    │
│   Limited seats       ──►  Limited scaling              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                  Serverless (Lambda)                     │
│                                                         │
│   You call a taxi     ──►  You upload your code         │
│   They maintain it    ──►  AWS manages everything       │
│   Pay per ride        ──►  Pay per execution            │
│   Unlimited taxis     ──►  Automatic scaling            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Key Characteristics of Serverless

1. **No Server Management** — You don't provision, patch, or manage any servers
2. **Pay Per Use** — You pay only when your code actually runs (down to the millisecond)
3. **Auto Scaling** — Scales from 0 to thousands of requests automatically
4. **High Availability** — Built-in fault tolerance across multiple Availability Zones
5. **Event-Driven** — Code runs in response to events (HTTP requests, file uploads, database changes)

---

## Serverless Does NOT Mean No Servers

This is one of the most common misconceptions. Let's clear it up:

> **Serverless does NOT mean there are no servers. It means YOU don't have to think about servers.**

The servers absolutely exist — they're running in AWS data centers. The difference is:

| Aspect | Traditional (You Manage) | Serverless (AWS Manages) |
|--------|--------------------------|--------------------------|
| Hardware | You choose instance type | AWS handles it |
| Operating System | You install and patch | AWS handles it |
| Runtime | You install Node.js/Python | AWS provides it |
| Scaling | You configure auto-scaling groups | Automatic |
| Availability | You set up multi-AZ | Built-in |
| Security Patches | You apply them | AWS applies them |
| Capacity Planning | You estimate and provision | Not needed |

Think of it like electricity:
- You don't own a power plant, but you use electricity
- You don't know which generator produced your electricity
- You just plug in and pay for what you use
- **That's serverless computing!**

---

## What is AWS Lambda?

**AWS Lambda** is a **serverless compute service** that lets you run code without provisioning or managing servers. You upload your code, and Lambda handles everything needed to run and scale it.

### Key Facts About Lambda

- **Launched:** November 2014 (one of AWS's most popular services)
- **What it does:** Runs your code in response to events
- **Languages supported:** Node.js, Python, Java, Go, .NET (C#/PowerShell), Ruby, and Custom Runtimes
- **Maximum execution time:** 15 minutes per invocation
- **Billing:** Per millisecond of compute time
- **Free tier:** 1 million requests + 400,000 GB-seconds per month (forever free)

### How is Lambda Different?

```text
┌────────────────────────────────────────────────────────────┐
│                     WITHOUT Lambda (EC2)                    │
│                                                            │
│   1. Launch EC2 instance                                   │
│   2. Install OS, runtime, dependencies                     │
│   3. Deploy your code                                      │
│   4. Configure auto-scaling                                │
│   5. Set up load balancers                                 │
│   6. Monitor server health                                 │
│   7. Patch security vulnerabilities                        │
│   8. Pay 24/7 even during 3 AM with zero traffic           │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                      WITH Lambda                           │
│                                                            │
│   1. Write your code                                       │
│   2. Upload to Lambda                                      │
│   3. Done! AWS handles everything else.                    │
│   4. Pay only when someone triggers your function          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## How Lambda Works

AWS Lambda follows an **event-driven model**. This means your code runs only when something triggers it.

### The Event-Driven Model

```text
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   EVENT SOURCE   │     │   AWS LAMBDA     │     │   DESTINATION    │
│                  │     │                  │     │                  │
│  • API Gateway   │────►│  Your Function   │────►│  • DynamoDB      │
│  • S3 Upload     │     │  (Your Code)     │     │  • S3 Bucket     │
│  • DynamoDB      │     │                  │     │  • SQS Queue     │
│  • SQS Message   │     │  Runs only when  │     │  • SNS Topic     │
│  • CloudWatch    │     │  triggered       │     │  • HTTP Response  │
│  • SNS           │     │                  │     │  • Step Functions │
│  • Kinesis       │     │                  │     │  • CloudWatch     │
│  • Cognito       │     │                  │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### Three Invocation Types

**1. Synchronous Invocation**
- The caller waits for the function to complete and return a response
- Examples: API Gateway, Application Load Balancer, CloudFront (Lambda@Edge)
- If the function fails, the caller must retry

```text
Client ──► API Gateway ──► Lambda ──► Response ──► Client
                                 (waits for result)
```

**2. Asynchronous Invocation**
- The caller sends the event and moves on immediately
- Lambda manages the queue and retries (up to 2 automatic retries)
- Examples: S3, SNS, CloudWatch Events, SES, CloudFormation

```text
S3 Upload ──► Lambda Queue ──► Lambda
                          (fire and forget)
```

**3. Poll-Based / Stream Invocation**
- Lambda polls the event source for new records
- Processes records in batches
- Examples: SQS, Kinesis, DynamoDB Streams, Kafka

```text
SQS Queue ◄── Lambda Polls ──► Lambda processes batch
```

---

## Lambda Key Concepts

### 1. Function

A **Function** is your code that Lambda runs. It includes:
- **Code** — Your application logic (JavaScript, Python, etc.)
- **Configuration** — Memory, timeout, environment variables, IAM role
- **Dependencies** — Libraries and packages your code needs

```javascript
// This entire file IS the Lambda function
exports.handler = async (event) => {
    // Your business logic here
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello from Lambda!" })
    };
};
```

### 2. Trigger / Event Source

A **Trigger** is an AWS service or resource that invokes your Lambda function. Common triggers include:

| Trigger | What Happens |
|---------|-------------|
| **API Gateway** | HTTP request hits an API endpoint |
| **S3** | File is uploaded, deleted, or modified in a bucket |
| **DynamoDB Streams** | Item is inserted, updated, or deleted in a table |
| **SQS** | Message arrives in a queue |
| **SNS** | Notification is published to a topic |
| **CloudWatch Events / EventBridge** | Scheduled time (cron) or AWS event occurs |
| **Kinesis** | Data record arrives in a stream |
| **Cognito** | User signs up, signs in, or verifies |
| **Alexa** | Voice command from Alexa device |
| **IoT Rule** | IoT device sends data matching a rule |
| **CloudFront** | HTTP request hits a CloudFront distribution (Lambda@Edge) |
| **Application Load Balancer** | HTTP request routed by ALB |

### 3. Execution Environment

The **Execution Environment** is the secure, isolated container where your function runs. It has a lifecycle:

```text
┌─────────────────────────────────────────────────────────────┐
│              Execution Environment Lifecycle                 │
│                                                             │
│   ┌──────────┐     ┌──────────┐     ┌──────────┐           │
│   │   INIT   │────►│  INVOKE  │────►│ SHUTDOWN │           │
│   │          │     │          │     │          │           │
│   │ Download │     │ Run your │     │ Cleanup  │           │
│   │ code     │     │ handler  │     │ resources│           │
│   │ Init     │     │ function │     │ Freeze   │           │
│   │ runtime  │     │          │     │ container│           │
│   │ Run init │     │ Can be   │     │          │           │
│   │ code     │     │ reused   │     │          │           │
│   └──────────┘     │ (warm)   │     └──────────┘           │
│                    └──────────┘                             │
│                         │                                   │
│                    ┌──────────┐                             │
│                    │  INVOKE  │  (reused for next request)  │
│                    │  again   │                             │
│                    └──────────┘                             │
└─────────────────────────────────────────────────────────────┘
```

**INIT Phase:**
- Downloads your code from S3 or container image
- Sets up the runtime (Node.js, Python, etc.)
- Runs initialization code (outside the handler)
- This is where cold start happens

**INVOKE Phase:**
- Runs your handler function
- Can be called multiple times if the container is reused (warm start)

**SHUTDOWN Phase:**
- Triggered when the function hasn't been invoked for a while
- Runtime hooks can run cleanup logic
- Container is frozen and eventually destroyed

### 4. Runtime

The **Runtime** is the language environment your function runs in. Lambda supports:

| Runtime | Versions | Language |
|---------|----------|----------|
| **Node.js** | 18.x, 20.x, 22.x | JavaScript/TypeScript |
| **Python** | 3.9, 3.10, 3.11, 3.12, 3.13 | Python |
| **Java** | 11, 17, 21 | Java |
| **Go** | 1.x (provided.al2) | Go |
| **.NET** | 6, 8 | C#, PowerShell |
| **Ruby** | 3.2, 3.3 | Ruby |
| **Custom** | Any | Any language using provided.al2 or provided.al2023 |

> **Note:** You can use ANY programming language with Custom Runtimes (Rust, C++, PHP, etc.)

### 5. Handler

The **Handler** is the entry point of your Lambda function — the method Lambda calls when your function is invoked.

**Format:** `filename.functionName`

**Node.js Example:**
```javascript
// File: index.js
// Handler setting: index.handler

exports.handler = async (event, context) => {
    // event   = input data (JSON from trigger)
    // context = runtime info (function name, memory, time remaining)
    
    console.log("Event:", JSON.stringify(event));
    console.log("Function name:", context.functionName);
    console.log("Memory limit:", context.memoryLimitInMB);
    console.log("Time remaining:", context.getRemainingTimeInMillis());
    
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello!" })
    };
};
```

**Python Example:**
```python
# File: lambda_function.py
# Handler setting: lambda_function.lambda_handler

def lambda_handler(event, context):
    print(f"Event: {event}")
    print(f"Function name: {context.function_name}")
    print(f"Memory limit: {context.memory_limit_in_mb}")
    
    return {
        'statusCode': 200,
        'body': 'Hello from Python Lambda!'
    }
```

### 6. Layers

**Layers** are a way to package libraries, custom runtimes, or shared code that multiple functions can use.

```text
┌─────────────────────────────────────────┐
│            Lambda Function              │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │        Your Function Code       │   │
│   └─────────────────────────────────┘   │
│   ┌──────────┐ ┌──────────┐ ┌────────┐ │
│   │  Layer 1 │ │  Layer 2 │ │Layer 3 │ │
│   │ (axios)  │ │ (lodash) │ │(sharp) │ │
│   └──────────┘ └──────────┘ └────────┘ │
└─────────────────────────────────────────┘
```

**Key Facts About Layers:**
- A function can use up to **5 layers**
- Total unzipped size (function + all layers) must be under **250 MB**
- Layers are extracted to the `/opt` directory in the execution environment
- Layers can be shared across multiple functions and even across AWS accounts
- AWS provides managed layers (e.g., AWS SDK, pandas for Python)

**Benefits:**
- Smaller deployment packages
- Separation of core logic from dependencies
- Share common code across functions
- Independent updates of dependencies

### 7. Concurrency

**Concurrency** is the number of function instances serving requests at the same time.

```text
┌─────────────────────────────────────────────────────────┐
│                    Concurrency Types                     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Unreserved Concurrency                         │    │
│  │  • Shared pool across all functions             │    │
│  │  • Default: 1000 concurrent executions          │    │
│  │  • AWS keeps 100 unreserved for other functions │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Reserved Concurrency                           │    │
│  │  • Guaranteed number for a specific function    │    │
│  │  • Prevents other functions from using it       │    │
│  │  • Also acts as maximum limit                   │    │
│  │  • Free!                                        │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Provisioned Concurrency                        │    │
│  │  • Pre-initialized environments (always warm)   │    │
│  │  • Eliminates cold starts                       │    │
│  │  • Costs extra money                            │    │
│  │  • Great for latency-sensitive functions        │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

**Example Scenario:**
- Your account has 1000 concurrency limit
- Function A has Reserved Concurrency = 200
- Function B has Reserved Concurrency = 100
- Remaining 700 is shared among ALL other functions (minus 100 kept unreserved)

---

## Lambda Execution Flow

Here's exactly what happens when a Lambda function is invoked:

```text
┌──────────┐    ┌──────────────┐    ┌─────────────────┐
│  Client  │───►│ API Gateway  │───►│   AWS Lambda     │
│ (Browser)│    │ (or trigger) │    │   Service        │
└──────────┘    └──────────────┘    └────────┬────────┘
                                             │
                                    ┌────────▼────────┐
                                    │ Is there a warm │
                                    │ container?      │
                                    └───┬─────────┬───┘
                                        │         │
                                   NO   │         │  YES
                                        │         │
                              ┌─────────▼───┐  ┌──▼──────────┐
                              │ COLD START  │  │ WARM START  │
                              │             │  │             │
                              │ 1. Download │  │ Skip to     │
                              │    code     │  │ step 5      │
                              │ 2. Start    │  │             │
                              │    container│  │             │
                              │ 3. Init     │  │             │
                              │    runtime  │  │             │
                              │ 4. Run init │  │             │
                              │    code     │  │             │
                              └──────┬──────┘  └──────┬──────┘
                                     │                │
                              ┌──────▼────────────────▼──────┐
                              │  5. Execute Handler Function  │
                              │     (Your business logic)     │
                              └──────────────┬───────────────┘
                                             │
                              ┌──────────────▼───────────────┐
                              │  6. Return Response           │
                              │     (to API Gateway/caller)   │
                              └──────────────┬───────────────┘
                                             │
                              ┌──────────────▼───────────────┐
                              │  7. Container stays warm      │
                              │     (for next invocation)     │
                              └──────────────────────────────┘
```

---

## Cold Start vs Warm Start

### What is a Cold Start?

A **Cold Start** happens when Lambda needs to create a brand new execution environment for your function. This adds extra latency to the first request.

**When does cold start happen?**
- First invocation of a function
- After a function hasn't been called for a while (~5-15 minutes)
- When scaling up (new concurrent instances needed)
- After deploying new code

### What is a Warm Start?

A **Warm Start** happens when Lambda reuses an existing execution environment. The container is already initialized, so your function runs immediately.

### Cold Start vs Warm Start Comparison

```text
┌────────────────────────────────────────────────────────────┐
│                        COLD START                          │
│                                                            │
│   ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌────────────┐  │
│   │Download │►│  Start   │►│   Init    │►│  Execute   │  │
│   │  Code   │ │Container │ │  Runtime  │ │  Handler   │  │
│   │ ~100ms  │ │  ~200ms  │ │  ~100ms   │ │  ~50ms     │  │
│   └─────────┘ └──────────┘ └───────────┘ └────────────┘  │
│                                                            │
│   Total: ~450ms (can be 100ms to 10+ seconds)             │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                        WARM START                          │
│                                                            │
│                                         ┌────────────┐    │
│           (all skipped)          ──────►│  Execute   │    │
│                                         │  Handler   │    │
│                                         │  ~50ms     │    │
│                                         └────────────┘    │
│                                                            │
│   Total: ~50ms (just handler execution)                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Cold Start Duration by Runtime

| Runtime | Average Cold Start | Notes |
|---------|-------------------|-------|
| **Python** | 100-300ms | One of the fastest |
| **Node.js** | 100-300ms | Very fast |
| **Go** | 50-200ms | Compiled, very fast |
| **Ruby** | 200-500ms | Moderate |
| **Java** | 500ms - 10s | Slowest (JVM startup) |
| **.NET** | 300ms - 2s | Moderate to slow |

### How to Minimize Cold Starts

1. **Keep deployment packages small** — Remove unused dependencies
2. **Use Provisioned Concurrency** — Pre-warm execution environments (costs money)
3. **Choose lightweight runtimes** — Python and Node.js have faster cold starts than Java
4. **Initialize outside handler** — Put DB connections in init code so they persist across warm invocations
5. **Use Lambda SnapStart** — Available for Java, takes a snapshot of initialized function
6. **Avoid VPC (if possible)** — VPC-attached functions used to have slower cold starts (now improved with Hyperplane ENI)
7. **Keep functions warm** — Use CloudWatch scheduled events to ping functions periodically

```javascript
// GOOD: Initialize outside handler (reused in warm starts)
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // dynamodb client is already initialized on warm starts
    const result = await dynamodb.get({
        TableName: 'MyTable',
        Key: { id: event.id }
    }).promise();
    
    return result.Item;
};

// BAD: Initialize inside handler (re-created every time)
exports.handler = async (event) => {
    const AWS = require('aws-sdk');  // Don't do this!
    const dynamodb = new AWS.DynamoDB.DocumentClient();  // Don't do this!
    
    const result = await dynamodb.get({
        TableName: 'MyTable',
        Key: { id: event.id }
    }).promise();
    
    return result.Item;
};
```

---

## Lambda Pricing

Lambda pricing is based on two factors: **number of requests** and **duration of execution**.

### Pricing Components

| Component | Free Tier (Per Month) | Price After Free Tier |
|-----------|----------------------|----------------------|
| **Requests** | First 1,000,000 (1M) requests FREE | $0.20 per 1 million requests |
| **Duration** | 400,000 GB-seconds FREE | $0.0000166667 per GB-second |
| **Provisioned Concurrency** | Not included | $0.0000041667 per GB-second |

> **Note:** The free tier for Lambda is **forever free** — it never expires (unlike EC2's 12-month free tier).

### What is a GB-Second?

A **GB-second** = 1 GB of memory used for 1 second.

- If your function uses **512 MB** memory and runs for **2 seconds**:
  - Duration = 0.5 GB × 2 seconds = **1 GB-second**

- If your function uses **1024 MB** (1 GB) memory and runs for **3 seconds**:
  - Duration = 1 GB × 3 seconds = **3 GB-seconds**

### Pricing Example 1: Simple API

**Scenario:** A small API that handles 2 million requests per month. Each request uses 256 MB memory and takes 200ms.

```text
Step 1: Calculate Request Cost
─────────────────────────────────
Total Requests:              2,000,000
Free Tier Requests:        - 1,000,000
Billable Requests:           1,000,000

Request Cost = 1,000,000 × ($0.20 / 1,000,000)
             = $0.20

Step 2: Calculate Duration Cost
─────────────────────────────────
Memory:    256 MB = 0.25 GB
Duration:  200ms  = 0.2 seconds
GB-seconds per request: 0.25 × 0.2 = 0.05 GB-seconds

Total GB-seconds: 2,000,000 × 0.05 = 100,000 GB-seconds
Free Tier:                          - 400,000 GB-seconds
Billable GB-seconds:                  0 GB-seconds (within free tier!)

Duration Cost = $0.00

Step 3: Total Monthly Cost
─────────────────────────────────
Total = $0.20 + $0.00 = $0.20 per month!
```

**This API costs just 20 cents per month!** Compare that to a $30-50/month EC2 instance.

### Pricing Example 2: Image Processing

**Scenario:** An image processing function triggered 5 million times per month. Each invocation uses 1536 MB memory and takes 3 seconds.

```text
Step 1: Calculate Request Cost
─────────────────────────────────
Total Requests:              5,000,000
Free Tier Requests:        - 1,000,000
Billable Requests:           4,000,000

Request Cost = 4,000,000 × ($0.20 / 1,000,000)
             = $0.80

Step 2: Calculate Duration Cost
─────────────────────────────────
Memory:    1536 MB = 1.5 GB
Duration:  3 seconds
GB-seconds per request: 1.5 × 3 = 4.5 GB-seconds

Total GB-seconds: 5,000,000 × 4.5 = 22,500,000 GB-seconds
Free Tier:                        -     400,000 GB-seconds
Billable GB-seconds:               22,100,000 GB-seconds

Duration Cost = 22,100,000 × $0.0000166667
              = $368.33

Step 3: Total Monthly Cost
─────────────────────────────────
Total = $0.80 + $368.33 = $369.13 per month
```

### Pricing Example 3: Cron Job

**Scenario:** A scheduled job runs every hour (720 times/month), uses 512 MB, and takes 30 seconds.

```text
Step 1: Calculate Request Cost
─────────────────────────────────
Total Requests:                720
Free Tier Requests:      - 1,000,000
Billable Requests:             0 (within free tier)

Request Cost = $0.00

Step 2: Calculate Duration Cost
─────────────────────────────────
Memory:    512 MB = 0.5 GB
Duration:  30 seconds
GB-seconds per request: 0.5 × 30 = 15 GB-seconds

Total GB-seconds: 720 × 15 = 10,800 GB-seconds
Free Tier:                 - 400,000 GB-seconds
Billable GB-seconds:          0 (within free tier)

Duration Cost = $0.00

Step 3: Total Monthly Cost
─────────────────────────────────
Total = $0.00 (completely free!)
```

---

## Lambda Limits

### Function Configuration Limits

| Limit | Value | Can Be Increased? |
|-------|-------|--------------------|
| **Memory** | 128 MB to 10,240 MB (10 GB) | No (hard limit) |
| **Timeout** | 1 second to 15 minutes (900 seconds) | No (hard limit) |
| **Environment Variables** | 4 KB total | No |
| **Resource-based Policy** | 20 KB | No |
| **Layers** | 5 per function | No |
| **/tmp Storage** | 512 MB (default) to 10,240 MB (10 GB) | Configurable |
| **CPU** | Scales with memory (1,769 MB = 1 vCPU) | No (tied to memory) |

### Deployment Limits

| Limit | Value | Can Be Increased? |
|-------|-------|--------------------|
| **Deployment Package (ZIP)** | 50 MB (compressed) | No |
| **Deployment Package (Unzipped)** | 250 MB (including layers) | No |
| **Container Image** | 10 GB | No |
| **Console Editor** | 3 MB (code must be under 3 MB to edit inline) | No |

### Concurrency and Scaling Limits

| Limit | Value | Can Be Increased? |
|-------|-------|--------------------|
| **Concurrent Executions** | 1,000 per region (default) | Yes (request increase) |
| **Burst Concurrency** | 500-3000 (varies by region) | No |
| **Scaling Rate** | 500 additional instances/minute | No |
| **Reserved Concurrency** | Min 0, Max = account limit | Configurable |
| **Provisioned Concurrency** | Same as account concurrency limit | Configurable |

### Invocation Limits

| Limit | Value |
|-------|-------|
| **Synchronous Payload** | 6 MB (request and response) |
| **Asynchronous Payload** | 256 KB |
| **Invocation Frequency (Request)** | 10x concurrent execution limit |
| **Async Event Queue** | 6 hours event age, 2 retries |

### Memory and CPU Relationship

Lambda allocates CPU proportionally to memory:

```text
Memory (MB)  │  vCPU     │  Best For
─────────────┼───────────┼──────────────────────
128          │  ~0.08    │  Simple operations
256          │  ~0.17    │  Light processing
512          │  ~0.33    │  Standard APIs
1024         │  ~0.58    │  Data processing
1769         │  1.0      │  CPU-intensive tasks
3538         │  2.0      │  Parallel processing
10240        │  6.0      │  Heavy computation
```

---

## Lambda Use Cases

### 1. API Backend (REST/GraphQL)
Build serverless APIs with API Gateway + Lambda. Each endpoint triggers a Lambda function.

```text
Client ──► API Gateway ──► Lambda ──► DynamoDB
                                   ──► RDS
                                   ──► S3
```

### 2. File Processing (S3 Triggers)
Automatically process files when uploaded to S3: generate thumbnails, transcode video, parse CSVs.

```text
User uploads image ──► S3 Bucket ──► Lambda ──► Generate Thumbnail ──► S3 (thumbnails/)
```

### 3. Scheduled Tasks (Cron Jobs)
Use CloudWatch Events / EventBridge to run Lambda on a schedule: cleanup, reports, data sync.

```text
CloudWatch Rule (every 6 hours) ──► Lambda ──► Generate Report ──► Send via SES
```

### 4. Real-Time Stream Processing
Process data from Kinesis or DynamoDB Streams in real time for analytics or transformations.

```text
IoT Sensors ──► Kinesis ──► Lambda ──► Transform ──► S3 / Redshift
```

### 5. Chatbots and Voice Assistants
Power Alexa Skills and chatbot backends with Lambda.

```text
User speaks ──► Alexa ──► Lambda ──► Process Intent ──► Response
```

### 6. IoT Backends
Process data from IoT devices, trigger actions based on sensor readings.

```text
Temperature Sensor ──► IoT Core ──► IoT Rule ──► Lambda ──► Send Alert
```

### 7. Data Transformation (ETL)
Transform and load data between databases, data lakes, and warehouses.

```text
Source DB ──► DynamoDB Stream ──► Lambda ──► Transform ──► S3 Data Lake
```

### 8. Authentication and Authorization
Custom authentication flows with Cognito triggers or API Gateway authorizers.

```text
Login Request ──► API Gateway ──► Lambda Authorizer ──► Verify Token ──► Allow/Deny
```

### 9. Email and Notification Processing
Process incoming emails (SES), send notifications, handle webhooks.

```text
Incoming Email ──► SES ──► Lambda ──► Parse Email ──► Save to DynamoDB
```

### 10. Log Processing and Analysis
Process CloudWatch Logs, analyze patterns, trigger alerts.

```text
Application Logs ──► CloudWatch ──► Lambda ──► Parse ──► Elasticsearch / S3
```

### 11. Machine Learning Inference
Run ML models for predictions (with containers or layers for model files).

```text
API Request ──► API Gateway ──► Lambda ──► Load Model ──► Predict ──► Return Result
```

### 12. Web Scraping
Scheduled scraping of websites for data collection.

```text
CloudWatch Schedule ──► Lambda ──► Scrape Website ──► Save to DynamoDB
```

---

## Lambda vs EC2

| Feature | AWS Lambda | Amazon EC2 |
|---------|-----------|------------|
| **Management** | Fully managed (no servers) | You manage the instance |
| **Scaling** | Automatic (0 to thousands) | Manual or Auto Scaling Groups |
| **Pricing** | Pay per request + duration | Pay per hour/second (even if idle) |
| **Max Execution Time** | 15 minutes | Unlimited |
| **State** | Stateless (no persistent storage) | Stateful (EBS, local disk) |
| **Languages** | Node.js, Python, Java, Go, .NET, Ruby | Any language |
| **Startup Time** | Milliseconds (warm) to seconds (cold) | Minutes |
| **Maintenance** | Zero | Patching, updates, monitoring |
| **Use Case** | Event-driven, short tasks | Long-running, stateful apps |
| **Networking** | Optional VPC | Full VPC control |
| **Root Access** | No | Full root/admin access |
| **Cost for Low Traffic** | Nearly free | $15-30+/month minimum |
| **Cost for High Traffic** | Can be expensive | More cost-effective |
| **Customization** | Limited | Full control |

### When to Use Lambda vs EC2

```text
Use Lambda When:                    Use EC2 When:
─────────────────                   ─────────────────
✓ Short-lived tasks (<15 min)       ✓ Long-running processes
✓ Event-driven workloads            ✓ Need OS-level access
✓ Unpredictable traffic             ✓ Stateful applications
✓ API backends                      ✓ Custom software stacks
✓ Want zero maintenance             ✓ GPU/specialized hardware
✓ Cost-sensitive (low traffic)      ✓ Consistent high traffic
✓ Microservices                     ✓ Monolithic applications
```

---

## Lambda vs ECS vs Fargate

| Feature | Lambda | ECS (EC2 Launch) | Fargate |
|---------|--------|------------------|---------|
| **What It Is** | Serverless functions | Container orchestration on EC2 | Serverless containers |
| **Management** | No servers, no containers | You manage EC2 instances | No servers to manage |
| **Scaling** | Automatic per request | Task-level with ASG | Automatic per task |
| **Max Runtime** | 15 minutes | Unlimited | Unlimited |
| **Pricing** | Per request + duration | EC2 instance pricing | Per vCPU + memory/second |
| **Package Size** | 250 MB (zip) / 10 GB (image) | No limit (containers) | No limit (containers) |
| **State** | Stateless | Stateful (EBS) | Stateless (EFS possible) |
| **Cold Start** | Yes (ms to seconds) | No (always running) | Yes (slower, 30-60s) |
| **Use Case** | Short tasks, APIs, events | Full control needed | Long-running containers |
| **Complexity** | Very Low | High | Medium |
| **GPU Support** | No | Yes | No |
| **Best For** | Event-driven microservices | Complex orchestration | Containerized apps |

```text
When to Choose:

Lambda:    "I have small, event-driven functions that run quickly"
ECS/EC2:   "I need full container control with specific instance types"
Fargate:   "I want containers without managing EC2 instances"
```

---

## AWS Serverless Ecosystem

AWS provides many serverless services that work together:

| Service | What It Does | Role in Serverless |
|---------|-------------|-------------------|
| **AWS Lambda** | Run code without servers | Compute engine |
| **API Gateway** | Create and manage APIs | API front door |
| **DynamoDB** | NoSQL database | Serverless database |
| **S3** | Object storage | File storage |
| **SQS** | Message queue | Asynchronous messaging |
| **SNS** | Pub/sub notifications | Push notifications |
| **Step Functions** | Workflow orchestration | Coordinate Lambda functions |
| **EventBridge** | Event bus | Route events between services |
| **AppSync** | GraphQL APIs | Managed GraphQL |
| **Cognito** | Authentication | User sign-up/sign-in |
| **Aurora Serverless** | Relational database | Serverless SQL |
| **Kinesis** | Real-time data streaming | Stream processing |

### Serverless Architecture Example

```text
┌──────────┐   ┌─────────────┐   ┌─────────────┐   ┌──────────────┐
│  React   │──►│API Gateway  │──►│   Lambda     │──►│  DynamoDB    │
│ Frontend │   │(REST API)   │   │ (Business    │   │  (Database)  │
│ (on S3 + │   │             │   │  Logic)      │   │              │
│CloudFront│   └─────────────┘   └──────┬───────┘   └──────────────┘
│         )│                            │
└──────────┘                     ┌──────▼───────┐
                                 │    SQS       │
                                 │  (Queue for  │
                                 │  async tasks)│
                                 └──────┬───────┘
                                        │
                                 ┌──────▼───────┐   ┌──────────────┐
                                 │   Lambda     │──►│     SES      │
                                 │ (Process     │   │ (Send Email) │
                                 │  Queue)      │   │              │
                                 └──────────────┘   └──────────────┘
```

---

## Lambda Event Sources

Complete list of services that can trigger Lambda:

### Synchronous Event Sources (Caller Waits)
| Service | Event | Example |
|---------|-------|---------|
| API Gateway | HTTP Request | GET /users |
| ALB | HTTP Request | Load-balanced request |
| CloudFront | HTTP Request | Lambda@Edge |
| Cognito | Auth Event | Pre-signup validation |
| Alexa | Voice Command | "Alexa, ask my app..." |
| Lex | Chat Message | Chatbot intent |
| Kinesis Data Firehose | Data Transform | Transform before delivery |

### Asynchronous Event Sources (Fire and Forget)
| Service | Event | Example |
|---------|-------|---------|
| S3 | Object Created/Deleted | File uploaded to bucket |
| SNS | Message Published | Notification sent |
| SES | Email Received | Incoming email |
| CloudFormation | Stack Events | Stack creation complete |
| CloudWatch Logs | Log Entry | Specific log pattern |
| CodeCommit | Repository Events | Code pushed |
| Config | Configuration Change | Resource changed |
| IoT Events | IoT Button | Button pressed |

### Poll-Based Event Sources (Lambda Polls)
| Service | Event | Example |
|---------|-------|---------|
| SQS | Queue Message | New message in queue |
| DynamoDB Streams | Table Change | Item inserted/modified |
| Kinesis | Stream Record | New data in stream |
| Amazon MQ | Queue Message | ActiveMQ/RabbitMQ message |
| MSK (Kafka) | Topic Message | Kafka topic message |
| DocumentDB | Change Stream | Document change |

---

## Lambda Best Practices

### 1. Keep Deployment Packages Small
- Remove unused dependencies
- Use layers for common libraries
- Use webpack/esbuild to bundle and tree-shake

### 2. Initialize Outside the Handler
```javascript
// GOOD: Connection reused across warm invocations
const db = new DynamoDBClient({});

exports.handler = async (event) => {
    // Use db here
};
```

### 3. Set Appropriate Memory
- More memory = more CPU = faster execution
- Sometimes increasing memory actually reduces cost (runs faster)
- Use AWS Lambda Power Tuning to find optimal memory

### 4. Set Appropriate Timeout
- Don't use the maximum 15 minutes unless needed
- Set timeout slightly above expected duration
- Prevents runaway functions from costing too much

### 5. Use Environment Variables
```javascript
// GOOD: Configuration via environment variables
const TABLE_NAME = process.env.TABLE_NAME;
const REGION = process.env.AWS_REGION;
```

### 6. Handle Errors Properly
```javascript
exports.handler = async (event) => {
    try {
        const result = await processData(event);
        return { statusCode: 200, body: JSON.stringify(result) };
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) };
    }
};
```

### 7. Use Dead Letter Queues (DLQ)
- Configure SQS or SNS as DLQ for failed async invocations
- Prevents lost events

### 8. Avoid Recursive Invocations
- Never let a Lambda function trigger itself (infinite loop)
- S3 → Lambda → writes to same S3 bucket → triggers Lambda again → infinite!

### 9. Monitor with CloudWatch
- Set up alarms for errors, throttles, and duration
- Use structured logging (JSON) for easier searching
- Enable X-Ray for distributed tracing

### 10. Use Least Privilege IAM
- Give Lambda only the permissions it needs
- Don't use AdministratorAccess for Lambda roles

### 11. Reuse HTTP Connections
```javascript
const https = require('https');
const agent = new https.Agent({ keepAlive: true });
// Reuse TCP connections across invocations
```

### 12. Use Provisioned Concurrency for Critical Functions
- If cold starts are unacceptable, use provisioned concurrency
- Perfect for APIs serving user-facing requests

---

## Hands-On Practice

### Exercise 1: Create Your First Lambda
1. Go to AWS Console → Lambda → Create Function
2. Name: `helloWorldFunction`
3. Runtime: Node.js 18.x
4. Write a function that returns your name and current time
5. Test it and check CloudWatch Logs

### Exercise 2: S3 Trigger
1. Create an S3 bucket
2. Create a Lambda function that logs the file name when a file is uploaded
3. Add S3 as a trigger
4. Upload a file and check the logs

### Exercise 3: Scheduled Function
1. Create a Lambda function that logs "Health check passed" with timestamp
2. Create a CloudWatch Events rule to trigger it every 5 minutes
3. Wait and verify logs

### Exercise 4: Environment Variables
1. Create a Lambda function with environment variables: APP_NAME, VERSION
2. Read them in your code using `process.env`
3. Return them in the response

### Exercise 5: Cost Calculator
1. Calculate the monthly cost for: 10 million requests, 512 MB memory, 500ms duration
2. Compare with running a t3.medium EC2 instance 24/7

---

## Common Mistakes

### 1. ❌ Not Setting Appropriate Timeout
- Default is 3 seconds, many operations need more
- Set timeout based on expected execution time + buffer

### 2. ❌ Using Maximum Memory When Not Needed
- 10 GB memory for a simple API is wasteful
- Use Lambda Power Tuning to find the right balance

### 3. ❌ Initializing SDK Inside Handler
- Creates new connections on every invocation
- Move initialization outside the handler

### 4. ❌ Not Handling Errors
- Unhandled errors cause retries (async) or 500s (sync)
- Always use try/catch blocks

### 5. ❌ Ignoring Cold Starts
- Not considering cold start impact on user experience
- Use provisioned concurrency for latency-sensitive functions

### 6. ❌ Overly Large Deployment Packages
- Including node_modules with unnecessary packages
- Use tree-shaking and remove dev dependencies

### 7. ❌ Creating Recursive Loops
- Lambda writes to S3 → S3 triggers same Lambda → infinite loop
- Use different buckets or prefix filters

### 8. ❌ Giving Lambda Too Many IAM Permissions
- Using AdministratorAccess for Lambda is a security risk
- Use least privilege: only what the function needs

### 9. ❌ Not Monitoring Functions
- Running Lambda without CloudWatch alarms
- Set up alarms for errors, throttles, and abnormal duration

### 10. ❌ Hardcoding Configuration
- Hardcoding database URLs, API keys in code
- Use environment variables or AWS Secrets Manager

---

## Quick Summary

```text
✅ Serverless = You don't manage servers (but servers still exist)
✅ AWS Lambda = Run code without servers, pay only for execution
✅ Event-Driven = Code runs only when triggered by events
✅ Supported Runtimes = Node.js, Python, Java, Go, .NET, Ruby, Custom
✅ Handler = Entry point function (filename.functionName)
✅ Layers = Shared libraries (up to 5 per function, 250MB total)
✅ Concurrency = Reserved (guaranteed) vs Provisioned (always warm)
✅ Cold Start = Extra latency on first invocation (100ms-10s)
✅ Warm Start = Reuses existing container (fast)
✅ Free Tier = 1M requests + 400,000 GB-seconds per month (forever)
✅ Pricing = $0.20/1M requests + $0.0000166667/GB-second
✅ Limits = 15min timeout, 10GB memory, 250MB package, 1000 concurrency
✅ Use Cases = APIs, file processing, cron jobs, IoT, chatbots, ETL
✅ Lambda vs EC2 = Lambda for event-driven, EC2 for long-running
✅ Serverless Ecosystem = Lambda + API Gateway + DynamoDB + S3 + SQS + SNS
✅ Best Practices = Small packages, init outside handler, proper IAM, monitoring
```

---

## Interview Questions

### Q1: What is AWS Lambda?
**Answer:** AWS Lambda is a serverless compute service that runs your code in response to events without requiring you to provision or manage servers. You pay only for the compute time consumed — there's no charge when your code is not running. Lambda supports Node.js, Python, Java, Go, .NET, Ruby, and custom runtimes.

### Q2: What is serverless computing? Does it mean no servers?
**Answer:** Serverless computing is a cloud execution model where the cloud provider manages the infrastructure. You write code, upload it, and the provider handles provisioning, scaling, and maintenance. "Serverless" does NOT mean no servers — the servers still exist in the cloud provider's data centers, but you don't need to manage them.

### Q3: What are the invocation types of Lambda?
**Answer:** Lambda has three invocation types:
1. **Synchronous** — Caller waits for response (API Gateway, ALB)
2. **Asynchronous** — Caller sends event and moves on; Lambda handles retries (S3, SNS, CloudWatch Events)
3. **Poll-based** — Lambda polls event source for new records in batches (SQS, DynamoDB Streams, Kinesis)

### Q4: Explain Cold Start vs Warm Start.
**Answer:** A **cold start** occurs when Lambda creates a new execution environment — downloading code, initializing the runtime, and running initialization code. This adds 100ms to 10+ seconds of latency. A **warm start** occurs when Lambda reuses an existing environment, skipping initialization and running only the handler, typically adding just milliseconds of overhead.

### Q5: What is the maximum execution time for Lambda?
**Answer:** 15 minutes (900 seconds). If your function needs to run longer, consider using Step Functions to orchestrate multiple Lambda functions, or use ECS/Fargate for long-running tasks.

### Q6: How is Lambda priced?
**Answer:** Lambda pricing has two components:
1. **Requests:** First 1M requests free, then $0.20 per million
2. **Duration:** First 400,000 GB-seconds free, then $0.0000166667 per GB-second
Duration is calculated as: (Memory in GB) × (Execution time in seconds). The free tier is available indefinitely.

### Q7: What are Lambda Layers?
**Answer:** Layers are ZIP archives containing libraries, custom runtimes, or shared code. A function can use up to 5 layers, with total unzipped size (function + layers) under 250 MB. Layers are extracted to `/opt` in the execution environment and can be shared across functions and accounts.

### Q8: What is the difference between Reserved and Provisioned Concurrency?
**Answer:**
- **Reserved Concurrency:** Guarantees a specific number of concurrent instances for a function (taken from the account pool). It's free but also limits the function to that maximum.
- **Provisioned Concurrency:** Pre-initializes execution environments so they're always warm, eliminating cold starts. It costs extra money and is used for latency-sensitive workloads.

### Q9: What is the maximum memory you can allocate to a Lambda function?
**Answer:** 10,240 MB (10 GB). Memory ranges from 128 MB to 10,240 MB in 1 MB increments. CPU power scales linearly with memory — at 1,769 MB you get 1 full vCPU.

### Q10: How do you handle errors in Lambda?
**Answer:** 
- **Synchronous invocations:** Return error to caller; caller must retry
- **Asynchronous invocations:** Lambda retries twice automatically. Configure Dead Letter Queue (SQS/SNS) to capture failed events
- **Stream-based:** Lambda retries until data expires from the stream. Configure failure destination or bisect batch on error

### Q11: What is Lambda@Edge?
**Answer:** Lambda@Edge lets you run Lambda functions at AWS CloudFront edge locations worldwide. It's used to customize content delivery — modifying headers, redirecting URLs, generating responses at the edge for lower latency. Functions must be in us-east-1 and have a 5-second timeout limit.

### Q12: What are Lambda environment variables?
**Answer:** Environment variables are key-value pairs available to your function at runtime via `process.env` (Node.js) or `os.environ` (Python). They're used for configuration like database URLs, API keys, and feature flags. Total size limit is 4 KB. They can be encrypted with KMS.

### Q13: When would you choose Lambda over EC2?
**Answer:** Choose Lambda when:
- Tasks are short-lived (under 15 minutes)
- Traffic is unpredictable or spiky
- You want zero server management
- Event-driven architecture is suitable
- Cost optimization for low/moderate traffic
Choose EC2 when you need long-running processes, specific OS/hardware, or consistent high-volume processing.

### Q14: What is the Lambda execution environment lifecycle?
**Answer:** The lifecycle has three phases:
1. **INIT:** Download code, initialize runtime, run initialization code (outside handler). This is the cold start phase.
2. **INVOKE:** Execute the handler function. Environment may be reused for subsequent invocations (warm start).
3. **SHUTDOWN:** Triggered after inactivity. Runtime shutdown hooks run, then the environment is destroyed.

### Q15: Can Lambda access resources in a VPC?
**Answer:** Yes. You can configure Lambda to connect to a VPC by specifying subnets and security groups. This allows Lambda to access private resources like RDS databases, ElastiCache, or internal APIs. Lambda creates an ENI (Elastic Network Interface) in your VPC using AWS Hyperplane.

### Q16: What is the deployment package size limit?
**Answer:** 50 MB for zipped packages, 250 MB unzipped (including layers). For larger deployments, you can use container images up to 10 GB. If your code exceeds the console editor limit of 3 MB, you must upload via ZIP or S3.

### Q17: How does Lambda scale?
**Answer:** Lambda scales automatically by creating new instances for each concurrent request. It starts with a burst capacity (500-3000 depending on region), then adds 500 instances per minute until the concurrency limit is reached (default 1000 per account/region). Each instance handles one request at a time.

### Q18: What is AWS Step Functions and how does it relate to Lambda?
**Answer:** Step Functions is a serverless orchestration service that coordinates multiple Lambda functions into workflows. You define state machines with steps that run sequentially, in parallel, or with branching logic. It's ideal for complex processes that exceed Lambda's 15-minute timeout or need error handling across multiple steps.

### Q19: How do you monitor Lambda functions?
**Answer:** Lambda integrates with CloudWatch for monitoring:
- **Metrics:** Invocations, Duration, Errors, Throttles, ConcurrentExecutions
- **Logs:** Automatic logging of console.log/print statements to CloudWatch Logs
- **X-Ray:** Distributed tracing for performance analysis
- **CloudWatch Alarms:** Alert on errors, throttles, or abnormal behavior
- **Lambda Insights:** Enhanced monitoring with system-level metrics

### Q20: What is the /tmp storage in Lambda?
**Answer:** Each Lambda execution environment has a `/tmp` directory for temporary file storage. Default size is 512 MB, configurable up to 10 GB. Data in `/tmp` persists between invocations of the same execution environment (warm starts) but is not guaranteed to be available across different environments. It's useful for caching files, processing large data, or extracting archives.

### Q21: Explain the difference between Lambda function URL and API Gateway.
**Answer:** 
- **Function URL:** A built-in HTTPS endpoint directly on the Lambda function. Simple, free, good for single-function APIs or webhooks. Limited features.
- **API Gateway:** A fully-featured API management service with routing, authentication, throttling, caching, request validation, and custom domains. More complex but more powerful for production APIs.

### Q22: What happens when Lambda concurrency limit is reached?
**Answer:** When the concurrency limit is reached, new invocations are **throttled**:
- Synchronous: Returns 429 (TooManyRequestsException)
- Asynchronous: Events are queued and retried for up to 6 hours
- Stream-based: Lambda doesn't read more records until existing processing completes
You can request a concurrency limit increase through AWS Support.

### Q23: What is Lambda SnapStart?
**Answer:** Lambda SnapStart is a feature for Java functions that takes a snapshot of the initialized execution environment after the INIT phase. Subsequent cold starts restore from this snapshot instead of re-initializing, reducing cold start times from seconds to milliseconds. It's available for Java 11+ runtimes and is free to use.

---

## What's Next

In the next guide, we will:
- **Create our first Lambda function** step by step in the AWS Console
- Write and test 5 different Lambda functions (Hello World, process events, return HTML, read S3, write DynamoDB)
- Learn to test, configure, and monitor Lambda functions
- Deploy Lambda using the AWS CLI

👉 Continue to: **17. Create & Test Lambda Function**

---

> **Note:** This guide is part of a comprehensive AWS learning series. Practice each concept in your AWS account to build real understanding. Lambda is one of the most important AWS services for modern cloud applications.
