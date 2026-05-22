.PHONY: install test lint start docker-up docker-build docker-push k8s-apply capture env-check

WEBAPP = webapp
-include .env
export

DOCKER_IMAGE ?= romainmlt/devops-cv-webapp:latest
REDIS_HOST ?= 127.0.0.1
REDIS_PORT ?= 6379

install:
	cd $(WEBAPP) && npm install

# Démarre Redis via Docker si rien n'écoute sur REDIS_PORT ; sinon utilise Redis existant
test:
	@port=$(REDIS_PORT); \
	if command -v nc >/dev/null 2>&1 && nc -z $(REDIS_HOST) $$port 2>/dev/null; then \
	  echo "==> Redis déjà disponible sur $(REDIS_HOST):$$port"; \
	elif command -v redis-cli >/dev/null 2>&1 && redis-cli -h $(REDIS_HOST) -p $$port ping 2>/dev/null | grep -q PONG; then \
	  echo "==> Redis déjà disponible (redis-cli)"; \
	elif command -v docker >/dev/null 2>&1; then \
	  echo "==> Démarrage Redis via Docker"; \
	  docker start redis-test 2>/dev/null || docker run -d --name redis-test -p $$port:6379 redis:7-alpine; \
	  sleep 1; \
	else \
	  echo "ERREUR: Redis requis sur $(REDIS_HOST):$$port (Docker ou redis-server)"; exit 1; \
	fi
	cd $(WEBAPP) && REDIS_HOST=$(REDIS_HOST) REDIS_PORT=$(REDIS_PORT) npm test

lint:
	cd $(WEBAPP) && npx eslint src test

start:
	cd $(WEBAPP) && REDIS_HOST=$(REDIS_HOST) REDIS_PORT=$(REDIS_PORT) npm start

docker-up:
	cd $(WEBAPP) && docker compose up --build

docker-build:
	cd $(WEBAPP) && docker build -t $(DOCKER_IMAGE) .

docker-push: docker-build
	@test -n "$(DOCKERHUB_USERNAME)" || (echo "Renseigner DOCKERHUB_USERNAME dans .env"; exit 1)
	docker login -u "$(DOCKERHUB_USERNAME)" -p "$(DOCKERHUB_TOKEN)"
	docker push $(DOCKER_IMAGE)

k8s-apply:
	kubectl apply -f image/redis-deployment.yaml
	kubectl apply -f image/redis-service.yaml
	kubectl apply -f image/deployment.yaml
	kubectl apply -f image/service.yaml

capture:
	bash scripts/capture-evidence.sh

env-check:
	@echo "DOCKER_IMAGE=$(DOCKER_IMAGE)"
	@echo "DOCKERHUB_USERNAME=$(DOCKERHUB_USERNAME)"
	@test -n "$(DOCKERHUB_TOKEN)" && echo "DOCKERHUB_TOKEN=*** (défini)" || echo "DOCKERHUB_TOKEN=(vide — à remplir pour push)"
