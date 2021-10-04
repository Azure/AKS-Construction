param location string = resourceGroup().location

@minLength(3)
@maxLength(20)
@description('Used to name all resources')
param resourceName string

/*
Resource sections
1. Networking
2. DNS
3. Key Vault
4. Container Registry
5. Firewall
6. Application Gateway
7. AKS
8. Log Analytics
*/


/*_   _ ______ _________          ______  _____  _  _______ _   _  _____ 
 | \ | |  ____|__   __\ \        / / __ \|  __ \| |/ /_   _| \ | |/ ____|
 |  \| | |__     | |   \ \  /\  / / |  | | |__) | ' /  | | |  \| | |  __ 
 | . ` |  __|    | |    \ \/  \/ /| |  | |  _  /|  <   | | | . ` | | |_ |
 | |\  | |____   | |     \  /\  / | |__| | | \ \| . \ _| |_| |\  | |__| |
 |_| \_|______|  |_|      \/  \/   \____/|_|  \_\_|\_\_____|_| \_|\_____|*/
//Networking can either be one of: custom / byo / default

@description('Are you providing your own vNet CIDR blocks')
param custom_vnet bool = false

@description('Full resource id path of an existing subnet to use for AKS')
param byoAKSSubnetId string = ''

@description('Full resource id path of an existing subnet to use for Application Gateway')
param byoAGWSubnetId string = ''

//--- Custom or BYO networking requires BYO AKS User Identity
var aks_byo_identity = custom_vnet || !empty(byoAKSSubnetId)
resource uai 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = if (aks_byo_identity) {
  name: 'id-${resourceName}'
  location: location
}

//----------------------------------------------------- BYO Vnet
var existingAksVnetRG = !empty(byoAKSSubnetId) ? (length(split(byoAKSSubnetId, '/')) > 4 ? split(byoAKSSubnetId, '/')[4] : '') : ''

module aksnetcontrib './aksnetcontrib.bicep' = if (!empty(byoAKSSubnetId)) {
  name: 'addAksNetContributor'
  scope: resourceGroup(existingAksVnetRG)
  params: {
    byoAKSSubnetId: byoAKSSubnetId
    user_identity_principalId: aks_byo_identity ? uai.properties.principalId : ''
    user_identity_name: uai.name
    user_identity_rg: resourceGroup().name
  }
}

var existingAGWSubnetName = !empty(byoAGWSubnetId) ? (length(split(byoAGWSubnetId, '/')) > 10 ? split(byoAGWSubnetId, '/')[10] : '') : ''
var existingAGWVnetName = !empty(byoAGWSubnetId) ? (length(split(byoAGWSubnetId, '/')) > 9 ? split(byoAGWSubnetId, '/')[8] : '') : ''
var existingAGWVnetRG = !empty(byoAGWSubnetId) ? (length(split(byoAGWSubnetId, '/')) > 9 ? split(byoAGWSubnetId, '/')[4] : '') : ''

resource existingAgwVnet 'Microsoft.Network/virtualNetworks@2021-02-01' existing = if (!empty(byoAGWSubnetId)) {
  name: existingAGWVnetName
  scope: resourceGroup(existingAGWVnetRG)
}
resource existingAGWSubnet 'Microsoft.Network/virtualNetworks/subnets@2020-11-01' existing = if (!empty(byoAGWSubnetId)) {
  parent: existingAgwVnet
  name: existingAGWSubnetName
}

//------------------------------------------------------ Create custom vnet
param vnetAddressPrefix string = '10.0.0.0/8'
param serviceEndpoints array = []
param vnetAksSubnetAddressPrefix string = '10.240.0.0/16'
param vnetFirewallSubnetAddressPrefix string = '10.241.130.0/26'
param vnetAppGatewaySubnetAddressPrefix string = '10.2.0.0/16'

