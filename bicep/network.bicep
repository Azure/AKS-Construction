param resourceName string
param location string
param vnetAddressPrefix string
//param vnetInternalLBSubnetAddressPrefix string = '10.241.128.0/24'
param vnetFirewallSubnetAddressPrefix string = ''
param serviceEndpoints array = []

param ingressApplicationGateway bool = false
param azureFirewalls bool = false

param vnetAksSubnetAddressPrefix string
param vnetAppGatewaySubnetAddressPrefix string
param aksPrincipleId string = ''

var appgw_subnet_name = 'appgw-sn'
var appgw_subnet = {
  name: appgw_subnet_name
  properties: {
    addressPrefix: vnetAppGatewaySubnetAddressPrefix
    serviceEndpoints: serviceEndpoints
  }
}
var fw_subnet_name = 'AzureFirewallSubnet' // Required by FW
var fw_subnet = {
  name: fw_subnet_name
  properties: {
    addressPrefix: vnetFirewallSubnetAddressPrefix
  }
}

/// ---- Firewall VNET config
module calcAzFwIp './calcAzFwIp.bicep' = if (azureFirewalls) {
  name: 'calcAzFwIp'
  params: {
    vnetFirewallSubnetAddressPrefix: vnetFirewallSubnetAddressPrefix
  }
}

var routeFwTableName = 'rt-afw-${resourceName}'
resource vnet_udr 'Microsoft.Network/routeTables@2021-02-01' = if (azureFirewalls) {
  name: routeFwTableName
  location: location
  properties: {
    routes: [
      {
        name: 'AKSNodesEgress'
        properties: {
          addressPrefix: '0.0.0.0/1'
          nextHopType: 'VirtualAppliance'
          nextHopIpAddress: azureFirewalls ? calcAzFwIp.outputs.FirewallPrivateIp : null
        }
      }
    ]
  }
}

var aks_subnet_name = 'aks-sn'
var aks_subnet = azureFirewalls ? {
  name: aks_subnet_name
  properties: {
    addressPrefix: vnetAksSubnetAddressPrefix
    routeTable: {
      id: vnet_udr.id //resourceId('Microsoft.Network/routeTables', routeFwTableName)
    }
  }
} : {
  name: aks_subnet_name
  properties: {
    addressPrefix: vnetAksSubnetAddressPrefix
    serviceEndpoints: serviceEndpoints
  }
}

var subnets_1 = azureFirewalls ? concat(array(aks_subnet), array(fw_subnet)) : array(aks_subnet)

// DONT create appgw subnet, the addon will create it for us

var final_subnets = ingressApplicationGateway ? concat(array(subnets_1), array(appgw_subnet)) : array(subnets_1)

var vnetName = 'vnet-${resourceName}'
resource vnet 'Microsoft.Network/virtualNetworks@2021-02-01' = {
  name: vnetName
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        vnetAddressPrefix
      ]
    }
    subnets: final_subnets
  }
}
output vnetId string = vnet.id
output aksSubnetId string = resourceId('Microsoft.Network/virtualNetworks/subnets', vnet.name, aks_subnet_name)
output fwSubnetId string = azureFirewalls ? '${vnet.id}/subnets/${fw_subnet_name}' : ''
output appGwSubnetId string = resourceId('Microsoft.Network/virtualNetworks/subnets', vnet.name, appgw_subnet_name)

var networkContributorRole = resourceId('Microsoft.Authorization/roleDefinitions', '4d97b98b-1d4f-4787-a291-c67834d212e7')

resource aks_vnet_cont 'Microsoft.Network/virtualNetworks/subnets/providers/roleAssignments@2020-04-01-preview' = if (!empty(aksPrincipleId)) {
  name: '${vnet.name}/${aks_subnet_name}/Microsoft.Authorization/${guid(resourceGroup().id, vnetName, aks_subnet_name)}'
  properties: {
    roleDefinitionId: networkContributorRole
    principalId: aksPrincipleId
    principalType: 'ServicePrincipal'
  }
}
