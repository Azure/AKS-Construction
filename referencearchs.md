# Referenced Projects

## Enterprise Scale

Enterprise Scale provides prescriptive guidance based on authoritative design for the Azure platform as a whole. 

The [Deployment Helper Wizard](https://azure.github.io/Aks-Construction/?default=es) has an Enterprise-Scale lense, with preset configurations for each landing zone area.

## Enterprise-Scale for AKS

This is the [parent project](https://github.com/Azure/Enterprise-Scale-for-AKS) that our work belongs to. The reference implementations in this repository are all focussed on guiding the creation of Landing Zones for AKS within an Enterprise Scale framework. They typically include deployments of Hub/Spoke infrastructure and development vm's, and includes a Terraform implementation.

## The Secure Baseline

The AKS Construction bicep code is based on the AKS Secure Baseline.

The [Secure Baseline document](https://docs.microsoft.com/en-us/security/benchmark/azure/baselines/aks-security-baseline) has a reference implementation and a number of additional reference implementations that build on the base to show different patterns such as [multi region](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks-multi-region/aks-multi-cluster) or [microservices](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/containers/aks-microservices/aks-microservices).
For each of the documented scenarios there is an accompanying implemenation guide that includes script snippets and an ARM Json file for the cluster infrastructure. The template  showcases an end to end deployment of all the infrastructure as well as a sample workload. The Arm templates by design take a minimal amount of parameters, with much configuration built in to the resources directly. This is great from a learning perspective, and as part of consuming the secure baseline you make the template your own.

Much of the code and configuration in this project is based off the work in the Secure Baseline, the philosphy however is different. This project aims to converge on a single IaC codebase, and vary behaviour through parameters, parameters which use *good defaults* to minimise needing to provide too many parameter values. The Secure Baseline covers much of the documentation and practices, and this project focusses on the [implementation experience](https://azure.github.io/Aks-Construction/) and [automation samples](GhActions.md).

When the AKS Secure Baseline is updated, changes are evaluated and rolled into this project. See [here](https://github.com/Azure/Aks-Construction/issues?q=label%3ASecure-Baseline) for a list of tagged PR's.

### Deviations from the baseline (and why)

1. System pool and user pool seperation is made optional in interests of users seeking a cost optimised configuration.
2. Ingress. Supports no ingress, [AGIC](https://azure.github.io/application-gateway-kubernetes-ingress/) integrated experience or post deployment ingress scripts for [NGINX](https://docs.nginx.com/nginx-ingress-controller/) and [Contour](https://github.com/projectcontour/contour).
3. Networking. Hub/Spoke networks typically already exist, and tightly bundling with Kubernetes doesn't work well here. BYO subnets are supported.
4. AppGw Public Listener. AppGw is the WAF ingress point for inbound internet traffic, however private listeners are also valid for fully private clusters.
5. Cluster SLA. Is defaulted to off in interests of a more cost optimised default configuration, a parameter can be provided to opt in for the paid SLA.
