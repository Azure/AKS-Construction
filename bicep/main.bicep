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
8. Monitoring / Log Analytics
*/


/*.__   __.  _______ .___________.____    __    ____  ______   .______       __  ___  __  .__   __.   _______ 
|  \ |  | |   ____||           |\   \  /  \  /   / /  __  \  |   _  \     |  |/  / |  | |  \ |  |  /  _____|
|   \|  | |  |__   `---|  |----` \   \/    \/   / |  |  |  | |  |_)  |    |  '  /  |  | |   \|  | |  |  __  
|  . `  | |   __|      |  |       \            /  |  |  |  | |      /     |    <   |  | |  . `  | |  | |_ | 
|  |\   | |  |____     |  |        \    /\    /   |  `--'  | |  |\  \----.|  .  \  |  | |  |\   | |  |__| | 
|__| \__| |_______|    |__|         \__/  \__/     \______/  | _| `._____||__|\__\ |__| |__| \__|  \______| */
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
  name: 'id-aks-${resourceName}'
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
param vnetAddressPrefix string = '10.240.0.0/16'
param vnetAksSubnetAddressPrefix string = '10.240.0.0/22'
param vnetAppGatewaySubnetAddressPrefix string = '10.240.4.0/26'
param acrAgentPoolSubnetAddressPrefix string = '10.240.4.64/26'

@description('The address range for Azure Bastion in your custom vnet')
param bastionSubnetAddressPrefix string = '10.240.4.128/26'
param privateLinkSubnetAddressPrefix string = '10.240.4.192/26'
param vnetFirewallSubnetAddressPrefix string = '10.240.50.0/24'

param privateLinks bool = false
param acrPrivatePool bool = false

@description('Deploy Azure Bastion to your vnet. (works with Custom Networking only, not BYO)')
param bastion bool = false

module network './network.bicep' = if (custom_vnet) {
  name: 'network'
  params: {
    resourceName: resourceName
    location: location
    vnetAddressPrefix: vnetAddressPrefix
    aksPrincipleId: aks_byo_identity ? uai.properties.principalId : ''
    vnetAksSubnetAddressPrefix: vnetAksSubnetAddressPrefix
    ingressApplicationGateway: ingressApplicationGateway
    vnetAppGatewaySubnetAddressPrefix: vnetAppGatewaySubnetAddressPrefix
    azureFirewalls: azureFirewalls
    vnetFirewallSubnetAddressPrefix: vnetFirewallSubnetAddressPrefix
    privateLinks: privateLinks
    privateLinkSubnetAddressPrefix: privateLinkSubnetAddressPrefix
    privateLinkAcrId: privateLinks && !empty(registries_sku) ? acr.id : ''
    privateLinkAkvId: privateLinks && createKV ? kv.id : ''
    acrPrivatePool: acrPrivatePool
    acrAgentPoolSubnetAddressPrefix: acrAgentPoolSubnetAddressPrefix
    bastion: bastion
    bastionSubnetAddressPrefix: bastionSubnetAddressPrefix
  }
}

var appGatewaySubnetAddressPrefix = !empty(byoAGWSubnetId) ? existingAGWSubnet.properties.addressPrefix : vnetAppGatewaySubnetAddressPrefix
var aksSubnetId = custom_vnet ? network.outputs.aksSubnetId : byoAKSSubnetId
var appGwSubnetId = ingressApplicationGateway ? (custom_vnet ? network.outputs.appGwSubnetId : byoAGWSubnetId) : ''




/*______  .__   __.      _______.    ________    ______   .__   __.  _______      _______.
|       \ |  \ |  |     /       |   |       /   /  __  \  |  \ |  | |   ____|    /       |
|  .--.  ||   \|  |    |   (----`   `---/  /   |  |  |  | |   \|  | |  |__      |   (----`
|  |  |  ||  . `  |     \   \          /  /    |  |  |  | |  . `  | |   __|      \   \    
|  '--'  ||  |\   | .----)   |        /  /----.|  `--'  | |  |\   | |  |____ .----)   |   
|_______/ |__| \__| |_______/        /________| \______/  |__| \__| |_______||_______/    */

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

