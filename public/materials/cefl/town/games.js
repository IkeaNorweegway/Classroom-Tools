/* CEFL Town — the kit's one-minute games (the "play the shift" verb, engine api.minigame). Three templates a mission fills with its own
   content, so every mission after Payday gets a one-minute game without a new game engine:
   - sortRush:  one card at a time; tap the group it belongs in before its timer runs out (needs or wants, routine or judgment …).
   - spotRush:  cards appear in a grid and fade; tap the problems (hazards, red flags) and leave the fine ones alone.
   - quickPick: a quick question with 2–4 answers (light money math, the best reply in an interview …).
   Model (GAMEKIT MODEL START … END, no DOM): GAMEKIT.<template>(cfg) → a game with make(seed, mode), update(st, dt), act(st, a),
   best(st), actions(st), tier(st). Node runs it with the mission's cfg and bots to set cfg.th: a careful player reaches great, and an
   idle or random-tapping player never reaches ok (a wrong tap costs 2 when there are only 2 choices, and tapping a fine card in
   spotRush costs 2, so guessing never pays).
   The view (after the model) draws each template; every target carries data-act. Registers CEFLTown.gameKit. */
(function () {
  'use strict';
  var T = window.CEFLTown = window.CEFLTown || {};

/* GAMEKIT MODEL START ── no DOM. Time in ms. ── */
function gkRNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function gkStart(seed, mode) { return { r: gkRNG(seed), mode: mode, real: mode === 'real', t: 0, score: 0, right: 0, wrong: 0, ver: 0, pops: [], msg: '', over: false }; }
function gkGain(st, at, n) { n = n || 1; st.score += n; st.right++; st.pops.push({ pts: n, at: at }); st.ver++; }
function gkLose(st, at, n) { n = n || 1; st.score -= n; st.wrong++; st.pops.push({ pts: -n, at: at }); st.ver++; }
function gkTier(th) { return function (st) { var t = th[st.real ? 1 : 0]; return st.score >= t[0] ? 'great' : st.score >= t[1] ? 'ok' : 'poor'; }; }
function gkDraw(st, list, key) { // a shuffled bag, so items do not repeat until all have been seen
  var b = st[key]; if (!b || !b.length) { b = st[key] = list.map(function (x, i) { return i; }); for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(st.r() * (i + 1)), t = b[i]; b[i] = b[j]; b[j] = t; } }
  return list[b.pop()];
}
function gkPlain(t) { return String(t).replace(/<[^>]+>/g, ''); }
var GAMEKIT = {};

/* sortRush. cfg: { id, name, bins: [{ id, label, icon }], items: [{ t, icon, bin, why }], win: [gentle ms, real ms], think, th } */
GAMEKIT.sortRush = function (cfg) {
  var two = cfg.bins.length === 2, pen = two ? 2 : 1, W = cfg.win || [7000, 5000];
  function label(id) { for (var i = 0; i < cfg.bins.length; i++) if (cfg.bins[i].id === id) return cfg.bins[i].label; return id; }
  function next(st) { var it = gkDraw(st, cfg.items, 'bag'); st.cur = it; st.left = st.win; st.n++; st.ver++; }
  return { id: cfg.id, name: cfg.name, kind: 'sortRush', cfg: cfg, th: cfg.th || [[16, 6], [16, 6]], pace: { think: cfg.think || 1300, tap: 350 },
    make: function (seed, mode) { var st = gkStart(seed, mode); st.win0 = st.win = st.real ? W[1] : W[0]; st.cur = null; st.gap = 300; st.n = 0; st.sorted = 0; st.late = 0; return st; },
    update: function (st, dt) {
      st.t += dt;
      if (!st.cur) { st.gap -= dt; if (st.gap <= 0) next(st); return; }
      st.left -= dt;
      if (st.left <= 0) { st.late++; gkLose(st, 'timer', 1); st.msg = 'Too slow! “' + gkPlain(st.cur.t) + '” goes in ' + label(st.cur.bin) + '.'; st.cur = null; st.gap = 500; st.ver++; }
    },
    act: function (st, a) {
      var m = /^b:(.+)$/.exec(a); if (!m || !st.cur) return false;
      var it = st.cur;
      if (it.bin === m[1]) { gkGain(st, a); st.sorted++; st.msg = ''; st.win = Math.max(st.win0 * 0.6, st.win * 0.96); }
      else { gkLose(st, a, pen); st.msg = 'Not quite: “' + gkPlain(it.t) + '” goes in ' + label(it.bin) + '.' + (!st.real && it.why ? ' ' + it.why : ''); }
      st.cur = null; st.gap = 250; st.ver++; return true;
    },
    best: function (st) { return st.cur ? 'b:' + st.cur.bin : null; },
    actions: function () { return cfg.bins.map(function (b) { return 'b:' + b.id; }); }
  };
};

/* spotRush. cfg: { id, name, cards: [{ t, icon, bad, why, fine }], pBad (0.45), every: [g, r] ms, life: [g, r] ms, think, th } */
GAMEKIT.spotRush = function (cfg) {
  var bads = cfg.cards.filter(function (c) { return c.bad; }), fines = cfg.cards.filter(function (c) { return !c.bad; }), EV = cfg.every || [1400, 1100], LF = cfg.life || [4800, 3600];
  function spawn(st) {
    var empty = [], i; for (i = 0; i < st.cells.length; i++) if (!st.cells[i]) empty.push(i);
    if (!empty.length) return;
    var bad = st.r() < (cfg.pBad || 0.45), c = bad ? gkDraw(st, bads, 'bagB') : gkDraw(st, fines, 'bagF'), at = empty[Math.floor(st.r() * empty.length)];
    st.cells[at] = { c: c, life: st.life, max: st.life, id: st.uid++ }; st.ver++;
  }
  return { id: cfg.id, name: cfg.name, kind: 'spotRush', cfg: cfg, th: cfg.th || [[12, 5], [12, 5]], pace: { think: cfg.think || 900, tap: 300 },
    make: function (seed, mode) { var st = gkStart(seed, mode); st.cells = [null, null, null, null, null, null]; st.every = st.real ? EV[1] : EV[0]; st.life = st.real ? LF[1] : LF[0]; st.next = 300; st.uid = 0; st.found = 0; st.missed = 0; st.oops = 0; return st; },
    update: function (st, dt) {
      st.t += dt; st.next -= dt;
      if (st.next <= 0) { spawn(st); st.next = st.every * (0.8 + 0.4 * st.r()); }
      st.cells.forEach(function (x, i) {
        if (!x) return; x.life -= dt;
        if (x.life <= 0) { st.cells[i] = null; st.ver++; if (x.c.bad) { st.missed++; gkLose(st, 's' + i, 1); st.msg = 'Missed one: ' + gkPlain(x.c.t) + '.' + (!st.real && x.c.why ? ' ' + x.c.why : ''); } }
      });
    },
    act: function (st, a) {
      var m = /^s(\d)$/.exec(a), i = m ? +m[1] : -1, x = st.cells[i]; if (!x) return false;
      st.cells[i] = null;
      if (x.c.bad) { st.found++; gkGain(st, a); st.msg = x.c.why && !st.real ? 'Good catch: ' + x.c.why : ''; }
      else { st.oops++; gkLose(st, a, 2); st.msg = 'That one was fine: ' + gkPlain(x.c.t) + '.' + (!st.real && x.c.fine ? ' ' + x.c.fine : ''); }
      st.ver++; return true;
    },
    best: function (st) { var b = -1, lo = 1e9; st.cells.forEach(function (x, i) { if (x && x.c.bad && x.life < lo) { lo = x.life; b = i; } }); return b < 0 ? null : 's' + b; },
    actions: function () { return ['s0', 's1', 's2', 's3', 's4', 's5']; }
  };
};

/* quickPick. cfg: { id, name, make(r, real) → { q, icon, opts: [text], ans, why }, limit: [g, r] ms (0 = none), think, th } */
GAMEKIT.quickPick = function (cfg) {
  var LIM = cfg.limit || [0, 0];
  function next(st) { st.q = cfg.make(st.r, st.real); st.left = st.lim; st.n++; st.ver++; }
  return { id: cfg.id, name: cfg.name, kind: 'quickPick', cfg: cfg, th: cfg.th || [[12, 5], [12, 5]], pace: { think: cfg.think || 2600, tap: 300 },
    make: function (seed, mode) { var st = gkStart(seed, mode); st.lim = st.real ? LIM[1] : LIM[0]; st.n = 0; next(st); return st; },
    update: function (st, dt) {
      st.t += dt;
      if (st.lim) { st.left -= dt; if (st.left <= 0) { gkLose(st, 'timer', 1); st.msg = 'Time! The answer was: ' + gkPlain(st.q.opts[st.q.ans]) + '.'; next(st); } }
    },
    act: function (st, a) {
      var m = /^o(\d)$/.exec(a), i = m ? +m[1] : -1; if (i < 0 || i >= st.q.opts.length) return false;
      var two = st.q.opts.length === 2;
      if (i === st.q.ans) { gkGain(st, a); st.msg = ''; }
      else { gkLose(st, a, two ? 2 : 1); st.msg = 'Not quite. The answer was: ' + gkPlain(st.q.opts[st.q.ans]) + '.' + (!st.real && st.q.why ? ' ' + st.q.why : ''); }
      next(st); return true;
    },
    best: function (st) { return 'o' + st.q.ans; },
    actions: function (st) { return st.q.opts.map(function (o, i) { return 'o' + i; }); }
  };
};
/* GAMEKIT MODEL END */

  /* ── The views. Moving parts (timers, card life) change transform only, from frame(); render runs only when st.ver changes. ── */
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function btn(a, html, cls) { return '<button class="ct-btn ct-mg-t' + (cls ? ' ' + cls : '') + '" type="button" data-act="' + a + '">' + html + '</button>'; }
  function setX(el, k) { if (!el) return; var v = Math.max(0, Math.min(1, k)).toFixed(3); if (el.dataset.k !== v) { el.dataset.k = v; el.style.transform = 'scaleX(' + v + ')'; } }
  var VIEWS = {
    sortRush: function (g) {
      var cfg = g.cfg, n = cfg.bins.length;
      return {
        how: cfg.how || '<p><b>' + esc(cfg.name) + '.</b> A card shows up. Tap the group it belongs in before its timer runs out.</p><p class="ct-small">A wrong group costs ' + (n === 2 ? '2 points' : 'a point') + '. So does a card that runs out of time.</p>',
        keys: n === 2 ? '← and → (or 1 and 2)' : '1–' + n,
        render: function (st) {
          return '<div class="gk-card" aria-live="polite">' + (st.cur ? '<span class="gk-ic" aria-hidden="true">' + (st.cur.icon || '🃏') + '</span><span class="gk-t">' + st.cur.t + '</span>' : '<span class="ct-small">Next card…</span>') + '</div>' +
            '<div class="gk-timer" aria-hidden="true"><span></span></div>' +
            '<div class="gk-bins" style="grid-template-columns:repeat(' + Math.min(n, 4) + ',minmax(0,1fr))">' + cfg.bins.map(function (b, i) { return btn('b:' + b.id, (b.icon ? '<span class="ct-mg-ic" aria-hidden="true">' + b.icon + '</span>' : '') + '<b>' + esc(b.label) + '</b><span class="ct-small">' + (n === 2 ? (i ? '→' : '←') : i + 1) + '</span>'); }).join('') + '</div>';
        },
        frame: function (arena, st) { setX(arena.querySelector('.gk-timer span'), st.cur ? st.left / st.win : 0); },
        key: function (e) { var i = n === 2 && e.key === 'ArrowLeft' ? 1 : n === 2 && e.key === 'ArrowRight' ? 2 : /^[1-9]$/.test(e.key) ? +e.key : 0; return i && cfg.bins[i - 1] ? 'b:' + cfg.bins[i - 1].id : null; },
        scoreText: function (st) { return (cfg.scoreWord || 'Sorted') + ': ' + st.sorted; },
        stats: function (st) { return 'Right: <b>' + st.sorted + '</b>. Wrong group: <b>' + (st.wrong - st.late) + '</b>. Ran out of time: <b>' + st.late + '</b>.'; }
      };
    },
    spotRush: function (g) {
      var cfg = g.cfg;
      return {
        how: cfg.how || '<p><b>' + esc(cfg.name) + '.</b> Cards pop up and fade. Tap the ones that are a problem. Leave the fine ones alone.</p><p class="ct-small">Tapping a fine card costs 2 points. A problem you miss costs 1.</p>',
        keys: '1–6 (top row 1–3, bottom row 4–6)',
        render: function (st) {
          return '<div class="gk-grid">' + st.cells.map(function (x, i) {
            if (!x) return '<button class="ct-btn gk-cell empty" type="button" data-act="s' + i + '" aria-label="Empty spot ' + (i + 1) + '" tabindex="-1">·</button>';
            return '<button class="ct-btn gk-cell" type="button" data-act="s' + i + '"><span class="ct-mg-ic" aria-hidden="true">' + (x.c.icon || '❔') + '</span><span>' + x.c.t + '</span><span class="gk-life" aria-hidden="true"><span data-life="' + i + '"></span></span></button>';
          }).join('') + '</div>';
        },
        frame: function (arena, st) { st.cells.forEach(function (x, i) { if (x) setX(arena.querySelector('[data-life="' + i + '"]'), x.life / x.max); }); },
        key: function (e) { return /^[1-6]$/.test(e.key) ? 's' + (+e.key - 1) : null; },
        scoreText: function (st) { return (cfg.scoreWord || 'Found') + ': ' + st.found; },
        stats: function (st) { return 'Found: <b>' + st.found + '</b>. Missed: <b>' + st.missed + '</b>. Fine ones tapped: <b>' + st.oops + '</b>.'; }
      };
    },
    quickPick: function (g) {
      var cfg = g.cfg;
      return {
        how: cfg.how || '<p><b>' + esc(cfg.name) + '.</b> Read the question and tap the right answer. A new one comes right away.</p><p class="ct-small">A wrong answer costs a point.</p>',
        keys: '1–4',
        render: function (st) {
          var q = st.q;
          return '<div class="gk-card">' + (q.icon ? '<span class="gk-ic" aria-hidden="true">' + q.icon + '</span>' : '') + '<span class="gk-t">' + q.q + '</span></div>' + (st.lim ? '<div class="gk-timer" aria-hidden="true"><span></span></div>' : '') +
            '<div class="gk-opts">' + q.opts.map(function (o, i) { return btn('o' + i, '<span>' + o + '</span><span class="ct-small">' + (i + 1) + '</span>'); }).join('') + '</div>';
        },
        frame: function (arena, st) { if (st.lim) setX(arena.querySelector('.gk-timer span'), st.left / st.lim); },
        key: function (e, st) { var i = /^[1-4]$/.test(e.key) ? +e.key - 1 : -1; return i >= 0 && i < st.q.opts.length ? 'o' + i : null; },
        scoreText: function (st) { return (cfg.scoreWord || 'Right') + ': ' + st.right; },
        stats: function (st) { return 'Right: <b>' + st.right + '</b>. Wrong: <b>' + st.wrong + '</b>.'; }
      };
    }
  };
  function build(kind) { return function (cfg) { var g = GAMEKIT[kind](cfg), v = VIEWS[kind](g); g.tier = gkTier(g.th); Object.keys(v).forEach(function (k) { g[k] = v[k]; }); return g; }; }
  T.gameKit = { sortRush: build('sortRush'), spotRush: build('spotRush'), quickPick: build('quickPick'), model: GAMEKIT };
})();
