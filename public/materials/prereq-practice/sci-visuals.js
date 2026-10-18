// Small diagrams for the science prereq banks (sci6-bank.js, sci7-bank.js).
// Each function returns one SVG string. A bank sets it as `visual` on a skill (shown with
// every question in that skill) or on one question; the engine shows it under the question.
// Colours and fonts are v-* classes in practice.css, so the SVGs carry geometry only.
// A diagram shows the situation in the question, never the answer.
(function () {
'use strict';

// ─── Drawing kit ───
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const r = v => Math.round(v * 10) / 10;
const pts = list => list.map(p => r(p[0]) + ',' + r(p[1])).join(' ');
const deg = a => a * Math.PI / 180;

function svg(w, h, label, body) {
  return `<svg viewBox="0 0 ${r(w)} ${r(h)}" width="${Math.round(w * 1.15)}" height="${Math.round(h * 1.15)}" role="img" aria-label="${esc(label)}">${body}</svg>`;
}
function tx(x, y, s, cls, anchor) {
  return `<text x="${r(x)}" y="${r(y)}" class="${cls}" text-anchor="${anchor}">${esc(s)}</text>`;
}
const T = (x, y, s, cls) => tx(x, y, s, cls || 'v-t', 'middle');
const TL = (x, y, s, cls) => tx(x, y, s, cls || 'v-t', 'start');
const TR = (x, y, s, cls) => tx(x, y, s, cls || 'v-t', 'end');
const Q = (x, y) => T(x, y, '?', 'v-tq');
const ln = (x1, y1, x2, y2, cls) => `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" class="${cls || 'v-ln'}"/>`;
const rc = (x, y, w, h, cls, rx) => `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}"${rx ? ` rx="${rx}"` : ''} class="${cls || 'v-sh'}"/>`;
const ci = (cx, cy, rad, cls) => `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(rad)}" class="${cls || 'v-sh'}"/>`;
const el = (cx, cy, rx, ry, cls) => `<ellipse cx="${r(cx)}" cy="${r(cy)}" rx="${r(rx)}" ry="${r(ry)}" class="${cls || 'v-sh'}"/>`;
const pa = (d, cls) => `<path d="${d}" class="${cls || 'v-ln'}"/>`;
const pg = (list, cls) => `<polygon points="${pts(list)}" class="${cls || 'v-sh'}"/>`;
const pl = (list, cls) => `<polyline points="${pts(list)}" class="${cls || 'v-ln'}"/>`;

const KIND = { ac: ['v-ac', 'v-acf'], ln: ['v-ln', 'v-ink'], mut: ['v-mut', 'v-mutf'], sun: ['v-ray', 'v-rayf'], blue: ['v-bluel', 'v-bluef'] };
function head(x, y, ang, kind) {
  const hl = 9, hw = 5, c = Math.cos(ang), s = Math.sin(ang);
  const bx = x - hl * c, by = y - hl * s;
  return pg([[x, y], [bx - hw * s, by + hw * c], [bx + hw * s, by - hw * c]], KIND[kind || 'ac'][1]);
}
/** A straight arrow from (x1, y1) to the tip at (x2, y2). */
function arrow(x1, y1, x2, y2, kind) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  return ln(x1, y1, x2 - 8 * Math.cos(ang), y2 - 8 * Math.sin(ang), KIND[kind || 'ac'][0]) + head(x2, y2, ang, kind);
}
/** A curved arrow: quadratic from (x1, y1) bending toward (cx, cy), tip at (x2, y2). */
function curve(x1, y1, cx, cy, x2, y2, kind) {
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const ex = x2 - 8 * Math.cos(ang), ey = y2 - 8 * Math.sin(ang);
  return pa(`M${r(x1)},${r(y1)} Q${r(cx)},${r(cy)} ${r(ex)},${r(ey)}`, KIND[kind || 'ac'][0]) + head(x2, y2, ang, kind);
}
/** An arc arrow round (cx, cy), from angle a0 to a1 in degrees (screen angles: 90 is straight down). */
function arc(cx, cy, rad, a0, a1, kind) {
  const P = a => [cx + rad * Math.cos(deg(a)), cy + rad * Math.sin(deg(a))];
  const dir = a1 > a0 ? 1 : -1;
  const stop = a1 - dir * (9 / rad) * 180 / Math.PI;
  const [x0, y0] = P(a0), [xe, ye] = P(stop), [xt, yt] = P(a1);
  const big = Math.abs(stop - a0) > 180 ? 1 : 0;
  return pa(`M${r(x0)},${r(y0)} A${rad},${rad} 0 ${big},${dir > 0 ? 1 : 0} ${r(xe)},${r(ye)}`, KIND[kind || 'ac'][0]) +
    head(xt, yt, Math.atan2(yt - ye, xt - xe), kind);
}
const textW = (s, size) => String(s).length * (size || 13) * 0.56;
/** A rounded label box centred on (cx, cy). Returns { s: svg, w: width }. */
function pill(cx, cy, label, cls) {
  const w = Math.max(40, textW(label) + 20);
  return { s: rc(cx - w / 2, cy - 14, w, 28, cls || 'v-pill', 14) + T(cx, cy + 4.5, label), w };
}
function fmt(v) {
  const s = String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (v < 0 ? '−' : '') + (Math.abs(v) >= 10000 ? s.replace(/ /g, ' ') : s.replace(/ /g, ''));
}

// ─── Small figures ───
function person(x, g, pose) {
  let b = ci(x, g - 60, 7, 'v-sh') + ln(x, g - 53, x, g - 26);
  if (pose === 'run') {
    b += ln(x, g - 26, x - 14, g - 3) + ln(x, g - 26, x + 10, g - 12) + ln(x + 10, g - 12, x + 16, g) +
      ln(x, g - 46, x - 13, g - 36) + ln(x, g - 46, x + 13, g - 52);
  } else if (pose === 'jump') {
    b += ln(x, g - 26, x - 10, g - 14) + ln(x - 10, g - 14, x - 6, g) + ln(x, g - 26, x + 10, g - 14) + ln(x + 10, g - 14, x + 6, g) +
      ln(x, g - 46, x - 13, g - 62) + ln(x, g - 46, x + 13, g - 62);
  } else {
    b += ln(x, g - 26, x - 9, g) + ln(x, g - 26, x + 9, g) + ln(x, g - 46, x + 20, g - 40) + ln(x, g - 46, x + 18, g - 35);
  }
  return b;
}
function apple(cx, cy, s) {
  const k = v => r(v);
  return pa(`M${k(cx)},${k(cy - s * 0.7)} C${k(cx - s * 0.4)},${k(cy - s * 1.1)} ${k(cx - s * 1.1)},${k(cy - s * 0.9)} ${k(cx - s)},${k(cy - s * 0.1)}` +
    ` C${k(cx - s * 0.95)},${k(cy + s * 0.8)} ${k(cx - s * 0.35)},${k(cy + s * 1.05)} ${k(cx)},${k(cy + s * 0.85)}` +
    ` C${k(cx + s * 0.35)},${k(cy + s * 1.05)} ${k(cx + s * 0.95)},${k(cy + s * 0.8)} ${k(cx + s)},${k(cy - s * 0.1)}` +
    ` C${k(cx + s * 1.1)},${k(cy - s * 0.9)} ${k(cx + s * 0.4)},${k(cy - s * 1.1)} ${k(cx)},${k(cy - s * 0.7)}Z`, 'v-apple') +
    ln(cx, cy - s * 0.7, cx + s * 0.15, cy - s * 1.15, 'v-twig') +
    pa(`M${k(cx + s * 0.12)},${k(cy - s)} q${k(s * 0.5)},${k(-s * 0.4)} ${k(s * 0.8)},${k(-s * 0.08)} q${k(-s * 0.45)},${k(s * 0.32)} ${k(-s * 0.8)},${k(s * 0.08)}Z`, 'v-leaf');
}
function bag(cx, by, w, h, cls) {
  return pa(`M${r(cx - w * 0.28)},${r(by - h)} L${r(cx + w * 0.28)},${r(by - h)} L${r(cx + w / 2)},${r(by - 10)} Q${r(cx + w / 2)},${r(by)} ${r(cx + w / 2 - 10)},${r(by)}` +
    ` L${r(cx - w / 2 + 10)},${r(by)} Q${r(cx - w / 2)},${r(by)} ${r(cx - w / 2)},${r(by - 10)}Z`, cls || 'v-bag') +
    ln(cx - w * 0.3, by - h + 6, cx + w * 0.3, by - h + 6, 'v-lnb');
}
function sun(cx, cy, rad) {
  let b = '';
  for (let a = 0; a < 360; a += 45) {
    const c = Math.cos(deg(a)), s = Math.sin(deg(a));
    b += ln(cx + c * (rad + 4), cy + s * (rad + 4), cx + c * (rad + 11), cy + s * (rad + 11), 'v-ray');
  }
  return b + ci(cx, cy, rad, 'v-sun');
}
function drop(cx, cy, s, cls) {
  return pa(`M${r(cx)},${r(cy - s)} C${r(cx + s * 0.2)},${r(cy - s * 0.5)} ${r(cx + s * 0.75)},${r(cy)} ${r(cx + s * 0.75)},${r(cy + s * 0.35)}` +
    ` A${r(s * 0.75)},${r(s * 0.75)} 0 0,1 ${r(cx - s * 0.75)},${r(cy + s * 0.35)} C${r(cx - s * 0.75)},${r(cy)} ${r(cx - s * 0.2)},${r(cy - s * 0.5)} ${r(cx)},${r(cy - s)}Z`, cls || 'v-water');
}
function steam(cx, cy) {
  let b = '';
  [-14, 0, 14].forEach(dx => {
    const x = cx + dx;
    b += pa(`M${x},${cy + 24} q-7,-8 0,-16 q7,-8 0,-16 q-7,-8 0,-16`, 'v-steam');
  });
  return b;
}
function leafShape(x, y, dx, dy, cls) {
  const mx = x + dx / 2, my = y + dy / 2, nx = -dy * 0.32, ny = dx * 0.32;
  return pa(`M${r(x)},${r(y)} Q${r(mx + nx)},${r(my + ny)} ${r(x + dx)},${r(y + dy)} Q${r(mx - nx)},${r(my - ny)} ${r(x)},${r(y)}Z`, cls || 'v-leaf');
}
function ground(x1, x2, y) {
  let b = ln(x1, y, x2, y, 'v-lnb');
  for (let x = x1 + 6; x < x2; x += 12) b += ln(x, y + 1, x - 7, y + 8, 'v-mut');
  return b;
}
function car(x, gy, cls) {
  return pa(`M${x},${gy - 10} L${x},${gy - 26} Q${x},${gy - 30} ${x + 6},${gy - 30} L${x + 18},${gy - 30} L${x + 28},${gy - 44} L${x + 62},${gy - 44} L${x + 74},${gy - 30}` +
    ` L${x + 90},${gy - 30} Q${x + 96},${gy - 30} ${x + 96},${gy - 24} L${x + 96},${gy - 10}Z`, cls) +
    ci(x + 22, gy - 8, 8, 'v-tire') + ci(x + 74, gy - 8, 8, 'v-tire');
}
function hare(cx, gy, cls) {
  return el(cx - 6, gy - 16, 22, 15, cls) + ci(cx + 16, gy - 30, 10, cls) +
    el(cx + 12, gy - 52, 4, 14, cls) + el(cx + 21, gy - 51, 4, 13, cls) + ci(cx + 20, gy - 32, 1.6, 'v-ink') +
    el(cx - 26, gy - 18, 5, 5, cls);
}

// ─── Reading scales ───
/** A horizontal thermometer. { min, max, step, every, value, marks: [[v, text]], unit } */
function thermometer(o) {
  const x0 = 74, x1 = 318, y = 52;
  const xs = v => x0 + (v - o.min) / (o.max - o.min) * (x1 - x0);
  let b = rc(46, y - 8, x1 - 46 + 14, 16, 'v-glass', 8) + rc(44, y - 3.5, xs(o.value) - 44, 7, 'v-redf') + ci(42, y, 14, 'v-red');
  for (let i = 0; o.min + i * o.step <= o.max + 1e-9; i++) {
    const v = r(o.min + i * o.step), x = xs(v), major = Math.abs(v / o.every - Math.round(v / o.every)) < 1e-9;
    b += ln(x, y - 8, x, y - (major ? 20 : 14), major ? 'v-ln' : 'v-tick');
    if (major) b += T(x, y - 26, fmt(v), 'v-ts');
  }
  const unit = o.unit || '°C', said = unit === '?' ? 'degrees (unit hidden)' : unit;
  b += T(350, y + 5, unit, unit === '?' ? 'v-tq' : 'v-tb');
  (o.marks || []).forEach(([v, s]) => { b += ln(xs(v), y + 9, xs(v), y + 17, 'v-ln') + T(xs(v), y + 31, s, 'v-ts'); });
  return svg(360, o.marks ? 92 : 72, `Thermometer from ${fmt(o.min)} to ${fmt(o.max)} ${said}, each small line ${o.step}. Read where the red liquid stops.`, b);
}
/** A number line. { min, max, step, every, points: [[v, label]], ends: [left, right], jump: label } */
function numberLine(o) {
  const x0 = 34, x1 = 326, y = o.jump ? 60 : 46;
  const xs = v => x0 + (v - o.min) / (o.max - o.min) * (x1 - x0);
  let b = ln(x0 - 10, y, x1 + 10, y, 'v-lnb');
  for (let i = 0; o.min + i * o.step <= o.max + 1e-9; i++) {
    const v = o.min + i * o.step, x = xs(v), major = Math.abs(v / o.every - Math.round(v / o.every)) < 1e-9;
    b += ln(x, y - (major ? 7 : 4), x, y + (major ? 7 : 4), major ? 'v-ln' : 'v-tick');
    if (major) b += T(x, y + 22, fmt(v), 'v-ts');
  }
  if (o.jump) {
    const a = xs(o.points[0][0]), c = xs(o.points[1][0]);
    b += curve(a, y - 9, (a + c) / 2, y - 52, c, y - 9, 'ac') + T((a + c) / 2, y - 38, o.jump, 'v-ta');
  }
  o.points.forEach(([v, s]) => { b += ci(xs(v), y, 5.5, 'v-dotac') + (s ? T(xs(v), o.jump ? y + 40 : y - 15, s, 'v-ta') : ''); });
  let h = o.jump ? y + 48 : y + 32;
  if (o.ends) { h += 8; b += TL(x0 - 10, h - 4, '← ' + o.ends[0], 'v-ts') + TR(x1 + 10, h - 4, o.ends[1] + ' →', 'v-ts'); }
  return svg(360, h, `Number line from ${fmt(o.min)} to ${fmt(o.max)} with ${o.points.map(p => fmt(p[0])).join(' and ')} marked.`, b);
}
/** A bar graph. { bars: [[label, value]], min, max, grid, unit } */
function barChart(o) {
  const top = 26, bot = 148, x0 = 52, x1 = 346;
  const ys = v => top + (o.max - v) / (o.max - o.min) * (bot - top);
  let b = TR(x0 - 6, 14, o.unit, 'v-ts');
  for (let g = o.min; g <= o.max; g += o.grid) b += ln(x0, ys(g), x1, ys(g), g === 0 ? 'v-ln' : 'v-grid') + TR(x0 - 6, ys(g) + 4, fmt(g), 'v-ts');
  const slot = (x1 - x0) / o.bars.length, bw = Math.min(46, slot * 0.55);
  o.bars.forEach(([label, v], i) => {
    const cx = x0 + slot * (i + 0.5), y0 = ys(Math.max(0, v)), y1 = ys(Math.min(0, v));
    b += rc(cx - bw / 2, y0, bw, Math.max(1, y1 - y0), 'v-bar') + T(cx, v >= 0 ? y0 - 5 : y1 + 14, fmt(v), 'v-tb') + T(cx, bot + 19, label);
  });
  return svg(360, bot + 28, 'Bar graph: ' + o.bars.map(([l, v]) => `${l} ${fmt(v)} ${o.unit}`).join(', ') + '.', b);
}
/** Boxes joined by arrows, left to right. names: [...]; opts: { hi: index to highlight, under: [labels], q: index shown as ? } */
function chain(names, opts) {
  const o = opts || {}, gap = 30;
  const ws = names.map(n => Math.max(48, textW(n) + 20));
  const rowW = list => list.reduce((a, b) => a + b, 0) + gap * (list.length - 1) + 20;
  const split = rowW(ws) > 360 ? Math.ceil(names.length / 2) : names.length;
  let x = 10, y = 34, b = '', W = 0;
  names.forEach((n, i) => {
    if (i === split) { // wrap: an elbow arrow from the end of row 1 down to the start of row 2
      const lastX = x - gap - ws[i - 1] / 2;
      b += pa(`M${r(lastX)},${y + 15} V${y + 32} H${r(10 + ws[i] / 2)} V${y + 50}`, 'v-ln') + head(10 + ws[i] / 2, y + 58, Math.PI / 2, 'ln');
      x = 10; y += 74;
    }
    const w = ws[i], cx = x + w / 2;
    b += rc(x, y - 15, w, 30, i === o.hi ? 'v-pill-ac' : 'v-pill', 8) + (n === '?' ? Q(cx, y + 6) : T(cx, y + 4.5, n));
    if (o.under && o.under[i]) b += T(cx, y + 34, o.under[i], o.under[i] === '?' ? 'v-tq' : 'v-ts');
    if (i < names.length - 1 && i !== split - 1) b += arrow(x + w + 4, y, x + w + gap - 4, y, 'ln');
    x += w + gap;
    W = Math.max(W, x - gap + 10);
  });
  return svg(Math.max(W, 200), y + (o.under ? 44 : 22), 'Food chain: ' + names.join(' → ') + '.', b);
}
/** things → [step] → result, e.g. a process with its name hidden. */
function flow(froms, step, to, opts) {
  const o = opts || {}, n = froms.length, h = Math.max(70, n * 36 + 16);
  const lw = Math.max(...froms.map(f => textW(f))) + 22, rw = textW(to) + 22, sw = Math.max(54, textW(step) + 18);
  const W = lw + rw + sw + 2 * 46 + 20, my = h / 2;
  let b = '';
  froms.forEach((f, i) => {
    const y = my + (i - (n - 1) / 2) * 36;
    b += rc(10, y - 14, lw, 28, o.fromCls || 'v-pill', 8) + T(10 + lw / 2, y + 4.5, f);
    b += ln(10 + lw + 2, y, 10 + lw + 30, my, 'v-ln');
  });
  const sx = 10 + lw + 30;
  b += arrow(sx, my, sx + 16, my, 'ln');
  b += rc(sx + 16, my - 17, sw, 34, 'v-pill-ac', 17) + T(sx + 16 + sw / 2, my + 5.5, step, step === '?' ? 'v-tq' : 'v-ta');
  b += arrow(sx + 16 + sw, my, sx + 16 + sw + 30, my, 'ln');
  b += rc(sx + sw + 46, my - 14, rw, 28, o.toCls || 'v-pill', 8) + T(sx + sw + 46 + rw / 2, my + 4.5, to, to === '?' ? 'v-tq' : 'v-t');
  return svg(W, h, `${froms.join(' and ')}, then ${step === '?' ? 'a step to name' : step}, gives ${to === '?' ? 'something to name' : to}.`, b);
}
/** Sort a thing into one of two groups: item pill on top, two bins below. */
function sortBins(item, left, right) {
  const p = pill(180, 22, item, 'v-pill-ac');
  let b = p.s + curve(160, 38, 110, 52, 96, 72, 'mut') + curve(200, 38, 250, 52, 264, 72, 'mut');
  [[96, left], [264, right]].forEach(([cx, [title, sub]]) => {
    b += rc(cx - 78, 76, 156, 56, 'v-bin', 10) + T(cx, 98, title, 'v-tb') + T(cx, 117, sub, 'v-ts');
  });
  return svg(360, 140, `Sort ${item} into one of two groups: ${left[0]} (${left[1]}) or ${right[0]} (${right[1]}).`, b);
}

// ═════════════ Grade 6 ═════════════

// Matter
function statesJars() {
  let b = '';
  [30, 140, 250].forEach((x, i) => {
    b += pa(`M${x},18 L${x},104 Q${x},112 ${x + 8},112 L${x + 72},112 Q${x + 80},112 ${x + 80},104 L${x + 80},18`, 'v-jar');
    if (i === 0) b += rc(x + 20, 70, 40, 41, 'v-block', 3);
    if (i === 1) b += pa(`M${x + 1},76 L${x + 79},76 L${x + 79},104 Q${x + 79},111 ${x + 72},111 L${x + 8},111 Q${x + 1},111 ${x + 1},104Z`, 'v-water');
    if (i === 2) [[14, 30], [44, 24], [66, 40], [24, 58], [54, 64], [12, 88], [40, 96], [68, 84], [34, 42]].forEach(([dx, dy]) => { b += ci(x + dx, dy, 4.5, 'v-gas'); });
  });
  [['keeps its', 'own shape'], ['takes the', 'jar’s shape'], ['spreads to', 'fill the jar']].forEach(([a, c], i) => {
    b += T(70 + i * 110, 130, a, 'v-ts') + T(70 + i * 110, 144, c, 'v-ts');
  });
  return svg(360, 150, 'Three jars: a block that keeps its own shape, a liquid that takes the jar’s shape, and gas particles that spread to fill the jar.', b);
}
function waterStrip(arrows) {
  let b = rc(40, 34, 48, 48, 'v-ice', 6) + pa('M48,44 l12,0 M48,52 l7,0', 'v-shine');
  b += drop(180, 56, 26) + steam(304, 32);
  b += T(64, 104, 'ice', 'v-ts') + T(180, 104, 'water', 'v-ts') + T(304, 104, 'steam', 'v-ts');
  if (arrows === 'freeze') {
    b += arrow(148, 58, 98, 58, 'ac') + T(124, 46, '?', 'v-tq');
    return svg(360, 112, 'Liquid water turning into ice. The name of this change is hidden.', b);
  }
  b += arrow(98, 52, 146, 52, 'ln') + arrow(146, 64, 98, 64, 'ln') + T(122, 40, '? °C', 'v-ta');
  b += arrow(214, 52, 272, 52, 'ln') + arrow(272, 64, 214, 64, 'ln') + T(243, 40, '? °C', 'v-ta');
  return svg(360, 112, 'Ice, liquid water and steam, with arrows between them. The temperature of each change is hidden.', b);
}
function massApple() {
  const b = apple(90, 62, 30) + arrow(140, 62, 210, 62, 'ln') + rc(222, 40, 104, 44, 'v-screen', 8) + T(274, 69, '152 g', 'v-tb') +
    T(180, 116, 'Which tool gives this number?', 'v-ts');
  return svg(360, 124, 'An apple, and a reading of 152 grams.', b);
}
function balanceKg() {
  let b = ln(70, 46, 290, 46, 'v-lnb') + pg([[180, 46], [168, 120], [192, 120]], 'v-sh') + ln(150, 120, 210, 120, 'v-lnb');
  b += ln(90, 46, 70, 84) + ln(90, 46, 110, 84) + ln(270, 46, 250, 84) + ln(270, 46, 290, 84);
  b += pa('M62,84 L118,84 Q90,100 62,84Z', 'v-sh') + pa('M242,84 L298,84 Q270,100 242,84Z', 'v-sh');
  b += bag(90, 84, 40, 36) + T(90, 75, '1 kg', 'v-tb');
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4 - i; j++) b += rc(253 + j * 9 + i * 4.5, 76 - i * 9, 8, 8, 'v-block', 1);
  b += T(270, 116, '? pieces of 1 g', 'v-ta');
  return svg(360, 128, 'A balance, level: a 1 kilogram bag on one side and a pile of 1 gram pieces on the other. The number of pieces is hidden.', b);
}
function feathersRocks() {
  let b = bag(100, 112, 110, 86, 'v-bag-soft') + T(100, 72, '1 kg', 'v-tb') + T(100, 90, 'feathers', 'v-ts');
  b += bag(260, 112, 70, 52, 'v-bag') + T(260, 90, '500 g', 'v-tb') + T(260, 105, 'rocks', 'v-ts');
  return svg(360, 120, 'A big bag holding 1 kilogram of feathers and a small bag holding 500 grams of rocks.', b);
}
function appleUnit() {
  return svg(360, 110, 'An apple with a tag reading: about 150, unit hidden.',
    apple(130, 58, 34) + ln(166, 46, 196, 38, 'v-ln') + rc(196, 22, 112, 34, 'v-tag', 6) + T(252, 45, 'about 150 ?', 'v-tb'));
}

