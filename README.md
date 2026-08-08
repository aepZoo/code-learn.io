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

1. Va dans **Settings → Pages** du repo
2. Source : **Deploy from a branch**
3. Branch : **gh-pages** / **/ (root)**
4. Chaque push sur `main` déploie automatiquement

URL : **https://aepZoo.github.io/code-learn.io/**

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
