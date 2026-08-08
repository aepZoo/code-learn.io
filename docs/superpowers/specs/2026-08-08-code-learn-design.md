# code-learn.io — Design Specification

**Date:** 2026-08-08  
**Status:** Approved  
**Version:** MVP v1

## 1. Vision

Plateforme web interactive gamifiée pour apprendre les bases du développement. Les utilisateurs progressent via des exercices guidés, gagnent de l'XP, débloquent des achievements, et peuvent simuler leurs applications dans un faux bureau d'ordinateur.

### Public cible

Public mixte : débutants complets (12–18 ans), adultes en reconversion, et étudiants avec bases scolaires. Contenu adaptable avec parcours à difficulté progressive et ton visuel "jeu" sans être enfantin.

### Langues enseignées

| Langage | MVP v1 | Futur |
|---------|--------|-------|
| HTML/CSS/JS | ✅ Complet | — |
| Python | 🔒 Visible "Bientôt" | Pyodide (WASM) |
| Rust | 🔒 Visible "Bientôt" | WASM ou backend |

### Langue de la plateforme

Français uniquement pour la v1.

---

## 2. Architecture

### Stack technique

- **Framework:** React 18 + Vite + TypeScript
- **State:** Zustand avec persistance localStorage
- **Éditeur:** Monaco Editor (thème dark "hacker")
- **Animations:** Framer Motion
- **Styles:** CSS Modules ou Tailwind CSS
- **Hébergement:** GitHub Pages via GitHub Actions
- **Polices:** Inter (UI), JetBrains Mono (code)

### Schéma architectural

```
┌─────────────────────────────────────────────────────────┐
│                    code-learn.io (SPA)                   │
├──────────────┬──────────────────┬───────────────────────┤
│   HUD Jeu    │   Zone centrale   │    Panneau latéral    │
│  XP · Niveau │  Carte / Exercice │   Éditeur · Preview   │
│  Badges      │  ou Simulateur    │   Console             │
├──────────────┴──────────────────┴───────────────────────┤
│              ProgressStore (Zustand → localStorage)      │
├─────────────────────────────────────────────────────────┤
│  Contenu JSON (exercices, parcours, achievements)       │
└─────────────────────────────────────────────────────────┘
```

### Pages principales

1. **Accueil** — Avatar, niveau global, parcours disponibles (Web actif, Python/Rust "Bientôt")
2. **Carte du parcours** — Nœuds d'exercices débloqués/verrouillés, progression visuelle
3. **Exercice** — Consignes + éditeur + preview live + validation
4. **Simulateur bureau** — Pour exercices UI avancés (fichiers à gauche, app à droite)
5. **Profil** — Stats, achievements, historique

### Exécution du code

| Langage | Méthode | Notes |
|---------|---------|-------|
| HTML/CSS/JS | iframe sandbox + `postMessage` | `sandbox="allow-scripts"`, pas d'accès parent |
| Python (futur) | Pyodide WASM | Exécution 100% navigateur |
| Rust (futur) | WASM compilé ou backend | À définir en v2 |

---

## 3. Persistance des données

### MVP : localStorage

Structure pensée pour migration future vers API backend.

```typescript
interface PlayerProgress {
  version: 1;
  player: {
    level: number;
    totalXP: number;
    avatar: string;
    title: string;
  };
  tracks: {
    web: {
      xp: number;
      completedLessons: string[];
      currentLesson: string | null;
      stars: Record<string, 1 | 2 | 3>;
    };
    python: { locked: true };
    rust: { locked: true };
  };
  achievements: {
    unlocked: string[];
    dates: Record<string, string>; // ISO date
  };
  settings: {
    theme: 'light' | 'dark';
    editorFontSize: number;
    soundEnabled: boolean;
  };
  // Champs futurs pour migration comptes
  _migration?: {
    readyForSync: boolean;
    localId: string;
  };
}
```

### v2 : Comptes utilisateurs

Migration de la progression locale vers compte (email, GitHub OAuth, Google OAuth). Backend + base de données requis.

---

## 4. Système XP & Gamification

### XP global vs XP par parcours

| Type | Rôle | Exemple |
|------|------|---------|
| XP global | Niveau joueur, titre, déblocages cross-parcours | Niveau 5 → badge "Explorateur" |
| XP parcours | Progression dans le track Web | Web : 340/500 XP → chapitre CSS débloqué |

