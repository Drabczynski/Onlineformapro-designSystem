# OnlineManager — règles pour générer une page

Ce dépôt est le design system d'OnlineManager. Tu génères des pages HTML qui
l'utilisent. Tu ne modifies jamais le système lui-même : ni `index.html`, ni `dist/`.

## Ce que tu utilises

| Fichier | Rôle |
|---|---|
| `dist/components.css` | Tout le CSS. Tu l'importes, tu ne le recopies pas, tu ne le surcharges pas. |
| `dist/components.js` | Le comportement des composants (dropdowns, tableaux, menus). À charger avec `defer`. |
| `catalog.json` | La liste fermée des composants, de leurs classes et de leurs modificateurs. Ce qui n'y est pas n'existe pas. |
| `templates/*.html` | Trois pages complètes. Tu pars toujours de l'une d'elles. |
| `check.js` | Le vérificateur. Une page n'est terminée que quand `node check.js page.html` ne renvoie aucune erreur. |

## Méthode

1. Choisir le template le plus proche : `liste.html` (un tableau), `reglages.html` (un formulaire), `dashboard.html` (des widgets).
2. Le copier, garder le squelette intact : `<body class="app">`, `.topbar`, `.layout`, `.sidebar`, `.main > .content`.
3. Ne modifier que le contenu de `.content`, l'entrée active du menu (`.ni.act`) et le fil d'Ariane.
4. Composer uniquement avec les extraits de `catalog.json`.
5. Lancer `node check.js page.html` et corriger jusqu'à zéro erreur.

## Interdits

- Aucune couleur écrite en dur (`#…`, `rgb(…)`, noms de couleur). Les seules couleurs sont `var(--…)`, et uniquement dans les cas prévus par les composants.
- Aucun attribut `style=""` sauf : la hauteur d'une `.empty-bar`, le `background` d'une `.w-ico` et la couleur d'un `.ava`, qui sont des valeurs de données.
- Aucune balise `<style>` dans la page. Aucune classe inventée. Aucun `!important`.
- Aucun `<select>` natif : le sélecteur du système est `.w-dd-wrap`.
- Aucune icône sans `aria-label` sur le bouton qui la porte quand elle est seule.
- Aucun `opacity` pour simuler un état désactivé : l'attribut `disabled`.
- Aucun bouton bleu, vert ou rose. La couleur d'action est le violet ; le rouge `--nav-act` n'existe que dans le menu gauche.
- Une seule action `.btn.primary` par écran.
- Un formulaire n'est jamais un bloc sur toute la largeur : deux colonnes de `.fs-block` dans `.form-body`.

## Intention → classe

| Tu veux | Tu écris |
|---|---|
| L'action principale de l'écran | `<button class="btn primary">` — une seule |
| Une action importante, non engageante | `<button class="btn secondary">` |
| Annuler, fermer, exporter, filtrer | `<button class="btn">` |
| Une action en texte seul | `<button class="btn tertiary">` |
| Une action destructive | `<button class="btn critical">` pour proposer, `<button class="btn primary critical">` pour confirmer |
| Un bouton qui n'a qu'une icône | `<button class="btn tertiary neutral icon-only" aria-label="…">` |
| Un bouton pendant un envoi | ajouter `is-loading`, envelopper le libellé dans `<span>` |
| Un champ texte | `.form-field > label + input.form-input` |
| Un champ obligatoire | `<span class="req">*</span>` collé au label |
| Un champ en lecture seule | `input.form-input.ro` + attribut `readonly` |
| Une liste de choix | `.w-dd-wrap.block > .w-dd-btn.field + .w-dd-menu > .w-dd-item` |
| Deux champs côte à côte | `.form-grid` ; un seul : `.form-grid.col-full` ; trois : `.form-grid.cols-3` |
| Un groupe de champs | `.fs-block > .fs-header (.fs-icon + .fs-title) + .fs-card` |
| Une page de réglages | `.form-body > .col + .col`, chaque `.col` contient des `.fs-block` |
| Un tableau | `.tcard > .tw > table` avec `tr.thr` (libellés) puis `tr.thr-filter` (filtres), puis `.tfoot` |
| Un filtre de colonne | `input.th-search` ou `.w-dd-wrap.block > .w-dd-btn.sm` |
| Les actions d'une ligne | dernière cellule `td.catd > button.rdots + .rmenu > .rmi` |
| Un statut dans une cellule | `<span class="stb ston"><span class="stdon"></span>Actif</span>` |
| Un widget de statistiques | `.w > .w-head + .w-body`, dans une `.wgrid` |
| Un en-tête de page | `.ph > .ph-l (h1.ph-title + .ph-ct) + .ph-actions` |
| Une icône | `<i data-eva="nom-outline">` — noms Eva Icons, variante outline uniquement |

## Squelette de page (ne pas modifier)

```html
<body class="app">
  <header class="topbar">…</header>
  <div class="layout">
    <aside class="sidebar">…</aside>
    <main class="main">
      <div class="content">
        <!-- fil d'Ariane, .ph, puis le contenu -->
      </div>
    </main>
  </div>
  <script src="../dist/components.js" defer></script>
</body>
```

## Avant de livrer

- `node check.js page.html` → 0 erreur.
- Un seul `.btn.primary`.
- Chaque `icon-only` a un `aria-label` qui nomme l'objet : « Supprimer la formation », pas « Supprimer ».
- Les libellés de bouton sont des verbes à l'infinitif, 1 à 3 mots.
- Le menu gauche a exactement une entrée `.ni.act`, celle de la page.
