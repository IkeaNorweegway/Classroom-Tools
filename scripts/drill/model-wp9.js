
/* ===================== MODEL START (no DOM) ===================== */
/* Math 9 word problems. Every topic has three levels: 1 = one step, 2 = two steps, 3 = three or more.
   An item: { t (problem type), lvl, code (notes section, e.g. RN2), story (HTML, numbers in <b>), q (2–4 words),
   v (the answer), dp (decimal places shown), tol, pre/unit (around the answer box), ans (Show me text, optional),
   errs: [{v, cue, s}] (a named mistake: its value, a cue of six words or fewer, the step it skips or gets wrong),
   cue (when no named mistake matches), steps: [{l, m}] (label, working), pic (a schematic, drawn by wp.js) }. */
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

  function mk(t, lvl, code, o) {
    const dp = o.dp || 0, tol = o.tol != null ? o.tol : dp ? Math.pow(10, -dp) * .51 : .001;
    const errs = (o.errs || []).filter(e => e && isFinite(e[0]) && Math.abs(e[0] - o.v) > Math.max(tol, .051) + 1e-9)
      .map(([v, cue, s]) => ({ v, cue, s }));
    return { t, lvl, code, story: o.story, q: o.q, v: o.v, dp, tol, pre: o.pre || '', unit: o.unit || '', ans: o.ans || F(o.v, dp),
      errs, cue: o.cue, steps: o.steps.map(([l, m]) => ({ l, m })), pic: o.pic };
  }
  // A typed answer -> ok, or the first named mistake it matches.
  function check(it, r) {
    const g = r.v == null || r.v === '' ? NaN : Q.val(r.v);
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

  const TOPICS = { rn: RN, sr: SR, pe: PE };
  const lvlAt = n => n == null ? rnd(1, 3) : n < 3 ? 1 : n < 7 ? 2 : 3;   // a round: 3 one-step, 4 two-step, 3 three-step
  const gen = (topic, n) => pick(TOPICS[topic][lvlAt(n)])();
  const genMix = n => { const t = pick(Object.keys(TOPICS)); return Object.assign(gen(t, n), { topic: t }); };
  return { TOPICS, gen, genMix, check, lvlAt, R, F, pw, N };
})();
