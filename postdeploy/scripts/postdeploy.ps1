# ---------------------------------------------------------------------------
# NOTE: This needs to be kept in sync with the postdeploy.sb (Bash) script
# ---------------------------------------------------------------------------
# POWERSHELL 7+ Required
# ---------------------------------------------------------------------------
[CmdletBinding()]
param(
    [ValidateSet('appgw','contour','nginx', 'traefik', ErrorMessage = "{0} is not in supported ingress options {1}")]
    [string]$ingress = $null,
    [ValidateSet('oss', ErrorMessage = "{0} is not in supported monitor options {1}")]
    [string]$monitor,
    $enableMonitorIngress,
    $grafanaHostname="grafana",
    [ValidateSet('true', 'false', ErrorMessage = "{0} is not in supported enableMonitorIngress option {1}")]
    [string]$ingressEveryNode = $null,
    $dnsZoneId,
    [ValidateSet('true', 'false', ErrorMessage = "{0} is not in supported denydefaultNetworkPolicy option {1}")]
    [string]$denydefaultNetworkPolicy = $null,
    $certEmail,
    [ValidateSet('letsencrypt-staging','letsencrypt-prod', ErrorMessage = "{0} is not in supported certClusterIssuer options {1}")]
    $certClusterIssuer="letsencrypt-prod",
    [ValidateSet('true', 'false', ErrorMessage = "{0} is not in supported containerLogsV2 option {1}")]
    $containerLogsV2="",
    $acrName,
    $KubeletId,
    $TenantId,
    $release_version=""
    )

$show_usage = $false
$dnsZoneId_domain = ""
if ($dnsZoneId)
{
    if ($dnsZoneId -match '^/subscriptions/([^/ ]+)/resourceGroups/([^/ ]+)/providers/Microsoft.Network/(dnszones|privateDnsZones)/([^/ ]+)$' )
    {
        $dnsZoneId_sub=$($matches[1])
        $dnsZoneId_rg=$($matches[2])
        $dnsZoneId_type=$($matches[3])
        $dnsZoneId_domain=$($matches[4])
    }
    else
    {
        Write-Output "dnsZoneId parameter needs to be a resourceId format for Azure DNS Zone"
        $show_usage = $true
    }
    if (($null -eq $KubeletId) -or ($null -eq $TenantId))
    {
        Write-Output "If supplying dnsZoneId for extneral-dns, need to also provide 'KubeletId' && 'TenantId'"
        $show_usage = $true
    }
}

if (($ingressEveryNode -ne $null) -and ($ingress -eq "appgw"))
{
    Write-Output "ingressEveryNode only supported if ingress paramter is (nginx|contour)"
    $show_usage = $true
}

if ($show_usage)
{
    Write-Output "args:"
    Write-Output "     -release_version=<url>  Url of release version or leave blank for local"
    Write-Output "     -ingress=<appgw|contour|nginx> - Enable cluster AutoScaler with max nodes"
    Write-Output "     -monitor=<oss> - Enable cluster AutoScaler with max nodes"
    Write-Output "     -enableMonitorIngress=<true> - Enable Ingress for prometheus"
    Write-Output "     -grafanaHostname=<true> - Specify a hostname for the grafana dashboard"
    Write-Output "     -ingressEveryNode=<true> - Enable cluster AutoScaler with max nodes"
    Write-Output "     -denydefaultNetworkPolicy=<true> - Deploy deny all network police"
    Write-Output "     -dnsZoneId=<Azure DNS Zone resourceId> - Enable cluster AutoScaler with max nodes"
    Write-Output "     -certEmail=<email for certman certificates> - Enables cert-manager"
    Write-Output "     -certClusterIssuer=<letsencrypt-staging|letsencrypt-prod> - Specifies cert-manager cluster issuer used by grafana"
    Write-Output "     -KubeletId=<managed identity of Kubelet> *Require for cert-manager"
    Write-Output "     -TenantId=<AzureAD TenentId> *Require for cert-manager"
    Write-Output "     -acrName=<name of ACR> * If provided, used imported images for 3rd party charts"
    Write-Output "     -containerLogsV2=<true> - Enables ContainerLogsV2"
    exit 1
}