// Forces
function pushPull() {
  let b = ground(10, 350, 104);
  b += person(30, 104, 'reach') + rc(52, 62, 50, 42, 'v-block', 3) + arrow(60, 48, 122, 48, 'ac') + T(88, 128, 'push: away from you', 'v-ts');
  b += person(208, 104, 'reach') + ln(228, 66, 268, 80, 'v-rope') + rc(268, 62, 50, 42, 'v-block', 3) + arrow(316, 48, 252, 48, 'ac') + T(262, 128, 'pull: toward you', 'v-ts');
  return svg(360, 136, 'A person pushing a box away from them, and a person pulling a box toward them with a rope.', b);
}
function dropBall() {
  return svg(360, 120, 'A ball held up high, just let go, with the ground below.',
    ground(40, 320, 108) + ci(180, 30, 13, 'v-ball') + TL(200, 35, 'let go', 'v-ts') + Q(180, 76));
}
function bookTable() {
  let b = rc(110, 74, 140, 9, 'v-wood', 2) + ln(122, 83, 122, 120, 'v-lnb') + ln(238, 83, 238, 120, 'v-lnb') + ground(70, 290, 120);
  b += rc(145, 58, 70, 16, 'v-book', 2) + arrow(262, 100, 262, 66, 'ln') + TL(270, 88, 'table pushes up', 'v-ts') + Q(180, 44);
  return svg(360, 128, 'A book sitting still on a table. An arrow shows the table pushing up on the book. The question mark asks about gravity.', b);
}
function jumper() {
  return svg(360, 132, 'A person in the air after jumping, above the ground. A dashed path shows the jump going up and coming back down.',
    ground(40, 320, 122) + pa('M80,122 Q180,-30 280,122', 'v-dash') + person(180, 92, 'jump') + Q(250, 54));
}
function surfaces() {
  let b = rc(30, 22, 60, 30, 'v-block', 3) + ln(10, 53, 170, 53, 'v-lnb') + T(90, 76, 'smooth', 'v-ts');
  let teeth = 'M190,53';
  for (let x = 190; x < 350; x += 8) teeth += ` L${x + 4},45 L${x + 8},53`;
  b += rc(210, 15, 60, 30, 'v-block', 3) + pa(teeth, 'v-ln') + T(270, 76, 'rough', 'v-ts');
  return svg(360, 84, 'A block on a smooth surface and a block on a rough, bumpy surface.', b);
}
function puck() {
  let b = rc(10, 66, 340, 18, 'v-ice', 2);
  [40, 120, 180, 222, 250, 264].forEach((x, i) => { b += el(x, 58, 18, 6, i === 5 ? 'v-puck' : 'v-puck-ghost'); });
  b += arrow(40, 30, 130, 30, 'ln') + TL(40, 20, 'moving', 'v-ts') + TL(250, 30, 'stops', 'v-ts');
  return svg(360, 92, 'A hockey puck sliding on ice. Each step it moves less, until it stops.', b);
}
function bootSole() {
  let b = pa('M120,24 L170,24 L172,74 L250,82 Q262,84 262,96 L118,96Z', 'v-boot');
  let sole = 'M116,96';
  for (let x = 116; x < 264; x += 12) sole += ` q6,12 12,0`;
  b += pa(sole, 'v-lnb') + rc(40, 112, 280, 10, 'v-ice', 2) + T(300, 60, 'deep, bumpy', 'v-ts') + T(300, 74, 'sole', 'v-ts') + ln(278, 82, 262, 100, 'v-mut');
  return svg(360, 130, 'A winter boot from the side, with a deep, bumpy sole, standing on ice.', b);
}
function arrowsAB() {
  let b = rc(30, 18, 44, 34, 'v-block', 3) + arrow(74, 35, 124, 35, 'ac') + TL(132, 40, 'A', 'v-tb');
  b += rc(30, 70, 44, 34, 'v-block', 3) + arrow(74, 87, 174, 87, 'ac') + TL(182, 92, 'B', 'v-tb');
  b += T(270, 40, '2 cm', 'v-ts') + T(270, 92, '4 cm', 'v-ts');
  return svg(360, 116, 'Two force arrows: A is 2 centimetres long and B is 4 centimetres long.', b);
}
function arrowRight() {
  return svg(360, 90, 'A box on the floor with a force arrow pointing to the right.',
    ground(40, 320, 70) + rc(110, 30, 60, 40, 'v-block', 3) + arrow(170, 50, 250, 50, 'ac'));
}
function appleFalls() {
  return svg(360, 120, 'An apple in the air above the ground. Where should the gravity arrow go?',
    ground(60, 300, 108) + apple(180, 40, 18) + Q(220, 46));
}
function shapesSquareTriangle() {
  let b = '';
  const sq = [[50, 40], [130, 40], [130, 120], [50, 120]], tr = [[270, 40], [310, 120], [230, 120]];
  b += pg(sq, 'v-frame') + pg(tr, 'v-frame');
  sq.concat(tr).forEach(([x, y]) => { b += ci(x, y, 4, 'v-ink'); });
  b += arrow(50, 6, 50, 32, 'ac') + arrow(270, 6, 270, 32, 'ac');
  b += T(90, 142, 'square', 'v-ts') + T(270, 142, 'triangle', 'v-ts');
  return svg(360, 150, 'A square frame and a triangle frame, each with a push on its top corner.', b);
}
function tippingTower() {
  let b = ground(80, 280, 132);
  b += `<g transform="rotate(8 180 132)">` + [0, 1, 2, 3, 4].map(i => rc(168, 108 - i * 24, 24, 24, 'v-paper', 1)).join('') + `</g>`;
  b += arc(180, 132, 112, -100, -66, 'mut') + TL(232, 34, 'tips over', 'v-ts');
  return svg(360, 140, 'A tall, narrow paper tower leaning and tipping over.', b);
}

