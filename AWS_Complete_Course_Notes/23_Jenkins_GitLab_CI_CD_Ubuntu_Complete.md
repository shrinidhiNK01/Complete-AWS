# 23. Complete Jenkins & GitLab CI/CD Pipeline Setup on Ubuntu for AWS

This guide covers the advanced implementation of full CI/CD pipelines using open-source enterprise tools (Jenkins and GitLab CI) on an Ubuntu instance, deploying directly to AWS environments.

## 1. Jenkins Complete CI/CD Setup for AWS ECR and ECS

Assuming Jenkins is installed on your Ubuntu Server (as covered in Guide 20), we will configure a declarative pipeline that builds a Docker image, pushes it to AWS ECR, and updates an ECS Fargate service.

### A. Install Jenkins Plugins
1. Open Jenkins Dashboard -> Manage Jenkins -> Plugins.
2. Install the following plugins:
   - `Docker Pipeline`
   - `Amazon Web Services SDK`
   - `Pipeline: AWS Steps`
   - `Git`

### B. Configure AWS Credentials in Jenkins
1. Go to Manage Jenkins -> Credentials -> System -> Global credentials.
2. Add a new credential of kind **"AWS Credentials"**.
3. ID: `aws-credentials`
4. Enter your AWS Access Key ID and Secret Access Key.

### C. The Jenkinsfile (Declarative Pipeline)

In the root of your application's Git repository, create a `Jenkinsfile`:

```groovy
pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "123456789012"
        AWS_DEFAULT_REGION = "us-east-1"
        IMAGE_REPO_NAME = "taskflow-api"
        IMAGE_TAG = "build-${env.BUILD_NUMBER}"
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
        CLUSTER_NAME = "prod-cluster"
        SERVICE_NAME = "taskflow-api-service"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building the Docker image..."
                    dockerImage = docker.build("${IMAGE_REPO_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Push to AWS ECR') {
            steps {
                withCredentials([aws(credentialsId: 'aws-credentials', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh '''
                        # Login to ECR
                        aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
                        
                        # Tag Image
                        docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:$IMAGE_TAG
                        docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $REPOSITORY_URI:latest
                        
                        # Push Image
                        docker push $REPOSITORY_URI:$IMAGE_TAG
                        docker push $REPOSITORY_URI:latest
                    '''
                }
            }
        }

        stage('Deploy to Amazon ECS') {
            steps {
                withCredentials([aws(credentialsId: 'aws-credentials', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh '''
                        # Force new deployment to fetch the latest image
                        aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force-new-deployment --region $AWS_DEFAULT_REGION
                        
                        echo "Waiting for service to become stable..."
                        aws ecs wait services-stable --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_DEFAULT_REGION
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo "Pipeline succeeded! Application deployed to AWS."
        }
        failure {
            echo "Pipeline failed! Check the Jenkins logs."
        }
    }
}
```

## 2. GitLab CI/CD Complete Setup for AWS

GitLab CI uses a `.gitlab-ci.yml` file placed at the root of the repository. Unlike Jenkins, GitLab uses "Runners" (agents) to execute jobs.

### A. Install GitLab Runner on Ubuntu

```bash
# 1. Download the GitLab Runner binary
sudo curl -L --output /usr/local/bin/gitlab-runner https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64

# 2. Give it execution permissions
sudo chmod +x /usr/local/bin/gitlab-runner

# 3. Create a GitLab CI user
sudo useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash

# 4. Install and run as service
sudo gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner
sudo gitlab-runner start

# 5. Register the runner (Requires URL and Token from your GitLab Project Settings -> CI/CD -> Runners)
sudo gitlab-runner register \
  --non-interactive \
  --url "https://gitlab.com/" \
  --registration-token "YOUR_PROJECT_TOKEN" \
  --executor "shell" \
  --description "Ubuntu AWS Deployment Runner" \
  --tag-list "aws,ubuntu"

# 6. Add gitlab-runner user to docker group
sudo usermod -aG docker gitlab-runner
sudo systemctl restart gitlab-runner
```

### B. Configure GitLab Variables
In your GitLab Project -> Settings -> CI/CD -> Variables, add:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_DEFAULT_REGION` (e.g., `us-east-1`)
- `AWS_ACCOUNT_ID` (e.g., `123456789012`)

### C. The `.gitlab-ci.yml` file

```yaml
variables:
  IMAGE_REPO_NAME: "taskflow-api"
  CLUSTER_NAME: "prod-cluster"
  SERVICE_NAME: "taskflow-api-service"

stages:
  - build
  - push
  - deploy

build_image:
  stage: build
  tags:
    - aws
    - ubuntu
  script:
    - echo "Building Docker image..."
    - docker build -t $IMAGE_REPO_NAME:$CI_PIPELINE_IID .

push_to_ecr:
  stage: push
  tags:
    - aws
    - ubuntu
  script:
    - echo "Logging into AWS ECR..."
    - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
    - echo "Tagging and pushing image..."
    - REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME
    - docker tag $IMAGE_REPO_NAME:$CI_PIPELINE_IID $REPOSITORY_URI:$CI_PIPELINE_IID
    - docker tag $IMAGE_REPO_NAME:$CI_PIPELINE_IID $REPOSITORY_URI:latest
    - docker push $REPOSITORY_URI:$CI_PIPELINE_IID
    - docker push $REPOSITORY_URI:latest

deploy_to_ecs:
  stage: deploy
  tags:
    - aws
    - ubuntu
  script:
    - echo "Deploying to ECS cluster..."
    - aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force-new-deployment --region $AWS_DEFAULT_REGION
    - echo "Waiting for ECS service to stabilize..."
    - aws ecs wait services-stable --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_DEFAULT_REGION
  environment:
    name: production
```

### 3. Conclusion

You now have enterprise-grade, automated CI/CD pipelines capable of picking up code commits from a developer, building a secure Docker container, pushing it to an AWS-hosted private registry, and zero-downtime deploying it to an AWS compute environment, entirely automated via the Ubuntu command line and open-source tooling.
