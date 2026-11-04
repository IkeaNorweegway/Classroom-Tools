/* ===== SOCIAL KIT START (Social 9 narrow trainers only; needs DRILL and the science kit S) =====
   Three more tab types, all tap choices (one try):
     S.orderTab(o)  "Which came first?" Two dated event cards; after the answer a timeline places both.
                    o: {id, code, name, sec, bank: [{t, i, y, yl}]}  y = a sortable number (1939.67), yl = the label shown
     S.pickTab(o)   One card and o.n term choices (default 3) drawn from a longer term list, so the choices change.
                    The bins show what each term means after the answer.
                    o: {id, code, name, sec, q, terms: {v: {label, means, cue}}, bank: [{t, i, a, why?}], pic?}
     S.chainTab(o)  A chain (or a loop) of steps with one blank: pick the missing step from three.
                    o: {id, code, name, sec, q, steps: [{t, i}], loop?} */
(() => {
  const { C, el, tx } = DRILL, done = S.done;

  /* ---- Which came first? ---- */
  function orderTab(o) {
    const B = o.bank;
    return {
      id: o.id, code: o.code, name: o.name, sec: o.sec, q: o.q || 'Which came first?', kind: 'choice', order: B,
      typeOf: it => B[it.first].t,
      gen() {
        let a, b;
        do { a = Q.rnd(0, B.length - 1); b = Q.rnd(0, B.length - 1); } while (a === b || B[a].y === B[b].y);
        const first = B[a].y < B[b].y ? a : b, left = Q.chance(.5) ? a : b, right = left === a ? b : a;
        return { L: left, R: right, first, a: first === left ? 'L' : 'R' };
      },
      choices: it => [{ v: 'L', label: B[it.L].t }, { v: 'R', label: B[it.R].t }],
      check: (it, r) => r.v === it.a ? { ok: true }
        : { code: 'order', cue: B[it.first].yl + ' comes before ' + B[it.first === it.L ? it.R : it.L].yl },
      answer: it => ({ v: it.a }),
      draw(A, it, V) {
        const fin = done(V), cards = [[it.L, 165], [it.R, 475]];
        cards.forEach(([k, x]) => {
          const good = fin && k === it.first;
          S.card(A.svg, { x, y: 130, w: 270, h: 190, icon: B[k].i, label: B[k].t, size: 64, fs: 19, n: 24, lb: 16, col: good ? C.green : fin ? C.edge : C.text, sw: good ? 3.5 : 2.5 });
        });
        if (!fin) { A.tx(A.svg, 320, 130, '?', { 'font-size': 44, fill: C.yellow }); return; }
        // The timeline: both years placed to scale, a little padding either side.
        const y1 = B[it.first].y, y2 = B[it.first === it.L ? it.R : it.L].y, pad = Math.max((y2 - y1) * .25, Math.min(2, (y2 - y1) * 1.2));
        const lo = y1 - pad, hi = y2 + pad, X = y => 70 + (y - lo) / (hi - lo) * 500, ly = 330;
        S.arrow(A.svg, 50, ly, 600, ly, C.muted, 'M', { 'stroke-width': 3, class: 'fade' });
        A.tx(A.svg, 608, ly + 26, 'time', { 'font-size': 14, fill: C.muted, 'text-anchor': 'end', class: 'fade' });
        const close = Math.abs(X(y2) - X(y1)) < 170;  // same month: stack the later label lower
        cards.forEach(([k, x]) => {
          const px = X(B[k].y), good = k === it.first;
          el('line', { x1: x, y1: 228, x2: px, y2: ly - 10, stroke: good ? C.green : C.muted, 'stroke-width': 2, 'stroke-dasharray': '5 6', class: 'fade' }, A.svg);
          el('circle', { cx: px, cy: ly, r: 9, fill: good ? C.green : C.muted, class: 'pop' }, A.svg);
          A.tx(A.svg, px + (close ? (good ? -40 : 40) : 0), ly + (close && !good ? 58 : 32), B[k].yl, { 'font-size': 19, fill: good ? C.green : C.text, class: 'fade' });
        });
        S.chip(A.svg, X(y1), ly - 42, '1st', C.green, { cls: 'pop', fs: 15 });
      }
    };
  }

  /* ---- Pick the term ---- */
  function pickTab(o) {
    const T = o.terms, keys = Object.keys(T), n = o.n || 3;
    const cues = {}; keys.forEach(k => { cues[k] = T[k].cue || 'This is ' + T[k].label.toLowerCase(); });
    return {
      id: o.id, code: o.code, name: o.name, sec: o.sec, q: o.q, kind: 'choice', cols: o.cols, pick: true,
      typeOf: it => it.t,
      gen() {
        const it = S.sortGen(o.bank), others = Q.shuffle(keys.filter(k => k !== it.a)).slice(0, n - 1);
        it.opts = Q.shuffle([it.a].concat(others));
        return it;
      },
      choices: it => it.opts.map(v => ({ v, label: T[v].label })),
      check: (it, r) => S.sortCheck(it, r, cues), answer: it => ({ v: it.a }),
      draw(A, it, V) { S.sorter(A, it, V, it.opts.map(v => ({ v, label: T[v].label, means: T[v].means })), o.pic); }
    };
  }

  /* ---- Missing step in a chain or loop ---- */
  function chainPos(n, loop) {
    if (loop) return Array.from({ length: n }, (_, k) => { const a = -Math.PI / 2 + k * 2 * Math.PI / n; return [320 + 225 * Math.cos(a), 200 + 135 * Math.sin(a)]; });
    if (n <= 4) { const w = 150, gap = (600 - n * w) / Math.max(1, n - 1), x0 = 20 + w / 2; return Array.from({ length: n }, (_, k) => [x0 + k * (w + gap), 205]); }
    const top = Math.ceil(n / 2), bot = n - top, step = 560 / top, out = [];
    for (let k = 0; k < top; k++) out.push([50 + step / 2 + k * step, 110]);
    for (let k = 0; k < bot; k++) out.push([50 + step / 2 + (top - 1 - k) * step - (top === bot ? 0 : step / 2), 305]);
    return out;
  }
  function chainTab(o) {
    const St = o.steps, n = St.length;
    return {
      id: o.id, code: o.code, name: o.name, sec: o.sec, q: o.q || 'The missing step', kind: 'choice',
      typeOf: it => 'k' + it.k,
      gen() {
        const k = Q.rnd(0, n - 1), others = Q.shuffle(St.map((_, j) => j).filter(j => j !== k)).slice(0, 2);
        return { k, opts: Q.shuffle([k].concat(others)), a: String(k) };
      },
      choices: it => it.opts.map(j => ({ v: String(j), label: St[j].t })),
      check: (it, r) => {
        if (r.v === it.a) return { ok: true };
        const j = +r.v, d = j - it.k;
        if (!o.loop && d > 0) return { code: 'later', cue: 'That step comes later' };
        if (!o.loop && d < 0) return { code: 'earlier', cue: 'That step came earlier' };
        return { code: 'loop', cue: 'Follow the arrows round' };
      },
      answer: it => ({ v: it.a }),
      draw(A, it, V) {
        const fin = done(V), P = chainPos(n, o.loop), w = o.loop ? 160 : n <= 4 ? 150 : Math.min(150, 560 / Math.ceil(n / 2) - 22), h = o.loop ? 92 : 120;
        const edge = (a, b) => {
          const [x1, y1] = P[a], [x2, y2] = P[b], dx = x2 - x1, dy = y2 - y1;
          // Leave from the card edge, not the centre.
          const cut = (ddx, ddy) => { const sx = Math.abs(ddx) > 1e-6 ? (w / 2 + 6) / Math.abs(ddx) : 1e9, sy = Math.abs(ddy) > 1e-6 ? (h / 2 + 6) / Math.abs(ddy) : 1e9; return Math.min(sx, sy); };
          const c = cut(dx, dy);
          S.arrow(A.svg, x1 + dx * c, y1 + dy * c, x2 - dx * c, y2 - dy * c, C.muted, 'M', { 'stroke-width': 3 });
        };
        for (let k = 0; k < n - 1; k++) edge(k, k + 1);
        if (o.loop) edge(n - 1, 0);
        St.forEach((s, k) => {
          const blank = k === it.k, [x, y] = P[k];
          if (blank && !fin) {
            el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 16, fill: '#262110', stroke: C.yellow, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, A.svg);
            A.tx(A.svg, x, y, '?', { 'font-size': 40, fill: C.yellow });
          } else S.card(A.svg, { x, y, w, h, icon: s.i, label: s.t, size: 34, fs: 14.5, n: Math.round(w / 8.4), lb: 8, col: blank ? C.green : C.edge, sw: blank ? 3.5 : 2, cls: blank ? 'pop' : null });
          if (!o.loop) A.tx(A.svg, x - w / 2 + 14, y - h / 2 + 14, String(k + 1), { 'font-size': 13, fill: blank ? (fin ? C.green : C.yellow) : C.muted });
        });
        if (o.loop && o.hub) A.tx(A.svg, 320, 200, o.hub, { 'font-size': 16, fill: C.muted });
      }
    };
  }

  Object.assign(S, { orderTab, pickTab, chainTab });
})();
/* ===== SOCIAL KIT END ===== */
