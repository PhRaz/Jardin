# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

PWA installable (`public/manifest.json` : `display: standalone`, orientation portrait, nom court « Jardin »), mode hors ligne via `public/sw.js`.

## Users

- **Principal : le propriétaire du jardin**, qui consulte au jardin, sur téléphone, souvent avec la PWA installée, ce qu'il y a à faire ce mois-ci, et qui tient à jour notes et photos de ses plantes (rôle admin).
- **Visé : d'autres jardiniers amateurs francophones.** Aujourd'hui l'usage est personnel, mais l'objectif est d'ouvrir l'appli à d'autres jardiniers.

## Product Purpose

Répondre à la question « qu'est-ce que je fais au jardin ce mois-ci ? » pour un jardin réel : opérations d'entretien (plantation, taille, récolte, engrais…) par mois, regroupées par type de plante, avec une fiche par plante, un plan de potager et un calendrier annuel imprimable.

Succès : en ouvrant l'appli au jardin, on sait tout de suite quoi faire et sur quelle plante.

## Positioning

Ce n'est pas un référentiel générique : ce sont **les plantes réellement présentes dans le jardin du propriétaire** (61 aujourd'hui), avec ses propres notes d'entretien et ses propres photos. Le contenu vient de quelqu'un qui jardine ces plantes, pas d'une base encyclopédique.

## Operating Context

- Usage principal dehors, sur téléphone, souvent d'une main. L'appli installée (PWA) s'ouvre sur le mois courant (`/aujourdhui`, rendu sans redirection) ; `/` est la landing « Le chemin du jardin », qui fait parcourir mois → plante → mois sur le vrai contenu.
- Navigation entre les mois et vers les fiches plante. Rechargements de page classiques (Twig server-side), pas de SPA.
- Usages secondaires : dessiner le plan du potager (canevas, onglets, zones colorées), générer le calendrier annuel en PDF par type de plante (aperçu et téléchargement via Gotenberg).
- Fiche plante : données botaniques complémentaires chargées depuis Trefle.io (recherche par nom anglais).

## Capabilities and Constraints

- Lecture du calendrier et des fiches plante sans compte.
- Admin (`ROLE_ADMIN`) : modification du champ `details` d'un entretien, ajout et suppression de photos de plantes.
- Potager : la page est publique, mais le chargement et la sauvegarde (`/api/potager`) demandent un compte. Un plan par utilisateur, sauvegarde automatique.
- Comptes créés uniquement en ligne de commande (`app:create-admin`) : pas d'inscription en libre-service.
- Types de plante : légume, fleur, arbre fruitier, arbuste ornemental, herbe aromatique, fruitier, arbre ornemental, plante grimpante.
- Mois indexés de 1 à 12, tout le texte est en français.
- Stack existante : Symfony 7.4 / PHP 8.4, MongoDB, Twig, Bootstrap 5.3, bundles Vite séparés (`app`, `potager`).
- **Non décidé** : comment l'ouverture à d'autres jardiniers s'articule avec un contenu centré sur le jardin du propriétaire (un jardin et ses plantes par utilisateur, ou une référence commune ?), et s'il y aura une inscription en libre-service.

## Brand Commitments

- Nom : « Calendrier des plantes », nom court PWA « Jardin », domaine caljar.fr.
- Langue : français uniquement.

## Evidence on Hand

- `fixtures/plantes.json` : 61 plantes avec leurs opérations d'entretien et leurs détails.
- Photos de plantes uploadées par l'admin (`public/images/plantes/`, volume Docker en prod).
- Icônes PWA : `public/icons/icon-192.png`, `icon-512.png`.
- Aucun témoignage, chiffre d'audience ou utilisateur externe à ce jour : ne pas en inventer.

## Product Principles

1. **Le mois courant d'abord** : la réponse à « quoi faire maintenant » doit être immédiate, au jardin, sur un petit écran.
2. **Un vrai jardin, pas une encyclopédie** : les notes et les photos du jardinier priment sur les données génériques (Trefle n'est qu'un complément).
3. **Simple et sans distraction** : pas de fonctionnalités sociales ni de publicité, rien qui éloigne de la tâche au jardin.
4. **Fonctionne hors ligne** : au fond du jardin, le réseau n'est pas garanti.
