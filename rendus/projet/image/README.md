# Manifests Kubernetes

## Minikube (image locale, sans pull Hub)

```bash
minikube start
eval $(minikube docker-env)
cd ../webapp && docker build -t devops-cv-webapp:local .
```

Dans `deployment.yaml`, remplacer temporairement :

```yaml
image: devops-cv-webapp:local
imagePullPolicy: Never
```

Puis :

```bash
cd ..
make k8s-apply
kubectl get all
```

Accès : http://localhost:30080 (NodePort) ou `minikube service cv-webapp-service --url`.

## Docker Hub (image distante)

Valeurs par défaut du fichier : `rqbln/devops-cv-webapp:latest` après `make docker-push`.
