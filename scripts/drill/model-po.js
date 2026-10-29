/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { q, eq, rnd, pick, nz, chance, shuffle } = Q;
  // A polynomial is an array of coefficients [c0, c1, c2, c3]. A written expression is a list of terms {c, e}.
  const Z = () => [0, 0, 0, 0];
  const fromTerms = ts => ts.reduce((p, t) => { p[t.e] += t.c; return p; }, Z());
  const addP = (a, b) => a.map((v, i) => v + b[i]);
  const subP = (a, b) => a.map((v, i) => v - b[i]);
  const sameP = (a, r) => [0, 1, 2, 3].every(i => eq(r['c' + i] || q(0), a[i]));
  const toResp = p => ({ c0: q(p[0]), c1: q(p[1]), c2: q(p[2]), c3: q(p[3]) });
  const degree = ts => Math.max(...ts.map(t => t.e));
  // n distinct exponents from 0..maxE, coefficients nz in [-k, k]
  function terms(n, maxE, k, mustTop) {
    const es = shuffle([0, 1, 2, 3].slice(0, maxE + 1)).slice(0, n);
    if (mustTop && !es.includes(maxE)) es[0] = maxE;
    return es.sort((a, b) => b - a).map(e => ({ c: nz(-k, k), e }));
  }
  const absSum = ts => ts.reduce((p, t) => { p[t.e] += Math.abs(t.c); return p; }, Z());

  /* PO1 parts: degree, number of terms, constant, leading coefficient, a coefficient */
  function genParts() {
    const D = rnd(1, 3), n = rnd(Math.min(2, D + 1), Math.min(4, D + 1));
    let ts = terms(n, D, 9, true);
    const kind = pick(['degree', 'degree', 'terms', 'constant', 'lead', 'lead', 'coef']);
    if (kind === 'constant' && !ts.some(t => t.e === 0)) ts[ts.length - 1] = { c: nz(-9, 9), e: 0 };
    if (chance(.4) && ts.length > 1) { const s = ts.slice(1).concat(ts[0]); ts = s; }   // highest term not written first
    const it = { ts, kind };
    if (kind === 'coef') { const withX = ts.filter(t => t.e > 0); it.k = pick(withX).e; }
    return it;
  }
  function partsAnswer(it) {
    const ts = it.ts, top = ts.reduce((a, t) => t.e > a.e ? t : a);
    return { degree: top.e, terms: ts.length, constant: (ts.find(t => t.e === 0) || { c: 0 }).c, lead: top.c, coef: it.k ? ts.find(t => t.e === it.k).c : null }[it.kind];
  }
  function checkParts(it, r) {
    const want = partsAnswer(it), v = r.n, ts = it.ts, top = ts.reduce((a, t) => t.e > a.e ? t : a);
    if (eq(v, want)) return { ok: true };
    if (it.kind === 'degree') {
      if (ts[0].e !== top.e && eq(v, ts[0].e)) return { code: 'first', cue: 'Highest exponent, not the first' };
      if (eq(v, top.c)) return { code: 'coef', cue: 'Degree is the exponent' };
      if (eq(v, ts.length)) return { code: 'count', cue: 'Degree is an exponent, not a count' };
      return { code: 'other', cue: 'Find the highest exponent' };
    }
    if (it.kind === 'terms') {
      if (eq(v, top.e)) return { code: 'degree', cue: 'Count terms, not the exponent' };
      return { code: 'other', cue: 'Count the pieces between + and −' };
    }
    if (it.kind === 'constant') {
      if (eq(v, -want)) return { code: 'sign', cue: 'Keep its sign' };
      return { code: 'other', cue: 'The term with no x' };
    }
    if (it.kind === 'lead') {
      if (ts[0].e !== top.e && eq(v, ts[0].c)) return { code: 'first', cue: 'Leading = highest degree term' };
      if (eq(v, -want)) return { code: 'sign', cue: 'Keep its sign' };
      if (eq(v, top.e)) return { code: 'degree', cue: 'That is the degree. Coefficient?' };
      return { code: 'other', cue: 'Number on the highest degree term' };
    }
    if (eq(v, -want)) return { code: 'sign', cue: 'Keep its sign' };
    if (eq(v, it.k)) return { code: 'exp', cue: 'The number in front, not the exponent' };
    return { code: 'other', cue: 'The number in front of that x' };
  }

  /* PO2 like terms (one expression) and PO3 add (two brackets). Degree 2 at most; small numbers for tiles. */
  function genLike() {
    for (;;) {
      const n = rnd(4, 6), ts = [];
      for (let i = 0; i < n; i++) ts.push({ c: nz(-4, 4), e: pick([0, 1, 2]) });
      const es = new Set(ts.map(t => t.e)); if (es.size < 2) continue;
      if (![0, 1, 2].some(e => ts.filter(t => t.e === e).length > 1)) continue;   // needs at least one pair to collect
      const p = fromTerms(ts); if (p.every(v => v === 0)) continue;
      return { groups: [ts], p };
    }
  }
  function genAdd() {
    for (;;) {
      const a = terms(rnd(2, 3), 2, 4), b = terms(rnd(2, 3), 2, 4);
      const p = addP(fromTerms(a), fromTerms(b)); if (p.every(v => v === 0)) continue;
      return { groups: [a, b], p };
    }
  }
  function checkCollect(it, r) {
    if (sameP(it.p, r)) return { ok: true };
    const g = [0, 1, 2].map(i => Q.val(r['c' + i] || q(0))), p = it.p;
    const ab = absSum(it.groups.flat());
    if ([0, 1, 2].every(i => g[i] === p[i] || g[i] === ab[i])) return { code: 'sign', cue: 'Red tiles are negative' };
    if ((p[1] !== 0 && g[2] === p[2] + p[1]) || (p[0] !== 0 && g[1] === p[1] + p[0]) || (p[1] + p[0] !== 0 && g[2] === p[2] + p[1] + p[0])) return { code: 'unlike', cue: 'Only the same shape combines' };
    if ([0, 1, 2].every(i => Math.abs(g[i]) === Math.abs(p[i]))) return { code: 'sign', cue: 'Check each sign' };
    return { code: 'other', cue: 'Group same shapes, cancel pairs' };
  }

  /* PO4 subtract: (A) − (B) */
  function genSub() {
    for (;;) {
      const a = terms(rnd(2, 3), 2, 4), b = terms(rnd(2, 3), 2, 4);
      if (b.length < 2) continue;
      const p = subP(fromTerms(a), fromTerms(b)); if (p.every(v => v === 0)) continue;
      return { groups: [a, b], p, sub: true };
    }
  }
  function checkSub(it, r) {
    if (sameP(it.p, r)) return { ok: true };
    const A = fromTerms(it.groups[0]), B = it.groups[1];
    if (sameP(addP(A, fromTerms(B)), r)) return { code: 'added', cue: 'The minus flips every term' };
    const firstOnly = addP(A, fromTerms([{ c: -B[0].c, e: B[0].e }].concat(B.slice(1))));
    if (sameP(firstOnly, r)) return { code: 'firstneg', cue: 'Flip every term, not just the first' };
    return { code: 'other', cue: 'Flip the second, then collect' };
  }

  /* PO5 monomial × polynomial */
  function genMono() {
    for (;;) {
      const m = { c: nz(-5, 5), e: pick([0, 1, 1]) };
      if (m.e === 0 && Math.abs(m.c) === 1) continue;
      const P = terms(rnd(2, 3), pick([1, 2, 2]), 6, true);
      const p = Z(); P.forEach(t => { p[t.e + m.e] += m.c * t.c; });
      return { m, P, p };
    }
  }
  function checkMono(it, r) {
    if (sameP(it.p, r)) return { ok: true };
    const m = it.m, P = it.P;
    if (m.e > 0) { const noAdd = Z(); P.forEach(t => { noAdd[Math.max(t.e, m.e)] += m.c * t.c; }); if (sameP(noAdd, r)) return { code: 'xx', cue: 'x · x = x², exponents add' }; }
    const first = Z(); first[P[0].e + m.e] += m.c * P[0].c; P.slice(1).forEach(t => { first[t.e] += t.c; });
    if (sameP(first, r)) return { code: 'firstonly', cue: 'Multiply every term inside' };
    if ([0, 1, 2, 3].every(i => Math.abs(Q.val(r['c' + i] || q(0))) === Math.abs(it.p[i]))) return { code: 'sign', cue: 'Check signs: − × − = +' };
    return { code: 'other', cue: 'Each box: side × side' };
  }

  /* PO6 binomial × binomial: (p·x + a)(s·x + b) */
  function genBin() { const p = pick([1, 1, 1, 2, 3]), s = pick([1, 1, 2]), a = nz(-6, 6), b = nz(-6, 6); return { p, s, a, b, r: [a * b, p * b + a * s, p * s, 0] }; }
  function checkBin(it, r) {
    if (sameP(it.r, r)) return { ok: true };
    const g = [0, 1, 2].map(i => Q.val(r['c' + i] || q(0))), R = it.r;
    if (g[2] === R[2] && g[0] === R[0] && g[1] === 0) return { code: 'middle', cue: 'Four boxes: keep the middle' };
    if (g[2] === R[2] && g[0] === R[0] && (g[1] === it.p * it.b || g[1] === it.a * it.s)) return { code: 'onemid', cue: 'Add both x boxes' };
    if ([0, 1, 2].every(i => Math.abs(g[i]) === Math.abs(R[i]))) return { code: 'sign', cue: 'Check signs: − × − = +' };
    return { code: 'other', cue: 'Fill all four boxes, then add' };
  }

  return { fromTerms, addP, subP, sameP, toResp, degree, genParts, partsAnswer, checkParts, genLike, genAdd, checkCollect, genSub, checkSub, genMono, checkMono, genBin, checkBin };
})();
/* ===================== MODEL END ===================== */

