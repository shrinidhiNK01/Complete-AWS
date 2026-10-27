# 09. Serverless Architecture: Lambda, API Gateway, EventBridge, and Step Functions

**Serverless** does not mean there are no servers. It means you do not have to provision, manage, scale, or patch servers. AWS handles the entire infrastructure. You only write application logic (code) and configure integrations. You pay only for resources when your code is executing.

---

## 1. AWS Lambda: Serverless Compute

AWS Lambda runs code in response to events (HTTP requests, file uploads, database modifications). You upload your code, and Lambda handles scaling from 0 to thousands of concurrent executions automatically.

### Key Concepts & Limits
*   **Trigger:** The event source that starts the function (e.g., S3 upload, API Gateway request, SQS message).
*   **Handler:** The entry point function in your code that AWS Lambda calls when execution starts.
*   **Memory:** You configure memory from 128 MB to 10,240 MB (10 GB). *Note:* CPU capacity scales proportionally with the memory allocated.
*   **Timeout:** Max execution time is **15 minutes** (900 seconds).
*   **Ephemeral Disk Storage (`/tmp`):** Temporary disk space from 512 MB to 10 GB.

---

## 2. Deep Dive: Cold Starts & Concurrency

When a Lambda function is triggered, AWS must set up a container environment, download your code, and initialize the runtime (Node.js, Python, Java). 

```
[ TRIGGER ] -> [ Download Code ] -> [ Start Runtime ] -> [ Init Code (Outside handler) ] -> [ Run Handler ]
               \____________________________________________________________________/
                                      "Cold Start" Latency
```

*   **Cold Start:** The latency overhead that occurs when a function is called for the first time or after a period of inactivity because AWS must spin up a new container.
*   **Warm Start:** Subsequent calls reuse the active container, resulting in sub-millisecond execution times.

### Mitigating Cold Starts
1.  **Reduce Package Size:** Import only specific libraries (e.g., import `S3Client` from `@aws-sdk/client-s3` instead of the whole AWS SDK).
2.  **Use Provisioned Concurrency:** Allocates pre-warmed execution environments. Keeps containers warm and ready to run. Costs money even if the functions are not running.
3.  **Optimize Code Initialization:** Keep heavy DB connection logic outside the handler function so it runs only once per container initialization, not on every execution.

### Concurrency Types
*   **Reserved Concurrency:** Sets the maximum number of concurrent executions for a specific function. Acts as a guardrail to prevent a rogue function from consuming all account concurrency.
*   **Provisioned Concurrency:** Pre-warms containers for instant scaling.

---

## 3. Lambda Code Examples

### 1. Python Handler (Reads data from an S3 bucket trigger)
This function triggers whenever a new file is uploaded to an S3 bucket, reads the file content, and logs it.

```python
import json
import urllib.parse
import boto3

# Initialize S3 client outside the handler to reuse connection across warm starts
s3 = boto3.client('s3')

def lambda_handler(event, context):
    # Log incoming event payload
    print("Received event: " + json.dumps(event, indent=2))

    # Extract bucket name and object key from S3 trigger event
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    
    try:
        # Fetch object content
        response = s3.get_object(Bucket=bucket, Key=key)
        content = response['Body'].read().decode('utf-8')
        
        print(f"Content of file {key} from bucket {bucket}:")
        print(content)
        
        return {
            'statusCode': 200,
            'body': json.dumps('File processed successfully!')
        }
    except Exception as e:
        print(f"Error fetching object: {e}")
        raise e
```

---

## 4. Amazon API Gateway: Serverless API Management

API Gateway is a managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs. It acts as the "front door" for applications to access backend services like Lambda, EC2, or DynamoDB.

### API Gateway Types:
1.  **REST APIs:** Highly customizable, feature-rich APIs. Supports caching, request transformation, API keys, client certificates, and edge-optimization.
2.  **HTTP APIs:** Optimized for low latency and low cost (up to 70% cheaper than REST). Ideal for simple serverless backends. Supports JWT/OIDC authentication.
3.  **WebSocket APIs:** Real-time two-way communication (chat apps, gaming dashboards).

### Core Features:
*   **Throttling:** Implements the **Token Bucket Algorithm**. Limits API usage to prevent DDoS attacks (e.g., default limit of 10,000 requests per second per account).
*   **Caching:** Caches responses for a set time (TTL) to avoid calling Lambda functions on identical requests.
*   **CORS (Cross-Origin Resource Sharing):** Configuration to allow web apps hosted on domain A to safely call the API hosted on domain B.
*   **Authorizers:** Secures APIs using **Cognito User Pools** or custom **Lambda Authorizers** (validates Bearer tokens).

