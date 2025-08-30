**Create Deployment**
```console
kubectl create deployment nginx-demo --image=rudragajjala/nginx-demo:1.0.0
```
**List Deployments**
```console
kubectl get deployments / kubectl get deployments -o wide
```
**Describe the Deployment (It can used to troubleshooo the Deployment)**
```console
kubectl describe deployment nginx-demo
```
**Scale the Deployment**
```console
kubectl scale deployment nginx-demo --replicas=3
```
**Expose Deployment as a Service**
```console
kubectl expose deployment nginx-demo --type=NodePort --port=80 --name=nginx-deployment-service
```
**Update Deployment using set Image**
```console
#Get the container name from the curent deployment
kubectl get deployment nginx-demo -o jsonpath='{.spec.template.spec.containers[0].name}' / kubectl get deployment -o yml
#Update the image
kubectl set image deployment/nginx-demo <container-name>=rudragajjala/nginx-demo:1.0.0 --recored=true
```
**Verify rollout status**
```console
kubectl rollout status deployment/nginx-demo
```
**Verufy rollut history**
```console
kubectl rollout history deployment/nginx-demo
```
**Update deploymeny using edit option**
```console
kubectl edit deployment/nginx-demo --record=true
```
**Verify the changes in each version**
```console
kubectl rollout history deployment/nginx-demo --revision=1 //2 & 3 etc.
```
**Rollback to previous version**
```console
kubectl rollout undo deployment/nginx-demo
```
**Rollback to specific verison**
```console
kubectl rollout undo deployment/nginx-demo --to-revision=2
```