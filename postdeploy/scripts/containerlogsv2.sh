#!/bin/bash
set -e

replace="\# containerlog_schema_version = \"v2\""
replaceWith='containerlog_schema_version = "v2"'
echo "Downloading default ConfigMap"
$configMapYamlFile="$(curl https://raw.githubusercontent.com/microsoft/Docker-Provider/ci_prod/kubernetes/container-azm-ms-agentconfig.yaml)"
echo "Setting containerlog_schema_version to v2"
echo "${configMapYamlFile/$replace/$replaceWith}" > container-azm-ms-agentconfig.yaml
echo "Applying ConfigMap using kubectl apply"
kubectl apply -f container-azm-ms-agentconfig.yaml
sleep 1m