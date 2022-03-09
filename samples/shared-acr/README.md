# Shared ACR Sample

This sample shows how to use an existing Azure Container Registry with a new AKS Construction deployment.

Specifically it shows;

1. Scoped RBAC assignment of the ACR pull role

## Deploying the sample

```bash
RG=yourAksResourceGroup
acrName=yourAcr
acrRg=yourAcrResourceGroup

az deployment group create -g $RG -f .\samples\shared-acr\main.bicep -p acrName=$acrName acrRg=$acrRg
```