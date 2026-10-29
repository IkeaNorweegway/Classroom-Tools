/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { q, of, add, sub, mul, div, neg, eq, val, gcd, lcm, rnd, pick, nz, chance } = Q;
  const terminates = d => { while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; };
  const decStr = v => { const s = (Math.round(val(v) * 1000) / 1000).toString(); return s.replace('-', '−'); };
  const absQ = v => q(Math.abs(v.n), v.d);

  /* RN1 compare two rational numbers written in different forms */
  function rat() { const d = pick([2, 3, 4, 5, 6, 8, 10]); return q(nz(-3 * d + 1, 3 * d - 1), d); }
  function form(v, avoid) {
    const opts = ['frac'];
    if (v.d > 1 && terminates(v.d)) opts.push('dec', 'dec');
    if (v.n < 0 && v.d > 1) opts.push('negden', 'negnum');
    let f; do { f = pick(opts); } while (f === avoid && opts.length > 1);
    return f;
  }
  function genCmp() {
    const a = rat(); let b;
    if (chance(.22)) b = a;
    else { let k = 0; do { b = rat(); k++; } while ((eq(a, b) || (chance(.6) && val(a) * val(b) <= 0)) && k < 40); }
    const fa = form(a), fb = form(b, eq(a, b) ? fa : null);
    const ans = val(a) < val(b) ? '<' : val(a) > val(b) ? '>' : '=';
    return { a, b, fa, fb, ans };
  }
  function checkCmp(it, r) {
    if (r.v === it.ans) return { ok: true };
    if (it.ans === '=') return { code: 'same', cue: 'Same number, written two ways' };
    const absAns = val(absQ(it.a)) < val(absQ(it.b)) ? '<' : val(absQ(it.a)) > val(absQ(it.b)) ? '>' : '=';
    if (r.v === absAns && val(it.a) < 0) return { code: 'abs', cue: 'Negatives: farther left is smaller' };
    return { code: 'other', cue: 'Picture both on the number line' };
  }

  /* RN2 add or subtract fractions (common denominator) */
  function genAddF() {
    for (;;) {
      const b = pick([2, 3, 4, 5, 6, 8, 10, 12]), d = pick([2, 3, 4, 5, 6, 8]); if (b === d) continue;
      const L = lcm(b, d); if (L > 24) continue;
      const a = nz(-2 * b + 1, 2 * b - 1), c = nz(-d + 1, 2 * d - 1); if (gcd(a, b) !== 1 || gcd(c, d) !== 1) continue;
      const op = pick(['+', '−']), x = q(a, b), y = q(c, d), v = op === '+' ? add(x, y) : sub(x, y);
      if (Math.abs(val(v)) > 3) continue;
      return { a, b, c, d, op, L, v };
    }
  }
  function checkAddF(it, r) {
    const g = r.v, s = it.op === '+' ? 1 : -1;
    if (eq(g, it.v)) return { ok: true };
    if (eq(g, q(it.a + s * it.c, it.b + it.d))) return { code: 'adddenoms', cue: 'Common denominator first' };
    if (eq(g, q(it.a + s * it.c, it.L))) return { code: 'rename', cue: 'Rename the tops too' };
    if (eq(g, neg(it.v)) || eq(g, it.op === '+' ? sub(q(it.a, it.b), q(it.c, it.d)) : add(q(it.a, it.b), q(it.c, it.d)))) return { code: 'sign', cue: 'Check the signs' };
    return { code: 'other', cue: 'Rename both over ' + it.L };
  }

  /* RN2 signs: decimals and integers with negatives */
  function genSigns() {
    const a = q(nz(-95, 95), 10), b = q(nz(-95, 95), 10), op = pick(['+', '−', '−']);
    return { a, b, op, v: op === '+' ? add(a, b) : sub(a, b) };
  }
  function checkSigns(it, r) {
    const g = r.v;
    if (eq(g, it.v)) return { ok: true };
    if (it.op === '−' && val(it.b) < 0 && eq(g, sub(it.a, absQ(it.b)))) return { code: 'minusneg', cue: 'Minus a negative: add' };
    if (eq(g, neg(it.v))) return { code: 'sign', cue: 'Right size, wrong sign' };
    if (eq(g, add(absQ(it.a), absQ(it.b))) || eq(g, neg(add(absQ(it.a), absQ(it.b))))) return { code: 'abs', cue: 'Opposite directions: they cancel' };
    return { code: 'other', cue: 'Start at the first, then move' };
  }

  /* RN3 multiply, RN4 divide (proper fractions with signs) */
  function signedFrac(maxD) { for (;;) { const d = rnd(2, maxD), n = rnd(1, d - 1); if (gcd(n, d) === 1) return q(chance(.5) ? -n : n, d); } }
  function genMul() { const x = signedFrac(9), y = signedFrac(9); return { x, y, v: mul(x, y) }; }
  function checkMul(it, r) {
    const g = r.v, { x, y } = it;
    if (eq(g, it.v)) return { ok: true };
    if (eq(g, neg(it.v))) return { code: 'sign', cue: val(it.v) > 0 ? 'Same signs: positive' : 'Different signs: negative' };
    if (eq(g, q(x.n * y.d, x.d * y.n)) || eq(g, neg(q(x.n * y.d, x.d * y.n)))) return { code: 'cross', cue: 'Top × top, bottom × bottom' };
    if (eq(g, add(x, y)) || eq(g, q(x.n + y.n, x.d + y.d))) return { code: 'added', cue: 'Multiply, don’t add' };
    return { code: 'other', cue: 'Multiply across, then the sign' };
  }
  function genDiv() {
    for (;;) {
      const x = signedFrac(9), y = signedFrac(8), v = div(x, y);
      if (Math.abs(val(v)) > 6) continue;
      return { x, y, v };
    }
  }
  function checkDiv(it, r) {
    const g = r.v, { x, y } = it;
    if (eq(g, it.v)) return { ok: true };
    if (eq(g, neg(it.v))) return { code: 'sign', cue: val(it.v) > 0 ? 'Same signs: positive' : 'Different signs: negative' };
    if (eq(g, mul(x, y)) || eq(g, neg(mul(x, y)))) return { code: 'noflip', cue: 'Flip the second, then multiply' };
    if (eq(g, mul(div(1, x), y)) || eq(g, neg(mul(div(1, x), y)))) return { code: 'flipfirst', cue: 'Flip the second one, not the first' };
    return { code: 'other', cue: 'Multiply by the reciprocal' };
  }

  /* RN4 bigger or smaller? n ÷ f or n × f */
  function genBig() {
    for (;;) {
      const n = rnd(2, 12), op = pick(['÷', '÷', '×']), small = chance(.65);
      const d = rnd(2, 6), p = small ? rnd(1, d - 1) : rnd(d + 1, 2 * d); if (gcd(p, d) !== 1) continue;
      const f = q(p, d), v = op === '÷' ? div(n, f) : mul(n, f);
      return { n, op, f, v, ans: val(v) > n ? 'bigger' : 'smaller' };
    }
  }
  function checkBig(it, r) {
    if (r.v === it.ans) return { ok: true };
    const lt1 = val(it.f) < 1;
    return { code: 'pick', cue: it.op === '÷' ? (lt1 ? '÷ by less than 1: more fit' : '÷ by more than 1: fewer fit') : (lt1 ? '× by less than 1: a part' : '× by more than 1: more') };
  }

  /* RN5 order of operations: pick the first step */
  // Tokens: {t:'n', v}, {t:'op', o}, {t:'('}, {t:')'}, {t:'^'} (squared).
  const N = v => ({ t: 'n', v: of(v) }), O = o => ({ t: 'op', o }), LP = { t: '(' }, RP = { t: ')' }, SQ = { t: '^' };
  function operand() { return chance(.75) ? q(nz(-9, 9)) : pick([q(1, 2), q(-1, 2), q(3, 2), q(1, 4), q(-3, 4)]); }
  const TEMPL = [
    () => [N(operand()), O('+'), N(operand()), O('×'), N(operand())],
    () => [LP, N(operand()), O('+'), N(operand()), RP, O('×'), N(operand())],
    () => [N(operand()), O('−'), N(operand()), O('÷'), N(q(pick([2, -2, 4])))],
    () => [N(operand()), O('÷'), N(q(pick([2, -2, 3]))), O('×'), N(operand())],
    () => [N(operand()), O('−'), N(operand()), O('+'), N(operand())],
    () => [N(operand()), O('×'), LP, N(operand()), O('−'), N(operand()), RP],
    () => [N(operand()), O('+'), N(q(nz(-5, 5))), SQ],
    () => [N(operand()), O('×'), N(q(nz(-4, 4))), SQ, O('−'), N(operand())],
    () => [N(operand()), O('+'), N(operand()), O('×'), N(operand()), O('−'), N(operand())],
    () => [N(operand()), O('×'), N(operand()), O('−'), N(operand()), O('÷'), N(q(pick([2, -2])))]
  ];
  const RANK = { '^': 3, '×': 2, '÷': 2, '+': 1, '−': 1 };
  function firstOp(ts) {
    let s = 0, e = ts.length - 1;
    for (let i = 0; i < ts.length; i++) if (ts[i].t === '(') { let j = i + 1; while (ts[j].t !== ')' && ts[j].t !== '(') j++; if (ts[j].t === ')') { s = i + 1; e = j - 1; break; } }
    let best = -1, br = 0;
    for (let i = s; i <= e; i++) { const t = ts[i]; const r = t.t === '^' ? 3 : t.t === 'op' ? RANK[t.o] : 0; if (r > br) { br = r; best = i; } }
    return best;
  }
  function apply(ts, i) {
    const t = ts[i]; let out;
    if (t.t === '^') { const v = ts[i - 1].v; out = ts.slice(0, i - 1).concat([N(mul(v, v))], ts.slice(i + 1)); }
    else {
      const a = ts[i - 1].v, b = ts[i + 1].v, v = t.o === '+' ? add(a, b) : t.o === '−' ? sub(a, b) : t.o === '×' ? mul(a, b) : div(a, b);
      out = ts.slice(0, i - 1).concat([N(v)], ts.slice(i + 2));
    }
    // drop brackets around a single number
    for (let k = 0; k + 2 < out.length; k++) if (out[k].t === '(' && out[k + 1].t === 'n' && out[k + 2].t === ')') { out.splice(k, 3, out[k + 1]); }
    return out;
  }
  function genOrder() {
    for (;;) {
      const ts = pick(TEMPL)();
      if (ts.some((t, i) => t.t === 'op' && t.o === '÷' && val(ts[i + 1].v) === 0)) continue;
      const opts = [];
      ts.forEach((t, i) => { if ((t.t === 'op' && ts[i - 1].t === 'n' && ts[i + 1].t === 'n') || (t.t === '^' && ts[i - 1].t === 'n')) opts.push(i); });
      if (opts.length < 2) continue;
      const steps = [ts]; let cur = ts, ok = true;
      while (cur.length > 1) { const k = firstOp(cur); if (k < 0) { ok = false; break; } const nx = apply(cur, k); if (nx.some(t => t.t === 'n' && !isFinite(val(t.v)))) { ok = false; break; } steps.push(nx); cur = nx; }
      if (!ok || Math.abs(val(cur[0].v)) > 200 || cur[0].v.d > 16) continue;
      return { ts, opts, ans: String(firstOp(ts)), steps, v: cur[0].v };
    }
  }
  function checkOrder(it, r) {
    if (r.v === it.ans) return { ok: true };
    const right = it.ts[+it.ans], picked = it.ts[+r.v];
    const inBr = it.ts.slice(0, +it.ans).filter(t => t.t === '(').length > it.ts.slice(0, +it.ans).filter(t => t.t === ')').length;
    if (inBr) return { code: 'brackets', cue: 'Brackets first' };
    if (right.t === '^') return { code: 'exp', cue: 'Exponent before × ÷ + −' };
    const rr = RANK[right.o], rp = picked.t === '^' ? 3 : RANK[picked.o];
    if (rr > rp) return { code: 'rank', cue: '× and ÷ before + and −' };
    return { code: 'ltr', cue: 'Same level: left to right' };
  }

  return { terminates, decStr, genCmp, checkCmp, genAddF, checkAddF, genSigns, checkSigns, genMul, checkMul, genDiv, checkDiv, genBig, checkBig, genOrder, checkOrder, firstOp, apply };
})();
/* ===================== MODEL END ===================== */

