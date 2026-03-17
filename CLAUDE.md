# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Calendrier des plantes" — a French-language garden plant care calendar.

- **Backend** : Symfony 7.4 (PHP 8.3) with MongoDB via Doctrine ODM, Twig pour le rendu server-side, served by Caddy, orchestré avec Docker Compose
- **PWA** : manifest.json + service worker (`public/sw.js`) pour installation et mode offline

## Running

```bash
make dev                                                              # Démarre les 4 conteneurs
docker compose exec php composer install                              # Installe les dépendances PHP
docker compose exec php php bin/console app:import-plantes            # Importe les 60 plantes dans MongoDB
```

> **Important** : toujours exécuter les commandes `bin/console` avec `-u www-data` pour éviter des problèmes de permissions sur `var/cache/` :
> ```bash
> docker compose exec -u www-data php php bin/console cache:clear
> ```

- Symfony : http://localhost:8080
- Mongo Express : http://localhost:8081

## Commandes Make

| Commande | Rôle |
|----------|------|
| `make dev` | Démarre Docker en local |
| `make stop` | Arrête Docker |
| `make logs` | Logs dev en temps réel |
| `make shell` | Shell PHP dev |
| `make cache-clear` | Vide le cache Symfony (dev) |
| `make deploy` | Déploie sur le serveur de production |
| `make prod-logs` | Logs prod en temps réel |
| `make prod-shell` | Shell PHP prod |
| `make prod-ps` | Statut des conteneurs prod |

## Architecture

### Symfony + MongoDB + Twig

```
docker/
├── caddy/Caddyfile          # Reverse proxy → PHP-FPM, root /var/www/html/public
├── php/Dockerfile           # PHP 8.3-FPM + extensions mongodb, intl, zip, opcache
docker-compose.yml           # Services : php, caddy, mongo, mongo-express
src/
├── Document/
│   ├── Plante.php           # Document ODM — collection "plantes" (nom, type, entretien[])
│   └── Entretien.php        # EmbeddedDocument (operation, mois, details)
├── Command/
│   └── ImportPlantesCommand.php  # app:import-plantes — charge fixtures/plantes.json
├── Controller/
│   └── PlanteController.php # Routes : / → /mois/{n}, /mois/{mois}, /plante/{nom}, /offline
└── Kernel.php
templates/
├── base.html.twig           # Layout : Bootstrap 5.3.3, navbar verte, CSS responsive
├── offline.html.twig        # Page affichée hors connexion (PWA)
└── plante/
    ├── mois.html.twig       # Vue par mois : opérations groupées par type
    └── plante.html.twig     # Vue par plante : opérations triées par mois
public/
├── manifest.json            # Manifeste PWA
├── sw.js                    # Service worker (cache offline)
└── icons/                   # Icônes PWA 192×192 et 512×512
fixtures/
└── plantes.json             # 60 plantes
config/
└── packages/
    ├── doctrine_mongodb.yaml  # Connexion MongoDB ODM
    └── twig.yaml              # Configuration Twig
```

### Routes

| Route | Action |
|-------|--------|
| `GET /` | Redirige vers `/mois/{mois_courant}` |
| `GET /mois/{mois}` | Opérations du mois groupées par type de plante |
| `GET /plante/{nom}` | Opérations d'une plante triées par mois |
| `GET /offline` | Page offline PWA |

### Docker

| Service        | Image            | Port  | Rôle                        |
|---------------|------------------|-------|-----------------------------|
| `php`         | php:8.3-fpm      | 9000  | PHP-FPM + Composer          |
| `caddy`       | caddy:2-alpine   | 8080  | Serveur web / reverse proxy |
| `mongo`       | mongo:7          | 27017 | Base de données MongoDB     |
| `mongo-express`| mongo-express   | 8081  | Interface admin MongoDB     |

Credentials MongoDB : `jardin` / `jardin` (configurés dans `docker-compose.yml` et `.env`).

## Conventions

- Language : tout le texte utilisateur et les noms de variables sont en français
- PHP : attributs natifs PHP 8 pour le mapping ODM (`#[MongoDB\Document]`, `#[MongoDB\Field]`, etc.) et le routing (`#[Route]`)
- Templates Twig : navigation par `onchange` + `window.location` (rechargement de page, pas de SPA)
- Structure des données plante : `{ nom: string, type: string, entretien: [{ operation: string, mois: int, details: string }] }`
- Les mois sont indexés à partir de 1 (janvier = 1)
- Déploiement : `make deploy` (sans `--build` sauf si le Dockerfile a changé)
