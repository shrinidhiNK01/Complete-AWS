# 22. Complete Kubernetes & Amazon EKS Setup via Ubuntu CLI

This guide provides the complete, end-to-end Ubuntu terminal commands and YAML files required to configure Amazon EKS, deploy microservices, expose load balancers, and manage persistent volumes entirely through the CLI.

## 1. Cluster Provisioning with eksctl

We will use `eksctl` (which you installed in the previous DevOps toolchain guide) to provision an enterprise-ready cluster.

```bash
# 1. Create a cluster configuration file: cluster.yaml
cat << 'EOF' > cluster.yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: prod-k8s-cluster
  region: us-east-1
  version: "1.29"

iam:
  withOIDC: true

managedNodeGroups:
  - name: standard-nodes
    instanceType: t3.medium
    minSize: 2
    maxSize: 5
    desiredCapacity: 2
    volumeSize: 50
    ssh:
      allow: true
    iam:
      withAddonPolicies:
        autoScaler: true
        ebs: true
        cloudWatch: true
        albIngress: true
EOF

# 2. Deploy the cluster (This takes ~15-20 minutes)
eksctl create cluster -f cluster.yaml

# 3. Verify connection
kubectl cluster-info
kubectl get nodes
```

## 2. Deploying the AWS Load Balancer Controller

To use AWS Application Load Balancers (ALB) and Network Load Balancers (NLB) with Kubernetes, you must install the AWS Load Balancer Controller via Helm.

```bash
# 1. Create IAM Service Account for the Controller
eksctl create iamserviceaccount \
  --cluster=prod-k8s-cluster \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=arn:aws:iam::111122223333:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve \
  --region=us-east-1

# Note: You must replace 111122223333 with your AWS Account ID and download the IAM policy if not present:
# curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.5.4/docs/install/iam_policy.json
# aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy.json

# 2. Add the EKS Helm Chart Repository
helm repo add eks https://aws.github.io/eks-charts
helm repo update

# 3. Install the AWS Load Balancer Controller using Helm
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=prod-k8s-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

# 4. Verify the controller is running
kubectl get deployment -n kube-system aws-load-balancer-controller
```

## 3. Deploying a Full Microservice (Deployment, Service, Ingress)

Now deploy a sample Nginx microservice and expose it to the internet using an AWS Application Load Balancer.

```bash
# 1. Create the application manifest: web-app.yaml
cat << 'EOF' > web-app.yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.24-alpine
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  type: NodePort
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
spec:
  rules:
    - http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nginx-service
                port:
                  number: 80
EOF

# 2. Apply the manifest
kubectl apply -f web-app.yaml

# 3. Check the status of Pods
kubectl get pods -l app=nginx

# 4. Wait for the ALB to provision and fetch the URL
echo "Waiting for Load Balancer provisioning..."
sleep 30
kubectl get ingress nginx-ingress
# Copy the ADDRESS from the output and paste it into your browser.
```

## 4. Setting up EBS Persistent Storage (Stateful Apps)

Databases in Kubernetes require persistent storage so data isn't lost when pods restart. We use the EBS CSI Driver.

```bash
# 1. Create IAM role for EBS CSI Driver
eksctl create iamserviceaccount \
    --name ebs-csi-controller-sa \
    --namespace kube-system \
    --cluster prod-k8s-cluster \
    --role-name AmazonEKS_EBS_CSI_DriverRole \
    --role-only \
    --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy \
    --approve \
    --region us-east-1

# 2. Install the EBS CSI Addon
eksctl create addon \
    --name aws-ebs-csi-driver \
    --cluster prod-k8s-cluster \
    --service-account-role-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/AmazonEKS_EBS_CSI_DriverRole \
    --force

# 3. Create a Persistent Volume Claim (PVC) manifest: ebs-pvc.yaml
cat << 'EOF' > ebs-pvc.yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ebs-sc
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ebs-claim
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: ebs-sc
  resources:
    requests:
      storage: 4Gi
---
apiVersion: v1
kind: Pod
metadata:
  name: app-with-storage
spec:
  containers:
  - name: app
    image: centos
    command: ["/bin/sh"]
    args: ["-c", "while true; do echo $(date) - Hello from EKS >> /data/out.txt; sleep 5; done"]
    volumeMounts:
    - name: persistent-storage
      mountPath: /data
  volumes:
  - name: persistent-storage
    persistentVolumeClaim:
      claimName: ebs-claim
EOF

# 4. Apply storage manifest
kubectl apply -f ebs-pvc.yaml

# 5. Verify the volume is attached and writing data
kubectl get pvc
kubectl exec app-with-storage -- tail -f /data/out.txt
```

## 5. Kubernetes Cleanup

```bash
# 1. Delete all deployed resources
kubectl delete -f ebs-pvc.yaml
kubectl delete -f web-app.yaml

# 2. Delete the EKS cluster (WARNING: Irreversible)
eksctl delete cluster --name prod-k8s-cluster --region us-east-1
```

This ensures you can launch and manage enterprise Kubernetes clusters fully autonomously through the Ubuntu CLI.
