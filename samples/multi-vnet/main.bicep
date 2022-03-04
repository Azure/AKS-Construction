targetScope='subscription'

param location string = deployment().location
param resourceName string = 'stest7'

//Naming
var gridResourceName = 'grid-${resourceName}'
var appResourceName = 'app-${resourceName}'

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
module gridVnet '../../bicep/network.bicep' = {
  name: 'vnet-grid-${resourceName}'
  scope: gridRg
  params: {
    resourceName: gridResourceName
    location: location
    vnetAksSubnetAddressPrefix: '10.10.0.0/22'
    vnetAddressPrefix: '10.10.0.0/16'
  }
}

module appVnet '../../bicep/network.bicep' = {
  name: 'vnet-${appResourceName}'
  scope: appRg
  params: {
    resourceName: appResourceName
    location: location
    vnetAksSubnetAddressPrefix: '10.20.0.0/22'
    vnetAddressPrefix: '10.20.0.0/16'
  }
}

module vnet1peering 'vnetpeer.bicep' = {
  name: 'peer-vnet-grid-${resourceName}'
  scope: gridRg
  params: {
    vnet1Name: gridVnet.outputs.vnetName
    vnet2ResourceId: appVnet.outputs.vnetId
    peeringName: 'peer-${gridVnet.outputs.vnetName}-${appVnet.outputs.vnetName}'
  }
}

module vnet2peering 'vnetpeer.bicep' = {
  name: 'peer-vnet-grid-${resourceName}'
  scope: appRg
  params: {
    vnet1Name: appVnet.outputs.vnetName
    vnet2ResourceId: gridVnet.outputs.vnetId
    peeringName: 'peer-${appVnet.outputs.vnetName}-${gridVnet.outputs.vnetName}'
  }
  dependsOn: [
    vnet1peering //we can't create 2 peers at the same time at each end - we must manually sequence them
  ]
}

// subnet for GitHub runners
module extrasubnet 'extrasubnet.bicep' = {
  scope: gridRg
  name: 'extrasubnet'
  params: {
    vnetName: gridVnet.outputs.vnetName
    runnerSubnetAddressPrefix: '10.10.4.0/24'
    subnetName: 'sn-runners'
  }
}

//Deploy AKS clusters
var gridAksResourceName='aks-${gridResourceName}'
module gridAks '../../bicep/main.bicep' = {
  name: 'seleniumGridCluster'
  scope: gridRg
  params: {
    location : location
    resourceName: gridResourceName
    AksClusterName: gridAksResourceName
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
    JustUseSystemPool: false
    SystemPoolType: 'Cost-Optimised'
    byoAKSSubnetId: gridVnet.outputs.aksSubnetId
  }
}

module appAks '../../bicep/main.bicep' = {
  name: 'appAksCluster'
  scope: appRg
  params: {
    location : location
    resourceName: 'app-${resourceName}'
    agentVMSize: 'Standard_B2ms'
    osDiskType: 'Managed'
    enable_aad: true
    enableAzureRBAC : true
    registries_sku: 'Premium'
    omsagent: true
    retentionInDays: 30
    azurepolicy: 'audit'
    agentCount:1
    agentCountMax:2
    JustUseSystemPool: true
    byoAKSSubnetId: appVnet.outputs.aksSubnetId
  }
}

// Extra agent pools
var extraAksNodePools = [
  'chromepool'
  'firefoxpool'
]

@batchSize(1) //Need to set this to avoid this concurrent update issue - 'Conflict. Status: Failed. Error: ResourceDeploymentFailure. The resource operation completed with terminal provisioning state 'Failed'
module aksNodePools '../../bicep/aksagentpool.bicep'  = [for pool in extraAksNodePools:  {
  name: pool
  scope: gridRg
  params: {
    AksName: gridAks.outputs.aksClusterName
    PoolName: pool
    subnetId: gridVnet.outputs.aksSubnetId
    agentCount: 0
    agentCountMax: 3
    agentVMSize: 'Standard_B2s'
    maxPods: 10
    osDiskType: 'Managed'
  }
}]

