# 06. VPC Complete Networking: Subnets, NAT Gateways, NACLs, and Private Connectivity

A **Virtual Private Cloud (VPC)** is a private, isolated virtual network that you define in your AWS account. It gives you complete control over your network configuration, including IP address ranges, subnets, route tables, and network gateways.

---

## 1. VPC Core Components & CIDR Blocks
Before launching resources, you must define the IP address range for your VPC using a **CIDR (Classless Inter-Domain Routing) block**.

*   **CIDR Example:** `10.0.0.0/16`
    *   The `/16` means the first 16 bits of the IP address are fixed (`10.0`). The remaining bits can change.
    *   This provides **65,536** available IP addresses (ranging from `10.0.0.0` to `10.0.255.255`).
*   **Subnetting:** You split your large VPC network into smaller segments called **Subnets**. Each subnet resides in a single Availability Zone.
    *   *Public Subnet:* Connected to the internet (has a route to an Internet Gateway).
    *   *Private Subnet:* Isolated from the internet. Private databases and backends reside here.
*   **Reserved IPs:** In every subnet you create, AWS reserves the **first 4 and the last 1 IP addresses** for internal networking purposes (e.g., DNS, router, network mapping). For a `/24` subnet (256 IPs), only 251 are usable.

```
+-------------------------------------------------------------------------+
|                              AWS VPC (10.0.0.0/16)                      |
|                                                                         |
|  +---------------------------------+   +-----------------------------+  |
|  |     PUBLIC SUBNET (10.0.1.0/24)  |   | PRIVATE SUBNET (10.0.2.0/24)|  |
|  |                                 |   |                             |  |
|  |  [Bastion Host] [ALB]           |   |  [Private DB] [Backend]     |  |
|  |       |                         |   |       |                     |  |
|  +-------+-------------------------+   +-------+---------------------+  |
|          | (Routes to IGW)                     | (Routes to NAT GW)  |
|          v                                     v                     |
|  [Internet Gateway (IGW)]              [NAT Gateway]                 |
|          |                                     |                     |
+----------+-------------------------------------+---------------------+
           |                                     |
           +============ Public Internet ========+
```

---

## 2. Connecting to the Internet: IGW & NAT

To control traffic flow, VPCs use Gateways:

### 1. Internet Gateway (IGW)
*   **What it is:** A horizontally scaled, redundant VPC component that allows communication between instances in your VPC and the internet.
*   It performs Network Address Translation (NAT) for instances assigned with public IPs.
*   *Rule:* A subnet is only "Public" if its Route Table has an entry routing internet traffic (`0.0.0.0/0`) to the IGW.

### 2. NAT Gateway (Network Address Translation)
*   **What it is:** A managed service that allows instances in a **private subnet** to connect to the internet (e.g., to download software updates or call external APIs), but prevents external internet entities from initiating connections with those private instances.
*   **NAT Gateway vs. NAT Instance:**
    *   *NAT Instance:* A single EC2 instance configured to do NAT. Legacy option. Not highly available, you must manage and patch it yourself.
    *   *NAT Gateway:* A fully managed AWS service. Highly available, scales automatically up to 45 Gbps, and requires zero maintenance.
*   **Setup:** You must deploy the NAT Gateway in a **public subnet**, allocate an **Elastic IP (EIP)** to it, and route internet traffic (`0.0.0.0/0`) from your private subnet's Route Table to the NAT Gateway.

---

## 3. Security Groups vs. Network Access Control Lists (NACLs)

AWS secures your VPC at two different layers: the instance level (Security Groups) and the subnet level (NACLs).

| Feature | Security Group (Instance level) | Network ACL (Subnet level) |
| :--- | :--- | :--- |
| **Scope** | Operates at the instance/ENI layer. | Operates at the subnet boundary. |
| **State** | **Stateful:** Return traffic is automatically allowed. | **Stateless:** Return traffic must be explicitly allowed. |
| **Rules Support**| Supports **Allow** rules only. | Supports **Allow** and **Deny** rules. |
| **Evaluation** | All rules are evaluated before deciding to permit traffic. | Evaluated in number order (lowest number first, e.g., 100 before 200). |
| **Use Case** | Custom firewall rules for web servers or DBs. | Account-wide network blocklist (e.g., blocking malicious IP addresses). |

### Understanding Stateless NACLs and Ephemeral Ports
Because NACLs are **stateless**, you must configure rules for both incoming and outgoing directions.
*   If you allow inbound traffic on port 80 (HTTP), you must also allow outbound traffic on **Ephemeral Ports** (typically TCP ports 1024–65535) so that the server can send the response back to the client's temporary connection port.

---

