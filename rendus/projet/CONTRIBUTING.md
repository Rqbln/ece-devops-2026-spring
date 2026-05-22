# Guide contributeur — Groupe SI03

## Auteur principal

| Nom | Rôle | GitHub |
|-----|------|--------|
| **Romain Martin** | Webapp, tests, CI/CD, Docker, K8s, IaC, documentation | @Rqbln |

> **Coéquipiers :** si le projet est réalisé en binôme/trinôme, remplacer ce tableau par les vrais membres du groupe SI03 (noms + comptes GitHub). Les noms « Léa Dubois » / « Thomas Nguyen » étaient des placeholders de maquette — ne pas les laisser dans le rendu final sans confirmation.

## Workflow

1. Branche `feature/*` depuis `main`
2. `make test` avant chaque commit
3. `make capture` après changement notable (UI, API, infra)
4. Workflows CI : `.github/workflows/projet-*.yml` à la **racine** du dépôt
