# Déploiement sur VPS Hetzner

## Prérequis

- Un compte [Hetzner Cloud](https://console.hetzner.cloud)
- Une clé SSH locale (`~/.ssh/id_rsa.pub`)

---

## 1. Créer le serveur

1. Connecte-toi sur [console.hetzner.cloud](https://console.hetzner.cloud)
2. Créer un nouveau projet (ex : "Jardin")
3. **Add Server** :
   - Location : Nuremberg ou Helsinki
   - Image : **Ubuntu 24.04**
   - Type : **CX22** (2 vCPU, 4 GB RAM, ~4 €/mois)
   - SSH keys : coller le contenu de `~/.ssh/id_rsa.pub`
   - Cliquer **Create & Buy**
4. Noter l'**IP publique** du serveur (ex : `5.75.12.34`)

---

## 2. Préparer le serveur

```bash
ssh root@IP_DU_SERVEUR

# Installer Docker
curl -fsSL https://get.docker.com | sh

# Firewall
ufw allow 22
ufw allow 80
ufw enable
```

---

## 3. Déployer l'application

```bash
git clone https://github.com/PhRaz/Jardin.git /srv/jardin
cd /srv/jardin

# Créer le fichier d'environnement
cp .env.prod.example .env.local
nano .env.local
```

Remplir `.env.local` :

```env
APP_ENV=prod
APP_SECRET=           # générer avec : openssl rand -hex 32

MONGODB_URI=mongodb://jardin:CHANGE_PASSWORD@mongo:27017/?authSource=admin
MONGODB_DB=jardin
MONGO_USER=jardin
MONGO_PASSWORD=CHANGE_PASSWORD  # choisir un mot de passe fort

TREFLE_API_TOKEN=usr-Sjf861s6j1ffaDJETgyrRbFW-1Ub1cjD5OPTGYBX7Lk
```

> **Important** : Docker Compose ne lit pas `.env.local` automatiquement.
> Il faut ajouter `--env-file .env.local` à toutes les commandes `docker compose`.

```bash
docker compose -f docker-compose.prod.yml --env-file .env.local up -d --build
docker compose -f docker-compose.prod.yml --env-file .env.local exec php composer install --no-dev --optimize-autoloader
docker compose -f docker-compose.prod.yml --env-file .env.local exec php php bin/console app:import-plantes
docker compose -f docker-compose.prod.yml --env-file .env.local exec php php bin/console cache:warmup
```

Le site est accessible sur **`http://IP_DU_SERVEUR`**.

---

## 4. Mises à jour

```bash
cd /srv/jardin
git pull
docker compose -f docker-compose.prod.yml --env-file .env.local up -d --build
docker compose -f docker-compose.prod.yml --env-file .env.local exec php php bin/console cache:clear
```

---

## 5. Activer HTTPS avec un nom de domaine

1. Chez ton registrar, créer un enregistrement DNS **A** pointant vers l'IP du serveur
2. Attendre la propagation DNS (quelques minutes à quelques heures)
3. Sur le serveur :

```bash
ufw allow 443

# Éditer Caddyfile.prod : remplacer TON_DOMAINE.fr par ton vrai domaine
nano /srv/jardin/docker/caddy/Caddyfile.prod

# Switcher docker-compose.prod.yml sur Caddyfile.prod
nano /srv/jardin/docker-compose.prod.yml
# Changer : ./docker/caddy/Caddyfile → ./docker/caddy/Caddyfile.prod

docker compose -f docker-compose.prod.yml --env-file .env.local restart caddy
```

Caddy obtient automatiquement le certificat **Let's Encrypt**.

---

## Commandes utiles

```bash
# Alias pratique pour éviter de répéter les flags
alias dc="docker compose -f docker-compose.prod.yml --env-file .env.local"

# Voir les logs
dc logs -f

# Voir les logs d'un service
dc logs -f caddy
dc logs -f php

# Redémarrer un service
dc restart php

# Arrêter tout
dc down

# Shell PHP
dc exec php bash
```


## resume session claude

claude --resume f0620050-49a5-48e5-921e-49e1a2586340
