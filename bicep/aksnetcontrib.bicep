//using a seperate module file as Byo subnet scenario caters from where the subnet is in the another resource group
//we pass in the name/rg to new up an existing reference and form a dependency
//we pass in the principalid as it needs to be used in the roleassignment name
param byoAKSSubnetId string
param user_identity_name string
param user_identity_rg string
param user_identity_principalId string

var networkContributorRole = resourceId('Microsoft.Authorization/roleDefinitions', '4d97b98b-1d4f-4787-a291-c67834d212e7')

var existingAksSubnetName = !empty(byoAKSSubnetId) ? split(byoAKSSubnetId, '/')[10] : ''
var existingAksVnetName = !empty(byoAKSSubnetId) ? split(byoAKSSubnetId, '/')[8] : ''
//var existingAksVnetRG = !empty(byoAKSSubnetId) ? split(byoAKSSubnetId, '/')[4] : ''

resource existingvnet 'Microsoft.Network/virtualNetworks@2021-02-01' existing =  {
  name: existingAksVnetName
}
resource existingAksSubnet 'Microsoft.Network/virtualNetworks/subnets@2020-08-01' existing = {
  parent: existingvnet
  name: existingAksSubnetName
}

resource uai 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' existing = {
  name: user_identity_name
  scope: resourceGroup(user_identity_rg)
}

resource existing_vnet_cont 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name:  '${guid(user_identity_principalId, existingAksSubnetName)}'
  scope: existingAksSubnet 
  properties: {
    roleDefinitionId: networkContributorRole
    principalId: uai.properties.principalId
    principalType: 'ServicePrincipal'
  }
}
