<script>
window.EXTRA = ok => {
  const M = MODEL, q = Q.q;
  ok(S.sortCheck({ a: 'abio' }, { v: 'bio' }, M.BIOTIC_CUES).cue === M.BIOTIC_CUES.abio, 'biotic: abiotic item gets the abiotic cue');
  ok(M.BIOTIC.find(b => b.t === 'Soil').a === 'abio', 'biotic: soil is abiotic, as in the notes');
  ok(M.checkLevel({ c: 0, k: 2, a: 'sec' }, { v: 'ter' }).code === 'counted-producer', 'level: producer counted as a consumer named');
  ok(M.checkLevel({ c: 0, k: 0, a: 'prod' }, { v: 'pri' }).code === 'prod', 'level: producer called a consumer named');
  ok(M.checkArrow({ a: 'r' }, { v: 'l' }).cue === 'Arrow points to the eater', 'arrow: wrong way named');
  ok(M.checkWeb({ a: 'down' }, { v: 'up' }).code === 'lost-food' && M.checkWeb({ a: 'up' }, { v: 'down' }).code === 'lost-predator', 'web: food and predator cues');
  let webOK = true; for (let i = 0; i < 300; i++) { const it = M.genWeb(); const e = M.WEB.edges.some(([f, x]) => it.a === 'down' ? f === it.gone && x === it.who : x === it.gone && f === it.who); if (!e) webOK = false; }
  ok(webOK, 'web: every question is a direct link with the right direction');
  ok(M.checkEnergy({ g: 0, a: 1, given: 10000, v: 1000 }, { v: q(100000) }).code === 'up-times', 'energy: ×10 going up named');
  ok(M.checkEnergy({ g: 1, a: 0, given: 1000, v: 10000 }, { v: q(100) }).code === 'down-div', 'energy: ÷10 going down named');
  ok(M.checkEnergy({ g: 0, a: 1, given: 10000, v: 1000 }, { v: q(9000) }).code === 'ninety', 'energy: 90% passed on named');
  ok(M.checkEnergy({ g: 0, a: 2, given: 10000, v: 100 }, { v: q(1000) }).code === 'one-step', 'energy: one ÷10 for two levels named');
  ok(Q.eq(Q.parse('10,000'), q(10000)), 'energy: 10,000 with a comma is read as a number');
  let bioOK = true; for (let i = 0; i < 400; i++) { const it = M.genBio(); const nA = new Set(it.A).size, nB = new Set(it.B).size, rich = it.a === 'A' ? it.A : it.B, poor = it.a === 'A' ? it.B : it.A; if (nA !== it.nA || nB !== it.nB || (it.a === 'A') !== (nA > nB) || Math.abs(nA - nB) < 2 || poor.length <= rich.length || poor.length > 16 || rich.length > 16) bioOK = false; }
  ok(bioOK, 'biodiversity: richer plot has fewer living things, kinds differ by 2+, at most 16 icons');
  ok(document.querySelectorAll('.tab').length === 8, 'eight tabs');
};
</script>
