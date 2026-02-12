## TP 7 – Containers with Docker

### Objectif du lab

- **Partie 1** : installer Docker et écrire un `Dockerfile` pour construire une image.
- **Partie 2** : builder l’image `hello-world-docker`, lancer le conteneur avec options (`-p`, `-d`), vérifier l’accès via le navigateur.
- **Partie 3** : partager le conteneur (Docker Hub – optionnel selon les instructions).
- **Partie 4** : construire et lancer une app multi-conteneurs avec Docker Compose (Node.js + Redis).
- **Partie 5** : ajouter un volume Redis pour que le compteur persiste après suppression et recréation des conteneurs.
- **Bonus** : lancer WordPress avec MySQL/MariaDB via Docker Compose.

### Application possible dans le monde réel

- **Conteneurisation** : déploiement reproductible, isolation des dépendances, scaling horizontal (Kubernetes, ECS).
- **Docker Compose** : environnements de dev multi-services (API + DB + cache), tests d’intégration.
- **Volumes** : persistance des données (bases, fichiers), sauvegarde et restauration.

### Étape dans le cycle DevOps ? Justification

- **Phase « Build » et « Deploy »** du cycle DevOps.  
- Les images Docker standardisent le build et le déploiement ; Compose permet de définir des stacks complètes (app + dépendances) de façon reproductible.

### Problèmes rencontrés et résolution

| Problème | Message / symptôme | Analyse | Résolution | Ressources |
|----------|--------------------|---------|------------|------------|
| **Port 5000 occupé sur macOS** | `bind: address already in use` | Sur macOS, le port 5000 est parfois utilisé par AirPlay Receiver. | Utiliser un autre port (ex. 5050) ou désactiver AirPlay Receiver dans les Préférences. | — |
| **MySQL 5.7 non disponible sur ARM** | `no matching manifest for linux/arm64/v8 in the manifest list` | L’image `mysql:5.7` n’a pas de build ARM64. | Remplacer par `mariadb:10.11`, compatible MySQL et disponible en ARM64. | [Docker Hub MariaDB](https://hub.docker.com/_/mariadb) |

### Commandes exécutées (inputs/outputs)

#### 1. hello-world-docker – Build et run
```bash
$ cd 07.docker-containers/lab/hello-world-docker
$ docker build -t hello-world-docker .
```
```
#11 exporting to image
#11 naming to docker.io/library/hello-world-docker:latest done
```

```bash
$ docker run -p 12345:8080 -d hello-world-docker
$ curl http://localhost:12345
```
```
c17a461266fe8e42a16d78fe48b152427db050d09bc521b8457c82a2e79124b6
Hello World from Docker!
```

#### 2. hello-world-docker-compose – Lancement et test du compteur
```bash
$ cd 07.docker-containers/lab/hello-world-docker-compose
$ docker compose up -d
```
```
Container hello-world-docker-compose-redis-1  Started
Container hello-world-docker-compose-web-1   Started
```

```bash
$ curl http://localhost:5050
$ curl http://localhost:5050
$ curl http://localhost:5050
```
```
Hello World from Docker! I have been seen 1 times
Hello World from Docker! I have been seen 2 times
Hello World from Docker! I have been seen 3 times
```

#### 3. Persistence du compteur (volume Redis)
```bash
$ docker compose down
$ docker compose up -d
$ sleep 4 && curl http://localhost:5050
```
```
Container hello-world-docker-compose-web-1   Removed
Container hello-world-docker-compose-redis-1 Removed
...
Container hello-world-docker-compose-web-1   Started
Hello World from Docker! I have been seen 4 times
```

#### 4. WordPress (bonus)
```bash
$ cd 07.docker-containers/lab/wordpress
$ docker compose up -d
$ curl -s -o /dev/null -w "HTTP %{http_code}" http://localhost:8000
```
```
Container wordpress-db-1        Started
Container wordpress-wordpress-1 Started
HTTP 302
```

### Finalité du lab

**Objectif rempli.**

- **hello-world-docker** : image construite, conteneur lancé sur `localhost:12345`, message « Hello World from Docker! » affiché.
- **hello-world-docker-compose** : `docker-compose.yaml` complété avec `depends_on`, `REDIS_HOST`/`REDIS_PORT`, volume `redis_data:/data` sur Redis. Le compteur incrémente correctement et persiste après `docker compose down` + `docker compose up`.
- **Bonus WordPress** : stack WordPress + MariaDB fonctionnelle sur `localhost:8000` (image MySQL remplacée par MariaDB pour compatibilité ARM Mac).
