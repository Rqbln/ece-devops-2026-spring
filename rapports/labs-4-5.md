# Compte-rendu des labs – DevOps CI/CD

Ce document présente le compte-rendu des labs **Continuous Testing** (partie 4) et **CI/CD** (partie 5), selon le cadre demandé.

---

## Lab 4 – Continuous Testing

### Objectif du lab

- Utiliser l’application User API fournie et exécuter les tests existants.
- Mettre en place, en **Test-Driven Development (TDD)**, la fonctionnalité **GET user** :  
  - 2 tests unitaires (contrôleur) : récupérer un user par username, cas “user inexistant”.  
  - 2 tests API (route) : succès GET user, cas “user inexistant”.  
  - Implémentation du contrôleur `get` et de la route `GET /user/:username`.

### Application possible dans le monde réel

- **TDD** : écrire les tests avant le code pour clarifier le comportement attendu et limiter les régressions (API, microservices, librairies).
- **Tests unitaires + tests d’API** : même pyramide de tests que dans beaucoup de projets (backend Node/Express, APIs REST).
- **Redis** : base clé-valeur courante pour cache, sessions, queues ; les tests avec un service Redis (local ou conteneur) reflètent des environnements de dev/staging.

### Étape dans le cycle DevOps ? Justification

- **Phase « Test » (Continuous Testing)** du cycle DevOps.  
- Les tests automatisés (unitaires et API) fournissent un retour rapide sur la qualité du code et permettent d’enchaîner sereinement sur l’intégration et le déploiement continus. Sans eux, la CI/CD manquerait de garde-fou.

### Problèmes rencontrés et résolution

| Problème | Message / symptôme | Analyse | Résolution | Ressources |
|----------|--------------------|---------|-----------|------------|
| **Redis indisponible en local** | `Redis connection in broken state: retry aborted`, `FLUSHDB can't be processed. The connection is already closed` | Les tests s’appuient sur Redis ; sans serveur Redis démarré, le client ne se connecte pas et tous les tests qui touchent la DB échouent. | Installation de Redis via Homebrew (`brew install redis`), démarrage du service (`brew services start redis`), vérification avec `redis-cli ping` → PONG. | [Redis Quick Start](https://redis.io/topics/quickstart), [Homebrew](https://brew.sh) |
| **Configuration Redis non surchargeable en CI** | En GitHub Actions, l’app se connectait à `127.0.0.1` alors que le service Redis du job est exposé sur le host du runner. | La config venait uniquement de `conf/default.json` (host `127.0.0.1`). En CI, il faut pouvoir surcharger host/port sans casser les tests du module `configure`. | Lecture de `REDIS_HOST` et `REDIS_PORT` **uniquement dans `dbClient.js`** (override au moment de la création du client Redis). Le module `configure.js` reste pur (pas d’env) pour que les tests « load default / custom configuration » continuent d’asserter `127.0.0.1`. | Code existant : `src/configure.js`, `src/dbClient.js`, `conf/default.json` |
| **Tests Configure qui échouent en CI** | `expected { host: 'redis', port: 6379 } to deeply equal { host: '127.0.0.1', port: 6379 }` | En injectant les variables d’env dans `configure.js`, la config retournée contenait `host: 'redis'` en CI, alors que les tests attendent explicitement les valeurs du fichier par défaut. | Retrait de la lecture d’env dans `configure.js` ; toute la surcharge Redis se fait dans `dbClient.js`. Les tests de configuration restent verts en local et en CI. | — |

### Finalité du lab

**Objectif rempli.**

- L’application User API est utilisée et les tests existants passent (avec Redis installé et démarré).
- La fonctionnalité GET user est livrée en TDD :  
  - 2 tests unitaires (get by username, user inexistant) et 2 tests API (succès GET, user inexistant) ont été ajoutés, puis le contrôleur et la route ont été implémentés.  
- Tous les tests (Configure, Redis, User Create/Get, REST API POST/GET) passent en local.  
- La configuration est prête pour la CI (surcharge Redis par variables d’environnement dans `dbClient.js` uniquement).

---

## Lab 5 – CI/CD (GitHub Actions + Vercel)

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

---

## Synthèse

| Lab | Objectif | Problèmes principaux | Statut |
|-----|----------|----------------------|--------|
| **4 – Continuous Testing** | TDD GET user, tests unitaires + API | Redis local manquant ; config Redis pour CI (env dans dbClient uniquement) | ✅ Rempli |
| **5 – CI/CD** | CI GitHub Actions + CD (Vercel) | Redis en job (service + 127.0.0.1) ; chemin Vercel (working-directory) | ✅ Rempli |
