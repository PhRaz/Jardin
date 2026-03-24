# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Calendrier des plantes" — a French-language garden plant care calendar.

- **Backend** : Symfony 7.4 (PHP 8.3) with MongoDB via Doctrine ODM, Twig pour le rendu server-side, served by Caddy, orchestré avec Docker Compose
- **PWA** : manifest.json + service worker (`public/sw.js`) pour installation et mode offline
- **PDF** : génération de calendriers PDF via Gotenberg 8 (bundle `sensiolabs/gotenberg-bundle`)

## Running

```bash
make dev                                                              # Démarre les 4 conteneurs
docker compose exec php composer install                              # Installe les dépendances PHP
docker compose exec -u www-data php php bin/console app:import-plantes  # Importe les 61 plantes dans MongoDB
docker compose exec -u www-data php php bin/console app:create-admin email@exemple.fr motdepasse  # Crée un admin
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
│   ├── Plante.php           # Document ODM — collection "plantes" (nom, nomEN, type, entretien[], photos[])
│   ├── Entretien.php        # EmbeddedDocument (id UUID, operation, mois, details)
│   ├── PhotoPlante.php      # EmbeddedDocument (id UUID, chemin, priseLe) — photos des plantes
│   ├── TrefleCache.php      # EmbeddedDocument — cache des données botaniques Trefle.io
│   ├── User.php             # Document ODM — collection "users" (email, password, roles)
│   ├── Potager.php          # Document ODM — collection "potagers" (1 par utilisateur connecté)
│   ├── JardinPlan.php       # EmbeddedDocument — 1 onglet potager (id UUID, nom, cols, rows)
│   ├── ZonePlan.php         # EmbeddedDocument — 1 zone (id UUID, nom, type, couleur)
│   └── CellulePlan.php      # EmbeddedDocument — 1 case peinte (ligne, colonne, zoneId) encodage sparse
├── Command/
│   ├── ImportPlantesCommand.php  # app:import-plantes — charge fixtures/plantes.json (génère les UUIDs)
│   └── CreateAdminCommand.php    # app:create-admin email password [--reset-password]
├── Controller/
│   ├── PlanteController.php      # Routes principales + proxy Trefle.io
│   ├── AdminController.php       # /admin — édition entretiens, upload/suppression photos (ROLE_ADMIN)
│   ├── CalendrierController.php  # /calendrier/apercu, /calendrier/pdf — génération PDF par type
│   ├── PotagerController.php     # /potager + /api/potager (GET/PUT) — plan de potager
│   └── SecurityController.php   # GET/POST /login, /logout
├── Security/
│   └── UserProvider.php     # Charge le User depuis MongoDB par email
└── Kernel.php
templates/
├── base.html.twig           # Layout : Bootstrap 5.3.3, navbar verte, modal d'édition admin + blocs extra_css/extra_js
├── offline.html.twig        # Page affichée hors connexion (PWA)
├── security/
│   └── login.html.twig      # Formulaire de connexion
├── calendrier/
│   └── calendrier.html.twig # Grille 12 mois — rendu aperçu HTML et PDF (mode param)
├── potager/
│   └── potager.html.twig    # Plan de potager — canvas Bootstrap, chargement depuis bundle Vite séparé
└── plante/
    ├── mois.html.twig       # Vue par mois : opérations groupées par type
    └── plante.html.twig     # Vue par plante : opérations triées par mois + galerie photos admin
public/
├── manifest.json            # Manifeste PWA
├── sw.js                    # Service worker (cache offline)
├── icons/                   # Icônes PWA 192×192 et 512×512
└── images/plantes/          # Photos uploadées par les admins (créé automatiquement)
fixtures/
└── plantes.json             # 61 plantes
config/
└── packages/
    ├── doctrine_mongodb.yaml  # Connexion MongoDB ODM
    ├── security.yaml          # Authentification Symfony Security
    └── twig.yaml              # Configuration Twig
```

### Routes

| Route | Action |
|-------|--------|
| `GET /` | Redirige vers `/mois/{mois_courant}` |
| `GET /mois/{mois}` | Opérations du mois groupées par type de plante |
| `GET /plante/{nom}` | Opérations d'une plante triées par mois + galerie photos |
| `GET /offline` | Page offline PWA |
| `GET/POST /login` | Formulaire de connexion |
| `GET /logout` | Déconnexion |
| `POST /admin/entretien/{id}` | Mise à jour du champ `details` d'un entretien (ROLE_ADMIN) |
| `POST /admin/plante/{nom}/photo` | Upload d'une photo (base64, ROLE_ADMIN) |
| `DELETE /admin/plante/{nom}/photo/{photoId}` | Suppression d'une photo (ROLE_ADMIN) |
| `GET /calendrier/apercu?type=&format=` | Aperçu HTML du calendrier annuel par type |
| `GET /calendrier/pdf?type=&format=` | Téléchargement PDF du calendrier (via Gotenberg) |
| `GET /potager` | Plan de potager interactif (canvas) |
| `GET /api/potager` | Charge le plan de l'utilisateur connecté (JSON) |
| `PUT /api/potager` | Sauvegarde complète du plan (JSON, CSRF token `potager-save`) |

### Docker

| Service        | Image                    | Port  | Rôle                        |
|---------------|--------------------------|-------|-----------------------------|
| `php`         | php:8.3-fpm              | 9000  | PHP-FPM + Composer          |
| `caddy`       | caddy:2-alpine           | 8080  | Serveur web / reverse proxy |
| `mongo`       | mongo:7                  | 27017 | Base de données MongoDB     |
| `mongo-express`| mongo-express           | 8081  | Interface admin MongoDB     |
| `gotenberg`   | gotenberg/gotenberg:8    | 3000  | Génération PDF via HTML     |

Credentials MongoDB : `jardin` / `jardin` (configurés dans `docker-compose.yml` et `.env`).

## Conventions

- Language : tout le texte utilisateur et les noms de variables sont en français
- PHP : attributs natifs PHP 8 pour le mapping ODM (`#[MongoDB\Document]`, `#[MongoDB\Field]`, etc.) et le routing (`#[Route]`)
- Templates Twig : navigation par `onchange` + `window.location` (rechargement de page, pas de SPA)
- Potager : bundle Vite séparé (`assets/potager.js`) — ne pas mélanger avec `app.js` ; les templates qui ont besoin d'assets différents utilisent les blocs `{% block extra_css %}` / `{% block extra_js %}` de `base.html.twig`
- Potager JS (`assets/js/potager.js`) : ES module, délégation d'événements `data-action`, IDs zones = `crypto.randomUUID()`, auto-save debounce 1,5s
- Potager MongoDB : 1 document `Potager` par utilisateur (identifié par email) ; la grille est encodée en sparse (`CellulePlan[]` — uniquement les cases peintes)
- Structure des données plante : `{ nom: string, nomEN: string, type: string, entretien: [{ id: uuid, operation: string, mois: int, details: string }], photos: [{ id: uuid, chemin: string, priseLe: date }] }`
- Les mois sont indexés à partir de 1 (janvier = 1)
- Déploiement : `make deploy` (sans `--build` sauf si le Dockerfile a changé)
- Gestion des admins : `app:create-admin email password` / `app:create-admin email password --reset-password`
- Après un `app:import-plantes` en prod, les UUIDs des entretiens changent — les modifications de `details` faites via l'UI sont perdues