// Living systems
function livingChecklist() {
  let b = ln(28, 76, 92, 76, 'v-soilline') + ln(36, 76, 36, 64, 'v-stemp') + leafShape(36, 66, 9, -6) + ln(72, 76, 72, 40, 'v-stemp') + leafShape(72, 60, 15, -9) + leafShape(72, 50, -14, -8) + arrow(46, 62, 60, 52, 'mut');
  b += drop(180, 50, 20);
  b += ci(270, 52, 14, 'v-gas') + ci(304, 62, 8, 'v-gas') + ci(326, 64, 7, 'v-gas');
  b += T(60, 100, 'grows', 'v-ts') + T(180, 100, 'needs food', 'v-ts') + T(180, 114, 'and water', 'v-ts') + T(296, 100, 'makes more', 'v-ts') + T(296, 114, 'of its kind', 'v-ts');
  return svg(360, 120, 'Three signs of a living thing: it grows, it needs food and water, and it makes more of its own kind.', b);
}
function plantFig(cx, gy, o) {
  o = o || {};
  let b = '';
  if (o.soil !== false) b += rc(cx - 90, gy, 180, 46, 'v-soil');
  if (o.drops) [[-60, 18], [-30, 34], [40, 22], [64, 36], [10, 40]].forEach(([dx, dy]) => { b += drop(cx + dx, gy + dy, 5); });
  b += pa(`M${cx},${gy} q-12,18 -26,28 M${cx},${gy} q2,22 -4,38 M${cx},${gy} q14,16 28,26 M${cx - 13},${gy + 15} q-10,4 -16,14 M${cx + 14},${gy + 14} q8,8 8,18`, o.hi === 'roots' ? 'v-roots-ac' : 'v-roots');
  b += pa(`M${cx},${gy} Q${cx - 4},${gy - 50} ${cx},${gy - 96}`, o.hi === 'stem' ? 'v-stem-ac' : 'v-stemp');
  const lc = o.hi === 'leaves' ? 'v-leaf-ac' : 'v-leaf';
  b += leafShape(cx - 2, gy - 40, -42, -14, lc) + leafShape(cx - 1, gy - 64, 40, -14, lc);
  if (!o.noFlower) {
    const fy = gy - 106, pc = o.hi === 'flower' ? 'v-petal-ac' : 'v-petal';
    for (let a = 0; a < 360; a += 60) b += ci(cx + 10 * Math.cos(deg(a)), fy + 10 * Math.sin(deg(a)), 8, pc);
    b += ci(cx, fy, 6, 'v-yellow');
  }
  if (o.seeds) [[-34, -100], [-42, -86], [-30, -78]].forEach(([dx, dy]) => { b += el(cx + dx, gy + dy, 4, 6, o.hi === 'seeds' ? 'v-seed-ac' : 'v-seed'); });
  return b;
}
const PLANT_PART = { roots: [55, 26], stem: [8, -24], leaves: [36, -74], flower: [14, -110], seeds: [-44, -86] };
function plantParts(hi, label) {
  const cx = 150, gy = 130;
  let b = plantFig(cx, gy, { hi, seeds: true });
  if (hi) {
    const [dx, dy] = PLANT_PART[hi], px = cx + dx, py = gy + dy, ly = Math.max(py, 40);
    b += dx < 0 ? ln(px - 6, py, 50, ly, 'v-ac') + TR(44, ly + 5, label || '?', label ? 'v-ta' : 'v-tq')
      : ln(px + 6, py, 262, ly, 'v-ac') + TL(268, ly + 5, label || '?', label ? 'v-ta' : 'v-tq');
  }
  return svg(360, 182, hi ? `A plant with its ${hi} picked out.` : 'A plant with roots, stem, leaves, a flower and seeds.', b);
}
function plantNeeds() {
  let b = plantFig(180, 120, { noFlower: false });
  b += arrow(60, 40, 132, 66, 'mut') + Q(46, 40) + arrow(300, 40, 228, 66, 'mut') + Q(314, 40) + arrow(56, 116, 120, 100, 'mut') + Q(42, 122);
  return svg(360, 172, 'A plant growing in soil, with arrows asking what it needs.', b);
}
function plantRootsWater() {
  return svg(360, 180, 'A plant with its underground parts in soil. Drops of water are in the soil.', plantFig(180, 120, { drops: true }) + TL(276, 150, 'water in soil', 'v-ts'));
}
function darkCloset() {
  let b = rc(110, 14, 140, 132, 'v-dark', 4) + ln(180, 14, 180, 146, 'v-door') + ci(170, 84, 3, 'v-knob') + ci(190, 84, 3, 'v-knob');
  b += T(180, 166, 'closed closet, 2 weeks', 'v-ts');
  return svg(360, 174, 'A plant shut inside a dark closet for two weeks.', b);
}
function eats(foods, eater) {
  const n = foods.length, rowH = 34, h = Math.max(n * rowH + 40, 90), my = (n * rowH) / 2 + 10;
  const fw = Math.max(...foods.map(f => textW(f[0]))) + 24;
  let b = '';
  foods.forEach(([name, kind], i) => {
    const y = 10 + rowH * i + rowH / 2;
    b += rc(16, y - 13, fw, 26, kind === 'plant' ? 'v-pill-plant' : 'v-pill-animal', 8) + T(16 + fw / 2, y + 4.5, name);
    b += arrow(16 + fw + 4, y, 196, my, 'ln');
  });
  const ew = textW(eater) + 30;
  b += rc(200, my - 17, ew, 34, 'v-pill-ac', 10) + T(200 + ew / 2, my + 5, eater, 'v-tb');
  const ly = h - 10;
  b += rc(16, ly - 9, 12, 12, 'v-pill-plant', 3) + TL(32, ly + 1, 'plant', 'v-ts') + rc(82, ly - 9, 12, 12, 'v-pill-animal', 3) + TL(98, ly + 1, 'animal', 'v-ts');
  return svg(360, h, `What the ${eater} eats: ${foods.map(f => f[0] + ' (' + f[1] + ')').join(', ')}.`, b);
}
function furFat() {
  let b = rc(60, 24, 200, 30, 'v-fur', 4);
  for (let x = 66; x < 258; x += 8) b += pa(`M${x},54 q4,-14 0,-28`, 'v-furline');
  b += rc(60, 54, 200, 28, 'v-fat') + rc(60, 82, 200, 34, 'v-body');
  b += TL(272, 44, 'thick fur', 'v-t') + TL(272, 73, 'layer of fat', 'v-t') + TL(272, 104, 'body', 'v-ts');
  return svg(360, 124, 'A slice through a polar bear’s skin: thick fur on the outside, a layer of fat, then the body.', b);
}
function cactus() {
  let b = ln(40, 150, 320, 150, 'v-sandline');
  b += pa('M160,150 L160,40 Q160,22 180,22 Q200,22 200,40 L200,150Z', 'v-cactus');
  b += pa('M160,96 L140,96 Q128,96 128,84 L128,64', 'v-cactus-arm') + pa('M200,82 L222,82 Q234,82 234,70 L234,52', 'v-cactus-arm');
  b += rc(168, 50, 24, 96, 'v-water', 10) + TL(244, 112, 'water stored', 'v-ts') + TL(244, 126, 'in the stem', 'v-ts') + ln(240, 116, 196, 110, 'v-mut');
  return svg(360, 160, 'A cactus with water stored inside its thick stem.', b);
}
function hares() {
  return svg(360, 110, 'A snowshoe hare: brown in summer, white in winter.',
    hare(100, 86, 'v-hare-brown') + hare(260, 86, 'v-hare-white') + ln(40, 86, 320, 86, 'v-mut') + T(100, 104, 'summer', 'v-ts') + T(260, 104, 'winter', 'v-ts'));
}

