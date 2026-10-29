/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { q, eq, val, rnd, pick, chance, gcd } = Q;
  const isSq = n => Number.isInteger(Math.sqrt(n));
  const one = x => Math.round(x * 10) / 10;
  const near = (g, x, tol) => g != null && Math.abs(val(g) - x) <= tol + 1e-9;

  /* SR1 perfect squares */
  function genPerfect() { const k = rnd(2, 20), form = pick(['root', 'root', 'root', 'neg']); return { k, n: k * k, form, v: form === 'neg' ? -k : k }; }
  function checkPerfect(it, r) {
    const g = r.v;
    if (eq(g, it.v)) return { ok: true };
    if (it.form === 'root' && eq(g, -it.k)) return { code: 'negroot', cue: '√ means the positive root' };
    if (it.form === 'neg' && eq(g, it.k)) return { code: 'outside', cue: 'The − is outside: −(' + it.k + ')' };
    if (eq(g, it.n / 2) || eq(g, -it.n / 2)) return { code: 'half', cue: '√ is not half' };
    if (eq(g, it.n) || eq(g, it.n * it.n)) return { code: 'square', cue: 'Which number times itself?' };
    return { code: 'other', cue: 'Which number times itself?' };
  }

  /* SR2 between which whole numbers? */
  function genBetween() { let n; do { n = rnd(2, 400); } while (isSq(n)); const lo = Math.floor(Math.sqrt(n)); return { n, lo, hi: lo + 1 }; }
  function checkBetween(it, r) {
    if (eq(r.a, it.lo) && eq(r.b, it.hi)) return { ok: true };
    if (eq(r.a, it.lo * it.lo) && eq(r.b, it.hi * it.hi)) return { code: 'squares', cue: 'Those are squares: take their roots' };
    if (eq(r.a, it.hi) && eq(r.b, it.lo)) return { code: 'swap', cue: 'Smaller number on the left' };
    return { code: 'other', cue: 'Find squares just below and above ' + it.n };
  }

  /* SR2 estimate to one decimal */
  function genEst() { let n; do { n = rnd(2, 150); } while (isSq(n)); const lo = Math.floor(Math.sqrt(n)); return { n, lo, hi: lo + 1, x: Math.sqrt(n) }; }
  function checkEst(it, r) {
    const g = r.v;
    if (near(g, it.x, .1)) return { ok: true };
    const gv = val(g);
    if (Math.abs(gv - it.n / 2) < .05) return { code: 'half', cue: '√ is not half' };
    if (gv < it.lo || gv > it.hi) return { code: 'range', cue: 'It’s between ' + it.lo + ' and ' + it.hi };
    const sq = Math.round(gv * gv * 100) / 100;
    return { code: gv > it.x ? 'high' : 'low', cue: String(gv) + '² = ' + sq + ': too ' + (gv > it.x ? 'high' : 'low') };
  }

  /* SR2/SR4 rational or irrational? */
  function genRat() {
    const kind = pick(['int', 'int', 'frac', 'dec']);
    if (kind === 'int') { const sq = chance(.5); let n; do { n = rnd(2, 200); } while (isSq(n) !== sq); return { kind, n, rat: sq, x: Math.sqrt(n) }; }
    if (kind === 'frac') { const a = chance(.6) ? Math.pow(rnd(1, 9), 2) : rnd(2, 30), b = chance(.7) ? Math.pow(rnd(2, 10), 2) : rnd(2, 30); if (gcd(a, b) !== 1 || a === b) return genRat(); return { kind, a, b, rat: isSq(a) && isSq(b), x: Math.sqrt(a / b) }; }
    // Perfect: (k/10)² such as 0.09, 0.49, 1.44. Not perfect: 0.9 looks like 9 but is 90 hundredths.
    if (chance(.5)) { const k = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15]); return { kind, d: k * k / 100, rat: true, x: k / 10 }; }
    const d = pick([0.1, 0.4, 0.9, 0.2, 0.5, 1.6, 2.5, 0.8, 3.6, 0.03]);
    return { kind, d, rat: false, x: Math.sqrt(d) };
  }
  function checkRat(it, r) {
    if ((r.v === 'rat') === it.rat) return { ok: true };
    if (it.rat) return { code: 'saidirr', cue: it.kind === 'frac' ? 'Top and bottom are perfect squares' : 'A perfect square: the root ends' };
    return { code: 'saidrat', cue: 'Not a perfect square: never ends' };
  }

  /* SR3 Pythagorean theorem */
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [12, 16, 20], [9, 40, 41], [20, 21, 29]];
  function genHyp() {
    if (chance(.5)) { const t = pick(TRIPLES); return chance(.5) ? { a: t[0], b: t[1], c: t[2] } : { a: t[1], b: t[0], c: t[2] }; }
    const a = rnd(2, 12), b = rnd(2, 12); return { a, b, c: Math.sqrt(a * a + b * b) };
  }
  const ans1 = x => Number.isInteger(Math.round(x * 1e9) / 1e9) ? String(Math.round(x)) : one(x).toFixed(1);
  function checkHyp(it, r) {
    const g = r.v, c2 = it.a * it.a + it.b * it.b;
    if (near(g, it.c, .05)) return { ok: true };
    if (near(g, it.a + it.b, .01)) return { code: 'sides', cue: 'Add the squares, not the sides' };
    if (near(g, c2, .01)) return { code: 'noroot', cue: 'That’s c². Take the square root' };
    if (near(g, Math.sqrt(Math.abs(it.a * it.a - it.b * it.b)), .05)) return { code: 'sub', cue: 'Hypotenuse: add the squares' };
    return { code: 'other', cue: 'c² = a² + b²' };
  }
  function genLeg() {
    if (chance(.5)) { const t = pick(TRIPLES), s = chance(.5); return { c: t[2], a: s ? t[0] : t[1], b: s ? t[1] : t[0] }; }
    const c = rnd(6, 20), a = rnd(2, c - 1); return { c, a, b: Math.sqrt(c * c - a * a) };
  }
  function checkLeg(it, r) {
    const g = r.v;
    if (near(g, it.b, .05)) return { ok: true };
    if (near(g, Math.sqrt(it.c * it.c + it.a * it.a), .05)) return { code: 'add', cue: 'Leg: c² minus a²' };
    if (near(g, it.c - it.a, .01)) return { code: 'sides', cue: 'Subtract the squares, not the sides' };
    if (near(g, it.c * it.c - it.a * it.a, .01)) return { code: 'noroot', cue: 'That’s b². Take the square root' };
    return { code: 'other', cue: 'b² = c² − a²' };
  }

  /* SR4 square roots of fractions and decimals */
  function genFD() {
    if (chance(.5)) { for (;;) { const p = rnd(1, 9), qq = rnd(2, 10); if (gcd(p, qq) !== 1) continue; return { kind: 'frac', p, q: qq, v: q(p, qq) }; } }
    const k = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15]); return { kind: 'dec', k, d: k * k / 100, v: q(k, 10) };
  }
  function checkFD(it, r) {
    const g = r.v;
    if (eq(g, it.v)) return { ok: true };
    if (it.kind === 'frac') {
      if (eq(g, q(it.p, it.q * it.q))) return { code: 'top', cue: 'Root the bottom too' };
      if (eq(g, q(it.p * it.p, it.q))) return { code: 'bottom', cue: 'Root the top too' };
      return { code: 'other', cue: 'Root the top, root the bottom' };
    }
    if (eq(g, q(it.k, 100)) || eq(g, q(it.k, 1000))) return { code: 'place', cue: (it.k / 10) + ' × ' + (it.k / 10) + ' = ' + it.d };
    if (Math.abs(val(g) - it.d / 2) < 1e-9) return { code: 'half', cue: '√ is not half' };
    return { code: 'other', cue: 'Which decimal times itself?' };
  }

  return { isSq, ans1, genPerfect, checkPerfect, genBetween, checkBetween, genEst, checkEst, genRat, checkRat, genHyp, checkHyp, genLeg, checkLeg, genFD, checkFD };
})();
/* ===================== MODEL END ===================== */

