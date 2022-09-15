# Advanced Usage

The [QuickStart](https://github.com/Azure/AKS-Construction#quickstart) provides a nice easy way of using the Azure CLI to create your AKS Environment. However once you've done this, and are more familiar with the tool, then you'll want to initiate AKS Construction is a slightly more mature way.

## Level One - Download and your own Bicep file

1. Use the [Helper](https://azure.github.io/AKS-Construction/) to guide your AKS configuration.
1. Capture the parameters on the *Parameters File* tab to a file - this is your configuration
1. Grab the [latest release](https://github.com/Azure/AKS-Construction/releases) of the bicep code
1. Author an Application Main bicep to represent *your application* (see [here](../samples/SampleAppMain.bicep) for an example)
1. In your CI/CD system, either using one of the GitHub Action Workflow files as a base, or by coding it yourself - initiate a deployment of the bicep code, using your parameter file
1. In your CI/CD system, deploy your application(s) to the AKS cluster


## Level Two - Git symbolic link and your own Bicep file

1. Use the [Helper](https://azure.github.io/AKS-Construction/) to guide your AKS configuration.
1. Capture the parameters on the *Parameters File* tab to a file - this is your configuration
1. Create a Git symbolic link to the AKSC repository `git submodule add https://github.com/Azure/AKS-Construction.git aks-construction`
1. Author an Application Main bicep to represent *your application*, targetting the new aks-construction directory in your repo (see [here](../samples/SampleAppMain.bicep) for an example)
1. In your CI/CD system, either using one of the GitHub Action Workflow files as a base, or by coding it yourself - initiate a deployment of the bicep code, using your parameter file
1. In your CI/CD system, deploy your application(s) to the AKS cluster

### Samples

These repo's all connect to AKS-Construction using a GIT submodule.

Sample Repo | Description
----------- | -----------
[aksc petclinic](https://github.com/Gordonby/aksc-petclinic) | The Java Spring sample app, using AKS Construction bicep driven helm chart installation
[selenium grid aks keda](https://github.com/Azure-Samples/selenium-grid-aks-keda) | An implementation of Selenium Grid on AKS
[aks workload identity](https://github.com/Azure-Samples/aks-workload-identity) | Showcasing the different application identity options for accessing Azure Key Vault from AKS.

## Level Three - GitHub Action Workflow

1. Use the [Helper](https://azure.github.io/AKS-Construction/) to guide your AKS configuration.
1. On the Deploy tab, navigate to the GitHub Actions tab
1. Paste your Workload/Infra GitHub Repo URL into the textbox
1. Inspect and run the script in the first script box to create an Identity in Azure and the secrets in your GitHub repo
1. In your repo, create a new file in your `.github/workflows` folder, pasting in the yaml from the GitHub Actions script box
1. Commit the file to your main branch
1. In your repo, navigate to the actions tab and initiate the new workflow
1. Inspect the created resources in your Azure Subscription 
