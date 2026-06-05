#!/bin/bash
echo "Deploying EcoReport to Kubernetes..."
kubectl apply -f 00-namespace.yaml
kubectl apply -f 01-configmap.yaml
kubectl apply -f 02-secrets.yaml
kubectl apply -f 03-postgres-pvc.yaml
kubectl apply -f 04-postgres-deployment.yaml
kubectl wait --namespace=ecoreport --for=condition=ready pod --selector=app=postgres --timeout=120s
kubectl apply -f 05-rabbitmq-deployment.yaml
kubectl wait --namespace=ecoreport --for=condition=ready pod --selector=app=rabbitmq --timeout=120s
kubectl apply -f 06-backend-deployment.yaml
kubectl apply -f 07-ingress.yaml
kubectl apply -f 08-hpa.yaml
echo "Done!"
kubectl get pods -n ecoreport
kubectl get services -n ecoreport
