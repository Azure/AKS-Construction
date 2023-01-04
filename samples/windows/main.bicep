targetScope='resourceGroup'

param location string = resourceGroup().location

param osType string

resource vnet 'Microsoft.Network/virtualNetworks@2021-02-01' = {
  name: 'vnet'
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    subnets: [
      {
        name: 'subnet'
        properties: {
          addressPrefix: '10.0.0.0/24'
        }
      }
    ]
  }
}

module aks '../../bicep/main.bicep' = {
  name: 'aks'
  params: {
    location : location
    resourceName: 'win-aks'
    agentVMSize: 'Standard_B2ms'
    osDiskType: 'Managed'
    enable_aad: true
    enableAzureRBAC : true
    registries_sku: 'Premium'
    omsagent: true
    retentionInDays: 30
    azurepolicy: 'audit'
    agentCount:1
    agentCountMax:3
    JustUseSystemPool: true
    SystemPoolType: 'CostOptimised'
    byoAKSSubnetId: vnet.properties.subnets[0].id
    osType: osType
  }
}
