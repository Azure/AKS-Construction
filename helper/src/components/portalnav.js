
import React, { useState, useEffect } from 'react';
import { CommandBarButton, Image, ThemeProvider, Link, Toggle, TooltipHost, Pivot, PivotItem, Icon, Separator, Stack, Text, ChoiceGroup, Modal, IconButton } from '@fluentui/react';
import { AzureThemeLight, AzureThemeDark } from '@fluentui/azure-themes';
import { mergeStyles, mergeStyleSets } from '@fluentui/merge-styles';

import { Presets, SeparatorStyle } from './presets'

import NetworkTab from './networkTab'
import AddonsTab from './addonsTab'
import ClusterTab, { VMs } from './clusterTab'
import DeployTab from './deployTab'
import AppsTab from './appsTab'

import { appInsights } from '../index.js'
import { initializeIcons } from '@fluentui/react/lib/Icons';
initializeIcons();


function useAITracking(componentName, key) {

  useEffect(() => {
    const start = new Date(), pagename = `${componentName}.${key}`
    appInsights.startTrackPage(pagename)
    return () => {
      console.log(`exit screen ${key} ${(new Date() - start) / 1000}`)
      appInsights.stopTrackPage(pagename,
        { 'Component Name': componentName, 'Navigation': key },
        { mounttime: (new Date() - start) / 1000 })
    };
  }, [componentName, key])

}

const titleClass = mergeStyleSets({ "display": "inline-block", "marginLeft": "10px", "verticalAlign": "top" })

function Header({ presets, setPresets, selectedPreset, featureFlag }) {


  return (
    <nav role="menubar">

      <div style={{ width: "100%" }}>

        <div style={{ display: "inline-block", padding: "11px 12px 0px" }}>
          <Link className="navbar-brand no-outline" >
            <Image src="aks.svg" height="33px" />
          </Link>
          <Text nowrap variant="xLarge" className={titleClass} >AKS Construction <span style={{ "color": "red" }}>Helper</span></Text>
          <Text className={titleClass} style={{ "marginTop": "6px", "marginLeft": "20px" }}>Documentation and CI/CD samples are in the <a href="https://github.com/Azure/AKS-Construction" target="_blank" rel="noopener noreferrer">GitHub Repository</a> and at the <a href="https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/app-platform/aks/landing-zone-accelerator" target="_blank" rel="noopener noreferrer">AKS Landing Zone Accelerator</a> docs</Text>
        </div>
        <div style={{ display: "inline-block", float: "right" }}>

          <CommandBarButton iconProps={{ iconName: presets[selectedPreset].icon }} menuProps={{
            items: Object.keys(presets).map(p => {
              return {
                key: p,
                text: presets[p].title,
                disabled: presets[p].disabled,
                iconProps: { iconName: presets[p].icon },
                onClick: () => setPresets(p)
              }
            })

          }} text={presets[selectedPreset].title} disabled={false} checked={true}
            styles={{ root: { "vertical-align": "top", padding: "11px 12px 13px", border: "2px solid transparent", background: "transparent" }, label: { color: "#0067b8", fontWeight: "600", fontSize: "15px", lineHeight: "1.3" } }} />


        </div>

      </div>
    </nav>
  )
}

function Header2({ presets, setPresets, selectedPreset, featureFlag }) {
  return (
    <Stack horizontal tokens={{ childrenGap: 10 }}>
      <img id="aksLogo" src="aks.svg" alt="Kubernetes Service" style={{}}></img>
      <Stack tokens={{ padding: 10, maxWidth: 700 }} className="intro">
        <Text variant="xLarge">AKS Construction helper</Text>
        <Text variant="large" styles={{ root: { marginBottom: '6px' } }}>Generate Azure deployment assets by providing your requirements to quickly create a full operational environment from best practice guidance.</Text>
        <Text variant="medium" >Documentation and CI/CD samples are in the <a href="https://github.com/Azure/AKS-Construction" target="_blank" rel="noopener noreferrer">GitHub Repository</a></Text>
      </Stack>
      <Stack grow={1} tokens={{ padding: 10 }} >

        <ChoiceGroup
          defaultSelectedKey={selectedPreset}
          options={Object.keys(presets).map(p => { return { key: p, text: presets[p].title, disabled: presets[p].disabled, iconProps: { iconName: presets[p].icon } } })}
          onChange={(ev, { key }) => setPresets(key)}
        >
        </ChoiceGroup>
      </Stack>
    </Stack>
  )
}



