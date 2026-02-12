# TP 7 – Containers with Docker

---

## Question 1. Installer Docker

### Objectif
Installer Docker et vérifier le bon fonctionnement.

### Action réalisée
Docker Desktop était déjà installé. Vérification avec `docker run hello-world`.

### Input (commande)
```bash
docker run hello-world
```

### Output (résultat)
```
Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

---

## Question 2. Écrire un Dockerfile et builder une image

### Question 2.1–2.2. Examiner les fichiers

### Objectif
Ouvrir et comprendre `server.js`, `package.json` et `Dockerfile` dans `hello-world-docker`.

### Action réalisée
Lecture des fichiers. Le Dockerfile utilise `node:12`, copie `package*.json`, exécute `npm install`, copie le code, expose le port 8080 et lance `npm start`.

---

### Question 2.3. Build de l’image

### Objectif
Construire l’image avec `docker build -t hello-world-docker .`

### Action réalisée
Construction de l’image Docker.

### Input (commande)
```bash
cd 07.docker-containers/lab/hello-world-docker
docker build -t hello-world-docker .
```

### Output (résultat)
```
#11 exporting to image
#11 naming to docker.io/library/hello-world-docker:latest done
```

---

### Question 2.4. Vérifier l’image locale

### Objectif
Lister les images Docker avec `docker images`.

### Input (commande)
```bash
docker images
```

### Output (résultat)
```
REPOSITORY          TAG       IMAGE ID       CREATED          SIZE
hello-world-docker  latest    bdb941c0da3f   X minutes ago    ~900MB
```

---

## Question 3. Lancer un conteneur avec plusieurs options

### Question 3.1. Run en arrière-plan avec mapping de port

### Objectif
Lancer le conteneur avec `-p 12345:8080` et `-d`.

### Action réalisée
Lancement du conteneur en mode détaché, port 12345 mappé sur 8080.

### Input (commande)
```bash
docker run -p 12345:8080 -d hello-world-docker
```

### Output (résultat)
```
c17a461266fe8e42a16d78fe48b152427db050d09bc521b8457c82a2e79124b6
```

---

### Question 3.2. Vérifier que le conteneur tourne

### Input (commande)
```bash
docker ps
```

### Output (résultat)
```
CONTAINER ID   IMAGE                 PORTS                    STATUS
c17a461266fe   hello-world-docker    0.0.0.0:12345->8080/tcp   Up X seconds
```

---

### Question 3.3. Tester dans le navigateur

### Objectif
Ouvrir http://localhost:12345 dans le navigateur.

### Action réalisée
Test via curl.

### Input (commande)
```bash
curl http://localhost:12345
```

### Output (résultat)
```
Hello World from Docker!
```

---

### Question 3.4. Afficher les logs

### Input (commande)
```bash
docker logs c17a461266fe
```

### Output (résultat)
```
Running on http://localhost:8080
```

---

### Question 3.5. Arrêter le conteneur

### Input (commande)
```bash
docker stop c17a461266fe
```

### Output (résultat)
```
c17a461266fe
```

---

## Question 4. Partager le conteneur (optionnel)

### Objectif
Modifier le message dans `server.js`, rebuild, tagger et push sur Docker Hub.

### Action réalisée
Non réalisé dans ce rapport (optionnel).

---

## Question 5. App multi-conteneurs avec Docker Compose

### Question 5.1–5.2. Vérifier Docker Compose et examiner les fichiers

### Objectif
Vérifier que Docker Compose est installé et examiner les fichiers de `hello-world-docker-compose`.

### Action réalisée
Examen de `dbClient.js`, `server.js`, `package.json`, `Dockerfile` et `docker-compose.yaml`.

---

### Question 5.3. Builder l’image

### Input (commande)
```bash
cd 07.docker-containers/lab/hello-world-docker-compose
docker compose build
```

### Output (résultat)
```
Image hello-world-docker-compose-web:latest Built
```

---

### Question 5.4. Compléter le docker-compose.yaml

### Objectif
Remplir les parties manquantes : `depends_on`, `environment`, et (plus tard) volume Redis.

### Action réalisée
Ajout de `depends_on: redis`, `REDIS_HOST: redis`, `REDIS_PORT: 6379`, et `volumes: redis_data:/data` sur le service Redis.

---

### Question 5.5. Démarrer les conteneurs

### Input (commande)
```bash
docker compose up -d
```

### Output (résultat)
```
Container hello-world-docker-compose-redis-1  Started
Container hello-world-docker-compose-web-1    Started
```

---

### Question 5.6. Visiter localhost et rafraîchir

### Objectif
Ouvrir localhost:5000 (ou 5050 sur macOS si 5000 occupé) et rafraîchir plusieurs fois pour voir le compteur augmenter.

### Input (commande)
```bash
curl http://localhost:5050
curl http://localhost:5050
curl http://localhost:5050
```

### Output (résultat)
```
Hello World from Docker! I have been seen 1 times
Hello World from Docker! I have been seen 2 times
Hello World from Docker! I have been seen 3 times
```

---

### Question 5.7–5.8. Arrêter et supprimer les conteneurs

### Input (commande)
```bash
docker compose down
```

### Output (résultat)
```
Container hello-world-docker-compose-web-1    Removed
Container hello-world-docker-compose-redis-1  Removed
Network hello-world-docker-compose_default    Removed
```

---

### Question 5.9. Redémarrer : que devient le compteur ?

### Objectif
Comprendre pourquoi le compteur se réinitialise après suppression des conteneurs.

### Action réalisée
Redémarrage avec `docker compose up -d` et test du compteur. Sans volume, le compteur repart à 1.

---

### Question 5.10. Persister le compteur avec un volume

### Objectif
Modifier le `docker-compose.yaml` pour que Redis conserve ses données (répertoire `/data`).

### Action réalisée
Ajout de `volumes: redis_data:/data` au service Redis et déclaration de `redis_data` dans la section `volumes`.

### Input (commande)
```bash
docker compose down
docker compose up -d
sleep 4 && curl http://localhost:5050
```

### Output (résultat)
```
Hello World from Docker! I have been seen 4 times
```

Le compteur continue à partir de la valeur précédente grâce au volume.

---

## Bonus. WordPress avec MySQL/MariaDB

### Objectif
Lancer WordPress avec Docker Compose (MySQL ou équivalent).

### Action réalisée
Utilisation du `docker-compose.yml` du dossier `wordpress`. Remplacement de `mysql:5.7` par `mariadb:10.11` (compatibilité ARM Mac).

### Input (commande)
```bash
cd 07.docker-containers/lab/wordpress
docker compose up -d
curl -s -o /dev/null -w "HTTP %{http_code}" http://localhost:8000
```

### Output (résultat)
```
Container wordpress-db-1        Started
Container wordpress-wordpress-1 Started
HTTP 302
```

---

## Synthèse

### Application possible dans le monde réel
- Conteneurisation : déploiements reproductibles, isolation des dépendances.
- Docker Compose : environnements de dev multi-services.
- Volumes : persistance des données (BDD, cache).

### Étape dans le cycle DevOps ? Justification
**Build et Deploy.** Docker standardise le build et le déploiement ; Compose permet de décrire des stacks complètes.

### Problèmes rencontrés (tableau récapitulatif)
| Problème | Message / symptôme | Analyse | Résolution | Ressources |
|----------|--------------------|---------|------------|------------|
| Port 5000 occupé | `bind: address already in use` | Sur macOS, 5000 souvent utilisé par AirPlay | Utiliser le port 5050 dans le compose | — |
| MySQL 5.7 non dispo sur ARM | `no matching manifest for linux/arm64` | mysql:5.7 n’a pas de build ARM64 | Remplacer par `mariadb:10.11` | [Docker Hub MariaDB](https://hub.docker.com/_/mariadb) |

### Finalité
**Objectif rempli.** Image hello-world-docker construite et testée. Compose hello-world-docker-compose complété avec Redis et volume persistant. Bonus WordPress + MariaDB fonctionnel sur http://localhost:8000.
