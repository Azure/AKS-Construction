param keyVaultName string

resource kv 'Microsoft.KeyVault/vaults@2022-07-01' existing = {
  name: keyVaultName
}

resource kvKmsKey 'Microsoft.KeyVault/vaults/keys@2022-07-01' = {
  name: 'kmskey'
  parent: kv
  properties: {
    kty: 'RSA'
    keySize: 2048
    keyOps: [
      'wrapKey'
      'unwrapKey'
      'decrypt'
      'encrypt'
      'verify'
      'sign'
    ]
  }
}

output keyVaultKmsKeyUri string =  kvKmsKey.properties.keyUriWithVersion
