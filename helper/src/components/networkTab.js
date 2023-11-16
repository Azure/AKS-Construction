
import React, { useState } from 'react';
import { Image, ImageFit, Link, Separator, TextField, DirectionalHint, Callout, Stack, Text, Label, ChoiceGroup, Checkbox, MessageBar, MessageBarType, Slider, Dropdown } from '@fluentui/react';
import { adv_stackstyle, hasError, getError } from './common'
import { PreviewDialog } from './previewDialog';

const columnProps = {
    tokens: { childrenGap: 20 },
    styles: { root: { minWidth: 380 } }
}


export default function NetworkTab ({ defaults, tabValues, updateFn, invalidArray, featureFlag }) {

    const [callout1, setCallout1] = useState(false)

    const { net, addons, cluster } = tabValues
    var _calloutTarget1 = React.createRef()


    function UpdateDynamicIpAllocation(v) {
        //update the Dynamic IP Allocation property, where this fn was called from
        updateFn("cniDynamicIpAllocation", v)

        //update max pods to 250 if dynamic IP allocation is enabled
        if (v) {
            updateFn("maxPods", 250)
         } else {
            updateFn("maxPods", defaults.net.maxPods)
         }

        //update pod cidr
        if (v) {
            updateFn("podCidr", defaults.net.podCidr.replace("/22","/24"))
         } else {
            updateFn("podCidr", defaults.net.podCidr)
         }
    }

    function UpdateCniOverlay(v) {
        //update the networkPluginMode property, where this fn was called from
        updateFn("networkPluginMode", v)

        //update node subnet to a nice small /24 if overlay is enabled, otherwise use the default
        if (v) {
            updateFn("vnetAksSubnetAddressPrefix", "10.240.0.0/24")
         } else {
            updateFn("vnetAksSubnetAddressPrefix", defaults.net.vnetAksSubnetAddressPrefix)
         }

        if (v) {
            updateFn("podCidr", '10.244.0.0/16')
        } else {
            updateFn("podCidr", defaults.net.podCidr)
        }
    }

    return (
        <Stack tokens={{ childrenGap: 15 }} styles={adv_stackstyle}>

            <Stack.Item>
                <Label required={true}>Network Plugin</Label>
                <MessageBar>Typically, only use "kubenet" networking if you need to limit your non-routable IP usage on your network (use network calculator)</MessageBar>
                {hasError(invalidArray, 'networkPlugin') &&
                    <MessageBar messageBarType={MessageBarType.error}>{getError(invalidArray, 'networkPlugin')}</MessageBar>
                }
                <ChoiceGroup
                    styles={{ root: { marginLeft: '50px' } }}
                    selectedKey={net.networkPlugin}
                    options={[
                        { key: 'kubenet', text: 'Use "kubenet" basic networking, so your PODs DO NOT receive VNET IPs', disabled:cluster.osType==='Windows' },
                        { key: 'azure', text: 'Use "CNI" for fastest container networking, but using more IPs' }

                    ]}
                    onChange={(ev, { key }) => updateFn("networkPlugin", key)}
                    errorMessage={getError(invalidArray, 'networkPlugin')}
                />
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item>
                <Label>CNI Features</Label>
                {hasError(invalidArray, 'cniFeatures') &&
                    <MessageBar messageBarType={MessageBarType.error}>{getError(invalidArray, 'cniFeatures')}</MessageBar>
                }
                <Stack horizontal tokens={{ childrenGap: 15 }} >
                    <Stack.Item>
                        <MessageBar messageBarType={MessageBarType.info}>Dynamic IP allocation separates node IP's and Pod IP's by subnet allowing dynamic allocation of Pod IPs <a target="_new" href="https://learn.microsoft.com/en-us/azure/aks/configure-azure-cni#dynamic-allocation-of-ips-and-enhanced-subnet-support">docs</a> </MessageBar>
                        <Checkbox
                            styles={{ root: { marginLeft: '50px', marginTop: '10px !important' } }}
                            disabled={net.vnet_opt === 'default' || net.networkPlugin!=='azure' || net.networkPluginMode}
                            checked={net.cniDynamicIpAllocation}
                            onChange={(ev, v) => UpdateDynamicIpAllocation(v)}
                            label="Implement Dynamic Allocation of IPs" />
                    </Stack.Item>
                    <Stack.Item>
                        <MessageBar messageBarType={MessageBarType.info}>Overlay is a feature that leverages a private CIDR for Pod IP's. See if it's right for you:<a target="_new" href="https://learn.microsoft.com/azure/aks/azure-cni-overlay">docs</a> </MessageBar>
                        <Checkbox
                            styles={{ root: { marginLeft: '50px', marginTop: '10px !important' } }}
                            disabled={net.networkPlugin!=='azure' || net.cniDynamicIpAllocation}
                            checked={net.networkPluginMode}
                            onChange={(ev, v) => UpdateCniOverlay(v)}
                            label="CNI Overlay Network" />
                    </Stack.Item>
                    <Stack.Item>
                        <MessageBar messageBarType={MessageBarType.info}>Powered by Cilium is a <a target="_new" href="https://learn.microsoft.com/en-us/azure/aks/azure-cni-powered-by-cilium#prerequisites">preview feature</a> that leverages more efficient use of the linux kernel and other networking features.</MessageBar>
                        <Checkbox
                            styles={{ root: { marginLeft: '50px', marginTop: '10px !important' } }}
                            disabled={net.networkPlugin!=='azure' || net.networkPluginMode===false}
                            checked={net.ebpfDataplane}
                            onChange={(ev, v) => updateFn("ebpfDataplane", v)}
                            label="Cilium powered dataplane" />
                            {
                                net.ebpfDataplane &&
                                (
                                    <PreviewDialog previewLink={"https://learn.microsoft.com/en-us/azure/aks/azure-cni-powered-by-cilium#prerequisites"} />
                                )
                            }
                    </Stack.Item>
                </Stack>
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item>
            <Label>Pods</Label>
                <MessageBar messageBarType={MessageBarType.info}>When using Azure CNI with Dynamic IP allocation also allows customers to set up clusters that consume fewer IPs. <br/ >This means Pods per Node can be maximised which simplifies sizing the cluster.</MessageBar>
                <Slider
                    buttonProps={{ "data-testid": "network-maxpods-slider"}}
                    styles={{ root: { marginLeft: '50px', width: 450 } }}
                    label={'Maximum Pods per node'} min={10}  max={250} step={1}
                    value={net.maxPods} showValue={true}
                    onChange={(val, range) => updateFn("maxPods", val)}
                />
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item>
                <Label>Uses a private IP address from your VNet to access your dependent Azure service, such as Azure KeyVault, Azure Container Registry etc</Label>
                <Checkbox styles={{ root: { marginLeft: '50px', marginTop: '0 !important' } }} disabled={false} checked={net.vnetprivateend} onChange={(ev, v) => updateFn("vnetprivateend", v)} label="Enable Private Link" />
            </Stack.Item>

            {cluster.SystemPoolType !== "none" &&
                <>
                    <Separator className="notopmargin" />

                    <Stack.Item>
                        <Label>Assign a public IP per node for your node pools</Label>
                        <Checkbox styles={{ root: { marginLeft: '50px', marginTop: '0 !important' } }} disabled={false} checked={net.enableNodePublicIP} onChange={(ev, v) => updateFn("enableNodePublicIP", v)} label="Enable Node Public IP" />
                    </Stack.Item>
                </>
            }

            <Separator className="notopmargin" />

            <Stack.Item>
                <Label>Use Azure Bastion to facilitate RDP/SSH public internet inbound access into your virtual network</Label>
                <Checkbox inputProps={{ "data-testid": "network-bastion-Checkbox"}} styles={{ root: { marginLeft: '50px', marginTop: '0 !important' } }} disabled={false} checked={net.bastion} onChange={(ev, v) => updateFn("bastion", v)} label="Enable Azure Bastion" />
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item >
                <Label>AKS Traffic Egress</Label>

                <Stack horizontal tokens={{ childrenGap: 50 }}>
                    <Stack.Item>
                        <MessageBar messageBarType={MessageBarType.info}>NAT Gateway allows more traffic flows than a Load Balancer.<a target="_target" href="https://docs.microsoft.com/azure/aks/nat-gateway">docs</a></MessageBar>
                        {cluster.availabilityZones === "yes" &&
                            <MessageBar messageBarType={MessageBarType.warning}>NAT Gateways are not a Zone Redundant resource</MessageBar>
                        }
                        {net.aksOutboundTrafficType==='userDefinedRouting' && net.vnet_opt === 'byo' &&
                          <MessageBar styles={{ root: { width:'400px', marginTop: '10px !important'}}} messageBarType={MessageBarType.warning}>Ensure that the AKS Subnet is configured with a UDR and that your Virtual Network Appliance is <Link href="https://learn.microsoft.com/azure/aks/limit-egress-traffic">properly configured</Link> to allow necessary traffic</MessageBar>
                        }
                        {hasError(invalidArray, 'aksOutboundTrafficType') &&
                            <MessageBar messageBarType={MessageBarType.error}>{getError(invalidArray, 'aksOutboundTrafficType')}</MessageBar>
                        }
                        <ChoiceGroup
                            styles={{ root: { marginLeft: '50px' } }}
                            selectedKey={net.aksOutboundTrafficType}
                            errorMessage={getError(invalidArray, 'aksOutboundTrafficType')}
                            data-testid="net-aksEgressType"
                            options={[
                                { key: 'loadBalancer', text: 'Load Balancer'  },
                                { key: 'natGateway', text: 'NAT Gateway' },
                                { key: 'userDefinedRouting', text: 'User Defined Routing'}
                            ]}
                            onChange={(ev, { key }) => updateFn("aksOutboundTrafficType", key)}
                        />
                    </Stack.Item>
                    <Stack.Item>
                        <Checkbox //simple "read-only" checkbox that derives its values from other settings
                            styles={{ root: { marginBottom: '10px' }}}
                            checked={net.vnet_opt === 'custom' && net.aksOutboundTrafficType === 'natGateway'}
                            disabled={true}
                            label="Create NAT Gateway for AKS Subnet (Custom VNet Only)"
                        />
                        <Slider
                            disabled={net.aksOutboundTrafficType==='loadBalancer' || net.aksOutboundTrafficType==='userDefinedRouting' || net.vnet_opt === 'byo'}
                            buttonProps={{ "data-testid": "net-natGwIp-slider"}}
                            styles={{ root: { width: 450 } }}
                            label={'Nat Gateway Ip Count'} min={1}  max={16} step={1}
                            value={net.natGwIpCount} showValue={true}
                            onChange={(val, range) => updateFn("natGwIpCount", val)}
                        />

                        <Slider
                            disabled={net.aksOutboundTrafficType==='loadBalancer' || net.aksOutboundTrafficType==='userDefinedRouting' || net.vnet_opt === 'byo'}
                            buttonProps={{ "data-testid": "net-natGwTimeout-slider"}}
                            styles={{ root: { width: 450 } }}
                            label={'Nat Gateway Idle Timeout (Minutes)'} min={5}  max={120} step={1}
                            value={net.natGwIdleTimeout} showValue={true}
                            onChange={(val, range) => updateFn("natGwIdleTimeout", val)}
                        />
                    </Stack.Item>
                </Stack>
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item>
                <Label>Deploy Azure firewall for your cluster egress (Custom VNet Only)</Label>
                {hasError(invalidArray, 'afw') &&
                    <MessageBar messageBarType={MessageBarType.error}>{getError(invalidArray, 'afw')}</MessageBar>
                }
                <Checkbox
                    styles={{ root: { marginLeft: '50px', marginTop: '10px !important' } }}
                    disabled={net.vnet_opt !== 'custom'}
                    errorMessage={getError(invalidArray, 'afw(')}
                    checked={net.afw}
                    onChange={(ev, v) => updateFn("afw", v)}
                    label="Implement Azure Firewall & UDR next hop" />

                {net.azureFirewallSku==='Basic' &&
                    <MessageBar styles={{ root: { marginLeft: '50px', width:'500px', marginTop: '10px !important'}}} messageBarType={MessageBarType.warning}>Basic SKU is currently a preview service <Link href="https://learn.microsoft.com/en-gb/azure/firewall/deploy-firewall-basic-portal-policy#prerequisites">(*preview)</Link></MessageBar>
                }
                <Dropdown
                    styles={{ root: { marginLeft: '50px', width: '200px', marginTop: '10 !important' } }}
                    disabled={!net.afw}
                    label="Firewall SKU"
                    onChange={(ev, { key }) => updateFn("azureFirewallSku", key)} selectedKey={net.azureFirewallSku}
                    options={[
                        { key: 'Basic', text: 'Basic' },
                        { key: 'Standard', text: 'Standard' },
                        { key: 'Premium', text: 'Premium' }
                    ]}
                />
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item>
                <Stack horizontal>
                    <Stack.Item>
                        <Label>Default or Custom VNET</Label>
                        <div ref={_calloutTarget1} style={{ marginTop: 0 }}>
                            <ChoiceGroup
                                styles={{ root: { marginLeft: '50px' } }}
                                selectedKey={net.vnet_opt}
                                onClick={() => setCallout1(true)}
                                onChange={(ev, { key }) => updateFn("vnet_opt", key)}
                                options={[
                                    {
                                        key: 'default',
                                        iconProps: { iconName: 'CubeShape' },
                                        text: 'Default Networking'
                                    },
                                    {
                                        key: 'custom',
                                        iconProps: { iconName: 'CityNext' }, // SplitObject
                                        text: 'Custom Networking'
                                    },
                                    {
                                        key: 'byo',
                                        disabled: false,
                                        iconProps: { iconName: 'WebAppBuilderFragment' }, // SplitObject
                                        text: 'BYO VNET'
                                    }
                                ]}
                            />
                            {hasError(invalidArray, 'vnet_opt') &&
                                <MessageBar messageBarType={MessageBarType.error}>{getError(invalidArray, 'vnet_opt')}</MessageBar>
                            }
                        </div>
                    </Stack.Item>
                    <Stack.Item>
                        {callout1 && net.vnet_opt === 'default' && (
                            <Callout
                                className="ms-CalloutExample-callout"
                                target={_calloutTarget1}
                                directionalHint={DirectionalHint.leftCenter}
                                isBeakVisible={true}
                                gapSpace={10}
                                setInitialFocus={true}
                                onDismiss={() => setCallout1(false)}>

                                <MessageBar messageBarType={MessageBarType.info}>Default - Fully Managed Networking</MessageBar>
                                <div style={{ padding: "10px", maxWidth: "450px" }}>
                                    <Text >
                                        Select this option if you <Text style={{ fontWeight: "bold" }} > don't</Text> require any custom IP settings, so you are not peering with other VNETs or On-Premises networks
                                        This is the simplest AKS deployment to operate, it provides a <Text style={{ fontWeight: "bold" }} > managed</Text> network setup, including:
                                    </Text>
                                    <ul>
                                        <li>New Dedicated VNET with private IP range for your agents nodes</li>
                                        <li>Container Networking (default: CNI)</li>
                                        <li>Standard LoadBalancer for kubernetes services with outbound rule for internet access</li>
                                    </ul>
                                </div>
                            </Callout>
                        )}


                        {callout1 && net.vnet_opt === 'custom' && (
                            <Callout
                                className="ms-CalloutExample-callout"
                                target={_calloutTarget1}
                                directionalHint={DirectionalHint.leftCenter}
                                isBeakVisible={true}
                                gapSpace={10}
                                setInitialFocus={true}
                                onDismiss={() => setCallout1(false)}>

                                <MessageBar messageBarType={MessageBarType.warning}>Custom Networking - Advanced Setup</MessageBar>
                                <div style={{ padding: "10px", maxWidth: "500px" }}>
                                    <Text >
                                        Select this option if you will you would like the helper to create a new VNET with specific ranges, use this option if you need to:
                                        <ul>
                                            <li>Connect your AKS network with another networks</li>
                                            <li>You will be VNET peering or using an ExpressRoute or VPN Gateway</li>
                                        </ul>
                                    </Text>
                                </div>
                            </Callout>
                        )}

                        {callout1 && net.vnet_opt === 'byo' && (
                            <Callout
                                className="ms-CalloutExample-callout"
                                target={_calloutTarget1}
                                directionalHint={DirectionalHint.leftCenter}
                                isBeakVisible={true}
                                gapSpace={10}
                                setInitialFocus={true}
                                onDismiss={() => setCallout1(false)}>

                                <MessageBar messageBarType={MessageBarType.warning}>Bring your own Networking - Advanced Setup</MessageBar>
                                <div style={{ padding: "10px", maxWidth: "500px" }}>
                                    <Text >
                                        Select this option if you will be deploying AKS into an existing network configuration, for example.
                                    </Text>

                                    <ul>
                                        <li>If you are implementing the Secure Baseline Architecture <Link target="_" href="https://docs.microsoft.com/azure/architecture/reference-architectures/containers/aks/secure-baseline-aks">here</Link>
                                            <Image imageFit={ImageFit.CenterContain} width="100%" src="./secure-baseline-architecture.svg" /></li>
                                        <li>If you will deploy AKS into a pre-existing VNET, managed by a networking team</li>
                                    </ul>
                                </div>
                            </Callout>
                        )}
                    </Stack.Item>
                </Stack>
            </Stack.Item>

            {net.vnet_opt === 'custom' ?
                <CustomVNET addons={addons} net={net} updateFn={updateFn} invalidArray={invalidArray} />
                : net.vnet_opt === 'byo' &&
                <BYOVNET addons={addons} net={net} updateFn={updateFn} invalidArray={invalidArray} />
            }
        </Stack>
    )
}

