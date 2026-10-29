<script>
window.EXTRA = ok => {
  const M = MODEL, q = Q.q;
  ok(M.LOAD.every(l => !/snow/i.test(l.t)), 'load: no snow items');
  ok(M.checkBeam({ form: 'squeezed', a: 'top' }, { v: 'bottom' }).code === 'top' && M.checkBeam({ form: 'rebar', a: 'bottom' }, { v: 'top' }).code === 'rebar', 'beam: top/rebar cues');
  let st = true; for (let i = 0; i < 500; i++) { const it = M.genStable(); const s = x => Math.atan2(x.b / 2, x.hc);
    if ((s(it.A) > s(it.B)) !== (it.a === 'A') || Math.abs(it.A.ang - it.B.ang) < 12 || it.A.H > 250 || it.B.b > 190) st = false; }
  ok(st, 'stable: 500 pairs, answer has the larger tipping angle, gap of 12°+');
  const r = M.shape(); ok(r.hc > 0 && r.hc < r.H, 'stable: CoG inside the block');
  ok(M.checkMA({ L: 200, E: 50, v: q(4) }, { v: q(1, 4) }).code === 'flip', 'MA: upside down named');
  ok(M.checkMA({ L: 200, E: 50, v: q(4) }, { v: q(150) }).code === 'sub', 'MA: subtracting named');
  ok(M.checkMA({ L: 20, E: 40, v: q(1, 2) }, { v: Q.parse('0.5') }).ok, 'MA: 0.5 accepted for 1/2');
  let lv = true; for (let i = 0; i < 300; i++) { const it = M.genLever(); if (String(it.cls) !== it.a) lv = false; } ok(lv, 'lever: answer is the class');
  let mc = true; for (let i = 0; i < 300; i++) { const it = M.genMach(); if (it.opts.length !== 4 || !it.opts.includes(it.a)) mc = false; } ok(mc, 'machines: 4 choices with the answer');
  ok(M.MACH_EX.wheel.some(e => e[0] === 'Screwdriver'), 'machines: screwdriver is a wheel and axle, as in the notes');
  ok(document.querySelectorAll('.tab').length === 8, 'eight tabs');
};
</script>
