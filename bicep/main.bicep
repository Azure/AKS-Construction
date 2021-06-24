param location string = resourceGroup().location
param resourceName string

//---------------------------------------------------------------------------------- User Identity
var user_identity = create_vnet || existing_vnet
var user_identity_name = 'id-${resourceName}'

resource uai 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = if (user_identity) {
  name: user_identity_name
  location: location
}

// ------------------------------------------------------- If DNS Zone
// will be solved with 'existing' https://github.com/Azure/bicep/issues/258

param dnsZoneId string = ''
var dnsZoneRg = !empty(dnsZoneId) ? split(dnsZoneId, '/')[4] : ''
var dnsZoneName = !empty(dnsZoneId) ? split(dnsZoneId, '/')[8] : ''

module dnsZone './dnsZone.bicep' = if (!empty(dnsZoneId)) {
  name: 'addDnsContributor'
  scope: resourceGroup(dnsZoneRg)
  params: {
    dnsZoneName: dnsZoneName
    principalId: aks.properties.identityProfile.kubeletidentity.objectId
  }
}

//---------------------------------------------------------------------------------- ACR
param registries_sku string = ''
param ACRserviceEndpointFW string = '' // either IP, or 'vnetonly'

var acrName = 'acr${replace(resourceName, '-', '')}'

resource acr 'Microsoft.ContainerRegistry/registries@2020-11-01-preview' = if (!empty(registries_sku)) {
  name: acrName
  location: location
  sku: {
    name: registries_sku
  }
  properties: !empty(ACRserviceEndpointFW) ? {
    networkRuleSet: {
      defaultAction: 'Deny'
      virtualNetworkRules: [
        {
          action: 'Allow'
          id: '${vnet.id}/subnets/${aks_subnet_name}'
        }
      ]
      ipRules: ACRserviceEndpointFW != 'vnetonly' ? [
        {
          action: 'Allow'
          value: ACRserviceEndpointFW
        }
      ] : null
    }
  } : {}
}

var AcrPullRole = resourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
/*
resource aks_acr_pull 'Microsoft.ContainerRegistry/registries/providers/roleAssignments@2017-05-01' = if (!empty(registries_sku)) {
  name: '${acrName}/Microsoft.Authorization/${guid(resourceGroup().id, acrName)}'
  properties: {
    roleDefinitionId: AcrPullRole
    principalId: aks.properties.identityProfile.kubeletidentity.objectId
    principalType: 'ServicePrincipal'
  }
}
*/
// New way of setting scope https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/scope-extension-resources
resource aks_acr_pull 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = if (!empty(registries_sku)) {
  scope: acr // Use when specifying a scope that is different than the deployment scope
  name: guid(resourceGroup().id, acrName)
  properties: {
    roleDefinitionId: AcrPullRole
    principalType: 'ServicePrincipal'
    principalId: aks.properties.identityProfile.kubeletidentity.objectId
  }
}

//---------------------------------------------------------------------------------- VNET
param custom_vnet bool = false
param vnetAddressPrefix string = '10.0.0.0/8'
param vnetAksSubnetAddressPrefix string = '10.240.0.0/16'
//param vnetInternalLBSubnetAddressPrefix string = '10.241.128.0/24'
param vnetAppGatewaySubnetAddressPrefix string = '10.2.0.0/16'
param vnetFirewallSubnetAddressPrefix string = '10.241.130.0/26'

param byoAKSSubnetId string =''
var existing_vnet = !empty(byoAKSSubnetId)
var existingAksVnetRG = !empty(byoAKSSubnetId) ? split(byoAKSSubnetId, '/')[4] : ''

module aksnetcontrib './aksnetcontrib.bicep' = if (existing_vnet && user_identity) {
  name: 'addAksNetContributor'
  scope: resourceGroup(existingAksVnetRG)
  params: {
    byoAKSSubnetId: byoAKSSubnetId
    //principalId:  aks.properties.identityProfile.kubeletidentity.objectId 
    principalId:  uai.properties.principalId
  }
}
output uaiPrincipalId string = uai.properties.principalId
output aksIdentityType string = aks.identity.type
//output aksIdentityPrincipalId string = aks.identity.principalId
output aksClusterName string = aks.name