function PodServiceNetwork({ net, updateFn, invalidArray }) {
    return (
        <Stack {...columnProps}>
            <Label>Kubernetes Networking Configuration</Label>
            <Stack.Item styles={{root: {width: '380px'}}} align="start">
                <TextField
                prefix="Cidr" label="POD Network"
                disabled={net.networkPlugin !== 'kubenet' && !net.cniDynamicIpAllocation && !net.networkPluginMode}
                onChange={(ev, val) => updateFn("podCidr", val)}
                value={net.networkPlugin === 'kubenet' || net.cniDynamicIpAllocation || net.networkPluginMode ? net.podCidr : "Using CNI, POD IPs from subnet"}
                maxLength={18}
                errorMessage={net.networkPlugin === 'kubenet' || net.cniDynamicIpAllocation || net.networkPluginMode ? getError(invalidArray, 'podCidr') : ''} />
            </Stack.Item>
            <Stack.Item styles={{root: {width: '380px'}}} align="start">
                <TextField
                prefix="Cidr" label="Service Network"
                onChange={(ev, val) => updateFn("serviceCidr", val)}
                value={net.serviceCidr}
                errorMessage={getError(invalidArray, 'serviceCidr')} />
                <MessageBar messageBarType={MessageBarType.warning}>Address space that isn't in use elsewhere in your network environment <a target="_target" href="https://docs.microsoft.com/en-us/azure/aks/configure-kubenet#create-an-aks-cluster-in-the-virtual-network">docs</a></MessageBar>
            </Stack.Item>
            <Stack.Item styles={{root: {width: '380px'}}} align="start">
                <TextField
                prefix="IP" label="DNS Service IP"
                onChange={(ev, val) => updateFn("dnsServiceIP", val)}
                value={net.dnsServiceIP}
                errorMessage={getError(invalidArray, 'dnsServiceIP')} />
                <MessageBar messageBarType={MessageBarType.warning}>Ensure its an address within the Service CIDR above <a target="_target" href="https://docs.microsoft.com/en-us/azure/aks/configure-kubenet#create-an-aks-cluster-in-the-virtual-network">docs</a></MessageBar>
            </Stack.Item>

        </Stack>
    )
}

