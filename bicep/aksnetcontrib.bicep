param byoAKSSubnetId string
param principalId string

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

resource existing_vnet_cont 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name:  '${guid(principalId, existingAksSubnetName)}'
  scope: existingAksSubnet 
  properties: {
    roleDefinitionId: networkContributorRole
    principalId: principalId
    principalType: 'ServicePrincipal'
  }
}
