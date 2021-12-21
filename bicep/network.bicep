param resourceName string
param location string
param vnetAddressPrefix string

param vnetFirewallSubnetAddressPrefix string = ''

param ingressApplicationGateway bool = false
param azureFirewalls bool = false

param vnetAksSubnetAddressPrefix string
param vnetAppGatewaySubnetAddressPrefix string
param aksPrincipleId string = ''

param privateLinks bool = false
param privateLinkSubnetAddressPrefix string = ''
param privateLinkAcrId string = ''
param privateLinkAkvId string = ''

param acrPrivatePool bool = false
param acrAgentPoolSubnetAddressPrefix string = ''

param bastion bool =false
param bastionSubnetAddressPrefix string = ''

param availabilityZones array = []

param workspaceDiagsId string = ''

param networkSecurityGroups bool = true

var bastion_subnet_name = 'AzureBastionSubnet'
var bastion_subnet = {
  name: bastion_subnet_name
  properties: {
    addressPrefix: bastionSubnetAddressPrefix
  }
}

var acrpool_subnet_name = 'acrpool-sn'
var acrpool_subnet = {
  name: acrpool_subnet_name
  properties: {
    addressPrefix: acrAgentPoolSubnetAddressPrefix
  }
}

var private_link_subnet_name = 'privatelinks-sn'
var private_link_subnet = {
  name: private_link_subnet_name
  properties: {
    addressPrefix: privateLinkSubnetAddressPrefix
    privateEndpointNetworkPolicies: 'Disabled'
    privateLinkServiceNetworkPolicies: 'Enabled'
  }
}

var appgw_subnet_name = 'appgw-sn'
var appgw_subnet = {
  name: appgw_subnet_name
  properties: {
    addressPrefix: vnetAppGatewaySubnetAddressPrefix
    networkSecurityGroup: ingressApplicationGateway && networkSecurityGroups ? {
      id: nsgAppGw.outputs.nsgId
    } : {}
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
var aks_subnet =  {
  name: aks_subnet_name
  properties: union({
      addressPrefix: vnetAksSubnetAddressPrefix
    }, privateLinks ? {
      privateEndpointNetworkPolicies: 'Disabled'
      privateLinkServiceNetworkPolicies: 'Enabled'
    } : {}, azureFirewalls ? {
      routeTable: {
        id: vnet_udr.id //resourceId('Microsoft.Network/routeTables', routeFwTableName)
      }
    }: {})
}


var subnets_1 = azureFirewalls ? concat(array(aks_subnet), array(fw_subnet)) : array(aks_subnet)
var subnets_2 = privateLinks ? concat(array(subnets_1), array(private_link_subnet)) : array(subnets_1)
var subnets_3 = acrPrivatePool ? concat(array(subnets_2), array(acrpool_subnet)) : array(subnets_2)
var subnets_4 = bastion ? concat(array(subnets_3), array(bastion_subnet)) : array(subnets_3)


// DONT create appgw subnet, the addon will create it for us

var final_subnets = ingressApplicationGateway ? concat(array(subnets_4), array(appgw_subnet)) : array(subnets_4)

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
output acrPoolSubnetId string = acrPrivatePool ? '${vnet.id}/subnets/${acrpool_subnet_name}' : ''
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


/*   --------------------------------------------------------------------------  Private Link for ACR      */
var privateLinkAcrName = 'vnet-pl-acr-${resourceName}'
resource privateLinkAcr 'Microsoft.Network/privateEndpoints@2021-03-01' = if (!empty(privateLinkAcrId)) {
  name: privateLinkAcrName
  location: location
  properties: {
    privateLinkServiceConnections: [
      {
        name: 'Acr-Connection'
        properties: {
          privateLinkServiceId: privateLinkAcrId
          groupIds: [
            'registry'
          ]
        }
      }
    ]
    subnet: {
      id: '${vnet.id}/subnets/${private_link_subnet_name}'
    }
  }
}

resource privateDnsAcr 'Microsoft.Network/privateDnsZones@2020-06-01' = if (!empty(privateLinkAcrId))  {
  name: 'privatelink.azurecr.io'
  location: 'global'
}

var privateDnsAcrLinkName = 'vnet-dnscr-${resourceName}'
resource privateDnsAcrLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = if (!empty(privateLinkAcrId))  {
  parent: privateDnsAcr
  name: privateDnsAcrLinkName
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnet.id
    }
  }
}

resource privateDnsAcrZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2021-03-01' = if (!empty(privateLinkAcrId))  {
  parent: privateLinkAcr
  name: 'default'
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'vnet-pl-acr'
        properties: {
          privateDnsZoneId: privateDnsAcr.id
        }
      }
    ]
  }
}


/*   --------------------------------------------------------------------------  Private Link for KeyVault      */
var privateLinkAkvName = 'vnet-pl-akv-${resourceName}'
resource privateLinkAkv 'Microsoft.Network/privateEndpoints@2021-03-01' = if (!empty(privateLinkAkvId)) {
  name: privateLinkAkvName
  location: location
  properties: {
    privateLinkServiceConnections: [
      {
        name: 'Akv-Connection'
        properties: {
          privateLinkServiceId: privateLinkAkvId
          groupIds: [
            'vault'
          ]
        }
      }
    ]
    subnet: {
      id: '${vnet.id}/subnets/${private_link_subnet_name}'
    }
  }
}

resource privateDnsAkv 'Microsoft.Network/privateDnsZones@2020-06-01' = if (!empty(privateLinkAkvId))  {
  name: 'privatelink.vaultcore.azure.net'
  location: 'global'
}

var privateDnsAkvLinkName = 'vnet-dnscr-${resourceName}'
resource privateDnsAkvLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = if (!empty(privateLinkAkvId))  {
  parent: privateDnsAkv
  name: privateDnsAkvLinkName
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnet.id
    }
  }
}

resource privateDnsAkvZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2021-03-01' = if (!empty(privateLinkAkvId))  {
  parent: privateLinkAkv
  name: 'default'
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'vnet-pl-akv'
        properties: {
          privateDnsZoneId: privateDnsAkv.id
        }
      }
    ]
  }
}

param bastionHostName string = 'bas-${resourceName}'
var publicIpAddressName = 'pip-${bastionHostName}'

resource bastionPip 'Microsoft.Network/publicIPAddresses@2021-03-01' = {
  name: publicIpAddressName
  location: location
  sku: {
    name: 'Standard'
  }
  zones: !empty(availabilityZones) ? availabilityZones : []
  properties: {
    publicIPAllocationMethod: 'Static'
  }
}

resource bastionHost 'Microsoft.Network/bastionHosts@2020-05-01' = if(bastion) {
  name: bastionHostName
  location: location
  properties: {
    ipConfigurations: [
      {
        name: 'IpConf'
        properties: {
          subnet: {
            id: '${vnet.id}/subnets/${bastion_subnet_name}'
          }
          publicIPAddress: {
            id: bastionPip.id
          }
        }
      }
    ]
  }
}

module nsgAppGw 'nsgAppGw.bicep' = if(ingressApplicationGateway && networkSecurityGroups) {
  name: 'nsgAppGw'
  params: {
    location: location
    resourceName: resourceName
    workspaceDiagsId: workspaceDiagsId
  }
}
