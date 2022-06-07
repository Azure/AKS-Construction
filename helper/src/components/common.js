import React, {useState} from 'react';
import {CommandBarButton} from '@fluentui/react'

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


export function CodeBlock({deploycmd, testId, lang, filename}) {
    const [ copied, setCopied ] = useState(false)
    const [ downloaded, setDownloaded ] = useState(false)

    function copyIt() {
        navigator.clipboard.writeText(deploycmd)
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
    }

    function downloadIt(){
        function dataUrl(data) {return "data:x-application/text," + escape(deploycmd);}
        setDownloaded(true)
        window.open(dataUrl())
        setTimeout(() => setDownloaded(false), 1000)
    }

    return [
        <div key="code-header" className="codeHeader" >
            <span className="language">{lang}</span>
            <CommandBarButton
              disabled={downloaded}
              className="action position-relative"
              iconProps={{ iconName: downloaded ? 'Completed' : 'Save'}}
              styles={{icon: {color: '#171717'}}}
              text="Save"
              primaryActionButtonProps={{download: filename}}
              onClick={downloadIt}
            />
            <CommandBarButton
              disabled={copied}
              className="action position-relative"
              iconProps={{ iconName: copied ? 'Completed' : 'Copy'}}
              styles={{icon: {color: '#171717'}}}
              text="Copy"
              onClick={copyIt}
            />
        </div>,

        <pre key="code-pre" className="has-inner-focus">
            <code className={"lang-" + lang}><span data-lang={lang} data-testid={testId || 'none'}>{deploycmd}</span></code>
        </pre>
    ]
}