#Get Dependencies.json file
if ($release_version)
{
    $json = Invoke-WebRequest -Uri "$release_version/dependencies.json" | ConvertFrom-Json
}
else {
    $json = ( Get-Content '.\helper\src\dependencies.json') | ConvertFrom-Json
}


$ingress_metrics_enabled = $false
if ($monitor -eq "oss")
{
    $ingress_metrics_enabled = $true
}

$ingressClass = $ingress
$legacyIngressClass = $ingress
# https://azure.github.io/application-gateway-kubernetes-ingress/ingress-v1/
if ($ingress -eq "appgw")
{
    $ingressClass = "azure-application-gateway"
    $legacyIngressClass = "azure/application-gateway"
}

$prometheus_namespace = "monitoring"
$prometheus_helm_release_name = "monitoring"

if ($monitor -eq "oss")
{
    Write-Output "# ------------------------------------------------"
    Write-Output "#              Install kube-prometheus-stack chart"
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    kubectl create namespace $prometheus_namespace --dry-run=client -o yaml | kubectl apply -f -
    helm upgrade --install $prometheus_helm_release_name prometheus-community/kube-prometheus-stack --namespace $prometheus_namespace `
        --set grafana.ingress.enabled=$enableMonitorIngress `
        --set grafana.ingress.annotations."cert-manager\.io/cluster-issuer"=$certClusterIssuer `
        --set grafana.ingress.annotations."ingress\.kubernetes\.io/force-ssl-redirect"=\"true\" `
        --set grafana.ingress.ingressClassName=$ingressClass `
        --set grafana.ingress.hosts[0]=grafana.$dnsZoneId_domain `
        --set grafana.ingress.tls[0].hosts[0]=grafana.$dnsZoneId_domain,grafana.ingress.tls[0].secretName=aks-grafana
}


if ($ingress -eq "nginx")
{
    $ingress_controller_kind="Deployment"
    $ingress_externalTrafficPolicy="Cluster"
    if ($ingressEveryNode)
    {
        $ingress_controller_kind="DaemonSet"
        $ingress_externalTrafficPolicy="Local"
    }
    $nginx_namespace = "ingress-basic"
    $nginx_helm_release_name = "nginx-ingress"

    Write-Output "# ------------------------------------------------"
    Write-Output "#                 Install Nginx Ingress Controller"
    kubectl create namespace $nginx_namespace --dry-run=client -o yaml | kubectl apply -f -
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm upgrade --install $nginx_helm_release_name ingress-nginx/ingress-nginx `
        --set controller.publishService.enabled=true `
        --set controller.kind=$ingress_controller_kind `
        --set controller.service.externalTrafficPolicy=$ingress_externalTrafficPolicy `
        --set controller.metrics.enabled=$ingress_metrics_enabled `
        --set controller.metrics.serviceMonitor.enabled=$ingress_metrics_enabled `
        --set controller.metrics.serviceMonitor.namespace=$prometheus_namespace `
        --set controller.metrics.serviceMonitor.additionalLabels.release=$prometheus_helm_release_name `
        --namespace $nginx_namespace
}

if ($ingress -eq "traefik")
{
    $ingress_controller_kind="Deployment"
    $ingress_externalTrafficPolicy="Cluster"
    if ($ingressEveryNode)
    {
        $ingress_controller_kind="DaemonSet"
        $ingress_externalTrafficPolicy="Local"
    }
    $traefik_namespace="ingress-basic"
    $traefik_helm_release_name="traefik"

    Write-Host "# ------------------------------------------------"
    Write-Host "#                 Install Traefik Ingress Controller"
    kubectl create namespace $traefik_namespace --dry-run=client -o yaml | kubectl apply -f -
    helm repo add traefik https://helm.traefik.io/traefik
    helm upgrade --install ${traefik_helm_release_name} traefik/traefik `
        --set deployment.kind="${ingress_controller_kind}" `
        --set service.spec.externalTrafficPolicy=$ingress_externalTrafficPolicy `
        --set providers.kubernetesIngress.publishedService.enabled=true `
        --set metrics.prometheus.enabled=true `
        --namespace $traefik_namespace
}

if ($ingress -eq "contour")
{
    $ingress_controller_kind="deployment"
    $ingress_externalTrafficPolicy="Cluster"
    if ($ingressEveryNode)
    {
        $ingress_controller_kind="daemonset"
        $ingress_externalTrafficPolicy="Local"
    }
    $contour_namespace = "ingress-basic"
    $contour_helm_release_name = "contour-ingress"

    Write-Output "# ------------------------------------------------"
    Write-Output "#               Install Contour Ingress Controller"
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm upgrade --install $contour_helm_release_name bitnami/contour --namespace $contour_namespace --create-namespace `
        --set envoy.kind=$ingress_controller_kind `
        --set contour.service.externalTrafficPolicy=$ingress_externalTrafficPolicy `
        --set metrics.serviceMonitor.enabled=$ingress_metrics_enabled `
        --set commonLabels."release"=$prometheus_helm_release_name `
        --set metrics.serviceMonitor.namespace=$prometheus_namespace
}


