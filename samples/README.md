# Samples

Filename | Description
|---|---|
SampleAppMain.bicep | When consuming the AKS Construction Bicep as a module, doing so from your own Bicep file is recommended. This sample shows using `environment mapping`, `custom naming` and basic conditional logic for using the module.
SystemPresetExample.bicep | The AKS Construction Bicep uses preset configurations for the system pool. Where you wish to deviate from these recommended presets, you can provide your own custom preset. This sample shows how to achieve that.
NetworkForByo.bicep | When using the BYO network configuration you'll usually be deploying to a subscription with a peered virtual network already deployed with the correct subnets. This bicep file bridges the gap where you don't yet have that virtual network, but want to BYO network.
