/* OnlineManager — composants (JS)
   Version 1.0.0 — sortie le 2026-09-15
   Généré par build.js depuis index.html. Ne pas modifier à la main.
   Charger après le DOM : <script src="components.js" defer></script> */

// ---- Dropdown ----
function toggleDD(btn) {
  const wrap = btn.closest('.w-dd-wrap');
  const isOpen = wrap.classList.contains('open');

  // Close all others
  document.querySelectorAll('.w-dd-wrap').forEach(w => w.classList.remove('open'));

  // Toggle current
  if (!isOpen) wrap.classList.add('open');
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.w-dd-wrap')) {
    document.querySelectorAll('.w-dd-wrap').forEach(w => w.classList.remove('open'));
  }
});

// Form card checkboxes
function toggleCard(input) {
  const name = input.getAttribute('name');
  const cards = document.querySelectorAll(`input[name="${name}"]`);
  cards.forEach(c => {
    c.parentElement.classList.toggle('active', c.checked);
  });
}

// Segmented control
function segPick(btn) {
  btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}


// ---- Tableaux : redimensionnement de colonne ----
// Pointer Events + capture : le pointerup arrive meme si le bouton est
// relache hors de la fenetre, donc l'etat ne reste jamais bloque.
(function () {
  let drag = null;

  function endDrag() {
    if (!drag) return;
    drag.handle.classList.remove('rz');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    drag = null;
  }

  document.addEventListener('pointerdown', (e) => {
    const handle = e.target.closest('.rez');
    if (!handle || e.button !== 0) return;
    const th = handle.parentElement;
    drag = { th, handle, x: e.clientX, w: th.getBoundingClientRect().width };
    handle.classList.add('rz');
    handle.setPointerCapture(e.pointerId);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const w = Math.max(70, drag.w + e.clientX - drag.x);
    drag.th.style.width = w + 'px';
    drag.th.style.minWidth = w + 'px';
  });

  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);
  window.addEventListener('blur', endDrag);
})();

// ---- Tableaux : menu d'actions de ligne ----
function togRow(btn) {
  const cell = btn.closest('.catd, .rmenu-wrap');
  if (!cell) return;
  const menu = cell.querySelector('.rmenu');
  const open = menu.classList.contains('oo');
  closeRowMenus();
  if (!open) { menu.classList.add('oo'); cell.classList.add('oo'); }
}

// Une branche d'arborescence : replier une ligne cache tout ce qui est
// plus profond qu'elle, jusqu'a la prochaine ligne de meme niveau ou
// moins. Replier un usager emporte donc ses categories et leurs contenus.
function arboPlie(btn) {
  const ligne = btn.closest('.arb');
  if (!ligne) return;
  const plie = ligne.classList.toggle('plie');
  btn.setAttribute('aria-expanded', plie ? 'false' : 'true');
  const niv = [...ligne.classList].find(c => /^n\d$/.test(c));
  if (!niv) return;
  const mien = +niv.slice(1);
  let n = ligne.nextElementSibling;
  while (n && n.classList.contains('arb')) {
    const s = [...n.classList].find(c => /^n\d$/.test(c));
    if (!s || +s.slice(1) <= mien) break;
    n.classList.toggle('masque', plie);
    // Une branche repliee le reste : on ne la rouvre pas en rouvrant
    // son parent.
    if (!plie && n.classList.contains('plie')) {
      let p = n.nextElementSibling;
      const sien = +s.slice(1);
      while (p && p.classList.contains('arb')) {
        const q = [...p.classList].find(c => /^n\d$/.test(c));
        if (!q || +q.slice(1) <= sien) break;
        p.classList.add('masque');
        p = p.nextElementSibling;
      }
      n = p;
      continue;
    }
    n = n.nextElementSibling;
  }
}

