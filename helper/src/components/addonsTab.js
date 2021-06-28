import React from 'react';
import { TextField, Link, Separator, Dropdown, Stack, Text, Label, ChoiceGroup, Checkbox, MessageBar, MessageBarType } from '@fluentui/react';
import { adv_stackstyle, hasError, getError } from './common'


export default function ({ tabValues, updateFn, invalidArray }) {
    const { addons, net, deploy } = tabValues
    return (
        <Stack tokens={{ childrenGap: 15 }} styles={adv_stackstyle}>

            <Stack.Item align="start">
                <Label >Cluster Monitoring requirements</Label>
                <MessageBar>Observing your clusters health is critical to smooth operations, select the managed Azure Monior for Containers option, or the opensource CNCF Promethous/Grafana solution</MessageBar>
                <ChoiceGroup
                    styles={{ root: { marginLeft: '50px' } }}
                    selectedKey={addons.monitor}
                    options={[
                        { key: 'none', text: 'None' },
                        { key: 'aci', text: 'Azure Monitor for Containers (logs and metrics)' },
                        { key: 'oss', text: 'Promethous / Grafana Helm Chart (metrics only)' }

                    ]}
                    onChange={(ev, { key }) => updateFn("monitor", key)}
                />
            </Stack.Item>

            <Stack.Item align="center" styles={{ root: { width: '600px', display: (addons.monitor !== "aci" ? "none" : "block") } }} >
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
            </Stack.Item>

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
                        { key: 'audit', text: 'AUDIT complience with the set of cluster pod security baseline standards for Linux-based workloads' },
                        { key: 'deny', text: 'BLOCK and non-complient Linux-based workloads with the set of cluster pod security baseline standards' }
                    ]}
                    onChange={(ev, { key }) => updateFn("azurepolicy", key)}
                />
                {addons.azurepolicy !== 'none' &&
                    <MessageBar messageBarType={addons.azurepolicy === 'audit' ? MessageBarType.success : MessageBarType.blocked} styles={{ root: { marginLeft: '50px', width: '700px' } }}>
                        The template will automatically assign and <b>{addons.azurepolicy}</b> the following <Link target="_target" href="https://github.com/Azure/azure-policy/blob/master/built-in-policies/policySetDefinitions/Kubernetes/Kubernetes_PSPBaselineStandard.json">Policies</Link>:
                        <ul>
                            <li>Do not allow privileged containers in Kubernetes cluster</li>
                            <li>Kubernetes cluster pods should only use approved host network and port range</li>
                            <li>Kubernetes cluster containers should not share host process ID or host IPC namespace</li>
                            <li>Kubernetes cluster containers should only use allowed capabilities</li>
                            <li>Kubernetes cluster pod hostPath volumes should only use allowed host paths</li>
                        </ul>
                    </MessageBar>
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
                        { key: 'none', text: 'No restrictions, all PODs can access each other' },
                        { key: 'calico', text: 'Use Network Pollicy addon with Calico to implemented intra-cluster traffic restrictions (driven from "NetworkPolicy" objects)' },
                        { key: 'azure', text: 'Use Network Pollicy addon with Azure provider to implemented intra-cluster traffic restrictions (driven from "NetworkPolicy" objects)' }

                    ]}
                    onChange={(ev, { key }) => updateFn("networkPolicy", key)}
                />
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
                        { key: 'none', text: 'No, I dont need a Layer7 proxy, or I will configure my own solution' },
                        { key: 'nginx', text: 'Yes, deploy nginx in the cluster to expose my apps to the internet (nginx ingress controller)' },
                        { key: 'appgw', text: 'Yes, I want a Azure Managed Application Gateway with WAF protection' }
                    ]}
                    onChange={(ev, { key }) => updateFn("ingress", key)}
                />
            </Stack.Item>

            <Stack.Item align="center" styles={{ root: { maxWidth: '700px', display: (addons.ingress === "none" ? "none" : "block") } }} >
                <Stack tokens={{ childrenGap: 15 }}>
                    {addons.ingress === "nginx" && false &&
                        <MessageBar messageBarType={MessageBarType.warning}>You requested a high security cluster & nginx public ingress. Please ensure you follow this information after deployment <Link target="_ar1" href="https://docs.microsoft.com/en-us/azure/firewall/integrate-lb#public-load-balancer">Asymmetric routing</Link></MessageBar>
                    }
                    {addons.ingress !== "none" && false &&
                        <MessageBar messageBarType={MessageBarType.warning}>You requested a high security cluster. The DNS and Certificate options are disabled as they require additional egress application firewall rules for image download and webhook requirements. You can apply these rules and install the helm chart after provisioning</MessageBar>
                    }

                    {addons.ingress === "nginx" &&
                        <Checkbox checked={addons.ingressEveryNode} onChange={(ev, v) => updateFn("ingressEveryNode", v)} label={<Text>Run nginx on every node (deploy as Daemonset)</Text>} />
                    }

                    {(addons.ingress === "nginx" || addons.ingress === "appgw") &&
                        <>
                            <Checkbox checked={addons.dns} onChange={(ev, v) => updateFn("dns", v)} label={
                                <Text>Create FQDN URLs for your applications using
                                    <Link target="_t1" href="https://github.com/kubernetes-sigs/external-dns"> <b>external-dns</b> </Link>
                                    (requires <Link href="https://docs.microsoft.com/en-us/azure/dns/dns-getstarted-portal#create-a-dns-zone" target="_t1"> <b>Azure DNS Zone</b> </Link>)
                                </Text>} />
                            <MessageBar messageBarType={MessageBarType.warning}>This feature requires you to own a custom domain, you can easily purchase a custom domain through Azure <Link target="_t1" href="https://docs.microsoft.com/en-us/azure/app-service/manage-custom-dns-buy-domain"> <b>details here</b></Link></MessageBar>
                            {addons.dns &&
                                <>
                                    <TextField value={addons.dnsZoneId} onChange={(ev, v) => updateFn("dnsZoneId", v)} errorMessage={getError(invalidArray, 'dnsZoneId')} required placeholder="Resource Id" label={<Text style={{ fontWeight: 600 }}>Enter your Azure DNS Zone ResourceId <Link target="_t2" href="https://ms.portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FdnsZones">find it here</Link></Text>} />


                                    <Checkbox disabled={hasError(invalidArray, 'dnsZoneId')} checked={addons.certMan} onChange={(ev, v) => updateFn("certMan", v)} label="Automatically Issue Certificates for HTTPS using cert-manager (with Lets Encrypt - requires email" />
                                    {addons.certMan &&
                                        <TextField value={addons.certEmail} onChange={(ev, v) => updateFn("certEmail", v)} errorMessage={getError(invalidArray, 'certEmail') ? "Enter valid email" : ''} label="Enter mail address for certificate notification:" required />
                                    }
                                </>
                            }
                        </>
                    }
                </Stack>
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item align="start">
                <Label required={true}>
                    Do you require a secure private container registry to store my application images
                </Label>
                <ChoiceGroup
                    styles={{ root: { marginLeft: '50px' } }}
                    selectedKey={addons.registry}
                    options={[
                        { key: 'none', text: 'No, my application images will be on dockerhub or another registry' },
                        { key: 'Basic', text: 'Yes, setup Azure Container Registry "Basic" tier & authorise aks to pull images' },
                        { key: 'Standard', text: 'Yes, setup Azure Container Registry "Standard" tier (recommended for production)' },
                        { key: 'Premium', text: 'Yes, setup Azure Container Registry "Premium" tier (required for Service Endpoints & Private Link)' }
                    ]}
                    onChange={(ev, { key }) => updateFn("registry", key)}
                />
                {hasError(invalidArray, 'registry') &&
                    <MessageBar styles={{ root: { marginLeft: '50px', width: '700px' } }} messageBarType={MessageBarType.error}>{getError(invalidArray, 'registry')}</MessageBar>
                }
                {net.serviceEndpointsEnable && net.serviceEndpoints.includes('Microsoft.ContainerRegistry') && addons.registry === 'Premium' &&
                    <MessageBar styles={{ root: { marginLeft: '50px', width: '700px' } }} messageBarType={MessageBarType.warning}>As you have selected Container Registry in Networking Service Endpoint, the templte will only Allow traffic to your Registry from the AKS Subnet, and your specified IP addresses <b>{deploy.apiips.split(',')}</b> (<Link href="https://docs.microsoft.com/en-us/azure/container-registry/container-registry-vnet">docs</Link>) *** Preview feature</MessageBar>
                }
            </Stack.Item>

            <Separator className="notopmargin" />

            <Stack.Item align="start">
                <Label required={true}>
                    Store Kubernetes Secrets in Azure Keyvault, using AKS Managed Identity (**Preview)
                    (<a target="_new" href="https://docs.microsoft.com/en-us/azure/aks/csi-secrets-store-driver">docs</a>)
                </Label>
                <ChoiceGroup
                    styles={{ root: { marginLeft: '50px' } }}
                    selectedKey={addons.csisecret}
                    options={[
                        { key: 'none', text: 'No, I am happy to use the default kuberentes secret storage, or I will configure my own solution' },
                        { key: 'akvExist', text: 'Yes, store secrets in an existing KeyVault & enable Secrets Store CSI Driver' },
                        { key: 'akvNew', text: 'Yes, provision a new Azure KeyVault & enable Secrets Store CSI Driver' }
                    ]}
                    onChange={(ev, { key }) => updateFn("csisecret", key)}
                />
            </Stack.Item>

            <Stack.Item align="center" styles={{ root: { minWidth: '700px', display: (addons.csisecret === "none" ? "none" : "block") } }} >
                <MessageBar messageBarType={MessageBarType.warning}>Ensure you register for this preview feature <Link href="https://docs.microsoft.com/en-us/azure/aks/csi-secrets-store-driver#register-the-aks-azurekeyvaultsecretsprovider-preview-feature">here</Link></MessageBar>
                <Stack tokens={{ childrenGap: 15 }}>
                    {addons.csisecret === "akvExist" &&
                        <TextField value={addons.kvId} onChange={(ev, v) => updateFn("kvId", v)} errorMessage={getError(invalidArray, 'kvId')} required placeholder="Resource Id" label={<Text style={{ fontWeight: 600 }}>Enter your Azure Key Vault Resource Id</Text>} />
                    }
                </Stack>
            </Stack.Item>

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