

[CmdletBinding()]
param(
    [ValidateSet('appgw','contour','nginx', ErrorMessage = "{0} is not in supported ingress options {1}")]
    [string]$ingress = $null,
    [ValidateSet('oss', ErrorMessage = "{0} is not in supported monitor options {1}")]
    [string]$monitor,
    $enableMonitorIngress,
    [ValidateSet('true', ErrorMessage = "{0} is not in supported enableMonitorIngress option {1}")]
    [string]$ingressEveryNode = $null,
    $dnsZoneId,
    [ValidateSet('true', ErrorMessage = "{0} is not in supported denydefaultNetworkPolicy option {1}")]
    [string]$denydefaultNetworkPolicy = $null,
    $certEmail,
    $acrName,
    $KubeletId,
    $TenantId,
    $release_version
    )

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
        echo "dnsZoneId paramter needs to be a resourceId format for Azure DNS Zone"
    }
    if (($KubeletId -eq $null) -or ($TenantId  -eq $null))
    {
        echo "If supplying dnsZoneId for extneral-dns, need to also provide 'KubeletId' && 'TenantId'"
    }
}

if (($ingressEveryNode -ne $null) -and ($ingress -eq "appgw"))
{
 echo "ingressEveryNode only supported if ingress paramter is (nginx|contour)"
}

$ingress_controller_kind = "deployment"
$ingress_externalTrafficPolicy = "Cluster"
if ($ingressEveryNode)
{
    $ingress_controller_kind = "daemonset"
    $ingress_externalTrafficPolicy = "Local"
}

$ingress_metrics_enabled = $false
if ($monitor -eq "oss")
{
    $ingress_metrics_enabled = $true
}

$ingressClass = $ingress
$legacyIngressClass = $ingress
if ($ingress -eq "appgw")
{
    $ingressClass = "azure-application-gateway"
    $legacyIngressClass = "azure/application-gateway"
}

$prometheus_namespace = "monitoring"
$prometheus_helm_release_name = "monitoring"

if ($monitor -eq "oss")
{
    echo "# ------------------------------------------------"
    echo "#              Install kube-prometheus-stack chart"
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    kubectl create namespace $prometheus_namespace --dry-run=client -o yaml | kubectl apply -f -
    helm upgrade --install $prometheus_helm_release_name prometheus-community/kube-prometheus-stack --namespace $prometheus_namespace `
        --set grafana.ingress.enabled=$enableMonitorIngress `
        --set grafana.ingress.annotations."cert-manager\.io/cluster-issuer"=letsencrypt-prod `
        --set grafana.ingress.annotations."ingress\.kubernetes\.io/force-ssl-redirect"=\"true\" `
        --set grafana.ingress.ingressClassName=$ingressClass `
        --set grafana.ingress.hosts[0]=grafana.$dnsZoneId_domain`
        --set grafana.ingress.tls[0].hosts[0]=grafana.$dnsZoneId_domain,grafana.ingress.tls[0].secretName=aks-grafana
}


if ($ingress -eq "nginx")
{
    $nginx_namespace = "ingress-basic"
    $nginx_helm_release_name = "nginx-ingress"

    echo "# ------------------------------------------------"
    echo "#                 Install Nginx Ingress Controller"
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


if ($ingress -eq "contour")
{
    $contour_namespace = "ingress-basic"
    $contour_helm_release_name = "contour-ingress"

    echo "# ------------------------------------------------"
    echo "#               Install Contour Ingress Controller"
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm upgrade --install $contour_helm_release_name bitnami/contour --namespace $contour_namespace --create-namespace `
        --set envoy.kind=$ingress_controller_kind `
        --set contour.service.externalTrafficPolicy=$ingress_externalTrafficPolicy `
        --set metrics.serviceMonitor.enabled=$ingress_metrics_enabled `
        --set commonLabels."release"=$prometheus_helm_release_name `
        --set metrics.serviceMonitor.namespace=$prometheus_namespace
}

$json = ( Get-Content '.\helper\src\dependencies.json') | ConvertFrom-Json
# External DNS
# external-dns needs permissions to make changes in the Azure DNS server.
# https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/azure.md#azure-managed-service-identity-msi
if ($dnsZoneId)
{

    echo "# ------------------------------------------------"
    echo "#                             Install external-dns"
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

$release_version_prefix = "."
if ($release_version)
{
    $release_version_prefix = $release_version
}


if ($certEmail)
{

    echo "# ------------------------------------------------"
    echo "#                             Install cert-manager"

    kubectl apply -f "https://$($json.cert_manager.{1_8_2}.github_https_url)"
    sleep 30s # wait for cert-manager webhook to install

    #TODO

    helm upgrade --install letsencrypt-issuer "$($release_version_prefix)/postdeploy/helm}/Az-CertManagerIssuer-0.3.0.tgz" `
        --set email=${certEmail}  `
        --set ingressClass=${legacyIngressClass}
}


if ($denydefaultNetworkPolicy)
{
    echo "# ----------- Default Deny All Network Policy, east-west traffic in cluster"
    #TODO
    kubectl apply -f "$($release_version_prefix)/networkpolicy-deny-all.yml"
}
