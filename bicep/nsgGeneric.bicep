param resourceName string
param location string
param workspaceDiagsId string = ''

param nsgName string = 'nsg-${resourceName}'

resource nsg 'Microsoft.Network/networkSecurityGroups@2021-05-01' = {
  name: nsgName
  location: location
}
output nsgId string = nsg.id

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

output nsgSubnetObj object = {
  properties: {
    networkSecurityGroup: {
      id: nsg.id
    }
  }
}
