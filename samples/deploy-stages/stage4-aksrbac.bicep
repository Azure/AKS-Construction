//Now that AKS has been created, we can ask our priveledged user to perform any remaining RBAC steps.

param aksName string
param aadGroupObjectId string = ''
param aadUserObjectId string = ''

var rbacClusterAdmin = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'b1ff04bb-8a4e-4dc4-8eb5-8693973ce19b')

resource aks 'Microsoft.ContainerService/managedClusters@2024-01-01' existing = {
  name: aksName
}

resource groupRbac 'Microsoft.Authorization/roleAssignments@2022-04-01' = if(!empty(aadGroupObjectId)) {
  scope: aks
  name: guid(aks.id, aadGroupObjectId , rbacClusterAdmin)
  properties: {
    roleDefinitionId: rbacClusterAdmin
    principalType: 'Group'
    principalId: aadGroupObjectId
  }
}

resource userRbac 'Microsoft.Authorization/roleAssignments@2022-04-01' = if(!empty(aadUserObjectId)) {
  scope: aks
  name: guid(aks.id, aadUserObjectId , rbacClusterAdmin)
  properties: {
    roleDefinitionId: rbacClusterAdmin
    principalType: 'User'
    principalId: aadUserObjectId
  }
}
