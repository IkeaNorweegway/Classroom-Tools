<script>
window.EXTRA = ok => {
  const M = MODEL, q = Q.q;
  ok(M.checkBase({ a: 3, n: 4, form: 'neg', v: -81 }, { v: q(81) }).code === 'base', 'base: −3⁴ read as (−3)⁴ named');
  ok(M.checkBase({ a: 3, n: 4, form: 'paren', v: 81 }, { v: q(12) }).code === 'mult', 'base: 3 × 4 named');
  ok(M.checkBase({ a: 2, n: 3, form: 'paren', v: -8 }, { v: q(8) }).code === 'pairs', 'base: odd count of negatives named');
  ok(M.checkZero({ a: 7, form: 'plain', v: 1 }, { v: q(0) }).code === 'zero', 'zero: 7⁰ = 0 named');
  ok(M.checkZero({ a: 7, form: 'neg', v: -1 }, { v: q(1) }).code === 'neg', 'zero: −7⁰ = 1 named');
  const b = { s: '2', v: 2 };
  ok(M.checkProd({ b, m: 3, n: 4, e: 7 }, { b: q(4), e: q(7) }).code === 'basemul', 'multiply: base multiplied named');
  ok(M.checkProd({ b, m: 3, n: 4, e: 7 }, { b: q(2), e: q(12) }).code === 'mulexp', 'multiply: exponents multiplied named');
  ok(M.checkQuot({ b, m: 8, n: 2, e: 6 }, { b: q(2), e: q(4) }).code === 'divexp', 'divide: exponents divided named');
  ok(M.checkPow({ b, m: 3, n: 2, e: 6 }, { b: q(2), e: q(5) }).code === 'addexp', 'power of a power: added named');
  ok(M.checkProd({ b: { s: 'x', letter: true }, m: 5, n: 1, e: 6 }, { e: q(6) }).ok, 'multiply: letter base, x⁵ × x = x⁶');
  ok(M.checkBr({ k: 2, m: 3, n: 4, L: 'x', c: 16, e: 12 }, { c: q(2), e: q(12) }).code === 'coef', 'brackets: number not raised named');
  ok(M.checkBr({ k: 2, m: 3, n: 4, L: 'x', c: 16, e: 12 }, { c: q(8), e: q(12) }).code === 'coefmul', 'brackets: number × n named');
  ok(M.checkBr({ k: -3, m: 1, n: 3, L: 'x', c: -27, e: 3 }, { c: q(27), e: q(3) }).code === 'sign', 'brackets: sign named');
  ok(M.checkNeg({ form: 'int', a: 2, n: 3, v: q(1, 8) }, { v: q(-8) }).code === 'negans', 'negative: negative answer named');
  ok(M.checkNeg({ form: 'int', a: 2, n: 3, v: q(1, 8) }, { v: q(8) }).code === 'noflip', 'negative: no reciprocal named');
  ok(M.checkNeg({ form: 'int', a: 2, n: 3, v: q(1, 8) }, { v: q(-6) }).code === 'mult', 'negative: 2 × −3 named');
  ok(M.checkNeg({ form: 'frac', p: 1, d: 3, n: 2, v: q(9) }, { v: Q.parse('9') }).ok, 'negative: (1/3)⁻² = 9');
  let bad = 0; for (let i = 0; i < 400; i++) { const it = M.genNeg(); if (it.form === 'negbase' && Q.val(it.v) * (it.n % 2 ? -1 : 1) < 0) bad++; }
  ok(bad === 0, 'negative: sign of (−a)⁻ⁿ follows n');
  ok(document.querySelectorAll('.tab').length === 8, 'eight tabs');
  ok(/Section%201%20%C2%B7/.test(document.getElementById('notes').href) || /Section%20\d%20%C2%B7/.test(document.getElementById('notes').href), 'notes link uses the · separator');
};
</script>
