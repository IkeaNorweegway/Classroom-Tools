<script>
window.EXTRA = ok => {
  const M = MODEL, P = Q.parse, PI = Math.PI;
  ok(M.checkArea({ shape: 'tri', b: 6, h: 4, v: 12 }, { v: P('24') }).cue.indexOf('½') >= 0, 'area: no ½ named');
  ok(M.checkArea({ shape: 'circle', r: 5, useD: true, v: PI * 25 }, { v: P('314.2') }).cue.indexOf('radius') >= 0, 'area: d used for r named');
  ok(M.checkArea({ shape: 'circle', r: 5, v: PI * 25 }, { v: P('31.4') }).cue.indexOf('circumference') >= 0, 'area: circumference named');
  ok(M.checkArea({ shape: 'circle', r: 5, v: PI * 25 }, { v: P('78.5') }).ok, 'area: π = 3.14 accepted (78.5)');
  const cyl = { shape: 'cyl', r: 3, h: 10 }; cyl.v = M.SA(cyl);
  ok(M.checkSA(cyl, { v: P(String(PI * 9 + 2 * PI * 30)) }).cue.indexOf('Two circles') >= 0, 'surface area: one circle named');
  ok(M.checkSA(cyl, { v: P(String(Math.round(M.VOL(cyl) * 10) / 10)) }).code === 'vol', 'surface area: volume given named');
  const box = { shape: 'box', l: 5, w: 3, h: 2 }; box.v = M.SA(box);
  ok(M.checkSA(box, { v: P('31') }).cue.indexOf('twin') >= 0, 'surface area: half the faces named');
  const bv = { shape: 'box', l: 5, w: 3, h: 2 }; bv.v = M.VOL(bv);
  ok(M.checkVol(bv, { v: P('62') }).code === 'sa', 'volume: surface area given named');
  ok(M.checkThird({ shape: 'cone', r: 3, h: 4, l: 5, v: PI * 9 * 4 / 3 }, { v: P(String(PI * 36)) }).cue.indexOf('⅓') >= 0, 'cone: no ⅓ named');
  ok(M.checkThird({ shape: 'cone', r: 3, h: 4, l: 5, v: PI * 9 * 4 / 3 }, { v: P(String(PI * 9 * 5 / 3)) }).cue.indexOf('slant') >= 0, 'cone: slant used named');
  ok(M.checkSphere({ what: 'V', r: 6, v: 288 * PI }, { v: P(String(4 * PI * 36)) }).cue.indexOf('surface') >= 0, 'sphere: SA for V named');
  const c = M.genComp();
  ok(M.checkComp(c, { v: Q.q(c.s1 + c.s2) }).code === 'nohide', 'composite: glued faces counted named');
  ok(M.checkComp(c, { v: Q.q(c.s1 + c.s2 - c.l * c.w) }).code === 'once', 'composite: subtracted once named');
  ok(document.querySelectorAll('.tab').length === 7, 'seven tabs');
};
</script>
