/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import { TextField, Link, Separator, Dropdown, Slider, Stack, Text, Label, ChoiceGroup, Checkbox, MessageBar, MessageBarType } from '@fluentui/react';
import { adv_stackstyle, hasError, getError } from './common'


export default function ({ tabValues, updateFn, featureFlag, invalidArray }) {
    const { addons, net } = tabValues
    const osmFeatureFlag = featureFlag.includes('osm')
    return (
        <Stack tokens={{ childrenGap: 15 }} styles={adv_stackstyle}>

            <Stack.Item align="start">
                <Label required={true}>
                    Do you require a secure private container registry to store my application images
                </Label>
                <ChoiceGroup
                    styles={{ root: { marginLeft: '50px' } }}
                    selectedKey={addons.registry}
                    options={[
                        { key: 'none', text: 'No, my application images will be on DockerHub or another registry' },
                        { key: 'Basic', text: 'Yes, setup Azure Container Registry "Basic" tier & authorise aks to pull images' },
                        { key: 'Standard', text: 'Yes, setup Azure Container Registry "Standard" tier (minimum recommended for production)' },
                        { key: 'Premium', text: 'Yes, setup Azure Container Registry "Premium" tier (required for Private Link)' }
                    ]}
                    onChange={(ev, { key }) => updateFn("registry", key)}
                />
                {hasError(invalidArray, 'registry') &&
                    <MessageBar styles={{ root: { marginLeft: '50px', width: '700px' } }} messageBarType={MessageBarType.error}>{getError(invalidArray, 'registry')}</MessageBar>
                }

            </Stack.Item>



            <Stack.Item align="center" styles={{ root: { width: '700px' }}}>
                <Checkbox disabled={addons.registry === "none" || !net.vnetprivateend} checked={addons.acrPrivatePool} onChange={(ev, v) => updateFn("acrPrivatePool", v)} label={<Text>Create ACR Private Agent Pool (private link only) (preview limited regions <a target="_new" href="https://docs.microsoft.com/azure/container-registry/tasks-agent-pools">docs</a>)</Text>} />
                <Stack horizontal styles={{ root: { marginLeft: "50px" } }}>
                    <TextField disabled={true} label="Agent Pool" defaultValue="S1"/>
                    <TextField disabled={true} label="O/S" defaultValue="Linux"/>
                    <TextField disabled={true} label="Agent Count" defaultValue="1"/>
                </Stack>
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item align="start">
                <Label required={true}>
                    Securely Expose your applications via Layer 7 HTTP(S) proxies (Ingress Controller)
                </Label>
                <ChoiceGroup
                    styles={{ root: { marginLeft: '50px' } }}
                    selectedKey={addons.ingress}
                    options={[
                        { key: 'none', text: 'No, I do not need a Layer7 proxy, or I will configure my own solution' },
                        { key: 'appgw', text: 'Yes, I want a Azure Managed Application Gateway with WAF protection' },
                        { key: 'contour', text: 'Yes, deploy contour in the cluster to expose my apps to the internet (https://projectcontour.io/)' },
                        { key: 'nginx', text: 'Yes, deploy nginx in the cluster to expose my apps to the internet (nginx ingress controller)' }

                    ]}
                    onChange={(ev, { key }) => updateFn("ingress", key)}
                />
                {hasError(invalidArray, 'ingress') &&
                    <MessageBar styles={{ root: { marginTop: '20px', marginLeft: '100px', width: '700px' } }} messageBarType={MessageBarType.error}>{getError(invalidArray, 'ingress')}</MessageBar>
                }
            </Stack.Item>

            <Stack.Item align="center" styles={{ root: { maxWidth: '700px', display: (addons.ingress === "none" ? "none" : "block") } }} >
                <Stack tokens={{ childrenGap: 15 }}>
                    {addons.ingress === "nginx" && false &&
                        <MessageBar messageBarType={MessageBarType.warning}>You requested a high security cluster & nginx public ingress. Please ensure you follow this information after deployment <Link target="_ar1" href="https://docs.microsoft.com/en-us/azure/firewall/integrate-lb#public-load-balancer">Asymmetric routing</Link></MessageBar>
                    }
                    {addons.ingress !== "none" && false &&
                        <MessageBar messageBarType={MessageBarType.warning}>You requested a high security cluster. The DNS and Certificate options are disabled as they require additional egress application firewall rules for image download and webhook requirements. You can apply these rules and install the helm chart after provisioning</MessageBar>
                    }

                    {addons.ingress === "appgw" && (

                        net.vnet_opt === 'default' ?
                            <MessageBar messageBarType={MessageBarType.warning}>Using default networking, so addon will provision default Application Gateway instance, for more options, select custom networking in the network tab</MessageBar>
                            :
                            <>
                                <MessageBar messageBarType={MessageBarType.warning}>Custom or BYO networking is requested, so template will provision a new Application Gateway</MessageBar>

                                <Checkbox inputProps={{ 'data-testid': "addons-ingress-appgwKVIntegration-Checkbox"}} checked={addons.appgwKVIntegration} onChange={(ev, v) => updateFn("appgwKVIntegration", v)} label={<Text>Enable KeyVault Integration for TLS Certificates (<Link target="_ar1" href="https://docs.microsoft.com/en-us/azure/application-gateway/key-vault-certs">docs</Link>) </Text>} />
                                {hasError(invalidArray, 'appgwKVIntegration') &&
                                    <MessageBar styles={{ root: { marginTop: '0px !important' } }} messageBarType={MessageBarType.error}>{getError(invalidArray, 'appgwKVIntegration')}</MessageBar>
                                }

                                <Stack.Item>
                                    <Label style={{ marginBottom: "0px" }}>Application Gateway Type (<Link target='_' href='https://docs.microsoft.com/en-us/azure/web-application-firewall/ag/ag-overview'>docs</Link>)</Label>
                                    <ChoiceGroup
                                        selectedKey={addons.appGWsku}
                                        options={[
                                            { key: 'Standard_v2', text: 'Standard_v2: Standard Application Gateway' },
                                            { key: 'WAF_v2', text: 'WAF_v2: Web Application Firewall (WAF) on Application Gateway' }
                                        ]}
                                        onChange={(ev, { key }) => updateFn("appGWsku", key)}
                                    />
                                </Stack.Item>

                                { addons.appGWsku === 'WAF_v2' &&
                                    <Stack.Item style={{ marginLeft: "20px"}}>
                                        <Checkbox checked={addons.appGWenableFirewall} onChange={(ev, v) => updateFn("appGWenableFirewall", v)} label={<Text>Enable Firewall: Provides centralized protection of your web applications from common exploits and vulnerabilities</Text>} />

                                        { addons.appGWenableFirewall &&
                                            <Stack.Item style={{ marginLeft: "25px"}}>
                                                <Label style={{ marginBottom: "0px", marginTop: "5px" }}>WAF mode</Label>
                                                <ChoiceGroup
                                                    style={{marginBottom: "0px", marginTop: "0px" }}
                                                    selectedKey={addons.appGwFirewallMode}
                                                    options={[
                                                        { key: 'Prevention', text: 'Prevention:   Blocks intrusions and attacks that the rules detect' },
                                                        { key: 'Detection', text: 'Detection:   Monitors and logs all threat alerts.' }
                                                    ]}
                                                    onChange={(ev, { key }) => updateFn("appGwFirewallMode", key)}
                                                />
                                            </Stack.Item>
                                        }
                                    </Stack.Item>
                                }

                                <Label style={{ marginBottom: "0px" }}>Capacity</Label>
                                <Stack horizontal tokens={{ childrenGap: 150 }} styles={{ root: { marginTop: '0px !important' } }}>
                                    <Stack.Item>
                                        <ChoiceGroup selectedKey={addons.appGWautoscale} onChange={(ev, { key }) => updateFn("appGWautoscale", key)}
                                            options={[
                                                {
                                                    key: false,
                                                    text: 'Manual'
                                                }, {
                                                    key: true,
                                                    text: 'Autoscale'
                                                }
                                            ]} />
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Stack tokens={{ childrenGap: 0 }} styles={{ root: { width: 450 } }}>
                                            <Slider label={`${addons.appGWautoscale ? "Minimum instance count" : "Instance count"}`} min={addons.appGWautoscale ? 0 : 1} max={125} step={1} defaultValue={addons.appGWcount} showValue={true}
                                                onChange={(v) => updateFn("appGWcount", v)} />
                                            {addons.appGWautoscale && (
                                                <Slider label="Maximum instance count" min={2} max={125} step={1} defaultValue={addons.appGWmaxCount} showValue={true}
                                                    onChange={(v) => updateFn("appGWmaxCount", v)}
                                                    snapToStep />
                                            )}
                                        </Stack>
                                    </Stack.Item>
                                </Stack>

                                <Checkbox checked={addons.appgw_privateIp} onChange={(ev, v) => updateFn("appgw_privateIp", v)} label={<Text>Use a Private Frontend IP for Ingress (<Link target="_ar1" href="https://docs.microsoft.com/en-us/azure/application-gateway/ingress-controller-private-ip">docs</Link>)</Text>} />
                                {addons.appgw_privateIp &&
                                    <TextField value={addons.appgw_privateIpAddress} onChange={(ev, v) => updateFn("appgw_privateIpAddress", v)} errorMessage={getError(invalidArray, 'appgw_privateIpAddress')} required placeholder="Resource Id" label={<Text style={{ fontWeight: 600 }}>Enter Private IP address from the AppGW CIDR subnet range (<b>{net.vnet_opt === 'custom' ? net.vnetAppGatewaySubnetAddressPrefix : 'examine BYO subnet range'}</b>)</Text>} />
                                }
                            </>)
                    }

                    {(addons.ingress === "contour" || addons.ingress === "nginx" || addons.ingress === "appgw") &&
                        <>
                            <Checkbox inputProps={{ "data-testid": "addons-dns"}} checked={addons.dns} onChange={(ev, v) => updateFn("dns", v)} label={
                                <Text>Create FQDN URLs for your applications using
                                    <Link target="_t1" href="https://github.com/kubernetes-sigs/external-dns"> <b>external-dns</b> </Link>
                                    (requires Azure <Link href="https://docs.microsoft.com/en-us/azure/dns/dns-getstarted-portal#create-a-dns-zone" target="_t1"> <b>Public</b> </Link> or <Link href="https://docs.microsoft.com/en-us/azure/dns/private-dns-getstarted-portal" target="_t1"> <b>Private</b> </Link> DNS Zone)
                                </Text>} />
                            {addons.dns &&
                                <>
                                    <MessageBar messageBarType={MessageBarType.warning}>If using a Public DNS Zone, you need to own a custom domain, you can easily purchase a custom domain through Azure <Link target="_t1" href="https://docs.microsoft.com/en-us/azure/app-service/manage-custom-dns-buy-domain"> <b>details here</b></Link></MessageBar>
                                    <TextField value={addons.dnsZoneId} onChange={(ev, v) => updateFn("dnsZoneId", v)} errorMessage={getError(invalidArray, 'dnsZoneId')} required placeholder="Resource Id" label={<Text style={{ fontWeight: 600 }}>Enter your Public or Private Azure DNS Zone ResourceId <Link target="_t2" href="https://ms.portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FdnsZones">find it here</Link></Text>} />


                                    <Checkbox inputProps={{ "data-testid": "addons-certMan"}} disabled={hasError(invalidArray, 'dnsZoneId')} checked={addons.certMan} onChange={(ev, v) => updateFn("certMan", v)} label="Automatically Issue Certificates for HTTPS using cert-manager (with Lets Encrypt - requires email" />
                                    {addons.certMan &&
                                        <TextField value={addons.certEmail} onChange={(ev, v) => updateFn("certEmail", v)} errorMessage={getError(invalidArray, 'certEmail') ? "Enter valid email" : ''} label="Enter mail address for certificate notification:" required />
                                    }
                                </>
                            }
                        </>
                    }

                    {(addons.ingress === "nginx" || addons.ingress === "contour") &&
                        <Checkbox checked={addons.ingressEveryNode} onChange={(ev, v) => updateFn("ingressEveryNode", v)} label={<Text>Run proxy on every node (deploy as Daemonset)</Text>} />
                    }

                </Stack>
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item align="start">
                <Label >Cluster Monitoring requirements</Label>
                <MessageBar>Observing your clusters health is critical to smooth operations, select the managed Azure Monitor for Containers option, or the open source CNCF Prometheus/Grafana solution</MessageBar>
                <ChoiceGroup
                    styles={{ root: { marginLeft: '50px' } }}
                    selectedKey={addons.monitor}
                    options={[
                        { key: 'none', text: 'None' },
                        { key: 'aci', text: 'Azure Monitor for Containers (logs and metrics)' },
                        { key: 'oss', text: 'Prometheus / Grafana Helm Chart (metrics only)' }

                    ]}
                    onChange={(ev, { key }) => updateFn("monitor", key)}
                />
            </Stack.Item>

            {addons.monitor === 'oss' && (addons.ingress === "contour" || addons.ingress === "nginx" || addons.ingress === "appgw") && addons.dns && addons.certMan &&
                <Stack.Item align="center" styles={{ root: { maxWidth: '700px'}}}>
                    <MessageBar messageBarType={MessageBarType.warning}>This will expose your your grafana dashboards to the internet, please login and change the default credentials asap (admin/prom-operator)</MessageBar>
                    <Checkbox styles={{ root: { marginTop: '10px'}}} checked={addons.enableMonitorIngress} onChange={(ev, v) => updateFn("enableMonitorIngress", v)} label={`Enable Public Ingress for Grafana (https://grafana.${addons.dnsZoneId && addons.dnsZoneId.split('/')[8]})`} />
                </Stack.Item>

            }

            { addons.monitor === "aci" &&
                <Stack.Item align="center" styles={{ root: { maxWidth: '700px'}}}>
                    <Dropdown
                        label="Log and Metrics Data Retention (Days)"
                        onChange={(ev, { key }) => updateFn("retentionInDays", key)} selectedKey={addons.retentionInDays}
                        options={[
                            { key: 30, text: '30 Days' },
                            { key: 60, text: '60 Days' },
                            { key: 90, text: '90 Days' },
                            { key: 120, text: '120 Days' },
                            { key: 180, text: '180 Days' },
                            { key: 270, text: '270 Days' },
                            { key: 365, text: '365 Days' }
                        ]}
                    />

                    <Checkbox styles={{ root: { marginTop: '10px'}}} checked={addons.createAksMetricAlerts} onChange={(ev, v) => updateFn("createAksMetricAlerts", v)} label={<Text>Create recommended metric alerts, enable you to monitor your system resource when it's running on peak capacity or hitting failure rates (<Link target="_target" href="https://azure.microsoft.com/en-us/updates/ci-recommended-alerts/">docs</Link>) </Text>} />

                </Stack.Item>
            }

            <Separator className="notopmargin" />

            <Stack.Item align="start">

                <Label >Azure Policy, to manage and report on the compliance state of your Kubernetes clusters</Label>
                <MessageBar>Azure Policy extends Gatekeeper v3, an admission controller webhook for Open Policy Agent (OPA), to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner.
                </MessageBar>
                <ChoiceGroup
                    styles={{ root: { marginLeft: '50px' } }}
                    selectedKey={addons.azurepolicy}
                    options={[
                        { key: 'none', text: 'No restrictions, users can deploy any kubernetes workloads' },
                        { key: 'audit', text: 'AUDIT non-compliant Linux-based workloads with the set of cluster pod security baseline standards' },
                        { key: 'deny', text: 'BLOCK non-compliant Linux-based workloads with the set of cluster pod security baseline standards' }
                    ]}
                    onChange={(ev, { key }) => updateFn("azurepolicy", key)}
                />
                {addons.azurepolicy !== 'none' &&
                <Stack.Item align="center" styles={{ root: { maxWidth: '700px'}}}>
                    <Dropdown
                        label="Pod Security Policy"
                        onChange={(ev, { key }) => updateFn("azurePolicyInitiative", key)} selectedKey={addons.azurePolicyInitiative}
                        styles={{ root: {  marginTop: '20px', marginLeft: '100px', width: '700px' } }}
                        options={[
                            { key: 'Baseline', text: 'Baseline pod security standards' },
                            { key: 'Restricted', text: 'Restricted pod security standards' }
                        ]}
                    />
                    <MessageBar messageBarType={MessageBarType.success} styles={{ root: { marginTop: '20px', marginLeft: '100px', width: '700px' } }}>
                        The baseline policy will automatically assign and <b>{addons.azurepolicy}</b> the following <Link target="_target" href="https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Kubernetes/Kubernetes_PSPBaselineStandard.json">Policies</Link>:
                        <ul>
                            <li>Do not allow privileged containers in Kubernetes cluster</li>
                            <li>Kubernetes cluster pods should only use approved host network and port range</li>
                            <li>Kubernetes cluster containers should not share host process ID or host IPC namespace</li>
                            <li>Kubernetes cluster containers should only use allowed capabilities</li>
                            <li>Kubernetes cluster pod hostPath volumes should only use allowed host paths</li>
                        </ul>

                        The restricted policy will additionally automatically assign and <b>{addons.azurepolicy}</b> the following <Link target="_target" href="https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Kubernetes/Kubernetes_PSPRestrictedStandard.json">Policies</Link>:
                        <ul>
                            <li>Kubernetes cluster containers should only use allowed seccomp profiles</li>
                            <li>Kubernetes cluster pods should only use allowed volume types</li>
                            <li>Kubernetes cluster pods and containers should only run with approved user and group IDs</li>
                        </ul>

                        To review these policies and browse other policies that can be applied at other scopes, see the <Link target="_target" href="https://docs.microsoft.com/azure/aks/policy-reference">Policy Docs</Link>
                    </MessageBar>
                </Stack.Item>
                }
            </Stack.Item>
            <Separator className="notopmargin" />
            <Stack.Item align="start">
                <Label >Cluster East-West traffic restrictions (Network Policies)</Label>
                <MessageBar>Control which components can communicate with each other. The principle of least privilege should be applied to how traffic can flow between pods in an Azure Kubernetes Service (AKS) cluster</MessageBar>
                <ChoiceGroup
                    styles={{ root: { marginLeft: '50px' } }}
                    selectedKey={addons.networkPolicy}
                    options={[
                        { "data-testid":'addons-netpolicy-none', key: 'none', text: 'No restrictions, all PODs can access each other' },
                        { "data-testid":'addons-netpolicy-calico', key: 'calico', text: 'Use Network Policy addon with Calico to implemented intra-cluster traffic restrictions (driven from "NetworkPolicy" objects)' },
                        { "data-testid":'addons-netpolicy-azure', key: 'azure', text: 'Use Network Policy addon with Azure provider to implemented intra-cluster traffic restrictions (driven from "NetworkPolicy" objects)' }

                    ]}
                    onChange={(ev, { key }) => updateFn("networkPolicy", key)}
                />
            </Stack.Item>

            <Stack.Item align="center" styles={{ root: { maxWidth: '700px', display: (addons.networkPolicy === "none" ? "none" : "block") } }} >
                <Stack tokens={{ childrenGap: 15 }}>
                    <MessageBar messageBarType={MessageBarType.warning}>A Default Deny Network Policy provides an enhanced security posture. Pods without policy are not allowed traffic. Please use caution, with apps that you know have policy defined.</MessageBar>
                    <Checkbox inputProps={{ "data-testid": "addons-netpolicy-denydefault-Checkbox"}} disabled={addons.networkPolicy === 'none'} checked={addons.denydefaultNetworkPolicy} onChange={(ev, v) => updateFn("denydefaultNetworkPolicy", v)} label="Create a default deny policy in the default namespace" />
                </Stack>
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item align="start">
                <Label required={true}>
                    CSI Secrets : Store Kubernetes Secrets in Azure KeyVault, using AKS Managed Identity
                    (<a target="_new" href="https://docs.microsoft.com/en-us/azure/aks/csi-secrets-store-driver">docs</a>)
                </Label>
                <ChoiceGroup
                    styles={{ root: { marginLeft: '50px' } }}
                    selectedKey={addons.csisecret}
                    options={[
                        { key: 'none', text: 'No, I am happy to use the default Kubernetes secret storage, or I will configure my own solution' },
                        { key: 'akvExist', text: 'Yes, store secrets in an existing KeyVault & enable Secrets Store CSI Driver' },
                        { key: 'akvNew', text: 'Yes, provision a new Azure KeyVault & enable Secrets Store CSI Driver' }
                    ]}
                    onChange={(ev, { key }) => updateFn("csisecret", key)}
                />
            </Stack.Item>

            <Stack.Item align="center" styles={{ root: { minWidth: '700px', display: (addons.csisecret === "none" ? "none" : "block") } }} >
                <Stack tokens={{ childrenGap: 15 }}>
                    {addons.csisecret === "akvExist" &&
                        <TextField value={addons.kvId} onChange={(ev, v) => updateFn("kvId", v)} errorMessage={getError(invalidArray, 'kvId')} required placeholder="Resource Id" label={<Text style={{ fontWeight: 600 }}>Enter your Azure Key Vault Resource Id</Text>} />
                    }
                </Stack>
            </Stack.Item>

            { osmFeatureFlag &&
            <>
                <Separator className="notopmargin" />

                <Stack.Item align="start">
                    <Label required={true}>
                        Open Service Mesh : Enable Open Service Mesh on the AKS Cluster
                        (<a target="_new" href="https://docs.microsoft.com/azure/aks/open-service-mesh-about">docs</a>)
                    </Label>
                    <Checkbox styles={{ root: { marginLeft: '50px' } }} inputProps={{ "data-testid": "addons-osm-Checkbox"}} checked={addons.openServiceMeshAddon} onChange={(ev, v) => updateFn("openServiceMeshAddon", v)} label="Install the Open Service Mesh AddOn" />
                </Stack.Item>
            </>}

            {/*
        <ChoiceGroup
          label='Enable gitops'
          selectedKey={addons.gitops}
          options={[
            { key: 'none', text: 'No, I will manage my kubernetes deployments manually' },
            { key: 'yes', text: 'Yes, enable gitops' }
          ]}
          onChange={(ev, { key }) => updateFn("gitops", key)}
        />
        */}
        </Stack >
    )
}
