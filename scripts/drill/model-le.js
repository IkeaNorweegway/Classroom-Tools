/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { q, of, add, sub, mul, div, neg, eq, val, isInt, rnd, pick, nz, chance, lcm, gcd } = Q;
  const sg = n => (n < 0 ? '−' : '+') + Math.abs(n);
  const SYM = { '<': '<', '>': '>', '<=': '≤', '>=': '≥' }, FLIP = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' };

  // Balance steps for a·x + c = b·x + d: take away the smaller x term, then the number, then divide.
  function steps(a, c, b, d) {
    const out = [{ L: { x: a, k: c }, R: { x: b, k: d } }];
    let L = { x: a, k: c }, R = { x: b, k: d };
    if (b !== 0) {
      const take = b > a && a > 0 ? a : b;   // take away the smaller x term
      L = { x: L.x - take, k: L.k }; R = { x: R.x - take, k: R.k };
      out.push({ op: (take > 0 ? '−' : '+') + (Math.abs(take) === 1 ? '' : Math.abs(take)) + 'x', L, R });
    }
    const xLeft = L.x !== 0, kOff = xLeft ? L.k : R.k;
    if (kOff !== 0) {
      L = { x: L.x, k: L.k - kOff }; R = { x: R.x, k: R.k - kOff };
      out.push({ op: kOff > 0 ? '−' + kOff : '+' + (-kOff), L, R });
    }
    const coef = xLeft ? L.x : R.x;
    if (coef !== 1) {
      const v = div(xLeft ? R.k : L.k, coef);
      L = xLeft ? { x: 1, k: 0 } : { x: 0, k: v }; R = xLeft ? { x: 0, k: v } : { x: 1, k: 0 };
      out.push({ op: '÷' + (coef < 0 ? '(' + sg(coef) + ')' : coef), L, R });
    }
    return out;
  }

  /* LE1 two-step: a·x + c = d */
  function genTwo() { const a = chance(.25) ? -rnd(2, 6) : rnd(2, 6), x = nz(-9, 9), c = nz(-12, 12); return { a, c, d: a * x + c, x }; }
  function checkTwo(it, r) {
    const X = r.x;
    if (eq(X, it.x)) return { ok: true };
    if (eq(X, div(it.d + it.c, it.a))) return { code: 'inverse', cue: 'Undo ' + sg(it.c) + ' with ' + sg(-it.c) };
    if (eq(X, sub(div(it.d, it.a), it.c))) return { code: 'divone', cue: 'Undo ' + sg(it.c) + ' first' };
    if (eq(X, it.d - it.c)) return { code: 'nodiv', cue: 'Then divide by ' + (it.a < 0 ? '(' + sg(it.a) + ')' : it.a) };
    if (eq(X, -it.x)) return { code: 'sign', cue: 'Check the sign' };
    return { code: 'other', cue: 'Undo ' + sg(it.c) + ', then ÷ ' + (it.a < 0 ? '(' + sg(it.a) + ')' : it.a) };
  }

  /* LE2 expand a(p·x + c) */
  function genBr() { return { a: pick([2, 3, 4, 5, 6, -2, -3, -4, -5, -1]), p: pick([1, 1, 1, 2, 3]), c: nz(-9, 9) }; }
  function checkBr(it, r) {
    const K = it.a * it.p, C0 = it.a * it.c;
    if (eq(r.k, K) && eq(r.c0, C0)) return { ok: true };
    if (eq(r.k, K) && eq(r.c0, it.c)) return { code: 'first', cue: 'Multiply every term inside' };
    if ((eq(r.k, K) && eq(r.c0, -C0)) || (eq(r.k, -K) && eq(r.c0, C0)) || (eq(r.k, -K) && eq(r.c0, -C0))) return { code: 'sign', cue: it.a < 0 ? 'Negative × negative = positive' : 'Check the signs' };
    if (eq(r.c0, C0) && eq(r.k, it.p)) return { code: 'xterm', cue: 'Multiply the x term too' };
    return { code: 'other', cue: (it.a < 0 ? '(' + sg(it.a) + ')' : it.a) + ' × each term inside' };
  }

  /* LE2 x on both sides: a·x + c = b·x + d */
  function genBoth() {
    for (;;) {
      const a = rnd(2, 9), b = rnd(1, 8); if (a === b) continue;
      const x = nz(-8, 8), c = nz(-10, 10), d = a * x + c - b * x;
      if (Math.abs(d) > 40 || d === 0) continue;
      return { a, b, c, d, x };
    }
  }
  function checkBoth(it, r) {
    const X = r.x;
    if (eq(X, it.x)) return { ok: true };
    const small = Math.min(it.a, it.b);
    if (eq(X, div(it.d - it.c, it.a + it.b))) return { code: 'addx', cue: 'Subtract ' + (small === 1 ? '' : small) + 'x from both sides' };
    if (eq(X, -it.x)) return { code: 'sign', cue: 'Check the sign' };
    if (eq(X, div(it.d + it.c, it.a - it.b))) return { code: 'inverse', cue: 'Undo ' + sg(it.c) + ' with ' + sg(-it.c) };
    return { code: 'other', cue: 'x terms to one side first' };
  }

  /* LE3 clear fractions: A·x + K = R, at least one a fraction. Answer: the whole-number equation. */
  function genFrac() {
    for (;;) {
      const p = pick([2, 3, 4, 5, 6]), qq = pick([2, 3, 4, 6, 8]), a = pick([1, 1, 2, 3, 5]);
      if (gcd(a, p) !== 1) continue;
      const mode = pick(['kfrac', 'kfrac', 'rfrac']);
      let K, R;
      if (mode === 'kfrac') { const c = nz(-7, 7); if (gcd(c, qq) !== 1) continue; K = q(c, qq); R = q(nz(-6, 6)); }
      else { const c = nz(-7, 7); if (gcd(c, qq) !== 1) continue; K = q(nz(-6, 6)); R = q(c, qq); }
      const A = q(a, p), L = [A, K, R].reduce((m, f) => lcm(m, f.d), 1);
      if (L > 24 || L === p && chance(.5)) continue;
      return { A, K, R, L, mode };
    }
  }
  function checkFrac(it, r) {
    const got = [r.A, r.K, r.R], orig = [it.A, it.K, it.R];
    const k = div(got[0], orig[0]);
    const same = got.every((g, i) => eq(g, mul(orig[i], k)));
    if (same && got.every(isInt) && val(k) !== 0) return { ok: true, cue: eq(k, it.L) ? null : 'Works. Smallest is × ' + it.L };
    for (let i = 0; i < 3; i++) {
      const [j, m] = [0, 1, 2].filter(n => n !== i), kj = div(got[j], orig[j]);
      if (eq(got[i], orig[i]) && eq(got[m], mul(orig[m], kj)) && !eq(kj, 1)) return { code: 'lcd', miss: i, cue: 'Every term × ' + it.L };
    }
    if (same) return { code: 'notint', cue: 'Use × ' + it.L + ' to clear them' };
    return { code: 'other', cue: 'Multiply every term by ' + it.L };
  }

  /* LE4 does the sign flip? One step, pick < or >. */
  function genFlip() {
    const kind = pick(['divneg', 'divneg', 'mulneg', 'negone', 'divpos', 'add', 'sub']);
    const rel = pick(['<', '>', '<=', '>=']);
    let start, op, v, flip;
    if (kind === 'divneg') { const a = -rnd(2, 6); v = nz(-6, 6); start = { lhs: sg(a).replace('+', '') + 'x', rhs: a * v }; op = '÷ (' + sg(a) + ')'; flip = true; }
    else if (kind === 'mulneg') { const a = rnd(2, 5), w = nz(-5, 5); start = { lhs: '−x/' + a, rhs: w }; op = '× (−' + a + ')'; v = -a * w; flip = true; }
    else if (kind === 'negone') { const w = nz(-9, 9); start = { lhs: '−x', rhs: w }; op = pick(['× (−1)', '÷ (−1)']); v = -w; flip = true; }
    else if (kind === 'divpos') { const a = rnd(2, 6); v = -rnd(1, 6) * (chance(.8) ? 1 : -1); start = { lhs: a + 'x', rhs: a * v }; op = '÷ ' + a; flip = false; }
    else { const n = nz(-9, 9), k = nz(-9, 9); start = { lhs: 'x ' + (n < 0 ? '− ' : '+ ') + Math.abs(n), rhs: k }; op = n < 0 ? '+ ' + (-n) : '− ' + n; v = k - n; flip = false; }
    const ans = flip ? FLIP[rel] : rel;
    const dir = ans[0] === '>' ? 1 : -1, t = v + dir * rnd(1, 3);
    return { kind, rel, start, op, v, flip, ans, t };
  }
  function checkFlip(it, r) {
    if (r.v === it.ans) return { ok: true };
    if (it.flip) return { code: 'noflip', cue: (it.kind === 'mulneg' || /×/.test(it.op) ? '× by a negative: flip it' : '÷ by a negative: flip it') };
    return { code: 'flipped', cue: it.kind === 'divpos' ? '÷ by a positive: no flip' : 'Adding or subtracting never flips' };
  }
  // The value of the left side of the start line at x = t (for the test-point picture).
  function startAt(it, t) {
    const s = it.start.lhs;
    if (it.kind === 'divneg' || it.kind === 'divpos') return q(parseInt(s.replace('−', '-'), 10) * t);
    if (it.kind === 'mulneg') return q(-t, parseInt(s.split('/')[1], 10));
    if (it.kind === 'negone') return q(-t);
    const n = parseInt(s.slice(2).replace('− ', '-').replace('+ ', ''), 10); return q(t + n);
  }
  const holds = (rel, l, r) => ({ '<': l < r, '>': l > r, '<=': l <= r, '>=': l >= r }[rel]);

  /* LE4 graph an inequality: boundary, open or closed, which side. */
  function genIneq() { const b = rnd(-6, 6), rel = pick(['<', '>', '<=', '>=']), back = chance(.35); return { b, rel, back }; }
  function ineqAnswer(it) { return { at: it.b, closed: it.rel.length === 2, dir: it.rel[0] === '>' ? 'R' : 'L' }; }
  function checkIneq(it, r) {
    const A = ineqAnswer(it), atOk = r.at === A.at, dotOk = r.closed === A.closed, dirOk = r.dir === A.dir;
    if (atOk && dotOk && dirOk) return { ok: true };
    if (!atOk) return { code: 'bnd', cue: 'The dot goes on ' + (it.b < 0 ? '−' + (-it.b) : it.b) };
    if (!dirOk && dotOk) return it.back ? { code: 'readback', cue: 'Read it from x: x ' + SYM[it.rel] + ' ' + (it.b < 0 ? '−' + (-it.b) : it.b) } : { code: 'dir', cue: 'Test a point: which side works?' };
    if (!dotOk && dirOk) return { code: 'dot', cue: A.closed ? '≤ or ≥: closed dot ●' : '< or >: open dot ○' };
    return { code: 'both', cue: 'Check the dot and the side' };
  }

  return { SYM, FLIP, sg, steps, genTwo, checkTwo, genBr, checkBr, genBoth, checkBoth, genFrac, checkFrac, genFlip, checkFlip, startAt, holds, genIneq, ineqAnswer, checkIneq };
})();
/* ===================== MODEL END ===================== */

