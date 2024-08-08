//Now that AKS has been created, we can ask our priveledged user to perform any remaining RBAC steps.

param aksName string
param acrName string

var AcrPullRole = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
var KubeletObjectId = any(aks.properties.identityProfile.kubeletidentity).objectId

resource aks 'Microsoft.ContainerService/managedClusters@2023-11-01' existing = {
  name: aksName
}

resource acr 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' existing = {
  name: acrName
}

@description('Assigns the permission for the AKS Kubelet identity to access container images')
resource aks_acr_pull 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: acr
  name: guid(aks.id, acr.id , AcrPullRole)
  properties: {
    roleDefinitionId: AcrPullRole
    principalType: 'ServicePrincipal'
    principalId: KubeletObjectId
  }
}
