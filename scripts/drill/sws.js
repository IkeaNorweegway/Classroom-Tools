/* ===== SCIENCE SCENARIOS KIT (Science 7 word problems v3; needs DRILL, S from sci.js and SW from sw.js) =====
   A scenario is one reading, like a unit-test question: a real Alberta situation in sentences, often with a small
   data table, then 2–3 linked parts that climb from Apply (part a) to Analyze (parts b, c). Each part is one item in
   the round of 10, so a round is about four scenarios. The tab keeps the scenario between parts (RUN).
   A part's steps, each checked:
     1 Key facts         tap the sentences and table rows that matter for THIS part (two tries; then shown in green)
     2 Key idea          which science idea the part needs (when the part names one)
     3 What can we assume?   (when the part has one)
     4 Answer            the part's question; every wrong choice is a named misconception (two tries)
     5 Best explanation  last part only: the best of three written answers (one complete, one with no reasoning,
                         one with a misconception). On these parts the answer's two tries are kept here, and the
                         shell checks once at the end: a slip anywhere gives a yellow dot, no right answer a red one.
   After the answer the stage shows the picture and the reasoning chain (SW.draw), with a 📄 Reading chip.
   Item (from the model): { t, unit, part, of, lvl: 'ap' | 'an', code, sec, a, opts, errs, steps, pic,
     read: { p: [{t, k} | {cells, head, k}], ask, idea, assume, explain }, prev: [{ask, a}] }
   p chunks: k = must (a key fact for this part), opt (setup, or a fact for another part) or no (a detail to skip).
   New picture: chart (grouped bars), added to SW.PIC. */
