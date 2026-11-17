/* ===== SCIENCE WORD PROBLEMS KIT (Science 7 word-problem trainer; needs DRILL and S from sci.js) =====
   A story item is answered by tapping one choice (one try). Every wrong choice is a named misconception: its cue
   (six words or fewer) and the reasoning step (s) it breaks.
   The picture has two parts: a schematic of the story at the top, and the reasoning chain at the bottom
   (one numbered row per step, so Level 1 shows one row, Level 3 three or more).
     ask           the story's parts, with the unknown as '?', and an empty row for each step
     right / show  each step fades in, in order; parts tied to a step (s) appear with it; the unknown fills in.
                   After a wrong pick, the step that choice broke is drawn in red with the choice's cue.
   Pictures (pic.k):
     scene   icon cards on a small grid joined by arrows: cards [{c, r, i, t, k, s, q, d, x, tag, hl}],
             arrows [{a, b, t, k, s, q, d, dash, x}] (a and b are card indexes). q: '?' until solved, then d.
             x: crossed out in red (a missing input, a removed species). tag: a chip under the card once solved.
     layers  stacked bands, top first: bands [{t, i, k, w, s, q, d, tag}], side: {t, s} (an arrow down the side)
     cell    a plant cell with one part glowing: part = wall | membrane | vacuole | nucleus | chloroplast */
