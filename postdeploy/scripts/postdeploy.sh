#!/bin/bash

# Fail if any command fails
set -e

ingress=""
monitor=""
enableMonitorIngress="false"
grafanaHostname="grafana"
ingressEveryNode=""
dnsZoneId=""
denydefaultNetworkPolicy=""
certEmail=""
certClusterIssuer="letsencrypt-prod"
containerLogsV2=""

acrName=""
KubeletId=""
TenantId=""

release_version=""

while getopts "p:g:n:r:" opt; do
  case ${opt} in
    p )
        IFS=',' read -ra params <<< "$OPTARG"
        for i in "${params[@]}"; do
            if [[ $i =~ (ingress|monitor|enableMonitorIngress|grafanaHostname|ingressEveryNode|dnsZoneId|denydefaultNetworkPolicy|certEmail|certClusterIssuer|acrName|KubeletId|TenantId|containerLogsV2)=([^ ]*) ]]; then
                echo "set ${BASH_REMATCH[1]}=${BASH_REMATCH[2]}"
                declare ${BASH_REMATCH[1]}=${BASH_REMATCH[2]}
            else
                echo "Unknown parameter $i"
                show_usage=true
                break
            fi
        done
      ;;
    r )
     release_version=$OPTARG
     ;;
    \? )
      echo "Unknown arg"
      show_usage=true

      ;;
  esac
done

dnsZoneId_domain=""
if [ "$dnsZoneId" ]; then
    if [[ $dnsZoneId =~ ^/subscriptions/([^/ ]+)/resourceGroups/([^/ ]+)/providers/Microsoft.Network/(dnszones|privateDnsZones)/([^/ ]+)$ ]]; then
        dnsZoneId_sub=${BASH_REMATCH[1]}
        dnsZoneId_rg=${BASH_REMATCH[2]}
        dnsZoneId_type=${BASH_REMATCH[3]}
        dnsZoneId_domain=${BASH_REMATCH[4]}
    else
        echo "dnsZoneId parameter needs to be a resourceId format for Azure DNS Zone"
        show_usage=true
    fi

    if [ -z "$KubeletId" ] || [ -z "$TenantId" ]; then
        echo "If supplying dnsZoneId for extneral-dns, need to also provide 'KubeletId' && 'TenantId'"
        show_usage=true
    fi

fi

if [ "$ingressEveryNode" ] && [[ ! $ingressEveryNode = "true" ]]; then
 echo "supported ingressEveryNode parameter values (true)"
 show_usage=true
fi

if [ "$denydefaultNetworkPolicy" ] && [[ ! $denydefaultNetworkPolicy = "true" ]]; then
 echo "supported denydefaultNetworkPolicy parameter values (true)"
 show_usage=true
fi

if [ "$ingress" ] && [[ ! $ingress =~ (appgw|contour|nginx|traefik) ]]; then
 echo "supported ingress parameter values (appgw|contour|nginx|traefik)"
 show_usage=true
fi

if [ "$ingressEveryNode" ] && [[ $ingress = "appgw" ]]; then
 echo "ingressEveryNode only supported if ingress parameter is (nginx|contour|traefik)"
 show_usage=true
fi

if [  "$monitor" ] && [[ ! "$monitor" = "oss" ]]; then
 echo "supported monitor parameter values are (oss)"
 show_usage=true
fi

if [  "$certClusterIssuer" ] && [[ ! $certClusterIssuer =~ (letsencrypt-staging|letsencrypt-prod) ]]; then
 echo "supported cluster issuer parameter values are (letsencrypt-staging|letsencrypt-prod)"
 show_usage=true
fi

if [ "$show_usage" ]; then
    echo "Usage: $0"
    echo "args:"
    echo " < -r release download url>  the github release download url where the dependent files will be referenced"
    echo " [ -p: parameters] : Can provide one or multiple features:"
    echo "     ingress=<appgw|contour|nginx> - Enable cluster AutoScaler with max nodes"
    echo "     monitor=<oss> - Enable cluster AutoScaler with max nodes"
    echo "     enableMonitorIngress=<true> - Enable Ingress for prometheus"
    echo "     grafanaHostname=<true> - Specify a hostname for the grafana dashboard"
    echo "     ingressEveryNode=<true> - Enable cluster AutoScaler with max nodes"
    echo "     denydefaultNetworkPolicy=<true> - Deploy deny all network police"
    echo "     dnsZoneId=<Azure DNS Zone resourceId> - Enable cluster AutoScaler with max nodes"
    echo "     certEmail=<email for certman certificates> - Enables cert-manager"
    echo "     certClusterIssuer=<letsencrypt-staging|letsencrypt-prod> - Specifies cert-manager cluster issuer used by grafana"
    echo "     KubeletId=<managed identity of Kubelet> *Require for cert-manager"
    echo "     TenantId=<AzureAD TenentId> *Require for cert-manager"
    echo "     acrName=<name of ACR> * If provided, used imported images for 3rd party charts"
    echo "     containerLogsV2=<true> - Enables ContainerLogsV2"
    exit 1
