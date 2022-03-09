# Shared ACR Sample

This sample showcases a using the AKS Construction bicep code to utilise an existing Azure Container Registry that would likely be shared by many AKS Clusters.

Specifically it shows;

1. Scoped RBAC deployment of the ACR role assignment

## Deploying the sample

```bash
RG=yourAksResourceGroup
acrName=yourAcr
acrRg=yourAcrResourceGroup

az deployment group create -g $RG -f .\samples\shared-acr\main.bicep -p acrName=$acrName acrRg=$acrRg
```