const SW = (() => {
  const { C, el, tx } = DRILL;
  const COL = { L: C.blue, Y: C.yellow, N: C.green, R: C.red, G: C.gold, T: C.teal, P: C.pink, M: C.muted, W: C.text };
  const col = k => COL[k] || k || C.edge;
  const LVC = ['', C.teal, C.gold, C.pink], LVN = ['', 'one step', 'two steps', 'three steps'];
  const done = V => V.phase === 'right' || V.phase === 'show';
  const DLY = .5;
  const on = (e, V) => e.s == null || done(V);
  const anim = (e, V) => e.s != null && done(V) && V.anim ? { class: 'fade', style: 'animation-delay:' + (e.s * DLY + .2) + 's' } : {};
  const qt = (e, V) => e.q ? (done(V) ? e.d : '?') : e.t;
  const qc = (e, V, c) => e.q ? (done(V) ? C.green : C.yellow) : c;

  /* ---------- scene: icon cards and arrows ---------- */
  function scene(A, p, V, H) {
    const cs = p.cards, nc = Math.max(...cs.map(c => c.c)) + 1, nr = Math.max(...cs.map(c => c.r)) + 1;
    const dx = Math.min(210, 620 / nc), dy = Math.min(150, (H - 20) / nr);
    const w = p.w || Math.min(160, dx - (nc > 3 ? 18 : 40)), h = p.h || Math.min(112, dy - 30);
    const pos = c => [320 + (c.c - (nc - 1) / 2) * dx + (c.dx || 0), 14 + (H - 14) / 2 + (c.r - (nr - 1) / 2) * dy];
    const later = [];   // arrow labels go on top of the cards
    (p.arrows || []).forEach(a => {
      const [x1, y1] = pos(cs[a.a]), [x2, y2] = pos(cs[a.b]), L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
      const tr = Math.min(Math.abs(ux) > 1e-6 ? (w / 2 + 8) / Math.abs(ux) : 1e9, Math.abs(uy) > 1e-6 ? (h / 2 + 8) / Math.abs(uy) : 1e9);
      // dir: the direction is the unknown, so before it is solved the link is a plain dashed line with a '?'
      if (a.dir && !done(V)) {
        el('line', { x1: x1 + ux * tr, y1: y1 + uy * tr, x2: x2 - ux * tr, y2: y2 - uy * tr, stroke: C.yellow, 'stroke-width': 3, 'stroke-dasharray': '7 7' }, A.svg);
        later.push(() => S.chip(A.svg, (x1 + x2) / 2, (y1 + y2) / 2, '?', C.yellow, { fs: 17 }));
        return;
      }
      if (!on(a, V)) return;
      const c = a.x ? C.red : a.q ? qc(a, V, C.yellow) : col(a.k || 'G'), key = a.x ? 'R' : a.q ? (done(V) ? 'N' : 'Y') : (a.k || 'G'), an = anim(a, V);
      S.arrow(A.svg, x1 + ux * tr, y1 + uy * tr, x2 - ux * tr, y2 - uy * tr, c, key, Object.assign({ 'stroke-dasharray': a.dash ? '8 7' : null }, an));
      const t = qt(a, V);
      if (t) {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, vert = Math.abs(uy) > Math.abs(ux);
        later.push(() => S.chip(A.svg, mx, my + (vert ? 0 : -26), t, c, { fs: 15, cls: an.class }));
      }
      if (a.x) { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2; tx(A.svg, mx, my + (Math.abs(uy) > Math.abs(ux) ? 0 : 22), '✕', { 'font-size': 26, fill: C.red }); }
    });
    cs.forEach(c => {
      if (!on(c, V)) return;
      const [x, y] = pos(c), an = anim(c, V), k = c.x ? C.red : c.q ? qc(c, V, C.yellow) : c.hl ? C.yellow : col(c.k);
      const g = S.card(A.svg, { x, y, w: c.w || w, h: c.h || h, icon: c.i, label: qt(c, V), col: k, sw: c.hl || c.q ? 3 : 2.5, fs: c.fs || (w < 130 ? 15 : 16), size: c.size || 46, lb: 10, tcol: c.q ? qc(c, V, C.text) : C.text });
      if (an.class) { g.setAttribute('class', an.class); g.setAttribute('style', an.style); }
      if (c.q && !done(V)) g.querySelector('rect').setAttribute('stroke-dasharray', '7 6');
      if (c.x) { el('line', { x1: x - w / 2 + 12, y1: y - h / 2 + 12, x2: x + w / 2 - 12, y2: y + h / 2 - 12, stroke: C.red, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: .85 }, A.svg); }
      if (c.tag && done(V)) S.chip(A.svg, x, y + (c.h || h) / 2 + 16, c.tag, c.tagk ? col(c.tagk) : C.green, { fs: 14, cls: 'pop' });
    });
    later.forEach(f => f());
  }

  /* ---------- layers: bands stacked from the top ---------- */
  function layers(A, p, V, H) {
    const n = p.bands.length, bh = Math.min(64, (H - 30) / n), y0 = 14 + (H - 14 - n * bh) / 2, X = p.side ? 290 : 320, W = 440;
    p.bands.forEach((b, i) => {
      if (!on(b, V)) return;
      const w = W * (b.w || 1), y = y0 + i * bh, c = b.q ? qc(b, V, C.yellow) : b.hl ? C.yellow : col(b.k || 'M'), an = anim(b, V);
      const g = el('g', an, A.svg);
      el('rect', { x: X - w / 2, y: y + 2, width: w, height: bh - 4, rx: 8, fill: c, 'fill-opacity': .14, stroke: c, 'stroke-width': b.hl || b.q ? 3 : 2, 'stroke-dasharray': b.q && !done(V) ? '7 6' : null }, g);
      const t = !b.q && b.d != null && done(V) ? b.d : qt(b, V);
      if (b.i) S.emo(g, X - w / 2 + 34, y + bh / 2, b.i, Math.min(34, bh * .6));
      tx(g, X + (b.i ? 14 : 0), y + bh / 2, t, { 'font-size': 17, fill: b.q ? c : C.text });
      if (b.tag && done(V)) S.chip(A.svg, X + w / 2 - 16 - b.tag.length * 4.5, y + bh / 2, b.tag, C.green, { fs: 14, cls: 'pop' });
    });
    if (p.side && on(p.side, V)) {
      const x = X + W / 2 + 30, an = anim(p.side, V);
      S.arrow(A.svg, x, y0 + 6, x, y0 + n * bh - 6, C.gold, 'G', an);
      tx(A.svg, x + 14, y0 + n * bh / 2, p.side.t, Object.assign({ 'font-size': 15, fill: C.gold, 'text-anchor': 'start', transform: 'rotate(90 ' + (x + 14) + ' ' + (y0 + n * bh / 2) + ')' }, an));
    }
  }

  /* ---------- a plant cell, one part glowing ---------- */
  function cell(A, p, V, H) {
    const w = 330, h = Math.min(220, H - 50), x = 320 - w / 2, y = 10 + (H - 10 - h) / 2, cx = 320, cy = y + h / 2;
    const glow = k => p.part === k ? { stroke: C.yellow, 'stroke-width': 5, filter: 'url(#glow)' } : {};
    el('rect', Object.assign({ x, y, width: w, height: h, rx: 14, fill: '#12261a', stroke: C.green, 'stroke-width': 7 }, glow('wall')), A.svg);
    el('rect', Object.assign({ x: x + 11, y: y + 11, width: w - 22, height: h - 22, rx: 9, fill: 'none', stroke: C.teal, 'stroke-width': 2 }, glow('membrane')), A.svg);
    el('ellipse', Object.assign({ cx: cx + 30, cy, rx: w * .3, ry: h * .3, fill: C.blue, 'fill-opacity': .14, stroke: C.blue, 'stroke-width': 2 }, glow('vacuole')), A.svg);
    el('circle', Object.assign({ cx: x + 62, cy: y + 56, r: 24, fill: C.pink, 'fill-opacity': .35, stroke: C.pink, 'stroke-width': 2 }, glow('nucleus')), A.svg);
    [[x + 54, y + h - 40], [x + 120, y + h - 30], [x + w - 50, y + 38], [x + w - 46, y + h - 44], [x + 150, y + 30]].filter(() => p.chl !== false).forEach(([a, b]) =>
      el('ellipse', Object.assign({ cx: a, cy: b, rx: 15, ry: 9, fill: C.green, 'fill-opacity': .8, stroke: C.green, 'stroke-width': 1.5 }, p.part === 'chloroplast' ? { stroke: C.yellow, 'stroke-width': 4, filter: 'url(#glow)' } : {}), A.svg));
    const lx = 320 + w / 2 + 18;
    S.chip(A.svg, lx + 50, cy, done(V) ? p.d : '?', done(V) ? C.green : C.yellow, { fs: 16, cls: done(V) && V.anim ? 'pop' : null });
    tx(A.svg, x - 14, cy, '🔬', { 'font-size': 40, class: 'emo', 'text-anchor': 'end' });
  }

  /* ---------- a beam on supports (simple) or out from a wall (cantilever), bent by a load ---------- */
  // p: { type: 'simple' | 'cantilever', ask: 'top' | 'bottom' | 'rebar', i (load icon), t (load label) }
  function beam(A, p, V, H) {
    const x0 = 130, x1 = 510, bh = 34, y = Math.min(H * .55, H - 70), cant = p.type === 'cantilever', fin = done(V);
    const lx = cant ? x1 - 30 : (x0 + x1) / 2;
    if (cant) el('rect', { x: x0 - 40, y: y - 90, width: 40, height: 190, fill: C.edge, stroke: C.muted, 'stroke-width': 2 }, A.svg);
    else [x0 + 20, x1 - 20].forEach(x => el('path', { d: 'M' + x + ' ' + (y + bh / 2) + 'l-20 34h40z', fill: C.panel, stroke: C.muted, 'stroke-width': 2.5 }, A.svg));
    el('rect', { x: x0, y: y - bh / 2, width: x1 - x0, height: bh, rx: 4, fill: '#3a2a17', stroke: C.gold, 'stroke-width': 2.5 }, A.svg);
    // the bent shape, dashed
    const sag = 26, d = cant ? 'M' + x0 + ' ' + y + 'Q' + (x0 + x1) / 2 + ' ' + y + ' ' + x1 + ' ' + (y + sag * 1.6) : 'M' + x0 + ' ' + y + 'Q' + (x0 + x1) / 2 + ' ' + (y + sag * 2) + ' ' + x1 + ' ' + y;
    el('path', { d, fill: 'none', stroke: C.muted, 'stroke-width': 2, 'stroke-dasharray': '6 6' }, A.svg);
    S.emo(A.svg, lx, y - bh / 2 - 74, p.i, 44);
    S.arrow(A.svg, lx, y - bh / 2 - 46, lx, y - bh / 2 - 6, C.red, 'R');
    if (p.t) tx(A.svg, lx + 34, y - bh / 2 - 74, p.t, { 'font-size': 15, fill: C.muted, 'text-anchor': 'start' });
    const topT = cant ? 'stretched' : 'squeezed', botT = cant ? 'squeezed' : 'stretched';
    const side = (yy, t, k) => {
      const c = t === 'stretched' ? C.blue : C.gold, a = fin && V.anim ? { class: 'fade', style: 'animation-delay:' + (DLY + .2) + 's' } : {}, m = (x0 + x1) / 2;
      if (t === 'stretched') { S.arrow(A.svg, m - 20, yy, m - 110, yy, c, 'L', a); S.arrow(A.svg, m + 20, yy, m + 110, yy, c, 'L', a); }
      else { S.arrow(A.svg, m - 120, yy, m - 30, yy, c, 'G', a); S.arrow(A.svg, m + 120, yy, m + 30, yy, c, 'G', a); }
      tx(A.svg, m, yy + k * 18, t + (t === 'stretched' ? ': tension' : ': compression'), Object.assign({ 'font-size': 15, fill: c }, a));
    };
    const ask = p.ask === 'rebar' ? 'bottom' : p.ask;
    if (!fin) { const yy = ask === 'top' ? y - bh / 2 : y + bh / 2; el('line', { x1: x0, x2: x1, y1: yy, y2: yy, stroke: C.yellow, 'stroke-width': 5 }, A.svg); S.chip(A.svg, x1 + 50, yy, '?', C.yellow, { fs: 17 }); return; }
    side(y - bh / 2 - 14, topT, -1); side(y + bh / 2 + 14, botT, 1);
    if (p.ask === 'rebar') { const yy = cant ? y - bh / 2 + 7 : y + bh / 2 - 7; el('line', { x1: x0 + 6, x2: x1 - 6, y1: yy, y2: yy, stroke: C.red, 'stroke-width': 4, 'stroke-dasharray': '14 5', class: 'fade' }, A.svg); }
  }

  /* ---------- two blocks with their centres of gravity, and the angle each tips at ---------- */
  // p: { A: {w, h, cg, t, i}, B: {...} }  (w, h in cm; cg = height of the centre of gravity, cm)
  function tip(A, p, V, H) {
    const k = Math.min(150 / Math.max(p.A.w, p.B.w), (H - 110) / Math.max(p.A.h, p.B.h)), base = H - 34, fin = done(V);
    [['A', p.A, 170], ['B', p.B, 470]].forEach(([n, b, x]) => {
      const w = b.w * k, h = b.h * k, cy = base - b.cg * k, ang = Math.round(Math.atan2(b.w / 2, b.cg) * 180 / Math.PI);
      el('line', { x1: x - 120, x2: x + 120, y1: base, y2: base, stroke: C.muted, 'stroke-width': 2 }, A.svg);
      el('rect', { x: x - w / 2, y: base - h, width: w, height: h, rx: 4, fill: C.blue, 'fill-opacity': .12, stroke: C.blue, 'stroke-width': 2.5 }, A.svg);
      if (b.i) S.emo(A.svg, x, base - h - 26, b.i, 34);
      el('circle', { cx: x, cy, r: 8, fill: C.yellow, stroke: C.stage, 'stroke-width': 2 }, A.svg);
      tx(A.svg, x, base + 20, b.t, { 'font-size': 16, fill: C.text });
      if (!fin) return;
      const a = V.anim ? { class: 'fade', style: 'animation-delay:' + (DLY + .2) + 's' } : {};
      el('line', Object.assign({ x1: x, y1: cy, x2: x + w / 2, y2: base, stroke: C.gold, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, a), A.svg);
      el('line', Object.assign({ x1: x, y1: cy, x2: x, y2: base, stroke: C.muted, 'stroke-width': 2, 'stroke-dasharray': '3 5' }, a), A.svg);
      S.chip(A.svg, x, Math.max(26, base - h - 58), 'tips at ' + ang + '°', ang < Math.round(Math.atan2((n === 'A' ? p.B : p.A).w / 2, (n === 'A' ? p.B : p.A).cg) * 180 / Math.PI) ? C.red : C.green, { fs: 15, cls: V.anim ? 'pop' : null });
    });
  }

  const PIC = { scene, layers, cell, beam, tip };

  /* ---------- the reasoning chain ---------- */
  function steps(A, it, V, top) {
    const n = it.steps.length, rh = n > 3 ? 28 : 33, bad = done(V) && V.res && !V.res.ok && V.res.s >= 0 ? V.res.s : -1;
    it.steps.forEach((st, i) => {
      const y = top + i * rh + rh / 2, flag = i === bad, c = flag ? C.red : LVC[it.lvl], a = done(V) && V.anim ? { class: 'fade', style: 'animation-delay:' + (i * DLY) + 's' } : {};
      el('circle', { cx: 26, cy: y, r: 12, fill: c, 'fill-opacity': done(V) ? .9 : .25, stroke: c, 'stroke-width': 1.5 }, A.svg);
      tx(A.svg, 26, y + 1, String(i + 1), { 'font-size': 14, 'font-weight': 700, fill: done(V) ? C.stage : c, style: 'stroke:none' });
      if (!done(V)) { el('line', { x1: 48, x2: 610, y1: y, y2: y, stroke: C.edge, 'stroke-width': 2, 'stroke-dasharray': '4 8' }, A.svg); return; }
      tx(A.svg, 46, y, st.l, Object.assign({ 'font-size': 14, fill: flag ? C.red : C.gold, 'text-anchor': 'start', 'font-weight': 650 }, a));
      const fs = Math.min(16, 440 / Math.max(1, st.m.length * .5));
      tx(A.svg, 178, y, st.m, Object.assign({ 'font-size': fs, fill: flag ? '#ff9a90' : i === n - 1 ? C.green : C.text, 'text-anchor': 'start' }, a));
    });
  }

  function draw(A, it, V) {
    const n = it.steps.length, rh = n > 3 ? 28 : 33, top = 420 - n * rh - 6;
    el('line', { x1: 14, x2: 626, y1: top - 8, y2: top - 8, stroke: C.edge, 'stroke-width': 1.5 }, A.svg);
    PIC[it.pic.k](A, it.pic, V, top - 14);
    steps(A, it, V, top);
  }

  /* ---------- a tab: one unit, a round ramping from one step to three ---------- */
  function tab(o) {
    return {
      id: o.id, code: o.code, name: o.name, sec: 1, notes: o.notes, kind: 'choice', cols: 2,
      q: it => it.q, gen: o.gen, typeOf: it => it.t,
      prompt: it => '<div class="lvl l' + it.lvl + '">Level ' + it.lvl + ' · ' + LVN[it.lvl] + '<span class="lo">' + it.code + '</span></div><div class="story">' + it.story + '</div>',
      choices: it => it.opts.map(c => ({ v: c.v, label: c.t, aria: c.t })),
      check: (it, r) => MODEL.check(it, r), answer: it => ({ v: 'a' }), link: o.link, draw
    };
  }
  /* ---------- v2: a reading tab. The passage fills the stage; the student works through checked steps:
     Key facts (tap the sentences that matter; two tries), Key idea (one try), What can we assume? (Levels 2–3,
     one try), Answer (two tries). A tracker under the passage fills in as they go. After the answer the stage
     shows the picture and the reasoning chain, with a Reading chip to look back. A slip on an earlier step
     makes a right answer yellow (check returns partial). State lives in the shell's resp for the item. ---------- */
  const STEPN = { facts: 'Key facts', idea: 'Key idea', assume: 'What can we assume?', answer: 'Answer' };
  const HINT = { facts: 'Tap the key facts, then Check', idea: 'Pick the key idea', assume: 'Pick what we can assume', answer: 'Pick your answer' };
  const XH = 'http://www.w3.org/1999/xhtml', $ = id => document.getElementById(id);
  const stepsOf = it => ['facts', 'idea'].concat(it.read.assume ? ['assume'] : [], ['answer']);
  let CUR = null;   // { box, it, A } for the item on screen
  function fbSet(kind, cue) {
    const f = $('fb'); f.className = 'fb ' + kind;
    f.innerHTML = '<span class="mark">' + (kind === 'ok' ? '✓' : kind === 'bad' ? '✗' : '👁') + '</span><span>' + cue + '</span>';
  }
  const chipH = it => '<div class="lvl l' + it.lvl + '">Level ' + it.lvl + ' · ' + (it.lvl === 1 ? '3 steps' : '4 steps') + '<span class="lo">' + it.code + '</span></div>';
  function mkBtn(cls, html, on) { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.innerHTML = html; b.addEventListener('click', on); return b; }

  function renderPanel(fin) {
    const { box, it, A } = CUR, r = A.resp, S = stepsOf(it), i = fin ? S.length - 1 : r.step || 0, st = S[i];
    $('q').textContent = 'Step ' + (i + 1) + ' of ' + S.length + ' · ' + STEPN[st];
    const pr = $('prompt'); pr.style.fontSize = '';
    pr.innerHTML = chipH(it) + '<div class="story">' + (st === 'facts' ? 'Read the story. Tap the sentences with the <b>key facts</b>, then press Check.'
      : st === 'idea' ? 'Which <b>science idea</b> do you need for this problem?' : st === 'assume' ? 'What can we safely <b>assume</b>?' : '<b>' + it.read.ask + '</b>') + '</div>';
    box.innerHTML = '';
    if (st === 'facts') {
      const n = (r.sel || []).length;
      box.appendChild(mkBtn('btn primary factsBtn', 'Check key facts' + (n ? ' (' + n + ')' : ''), onFacts));
      return;
    }
    const step = st === 'answer' ? it : it.read[st], row = document.createElement('div');
    row.className = 'choices two';
    step.opts.forEach(o => {
      const b = mkBtn('choice', o.t, () => onPick(st, o.v, b)); b.dataset.v = o.v; b.setAttribute('aria-label', o.t);
      if (st === 'answer' && (r.tried || []).includes(o.v)) { b.classList.add('bad'); b.disabled = true; }
      if (fin && o.v === 'a') b.classList.add('ok');
      if (fin && o.v === r.v && o.v !== 'a') b.classList.add('bad');
      row.appendChild(b);
    });
    box.appendChild(row);
  }
  function advance() { const r = CUR.A.resp; r.step = (r.step || 0) + 1; renderPanel(); CUR.A.redraw(); }
  function onFacts() {
    const { it, A } = CUR, r = A.resp; if (A.locked) return;
    const res = MODEL.checkFacts(it, r.sel); r.factsTry = (r.factsTry || 0) + 1;
    if (res.ok) { r.facts = 'ok'; r.flag = null; fbSet('ok', res.cue); return advance(); }
    if (r.factsTry < 2) { r.flag = res.extra; fbSet('bad', res.cue + ' · try again'); return A.redraw(); }
    r.facts = 'shown'; r.flag = null; r.miss = (r.miss || 0) + 1;
    r.sel = it.read.p.map((c, k) => c.k === 'must' ? k : -1).filter(k => k >= 0);
    fbSet('bad', 'The key facts are in green'); advance();
  }
  function onPick(st, v, b) {
    const { it, A } = CUR, r = A.resp; if (A.locked) return;
    if (st === 'answer') {
      r.v = v; r.done = true;
      if (!MODEL.check(it, r).ok) { r.tried = (r.tried || []).concat(v); b.classList.add('bad'); b.disabled = true; }
      return $('bCheck').click();
    }
    const res = MODEL.checkPick(it.read[st], v); r[st] = v;
    if (!res.ok) r.miss = (r.miss || 0) + 1;
    fbSet(res.ok ? 'ok' : 'bad', res.ok ? 'Yes' : res.cue);
    advance();
  }

  // The passage (tappable on the Key facts step) and the step tracker under it.
  function reading(A, it, V) {
    const r = V.resp || {}, S = stepsOf(it), fin = done(V), cur = fin ? S.length : r.step || 0, rh = 31, top = 420 - S.length * rh - 8;
    const factsDone = fin || cur > 0, tapping = !fin && cur === 0;
    const fo = el('foreignObject', { x: 10, y: 6, width: 620, height: top - 16 }, A.svg), div = document.createElementNS(XH, 'div');
    const len = it.read.p.reduce((a, c) => a + c.t.length, 0) + it.read.ask.length;
    div.setAttribute('style', 'font: ' + (len > 620 ? 15 : len > 520 ? 15.5 : 16.5) + 'px/' + (len > 620 ? 1.42 : 1.5) + ' "Segoe UI Variable Text","Segoe UI",system-ui,sans-serif; color:' + C.text + '; padding: 4px 6px; user-select: none;');
    const sel = new Set(r.sel || []), flag = new Set(r.flag || []);
    it.read.p.forEach((c, k) => {
      const s = document.createElementNS(XH, 'span'), on = sel.has(k);
      s.textContent = c.t; s.className = 'snt';
      let st = 'padding: 1px 2px; border-radius: 4px; box-decoration-break: clone; -webkit-box-decoration-break: clone;';
      if (factsDone) st += c.k === 'must' ? 'background: rgba(131,193,103,.22); border-bottom: 2px solid ' + C.green + ';' : on ? 'background: rgba(247,217,111,.14);' : 'color: ' + C.muted + ';';
      else if (flag.has(k)) st += 'background: rgba(252,98,85,.25); border-bottom: 2px solid ' + C.red + ';';
      else if (on) st += 'background: rgba(247,217,111,.25); border-bottom: 2px solid ' + C.yellow + ';';
      if (tapping) {
        st += 'cursor: pointer;'; s.setAttribute('role', 'button'); s.setAttribute('tabindex', '0'); s.setAttribute('aria-pressed', on ? 'true' : 'false');
        const tog = () => { if (A.locked) return; const nx = new Set(r.sel || []); nx.has(k) ? nx.delete(k) : nx.add(k); r.sel = [...nx]; r.flag = (r.flag || []).filter(x => x !== k); renderPanel(); A.redraw(); };
        s.addEventListener('click', tog);
        s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); tog(); } });
      }
      s.setAttribute('style', st); div.appendChild(s); div.appendChild(document.createTextNode(' '));
    });
    const q = document.createElementNS(XH, 'div'); q.textContent = it.read.ask;
    q.setAttribute('style', 'margin-top: 8px; font-weight: 700; color: ' + C.blue + ';'); div.appendChild(q);
    fo.appendChild(div);
    // the tracker
    el('line', { x1: 14, x2: 626, y1: top - 6, y2: top - 6, stroke: C.edge, 'stroke-width': 1.5 }, A.svg);
    const pickText = (step, v) => (step.opts.find(o => o.v === v) || {}).t || '';
    S.forEach((st, i) => {
      const y = top + i * rh + rh / 2, now = i === cur && !fin, past = i < cur || fin, c = now ? C.yellow : past ? LVC[it.lvl] : C.edge;
      el('circle', { cx: 26, cy: y, r: 12, fill: past ? c : 'none', stroke: c, 'stroke-width': now ? 3 : 1.5 }, A.svg);
      tx(A.svg, 26, y + 1, String(i + 1), { 'font-size': 14, 'font-weight': 700, fill: past ? C.stage : c, style: 'stroke:none' });
      tx(A.svg, 46, y, STEPN[st], { 'font-size': 14, 'font-weight': 650, fill: now ? C.yellow : past ? C.gold : C.muted, 'text-anchor': 'start' });
      let v = '', vc = C.text;
      if (now) { v = st === 'answer' && V.phase === 'wrong' ? '✗ ' + pickText(it, r.v) + ': try again' : '← ' + HINT[st]; vc = st === 'answer' && V.phase === 'wrong' ? '#ff9a90' : C.yellow; }
      else if (past && st === 'facts') { v = r.facts === 'shown' ? '✗ shown in green' : '✓ ' + it.read.p.filter(c => c.k === 'must').length + ' key facts found'; vc = r.facts === 'shown' ? '#ff9a90' : C.green; if (fin && !r.facts) { v = 'key facts in green'; vc = C.green; } }
      else if (past && st !== 'answer') { const step = it.read[st], okk = r[st] === 'a'; v = (r[st] == null ? '' : okk ? '✓ ' : '✗ ') + step.a; vc = okk || r[st] == null ? C.green : '#ff9a90'; }
      else if (past) { v = '✓ ' + it.a; vc = C.green; }
      if (v) tx(A.svg, 236, y, v, { 'font-size': Math.min(15, 390 / Math.max(1, v.length * .5)), fill: vc, 'text-anchor': 'start' });
    });
  }

  function readDraw(A, it, V) {
    const r = V.resp || {};
    if (done(V) && CUR && CUR.it === it && !r.fin) { r.fin = true; renderPanel(true); }
    if (!done(V) || r.view === 'read') reading(A, it, V); else draw(A, it, V);
    if (!done(V)) return;
    const g = el('g', { style: 'cursor:pointer', role: 'button', tabindex: '0', 'aria-label': r.view === 'read' ? 'Show the picture' : 'Show the reading' }, A.svg);
    const tog = () => { r.view = r.view === 'read' ? '' : 'read'; A.redraw(); };
    S.chip(g, 572, 20, r.view === 'read' ? '🖼 Picture' : '📄 Reading', C.blue, { fs: 14 });
    g.addEventListener('click', tog);
  }

  function readTab(o) {
    return {
      id: o.id, code: o.code, name: o.name, sec: 1, notes: o.notes, kind: 'custom', tries: 2,
      q: () => '', gen: o.gen, typeOf: it => it.t, prompt: it => chipH(it), link: o.link,
      panel(box, it, A) { CUR = { box, it, A }; A.resp.step = 0; renderPanel(); },
      ready: (r, it) => r.done || r.shown ? '' : HINT[stepsOf(it)[r.step || 0]],
      check: (it, r) => MODEL.check(it, r), answer: () => ({ v: 'a', done: true }), draw: readDraw
    };
  }
  return { tab, readTab, draw, PIC, LVN };
})();
/* ===== SCIENCE WORD PROBLEMS KIT END ===== */
