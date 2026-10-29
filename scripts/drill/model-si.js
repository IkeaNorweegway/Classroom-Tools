/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { q, val, eq, rnd, pick, chance, shuffle } = Q;
  const near = (g, x, t) => g != null && Math.abs(val(g) - x) <= (t == null ? .05 : t) + 1e-9;
  const ans1 = x => Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : (Math.round(x * 100) / 100).toString();

  /* SI1 solve a proportion */
  function genProp() {
    for (;;) {
      const a = rnd(2, 12), b = rnd(2, 12); if (a === b) continue;
      const k = pick([2, 3, 4, 5, 1.5, 2.5]), form = pick(['num', 'num', 'den']);
      if (form === 'num') { const d = b * k; if (!Number.isInteger(d)) continue; return { form, a, b, d, v: a * d / b }; }
      const c = a * k; if (!Number.isInteger(c)) continue; return { form, a, b, c, v: b * c / a };
    }
  }
  function checkProp(it, r) {
    const g = r.v; if (near(g, it.v)) return { ok: true };
    if (it.form === 'num' && near(g, it.a + it.d - it.b)) return { code: 'add', cue: 'Multiply, don’t add' };
    if (it.form === 'num' && near(g, it.b * it.d / it.a)) return { code: 'flip', cue: 'Top to top, bottom to bottom' };
    if (it.form === 'den' && near(g, it.b + it.c - it.a)) return { code: 'add', cue: 'Multiply, don’t add' };
    if (it.form === 'den' && near(g, it.a * it.c / it.b)) return { code: 'flip', cue: 'Top to top, bottom to bottom' };
    return { code: 'other', cue: 'Find the × factor, use it again' };
  }

  /* SI1 scale factor k = image ÷ original */
  function genScale() {
    for (;;) {
      const o = rnd(2, 16), k = pick([2, 3, 4, 0.5, 0.25, 1.5, 2.5, 0.75]), i = o * k, form = pick(['k', 'k', 'img', 'orig']);
      if (!Number.isInteger(i * 4)) continue;
      return { o, k, i, form, v: form === 'k' ? k : form === 'img' ? i : o };
    }
  }
  function checkScale(it, r) {
    const g = r.v; if (near(g, it.v, .005)) return { ok: true };
    if (it.form === 'k' && near(g, it.o / it.i, .005)) return { code: 'flip', cue: 'k = image ÷ original' };
    if (it.form === 'img' && near(g, it.o / it.k)) return { code: 'div', cue: 'Image = k × original' };
    if (it.form === 'orig' && near(g, it.i * it.k)) return { code: 'mul', cue: 'Original = image ÷ k' };
    return { code: 'other', cue: 'image = k × original' };
  }

  /* SI2 missing side of similar triangles: △ABC ~ △DEF */
  const SIDES = [[3, 4, 5], [4, 6, 7], [5, 7, 8], [6, 8, 9], [4, 5, 6], [5, 6, 8], [7, 8, 10]];
  function genSide() {
    const [p, qq, rr] = shuffle(pick(SIDES)), k = pick([2, 3, 1.5, 2.5, 0.5]), ask = pick(['EF', 'DF']);
    return { AB: p, BC: qq, CA: rr, k, DE: p * k, ask, v: (ask === 'EF' ? qq : rr) * k };
  }
  function checkSide(it, r) {
    const g = r.v; if (near(g, it.v)) return { ok: true };
    const base = it.ask === 'EF' ? it.BC : it.CA, other = it.ask === 'EF' ? it.CA : it.BC;
    if (near(g, base / it.k)) return { code: 'flip', cue: 'k = DEF side ÷ ABC side' };
    if (near(g, other * it.k)) return { code: 'match', cue: it.ask + ' matches ' + (it.ask === 'EF' ? 'BC' : 'CA') };
    if (near(g, base + (it.DE - it.AB))) return { code: 'add', cue: 'Multiply by k, don’t add' };
    return { code: 'other', cue: 'k = DE ÷ AB, then × k' };
  }

  /* SI2 congruent, similar or neither? */
  function genSim() {
    const kind = pick(['cong', 'sim', 'sim', 'neither', 'neither']), shape = pick(['rect', 'tri']);
    const a = shape === 'rect' ? [rnd(2, 8), rnd(2, 8)] : pick(SIDES).slice();
    if (shape === 'rect' && a[0] === a[1]) a[1] += 1;
    let b;
    if (kind === 'cong') b = a.slice();
    else { const k = pick([2, 3, 1.5, 0.5, 2.5]); b = a.map(x => x * k); if (kind === 'neither') { const i = rnd(0, b.length - 1); b[i] += pick([1, 2, -1]); if (b[i] <= 0) b[i] += 3; } }
    return { kind, shape, a, b };
  }
  function checkSim(it, r) {
    if (r.v === it.kind) return { ok: true };
    return { code: 'pick', cue: { cong: 'Same size and shape: congruent', sim: 'Every ratio the same: similar', neither: 'Ratios differ: not similar' }[it.kind] };
  }

  /* SI3 which test? AA, SSS, SAS or not enough (SSA) */
  function genRule() {
    const rule = pick(['AA', 'SSS', 'SAS', 'none']), k = pick([2, 1.5, 3, 0.5]), A1 = rnd(35, 75), B1 = rnd(35, 70);
    const s = pick(SIDES);
    return { rule, k, A1, B1, s };
  }
  function checkRule(it, r) {
    if (r.v === it.rule) return { ok: true };
    return { code: 'pick', cue: { AA: 'Two angles match: AA', SSS: 'All three sides in the same ratio: SSS', SAS: 'Angle between the two sides: SAS', none: 'Angle not between the sides: not enough' }[it.rule] };
  }

  /* SI4 shadows */
  function genShadow() { for (;;) { const h = pick([1, 1.2, 1.5, 1.6, 1.8, 2]), s = pick([1.2, 1.5, 2, 2.4, 3]), S = rnd(4, 30), v = h * S / s; if (v >= 3 && v <= 30) return { h, s, S, v }; } }
  function checkShadow(it, r) {
    const g = r.v; if (near(g, it.v, Math.max(.05, it.v * .01))) return { ok: true };
    if (near(g, it.h * it.s / it.S, .05) || near(g, it.s * it.S / it.h, Math.max(.05, it.s * it.S / it.h * .01))) return { code: 'flip', cue: 'Height ÷ shadow is the same for both' };
    return { code: 'other', cue: 'h ÷ shadow = H ÷ Shadow' };
  }

  /* SI4 map scale 1 : n, map length in cm, real length in m */
  function genMap() { const n = pick([500, 1000, 2000, 2500, 5000, 10000, 25000, 50000]), m = rnd(3, 24) / 2; return { n, m, v: m * n / 100 }; }
  function checkMap(it, r) {
    const g = r.v; if (near(g, it.v, .005)) return { ok: true };
    if (near(g, it.m * it.n, .5)) return { code: 'cm', cue: 'That’s cm: ÷ 100 for metres' };
    if (near(g, it.m * it.n / 1000, .005) || near(g, it.m * it.n / 10, .05)) return { code: 'unit', cue: '100 cm in a metre' };
    if (near(g, it.m / it.n, .001)) return { code: 'div', cue: 'Real = map × ' + it.n };
    return { code: 'other', cue: 'map cm × ' + it.n + ', then ÷ 100' };
  }

  return { near, ans1, genProp, checkProp, genScale, checkScale, genSide, checkSide, genSim, checkSim, genRule, checkRule, genShadow, checkShadow, genMap, checkMap };
})();
/* ===================== MODEL END ===================== */