module network './network.bicep' = if (custom_vnet) {
  name: 'network'
  params: {
    resourceName: resourceName
    location: location
    serviceEndpoints: serviceEndpoints
    vnetAddressPrefix: vnetAddressPrefix
    aksPrincipleId: aks_byo_identity ? uai.properties.principalId : ''
    vnetAksSubnetAddressPrefix: vnetAksSubnetAddressPrefix
    ingressApplicationGateway: ingressApplicationGateway
    vnetAppGatewaySubnetAddressPrefix: vnetAppGatewaySubnetAddressPrefix
    azureFirewalls: azureFirewalls
    vnetFirewallSubnetAddressPrefix: vnetFirewallSubnetAddressPrefix
  }
}

var appGatewaySubnetAddressPrefix = !empty(byoAGWSubnetId) ? existingAGWSubnet.properties.addressPrefix : vnetAppGatewaySubnetAddressPrefix
var aksSubnetId = custom_vnet ? network.outputs.aksSubnetId : byoAKSSubnetId
var appGwSubnetId = ingressApplicationGateway ? (custom_vnet ? network.outputs.appGwSubnetId : byoAGWSubnetId) : ''


// ----------------------------------------------------------------------- If DNS Zone
// will be solved with 'existing' https://github.com/Azure/bicep/issues/258

param dnsZoneId string = ''
var dnsZoneRg = !empty(dnsZoneId) ? split(dnsZoneId, '/')[4] : ''
var dnsZoneName = !empty(dnsZoneId) ? split(dnsZoneId, '/')[8] : ''
var isPrivate = !empty(dnsZoneId) ? split(dnsZoneId, '/')[7] == 'privateDnsZones' : false

module dnsZone './dnsZone.bicep' = if (!empty(dnsZoneId)) {
  name: 'addDnsContributor'
  scope: resourceGroup(dnsZoneRg)
  params: {
    dnsZoneName: dnsZoneName
    isPrivate: isPrivate
    vnetId: isPrivate ? (!empty(byoAKSSubnetId) ? split(byoAKSSubnetId, '/subnets')[0] : (custom_vnet ? network.outputs.vnetId : '')) : ''
    principalId: any(aks.properties.identityProfile.kubeletidentity).objectId
  }
}

//---------------------------------------------------------------------------------- AKV

param azureKeyvaultSecretsProvider bool = false //This is a preview feature

param createKV bool = false

param AKVserviceEndpointFW string = '' // either IP, or 'vnetonly'

var akvName = 'kv-${replace(resourceName, '-', '')}'

resource kv 'Microsoft.KeyVault/vaults@2021-06-01-preview' = if (createKV) {
  name: akvName
  location: location
  properties: union({
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'Standard'
    }
    enabledForTemplateDeployment: true
    // publicNetworkAccess:  whether the vault will accept traffic from public internet. If set to 'disabled' all traffic except private endpoint traffic and that that originates from trusted services will be blocked.
    publicNetworkAccess: 'enabled'
    accessPolicies: concat(azureKeyvaultSecretsProvider ? array({
      tenantId: subscription().tenantId
      objectId: aks.properties.addonProfiles.azureKeyvaultSecretsProvider.identity.objectId
      permissions: {
        keys: [
          'get'
          'decrypt'
          'unwrapKey'
          'verify'
        ]
        secrets: [
          'get'
        ]
        certificates: [
          'get'
          'getissuers'
        ]
      }
    }) : [], appgwKVIntegration ? array({
      tenantId: subscription().tenantId
      objectId: appGwIdentity.properties.principalId
      permissions: {
        secrets: [
          'get'
          'set'
          'delete'
          'list'
        ]
      }
    }) : [])
  }, !empty(AKVserviceEndpointFW) ? {
    networkAcls: {
      defaultAction: 'Deny'
      virtualNetworkRules: concat(array({
        action: 'Allow'
        id: aksSubnetId
      }), appgwKVIntegration ? array({
        action: 'Allow'
        id: appGwSubnetId
      }) : [])
      ipRules: AKVserviceEndpointFW != 'vnetonly' ? [
        {
          action: 'Allow'
          value: AKVserviceEndpointFW
        }
      ] : null
    }
  } : {})
}

//---------------------------------------------------------------------------------- ACR
param registries_sku string = ''
param ACRserviceEndpointFW string = '' // either IP, or 'vnetonly'

