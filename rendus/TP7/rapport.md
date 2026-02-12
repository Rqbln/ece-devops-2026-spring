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

### Finalité du lab

**Objectif rempli.**

- **hello-world-docker** : image construite, conteneur lancé sur `localhost:12345`, message « Hello World from Docker! » affiché.
- **hello-world-docker-compose** : `docker-compose.yaml` complété avec `depends_on`, `REDIS_HOST`/`REDIS_PORT`, volume `redis_data:/data` sur Redis. Le compteur incrémente correctement et persiste après `docker compose down` + `docker compose up`.
- **Bonus WordPress** : stack WordPress + MariaDB fonctionnelle sur `localhost:8000` (image MySQL remplacée par MariaDB pour compatibilité ARM Mac).
