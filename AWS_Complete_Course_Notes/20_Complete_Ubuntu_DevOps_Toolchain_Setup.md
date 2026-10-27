# 20. Complete Ubuntu DevOps Toolchain Setup: Step-By-Step CLI Codes

This guide provides exhaustive, complete step-by-step Ubuntu CLI commands to provision a full DevOps workstation or CI/CD server from scratch. It includes complete setup for AWS CLI, Docker, Kubernetes (kubectl, minikube, helm), Terraform, Ansible, Jenkins, Prometheus, and Grafana.

## 1. System Update and Prerequisites

Always start by updating your Ubuntu system and installing core utilities.

```bash
# Update and upgrade system packages
sudo apt update -y && sudo apt upgrade -y

# Install essential build tools, curl, wget, and networking utilities
sudo apt install -y curl wget apt-transport-https ca-certificates software-properties-common gnupg lsb-release unzip git jq tree python3-pip python3-venv
```

## 2. Docker Engine (Production Installation)

Do not use the default Ubuntu repository for Docker. Use the official Docker repository for the latest version.

```bash
# 1. Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 2. Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 3. Install Docker Engine, containerd, and Docker Compose plugin
sudo apt update -y
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. Add your user to the docker group (avoid using sudo for docker commands)
sudo usermod -aG docker $USER

# 5. Enable and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# NOTE: You must log out and log back in (or run 'newgrp docker') for the group change to take effect.
docker --version
docker compose version
```

## 3. AWS CLI v2 and AWS Tools (eksctl, copilot)

```bash
# 1. Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
rm -rf awscliv2.zip aws/
aws --version

# 2. Configure AWS CLI (Requires your Access Key and Secret)
# aws configure

# 3. Install eksctl (The official CLI for Amazon EKS)
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
eksctl version

# 4. Install AWS Copilot (CLI for Amazon ECS)
curl -Lo copilot https://github.com/aws/copilot-cli/releases/latest/download/copilot-linux
chmod +x copilot
sudo mv copilot /usr/local/bin/copilot
copilot --version
```

## 4. Kubernetes Tools (kubectl, Helm, Minikube)

```bash
# 1. Install kubectl
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.29/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.29/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt update -y
sudo apt install -y kubectl
kubectl version --client

# 2. Install Helm (Kubernetes Package Manager)
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
sudo apt-get install apt-transport-https --yes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt update -y
sudo apt install -y helm
helm version

# 3. Install Minikube (Local Kubernetes Cluster for testing)
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
rm minikube-linux-amd64
# minikube start --driver=docker
```

## 5. Infrastructure as Code: Terraform and Terragrunt

```bash
# 1. Install HashiCorp Terraform
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update -y && sudo apt install -y terraform
terraform -version

# 2. Install Terragrunt (Wrapper for Terraform to keep DRY code)
TG_VERSION=$(curl -s https://api.github.com/repos/gruntwork-io/terragrunt/releases/latest | jq -r .tag_name)
curl -Lo terragrunt https://github.com/gruntwork-io/terragrunt/releases/download/${TG_VERSION}/terragrunt_linux_amd64
chmod +x terragrunt
sudo mv terragrunt /usr/local/bin/
terragrunt -version
```

## 6. Configuration Management: Ansible

```bash
# 1. Add Ansible PPA and install
sudo apt-add-repository -y ppa:ansible/ansible
sudo apt update -y
sudo apt install -y ansible

# 2. Verify installation
ansible --version

# 3. Install common Ansible collections for AWS
ansible-galaxy collection install amazon.aws
```

## 7. CI/CD Server: Jenkins

```bash
# 1. Install Java Development Kit (Jenkins dependency)
sudo apt install -y fontconfig openjdk-17-jre

# 2. Add Jenkins repository and key
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

# 3. Install Jenkins
sudo apt update -y
sudo apt install -y jenkins

# 4. Enable and start Jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins

# 5. Fetch initial admin password
echo "Jenkins Initial Admin Password:"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
# Access Jenkins at http://YOUR_SERVER_IP:8080
```

## 8. Observability Stack: Prometheus and Grafana

```bash
# --- PROMETHEUS ---
# 1. Create Prometheus user and directories
sudo useradd --no-create-home --shell /bin/false prometheus
sudo mkdir /etc/prometheus
sudo mkdir /var/lib/prometheus
sudo chown prometheus:prometheus /etc/prometheus /var/lib/prometheus

# 2. Download Prometheus
PROM_VER="2.45.0"
wget https://github.com/prometheus/prometheus/releases/download/v${PROM_VER}/prometheus-${PROM_VER}.linux-amd64.tar.gz
tar xvf prometheus-${PROM_VER}.linux-amd64.tar.gz
cd prometheus-${PROM_VER}.linux-amd64

# 3. Copy binaries and configure permissions
sudo cp prometheus promtool /usr/local/bin/
sudo chown prometheus:prometheus /usr/local/bin/prometheus /usr/local/bin/promtool
sudo cp -r consoles console_libraries prometheus.yml /etc/prometheus
sudo chown -R prometheus:prometheus /etc/prometheus/

# 4. Create Prometheus Systemd Service
cat << 'EOF' | sudo tee /etc/systemd/system/prometheus.service
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
    --config.file /etc/prometheus/prometheus.yml \
    --storage.tsdb.path /var/lib/prometheus/ \
    --web.console.templates=/etc/prometheus/consoles \
    --web.console.libraries=/etc/prometheus/console_libraries

[Install]
WantedBy=multi-user.target
EOF

# 5. Start Prometheus
sudo systemctl daemon-reload
sudo systemctl enable prometheus
sudo systemctl start prometheus

# --- GRAFANA ---
# 1. Install Grafana prerequisite
sudo apt-get install -y apt-transport-https software-properties-common wget

# 2. Add Grafana Key and Repository
sudo mkdir -p /etc/apt/keyrings/
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list

# 3. Install Grafana
sudo apt-get update -y
sudo apt-get install -y grafana

# 4. Enable and start Grafana
sudo systemctl daemon-reload
sudo systemctl enable grafana-server
sudo systemctl start grafana-server
# Access Grafana at http://YOUR_SERVER_IP:3000 (admin/admin)
```

This completes the provisioning of an entire enterprise-grade DevOps platform directly from the Ubuntu CLI.
