param acrName string
param aksName string
param aksResourceGroup string

//Create a reference to the existing ACR
resource acr 'Microsoft.ContainerRegistry/registries@2021-06-01-preview' existing = {
  name: acrName
}

//Create a reference to the existing AKS
resource aks 'Microsoft.ContainerService/managedClusters@2023-11-01' existing = {
  name: aksName
  scope: resourceGroup(aksResourceGroup)
}

//Create the RBAC
var AcrPullRole = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
var KubeletObjectId = any(aks.properties.identityProfile.kubeletidentity).objectId

resource aks_acr_pull 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: acr // Use when specifying a scope that is different than the deployment scope
  name: guid(aks.id, 'Acr' , AcrPullRole)
  properties: {
    roleDefinitionId: AcrPullRole
    principalType: 'ServicePrincipal'
    principalId: KubeletObjectId
  }
}
