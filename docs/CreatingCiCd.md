# Creating CI

This document walks through the setup of the Azure resources needed to create the 3 core CI/CD workflows that run in this repo.

The intended audience is maintainers of this repository.

1. Starter cluster workflow
2. Private cluster workflow
3. Byo vnet cluster workflow

## Azure AD Resources

Create a service principal using the Azure CLI

```bash
#SUBID=""
SUBID=$(az account show --query id -o tsv)

az ad sp create-for-rbac --name "AksBicepAcc-CI" --role owner \
                            --scopes /subscriptions/$SUBID \
                            --sdk-auth
```

example output to save to the `AZURE_CREDENTIALS` secret in GitHub

```json
{
  "clientId": "REDACTED",
  "clientSecret": "REDACTED",
  "subscriptionId": "REDACTED",
  "tenantId": "REDACTED",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

Some of the FedCred based workflows will require the CLIENT/TENANT/SUB ID secrets set using the values in the outputted JSON.

## Azure Resources

### Role Assignments

The Service Principal created in the first step will need to be assigned specific RBAC to be able to interact with some of the Azure resources.

```bash
assigneeObjectId=$(az ad sp show --id "REDACTED-CLIENTID" --query id -o tsv)
az role assignment create --role "Azure Kubernetes Service RBAC Cluster Admin" --scope "/subscriptions/$SUBID/resourcegroups/AksBicepAcc-Ci-PrivateCluster" --assignee-object-id $assigneeObjectId --assignee-principal-type ServicePrincipal
```

### Starter & Private CiCd workflows

### Byo Vnet workflow

The Byo workflow has expectations of existing resource being in the Azure Subscription.

1. Virtual Network
1. Subnet for AKS
1. Subnet for App GW
1. Nat Gateway (assigned to Aks subnet)
1. KeyVault with KMS key
1. DNS Zone

GitHub secrets are used to store the resourceIds/names of these existing resources.
When re-homing to a new target subscription, these resource should be created.

### Subnets

Capture the subnet id and save into the appropriate GitHub secret.

> EG. /subscriptions/REDACTED/resourcegroups/REDACTED/providers/Microsoft.Network/virtualNetworks/vnet-AksBicepAcc-Ci-Byo/subnets/aks-sn

## Troubleshooting

### secrets is forbidden

You need to create the RBAC for the service principal on the resource groups.

> *** Error: list: failed to list: secrets is forbidden: User \"REDACTED\" cannot list resource \"secrets\" in API group \"\" in the namespace \"default\": User does not have access to the resource in Azure. Update role assignment to allow access.\n", "provisioningState": "Succeeded", "reason": null, 


### AutoUpgradePreview NOT registered

> Error AutoUpgradePreview NOT registered

```bash
az feature register -n AutoUpgradePreview --namespace Microsoft.ContainerService
```




