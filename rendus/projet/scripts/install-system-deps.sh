#!/usr/bin/env bash
# À lancer dans TON terminal (mot de passe sudo demandé une fois) :
#   cd /home/romain/Projects/devops/rendus/projet
#   bash scripts/install-system-deps.sh

set -euo pipefail

echo "==> Mise à jour apt"
sudo apt-get update

echo "==> VirtualBox"
sudo apt-get install -y virtualbox

echo "==> Dépôt HashiCorp (Vagrant)"
if [[ ! -f /usr/share/keyrings/hashicorp-archive-keyring.gpg ]]; then
  wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
  echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(. /etc/os-release && echo "$VERSION_CODENAME") main" \
    | sudo tee /etc/apt/sources.list.d/hashicorp.list
  sudo apt-get update
fi

echo "==> Vagrant"
sudo apt-get install -y vagrant

echo "==> Plugin VirtualBox (optionnel)"
vagrant plugin install vagrant-vbguest || true

echo "==> kubectl"
if ! command -v kubectl &>/dev/null; then
  sudo apt-get install -y kubectl || {
    curl -fsSL "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" -o /tmp/kubectl
    sudo install -m 0755 /tmp/kubectl /usr/local/bin/kubectl
  }
fi

echo "==> Minikube"
if ! command -v minikube &>/dev/null; then
  curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
  sudo install minikube-linux-amd64 /usr/local/bin/minikube
  rm -f minikube-linux-amd64
fi

echo ""
echo "Versions installées :"
VBoxManage --version
vagrant --version
kubectl version --client 2>/dev/null | head -1
minikube version 2>/dev/null | head -1
docker --version

echo ""
echo "OK. Ensuite :"
echo "  cd iac && vagrant up"
echo "  minikube start --driver=docker"
