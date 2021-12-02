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
  }
  'test' : {
    vmSize: 'Standard_B4ms'
    count: 2
    minCount: 2
    maxCount: 6
    enableAutoScaling: true
  }
  'qa' : {
    vmSize: 'Standard_D4s_v3'
    count: 2
    minCount: 2
    maxCount: 3
    enableAutoScaling: true
  }
  'prod' : {
    vmSize: 'Standard_D4s_v3'
    count: 3
    minCount: 3
    maxCount: 3
    enableAutoScaling: true
  }
}

//---------Kubernetes Construction---------
//ref: https://github.com/Azure/Aks-Construction

module aksconst '../bicep/main.bicep' = {
  name: 'aksconstruction'
  params: {
    location : location
    resourceName: nameseed
    systemPoolPresets: {
      'Custom' : envSystemPoolPresetMap[env]
    }
    SystemPoolType: 'Custom'
  }
}
output aksClusterName string = aksconst.outputs.aksClusterName
output ApplicationGatewayName string = aksconst.outputs.ApplicationGatewayName
