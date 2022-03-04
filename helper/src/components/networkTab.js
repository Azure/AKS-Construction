
import React, { useState } from 'react';
import { Image, ImageFit, Link, Separator, TextField, DirectionalHint, Callout, Stack, Text, Label, ChoiceGroup, Checkbox, MessageBar, MessageBarType } from '@fluentui/react';
import { adv_stackstyle, hasError, getError } from './common'

const columnProps = {
    tokens: { childrenGap: 20 },
    styles: { root: { minWidth: 380 } }
}


export default function NetworkTab ({ tabValues, updateFn, invalidArray, featureFlag }) {

    const [callout1, setCallout1] = useState(false)

    const { net, addons } = tabValues
    var _calloutTarget1 = React.createRef()

    return (
        <Stack tokens={{ childrenGap: 15 }} styles={adv_stackstyle}>

            <Stack.Item>
                <Label required={true}>Network Plugin</Label>
                <MessageBar>Typically, only use "kubenet" networking if you need to limit your non-routable IP usage on your network (use network calculator)
                </MessageBar>
                <ChoiceGroup
                    styles={{ root: { marginLeft: '50px' } }}
                    selectedKey={net.networkPlugin}
                    options={[
                        { key: 'kubenet', text: 'Use "kubenet" basic networking, so your PODs DO NOT receive VNET IPs' },
                        { key: 'azure', text: 'Use "CNI" for fastest container networking, but using more IPs' }

                    ]}
                    onChange={(ev, { key }) => updateFn("networkPlugin", key)}
                />
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item>
                <Label>Deploy Azure firewall for your cluster egress (Custom VNet Only)</Label>
                {hasError(invalidArray, 'afw') &&
                    <MessageBar messageBarType={MessageBarType.error}>{getError(invalidArray, 'afw')}</MessageBar>
                }
                <Checkbox styles={{ root: { marginLeft: '50px', marginTop: '10 !important' } }} disabled={false} errorMessage={getError(invalidArray, 'afw')} checked={net.afw} onChange={(ev, v) => updateFn("afw", v)} label="Implement Azure Firewall & UDR next hop" />

            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item>
                <Label>Uses a private IP address from your VNet to access your dependent Azure service, such as Azure KeyVault, Azure Container Registry etc</Label>
                <Checkbox styles={{ root: { marginLeft: '50px', marginTop: '0 !important' } }} disabled={false} checked={net.vnetprivateend} onChange={(ev, v) => updateFn("vnetprivateend", v)} label="Enable Private Link" />
            </Stack.Item>

            <Stack.Item>
                <Label>Use Azure Bastion to facilitate RDP/SSH public internet inbound access into your virtual network</Label>
                <Checkbox inputProps={{ "data-testid": "network-bastion-Checkbox"}} styles={{ root: { marginLeft: '50px', marginTop: '0 !important' } }} disabled={false} checked={net.bastion} onChange={(ev, v) => updateFn("bastion", v)} label="Enable Azure Bastion" />
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
                                        text: 'BYO VNET (TBC)'
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
                <CustomVNET addons={addons} net={net} updateFn={updateFn} />
                : net.vnet_opt === 'byo' &&
                <BYOVNET addons={addons} net={net} updateFn={updateFn} invalidArray={invalidArray} />
            }
        </Stack>
    )
}

function PodServiceNetwork({ net, updateFn }) {
    return (
        <Stack {...columnProps}>
            <Label>Kubernetes Networking Configuration</Label>
            <Stack.Item styles={{root: {width: '380px'}}} align="start">
                <TextField  prefix="Cidr" label="POD Network" disabled={net.networkPlugin !== 'kubenet'} onChange={(ev, val) => updateFn("podCidr", val)} value={net.networkPlugin === 'kubenet' ? net.podCidr : "Using CNI, POD IPs from subnet"} />
            </Stack.Item>
            <Stack.Item styles={{root: {width: '380px'}}} align="start">
                <TextField prefix="Cidr" label="Service Network" onChange={(ev, val) => updateFn("serviceCidr", val)} value={net.serviceCidr} />
                <MessageBar messageBarType={MessageBarType.warning}>Address space that isn't in use elsewhere in your network environment <a target="_target" href="https://docs.microsoft.com/en-us/azure/aks/configure-kubenet#create-an-aks-cluster-in-the-virtual-network">docs</a></MessageBar>
            </Stack.Item>
            <Stack.Item styles={{root: {width: '380px'}}} align="start">
                <TextField prefix="IP" label="DNS Service IP" onChange={(ev, val) => updateFn("dnsServiceIP", val)} value={net.dnsServiceIP} />
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


            <TextField disabled={addons.ingress !== 'appgw'} value={net.byoAGWSubnetId} onChange={(ev, v) => updateFn("byoAGWSubnetId", v)} errorMessage={getError(invalidArray, 'byoAGWSubnetId')} required placeholder="Resource Id" label={<Text style={{ fontWeight: 600 }}>Enter your existing Application Gateway subnet ResourceId</Text>} />
            <MessageBar messageBarType={MessageBarType.warning}>Ensure your Application Gateway subnet meets these requirements <Link href="https://docs.microsoft.com/en-us/azure/application-gateway/configuration-infrastructure#size-of-the-subnet">here</Link></MessageBar>

            <Separator/>
            <PodServiceNetwork net={net} updateFn={updateFn} />

        </Stack>
    )
}


function CustomVNET({ net, addons, updateFn }) {
    return (
        <Stack styles={adv_stackstyle}>
            <Label>Custom Network VNET & Kubernetes Network Configuration</Label>
            <Stack horizontal tokens={{ childrenGap: 50 }} styles={{ root: { width: 650 } }}>
                <Stack {...columnProps}>

                    <Stack.Item align="start">
                        <TextField prefix="Cidr" label="VNET Address space" onChange={(ev, val) => updateFn("vnetAddressPrefix", val)} value={net.vnetAddressPrefix} />
                    </Stack.Item>
                    <Stack.Item style={{ marginLeft: "20px"}}>
                        <TextField prefix="Cidr" label="AKS Nodes subnet" onChange={(ev, val) => updateFn("vnetAksSubnetAddressPrefix", val)} value={net.vnetAksSubnetAddressPrefix} />
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
                        <TextField prefix="Cidr" disabled={!net.vnetprivateend} label="Private Endpoint subnet" onChange={(ev, val) => updateFn("privateLinkSubnetAddressPrefix", val)} value={net.vnetprivateend ? net.privateLinkSubnetAddressPrefix : "No Private Endpoints requested"} />
                    </Stack.Item>

                </Stack>

                <PodServiceNetwork net={net} updateFn={updateFn} />
            </Stack>
        </Stack>
    )
}
