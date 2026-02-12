# TP 6 – Infrastructure as Code (IaC)

---

## Avant de commencer

### Objectif
Installer VirtualBox, Vagrant, ajouter la box centos/7.

### Action réalisée
Vagrant était installé. Tentative d’ajout de la box generic/rocky8 pour la partie 2.

### Input (commande)
```bash
cd 06.iac/lab/part-2
vagrant box add generic/rocky8
# Choix : 3 (virtualbox)
```

### Output (résultat)
```
==> box: Successfully added box 'generic/rocky8' (v4.3.2) for 'virtualbox'!
```

---

## Partie 1. Impératif – Vagrant avec Shell Provisioner

### Question 1.1. Préparer l’environnement virtuel

#### Objectif
Examiner le Vagrantfile de `lab/part-1`.

### Action réalisée
Navigation vers `lab/part-1` et lecture du Vagrantfile.

### Input (commande)
```bash
cd 06.iac/lab/part-1
cat Vagrantfile
```

### Output (résultat)
Fichier contenant la définition de la VM `centos_server` (box centos/7, 2 Go RAM) avec un provisioner shell `echo Hello, World`.

---

### Question 1.2. Créer une VM

#### Objectif
Lancer `vagrant up` pour créer la VM.

### Action réalisée
Non exécuté dans le cadre de ce rapport (focus sur partie 2 et 3). Sur Mac ARM, VirtualBox ne supporte pas les VMs x86.

---

## Partie 2. Déclaratif – GitLab avec Vagrant et Ansible

### Question 2.1. Préparer l’environnement

### Objectif
Examiner le Vagrantfile et les playbooks de `lab/part-2`.

### Action réalisée
Lecture du Vagrantfile (box generic/rocky8, ansible_local, tag install) et de `playbooks/run.yml`.

---

### Question 2.2. Créer et provisionner la VM

### Objectif
Exécuter `vagrant up` pour installer GitLab via Ansible.

### Action réalisée
Tentative de lancement ; échec sur Mac ARM (VirtualBox incompatible avec x86).

### Input (commande)
```bash
cd 06.iac/lab/part-2
vagrant up
```

### Output (résultat)
```
==> gitlab_server: Booting VM...
VBoxManage: error: Cannot run the machine because its platform architecture x86 is not supported on ARM
```

### Problème rencontré
VirtualBox ne peut pas exécuter de VMs x86 sur Apple Silicon. Alternative : mock Node.js + playbook Ansible local.

---

### Question 2.3. Tester l’installation GitLab

### Objectif
Ouvrir http://localhost:8080 et vérifier la page GitLab.

### Action réalisée
Non réalisable via la VM. À la place, démarrage d’un mock GitLab simulant les endpoints health/readiness/liveness.

### Input (commande)
```bash
cd 06.iac/lab/part-2
node mock-gitlab-health.js &
```

### Output (résultat)
```
Mock GitLab health server on http://127.0.0.1:8080
```

---

## Partie 3. Déclaratif – Health checks GitLab

### Question 3.1–3.2. Health check avec curl

### Objectif
Tester l’endpoint `/-/health` avec curl.

### Action réalisée
Appel curl contre le mock (équivalent à `vagrant ssh` + curl dans la VM).

### Input (commande)
```bash
curl http://127.0.0.1:8080/-/health
curl http://127.0.0.1:8080/-/readiness
```

### Output (résultat)
```
GitLab OK
{"status":"ok","master_check":{"status":"ok"},"checks":{"redis":{"status":"ok"},"db":{"status":"ok"},"cache":{"status":"ok"}}}
```

---

### Question 3.3–3.4. Exécuter le rôle healthcheck Ansible

### Objectif
Lancer le playbook avec le tag `check` pour exécuter le rôle `gitlab/healthchecks`.

### Action réalisée
Playbook local ciblant `localhost` et appelant le rôle healthchecks (health, readiness, liveness).

### Input (commande)
```bash
cd 06.iac/lab/part-2
ansible-playbook playbooks/run-healthcheck-local.yml -i "localhost," -c local --tags check
```

### Output (résultat)
```
TASK [gitlab/healthchecks : Print GitLab health]
ok: [localhost] => { "msg": "GitLab OK" }

TASK [gitlab/healthchecks : Print GitLab readiness]
ok: [localhost] => { "msg": "{\"status\":\"ok\",\"checks\":{\"redis\":{\"status\":\"ok\"},\"db\":{\"status\":\"ok\"},\"cache\":{\"status\":\"ok\"}}}" }

TASK [gitlab/healthchecks : Print GitLab liveness]
ok: [localhost] => { "msg": "{\"status\":\"ok\"}" }

TASK [gitlab/healthchecks : Print message when all readiness checks are OK]
ok: [localhost] => { "msg": "All GitLab readiness checks are OK." }

PLAY RECAP: localhost : ok=9  changed=0  unreachable=0  failed=0  skipped=1
```

---

### Question 3.5–3.6. Les 2 autres health checks et affichage des résultats

### Objectif
Implémenter readiness et liveness dans le playbook et afficher les résultats en console.

### Action réalisée
Les tâches readiness et liveness ont été ajoutées dans `gitlab/healthchecks/tasks/main.yml` avec le module `uri`. Les résultats sont affichés via `debug`.

---

## Bonus. Message pour les services dysfonctionnels

### Objectif
Afficher uniquement les services en échec dans le readiness check.

### Action réalisée
Ajout d’une tâche qui extrait les checks dont `status != ok` et affiche « Dysfunctional services: redis » (ou liste des services en échec).

### Input (commande)
```bash
GITLAB_REDIS_DOWN=1 node mock-gitlab-health.js &
ansible-playbook playbooks/run-healthcheck-local.yml -i "localhost," -c local --tags check
```

### Output (résultat)
```
TASK [gitlab/healthchecks : Print dysfunctional services (readiness)]
ok: [localhost] => { "msg": "Dysfunctional services: redis" }
```

---

## Synthèse

### Application possible dans le monde réel
- IaC : environnements reproductibles (dev, staging, prod).
- Vagrant : environnements de dev proches de la prod.
- Ansible : provisioning déclaratif en prod.
- Health checks : monitoring, Kubernetes (readiness/liveness).

### Étape dans le cycle DevOps ? Justification
**Deploy et Operate.** L’IaC permet d’automatiser le déploiement et la configuration ; les health checks font partie du monitoring et de l’opération.

### Problèmes rencontrés (tableau récapitulatif)
| Problème | Message / symptôme | Analyse | Résolution | Ressources |
|----------|--------------------|---------|------------|------------|
| VirtualBox incompatible Mac ARM | `platform architecture x86 is not supported on ARM` | VirtualBox ne gère pas les VMs x86 sur Apple Silicon | Mock Node.js + playbook Ansible local | [Vagrant UTM](https://naveenrajm7.github.io/vagrant_utm/) |
| Ansible absent | `ansible-playbook not found` | Ansible requis pour exécuter le playbook | `brew install ansible` | [Ansible](https://docs.ansible.com/) |

### Finalité
Les health checks (health, readiness, liveness) sont implémentés et testés via le mock. Le bonus (services dysfonctionnels) est opérationnel. Documentation ARM Mac dans `README-ARM-MAC.md`.