// Une grille groupee : replier un groupe cache ses lignes, le chevron
// pivote, et le bouton dit lui-meme dans quel etat il est.
function grilleReplie(btn) {
  const ligne = btn.closest('tr');
  if (!ligne) return;
  const plie = ligne.classList.toggle('plie');
  btn.setAttribute('aria-expanded', plie ? 'false' : 'true');
  const cle = ligne.dataset.grp;
  ligne.closest('table').querySelectorAll('tr.sub[data-grp="' + cle + '"]')
    .forEach(r => r.classList.toggle('plie', plie));
}

// Replier un chapitre : la liste disparait, le chevron pivote, et le
// bouton dit lui-meme dans quel etat il est.
function chapPlie(btn) {
  const chap = btn.closest('.chap');
  if (!chap) return;
  const plie = chap.classList.toggle('plie');
  btn.setAttribute('aria-expanded', plie ? 'false' : 'true');
}

function closeRowMenus() {
  document.querySelectorAll('.rmenu.oo').forEach(m => m.classList.remove('oo'));
  document.querySelectorAll('.catd.oo, .rmenu-wrap.oo').forEach(c => c.classList.remove('oo'));
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.catd')) closeRowMenus();
});

// ---- Tableaux : panneau de colonnes ----
function togCols(btn) {
  const panel = btn.parentElement.querySelector('.cpanel');
  if (panel.classList.contains('pin')) return;
  const open = panel.classList.contains('oo');
  closePanels();
  if (!open) {
    panel.classList.add('oo');
    btn.classList.add('on');
  }
}

function closePanels() {
  document.querySelectorAll('.cpanel:not(.pin)').forEach(p => p.classList.remove('oo'));
  document.querySelectorAll('.cpanel:not(.pin)').forEach(p => {
    const g = p.parentElement.querySelector('.cgear');
    if (g) g.classList.remove('on');
  });
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.cgear-th, .cgear-wrap')) closePanels();
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  closePanels();
  closeRowMenus();
  document.querySelectorAll('.drp.open').forEach(x => x.classList.remove('open'));
  document.querySelectorAll('.dp.open').forEach(x => x.classList.remove('open'));
  document.querySelectorAll('.w-dd-wrap.open').forEach(w => w.classList.remove('open'));
  document.querySelectorAll('.modal-veil:not([hidden])').forEach(v => { v.hidden = true; });
});

// ---- Tableaux : afficher / masquer une colonne depuis le panneau ----
function colToggle(cb) {
  const table = cb.closest('.tcard').querySelector('table');
  const key = cb.dataset.col;
  if (!table || !key) return;
  // On ne vise que les cellules. Le panneau de colonnes vit dans un <th>,
  // donc ses cases portent le meme data-col : sans ce filtre, decocher une
  // colonne masquait la case elle-meme et on ne pouvait plus la recocher.
  table.querySelectorAll('th[data-col="' + key + '"], td[data-col="' + key + '"]')
    .forEach(cell => { cell.hidden = !cb.checked; });
}

function colReset(btn) {
  const panel = btn.closest('.cpanel');
  const list = panel.querySelector('.cplist');
  const rows = [...list.querySelectorAll('.crow')];
  const order = rows.slice().sort((a, b) => a.dataset.i - b.dataset.i);
  order.forEach(r => list.appendChild(r));
  rows.forEach(r => {
    const cb = r.querySelector('.cck');
    cb.checked = cb.dataset.def === '1';
    colToggle(cb);
  });
  const evt = new Event('reorder');
  panel.dispatchEvent(evt);
}

// memoriser l'ordre et l'etat par defaut de chaque panneau
document.querySelectorAll('.cpanel').forEach(p => {
  p.querySelectorAll('.crow').forEach((r, i) => {
    r.dataset.i = i;
    const cb = r.querySelector('.cck');
    if (cb) cb.dataset.def = cb.checked ? '1' : '0';
  });
});

