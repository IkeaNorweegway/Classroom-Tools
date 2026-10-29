/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { q, eq, val, rnd, pick, nz, chance } = Q;
  const pow = (a, n) => { let r = 1; for (let i = 0; i < Math.abs(n); i++) r *= a; return n < 0 ? q(1, r) : q(r); };   // exact a^n for integer a
  // A base for the law tabs: a small number, a negative in brackets, or a letter.
  function base() {
    const k = rnd(0, 9);
    if (k <= 5) { const v = rnd(2, 9); return { s: String(v), v }; }
    if (k <= 7) { const v = -rnd(2, 5); return { s: '(−' + (-v) + ')', v }; }
    return { s: pick(['x', 'a', 'm', 'y']), v: null, letter: true };
  }

  /* PE1 what a power means: (−a)^n, −a^n, a^n */
  function genBase() {
    for (;;) {
      const a = rnd(2, 5), n = rnd(2, 5), form = pick(['paren', 'paren', 'neg', 'pos']);
      if (Math.pow(a, n) > 256) continue;
      const v = form === 'paren' ? Math.pow(-a, n) : form === 'neg' ? -Math.pow(a, n) : Math.pow(a, n);
      return { a, n, form, v };
    }
  }
  function checkBase(it, r) {
    const g = r.v;
    if (eq(g, it.v)) return { ok: true };
    if (eq(g, it.a * it.n) || eq(g, -it.a * it.n)) return { code: 'mult', cue: 'The exponent counts the factors' };
    if (eq(g, -it.v)) {
      if (it.form === 'neg') return { code: 'base', cue: 'No brackets: the base is ' + it.a };
      if (it.form === 'paren') return { code: 'pairs', cue: it.n % 2 ? 'Odd count: one negative left' : 'Even count: negatives pair up' };
    }
    return { code: 'other', cue: 'Write out the factors' };
  }

  /* PE2 zero exponent */
  function genZero() {
    const a = rnd(2, 60), form = pick(['plain', 'plain', 'paren', 'neg', 'times', 'sum', 'mono']);
    const it = { a, form };
    if (form === 'plain') it.v = 1;
    if (form === 'paren') it.v = 1;
    if (form === 'neg') it.v = -1;
    if (form === 'times') { it.k = rnd(2, 9); it.v = it.k; }
    if (form === 'sum') { it.b = rnd(2, 40); it.v = 2; }
    if (form === 'mono') { it.k = rnd(2, 9); it.e = rnd(2, 5); it.v = 1; }
    return it;
  }
  function checkZero(it, r) {
    const g = r.v;
    if (eq(g, it.v)) return { ok: true };
    if (eq(g, 0)) return { code: 'zero', cue: 'Anything to the 0 is 1, not 0' };
    if (eq(g, it.a)) return { code: 'base', cue: 'The 0 power is 1, not the base' };
    if (it.form === 'neg' && eq(g, 1)) return { code: 'neg', cue: 'No brackets: −(1) = −1' };
    if (it.form === 'times') return { code: 'times', cue: it.k + ' × 1 = ' + it.k };
    if (it.form === 'sum') return { code: 'sum', cue: '1 + 1' };
    return { code: 'other', cue: 'Follow the pattern down to 1' };
  }

  /* PE3 product, PE4 quotient, PE5 power of a power. Answer: base and exponent. */
  function genProd() { const b = base(), m = rnd(1, 6), n = rnd(1, 6); return { b, m, n, e: m + n }; }
  function genQuot() { const b = base(), n = rnd(1, 5), m = n + rnd(chance(.15) ? 0 : 1, 6); return { b, m, n, e: m - n }; }
  function genPow() { const b = base(), m = rnd(2, 5), n = rnd(2, 4); return { b, m, n, e: m * n }; }
  function lawCheck(kind) {
    return (it, r) => {
      const baseOk = it.b.letter || eq(r.b, it.b.v), e = r.e;
      if (baseOk && eq(e, it.e)) return { ok: true };
      if (!baseOk) {
        if (!it.b.letter && (eq(r.b, it.b.v * it.b.v) || (kind === 'quot' && eq(r.b, 1)))) return { code: 'basemul', cue: 'Same base: it stays ' + it.b.s };
        return { code: 'base', cue: 'The base stays ' + it.b.s };
      }
      if (kind === 'prod' && eq(e, it.m * it.n)) return { code: 'mulexp', cue: 'Count the factors: add' };
      if (kind === 'quot' && it.n && eq(e, q(it.m, it.n))) return { code: 'divexp', cue: 'Cancel pairs: subtract' };
      if (kind === 'quot' && eq(e, it.m + it.n)) return { code: 'addexp', cue: 'Dividing: subtract the exponents' };
      if (kind === 'pow' && eq(e, it.m + it.n)) return { code: 'addexp', cue: it.n + ' copies of ' + it.m + ' factors: multiply' };
      if (kind === 'pow' && eq(e, Math.pow(it.m, it.n))) return { code: 'powexp', cue: 'Multiply the exponents' };
      return { code: 'other', cue: kind === 'prod' ? 'Add the exponents' : kind === 'quot' ? 'Subtract the exponents' : 'Multiply the exponents' };
    };
  }

  /* PE6 power of a product: (k·x^m)^n -> c·x^e */
  function genBr() {
    for (;;) {
      const k = pick([2, 3, 4, 5, -2, -3]), m = rnd(1, 4), n = rnd(2, 4), L = pick(['x', 'a', 'y']);
      if (Math.pow(Math.abs(k), n) > 625) continue;
      return { k, m, n, L, c: Math.pow(k, n), e: m * n };
    }
  }
  function checkBr(it, r) {
    const cOk = eq(r.c, it.c), eOk = eq(r.e, it.e);
    if (cOk && eOk) return { ok: true };
    if (eOk && eq(r.c, it.k)) return { code: 'coef', cue: 'Raise the ' + Math.abs(it.k) + ' to the ' + it.n + ' too' };
    if (eOk && eq(r.c, it.k * it.n)) return { code: 'coefmul', cue: Math.abs(it.k) + '·' + Math.abs(it.k) + '·…, not ' + Math.abs(it.k) + ' × ' + it.n };
    if (eOk && eq(r.c, -it.c)) return { code: 'sign', cue: it.n % 2 ? 'Odd power of a negative: negative' : 'Even power: negatives pair up' };
    if (cOk && eq(r.e, it.m + it.n)) return { code: 'addexp', cue: 'Power of a power: multiply' };
    return { code: 'other', cue: 'Every factor inside gets the power' };
  }

  /* PE7 negative exponents */
  function genNeg() {
    const form = pick(['int', 'int', 'int', 'negbase', 'frac']);
    if (form === 'int') { for (;;) { const a = rnd(2, 10), n = rnd(1, 4); if (Math.pow(a, n) > 1000) continue; return { form, a, n, v: pow(a, -n) }; } }
    if (form === 'negbase') { const a = rnd(2, 4), n = pick([1, 2, 3]); return { form, a: -a, n, v: pow(-a, -n) }; }
    const p = rnd(1, 3), d = rnd(p + 1, 5), n = rnd(1, 3); if (Q.gcd(p, d) !== 1) return genNeg();
    return { form, p, d, n, v: q(Math.pow(d, n), Math.pow(p, n)) };
  }
  function checkNeg(it, r) {
    const g = r.v;
    if (eq(g, it.v)) return { ok: true };
    if (it.form !== 'frac') {
      const pos = pow(it.a, it.n);
      if (eq(g, Q.neg(pos))) return { code: 'negans', cue: 'Negative exponent: flip, not negative' };
      if (eq(g, it.a * -it.n) || eq(g, q(1, it.a * it.n))) return { code: 'mult', cue: '1 over ' + it.a + ' to the ' + it.n };
      if (eq(g, pos)) return { code: 'noflip', cue: 'Take the reciprocal: 1 over it' };
      if (eq(g, Q.neg(it.v))) return { code: 'sign', cue: 'Odd power of a negative: negative' };
    } else {
      if (eq(g, Q.div(1, it.v))) return { code: 'noflip', cue: 'Flip the fraction first' };
    }
    return { code: 'other', cue: 'Reciprocal, then the positive power' };
  }

  /* PE3–PE5 which law? */
  function genWhich() {
    const kind = pick(['add', 'sub', 'mul', 'none']), L = pick(['x', 'a', 'm', 'y']), n = rnd(2, kind === 'mul' ? 4 : 5), m = kind === 'sub' ? rnd(n + 1, 7) : rnd(2, 6);
    const other = { x: 'y', a: 'b', m: 'n', y: 'x' }[L];
    return { kind, L, m, n, other, form: kind === 'none' ? pick(['times', 'plus']) : null };
  }
  function checkWhich(it, r) {
    if (r.v === it.kind) return { ok: true };
    const cue = { add: 'Multiplying powers: add', sub: 'Dividing powers: subtract', mul: 'Power of a power: multiply', none: it.form === 'plus' ? 'Adding powers: no law' : 'Different bases: no law' }[it.kind];
    return { code: 'pick-' + r.v, cue };
  }

  return { pow, genBase, checkBase, genZero, checkZero, genProd, genQuot, genPow, checkProd: lawCheck('prod'), checkQuot: lawCheck('quot'), checkPow: lawCheck('pow'), genBr, checkBr, genNeg, checkNeg, genWhich, checkWhich };
})();
/* ===================== MODEL END ===================== */

