# Create namespace using kubectl command
```console
kubectl create namespace <namespace-name>
```
# Verify the namespace is created
```console
kubectl get namespaces
```
# Switch to the namespace
```console
kubectl config set-context --current --namespace=<namespace-name>
```
# Verify the current namespace
```console
kubectl config view --minify | grep namespace:
```
# Create namespace using manifest file
```console
kubectl apply -f namespace.yml
```
# Verify the namespace is created
```console
kubectl get namespaces
```
# Deploy pods to namespace
```console
kubectl apply -f <pod-manifest-file> -n <namespace-name>
```