// ---- Tableaux : reordonner les colonnes par glisser-deposer (poignee) ----
// Pointer Events + capture, pas de drag HTML5 : Chrome perd le dragend
// quand l'element source bouge pendant le drag, et la session reste ouverte.
(function () {
  let d = null;

  function applyOrder(panel) {
    const card = panel.closest('.tcard');
    const table = card && card.querySelector('table');
    if (!table) return;
    const keys = [...panel.querySelectorAll('.crow')].map(r => r.querySelector('.cck').dataset.col).filter(Boolean);
    if (!keys.length) return;
    table.querySelectorAll('tr').forEach(tr => {
      const byKey = {};
      [...tr.children].forEach(c => { if (c.dataset.col) byKey[c.dataset.col] = c; });
      keys.forEach(k => { if (byKey[k]) tr.appendChild(byKey[k]); });
      // La cellule d'actions termine toujours la ligne : .cgear-th en en-tete,
  // .catd dans le corps. Sans cela le reordonnancement la laisse en tete.
  const tail = tr.querySelector('.cgear-th, .catd, .tail');
      if (tail) tr.appendChild(tail);
    });
  }

  function end() {
    if (!d) return;
    d.row.classList.remove('dg');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    applyOrder(d.row.closest('.cpanel'));
    d = null;
  }

  document.addEventListener('pointerdown', (e) => {
    const handle = e.target.closest('.crow:not(.lk) .cdg');
    if (!handle || e.button !== 0) return;
    const row = handle.closest('.crow');
    d = { row, list: row.parentElement };
    row.classList.add('dg');
    handle.setPointerCapture(e.pointerId);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('pointermove', (e) => {
    if (!d) return;
    const rows = [...d.list.querySelectorAll('.crow:not(.lk)')].filter(r => r !== d.row);
    for (const r of rows) {
      const box = r.getBoundingClientRect();
      if (e.clientY < box.top + box.height / 2) {
        if (r.previousElementSibling !== d.row) d.list.insertBefore(d.row, r);
        return;
      }
    }
    const last = rows[rows.length - 1];
    if (last && last.nextElementSibling !== d.row) d.list.insertBefore(d.row, last.nextSibling);
  });

  document.addEventListener('pointerup', end);
  document.addEventListener('pointercancel', end);
  window.addEventListener('blur', end);

  document.querySelectorAll('.cpanel').forEach(p => p.addEventListener('reorder', () => applyOrder(p)));
})();

// ---- Plage de dates ----
const DRP_M = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const DRP_MF = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const drpFmt = d => DRP_M[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
const drpIso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const drpParse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };

function drpRender(pop) {
  const y = +pop.dataset.y, m = +pop.dataset.m;
  const start = pop.dataset.start ? drpParse(pop.dataset.start) : null;
  const end = pop.dataset.end ? drpParse(pop.dataset.end) : null;
  pop.querySelector('.ttl').textContent = DRP_MF[m] + ' ' + y;
  const grid = pop.querySelector('.drp-grid');
  grid.querySelectorAll('.drp-day').forEach(c => c.remove());
  const first = new Date(y, m, 1);
  const cur = new Date(y, m, 1 - ((first.getDay() + 6) % 7)); // semaine du lundi
  for (let i = 0; i < 42; i++) {
    const c = document.createElement('div');
    c.className = 'drp-day';
    c.textContent = cur.getDate();
    if (cur.getMonth() !== m) c.classList.add('muted');
    const t = cur.getTime();
    if (start && end && t > start.getTime() && t < end.getTime()) c.classList.add('in');
    if (start && t === start.getTime()) c.classList.add('start');
    if (end && t === end.getTime()) c.classList.add('end');
    c.dataset.d = drpIso(cur);
    c.onclick = () => drpPick(c);
    grid.appendChild(c);
    cur.setDate(cur.getDate() + 1);
  }
  const [i1, i2] = pop.querySelectorAll('.drp-head input');
  i1.value = start ? drpFmt(start) : '';
  i2.value = end ? drpFmt(end) : '';
}

function drpSuggestions(pop) {
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const d = (n) => { const x = new Date(t); x.setDate(x.getDate() + n); return x; };
  const mon = d(-((t.getDay() + 6) % 7));
  const y = t.getFullYear(), m = t.getMonth();
  const R = {
    today: [t, t],
    week: [mon, t],
    '7d': [d(-7), t],
    '30d': [d(-30), t],
    month: [new Date(y, m, 1), t],
    year: [new Date(y, 0, 1), t],
    lastmonth: [new Date(y, m - 1, 1), new Date(y, m, 0)],
    lastyear: [new Date(y - 1, 0, 1), new Date(y - 1, 11, 31)],
  };
  pop.querySelectorAll('.drp-sug-item').forEach(el => {
    const [a, b] = R[el.dataset.k];
    el.dataset.start = drpIso(a); el.dataset.end = drpIso(b);
    el.querySelector('span').textContent = a.getTime() === b.getTime() ? drpFmt(a) : drpFmt(a) + ' - ' + drpFmt(b);
  });
}

// Le panneau tient-il a droite du declencheur ? Sinon il s'aligne sur son
// bord droit. Mesure a l'ouverture : la place depend de la fenetre, pas du
// gabarit.
function popCadre(decl, pop) {
  pop.classList.remove('fin');
  const r = decl.getBoundingClientRect();
  if (r.left + pop.offsetWidth > document.documentElement.clientWidth - 8) {
    pop.classList.add('fin');
  }
}

function drpOpen(btn) {
  const w = btn.closest('.drp');
  const open = w.classList.contains('open');
  document.querySelectorAll('.drp.open').forEach(x => x.classList.remove('open'));
  if (!open) {
    w.classList.add('open');
    const pop = w.querySelector('.drp-pop');
    drpSuggestions(pop);
    drpRender(pop);
    popCadre(w, pop);
  }
}

function drpNav(btn, delta) {
  const pop = btn.closest('.drp-pop');
  let m = +pop.dataset.m + delta, y = +pop.dataset.y;
  if (m < 0) { m = 11; y--; } else if (m > 11) { m = 0; y++; }
  pop.dataset.m = m; pop.dataset.y = y;
  drpRender(pop);
}

function drpPick(cell) {
  const pop = cell.closest('.drp-pop');
  const d = cell.dataset.d;
  const s = pop.dataset.start, e = pop.dataset.end;
  if (!s || (s && e)) { pop.dataset.start = d; pop.dataset.end = ''; }
  else if (d < s) { pop.dataset.start = d; }
  else { pop.dataset.end = d; }
  drpRender(pop);
}

function drpSug(el) {
  const pop = el.closest('.drp-pop');
  pop.dataset.start = el.dataset.start; pop.dataset.end = el.dataset.end;
  const e = drpParse(el.dataset.end);
  pop.dataset.y = e.getFullYear(); pop.dataset.m = e.getMonth();
  drpRender(pop);
}

function drpApply(btn) {
  const w = btn.closest('.drp'), pop = w.querySelector('.drp-pop');
  if (pop.dataset.start && pop.dataset.end) {
    w.querySelector('.lbl').textContent = drpFmt(drpParse(pop.dataset.start));
    w.querySelector('.lbl2').textContent = drpFmt(drpParse(pop.dataset.end));
  }
  if (!pop.classList.contains('pin')) w.classList.remove('open');
}

function drpCancel(btn) {
  const w = btn.closest('.drp');
  if (!w.querySelector('.drp-pop').classList.contains('pin')) w.classList.remove('open');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.drp')) document.querySelectorAll('.drp.open').forEach(x => x.classList.remove('open'));
});

document.querySelectorAll('.drp-pop.pin').forEach(pop => { drpSuggestions(pop); drpRender(pop); });

// ---- Ranger les widgets ----
// Pas de glisser-deposer natif : son image de traine est une capture
// translucide sur laquelle on n'a pas la main, et les voisins sautent d'un
// coup a leur nouvelle place. Ici la carte suit le doigt et les voisins
// glissent.
// Ce qui se range, et ou. Un widget dans une colonne, une ligne de parcours
// dans sa liste : meme poignee, meme mecanique.
const RANGEABLE = '.w, .elt';
const ZONE = '.wcol, .elt-list';

let tirage = null;

// FLIP : on releve les positions, on reordonne, puis on rejoue l'ecart.
// C'est ce qui remplace le saut par un glissement.
function glisse(colonnes, action) {
  const avant = new Map();
  for (const col of colonnes) {
    for (const w of col.querySelectorAll(':scope > .w, :scope > .elt')) {
      avant.set(w, w.getBoundingClientRect());
    }
  }
  action();
  for (const [w, a] of avant) {
    const b = w.getBoundingClientRect();
    const dx = a.left - b.left, dy = a.top - b.top;
    if (!dx && !dy) continue;
    w.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
      { duration: 220, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' });
  }
}

function colonnesDe(el) {
  const zone = el.closest(ZONE);
  if (!zone) return [];
  // Une grille de widgets a plusieurs colonnes ; une liste d'elements n'en
  // a qu'une, et c'est elle-meme.
  const grille = zone.closest('.wgrid');
  return grille ? [...grille.querySelectorAll(':scope > .wcol')] : [zone];
}

function creuxAvant(col, y) {
  // Le widget devant lequel poser : le premier dont on a depasse le milieu
  // par le haut.
  let proche = null, ecart = -Infinity;
  for (const w of col.querySelectorAll(':scope > .w, :scope > .elt')) {
    const r = w.getBoundingClientRect();
    const d = y - r.top - r.height / 2;
    if (d < 0 && d > ecart) { ecart = d; proche = w; }
  }
  return proche;
}

function widgetPrend(e) {
  const poignee = e.target.closest ? e.target.closest('.w-grip') : null;
  if (!poignee || tirage || (e.button !== undefined && e.button !== 0)) return;
  const w = poignee.closest(RANGEABLE);
  if (!w) return;
  e.preventDefault();

  const r = w.getBoundingClientRect();
  const creux = document.createElement('div');
  creux.className = 'w-creux';
  creux.style.height = r.height + 'px';
  w.after(creux);

  w.classList.add('vole');
  w.style.width = r.width + 'px';
  w.style.height = r.height + 'px';
  w.style.left = r.left + 'px';
  w.style.top = r.top + 'px';
  document.body.appendChild(w);
  document.body.classList.add('range');

  tirage = {
    w, creux, poignee,
    colonnes: colonnesDe(creux),
    ox: e.clientX - r.left, oy: e.clientY - r.top,
    x0: r.left, y0: r.top,
  };
  bouge(e.clientX, e.clientY);
  try { poignee.setPointerCapture(e.pointerId); } catch (x) { /* pointeur deja relache */ }
}

function bouge(cx, cy) {
  const t = tirage;
  t.w.style.transform =
    `translate(${cx - t.ox - t.x0}px, ${cy - t.oy - t.y0}px) scale(1.02)`;
}

document.addEventListener('pointerdown', widgetPrend);

document.addEventListener('pointermove', (e) => {
  if (!tirage) return;
  bouge(e.clientX, e.clientY);
  const sous = document.elementFromPoint(e.clientX, e.clientY);
  const col = sous && sous.closest ? sous.closest(ZONE) : null;
  if (!col) return;
  const avant = creuxAvant(col, e.clientY);
  if (avant === tirage.creux.nextElementSibling && col === tirage.creux.parentElement) return;
  glisse(tirage.colonnes, () => {
    if (avant) col.insertBefore(tirage.creux, avant);
    else col.appendChild(tirage.creux);
  });
});

function widgetPose() {
  const t = tirage;
  if (!t) return;
  tirage = null;
  const depart = t.w.getBoundingClientRect();
  t.w.classList.remove('vole');
  t.w.removeAttribute('style');
  t.creux.replaceWith(t.w);
  document.body.classList.remove('range');

  const arrivee = t.w.getBoundingClientRect();
  const dx = depart.left - arrivee.left, dy = depart.top - arrivee.top;
  t.w.animate(
    [{ transform: `translate(${dx}px, ${dy}px) scale(1.02)`, boxShadow: '0 22px 48px rgba(17, 24, 39, 0.16)' },
     { transform: 'none', boxShadow: 'none' }],
    { duration: 200, easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)' });
}

document.addEventListener('pointerup', widgetPose);
document.addEventListener('pointercancel', widgetPose);

// Le glisser-deposer n'existe pas au clavier : les fleches font le meme
// travail depuis la poignee, qui est un bouton.
function widgetDeplace(poignee, dx, dy) {
  const w = poignee.closest(RANGEABLE), col = w.parentElement;
  const colonnes = colonnesDe(w);
  glisse(colonnes, () => {
    if (dy) {
      const frere = dy < 0 ? w.previousElementSibling : w.nextElementSibling;
      if (!frere) return;
      if (dy < 0) col.insertBefore(w, frere);
      else col.insertBefore(frere, w);
    } else {
      const i = colonnes.indexOf(col) + dx;
      if (i < 0 || i >= colonnes.length) return;
      colonnes[i].appendChild(w);
    }
  });
  poignee.focus();
}

document.addEventListener('keydown', (e) => {
  const poignee = e.target.closest ? e.target.closest('.w-grip') : null;
  if (!poignee) return;
  const pas = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
  if (!pas) return;
  e.preventDefault();
  widgetDeplace(poignee, pas[0], pas[1]);
});

// ---- Retirer un widget ----
function widgetRetire(btn) {
  const w = btn.closest(RANGEABLE);
  if (!w || !w.parentElement) return;
  const colonnes = colonnesDe(w);
  const cle = w.dataset.wg;

  // Le retrait se fait une fois, que l'animation ait joue ou non : sans ce
  // filet, un onglet en arriere-plan garderait le widget a l'ecran.
  let fait = false;
  const enlever = () => {
    if (fait) return;
    fait = true;
    glisse(colonnes, () => w.remove());
    // Le catalogue le repropose : on vient de liberer la place.
    if (cle) {
      const ajout = document.querySelector(`[onclick*="widgetAjoute('${cle}'"]`);
      if (ajout) { ajout.disabled = false; ajout.textContent = 'Ajouter'; }
    }
  };

  const sortie = w.animate(
    [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.97)' }],
    { duration: 140, easing: 'ease-in' });
  sortie.onfinish = enlever;
  setTimeout(enlever, 260);
}

// ---- Ajouter un widget depuis le panneau ----
// L'apercu est une copie du modele : rien a redessiner quand le widget
// change, et ce qu'on montre est exactement ce qu'on pose.
document.querySelectorAll('.dw-item template').forEach((modele) => {
  const vue = modele.closest('.dw-item').querySelector('.dw-vue-in');
  if (!vue || vue.children.length) return;
  const copie = modele.content.firstElementChild.cloneNode(true);
  copie.querySelectorAll('button, input, a, [tabindex]')
    .forEach(el => el.setAttribute('tabindex', '-1'));
  vue.parentElement.setAttribute('aria-hidden', 'true');
  vue.appendChild(copie);
});

function widgetAjoute(cle, btn) {
  const modele = document.getElementById(cle);
  const colonnes = [...document.querySelectorAll('.wgrid.cols-3 > .wcol')];
  if (!modele || !colonnes.length) return;
  // La colonne la plus courte : la grille reste equilibree sans qu'on ait
  // a choisir ou poser le widget.
  const cible = colonnes.reduce((a, b) => (a.offsetHeight <= b.offsetHeight ? a : b));
  const neuf = modele.content.firstElementChild.cloneNode(true);
  // On retient d'ou il vient : retire, le catalogue pourra le reproposer.
  neuf.dataset.wg = cle;
  cible.appendChild(neuf);
  neuf.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  btn.disabled = true;
  btn.textContent = 'Ajouté';
}

// ---- Champs : mise en forme et verification ----
// Le format se corrige pendant la frappe, l'erreur ne s'affiche qu'en
// sortie de champ : personne n'aime s'entendre dire « e-mail invalide » a
// la deuxieme lettre.
const FORMATS = {
  tel: v => v.replace(/\D/g, '').slice(0, 10).replace(/(\d{2})(?=\d)/g, '$1 '),
  cp: v => v.replace(/\D/g, '').slice(0, 5),
  siret: v => {
    const d = v.replace(/\D/g, '').slice(0, 14);
    return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 9), d.slice(9)].filter(Boolean).join(' ');
  },
  naf: v => v.replace(/[^0-9A-Za-z]/g, '').slice(0, 5).toUpperCase(),
};

const REGLES = {
  tel: [/^\d{2}( \d{2}){4}$/, 'Dix chiffres, par exemple 03 84 75 40 40'],
  cp: [/^\d{5}$/, 'Cinq chiffres, par exemple 70000'],
  siret: [/^\d{3} \d{3} \d{3} \d{5}$/, 'Quatorze chiffres'],
  naf: [/^\d{4}[A-Z]$/, 'Quatre chiffres et une lettre, par exemple 8559A'],
};

const MESSAGES = {
  email: 'Il manque un @ ou le nom du domaine, par exemple nom@exemple.fr',
  url: 'Adresse incomplete, par exemple https://exemple.fr',
};

const I_ERREUR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
  'stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/>' +
  '<line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

function champFormate(el) {
  const f = FORMATS[el.dataset.fmt];
  if (!f) return;
  // On compte les caracteres utiles avant le curseur, pas les separateurs :
  // c'est le seul repere qui survive a une remise en forme.
  const utile = /[0-9A-Za-z]/;
  const avant = el.value.slice(0, el.selectionStart).replace(/[^0-9A-Za-z]/g, '').length;
  const v = f(el.value);
  if (v === el.value) return;
  el.value = v;
  let i = 0, vus = 0;
  while (i < v.length && vus < avant) { if (utile.test(v[i])) vus++; i++; }
  el.setSelectionRange(i, i);
}

function champVerifie(el) {
  const champ = el.closest('.form-field');
  if (!champ) return;
  const valeur = el.value.trim();
  const regle = REGLES[el.dataset.fmt];
  let msg = '';
  if (!valeur) {
    if (el.required) msg = 'Ce champ est obligatoire';
  } else if (regle && !regle[0].test(valeur)) {
    msg = regle[1];
  } else if (!el.checkValidity()) {
    msg = MESSAGES[el.type] || 'Ce format n\'est pas reconnu';
  }

  el.classList.toggle('ko', !!msg);
  // L'erreur remplace l'aide : les deux ensemble, c'est deux lignes de
  // petit texte gris-rouge sous un champ, et on ne lit plus ni l'une ni
  // l'autre.
  const aide = champ.querySelector('.form-hint');
  if (aide) aide.hidden = !!msg;

  let bulle = champ.querySelector('.form-error');
  if (!msg) { if (bulle) bulle.remove(); return; }
  if (!bulle) {
    bulle = document.createElement('span');
    bulle.className = 'form-error';
    champ.appendChild(bulle);
  }
  bulle.innerHTML = I_ERREUR + '<span></span>';
  bulle.lastChild.textContent = msg;
}

document.addEventListener('input', (e) => {
  const el = e.target;
  if (!el.classList || !el.classList.contains('form-input')) return;
  champFormate(el);
  // Un champ deja fautif se reverifie a chaque frappe : l'erreur doit
  // disparaitre des qu'elle est corrigee, sans attendre la sortie.
  if (el.classList.contains('ko')) champVerifie(el);
});

document.addEventListener('blur', (e) => {
  const el = e.target;
  if (el.classList && el.classList.contains('form-input') && !el.readOnly) champVerifie(el);
}, true);

// ---- Modale ----
function modalOuvre(id) {
  const veil = document.getElementById(id);
  if (!veil) return;
  veil.hidden = false;
  // Le clavier entre dans la modale au lieu de rester derriere elle, sur le
  // bouton qui l'a ouverte.
  const premier = veil.querySelector('button, input, select, textarea, a[href]');
  if (premier) premier.focus();
}

function modalFerme(el) {
  const veil = typeof el === 'string' ? document.getElementById(el) : el.closest('.modal-veil');
  if (veil) veil.hidden = true;
}

// Le voile se ferme au clic, la carte non : sinon le moindre clic dans le
// formulaire refermerait la fenetre.
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-veil')) e.target.hidden = true;
});

