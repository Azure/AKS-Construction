param vnetName string
resource vnet 'Microsoft.Network/virtualNetworks@2021-05-01' existing = {
  name:vnetName
}

param subnetAddressPrefix string
param subnetName string
resource subnet 'Microsoft.Network/virtualNetworks/subnets@2021-05-01' = {
  name: subnetName
  parent: vnet
  properties: {
    addressPrefix: subnetAddressPrefix
  }
}
output subnetId string = subnet.id
