# Multi-Vnet Sample

This sample showcases a using the AKS Construction bicep code for a much broader project deployment which involves multiple AKS clusters in different virtual networks.

Specifically it shows;

1. A subscription level deployment
1. Creating Virtual Networks **prior to** AKS Cluster creation
1. Peering Virtual Networks together
1. Creating multiple AKS Clusters in different resource groups
1. Extending AKS by creating additional autoscaling node pools **post creation**
1. Creating an additional subnet for private CI/CD compute **post creation**

## Deploying the sample

```bash
az deployment sub create -l northeurope -f .\samples\peered-vnet\main.bicep -n northeuro-peeredaks
```