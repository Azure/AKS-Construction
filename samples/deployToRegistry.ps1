# Shows how to deploy the AKS Construction code to an Azure Container Registry
# Based on the 0.8.9 release of AKSC

$RG=yourResourceGroup
$ACRNAME=yourAcrName

# Get the ACR Endpoint
$ACRENDPOINT=az acr show -g $RG -n $ACRNAME --query loginServer -o tsv
echo $ACRENDPOINT

#Publish the AKS Bicep
az bicep publish -f ../bicep/main.bicep -t br:$ACRENDPOINT/bicep/modules/aksc:0.8.9
az bicep publish -f ../bicep/main.bicep -t br:$ACRENDPOINT/bicep/modules/aksc:latest