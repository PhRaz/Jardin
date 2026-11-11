---
version: 1
slug: "templates-accueil-html-twig"
primary_target: "templates/accueil.html.twig"
related_targets: ["src/Controller/PlanteController.php"]
---

# Landing `/` — Le chemin du jardin

Mode : Persuade (léger). Visiteur qui découvre le site, sur téléphone d'abord. But : comprendre en une page qu'on navigue de mois en mois et de plante en plante, en faisant le trajet sur le vrai contenu. Ton de jardinier, aucun discours marketing, aucun chiffre inventé (comptes lus en base).

Contraintes : monde existant (Bootstrap 5.3, vert #198754, pile système), aucune nouvelle dépendance ; autres pages intactes ; PWA `start_url` → `/aujourdhui` (rend le mois courant sans redirection) ; `/` précaché par le service worker.

États : mois courant vide (janvier, décembre) → « Rien de prévu en <mois> », la visite repart sur le prochain mois actif ; plante sans photo → vignette à l'initiale ; plante suivie stable sur la journée.

Non décidé : lien « Accueil » dans la barre (par défaut non).

## Direction contract

THESIS: la page est un chemin qu'on parcourt réellement : mois courant → une de ses plantes → son année → un autre mois. Elle refuse le hero + rangée de cartes de fonctionnalités.

OWN-WORLD: le vert Bootstrap #198754 sur blanc, badges d'opération vert pâle #d1e7dd / #0f5132, pile système ; un tracé de chemin pointillé vert qui relie les étapes par des nœuds ronds, seul ornement de la page.

STORY: le visiteur voit tout de suite ce qu'il y a à faire ce mois-ci, suit une plante jusqu'à son calendrier, rebondit sur un autre mois, et comprend qu'il peut se promener ainsi partout ; il finit sur les accès directs (12 mois, index des plantes).

FIRST VIEWPORT: à 390 px, barre verte, titre h1 sur deux lignes (trois à 390 px : adaptation citée, la taille h1 est gardée et le reste du premier écran tient), une phrase avec les comptes réels, puis la première étape du chemin : « Novembre : 18 choses à faire », flèches ‹ octobre / décembre ›, trois opérations à badge, bouton plein « Voir tout novembre » (action primaire) ; l'amorce de l'étape 2 dépasse en bas.

FORM: « Le chemin du jardin », position 6 de ma liste ordonnée de 7, seed:19b1617807153c62. Signature : le tracé du chemin qui se remplit de vert au défilement (animation liée au scroll, contenu toujours visible, désactivée en prefers-reduced-motion) ; la frise 12 mois de la plante suivie, chaque mois actif cliquable.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
