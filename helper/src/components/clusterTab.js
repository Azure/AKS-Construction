/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { mergeStyles, TextField, Link, Separator, DropdownMenuItemType, Dropdown, Slider, Stack, Text, Label, ChoiceGroup, Checkbox, MessageBar, MessageBarType } from '@fluentui/react';
import { adv_stackstyle, getError, hasError } from './common'
import vmSKUs from '../vmSKUs.json'

const optionRootClass = mergeStyles({
    display: 'flex',
    alignItems: 'baseline'
});

export var VMs = vmSKUs

export default function ({ defaults, tabValues, updateFn, featureFlag, invalidArray }) {
    const { net, addons, cluster, deploy } = tabValues
    const defenderFeatureFlag = featureFlag.includes('defender')

    //Initial filter on load
    VMs = vmSKUs.filter(l => {return l.location.toLowerCase() === (deploy.location.toLowerCase()) && l.computeType.toLowerCase() === cluster.computeType.toLowerCase()}) //Filter VM Sku list based on location

    function sliderUpdateFn(updates) {

        updateFn ((p) => {
            let newp = {...p, ...updates}
            let updatevals = {...updates}

            const
                AGENT_COUNT_MIN = newp.SystemPoolType==='none' || !newp.autoscale  ? 1 : 0,
                AGENT_COUNT_MAX = newp.autoscale ? 99 : 100,
                MAXCOUNT_MIN = newp.autoscale ? newp.agentCount + 1 : 0

            console.log (`agentCount=${newp.agentCount} MIN=${AGENT_COUNT_MIN} MAX=${AGENT_COUNT_MAX}`)
            console.log (`maxCount=${newp.maxCount} MIN=${MAXCOUNT_MIN}`)

            if(newp.SystemPoolType!=='none' && !cluster.nodepoolName){
                cluster.nodepoolName = 'npuser01'
            }

            if (newp.maxCount < MAXCOUNT_MIN) {
                updatevals = {...updatevals, maxCount: MAXCOUNT_MIN}
            }
            // check agentCount
            if (newp.agentCount < AGENT_COUNT_MIN) {
                updatevals = {...updatevals, agentCount: AGENT_COUNT_MIN }
            } else if (newp.agentCount > AGENT_COUNT_MAX) {
                updatevals = {...updatevals, agentCount: AGENT_COUNT_MAX }
            }

            return updatevals
        })
    }

    function UpdateOsType(v) {
        //update the OSType property, where this fn was called from
        updateFn("osType", v)

        //provide windows node pool optimised settings
        if (v==='Windows') {
            updateFn("nodepoolName", "npwin1")
            updateFn("vmSize", "Standard_DS4_v2")
            updateFn("osSKU", "Windows2022")
         } else {
            updateFn("nodepoolName", defaults.cluster.nodepoolName)
            updateFn("vmSize", defaults.cluster.vmSize)
            updateFn("osSKU", defaults.cluster.osSKU)
         }
    }

    return (
        <Stack tokens={{ childrenGap: 15 }} styles={adv_stackstyle}>

            <Label style={{ marginBottom: "10px" }}>Cluster Performance & Scale Requirements</Label>
            <Stack vertical tokens={{ childrenGap: 15 }} style={{ marginTop: 0, marginLeft: '50px' }} >

                <Stack horizontal tokens={{ childrenGap: 55 }}>
                    <Stack.Item>
                        <Label >Uptime SLA <Link target='_' href='https://docs.microsoft.com/azure/aks/uptime-sla'>docs</Link></Label>
                        <ChoiceGroup
                            selectedKey={cluster.AksPaidSkuForSLA}
                            options={[
                                { key: false, text: 'Free clusters with a service level objective (SLO) of 99.5%' },
                                { key: true, text: 'Uptime SLA: 99.9% availability for the Kubernetes API server for clusters without Availability zones.' }
                            ]}
                            onChange={(ev, { key }) => updateFn("AksPaidSkuForSLA", key)}
                        />
                    </Stack.Item>
                </Stack>

                <Stack horizontal tokens={{ childrenGap: 55 }}>
                    <Stack.Item>
                        <Label >System Pool Type <Link target='_' href='https://docs.microsoft.com/azure/aks/use-system-pools#system-and-user-node-pools'>docs</Link></Label>
                        <ChoiceGroup
                            selectedKey={cluster.SystemPoolType}
                            options={[
                                { "data-testid":'cluster-systempool-none', key: 'none', text: 'No separate system pool: Use a single Linux pool for System and User workloads' },
                                { "data-testid":'cluster-systempool-Cost-Optimised', key: 'CostOptimised', text: 'CostOptimised: use low-cost Burstable VMs, with 1-3 node autoscale' },
                                { "data-testid":'cluster-systempool-Standard', key: 'Standard', text: 'Standard: use standard 4-core VMs, with 2-3 node autoscale' }
                            ]}
                            onChange={(ev, { key }) => { sliderUpdateFn({SystemPoolType: key}) }}
                        />
                    </Stack.Item>
                </Stack>

                <Stack horizontal tokens={{ childrenGap: 150 }}>
                    <Stack.Item>
                        <Label>User Pool - OS Type</Label>
                        <ChoiceGroup selectedKey={cluster.osType} onChange={(ev, { key }) => {  UpdateOsType(key) }}
                            disabled={cluster.SystemPoolType==='none'}
                            options={[
                                {
                                    "data-testid":'Linux',
                                    key: 'Linux',
                                    iconProps: { iconName: 'Server' },
                                    text: 'Linux'
                                }, {
                                    "data-testid":'Windows',
                                    key: 'Windows',
                                    iconProps: { iconName: 'WindowsLogo' },
                                    text: 'Windows'
                                }
                            ]} />
                    </Stack.Item>
                    <Stack.Item>
                        <Label>OS SKU</Label>
                        <Dropdown
                            selectedKey={cluster.osSKU}
                            onChange={(ev, { key }) => updateFn("osSKU", key)}
                            options={[
                                { key: 'Ubuntu', text: 'Ubuntu', disabled:cluster.osType!=='Linux' },
                                { key: 'Windows2022', text: 'Windows Server 2022', disabled:cluster.osType!=='Windows' }
                            ]}
                            styles={{ dropdown: { width: "100%", minWidth: "200px" } }}
                        />
                    </Stack.Item>
                </Stack>



                <Stack horizontal tokens={{ childrenGap: 150 }}>
                    <Stack.Item>
                        <Label >Scale Type</Label>
                        <ChoiceGroup selectedKey={cluster.autoscale} onChange={(ev, { key }) => {  sliderUpdateFn({autoscale: key}) }}
                            options={[
                                {
                                    "data-testid":'cluster-manual-scale',
                                    key: false,
                                    iconProps: { iconName: 'FollowUser' },
                                    text: 'Manual scale'
                                }, {
                                    "data-testid":'cluster-auto-scale',
                                    key: true,
                                    iconProps: { iconName: 'ScaleVolume' },
                                    text: 'Autoscale'
                                }
                            ]} />
                    </Stack.Item>
                    <Stack.Item>
                        <Slider
                        buttonProps={{ "data-testid": "cluster-agentCount-slider"}}
                        styles={{ root: { width: 450 } }}
                        ranged={cluster.autoscale}  lowerValue={cluster.agentCount}
                        label={`Node count range ${cluster.autoscale ? 'range' : ''}`} min={0}  max={100} step={1}
                        value={cluster.autoscale? cluster.maxCount : cluster.agentCount} showValue={true}
                        onChange={(val, range) => sliderUpdateFn(cluster.autoscale ? {agentCount: range[0], maxCount: range[1]} : {agentCount: val})} />

                        <TextField
                        placeholder='npuser01'
                        label="Node pool name"
                        maxLength={cluster.osType==='Windows' ? 6 : 12}
                        onChange={(ev, val) => updateFn('nodepoolName', val)}
                        required
                        errorMessage={getError(invalidArray, 'nodepoolName')}
                        value={cluster.nodepoolName} />
                    </Stack.Item>

                </Stack>

                <Stack horizontal tokens={{ childrenGap: 55 }}>
                    <Stack.Item>
                        <Label >Compute Type</Label>
                        <ChoiceGroup
                            onChange={(ev, { key }) => {  sliderUpdateFn({computeType: key}) }}
                            selectedKey={cluster.computeType}
                            options={[
                                {
                                    key: 'gp',
                                    iconProps: { iconName: 'Processing' },
                                    text: 'General Purpose'
                                },
                                {
                                    key: 'iops',
                                    iconProps: { iconName: 'OfflineStorageSolid' },
                                    text: 'IO Optimised',
                                    disabled: true
                                },
                                {
                                    key: 'gpu',
                                    iconProps: { iconName: 'Game' },
                                    text: 'GPU Workloads',
                                    disabled: true
                                },
                                {
                                    key: 'sgx',
                                    iconProps: { iconName: 'LaptopSecure' },
                                    text: 'SGX Enclave',
                                    disabled: false
                                }
                            ]}
                            />
                    </Stack.Item>

                    <Stack.Item>
                        <Label>Virtual Machine Node Selection</Label>
                        <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: 500 } }}>
                            <Dropdown
                                selectedKey={cluster.vmSize}
                                onChange={(ev, { key }) => updateFn("vmSize", key)}
                                placeholder="Select VM Size"
                                options={VMs}
                                styles={{ dropdown: { width: "100%" } }}
                            />
                            {hasError(invalidArray, 'osDiskType') &&
                                <MessageBar messageBarType={MessageBarType.error}>{getError(invalidArray, 'osDiskType')}</MessageBar>
                            }
                            <TextField label="VM SKU" onChange={(ev, val) => updateFn('vmSize', val)} required errorMessage={getError(invalidArray, 'vmSize')} value={cluster.vmSize} />
                            <Checkbox checked={cluster.nodePoolSpot} onChange={(ev, val) => updateFn("nodePoolSpot", val)} disabled={cluster.SystemPoolType=='none'} onRenderLabel={() => <Text styles={{ root: { color: 'gray' } }}>Spot Instance</Text>} />
                            <ChoiceGroup
                                onChange={(ev, { key }) => updateFn("osDiskType", key)}
                                selectedKey={cluster.osDiskType}
                                options={[
                                    {
                                        key: 'Ephemeral',
                                        text: 'Ephemeral (Requires Node with >137GiB of cache)'
                                    },
                                    {
                                        key: 'Managed',
                                        text: 'Persistent in Storage Account',
                                    }
                                ]} />

                            {cluster.osDiskType === 'Managed' &&
                                <Dropdown
                                    label="OS disk size"
                                    selectedKey={cluster.osDiskSizeGB}
                                    onChange={(ev, { key }) => updateFn("osDiskSizeGB", key)}
                                    placeholder="Select OS Disk"
                                    options={[
                                        { key: 'df', text: 'Use the default for the VM size', itemType: DropdownMenuItemType.Header },
                                        { key: 0, text: 'default' },
                                        { key: 'pd', text: 'Premium SSD Managed Disks', itemType: DropdownMenuItemType.Header },
                                        { key: 32, text: '32 GiB (120 IOPS)' },
                                        { key: 64, text: '64 GiB (240 IOPS)' },
                                        { key: 128, text: '128 GiB (500 IOPS)' },
                                    ]}
                                    styles={{ dropdown: { width: "100%" } }}
                                />
                            }

                        </Stack>
                    </Stack.Item>
                </Stack>

            </Stack>

            <Separator className="notopmargin" />

            <Stack.Item align="start">
                <Label required={true}>Zone Support - AKS clusters deployed with multiple availability zones configured across a cluster provide a higher level of availability to protect against a hardware failure or a planned maintenance event. See <Link target='_' href='https://docs.microsoft.com/azure/aks/availability-zones#limitations-and-region-availability'>limits</Link> before selecting
                </Label>
                <ChoiceGroup
                    selectedKey={cluster.availabilityZones}
                    styles={{ root: { marginLeft: '50px' } }}
                    options={[
                        { key: 'no', text: 'Deploy into single zone' },
                        { key: 'yes', text: 'Deploy my control plane and nodes across zones 1,2,3' }

                    ]}
                    onChange={(ev, { key }) => updateFn("availabilityZones", key)}
                // styles={{ label: {fontWeight: "regular"}}}
                />
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item align="start">
                <Label required={true}>
                    Cluster Auto-upgrade <Link target="_" href="https://docs.microsoft.com/azure/aks/upgrade-cluster#set-auto-upgrade-channel">docs</Link>
                </Label>
                <ChoiceGroup
                    selectedKey={cluster.upgradeChannel}
                    styles={{ root: { marginLeft: '50px' } }}
                    options={[
                        { key: 'none', text: 'Disables auto-upgrades' },
                        { key: 'patch', text: 'Patch: auto-upgrade cluster to the latest supported patch version when it becomes available while keeping the minor version the same.' },
                        { key: 'stable', text: 'Stable: auto-upgrade cluster to the latest supported patch release on minor version N-1, where N is the latest supported minor version' },
                        { key: 'rapid', text: 'Rapid: auto-upgrade cluster to the latest supported patch release on the latest supported minor version.' },
                        { key: 'node-image', text: 'Node-Image: auto-upgrade cluster node images to the latest version available.' }

                    ]}
                    onChange={(ev, { key }) => updateFn("upgradeChannel", key)}
                />
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack horizontal tokens={{ childrenGap: 142 }} styles={{ root: { marginTop: 10 } }}>
                <Stack.Item align="start">
                    <Label>Cluster User Authentication <Link target="_" href="https://docs.microsoft.com/azure/aks/managed-aad">docs</Link></Label>

                    <ChoiceGroup
                        id='cluster-userauth-ChoiceGroup'
                        styles={{ root: { marginLeft: '50px' } }}
                        selectedKey={cluster.enable_aad}
                        onChange={(ev, { key }) => updateFn("enable_aad", key)}
                        options={[
                            {
                                key: false,
                                iconProps: { iconName: 'UserWarning' },
                                text: 'Kubernetes',
                                id: 'cluster-userauth-k8s'
                            },
                            {
                                key: true,
                                iconProps: { iconName: 'AADLogo' },
                                text: 'AAD Integrate',
                                id: 'cluster-userauth-aad'
                            }
                        ]} />
                </Stack.Item>

                <Stack.Item>
                    {cluster.enable_aad &&

                        <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: 450, marginTop: "30px" } }}>

                            <ChoiceGroup
                                styles={{ root: { width: 300 } }}
                                selectedKey={cluster.use_alt_aad}
                                options={[
                                    {
                                        key: false,
                                        text: 'Use the AKS subscription tenant',
                                    },
                                    {
                                        key: true,
                                        text: 'Use alt. tenant',
                                        onRenderField: (props, render) => {

                                            return (
                                                <div className={optionRootClass}>
                                                    {render(props)}
                                                    <TextField
                                                        value={cluster.aad_tenant_id}
                                                        onChange={(ev, val) => updateFn("aad_tenant_id", val)}
                                                        errorMessage={getError(invalidArray, 'aad_tenant_id')}
                                                        styles={{ root: { marginLeft: 5 } }}
                                                        disabled={props ? !cluster.use_alt_aad : false}
                                                        required placeholder="tenant id" />


                                                </div>
                                            );
                                        }
                                    }
                                ]}
                                onChange={(ev, { key }) => updateFn('use_alt_aad', key)}

                            />

                            <Checkbox checked={cluster.enableAzureRBAC} onChange={(ev, val) => updateFn("enableAzureRBAC", val)} onRenderLabel={() => <Text styles={{ root: { color: 'gray' } }}>Azure RBAC for Kubernetes Authorization <Link target='_' href='https://docs.microsoft.com/azure/aks/manage-azure-rbac'>docs</Link>**</Text>} />

                            {!cluster.enableAzureRBAC &&
                                <>
                                    <TextField label="AAD Group objectIDs that will have admin role of the cluster ',' separated" onChange={(ev, val) => updateFn("aadgroupids", val)} value={cluster.aadgroupids} />
                                    {cluster.enable_aad && !cluster.aadgroupids &&
                                        <MessageBar messageBarType={MessageBarType.warning}>You will be forbidden to do any kubernetes options unless you add a AAD Groups here, or follow <Link target='_' href='https://docs.microsoft.com/azure/aks/azure-ad-rbac#create-the-aks-cluster-resources-for-app-devs'>this</Link> after the cluster is created</MessageBar>
                                    }
                                </>
                            }

                            <Checkbox inputProps={{ "data-testid": "cluster-localaccounts-Checkbox"}} disabled={!cluster.enableAzureRBAC} checked={cluster.AksDisableLocalAccounts} onChange={(ev, val) => updateFn("AksDisableLocalAccounts", val)} onRenderLabel={() => <Text styles={{ root: { color: 'gray' } }}>Disable Local Kubernetes Accounts <Link target='_' href='https://docs.microsoft.com/azure/aks/managed-aad#disable-local-accounts'>docs</Link>**</Text>} />

                        </Stack>
                    }
                </Stack.Item>
            </Stack>

            <Separator className="notopmargin" />

            <Stack.Item align="start">
                <Label required={true}>
                    Cluster API Server Security
                </Label>
                <ChoiceGroup
                    selectedKey={cluster.apisecurity}
                    styles={{ root: { marginLeft: '50px' } }}
                    errorMessage={getError(invalidArray, 'apisecurity')}
                    options={[
                        { key: 'none', text: 'Public IP with no IP restrictions' },
                        { key: 'whitelist', text: 'Create allowed IP ranges (defaults to IP address of machine running the script)' },
                        { key: 'private', text: 'Private Cluster (Most secure option for your apps, but requires most involved access management)' }

                    ]}
                    onChange={(ev, { key }) => updateFn("apisecurity", key)}
                />
                {hasError(invalidArray, 'apisecurity') &&
                    <MessageBar styles={{ root: { marginLeft: '50px', width:'700px', marginTop: '10px !important'}}} messageBarType={MessageBarType.error}>{getError(invalidArray, 'apisecurity')}</MessageBar>
                }
            </Stack.Item>
            <Stack.Item align="start" styles={{ root: { marginLeft: '100px',maxWidth: '700px', display: (cluster.apisecurity === "private" ? "block" : "none") } }} >
                <Label style={{ marginBottom: "0px" }}>Private dns zone mode for private cluster.</Label>
                <Stack tokens={{ childrenGap: 15 }}>
                    {cluster.apisecurity === "private" &&
                    <>
                        <ChoiceGroup selectedKey={cluster.privateClusterDnsMethod} onChange={(ev, { key }) => updateFn("privateClusterDnsMethod", key)}
                            options={[
                                {
                                    key: 'none',
                                    text: 'None: Defaults to public DNS (AKS will not create a Private DNS Zone)'
                                }, {
                                    key: 'system',
                                    text: 'System: AKS will create a Private DNS Zone in the Managed AKS Resource Group'
                                }, {
                                    key: 'privateDnsZone',
                                    text: 'Custom: BYO Private DNS Zone (provide ResourceId)'
                                }
                            ]} />
                            {cluster.privateClusterDnsMethod==='privateDnsZone' &&
                                <>
                                    <MessageBar messageBarType={MessageBarType.info}>Custom Private DNS Zones are useful for having more control on zone naming or for shared zones in other resource groups, in most cases System created DNS should be sufficient</MessageBar>
                                    <TextField
                                       value={cluster.dnsApiPrivateZoneId}
                                       onChange={(ev, v) => updateFn("dnsApiPrivateZoneId", v)}
                                       errorMessage={getError(invalidArray, 'dnsApiPrivateZoneId')}
                                       required
                                       placeholder="Resource Id"
                                       label={<Text style={{ fontWeight: 600 }}>Enter your Private Azure DNS Zone ResourceId <Link target="_t2" href="https://ms.portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FprivateDnsZones">find it here</Link></Text>}
                                       />
                                    <MessageBar messageBarType={MessageBarType.warning}>Private DNS Zone for the Cluster API Server must be in the format: privatelink.*region*.azmk8s.io or *subzone*.privatelink.*region*.azmk8s.io<a target="_target" href="https://docs.microsoft.com/azure/aks/private-clusters#configure-private-dns-zone">docs</a></MessageBar>
                                </>
                            }
                        </>
                    }
                </Stack>
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item align="start">
                <Label required={true}>
                    Key Management Service (KMS) etcd Encryption
                </Label>
                <MessageBar messageBarType={MessageBarType.info}>
                    Using the CSI Secrets Add-On, with volume mounted secrets is the recommended approach for secrets management. <Link target='_' href='https://docs.microsoft.com/azure/aks/csi-secrets-store-driver'>docs</Link>
                </MessageBar>
                <MessageBar messageBarType={MessageBarType.info} styles={{ root: { display: (net.vnetprivateend ? "block" : "none") } }}>
                    Using an existing Key Vault for KMS is the only supported scenario when using Private Link Networking
                </MessageBar>
                <MessageBar messageBarType={MessageBarType.warning} styles={{ root: { display: (cluster.keyVaultKms !== "none" ? "block" : "none") } }}>
                    KMS requires the customer to be responsible for key management (to include rotation).
                    <br />
                    Mismanagement can cause the secrets to be unrecoverable in the cluster. <Link target='_' href='https://docs.microsoft.com/azure/aks/use-kms-etcd-encryption'>docs</Link>
                </MessageBar>
                <ChoiceGroup
                    selectedKey={cluster.keyVaultKms}
                    styles={{ root: { marginLeft: '50px' } }}
                    options={[
                        { key: 'none', text: 'No encryption of etcd required' },
                        { key: 'public', text: 'Create a new Key Vault with least privileged access and generate the key', disabled: net.vnetprivateend },
                        { key: 'byoprivate', text: 'Use an existing Key Vault Key.' }
                    ]}
                    onChange={(ev, { key }) => updateFn("keyVaultKms", key)}
                />

                <Stack.Item align="center" styles={{ root: { marginLeft:'100px', maxWidth: '700px', display: (cluster.keyVaultKms === "byoprivate" ? "block" : "none") } }} >
                    <TextField label="Existing Key Identifier" onChange={(ev, val) => updateFn("keyVaultKmsByoKeyId", val)} value={cluster.keyVaultKmsByoKeyId} errorMessage={getError(invalidArray, 'keyVaultKmsByoKeyId')}  />
                    <TextField label="Key Vault Resource Group Name" onChange={(ev, val) => updateFn("keyVaultKmsByoRG", val)} value={cluster.keyVaultKmsByoRG} required errorMessage={getError(invalidArray, 'keyVaultKmsByoRG')} />
                    <MessageBar messageBarType={MessageBarType.warning}>The deploying user must have RBAC permission (Owner) on the existing vault to create new RBAC permissions for the AKS cluster to access the key and (if configured) create the network private link</MessageBar>
                </Stack.Item>

            </Stack.Item>


            { defenderFeatureFlag &&
            <>
                <Separator className="notopmargin" />

                <Stack.Item align="start">
                    <Label required={true}>
                        Microsoft Defender for Containers  <Link target='_' href='https://docs.microsoft.com/azure/defender-for-cloud/defender-for-cloud-introduction'>docs</Link>
                    </Label>
                    <MessageBar messageBarType={MessageBarType.info}>Microsoft Defender for Containers will usually be enabled at the Subscription scope, and includes the scanning of Container Images in an Azure Container Registry. This sets Microsoft Defender for Containers to be enabled specifically on the cluster <a target="_target" href="https://docs.microsoft.com/azure/defender-for-cloud/defender-for-containers-enable">docs</a></MessageBar>
                    <ChoiceGroup
                        selectedKey={cluster.DefenderForContainers}
                        styles={{ root: { marginLeft: '50px' } }}
                        options={[
                            { key: false, text: 'Use the subscription setting for Defender' },
                            { key: true, text: 'Enable Defender security alerting' }

                        ]}
                        onChange={(ev, { key }) => updateFn("DefenderForContainers", key)}
                    />
                </Stack.Item>
            </>}
        </Stack>
    )
}
