import React, {useState} from 'react';
import {CommandBarButton} from '@fluentui/react'
import { appInsights } from '../index.js'

export function arrayAdd(array, key) {
    return array.includes(key) ? array : array.concat(key)
}
export function arrayDel(array, key) {
    const idx = array.indexOf(key)
    return idx >= 0 ? [...array.slice(0, idx), ...array.slice(idx + 1)] : array
}

export function hasError(array, field) {
    return array.findIndex(e => e.field === field) >= 0
}

export function getError(array, field) {
    const idx = array.findIndex(e => e.field === field)
    return idx >= 0 ? array[idx].message : ''
}

export const adv_stackstyle = { root: { border: "1px solid", margin: "10px 0", padding: "15px" } }


export function CodeBlock({deploycmd, testId, lang, filename, error, hideSave}) {
    const [ copied, setCopied ] = useState(false)

    function copyIt() {
        console.log("AI:- Button.Copy." + testId)
        appInsights.trackEvent({name: "Button.Copy."+ testId});
        navigator.clipboard.writeText(deploycmd)
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
    }

    function downloadIt(){
        console.log("AI:- Button.Save." + testId)
        appInsights.trackEvent({name: "Button.Save."+ testId});
        function dataUrl(data) {return "data:x-application/text," + escape(deploycmd);}
        window.open(dataUrl());
    }

    return [
        <div key="code-header" className="codeHeader" style={{...(error && {borderColor: 'darkred'})}}>
            <span className="language">{lang}</span>
            { error && <div  className="error">{error}</div> }
            { !hideSave &&
            <CommandBarButton
              disabled={error}
              className="action position-relative"
              iconProps={{ iconName: copied? 'Completed' : 'Save'}}
              //styles={{icon: {color: '#171717'}}}
              text={!error ? "Save" : ""}
              primaryActionButtonProps={{download: filename}}
              onClick={downloadIt}/>
            }
            <CommandBarButton
                    disabled={copied || error}
                    className="action position-relative"
                    iconProps={{ iconName: copied? 'Completed' : 'Copy'}}
                    styles={{icon: {color: '#171717'}}}
                    text={!error ? "Copy" : ""}
                    onClick={copyIt}/>
        </div>,

        <pre key="code-pre" className="has-inner-focus"  style={{...(error && {borderColor: 'darkred'})}}>
            <code className={"lang-" + lang}><span data-lang={lang} data-testid={testId || 'none'} style={{...(error && {color: 'grey'})}}>{deploycmd}</span></code>
        </pre>
    ]
}

