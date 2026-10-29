/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { val, rnd, pick, chance } = Q;
  // Seeded normal-ish noise from the kit's random (sum of three uniforms).
  const noise = () => (rnd(0, 1000) + rnd(0, 1000) + rnd(0, 1000)) / 1500 - 1;
  function corr(pts) {
    const n = pts.length, mx = pts.reduce((s, p) => s + p[0], 0) / n, my = pts.reduce((s, p) => s + p[1], 0) / n;
    let sxy = 0, sxx = 0, syy = 0; pts.forEach(([x, y]) => { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; syy += (y - my) ** 2; });
    return { r: sxy / Math.sqrt(sxx * syy), m: sxy / sxx, b: my - sxy / sxx * mx, mx, my };
  }
  // n points with x in [1, 10] and y in roughly [0, 100]
  function cloud(slope, spread, n) {
    const pts = [];
    for (let i = 0; i < (n || 14); i++) { const x = Math.round((1 + 9 * rnd(0, 1000) / 1000) * 10) / 10; const y = slope === 0 ? 20 + 60 * rnd(0, 1000) / 1000 : 50 + slope * (x - 5.5) * 8 + spread * noise() * 25; pts.push([x, Math.max(2, Math.min(98, Math.round(y)))]); }
    return pts;
  }
  const sse = (pts, m, b) => pts.reduce((s, [x, y]) => s + (y - (m * x + b)) ** 2, 0);

  /* ST1 one variable or two? */
  const BI = [['Height (cm)', 'Arm span (cm)', [150, 185], [148, 190]], ['Hours studied', 'Test score', [0, 6], [40, 98]], ['Temperature (°C)', 'Visitors', [12, 34], [40, 360]], ['Age (years)', 'Reaction time (ms)', [12, 70], [180, 320]]];
  const UNI = [['Height (cm)', null, [140, 190]], ['Test score', null, [40, 100]], ['Student', 'Shoe size', [5, 12]], ['Player', 'Goals', [0, 30]], ['Pumpkin mass (kg)', null, [3, 40]]];
  function genVars() {
    if (chance(.5)) { const [a, b, ra, rb] = pick(BI); const rows = []; for (let i = 0; i < 5; i++) { const t = rnd(0, 100) / 100; rows.push([Math.round(ra[0] + t * (ra[1] - ra[0])), Math.round(rb[0] + (t * .7 + .3 * rnd(0, 100) / 100) * (rb[1] - rb[0]))]); } return { ans: 'bi', cols: [a, b], rows }; }
    const [a, b, rg] = pick(UNI), rows = [];
    for (let i = 0; i < 5; i++) { const v = rnd(rg[0], rg[1]); rows.push(b ? [a === 'Student' ? 'ABCDE'[i] : ['Ana', 'Ben', 'Cy', 'Dev', 'Eli'][i], v] : [v]); }
    return { ans: 'uni', cols: b ? [a, b] : [a], rows, idCol: !!b };
  }
  function checkVars(it, r) {
    if (r.v === it.ans) return { ok: true };
    return it.ans === 'bi' ? { code: 'saiduni', cue: 'Two things measured on each: bivariate' } : { code: 'saidbi', cue: it.idCol ? 'Names aren’t measured: one variable' : 'One thing measured: univariate' };
  }

  /* ST2 direction and strength */
  function genDir() {
    for (;;) {
      const ans = pick(['pos', 'neg', 'none']), pts = cloud(ans === 'pos' ? 1 : ans === 'neg' ? -1 : 0, chance(.5) ? .5 : 1);
      const { r } = corr(pts);
      if (ans === 'none' ? Math.abs(r) < .2 : (ans === 'pos' ? r > .6 : r < -.6)) return { ans, pts };
    }
  }
  function checkDir(it, r) {
    if (r.v === it.ans) return { ok: true };
    return { code: 'pick', cue: { pos: 'Up to the right: positive', neg: 'Down to the right: negative', none: 'No up or down trend: none' }[it.ans] };
  }
  function genStrength() {
    for (;;) {
      const ans = pick(['strong', 'weak']), sign = pick([1, -1]), pts = cloud(sign, ans === 'strong' ? .25 : 1.6);
      const { r } = corr(pts), a = Math.abs(r);
      if (ans === 'strong' ? a > .92 : a > .3 && a < .62) return { ans, pts };
    }
  }
  function checkStrength(it, r) {
    if (r.v === it.ans) return { ok: true };
    return { code: 'pick', cue: it.ans === 'strong' ? 'Points hug a line: strong' : 'Points spread wide: weak' };
  }

  /* ST3 which line fits best? */
  function genFit() {
    for (;;) {
      const sign = pick([1, -1]), pts = cloud(sign, .55), { r, m, b, mx, my } = corr(pts);
      if (Math.abs(r) < .8) continue;
      const above = pts.filter(([x, y]) => y > m * x + b).length;
      if (Math.abs(2 * above - pts.length) > 2) continue;   // the best line also balances points above and below
      const xs = pts.map(p => p[0]), lo = pts[xs.indexOf(Math.min(...xs))], hi = pts[xs.indexOf(Math.max(...xs))];
      const fl = { m: (hi[1] - lo[1]) / (hi[0] - lo[0]), kind: 'firstlast' }; fl.b = lo[1] - fl.m * lo[0];
      const k = pts.reduce((s, [x, y]) => s + x * y, 0) / pts.reduce((s, [x]) => s + x * x, 0), org = { m: k, b: 0, kind: 'origin' };
      const st = { m: m * 1.8, kind: 'steep' }; st.b = my - st.m * mx;
      const best = { m, b, kind: 'best' }, e0 = sse(pts, m, b);
      const pool = [fl, org, st].filter(L => sse(pts, L.m, L.b) > e0 * 1.6);
      if (pool.length < 2) continue;
      const lines = Q.shuffle([best, ...Q.shuffle(pool).slice(0, 2)]);
      return { pts, lines, ans: String(lines.indexOf(best)) };
    }
  }
  function checkFit(it, r) {
    if (r.v === it.ans) return { ok: true };
    const L = it.lines[+r.v];
    return { code: L.kind, cue: { firstlast: 'First to last ignores the middle', origin: 'It doesn’t have to pass 0', steep: 'Balance points above and below' }[L.kind] };
  }

  /* ST4 read a prediction from the line; interpolation or extrapolation */
  function genPredict() {
    for (;;) {
      const sign = pick([1, -1]), pts = cloud(sign, .6), { r, m, b } = corr(pts);
      if (Math.abs(r) < .75) continue;
      const x = rnd(2, 9), y = m * x + b;
      if (y < 5 || y > 95) continue;
      return { pts, m, b, x, v: y };
    }
  }
  function checkPredict(it, r) {
    const g = val(r.v);
    if (Math.abs(g - it.v) <= 4) return { ok: true };
    if (it.pts.some(p => Math.abs(p[0] - it.x) < .3 && Math.abs(p[1] - g) <= 2)) return { code: 'point', cue: 'Read the line, not a point' };
    return { code: 'other', cue: 'Up from x to the line, then across' };
  }
  function genRange() {
    const pts = cloud(pick([1, -1]), .6), xs = pts.map(p => p[0]), lo = Math.min(...xs), hi = Math.max(...xs), inside = chance(.5);
    const x = inside ? Math.round((lo + (hi - lo) * (.15 + .7 * rnd(0, 100) / 100)) * 10) / 10 : (chance(.5) ? Math.round((hi + 1 + rnd(0, 20) / 10) * 10) / 10 : Math.max(0, Math.round((lo - 0.6 - rnd(0, 6) / 10) * 10) / 10));
    const { m, b } = corr(pts);
    return { pts, lo, hi, x, m, b, ans: x >= lo && x <= hi ? 'inter' : 'extra' };
  }
  function checkRange(it, r) {
    if (r.v === it.ans) return { ok: true };
    return it.ans === 'inter' ? { code: 'pick', cue: 'Inside the data: interpolation' } : { code: 'pick', cue: 'Outside the data: extrapolation' };
  }

  return { corr, sse, genVars, checkVars, genDir, checkDir, genStrength, checkStrength, genFit, checkFit, genPredict, checkPredict, genRange, checkRange };
})();
/* ===================== MODEL END ===================== */