// Climate
function risingTemp() {
  return numberLine({ min: -5, max: 10, step: 1, every: 5, points: [[-3, 'morning'], [5, 'afternoon']], jump: '? degrees' });
}
function sunArcs() {
  let b = ground(20, 340, 120);
  b += pa('M40,120 Q180,-40 320,120', 'v-sunpath') + pa('M120,120 Q180,70 240,120', 'v-sunpath');
  b += ci(180, 40, 10, 'v-sun') + ci(180, 95, 8, 'v-sun');
  b += T(180, 22, 'long day: up early, sets late', 'v-ts') + T(180, 146, 'short day: up late, sets early', 'v-ts');
  return svg(360, 152, 'The Sun’s path across the sky on a long day (high and wide) and on a short day (low and short).', b);
}
function seasonWheel() {
  let b = ci(180, 80, 56, 'v-dash');
  b += arc(180, 80, 56, -70, -20, 'mut') + arc(180, 80, 56, 20, 70, 'mut') + arc(180, 80, 56, 110, 160, 'mut') + arc(180, 80, 56, 200, 250, 'mut');
  b += pill(180, 24, 'spring').s + pill(258, 80, 'summer').s + pill(180, 136, 'fall', 'v-pill-ac').s + rc(78, 66, 48, 28, 'v-pill', 14) + Q(102, 86);
  return svg(360, 160, 'The seasons in a circle: spring, summer, fall, then a hidden season.', b);
}
function heatToEarth() {
  let b = ci(270, 70, 50, 'v-earth') + T(270, 75, 'Earth', 'v-tw');
  [36, 70, 104].forEach(y => { b += pa(`M20,${y} q10,-8 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0`, 'v-ray') + head(212, y, 0, 'sun'); });
  b += TL(10, 136, 'heat and light come from ?', 'v-ts');
  return svg(360, 144, 'Wavy arrows of heat and light reaching Earth from the left. Where they come from is hidden.', b);
}
function twoCars() {
  let b = sun(180, 22, 14) + ground(20, 340, 132);
  [[86, 106], [180, 98], [274, 106]].forEach(([x, y]) => { b += arrow(180 + (x - 180) * 0.25, 46, x, y, 'sun'); });
  b += car(30, 132, 'v-car-dark') + car(234, 132, 'v-car-light');
  b += T(78, 152, 'black car', 'v-ts') + T(282, 152, 'white car', 'v-ts');
  return svg(360, 158, 'Sunlight falling on a black car and a white car parked side by side.', b);
}
function sunriseAfternoon() {
  let b = ground(20, 340, 120) + pa('M40,120 Q180,-30 320,120', 'v-sunpath');
  b += ci(54, 106, 10, 'v-sun') + ci(214, 46, 12, 'v-sun');
  b += T(54, 140, 'sunrise', 'v-ts') + T(214, 22, '2 p.m.', 'v-ts');
  return svg(360, 148, 'The Sun low on the horizon at sunrise, and high in the sky at 2 p.m.', b);
}
function balloons() {
  let b = pa('M70,96 q-14,-18 0,-30 q16,-6 14,16 q-2,10 -14,14Z', 'v-balloon') + ln(70, 96, 70, 128, 'v-string');
  b += arrow(110, 80, 190, 80, 'ln') + T(150, 70, 'blow in air', 'v-ts');
  b += el(262, 66, 40, 48, 'v-balloon') + pg([[262, 114], [256, 122], [268, 122]], 'v-balloon') + ln(262, 122, 262, 140, 'v-string');
  return svg(360, 148, 'A flat, empty balloon, then the same balloon blown up with air.', b);
}
function breathing() {
  let b = ci(250, 70, 34, 'v-sh') + ci(238, 60, 3, 'v-ink') + pa('M222,82 q4,4 10,2', 'v-ln');
  [[70, 48], [92, 70], [60, 86], [110, 46], [118, 92], [84, 104]].forEach(([x, y]) => { b += ci(x, y, 5, 'v-gas'); });
  b += T(90, 130, 'air', 'v-ts') + arrow(140, 76, 212, 80, 'ac') + T(176, 64, 'breathe in ?', 'v-ta');
  return svg(360, 140, 'A person breathing in air. Which gas in the air they need is hidden.', b);
}
function weatherTools() {
  let b = '';
  // thermometer
  b += rc(41, 18, 14, 80, 'v-glass', 7) + rc(45, 50, 6, 50, 'v-redf') + ci(48, 102, 11, 'v-red');
  for (let y = 26; y < 92; y += 10) b += ln(56, y, 62, y, 'v-tick');
  // rain gauge
  b += rc(124, 30, 36, 80, 'v-glass', 3) + rc(126, 76, 32, 32, 'v-waterf') + pa('M114,22 L170,22 L160,32 L124,32Z', 'v-sh');
  for (let y = 42; y < 108; y += 12) b += ln(124, y, 132, y, 'v-tick');
  // wind vane
  b += ln(236, 40, 236, 112, 'v-lnb') + arrow(206, 40, 268, 40, 'ln') + pg([[202, 30], [214, 40], [202, 50]], 'v-sh');
  // anemometer
  b += ln(318, 52, 318, 112, 'v-lnb') + ln(290, 46, 346, 46, 'v-ln') + ln(318, 30, 318, 62, 'v-ln');
  [[290, 46, 0], [346, 46, 180], [318, 30, 90]].forEach(([x, y]) => { b += ci(x, y, 7, 'v-cup'); });
  b += T(48, 132, 'thermometer', 'v-ts') + T(142, 132, 'rain gauge', 'v-ts') + T(236, 132, 'wind vane', 'v-ts') + T(318, 132, 'anemometer', 'v-ts');
  return svg(360, 140, 'Four weather tools: a thermometer, a rain gauge, a wind vane and an anemometer with spinning cups.', b);
}

