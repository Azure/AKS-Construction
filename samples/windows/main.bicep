targetScope='resourceGroup'

param location string = resourceGroup().location

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
    acrCreateNewSku: 'Premium'
    omsagent: true
    retentionInDays: 30
    azurepolicy: 'audit'
    agentCount:1
    agentCountMax:3
    JustUseSystemPool: true
    SystemPoolType: 'CostOptimised'
    byoAKSSubnetId: vnet.properties.subnets[0].id
  }
}

module windowsNodePool '../../bicep/aksagentpool.bicep' = {
  name: 'windows'
  params: {
    AksName: aks.outputs.aksClusterName
    PoolName: 'win'
    subnetId: vnet.properties.subnets[0].id
    agentCount: 1
    agentCountMax: 3
    agentVMSize: 'Standard_B2s'
    maxPods: 10
    osDiskType: 'Managed'
    osType: 'Windows'
  }
}
