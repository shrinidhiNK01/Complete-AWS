# 10. Containerization on AWS: Docker, ECS, EKS, and Fargate

Containerization allows you to package your application code, dependencies, libraries, and runtime environment into a single unit called a **Container Image**. This ensures your application runs identically on a developer's laptop, a test environment, and in production on AWS.

---

## 1. Docker & Kubernetes Core Concepts

Before deploying containers in AWS, you must understand the underlying container technologies.

### Docker Concepts:
*   **Dockerfile:** A text document containing commands a user calls on the command line to assemble a container image.
*   **Container Image:** A read-only template with instructions for creating a Docker container.
*   **Container:** A runnable instance of a container image.
*   **Docker Registry:** A storage system for container images (e.g., Docker Hub, AWS ECR).

#### Production-Ready Dockerfile Example (Node.js App)
```dockerfile
# Step 1: Use official lightweight Node.js base image
FROM node:18-alpine

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package files first (to leverage Docker layer caching)
COPY package*.json ./

# Step 4: Install production dependencies only
RUN npm ci --only=production

# Step 5: Copy application code
COPY . .

# Step 6: Expose the application port
EXPOSE 3000

# Step 7: Define start command
CMD ["node", "server.js"]
```

### Kubernetes Concepts:
Kubernetes (K8s) is an open-source container orchestration engine.
*   **Pod:** The smallest deployable unit in Kubernetes. Contains one or more containers sharing network and storage.
*   **Deployment:** Defines the desired state for your pods (e.g., "Run 3 replicas of the web app pod"). Handles rolling updates.
*   **Service:** An abstract way to expose an application running on a set of Pods as a network service (load balancer).
*   **ConfigMap / Secret:** Stores configuration parameters and sensitive keys.

---

## 2. Amazon ECR (Elastic Container Registry)
Amazon ECR is a fully managed Docker container registry. You push your built Docker images to ECR, and services like ECS or EKS pull the images during deployment.

### Pushing an Image to ECR (AWS CLI Commands):
```bash
# 1. Authenticate Docker to your ECR registry
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# 2. Build your local Docker image
docker build -t my-web-app .

# 3. Tag your image to match your ECR repository
docker tag my-web-app:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-web-app:latest

# 4. Push the image to ECR
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-web-app:latest
```

---

## 3. Amazon ECS (Elastic Container Service)
Amazon ECS is a highly scalable, high-performance container orchestration service. It is an AWS-native alternative to Kubernetes.

```
       +--------------------------------------------+
       |                ECS Cluster                 |
       |                                            |
       |  +--------------------------------------+  |
       |  |             ECS Service              |  |
       |  |                                      |  |
       |  |  +------------+      +------------+  |  |
       |  |  |  ECS Task  |      |  ECS Task  |  |  |
       |  |  | (Container)|      | (Container)|  |  |
       |  |  +------------+      +------------+  |  |
       |  +--------------------------------------+  |
       +--------------------------------------------+
```

### ECS Terminology:
*   **Task Definition:** A JSON text file that describes one or more containers that form your application. It defines parameters like CPU, memory, ports, environment variables, and ECR images.
*   **Task:** An active, running instantiation of a Task Definition inside the cluster.
*   **Service:** Guarantees that the specified number of Tasks are running and registered with a Load Balancer.
*   **Cluster:** A logical grouping of tasks or services.

### ECS Launch Types:
When you run tasks, you must select where the physical compute resources reside:
1.  **EC2 Launch Type:**
    *   You manage a fleet of virtual machines (EC2) that act as container hosts.
    *   *Pros:* Complete control over VM configuration and pricing.
    *   *Cons:* You must manage, scale, and patch the underlying EC2 instances.
2.  **Fargate Launch Type (Serverless Containers):**
    *   AWS provisions and manages the compute hosts. You only configure memory and CPU for your tasks.
    *   *Pros:* Fully serverless. No EC2 instances to manage or scale. Pay by the second per task.
    *   *Cons:* Slightly higher cost per compute unit.

---

## 4. Amazon EKS (Elastic Kubernetes Service)
Amazon EKS is a managed service that makes it easy to run Kubernetes on AWS without needing to install or operate your own Kubernetes control plane.

### EKS Architecture:
*   **Control Plane:** AWS manages the Kubernetes API server, `etcd` database, and controller managers across 3 Availability Zones.
*   **Worker Nodes:** The servers running the pods. These can be:
    *   *Self-Managed Nodes:* You create and configure EC2 instances yourself.
    *   *Managed Node Groups:* AWS provisions and updates the EC2 worker instances for you.
    *   *AWS Fargate Profiles:* Run Kubernetes pods serverless. AWS provisions compute on-demand for each pod.

### Example Kubernetes Deployment Manifest (`deployment.yaml`)
This configuration file instructs Kubernetes to launch 3 replicas of a web application container pulled from Amazon ECR.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app-deployment
  labels:
    app: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-web-app:latest
        ports:
        - containerPort: 3000
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "250m"
            memory: "256Mi"
```
