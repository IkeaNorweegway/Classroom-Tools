/* CEFL Town mission: Grade 8 Income and Tax — "Job Offer Showdown" (companion to the project Job Offer Showdown). LO 8-IT.
   Four chapters, one after each project step: Tax brackets · Three ways to tax (progressive, flat, regressive) · Total compensation ·
   Taxes and the social contract (decide). Sam, the bank teller, is finishing college and has two job offers. You advise him.
   Model (MODEL START … END, no DOM): 2026 federal brackets (14% to $58,523; 20.5% to $117,045; 26%; 29%; 33%) and the basic
   personal credit ($2,303.28); 2026 Alberta (8% to $61,200; 10% to $154,259) and its credit ($1,821.52). Tax = bracket tax − the
   credit (income tax only, as in the workbook). Sam's offers from the brief: A $45,000 salary only; B $42,000 + $2,500 benefits +
   a 4% RRSP match. Goal: Sam takes your advice (at least 3 of 4 first-try answers). The Bracket Blitz game (kit quickPick) counts
   right answers; it never changes the goal.
   Side story, "The bracket myth": Mo turned down a raise because the TaxZapper app said it would cost him money (Ch 1) → the app's
   screen taxes ALL his income at 20.5% (Ch 2) → it also forgets the basic personal credit (Avery) and compares offers by salary
   only (Sam); Zane, who made it, thinks "find your bracket and multiply everything" (Ch 3) → at the Tax Forum you prove each
   mistake and fix the app; Mo takes his raise, and the app's new slice view is named after you (Ch 4).
   Between lessons (HELP START … HELP END): townspeople's own tax questions, an extra Bracket Blitz, and Town Mail.
   Simplifications: income tax only (no CPP, EI or other credits); Alberta's top brackets are beyond this unit; benefit values are samples. */
