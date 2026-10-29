<script>
window.WRONG = (t, it) => {
  if (t.id === 'ineq') { const a = MODEL.ineqAnswer(it); return { at: a.at, closed: !a.closed, dir: a.dir }; }
  return null;
};
window.EXTRA = ok => {
  const M = MODEL, q = Q.q;
  let it = { a: 3, c: 5, d: 20, x: 5 };
  ok(M.checkTwo(it, { x: q(25, 3) }).code === 'inverse', 'two-step: wrong inverse named');
  ok(M.checkTwo(it, { x: q(20, 3).n ? Q.sub(q(20, 3), 5) : 0 }).code === 'divone', 'two-step: divided one term named');
  ok(M.checkTwo(it, { x: q(15) }).code === 'nodiv', 'two-step: forgot to divide named');
  it = { a: 3, p: 1, c: 4 };
  ok(M.checkBr(it, { k: q(3), c0: q(4) }).code === 'first', 'brackets: first term only named');
  ok(M.checkBr({ a: -2, p: 1, c: -3 }, { k: q(-2), c0: q(-6) }).code === 'sign', 'brackets: negative times negative named');
  it = { a: 5, b: 2, c: 3, d: 12, x: 3 };
  ok(M.checkBoth(it, { x: q(9, 7) }).code === 'addx', 'both sides: added the x term named');
  it = { A: q(1, 4), K: q(3, 2), R: q(5), L: 4 };
  ok(M.checkFrac(it, { A: q(1), K: q(6), R: q(5) }).code === 'lcd' && M.checkFrac(it, { A: q(1), K: q(6), R: q(5) }).miss === 2, 'fractions: whole number left out named, tile 3 marked');
  ok(M.checkFrac(it, { A: q(2), K: q(12), R: q(40) }).ok, 'fractions: any common multiple accepted');
  ok(M.checkFrac(it, { A: q(2), K: q(12), R: q(40) }).cue, 'fractions: bigger multiple gets a note');
  ok(M.checkFrac(it, { A: q(1, 2), K: q(3), R: q(10) }).code === 'notint', 'fractions: still fractions named');
  // flip: every kind, both directions, test point satisfies the start
  let badT = 0, kinds = {};
  for (let i = 0; i < 600; i++) { const f = M.genFlip(); kinds[f.kind] = 1; if (!M.holds(f.rel, Q.val(M.startAt(f, f.t)), f.start.rhs)) badT++; if (!M.holds(f.ans, f.t, f.v)) badT++; }
  ok(badT === 0 && Object.keys(kinds).length === 6, 'flip: test point is true in both lines (600 items, 6 kinds)');
  ok(M.checkFlip({ flip: true, ans: '>', kind: 'divneg', op: '÷ (−3)' }, { v: '<' }).code === 'noflip', 'flip: missed flip named');
  ok(M.checkFlip({ flip: false, ans: '<', kind: 'add', op: '+ 3' }, { v: '>' }).code === 'flipped', 'flip: flip when adding named');
  it = { b: 3, rel: '>', back: true };
  ok(M.checkIneq(it, { at: 3, closed: false, dir: 'L' }).code === 'readback', 'graph: 3 < x read backwards named');
  ok(M.checkIneq(it, { at: 3, closed: true, dir: 'R' }).code === 'dot', 'graph: closed dot for > named');
  // steps always end at x = answer
  let badS = 0;
  for (let i = 0; i < 500; i++) { const b = M.genBoth(), S = M.steps(b.a, b.c, b.b, b.d), last = S[S.length - 1]; const v = last.L.x ? last.R.k : last.L.k; if (!Q.eq(v, b.x)) badS++; const t2 = M.genTwo(), S2 = M.steps(t2.a, t2.c, 0, t2.d), l2 = S2[S2.length - 1]; if (!Q.eq(l2.R.k, t2.x) || l2.L.x !== 1) badS++; }
  ok(badS === 0, 'balance steps end at the answer (1000 problems)');
  ok(document.querySelectorAll('.tab').length === 6, 'six tabs');
};
</script>