/*__  __  _______ ____    ____    ____    ____  ___      __    __   __      .___________.
|  |/  / |   ____|\   \  /   /    \   \  /   / /   \    |  |  |  | |  |     |           |
|  '  /  |  |__    \   \/   /      \   \/   / /  ^  \   |  |  |  | |  |     `---|  |----`
|    <   |   __|    \_    _/        \      / /  /_\  \  |  |  |  | |  |         |  |     
|  .  \  |  |____     |  |           \    / /  _____  \ |  `--'  | |  `----.    |  |     
|__|\__\ |_______|    |__|            \__/ /__/     \__\ \______/  |_______|    |__|     */

@description('Installs the AKS KV CSI provider')
param azureKeyvaultSecretsProvider bool = false //This is a preview feature

@description('Creates a Key Vault')
param createKV bool = false

@description('If soft delete protection is enabled')
param KeyVaultSoftDelete bool = true

@description('If purge protection is enabled')
param KeyVaultPurgeProtection bool = true

@description('Add IP to firewall whitelist')
param kvIPWhitelist string = ''

var akvName = 'kv-${replace(resourceName, '-', '')}'

resource kv 'Microsoft.KeyVault/vaults@2021-06-01-preview' = if (createKV) {
  name: akvName
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    // publicNetworkAccess:  whether the vault will accept traffic from public internet. If set to 'disabled' all traffic except private endpoint traffic and that that originates from trusted services will be blocked.
    publicNetworkAccess: privateLinks && empty(kvIPWhitelist) ? 'disabled' : 'enabled' 
    
    networkAcls: privateLinks && !empty(kvIPWhitelist) ? {
      bypass: 'AzureServices' 
      defaultAction: 'Deny' 
      
      ipRules: empty(kvIPWhitelist) ? [] : [
          {
          value: kvIPWhitelist
        }
      ]
      virtualNetworkRules: []
    } : {}
    
    //enabledForTemplateDeployment: true
    enableRbacAuthorization: true
    enabledForDeployment: false
    enabledForDiskEncryption: false
    enabledForTemplateDeployment: false
    enableSoftDelete: KeyVaultSoftDelete 
    enablePurgeProtection: KeyVaultPurgeProtection ? true : json('null')
  }
}

var keyVaultSecretsUserRole = resourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')
resource kvAppGwSecretsUserRole 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = if (createKV && appgwKVIntegration) {
  scope: kv
  name: '${guid(aks.id, 'AppGw', keyVaultSecretsUserRole)}'
  properties: {
    roleDefinitionId: keyVaultSecretsUserRole
    principalType: 'ServicePrincipal'
    principalId: deployAppGw ? appGwIdentity.properties.principalId : ''
  }
}

resource kvCSIdriverSecretsUserRole 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = if (createKV && azureKeyvaultSecretsProvider) {
  scope: kv
  name: '${guid(aks.id, 'CSIDriver', keyVaultSecretsUserRole)}'
  properties: {
    roleDefinitionId: keyVaultSecretsUserRole
    principalType: 'ServicePrincipal'
    principalId: aks.properties.addonProfiles.azureKeyvaultSecretsProvider.identity.objectId
  }
}

param kvOfficerRolePrincipalId string = ''
var keyVaultSecretsOfficerRole = resourceId('Microsoft.Authorization/roleDefinitions', 'b86a8fe4-44ce-4948-aee5-eccb2c155cd7')
resource kvUserSecretOfficerRole 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = if (createKV && !empty(kvOfficerRolePrincipalId)) {
  scope: kv
  name: '${guid(aks.id, 'usersecret', keyVaultSecretsOfficerRole)}'
  properties: {
    roleDefinitionId: keyVaultSecretsOfficerRole
    principalType: 'User'
    principalId: kvOfficerRolePrincipalId
  }
}


var keyVaultCertsOfficerRole = resourceId('Microsoft.Authorization/roleDefinitions', 'a4417e6f-fecd-4de8-b567-7b0420556985')
resource kvUserCertsOfficerRole 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = if (createKV && !empty(kvOfficerRolePrincipalId)) {
  scope: kv
  name: '${guid(aks.id, 'usercert', keyVaultCertsOfficerRole)}'
  properties: {
    roleDefinitionId: keyVaultCertsOfficerRole
    principalType: 'User'
    principalId: kvOfficerRolePrincipalId
  }
}

