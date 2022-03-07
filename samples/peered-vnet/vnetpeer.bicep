param vnet1Name string
param vnet2ResourceId string
param peeringName string

resource vnet 'Microsoft.Network/virtualNetworks@2021-05-01' existing = {
  name:vnet1Name
}

resource peer 'Microsoft.Network/virtualNetworks/virtualNetworkPeerings@2021-05-01' = {
  name: peeringName
  parent: vnet
  properties: {
    allowForwardedTraffic: true
    allowGatewayTransit: false
    allowVirtualNetworkAccess: true
    doNotVerifyRemoteGateways: true
    useRemoteGateways: false
    remoteVirtualNetwork: {
      id: vnet2ResourceId
    }
  }
}
