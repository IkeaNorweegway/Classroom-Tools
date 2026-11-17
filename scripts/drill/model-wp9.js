
/* ===================== MODEL START (no DOM) ===================== */
/* Math 9 word problems. Every topic has three levels: 1 = one step, 2 = two steps, 3 = three or more.
   An item: { t (problem type), lvl, code (notes section, e.g. RN2), story (HTML, numbers in <b>), q (2–4 words),
   v (the answer), dp (decimal places shown), tol, pre/unit (around the answer box), ans (Show me text, optional),
   errs: [{v, cue, s}] (a named mistake: its value, a cue of six words or fewer, the step it skips or gets wrong),
   cue (when no named mistake matches), steps: [{l, m}] (label, working), pic (a schematic, drawn by wp.js) }.
   A polynomial answer (PO) gives poly: {2, 1, 0} (coefficients) instead of v, and deg (2 or 1: how many boxes);
   its named mistakes are polynomials too. */
const MODEL = (() => {
  const { rnd, pick } = Q;
  const R = (x, d) => { const k = Math.pow(10, d == null ? 6 : d); return Math.round((x + (x < 0 ? -1 : 1) * 1e-9) * k) / k; };
  const F = (x, d) => { const s = d == null ? String(R(x, 4)) : R(x, d).toFixed(d); return s.replace('-', '−'); };
  const P = (x, d) => x < 0 ? '(' + F(x, d) + ')' : F(x, d);              // a negative in brackets
  const $ = x => (x < 0 ? '−$' : '$') + Math.abs(R(x, 2)).toFixed(2);
  const B = s => '<b>' + s + '</b>';
  const N = n => Math.round(n).toLocaleString('en-CA');                  // 4096 -> 4,096
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '−': '⁻', 'n': 'ⁿ', 'k': 'ᵏ', 'm': 'ᵐ' };
  const pw = (b, e) => b + String(e).split('').map(c => SUP[c] || c).join('');   // 2, 10 -> 2¹⁰
  const NAMES = ['Ava', 'Liam', 'Noah', 'Maya', 'Ethan', 'Zoe', 'Owen', 'Priya', 'Jayden', 'Hana', 'Lucas', 'Amara', 'Kai', 'Sofia', 'Mateo', 'Leah'];
  const TOWNS = ['Edmonton', 'Calgary', 'Red Deer', 'Grande Prairie', 'Fort McMurray', 'Lethbridge', 'St. Albert', 'Medicine Hat'];

  // Polynomials {2, 1, 0}: the same?  its text (3x² − 2x + 5)?  a binomial in brackets?
  const co = (p, e) => p && p[e] || 0;
  const sameP = (a, b) => [0, 1, 2].every(e => Math.abs(co(a, e) - co(b, e)) < 1e-9);
  const ps = p => { const out = []; [2, 1, 0].forEach(e => { const c = co(p, e); if (!c) return; const a = Math.abs(c), body = (a === 1 && e ? '' : F(a)) + ['', 'x', 'x²'][e]; out.push(out.length ? (c < 0 ? '− ' : '+ ') + body : (c < 0 ? '−' : '') + body); }); return out.join(' ') || '0'; };
  const bn = (a, b) => '(' + ps({ 1: a, 0: b }) + ')';
  function mk(t, lvl, code, o) {
    const dp = o.dp || 0, tol = o.tol != null ? o.tol : dp ? Math.pow(10, -dp) * .51 : .001, poly = o.poly || null, deg = poly ? o.deg || (co(poly, 2) ? 2 : 1) : 0;
    const keep = e => poly ? e[0] && typeof e[0] === 'object' && !sameP(e[0], poly) && (deg === 2 || !co(e[0], 2))
      : isFinite(e[0]) && Math.abs(e[0] - o.v) > Math.max(tol, .051) + 1e-9;
    const errs = (o.errs || []).filter(e => e && keep(e)).map(([v, cue, s]) => ({ v, cue, s }));
    return { t, lvl, code, story: o.story, q: o.q, v: poly ? null : o.v, poly, deg, dp, tol, pre: o.pre || '', unit: o.unit || '', ans: o.ans || (poly ? ps(poly) : F(o.v, dp)),
      errs, cue: o.cue, steps: o.steps.map(([l, m]) => ({ l, m })), pic: o.pic };
  }
  // A response for an item: a number, or a polynomial's coefficient boxes (text, as typed).
  function resp(it, x) {
    if (!it.poly) return { v: String(x) };
    const r = { c1: String(co(x, 1)), c0: String(co(x, 0)) }; if (it.deg === 2) r.c2 = String(co(x, 2)); return r;
  }
  const qv = a => a == null || a === '' ? 0 : Q.val(typeof a === 'string' ? Q.parse(a) : a);
  function checkPoly(it, r) {
    const g = { 2: qv(r.c2), 1: qv(r.c1), 0: qv(r.c0) };
    if (sameP(g, it.poly)) return { ok: true };
    for (let i = 0; i < it.errs.length; i++) if (sameP(g, it.errs[i].v)) return { code: 'e' + i, cue: it.errs[i].cue, s: it.errs[i].s };
    if ([0, 1, 2].every(e => Math.abs(Math.abs(g[e]) - Math.abs(co(it.poly, e))) < 1e-9)) return { code: 'sign', cue: 'Check each sign', s: it.steps.length - 1 };
    return { code: 'other', cue: it.cue, s: -1 };
  }
  // A typed answer -> ok, or the first named mistake it matches.
  function check(it, r) {
    if (it.poly) return checkPoly(it, r);
    const g = r.v == null || r.v === '' ? NaN : Q.val(typeof r.v === 'string' ? Q.parse(r.v) : r.v);
    if (Math.abs(g - it.v) <= it.tol) return { ok: true };
    const et = Math.max(it.tol, .051);
    for (let i = 0; i < it.errs.length; i++) if (Math.abs(g - it.errs[i].v) <= et) return { code: 'e' + i, cue: it.errs[i].cue, s: it.errs[i].s };
    if (it.v !== 0 && Math.abs(g + it.v) <= it.tol) return { code: 'sign', cue: 'Check the sign', s: it.steps.length - 1 };
    return { code: 'other', cue: it.cue, s: -1 };
  }

  /* ============ RN · Rational numbers ============ */
  const RN = {
    1: [
      function rnTemp() {
        const t1 = -rnd(8, 28), t2 = rnd(-3, 9), d = t2 - t1, town = pick(TOWNS);
        return mk('rnTemp', 1, 'RN2', {
          story: 'At 7 a.m. it was ' + B(F(t1) + ' °C') + ' in ' + town + '. By 3 p.m. it was ' + B(F(t2) + ' °C') + '.',
          q: 'How much warmer?', v: d, unit: '°C', cue: 'Change = final − start',
          errs: [[t2 + t1, 'Minus a negative means add', 0]],
          steps: [['final − start', F(t2) + ' − ' + P(t1) + ' = ' + d + ' °C']],
          pic: { k: 'nl', unit: '°C', pts: [{ x: t1, t: '7 a.m.', c: 'L' }, { x: t2, t: '3 p.m.', c: 'Y' }], jumps: [{ a: t1, b: t2, t: '+' + d, c: 'N', s: 0, q: true }] }
        });
      },
      function rnLunch() {
        const owe = rnd(500, 4500) / 100, dep = rnd(2000, 9000) / 100, bal = R(dep - owe, 2), n = pick(NAMES);
        return mk('rnLunch', 1, 'RN2', {
          story: n + '’s lunch account is at ' + B($(-owe)) + '. ' + n + ' puts in ' + B($(dep)) + '.',
          q: 'New balance?', v: bal, dp: 2, pre: '$', cue: 'Start below zero, then add',
          errs: [[R(dep + owe, 2), 'The balance starts below zero', 0]],
          steps: [['start + deposit', F(-owe, 2) + ' + ' + F(dep, 2) + ' = ' + F(bal, 2)]],
          pic: { k: 'nl', unit: '$', pts: [{ x: -owe, t: 'now', c: 'R' }], jumps: [{ a: -owe, b: bal, t: '+' + F(dep, 2), c: 'N', s: 0, q: true }] }
        });
      },
      function rnDive() {
        const d = rnd(30, 90) / 10, k = rnd(3, 6), v = R(-d * k, 1);
        return mk('rnDive', 1, 'RN3', {
          story: 'A drone sub dives ' + B(F(d, 1) + ' m') + ' every minute. It dives for ' + B(k + ' minutes') + '.',
          q: 'Change in depth?', v, dp: 1, unit: 'm', cue: 'Down is negative: × minutes',
          errs: [[R(d * k, 1), 'Going down is negative', 0], [-d, 'Times the number of minutes', 0], [R(-d - k, 1), 'Multiply, don’t add', 0]],
          steps: [['minutes × change', k + ' × (−' + F(d, 1) + ') = ' + F(v, 1) + ' m']],
          pic: { k: 'nl', vert: true, unit: 'm', pts: [{ x: 0, t: 'surface', c: 'L' }], jumps: Array.from({ length: k }, (_, i) => ({ a: R(-d * i, 1), b: R(-d * (i + 1), 1), t: i === 0 ? '−' + F(d, 1) : '', c: 'Y' })) }
        });
      }
    ],
    2: [
      function rnCool() {
        const s = rnd(-20, 60) / 10, r = pick([0.5, 1.5, 2.5, 1.2, 0.8]), h = rnd(3, 8), drop = R(r * h, 1), e = R(s - drop, 1);
        return mk('rnCool', 2, 'RN3', {
          story: 'At 6 p.m. it is ' + B(F(s, 1) + ' °C') + '. It falls ' + B(F(r, 1) + ' °C') + ' every hour for ' + B(h + ' hours') + '.',
          q: 'Final temperature?', v: e, dp: 1, unit: '°C', cue: 'Total drop, then subtract',
          errs: [[R(s + drop, 1), 'The temperature falls', 1], [R(s - r, 1), 'It drops every hour', 0], [-drop, 'Start from ' + F(s, 1) + ' °C', 1]],
          steps: [['total drop', F(r, 1) + ' × ' + h + ' = ' + F(drop, 1) + ' °C'], ['start − drop', F(s, 1) + ' − ' + F(drop, 1) + ' = ' + F(e, 1) + ' °C']],
          pic: { k: 'nl', unit: '°C', pts: [{ x: s, t: '6 p.m.', c: 'L' }], jumps: [{ a: s, b: e, t: '−' + F(drop, 1), c: 'Y', s: 0, q: true }] }
        });
      },
      function rnRope() {
        for (;;) {
          const W = rnd(5, 9), q = rnd(1, 3), p = rnd(1, 3), s8 = pick([1, 3, 5, 7]);
          const tot = W * 8 + q * 2, pc = p * 8 + s8, rem = tot - 2 * pc;
          if (rem <= 0) continue;
          const mx = n => { const w = Math.floor(n / 8), f = Q.q(n % 8, 8); return (w ? w + ' ' : '') + (f.n ? f.n + '/' + f.d : ''); };
          return mk('rnRope', 2, 'RN2', {
            story: 'A rope is ' + B(mx(tot) + ' m') + ' long. Two pieces of ' + B(mx(pc) + ' m') + ' are cut off.',
            q: 'How much is left?', v: rem / 8, dp: 3, tol: .002, unit: 'm', ans: Q.str(Q.q(rem, 8)), cue: 'Both pieces, in eighths',
            errs: [[(tot - pc) / 8, 'Two pieces were cut', 0], [2 * pc / 8, 'That’s what was cut off', 1]],
            steps: [['cut off', '2 × ' + mx(pc) + ' = ' + (2 * pc) + '/8 m'], ['left', tot + '/8 − ' + (2 * pc) + '/8 = ' + rem + '/8 = ' + mx(rem) + ' m']],
            pic: { k: 'bar', rows: [{ t: 'rope', segs: [{ v: pc, t: mx(pc), c: 'Y' }, { v: pc, t: mx(pc), c: 'Y' }, { v: rem, t: '?', d: mx(rem) + ' m', c: 'N', q: true }] }] }
          });
        }
      },
      function rnCocoa() {
        const pr = pick([2.75, 3.25, 4.5, 1.75, 5.25]), n = rnd(3, 6), paid = 20 * Math.ceil((pr * n + 1) / 20), cost = R(pr * n, 2), ch = R(paid - cost, 2);
        return mk('rnCocoa', 2, 'RN3', {
          story: 'Hot chocolate at the rink is ' + B($(pr)) + ' a cup. You buy ' + B(n + ' cups') + ' and pay with ' + B($(paid)) + '.',
          q: 'Your change?', v: ch, dp: 2, pre: '$', cue: 'Cost first, then subtract',
          errs: [[R(paid - pr, 2), 'You bought ' + n + ' cups', 0], [cost, 'That’s the cost: now subtract', 1]],
          steps: [['cost', n + ' × ' + $(pr) + ' = ' + $(cost)], ['change', $(paid) + ' − ' + $(cost) + ' = ' + $(ch)]],
          pic: { k: 'bar', rows: [{ t: 'paid ' + $(paid), segs: Array.from({ length: n }, () => ({ v: pr, t: $(pr), c: 'Y' })).concat([{ v: ch, t: '?', c: 'N', q: true }]) }] }
        });
      }
    ],
    3: [
      function rnMean() {
        for (;;) {
          const T = Array.from({ length: 5 }, () => rnd(-250, 40) / 10), sum = R(T.reduce((a, b) => a + b, 0), 1);
          if (Math.round(Math.abs(sum) * 10) % 5) continue;
          const mean = R(sum / 5, 1), min = Math.min(...T), d = R(mean - min, 1);
          return mk('rnMean', 3, 'RN5', {
            story: 'Five daily lows in Grande Prairie: ' + T.map(t => B(F(t, 1))).join(', ') + ' °C.',
            q: 'Mean − coldest?', v: d, dp: 1, unit: '°C', cue: 'Mean first, then compare',
            errs: [[mean, 'Now compare with the coldest', 2], [R(mean + min, 1), 'Minus a negative means add', 2], [sum, 'Divide the sum by 5', 1]],
            steps: [['add all 5', 'sum = ' + F(sum, 1)], ['mean', F(sum, 1) + ' ÷ 5 = ' + F(mean, 1) + ' °C'], ['mean − coldest', F(mean, 1) + ' − ' + P(min, 1) + ' = ' + F(d, 1) + ' °C']],
            pic: { k: 'nl', unit: '°C', pts: T.map(t => ({ x: t, c: t === min ? 'R' : 'L', dot: true })).concat([{ x: min, t: 'coldest', c: 'R' }, { x: mean, t: 'mean', c: 'Y', s: 1 }]), jumps: [{ a: min, b: mean, t: F(d, 1), c: 'N', s: 2, q: true }] }
          });
        }
      },
      function rnDiver() {
        const d = pick([12.4, 16.8, 20.4, 8.8, 14.4, 18.8]), dn = rnd(15, 60) / 10, up = R(d * .75, 2), mid = R(-d + up, 2), e = R(mid - dn, 2);
        return mk('rnDiver', 3, 'RN3', {
          story: 'A diver is at ' + B(F(-d, 1) + ' m') + '. She rises ' + B('3/4') + ' of the way to the surface, then dives ' + B(F(dn, 1) + ' m') + ' down.',
          q: 'Final position?', v: e, dp: 2, unit: 'm', cue: 'Rise 3/4 of the depth',
          errs: [[mid, 'Then she dives down again', 2], [R(-d * .75 - dn, 2), '3/4 of the way up', 0], [R(-d - up - dn, 2), 'Rising: less negative', 1]],
          steps: [['rise', '3/4 × ' + F(d, 1) + ' = ' + F(up, 2) + ' m'], ['after rising', F(-d, 1) + ' + ' + F(up, 2) + ' = ' + F(mid, 2) + ' m'], ['dive down', F(mid, 2) + ' − ' + F(dn, 1) + ' = ' + F(e, 2) + ' m']],
          pic: { k: 'nl', vert: true, unit: 'm', pts: [{ x: 0, t: 'surface', c: 'L' }, { x: -d, t: 'start', c: 'L' }], jumps: [{ a: -d, b: mid, t: '+' + F(up, 2), c: 'N', s: 0 }, { a: mid, b: e, t: '−' + F(dn, 1), c: 'Y', s: 1, q: true }] }
        });
      },
      function rnStock() {
        const n = rnd(20, 60), c =[-rnd(50, 250) / 100, rnd(20, 300) / 100, -rnd(20, 150) / 100], fee = pick([4.95, 6.99, 9.99]);
        const per = R(c[0] + c[1] + c[2], 2), gross = R(n * per, 2), net = R(gross - fee, 2);
        const sg = x => (x < 0 ? '−' : '+') + '$' + Math.abs(x).toFixed(2);
        return mk('rnStock', 3, 'RN3', {
          story: 'You buy ' + B(n + ' shares') + '. Over 3 days the price changes ' + c.map(x => B(sg(x))).join(', ') + '. Selling costs a ' + B($(fee)) + ' fee.',
          q: 'Gain or loss?', v: net, dp: 2, pre: '$', cue: 'Per share × shares − fee',
          errs: [[per, 'Times the number of shares', 1], [gross, 'Take off the fee', 2], [R(gross + fee, 2), 'The fee costs you money', 2]],
          steps: [['change per share', c.map(x => P(x, 2)).join(' + ') + ' = ' + F(per, 2)], ['all shares', n + ' × ' + P(per, 2) + ' = ' + F(gross, 2)], ['minus fee', F(gross, 2) + ' − ' + F(fee, 2) + ' = ' + F(net, 2)]],
          pic: { k: 'nl', unit: '$ per share', pts: [{ x: 0, t: 'buy price', c: 'L' }, { x: per, t: 'day 3', c: 'Y', s: 0 }], jumps: c.map((x, i) => ({ a: R(c.slice(0, i).reduce((a, b) => a + b, 0), 2), b: R(c.slice(0, i + 1).reduce((a, b) => a + b, 0), 2), t: sg(x), c: x < 0 ? 'R' : 'N' })) }
        });
      }
    ]
  };

  /* ============ SR · Square roots ============ */
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]];
  const SR = {
    1: [
      function srGarden() {
        const s = rnd(6, 25), A = s * s;
        return mk('srGarden', 1, 'SR1', {
          story: 'A square vegetable garden has an area of ' + B(A + ' m²') + '.', q: 'Side length?', v: s, unit: 'm', cue: 'Side = √area',
          errs: [[A / 2, '√ is not ÷ 2', 0], [A / 4, 'Area = side × side', 0]],
          steps: [['side = √area', '√' + A + ' = ' + s + ' m']],
          pic: { k: 'rects', rs: [{ x: 0, y: 0, w: 1, h: 1, c: 'N', t: A + ' m²', tw: '?', q: true }] }
        });
      },
      function srTile() {
        const s = pick([0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.1, 1.2]), A = R(s * s, 2);
        return mk('srTile', 1, 'SR4', {
          story: 'A square floor tile has an area of ' + B(F(A, 2) + ' m²') + '.', q: 'Side length?', v: s, dp: 1, unit: 'm', cue: 'What × itself = ' + F(A, 2) + '?',
          errs: [[R(A / 2, 3), '√ is not ÷ 2', 0], [R(s / 10, 2), 'Check: side × side', 0], [R(s * 10, 1), 'Check: side × side', 0]],
          steps: [['side = √area', '√' + F(A, 2) + ' = ' + F(s, 1) + ' m (' + F(s, 1) + ' × ' + F(s, 1) + ')']],
          pic: { k: 'rects', rs: [{ x: 0, y: 0, w: 1, h: 1, c: 'L', t: F(A, 2) + ' m²', tw: '?', q: true }] }
        });
      },
      function srPoster() {
        const n = pick([20, 30, 40, 45, 50, 60, 70, 80, 90]), lo = Math.floor(Math.sqrt(n)), e = R(Math.sqrt(n), 1);
        return mk('srPoster', 1, 'SR2', {
          story: 'A square poster has an area of ' + B(n + ' dm²') + '. Estimate its side to ' + B('one decimal place') + '.', q: 'About how long?', v: e, dp: 1, unit: 'dm', cue: 'Find the squares around ' + n,
          errs: [[n / 2, '√ is not ÷ 2', 0], [n / 4, 'Area = side × side', 0]],
          steps: [['estimate √' + n, lo + '² = ' + lo * lo + ' < ' + n + ' < ' + (lo + 1) * (lo + 1) + ', so ≈ ' + F(e, 1) + ' dm']],
          pic: { k: 'rects', rs: [{ x: 0, y: 0, w: 1, h: 1, c: 'L', t: n + ' dm²', tw: '?', q: true }] }
        });
      }
    ],
    2: [
      function srPaddock() {
        const s = rnd(8, 30), A = s * s;
        return mk('srPaddock', 2, 'SR1', {
          story: 'A square horse paddock has an area of ' + B(A + ' m²') + '. It needs a fence all the way around.', q: 'Metres of fence?', v: 4 * s, unit: 'm', cue: 'Side first, then all 4',
          errs: [[s, 'The fence goes around 4 sides', 1], [A / 4, 'Side = √area', 0], [A / 2, '√ is not ÷ 2', 0]],
          steps: [['side = √area', '√' + A + ' = ' + s + ' m'], ['perimeter', '4 × ' + s + ' = ' + 4 * s + ' m']],
          pic: { k: 'rects', rs: [{ x: 0, y: 0, w: 1, h: 1, c: 'N', t: A + ' m²', tw: s + ' m', tws: 0, ring: 1 }] }
        });
      },
      function srTV() {
        const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [9, 12, 15], [12, 16, 20]]), k = pick([3, 4]), w = b * k, h = a * k, d = c * k;
        return mk('srTV', 2, 'SR3', {
          story: 'A TV screen is ' + B(w + ' in') + ' wide and ' + B(h + ' in') + ' tall. TVs are sold by the diagonal.', q: 'Diagonal size?', v: d, unit: 'in', cue: 'Square, add, then √',
          errs: [[w + h, 'Square the sides first', 0], [w * w + h * h, 'Now take the square root', 1], [Math.sqrt(w * w - h * h), 'Add the squares', 0]],
          steps: [['d² = w² + h²', w + '² + ' + h + '² = ' + (w * w + h * h)], ['d = √', '√' + d * d + ' = ' + d + ' in']],
          pic: { k: 'tri', scene: 'tv', a: w, b: h, la: w + ' in', lb: h + ' in', lc: '?', q: 'c' }
        });
      },
      function srWire() {
        const [a, b, c] = pick(TRIPLES), k = pick([2, 3, 4]), run = a * k, up = b * k, L = c * k;
        return mk('srWire', 2, 'SR3', {
          story: 'A wire runs from the top of a ' + B(up + ' m') + ' mast to a stake ' + B(run + ' m') + ' from its base.', q: 'Length of wire?', v: L, unit: 'm', cue: 'The wire is the hypotenuse',
          errs: [[up + run, 'Square the sides first', 0], [up * up + run * run, 'Now take the square root', 1], [Math.sqrt(Math.abs(up * up - run * run)), 'Add the squares for the hypotenuse', 0]],
          steps: [['wire² = a² + b²', up + '² + ' + run + '² = ' + L * L], ['wire = √', '√' + L * L + ' = ' + L + ' m']],
          pic: { k: 'tri', scene: 'wire', a: run, b: up, la: run + ' m', lb: up + ' m', lc: '?', q: 'c' }
        });
      }
    ],
    3: [
      function srLadder() {
        const [[a, b, c], k] = pick([[[7, 24, 25], 0.2], [[3, 4, 5], 1], [[5, 12, 13], 0.5], [[8, 15, 17], 0.5], [[3, 4, 5], 1.5]]);
        const base = R(a * k, 2), h = R(b * k, 2), lad = R(c * k, 2), sill = R(h - rnd(3, 12) / 10, 1), up = R(h - sill, 2);
        return mk('srLadder', 3, 'SR3', {
          story: 'A ' + B(F(lad) + ' m') + ' ladder leans on a wall, its foot ' + B(F(base) + ' m') + ' out. A window sill is ' + B(F(sill, 1) + ' m') + ' up.', q: 'Above the sill?', v: up, dp: 2, unit: 'm', cue: 'Height of the top first',
          errs: [[h, 'Now compare with the sill', 2], [R(Math.sqrt(lad * lad + base * base) - sill, 2), 'The ladder is the hypotenuse', 0], [R(lad - sill, 2), 'Find the height first', 1]],
          steps: [['h² = L² − b²', F(lad) + '² − ' + F(base) + '² = ' + F(R(h * h, 4))], ['h = √', '√' + F(R(h * h, 4)) + ' = ' + F(h) + ' m'], ['above the sill', F(h) + ' − ' + F(sill, 1) + ' = ' + F(up, 2) + ' m']],
          pic: { k: 'tri', scene: 'ladder', a: base, b: h, la: F(base) + ' m', lb: 'h', lbd: 'h = ' + F(h) + ' m', lc: F(lad) + ' m', q: 'b', mark: { y: sill, t: 'sill ' + F(sill, 1) + ' m' } }
        });
      },
      function srPatio() {
        const s1 = rnd(9, 16), s2 = rnd(4, s1 - 2), A1 = s1 * s1, A2 = s2 * s2, per = 4 * s1 + 2 * s2;
        return mk('srPatio', 3, 'SR1', {
          story: 'A square patio (' + B(A1 + ' m²') + ') and a square garden (' + B(A2 + ' m²') + ') sit side by side, bottoms lined up.', q: 'Outside perimeter?', v: per, unit: 'm', cue: 'Sides, then the outside edge',
          errs: [[4 * s1 + 4 * s2, 'The shared edge is inside', 2], [4 * s1 + 3 * s2, 'Take it off both squares', 2], [A1 + A2, 'That’s area, not perimeter', 0]],
          steps: [['sides', '√' + A1 + ' = ' + s1 + ',  √' + A2 + ' = ' + s2], ['both perimeters', '4(' + s1 + ') + 4(' + s2 + ') = ' + (4 * s1 + 4 * s2)], ['shared edge ×2', (4 * s1 + 4 * s2) + ' − 2(' + s2 + ') = ' + per + ' m']],
          pic: { k: 'rects', rs: [{ x: 0, y: 0, w: s1, h: s1, c: 'L', t: A1 + ' m²' }, { x: s1, y: s1 - s2, w: s2, h: s2, c: 'N', t: A2 + ' m²' }], shared: { x: s1, y0: s1 - s2, y1: s1, s: 2 } }
        });
      },
      function srPark() {
        const [a, b, c] = pick([[5, 12, 13], [8, 15, 17], [20, 21, 29], [7, 24, 25]]), k = pick([10, 20]), w = a * k, l = b * k, d = c * k, sv = w + l - d;
        return mk('srPark', 3, 'SR3', {
          story: 'A park is ' + B(w + ' m') + ' by ' + B(l + ' m') + '. You cut across the diagonal instead of walking two sides.', q: 'Metres saved?', v: sv, unit: 'm', cue: 'Sides − diagonal',
          errs: [[d, 'How much shorter is it?', 2], [w + l, 'Subtract the diagonal', 2], [w * w + l * l, 'Take the square root', 1]],
          steps: [['two sides', w + ' + ' + l + ' = ' + (w + l) + ' m'], ['diagonal', '√(' + w + '² + ' + l + '²) = √' + d * d + ' = ' + d], ['saved', (w + l) + ' − ' + d + ' = ' + sv + ' m']],
          pic: { k: 'tri', scene: 'park', a: l, b: w, la: l + ' m', lb: w + ' m', lc: '?', q: 'c' }
        });
      }
    ]
  };

  /* ============ PE · Powers and exponents ============ */
  const PE = {
    1: [
      function peSplit() {
        const n = rnd(5, 12), v = Math.pow(2, n);
        return mk('peSplit', 1, 'PE1', {
          story: 'One bacterium splits into ' + B('2') + ' every hour. Every new one splits too. Count after ' + B(n + ' hours') + '.', q: 'How many bacteria?', v, cue: 'Times 2, ' + n + ' times',
          errs: [[2 * n, 'Doubling is × 2 each hour', 0], [n * n, pw('2', 'n') + ', not n²', 0], [Math.pow(2, n - 1), 'Count all ' + n + ' hours', 0]],
          steps: [['2 × 2 × … ' + n + ' times', pw('2', n) + ' = ' + N(v)]],
          pic: { k: 'chain', start: '1', op: '× 2', n, end: '?' }
        });
      },
      function peCube() {
        const s = rnd(3, 12), v = s * s * s;
        return mk('peCube', 1, 'PE1', {
          story: 'A cube-shaped storage box has edges ' + B(s + ' dm') + ' long.', q: 'Volume?', v, unit: 'dm³', cue: 'V = edge³',
          errs: [[3 * s, pw('s', 3) + ' is s·s·s', 0], [s * s, 'Volume needs three edges', 0], [6 * s * s, 'That’s surface area', 0]],
          steps: [['V = s³', pw(s, 3) + ' = ' + s + ' × ' + s + ' × ' + s + ' = ' + v + ' dm³']],
          pic: { k: 'cube', edge: s + ' dm' }
        });
      },
      function peSand() {
        const a = rnd(4, 9), b = rnd(2, 5), v = Math.pow(10, b);
        return mk('peSand', 1, 'PE4', {
          story: 'A cell is ' + B(pw('10', -a) + ' m') + ' across. A grain of sand is ' + B(pw('10', -a + b) + ' m') + ' across.', q: 'How many times wider?', v, cue: 'Divide: subtract the exponents',
          errs: [[b, 'That’s the exponent: evaluate ' + pw('10', b), 0], [Math.pow(10, 2 * a - b), 'Bigger ÷ smaller', 0]],
          steps: [['divide the powers', pw('10', -a + b) + ' ÷ ' + pw('10', -a) + ' = ' + pw('10', b) + ' = ' + N(v)]],
          pic: { k: 'chain', start: pw('10', -a) + ' m', op: '× 10', n: b, end: pw('10', -a + b) + ' m', cnt: '?', cntd: b + ' × (×10) = ' + N(v) + ' times' }
        });
      }
    ],
    2: [
      function peCulture() {
        const p0 = pick([50, 100, 200, 250, 500]), h = pick([2, 3, 4]), k = rnd(3, 6), t = h * k, v = p0 * Math.pow(2, k);
        return mk('peCulture', 2, 'PE1', {
          story: 'A culture starts with ' + B(p0 + ' bacteria') + '. It doubles every ' + B(h + ' hours') + '. Count after ' + B(t + ' hours') + '.', q: 'How many bacteria?', v, cue: 'Doublings first: ' + t + ' ÷ ' + h,
          errs: [[p0 * Math.pow(2, t), 'Count doublings: ' + t + ' ÷ ' + h, 0], [p0 * 2 * k, 'Doubling ' + k + ' times is ' + pw('2', k), 1], [Math.pow(2, k), 'Start with ' + p0, 1]],
          steps: [['doublings', t + ' ÷ ' + h + ' = ' + k], ['start × 2ᵏ', p0 + ' × ' + pw('2', k) + ' = ' + p0 + ' × ' + Math.pow(2, k) + ' = ' + N(v)]],
          pic: { k: 'chain', start: String(p0), op: '× 2', n: k, end: '?', every: h + ' h', cnt: '?', cntd: k + ' × (×2)' }
        });
      },
      function peUSB() {
        const a = pick([30, 32, 34, 36]), b = pick([18, 20, 22, 24]), d = a - b, v = Math.pow(2, d);
        return mk('peUSB', 2, 'PE4', {
          story: 'A USB drive holds ' + B(pw('2', a) + ' bytes') + '. One photo uses ' + B(pw('2', b) + ' bytes') + '.', q: 'How many photos fit?', v, cue: 'Same base: subtract exponents',
          errs: [[d, 'Now evaluate ' + pw('2', d), 1], [Math.pow(2, Math.round(a / b)), 'Subtract exponents, don’t divide', 0], [a / b, 'Subtract exponents, don’t divide', 0]],
          steps: [['divide the powers', pw('2', a) + ' ÷ ' + pw('2', b) + ' = ' + pw('2', a + '−' + b) + ' = ' + pw('2', d)], ['evaluate', pw('2', d) + ' = ' + N(v)]],
          pic: { k: 'chain', start: pw('2', b), op: '× 2', n: d, end: pw('2', a), cnt: '?', cntd: d + ' × (×2)' }
        });
      },
      function peSolar() {
        const [b, m] = pick([[2, 3], [2, 4], [3, 2], [3, 3], [5, 2], [2, 5]]), e = 2 * m, v = Math.pow(b, e);
        return mk('peSolar', 2, 'PE5', {
          story: 'A square solar-panel field is ' + B(pw(b, m) + ' m') + ' on each side.', q: 'Area of the field?', v, unit: 'm²', cue: 'Power of a power: multiply',
          errs: [[Math.pow(b, m + 2), 'Power of a power: multiply', 0], [2 * Math.pow(b, m), 'Squared means × itself', 0], [Math.pow(b, m), 'Area = side × side', 0]],
          steps: [['area = side²', '(' + pw(b, m) + ')² = ' + pw(b, e) + '   (' + m + ' × 2 = ' + e + ')'], ['evaluate', pw(b, e) + ' = ' + N(v) + ' m²']],
          pic: { k: 'rects', rs: [{ x: 0, y: 0, w: 1, h: 1, c: 'Y', t: '?', tw: pw(b, m) + ' m', lh: pw(b, m) + ' m', q: true }] }
        });
      }
    ],
    3: [
      function pePack() {
        const a = rnd(3, 5), b = rnd(1, a - 1), e = 3 * (a - b), v = Math.pow(2, e);
        return mk('pePack', 3, 'PE5', {
          story: 'A big cube has edges ' + B(pw('2', a) + ' cm') + '. Small cubes with edges ' + B(pw('2', b) + ' cm') + ' fill it with no gaps.', q: 'How many small cubes?', v, cue: 'Along one edge, then cube',
          errs: [[Math.pow(2, a - b), 'Now cube it: 3 directions', 1], [3 * Math.pow(2, a - b), 'Cubed means ³, not × 3', 1], [Math.pow(2, 3 * a), 'Divide by the small edge', 0]],
          steps: [['along one edge', pw('2', a) + ' ÷ ' + pw('2', b) + ' = ' + pw('2', a - b)], ['cube it', '(' + pw('2', a - b) + ')³ = ' + pw('2', e)], ['evaluate', pw('2', e) + ' = ' + N(v)]],
          pic: { k: 'cube', edge: pw('2', a) + ' cm', n: Math.pow(2, a - b), small: pw('2', b) + ' cm' }
        });
      },
      function peHalf() {
        const k = rnd(3, 6), s0 = 25 * Math.pow(2, k) * pick([1, 2, 4]), hl = pick([2, 3, 5, 8]), t = hl * k, left = s0 / Math.pow(2, k), dec = s0 - left;
        return mk('peHalf', 3, 'PE7', {
          story: 'A medical tracer has a half-life of ' + B(hl + ' days') + '. A hospital gets ' + B(N(s0) + ' mg') + '. Wait ' + B(t + ' days') + '.', q: 'How many mg decayed?', v: dec, unit: 'mg', cue: 'Half-lives, left, then subtract',
          errs: [[left, 'That’s what is left', 2], [s0 / 2, 'Count the half-lives: ' + t + ' ÷ ' + hl, 0], [s0 - s0 / (2 * k), 'Halve it each half-life', 1]],
          steps: [['half-lives', t + ' ÷ ' + hl + ' = ' + k], ['left', N(s0) + ' × (½)' + pw('', k) + ' = ' + N(left) + ' mg'], ['decayed', N(s0) + ' − ' + N(left) + ' = ' + N(dec) + ' mg']],
          pic: { k: 'chain', start: N(s0), op: '÷ 2', n: k, end: '?', endd: N(left) + ' mg', every: hl + ' d', cnt: '?', cntd: k + ' × (÷2)' }
        });
      },
      function peChain() {
        const r = rnd(4, 7), tot = (Math.pow(3, r + 1) - 3) / 2;
        return mk('peChain', 3, 'PE1', {
          story: 'You send a message to ' + B('3') + ' friends (round 1). Each round, every new person sends it to ' + B('3') + ' more.', q: 'Total after ' + r + ' rounds?', v: tot, cue: 'Round k reaches 3ᵏ: add them',
          errs: [[Math.pow(3, r), 'Add all the rounds', 2], [3 * r, 'Each round is × 3', 0], [Math.pow(3, r + 1), 'Add the rounds, not one more', 2]],
          steps: [['round k', 'round k reaches ' + pw('3', 'k') + ' people'], ['list', Array.from({ length: r }, (_, i) => Math.pow(3, i + 1)).join(' + ')], ['total', N(tot) + ' people']],
          pic: { k: 'chain', start: '3', op: '× 3', n: r - 1, end: 'round ' + r, endd: N(Math.pow(3, r)), cnt: 'round 1 → round ' + r, sum: true }
        });
      }
    ]
  };

  /* ============ LR · Linear relations ============ */
  const D = x => '$' + F(x);                                              // whole dollars: $170 (cents only when there are some)
  const LR = {
    1: [
      function lrPhone() {
        const base = pick([15, 20, 25, 30]), rate = pick([0.05, 0.1, 0.15, 0.25]), n = rnd(4, 30) * 10, C = R(base + rate * n, 2);
        return mk('lrPhone', 1, 'LR3', {
          story: 'A phone plan costs ' + B('C = ' + base + ' + ' + rate + 'n') + ' dollars for n minutes over the limit. You go ' + B(n + ' minutes') + ' over.',
          q: 'Your bill?', v: C, dp: 2, pre: '$', cue: 'Substitute n, then add',
          errs: [[R(rate * n, 2), 'Add the $' + base + ' base', 0], [R((base + rate) * n, 2), 'Only the rate is × n', 0], [R(base + rate + n, 2), rate + 'n means multiply', 0]],
          steps: [['substitute n', base + ' + ' + rate + '(' + n + ') = ' + $(C)]],
          pic: { k: 'graph', xl: 'minutes over', yl: 'C ($)', lines: [{ m: rate, b: base, x0: 0, x1: n * 1.25, c: 'L' }], pts: [{ x: 0, y: base, t: '$' + base, c: 'L', pos: 'r' }, { x: n, y: C, q: true, pos: 'a' }], read: { x: n, s: 0 } }
        });
      },
      function lrCandle() {
        const h = rnd(18, 30), r = pick([1.5, 2, 2.5, 1.2]), t = rnd(2, Math.floor(h / r) - 2), left = R(h - r * t, 1);
        return mk('lrCandle', 1, 'LR3', {
          story: 'A candle’s height is ' + B('h = ' + h + ' − ' + F(r, 1) + 't') + ' cm after t hours. It burns for ' + B(t + ' hours') + '.',
          q: 'Height now?', v: left, dp: 1, unit: 'cm', cue: 'Substitute t, then subtract',
          errs: [[R(h + r * t, 1), 'The candle burns down', 0], [R(r * t, 1), 'That’s how much burned', 0], [R((h - r) * t, 1), 'Only the rate is × t', 0]],
          steps: [['substitute t', h + ' − ' + F(r, 1) + '(' + t + ') = ' + F(left, 1) + ' cm']],
          pic: { k: 'graph', xl: 'hours', yl: 'h (cm)', lines: [{ m: -r, b: h, x0: 0, x1: h / r, c: 'L' }], pts: [{ x: 0, y: h, t: h + ' cm', c: 'L', pos: 'r' }, { x: t, y: left, q: true, pos: 'a' }], read: { x: t, s: 0 } }
        });
      },
      function lrWage() {
        const k = pick([12, 13, 14, 15, 16.5, 17.5]), hrs = rnd(4, 9), pay = R(k * hrs, 2), n = pick(NAMES);
        return mk('lrWage', 1, 'LR4', {
          story: n + '’s pay varies directly with hours worked. ' + n + ' earns ' + B(D(pay)) + ' for ' + B(hrs + ' hours') + '.',
          q: 'Pay per hour?', v: k, dp: 2, pre: '$', unit: '/h', cue: 'Rate = pay ÷ hours',
          errs: [[R(hrs / pay, 4), 'Pay ÷ hours, not flipped', 0], [R(pay - hrs, 2), 'Rate: divide, don’t subtract', 0], [R(pay * hrs, 2), 'Divide pay by hours', 0]],
          steps: [['k = pay ÷ hours', D(pay) + ' ÷ ' + hrs + ' = ' + $(k) + ' per hour']],
          pic: { k: 'graph', xl: 'hours', yl: 'pay ($)', lines: [{ m: k, b: 0, x0: 0, x1: hrs * 1.3, c: 'L' }], pts: [{ x: hrs, y: pay, t: hrs + ' h, ' + D(pay), c: 'Y', pos: 'l' }], rr: { a: [0, 0], b: [hrs, pay], run: hrs + ' h', rise: D(pay) } }
        });
      }
    ],
    2: [
      function lrPlumber() {
        const rate = pick([45, 55, 60, 75, 85]), call = pick([40, 50, 60, 80]), h1 = rnd(1, 3), h2 = h1 + rnd(2, 4), c1 = call + rate * h1, c2 = call + rate * h2;
        return mk('lrPlumber', 2, 'LR2', {
          story: 'A plumber charges ' + B('$' + c1) + ' for a ' + B(h1 + '-hour') + ' job and ' + B('$' + c2) + ' for a ' + B(h2 + '-hour') + ' job. The cost is linear.',
          q: 'Hourly rate?', v: rate, pre: '$', unit: '/h', cue: 'Cost change ÷ hours change',
          errs: [[R(c2 / h2, 2), 'The call-out fee is included', 0], [R(c1 / h1, 2), 'The call-out fee is included', 0], [c2 - c1, 'Divide by the change in hours', 1], [R((c2 - c1) / h2, 2), 'Use the change in hours', 1]],
          steps: [['change in cost', '$' + c2 + ' − $' + c1 + ' = $' + (c2 - c1)], ['÷ change in hours', (c2 - c1) + ' ÷ ' + (h2 - h1) + ' = $' + rate + ' per hour']],
          pic: { k: 'graph', xl: 'hours', yl: 'cost ($)', lines: [{ m: rate, b: call, x0: 0, x1: h2 + 1, c: 'L' }], pts: [{ x: h1, y: c1, t: '$' + c1, c: 'Y', pos: 'l' }, { x: h2, y: c2, t: '$' + c2, c: 'Y', pos: 'l' }], rr: { a: [h1, c1], b: [h2, c2], run: (h2 - h1) + ' h', rise: '$' + (c2 - c1), s0: 1, s1: 0 } }
        });
      },
      function lrBowling() {
        const base = pick([12, 15, 18, 20]), rate = pick([2.5, 3, 3.5, 4]), n = rnd(3, 9), T = R(base + rate * n, 2);
        return mk('lrBowling', 2, 'LR3', {
          story: 'Bowling costs ' + B('C = ' + F(rate) + 'g + ' + base) + ' dollars for g games, with shoes and entry. You spent ' + B($(T)) + '.',
          q: 'How many games?', v: n, unit: 'games', cue: 'Take off the entry, then divide',
          errs: [[R(T / rate, 2), 'Take off the $' + base + ' first', 0], [R((T + base) / rate, 2), 'Subtract the entry, don’t add', 0], [R(T - base, 2), 'Now divide by ' + $(rate), 1]],
          steps: [['subtract entry', $(T) + ' − $' + base + ' = ' + $(T - base)], ['÷ price per game', $(T - base) + ' ÷ ' + $(rate) + ' = ' + n + ' games']],
          pic: { k: 'bar', rows: [{ t: 'spent ' + $(T), segs: [{ v: base, t: 'entry $' + base, c: 'R' }, { v: T - base, t: '?', q: true, d: n + ' games × ' + $(rate), c: 'N' }] }] }
        });
      },
      function lrPlant() {
        const m = pick([3, 4, 5, 6]), b = pick([10, 12, 20, 25]), x = rnd(8, 15), v = b + m * x, ys = [0, 2, 4].map(t => b + m * t);
        return mk('lrPlant', 2, 'LR1', {
          story: 'A plant grows at a steady rate. Its height: week 0, ' + B(ys[0] + ' cm') + '; week 2, ' + B(ys[1] + ' cm') + '; week 4, ' + B(ys[2] + ' cm') + '.',
          q: 'Height in week ' + x + '?', v, unit: 'cm', cue: 'Growth per week first',
          errs: [[b + 2 * m * x, 'That grows in 2 weeks', 0], [m * x, 'Add the starting height', 1], [ys[2] + m * x, 'Start from week 0', 1]],
          steps: [['growth per week', '(' + ys[1] + ' − ' + ys[0] + ') ÷ 2 = ' + m + ' cm'], ['h = mt + b', m + '(' + x + ') + ' + b + ' = ' + v + ' cm']],
          pic: { k: 'table', xh: 'week', yh: 'height (cm)', cols: [{ x: 0, y: ys[0] }, { x: 2, y: ys[1] }, { x: 4, y: ys[2] }, { x, q: true }], dx: [{ i: 0, t: '+2' }, { i: 1, t: '+2' }, { i: 2, t: '+' + (x - 4) }], dy: [{ i: 0, t: '+' + 2 * m }, { i: 1, t: '+' + 2 * m }, { i: 2, t: '+' + m + ' × ' + (x - 4), s: 1 }] }
        });
      }
    ],
    3: [
      function lrElectric() {
        const rate = pick([45, 55, 60, 75, 85]), call = pick([40, 50, 60, 80]), h1 = rnd(1, 3), h2 = h1 + rnd(2, 3), h3 = h2 + rnd(2, 4), c1 = call + rate * h1, c2 = call + rate * h2, c3 = call + rate * h3;
        return mk('lrElectric', 3, 'LR3', {
          story: 'An electrician charges ' + B('$' + c1) + ' for ' + B(h1 + ' hours') + ' and ' + B('$' + c2) + ' for ' + B(h2 + ' hours') + '. The cost is linear.',
          q: 'Cost for ' + h3 + ' hours?', v: c3, pre: '$', cue: 'Rate, then the fee',
          errs: [[R(c1 / h1 * h3, 2), 'There’s a call-out fee', 1], [R(c2 / h2 * h3, 2), 'There’s a call-out fee', 1], [rate * h3, 'Add the call-out fee', 2], [rate, 'That’s the rate: keep going', 0]],
          steps: [['rate', '(' + c2 + ' − ' + c1 + ') ÷ (' + h2 + ' − ' + h1 + ') = $' + rate + '/h'], ['call-out fee', c1 + ' − ' + rate + '(' + h1 + ') = $' + call], ['cost for ' + h3 + ' h', rate + '(' + h3 + ') + ' + call + ' = $' + c3]],
          pic: { k: 'graph', xl: 'hours', yl: 'cost ($)', lines: [{ m: rate, b: call, x0: 0, x1: h3 + .6, c: 'L' }], pts: [{ x: 0, y: call, t: 'fee $' + call, c: 'G', pos: 'r', s: 1 }, { x: h1, y: c1, t: '$' + c1, c: 'Y', pos: 'l' }, { x: h2, y: c2, t: '$' + c2, c: 'Y', pos: 'l' }, { x: h3, y: c3, q: true, pos: 'l' }], rr: { a: [h1, c1], b: [h2, c2], run: (h2 - h1) + ' h', rise: '$' + (c2 - c1), s0: 0, s1: 0 }, read: { x: h3, s: 2 } }
        });
      },
      function lrBalloon() {
        const r = pick([20, 25, 30, 40]), T = rnd(12, 25), H = r * T, t1 = rnd(3, 6), h1 = H - r * t1;
        return mk('lrBalloon', 3, 'LR3', {
          story: 'A hot-air balloon starts down from ' + B(H + ' m') + ' at a steady rate. After ' + B(t1 + ' minutes') + ' it is at ' + B(h1 + ' m') + '.',
          q: 'Lands after how long?', v: T, unit: 'min', cue: 'Rate first, then height = 0',
          errs: [[T - t1, 'Count from the start', 2], [r, 'That’s the rate: keep going', 1], [H - h1, 'Divide the drop by the minutes', 1]],
          steps: [['drop', H + ' − ' + h1 + ' = ' + (H - h1) + ' m in ' + t1 + ' min'], ['rate', (H - h1) + ' ÷ ' + t1 + ' = ' + r + ' m per min'], ['h = 0', H + ' − ' + r + 't = 0, so t = ' + H + ' ÷ ' + r + ' = ' + T]],
          pic: { k: 'graph', xl: 'minutes', yl: 'height (m)', lines: [{ m: -r, b: H, x0: 0, x1: t1, c: 'L' }, { m: -r, b: H, x0: t1, x1: T, c: 'L', dash: true, s: 2 }], pts: [{ x: 0, y: H, t: H + ' m', c: 'L', pos: 'r' }, { x: t1, y: h1, t: t1 + ' min, ' + h1 + ' m', c: 'Y', pos: 'r' }, { x: T, y: 0, q: true, pos: 'a' }] }
        });
      },
      function lrTiles() {
        const d = pick([3, 4, 5, 6]), f1 = d + rnd(1, 5), N = rnd(20, 50), b = f1 - d, v = d * N + b;
        return mk('lrTiles', 3, 'LR1', {
          story: 'A tile pattern: Figure 1 has ' + B(f1) + ' tiles, Figure 2 has ' + B(f1 + d) + ', and Figure 3 has ' + B(f1 + 2 * d) + '.',
          q: 'Tiles in Figure ' + N + '?', v, unit: 'tiles', cue: 'Find the rule, then substitute',
          errs: [[d * N, 'Add the constant', 1], [f1 * N, 'Not ' + N + ' copies of Figure 1', 0], [f1 + d * N, 'Figure 1 already has ' + f1, 1]],
          steps: [['change', '+' + d + ' tiles each figure'], ['Figure 0', f1 + ' − ' + d + ' = ' + b + ', so t = ' + d + 'n + ' + b], ['n = ' + N, d + '(' + N + ') + ' + b + ' = ' + v + ' tiles']],
          pic: { k: 'table', xh: 'figure', yh: 'tiles', cols: [{ x: 0, y: b, ghost: true, s: 1 }, { x: 1, y: f1 }, { x: 2, y: f1 + d }, { x: 3, y: f1 + 2 * d }, { x: N, q: true }], dy: [{ i: 0, t: '+' + d, s: 1 }, { i: 1, t: '+' + d, s: 0 }, { i: 2, t: '+' + d, s: 0 }] }
        });
      }
    ]
  };

  /* ============ LE · Linear equations and inequalities ============ */
  const LE = {
    1: [
      function leNovels() {
        const n = rnd(3, 8), price = pick([6.5, 8.25, 12, 14.75, 9.5]), T = R(n * price, 2), who = pick(NAMES);
        return mk('leNovels', 1, 'LE1', {
          story: who + ' buys ' + B(n + ' graphic novels') + ', all the same price. The total is ' + B($(T)) + '.',
          q: 'Price of one?', v: price, dp: 2, pre: '$', cue: 'Total ÷ number of books',
          errs: [[R(T * n, 2), 'Undo × with ÷', 0], [R(T - n, 2), 'Undo × with ÷', 0]],
          steps: [[n + 'p = ' + F(T, 2), 'p = ' + $(T) + ' ÷ ' + n + ' = ' + $(price)]],
          pic: { k: 'bar', rows: [{ t: 'total ' + $(T), segs: Array.from({ length: n }, () => ({ v: 1, t: '?', q: true, d: $(price), c: 'Y' })) }] }
        });
      },
      function leSaved() {
        const [num, den] = pick([[2, 5], [3, 4], [2, 3], [3, 5], [5, 8], [3, 8], [3, 10]]), k = rnd(6, 30), S = den * k, cost = num * k, who = pick(NAMES);
        return mk('leSaved', 1, 'LE3', {
          story: who + ' spends ' + B(num + '/' + den) + ' of their savings on a bike. The bike costs ' + B('$' + cost) + '.',
          q: 'Total savings?', v: S, pre: '$', cue: 'Divide by ' + num + '/' + den,
          errs: [[R(cost * num / den, 2), 'Divide by the fraction', 0], [R(cost / num, 2), 'That’s 1/' + den + ': × ' + den, 0], [R(cost * den, 2), 'Then divide by ' + num, 0]],
          steps: [['(' + num + '/' + den + ')s = ' + cost, 's = ' + cost + ' × ' + den + '/' + num + ' = $' + S]],
          pic: { k: 'bar', rows: [{ t: 'savings in ' + den + ' equal parts; the bike is ' + num + ' parts', brace: '?', segs: [{ v: num, t: '$' + cost, c: 'Y' }].concat(Array.from({ length: den - num }, () => ({ v: 1, t: '', c: 'M' }))) }] }
        });
      },
      function leCards() {
        const per = pick([4, 5, 6, 8]), max = rnd(6, 12), rem = rnd(1, per - 1), T = max * per + rem;
        return mk('leCards', 1, 'LE4', {
          story: 'Packs of hockey cards cost ' + B('$' + per) + ' each. You have ' + B('$' + T) + '.',
          q: 'Most packs?', v: max, unit: 'packs', cue: 'Divide, then round down',
          errs: [[max + 1, 'No part packs: round down', 0], [R(T / per, 2), 'Packs come whole: round down', 0], [T - per, 'Divide by $' + per, 0]],
          steps: [[per + 'n ≤ ' + T, 'n ≤ ' + T + ' ÷ ' + per + ' = ' + F(R(T / per, 2)) + ', so ' + max + ' packs']],
          pic: { k: 'bar', rows: [{ t: 'you have $' + T, segs: [{ v: T, t: '$' + T, c: 'L' }] }, { t: 'packs', segs: [{ v: per, t: '$' + per, c: 'Y' }].concat(Array.from({ length: max - 1 }, () => ({ v: per, t: '$' + per, c: 'Y', s: 0 })), [{ v: rem, t: '$' + rem, c: 'M', s: 0 }]) }] }
        });
      }
    ],
    2: [
      function leConcert() {
        const p = pick([18, 22, 25, 35, 42]), f = pick([4.5, 6, 7.5, 9]), n = rnd(2, 7), T = R(p * n + f, 2);
        return mk('leConcert', 2, 'LE5', {
          story: 'Concert tickets are ' + B('$' + p) + ' each, plus one ' + B($(f)) + ' booking fee. Your total is ' + B($(T)) + '.',
          q: 'How many tickets?', v: n, unit: 'tickets', cue: 'Fee off, then divide',
          errs: [[R(T / p, 2), 'Take off the fee first', 0], [R((T + f) / p, 2), 'Subtract the fee, don’t add', 0], [R(T - f, 2), 'Now divide by $' + p, 1]],
          steps: [['fee off', $(T) + ' − ' + $(f) + ' = ' + $(T - f)], ['÷ ticket price', $(T - f) + ' ÷ $' + p + ' = ' + n + ' tickets']],
          pic: { k: 'bar', rows: [{ t: 'total ' + $(T), segs: [{ v: T, t: $(T), c: 'L' }] }, { t: 'fee + tickets', segs: [{ v: f, t: 'fee', c: 'R' }, { v: p, t: '$' + p, c: 'Y' }].concat(Array.from({ length: n - 1 }, () => ({ v: p, t: '$' + p, c: 'Y', s: 1 }))) }] }
        });
      },
      function leFair() {
        for (;;) {
          const f = pick([10, 12, 15]), r = pick([3, 4, 5]), T = rnd(30, 60), max = Math.floor((T - f) / r), rem = T - f - r * max;
          if (!rem) continue;
          return mk('leFair', 2, 'LE4', {
            story: 'The fair costs ' + B('$' + f) + ' to get in and ' + B('$' + r) + ' per ride. You have ' + B('$' + T) + '.',
            q: 'Most rides?', v: max, unit: 'rides', cue: 'Entry off, divide, round down',
            errs: [[max + 1, 'Round down: no part rides', 1], [Math.floor(T / r), 'Take off the entry first', 0], [R((T - f) / r, 2), 'Rides come whole: round down', 1], [Math.floor((T + f) / r), 'Subtract the entry, don’t add', 0]],
            steps: [[f + ' + ' + r + 'x ≤ ' + T, r + 'x ≤ ' + T + ' − ' + f + ' = ' + (T - f)], ['÷ ' + r + ', round down', 'x ≤ ' + F(R((T - f) / r, 2)) + ', so ' + max + ' rides']],
            pic: { k: 'bar', rows: [{ t: 'you have $' + T, segs: [{ v: T, t: '$' + T, c: 'L' }] }, { t: 'entry + rides', segs: [{ v: f, t: 'in $' + f, c: 'R' }, { v: r, t: '$' + r, c: 'Y' }].concat(Array.from({ length: max - 1 }, () => ({ v: r, t: '$' + r, c: 'Y', s: 1 })), [{ v: rem, t: '', c: 'M', s: 1 }]) }] }
          });
        }
      },
      function leTrick() {
        const x = rnd(2, 9), a = rnd(2, 5), b = rnd(3, 12), c = a * (x + b), who = pick(NAMES);
        return mk('leTrick', 2, 'LE2', {
          story: who + ' thinks of a number, adds ' + B(b) + ', then multiplies by ' + B(a) + '. The result is ' + B(c) + '.',
          q: 'The number?', v: x, cue: 'Undo in reverse order',
          errs: [[c / a + b, 'Undo + ' + b + ' with − ' + b, 1], [R((c - b) / a, 2), 'Undo the last step first', 0], [c / a, 'Then undo the + ' + b, 1]],
          steps: [['undo × ' + a, c + ' ÷ ' + a + ' = ' + c / a], ['undo + ' + b, c / a + ' − ' + b + ' = ' + x]],
          pic: { k: 'flow', boxes: [{ q: true }, { t: '', d: String(x + b), s: 0 }, { t: String(c) }], ops: ['+ ' + b, '× ' + a], inv: [{ t: '÷ ' + a, s: 0 }, { t: '− ' + b, s: 1 }] }
        });
      }
    ],
    3: [
      function leGym() {
        for (;;) {
          const r1 = rnd(25, 45), r2 = r1 - rnd(5, 15), m = rnd(4, 12), a = 5 * rnd(2, 10), b = a + (r1 - r2) * m;
          if (b > 200) continue;
          return mk('leGym', 3, 'LE5', {
            story: 'Gym A: ' + B('$' + a) + ' to join, then ' + B('$' + r1 + ' a month') + '. Gym B: ' + B('$' + b) + ' to join, then ' + B('$' + r2 + ' a month') + '.',
            q: 'Same cost when?', v: m, unit: 'months', cue: 'Set the two costs equal',
            errs: [[R((b - a) / r1, 2), 'Divide by the rate gap', 2], [R((b - a) / (r1 + r2), 2), 'Rates subtract, not add', 1], [b - a, 'Divide by the rate gap', 2], [R((b + a) / (r1 - r2), 2), 'The fees subtract too', 1]],
            steps: [['equal costs', a + ' + ' + r1 + 'm = ' + b + ' + ' + r2 + 'm'], ['collect', r1 + 'm − ' + r2 + 'm = ' + b + ' − ' + a + ', so ' + (r1 - r2) + 'm = ' + (b - a)], ['÷ ' + (r1 - r2), 'm = ' + (b - a) + ' ÷ ' + (r1 - r2) + ' = ' + m + ' months']],
            pic: { k: 'graph', xl: 'months', yl: 'cost ($)', lines: [{ m: r1, b: a, x0: 0, x1: m * 1.6, c: 'L', t: 'A' }, { m: r2, b, x0: 0, x1: m * 1.6, c: 'G', t: 'B' }], pts: [{ x: m, y: a + r1 * m, q: true, pos: 'b' }] }
          });
        }
      },
      function leDogRun() {
        const w = rnd(3, 14), k = rnd(1, 6), L = 2 * w + k, Per = 2 * (L + w), A = L * w;
        return mk('leDogRun', 3, 'LE5', {
          story: 'A rectangular dog run is ' + B(k + ' m') + ' longer than twice its width. Its perimeter is ' + B(Per + ' m') + '.',
          q: 'Area of the run?', v: A, unit: 'm²', cue: 'Width, then length, then area',
          errs: [[w, 'That’s the width: keep going', 1], [L, 'Area = length × width', 2], [L + w, 'Area = length × width', 2], [Per, 'That’s the perimeter', 0]],
          steps: [['2(l + w) = P', '2(w + 2w + ' + k + ') = ' + Per + ', so 6w + ' + 2 * k + ' = ' + Per], ['solve for w', 'w = ' + (Per - 2 * k) + ' ÷ 6 = ' + w + ', length = ' + L], ['area', L + ' × ' + w + ' = ' + A + ' m²']],
          pic: { k: 'rects', foot: 'perimeter ' + Per + ' m', rs: [{ x: 0, y: 0, w: L, h: w, c: 'N', t: '?', tw: '2w + ' + k, twd: L + ' m', lh: 'w' }] }
        });
      },
      function leMarket() {
        for (;;) {
          const booth = pick([60, 75, 90, 120]), price = pick([6, 7, 8, 9]), cost = pick([2, 2.5, 3, 3.5]), goal = pick([100, 150, 200]);
          const prof = price - cost, need = (booth + goal) / prof, n = Math.ceil(need - 1e-9);
          if (Number.isInteger(need)) continue;
          return mk('leMarket', 3, 'LE4', {
            story: 'A market booth costs ' + B('$' + booth) + '. A bag of beans sells for ' + B('$' + price) + ' and costs ' + B($(cost)) + ' to grow. Goal: ' + B('$' + goal) + ' profit.',
            q: 'Fewest bags?', v: n, unit: 'bags', cue: 'Profit per bag first',
            errs: [[n - 1, 'Round up to reach the goal', 2], [Math.ceil(goal / prof), 'Pay for the booth too', 1], [Math.ceil((booth + goal) / price), 'Profit per bag: price − cost', 0], [R(need, 2), 'Bags come whole: round up', 2]],
            steps: [['profit per bag', '$' + price + ' − ' + $(cost) + ' = ' + $(prof)], ['solve', F(prof) + 'b − ' + booth + ' ≥ ' + goal + ', so b ≥ ' + F(R(need, 2))], ['round up', n + ' bags']],
            pic: { k: 'bar', rows: [{ t: 'to cover', segs: [{ v: booth, t: 'booth $' + booth, c: 'R' }, { v: goal, t: 'goal $' + goal, c: 'N' }] }, { t: 'bags × (price − cost)', segs: [{ v: booth + goal, t: '?', q: true, d: n + ' bags × ' + $(prof), c: 'Y' }] }] }
          });
        }
      }
    ]
  };

  /* ============ PO · Polynomials (the answer is a polynomial in x) ============ */
  const X = 9;                                                            // x in the pictures (a schematic, not to scale)
  const grid = (cols, rows, cells, foot) => {                              // an area model: cols/rows [{v, t}], cells[r][c] {c, t}
    const rs = []; let y = 0;
    rows.forEach((rw, i) => { let x = 0; cols.forEach((cl, j) => { const cc = cells[i][j]; rs.push(Object.assign({ x, y, w: cl.v, h: rw.v, c: cc.c, t: cc.t || ' ', td: cc.td }, i === 0 ? { tw: cl.t } : {}, j === 0 ? { lh: rw.t } : {})); x += cl.v; }); y += rw.v; });
    return { k: 'rects', foot, rs };
  };
  const PO = {
    1: [
      function poTri() {
        const s = [0, 1, 2].map(() => [rnd(1, 6), Q.nz(-6, 9)]), p = { 1: s[0][0] + s[1][0] + s[2][0], 0: s[0][1] + s[1][1] + s[2][1] };
        return mk('poTri', 1, 'PO3', {
          story: 'A triangular garden has sides ' + s.map(([a, b]) => B(bn(a, b))).join(', ') + ' metres.',
          q: 'Perimeter?', poly: p, unit: 'm', cue: 'x-terms together, numbers together',
          errs: [[{ 1: s[0][0] + s[1][0], 0: s[0][1] + s[1][1] }, 'Add all three sides', 0], [{ 1: p[1], 0: s.reduce((t, q) => t + Math.abs(q[1]), 0) }, 'Watch the negative numbers', 0], [{ 1: p[1] + p[0], 0: 0 }, 'x-terms and numbers don’t combine', 0]],
          steps: [['add like terms', s.map(([a, b]) => bn(a, b)).join(' + ') + ' = ' + ps(p)]],
          pic: { k: 'shape', q: true, pts: [[0, 4], [2.2, 0], [6, 4]], sides: s.map(([a, b]) => ({ t: ps({ 1: a, 0: b }) })) }
        });
      },
      function poKeep() {
        const a = rnd(8, 15), b = rnd(10, 40), c = rnd(1, 4), d = rnd(2, 15), who = pick(NAMES), p = { 1: a - c, 0: b - d };
        return mk('poKeep', 1, 'PO4', {
          story: who + ' earns ' + B(ps({ 1: a, 0: b })) + ' dollars mowing for x hours and spends ' + B(ps({ 1: c, 0: d })) + ' dollars on gas.',
          q: 'Amount kept?', poly: p, unit: 'dollars', cue: 'Earned − gas: every term',
          errs: [[{ 1: a - c, 0: b + d }, 'Subtract both terms of the gas', 0], [{ 1: a + c, 0: b + d }, 'Kept = earned − gas', 0], [{ 1: a - c, 0: d - b }, 'Earned first, then minus gas', 0]],
          steps: [['earned − gas', bn(a, b) + ' − ' + bn(c, d) + ' = ' + ps(p)]],
          pic: { k: 'bar', rows: [{ t: 'earned', segs: [{ v: a * X + b, t: ps({ 1: a, 0: b }), c: 'N' }] }, { t: 'gas + kept', segs: [{ v: c * X + d, t: ps({ 1: c, 0: d }), c: 'R' }, { v: (a - c) * X + b - d, t: '?', q: true, c: 'Y' }] }] }
        });
      },
      function poLockers() {
        const a = rnd(2, 6), b = rnd(1, 9), c = rnd(3, 6), p = { 1: a * c, 0: b * c };
        return mk('poLockers', 1, 'PO5', {
          story: 'A row of ' + B(c + ' lockers') + ' is built. Each locker is ' + B(bn(a, b) + ' cm') + ' wide.',
          q: 'Total width?', poly: p, unit: 'cm', cue: 'Multiply both terms by ' + c,
          errs: [[{ 1: a * c, 0: b }, 'Multiply both terms by ' + c, 0], [{ 1: a, 0: b * c }, 'Multiply both terms by ' + c, 0], [{ 1: a + c, 0: b }, 'Multiply, don’t add', 0]],
          steps: [['× ' + c, c + bn(a, b) + ' = ' + ps(p)]],
          pic: { k: 'rects', foot: '?', rs: Array.from({ length: c }, (_, i) => ({ x: i, y: 0, w: 1, h: 2.2, c: 'L', t: i === 0 ? ps({ 1: a, 0: b }) : '' })) }
        });
      }
    ],
    2: [
      function poDeck() {
        const a = rnd(2, 8), b = rnd(1, 7), p = { 2: 1, 1: a + b, 0: a * b };
        return mk('poDeck', 2, 'PO6', {
          story: 'A rectangular deck is ' + B('(x + ' + a + ') m') + ' long and ' + B('(x + ' + b + ') m') + ' wide.',
          q: 'Area of the deck?', poly: p, unit: 'm²', cue: 'Each term times each term',
          errs: [[{ 2: 1, 0: a * b }, 'Don’t forget the middle terms', 0], [{ 2: 1, 1: a + b, 0: a + b }, 'The corner is ' + a + ' × ' + b, 0], [{ 1: 4, 0: 2 * (a + b) }, 'Area, not perimeter', 0], [{ 2: 1, 1: a, 0: a * b }, 'There are two middle terms', 1], [{ 2: 1, 1: b, 0: a * b }, 'There are two middle terms', 1]],
          steps: [['four parts', 'x² + ' + a + 'x + ' + b + 'x + ' + a * b], ['collect', ps(p)]],
          pic: grid([{ v: X, t: 'x' }, { v: a, t: '+ ' + a }], [{ v: X, t: 'x' }, { v: b, t: '+ ' + b }],
            [[{ c: 'L', td: 'x²' }, { c: 'T', td: a + 'x' }], [{ c: 'T', td: b + 'x' }, { c: 'Y', td: String(a * b) }]], '?')
        });
      },
      function poPoster() {
        const a = rnd(2, 5), b = rnd(1, 9), c = rnd(1, 4), d = Q.nz(-4, 6), sm = { 1: a + c, 0: b + d }, p = { 1: 2 * (a + c), 0: 2 * (b + d) };
        return mk('poPoster', 2, 'PO3', {
          story: 'A rectangular poster is ' + B(bn(a, b) + ' cm') + ' long and ' + B(bn(c, d) + ' cm') + ' wide.',
          q: 'Perimeter?', poly: p, unit: 'cm', cue: 'Two lengths plus two widths',
          errs: [[sm, 'A rectangle has four sides', 1], [{ 1: 2 * a + c, 0: 2 * b + d }, 'Two widths too', 1], [{ 1: a + 2 * c, 0: b + 2 * d }, 'Two lengths too', 1]],
          steps: [['length + width', bn(a, b) + ' + ' + bn(c, d) + ' = ' + ps(sm)], ['× 2', '2(' + ps(sm) + ') = ' + ps(p)]],
          pic: { k: 'rects', rs: [{ x: 0, y: 0, w: a * X + b, h: c * X + d, c: 'G', t: '?', tw: ps({ 1: a, 0: b }), lh: ps({ 1: c, 0: d }) }] }
        });
      },
      function poBed() {
        const a = rnd(2, 4), b = rnd(1, 6), c = rnd(2, 5), p = { 2: a * c, 1: b * c };
        return mk('poBed', 2, 'PO5', {
          story: 'A flower bed is ' + B(c + 'x m') + ' wide and ' + B(bn(a, b) + ' m') + ' long.',
          q: 'Area of the bed?', poly: p, unit: 'm²', cue: 'Multiply ' + c + 'x by both terms',
          errs: [[{ 2: a * c, 0: b * c }, c + 'x × ' + b + ' keeps the x', 1], [{ 2: a * c, 0: b }, 'Multiply both terms by ' + c + 'x', 1], [{ 1: a * c, 0: b * c }, 'x × x = x²', 0], [{ 1: 2 * (a + c), 0: 2 * b }, 'Area, not perimeter', 0]],
          steps: [['first term', c + 'x(' + a + 'x) = ' + a * c + 'x²'], ['second term', c + 'x(' + b + ') = ' + b * c + 'x']],
          pic: grid([{ v: a * X, t: a + 'x' }, { v: b, t: '+ ' + b }], [{ v: c * X, t: c + 'x' }], [[{ c: 'L', td: a * c + 'x²' }, { c: 'T', td: b * c + 'x' }]], '?')
        });
      }
    ],
    3: [
      function poShed() {
        const a = rnd(2, 8), b = rnd(1, 6), lot = { 2: 1, 1: a + b, 0: a * b }, p = { 1: a + b, 0: a * b };
        return mk('poShed', 3, 'PO6', {
          story: 'A lot is ' + B('(x + ' + a + ') m') + ' by ' + B('(x + ' + b + ') m') + '. A square shed, ' + B('x m') + ' on a side, sits on it.',
          q: 'Area not covered?', poly: p, deg: 2, unit: 'm²', cue: 'Lot area minus shed area',
          errs: [[lot, 'Now take away the shed', 2], [{ 0: a * b }, 'Don’t forget the middle terms', 0], [{ 1: a + b }, 'The corner is uncovered too', 0], [{ 2: -1, 0: a * b }, 'Don’t forget the middle terms', 0]],
          steps: [['lot', '(x + ' + a + ')(x + ' + b + ') = ' + ps(lot)], ['shed', 'x · x = x²'], ['lot − shed', ps(lot) + ' − x² = ' + ps(p)]],
          pic: grid([{ v: X, t: 'x' }, { v: a, t: '+ ' + a }], [{ v: X, t: 'x' }, { v: b, t: '+ ' + b }],
            [[{ c: 'R', t: 'shed', td: 'shed x²' }, { c: 'N', td: a + 'x' }], [{ c: 'N', td: b + 'x' }, { c: 'N', td: String(a * b) }]], '?')
        });
      },
      function poCutout() {
        const k = rnd(2, 3), a = rnd(1, 6), b = rnd(1, 5), x = rnd(2, 8), full = { 2: k, 1: k * b + a, 0: a * b }, p = { 2: k - 1, 1: k * b + a, 0: a * b };
        const val = x2 => p[2] * x2 * x2 + p[1] * x2 + p[0], v = val(x);
        return mk('poCutout', 3, 'PO6', {
          story: 'A rectangle is ' + B(bn(k, a) + ' cm') + ' by ' + B('(x + ' + b + ') cm') + '. A square, ' + B('x cm') + ' on a side, is cut out. Let ' + B('x = ' + x) + '.',
          q: 'Area left?', v, unit: 'cm²', cue: 'Expand, subtract x², substitute',
          errs: [[v + x * x, 'Cut out the square', 1], [v - a * x, 'There are two middle terms', 0], [v - (k * b + a) * x, 'Don’t forget the middle terms', 0], [v + x * x - 4 * x, 'The square’s area is x²', 1]],
          steps: [['expand', bn(k, a) + '(x + ' + b + ') = ' + ps(full)], ['− x²', ps(full) + ' − x² = ' + ps(p)], ['x = ' + x, (p[2] === 1 ? '' : p[2]) + '(' + x * x + ') + ' + p[1] + '(' + x + ') + ' + p[0] + ' = ' + v]],
          pic: { k: 'rects', foot: '?', rs: [{ x: 0, y: 0, w: k * X + a, h: X + b, c: 'L', t: '', tw: ps({ 1: k, 0: a }), lh: 'x + ' + b }, { x: 0, y: 0, w: X, h: X, c: 'R', t: 'cut x²' }] }
        });
      },
      function poFrame() {
        const a = rnd(2, 6), b = rnd(1, 4), outer = { 2: 1, 1: 2 * a + 2 * b, 0: 4 * a * b }, p = { 1: 2 * a + 2 * b, 0: 4 * a * b };
        return mk('poFrame', 3, 'PO6', {
          story: 'A square photo is ' + B('x cm') + ' on a side. Its frame adds ' + B(a + ' cm') + ' on the left and right, and ' + B(b + ' cm') + ' on the top and bottom.',
          q: 'Area of the frame?', poly: p, deg: 2, unit: 'cm²', cue: 'Outer area minus the photo',
          errs: [[outer, 'Now take away the photo', 2], [{ 1: a + b, 0: a * b }, 'The frame is on both sides', 0], [{ 2: 1, 1: a + b, 0: a * b }, 'The frame is on both sides', 0], [{ 1: 2 * a + 2 * b }, 'The corners are frame too', 1]],
          steps: [['outer size', '(x + ' + 2 * a + ') by (x + ' + 2 * b + ')'], ['outer area', '(x + ' + 2 * a + ')(x + ' + 2 * b + ') = ' + ps(outer)], ['− photo x²', ps(outer) + ' − x² = ' + ps(p)]],
          pic: { k: 'rects', foot: '?', rs: [{ x: 0, y: 0, w: X + 2 * a, h: X + 2 * b, c: 'G', t: '', tw: 'x + ' + 2 * a, tws: 0 }, { x: a, y: b, w: X, h: X, c: 'L', t: 'photo x²' }] }
        });
      }
    ]
  };

  const TOPICS = { rn: RN, sr: SR, pe: PE, lr: LR, le: LE, po: PO };
  const lvlAt = n => n == null ? rnd(1, 3) : n < 3 ? 1 : n < 7 ? 2 : 3;   // a round: 3 one-step, 4 two-step, 3 three-step
  const gen = (topic, n) => pick(TOPICS[topic][lvlAt(n)])();
  const genMix = n => { const t = pick(Object.keys(TOPICS)); return Object.assign(gen(t, n), { topic: t }); };
  return { TOPICS, gen, genMix, check, resp, sameP, ps, lvlAt, R, F, pw, N };
})();
