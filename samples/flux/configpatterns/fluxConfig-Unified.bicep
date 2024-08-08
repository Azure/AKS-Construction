param aksName string

param aksFluxAddOnReleaseNamespace string = 'flux-system'

resource aks 'Microsoft.ContainerService/managedClusters@2023-11-01' existing = {
  name: aksName
}

@description('The Git Repository URL where your flux configuration is homed')
param fluxConfigRepo string = '' //''https://github.com/mspnp/aks-baseline''

param fluxConfigRepoBranch string = 'main'

@description('The name of the flux configuration to apply')
param fluxConfigName string = 'bootstrap'
var cleanFluxConfigName = toLower(fluxConfigName)

@secure()
@description('For private Repos, provide the username')
param fluxRepoUsername string = ''
var fluxRepoUsernameB64 = base64(fluxRepoUsername)

@secure()
@description('For private Repos, provide the password')
param fluxRepoPassword string = ''
var fluxRepoPasswordB64 = base64(fluxRepoPassword)

param fluxRepoPath string = './cluster-manifests'

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
        branch: fluxConfigRepoBranch
        tag: null
        semver: null
        commit: null
      }
      sshKnownHosts: ''
      httpsUser: null
      httpsCACert: null
      localAuthRef: null
    }
    configurationProtectedSettings: !empty(fluxRepoUsernameB64) && !empty(fluxRepoPasswordB64) ? {
      username: fluxRepoUsernameB64
      password: fluxRepoPasswordB64
    } : {}
    kustomizations: {
      unified: {
        path: fluxRepoPath
        dependsOn: []
        timeoutInSeconds: 300
        syncIntervalInSeconds: 300
        retryIntervalInSeconds: 300
        prune: true
        force: false
      }
    }
  }
}
