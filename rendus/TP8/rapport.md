# TP 8 – Container Orchestration with Kubernetes

---

## Question 1. Installer Minikube

### Objectif
Installer Minikube et vérifier le bon fonctionnement du cluster Kubernetes local.

### Action réalisée
Installation de Minikube via Homebrew, démarrage avec le driver Docker (Mac ARM).

### Input (commande)
```bash
brew install minikube
minikube start --driver=docker
minikube status
```

### Output (résultat)
```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

---

## Question 2. Utiliser les commandes `kubectl`

### Question 2.1. Créer un déploiement

### Objectif
Lancer un déploiement avec un pod basé sur `kubernetes-bootcamp:v1`.

### Input (commande)
```bash
kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
```

### Output (résultat)
```
deployment.apps/kubernetes-bootcamp created
```

---

### Question 2.2. Lister les pods

### Input (commande)
```bash
kubectl get pods
```

### Output (résultat)
```
NAME                                   READY   STATUS    RESTARTS   AGE
kubernetes-bootcamp-67fbdd6b79-jzm2d   1/1     Running   0          58s
```

---

### Question 2.3. Afficher les logs du pod

### Input (commande)
```bash
kubectl logs kubernetes-bootcamp-67fbdd6b79-jzm2d
```

### Output (résultat)
```
Kubernetes Bootcamp App Started At: 2026-03-19T14:13:19.705Z | Running On:  kubernetes-bootcamp-67fbdd6b79-jzm2d
```

---

### Question 2.4. Exécuter une commande dans le pod

### Input (commande)
```bash
kubectl exec kubernetes-bootcamp-67fbdd6b79-jzm2d -- cat /etc/os-release
```

### Output (résultat)
```
PRETTY_NAME="Debian GNU/Linux 8 (jessie)"
NAME="Debian GNU/Linux"
VERSION_ID="8"
VERSION="8 (jessie)"
ID=debian
HOME_URL="http://www.debian.org/"
SUPPORT_URL="http://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
```

---

### Question 2.5. Trouver le fichier source JavaScript

### Action réalisée
Listage du contenu à la racine du conteneur ; le fichier `server.js` se trouve à `/server.js`.

### Input (commande)
```bash
kubectl exec kubernetes-bootcamp-67fbdd6b79-jzm2d -- ls /
```

### Output (résultat)
```
bin  boot  core  dev  etc  home  lib  lib64  media  mnt  opt  proc  root
run  sbin  server.js  srv  sys  tmp  usr  var
```

---

### Question 2.6. Requêter l'app depuis l'intérieur du conteneur

### Input (commande)
```bash
kubectl exec kubernetes-bootcamp-67fbdd6b79-jzm2d -- curl -s http://localhost:8080
```

### Output (résultat)
```
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-67fbdd6b79-jzm2d | v=1
```

### Question 2.7. L'app est-elle accessible depuis la machine locale ?

Non, l'application n'est pas accessible depuis l'extérieur du pod sans exposer un service. Il faut créer un Service de type NodePort (voir Question 3).

---

## Question 3. Exposer un service Kubernetes à l'extérieur

### Objectif
Rendre l'application accessible depuis le navigateur via un service NodePort.

### Input (commande)
```bash
kubectl expose deployments/kubernetes-bootcamp --type="NodePort" --port 8080
```

### Output (résultat)
```
service/kubernetes-bootcamp exposed
```

---

### Question 3.1. Trouver le port du service

### Input (commande)
```bash
kubectl get services
```

### Output (résultat)
```
NAME                  TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
kubernetes            ClusterIP   10.96.0.1      <none>        443/TCP          2m
kubernetes-bootcamp   NodePort    10.103.153.7   <none>        8080:30171/TCP   4s
```

---

### Question 3.2. Obtenir l'IP de Minikube

### Input (commande)
```bash
minikube ip
```

### Output (résultat)
```
192.168.49.2
```

---

### Question 3.3. Accéder à l'app via le navigateur

### Action réalisée
Sur macOS avec le driver Docker, il faut un tunnel. Utilisation de `minikube service` pour créer un tunnel vers le service.

### Input (commande)
```bash
minikube service kubernetes-bootcamp --url
# → http://127.0.0.1:61241
curl -s http://127.0.0.1:61241
```

### Output (résultat)
```
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-67fbdd6b79-jzm2d | v=1
```

---

## Question 4. Scaler un déploiement

### Question 4.1. Scale up à 5 replicas

### Input (commande)
```bash
kubectl scale deployments/kubernetes-bootcamp --replicas=5
```

### Output (résultat)
```
deployment.apps/kubernetes-bootcamp scaled
```

---

### Question 4.2. Vérifier les 5 pods

### Input (commande)
```bash
kubectl get pods
```

### Output (résultat)
```
NAME                                   READY   STATUS    RESTARTS   AGE
kubernetes-bootcamp-67fbdd6b79-48cj5   1/1     Running   0          20s
kubernetes-bootcamp-67fbdd6b79-7njff   1/1     Running   0          20s
kubernetes-bootcamp-67fbdd6b79-8l7kc   1/1     Running   0          20s
kubernetes-bootcamp-67fbdd6b79-jzm2d   1/1     Running   0          2m38s
kubernetes-bootcamp-67fbdd6b79-mj9m7   1/1     Running   0          20s
```

---

### Question 4.3. Load balancing

### Action réalisée
En rafraîchissant plusieurs fois, les requêtes sont distribuées sur les différents pods (load balancing automatique via le Service).

### Input (commande)
```bash
curl -s http://127.0.0.1:61241
curl -s http://127.0.0.1:61241
curl -s http://127.0.0.1:61241
```

### Output (résultat)
```
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-67fbdd6b79-48cj5 | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-67fbdd6b79-jzm2d | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-67fbdd6b79-7njff | v=1
```

Chaque requête est traitée par un pod différent : le Service Kubernetes répartit automatiquement le trafic.

---

### Question 4.4. Scale down à 2 replicas

### Input (commande)
```bash
kubectl scale deployments/kubernetes-bootcamp --replicas=2
kubectl get pods
```

### Output (résultat)
```
deployment.apps/kubernetes-bootcamp scaled
NAME                                   READY   STATUS        RESTARTS   AGE
kubernetes-bootcamp-67fbdd6b79-48cj5   1/1     Terminating   0          37s
kubernetes-bootcamp-67fbdd6b79-7njff   1/1     Terminating   0          37s
kubernetes-bootcamp-67fbdd6b79-8l7kc   1/1     Running       0          37s
kubernetes-bootcamp-67fbdd6b79-jzm2d   1/1     Running       0          2m55s
kubernetes-bootcamp-67fbdd6b79-mj9m7   1/1     Terminating   0          37s
```

3 pods passent en Terminating, il n'en reste que 2 en Running.

---

## Question 5. Rolling update et rollback

### Question 5.1. Mise à jour vers v2

### Input (commande)
```bash
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v2
```

### Output (résultat)
```
deployment.apps/kubernetes-bootcamp image updated
```

### Vérification
```bash
curl -s http://127.0.0.1:61241
```
```
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-9c9cdbbfc-ds9vm | v=2
```

La page affiche désormais `v=2` : le rolling update a remplacé progressivement les pods v1 par des pods v2 sans interruption de service.

---

### Question 5.2. Mise à jour vers v3

### Input (commande)
```bash
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=jocatalin/kubernetes-bootcamp:v3
kubectl get pods
```

### Output (résultat)
```
NAME                                  READY   STATUS             RESTARTS   AGE
kubernetes-bootcamp-8f54f8c98-stzts   0/1     ImagePullBackOff   0          20s
kubernetes-bootcamp-9c9cdbbfc-ds9vm   1/1     Running            0          43s
kubernetes-bootcamp-9c9cdbbfc-jwqtj   1/1     Running            0          46s
```

L'image `v3` n'existe pas : le nouveau pod échoue en `ImagePullBackOff`. Les pods v2 restent actifs (Kubernetes ne supprime pas les pods fonctionnels tant que les nouveaux ne sont pas prêts).

---

### Question 5.3. Rollback

### Input (commande)
```bash
kubectl rollout undo deployments/kubernetes-bootcamp
kubectl get pods
curl -s http://127.0.0.1:61241
```

### Output (résultat)
```
deployment.apps/kubernetes-bootcamp rolled back
NAME                                  READY   STATUS    RESTARTS   AGE
kubernetes-bootcamp-9c9cdbbfc-ds9vm   1/1     Running   0          63s
kubernetes-bootcamp-9c9cdbbfc-jwqtj   1/1     Running   0          66s

Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-9c9cdbbfc-jwqtj | v=2
```

Le rollback a annulé la mise à jour v3 et restauré la version v2.

---

### Question 5.4. Retour à v1

### Input (commande)
```bash
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v1
curl -s http://127.0.0.1:61241
```

### Output (résultat)
```
deployment.apps/kubernetes-bootcamp image updated
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-67fbdd6b79-xr7hs | v=1
```

---

## Question 6. Déployer avec des fichiers YAML

### Question 6.1. Nettoyage

### Input (commande)
```bash
kubectl delete service kubernetes-bootcamp
kubectl delete deployment kubernetes-bootcamp
```

### Output (résultat)
```
service "kubernetes-bootcamp" deleted
deployment.apps "kubernetes-bootcamp" deleted
```

---

### Question 6.2. Compléter deployment.yaml

### Action réalisée
Remplissage de `TO COMPLETE #1` (image) dans `deployment.yaml` :