(function () {
  'use strict';

/* MODEL START ── no DOM. Money in cents. ── */
var FED = [[5852300, 0.14], [11704500, 0.205], [18144000, 0.26], [25848200, 0.29], [Infinity, 0.33]], FED_CREDIT = 230328; // 2026: 14% × $16,452
var AB = [[6120000, 0.08], [15425900, 0.10], [Infinity, 0.12]], AB_CREDIT = 182152;                                   // 2026: 8% × $22,769
function bracketTax(inc, br) { var t = 0, lo = 0, i; for (i = 0; i < br.length && inc > lo; i++) { var top = Math.min(inc, br[i][0]); t += Math.round((top - lo) * br[i][1]); lo = br[i][0]; } return t; }
function slices(inc, br) { var out = [], lo = 0, i; for (i = 0; i < br.length && inc > lo; i++) { var top = Math.min(inc, br[i][0]); out.push({ from: lo, to: top, rate: br[i][1], tax: Math.round((top - lo) * br[i][1]) }); lo = br[i][0]; } return out; }
function fedTax(inc) { return Math.max(0, bracketTax(inc, FED) - FED_CREDIT); }
function abTax(inc) { return Math.max(0, bracketTax(inc, AB) - AB_CREDIT); }
function incomeTax(inc) { return fedTax(inc) + abTax(inc); }
function flatTax(inc, rate) { return Math.round(inc * rate); }
var OFFERS = { // the brief's offers; benefit values are samples
  A: { salary: 4500000, benefits: 0, rrspPct: 0, bonus: 0, vacation: '2 weeks', commute: '10 minutes', up: 'Low' },
  B: { salary: 4200000, benefits: 250000, rrspPct: 0.04, bonus: 0, vacation: '3 weeks', commute: '45 minutes', up: 'Good (training program)' }
};
function rrspOf(o) { return Math.round(o.salary * o.rrspPct); }
function compOf(o) { return o.salary + o.benefits + rrspOf(o) + o.bonus; }
var MO = { from: 5800000, to: 6000000 };
function raiseGain(a, b) { return (b - a) - (incomeTax(b) - incomeTax(a)); }
function mythFed(inc) { var rate = 0.14, i; for (i = 0; i < FED.length; i++) if (inc > (i ? FED[i - 1][0] : 0)) rate = FED[i][1]; return Math.round(inc * rate) - FED_CREDIT; } // TaxZapper: ALL income at the top bracket it reaches
var AVERY_INC = 3000000; // TaxZapper forgot the credit for Avery
var BUDGET = { total: 84, health: 34.4, edu: 10.8 }; // Alberta Budget 2026–27, billions
var SYSTEMS = [{ id: 'prog', label: 'Progressive', icon: '📈' }, { id: 'flat', label: 'Flat', icon: '➖' }, { id: 'regr', label: 'Regressive', icon: '📉' }];
var SYSTEM_ITEMS = [
  ['Everyone pays 10% of their income', 'flat', 'The same share for everyone.'], ['Higher incomes are taxed at higher rates', 'prog', 'A bigger share from higher incomes.'], ['A tax that takes a bigger share of a low income than a high income', 'regr', 'A bigger share from lower incomes.'],
  ['Canada’s income tax brackets', 'prog', 'Higher slices are taxed at higher rates.'], ['A 5% sales tax on things people buy (GST)', 'regr', 'People who earn less spend more of their income, so it takes a bigger share of it.'], ['A 15% tax on every dollar of income, for everyone', 'flat', 'One rate for all.'],
  ['A fixed $500 fee that every adult pays', 'regr', 'The same dollars are a much bigger share of a small income.'], ['Rates of 0%, then 10%, then 20% as income goes up', 'prog', 'Rates rise with income.']
];
var POINTS_TO_WIN = 3;
var GAME_CFGS = {
  blitz: { kind: 'quickPick', cfg: { id: 'blitz', name: 'Bracket Blitz', scoreWord: 'Right', think: 3000, th: [[11, 5], [11, 5]],
    how: '<p><b>Bracket Blitz.</b> Quick questions about brackets, tax systems and job offers. Tap the right answer.</p><p class="ct-small">A wrong answer costs a point. Round numbers only.</p>',
    make: function (r) {
      function pk(a) { return a[Math.floor(r() * a.length)]; }
      function sh(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
      function d(n) { return '$' + n.toLocaleString('en-CA'); }
      var Q = [
        function () { return { q: 'Federal tax: the first $58,523 is taxed at…', r: '14%', w: ['20.5%', '8%'] }; },
        function () { return { q: 'Alberta tax: the first $61,200 is taxed at…', r: '8%', w: ['10%', '14%'] }; },
        function () { var x = pk([60000, 62000, 65000, 70000]); return { q: 'Income ' + d(x) + '. Which part is taxed at 20.5% (federal)?', r: 'Only the ' + d(x - 58523) + ' above $58,523', w: ['All ' + d(x), 'None of it'] }; },
        function () { var x = pk([20000, 30000, 40000, 50000]), t = pk([0.1, 0.15]); return { q: 'A flat ' + Math.round(t * 100) + '% tax on ' + d(x) + ' is…', r: d(Math.round(x * t)), w: [d(Math.round(x * t * 2)), d(Math.round(x * t / 2))] }; },
        function () { var s = pk(SYSTEM_ITEMS); return { q: '“' + s[0] + '”: which system?', r: { prog: 'Progressive', flat: 'Flat', regr: 'Regressive' }[s[1]], w: ['Progressive', 'Flat', 'Regressive'].filter(function (x) { return x !== { prog: 'Progressive', flat: 'Flat', regr: 'Regressive' }[s[1]]; }) }; },
        function () { var s = pk([40000, 45000, 50000]), b = pk([1500, 2500, 3000]), bo = pk([0, 1000, 2000]); return { q: d(s) + ' salary + ' + d(b) + ' benefits + ' + d(bo) + ' bonus = total compensation?', r: d(s + b + bo), w: [d(s), d(s + b + bo + 1000)] }; },
        function () { var s = pk([40000, 45000, 50000]), p = pk([3, 4, 5]); return { q: 'A ' + p + '% RRSP match on a ' + d(s) + ' salary is…', r: d(s * p / 100), w: [d(s * p / 10), d(p * 100)] }; },
        function () { return { q: 'A raise moves you into a higher bracket. Your take-home pay…', r: 'Goes up', w: ['Goes down', 'Stays the same'] }; },
        function () { return { q: 'Everyone gets a basic personal credit. It means…', r: 'Some income is tax-free', w: ['Rich people pay no tax', 'Tax doubles'] }; }
      ];
      var x = pk(Q)(), opts = sh([x.r].concat(x.w.slice(0, 2)));
      return { q: x.q, icon: '🧮', opts: opts, ans: opts.indexOf(x.r) };
    } } }
};
/* MODEL END */

/* HELP START ── between lessons, on fresh seeds. No DOM. ── */
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function pickN(r, a, n) { var b = a.slice(), out = []; while (out.length < n && b.length) out.push(b.splice(Math.floor(r() * b.length), 1)[0]); return out; }
function incomeTask(seed, lo, hi) { var r = RNG(seed * 13 + 1); r(); return (Math.floor(lo + r() * (hi - lo) / 1000) * 1000) * 100; }
function compTask(seed) { var r = RNG(seed * 17 + 3); r(); var o = { salary: (38 + Math.floor(r() * 15)) * 100000, benefits: [0, 150000, 200000, 250000, 300000][Math.floor(r() * 5)], rrspPct: [0, 0.03, 0.04, 0.05][Math.floor(r() * 4)], bonus: [0, 50000, 100000, 200000][Math.floor(r() * 4)] }; return o; }
function systemTask(seed) { var r = RNG(seed * 19 + 5); r(); var out = []; ['prog', 'flat', 'regr'].forEach(function (k) { out = out.concat(pickN(r, SYSTEM_ITEMS.filter(function (x) { return x[1] === k; }), 1)); }); return pickN(r, out.concat(pickN(r, SYSTEM_ITEMS.filter(function (x) { return out.indexOf(x) < 0; }), 1)), 4); }
var MYTH_QS = [
  { id: 'raise', label: 'Does a raise ever cost money?', text: 'My raise moves me into a higher bracket. Will I take home less?', opts: [
    ['No. Only the dollars above the line are taxed at the higher rate. You keep most of the raise.', 1, 'So I keep the raise. Nice.'], ['Yes. All your income is taxed at the higher rate now.', 0, 'That’s the bracket myth. Only the slice above the line.'], ['Yes, so turn it down.', 0, 'Turning it down loses you money.']] },
  { id: 'twice', label: 'Twice the income, how much tax?', text: 'If someone earns twice as much as me, do they pay exactly twice as much tax?', opts: [
    ['More than twice, because more of their income is in higher brackets.', 1, 'Right. That’s what progressive means.'], ['Exactly twice.', 0, 'That would be a flat tax.'], ['Less than twice.', 0, 'With brackets, it’s more than twice.']] },
  { id: 'average', label: 'Average tax rate', text: 'I earn $70,000 and pay about $12,197 in income tax. Is my tax rate 20.5%?', opts: [
    ['No. 20.5% is only on the top slice. My average rate is about 17%.', 1, '12,197 ÷ 70,000 ≈ 17.4%.'], ['Yes, 20.5% on everything.', 0, 'Only the top slice.'], ['It’s 14% on everything.', 0, 'The slice above $58,523 is taxed at 20.5%.']] }
];
var CONTRACT_QS = [
  { id: 'pool', label: 'The social contract', text: 'Why should I pay taxes for a hospital I might never use?', opts: [
    ['Everyone’s taxes pool together for things no one could pay for alone, and anyone can use them when they need to.', 1, 'Fair. I hope I never need it, but I’m glad it’s there.'], ['You shouldn’t. Only users should pay.', 0, 'Then a single emergency could cost more than most people have.'], ['Taxes go to the hospital owner.', 0, 'Public hospitals are paid for by everyone, together.']] },
  { id: 'stop', label: 'If people stopped paying', text: 'What could happen if many people stopped paying their taxes?', opts: [
    ['Schools, hospitals and roads would get less money, and services would get worse for everyone.', 1, 'Yeah. That’s the deal we all share.'], ['Nothing. The government has plenty.', 0, 'Services run on taxes.'], ['Taxes would go down.', 0, 'Services would shrink, or others would pay more.']] },
  { id: 'gstcredit', label: 'Why the GST credit', text: 'Why does Canada give a GST credit back to people with low incomes?', opts: [
    ['Because sales tax takes a bigger share of a low income, so the credit balances it out.', 1, 'Makes sense.'], ['To reward people for shopping.', 0, 'It’s about fairness, not shopping.'], ['Everyone gets the same credit.', 0, 'It’s for low incomes.']] }
];
function mailKind(seed, last) { var k = ['fed']; if (last >= 1) k.push('flat', 'system'); if (last >= 2) k.push('comp'); if (last >= 3) k.push('contract'); return k[RNG(seed * 7 + 3)() * k.length | 0]; }
/* HELP END */

  var T = window.CEFLTown, K = T.kit, esc = T.esc;
  var fmt = K.fmt, fmtW = K.fmtW, step = K.step;
  function pFmt(c) { return (Math.round(c) / 100) + '%'; }
  var BLITZ = T.gameKit.quickPick(GAME_CFGS.blitz.cfg), BLITZ_PAY = 800;
  var TAX_CARD = '<h3>2026 federal</h3>' + '<p>14% on the first $58,523 · 20.5% on the next slice, to $117,045 · then 26%, 29%, 33%.<br>Basic personal credit: 14% × $16,452 = <b>$2,303.28</b> off.</p><h3>2026 Alberta</h3><p>8% on the first $61,200 · 10% on the next slice, to $154,259.<br>Basic personal credit: 8% × $22,769 = <b>$1,821.52</b> off.</p><p class="ct-small">Tax = (each slice × its rate, added up) − the credit. Income tax only.</p>';
  function sliceHTML(inc, br, credit) { var s = slices(inc, br); return K.table(s.map(function (x) { return [fmtW(x.from) + ' to ' + fmtW(x.to), Math.round(x.rate * 1000) / 10 + '%', fmt(x.tax)]; }).concat([['Credit', '', '−' + fmt(credit)]]), ['Slice', 'Rate', 'Tax']); }
  function fedFields(inc, k) {
    var s = slices(inc, FED);
    return s.map(function (x, i) { return { k: k + 's' + i, name: 'Federal: ' + fmtW(x.to - x.from) + ' at ' + Math.round(x.rate * 1000) / 10 + '%', ans: x.tax, hint: (Math.round(x.rate * 1000) / 1000) + ' × ' + fmtW(x.to - x.from) + '.' }; })
      .concat([{ k: k + 'f', name: 'Federal tax', sub: 'slices added, minus $2,303.28', ans: fedTax(inc), hint: 'Add the slices, then subtract $2,303.28.', net: 1 }]);
  }
  function blitzOpts(api, seed, help) {
    return { title: 'Bracket Blitz' + (help ? ': an extra round' : ''), name: 'minigame', game: BLITZ, seed: seed, seconds: 60, leave: !!help, skipNote: 'Skipping is okay.',
      tierText: help ? K.payTiers(BLITZ_PAY) : { great: 'Slices, systems and offers: you know them cold.', ok: 'Nice round.', poor: 'Brackets take practice. Slices, not the whole cake.' } };
  }
  async function blitz(api, S, key, n) {
    if (!S.blitzes[key]) { var r = await api.minigame(blitzOpts(api, S.seed * 67 + n, false)); S.blitzes[key] = { tier: r.tier, score: r.score }; api.save(); api.hud(); }
    var t = S.blitzes[key].tier;
    await api.say('okafor', t === 'great' ? 'Big play! You’d make a great tax volunteer.' : t === 'ok' ? 'Nice round!' : t === 'skip' ? 'Another time!' : 'Brackets trip up adults too. Practise the slices.');
  }

  function init() { return { v: 1, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), ans: {}, typed: {}, story: {}, blitzes: {}, advice: null, scene: null, finished: false }; }
  function validate(S) { return !!S && S.v === 1 && !!S.typed && !!S.story && !!S.blitzes; }
  function offersHTML() {
    var A = OFFERS.A, B = OFFERS.B;
    return K.table([['Salary', fmtW(A.salary), fmtW(B.salary)], ['Health and dental benefits', 'none', 'worth ' + fmtW(B.benefits) + ' a year'], ['RRSP match', 'none', 'employer adds 4% of salary'], ['Vacation', A.vacation, B.vacation], ['Commute', A.commute, B.commute], ['Chance to move up', A.up, B.up]], ['', 'Offer A', 'Offer B']) + '<p class="ct-small">Benefit values are samples.</p>';
  }

  var HELPS = [
    { id: 'it8-fed', who: 'rosa', after: 0, pay: 1000, label: 'Federal tax with brackets', ask: 'Can you work out my federal tax? Brackets confuse me.', run: async function (api, seed) {
      var inc = incomeTask(seed, 40000, 110000);
      var g = await api.calc({ title: 'Help Rosa: federal tax', name: 'help-fed', ref: TAX_CARD, refLabel: 'Show the 2026 tax card', intro: '<p>Rosa earns <b>' + fmtW(inc) + '</b> a year.</p>', fields: fedFields(inc, 'r') });
      if (g) await api.say('rosa', 'Slices! Not the whole cake. Got it.'); return g; } },
    { id: 'it8-myth', who: 'grandpa', after: 0, pay: 500, label: 'The bracket myth', ask: 'My friend says raises can cost you money. Is that true?', run: async function (api, seed) { return K.askGrade(await api.ask('grandpa', MYTH_QS[seed % MYTH_QS.length], null)); } },
    { id: 'it8-flat', who: 'dev', after: 1, pay: 800, label: 'Flat tax', ask: 'My friends are arguing about a flat tax. Can you do the math?', run: async function (api, seed) {
      var a = incomeTask(seed, 20000, 40000), b = incomeTask(seed + 9, 90000, 160000);
      var g = await api.calc({ title: 'Help Dev: a 15% flat tax', name: 'help-flat', intro: '<p>A 15% flat tax. Person 1 earns <b>' + fmtW(a) + '</b>. Person 2 earns <b>' + fmtW(b) + '</b>.</p>', fields: [{ k: 'a', name: 'Tax for person 1', ans: flatTax(a, 0.15), hint: '0.15 × ' + fmtW(a) + '.' }, { k: 'b', name: 'Tax for person 2', ans: flatTax(b, 0.15), hint: '0.15 × ' + fmtW(b) + '.' }] });
      if (g) await api.say('dev', 'Same 15% each. Is that fair? Now we’re arguing about THAT.'); return g; } },
    { id: 'it8-system', who: 'jas', after: 1, pay: 800, label: 'Progressive, flat or regressive', ask: 'Can you sort these taxes for my study group?', run: async function (api, seed) {
      var t = systemTask(seed); var g = await K.sort(api, { title: 'Help Jas: which kind of tax?', name: 'help-sort', leave: true, wide: true, intro: 'Progressive, flat or regressive?', bins: SYSTEMS, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      if (g) await api.say('jas', 'The GST one surprised me. Same 5%, different share.'); return g; } },
    { id: 'it8-comp', who: 'avery', after: 2, pay: 800, label: 'Total compensation', ask: 'I got a job offer with extras. What’s it really worth?', run: async function (api, seed) {
      var o = compTask(seed);
      var g = await api.calc({ title: 'Help Avery: total compensation', name: 'help-comp', intro: '<p>Salary <b>' + fmtW(o.salary) + '</b>' + (o.benefits ? ', benefits worth <b>' + fmtW(o.benefits) + '</b>' : '') + (o.rrspPct ? ', an RRSP match of <b>' + Math.round(o.rrspPct * 100) + '%</b> of salary' : '') + (o.bonus ? ', a <b>' + fmtW(o.bonus) + '</b> bonus' : '') + '. (Sample amounts.)</p>',
        fields: (o.rrspPct ? [{ k: 'r', name: 'RRSP match', ans: rrspOf(o), hint: Math.round(o.rrspPct * 100) + '% of ' + fmtW(o.salary) + '.' }] : []).concat([{ k: 't', name: 'Total compensation', ans: compOf(o), hint: 'Salary + everything else.' }]) });
      if (g) await api.say('avery', 'So it’s worth more than the salary says. Sneaky good!'); return g; } },
    { id: 'it8-ab', who: 'librarian', after: 2, pay: 1000, label: 'Alberta tax', ask: 'Can you check my Alberta tax?', run: async function (api, seed) {
      var inc = incomeTask(seed, 35000, 110000), s = slices(inc, AB);
      var g = await api.calc({ title: 'Help Mx. Lin: Alberta tax', name: 'help-ab', ref: TAX_CARD, refLabel: 'Show the 2026 tax card', intro: '<p>Mx. Lin earns <b>' + fmtW(inc) + '</b>.</p>', fields: s.map(function (x, i) { return { k: 's' + i, name: 'Alberta: ' + fmtW(x.to - x.from) + ' at ' + Math.round(x.rate * 100) + '%', ans: x.tax, hint: x.rate + ' × ' + fmtW(x.to - x.from) + '.' }; }).concat([{ k: 't', name: 'Alberta tax', sub: 'slices added, minus $1,821.52', ans: abTax(inc), hint: 'Add the slices, then subtract $1,821.52.', net: 1 }]) });
      if (g) await api.say('librarian', 'Shelved and sorted. Like my taxes.'); return g; } },
    { id: 'it8-contract', who: 'worker', after: 3, pay: 500, label: 'The social contract', ask: 'Can I ask you something about taxes?', run: async function (api, seed) { return K.askGrade(await api.ask('worker', CONTRACT_QS[seed % CONTRACT_QS.length], null)); } },
    { id: 'it8-blitz', who: 'nurse', after: 1, pay: BLITZ_PAY, label: 'An extra Bracket Blitz', game: true, ask: 'Break time! Want to quiz me on brackets? I mean, quiz yourself.', run: async function (api, seed) {
      var r = await api.minigame(blitzOpts(api, seed, true)); return K.gameGrade(r); } }
  ];
  var GOSSIP = [
    { id: 'g-sam-0', who: 'sam', after: -1, lines: ['I finish college in May. Two companies want to hire me!', 'Offer A pays $3,000 more. Easy choice. Right?'] },
    { id: 'g-gp-0', who: 'grandpa', after: -1, lines: ['In 1975 my boss offered me a raise. I said yes so fast I knocked over my coffee.', 'Who turns down a raise?'] },
    { id: 'g-mo-1', who: 'worker', after: 0, lines: ['That TaxZapper app is everywhere. Bright yellow. Very fast.', 'Fast isn’t the same as right. I’m learning that.'] },
    { id: 'g-avery-1', who: 'avery', after: 0, lines: ['TaxZapper says I owe tax on my summer job. A lot.', 'But my friend with the same job owes way less. Weird.'] },
    { id: 'g-zane-2', who: 'zane', after: 1, lines: ['Taxes are SO simple. Find your bracket. Multiply. Done.', 'Why does everyone keep emailing me?'] },
    { id: 'g-mayor-2', who: 'mayor', after: 1, lines: ['Council is holding a Tax Forum next month.', 'People keep asking if raises cost money. Somebody needs to explain brackets.'] },
    { id: 'g-sam-3', who: 'sam', after: 2, lines: ['TaxZapper says Offer A wins by $3,000.', 'But Offer B has benefits and an RRSP match. Does the app even look at those?'] },
    { id: 'g-nurse-3', who: 'nurse', after: 2, lines: ['Taxes pay for this whole hospital. The beds, the scans, me.', 'People don’t think about that until they need us.'] },
    { id: 'g-mo-4', who: 'worker', after: 3, lines: ['I took the raise! $1,463.99 more a year, after tax.', 'I’m buying the crew donuts. Slices, like the brackets.'] },
    { id: 'g-zane-4', who: 'zane', after: 3, lines: ['TaxZapper 2.0 shows every slice now. The {name} Slice View.', 'Downloads are up. Angry emails are down. Who knew math helps?'] },
    { id: 'g-sam-4', who: 'sam', after: 3, lines: ['I start my new job in June. I picked it with total compensation, not just salary.', 'And yes, I still tell puns. Some things don’t change.'] }
  ];
  function gossip(S, api) { return K.gossip(GOSSIP, api); }
  function mailTask(seed, last) {
    var k = mailKind(seed, last), from = 'Ms. Okafor';
    if (k === 'fed') { var inc = incomeTask(seed, 30000, 58000); return { label: 'Town Mail: federal tax', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', ref: TAX_CARD, refLabel: 'Show the 2026 tax card', intro: '<p class="ct-small">A letter from Ms. Okafor:</p><p>“A friend earns ' + fmtW(inc) + ' (all in the first bracket). What’s the federal tax?”</p>', fields: [{ k: 'f', name: 'Federal tax', ans: fedTax(inc), hint: '0.14 × ' + fmtW(inc) + ', minus $2,303.28.' }] }); } }; }
    if (k === 'flat') { var a = incomeTask(seed, 20000, 150000); return { label: 'Town Mail: flat tax', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Ms. Okafor:</p><p>“A 15% flat tax on ' + fmtW(a) + '?”</p>', fields: [{ k: 'a', name: 'Flat tax', ans: flatTax(a, 0.15), hint: '0.15 × ' + fmtW(a) + '.' }] }); } }; }
    if (k === 'system') { var t = systemTask(seed); return { label: 'Town Mail: kinds of tax', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, wide: true, intro: 'A letter from Ms. Okafor: “Progressive, flat or regressive?”', bins: SYSTEMS, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) }); } }; }
    if (k === 'comp') { var o = compTask(seed); return { label: 'Town Mail: total compensation', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Ms. Okafor:</p><p>“Salary ' + fmtW(o.salary) + (o.benefits ? ', benefits ' + fmtW(o.benefits) : '') + (o.rrspPct ? ', RRSP match ' + Math.round(o.rrspPct * 100) + '%' : '') + (o.bonus ? ', bonus ' + fmtW(o.bonus) : '') + '. Total compensation?”</p>', fields: [{ k: 't', name: 'Total compensation', ans: compOf(o), hint: 'Salary + everything else.' }] }); } }; }
    var q = CONTRACT_QS[seed % CONTRACT_QS.length];
    return { label: 'Town Mail: ' + q.label, from: from, pay: 500, run: async function (api) { await api.say(null, 'A letter from Ms. Okafor. She has a question.'); return K.askGrade(await api.ask('okafor', q, null)); } };
  }

  function chapterSteps(ch, S, api) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the Job Centre and see Ms. Okafor', 'okafor');
        await api.say('okafor', ['Hey, hey! You know Sam from the bank? He’s finishing college, and two employers want to hire him!', 'Offer A: $45,000 a year. Offer B: $42,000 a year. Sam says, “Easy. Offer A pays $3,000 more.”']);
        var i = await api.choose('okafor', 'Is Sam right?', ['Yes, A pays more', 'Not sure yet', 'No, there’s more to it']);
        S.typed.entry = ['Yes, A pays more', 'Not sure yet', 'No, there’s more to it'][i];
        api.give('Sam’s two offers', '📄', 'okafor');
        await api.say('okafor', ['Keep that answer. You’ll check it at the end.', 'First, taxes. Let’s see what Sam really takes home from each offer.']);
      }));
      a.push(step('hunch', async function (api, S) { // the side story starts: before the skill
        await api.quest('Mo is outside the Job Centre, staring at his phone', 'worker');
        await api.say('worker', ['My boss offered me a raise. $58,000 to $60,000.', 'But TaxZapper says $60,000 puts me in the 20.5% bracket, so ALL my income gets taxed more. It says I’d lose money!', 'So I said no thanks. That’s right... right?']);
        await api.say('you', ['I don’t know how brackets work yet. Ms. Okafor is about to teach me.', 'Don’t sign anything else yet. I’ll keep notes.']);
        S.story.mo1 = 1; api.give('Tax notes', '🔍', 'worker'); api.refresh();
      }));
      a.push(step('brackets', async function (api, S) {
        await api.quest('Learn tax brackets with Ms. Okafor', 'okafor');
        await api.say('okafor', ['Canada taxes income in brackets: slices taxed at different rates. In 2026, the first $58,523 is taxed at 14% federally. The next slice, up to $117,045, at 20.5%.', 'Then everyone subtracts a credit for the tax-free basic personal amount: $2,303.28.', 'Someone earning $70,000: 14% of $58,523 is $8,193.22. 20.5% of the other $11,477 is $2,352.79. Add, then subtract the credit: $8,242.73.']);
        var g = await api.calc({ title: 'Federal tax with brackets', name: 'fed', noPay: true, ref: TAX_CARD, refLabel: 'Show the 2026 tax card', intro: '<p>Two people: one earns <b>$50,000</b>, one earns <b>$90,000</b>.</p>',
          fields: [{ k: 'a', name: 'Federal tax on $50,000', sub: 'all in the first bracket, minus the credit', ans: fedTax(5000000), hint: '0.14 × $50,000 − $2,303.28.' }].concat(fedFields(9000000, 'b').map(function (f) { f.name = f.name.replace('Federal:', '$90,000:'); if (f.net) f.name = 'Federal tax on $90,000'; return f; })) });
        api.record('q-fed', 'Federal tax with brackets ($50,000 and $90,000)', 0, g === 'first');
      }));
      a.push(step('sam', async function (api, S) {
        await api.quest('Go to the bank and tax Sam’s two offers', 'sam');
        await api.say('sam', ['You’re doing my taxes? I’d tell you a joke about income tax, but it’s too taxing.', 'Here are my offers.']);
        var g = await api.calc({ title: 'Tax Sam’s two offers', name: 'samtax', noPay: true, ref: TAX_CARD, refLabel: 'Show the 2026 tax card', intro: '<p>Both salaries are in the first federal bracket (14%) and the first Alberta bracket (8%).</p>',
          fields: [{ k: 'af', name: 'Offer A ($45,000): federal tax', ans: fedTax(OFFERS.A.salary), hint: '0.14 × $45,000 − $2,303.28.' }, { k: 'aa', name: 'Offer A: Alberta tax', ans: abTax(OFFERS.A.salary), hint: '0.08 × $45,000 − $1,821.52.' }, { k: 'at', name: 'Offer A: salary after income tax', ans: OFFERS.A.salary - incomeTax(OFFERS.A.salary), hint: '$45,000 − both taxes.', net: 1 },
            { k: 'bf', name: 'Offer B ($42,000): federal tax', ans: fedTax(OFFERS.B.salary), hint: '0.14 × $42,000 − $2,303.28.' }, { k: 'ba', name: 'Offer B: Alberta tax', ans: abTax(OFFERS.B.salary), hint: '0.08 × $42,000 − $1,821.52.' }, { k: 'bt', name: 'Offer B: salary after income tax', ans: OFFERS.B.salary - incomeTax(OFFERS.B.salary), hint: '$42,000 − both taxes.', net: 1 }] });
        api.record('q-samtax', 'Tax on Sam’s two offers', 0, g === 'first');
        await api.say('sam', ['So after tax, A is ' + fmt(OFFERS.A.salary - incomeTax(OFFERS.A.salary)) + ' and B is ' + fmt(OFFERS.B.salary - incomeTax(OFFERS.B.salary)) + '.', 'A still looks bigger. But Ms. Okafor says that’s not the whole story.']);
      }));
      a.push(step('end1', async function (api, S) {
        await api.quest('Tell Ms. Okafor about Mo’s raise', 'okafor');
        await api.ask('okafor', MYTH_QS[0], 'q-myth', 'Does a raise into a higher bracket cost money?', 0);
        await api.say('okafor', ['Only part of Mo’s raise is above the line. Keep that in your notes!', 'Now do Step 1 of your project: tax both offers.', 'Next time: is the tax fair? Three ways to tax.']);
        S.story.mo1b = 1;
      }));
    }
    if (ch === 1) {
      a.push(step('systems', async function (api, S) {
        await api.quest('Ms. Okafor wants to talk about fairness', 'okafor');
        await api.say('okafor', ['A progressive tax takes a bigger share from people who earn more. A flat tax takes the same share from everyone.', 'A regressive tax ends up taking a bigger share from people who earn less. Like GST, the 5% sales tax.']);
        await api.ask('okafor', { text: 'Sam earns $20,000 and pays $750 GST. Taylor earns $200,000 and pays $3,000 GST. Why is GST regressive?', opts: [['Sam’s $750 is 3.75% of his income. Taylor’s $3,000 is only 1.5% of hers. A bigger share of the lower income.', 1, 'Exactly. Same 5% on purchases, different share of income.'], ['Because Taylor pays more dollars.', 0, 'More dollars, but a smaller share of income.'], ['It isn’t. Everyone pays 5%.', 0, '5% of what they buy. Compare it to what they earn.']] }, 'q-gst', 'Why GST is regressive', 1);
        await K.sort(api, { title: 'Progressive, flat or regressive?', name: 'systems', story: true, key: 'q-systems', label: 'Progressive, flat or regressive', ch: 1, wide: true, intro: 'Sort each tax.', bins: SYSTEMS, items: SYSTEM_ITEMS.slice(0, 6).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      }));
      a.push(step('flat', async function (api, S) {
        var g = await api.calc({ title: 'What if Canada had a 15% flat tax?', name: 'flat', noPay: true, intro: '<p>Under a <b>15% flat tax</b>, everyone pays 15% of their income. Compare with the real system from Chapter 1.</p>',
          fields: [{ k: 'a', name: 'Offer A ($45,000): flat tax', ans: flatTax(OFFERS.A.salary, 0.15), hint: '0.15 × $45,000.' }, { k: 'b', name: 'Offer B ($42,000): flat tax', ans: flatTax(OFFERS.B.salary, 0.15), hint: '0.15 × $42,000.' }] });
        api.record('q-flat', 'A 15% flat tax on Sam’s offers', 1, g === 'first');
        await api.say('okafor', ['Under the real system, Sam pays ' + fmt(incomeTax(OFFERS.A.salary)) + ' on Offer A. Under a flat 15%, he’d pay $6,750. The basic personal credit makes a big difference at his income.']);
        await K.pick(api, { id: 'fair', title: 'Which system is fairest?', name: 'pickfair', intro: 'There’s no wrong answer. You need a reason and a trade-off.', options: SYSTEMS.map(function (s) { return { k: s.id, title: s.label, icon: s.icon }; }), reasonPrompt: 'Why is it fairest?', tradeoff: 'The trade-off (what someone gives up with this system):' });
      }));
      a.push(step('zap', async function (api, S) { // clue 1: TaxZapper's screen, checked with brackets
        await api.quest('Mo wants you to look at TaxZapper', 'worker');
        await api.say('worker', ['Here’s what TaxZapper showed me for $60,000. Can you check it?']);
        var right = fedTax(MO.to), wrong = mythFed(MO.to), o = { title: 'TaxZapper: federal tax on $60,000', name: 'zapscreen', story: true, key: 'story-zap', label: 'TaxZapper’s screen: find the mistake', ch: 1, intro: 'TaxZapper’s federal tax screen for Mo’s $60,000 raise.', ref: TAX_CARD, refLabel: 'Show the 2026 tax card',
          head: '<b>⚡ TaxZapper</b><span>Mo · $60,000</span>', rows: [{ k: 'inc', name: 'Income', val: fmt(MO.to) }, { k: 'rate', name: 'Your bracket', sub: '$58,523 to $117,045', val: '20.5%' }, { k: 'tax', name: 'Bracket tax', sub: 'TaxZapper: 20.5% × $60,000', val: fmt(Math.round(MO.to * 0.205)), tone: 'ded' }, { k: 'cr', name: 'Basic personal credit', val: '−$2,303.28', tone: 'ded' }, { k: 'fed', name: 'Federal tax', val: fmt(wrong), tone: 'net' }],
          root: 'tax', follows: { fed: true }, explain: { inc: 'That’s Mo’s new salary.', rate: '$60,000 does reach the 20.5% bracket. But only for part of it.', cr: 'That’s the right credit.' }, signLabel: 'It’s all right', disputeLabel: 'This line is wrong',
          rightLine: function () { return 'Caught it! Only the $1,477 above $58,523 is taxed at 20.5%. The rest is taxed at 14%. Federal tax is really ' + fmt(right) + ', not ' + fmt(wrong) + '.'; }, gentleHint: 'Which slices are taxed at which rates?' };
        await K.check(api, o);
        var g = await api.calc({ title: 'Mo’s raise: the real numbers', name: 'moraise', noPay: true, ref: TAX_CARD, refLabel: 'Show the 2026 tax card', intro: '<p>Total income tax (federal + Alberta): <b>' + fmt(incomeTax(MO.from)) + '</b> on $58,000 and <b>' + fmt(incomeTax(MO.to)) + '</b> on $60,000.</p>',
          fields: [{ k: 'x', name: 'Extra tax from the raise', ans: incomeTax(MO.to) - incomeTax(MO.from), hint: fmt(incomeTax(MO.to)) + ' − ' + fmt(incomeTax(MO.from)) + '.' }, { k: 'g', name: 'How much of the $2,000 raise Mo keeps', ans: raiseGain(MO.from, MO.to), hint: '$2,000 − the extra tax.', net: 1 }] });
        api.record('q-moraise', 'Mo’s raise: extra tax and what he keeps', 1, g === 'first');
        await api.say('worker', ['I KEEP ' + fmt(raiseGain(MO.from, MO.to)) + '? And I said no to that?', 'I’m calling my boss tomorrow.']);
        S.story.zap = 1; api.toast('Added to your Tax notes: TaxZapper’s mistake'); api.save();
      }));
      a.push(step('end2', async function (api, S) {
        await api.quest('Tell Ms. Okafor about TaxZapper', 'okafor');
        await api.say('okafor', ['An app that taxes the whole cake instead of the slices. Yikes. How many people use it?', 'Now do Step 2 of your project: which tax system is fairest?', 'Next time: total compensation. Salary isn’t the whole offer.']);
      }));
    }
    if (ch === 2) {
      a.push(step('priya', async function (api, S) {
        await api.quest('Ms. Okafor has an example about job offers', 'okafor');
        await api.say('okafor', ['Priya has two offers. Offer A: $52,000. Offer B: $48,000, plus $3,000 health and dental, a $2,000 bonus, and the employer adds 3% of salary to an RRSP.', 'Total compensation is salary plus everything else the employer gives.']);
        var g = await api.calc({ title: 'Priya’s Offer B', name: 'priya', noPay: true, intro: '<p>$48,000 salary + $3,000 benefits + $2,000 bonus + 3% RRSP match. (Sample amounts.)</p>', fields: [{ k: 'r', name: 'RRSP match', ans: 144000, hint: '0.03 × $48,000.' }, { k: 't', name: 'Total compensation for Offer B', ans: 5444000, hint: '$48,000 + $3,000 + $2,000 + the match.' }] });
        api.record('q-priya', 'Total compensation (Priya’s Offer B)', 2, g === 'first');
      }));
      a.push(step('samcomp', async function (api, S) {
        await api.quest('Work out Sam’s total compensation at the bank', 'sam');
        var g = await api.calc({ title: 'Sam’s total compensation', name: 'samcomp', noPay: true, ref: offersHTML(), refLabel: 'Show Sam’s offers', intro: '<p>Use the offer sheet.</p>',
          fields: [{ k: 'a', name: 'Offer A: total compensation', ans: compOf(OFFERS.A), hint: 'Salary only: nothing else.' }, { k: 'r', name: 'Offer B: RRSP match (4% of $42,000)', ans: rrspOf(OFFERS.B), hint: '0.04 × $42,000.' }, { k: 'b', name: 'Offer B: total compensation', ans: compOf(OFFERS.B), hint: '$42,000 + $2,500 + the match.', net: 1 }] });
        api.record('q-samcomp', 'Total compensation for Sam’s offers', 2, g === 'first');
        await api.say('sam', ['Wait. Offer B is worth ' + fmt(compOf(OFFERS.B) - compOf(OFFERS.A)) + ' MORE in total? Even with a lower salary?', 'But TaxZapper’s Offer Comparer said A wins by $3,000...']);
        await K.chips(api, { id: 'factors', title: 'Non-money factors for Sam', name: 'factors', intro: 'Money isn’t everything. Which factors matter most to Sam? (He wants to grow, and hates long bus rides.)', groups: [{ k: 'f', label: 'Factors that matter most', min: 2, max: 3, opts: [{ k: 'vac', label: 'Vacation', icon: '🏖️' }, { k: 'commute', label: 'Commute', icon: '🚌' }, { k: 'up', label: 'Chance to move up', icon: '📈' }, { k: 'team', label: 'The team', icon: '👥' }, { k: 'hours', label: 'Hours', icon: '⏰' }] }], saveText: 'Save' });
      }));
      a.push(step('comparer', async function (api, S) { // clue 2: the Offer Comparer; Avery's estimate; the source
        await api.say('sam', 'Here’s what TaxZapper’s Offer Comparer showed me.');
        await K.inspect(api, { title: 'TaxZapper Offer Comparer', name: 'comparer', story: true, key: 'story-comparer', label: 'The Offer Comparer: what it leaves out', ch: 2, find: 'Find the 3 things the comparer leaves out or gets wrong', cols: 3, ref: offersHTML(), refLabel: 'Show Sam’s offers',
          intro: 'Tap everything that makes the comparer’s answer wrong or incomplete.',
          spots: [{ id: 'ben', icon: '🦷', label: 'Benefits: “not counted”', bad: true, why: 'Benefits worth $2,500 are real compensation.', hint: 'What else does Offer B give?' }, { id: 'rrsp', icon: '🏦', label: 'RRSP match: “not counted”', bad: true, why: 'A 4% match is money the employer adds.' },
            { id: 'win', icon: '🏆', label: '“WINNER: Offer A, by $3,000”', bad: true, why: 'By total compensation, Offer B is worth more.' }, { id: 'sal', icon: '💵', label: 'Salary A $45,000, Salary B $42,000', fine: 'Those salaries are right. They’re just not the whole offer.' },
            { id: 'logo', icon: '⚡', label: '“TaxZapper: taxes in a flash!”', fine: 'Just a slogan. Annoying, but not wrong.' }, { id: 'date', icon: '📅', label: '“Updated for 2026”', fine: 'The dates are fine.' }] });
        await api.quest('Avery has a TaxZapper problem too', 'avery');
        await api.say('avery', ['TaxZapper says my tax on $30,000 is ' + fmt(bracketTax(AVERY_INC, FED) + bracketTax(AVERY_INC, AB)) + '. My friend with the same pay owes way less!']);
        await api.ask('avery', { text: 'What did TaxZapper forget?', opts: [['The basic personal credits: $2,303.28 federal and $1,821.52 Alberta.', 1, 'So it should be ' + fmt(incomeTax(AVERY_INC)) + '. Phew.'], ['Nothing. That’s right.', 0, 'Check: bracket tax minus the credits.'], ['It used the wrong year.', 0, 'The rates were right. Something else is missing.']] }, 'story-avery', 'Avery: what TaxZapper forgot', 2);
        S.story.zane = 1; api.refresh();
        await api.quest('Find Zane, who made TaxZapper, at the library', 'zane');
        await api.say('zane', ['TaxZapper! My app! Fast and simple. You find your bracket, and multiply everything by it. Then compare salaries. Done!', 'People keep emailing me “it’s wrong.” Wrong how?']);
        await api.say('you', ['I’ll show you. At the Tax Forum.']);
        S.story.comparer = 1; api.toast('Added to your Tax notes: three mistakes'); api.save();
      }));
      a.push(step('blitz3', async function (api, S) {
        await api.quest('Ms. Okafor is running a Bracket Blitz', 'okafor');
        await blitz(api, S, 'ch3', 3);
        await api.say('okafor', ['Now do Step 3 of your project: total compensation and non-money factors.', 'Next time: where taxes go. Then you advise Sam, and the Tax Forum!']);
      }));
    }
    if (ch === 3) {
      a.push(step('contract', async function (api, S) {
        await api.quest('Ms. Okafor wants to talk about where taxes go', 'okafor');
        await api.say('okafor', ['People pay taxes, and governments use them for services everyone shares. That’s the social contract.', 'In 2026–27, Alberta planned to spend about $84 billion: about $34.4 billion on health and $10.8 billion on education.']);
        var g = await api.calc({ title: 'Alberta’s budget', name: 'budget', noPay: true, intro: '<p>$10.8 billion of about $84 billion went to education.</p>', fields: [{ k: 'e', name: 'Share of spending on education', sub: '10.8 ÷ 84 × 100', fmt: pFmt, ans: Math.round(BUDGET.edu / BUDGET.total * 10000), alts: [1290, 1300], hint: '10.8 ÷ 84, then × 100.' }] });
        api.record('q-budget', 'Share of Alberta’s budget for education', 3, g === 'first');
        await api.ask('okafor', CONTRACT_QS[0], 'q-pool', 'The social contract', 3);
      }));
      a.push(step('decide', async function (api, S) {
        await api.quest('Go home and decide which offer to recommend', 'table');
        await K.pick(api, { id: 'offer', title: 'Our recommendation for Sam', name: 'pickoffer', intro: 'Use after-tax pay, total compensation and the non-money factors.',
          options: ['A', 'B'].map(function (k) { var o = OFFERS[k]; return { k: k, title: 'Offer ' + k, icon: k === 'A' ? '🅰️' : '🅱️', lines: [['Salary after income tax', fmt(o.salary - incomeTax(o.salary))], ['Total compensation', fmt(compOf(o))], ['Vacation', o.vacation], ['Commute', o.commute], ['Chance to move up', o.up]] }; }),
          reasonPrompt: 'Our money reason, and our non-money reason:', tradeoff: 'What Sam gives up with this offer (the trade-off):' });
      }));
      a.push(step('advise', async function (api, S) { // Step 7: advise Sam
        await api.quest('Advise Sam at the bank', 'sam');
        if (!S.advice) S.advice = { got: 0, asked: {} };
        var pick = S.typed.offer.pick, Qs = [
          ['q-adv-more', { text: 'Offer A pays $3,000 more. How is it not the better deal?', opts: [['By total compensation, Offer B is worth ' + fmt(compOf(OFFERS.B) - compOf(OFFERS.A)) + ' more, once you count benefits and the RRSP match.', 1, 'Huh. I only looked at salary.'], ['It is. Salary is all that matters.', 0, 'Salary isn’t the whole offer.'], ['Because Offer B has more tax.', 0, 'B actually has less tax. Its salary is lower.']] }],
          ['q-adv-bracket', { text: 'If I earn more later and hit the 20.5% bracket, will I lose money?', opts: [['No. Only the dollars above the line are taxed at 20.5%. You always keep most of a raise.', 1, 'Like Mo! Got it.'], ['Yes. Turn down raises near the line.', 0, 'That’s the myth Mo believed.'], ['Yes, everything gets taxed at 20.5%.', 0, 'Only the top slice.']] }],
          ['q-adv-tax', { text: 'Where does my income tax even go?', opts: [['Into services everyone shares, like hospitals, schools and roads. About $34.4 billion of Alberta’s budget is health.', 1, 'So my tax helps pay for Nurse Kaur’s hospital.'], ['To my boss.', 0, 'Your employer sends it to the government.'], ['Into a savings account for me.', 0, 'That’s an RRSP. Tax pays for shared services.']] }],
          ['q-adv-trade', { text: 'What do I give up with Offer ' + pick + '?', opts: [[pick === 'B' ? 'A longer commute and $3,000 less salary, for more total compensation, more vacation and a chance to move up.' : 'Benefits, an RRSP match, a week of vacation and a training program, for a higher salary and a short commute.', 1, 'Okay. I can live with that.'], ['Nothing. It’s perfect.', 0, 'Every choice has a trade-off.'], ['All my taxes.', 0, 'Both offers are taxed.']] }]
        ];
        for (var i = 0; i < Qs.length; i++) {
          var q = Qs[i]; if (S.advice.asked[q[0]]) continue;
          var r = await api.ask('sam', q[1], q[0], 'Advising Sam: ' + q[1].text, 3);
          S.advice.asked[q[0]] = 1; if (r.first) { S.advice.got++; api.fx.rise('sam', '+1'); }
          api.save(); api.hud();
        }
        S.win = S.advice.got >= POINTS_TO_WIN; api.save();
        await api.say('sam', S.win ? ['You convinced me. Offer ' + pick + '. And I know exactly what I’m giving up.', 'I owe you a pun. Here’s one: you really earned your interest. ...I’ll stop.'] : ['Thanks. I’m still not sure. Can you go over it again sometime?', 'You can replay this chapter from the Menu.']);
      }));
      a.push(step('forum', async function (api, S) { // the hero beat: the Tax Forum
        S.scene = 'forum'; api.refresh();
        await api.quest('The Tax Forum is starting at Town Hall', 'mayor');
        api.fx.face('all');
        await api.say('mayor', ['Order! Welcome to the Tax Forum. Half the town uses TaxZapper, and half the town is upset.', 'Can anyone show us what’s actually wrong?']);
        await K.proof(api, { title: 'The Tax Forum: what TaxZapper got wrong', name: 'proof', intro: 'For each screen, show council <b>what TaxZapper got wrong</b>.', keyPrefix: 'proof-', labelPrefix: 'Tax Forum: ', ch: 3, ref: TAX_CARD, refLabel: 'Show the 2026 tax card',
          choices: [{ k: 'top', label: 'It taxed all the income at the top bracket rate' }, { k: 'credit', label: 'It forgot the basic personal credit' }, { k: 'salary', label: 'It compared salary only, not total compensation' }],
          hint: { top: 'Look at the bracket math.', credit: 'Where are the credits?', salary: 'What’s missing from the comparison?' },
          items: [{ id: 'mo', title: 'Mo’s raise', facts: '$60,000 salary', html: K.doc(null, [['Bracket tax', '20.5% × $60,000', fmt(Math.round(MO.to * 0.205)), 'ded']]), ans: 'top' },
            { id: 'avery', title: 'Avery’s summer job', facts: '$30,000 a year', html: K.doc(null, [['Income tax', 'no credits subtracted', fmt(bracketTax(AVERY_INC, FED) + bracketTax(AVERY_INC, AB)), 'ded']]), ans: 'credit' },
            { id: 'sam', title: 'Sam’s offers', facts: 'A: $45,000. B: $42,000 + benefits + RRSP match', html: K.doc(null, [['WINNER', 'by salary', 'Offer A', 'net']]), ans: 'salary' }] });
        await api.say('zane', ['Okay. Okay. Slices, not the whole cake. And credits. And total compensation.', 'Will you help me fix it?']);
        await K.fix(api, { title: 'Fix TaxZapper', name: 'fix', intro: 'Zane: “These are the rules I typed in. Set them right.”', docTitle: '⚡ TaxZapper', docSub: 'Settings', keyPrefix: 'fix-', labelPrefix: 'Fix TaxZapper: ', ch: 3, stamp: 'Fixed',
          settings: [{ k: 'br', name: 'How brackets work', opts: ['Tax all income at the top bracket you reach', 'Tax each slice at its own rate'], right: 1, start: 0, hint: 'Slices, not the whole cake.' },
            { k: 'cr', name: 'Basic personal credit', opts: ['Ignore it', 'Subtract it from the bracket tax'], right: 1, start: 0, hint: 'Everyone gets the credit.' },
            { k: 'cmp', name: 'Offer Comparer', opts: ['Compare salary only', 'Compare total compensation, and show non-money factors'], right: 1, start: 0, hint: 'What is an offer really worth?' }],
          doneHtml: '<p><b>Test run:</b> Mo, $60,000: federal tax ' + fmt(fedTax(MO.to)) + '. The raise keeps ' + fmt(raiseGain(MO.from, MO.to)) + '. ✓</p>' });
        await api.say('worker', ['I called my boss. The raise is still mine! ' + fmt(raiseGain(MO.from, MO.to)) + ' a year, after tax.']);
        await K.hero(api, { who: 'mayor', lines: ['A raise never costs you money. Council wants every tax app in town to show the slices.', 'TaxZapper 2.0 has a new screen that does just that. Zane wants to call it the ' + api.profile.name + ' Slice View.'],
          medal: 'Bracket Buster medal', icon: '🍰', kicker: 'Tax Forum', title: 'The ' + api.profile.name + ' Slice View', thanks: [['zane', 'Downloads are up. Angry emails are down. Thank you.']], reply: ['Thanks! Remember: slices, credits, and the whole offer.'] });
        S.story.hero = 1; S.scene = null; api.refresh();
      }));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and pin your advice to your My Plan wall', 'myplan');
        var firstTime = !S.finished; S.finished = true;
        if (firstTime) api.profileAdd('closet', 'advisor');
        api.profileAdd('plan', { mission: '8-income-tax', title: 'Job Offer Showdown', text: 'I’d check total compensation and after-tax pay, not just salary. I advised Offer ' + S.typed.offer.pick + '.' });
        api.profileAdd('finished', '8-income-tax'); api.refresh();
        await api.say('you', ['At the start, I answered: ' + (S.typed.entry || '—') + '.', 'Now I know a job offer is more than a salary. And a raise never costs you money.']);
        await api.say('okafor', [S.win ? 'Sam took your advice, and the town got its math fixed. Big play!' : 'A slice view named after you! Next time, convince Sam too.', 'Your closet has a new Advisor’s blazer, and your My Plan wall has a new page.', 'Now do Step 4 of your project: decide, and say where Sam’s taxes go.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }

  T.mission({
    id: '8-income-tax', unitLabel: 'CEFL Grade 8 · Income and Tax · Project: Job Offer Showdown', title: 'Job Offer Showdown: The Bracket Myth',
    iCan: 'I can calculate income tax with brackets, compare tax systems, and judge a job offer by after-tax pay and total compensation.',
    foot: 'This is a model. Tax rates and credits are 2026 federal and Alberta figures; calculations show income tax only. Benefit values are samples. The people are made up.',
    bagTip: 'Your Bag holds what you collect: Sam’s offers, the 2026 tax card and your Tax notes.',
    realRule: 'Real gives no hints, and Sam still needs 3 good answers', afterLine: 'Mission complete. Open Menu → Report to show your teacher.',
    chapters: [
      { name: 'Tax brackets', step: 'Step 1', moment: 'Moment 1: tax brackets' },
      { name: 'Is the tax fair?', step: 'Step 2', moment: 'Moment 2: three ways to tax' },
      { name: 'Total compensation', step: 'Step 3', moment: 'Moment 3: total compensation' },
      { name: 'Decide', step: 'Step 4', moment: 'Moment 4: taxes and the social contract' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps, guide: 'okafor',
    helpers: function () { return HELPS; }, gossip: gossip, mail: function (S, seed, last) { return mailTask(seed, last); },
    outfit: function (S) { return S.finished ? 'advisor' : 'none'; },
    placeObjects: function (api) { api.place('table', 'home', 4, 3, { label: 'Kitchen table' }); api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true }); },
    people: function (S) {
      var out = {}, s = S.story;
      out.zane = { name: 'Zane', role: 'Made TaxZapper', map: 'library', x: 2, y: 4, dir: 'right', look: { base: 0, skin: 's2', hair: 'blond', shirt: 'yellow', pants: '#2f3a5c' }, hidden: !s.zane };
      if (S.scene === 'forum') { out.worker = { map: 'townhall', x: 2, y: 4, dir: 'right' }; out.avery = { map: 'townhall', x: 1, y: 3, dir: 'right' }; out.sam = { map: 'townhall', x: 6, y: 4, dir: 'left' }; out.zane = { name: 'Zane', role: 'Made TaxZapper', map: 'townhall', x: 7, y: 3, dir: 'left', look: { base: 0, skin: 's2', hair: 'blond', shirt: 'yellow', pants: '#2f3a5c' } }; }
      return out;
    },
    doorOpen: function (id) { return !!{ home: 1, grandpa: 1, jobcentre: 1, bank: 1, library: 1, townhall: 1, hospital: 1, servicecanada: 1 }[id]; },
    lockedLine: function (id) { return T.world.building(id).name + ' is closed right now. Try the Job Centre or the bank.'; },
    talk: function (id, S, api) {
      var s = S.story, done = S.finished;
      var lines = {
        okafor: done ? 'Slices, credits and the whole offer. You’ve got it.' : 'Your next goal is on the gold line at the top.',
        sam: s.hero ? 'New job in June! Picked by total compensation. And I still tell puns.' : 'Two offers! I’d tell you a joke about taxes, but it’s too taxing.',
        worker: s.hero ? 'Took the raise! Donuts for the crew.' : s.zap ? 'I keep most of the raise? I said no to that?' : 'TaxZapper says a raise would cost me money.',
        zane: s.hero ? 'TaxZapper 2.0: slices, credits, and the whole offer.' : 'Find your bracket, multiply everything. Simple! Right?',
        avery: s.hero ? 'My real tax was way less. Thanks!' : 'TaxZapper says I owe a lot on my summer job.', mayor: 'Town Hall: where the town decides things. Slowly.',
        nurse: 'Taxes pay for this whole hospital.', grandpa: 'Who turns down a raise?', table: 'The kitchen table. Good for big decisions.',
        myplan: K.planLine(api)
      };
      return lines[id] || null;
    },
    hud: function (S) {
      var out = [{ label: 'Offer A', value: fmtW(OFFERS.A.salary) }, { label: 'Offer B', value: fmtW(OFFERS.B.salary) }];
      if (S.advice) out.push({ label: 'Sam', value: S.advice.got + ' / 4', title: '3 good answers and Sam takes your advice' });
      return out;
    },
    items: function (S) {
      var it = [{ name: 'Sam’s two offers', icon: '📄', note: 'From the project brief', view: offersHTML }, { name: '2026 tax card', icon: '🧾', note: 'Brackets and credits', view: function () { return TAX_CARD + '<h3>Example: $70,000</h3>' + sliceHTML(7000000, FED, FED_CREDIT); } }];
      if (S.story.mo1) it.push({ name: 'Tax notes', icon: '🔍', note: 'The bracket myth', view: function () { return K.notes(notes(S)); } });
      if (S.story.hero) it.push({ name: 'Bracket Buster medal', icon: '🍰', note: 'The ' + T.api.profile.name + ' Slice View', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🍰</p><p style="text-align:center"><b>Bracket Buster</b><br>Slices, not the whole cake.</p>'; } });
      return it;
    },
    report: function (S) {
      var h = '<p>First answer about Sam: ' + esc(S.typed.entry || '—') + (S.typed.offer ? ' · Recommended: <b>Offer ' + esc(S.typed.offer.pick) + '</b>' : '') + (S.finished ? ' · Advising Sam: <b>' + S.advice.got + ' of 4</b> (' + (S.win ? 'Sam took the advice' : 'goal not reached') + ')' : '') + '</p>';
      h += K.table([['After income tax', fmt(OFFERS.A.salary - incomeTax(OFFERS.A.salary)), fmt(OFFERS.B.salary - incomeTax(OFFERS.B.salary))], ['Total compensation', fmt(compOf(OFFERS.A)), fmt(compOf(OFFERS.B))]], ['', 'Offer A', 'Offer B']);
      var bz = Object.keys(S.blitzes); if (bz.length) h += '<h3>Bracket Blitz</h3>' + K.table(bz.map(function (k) { var x = S.blitzes[k]; return ['Chapter 3', String(x.score), K.TIER_WORD[x.tier]]; }), ['When', 'Score', 'Result']);
      h += K.wrote(S, [['fair', 'The fairest tax system', function (k) { return { prog: 'Progressive', flat: 'Flat', regr: 'Regressive' }[k]; }], ['offer', 'Recommendation for Sam', function (k) { return 'Offer ' + k; }]]);
      h += '<h3>The bracket myth</h3><p>' + (S.story.hero ? 'Solved: proved TaxZapper’s mistakes at the Tax Forum, fixed it with Zane, and Mo took his raise.' : S.story.comparer ? 'Found all three mistakes.' : S.story.mo1 ? 'Collecting clues.' : 'Not started.') + '</p>';
      return h;
    },
    test: { scenes: [null, { story: { zane: 1 } }, { scene: 'forum', story: { zane: 1 } }], FED: FED, AB: AB, fedTax: fedTax, abTax: abTax, incomeTax: incomeTax, slices: slices, mythFed: mythFed, raiseGain: raiseGain, OFFERS: OFFERS, compOf: compOf, GAME_CFGS: GAME_CFGS, incomeTask: incomeTask, compTask: compTask, systemTask: systemTask, mailTask: mailTask, HELPS: HELPS, GOSSIP: GOSSIP }
  });
  function notes(S) {
    var s = S.story, li = [];
    if (s.mo1) li.push('<b>Mo:</b> turned down a raise from $58,000 to $60,000. TaxZapper said the 20.5% bracket would make him lose money.');
    if (s.zap) li.push('<b>TaxZapper’s screen:</b> it taxed all $60,000 at 20.5%. Really, only $1,477 is above $58,523. Mo would keep ' + fmt(raiseGain(MO.from, MO.to)) + ' of the $2,000 raise.');
    if (s.comparer) li.push('<b>Avery:</b> TaxZapper forgot the basic personal credits. <b>Sam:</b> the Offer Comparer counted salary only, so it missed Offer B’s benefits and RRSP match.');
    if (s.zane) li.push('<b>Zane</b> made TaxZapper: “Find your bracket, multiply everything.”');
    if (s.hero) li.push('<b>The ' + esc(T.api.profile.name) + ' Slice View:</b> TaxZapper 2.0 shows every slice, the credits, and total compensation.');
    return li;
  }
})();
