param resourceName string
param location string
param workspaceDiagsId string = ''
param fwSubnetId string
param vnetAksSubnetAddressPrefix string

var firewallPublicIpName = 'pip-afw-${resourceName}'
resource fw_pip 'Microsoft.Network/publicIPAddresses@2018-08-01' = {
  name: firewallPublicIpName
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    publicIPAllocationMethod: 'Static'
    publicIPAddressVersion: 'IPv4'
  }
}

resource fwDiags 'microsoft.insights/diagnosticSettings@2017-05-01-preview' = if (!empty(workspaceDiagsId)) {
  scope: fw
  name: 'fwDiags'
  properties: {
    workspaceId: workspaceDiagsId
    logs: [
      {
        category: 'AzureFirewallApplicationRule'
        enabled: true
        retentionPolicy: {
          days: 10
          enabled: false
        }
      }
      {
        category: 'AzureFirewallNetworkRule'
        enabled: true
        retentionPolicy: {
          days: 10
          enabled: false
        }
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
        retentionPolicy: {
          enabled: false
          days: 0
        }
      }
    ]
  }
}

var fw_name = 'afw-${resourceName}'
resource fw 'Microsoft.Network/azureFirewalls@2019-04-01' = {
  name: fw_name
  location: location
  properties: {
    ipConfigurations: [
      {
        name: 'IpConf1'
        properties: {
          subnet: {
            id: fwSubnetId
          }
          publicIPAddress: {
            id: fw_pip.id
          }
        }
      }
    ]
    threatIntelMode: 'Alert'
    applicationRuleCollections: [
      {
        name: 'clusterRc1'
        properties: {
          priority: 101
          action: {
            type: 'Allow'
          }
          rules: [
            {
              name: 'aks'
              protocols: [
                {
                  port: 443
                  protocolType: 'Https'
                }
                {
                  port: 80
                  protocolType: 'Http'
                }
              ]
              targetFqdns: []
              fqdnTags: [
                'AzureKubernetesService'
              ]
              sourceAddresses: [
                vnetAksSubnetAddressPrefix
              ]
            }
          ]
        }
      }
    ]
    networkRuleCollections: [
      {
        name: 'netRc1'
        properties: {
          priority: 100
          action: {
            type: 'Allow'
          }
          rules: [
            {
              name: 'ControlPlaneTCP'
              protocols: [
                'TCP'
              ]
              sourceAddresses: [
                vnetAksSubnetAddressPrefix
              ]
              destinationAddresses: [
                'AzureCloud.${location}'
              ]
              destinationPorts: [
                '9000' /* For tunneled secure communication between the nodes and the control plane. */
                '22'
              ]
            }
            {
              name: 'ControlPlaneUDP'
              protocols: [
                'UDP'
              ]
              sourceAddresses: [
                vnetAksSubnetAddressPrefix
              ]
              destinationAddresses: [
                'AzureCloud.${location}'
              ]
              destinationPorts: [
                '1194' /* For tunneled secure communication between the nodes and the control plane. */
              ]
            }
            {
              name: 'AzureMonitorForContainers'
              protocols: [
                'TCP'
              ]
              sourceAddresses: [
                vnetAksSubnetAddressPrefix
              ]
              destinationAddresses: [
                'AzureMonitor'
              ]
              destinationPorts: [
                '443'
              ]
            }
          ]
        }
      }
    ]
  }
}
