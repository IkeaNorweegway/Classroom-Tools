/* CEFL Town mission: Grade 9 Money, Interest and Credit — "Debt Detective" (companion to the project Debt Detective). LO 9-MM.
   Four chapters, one after each project step: The debts · The cost · Credit score check · The plan. You help Ms. Delgado, the town's
   free credit counsellor, with the brief's case (Jordan, 22) step by step.
   Model (MODEL START … END, no DOM): month by month, interest = balance × APR ÷ 12; every minimum is paid, then the rest of the monthly
   budget goes to one debt at a time in the chosen order (a paid-off debt's minimum rolls into the next). This reproduces the workbook:
   avalanche 17 months / $509.31, snowball 17 months / $566.43, minimums only ($170 a month, rolled over) 46 months / $1,712.29, and Sam's
   $1,000 card at the minimum (2.5% of the balance or $10) 185 months / $1,613.90. Utilization = balance ÷ limit; debt-to-income = monthly
   minimums ÷ gross monthly income; payday cost up to $14 per $100 (the total cost, fees included); a line of credit for two weeks =
   amount × rate × 14 ÷ 365. Goal: the Grade 8 Debt Talk (at least 3 of 4 first-try answers). The Score It game (kit sortRush) is
   practice; it never changes the goal.
   Side story, "The 15-minute loan": Rosa borrows $300 at Quick Cash for a car repair (Ch 1) → she has borrowed three paydays in a row,
   $67 each time, while a card would cost about $5 a month (Ch 2) → Mr. Quill's "Credit Booster" flyer promises what no one can do, and
   Rosa's receipt has a $25 "fast-cash fee" on top (Ch 3) → you prove every receipt broke the $14-per-$100 cap at Town Hall, Quick Cash
   refunds the town, and the Know-the-Cost Rule is named after you (Ch 4).
   Between lessons (HELP START … HELP END): townspeople's own credit questions, an extra Score It round, and Town Mail.
   Jordan's debts and the 9.5% line-of-credit rate are the brief's samples; card terms are typical (sample). People are made up. */
