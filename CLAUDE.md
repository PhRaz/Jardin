# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Calendrier des plantes" — a French-language garden plant care calendar. Pure client-side web app (vanilla HTML/CSS/JS) with zero dependencies and no build step.

## Running

Open `index.html` directly in a browser. No server, build tool, or package manager required.

## Architecture

Single-page app with two files:

- **`index.html`** — Page structure, inline CSS, and view selectors (month/plant dropdowns)
- **`app.js`** — All application logic:
  - **Lines 1–157**: Plant database (`plantes` array) — hardcoded JSON-like data with `nom`, `type`, and `entretien` (array of `{operation, mois, details}`)
  - **Lines 159–176**: Month labels (`moisFR`), DOM references, and plant dropdown population
  - **Lines 178–232**: Two view modes toggled by a `<select>`:
    - `showMonth()` — filters all plants' operations for a given month number
    - `showPlant()` — shows all operations for a selected plant sorted by month

All UI is in French. Plant data uses 1-indexed month numbers. Views render HTML tables directly into `div#output` via `innerHTML`.

## Conventions

- Language: all user-facing text and variable names are in French
- No external dependencies — keep it as a standalone static app
- Plant data structure: `{ nom: string, type: string, entretien: [{ operation: string, mois: number, details: string }] }`
