/* CEFL Town mission: Grade 8 Money, Interest, and Credit — "Grow It" (companion to the project Grow It). LO 8-MM.
   Four chapters, one after each project step: Fixed and variable costs (a budget) · Simple interest · Compound interest · Saving or
   investing (risk and return). You pick one of the project's income cards, build a budget that funds a short-term goal, and decide
   where two pots of money go.
   Model (MODEL START … END, no DOM): the cards (A age 14 $180, B age 16 $511, C age 17 $767 a month) with fixed and variable costs;
   simple interest I = P × r × t and compound A = P(1 + r)^t, compounded yearly (workbook); sample rates: savings account 2%, a
   5-year GIC 3.5% (locked in), an investment fund with seeded yearly returns from −15% to +20% (average about 6.9%; it beats the GIC
   over 5 years about 3 times in 4, and about 1 year in 5 is a loss). Pot 1 is your monthly savings for the short-term goal, needed
   in 1 year; Pot 2 is a lump sum for the long-term goal, needed in 5 years. Win = both goals reached on time. In Node: the safe
   choice (savings account for Pot 1, the GIC for Pot 2) always wins; the fund for Pot 2 usually wins; a savings account for Pot 2
   never does (the long-term goal is set to the GIC's result); the fund for Pot 1 loses after a bad first year.
   The Interest Sprint game (kit quickPick) counts right answers; it never changes the goal.
   Side story, "The Sure Thing Fund": Dev's cousin heard about a fund paying "50% a year, guaranteed, no risk" (Ch 1) → the brochure's
   claim next to real interest (Ch 2) → its "compound" table is wrong, Dev can't take his money out, and the flyer is full of red
   flags; the seller is Mr. Vance (Ch 3) → at the Money Fair you show the town the red flags, Dev gets his money back, and the bank's
   red-flag card is named after you (Ch 4).
   Between lessons (HELP START … HELP END): townspeople's own questions, an extra Interest Sprint, and Town Mail.
   Simplifications: rates and prices are samples (real rates change; the project looks them up); Pot 1 earns interest on about half
   its money for the year (deposits come in monthly); no fees or taxes on interest. */
