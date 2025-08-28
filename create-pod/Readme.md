**Create the pod using kubectl command.**

```consloe
kubectl run nginx-demo --image rudragajjala/nginx-eks-demo:v1 
```

**list pods**

```console
kubectl get pods / kubectl get pods -o wide

#get the pod output as yml
kubectl get <pod-name> -o yml
```


**Describe the pod (It can used to troubleshooo the pods)**

```console
kubectl describe pod nginx-demo
```

**Delete the pod**

```console
kubectl delete pod nginx-demo
```

**Expose pods (application) using Service**

- Expose the pod using service (NodePort service) to access the application externally.

```console
kubectl expose pod nginx-demo --type=NodePort --port=80 --name=nginx-service

we must define the targetport when you application is running on different port.

kubectl expose pod nginx-demo --type=NodePort --port=81 --target-port=80 --name=nginx-service
```

**Create replica set**

To create the replica set, we need to write the yml manifest and then below command

```console
kubectl apply -f <replicaset-yml-file> #replicatset-demo.yml
```

**Update replica set with autoscaling or more pods**

```console
kubectl scale rs <replicaset-name> --replicas=<number-of-replicas> / kubectl replace -f <replicaset-yml-file>
```

**Expose Replicaset using service**

```console
kubectl expose rs <replicaset-name> --type=NodePort --port=80 --target-port=80 --name=nginx-rs-service
```


**List Services**

```console
kubectl get svc / kubectl get svc -o wide / kubectl get service

#get the servcie output as yml
kubectl get svc <service-name> -o yml

```

**Verify the pod logs**

```console
#kubectl logs <pod-name>

kubectl logs nginx-demo
kubectl logs -f nginx-demo
```
**connect to nginx container in pod**

```console
#kubectl exec -it <pod-name> -- /bin/bash

kubectl exec -it nginx-demo -- /bin/bash
```

