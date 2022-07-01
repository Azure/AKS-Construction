/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import {  Checkbox, Pivot, PivotItem, Image, TextField, Link, Separator, DropdownMenuItemType, Dropdown, Stack, Text, Toggle, Label, MessageBar, MessageBarType } from '@fluentui/react';

import { CodeBlock, adv_stackstyle, getError } from './common'
import dependencies from "../dependencies.json";

export default function DeployTab({ defaults, updateFn, tabValues, invalidArray, invalidTabs, urlParams, featureFlag }) {
  const terraformFeatureFlag = featureFlag.includes('tf')

  const { net, addons, cluster, deploy } = tabValues

  const aks = `aks-${deploy.clusterName}`
  const agw = `agw-${deploy.clusterName}`

  const allok = !(invalidTabs && invalidTabs.length > 0)
  const apiips_array = deploy.apiips ? deploy.apiips.split(',').filter(x => x.trim()) : []
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
    ...(cluster.autoscale && { agentCountMax: cluster.maxCount }),
    ...(cluster.osDiskType === "Managed" && { osDiskType: cluster.osDiskType, ...(cluster.osDiskSizeGB > 0 && { osDiskSizeGB: cluster.osDiskSizeGB }) }),
    ...(net.vnet_opt === "custom" && {
         custom_vnet: true,
         ...serviceparams,
         ...aksvnetparams,
         ...(net.nsg !== defaults.net.nsg && {CreateNetworkSecurityGroups: net.nsg}),
         ...(net.nsg && net.nsgFlowLogs !== defaults.net.nsgFlowLogs && {CreateNetworkSecurityGroupFlowLogs: net.nsgFlowLogs}),
         ...(net.bastion !== defaults.net.bastion && {bastion: net.bastion}),
         ...(net.bastion && defaults.net.bastionSubnetAddressPrefix !== net.bastionSubnetAddressPrefix && {bastionSubnetAddressPrefix: net.bastionSubnetAddressPrefix})
       }),
    ...(net.vnet_opt === "byo" && { byoAKSSubnetId: net.byoAKSSubnetId, ...serviceparams }),
    ...(net.vnet_opt === "byo" && addons.ingress === 'appgw' && { byoAGWSubnetId: net.byoAGWSubnetId }),
    ...(cluster.enable_aad && { enable_aad: true, ...(cluster.enableAzureRBAC === false && cluster.aad_tenant_id && { aad_tenant_id: cluster.aad_tenant_id }) }),
    ...(cluster.enable_aad && cluster.AksDisableLocalAccounts !== defaults.cluster.AksDisableLocalAccounts && { AksDisableLocalAccounts: cluster.AksDisableLocalAccounts }),
    ...(cluster.enable_aad && cluster.enableAzureRBAC && { enableAzureRBAC: true, ...(deploy.clusterAdminRole && { adminPrincipalId: "$(az ad signed-in-user show --query id --out tsv)" }) }),
    ...(addons.registry !== "none" && {
        registries_sku: addons.registry,
        ...(deploy.acrPushRole && { acrPushRolePrincipalId: "$(az ad signed-in-user show --query id --out tsv)"}),
        ...(cluster.apisecurity === "private" && ((addons.ingress === "contour")  || (addons.ingress !== "none" && addons.dns &&  addons.dnsZoneId)) &&  { imageNames: [
          ...(addons.ingress === "contour" ?  Object.keys(dependencies['bitnami/contour']['8_0_2'].images).map(i => `${dependencies['bitnami/contour']['8_0_2'].images[i].registry}/${dependencies['bitnami/contour']['8_0_2'].images[i].repository}:${dependencies['bitnami/contour']['8_0_2'].images[i].tag}`) : []),
          ...(addons.ingress !== "none" && addons.dns &&  addons.dnsZoneId ? Object.keys(dependencies['externaldns']['1_9_0'].images).map(i => `${dependencies['externaldns']['1_9_0'].images[i].registry}/${dependencies['externaldns']['1_9_0'].images[i].repository}:${dependencies['externaldns']['1_9_0'].images[i].tag}`) : [])
        ]})
    }),
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
    ...(addons.csisecret === 'akvNew' && { createKV: true, ...(deploy.kvCertSecretRole && { kvOfficerRolePrincipalId: "$(az ad signed-in-user show --query id --out tsv)"}) }),
    ...(addons.csisecret !== "none" && addons.kvPollInterval !== defaults.addons.kvPollInterval  && { kvPollInterval: addons.kvPollInterval }),
    ...(addons.fluxGitOpsAddon !== defaults.addons.fluxGitOpsAddon && { fluxGitOpsAddon: addons.fluxGitOpsAddon})
  }

  const preview_params = {
    ...(net.vnet_opt === "default" && net.aksOutboundTrafficType === 'managedNATGateway' && {
      ...(net.aksOutboundTrafficType !== defaults.net.aksOutboundTrafficType && {aksOutboundTrafficType: net.aksOutboundTrafficType}),
      ...(net.natGwIpCount !== defaults.net.natGwIpCount && {natGwIpCount: net.natGwIpCount}),
      ...(net.natGwIdleTimeout !== defaults.net.natGwIdleTimeout && {natGwIdleTimeout: net.natGwIdleTimeout})
    }),
    ...(net.vnet_opt === "custom" && net.aksOutboundTrafficType === 'userAssignedNATGateway' && {
      ...({createNatGateway: true}),
      ...(net.aksOutboundTrafficType !== defaults.net.aksOutboundTrafficType && {aksOutboundTrafficType: net.aksOutboundTrafficType}),
      ...(net.natGwIpCount !== defaults.net.natGwIpCount && {natGwIpCount: net.natGwIpCount}),
      ...(net.natGwIdleTimeout !== defaults.net.natGwIdleTimeout && {natGwIdleTimeout: net.natGwIdleTimeout})
    }),
    ...(net.vnet_opt === "byo" && {
      ...(net.aksOutboundTrafficType !== defaults.net.aksOutboundTrafficType && {aksOutboundTrafficType: net.aksOutboundTrafficType})
    }),
    ...(net.vnet_opt === "custom" && net.vnetprivateend && {
      ...(addons.registry !== "none" && {
        ...(addons.acrPrivatePool !== defaults.addons.acrPrivatePool && {acrPrivatePool: addons.acrPrivatePool}),
        ...(addons.acrPrivatePool && defaults.net.acrAgentPoolSubnetAddressPrefix !== net.acrAgentPoolSubnetAddressPrefix && {acrAgentPoolSubnetAddressPrefix: net.acrAgentPoolSubnetAddressPrefix})
      })
    }),
    ...(urlParams.getAll('feature').includes('defender') && cluster.DefenderForContainers !== defaults.cluster.DefenderForContainers && { DefenderForContainers: cluster.DefenderForContainers })
  }

  const post_params = {
    ...(addons.networkPolicy !== 'none' && addons.denydefaultNetworkPolicy && { denydefaultNetworkPolicy: addons.denydefaultNetworkPolicy}),
    ...(addons.ingress !== "none" && {

        ...((addons.ingress === "contour" || addons.ingress === "nginx") && {
          ingress: addons.ingress,
          ...(addons.ingressEveryNode && { ingressEveryNode: addons.ingressEveryNode})
        }),
        ...(addons.dns &&  addons.dnsZoneId && {
            dnsZoneId: addons.dnsZoneId,
            KubeletId: `$(az aks show -g ${deploy.rg} -n ${aks} --query identityProfile.kubeletidentity.clientId -o tsv)`,
            TenantId: `$(az account show --query tenantId -o tsv)`
          }),
        ...( addons.certMan && {
          ingress: addons.ingress,
          certEmail: addons.certEmail
        })
      }),
    ...(cluster.apisecurity === "private" && (addons.ingress === "contour" || (addons.ingress !== "none" && addons.dns &&  addons.dnsZoneId) ) && {
        acrName: `$(az acr list -g ${deploy.rg} --query [0].name -o tsv)`
    }),
    ...(addons.monitor === "oss" && {
      monitor: addons.monitor,
      ...(addons.ingress !== "none" && {
        ingress: addons.ingress,
        ...(addons.enableMonitorIngress && { enableMonitorIngress: addons.enableMonitorIngress})
      })
    }),
  }

  const params2tf = p => Object.keys(p).map(k => {
    return `    ${k} = ${k.toLowerCase().endsWith('principalid') ? '{value=data.azurerm_client_config.current.client_id}' : `{value=var.${k}}`}\n`
  }).join('')

  const params2TfVar = p => Object.keys(p).filter(p => p !== 'adminPrincipalId' &&
        p !== 'acrPushRolePrincipalId' &&
        p !== 'kvOfficerRolePrincipalId').map(k => {

    const val = p[k]

    switch (typeof val) {
      case "string":
        return ` \nvariable ${k} {\n  type=string\n  default="${val}"\n}`
      case "number":
        return ` \nvariable ${k} {\n  type=number\n  default=${val}\n}`
      case "boolean":
        return ` \nvariable ${k} {\n  type=bool\n  default=${val}\n}`
      default:
        const arrayVal = Array.isArray(val) ? JSON.stringify(val) : val
        console.log(k + ' ' + val + ' '  + typeof val);
        return ` \nvariable ${k} {\n  default=${arrayVal}\n}`
    }

  }).join('')

  const params2file = p => Object.keys(p).filter(p => p !== 'adminPrincipalId' &&
        p !== 'acrPushRolePrincipalId' &&
        p !== 'kvOfficerRolePrincipalId').reduce((a, c) => { return { ...a, parameters: { ...a.parameters, [c]: { value: p[c] } } } }, {
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {}
  })

  const finalParams = { ...params, ...(!deploy.disablePreviews && preview_params) }

  const post_deploycmd =  `\n\n# Deploy charts into cluster\n` +
  (deploy.selectedTemplate === "local" ? `bash .${ cluster.apisecurity === "private" ? '' : '/postdeploy/scripts'}/postdeploy.sh` : `curl -sL ${deploy.templateVersions.length >1 && deploy.templateVersions.find(t => t.key === deploy.selectedTemplate).post_url}  | bash -s --`) + ` ${deploy.selectedTemplate === 'local' ? ( cluster.apisecurity === "private" ? ' -r .' : '') : `-r ${deploy.templateVersions.length >1 && deploy.templateVersions.find(t => t.key === deploy.selectedTemplate).base_download_url}`}` +
  Object.keys(post_params).map(k => {
    const val = post_params[k]
    const targetVal = Array.isArray(val) ? JSON.stringify(JSON.stringify(val)) : val
    return ` \\\n\t-p ${k}=${targetVal}`
  }).join('')

  const post_deploystr = cluster.apisecurity !== "private" ?
    '# Get credentials for your new AKS cluster & login (interactive)\n' +
    `az aks get-credentials -g ${deploy.rg} -n ${aks}\n` +
    'kubectl get nodes' +
    post_deploycmd
    :
    '# Private cluster, so use command invoke\n' +
    `az aks command invoke -g ${deploy.rg} -n ${aks}  --command "` +
    post_deploycmd.replaceAll('"', '\\"') +
    `\n"${deploy.selectedTemplate === "local" ? ' --file ./postdeploy/scripts/postdeploy.sh --file ./postdeploy/helm/Az-CertManagerIssuer-0.3.0.tgz --file ./postdeploy/k8smanifests/networkpolicy-deny-all.yml --file ./helper/src/dependencies.json' : ''}`

  const deploycmd =
    `# Create Resource Group\n` +
    `az group create -l ${deploy.location} -n ${deploy.rg}\n\n` +
    `# Deploy template with in-line parameters\n` +
    `az deployment group create -g ${deploy.rg}  ${deploy.selectedTemplate === "local" ? '--template-file ./bicep/main.bicep' : `--template-uri ${deploy.templateVersions.length >1 && deploy.templateVersions.find(t => t.key === deploy.selectedTemplate).main_url}` } --parameters` +
    Object.keys(finalParams).map(k => {
      const val = finalParams[k]
      const targetVal = Array.isArray(val) ? JSON.stringify(JSON.stringify(val)) : val
      return ` \\\n\t${k}=${targetVal}`
    }).join('') + '\n\n' + (Object.keys(post_params).length >0 ? post_deploystr : '')


  const deployTfcmd = `#download the *.tf files and run these commands to deploy using terraform\n#for more AKS Construction samples of deploying with terraform, see https://aka.ms/aksc/terraform\n\nterraform fmt\nterraform init\nterraform validate\nterraform plan -out main.tfplan\nterraform apply main.tfplan\nterraform output`

  const deployTfProviders =
    `#providers.tf\n\n` +
    `terraform {\n` +
    `  required_version = ">=1.1.9"\n` +
    `  required_providers {\n` +
    `    azurerm = {\n` +
    `      source = "hashicorp/azurerm"\n` +
    `      version = "~>3.6"\n` +
    `    }\n` +
    `  }\n` +
    `}\n\n` +
    `provider "azurerm" {\n` +
    `  features {}\n` +
    `}`
  const deployTfMain =
    `#main.tf\n\n` +
    `data "http" "aksc_release" {\n` +
    `  url = "${deploy.templateVersions.length >1 && deploy.templateVersions.find(t => t.key === deploy.selectedTemplate).main_url}"\n`+
    `  request_headers = {\n` +
    `    Accept = "application/json"\n` +
    `    User-Agent = "request module"\n` +
    `  }\n` +
    `}\n\n` +
    `data "azurerm_client_config" "current" {}\n\n` +
    `resource "azurerm_resource_group" "rg" {\n` +
    `  name = var.resourceGroupName\n`+
    `  location = var.location\n` +
    `}\n\n` +
    `resource "azurerm_resource_group_template_deployment" "aksc_deploy" {\n` +
    `  name = "AKS-C"\n` +
    `  resource_group_name = azurerm_resource_group.rg.name\n` +
    `  deployment_mode = "Incremental"\n` +
    `  template_content = data.http.aksc_release.body\n` +
    `  parameters_content = jsonencode({\n` +
    params2tf(finalParams) +
    `  })\n` +
    `}`

  const deployTfVar = `#variables.tf\n\nvariable resourceGroupName {\n  type=string\n  default="${deploy.rg}"\n}\nvariable location {\n  type=string\n  default="${deploy.location}"\n}` + params2TfVar(finalParams)
  const deployTfOutput = `#outputs.tf\n\noutput aksClusterName {\n  value = jsondecode(azurerm_resource_group_template_deployment.aksc_deploy.output_content).aksClusterName.value\n  description = "The name of the AKS cluster."\n}`

  const param_file = JSON.stringify(params2file(finalParams), null, 2).replaceAll('\\\\\\', '').replaceAll('\\\\\\', '')

