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
    ...(cluster.autoscale && { agentCountMax: cluster.maxCount }),
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
    ...(addons.azurepolicy !== "none" && { azurepolicy: addons.azurepolicy }),
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

  const deploycmd =
    `# Create Resource Group \n` +
    `az group create -l ${deploy.location} -n ${deploy.rg} \n\n` +
    `# Deploy template with in-line parameters \n` +
    `az deployment group create -g ${deploy.rg}  ${deploy.templateVersions ? `--template-uri ${deploy.templateVersions.find(t => t.key === deploy.selectedTemplate).url}` : '--template-file ./bicep/main.bicep' } --parameters` + params2CLI(finalParams)
  const param_file = JSON.stringify(params2file(finalParams), null, 2).replaceAll('\\\\\\', '').replaceAll('\\\\\\', '')


  const post_script = `sh ${process.env.REACT_APP_BASE_URL || '.'}${cluster.apisecurity === "private" && !process.env.REACT_APP_BASE_URL ? '' : '/postdeploy/scripts'}/postdeploy.sh -g ${deploy.rg} -n ${aks} ${process.env.REACT_APP_BASE_URL ? `-r ${process.env.REACT_APP_BASE_URL}` : ''} -p vnet_opt=${net.vnet_opt}` +
    (addons.networkPolicy !== 'none' && addons.denydefaultNetworkPolicy ? `,denydefaultNetworkPolicy=${addons.denydefaultNetworkPolicy}` : '') +
    (addons.ingress == "appgw" ? `,agw=agw-${deploy.clusterName}` : '') +
    (addons.ingress !== "none" ? `,ingress=${addons.ingress}` : '') +
    (cluster.apisecurity !== "none" ? `,apisecurity=${cluster.apisecurity}` : '') +
    (cluster.monitor !== "none" ? `,monitor=${addons.monitor}` : '') +
    (addons.ingressEveryNode ? `,ingressEveryNode=${addons.ingressEveryNode}` : '') +
    (addons.ingress !== "none" && addons.dns &&  addons.dnsZoneId ? `,dnsZoneId=${addons.dnsZoneId}` : '') +
    (addons.ingress !== 'none' && addons.certMan ? `,certMan=${addons.certMan}` : '')

  const postscript = (cluster.apisecurity !== "private" ? `
# ------------------------------------------------
#         Get credentials for your new AKS cluster
az aks get-credentials -g ${deploy.rg} -n ${aks}
${post_script}` : `
# ------------------------------------------------
#           Private cluster, so use command invoke
az aks command invoke -g ${deploy.rg} -n ${aks}  --command "
${post_script}
"  ${process.env.REACT_APP_BASE_URL ? '' : '--file  ./postdeploy/helm/Az-CertManagerIssuer-0.3.0.tgz'}  `)

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