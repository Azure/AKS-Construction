# Login to Azure
$cloud = "AzureCloud"
$tenant_id = "ea685025-0437-4877-a8de-5b49cc4a6b5e" # TN Hot
$subscription_id = "3a3cbbd7-a180-45b8-816f-fb162e81d76b" # Visual Studio Enterprise Subscription – MPN

az cloud set --name $cloud
az login --tenant $tenant_id
az account set --subscription $subscription_id
az account list -o table --all --query "[].{TenantID: tenantId, Subscription: name, SubscriptionID: id, Default: isDefault}"

# Deploy bicep template
## Variables
$path_root = "C:\Users\Thanh.Ngo\OneDrive - Applied Information Sciences\Repos\AKS-Construction"
$template_file = "$path_root\bicep\main.bicep"
$param_file = "$path_root\.snc_demo\parameters.json"
$rg_name = "snc-demo-rg"
$loc = "EastUS2"

## Create resource group
az group create -l $loc -n $rg_name

## Deploy template
az deployment group create -g $rg_name  --template-file $template_file  --parameters @$param_file

# Delete resource group
az group delete -n $rg_name --yes