var acrName = 'cr${replace(resourceName, '-', '')}${uniqueString(resourceGroup().id, resourceName)}'

resource acr 'Microsoft.ContainerRegistry/registries@2021-06-01-preview' = if (!empty(registries_sku)) {
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
          id: aksSubnetId
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
// New way of setting scope https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/scope-extension-resources
resource aks_acr_pull 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = if (!empty(registries_sku)) {
  scope: acr // Use when specifying a scope that is different than the deployment scope
  name: guid(resourceGroup().id, acrName)
  properties: {
    roleDefinitionId: AcrPullRole
    principalType: 'ServicePrincipal'
    principalId: any(aks.properties.identityProfile.kubeletidentity).objectId
  }
}

//---------------------------------------------------------------------------------- Firewall
@description('Create an Azure Firewall')
param azureFirewalls bool = false
module firewall './firewall.bicep' = if (azureFirewalls && custom_vnet) {
  name: 'firewall'
  params: {
    resourceName: resourceName
    location: location
    workspaceDiagsId: aks_law.id
    fwSubnetId: azureFirewalls && custom_vnet ? network.outputs.fwSubnetId : ''
    vnetAksSubnetAddressPrefix: vnetAksSubnetAddressPrefix
  }
}

//---------------------------------------------------------------------------------- AppGateway
@description('Create an Application Gateway')
param ingressApplicationGateway bool = false
param appGWcount int = 2
param appGWmaxCount int = 0

@description('A known private ip in the Application Gateway subnet range to be allocated for internal traffic')
param privateIpApplicationGateway string = ''

param appgwKVIntegration bool = false

@allowed([
  'Standard_v2'
  'WAF_v2'
])
@description('The SKU for AppGw')
param appGWsku string = 'WAF_v2'

@description('Enable the WAF Firewall, valid for WAF_v2 SKUs')
param appGWenableFirewall bool = true

var deployAppGw = ingressApplicationGateway && (custom_vnet || !empty(byoAGWSubnetId))
var appGWenableWafFirewall = appGWsku=='Standard_v2' ? false : appGWenableFirewall

// If integrating App Gateway with KeyVault, create a Identity App Gateway will use to access keyvault
// 'identity' is always created (adding: "|| deployAppGw") until this is fixed: 
// https://github.com/Azure/bicep/issues/387#issuecomment-885671296
resource appGwIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = if ( /* appgwKVIntegration && */deployAppGw) {
  name: 'id-appgw-${resourceName}'
  location: location
}

var workspaceId = aks_law.id
var appgwName = 'agw-${resourceName}'
var appgwResourceId = deployAppGw ? resourceId('Microsoft.Network/applicationGateways', '${appgwName}') : ''

resource appgwpip 'Microsoft.Network/publicIPAddresses@2021-02-01' = if (deployAppGw) {
  name: 'pip-agw-${resourceName}'
  location: location
  sku: {
    name: 'Standard'
  }
  zones: !empty(availabilityZones) ? availabilityZones : []
  properties: {
    publicIPAllocationMethod: 'Static'
  }
}

var frontendPublicIpConfig = {
  properties: {
    publicIPAddress: {
      id: '${appgwpip.id}'
    }
  }
  name: 'appGatewayFrontendIP'
}

var frontendPrivateIpConfig = {
  properties: {
    privateIPAllocationMethod: 'Static'
    privateIPAddress: privateIpApplicationGateway
    subnet: {
      id: appGwSubnetId
    }
  }
  name: 'appGatewayPrivateIP'
}

var appGwFirewallConfigOwasp = {
  enabled: appGWenableWafFirewall
  firewallMode: 'Prevention' 
  ruleSetType: 'OWASP'
  ruleSetVersion: '3.2'
  requestBodyCheck: true
  maxRequestBodySizeInKb: 128
}

var appGWskuObj = union({
  name: appGWsku
  tier: appGWsku
}, appGWmaxCount == 0 ? {
  capacity: appGWcount
} : {})

// ugh, need to create a variable with the app gateway properies, because of the conditional key 'autoscaleConfiguration'
var appgwProperties = union({
  sku: appGWskuObj
  sslPolicy: {
    policyType: 'Predefined'
    policyName: 'AppGwSslPolicy20170401S'
  }
  webApplicationFirewallConfiguration: appGWenableWafFirewall ? appGwFirewallConfigOwasp : json('null')
  gatewayIPConfigurations: [
    {
      name: 'besubnet'
      properties: {
        subnet: {
          id: appGwSubnetId
        }
      }
    }
  ]
  frontendIPConfigurations: empty(privateIpApplicationGateway) ? array(frontendPublicIpConfig) : concat(array(frontendPublicIpConfig), array(frontendPrivateIpConfig))
  frontendPorts: [
    {
      name: 'appGatewayFrontendPort'
      properties: {
        port: 80
      }
    }
  ]
  backendAddressPools: [
    {
      name: 'defaultaddresspool'
    }
  ]
  backendHttpSettingsCollection: [
    {
      name: 'defaulthttpsetting'
      properties: {
        port: 80
        protocol: 'Http'
        cookieBasedAffinity: 'Disabled'
        requestTimeout: 30
        pickHostNameFromBackendAddress: true
      }
    }
  ]
  httpListeners: [
    {
      name: 'hlisten'
      properties: {
        frontendIPConfiguration: {
          id: empty(privateIpApplicationGateway) ? '${appgwResourceId}/frontendIPConfigurations/appGatewayFrontendIP' : '${appgwResourceId}/frontendIPConfigurations/appGatewayPrivateIP'
        }
        frontendPort: {
          id: '${appgwResourceId}/frontendPorts/appGatewayFrontendPort'
        }
        protocol: 'Http'
      }
    }
  ]
  requestRoutingRules: [
    {
      name: 'appGwRoutingRuleName'
      properties: {
        ruleType: 'Basic'
        httpListener: {
          id: '${appgwResourceId}/httpListeners/hlisten'
        }
        backendAddressPool: {
          id: '${appgwResourceId}/backendAddressPools/defaultaddresspool'
        }
        backendHttpSettings: {
          id: '${appgwResourceId}/backendHttpSettingsCollection/defaulthttpsetting'
        }
      }
    }
  ]
}, appGWmaxCount > 0 ? {
  autoscaleConfiguration: {
    minCapacity: appGWcount
    maxCapacity: appGWmaxCount
  }
} : {})

// 'identity' is always set until this is fixed: 
// https://github.com/Azure/bicep/issues/387#issuecomment-885671296
resource appgw 'Microsoft.Network/applicationGateways@2021-02-01' = if (deployAppGw) {
  name: appgwName
  location: location
  zones: !empty(availabilityZones) ? availabilityZones : []
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${appGwIdentity.id}': {}
    }
  }
  properties: appgwProperties
}

