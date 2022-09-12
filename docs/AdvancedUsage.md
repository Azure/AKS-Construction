# Advanced Usage

The [QuickStart](https://github.com/Azure/AKS-Construction#quickstart) provides a nice easy way of using the Azure CLI to create your AKS Environment. However once you've done this, and are more familiar with the tool, then you'll want to initiate AKS Construction is a sligtly more mature way.

## Level One - Your own Bicep file

1. Use the [Helper](https://azure.github.io/AKS-Construction/) to guide your AKS configuration.
1. Capture the parameters on the *Parameters File* tab to a file - this is your configuration
1. Grab the [latest release](https://github.com/Azure/AKS-Construction/releases) of the bicep code
1. Author an Application Main bicep to represent *your application* (see [here](../samples/SampleAppMain.bicep) for an example)
1. In your CI/CD system, either using one of the GitHub Action Workflow files as a base, or by coding it yourself - initiate a deployment of the bicep code, using your parameter file
1. In your CI/CD system, deploy your application(s) to the AKS cluster

