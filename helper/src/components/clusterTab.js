/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { mergeStyles, TextField, Link, Separator, DropdownMenuItemType, Dropdown, Slider, Stack, Text, Label, ChoiceGroup, Checkbox, MessageBar, MessageBarType } from '@fluentui/react';
import { adv_stackstyle, getError, hasError } from './common'

const optionRootClass = mergeStyles({
    display: 'flex',
    alignItems: 'baseline'
});

export const VMs = [
    { key: 'b', text: 'Burstable (dev/test)', itemType: DropdownMenuItemType.Header },
    { key: 'Standard_B2s', text: '2 vCPU,  4 GiB RAM,   8GiB SSD, 40%	-> 200% CPU', eph: true },
    { key: 'dv2', text: 'General purpose V2', itemType: DropdownMenuItemType.Header },
    { key: 'default', text: '2 vCPU,  7 GiB RAM,  14GiB SSD,  86 GiB cache (8000 IOPS)', eph: false },
    { key: 'Standard_DS3_v2', text: '4 vCPU, 14 GiB RAM,  28GiB SSD, 172 GiB cache (16000 IOPS)', eph: true },
    { key: 'dv4', text: 'General purpose V4', itemType: DropdownMenuItemType.Header },
    { key: 'Standard_D2ds_v4', text: '2 vCPU,  8 GiB RAM,  75GiB SSD,               (19000 IOPS)', eph: false },
    { key: 'Standard_D4ds_v4', text: '4 vCPU, 16 GiB RAM, 150GiB SSD, 100 GiB cache (38500 IOPS)', eph: false },
    { key: 'Standard_D8ds_v4', text: '8 vCPU, 32 GiB RAM, 300GiB SSD,               (77000 IOPS)', eph: true },
    { key: 'fv2', text: 'Compute optimized', itemType: DropdownMenuItemType.Header },
    { key: 'Standard_F2s_v2', text: '2 vCPU,  4 GiB RAM,  16GiB SSD,               (3200 IOPS)', eph: false }
]

