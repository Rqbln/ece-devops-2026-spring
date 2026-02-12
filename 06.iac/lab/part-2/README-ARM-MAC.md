# TP 06 IaC – Utilisation sur Mac Apple Silicon (ARM)

Sur Mac ARM (M1/M2/M3), **VirtualBox ne peut pas exécuter les VMs x86** utilisées par ce lab. Utilisez l’une des options suivantes.

## Option A : Tester les healthchecks sans VM (mock + Ansible)

1. Démarrer le serveur mock GitLab :
   ```bash
   cd 06.iac/lab/part-2
   node mock-gitlab-health.js
   ```
   (Laissez tourner dans un terminal.)

2. Dans un autre terminal, lancer le playbook de healthchecks :
   ```bash
   cd 06.iac/lab/part-2
   ansible-playbook playbooks/run-healthcheck-local.yml -i "localhost," -c local --tags check
   ```

3. **Bonus** – simuler Redis arrêté :
   ```bash
   GITLAB_REDIS_DOWN=1 node mock-gitlab-health.js
   ```
   Puis relancer le playbook : vous devriez voir `Dysfunctional services: redis`.

## Option B : VMware Fusion + Vagrant

1. Installer [VMware Fusion](https://support.broadcom.com/group/ecx/productdownloads?subfamily=VMware+Fusion) (licence gratuite personnelle).
2. Installer le plugin Vagrant : `vagrant plugin install vagrant-vmware-desktop`
3. Installer [Vagrant VMware Utility](https://developer.hashicorp.com/vagrant/install/vmware).
4. Ajouter la box : `vagrant box add generic/rocky8` (choisir `vmware_desktop`).
5. Démarrer la VM : `cd 06.iac/lab/part-2 && vagrant up --provider=vmware_desktop`

## Option C : UTM + Vagrant (box ARM)

1. Installer UTM : `brew install --cask utm`
2. Installer le plugin : `vagrant plugin install vagrant_utm`
3. Les boxes du lab (generic/rocky8, centos/7) sont x86 uniquement ; UTM nécessite une box ARM. Pour la partie 1, vous pouvez tester : `vagrant init utm/bookworm && vagrant up --provider=utm`.