// DEPLOY_APPGW_ADDON This is a curcuit breaker to NOT deploy the appgw addon for BYO subnet, due to the error: IngressApplicationGateway addon cannot find Application Gateway
var DEPLOY_APPGW_ADDON = ingressApplicationGateway && empty(byoAGWSubnetId)
var contributor = resourceId('Microsoft.Authorization/roleDefinitions', 'b24988ac-6180-42a0-ab88-20f7382dd24c')
// https://docs.microsoft.com/en-us/azure/role-based-access-control/role-assignments-template#new-service-principal
// AGIC's identity requires "Contributor" permission over Application Gateway.
resource appGwAGICContrib 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = if (DEPLOY_APPGW_ADDON && deployAppGw) {
  scope: appgw
  name: guid(resourceGroup().id, appgwName, 'appgwcont')
  properties: {
    roleDefinitionId: contributor
    principalType: 'ServicePrincipal'
    principalId: aks.properties.addonProfiles.ingressApplicationGateway.identity.objectId
  }
}

// AGIC's identity requires "Reader" permission over Application Gateway's resource group.
var reader = resourceId('Microsoft.Authorization/roleDefinitions', 'acdd72a7-3385-48ef-bd42-f606fba81ae7')
resource appGwAGICRGReader 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = if (DEPLOY_APPGW_ADDON && deployAppGw) {
  scope: resourceGroup()
  name: guid(resourceGroup().id, appgwName, 'rgread')
  properties: {
    roleDefinitionId: reader
    principalType: 'ServicePrincipal'
    principalId: aks.properties.addonProfiles.ingressApplicationGateway.identity.objectId
  }
}

