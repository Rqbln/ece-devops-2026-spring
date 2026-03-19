# TP 9 – Storage in Kubernetes

---

## Avant de commencer

### Objectif
Vérifier que Minikube est en marche.

### Action réalisée
Minikube a été démarré lors du TP8. Vérification du statut.

### Input (commande)
```bash
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

## Question 1. Utiliser le stockage `emptyDir`

### Question 1.1. Compléter le fichier de déploiement

### Objectif
Compléter `lab/emptyDir/deployment.yml` pour monter un volume `emptyDir` sur `/usr/share/nginx/html`.

### Action réalisée
Ajout du volume `emptyDir` et du `volumeMount` dans le fichier YAML :

```yaml
volumes:
  - name: html-storage
    emptyDir: {}
containers:
  - name: nginx-container
    image: nginx
    ports:
      - containerPort: 80
        name: "http-server"
    volumeMounts:
      - name: html-storage
        mountPath: /usr/share/nginx/html
```

---

### Question 1.2. Appliquer la configuration

### Input (commande)
```bash
kubectl apply -f lab/emptyDir/deployment.yml
kubectl get pods
```

### Output (résultat)
```
deployment.apps/nginx-empty-dir created
NAME                               READY   STATUS    RESTARTS   AGE
nginx-empty-dir-7ffbf4bd6d-8lsn8   1/1     Running   0          21s
```

---

### Question 1.3. Tester curl localhost depuis le conteneur

### Input (commande)
```bash
kubectl exec nginx-empty-dir-7ffbf4bd6d-8lsn8 -- curl -s localhost
```

### Output (résultat)
```html
<html>
<head><title>403 Forbidden</title></head>
<body>
<center><h1>403 Forbidden</h1></center>
<hr><center>nginx/1.29.6</center>
</body>
</html>
```

Le volume `emptyDir` est vide : pas de fichier `index.html`, d'où l'erreur 403.

---

### Question 1.4. Créer un fichier `index.html` dans le conteneur

### Input (commande)
```bash
kubectl exec nginx-empty-dir-7ffbf4bd6d-8lsn8 -- bash -c "echo 'Hello from Kubernetes storage!' > /usr/share/nginx/html/index.html"
kubectl exec nginx-empty-dir-7ffbf4bd6d-8lsn8 -- curl -s localhost
```

### Output (résultat)
```
Hello from Kubernetes storage!
```

---

### Question 1.5. Vérifier la persistance

### Objectif
Vérifier que les données sont perdues quand le pod est supprimé (comportement `emptyDir`).

### Input (commande)
```bash
kubectl delete pod/nginx-empty-dir-7ffbf4bd6d-8lsn8
# Attendre que le Deployment recrée un nouveau pod
kubectl get pods
kubectl exec nginx-empty-dir-7ffbf4bd6d-rt2cz -- curl -s localhost
```

### Output (résultat)
```
pod "nginx-empty-dir-7ffbf4bd6d-8lsn8" deleted
NAME                               READY   STATUS    RESTARTS   AGE
nginx-empty-dir-7ffbf4bd6d-rt2cz   1/1     Running   0          10s

<html>
<head><title>403 Forbidden</title></head>
<body>
<center><h1>403 Forbidden</h1></center>
<hr><center>nginx/1.29.6</center>
</body>
</html>
```

Le nouveau pod retourne 403 : les données de l'`emptyDir` ont été perdues avec la suppression du pod. C'est le comportement attendu.

---

## Question 2. Utiliser le stockage `hostPath`

### Question 2.1. Compléter le fichier de déploiement

### Objectif
Compléter `lab/hostPath/deployment.yml` pour monter un volume `hostPath` pointant vers `/mnt/hostPath/`.

### Action réalisée
Ajout du volume `hostPath` et du `volumeMount` :

```yaml
volumes:
  - name: html-storage
    hostPath:
      path: /mnt/hostPath/
containers:
  - name: nginx-container
    image: nginx
    ports:
      - containerPort: 80
        name: "http-server"
    volumeMounts:
      - name: html-storage
        mountPath: /usr/share/nginx/html
```

---

### Question 2.2. Appliquer la configuration et vérifier le 403

### Input (commande)
```bash
kubectl apply -f lab/hostPath/deployment.yml
kubectl get pods
kubectl exec nginx-host-path-845dbf6c54-8fgc8 -- curl -s localhost
```

### Output (résultat)
```
deployment.apps/nginx-host-path created
NAME                               READY   STATUS    RESTARTS   AGE
nginx-host-path-845dbf6c54-8fgc8   1/1     Running   0          15s

<html>
<head><title>403 Forbidden</title></head>
<body>
<center><h1>403 Forbidden</h1></center>
<hr><center>nginx/1.29.6</center>
</body>
</html>
```

---

### Question 2.3. Créer le fichier depuis la VM hôte

### Input (commande)
```bash
minikube ssh "sudo mkdir -p /mnt/hostPath && sudo chmod -R 777 /mnt/hostPath && echo 'Hello from Kubernetes storage!' > /mnt/hostPath/index.html && cat /mnt/hostPath/index.html"
```

### Output (résultat)
```
Hello from Kubernetes storage!
```

---

### Question 2.4. Vérifier depuis le conteneur

### Input (commande)
```bash
kubectl exec nginx-host-path-845dbf6c54-8fgc8 -- curl -s localhost
```

### Output (résultat)
```
Hello from Kubernetes storage!
```

---

### Question 2.5. Vérifier la persistance après suppression du pod

### Input (commande)
```bash
kubectl delete pod/nginx-host-path-845dbf6c54-8fgc8
# Attendre le nouveau pod
kubectl get pods
kubectl exec nginx-host-path-845dbf6c54-9zghq -- curl -s localhost
```

### Output (résultat)
```
pod "nginx-host-path-845dbf6c54-8fgc8" deleted
NAME                               READY   STATUS    RESTARTS   AGE
nginx-host-path-845dbf6c54-9zghq   1/1     Running   0          10s

