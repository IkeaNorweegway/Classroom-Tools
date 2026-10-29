/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { q, of, add, sub, mul, div, neg, eq, val, rnd, pick, nz, chance } = Q;
  const SLOPES = [1, 2, 3, -1, -2, -3, q(1, 2), q(-1, 2), q(2, 3), q(-2, 3), q(3, 2), q(-3, 2), q(1, 3), q(-1, 3), q(3, 4), q(-3, 4)];

  /* LR1 table -> rule. Five columns, x up by 1, sometimes starting past 0. */
  function genTable() {
    const m = nz(-4, 5), b = rnd(-6, 9), x0 = pick([0, 0, 1, 2]);
    const xs = [0, 1, 2, 3, 4].map(i => x0 + i);
    return { m, b, x0, xs, ys: xs.map(x => m * x + b) };
  }
  // Shared by "Table -> rule" and "Graph -> equation". r = {m, b} as fractions.
  function checkRule(it, r) {
    const M = of(it.m), B = of(it.b);
    if (eq(r.m, M) && eq(r.b, B)) return { ok: true };
    if (eq(r.m, B) && eq(r.b, M)) return { code: 'swap', cue: 'm = change. b = start.' };
    if (eq(r.m, M)) {
      if (it.x0 > 0 && eq(r.b, it.ys[0])) return { code: 'yval', cue: 'b is y when x = 0' };
      if (it.xint != null && eq(r.b, it.xint)) return { code: 'xaxis', cue: 'b is on the y-axis' };
      if (!eq(B, 0) && eq(r.b, neg(B))) return { code: 'bsign', cue: 'Right m. Check the sign of b.' };
      return { code: 'b', cue: 'Right m. Check b.' };
    }
    if (eq(r.m, neg(M))) return { code: 'sign', cue: val(M) < 0 ? 'Going down: m is negative' : 'Going up: m is positive' };
    if (eq(r.m, div(1, M))) return { code: 'recip', cue: 'Rise over run, not run over rise' };
    if (eq(r.b, B)) return { code: 'm', cue: 'Right b. Check m.' };
    return { code: 'other', cue: 'Find the change, then the start' };
  }

  /* LR2 slope from two points. */
  function genSlope() {
    for (;;) {
      const ax = rnd(-6, 3), ay = rnd(-5, 5), run = rnd(1, 6), rise = chance(.08) ? 0 : nz(-8, 8);
      const bx = ax + run, by = ay + rise;
      if (bx > 6 || by < -5 || by > 5) continue;
      const L = { x: ax, y: ay }, R = { x: bx, y: by };
      return chance(.5) ? { P: L, Q: R, rise, run } : { P: R, Q: L, rise, run };
    }
  }
  function checkSlope(it, r) {
    const S = q(it.rise, it.run);
    if (eq(r.m, S)) return { ok: true };
    if (it.rise !== 0 && eq(r.m, neg(S))) return { code: 'sign', cue: it.rise < 0 ? 'Down to the right: negative' : 'Up to the right: positive' };
    if (it.rise !== 0 && eq(r.m, q(it.run, it.rise))) return { code: 'recip', cue: 'Rise over run: up first' };
    if (it.rise !== 0 && it.run !== 1 && eq(r.m, q(it.rise))) return { code: 'rise', cue: 'Divide the rise by the run' };
    if (it.rise === 0) return { code: 'flat', cue: 'Flat line: rise is 0' };
    return { code: 'other', cue: 'Count the rise, then the run' };
  }

  /* LR3 equation -> graph. The student places two grid points. */
  function genGraph() {
    for (;;) {
      const m = pick(SLOPES), b = rnd(-4, 4), M = of(m);
      const p2 = { x: M.d, y: b + M.n };
      if (Math.abs(p2.y) > 6) continue;
      return { m: M, b };
    }
  }
  function onLine(it, p) { return eq(q(p.y), add(mul(it.m, p.x), it.b)); }
  function checkGraph(it, pts) {
    const [A, B] = pts;
    if (onLine(it, A) && onLine(it, B)) return { ok: true };
    if (it.b !== 0 && pts.some(p => p.y === 0 && p.x === it.b) && !pts.some(p => p.x === 0 && p.y === it.b)) return { code: 'xaxis', cue: 'b goes on the y-axis' };
    if (A.x === B.x) return { code: 'vert', cue: 'Start at b, then rise and run' };
    const s = q(B.y - A.y, B.x - A.x), bb = sub(q(A.y), mul(s, A.x));
    const hasB = eq(bb, it.b), hasM = eq(s, it.m);
    if (hasM && it.b !== 0 && eq(bb, -it.b)) return { code: 'bsign', cue: 'Right slope. Check the sign of b.' };
    if (hasM) return { code: 'b', cue: 'Right slope. Start at b.' };
    if (hasB) {
      if (eq(s, neg(it.m))) return { code: 'sign', cue: 'Right start. Up or down?' };
      if (eq(s, div(1, it.m))) return { code: 'recip', cue: 'Right start. Rise over run.' };
      return { code: 'slope', cue: 'Right start. Check the slope.' };
    }
    return { code: 'other', cue: 'Start at b, then rise and run' };
  }

  /* LR3 graph -> equation. Two grid points on the line are marked. */
  function genRead() {
    for (;;) {
      const m = pick(SLOPES), M = of(m), b = rnd(-5, 5);
      if (Math.abs(M.n) > 3 || M.d > 3) continue;
      const lat = [];
      for (let x = -7; x <= 7; x++) { const y = add(mul(M, x), b); if (y.d === 1 && Math.abs(y.n) <= 6) lat.push({ x, y: y.n }); }
      if (lat.length < 3) continue;
      let pts;
      if (chance(.5)) { const others = lat.filter(p => p.x !== 0); pts = [{ x: 0, y: b }, pick(others)]; }
      else { const others = lat.filter(p => p.x !== 0); if (others.length < 2) continue; const a = pick(others); const c = pick(others.filter(p => p.x !== a.x)); pts = [a, c]; }
      pts.sort((u, v) => u.x - v.x);
      const xi = div(-b, M);
      return { m: M, b, pts, xint: b !== 0 && xi.d === 1 && Math.abs(xi.n) <= 7 && xi.n !== b ? xi.n : null };
    }
  }

  /* LR4 direct or partial, from a graph, a table or an equation. */
  function genVary() {
    const rep = pick(['graph', 'table', 'eq']), direct = chance(.5);
    const m = pick([1, 2, 3, 4, 5, 0.5, 1.5, 2.5, -2, -3]);
    const b = direct ? 0 : pick([2, 3, 4, 5, 6, 8, 10, -4]);
    const it = { rep, direct, m, b };
    if (rep === 'table') { it.xs = pick([[0, 1, 2, 3], [1, 2, 3, 4], [2, 4, 6, 8], [1, 3, 5, 7], [2, 3, 4, 5]]); it.ys = it.xs.map(x => Math.round((m * x + b) * 100) / 100); }
    if (rep === 'eq') it.form = b === 0 ? 'mx' : pick(['mxb', 'mxb', 'bmx']);
    return it;
  }
  function checkVary(it, r) {
    if ((r.v === 'direct') === it.direct) return { ok: true };
    return it.direct ? { code: 'saidpartial', cue: 'It starts at 0: direct' } : { code: 'saiddirect', cue: 'It starts at b, not 0: partial' };
  }

  return { SLOPES, genTable, checkRule, genSlope, checkSlope, genGraph, onLine, checkGraph, genRead, genVary, checkVary };
})();
/* ===================== MODEL END ===================== */