/*
  const appgw_workaround =
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
    (net.vnet_opt === "byo" && addons.ingress === 'appgw' ? `
APPGW_IDENTITY="$(az network application-gateway show -g ${deploy.rg} -n ${agw} --query 'keys(identity.userAssignedIdentities)[0]' -o tsv)"
az role assignment create --role "Managed Identity Operator" --assignee-principal-type ServicePrincipal --assignee-object-id $AKS_AGIC_IDENTITY_ID --scope $APPGW_IDENTITY
` : '')
*/

  const ghOrg = deploy.githubrepo.replace(/.*com\//, "").replace(/\/.*/, '')
  const ghRepo = deploy.githubrepo.replace(/.*\//, '')
  console.log (`deploy.deployItemKey=${deploy.deployItemKey}`)
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

          <TextField label="Current IP Address" prefix="IP or Cidr , separated" errorMessage={getError(invalidArray, 'apiips')} onChange={(ev, val) => updateFn("apiips", val)} value={deploy.apiips || ''} required={cluster.apisecurity === "whitelist"} />


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

      <Separator styles={{ root: { marginTop: '30px !important' } }}><div style={{ display: "flex", alignItems: 'center', }}><b style={{ marginRight: '10px' }}>Deploy Cluster</b><Image src="./bicep.png" alt="Built with bicep" /> <p style={{ marginLeft: '10px' }}>powered by Bicep</p></div> </Separator>

      {Object.keys(preview_params).length > 0 &&
        <MessageBar messageBarType={MessageBarType.warning}>
          <Text >Your deployment contains Preview features: <b>{Object.keys(preview_params).join(', ')}</b>, Ensure you have registered for these previews, and have installed the <b>'az extension add --name aks-preview'</b>  before running the script, <Link target="_pv" href="https://github.com/Azure/AKS/blob/master/previews.md">see here</Link>, or disable preview features here</Text>
          <Toggle styles={{ root: { marginTop: "10px" } }} onText='preview enabled' offText="preview disabled" checked={!deploy.disablePreviews} onChange={(ev, checked) => updateFn("disablePreviews", !checked)} />
        </MessageBar>

      }


      <Pivot selectedKey={deploy.deployItemKey}  onLinkClick={({props}) => updateFn('deployItemKey', props.itemKey)}>

        <PivotItem headerText="Command Line" itemKey="deployArmCli" itemIcon="PasteAsCode" >

          <Stack horizontal horizontalAlign="space-between" styles={{root: { width: '100%', marginTop: '10px'}}}>
            <Stack.Item>
              <Label >Commands to deploy your fully operational environment</Label>
              <Text>
                Requires <Link target="_bl" href="https://docs.microsoft.com/cli/azure/install-azure-cli">AZ CLI (2.37.0 or greater)</Link>, or execute in the <Link target="_cs" href="http://shell.azure.com/">Azure Cloud Shell</Link>.
              </Text>
            </Stack.Item>

            <Stack.Item  align="end">
              <Stack horizontal tokens={{childrenGap: 5}}>
              <Dropdown
                    label='Template Version'
                    disabled={process.env.REACT_APP_TEMPLATERELEASE !== undefined}
                    selectedKey={deploy.selectedTemplate}
                    onChange={(ev, { key }) => updateFn('selectedTemplate', key)}
                    options={deploy.templateVersions}
                    styles={{ dropdown: { width: 200 } }}
                  />
              </Stack>
            </Stack.Item>
          </Stack>

          <CodeBlock lang="shell script"  error={allok ? false : 'Configuration not complete, please correct the tabs with the warning symbol before running'} deploycmd={deploycmd} testId={'deploy-deploycmd'}/>

          { urlParams.toString() !== "" &&
            <Text variant="medium">Not ready to deploy? Bookmark your configuration : <a href={"?" + urlParams.toString()}>here</a></Text>
          }
        </PivotItem>

        <PivotItem headerText="Github CI/CD" itemKey="github" itemIcon="ConfigurationSolid">
            <Stack horizontal>
              <Stack.Item>
                <Stack>

                <Label key="post-label" style={{marginTop: '10px'}}>Create Service Principle github will use to deploy to Azure</Label>
                <Text>Run this code block to create the Service Principle, provide it the permissions needed to run the deployment, then It will create the secrets in your application repository</Text>
                <Separator></Separator>
                <Text>
                  * Requires <Link target="_gh" href="https://github.com/cli/cli">GitHub CLI</Link>, or execute in the <Link target="_cs" href="http://shell.azure.com/">Azure Cloud Shell</Link>.
                </Text>
                </Stack>
              </Stack.Item>
              <Stack.Item>
                 <TextField label="Application github Repo URL" onChange={(ev, val) => updateFn('githubrepo', val)} required errorMessage={getError(invalidArray, 'githubrepo')} value={deploy.githubrepo} />
                 <TextField label="Application branch" onChange={(ev, val) => updateFn('githubrepobranch', val)} required errorMessage={getError(invalidArray, 'githubrepobranch')} value={deploy.githubrepobranch} />
              </Stack.Item>
            </Stack>

            <CodeBlock key="github-auth" lang="shell script"  error={allok ? false : 'Configuration not complete, please correct the tabs with the warning symbol before running'} deploycmd={`# Create resource group, and an identity with contributor access that github can federate
az group create -l WestEurope -n ${deploy.rg}

app=($(az ad app create --display-name ${ghRepo} --query "[appId,id]" -o tsv | tr ' ' "\\n"))
spId=$(az ad sp create --id \${app[0]} --query id -o tsv )
subId=$(az account show --query id -o tsv)

az role assignment create --role owner --assignee-object-id  $spId --assignee-principal-type ServicePrincipal --scope /subscriptions/$subId/resourceGroups/${deploy.rg}
${addons.dnsZoneId ? `az role assignment create --role owner --assignee-object-id  $spId --assignee-principal-type ServicePrincipal --scope ${addons.dnsZoneId.replace(/\/providers.*/, '')}`:'' }

# Create a new federated identity credential
az rest --method POST --uri "https://graph.microsoft.com/beta/applications/\${app[1]}/federatedIdentityCredentials" --body "{\\"name\\":\\"${ghRepo}-${deploy.githubrepobranch}-gh\\",\\"issuer\\":\\"https://token.actions.githubusercontent.com\\",\\"subject\\":\\"repo:${ghOrg}/${ghRepo}:ref:refs/heads/${deploy.githubrepobranch}\\",\\"description\\":\\"Access to branch ${deploy.githubrepobranch}\\",\\"audiences\\":[\\"api://AzureADTokenExchange\\"]}"

# Set Secrets
gh secret set --repo ${deploy.githubrepo} AZURE_CLIENT_ID -b \${app[0]}
gh secret set --repo ${deploy.githubrepo} AZURE_TENANT_ID -b $(az account show --query tenantId -o tsv)
gh secret set --repo ${deploy.githubrepo} AZURE_SUBSCRIPTION_ID -b $subId
gh secret set --repo ${deploy.githubrepo} USER_OBJECT_ID -b $spId
`}/>

            <Label>To run te Github reusable workflow</Label>
            <Text style={{marginTop: '20px'}}>Add the following content to a file in your repos <code>.github/workflows</code> folder to call the AKS-Construction reusable workflow (this example creates a manually triggered Action)</Text>
            <CodeBlock  lang="github actions"  deploycmd={`name: Deploy AKS-Construction

on:
  workflow_dispatch:

jobs:
  reusable_workflow_job:
    uses: Azure/AKS-Construction/.github/workflows/reusable.yml@main
    with:
      rg: ${deploy.rg}
      resourceName: ${finalParams.resourceName}
      templateParams: "${Object.keys(finalParams).map(k => {
          const val = finalParams[k]
          const targetVal = k.endsWith('PrincipalId')? '_USER_OBJECT_ID_' : ( Array.isArray(val) ? JSON.stringify(JSON.stringify(val)) : val)
          return `${k}=${targetVal}`
      }).join(' ')}"` +
      (Object.keys(post_params).length >0 ? (cluster.apisecurity === "private" ? '\n      postScriptInvokeCommand: true' : '') +  `
      postScriptParams: "${Object.keys(post_params).filter(k => k !== 'KubeletId' && k !== 'TenantId').map(k => `${k}=${post_params[k]}`).join(',')}"` : '') + `
    secrets:
      AZURE_CLIENT_ID: \${{ secrets.AZURE_CLIENT_ID }}
      AZURE_TENANT_ID: \${{ secrets.AZURE_TENANT_ID }}
      AZURE_SUBSCRIPTION_ID: \${{ secrets.AZURE_SUBSCRIPTION_ID }}
      USER_OBJECT_ID: \${{ secrets.USER_OBJECT_ID }}
`}/>

            <Separator styles={{root: {marginTop: '20px'}}} ><div style={{ display: "flex", alignItems: 'center', }}><b style={{ marginRight: '10px' }}>Cleanup / Reruns</b></div> </Separator>

            <Label>The Create Service Principlal script is not re-runnable, so to clean up the Service Principal and federated identity credential, run the following</Label>
            <CodeBlock  lang="github actions"  deploycmd={`rmId=($(az ad app list --display-name ${ghRepo} --query '[[0].appId,[0].id]' -o tsv))
az rest -m DELETE  -u "https://graph.microsoft.com/beta/applications/\${rmId[1]}/federatedIdentityCredentials/$(az rest -m GET -u https://graph.microsoft.com/beta/applications/\${rmId[1]}/federatedIdentityCredentials --query value[0].id -o tsv)"
az ad sp delete --id $(az ad sp show --id \${rmId[0]} --query id -o tsv)
`}/>
        </PivotItem>

        <PivotItem headerText="Terraform" itemKey="deployTf" itemIcon="FileCode">
          <Stack horizontal horizontalAlign="space-between" styles={{root: { width: '100%', marginTop: '10px'}}}>
            <Stack.Item>
              <Label >Commands to deploy your fully operational environment</Label>
              <Text>
                Requires Terraform, or execute in the <Link target="_cs" href="http://shell.azure.com/">Azure Cloud Shell</Link>.
              </Text>
            </Stack.Item>

            <Stack.Item  align="end">
              <Stack horizontal tokens={{childrenGap: 5}}>
              <Dropdown
                    label='Template Version'
                    disabled={process.env.REACT_APP_TEMPLATERELEASE !== undefined}
                    selectedKey={deploy.selectedTemplate}
                    onChange={(ev, { key }) => updateFn('selectedTemplate', key)}
                    options={deploy.templateVersions}
                    styles={{ dropdown: { width: 200 } }}
                  />
              </Stack>
            </Stack.Item>
          </Stack>

          <CodeBlock deploycmd={deployTfcmd} testId={'deploy-deployTfcmd'} lang="bash"/>
          <CodeBlock deploycmd={deployTfProviders} testId={'deploy-deployTfProviders'} lang="terraform" filename="providers.tf" />
          <CodeBlock deploycmd={deployTfMain} testId={'deploy-deployTfMain'} lang="terraform" filename="main.tf" />
          <CodeBlock deploycmd={deployTfVar} testId={'deploy-deployTfVar'} lang="terraform" filename="variables.tf" />
          <CodeBlock deploycmd={deployTfOutput} testId={'deploy-deployTfOut'} lang="terraform" filename="outputs.tf" />

        </PivotItem>

        <PivotItem headerText="Raw Parameters File" itemKey="params"  itemIcon="FileSymlink">

          <TextField value={param_file} rows={param_file.split(/\r\n|\r|\n/).length + 1} readOnly={true} label="Parameter file" styles={{ root: { fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace!important' }, field: { backgroundColor: 'lightgrey', lineHeight: '21px' } }} multiline  >
          </TextField>

        </PivotItem>


      </Pivot>

    </Stack>
  )
}