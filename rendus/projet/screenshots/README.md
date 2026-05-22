# Screenshots — projet DevOps

## Déjà présents

| Fichier | Description |
|---------|-------------|
| `cv-local.png` | Page CV en local |
| `ci-success.png` | Pipeline CI (à refaire après push + workflows racine) |
| `terminal/npm-test.txt` | Sortie `make test` |
| `terminal/health.json` | `GET /health` |
| `terminal/docker-build.txt` | Build image Docker |

## À capturer avant rendu (manuel)

- [ ] `vagrant-status.png` — `cd iac && vagrant status` après `vagrant up`
- [ ] `vagrant-health.png` — `curl localhost:3000/health` depuis l’hôte
- [x] Sortie terminal `kubectl-get-all.txt` — pods Running
- [ ] `kubectl-get-all.png` — capture écran optionnelle (même contenu que le .txt)
- [ ] `k8s-cv.png` — navigateur http://localhost:30080 (health OK — voir `k8s-health.json`)
- [ ] `github-actions-projet.png` — onglet Actions, workflows `Projet — CI` / `CD` verts
- [ ] `docker-hub.png` — page repository Docker Hub avec tag `latest`
- [ ] `render-home.png` — homepage Render (même si Redis cloud non payé)

Générer les sorties terminal :

```bash
cd rendus/projet
make capture
```