param byoAGWSubnetId string = ''
var existingAGWSubnetName = !empty(byoAGWSubnetId) ? split(byoAGWSubnetId, '/')[10] : ''
var existingAGWVnetName = !empty(byoAGWSubnetId) ? split(byoAGWSubnetId, '/')[8] : ''
var existingAGWVnetRG = !empty(byoAGWSubnetId) ? split(byoAGWSubnetId, '/')[4] : ''
resource existingAgwVnet 'Microsoft.Network/virtualNetworks@2021-02-01' existing =  {
  name: existingAGWVnetName
  scope : resourceGroup(existingAGWVnetRG)
}
resource existingAGWSubnet 'Microsoft.Network/virtualNetworks/subnets@2020-08-01' existing = {
  parent: existingAgwVnet
  name: existingAGWSubnetName
}
var existingAGWSubnetAddPrefix=existingAGWSubnet.properties.addressPrefix


param serviceEndpoints array = []

var firewallIP = '10.241.130.4' // always .4

var create_vnet = existing_vnet ? false : custom_vnet || azureFirewalls || !empty(serviceEndpoints)

param vnetName string = 'vnet-${resourceName}'

var appgw_subnet_name = 'appgw-sn'
var appgw_subnet = {
  name: appgw_subnet_name
  properties: {
    addressPrefix: vnetAppGatewaySubnetAddressPrefix
  }
}
var fw_subnet_name = 'AzureFirewallSubnet' // Required by FW
var fw_subnet = {
  name: fw_subnet_name
  properties: {
    addressPrefix: vnetFirewallSubnetAddressPrefix
  }
}

param azureFirewalls bool = false

param aks_subnet_name string = 'aks-sn'
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

resource vnet 'Microsoft.Network/virtualNetworks@2020-07-01' = if (create_vnet) {
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

var networkContributorRole = resourceId('Microsoft.Authorization/roleDefinitions', '4d97b98b-1d4f-4787-a291-c67834d212e7')
resource aks_vnet_cont 'Microsoft.Network/virtualNetworks/subnets/providers/roleAssignments@2020-04-01-preview' = if (create_vnet) {
  name: '${vnet.name}/${aks_subnet_name}/Microsoft.Authorization/${guid(resourceGroup().id, aks_subnet_name)}'
  properties: {
    roleDefinitionId: networkContributorRole
    principalId: user_identity ? uai.properties.principalId : null
    principalType: 'ServicePrincipal'
    //scope: '${vnet.id}/subnets/${aks_subnet_name}'
  }
}

//---------------------------------------------------------------------------------- Firewall
var routeFwTableName = '${resourceName}-fw-udr'
resource vnet_udr 'Microsoft.Network/routeTables@2019-04-01' = if (azureFirewalls) {
  name: routeFwTableName
  location: location
  properties: {
    routes: [
      {
        name: 'AKSNodesEgress'
        properties: {
          addressPrefix: '0.0.0.0/1'
          nextHopType: 'VirtualAppliance'
          nextHopIpAddress: firewallIP
        }
      }
    ]
  }
}

var firewallPublicIpName = '${resourceName}-fw-ip'
resource fw_pip 'Microsoft.Network/publicIPAddresses@2018-08-01' = if (azureFirewalls) {
  name: firewallPublicIpName
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    publicIPAllocationMethod: 'Static'
    publicIPAddressVersion: 'IPv4'
  }
}

