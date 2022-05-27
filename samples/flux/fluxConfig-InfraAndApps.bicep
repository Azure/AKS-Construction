param aksName string

param aksFluxAddOnReleaseNamespace string

resource aks 'Microsoft.ServiceFabric/managedClusters@2022-02-01-preview' existing = {
  name: aksName
}

@description('The Git Repository URL where your flux configuration is homed')
param fluxConfigRepo string = 'https://github.com/Azure/gitops-flux2-kustomize-helm-mt' //'https://github.com/fluxcd/flux2-kustomize-helm-example'

@description('The name of the flux configuration to apply')
param fluxConfigName string = 'fluxsetup'
var cleanFluxConfigName = toLower(fluxConfigName)

@secure()
@description('For private Repos, provide the username')
param fluxRepoUsername string = ''
var fluxRepoUsernameB64 = base64(fluxRepoUsername)

@secure()
@description('For private Repos, provide the password')
param fluxRepoPassword string = ''
var fluxRepoPasswordB64 = base64(fluxRepoPassword)

param fluxRepoInfraPath string = './infrastructure'
param fluxRepoAppsPath string = './apps/staging'

resource fluxConfig 'Microsoft.KubernetesConfiguration/fluxConfigurations@2022-03-01' = {
  scope: aks
  name: cleanFluxConfigName
  properties: {
    scope: 'cluster'
    namespace: aksFluxAddOnReleaseNamespace
    sourceKind: 'GitRepository'
    gitRepository: {
      url: fluxConfigRepo
      timeoutInSeconds: 180
      syncIntervalInSeconds: 300
      repositoryRef: {
        branch: 'main'
      }
    }
    configurationProtectedSettings: !empty(fluxRepoUsernameB64) && !empty(fluxRepoPasswordB64) ? {
      username: fluxRepoUsernameB64
      password: fluxRepoPasswordB64
    } : {}
    kustomizations: {
      infra: {
        path: fluxRepoInfraPath
        timeoutInSeconds: 300
        syncIntervalInSeconds: 300
        retryIntervalInSeconds: 300
        prune: true
      }
      apps: {
        path: fluxRepoAppsPath
        dependsOn: [
          'infra'
        ]
        timeoutInSeconds: 300
        syncIntervalInSeconds: 300
        retryIntervalInSeconds: 300
        prune: true
      }
    }
  }
}