function BYOVNET({ net, addons, updateFn, invalidArray }) {
    return (

        <Stack styles={adv_stackstyle}>

            <Label>Bring your Own VNET and Subnets</Label>
            <MessageBar>Get your user subnet by running <Label>az network vnet subnet show --vnet-name `{'<net name>'}` -g `{'<vnet rg>'}` -n `{'<subnet name>'}` --query "id"</Label></MessageBar>
            <TextField value={net.byoAKSSubnetId} onChange={(ev, v) => updateFn("byoAKSSubnetId", v)} errorMessage={getError(invalidArray, 'byoAKSSubnetId')} required placeholder="Resource Id" label={<Text style={{ fontWeight: 600 }}>Enter your existing AKS Nodes subnet ResourceId</Text>} />

            <Separator className="notopmargin" />
            <TextField disabled={!net.cniDynamicIpAllocation} value={net.byoAKSPodSubnetId} onChange={(ev, v) => updateFn("byoAKSPodSubnetId", v)} errorMessage={getError(invalidArray, 'byoAKSPodSubnetId')} required placeholder="Resource Id" label={<Text style={{ fontWeight: 600 }}>Enter your existing AKS Pods subnet ResourceId</Text>} />
            <Separator/>

            <TextField disabled={addons.ingress !== 'appgw'} value={net.byoAGWSubnetId} onChange={(ev, v) => updateFn("byoAGWSubnetId", v)} errorMessage={getError(invalidArray, 'byoAGWSubnetId')} required placeholder="Resource Id" label={<Text style={{ fontWeight: 600 }}>Enter your existing Application Gateway subnet ResourceId</Text>} />
            <MessageBar messageBarType={MessageBarType.warning}>Ensure your Application Gateway subnet meets these requirements <Link href="https://docs.microsoft.com/en-us/azure/application-gateway/configuration-infrastructure#size-of-the-subnet">here</Link></MessageBar>

            <Separator/>
            <PodServiceNetwork net={net} updateFn={updateFn} invalidArray={invalidArray} />

        </Stack>
    )
}