var fw_name = '${resourceName}-fw'
resource fw 'Microsoft.Network/azureFirewalls@2019-04-01' = if (azureFirewalls) {
  name: fw_name
  location: location
  properties: {
    ipConfigurations: [
      {
        name: 'IpConf1'
        properties: {
          subnet: {
            id: '${vnet.id}/subnets/${fw_subnet_name}'
          }
          publicIPAddress: {
            id: fw_pip.id
          }
        }
      }
    ]
    threatIntelMode: 'Alert'
    applicationRuleCollections: [
      {
        name: 'clusterRc1'
        properties: {
          priority: 101
          action: {
            type: 'Allow'
          }
          rules: [
            {
              name: 'MicrosoftServices'
              protocols: [
                {
                  port: 443
                  protocolType: 'Https'
                }
              ]
              targetFqdns: [
                '*.hcp.${location}.azmk8s.io'
                'mcr.microsoft.com'
                '*.data.mcr.microsoft.com'
                'management.azure.com'
                'login.microsoftonline.com'
                'packages.microsoft.com'
                'acs-mirror.azureedge.net'
              ]
              sourceAddresses: [
                vnetAksSubnetAddressPrefix
              ]
            }
            {
              name: 'UbuntuOS'
              protocols: [
                {
                  port: 80
                  protocolType: 'Http'
                }
              ]
              targetFqdns: [
                'security.ubuntu.com'
                'azure.archive.ubuntu.com'
                'changelogs.ubuntu.com'
              ]
              sourceAddresses: [
                vnetAksSubnetAddressPrefix
              ]
            }
            {
              name: 'NetworkTimeProtocol'
              protocols: [
                {
                  port: 123
                }
              ]
              sourceAddresses: [
                vnetAksSubnetAddressPrefix
              ]
              targetFqdns: [
                'ntp.ubuntu.com'
              ]
            }
            {
              name: 'Monitor'
              protocols: [
                {
                  port: 443
                  protocolType: 'Https'
                }
              ]
              targetFqdns: [
                'dc.services.visualstudio.com'
                '*.ods.opinsights.azure.com'
                '*.oms.opinsights.azure.com'
                '*.monitoring.azure.com'
              ]
              sourceAddresses: [
                vnetAksSubnetAddressPrefix
              ]
            }
            {
              name: 'AzurePolicy'
              protocols: [
                {
                  port: 443
                  protocolType: 'Https'
                }
              ]
              targetFqdns: [
                //'data.policy.${environment().suffixes.storage}'
                'data.policy.core.windows.net'
                'store.policy.core.windows.net'
                'gov-prod-policy-data.trafficmanager.net'
                'raw.githubusercontent.com'
                'dc.services.visualstudio.com'
              ]
              sourceAddresses: [
                vnetAksSubnetAddressPrefix
              ]
            }
          ]
        }
      }
    ]
    networkRuleCollections: [
      {
        name: 'netRc1'
        properties: {
          priority: 100
          action: {
            type: 'Allow'
          }
          rules: [
            {
              name: 'ControlPlaneTCP'
              protocols: [
                'TCP'
              ]
              sourceAddresses: [
                vnetAksSubnetAddressPrefix
              ]
              destinationAddresses: [
                'AzureCloud.${location}'
              ]
              destinationPorts: [
                '9000' /* For tunneled secure communication between the nodes and the control plane. */
                '22'
              ]
            }
            {
              name: 'ControlPlaneUDP'
              protocols: [
                'UDP'
              ]
              sourceAddresses: [
                vnetAksSubnetAddressPrefix
              ]
              destinationAddresses: [
                'AzureCloud.${location}'
              ]
              destinationPorts: [
                '1194' /* For tunneled secure communication between the nodes and the control plane. */
              ]
            }
            {
              name: 'AzureMonitorForContainers'
              protocols: [
                'TCP'
              ]
              sourceAddresses: [
                vnetAksSubnetAddressPrefix
              ]
              destinationAddresses: [
                'AzureMonitor'
              ]
              destinationPorts: [
                '443'
              ]
            }
          ]
        }
      }
    ]
  }
}

//---------------------------------------------------------------------------------- AppGateway - Only if Existing/Custom VNET, otherwise addon will auto-create
var appgwSubnetId = !empty(byoAGWSubnetId) ? byoAGWSubnetId : (create_vnet ? '${vnet.id}/subnets/${appgw_subnet_name}' : '') 

module appGw './appgw.bicep' = if ((create_vnet && ingressApplicationGateway) || (!empty(byoAGWSubnetId) && ingressApplicationGateway) ) {
  name: 'addAppGw'
  params: {
    resourceName: resourceName
    location: location
    appgw_subnet_id: appgwSubnetId
  }
}

