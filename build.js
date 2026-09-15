#!/usr/bin/env node
/*
 * build.js — dérive dist/ depuis index.html.
 *
 * index.html reste la source unique. Ce script en extrait :
 *   dist/components.css  les variables :root et le CSS des composants, sans les styles propres à la doc
 *   dist/components.js   le JS des composants (entre @components:start / @components:end)
 *
 * Usage : node build.js        (à relancer après chaque modification d'index.html)
 *         node build.js --check  échoue si dist/ n'est pas à jour (pour la CI)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'index.html');
const DIST = path.join(ROOT, 'dist');

const html = fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');

function between(text, start, end, label) {
  const i = text.indexOf(start);
  const j = text.indexOf(end, i + start.length);
  if (i < 0 || j < 0) throw new Error(`Marqueur introuvable : ${label}`);
  return text.slice(i + start.length, j);
}

// ---------------------------------------------------------------- CSS
const style = between(html, '<style>', '</style>', '<style>');

// Découpe en blocs de premier niveau (gère @keyframes et ses accolades imbriquées).
function splitCss(css) {
  const blocks = [];
  let depth = 0, start = 0, i = 0;
  while (i < css.length) {
    const ch = css[i];
    if (ch === '/' && css[i + 1] === '*') { i = css.indexOf('*/', i + 2) + 2; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) { blocks.push(css.slice(start, i + 1)); start = i + 1; }
    } else if (ch === '(' && depth === 0) { // url(...) : ne pas couper sur un ';' interne
      i = css.indexOf(')', i + 1); continue;
    } else if (ch === ';' && depth === 0) { // @import ...;
      blocks.push(css.slice(start, i + 1)); start = i + 1;
    }
    i++;
  }
  // retire les commentaires-marqueurs du build
  return blocks.map(b => b.replace(/\/\*\s*@\w+:(start|end)[^*]*\*\/\s*/g, '').trim()).filter(Boolean);
}

// Sélecteurs qui n'existent que pour la page de documentation.
const DOC_ONLY = [
  /^\.ds-/, /^\.section-/, /^section\b/, /^\.swatch/, /^\.typo-/, /^\.preview-/,
  /^\.code-box/, /^\.sizing-table/, /^\.btn-demo/, /^\.btn-spec/, /^\.spec-label/,
  /^\.do-dont/, /^\.dd-card/, /^\.axis-/, /^\.tone-matrix/, /^\.tm-/, /^\.nav-stage/,
  /^\.launcher/, /^\.lc-/, /^\.ico-/, /^\.icon-box/, /^\.rs-/, /^body\b/, /^body\./,
];
function isDocOnly(selector) {
  return selector.split(',').every(s => DOC_ONLY.some(re => re.test(s.trim())));
}

function selectorOf(block) {
  const i = block.indexOf('{');
  const head = (i < 0 ? block : block.slice(0, i)).replace(/\/\*[\s\S]*?\*\//g, '').trim();
  return head;
}

const blocks = splitCss(style);
const tokensCss = [];
const componentsCss = [];
for (const b of blocks) {
  const sel = selectorOf(b);
  if (!sel) continue;
  if (sel.startsWith('@import')) { tokensCss.push(b); continue; }
  if (sel === ':root') { tokensCss.push(b); continue; }
  if (sel.startsWith('@keyframes')) { componentsCss.push(b); continue; }
  if (isDocOnly(sel)) continue;
  componentsCss.push(b);
}

function dedent(block) {
  return block.split('\n').map(l => l.replace(/^ {4}/, '')).join('\n');
}

const HEADER = (what) => `/* OnlineManager — ${what}\n   Généré par build.js depuis index.html. Ne pas modifier à la main. */\n\n`;

const componentsOut = HEADER('composants') +
  tokensCss.map(dedent).join('\n\n') + '\n\n' +
  componentsCss.map(dedent).join('\n\n') + '\n';

// ---------------------------------------------------------------- JS
const script = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));
let js = between(script, '/* @components:start', '/* @components:end */', '@components');
js = js.slice(js.indexOf('*/') + 2); // retire la fin de la ligne de marqueur
js = js.split('\n').map(l => l.replace(/^ {4}/, '')).join('\n').trim();
const jsOut = `/* OnlineManager — composants (JS)\n   Généré par build.js depuis index.html. Ne pas modifier à la main.\n   Charger après le DOM : <script src="dist/components.js" defer></script> */\n\n${js}\n`;

// ---------------------------------------------------------------- écriture / vérification
const files = {
  'components.css': componentsOut,
  'components.js': jsOut,
};

if (process.argv.includes('--check')) {
  let stale = false;
  for (const [name, content] of Object.entries(files)) {
    const p = path.join(DIST, name);
    if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== content) { console.error(`dist/${name} n'est pas à jour`); stale = true; }
  }
  process.exit(stale ? 1 : 0);
}

fs.mkdirSync(DIST, { recursive: true });
for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(DIST, name), content);
  console.log(`dist/${name}  ${content.length} octets`);
}

// OMDS.md est le même fichier que CLAUDE.md, sous le nom distribué à l'équipe.
fs.copyFileSync(path.join(ROOT, 'CLAUDE.md'), path.join(ROOT, 'OMDS.md'));
console.log('OMDS.md  copie de CLAUDE.md');
