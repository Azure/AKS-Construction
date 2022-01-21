#!/bin/bash
set -e

echo "Retrieving KubeletId for $AKSNAME in $RG"
KubeletId=$(az aks show -n $AKSNAME -g $RG --query "identityProfile.kubeletidentity.clientId" -o tsv)
TenantId=$(az account show --query tenantId -o tsv)
SubscriptionId=$(az account show --query id -o tsv)

JSONSECRETPATH="azure.json"
cat<<EOF>$JSONSECRETPATH
{
"userAssignedIdentityID": "$KubeletId",
"tenantId": "$TenantId",
"useManagedIdentityExtension": true,
"subscriptionId": "$SubscriptionId",
"resourceGroup": "$DNSRG"
}
EOF

cat azure.json

kubectl create secret generic azure-config-file --dry-run=client -o yaml --from-file=azure.json | kubectl apply -f -

echo "Installing ExternalDns for $DNSDOMAIN"
helm upgrade --install externaldns $EXTERNALDNSURI --set externaldns.domainfilter="$DNSDOMAIN"
