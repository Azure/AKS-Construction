param resourceName string
param location string
param shortLocation string
param environment string
param workspaceDiagsId string = ''
param fwSubnetId string
param vnetAksSubnetAddressPrefix string
param certManagerFW bool = false
param acrPrivatePool bool = false
param acrAgentPoolSubnetAddressPrefix string = ''

var firewallPublicIpName = '${environment}-pip-${shortLocation}-${resourceName}-fw-01'
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

@description('Whitelist dnsZone name (required by cert-manager validation process)')
param appDnsZoneName string = ''

var fw_name = '${environment}-fw-${shortLocation}-${resourceName}-01'
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
          rules: concat([
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
            ], certManagerFW ? [
              {
                name: 'cetman-quay'
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
                targetFqdns: [
                  'quay.io'
                  '*.quay.io'
                ]
                sourceAddresses: [
                  vnetAksSubnetAddressPrefix
                ]
              }
              {
                name: 'cetman-letsencrypt'
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
                targetFqdns: [
                  'letsencrypt.org'
                  '*.letsencrypt.org'
                ]
                sourceAddresses: [
                  vnetAksSubnetAddressPrefix
                ]
              }
            ] : [], certManagerFW && !empty(appDnsZoneName) ? [
              {
                name: 'cetman-appDnsZoneName'
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
                targetFqdns: [
                  appDnsZoneName
                  '*.${appDnsZoneName}'
                ]
                sourceAddresses: [
                  vnetAksSubnetAddressPrefix
                ]
              }
            ] : [])
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
          rules: concat([
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
          ], acrPrivatePool ? [
            {
              name: 'acr-agentpool'
              protocols: [
                'TCP'
              ]
              sourceAddresses: [
                acrAgentPoolSubnetAddressPrefix
              ]
              destinationAddresses: [
                'AzureKeyVault'
                'Storage'
                'EventHub'
                'AzureActiveDirectory'
                'AzureMonitor'
              ]
              destinationPorts: [
                '443'
              ]
            }
          ]: [])
        }
      }
    ]
  }
}
