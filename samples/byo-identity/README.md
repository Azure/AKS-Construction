# BYO Identity

It's common in non-sandbox enterprise environments that the deploying team does not have significant privileges in the Azure subscription.

In these circumstances we need to split the AKS environment Deployment into stages, with different teams having the responsibility of running specific deployments depending on their access level.

Stage | Purpose | Team | Azure RBAC role
----- | ------- | ---- | ---------------
[1](stage1-byo.bicep) | Creating the cluster identity and assigning the network subnet access | Network/Admin | Owner
[2](stage2-aks.bicep) | Creating the AKS cluster | Dev team | Contributor
[3](stage3-acrrbac.bicep) | Allowing the AKS cluster access to the Container Registry | Admin | Owner
[4](stage4-aksrbac.bicep) | Allowing the Dev Team permission to the AKS Cluster to create Kubernetes objects (deployments etc) | Admin | Owner
