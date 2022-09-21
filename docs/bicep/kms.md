# Key Management Service (KMS) Bicep Implementation

## Capability

KMS facilitates encryption at rest of the data in etcd

## Bicep schema

```bicep
  properties: {
    securityProfile: {
      azureKeyVaultKms: {
        enabled: bool
        keyId: 'string'
        keyVaultNetworkAccess: 'string'
        keyVaultResourceId: 'string'
      }
    }
  }
```

## AKS Configuration Scenarios

1. Public Key Vault
1. Private Key Vault

## AKS-C

### Scenarios

1. Create Key Vault, generate key, configure AKS
1. Use existing Key in Key Vault, which is public
1. Use existing Key in Key Vault, which uses private-link

### Unsupported Scenarios

Private link creates complexities for the services that leverage it, Network access to the resource needs to originate from a connected virtual network.
In the case of Key Vault, a network restriction limits the ability for the deploying user to generate the key.

### Bicep design

```bicep
var azureKeyVaultKms = {
  securityProfile : {
    azureKeyVaultKms : {
      enabled: keyVaultKmsCreateAndPrereqs || !empty(keyVaultKmsByoKeyId)
      keyId: keyVaultKmsCreateAndPrereqs ? kvKmsKey.outputs.keyVaultKmsKeyUri : !empty(keyVaultKmsByoKeyId) ? keyVaultKmsByoKeyId : ''
      keyVaultNetworkAccess: privateLinks ? 'private' : 'public'
      keyVaultResourceId:  privateLinks && !empty(keyVaultKmsByoKeyId) ? kvKmsByo.id : ''
    }
  }
}
```

## Deploying the Bicep code

### Creating a new Key Vault

### Using an existing Key Vault key

### Private Linked Key Vaults