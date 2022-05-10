// You should use a bicep file to represent an application deployment
// This "Application Main.Bicep" will then call the AKS Construction module

//------Application General Parameters------
@description('The individual name of your application')
@minLength(3)
@maxLength(6)
param nameseed string = 'app'
param location string =  resourceGroup().location

@allowed([
  'Production'
  'NonProduction'
])
@description('The performance/size spec of the generated resources')
param environmentScale string = 'NonProduction'

//------------------NAMING-----------------
//- As per CAF naming standards: https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming
//Example generated names will be : sql-app-nprd-euw-001, aks-app-nprd-euw-001, log-app-nprd-euw-001

@description('Short name to use for environment resource name')
param environmentName string = 'nprd'

@description('Instance or other differentiator for resource deployment')
param namesuffix string = '001'

@description('This json file is used to convert a long location name (eg. UK South) to its short version (eg. UKS)')
var shortLocationNames = json(loadTextContent('./shortLocationNames.json'))

@description('Maps the long name to the short name')
var shortLocationName = '${shortLocationNames[location]}'

@description('Creates a full resource name seed.')
var fullnameseed = '${nameseed}-${environmentName}-${shortLocationName}-${namesuffix}'


//--------------ENVIRONMENT-------------
var environmentConfigurationMap = {
  Production: {
    aks: {
      availabilityZones: [
        '1'
        '2'
        '3'
      ]
      AksPaidSkuForSLA: true
      JustUseSystemPool: false
      privateCluster: true
      networkPolicy: 'azure'
      agentCount:6
      agentCountMax:12
      agentVMSize: 'Standard_D8s_v4'
    }
  }
  NonProduction: {
    aks: {
      availabilityZones: []
      AksPaidSkuForSLA: false
      JustUseSystemPool: true
      privateCluster: false
      agentCount:1
      agentCountMax:3
      networkPolicy: ''
      agentVMSize: 'Standard_DS3_v2'
    }
  }
}

//--------------SQL Server--------------
param administratorLogin string

var serverName = 'sql-${fullnameseed}'

resource sql 'Microsoft.Sql/servers@2021-02-01-preview' = {
  name: serverName
  location: location
  properties: {
      administratorLogin: administratorLogin
  }
}
output name string = sql.name


//---------Kubernetes Construction---------
//ref: https://github.com/Azure/AKS-Construction
param k8sVersion string = '1.22.6'

module aksconst '../bicep/main.bicep' = {
  name: 'aksconstruction'
  params: {
    location : location
    resourceName: fullnameseed
    kubernetesVersion: k8sVersion
    enablePrivateCluster :  environmentConfigurationMap[environmentScale].aks.privateCluster
    agentCount: environmentConfigurationMap[environmentScale].aks.agentCount
    agentVMSize: environmentConfigurationMap[environmentScale].aks.agentVMSize
    agentCountMax: environmentConfigurationMap[environmentScale].aks.agentCountMax
    enable_aad: true
    enableAzureRBAC : true
    registries_sku: 'Premium'
    omsagent: true
    retentionInDays: 30
    networkPolicy: environmentConfigurationMap[environmentScale].aks.networkPolicy
    azurepolicy: 'audit'
    availabilityZones: environmentConfigurationMap[environmentScale].aks.availabilityZones
    AksPaidSkuForSLA: environmentConfigurationMap[environmentScale].aks.AksPaidSkuForSLA
    JustUseSystemPool: environmentConfigurationMap[environmentScale].aks.JustUseSystemPool
  }
}
output aksClusterName string = aksconst.outputs.aksClusterName
output ApplicationGatewayName string = aksconst.outputs.ApplicationGatewayName
