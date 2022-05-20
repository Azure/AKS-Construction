# Windows node pool example

This sample showcases using the AKS Construction bicep code for creating an AKS cluster with an additional **Windows** node pool.

Specifically it shows;

- Creating Virtual Networks prior to AKS Cluster creation
- Creating an AKS Cluster
- Extending AKS by creating additional autoscaling **Windows** node pools post creation

## Deploying the sample

```bash
az group create -n win-demo -l northeurope
az deployment group create -n win-demo -g win-demo -f ./samples/windows/main.bicep
```