// AGIC's identity requires "Managed Identity Operator" permission over the user assigned identity of Application Gateway.
var managedIdentityOperator = resourceId('Microsoft.Authorization/roleDefinitions', 'f1a07417-d97a-45cb-824c-7a7467783830')
resource appGwAGICMIOp 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = if (DEPLOY_APPGW_ADDON && /* appgwKVIntegration && */ deployAppGw) {
  scope: appGwIdentity
  name: guid(resourceGroup().id, appgwName, 'apidentityoperator')
  properties: {
    roleDefinitionId: managedIdentityOperator
    principalType: 'ServicePrincipal'
    principalId: aks.properties.addonProfiles.ingressApplicationGateway.identity.objectId
  }
}

// ------------------------------------------------------------------ AppGW Diagnostics
var diagProperties = {
  workspaceId: workspaceId
  logs: [
    {
      category: 'ApplicationGatewayAccessLog'
      enabled: true
    }
    {
      category: 'ApplicationGatewayPerformanceLog'
      enabled: true
    }
    {
      category: 'ApplicationGatewayFirewallLog'
      enabled: true
    }
  ]
}
resource appgw_Diag 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = if (deployAppGw && !empty(workspaceId)) {
  scope: appgw
  name: 'appgwDiag'
  properties: diagProperties
}

// =================================================

// Prevent error: AGIC Identity needs atleast has 'Contributor' access to Application Gateway and 'Reader' access to Application Gateway's Resource Group

output ApplicationGatewayName string = deployAppGw ? appgw.name : ''

//---------------------------------------------------------------------------------- AKS
param dnsPrefix string = '${resourceName}-dns'
param kubernetesVersion string = '1.20.9'
param enable_aad bool = false
param aad_tenant_id string = ''
param omsagent bool = false

param enableAzureRBAC bool = false
param upgradeChannel string = ''
param osDiskType string = 'Ephemeral'
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

param AksPaidSkuForSLA bool = false

param podCidr string = '10.244.0.0/16'
param serviceCidr string = '10.0.0.0/16'
param dnsServiceIP string = '10.0.0.10'
param dockerBridgeCidr string = '172.17.0.1/16'

var autoScale = agentCountMax > agentCount

param createAksMetricAlerts bool = true



param JustUseSystemPool bool = false

@allowed([
  'Cost-Optimised'
  'Standard'
])
@description('The System Pool Preset sizing')
param SystemPoolType string = 'Cost-Optimised'

var systemPoolPresets = {
  'Cost-Optimised' : {
    vmSize: 'Standard_B4ms'
    count: 1
    minCount: 1
    maxCount: 3
    enableAutoScaling: true
    //osDiskType: 'Ephemeral' //default
  }
  'Standard' : {
    vmSize: 'Standard_D4s_v3'
    count: 2
    minCount: 2
    maxCount: 3
    enableAutoScaling: true
    //osDiskType: 'Ephemeral' //default
  }
}

var systemPoolBase = {
  name: 'npsystem'
  mode: 'System'
  osType: 'Linux'
  maxPods: 30
  type: 'VirtualMachineScaleSets'
  availabilityZones: !empty(availabilityZones) ? availabilityZones : null
  vnetSubnetID: !empty(aksSubnetId) ? aksSubnetId : json('null')
  upgradeSettings: {
    maxSurge: '33%'
  }
  nodeTaints: [
    JustUseSystemPool ? '' : 'CriticalAddonsOnly=true:NoSchedule'
  ]
}

var agentPoolProfileSystem = union(systemPoolBase, systemPoolPresets[SystemPoolType])

