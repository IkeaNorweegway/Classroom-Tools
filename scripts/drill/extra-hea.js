<script>
window.EXTRA = ok => {
  const M = MODEL, q = Q.q;
  ok(M.checkK({ form: 'toK', c: 25, k: 298, v: 298 }, { v: q(-248) }).code === 'neg-k', 'kelvin: negative kelvin named');
  ok(M.checkK({ form: 'toK', c: 300, k: 573, v: 573 }, { v: q(27) }).code === 'sub', 'kelvin: subtracting 273 named');
  ok(M.checkK({ form: 'toK', c: 25, k: 298, v: 298 }, { v: q(25) }).code === 'same', 'kelvin: not converting named');
  ok(M.checkK({ form: 'toC', c: 37, k: 310, v: 37 }, { v: q(583) }).code === 'add', 'kelvin: adding for °C named');
  let more = true; for (let i = 0; i < 500; i++) { const it = M.genMore(), A = it.A, B = it.B;
    const thermal = (x, y) => (x.big && !y.big) || (x.big === y.big && x.t > y.t);
    const want = it.ask === 'temp' ? (A.t === B.t ? 'same' : A.t > B.t ? 'A' : 'B') : thermal(A, B) ? 'A' : thermal(B, A) ? 'B' : 'same';
    if (want !== it.a || want === 'same' && it.ask === 'thermal') more = false; }
  ok(more, 'heat or temp: 500 answers follow the rule (big beats small at any listed temperature)');
  ok(M.checkFlow({ a: 'none' }, { v: 'r' }).code === 'none' && M.checkFlow({ a: 'r' }, { v: 'l' }).code === 'cold-flows', 'heat flow: same-temperature and cold-flows cues');
  let flow = true; for (let i = 0; i < 300; i++) { const it = M.genFlow(); const hot = it.L[2] > it.R[2] ? 'r' : it.L[2] < it.R[2] ? 'l' : 'none'; if (hot !== it.a) flow = false; }
  ok(flow, 'heat flow: every answer points from the hotter thing');
  ok(M.checkPart({ form: 'why', hot: true, a: 'apart' }, { v: 'bigger' }).code === 'size', 'particles: particles get bigger named');
  ok(M.checkCond({ ask: 'colder', a: 'same' }, { v: 'A' }).code === 'metal-colder', 'conductors: metal colder named');
  let cond = true; for (let i = 0; i < 300; i++) { const it = M.genCond(); const metal = it.metalLeft ? 'A' : 'B', wood = it.metalLeft ? 'B' : 'A';
    const want = { conductor: metal, faster: metal, insulator: wood, colder: 'same' }[it.ask]; if (want !== it.a) cond = false; }
  ok(cond, 'conductors: every answer matches metal/wood');
  ok(M.checkIns({ form: 'rate', k: 0, a: 'slower' }, { v: 'faster' }).code === 'makes-heat', 'insulation: makes heat named');
  let pairs = 0; for (let i = 0; i < 300; i++) { const it = M.genIns(); if (it.form === 'rate' && it.a !== (M.INS[it.k].bare ? 'faster' : 'slower')) pairs = -999; if (it.a === 'faster') pairs++; }
  ok(pairs > 30, 'insulation: removed-insulation items answer faster (' + pairs + '/300)');
  let ins = true; for (let i = 0; i < 300; i++) { const it = M.genIns(); if (it.form === 'pick') { const x = M.INS[it.k], L = it.swap ? x.B : x.A; if ((L[2] === 1) !== (it.a === 'A')) ins = false; } }
  ok(ins, 'insulation: the more insulated choice is always the answer');
  ok(document.querySelectorAll('.tab').length === 8, 'eight tabs');
};
</script>
