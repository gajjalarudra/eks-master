# Install the EBS CSI driver in cluster

```console
1. Open EKS Console → Clusters → select your cluster (eksdemo1)
2. Go to Add-ons → Get more add-ons
3. Search for EBS CSI Driver
4. Click Next → Create
5. This installs the EBS CSI driver that enables the use of Amazon EBS volumes with Kubernetes.
```
# Verify the installation by checking the DaemonSet in the kube-system namespace:
```console
kubectl get daemonset -n kube-system
```

# IAM role for the permissions and create PIA
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
            "Action": "sts:AssumeRole"
        }
    ]
}
```

# Add on
```console
aws eks create-addon --cluster-name usermgmtqacluster --addon-name eks-pod-identity-agent --addon-version latest
```
# create trust policy
```console
aws iam create-role --role-name eks-pia-role --assume-role-policy-document file://trust-policy.json
```
# create policy ro ebs access
```console
aws iam create-policy --policy-name EBS-Access-Policy --policy-document file://iam-policy-for-ebs.json
```
# attach policy to pod role
```console
aws iam attach-role-policy --role-name EBS-Access-Role --policy-arn arn:aws:iam::390402566276:policy/EBS-Access-Policy
```
# ccreate pod identity assosiation
```console
aws eks create-pod-identity-association --cluster-name usermgmtqacluster --namespace kube-system --service-account aws-access-service --role-arn arn:aws:iam::390402566276:role/eks-pia-role
``