```yaml
containers:
- name: kubernetes-bootcamp
  image: gcr.io/google-samples/kubernetes-bootcamp:v1
```

### Input (commande)
```bash
kubectl apply -f deployment.yaml
kubectl get pods
```

### Output (résultat)
```
deployment.apps/kubernetes-bootcamp created
NAME                                   READY   STATUS    RESTARTS   AGE
kubernetes-bootcamp-67fbdd6b79-7mhx8   1/1     Running   0          20s
```

---

### Question 6.3. Compléter service.yaml

### Action réalisée
Remplissage des champs `app` et `port` dans `service.yaml` :

```yaml
selector:
  app: kubernetes-bootcamp
ports:
  - port: 8080
```

### Input (commande)
```bash
kubectl apply -f service.yaml
minikube service kubernetes-bootcamp-service --url
curl -s http://127.0.0.1:61446
```

### Output (résultat)
```
service/kubernetes-bootcamp-service created
http://127.0.0.1:61446
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-67fbdd6b79-7mhx8 | v=1
```

---

### Question 6.4. Ajouter 3 replicas

### Action réalisée
Remplissage de `TO COMPLETE #2` (replicas) dans `deployment.yaml` :

```yaml
spec:
  replicas: 3
```

### Input (commande)
```bash
kubectl apply -f deployment.yaml
kubectl get pods
curl -s http://127.0.0.1:61446
curl -s http://127.0.0.1:61446
curl -s http://127.0.0.1:61446
```

