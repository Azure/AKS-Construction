import React from 'react';
import { Checkbox, Pivot, PivotItem, Image, TextField, Link, Separator, DropdownMenuItemType, Dropdown, Stack, Text, Toggle, Label, MessageBar, MessageBarType } from '@fluentui/react';

import { adv_stackstyle, getError } from './common'

export default function AppsTab({ defaults, updateFn, tabValues, invalidArray, invalidTabs }) {

    const { addons, deploy, net } = tabValues
    const deploycmd = `
# Build app
export ACRNAME=$(az acr list -g ${deploy.rg} --query [0].name -o tsv)
az acr build -r $ACRNAME -t openjdk-demo:0.0.1  ${net.vnetprivateend ? "--agent-pool private-pool" : ""} https://github.com/khowling/e2e-tls-java-aks.git



# Create backend Certificate in KeyVault
export KVNAME=$(az keyvault list -g ${deploy.rg} --query [0].name -o tsv)
export COMMON_NAME=openjdk-demo-service 
az keyvault certificate create --vault-name $KVNAME -n $COMMON_NAME -p "$(az keyvault certificate get-default-policy | sed -e s/CN=CLIGetDefaultPolicy/CN=$\{COMMON_NAME\}/g )"


`

    return (
        <Stack tokens={{ childrenGap: 15 }} styles={adv_stackstyle}>
            <Pivot >
                <PivotItem headerText="Secure Java"  >
                    <Stack tokens={{ childrenGap: 15 }} styles={adv_stackstyle}>

            <Separator styles={{ root: { marginTop: '30px !important' } }}><div style={{ display: "flex", alignItems: 'center', }}><b style={{ marginRight: '10px' }}>Java Spring Boot Hello World</b><Image  height="80px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Spring_Framework_Logo_2018.svg/245px-Spring_Framework_Logo_2018.svg.png" /></div> </Separator>

                        <Stack.Item>
                            <Label >Simple Java Spring boot application, that uses KeyVault to generate Certs to expose Tomcat TLS endpoint, and public Ingress TLS issued by cert-manager</Label>

                            <MessageBar messageBarType={MessageBarType.error}>Please ensure you select all the requirements below to run the demo app successfully</MessageBar>
                            <Label>Sample App Requires</Label>
                            <Checkbox styles={{ root: { marginLeft: '50px' }}} checked={addons.registry !== "none"} label="(Addons tab) Container Registry, for application container repository" />
                            <Checkbox styles={{ root: { marginLeft: '50px' }}} disabled={!net.vnetprivateend} checked={addons.acrPrivatePool} label="(Addons tab) Container Registry Private Pool, for container build task (required for private link only)" />
                            <Checkbox styles={{ root: { marginLeft: '50px' }}} checked={deploy.kvCertSecretRole} label="(Deploy tab) Grant Key Vault Certificate and Secret Officer" />
                            <Checkbox styles={{ root: { marginLeft: '50px' }}} checked={addons.csisecret === 'akvNew'} label="(Addons tab) CSI Secrets, for tomcat TLS certificates" />
                            <Checkbox styles={{ root: { marginLeft: '50px' }}} checked={addons.ingress !== 'none'} label="(Addons Tab) Ingress, for securly exposing app" />
                            <Checkbox styles={{ root: { marginLeft: '50px' }}} checked={addons.dns} label="(Addons Tab) external-dns, for application hostname resolution" />
                            <Checkbox styles={{ root: { marginLeft: '50px' }}} checked={addons.certMan} label="(Addons Tab) cert-manager, to generate the frontend CA signed Cert" />
                            
                        </Stack.Item>
                        <Stack.Item>
                            <TextField value={deploycmd} rows={deploycmd.split(/\r\n|\r|\n/).length + 1} readOnly={true} styles={{ root: { fontFamily: 'Monaco, Menlo, Consolas, "Droid Sans Mono", Inconsolata, "Courier New", monospace' }, field: { backgroundColor: 'lightgrey', lineHeight: '21px' } }} multiline  />
                        </Stack.Item>
                    </Stack>
                </PivotItem>
                <PivotItem headerText=".NET Microservices"  >
                    <Separator styles={{ root: { marginTop: '30px !important' } }}><div style={{ display: "flex", alignItems: 'center', }}><b style={{ marginRight: '10px' }}>TBC</b><Image  height="80px" src="https://img.stackshare.io/service/11331/asp.net-core.png" /></div> </Separator>
                    <Stack.Item>
                            <Label >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Label>
                    </Stack.Item>
                    <Stack.Item>
                            <TextField value={""} rows={10} readOnly={true} styles={{ root: { fontFamily: 'Monaco, Menlo, Consolas, "Droid Sans Mono", Inconsolata, "Courier New", monospace' }, field: { backgroundColor: 'lightgrey', lineHeight: '21px' } }} multiline  />
                    </Stack.Item>
                </PivotItem>
                <PivotItem headerText="Full Stack Typescript">
                    <Separator styles={{ root: { marginTop: '30px !important' } }}><div style={{ display: "flex", alignItems: 'center', }}><b style={{ marginRight: '10px' }}>TBC</b><Image height="80px" src="https://sdtimes.com/wp-content/uploads/2020/06/ts-logo-256.png" /></div> </Separator>
                    <Stack.Item>
                            <Label >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Label>
                    </Stack.Item>
                    <Stack.Item>
                            <TextField value={""} rows={10} readOnly={true} styles={{ root: { fontFamily: 'Monaco, Menlo, Consolas, "Droid Sans Mono", Inconsolata, "Courier New", monospace' }, field: { backgroundColor: 'lightgrey', lineHeight: '21px' } }} multiline  />
                    </Stack.Item>
                </PivotItem>
            </Pivot>
        </Stack>
    )
}
