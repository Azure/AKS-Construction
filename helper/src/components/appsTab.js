import React from 'react';
import { Checkbox, Pivot, PivotItem, Image, TextField, Separator, Stack,  Label, MessageBar, MessageBarType } from '@fluentui/react';

import { adv_stackstyle, CodeBlock } from './common'

export default function AppsTab({  tabValues }) {

    const { addons, deploy, net, cluster } = tabValues
    const aks = `aks-${deploy.clusterName}`

    const deploycmd = `
# Build app
export ACRNAME=$(az acr list -g ${deploy.rg} --query [0].name -o tsv)
az acr build -r $ACRNAME -t openjdk-demo:0.0.1  ${net.vnetprivateend ? "--agent-pool private-pool" : ""} https://github.com/Azure-Samples/java-aks-keyvault-tls.git



# Create backend Certificate in KeyVault
export KVNAME=$(az keyvault list -g ${deploy.rg} --query [0].name -o tsv)
export COMMON_NAME=openjdk-demo
az keyvault certificate create --vault-name $KVNAME -n $COMMON_NAME -p "$(az keyvault certificate get-default-policy | sed -e s/CN=CLIGetDefaultPolicy/CN=$\{COMMON_NAME}/g )"

` +
( addons.ingress === 'appgw' ? `
# Wait for Cert to be issued
sleep 1m

## Create Root Cert reference in AppGW (Required for Self-Signed Cert)
az network application-gateway root-cert create \\
     --gateway-name $(az network application-gateway list -g ${deploy.rg} --query [0].name -o tsv)  \\
     --resource-group ${deploy.rg} \\
     --name $COMMON_NAME \\
     --keyvault-secret $(az keyvault secret list-versions --vault-name $KVNAME -n $COMMON_NAME --query "[?attributes.enabled].id" -o tsv)
` : '' ) + `
# Install
export APPNAME=openjdk-demo
${cluster.apisecurity === "private" ? `az aks command invoke -g ${deploy.rg} -n ${aks}  --command "` : ``}
helm upgrade --install $APPNAME https://github.com/Azure-Samples/java-aks-keyvault-tls/blob/main/helm/openjdk-demo-3.5.0.tgz?raw=true \\
  --set ingressType=${addons.ingress} \\
  --set letsEncrypt.issuer=letsencrypt-prod \\
  --set image.repository=$\{ACRNAME}.azurecr.io/openjdk-demo \\
  --set image.tag=0.0.1 \\
  --set csisecrets.vaultname=$\{KVNAME} \\
  --set csisecrets.tenantId=$(az account show --query tenantId -o tsv) \\
  --set csisecrets.clientId=$(az aks show -g ${deploy.rg} -n ${aks} --query addonProfiles.azureKeyvaultSecretsProvider.identity.clientId -o tsv) \\
  --set dnsname=$\{APPNAME}.${addons.dnsZoneId.split('/')[8]}
${cluster.apisecurity === "private" ? `"` : ``}
`

    return (
        <Stack tokens={{ childrenGap: 15 }} styles={adv_stackstyle}>
            <Pivot >
                <PivotItem headerText="Secure Java"  >
                    <Stack tokens={{ childrenGap: 15 }} styles={adv_stackstyle}>

            <Separator styles={{ root: { marginTop: '30px !important' } }}><div style={{ display: "flex", alignItems: 'center', }}><b style={{ marginRight: '10px' }}>Java Spring Boot Hello World</b><Image  height="80px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Spring_Framework_Logo_2018.svg/245px-Spring_Framework_Logo_2018.svg.png" /></div> </Separator>

                        <Stack.Item>
                            <Label >Simple Java Spring boot application, that uses KeyVault to generate Certs to expose Tomcat TLS endpoint, and public Ingress TLS issued by cert-manager</Label>

                            <MessageBar messageBarType={MessageBarType.error}>Please ensure your deployment meets all the requirements below in order to run the demo app successfully</MessageBar>
                            <Label>Sample App Requires</Label>
                            <Checkbox styles={{ root: { marginLeft: '50px' }}} checked={addons.registry !== "none"} label="(Addons tab) Container Registry, for application container repository" />
                            <Checkbox styles={{ root: { marginLeft: '50px' }}} disabled={!net.vnetprivateend} checked={addons.acrPrivatePool} label="(Addons tab) Container Registry Private Pool, for container build task (required for private link only)" />
                            <Checkbox styles={{ root: { marginLeft: '50px' }}} checked={deploy.kvCertSecretRole} label="(Deploy tab) Grant Key Vault Certificate and Secret Officer" />
                            <Checkbox styles={{ root: { marginLeft: '50px' }}} checked={addons.csisecret === 'akvNew'} label="(Addons tab) CSI Secrets, for tomcat TLS certificates" />
                            <Checkbox styles={{ root: { marginLeft: '50px' }}} checked={addons.ingress !== 'none'} label="(Addons Tab) Ingress, for securely exposing app" />
                            <Checkbox styles={{ root: { marginLeft: '50px' }}} checked={addons.dns} label="(Addons Tab) external-dns, for application hostname resolution" />
                            <Checkbox styles={{ root: { marginLeft: '50px' }}} checked={addons.certMan} label="(Addons Tab) cert-manager, to generate the frontend CA signed Cert" />

                        </Stack.Item>
                        <Stack.Item>
                            <CodeBlock deploycmd={deploycmd}/>
                        </Stack.Item>
                    </Stack>
                </PivotItem>
                <PivotItem headerText=".NET Microservices"  >
                    <Separator styles={{ root: { marginTop: '30px !important' } }}><div style={{ display: "flex", alignItems: 'center', }}><b style={{ marginRight: '10px' }}>TBC</b><Image  height="80px" src="https://img.stackshare.io/service/11331/asp.net-core.png" /></div> </Separator>
                    <Stack.Item>
                            <Label >.</Label>
                    </Stack.Item>
                    <Stack.Item>
                            <TextField value={""} rows={25} readOnly={true} styles={{ root: { fontFamily: 'Monaco, Menlo, Consolas, "Droid Sans Mono", Inconsolata, "Courier New", monospace' }, field: { backgroundColor: 'lightgrey', lineHeight: '21px' } }} multiline  />
                    </Stack.Item>
                </PivotItem>
                <PivotItem headerText="Full Stack Typescript">
                    <Separator styles={{ root: { marginTop: '30px !important' } }}><div style={{ display: "flex", alignItems: 'center', }}><b style={{ marginRight: '10px' }}>TBC</b><Image height="80px" src="https://sdtimes.com/wp-content/uploads/2020/06/ts-logo-256.png" /></div> </Separator>
                    <Stack.Item>
                            <Label >.</Label>
                    </Stack.Item>
                    <Stack.Item>
                            <TextField value={""} rows={25} readOnly={true} styles={{ root: { fontFamily: 'Monaco, Menlo, Consolas, "Droid Sans Mono", Inconsolata, "Courier New", monospace' }, field: { backgroundColor: 'lightgrey', lineHeight: '21px' } }} multiline  />
                    </Stack.Item>
                </PivotItem>
            </Pivot>
        </Stack>
    )
}
