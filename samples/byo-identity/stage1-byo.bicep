param resourceName string
param location string = resourceGroup().location

@description('Creating the user assigned identity for the AKS cluster')
resource byoId 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'id-${resourceName}'
  location: location
}

@description('Creating the network resources for the AKS cluster')
module byoNetwork '../networkforbyo.bicep' = {
  name: 'byoNetwork'
  params: {
    location: location
    resourceName: resourceName
  }
}

@description('Creates the correct RBAC for the BYO resources')
module rbac '../../bicep/aksnetcontrib.bicep' = {
  name: 'addAksNetContributor'
  params: {
    byoAKSSubnetId: byoNetwork.outputs.aksSubnetId
    user_identity_principalId: byoId.properties.principalId
    rbacAssignmentScope: 'Subnet'
  }
}

output byoAksSubnetId string = byoNetwork.outputs.aksSubnetId
output byoIdName string = byoId.name
