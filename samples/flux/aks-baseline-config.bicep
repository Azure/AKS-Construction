/*
This Flux Config implements the configuration used in the AKS Baseline.

AKS Baseline Flux Docs : https://github.com/mspnp/aks-baseline/blob/main/cluster-manifests/README.md
*/

param nameseed string = 'fluxbase'
param location string =  resourceGroup().location

//--------------Flux Config---------------
module flux 'configpatterns/fluxConfig-Unified.bicep' = {
  name: 'flux'
  params: {
    aksName: aksconst.outputs.aksClusterName
    aksFluxAddOnReleaseNamespace: aksconst.outputs.fluxReleaseNamespace
    fluxConfigRepo: 'https://github.com/mspnp/aks-baseline'
  }
}

//---------Kubernetes Construction---------
module aksconst '../../bicep/main.bicep' = {
  name: 'aksconstruction'
  params: {
    location : location
    resourceName: nameseed
    fluxGitOpsAddon: true

    enable_aad: true
    enableAzureRBAC : true
    registries_sku: 'Standard'
    omsagent: true
    retentionInDays: 30
    agentCount: 1
    JustUseSystemPool: false
    SystemPoolType: 'CostOptimised'
    createEventGrid: true
  }
}