output keyVaultName string = createKV ? kv.name : ''
output keyVaultId string = createKV ? kv.id : ''

resource kvDiags 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = if (createLaw && createKV) {
  name: 'kvDiags'
  scope: kv
  properties: {
    workspaceId:aks_law.id
    logs: [
      {
        category: 'AuditEvent'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}


/*   ___           ______     .______          
    /   \         /      |    |   _  \         
   /  ^  \       |  ,----'    |  |_)  |        
  /  /_\  \      |  |         |      /         
 /  _____  \   __|  `----. __ |  |\  \----. __ 
/__/     \__\ (__)\______|(__)| _| `._____|(__)*/
                                               
param registries_sku string = ''


var acrName = 'cr${replace(resourceName, '-', '')}${uniqueString(resourceGroup().id, resourceName)}'

resource acr 'Microsoft.ContainerRegistry/registries@2021-06-01-preview' = if (!empty(registries_sku)) {
  name: acrName
  location: location
  sku: {
    name: registries_sku
  }
  properties: {
    publicNetworkAccess: privateLinks /* && empty(acrIPWhitelist)*/ ? 'Disabled' : 'Enabled' 
    /*
    networkRuleSet: {
      defaultAction: 'Deny' 
      
      ipRules: empty(acrIPWhitelist) ? [] : [
          {
            action: 'Allow'
            value: acrIPWhitelist
        }
      ]
      virtualNetworkRules: []
    }
    */
  }
}
output containerRegistryName string = !empty(registries_sku) ? acr.name : ''

resource acrPool 'Microsoft.ContainerRegistry/registries/agentPools@2019-06-01-preview' = if (custom_vnet && (!empty(registries_sku)) && privateLinks && acrPrivatePool) {
  name: 'private-pool'
  location: location
  parent: acr
  properties: {
    count: 1
    os: 'Linux'
    tier: 'S1'
    virtualNetworkSubnetResourceId: custom_vnet ? network.outputs.acrPoolSubnetId : ''
  }
}


var AcrPullRole = resourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
var KubeletObjectId = any(aks.properties.identityProfile.kubeletidentity).objectId

resource aks_acr_pull 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = if (!empty(registries_sku)) {
  scope: acr // Use when specifying a scope that is different than the deployment scope
  name: '${guid(aks.id, 'Acr' , AcrPullRole)}'
  properties: {
    roleDefinitionId: AcrPullRole
    principalType: 'ServicePrincipal'
    principalId: KubeletObjectId
  }
}

var AcrPushRole = resourceId('Microsoft.Authorization/roleDefinitions', '8311e382-0749-4cb8-b61a-304f252e45ec')
param acrPushRolePrincipalId string = ''

resource aks_acr_push 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = if (!empty(registries_sku) && !empty(acrPushRolePrincipalId)) {
  scope: acr // Use when specifying a scope that is different than the deployment scope
  name: '${guid(aks.id, 'Acr' , AcrPushRole)}'
  properties: {
    roleDefinitionId: AcrPushRole
    principalType: 'User'
    principalId: acrPushRolePrincipalId
  }
}

/*______  __  .______       _______ ____    __    ____  ___       __       __      
|   ____||  | |   _  \     |   ____|\   \  /  \  /   / /   \     |  |     |  |     
|  |__   |  | |  |_)  |    |  |__    \   \/    \/   / /  ^  \    |  |     |  |     
|   __|  |  | |      /     |   __|    \            / /  /_\  \   |  |     |  |     
|  |     |  | |  |\  \----.|  |____    \    /\    / /  _____  \  |  `----.|  `----.
|__|     |__| | _| `._____||_______|    \__/  \__/ /__/     \__\ |_______||_______|*/

@description('Create an Azure Firewall')
param azureFirewalls bool = false
param certManagerFW bool = false

module firewall './firewall.bicep' = if (azureFirewalls && custom_vnet) {
  name: 'firewall'
  params: {
    resourceName: resourceName
    location: location
    workspaceDiagsId: createLaw ? aks_law.id : ''
    fwSubnetId: azureFirewalls && custom_vnet ? network.outputs.fwSubnetId : ''
    vnetAksSubnetAddressPrefix: vnetAksSubnetAddressPrefix
    certManagerFW: certManagerFW
    appDnsZoneName: dnsZoneName
    acrPrivatePool: acrPrivatePool
    acrAgentPoolSubnetAddressPrefix: acrAgentPoolSubnetAddressPrefix
  }
}

/*   ___      .______   .______          _______ ____    __    ____ 
    /   \     |   _  \  |   _  \        /  _____|\   \  /  \  /   / 
   /  ^  \    |  |_)  | |  |_)  |      |  |  __   \   \/    \/   /  
  /  /_\  \   |   ___/  |   ___/       |  | |_ |   \            /   
 /  _____  \  |  |      |  |     __    |  |__| |    \    /\    / __ 
/__/     \__\ | _|      | _|    (__)    \______|     \__/  \__/ (__)*/

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
resource appGwIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = if (deployAppGw) {
  name: 'id-appgw-${resourceName}'
  location: location
}

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

@allowed([
  'Prevention'
  'Detection'
])
param appGwFirewallMode string = 'Prevention'

var appGwFirewallConfigOwasp = {
  enabled: appGWenableWafFirewall
  firewallMode: appGwFirewallMode 
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

// 'identity' is always set until this is fixed: https://github.com/Azure/bicep/issues/387#issuecomment-885671296
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
  name: '${guid(aks.id, 'Agic', contributor)}'
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
  name: '${guid(aks.id, 'Agic', reader)}'
  properties: {
    roleDefinitionId: reader
    principalType: 'ServicePrincipal'
    principalId: aks.properties.addonProfiles.ingressApplicationGateway.identity.objectId
  }
}

// AGIC's identity requires "Managed Identity Operator" permission over the user assigned identity of Application Gateway.
var managedIdentityOperator = resourceId('Microsoft.Authorization/roleDefinitions', 'f1a07417-d97a-45cb-824c-7a7467783830')
resource appGwAGICMIOp 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = if (DEPLOY_APPGW_ADDON &&  deployAppGw) {
  scope: appGwIdentity
  name: '${guid(aks.id, 'Agic', managedIdentityOperator)}'
  properties: {
    roleDefinitionId: managedIdentityOperator
    principalType: 'ServicePrincipal'
    principalId: aks.properties.addonProfiles.ingressApplicationGateway.identity.objectId
  }
}

// AppGW Diagnostics
resource appgw_Diag 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = if (createLaw && deployAppGw) {
  scope: appgw
  name: 'appgwDiag'
  properties: {
    workspaceId: aks_law.id
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
}

// =================================================

// Prevent error: AGIC Identity needs atleast has 'Contributor' access to Application Gateway and 'Reader' access to Application Gateway's Resource Group

output ApplicationGatewayName string = deployAppGw ? appgw.name : ''

/*_  ___  __    __  .______    _______ .______      .__   __.  _______ .___________. _______      _______.
|  |/  / |  |  |  | |   _  \  |   ____||   _  \     |  \ |  | |   ____||           ||   ____|    /       |
|  '  /  |  |  |  | |  |_)  | |  |__   |  |_)  |    |   \|  | |  |__   `---|  |----`|  |__      |   (----`
|    <   |  |  |  | |   _  <  |   __|  |      /     |  . `  | |   __|      |  |     |   __|      \   \    
|  .  \  |  `--'  | |  |_)  | |  |____ |  |\  \----.|  |\   | |  |____     |  |     |  |____ .----)   |   
|__|\__\  \______/  |______/  |_______|| _| `._____||__| \__| |_______|    |__|     |_______||_______/ */

param dnsPrefix string = '${resourceName}-dns'
param kubernetesVersion string = '1.21.2'
param enable_aad bool = false
param aad_tenant_id string = ''

@description('Create, and use a new Log Analytics workspace for AKS logs')
param omsagent bool = false

param enableAzureRBAC bool = false
param upgradeChannel string = ''
param osDiskType string = 'Ephemeral'
param agentVMSize string = 'Standard_DS3_v2'
param osDiskSizeGB int = 0

param agentCount int = 3
param agentCountMax int = 0
var autoScale = agentCountMax > agentCount

param maxPods int = 30
param networkPlugin string = 'azure'
param networkPolicy string = ''
param azurepolicy string = ''
param gitops string = ''
param authorizedIPRanges array = []
param enablePrivateCluster bool = false
param availabilityZones array = []

param AksPaidSkuForSLA bool = false

param podCidr string = '10.240.100.0/24'
param serviceCidr string = '172.10.0.0/16'
param dnsServiceIP string = '172.10.0.10'
param dockerBridgeCidr string = '172.17.0.1/16'

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


var aks_addons2 = createLaw && omsagent ? union(aks_addons1, {
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
  name: '${guid(aks.id, 'aksadmin', buildInAKSRBACClusterAdmin)}'
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

/*__  ___.   ______   .__   __.  __  .___________.  ______   .______       __  .__   __.   _______ 
|   \/   |  /  __  \  |  \ |  | |  | |           | /  __  \  |   _  \     |  | |  \ |  |  /  _____|
|  \  /  | |  |  |  | |   \|  | |  | `---|  |----`|  |  |  | |  |_)  |    |  | |   \|  | |  |  __  
|  |\/|  | |  |  |  | |  . `  | |  |     |  |     |  |  |  | |      /     |  | |  . `  | |  | |_ | 
|  |  |  | |  `--'  | |  |\   | |  |     |  |     |  `--'  | |  |\  \----.|  | |  |\   | |  |__| | 
|__|  |__|  \______/  |__| \__| |__|     |__|      \______/  | _| `._____||__| |__| \__|  \______| */


@description('Diagnostic categories to log')
param AksDiagCategories array = [
  'cluster-autoscaler'
  'kube-controller-manager'
  'kube-audit-admin'
  'guard'
]

resource AksDiags 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' =  if (createLaw && omsagent)  {
  name: 'aksDiags'
  scope: aks
  properties: {
    workspaceId: aks_law.id
    logs: [for aksDiagCategory in AksDiagCategories: {
      category: aksDiagCategory
      enabled: true
    }]
  }
}

@description('Enable Metric Alerts')
param createAksMetricAlerts bool = true

@allowed([
  'Short'
  'Long'
])
@description('Which Metric polling frequency model to use')
param AksMetricAlertMetricFrequencyModel string = 'Long'

var AlertFrequencyLookup = {
  'Short': {
    evalFrequency: 'PT1M'
    windowSize: 'PT5M'
  }
  'Long': {
    evalFrequency: 'PT15M'
    windowSize: 'PT1H'
  }
}
var AlertFrequency = AlertFrequencyLookup[AksMetricAlertMetricFrequencyModel]

module aksmetricalerts './aksmetricalerts.bicep' = if (createLaw) {
  name: 'aksmetricalerts'
  scope: resourceGroup()
  params: {
    clusterName: aks.name
    logAnalyticsWorkspaceName: aks_law.name
    metricAlertsEnabled: createAksMetricAlerts
    evalFrequency: AlertFrequency.evalFrequency
    windowSize: AlertFrequency.windowSize
    alertSeverity: 'Informational'
  }
}

//---------------------------------------------------------------------------------- Container Insights

@description('The Log Analytics retention period')
param retentionInDays int = 30

var aks_law_name = 'log-${resourceName}'

var createLaw = (omsagent || deployAppGw || azureFirewalls) 

resource aks_law 'Microsoft.OperationalInsights/workspaces@2021-06-01' = if (createLaw) {
  name: aks_law_name
  location: location
  properties: {
    retentionInDays: retentionInDays
  }
}

//This role assignment enables AKS->LA Fast Alerting experience
var MonitoringMetricsPublisherRole = resourceId('Microsoft.Authorization/roleDefinitions', '3913510d-42f4-4e42-8a64-420c390055eb') 
resource FastAlertingRole_Aks_Law 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = if (omsagent) {
  scope: aks
  name: '${guid(aks.id, 'omsagent', MonitoringMetricsPublisherRole)}'
  properties: {
    roleDefinitionId: MonitoringMetricsPublisherRole
    principalId: aks.properties.addonProfiles.omsagent.identity.objectId
    principalType: 'ServicePrincipal'
  }
}


output LogAnalyticsName string = (createLaw) ? aks_law.name : ''
output LogAnalyticsGuid string = (createLaw) ? aks_law.properties.customerId : ''

//ACSCII Art link : https://textkool.com/en/ascii-art-generator?hl=default&vl=default&font=Star%20Wars&text=changeme