fi

#  Uses dependencies.json as a config file to retrieve Helm Chart version details
get_image_property () {

    fileloc=${release_version:-./helper/src}/dependencies.json

    if [ "$release_version" ] && [[ $release_version == http* ]]; then
      dependenciesJson=$(curl -sL $fileloc)
    else
      dependenciesJson=$(cat $fileloc)
    fi

    arrKey=(${1//./ })
    nk=false
    n=-1
    l=()
    while IFS="[: ,]+" read -ra tokens; do
        for i in "${tokens[@]}"; do
            if [ "$i" = "{" ]; then
            ((n+=1))
            nk=true
            elif  [ "$i" = "}" ]; then
            ((n-=1))
            else
            if $nk; then
                #echo "testing: new key $n - $i"
                l[$n]=$(echo $i | tr -d '"')
                nk=false
            else
                print=true
                #echo "testing:  n=$n"
                for o in $(seq 0 $n); do
                    #echo "testing:  ${l[$o]} = ${arrKey[$o]}"
                    if [[ ! ${l[$o]} = ${arrKey[$o]} ]]; then
                    print=false
                    break
                    fi
                done
                if $print; then
                echo -n $i | tr -d '"'
                fi
                nk=true
            fi
            fi
        done
    done <<<$dependenciesJson

}

#  AWK Not on Invote Command. Use the dependencies file to get the helmchart image details
get_image_property_awk () {

    fileloc=${release_version:-./helper/src}/dependencies.json

    if [ "$release_version" ] && [[ $release_version == http* ]]; then
      dependenciesJson=$(curl -sL $fileloc)
    else
      dependenciesJson=$(cat $fileloc)
    fi

    echo $dependenciesJson | awk -v key=$1 'BEGIN { FS="[: \t\n,]+";  RS="[ \t\n]+:[ \t\n]+"; nk=0; n=0; split(key,ka,".")} {
        for(i=1;i<=NF;i++) {
            if ($i ~ /[{\[]/ ) {
                n++; if ($1 == "{") nk=1; else nk=0
            } else if ($i ~ /[}\]]/) { n-- } else {
                gsub(/"/, "", $i)
                if (nk) { l[n] = $i; nk=0
                } else {
                    p=1; for (o=0;o<=n;o++) if (l[o]!=ka[o]) p=0
                    if (p) printf("%s", $i)
                    nk=1
                }
            }
        }
    }' -
}


## KH - Check this workaround is still needed with the latest AGIC - MAYBE NOT!

#if [ "$vnet_opt" = "byo" ] && [ "$ingress" = "appgw" ]; then
#    echo "# ------------------------------------------------"
#    echo "#          Workaround to enable AGIC with BYO VNET"
#    APPGW_RG_ID="$(az group show -n ${rg} --query id -o tsv)"
#    APPGW_ID="$(az network application-gateway show -g ${rg} -n ${agw} --query id -o tsv)"
#    az aks enable-addons -n ${aks} -g ${rg} -a ingress-appgw --appgw-id $APPGW_ID

#    AKS_AGIC_IDENTITY_ID="$(az aks show -g ${rg} -n ${aks} --query addonProfiles.ingressApplicationGateway.identity.objectId -o tsv)"
#    az role assignment create --role "Contributor" --assignee-principal-type ServicePrincipal --assignee-object-id $AKS_AGIC_IDENTITY_ID --scope $APPGW_ID
#    az role assignment create --role "Reader" --assignee-principal-type ServicePrincipal --assignee-object-id $AKS_AGIC_IDENTITY_ID --scope $APPGW_RG_ID

    #  additionally required if appgwKVIntegration (app gateway has assigned identity)
#    if true; then

#        APPGW_IDENTITY="$(az network application-gateway show -g ${rg} -n ${agw} --query 'keys(identity.userAssignedIdentities)[0]' -o tsv)"
#        az role assignment create --role "Managed Identity Operator" --assignee-principal-type ServicePrincipal --assignee-object-id $AKS_AGIC_IDENTITY_ID --scope $APPGW_IDENTITY
#    fi
#fi

## KH - Moved to Bicep!! YAY
#
#if [ "$dnsZoneId"  ] && [ "$ingress" ]; then

#    KubeletId=$(az aks show -g ${rg} -n ${aks} --query identityProfile.kubeletidentity.clientId -o tsv)
#    TenantId=$(az account show --query tenantId -o tsv)

#        if [ "$apisecurity" = "private" ]; then
#            # Import external-dns Image to ACR
#            export acrName=$(az acr list -g ${rg} --query [0].name -o tsv)
#            az acr import -n $acrName --source ${EXTERNAL_DNS_REGISTRY}/${EXTERNAL_DNS_REPO}:${EXTERNAL_DNS_TAG} --image ${EXTERNAL_DNS_REPO}:${EXTERNAL_DNS_TAG}
#        fi
#fi

# ingress_controller_kind="Deployment"
# ingress_externalTrafficPolicy="Cluster"
# if [ "$ingressEveryNode" ]; then
#     ingress_controller_kind="DaemonSet"
#     ingress_externalTrafficPolicy="Local"
# fi
ingress_metrics_enabled=false
if [ "$monitor" = "oss" ]; then
    ingress_metrics_enabled=true
fi

ingressClass=$ingress
legacyIngressClass=$ingress
# https://azure.github.io/application-gateway-kubernetes-ingress/ingress-v1/
if [ "$ingress" = "appgw" ]; then
    ingressClass="azure-application-gateway"
    legacyIngressClass="azure/application-gateway"
fi

prometheus_namespace="monitoring"
prometheus_helm_release_name="monitoring"

if [ "$monitor" = "oss" ]; then
    echo "# ------------------------------------------------"
    echo "#              Install kube-prometheus-stack chart"
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    kubectl create namespace ${prometheus_namespace} --dry-run=client -o yaml | kubectl apply -f -
    helm upgrade --install ${prometheus_helm_release_name} prometheus-community/kube-prometheus-stack --namespace ${prometheus_namespace} \
        --set grafana.ingress.enabled=${enableMonitorIngress} \
        --set grafana.ingress.annotations."cert-manager\.io/cluster-issuer"=$certClusterIssuer \
        --set grafana.ingress.annotations."ingress\.kubernetes\.io/force-ssl-redirect"=\"true\" \
        --set grafana.ingress.ingressClassName=${ingressClass} \
        --set grafana.ingress.hosts[0]=${grafanaHostname}.${dnsZoneId_domain} \
        --set grafana.ingress.tls[0].hosts[0]=${grafanaHostname}.${dnsZoneId_domain},grafana.ingress.tls[0].secretName=aks-grafana
fi


if [ "$ingress" = "nginx" ]; then

    ingress_controller_kind="Deployment"
    ingress_externalTrafficPolicy="Cluster"
    if [ "$ingressEveryNode" ]; then
    ingress_controller_kind="DaemonSet"
    ingress_externalTrafficPolicy="Local"
    fi
    nginx_namespace="ingress-basic"
    nginx_helm_release_name="nginx-ingress"

    echo "# ------------------------------------------------"
    echo "#                 Install Nginx Ingress Controller"
    kubectl create namespace ${nginx_namespace} --dry-run=client -o yaml | kubectl apply -f -
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm upgrade --install ${nginx_helm_release_name} ingress-nginx/ingress-nginx \
        --set controller.publishService.enabled=true \
        --set controller.kind=${ingress_controller_kind} \
        --set controller.service.externalTrafficPolicy=${ingress_externalTrafficPolicy} \
        --set controller.metrics.enabled=${ingress_metrics_enabled} \
        --set controller.metrics.serviceMonitor.enabled=${ingress_metrics_enabled} \
        --set controller.metrics.serviceMonitor.namespace=${prometheus_namespace} \
        --set controller.metrics.serviceMonitor.additionalLabels.release=${prometheus_helm_release_name} \
        --namespace ${nginx_namespace}
fi

if [ "$ingress" = "traefik" ]; then

    ingress_controller_kind="Deployment"
    ingress_externalTrafficPolicy="Cluster"
    if [ "$ingressEveryNode" ]; then
    ingress_controller_kind="DaemonSet"
    ingress_externalTrafficPolicy="Local"
    fi

    traefik_namespace="ingress-basic"
    traefik_helm_release_name="traefik"

    echo "# ------------------------------------------------"
    echo "#                 Install Traefik Ingress Controller"
    kubectl create namespace ${traefik_namespace} --dry-run=client -o yaml | kubectl apply -f -
    helm repo add traefik https://helm.traefik.io/traefik
    helm upgrade --install ${traefik_helm_release_name} traefik/traefik \
        --set deployment.kind="${ingress_controller_kind}" \
        --set service.spec.externalTrafficPolicy=${ingress_externalTrafficPolicy} \
        --set providers.kubernetesIngress.publishedService.enabled=true \
        --set metrics.prometheus.enabled=true \
        --namespace ${traefik_namespace}
fi


if [ "$ingress" = "contour" ]; then

    ingress_controller_kind="deployment"
    ingress_externalTrafficPolicy="Cluster"
    if [ "$ingressEveryNode" ]; then
    ingress_controller_kind="daemonset"
    ingress_externalTrafficPolicy="Local"
    fi

    contour_namespace="ingress-basic"
    contour_helm_release_name="contour-ingress"
    # https://artifacthub.io/packages/helm/bitnami/contour
    echo "# ------------------------------------------------"
    echo "#               Install Contour Ingress Controller"
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm upgrade --install ${contour_helm_release_name} bitnami/contour --namespace ${contour_namespace} --create-namespace \
        --set envoy.kind=${ingress_controller_kind} \
        --set contour.service.externalTrafficPolicy=${ingress_externalTrafficPolicy} \
        --set metrics.serviceMonitor.enabled=${ingress_metrics_enabled} \
        --set commonLabels."release"=${prometheus_helm_release_name} \
        --set metrics.serviceMonitor.namespace=${prometheus_namespace}
fi


# External DNS
# external-dns needs permissions to make changes in the Azure DNS server.
# https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/azure.md#azure-managed-service-identity-msi
if [ "$dnsZoneId" ]; then

    echo "# ------------------------------------------------"
    echo "#                             Install external-dns"
    kubectl create secret generic aks-kube-msi --from-literal=azure.json="{
        userAssignedIdentityID: $KubeletId,
        tenantId: $TenantId,
        useManagedIdentityExtension: true,
        subscriptionId: ${dnsZoneId_sub},
        resourceGroup: ${dnsZoneId_rg}
    }" --dry-run=client -o yaml | kubectl apply -f -

    provider="azure"
    if [ "$dnsZoneId_type" = "privateDnsZones" ]; then
        provider="azure-private-dns"
    fi

    EXTERNAL_DNS_REPO=$(get_image_property "externaldns.1_9_0.images.image.repository")
    dnsImageRepo="$(get_image_property "externaldns.1_9_0.images.image.registry")/${EXTERNAL_DNS_REPO}"
    if [ "$acrName" ]; then
        dnsImageRepo="${acrName}.azurecr.io/${EXTERNAL_DNS_REPO}"
    fi

    helm upgrade --install externaldns "https://$(get_image_property "externaldns.1_9_0.github_https_url")" \
    --set domainFilters={"${dnsZoneId_domain}"} \
    --set provider="${provider}" \
    --set extraVolumeMounts[0].name=aks-kube-msi,extraVolumeMounts[0].mountPath=/etc/kubernetes,extraVolumeMounts[0].readOnly=true \
    --set extraVolumes[0].name=aks-kube-msi,extraVolumes[0].secret.secretName=aks-kube-msi \
    --set image.repository=${dnsImageRepo} \
    --set image.tag=$(get_image_property "externaldns.1_9_0.images.image.tag")
fi


if [ "$certEmail" ]; then

    echo "# ------------------------------------------------"
    echo "#                             Install cert-manager"

    #certMan_Version="v1.8.2"
    # NOT Needed anymore!
    #if [ "$ingress" = "appgw" ]; then
    #    echo "Downgrading cert-manager for AppGateway IC"
    #    certMan_Version="v1.5.3"
    #fi


    kubectl apply -f "https://$(get_image_property "cert_manager.1_8_2.github_https_url")"
    sleep 30s # wait for cert-manager webhook to install

    helm upgrade --install letsencrypt-issuer ${release_version:-./postdeploy/helm}/Az-CertManagerIssuer-0.3.0.tgz \
        --set email=${certEmail}  \
        --set ingressClass=${legacyIngressClass}
fi


if [ "$denydefaultNetworkPolicy" ]; then
    echo "# ----------- Default Deny All Network Policy, east-west traffic in cluster"
    kubectl apply -f ${release_version:-./postdeploy/k8smanifests}/networkpolicy-deny-all.yml
fi

if [ "$containerLogsV2" ]; then
    replace="\# containerlog_schema_version = \"v2\""
    replaceWith='containerlog_schema_version = "v2"'
    echo "Downloading default ConfigMap"
    $configMapYamlFile="$(curl https://raw.githubusercontent.com/microsoft/Docker-Provider/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml)"
    echo "Setting containerlog_schema_version to v2"
    "${configMapYamlFile/$replace/$replaceWith}" > container-azm-ms-agentconfig.yaml
    echo "Applying ConfigMap using kubectl apply"
    kubectl apply -f container-azm-ms-agentconfig.yaml
    sleep 1m
fi