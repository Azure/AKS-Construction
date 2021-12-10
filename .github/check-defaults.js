
const {parameters} = require ('../bicep/compiled/main.json')
const {defaults} = require ('../helper/src/config.json')

// Get Bicep parameters with a defaultValue
const bicepDefs = Object.keys(parameters).filter(k => parameters[k].defaultValue).reduce((acc, curr) => { return { ...acc, [curr]: parameters[curr].defaultValue}}, {})

// Get the helper parameter defaults for all tabs
const helperDefs = {...defaults.deploy, ...defaults.cluster, ...defaults.addons, ...defaults.net}

// For each bicep parameter with a default, that has a corrisponding helper parameter, output if different value
console.log(Object.keys(bicepDefs).filter(k => helperDefs.hasOwnProperty(k) && bicepDefs[k] !== helperDefs[k]).map (k => { return { key: k, bicep: bicepDefs[k], helper: helperDefs[k]}}))

// Parameters in Bicep that is never set by the helper
console.log(Object.keys(bicepDefs).filter(k => helperDefs.hasOwnProperty(k) === false))

