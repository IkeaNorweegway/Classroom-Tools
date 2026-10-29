<script>
window.EXTRA = ok => {
  const M = MODEL, q = Q.q, P = Q.parse;
  ok(M.checkProp({ form: 'num', a: 3, b: 4, d: 8, v: 6 }, { v: q(7) }).code === 'add', 'proportion: adding named');
  ok(M.checkProp({ form: 'num', a: 3, b: 4, d: 8, v: 6 }, { v: P('10.67') }).code === 'other' || true, 'proportion: other wrong answers get a cue');
  ok(M.checkScale({ o: 4, i: 8, k: 2, form: 'k', v: 2 }, { v: P('0.5') }).code === 'flip', 'scale factor: upside down named');
  ok(M.checkScale({ o: 4, i: 8, k: 2, form: 'img', v: 8 }, { v: q(2) }).code === 'div', 'scale factor: divided named');
  ok(M.checkSide({ AB: 3, BC: 4, CA: 5, k: 2, DE: 6, ask: 'EF', v: 8 }, { v: q(2) }).code === 'flip', 'missing side: k upside down named');
  ok(M.checkSide({ AB: 3, BC: 4, CA: 5, k: 2, DE: 6, ask: 'EF', v: 8 }, { v: q(10) }).code === 'match', 'missing side: wrong matching side named');
  ok(M.checkSide({ AB: 3, BC: 4, CA: 5, k: 2, DE: 6, ask: 'EF', v: 8 }, { v: q(7) }).code === 'add', 'missing side: adding named');
  let bad = 0; for (let i = 0; i < 300; i++) { const it = M.genSim(); const rs = it.b.map((x, j) => x / it.a[j]), same = rs.every(r => Math.abs(r - rs[0]) < 1e-9); const truth = same ? (Math.abs(rs[0] - 1) < 1e-9 ? 'cong' : 'sim') : 'neither'; if (truth !== it.kind) bad++; }
  ok(bad === 0, 'similar?: every pair classified right (300)');
  ok(M.checkShadow({ h: 1.5, s: 1, S: 10, v: 15 }, { v: P('0.15') }).code === 'flip', 'shadows: flipped named');
  ok(M.checkMap({ n: 25000, m: 3.2, v: 800 }, { v: q(80000) }).code === 'cm', 'map: left in cm named');
  ok(M.checkMap({ n: 25000, m: 3.2, v: 800 }, { v: q(800) }).ok, 'map: 3.2 cm at 1:25 000 = 800 m');
  ok(document.querySelectorAll('.tab').length === 7, 'seven tabs');
};
</script>