### Formule de niveau

```
niveau = floor(sqrt(totalXP / 100))
XP requis pour niveau N = N² × 100
```

Progression rapide au début (motivation), plus exigeante ensuite.

### Sources d'XP

| Action | XP |
|--------|-----|
| Exercice complété (1ère fois) | +25 à +50 selon difficulté |
| Exercice complété (rejeu) | +5 |
| Projet chapitre terminé | +100 |
| Achievement débloqué | +15 bonus |
| Streak quotidien (v2) | +10/jour |

### Titres de joueur

| Niveau | Titre |
|--------|-------|
| 1 | Apprenti |
| 5 | Codeur |
| 10 | Développeur |
| 20 | Architecte |

### Achievements MVP (~12)

**Premiers pas**
- `first_code` — Première ligne de code
- `html_master` — Terminer le chapitre HTML
- `css_artist` — Terminer le chapitre CSS

**Style**
- `no_hints` — Exercice sans indice
- `speed_run` — Exercice en moins de 2 min

**Fun**
- `bug_hunter` — 10 erreurs de compilation corrigées
- `night_owl` — Coder après 22h (heure locale)

**Progression**
- `level_5` / `level_10` — Atteindre un niveau global
- `web_complete` — Finir tout le parcours Web

### Feedback visuel

- **Exercice réussi:** Confettis légers + "+35 XP" flottant, barre XP animée (300ms ease-out)
- **Level-up:** Modal plein écran "Niveau N !" + nouveau titre
- **Achievement:** Toast latéral avec icône + animation badge profil
- **Chapitre débloqué:** Nœud carte qui s'illumine + pulse

### Carte de parcours

```
        [HTML Basics]──[HTML Forms]──[HTML Projet]
              │                              │
         [CSS Intro]──[CSS Flexbox]──[CSS Grid]
              │                              │
         [JS Basics]──[JS DOM]──────[JS Projet]
                                              │
                                    [🏆 Simulateur Bureau]
```

États des nœuds :
- **Verrouillé:** Grisé + cadenas
- **En cours:** Surbrillance pulsante
- **Complété:** Checkmark doré + étoiles (1–3 selon performance)

---

## 5. Éditeur de code

### Layout écran exercice

```
┌──────────────────────────────────────────────────────────────┐
│ 🎮 Niv.5  ████████░░ 820XP  │  Exercice 3/8 : Créer un bouton │
├─────────────────────────────┬────────────────────────────────┤
│   ÉDITEUR (Monaco)          │  📋 Consignes                   │
│   Onglets: HTML │ CSS │ JS   │  Crée un bouton rouge...        │
│   ┌─────────────────────┐   │  💡 Indice (coûte 5 XP)         │
│   │  code...            │   │  [▶ Exécuter]  [✓ Valider]      │
│   └─────────────────────┘   │                                 │
├─────────────────────────────┴────────────────────────────────┤
│  PREVIEW LIVE (droite)     │  CONSOLE (erreurs JS)            │
└──────────────────────────────────────────────────────────────┘
```

### Fonctionnalités éditeur

- Monaco Editor avec coloration syntaxique
- Numéros de ligne, auto-indent
- Thème dark `#0D1117` (style GitHub)
- Onglets HTML / CSS / JS selon exercice
- Preview live via iframe sandbox
- Console pour erreurs JS

### Validation des exercices

Tests déclaratifs par exercice :

```typescript
interface ValidationRule {
  type: 'dom-exists' | 'css-property' | 'js-output' | 'html-structure';
  selector?: string;
  checks: Array<{
    property?: string;
    equals?: string;
    contains?: string;
    matches?: string;
  }>;
}
```

Exemple :

```json
{
  "type": "dom-exists",
  "selector": "button",
  "checks": [{ "property": "textContent", "contains": "Clique-moi" }]
}
```

---

## 6. Simulateur de bureau

Activé pour les exercices UI avancés (chapitre "Première App" et suivants).

### Layout (fichiers à gauche, app à droite)

