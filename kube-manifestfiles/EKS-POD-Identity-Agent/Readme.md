Step-00: What we’ll do
In this demo, we’ll understand and implement the Amazon EKS Pod Identity Agent (PIA).

Install the EKS Pod Identity Agent add-on
Create a Kubernetes AWS CLI Pod in the EKS Cluster and attempt to list S3 buckets (this will fail initially)
Create an IAM Role with trust policy for Pod Identity → allow Pods to access Amazon S3
Create a Pod Identity Association between the Kubernetes Service Account and IAM Role
Re-test from the AWS CLI Pod, successfully list S3 buckets
Through this flow, we will clearly understand how Pod Identity Agent works in EKS
```console
Step-01: Install EKS Pod Identity Agent
Open EKS Console → Clusters → select your cluster (eksdemo1)
Go to Add-ons → Get more add-ons
Search for EKS Pod Identity Agent
Click Next → Create
This installs a DaemonSet (eks-pod-identity-agent) that enables Pod Identity associations.
You can verify the installation by checking the DaemonSet in the kube-system namespace:
```

# List k8s PIA Resources
kubectl get daemonset -n kube-system

# List k8s Pods
```consloe
kubectl get pods -n kube-system
kubectl get pods -n kube-system | grep eks-pod-identity-agent
Step-02: Deploy AWS CLI Pod (without Pod Identity Association)
```
# Create Service Account
k8s-service-account.yml
```console
apiVersion: v1
kind: ServiceAccount
metadata:
  name: aws-cli-sa
  namespace: default
```
# Create a simple Kubernetes Pod with AWS CLI image:
aws-cli-pod.yml
```console
apiVersion: v1
kind: Pod
metadata:
  name: aws-cli
  namespace: default
spec:
  serviceAccountName: aws-cli-sa
  containers:
  - name: aws-cli
    image: amazon/aws-cli
    command: ["sleep", "infinity"]
```
# Deploy CLI Pod
```console
kubectl apply -f EKS-POD-Identity-Agent/
kubectl get pods
```

# Create IAM Role for Pod Identity
Go to IAM Console → Roles → Create Role
Select Trusted entity type → Custom trust policy
Add trust policy for Pod Identity, for example:
```console
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "pods.eks.amazonaws.com"
            },
            "Action": [
                "sts:AssumeRole",
                "sts:TagSession"
            ]
        }
    ]
}
```
# Attach AmazonS3ReadOnlyAccess policy
Create role → example name: EKS-PI-S3ReadOnly
# Create Pod Identity Association
Go to EKS Console → Cluster → Access → Pod Identity Associations

Create new association:

Namespace: default
Service Account: aws-cli-sa
IAM Role: EKS-PodIdentity-S3-ReadOnly-Role-101
Click on create
# Test Again
Pods don’t automatically refresh credentials after a new Pod Identity Association; they must be restarted.

Restart Pod
# Delete Pod
kubectl delete pod aws-cli -n default

# Create Pod
kubectl apply -f EKS-POD-Identity-Agent/

# List Pods
kubectl get pods
Exec into the Pod:
# List S3 buckets
kubectl exec -it aws-cli -- aws s3 ls
Observation: This time it should succeed, listing all S3 buckets.

