import React from 'react';
import { Checkbox, Pivot, PivotItem, Image, TextField, Link, Separator, DropdownMenuItemType, Dropdown, Stack, Text, Toggle, Label, MessageBar, MessageBarType } from '@fluentui/react';

import { adv_stackstyle, getError } from './common'

export default function AppsTab({ defaults, updateFn, tabValues, invalidArray, invalidTabs }) {

    const { addons, deploy } = tabValues
    const deploycmd = `
# Build app
export ACRNAME=$(az acr list -g ${deploy.rg} --query [0].name -o tsv)
az acr build -r $ACRNAME -t openjdk-demo:0.0.1  https://github.com/khowling/e2e-tls-java-aks.git



# Create backend Certificate in KeyVault
export KVNAME=$(az keyvault list -g ${deploy.rg} --query [0].name -o tsv)
export COMMON_NAME=openjdk-demo-service 
az keyvault certificate create --vault-name $KVNAME -n $COMMON_NAME -p "$(az keyvault certificate get-default-policy | sed -e s/CN=CLIGetDefaultPolicy/CN=$\{COMMON_NAME\}/g )"


`

    return (
        <Stack tokens={{ childrenGap: 15 }} styles={adv_stackstyle}>

<Separator styles={{ root: { marginTop: '30px !important' } }}><div style={{ display: "flex", alignItems: 'center', }}><b style={{ marginRight: '10px' }}>Java Spring Boot Hello World</b><Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Spring_Framework_Logo_2018.svg/245px-Spring_Framework_Logo_2018.svg.png" /></div> </Separator>

            <Stack.Item>
                <Label >Simple Java Spring boot application, that uses KeyVault to generate Certs to expose Tomcat TLS endpoint, and public Ingress TLS issued by cert-manager</Label>

                <MessageBar messageBarType={MessageBarType.error}>Please ensure you select the missing requirements below to run the demo app successfully</MessageBar>
                <Label>Sample App Requires</Label>
                <Checkbox styles={{ root: { marginLeft: '50px', marginTop: '0 !important' }}} disabled={true} checked={addons.csisecret === 'akvNew'} label="(Addons tab) CSI Secrets, for internal certificates" />
                <Checkbox styles={{ root: { marginLeft: '50px', marginTop: '0 !important' } }} disabled={true} checked={addons.ingress !== 'none'} label="(Addons Tab) Ingress, for securly exposing app to web" />
                <Checkbox styles={{ root: { marginLeft: '50px', marginTop: '0 !important' } }} disabled={true} checked={addons.dns} label="(Addons Tab) external-dns, hostname resolution for secrure app" />
                <Checkbox styles={{ root: { marginLeft: '50px', marginTop: '0 !important' } }} disabled={true} checked={addons.certMan} label="(Addons Tab) cert-manager, for frontend CA signed Cert" />
                
            </Stack.Item>
            <Stack.Item>
                <TextField value={deploycmd} rows={deploycmd.split(/\r\n|\r|\n/).length + 1} readOnly={true} styles={{ root: { fontFamily: 'Monaco, Menlo, Consolas, "Droid Sans Mono", Inconsolata, "Courier New", monospace' }, field: { backgroundColor: 'lightgrey', lineHeight: '21px' } }} multiline  />
            </Stack.Item>
        </Stack>
    )
}
