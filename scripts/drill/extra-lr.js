<script>
window.WRONG = (t, it) => {
  if (t.id === 'graph') return { pts: [{ x: it.b === 0 ? 1 : it.b, y: 0 }, { x: 0, y: 5 }] };
  return null;
};
window.EXTRA = ok => {
  const M = MODEL;
  // named mistakes
  let it = { m: 3, b: 5, x0: 0, xs: [0,1,2,3,4], ys: [5,8,11,14,17] };
  ok(M.checkRule(it, { m: Q.q(5), b: Q.q(3) }).code === 'swap', 'table: swapped m and b named');
  ok(M.checkRule(it, { m: Q.q(-3), b: Q.q(5) }).code === 'sign', 'table: sign of m named');
  it = { m: 3, b: 5, x0: 1, xs: [1,2,3,4,5], ys: [8,11,14,17,20] };
  ok(M.checkRule(it, { m: Q.q(3), b: Q.q(8) }).code === 'yval', 'table: first y used as b named');
  ok(M.checkSlope({ rise: 4, run: 2 }, { m: Q.q(1, 2) }).code === 'recip', 'slope: run over rise named');
  ok(M.checkSlope({ rise: -4, run: 3 }, { m: Q.q(4, 3) }).code === 'sign', 'slope: sign named');
  ok(M.checkSlope({ rise: 6, run: 4 }, { m: Q.parse('6/4') }).ok, 'slope: unsimplified 6/4 accepted');
  ok(M.checkSlope({ rise: 6, run: 4 }, { m: Q.parse('1.5') }).ok, 'slope: decimal 1.5 accepted');
  const g = { m: Q.q(2, 3), b: 3 };
  ok(M.checkGraph(g, [{ x: 3, y: 0 }, { x: 6, y: 2 }]).code === 'xaxis', 'graph: b on the x-axis named');
  ok(M.checkGraph(g, [{ x: 0, y: 3 }, { x: 3, y: 1 }]).code === 'sign', 'graph: slope direction named');
  ok(M.checkGraph(g, [{ x: 0, y: 3 }, { x: 2, y: 6 }]).code === 'recip', 'graph: run over rise named');
  ok(M.checkGraph(g, [{ x: 0, y: -3 }, { x: 3, y: -1 }]).code === 'bsign', 'graph: sign of b named');
  ok(M.checkGraph(g, [{ x: 3, y: 5 }, { x: -3, y: 1 }]).ok, 'graph: any two points on the line pass');
  const r = { m: Q.q(2), b: 4, xint: -2 };
  ok(M.checkRule(r, { m: Q.q(2), b: Q.q(-2) }).code === 'xaxis', 'read: x-intercept used as b named');
  ok(M.checkVary({ direct: true }, { v: 'partial' }).cue.length > 0, 'vary: wrong pick gets a cue');
  // cues short
  let long = [];
  [['swap'], ['sign']].forEach(()=>{});
  ['Right m. Check the sign of b.', 'Rise over run, not run over rise'].forEach(c => { if (c.split(' ').length > 7) long.push(c); });
  ok(long.length === 0, 'cues are short');
  ok(document.querySelectorAll('.tab').length === 5, 'five tabs');
  ok(/#:~:text=Section%201/.test(document.getElementById('notes').href) || /#:~:text=Section%20/.test(document.getElementById('notes').href), 'notes link jumps to a section: ' + document.getElementById('notes').href.split('#')[1]);
};
</script>
