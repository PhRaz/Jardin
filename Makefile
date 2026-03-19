PROD_HOST = root@157.180.90.239
PROD_DIR  = /srv/jardin
DC_PROD   = docker compose -f $(PROD_DIR)/docker-compose.prod.yml --env-file $(PROD_DIR)/.env.local

.DEFAULT_GOAL := help

# ─── Aide ─────────────────────────────────────────────────────────────────────

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[32m%-15s\033[0m %s\n", $$1, $$2}'

# ─── Développement ────────────────────────────────────────────────────────────

.PHONY: dev
dev: ## Démarre les conteneurs Docker en développement
	docker compose up -d

.PHONY: stop
stop: ## Arrête les conteneurs Docker
	docker compose down

.PHONY: logs
logs: ## Affiche les logs en temps réel
	docker compose logs -f

.PHONY: shell
shell: ## Ouvre un shell dans le conteneur PHP
	docker compose exec php bash

.PHONY: cache-clear
cache-clear: ## Vide le cache Symfony (dev)
	docker compose exec -u www-data php php bin/console cache:clear

.PHONY: build
build: ## Génère les assets front (npm run build)
	npm run build

# ─── Production ───────────────────────────────────────────────────────────────

.PHONY: deploy
deploy: ## Déploie sur le serveur de production
	ssh $(PROD_HOST) " \
		cd $(PROD_DIR) && \
		git pull && \
		npm ci && \
		npm run build && \
		$(DC_PROD) up -d && \
		$(DC_PROD) exec php composer install --no-dev --optimize-autoloader && \
		$(DC_PROD) exec php chown -R www-data:www-data /var/www/html/var && \
		$(DC_PROD) exec -u www-data php php bin/console cache:clear \
	"

.PHONY: prod-logs
prod-logs: ## Affiche les logs de production en temps réel
	ssh $(PROD_HOST) "$(DC_PROD) logs -f"

.PHONY: prod-shell
prod-shell: ## Ouvre un shell PHP en production
	ssh $(PROD_HOST) "$(DC_PROD) exec php bash"

.PHONY: prod-ps
prod-ps: ## Statut des conteneurs en production
	ssh $(PROD_HOST) "$(DC_PROD) ps"