// ---- Choix d'une date : le meme calendrier, une seule borne ----
function dpRender(pop) {
  const y = +pop.dataset.y, m = +pop.dataset.m;
  const choisi = pop.dataset.d ? drpParse(pop.dataset.d) : null;
  pop.querySelector('.ttl').textContent = DRP_MF[m] + ' ' + y;
  const grid = pop.querySelector('.drp-grid');
  grid.querySelectorAll('.drp-day').forEach(c => c.remove());
  const premier = new Date(y, m, 1);
  const cur = new Date(y, m, 1 - ((premier.getDay() + 6) % 7)); // semaine du lundi
  for (let i = 0; i < 42; i++) {
    const c = document.createElement('div');
    c.className = 'drp-day';
    c.textContent = cur.getDate();
    if (cur.getMonth() !== m) c.classList.add('muted');
    if (choisi && cur.getTime() === choisi.getTime()) c.classList.add('start');
    c.dataset.d = drpIso(cur);
    c.onclick = () => dpPick(c);
    grid.appendChild(c);
    cur.setDate(cur.getDate() + 1);
  }
}

function dpOpen(el) {
  const w = el.closest('.dp');
  const ouvert = w.classList.contains('open');
  document.querySelectorAll('.dp.open').forEach(x => x.classList.remove('open'));
  if (!ouvert) {
    w.classList.add('open');
    const pop = w.querySelector('.dp-pop');
    dpRender(pop);
    popCadre(w, pop);
  }
}

