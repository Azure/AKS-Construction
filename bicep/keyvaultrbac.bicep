param keyVaultName string

@description('An array of Service Principal IDs')
param rbacSecretUserSps array = []

@description('An array of Service Principal IDs')
param rbacSecretOfficerSps array = []

@description('An array of Service Principal IDs')
param rbacCertOfficerSps array = []

@description('An array of Service Principal IDs')
param rbacCryptoUserSps array = []

@description('An array of User IDs')
param rbacSecretOfficerUsers array = []

@description('An array of User IDs')
param rbacCertOfficerUsers array = []

var keyVaultSecretsUserRole = resourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')
var keyVaultSecretsOfficerRole = resourceId('Microsoft.Authorization/roleDefinitions', 'b86a8fe4-44ce-4948-aee5-eccb2c155cd7')
var keyVaultCertsOfficerRole = resourceId('Microsoft.Authorization/roleDefinitions', 'a4417e6f-fecd-4de8-b567-7b0420556985')
var keyVaultCryptoUserRole = resourceId('Microsoft.Authorization/roleDefinitions', '12338af0-0e69-4776-bea7-57ae8d297424')

resource kv 'Microsoft.KeyVault/vaults@2021-11-01-preview' existing = {
  name: keyVaultName
}

resource rbacSecretUserSp 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = [for rbacSp in rbacSecretUserSps : if(!empty(rbacSp)) {
  scope: kv
  name: guid(kv.id, rbacSp, keyVaultSecretsUserRole)
  properties: {
    roleDefinitionId: keyVaultSecretsUserRole
    principalType: 'ServicePrincipal'
    principalId: rbacSp
  }
}]

resource rbacSecretOfficerSp 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = [for rbacSp in rbacSecretOfficerSps : if(!empty(rbacSp)) {
  scope: kv
  name: guid(kv.id, rbacSp, keyVaultSecretsOfficerRole)
  properties: {
    roleDefinitionId: keyVaultSecretsOfficerRole
    principalType: 'ServicePrincipal'
    principalId: rbacSp
  }
}]

resource rbacCertsOfficerSp 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = [for rbacSp in rbacCertOfficerSps : if(!empty(rbacSp)) {
  scope: kv
  name: guid(kv.id, rbacSp, keyVaultCertsOfficerRole)
  properties: {
    roleDefinitionId: keyVaultCertsOfficerRole
    principalType: 'ServicePrincipal'
    principalId: rbacSp
  }
}]

resource rbacCryptoUserSp 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = [for rbacSp in rbacCryptoUserSps : if(!empty(rbacSp)) {
  scope: kv
  name: guid(kv.id, rbacSp, keyVaultCryptoUserRole)
  properties: {
    roleDefinitionId: keyVaultCryptoUserRole
    principalType: 'ServicePrincipal'
    principalId: rbacSp
  }
}]

resource rbacSecretOfficerUser 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = [for rbacSp in rbacSecretOfficerUsers : if(!empty(rbacSp)) {
  scope: kv
  name: guid(kv.id, rbacSp, keyVaultSecretsOfficerRole)
  properties: {
    roleDefinitionId: keyVaultSecretsOfficerRole
    principalType: 'User'
    principalId: rbacSp
  }
}]

resource rbacCertsOfficerUser 'Microsoft.Authorization/roleAssignments@2021-04-01-preview' = [for rbacSp in rbacCertOfficerUsers : if(!empty(rbacSp)) {
  scope: kv
  name: guid(kv.id, rbacSp, keyVaultCertsOfficerRole)
  properties: {
    roleDefinitionId: keyVaultCertsOfficerRole
    principalType: 'User'
    principalId: rbacSp
  }
}]
