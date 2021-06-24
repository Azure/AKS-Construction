param resourceName string
param location string
param appgw_subnet_id string

resource appgwpip 'Microsoft.Network/publicIPAddresses@2020-07-01' = {
  name: 'pip-agw-${resourceName}'
  location: location
  sku: {
    name: 'Standard'
  }
  properties: {
    publicIPAllocationMethod: 'Static'
  }
}

var appgwName = 'agw-${resourceName}'
var appgwResourceId = resourceId('Microsoft.Network/applicationGateways', '${appgwName}')

resource appgw 'Microsoft.Network/applicationGateways@2020-07-01' = {
  name: appgwName
  location: location
  properties: {
    sku: {
      name: 'WAF_v2'
      tier: 'WAF_v2'
      capacity: 1
    }
    gatewayIPConfigurations: [
      {
        name: 'besubnet'
        properties: {
          subnet: {
            id: appgw_subnet_id
          }
        }
      }
    ]
    frontendIPConfigurations: [
      {
        properties: {
          publicIPAddress: {
            id: '${appgwpip.id}'
          }
        }
        name: 'appGatewayFrontendIP'
      }
    ]
    frontendPorts: [
      {
        name: 'appGatewayFrontendPort'
        properties: {
          port: 80
        }
      }
    ]
    backendAddressPools: [
      {
        name: 'defaultaddresspool'
      }
    ]
    backendHttpSettingsCollection: [
      {
        name: 'defaulthttpsetting'
        properties: {
          port: 80
          protocol: 'Http'
          cookieBasedAffinity: 'Disabled'
          requestTimeout: 30
          pickHostNameFromBackendAddress: true
        }
      }
    ]
    httpListeners: [
      {
        name: 'hlisten'
        properties: {
          frontendIPConfiguration: {
            id: '${appgwResourceId}/frontendIPConfigurations/appGatewayFrontendIP'            
          }
          frontendPort: {
            id: '${appgwResourceId}/frontendPorts/appGatewayFrontendPort'
          }
          protocol: 'Http'
        }
      }
    ]
    requestRoutingRules: [
      {
        name: 'appGwRoutingRuleName'
        properties: {
          ruleType: 'Basic'
          httpListener: {
            id: '${appgwResourceId}/httpListeners/hlisten'
          }
          backendAddressPool: {
            id: '${appgwResourceId}/backendAddressPools/defaultaddresspool'
          }
          backendHttpSettings: {
            id: '${appgwResourceId}/backendHttpSettingsCollection/defaulthttpsetting'
          }
        }
      }
    ]
  }
}