// Energy resources
function bulb() {
  let b = '';
  for (let a = -160; a <= -20; a += 35) b += ln(150 + 40 * Math.cos(deg(a)), 56 + 40 * Math.sin(deg(a)), 150 + 56 * Math.cos(deg(a)), 56 + 56 * Math.sin(deg(a)), 'v-ray');
  b += ci(150, 56, 30, 'v-bulb') + rc(136, 84, 28, 20, 'v-metal', 3) + ln(136, 91, 164, 91, 'v-tick') + ln(136, 97, 164, 97, 'v-tick');
  b += TL(220, 50, 'light', 'v-tb') + TL(220, 74, '+ ?', 'v-tq');
  return svg(360, 112, 'A glowing light bulb giving off light, and something else that is hidden.', b);
}
function speaker() {
  let b = rc(90, 20, 70, 90, 'v-sh', 8) + ci(125, 76, 22, 'v-metal') + ci(125, 76, 8, 'v-ink') + ci(125, 38, 8, 'v-metal');
  [24, 40, 56].forEach(d => { b += pa(`M${170 + d},${50} q12,15 0,30`, 'v-ac'); });
  b += Q(262, 72);
  return svg(360, 120, 'A speaker sending out waves. The kind of energy is hidden.', b);
}
function runner() {
  return svg(360, 112, 'A child running. Where their energy comes from is hidden.',
    ground(40, 320, 98) + person(150, 98, 'run') + pa('M100,50 l-20,0 M104,62 l-26,0 M100,74 l-18,0', 'v-mut') + TL(200, 50, 'energy', 'v-ta') + TL(200, 70, 'from ?', 'v-tq'));
}
function timeBars() {
  let b = TL(14, 22, 'A person’s lifetime: about 80 years', 'v-ts') + rc(14, 30, 3, 14, 'v-bar-ac');
  b += TL(14, 70, 'Time to form deep underground: millions of years', 'v-ts') + rc(14, 78, 332, 14, 'v-bar');
  return svg(360, 104, 'Two time bars: a lifetime of about 80 years is a tiny sliver next to millions of years.', b);
}
function circuit() {
  let b = pa('M60,40 L300,40 L300,120 L60,120Z', 'v-wire');
  b += rc(46, 64, 28, 32, 'v-battery', 3) + ln(52, 62, 68, 62, 'v-lnb');
  b += ci(300, 80, 16, 'v-bulb-on');
  for (let a = -40; a <= 40; a += 40) b += ln(300 + 20 * Math.cos(deg(a)), 80 + 20 * Math.sin(deg(a)), 300 + 30 * Math.cos(deg(a)), 80 + 30 * Math.sin(deg(a)), 'v-ray');
  b += ci(150, 40, 4, 'v-ink') + ci(200, 40, 4, 'v-ink') + rc(150, 34, 50, 12, 'v-gapfill') + ln(150, 40, 200, 40, 'v-lnb');
  b += arrow(110, 30, 136, 30, 'mut') + arrow(240, 130, 214, 130, 'mut');
  b += T(28, 112, 'battery', 'v-ts') + T(175, 24, 'switch', 'v-ts') + TL(258, 140, 'bulb', 'v-ts');
  return svg(360, 148, 'A battery, a switch and a bulb joined in one loop of wire. The switch is on and the bulb is lit. Small arrows show electricity flowing round the loop.', b);
}
function wallPlug() {
  let b = rc(40, 24, 70, 92, 'v-sh', 8) + rc(62, 50, 6, 16, 'v-ink', 1) + rc(82, 50, 6, 16, 'v-ink', 1) + ci(75, 84, 4, 'v-ink');
  b += rc(112, 46, 32, 24, 'v-sh', 4) + pa('M144,58 C200,58 190,110 260,100', 'v-cord');
  b += T(75, 136, 'wall outlet', 'v-ts');
  return svg(360, 144, 'A plug in a wall outlet, with its cord leading off.', b);
}
function sandToBottle() {
  let b = pa('M20,96 Q55,52 90,96Z', 'v-sand');
  [[40, 86], [55, 76], [70, 88], [50, 92]].forEach(([x, y]) => { b += ci(x, y, 1.6, 'v-ink'); });
  b += arrow(98, 82, 128, 82, 'ln');
  b += pa('M136,96 L136,56 L156,46 L156,56 L176,46 L176,56 L196,46 L196,96Z', 'v-sh') + rc(200, 30, 12, 66, 'v-sh') + pa('M206,24 q6,-8 0,-14 q-6,-6 2,-12', 'v-steam');
  b += arrow(218, 82, 248, 82, 'ln');
  b += pa('M276,96 L276,62 Q276,52 284,46 L284,30 L296,30 L296,46 Q304,52 304,62 L304,96Z', 'v-glassb');
  b += T(55, 118, 'sand', 'v-ts') + T(55, 132, '(from nature)', 'v-ts') + T(172, 118, 'factory', 'v-ts') + T(290, 118, 'glass bottle', 'v-ts') + T(290, 132, '(made by people)', 'v-ts');
  return svg(360, 140, 'Sand from nature goes to a factory and is made into a glass bottle.', b);
}
function oilWell() {
  let b = rc(10, 40, 340, 26, 'v-soil') + rc(10, 66, 340, 30, 'v-rock') + rc(10, 96, 340, 22, 'v-soil');
  b += rc(10, 118, 340, 30, 'v-rock-dark') + el(200, 132, 80, 13, 'v-oil') + ln(200, 40, 200, 126, 'v-pipe');
  b += pg([[200, 40], [186, 16], [214, 16]], 'v-sh') + ln(170, 12, 240, 22, 'v-lnb');
  b += TL(246, 24, 'pumped up', 'v-ts') + T(250, 138, '?', 'v-tq-w');
  return svg(360, 154, 'A well pumping something up from deep underground, through layers of soil and rock.', b);
}
function tChart() {
  let b = ln(180, 14, 180, 120, 'v-lnb') + ln(20, 44, 340, 44, 'v-lnb');
  b += T(100, 34, '+  advantage', 'v-tb') + T(260, 34, '−  disadvantage', 'v-tb') + T(100, 64, 'a good point', 'v-ts') + T(260, 64, 'a bad point', 'v-ts');
  [86, 106].forEach(y => { b += ln(40, y, 160, y, 'v-grid') + ln(200, y, 320, y, 'v-grid'); });
  return svg(360, 126, 'A T-chart with two columns: advantage, a good point, and disadvantage, a bad point.', b);
}

