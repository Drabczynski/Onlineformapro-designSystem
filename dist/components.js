/* OnlineManager — composants (JS)
   Généré par build.js depuis index.html. Ne pas modifier à la main.
   Charger après le DOM : <script src="dist/components.js" defer></script> */

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
      const tail = tr.querySelector('.cgear-th, .tail');
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
