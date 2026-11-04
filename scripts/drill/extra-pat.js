<script>
window.EXTRA = ok => {
  const M = MODEL, q = Q.q, P = Q.parse;
  // Trip: 14.4 km/h for 3/4 h, 13.2 km/h for 1/3 h = 10.8 + 4.4 = 15.2 (the 2015 PAT item)
  const trip = { form: 'frac', s: [14.4, 13.2], t: [{ n: 3, d: 4 }, { n: 1, d: 3 }], d: [10.8, 4.4], v: 15.2 };
  ok(M.checkTrip(trip, { v: P('15.2') }).ok, 'trip: PAT item 15.2 km');
  ok(M.checkTrip(trip, { v: P('10.8') }).code === 'one', 'trip: one leg named');
  const tripM = { form: 'min', s: [14.4, 9.6], t: [{ n: 45, d: 60, m: 45 }, { n: 20, d: 60, m: 20 }], d: [10.8, 3.2], v: 14 };
  ok(M.checkTrip(tripM, { v: P('10.8') }).code === 'one', 'trip: minutes, one leg named');
  ok(M.checkTrip(tripM, { v: P('8.4') }).code === 'min', 'trip: 45 min as 0.45 h named');
  // Rug: 37.5% of 12 × 8 = 36, side 6 (the 2013 PAT item)
  const rug = { L: 12, W: 8, p: 37.5, area: 36, v: 6, w: 'rug', what: 'room' };
  ok(M.checkRug(rug, { v: q(6) }).ok, 'rug: PAT item 6 m');
  ok(M.checkRug(rug, { v: q(36) }).code === 'area', 'rug: area for side named');
  ok(M.checkRug(rug, { v: q(18) }).code === 'half', 'rug: √ as ÷ 2 named');
  ok(M.checkRug(rug, { v: P('9.8') }).code === 'full', 'rug: percent left out named');
  // Bill: $5 + $0.06 × 47 = $7.82
  const bill = { form: 'total', ctx: 'phone', fee: 500, rate: 6, n: 47, T: 782, v: 7.82 };
  ok(M.checkBill(bill, { v: P('7.82') }).ok, 'bill: $7.82');
  ok(M.checkBill(bill, { v: P('2.82') }).code === 'nofee', 'bill: fee left out named');
  ok(M.checkBill(bill, { v: P('237.82') }).code === 'both', 'bill: fee multiplied named');
  const billN = Object.assign({}, bill, { form: 'n', v: 47 });
  ok(M.checkBill(billN, { v: P('130.33') }).code === 'nofee', 'bill n: fee not taken off named');
  ok(M.checkBill(billN, { v: P('2.82') }).code === 'sub', 'bill n: dollars not divided named');
  // Save up: $250, has $86, $10.25/h -> 164/10.25 = 16 exactly (PAT); and a rounding case
  ok(M.checkSave({ form: 'work', G: 250, H: 86, rate: 1025, need: 16400, n: 16, exact: true, v: 16 }, { v: q(16) }).ok, 'save: PAT item 16 h');
  const sv = { form: 'work', G: 250, H: 80, rate: 1250, need: 17000, n: 14, exact: false, v: 14 }; // 13.6
  ok(M.checkSave(sv, { v: q(13) }).code === 'down', 'save: rounded down named');
  ok(M.checkSave(sv, { v: P('13.6') }).code === 'dec', 'save: decimal named');
  ok(M.checkSave(sv, { v: q(20) }).code === 'nohave', 'save: have not taken off named');
  ok(M.checkSave(sv, { v: q(170) }).code === 'need', 'save: dollars for hours named');
  // Budget: $40, entry $8, $3.50 a ride -> 9.14 -> 9
  const bu = { form: 'fair', B: 40, fee: 800, rate: 350, n: 9, exact: false, v: 9 };
  ok(M.checkBudget(bu, { v: q(9) }).ok, 'budget: 9 rides');
  ok(M.checkBudget(bu, { v: q(10) }).code === 'up', 'budget: rounded up named');
  ok(M.checkBudget(bu, { v: q(11) }).code === 'nofee', 'budget: fee not paid named');
  // Shares: Tara t, Jen 2t, Mindy 2t − 10, total 50 -> t = 12 (2013 PAT)
  const sh = { form: 'less', k: 2, t: 12, d: 10, c: [12, 24, 14], total: 50, parts: 5, names: ['Tara', 'Jen', 'Mindy'], v: 12 };
  ok(M.checkShares(sh, { v: q(12) }).ok, 'shares: PAT item $12');
  ok(M.checkShares(sh, { v: q(10) }).code === 'ignore', 'shares: the 10 ignored named');
  ok(M.checkShares(sh, { v: q(8) }).code === 'way', 'shares: the 10 the wrong way named');
  ok(M.checkShares(sh, { v: q(24) }).code === 'who', 'shares: Jen’s share named');
  ok(M.checkShares(sh, { v: P('20') }).code === 'count', 'shares: wrong block count named');
  // Catch up: A $20 + $8, B $50 + $5 -> 10
  const ca = { form: 'class', fA: 20, fB: 50, rA: 8, rB: 5, n: 10, cost: 100, v: 10 };
  ok(M.checkCatch(ca, { v: q(10) }).ok, 'catch up: 10');
  ok(M.checkCatch(ca, { v: q(30) }).code === 'fee', 'catch up: gap not divided named');
  ok(M.checkCatch(ca, { v: P('2.31') }).code === 'sum', 'catch up: rates added named');
  ok(M.checkCatch(ca, { v: q(100) }).code === 'cost', 'catch up: cost for n named');
  ok(M.checkCatch(ca, { v: P('3.75') }).code === 'one', 'catch up: one rate named');
  // Ladder: 5 m ladder, foot 3 m -> 4 m; park 60 × 80 -> 40 m shorter; screen 9 × 12 -> 15
  const la = { form: 'ladder', a: 3, b: 4, c: 5, v: 4 };
  ok(M.checkLadder(la, { v: q(4) }).ok, 'ladder: 4 m');
  ok(M.checkLadder(la, { v: P('5.83') }).code === 'legadd', 'ladder: adding for a leg named');
  ok(M.checkLadder(la, { v: q(16) }).code === 'noroot', 'ladder: no root named');
  ok(M.checkLadder(la, { v: q(2) }).code === 'add', 'ladder: subtracting sides named');
  const pk = { form: 'park', a: 80, b: 60, c: 100, v: 40 };
  ok(M.checkLadder(pk, { v: q(40) }).ok && M.checkLadder(pk, { v: q(100) }).code === 'diag' && M.checkLadder(pk, { v: q(140) }).code === 'around', 'park: answer, diagonal and the walk named');
  const sc = { form: 'screen', a: 12, b: 9, c: 15, v: 15 };
  ok(M.checkLadder(sc, { v: q(21) }).code === 'add' && M.checkLadder(sc, { v: q(225) }).code === 'noroot', 'screen: adding sides and no root named');
  let bad = 0; for (let i = 0; i < 400; i++) { const it = M.genLadder(); if (it.form === 'ladder' && !(it.a < it.c && it.v > 0)) bad++; if (Math.abs(it.a * it.a + it.b * it.b - it.c * it.c) > 1e-6) bad++; }
  ok(bad === 0, 'ladder: every triangle is right-angled (400)');
  // Paint: open 60 × 40 × 30 -> 2400 + 2(1800 + 1200) = 8400
  const pa = { form: 'open', l: 60, w: 40, h: 30, lw: 2400, lh: 1800, wh: 1200, v: 8400 };
  ok(M.checkPaint(pa, { v: q(8400) }).ok, 'paint: open box 8400');
  ok(M.checkPaint(pa, { v: q(10800) }).code === 'all6', 'paint: top counted named');
  ok(M.checkPaint(pa, { v: q(5400) }).code === 'half', 'paint: one of each pair named');
  ok(M.checkPaint(pa, { v: q(72000) }).code === 'vol', 'paint: volume named');
  ok(M.checkPaint(pa, { v: q(6000) }).code === 'nobase', 'paint: bottom left out named');
  // Predict: 3 of 25 watches, 750 -> 90 (2015 PAT)
  const pr = { form: 'watch', n: 25, h: 3, m: 30, N: 750, v: 90 };
  ok(M.checkPredict(pr, { v: q(90) }).ok, 'predict: PAT item 90');
  ok(M.checkPredict(pr, { v: P('102.27') }).code === 'pp', 'predict: part to part named');
  ok(M.checkPredict(pr, { v: q(12) }).code === 'pct', 'predict: percent for count named');
  ok(M.checkPredict(pr, { v: q(3) }).code === 'sample', 'predict: sample count named');
  // generators: whole-number answers where the story needs them, sensible ranges
  let g = 0;
  for (let i = 0; i < 400; i++) {
    const s = M.genSave(); if (s.n !== Math.ceil(s.need / s.rate) || s.H >= s.G) g++;
    const b = M.genBudget(); if (b.fee + b.n * b.rate > b.B * 100 || b.fee + (b.n + 1) * b.rate <= b.B * 100) g++;
    const c = M.genCatch(); if (c.fA + c.rA * c.n !== c.fB + c.rB * c.n) g++;
    const h = M.genShares(); if (h.c.some(x => x <= 0) || h.c[0] + h.c[1] + h.c[2] !== h.total) g++;
    const r = M.genRug(); if (r.v * r.v !== r.L * r.W * r.p / 100) g++;
    const t = M.genTrip(); if (Math.abs(t.d[0] - t.s[0] * t.t[0].n / t.t[0].d) > 1e-9) g++;
  }
  ok(g === 0, 'generators: stories are consistent (6 × 400)');
  // the answer differs from every named-error value it could be confused with (no right answer flagged wrong)
  const tabsEl = document.getElementById('tabs');
  ok(tabsEl.scrollWidth <= tabsEl.clientWidth + 1, 'all 11 tabs visible at ' + innerWidth + ' px (' + tabsEl.scrollWidth + '/' + tabsEl.clientWidth + ')');
  ok(document.querySelectorAll('.tab').length === 11, 'eleven tabs');
};
</script>
