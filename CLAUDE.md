# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Calendrier des plantes" — a French-language garden plant care calendar. The project has two layers:

- **Frontend** : single-page app (vanilla HTML/CSS/JS) — `index.html` + `app.js`
- **Backend** : Symfony 7.4 (PHP 8.3) with MongoDB via Doctrine ODM, served by Caddy, orchestré avec Docker Compose

## Running

```bash
docker compose up -d                                          # Démarre les 4 conteneurs
docker compose exec php composer install                      # Installe les dépendances PHP
docker compose exec php php bin/console app:import-plantes    # Importe les 60 plantes dans MongoDB
```

- Symfony : http://localhost:8080
- Mongo Express : http://localhost:8081
- Le frontend statique (`index.html`) peut toujours être ouvert directement dans un navigateur

## Architecture

### Frontend (client-side)

- **`index.html`** — Structure HTML, CSS inline, sélecteurs de vue (mois/plante)
- **`app.js`** — Logique applicative :
  - Base de données des plantes (tableau `plantes`) avec `nom`, `type`, `entretien`
  - Deux vues : `showMonth()` (opérations d'un mois) et `showPlant()` (opérations d'une plante)
  - Intégration API Trefle.io pour les détails botaniques avec cache localStorage

### Backend (Symfony + MongoDB)

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
└── Kernel.php
fixtures/
└── plantes.json             # 60 plantes exportées depuis app.js
config/
└── packages/
    └── doctrine_mongodb.yaml  # Connexion MongoDB ODM
```

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
- PHP : attributs natifs PHP 8 pour le mapping ODM (`#[MongoDB\Document]`, `#[MongoDB\Field]`, etc.)
- Structure des données plante : `{ nom: string, type: string, entretien: [{ operation: string, mois: int, details: string }] }`
- Les mois sont indexés à partir de 1 (janvier = 1)
