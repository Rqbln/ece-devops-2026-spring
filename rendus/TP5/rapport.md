## TP 5 – CI/CD (GitHub Actions + Vercel)

### Objectif du lab

- **Partie 1 – Continuous Integration** : mettre en place un workflow GitHub Actions pour builder et tester l’application Node.js, avec Redis en conteneur de service.
- **Partie 2 – Continuous Delivery** : automatiser le déploiement (ici vers Vercel au lieu de Heroku) après passage des tests, en utilisant GitHub Actions comme seul orchestrateur (Vercel utilisé comme « dumb deploy target »).

### Application possible dans le monde réel

- **CI** : à chaque push/PR, exécuter les tests sur un environnement reproductible (Node + Redis) pour valider les changements avant merge.
- **CD** : déployer automatiquement sur un environnement de preview ou de production après des critères définis (ex. tests verts sur `main`), avec des outils type Vercel, Heroku, AWS, etc.
- **Service containers** : même principe qu’en prod (Redis, Postgres, etc.) pour des tests d’intégration proches de la réalité.

### Étape dans le cycle DevOps ? Justification

- **Intégration continue (CI)** et **Livraison/Déploiement continu (CD)**.  
- La CI assure que chaque modification est testée de façon automatique et reproductible ; la CD pousse les artefacts validés vers un environnement cible (Vercel), en réduisant les déploiements manuels et les erreurs de configuration.

### Problèmes rencontrés et résolution

| Problème | Message / symptôme | Analyse | Résolution | Ressources |
|----------|--------------------|---------|-----------|------------|
| **Redis inaccessible en CI/CD** | `Error: Redis connection in broken state: retry aborted`, `expected false to deeply equal true` (db.connected), puis `FLUSHDB can't be processed. The connection is already closed` | Le job GitHub Actions n’avait pas de service Redis au départ ; puis, avec le service, le host utilisé était incorrect. Sous GitHub Actions, les services sont exposés sur **localhost** (mapping de ports), pas sur le hostname `redis`. | 1) Ajout du bloc `services: redis` (image `redis:7-alpine`, port 6379, health-check) dans les workflows CI et CD. 2) Dans les étapes « Run tests », définition de `REDIS_HOST: 127.0.0.1` et `REDIS_PORT: 6379` pour que l’app (via `dbClient.js`) se connecte au Redis du job. | [About service containers](https://docs.github.com/en/actions/guides/about-service-containers), [Creating Redis service containers](https://docs.github.com/en/actions/guides/creating-redis-service-containers) |
| **Hostname `redis` en CI** | Même erreur de connexion Redis après ajout du service ; tests Configure OK mais Redis et tests métier en échec. | Utilisation de `REDIS_HOST: redis` alors que, dans le modèle des jobs GitHub Actions, le service est accessible depuis le runner via **127.0.0.1**. Le hostname `redis` n’est pas résolu dans ce contexte. | Remplacement de `REDIS_HOST: redis` par `REDIS_HOST: 127.0.0.1` dans `.github/workflows/ci-node.yml` et `.github/workflows/deploy-heroku.yml`. | Documentation GitHub Actions (service containers, networking) |
| **Erreur de chemin Vercel en CD** | `The provided path "…/04.continuous-testing/lab/04.continuous-testing/lab" does not exist` | Les étapes `vercel pull`, `vercel build`, `vercel deploy` étaient exécutées avec `working-directory: 04.continuous-testing/lab`. Le projet Vercel a déjà `rootDirectory: 04.continuous-testing/lab` ; la CLI ajoutait donc ce chemin une seconde fois. | Suppression de `working-directory` pour les étapes Vercel (pull, build, deploy). Ces commandes s’exécutent depuis la **racine du dépôt** ; le projet Vercel applique lui-même le `rootDirectory`. | [Vercel CLI](https://vercel.com/docs/cli), paramètres du projet Vercel |

### Finalité du lab

**Objectif rempli.**

- **Partie 1 – CI** : le workflow `ci-node.yml` s’exécute sur push/PR vers `main`, installe les dépendances dans `04.continuous-testing/lab`, lance les tests avec un service Redis (host `127.0.0.1`, port 6379). Tous les tests passent en CI.
- **Partie 2 – CD** : le workflow `deploy-heroku.yml` s’exécute sur push vers `main`, relance les tests (avec Redis), puis appelle la CLI Vercel (pull, build, deploy) depuis la racine du dépôt. Le déploiement vers Vercel se fait sans utiliser le CI intégré Vercel (uniquement GitHub Actions + Vercel comme cible de déploiement).
- L’objectif du lab (CI + CD avec tests et déploiement automatique) est atteint ; la seule adaptation par rapport à l’énoncé est l’usage de **Vercel** à la place de Heroku pour la CD, avec la même logique de pipeline.

