#!/bin/bash
set -e

echo "Installing Cert Manager from $CERTMANAGERURI"
kubectl apply -f $CERTMANAGERURI
sleep 1m

echo "Installing Cert Manager ClusterIssuer"
echo "Email Address for Lets Encrypt: $EMAILAD"
helm upgrade --install smokecertissuer $CERTMANAGERISSUERURI --set email=$EMAILAD
sleep 1m
