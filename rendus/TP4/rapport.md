## TP 4 – Continuous Testing

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

