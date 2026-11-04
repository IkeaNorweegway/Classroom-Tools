<script>
window.EXTRA = ok => {
  const M = MODEL, q = Q.q;
  ok(M.checkPerfect({ k: 7, n: 49, form: 'root', v: 7 }, { v: q(-7) }).code === 'negroot', 'perfect: negative root named');
  ok(M.checkPerfect({ k: 6, n: 36, form: 'root', v: 6 }, { v: q(18) }).code === 'half', 'perfect: half named');
  ok(M.checkPerfect({ k: 5, n: 25, form: 'neg', v: -5 }, { v: q(5) }).code === 'outside', 'perfect: − outside named');
  ok(M.checkBetween({ n: 40, lo: 6, hi: 7 }, { a: q(36), b: q(49) }).code === 'squares', 'between: squares instead of roots named');
  ok(M.checkEst({ n: 40, lo: 6, hi: 7, x: Math.sqrt(40) }, { v: Q.parse('6.3') }).ok, 'estimate: 6.3 accepted for √40');
  ok(M.checkEst({ n: 40, lo: 6, hi: 7, x: Math.sqrt(40) }, { v: Q.parse('6.6') }).code === 'high', 'estimate: too high named with its square');
  ok(M.checkEst({ n: 40, lo: 6, hi: 7, x: Math.sqrt(40) }, { v: Q.parse('20') }).code === 'half', 'estimate: half named');
  let badR = 0;
  for (let i = 0; i < 600; i++) {
    const it = M.genRat(), truth = it.kind === 'int' ? M.isSq(it.n) : it.kind === 'frac' ? M.isSq(it.a) && M.isSq(it.b) : Math.abs(it.x * 10 - Math.round(it.x * 10)) < 1e-9;
    if (it.rat !== truth) badR++;
  }
  ok(badR === 0, 'rational?: every item classified right (600)');
  ok(M.checkHyp({ a: 6, b: 8, c: 10 }, { v: q(14) }).code === 'sides', 'hypotenuse: adding the sides named');
  ok(M.checkHyp({ a: 6, b: 8, c: 10 }, { v: q(100) }).code === 'noroot', 'hypotenuse: no root named');
  ok(M.checkHyp({ a: 2, b: 3, c: Math.sqrt(13) }, { v: Q.parse('3.6') }).ok, 'hypotenuse: √13 ≈ 3.6 accepted');
  ok(M.checkLeg({ c: 10, a: 6, b: 8 }, { v: Q.parse('11.7') }).code === 'add', 'leg: adding the squares named');
  ok(M.checkFD({ kind: 'frac', p: 2, q: 3, v: q(2, 3) }, { v: q(2, 9) }).code === 'top', 'fractions: rooted the top only named');
  ok(M.checkFD({ kind: 'dec', k: 3, d: 0.09, v: q(3, 10) }, { v: Q.parse('0.03') }).code === 'place', 'decimals: 0.03 for √0.09 named');
  ok(document.querySelectorAll('.tab').length === 7, 'seven tabs');
};
</script>
