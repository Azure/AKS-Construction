#!/bin/bash
#
#  This installs the Azure Vote app, in 2 different configurations each with Publicly accessible IPs.
#

echo "Installing Simple-Vote, Public IP on SVC LoadBalancer"
kubectl create namespace simple-vote --dry-run=client -o yaml | kubectl apply -f -
kubectl apply -f https://raw.githubusercontent.com/Gordonby/AKS-K8S-Lab-L200/master/azure-vote-all-in-one-redis.yaml -n simple-vote
SIMPLEIP=$(kubectl get svc azure-vote-front -n simple-vote -o=jsonpath='{.status.loadBalancer.ingress[0].ip}')
respcode=$(curl -o /dev/null -s -w "%{http_code}\n" $SIMPLEIP)
echo "SimpleVote ($SIMPLEIP): HTTP $respcode"

echo "Installing Ingress-Vote, Public IP on AGIC"
helm upgrade --namespace agic-public --create-namespace --install avote-public https://github.com/Gordonby/minihelm/raw/main/samples/AzureVote-0.9.8.tgz --set ingress.enabled=true,ingress.appGwPrivateIp=false,front.service.azureLbInternal=false,front.service.type="ClusterIP"
kubectl get svc -n agic-public
INGRESSIP=$(kubectl get ing avote-public -n agic-public  -o=jsonpath='{.status.loadBalancer.ingress[0].ip}')
respcodeing=$(curl -o /dev/null -s -w "%{http_code}\n" $INGRESSIP)
echo "AGIC ip ($INGRESSIP): HTTP $respcodeing"