## 4. Bastion Hosts (Jump Boxes)
*   **The Problem:** You have a backend database inside a private subnet. You need to SSH into it to perform queries or maintenance. However, since it's private, it has no public IP and cannot be reached from the internet.
*   **The Solution:** You launch a small EC2 instance (a **Bastion Host**) in a public subnet. The Bastion Host has a public IP.
*   **How you connect:** You SSH from your computer into the Bastion Host, and from the Bastion Host, you jump (SSH/connect) to the database inside the private subnet.
*   *Modern Alternative:* **AWS Systems Manager Session Manager** allows secure command-line access to private instances without needing a Bastion Host or keeping port 22 open on any firewall.

---

## 5. VPC Peering & VPC Endpoints (PrivateLink)

To connect VPCs to other networks or AWS services securely, use these technologies:

### 1. VPC Peering
*   Allows you to connect two VPCs directly via a routing connection.
*   Traffic travels entirely over the private AWS network, not the public internet.
*   **No Transitive Routing:** If VPC A is peered with VPC B, and VPC B is peered with VPC C, VPC A cannot talk to VPC C through VPC B. You must create a direct peer connection between VPC A and VPC C.
*   **CIDR Constraint:** You cannot peer VPCs if they have overlapping IP ranges (e.g., both use `10.0.0.0/16`).

### 2. VPC Endpoints (AWS PrivateLink)
By default, if an instance in a private subnet wants to download files from an S3 bucket or write data to DynamoDB, the traffic must travel out through the NAT Gateway and over the public internet to reach the public AWS service endpoints.
*   **VPC Endpoints** solve this by creating a private connection path within the AWS network.

There are two types of VPC Endpoints:
1.  **Gateway Endpoints:**
    *   Uses route table entries to direct traffic to S3 or DynamoDB.
    *   Free to use.
2.  **Interface Endpoints (AWS PrivateLink):**
    *   Creates a virtual network interface (ENI) with a private IP inside your subnet.
    *   Routes traffic to almost all other AWS services (e.g., EC2 APIs, Systems Manager, CloudWatch).
    *   Costs money per hour plus data processing fees.

---

## 6. VPC Flow Logs
*   A feature that captures IP traffic data going to and from network interfaces (ENIs) inside your VPC.
*   **Use Cases:**
    *   Troubleshooting connectivity issues (e.g., checking if security group rules are dropping traffic by looking for `REJECT` actions).
    *   Analyzing network traffic patterns and detecting malicious port scanning.
*   Flow Logs can be published directly to **Amazon CloudWatch Logs** or **Amazon S3** for analysis.



## 10. Interactive Hands-On Lab: Custom VPC Construction

Construct a secure VPC network isolating public web tiers from private database backends.

### A. AWS CLI v2 Operations
```bash
# 1. Create a custom VPC with a CIDR block
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=Custom-Prod-VPC}]'

# 2. Create a Public Subnet (10.0.1.0/24)
aws ec2 create-subnet --vpc-id vpc-0123456789abcdef0 --cidr-block 10.0.1.0/24 --availability-zone us-east-1a

# 3. Create an Internet Gateway
aws ec2 create-internet-gateway

# 4. Attach Gateway to VPC
aws ec2 attach-internet-gateway --vpc-id vpc-0123456789abcdef0 --internet-gateway-id igw-0987654321fedcba0

# 5. Route all public web traffic to the Gateway
aws ec2 create-route --route-table-id rtb-01122334455667788 --destination-cidr-block 0.0.0.0/0 --gateway-id igw-0987654321fedcba0
```

### B. Python Boto3 SDK Script
```python
import boto3

ec2_client = boto3.client('ec2', region_name='us-east-1')

def build_vpc_infrastructure():
    # Create VPC
    vpc = ec2_client.create_vpc(CidrBlock='10.20.0.0/16')
    vpc_id = vpc['Vpc']['VpcId']
    print(f"VPC Created: {vpc_id}")
    
    # Tag VPC
    ec2_client.create_tags(Resources=[vpc_id], Tags=[{'Key': 'Name', 'Value': 'Boto3-VPC'}])
    
    # Create Subnet
    subnet = ec2_client.create_subnet(VpcId=vpc_id, CidrBlock='10.20.1.0/24')
    subnet_id = subnet['Subnet']['SubnetId']
    print(f"Subnet Created: {subnet_id}")
    
    return vpc_id, subnet_id

if __name__ == '__main__':
    build_vpc_infrastructure()
```

### C. Terraform IaC Configuration
```hcl
resource "aws_vpc" "prod_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "TF-VPC-Production"
  }
}

resource "aws_subnet" "public_tier" {
  vpc_id                  = aws_vpc.prod_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "TF-Subnet-Public"
  }
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.prod_vpc.id
}
```
