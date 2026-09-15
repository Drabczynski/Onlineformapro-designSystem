# OnlineManager — design system

Un seul fichier de référence, `index.html`, et ce qu'il faut pour qu'une équipe — ou une IA — construise des pages qui lui restent fidèles.

## Contenu du dépôt

| Fichier | Usage |
|---|---|
| `index.html` | La documentation vivante. Ouvrir dans un navigateur. **Source unique** : tout le reste en dérive. |
| `dist/tokens.css` | Les variables (`--a`, `--t1`, `--bd`…). Généré. |
| `dist/components.css` | Tout le CSS des composants. Généré. À importer, jamais à recopier. |
| `dist/components.js` | Le comportement des composants. Généré. À charger avec `defer`. |
| `templates/liste.html` | Page type : un tableau avec filtres, actions de ligne et pagination. |
| `templates/reglages.html` | Page type : un formulaire de réglages sur deux colonnes. |
| `templates/dashboard.html` | Page type : une grille de widgets de statistiques. |
| `catalog.json` | La liste fermée des composants, classes et modificateurs, avec un extrait canonique par composant. |
| `CLAUDE.md` / `AGENTS.md` | Les règles qu'un assistant lit avant de générer une page. |
| `check.js` | Le vérificateur d'une page générée. |
| `build.js` | Régénère `dist/` depuis `index.html`. |

## Faire une page

1. Copier le template le plus proche depuis `templates/`.
2. Ne toucher qu'au contenu de `.content`, à l'entrée active du menu et au fil d'Ariane.
3. Composer avec les extraits de `catalog.json`.
4. Vérifier : `node check.js ma-page.html` → `0 erreur`.

Les chemins des templates supposent que la page vit dans un sous-dossier du dépôt (`../dist/…`). Ailleurs, adapter les deux chemins d'import.

## Avec une IA

Le fichier `CLAUDE.md` est lu automatiquement par Claude Code ; `AGENTS.md`, identique, par les autres outils. Un prompt qui fonctionne :

> Génère la page « Certifications » en partant de `templates/liste.html`. Utilise uniquement les classes de `catalog.json`. Lance `node check.js certifications.html` et corrige jusqu'à zéro erreur.

Ce que le vérificateur bloque : couleur ou mise en forme en dur, `<style>` dans la page, classe inconnue, `<select>` natif, icône seule sans `aria-label`, plus d'un `.primary`, variantes de bouton qui n'existent pas.

## Modifier le système

Toute modification se fait dans `index.html`, puis :

```
node build.js          # régénère dist/
node check.js templates/*.html
```

`node build.js --check` échoue si `dist/` n'est pas à jour — à mettre en CI.

## Icônes

[Eva Icons](https://akveo.github.io/eva-icons/), variante *outline*. Dans une page : `<i data-eva="trash-2-outline"></i>` puis `eva.replace()`, ou le SVG exporté depuis le site.
