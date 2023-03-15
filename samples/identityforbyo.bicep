param resourceName string
param location string = resourceGroup().location

@description('Creating the user assigned identity for the AKS cluster')
resource id 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'id-${resourceName}'
  location: location
}

@description('Creating the AKS cluster')
module aks '../bicep/main.bicep' = {
  name: resourceName
  params: {
    resourceName: resourceName
    location: location
    byoUaiName: id.name
  }
}
