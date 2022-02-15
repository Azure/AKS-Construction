//------Application General Parameters------
@description('The individual name of your application')
@minLength(3)
@maxLength(6)
param nameseed string = 'app'
param location string =  resourceGroup().location

@allowed([
  'dev'
  'test'
  'qa'
  'prod'
])
param env string = 'dev'

var envSystemPoolPresetMap = {
  'dev' : {
    vmSize: 'Standard_B4ms'
    count: 1
    minCount: 1
    maxCount: 3
    enableAutoScaling: true
    availabilityZones: []
  }
  'test' : {
    vmSize: 'Standard_B4ms'
    count: 2
    minCount: 2
    maxCount: 6
    enableAutoScaling: true
    availabilityZones: []
  }
  'qa' : {
    vmSize: 'Standard_D4s_v3'
    count: 2
    minCount: 2
    maxCount: 3
    enableAutoScaling: true
    availabilityZones: [
      '1'
      '2'
      '3'
    ]
  }
  'prod' : {
    vmSize: 'Standard_D4s_v3'
    count: 3
    minCount: 3
    maxCount: 3
    enableAutoScaling: true
    availabilityZones: [
      '1'
      '2'
      '3'
    ]
  }
}

//---------Kubernetes Construction---------
//ref: https://github.com/Azure/AKS-Construction

module aksconst '../bicep/main.bicep' = {
  name: 'aksconstruction'
  params: {
    location : location
    resourceName: nameseed
    SystemPoolCustomPreset:  envSystemPoolPresetMap[env]
    SystemPoolType: 'Custom'
  }
}
output aksClusterName string = aksconst.outputs.aksClusterName
output ApplicationGatewayName string = aksconst.outputs.ApplicationGatewayName
