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
