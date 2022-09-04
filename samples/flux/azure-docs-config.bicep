/*
This Flux Config implements the configuration referenced in the Azure Documentation.

Azure Docs: https://docs.microsoft.com/en-gb/azure/azure-arc/kubernetes/tutorial-use-gitops-flux2
*/

param nameseed string = 'fluxdocs'
param location string =  resourceGroup().location

//--------------Flux Config---------------
module flux 'configpatterns/fluxConfig-InfraAndApps.bicep' = {
  name: 'flux'
  params: {
    aksName: aksconst.outputs.aksClusterName
    aksFluxAddOnReleaseNamespace: aksconst.outputs.fluxReleaseNamespace
    fluxConfigRepo: 'https://github.com/Azure/gitops-flux2-kustomize-helm-mt'
    fluxRepoInfraPath: './infrastructure'
    fluxRepoAppsPath: './apps/staging'
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
    acrCreateNewSku: 'Standard'
    omsagent: true
    retentionInDays: 30
    agentCount: 1
    JustUseSystemPool: false
    SystemPoolType: 'CostOptimised'
    createEventGrid: true
  }
}
