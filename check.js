#!/usr/bin/env node
/*
 * check.js — vérifie qu'une page générée respecte le design system.
 *
 * Usage : node check.js page.html [autre.html …]
 *         node check.js templates/*.html
 * Code de sortie 1 s'il y a au moins une erreur.
 *
 * Aucune dépendance : les classes connues sont lues dans dist/components.css,
 * les règles d'usage dans CLAUDE.md. Le script est volontairement strict :
 * une page qui passe ici est une page qu'un relecteur n'a pas à corriger.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const css = fs.readFileSync(path.join(ROOT, 'dist', 'components.css'), 'utf8');

// ---- classes connues : toutes celles qui apparaissent dans les sélecteurs du CSS
const known = new Set();
for (const m of css.matchAll(/\.([a-zA-Z_][\w-]*)/g)) known.add(m[1]);
// classes JS-only ou d'état sans règle CSS propre
['open', 'oo', 'on', 'act', 'active', 'pin', 'dg', 'lk', 'col', 'full', 'tail', 'eva', 'chev', 'ph', 'srt', 'rz', 'dn', 'hidden', 'cmp', 'is-loading', 'is-disabled',
  'req'] // .req n'a pas de règle CSS : il hérite du label, comme dans l'application
  .forEach(c => known.add(c));

// ---- attributs style= tolérés : valeurs de données, pas de mise en forme
const STYLE_OK = [
  /^\s*height:\s*\d+px;?\s*$/,                                 // .empty-bar
  /^\s*background:\s*(#[0-9a-fA-F]{6}|var\(--[\w-]+\));?\s*$/, // .w-ico / .app-ic
  /^\s*background:\s*#[0-9a-fA-F]{6};\s*color:\s*#[0-9a-fA-F]{6};?\s*$/, // .ava
  /^\s*width:\s*12px;\s*height:\s*12px;?\s*$/,                 // svg dans .fs-icon
];

function check(file) {
  const html = fs.readFileSync(file, 'utf8');
  const errors = [];
  const warns = [];
  const line = (idx) => html.slice(0, idx).split('\n').length;

  // 1. Le squelette
  if (!/<body[^>]*class="[^"]*\bapp\b/.test(html)) errors.push(['squelette', 'body n\'a pas la classe .app (partir d\'un template)']);
  for (const need of ['topbar', 'layout', 'sidebar', 'main', 'content']) {
    if (!new RegExp(`class="[^"]*\\b${need}\\b`).test(html)) errors.push(['squelette', `.${need} absent`]);
  }
  if (!/dist\/components\.css/.test(html)) errors.push(['squelette', 'dist/components.css n\'est pas importé']);
  if (!/dist\/components\.js/.test(html)) warns.push(['squelette', 'dist/components.js n\'est pas chargé : dropdowns et tableaux seront inertes']);

  // 2. Pas de CSS dans la page
  for (const m of html.matchAll(/<style[\s>]/g)) errors.push(['css', `balise <style> ligne ${line(m.index)} — le CSS vient de dist/, rien dans la page`]);
  if (/!important/.test(html)) errors.push(['css', '!important interdit']);

  // 3. style="" : seulement des valeurs de données
  for (const m of html.matchAll(/style="([^"]*)"/g)) {
    const v = m[1];
    if (!STYLE_OK.some(re => re.test(v))) errors.push(['style', `style="${v}" ligne ${line(m.index)} — mise en forme en dur`]);
  }

  // 4. Couleurs en dur hors des exceptions ci-dessus
  const body = html.replace(/style="[^"]*"/g, '').replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<i data-eva[^>]*>/g, '');
  for (const m of body.matchAll(/#[0-9a-fA-F]{6}\b|rgba?\(/g)) {
    errors.push(['couleur', `couleur en dur "${m[0]}" ligne ${line(m.index)}`]);
  }

  // 5. Éléments interdits
  for (const m of html.matchAll(/<select[\s>]/g)) errors.push(['composant', `<select> natif ligne ${line(m.index)} — utiliser .w-dd-wrap`]);

  // 6. Classes inconnues
  for (const m of html.matchAll(/class="([^"]*)"/g)) {
    for (const c of m[1].split(/\s+/).filter(Boolean)) {
      if (!known.has(c)) errors.push(['classe', `classe inconnue "${c}" ligne ${line(m.index)}`]);
    }
  }

  // 7. Boutons
  const primaries = [...html.matchAll(/class="[^"]*\bbtn\b[^"]*\bprimary\b(?![^"]*\bcritical\b)[^"]*"/g)];
  if (primaries.length > 1) errors.push(['bouton', `${primaries.length} boutons .primary — un seul par écran`]);
  for (const m of html.matchAll(/<(button|a)\b([^>]*)>/g)) {
    const attrs = m[2];
    if (/\bicon-only\b/.test(attrs) && !/aria-label="[^"]+"/.test(attrs)) errors.push(['a11y', `bouton icon-only sans aria-label ligne ${line(m.index)}`]);
    if (/\bopacity\b/.test(attrs)) errors.push(['bouton', `opacity sur un bouton ligne ${line(m.index)} — utiliser disabled`]);
  }
  for (const m of html.matchAll(/class="[^"]*\bbtn\b[^"]*"/g)) {
    const cls = m[0];
    for (const bad of ['ghost', 'link', 'outline', 'soft', 'danger']) {
      if (new RegExp(`\\b${bad}\\b`).test(cls)) errors.push(['bouton', `.${bad} n'existe pas ligne ${line(m.index)} — voir CLAUDE.md`]);
    }
  }

  // 8. Menu gauche : une entrée active
  const acts = (html.match(/class="ni(-sub)? act"/g) || []).length;
  if (acts !== 1) warns.push(['menu', `${acts} entrée(s) active(s) dans le menu (.ni.act ou .ni-sub.act) — il en faut exactement une`]);

  // 9. Formulaires : pas de .fs-block hors d'une colonne
  if (/class="fs-block"/.test(html) && !/class="form-body"/.test(html)) warns.push(['formulaire', '.fs-block sans .form-body — les sections vont sur deux colonnes']);

  // 10. Icônes
  for (const m of html.matchAll(/data-eva="([^"]+)"/g)) {
    if (!/-outline$/.test(m[1])) errors.push(['icône', `"${m[1]}" ligne ${line(m.index)} — variante outline uniquement`]);
  }

  return { errors, warns };
}

const files = process.argv.slice(2);
if (!files.length) { console.error('usage : node check.js page.html'); process.exit(2); }

let total = 0;
for (const f of files) {
  const { errors, warns } = check(f);
  total += errors.length;
  console.log(`\n${f}`);
  if (!errors.length && !warns.length) { console.log('  ✓ conforme'); continue; }
  for (const [k, msg] of errors) console.log(`  ✗ ${k.padEnd(10)} ${msg}`);
  for (const [k, msg] of warns) console.log(`  ! ${k.padEnd(10)} ${msg}`);
}
console.log(`\n${total} erreur${total > 1 ? 's' : ''}`);
process.exit(total ? 1 : 0);