# External DNS
# external-dns needs permissions to make changes in the Azure DNS server.
# https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/azure.md#azure-managed-service-identity-msi
if ($dnsZoneId)
{
    Write-Output "# ------------------------------------------------"
    Write-Output "#                             Install external-dns"
    kubectl create secret generic aks-kube-msi --from-literal=azure.json="{
        userAssignedIdentityID: $KubeletId,
        tenantId: $TenantId,
        useManagedIdentityExtension: true,
        subscriptionId: ${dnsZoneId_sub},
        resourceGroup: ${dnsZoneId_rg}
    }" --dry-run=client -o yaml | kubectl apply -f -

    $provider = "azure"
    if ($dnsZoneId_type -eq "privateDnsZones")
    {
        $provider = "azure-private-dns"
    }
    $EXTERNAL_DNS_REPO = $json.externaldns.{1_9_0}.images.image.repository
    $dnsImageRepo = "$($json.externaldns.{1_9_0}.images.image.registry)/$EXTERNAL_DNS_REPO"

    if ($acrName)
    {
        $dnsImageRepo="$($acrName).azurecr.io/$($EXTERNAL_DNS_REPO)"
    }
    helm upgrade --install externaldns "https://$($json.externaldns.{1_9_0}.github_https_url)" `
    --set domainFilters={"${dnsZoneId_domain}"} `
    --set provider="${provider}" `
    --set extraVolumeMounts[0].name=aks-kube-msi,extraVolumeMounts[0].mountPath=/etc/kubernetes,extraVolumeMounts[0].readOnly=true `
    --set extraVolumes[0].name=aks-kube-msi,extraVolumes[0].secret.secretName=aks-kube-msi `
    --set image.repository=${dnsImageRepo} `
    --set image.tag=$($json.externaldns.{1_9_0}.images.image.tag)
}

if ($certEmail)
{
    Write-Output "# ------------------------------------------------"
    Write-Output "#                             Install cert-manager"

    kubectl apply -f "https://$($json.cert_manager.{1_8_2}.github_https_url)"
    Start-Sleep 30s # wait for cert-manager webhook to install

    helm upgrade --install letsencrypt-issuer "$($release_version -ne '' ? $release_version : ".")/postdeploy/helm/Az-CertManagerIssuer-0.3.0.tgz" `
        --set email=${certEmail}  `
        --set ingressClass=${legacyIngressClass}
}


if ($denydefaultNetworkPolicy)
{
    Write-Output "# ----------- Default Deny All Network Policy, east-west traffic in cluster"
    kubectl apply -f "$($release_version -ne '' ? $release_version : ".")/networkpolicy-deny-all.yml"
}


if ($containerLogsV2)
{
    Write-Output "Downloading default ConfigMap"
    $configMapYamlFile = (Invoke-WebRequest -Uri https://raw.githubusercontent.com/microsoft/Docker-Provider/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml).toString()
    Write-Output "Setting containerlog_schema_version to v2"
    $configMapYamlFile = $configMapYamlFile -replace '#\[log_collection_settings.schema\]', '[log_collection_settings.schema]'
    $configMapYamlFile = $configMapYamlFile -replace '# containerlog_schema_version = \"v2\"', 'containerlog_schema_version = "v2"'
    Write-Output "$configMapYamlFile" > container-azm-ms-agentconfig.yaml
    Write-Output "Applying ConfigMap using kubectl apply"
    kubectl apply -f container-azm-ms-agentconfig.yaml
}
