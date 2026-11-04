<script>
window.EXTRA = ok => {
  const M = MODEL, q = Q.q, R = p => M.toResp(p);
  let it = { ts: [{ c: 3, e: 1 }, { c: -5, e: 0 }, { c: 4, e: 2 }], kind: 'degree' };
  ok(M.checkParts(it, { n: q(1) }).code === 'first', 'parts: degree from the first term named');
  ok(M.checkParts(it, { n: q(4) }).code === 'coef', 'parts: coefficient given as degree named');
  it.kind = 'lead'; ok(M.checkParts(it, { n: q(3) }).code === 'first', 'parts: leading coefficient from first term named');
  it.kind = 'constant'; ok(M.checkParts(it, { n: q(5) }).code === 'sign', 'parts: constant sign named');
  it.kind = 'terms'; ok(M.checkParts(it, { n: q(3) }).ok, 'parts: 3 terms accepted');
  it = { groups: [[{ c: 3, e: 2 }, { c: 2, e: 1 }, { c: -1, e: 2 }, { c: 4, e: 0 }]], p: [4, 2, 2, 0] };
  ok(M.checkCollect(it, R([4, 0, 4, 0])).code === 'unlike', 'like terms: x² and x combined named');
  ok(M.checkCollect(it, R([4, 2, 4, 0])).code === 'sign', 'like terms: red tile counted positive named');
  it = { groups: [[{ c: 3, e: 2 }, { c: 2, e: 1 }], [{ c: 1, e: 2 }, { c: -4, e: 1 }, { c: 1, e: 0 }]], p: [-1, 6, 2, 0] };
  ok(M.checkSub(it, R([1, -2, 4, 0])).code === 'added', 'subtract: added instead named');
  ok(M.checkSub(it, R([1, -2, 2, 0])).code === 'firstneg', 'subtract: first term only flipped named');
  it = { m: { c: 2, e: 1 }, P: [{ c: 3, e: 1 }, { c: -4, e: 0 }], p: [0, -8, 6, 0] };
  ok(M.checkMono(it, R([-4, 0, 6, 0])).code === 'firstonly', 'mono: first term only named');
  ok(M.checkMono(it, R([0, -2, 0, 0])).code === 'xx', 'mono: x times x = x named');
  it = { p: 1, s: 1, a: 3, b: 2, r: [6, 5, 1, 0] };
  ok(M.checkBin(it, R([6, 0, 1, 0])).code === 'middle', 'binomial: middle term dropped named');
  ok(M.checkBin(it, R([6, 2, 1, 0])).code === 'onemid', 'binomial: one x box only named');
  ok(M.checkBin(it, R([-6, 5, 1, 0])).code === 'sign', 'binomial: sign named');
  // tile counts stay small enough to fit
  let maxT = 0; for (let i = 0; i < 300; i++) { [M.genLike(), M.genAdd(), M.genSub()].forEach(x => { maxT = Math.max(maxT, x.groups.flat().reduce((s, t) => s + Math.abs(t.c), 0)); }); }
  ok(maxT <= 24, 'tile scenes use at most 24 tiles (max ' + maxT + ')');
  ok(document.querySelectorAll('.tab').length === 6, 'six tabs');
};
</script>
