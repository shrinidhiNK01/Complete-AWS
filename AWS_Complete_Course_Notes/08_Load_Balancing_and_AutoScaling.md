# 08. High Availability: Elastic Load Balancing (ELB) and Auto Scaling

To build systems that can scale to millions of users and handle physical server failures without crashing, you must use **Elastic Load Balancing (ELB)** and **Auto Scaling Groups (ASG)** together.

---

## 1. Elastic Load Balancing (ELB) Overview
A **Load Balancer** is a server that sits in front of your applications, receives incoming internet traffic, and distributes it across a group of backend servers (like EC2 instances, containers, or Lambda functions).

*   **Purpose:** Preventions of single server overloads, handles health check management, and provides SSL/TLS termination.
*   **High Availability:** ELB is a managed service that automatically scales and runs across multiple Availability Zones.

---

## 2. Load Balancer Types (ALB vs. NLB vs. GWLB)

AWS provides three main types of modern load balancers, operating at different layers of the OSI model:

```
  ALB (Layer 7 - HTTP/HTTPS)          NLB (Layer 4 - TCP/UDP)          GWLB (Layer 3 - IP Packets)
  --------------------------          -----------------------          ---------------------------
[Client] -> [Path /api] -> VM 1    [Client] -> [Port 5000] -> VM 1   [Client] -> [Firewall VM] -> Target
[Client] -> [Path /web] -> VM 2    [Client] -> [Port 8000] -> VM 2
```

### 1. Application Load Balancer (ALB)
*   **Layer:** Layer 7 (Application Layer) - HTTP, HTTPS, and HTTP/2.
*   **Routing Logic:** Can inspect the content of the request. It routes traffic based on:
    *   *Path routing:* e.g., send `/api/*` to the backend cluster, and `/images/*` to an S3 bucket.
    *   *Host routing:* e.g., send requests to `billing.app.com` to one group, and `app.com` to another.
    *   *Query string / Headers:* e.g., send mobile requests to mobile-optimized servers.
*   **Use Cases:** Microservices, web applications, containerized services (ECS/EKS).
*   **Target Types:** EC2 instances, ECS tasks, Lambda functions, or private IP addresses.

### 2. Network Load Balancer (NLB)
*   **Layer:** Layer 4 (Transport Layer) - TCP, UDP, and TLS.
*   **Performance:** Designed for ultra-high performance, low latency (under 10ms), and can handle **millions of requests per second** (extreme traffic spikes).
*   **Static IP:** Unlike ALB (which has dynamic DNS addresses), an NLB provides a **Static IP address per Availability Zone**, and can be assigned an Elastic IP.
*   **Use Cases:** Video streaming, gaming backends, TCP protocols, database clusters.

### 3. Gateway Load Balancer (GWLB)
*   **Layer:** Layer 3 (Network Layer) - IP packets.
*   **Purpose:** Deploy, scale, and manage virtual security appliances (such as firewalls, intrusion detection and prevention systems (IDS/IPS), and deep packet inspection systems).
*   **Traffic flow:** It routes all traffic through a fleet of virtual appliances for inspection before routing it to the final destination.

---

## 3. Load Balancer Features

### Health Checks
The load balancer continuously sends periodic requests (health checks) to its registered targets. If a target fails to respond (or returns a server error), the load balancer flags it as "unhealthy" and stops sending client traffic to it. Once the target recovers, the load balancer resumes routing traffic.

### Sticky Sessions (Session Affinity)
*   Normally, a load balancer routes requests to different backend servers round-robin style (Request 1 to Server A, Request 2 to Server B).
*   If your app saves login state on the server (session state), this breaks the user experience.
*   **Sticky Sessions** force the load balancer to bind a user’s session to a specific backend server using a cookie, ensuring all their subsequent requests go to that same server.

### SSL Termination and SNI (Server Name Indication)
*   You can load an SSL/TLS certificate onto your load balancer. The load balancer decrypts incoming HTTPS traffic from clients, and forwards it to backend servers as plain HTTP. This saves CPU compute on your EC2 instances.
*   **SNI (Server Name Indication):** Allows a single load balancer to host multiple SSL certificates for different domain names (e.g., `siteA.com` and `siteB.com`) using one public IP address.

---

## 4. Auto Scaling Groups (ASG)
An **Auto Scaling Group** is a logical collection of EC2 instances that automatically shrinks or grows to maintain application performance and optimize costs.

```
       +--------------------------------------------+
       |            Auto Scaling Group              |
       |                                            |
       |  Min: 1      Desired: 2      Max: 5        |
       |                                            |
       |  +------------+             +------------+ |
       |  |  Instance  |             |  Instance  | |  [New instance spun up
       |  |   (AZ-A)   |             |   (AZ-B)   | |   during scaling event]
       |  +------------+             +------------+ |
       +--------------------------------------------+
```

### Key ASG Properties:
*   **Minimum Size:** The lowest number of instances your ASG will shrink to.
*   **Maximum Size:** The absolute limit of instances your ASG can scale up to.
*   **Desired Capacity:** The target number of instances. If not specified, it defaults to the Minimum. If an instance crashes, the ASG will spin up a new one to match the Desired capacity.

---

## 5. Scaling Policies
How does the ASG know when to launch or terminate instances? You configure scaling policies:

1.  **Target Tracking Scaling:**
    *   *How it works:* You choose a metric (e.g., Average CPU utilization) and a target value (e.g., 50%). The ASG automatically launches/terminates instances to keep the metric at that value.
    *   *Example:* "Keep average CPU at 60%."
2.  **Simple Scaling / Step Scaling:**
    *   *How it works:* Triggered by a CloudWatch Alarm. You define specific steps.
    *   *Example:* "If CPU utilization is > 80% for 5 minutes, add 2 instances. If CPU is > 90%, add 4 instances."
3.  **Scheduled Scaling:**
    *   *How it works:* Scales instances based on known time patterns.
    *   *Example:* "Every Friday at 5:00 PM (before weekend shoppers), scale up to 10 instances. On Monday at 8:00 AM, scale back to 2."
4.  **Predictive Scaling:**
    *   Uses Machine Learning to analyze your historical traffic patterns and forecasts demand. It launches instances *before* a traffic spike happens.

---

## 6. Launch Templates vs. Launch Configurations

To launch instances, the ASG needs a blueprint defining the AMI, instance type, security groups, key pairs, and User Data.

*   **Launch Configurations (Legacy):** Deprecated. You cannot modify them after creation. If you want to change the instance type, you must create a new Launch Configuration and re-link the ASG.
*   **Launch Templates (Modern/Recommended):** 
    *   Supports version control (e.g., Version 1, Version 2).
    *   Allows mixing Spot and On-Demand instances in the same ASG.
    *   Supports multiple instance families (e.g., launch `t3.micro` or `t3.small` depending on availability).
    *   Required to launch newer instance types and use advanced features.

---

## 7. ASG Lifecycle Hooks
*   **What it is:** A feature that pauses an instance as it transitions from launching or terminating.
*   **Use Case:**
    *   *On Launch:* You pause the instance in a `Pending:Wait` state while custom scripts install software, run self-tests, and verify setup before the instance starts receiving user traffic.
    *   *On Terminate:* You pause the instance in a `Terminating:Wait` state. This gives you time to extract application log files, back up local state, or drain connection queues before the virtual machine is completely deleted.
