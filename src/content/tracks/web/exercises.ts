import type { Exercise } from '../../../types'

export const webExercises: Exercise[] = [
  {
    id: 'html-1',
    chapterId: 'html-basics',
    title: 'Titre principal',
    description: 'Affichez « Bonjour le monde » comme titre principal de votre page.',
    explanation:
      'La balise `<h1>` définit le titre le plus important d\'une page. Les titres vont de h1 (principal) à h6 (le plus petit). Tout texte entre une balise ouvrante `<h1>` et fermante `</h1>` s\'affiche comme un gros titre.',
    difficulty: 1,
    xpReward: 25,
    hints: [
      'Cherchez quelle balise sert aux titres principaux en HTML.',
      'Il existe six niveaux de titres — le premier est le plus grand.',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      { type: 'dom-exists', selector: 'h1', checks: [{ property: 'textContent', contains: 'Bonjour le monde' }] },
    ],
    mode: 'preview',
    order: 1,
  },
  {
    id: 'html-2',
    chapterId: 'html-basics',
    title: 'Paragraphe',
    description: 'Ajoutez un paragraphe de texte sous votre titre (minimum 10 caractères).',
    explanation:
      'La balise `<p>` crée un paragraphe : un bloc de texte séparé des autres. Chaque `<p>` est affiché avec un espace avant et après, ce qui structure la lecture.',
    difficulty: 1,
    xpReward: 25,
    hints: [
      'Les paragraphes ont une balise dédiée, une seule lettre.',
      'Pensez à une balise courte qui commence par « p ».',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      { type: 'dom-exists', selector: 'p', checks: [{ property: 'textContent', matches: '.{10,}' }] },
    ],
    mode: 'preview',
    order: 2,
  },
  {
    id: 'html-3',
    chapterId: 'html-basics',
    title: 'Liste à puces',
    description: 'Créez une liste non ordonnée contenant au moins 3 éléments.',
    explanation:
      '`<ul>` (unordered list) est le conteneur d\'une liste à puces. Chaque élément est un `<li>` (list item). Le navigateur ajoute automatiquement une puce devant chaque li.',
    difficulty: 1,
    xpReward: 30,
    hints: [
      'Une liste a besoin d\'un conteneur et d\'éléments enfants.',
      'ul = liste non ordonnée, li = élément de liste.',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      { type: 'html-well-formed', checks: [] },
      { type: 'dom-exists', selector: 'ul li', checks: [], minCount: 3 },
    ],
    mode: 'preview',
    order: 3,
  },
  {
    id: 'html-4',
    chapterId: 'html-basics',
    title: 'Lien hypertexte',
    description: 'Dans un élément de votre liste, ajoutez un lien vers github.com affichant « GitHub ».',
    explanation:
      '`<a href="url">` crée un hyperlien cliquable. L\'attribut `href` indique la destination. Chaque balise ouverte doit être fermée (`</a>`, `</li>`…) au bon endroit — le navigateur ne devine pas toujours correctement.',
    difficulty: 2,
    xpReward: 35,
    hints: [
      'Les liens utilisent la balise « a » avec un attribut pour l\'adresse.',
      'Vérifiez que chaque balise ouverte a sa fermeture.',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      { type: 'html-well-formed', checks: [] },
      { type: 'dom-exists', selector: 'ul', checks: [] },
      { type: 'dom-exists', selector: 'ul li a', checks: [
        { property: 'textContent', contains: 'GitHub' },
        { property: 'href', contains: 'github.com' },
      ]},
    ],
    mode: 'preview',
    order: 4,
  },
  {
    id: 'html-5',
    chapterId: 'html-forms',
    title: 'Bouton',
    description: 'Ajoutez un bouton rouge affichant « Clique-moi ».',
    explanation:
      '`<button>` est un élément interactif : l\'utilisateur peut cliquer dessus. On peut le colorer via CSS (`background-color`) ou l\'attribut `style` directement dans le HTML.',
    difficulty: 2,
    xpReward: 35,
    hints: [
      'Il existe une balise spécifique pour les boutons.',
      'La couleur peut se mettre en CSS ou en style inline sur l\'élément.',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      { type: 'dom-exists', selector: 'button', checks: [{ property: 'textContent', contains: 'Clique-moi' }] },
    ],
    mode: 'preview',
    order: 5,
  },
  {
    id: 'html-6',
    chapterId: 'html-forms',
    title: 'Champ de saisie',
    description: 'Créez un champ de saisie texte accompagné du label « Email ».',
    explanation:
      '`<label>` décrit un champ de formulaire. `<input type="text">` crée une zone où l\'utilisateur peut taper du texte. Le type précise le genre de donnée attendue.',
    difficulty: 2,
    xpReward: 40,
    hints: [
      'Un champ de texte utilise input avec un attribut type.',
      'Le label et l\'input sont deux balises distinctes.',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      { type: 'dom-exists', selector: 'input[type="text"]', checks: [] },
      { type: 'dom-exists', selector: 'label', checks: [{ property: 'textContent', contains: 'Email' }] },
    ],
    mode: 'preview',
    order: 6,
  },
  {
    id: 'css-1',
    chapterId: 'css-intro',
    title: 'Couleurs CSS',
    description: 'Fond violet (#6C5CE7) pour toute la page, texte du titre en blanc.',
    explanation:
      'Le sélecteur `body` cible toute la page. `background-color` colore le fond, `color` la couleur du texte. Le CSS vit dans l\'onglet CSS et s\'applique au HTML de l\'onglet HTML.',
    difficulty: 1,
    xpReward: 35,
    hints: [
      'body représente l\'ensemble de la page.',
      'Deux propriétés distinctes : une pour le fond, une pour le texte.',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      {
        type: 'css-source',
        checks: [{ matches: 'background(-color)?\\s*:\\s*(#6[Cc]5[Cc][Ee]7|rgb\\s*\\(\\s*108\\s*,\\s*92\\s*,\\s*231)' }],
      },
      {
        type: 'css-source',
        checks: [{ matches: 'h1\\s*\\{[^}]*color\\s*:\\s*(white|#fff(ff)?|rgb\\s*\\(\\s*255\\s*,\\s*255\\s*,\\s*255)' }],
      },
    ],
    mode: 'preview',
    order: 7,
  },
  {
    id: 'css-2',
    chapterId: 'css-intro',
    title: 'Taille et centrage des textes',
    description: 'Le titre doit faire 2rem et être centré horizontalement.',
    explanation:
      '`font-size: 2rem` définit la taille du texte en rem (relatif à la taille de base du document). `text-align: center` centre le contenu horizontalement dans son conteneur.',
    difficulty: 2,
    xpReward: 35,
    hints: [
      'Une propriété contrôle la taille des caractères.',
      'Une autre propriété gère l\'alignement horizontal du texte.',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      {
        type: 'css-source',
        checks: [{ matches: 'h1\\s*\\{[^}]*font-size\\s*:\\s*2rem' }],
      },
      {
        type: 'css-source',
        checks: [{ matches: 'h1\\s*\\{[^}]*text-align\\s*:\\s*center' }],
      },
    ],
    mode: 'preview',
    order: 8,
  },
  {
    id: 'css-3',
    chapterId: 'css-intro',
    title: 'Carte stylée',
    description: 'Créez une div avec la classe (.card) et lui appliquer : fond blanc, coins arrondis (12px), padding 20px et une ombre portée.',
    explanation:
      'L\'attribut `class="card"` permet de cibler un élément en CSS avec `.card`. border-radius arrondit les coins, padding espace le contenu intérieur, box-shadow ajoute une ombre. Pour l\'ombre portée, utilisez : `box-shadow: 0px 5px 5px black;`',
    difficulty: 2,
    xpReward: 40,
    hints: [
      'Ajoutez class="card" sur une div dans le HTML.',
      'border-radius, padding et box-shadow sont des propriétés CSS utiles ici.',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      { type: 'dom-exists', selector: '.card', checks: [] },
      { type: 'css-source', checks: [{ matches: '\\.card\\s*\\{[^}]*box-shadow\\s*:' }] },
      { type: 'css-property', selector: '.card', checks: [
        { property: 'background-color', contains: '255,255,255' },
        { property: 'border-radius', contains: '12px' },
        { property: 'padding', contains: '20px' },
        { property: 'box-shadow', matches: '^(?!none$).+' },
      ]},
    ],
    mode: 'preview',
    order: 9,
  },
  {
    id: 'css-4',
    chapterId: 'css-layout',
    title: 'Centrer un élément',
    description: 'Créez une `<div class="container">` qui englobe un carré violet (100×100px), puis centrez-le au milieu de l\'écran avec flexbox.',
    explanation:
      'Structure HTML : `<div class="container"><div class="square"></div></div>`. La classe `container` sert de parent flex — c\'est ce nom que le validateur attend. En CSS, `.container` reçoit `display: flex`, `justify-content: center` (centrage horizontal), `align-items: center` (centrage vertical) et `min-height: 100px`. Le carré `.square` : `width: 100px`, `height: 100px`, `background-color: #6C5CE7`.',
    difficulty: 3,
    xpReward: 45,
    hints: [
      'Ajoutez une div parente avec `class="container"` autour de votre carré.',
      'display: flex sur `.container` permet de centrer son enfant.',
      'min-height: 100px sur `.container` définit une zone assez haute pour voir le centrage.',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      { type: 'dom-exists', selector: '.container', checks: [] },
      { type: 'dom-exists', selector: '.square', checks: [] },
      { type: 'css-source', checks: [{ matches: '\\.container\\s*\\{[^}]*display\\s*:\\s*flex' }] },
      { type: 'css-property', selector: '.container', checks: [
        { property: 'display', equals: 'flex' },
        { property: 'justify-content', equals: 'center' },
        { property: 'align-items', equals: 'center' },
        { property: 'min-height', contains: '100px' },
      ]},
      { type: 'css-property', selector: '.square', checks: [
        { property: 'width', contains: '100px' },
        { property: 'height', contains: '100px' },
        { property: 'background-color', contains: '108,92,231' },
      ]},
    ],
    mode: 'preview',
    order: 10,
  },
  {
    id: 'css-5',
    chapterId: 'css-layout',
    title: 'Navigation horizontale',
    description: 'Ajoutez une barre de navigation avec au moins 3 liens, alignés horizontalement.',
    explanation:
      '`<nav>` est la balise sémantique pour une zone de navigation. Combinée à `display: flex` et `gap`, les liens `<a>` s\'alignent côte à côte avec un espacement régulier.',
    difficulty: 2,
    xpReward: 40,
    hints: [
      'nav est la balise dédiée à la navigation.',
      'flex + gap aligne les liens horizontalement avec de l\'espace entre eux.',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      { type: 'html-well-formed', checks: [] },
      { type: 'dom-exists', selector: 'nav', checks: [] },
      { type: 'dom-exists', selector: 'nav a', checks: [], minCount: 3 },
      {
        type: 'css-source',
        checks: [{ matches: 'nav\\s*\\{[^}]*display\\s*:\\s*flex' }],
      },
    ],
    mode: 'preview',
    order: 11,
  },
  {
    id: 'css-6',
    chapterId: 'css-layout',
    title: 'Grille de cartes',
    description: 'Affichez 2 cartes côte à côte en grille (2 colonnes égales, espacement 16px).',
    explanation:
      '`display: grid` crée une grille CSS. `grid-template-columns: 1fr 1fr` divise l\'espace en 2 colonnes égales (fr = fraction). `gap` espace les cellules.',
    difficulty: 3,
    xpReward: 45,
    hints: [
      'Un conteneur .grid entoure les cartes.',
      'grid-template-columns définit le nombre et la taille des colonnes.',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      { type: 'css-property', selector: '.grid', checks: [{ property: 'display', equals: 'grid' }] },
    ],
    mode: 'preview',
    order: 12,
  },
  {
    id: 'js-1',
    chapterId: 'js-basics',
    title: 'Sortie console',
    description: 'Faites afficher « Hello JS! » dans la console.',
    explanation:
      '`console.log()` envoie un message dans la console du navigateur — indispensable pour déboguer. Le code JavaScript s\'écrit dans l\'onglet JS et s\'exécute au chargement de la page.',
    difficulty: 1,
    xpReward: 35,
    hints: [
      'JavaScript a une fonction pour écrire dans la console.',
      'Cherchez console.??? avec le message entre parenthèses.',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      { type: 'js-output', selector: undefined, checks: [{ contains: 'Hello JS!' }] },
    ],
    mode: 'console',
    order: 13,
  },
  {
    id: 'js-2',
    chapterId: 'js-basics',
    title: 'Modifier le contenu',
    description: 'Créez un paragraphe id="msg", puis faites-le afficher « JavaScript actif! » via JavaScript.',
    explanation:
      'Le DOM est la représentation JavaScript de la page. `document.getElementById("msg")` sélectionne un élément par son id. `.textContent` permet de lire ou modifier son texte.',
    difficulty: 2,
    xpReward: 45,
    hints: [
      'Sélectionnez l\'élément par son attribut id.',
      'Une propriété permet de changer le texte affiché.',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      { type: 'dom-exists', selector: '#msg', checks: [{ property: 'textContent', contains: 'JavaScript actif!' }] },
    ],
    mode: 'preview',
    order: 14,
  },
  {
    id: 'app-1',
    chapterId: 'first-app',
    title: 'Première application',
    description: 'Composez une mini-app (titre « Mon App » + bouton stylé + fond dégradé). Elle s\'ouvrira dans le simulateur de bureau.',
    explanation:
      'En combinant HTML (structure), CSS (apparence) et éventuellement JS (interactivité), on crée une application web complète. Le simulateur de bureau l\'affiche comme une vraie app dans une fenêtre.',
    difficulty: 3,
    xpReward: 100,
    hints: [
      'Structure : un conteneur, un titre h1, un button.',
      'Un dégradé CSS utilise linear-gradient sur le fond.',
    ],
    hintCost: 5,
    starterCode: { html: '', css: '', js: '' },
    validation: [
      { type: 'dom-exists', selector: 'h1', checks: [{ property: 'textContent', contains: 'Mon App' }] },
      { type: 'dom-exists', selector: 'button', checks: [] },
    ],
    mode: 'desktop',
    order: 15,
  },
]