### Output (résultat)
```
deployment.apps/kubernetes-bootcamp configured
NAME                                   READY   STATUS    RESTARTS   AGE
kubernetes-bootcamp-67fbdd6b79-7mhx8   1/1     Running   0          74s
kubernetes-bootcamp-67fbdd6b79-nj8kr   1/1     Running   0          15s
kubernetes-bootcamp-67fbdd6b79-tms56   1/1     Running   0          15s

Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-67fbdd6b79-7mhx8 | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-67fbdd6b79-tms56 | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-67fbdd6b79-nj8kr | v=1
```

Les requêtes sont réparties sur les 3 replicas.

---

### Question 6.5. Nettoyage final

### Input (commande)
```bash
kubectl delete service kubernetes-bootcamp-service
kubectl delete deployment kubernetes-bootcamp
```

### Output (résultat)
```
service "kubernetes-bootcamp-service" deleted
deployment.apps "kubernetes-bootcamp" deleted
```

---

## Synthèse

### Application possible dans le monde réel
- Orchestration de microservices en production (scaling horizontal, rolling updates).
- Haute disponibilité : Kubernetes redémarre automatiquement les pods défaillants.
- Rolling updates/rollbacks : déploiement sans interruption de service.

### Étape dans le cycle DevOps ? Justification
**Deploy et Operate.** Kubernetes automatise le déploiement, le scaling et la gestion des applications conteneurisées. Les rolling updates et rollbacks font partie de la phase de déploiement continu (CD).

### Problèmes rencontrés (tableau récapitulatif)
| Problème | Message / symptôme | Analyse | Résolution | Ressources |
|----------|--------------------|---------|------------|------------|
| Minikube non installé | `command not found: minikube` | Minikube n'était pas installé sur macOS | `brew install minikube` | [Minikube](https://minikube.sigs.k8s.io/) |
| Driver Docker sur macOS | Impossible d'accéder via `minikube ip:nodePort` | Le driver Docker sur macOS nécessite un tunnel | `minikube service $SERVICE_NAME` crée un tunnel | [Minikube Docker driver](https://minikube.sigs.k8s.io/docs/drivers/docker/) |
| Image v3 inexistante | `ImagePullBackOff` | L'image `jocatalin/kubernetes-bootcamp:v3` n'existe pas | Rollback via `kubectl rollout undo` | — |

### Finalité
**Objectif rempli.** Minikube installé et fonctionnel. Déploiement, exposition, scaling, rolling update, rollback et déploiement déclaratif via YAML tous testés avec succès.