(function () {
  'use strict';

/* MODEL START ── no DOM. Money in cents. ── */
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function simpleInt(P, r, t) { return Math.round(P * r * t); }
function compoundVal(P, r, t) { var v = P, i; for (i = 0; i < t; i++) v = Math.round(v * (1 + r)); return v; } // year by year, rounded to the cent each year (the workbook's table)
var CARDS = {
  A: { label: 'Card A: age 14, babysitting and yard work', income: 18000, fixed: [['phone', 'Phone (your share)', 2500], ['rec', 'Rec centre pass', 1500]], variable: [['food', 'Snacks and food out', 4000], ['games', 'Games and apps', 3000], ['clothes', 'Clothes', 2500]],
       short: { name: 'new headphones', price: 66000 }, long: { name: 'a used bike at 19', lump: 100000, from: 'a gift from Grandpa' } },
  B: { label: 'Card B: age 16, part-time job (10 hours a week)', income: 51100, fixed: [['phone', 'Phone plan', 3500], ['bus', 'Bus pass', 4000], ['music', 'Music streaming', 1100], ['gym', 'Gym', 3400]], variable: [['food', 'Food out', 12000], ['games', 'Games', 7000], ['clothes', 'Clothes', 8000]],
       short: { name: 'a used bike', price: 180000 }, long: { name: 'a car at 21', lump: 200000, from: 'your savings so far' } },
  C: { label: 'Card C: age 17, part-time job (15 hours a week)', income: 76700, fixed: [['phone', 'Phone plan', 4500], ['bus', 'Bus pass', 4000], ['music', 'Music streaming', 1100]], variable: [['food', 'Food out', 15000], ['fun', 'Fun and outings', 12000], ['clothes', 'Clothes', 10000]],
       short: { name: 'a laptop for school', price: 420000 }, long: { name: 'college in 5 years', lump: 300000, from: 'your savings so far' } }
};
var FLOOR = 0.5; // a budget keeps at least half of each variable cost (no-fun budgets break)
function sumOf(list) { return list.reduce(function (t, x) { return t + x[2]; }, 0); }
function savingsOf(card, vars) { var c = CARDS[card]; return c.income - sumOf(c.fixed) - Object.keys(vars).reduce(function (t, k) { return t + vars[k]; }, 0); }
function neededOf(card) { return Math.ceil(CARDS[card].short.price / 12); }
var PLACES = { save: { name: 'Savings account', rate: 0.02, risk: 'Low', locked: false, icon: '🏦' }, gic: { name: '5-year GIC', rate: 0.035, risk: 'Low (locked in for 5 years)', locked: true, icon: '🔒' }, fund: { name: 'Investment fund', rate: null, risk: 'Higher: some years go down', locked: false, icon: '📈' } };
var RET = [-0.15, -0.05, 0.04, 0.08, 0.11, 0.15, 0.20], RW = [0.08, 0.12, 0.15, 0.2, 0.2, 0.15, 0.10];
function fundYears(seed) { var r = RNG(seed * 31 + 7), out = [], i; r(); for (i = 0; i < 5; i++) { var x = r(), a = 0, j; for (j = 0; j < RET.length; j++) { a += RW[j]; if (x < a) break; } out.push(RET[Math.min(j, RET.length - 1)]); } return out; }
function longGoal(card) { return Math.floor(compoundVal(CARDS[card].long.lump, 0.035, 5) / 100) * 100; } // what the GIC reaches, rounded down to the dollar
/* Run the two pots. pot1: 'save' | 'fund' (12 monthly deposits of the budget's savings; about half the money earns a year's return).
   pot2: 'save' | 'gic' | 'fund' (the lump sum, 5 years). Returns each pot's value, year by year, and whether each goal is met. */
function runPots(card, monthly, p1, p2, seed) {
  var c = CARDS[card], fy = fundYears(seed), dep = monthly * 12, r1 = p1 === 'fund' ? fy[0] : PLACES.save.rate, v1 = dep + Math.round(dep * r1 / 2), v2 = c.long.lump, years = [], i;
  for (i = 0; i < 5; i++) { var r = p2 === 'fund' ? fy[i] : PLACES[p2].rate; v2 = Math.round(v2 * (1 + r)); years.push({ y: i + 1, r: r, v: v2 }); }
  return { fy: fy, v1: v1, goal1: c.short.price, ok1: v1 >= c.short.price, years: years, v2: v2, goal2: longGoal(card), ok2: v2 >= longGoal(card), win: v1 >= c.short.price && v2 >= longGoal(card) };
}
var ANA = { at40: 1028600, at50: 1842000 }; // the workbook: $1,000 at 6%, 40 and 50 years
var COSTS = [['Rent for an apartment', 'fixed'], ['Groceries', 'variable'], ['A music streaming subscription', 'fixed'], ['Movies with friends', 'variable'], ['A bus pass', 'fixed'], ['Clothes', 'variable'], ['Phone plan', 'fixed'], ['Snacks', 'variable'], ['Car insurance', 'fixed'], ['Gifts', 'variable']];
var SAVEINV = [['Putting $200 in a high-interest savings account', 'save'], ['Buying units of a fund that owns many companies', 'invest'], ['A GIC at the bank', 'save'], ['Buying shares of one company', 'invest'], ['Money in a piggy bank', 'save'], ['A fund that follows the stock market', 'invest']];
var GAME_CFGS = {
  sprint: { kind: 'quickPick', cfg: { id: 'sprint', name: 'Interest Sprint', scoreWord: 'Right', think: 3000, th: [[11, 5], [11, 5]],
    how: '<p><b>Interest Sprint.</b> Quick questions about interest, costs, and saving or investing. Tap the right answer.</p><p class="ct-small">A wrong answer costs a point. Round numbers only.</p>',
    make: function (r) {
      function pk(a) { return a[Math.floor(r() * a.length)]; }
      function sh(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
      function d(n) { return '$' + n.toLocaleString('en-CA'); }
      var Q = [
        function () { var P = pk([100, 200, 500, 1000]), rt = pk([2, 3, 5, 10]), t = pk([1, 2, 3]); return { q: 'Simple interest on ' + d(P) + ' at ' + rt + '% for ' + t + ' year' + (t > 1 ? 's' : '') + '?', r: d(P * rt * t / 100), w: [d(P * rt / 100), d(P * rt * t / 10)] }; },
        function () { var P = pk([100, 200, 1000]), rt = pk([5, 10]); return { q: d(P) + ' at ' + rt + '% compound. Value after 1 year?', r: d(P * (1 + rt / 100)), w: [d(P), d(P * (1 + 2 * rt / 100))] }; },
        function () { return { q: 'Interest on interest is called…', r: 'Compound interest', w: ['Simple interest', 'A fee'] }; },
        function () { var c = pk(COSTS); return { q: c[0] + ': fixed or variable?', r: c[1] === 'fixed' ? 'Fixed' : 'Variable', w: [c[1] === 'fixed' ? 'Variable' : 'Fixed', 'Neither'] }; },
        function () { return { q: 'Money you need in 6 months should be…', r: 'Saved somewhere safe', w: ['In a risky fund', 'In a 5-year GIC'] }; },
        function () { return { q: 'Higher possible return usually means…', r: 'Higher risk', w: ['No risk', 'Lower risk'] }; },
        function () { return { q: '“50% a year, guaranteed, no risk!” is…', r: 'A red flag', w: ['A great deal', 'Normal'] }; },
        function () { return { q: 'Simple and compound interest are about the same…', r: 'Only over a short time', w: ['Always', 'Never, even for 1 year'] }; },
        function () { var s = pk(SAVEINV); return { q: s[0] + ': saving or investing?', r: s[1] === 'save' ? 'Saving' : 'Investing', w: [s[1] === 'save' ? 'Investing' : 'Saving', 'Borrowing'] }; }
      ];
      var x = pk(Q)(), opts = sh([x.r].concat(x.w));
      return { q: x.q, icon: '📈', opts: opts, ans: opts.indexOf(x.r) };
    } } }
};
/* MODEL END */

/* HELP START ── between lessons, on fresh seeds. No DOM. ── */
function pickN(r, a, n) { var b = a.slice(), out = []; while (out.length < n && b.length) out.push(b.splice(Math.floor(r() * b.length), 1)[0]); return out; }
function simpleTask(seed) { var r = RNG(seed * 13 + 1); r(); var P = [50000, 80000, 100000, 150000, 200000, 250000][Math.floor(r() * 6)], rt = [0.02, 0.03, 0.04, 0.05][Math.floor(r() * 4)], t = 1 + Math.floor(r() * 5); return { P: P, r: rt, t: t, I: simpleInt(P, rt, t) }; }
function compTask(seed) { var r = RNG(seed * 17 + 3); r(); var P = [50000, 100000, 200000][Math.floor(r() * 3)], rt = [0.03, 0.04, 0.05][Math.floor(r() * 3)], t = 2 + Math.floor(r() * 2); var ys = [], v = P, i; for (i = 0; i < t; i++) { v = Math.round(v * (1 + rt)); ys.push(v); } return { P: P, r: rt, t: t, ys: ys }; }
function costTask(seed) { var r = RNG(seed * 19 + 5); r(); return pickN(r, pickN(r, COSTS.filter(function (c) { return c[1] === 'fixed'; }), 2).concat(pickN(r, COSTS.filter(function (c) { return c[1] === 'variable'; }), 2)), 4); }
function budgetTask(seed) { var r = RNG(seed * 23 + 7); r(); var inc = (300 + Math.floor(r() * 9) * 50) * 100, fixed = (80 + Math.floor(r() * 7) * 10) * 100, variable = (120 + Math.floor(r() * 9) * 15) * 100; return { inc: inc, fixed: fixed, variable: variable, save: inc - fixed - variable }; }
var RISK_QS = [
  { id: 'short', label: 'Short-term money', text: 'I need my savings for a trip in 8 months. Should I put it in an investment fund?', opts: [
    ['No. Money you need soon should be somewhere safe, like a savings account. A fund could drop right before the trip.', 1, 'Safe it is.'], ['Yes. Funds always go up.', 0, 'Funds can go down, sometimes for a year or more.'], ['Yes, the riskier the better.', 0, 'Risk is for money you won’t need for years.']] },
  { id: 'nofree', label: 'High return, no risk?', text: 'A guy says his fund pays 50% a year with no risk at all. Sound good?', opts: [
    ['No. You can’t get high returns without high risk. That’s a red flag.', 1, 'Right. Too good to be true.'], ['Yes! Sign up today.', 0, 'That’s exactly what scammers say.'], ['Only if he’s friendly.', 0, 'Friendly isn’t the same as honest.']] },
  { id: 'early', label: 'Why start early', text: 'Why does starting to save early matter so much?', opts: [
    ['Compound interest grows on itself, so more years means much more growth.', 1, 'Like a snowball. A long hill helps.'], ['It doesn’t. Starting late is the same.', 0, 'Ana and Ben show the difference.'], ['Banks charge less to young people.', 0, 'It’s about time for compound growth.']] }
];
function mailKind(seed, last) { var k = ['cost']; if (last >= 1) k.push('simple', 'budget'); if (last >= 2) k.push('comp'); if (last >= 3) k.push('risk'); return k[RNG(seed * 7 + 3)() * k.length | 0]; }
/* HELP END */

  var T = window.CEFLTown, K = T.kit, esc = T.esc;
  var fmt = K.fmt, fmtW = K.fmtW, step = K.step;
  function pc(r) { return (Math.round(r * 1000) / 10) + '%'; }
  var SPRINT = T.gameKit.quickPick(GAME_CFGS.sprint.cfg), SPRINT_PAY = 800;

  function init() { return { v: 1, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), ans: {}, typed: {}, story: {}, card: null, vars: null, sprints: {}, pots: null, scene: null, finished: false }; }
  function validate(S) { return !!S && S.v === 1 && !!S.typed && !!S.story && !!S.sprints && (S.card === null || !!CARDS[S.card]); }
  function C(S) { return CARDS[S.card]; }
  function monthly(S) { return S.vars ? savingsOf(S.card, S.vars) : 0; }
  function budgetPanel(api, S) {
    var c = C(S), v = S.vars ? JSON.parse(JSON.stringify(S.vars)) : (function () { var o = {}; c.variable.forEach(function (x) { o[x[0]] = x[2]; }); return o; })(), need = neededOf(S.card), tries = 0, rec = false;
    return api.panel({ title: 'My budget: ' + c.label, name: 'budget', wide: true, data: {}, render: function (body, done, ui) {
      function draw() {
        var save = savingsOf(S.card, v), ok = save >= need;
        body.innerHTML = '<p>Money in: <b>' + fmt(c.income) + '</b> a month. Your short-term goal: <b>' + esc(c.short.name) + '</b>, ' + fmtW(c.short.price) + ', in 12 months. That needs <b>' + fmt(need) + '</b> saved each month.</p>' +
          '<div class="ck-grid2"><div class="ct-doc"><div class="ct-doc-h"><b>Fixed costs</b><span>the same every month</span></div>' + c.fixed.map(function (x) { return '<div class="ct-line ded"><span class="what">' + esc(x[1]) + '</span><span class="amt">−' + fmt(x[2]) + '</span><span></span></div>'; }).join('') + '</div>' +
          '<div class="ct-doc"><div class="ct-doc-h"><b>Variable costs</b><span>change with your choices</span></div>' + c.variable.map(function (x) { var fl = Math.round(x[2] * FLOOR); return '<div class="ct-line ded"><span class="what">' + esc(x[1]) + '<small>at least ' + fmt(fl) + '</small></span><span class="ct-row"><button class="ct-btn ck-mv" type="button" data-k="' + x[0] + '" data-d="-500" aria-label="' + esc(x[1]) + ': 5 dollars less"' + (v[x[0]] - 500 < fl ? ' disabled' : '') + '>−5</button><b style="min-width:5.5em;text-align:right">' + fmt(v[x[0]]) + '</b><button class="ct-btn ck-mv" type="button" data-k="' + x[0] + '" data-d="500" aria-label="' + esc(x[1]) + ': 5 dollars more">+5</button></span><span></span></div>'; }).join('') + '</div></div>' +
          '<div class="ct-doc" style="margin-top:8px"><div class="ct-line net"><span class="what">Left to save each month</span><span class="amt" id="bgSave">' + fmt(save) + '</span><span></span></div></div>' +
          (api.mode === 'gentle' || tries ? '<p class="ct-fb ' + (ok ? 'yes' : 'no') + '" role="status">' + (ok ? '✓ Enough for ' + esc(c.short.name) + ' in 12 months.' : 'Not yet: ' + fmt(need - save) + ' a month short. Cut a variable cost.') + '</p>' : '') +
          '<div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="bgGo">Save my budget</button></div>';
        Array.prototype.forEach.call(body.querySelectorAll('[data-d]'), function (b) { b.addEventListener('click', function () { var k = b.dataset.k, fl = Math.round(c.variable.filter(function (x) { return x[0] === k; })[0][2] * FLOOR); v[k] = Math.max(fl, v[k] + Number(b.dataset.d)); draw(); var n = body.querySelector('[data-k="' + k + '"][data-d="' + b.dataset.d + '"]'); if (n && !n.disabled) n.focus(); }); });
        body.querySelector('#bgGo').addEventListener('click', check);
      }
      function check() {
        var save = savingsOf(S.card, v), ok = save >= need; tries++;
        if (!rec) { api.record('q-budget', 'Budget: enough saved for the short-term goal (first try)', 0, ok); rec = true; } else if (api.S.ans['q-budget']) api.S.ans['q-budget'].tries++;
        if (ok) { S.vars = v; api.save(); done(v); } else draw();
      }
      ui.data.solve = function (how) { if (how !== 'right') check(); var keys = c.variable.map(function (x) { return x[0]; }), i = 0; while (savingsOf(S.card, v) < need && i < 400) { var k = keys[i % keys.length], fl = Math.round(c.variable.filter(function (x) { return x[0] === k; })[0][2] * FLOOR); if (v[k] - 500 >= fl) v[k] -= 500; i++; } draw(); check(); };
      draw();
    } });
  }
  function potsPanel(api, S) {
    var c = C(S), p1 = null, p2 = null;
    return api.panel({ title: 'Where should each pot go?', name: 'pots', wide: true, data: {}, render: function (body, done, ui) {
      function seg(k, cur, keys) { return '<div class="ct-row ct-wrap">' + keys.map(function (x) { var P = PLACES[x]; return '<button class="ct-btn" type="button" data-' + k + '="' + x + '" aria-pressed="' + (cur === x) + '">' + P.icon + ' ' + esc(P.name) + '</button>'; }).join('') + '</div>'; }
      function draw() {
        body.innerHTML = K.table(Object.keys(PLACES).map(function (k) { var P = PLACES[k]; return [P.icon + ' ' + esc(P.name), P.rate ? pc(P.rate) + ' a year (sample)' : 'About 7% a year on average, but some years go down (sample)', esc(P.risk)]; }), ['Place', 'Return', 'Risk']) +
          '<h3>Pot 1: ' + esc(c.short.name) + ' (needed in 1 year)</h3><p class="ct-small">' + fmt(monthly(S)) + ' a month for 12 months. A 5-year GIC won’t work: you need this money next year.</p>' + seg('p1', p1, ['save', 'fund']) +
          '<h3>Pot 2: ' + esc(c.long.name) + ' (needed in 5 years)</h3><p class="ct-small">' + fmtW(c.long.lump) + ' now, from ' + esc(c.long.from) + '. Goal: ' + fmtW(longGoal(S.card)) + ' in 5 years.</p>' + seg('p2', p2, ['save', 'gic', 'fund']) +
          '<p class="ct-small">Rule of thumb: the sooner you need it, the safer it should be.</p><div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="ptGo"' + (p1 && p2 ? '' : ' disabled') + '>Run 5 years</button></div>';
        Array.prototype.forEach.call(body.querySelectorAll('[data-p1]'), function (b) { b.addEventListener('click', function () { p1 = b.dataset.p1; draw(); body.querySelector('[data-p1="' + p1 + '"]').focus(); }); });
        Array.prototype.forEach.call(body.querySelectorAll('[data-p2]'), function (b) { b.addEventListener('click', function () { p2 = b.dataset.p2; draw(); body.querySelector('[data-p2="' + p2 + '"]').focus(); }); });
        body.querySelector('#ptGo').addEventListener('click', function () { done({ p1: p1, p2: p2 }); });
      }
      ui.data.solve = function (how) { var q = (window.location.hash.match(/pots=(\w+),(\w+)/) || [])[0]; if (q) { var a = q.slice(5).split(','); p1 = a[0]; p2 = a[1]; } else { p1 = how === 'wrong' ? 'fund' : 'save'; p2 = how === 'wrong' ? 'save' : 'gic'; } draw(); body.querySelector('#ptGo').click(); };
      draw();
    } });
  }
  function sprintOpts(api, seed, help) {
    return { title: 'Interest Sprint' + (help ? ': an extra round' : ''), name: 'minigame', game: SPRINT, seed: seed, seconds: 60, leave: !!help, skipNote: 'Skipping is okay.',
      tierText: help ? K.payTiers(SPRINT_PAY) : { great: 'Interest whiz!', ok: 'Nice sprint.', poor: 'Interest takes practice. Decimals first!' } };
  }
  async function sprint(api, S, key, n) {
    if (!S.sprints[key]) { var r = await api.minigame(sprintOpts(api, S.seed * 71 + n, false)); S.sprints[key] = { tier: r.tier, score: r.score }; api.save(); api.hud(); }
    var t = S.sprints[key].tier;
    await api.say('sam', t === 'great' ? 'I’d tell you a joke about compound interest, but it builds slowly. Great sprint!' : t === 'ok' ? 'Nice work!' : t === 'skip' ? 'Another time!' : 'Change the percent to a decimal first. It helps.');
  }

  var HELPS = [
    { id: 'mm8-cost', who: 'avery', after: 0, pay: 600, label: 'Fixed or variable', ask: 'I’m starting a budget. Which of my costs are fixed?', run: async function (api, seed) {
      var t = costTask(seed); var g = await K.sort(api, { title: 'Help Avery: fixed or variable?', name: 'help-sort', leave: true, intro: '<b>Fixed</b> costs stay the same each month. <b>Variable</b> costs change with your choices.', bins: [{ id: 'fixed', label: 'Fixed', icon: '📌' }, { id: 'variable', label: 'Variable', icon: '🎚️' }], items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      if (g) await api.say('avery', 'So I cut the variable ones first. Got it.'); return g; } },
    { id: 'mm8-budget', who: 'jas', after: 0, pay: 800, label: 'Money left to save', ask: 'How much can I save each month? Can you check?', run: async function (api, seed) {
      var t = budgetTask(seed); var g = await api.calc({ title: 'Help Jas: money left to save', name: 'help-budget', intro: '<p>Jas earns <b>' + fmtW(t.inc) + '</b> a month. Fixed costs: <b>' + fmtW(t.fixed) + '</b>. Variable costs: <b>' + fmtW(t.variable) + '</b>.</p>', fields: [{ k: 's', name: 'Left to save each month', ans: t.save, hint: fmtW(t.inc) + ' − ' + fmtW(t.fixed) + ' − ' + fmtW(t.variable) + '.' }] });
      if (g) await api.say('jas', 'That’s more than I thought. Time to save it on purpose.'); return g; } },
    { id: 'mm8-simple', who: 'grandpa', after: 1, pay: 800, label: 'Simple interest', ask: 'My old savings bond pays simple interest. How much did I earn?', run: async function (api, seed) {
      var t = simpleTask(seed); var g = await api.calc({ title: 'Help Grandpa: simple interest', name: 'help-simple', intro: '<p>Grandpa put <b>' + fmtW(t.P) + '</b> in at <b>' + pc(t.r) + '</b> simple interest for <b>' + t.t + ' year' + (t.t > 1 ? 's' : '') + '</b>.</p>', fields: [{ k: 'i', name: 'Interest earned (I = P × r × t)', ans: t.I, hint: fmtW(t.P) + ' × ' + t.r + ' × ' + t.t + '.' }, { k: 't', name: 'Total', ans: t.P + t.I, hint: 'Principal + interest.', net: 1 }] });
      if (g) await api.say('grandpa', 'Not bad for a piece of paper in a drawer!'); return g; } },
    { id: 'mm8-comp', who: 'rosa', after: 2, pay: 1000, label: 'Compound interest', ask: 'My GIC compounds yearly. Can you show me each year?', run: async function (api, seed) {
      var t = compTask(seed); var g = await api.calc({ title: 'Help Rosa: compound interest', name: 'help-comp', intro: '<p>Rosa puts <b>' + fmtW(t.P) + '</b> in at <b>' + pc(t.r) + '</b>, compounded once a year.</p>', fields: t.ys.map(function (v, i) { return { k: 'y' + i, name: 'Value after year ' + (i + 1), ans: v, hint: (i ? 'Last year’s value' : fmtW(t.P)) + ' × ' + (1 + t.r) + '.' }; }) });
      if (g) await api.say('rosa', 'Interest on interest. It’s like the money is working overtime.'); return g; } },
    { id: 'mm8-saveinv', who: 'dev', after: 3, pay: 600, label: 'Saving or investing', ask: 'Which of these are saving, and which are investing?', run: async function (api, seed) {
      var r = RNG(seed * 29 + 11); r(); var t = pickN(r, SAVEINV, 4); var g = await K.sort(api, { title: 'Help Dev: saving or investing?', name: 'help-sort', leave: true, intro: '<b>Saving</b>: somewhere safe. <b>Investing</b>: into something that may grow, with risk.', bins: [{ id: 'save', label: 'Saving', icon: '🏦' }, { id: 'invest', label: 'Investing', icon: '📈' }], items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      if (g) await api.say('dev', 'And no more “Sure Thing” for me. Ever.'); return g; } },
    { id: 'mm8-risk', who: 'librarian', after: 3, pay: 500, label: 'Risk and return', ask: 'Can I ask you about risk?', run: async function (api, seed) { return K.askGrade(await api.ask('librarian', RISK_QS[seed % RISK_QS.length], null)); } },
    { id: 'mm8-sprint', who: 'nurse', after: 1, pay: SPRINT_PAY, label: 'An extra Interest Sprint', game: true, ask: 'Quiz break! Want to do an Interest Sprint?', run: async function (api, seed) {
      var r = await api.minigame(sprintOpts(api, seed, true)); return K.gameGrade(r); } }
  ];
  var GOSSIP = [
    { id: 'g-dev-0', who: 'dev', after: -1, lines: ['My cousin says there’s a fund at Quick Cash that pays 50% a year.', 'Guaranteed! No risk! I have $400 saved. Hmm.'] },
    { id: 'g-gp-0', who: 'grandpa', after: -1, lines: ['I started saving at 15. A dollar a week.', 'Now I have enough for a very nice retirement. And a very nice recliner.'] },
    { id: 'g-sam-0', who: 'sam', after: -1, lines: ['Today’s savings rate is 2%. Boring? Maybe.', 'But boring is safe. Boring is there when you need it.'] },
    { id: 'g-vance-1', who: 'vance', after: 2, lines: ['Sure Thing Fund! 50% a year! Guaranteed!', 'Why are you writing that down?'] },
    { id: 'g-rosa-1', who: 'rosa', after: 0, lines: ['I keep my emergency money in a plain savings account.', 'My long-term money is in a GIC. Slow and steady.'] },
    { id: 'g-dev-2', who: 'dev', after: 1, lines: ['I put my $400 in Sure Thing. My statement says I have $600 already!', 'But when I asked to take some out, Mr. Vance said “not yet.”'] },
    { id: 'g-mayor-2', who: 'mayor', after: 1, lines: ['A man named Vance is selling “investments” out of Quick Cash.', 'Three people asked me if it’s legit. I said: ask the bank.'] },
    { id: 'g-lin-3', who: 'librarian', after: 2, lines: ['Someone asked for a book on compound interest.', 'Then Mr. Vance asked for the same book. Then he hid it.'] },
    { id: 'g-sam-3', who: 'sam', after: 2, lines: ['If someone promises high returns with no risk, walk away.', 'That’s not a pun. That’s just true.'] },
    { id: 'g-dev-4', who: 'dev', after: 3, lines: ['I got my $400 back! Every penny!', 'It’s in a savings account now. Earning 2%. Boring. Beautiful.'] },
    { id: 'g-sam-4', who: 'sam', after: 3, lines: ['The {name} Red Flag Card is at every teller window now.', 'People take two. One for themselves, one for their cousin.'] },
    { id: 'g-gp-4', who: 'grandpa', after: 3, lines: ['A dollar a week, starting at 15.', 'Tell the young ones. Time is the best interest rate.'] }
  ];
  function gossip(S, api) { return K.gossip(GOSSIP, api); }
  function mailTask(seed, last) {
    var k = mailKind(seed, last), from = 'Sam';
    if (k === 'cost') { var t = costTask(seed); return { label: 'Town Mail: fixed or variable', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, intro: 'A letter from Sam: “Fixed or variable?”', bins: [{ id: 'fixed', label: 'Fixed', icon: '📌' }, { id: 'variable', label: 'Variable', icon: '🎚️' }], items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) }); } }; }
    if (k === 'simple') { var s = simpleTask(seed); return { label: 'Town Mail: simple interest', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Sam:</p><p>“' + fmtW(s.P) + ' at ' + pc(s.r) + ' simple interest for ' + s.t + ' year' + (s.t > 1 ? 's' : '') + '. How much interest?”</p>', fields: [{ k: 'i', name: 'Interest', ans: s.I, hint: 'P × r × t.' }] }); } }; }
    if (k === 'budget') { var b = budgetTask(seed); return { label: 'Town Mail: money left to save', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Sam:</p><p>“' + fmtW(b.inc) + ' in, ' + fmtW(b.fixed) + ' fixed, ' + fmtW(b.variable) + ' variable. How much is left to save?”</p>', fields: [{ k: 's', name: 'Left to save', ans: b.save, hint: 'Income minus both kinds of costs.' }] }); } }; }
    if (k === 'comp') { var c = compTask(seed); return { label: 'Town Mail: compound interest', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Sam:</p><p>“' + fmtW(c.P) + ' at ' + pc(c.r) + ', compounded yearly. Value after 1 year?”</p>', fields: [{ k: 'v', name: 'Value after 1 year', ans: c.ys[0], hint: fmtW(c.P) + ' × ' + (1 + c.r) + '.' }] }); } }; }
    var q = RISK_QS[seed % RISK_QS.length];
    return { label: 'Town Mail: ' + q.label, from: from, pay: 500, run: async function (api) { await api.say(null, 'A letter from Sam. He has a question.'); return K.askGrade(await api.ask('sam', q, null)); } };
  }

  function chapterSteps(ch, S, api) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the bank and see Sam', 'sam');
        await api.say('sam', ['Hi! The Money Fair is coming, and the bank wants students to show the town how money grows.', 'A puzzle first. Ana and Ben each save $1,000 at 6% a year until age 65. Ana starts at 15. Ben waits until 25.']);
        var i = await api.choose('sam', 'How much more do you think Ana ends up with?', ['About $1,000 more', 'About $3,000 more', 'About $8,000 more']);
        S.typed.anaGuess = ['About $1,000 more', 'About $3,000 more', 'About $8,000 more'][i];
        await api.say('sam', ['Hold that guess. We’ll check it later.', 'First: costs. Some are the same every month: fixed. Some change with your choices: variable.']);
        await K.sort(api, { title: 'Fixed or variable?', name: 'costs', story: true, key: 'q-costs', label: 'Fixed or variable costs', ch: 0, intro: '<b>Fixed</b> costs stay the same each month. <b>Variable</b> costs change with your choices.', bins: [{ id: 'fixed', label: 'Fixed', icon: '📌' }, { id: 'variable', label: 'Variable', icon: '🎚️' }], items: COSTS.slice(0, 6).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      }));
      a.push(step('card', async function (api, S) {
        await api.say('sam', 'Now pick an income card. You don’t have to use your own money.');
        var keys = ['A', 'B', 'C'], i = await api.choose('sam', 'Which income card?', keys.map(function (k) { return CARDS[k].label + ': ' + fmt(CARDS[k].income) + ' a month'; }));
        S.card = keys[i]; api.give('Income card ' + S.card, '🪪', 'sam'); api.hud();
      }));
      a.push(step('budget', async function (api, S) {
        await api.quest('Go home and build your budget at the kitchen table', 'table');
        await api.say('you', ['Goal one: ' + C(S).short.name + ', ' + fmtW(C(S).short.price) + ', in 12 months. That’s ' + fmt(neededOf(S.card)) + ' a month.', 'Fixed costs are hard to change fast. So I’ll look at the variable ones.']);
        await budgetPanel(api, S); api.give('My budget', '📒', 'table'); api.hud();
      }));
      a.push(step('hunch', async function (api, S) {
        await api.quest('Dev wants to ask you something', 'dev');
        await api.say('dev', ['Hey. My cousin found a fund at Quick Cash. The Sure Thing Fund.', '50% a year. Guaranteed. No risk. Should I put my $400 in?']);
        await api.say('you', ['50% a year sounds huge. But I don’t know how interest works yet.', 'Wait a bit? I’ll find out and keep notes.']);
        S.story.dev1 = 1; api.give('Money notes', '🔍', 'dev'); api.refresh();
      }));
      a.push(step('end1', async function (api, S) {
        await api.quest('Tell Sam about the Sure Thing Fund', 'sam');
        await api.say('sam', ['50% a year, no risk? Hmm. My eyebrows went up so fast they left my face.', 'Now do Step 1 of your project: your budget, and two goals.', 'Next time: simple interest.']);
      }));
    }
    if (ch === 1) {
      a.push(step('simple', async function (api, S) {
        await api.quest('Sam wants to teach you simple interest', 'sam');
        await api.say('sam', ['Interest is the reward for saving, or the cost of borrowing. The principal is what you start with. The rate is the percent per year.', 'Simple interest: I = P × r × t. Ty puts $500 in at 3% for 4 years: 500 × 0.03 × 4 = $60.']);
        var g = await api.calc({ title: 'Simple interest', name: 'simple', noPay: true, intro: '<p>Use I = P × r × t. Change the percent to a decimal first.</p>',
          fields: [{ k: 'a', name: '$2,000 at 4% for 3 years: interest', ans: simpleInt(200000, 0.04, 3), hint: '2,000 × 0.04 × 3.' }, { k: 'b', name: '$2,000 at 4% for 3 years: total', ans: 200000 + simpleInt(200000, 0.04, 3), hint: '$2,000 + the interest.', net: 1 }, { k: 'c', name: '$800 at 5% for 2 years: interest', ans: simpleInt(80000, 0.05, 2), hint: '800 × 0.05 × 2.' }] });
        api.record('q-simple', 'Simple interest (I = P × r × t)', 1, g === 'first');
      }));
      a.push(step('myplan', async function (api, S) {
        var c = C(S);
        var g = await api.calc({ title: 'My long-term pot: simple interest', name: 'mysimple', noPay: true, intro: '<p>Pot 2: <b>' + fmtW(c.long.lump) + '</b> for ' + esc(c.long.name) + '. Suppose it earns <b>2%</b> simple interest for <b>5 years</b>.</p>', fields: [{ k: 'i', name: 'Interest after 5 years', ans: simpleInt(c.long.lump, 0.02, 5), hint: fmtW(c.long.lump) + ' × 0.02 × 5.' }] });
        api.record('q-mysimple', 'Simple interest on my long-term pot', 1, g === 'first');
      }));
      a.push(step('brochure', async function (api, S) { // clue 1: the brochure's claim next to real interest
        await api.quest('Dev brought the Sure Thing brochure', 'dev');
        await api.say('dev', ['Here’s the brochure. “$1,000 earns $500 every year. Guaranteed!”', 'Is that just... normal interest?']);
        await api.ask('dev', { text: 'The bank pays about 2% (sample). Sure Thing says 50%, with no risk. What should Dev think?', opts: [['That’s 25 times the bank’s rate, with “no risk.” High returns always come with high risk. It’s a red flag.', 1, 'So... I shouldn’t trust it?'], ['Great deal! Banks are just slow.', 0, 'No real investment pays 50% a year with no risk.'], ['It’s fine because it’s guaranteed.', 0, 'A guarantee from a stranger isn’t worth much.']] }, 'story-brochure', 'The Sure Thing claim vs. real interest', 1);
        await api.say('dev', ['Uh oh. I already put my $400 in last week.']);
        S.story.brochure = 1; api.toast('Added to your Money notes: the brochure'); api.save();
      }));
      a.push(step('sprint2', async function (api, S) {
        await api.quest('Sam is running an Interest Sprint at the bank', 'sam');
        await sprint(api, S, 'ch2', 2);
        await api.say('sam', ['Now do Step 2 of your project: simple interest on your savings plan.', 'Next time: compound interest. Interest on interest.']);
      }));
    }
    if (ch === 2) {
      a.push(step('compound', async function (api, S) {
        await api.quest('Sam wants to show you compound interest', 'sam');
        await api.say('sam', ['With compound interest, you earn interest on your principal AND on the interest you already earned. Like a snowball.', 'Ty’s $500 at 3%: $515.00, then $530.45, then $546.36, then $562.75. Simple interest gave $560.']);
        var g = await api.calc({ title: 'Compound interest, year by year', name: 'compound', noPay: true, intro: '<p><b>$2,000</b> at <b>4%</b>, compounded once a year. Multiply by 1.04 each year (round to the cent).</p>',
          fields: [1, 2, 3].map(function (y) { return { k: 'y' + y, name: 'Value after year ' + y, ans: compoundVal(200000, 0.04, y), hint: (y === 1 ? '$2,000' : 'Last year’s value') + ' × 1.04.' }; }) });
        api.record('q-compound', 'Compound interest, year by year', 2, g === 'first');
        await api.ask('sam', { text: 'Someone says simple and compound interest give about the same result, so it doesn’t matter. True?', opts: [['Only over a short time. Over many years, compound interest grows much faster.', 1, 'Yes. The gap grows every year.'], ['True. They’re always about the same.', 0, 'Look at 40 or 50 years.'], ['Simple interest always wins.', 0, 'Compound earns interest on interest.']] }, 'q-cmisc', 'Simple vs. compound over time', 2);
      }));
      a.push(step('ana', async function (api, S) {
        await api.say('sam', ['Now Ana and Ben. $1,000 at 6% compound: after 40 years, about $10,286. After 50 years, about $18,420.', 'Ben saves for 40 years. Ana saves for 50.']);
        var g = await api.calc({ title: 'Ana and Ben', name: 'ana', noPay: true, intro: '<p>Ana: about <b>$18,420</b>. Ben: about <b>$10,286</b>.</p>', fields: [{ k: 'd', name: 'How much more Ana ends up with', ans: ANA.at50 - ANA.at40, hint: '$18,420 − $10,286.' }] });
        api.record('q-ana', 'Ana and Ben: starting early', 2, g === 'first');
        await api.say('you', ['I guessed: ' + (S.typed.anaGuess || '—') + '. It’s about $8,134 more, from just 10 extra years.', 'Starting early matters a lot.']);
      }));
      a.push(step('table', async function (api, S) { // clue 2: the "compound" table is wrong, and the flyer; the source
        await api.quest('Dev wants you to check his Sure Thing statement', 'dev');
        await api.say('dev', ['They sent me this growth table. And my statement says $600! But Mr. Vance won’t let me take any out.']);
        await K.check(api, { title: 'Sure Thing: “your compound growth”', name: 'stable', story: true, key: 'story-table', label: 'Sure Thing’s growth table: find the wrong line', ch: 2, intro: 'Sure Thing says Dev’s $400 grows at 50% compound a year.',
          head: '<b>Sure Thing Fund</b><span>Dev · $400 at “50% compound”</span>', rows: [{ k: 'y0', name: 'Start', val: '$400.00' }, { k: 'y1', name: 'After year 1', sub: '× 1.5', val: '$600.00' }, { k: 'y2', name: 'After year 2', sub: '× 1.5', val: '$1,200.00' }, { k: 'y3', name: 'After year 3', sub: '× 1.5', val: '$1,800.00' }],
          root: 'y2', follows: { y3: true }, explain: { y0: 'That’s what Dev put in.', y1: '$400 × 1.5 = $600. That matches.' }, signLabel: 'It’s all right', disputeLabel: 'This line is wrong',
          rightLine: function () { return 'Caught it! $600 × 1.5 is $900, not $1,200. They doubled it. Even their own math is fake.'; }, gentleHint: 'Multiply each year by 1.5, one row at a time.' });
        S.story.table = 1; S.story.vanceOut = 1; api.refresh();
        await api.quest('Look at Mr. Vance’s flyer at Quick Cash', 'vance');
        await api.say('vance', ['Sure Thing! Take a flyer! Tell no one, it’s a secret offer! But tell everyone!']);
        await K.inspect(api, { title: 'The Sure Thing flyer', name: 'flyer', story: true, key: 'story-flyer', label: 'The Sure Thing flyer: find the red flags', ch: 2, find: 'Find the 4 red flags', cols: 3,
          intro: 'Tap every red flag: anything that says this is too good to be true.',
          spots: [{ id: 'fifty', icon: '💰', label: '“50% a year, GUARANTEED”', bad: true, why: 'No real investment guarantees returns that high.', hint: 'Compare with the bank’s rate.' }, { id: 'norisk', icon: '🛡️', label: '“Absolutely no risk”', bad: true, why: 'High returns always come with high risk.' },
            { id: 'today', icon: '⏰', label: '“Today only! Don’t tell anyone!”', bad: true, why: 'Pressure and secrecy are classic scam signs.' }, { id: 'lock', icon: '🔐', label: '“Withdrawals open in 2 years”', bad: true, why: 'Not letting you take your money out is a huge red flag.' },
            { id: 'addr', icon: '📍', label: 'Address: Quick Cash, Market Lane', fine: 'An address isn’t a red flag by itself.' }, { id: 'font', icon: '✨', label: 'Shiny gold letters', fine: 'Ugly, but not a red flag. Lots of honest flyers are ugly.' }] });
        await api.say('vance', ['Red flags? These are... gold flags. Excuse me, I have a, uh, meeting.']);
        S.story.flyer = 1; api.toast('Added to your Money notes: the flyer'); api.save();
      }));
      a.push(step('sprint3', async function (api, S) {
        await api.quest('Another Interest Sprint at the bank', 'sam');
        await sprint(api, S, 'ch3', 3);
        await api.say('sam', ['I’ll call the provincial securities people about Mr. Vance. Bring your notes to the Money Fair.', 'Now do Step 3 of your project: simple vs. compound for your plan.', 'Next time: where should your money go? And the Money Fair!']);
      }));
    }
    if (ch === 3) {
      a.push(step('risk', async function (api, S) {
        await api.quest('Sam wants to talk about saving and investing', 'sam');
        await api.say('sam', ['Saving means putting money somewhere safe. Investing means putting it into something that may grow, like a fund that owns parts of many companies.', 'Investing can earn more, but it comes with risk: the chance of losing value. The sooner you need the money, the safer it should be.']);
        await K.sort(api, { title: 'Saving or investing?', name: 'saveinv', story: true, key: 'q-saveinv', label: 'Saving or investing', ch: 3, intro: 'Sort each one.', bins: [{ id: 'save', label: 'Saving', icon: '🏦' }, { id: 'invest', label: 'Investing', icon: '📈' }], items: SAVEINV.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
        await api.ask('sam', RISK_QS[0], 'q-short', 'Where short-term money should go', 3);
      }));
      a.push(step('pots', async function (api, S) {
        await api.quest('Go home and decide where your two pots go', 'table');
        if (!S.pots) {
          var pick = await potsPanel(api, S), res = runPots(S.card, monthly(S), pick.p1, pick.p2, S.seed);
          S.pots = { p1: pick.p1, p2: pick.p2, res: res }; S.win = res.win; api.save(); api.hud();
        }
        var R = S.pots.res, c = C(S);
        await K.timeline(api, { title: 'Five years later', name: 'years', intro: 'Pot 1 in a <b>' + esc(PLACES[S.pots.p1].name.toLowerCase()) + '</b>. Pot 2 in a <b>' + esc(PLACES[S.pots.p2].name.toLowerCase()) + '</b>.',
          rows: [{ label: 'Year 1', html: 'Pot 1: <b>' + fmt(R.v1) + '</b> for ' + esc(c.short.name) + ' (' + fmtW(R.goal1) + '). ' + (R.ok1 ? '✓ Bought it!' : '✗ Short by ' + fmt(R.goal1 - R.v1) + '.') + (S.pots.p1 === 'fund' ? ' The fund went ' + (R.fy[0] >= 0 ? 'up ' : 'down ') + pc(Math.abs(R.fy[0])) + ' that year.' : ''), tone: R.ok1 ? 'good' : 'bad' }]
            .concat(R.years.map(function (y) { return { label: 'Year ' + y.y, html: 'Pot 2: ' + fmt(y.v) + ' (' + (y.r >= 0 ? '+' : '−') + pc(Math.abs(y.r)) + ')', tone: y.r < 0 ? 'bad' : '' }; }))
            .concat([{ label: 'Goal 2', html: esc(c.long.name) + ': needs ' + fmtW(R.goal2) + '. ' + (R.ok2 ? '✓ Reached!' : '✗ Short by ' + fmt(R.goal2 - R.v2) + '.'), tone: R.ok2 ? 'good' : 'bad' }]),
          outro: '<p>' + (R.win ? '<b>Both goals reached on time.</b>' : '<b>Not both goals.</b> ' + (!R.ok1 ? 'Money needed in 1 year was in a fund that dropped. ' : '') + (!R.ok2 ? (S.pots.p2 === 'save' ? 'A savings account grows too slowly for a 5-year goal. ' : 'The fund had bad years. That’s the risk. ') : '')) + '</p>' });
        await K.typed(api, { id: 'wrong', title: 'What could go wrong?', prompt: 'What could go wrong with your plan, and what would you do?' });
      }));
      a.push(step('fair', async function (api, S) { // the hero beat: the Money Fair
        S.scene = 'fair'; api.refresh();
        await api.quest('The Money Fair is open at Town Hall!', 'mayor');
        api.fx.face('all');
        await api.say('mayor', ['Welcome to the Money Fair! Our students will show us how money grows. And how it doesn’t.', api.profile.name + ', you first.']);
        await api.ask('dev', { text: 'Why is my Sure Thing Fund a scam? It said 50%, guaranteed!', opts: [['High returns never come without high risk. And they won’t let you take your money out. Those are red flags.', 1, 'Okay. I’m getting my money back. Somehow.'], ['It’s fine. You just have to wait two years.', 0, 'A locked fund with fake math isn’t fine.'], ['50% is normal for funds.', 0, 'Real funds average far less, and some years go down.']] }, 'q-fair-scam', 'Money Fair: why Sure Thing is a scam', 3);
        await api.ask('grandpa', { text: 'Why should young people start saving now?', opts: [['Compound interest grows on itself, so 10 extra years can mean thousands more, like Ana and Ben.', 1, 'That’s what I’ve been saying for 60 years!'], ['They shouldn’t. Save later.', 0, 'Ana and Ben show what waiting costs.'], ['Because banks are closing soon.', 0, 'It’s about time and compound growth.']] }, 'q-fair-early', 'Money Fair: why start early', 3);
        await api.say('sam', ['Good news. Mr. Vance is gone, and the province froze his account. Everyone’s money is coming back.', 'Dev, your $400 too.']);
        await api.say('dev', 'YES. Into a boring savings account. Boring and beautiful.');
        S.story.fair = 1; api.save();
        await K.hero(api, { who: 'sam', lines: ['From now on, every teller window has a card: “Too good to be true? Check these red flags.”', api.profile.name + ' found every one. So it’s the ' + api.profile.name + ' Red Flag Card.'],
          medal: 'Red Flag medal', icon: '🚩', kicker: 'Money Fair', title: 'The ' + api.profile.name + ' Red Flag Card', reply: ['Thanks! High return means high risk. Every time.'] });
        S.story.hero = 1; S.scene = null; api.refresh();
      }));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and pin your money plan to your My Plan wall', 'myplan');
        var c = C(S), R = S.pots.res, firstTime = !S.finished; S.finished = true;
        if (firstTime) api.profileAdd('closet', 'moneyfair');
        api.profileAdd('plan', { mission: '8-money-management', title: 'Grow It', text: 'Short-term: ' + c.short.name + ' in a ' + PLACES[S.pots.p1].name.toLowerCase() + '. Long-term: ' + c.long.name + ' in a ' + PLACES[S.pots.p2].name.toLowerCase() + '. ' + (R.win ? 'Both goals reached.' : 'Not both goals yet.') });
        api.profileAdd('finished', '8-money-management'); api.refresh();
        await api.say('sam', [R.win ? 'Both goals on time, and the right place for each pot. Excellent!' : 'Not both goals this time. Remember: the sooner you need it, the safer it should be. You can replay this chapter from the Menu.', 'Your closet has a new Money Fair lanyard, and your My Plan wall has a new page.', 'Now do Step 4 of your project: choose where your savings go, and explain the risk.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }

  T.mission({
    id: '8-money-management', unitLabel: 'CEFL Grade 8 · Money, Interest, and Credit · Project: Grow It', title: 'Grow It: The Sure Thing Fund',
    iCan: 'I can manage fixed and variable costs, calculate simple and compound interest, and choose between saving and investing by risk and timeline.',
    foot: 'This is a model. Interest rates, fund returns and prices are samples; real rates change. The people are made up.',
    bagTip: 'Your Bag holds what you collect: your income card, your budget and your Money notes.',
    realRule: 'Real hides the budget check until you save', afterLine: 'Mission complete. Open Menu → Report to show your teacher.',
    chapters: [
      { name: 'Fixed and variable', step: 'Step 1', moment: 'Moment 1: fixed and variable costs' },
      { name: 'Simple interest', step: 'Step 2', moment: 'Moment 2: simple interest' },
      { name: 'Compound interest', step: 'Step 3', moment: 'Moment 3: compound interest' },
      { name: 'Saving or investing?', step: 'Step 4', moment: 'Moment 4: saving or investing' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps, guide: 'sam',
    helpers: function () { return HELPS; }, gossip: gossip, mail: function (S, seed, last) { return mailTask(seed, last); },
    outfit: function (S) { return S.finished ? 'moneyfair' : 'none'; },
    placeObjects: function (api) { api.place('table', 'home', 4, 3, { label: 'Kitchen table' }); api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true }); },
    people: function (S) {
      var out = {}, s = S.story;
      out.vance = { name: 'Mr. Vance', role: 'Sure Thing Fund', map: 'quickcash', x: 4, y: 3, dir: 'down', look: { base: 2, skin: 's1', hair: 'black', shirt: 'yellow', pants: '#2f2f38' }, hidden: !s.vanceOut || s.fair };
      if (S.scene === 'fair') { out.dev = { map: 'townhall', x: 2, y: 4, dir: 'right' }; out.grandpa = { map: 'townhall', x: 6, y: 4, dir: 'left' }; out.sam = { map: 'townhall', x: 7, y: 3, dir: 'left' }; }
      return out;
    },
    doorOpen: function (id) { return !!{ home: 1, grandpa: 1, bank: 1, quickcash: 1, townhall: 1, library: 1, hospital: 1, jobcentre: 1 }[id]; },
    lockedLine: function (id) { return T.world.building(id).name + ' is closed right now. Try the bank.'; },
    talk: function (id, S, api) {
      var s = S.story, done = S.finished;
      var lines = {
        sam: done ? 'High return, high risk. Every time.' : 'Today’s savings rate: 2% (sample). Boring is beautiful.',
        dev: s.hero ? 'My $400 is back, in a boring savings account.' : s.table ? 'They doubled the numbers? And I can’t take my money out?' : s.dev1 ? 'Sure Thing Fund. 50% a year. Hmm.' : 'Payday is the best day.',
        vance: 'Sure Thing! 50%! Guaranteed! Don’t ask questions!', rosa: 'Emergency money: savings. Long-term money: a GIC. Slow and steady.',
        grandpa: 'A dollar a week, starting at 15. Time is the best interest rate.', mayor: 'Money Fair! Bring a pencil.',
        table: 'The kitchen table. Good for money plans.',
        myplan: K.planLine(api)
      };
      return lines[id] || null;
    },
    hud: function (S) {
      if (!S.card) return [{ label: 'Goal', value: 'Talk to Sam' }];
      var out = [{ label: 'Card', value: S.card + ': ' + fmt(C(S).income) }];
      if (S.vars) out.push({ label: 'Saving', value: fmt(monthly(S)) + ' / month' });
      if (S.pots) out.push({ label: 'Goals', value: (S.pots.res.ok1 ? '✓' : '✗') + ' ' + (S.pots.res.ok2 ? '✓' : '✗'), warn: !S.pots.res.win });
      return out;
    },
    items: function (S) {
      var it = [];
      if (S.card) it.push({ name: 'Income card ' + S.card, icon: '🪪', note: C(S).label, view: function () { var c = C(S); return '<p><b>' + esc(c.label) + '</b>: ' + fmt(c.income) + ' a month.</p><p>Short-term goal: ' + esc(c.short.name) + ', ' + fmtW(c.short.price) + ' in 12 months. Long-term goal: ' + esc(c.long.name) + ', starting with ' + fmtW(c.long.lump) + ' (' + esc(c.long.from) + ').</p>'; } });
      if (S.vars) it.push({ name: 'My budget', icon: '📒', note: fmt(monthly(S)) + ' saved a month', view: function () { var c = C(S); return K.table(c.fixed.map(function (x) { return ['Fixed: ' + esc(x[1]), fmt(x[2])]; }).concat(c.variable.map(function (x) { return ['Variable: ' + esc(x[1]), fmt(S.vars[x[0]])]; })).concat([['<b>Left to save</b>', '<b>' + fmt(monthly(S)) + '</b>']])); } });
      if (S.story.dev1) it.push({ name: 'Money notes', icon: '🔍', note: 'The Sure Thing Fund', view: function () { return K.notes(notes(S)); } });
      if (S.story.hero) it.push({ name: 'Red Flag medal', icon: '🚩', note: 'The ' + T.api.profile.name + ' Red Flag Card', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🚩</p><p style="text-align:center"><b>Red Flag</b><br>Guaranteed, no risk, today only, can’t withdraw: walk away.</p>'; } });
      return it;
    },
    report: function (S) {
      if (!S.card) return '<p>Not started yet.</p>';
      var c = C(S), h = '<p>Card: <b>' + esc(c.label) + '</b> · Saving ' + fmt(monthly(S)) + ' a month' + (S.pots ? ' · Pot 1: ' + esc(PLACES[S.pots.p1].name) + ', Pot 2: ' + esc(PLACES[S.pots.p2].name) + ' · <b>' + (S.pots.res.win ? 'Both goals reached' : 'Not both goals') + '</b>' : '') + '</p>';
      h += '<p>First guess about Ana and Ben: ' + esc(S.typed.anaGuess || '—') + '.</p>';
      var sp = Object.keys(S.sprints); if (sp.length) h += '<h3>Interest Sprint</h3>' + K.table(sp.map(function (k) { var x = S.sprints[k]; return [k === 'ch2' ? 'Chapter 2' : 'Chapter 3', String(x.score), K.TIER_WORD[x.tier]]; }), ['When', 'Score', 'Result']);
      h += K.wrote(S, [['wrong', 'What could go wrong with my plan']]);
      h += '<h3>The Sure Thing Fund</h3><p>' + (S.story.hero ? 'Solved: showed the red flags at the Money Fair; Dev got his money back, and the bank’s red-flag card was named after them.' : S.story.flyer ? 'Found the red flags.' : S.story.dev1 ? 'Collecting clues.' : 'Not started.') + '</p>';
      return h;
    },
    test: { scenes: [null, { story: { vanceOut: 1 } }, { scene: 'fair' }], CARDS: CARDS, savingsOf: savingsOf, neededOf: neededOf, runPots: runPots, fundYears: fundYears, longGoal: longGoal, simpleInt: simpleInt, compoundVal: compoundVal, GAME_CFGS: GAME_CFGS, simpleTask: simpleTask, compTask: compTask, costTask: costTask, budgetTask: budgetTask, mailTask: mailTask, HELPS: HELPS, GOSSIP: GOSSIP }
  });
  function notes(S) {
    var s = S.story, li = [];
    if (s.dev1) li.push('<b>Dev:</b> his cousin heard about the Sure Thing Fund at Quick Cash: “50% a year, guaranteed, no risk.” Dev has $400 saved.');
    if (s.brochure) li.push('<b>The brochure:</b> 50% a year vs. about 2% at the bank (sample), with “no risk.” High returns always come with high risk. Dev already put in $400.');
    if (s.table) li.push('<b>Dev’s growth table:</b> $600 × 1.5 should be $900. They wrote $1,200. And Dev can’t take his money out.');
    if (s.flyer) li.push('<b>The flyer:</b> “guaranteed 50%”, “no risk”, “today only, don’t tell anyone”, and “withdrawals open in 2 years.” Four red flags. The seller is Mr. Vance.');
    if (s.hero) li.push('<b>The ' + esc(T.api.profile.name) + ' Red Flag Card:</b> at every teller window. Mr. Vance is gone, and everyone’s money is coming back.');
    return li;
  }
})();