```
┌─────────────────────────────────────────────────────────────┐
│  🖥️ CodeDesk OS                              🔋 14:32  📶  │
├─────────────────────────────────────────────────────────────┤
│   ┌─────────────────────┐   ┌──────────────────────────┐   │
│   │ 📁 Fichiers    ─ □ ✕│   │ 🌐 Mon App          ─ □ ✕│   │
│   │  📄 index.html  ◀   │   │   [Preview iframe]       │   │
│   │  📄 style.css       │   │                          │   │
│   │  📄 script.js       │   │                          │   │
│   └─────────────────────┘   └──────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  🚀 Démarrer  │  📂  │  🌐 Chrome  │  💻 Terminal  │  ⚙️   │
└─────────────────────────────────────────────────────────────┘
```

### Fonctionnalités MVP

- Barre des tâches avec icônes cliquables
- Fenêtres draggables et redimensionnables
- Panneau fichiers à gauche (index.html, style.css, script.js)
- Preview app à droite dans fenêtre "Mon App"
- Terminal simulé pour `console.log`
- Horloge fictive, fond d'écran personnalisable (récompense niveau 5)

### Hors scope MVP bureau

- Multi-fenêtres complexes
- Vrai filesystem
- Apps système interactives

---

## 7. Contenu MVP — Parcours Web

~15 exercices répartis en 6 chapitres :

| Chapitre | Exercices | Mode preview |
|----------|-----------|--------------|
| HTML Basics | 4 | Preview simple |
| HTML Forms | 2 | Preview simple |
| CSS Intro | 3 | Preview simple |
| CSS Layout | 3 | Preview simple |
| JS Basics | 2 | Console |
| Première App | 1 | Simulateur bureau |

### Format exercice (JSON)

```typescript
interface Exercise {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  xpReward: number;
  hints: string[];
  hintCost: number;
  starterCode: {
    html?: string;
    css?: string;
    js?: string;
  };
  validation: ValidationRule[];
  mode: 'preview' | 'console' | 'desktop';
}
```

---

## 8. Structure du projet

```
code-learn.io/
├── src/
│   ├── components/
│   │   ├── game/          # HUD XP, badges, level-up modal
│   │   ├── editor/        # Monaco wrapper, onglets fichiers
│   │   ├── preview/       # iframe sandbox + console
│   │   ├── desktop/       # simulateur OS (fenêtres, taskbar)
│   │   ├── track-map/     # carte de progression
│   │   └── ui/            # boutons, toasts, modals
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── TrackMap.tsx
│   │   ├── Exercise.tsx
│   │   └── Profile.tsx
│   ├── stores/
│   │   └── progressStore.ts
│   ├── engine/
│   │   ├── validator.ts
│   │   └── xpCalculator.ts
│   ├── content/
│   │   ├── tracks/web/
│   │   └── achievements.json
│   └── App.tsx
├── public/assets/
├── docs/superpowers/specs/
├── .github/workflows/deploy.yml
├── package.json
└── vite.config.ts
```

---

## 9. Déploiement

- Build Vite → `dist/`
- GitHub Actions sur push `main`
- URL : `https://<user>.github.io/code-learn.io/`
- Config Vite : `base: '/code-learn.io/'`

---

## 10. Palette visuelle

| Usage | Couleur |
|-------|---------|
| Fond clair | `#F8F9FC` |
| Fond dark | `#1A1A2E` |
| Accent XP | `#6C5CE7` |
| Succès | `#00B894` |
| Erreur | `#E17055` |
| Éditeur | `#0D1117` |

Style moderne gamifié (Duolingo/Codecademy) avec touches "hacker" sur l'éditeur.

---

## 11. Roadmap

### v1 (MVP) — Ce spec
- Parcours Web complet (~15 exercices)
- XP global + par parcours
- ~12 achievements
- Éditeur Monaco + preview live
- Simulateur bureau (fichiers ← app →)
- Persistance localStorage

### v2
- Comptes utilisateurs + sync progression
- Parcours Python (Pyodide)
- Streaks quotidiens
- Plus d'exercices et projets

### v3
- Parcours Rust
- Mode multijoueur / classements
- Création d'exercices par la communauté
- i18n (anglais)

---

## 12. Récapitulatif décisions

| Décision | Choix |
|----------|-------|
| Public | Mixte (tous profils) |
| Persistance | LocalStorage → comptes v2 |
| MVP scope | Parcours Web + gamification |
| Style visuel | Moderne gamifié (Duolingo-like) |
| Langue UI | Français |
| Stack | React + Vite + TypeScript |
| Layout bureau | Fichiers gauche, app droite |
| Hébergement | GitHub Pages |
