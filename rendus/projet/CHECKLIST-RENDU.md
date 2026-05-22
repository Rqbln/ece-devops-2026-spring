# Checklist rendu — à cocher avant envoi au prof

## Bloquant (note / consignes)

- [ ] Dépôt GitHub passé en **Private** (Settings → Danger zone → Change visibility)
- [ ] Invitation **enseignant** (Collaborators) — compte indiqué en cours
- [ ] `rendus/projet/` **commité et poussé** sur `main`
- [ ] Workflows `Projet — CI` vert sur https://github.com/…/actions
- [x] `docker push` → https://hub.docker.com/r/romainmlt/devops-cv-webapp
- [ ] Secrets GitHub configurés (`make env-check` + `scripts/sync-github-secrets.sh` ou UI)
- [ ] Email envoyé : objet `ECE - DevOps project - MARTIN Romain - SI03`

## Documentation

- [ ] README : liens **réels** (pas de 404 Render/Hub)
- [ ] Auteurs = **vrais** membres du groupe
- [ ] Screenshots manquants (voir `screenshots/README.md`)

## Local (vérifié par l’agent)

- [x] `make test` → 19 passing
- [ ] `vagrant up` — **bloqué** VirtualBox/vboxdrv ; code + doc dans README § IaC
- [x] `minikube` + `make k8s-apply` (voir `screenshots/terminal/kubectl-get-all.txt`)

## Fichiers credentials

- [ ] `rendus/projet/.env` rempli (non commité)
- [ ] `.env.example` à jour pour les coéquipiers
