## TP 6 – Infrastructure as Code (IaC)

### Objectif du lab

- **Partie 1 – Impératif** : utiliser Vagrant avec le provisioner Shell pour créer et configurer des VMs (CentOS 7).
- **Partie 2 – Déclaratif** : installer GitLab sur une VM Rocky 8 via Vagrant et le provisioner Ansible (`ansible_local`).
- **Partie 3 – Health checks** : configurer et exécuter les health checks GitLab (health, readiness, liveness) avec Ansible et le module `uri`.
- **Bonus** : afficher uniquement les services dysfonctionnels dans le check readiness (ex. quand Redis est arrêté).

### Application possible dans le monde réel

- **IaC** : reproduire des environnements (dev, staging, prod) de façon reproductible, éviter les dérives de configuration manuelle.
- **Vagrant** : environnement de dev local proche de la prod ; onboarding rapide des nouveaux développeurs.
- **Ansible** : provisioning déclaratif, idempotent, utilisé en prod (AWS, bare-metal, cloud).
- **Health checks** : Kubernetes readiness/liveness, load balancers, monitoring (Prometheus, etc.).

### Étape dans le cycle DevOps ? Justification

- **Phase « Deploy » et « Operate »** (Provisioning et Monitoring).  
- L’IaC permet de déployer et maintenir l’infra de façon automatisée ; les health checks font partie de l’opération (surveillance, auto-healing, rollout Kubernetes).

### Problèmes rencontrés et résolution

| Problème | Message / symptôme | Analyse | Résolution | Ressources |
|----------|--------------------|---------|------------|------------|
| **VirtualBox incompatible Mac ARM** | `VBoxManage: error: Cannot run the machine because its platform architecture x86 is not supported on ARM` | VirtualBox ne supporte pas les VMs x86 sur Apple Silicon. Les boxes `generic/rocky8` et `centos/7` sont x86. | Option 1 : UTM + plugin `vagrant_utm` installés. Option 2 : mock Node.js des endpoints GitLab + playbook Ansible local pour tester les health checks sans VM. | [Vagrant UTM](https://naveenrajm7.github.io/vagrant_utm/), [VirtualBox ARM](https://www.virtualbox.org/) |
| **Docker pour GitLab non utilisable** | `error getting credentials - err: signal: terminated` | Problème de credentials Docker lors du pull de l’image GitLab. | Utilisation d’un serveur mock (`mock-gitlab-health.js`) simulant `/health`, `/readiness`, `/liveness` pour valider le playbook Ansible. | — |
| **Ansible non installé** | `ansible-playbook not found` | Ansible requis pour exécuter les health checks en local. | `brew install ansible` | [Ansible](https://docs.ansible.com/) |

### Finalité du lab

**Objectif rempli.**

- **Partie 3** : les trois health checks (health, readiness, liveness) sont implémentés dans `gitlab/healthchecks` et affichent correctement les résultats dans la console.
- **Bonus** : extraction des services dysfonctionnels via `gitlab_readiness.json.checks` ; affichage de « Dysfunctional services: redis » lorsque Redis est en échec, ou « All GitLab readiness checks are OK. » sinon.
- Tests validés via le mock GitLab et `ansible-playbook playbooks/run-healthcheck-local.yml` sur Mac ARM.
- Documentation ajoutée (`README-ARM-MAC.md`) pour les alternatives sur Apple Silicon (mock, VMware Fusion, UTM).
