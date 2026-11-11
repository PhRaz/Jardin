---
name: Calendrier des plantes
description: Le calendrier d'entretien d'un vrai jardin, à consulter au jardin sur téléphone.
colors:
  vert: "#198754"
  vert-survol: "#157347"
  vert-fonce: "#0f5132"
  vert-moyen: "#a3cfbb"
  vert-pale: "#d1e7dd"
  encre: "#212529"
  texte-doux: "#495057"
  texte-muet: "#6c757d"
  gris-ligne: "#dee2e6"
  gris-fond: "#e9ecef"
  fond: "#ffffff"
  vert-imprime: "#2d6a4f"
typography:
  display:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", \"Liberation Sans\", Arial, sans-serif"
    fontSize: "clamp(1.85rem, 1.2rem + 3vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", \"Liberation Sans\", Arial, sans-serif"
    fontSize: "calc(1.325rem + 0.9vw)"
    fontWeight: 500
    lineHeight: 1.2
  title:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", \"Liberation Sans\", Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.2
  body:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", \"Liberation Sans\", Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", \"Liberation Sans\", Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", \"Noto Sans\", \"Liberation Sans\", Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
  imprime:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "8pt"
    fontWeight: 400
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  pill: "999px"
  rond: "50%"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "1rem"
  "4": "1.5rem"
  "5": "3rem"
components:
  button-primary:
    backgroundColor: "{colors.vert}"
    textColor: "{colors.fond}"
    rounded: "{rounded.sm}"
    padding: "0.375rem 0.75rem"
  button-primary-hover:
    backgroundColor: "{colors.vert-survol}"
    textColor: "{colors.fond}"
  button-primary-lg:
    backgroundColor: "{colors.vert}"
    textColor: "{colors.fond}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
  button-outline:
    backgroundColor: "{colors.fond}"
    textColor: "{colors.vert}"
    rounded: "{rounded.sm}"
    padding: "0.375rem 0.75rem"
  button-outline-hover:
    backgroundColor: "{colors.vert}"
    textColor: "{colors.fond}"
  navbar:
    backgroundColor: "{colors.vert}"
    textColor: "{colors.fond}"
  badge-operation:
    backgroundColor: "{colors.vert-pale}"
    textColor: "{colors.vert-fonce}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.2rem 0.65rem"
  chip-plante:
    backgroundColor: "{colors.fond}"
    textColor: "{colors.encre}"
    rounded: "{rounded.pill}"
    padding: "0.25rem 0.85rem 0.25rem 0.3rem"
    height: "44px"
  tuile-mois:
    backgroundColor: "{colors.fond}"
    textColor: "{colors.encre}"
    rounded: "{rounded.md}"
    padding: "0.6rem 0.7rem"
    height: "44px"
  tuile-mois-courant:
    backgroundColor: "{colors.vert}"
    textColor: "{colors.fond}"
  frise-mois:
    backgroundColor: "{colors.gris-fond}"
    textColor: "{colors.texte-doux}"
    rounded: "6px"
    height: "2.75rem"
  frise-mois-actif:
    backgroundColor: "{colors.vert}"
    textColor: "{colors.fond}"
  input:
    backgroundColor: "{colors.fond}"
    textColor: "{colors.encre}"
    rounded: "{rounded.sm}"
    padding: "0.375rem 0.75rem"
---

# Design System: Calendrier des plantes

## Overview

**Creative North Star: "Le carnet vert du jardinier"**

