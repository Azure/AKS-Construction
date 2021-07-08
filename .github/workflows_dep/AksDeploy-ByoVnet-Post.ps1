RG="Automation-Actions-AksDeployCI"
AKSName="aks-AksByo"
AGName="agw-AksByo"

az aks enable-addons -n $AKSName -g $RG -a ingress-appgw --appgw-id $(az network application-gateway show -g $RG -n $AGName --query id -o tsv)