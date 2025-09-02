
**CLI installations**

- awscli
- kubectl
- eksctl


**Helpful commds to know about the eksctl commands**

```console
- eksctl create --help
- eksctl create cluster --help
- eksctl create nodegroup --help
```

**Crete EKS Cluster using eksctl**

```console
eksctl create cluster --name=eksdemocluster \
                      --region=us-east-1 \
                      --zones=us-east-1a,us-east-1b \
                      --without-nodegroup
```


**Create & Associate IAM OIDC Provider for EKS Cluster**
```console

eksctl utils associate-iam-oidc-provider --region us-east-1 --cluster eksdemocluster --approve
```

**Create Nodegroup for EKS Cluster (ekddemoclister)**

```console
eksctl create nodegroup --cluster eksdemocluster \
                        --name=eksdemonodegroup \
                        --node-type=t3.medium \
                        --nodes=2 \
                        --nodes-min=2 \
                        --nodes-max=4 \
                        --node-volume-size=50 \
                        --managed \
                        --ssh-access \
                        --ssh-public-key=eks-demo \
                        --asg-access \
                        --external-dns-access \
                        --full-ecr-access \
                        --appmesh-access \
                        --alb-ingress-access
```

  **List the resorces**

```console
 #List EKS Clusters
 - eksctl get cluster

 #List Nodegroups in a cluster
- eksctl get nodegroup --cluster eksdemocluster

#Liat Nodes in cluster
- kubectl get nodes -o wide
```

**Kubectl context**

```console
- kubectl config get-contexts
- kubectl config view --minify
```

**Delete Nodegroup**

```console
- eksctl delete nodegroup --cluster eksdemocluster --name eksdemonodegroup or

- eksctl delete nodegroup --cluster mydemocluster --name mydemonodegroup --disable-eviction
```


**Delete EKS Cluster**

```console
- eksctl delete cluster --name mydemocluster
```
                    