/*
 *   PortalNav
 *   Main Screen of the Helper
 *   All validation should live here
 */
export default function PortalNav({ config }) {

  console.log(`PortalNav: ${JSON.stringify(Object.keys(config))}`)

  const { tabLabels, defaults, presets } = config
  const [pivotkey, setPivotkey] = useState(Object.keys(tabLabels)[0])

  useAITracking("PortalNav", tabLabels[pivotkey])

  const [urlParams, setUrlParams] = useState(new URLSearchParams(window.location.search))
  const [invalidArray, setInvalidArray] = useState(() => Object.keys(defaults).reduce((a, c) => { return { ...a, [c]: [] } }, {}))

  const featureFlag = urlParams.getAll('feature')
  const defaultPreset = urlParams.get('preset') || 'defaultOps'

  // The selected cards within the sections for the chosen preset, for example { "ops": "normal", "secure": "high" }
  const [selected, setSelected] = useState(() => {
    return {
      preset: defaultPreset,
      values: presets[defaultPreset].sections.reduce((a, s) => {
        return { ...a, [s.key]: urlParams.has(s.key) ? urlParams.get(s.key) : s.cards.find(c => c.default).key }
      }, {})
    }
  })

  // The sections array within the selected preset, for example [{"key": "ops"...}, {"key": "secure"...}]
  const { sections } = presets[selected.preset]

  // The tabValues, for example { "deploy": { "clusterName": "az234"}}
  const [tabValues, setTabValues] = useState(() => {
    const clusterName = `az-k8s-${(Math.floor(Math.random() * 900000) + 100000).toString(36)}`

    // Apply selected presets to tab values
    const tabApplySections = Object.keys(selected.values).reduce((acc, curr) =>
      updateTabValues(acc, sections, curr, selected.values[curr])
      , defaults)

    // Apply dynamic presets to tab values
    const dynamicApplySections = {
      ...tabApplySections,
      deploy: {
        ...tabApplySections.deploy,
        clusterName,
        rg: `${clusterName}-rg`
      }
    }
    // Apply url params to tab values
    const urlApplySections = Object.keys(dynamicApplySections).reduce((acct, currt) => {
      return {
        ...acct,
        [currt]: Object.keys(dynamicApplySections[currt]).reduce((accv, currv) => {
          const urlname = `${currt}.${currv}`
          let valres = dynamicApplySections[currt][currv]
          if (urlParams.has(urlname)) {
            let val = urlParams.get(urlname)
            valres = val === "true" ? true : val === "false" ? false : isNaN(val) ? val : parseInt(val)
          }
          return { ...accv, [currv]: valres }
        }, {})
      }
    }, {})

    return urlApplySections
  })


  function updateTabValues(currenttabValues, sections, sectionKey, cardKey) {
    console.log(`updateTabValues`)
    const card_values = sections.find(s => s.key === sectionKey).cards.find(c => c.key === cardKey).values
    console.log(`updateTabValues: sectionKey=${sectionKey} cardKey=${cardKey}, setting tabs ${JSON.stringify(Object.keys(card_values))}`)
    return Object.keys(card_values).reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: {
          ...acc[curr],
          // resolve conditional params
          ...Object.keys(card_values[curr]).reduce((a, c) => {
            const val = card_values[curr][c]
            //console.log (`updateTabValues: looking for conditional value=${JSON.stringify(val)}`)
            // if value is array with at least 1 element with a object that has a properly 'set'
            const targetVal = Array.isArray(val) && val.length > 0 && typeof val[0] === 'object' && val[0].hasOwnProperty("set") ?
              val.reduce((a, c) => a === undefined ? (c.page && c.field ? (currenttabValues[c.page][c.field] === c.value ? c.set : undefined) : c.set) : a, undefined)
              :
              val
            //console.log(`updateTabValues: setting tab=${curr}, field=${c} val=${JSON.stringify(val)} targetVal=${JSON.stringify(targetVal)}`)
            return { ...a, [c]: targetVal }
          }, {})
        }
      }
    }, currenttabValues)
  }

  function updateSelected(sectionKey, cardKey) {
    console.log("Update Selected Fired " + sectionKey + " - " + cardKey)

    setUrlParams((currentUrlParams) => {

      currentUrlParams.set(sectionKey, cardKey)
      return currentUrlParams
    })

    console.log(`updateSelected: sectionKey=${sectionKey} cardKey=${cardKey}`)
    setSelected({ preset: selected.preset, values: { ...selected.values, [sectionKey]: cardKey } })
    setTabValues(currentTabValues => updateTabValues(currentTabValues, sections, sectionKey, cardKey))

    //window.history.replaceState(null, null, "?"+urlParams.toString())
  }


  useEffect(() => {
    if (!urlParams.has('deploy.apiips')) {
      fetch('https://api.ipify.org?format=json').then(response => {
        return response.json();
      }).then((res) => {
        console.log(`useEffect Get IP`)
        setTabValues(currentTabValues => {
          return {
            ...currentTabValues,
            deploy: {
              ...currentTabValues.deploy,
              apiips: `${res.ip}/32`
            }
          }
        })

      }).catch((err) => console.error('Problem fetching my IP', err))
    }
  }, [])

  useEffect(() => {
    fetch('https://api.github.com/repos/Azure/Aks-Construction/releases').then(response => {
      return response.json();
    }).then((res) => {
      console.log(`useEffect Get template versions`)
      const releases = res.filter(rel => rel.assets.find(a => a.name === 'main.json') && rel.assets.find(a => a.name === 'postdeploy.sh') && rel.assets.find(a => a.name === 'dependencies.json') && rel.draft === false).map((rel, i) => {
        return {
          key: rel.tag_name,
          text: `${rel.tag_name}${i === 0 ? ' (latest)' : ''}`,
          main_url: rel.assets.find(a => a.name === 'main.json').browser_download_url,
          post_url: rel.assets.find(a => a.name === 'postdeploy.sh').browser_download_url,
          base_download_url: rel.assets.find(a => a.name === 'main.json').browser_download_url.replace('/main.json', '')
        }
      }).concat(defaults.deploy.templateVersions)
      //console.log (releases)
      setTabValues(currentTabValues => {
        return {
          ...currentTabValues,
          deploy: {
            ...currentTabValues.deploy,
            ...(process.env.REACT_APP_TEMPLATERELEASE && { selectedTemplate: process.env.REACT_APP_TEMPLATERELEASE }),
            templateVersions: releases
          }
        }
      })

    }).catch((err) => console.error('Problem fetching my IP', err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function _handleLinkClick(item) {
    setPivotkey(item.props.itemKey)
  }

  function presetChanged(preset) {
    console.log(preset)

    setUrlParams((currentUrlParams) => {
      currentUrlParams.set('preset', preset)
      return currentUrlParams
    })

    setSelected({
      preset, values: presets[preset].sections.reduce((a, s) => {
        return { ...a, [s.key]: urlParams.has(s.key) ? urlParams.get(s.key) : s.cards.find(c => c.default).key }
      }, {})
    })

    // Apply selected presets to tab values
    const tabApplySections = Object.keys(selected.values).reduce((acc, curr) =>
      updateTabValues(acc, sections, curr, selected.values[curr]),
      defaults
    )

    //setTabValues(currentTabValues => updateTabValues(currentTabValues, sections, key, 'standard'))
  }

  function mergeState(tab, field, value, previewLink) {

    let updatevals
    if (typeof field === "string") {
      updatevals = { [field]: value }
      urlParams.set(`${tab}.${field}`, value)
    } else if (typeof field === "function") {
      updatevals = field(tabValues[tab])
      for (let nfield of Object.keys(updatevals)) {
        urlParams.set(`${tab}.${nfield}`, updatevals[nfield])
      }
    }

    //maintains the current config in querystring for easy bookmarking
    window.history.replaceState(null, null, "?" + urlParams.toString())

    setTabValues((p) => {
      return {
        ...p,
        [tab]: {
          ...p[tab],
          ...updatevals
        }
      }
    })
  }

  function getError(page, field) {
    return invalidArray[page].find(e => e.field === field)
  }

  function invalidFn(page, field, invalid, message) {
    const e = getError(page, field)
    if (!invalid && e) {
      setInvalidArray((prev) => { return { ...prev, [page]: prev[page].filter((e) => e.field !== field) } })
    } else if (invalid && !e) {
      setInvalidArray((prev) => { return { ...prev, [page]: prev[page].concat({ field, message }) } })
    }
  }

  const { deploy, cluster, net, addons } = tabValues

  console.log(`PortalNav: Evaluating configruation warnings...`)
  invalidFn('cluster', 'osDiskType', cluster.osDiskType === 'Ephemeral' && !VMs.find(i => i.key === cluster.vmSize).eph, 'The selected VM cache is not large enough to support Ephemeral. Select \'Managed\' or a VM with a larger cache')
  invalidFn('cluster', 'aad_tenant_id', cluster.enable_aad && cluster.use_alt_aad && cluster.aad_tenant_id.length !== 36, 'Enter Valid Directory ID')
  invalidFn('addons', 'registry', net.vnetprivateend && (addons.registry !== 'Premium' && addons.registry !== 'none'), 'Premium tier is required for Private Link, either select Premium, or disable Private Link')
  invalidFn('cluster', 'keyVaultKmsByoKeyId', cluster.keyVaultKms === "byoprivate" && !cluster.keyVaultKmsByoKeyId.match('https:\/\/[^]+.vault.azure.net/keys/[^ ]+/[^ ]+$'), 'Enter valid KeyVault Versioned Key ID (https://YOURVAULTNAME.vault.azure.net/keys/YOURKEYNAME/KEYVERSIONSTRING)')
  invalidFn('cluster', 'keyVaultKmsByoRG', cluster.keyVaultKms === "byoprivate" && !cluster.keyVaultKmsByoRG, 'Enter existing KeyVault Resource Group Name')
  invalidFn('addons', 'dnsZoneId', addons.dns && !addons.dnsZoneId.match('^/subscriptions/[^/ ]+/resourceGroups/[^/ ]+/providers/Microsoft.Network/(dnszones|privateDnsZones)/[^/ ]+$'), 'Enter valid Azure Public or Private DNS Zone resourceId')
  invalidFn('cluster', 'dnsApiPrivateZoneId', cluster.apisecurity === 'private' && cluster.privateClusterDnsMethod === 'privateDnsZone' && !cluster.dnsApiPrivateZoneId.match('^/subscriptions/[^/ ]+/resourceGroups/[^/ ]+/providers/Microsoft.Network/privateDnsZones/[^/ ]+.azmk8s.io$'), 'Enter valid Azure Private DNS Zone resourceId')
  invalidFn('addons', 'certEmail', addons.certMan && !addons.certEmail.match('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$'), 'Enter valid email for certificate generation')
  invalidFn('addons', 'kvId', addons.csisecret === "akvExist" && !addons.kvId.match('^/subscriptions/[^/ ]+/resourceGroups/[^/ ]+/providers/Microsoft.KeyVault/vaults/[^/ ]+$'), 'Enter valid Azure KeyVault resourceId')
  invalidFn('addons', 'appgw_privateIpAddress', addons.ingress === "appgw" && addons.appgw_privateIp && !addons.appgw_privateIpAddress.match('^(?:[0-9]{1,3}.){3}[0-9]{1,3}$'), 'Enter valid IP address')
  invalidFn('addons', 'appgwKVIntegration', addons.ingress === "appgw" && addons.appgwKVIntegration && addons.csisecret !== 'akvNew', 'KeyVault integration requires the \'CSI Secrets\' \'Yes, Provision a new KeyVault\' option to be selected')
  invalidFn('net', 'byoAKSSubnetId', net.vnet_opt === 'byo' && !net.byoAKSSubnetId.match('^/subscriptions/[^/ ]+/resourceGroups/[^/ ]+/providers/Microsoft.Network/virtualNetworks/[^/ ]+/subnets/[^/ ]+$'), 'Enter a valid Subnet Id where AKS nodes will be installed')
  invalidFn('net', 'byoAGWSubnetId', net.vnet_opt === 'byo' && addons.ingress === 'appgw' && !net.byoAGWSubnetId.match('^/subscriptions/[^/ ]+/resourceGroups/[^/ ]+/providers/Microsoft.Network/virtualNetworks/[^/ ]+/subnets/[^/ ]+$'), 'Enter a valid Subnet Id where Application Gateway is installed')
  invalidFn('net', 'vnet_opt', net.vnet_opt === "default" && (net.afw || net.vnetprivateend), 'Cannot use default networking of you select Firewall or Private Link')
  invalidFn('net', 'afw', net.afw && net.vnet_opt !== "custom",
    net.vnet_opt === "byo" ?
      'Please de-select, when using Bring your own VNET, configure a firewall as part of your own VNET setup, (in a subnet or peered network)'
      :
      'This template can only deploy Azure Firewall in single VNET with Custom Networking')
  invalidFn('net', 'aksOutboundTrafficType', (net.aksOutboundTrafficType === 'managedNATGateway' && net.vnet_opt !== "default") || (net.aksOutboundTrafficType === 'userAssignedNATGateway' && net.vnet_opt === "default"), 'When using Managed Nat Gateway, only default networking is supported. For other networking options, use Assigned NAT Gateway')
  invalidFn('deploy', 'apiips', cluster.apisecurity === 'whitelist' && deploy.apiips.length < 7, 'Enter an IP/CIDR, or select \'Public IP with no IP restrictions\' in the \'Cluster API Server Security\' section of the \'Cluster Details\' tab')
  invalidFn('deploy', 'clusterName', !deploy.clusterName || deploy.clusterName.match(/^[a-z0-9][_\-a-z0-9]+[a-z0-9]$/i) === null || deploy.clusterName.length > 19, 'Enter valid cluster name')

  invalidFn('deploy', 'githubrepo', deploy.deployItemKey === 'github' && (!deploy.githubrepo || !deploy.githubrepo.match('https://github.com/[^/ ]+/[^/ ]+$')), 'enter repo URL. eg: https://github.com/org/repo')
  invalidFn('deploy', 'githubrepobranch', deploy.deployItemKey === 'github' && !deploy.githubrepobranch, 'Please enter your application GitHub repo branch the can run the workflow')
  invalidFn('deploy', 'selectedTemplate', !deploy.templateVersions.find(t => t.key === deploy.selectedTemplate), `Invalid release name: ${deploy.selectedTemplate}, ensure all assests are attached`)


  function _customRenderer(page, link, defaultRenderer) {
    return (
      <span>
        {invalidArray[page].length > 0 &&
          <Icon iconName="Warning12" style={{ color: 'red' }} />
        }
        {defaultRenderer(link)}
      </span>
    );
  }

  const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const { semanticColors, palette } = dark ? AzureThemeDark : AzureThemeLight

  return (
    <ThemeProvider theme={{ semanticColors, palette }}>
      <main id="mainContent" className="wrapper">
        <Header presets={presets} selectedPreset={selected.preset} setPresets={presetChanged} featureFlag={featureFlag} />

        <Stack verticalFill styles={{ root: { width: '960px', margin: '0 auto', color: 'grey' } }}>

          <Presets sections={sections} selectedValues={selected.values} updateSelected={updateSelected} featureFlag={featureFlag} />

          <Separator styles={SeparatorStyle}><span style={{ "color": "rgb(0, 103, 184)" }}>Fine tune & Deploy</span></Separator>

          <Pivot selectedKey={pivotkey} onLinkClick={_handleLinkClick} focusZoneProps={{ 'data-testid': `portalnav-Pivot` }}>
            <PivotItem headerText={tabLabels.deploy} itemKey="deploy" onRenderItemLink={(a, b) => _customRenderer('deploy', a, b)}>
              <DeployTab defaults={defaults} tabValues={tabValues} updateFn={(field, value) => mergeState("deploy", field, value)} invalidArray={invalidArray['deploy']} invalidTabs={Object.keys(invalidArray).filter(t => invalidArray[t].length > 0).map(k => `'${tabLabels[k]}'`)} urlParams={urlParams} featureFlag={featureFlag} />
            </PivotItem>
            <PivotItem headerText={tabLabels.cluster} itemKey="cluster" onRenderItemLink={(a, b) => _customRenderer('cluster', a, b)} >
              <ClusterTab tabValues={tabValues} featureFlag={featureFlag} updateFn={(field, value) => mergeState("cluster", field, value)} invalidArray={invalidArray['cluster']} />
            </PivotItem>
            <PivotItem headerText={tabLabels.addons} itemKey="addons" onRenderItemLink={(a, b) => _customRenderer('addons', a, b)} >
              <AddonsTab tabValues={tabValues} featureFlag={featureFlag} updateFn={(field, value, previewLink) => mergeState("addons", field, value, previewLink)} invalidArray={invalidArray['addons']} />
            </PivotItem>
            <PivotItem headerText={tabLabels.net} itemKey="net" onRenderItemLink={(a, b) => _customRenderer('net', a, b)}>
              <NetworkTab defaults={defaults} tabValues={tabValues} featureFlag={featureFlag} updateFn={(field, value) => mergeState("net", field, value)} invalidArray={invalidArray['net']} />
            </PivotItem>
            <PivotItem headerText={tabLabels.app} itemKey="app" onRenderItemLink={(a, b) => _customRenderer('app', a, b)}>
              <AppsTab tabValues={tabValues} featureFlag={featureFlag} updateFn={(field, value) => mergeState("app", field, value)} invalidArray={invalidArray['app']} />
            </PivotItem>
          </Pivot>

        </Stack>

      </main >
    </ThemeProvider>
  )
}



