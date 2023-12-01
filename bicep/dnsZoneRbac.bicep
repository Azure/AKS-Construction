//This module facilitates RBAC assigned to specific DNS Zones.
//The DNS Zone Id is extracted and the scope is set correctly.

@description('The full Azure resource ID of the DNS zone to use for the AKS cluster')
param dnsZoneId string

@description('The id of a virtual network to be linked to a PRIVATE DNS Zone')
param vnetId string

@description('The AAD identity to create the RBAC against')
param principalId string

param customTags object = {}

var dnsZoneIdSegments = split(dnsZoneId, '/')
var dnsZoneSubscriptionId = !empty(dnsZoneId) ? dnsZoneIdSegments[2] : ''
var dnsZoneRg = !empty(dnsZoneId) ? dnsZoneIdSegments[4] : ''
var dnsZoneName = !empty(dnsZoneId) ? dnsZoneIdSegments[8] : ''
var isDnsZonePrivate = !empty(dnsZoneId) ? dnsZoneIdSegments[7] == 'privateDnsZones' : false

module dnsZone './dnsZone.bicep' = if (!empty(dnsZoneId)) {
  name: take('${deployment().name}-dns-${dnsZoneName}', 64)
  scope: resourceGroup(dnsZoneSubscriptionId, dnsZoneRg)
  params: {
    dnsZoneName: dnsZoneName
    customTags: customTags
    isPrivate: isDnsZonePrivate
    vnetId: vnetId
    principalId: principalId
  }
}
