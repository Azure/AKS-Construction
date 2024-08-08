param principalId string
param aksName string

resource aks 'Microsoft.ContainerService/managedClusters@2023-07-02-preview' existing = {
  name: aksName
}

var aksContributor = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'b24988ac-6180-42a0-ab88-20f7382dd24c')
resource aksAutomation 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: aks
  name: guid(aks.id, principalId , aksContributor)
  properties: {
    roleDefinitionId: aksContributor
    principalType: 'ServicePrincipal'
    principalId: principalId
  }
}