//---------------------------------------------------------------------------------- AKS
param dnsPrefix string = '${resourceName}-dns'
param kubernetesVersion string = '1.21.1'
param enable_aad bool = false
param aad_tenant_id string = ''
param omsagent bool = false
param privateCluster bool = false
param ingressApplicationGateway bool = false
param enableAzureRBAC bool = false
param upgradeChannel string = ''
param osDiskType string = 'Epthemeral'
param agentVMSize string = 'Standard_DS2_v2'
param osDiskSizeGB int = 0
param agentCount int = 3
param agentCountMax int = 0
param maxPods int = 30
param networkPlugin string = 'azure'
param networkPolicy string = ''
param azurepolicy string = ''
param gitops string = ''
param authorizedIPRanges array = []
param enablePrivateCluster bool = false
param availabilityZones array = []

param podCidr string = '10.244.0.0/16'
param serviceCidr string = '10.0.0.0/16'
param dnsServiceIP string = '10.0.0.10'
param dockerBridgeCidr string = '172.17.0.1/16'

var appgw_name = 'agw-${resourceName}'

var autoScale = agentCountMax > agentCount
var aksSubnetId = existing_vnet ? byoAKSSubnetId : (create_vnet ? '${vnet.id}/subnets/${aks_subnet_name}' : null) 
var agentPoolProfiles = {
  name: 'nodepool1'
  mode: 'System'
  osDiskType: osDiskType
  osDiskSizeGB: osDiskSizeGB
  count: agentCount
  vmSize: agentVMSize
  osType: 'Linux'
  vnetSubnetID: aksSubnetId
  maxPods: maxPods
  type: 'VirtualMachineScaleSets'
  enableAutoScaling: autoScale
  availabilityZones: !empty(availabilityZones) ? availabilityZones : null
}

var aks_properties_base = {
  kubernetesVersion: kubernetesVersion
  enableRBAC: true
  dnsPrefix: dnsPrefix
  aadProfile: enable_aad ? {
    managed: true
    enableAzureRBAC: enableAzureRBAC
    tenantID: aad_tenant_id
  } : null
  apiServerAccessProfile: !empty(authorizedIPRanges) ? {
    authorizedIPRanges: authorizedIPRanges
  } : {
    enablePrivateCluster: enablePrivateCluster
  }
  agentPoolProfiles: autoScale ? array(union(agentPoolProfiles, {
    minCount: agentCount
    maxCount: agentCountMax
  })) : array(agentPoolProfiles)
  networkProfile: {
    loadBalancerSku: 'standard'
    networkPlugin: networkPlugin
    networkPolicy: networkPolicy
    podCidr: podCidr
    serviceCidr: serviceCidr
    dnsServiceIP: dnsServiceIP
    dockerBridgeCidr: dockerBridgeCidr
  }
}

var aks_properties1 = !empty(upgradeChannel) ? union(aks_properties_base, {
  autoUpgradeProfile: {
    upgradeChannel: upgradeChannel
  }
}) : aks_properties_base

var aks_addons = {}
var aks_addons1 = ingressApplicationGateway ? union(aks_addons, create_vnet || existing_vnet ? {
  /*
  
  COMMENTED OUT UNTIL addon supports creating Appgw in custom vnet.  Workaround is a follow up az cli command

  ingressApplicationGateway: {
    config: {
      //applicationGatewayName: appgw_name
      // 121011521000988: This doesn't work, bug : "code":"InvalidTemplateDeployment", IngressApplicationGateway addon cannot find subnet
      //subnetID: '${vnet.id}/subnets/${appgw_subnet_name}'
      //subnetCIDR: vnetAppGatewaySubnetAddressPrefix
      applicationGatewayId: '${appgw.id}'
    }
    enabled: true
  }
  */
} : {
  ingressApplicationGateway: {
    enabled: true
    config: {
      applicationGatewayName: appgw_name
      subnetCIDR: !empty(existingAGWSubnetAddPrefix) ? existingAGWSubnetAddPrefix : vnetAppGatewaySubnetAddressPrefix
    }
  }
}) : aks_addons

var aks_addons2 = omsagent ? union(aks_addons1, {
  omsagent: {
    enabled: true
    config: {
      logAnalyticsWorkspaceResourceID: aks_law.id
    }
  }
}) : aks_addons1

