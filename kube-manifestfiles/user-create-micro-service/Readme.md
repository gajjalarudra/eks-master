# Read the secrets from secret manager from the EKS cluster

Follow the below steps.

# AWS Secrets Manager and Config Provider for Secret Store CSI Driver

# 1. Install Secret Store CSI Driver
```console
helm repo add secrets-store-csi-driver https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
helm repo update
helm install -n kube-system csi-secrets-store --set syncSecret.enabled=true --set enableSecretRotation=true secrets-store-csi-driver/secrets-store-csi-driver 
```
# 2. Install AWS Secrets & Configuration Provider (ASCP)

# Option 1: Using helm
```console
helm repo add aws-secrets-manager https://aws.github.io/secrets-store-csi-driver-provider-aws
helm repo update
helm install -n kube-system secrets-provider-aws aws-secrets-manager/secrets-store-csi-driver-provider-aws
```
# Option 2: Using kubectl
```console
kubectl apply -f https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/main/deployment/aws-provider-installer.yaml
```
# 3. Cretae the access policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "secretsmanager:GetResourcePolicy",
                "secretsmanager:GetSecretValue",
                "secretsmanager:DescribeSecret",
                "secretsmanager:ListSecretVersionIds"
            ],
            "Resource": "*"
        }
    ]
}
```
# 4. Attach the IAM policy to the EKS Nodegroup Role 
# 5. Create Service Account with the IAM Role
```console
eksctl create iamserviceaccount --name "usermgmt-sa" --cluster "usermgmtqacluster" --attach-policy-arn "arn:aws:iam::390402566276:policy/EKS-Secrtes-policy" --approve --namespace default --override-existing-serviceaccounts
```

# 6. Create the SecretProviderClass to fetch the secrets from AWS Secret Manager
```console
kubectl apply -f secret-provider-class.yml
```
# 7. Create the postgres pod for the application
```console
kubectl apply -f ./EKS-storage-with-EBS
```

# 8. Deploy the user-create microservice
```console
kubectl apply -f user-create-deployment.yml
```
# 9. Verify the secrets are mounted to the pod
```console
kubectl get pods
kubectl describe pod user-create-microservice-xxxx
kubectl exec -it user-create-microservice-xxxx -- ls /mnt/secrets-store
kubectl exec -it user-create-microservice-xxxx -- cat /mnt/secrets-store/db_username
kubectl exec -it user-create-microservice-xxxx -- cat /mnt/secrets-store/db_password
```
# 10. Verify the secrets are synced as Kubernetes secret
```console
kubectl get secrets
kubectl describe secret db-secrets-from-secrets-manager
kubectl get secret db-secrets-from-secrets-manager -o jsonpath="{.data.db_username}" | base64 --decode
kubectl get secret db-secrets-from-secrets-manager -o jsonpath="{.data.db_password}" | base64 --decode
```
# 11. Expose the user-create microservice using nodeport service
```console
kubectl apply -f user-create-service.yml
kubectl get svc
```
# 12. Get the external ip from nodes
```console
kubectl get nodes -o wide
```
# 13. Test the micro service by creating user from postman or frontend (if you have webapp)


