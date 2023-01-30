# Windows node pool example

This sample showcases using the AKS Construction bicep code for creating an AKS cluster with a **Windows** node pool.

Specifically it shows;

- Creating Virtual Networks prior to AKS Cluster creation
- Creating an AKS Cluster with a linux system pool **and** a linux user nodepool (for ancilliary components like ingress controller)
- Extending the AKS config by creating additional autoscaling **Windows** node pools post creation

## Deploying the sample

```bash
az group create -n win-demo -l northeurope
az deployment group create -n win-demo -g win-demo -f ./samples/windows/main.bicep
```

### Inspecting the deployed resources

![deployed resources](winResourcesDeployed.png)

### Inspecting the created nodepools

![aks node pools](winNodePools.png)