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
- [x] `k8s-cv.png` — application sur Minikube (NodePort / minikube service)
- [x] `github_action.png` — onglet Actions (workflows Projet)
- [ ] `docker-hub.png` — page repository Docker Hub avec tag `latest`
- [x] `render.png` — dashboard Render (deploy live)

Générer les sorties terminal :

```bash
cd rendus/projet
make capture
```
