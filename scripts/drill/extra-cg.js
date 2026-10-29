<script>
window.EXTRA = ok => {
  const M = MODEL, q = Q.q, P = Q.parse;
  ok(M.checkName({ kind: 'chord' }, { v: 'diameter' }).cue.indexOf('chord') >= 0, 'name: chord called a diameter gets a chord cue');
  ok(M.checkChord({ r: 5, d: 3, h: 4, form: 'chord', v: 8 }, { v: q(4) }).code === 'half', 'chords: half the chord named');
  ok(M.checkChord({ r: 5, d: 3, h: 4, form: 'radius', v: 5 }, { v: P('8.5') }).code === 'full', 'chords: full chord in Pythagoras named');
  ok(M.checkChord({ r: 5, d: 3, h: 4, form: 'dist', v: 3 }, { v: P('6.4') }).code === 'add', 'chords: r as a leg named');
  ok(M.checkAngle({ form: 'toIns', c: 100, v: 50 }, { v: q(100) }).code === 'equal', 'angles: inscribed equal to central named');
  ok(M.checkAngle({ form: 'toCen', c: 100, v: 100 }, { v: q(50) }).code === 'half', 'angles: central halved named');
  ok(M.checkAngle({ form: 'toIns', c: 120, v: 60 }, { v: q(90) }).code === 'ninety', 'angles: 90° off a diameter named');
  ok(M.checkTan({ form: 'len', r: 5, t: 12, o: 13, v: 12 }, { v: P('13.9') }).code === 'hyp', 'tangent: OP used as a leg named');
  ok(M.checkTan({ form: 'ang', x: 40, v: 50 }, { v: q(140) }).code === 'no90', 'tangent: 90° at T missed named');
  ok(M.checkTan({ form: 'len', r: 3, t: 4, o: 5, v: 4 }, { v: P('4.0') }).ok, 'tangent: 4.0 accepted for 4');
  ok(document.querySelectorAll('.tab').length === 4, 'four tabs');
};
</script>