// Space
function sunEarth(o) {
  o = o || {};
  let b = ci(-34, 80, 74, 'v-sun') + T(14, 85, 'Sun', 'v-tb');
  [44, 80, 116].forEach(y => { b += arrow(56, y, 180, y, 'sun'); });
  b += ci(250, 80, 52, 'v-earth') + pa('M250,28 A52,52 0 0,1 250,132Z', 'v-night');
  if (o.labels) b += T(222, 84, 'day', 'v-tw') + T(278, 84, 'night', 'v-tw');
  if (o.spin) b += arc(250, 80, 64, 150, 30, 'ac') + T(250, 170, o.spin, 'v-ta');
  if (o.here) b += ci(198, 80, 5, 'v-dotac') + TR(190, 64, o.here, 'v-ta') + ci(302, 80, 5, 'v-dotac') + TL(310, 64, o.there, o.there === '?' ? 'v-tq' : 'v-ta');
  return svg(360, o.spin ? 180 : 160, 'The Sun shining on Earth from the left. The half of Earth facing the Sun is lit; the far half is dark.', b);
}
function orbit(o) {
  const cx = 180, cy = 78, rx = 136, ry = 52, P = a => [cx + rx * Math.cos(deg(a)), cy + ry * Math.sin(deg(a))];
  let b = el(cx, cy, rx, ry, 'v-dash');
  b += o.center === '?' ? ci(cx, cy, 22, 'v-qc') + Q(cx, cy + 6) : o.center === 'Earth' ? ci(cx, cy, 20, 'v-earth') + T(cx, cy + 40, 'Earth', 'v-ts') : sun(cx, cy, 20);
  const [ex, ey] = P(50), [ax, ay] = P(20), [bx, by] = P(-12);
  b += o.moon ? ci(ex, ey, 9, 'v-moon') : ci(ex, ey, 12, 'v-earth');
  b += curve(ax + 10, ay + 4, P(5)[0] + 18, P(5)[1], bx + 10, by - 4, 'ac');
  if (o.spin) b += arc(ex, ey, 20, 200, 340, 'ln') + TL(ex + 20, ey + 26, 'spin', 'v-ts') + TR(P(200)[0], P(200)[1] + 22, 'orbit', 'v-ts');
  if (o.text) b += T(cx, 152, o.text, 'v-ta');
  return svg(360, 160, `${o.moon ? 'The Moon' : 'Earth'} on a dashed path around ${o.center === '?' ? 'something hidden' : o.center === 'Earth' ? 'Earth' : 'the Sun'}.`, b);
}
function moonSunlight() {
  let b = ci(-34, 80, 74, 'v-sun') + T(14, 85, 'Sun', 'v-tb');
  [56, 80, 104].forEach(y => { b += arrow(56, y, 148, y, 'sun'); });
  b += ci(170, 80, 18, 'v-moon-dark') + pa('M170,62 A18,18 0 0,0 170,98Z', 'v-moon');
  b += ci(300, 80, 30, 'v-earth') + T(300, 128, 'Earth (night side)', 'v-ts') + T(170, 128, 'Moon', 'v-ts');
  return svg(360, 140, 'Sunlight reaching the Moon. The side of the Moon facing the Sun is bright. Earth is off to the right.', b);
}
function earthMoonPull() {
  let b = el(180, 80, 120, 50, 'v-dash') + ci(180, 80, 28, 'v-earth') + ci(300, 80, 10, 'v-moon');
  b += arrow(288, 80, 218, 80, 'ac') + T(254, 68, '?', 'v-tq') + T(180, 124, 'Earth', 'v-ts') + T(300, 102, 'Moon', 'v-ts');
  return svg(360, 140, 'The Moon on its path around Earth, with an arrow from the Moon toward Earth. The name of the force is hidden.', b);
}
function twoObjects() {
  return svg(360, 90, 'Two objects, A and B, out in space, with a question about how gravity acts between them.',
    ci(100, 45, 24, 'v-ball') + T(100, 50, 'A', 'v-tb') + ci(260, 45, 18, 'v-ball') + T(260, 50, 'B', 'v-tb') + Q(180, 52));
}
function sunVsMoon() {
  return svg(360, 160, 'The edge of the huge Sun next to the tiny Moon, drawn roughly to scale.',
    ci(-420, 80, 560, 'v-sun') + T(70, 85, 'Sun', 'v-tb') + ci(280, 80, 1.6, 'v-moon') + ln(280, 84, 280, 110, 'v-mut') + T(280, 126, 'Moon', 'v-ts'));
}
function placeValue(rows) {
  const groups = ['millions', 'thousands', 'ones'], cw = 26, gx = [40, 140, 240];
  let b = '';
  groups.forEach((g, i) => { b += T(gx[i] + cw * 1.5, 18, g, 'v-tb'); ['H', 'T', 'O'].forEach((c, j) => { b += T(gx[i] + cw * j + cw / 2, 36, c, 'v-ts'); }); });
  rows.forEach((num, ri) => {
    const y = 44 + ri * 34, digits = num.replace(/\D/g, '');
    for (let k = 0; k < 9; k++) {
      const gi = Math.floor(k / 3), x = gx[gi] + cw * (k % 3);
      b += rc(x + 1, y, cw - 2, 28, 'v-cell', 3);
      const d = digits[digits.length - 9 + k];
      if (d !== undefined) b += T(x + cw / 2, y + 19.5, d, 'v-tb');
    }
  });
  return svg(360, 50 + rows.length * 34, 'A place value chart with millions, thousands and ones.' + (rows.some(Boolean) ? ' Numbers shown: ' + rows.filter(Boolean).join(', ') + '.' : ' The boxes are empty.'), b);
}
function roundingLine() {
  return numberLine({ min: 300000, max: 400000, step: 10000, every: 50000, points: [[384000, '384 000']] });
}