const SWS = (() => {
  const { C, el, tx } = DRILL;
  const XH = 'http://www.w3.org/1999/xhtml', $ = id => document.getElementById(id);
  const done = V => V.phase === 'right' || V.phase === 'show';
  const LV = { ap: ['Apply', C.gold, 'l2'], an: ['Analyze', C.pink, 'l3'] };
  const STEPN = { facts: 'Key facts', idea: 'Key idea', assume: 'What can we assume?', answer: 'Answer', explain: 'Best explanation' };
  const HINT = { facts: 'Tap the key facts, then Check', idea: 'Pick the key idea', assume: 'Pick what we can assume', answer: 'Pick your answer', explain: 'Pick the best written answer' };
  const stepsOf = it => ['facts'].concat(it.read.idea ? ['idea'] : [], it.read.assume ? ['assume'] : [], ['answer'], it.read.explain ? ['explain'] : []);
  const LET = 'abc';
  let CUR = null;          // { box, it, A } for the part on screen
  const RUN = {};          // tab id -> { parts, next }: the scenario in progress

  /* ---------- chart: grouped bars, for a scenario's data ---------- */
  // p: { cats: [label], series: [{t, k, v: [number per cat]}], y: axis label, hl: [cat index] (ringed once solved), s }
  function chart(A, p, V, H) {
    const x0 = 92, x1 = 612, top = p.series.length > 1 ? 50 : 30, base = H - 34, all = [].concat(...p.series.map(s => s.v));
    const mx = Math.max(...all) * 1.18 || 1, Y = v => base - (base - top) * v / mx;
    el('line', { x1: x0, x2: x1, y1: base, y2: base, stroke: C.axis, 'stroke-width': 2 }, A.svg);
    el('line', { x1: x0, x2: x0, y1: top - 10, y2: base, stroke: C.axis, 'stroke-width': 2 }, A.svg);
    if (p.y) tx(A.svg, 30, (top + base) / 2, p.y, { 'font-size': 14, fill: C.muted, transform: 'rotate(-90 30 ' + (top + base) / 2 + ')' });
    const gw = (x1 - x0) / p.cats.length, ns = p.series.length, bw = Math.min(64, gw * .72 / ns), fin = done(V);
    p.cats.forEach((c, i) => {
      const gx = x0 + gw * (i + .5);
      if (fin && (p.hl || []).includes(i)) el('rect', { x: gx - gw / 2 + 6, y: top - 18, width: gw - 12, height: base - top + 18, rx: 10, fill: C.yellow, 'fill-opacity': .07, stroke: C.yellow, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, A.svg);
      tx(A.svg, gx, base + 17, c, { 'font-size': p.cats.length > 3 ? 13 : 15, fill: C.text });
      p.series.forEach((s, j) => {
        const x = gx + (j - (ns - 1) / 2) * (bw + 6), v = s.v[i], y = Y(v), cl = SW_COL(s.k);
        el('rect', { x: x - bw / 2, y, width: bw, height: base - y, rx: 4, fill: cl, 'fill-opacity': .55, stroke: cl, 'stroke-width': 2 }, A.svg);
        tx(A.svg, x, y - 11, s.f ? s.f(v) : String(v), { 'font-size': 14, fill: C.text });
      });
    });
    if (ns > 1) p.series.forEach((s, j) => {
      const x = x0 + j * 150, cl = SW_COL(s.k);
      el('rect', { x, y: 8, width: 16, height: 16, rx: 3, fill: cl, 'fill-opacity': .55, stroke: cl, 'stroke-width': 2 }, A.svg);
      tx(A.svg, x + 24, 16, s.t, { 'font-size': 14, fill: C.text, 'text-anchor': 'start' });
    });
  }
  const SW_COL = k => ({ L: C.blue, Y: C.yellow, N: C.green, R: C.red, G: C.gold, T: C.teal, P: C.pink, M: C.muted })[k] || k || C.blue;
  SW.PIC.chart = chart;

  /* ---------- the side panel: the step's question and its controls ---------- */
  function fbSet(kind, cue) {
    const f = $('fb'); f.className = 'fb ' + kind;
    f.innerHTML = '<span class="mark">' + (kind === 'ok' ? '✓' : kind === 'bad' ? '✗' : '👁') + '</span><span>' + cue + '</span>';
  }
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  function chipH(it) {
    const [nm, , cls] = LV[it.lvl];
    return '<div class="lvl ' + cls + '">Part ' + LET[it.part] + ' of ' + it.of + ' · ' + nm + '<span class="lo">' + it.code + '</span></div>' +
      (it.prev || []).map((p, k) => '<div class="prev"><span class="pl">' + LET[k] + '</span>' + esc(p.ask) + ' <b>' + esc(p.a) + '</b></div>').join('');
  }
  function mkBtn(cls, html, on) { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.innerHTML = html; b.addEventListener('click', on); return b; }
  function renderPanel(fin) {
    const { box, it, A } = CUR, r = A.resp, S = stepsOf(it), i = fin ? S.length - 1 : r.step || 0, st = S[i];
    $('q').textContent = 'Step ' + (i + 1) + ' of ' + S.length + ' · ' + STEPN[st];
    const pr = $('prompt'); pr.style.fontSize = '';
    pr.innerHTML = chipH(it) + '<div class="story">' + (st === 'facts' ? 'Read the scenario. Tap the sentences and rows with the <b>key facts</b> for this part, then press Check.'
      : st === 'idea' ? 'Which <b>science idea</b> do you need for this part?' : st === 'assume' ? 'What can we safely <b>assume</b>?'
      : st === 'explain' ? 'Which is the <b>best written answer</b> to: ' + esc(it.read.ask) : '<b>' + esc(it.read.ask) + '</b>') + '</div>';
    box.innerHTML = '';
    if (st === 'facts') {
      const n = (r.sel || []).length;
      box.appendChild(mkBtn('btn primary factsBtn', 'Check key facts' + (n ? ' (' + n + ')' : ''), onFacts));
      return;
    }
    const step = st === 'answer' ? it : it.read[st], row = document.createElement('div');
    row.className = 'choices ' + (st === 'explain' ? 'one expl' : 'two');
    step.opts.forEach(o => {
      const b = mkBtn('choice', esc(o.t), () => onPick(st, o.v, b)); b.dataset.v = o.v; b.setAttribute('aria-label', o.t);
      if (st === 'answer' && (r.tried || []).includes(o.v)) { b.classList.add('bad'); b.disabled = true; }
      const mine = st === 'explain' ? r.explain : r.v;
      if (fin && o.v === 'a') b.classList.add('ok');
      if (fin && o.v === mine && o.v !== 'a') b.classList.add('bad');
      row.appendChild(b);
    });
    box.appendChild(row);
  }
  function advance() { const r = CUR.A.resp; r.step = (r.step || 0) + 1; r.wrong = null; renderPanel(); CUR.A.redraw(); }
  function onFacts() {
    const { it, A } = CUR, r = A.resp; if (A.locked) return;
    const res = MODEL.checkFacts(it, r.sel); r.factsTry = (r.factsTry || 0) + 1;
    if (res.ok) { r.facts = 'ok'; r.flag = null; fbSet('ok', res.cue); return advance(); }
    if (r.factsTry < 2) { r.flag = res.extra; fbSet('bad', res.cue + ' · try again'); return A.redraw(); }
    r.facts = 'shown'; r.flag = null; r.miss = (r.miss || 0) + 1;
    r.sel = it.read.p.map((c, k) => c.k === 'must' ? k : -1).filter(k => k >= 0);
    fbSet('bad', 'The key facts are in green'); advance();
  }
  // The shell checks the part once. On a part with a Best explanation step the answer's tries are kept here.
  const finish = () => $('bCheck').click();
  function onPick(st, v, b) {
    const { it, A } = CUR, r = A.resp; if (A.locked) return;
    if (st === 'answer' && !it.read.explain) {
      r.v = v; r.done = true;
      if (!MODEL.check(it, r).ok) { r.tried = (r.tried || []).concat(v); b.classList.add('bad'); b.disabled = true; }
      return finish();
    }
    if (st === 'answer') {
      if (v === 'a') { r.v = 'a'; fbSet('ok', 'Yes · now pick the best written answer'); return advance(); }
      r.tried = (r.tried || []).concat(v); b.classList.add('bad'); b.disabled = true;
      if (r.tried.length < 2) { r.wrong = v; fbSet('bad', MODEL.check(it, { v }).cue + ' · try again'); return A.redraw(); }
      r.v = v; r.done = true; r.local = true; return finish();
    }
    if (st === 'explain') { r.explain = v; r.done = true; r.local = true; return finish(); }
    const res = MODEL.checkPick(it.read[st], v); r[st] = v;
    if (!res.ok) r.miss = (r.miss || 0) + 1;
    fbSet(res.ok ? 'ok' : 'bad', res.ok ? 'Yes' : res.cue);
    advance();
  }

  /* ---------- the stage: the reading (tappable on Key facts) and the step tracker ---------- */
  const RH = 28;
  function reading(A, it, V) {
    const r = V.resp || {}, S = stepsOf(it), fin = done(V), cur = fin ? S.length : r.step || 0, top = 420 - S.length * RH - 8;
    const factsDone = fin || cur > 0, tapping = !fin && cur === 0;
    const fo = el('foreignObject', { x: 8, y: 4, width: 624, height: top - 12 }, A.svg), div = document.createElementNS(XH, 'div');
    const P = it.read.p, len = P.reduce((a, c) => a + (c.t || c.cells.join('   ')).length, 0) + it.read.ask.length + P.filter(c => c.cells).length * 30;
    const fs = len > 720 ? 14 : len > 620 ? 14.5 : len > 520 ? 15 : 16;
    div.setAttribute('class', 'scn'); div.setAttribute('style', 'font: ' + fs + 'px/1.42 "Segoe UI Variable Text","Segoe UI",system-ui,sans-serif; color:' + C.text + '; padding: 2px 6px; user-select: none;');
    const sel = new Set(r.sel || []), flag = new Set(r.flag || []);
    const look = (c, k) => {
      const on = sel.has(k);
      if (factsDone) return c.k === 'must' ? 'background: rgba(131,193,103,.22); box-shadow: inset 0 -2px ' + C.green + ';' : on ? 'background: rgba(247,217,111,.14);' : 'color: ' + C.muted + ';';
      if (flag.has(k)) return 'background: rgba(252,98,85,.25); box-shadow: inset 0 -2px ' + C.red + ';';
      if (on) return 'background: rgba(247,217,111,.25); box-shadow: inset 0 -2px ' + C.yellow + ';';
      return '';
    };
    const tappable = (node, k) => {
      if (!tapping) return;
      node.style.cursor = 'pointer'; node.setAttribute('role', 'button'); node.setAttribute('tabindex', '0'); node.setAttribute('aria-pressed', sel.has(k) ? 'true' : 'false');
      const tog = () => { if (A.locked) return; const nx = new Set(r.sel || []); nx.has(k) ? nx.delete(k) : nx.add(k); r.sel = [...nx]; r.flag = (r.flag || []).filter(x => x !== k); renderPanel(); A.redraw(); };
      node.addEventListener('click', tog);
      node.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); tog(); } });
    };
    let para = null, table = null;
    P.forEach((c, k) => {
      if (c.cells) {
        para = null;
        if (c.head) {
          table = document.createElementNS(XH, 'table');
          table.setAttribute('style', 'border-collapse: separate; border-spacing: 0 3px; margin: 4px 0 6px; font-size: ' + (fs - .5) + 'px;');
          const hr = document.createElementNS(XH, 'tr');
          c.head.forEach((h, j) => { const th = document.createElementNS(XH, 'th'); th.textContent = h; th.setAttribute('style', 'padding: 1px 12px; color: ' + C.blue + '; font-weight: 650; text-align: ' + (j ? 'center' : 'left') + ';'); hr.appendChild(th); });
          table.appendChild(hr); div.appendChild(table);
        }
        const tr = document.createElementNS(XH, 'tr');
        tr.setAttribute('style', look(c, k));
        c.cells.forEach((v, j) => { const td = document.createElementNS(XH, 'td'); td.textContent = v; td.setAttribute('style', 'padding: 1px 12px; border-radius: 4px; text-align: ' + (j ? 'center' : 'left') + ';' + (j ? '' : 'white-space: nowrap;')); tr.appendChild(td); });
        tappable(tr, k); table.appendChild(tr);
        return;
      }
      if (!para) { para = document.createElementNS(XH, 'div'); para.setAttribute('style', 'margin: 0 0 2px;'); div.appendChild(para); }
      const s = document.createElementNS(XH, 'span');
      s.textContent = c.t; s.setAttribute('style', 'padding: 1px 2px; border-radius: 4px; box-decoration-break: clone; -webkit-box-decoration-break: clone;' + look(c, k));
      tappable(s, k); para.appendChild(s); para.appendChild(document.createTextNode(' '));
    });
    const q = document.createElementNS(XH, 'div');
    q.textContent = LET[it.part] + ') ' + it.read.ask;
    q.setAttribute('style', 'margin-top: 6px; font-weight: 700; color: ' + C.blue + ';'); div.appendChild(q);
    fo.appendChild(div);
    // shrink to fit above the tracker (a part with five steps has less room)
    const H = top - 12;
    for (let f = fs; div.scrollHeight > H && f > 13; f -= .5) {
      div.style.fontSize = (f - .5) + 'px'; div.style.lineHeight = f < 15 ? '1.36' : '1.42';
      if (table) div.querySelectorAll('table').forEach(t => { t.style.fontSize = (f - 1) + 'px'; });
    }
    // the tracker
    el('line', { x1: 14, x2: 626, y1: top - 6, y2: top - 6, stroke: C.edge, 'stroke-width': 1.5 }, A.svg);
    const lc = LV[it.lvl][1], pickText = (step, v) => (step.opts.find(o => o.v === v) || {}).t || '';
    S.forEach((st, i) => {
      const y = top + i * RH + RH / 2, now = i === cur && !fin, past = i < cur || fin, c = now ? C.yellow : past ? lc : C.edge;
      el('circle', { cx: 26, cy: y, r: 11, fill: past ? c : 'none', stroke: c, 'stroke-width': now ? 3 : 1.5 }, A.svg);
      tx(A.svg, 26, y + 1, String(i + 1), { 'font-size': 13, 'font-weight': 700, fill: past ? C.stage : c, style: 'stroke:none' });
      tx(A.svg, 46, y, STEPN[st], { 'font-size': 14, 'font-weight': 650, fill: now ? C.yellow : past ? C.gold : C.muted, 'text-anchor': 'start' });
      let v = '', vc = C.text;
      const wrongNow = st === 'answer' && (r.wrong || V.phase === 'wrong');
      if (now) { v = wrongNow ? '✗ ' + pickText(it, r.wrong || r.v) + ': try again' : '← ' + HINT[st]; vc = wrongNow ? '#ff9a90' : C.yellow; }
      else if (past && st === 'facts') { v = r.facts === 'shown' ? '✗ shown in green' : '✓ ' + ((n) => n + ' key fact' + (n === 1 ? '' : 's') + ' found')(P.filter(c => c.k === 'must').length); vc = r.facts === 'shown' ? '#ff9a90' : C.green; if (fin && !r.facts) { v = 'key facts in green'; vc = C.green; } }
      else if (past && st === 'explain') { const okk = r.explain === 'a'; v = r.explain == null ? '✓ see the green answer' : okk ? '✓ complete: claim, evidence, reason' : '✗ ' + it.read.explain.errs[+String(r.explain).slice(1)].cue; vc = okk || r.explain == null ? C.green : '#ff9a90'; }
      else if (past && st !== 'answer') { const step = it.read[st], okk = r[st] === 'a'; v = (r[st] == null ? '' : okk ? '✓ ' : '✗ ') + step.a; vc = okk || r[st] == null ? C.green : '#ff9a90'; }
      else if (past) { v = '✓ ' + it.a; vc = C.green; }
      if (v) tx(A.svg, 236, y, v, { 'font-size': Math.min(15, 390 / Math.max(1, v.length * .5)), fill: vc, 'text-anchor': 'start' });
    });
  }

  function readDraw(A, it, V) {
    const r = V.resp || {};
    if (done(V) && CUR && CUR.it === it && !r.fin) { r.fin = true; renderPanel(true); }
    if (!done(V) || r.view === 'read') reading(A, it, V); else SW.draw(A, Object.assign({}, it, { lvl: it.lvl === 'ap' ? 2 : 3 }), V);
    if (!done(V)) return;
    const g = el('g', { style: 'cursor:pointer', role: 'button', tabindex: '0', 'aria-label': r.view === 'read' ? 'Show the picture' : 'Show the reading' }, A.svg);
    const tog = () => { r.view = r.view === 'read' ? '' : 'read'; A.redraw(); };
    S.chip(g, 572, 20, r.view === 'read' ? '🖼 Picture' : '📄 Reading', C.blue, { fs: 14 });
    g.addEventListener('click', tog);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); tog(); } });
  }

  /* ---------- a tab. o: { id, code, name, notes, start(rem) -> [part items], link } ---------- */
  function tab(o) {
    return {
      id: o.id, code: o.code, name: o.name, sec: 1, notes: o.notes, kind: 'custom',
      get tries() { return CUR && CUR.it.read.explain && CUR.A.resp.local ? 1 : 2; },
      q: () => '', typeOf: it => it.t, prompt: it => chipH(it), link: o.link,
      // n: the item's place in the round. The next part of the scenario in progress, or part a of a new one that
      // fits in what is left of the round (never leaving one item over).
      gen(n) {
        const R = RUN[o.id];
        if (n && R && R.next < R.parts.length) return R.parts[R.next];
        return o.start(n == null ? 10 : 10 - n)[0];
      },
      panel(box, it, A) { RUN[o.id] = { parts: it.all, next: it.part + 1 }; CUR = { box, it, A }; A.resp.step = 0; renderPanel(); },
      ready: (r, it) => r.done || r.shown ? '' : HINT[stepsOf(it)[r.step || 0]],
      check: (it, r) => MODEL.check(it, r), answer: () => ({ v: 'a', done: true }), draw: readDraw
    };
  }
  return { tab, chart, stepsOf, RUN };
})();
/* ===== SCIENCE SCENARIOS KIT END ===== */
