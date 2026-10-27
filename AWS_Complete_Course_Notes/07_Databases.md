# 07. AWS Database Services: RDS, Aurora, DynamoDB, and ElastiCache

AWS provides a variety of purpose-built database services designed to meet different application workloads. This guide covers relational options (**RDS** and **Aurora**), NoSQL (**DynamoDB**), and in-memory caches (**ElastiCache**).

---

## 1. Amazon RDS Complete (Relational Database Service)
Amazon RDS is a managed service that makes it easy to set up, operate, and scale relational databases in the cloud. It supports six database engines: **Amazon Aurora, PostgreSQL, MySQL, MariaDB, Oracle, and Microsoft SQL Server**.

### RDS Architecture Options: Multi-AZ vs. Read Replicas

```
+-----------------------------------------------------------------------------------------+
|                                  RDS DB CLUSTER DESIGN                                  |
|                                                                                         |
|      Availability Zone A (Active)                     Availability Zone B (Standby)     |
|      +--------------------------+                     +--------------------------+      |
|      |    Primary Database      |== Sync Replication =|     Standby Database     |      |
|      |        (Read/Write)      |                     |        (Disaster Rec)    |      |
|      +--------------------------+                     +--------------------------+      |
|                   |                                                                     |
|            Async Replication                                                            |
|                   v                                                                     |
|      +--------------------------+                                                       |
|      |       Read Replica       | (Read Scaling)                                        |
|      +--------------------------+                                                       |
+-----------------------------------------------------------------------------------------+
```

#### Multi-AZ Deployment (High Availability & Disaster Recovery)
*   **How it works:** RDS automatically provisions and maintains a synchronous standby replica in a different Availability Zone.
*   **Behavior:** All database writes are synchronously copied to the standby database. If the primary instance goes offline (due to hardware failure, AZ outage, or database patching), RDS performs an automatic failover to the standby instance.
*   **Purpose:** Minimizes downtime. The connection endpoint (DNS) remains the same. *No code change is required.*
*   *Note:* The standby instance is purely for failover. You **cannot** connect to it to run read queries.

#### Read Replicas (Scalability & Performance)
*   **How it works:** RDS creates one or more read-only copies of your database. Updates to the replica are copied asynchronously from the primary instance.
*   **Purpose:** Offloads read traffic from the primary database (e.g., for reporting tools, analytical dashboards, search pages). You can have up to 15 read replicas.
*   **Cross-Region Read Replicas:** You can place read replicas in other AWS Regions to serve low-latency read traffic to local users and act as a disaster recovery point.
*   **Scale:** Read replicas can be promoted to become independent primary databases.

### Backup Options
1.  **Automated Backups:** Daily full backups plus transaction logs. Allows Point-in-Time recovery (PITR) to any second within your retention period (up to 35 days). Backups are saved in S3.
2.  **Manual Snapshots:** User-triggered database backups. Saved indefinitely until explicitly deleted.

---

## 2. Amazon Aurora (Cloud-Native Relational Database)
Amazon Aurora is a MySQL and PostgreSQL-compatible relational database built specifically for the cloud.

### Key Aurora Advantages:
*   **Performance:** Up to 5x faster than standard MySQL and 3x faster than standard PostgreSQL.
*   **Storage Design:** Aurora stores data in a shared storage volume that automatically replicates your data **6 times across 3 Availability Zones**. Aurora can tolerate the loss of up to 2 data copies without affecting write availability, and up to 3 copies without affecting read availability.
*   **Storage Auto-scaling:** Storage grows automatically from 10 GB up to 128 TB as needed, requiring no manual provisioning.

### Specialized Aurora Architectures:
*   **Aurora Serverless v2:** Automatically scales database capacity (in fractions of a second) up or down based on real-time application load. Excellent for workloads with highly variable or unpredictable traffic, saving massive costs.
*   **Aurora Global Database:** Replicates your database across up to 5 AWS regions with latency under 1 second. Useful for fast local reads globally and rapid cross-region disaster recovery.
*   **Aurora Multi-Master:** Allows multiple database instances in a cluster to act as read-write nodes. If one node fails, other nodes handle writes with zero application disruption.

---

## 3. Amazon DynamoDB Complete (Serverless NoSQL)
Amazon DynamoDB is a fully managed, serverless NoSQL database service that provides fast and predictable single-digit millisecond latency performance at any scale.

