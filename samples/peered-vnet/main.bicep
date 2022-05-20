targetScope='subscription'

param location string = deployment().location
param resourceName string = 'stest'
param adminPrincipalId string = ''

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
    subnetAddressPrefix: '10.10.4.0/24'
    subnetName: 'sn-runners'
  }
}

var aggressiveAutoScaler ={
  'balance-similar-node-groups': 'true'
  'expander': 'random'
  'max-empty-bulk-delete': '10'
  'max-graceful-termination-sec': '200'
  'max-node-provision-time': '15m'
  'max-total-unready-percentage': '45'
  'new-pod-scale-up-delay': '0s'
  'ok-total-unready-count': '5'
  'scale-down-delay-after-add': '1m'
  'scale-down-delay-after-delete': '20s'
  'scale-down-delay-after-failure': '3m'
  'scale-down-unneeded-time': '1m'
  'scale-down-unready-time': '2m'
  'scale-down-utilization-threshold': '0.5'
  'scan-interval': '10s'
  'skip-nodes-with-local-storage': 'true'
  'skip-nodes-with-system-pods': 'true'
}

//Deploy AKS clusters
module gridAks '../../bicep/main.bicep' = {
  name: 'seleniumGridCluster'
  scope: gridRg
  params: {
    location : location
    resourceName: gridResourceName
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
    adminPrincipalId: adminPrincipalId
    JustUseSystemPool: false
    SystemPoolType: 'Cost-Optimised'
    byoAKSSubnetId: gridVnet.outputs.aksSubnetId
    AutoscaleProfile: aggressiveAutoScaler
    //agentVMTaints:  [for pool in extraAksNodePools: '${nodeTaintKey}=${pool}:NoExecute']
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
    adminPrincipalId: adminPrincipalId
    JustUseSystemPool: true
    byoAKSSubnetId: appVnet.outputs.aksSubnetId
  }
}

// Extra agent pools
var extraAksNodePools = [
  'chromepool'
  'firefoxpool'
  'edgepool'
]

var nodeTaintKey = 'selbrowser'
@batchSize(1) //Need to set this to avoid this concurrent update issue - 'Conflict. Status: Failed. Error: ResourceDeploymentFailure. The resource operation completed with terminal provisioning state 'Failed'
module aksNodePools '../../bicep/aksagentpool.bicep'  = [for pool in extraAksNodePools:  {
  name: pool
  scope: gridRg
  params: {
    AksName: gridAks.outputs.aksClusterName
    PoolName: pool
    subnetId: gridVnet.outputs.aksSubnetId
    agentCount: 0
    agentCountMax: 10
    agentVMSize: 'Standard_B2s'
    maxPods: 10
    osDiskType: 'Managed'
    // nodeTaints: [
    //   '${nodeTaintKey}=${pool}:${nodeTaintEffect}'
    // ]
    nodeLabels:{
      '${nodeTaintKey}' : '${pool}'
    }
  }
}]
