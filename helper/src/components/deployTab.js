/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import {  Checkbox, Pivot, PivotItem, Image, TextField, Link, Separator, DropdownMenuItemType, Dropdown, Stack, Text, Toggle, Label, MessageBar, MessageBarType } from '@fluentui/react';

import { CodeBlock, adv_stackstyle, getError } from './common'

export default function DeployTab({ defaults, updateFn, tabValues, invalidArray, invalidTabs, urlParams }) {

  const { net, addons, cluster, deploy } = tabValues
  const allok = !(invalidTabs && invalidTabs.length > 0)
  const apiips_array = deploy.apiips.split(',').filter(x => x.trim())
  const aksvnetparams = {
    ...(net.vnetAddressPrefix !== defaults.net.vnetAddressPrefix && { vnetAddressPrefix: net.vnetAddressPrefix }),
    ...(net.vnetAksSubnetAddressPrefix !== defaults.net.vnetAksSubnetAddressPrefix && { vnetAksSubnetAddressPrefix: net.vnetAksSubnetAddressPrefix })
  }
  const serviceparams = {
    ...(net.serviceCidr !== defaults.net.serviceCidr && { serviceCidr: net.serviceCidr }),
    ...(net.dnsServiceIP !== defaults.net.dnsServiceIP && { dnsServiceIP: net.dnsServiceIP })
  }
  const params = {
    resourceName: deploy.clusterName,
    ...(deploy.kubernetesVersion !== defaults.deploy.kubernetesVersion && {kubernetesVersion: deploy.kubernetesVersion}),
    ...(cluster.agentCount !== defaults.cluster.agentCount && { agentCount: cluster.agentCount}),
    ...(cluster.upgradeChannel !== defaults.cluster.upgradeChannel && { upgradeChannel: cluster.upgradeChannel }),
    ...(cluster.AksPaidSkuForSLA !== defaults.cluster.AksPaidSkuForSLA && { AksPaidSkuForSLA: cluster.AksPaidSkuForSLA }),
    ...(cluster.SystemPoolType === 'none' ? { JustUseSystemPool: true } : cluster.SystemPoolType !== defaults.cluster.SystemPoolType && { SystemPoolType: cluster.SystemPoolType }),
    ...(cluster.vmSize !== defaults.cluster.vmSize && { agentVMSize: cluster.vmSize }),
    ...((cluster.autoscale !== defaults.cluster.autoscale || cluster.maxCount !== defaults.cluster.maxCount) && { agentCountMax: cluster.autoscale ? cluster.maxCount : 0 }),
    ...(cluster.osDiskType === "Managed" && { osDiskType: cluster.osDiskType, ...(cluster.osDiskSizeGB > 0 && { osDiskSizeGB: cluster.osDiskSizeGB }) }),
    ...(net.vnet_opt === "custom" && {
         custom_vnet: true,
         ...serviceparams,
         ...aksvnetparams,
         ...(net.bastion !== defaults.net.bastion && {bastion: net.bastion}),
         ...(net.bastion && defaults.net.bastionSubnetAddressPrefix !== net.bastionSubnetAddressPrefix && {bastionSubnetAddressPrefix: net.bastionSubnetAddressPrefix})
       }),
    ...(net.vnet_opt === "byo" && { byoAKSSubnetId: net.byoAKSSubnetId, ...serviceparams }),
    ...(net.vnet_opt === "byo" && addons.ingress === 'appgw' && { byoAGWSubnetId: net.byoAGWSubnetId }),
    ...(cluster.enable_aad && { enable_aad: true, ...(cluster.enableAzureRBAC === false && cluster.aad_tenant_id && { aad_tenant_id: cluster.aad_tenant_id }) }),
    ...(cluster.enable_aad && cluster.AksDisableLocalAccounts !== defaults.cluster.AksDisableLocalAccounts && { AksDisableLocalAccounts: cluster.AksDisableLocalAccounts }),
    ...(cluster.enable_aad && cluster.enableAzureRBAC && { enableAzureRBAC: true, ...(deploy.clusterAdminRole && { adminprincipleid: "$(az ad signed-in-user show --query objectId --out tsv)" }) }),
    ...(addons.registry !== "none" && {
        registries_sku: addons.registry,
        ...(deploy.acrPushRole && { acrPushRolePrincipalId: "$(az ad signed-in-user show --query objectId --out tsv)"}) }),
    ...(net.afw && { azureFirewalls: true, ...(addons.certMan && {certManagerFW: true}), ...(net.vnet_opt === "custom" && defaults.net.vnetFirewallSubnetAddressPrefix !== net.vnetFirewallSubnetAddressPrefix && { vnetFirewallSubnetAddressPrefix: net.vnetFirewallSubnetAddressPrefix }) }),
    ...(net.vnet_opt === "custom" && net.vnetprivateend && {
        privateLinks: true,
        ...(addons.csisecret === 'akvNew' && deploy.kvIPAllowlist  && apiips_array.length > 0 && {kvIPAllowlist: apiips_array }),
        ...(defaults.net.privateLinkSubnetAddressPrefix !== net.privateLinkSubnetAddressPrefix && {privateLinkSubnetAddressPrefix: net.privateLinkSubnetAddressPrefix}),
    }),
    ...(addons.monitor === "aci" && { omsagent: true, retentionInDays: addons.retentionInDays, ...( addons.createAksMetricAlerts !== defaults.addons.createAksMetricAlerts && {createAksMetricAlerts: addons.createAksMetricAlerts }) }),
    ...(addons.networkPolicy !== "none" && { networkPolicy: addons.networkPolicy }),
    ...(defaults.addons.openServiceMeshAddon !== addons.openServiceMeshAddon && {openServiceMeshAddon: addons.openServiceMeshAddon }),
    ...(addons.azurepolicy !== "none" && { azurepolicy: addons.azurepolicy }),
    ...(addons.azurepolicy !== "none" && addons.azurePolicyInitiative !== defaults.addons.azurePolicyInitiative && { azurePolicyInitiative: addons.azurePolicyInitiative }),
    ...(net.networkPlugin !== defaults.net.networkPlugin && {networkPlugin: net.networkPlugin}),
    ...(net.vnet_opt === "custom" && net.networkPlugin === 'kubenet' && defaults.net.podCidr !== net.podCidr && { podCidr: net.podCidr }),
    ...(cluster.availabilityZones === "yes" && { availabilityZones: ['1', '2', '3'] }),
    ...(cluster.apisecurity === "whitelist" && deploy.clusterIPWhitelist && apiips_array.length > 0 && { authorizedIPRanges: apiips_array }),
    ...(cluster.apisecurity === "private" && { enablePrivateCluster: true }),
    ...(addons.ingress !== "none" && addons.dns && addons.dnsZoneId && { dnsZoneId: addons.dnsZoneId }),
    ...(addons.ingress === "appgw" && {
      ingressApplicationGateway: true, ...(net.vnet_opt === 'custom' && defaults.net.vnetAppGatewaySubnetAddressPrefix !== net.vnetAppGatewaySubnetAddressPrefix && { vnetAppGatewaySubnetAddressPrefix: net.vnetAppGatewaySubnetAddressPrefix }), ...(net.vnet_opt !== 'default' && {
        appGWcount: addons.appGWcount,
        appGWsku: addons.appGWsku,
        ...(addons.appGWsku === 'WAF_v2' && addons.appGWenableFirewall !== defaults.addons.appGWenableFirewall && { appGWenableFirewall: addons.appGWenableFirewall }),
        ...(addons.appGWsku === 'WAF_v2' && addons.appGWenableFirewall && addons.appGwFirewallMode !== defaults.addons.appGwFirewallMode && { appGwFirewallMode: addons.appGwFirewallMode }),
        ...(addons.appGWautoscale && { appGWmaxCount: addons.appGWmaxCount }),
        ...(addons.appgw_privateIp && { privateIpApplicationGateway: addons.appgw_privateIpAddress }),
        ...(addons.appgwKVIntegration && addons.csisecret === 'akvNew' && { appgwKVIntegration: true })
      })
    }),
    ...(addons.csisecret !== "none" && { azureKeyvaultSecretsProvider: true }),
    ...(addons.csisecret === 'akvNew' && { createKV: true, ...(deploy.kvCertSecretRole && { kvOfficerRolePrincipalId: "$(az ad signed-in-user show --query objectId --out tsv)"}) })
  }

  const preview_params = {
    ...(addons.gitops !== "none" && { gitops: addons.gitops }),
    ...(net.vnet_opt === "custom" && net.vnetprivateend && {
      ...(addons.registry !== "none" && {
        ...(addons.acrPrivatePool !== defaults.addons.acrPrivatePool && {acrPrivatePool: addons.acrPrivatePool}),
        ...(addons.acrPrivatePool && defaults.net.acrAgentPoolSubnetAddressPrefix !== net.acrAgentPoolSubnetAddressPrefix && {acrAgentPoolSubnetAddressPrefix: net.acrAgentPoolSubnetAddressPrefix})
      })
    }),
    ...(urlParams.getAll('feature').includes('defender') && cluster.DefenderForContainers !== defaults.cluster.DefenderForContainers && { DefenderForContainers: cluster.DefenderForContainers })
  }

  const params2CLI = p => Object.keys(p).map(k => {
    const val = p[k]
    const targetVal = Array.isArray(val) ? JSON.stringify(JSON.stringify(val)) : val
    return ` \\\n\t${k}=${targetVal}`
  }).join('')

  const params2file = p => Object.keys(p).filter(p => p !== 'adminprincipleid' && p !== 'acrPushRolePrincipalId' && p !== 'kvOfficerRolePrincipalId').reduce((a, c) => { return { ...a, parameters: { ...a.parameters, [c]: { value: p[c] } } } }, {
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {}
  })

  const finalParams = { ...params, ...(!deploy.disablePreviews && preview_params) }
  const aks = `aks-${deploy.clusterName}`
  const agw = `agw-${deploy.clusterName}`
  const deploycmd =
    `# Create Resource Group \n` +
    `az group create -l ${deploy.location} -n ${deploy.rg} \n\n` +
    `# Deploy template with in-line parameters \n` +
    `az deployment group create -g ${deploy.rg}  ${deploy.selectedTemplate === "local" ? '--template-file ./bicep/main.bicep' : `--template-uri ${deploy.templateVersions.length >1 && deploy.templateVersions.find(t => t.key === deploy.selectedTemplate).url}` } --parameters` + params2CLI(finalParams)
  const param_file = JSON.stringify(params2file(finalParams), null, 2).replaceAll('\\\\\\', '').replaceAll('\\\\\\', '')


  /*  WIP - Want the UI to call a common post-install script, instead of outputting the individual commands!
   *
  const post_script = `sh ${process.env.REACT_APP_TEMPLATERELEASE || '.'}${cluster.apisecurity === "private" && !process.env.REACT_APP_TEMPLATERELEASE ? '' : '/postdeploy/scripts'}/postdeploy.sh -g ${deploy.rg} -n ${aks} ${process.env.REACT_APP_TEMPLATERELEASE ? `-r ${process.env.REACT_APP_TEMPLATERELEASE}` : ''} -p vnet_opt=${net.vnet_opt}` +
    (addons.networkPolicy !== 'none' && addons.denydefaultNetworkPolicy ? `,denydefaultNetworkPolicy=${addons.denydefaultNetworkPolicy}` : '') +
    (addons.ingress == "appgw" ? `,agw=agw-${deploy.clusterName}` : '') +
    (addons.ingress !== "none" ? `,ingress=${addons.ingress}` : '') +
    (cluster.apisecurity !== "none" ? `,apisecurity=${cluster.apisecurity}` : '') +
    (cluster.monitor !== "none" ? `,monitor=${addons.monitor}` : '') +
    (addons.ingressEveryNode ? `,ingressEveryNode=${addons.ingressEveryNode}` : '') +
    (addons.ingress !== "none" && addons.dns &&  addons.dnsZoneId ? `,dnsZoneId=${addons.dnsZoneId}` : '') +
    (addons.ingress !== 'none' && addons.certMan ? `,certMan=${addons.certMan}` : '')

  */

  /*  Post Script START - To be replaced with external common script
   *  --------------------------------------------------------------
  */

  const prometheus_namespace = 'monitoring'
  const prometheus_helm_release_name = 'monitoring'
  const nginx_namespace = 'ingress-basic'
  const nginx_helm_release_name = 'nginx-ingress'
  const contour_namespace = 'ingress-basic'
  const contour_helm_release_name = 'contour-ingress'

  const EXTERNAL_DNS_REGISTRY = 'k8s.gcr.io'
  const EXTERNAL_DNS_REPO = 'external-dns/external-dns'
  // appVersion :: https://raw.githubusercontent.com/kubernetes-sigs/external-dns/master/charts/external-dns/Chart.yaml
  const EXTERNAL_DNS_TAG = 'v0.10.2'


  const postscript_az =
    // App Gateway addon: see main.bicep DEPLOY_APPGW_ADDON
    (net.vnet_opt === "byo" && addons.ingress === 'appgw' ? `
# ------------------------------------------------
#          Workaround to enable AGIC with BYO VNET
APPGW_RG_ID="$(az group show -n ${deploy.rg} --query id -o tsv)"
APPGW_ID="$(az network application-gateway show -g ${deploy.rg} -n ${agw} --query id -o tsv)"
az aks enable-addons -n ${aks} -g ${deploy.rg} -a ingress-appgw --appgw-id $APPGW_ID
AKS_AGIC_IDENTITY_ID="$(az aks show -g ${deploy.rg} -n ${aks} --query addonProfiles.ingressApplicationGateway.identity.objectId -o tsv)"
az role assignment create --role "Contributor" --assignee-principal-type ServicePrincipal --assignee-object-id $AKS_AGIC_IDENTITY_ID --scope $APPGW_ID
az role assignment create --role "Reader" --assignee-principal-type ServicePrincipal --assignee-object-id $AKS_AGIC_IDENTITY_ID --scope $APPGW_RG_ID
` : '') +
    (net.vnet_opt === "byo" && addons.ingress === 'appgw' /* && appgwKVIntegration */ ? `
APPGW_IDENTITY="$(az network application-gateway show -g ${deploy.rg} -n ${agw} --query 'keys(identity.userAssignedIdentities)[0]' -o tsv)"
az role assignment create --role "Managed Identity Operator" --assignee-principal-type ServicePrincipal --assignee-object-id $AKS_AGIC_IDENTITY_ID --scope $APPGW_IDENTITY
` : '') +
    (addons.ingress !== "none" && addons.dns &&  addons.dnsZoneId && cluster.apisecurity === "private" ? `
# ------------------------------------------------
#                 Import external-dns Image to ACR
export ACRNAME=$(az acr list -g ${deploy.rg} --query [0].name -o tsv)
az acr import -n $ACRNAME --source ${EXTERNAL_DNS_REGISTRY}/${EXTERNAL_DNS_REPO}:${EXTERNAL_DNS_TAG} --image ${EXTERNAL_DNS_REPO}:${EXTERNAL_DNS_TAG}
`:'')

const postscript_cluster =
    // Default Deny All Network Policy, east-west traffic in cluster
    (addons.networkPolicy !== 'none' && addons.denydefaultNetworkPolicy ? `
# ------------------------------------------------
#   Create a default-deny namespace network policy
kubectl apply -f ${deploy.selectedTemplate === "local" ? (cluster.apisecurity !== "private" ? './postdeploy/k8smanifests/' : './') : 'https://raw.githubusercontent.com/Azure/AKS-Construction/main/postdeploy/k8smanifests/'}networkpolicy-deny-all.yml
` : '') +

    // Nginx Ingress Controller
    (addons.ingress === 'nginx' ? `
# ------------------------------------------------
#                 Install Nginx Ingress Controller
kubectl create namespace ${nginx_namespace}
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm upgrade --install  ${nginx_helm_release_name} ingress-nginx/ingress-nginx \\
  --set controller.publishService.enabled=true \\
` + (addons.ingressEveryNode ?
        `  --set controller.kind=DaemonSet \\
  --set controller.service.externalTrafficPolicy=Local \\
` : '') +
      (addons.monitor === 'oss' ?
        `  --set controller.metrics.enabled=true \\
  --set controller.metrics.serviceMonitor.enabled=true \\
  --set controller.metrics.serviceMonitor.namespace=${prometheus_namespace} \\
  --set controller.metrics.serviceMonitor.additionalLabels.release=${prometheus_helm_release_name} \\
` : '') +
      `  --namespace ${nginx_namespace}
` : '') +

    // Contour Ingress Controller
    (addons.ingress === 'contour' ? `
# ------------------------------------------------
#               Install Contour Ingress Controller
helm repo add bitnami https://charts.bitnami.com/bitnami
helm upgrade --install  ${contour_helm_release_name} bitnami/contour --version 7.3.4 --namespace ${contour_namespace} --create-namespace \\
    --set envoy.kind=${addons.ingressEveryNode ? 'daemonset' : 'deployment'} \\
    --set contour.service.externalTrafficPolicy=${addons.ingressEveryNode ? 'local' : 'cluster'} \\
    --set metrics.serviceMonitor.enabled=${addons.monitor === 'oss' ? 'true' : 'false'} \\
    --set commonLabels."release"=${prometheus_helm_release_name} \\
    --set metrics.serviceMonitor.namespace=${prometheus_namespace}
` : '') +

    // External DNS
    // external-dns needs permissions to make changes in the Azure DNS server.
    // https://github.com/kubernetes-sigs/external-dns/blob/master/docs/tutorials/azure.md#azure-managed-service-identity-msi
    (addons.ingress !== "none" && addons.dns &&  addons.dnsZoneId ? `
# ------------------------------------------------
#                             Install external-dns
kubectl create secret generic aks-kube-msi --from-literal=azure.json="{
  userAssignedIdentityID: $(az aks show -g ${deploy.rg} -n ${aks} --query identityProfile.kubeletidentity.clientId -o tsv),
  tenantId: $(az account show --query tenantId -o tsv),
  useManagedIdentityExtension: true,
  subscriptionId: ${addons.dnsZoneId.split('/')[2]},
  resourceGroup: ${addons.dnsZoneId.split('/')[4]}
}"
helm upgrade --install externaldns https://github.com/kubernetes-sigs/external-dns/releases/download/external-dns-helm-chart-1.7.1/external-dns-1.7.1.tgz \\
  --set domainFilters={"${addons.dnsZoneId.split('/')[8]}"} \\
  --set provider="${addons.dnsZoneId.split('/')[7] === 'privateDnsZones' ? 'azure-private-dns' : 'azure'}" \\
  --set extraVolumeMounts[0].name=aks-kube-msi,extraVolumeMounts[0].mountPath=/etc/kubernetes,extraVolumeMounts[0].readOnly=true \\
  --set extraVolumes[0].name=aks-kube-msi,extraVolumes[0].secret.secretName=aks-kube-msi${false? ',extraVolumes[0].secret.items[0].key=externaldns-config.json,extraVolumes[0].secret.items[0].path=azure.json':''} ${cluster.apisecurity === "private" ? `\\
  --set image.repository="$ACRNAME.azurecr.io/${EXTERNAL_DNS_REPO}"
  --set image.tag="${EXTERNAL_DNS_TAG}"` : ''}
` : '') +
    // Cert-Manager
    // https://cert-manager.io/docs/installation/
    // Cannot use 1.6.0 with AGIC https://github.com/jetstack/cert-manager/issues/4547
    // cert-manager ACME ClusterIssuer Configuration (client owns the domain)
    // Lets Encrypt production Issuer, using either HTTP01 for external services, or DNS01 for internal
    // https://cert-manager.io/docs/configuration/acme/

    /*
    - dns01:
        # Add azureDNS resolver for Private endpoints, but this need to be fixed: https://github.com/cert-manager/website/issues/662
        azureDNS:
          subscriptionID: ${addons.dnsZoneId.split('/')[2]}
          resourceGroupName: ${addons.dnsZoneId.split('/')[4]}
          hostedZoneName: ${addons.dnsZoneId.split('/')[8]}
          managedIdentity:
            # client id of the node pool managed identity (can not be set at the same time as resourceID)
            # https://github.com/tomasfreund/website/blob/ee75bf5685474c651d08750ecfe3a150de5eb586/content/en/docs/configuration/acme/dns01/azuredns.md
            clientID: $(az aks show -g ${deploy.rg} -n ${aks} --query identityProfile.kubeletidentity.clientId -o tsv)
    */
    (addons.ingress !== 'none' && addons.certMan ? `
# ------------------------------------------------
#                             Install cert-manager
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/${addons.ingress === 'appgw' ? 'v1.5.3' : 'v1.6.0'}/cert-manager.yaml
sleep 20s # wait for cert-manager webhook to install
helm upgrade --install letsencrypt-issuer ${deploy.selectedTemplate === "local" ? (cluster.apisecurity !== "private" ? './postdeploy/helm/' : './') : 'https://raw.githubusercontent.com/Azure/AKS-Construction/main/postdeploy/helm/'}Az-CertManagerIssuer-0.3.0.tgz \\
    --set email=${addons.certEmail}  \\
    --set ingressClass=${addons.ingress === 'appgw' ? "azure/application-gateway" : addons.ingress}
`: '') +
    // Prometheus
    (addons.monitor === 'oss' ? `
# ------------------------------------------------
#              Install kube-prometheus-stack chart
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
kubectl create namespace ${prometheus_namespace}
helm upgrade --install  ${prometheus_helm_release_name} prometheus-community/kube-prometheus-stack --namespace ${prometheus_namespace} ${addons.monitor === 'oss' && addons.enableMonitorIngress && addons.dns && addons.dnsZoneId ? `\\
  --set grafana.ingress.enabled=true \\
  --set grafana.ingress.annotations."cert-manager\\.io/cluster-issuer"=letsencrypt-prod \\
  --set grafana.ingress.annotations."ingress\\.kubernetes\\.io/force-ssl-redirect"=\\"true\\" \\
  --set grafana.ingress.ingressClassName=${addons.ingress} \\
  --set grafana.ingress.hosts[0]=grafana.${addons.dnsZoneId.split('/')[8]} \\
  --set grafana.ingress.tls[0].hosts[0]=grafana.${addons.dnsZoneId.split('/')[8]},grafana.ingress.tls[0].secretName=aks-grafana
`: ''}
` : '')


  /*  Post Script END - To be replaced with external common script
   *  --------------------------------------------------------------
  */


  const postscript = `${postscript_az}
${postscript_cluster ? (cluster.apisecurity !== "private" ? `
# ------------------------------------------------
#         Get credentials for your new AKS cluster
az aks get-credentials -g ${deploy.rg} -n ${aks}
${postscript_cluster}` : `
# ------------------------------------------------
#           Private cluster, so use command invoke
az aks command invoke -g ${deploy.rg} -n ${aks}  --command "
${postscript_cluster.replaceAll('"', '\\"')}
"  ${addons.certMan && deploy.selectedTemplate === "local" ? '--file  ./postdeploy/helm/Az-CertManagerIssuer-0.3.0.tgz' : ''} ${addons.networkPolicy !== 'none' && addons.denydefaultNetworkPolicy && deploy.selectedTemplate === "local" ? '--file  ./postdeploy/k8smanifests/networkpolicy-deny-all.yml' : ''}  `): ''}`

  return (

    <Stack tokens={{ childrenGap: 15 }} styles={adv_stackstyle}>
      {!allok &&
        <MessageBar messageBarType={MessageBarType.severeWarning}>
          <Text >Configuration not complete, please correct the tabs with the warning symbol <b>({invalidTabs.join(' & ')})</b> before deploying</Text>
        </MessageBar>
      }
      <Stack horizontal styles={{ root: { width: "100%" } }} tokens={{ childrenGap: 50 }}>
        <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: "400px" } }}>

          <Separator ><div style={{ display: "flex", alignItems: 'center', }}><b style={{ marginRight: '10px' }}>Environment Name & Location</b></div> </Separator>

          <TextField label="Cluster Name" onChange={(ev, val) => updateFn('clusterName', val)} required errorMessage={getError(invalidArray, 'clusterName')} value={deploy.clusterName} />
          <TextField id="azResourceGroup" label="Resource Group" onChange={(ev, val) => updateFn('rg', val)} required errorMessage={getError(invalidArray, 'rg')} value={deploy.rg} />
          <TextField label="Kubernetes version" prefix="Current GA Version" readOnly={false} disabled={false} required value={deploy.kubernetesVersion} onChange={(ev, val) => updateFn('kubernetesVersion', val)} />

          <Dropdown
            data-testid="deploy-location-Dropdown"
            label="Location"
            selectedKey={deploy.location}
            onChange={(ev, { key }) => updateFn('location', key)}
            options={[
              { key: 'europe', text: 'Europe', itemType: DropdownMenuItemType.Header },
              { key: "WestEurope", text: "West Europe" },
              { key: "NorthEurope", text: "North Europe" },
              { key: "UKSouth", text: "UK South" },
              { key: "UKSouth2", text: "UK South2" },
              { key: "UKWest", text: "UK West" },
              { key: 'middleeast', text: 'Middle East', itemType: DropdownMenuItemType.Header },
              { key: "UAENorth", text: "UAE North" },
              { key: 'america', text: 'North America', itemType: DropdownMenuItemType.Header },
              { key: "CentralUS", text: "Central US" },
              { key: "EastUS", text: "East US" },
              { key: "EastUS2", text: "East US2" },
              { key: "WestUS", text: "West US" },
              { key: "WestUS2", text: "West US2" },
              { key: "WestCentralUS", text: "West Central US" }
            ]}
            styles={{ dropdown: { width: 300 } }}
          />
        </Stack>
        <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: "400px" } }}>

          <Separator ><div style={{ display: "flex", alignItems: 'center', }}><b style={{ marginRight: '10px' }}>Environment Access & Build Agents</b></div> </Separator>

          <TextField label="Current IP Address" prefix="IP or Cidr , separated" errorMessage={getError(invalidArray, 'apiips')} onChange={(ev, val) => updateFn("apiips", val)} value={deploy.apiips} required={cluster.apisecurity === "whitelist"} />


            <Label>Grant AKS Cluster Admin Role <a target="_target" href="https://docs.microsoft.com/en-gb/azure/aks/manage-azure-rbac#create-role-assignments-for-users-to-access-cluster">docs</a></Label>
            <Stack.Item>
              <Checkbox disabled={cluster.enable_aad === false || cluster.enableAzureRBAC === false} checked={deploy.clusterAdminRole} onChange={(ev, v) => updateFn("clusterAdminRole", v)} label="Assign deployment user 'ClusterAdmin'" />
              <Checkbox disabled={cluster.apisecurity !== "whitelist"}  onChange={(ev, val) => updateFn("clusterIPWhitelist", val)} checked={deploy.clusterIPWhitelist} label="Add current IP to AKS firewall (applicable to AKS IP ranges)"  />
            </Stack.Item>


            <Label>Grant Azure Container Registry (ACR) Push role </Label>
            <Checkbox disabled={addons.registry === "none"} checked={deploy.acrPushRole} onChange={(ev, v) => updateFn("acrPushRole", v)} label="Assign deployment user 'AcrPush'" />

            <Label>Grant Key Vault Certificate and Secret Officer role <a target="_target" href="https://docs.microsoft.com/azure/key-vault/general/rbac-guide?tabs=azure-cli#azure-built-in-roles-for-key-vault-data-plane-operations">docs</a></Label>
            <Stack.Item>
            <Checkbox disabled={addons.csisecret !== 'akvNew'} checked={deploy.kvCertSecretRole} onChange={(ev, v) => updateFn("kvCertSecretRole", v)} label="Assign deployment user Certificate and Secret Officer" />
            <Checkbox disabled={addons.csisecret !== 'akvNew' || !net.vnetprivateend} checked={deploy.kvIPAllowlist} onChange={(ev, v) => updateFn("kvIPAllowlist", v)} label="Add current IP to KeyVault firewall (applicable to private link)" />
            </Stack.Item>
            { deploy.kvIPAllowlist && net.vnetprivateend && <MessageBar messageBarType={MessageBarType.info}> <Text >"Add current IP to KeyVault firewall" will enable KeyVaults  PublicNetworkAccess property</Text></MessageBar> }

        </Stack>

      </Stack>

      <Separator styles={{ root: { marginTop: '30px !important' } }}><div style={{ display: "flex", alignItems: 'center', }}><b style={{ marginRight: '10px' }}>Deploy Cluster</b><Image src="./bicep.png" /> <p style={{ marginLeft: '10px' }}>powered by Bicep</p></div> </Separator>

      {Object.keys(preview_params).length > 0 &&
        <MessageBar messageBarType={MessageBarType.warning}>
          <Text >Your deployment contains Preview features: <b>{Object.keys(preview_params).join(', ')}</b>, Ensure you have registered for these previews, and have installed the <b>'az extension add --name aks-preview'</b>  before running the script, <Link target="_pv" href="https://github.com/Azure/AKS/blob/master/previews.md">see here</Link>, or disable preview features here</Text>
          <Toggle styles={{ root: { marginTop: "10px" } }} onText='preview enabled' offText="preview disabled" checked={!deploy.disablePreviews} onChange={(ev, checked) => updateFn("disablePreviews", !checked)} />
        </MessageBar>

      }


      <Pivot >

        <PivotItem headerText="Provision Environment (CLI)"  >

          <Stack horizontal horizontalAlign="space-between" styles={{root: { width: '100%', marginTop: '10px'}}}>
            <Stack.Item>
              <Label >Commands to deploy your fully operational environment</Label>
              <Text>
                Requires <Link target="_bl" href="https://docs.microsoft.com/cli/azure/install-azure-cli">AZ CLI</Link>, or, execute in the
                <Link target="_cs" href="http://shell.azure.com/">Azure Cloud Shell</Link>.

              </Text>
            </Stack.Item>

            <Stack.Item  align="end">
              <Stack horizontal tokens={{childrenGap: 5}}>
              <Label>Template Version</Label>
              <Dropdown
                    disabled={process.env.REACT_APP_TEMPLATERELEASE}
                    selectedKey={deploy.selectedTemplate}
                    onChange={(ev, { key }) => updateFn('selectedTemplate', key)}
                    options={deploy.templateVersions}
                    styles={{ dropdown: { width: 200 } }}
                  />
              </Stack>
            </Stack.Item>
          </Stack>

          <CodeBlock deploycmd={deploycmd} testId={'deploy-deploycmd'}/>

          { urlParams.toString() !== "" &&
            <Text variant="medium">Not ready to deploy? Bookmark your configuration : <a href={"?" + urlParams.toString()}>here</a></Text>
          }



        </PivotItem>

        <PivotItem headerText="Post Configuration">
          {addons.gitops === 'none' ? [

              <Label key="post-label" style={{marginTop: '10px'}}>Commands to install kubernetes packages into your cluster</Label>,

              <Text key="post-text">Requires <Link target="_bl" href="https://helm.sh/docs/intro/install/">Helm</Link></Text>,

              <CodeBlock key="post-code" deploycmd={postscript}/>

          ] :
            <Stack>

              <TextField readOnly={true} label="While Gitops is in preview, run this manually" styles={{ root: { fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace!important' }, field: { backgroundColor: 'lightgrey', lineHeight: '21px' } }} multiline rows={6} value={`az k8sconfiguration create
        --name cluster-config
        --cluster-name ${aks}
        --resource-group ${deploy.rg}
        --operator-instance-name flux
        --operator-namespace cluster-config
        --enable-helm-operator
        --operator-params='--git-readonly --git-path=cluster-config'
        --repository-url git://github.com/khowling/aks-deploy-arm.git
        --scope cluster
        --helm-operator-params='--set helm.versions=v3'
        --cluster-type managedclusters`} />

            </Stack>
          }
        </PivotItem>

        <PivotItem headerText="Template Parameters File (for CI/CD)">

          <TextField value={param_file} rows={param_file.split(/\r\n|\r|\n/).length + 1} readOnly={true} label="Parameter file" styles={{ root: { fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace!important' }, field: { backgroundColor: 'lightgrey', lineHeight: '21px' } }} multiline  >
          </TextField>

        </PivotItem>
      </Pivot>

    </Stack>
  )
}