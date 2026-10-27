# 12. Monitoring, Auditing, and Compliance: CloudWatch, CloudTrail, and AWS Config

To maintain application performance, fix bugs, and ensure security compliance, you must understand how to monitor (CloudWatch), audit (CloudTrail), and track resource changes (AWS Config).

---

## 1. Amazon CloudWatch: Application & Infrastructure Monitoring
Amazon CloudWatch provides monitoring data and actionable insights to watch your applications, respond to system-wide performance changes, and optimize resource utilization.

```
+-------------------------------------------------------------------------+
|                            AMAZON CLOUDWATCH                            |
|                                                                         |
|  [ METRICS ] -------------> [ ALARMS ] -------------> [ ACTIONS ]        |
|  - CPU Utilization          - CPU > 80%?              - Auto Scale      |
|  - Custom Log Errors                                  - Send SNS Email  |
|                                                                         |
|  [ LOGS ] ----------------> [ INSIGHTS ] -----------> [ DASHBOARDS ]     |
|  - /var/log/messages        - Query logs in seconds   - View CPU/Errors |
+-------------------------------------------------------------------------+
```

### 1. CloudWatch Metrics
*   **Standard Metrics:** AWS services automatically send metrics to CloudWatch (e.g., EC2 sends CPU utilization, Disk Reads, Network In; S3 sends Bucket Size).
*   **Custom Metrics:** Metrics sent from your own code (e.g., number of active users, items added to shopping carts).
*   *Memory Constraint:* By default, **EC2 does not send memory (RAM) utilization** to CloudWatch because memory is inside the guest OS (which AWS has no access to under the Shared Responsibility Model). To collect memory usage, you must install the **CloudWatch Agent** on the EC2 instance.
*   **Resolution:** Standard resolution is 1-minute intervals. High-resolution metrics can collect data down to 1-second intervals.

### 2. CloudWatch Logs
*   **Log Group:** A collection of logs that share the same retention, monitoring, and access control settings.
*   **Log Stream:** A sequence of log events that share the same source (e.g., logs from a specific EC2 instance or a specific Lambda container).
*   **CloudWatch Logs Insights:** A query tool that allows you to search log groups using a SQL-like syntax (e.g., searching for `ERROR` strings in application logs).

### 3. CloudWatch Alarms
Alarms watch a single metric over a specified time period and perform actions:
*   *EC2 Actions:* Stop, terminate, reboot, or recover instances.
*   *Auto Scaling Actions:* Trigger an ASG to scale out or scale in.
*   *Notification Actions:* Send an email or text alert using **Amazon SNS (Simple Notification Service)**.

### 4. CloudWatch Insights
*   **Container Insights:** Collects, aggregates, and summarizes metrics and logs from containerized apps (ECS, EKS, Kubernetes).
*   **Lambda Insights:** Simplifies monitoring and troubleshooting for serverless functions, collecting memory usage, CPU, and network performance per execution.

---

## 2. AWS CloudTrail: API Auditing and Governance
AWS CloudTrail is a service that enables governance, compliance, operational auditing, and risk auditing of your AWS account.

> **Key Rule:** CloudTrail records **WHO** did **WHAT** in your AWS account. Every button clicked in the console, every CLI command run, and every API call made from code is recorded as a log event.

### CloudTrail Event Types:
1.  **Management Events:**
    *   Logged by default. Actions performed on resources in your AWS account (e.g., creating an S3 bucket, starting an EC2 instance, attaching an IAM policy).
2.  **Data Events:**
    *   Not logged by default (must be enabled manually). High-volume operations performed *within* a resource (e.g., S3 object-level APIs like `GetObject` or `PutObject`, Lambda function invocations).
3.  **Insight Events:**
    *   Helps identify unusual API activity (e.g., a sudden surge in IAM API calls or a spike in EC2 terminations).

### Key Features:
*   **S3 Delivery:** CloudTrail packages log files and delivers them to an S3 bucket for long-term storage.
*   **Log File Validation:** Uses cryptographic signatures to verify that logs have not been modified, deleted, or tampered with since CloudTrail wrote them.
*   **Multi-Region Trails:** A trail can be configured to record events from all AWS Regions, delivering them to a single central S3 bucket.

---

## 3. AWS Config: Configuration Compliance & Tracking
AWS Config is a service that enables you to assess, audit, and evaluate the configurations of your AWS resources.

```
[ Resource Created ] -> [ Config Records Event ] -> [ Evaluates Rules ] -> [ Mark Non-Compliant ]
                                                                                   |
                                                                           [ Auto-Remediate ]
```

### Core Features:
*   **Configuration Recorder:** Records resource details whenever they are created, updated, or deleted (e.g., tracking the configuration history of a Security Group over the last 6 months).
*   **Config Rules:** Pre-built or custom rules to evaluate if your resource configurations match corporate standards.
    *   *Example Rules:*
        *   `s3-bucket-public-read-prohibited`: Verifies S3 buckets are not public.
        *   `instances-in-vpc`: Ensures all EC2 instances are in a VPC.
        *   `iam-password-policy`: Ensures password policy meets security requirements.
*   **Remediation:** If a resource violates a rule (e.g., an S3 bucket is public), AWS Config can trigger an automatic remediation action using an **AWS Systems Manager (SSM) Automation Document** (e.g., immediately block public access on the bucket).
*   **Conformance Packs:** A collection of AWS Config rules and remediation actions that you can deploy as a single entity across an entire organization (e.g., a Conformance Pack for PCI-DSS compliance).
