<script>
window.EXTRA = ok => {
  const M = MODEL, q = Q.q;
  const b = { type: 'bag', counts: { red: 3, blue: 5, green: 0 }, ask: 'red', n: 8, v: q(3, 8) };
  ok(M.checkProb(b, { v: q(3, 5) }).code === 'part', 'probability: part to part named');
  ok(M.checkProb(b, { v: q(5, 8) }).code === 'not', 'probability: the complement named');
  ok(M.checkNot({ form: 'dec', p: q(35, 100), v: q(65, 100) }, { v: Q.parse('0.35') }).code === 'same', 'not: same as P(A) named');
  ok(M.checkNot({ form: 'dec', p: q(35, 100), v: q(65, 100) }, { v: Q.parse('0.65') }).ok, 'not: 0.65 accepted');
  ok(M.checkExp({ p: q(1, 4), n: 80, v: 20, hits: 23 }, { v: q(60) }).code === 'rest', 'expected: counted the rest named');
  ok(M.checkExp({ p: q(1, 3), n: 40, v: 40 / 3, hits: 15 }, { v: q(13) }).ok, 'expected: 13 accepted for 13.3');
  ok(M.checkOut({ a: { n: 2 }, b: { n: 6 }, v: 12 }, { v: q(8) }).code === 'add', 'outcomes: added named');
  ok(M.checkAnd({ e1: { fav: ['H'] }, e2: { fav: ['6'] }, a: { n: 2 }, b: { n: 6 }, p1: q(1, 2), p2: q(1, 6), v: q(1, 12) }, { v: q(2, 3) }).code === 'add', 'and: added named');
  const nr = { red: 3, blue: 4, n: 7, ask: 'RR', f1: 3, f2: 2, v: q(6, 42) };
  ok(M.checkNoRep(nr, { v: q(9, 49) }).code === 'rep', 'no replacement: put back named');
  ok(M.checkNoRep(nr, { v: q(6, 49) }).code === 'total', 'no replacement: total not reduced named');
  ok(M.checkNext({ kind: 'coin', k: 5, ans: 'same' }, { v: 'lower' }).cue.indexOf('memory') >= 0, 'next one: gambler’s fallacy named');
  ok(M.checkNext({ kind: 'bagout', red: 5, blue: 4, k: 2, ans: 'lower' }, { v: 'same' }).code === 'pick', 'next one: kept out changes the bag');
  ok(document.querySelectorAll('.tab').length === 7, 'seven tabs');
};
</script>
