<script>
window.EXTRA = ok => {
  const M = MODEL;
  let bad = 0; for (let i = 0; i < 200; i++) { const it = M.genDir(), r = M.corr(it.pts).r; if ((it.ans === 'pos' && r <= .6) || (it.ans === 'neg' && r >= -.6) || (it.ans === 'none' && Math.abs(r) >= .2)) bad++; }
  ok(bad === 0, 'direction: every cloud has a clear r (200)');
  bad = 0; for (let i = 0; i < 200; i++) { const it = M.genStrength(), r = Math.abs(M.corr(it.pts).r); if ((it.ans === 'strong' && r <= .92) || (it.ans === 'weak' && (r < .3 || r > .62))) bad++; }
  ok(bad === 0, 'strength: strong above 0.92, weak between 0.3 and 0.62 (200)');
  bad = 0; for (let i = 0; i < 200; i++) { const it = M.genFit(), best = it.lines[+it.ans], e0 = M.sse(it.pts, best.m, best.b), ab = it.pts.filter(([x, y]) => y > best.m * x + best.b).length; if (best.kind !== 'best' || Math.abs(2 * ab - it.pts.length) > 2 || it.lines.some((L, j) => j !== +it.ans && M.sse(it.pts, L.m, L.b) < e0 * 1.6)) bad++; }
  ok(bad === 0, 'best fit: the right line is least squares and clearly better (200)');
  const f = M.genFit(); const wrong = String((+f.ans + 1) % 3);
  ok(M.checkFit(f, { v: wrong }).cue.length > 0, 'best fit: a wrong line gets a cue for its kind');
  bad = 0; for (let i = 0; i < 200; i++) { const it = M.genRange(); if ((it.x >= it.lo && it.x <= it.hi) !== (it.ans === 'inter')) bad++; }
  ok(bad === 0, 'inside or outside: every x classified right (200)');
  const v = M.genVars(); ok(M.checkVars(v, { v: v.ans === 'uni' ? 'bi' : 'uni' }).cue.length > 0, 'variables: wrong pick gets a cue');
  ok(document.querySelectorAll('.tab').length === 6, 'six tabs');
};
</script>
