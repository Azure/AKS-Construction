# Sample : Selenium Grid

Selenium is a web application automation tool that controls browsers for testing purposes.

Selenium Grid facilitates scaling the tests by distributing and running them on several machines, it also provides a central management environment.

## Grid on Kubernetes

Selenium provide a Helm chart for ease of installation into Kubernetes environments.

[https://github.com/SeleniumHQ/docker-selenium/blob/trunk/chart/selenium-grid/README.md](https://github.com/SeleniumHQ/docker-selenium/blob/trunk/chart/selenium-grid/README.md)

## This Sample

This sample creates;

1. 2 virtual networks, which are peered
1. An AKS environment for the centralised Selenium Grid deployment
1. An AKS environment to simulate an application teams development environment where the web application to be tested will be deployed
1. A VM



## Getting up and running

1. Run the bicep infrastructure installation

2. Import the Selenium Container images into an Azure Container Registry

3. Install the Selenium Grid Helm Chart, exposing the hub publicly, referencing your Azure Container Registry

You can either deploy it in standalone or with components isolated.

### Isolated Components

```bash
git clone https://github.com/seleniumhq/docker-selenium.git
helm upgrade --install selenium-grid --set isolateComponents=true,components.router.serviceType=LoadBalancer docker-selenium/chart/selenium-grid/.
kubectl get svc -l app=selenium-router -w
```

```text
NAME                     TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)                      AGE
selenium-chrome-node     ClusterIP      172.10.225.25    <none>          6900/TCP                     15m
selenium-distributor     ClusterIP      172.10.38.244    <none>          5553/TCP                     15m
selenium-edge-node       ClusterIP      172.10.138.123   <none>          6900/TCP                     15m
selenium-event-bus       ClusterIP      172.10.222.5     <none>          5557/TCP,4442/TCP,4443/TCP   15m
selenium-firefox-node    ClusterIP      172.10.253.52    <none>          6900/TCP                     15m
selenium-router          LoadBalancer   172.10.112.16    20.103.196.55   4444:30897/TCP               15m
selenium-session-map     ClusterIP      172.10.170.145   <none>          5556/TCP                     15m
selenium-session-queue   ClusterIP      172.10.85.143    <none>          5559/TCP                     15m
```

### Standalone


```bash
helm upgrade --install selenium-grid docker-selenium/chart/selenium-grid/. --set hub.serviceType=LoadBalancer
```

```text
NAME                    TYPE           CLUSTER-IP       EXTERNAL-IP     PORT(S)                                        AGE
selenium-chrome-node    ClusterIP      172.10.225.25    <none>          6900/TCP                                       18m
selenium-edge-node      ClusterIP      172.10.138.123   <none>          6900/TCP                                       18m
selenium-firefox-node   ClusterIP      172.10.253.52    <none>          6900/TCP                                       18m
selenium-hub            LoadBalancer   172.10.165.0     20.103.195.75   4444:30171/TCP,4442:31390/TCP,4443:30118/TCP   30s
```

4. Open the router web app

> eg.http://20.103.196.55:4444/

## Running the first workload
sd
## Configuring for AKS



