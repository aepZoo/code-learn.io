# code-learn.io

Apprenez les bases du développement via une plateforme interactive gamifiée.

## Fonctionnalités

- **Parcours Web** — 15 exercices HTML, CSS et JavaScript
- **Gamification** — XP global, niveaux, achievements, carte de progression
- **Éditeur intégré** — Monaco Editor avec preview live
- **Simulateur de bureau** — Testez vos apps UI dans un faux OS (fichiers à gauche, app à droite)
- **Progression locale** — Sauvegardée dans le navigateur (comptes prévus en v2)

## Développement local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:5173/code-learn.io/](http://localhost:5173/code-learn.io/)

## Build

```bash
npm run build
npm run preview
```

## Déploiement GitHub Pages

Le site se déploie automatiquement à chaque push sur `main`.

**URL : https://aepZoo.github.io/code-learn.io/**

> GitHub Pages est configuré sur la branche `cursor/code-learn-mvp-a1d0`.
> Pour une config plus propre, tu peux changer dans Settings → Pages → branche `gh-pages`.

## Stack

- React 19 + Vite + TypeScript
- Zustand (state + localStorage)
- Monaco Editor
- Framer Motion

## Roadmap

- [x] MVP — Parcours Web + gamification
- [ ] v2 — Comptes utilisateurs, Python (Pyodide)
- [ ] v3 — Rust, i18n, classements

## Spec

Voir [docs/superpowers/specs/2026-08-08-code-learn-design.md](docs/superpowers/specs/2026-08-08-code-learn-design.md)
