/* ===== SCIENCE KIT START (Science 7 narrow trainers only; needs DRILL) =====
   Icon + label + arrow pictures, not drawings of real objects (see the icon-flowchart rule in _sims-context.md).
     S.emo(p, x, y, icon, size, a)          an emoji icon
     S.lines(p, x, y, text, n, a)           text wrapped at n characters, centred on (x, y)
     S.card(p, o)                           an icon card {x, y, w, h, icon, label, col, fill, size, fs, n, cls}
     S.arrow(p, x1, y1, x2, y2, col, key)   a straight arrow; key = marker colour letter (Y yellow, N green, R red, …)
     S.curve(p, d, col, key)                an arrow along an SVG path
     S.sorter(A, it, V, cats, o)            the sorting picture: the item card on top, one bin per choice below;
                                            after the answer an arrow drops the card into its bin, and each bin shows
                                            what it means. cats: [{v, label, means, glyph(g, x, y)}]
     S.classTab(o)                          a whole tap-to-sort tab from a bank (S.sortGen, S.sortCheck) */
const S = (() => {
  const { C, el, tx } = DRILL;
  const done = V => V.phase === 'right' || V.phase === 'show';
  function emo(p, x, y, ch, size, a) { return tx(p, x, y, ch, Object.assign({ 'font-size': size || 48 }, a, { class: 'emo' + (a && a.class ? ' ' + a.class : '') })); }
  function wrap(s, n) {
    const out = []; let line = '';
    String(s).split(' ').forEach(w => { if (line && (line + ' ' + w).length > n) { out.push(line); line = w; } else line = line ? line + ' ' + w : w; });
    if (line) out.push(line); return out;
  }
  function lines(p, x, y, s, n, a) {
    const L = wrap(s, n || 22), fs = (a && a['font-size']) || 18, lh = fs * 1.22, g = el('g', { class: a && a.gcls || null }, p);
    L.forEach((l, i) => tx(g, x, y + (i - (L.length - 1) / 2) * lh, l, Object.assign({}, a, { gcls: null })));
    return g;
  }
  // Label lines sit at the bottom (o.lb padding); the icon is centred in the space above them.
  function card(p, o) {
    const g = el('g', { class: o.cls || null }, p), w = o.w || 150, h = o.h || 130, hasL = o.label != null && o.label !== '';
    el('rect', { x: o.x - w / 2, y: o.y - h / 2, width: w, height: h, rx: 16, fill: o.fill || C.panel, stroke: o.col || C.edge, 'stroke-width': o.sw || 2.5 }, g);
    const fs = o.fs || 17, n = o.n || Math.round(w / 9.5), L = hasL ? wrap(o.label, n).length : 0, lh = fs * 1.22;
    const labTop = hasL ? o.y + h / 2 - (o.lb || 12) - L * lh : o.y + h / 2, top = o.y - h / 2;
    if (o.icon) emo(g, o.x, (top + labTop) / 2 + 2, o.icon, Math.min(o.size || 999, (labTop - top) * .78, w * .6));
    if (hasL) lines(g, o.x, labTop + L * lh / 2, o.label, n, { 'font-size': fs, fill: o.tcol || C.text });
    return g;
  }
  function arrow(p, x1, y1, x2, y2, col, key, a) {
    return el('line', Object.assign({ x1, y1, x2, y2, stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round', 'marker-end': 'url(#a' + (key || 'W') + ')' }, a), p);
  }
  function curve(p, d, col, key, a) {
    return el('path', Object.assign({ d, stroke: col, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'marker-end': 'url(#a' + (key || 'W') + ')' }, a), p);
  }
  // A small pill label with a dark backing, for notes on a picture.
  function chip(p, x, y, s, col, a) {
    const g = el('g', { class: a && a.cls || null }, p), fs = (a && a.fs) || 16, w = String(s).length * fs * .56 + 22;
    el('rect', { x: x - w / 2, y: y - fs * .9, width: w, height: fs * 1.8, rx: fs * .9, fill: C.stage, stroke: col, 'stroke-width': 2 }, g);
    tx(g, x, y, s, { 'font-size': fs, fill: col });
    return g;
  }

  function sorter(A, it, V, cats, o) {
    o = o || {};
    const n = cats.length, by = o.by || 335, bh = o.bh || 118, gap = 14, bw = Math.min(190, (600 - gap * (n - 1)) / n);
    const span = n * bw + (n - 1) * gap, bx = i => 320 - span / 2 + bw / 2 + i * (bw + gap);
    const fin = done(V), ai = cats.findIndex(c => c.v === it.a), pi = cats.findIndex(c => c.v === (V.resp && V.resp.v));
    cats.forEach((c, i) => {
      const x = bx(i), good = fin && i === ai, bad = fin && i === pi && pi !== ai, g = el('g', {}, A.svg);
      el('rect', { x: x - bw / 2, y: by - bh / 2, width: bw, height: bh, rx: 16, fill: good ? '#13301c' : bad ? '#331417' : C.panel, stroke: good ? C.green : bad ? C.red : C.edge, 'stroke-width': good || bad ? 3 : 2, 'stroke-dasharray': good || bad ? null : '7 6' }, g);
      const lab = lines(g, x, fin && c.means ? by - bh / 2 + 26 : by, c.label, Math.round(bw / 10.5), { 'font-size': n > 3 ? 17 : 19, fill: good ? C.green : bad ? '#ff9a90' : C.text });
      if (fin && c.means) lines(g, x, by + 22, c.means, Math.round(bw / 8.5), { 'font-size': 14.5, fill: good ? C.text : C.muted, gcls: 'fade' });
      if (fin && good && c.glyph) c.glyph(g, x, by + bh / 2 + 4);
    });
    const cw = o.cw || 320, ch = o.ch || 156, cy = o.cy || 108;
    card(A.svg, { x: 320, y: cy, w: cw, h: ch, icon: it.i, label: it.t, size: o.size || 64, fs: o.fs || 21, n: o.n || 26, col: fin ? (pi === ai || V.phase === 'show' && pi < 0 ? C.green : C.edge) : C.yellow, sw: 3, lb: 16 });
    if (fin && it.why) chip(A.svg, 320, cy + ch / 2 + 24, it.why, C.green, { cls: 'pop', fs: 15 });
    if (!fin) return;
    const y0 = cy + ch / 2 + (it.why ? 44 : 8), y1 = by - bh / 2 - 8;
    if (pi >= 0 && pi !== ai) arrow(A.svg, 320 + (bx(pi) - 320) * .25, y0, bx(pi), y1, C.red, 'R', { 'stroke-dasharray': '6 6', 'stroke-width': 3, class: 'fade' });
    arrow(A.svg, 320 + (bx(ai) - 320) * .25, y0, bx(ai), y1, C.green, 'N', { class: 'draw', pathLength: 1 });
  }

  // Bank items: {t: label, i: icon, a: answer, why?: note shown after, cue?: own cue}. No DOM.
  // Each answer comes up equally often, whatever the bank sizes.
  const sortGen = bank => { const a = Q.pick([...new Set(bank.map(b => b.a))]); return Object.assign({}, Q.pick(bank.filter(b => b.a === a))); };
  const sortCheck = (it, r, cues) => r.v === it.a ? { ok: true } : { code: 'is-' + it.a, cue: it.cue || (cues && cues[it.a]) || 'Not quite' };

  // A tap-to-sort tab. o: {id, code, name, sec, q, cats, bank, cues, cols, pic} — the bank and cues come from MODEL.
  function classTab(o) {
    return {
      id: o.id, code: o.code, name: o.name, sec: o.sec, q: o.q, kind: 'choice', cols: o.cols,
      typeOf: it => it.t,  // a missed item comes back more often
      gen: () => sortGen(o.bank),
      choices: () => o.cats.map(c => ({ v: c.v, label: c.label })),
      check: (it, r) => sortCheck(it, r, o.cues), answer: it => ({ v: it.a }),
      draw(A, it, V) { sorter(A, it, V, o.cats, o.pic); }
    };
  }
  return { emo, wrap, lines, card, arrow, curve, chip, sorter, classTab, sortGen, sortCheck, done };
})();
/* ===== SCIENCE KIT END ===== */

