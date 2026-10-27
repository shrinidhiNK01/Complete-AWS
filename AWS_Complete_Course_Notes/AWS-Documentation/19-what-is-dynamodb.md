# 📦 Chapter 19: What is Amazon DynamoDB?

---

## 📋 Table of Contents

1. [What You'll Learn](#what-youll-learn)
2. [Prerequisites](#prerequisites)
3. [What is DynamoDB?](#what-is-dynamodb)
4. [SQL vs NoSQL](#sql-vs-nosql)
5. [Types of NoSQL Databases](#types-of-nosql-databases)
6. [DynamoDB Key Concepts](#dynamodb-key-concepts)
7. [Data Types in DynamoDB](#data-types-in-dynamodb)
8. [Read/Write Capacity](#readwrite-capacity)
9. [Consistency Models](#consistency-models)
10. [DynamoDB Operations](#dynamodb-operations)
11. [DynamoDB Streams](#dynamodb-streams)
12. [DynamoDB Transactions](#dynamodb-transactions)
13. [DAX - DynamoDB Accelerator](#dax---dynamodb-accelerator)
14. [TTL - Time to Live](#ttl---time-to-live)
15. [Global Tables](#global-tables)
16. [Pricing](#pricing)
17. [DynamoDB vs RDS vs Aurora](#dynamodb-vs-rds-vs-aurora)
18. [Best Practices](#best-practices)
19. [Single-Table Design](#single-table-design)
20. [Real-World Use Cases](#real-world-use-cases)
21. [Hands-On Practice](#hands-on-practice)
22. [Common Mistakes](#common-mistakes)
23. [Quick Summary](#quick-summary)
24. [Interview Questions](#interview-questions)
25. [What's Next](#whats-next)

---

## 🎯 What You'll Learn

After completing this chapter, you will understand:

- What DynamoDB is and when to use it
- The difference between SQL and NoSQL databases
- All four types of NoSQL databases
- DynamoDB core concepts: Tables, Items, Attributes, Primary Keys, Indexes
- Every DynamoDB data type with examples
- How Read/Write Capacity works (with math calculations)
- Eventually Consistent vs Strongly Consistent reads
- All CRUD operations with CLI and SDK examples
- Advanced features: Streams, Transactions, DAX, TTL, Global Tables
- Pricing model and free tier details
- Best practices for partition key design and single-table design
- 20+ interview questions with detailed answers

---

## 📚 Prerequisites

Before starting this chapter, you should know:

- **AWS Account** — Free tier is enough for all exercises
- **Basic JSON** — DynamoDB stores data as JSON-like documents
- **AWS CLI installed** — We'll use CLI commands for practice
- **Chapter 1-3** — Basic AWS concepts (Regions, IAM, etc.)

---

## 🗄️ What is DynamoDB?

### The Simple Analogy

Imagine you have a **super-fast filing cabinet** that:

- **Never runs out of drawers** — You can add as many files as you want
- **Finds any file in milliseconds** — No matter if you have 10 files or 10 billion files
- **Never breaks down** — It's always available, 24/7, 365 days
- **Makes copies automatically** — Your files are stored in 3 different locations
- **Grows and shrinks on its own** — Adds more drawers when busy, removes when quiet

That's **Amazon DynamoDB** — a fully managed NoSQL database service.

### Official Definition

> **Amazon DynamoDB** is a fully managed, serverless, key-value and document NoSQL database designed to run high-performance applications at any scale. It delivers single-digit millisecond performance with built-in security, backup and restore, and in-memory caching.

### Key Characteristics

```
┌─────────────────────────────────────────────────────────┐
│                    DynamoDB Features                     │
├─────────────────────────────────────────────────────────┤
│  ✅ Fully Managed    — AWS handles everything           │
│  ✅ Serverless       — No servers to provision          │
│  ✅ Fast             — Single-digit millisecond latency  │
│  ✅ Scalable         — Handles trillions of requests     │
│  ✅ Durable          — Data replicated across 3 AZs      │
│  ✅ Secure           — Encryption at rest and in transit  │
│  ✅ Event-driven     — Streams trigger Lambda functions   │
│  ✅ Global           — Multi-region replication           │
└─────────────────────────────────────────────────────────┘
```

### When to Use DynamoDB

| ✅ Good For | ❌ Not Good For |
|---|---|
| Key-value lookups | Complex JOIN queries |
| High-speed reads/writes | Ad-hoc SQL analytics |
| Gaming leaderboards | Reporting dashboards |
| Session management | Relational data with many relationships |
| IoT data ingestion | Small datasets that need complex queries |
| Shopping carts | Data that requires ACID across tables |
| User profiles | Full-text search (use OpenSearch) |

---

## 🔄 SQL vs NoSQL

### What's the Difference?

Think of it like this:

- **SQL (Relational)** = An Excel spreadsheet with strict columns. Every row MUST have the same columns.
- **NoSQL (Non-Relational)** = A folder of sticky notes. Each note can have different information.

### Detailed Comparison Table

| Feature | SQL (RDS/Aurora) | NoSQL (DynamoDB) |
|---|---|---|
| **Data Model** | Tables with rows and columns | Tables with items and attributes |
| **Schema** | Fixed schema (defined upfront) | Flexible schema (each item can differ) |
| **Query Language** | SQL (SELECT, JOIN, WHERE) | API-based (GetItem, Query, Scan) |
| **Relationships** | JOINs across tables | Denormalized (data duplication) |
| **Scaling** | Vertical (bigger server) | Horizontal (add more partitions) |
| **Transactions** | Full ACID support | Limited ACID (within 100 items) |
| **Performance** | Varies with query complexity | Consistent single-digit ms |
| **Cost Model** | Pay per instance (always running) | Pay per request or capacity |
| **Best For** | Complex queries, reports | High-speed, high-scale apps |
| **Schema Changes** | ALTER TABLE (can be painful) | Just add new attributes |
| **Data Integrity** | Foreign keys, constraints | Application-level validation |
| **Max Item Size** | Row size varies by engine | 400 KB per item |

### SQL Query vs DynamoDB Operation

```sql
-- SQL: Get user by ID
SELECT * FROM Users WHERE user_id = 'U001';

-- SQL: Get all orders for a user
SELECT * FROM Orders WHERE user_id = 'U001' ORDER BY order_date DESC;
```

```javascript
// DynamoDB: Get user by ID
const params = {
  TableName: 'Users',
  Key: { user_id: { S: 'U001' } }
};
dynamodb.getItem(params);

// DynamoDB: Get all orders for a user
const params = {
  TableName: 'Orders',
  KeyConditionExpression: 'user_id = :uid',
  ExpressionAttributeValues: { ':uid': { S: 'U001' } },
  ScanIndexForward: false  // Sort descending
};
dynamodb.query(params);
```

---

## 📊 Types of NoSQL Databases

There are **4 main types** of NoSQL databases. DynamoDB is primarily a **Key-Value** store that also supports **Document** style.

### 1. Key-Value Store

```
┌─────────────────────────────────────┐
│         Key-Value Store             │
│                                     │
│   Key        →    Value             │
│   ─────          ──────             │
│   "user:1"   →   {name: "Amit"}    │
│   "user:2"   →   {name: "Priya"}   │
│   "session:x"→   {token: "abc123"} │
│                                     │
│   Think: Dictionary / HashMap       │
│                                     │
│   Examples: DynamoDB, Redis,        │
│             Memcached               │
└─────────────────────────────────────┘
```

**How it works:** You store a VALUE and retrieve it using a unique KEY. Super fast because it's a direct lookup — no scanning needed.

**Best for:** Session storage, caching, user profiles, shopping carts.

### 2. Document Store

```
┌─────────────────────────────────────┐
│         Document Store              │
│                                     │
│   {                                 │
│     "_id": "order_001",             │
│     "customer": "Amit",             │
│     "items": [                      │
│       {"name": "Laptop", "qty": 1}, │
│       {"name": "Mouse", "qty": 2}   │
│     ],                              │
│     "total": 55000                  │
│   }                                 │
│                                     │
│   Think: JSON files in a folder     │
│                                     │
│   Examples: MongoDB, CouchDB,       │
│             DynamoDB (document mode) │
└─────────────────────────────────────┘
```

**How it works:** Stores data as JSON/BSON documents. Each document can have a different structure. You can query on any field inside the document.

**Best for:** Content management, catalogs, user profiles with varying attributes.

### 3. Column-Family Store

```
┌──────────────────────────────────────────┐
│         Column-Family Store              │
│                                          │
│   Row Key: "user:1"                      │
│   ┌──────────────┬───────────────┐       │
│   │ Personal     │ Activity      │       │
│   ├──────────────┼───────────────┤       │
│   │ name: Amit   │ login: 10:30  │       │
│   │ age: 28      │ page: /home   │       │
│   │ city: Delhi  │               │       │
│   └──────────────┴───────────────┘       │
│                                          │
│   Think: Spreadsheet with column groups  │
│                                          │
│   Examples: Apache Cassandra, HBase      │
└──────────────────────────────────────────┘
```

**How it works:** Data is organized into column families (groups of columns). Each row can have different columns. Optimized for reading/writing large datasets.

**Best for:** Time-series data, event logging, analytics at massive scale.

### 4. Graph Database

```
┌─────────────────────────────────────────────┐
│          Graph Database                      │
│                                              │
│    [Amit] ──FRIENDS_WITH──→ [Priya]         │
│      │                        │              │
│    WORKS_AT                WORKS_AT           │
│      │                        │              │
│      ▼                        ▼              │
│   [Google]               [Amazon]            │
│      │                                       │
│   LOCATED_IN                                 │
│      │                                       │
│      ▼                                       │
│   [Bangalore]                                │
│                                              │
│   Think: Social network connections          │
│                                              │
│   Examples: Neo4j, Amazon Neptune            │
└─────────────────────────────────────────────┘
```

**How it works:** Stores data as nodes (entities) and edges (relationships). Optimized for traversing connections between data points.

**Best for:** Social networks, recommendation engines, fraud detection, knowledge graphs.

### Quick Comparison

| Type | Data Model | DynamoDB? | Example DBs | Best For |
|---|---|---|---|---|
| Key-Value | Key → Value | ✅ Yes | Redis, DynamoDB | Caching, sessions |
| Document | JSON documents | ✅ Yes | MongoDB, DynamoDB | Flexible schemas |
| Column-Family | Column groups | ❌ No | Cassandra, HBase | Analytics, time-series |
| Graph | Nodes + Edges | ❌ No | Neo4j, Neptune | Relationships |

---

## 🔑 DynamoDB Key Concepts

### Tables

A **Table** is like a folder that holds your data. Unlike SQL tables, DynamoDB tables don't have a fixed schema — each item can have different attributes.

```
┌─────────────────────────────────────────────┐
│               Table: Users                   │
├─────────────────────────────────────────────┤
│  Item 1: {user_id: "U1", name: "Amit",     │
│           age: 28, city: "Delhi"}           │
│                                              │
│  Item 2: {user_id: "U2", name: "Priya",    │
│           email: "priya@mail.com"}          │
│           ↑ No age or city — that's OK!     │
│                                              │
│  Item 3: {user_id: "U3", name: "Raj",      │
│           age: 32, hobbies: ["cricket"]}    │
│           ↑ Has hobbies — also OK!          │
└─────────────────────────────────────────────┘
```

### Items

An **Item** is a single record in a table. It's like one row in SQL, but with flexible attributes. Each item can be up to **400 KB** in size.

### Attributes

An **Attribute** is a single piece of data in an item. It's like a column in SQL, but:
- Different items can have different attributes
- Attributes can be nested (maps, lists)
- No need to define attributes upfront

### Primary Key

The **Primary Key** uniquely identifies each item in a table. There are two types:

#### Type 1: Simple Primary Key (Partition Key only)

```
┌──────────────────────────────────────────┐
│  Table: Users                            │
│  Primary Key: user_id (Partition Key)    │
├──────────────────────────────────────────┤
│  Partition Key │ Other Attributes         │
│  ─────────────│──────────────────────     │
│  "U001"       │ name: "Amit", age: 28    │
│  "U002"       │ name: "Priya", age: 25   │
│  "U003"       │ name: "Raj", age: 32     │
└──────────────────────────────────────────┘
```

- The **Partition Key** (also called Hash Key) determines which physical partition stores the item
- Must be **unique** for each item
- Example: `user_id`, `product_id`, `email`

#### Type 2: Composite Primary Key (Partition Key + Sort Key)

```
┌─────────────────────────────────────────────────────────┐
│  Table: Orders                                           │
│  Primary Key: user_id (PK) + order_date (SK)            │
├─────────────────────────────────────────────────────────┤
│  Partition Key │ Sort Key      │ Other Attributes         │
│  ─────────────│──────────────│──────────────────          │
│  "U001"       │ "2024-01-15" │ total: 500, items: 3      │
│  "U001"       │ "2024-02-20" │ total: 1200, items: 1     │
│  "U001"       │ "2024-03-05" │ total: 800, items: 2      │
│  "U002"       │ "2024-01-10" │ total: 300, items: 5      │
│  "U002"       │ "2024-03-15" │ total: 2500, items: 1     │
└─────────────────────────────────────────────────────────┘
```

- **Partition Key** can repeat (multiple orders per user)
- **Sort Key** (also called Range Key) sorts items within the same partition
- The **combination** of PK + SK must be unique
- Enables **range queries**: "Get all orders for user U001 between Jan and March"

### How Partitions Work Internally

```
┌─────────────────────────────────────────────────────┐
│                   DynamoDB Table                     │
│                                                      │
│   Hash("U001") ──→ Partition A                      │
│                     ┌─────────────────────┐          │
│                     │ U001 | 2024-01-15   │          │
│                     │ U001 | 2024-02-20   │          │
│                     │ U001 | 2024-03-05   │          │
│                     └─────────────────────┘          │
│                                                      │
│   Hash("U002") ──→ Partition B                      │
│                     ┌─────────────────────┐          │
│                     │ U002 | 2024-01-10   │          │
│                     │ U002 | 2024-03-15   │          │
│                     └─────────────────────┘          │
│                                                      │
│   Hash("U003") ──→ Partition C                      │
│                     ┌─────────────────────┐          │
│                     │ U003 | 2024-02-28   │          │
│                     └─────────────────────┘          │
└─────────────────────────────────────────────────────┘
```

DynamoDB uses the partition key's hash value to decide which partition stores the data. This is why **choosing a good partition key** is crucial for performance.

### Secondary Indexes

Secondary Indexes let you query the table using different attributes (not just the primary key).

#### Local Secondary Index (LSI)

- **Same Partition Key** as the table, but a **different Sort Key**
- Must be created **at table creation time** (cannot add later!)
- Maximum **5 LSIs** per table
- Shares the table's read/write capacity
- Supports strongly consistent reads

```
Table: Orders
Primary Key: user_id (PK) + order_date (SK)

LSI: user_id (PK) + total_amount (SK)
  → Query: "Get all orders for user U001, sorted by amount"

┌──────────────────────────────────────────────────┐
│  LSI: UserAmountIndex                            │
│  PK: user_id (same)  │  SK: total_amount (new)  │
├──────────────────────────────────────────────────┤
│  "U001"               │  500                     │
│  "U001"               │  800                     │
│  "U001"               │  1200                    │
│  "U002"               │  300                     │
│  "U002"               │  2500                    │
└──────────────────────────────────────────────────┘
```

#### Global Secondary Index (GSI)

- **Different Partition Key** and optionally a **different Sort Key**
- Can be created **at any time** (after table creation too!)
- Maximum **20 GSIs** per table
- Has its **own read/write capacity** (separate from the table)
- Only supports **eventually consistent** reads

```
Table: Orders
Primary Key: user_id (PK) + order_date (SK)

GSI: product_id (PK) + order_date (SK)
  → Query: "Get all orders for product P100, sorted by date"

┌──────────────────────────────────────────────────┐
│  GSI: ProductDateIndex                           │
│  PK: product_id (new)│  SK: order_date (same)   │
├──────────────────────────────────────────────────┤
│  "P100"               │  "2024-01-10"            │
│  "P100"               │  "2024-02-20"            │
│  "P200"               │  "2024-01-15"            │
│  "P200"               │  "2024-03-05"            │
└──────────────────────────────────────────────────┘
```

#### LSI vs GSI Comparison

| Feature | LSI | GSI |
|---|---|---|
| Partition Key | Same as table | Can be different |
| Sort Key | Must be different | Can be different |
| When to Create | Table creation only | Any time |
| Max per Table | 5 | 20 |
| Capacity | Shares with table | Has own capacity |
| Consistency | Strongly + Eventually | Eventually only |
| Size Limit | 10 GB per partition | No limit |
| Projected Attributes | All, Keys, Include | All, Keys, Include |

---

## 📝 Data Types in DynamoDB

DynamoDB supports three categories of data types:

### 1. Scalar Types (Single Value)

| Type Code | Type Name | Description | Example |
|---|---|---|---|
| `S` | String | UTF-8 text | `"Hello World"` |
| `N` | Number | Positive, negative, zero | `"42"`, `"-3.14"` |
| `B` | Binary | Base64-encoded binary | `"dGhpcyB0ZXh0"` |
| `BOOL` | Boolean | true or false | `true` |
| `NULL` | Null | Unknown or undefined | `true` (means null) |

```json
{
  "user_id": {"S": "U001"},
  "name": {"S": "Amit Kumar"},
  "age": {"N": "28"},
  "profile_pic": {"B": "iVBORw0KGgo..."},
  "is_active": {"BOOL": true},
  "middle_name": {"NULL": true}
}
```

> ⚠️ **Important:** Numbers are sent as strings in the DynamoDB JSON format (`"N": "28"` not `"N": 28`), but DynamoDB treats them as numbers for math operations.

### 2. Document Types (Complex/Nested)

| Type Code | Type Name | Description | Example |
|---|---|---|---|
| `M` | Map | Key-value pairs (like JSON object) | `{"city": "Delhi", "pin": "110001"}` |
| `L` | List | Ordered collection (like JSON array) | `["cricket", "music", "coding"]` |

```json
{
  "user_id": {"S": "U001"},
  "name": {"S": "Amit Kumar"},
  "address": {
    "M": {
      "street": {"S": "123 MG Road"},
      "city": {"S": "Delhi"},
      "pin": {"S": "110001"},
      "coordinates": {
        "M": {
          "lat": {"N": "28.6139"},
          "lng": {"N": "77.2090"}
        }
      }
    }
  },
  "hobbies": {
    "L": [
      {"S": "cricket"},
      {"S": "coding"},
      {"M": {"name": {"S": "music"}, "level": {"S": "intermediate"}}}
    ]
  }
}
```

### 3. Set Types (Collection of Unique Values)

| Type Code | Type Name | Description | Example |
|---|---|---|---|
| `SS` | String Set | Set of unique strings | `["red", "blue", "green"]` |
| `NS` | Number Set | Set of unique numbers | `["1", "2", "3"]` |
| `BS` | Binary Set | Set of unique binary values | `["dGVzdA==", "YWJj"]` |

```json
{
  "user_id": {"S": "U001"},
  "tags": {"SS": ["developer", "aws", "nodejs"]},
  "scores": {"NS": ["95", "87", "92"]},
  "thumbnails": {"BS": ["iVBORw0...", "R0lGODlh..."]}
}
```

> ⚠️ **Set Rules:**
> - All elements must be the same type
> - No duplicate values allowed
> - Empty sets are not allowed
> - Order is not preserved

### Complete Data Type Tree

```
DynamoDB Data Types
├── Scalar (single value)
│   ├── S  — String
│   ├── N  — Number
│   ├── B  — Binary
│   ├── BOOL — Boolean
│   └── NULL — Null
├── Document (nested/complex)
│   ├── M  — Map (object)
│   └── L  — List (array)
└── Set (unique collection)
    ├── SS — String Set
    ├── NS — Number Set
    └── BS — Binary Set
```

---

## 📊 Read/Write Capacity

DynamoDB offers two capacity modes:

### Mode 1: Provisioned Capacity

You tell DynamoDB how many reads and writes per second you expect. You pay for what you provision (even if you don't use it).

#### RCU — Read Capacity Units

**1 RCU** gives you:
- **1 Strongly Consistent** read per second for items up to **4 KB**
- **2 Eventually Consistent** reads per second for items up to **4 KB**

#### RCU Calculation Formula

```
Strongly Consistent:
  RCUs = ⌈Item Size / 4 KB⌉ × Reads per second

Eventually Consistent:
  RCUs = ⌈Item Size / 4 KB⌉ × Reads per second / 2
```

**Example 1:** Read 10 items per second, each 6 KB, **Strongly Consistent**
```
Item size = 6 KB → ⌈6/4⌉ = 2 (round up)
RCUs = 2 × 10 = 20 RCUs needed
```

**Example 2:** Read 10 items per second, each 6 KB, **Eventually Consistent**
```
Item size = 6 KB → ⌈6/4⌉ = 2 (round up)
RCUs = 2 × 10 / 2 = 10 RCUs needed (half!)
```

**Example 3:** Read 15 items per second, each 12 KB, **Strongly Consistent**
```
Item size = 12 KB → ⌈12/4⌉ = 3
RCUs = 3 × 15 = 45 RCUs needed
```

**Example 4:** Read 15 items per second, each 12 KB, **Eventually Consistent**
```
Item size = 12 KB → ⌈12/4⌉ = 3
RCUs = 3 × 15 / 2 = 22.5 → round up to 23 RCUs needed
```

#### WCU — Write Capacity Units

**1 WCU** gives you:
- **1 write** per second for items up to **1 KB**

#### WCU Calculation Formula

```
WCUs = ⌈Item Size / 1 KB⌉ × Writes per second
```

**Example 1:** Write 5 items per second, each 2.5 KB
```
Item size = 2.5 KB → ⌈2.5/1⌉ = 3 (round up)
WCUs = 3 × 5 = 15 WCUs needed
```

**Example 2:** Write 20 items per second, each 0.5 KB
```
Item size = 0.5 KB → ⌈0.5/1⌉ = 1
WCUs = 1 × 20 = 20 WCUs needed
```

#### Transactional Read/Write

Transactions cost **2x** the normal capacity:
- **1 Transactional Read** = 2 RCUs (for items up to 4 KB)
- **1 Transactional Write** = 2 WCUs (for items up to 1 KB)

### Mode 2: On-Demand Capacity

DynamoDB automatically handles capacity. You pay per request.

```
┌─────────────────────────────────────────────────────┐
│            Provisioned vs On-Demand                  │
├─────────────────────┬───────────────────────────────┤
│     Provisioned     │         On-Demand             │
├─────────────────────┼───────────────────────────────┤
│ You set RCU/WCU     │ Auto-scales instantly         │
│ Pay for provisioned │ Pay per request               │
│ Can use Auto        │ No capacity planning          │
│   Scaling           │                               │
│ Cheaper for         │ Cheaper for unpredictable     │
│   predictable       │   or spiky workloads          │
│   workloads         │                               │
│ Risk of throttling  │ No throttling risk            │
│   if under-         │                               │
│   provisioned       │                               │
│ Reserved capacity   │ No reserved capacity          │
│   discounts         │   discounts                   │
└─────────────────────┴───────────────────────────────┘
```

#### When to Use Which?

| Use Provisioned When... | Use On-Demand When... |
|---|---|
| Traffic is predictable | Traffic is unpredictable |
| You can forecast capacity | New table, unknown workload |
| You want to save costs | Spiky, bursty traffic |
| You've been running for months | You hate capacity planning |

---

## 🔄 Consistency Models

### Eventually Consistent Reads (Default)

When you write data to DynamoDB, it's stored in 3 copies across different Availability Zones. Eventually consistent reads might not reflect the very latest write.

**Analogy:** Imagine you post a photo on social media. Your friend in another city might see it after a few seconds (not instantly). The photo is "eventually" visible to everyone.

```
Write to DynamoDB
    │
    ├──→ Copy 1 (AZ-a) ✅ Updated immediately
    ├──→ Copy 2 (AZ-b) ⏳ Updated in ~100ms
    └──→ Copy 3 (AZ-c) ⏳ Updated in ~100ms

Read (Eventually Consistent):
  Might read from Copy 2 before it's updated
  → Returns STALE data (old value)
  → Usually consistent within 1 second
```

- **Cheaper:** Uses half the RCUs
- **Faster:** Can read from any replica
- **Good for:** Social feeds, analytics, dashboards

### Strongly Consistent Reads

A strongly consistent read returns the most up-to-date data, reflecting all writes that were successful before the read.

**Analogy:** Imagine checking your bank balance. You always want to see the EXACT current balance — not a value from 2 seconds ago. That's strongly consistent.

```
Write to DynamoDB
    │
    ├──→ Copy 1 (AZ-a) ✅ Updated
    ├──→ Copy 2 (AZ-b) ✅ Updated
    └──→ Copy 3 (AZ-c) ✅ Updated

Read (Strongly Consistent):
  Waits for ALL copies to be updated
  → Always returns LATEST data
  → Slightly slower, costs more
```

- **Costs 2x** the RCUs of eventually consistent
- **Slightly slower:** Must read from leader node
- **Good for:** Banking, inventory counts, booking systems

### Comparison Table

| Feature | Eventually Consistent | Strongly Consistent |
|---|---|---|
| Data freshness | May be stale (< 1 sec) | Always latest |
| RCU cost | 1x (half cost) | 2x (double cost) |
| Latency | Lower | Slightly higher |
| Default? | ✅ Yes | Must specify |
| API parameter | N/A | `ConsistentRead: true` |
| Availability | Higher | Slightly lower |

---

## ⚙️ DynamoDB Operations

### 1. PutItem — Create or Replace an Item

```bash
# AWS CLI
aws dynamodb put-item \
  --table-name Users \
  --item '{
    "user_id": {"S": "U001"},
    "name": {"S": "Amit Kumar"},
    "email": {"S": "amit@example.com"},
    "age": {"N": "28"}
  }'
```

```javascript
// AWS SDK v3 (JavaScript)
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "ap-south-1" });

const command = new PutItemCommand({
  TableName: "Users",
  Item: {
    user_id: { S: "U001" },
    name: { S: "Amit Kumar" },
    email: { S: "amit@example.com" },
    age: { N: "28" }
  }
});

await client.send(command);
```

> ⚠️ **Warning:** PutItem **replaces** the entire item if the key already exists! If you want to update specific attributes, use UpdateItem.

### 2. GetItem — Read a Single Item

```bash
# AWS CLI
aws dynamodb get-item \
  --table-name Users \
  --key '{"user_id": {"S": "U001"}}' \
  --consistent-read
```

```javascript
// AWS SDK v3
import { GetItemCommand } from "@aws-sdk/client-dynamodb";

const command = new GetItemCommand({
  TableName: "Users",
  Key: {
    user_id: { S: "U001" }
  },
  ConsistentRead: true  // Strongly consistent
});

const response = await client.send(command);
console.log(response.Item);
```

### 3. UpdateItem — Modify Specific Attributes

```bash
# AWS CLI — Update age and add a new attribute
aws dynamodb update-item \
  --table-name Users \
  --key '{"user_id": {"S": "U001"}}' \
  --update-expression "SET age = :newAge, city = :city" \
  --expression-attribute-values '{
    ":newAge": {"N": "29"},
    ":city": {"S": "Mumbai"}
  }' \
  --return-values ALL_NEW
```

```javascript
// AWS SDK v3
import { UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const command = new UpdateItemCommand({
  TableName: "Users",
  Key: {
    user_id: { S: "U001" }
  },
  UpdateExpression: "SET age = :newAge, city = :city",
  ExpressionAttributeValues: {
    ":newAge": { N: "29" },
    ":city": { S: "Mumbai" }
  },
  ReturnValues: "ALL_NEW"
});

const response = await client.send(command);
```

#### Update Expression Actions

| Action | Syntax | Description |
|---|---|---|
| `SET` | `SET attr = :val` | Add or overwrite attribute |
| `REMOVE` | `REMOVE attr` | Delete attribute |
| `ADD` | `ADD numAttr :val` | Add to number or add to set |
| `DELETE` | `DELETE setAttr :subset` | Remove elements from set |

```
-- Examples of each action:
SET name = :name, #count = #count + :incr
REMOVE middle_name, temp_flag
ADD view_count :one, tags :newTags
DELETE old_tags :removeTags
```

### 4. DeleteItem — Remove an Item

```bash
# AWS CLI
aws dynamodb delete-item \
  --table-name Users \
  --key '{"user_id": {"S": "U001"}}' \
  --condition-expression "attribute_exists(user_id)"
```

```javascript
// AWS SDK v3
import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const command = new DeleteItemCommand({
  TableName: "Users",
  Key: {
    user_id: { S: "U001" }
  },
  ConditionExpression: "attribute_exists(user_id)"
});

await client.send(command);
```

### 5. Query — Efficient Data Retrieval

**Query** retrieves items based on the **Primary Key**. It's the most efficient way to read data because it goes directly to the right partition.

```bash
# Get all orders for user U001 in 2024
aws dynamodb query \
  --table-name Orders \
  --key-condition-expression "user_id = :uid AND order_date BETWEEN :start AND :end" \
  --expression-attribute-values '{
    ":uid": {"S": "U001"},
    ":start": {"S": "2024-01-01"},
    ":end": {"S": "2024-12-31"}
  }' \
  --scan-index-forward false
```

```javascript
// AWS SDK v3
import { QueryCommand } from "@aws-sdk/client-dynamodb";

const command = new QueryCommand({
  TableName: "Orders",
  KeyConditionExpression: "user_id = :uid AND order_date BETWEEN :start AND :end",
  ExpressionAttributeValues: {
    ":uid": { S: "U001" },
    ":start": { S: "2024-01-01" },
    ":end": { S: "2024-12-31" }
  },
  ScanIndexForward: false,  // Descending order
  Limit: 10  // Max 10 items
});

const response = await client.send(command);
```

### 6. Scan — Read All Items

**Scan** reads **every item** in the table and optionally filters results. It's expensive and slow for large tables.

```bash
# Scan all users older than 25
aws dynamodb scan \
  --table-name Users \
  --filter-expression "age > :minAge" \
  --expression-attribute-values '{":minAge": {"N": "25"}}'
```

```javascript
// AWS SDK v3
import { ScanCommand } from "@aws-sdk/client-dynamodb";

const command = new ScanCommand({
  TableName: "Users",
  FilterExpression: "age > :minAge",
  ExpressionAttributeValues: {
    ":minAge": { N: "25" }
  }
});

const response = await client.send(command);
```

### Query vs Scan Comparison

| Feature | Query | Scan |
|---|---|---|
| **How it works** | Goes directly to the partition | Reads entire table |
| **Requires** | Partition Key (mandatory) | Nothing |
| **Performance** | Fast (O(log n)) | Slow (O(n)) |
| **Cost** | Low (reads only needed items) | High (reads everything) |
| **Filtering** | KeyCondition + Filter | Filter only |
| **When to use** | Almost always | Rarely (exports, migrations) |
| **Pagination** | Yes (LastEvaluatedKey) | Yes (LastEvaluatedKey) |
| **Max result** | 1 MB per call | 1 MB per call |
| **Parallel** | No | Yes (Parallel Scan) |

> 🏆 **Rule of Thumb:** Always prefer **Query** over **Scan**. Design your table and indexes so you can use Query for every access pattern.

### 7. Batch Operations

#### BatchWriteItem — Write up to 25 items at once

```javascript
import { BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";

const command = new BatchWriteItemCommand({
  RequestItems: {
    Users: [
      {
        PutRequest: {
          Item: {
            user_id: { S: "U010" },
            name: { S: "User Ten" }
          }
        }
      },
      {
        PutRequest: {
          Item: {
            user_id: { S: "U011" },
            name: { S: "User Eleven" }
          }
        }
      },
      {
        DeleteRequest: {
          Key: {
            user_id: { S: "U005" }
          }
        }
      }
    ]
  }
});

const response = await client.send(command);

// Check for unprocessed items (due to throttling)
if (Object.keys(response.UnprocessedItems).length > 0) {
  console.log("Retry unprocessed items:", response.UnprocessedItems);
}
```

#### BatchGetItem — Read up to 100 items at once

```javascript
import { BatchGetItemCommand } from "@aws-sdk/client-dynamodb";

const command = new BatchGetItemCommand({
  RequestItems: {
    Users: {
      Keys: [
        { user_id: { S: "U001" } },
        { user_id: { S: "U002" } },
        { user_id: { S: "U003" } }
      ],
      ProjectionExpression: "user_id, #n, email",
      ExpressionAttributeNames: { "#n": "name" }  // "name" is reserved
    }
  }
});

const response = await client.send(command);
```

#### Batch Limits

| Operation | Max Items | Max Size | Supports Conditions? |
|---|---|---|---|
| BatchWriteItem | 25 items | 16 MB total | ❌ No |
| BatchGetItem | 100 items | 16 MB total | ❌ No |
| TransactWriteItems | 100 items | 4 MB total | ✅ Yes |
| TransactGetItems | 100 items | 4 MB total | ✅ Yes |

---

## 📡 DynamoDB Streams

### What are DynamoDB Streams?

DynamoDB Streams capture a **time-ordered sequence of changes** (inserts, updates, deletes) made to items in a table. It's like a changelog or activity log for your table.

```
┌──────────────────────────────────────────────────────────┐
│                    DynamoDB Table                         │
│                                                          │
│   PutItem(U001) ──→  Stream Record: INSERT {new item}   │
│   UpdateItem(U001)──→ Stream Record: MODIFY {old, new}  │
│   DeleteItem(U001)──→ Stream Record: REMOVE {old item}  │
│                                                          │
│          │                                               │
│          ▼                                               │
│   ┌──────────────────┐                                   │
│   │ DynamoDB Stream   │ ──→ Lambda Function              │
│   │ (24-hour window)  │ ──→ Kinesis Data Streams         │
│   │                   │ ──→ Another DynamoDB Table        │
│   └──────────────────┘                                   │
└──────────────────────────────────────────────────────────┘
```

### Stream View Types

| View Type | What's Captured | Use Case |
|---|---|---|
| `KEYS_ONLY` | Only the key attributes | Know what changed, not details |
| `NEW_IMAGE` | The entire item after change | Sync to another system |
| `OLD_IMAGE` | The entire item before change | Audit, undo operations |
| `NEW_AND_OLD_IMAGES` | Both before and after | Compare changes, analytics |

### Common Use Cases for Streams

1. **Trigger Lambda on changes** — Send email when a new user signs up
2. **Replicate data** — Sync DynamoDB to Elasticsearch for search
3. **Cross-region replication** — Power Global Tables
4. **Audit trail** — Log all changes for compliance
5. **Aggregation** — Update a counter table when items are added
6. **Event-driven architecture** — Decouple services with change events

### Lambda Trigger Example

```javascript
// Lambda function triggered by DynamoDB Stream
export const handler = async (event) => {
  for (const record of event.Records) {
    console.log('Event:', record.eventName);  // INSERT, MODIFY, REMOVE
    
    if (record.eventName === 'INSERT') {
      const newItem = record.dynamodb.NewImage;
      const email = newItem.email.S;
      const name = newItem.name.S;
      
      // Send welcome email
      await sendWelcomeEmail(email, name);
    }
    
    if (record.eventName === 'MODIFY') {
      const oldItem = record.dynamodb.OldImage;
      const newItem = record.dynamodb.NewImage;
      console.log('Changed from:', oldItem, 'to:', newItem);
    }
    
    if (record.eventName === 'REMOVE') {
      const oldItem = record.dynamodb.OldImage;
      console.log('Deleted item:', oldItem);
    }
  }
};
```

---

## 🔒 DynamoDB Transactions

### What are Transactions?

Transactions let you group multiple operations together. Either **all operations succeed** or **all operations fail** — there's no partial success.

**Analogy:** Bank transfer — debit from Account A and credit to Account B must both happen. If one fails, neither happens.

### TransactWriteItems

```javascript
import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";

// Transfer ₹1000 from Account A to Account B
const command = new TransactWriteItemsCommand({
  TransactItems: [
    {
      Update: {
        TableName: "Accounts",
        Key: { account_id: { S: "A001" } },
        UpdateExpression: "SET balance = balance - :amount",
        ConditionExpression: "balance >= :amount",  // Don't go negative!
        ExpressionAttributeValues: { ":amount": { N: "1000" } }
      }
    },
    {
      Update: {
        TableName: "Accounts",
        Key: { account_id: { S: "B001" } },
        UpdateExpression: "SET balance = balance + :amount",
        ExpressionAttributeValues: { ":amount": { N: "1000" } }
      }
    },
    {
      Put: {
        TableName: "Transactions",
        Item: {
          txn_id: { S: "TXN-12345" },
          from: { S: "A001" },
          to: { S: "B001" },
          amount: { N: "1000" },
          timestamp: { S: new Date().toISOString() }
        }
      }
    }
  ]
});

await client.send(command);
```

### TransactGetItems

```javascript
import { TransactGetItemsCommand } from "@aws-sdk/client-dynamodb";

const command = new TransactGetItemsCommand({
  TransactItems: [
    {
      Get: {
        TableName: "Accounts",
        Key: { account_id: { S: "A001" } }
      }
    },
    {
      Get: {
        TableName: "Accounts",
        Key: { account_id: { S: "B001" } }
      }
    }
  ]
});

const response = await client.send(command);
```

### Transaction Limits

- Maximum **100 items** per transaction (across all operations)
- Maximum **4 MB** total data
- Costs **2x** the normal RCUs/WCUs
- Can span **multiple tables**
- Operations: Put, Update, Delete, ConditionCheck (for writes); Get (for reads)
- No two operations can target the same item

---

## ⚡ DAX — DynamoDB Accelerator

### What is DAX?

**DAX** is an in-memory cache for DynamoDB. It sits between your application and DynamoDB, caching frequently accessed data.

```
Without DAX:
  App ──→ DynamoDB (1-10ms)

With DAX:
  App ──→ DAX Cache ──→ DynamoDB
           (microseconds)  (only on cache miss)

┌─────────────────────────────────────────────┐
│                                             │
│   ┌─────┐     ┌─────┐     ┌──────────┐    │
│   │ App │────→│ DAX │────→│ DynamoDB │    │
│   └─────┘     │Cache│     └──────────┘    │
│               └─────┘                      │
│                 │                           │
│         Response time:                      │
│         ~microseconds                       │
│         (vs milliseconds)                   │
│                                             │
│   DAX handles:                              │
│   ✅ GetItem                                │
│   ✅ BatchGetItem                           │
│   ✅ Query                                  │
│   ✅ Scan                                   │
│   ❌ NOT writes (pass-through)              │
│                                             │
└─────────────────────────────────────────────┘
```

### When to Use DAX

| ✅ Use DAX | ❌ Don't Use DAX |
|---|---|
| Read-heavy workloads | Write-heavy workloads |
| Same data read repeatedly | Data changes frequently |
| Microsecond latency needed | Eventually consistent is not OK |
| Reduce DynamoDB costs | Strongly consistent reads needed |
| Gaming leaderboards | Complex queries (use ElastiCache) |

### DAX vs ElastiCache

| Feature | DAX | ElastiCache (Redis) |
|---|---|---|
| Purpose | DynamoDB cache | General-purpose cache |
| API | Same as DynamoDB | Redis/Memcached API |
| Code changes | Minimal (drop-in) | Significant |
| Data types | DynamoDB items | Any data structure |
| Works with | DynamoDB only | Any data source |

---

## ⏰ TTL — Time to Live

### What is TTL?

**TTL** automatically deletes items after a specified timestamp. It's free — you don't pay for the delete operations.

**Analogy:** It's like setting an expiration date on milk. After that date, DynamoDB automatically throws it away.

### How it Works

1. You designate one attribute as the TTL attribute (must be a Number type)
2. Store a **Unix epoch timestamp** (seconds since Jan 1, 1970) as the value
3. DynamoDB deletes expired items within **48 hours** (not instantly!)
4. Deleted items appear in DynamoDB Streams (with eventName: REMOVE)

```javascript
// Setting TTL on an item
const now = Math.floor(Date.now() / 1000);  // Current Unix timestamp
const ttl = now + (7 * 24 * 60 * 60);       // 7 days from now

const command = new PutItemCommand({
  TableName: "Sessions",
  Item: {
    session_id: { S: "sess_abc123" },
    user_id: { S: "U001" },
    created_at: { N: String(now) },
    expires_at: { N: String(ttl) }   // TTL attribute
  }
});
```

### Enable TTL on a Table

```bash
aws dynamodb update-time-to-live \
  --table-name Sessions \
  --time-to-live-specification "Enabled=true, AttributeName=expires_at"
```

### TTL Use Cases

1. **Session management** — Auto-expire user sessions after 30 minutes
2. **Temporary data** — Delete OTPs after 5 minutes
3. **Logs cleanup** — Remove logs older than 30 days
4. **Cart expiry** — Delete abandoned carts after 24 hours
5. **Regulatory compliance** — Auto-delete data after retention period

---

## 🌍 Global Tables

### What are Global Tables?

**Global Tables** provide fully managed, multi-region replication. Changes in one region are automatically replicated to all other regions.

```
┌──────────────────────────────────────────────────────────┐
│                    Global Table                          │
│                                                          │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│   │ us-east-1│    │ eu-west-1│    │ap-south-1│         │
│   │ (USA)    │    │ (Ireland)│    │ (Mumbai) │         │
│   │          │◄──►│          │◄──►│          │         │
│   │ Replica  │    │ Replica  │    │ Replica  │         │
│   └──────────┘    └──────────┘    └──────────┘         │
│                                                          │
│   • All replicas are read/write                          │
│   • Replication typically < 1 second                     │
│   • Last-writer-wins conflict resolution                 │
│   • DynamoDB Streams must be enabled                     │
│   • On-Demand or Provisioned capacity                    │
└──────────────────────────────────────────────────────────┘
```

### When to Use Global Tables

- **Global applications** — Users in multiple countries need low-latency access
- **Disaster recovery** — If one region goes down, serve from another
- **Data sovereignty** — Keep data close to users for compliance
- **Active-active architecture** — Writes in any region

---

## 💰 Pricing

### DynamoDB Pricing Breakdown (us-east-1)

| Component | Cost |
|---|---|
| **Storage** | $0.25 per GB per month |
| **Write (On-Demand)** | $1.25 per million WRUs |
| **Read (On-Demand)** | $0.25 per million RRUs |
| **Write (Provisioned)** | $0.00065 per WCU per hour |
| **Read (Provisioned)** | $0.00013 per RCU per hour |
| **Streams** | $0.02 per 100,000 read requests |
| **Global Tables** | Replicated WCU charged per region |
| **Backup (On-Demand)** | $0.10 per GB per month |
| **Backup (Continuous/PITR)** | $0.20 per GB per month |
| **DAX** | $0.269/hr (t3.medium) |
| **Data Transfer OUT** | $0.09/GB (first 10TB) |

### Free Tier (Always Free!)

```
┌─────────────────────────────────────────────┐
│         DynamoDB Free Tier                   │
│         (Never expires!)                     │
├─────────────────────────────────────────────┤
│  📦 25 GB of storage                        │
│  ✏️  25 WCU (provisioned)                   │
│  📖 25 RCU (provisioned)                    │
│  🔄 2.5 million stream read requests/month  │
│  📊 200 million requests/month (on-demand)  │
│  🌍 25 rWCU for Global Tables              │
│  💾 1 GB table data for on-demand backup    │
│  🔙 Continuous backups for table ≤ 1GB      │
└─────────────────────────────────────────────┘
```

### Pricing Example

**Scenario:** An app with 1 million reads/day and 200K writes/day, 5 GB storage, using On-Demand mode.

```
Monthly reads:  30M reads  × $0.25/million = $7.50
Monthly writes: 6M writes  × $1.25/million = $7.50
Storage:        5 GB       × $0.25/GB      = $1.25
                                    ─────────────
                                Total: $16.25/month
```

---

## 🆚 DynamoDB vs RDS vs Aurora

| Feature | DynamoDB | RDS | Aurora |
|---|---|---|---|
| **Type** | NoSQL (Key-Value/Document) | SQL (Relational) | SQL (Relational) |
| **Managed** | Fully managed (serverless) | Managed (you choose instance) | Managed + Serverless option |
| **Schema** | Flexible (schemaless) | Fixed schema | Fixed schema |
| **Scaling** | Automatic horizontal | Vertical (manual) | Auto-scaling replicas |
| **Performance** | Single-digit ms (any scale) | Varies with query | 5x MySQL, 3x PostgreSQL |
| **Max Storage** | Unlimited | 64 TB (PostgreSQL) | 128 TB |
| **Pricing** | Per request or per capacity | Per instance (hourly) | Per instance + I/O |
| **Replication** | 3 AZs (automatic) | Multi-AZ (optional) | 6 copies across 3 AZs |
| **Global** | Global Tables | Read Replicas | Global Database |
| **JOINs** | ❌ Not supported | ✅ Full SQL JOINs | ✅ Full SQL JOINs |
| **Transactions** | ✅ Limited (100 items) | ✅ Full ACID | ✅ Full ACID |
| **Backup** | On-demand + PITR | Automated + manual | Automated + manual |
| **Use Case** | Web apps, gaming, IoT | Traditional apps, ERP | High-performance SQL |

### Decision Guide

```
Do you need JOINs or complex SQL?
├── YES → Is high performance critical?
│         ├── YES → Aurora
│         └── NO  → RDS
└── NO  → Is it key-value or document data?
          ├── YES → DynamoDB
          └── NO  → Consider your data model first
```

---

## ✅ Best Practices

### 1. Choose a Good Partition Key

The partition key determines how data is distributed across partitions. A **bad partition key** creates **hot partitions** (one partition gets all the traffic).

```
❌ BAD Partition Keys:
  - "country"     → Most users might be from 1-2 countries
  - "status"      → Only "active"/"inactive" — just 2 partitions!
  - "date"        → Today's date gets ALL writes

✅ GOOD Partition Keys:
  - "user_id"     → Millions of unique users = even distribution
  - "order_id"    → Each order has unique ID
  - "device_id"   → Each IoT device has unique ID
  - "session_id"  → Each session is unique
```

### 2. Avoid Hot Partitions

```
HOT PARTITION PROBLEM:

Partition A: 80% of all reads  ←── HOT! 🔥
Partition B: 10% of reads
Partition C: 10% of reads

SOLUTIONS:
1. Add randomness: "user_id" + "_" + random(1-10)
2. Use composite keys: "YYYY-MM-DD#random"
3. Write sharding: Distribute writes across suffixes
```

### 3. Write Sharding for Hot Keys

If one item gets massive writes (like a viral post's like count):

```javascript
// Instead of one item with key "post_12345"
// Create 10 shards: "post_12345#0" through "post_12345#9"

const shardId = Math.floor(Math.random() * 10);
const partitionKey = `post_12345#${shardId}`;

// To get total, read all 10 shards and sum them
```

### 4. Use Sparse Indexes

A **sparse index** only contains items that have the indexed attribute. This saves storage and RCUs.

```
Table: Orders
PK: order_id

Some orders have "refund_date" attribute, most don't.

GSI on refund_date:
  Only orders WITH refund_date appear in the index!
  → Very small index → very fast queries

Query: "Get all refunded orders" — scans only the small index
```

### 5. Use ProjectionExpression

Don't retrieve attributes you don't need:

```javascript
// ❌ BAD — retrieves ALL attributes
const command = new GetItemCommand({
  TableName: "Users",
  Key: { user_id: { S: "U001" } }
});

// ✅ GOOD — retrieves only what you need
const command = new GetItemCommand({
  TableName: "Users",
  Key: { user_id: { S: "U001" } },
  ProjectionExpression: "user_id, #n, email",
  ExpressionAttributeNames: { "#n": "name" }
});
```

### 6. Use Query Instead of Scan

Always design your table and indexes to support Query operations. Scan should be a last resort.

### 7. Handle Large Items

DynamoDB has a 400 KB item size limit. For large data:
- Store large blobs in S3, store the S3 URL in DynamoDB
- Compress data before storing
- Split large items into multiple items

### 8. Use Condition Expressions

Prevent accidental overwrites:

```javascript
// Only create if user doesn't exist
const command = new PutItemCommand({
  TableName: "Users",
  Item: { user_id: { S: "U001" }, name: { S: "Amit" } },
  ConditionExpression: "attribute_not_exists(user_id)"
});
```

---

## 📐 Single-Table Design

### What is Single-Table Design?

Instead of creating multiple tables (like in SQL), you put **all your data into ONE table** and use the primary key pattern to distinguish between entity types.

### Why Single-Table?

1. **Fewer API calls** — Fetch related data in a single query
2. **Lower latency** — No need for JOINs or multiple round trips
3. **Lower cost** — Fewer tables = less capacity to manage
4. **Simpler management** — One table to backup, monitor, etc.

### Example: E-Commerce Single Table

```
┌────────────────────────────────────────────────────────────────┐
│ PK              │ SK                  │ Attributes              │
├────────────────────────────────────────────────────────────────┤
│ USER#U001       │ PROFILE             │ name, email, city       │
│ USER#U001       │ ORDER#2024-01-15    │ total, items, status    │
│ USER#U001       │ ORDER#2024-02-20    │ total, items, status    │
│ USER#U001       │ ADDRESS#HOME        │ street, city, pin       │
│ USER#U001       │ ADDRESS#OFFICE      │ street, city, pin       │
│ USER#U002       │ PROFILE             │ name, email, city       │
│ USER#U002       │ ORDER#2024-03-10    │ total, items, status    │
│ PRODUCT#P001    │ DETAILS             │ name, price, category   │
│ PRODUCT#P001    │ REVIEW#R001         │ rating, comment, user   │
│ PRODUCT#P001    │ REVIEW#R002         │ rating, comment, user   │
└────────────────────────────────────────────────────────────────┘
```

### Access Patterns Supported

| Access Pattern | Query |
|---|---|
| Get user profile | PK = "USER#U001", SK = "PROFILE" |
| Get all user orders | PK = "USER#U001", SK begins_with "ORDER#" |
| Get user addresses | PK = "USER#U001", SK begins_with "ADDRESS#" |
| Get product details | PK = "PRODUCT#P001", SK = "DETAILS" |
| Get product reviews | PK = "PRODUCT#P001", SK begins_with "REVIEW#" |
| Get everything for user | PK = "USER#U001" (no SK filter) |

### GSI for Reverse Lookups

Need to find all orders with status "SHIPPED"?

```
GSI: GSI1
  PK: entity_type + status = "ORDER#SHIPPED"
  SK: order_date

Query GSI1: PK = "ORDER#SHIPPED" → All shipped orders!
```

---

## 🌐 Real-World Use Cases

### 1. Gaming Leaderboard

```
Table: GameScores
PK: game_id     SK: score (descending)

- Store player scores with game_id as partition key
- Sort key on score for instant ranking queries
- Use Global Tables for worldwide low-latency access
- TTL to expire seasonal leaderboards
```

### 2. E-Commerce Shopping Cart

```
Table: Carts
PK: user_id     SK: product_id

- Each user has one partition with all their cart items
- Quick: Get entire cart = Query on user_id
- TTL: Auto-expire abandoned carts after 24 hours
- Transactions: Update cart + check inventory atomically
```

### 3. IoT Sensor Data

```
Table: SensorData
PK: device_id   SK: timestamp

- Millions of devices writing data every second
- Time-based queries: "Get readings for device X in last hour"
- TTL: Auto-delete data older than 90 days
- Streams: Trigger Lambda for anomaly detection
```

### 4. Social Media Feed

```
Table: SocialFeed
PK: user_id     SK: post_timestamp

- Each user's posts sorted by time
- GSI on post_id for direct post lookups
- Streams: Update follower feeds on new posts
- DAX: Cache popular posts for faster reads
```

### 5. Session Management

```
Table: Sessions
PK: session_id

- Fast key-value lookup by session ID
- TTL: Auto-expire sessions after 30 minutes
- Strongly consistent reads for security
- On-Demand capacity for unpredictable traffic
```

---

## 🔬 Hands-On Practice

### Exercise 1: Create a DynamoDB Table

```bash
# Create a table with composite primary key
aws dynamodb create-table \
  --table-name Movies \
  --attribute-definitions \
    AttributeName=year,AttributeType=N \
    AttributeName=title,AttributeType=S \
  --key-schema \
    AttributeName=year,KeyType=HASH \
    AttributeName=title,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

# Wait for table to be active
aws dynamodb wait table-exists --table-name Movies
```

### Exercise 2: Insert Items

```bash
# Insert a movie
aws dynamodb put-item \
  --table-name Movies \
  --item '{
    "year": {"N": "2024"},
    "title": {"S": "The Great Adventure"},
    "genre": {"S": "Action"},
    "rating": {"N": "8.5"},
    "cast": {"L": [{"S": "Actor A"}, {"S": "Actor B"}]}
  }'

# Insert another movie
aws dynamodb put-item \
  --table-name Movies \
  --item '{
    "year": {"N": "2024"},
    "title": {"S": "Mystery Night"},
    "genre": {"S": "Thriller"},
    "rating": {"N": "7.2"}
  }'

# Insert a movie from different year
aws dynamodb put-item \
  --table-name Movies \
  --item '{
    "year": {"N": "2023"},
    "title": {"S": "Space Journey"},
    "genre": {"S": "Sci-Fi"},
    "rating": {"N": "9.0"}
  }'
```

### Exercise 3: Query Movies

```bash
# Get all 2024 movies
aws dynamodb query \
  --table-name Movies \
  --key-condition-expression "#yr = :year" \
  --expression-attribute-names '{"#yr": "year"}' \
  --expression-attribute-values '{":year": {"N": "2024"}}'

# Get 2024 movies starting with "The"
aws dynamodb query \
  --table-name Movies \
  --key-condition-expression "#yr = :year AND begins_with(title, :prefix)" \
  --expression-attribute-names '{"#yr": "year"}' \
  --expression-attribute-values '{
    ":year": {"N": "2024"},
    ":prefix": {"S": "The"}
  }'
```

### Exercise 4: Update an Item

```bash
# Update the rating of a movie
aws dynamodb update-item \
  --table-name Movies \
  --key '{"year": {"N": "2024"}, "title": {"S": "The Great Adventure"}}' \
  --update-expression "SET rating = :r, director = :d" \
  --expression-attribute-values '{
    ":r": {"N": "9.0"},
    ":d": {"S": "Director X"}
  }' \
  --return-values ALL_NEW
```

### Exercise 5: Delete an Item

```bash
# Delete a movie
aws dynamodb delete-item \
  --table-name Movies \
  --key '{"year": {"N": "2023"}, "title": {"S": "Space Journey"}}'
```

### Exercise 6: Clean Up

```bash
# Delete the table
aws dynamodb delete-table --table-name Movies
```

---

## ❌ Common Mistakes

### 1. Using Scan Instead of Query
```
❌ Scanning entire table to find one user
✅ Query with the user_id partition key
```

### 2. Poor Partition Key Choice
```
❌ Using "status" as partition key (only 2-3 values)
✅ Using "user_id" as partition key (millions of unique values)
```

### 3. Not Using ProjectionExpression
```
❌ Reading full 10 KB items when you only need 2 attributes
✅ Use ProjectionExpression to read only needed attributes
```

### 4. Forgetting 400 KB Item Size Limit
```
❌ Storing large images or files directly in DynamoDB
✅ Store in S3 and save the S3 URL in DynamoDB
```

### 5. Not Handling UnprocessedItems in Batch Operations
```
❌ Assuming all items in BatchWriteItem were written
✅ Check UnprocessedItems and retry with exponential backoff
```

### 6. Using PutItem When You Mean UpdateItem
```
❌ PutItem replaces the ENTIRE item (deletes attributes you didn't include)
✅ Use UpdateItem to modify specific attributes
```

### 7. Not Using ExpressionAttributeNames for Reserved Words
```
❌ FilterExpression: "name = :name"  → ERROR! "name" is reserved
✅ FilterExpression: "#n = :name"
   ExpressionAttributeNames: {"#n": "name"}
```

### 8. Relying on TTL for Exact Expiration
```
❌ Expecting item to be deleted at EXACTLY the TTL timestamp
✅ TTL deletes can take up to 48 hours — filter expired items in your app
```

### 9. Creating Too Many Tables
```
❌ One table per entity (Users, Orders, Products, Reviews...)
✅ Consider single-table design for related entities
```

### 10. Ignoring GSI Capacity
```
❌ Not provisioning enough capacity for GSI writes
✅ GSI writes consume WCUs too — provision accordingly
```

---

## 📋 Quick Summary

```
┌─────────────────────────────────────────────────────────┐
│              DynamoDB Quick Reference                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  WHAT:     Fully managed, serverless NoSQL database      │
│  SPEED:    Single-digit millisecond response             │
│  SCALE:    Handles trillions of requests/day             │
│  STORAGE:  Unlimited, replicated across 3 AZs            │
│                                                          │
│  PRIMARY KEY:                                            │
│    Simple:    Partition Key only                          │
│    Composite: Partition Key + Sort Key                    │
│                                                          │
│  INDEXES:                                                │
│    LSI: Same PK, different SK (create at table time)     │
│    GSI: Different PK/SK (create anytime)                 │
│                                                          │
│  CAPACITY:                                               │
│    Provisioned: You set RCU/WCU                          │
│    On-Demand:   Pay per request                          │
│                                                          │
│  CONSISTENCY:                                            │
│    Eventually Consistent: Default, half RCU cost         │
│    Strongly Consistent: Latest data, full RCU cost       │
│                                                          │
│  OPERATIONS:                                             │
│    Write: PutItem, UpdateItem, DeleteItem                │
│    Read:  GetItem, Query (efficient), Scan (expensive)   │
│    Batch: BatchWriteItem (25), BatchGetItem (100)        │
│                                                          │
│  FEATURES:                                               │
│    Streams:      Change data capture (CDC)               │
│    Transactions: ACID for up to 100 items                │
│    DAX:          In-memory cache (microsecond reads)     │
│    TTL:          Auto-delete expired items (free)        │
│    Global Tables: Multi-region replication                │
│                                                          │
│  FREE TIER: 25 GB, 25 WCU, 25 RCU (always free)        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## ❓ Interview Questions

### Q1: What is Amazon DynamoDB?
**Answer:** DynamoDB is a fully managed, serverless, NoSQL database service provided by AWS. It is a key-value and document database that delivers single-digit millisecond performance at any scale. Data is automatically replicated across 3 Availability Zones for high availability and durability. It supports both provisioned and on-demand capacity modes.

### Q2: What are the differences between SQL and NoSQL databases?
**Answer:** SQL databases (like RDS, Aurora) have a fixed schema, use SQL for queries, support complex JOINs, and scale vertically. NoSQL databases (like DynamoDB) have flexible schemas, use API-based access, don't support JOINs (you denormalize data), and scale horizontally. SQL is better for complex queries and relationships; NoSQL is better for high-speed, high-scale applications with simple access patterns.

### Q3: What is a Partition Key and Sort Key in DynamoDB?
**Answer:** The Partition Key (Hash Key) determines which physical partition stores the item. DynamoDB hashes the partition key value to decide the partition. The Sort Key (Range Key) sorts items within the same partition, enabling range queries. Together, the Partition Key + Sort Key form a composite primary key where the combination must be unique. For example, `user_id` (PK) + `order_date` (SK) lets you store multiple orders per user, sorted by date.

### Q4: What is the difference between LSI and GSI?
**Answer:** A Local Secondary Index (LSI) uses the same partition key as the table but a different sort key, must be created at table creation time, has a limit of 5 per table, and supports strongly consistent reads. A Global Secondary Index (GSI) can have a completely different partition key and sort key, can be created at any time, has a limit of 20 per table, and only supports eventually consistent reads. GSIs have their own provisioned capacity, while LSIs share the table's capacity.

### Q5: How do you calculate RCU and WCU?
**Answer:** 
- **RCU:** 1 RCU = 1 strongly consistent read/sec for items up to 4 KB. For eventually consistent, 1 RCU = 2 reads/sec. Formula: `RCUs = ⌈Item Size / 4 KB⌉ × Reads/sec` (divide by 2 for eventually consistent).
- **WCU:** 1 WCU = 1 write/sec for items up to 1 KB. Formula: `WCUs = ⌈Item Size / 1 KB⌉ × Writes/sec`.
- **Transactions:** Cost 2x the normal RCU/WCU.

### Q6: What is the difference between Eventually Consistent and Strongly Consistent reads?
**Answer:** Eventually Consistent reads might return slightly stale data (data from before a recent write), but they cost half the RCUs and have lower latency. They're the default. Strongly Consistent reads always return the most up-to-date data by reading from the leader node, but they cost double and have slightly higher latency. You specify strongly consistent reads by setting `ConsistentRead: true` in the API call.

### Q7: What is the difference between Query and Scan?
**Answer:** Query goes directly to a specific partition using the partition key and optionally filters with the sort key — it's fast and efficient. Scan reads every item in the entire table — it's slow and expensive. Query costs proportional to the items returned; Scan costs proportional to the entire table size. Always design your table so you can use Query instead of Scan.

### Q8: What are DynamoDB Streams?
**Answer:** DynamoDB Streams capture a time-ordered sequence of item-level changes (INSERT, MODIFY, REMOVE) in a DynamoDB table. The stream records are available for 24 hours. You can configure what data is captured: KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, or NEW_AND_OLD_IMAGES. Common use cases include triggering Lambda functions, replicating data to other systems, and building event-driven architectures.

### Q9: What are DynamoDB Transactions?
**Answer:** Transactions provide ACID (Atomicity, Consistency, Isolation, Durability) guarantees across multiple items and tables. TransactWriteItems supports up to 100 actions (Put, Update, Delete, ConditionCheck) and TransactGetItems supports up to 100 Get actions. Either all operations succeed or all fail. They cost 2x the normal RCU/WCU. Use case: Bank transfer where debit and credit must both succeed.

### Q10: What is DAX and when would you use it?
**Answer:** DAX (DynamoDB Accelerator) is a fully managed, in-memory cache for DynamoDB that reduces read latency from milliseconds to microseconds. It's a write-through cache — writes go to DynamoDB and are cached in DAX. Use it for read-heavy workloads with repeated reads of the same data. It's a drop-in replacement (same API as DynamoDB). Don't use it for write-heavy workloads or when you need strongly consistent reads.

### Q11: What is TTL in DynamoDB?
**Answer:** TTL (Time to Live) is a free feature that automatically deletes expired items from your table. You designate an attribute that contains a Unix epoch timestamp. When the current time exceeds the timestamp, DynamoDB deletes the item (within 48 hours). The deletions appear in DynamoDB Streams. Use cases: session expiry, temporary tokens, log cleanup, regulatory data retention.

### Q12: What are Global Tables?
**Answer:** Global Tables provide fully managed, multi-region, multi-active replication. You create replicas in different AWS regions, and changes are automatically replicated (typically under 1 second). All replicas are read/write. Conflict resolution is last-writer-wins. Requirements: DynamoDB Streams must be enabled, and the table must use on-demand or provisioned capacity with auto-scaling in all regions.

### Q13: What is the maximum item size in DynamoDB?
**Answer:** The maximum item size is **400 KB**, including attribute names and values. For larger data, store it in S3 and save the S3 URL as a DynamoDB attribute.

### Q14: How does DynamoDB handle hot partitions?
**Answer:** A hot partition occurs when one partition receives disproportionately more traffic than others, caused by a poorly chosen partition key. Solutions: (1) Choose a high-cardinality partition key (like user_id), (2) Use write sharding by appending random suffixes to the partition key, (3) Use DynamoDB's adaptive capacity feature which automatically distributes throughput across partitions. DynamoDB also supports burst capacity to handle short-lived spikes.

### Q15: What is Single-Table Design?
**Answer:** Single-Table Design stores multiple entity types (users, orders, products) in one DynamoDB table using a structured primary key pattern (like PK = "USER#123", SK = "ORDER#2024-01-15"). Benefits: fewer API calls, lower latency (no JOINs), easier management. You use prefixes in the partition key and sort key to differentiate entity types and support multiple access patterns with GSIs.

### Q16: What is the difference between PutItem and UpdateItem?
**Answer:** PutItem creates a new item or **replaces an entire existing item** — if the item exists, all attributes are overwritten (attributes not included in the PutItem call are deleted). UpdateItem modifies **specific attributes** of an existing item without affecting other attributes. If the item doesn't exist, UpdateItem creates it. Always use UpdateItem when you want to change specific fields.

### Q17: How does DynamoDB pricing work?
**Answer:** DynamoDB charges for: (1) Storage: $0.25/GB/month, (2) Read/Write: either provisioned capacity (per RCU/WCU per hour) or on-demand (per request), (3) Optional features: Streams, DAX, backups, Global Tables replication, data transfer. The always-free tier includes 25 GB storage, 25 RCU, and 25 WCU with provisioned mode.

### Q18: What are Condition Expressions in DynamoDB?
**Answer:** Condition Expressions are optional conditions that must be true for a write operation to succeed. Examples: `attribute_not_exists(user_id)` ensures you don't overwrite existing items, `balance >= :amount` ensures sufficient funds before debit, `version = :expected_version` for optimistic locking. If the condition fails, DynamoDB returns a `ConditionalCheckFailedException`.

### Q19: Explain DynamoDB's data replication strategy.
**Answer:** DynamoDB automatically replicates data across 3 Availability Zones within a region for durability and high availability. Writes are acknowledged after data is written to at least 2 AZs. For cross-region replication, you use Global Tables, which replicate data across selected regions with sub-second latency. Each region has an active replica that can serve reads and writes.

### Q20: What is the difference between On-Demand and Provisioned capacity?
**Answer:** Provisioned mode requires you to specify exact RCU/WCU values, offers lower cost for predictable workloads, and supports reserved capacity for further discounts. On-Demand mode automatically scales with traffic, requires no capacity planning, costs more per request but is ideal for unpredictable workloads. You can switch between modes once every 24 hours.

### Q21: How do you handle pagination in DynamoDB?
**Answer:** DynamoDB returns a maximum of 1 MB per Query/Scan call. If there's more data, the response includes `LastEvaluatedKey`. To get the next page, pass this value as `ExclusiveStartKey` in your next request. Continue until `LastEvaluatedKey` is absent from the response. The `Limit` parameter controls the maximum number of items evaluated (not returned after filtering).

### Q22: What is a Sparse Index in DynamoDB?
**Answer:** A sparse index is a GSI where the indexed attribute exists on only some items. DynamoDB only includes items in the GSI that have the indexed attribute, making the index much smaller than the table. Example: A GSI on `refund_date` — only refunded orders have this attribute, so the index only contains refunded orders, making queries like "find all refunds" very efficient.

### Q23: How do you secure DynamoDB?
**Answer:** Security measures: (1) IAM policies for fine-grained access control (table-level and item-level), (2) Encryption at rest (AWS-managed or customer-managed KMS keys), (3) Encryption in transit (TLS/HTTPS), (4) VPC Endpoints for private access (no internet), (5) CloudTrail for API logging, (6) Condition-based IAM policies to restrict access to specific items based on attributes.

### Q24: What is the difference between DynamoDB and MongoDB?
**Answer:** DynamoDB is a fully managed AWS service (serverless, no infrastructure management), while MongoDB can be self-managed or use MongoDB Atlas. DynamoDB uses its own query API; MongoDB uses its query language (MQL). DynamoDB has fixed throughput models (provisioned/on-demand); MongoDB scales differently. DynamoDB integrates natively with AWS services (Lambda, IAM, CloudWatch); MongoDB is cloud-agnostic. DynamoDB has a 400 KB item limit; MongoDB has a 16 MB document limit.

---

## 🚀 What's Next

In the next chapter, we'll build a **full-stack application** integrating DynamoDB with Next.js:

- **Chapter 20: DynamoDB + Next.js Integration** — Build a complete CRUD application with API routes, React components, and DynamoDB as the backend database.

You'll create:
- A DynamoDB table in AWS Console
- Next.js API routes for Create, Read, Update, Delete
- A beautiful React frontend with forms and lists
- Proper error handling and security

---

> 📌 **Remember:** DynamoDB is not a replacement for SQL databases — it's a complement. Use DynamoDB when you need speed and scale with simple access patterns. Use RDS/Aurora when you need complex queries, JOINs, and full ACID transactions.

---

*Last Updated: June 2025*
*Part of the AWS Documentation Series*
