@description('Name of the Vault')
param vaultName string = 'backupvault'

param resourceName string

@description('Change Vault Storage Type (not allowed if the vault has registered backups)')
@allowed([
  'LocallyRedundant'
  'GeoRedundant'
])
param vaultStorageRedundancy string = 'LocallyRedundant'

var saContributorRoleId = subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '17d1049b-9a84-46fb-8f53-869881c3d3ab')


@description('Location for all resources.')
param location string = resourceGroup().location

param managedNodeResourceGroup string

resource aks 'Microsoft.ContainerService/managedClusters@2023-03-02-preview' existing = {
  name: 'aks-${resourceName}'
}

resource aksBackupMI 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' existing = {
  name: 'extensionmanager-${aks.name}'
  scope: resourceGroup(managedNodeResourceGroup)
}


resource backupVault 'Microsoft.DataProtection/BackupVaults@2021-01-01' = {
  name: vaultName
  location: location
  identity: {
    type: 'systemAssigned'
  }
  properties: {
    storageSettings: [
      {
        datastoreType: 'VaultStore'
        type: vaultStorageRedundancy
      }
    ]
  }
}

resource backupPolicy 'Microsoft.DataProtection/backupVaults/backupPolicies@2021-01-01' = {
  parent: backupVault
  name: '${vaultName}-policy'
  properties: {
    objectType: 'BackupPolicy'
    datasourceTypes: [
      'Microsoft.ContainerService/managedClusters'
    ]
    policyRules: [
      {
        backupParameters: {
          backupType: 'Incremental'
          objectType: 'AzureBackupParams'
        }
        dataStore: {
          dataStoreType: 'OperationalStore'
          objectType: 'DataStoreInfoBase'
        }
        name: 'BackupHourly'
        objectType: 'AzureBackupRule'
        trigger: {
          objectType: 'ScheduleBasedTriggerContext'
          schedule: {
            repeatingTimeIntervals: [
              'R/2023-01-04T09:00:00+00:00/PT4H'
            ]
          }
          taggingCriteria: [
            {
              isDefault: true
              tagInfo: {
                id: 'Default_'
                tagName: 'Default'
              }
              taggingPriority: 99
            }
          ]
        }
      }
      {
        isDefault: true
        lifecycles: [
          {
            deleteAfter: {
              duration: 'P7D'
              objectType: 'AbsoluteDeleteOption'
            }
            sourceDataStore: {
              dataStoreType: 'OperationalStore'
              objectType: 'DataStoreInfoBase'
            }
          }
        ]
        name: 'Default'
        objectType: 'AzureRetentionRule'
      }
    ]
  }
}

resource sa 'Microsoft.Storage/storageAccounts@2022-05-01' = {
  name: '${vaultName}sa45345'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}

resource container 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-05-01' = {
  name: '${sa.name}/default/aksbackup'
}

resource aksBackupExtension 'Microsoft.KubernetesConfiguration/extensions@2022-11-01' = {
  name: 'azure-aks-backup'
  scope: aks
  properties: {
      extensionType: 'microsoft.dataprotection.kubernetes'
      autoUpgradeMinorVersion: true
      releaseTrain: 'Stable'
      configurationSettings: {
          'configuration.backupStorageLocation.bucket': 'aksbackup'
          'configuration.backupStorageLocation.config.storageAccount': 'backupvaultsa45345'
          'configuration.backupStorageLocation.config.resourceGroup': 'az-k8s-8taa-rg'
          'configuration.backupStorageLocation.config.subscriptionId': '8360e8bb-20fa-473f-8211-3c611ec9684f'
          'credentials.tenantId': '16b3c013-d300-468d-ac64-7eda0820b6d3'
      }
      // scope: {
      //   cluster: {
      //     releaseNamespace: 'default'
      //   }
      // }
      configurationProtectedSettings: {}
  }
  dependsOn: []
}

resource aksBackupSaContrib 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: sa
  name: guid(aks.id, 'aksbackup', saContributorRoleId)
  properties: {
    roleDefinitionId: saContributorRoleId
    principalId: '27258d61-78ca-41f4-a1ac-0aebb2d1f43a'
    principalType: 'ServicePrincipal'
  }
}

output saResourceId string = sa.id
output saName string = sa.name