function CustomVNET({ net, addons, updateFn, invalidArray }) {
    return (
        <Stack styles={adv_stackstyle}>
            <Label>Custom Network VNET & Kubernetes Network Configuration</Label>
            <Stack horizontal tokens={{ childrenGap: 50 }} styles={{ root: { width: 650 } }}>
                <Stack {...columnProps}>

                    <Stack.Item align="start">
                        <TextField
                        prefix="Cidr"
                        label="VNET Address space"
                        onChange={(ev, val) => updateFn("vnetAddressPrefix", val)}
                        value={net.vnetAddressPrefix}
                        errorMessage={getError(invalidArray, 'vnetAddressPrefix')} />
                    </Stack.Item>
                    <Stack.Item style={{ marginLeft: "20px"}}>
                        <TextField
                        prefix="Cidr"
                        label="AKS Nodes subnet"
                        onChange={(ev, val) => updateFn("vnetAksSubnetAddressPrefix", val)}
                        value={net.vnetAksSubnetAddressPrefix}
                        errorMessage={getError(invalidArray, 'vnetAksSubnetAddressPrefix')} />
                    </Stack.Item>
                    {/*
                <Stack.Item align="center">
                  <TextField prefix="Cidr" label="LoadBalancer Services subnet" onChange={(ev, val) => updateFn("ilbsub", val)} value={net.ilbsub} />
                </Stack.Item>
                */}
                    <Stack.Item style={{ marginLeft: "20px"}}>
                        <TextField prefix="Cidr" disabled={!net.afw} label="Azure Firewall subnet" onChange={(ev, val) => updateFn("vnetFirewallSubnetAddressPrefix", val)} value={net.afw ? net.vnetFirewallSubnetAddressPrefix : "No Firewall requested"} />
                    </Stack.Item>

                    <Stack.Item style={{ marginLeft: "20px"}}>
                        <TextField prefix="Cidr" disabled={!net.afw || net.azureFirewallSku!=='Basic'} label="Azure Firewall management subnet" onChange={(ev, val) => updateFn("vnetFirewallManagementSubnetAddressPrefix", val)} value={net.afw ? (net.azureFirewallSku==='Basic' ? net.vnetFirewallManagementSubnetAddressPrefix : 'Management subnet for Basic SKU') : "No Firewall requested"} />
                    </Stack.Item>

                    <Stack.Item style={{ marginLeft: "20px"}}>
                        <TextField prefix="Cidr" disabled={addons.ingress !== 'appgw'} label="Application Gateway subnet" onChange={(ev, val) => updateFn("vnetAppGatewaySubnetAddressPrefix", val)} value={addons.ingress === 'appgw' ? net.vnetAppGatewaySubnetAddressPrefix : "No Application Gateway requested"} />
                        <MessageBar messageBarType={MessageBarType.warning}>Ensure your Application Gateway subnet meets <Link href="https://docs.microsoft.com/en-us/azure/application-gateway/configuration-infrastructure#size-of-the-subnet">these</Link> requirements</MessageBar>
                    </Stack.Item>

                    <Stack.Item style={{ marginLeft: "20px"}}>
                        <TextField prefix="Cidr" disabled={!net.vnetprivateend || addons.registry === "none" || !addons.acrPrivatePool  } label="ACR Private Agent Pool subnet" onChange={(ev, val) => updateFn("acrAgentPoolSubnetAddressPrefix", val)} value={net.vnetprivateend && addons.registry !== "none" && addons.acrPrivatePool  ? net.acrAgentPoolSubnetAddressPrefix : "No Agent Pool requested"} />
                    </Stack.Item>

                    <Stack.Item style={{ marginLeft: "20px"}}>
                        <TextField prefix="Cidr" disabled={!net.bastion} label="Azure Bastion subnet" onChange={(ev, val) => updateFn("bastionSubnetAddressPrefix", val)} value={net.bastion ? net.bastionSubnetAddressPrefix : "No bastion subnet requested"} />
                    </Stack.Item>

                    <Stack.Item style={{ marginLeft: "20px"}}>
                        <TextField
                        prefix="Cidr" disabled={!net.vnetprivateend}
                        label="Private Endpoint subnet"
                        onChange={(ev, val) => updateFn("privateLinkSubnetAddressPrefix", val)}
                        value={net.vnetprivateend ? net.privateLinkSubnetAddressPrefix : "No Private Endpoints requested"}
                        errorMessage={net.vnetprivateend && getError(invalidArray, 'privateLinkSubnetAddressPrefix')} />
                    </Stack.Item>

                </Stack>

                <PodServiceNetwork net={net} updateFn={updateFn} invalidArray={invalidArray} />
            </Stack>

            <Separator styles={{ root: { marginTop: '20px !important' } }}/>

            <Stack>
                <Stack.Item>
                    <Label>Limit Ingress/Egress subnets with Network Security Groups (NGS's)</Label>
                    <Checkbox inputProps={{ "data-testid": "network-nsg-Checkbox"}} styles={{ root: { marginLeft: '50px', marginTop: '0 !important' } }} disabled={false} checked={net.nsg} onChange={(ev, v) => updateFn("nsg", v)} label="Create NSG's for each subnet" />
                </Stack.Item>

                <Stack.Item style={{ marginTop: "20px"}}>
                    <Label>Capture NSG Flow Logs with Network Watcher</Label>
                    <Checkbox inputProps={{ "data-testid": "network-nsgFlowLogs-Checkbox"}} styles={{ root: { marginLeft: '50px', marginTop: '0 !important' } }} disabled={!net.nsg} checked={net.nsgFlowLogs} onChange={(ev, v) => updateFn("nsgFlowLogs", v)} label="Configure NSG Flow Logs" />
                </Stack.Item>
            </Stack>
        </Stack>
    )
}
