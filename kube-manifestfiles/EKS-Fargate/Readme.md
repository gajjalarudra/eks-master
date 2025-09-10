# Create cluster with fargate

```console
eksctl create cluster --name usermgmtfargatecluster --region ap-south-1 --fargate --alb-ingress-access --full-ecr-access --asg-access
```

# Create fargate profiles

```console
eksctl create fargateprofile --cluster usermgmtfargatecluster --name usermgmt-app --namespace usermgmt
```

# Secrers from aws secrets manager

1. In Fargate-only clusters, workloads must run within a specific Fargate profile. So create a fargate profile for the secrets manager.
```console
#Template
eksctl create fargateprofile --cluster <CLUSTER_NAME> --name external-secrets-profile --namespace external-secrets

#with actual values
eksctl create fargateprofile --cluster usermgmtfargatecluster --name external-secrets-profile --namespace external-secrets
```
2. Verify that the fargate profile created correctly or not
```console
eksctl get fargateprofile --cluster usermgmtfargatecluster -o yaml
```
3. Install the external secrets operator
```consloe
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets -n external-secrets --create-namespace --set installCRDs=true --set webhook.port=9443
```
4. Verify the deployment
```console
kubectl get pods -n external-secrets
```
5. Configure IAM policy to get the secrets from secrets manager and bind it to service account
```console
eksctl create iamserviceaccount --name external-secrets-sa --namespace usermgmt --cluster usermgmtfargatecluster --attach-policy-arn <policy-arn> --approve --override-existing-serviceaccounts

Note: Service account can be create in a namespce where our backend application is going to be deployed (In this case it is usermgmt)
```
6. Create a secret store object to get the secrets from AWS Secret Manager with service account as authentication.
```console
kubectl apply -f external-secrets-store.yml

#verify the secrets store
kubectl get secretstore -n usermgmt
```
7. Now sync the secrets by creating external secrets
```console
kubectl apply -f external-secrets.yml

#verify the secrets
kubectl get secret -n usermgmt
```
8. Consume the secrets in deployment and test
```console
Kubectl apply -f usermgmt-micro-service.yml
```