### Key Concepts:
*   **Tables & Items:** Tables contain Items (rows). Items contain Attributes (columns).
*   **Schema-less:** Items in a table do not need to share the same attributes, except for the primary key.
*   **Primary Key Types:**
    1.  **Partition Key (PK) Only:** A single attribute (e.g., `UserID`). DynamoDB hashes the PK to determine which physical partition to store the item in. The PK must be unique.
    2.  **Partition Key + Sort Key (SK):** A composite key (e.g., `UserID` (PK) + `OrderDate` (SK)). Multiple items can share the same PK, but must have different SKs. This allows sorting and querying files efficiently.

### Secondary Indexes (For Query Flexibility)
By default, you can only query DynamoDB items using the primary keys. To query on other attributes, you must build indexes:
*   **Local Secondary Index (LSI):** Uses the *same Partition Key* as the table, but a *different Sort Key*. Must be created when the table is created. Can query data inside a single partition.
*   **Global Secondary Index (GSI):** Uses a *different Partition Key* and a *different Sort Key*. Can be created or deleted at any time. Can query data across all partitions.

### DynamoDB Advanced Features:
*   **DynamoDB Streams:** Captures item-level modifications (insert, update, delete) in your table in real-time. Can trigger an AWS Lambda function to perform actions (e.g., send a welcome email when a user item is added to the table).
*   **DynamoDB Accelerator (DAX):** A fully managed, highly available, in-memory cache for DynamoDB. It reduces response times from single-digit milliseconds to **microseconds** (sub-millisecond). Excellent for read-heavy tables with high-velocity requests.
*   **Time To Live (TTL):** Automatically deletes items from the table after a specific timestamp, at no cost. Ideal for logs, session states, and temporary data.

---

## 4. Amazon ElastiCache (In-Memory Caching)
Amazon ElastiCache is a managed in-memory data store and cache service. It sits between your application and database to store frequently queried data, reducing database load and speeding up page response times.

### Redis vs. Memcached

| Feature | ElastiCache Redis | ElastiCache Memcached |
| :--- | :--- | :--- |
| **Data Types** | Complex data structures (lists, sets, hashes, sorted sets). | Simple key-value store. |
| **Architecture** | Multi-AZ with Auto-Failover. Support for read replicas. | Multi-node, partitioning across nodes. No replication. |
| **Persistence** | Supported (data can be saved to disk). | In-memory only (lost on restart). |
| **Threading** | Single-threaded. | Multi-threaded (can scale with more CPUs). |
| **Pub/Sub** | Fully supported. | Not supported. |
| **Use Case** | Real-time leaderboards, session store, database caching with high availability. | Simple, fast key-value cache to offload basic database queries. |



## 10. Interactive Hands-On Lab: RDS & DynamoDB Management

Interact with SQL (RDS PostgreSQL) and NoSQL (DynamoDB) store solutions.

### A. AWS CLI v2 Operations
```bash
# 1. Create a DynamoDB table with a Partition Key (UserId)
aws dynamodb create-table \
    --table-name UserProfileTable \
    --attribute-definitions AttributeName=UserId,AttributeType=S \
    --key-schema AttributeName=UserId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

# 2. Insert a document/record item into the table
aws dynamodb put-item \
    --table-name UserProfileTable \
    --item '{"UserId": {"S": "user_id_101"}, "Email": {"S": "dev@notes.com"}, "Access": {"S": "Admin"}}'

# 3. Retrieve the record
aws dynamodb get-item --table-name UserProfileTable --key '{"UserId": {"S": "user_id_101"}}'
```

### B. Python Boto3 SDK Script (DynamoDB)
```python
import boto3

db_resource = boto3.resource('dynamodb', region_name='us-east-1')

def write_and_query_items():
    table = db_resource.Table('UserProfileTable')
    
    # Put Item
    print("Writing item...")
    table.put_item(
        Item={
            'UserId': 'user_id_202',
            'Email': 'shrinidhi@notes.com',
            'Status': 'Active'
        }
    )
    
    # Get Item
    print("Reading item back...")
    response = table.get_item(Key={'UserId': 'user_id_202'})
    print("Retrieved Data:", response.get('Item'))

if __name__ == '__main__':
    write_and_query_items()
```

### C. Terraform IaC Configuration
```hcl
resource "aws_dynamodb_table" "profile_table" {
  name           = "tf-user-profiles"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "UserId"

  attribute {
    name = "UserId"
    type = "S"
  }

  tags = {
    Environment = "production"
  }
}

resource "aws_db_instance" "postgres_db" {
  allocated_storage    = 20
  db_name              = "production_db"
  engine               = "postgres"
  engine_version       = "15.3"
  instance_class       = "db.t3.micro"
  username             = "postgres"
  password             = "SecurePassword123!"
  skip_final_snapshot  = true
}
```
