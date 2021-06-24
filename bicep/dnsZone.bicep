param dnsZoneName string
param principalId string

resource dns 'Microsoft.Network/dnsZones@2018-05-01' existing = {
  name: dnsZoneName
}

var DNSZoneContributor = resourceId('Microsoft.Authorization/roleDefinitions', 'befefa01-2a29-4197-83a8-272ff33ce314')

resource dns_zone_cont 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  scope: dns
  name: guid(resourceGroup().id, 'dnszone')
  properties: {
    roleDefinitionId: DNSZoneContributor
    principalType: 'ServicePrincipal'
    principalId: principalId
  }
}
