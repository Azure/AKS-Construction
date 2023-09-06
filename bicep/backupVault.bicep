@description('Name of the Vault')
param vaultName string = 'BackupVault'

@description('Change Vault Storage Type (not allowed if the vault has registered backups)')
@allowed([
  'LocallyRedundant'
  'GeoRedundant'
])
param vaultStorageRedundancy string = 'LocallyRedundant'

@description('Location for all resources.')
param location string = resourceGroup().location

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

