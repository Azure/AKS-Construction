import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { mergeStyles } from '@fluentui/react';

// Application Insights - https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/applicationinsights-react-js
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

// Config
// TODO: Can we iterate over every json file in the configpresets directory?
import baseConfig from "./config.json";
import principalConfig from "./configpresets/principals.json"
import entScaleConfig from "./configpresets/entScale.json"
import baselineConfig from "./configpresets/baselines.json"

const configData = {
  ...baseConfig,
  presets: {
    ...principalConfig,
    ...entScaleConfig,
    ...baselineConfig
  }
};

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigContext.Provider value={configData}>
        <App />
      </ConfigContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
