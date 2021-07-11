import React from 'react';
import { Pivot, PivotItem, Image, TextField, Link, Separator, DropdownMenuItemType, Dropdown, Stack, Text, Toggle, Label, MessageBar, MessageBarType } from '@fluentui/react';

import { adv_stackstyle, getError } from './common'

export default function ({ updateFn, tabValues, invalidArray, invalidTabs }) {
  const { net, addons, cluster, deploy } = tabValues
  const allok = !(invalidTabs && invalidTabs.length > 0)
  const apiips_array = deploy.apiips.split(',').filter(x => x.trim())

  const params = {
    resourceName: deploy.clusterName,
    kubernetesVersion: deploy.kubernetesVersion,
    agentCount: cluster.count,
    ...(cluster.vmSize !== "default" && { agentVMSize: cluster.vmSize }),
    ...(cluster.autoscale && { agentCountMax: cluster.maxCount }),
    ...(cluster.osDiskType === "Managed" && { osDiskType: cluster.osDiskType, ...(cluster.osDiskSizeGB > 0 && { osDiskSizeGB: cluster.osDiskSizeGB }) }),
    ...(net.vnet_opt === "custom" && { custom_vnet: "true", serviceCidr: net.serviceCidr, vnetAddressPrefix: net.vnetAddressPrefix, vnetAksSubnetAddressPrefix: net.vnetAksSubnetAddressPrefix }),
    ...(net.vnet_opt === "byo" && { byoAKSSubnetId: net.byoAKSSubnetId, serviceCidr: net.serviceCidr }),
    ...(net.vnet_opt === "byo" && addons.ingress === 'appgw' && { byoAGWSubnetId: net.byoAGWSubnetId }),
    ...(cluster.enable_aad && { enable_aad: "true", ...(cluster.enableAzureRBAC === false && cluster.aad_tenant_id && { aad_tenant_id: cluster.aad_tenant_id }) }),
    ...(cluster.enable_aad && cluster.enableAzureRBAC && { enableAzureRBAC: "true", ...(cluster.adminprincipleid && { adminprincipleid: cluster.adminprincipleid }) }),
    ...(addons.registry !== "none" && { registries_sku: addons.registry }),
    ...(net.afw && { azureFirewalls: "true", ...(net.vnet_opt === "custom" && { vnetFirewallSubnetAddressPrefix: net.vnetFirewallSubnetAddressPrefix }) }),
    ...(net.serviceEndpointsEnable && net.serviceEndpoints.length > 0 && { serviceEndpoints: net.serviceEndpoints.map(s => { return { service: s } }) }),
    ...(addons.monitor === "aci" && { omsagent: "true", retentionInDays: addons.retentionInDays }),
    ...(addons.networkPolicy !== "none" && { networkPolicy: addons.networkPolicy }),
    ...(addons.azurepolicy !== "none" && { azurepolicy: addons.azurepolicy }),
    networkPlugin: net.networkPlugin, ...(net.vnet_opt === "custom" && net.networkPlugin === 'kubenet' && { podCidr: net.podCidr }),
    ...(cluster.availabilityZones === "yes" && { availabilityZones: ['1', '2', '3'] }),
    ...(cluster.apisecurity === "whitelist" && apiips_array.length > 0 && { authorizedIPRanges: apiips_array }),
    ...(cluster.apisecurity === "private" && { enablePrivateCluster: "true" }),
    ...(addons.dns && addons.dnsZoneId && { dnsZoneId: addons.dnsZoneId }),
    ...(addons.ingress === "appgw" && { ingressApplicationGateway: "true", ...(net.vnet_opt === "custom" && { vnetAppGatewaySubnetAddressPrefix: net.vnetAppGatewaySubnetAddressPrefix, ...(addons.appgw_privateIp && { appgw_privateIpAddress: addons.appgw_privateIpAddress }) }) }),
    ...(cluster.upgradeChannel !== "none" && { upgradeChannel: cluster.upgradeChannel }),
    ...(net.serviceEndpointsEnable && net.serviceEndpoints.includes('Microsoft.KeyVault') && addons.csisecret === 'akvNew' && { AKVserviceEndpointFW: apiips_array.length > 0 ? apiips_array[0] : "vnetonly" }),
    ...(addons.csisecret === 'akvNew' && { createKV: "true" })
  }

  const preview_params = {
    // if selected service endpoints & Premium, setup ACR firewall : https://docs.microsoft.com/en-us/azure/container-registry/container-registry-vnet
    ...(net.serviceEndpointsEnable && net.serviceEndpoints.includes('Microsoft.ContainerRegistry') && addons.registry === 'Premium' && { ACRserviceEndpointFW: apiips_array.length > 0 ? apiips_array[0] : "vnetonly" }),
    ...(addons.gitops !== "none" && { gitops: addons.gitops })
    // azure-keyvault-secrets-provider  - commenting out until supported by ARM template
    //...(addons.csisecret !== "none" && { azureKeyvaultSecretsProvider: true })
  }

  const params2CLI = p => Object.keys(p).map(k => {
    const val = p[k]
    const targetVal = Array.isArray(val) ? JSON.stringify(val).replaceAll(' ', '').replaceAll('"', '\\"') : val
    return ` \\\n\t${k}=${targetVal}`
  }).join('')

  const params2file = p => Object.keys(p).reduce((a, c) => { return { ...a, parameters: { ...a.parameters, [c]: { value: p[c] } } } }, {
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {}
  })

  const finalParams = { ...params, ...(!deploy.disablePreviews && preview_params) }
  const rg = `${deploy.clusterName}-rg`
  const aks = `aks-${deploy.clusterName}`
  const agw = `agw-${deploy.clusterName}`
  const deploycmd =
    `# Create Resource Group \n` +
    `az group create -l ${deploy.location} -n ${rg} \n\n` +
    `# Deploy template with in-line paramters \n` +
    `az deployment group create -g ${rg}  ${process.env.REACT_APP_AZ_TEMPLATE_ARG} --parameters` + params2CLI(finalParams)
  const param_file = JSON.stringify(params2file(finalParams), null, 2).replaceAll('\\\\\\', '').replaceAll('\\\\\\', '')

  const promethous_namespace = 'monitoring'
  const promethous_helm_release_name = 'monitoring'
  const nginx_namespace = 'ingress-basic'
  const nginx_helm_release_name = 'nginx-ingress'

  const postscript =
    // App Gateway addon
    (net.vnet_opt === 'custom' && addons.ingress === 'appgw' ? `# Workaround to enabling the appgw addon with custom vnet (until supported by template)
az aks enable-addons -n ${aks} -g ${rg} -a ingress-appgw --appgw-id $(az network application-gateway show -g ${rg} -n ${agw} --query id -o tsv)
` : '') +
    // CSI-Secret KeyVault addon - using this method until supported by ARM template
    (addons.csisecret !== "none" ? `\n# Workaround to enabling the csisecret addon (in preview)
az aks enable-addons -n ${aks} -g ${rg} -a azure-keyvault-secrets-provider
` : '') +

    // Get Admin credentials
    `\n# Get admin credentials for your new AKS cluster
az aks get-credentials -g ${rg} -n ${aks} --admin ` +
    // Prometheus
    (addons.monitor === 'oss' ? `\n\n# Install kube-prometheus-stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
kubectl create namespace ${promethous_namespace}
helm install ${promethous_helm_release_name} prometheus-community/kube-prometheus-stack --namespace ${promethous_namespace}` : '') +
    // Nginx Ingress Controller
    (addons.ingress === 'nginx' ? `\n\n# Create a namespace for your ingress resources
kubectl create namespace ${nginx_namespace}

# Add the ingress-nginx repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

# Use Helm to deploy an NGINX ingress controller
helm install ${nginx_helm_release_name} ingress-nginx/ingress-nginx \\
  --set controller.publishService.enabled=true \\
` + (addons.ingressEveryNode ?
        `  --set controller.kind=DaemonSet \\
  --set controller.service.externalTrafficPolicy=Local \\
` : '') +
      (addons.monitor === 'oss' ?
        `  --set controller.metrics.enabled=true \\
  --set controller.metrics.serviceMonitor.enabled=true \\
  --set controller.metrics.serviceMonitor.namespace=${promethous_namespace} \\
  --set controller.metrics.serviceMonitor.additionalLabels.release=${promethous_helm_release_name} \\
` : '') +
      `  --namespace ${nginx_namespace}` : '') +
    // External DNS
    (addons.dnsZoneId ? `\n\n# Install external-dns
kubectl create secret generic azure-config-file --from-file=azure.json=/dev/stdin<<EOF
{
  "userAssignedIdentityID": "$(az aks show -g ${rg} -n ${aks} --query identityProfile.kubeletidentity.clientId -o tsv)",
  "tenantId": "$(az account show --query tenantId -o tsv)",
  "useManagedIdentityExtension": true,
  "subscriptionId": "${addons.dnsZoneId.split('/')[2]}",
  "resourceGroup": "${addons.dnsZoneId.split('/')[4]}"
}
EOF

curl https://raw.githubusercontent.com/khowling/aks-deploy-arm/master/cluster-config/external-dns.yml | sed '/- --provider=azure/a\\            - --domain-filter=${addons.dnsZoneId.split('/')[8]}' | kubectl apply -f -` : '') +
    // Cert-Manager
    (addons.certEmail ? `\n\n# Install cert-manager
kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.1.0/cert-manager.yaml

sleep 30s

cat <<EOF | kubectl create -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    # The ACME server URL
    server: https://acme-v02.api.letsencrypt.org/directory
    # Email address used for ACME registration
    email: "${addons.certEmail}"
    # Name of a secret used to store the ACME account private key
    privateKeySecretRef:
      name: letsencrypt-prod
    # Enable the HTTP-01 challenge provider
    solvers:
    - http01:
        ingress:
          class: ${(addons.ingress === 'nginx' ? "nginx" : "azure/application-gateway")}
EOF
` : '')

  return (

    <Stack tokens={{ childrenGap: 15 }} styles={adv_stackstyle}>
      {!allok &&
        <MessageBar messageBarType={MessageBarType.severeWarning}>
          <Text >Configration not complete, please correct the tabs with the warning symbol <b>({invalidTabs.join(' & ')})</b> before deploying</Text>
        </MessageBar>
      }
      <Stack horizontal styles={{ root: { width: "100%" } }} tokens={{ childrenGap: 150 }}>
        <Stack styles={{ root: { width: "300px" } }}>

          <TextField label="Cluster Name" onChange={(ev, val) => updateFn('clusterName', val)} required errorMessage={getError(invalidArray, 'clusterName')} value={deploy.clusterName} />
          <Dropdown
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
        <Stack tokens={{ childrenGap: 20 }} styles={{ root: { width: "450px" } }}>
          <TextField label="Kubernetes version" readOnly={false} disabled={false} required value={deploy.kubernetesVersion} onChange={(ev, val) => updateFn('kubernetesVersion', val)} />

          <Stack.Item styles={{ root: { display: (cluster.apisecurity !== "whitelist" ? "none" : "block") } }} >
            <TextField label="Initial api server whitelisted IPs/CIDRs  (',' seperated)" errorMessage={getError(invalidArray, 'apiips')} onChange={(ev, val) => updateFn("apiips", val)} value={deploy.apiips} required={cluster.apisecurity === "whitelist"} />
          </Stack.Item>

        </Stack>



      </Stack>
      {/*
          { (addons.ingress === 'none' || !addons.dns || !addons.certMan) &&
            <MessageBar messageBarType={MessageBarType.info}>To enable the option of deploying a <b>Demo Ecommerce App</b>, go to the <b>Application Requirements</b> tab, and select an ingress option (Application Gateway or Nginx), and complete the FQDN and Certificate options</MessageBar>
          }
          <Toggle
            disabled={(addons.ingress === 'none' || !addons.dns || !addons.certMan)}
            label={<Text>Do you want to install the <Link target="_a" href="https://github.com/khowling/aks-ecomm-demo">Demo Ecommerce App</Link> into your cluster with a HTTPS FQDN exposed through an Ingress controller</Text>}
            checked={deploy.demoapp} onText="Yes" offText="No" onChange={(ev, checked) => updateFn("demoapp", checked)} />
        */}

      <Separator styles={{ root: { marginTop: '30px !important' } }}><div style={{ display: "flex", alignItems: 'center', }}><b style={{ marginRight: '10px' }}>Deploy Cluster</b><Image src="./bicep.png" /> <p style={{ marginLeft: '10px' }}>powered by Bicep</p></div> </Separator>

      {Object.keys(preview_params).length > 0 &&
        <MessageBar messageBarType={MessageBarType.warning}>
          <Text >Your deployment contains Preview features: <b>{Object.keys(preview_params).join(',')}</b>, Ensure you have registered for these previews, and have installed the <b>'az extension add --name aks-preview'</b>  before running the script, <Link target="_pv" href="https://github.com/Azure/AKS/blob/master/previews.md">see here</Link>, or disable preview features here</Text>
          <Toggle styles={{ root: { marginTop: "10px" } }} onText='preview enabled' offText="preview disabled" checked={!deploy.disablePreviews} onChange={(ev, checked) => updateFn("disablePreviews", !checked)} />
        </MessageBar>

      }

      <Pivot >
        <PivotItem headerText="Provision Environment (CLI)"  >
          <TextField value={deploycmd} rows={deploycmd.split(/\r\n|\r|\n/).length + 1} readOnly={true} label="Commands to deploy your fully operational environment" styles={{ root: { fontFamily: 'Monaco, Menlo, Consolas, "Droid Sans Mono", Inconsolata, "Courier New", monospace' }, field: { backgroundColor: 'lightgrey', lineHeight: '21px' } }} multiline errorMessage={!allok ? "Please complete all items that need attention before running script" : ""} />
          <Text styles={{ root: { marginTop: "2px !important" } }} variant="medium" >
            Open a Linux shell (requires 'az cli' pre-installed), or, open the
            <Link target="_cs" href="http://shell.azure.com/">Azure Cloud Shell</Link>.
            <Text variant="medium" style={{ fontWeight: "bold" }}>Paste the commands</Text> into the shell
          </Text>
        </PivotItem>
        <PivotItem headerText="Provision Environment (CI/CD)">
          <TextField value={"TBC"} rows={5} readOnly={true} label="Github action" styles={{ root: { fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace!important' }, field: { backgroundColor: 'lightgrey', lineHeight: '21px' } }} multiline  >
          </TextField>
          <TextField value={param_file} rows={param_file.split(/\r\n|\r|\n/).length + 1} readOnly={true} label="Parameter file" styles={{ root: { fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace!important' }, field: { backgroundColor: 'lightgrey', lineHeight: '21px' } }} multiline  >
          </TextField>

        </PivotItem>

        <PivotItem headerText="Post Configuration">
          {addons.gitops === 'none' ?
            <Stack>
              <Label>Run these commands to install the requeted kubernetes packages into your cluster</Label>
              <MessageBar>Once available, we will switch to using the gitops addon here, to assure that your clusters get their source of truth from the defined git repo</MessageBar>
              <TextField readOnly={true} label="Commands (requires helm)" styles={{ root: { fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace!important' }, field: { backgroundColor: 'lightgrey', lineHeight: '21px' } }} multiline rows={postscript.split(/\r\n|\r|\n/).length + 1} value={postscript} />
            </Stack>
            :
            <Stack>

              <TextField readOnly={true} label="While Gitops is in preview, run this manually" styles={{ root: { fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace!important' }, field: { backgroundColor: 'lightgrey', lineHeight: '21px' } }} multiline rows={6} value={`az k8sconfiguration create
        --name cluster-config 
        --cluster-name ${aks}    
        --resource-group ${rg}     
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
      </Pivot>
    </Stack>
  )
}