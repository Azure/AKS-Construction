# Samples

## Common Deployment Scenarios

These are the 2 most common scenarios & configurations AKS Construction is used for. Each has an Azure Portal UI experience for fine tuning the deployment parameters

Scenario | Description | Deploy
-------- | ----------- | ------
Dev | A fully featured Kubernetes environment using Azure CNI's Overlay network, Cillium backplane and a minimal set of recommended addOns. |
Well Architected | A secure cluster environment that closely matches then Azure Well Architected Framework guidance for Production grade |

## Advanced scenarios

These samples demonstrate relevant Bicep patterns and show how to best consume the bicep modules from this project in your own deployments.


Filename | Description | Deploy
-------- | ----------- | -----------
[SampleAppMain.bicep](SampleAppMain.bicep) | When consuming the AKS Construction Bicep as a module, doing so from your own Bicep file is recommended. This sample shows using `environment mapping`, `custom naming` and basic conditional logic for using the module. | [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Foliverlabs%2FAKS-Construction%2Foliver%2Fportal-deploy%2Fsamples%2FSampleAppMain.json) _(via Azure portal UI)_
[SystemPresetExample.bicep](SystemPresetExample.bicep) | The AKS Construction Bicep uses preset configurations for the system pool. Where you wish to deviate from these recommended presets, you can provide your own custom preset. This sample shows how to achieve that. | [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Foliverlabs%2FAKS-Construction%2Foliver%2Fportal-deploy%2Fsamples%2FSystemPresetExample.json) _(via Azure portal UI)_
[Multi-Cluster with Peered vNets](peered-vnet/main.bicep) | When more control is required on the Networking and Resource Groups, you can deploy at the subscription scope. | [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Foliverlabs%2FAKS-Construction%2Foliver%2Fportal-deploy%2Fsamples%2Fpeered-vnet%2Fmain.json) _(via Azure portal UI)_
[Shared ACR](shared-acr/main.bicep) | Where an existing Azure Container Registry exists in a different resource group, this sample shows how to create the scoped 'ACR Pull' role assignment that the AKS cluster requires. | [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Foliverlabs%2FAKS-Construction%2Foliver%2Fportal-deploy%2Fsamples%2Fshared-acr%2Fmain.json) _(via Azure portal UI)_
[NetworkForByo.bicep](networkforbyo.bicep) | When using the BYO network configuration you'll usually be deploying to a subscription with a peered virtual network already deployed with the correct subnets. This bicep file bridges the gap where you don't yet have that virtual network, but want to BYO network. | [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Foliverlabs%2FAKS-Construction%2Foliver%2Fportal-deploy%2Fsamples%2Fnetworkforbyo.json) _(via Azure portal UI)_
[Deployment Stages](deploy-stages/README.md) | Creating a staged deployment with an existing Managed Identity, Network Subnet and ACR, this configuration demonstrates how to pass the BYO Identity into AKS-Construction for Azure Subscriptions with restricted RBAC. |
