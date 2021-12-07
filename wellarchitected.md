## Well Architected Framework

The [Well Architected Framework](https://docs.microsoft.com/en-us/azure/architecture/framework/) is a robust set of design guidelines split over 5 pillar areas (Reliability, Security, Cost, Operational Excellence and Performance Efficiency).

### Unifying the frameworks

The burden of having so many frameworks and references to design against can be daunting. Most are not connected, so as to not dilute the specific focus area of each framework or architecture.

The benefit of having a flexible approach to AKS deployments, is that we can provide different sample configurations to best achieve the specific goals of different initiatives. The caveat however is that Infrastructure templates can only go so far when it comes to meeting the goals of specific frameworks, there are decision points and processes that need to be understood and followed.

### Codifying the Well Architected Framework

A project called [PS Rule for Azure](https://azure.github.io/PSRule.Rules.Azure/) provides a set of rules which have been written against the recommendations in the Well Architected Framework.
Therefore creating/measuring against the Well Architected Framework becomes a lot simpler. A parameter configuration and IaC template can be directly evaluated before deploying to Azure. 

### The Well Architected Parameter Configuration

A parameter configuration file shows the necessary values to pass over 60 Well Architected Rules. This is 100% coverage of the rules provided by PSrule at the timne of writing.