// ═════════════ Matter, plants, forces and land (both banks) ═════════════

/** A leaf making food. which: 'in', 'out' or 'all' hides that group; a list hides those names. */
function leafIO(which) {
  const ins = ['sunlight', 'water', 'carbon dioxide'];
  const hidden = n => Array.isArray(which) ? which.includes(n) : which === 'all' || (which === 'in') === ins.includes(n);
  const lab = (x, y, n) => TL(x, y, hidden(n) ? '?' : n, hidden(n) ? 'v-tq' : 'v-t');
  let b = leafShape(130, 80, 100, 0, 'v-leaf') + ln(130, 80, 230, 80, 'v-vein') + ln(100, 80, 130, 80, 'v-stemp');
  b += arrow(70, 20, 128, 58, 'sun') + lab(16, 18, 'sunlight');
  b += arrow(40, 80, 96, 80, 'blue') + lab(16, 72, 'water');
  b += arrow(70, 140, 132, 102, 'mut') + lab(16, 150, 'carbon dioxide');
  b += arrow(234, 64, 284, 36, 'ac') + lab(290, 34, 'oxygen');
  b += arrow(234, 96, 284, 124, 'ac') + lab(290, 132, 'sugar');
  const shown = ins.concat(['oxygen', 'sugar']).filter(n => !hidden(n));
  return svg(360, 160, 'A leaf making food: three things go in and two come out. Shown: ' + (shown.join(', ') || 'none') + '; the rest are hidden.', b);
}
function germinating() {
  let b = rc(20, 90, 320, 50, 'v-soil');
  b += el(120, 106, 16, 10, 'v-seed') + el(240, 110, 16, 10, 'v-seed');
  b += pa('M240,116 q-2,14 4,22 M236,116 q-8,8 -10,18', 'v-roots') + pa('M244,102 q6,-16 0,-40', 'v-stemp') + leafShape(244, 66, -16, -10) + leafShape(244, 66, 16, -10);
  b += arrow(150, 106, 210, 106, 'ln') + Q(180, 94);
  return svg(360, 148, 'A seed in the soil, then the same seed starting to grow a root and a shoot.', b);
}
function particleBox(x, y, kind, w, h) {
  w = w || 96; h = h || 86;
  let b = rc(x, y, w, h, 'v-sh', 6);
  if (kind === 'solid') for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) b += ci(x + 18 + i * 20, y + h - 16 - j * 20, 8, 'v-dot');
  if (kind === 'liquid') [[16, 70], [34, 72], [52, 68], [72, 71], [24, 54], [44, 52], [64, 55], [82, 58], [30, 37], [56, 38]].forEach(([dx, dy]) => { b += ci(x + dx * w / 96, y + dy * h / 86, 8, 'v-dot'); });
  if (kind === 'gas') [[18, 18, 1, 1], [72, 22, -1, 1], [44, 48, 1, -1], [20, 72, 1, 0], [78, 68, -1, -1]].forEach(([dx, dy, mx, my]) => {
    const px = x + dx * w / 96, py = y + dy * h / 86;
    b += ln(px - mx * 13, py - my * 13, px - mx * 6, py - my * 6, 'v-mut') + ci(px, py, 8, 'v-dot');
  });
  return b;
}
function particles(kind) {
  if (kind) return svg(360, 106, 'Particles in a box, arranged as described.', particleBox(132, 10, kind));
  let b = '';
  ['solid', 'liquid', 'gas'].forEach((k, i) => { b += particleBox(20 + i * 116, 10, k) + T(68 + i * 116, 116, k, 'v-ts'); });
  return svg(360, 124, 'Particles in a solid, a liquid and a gas.', b);
}
function particleHeat(k) {
  if (k === 'heat') {
    let b = particleBox(132, 8, 'liquid');
    b += pa('M166,128 q-10,-14 0,-26 q4,10 10,4 q6,12 -2,22Z M190,128 q-8,-12 0,-22 q6,10 8,22Z', 'v-flame') + Q(250, 56) + TL(240, 76, 'particles?', 'v-ts');
    return svg(360, 136, 'Particles in a box being heated by a flame underneath.', b);
  }
  if (k === 'cool') return svg(360, 136, 'Particles in a box sitting on ice, being cooled.', particleBox(132, 8, 'liquid') + rc(118, 100, 124, 22, 'v-ice', 4) + Q(260, 56) + TL(250, 76, 'particles?', 'v-ts'));
  if (k === 'spaces') return svg(360, 124, 'Particles in a liquid and in a gas.', particleBox(60, 10, 'liquid') + particleBox(204, 10, 'gas') + T(108, 116, 'liquid', 'v-ts') + T(252, 116, 'gas', 'v-ts'));
  return particles();
}
function stateCycle(from, to) {
  const X = { solid: 54, liquid: 180, gas: 306 }, y = 44;
  let b = '';
  Object.keys(X).forEach(k => { b += pill(X[k], y, k, (k === from || k === to) ? 'v-pill-ac' : 'v-pill').s; });
  const pairs = [['solid', 'liquid', -1], ['liquid', 'gas', -1], ['liquid', 'solid', 1], ['gas', 'liquid', 1]];
  pairs.forEach(([a, c, side]) => {
    const on = a === from && c === to, x1 = X[a] + (X[c] > X[a] ? 42 : -42), x2 = X[c] + (X[c] > X[a] ? -42 : 42), yy = y + side * 8;
    b += arrow(x1, yy, x2, yy, on ? 'ac' : 'mut');
    if (on) b += Q((x1 + x2) / 2, yy + (side < 0 ? -8 : 22));
  });
  return svg(360, 84, `Solid, liquid and gas, with arrows for each change. The ${from} to ${to} arrow is picked out; its name is hidden.`, b);
}
function internalForce(f) {
  let b = '';
  if (f === 'tension') b = rc(110, 46, 140, 24, 'v-block', 3) + arrow(108, 58, 50, 58, 'ac') + arrow(252, 58, 310, 58, 'ac');
  if (f === 'compression') b = rc(110, 46, 140, 24, 'v-block', 3) + arrow(50, 58, 106, 58, 'ac') + arrow(310, 58, 254, 58, 'ac');
  if (f === 'shear') b = rc(110, 30, 140, 24, 'v-block', 3) + rc(110, 54, 140, 24, 'v-block', 3) + arrow(50, 42, 106, 42, 'ac') + arrow(310, 66, 254, 66, 'ac');
  if (f === 'torsion') b = rc(110, 40, 140, 36, 'v-block', 8) + el(110, 58, 8, 18, 'v-sh') + arc(84, 58, 22, 210, 330, 'ac') + arc(276, 58, 22, 30, 150, 'ac');
  return svg(360, 112, 'A bar with forces acting on it, as described.', b);
}
function weatheringVis(term) {
  let b = '';
  if (term === 'weathering') b = ground(30, 330, 110) + pa('M110,110 L120,50 L170,34 L230,52 L250,110Z', 'v-rock') + pa('M170,36 L176,62 L166,80 L180,108 M210,48 L206,74', 'v-crack') + pg([[260, 110], [268, 98], [280, 110]], 'v-rock') + pg([[88, 110], [96, 100], [104, 110]], 'v-rock');
  if (term === 'erosion') { b = pa('M10,90 Q120,70 200,92 T350,86 L350,118 L10,118Z', 'v-water'); [[60, 96], [120, 92], [180, 98], [240, 96]].forEach(([x, y]) => { b += el(x, y, 6, 4, 'v-rock'); }); b += arrow(60, 60, 290, 60, 'ac') + pg([[10, 90], [40, 40], [70, 84]], 'v-rock'); }
  if (term === 'deposition') { b = pa('M10,60 Q100,50 180,66 L180,96 Q100,90 10,96Z', 'v-water') + rc(180, 56, 170, 50, 'v-water'); b += pa('M200,106 Q260,70 340,106Z', 'v-sand'); [[220, 100], [250, 92], [280, 88], [310, 96], [236, 76], [290, 70]].forEach(([x, y]) => { b += el(x, y, 5, 3.5, 'v-rock'); }); b += arrow(30, 40, 150, 40, 'ln') + T(90, 30, 'river slows', 'v-ts'); }
  return svg(360, 126, term === 'weathering' ? 'A rock cracking and breaking into pieces where it sits.' : term === 'erosion' ? 'A river carrying broken bits of rock downstream.' : 'Where the river slows down, bits of rock and sand settle to the bottom.', b);
}

// ═════════════ Science 7 (Grade 6 ideas) ═════════════

