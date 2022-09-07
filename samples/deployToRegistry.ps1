# Shows how to deploy the AKS Construction code to an Azure Container Registry
# Based on the 0.8.9 release of AKSC

$ACRNAME=az acr show -g iac -n gobyers --query loginServer -o tsv
echo $ACRNAME

az bicep publish -f ../bicep/main.bicep -t br:$ACRNAME/bicep/modules/aksc:0.8.9
az bicep publish -f ../bicep/main.bicep -t br:$ACRNAME/bicep/modules/aksc:latest