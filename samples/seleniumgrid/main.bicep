targetScope='subscription'

param location string = deployment().location
param resourceName string = 'stest1'

//Create resource groups
resource gridRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${resourceName}-selenium'
  location: location
}

resource appRg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${resourceName}-testapp'
  location: location
}


//Create vnets
module gridVnet 'CARML/viurtalNetworks/VirtualNetwork.bicep' = {
  name: 'vnet-grid-${resourceName}'
  scope: gridRg
  params: {
    name: 'vnet-grid-${resourceName}'
    location: location
    addressPrefixes: [
      '10.10.0.0/16'
    ]
    subnets: [
      {
        name: 'aks-sn'
        addressPrefix: '10.10.0.0/22'
        privateEndpointNetworkPolicies: 'Disabled'
        privateLinkServiceNetworkPolicies: 'Enabled'
      }
    ]
  }
}

module appVnet 'CARML/viurtalNetworks/VirtualNetwork.bicep' = {
  name: 'vnet-grid-${resourceName}'
  scope: appRg
  params: {
    name: 'vnet-app-${resourceName}'
    location: location
    addressPrefixes: [
      '10.20.0.0/16'
    ]
    subnets: [
      {
        name: 'aks-sn'
        addressPrefix: '10.20.0.0/22'
        privateEndpointNetworkPolicies: 'Disabled'
        privateLinkServiceNetworkPolicies: 'Enabled'
      }
    ]
    virtualNetworkPeerings: [
      {
        remotePeeringEnabled: true
        remoteVirtualNetworkId: gridVnet.outputs.resourceId
    }
    ]
  }
}


//Deploy AKS clusters

//---------Kubernetes Construction---------
//ref: https://github.com/Azure/AKS-Construction
module gridAks '../../bicep/main.bicep' = {
  name: 'seleniumGridCluster'
  scope: gridRg
  params: {
    location : location
    resourceName: 'aks-grid-${resourceName}'
    enable_aad: true
    enableAzureRBAC : true
    registries_sku: 'Premium'
    omsagent: true
    retentionInDays: 30
    azurepolicy: 'audit'
    agentCount:1
    agentCountMax:2
    JustUseSystemPool: true
    byoAKSSubnetId: gridVnet.outputs.subnetResourceIds[0]
  }
}

module appAks '../../bicep/main.bicep' = {
  name: 'appAksCluster'
  scope: appRg
  params: {
    location : location
    resourceName: 'aks-grid-${resourceName}'
    enable_aad: true
    enableAzureRBAC : true
    registries_sku: 'Premium'
    omsagent: true
    retentionInDays: 30
    azurepolicy: 'audit'
    agentCount:1
    agentCountMax:2
    JustUseSystemPool: true
    byoAKSSubnetId: appVnet.outputs.subnetResourceIds[0]
  }
}
