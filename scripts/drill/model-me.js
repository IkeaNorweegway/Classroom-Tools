/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { val, rnd, pick, chance } = Q;
  const PI = Math.PI;
  // Answers with π are accepted to 0.2 % (π = 3.14 is off by 0.05 %), so rounding and 3.14 both pass.
  const tol = v => Math.max(.06, Math.abs(v) * .002);
  const near = (g, x) => g != null && Math.abs(val(g) - x) <= tol(x) + 1e-9;
  const ans1 = x => Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : (Math.round(x * 10) / 10).toFixed(1);
  const hit = (g, list) => list.find(([x]) => near(g, x));

  /* ME1 area of a 2D shape */
  function genArea() {
    const shape = pick(['rect', 'tri', 'tri', 'circle', 'circle', 'para']);
    if (shape === 'rect') { const l = rnd(3, 15), w = rnd(2, 12); return { shape, l, w, v: l * w }; }
    if (shape === 'tri') { const b = rnd(3, 16), h = rnd(2, 12); return { shape, b, h, v: b * h / 2 }; }
    if (shape === 'para') { const b = rnd(4, 14), h = rnd(2, 10), s = h + rnd(1, 4); return { shape, b, h, s, v: b * h }; }
    const r = rnd(2, 12), useD = chance(.4); return { shape, r, useD, v: PI * r * r };
  }
  function checkArea(it, r) {
    const g = r.v; if (near(g, it.v)) return { ok: true };
    const w = it.shape === 'tri' ? hit(g, [[it.b * it.h, 'Triangle: ½ × b × h']]) :
      it.shape === 'circle' ? hit(g, [[PI * 4 * it.r * it.r, 'Use the radius: half of d'], [2 * PI * it.r, 'That’s the circumference: πr²'], [PI * it.r, 'Square the radius: πr²'], [PI * it.r * 2, 'That’s the circumference: πr²']]) :
      it.shape === 'para' ? hit(g, [[it.b * it.s, 'Use the height, not the slant side'], [it.b * it.h / 2, 'Parallelogram: b × h, no ½']]) : null;
    if (w) return { code: 'named', cue: w[1] };
    return { code: 'other', cue: { rect: 'l × w', tri: '½ × b × h', circle: 'π × r × r', para: 'base × height' }[it.shape] };
  }

  /* ME2 surface area, ME3 volume: right prisms and cylinders */
  const TRIS = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15]];
  function genSolid() {
    const shape = pick(['box', 'box', 'cyl', 'cyl', 'tri']);
    if (shape === 'box') { const l = rnd(3, 12), w = rnd(2, 9), h = rnd(2, 10); return { shape, l, w, h }; }
    if (shape === 'cyl') { const r = rnd(2, 9), h = rnd(3, 15); return { shape, r, h, useD: chance(.35) }; }
    const [a, b, c] = pick(TRIS), L = rnd(4, 15); return { shape, a, b, c, L };
  }
  const SA = it => it.shape === 'box' ? 2 * (it.l * it.w + it.l * it.h + it.w * it.h) : it.shape === 'cyl' ? 2 * PI * it.r * it.r + 2 * PI * it.r * it.h : it.a * it.b + (it.a + it.b + it.c) * it.L;
  const VOL = it => it.shape === 'box' ? it.l * it.w * it.h : it.shape === 'cyl' ? PI * it.r * it.r * it.h : it.a * it.b / 2 * it.L;
  function genSA() { const it = genSolid(); it.v = SA(it); return it; }
  function genVol() { const it = genSolid(); it.v = VOL(it); return it; }
  function checkSA(it, r) {
    const g = r.v; if (near(g, it.v)) return { ok: true };
    if (near(g, VOL(it))) return { code: 'vol', cue: 'That’s volume. Add the face areas' };
    const w = it.shape === 'box' ? hit(g, [[it.v / 2, 'Each face has a twin: × 2']]) :
      it.shape === 'cyl' ? hit(g, [[PI * it.r * it.r + 2 * PI * it.r * it.h, 'Two circles: top and bottom'], [2 * PI * it.r * it.h, 'Add the two circles'], [2 * PI * 4 * it.r * it.r + 2 * PI * 2 * it.r * it.h, 'Use r, not d'], [2 * PI * 4 * it.r * it.r + 2 * PI * it.r * it.h, 'Use r, not d']]) :
      hit(g, [[it.a * it.b * 2 + (it.a + it.b + it.c) * it.L, 'Triangle: ½ × a × b each'], [it.a * it.b / 2 + (it.a + it.b + it.c) * it.L, 'Two triangles: front and back']]);
    if (w) return { code: 'named', cue: w[1] };
    return { code: 'other', cue: 'Unfold it: add every face' };
  }
  function checkVol(it, r) {
    const g = r.v; if (near(g, it.v)) return { ok: true };
    if (near(g, SA(it))) return { code: 'sa', cue: 'That’s surface area. V = B × h' };
    const w = it.shape === 'cyl' ? hit(g, [[PI * 4 * it.r * it.r * it.h, 'Use r, not d'], [2 * PI * it.r * it.h, 'Base is a circle: πr²'], [PI * it.r * it.h, 'Square the radius']]) :
      it.shape === 'tri' ? hit(g, [[it.a * it.b * it.L, 'Triangle base: ½ × a × b']]) :
      hit(g, [[it.l + it.w + it.h, 'Multiply, don’t add'], [(it.l * it.w) + it.h, 'Base area × height']]);
    if (w) return { code: 'named', cue: w[1] };
    return { code: 'other', cue: 'Base area × height' };
  }

  /* ME4 cones and pyramids: one third of the prism or cylinder */
  const SL = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]];
  function genThird() {
    const shape = pick(['cone', 'pyr']), [a, h, l] = pick(SL);   // a = radius (cone) or half the side (pyramid)
    return shape === 'cone' ? { shape, r: a, h, l, v: PI * a * a * h / 3 } : { shape, s: 2 * a, h, l, v: 4 * a * a * h / 3 };
  }
  function checkThird(it, r) {
    const g = r.v; if (near(g, it.v)) return { ok: true };
    const B = it.shape === 'cone' ? PI * it.r * it.r : it.s * it.s;
    const w = hit(g, [[B * it.h, 'Cone or pyramid: ⅓ of the cylinder'], [B * it.l / 3, 'Volume uses h, not the slant'], [B * it.h / 2, '⅓, not ½'], [B * it.l, 'Use h and ⅓']]);
    if (w) return { code: 'named', cue: w[1] };
    return { code: 'other', cue: '⅓ × base area × h' };
  }

  /* ME4 spheres */
  function genSphere() { const what = pick(['V', 'SA']), r = rnd(2, 10), useD = chance(.4); return { what, r, useD, v: what === 'V' ? 4 / 3 * PI * r * r * r : 4 * PI * r * r }; }
  function checkSphere(it, r) {
    const g = r.v, R = it.r; if (near(g, it.v)) return { ok: true };
    const d = 2 * R;
    const w = hit(g, it.what === 'V' ? [[4 / 3 * PI * d * d * d, 'Use r, half of d'], [4 * PI * R * R, 'That’s surface area: ⁴⁄₃πr³'], [PI * R * R * R, 'Don’t forget the ⁴⁄₃'], [4 * PI * R * R * R, '⁴⁄₃, not 4']] :
      [[4 * PI * d * d, 'Use r, half of d'], [4 / 3 * PI * R * R * R, 'That’s volume: 4πr²'], [PI * R * R, 'Four circles: 4πr²']]);
    if (w) return { code: 'named', cue: w[1] };
    return { code: 'other', cue: it.what === 'V' ? '⁴⁄₃ × π × r³' : '4 × π × r²' };
  }

  /* ME5 composite: a small box glued on a big one */
  function genComp() {
    const L = rnd(6, 12), W = rnd(5, 10), H = rnd(2, 6), l = rnd(2, L - 2), w = rnd(2, W - 2), h = rnd(2, 6);
    const s1 = 2 * (L * W + L * H + W * H), s2 = 2 * (l * w + l * h + w * h);
    return { L, W, H, l, w, h, s1, s2, v: s1 + s2 - 2 * l * w };
  }
  function checkComp(it, r) {
    const g = r.v; if (near(g, it.v)) return { ok: true };
    if (near(g, it.s1 + it.s2)) return { code: 'nohide', cue: 'The glued faces are hidden' };
    if (near(g, it.s1 + it.s2 - it.l * it.w)) return { code: 'once', cue: 'Hidden on both boxes: 2 ×' };
    if (near(g, it.L * it.W * it.H + it.l * it.w * it.h)) return { code: 'vol', cue: 'That’s volume. Add the faces' };
    return { code: 'other', cue: 'Both surfaces, minus 2 × glued' };
  }

  /* SA or V? */
  const JOBS = [['🎨', 'Paint a water tank', 'sa'], ['💧', 'Fill a pool', 'v'], ['🎁', 'Wrap a gift box', 'sa'], ['⛱', 'Sand for a sandbox', 'v'], ['🥫', 'Label around a can', 'sa'], ['🎈', 'Air in a ball', 'v'], ['🌾', 'Grain in an elevator', 'v'], ['🏠', 'Shingles for a roof', 'sa'], ['🧊', 'Ice in a cube tray', 'v'], ['🎂', 'Icing on a cake', 'sa'], ['⛽', 'Gas in a tank', 'v'], ['📦', 'Cardboard for a box', 'sa']];
  function genJob() { const [icon, text, ans] = pick(JOBS); return { icon, text, ans }; }
  function checkJob(it, r) {
    if (r.v === it.ans) return { ok: true };
    return it.ans === 'sa' ? { code: 'saidv', cue: 'Covers the outside: surface area' } : { code: 'saidsa', cue: 'Fills the inside: volume' };
  }

  return { PI, tol, near, ans1, genArea, checkArea, genSA, checkSA, genVol, checkVol, SA, VOL, genThird, checkThird, genSphere, checkSphere, genComp, checkComp, genJob, checkJob };
})();
/* ===================== MODEL END ===================== */

