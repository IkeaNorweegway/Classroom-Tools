// Search boxes and results (Search.astro). Plain JS so it runs in the
// browser as-is. Finds every [data-search] root on the page and wires it up.

import { prepare, search, suggest } from './search-match.js';

const groups = [
  { kind: 'unit', heading: 'Units and topics' },
  { kind: 'concept', heading: 'Ideas and words' },
  { kind: 'activity', heading: 'Practice, sims and games' },
];

const el = (tag, cls = '', text = '') => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text) n.textContent = text;
  return n;
};

export function initSearch() {
  const roots = [...document.querySelectorAll('[data-search]')];
  if (!roots.length) return;
  const base = roots[0].dataset.base ?? '/';
  const course = document.body.dataset.course;

  // The index is fetched once, the first time any search box is used.
  let index = null;
  let loading = null;
  let failed = false;
  const load = () =>
    (loading ??= fetch(`${base}search-index.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((entries) => { index = prepare(entries); })
      .catch(() => { failed = true; }));

  // Which view the reader is in: the page's own, else the one they last chose.
  const audience = () => {
    const own = document.body.dataset.audience;
    if (own) return own;
    try { return localStorage.getItem('audience') ?? 'student'; } catch (e) { return 'student'; }
  };

  function row(e) {
    const parentView = audience() === 'parent';
    const li = el('li', 'sr-item');
    li.dataset.course = e.course;
    const main = el('a', 'sr-main');
    main.href = `${base}${e.kind === 'activity' ? e.view : parentView && e.parent ? e.parent : e.student}`;
    main.append(el('span', 'sr-dot'));
    const body = el('span', 'sr-body');
    body.append(el('span', 'sr-label', e.label));
    const meta = [e.courseName];
    if (e.kind !== 'unit') meta.push(e.unitLabel);
    if (e.where) meta.push(e.where);
    if (parentView && e.parent && e.kind !== 'activity') meta.push('Parent guide');
    body.append(el('span', 'sr-meta', meta.join(' · ')));
    main.append(body);
    li.append(main);
    if (e.kind === 'concept' && e.view) {
      const side = el('a', 'sr-side', `Open ${(e.where ?? 'notes').split(' · ')[0]}`);
      side.href = `${base}${e.view}`;
      li.append(side);
    }
    return li;
  }

  function render(root, query) {
    const out = root.querySelector('[data-search-results]');
    const input = root.querySelector('[data-search-input]');
    const inline = root.dataset.variant === 'inline';
    out.replaceChildren();
    const q = query.trim();
    if (!q) {
      if (inline) out.hidden = true;
      else out.append(el('p', 'sr-note', 'Type a topic or a word from class, like photosynthesis, slope or Confederation.'));
      return;
    }
    if (inline) out.hidden = false;
    if (failed) {
      out.append(el('p', 'sr-note', "Search isn't working right now. Pick a course from the menu instead."));
      return;
    }
    if (!index) {
      out.append(el('p', 'sr-note', 'Loading…'));
      load().then(() => render(root, input.value));
      return;
    }

    const { results, strong } = search(index, q, { course });
    const fix = strong ? null : suggest(index, q);
    if (fix) {
      const p = el('p', 'sr-suggest', 'Did you mean ');
      const b = el('button', 'sr-suggest-btn', fix);
      b.type = 'button';
      b.addEventListener('click', () => {
        input.value = fix;
        render(root, fix);
        input.focus();
      });
      p.append(b, '?');
      out.append(p);
    }
    if (!results.length) {
      if (!fix) out.append(el('p', 'sr-note', `Nothing found for “${q}”. Try a shorter word, or pick a course from the menu.`));
      return;
    }
    // Groups in order of their best result.
    const order = groups
      .map((g) => ({ ...g, items: results.filter((r) => r.entry.kind === g.kind) }))
      .filter((g) => g.items.length)
      .sort((a, b) => b.items[0].score - a.items[0].score);
    for (const g of order) {
      const section = el('section', 'sr-group');
      section.append(el('h3', 'sr-heading', g.heading));
      const ul = el('ul');
      for (const r of g.items) ul.append(row(r.entry));
      section.append(ul);
      out.append(section);
    }
  }

  // Arrow keys move between results; Enter in the box opens the first one.
  function keys(root, input) {
    const links = () => [...root.querySelectorAll('.sr-main')];
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        links()[0]?.focus();
      } else if (e.key === 'Enter') {
        const first = links()[0];
        if (first) {
          e.preventDefault();
          first.click();
        }
      }
    });
    root.querySelector('[data-search-results]').addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const list = links();
      const i = list.indexOf(document.activeElement);
      if (i === -1) return;
      e.preventDefault();
      if (e.key === 'ArrowUp' && i === 0) input.focus();
      else list[Math.min(list.length - 1, Math.max(0, i + (e.key === 'ArrowDown' ? 1 : -1)))].focus();
    });
  }

  for (const root of roots) {
    const input = root.querySelector('[data-search-input]');
    const out = root.querySelector('[data-search-results]');
    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => render(root, input.value), 60);
    });
    input.addEventListener('focus', () => { load(); });
    keys(root, input);

    if (root.dataset.variant === 'nav') {
      const dialog = root.querySelector('dialog');
      const open = () => {
        if (dialog.open) return;
        load();
        dialog.showModal();
        render(root, input.value);
        input.select();
      };
      // The top-bar button and the small-screen trigger (Search.astro) both open it.
      document.querySelectorAll('[data-search-open]').forEach((b) => b.addEventListener('click', open));
      root.querySelector('[data-search-close]').addEventListener('click', () => dialog.close());
      // A click on the backdrop (outside the panel) closes it.
      dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
      document.addEventListener('keydown', (e) => {
        const t = e.target;
        const typing = t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
        if ((e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) {
          e.preventDefault();
          open();
        }
      });
    } else {
      input.addEventListener('focus', () => { if (input.value.trim()) out.hidden = false; });
      root.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          out.hidden = true;
          input.focus();
        }
      });
      root.addEventListener('focusout', (e) => {
        if (!root.contains(e.relatedTarget)) out.hidden = true;
      });
      document.addEventListener('click', (e) => {
        // composedPath, not contains: a clicked "Did you mean" button is already gone.
        if (!e.composedPath().includes(root)) out.hidden = true;
      });
    }
  }
}
