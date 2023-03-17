# Deployment Stages

It's common in non-sandbox enterprise environments that the deploying team does not have significant privileges in the Azure subscription. This causes friction because the AKS Construction Helper assumes that the Deploying User has full permissions in the deploying environment.

In these circumstances we need to split the AKS environment deployment into stages, with different teams having the responsibility of running specific deployments depending on their access level.

Stage | Purpose | Team | Azure RBAC role
----- | ------- | ---- | ---------------
[1](stage1-byo.bicep) | Creating the cluster identity and assigning the network subnet access | Network/Admin | Owner
[2](stage2-aks.bicep) | Creating the AKS cluster | Dev team | Contributor
[3](stage3-acrrbac.bicep) | Allowing the AKS cluster access to the Container Registry | Admin | Owner
[4](stage4-aksrbac.bicep) | Allowing the Dev Team permission to the AKS Cluster to create Kubernetes objects (deployments etc) | Admin | Owner

To illustrate these 4 stages being sequenced, [main.bicep](main.bicep) shows creating a single end to end deployment.

```bash
az deployment group create -g <your-resource-group> -f main.bicep -p resourceName=kubenv developerAadId=$(az ad signed-in-user show --query id --out tsv)
```

> The AKS Construction bicep creates many Role Assignments depending on what features have been selected. This sample shows a working configuration where the AKS Construction codebase is compatible with Contributor RBAC, success will depend on the feature combination that you are trying to deploy.