function animalNeeds() {
  let b = pill(180, 70, 'deer', 'v-pill-ac').s;
  [[56, 24], [304, 24], [56, 118], [304, 118]].forEach(([x, y]) => {
    b += arrow(x < 180 ? x + 18 : x - 18, y < 70 ? y + 4 : y - 10, x < 180 ? 144 : 216, y < 70 ? 58 : 82, 'mut') + Q(x, y + 6);
  });
  return svg(360, 140, 'A deer with four arrows pointing to it, asking what it needs to survive.', b);
}
function cellsZoom() {
  let b = leafShape(20, 74, 130, 0) + ln(20, 74, 150, 74, 'v-vein') + rc(96, 66, 16, 16, 'v-zoombox', 2);
  b += ln(112, 66, 244, 22, 'v-mut') + ln(112, 82, 244, 126, 'v-mut') + ci(262, 74, 58, 'v-lens');
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const x = 223 + i * 26, y = 35 + j * 26;
    b += rc(x, y, 24, 24, 'v-plantcell', 4) + ci(x + 8, y + 9, 3, 'v-nucleus');
  }
  b += T(85, 128, 'leaf', 'v-ts') + T(262, 150, 'a tiny piece, under a microscope', 'v-ts');
  return svg(360, 158, 'A leaf, and a tiny piece of it under a microscope: it is made of many small box-shaped parts.', b);
}
function expandBar() {
  let b = rc(60, 24, 200, 22, 'v-metal', 3) + TL(272, 40, 'cold', 'v-ts');
  b += rc(60, 74, 224, 22, 'v-hot', 3) + rc(60, 74, 200, 22, 'v-dashbox', 3) + TL(296, 90, 'hot', 'v-ts');
  b += pa('M110,124 q-6,-8 0,-14 M150,124 q-6,-8 0,-14 M190,124 q-6,-8 0,-14 M230,124 q-6,-8 0,-14', 'v-heat');
  return svg(360, 132, 'The same metal bar cold and then heated. The hot bar is a little longer than the dashed outline of the cold one.', b);
}
function sidewalkGaps() {
  let b = sun(316, 28, 13) + ground(10, 290, 96);
  [16, 106, 196].forEach(x => { b += rc(x, 72, 84, 24, 'v-concrete', 2); });
  [103, 193].forEach(x => { b += ln(x, 66, x, 50, 'v-mut') + T(x, 44, 'gap', 'v-ts'); });
  return svg(360, 108, 'Concrete sidewalk slabs in the hot sun, with small gaps between them.', b);
}
function elasticPlastic() {
  let b = el(66, 36, 50, 9, 'v-band-dash') + arrow(124, 36, 160, 36, 'ln') + T(142, 24, 'let go', 'v-ts') + el(196, 36, 22, 12, 'v-band') + TL(252, 41, 'rubber band', 'v-ts');
  b += ci(66, 100, 18, 'v-clay') + arrow(124, 100, 160, 100, 'ln') + T(142, 88, 'press', 'v-ts') + el(196, 108, 32, 9, 'v-clay') + TL(252, 105, 'clay', 'v-ts');
  return svg(360, 128, 'A stretched rubber band is let go, and a ball of clay is pressed flat. What shape is each left in?', b);
}
function rulerVis(len) {
  const x0 = 30, k = 29;
  let b = rc(x0 - 10, 56, 10 * k + 20, 34, 'v-wood', 3) + rc(x0, 22, len * k, 34, 'v-block', 2);
  for (let i = 0; i <= 20; i++) {
    const x = x0 + i * k / 2;
    b += ln(x, 56, x, 56 + (i % 2 ? 7 : 13), i % 2 ? 'v-tick' : 'v-ln');
    if (i % 2 === 0) b += T(x, 84, i / 2, 'v-ts');
  }
  return svg(360, 100, 'A block lying on a ruler marked in centimetres, from 0 to 10. Its left end is at 0.', b + TL(x0 + 10 * k + 14, 84, 'cm', 'v-ts'));
}
function rockSamples() {
  let b = el(50, 70, 32, 22, 'v-rock');
  b += pg([[108, 82], [114, 56], [126, 62], [134, 46], [148, 58], [166, 52], [172, 74], [160, 92], [130, 94]], 'v-rock');
  b += rc(200, 50, 64, 44, 'v-sand', 8) + ln(200, 64, 264, 62, 'v-mut') + ln(200, 78, 264, 80, 'v-mut');
  b += pg([[290, 90], [292, 62], [312, 46], [338, 58], [340, 88]], 'v-metallic') + pa('M306,58 l6,14 M324,56 l4,10', 'v-shine');
  return svg(360, 112, 'Four different rocks: smooth and round, rough and jagged, striped in layers, and shiny.', b);
}
function fossilVis() {
  let b = rc(30, 20, 300, 100, 'v-rock', 6) + ln(30, 48, 330, 46, 'v-mut') + ln(30, 96, 330, 98, 'v-mut');
  b += pa('M120,72 a4,4 0 1,1 8,0 a8,8 0 1,1 -16,0 a12,12 0 1,1 24,0 a16,16 0 1,1 -32,0', 'v-fossil');
  b += ci(236, 86, 6, 'v-fossil') + ln(236, 80, 236, 56, 'v-fossil') + ln(236, 80, 220, 60, 'v-fossil') + ln(236, 80, 252, 60, 'v-fossil');
  return svg(360, 132, 'A block of rock with a spiral shell shape and a three-toed footprint pressed into it.', b);
}
function mapVis(o) {
  o = o || {};
  let b = rc(14, 12, 222, 126, 'v-mapbg', 6) + pa('M14,82 C80,60 140,104 236,72', 'v-river');
  [[78, 52], [98, 42], [120, 54]].forEach(([x, y]) => { b += pg([[x, y - 14], [x - 13, y + 8], [x + 13, y + 8]], 'v-mountain'); });
  b += ci(48, 112, 5, 'v-ink') + TL(56, 116, 'A', 'v-tb') + ci(208, 112, 5, 'v-ink') + TL(214, 116, 'B', 'v-tb');
  if (o.scale) b += ln(68, 112, 200, 112, 'v-dash') + T(128, 104, '4 cm on the map', 'v-ts') + rc(14, 148, 40, 6, 'v-ink') + TL(60, 155, '1 cm = 1 km', 'v-ts');
  b += ci(300, 40, 24, 'v-sh') + ln(300, 20, 300, 60) + ln(280, 40, 320, 40) + pg([[300, 16], [295, 28], [305, 28]], 'v-ink');
  b += (o.north === '?' ? Q(300, 12) : T(300, 12, 'N', 'v-tb')) + T(300, 78, 'S', 'v-ts') + TL(328, 44, 'E', 'v-ts') + TR(272, 44, 'W', 'v-ts');
  b += rc(250, 90, 100, 70, 'v-sh', 6) + TL(258, 106, 'Key', 'v-tb') + pg([[264, 112], [258, 122], [270, 122]], 'v-mountain') + TL(278, 122, 'mountain', 'v-ts');
  b += pa('M256,134 q6,-6 12,0', 'v-river') + TL(278, 137, 'river', 'v-ts') + ci(264, 150, 4, 'v-ink') + TL(278, 154, 'town', 'v-ts');
  return svg(360, 166, 'A simple map with mountains, a river and two towns, A and B, plus a compass and a key.', b);
}
function innerPlanets() {
  let b = ci(-50, 80, 90, 'v-sun') + T(18, 85, 'Sun', 'v-tb');
  [[90, 4, ''], [140, 9, ''], [200, 10, 'Earth'], [260, 6, '']].forEach(([x, rad, n]) => {
    b += ci(x, 80, rad, n ? 'v-earth v-hi' : 'v-moon') + (n ? T(x, 112, n, 'v-ta') : '');
  });
  b += ln(48, 80, 340, 80, 'v-dash') + arrow(290, 140, 340, 140, 'mut') + TL(150, 144, 'farther from the Sun', 'v-ts');
  return svg(360, 152, 'The Sun and the four planets closest to it, in order. Earth is picked out.', b);
}

window.SciVisuals = {
  // kit, for one-off diagrams in a bank
  thermometer, numberLine, barChart, chain, flow, sortBins, placeValue,
  // Grade 6
  statesJars, waterStrip, massApple, balanceKg, feathersRocks, appleUnit,
  pushPull, dropBall, bookTable, jumper, surfaces, puck, bootSole, arrowsAB, arrowRight, appleFalls, shapesSquareTriangle, tippingTower,
  livingChecklist, plantNeeds, plantRootsWater, darkCloset, eats, furFat, cactus, hares,
  risingTemp, sunArcs, seasonWheel, heatToEarth, twoCars, sunriseAfternoon, balloons, breathing, weatherTools,
  bulb, speaker, runner, timeBars, circuit, wallPlug, sandToBottle, oilWell, tChart,
  sunEarth, orbit, moonSunlight, earthMoonPull, twoObjects, sunVsMoon, roundingLine,
  // Grade 7
  plantParts, leafIO, germinating, particles, particleHeat, stateCycle, internalForce, weatheringVis,
  // Science 7
  animalNeeds, cellsZoom, expandBar, sidewalkGaps, elasticPlastic, rulerVis, rockSamples, fossilVis, mapVis, innerPlanets,
};
})();