var agentPoolProfileUser = {
  name: 'npuser01'
  mode: 'User'
  osDiskType: osDiskType
  osDiskSizeGB: osDiskSizeGB
  count: agentCount
  vmSize: agentVMSize
  osType: 'Linux'
  maxPods: maxPods
  type: 'VirtualMachineScaleSets'
  enableAutoScaling: autoScale
  availabilityZones: !empty(availabilityZones) ? availabilityZones : null
  vnetSubnetID: !empty(aksSubnetId) ? aksSubnetId : json('null')
  minCount: autoScale ? agentCount : json('null')
  maxCount: autoScale ? agentCountMax : json('null')
  upgradeSettings: {
    maxSurge: '33%'
  }
}

var agentPoolProfiles = JustUseSystemPool ? array(agentPoolProfileSystem) : concat(array(agentPoolProfileSystem), array(agentPoolProfileUser))

var akssku = AksPaidSkuForSLA ? 'Paid' : 'Free'

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
    privateDNSZone: enablePrivateCluster ? 'none' : ''
    enablePrivateClusterPublicFQDN: enablePrivateCluster
  }
  agentPoolProfiles: agentPoolProfiles
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
var aks_addons1 = DEPLOY_APPGW_ADDON && ingressApplicationGateway ? union(aks_addons, deployAppGw ? {
  ingressApplicationGateway: {
    config: {
      applicationGatewayId: appgw.id
    }
    enabled: true
  }
} : {
  ingressApplicationGateway: {
    enabled: true
    config: {
      applicationGatewayName: appgwName
      subnetCIDR: appGatewaySubnetAddressPrefix
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

var aks_addons5 = azureKeyvaultSecretsProvider ? union(aks_addons4, {
  azureKeyvaultSecretsProvider: {
    config: {
      enableSecretRotation: 'false'
    }
    enabled: true
  }
}) : aks_addons4

var aks_properties2 = !empty(aks_addons5) ? union(aks_properties1, {
  addonProfiles: aks_addons5
}) : aks_properties1

var aks_identity = {
  type: 'UserAssigned'
  userAssignedIdentities: {
    '${uai.id}': {}
  }
}

resource aks 'Microsoft.ContainerService/managedClusters@2021-07-01' = {
  name: 'aks-${resourceName}'
  location: location
  properties: aks_properties2
  identity: aks_byo_identity ? aks_identity : {
    type: 'SystemAssigned'
  }
  sku: {
    name: 'Basic'
    tier: akssku
  }
}
output aksClusterName string = aks.name

// https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Kubernetes/Kubernetes_PSPBaselineStandard.json
var policySetPodSecBaseline = resourceId('Microsoft.Authorization/policySetDefinitions', 'a8640138-9b0a-4a28-b8cb-1666c838647d')
resource aks_policies 'Microsoft.Authorization/policyAssignments@2020-09-01' = if (!empty(azurepolicy)) {
  name: '${resourceName}-baseline'
  location: location
  properties: {
    //scope: resourceGroup().id
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
resource aks_admin_role_assignment 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = if (enableAzureRBAC && !empty(adminprincipleid)) {
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


module aksmetricalerts './aksmetricalerts.bicep' = {
  name: 'addAksNetContributor'
  scope: resourceGroup()
  params: {
    clusterName: aks.name
    logAnalyticsWorkspaceName: aks_law.name
    metricAlertsEnabled: createAksMetricAlerts
  }
}

//---------------------------------------------------------------------------------- Container Insights

@description('The log retention period')
param retentionInDays int = 30
var aks_law_name = 'log-${resourceName}'
resource aks_law 'Microsoft.OperationalInsights/workspaces@2021-06-01' = if (omsagent || deployAppGw || azureFirewalls) {
  name: aks_law_name
  location: location
  properties: {
    retentionInDays: retentionInDays
  }
}
output LogAnalyticsName string = (omsagent || deployAppGw || azureFirewalls) ? aks_law.name : ''
output LogAnalyticsGuid string = (omsagent || deployAppGw || azureFirewalls) ? aks_law.properties.customerId : ''
