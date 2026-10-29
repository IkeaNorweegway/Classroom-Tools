/* ===================== MODEL START (no DOM) ===================== */
const MODEL = (() => {
  const { q, eq, val, add, sub, mul, div, rnd, pick, chance } = Q;
  const COLS = ['red', 'blue', 'green'];

  /* PR1 probability of one event */
  const DIE = { even: [2, 4, 6], 'greater than 4': [5, 6], 'a 6': [6], 'less than 3': [1, 2], odd: [1, 3, 5], 'a multiple of 3': [3, 6] };
  function genProb() {
    if (chance(.6)) {
      const counts = { red: rnd(1, 6), blue: rnd(1, 6), green: chance(.5) ? rnd(1, 5) : 0 }, ask = pick(COLS.filter(c => counts[c] > 0));
      const n = counts.red + counts.blue + counts.green; return { type: 'bag', counts, ask, n, v: q(counts[ask], n) };
    }
    const ev = pick(Object.keys(DIE)); return { type: 'die', ev, fav: DIE[ev], n: 6, v: q(DIE[ev].length, 6) };
  }
  function checkProb(it, r) {
    const g = r.v; if (eq(g, it.v)) return { ok: true };
    const f = it.type === 'bag' ? it.counts[it.ask] : it.fav.length;
    if (f < it.n && eq(g, q(f, it.n - f))) return { code: 'part', cue: 'Out of all of them, not the rest' };
    if (eq(g, q(it.n - f, it.n))) return { code: 'not', cue: 'That’s the chance it doesn’t happen' };
    return { code: 'other', cue: 'Favourable ÷ total' };
  }

  /* PR1 complement */
  function genNot() {
    if (chance(.5)) { const p = rnd(5, 95) / 100; return { form: 'dec', p: q(Math.round(p * 100), 100), v: q(100 - Math.round(p * 100), 100) }; }
    const d = pick([3, 4, 5, 6, 8, 10, 12]), n = rnd(1, d - 1); return { form: 'frac', p: q(n, d), v: q(d - n, d) };
  }
  function checkNot(it, r) {
    const g = r.v; if (eq(g, it.v)) return { ok: true };
    if (eq(g, it.p)) return { code: 'same', cue: 'Not A: 1 − P(A)' };
    if (val(it.p) !== 0 && eq(g, div(1, it.p))) return { code: 'recip', cue: 'They add to 1: subtract' };
    return { code: 'other', cue: 'P(A) + P(not A) = 1' };
  }

  /* PR1 expected count in the long run */
  function genExp() {
    const p = pick([q(1, 2), q(1, 3), q(1, 4), q(1, 5), q(1, 6), q(2, 5), q(3, 8), q(3, 4)]), n = pick([20, 30, 40, 60, 80, 100, 120, 200]);
    // one simulated run, seeded by the kit's random, to set against the expectation
    let hits = 0; for (let i = 0; i < n; i++) if (rnd(0, p.d - 1) < p.n) hits++;
    return { p, n, v: n * val(p), hits };
  }
  function checkExp(it, r) {
    const g = val(r.v); if (Math.abs(g - it.v) <= .5) return { ok: true };
    if (Math.abs(g - it.n * (1 - val(it.p))) <= .5) return { code: 'rest', cue: 'Count the event, not the rest' };
    if (Math.abs(g - it.n / val(it.p)) <= .5) return { code: 'div', cue: 'Expected = trials × P' };
    if (g === it.hits) return { code: 'run', cue: 'One run wobbles: use n × P' };
    return { code: 'other', cue: 'Expected = trials × P' };
  }

  /* PR2 count the outcomes of two experiments */
  const EXPS = [{ id: 'coin', n: 2, labs: ['H', 'T'] }, { id: 'die', n: 6, labs: ['1', '2', '3', '4', '5', '6'] }, { id: 'spin3', n: 3, labs: ['R', 'G', 'B'] }, { id: 'spin4', n: 4, labs: ['1', '2', '3', '4'] }, { id: 'spin5', n: 5, labs: ['A', 'B', 'C', 'D', 'E'] }];
  function genOut() { const a = pick(EXPS), b = pick(EXPS); return { a, b, v: a.n * b.n }; }
  function checkOut(it, r) {
    const g = val(r.v); if (g === it.v) return { ok: true };
    if (g === it.a.n + it.b.n) return { code: 'add', cue: 'Every pair counts: multiply' };
    return { code: 'other', cue: it.a.n + ' rows × ' + it.b.n + ' columns' };
  }

  /* PR3 independent: P(A and B) = P(A) × P(B) */
  const EVENTS = [{ exp: 'coin', name: 'H', fav: ['H'] }, { exp: 'die', name: 'even', fav: ['2', '4', '6'] }, { exp: 'die', name: '6', fav: ['6'] }, { exp: 'die', name: 'more than 4', fav: ['5', '6'] }, { exp: 'spin4', name: '1', fav: ['1'] }, { exp: 'spin3', name: 'B', fav: ['B'] }, { exp: 'spin5', name: 'a vowel', fav: ['A', 'E'] }];
  function genAnd() {
    const e1 = pick(EVENTS); let e2; do { e2 = pick(EVENTS); } while (e2.exp === e1.exp && e2.name === e1.name);
    const A1 = EXPS.find(x => x.id === e1.exp), B1 = EXPS.find(x => x.id === e2.exp);
    const p1 = q(e1.fav.length, A1.n), p2 = q(e2.fav.length, B1.n);
    return { e1, e2, a: A1, b: B1, p1, p2, v: mul(p1, p2) };
  }
  function checkAnd(it, r) {
    const g = r.v; if (eq(g, it.v)) return { ok: true };
    if (eq(g, add(it.p1, it.p2))) return { code: 'add', cue: 'And: multiply' };
    if (eq(g, q(it.e1.fav.length * it.e2.fav.length, it.a.n + it.b.n))) return { code: 'addtot', cue: 'Total outcomes: ' + it.a.n + ' × ' + it.b.n };
    return { code: 'other', cue: 'P(A) × P(B)' };
  }

  /* PR4 two draws without replacement */
  function genNoRep() {
    const red = rnd(2, 6), blue = rnd(2, 6), n = red + blue, ask = pick(['RR', 'RR', 'BB', 'RB']);
    const f1 = ask[0] === 'R' ? red : blue, f2 = ask === 'RR' ? red - 1 : ask === 'BB' ? blue - 1 : blue;
    return { red, blue, n, ask, f1, f2, v: q(f1 * f2, n * (n - 1)) };
  }
  function checkNoRep(it, r) {
    const g = r.v; if (eq(g, it.v)) return { ok: true };
    const f2w = it.ask === 'RB' ? it.f2 : it.f2 + 1;
    if (eq(g, q(it.f1 * f2w, it.n * it.n))) return { code: 'rep', cue: 'One is gone: the bag shrinks' };
    if (eq(g, q(it.f1 * it.f2, it.n * it.n))) return { code: 'total', cue: 'One fewer in total too' };
    if (eq(g, add(q(it.f1, it.n), q(it.f2, it.n - 1)))) return { code: 'add', cue: 'First and second: multiply' };
    return { code: 'other', cue: 'First draw × second draw' };
  }

  /* PR3/PR4 does the chance change? */
  // No memory (coin, die, spinner, anything put back) vs a changed bag or deck (kept out).
  const SUITS = [['♥', 'hearts'], ['♠', 'spades'], ['♦', 'diamonds'], ['♣', 'clubs']];
  function genNext() {
    const kind = pick(['coin', 'die', 'spin', 'bagout', 'bagback', 'bagother', 'cardout', 'cardback', 'cardother']);
    if (kind === 'coin') { const face = pick(['H', 'T']); return { kind, face, k: rnd(4, 7), ans: 'same' }; }
    if (kind === 'die') { const face = rnd(1, 6); return { kind, face, k: rnd(6, 12), ans: 'same', miss: chance(.5) }; }
    if (kind === 'spin') { const sec = pick([3, 4, 5]), col = pick(['red', 'blue', 'green']); return { kind, sec, col, k: rnd(3, 6), ans: 'same' }; }
    if (kind.startsWith('card')) {
      const [s1, s2] = Q.shuffle(SUITS), k = rnd(2, 4);
      return { kind, drawn: s1, ask: kind === 'cardother' ? s2 : s1, k, ans: kind === 'cardout' ? 'lower' : kind === 'cardother' ? 'higher' : 'same' };
    }
    const red = rnd(4, 7), blue = rnd(3, 6), k = rnd(2, 3);
    if (kind === 'bagback') return { kind, red, blue, k, ans: 'same' };
    if (kind === 'bagout') return { kind, red, blue, k, ans: 'lower' };
    return { kind, red, blue, k, ans: 'higher' };   // blues drawn and kept out: red goes up
  }
  function checkNext(it, r) {
    if (r.v === it.ans) return { ok: true };
    const cue = { coin: 'The coin has no memory', die: 'The die has no memory', spin: 'The spinner has no memory', bagback: 'Put back: the bag is the same', bagout: 'Fewer reds left: lower', bagother: 'Fewer blues, same reds: higher', cardback: 'Put back: the deck is the same', cardout: 'Fewer of that suit left: lower', cardother: 'Same suit count, smaller deck: higher' }[it.kind];
    return { code: 'pick', cue };
  }
  // P(the asked thing) before and after, for the picture.
  function nextOdds(it) {
    if (it.kind.startsWith('card')) { const out = it.kind !== 'cardback', same = it.ask === it.drawn; return [Q.q(13, 52), Q.q(13 - (out && same ? it.k : 0), 52 - (out ? it.k : 0))]; }
    if (it.kind.startsWith('bag')) { const n = it.red + it.blue, out = it.kind !== 'bagback'; return [Q.q(it.red, n), Q.q(it.red - (it.kind === 'bagout' ? it.k : 0), n - (out ? it.k : 0))]; }
    const p = it.kind === 'coin' ? Q.q(1, 2) : it.kind === 'die' ? Q.q(1, 6) : Q.q(1, it.sec); return [p, p];
  }

  return { COLS, DIE, EXPS, genProb, checkProb, genNot, checkNot, genExp, checkExp, genOut, checkOut, genAnd, checkAnd, genNoRep, checkNoRep, genNext, checkNext, nextOdds };
})();
/* ===================== MODEL END ===================== */

