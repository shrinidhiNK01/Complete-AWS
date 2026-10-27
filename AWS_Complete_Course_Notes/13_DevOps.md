# 13. AWS DevOps & Infrastructure as Code (IaC): CloudFormation, CDK, and CodeSuite

Deploying applications manually using the AWS Management Console is slow, error-prone, and hard to replicate. In production, we use **Infrastructure as Code (IaC)** to define our resources in files, and **CI/CD Pipelines** to deploy updates automatically.

---

## 1. AWS CloudFormation (Declarative IaC)
AWS CloudFormation allows you to model and set up your AWS resources using JSON or YAML templates.

### CloudFormation Template Sections:
*   **AWSTemplateFormatVersion:** The version of the template format (always use `"2010-09-09"`).
*   **Parameters:** Allows you to input custom values when deploying the stack (e.g., choosing database size or key-pair names).
*   **Mappings:** A lookup table (e.g., matching AMI IDs to specific AWS Regions).
*   **Conditions:** Logic rules deciding whether specific resources are created (e.g., "Only create a database replica if Environment == Production").
*   **Resources (Mandatory):** The actual AWS resources to be created (e.g., EC2 instances, S3 buckets, IAM roles).
*   **Outputs:** Key values returned after successful deployment (e.g., the URL of your new website load balancer).

### Complete YAML CloudFormation Template Example
This template launches a public S3 bucket and an EC2 instance with user data.

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'CloudFormation template to launch an S3 bucket and an EC2 instance'

Parameters:
  EnvName:
    Type: String
    Default: dev
    AllowedValues: [dev, prod]
    Description: Environment name

Resources:
  AppS3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'my-app-data-bucket-${EnvName}-12345'
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

  WebServerInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: t3.micro
      ImageId: ami-0c7217cdde317cfec # Amazon Linux 2023 AMI in us-east-1
      Tags:
        - Key: Name
          Value: !Sub 'web-server-${EnvName}'

Outputs:
  BucketARN:
    Description: ARN of the created S3 bucket
    Value: !GetAtt AppS3Bucket.Arn
```

### Advanced CloudFormation Features:
*   **Change Sets:** Allows you to preview how a deployment will affect your running resources before executing it (e.g., showing if a change will destroy and recreate an active database).
*   **StackSets:** Allows you to deploy a CloudFormation stack across multiple AWS accounts and multiple AWS regions with a single operation.
*   **Drift Detection:** Identifies resources inside a stack that have been modified manually outside of CloudFormation (e.g., if a developer manually opened a port in a security group via the console).

---

## 2. AWS CDK (Cloud Development Kit - Imperative IaC)
AWS Cloud Development Kit is an open-source software development framework to define cloud infrastructure in familiar programming languages like **TypeScript, Python, Java, or C#**. Under the hood, the CDK compiles your code into standard CloudFormation templates.

### CDK Commands (CLI):
*   `cdk init app --language typescript`: Initializes a new CDK project.
*   `cdk diff`: Compares your local code configuration to what is currently deployed in AWS.
*   `cdk synth`: Compiles (synthesizes) your code into a CloudFormation YAML template.
*   `cdk deploy`: Deploys the infrastructure stack to AWS.

### CDK TypeScript Code Example
This CDK stack defines an S3 bucket and enables KMS encryption.

```typescript
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';

export class MyCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Create a custom KMS key for bucket encryption
    const myKey = new kms.Key(this, 'MyBucketKey', {
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For dev only
    });

    // 2. Create S3 Bucket encrypted with the custom key
    new s3.Bucket(this, 'MySecureBucket', {
      versioned: true,
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: myKey,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For dev only
      autoDeleteObjects: true, // For dev only
    });
  }
}
```

---

## 3. AWS CI/CD CodeSuite

AWS provides native developer tools to compile, test, and deploy code:

```
[ Git Push to CodeCommit ] -> [ Build & Test in CodeBuild ] -> [ Deploy to ECS/EC2 via CodeDeploy ]
\____________________________________________________________________________________________/
                                 Orchestrated by CodePipeline
```

### 1. AWS CodePipeline
An orchestration service that models, visualizes, and automates the steps required to release your software. It connects source repositories (CodeCommit, GitHub, Bitbucket) to build tools and deployment targets.

### 2. AWS CodeBuild
A fully managed continuous integration service that compiles source code, runs unit tests, and produces software packages (artifacts) ready for deployment.
*   **buildspec.yml:** You define the build steps in a `buildspec.yml` file placed in the root directory of your source code.

#### Complete `buildspec.yml` Example:
```yaml
version: 0.2

phases:
  install:
    runtime-versions:
      nodejs: 18
    commands:
      - echo Installing dependencies...
      - npm install
  pre_build:
    commands:
      - echo Running unit tests...
      - npm test
  build:
    commands:
      - echo Building application...
      - npm run build
  post_build:
    commands:
      - echo Build completed on `date`
artifacts:
  files:
    - '**/*'
  discard-paths: no
```

### 3. AWS CodeDeploy
A deployment service that automates application deployments to Amazon EC2 instances, on-premises instances, serverless Lambda functions, or ECS services.
*   **Deployment Strategies:**
    *   *In-place:* Updates existing servers one by one. Results in temporary capacity reduction.
    *   *Blue/Green:* Launches a complete new set of instances (Green), deploys the new code there, tests it, and then shifts traffic from old instances (Blue) to new ones using Route 53 or load balancers. Safe and fast rollbacks.
    *   *Canary:* Deploys to a tiny subset of users first (e.g., 10% traffic for 30 minutes). If no errors occur, it rolls out to everyone.
*   **appspec.yml:** Defines the deployment lifecycle hooks (e.g., running scripts before installing, after installing, and validating service).

#### Complete `appspec.yml` Example (for EC2 deployment):
```yaml
version: 0.0
os: linux
files:
  - source: /index.html
    destination: /var/www/html/
hooks:
  BeforeInstall:
    - location: scripts/install_dependencies.sh
      timeout: 300
      runas: root
  ApplicationStart:
    - location: scripts/start_server.sh
      timeout: 300
      runas: root
  ValidateService:
    - location: scripts/validate_service.sh
      timeout: 120
      runas: root
```
