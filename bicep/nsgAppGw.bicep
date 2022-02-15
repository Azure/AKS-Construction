param resourceName string
param location string = resourceGroup().location
param workspaceDiagsId string = ''

var nsgName = 'nsg-agw-${resourceName}'

resource nsg 'Microsoft.Network/networkSecurityGroups@2021-05-01' = {
  name: nsgName
  location: location
}
output nsgId string = nsg.id

resource ruleAppGwManagement 'Microsoft.Network/networkSecurityGroups/securityRules@2020-11-01' = {
  parent: nsg
  name: 'Allow_AppGatewayManagement'
  properties: {
    protocol: '*'
    sourcePortRange: '*'
    destinationPortRange: '65200-65535'
    sourceAddressPrefix: 'GatewayManager'
    destinationAddressPrefix: '*'
    access: 'Allow'
    priority: 100
    direction: 'Inbound'
  }
}

resource ruleAzureLoadBalancer 'Microsoft.Network/networkSecurityGroups/securityRules@2020-11-01' = {
  parent: nsg
  name: 'Allow_AzureLoadBalancer'
  properties: {
    protocol: '*'
    sourcePortRange: '*'
    destinationPortRange: '*'
    sourceAddressPrefix: 'AzureLoadBalancer'
    destinationAddressPrefix: '*'
    access: 'Allow'
    priority: 110
    direction: 'Inbound'
    sourcePortRanges: []
    destinationPortRanges: []
    sourceAddressPrefixes: []
    destinationAddressPrefixes: []
  }
}

resource ruleDenyInternet 'Microsoft.Network/networkSecurityGroups/securityRules@2020-11-01' = {
  parent: nsg
  name: 'Deny_AllInboundInternet'
  properties: {
    description: 'Azure infrastructure communication'
    protocol: '*'
    sourcePortRange: '*'
    destinationPortRange: '*'
    sourceAddressPrefix: 'Internet'
    destinationAddressPrefix: '*'
    access: 'Deny'
    priority: 4096
    direction: 'Inbound'
    sourcePortRanges: []
    destinationPortRanges: []
    sourceAddressPrefixes: []
    destinationAddressPrefixes: []
  }
}

param allowInternetHttpIn bool = false
resource ruleInternetHttp 'Microsoft.Network/networkSecurityGroups/securityRules@2020-11-01' = if(allowInternetHttpIn) {
  parent: nsg
  name: 'Allow_Internet_Http'
  properties: {
    protocol: 'Tcp'
    sourcePortRange: '*'
    sourceAddressPrefix: 'Internet'
    destinationAddressPrefix: '*'
    access: 'Allow'
    priority: 200
    direction: 'Inbound'
    sourcePortRanges: []
    destinationPortRanges: [
      '80'
      '443'
    ]
    sourceAddressPrefixes: []
    destinationAddressPrefixes: []
  }
}

param NsgDiagnosticCategories array = [
  'NetworkSecurityGroupEvent'
  'NetworkSecurityGroupRuleCounter'
]

resource nsgDiags 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = if (!empty(workspaceDiagsId)) {
  name: 'diags-${nsgName}'
  scope: nsg
  properties: {
    workspaceId: workspaceDiagsId
    logs: [for diagCategory in NsgDiagnosticCategories: {
      category: diagCategory
      enabled: true
    }]
  }
}
