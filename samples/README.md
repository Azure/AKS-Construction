# Samples

These samples demonstrate relevant Bicep patterns and show how to best consume the bicep modules from this project in your own deployments.

Filename | Description
-------- | -----------
[SampleAppMain.bicep](SampleAppMain.bicep) | When consuming the AKS Construction Bicep as a module, doing so from your own Bicep file is recommended. This sample shows using `environment mapping`, `custom naming` and basic conditional logic for using the module.
[SystemPresetExample.bicep](SystemPresetExample.bicep) | The AKS Construction Bicep uses preset configurations for the system pool. Where you wish to deviate from these recommended presets, you can provide your own custom preset. This sample shows how to achieve that.
[Multi-Cluster with Peered vNets](peered-vnet/main.bicep) | When more control is required on the Networking and Resource Groups, you can deploy at the subscription scope.
[Shared ACR](shared-acr/main.bicep) | Where an existing Azure Container Registry exists in a different resource group, this sample shows how to create the scoped 'ACR Pull' role assignment that the AKS cluster requires.
[NetworkForByo.bicep](networkforbyo.bicep) | When using the BYO network configuration you'll usually be deploying to a subscription with a peered virtual network already deployed with the correct subnets. This bicep file bridges the gap where you don't yet have that virtual network, but want to BYO network.
[Deployment Stages](deploy-stages/README.md) | Creating a staged deployment with an existing Managed Identity, Network Subnet and ACR, this configuration demonstrates how to pass the BYO Identity into AKS-Construction for restricted Azure Subscriptions.
