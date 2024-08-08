param AksName string

param PoolName string

@description('The zones to use for a node pool')
param availabilityZones array = []

@description('OS disk type')
param osDiskType string

@description('VM SKU')
param agentVMSize string

@description('Disk size in GB')
param osDiskSizeGB int = 0

@description('The number of agents for the user node pool')
param agentCount int = 1

@description('The maximum number of nodes for the user node pool')
param agentCountMax int = 3
var autoScale = agentCountMax > agentCount

@description('The maximum number of pods per node.')
param maxPods int = 30

@description('Any taints that should be applied to the node pool')
param nodeTaints array = []

@description('Any labels that should be applied to the node pool')
param nodeLabels object = {}

@description('The subnet the node pool will use')
param subnetId string

@description('The subnet the pods will use')
param podSubnetID string = ''

@description('OS Type for the node pool')
@allowed(['Linux','Windows'])
param osType string

@allowed(['AzureLinux','Ubuntu','Windows2019','Windows2022'])
param osSKU string

@description('Assign a public IP per node')
param enableNodePublicIP bool = false

@description('If the node pool should use VM spot instances')
param spotInstance bool = false

@description('Apply a default sku taint to Windows node pools')
param autoTaintWindows bool = false

var taints = autoTaintWindows ? union(nodeTaints, ['sku=Windows:NoSchedule']) : nodeTaints

var spotProperties = {
  scaleSetPriority: 'Spot'
  scaleSetEvictionPolicy: 'Delete'
  spotMaxPrice: -1
}

// Default OS Disk Size in GB for Linux is 30, for Windows is 100
var defaultOsDiskSizeGB = osType == 'Linux' ? 30 : 100

resource aks 'Microsoft.ContainerService/managedClusters@2023-11-01' existing = {
  name: AksName
}

resource userNodepool 'Microsoft.ContainerService/managedClusters/agentPools@2023-11-01' = {
  parent: aks
  name: PoolName
  properties: union({
      mode: 'User'
      vmSize: agentVMSize
      count: agentCount
      minCount: autoScale ? agentCount : null
      maxCount: autoScale ? agentCountMax : null
      enableAutoScaling: autoScale
      availabilityZones: !empty(availabilityZones) ? availabilityZones : null
      osDiskType: osDiskType
      osSKU: osSKU
      osDiskSizeGB: osDiskSizeGB == 0 ? defaultOsDiskSizeGB : osDiskSizeGB
      osType: osType
      maxPods: maxPods
      type: 'VirtualMachineScaleSets'
      vnetSubnetID: !empty(subnetId) ? subnetId : null
      podSubnetID: !empty(podSubnetID) ? podSubnetID : null
      upgradeSettings: spotInstance ? {} : {
        maxSurge:  '33%' //Spot pools can't set max surge
      }
      nodeTaints: taints
      nodeLabels: nodeLabels
      enableNodePublicIP: enableNodePublicIP
    },
    spotInstance ? spotProperties : {}
  )
}