function dpNav(btn, delta) {
  const pop = btn.closest('.dp-pop');
  let m = +pop.dataset.m + delta, y = +pop.dataset.y;
  if (m < 0) { m = 11; y--; } else if (m > 11) { m = 0; y++; }
  pop.dataset.m = m; pop.dataset.y = y;
  dpRender(pop);
}

function dpPick(cell) {
  const pop = cell.closest('.dp-pop'), w = pop.closest('.dp');
  const d = drpParse(cell.dataset.d);
  pop.dataset.d = cell.dataset.d;
  pop.dataset.y = d.getFullYear();
  pop.dataset.m = d.getMonth();
  w.querySelector('.form-input').value = drpFmt(d);
  w.classList.remove('open');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.dp')) document.querySelectorAll('.dp.open').forEach(x => x.classList.remove('open'));
});

// ---- Menu gauche : ouvrir et refermer un groupe ----
function toggleNav(el) {
  const groupe = el.closest('.ni-group');
  const ouvert = groupe.classList.contains('open');

  // Un seul groupe ouvert par niveau : ses freres se referment, et leurs
  // propres sous-groupes avec eux. Sans cela le menu s'allonge sans fin.
  for (const frere of groupe.parentElement.children) {
    if (frere === groupe || !frere.classList.contains('ni-group')) continue;
    fermeNav(frere);
    frere.querySelectorAll('.ni-group').forEach(fermeNav);
  }

  groupe.classList.toggle('open', !ouvert);
  el.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
}

function fermeNav(groupe) {
  groupe.classList.remove('open');
  const entete = groupe.querySelector(':scope > [role="button"]');
  if (entete) entete.setAttribute('aria-expanded', 'false');
}

// Au clavier : l'en-tete de groupe repond a Entree et a la barre d'espace.
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const el = e.target.closest ? e.target.closest('.ni-group > [role="button"]') : null;
  if (!el) return;
  e.preventDefault();
  toggleNav(el);
});
