param resourceName string
param location string
param appGwSubnetId string
param appgw_privateIpAddress string
param availabilityZones array
param userAssignedIdentity string
param workspaceId string
param appGWcount int
param appGWmaxCount int

var appgwName = 'agw-${resourceName}'
var appgwResourceId = resourceId('Microsoft.Network/applicationGateways', '${appgwName}')

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

var frontendPublicIpConfig = {
  properties: {
    publicIPAddress: {
      id: '${appgwpip.id}'
    }
  }
  name: 'appGatewayFrontendIP'
}

var frontendPrivateIpConfig = {
  properties: {
    privateIPAllocationMethod: 'Static'
    privateIPAddress: appgw_privateIpAddress
    subnet: {
      id: appGwSubnetId
    }
  }
  name: 'appGatewayPrivateIP'
}

var tier = 'WAF_v2'
var appGWsku = union({
  name: tier
  tier: tier
}, appGWmaxCount == 0 ? {
  capacity: appGWcount
} : {})

// ugh, need to create a variable with the app gateway properies, because of the conditional key 'autoscaleConfiguration'
var appgwProperties = union({
  sku: appGWsku
  gatewayIPConfigurations: [
    {
      name: 'besubnet'
      properties: {
        subnet: {
          id: appGwSubnetId
        }
      }
    }
  ]
  frontendIPConfigurations: empty(appgw_privateIpAddress) ? array(frontendPublicIpConfig) : concat(array(frontendPublicIpConfig), array(frontendPrivateIpConfig))
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
}, appGWmaxCount > 0 ? {
  autoscaleConfiguration: {
    minCapacity: appGWcount
    maxCapacity: appGWmaxCount
  }
} : {})

var appGwZones = !empty(availabilityZones) ? availabilityZones : []

// 'identity' is always set until this is fixed: 
// https://github.com/Azure/bicep/issues/387#issuecomment-885671296
resource appgw 'Microsoft.Network/applicationGateways@2020-07-01' = if (!empty(userAssignedIdentity)) {
  name: appgwName
  location: location
  zones: appGwZones
  identity: /*!empty(userAssignedIdentity) ?*/ {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentity}': {}
    }
  }
  properties: appgwProperties
}
output appgwId string = appgw.id
output ApplicationGatewayName string = appgw.name

// ------------------------------------------------------------------ AppGW Diagnostics
var diagProperties = {
  workspaceId: workspaceId
  logs: [
    {
      category: 'ApplicationGatewayAccessLog'
      enabled: true
    }
    {
      category: 'ApplicationGatewayPerformanceLog'
      enabled: true
    }
    {
      category: 'ApplicationGatewayFirewallLog'
      enabled: true
    }
  ]
}
resource appgw_Diag 'Microsoft.Insights/diagnosticSettings@2017-05-01-preview' = if (!empty(workspaceId)) {
  scope: appgw
  name: 'appgwDiag'
  properties: diagProperties
}
