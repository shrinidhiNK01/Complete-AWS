# 14. AWS Analytics & Big Data: Kinesis, Athena, Glue, Redshift, and OpenSearch

To process, clean, analyze, and visualize massive datasets (petabytes of data), AWS offers a powerful suite of big data and analytics tools.

---

## 1. Amazon Kinesis: Real-Time Data Streaming
Amazon Kinesis makes it easy to collect, process, and analyze real-time, streaming data so you can get timely insights and react quickly to new information.

```
+---------------------------------------------------------------------------------------+
|                               AMAZON KINESIS SUITE                                   |
|                                                                                       |
|  [ Producers ]                                                   [ Consumers ]        |
|  - IoT Devices   ===> [ KINESIS DATA STREAMS ] (1sec latency) ===> - Custom EC2 App    |
|  - App Logs           (Shard-based scaling, raw stream)             - Lambda Functions|
|                                                                                       |
|  - Clickstreams  ===> [ KINESIS DATA FIREHOSE ] (Near real-time) =>- Amazon S3        |
|                       (Zero administration, loads data to destinations) - Redshift    |
+---------------------------------------------------------------------------------------+
```

### Kinesis Family Breakdown:

#### 1. Kinesis Data Streams (KDS)
*   **What it is:** A highly customizable, low-latency (under 1 second) real-time data streaming service.
*   **Architecture:** Streams are divided into **Shards**. One shard allows 1 MB/sec ingest and 2 MB/sec egress. You scale by adding or merging shards.
*   **Data Retention:** 1 day by default, expandable up to 365 days. Data can be replayed.
*   **Consumers:** Custom code on EC2 (Kinesis Client Library), Lambda, or Kinesis Data Analytics.

#### 2. Kinesis Data Firehose (KDF)
*   **What it is:** A fully managed, serverless delivery stream that loads streaming data into destinations.
*   **How it works:** It captures data, optionally transforms it (using a Lambda function), and writes it to destinations in **batches** based on file size (e.g., 5 MB) or time interval (e.g., 60 seconds).
*   **Destinations:** Amazon S3, Amazon Redshift, Amazon OpenSearch, or Splunk.
*   *Note:* There is no data retention. Data cannot be replayed from Firehose.

#### 3. Kinesis Data Analytics (KDA)
*   **What it is:** Allows you to process and analyze streaming data using SQL or Apache Flink in real-time.

#### 4. Kinesis Video Streams (KVS)
*   **What it is:** Ingests and stores live video streams from cameras or IoT devices for playback or machine learning analysis.

---

## 2. Serverless Analytics: Athena & Glue

For data lakes built on Amazon S3, you can query and transform data without provisioning servers:

### Amazon Athena (Serverless SQL Queries)
*   **What it is:** An interactive query service that lets you analyze data in **Amazon S3 directly using standard SQL**.
*   **Pricing:** You pay only for the queries you run. Cost is based on the **amount of data scanned** (typically $5 per Terabyte scanned).
*   **Best Practices to Save Costs:**
    *   *Columnar Storage:* Convert raw text data (CSV, JSON) into columnar formats like **Apache Parquet or ORC**. This reduces scanned data by up to 90%.
    *   *Partitioning:* Organize S3 paths by date or region (e.g., `s3://bucket/year=2026/month=06/`). Athena will only scan files inside the matching folders.

### AWS Glue (Serverless ETL & Data Integration)
*   **What it is:** A serverless data integration service that makes it easy to discover, prepare, and combine data for analytics.
*   **Core Components:**
    1.  **Glue Data Catalog:** A centralized metadata repository containing table schemas and locations.
    2.  **Glue Crawlers:** Scripts that scan files in S3 or RDS databases, automatically determine their schemas, and write tables into the Data Catalog.
    3.  **Glue ETL Jobs:** Automatic Python or Spark code generators to extract data from a source, transform it (clean it, change formats), and load it into a data warehouse (ETL).

---

## 3. Data Warehousing: Amazon Redshift
Amazon Redshift is a fast, fully managed, petabyte-scale **data warehouse** service.

*   **OLTP vs. OLAP:**
    *   *OLTP (Online Transaction Processing):* Standard databases (like RDS) designed for frequent, fast inserts/updates of single rows.
    *   *OLAP (Online Analytical Processing):* Redshift. Designed for complex analytical queries scanning millions of rows to find averages, sums, and trends.
*   **Columnar Storage:** Instead of storing entire rows together, Redshift stores columns together on disk. If a query only requests the `revenue` column, Redshift only reads that column, speeding up queries.
*   **Architecture:** Works as a cluster consisting of a **Leader Node** (receives queries, parses them) and multiple **Compute Nodes** (runs the queries on split data in parallel).
*   **Distribution Styles:** Determines how compute nodes share data. Options include `KEY` (based on column values), `ALL` (copies table to every node), `EVEN` (round-robin), or `AUTO`.

---

## 4. Big Data Frameworks: EMR, OpenSearch, and QuickSight

### Amazon EMR (Elastic MapReduce)
*   **What it is:** A managed cluster platform that simplifies running open-source big data frameworks, such as **Apache Hadoop, Apache Spark, Hive, Presto, and HBase**.
*   **Use Case:** Large-scale log analysis, web indexing, data transformations, and machine learning model training on massive datasets.

### Amazon OpenSearch Service
*   **What it is:** The successor to Amazon Elasticsearch Service. A managed search and analytics engine.
*   **Use Cases:** Full-text search on web sites, application log monitoring (using Logstash/Kibana - ELK stack), and real-time dashboard analytics.

### Amazon QuickSight
*   **What it is:** A serverless, fast, cloud-powered Business Intelligence (BI) service.
*   **Purpose:** Create interactive dashboards and visualizations for business users.
*   **SPICE (Super-fast Parallel In-memory Calculation Engine):** A powerful in-memory engine that caches data in QuickSight to deliver rapid response times when users interact with graphs.
