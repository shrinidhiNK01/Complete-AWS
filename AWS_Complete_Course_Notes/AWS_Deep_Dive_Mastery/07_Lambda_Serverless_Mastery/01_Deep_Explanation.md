# Deep Explanation: AWS Lambda

## 1. Complete Overview
AWS Lambda is one of the most critical services in AWS. Event-driven compute, Triggers, Layers, IAM roles, API Gateway integration.

### Under the Hood
When you provision AWS Lambda, AWS allocates physical resources in its highly secure data centers. 
You are essentially renting these resources via a hypervisor (like Nitro) or abstraction layer.

### Core Components
1. **Control Plane:** The API endpoints you interact with (Console, CLI, SDK).
2. **Data Plane:** The actual underlying infrastructure doing the work.

### Best Practices
- Always follow the Principle of Least Privilege.
- Monitor usage using CloudWatch.
- Implement tagging for cost allocation.

## 2. Advanced Architecture Concepts
When designing with AWS Lambda, you must consider:
- **High Availability (HA):** Deploying across multiple Availability Zones.
- **Fault Tolerance:** Designing the system to continue operating even if components fail.
- **Scalability:** Vertical (scaling up) and Horizontal (scaling out).
