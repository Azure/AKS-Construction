//------Application General Parameters------
@description('The individual name of your application')
@minLength(3)
@maxLength(6)
param nameseed string = 'app'
param location string =  resourceGroup().location

param acrName string
param acrRg string

//--------ACR RBAC Assignment for new AKS cluster--------
module acrRbac 'acr-rbac.bicep' = {
  name: 'acr-rbac'
  scope: resourceGroup(acrRg)
  params: {
    acrName: acrName
    aksName: aksconst.outputs.aksClusterName
  }
}

//---------Kubernetes Construction---------
//ref: https://github.com/Azure/AKS-Construction

module aksconst '../../bicep/main.bicep' = {
  name: 'aksconstruction'
  params: {
    location : location
    resourceName: nameseed
    enable_aad: true
    enableAzureRBAC : true
    registries_sku: ''
    omsagent: true
    retentionInDays: 30
  }
}
