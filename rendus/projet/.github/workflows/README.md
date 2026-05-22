# Workflows GitHub Actions du projet

Les pipelines **exécutés par GitHub** sont à la **racine du dépôt** :

```
.github/workflows/
  projet-ci.yml
  projet-cd.yml
  projet-k8s-validate.yml
```

Les fichiers `ci.yml`, `cd.yml` et `k8s-validate.yml` dans ce dossier sont conservés comme **référence** (même contenu, chemins identiques). GitHub **ne lance pas** les workflows sous `rendus/projet/.github/`.