(function () {
  'use strict';

/* MODEL START ── no DOM. Money in cents. ── */
var JORDAN = { income: 300000, budget: 40000, debts: [
  { id: 'card', name: 'Credit card', kind: 'Credit card', b: 240000, r: 0.2099, m: 6000, lim: 250000, icon: '💳' },
  { id: 'phone', name: 'Phone financing', kind: 'Financing (pay later)', b: 60000, r: 0, m: 5000, icon: '📱' },
  { id: 'loc', name: 'Line of credit', kind: 'Line of credit', b: 300000, r: 0.095, m: 6000, icon: '🏦' } ] };
function sim(debts, budget, order) { // → { months, interest (cents), off: { id: month } }
  var d = debts.map(function (x) { return { id: x.id, b: x.b, r: x.r, m: x.m }; }), month = 0, interest = 0, off = {};
  while (d.some(function (x) { return x.b > 0.5; }) && month < 600) {
    month++;
    d.forEach(function (x) { if (x.b > 0) { var i = x.b * x.r / 12; x.b += i; interest += i; } });
    var left = budget;
    d.forEach(function (x) { if (x.b > 0) { var p = Math.min(x.b, x.m); x.b -= p; left -= p; } });
    (order || []).forEach(function (id) { var x = d.filter(function (y) { return y.id === id; })[0]; if (x && x.b > 0 && left > 0) { var p = Math.min(x.b, left); x.b -= p; left -= p; } });
    d.forEach(function (x) { if (x.b <= 0.5 && !off[x.id]) { x.b = 0; off[x.id] = month; } });
  }
  return { months: month, interest: Math.round(interest), off: off };
}
function avalanche(debts) { return debts.slice().sort(function (a, b) { return b.r - a.r; }).map(function (x) { return x.id; }); }
function snowball(debts) { return debts.slice().sort(function (a, b) { return a.b - b.b; }).map(function (x) { return x.id; }); }
function planOf(order) { return order ? sim(JORDAN.debts, JORDAN.budget, order) : sim(JORDAN.debts, minTotal(JORDAN.debts), avalanche(JORDAN.debts)); } // no order: minimums only ($170, rolled over)
function minTotal(debts) { return debts.reduce(function (s, x) { return s + x.m; }, 0); }
function monthInt(b, r) { return Math.round(b * r / 12); }
function minPay(b) { return Math.max(1000, Math.round(b * 0.025)); }
function samMin(bal, pay) { var m = 0, I = 0; while (bal > 0.5 && m < 1000) { m++; var i = bal * 0.2099 / 12; bal += i; I += i; var p = Math.min(pay || Math.max(1000, bal * 0.025), bal); bal -= p; } return { months: m, interest: Math.round(I) }; }
function pct(a, b) { return Math.round(a / b * 10000); } // hundredths of a percent
function paydayMax(amt) { return Math.round(amt * 0.14); }
function locCost(amt, r, days) { return Math.round(amt * r * (days || 14) / 365); }
var ROSA = { amt: 30000, fee: 4200, fast: 2500, loans: 3 }, RECEIPTS = [{ who: 'worker', name: 'Mo', amt: 20000 }, { who: 'dev', name: 'Dev', amt: 50000 }];
function charged(amt) { return paydayMax(amt) + ROSA.fast; }
function overTotal() { return ROSA.loans * ROSA.fast + RECEIPTS.length * ROSA.fast; }
var KINDS = [['A $600 phone, paid over 12 months', 'later'], ['Borrowing for college', 'loan'], ['A used car with monthly payments', 'loan'], ['Tap now; no interest if you pay the full balance by the due date', 'card'], ['Borrow up to a limit, usually at a lower rate than a card', 'loc'], ['Split a $200 jacket into 4 payments', 'later']];
var HABITS = [['Pay every bill on time', 'help'], ['Pay the card’s full balance each month', 'help'], ['Keep the balance low compared with the limit', 'help'], ['Keep your oldest account open', 'help'], ['Check your credit report for errors', 'help'], ['Set up automatic payments', 'help'], ['Use one card lightly and pay it off', 'help'],
  ['Miss a payment', 'hurt'], ['Max out your credit card', 'hurt'], ['Apply for five cards in one month', 'hurt'], ['Pay the phone bill two months late', 'hurt'], ['Use 95% of your limit every month', 'hurt']];
var POINTS_TO_WIN = 3;
var GAME_CFGS = {
  score: { kind: 'sortRush', cfg: { id: 'score', name: 'Score It', scoreWord: 'Sorted', win: [6500, 4800], think: 1300, th: [[15, 6], [15, 6]],
    how: '<p><b>Score It.</b> Habits drop in, one at a time. Does each one <b>help</b> a credit score or <b>hurt</b> it?</p><p class="ct-small">A wrong pick costs 2 points. So does a habit that waits too long.</p>',
    bins: [{ id: 'help', label: 'Helps', icon: '📈' }, { id: 'hurt', label: 'Hurts', icon: '📉' }],
    items: HABITS.map(function (x) { return { t: x[0], bin: x[1], icon: x[1] === 'help' ? '✅' : '⚠️', why: x[1] === 'help' ? 'Lenders like on-time payments, low balances and a long, steady history.' : 'Late payments, maxed-out cards and lots of new applications look risky to lenders.' }; }) } }
};
/* MODEL END */

/* HELP START ── between lessons, on fresh seeds. No DOM. ── */
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function pickN(r, a, n) { var b = a.slice(), out = []; while (out.length < n && b.length) out.push(b.splice(Math.floor(r() * b.length), 1)[0]); return out; }
var RATES = [0.1999, 0.2099, 0.2199, 0.0899, 0.095, 0.1299];
function intTask(seed) { var r = RNG(seed * 13 + 1); r(); var b = (4 + Math.floor(r() * 46)) * 10000, rate = RATES[Math.floor(r() * RATES.length)]; return { b: b, r: rate, i: monthInt(b, rate) }; }
function minTask(seed) { var r = RNG(seed * 17 + 3); r(); var b = r() < 0.2 ? (1 + Math.floor(r() * 3)) * 10000 : (6 + Math.floor(r() * 50)) * 10000; return { b: b, m: minPay(b) }; }
function utilTask(seed) { var r = RNG(seed * 19 + 5); r(); var lim = [50000, 100000, 150000, 200000, 250000, 300000][Math.floor(r() * 6)], b = Math.round(lim * (0.05 + Math.floor(r() * 18) * 0.05) / 100) * 100; return { b: b, lim: lim, u: pct(b, lim) }; }
function dtiTask(seed) { var r = RNG(seed * 23 + 7); r(); var inc = (20 + Math.floor(r() * 41)) * 10000, pay = (6 + Math.floor(r() * 40)) * 1000; return { inc: inc, pay: pay, d: pct(pay, inc) }; }
function paydayTask(seed) { var r = RNG(seed * 29 + 11); r(); var amt = (2 + Math.floor(r() * 9)) * 5000; return { amt: amt, pd: paydayMax(amt), loc: locCost(amt, 0.095, 14) }; }
var WHO_QS = [
  { id: 'ask', label: 'Questions before borrowing', text: 'A store says I can buy a TV now and pay later. What should I ask first?', opts: [['What will it cost in total? Can I make every payment on time? Do I need it now?', 1, 'Three good questions. Writing them down.'], ['Only how soon I can take it home.', 0, 'Speed is not the cost.'], ['Nothing. “Pay later” means free.', 0, 'Late fees or high interest can apply.']] },
  { id: 'full', label: 'Paying in full', text: 'How do people use a credit card without paying any interest?', opts: [['Pay the full statement balance by the due date, every month.', 1, 'No balance carried, no interest. Smart.'], ['Pay the minimum.', 0, 'The minimum leaves a balance that grows with interest.'], ['Never look at the statement.', 0, 'Not looking is how interest piles up.']] },
  { id: 'none', label: 'No credit at all', text: 'If I never use credit, I’ll have a perfect score, right?', opts: [['Not quite. With no history, lenders have nothing to judge. Use a little credit well, over time.', 1, 'Huh. So a little, used well, beats none.'], ['Yes. No credit means 900.', 0, 'No history usually means no score or a weak one.'], ['Yes, and you can buy a score later.', 0, 'Scores can’t be bought.']] },
  { id: 'apply', label: 'Many applications', text: 'Should I apply for five store cards this month to get the discounts?', opts: [['No. Lots of applications at once can lower your score and look risky.', 1, 'One card, used well. Fine.'], ['Yes, more cards means a better score.', 0, 'Many new applications can lower it.'], ['Yes, and max them all out.', 0, 'High utilization hurts too.']] },
  { id: 'cycle', label: 'The payday cycle', text: 'Why do people get stuck with payday loans?', opts: [['The cost is so high that paying it back leaves them short, so they borrow again.', 1, 'A cycle. That explains a lot.'], ['They like the shop.', 0, 'It’s the cost, not the shop.'], ['Payday loans are cheaper than everything else.', 0, '$14 per $100 for two weeks is about 364% a year.']] }
];
function mailKind(seed, last) { var k = ['ask']; if (last >= 1) k.push('int', 'min'); if (last >= 2) k.push('util'); if (last >= 3) k.push('dti', 'payday'); var r = RNG(seed * 7 + 3); r(); return k[Math.floor(r() * k.length)]; }
/* HELP END */

  var T = window.CEFLTown, K = T.kit, esc = T.esc;
  var fmt = K.fmt, fmtW = K.fmtW, step = K.step;
  function pFmt(c) { return (Math.round(c) / 100) + '%'; }
  function rate(r) { return (Math.round(r * 10000) / 100) + '%'; }
  var SCORE = T.gameKit.sortRush(GAME_CFGS.score.cfg), SCORE_PAY = 800;
  var NAMES = { card: 'Credit card', phone: 'Phone', loc: 'Line of credit' };
  function orderName(o) { return o ? o.map(function (id) { return NAMES[id]; }).join(' → ') : 'Minimums only'; }
  function caseHTML() {
    return '<div class="ct-doc"><div class="ct-doc-h"><b>Jordan, 22 (sample)</b><span>Earns $3,000 a month before deductions</span></div>' + K.doc(null, JORDAN.debts.map(function (x) { return [x.icon + ' ' + x.name, rate(x.r) + ', minimum ' + fmtW(x.m) + (x.lim ? ', limit ' + fmtW(x.lim) : ''), fmtW(x.b), '']; })).replace('<div class="ct-doc">', '<div>') +
      '<p class="ct-small">Late on the credit card twice this year. Can put $400 a month toward debt. Needs $300 for a car repair next week.</p></div>';
  }
  var COST_CARD = '<p><b>Debt Detective tools</b></p><ul class="ck-notes"><li>One month’s interest = balance × rate ÷ 12.</li><li>Credit utilization = balance ÷ limit.</li><li>Debt-to-income = monthly debt payments ÷ gross monthly income.</li><li>Payday loans: up to $14 per $100 borrowed, total cost, fees included (Alberta).</li><li>A line of credit for 2 weeks ≈ amount × rate × 14 ÷ 365.</li></ul>';
  function receiptHTML(name, amt) { return K.doc('<b>QUICK CASH · Loan receipt</b><span>' + esc(name) + ' · due in 2 weeks</span>', [['Borrowed', '', fmtW(amt), ''], ['Fee: $14 per $100', '', fmt(paydayMax(amt)), 'ded'], ['Fast-cash fee', 'for getting it in 15 minutes', fmt(ROSA.fast), 'ded'], ['Total to repay', '', fmt(amt + charged(amt)), 'net']]); }
  function scoreOpts(api, seed, help) {
    return { title: 'Score It' + (help ? ': an extra round' : ''), name: 'minigame', game: SCORE, seed: seed, seconds: 60, leave: !!help, skipNote: 'Skipping is okay.',
      tierText: help ? K.payTiers(SCORE_PAY) : { great: 'You know your score inside out.', ok: 'Good sorting.', poor: 'On time and low balances. Those two matter most.' } };
  }
  async function scoreRound(api, S, key, n) {
    if (!S.rounds[key]) { var r = await api.minigame(scoreOpts(api, S.seed * 83 + n, false)); S.rounds[key] = { tier: r.tier, score: r.score }; api.save(); api.hud(); }
    var t = S.rounds[key].tier;
    await api.say('delgado', t === 'great' ? 'Faster than my credit report loads. Impressive.' : t === 'ok' ? 'Nicely done.' : t === 'skip' ? 'Another time!' : 'Paying on time and keeping balances low matter most.');
  }

  /* The repayment planner: pick which debt gets the extra money first, run it, compare. Done after at least two different plans. */
  function planPanel(api, S) {
    var order = [], tried = S.plans || [];
    return api.panel({ title: 'Jordan’s $400 a month', name: 'plan', wide: true, data: {}, render: function (body, done, ui) {
      function key(o) { return o ? o.join(',') : 'min'; }
      function add(o) { var k = key(o); if (!tried.some(function (t) { return t.k === k; })) { var r = planOf(o); tried.push({ k: k, order: o, months: r.months, interest: r.interest }); } S.plans = tried; api.save(); }
      function draw(flash) {
        var maxI = Math.max.apply(null, tried.map(function (t) { return t.interest; }).concat([1]));
        body.innerHTML = '<p>Every month Jordan pays all three minimums ($170). The other <b>$230</b> goes to <b>one</b> debt at a time. When a debt is gone, its money moves to the next one. Tap the debts in the order you would pay them off.</p>' +
          '<div class="ct-row ct-wrap">' + JORDAN.debts.map(function (x) { var i = order.indexOf(x.id); return '<button class="ct-btn" type="button" data-d="' + x.id + '" aria-pressed="' + (i >= 0) + '">' + (i >= 0 ? '<b>' + (i + 1) + '.</b> ' : '') + x.icon + ' ' + esc(x.name) + ' <small>' + fmtW(x.b) + ' at ' + rate(x.r) + '</small></button>'; }).join('') + '</div>' +
          '<div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="plGo"' + (order.length === 3 ? '' : ' disabled') + '>Run this plan</button><button class="ct-btn" type="button" id="plMin">Minimums only</button><button class="ct-btn" type="button" id="plClr"' + (order.length ? '' : ' disabled') + '>Clear</button></div>' +
          (tried.length ? '<h3>Plans you tried</h3><div class="ck-bar">' + tried.map(function (t) { return '<span>' + esc(orderName(t.order)) + '</span><div class="ct-track"><div class="ck-barfill" data-k="' + t.k + '" style="background:' + (t.order ? '#ca8a04' : '#b91c1c') + ';transform:scaleX(' + (t.interest / maxI).toFixed(3) + ')"></div></div><span class="v">' + fmtW(Math.round(t.interest / 100) * 100) + '</span>'; }).join('') + '</div>' +
            K.table(tried.map(function (t) { return [esc(orderName(t.order)), t.months + ' months', fmt(t.interest)]; }), ['Plan', 'Debt-free in', 'Total interest']) : '<p class="ct-small">No plans yet. Try at least two.</p>') +
          '<div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="plDone"' + (tried.length >= 2 ? '' : ' disabled') + '>Done comparing</button></div>';
        Array.prototype.forEach.call(body.querySelectorAll('[data-d]'), function (b) { b.addEventListener('click', function () { var id = b.dataset.d, i = order.indexOf(id); if (i >= 0) order.splice(i, 1); else order.push(id); draw(); var nb = body.querySelector('[data-d="' + id + '"]'); if (nb) nb.focus(); }); });
        body.querySelector('#plGo').addEventListener('click', function () { var o = order.slice(); add(o); order = []; draw(key(o)); });
        body.querySelector('#plMin').addEventListener('click', function () { add(null); draw('min'); });
        body.querySelector('#plClr').addEventListener('click', function () { order = []; draw(); });
        body.querySelector('#plDone').addEventListener('click', function () { done(tried); });
        if (flash) { var el = body.querySelector('[data-k="' + flash + '"]'); if (el) api.fx.pop(el.parentNode.nextElementSibling); }
      }
      ui.data.solve = function (how) { [avalanche(JORDAN.debts), snowball(JORDAN.debts), null].forEach(function (o) { add(o); }); draw(); body.querySelector('#plDone').click(); };
      draw();
    } });
  }

  function init() { return { v: 1, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), ans: {}, typed: {}, story: {}, rounds: {}, plans: [], talk: null, scene: null, finished: false }; }
  function validate(S) { return !!S && S.v === 1 && !!S.typed && !!S.story && !!S.rounds && Array.isArray(S.plans); }

  var HELPS = [
    { id: 'mm9-kinds', who: 'dev', after: 0, pay: 600, label: 'Kinds of credit', ask: 'Card, loan, line of credit… which is which? Can you sort these?', run: async function (api, seed) {
      var r = RNG(seed * 31 + 9); r(); var t = pickN(r, KINDS, 4); var g = await K.sort(api, { title: 'Help Dev: what kind of credit?', name: 'help-sort', leave: true, wide: true, intro: 'Match each one to a kind of credit.', bins: KIND_BINS, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      if (g) await api.say('dev', 'So my phone plan is a kind of credit too. Huh.'); return g; } },
    { id: 'mm9-q', who: 'grandpa', after: 0, pay: 500, label: 'Credit questions', ask: 'Help an old man with a question about credit?', run: async function (api, seed) { return K.askGrade(await api.ask('grandpa', WHO_QS[seed % 2], null)); } },
    { id: 'mm9-int', who: 'avery', after: 1, pay: 800, label: 'One month’s interest', ask: 'How much interest will my card charge this month?', run: async function (api, seed) {
      var t = intTask(seed); var g = await api.calc({ title: 'Help Avery: one month’s interest', name: 'help-int', intro: '<p>Avery owes <b>' + fmtW(t.b) + '</b> at <b>' + rate(t.r) + '</b> a year.</p>', fields: [{ k: 'i', name: 'Interest this month', ans: t.i, hint: fmtW(t.b) + ' × ' + t.r + ' ÷ 12.' }] });
      if (g) await api.say('avery', 'That’s just for one month? I’m paying more than the minimum.'); return g; } },
    { id: 'mm9-min', who: 'jas', after: 1, pay: 800, label: 'The minimum payment', ask: 'What’s the minimum payment on my card? The rule is 2.5% or $10.', run: async function (api, seed) {
      var t = minTask(seed); var g = await api.calc({ title: 'Help Jas: the minimum payment', name: 'help-min', intro: '<p>Jas’s balance is <b>' + fmtW(t.b) + '</b>. The minimum is 2.5% of the balance or $10, whichever is more.</p>', fields: [{ k: 'm', name: 'Minimum payment', ans: t.m, hint: '0.025 × ' + fmtW(t.b) + '. If that’s under $10, it’s $10.' }] });
      if (g) await api.say('jas', 'And paying only that takes years. I’ll pay more.'); return g; } },
    { id: 'mm9-util', who: 'sam', after: 2, pay: 800, label: 'Credit utilization', ask: 'A customer asked about their credit utilization. Can you work it out?', run: async function (api, seed) {
      var t = utilTask(seed); var g = await api.calc({ title: 'Help Sam: credit utilization', name: 'help-util', intro: '<p>Balance <b>' + fmtW(t.b) + '</b>, limit <b>' + fmtW(t.lim) + '</b>.</p>', fields: [{ k: 'u', name: 'Credit utilization (%)', fmt: pFmt, ans: t.u, hint: fmtW(t.b) + ' ÷ ' + fmtW(t.lim) + ', then × 100.' }] });
      if (g) await api.say('sam', t.u > 3000 ? 'That’s high. I’ll suggest paying it down.' : 'Nice and low. Good habit.'); return g; } },
    { id: 'mm9-habit', who: 'librarian', after: 2, pay: 600, label: 'Helps or hurts a score', ask: 'A patron asked which habits help a credit score. Can you sort these?', run: async function (api, seed) {
      var r = RNG(seed * 37 + 13); r(); var t = pickN(r, HABITS.filter(function (x) { return x[1] === 'help'; }), 2).concat(pickN(r, HABITS.filter(function (x) { return x[1] === 'hurt'; }), 2)); t = pickN(r, t, 4);
      var g = await K.sort(api, { title: 'Help Mx. Lin: helps or hurts?', name: 'help-sort', leave: true, intro: 'Does each habit help or hurt a credit score?', bins: GAME_CFGS.score.cfg.bins, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      if (g) await api.say('librarian', 'I’ll make a display. “Pay on time” in very large letters.'); return g; } },
    { id: 'mm9-dti', who: 'worker', after: 3, pay: 800, label: 'Debt-to-income', ask: 'The bank asked for my debt-to-income ratio. What is it?', run: async function (api, seed) {
      var t = dtiTask(seed); var g = await api.calc({ title: 'Help Mo: debt-to-income ratio', name: 'help-dti', intro: '<p>Mo earns <b>' + fmtW(t.inc) + '</b> a month before deductions. His debt payments are <b>' + fmtW(t.pay) + '</b> a month.</p>', fields: [{ k: 'd', name: 'Debt-to-income ratio (%)', fmt: pFmt, ans: t.d, alts: [Math.round(t.d / 10) * 10], hint: fmtW(t.pay) + ' ÷ ' + fmtW(t.inc) + ', then × 100.' }] });
      if (g) await api.say('worker', 'That’s what the bank will look at. Good to know first.'); return g; } },
    { id: 'mm9-payday', who: 'nurse', after: 3, pay: 1000, label: 'Payday loan or line of credit', ask: 'My car needs a repair. Payday loan or my line of credit?', run: async function (api, seed) {
      var t = paydayTask(seed); var g = await api.calc({ title: 'Help Nurse Kaur: compare the cost', name: 'help-payday', intro: '<p>She needs <b>' + fmtW(t.amt) + '</b> for two weeks.</p>', ref: COST_CARD, refLabel: 'Show the tools', fields: [{ k: 'p', name: 'Payday loan cost ($14 per $100)', ans: t.pd, hint: fmtW(t.amt) + ' ÷ 100 × $14.' }, { k: 'l', name: 'Line of credit cost (9.5% a year, 14 days)', ans: t.loc, hint: fmtW(t.amt) + ' × 0.095 × 14 ÷ 365.' }] });
      if (g) await api.say('nurse', 'The line of credit, then. And I’ll start an emergency fund.'); return g; } },
    { id: 'mm9-game', who: 'mayor', after: 2, pay: SCORE_PAY, label: 'An extra Score It round', game: true, ask: 'We’re making a credit poster for the library. Want to sort some habits?', run: async function (api, seed) {
      var r = await api.minigame(scoreOpts(api, seed, true)); return K.gameGrade(r); } }
  ];
  var KIND_BINS = [{ id: 'card', label: 'Credit card', icon: '💳' }, { id: 'loc', label: 'Line of credit', icon: '🏦' }, { id: 'loan', label: 'Loan', icon: '📄' }, { id: 'later', label: 'Pay later', icon: '⏳' }];
  var GOSSIP = [
    { id: 'g-gp-0', who: 'grandpa', after: -1, lines: ['In my day, you borrowed from the bank or you didn’t borrow.', 'Now there’s a shop that gives you cash in 15 minutes. Nothing that fast is cheap.'] },
    { id: 'g-sam-0', who: 'sam', after: -1, lines: ['A student card can build credit, if you pay it off every month.', 'If you don’t, 20.99% adds up fast.'] },
    { id: 'g-avery-0', who: 'avery', after: -1, lines: ['Is “buy now, pay later” free money?', 'Asking because I want very nice headphones.'] },
    { id: 'g-rosa-1', who: 'rosa', after: 0, lines: ['I paid back Quick Cash, and then I was short again. So I borrowed again.', 'It’s only one fee each time. Right?'] },
    { id: 'g-quill-1', who: 'quill', after: 0, lines: ['Quick Cash! Cash in 15 minutes! Borrow $300 today!', 'The fee? You’ll barely notice it.'] },
    { id: 'g-mo-2', who: 'worker', after: 1, lines: ['I borrowed $200 from Quick Cash last month. Paid back $253.', 'Is that normal? It felt like a lot for two weeks.'] },
    { id: 'g-dev-2', who: 'dev', after: 1, lines: ['I paid Quick Cash $95 to borrow $500 for two weeks.', 'Mr. Quill said that’s the legal fee. Is it?'] },
    { id: 'g-mayor-3', who: 'mayor', after: 2, lines: ['Mr. Quill handed out flyers at the market. “Credit Booster: a 900 score in 30 days!”', 'Can anyone really do that?'] },
    { id: 'g-nurse-3', who: 'nurse', after: 2, lines: ['My credit score went up when I set up automatic payments.', 'No magic. Just never late.'] },
    { id: 'g-rosa-4', who: 'rosa', after: 3, lines: ['Quick Cash paid me back $75. The fast-cash fees were never allowed.', 'And I opened a small emergency fund. $20 a payday.'] },
    { id: 'g-mayor-4', who: 'mayor', after: 3, lines: ['The {name} Know-the-Cost Rule: every lender in town posts the full cost in dollars.', 'Before you sign, not after.'] },
    { id: 'g-avery-4', who: 'avery', after: 3, lines: ['I didn’t use “pay later” for the headphones.', 'I saved for six weeks. They sound even better paid for.'] }
  ];
  function gossip(S, api) { return K.gossip(GOSSIP, api); }
  function mailTask(seed, last) {
    var k = mailKind(seed, last), from = 'Ms. Delgado', head = '<p class="ct-small">A letter from Ms. Delgado:</p>';
    if (k === 'int') { var t = intTask(seed); return { label: 'Town Mail: one month’s interest', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: head + '<p>“' + fmtW(t.b) + ' owing at ' + rate(t.r) + '. Interest this month?”</p>', fields: [{ k: 'i', name: 'Interest this month', ans: t.i, hint: 'Balance × rate ÷ 12.' }] }); } }; }
    if (k === 'min') { var m = minTask(seed); return { label: 'Town Mail: a minimum payment', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: head + '<p>“A balance of ' + fmtW(m.b) + '. Minimum: 2.5% or $10, whichever is more?”</p>', fields: [{ k: 'm', name: 'Minimum payment', ans: m.m, hint: '0.025 × the balance, at least $10.' }] }); } }; }
    if (k === 'util') { var u = utilTask(seed); return { label: 'Town Mail: credit utilization', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: head + '<p>“' + fmtW(u.b) + ' used of a ' + fmtW(u.lim) + ' limit. Utilization?”</p>', fields: [{ k: 'u', name: 'Utilization (%)', fmt: pFmt, ans: u.u, hint: 'Balance ÷ limit × 100.' }] }); } }; }
    if (k === 'dti') { var d = dtiTask(seed); return { label: 'Town Mail: debt-to-income', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: head + '<p>“Income ' + fmtW(d.inc) + ' a month, debt payments ' + fmtW(d.pay) + '. Ratio?”</p>', fields: [{ k: 'd', name: 'Debt-to-income (%)', fmt: pFmt, ans: d.d, alts: [Math.round(d.d / 10) * 10], hint: 'Payments ÷ income × 100.' }] }); } }; }
    if (k === 'payday') { var p = paydayTask(seed); return { label: 'Town Mail: a payday loan’s cost', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: head + '<p>“Borrowing ' + fmtW(p.amt) + ' for two weeks. Most a payday loan can cost?”</p>', fields: [{ k: 'p', name: 'Payday cost ($14 per $100)', ans: p.pd, hint: 'Amount ÷ 100 × $14.' }] }); } }; }
    return { label: 'Town Mail: a credit question', from: from, pay: 500, run: function (api) { return api.ask('grandpa', WHO_QS[seed % WHO_QS.length], null).then(K.askGrade); } };
  }

  function chapterSteps(ch, S, api) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the Community Centre and meet Ms. Delgado, the credit counsellor', 'delgado');
        await api.say('delgado', ['Hi! I’m Ms. Delgado. I help people make sense of their debts, for free.', 'Every case is a little mystery: what’s owed, what it costs, and the way out.']);
        var o = ['“Cash in 15 minutes! Borrow $300 today!”', '“Build your credit with a student card.”', 'Neither, until I know what each one costs'];
        var i = await api.choose('delgado', 'Two signs on Main Street. Which would you trust more?', o);
        S.typed.entry = o[i];
      }));
      a.push(step('hunch', async function (api, S) { // the side story starts, before the skill
        S.story.rosaIn = 1; S.story.quillOut = 1; api.refresh();
        await api.quest('Rosa waved at you from Quick Cash. Go see her.', 'rosa');
        await api.say('rosa', ['My car needs a $300 repair, and I need it for work on Monday.', 'Mr. Quill says I can have the cash in 15 minutes!']);
        await api.say('quill', ['Fifteen minutes! No credit check! Just sign here.', 'The fee? Small. You’ll barely notice it.']);
        await api.say('you', ['I don’t know enough about loans yet to tell you if this is a good deal.', 'Ms. Delgado is about to teach me. Can you wait?']);
        await api.say('rosa', 'I can’t wait. Monday is Monday. I’m signing.');
        S.story.rosa1 = 1; api.give('Case file', '🔎', 'rosa'); api.save(); api.refresh();
      }));
      a.push(step('kinds', async function (api, S) {
        await api.quest('Back to Ms. Delgado: kinds of credit', 'delgado');
        await api.say('delgado', ['Debt is money you borrowed and must pay back, usually with interest. Credit is the ability to borrow.', 'At 18, the offers start: cards, phone financing, “buy now, pay later,” loans.']);
        await K.sort(api, { title: 'What kind of credit?', name: 'kinds', story: true, key: 'q-kinds', label: 'Kinds of credit', ch: 0, wide: true, intro: 'Match each one to a kind of credit.', bins: KIND_BINS, items: KINDS.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      }));
      a.push(step('jordan1', async function (api, S) {
        await api.quest('Open Jordan’s case with Ms. Delgado', 'delgado');
        await api.say('delgado', 'Our first case: Jordan, 22. Three debts. Let’s list them.');
        var g = await api.calc({ title: 'Jordan’s debts', name: 'jordan1', noPay: true, intro: caseHTML(), fields: [{ k: 'b', name: 'Total owing', ans: JORDAN.debts.reduce(function (s, x) { return s + x.b; }, 0), hint: '$2,400 + $600 + $3,000.' }, { k: 'm', name: 'Total minimums each month', ans: minTotal(JORDAN.debts), hint: '$60 + $50 + $60.', net: 1 }] });
        api.record('q-jordan1', 'Jordan’s debts: total owing and minimums', 0, g === 'first');
        await api.ask('delgado', { text: 'Which of Jordan’s debts hurts most?', opts: [['The credit card: the highest rate, and almost at its limit.', 1, 'Right. 20.99%, and $2,400 of $2,500 used.'], ['The phone: it’s 0%.', 0, '0% costs nothing extra. It’s the gentlest one.'], ['The line of credit, because it’s the biggest.', 0, 'Biggest, but at 9.5%, less than half the card’s rate.']] }, 'q-hurts', 'Which debt hurts most', 0);
      }));
      a.push(step('rosaq', async function (api, S) { // the hunch, checked with this chapter's skill
        await api.quest('Rosa is back. She has a question.', 'rosa');
        await api.say('rosa', ['I got the $300. The car is fixed!', 'But I never asked Mr. Quill much. What should I have asked first?']);
        await api.ask('rosa', { text: 'What should I ask before I borrow?', opts: [['What will it cost in total? Can I pay it back on time? Do I really need it now?', 1, 'The total cost… I never asked that.'], ['How fast can I get it?', 0, 'Fast is what he sold. Cost is what matters.'], ['Nothing. A loan is a loan.', 0, 'Loans can cost very different amounts.']] }, 'story-rosaq', 'Rosa: questions before borrowing', 0);
        await api.say('rosa', ['The paper says “Total cost: $67.” For two weeks. Is that a lot?', 'I really don’t know.']);
        await api.say('you', 'Next class is about the cost of borrowing. I’ll find out.');
        S.story.rosa2 = 1; api.toast('Added to your Case file: Rosa’s loan'); api.save();
      }));
      a.push(step('end1', async function (api, S) {
        await api.quest('Check in with Ms. Delgado', 'delgado');
        await api.say('delgado', ['Now do Step 1 of your project: list your client’s debts.', 'Next time: what those debts really cost.']);
      }));
    }
    if (ch === 1) {
      a.push(step('cost', async function (api, S) {
        await api.quest('Ms. Delgado wants to show you what debt costs', 'delgado');
        await api.say('delgado', ['One month’s interest = balance × rate ÷ 12. Let’s do Jordan’s three debts.']);
        var d = JORDAN.debts, ints = d.map(function (x) { return monthInt(x.b, x.r); });
        var g = await api.calc({ title: 'One month’s interest', name: 'cost', noPay: true, ref: caseHTML(), refLabel: 'Show Jordan’s case', fields: d.map(function (x, i) { return { k: x.id, name: x.name, sub: fmtW(x.b) + ' × ' + rate(x.r) + ' ÷ 12', ans: ints[i], hint: fmtW(x.b) + ' × ' + x.r + ' ÷ 12.' }; }).concat([{ k: 't', name: 'Total interest this month', ans: ints.reduce(function (s, x) { return s + x; }, 0), hint: 'Add the three.', net: 1 }]) });
        api.record('q-cost', 'One month’s interest on each debt', 1, g === 'first');
      }));
      a.push(step('trap', async function (api, S) {
        await api.quest('Sam from the bank has a story about minimum payments', 'sam');
        await api.say('sam', ['I had $1,000 on a card at 20.99%. Minimum: 2.5% of the balance or $10.', 'I stopped using the card and paid only the minimum. Guess how long it took.']);
        var A = samMin(100000), B = samMin(100000, 10000);
        var g = await api.calc({ title: 'The minimum-payment trap', name: 'trap', noPay: true, intro: '<div class="ck-bar"><span>Minimum only</span><div class="ct-track"><div class="ck-barfill" style="background:#b91c1c;transform:scaleX(1)"></div></div><span class="v">' + A.months + ' months</span><span>$100 a month</span><div class="ct-track"><div class="ck-barfill" style="background:#16a34a;transform:scaleX(' + (B.months / A.months).toFixed(3) + ')"></div></div><span class="v">' + B.months + ' months</span></div><p>Interest paid: minimum only <b>' + fmt(A.interest) + '</b>; $100 a month <b>' + fmt(B.interest) + '</b>.</p>',
          fields: [{ k: 'i', name: 'First month’s interest on $1,000', ans: monthInt(100000, 0.2099), hint: '$1,000 × 0.2099 ÷ 12.' }, { k: 's', name: 'Interest saved by paying $100 a month', ans: A.interest - B.interest, alts: [150500], hint: fmt(A.interest) + ' − ' + fmt(B.interest) + '.', net: 1 }] });
        api.record('q-trap', 'The minimum-payment trap', 1, g === 'first');
        await api.ask('sam', { text: 'A student says: “As long as I pay the minimum, I’m keeping up.” What’s wrong with that?', opts: [['Most of each minimum is interest. $1,000 took 15 years and cost more than $1,000 in interest.', 1, 'Fifteen years. I was keeping up with the bank’s profits.'], ['Nothing. The minimum is enough.', 0, 'It keeps the account in good standing, but barely moves the debt.'], ['The minimum gets bigger every month.', 0, 'It gets smaller as the balance shrinks. That’s why it takes so long.']] }, 'q-keepup', 'Minimum payments: “keeping up”?', 1);
      }));
      a.push(step('rosa2', async function (api, S) { // clue: three loans in a row
        await api.quest('Rosa has her Quick Cash receipts. Take a look.', 'rosa');
        await api.say('rosa', ['I paid back the $300 plus $67. Then I was short for rent, so I borrowed again. Then again.', 'Three loans, three paydays in a row.']);
        var g = await api.calc({ title: 'What Rosa’s loans cost', name: 'rosacost', noPay: true, intro: '<p>Three Quick Cash loans of <b>$300</b>, two weeks each. Total cost each time: <b>$67</b>.</p>', fields: [{ k: 'f', name: 'Total Rosa paid in fees', ans: ROSA.loans * charged(ROSA.amt), hint: '3 × $67.' }, { k: 'c', name: 'One month’s interest on $300 on a 20.99% card', ans: monthInt(ROSA.amt, 0.2099), hint: '$300 × 0.2099 ÷ 12.' }] });
        api.record('story-rosacost', 'Rosa’s loans: the fees vs. a card', 1, g === 'first');
        await api.say('you', ['You paid ' + fmt(ROSA.loans * charged(ROSA.amt)) + ' in six weeks, and you still owe $300.', 'Even a 20.99% card would cost about ' + fmt(monthInt(ROSA.amt, 0.2099)) + ' a month. Paying the loan back leaves you short, so you borrow again.']);
        await api.say('rosa', 'A cycle. I’m stuck in a cycle.');
        S.story.cycle = 1; api.toast('Added to your Case file: the cycle'); api.save();
      }));
      a.push(step('end2', async function (api, S) {
        await api.quest('Tell Ms. Delgado about Rosa', 'delgado');
        await api.say('delgado', ['$67 for two weeks on $300? Hmm. Keep that receipt. We’ll come back to it.', 'Now do Step 2 of your project: what your client’s debts cost.', 'Next time: credit scores.']);
      }));
    }
    if (ch === 2) {
      a.push(step('score', async function (api, S) {
        await api.quest('Ms. Delgado wants to talk about credit scores', 'delgado');
        await api.say('delgado', ['A credit score runs from 300 to 900. Lenders use it to decide whether to lend to you, and at what rate.', 'Five things shape it: payment history, utilization, length of history, types of credit, and new applications.']);
        await K.sort(api, { title: 'Jordan’s credit check', name: 'factors', story: true, key: 'q-factors', label: 'Jordan’s score: helping or hurting', ch: 2, ref: caseHTML(), refLabel: 'Show Jordan’s case', intro: 'Is each one helping or hurting Jordan’s score?', bins: [{ id: 'help', label: 'Helping', icon: '📈' }, { id: 'hurt', label: 'Hurting', icon: '📉' }],
          items: [['Late on the credit card twice this year', 'hurt', 'Payment history matters most.'], ['Using $2,400 of a $2,500 limit', 'hurt', 'That’s 96% utilization.'], ['A card, a line of credit and financing, all open', 'help', 'A mix of credit, used well, helps.'], ['No new credit applications this year', 'help', 'Few applications look steady.']].map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
        var g = await api.calc({ title: 'Credit utilization', name: 'util', noPay: true, intro: '<p>Utilization = balance ÷ limit.</p>', fields: [{ k: 'j', name: 'Jordan: $2,400 of $2,500', fmt: pFmt, ans: pct(240000, 250000), hint: '2,400 ÷ 2,500 × 100.' }, { k: 'm', name: 'Morgan: $300 of $2,000', fmt: pFmt, ans: pct(30000, 200000), hint: '300 ÷ 2,000 × 100.' }] });
        api.record('q-util', 'Credit utilization', 2, g === 'first');
        await api.ask('delgado', WHO_QS[2], 'q-nocredit', 'Avoiding credit: a great score?', 2);
      }));
      a.push(step('flyer', async function (api, S) { // the source: Mr. Quill's flyer
        await api.quest('Mr. Quill is handing out flyers at Quick Cash. Take a look.', 'quill');
        await api.say('quill', ['Bad credit? Quick Cash has a NEW service: the Credit Booster!']);
        await K.inspect(api, { title: 'The Credit Booster flyer', name: 'flyer', story: true, key: 'story-flyer', label: 'The Credit Booster: what is wrong', ch: 2, find: 'Find the 4 problems', cols: 3,
          intro: 'Tap every line that is false, or that would hurt a credit score.',
          spots: [{ id: 'erase', icon: '🧽', label: '“We erase late payments from your report!”', bad: true, why: 'True late payments stay on a credit report. No one can erase them for a fee.', hint: 'Can anyone remove true information?' }, { id: 'apply', icon: '📝', label: '“Apply for 5 cards this week to build credit fast!”', bad: true, why: 'Many applications at once can lower a score.' },
            { id: 'max', icon: '💳', label: '“Max out your cards to show you use credit!”', bad: true, why: 'High utilization hurts a score.' }, { id: 'guar', icon: '💯', label: '“A 900 score in 30 days, guaranteed! Only $99”', bad: true, why: 'Scores build slowly, from good habits. No one can guarantee one.' },
            { id: 'ontime', icon: '⏰', label: '“Pay your bills on time”', fine: 'True! It’s the most important habit.' }, { id: 'report', icon: '🔍', label: '“Check your credit report”', fine: 'True! You can check it for free.' }] });
        await api.say('quill', ['Well. The Booster is… still in development. Excuse me.']);
        await api.say('rosa', ['Look, my receipt. “Fee: $14 per $100.” Then a “fast-cash fee,” $25. I didn’t see that part.', 'Is that extra fee even allowed?']);
        S.story.flyer = 1; api.toast('Added to your Case file: the flyer and the fast-cash fee'); api.save();
      }));
      a.push(step('rnd3', async function (api, S) {
        await api.quest('Ms. Delgado is making a credit-habits poster. Help her sort.', 'delgado');
        await scoreRound(api, S, 'ch3', 3);
        await api.say('delgado', ['Now do Step 3 of your project: your client’s credit score check.', 'Next time: the plan. And we look at that receipt.']);
      }));
    }
    if (ch === 3) {
      a.push(step('tools', async function (api, S) {
        await api.quest('Ms. Delgado has two more tools for you', 'delgado');
        await api.say('delgado', ['Debt-to-income: monthly debt payments ÷ gross monthly income. Lenders look at it.', 'And payday loans: in Alberta they can cost up to $14 per $100 for about two weeks. That’s the total cost, fees included. $42 on $300 is about 364% a year.']);
        var g = await api.calc({ title: 'Jordan: ratio and the car repair', name: 'tools', noPay: true, ref: COST_CARD, refLabel: 'Show the tools', intro: caseHTML(),
          fields: [{ k: 'd', name: 'Debt-to-income ratio', sub: '$170 ÷ $3,000', fmt: pFmt, ans: pct(minTotal(JORDAN.debts), JORDAN.income), alts: [570], hint: '170 ÷ 3,000 × 100.' }, { k: 'p', name: 'Payday loan for the $300 repair (2 weeks)', ans: paydayMax(30000), hint: '$300 ÷ 100 × $14.' }, { k: 'l', name: 'Line of credit for the $300 repair (2 weeks, 9.5%)', ans: locCost(30000, 0.095, 14), hint: '$300 × 0.095 × 14 ÷ 365.' }] });
        api.record('q-tools', 'Debt-to-income and the car repair', 3, g === 'first');
      }));
      a.push(step('plan', async function (api, S) {
        await api.quest('Build Jordan’s repayment plan', 'delgado');
        await api.say('delgado', ['Avalanche: extra money to the highest rate first. Snowball: to the smallest balance first.', 'Try both. Try your own order too. Then compare.']);
        await planPanel(api, S);
        var A = planOf(avalanche(JORDAN.debts)), B = planOf(snowball(JORDAN.debts)), M = planOf(null);
        var g = await api.calc({ title: 'Compare the plans', name: 'compare', noPay: true, intro: K.table([['Avalanche (card first)', A.months + ' months', fmt(A.interest)], ['Snowball (phone first)', B.months + ' months', fmt(B.interest)], ['Minimums only', M.months + ' months', fmt(M.interest)]], ['Plan', 'Debt-free in', 'Interest']),
          fields: [{ k: 'a', name: 'Avalanche saves vs. snowball', ans: B.interest - A.interest, hint: fmt(B.interest) + ' − ' + fmt(A.interest) + '.' }, { k: 'm', name: 'Avalanche saves vs. minimums only', ans: M.interest - A.interest, hint: fmt(M.interest) + ' − ' + fmt(A.interest) + '.', net: 1 }] });
        api.record('q-compare', 'Avalanche, snowball and minimums', 3, g === 'first');
        await K.pick(api, { id: 'method', title: 'Our advice for Jordan', name: 'pickmethod', intro: 'Both plans take 17 months and save over $1,100 compared with minimums only.', options: [{ k: 'avalanche', title: 'Avalanche', icon: '🏔️', lines: [['First', 'Credit card (20.99%)'], ['Interest', fmt(A.interest)]] }, { k: 'snowball', title: 'Snowball', icon: '⛄', lines: [['First', 'Phone ($600)'], ['Interest', fmt(B.interest)], ['First win', 'Month ' + B.off.phone]] }],
          reasonPrompt: 'Why? Use cost and motivation.' });
      }));
      a.push(step('proof', async function (api, S) { // the hero beat: prove the fast-cash fee broke the cap
        await api.quest('Check Rosa’s receipt against the payday rule', 'rosa');
        var o = { title: 'Rosa’s Quick Cash receipt', name: 'receipt', story: true, key: 'story-receipt', label: 'Rosa’s receipt: the fast-cash fee', ch: 3, ref: COST_CARD, refLabel: 'Show the tools', intro: '<p>The rule: the total cost of a payday loan can be at most <b>$14 per $100</b>, fees included. Dispute the line that breaks it, or sign if it’s all fine.</p>',
          head: '<b>QUICK CASH · Loan receipt</b><span>Rosa · due in 2 weeks</span>', rows: [{ k: 'amt', name: 'Borrowed', val: fmtW(ROSA.amt) }, { k: 'fee', name: 'Fee: $14 per $100', val: fmt(paydayMax(ROSA.amt)) }, { k: 'fast', name: 'Fast-cash fee', sub: 'for getting it in 15 minutes', val: fmt(ROSA.fast) }, { k: 'tot', name: 'Total to repay', val: fmt(ROSA.amt + charged(ROSA.amt)), tone: 'net' }],
          root: 'fast', follows: { tot: true }, explain: { amt: 'Rosa borrowed $300. That’s right.', fee: '$300 ÷ 100 × $14 = $42. That’s the most allowed.' }, rightLine: function () { return 'The $14 per $100 is already the most it can cost. A $25 fee on top breaks the cap.'; }, signLabel: 'Sign: it’s fine', disputeLabel: 'Dispute this line' };
        await K.check(api, o);
        var g = await api.calc({ title: 'Every receipt, proven', name: 'proof', noPay: true, ref: COST_CARD, refLabel: 'Show the tools', intro: '<p>Mo and Dev brought their receipts too. Each one has the same $25 fast-cash fee.</p>' + RECEIPTS.map(function (x) { return receiptHTML(x.name, x.amt); }).join(''),
          fields: RECEIPTS.map(function (x) { return { k: x.who, name: x.name + ': the most Quick Cash could charge', ans: paydayMax(x.amt), hint: fmtW(x.amt) + ' ÷ 100 × $14.' }; }).concat([{ k: 't', name: 'Total overcharged', sub: 'Rosa’s 3 loans + Mo + Dev, $25 each', ans: overTotal(), hint: '5 × $25.', net: 1 }]) });
        api.record('story-proof', 'Proving the overcharges', 3, g === 'first');
        await api.quest('Take the proof to Councillor Wright at Town Hall', 'mayor');
        await api.say('mayor', ['Five receipts. Each one over the legal limit by $25. That’s ' + fmt(overTotal()) + '.', 'Mr. Quill will refund every dollar.']);
        S.story.proof = 1; api.save();
        await K.hero(api, { who: 'mayor', lines: ['And from now on, every lender in town posts the full cost in dollars, before anyone signs.', 'We’ll call it the ' + api.profile.name + ' Know-the-Cost Rule.'],
          medal: 'Debt Detective badge', icon: '🔎', kicker: 'Case closed', title: 'The ' + api.profile.name + ' Know-the-Cost Rule', thanks: [['rosa', 'My $75 came back. It’s the start of my emergency fund.']], reply: ['Thanks! Ask what it costs. Every time.'] });
        S.story.hero = 1; S.story.quillOut = 0; api.refresh();
      }));
      a.push(step('talk', async function (api, S) { // the goal: the Grade 8 Debt Talk
        S.scene = 'talk'; api.refresh();
        await api.quest('Go to the School for the Grade 8 Debt Talk', 'delgado');
        api.fx.face('all');
        await api.say('delgado', ['Welcome to “What we wish we knew about debt.” Grade 8s, ask our Debt Detective anything.']);
        if (!S.talk) S.talk = { got: 0, asked: {} };
        var Qs = [
          ['q-talk-min', 'g8lily', { text: 'If I just pay the minimum on my card, I’m fine, right?', opts: [['Not really. $1,000 at the minimum took about 15 years and $1,614 in interest.', 1, 'Fifteen YEARS? Okay. Pay more.'], ['Yes, the minimum is the safe choice.', 0, 'Safe for the account, costly for you.'], ['Only if the minimum is $10.', 0, 'It’s about the interest, not the size.']] }],
          ['q-talk-score', 'g8omar', { text: 'Should I avoid credit so my score stays perfect?', opts: [['No history can mean no score. Use one card lightly and pay it in full every month.', 1, 'So, a little credit, used well.'], ['Yes. No credit, perfect score.', 0, 'Lenders need a history to judge.'], ['Get five cards at once instead.', 0, 'Many applications can lower a score.']] }],
          ['q-talk-fast', 'g8zoe', { text: 'I need $300 fast. Payday loan or line of credit?', opts: [['A line of credit: about $1 for two weeks, not $42. Better still, an emergency fund.', 1, 'Forty times cheaper. Got it.'], ['A payday loan. It’s fastest.', 0, 'Fast costs $42 here, and the cycle is real.'], ['Borrow from three payday shops.', 0, 'That’s how the cycle starts.']] }],
          ['q-talk-plan', 'g8ben', { text: 'Avalanche or snowball, which is better?', opts: [['Both beat minimums. Avalanche costs least; snowball gives a quick win. Pick one and stick with it.', 1, 'Pick one and stick with it. Nice.'], ['Snowball always costs less.', 0, 'For Jordan it cost about $57 more.'], ['Neither; pay minimums on everything.', 0, 'Minimums took 46 months and $1,712.']] }]
        ];
        for (var i = 0; i < Qs.length; i++) {
          var q = Qs[i]; if (S.talk.asked[q[0]]) continue;
          var r = await api.ask(q[1], q[2], q[0], 'Grade 8 Debt Talk: ' + q[2].text, 3);
          S.talk.asked[q[0]] = 1; if (r.first) { S.talk.got++; api.fx.rise(q[1], '+1'); }
          api.save(); api.hud();
        }
        S.win = S.talk.got >= POINTS_TO_WIN; api.save();
        await api.say('delgado', S.win ? 'Every Grade 8 left with an answer they can use. Great talk.' : 'A good talk! A few answers need work. You can replay this chapter from the Menu.');
        S.scene = null; api.refresh();
      }));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and pin your credit plan to your My Plan wall', 'myplan');
        await K.typed(api, { id: 'rules', title: 'My credit rules from 18', prompt: 'Write your three credit rules from age 18. Add why for one of them.', min: 20, rows: 4 });
        var firstTime = !S.finished; S.finished = true;
        if (firstTime) api.profileAdd('closet', 'detective');
        api.profileAdd('plan', { mission: '9-money-management', title: 'Debt Detective', text: 'Jordan: ' + (S.typed.method ? S.typed.method.pick : '—') + '. My rules: ' + String(S.typed.rules || '—').slice(0, 140) });
        api.profileAdd('finished', '9-money-management'); api.refresh();
        await api.say('you', ['At the start I trusted: ' + (S.typed.entry || '—') + '.', 'Now I ask what it costs in dollars, every time.']);
        await api.say('delgado', [S.win ? 'Case closed, and a rule named after you!' : 'Case closed! Next time, answer every Grade 8.', 'Your closet has a new detective coat, and your My Plan wall has a new page.', 'Now do Step 4 of your project: your client’s plan.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }

  var KIDS = { g8lily: ['Lily', { base: 1, skin: 's3', hair: 'black', shirt: 'pink', pants: '#3b3f5c' }], g8omar: ['Omar', { base: 0, skin: 's4', hair: 'black', shirt: 'blue', pants: '#2f2f38' }], g8zoe: ['Zoe', { base: 3, skin: 's1', hair: 'ginger', shirt: 'green', pants: '#3b3f5c' }], g8ben: ['Ben', { base: 2, skin: 's2', hair: 'brown', shirt: 'orange', pants: '#2f2f38' }] };
  T.mission({
    id: '9-money-management', unitLabel: 'CEFL Grade 9 · Money, Interest and Credit · Project: Debt Detective', title: 'Debt Detective: The 15-Minute Loan',
    iCan: 'I can work out what debt costs, check a credit score, compare avalanche and snowball, and spot a predatory loan.',
    foot: 'This is a model. Jordan’s debts and the 9.5% rate are samples; card terms are typical. Payday rule: up to $14 per $100 (Alberta). The people and businesses are made up.',
    bagTip: 'Your Bag holds what you collect: Jordan’s case, your tools card and your Case file.',
    realRule: 'Real gives no hints, and the Grade 8s still need 3 good answers', afterLine: 'Mission complete. Open Menu → Report to show your teacher.',
    chapters: [
      { name: 'The debts', step: 'Step 1', moment: 'Moment 1: debt and credit' },
      { name: 'The cost', step: 'Step 2', moment: 'Moment 2: the minimum-payment trap' },
      { name: 'Credit score check', step: 'Step 3', moment: 'Moment 3: your credit score' },
      { name: 'The plan', step: 'Step 4', moment: 'Moment 4: getting out of debt, and avoiding traps' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps, guide: 'delgado',
    helpers: function () { return HELPS; }, gossip: gossip, mail: function (S, seed, last) { return mailTask(seed, last); },
    outfit: function (S) { return S.finished ? 'detective' : 'none'; },
    placeObjects: function (api) { api.place('table', 'home', 4, 3, { label: 'Kitchen table' }); api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true }); },
    people: function (S) {
      var out = {}, s = S.story, talk = S.scene === 'talk';
      out.delgado = { name: 'Ms. Delgado', role: 'Credit counsellor', map: talk ? 'school' : 'community', x: 4, y: 3, dir: 'down', look: { base: 3, skin: 's3', hair: 'black', shirt: 'purple', pants: '#2f2f38' } };
      out.quill = { name: 'Mr. Quill', role: 'Quick Cash', map: 'quickcash', x: 4, y: 3, dir: 'down', look: { base: 2, skin: 's2', hair: 'grey', shirt: 'red', pants: '#2f2f38' }, hidden: !s.quillOut };
      if (s.rosaIn && !s.proof) out.rosa = { map: 'quickcash', x: 6, y: 3, dir: 'left', wander: 0 }; // at Quick Cash until the proof
      Object.keys(KIDS).forEach(function (k, i) { out[k] = { name: KIDS[k][0], role: 'Grade 8', map: 'school', x: [1, 3, 5, 7][i], y: 3, dir: 'down', look: KIDS[k][1], hidden: !talk }; });
      return out;
    },
    doorOpen: function (id) { return !!{ home: 1, grandpa: 1, community: 1, quickcash: 1, bank: 1, library: 1, townhall: 1, school: 1, hospital: 1 }[id]; },
    lockedLine: function (id) { return T.world.building(id).name + ' is closed right now.'; },
    talk: function (id, S, api) {
      var s = S.story, done = S.finished;
      var lines = {
        delgado: done ? 'Ask what it costs, in dollars. Every time.' : 'Your next goal is on the gold line at the top.',
        quill: 'Quick Cash! Cash in 15 minutes! Fees… apply.',
        rosa: s.hero ? 'My emergency fund: $95 and growing.' : s.cycle ? 'Three loans in a row. I need a way out.' : s.rosa1 ? 'The car runs! The fee was “small,” he said.' : 'Hi neighbour!',
        worker: s.hero ? 'Quick Cash refunded my $25. Know the cost!' : 'Hard hats on!', dev: s.hero ? 'Refunded! The fast-cash fee was never allowed.' : 'Paid $95 to borrow $500. That’s normal, right?',
        sam: 'Pay the full balance and a card costs nothing. Pay the minimum and it costs years.', grandpa: 'Nothing that fast is cheap.', avery: 'Pay later still means pay.',
        g8lily: 'Paying the minimum is fine, right?', g8omar: 'Is no credit the best credit?', g8zoe: 'What if I need money fast?', g8ben: 'Avalanche? Snowball? Is this about winter?',
        table: 'The kitchen table. Good for paperwork.',
        myplan: K.planLine(api)
      };
      return lines[id] || null;
    },
    hud: function (S) {
      var out = [{ label: 'Case', value: 'Jordan' }];
      if (S.typed.method) out.push({ label: 'Plan', value: S.typed.method.pick === 'avalanche' ? 'Avalanche' : 'Snowball' });
      if (S.talk) out.push({ label: 'Grade 8s', value: S.talk.got + ' / 4', title: '3 good answers at the Debt Talk' });
      return out;
    },
    items: function (S) {
      var it = [{ name: 'Jordan’s case', icon: '🗂️', note: 'The brief’s case (sample)', view: caseHTML }, { name: 'Tools card', icon: '🧮', note: 'Interest, utilization, ratio, payday', view: function () { return COST_CARD; } }];
      if (S.story.rosa1) it.push({ name: 'Case file', icon: '🔎', note: 'The 15-minute loan', view: function () { return K.notes(notes(S)); } });
      if (S.story.hero) it.push({ name: 'Debt Detective badge', icon: '🔎', note: 'The ' + T.api.profile.name + ' Know-the-Cost Rule', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🔎</p><p style="text-align:center"><b>Debt Detective</b><br>Ask what it costs, in dollars. Every time.</p>'; } });
      return it;
    },
    report: function (S) {
      var h = '<p>Case: <b>Jordan</b>' + (S.typed.method ? ' · Advice: <b>' + S.typed.method.pick + '</b>' : '') + (S.finished ? ' · Grade 8 Debt Talk: <b>' + S.talk.got + ' of 4</b> (' + (S.win ? 'every student helped' : 'goal not reached') + ')' : '') + '</p>';
      h += '<p>First answer, which sign to trust: ' + esc(S.typed.entry || '—') + '.</p>';
      if (S.plans.length) h += '<h3>Plans tried</h3>' + K.table(S.plans.map(function (t) { return [esc(orderName(t.order)), t.months + ' months', fmt(t.interest)]; }), ['Plan', 'Debt-free in', 'Interest']);
      var rd = Object.keys(S.rounds); if (rd.length) h += '<h3>Score It</h3>' + K.table(rd.map(function (k) { var x = S.rounds[k]; return ['Chapter 3', String(x.score), K.TIER_WORD[x.tier]]; }), ['When', 'Score', 'Result']);
      h += K.wrote(S, [['method', 'Avalanche or snowball for Jordan', function (k) { return k; }], ['rules', 'My credit rules from 18']]);
      h += '<h3>The 15-minute loan</h3><p>' + (S.story.hero ? 'Solved: proved every Quick Cash receipt broke the $14-per-$100 cap; the town got refunds and a rule named after them.' : S.story.flyer ? 'Found the Credit Booster’s problems.' : S.story.rosa1 ? 'Collecting clues.' : 'Not started.') + '</p>';
      return h;
    },
    test: { scenes: [null, { story: { rosaIn: 1, quillOut: 1 } }, { scene: 'talk' }], sim: sim, planOf: planOf, avalanche: avalanche, snowball: snowball, JORDAN: JORDAN, monthInt: monthInt, minPay: minPay, samMin: samMin, pct: pct, paydayMax: paydayMax, locCost: locCost, ROSA: ROSA, RECEIPTS: RECEIPTS, overTotal: overTotal, GAME_CFGS: GAME_CFGS, intTask: intTask, minTask: minTask, utilTask: utilTask, dtiTask: dtiTask, paydayTask: paydayTask, mailTask: mailTask, HELPS: HELPS, GOSSIP: GOSSIP }
  });
  function notes(S) {
    var s = S.story, li = [];
    if (s.rosa1) li.push('<b>Rosa:</b> borrowed $300 at Quick Cash for a car repair. Mr. Quill said the fee was “small.”');
    if (s.rosa2) li.push('<b>Rosa’s paper:</b> “Total cost: $67” for two weeks.');
    if (s.cycle) li.push('<b>The cycle:</b> three loans in a row, ' + fmt(ROSA.loans * charged(ROSA.amt)) + ' in fees, and she still owes $300. A card would cost about ' + fmt(monthInt(ROSA.amt, 0.2099)) + ' a month.');
    if (s.flyer) li.push('<b>The Credit Booster:</b> “erase late payments,” “apply for 5 cards,” “max out,” “900 guaranteed.” All false or harmful. And Rosa’s receipt has a $25 fast-cash fee on top of $14 per $100.');
    if (s.proof) li.push('<b>Proof:</b> five receipts, each $25 over the cap. ' + fmt(overTotal()) + ' refunded.');
    if (s.hero) li.push('<b>The ' + esc(T.api.profile.name) + ' Know-the-Cost Rule:</b> every lender posts the full cost in dollars, before you sign.');
    return li;
  }
})();