Un outil de consultation sobre, construit sur Bootstrap 5.3.3 presque nu : fond blanc, texte encre, un seul vert (#198754 et sa gamme) qui porte la barre de navigation, les actions et tout ce qui « est à faire ». Rien de décoratif ne s'interpose entre la question « quoi faire ce mois-ci ? » et sa réponse. La densité est celle d'un carnet : listes, tableaux, badges, peu d'images en dehors des photos du jardinier lui-même.

Le vert est un signal plus qu'une ambiance. Il marque l'action principale, le mois courant, les mois où une plante a quelque chose à faire, et l'opération elle-même (badge vert pâle). Le gris sert à tout le reste. L'interface se lit d'une main au téléphone : cibles de 44px minimum sur les surfaces récentes, navigation par rechargement de page, pas d'effets.

Le calendrier imprimable (PDF via Gotenberg) est un sous-monde à part : Arial, vert forêt plus sombre, une couleur pâle par opération, tailles en points et en millimètres. Il partage l'esprit (un vert, du blanc, de la sobriété) mais pas les tokens d'écran.

**Key Characteristics:**
- Bootstrap 5.3.3 comme socle, personnalisé par petites feuilles (`app.css`, `accueil.css`, `potager.css`), sans thème Sass.
- Un seul accent : la gamme verte « success » de Bootstrap.
- Pile de polices système, aucune police web chargée.
- Plat par défaut ; l'ombre n'apparaît que sous les photos et les modales.
- Coins doucement arrondis (0.375rem à 0.5rem), pastilles en pilule pour les badges et les plantes.

## Colors

Un vert de jardin franc sur blanc, une gamme de gris Bootstrap pour la structure, et rien d'autre à l'écran.

### Primary
- **Vert jardin** (`vert`) : barre de navigation, boutons pleins, contour et texte des boutons secondaires, mois courant, mois actifs de la frise, tracé et nœuds du chemin de la landing. Aussi `theme_color` du manifeste PWA et `<meta name="theme-color">`.
- **Vert de survol** (`vert-survol`) : fond des boutons pleins au survol (valeur Bootstrap de `btn-success:hover`).
- **Vert sous-bois** (`vert-fonce`) : texte sur vert pâle, survol des liens verts, survol des tuiles pleines, contour du mois en cours dans la frise.
- **Vert tendre** (`vert-moyen`) : tracé pointillé « pas encore parcouru » du chemin, avant son remplissage au défilement.
- **Vert pousse** (`vert-pale`) : fond des badges d'opération, des vignettes à l'initiale et de la sélection de texte sur la landing.

### Neutral
- **Encre** (`encre`) : texte courant (couleur de corps Bootstrap), libellés de légende, swatch sélectionné du potager, fond de l'infobulle du canevas.
- **Texte doux** (`texte-doux`) : paragraphes d'accompagnement, compteurs, légendes (8.18:1 sur blanc).
- **Texte muet** (`texte-muet`) : `text-muted` Bootstrap, statut d'enregistrement, légendes du potager, dates de photo (4.69:1 sur blanc, plancher de lisibilité).
- **Ligne grise** (`gris-ligne`) : séparateurs de liste, bordures des tuiles, des pastilles et des champs.
- **Fond gris** (`gris-fond`) : cases inactives de la frise, opération par défaut du PDF.
- **Blanc** (`fond`) : fond de page, `background_color` du manifeste, texte sur vert.

### Tertiary (impression)
- **Vert forêt d'imprimé** (`vert-imprime`) : en-têtes de mois et titre de la barre d'outils du calendrier PDF. Exclusif au calendrier imprimable. Les opérations y ont chacune leur couple fond pâle / texte sombre : semis #d4edda / #155724, plantation #b7dfb8 / #0a3622, récolte #ffeaa7 / #7a5200, taille #cce5ff / #004085, engrais #fff3cd / #533f03, arrosage #d1f2fb / #0c5460, bouturage #e8d5f5 / #4a1d6b, greffe #fde8d8 / #7d3000, défaut #e9ecef / #343a40.

### Named Rules
**The Un Seul Vert Rule.** À l'écran, la seule teinte d'accent est la gamme verte. Le rouge (`#dc3545`, `btn-danger`) est réservé aux suppressions et aux erreurs ; le bleu `btn-primary` n'a pas sa place (seul cas existant : le bouton « Enregistrer » de la prise de photo, un écart).

**The Vert Veut Dire À Faire Rule.** Un fond vert plein désigne soit l'action principale, soit un mois où il y a quelque chose à faire, soit le mois courant. Un mois vide reste gris.

**The Blanc Seulement Rule.** Le vert #198754 sert de texte uniquement sur blanc (4.53:1). Sur tout fond teinté, le texte vert passe en `vert-fonce` (7.21:1 sur vert pâle).

## Typography

**Display Font:** pile système Bootstrap (system-ui, puis Segoe UI, Roboto, Helvetica Neue, Arial…)
**Body Font:** la même pile
**Impression:** Arial, Helvetica, sans-serif

**Character:** une seule famille, celle du téléphone de l'utilisateur ; la hiérarchie vient de la taille et de la graisse. Aucune police d'affichage n'est chargée à ce jour.

### Hierarchy
- **Display** (700, fluide de 1.85rem à 2.75rem, 1.12, -0.015em, `text-wrap: balance`) : titre h1 de la landing uniquement.
- **Headline** (500, h2 Bootstrap, 1.2) : titre de page des vues mois, plante et connexion (« Opérations pour novembre »). Sur la landing, les h2 d'étape passent à 1.5rem / 700.
- **Title** (500, 1.25rem, 1.2) : h5 Bootstrap, titres de groupe par type de plante, en-têtes de modale, « Photos ». La landing utilise 1.0625rem / 600 pour ses titres de type.
- **Body** (400, 1rem, 1.5) : texte courant ; sur la landing, les paragraphes d'introduction et les lignes d'aperçu montent à 1.0625rem, largeur limitée à 38rem.
- **Small** (400, 0.875rem) : liens de navigation en tableau, dates, aides.
- **Label** (500, 0.8125rem) : badges d'opération, compteurs des tuiles de mois. Les libellés de formulaire sont en gras (`fw-bold`).
- **Impression** (Arial, 8pt en A4 / 10pt en A3 pour les entretiens, 9.5pt / 12pt pour les en-têtes de mois).

### Named Rules
**The Chiffres Alignés Rule.** Les compteurs empilés en grille (tuiles des douze mois) utilisent `font-variant-numeric: tabular-nums`.

## Layout

Conteneur Bootstrap centré (`.container`) sous la barre verte (`mb-4`), avec `pb-5` en bas. Mobile d'abord, portrait (le manifeste fixe `orientation: portrait`).

- **Vues mois et plante** : sélecteurs empilés en tête (« Vue », « Mois » / « Plante »), raccourcis à droite, puis un tableau rayé par type de plante. Sous 768px, le tableau se recompose en lignes flex : plante et bouton sur la première ligne, opération puis détails en pleine largeur.
- **Landing** : colonne de lecture de 46rem (64rem à partir de 992px), textes à 38rem. Étapes espacées de 2.75rem, sections de 3.5rem. Grille de douze mois en 3, 4 puis 6 colonnes (576px, 992px). Outils en 1 puis 2 colonnes (768px).
- **Potager** : canevas à gauche, panneau fixe de 260px à droite.
- **Rythme** : l'échelle d'espacement Bootstrap (0.25, 0.5, 1, 1.5, 3rem) ; la landing ajoute 0.75rem et 2rem.
- **Cibles tactiles** : 44px minimum de hauteur pour tous les liens et tuiles des surfaces récentes.
- **Swipe** : sur la vue mois, un balayage horizontal change de mois (glissement de 250ms).

## Elevation & Depth

Système plat. La profondeur vient des bordures grises et des fonds teintés, pas des ombres. Les modales gardent l'ombre Bootstrap par défaut ; les photos ont une ombre légère.

### Shadow Vocabulary
- **Photo de galerie** (`box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)`, `shadow-sm`) : vignettes de la galerie photo d'une plante.
- **Photo suivie** (`box-shadow: 0 2px 10px rgba(15, 81, 50, 0.12)`) : grande photo de la plante suivie sur la landing, ombre teintée de vert sous-bois.

### Named Rules
**The Plat Par Défaut Rule.** Tuiles, pastilles, listes et tableaux n'ont pas d'ombre ; l'état se lit par la bordure ou le fond qui passe au vert.

## Shapes

Coins doucement arrondis partout : 0.375rem pour les boutons, champs et liens-boutons, 0.5rem pour les tuiles de mois, les grandes photos et les boutons larges, 6px pour les cases de la frise. Les badges d'opération et les pastilles de plante sont en pilule (999px) ; les vignettes de plante, les nœuds du chemin et les swatches de couleur du potager sont ronds. Les bordures font 1px en `gris-ligne` au repos.

## Components

### Buttons
Bootstrap tel quel, en vert.
- **Shape:** coins doux (0.375rem ; 0.5rem en taille large).
- **Primary :** `btn-success`, fond vert, texte blanc. Une seule action pleine par écran ou par modale (« Enregistrer », « Créer », « Voir tout novembre » en pleine largeur et taille large).
- **Hover / Focus :** fond `vert-survol`. Sur la landing, focus par contour vert de 3px décalé de 2px ; ailleurs, anneau de focus Bootstrap par défaut.
- **Secondary :** `btn-outline-success`, contour et texte verts sur blanc, rempli de vert au survol. C'est le bouton courant (« Détails », « Potager », « Ouvrir la fiche… »).
- **Annuler :** `btn-secondary` gris dans les pieds de modale.
- **Destructif :** `btn-danger` réservé à la suppression de photo.

### Lien-bouton de navigation
Lien vers une plante ou un mois dans les tableaux : contour vert 1px, texte vert, 0.875rem, coins de 0.375rem, pleine largeur de cellule ; au survol, fond vert et texte blanc.

### Chips
- **Badge d'opération :** pilule vert pâle, texte vert sous-bois, label 0.8125rem / 500. Nomme l'opération (« Taille », « Semis »…).
- **Pastille de plante :** pilule blanche à bordure grise, vignette ronde de 2rem (photo, ou initiale sur vert pâle) puis le nom ; au survol, bordure verte et texte vert sous-bois.

### Cards / Containers
- **Tuile de mois :** bordure grise, coins de 0.5rem, nom du mois en gras puis compteur en texte doux ; le mois courant est plein vert, texte blanc. Pas d'ombre.
- **Modale :** en-tête plein vert, titre blanc, croix blanche ; corps et pied Bootstrap.

### Inputs / Fields
- **Style :** `form-select` / `form-control` Bootstrap, bordure `gris-ligne`, coins de 0.375rem, libellé en gras à gauche du champ.
- **Focus :** anneau Bootstrap par défaut (bleu) hors landing ; contour vert de 3px sur la landing.

### Navigation
Barre `navbar-dark bg-success` pleine largeur : nom du site à gauche en blanc, « Connexion » / « Déconnexion » à droite, email de l'admin en blanc à 50 %. Même rendu sur mobile, pas de menu repliable. Sur la landing, une navigation mois précédent / mois suivant avec chevrons SVG en trait de 2px.

### Frise des douze mois (signature)
Douze cases de 2.75rem de haut, initiale du mois, espacées de 3px. Mois sans opération en gris ; mois actif plein vert et cliquable ; mois visité entouré d'un contour vert sous-bois. Accompagnée d'une légende texte qui détaille chaque mois actif.

### Chemin de la landing (signature de surface)
Tracé vertical pointillé vert (2px, tirets de 6px) reliant des nœuds ronds de 1.5rem à bordure verte de 3px ; le premier nœud est plein. Le tracé se remplit de vert au défilement là où `animation-timeline` est pris en charge, et reste statique en `prefers-reduced-motion`. Propre à la landing : ce n'est pas un ornement à reproduire sur d'autres pages.

### Plan du potager
Canevas à bordure beige (#d4c8b0), curseur en croix. Panneau de zones : élément à coins de 7px, fond vert très pâle (#e8f5e9) au survol, bordure verte quand actif ; swatches ronds de 20px qui grossissent au survol ; onglets Bootstrap dont l'onglet d'ajout est en tirets. Infobulle encre, texte blanc, suivant le pointeur. Transitions de 0.15s.

## Do's and Don'ts

### Do:
- **Do** utiliser `btn-success` pour la seule action principale et `btn-outline-success` pour toutes les autres.
- **Do** passer le texte vert en `vert-fonce` dès qu'il repose sur un fond teinté.
- **Do** donner 44px de hauteur minimum à tout lien ou tuile touchable.
- **Do** marquer les mois actifs et le mois courant en vert plein, les mois vides en gris.
- **Do** dessiner les pictogrammes en SVG inline à trait de 2px en `currentColor`, comme les chevrons de la landing.
- **Do** garder les animations courtes (250ms ou moins) et les couper en `prefers-reduced-motion`.
- **Do** réserver Arial, `vert-imprime` et les couleurs par opération au calendrier imprimable.

### Don't:
- **Don't** introduire une seconde couleur d'accent à l'écran ; le rouge reste réservé à la suppression et aux erreurs.
- **Don't** écrire du texte #198754 sur un fond gris ou teinté (4.3:1 sur #f8f9fa, sous le seuil AA).
- **Don't** ajouter d'ombre aux tuiles, pastilles ou listes.
- **Don't** reprendre le tracé du chemin hors de la landing.
- **Don't** utiliser d'emoji comme icône de bouton ou de titre.
