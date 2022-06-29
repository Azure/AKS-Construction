param dnsZoneName string
param principalId string
param isPrivate bool
param vnetId string = ''

param rbacAddDnsContributor bool = true
param rbacAddNetworkContributor bool = false

resource dns 'Microsoft.Network/dnsZones@2018-05-01' existing = if (!isPrivate) {
  name: dnsZoneName
}

resource privateDns 'Microsoft.Network/privateDnsZones@2020-06-01' existing = if (isPrivate) {
  name: dnsZoneName
}

var DNSZoneContributor = resourceId('Microsoft.Authorization/roleDefinitions', 'befefa01-2a29-4197-83a8-272ff33ce314')
resource dnsContributor 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = if (!isPrivate && rbacAddDnsContributor) {
  scope: dns
  name: guid(principalId, 'ZoneContributor', DNSZoneContributor)
  properties: {
    roleDefinitionId: DNSZoneContributor
    principalType: 'ServicePrincipal'
    principalId: principalId
  }
}

var PrivateDNSZoneContributor = resourceId('Microsoft.Authorization/roleDefinitions', 'b12aa53e-6015-4669-85d0-8515ebb3ae7f')
resource privateDnsContributor 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = if (isPrivate && rbacAddDnsContributor) {
  scope: privateDns
  name: guid(principalId, 'PrivateZoneContributor', PrivateDNSZoneContributor)
  properties: {
    roleDefinitionId: PrivateDNSZoneContributor
    principalType: 'ServicePrincipal'
    principalId: principalId
  }
}

var networkContributorRole = resourceId('Microsoft.Authorization/roleDefinitions', '4d97b98b-1d4f-4787-a291-c67834d212e7')
resource networkContributor 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = if (isPrivate && rbacAddNetworkContributor) {
  scope: privateDns
  name: guid(principalId, 'NetworkContributor', networkContributorRole)
  properties: {
    roleDefinitionId: networkContributorRole
    principalType: 'ServicePrincipal'
    principalId: principalId
  }
}

resource dns_vnet_link 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = if (isPrivate && !empty(vnetId)) {
  parent: privateDns
  name: 'privatedns'
  tags: {}
  location: 'global'
  properties: {
    virtualNetwork: {
      id: vnetId
    }
    registrationEnabled: false
  }
}
