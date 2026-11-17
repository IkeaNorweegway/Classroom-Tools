
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
    const et = o.et != null ? o.et : Math.max(tol, .051), gap = o.et != null ? et + tol : et;   // et: how close a typed answer must be to a named mistake
    const keep = e => poly ? e[0] && typeof e[0] === 'object' && !sameP(e[0], poly) && (deg === 2 || !co(e[0], 2))
      : isFinite(e[0]) && Math.abs(e[0] - o.v) > gap + 1e-9 && (!o.prob || e[0] >= 0 && e[0] <= 1);
    const errs = (o.errs || []).filter(e => e && keep(e)).map(([v, cue, s]) => ({ v, cue, s }));
    return { t, lvl, code, story: o.story, ask: o.ask || '', q: o.q, v: poly ? null : o.v, poly, deg, dp, tol, pre: o.pre || '', unit: o.unit || '', ans: o.ans || (poly ? ps(poly) : F(o.v, dp)),
      errs, et, prob: !!o.prob, cue: o.cue, steps: o.steps.map(([l, m]) => ({ l, m })), pic: o.pic };
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
    const pct = it.prob && typeof r.v === 'string' && /%\s*$/.test(r.v), raw = pct ? r.v.replace(/%\s*$/, '').trim() : r.v;
    const pv = typeof raw === 'string' ? Q.parse(raw) : raw;
    const g = raw == null || raw === '' || pv == null ? NaN : Q.val(pv) / (pct ? 100 : 1);   // a probability may be typed as a percent
    if (Math.abs(g - it.v) <= it.tol) return { ok: true };
    if (it.prob && g > 1) return { code: 'over1', cue: 'Use a fraction, decimal or %', s: -1 };
    const et = it.et != null ? it.et : Math.max(it.tol, .051);
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
          ask: 'How many degrees warmer was it at 3 p.m.?', q: 'How much warmer?', v: d, unit: '°C', cue: 'Change = final − start',
          errs: [[t2 + t1, 'Minus a negative means add', 0]],
          steps: [['final − start', F(t2) + ' − ' + P(t1) + ' = ' + d + ' °C']],
          pic: { k: 'nl', unit: '°C', pts: [{ x: t1, t: '7 a.m.', c: 'L' }, { x: t2, t: '3 p.m.', c: 'Y' }], jumps: [{ a: t1, b: t2, t: '+' + d, c: 'N', s: 0, q: true }] }
        });
      },
      function rnLunch() {
        const owe = rnd(500, 4500) / 100, dep = rnd(2000, 9000) / 100, bal = R(dep - owe, 2), n = pick(NAMES);
        return mk('rnLunch', 1, 'RN2', {
          story: n + '’s lunch account is at ' + B($(-owe)) + '. ' + n + ' puts in ' + B($(dep)) + '.',
          ask: 'What is ' + n + '’s new balance?', q: 'New balance?', v: bal, dp: 2, pre: '$', cue: 'Start below zero, then add',
          errs: [[R(dep + owe, 2), 'The balance starts below zero', 0]],
          steps: [['start + deposit', F(-owe, 2) + ' + ' + F(dep, 2) + ' = ' + F(bal, 2)]],
          pic: { k: 'nl', unit: '$', pts: [{ x: -owe, t: 'now', c: 'R' }], jumps: [{ a: -owe, b: bal, t: '+' + F(dep, 2), c: 'N', s: 0, q: true }] }
        });
      },
      function rnDive() {
        const d = rnd(30, 90) / 10, k = rnd(3, 6), v = R(-d * k, 1);
        return mk('rnDive', 1, 'RN3', {
          story: 'A drone sub dives ' + B(F(d, 1) + ' m') + ' every minute. It dives for ' + B(k + ' minutes') + '.',
          ask: 'What is the sub’s total change in depth?', q: 'Change in depth?', v, dp: 1, unit: 'm', cue: 'Down is negative: × minutes',
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
          ask: 'What is the temperature after ' + h + ' hours?', q: 'Final temperature?', v: e, dp: 1, unit: '°C', cue: 'Total drop, then subtract',
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
            ask: 'How much rope is left?', q: 'How much is left?', v: rem / 8, dp: 3, tol: .002, unit: 'm', ans: Q.str(Q.q(rem, 8)), cue: 'Both pieces, in eighths',
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
          ask: 'How much change do you get back?', q: 'Your change?', v: ch, dp: 2, pre: '$', cue: 'Cost first, then subtract',
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
            ask: 'How many degrees warmer than the coldest day is the mean low?', q: 'Mean − coldest?', v: d, dp: 1, unit: '°C', cue: 'Mean first, then compare',
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
          ask: 'What is the diver’s final position?', q: 'Final position?', v: e, dp: 2, unit: 'm', cue: 'Rise 3/4 of the depth',
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
          ask: 'What is your total gain (+) or loss (−) after the fee?', q: 'Gain or loss?', v: net, dp: 2, pre: '$', cue: 'Per share × shares − fee',
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
          story: 'A square vegetable garden has an area of ' + B(A + ' m²') + '.', ask: 'How long is each side of the garden?', q: 'Side length?', v: s, unit: 'm', cue: 'Side = √area',
          errs: [[A / 2, '√ is not ÷ 2', 0], [A / 4, 'Area = side × side', 0]],
          steps: [['side = √area', '√' + A + ' = ' + s + ' m']],
          pic: { k: 'rects', rs: [{ x: 0, y: 0, w: 1, h: 1, c: 'N', t: A + ' m²', tw: '?', q: true }] }
        });
      },
      function srTile() {
        const s = pick([0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.1, 1.2]), A = R(s * s, 2);
        return mk('srTile', 1, 'SR4', {
          story: 'A square floor tile has an area of ' + B(F(A, 2) + ' m²') + '.', ask: 'How long is each side of the tile?', q: 'Side length?', v: s, dp: 1, unit: 'm', cue: 'What × itself = ' + F(A, 2) + '?',
          errs: [[R(A / 2, 3), '√ is not ÷ 2', 0], [R(s / 10, 2), 'Check: side × side', 0], [R(s * 10, 1), 'Check: side × side', 0]],
          steps: [['side = √area', '√' + F(A, 2) + ' = ' + F(s, 1) + ' m (' + F(s, 1) + ' × ' + F(s, 1) + ')']],
          pic: { k: 'rects', rs: [{ x: 0, y: 0, w: 1, h: 1, c: 'L', t: F(A, 2) + ' m²', tw: '?', q: true }] }
        });
      },
      function srPoster() {
        const n = pick([20, 30, 40, 45, 50, 60, 70, 80, 90]), lo = Math.floor(Math.sqrt(n)), e = R(Math.sqrt(n), 1);
        return mk('srPoster', 1, 'SR2', {
          story: 'A square poster has an area of ' + B(n + ' dm²') + '. Estimate its side to ' + B('one decimal place') + '.', ask: 'About how long is each side of the poster?', q: 'About how long?', v: e, dp: 1, unit: 'dm', cue: 'Find the squares around ' + n,
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
          story: 'A square horse paddock has an area of ' + B(A + ' m²') + '. It needs a fence all the way around.', ask: 'How many metres of fence are needed?', q: 'Metres of fence?', v: 4 * s, unit: 'm', cue: 'Side first, then all 4',
          errs: [[s, 'The fence goes around 4 sides', 1], [A / 4, 'Side = √area', 0], [A / 2, '√ is not ÷ 2', 0]],
          steps: [['side = √area', '√' + A + ' = ' + s + ' m'], ['perimeter', '4 × ' + s + ' = ' + 4 * s + ' m']],
          pic: { k: 'rects', rs: [{ x: 0, y: 0, w: 1, h: 1, c: 'N', t: A + ' m²', tw: s + ' m', tws: 0, ring: 1 }] }
        });
      },
      function srTV() {
        const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [9, 12, 15], [12, 16, 20]]), k = pick([3, 4]), w = b * k, h = a * k, d = c * k;
        return mk('srTV', 2, 'SR3', {
          story: 'A TV screen is ' + B(w + ' in') + ' wide and ' + B(h + ' in') + ' tall. TVs are sold by the diagonal.', ask: 'What is the diagonal size of the screen?', q: 'Diagonal size?', v: d, unit: 'in', cue: 'Square, add, then √',
          errs: [[w + h, 'Square the sides first', 0], [w * w + h * h, 'Now take the square root', 1], [Math.sqrt(w * w - h * h), 'Add the squares', 0]],
          steps: [['d² = w² + h²', w + '² + ' + h + '² = ' + (w * w + h * h)], ['d = √', '√' + d * d + ' = ' + d + ' in']],
          pic: { k: 'tri', scene: 'tv', a: w, b: h, la: w + ' in', lb: h + ' in', lc: '?', q: 'c' }
        });
      },
      function srWire() {
        const [a, b, c] = pick(TRIPLES), k = pick([2, 3, 4]), run = a * k, up = b * k, L = c * k;
        return mk('srWire', 2, 'SR3', {
          story: 'A wire runs from the top of a ' + B(up + ' m') + ' mast to a stake ' + B(run + ' m') + ' from its base.', ask: 'How long is the wire?', q: 'Length of wire?', v: L, unit: 'm', cue: 'The wire is the hypotenuse',
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
          story: 'A ' + B(F(lad) + ' m') + ' ladder leans on a wall, its foot ' + B(F(base) + ' m') + ' out. A window sill is ' + B(F(sill, 1) + ' m') + ' up.', ask: 'How far above the sill does the top of the ladder reach?', q: 'Above the sill?', v: up, dp: 2, unit: 'm', cue: 'Height of the top first',
          errs: [[h, 'Now compare with the sill', 2], [R(Math.sqrt(lad * lad + base * base) - sill, 2), 'The ladder is the hypotenuse', 0], [R(lad - sill, 2), 'Find the height first', 1]],
          steps: [['h² = L² − b²', F(lad) + '² − ' + F(base) + '² = ' + F(R(h * h, 4))], ['h = √', '√' + F(R(h * h, 4)) + ' = ' + F(h) + ' m'], ['above the sill', F(h) + ' − ' + F(sill, 1) + ' = ' + F(up, 2) + ' m']],
          pic: { k: 'tri', scene: 'ladder', a: base, b: h, la: F(base) + ' m', lb: 'h', lbd: 'h = ' + F(h) + ' m', lc: F(lad) + ' m', q: 'b', mark: { y: sill, t: 'sill ' + F(sill, 1) + ' m' } }
        });
      },
      function srPatio() {
        const s1 = rnd(9, 16), s2 = rnd(4, s1 - 2), A1 = s1 * s1, A2 = s2 * s2, per = 4 * s1 + 2 * s2;
        return mk('srPatio', 3, 'SR1', {
          story: 'A square patio (' + B(A1 + ' m²') + ') and a square garden (' + B(A2 + ' m²') + ') sit side by side, bottoms lined up.', ask: 'What is the perimeter around the outside of the two squares?', q: 'Outside perimeter?', v: per, unit: 'm', cue: 'Sides, then the outside edge',
          errs: [[4 * s1 + 4 * s2, 'The shared edge is inside', 2], [4 * s1 + 3 * s2, 'Take it off both squares', 2], [A1 + A2, 'That’s area, not perimeter', 0]],
          steps: [['sides', '√' + A1 + ' = ' + s1 + ',  √' + A2 + ' = ' + s2], ['both perimeters', '4(' + s1 + ') + 4(' + s2 + ') = ' + (4 * s1 + 4 * s2)], ['shared edge ×2', (4 * s1 + 4 * s2) + ' − 2(' + s2 + ') = ' + per + ' m']],
          pic: { k: 'rects', rs: [{ x: 0, y: 0, w: s1, h: s1, c: 'L', t: A1 + ' m²' }, { x: s1, y: s1 - s2, w: s2, h: s2, c: 'N', t: A2 + ' m²' }], shared: { x: s1, y0: s1 - s2, y1: s1, s: 2 } }
        });
      },
      function srPark() {
        const [a, b, c] = pick([[5, 12, 13], [8, 15, 17], [20, 21, 29], [7, 24, 25]]), k = pick([10, 20]), w = a * k, l = b * k, d = c * k, sv = w + l - d;
        return mk('srPark', 3, 'SR3', {
          story: 'A park is ' + B(w + ' m') + ' by ' + B(l + ' m') + '. You cut across the diagonal instead of walking two sides.', ask: 'How many metres do you save by cutting across?', q: 'Metres saved?', v: sv, unit: 'm', cue: 'Sides − diagonal',
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
          story: 'One bacterium splits into ' + B('2') + ' every hour. Every new one splits too. Count after ' + B(n + ' hours') + '.', ask: 'How many bacteria are there after ' + n + ' hours?', q: 'How many bacteria?', v, cue: 'Times 2, ' + n + ' times',
          errs: [[2 * n, 'Doubling is × 2 each hour', 0], [n * n, pw('2', 'n') + ', not n²', 0], [Math.pow(2, n - 1), 'Count all ' + n + ' hours', 0]],
          steps: [['2 × 2 × … ' + n + ' times', pw('2', n) + ' = ' + N(v)]],
          pic: { k: 'chain', start: '1', op: '× 2', n, end: '?' }
        });
      },
      function peCube() {
        const s = rnd(3, 12), v = s * s * s;
        return mk('peCube', 1, 'PE1', {
          story: 'A cube-shaped storage box has edges ' + B(s + ' dm') + ' long.', ask: 'What is the volume of the box?', q: 'Volume?', v, unit: 'dm³', cue: 'V = edge³',
          errs: [[3 * s, pw('s', 3) + ' is s·s·s', 0], [s * s, 'Volume needs three edges', 0], [6 * s * s, 'That’s surface area', 0]],
          steps: [['V = s³', pw(s, 3) + ' = ' + s + ' × ' + s + ' × ' + s + ' = ' + v + ' dm³']],
          pic: { k: 'cube', edge: s + ' dm' }
        });
      },
      function peSand() {
        const a = rnd(4, 9), b = rnd(2, 5), v = Math.pow(10, b);
        return mk('peSand', 1, 'PE4', {
          story: 'A cell is ' + B(pw('10', -a) + ' m') + ' across. A grain of sand is ' + B(pw('10', -a + b) + ' m') + ' across.', ask: 'How many times wider is the grain of sand than the cell?', q: 'How many times wider?', v, cue: 'Divide: subtract the exponents',
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
          story: 'A culture starts with ' + B(p0 + ' bacteria') + '. It doubles every ' + B(h + ' hours') + '. Count after ' + B(t + ' hours') + '.', ask: 'How many bacteria are there after ' + t + ' hours?', q: 'How many bacteria?', v, cue: 'Doublings first: ' + t + ' ÷ ' + h,
          errs: [[p0 * Math.pow(2, t), 'Count doublings: ' + t + ' ÷ ' + h, 0], [p0 * 2 * k, 'Doubling ' + k + ' times is ' + pw('2', k), 1], [Math.pow(2, k), 'Start with ' + p0, 1]],
          steps: [['doublings', t + ' ÷ ' + h + ' = ' + k], ['start × 2ᵏ', p0 + ' × ' + pw('2', k) + ' = ' + p0 + ' × ' + Math.pow(2, k) + ' = ' + N(v)]],
          pic: { k: 'chain', start: String(p0), op: '× 2', n: k, end: '?', every: h + ' h', cnt: '?', cntd: k + ' × (×2)' }
        });
      },
      function peUSB() {
        const a = pick([30, 32, 34, 36]), b = pick([18, 20, 22, 24]), d = a - b, v = Math.pow(2, d);
        return mk('peUSB', 2, 'PE4', {
          story: 'A USB drive holds ' + B(pw('2', a) + ' bytes') + '. One photo uses ' + B(pw('2', b) + ' bytes') + '.', ask: 'How many photos fit on the drive?', q: 'How many photos fit?', v, cue: 'Same base: subtract exponents',
          errs: [[d, 'Now evaluate ' + pw('2', d), 1], [Math.pow(2, Math.round(a / b)), 'Subtract exponents, don’t divide', 0], [a / b, 'Subtract exponents, don’t divide', 0]],
          steps: [['divide the powers', pw('2', a) + ' ÷ ' + pw('2', b) + ' = ' + pw('2', a + '−' + b) + ' = ' + pw('2', d)], ['evaluate', pw('2', d) + ' = ' + N(v)]],
          pic: { k: 'chain', start: pw('2', b), op: '× 2', n: d, end: pw('2', a), cnt: '?', cntd: d + ' × (×2)' }
        });
      },
      function peSolar() {
        const [b, m] = pick([[2, 3], [2, 4], [3, 2], [3, 3], [5, 2], [2, 5]]), e = 2 * m, v = Math.pow(b, e);
        return mk('peSolar', 2, 'PE5', {
          story: 'A square solar-panel field is ' + B(pw(b, m) + ' m') + ' on each side.', ask: 'What is the area of the field?', q: 'Area of the field?', v, unit: 'm²', cue: 'Power of a power: multiply',
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
          story: 'A big cube has edges ' + B(pw('2', a) + ' cm') + '. Small cubes with edges ' + B(pw('2', b) + ' cm') + ' fill it with no gaps.', ask: 'How many small cubes fit inside the big cube?', q: 'How many small cubes?', v, cue: 'Along one edge, then cube',
          errs: [[Math.pow(2, a - b), 'Now cube it: 3 directions', 1], [3 * Math.pow(2, a - b), 'Cubed means ³, not × 3', 1], [Math.pow(2, 3 * a), 'Divide by the small edge', 0]],
          steps: [['along one edge', pw('2', a) + ' ÷ ' + pw('2', b) + ' = ' + pw('2', a - b)], ['cube it', '(' + pw('2', a - b) + ')³ = ' + pw('2', e)], ['evaluate', pw('2', e) + ' = ' + N(v)]],
          pic: { k: 'cube', edge: pw('2', a) + ' cm', n: Math.pow(2, a - b), small: pw('2', b) + ' cm' }
        });
      },
      function peHalf() {
        const k = rnd(3, 6), s0 = 25 * Math.pow(2, k) * pick([1, 2, 4]), hl = pick([2, 3, 5, 8]), t = hl * k, left = s0 / Math.pow(2, k), dec = s0 - left;
        return mk('peHalf', 3, 'PE7', {
          story: 'A medical tracer has a half-life of ' + B(hl + ' days') + '. A hospital gets ' + B(N(s0) + ' mg') + '. Wait ' + B(t + ' days') + '.', ask: 'How many milligrams have decayed after ' + t + ' days?', q: 'How many mg decayed?', v: dec, unit: 'mg', cue: 'Half-lives, left, then subtract',
          errs: [[left, 'That’s what is left', 2], [s0 / 2, 'Count the half-lives: ' + t + ' ÷ ' + hl, 0], [s0 - s0 / (2 * k), 'Halve it each half-life', 1]],
          steps: [['half-lives', t + ' ÷ ' + hl + ' = ' + k], ['left', N(s0) + ' × (½)' + pw('', k) + ' = ' + N(left) + ' mg'], ['decayed', N(s0) + ' − ' + N(left) + ' = ' + N(dec) + ' mg']],
          pic: { k: 'chain', start: N(s0), op: '÷ 2', n: k, end: '?', endd: N(left) + ' mg', every: hl + ' d', cnt: '?', cntd: k + ' × (÷2)' }
        });
      },
      function peChain() {
        const r = rnd(4, 7), tot = (Math.pow(3, r + 1) - 3) / 2;
        return mk('peChain', 3, 'PE1', {
          story: 'You send a message to ' + B('3') + ' friends (round 1). Each round, every new person sends it to ' + B('3') + ' more.', ask: 'How many people have the message after ' + r + ' rounds?', q: 'Total after ' + r + ' rounds?', v: tot, cue: 'Round k reaches 3ᵏ: add them',
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
          ask: 'How much is your bill?', q: 'Your bill?', v: C, dp: 2, pre: '$', cue: 'Substitute n, then add',
          errs: [[R(rate * n, 2), 'Add the $' + base + ' base', 0], [R((base + rate) * n, 2), 'Only the rate is × n', 0], [R(base + rate + n, 2), rate + 'n means multiply', 0]],
          steps: [['substitute n', base + ' + ' + rate + '(' + n + ') = ' + $(C)]],
          pic: { k: 'graph', xl: 'minutes over', yl: 'C ($)', lines: [{ m: rate, b: base, x0: 0, x1: n * 1.25, c: 'L' }], pts: [{ x: 0, y: base, t: '$' + base, c: 'L', pos: 'r' }, { x: n, y: C, q: true, pos: 'a' }], read: { x: n, s: 0 } }
        });
      },
      function lrCandle() {
        const h = rnd(18, 30), r = pick([1.5, 2, 2.5, 1.2]), t = rnd(2, Math.floor(h / r) - 2), left = R(h - r * t, 1);
        return mk('lrCandle', 1, 'LR3', {
          story: 'A candle’s height is ' + B('h = ' + h + ' − ' + F(r, 1) + 't') + ' cm after t hours. It burns for ' + B(t + ' hours') + '.',
          ask: 'How tall is the candle now?', q: 'Height now?', v: left, dp: 1, unit: 'cm', cue: 'Substitute t, then subtract',
          errs: [[R(h + r * t, 1), 'The candle burns down', 0], [R(r * t, 1), 'That’s how much burned', 0], [R((h - r) * t, 1), 'Only the rate is × t', 0]],
          steps: [['substitute t', h + ' − ' + F(r, 1) + '(' + t + ') = ' + F(left, 1) + ' cm']],
          pic: { k: 'graph', xl: 'hours', yl: 'h (cm)', lines: [{ m: -r, b: h, x0: 0, x1: h / r, c: 'L' }], pts: [{ x: 0, y: h, t: h + ' cm', c: 'L', pos: 'r' }, { x: t, y: left, q: true, pos: 'a' }], read: { x: t, s: 0 } }
        });
      },
      function lrWage() {
        const k = pick([12, 13, 14, 15, 16.5, 17.5]), hrs = rnd(4, 9), pay = R(k * hrs, 2), n = pick(NAMES);
        return mk('lrWage', 1, 'LR4', {
          story: n + '’s pay varies directly with hours worked. ' + n + ' earns ' + B(D(pay)) + ' for ' + B(hrs + ' hours') + '.',
          ask: 'How much does ' + n + ' earn per hour?', q: 'Pay per hour?', v: k, dp: 2, pre: '$', unit: '/h', cue: 'Rate = pay ÷ hours',
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
          ask: 'What is the plumber’s hourly rate?', q: 'Hourly rate?', v: rate, pre: '$', unit: '/h', cue: 'Cost change ÷ hours change',
          errs: [[R(c2 / h2, 2), 'The call-out fee is included', 0], [R(c1 / h1, 2), 'The call-out fee is included', 0], [c2 - c1, 'Divide by the change in hours', 1], [R((c2 - c1) / h2, 2), 'Use the change in hours', 1]],
          steps: [['change in cost', '$' + c2 + ' − $' + c1 + ' = $' + (c2 - c1)], ['÷ change in hours', (c2 - c1) + ' ÷ ' + (h2 - h1) + ' = $' + rate + ' per hour']],
          pic: { k: 'graph', xl: 'hours', yl: 'cost ($)', lines: [{ m: rate, b: call, x0: 0, x1: h2 + 1, c: 'L' }], pts: [{ x: h1, y: c1, t: '$' + c1, c: 'Y', pos: 'l' }, { x: h2, y: c2, t: '$' + c2, c: 'Y', pos: 'l' }], rr: { a: [h1, c1], b: [h2, c2], run: (h2 - h1) + ' h', rise: '$' + (c2 - c1), s0: 1, s1: 0 } }
        });
      },
      function lrBowling() {
        const base = pick([12, 15, 18, 20]), rate = pick([2.5, 3, 3.5, 4]), n = rnd(3, 9), T = R(base + rate * n, 2);
        return mk('lrBowling', 2, 'LR3', {
          story: 'Bowling costs ' + B('C = ' + F(rate) + 'g + ' + base) + ' dollars for g games, with shoes and entry. You spent ' + B($(T)) + '.',
          ask: 'How many games did you bowl?', q: 'How many games?', v: n, unit: 'games', cue: 'Take off the entry, then divide',
          errs: [[R(T / rate, 2), 'Take off the $' + base + ' first', 0], [R((T + base) / rate, 2), 'Subtract the entry, don’t add', 0], [R(T - base, 2), 'Now divide by ' + $(rate), 1]],
          steps: [['subtract entry', $(T) + ' − $' + base + ' = ' + $(T - base)], ['÷ price per game', $(T - base) + ' ÷ ' + $(rate) + ' = ' + n + ' games']],
          pic: { k: 'bar', rows: [{ t: 'spent ' + $(T), segs: [{ v: base, t: 'entry $' + base, c: 'R' }, { v: T - base, t: '?', q: true, d: n + ' games × ' + $(rate), c: 'N' }] }] }
        });
      },
      function lrPlant() {
        const m = pick([3, 4, 5, 6]), b = pick([10, 12, 20, 25]), x = rnd(8, 15), v = b + m * x, ys = [0, 2, 4].map(t => b + m * t);
        return mk('lrPlant', 2, 'LR1', {
          story: 'A plant grows at a steady rate. Its height: week 0, ' + B(ys[0] + ' cm') + '; week 2, ' + B(ys[1] + ' cm') + '; week 4, ' + B(ys[2] + ' cm') + '.',
          ask: 'How tall will the plant be in week ' + x + '?', q: 'Height in week ' + x + '?', v, unit: 'cm', cue: 'Growth per week first',
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
          ask: 'How much will a ' + h3 + '-hour job cost?', q: 'Cost for ' + h3 + ' hours?', v: c3, pre: '$', cue: 'Rate, then the fee',
          errs: [[R(c1 / h1 * h3, 2), 'There’s a call-out fee', 1], [R(c2 / h2 * h3, 2), 'There’s a call-out fee', 1], [rate * h3, 'Add the call-out fee', 2], [rate, 'That’s the rate: keep going', 0]],
          steps: [['rate', '(' + c2 + ' − ' + c1 + ') ÷ (' + h2 + ' − ' + h1 + ') = $' + rate + '/h'], ['call-out fee', c1 + ' − ' + rate + '(' + h1 + ') = $' + call], ['cost for ' + h3 + ' h', rate + '(' + h3 + ') + ' + call + ' = $' + c3]],
          pic: { k: 'graph', xl: 'hours', yl: 'cost ($)', lines: [{ m: rate, b: call, x0: 0, x1: h3 + .6, c: 'L' }], pts: [{ x: 0, y: call, t: 'fee $' + call, c: 'G', pos: 'r', s: 1 }, { x: h1, y: c1, t: '$' + c1, c: 'Y', pos: 'l' }, { x: h2, y: c2, t: '$' + c2, c: 'Y', pos: 'l' }, { x: h3, y: c3, q: true, pos: 'l' }], rr: { a: [h1, c1], b: [h2, c2], run: (h2 - h1) + ' h', rise: '$' + (c2 - c1), s0: 0, s1: 0 }, read: { x: h3, s: 2 } }
        });
      },
      function lrBalloon() {
        const r = pick([20, 25, 30, 40]), T = rnd(12, 25), H = r * T, t1 = rnd(3, 6), h1 = H - r * t1;
        return mk('lrBalloon', 3, 'LR3', {
          story: 'A hot-air balloon starts down from ' + B(H + ' m') + ' at a steady rate. After ' + B(t1 + ' minutes') + ' it is at ' + B(h1 + ' m') + '.',
          ask: 'How many minutes after it starts down does the balloon land?', q: 'Lands after how long?', v: T, unit: 'min', cue: 'Rate first, then height = 0',
          errs: [[T - t1, 'Count from the start', 2], [r, 'That’s the rate: keep going', 1], [H - h1, 'Divide the drop by the minutes', 1]],
          steps: [['drop', H + ' − ' + h1 + ' = ' + (H - h1) + ' m in ' + t1 + ' min'], ['rate', (H - h1) + ' ÷ ' + t1 + ' = ' + r + ' m per min'], ['h = 0', H + ' − ' + r + 't = 0, so t = ' + H + ' ÷ ' + r + ' = ' + T]],
          pic: { k: 'graph', xl: 'minutes', yl: 'height (m)', lines: [{ m: -r, b: H, x0: 0, x1: t1, c: 'L' }, { m: -r, b: H, x0: t1, x1: T, c: 'L', dash: true, s: 2 }], pts: [{ x: 0, y: H, t: H + ' m', c: 'L', pos: 'r' }, { x: t1, y: h1, t: t1 + ' min, ' + h1 + ' m', c: 'Y', pos: 'r' }, { x: T, y: 0, q: true, pos: 'a' }] }
        });
      },
      function lrTiles() {
        const d = pick([3, 4, 5, 6]), f1 = d + rnd(1, 5), N = rnd(20, 50), b = f1 - d, v = d * N + b;
        return mk('lrTiles', 3, 'LR1', {
          story: 'A tile pattern: Figure 1 has ' + B(f1) + ' tiles, Figure 2 has ' + B(f1 + d) + ', and Figure 3 has ' + B(f1 + 2 * d) + '.',
          ask: 'How many tiles are in Figure ' + N + '?', q: 'Tiles in Figure ' + N + '?', v, unit: 'tiles', cue: 'Find the rule, then substitute',
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
          ask: 'How much does one graphic novel cost?', q: 'Price of one?', v: price, dp: 2, pre: '$', cue: 'Total ÷ number of books',
          errs: [[R(T * n, 2), 'Undo × with ÷', 0], [R(T - n, 2), 'Undo × with ÷', 0]],
          steps: [[n + 'p = ' + F(T, 2), 'p = ' + $(T) + ' ÷ ' + n + ' = ' + $(price)]],
          pic: { k: 'bar', rows: [{ t: 'total ' + $(T), segs: Array.from({ length: n }, () => ({ v: 1, t: '?', q: true, d: $(price), c: 'Y' })) }] }
        });
      },
      function leSaved() {
        const [num, den] = pick([[2, 5], [3, 4], [2, 3], [3, 5], [5, 8], [3, 8], [3, 10]]), k = rnd(6, 30), S = den * k, cost = num * k, who = pick(NAMES);
        return mk('leSaved', 1, 'LE3', {
          story: who + ' spends ' + B(num + '/' + den) + ' of their savings on a bike. The bike costs ' + B('$' + cost) + '.',
          ask: 'How much did ' + who + ' have saved in total?', q: 'Total savings?', v: S, pre: '$', cue: 'Divide by ' + num + '/' + den,
          errs: [[R(cost * num / den, 2), 'Divide by the fraction', 0], [R(cost / num, 2), 'That’s 1/' + den + ': × ' + den, 0], [R(cost * den, 2), 'Then divide by ' + num, 0]],
          steps: [['(' + num + '/' + den + ')s = ' + cost, 's = ' + cost + ' × ' + den + '/' + num + ' = $' + S]],
          pic: { k: 'bar', rows: [{ t: 'savings in ' + den + ' equal parts; the bike is ' + num + ' parts', brace: '?', segs: [{ v: num, t: '$' + cost, c: 'Y' }].concat(Array.from({ length: den - num }, () => ({ v: 1, t: '', c: 'M' }))) }] }
        });
      },
      function leCards() {
        const per = pick([4, 5, 6, 8]), max = rnd(6, 12), rem = rnd(1, per - 1), T = max * per + rem;
        return mk('leCards', 1, 'LE4', {
          story: 'Packs of hockey cards cost ' + B('$' + per) + ' each. You have ' + B('$' + T) + '.',
          ask: 'What is the greatest number of packs you can buy?', q: 'Most packs?', v: max, unit: 'packs', cue: 'Divide, then round down',
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
          ask: 'How many tickets did you buy?', q: 'How many tickets?', v: n, unit: 'tickets', cue: 'Fee off, then divide',
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
            ask: 'What is the greatest number of rides you can go on?', q: 'Most rides?', v: max, unit: 'rides', cue: 'Entry off, divide, round down',
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
          ask: 'What number did ' + who + ' think of?', q: 'The number?', v: x, cue: 'Undo in reverse order',
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
            ask: 'After how many months do the two gyms cost the same?', q: 'Same cost when?', v: m, unit: 'months', cue: 'Set the two costs equal',
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
          ask: 'What is the area of the dog run?', q: 'Area of the run?', v: A, unit: 'm²', cue: 'Width, then length, then area',
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
            ask: 'What is the fewest bags you must sell to reach the goal?', q: 'Fewest bags?', v: n, unit: 'bags', cue: 'Profit per bag first',
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
          ask: 'What is the perimeter of the garden, as a simplified expression?', q: 'Perimeter?', poly: p, unit: 'm', cue: 'x-terms together, numbers together',
          errs: [[{ 1: s[0][0] + s[1][0], 0: s[0][1] + s[1][1] }, 'Add all three sides', 0], [{ 1: p[1], 0: s.reduce((t, q) => t + Math.abs(q[1]), 0) }, 'Watch the negative numbers', 0], [{ 1: p[1] + p[0], 0: 0 }, 'x-terms and numbers don’t combine', 0]],
          steps: [['add like terms', s.map(([a, b]) => bn(a, b)).join(' + ') + ' = ' + ps(p)]],
          pic: { k: 'shape', q: true, pts: [[0, 4], [2.2, 0], [6, 4]], sides: s.map(([a, b]) => ({ t: ps({ 1: a, 0: b }) })) }
        });
      },
      function poKeep() {
        const a = rnd(8, 15), b = rnd(10, 40), c = rnd(1, 4), d = rnd(2, 15), who = pick(NAMES), p = { 1: a - c, 0: b - d };
        return mk('poKeep', 1, 'PO4', {
          story: who + ' earns ' + B(ps({ 1: a, 0: b })) + ' dollars mowing for x hours and spends ' + B(ps({ 1: c, 0: d })) + ' dollars on gas.',
          ask: 'How much money does ' + who + ' keep, as an expression in x?', q: 'Amount kept?', poly: p, unit: 'dollars', cue: 'Earned − gas: every term',
          errs: [[{ 1: a - c, 0: b + d }, 'Subtract both terms of the gas', 0], [{ 1: a + c, 0: b + d }, 'Kept = earned − gas', 0], [{ 1: a - c, 0: d - b }, 'Earned first, then minus gas', 0]],
          steps: [['earned − gas', bn(a, b) + ' − ' + bn(c, d) + ' = ' + ps(p)]],
          pic: { k: 'bar', rows: [{ t: 'earned', segs: [{ v: a * X + b, t: ps({ 1: a, 0: b }), c: 'N' }] }, { t: 'gas + kept', segs: [{ v: c * X + d, t: ps({ 1: c, 0: d }), c: 'R' }, { v: (a - c) * X + b - d, t: '?', q: true, c: 'Y' }] }] }
        });
      },
      function poLockers() {
        const a = rnd(2, 6), b = rnd(1, 9), c = rnd(3, 6), p = { 1: a * c, 0: b * c };
        return mk('poLockers', 1, 'PO5', {
          story: 'A row of ' + B(c + ' lockers') + ' is built. Each locker is ' + B(bn(a, b) + ' cm') + ' wide.',
          ask: 'What is the total width of the row, as an expression in x?', q: 'Total width?', poly: p, unit: 'cm', cue: 'Multiply both terms by ' + c,
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
          ask: 'What is the area of the deck, as an expression in x?', q: 'Area of the deck?', poly: p, unit: 'm²', cue: 'Each term times each term',
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
          ask: 'What is the perimeter of the poster, as an expression in x?', q: 'Perimeter?', poly: p, unit: 'cm', cue: 'Two lengths plus two widths',
          errs: [[sm, 'A rectangle has four sides', 1], [{ 1: 2 * a + c, 0: 2 * b + d }, 'Two widths too', 1], [{ 1: a + 2 * c, 0: b + 2 * d }, 'Two lengths too', 1]],
          steps: [['length + width', bn(a, b) + ' + ' + bn(c, d) + ' = ' + ps(sm)], ['× 2', '2(' + ps(sm) + ') = ' + ps(p)]],
          pic: { k: 'rects', rs: [{ x: 0, y: 0, w: a * X + b, h: c * X + d, c: 'G', t: '?', tw: ps({ 1: a, 0: b }), lh: ps({ 1: c, 0: d }) }] }
        });
      },
      function poBed() {
        const a = rnd(2, 4), b = rnd(1, 6), c = rnd(2, 5), p = { 2: a * c, 1: b * c };
        return mk('poBed', 2, 'PO5', {
          story: 'A flower bed is ' + B(c + 'x m') + ' wide and ' + B(bn(a, b) + ' m') + ' long.',
          ask: 'What is the area of the flower bed, as an expression in x?', q: 'Area of the bed?', poly: p, unit: 'm²', cue: 'Multiply ' + c + 'x by both terms',
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
          ask: 'How much of the lot is not covered by the shed, as an expression?', q: 'Area not covered?', poly: p, deg: 2, unit: 'm²', cue: 'Lot area minus shed area',
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
          ask: 'How much area is left after the square is cut out?', q: 'Area left?', v, unit: 'cm²', cue: 'Expand, subtract x², substitute',
          errs: [[v + x * x, 'Cut out the square', 1], [v - a * x, 'There are two middle terms', 0], [v - (k * b + a) * x, 'Don’t forget the middle terms', 0], [v + x * x - 4 * x, 'The square’s area is x²', 1]],
          steps: [['expand', bn(k, a) + '(x + ' + b + ') = ' + ps(full)], ['− x²', ps(full) + ' − x² = ' + ps(p)], ['x = ' + x, (p[2] === 1 ? '' : p[2]) + '(' + x * x + ') + ' + p[1] + '(' + x + ') + ' + p[0] + ' = ' + v]],
          pic: { k: 'rects', foot: '?', rs: [{ x: 0, y: 0, w: k * X + a, h: X + b, c: 'L', t: '', tw: ps({ 1: k, 0: a }), lh: 'x + ' + b }, { x: 0, y: 0, w: X, h: X, c: 'R', t: 'cut x²' }] }
        });
      },
      function poFrame() {
        const a = rnd(2, 6), b = rnd(1, 4), outer = { 2: 1, 1: 2 * a + 2 * b, 0: 4 * a * b }, p = { 1: 2 * a + 2 * b, 0: 4 * a * b };
        return mk('poFrame', 3, 'PO6', {
          story: 'A square photo is ' + B('x cm') + ' on a side. Its frame adds ' + B(a + ' cm') + ' on the left and right, and ' + B(b + ' cm') + ' on the top and bottom.',
          ask: 'What is the area of the frame alone, as an expression in x?', q: 'Area of the frame?', poly: p, deg: 2, unit: 'cm²', cue: 'Outer area minus the photo',
          errs: [[outer, 'Now take away the photo', 2], [{ 1: a + b, 0: a * b }, 'The frame is on both sides', 0], [{ 2: 1, 1: a + b, 0: a * b }, 'The frame is on both sides', 0], [{ 1: 2 * a + 2 * b }, 'The corners are frame too', 1]],
          steps: [['outer size', '(x + ' + 2 * a + ') by (x + ' + 2 * b + ')'], ['outer area', '(x + ' + 2 * a + ')(x + ' + 2 * b + ') = ' + ps(outer)], ['− photo x²', ps(outer) + ' − x² = ' + ps(p)]],
          pic: { k: 'rects', foot: '?', rs: [{ x: 0, y: 0, w: X + 2 * a, h: X + 2 * b, c: 'G', t: '', tw: 'x + ' + 2 * a, tws: 0 }, { x: a, y: b, w: X, h: X, c: 'L', t: 'photo x²' }] }
        });
      }
    ]
  };

  /* ============ CG · Circle geometry (angles in degrees; lengths from Pythagorean triples) ============ */
  const DG = x => x + '°';
  const arc3 = c => ({ A: 270 - c / 2, B: 270 + c / 2, C: 90 + rnd(-30, 30) });    // A, B cut off an arc at the bottom; C on the far side
  const ang = (v, a, b, o) => Object.assign({ v, a, b }, o || {});
  const sg = (a, b, o) => Object.assign({ a, b }, o || {});
  const leg = ([a, b, c]) => pick([[a, b, c], [b, a, c]]);                          // [radius-side, other leg, hypotenuse]
  const CG = {
    1: [
      function cgArena() {
        const c = 2 * rnd(20, 80), v = c / 2;
        return mk('cgArena', 1, 'CG3', {
          story: 'A camera at the centre of a round arena sees an arc of the wall at ' + B(DG(c)) + '. A camera on the wall sees the same arc.',
          ask: 'What angle does the camera on the wall see?', q: 'Wall camera’s angle?', v, unit: '°', cue: 'Inscribed angle = ½ central angle',
          errs: [[c, 'On the circle: half the centre’s', 0], [2 * c, 'Half the central angle, not double', 0], [180 - c, 'Same arc: half the central', 0]],
          steps: [['½ central angle', '½ × ' + DG(c) + ' = ' + DG(v)]],
          pic: { k: 'circ', P: arc3(c), segs: [sg('O', 'A', { c: 'L' }), sg('O', 'B', { c: 'L' }), sg('C', 'A', { c: 'Y' }), sg('C', 'B', { c: 'Y' })], angs: [ang('O', 'A', 'B', { t: DG(c), c: 'L' }), ang('C', 'A', 'B', { q: true })] }
        });
      },
      function cgPond() {
        const a = rnd(20, 80), v = 2 * a, P = arc3(v);
        return mk('cgPond', 1, 'CG3', {
          story: 'From a spot C on the edge of a round pond, two buoys on the edge are ' + B(DG(a)) + ' apart. A fountain sits at the centre O.',
          ask: 'What is the angle between the two buoys at the fountain?', q: 'Angle at the fountain?', v, unit: '°', cue: 'Central angle = 2 × inscribed',
          errs: [[a / 2, 'The centre angle is double', 0], [a, 'Central = 2 × inscribed', 0], [180 - a, 'Double the inscribed angle', 0]],
          steps: [['2 × inscribed', '2 × ' + DG(a) + ' = ' + DG(v)]],
          pic: { k: 'circ', P, segs: [sg('O', 'A', { c: 'L' }), sg('O', 'B', { c: 'L' }), sg('C', 'A', { c: 'Y' }), sg('C', 'B', { c: 'Y' })], angs: [ang('C', 'A', 'B', { t: DG(a), c: 'Y' }), ang('O', 'A', 'B', { q: true })] }
        });
      },
      function cgPath() {
        const a = rnd(20, 60), v = 90 - a, d = 1 / Math.sin(a * Math.PI / 180);
        return mk('cgPath', 1, 'CG4', {
          story: 'A straight path from a gate P just touches a round pond at T. It makes a ' + B(DG(a)) + ' angle with the line from P to the centre O.',
          ask: 'What is angle TOP?', q: 'Angle TOP?', v, unit: '°', cue: 'Tangent ⟂ radius: 90° at T',
          errs: [[180 - a, 'Tangent ⟂ radius: 90° at T', 0], [a, 'Triangle angles add to 180°', 0], [90 + a, 'Take ' + a + '° away from 90°', 0]],
          steps: [['180° − 90° − ∠P', '180° − 90° − ' + DG(a) + ' = ' + DG(v)]],
          pic: { k: 'circ', P: { T: 90 - a, P: [d, 0] }, segs: [sg('O', 'T', { c: 'L', t: 'radius' }), sg('T', 'P', { c: 'Y', t: 'path' }), sg('O', 'P', { c: 'M', dash: true, at: 'b' })], angs: [ang('T', 'O', 'P', { right: true, c: 'M' }), ang('P', 'O', 'T', { t: DG(a), c: 'Y', r: 40 }), ang('O', 'T', 'P', { q: true })] }
        });
      }
    ],
    2: [
      function cgCrack() {
        const [d, h, r] = leg(pick(TRIPLES)), y = -d / r, x = h / r;
        return mk('cgCrack', 2, 'CG2', {
          story: 'A round table top has a radius of ' + B(r + ' dm') + '. A straight crack across it (a chord) is ' + B(d + ' dm') + ' from the centre.',
          ask: 'How long is the crack?', q: 'Length of the crack?', v: 2 * h, unit: 'dm', cue: 'Half the chord, then double',
          errs: [[h, 'That’s half: double it', 1], [R(2 * Math.sqrt(r * r + d * d), 2), 'The radius is the hypotenuse', 0], [2 * (r - d), 'Square, subtract, then √', 0], [r * r - d * d, 'Take the square root', 0]],
          steps: [['half the chord', '√(' + r + '² − ' + d + '²) = √' + h * h + ' = ' + h + ' dm'], ['× 2', '2 × ' + h + ' = ' + 2 * h + ' dm']],
          pic: { k: 'circ', P: { A: [-x, y], B: [x, y], M: [0, y] }, hide: ['M'], segs: [sg('A', 'B', { c: 'Y', q: true, at: 'b', off: 38 }), sg('M', 'A', { c: 'N', t: h + ' dm', s: 0, at: 'b' }), sg('O', 'M', { c: 'T', t: d + ' dm', at: 'l', dash: true }), sg('O', 'B', { c: 'L', t: r + ' dm' })], angs: [ang('M', 'O', 'B', { right: true, c: 'M' })] }
        });
      },
      function cgChain() {
        const [r, t, d] = leg(pick(TRIPLES)), th = Math.acos(r / d) * 180 / Math.PI;
        return mk('cgChain', 2, 'CG4', {
          story: 'A straight bike chain runs from point P and just touches a gear of radius ' + B(r + ' cm') + ' at T. P is ' + B(d + ' cm') + ' from the gear’s centre.',
          ask: 'How long is the chain from P to T?', q: 'Length of PT?', v: t, unit: 'cm', cue: 'Right angle at T: Pythagoras',
          errs: [[R(Math.sqrt(d * d + r * r), 2), 'PO is the hypotenuse: subtract', 0], [d * d - r * r, 'Now take the square root', 1], [d - r, 'Square first, then subtract', 0]],
          steps: [['PT² = PO² − r²', d + '² − ' + r + '² = ' + t * t], ['PT = √', '√' + t * t + ' = ' + t + ' cm']],
          pic: { k: 'circ', P: { T: th, P: [d / r, 0] }, segs: [sg('O', 'T', { c: 'L', t: r + ' cm' }), sg('O', 'P', { c: 'M', t: d + ' cm', at: 'b' }), sg('T', 'P', { c: 'Y', q: true })], angs: [ang('T', 'O', 'P', { right: true, c: 'M' })] }
        });
      },
      function cgBase() {
        const x = rnd(25, 70), c = 2 * x, v = 90 - x;
        return mk('cgBase', 2, 'CG3', {
          story: 'Points A, B and C are on a circle with centre O. Angle ACB is ' + B(DG(x)) + '. Radii OA and OB make triangle AOB.',
          ask: 'What is angle OAB?', q: 'Angle OAB?', v, unit: '°', cue: 'Central angle first, then isosceles',
          errs: [[c, 'That’s ∠AOB: keep going', 1], [180 - c, 'Split it between two angles', 1], [(180 - x) / 2, 'Central = 2 × inscribed first', 0], [x, 'OA = OB: equal base angles', 1]],
          steps: [['∠AOB = 2 × ∠ACB', '2 × ' + DG(x) + ' = ' + DG(c)], ['equal base angles', '(180° − ' + DG(c) + ') ÷ 2 = ' + DG(v)]],
          pic: { k: 'circ', P: arc3(c), segs: [sg('O', 'A', { c: 'L' }), sg('O', 'B', { c: 'L' }), sg('A', 'B', { c: 'W' }), sg('C', 'A', { c: 'Y' }), sg('C', 'B', { c: 'Y' })], angs: [ang('C', 'A', 'B', { t: DG(x), c: 'Y' }), ang('O', 'A', 'B', { t: DG(c), c: 'G', s: 0 }), ang('A', 'B', 'O', { q: true })] }
        });
      }
    ],
    3: [
      function cgTunnel() {
        const [d, h, r] = leg(pick(TRIPLES)), y = -d / r, x = h / r;
        return mk('cgTunnel', 3, 'CG2', {
          story: 'A tunnel is a circle of radius ' + B(r + ' dm') + ' with a flat floor below the centre. The floor (a chord) is ' + B(2 * h + ' dm') + ' wide.',
          ask: 'How high is the top of the tunnel above the floor?', q: 'Floor to the top?', v: r + d, unit: 'dm', cue: 'Centre to floor, then add r',
          errs: [[d, 'Add the radius above the centre', 2], [2 * r, 'The floor cuts off the bottom', 2], [r - d, 'The floor is below the centre', 2], [R(r + Math.sqrt(r * r + h * h), 2), 'The radius is the hypotenuse', 1]],
          steps: [['half the floor', 2 * h + ' ÷ 2 = ' + h + ' dm'], ['centre to floor', '√(' + r + '² − ' + h + '²) = √' + d * d + ' = ' + d + ' dm'], ['+ radius', d + ' + ' + r + ' = ' + (r + d) + ' dm']],
          pic: { k: 'circ', P: { A: [-x, y], B: [x, y], M: [0, y], T: 90 }, hide: ['M', 'T'], segs: [sg('A', 'B', { c: 'G', t: 2 * h + ' dm', at: 'b', off: 38 }), sg('M', 'A', { c: 'N', t: h + ' dm', s: 0, at: 'b' }), sg('O', 'B', { c: 'L', t: r + ' dm' }), sg('M', 'O', { c: 'T', t: d + ' dm', s: 1, at: 'l' }), sg('O', 'T', { c: 'Y', q: true, at: 'r', dash: true })], angs: [ang('M', 'O', 'B', { right: true, c: 'M', s: 1 })] }
        });
      },
      function cgTangents() {
        const a = 2 * rnd(15, 50), o = 180 - a, v = o / 2, th = 90 - a / 2, d = 1 / Math.sin(a / 2 * Math.PI / 180);
        return mk('cgTangents', 3, 'CG3', {
          story: 'Two tangents from P touch a circle (centre O) at A and B. Angle APB is ' + B(DG(a)) + '. C is on the far side of the circle.',
          ask: 'What is angle ACB?', q: 'Angle ACB?', v, unit: '°', cue: 'Right angles, ∠AOB, then half',
          errs: [[o, 'That’s ∠AOB: now halve it', 2], [a / 2, 'Use ∠AOB, not ∠APB', 1], [(270 - a) / 2, 'Right angles at A and B', 0], [a, 'Find ∠AOB in the kite first', 1]],
          steps: [['∠OAP = ∠OBP', '90° (tangent ⟂ radius)'], ['∠AOB', '360° − 90° − 90° − ' + DG(a) + ' = ' + DG(o)], ['½ × ∠AOB', '½ × ' + DG(o) + ' = ' + DG(v)]],
          pic: { k: 'circ', P: { A: th, B: -th, P: [d, 0], C: 180 + rnd(-25, 25) }, segs: [sg('O', 'A', { c: 'L' }), sg('O', 'B', { c: 'L' }), sg('P', 'A', { c: 'W' }), sg('P', 'B', { c: 'W' }), sg('C', 'A', { c: 'Y' }), sg('C', 'B', { c: 'Y' })], angs: [ang('A', 'O', 'P', { right: true, c: 'M', s: 0 }), ang('B', 'O', 'P', { right: true, c: 'M', s: 0 }), ang('P', 'A', 'B', { t: DG(a), c: 'W', r: 36 }), ang('O', 'A', 'B', { t: DG(o), c: 'G', s: 1 }), ang('C', 'A', 'B', { q: true, r: 40 })] }
        });
      },
      function cgKite() {
        const [r, t, d] = leg(pick(TRIPLES)), th = Math.acos(r / d) * 180 / Math.PI, v = 2 * t + 2 * r;
        return mk('cgKite', 3, 'CG4', {
          story: 'From P, two tangents touch a circle at A and B. The circle has centre O and radius ' + B(r + ' cm') + '. P is ' + B(d + ' cm') + ' from O.',
          ask: 'What is the perimeter of kite PAOB?', q: 'Perimeter of PAOB?', v, unit: 'cm', cue: 'Two tangents plus two radii',
          errs: [[t + r, 'The kite has four sides', 2], [2 * t, 'Add the two radii too', 2], [2 * d + 2 * r, 'PA is a tangent, not PO', 0], [2 * t + r, 'OA and OB: two radii', 2]],
          steps: [['PA = √(PO² − r²)', '√(' + d + '² − ' + r + '²) = √' + t * t + ' = ' + t + ' cm'], ['equal tangents', 'PB = PA = ' + t + ', OA = OB = ' + r], ['perimeter', '2(' + t + ') + 2(' + r + ') = ' + v + ' cm']],
          pic: { k: 'circ', P: { A: th, B: -th, P: [d / r, 0] }, foot: '?', footl: 'perimeter =', segs: [sg('O', 'A', { c: 'L', t: r + ' cm' }), sg('O', 'B', { c: 'L', t: r, ts: 1 }), sg('O', 'P', { c: 'M', dash: true, t: d + ' cm', at: 'b' }), sg('P', 'A', { c: 'Y', t: t + ' cm', ts: 0 }), sg('P', 'B', { c: 'Y', t: String(t), ts: 1 })], angs: [ang('A', 'O', 'P', { right: true, c: 'M' }), ang('B', 'O', 'P', { right: true, c: 'M' })] }
        });
      }
    ]
  };

  /* ============ ME · Surface area and volume (π answers accepted to 0.2 %, so 3.14 and rounding both pass) ============ */
  const PI = Math.PI, piT = v => Math.max(.06, Math.abs(v) * .002);
  const dp1 = v => Math.abs(v % 1) < 1e-9 ? 0 : Math.abs(R(v, 1) - v) < 1e-9 ? 1 : 2;   // as many decimal places as the answer has (up to 2)
  const ME = {
    1: [
      function meTank() {
        const r = rnd(2, 9), h = rnd(5, 20), V = PI * r * r * h;
        return mk('meTank', 1, 'ME3', {
          story: 'A cylindrical water tank has a radius of ' + B(r + ' m') + ' and a height of ' + B(h + ' m') + '.',
          ask: 'What is the volume of the tank?', q: 'Volume of the tank?', v: V, dp: 1, tol: piT(V), unit: 'm³', cue: 'V = πr²h',
          errs: [[2 * PI * r * h, 'The base is a circle: πr²', 0], [PI * r * h, 'Square the radius', 0], [V / 3, 'No ⅓ for a cylinder', 0], [PI * 4 * r * r * h, 'r is the radius already', 0]],
          steps: [['V = πr²h', 'π(' + r + ')²(' + h + ') ≈ ' + F(V, 1) + ' m³']],
          pic: { k: 'solid', parts: [{ k: 'cyl', r, h, lab: { r: r + ' m', h: h + ' m' } }], foot: '?', footl: 'V =' }
        });
      },
      function meCone() {
        const r = rnd(2, 5), h = rnd(8, 14), l = R(Math.sqrt(r * r + h * h), 1), V = PI * r * r * h / 3;
        return mk('meCone', 1, 'ME4', {
          story: 'A paper snow-cone cup has a radius of ' + B(r + ' cm') + ', a height of ' + B(h + ' cm') + ' and a slant height of ' + B(F(l, 1) + ' cm') + '.',
          ask: 'How much does the cup hold?', q: 'Volume of the cup?', v: V, dp: 1, tol: piT(V), unit: 'cm³', cue: 'V = ⅓πr²h',
          errs: [[PI * r * r * h, 'Cone: ⅓ of the cylinder', 0], [PI * r * r * l / 3, 'Use the height, not the slant', 0], [PI * r * h / 3, 'Square the radius', 0]],
          steps: [['V = ⅓πr²h', '⅓π(' + r + ')²(' + h + ') ≈ ' + F(V, 1) + ' cm³']],
          pic: { k: 'solid', parts: [{ k: 'cone', r, h, lab: { r: r + ' cm', h: h + ' cm', l: F(l, 1) + ' cm' } }], foot: '?', footl: 'V =' }
        });
      },
      function meBall() {
        const r = rnd(2, 12), A = 4 * PI * r * r;
        return mk('meBall', 1, 'ME4', {
          story: 'A spherical exercise ball has a radius of ' + B(r + ' dm') + '. It needs a new cover.',
          ask: 'What is the area of the new cover?', q: 'Area of the cover?', v: A, dp: 1, tol: piT(A), unit: 'dm²', cue: 'SA = 4πr²',
          errs: [[4 / 3 * PI * r * r * r, 'That’s volume: SA is 4πr²', 0], [PI * r * r, 'A sphere is four circles: 4πr²', 0], [4 * PI * r, 'Square the radius', 0]],
          steps: [['SA = 4πr²', '4π(' + r + ')² ≈ ' + F(A, 1) + ' dm²']],
          pic: { k: 'solid', parts: [{ k: 'sphere', r, lab: { r: r + ' dm' } }], foot: '?', footl: 'SA =' }
        });
      }
    ],
    2: [
      function meBeach() {
        const d = 2 * rnd(3, 15), r = d / 2, V = 4 / 3 * PI * r * r * r, what = pick(['A beach ball', 'A rubber ball', 'A glass globe']);
        return mk('meBeach', 2, 'ME4', {
          story: what + ' has a diameter of ' + B(d + ' cm') + '.',
          ask: 'What is the volume of the ball?', q: 'Volume of the ball?', v: V, dp: 1, tol: piT(V), unit: 'cm³', cue: 'Radius first, then ⁴⁄₃πr³',
          errs: [[4 / 3 * PI * d * d * d, 'Use r, half of d', 0], [4 * PI * r * r, 'That’s surface area: ⁴⁄₃πr³', 1], [PI * r * r * r, 'Don’t forget the ⁴⁄₃', 1]],
          steps: [['r = d ÷ 2', d + ' ÷ 2 = ' + r + ' cm'], ['V = ⁴⁄₃πr³', '⁴⁄₃π(' + r + ')³ ≈ ' + F(V, 1) + ' cm³']],
          pic: { k: 'solid', parts: [{ k: 'sphere', r, lab: { d: d + ' cm' } }], foot: '?', footl: 'V =' }
        });
      },
      function meLabel() {
        const d = rnd(6, 12), h = rnd(9, 16), r = d / 2, A = PI * d * h;
        return mk('meLabel', 2, 'ME2', {
          story: 'A soup can has a diameter of ' + B(d + ' cm') + ' and a height of ' + B(h + ' cm') + '. The label wraps around the side, not the top or bottom.',
          ask: 'What is the area of the label?', q: 'Area of the label?', v: A, dp: 1, tol: piT(A), unit: 'cm²', cue: 'Radius, then the side: 2πrh',
          errs: [[2 * PI * d * h, 'Use r, half of d', 0], [PI * r * r * h, 'Area of the side: 2πrh', 1], [A + 2 * PI * r * r, 'Only the side: no lids', 1]],
          steps: [['r = d ÷ 2', d + ' ÷ 2 = ' + F(r) + ' cm'], ['side = 2πrh', '2π(' + F(r) + ')(' + h + ') ≈ ' + F(A, 1) + ' cm²']],
          pic: { k: 'solid', parts: [{ k: 'cyl', r, h, wrap: true, c: 'G', lab: { d: d + ' cm', h: h + ' cm' } }], foot: '?', footl: 'label =' }
        });
      },
      function meTent() {
        for (;;) {
          const s = 2 * rnd(2, 6), l = rnd(s / 2 + 2, s + 3), hh = R(Math.sqrt(l * l - s * s / 4), 1), A = s * s + 2 * s * l;
          if (hh % 1 === 0) continue;                                                // the height and the slant should look different
          return mk('meTent', 2, 'ME4', {
            story: 'A square-based pyramid tent is ' + B(s + ' m') + ' on each side and ' + B(F(hh, 1) + ' m') + ' tall. Each face has a slant height of ' + B(l + ' m') + '. It has a floor.',
            ask: 'How much fabric is needed for the tent?', q: 'Fabric needed?', v: A, unit: 'm²', cue: 'Four triangles plus the floor',
            errs: [[2 * s * l, 'Add the floor', 1], [s * s + 4 * s * l, 'Triangle: ½ base × slant', 0], [R(s * s + 2 * s * hh, 2), 'Use the slant height', 0], [s * s + s * l / 2, 'There are four triangles', 0]],
            steps: [['4 triangles', '4 × ½ × ' + s + ' × ' + l + ' = ' + 2 * s * l + ' m²'], ['+ floor', 2 * s * l + ' + ' + s + ' × ' + s + ' = ' + A + ' m²']],
            pic: { k: 'solid', parts: [{ k: 'pyr', w: s, h: hh, c: 'N', lab: { w: s + ' m', h: F(hh, 1) + ' m', l: l + ' m' } }], foot: '?', footl: 'SA =' }
          });
        }
      }
    ],
    3: [
      function meElevator() {
        const s = rnd(6, 12), h = rnd(15, 30), p = 3 * rnd(1, 4), Vb = s * s * h, Vp = s * s * p / 3, V = Vb + Vp;
        return mk('meElevator', 3, 'ME5', {
          story: 'A model grain elevator is a square prism ' + B(s + ' m') + ' by ' + B(s + ' m') + ' and ' + B(h + ' m') + ' tall, with a square pyramid roof ' + B(p + ' m') + ' tall.',
          ask: 'What is the total volume of the model?', q: 'Total volume?', v: V, unit: 'm³', cue: 'Prism plus ⅓ base × height',
          errs: [[Vb, 'Add the roof', 2], [Vb + s * s * p, 'Pyramid: ⅓ of the prism', 1], [Vp, 'Add the prism too', 2], [s * s * (h + p) / 3, 'Only the roof gets ⅓', 1]],
          steps: [['prism', s + ' × ' + s + ' × ' + h + ' = ' + N(Vb) + ' m³'], ['pyramid roof', '⅓ × ' + s * s + ' × ' + p + ' = ' + N(Vp) + ' m³'], ['total', N(Vb) + ' + ' + N(Vp) + ' = ' + N(V) + ' m³']],
          pic: { k: 'solid', parts: [{ k: 'box', w: s, h, lab: { w: s + ' m', h: h + ' m' } }, { k: 'pyr', w: s, h: p, c: 'G', s: 1, lab: { h: p + ' m' } }], foot: '?', footl: 'V =' }
        });
      },
      function meSilo() {
        const r = rnd(2, 5), h = rnd(8, 20), Vc = R(PI * r * r * h, 1), Vh = R(2 / 3 * PI * r * r * r, 1), V = R(Vc + Vh, 1);
        return mk('meSilo', 3, 'ME5', {
          story: 'A farm silo is a cylinder with a radius of ' + B(r + ' m') + ' and a height of ' + B(h + ' m') + ', with a half-sphere roof on top.',
          ask: 'What is the total volume of the silo?', q: 'Total volume?', v: V, dp: 1, tol: piT(V), unit: 'm³', cue: 'Cylinder + half of ⁴⁄₃πr³',
          errs: [[Vc + 4 / 3 * PI * r * r * r, 'The roof is half a sphere', 1], [Vc, 'Add the roof', 2], [Vh, 'Add the cylinder too', 2], [Vc + 2 * PI * r * r, 'Roof volume: ½ × ⁴⁄₃πr³', 1]],
          steps: [['cylinder', 'π(' + r + ')²(' + h + ') ≈ ' + F(Vc, 1) + ' m³'], ['half sphere', '½ × ⁴⁄₃π(' + r + ')³ ≈ ' + F(Vh, 1) + ' m³'], ['total', F(Vc, 1) + ' + ' + F(Vh, 1) + ' = ' + F(V, 1) + ' m³']],
          pic: { k: 'solid', parts: [{ k: 'cyl', r, h, lab: { r: r + ' m', h: h + ' m' } }, { k: 'hemi', r, c: 'G', s: 1 }], foot: '?', footl: 'V =' }
        });
      },
      function meBarrel() {
        const r = pick([0.5, 0.6, 0.8, 1, 1.2]), h = pick([1, 1.2, 1.5, 2]), rate = pick([20, 25, 40, 50, 80]), V = PI * r * r * h, L = V * 1000, t = L / rate;
        return mk('meBarrel', 3, 'ME3', {
          story: 'A rain tank is a cylinder ' + B(F(r) + ' m') + ' in radius and ' + B(F(h) + ' m') + ' tall. A hose fills it at ' + B(rate + ' L') + ' a minute.',
          ask: 'How many minutes does it take to fill the tank?', q: 'Minutes to fill?', v: t, dp: 1, tol: piT(t), unit: 'min', cue: 'Volume, litres, then ÷ rate',
          errs: [[V / rate, 'Change m³ to litres first', 1], [L, 'Now divide by the rate', 2], [2 * PI * r * h * 1000 / rate, 'Volume is πr²h', 0], [V * 100 / rate, '1 m³ is 1000 L', 1]],
          steps: [['V = πr²h', 'π(' + F(r) + ')²(' + F(h) + ') ≈ ' + F(V, 3) + ' m³'], ['litres', F(V, 3) + ' × 1000 ≈ ' + N(L) + ' L'], ['÷ rate', N(L) + ' ÷ ' + rate + ' ≈ ' + F(t, 1) + ' min']],
          pic: { k: 'solid', parts: [{ k: 'cyl', r, h, lab: { r: F(r) + ' m', h: F(h) + ' m' } }], note: 'hose: ' + rate + ' L/min   ·   1 m³ = 1000 L', foot: '?', footl: 'time =' }
        });
      }
    ]
  };

  /* ============ SI · Similarity and scale ============ */
  // A triangle from its three sides: side i joins point i and i + 1 (c along the bottom, then a, then b).
  const triPts = (a, b, c) => { const x = (b * b - a * a + c * c) / (2 * c); return [[0, 0], [c, 0], [x, Math.sqrt(Math.max(0, b * b - x * x))]]; };
  const SI = {
    1: [
      function siMap() {
        const k = pick([5, 10, 20, 25, 50]), d = rnd(15, 120) / 10, v = R(d * k, 1);
        return mk('siMap', 1, 'SI4', {
          story: 'On a map of Alberta, ' + B('1 cm') + ' stands for ' + B(k + ' km') + '. Two towns are ' + B(F(d, 1) + ' cm') + ' apart on the map.',
          ask: 'How far apart are the two towns in real life?', q: 'Real distance?', v, dp: dp1(v), unit: 'km', cue: 'Map distance × the scale',
          errs: [[R(d / k, 3), 'Map to real: multiply', 0], [R(d + k, 1), 'Multiply, don’t add', 0]],
          steps: [['map × scale', F(d, 1) + ' × ' + k + ' = ' + F(v) + ' km']],
          pic: { k: 'flow', noundo: true, boxes: [{ t: F(d, 1) + ' cm' }, { t: '?', q: true }], ops: ['× ' + k], inv: [] }
        });
      },
      function siPhoto() {
        const w = rnd(4, 15), k = pick([1.5, 2, 2.5, 3, 4]), v = w * k, h0 = .7;
        return mk('siPhoto', 1, 'SI1', {
          story: 'A photo ' + B(w + ' cm') + ' wide is enlarged by a scale factor of ' + B(F(k)) + '.',
          ask: 'How wide is the enlarged photo?', q: 'New width?', v, dp: dp1(v), unit: 'cm', cue: 'Scale factor × original width',
          errs: [[w + k, 'Multiply by the scale factor', 0], [R(w / k, 3), 'Enlarging: multiply', 0], [w * k * k, 'Lengths: × k once', 0]],
          steps: [['k × width', F(k) + ' × ' + w + ' = ' + F(v) + ' cm']],
          pic: { k: 'rects', rs: [{ x: 0, y: (k - 1) * h0, w: 1, h: h0, c: 'L', t: 'photo', tw: w + ' cm' }, { x: 1.35, y: 0, w: k, h: k * h0, c: 'N', t: '× ' + F(k), tw: '?' }] }
        });
      },
      function siCanoe() {
        const n = pick([5, 10, 20, 25, 50]), m = rnd(2, 6), real = m * n, v = 1 / n;
        return mk('siCanoe', 1, 'SI1', {
          story: 'A real canoe is ' + B(real + ' dm') + ' long. A model of it is ' + B(m + ' dm') + ' long.',
          ask: 'What is the scale factor from the real canoe to the model?', q: 'Scale factor to model?', v, dp: 2, tol: .0011, unit: '', ans: F(v), cue: 'Model ÷ real',
          errs: [[n, 'Model ÷ real, not flipped', 0], [real - m, 'Divide, don’t subtract', 0]],
          steps: [['k = model ÷ real', m + ' ÷ ' + real + ' = 1/' + n + ' = ' + F(v)]],
          pic: { k: 'bar', rows: [{ t: 'real canoe', segs: [{ v: real, t: real + ' dm', c: 'L' }] }, { t: 'model', segs: [{ v: m, t: m + ' dm', c: 'Y' }], brace: '?' }] }
        });
      }
    ],
    2: [
      function siShadow() {
        const [h, s] = pick([[1.5, 2], [1.6, 2], [1.8, 1.2], [1.5, 2.5], [1.6, 1.2], [1.8, 2.4]]), k = rnd(4, 12), S = R(s * k, 2), H = R(h * k, 2);
        return mk('siShadow', 2, 'SI4', {
          story: 'A ' + B(F(h) + ' m') + ' tall student casts a ' + B(F(s) + ' m') + ' shadow. At the same time, a flagpole casts a ' + B(F(S) + ' m') + ' shadow.',
          ask: 'How tall is the flagpole?', q: 'Height of the flagpole?', v: H, dp: dp1(H), unit: 'm', cue: 'Shadow ratio, then × height',
          errs: [[k, 'That’s k: now × the height', 1], [R(h + S - s, 2), 'Multiply, don’t add', 0], [R(s * S / h, 2), 'Match height to height', 0]],
          steps: [['scale factor', F(S) + ' ÷ ' + F(s) + ' = ' + k], ['flagpole', F(h) + ' × ' + k + ' = ' + F(H) + ' m']],
          pic: { k: 'scene', mode: 'shadow', h, s, H, S, lh: F(h) + ' m', ls: F(s) + ' m', lH: '?', lS: F(S) + ' m' }
        });
      },
      function siTri() {
        const [a, b, c] = pick([[6, 8, 10], [5, 12, 13], [9, 12, 15], [4, 6, 7], [3, 5, 7], [5, 7, 9]]), k = pick([1.5, 2.5, 3, 4]), C2 = c * k, v = a * k;
        return mk('siTri', 2, 'SI2', {
          story: 'A triangle has sides ' + B(a + ' cm') + ', ' + B(b + ' cm') + ' and ' + B(c + ' cm') + '. A similar triangle has a longest side of ' + B(F(C2) + ' cm') + '.',
          ask: 'How long is the shortest side of the similar triangle?', q: 'Its shortest side?', v, dp: dp1(v), unit: 'cm', cue: 'Longest sides give k',
          errs: [[k, 'That’s k: now × the shortest', 1], [a + C2 - c, 'Multiply, don’t add', 0], [b * k, 'Shortest matches shortest', 1], [R(a * c / C2, 3), 'k = new ÷ old', 0]],
          steps: [['scale factor', F(C2) + ' ÷ ' + c + ' = ' + F(k)], ['shortest side', a + ' × ' + F(k) + ' = ' + F(v) + ' cm']],
          pic: { k: 'pair', pts: triPts(a, b, c), f: Math.min(k, 2.2), cs: ['G', 'Y', 'T'], la: [{ t: String(c) }, { t: String(a) }, { t: String(b) }], lb: [{ t: F(C2) }, { t: '?', q: true }, {}] }
        });
      },
      function siTruck() {
        const sc = pick([20, 24, 25, 40, 50]), real = rnd(30, 60) / 10, cm = R(real * 100, 0), v = R(cm / sc, 3);
        return mk('siTruck', 2, 'SI4', {
          story: 'A model truck is built at a scale of ' + B('1 : ' + sc) + '. The real truck is ' + B(F(real, 1) + ' m') + ' long.',
          ask: 'How long is the model truck, in centimetres?', q: 'Model length?', v, dp: 2, tol: .051, unit: 'cm', ans: F(R(v, 2)), cue: 'Metres to cm, then ÷ scale',
          errs: [[R(real / sc, 4), 'Change m to cm first', 0], [cm * sc, 'A model is smaller: divide', 1], [real * sc, 'Divide by the scale', 1]],
          steps: [['m → cm', F(real, 1) + ' m = ' + cm + ' cm'], ['÷ scale', cm + ' ÷ ' + sc + ' = ' + F(R(v, 2)) + ' cm']],
          pic: { k: 'flow', noundo: true, boxes: [{ t: F(real, 1) + ' m' }, { t: cm + ' cm', s: 0 }, { t: '?', q: true }], ops: ['× 100', '÷ ' + sc], inv: [] }
        });
      }
    ],
    3: [
      function siPlan() {
        const s = pick([50, 100, 200]), l = rnd(4, 12), w = rnd(3, l), L = l * s / 100, W = w * s / 100, A = R(L * W, 2);
        return mk('siPlan', 3, 'SI4', {
          story: 'A house plan uses a scale of ' + B('1 : ' + s) + '. A bedroom is ' + B(l + ' cm') + ' by ' + B(w + ' cm') + ' on the plan.',
          ask: 'What is the real area of the bedroom, in square metres?', q: 'Real area in m²?', v: A, dp: A % 1 ? 2 : 0, unit: 'm²', cue: 'Scale each side, then multiply',
          errs: [[l * w, 'Scale the plan first', 0], [R(l * w * s / 10000, 3), 'Scale both length and width', 2], [l * s * w * s, 'Change cm to m first', 0]],
          steps: [['real length', l + ' × ' + s + ' = ' + l * s + ' cm = ' + F(L) + ' m'], ['real width', w + ' × ' + s + ' = ' + w * s + ' cm = ' + F(W) + ' m'], ['area', F(L) + ' × ' + F(W) + ' = ' + F(A) + ' m²']],
          pic: { k: 'rects', foot: 'plan, scale 1 : ' + s, rs: [{ x: 0, y: 0, w: l, h: w, c: 'L', t: '?', tw: l + ' cm', lh: w + ' cm' }] }
        });
      },
      function siSod() {
        const k = pick([2, 3, 4]), a = rnd(6, 20), c = pick([4, 5, 6.5, 8]), A = a * k * k, cost = R(A * c, 2);
        return mk('siSod', 3, 'SI2', {
          story: 'Two rectangular gardens are similar. The small one has an area of ' + B(a + ' m²') + '. The large one’s sides are ' + B(k + ' times') + ' as long. Sod costs ' + B($(c)) + ' per m².',
          ask: 'How much will it cost to sod the large garden?', q: 'Cost to sod it?', v: cost, dp: cost % 1 ? 2 : 0, pre: '$', cue: 'Area grows by k²',
          errs: [[R(a * k * c, 2), 'Area grows by k², not k', 0], [R(a * c, 2), 'Sod the large garden', 1], [A, 'Now times the price', 2]],
          steps: [['area factor', k + '² = ' + k * k], ['large area', a + ' × ' + k * k + ' = ' + A + ' m²'], ['cost', A + ' × ' + $(c) + ' = ' + $(cost)]],
          pic: { k: 'rects', foot: $(c) + ' per m²', rs: [{ x: 0, y: (k - 1), w: 1.4, h: 1, c: 'T', t: a + ' m²' }, { x: 1.9, y: 0, w: 1.4 * k, h: k, c: 'N', t: '?', td: A + ' m²', tw: '× ' + k + ' each side' }] }
        });
      },
      function siMirror() {
        const h = pick([1.5, 1.6, 1.8]), d1 = pick([1.5, 2, 2.5, 3]), k = rnd(5, 12), d2 = R(d1 * k, 1), H = R(h * k, 1), barn = rnd(4, 8), v = R(H - barn, 1);
        return mk('siMirror', 3, 'SI4', {
          story: 'Your eyes are ' + B(F(h) + ' m') + ' up. A mirror on the ground ' + B(F(d1) + ' m') + ' away shows the top of a grain elevator ' + B(F(d2) + ' m') + ' past it. A barn is ' + B(barn + ' m') + ' tall.',
          ask: 'How much taller than the barn is the grain elevator?', q: 'Taller than the barn?', v, dp: dp1(v), unit: 'm', cue: 'k, the height, then compare',
          errs: [[H, 'Now compare with the barn', 2], [k, 'That’s k: now × eye height', 1], [R(H + barn, 1), 'How much taller: subtract', 2], [R(h + d2 - d1 - barn, 2), 'Multiply by k, don’t add', 0]],
          steps: [['scale factor', F(d2) + ' ÷ ' + F(d1) + ' = ' + k], ['elevator', F(h) + ' × ' + k + ' = ' + F(H) + ' m'], ['− barn', F(H) + ' − ' + barn + ' = ' + F(v) + ' m']],
          pic: { k: 'scene', mode: 'mirror', h, d1, d2, H, barn, lh: F(h) + ' m', l1: F(d1) + ' m', l2: F(d2) + ' m', lH: F(H) + ' m', sH: 1, lb: barn + ' m', foot: '?', footl: 'taller by' }
        });
      }
    ]
  };

  /* ============ ST · Statistics: scatter plots and the line of best fit ============ */
  // Scatter dots around a line (made-up data), x from xa to xb.
  const scat = (m, b, xa, xb, n, sp) => Array.from({ length: n }, (_, i) => { const x = R(xa + (xb - xa) * i / (n - 1), 1); return { x, y: Math.max(0, R(m * x + b + rnd(-10, 10) / 10 * sp, 1)), dot: true, c: 'L' }; });
  const ST = {
    1: [
      function stDots() {
        const [who, one, a, b, xh, yh, gx, gy] = pick([
          ['students', 'student', 'height', 'arm span', 'height (cm)', 'arm span', () => rnd(150, 180), x => x + rnd(-6, 6)],
          ['students', 'student', 'hours of sleep', 'quiz score', 'sleep (h)', 'score', () => rnd(6, 10), x => 40 + 5 * x + rnd(-6, 6)],
          ['days', 'day', 'high temperature', 'pool visitors', 'temp (°C)', 'visitors', () => rnd(18, 32), x => 8 * x - 60 + rnd(-15, 15)],
          ['players', 'player', 'height', 'jump distance', 'height (cm)', 'jump (cm)', () => rnd(150, 180), x => 2 * x + rnd(-30, 30)]]);
        const n = rnd(14, 32), cols = [0, 1, 2].map(() => { const x = gx(); return { x, y: gy(x) }; });
        return mk('stDots', 1, 'ST1', {
          story: 'A class records the ' + a + ' and the ' + b + ' of each of ' + B(n + ' ' + who) + '. They make a scatter plot.',
          ask: 'How many dots will the scatter plot have?', q: 'How many dots?', v: n, unit: 'dots', cue: 'One dot per ' + one,
          errs: [[2 * n, 'One dot holds both values', 0], [n - 1, 'Every ' + one + ' gets a dot', 0]],
          steps: [['one dot each', n + ' ' + who + ' → ' + n + ' dots (x, y)']],
          pic: { k: 'table', xh, yh, cols: cols.concat([{ x: '…', y: '…', ghost: true }]), foot: '?', footl: 'scatter plot:' }
        });
      },
      function stSlope() {
        const [xl, yl, xs, ys, m, b, xa, xb] = pick([
          ['study time (h)', 'score', 'study time x (hours)', 'test score y', rnd(4, 9), rnd(45, 60), 0.5, 6],
          ['temperature (°C)', 'visitors', 'temperature x (°C)', 'splash-pad visitors y', rnd(5, 8), rnd(5, 30), 15, 32]]);
        const per = xl[0] === 's' ? 'hour' : 'degree', u = xl[0] === 's' ? 'points' : 'visitors';
        return mk('stSlope', 1, 'ST3', {
          story: 'A line of best fit for ' + xs + ' and ' + ys + ' is ' + B('y = ' + m + 'x + ' + b) + '.',
          ask: 'By how many ' + u + ' does y go up for each extra ' + per + '?', q: 'More per extra ' + per + '?', v: m, unit: u, cue: 'The slope is the rate',
          errs: [[b, 'That’s b, the starting value', 0], [m + b, 'The slope alone is the rate', 0]],
          steps: [['slope = rate', 'm = ' + m + ', so +' + m + ' ' + u + ' per ' + per]],
          pic: { k: 'graph', xl, yl, lines: [{ m, b, x0: Math.max(0, xa - 1), x1: xb + 1, c: 'L' }], pts: scat(m, b, xa, xb, 9, m * 1.5), rr: { a: [xb - 3, m * (xb - 3) + b], b: [xb - 2, m * (xb - 2) + b], run: '+1', rise: '+' + m, s1: 0 } }
        });
      },
      function stPredict() {
        const m = pick([2, 2.5, 3, 4]), b = pick([10, 15, 20]), x = rnd(14, 28), v = R(m * x + b, 1);
        return mk('stPredict', 1, 'ST4', {
          story: 'A line of best fit for ice-cream sales is ' + B('y = ' + F(m) + 'x + ' + b) + ', with x in °C. Predict the sales on a ' + B(x + ' °C') + ' day.',
          ask: 'How many cones does the line predict?', q: 'Cones sold?', v, dp: dp1(v), unit: 'cones', cue: 'Substitute x into the line',
          errs: [[R(m * x, 1), 'Add the ' + b + ' too', 0], [R((m + b) * x, 1), 'Only x gets multiplied', 0]],
          steps: [['substitute x', F(m) + '(' + x + ') + ' + b + ' = ' + F(v) + ' cones']],
          pic: { k: 'graph', xl: 'temperature (°C)', yl: 'cones', lines: [{ m, b, x0: 10, x1: 32, c: 'L' }], pts: scat(m, b, 12, 30, 9, 8).concat([{ x, y: v, q: true, pos: 'l' }]), read: { x, s: 0 } }
        });
      }
    ],
    2: [
      function stOff() {
        const m = pick([2, 3, 4]), b = pick([10, 15, 20]), x = rnd(15, 30), pred = m * x + b, act = pred + pick([-14, -9, -6, 7, 11, 15]), res = act - pred;
        return mk('stOff', 2, 'ST3', {
          story: 'A shop’s line of best fit is ' + B('y = ' + m + 'x + ' + b) + ' (x in °C, y = cones). On a ' + B(x + ' °C') + ' day it sold ' + B(act + ' cones') + '.',
          ask: 'How many more (+) or fewer (−) cones did it sell than the line predicts?', q: 'Actual − predicted?', v: res, unit: 'cones', cue: 'Predict first, then subtract',
          errs: [[pred, 'Now subtract: actual − predicted', 1], [act - m * x, 'Add b to the prediction', 0]],
          steps: [['predicted', m + '(' + x + ') + ' + b + ' = ' + pred + ' cones'], ['actual − predicted', act + ' − ' + pred + ' = ' + F(res) + ' cones']],
          pic: { k: 'graph', xl: 'temperature (°C)', yl: 'cones', lines: [{ m, b, x0: 10, x1: 34, c: 'L' }], pts: scat(m, b, 12, 32, 8, 6).concat([{ x, y: act, t: act + ' sold', c: 'Y', pos: 'r' }, { x, y: pred, t: 'line ' + pred, c: 'N', pos: 'l', s: 0 }]), read: { x, s: 0 } }
        });
      },
      function stTrend() {
        const plant = pick(['sunflower', 'corn plant', 'bean plant']), m = pick([3, 4, 5, 6]), b = rnd(2, 9), x1 = pick([4, 5, 6]), y1 = b + m * x1, x2 = x1 + rnd(3, 6), v = b + m * x2;
        return mk('stTrend', 2, 'ST3', {
          story: 'A line of best fit for a ' + plant + '’s height starts at ' + B(b + ' cm') + ' in week 0 and passes ' + B(y1 + ' cm') + ' in week ' + B(x1) + '.',
          ask: 'How tall does the line predict the ' + plant + ' will be in week ' + x2 + '?', q: 'Height in week ' + x2 + '?', v, unit: 'cm', cue: 'Rate first, then predict',
          errs: [[R(y1 / x1 * x2, 2), 'Start from the ' + b + ' cm', 0], [m * x2, 'Add the starting height', 1], [m, 'That’s the rate: keep going', 0], [y1 + m * x2, 'Count weeks from week 0', 1]],
          steps: [['rate', '(' + y1 + ' − ' + b + ') ÷ ' + x1 + ' = ' + m + ' cm per week'], ['predict', m + '(' + x2 + ') + ' + b + ' = ' + v + ' cm']],
          pic: { k: 'graph', xl: 'week', yl: 'height (cm)', lines: [{ m, b, x0: 0, x1: x2 + 1, c: 'L' }], pts: scat(m, b, 1, x1 + 1, 6, 3).concat([{ x: 0, y: b, t: b + ' cm', c: 'G', pos: 'r' }, { x: x1, y: y1, t: y1 + ' cm', c: 'Y', pos: 'l' }, { x: x2, y: v, q: true, pos: 'l' }]), rr: { a: [0, b], b: [x1, y1], run: x1 + ' wk', rise: '+' + (y1 - b), s0: 0, s1: 0 }, read: { x: x2, s: 1 } }
        });
      },
      function stTarget() {
        const m = pick([2, 3, 4, 5]), b = pick([10, 15, 20, 25]), x = rnd(14, 30), Y = m * x + b;
        return mk('stTarget', 2, 'ST4', {
          story: 'A line of best fit for lemonade sales is ' + B('y = ' + m + 'x + ' + b) + ', with x in °C. The stand wants to sell ' + B(Y + ' cups') + '.',
          ask: 'How warm must the day be to sell ' + Y + ' cups?', q: 'How warm a day?', v: x, unit: '°C', cue: 'Set y, then solve for x',
          errs: [[R(Y / m, 2), 'Take off the ' + b + ' first', 0], [R((Y + b) / m, 2), 'Subtract ' + b + ', don’t add', 0], [Y - b, 'Now divide by ' + m, 1]],
          steps: [['subtract b', Y + ' − ' + b + ' = ' + (Y - b)], ['divide by m', (Y - b) + ' ÷ ' + m + ' = ' + x + ' °C']],
          pic: { k: 'graph', xl: 'temperature (°C)', yl: 'cups', lines: [{ m, b, x0: 10, x1: 34, c: 'L' }], pts: scat(m, b, 12, 32, 9, 7).concat([{ x, y: Y, q: true, pos: 'l' }]), read: { x, s: 1 } }
        });
      }
    ],
    3: [
      function stTwoPts() {
        for (;;) {
          const m = pick([2, 3, 4, 5, 1.5, 2.5]), b = rnd(5, 30), x1 = rnd(10, 16), x2 = x1 + rnd(4, 8), x3 = x2 + rnd(3, 8), y1 = m * x1 + b, y2 = m * x2 + b, y3 = m * x3 + b;
          if (y1 % 1 || y2 % 1) continue;
          return mk('stTwoPts', 3, 'ST3', {
            story: 'A line of best fit for hot-dog sales (y) against temperature (x, °C) passes through ' + B('(' + x1 + ', ' + y1 + ')') + ' and ' + B('(' + x2 + ', ' + y2 + ')') + '.',
            ask: 'How many hot dogs does the line predict at ' + x3 + ' °C?', q: 'Sales at ' + x3 + ' °C?', v: y3, dp: dp1(y3), unit: 'hot dogs', cue: 'Slope, then b, then predict',
            errs: [[R(m * x3, 1), 'Add the y-intercept', 2], [m, 'That’s the slope: keep going', 0], [R(y1 / x1 * x3, 2), 'The line doesn’t start at 0', 1], [R(y2 / x2 * x3, 2), 'The line doesn’t start at 0', 1]],
            steps: [['slope', '(' + y2 + ' − ' + y1 + ') ÷ (' + x2 + ' − ' + x1 + ') = ' + F(m)], ['y-intercept', 'b = ' + y1 + ' − ' + F(m) + '(' + x1 + ') = ' + b], ['predict', F(m) + '(' + x3 + ') + ' + b + ' = ' + F(y3)]],
            pic: { k: 'graph', xl: 'temperature (°C)', yl: 'hot dogs', lines: [{ m, b, x0: 0, x1: x3 + 2, c: 'L' }], pts: scat(m, b, x1 - 2, x2 + 2, 8, 6).concat([{ x: 0, y: b, t: 'b = ' + b, c: 'G', pos: 'r', s: 1 }, { x: x1, y: y1, t: '(' + x1 + ', ' + y1 + ')', c: 'Y', pos: 'l' }, { x: x2, y: y2, t: '(' + x2 + ', ' + y2 + ')', c: 'Y', pos: 'l' }, { x: x3, y: y3, q: true, pos: 'l' }]), rr: { a: [x1, y1], b: [x2, y2], run: '+' + (x2 - x1), rise: '+' + (y2 - y1), s0: 0, s1: 0 }, read: { x: x3, s: 2 } }
          });
        }
      },
      function stZero() {
        for (;;) {
          const r = pick([2, 3, 4]), Z = rnd(40, 70), b = r * Z, x1 = rnd(5, 12), x2 = x1 + rnd(10, 18), y1 = b - r * x1, y2 = b - r * x2;
          if (y2 < 12) continue;
          return mk('stZero', 3, 'ST4', {
            story: 'A line of best fit for snow depth at a ski hill passes through ' + B('(day ' + x1 + ', ' + y1 + ' cm)') + ' and ' + B('(day ' + x2 + ', ' + y2 + ' cm)') + '. Extend the line.',
            ask: 'On what day does the line predict no snow?', q: 'Day with no snow?', v: Z, pre: 'day', cue: 'Slope, b, then y = 0',
            errs: [[R(y2 / r, 2), 'Count from day 0', 2], [R(y1 / r, 2), 'Count from day 0', 2], [b, 'That’s b: now y = 0', 2], [r, 'That’s the rate: keep going', 0]],
            steps: [['slope', '(' + y2 + ' − ' + y1 + ') ÷ (' + x2 + ' − ' + x1 + ') = −' + r], ['y-intercept', 'b = ' + y1 + ' + ' + r + '(' + x1 + ') = ' + b], ['set y = 0', '0 = ' + b + ' − ' + r + 'x, so x = ' + b + ' ÷ ' + r + ' = ' + Z]],
            pic: { k: 'graph', xl: 'day', yl: 'snow (cm)', lines: [{ m: -r, b, x0: 0, x1: x2, c: 'L' }, { m: -r, b, x0: x2, x1: Z, c: 'L', dash: true, s: 2 }], pts: scat(-r, b, x1 - 3, x2 + 3, 8, 5).concat([{ x: x1, y: y1, t: y1 + ' cm', c: 'Y', pos: 'r' }, { x: x2, y: y2, t: y2 + ' cm', c: 'Y', pos: 'r' }, { x: Z, y: 0, q: true, d: 'day ' + Z, pos: 'a' }]) }
          });
        }
      },
      function stWeekend() {
        const m = pick([2, 3, 4]), b = rnd(40, 70), t1 = -rnd(3, 15), t2 = -rnd(3, 15), y1 = b - m * t1, y2 = b - m * t2, v = y1 + y2;
        return mk('stWeekend', 3, 'ST3', {
          story: 'A café’s line of best fit for hot chocolate is ' + B('y = −' + m + 'x + ' + b) + ' (x in °C, y = cups). Forecast: Saturday ' + B(F(t1) + ' °C') + ', Sunday ' + B(F(t2) + ' °C') + '.',
          ask: 'How many cups does the line predict for both days together?', q: 'Cups for both days?', v, unit: 'cups', cue: 'Predict each day, then add',
          errs: [[2 * b + m * (t1 + t2), '−' + m + ' × negative is positive', 0], [y1, 'Add Sunday too', 2], [y2, 'Add Saturday too', 2], [v - 2 * b, 'Add the ' + b + ' each day', 0]],
          steps: [['Saturday', '−' + m + '(' + F(t1) + ') + ' + b + ' = ' + y1 + ' cups'], ['Sunday', '−' + m + '(' + F(t2) + ') + ' + b + ' = ' + y2 + ' cups'], ['both days', y1 + ' + ' + y2 + ' = ' + v + ' cups']],
          pic: { k: 'table', xh: 'temp (°C)', yh: 'cups', cols: [{ x: 'Sat ' + F(t1), q: true, d: String(y1) }, { x: 'Sun ' + F(t2), q: true, d: String(y2) }], foot: '?', footl: 'both days:' }
        });
      }
    ]
  };

  /* ============ PR · Probability ============ */
  const fr = (n, d) => Q.str(Q.q(n, d));
  // A probability answer: exact fraction, or a decimal to 2 places, or a percent. Named mistakes must sit clear of the answer.
  const prob = (n, d) => ({ v: n / d, ans: fr(n, d), tol: .0051, et: .004, prob: true });
  const CL = { red: 'R', blue: 'L', green: 'N', yellow: 'Y' };
  const PR = {
    1: [
      function prBag() {
        const cs = Q.shuffle(['red', 'blue', 'green', 'yellow']).slice(0, 3), ns = cs.map(() => rnd(2, 7)), t = ns[0] + ns[1] + ns[2], i = rnd(0, 2), c = cs[i], k = ns[i];
        return mk('prBag', 1, 'PR1', Object.assign(prob(k, t), {
          story: 'A bag holds ' + B(ns[0] + ' ' + cs[0]) + ', ' + B(ns[1] + ' ' + cs[1]) + ' and ' + B(ns[2] + ' ' + cs[2]) + ' marbles. You pick one without looking.',
          ask: 'What is the probability that the marble is ' + c + '?', q: 'P(' + c + ')?', cue: 'Wanted ÷ all the marbles',
          errs: [[k / (t - k), 'Out of all ' + t + ' marbles', 0], [(t - k) / t, 'That’s P(not ' + c + ')', 0]],
          steps: [['wanted ÷ total', k + ' ÷ ' + t + ' = ' + fr(k, t)]],
          pic: { k: 'bag', items: cs.map((x, j) => ({ c: CL[x], n: ns[j], t: x })), foot: '?', footl: 'P(' + c + ') =' }
        }));
      },
      function prNot() {
        const n = pick([5, 6, 8, 10, 12]), k = rnd(1, n - 1), L = pick(['WIN', 'PRIZE', 'BONUS']);
        return mk('prNot', 1, 'PR1', Object.assign(prob(n - k, n), {
          story: 'A game spinner has ' + B(n + ' equal sections') + '. ' + B(k) + ' of them say ' + B(L) + '.',
          ask: 'What is the probability of not landing on ' + L + '?', q: 'P(not ' + L + ')?', cue: 'Not = 1 − P(' + L + ')',
          errs: [[k / n, 'That’s P(' + L + ')', 0], [(n - k) / k, 'Out of all ' + n + ' sections', 0]],
          steps: [['1 − P(' + L + ')', '1 − ' + k + '/' + n + ' = ' + fr(n - k, n)]],
          pic: { k: 'spin', n, hit: k, c: 'Y', lab: n <= 8 ? L : '', t: L, foot: '?', footl: 'P(not ' + L + ') =' }
        }));
      },
      function prMenu() {
        const [A, As, Bn, Bs, la, lb] = pick([
          ['soup', 'soups', 'sandwich', 'sandwiches', ['tomato', 'chicken', 'corn', 'lentil'], ['ham', 'egg', 'tuna', 'turkey', 'veggie', 'BLT']],
          ['drink', 'drinks', 'snack', 'snacks', ['milk', 'juice', 'water', 'tea'], ['apple', 'muffin', 'yogurt', 'cheese', 'pretzel', 'granola']]]);
        const a = rnd(2, 4), b = rnd(3, 6);
        return mk('prMenu', 1, 'PR2', {
          story: 'A lunch combo is ' + B('1 ' + A) + ' and ' + B('1 ' + Bn) + '. There are ' + B(a + ' ' + As) + ' and ' + B(b + ' ' + Bs) + ' to choose from.',
          ask: 'How many different combos can you choose?', q: 'How many combos?', v: a * b, unit: 'combos', cue: 'Each ' + A + ' with each ' + Bn,
          errs: [[a + b, 'Each ' + A + ' goes with each', 0]],
          steps: [[As + ' × ' + Bs, a + ' × ' + b + ' = ' + a * b + ' combos']],
          pic: { k: 'grid', rl: A, cl: Bn, rows: la.slice(0, a).map(t => ({ t })), cols: lb.slice(0, b).map(t => ({ t })), hit: 'all', dots: true, s: 0, foot: '?', footl: 'total:' }
        });
      }
    ],
    2: [
      function prExpect() {
        const k = rnd(1, 5), N = pick([16, 24, 40, 48, 80]), e = N * k / 8;
        return mk('prExpect', 2, 'PR1', {
          story: 'A spinner has ' + B('8 equal sections') + ', and ' + B(k) + ' of them are blue. You spin it ' + B(N + ' times') + '.',
          ask: 'How many times would you expect to land on blue?', q: 'Expected blue spins?', v: e, unit: 'times', cue: 'P(blue) × number of spins',
          errs: [[R(k / 8, 4), 'Now × the number of spins', 1], [k, 'P(blue) × the spins', 0], [N * k, 'P(blue) is ' + k + '/8', 0], [R(N / k, 2), 'P(blue) × the spins', 0]],
          steps: [['P(blue)', k + '/8'], ['P × spins', k + '/8 × ' + N + ' = ' + e + ' times']],
          pic: { k: 'spin', n: 8, hit: k, c: 'L', t: 'blue', foot: '?', footl: 'expected:' }
        });
      },
      function prCoinDie() {
        const j = rnd(1, 4), g = 6 - j;
        return mk('prCoinDie', 2, 'PR3', Object.assign(prob(g, 12), {
          story: 'You flip a coin and roll a die. You win with ' + B('heads') + ' and a roll ' + B('greater than ' + j) + '.',
          ask: 'What is the probability that you win?', q: 'P(win)?', cue: 'Each P, then multiply',
          errs: [[g / 6, 'Heads too: × 1/2', 1], [1 / 2 + g / 6, 'And: multiply, don’t add', 1], [g / 8, 'Outcomes multiply: 2 × 6', 1]],
          steps: [['each event', 'P(heads) = 1/2,  P(> ' + j + ') = ' + fr(g, 6)], ['multiply', '1/2 × ' + fr(g, 6) + ' = ' + fr(g, 12)]],
          pic: { k: 'grid', rl: 'coin', cl: 'die', rows: [{ t: 'H' }, { t: 'T' }], cols: [1, 2, 3, 4, 5, 6].map(t => ({ t: String(t) })), hit: [1, 2, 3, 4, 5, 6].slice(j).map(c => [0, c - 1]), s: 1, foot: '?', footl: 'P(win) =' }
        }));
      },
      function prExper() {
        const N = pick([60, 120, 180, 240]), exp = N / 6, obs = exp + pick([-6, -4, -3, 3, 4, 7]), d = obs - exp;
        return mk('prExper', 2, 'PR1', {
          story: 'A die is rolled ' + B(N + ' times') + '. It lands on 4 a total of ' + B(obs + ' times') + '.',
          ask: 'How many more (+) or fewer (−) 4s came up than expected?', q: 'Actual − expected?', v: d, cue: 'Expected = 1/6 × rolls',
          errs: [[exp, 'Now: actual − expected', 1], [R(obs / N, 4), 'Compare counts, not P', 0]],
          steps: [['expected 4s', '1/6 × ' + N + ' = ' + exp], ['actual − expected', obs + ' − ' + exp + ' = ' + F(d)]],
          pic: { k: 'bar', rows: [{ t: 'expected 4s (1/6 of ' + N + ')', segs: [{ v: exp, t: String(exp), c: 'L', s: 0 }] }, { t: 'actual 4s', segs: [{ v: obs, t: String(obs), c: 'Y' }] }], foot: '?', footl: 'actual − expected =' }
        });
      }
    ],
    3: [
      function prNoRep() {
        const r = rnd(3, 7), b = rnd(3, 8), t = r + b;
        return mk('prNoRep', 3, 'PR4', Object.assign(prob(r * (r - 1), t * (t - 1)), {
          story: 'A bag has ' + B(r + ' red') + ' and ' + B(b + ' blue') + ' tokens. You draw one, ' + B('keep it') + ', then draw another.',
          ask: 'What is the probability that both tokens are red?', q: 'P(both red)?', cue: 'The bag changes after draw 1',
          errs: [[r * r / (t * t), 'The first one is kept out', 1], [r * (r - 1) / (t * t), 'One fewer token in the bag', 1], [r / t + (r - 1) / (t - 1), 'And: multiply, don’t add', 2]],
          steps: [['1st red', r + '/' + t], ['2nd red', (r - 1) + '/' + (t - 1) + '  (one red kept out)'], ['multiply', r + '/' + t + ' × ' + (r - 1) + '/' + (t - 1) + ' = ' + fr(r * (r - 1), t * (t - 1))]],
          pic: { k: 'bag', items: [{ c: 'R', n: r, t: 'red' }, { c: 'L', n: b, t: 'blue' }], out: { c: 'R', s: 1, t: 'kept out' }, foot: '?', footl: 'P(both red) =' }
        }));
      },
      function prRain() {
        const a = pick([20, 30, 40, 50, 60]), b = pick([10, 20, 30, 40, 70]), pa = 1 - a / 100, pb = 1 - b / 100, none = R(pa * pb, 4), v = R(1 - none, 4);
        return mk('prRain', 3, 'PR3', Object.assign(prob(1, 1), {
          v, ans: F(v),
          story: 'There is a ' + B(a + '%') + ' chance of rain on Saturday and a ' + B(b + '%') + ' chance on Sunday. The two days are independent.',
          ask: 'What is the probability that it rains on at least one of the days?', q: 'P(rain at least once)?', cue: 'Use the complement: 1 − P(neither)',
          errs: [[(a + b) / 100, 'Adding counts the overlap twice', 0], [none, 'That’s neither day: now 1 −', 2], [a * b / 10000, 'That’s rain on both days', 1]],
          steps: [['no rain each day', F(pa) + ' and ' + F(pb)], ['neither day', F(pa) + ' × ' + F(pb) + ' = ' + F(none)], ['at least once', '1 − ' + F(none) + ' = ' + F(v)]],
          pic: { k: 'grid', rl: 'Sat', cl: 'Sun', rows: [{ t: 'rain ' + a + '%', w: a }, { t: 'dry ' + (100 - a) + '%', w: 100 - a }], cols: [{ t: 'rain ' + b + '%', w: b }, { t: 'dry ' + (100 - b) + '%', w: 100 - b }], hit: [[0, 0], [0, 1], [1, 0]], s: 2, ct: { '1,1': { t: 'neither ' + F(none), s: 1 } }, foot: '?', footl: 'P(at least once) =' }
        }));
      },
      function prRounds() {
        for (;;) {
          const t = pick([4, 5, 6, 8, 10]), g = rnd(1, Math.min(3, t - 2)), k = pick([2, 3, 4, 5]), games = t * t * k, v = g * g * k;
          if (games > 300) continue;
          return mk('prRounds', 3, 'PR3', {
            story: 'A pile has ' + B(t + ' cards') + ' and ' + B(g + ' ' + (g > 1 ? 'are aces' : 'is an ace')) + '. Draw one, put it back, draw again: two aces wins. You play ' + B(games + ' rounds') + '.',
            ask: 'About how many rounds would you expect to win?', q: 'Expected wins?', v, unit: 'wins', cue: 'P(two aces) × the rounds',
            errs: [[R(g / t * games, 2), 'Both draws must be aces', 1], [R(g * g / (t * t), 4), 'Now × the rounds', 2], [R(g * (g - 1) / (t * (t - 1)) * games, 2), 'It’s put back: same odds', 1], [R(2 * g / t * games, 2), 'And: multiply, don’t add', 1]],
            steps: [['each draw', 'P(ace) = ' + g + '/' + t], ['both aces', g + '/' + t + ' × ' + g + '/' + t + ' = ' + fr(g * g, t * t)], ['× rounds', fr(g * g, t * t) + ' × ' + games + ' = ' + v + ' wins']],
            pic: { k: 'bag', box: true, items: [{ c: 'Y', n: g, t: g > 1 ? 'aces' : 'ace', l: 'A' }, { c: 'M', n: t - g, t: 'other' }], foot: '?', footl: 'expected wins:' }
          });
        }
      }
    ]
  };

  const TOPICS = { rn: RN, sr: SR, pe: PE, lr: LR, le: LE, po: PO, cg: CG, me: ME, si: SI, st: ST, pr: PR };
  const lvlAt = n => n == null ? rnd(1, 3) : n < 3 ? 1 : n < 7 ? 2 : 3;   // a round: 3 one-step, 4 two-step, 3 three-step
  const gen = (topic, n) => pick(TOPICS[topic][lvlAt(n)])();
  const genMix = n => { const t = pick(Object.keys(TOPICS)); return Object.assign(gen(t, n), { topic: t }); };
  return { TOPICS, gen, genMix, check, resp, sameP, ps, lvlAt, R, F, pw, N };
})();
