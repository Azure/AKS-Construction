param resourceName string
param location string = resourceGroup().location
param developerAadId string

module stage1 'stage1-byo.bicep' = {
  name: 'stage1'
  params: {
    resourceName: resourceName
    location: location
  }
}

module stage2 'stage2-aks.bicep' = {
  name: 'stage2'
  params: {
    resourceName: resourceName
    location: location
    byoAksSubnetId: stage1.outputs.byoAksSubnetId
    byoIdName: stage1.outputs.byoIdName
  }
}

module stage3 'stage3-acrrbac.bicep' = {
  name: 'stage3'
  params: {
    acrName: stage2.outputs.acrName
    aksName: stage2.outputs.aksName
  }
}

module stage4 'stage4-aksrbac.bicep' = {
  name: 'stage4'
  params: {
    aksName: stage2.outputs.aksName
    aadUserObjectId: deployingUser
  }
}
