param resourceName string
param location string
param vnetAddressPrefix string = '10.0.0.0/8'
param serviceEndpoints array = []
param vnetAksSubnetAddressPrefix string = '10.240.0.0/16'
param vnetAppGatewaySubnetAddressPrefix string = '10.2.0.0/16'

module network '../bicep/network.bicep' = {
  name: 'network'
  params: {
    resourceName: resourceName
    location: location
    serviceEndpoints: serviceEndpoints
    vnetAddressPrefix: vnetAddressPrefix
    vnetAksSubnetAddressPrefix: vnetAksSubnetAddressPrefix
    ingressApplicationGateway: true
    vnetAppGatewaySubnetAddressPrefix: vnetAppGatewaySubnetAddressPrefix
    azureFirewalls: false
  }
}
