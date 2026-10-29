/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { val, rnd, pick, chance } = Q;
  const near = (g, x, tol) => g != null && Math.abs(val(g) - x) <= (tol == null ? .05 : tol) + 1e-9;
  const ans1 = x => Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : (Math.round(x * 10) / 10).toFixed(1);

  /* CG1 name the part */
  const KINDS = ['radius', 'diameter', 'chord', 'tangent'];
  function genName() { const kind = pick(KINDS), a = rnd(0, 359), span = rnd(50, 150); return { kind, a, span }; }
  function checkName(it, r) {
    if (r.v === it.kind) return { ok: true };
    return { code: 'is-' + it.kind, cue: { radius: 'Centre to the circle: radius', diameter: 'Through the centre: diameter', chord: 'Misses the centre: a chord', tangent: 'Touches at one point: tangent' }[it.kind] };
  }

  /* CG2 chords: the perpendicular from the centre halves the chord. r² = d² + (c/2)² */
  const TRI = [[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 5, 12], [13, 12, 5], [17, 8, 15], [15, 9, 12], [15, 12, 9], [25, 7, 24], [25, 24, 7]];
  function genChord() {
    let r, d, h;
    if (chance(.7)) [r, d, h] = pick(TRI); else { r = rnd(6, 15); d = rnd(1, r - 2); h = Math.sqrt(r * r - d * d); }
    const form = pick(['chord', 'chord', 'dist', 'radius']);
    const v = form === 'chord' ? 2 * h : form === 'dist' ? d : r;
    return { r, d, h, form, v };
  }
  function checkChord(it, r) {
    const g = r.v;
    if (near(g, it.v)) return { ok: true };
    if (it.form === 'chord' && near(g, it.h)) return { code: 'half', cue: 'That’s half the chord: × 2' };
    if (it.form === 'radius' && near(g, Math.sqrt(4 * it.h * it.h + it.d * it.d))) return { code: 'full', cue: 'Use half the chord' };
    if (it.form === 'dist' && near(g, Math.sqrt(it.r * it.r + it.h * it.h))) return { code: 'add', cue: 'r is the hypotenuse: subtract' };
    if (it.form === 'chord' && near(g, 2 * Math.sqrt(it.r * it.r + it.d * it.d))) return { code: 'add', cue: 'r is the hypotenuse: subtract' };
    return { code: 'other', cue: 'r² = d² + (half chord)²' };
  }

  /* CG3 inscribed and central angles */
  function genAngle() {
    const form = pick(['toIns', 'toIns', 'toCen', 'diam', 'same']), c = 2 * rnd(20, 80);
    const v = form === 'toIns' ? c / 2 : form === 'toCen' ? c : form === 'diam' ? 90 : c / 2;
    return { form, c, v, start: rnd(200, 260) };
  }
  function checkAngle(it, r) {
    const g = val(r.v);
    if (g === it.v) return { ok: true };
    if (it.form === 'toIns' && g === it.c) return { code: 'equal', cue: 'Inscribed is half the central' };
    if (it.form === 'toIns' && g === it.c * 2) return { code: 'double', cue: 'Half, not double' };
    if (it.form === 'toCen' && (g === it.c / 2 || g === it.c / 4)) return { code: 'half', cue: 'Central is double the inscribed' };
    if (it.form === 'diam') return { code: 'diam', cue: 'Half of 180° on a diameter' };
    if (it.form === 'same' && (g === it.c || g === it.c / 4)) return { code: 'same', cue: 'Same arc: same angle' };
    if (g === 90) return { code: 'ninety', cue: '90° only on a diameter' };
    return { code: 'other', cue: 'Inscribed = half the central' };
  }

  /* CG4 tangent ⟂ radius */
  const PT = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [9, 12, 15], [12, 5, 13]];
  function genTan() {
    const form = pick(['len', 'len', 'op', 'ang']);
    if (form === 'ang') { const x = rnd(25, 70); return { form, x, v: 90 - x, a: rnd(0, 359) }; }
    let r, t, o; if (chance(.7)) [r, t, o] = pick(PT); else { r = rnd(3, 10); t = rnd(4, 15); o = Math.sqrt(r * r + t * t); }
    return { form, r, t, o, v: form === 'len' ? t : o, a: rnd(0, 359) };
  }
  function checkTan(it, r) {
    const g = r.v;
    if (it.form === 'ang') {
      if (val(g) === it.v) return { ok: true };
      if (val(g) === 180 - it.x) return { code: 'no90', cue: 'The tangent makes 90° at T' };
      return { code: 'other', cue: '90° + ' + it.x + '° + ? = 180°' };
    }
    if (near(g, it.v)) return { ok: true };
    if (it.form === 'len' && near(g, Math.sqrt(it.o * it.o + it.r * it.r))) return { code: 'hyp', cue: 'OP is the hypotenuse: subtract' };
    if (it.form === 'len' && near(g, it.o - it.r)) return { code: 'sides', cue: 'Use the squares, not the sides' };
    if (it.form === 'op' && near(g, it.r + it.t)) return { code: 'sides', cue: 'Use the squares, not the sides' };
    return { code: 'other', cue: 'Right angle at T: Pythagoras' };
  }

  return { near, ans1, KINDS, genName, checkName, genChord, checkChord, genAngle, checkAngle, genTan, checkTan };
})();
/* ===================== MODEL END ===================== */

