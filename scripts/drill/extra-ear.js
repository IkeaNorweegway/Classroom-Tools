<script>
window.EXTRA = ok => {
  const M = MODEL;
  let old = true; for (let i = 0; i < 400; i++) { const it = M.genOld();
    const want = it.form === 'oldest' ? it.letters[it.n - 1] : it.form === 'youngest' ? it.letters[0] : (it.spots[0] > it.spots[1] ? it.fos[0][0] : it.fos[1][0]);
    if (want !== it.a || it.spots[0] === it.spots[1] || new Set(it.letters).size !== it.n) old = false; }
  ok(old, 'oldest: 400 items follow superposition (bottom = oldest), fossils in different layers');
  ok(M.checkOld({ form: 'oldest', a: 'C' }, { v: 'A' }).cue === 'Lower layers are older', 'oldest: top-is-oldest cue');
  ok(S.sortCheck({ a: 'ign', t: 'Rock melts, then cools' }, { v: 'met' }, M.ROCK_CUE).cue.indexOf('igneous') >= 0, 'rock: melting called metamorphic gets the igneous cue');
  ok(M.checkCrys({ slow: true, a: 'slow' }, { v: 'fast' }).code === 'slow', 'crystals: backwards named');
  ok(M.checkQuake({ a: 'epi' }, { v: 'focus' }).cue.indexOf('Surface') >= 0, 'earthquake: epicenter cue');
  let fact = true; M.BOUND.forEach(b => M.BOUND_FACT[b].forEach(f => M.BOUND.forEach(o => { if (o !== b && M.BOUND_FACT[o].includes(f)) fact = false; })));
  ok(fact, 'boundaries: no fact listed under two types');
  ok(document.querySelectorAll('.tab').length === 8, 'eight tabs');
};
</script>