export default function ({ tabValues, updateFn, featureFlag, invalidArray }) {
    const { cluster } = tabValues
    const defenderFeatureFlag = featureFlag.includes('defender')


    function sliderUpdateFn(updates) {

        updateFn ((p) => {
            let newp = {...p, ...updates}

            const
                AGENT_COUNT_MIN = newp.SystemPoolType==='none' || !newp.autoscale  ? 1 : 0,
                AGENT_COUNT_MAX = newp.autoscale ? 99 : 100,
                MAXCOUNT_MIN = newp.autoscale ? newp.agentCount + 1 : 0

            console.log (`agentCount=${newp.agentCount} MIN=${AGENT_COUNT_MIN} MAX=${AGENT_COUNT_MAX}`)
            console.log (`maxCount=${newp.maxCount} MIN=${MAXCOUNT_MIN}`)

            if (newp.maxCount < MAXCOUNT_MIN) {
                newp = {...newp, maxCount: MAXCOUNT_MIN}
            }
            // check agentCount
            if (newp.agentCount < AGENT_COUNT_MIN) {
                newp = {...newp, agentCount: AGENT_COUNT_MIN }
            } else if (newp.agentCount > AGENT_COUNT_MAX) {
                newp = {...newp, agentCount: AGENT_COUNT_MAX }
            }

            return newp
        })
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
                                { key: true, text: 'Uptime SLA guarantees 99.95% availability of the Kubernetes API server endpoint for clusters that use Availability Zones' }
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
                                { "data-testid":'cluster-systempool-none', key: 'none', text: 'No separate system pool: Use a single pool for System and User workloads' },
                                { "data-testid":'cluster-systempool-Cost-Optimised', key: 'Cost-Optimised', text: 'Cost-Optimised: use low-cost Burstable VMs, with 1-3 node autoscale' },
                                { "data-testid":'cluster-systempool-Standard', key: 'Standard', text: 'Standard: use standard 4-core VMs, with 2-3 node autoscale' }
                            ]}
                            onChange={(ev, { key }) => { sliderUpdateFn({SystemPoolType: key}) }}
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
                        <Slider buttonProps={{ "data-testid": "cluster-agentCount-slider"}} styles={{ root: { width: 450 } }} ranged={cluster.autoscale}  lowerValue={cluster.agentCount}
                        label={`Node count range ${cluster.autoscale ? 'range' : ''}`} min={0}  max={100} step={1}
                        value={cluster.autoscale? cluster.maxCount : cluster.agentCount} showValue={true}
                        onChange={(val, range) => sliderUpdateFn(cluster.autoscale ? {agentCount: range[0], maxCount: range[1]} : {agentCount: val})} />
                    </Stack.Item>
                </Stack>

                <Stack horizontal tokens={{ childrenGap: 55 }}>
                    <Stack.Item>
                        <Label >Compute Type</Label>
                        <ChoiceGroup

                            selectedKey="gp"
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
                                }
                            ]} />
                    </Stack.Item>

                    <Stack.Item>
                        <Label >Node Size</Label>
                        <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: 450 } }}>
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
                <Stack.Item>
                    <ChoiceGroup
                        id='cluster-userauth-ChoiceGroup'
                        styles={{ root: { marginLeft: '50px' } }}
                        label={<Label>Cluster User Authentication <Link target="_" href="https://docs.microsoft.com/azure/aks/managed-aad">docs</Link></Label>}
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

                            <Checkbox checked={cluster.enableAzureRBAC} onChange={(ev, val) => updateFn("enableAzureRBAC", val)} onRenderLabel={() => <Text styles={{ root: { color: 'black' } }}>Azure RBAC for Kubernetes Authorization <Link target='_' href='https://docs.microsoft.com/azure/aks/manage-azure-rbac'>docs</Link>**</Text>} />

                            {!cluster.enableAzureRBAC &&
                                <>
                                    <TextField label="AAD Group objectIDs that will have admin role of the cluster ',' separated" onChange={(ev, val) => updateFn("aadgroupids", val)} value={cluster.aadgroupids} />
                                    {cluster.enable_aad && !cluster.aadgroupids &&
                                        <MessageBar messageBarType={MessageBarType.warning}>You will be forbidden to do any kubernetes options unless you add a AAD Groups here, or follow <Link target='_' href='https://docs.microsoft.com/azure/aks/azure-ad-rbac#create-the-aks-cluster-resources-for-app-devs'>this</Link> after the cluster is created</MessageBar>
                                    }
                                </>
                            }

                            <Checkbox inputProps={{ "data-testid": "cluster-localaccounts-Checkbox"}} disabled={!cluster.enableAzureRBAC} checked={cluster.AksDisableLocalAccounts} onChange={(ev, val) => updateFn("AksDisableLocalAccounts", val)} onRenderLabel={() => <Text styles={{ root: { color: 'black' } }}>Disable Local Kubernetes Accounts <Link target='_' href='https://docs.microsoft.com/azure/aks/managed-aad#disable-local-accounts'>docs</Link>**</Text>} />

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
                    options={[
                        { key: 'none', text: 'Public IP with no IP restrictions' },
                        { key: 'whitelist', text: 'Create allowed IP ranges (defaults to IP address of machine running the script)' },
                        { key: 'private', text: 'Private Cluster (WARNING: most complex to operate)' }

                    ]}
                    onChange={(ev, { key }) => updateFn("apisecurity", key)}
                />
            </Stack.Item>

            <Stack.Item align="center" styles={{ root: { maxWidth: '700px', display: (cluster.apisecurity === "private" ? "block" : "none") } }} >
                <Label style={{ marginBottom: "0px" }}>Private dns zone mode for private cluster.</Label>
                <Stack tokens={{ childrenGap: 15 }}>
                    {cluster.apisecurity === "private" &&
                        <ChoiceGroup selectedKey={cluster.privateDNSZone} onChange={(ev, { key }) => updateFn("privateDNSZone", key)}
                            options={[
                                {
                                    key: 'none',
                                    text: 'None: Defaults to public DNS (AKS will not create a Private DNS Zone)'
                                }, {
                                    key: 'system',
                                    disabled: true,
                                    text: 'System: AKS will create a Private DNS Zone in the Node Resource Group'
                                }, {
                                    key: 'custom',
                                    disabled: true,
                                    text: 'Custom: BYO Private DNS Zone (provide ResourceId)'
                                }
                            ]} />
                    }
                </Stack>
            </Stack.Item>

            { defenderFeatureFlag &&
            <>
                <Separator className="notopmargin" />

                <Stack.Item align="start">
                    <Label required={true}>
                        Microsoft Defender for Containers  <Link target='_' href='https://docs.microsoft.com/azure/defender-for-cloud/defender-for-cloud-introduction'>docs</Link>
                    </Label>
                    <ChoiceGroup
                        selectedKey={cluster.DefenderForContainers}
                        styles={{ root: { marginLeft: '50px' } }}
                        options={[
                            { key: false, text: 'Disable Microsoft Defender security alerting' },
                            { key: true, text: 'Enable Microsoft Defender security alerting' }

                        ]}
                        onChange={(ev, { key }) => updateFn("DefenderForContainers", key)}
                    />
                </Stack.Item>
            </>}
        </Stack>
    )
}