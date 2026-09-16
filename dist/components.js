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
  const cell = btn.closest('.catd');
  const menu = cell.querySelector('.rmenu');
  const open = menu.classList.contains('oo');
  closeRowMenus();
  if (!open) { menu.classList.add('oo'); cell.classList.add('oo'); }
}

function closeRowMenus() {
  document.querySelectorAll('.rmenu.oo').forEach(m => m.classList.remove('oo'));
  document.querySelectorAll('.catd.oo').forEach(c => c.classList.remove('oo'));
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
  if (!e.target.closest('.cgear-th')) closePanels();
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  closePanels();
  closeRowMenus();
  document.querySelectorAll('.drp.open').forEach(x => x.classList.remove('open'));
  document.querySelectorAll('.w-dd-wrap.open').forEach(w => w.classList.remove('open'));
});

// ---- Tableaux : afficher / masquer une colonne depuis le panneau ----
function colToggle(cb) {
  const table = cb.closest('.tcard').querySelector('table');
  const key = cb.dataset.col;
  if (!table || !key) return;
  table.querySelectorAll('[data-col="' + key + '"]').forEach(cell => { cell.hidden = !cb.checked; });
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

function drpOpen(btn) {
  const w = btn.closest('.drp');
  const open = w.classList.contains('open');
  document.querySelectorAll('.drp.open').forEach(x => x.classList.remove('open'));
  if (!open) {
    w.classList.add('open');
    const pop = w.querySelector('.drp-pop');
    drpSuggestions(pop);
    drpRender(pop);
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

// ---- Menu gauche : ouvrir et refermer un groupe ----
function toggleNav(el) {
  const groupe = el.closest('.ni-group');
  const ouvert = groupe.classList.toggle('open');
  el.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
}

// Au clavier : l'en-tete de groupe repond a Entree et a la barre d'espace.
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const el = e.target.closest ? e.target.closest('.ni-group > .ni[role="button"]') : null;
  if (!el) return;
  e.preventDefault();
  toggleNav(el);
});
