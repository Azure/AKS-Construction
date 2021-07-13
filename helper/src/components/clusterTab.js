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

export default function ({ tabValues, updateFn, invalidArray }) {
    const { cluster } = tabValues
    return (
        <Stack tokens={{ childrenGap: 15 }} styles={adv_stackstyle}>

            <Label style={{ marginBottom: "10px" }}>Cluster Performance & Scale Requirements (system nodepool)</Label>
            <Stack vertical tokens={{ childrenGap: 15 }} style={{ marginTop: 0, marginLeft: '50px' }} >

                <Stack horizontal tokens={{ childrenGap: 150 }}>
                    <Stack.Item>
                        <ChoiceGroup selectedKey={cluster.autoscale} onChange={(ev, { key }) => updateFn("autoscale", key)}
                            options={[
                                {
                                    key: false,
                                    iconProps: { iconName: 'FollowUser' },
                                    text: 'Manual scale'
                                }, {
                                    key: true,
                                    iconProps: { iconName: 'ScaleVolume' },
                                    text: 'Autoscale'
                                }
                            ]} />
                    </Stack.Item>
                    <Stack.Item>
                        <Stack tokens={{ childrenGap: 0 }} styles={{ root: { width: 450 } }}>
                            <Slider label={`Initial ${cluster.autoscale ? "(& Autoscaler Min nodes)" : "nodes"}`} min={1} max={10} step={1} defaultValue={cluster.count} showValue={true}
                                onChange={(v) => updateFn("count", v)} />
                            {cluster.autoscale && (
                                <Slider label="Autoscaler Max nodes" min={5} max={100} step={5} defaultValue={cluster.maxCount} showValue={true}
                                    onChange={(v) => updateFn("maxCount", v)}
                                    snapToStep />
                            )}
                        </Stack>
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
                <Label required={true}>Zone Support - Do you want to deploy your nodes across Availability Zones
                </Label>
                <ChoiceGroup
                    selectedKey={cluster.availabilityZones}
                    styles={{ root: { marginLeft: '50px' } }}
                    options={[
                        { key: 'no', text: 'Deploy into single zone' },
                        { key: 'yes', text: 'Deploy my control plane and nodes across all availability zones (**storage)' }

                    ]}
                    onChange={(ev, { key }) => updateFn("availabilityZones", key)}
                // styles={{ label: {fontWeight: "regular"}}}
                />
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item align="start">
                <Label required={true}>
                    Cluster Auto-upgrade
                </Label>
                <ChoiceGroup
                    selectedKey={cluster.upgradeChannel}
                    styles={{ root: { marginLeft: '50px' } }}
                    options={[
                        { key: 'none', text: 'Disables auto-upgrades' },
                        { key: 'patch', text: 'Patch: auto-upgrade cluster to the latest supported patch version when it becomes available while keeping the minor version the same.' },
                        { key: 'stable', text: 'Stable: auto-upgrade cluster to the latest supported patch release on minor version N-1, where N is the latest supported minor version' },
                        { key: 'rapid', text: 'Rapid: auto-upgrade cluster to the latest supported patch release on the latest supported minor version.' }

                    ]}
                    onChange={(ev, { key }) => updateFn("upgradeChannel", key)}
                />
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack horizontal tokens={{ childrenGap: 142 }} styles={{ root: { marginTop: 10 } }}>
                <Stack.Item>
                    <ChoiceGroup
                        styles={{ root: { marginLeft: '50px' } }}
                        label={<Label>Cluster User Authentication <Link target="_" href="https://docs.microsoft.com/en-gb/azure/aks/managed-aad">docs</Link></Label>}
                        selectedKey={cluster.enable_aad}
                        onChange={(ev, { key }) => updateFn("enable_aad", key)}
                        options={[
                            {
                                key: false,
                                iconProps: { iconName: 'UserWarning' },
                                text: 'Kubernetes'
                            },
                            {
                                key: true,
                                iconProps: { iconName: 'AADLogo' },
                                text: 'AAD Integrated'
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

                            <Checkbox checked={cluster.enableAzureRBAC} onChange={(ev, val) => updateFn("enableAzureRBAC", val)} onRenderLabel={() => <Text styles={{ root: { color: 'black' } }}>Azure RBAC for Kubernetes Authorization <Link target='_' href='https://docs.microsoft.com/en-us/azure/aks/manage-azure-rbac'>docs</Link>**</Text>} />

                            {!cluster.enableAzureRBAC ?
                                <>
                                    <TextField label="AAD Group objectIDs that will have admin role of the cluster ',' separated" onChange={(ev, val) => updateFn("aadgroupids", val)} value={cluster.aadgroupids} />
                                    {cluster.enable_aad && !cluster.aadgroupids &&
                                        <MessageBar messageBarType={MessageBarType.warning}>You will be forbidden to do any kubernetes options unless you add a AAD Groups here, or follow <Link target='_' href='https://docs.microsoft.com/en-us/azure/aks/azure-ad-rbac#create-the-aks-cluster-resources-for-app-devs'>this</Link> after the cluster is created</MessageBar>
                                    }
                                </>
                                :
                                <>
                                    <Label>Assign Cluster Admin Role to user (optional)</Label>
                                    <MessageBar styles={{ root: { marginBottom: '10px' } }}>Get your user principleId by running <Label>az ad user show --id `{'<work-email>'}` --query objectId --out tsv</Label></MessageBar>
                                    <TextField prefix="AAD PrincipleId" onChange={(ev, val) => updateFn("adminprincipleid", val)} value={cluster.adminprincipleid} />
                                </>
                            }
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
                        { key: 'private', text: 'Private Cluster (WARNING: requires jumpbox to access)' }

                    ]}
                    onChange={(ev, { key }) => updateFn("apisecurity", key)}
                />
            </Stack.Item>

        </Stack>

    )
}