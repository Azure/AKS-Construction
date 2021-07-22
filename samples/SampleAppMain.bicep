// You should use a bicep file to represent an application deployment
// This file then calls the AKS Construction as a module.

//------Application General Parameters------
param nameseed string = 'sampleapp'
param location string =  resourceGroup().location
var fullnameseed = '${nameseed}-${location}'


//--------------SQL Server--------------
param administratorLogin string

var serverName = 'sql-${nameseed}'

resource sql 'Microsoft.Sql/servers@2021-02-01-preview' = {
  name: serverName
  location: location
  properties: {
      administratorLogin: administratorLogin
  }
}
output name string = sql.name


//---------Kubernetes Construction---------
//ref: https://github.com/Azure/Aks-Construction

module aksconst '../bicep/main.bicep' = {
  name: 'aksconstruction'
  params: {
    location : 'uksouth'
    resourceName: fullnameseed
    kubernetesVersion: '1.21.1'
    enablePrivateCluster : true
    agentCount: 1
    agentVMSize: 'Standard_DS3_v2'
    agentCountMax: 3
    enable_aad: true
    enableAzureRBAC : true
    registries_sku: 'Premium'
    omsagent: true
    retentionInDays: 30
    networkPolicy: 'calico'
    azurepolicy: 'audit'
    availabilityZones: [
      '1'
      '2'
      '3'
    ]
    ingressApplicationGateway: true
    serviceCidr: '172.16.0.0/16'
    dnsServiceIP: '172.16.0.10'  
  }
}
output aksClusterName string = aksconst.outputs.aksClusterName
output ApplicationGatewayName string = aksconst.outputs.ApplicationGatewayName