Hello from Kubernetes storage!
```

Les données persistent car elles sont stockées sur le filesystem de la VM hôte (`/mnt/hostPath/`), et non dans le pod.

---

## Question 3. Utiliser PersistentVolume

### Objectif
Suivre le tutoriel officiel Kubernetes pour créer un PersistentVolume (PV), un PersistentVolumeClaim (PVC) et un Pod les utilisant.

### Question 3.1. Créer un fichier sur le nœud

### Input (commande)
```bash
minikube ssh "sudo mkdir -p /mnt/data && sudo sh -c 'echo Hello from Kubernetes storage > /mnt/data/index.html'"
```

---

### Question 3.2. Créer le PersistentVolume

### Input (commande)
```bash
cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: PersistentVolume
metadata:
  name: task-pv-volume
  labels:
    type: local
spec:
  storageClassName: manual
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/data"
EOF
```

### Output (résultat)
```
persistentvolume/task-pv-volume created
```

### Vérification
```bash
kubectl get pv task-pv-volume
```
```
NAME             CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   AGE
task-pv-volume   10Gi       RWO            Retain           Available           manual         5s
```

---

### Question 3.3. Créer le PersistentVolumeClaim

### Input (commande)
```bash
cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: task-pv-claim
spec:
  storageClassName: manual
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 3Gi
EOF
```

### Output (résultat)
```
persistentvolumeclaim/task-pv-claim created
```

### Vérification du binding
```bash
kubectl get pv task-pv-volume
kubectl get pvc task-pv-claim
```
```
NAME             CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                   STORAGECLASS   AGE
task-pv-volume   10Gi       RWO            Retain           Bound    default/task-pv-claim   manual         17s

NAME            STATUS   VOLUME           CAPACITY   ACCESS MODES   STORAGECLASS   AGE
task-pv-claim   Bound    task-pv-volume   10Gi       RWO            manual         6s
```

Le PV passe de `Available` à `Bound` : le PVC a bien réclamé le volume.

---

### Question 3.4. Créer un Pod utilisant le PVC

### Input (commande)
```bash
cat <<'EOF' | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: task-pv-pod
spec:
  volumes:
    - name: task-pv-storage
      persistentVolumeClaim:
        claimName: task-pv-claim
  containers:
    - name: task-pv-container
      image: nginx
      ports:
        - containerPort: 80
          name: "http-server"
      volumeMounts:
        - mountPath: "/usr/share/nginx/html"
          name: task-pv-storage
EOF
```

### Output (résultat)
```
pod/task-pv-pod created
```

---

### Question 3.5. Vérifier le contenu servi

### Input (commande)
```bash
kubectl get pod task-pv-pod
kubectl exec task-pv-pod -- curl -s localhost
```

### Output (résultat)
```
NAME          READY   STATUS    RESTARTS   AGE
task-pv-pod   1/1     Running   0          21s

Hello from Kubernetes storage
```

Le Pod sert le contenu du fichier `/mnt/data/index.html` créé sur le nœud, monté via le PV/PVC.

---

### Question 3.6. Nettoyage

### Input (commande)
```bash
kubectl delete pod task-pv-pod
kubectl delete pvc task-pv-claim
kubectl delete pv task-pv-volume
```

### Output (résultat)
```
pod "task-pv-pod" deleted
persistentvolumeclaim "task-pv-claim" deleted
persistentvolume "task-pv-volume" deleted
```

---

## Synthèse

### Application possible dans le monde réel
- **emptyDir** : cache temporaire, fichiers intermédiaires partagés entre conteneurs d'un même pod.
- **hostPath** : accès au filesystem du nœud (logs, sockets Docker, fichiers de configuration).
- **PersistentVolume/PVC** : stockage durable pour bases de données, files de messages (Redis, PostgreSQL, Kafka) dans un cluster Kubernetes.

### Étape dans le cycle DevOps ? Justification
**Deploy et Operate.** La gestion du stockage en Kubernetes fait partie du déploiement et de l'exploitation des applications. La persistance des données est essentielle pour les services stateful en production.

### Problèmes rencontrés (tableau récapitulatif)
| Problème | Message / symptôme | Analyse | Résolution | Ressources |
|----------|--------------------|---------|------------|------------|
| 403 Forbidden au curl | `403 Forbidden` nginx | Le volume emptyDir/hostPath est vide, pas de `index.html` | Créer le fichier dans le conteneur (emptyDir) ou sur le nœud (hostPath) | [Nginx docs](https://hub.docker.com/_/nginx) |
| Driver Docker macOS | `minikube ssh` nécessaire pour accéder au filesystem hôte | Le nœud Minikube tourne dans un conteneur Docker, pas directement sur macOS | Utiliser `minikube ssh` pour accéder au filesystem du nœud | [Minikube SSH](https://minikube.sigs.k8s.io/docs/commands/ssh/) |

### Finalité
**Objectif rempli.** Les trois types de stockage Kubernetes (emptyDir, hostPath, PersistentVolume) ont été configurés et testés. La différence de persistance entre emptyDir (données perdues avec le pod) et hostPath/PV (données persistantes) a été vérifiée.
