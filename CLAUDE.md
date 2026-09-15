# OnlineManager — règles pour générer une page

Ce dépôt est le design system d'OnlineManager. Tu génères des pages HTML qui
l'utilisent. Tu ne modifies jamais le système lui-même : ni `index.html`, ni `dist/`.

## Ce que tu utilises

| Fichier | Rôle |
|---|---|
| `dist/components.css` | Les variables et tout le CSS. Tu l'importes, tu ne le recopies pas, tu ne le surcharges pas. |
| `dist/components.js` | Le comportement des composants (dropdowns, tableaux, menus, plage de dates). À charger avec `defer`. |

La référence des composants est `index.html` : chaque section montre le rendu, les classes et un extrait.

## Méthode

1. Partir du squelette ci-dessous, tel quel.
2. Mettre `.act` sur l'entrée du menu qui correspond à la page (une seule), et `.open` sur son groupe si c'est une sous-entrée.
3. Écrire le contenu de la page dans `.content`, en commençant par un en-tête `.ph`.
4. Composer uniquement avec les classes documentées dans `index.html`.
5. Relire avec la liste « Avant de livrer ».

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

## Squelette de page

La topbar et le menu gauche sont ceux de l'application, à reprendre sans modification. Seule l'entrée active change.

```html
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apprenants — OnlineManager</title>
  <link rel="stylesheet" href="dist/components.css">
</head>

<body class="app">
  <header class="topbar">
  <div class="tb-slot">
  <span class="tb-appn">Online<b>Manager</b></span>
  <button class="tb-burger" aria-label="Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
  </div>
  <div class="tb-body">
  <span class="tb-store">Onlineformapro</span>
  <div class="tb-cw"><span class="tb-cl">Comptes :</span>
  <div class="w-dd-wrap">
  <button class="w-dd-btn tb" onclick="toggleDD(this)"><span class="dd-ph">Sélectionnez un compte</span><svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>
  <div class="w-dd-menu">
  <div class="w-dd-item">INFREP</div>
  <div class="w-dd-item">OCB Formation</div>
  <div class="w-dd-item">Cap Petite Enfance</div>
  </div>
  </div>
  </div>

  <div class="tb-ics">
  <button class="tbi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  <polyline points="9 22 9 12 15 12 15 22" />
  </svg></button>
  <button class="tbi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8" />
  <path d="m21 21-4.35-4.35" />
  </svg></button>
  <button class="tbi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
  stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10" />
  <line x1="2" y1="12" x2="22" y2="12" />
  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg></button>
  <div class="tbsep"></div>
  <div class="apps-wrap">
  <button class="tbi">
  <svg viewBox="0 0 24 24" fill="currentColor">
  <circle cx="5" cy="5" r="1.8" />
  <circle cx="12" cy="5" r="1.8" />
  <circle cx="19" cy="5" r="1.8" />
  <circle cx="5" cy="12" r="1.8" />
  <circle cx="12" cy="12" r="1.8" />
  <circle cx="19" cy="12" r="1.8" />
  <circle cx="5" cy="19" r="1.8" />
  <circle cx="12" cy="19" r="1.8" />
  <circle cx="19" cy="19" r="1.8" />
  </svg>
  </button>
  <div class="apps-drop">
  <div class="apps-hd">Applications</div>
  <div class="app-row">
  <div class="app-ic" style="background:#7C3AED"><svg viewBox="0 0 24 24">
  <path
  d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
  </svg></div>
  <div>
  <div class="app-nm">OnlineAuteur</div>
  <div class="app-sub">Création de contenus</div>
  </div>
  </div>
  <div class="app-row">
  <div class="app-ic" style="background:#059669"><svg viewBox="0 0 24 24">
  <path
  d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5zm15 8a2 2 0 012 2v4a2 2 0 01-2 2h-2l-3 3v-3H9a2 2 0 01-2-2v-1h1a3 3 0 003-3V9h8a2 2 0 012 2z" />
  </svg></div>
  <div>
  <div class="app-nm">OnlineAgora</div>
  <div class="app-sub">Espace collaboratif</div>
  </div>
  </div>
  </div>
  </div>
  <button class="tbi red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
  <polyline points="16 17 21 12 16 7" />
  <line x1="21" y1="12" x2="9" y2="12" />
  </svg></button>
  <div class="tb-av">AL</div>
  </div>
  </div>
  </header>
  <div class="layout">
    <aside class="sidebar">
    <div class="sb-toggle">
    <div class="sbt-btn on">
    Gestion</div>
    <div class="sbt-btn">
    Reporting</div>
    </div>
    <nav class="nav">
    <div class="ni-group">
    <div class="ni">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
    stroke-linejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.07 4.93a10 10 0 010 14.14M4.93 19.07a10 10 0 010-14.14M12 2v2M12 20v2M2 12h2M20 12h2" />
    </svg>
    Administration
    <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
    </div>
    <div class="sub-nav">
    <div class="ni-sub">Gérer le menu usager</div>
    <div class="ni-sub">Mon compte</div>
    <div class="ni-sub">Carte de visite</div>
    </div>
    </div>
    <div class="ni">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
    stroke-linejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
    Gestionnaires
    </div>
    <div class="ni act"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    </svg>Apprenants</div>
    <div class="ni"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>Évaluations</div>
    <div class="ni"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>Certifications</div>
    <div class="ni"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>Parcours</div>
    <div class="ni"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>Enquêtes</div>
    <div class="ni"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>Visio</div>
    </nav>
    </aside>
    <main class="main">
      <div class="content">
        <div class="ph">
          <div class="ph-l">
            <h1 class="ph-title">Apprenants</h1>
            <span class="ph-ct">128</span>
          </div>
          <div class="ph-actions">
            <button class="btn">Exporter</button>
            <button class="btn primary">Ajouter un apprenant</button>
          </div>
        </div>
        <!-- contenu -->
      </div>
    </main>
  </div>
  <script src="dist/components.js" defer></script>
</body>

</html>
```

## Avant de livrer

- Aucune couleur ni `style=""` de mise en forme, aucune balise `<style>`, aucune classe absente de `index.html`.
- Un seul `.btn.primary`.
- Chaque `icon-only` a un `aria-label` qui nomme l'objet : « Supprimer la formation », pas « Supprimer ».
- Les libellés de bouton sont des verbes à l'infinitif, 1 à 3 mots.
- Le menu gauche a exactement une entrée `.ni.act` ou `.ni-sub.act`, celle de la page.
