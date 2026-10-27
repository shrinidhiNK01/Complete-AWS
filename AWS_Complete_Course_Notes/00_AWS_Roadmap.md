# AWS Complete Study Path: Beginner to Advanced Roadmap

Welcome to the comprehensive AWS study documentation directory. This curriculum is designed to take you from a complete cloud beginner to an advanced cloud engineer, architect, developer, or data specialist. 

Each file in this folder contains in-depth explanations, diagrams, design patterns, CLI commands, configuration templates, and coding scripts written in simple, clear English.

---

## 🗺️ Curriculum and Index

*   [00. Ubuntu CLI Setup & environment Configuration](file:///d:/Notes/AWS_Complete_Course_Notes/00_Ubuntu_AWS_CLI_Setup.md)
    *   Installing AWS CLI v2 on Ubuntu
    *   Configuring Credentials and API profiles
    *   Setting up Python 3 & Boto3 virtual environments
    *   Installing HashiCorp Terraform on Ubuntu
    *   Executing scripts and applying IaC configurations
*   [01. Cloud Computing Fundamentals](file:///d:/Notes/AWS_Complete_Course_Notes/01_Cloud_Computing_Fundamentals.md)
    *   What is Cloud Computing? (On-Premises vs. Cloud)
    *   6 Advantages of Cloud Computing
    *   Cloud Service Models (IaaS, PaaS, SaaS)
    *   Deployment Models (Public, Private, Hybrid)
    *   Shared Responsibility Model (Security OF vs. IN the cloud)
    *   AWS Support Plans & Free Tier Details
*   [02. AWS Global Infrastructure](file:///d:/Notes/AWS_Complete_Course_Notes/02_AWS_Global_Infrastructure.md)
    *   Regions & Choosing a Region (Compliance, Latency, Features, Cost)
    *   Availability Zones (AZs) & High Availability Design
    *   Edge Locations & Amazon CloudFront Caching
    *   Specialized Zones (Local Zones, Wavelength Zones, AWS Outposts)
    *   The private AWS Global Network
*   [03. AWS IAM & Identity Management](file:///d:/Notes/AWS_Complete_Course_Notes/03_IAM.md)
    *   IAM Users, Groups, Roles, Policies, and Service-Linked Roles
    *   JSON Policies (Version, Sid, Effect, Principal, Action, Resource, Condition)
    *   JSON Policy Examples (S3 access, IP address restrictions)
    *   IAM Policy Evaluation Logic
    *   Permissions Boundaries & Service Control Policies (SCPs)
    *   IAM Identity Center (SSO) & Cognito (User/Identity Pools)
*   [04. EC2 Deep Dive & Compute Storage](file:///d:/Notes/AWS_Complete_Course_Notes/04_EC2.md)
    *   EC2 Families Naming & Sizing Cheat Sheet
    *   EC2 Purchasing Options (On-Demand, Savings Plans, RIs, Spot, Dedicated Hosts)
    *   Instance Metadata Service (IMDSv1 vs. Session-Oriented IMDSv2)
    *   User Data Bootstrap Scripting
    *   Stateful Security Groups
    *   Block Storage comparison (Instance Store vs. Persistent Network EBS)
    *   EBS SSD/HDD Volume Types (gp3, io2, st1, sc1)
    *   Amazon EFS Shared Linux Storage & AWS FSx (Windows, Lustre, NetApp)
*   [05. Amazon S3 Complete Guide](file:///d:/Notes/AWS_Complete_Course_Notes/05_S3.md)
    *   S3 Buckets, Objects, Keys, and Flat Structure
    *   S3 Storage Classes Comparison Table
    *   S3 Lifecycle Policies (Transitions and Expiration JSON)
    *   S3 Encryption (SSE-S3, SSE-KMS, SSE-C, Client-Side)
    *   S3 Bucket Policies (Enforce HTTPS-only JSON example)
    *   S3 Versioning, MFA Delete, Replication (CRR, SRR), Object Lock, S3 Select, and Transfer Acceleration
*   [06. VPC Complete Networking](file:///d:/Notes/AWS_Complete_Course_Notes/06_VPC.md)
    *   VPC CIDR Blocks & Subnetting (Public vs. Private)
    *   Internet Gateways (IGW) & NAT Gateways vs. NAT Instances
    *   Bastion Hosts vs. Systems Manager Session Manager
    *   Security Groups (Instance level/Stateful) vs. NACLs (Subnet level/Stateless/Ephemeral Ports)
    *   VPC Peering, Gateway Endpoints (S3/DynamoDB), Interface Endpoints (PrivateLink), and Flow Logs
*   [07. AWS Databases Complete](file:///d:/Notes/AWS_Complete_Course_Notes/07_Databases.md)
    *   RDS Managed Engines, Backups, Multi-AZ Failover, and Read Replicas
    *   Amazon Aurora Cloud-Native Architecture, Serverless v2, Global Database, and Multi-Master
    *   DynamoDB Serverless NoSQL, Partition/Sort Keys, LSIs, GSIs, Streams, DAX cache, and TTL
    *   ElastiCache In-Memory Cache (Redis vs. Memcached comparison)
*   [08. Elastic Load Balancing & Auto Scaling](file:///d:/Notes/AWS_Complete_Course_Notes/08_Load_Balancing_and_AutoScaling.md)
    *   Load Balancers (ALB - Layer 7, NLB - Layer 4, GWLB - Layer 3)
    *   Health Checks, Sticky Sessions, and SSL/TLS SNI
    *   Auto Scaling Groups (ASG) Min, Max, and Desired properties
    *   ASG Scaling Policies (Target Tracking, Simple/Step, Scheduled, Predictive)
    *   Launch Templates vs. Launch Configurations
    *   ASG Lifecycle Hooks (Pending/Terminating pauses)
*   [09. Serverless Architecture](file:///d:/Notes/AWS_Complete_Course_Notes/09_Serverless.md)
    *   AWS Lambda Triggers, Handlers, Memory, Timeouts, and /tmp storage
    *   Cold Starts, Warm Starts, and Provisioned Concurrency
    *   S3 Event Trigger Python Lambda Code Example
    *   API Gateway Types (REST, HTTP, WebSockets) & Throttling, Caching, CORS, and Authorizers
    *   EventBridge Event-Driven Buses, Rules, Targets, and Pipes
    *   Step Functions Workflows & ASL State Machine JSON Examples
*   [10. Containerization on AWS](file:///d:/Notes/AWS_Complete_Course_Notes/10_Containers.md)
    *   Docker & Kubernetes Core Concepts (Pod, Service, Deployment)
    *   Production-ready NodeJS Dockerfile Example
    *   Amazon ECR Registry Push/Pull Commands
    *   ECS Tasks, Task Definitions, Service Definitions, and EC2 vs. Fargate launch types
    *   EKS Managed Control Plane, Node Groups, Fargate Profiles, and K8s YAML manifest
*   [11. AWS Security Suite](file:///d:/Notes/AWS_Complete_Course_Notes/11_Security.md)
    *   AWS KMS Keys, Key Rotation, Envelope Encryption, and Key Policy JSON
    *   Secrets Manager vs. Parameter Store, Auto-Rotation, and Boto3 Python retrieval script
    *   AWS WAF (Layer 7 Rules) & AWS Shield DDoS Protection (Standard vs. Advanced)
    *   Continuous Auditing: GuardDuty, Security Hub, Inspector, and Macie
*   [12. Monitoring, Auditing, and Compliance](file:///d:/Notes/AWS_Complete_Course_Notes/12_Monitoring.md)
    *   CloudWatch Metrics (Agent for Memory), Logs Insights, and Alarms
    *   CloudTrail API auditing (Management, Data, and Insight events)
    *   AWS Config compliance rules, resource timelines, and automatic SSM remediations
*   [13. AWS DevOps & Infrastructure as Code (IaC)](file:///d:/Notes/AWS_Complete_Course_Notes/13_DevOps.md)
    *   CloudFormation Templates (YAML example, Change Sets, StackSets, Drift Detection)
    *   AWS CDK CLI commands & TypeScript construct code example
    *   AWS CodeSuite CI/CD (CodePipeline, CodeBuild buildspec.yml, CodeDeploy appspec.yml)
*   [14. AWS Analytics & Big Data](file:///d:/Notes/AWS_Complete_Course_Notes/14_Analytics_and_BigData.md)
    *   Kinesis Streaming (Data Streams, Firehose, Data Analytics, Video Streams)
    *   Serverless Analytics (Athena SQL on S3 & Glue ETL Catalog/Crawlers)
    *   Redshift Columnar Data Warehouse (OLAP vs. OLTP, Leader/Compute nodes)
    *   EMR (Hadoop/Spark), OpenSearch, and QuickSight BI
*   [15. AWS AI and Machine Learning](file:///d:/Notes/AWS_Complete_Course_Notes/15_AI_ML.md)
    *   Amazon Bedrock Generative AI, Custom FMs, RAG, and Agents
    *   Amazon SageMaker custom ML pipeline (Build, Train, Deploy)
    *   Pre-trained API Services (Rekognition, Comprehend, Polly, Lex, Transcribe, Translate)
*   [16. Advanced AWS Networking](file:///d:/Notes/AWS_Complete_Course_Notes/16_Advanced_Networking.md)
    *   Route 53 Hosted Zones & 7 DNS Routing Policies
    *   Hybrid Connectivity (Site-to-Site VPN vs. Direct Connect)
    *   Transit Gateway Hub-and-Spoke central routing topology
    *   AWS PrivateLink & Private VPC Endpoints
*   [17. Governance & Cost Optimization](file:///d:/Notes/AWS_Complete_Course_Notes/17_Cost_Optimization.md)
    *   AWS Well-Architected Framework: The 6 Pillars and Design Principles
    *   AWS Organizations, Consolidated Billing, and Service Control Policies (SCPs)
    *   AWS Control Tower Landing Zones and Account Factory
    *   Cost Optimization Strategies (Right-sizing, lifecycle, instance options, cleaning idle assets)
    *   Cost Explorer, Budgets, and Trusted Advisor
*   [18. AWS Advanced Topics, Architectures, and Interview Prep](file:///d:/Notes/AWS_Complete_Course_Notes/18_AWS_Interview_Questions.md)
    *   Solutions Architect Scenarios (RPO vs. RTO, Backup, Pilot Light, Warm Standby, Multi-Site)
    *   DevOps Deployment Strategies (In-place, Blue/Green, Canary)
    *   Production-ready Architecture Diagrams (3-Tier Web App & Serverless Event-Driven API)
    *   Comprehensive Interview Q&As (Beginner, Intermediate, Advanced)
