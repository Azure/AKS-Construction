import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { mergeStyles } from '@fluentui/react';
import * as serviceWorker from './serviceWorker';

// Application Insights - https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import configData from "./config.json";

export const appInsights = new ApplicationInsights({
  config: { instrumentationKey: process.env.REACT_APP_APPINSIGHTS_KEY }
});
if (process.env.REACT_APP_APPINSIGHTS_KEY) {
  appInsights.loadAppInsights();
}

export const ConfigContext = React.createContext()

// Inject some global styles
mergeStyles({
  ':global(body,html,#root)': {
    margin: 0,
    padding: 0,
    height: '100vh',
  },
});

ReactDOM.render(
  <ConfigContext.Provider value={configData}>
    <App />
  </ConfigContext.Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
