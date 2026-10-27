# Deep Explanation: EC2 (Elastic Compute Cloud)

## 1. Complete Overview
EC2 (Elastic Compute Cloud) is one of the most critical services in AWS. Instances, AMIs, EBS, Security Groups, Key Pairs, User Data.

### Under the Hood
When you provision EC2 (Elastic Compute Cloud), AWS allocates physical resources in its highly secure data centers. 
You are essentially renting these resources via a hypervisor (like Nitro) or abstraction layer.

### Core Components
1. **Control Plane:** The API endpoints you interact with (Console, CLI, SDK).
2. **Data Plane:** The actual underlying infrastructure doing the work.

### Best Practices
- Always follow the Principle of Least Privilege.
- Monitor usage using CloudWatch.
- Implement tagging for cost allocation.

## 2. Advanced Architecture Concepts
When designing with EC2 (Elastic Compute Cloud), you must consider:
- **High Availability (HA):** Deploying across multiple Availability Zones.
- **Fault Tolerance:** Designing the system to continue operating even if components fail.
- **Scalability:** Vertical (scaling up) and Horizontal (scaling out).
