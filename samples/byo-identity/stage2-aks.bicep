param resourceName string
param byoIdName string
param byoAksSubnetId string
param location string = resourceGroup().location

@description('Creating the AKS cluster, referncing the *BYO* resources')
module aks '../../bicep/main.bicep' = {
  name: resourceName
  params: {
    resourceName: resourceName
    location: location
    byoUaiName: byoIdName
    byoAKSSubnetId: byoAksSubnetId
  }
}

resource byoAcr 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' = {
  name: 'acr-${resourceName}'
  location: location
  sku: {
    name: 'Standard'
  }
}

output acrName string = byoAcr.name
output aksName string = aks.outputs.aksClusterName