---

## 5. Amazon EventBridge: Serverless Event Bus
EventBridge is a serverless event bus that makes it easy to build **event-driven architectures**. It receives events from AWS services, SaaS apps (like Zendesk, Auth0), or custom applications, and routes them to targets.

```
[ Event Source ] -> [ Event Bus ] -> [ Rules / Filters ] -> [ Targets: Lambda, SQS, Step Functions ]
```

### Key Elements:
*   **Event Buses:** The receiver of events. You have a `default` bus for AWS events, and can create custom buses for your applications.
*   **Rules:** JSON documents that filter incoming events and match patterns. If an event matches, it is forwarded to targets.
*   **Targets:** The destination (e.g., Lambda, Step Functions, SQS, SNS).
*   **EventBridge Pipes:** A point-to-point integration tool that connects an event source (like a DynamoDB stream) to a target (like an API gateway) with built-in filtering, transformation, and enrichment.

---

## 6. AWS Step Functions: Serverless Workflows
When you need to coordinate multiple Lambda functions, databases, and microservices into a multi-step workflow, you use **AWS Step Functions**. It manages state, retry logic, and error handling.

Workflows are defined using the **Amazon States Language (ASL)**, a JSON/YAML-based schema.

### Core State Types:
*   **Task State:** Performs work (calls a Lambda function, runs an ECS container).
*   **Choice State:** Implements branching logic (e.g., if payment is successful, go to state A; else, go to state B).
*   **Parallel State:** Runs multiple execution branches at the same time.
*   **Map State:** Iterates over a list of items (loops) and runs tasks for each.
*   **Pass State:** Filters or modifies JSON inputs without doing work.

### Complete ASL JSON Workflow Example
This state machine checks an order, runs a payment task, and routes to success or failure states.

```json
{
  "Comment": "A simple order processing workflow",
  "StartAt": "ProcessPayment",
  "States": {
    "ProcessPayment": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:ProcessPaymentFunction",
      "Next": "CheckPaymentStatus"
    },
    "CheckPaymentStatus": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.paymentStatus",
          "StringEquals": "SUCCESS",
          "Next": "FulfillOrder"
        }
      ],
      "Default": "PaymentFailed"
    },
    "FulfillOrder": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:FulfillOrderFunction",
      "End": true
    },
    "PaymentFailed": {
      "Type": "Fail",
      "Error": "PaymentFailedException",
      "Cause": "The payment authorization failed."
    }
  }
}
```



## 10. Interactive Hands-On Lab: Serverless Functions & API Routing

Deploy and test event-driven Serverless logic using Lambda and API Gateway.

### A. AWS CLI v2 Serverless Operations
```bash
# 1. Create Execution Role (trust-policy.json must trust lambda.amazonaws.com)
aws iam create-role --role-name LambdaExecRole --assume-role-policy-document file://trust-policy.json

# 2. Package Lambda code (main.py) into a Zip file
zip function.zip main.py

# 3. Create and deploy the Lambda Function
aws lambda create-function \
    --function-name ImageProcessorFunction \
    --runtime python3.9 \
    --zip-file fileb://function.zip \
    --handler main.handler \
    --role arn:aws:iam::123456789012:role/LambdaExecRole

# 4. Invoke the Function synchronously
aws lambda invoke --function-name ImageProcessorFunction response.json
```

### B. Python Boto3 SDK Lambda Deployment
```python
import boto3

lambda_client = boto3.client('lambda', region_name='us-east-1')

def invoke_lambda_function(function_name):
    print(f"Invoking {function_name}...")
    response = lambda_client.invoke(
        FunctionName=function_name,
        InvocationType='RequestResponse', # Synchronous invocation
        Payload=b'{"key": "value"}'
    )
    result = response['Payload'].read().decode('utf-8')
    print("Execution Result:", result)

if __name__ == '__main__':
    invoke_lambda_function('ImageProcessorFunction')
```

### C. Terraform IaC Configuration
```hcl
resource "aws_iam_role" "lambda_role" {
  name = "tf_lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_lambda_function" "processor" {
  filename      = "function.zip"
  function_name = "tf-serverless-processor"
  role          = aws_iam_role.lambda_role.arn
  handler       = "main.handler"
  runtime       = "python3.9"
}
```
