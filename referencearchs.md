# Referenced Projects

## Enterprise Scale

Enterprise Scale provides prescriptive guidance based on authoritative design for the Azure platform as a whole.

The [Deployment Helper Wizard](https://azure.github.io/AKS-Construction/?default=es) has an Enterprise-Scale lens, with preset configurations for each landing zone area.

## Enterprise-Scale for AKS

This is the [parent project](https://github.com/Azure/AKS-Landing-Zone-Accelerator/) that our work belongs to. The reference implementations in this repository are all focussed on guiding the creation of Landing Zones for AKS within an Enterprise Scale framework. They typically include deployments of Hub/Spoke infrastructure and development vm's, and includes a Terraform implementation.

## The AKS Baseline

The AKS Construction bicep code is based on the architecture of the AKS Baseline.

The [AKS Baseline](https://docs.microsoft.com/azure/architecture/reference-architectures/containers/aks/secure-baseline-aks) is a reference architecture and has a number of additional, related reference architectures that build on the base to show different patterns such as [multi-region](https://docs.microsoft.com/azure/architecture/reference-architectures/containers/aks-multi-region/aks-multi-cluster) or [PCI-DSS 3.2.1 compliance](https://docs.microsoft.com/azure/architecture/reference-architectures/containers/aks-pci/aks-pci-intro).

For each of the documented architectures there is an accompanying reference implementation that includes deployment instructions and ARM templates for the cluster infrastructure. The templates showcases an end to end deployment of all the infrastructure as well as a sample workload. The ARM templates by design take a minimal amount of parameters, with much configuration built in to the resources directly. This is great from a learning perspective, and as part of making the template your own.

Much of the code and configuration in this project is based off the work in the AKS Baseline, the philosophy however is different. This project aims to converge on a single IaC codebase, and vary behaviour through parameters, parameters which use *good defaults* to minimise needing to provide too many parameter values. The AKS Baseline covers much of the documentation and practices, and this project focuses on the [implementation experience](https://azure.github.io/AKS-Construction/) and [automation samples](docs/GhActions.md).

When the AKS Baseline is updated, changes are evaluated and rolled into this project. See [here](https://github.com/Azure/AKS-Construction/issues?q=label%3ASecure-Baseline) for a list of tagged PRs.

### Deviations from the baseline (and why)

1. System pool and user pool separation is made optional in interests of users seeking a cost optimised configuration.
1. Ingress. Supports no ingress, [AGIC](https://azure.github.io/application-gateway-kubernetes-ingress/) integrated experience or post deployment ingress scripts for [NGINX](https://docs.nginx.com/nginx-ingress-controller/) and [Contour](https://github.com/projectcontour/contour).
1. Networking. Hub/Spoke networks typically already exist, and tightly bundling with Kubernetes doesn't work well here. BYO subnets are supported.
1. AppGw Public Listener. AppGw is the WAF ingress point for inbound internet traffic, however private listeners are also valid for fully private environments.
1. Cluster SLA. Is defaulted to off in interests of a more cost optimised default configuration, a parameter can be provided to opt in for the paid SLA.
1. Monitoring Alerts. Parametrised metric analysis frequency, created two presets (1 as per baseline, 2 less frequent), set default to be much less frequent. Added extra monitoring alerts as per in-cluster suggestions.
