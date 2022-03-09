param nameseed string = 'acrsample'
param location string =  resourceGroup().location

param acrName string
param acrRg string

//--------ACR RBAC Assignment for new AKS cluster--------
module acrRbac 'acr-rbac.bicep' = {
  name: 'acr-rbac-for-aks-${nameseed}'
  scope: resourceGroup(acrRg)
  params: {
    acrName: acrName
    aksName: aksconst.outputs.aksClusterName
    aksResourceGroup: resourceGroup().name
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
    agentCount: 1
    JustUseSystemPool: true
  }
}
