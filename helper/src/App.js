import React from 'react';
import { ConfigContext } from './index'
import PortalNav from './components/portalnav'

export default function App() {

  return (
    <ConfigContext.Consumer>
      {config => <PortalNav config={config} />}
    </ConfigContext.Consumer>
  )
}

