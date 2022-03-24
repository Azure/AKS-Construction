param name string
param location string = resourceGroup().location
param nsgId string
param storageId string

resource nsgFlowLogs 'Microsoft.Network/networkWatchers/flowLogs@2021-05-01' = {
  name: 'NetworkWatcher_${location}/${name}'
  location: location
  properties: {
    targetResourceId: nsgId
    storageId: storageId
    enabled: true
    retentionPolicy: {
      days: 2
      enabled: true
    }
    format: {
      type: 'JSON'
      version: 2
    }
  }
}
