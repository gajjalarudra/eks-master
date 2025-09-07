# Install AWS Loadbalancer controller

# Introduction
1. The AWS Load Balancer Controller is a controller that integrates with the Kubernetes cluster to manage AWS Elastic Load Balancers for a Kubernetes cluster. 
2. It automatically provisions and configures Application Load Balancers (ALBs) and Network Load Balancers (NLBs) based on the Ingress and Service resources defined in the cluster.

# Prerequisites
1. An existing EKS cluster.
2. kubectl configured to communicate with your EKS cluster.
3. eksctl installed and configured.
4. IAM OIDC provider associated with your EKS cluster.
5. AWS CLI installed and configured with appropriate permissions.
6. Helm installed.
7. cert-manager installed in the cluster.
8. kubectl version 1.19 or later.
9. AWS Load Balancer Controller IAM policy.
10. AWS Load Balancer Controller service account.
11. AWS Load Balancer Controller Helm chart repository.
12. AWS Load Balancer Controller installed in the cluster.

# Setup IAM Service account

1. Create IAM OIDC Provider
```console
eksctl utils associate-iam-oidc-provider --region <region> --cluster <cluster-name> --approve

## Replace the region and cluster name with actual names
eksctl utils associate-iam-oidc-provider --region ap-south-1 --cluster usermgmtdemocluster --approve
```
2. Create IAM policy for AWS Load Balancer Controller (Download the I am policy for AWS LB controller using below command)
```console
curl -o iam-policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json

aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam-policy.json

"Arn": "arn:aws:iam::xxxxxxxxxx:policy/AWSLoadBalancerControllerIAMPolicy",
```
Take the POlicy  ARN that returned.

3. Create IAM service account for AWS Load Balancer Controller
```console
eksctl create iamserviceaccount --cluster=usermgmtqacluster --namespace=kube-system --name=aws-load-balancer-controller-sa --attach-policy-arn=arn:aws:iam::390402566276:policy/AWSLoadBalancerControllerIAMPolicy --override-existing-serviceaccounts --approve
```
Replace the <cluster-name> and <AWS_ACCOUNT_ID> with actual values.

4. Verify the service account is created
```console
kubectl get sa -n kube-system
```
# Install cert-manager using Helm
```console
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.18.2/cert-manager.crds.yaml

## Add the Jetstack Helm repository
$ helm repo add jetstack https://charts.jetstack.io --force-update

## Install the cert-manager helm chart
$ helm install cert-manager --namespace cert-manager --version v1.18.2 jetstack/cert-manager
```
# Install AWS load balancer contorller

1. Add the EKS repository to HELM
```console
helm repo add eks https://aws.github.io/eks-charts
```
2. Install the TargetGroupBinding CRDS
```console
kubectl apply -k "github.com/aws/eks-charts/stable/aws-load-balancer-controller/crds?ref=master"
```
3. Install the controller
```console
# NOTE: The clusterName value must be set either via the values.yaml or the Helm command line. The <k8s-cluster-name> in the command
# below should be replaced with name of your k8s cluster before running it.
helm upgrade -i aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system --set clusterName=usermgmtqacluster --set serviceAccount.create=false --set serviceAccount.name=aws-load-balancer-controller-sa --set region=ap-south-1 --set vpcId=vpc-0f146f1a3f2732850
```
4. Verify the load balancer controller
```console
kubectl -n kube-system get all
```

# External DNS 

1. Create IAM Policy

```console
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "route53:ChangeResourceRecordSets"
      ],
      "Resource": [
        "arn:aws:route53:::hostedzone/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "route53:ListHostedZones",
        "route53:ListResourceRecordSets"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
```
Make a note of Policy ARN which we will use in next step

2. Create IAM role and k8s servcie account

```console

# Template
eksctl create iamserviceaccount \
    --name service_account_name \
    --namespace service_account_namespace \
    --cluster cluster_name \
    --attach-policy-arn IAM_policy_ARN \
    --approve \
    --override-existing-serviceaccounts

# Replaced name, namespace, cluster, arn 
eksctl create iamserviceaccount --name external-dns --namespace default --cluster usermgmtqacluster --attach-policy-arn arn:aws:iam::390402566276:policy/external-dns-policy --approve --override-existing-serviceaccounts
```
3. Verify the Service account
```console
kubectl get sa external-dns
```
4. Cretae the external-dns deployment
```console
kubectl apply -f external-dns.yml
```








