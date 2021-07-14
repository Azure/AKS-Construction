// As per https://github.com/Azure/bicep/issues/2189#issuecomment-815962675 this file is being used as a UDF
param vnetFirewallSubnetAddressPrefix string

var subnetOctets  = split(vnetFirewallSubnetAddressPrefix,'.')
var hostIdOctet = '4'

output FirewallPrivateIp string = '${subnetOctets[0]}.${subnetOctets[1]}.${subnetOctets[2]}.${hostIdOctet}'
