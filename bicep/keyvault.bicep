@minLength(2)
@description('The location to use for the deployment. defaults to Resource Groups location.')
param location string = resourceGroup().location

@minLength(3)
@maxLength(20)
@description('Used to name all resources')
param resourceName string

@description('Enable support for private links')
param privateLinks bool = false

@description('If soft delete protection is enabled')
param keyVaultSoftDelete bool = true

@description('If purge protection is enabled')
param keyVaultPurgeProtection bool = true

@description('Add IP to KV firewall allow-list')
param keyVaultIPAllowlist array = []

param logAnalyticsWorkspaceId string = ''

var akvName = take('kv-${replace(resourceName, '-', '')}${uniqueString(resourceGroup().id, resourceName)}',24)

var kvIPRules = [for kvIp in keyVaultIPAllowlist: {
  value: kvIp
}]

resource kv 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: akvName
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    // publicNetworkAccess:  whether the vault will accept traffic from public internet. If set to 'disabled' all traffic except private endpoint traffic and that that originates from trusted services will be blocked.
    publicNetworkAccess: privateLinks && empty(keyVaultIPAllowlist) ? 'disabled' : 'enabled'

    networkAcls: privateLinks && !empty(keyVaultIPAllowlist) ? {
      bypass: 'AzureServices'
      defaultAction: 'Deny'
      ipRules: kvIPRules
      virtualNetworkRules: []
    } : {}

    enableRbacAuthorization: true
    enabledForDeployment: false
    enabledForDiskEncryption: false
    enabledForTemplateDeployment: false
    enableSoftDelete: keyVaultSoftDelete
    enablePurgeProtection: keyVaultPurgeProtection ? true : null
  }
}

resource kvDiags 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = if (!empty(logAnalyticsWorkspaceId)) {
  name: 'kvDiags'
  scope: kv
  properties: {
    workspaceId: logAnalyticsWorkspaceId
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

output keyVaultName string = kv.name
output keyVaultId string = kv.id
