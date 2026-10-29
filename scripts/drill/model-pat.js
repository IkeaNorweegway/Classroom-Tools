
/* ===================== MODEL START (no DOM) ===================== */
/* PAT word problems. Money is kept in whole cents and distances in tenths, so every answer is exact. */
const MODEL = (() => {
  const { val, rnd, pick, chance, shuffle } = Q;
  const near = (g, x, t) => g != null && Math.abs(val(g) - x) <= (t == null ? .005 : t) + 1e-9;
  const r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100;
  const ans = x => String(r2(x));
  const $c = c => '$' + (c % 100 === 0 ? String(c / 100) : (c / 100).toFixed(2)); // cents -> "$5" or "$0.06"
  const NAMES = ['Maya', 'Liam', 'Aiyana', 'Noah', 'Priya', 'Owen', 'Sofia', 'Kai', 'Amara', 'Ethan', 'Zoe', 'Jonah', 'Leah', 'Arjun', 'Nadia', 'Cole', 'Hana', 'Mateo'];
  const TRIOS = [['Tara', 'Jen', 'Mindy'], ['Ari', 'Ben', 'Cody'], ['Lena', 'Raj', 'Sam'], ['Mia', 'Eli', 'Rosa'], ['Dev', 'Ivy', 'Max']];

  /* RN3 Trip: two legs, distance = speed × time. Speeds are 1.2k so every leg is a whole number of tenths. */
  const TRIP = [{ w: 'bikes', icon: '🚲', lo: 8, hi: 15 }, { w: 'paddles', icon: '🛶', lo: 3, hi: 6 }, { w: 'drives', icon: '🚗', lo: 50, hi: 90 }];
  const HOURS = [[1, 4], [1, 2], [3, 4], [1, 3], [2, 3], [3, 2]], MINS = [15, 20, 30, 40, 45];
  function genTrip() {
    const c = pick(TRIP), mode = pick(['frac', 'frac', 'min']);
    let k1, k2; do { k1 = rnd(c.lo, c.hi); k2 = rnd(c.lo, c.hi); } while (k1 === k2);
    const t = [0, 1].map(() => { if (mode === 'min') { const m = pick(MINS); return { n: m, d: 60, m }; } const [n, d] = pick(HOURS); return { n, d }; });
    if (mode === 'min' && t[0].m === t[1].m) t[1] = { n: t[0].m === 30 ? 45 : 30, d: 60, m: t[0].m === 30 ? 45 : 30 };
    const S = [12 * k1, 12 * k2], D = S.map((s, i) => s * t[i].n / t[i].d); // tenths
    return { form: mode, who: pick(NAMES), ctx: c.w, icon: c.icon, s: S.map(x => x / 10), t, d: D.map(x => x / 10), v: (D[0] + D[1]) / 10 };
  }
  function checkTrip(it, r) {
    const g = r.v, s = it.s, t = it.t.map(x => x.n / x.d), T = .05;
    if (near(g, it.v, T)) return { ok: true };
    if (it.form === 'min' && near(g, s[0] * it.t[0].m / 100 + s[1] * it.t[1].m / 100, T)) return { code: 'min', cue: '60 minutes in an hour' };
    if (near(g, it.d[0], T) || near(g, it.d[1], T)) return { code: 'one', cue: 'Add both parts of the trip' };
    if (near(g, (s[0] + s[1]) * (t[0] + t[1]), T) || near(g, (s[0] + s[1]) / 2 * (t[0] + t[1]), T)) return { code: 'mix', cue: 'Each part: its own speed × time' };
    if (near(g, s[0] / t[0] + s[1] / t[1], T)) return { code: 'div', cue: 'distance = speed × time' };
    return { code: 'other', cue: 'speed × time for each part' };
  }

  /* SR1 Rug: a square covers p% of a rectangle. Area first, then the square root. */
  const RUG = [{ w: 'rug', place: 'the floor of a', what: 'room' }, { w: 'garden', place: 'a', what: 'yard' }, { w: 'patio', place: 'a', what: 'backyard' }];
  function genRug() {
    for (;;) {
      const L = rnd(6, 24), W = rnd(4, L), p = pick([12.5, 20, 25, 37.5, 40, 50, 60, 75, 80]), A = L * W * p / 100, s = Math.round(Math.sqrt(A));
      if (s * s !== A || s < 2 || s > Math.min(L, W) || s === Math.min(L, W)) continue;
      return Object.assign({ L, W, p, area: A, v: s }, pick(RUG));
    }
  }
  function checkRug(it, r) {
    const g = r.v, T = .05; if (near(g, it.v, T)) return { ok: true };
    if (near(g, it.area, T)) return { code: 'area', cue: 'That’s the area: now take √' };
    if (near(g, it.area / 2, T)) return { code: 'half', cue: '√ is not ÷ 2' };
    if (near(g, Math.sqrt(it.L * it.W), T) || near(g, it.L * it.W, T)) return { code: 'full', cue: 'Only ' + it.p + '% of the ' + it.what };
    if (near(g, it.area / 4, T)) return { code: 'perim', cue: 'Area = side × side' };
    return { code: 'other', cue: 'Area first, then √' };
  }

  /* LR4 Bill: total = fee + rate × n, or n from the total. Cents throughout. */
  const BILL = [
    { id: 'phone', icon: '📱', fees: [500, 1000, 1500], rates: [5, 6, 8, 10], lo: 20, hi: 150, unit: 'minute', units: 'minutes',
      plan: (f, r) => 'A phone plan is ' + f + ' a month plus ' + r + ' a minute.', use: (w, n) => w + ' talks ' + n + ' minutes.', paid: (w, T) => w + '’s bill is ' + T + '.' },
    { id: 'taxi', icon: '🚕', fees: [350, 400, 425], rates: [175, 200, 225], lo: 3, hi: 20, unit: 'km', units: 'km',
      plan: (f, r) => 'A taxi charges ' + f + ' plus ' + r + ' per km.', use: (w, n) => w + ' rides ' + n + ' km.', paid: (w, T) => w + '’s fare is ' + T + '.' },
    { id: 'gym', icon: '🏋️', fees: [2500, 5000, 7500], rates: [1500, 2000, 3000], lo: 2, hi: 12, unit: 'month', units: 'months',
      plan: (f, r) => 'A gym charges a ' + f + ' sign-up fee plus ' + r + ' a month.', use: (w, n) => w + ' goes for ' + n + ' months.', paid: (w, T) => w + ' has paid ' + T + ' in all.' },
    { id: 'bowl', icon: '🎳', fees: [300, 400, 500], rates: [450, 500, 600], lo: 2, hi: 6, unit: 'game', units: 'games',
      plan: (f, r) => 'Bowling costs ' + f + ' for shoes plus ' + r + ' a game.', use: (w, n) => w + ' bowls ' + n + ' games.', paid: (w, T) => w + ' pays ' + T + '.' }
  ];
  function genBill() {
    const c = pick(BILL), fee = pick(c.fees), rate = pick(c.rates), n = rnd(c.lo, c.hi), form = pick(['total', 'total', 'n']);
    const T = fee + rate * n;
    return { form, ctx: c.id, who: pick(NAMES), fee, rate, n, T, v: form === 'total' ? T / 100 : n };
  }
  const billCtx = it => BILL.find(c => c.id === it.ctx);
  function checkBill(it, r) {
    const g = r.v;
    if (it.form === 'total') {
      if (near(g, it.T / 100)) return { ok: true };
      if (near(g, it.rate * it.n / 100)) return { code: 'nofee', cue: 'Add the ' + $c(it.fee) + ' fee' };
      if (near(g, (it.fee + it.rate) * it.n / 100)) return { code: 'both', cue: 'The fee is paid once' };
      return { code: 'other', cue: 'fee + rate × ' + it.n };
    }
    if (near(g, it.n, .05)) return { ok: true };
    if (near(g, it.T / it.rate, .05) || near(g, Math.round(it.T / it.rate), .05)) return { code: 'nofee', cue: 'Take off the ' + $c(it.fee) + ' fee first' };
    if (near(g, (it.T - it.fee) / 100)) return { code: 'sub', cue: 'That’s dollars: ÷ ' + $c(it.rate) };
    return { code: 'other', cue: '(total − fee) ÷ rate' };
  }

  /* LE5 Save up: (goal − have) ÷ rate, rounded UP. */
  const SAVE = [
    { id: 'work', icon: '⏱️', rates: [1025, 1250, 1500, 1575, 1650], unit: 'hours', one: 'hour', earn: r => 'earns ' + r + ' an hour' },
    { id: 'week', icon: '📅', rates: [1500, 2000, 2500, 3000, 3500, 4000], unit: 'weeks', one: 'week', earn: r => 'saves ' + r + ' a week' },
    { id: 'cars', icon: '🚗', rates: [800, 1000, 1200], unit: 'cars', one: 'car', earn: r => 'gets ' + r + ' for each car washed' },
    { id: 'lawns', icon: '🌱', rates: [1500, 2000, 2500], unit: 'lawns', one: 'lawn', earn: r => 'gets ' + r + ' for each lawn mowed' }
  ];
  const ITEMS = [['pair of skates', '⛸️'], ['bike', '🚲'], ['guitar', '🎸'], ['set of headphones', '🎧'], ['game console', '🎮'], ['tent', '⛺']];
  function genSave() {
    for (let i = 0; ; i++) {
      const c = pick(SAVE), rate = pick(c.rates), G = rnd(24, 120) * 5, H = rnd(2, Math.floor(G / 10)) * 5 + pick([0, 1, 3]);
      const need = (G - H) * 100, n = Math.ceil(need / rate), exact = need % rate === 0;
      if (n < 3 || n > 28 || H >= G) continue;
      if (exact && chance(.8)) continue;
      const [thing, ticon] = pick(ITEMS);
      return { form: c.id, who: pick(NAMES), G, H, rate, need, n, exact, thing, ticon, v: n };
    }
  }
  const saveCtx = it => SAVE.find(c => c.id === it.form);
  function checkSave(it, r) {
    const g = r.v, q0 = it.need / it.rate; if (near(g, it.n, .001)) return { ok: true };
    if (!it.exact && near(g, Math.floor(q0), .001)) return { code: 'down', cue: 'Not enough yet: round up' };
    if (!it.exact && near(g, q0, .05)) return { code: 'dec', cue: 'Whole ' + saveCtx(it).unit + ': round up' };
    const q1 = it.G * 100 / it.rate;
    if (near(g, q1, .05) || near(g, Math.ceil(q1), .001) || near(g, Math.floor(q1), .001)) return { code: 'nohave', cue: 'Take off the $' + it.H + ' first' };
    if (near(g, it.G - it.H, .001)) return { code: 'need', cue: 'That’s dollars: ÷ ' + $c(it.rate) };
    return { code: 'other', cue: '(goal − have) ÷ rate, round up' };
  }

  /* LE4 Budget: fee + rate × n ≤ budget, rounded DOWN. */
  const BUD = [
    { id: 'fair', icon: '🎡', place: 'the fair', fees: [500, 800, 1000], rates: [250, 300, 350, 400], each: 'each ride', unit: 'rides', fee: 'Entry' },
    { id: 'arcade', icon: '🕹️', place: 'the arcade', fees: [300, 500], rates: [125, 150, 175, 200], each: 'each game', unit: 'games', fee: 'A game card' },
    { id: 'taxi', icon: '🚕', place: 'a taxi', fees: [350, 400], rates: [175, 200, 225], each: 'each km', unit: 'km', fee: 'The base fare' },
    { id: 'pool', icon: '🏊', place: 'swim lessons', fees: [1500, 2000], rates: [650, 800, 950], each: 'each lesson', unit: 'lessons', fee: 'Sign-up' }
  ];
  function genBudget() {
    for (;;) {
      const c = pick(BUD), fee = pick(c.fees), rate = pick(c.rates), B = rnd(4, 18) * 5, room = B * 100 - fee, n = Math.floor(room / rate);
      if (n < 3 || n > 25) continue;
      const exact = room % rate === 0; if (exact && chance(.85)) continue;
      return { form: c.id, who: pick(NAMES), B, fee, rate, n, exact, v: n };
    }
  }
  const budCtx = it => BUD.find(c => c.id === it.form);
  function checkBudget(it, r) {
    const g = r.v, q0 = (it.B * 100 - it.fee) / it.rate; if (near(g, it.n, .001)) return { ok: true };
    if (!it.exact && near(g, Math.ceil(q0), .001)) return { code: 'up', cue: 'Over budget: round down' };
    if (!it.exact && near(g, q0, .05)) return { code: 'dec', cue: 'Whole ' + budCtx(it).unit + ': round down' };
    const q1 = it.B * 100 / it.rate;
    if (near(g, Math.floor(q1), .001) || near(g, q1, .05) || near(g, Math.ceil(q1), .001)) return { code: 'nofee', cue: 'Pay the ' + $c(it.fee) + ' first' };
    return { code: 'other', cue: '(budget − fee) ÷ rate, round down' };
  }

  /* LE5 Shares: three people, one unknown t. less: A = t, B = k·t, C = k·t − d. more: C = t + d. extra: C = k·t + d. */
  const SHARE = [{ id: 'money', verb: 'raised', unit: '$' }, { id: 'points', verb: 'scored', unit: 'points' }, { id: 'cards', verb: 'collected', unit: 'cards' }];
  function genShares() {
    for (;;) {
      const form = pick(['less', 'more', 'extra']), k = pick([2, 2, 3]), t = rnd(4, 30), d = rnd(1, 4) * 5;
      if (form === 'less' && d >= k * t) continue;
      const c = [t, k * t, form === 'less' ? k * t - d : form === 'more' ? t + d : k * t + d];
      return Object.assign({ form, k, t, d, c, total: c[0] + c[1] + c[2], parts: form === 'more' ? k + 2 : 2 * k + 1, names: pick(TRIOS), v: t }, { ctx: pick(SHARE) });
    }
  }
  function checkShares(it, r) {
    const g = r.v, T = .05; if (near(g, it.t, T)) return { ok: true };
    const sgn = it.form === 'less' ? 1 : -1, nm = it.names;
    if (near(g, it.total / it.parts, T)) return { code: 'ignore', cue: (sgn > 0 ? 'Add the ' : 'Take off the ') + it.d + ' first' };
    if (near(g, (it.total - sgn * it.d) / it.parts, T)) return { code: 'way', cue: sgn > 0 ? nm[2] + ' has less: add it back' : nm[2] + ' has extra: take it off' };
    if (near(g, it.c[1], T)) return { code: 'who', cue: 'That’s ' + nm[1] + '’s share' };
    if (near(g, it.c[2], T)) return { code: 'who', cue: 'That’s ' + nm[2] + '’s share' };
    if (near(g, (it.total + sgn * it.d) / 3, T) || near(g, it.total / 3, T)) return { code: 'count', cue: 'Count the blocks: ' + it.parts };
    return { code: 'other', cue: 'Fix the ' + it.d + ', then ÷ ' + it.parts };
  }

  /* LE5 Catch up: plan A has the smaller fee and the bigger rate. n = fee gap ÷ rate gap. */
  const CATCH = [{ id: 'class', icon: '🧘', who: 'Studio', fee: 'to join', each: 'a class', unit: 'classes' }, { id: 'rink', icon: '⛸️', who: 'Rink', fee: 'for a pass', each: 'a visit', unit: 'visits' },
    { id: 'bike', icon: '🚲', who: 'Shop', fee: 'to rent', each: 'an hour', unit: 'hours' }, { id: 'game', icon: '🎮', who: 'Club', fee: 'to join', each: 'a game', unit: 'games' }];
  function genCatch() {
    const c = pick(CATCH), rB = rnd(3, 12), gap = rnd(1, 6), rA = rB + gap, n = rnd(3, 14), fA = rnd(1, 6) * 5, fB = fA + gap * n;
    return { form: c.id, fA, fB, rA, rB, n, cost: fA + rA * n, v: n };
  }
  const catchCtx = it => CATCH.find(c => c.id === it.form);
  function checkCatch(it, r) {
    const g = r.v, T = .05; if (near(g, it.n, T)) return { ok: true };
    if (near(g, it.fB - it.fA, T)) return { code: 'fee', cue: 'Now ÷ the rate gap: ' + (it.rA - it.rB) };
    if (near(g, (it.fB - it.fA) / (it.rA + it.rB), T)) return { code: 'sum', cue: 'Subtract the rates' };
    if (near(g, it.cost, T)) return { code: 'cost', cue: 'That’s the cost: find n' };
    if (near(g, (it.fB - it.fA) / it.rA, T) || near(g, (it.fB - it.fA) / it.rB, T)) return { code: 'one', cue: 'Divide by the rate gap' };
    return { code: 'other', cue: 'fee gap ÷ rate gap' };
  }

  /* SR3 Ladder: the Pythagorean theorem in a scene. a = horizontal leg, b = vertical leg, c = hypotenuse. */
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [12, 16, 20]];
  function genLadder() {
    const form = pick(['ladder', 'kite', 'screen', 'park']);
    let a, b, given = null;
    if (form === 'ladder') {
      if (chance(.7)) { const k = pick([.5, 1]), [x, y] = pick([[3, 4], [5, 12], [6, 8]]).map(v => v * k); a = x; b = y; }
      else { given = rnd(8, 16) / 2; a = rnd(2, 5) / 2; b = Math.sqrt(given * given - a * a); }
    }
    else if (form === 'kite') { const [x, y] = pick([[7, 24], [8, 15], [5, 12], [9, 12], [12, 16], [20, 21]]); const k = pick([1, 2]); a = x * k; b = y * k; }
    else if (form === 'screen') { if (chance(.6)) { const t = pick([[3, 4], [6, 8], [9, 12], [12, 16]]); const k = pick([2, 3]); a = t[1] * k; b = t[0] * k; } else { a = pick([48, 40, 32, 64]); b = a * 9 / 16; } }
    else { const t = pick(TRIPLES), k = pick([5, 10, 20]); a = t[1] * k; b = t[0] * k; }
    const c = given != null ? given : Math.sqrt(a * a + b * b);
    const askLeg = form === 'ladder' || form === 'kite';
    const v = form === 'park' ? r1(a + b - c) : askLeg ? r1(b) : r1(c);
    return { form, a, b, c, v };
  }
  function checkLadder(it, r) {
    const g = r.v, T = .051, { a, b, c } = it; if (near(g, it.v, T)) return { ok: true };
    if (it.form === 'park') {
      if (near(g, c, T)) return { code: 'diag', cue: 'That’s the path: how much shorter?' };
      if (near(g, a + b, T)) return { code: 'around', cue: 'Subtract the path from the walk' };
      if (near(g, a * a + b * b, T) || near(g, a + b - Math.sqrt(Math.abs(a * a - b * b)), T)) return { code: 'noroot', cue: 'Path² = a² + b², then √' };
      return { code: 'other', cue: '(a + b) − path' };
    }
    if (it.form === 'screen') {
      if (near(g, a + b, T)) return { code: 'add', cue: 'Square, add, then √' };
      if (near(g, a * a + b * b, T)) return { code: 'noroot', cue: 'Now take the square root' };
      if (near(g, Math.sqrt(Math.abs(a * a - b * b)), T)) return { code: 'sub', cue: 'Longest side: add the squares' };
      return { code: 'other', cue: 'c² = a² + b²' };
    }
    if (near(g, Math.sqrt(c * c + a * a), T)) return { code: 'legadd', cue: 'A leg: subtract the squares' };
    if (near(g, c * c - a * a, T)) return { code: 'noroot', cue: 'Now take the square root' };
    if (near(g, c - a, T) || near(g, c + a, T)) return { code: 'add', cue: 'Square them first' };
    return { code: 'other', cue: 'b² = c² − a²' };
  }

  /* ME2 Paint: surface area of a box. closed = 6 faces, open = no top (5 faces). */
  const BOX = { closed: [['gift box', 'How much paper covers it exactly?', '🎁']], open: [['planter box', 'How much outside area is there to paint?', '🪴'], ['fish tank', 'How much glass does it take?', '🐟']] };
  function genPaint() {
    const form = pick(['closed', 'open', 'open']), [what, job, icon] = pick(BOX[form]);
    let l, w, h; do { l = rnd(2, 12) * 5; w = rnd(2, 8) * 5; h = rnd(2, 8) * 5; } while (w >= l || h === w);
    const lw = l * w, lh = l * h, wh = w * h, v = form === 'closed' ? 2 * (lw + lh + wh) : lw + 2 * (lh + wh);
    return { form, what, job, icon, l, w, h, lw, lh, wh, v };
  }
  function checkPaint(it, r) {
    const g = r.v, T = .5, all = 2 * (it.lw + it.lh + it.wh); if (near(g, it.v, T)) return { ok: true };
    if (it.form === 'open' && near(g, all, T)) return { code: 'all6', cue: 'No top: 5 faces' };
    if (it.form === 'closed' && near(g, all - it.lw, T)) return { code: 'five', cue: 'Closed box: all 6 faces' };
    if (near(g, it.lw + it.lh + it.wh, T)) return { code: 'half', cue: 'Each side face has a twin' };
    if (near(g, it.l * it.w * it.h, T)) return { code: 'vol', cue: 'That’s volume: add face areas' };
    if (it.form === 'open' && near(g, 2 * (it.lh + it.wh), T)) return { code: 'nobase', cue: 'Count the bottom too' };
    return { code: 'other', cue: 'Add the area of every face' };
  }

  /* PR1 Predict: a sample result scaled up. answer = hits × (whole ÷ sample). */
  const PRED = [
    { id: 'watch', icon: '⌚', mark: '✗', s: (n, h) => 'A worker tests ' + n + ' watches and finds ' + h + ' faulty.', w: N => 'About how many of ' + N + ' watches are faulty?', q: 'Faulty watches' },
    { id: 'walk', icon: '🚶', mark: '✓', s: (n, h) => 'In a survey, ' + h + ' of ' + n + ' students walk to school.', w: N => 'About how many of the ' + N + ' students walk?', q: 'Students who walk' },
    { id: 'seed', icon: '🌱', mark: '✓', s: (n, h) => 'Of ' + n + ' seeds planted, ' + h + ' sprouted.', w: N => 'How many of ' + N + ' seeds should sprout?', q: 'Seeds that sprout' }
  ];
  function genPredict() {
    for (;;) {
      const n = pick([10, 20, 25, 40, 50]), h = rnd(1, n - 1), m = rnd(4, 40), c = pick(PRED);
      if (h * 2 > n && c.id === 'watch') continue;
      return { form: c.id, n, h, m, N: n * m, v: h * m };
    }
  }
  const predCtx = it => PRED.find(c => c.id === it.form);
  function checkPredict(it, r) {
    const g = r.v, T = .5; if (near(g, it.v, T)) return { ok: true };
    if (near(g, it.h / (it.n - it.h) * it.N, 1)) return { code: 'pp', cue: it.h + ' out of all ' + it.n };
    if (near(g, it.h / it.n * 100, .05)) return { code: 'pct', cue: 'That’s the percent: of ' + it.N + '?' };
    if (near(g, it.h, .001)) return { code: 'sample', cue: 'Scale up to ' + it.N };
    if (near(g, it.h * it.N, T) || near(g, it.N / it.h, 1)) return { code: 'scale', cue: it.N + ' is ' + it.m + ' groups of ' + it.n };
    return { code: 'other', cue: it.h + '/' + it.n + ' of ' + it.N };
  }

  return { near, r1, r2, ans, $c, billCtx, saveCtx, budCtx, catchCtx, predCtx,
    genTrip, checkTrip, genRug, checkRug, genBill, checkBill, genSave, checkSave, genBudget, checkBudget,
    genShares, checkShares, genCatch, checkCatch, genLadder, checkLadder, genPaint, checkPaint, genPredict, checkPredict };
})();
/* ===================== MODEL END ===================== */