var aks_addons3 = !empty(gitops) ? union(aks_addons2, {
  gitops: {
    //    config": null,
    enabled: true
    //    identity: {
    //      clientId: 'xxx',
    //      objectId: 'xxx',
    //      resourceId: '/subscriptions/95efa97a-9b5d-4f74-9f75-a3396e23344d/resourcegroups/xxx/providers/Microsoft.ManagedIdentity/userAssignedIdentities/xxx'
    //    }
  }
}) : aks_addons2

var aks_addons4 = !empty(azurepolicy) ? union(aks_addons3, {
  azurepolicy: {
    config: {
      version: 'v2'
    }
    enabled: true
  }
}) : aks_addons3

var aks_properties2 = !empty(aks_addons4) ? union(aks_properties1, {
  addonProfiles: aks_addons4
}) : aks_properties1

var aks_identity_user = {
  type: 'UserAssigned'
  userAssignedIdentities: {
    '${uai.id}': {}
  }
}

resource aks 'Microsoft.ContainerService/managedClusters@2021-02-01' = {
  name: 'aks-${resourceName}'
  location: location
  properties: aks_properties2
  identity: user_identity ? aks_identity_user : {
    type: 'SystemAssigned'
  }
}

// https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Kubernetes/Kubernetes_PSPBaselineStandard.json
var policySetPodSecBaseline = resourceId('Microsoft.Authorization/policySetDefinitions', 'a8640138-9b0a-4a28-b8cb-1666c838647d')
resource aks_policies 'Microsoft.Authorization/policyAssignments@2019-09-01' = if (!empty(azurepolicy)) {
  name: '${resourceName}-baseline'
  location: location
  properties: {
    scope: resourceGroup().id
    policyDefinitionId: policySetPodSecBaseline
    parameters: {
      // Gives error: "The request content was invalid and could not be deserialized"
      //excludedNamespaces: '[  "kube-system",  "gatekeeper-system",  "azure-arc"]'
      effect: {
        value: azurepolicy
      }
    }
  }
}

param adminprincipleid string = ''
// for AAD Integrated Cluster wusing 'enableAzureRBAC', add Cluster admin to the current user!
var buildInAKSRBACClusterAdmin = resourceId('Microsoft.Authorization/roleDefinitions', 'b1ff04bb-8a4e-4dc4-8eb5-8693973ce19b')
resource aks_admin_role_assignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = if (enableAzureRBAC && !empty(adminprincipleid)) {
  scope: aks // Use when specifying a scope that is different than the deployment scope
  name: guid(resourceGroup().id, 'aks_admin_role_assignment')
  properties: {
    roleDefinitionId: buildInAKSRBACClusterAdmin
    principalType: 'User'
    principalId: adminprincipleid
  }
}

//---------------------------------------------------------------------------------- gitops (to apply the post-helm packages to the cluster)
// WAITING FOR PUBLIC PREVIEW
// https://docs.microsoft.com/en-gb/azure/azure-arc/kubernetes/use-gitops-connected-cluster#using-azure-cli
/*
resource gitops 'Microsoft.KubernetesConfiguration/sourceControlConfigurations@2019-11-01-preview' = if (false) {
  name: 'bla'
  location: 'bla'
}
*/

//---------------------------------------------------------------------------------- Container Insights

param retentionInDays int = 30
var aks_law_name = 'log-${resourceName}'
resource aks_law 'Microsoft.OperationalInsights/workspaces@2020-08-01' = if (omsagent) {
  name: aks_law_name
  location: location
  properties: {
    retentionInDays: retentionInDays
  }
}

/* ------ NOTES 
output of AKS - runtime -- properties of created resources (aks.properties.<>) (instead of ARM function reference(...) )
  provisioningState, 
  powerState, 
  kubernetesVersion, 
  dnsPrefix, 
  fqdn, 
  agentPoolProfiles, 
  windowsProfile, 
  servicePrincipalProfile.clientId 
  addonProfiles, 
  nodeResourceGroup, 
  enableRBAC, 
  networkProfile, 
  aadProfile, 
  maxAgentPools, 
  apiServerAccessProfile, 
  identityProfile.
  autoScalerProfile

 
compipetime --- Instead of using the resourceId(), .ids will compile to [resourceId('Microsoft.Storage/storageAccounts', parameters('name'))]
  output blobid string = aks.id
  output blobid string = aks.name
  output blobid string = aks.apiVersion
  output blobid string = aks.type
*/
