/* CEFL Town mission: Grade 7 Money, Interest, and Credit — "Saving Up" (companion to the project Saving for Something Real). LO 7-MM.
   Four chapters, one after each project step: Every dollar is a choice (trade-offs, a goal) · A plan for your money (a budget;
   months 1–2) · Setting a money goal (months 3–4) · Ready for surprises (an emergency fund; months 5–6).
   You play one of the project's income cards (A babysitting and allowance, B a seasonal yard and snow business, C a part-time job
   at 16) and save for its goal over six months. Each month: plan the budget at home (every dollar gets a job), the month runs, and
   Sam gives you your bank statement to check.
   Model (MODEL START … END, no DOM): the goal jar is locked until the end, so a surprise is paid from the emergency fund, or
   borrowed at 20% extra. A budget with no fun breaks: budget burnout is an impulse buy of 1.5 × the fun floor. The SnackBox Club
   "free sample" (Ch 1, your choice) charges $9.99 a month from month 3 until you dispute it on a statement.
   Win = the goal jar reaches the goal after month 6, with no debt. Node checks: a careful planner (fun at the floor, an emergency
   fund, the rest to the goal) always wins, even without disputing SnackBox; no emergency fund wins only when the surprise comes in
   month 5; wants-first (55% to fun), no-fun, all-to-the-fund and do-nothing planners never win.
   Side story, "The disappearing dollars": Avery's savings shrink and she can't say why (Ch 1) → her statement shows a SnackBox
   charge she never meant to sign up for (Ch 2) → Dev's was "upgraded" without asking; the sign-up card's fine print (Ch 3) → you
   name each trick at the bank, SnackBox refunds the town, and the bank's new monthly reminder is named after you (Ch 4).
   Between lessons (HELP START … HELP END): townspeople's own money questions, an extra Smart Shopper round, and Town Mail.
   Simplifications: months are equal; needs on Cards A and B are paid by family except the business gas on Card B; prices are
   samples (the project uses real prices); borrowing is from a cousin at a flat 20%. */
(function () {
  'use strict';

/* MODEL START ── no DOM. Money in cents. ── */
var MONTHS = 6, FEE_RATE = 0.2, TRIAL = 999, TRIAL_FROM = 3;
var CARDS = {
  ava:  { name: 'Ava', age: 13, card: 'A', label: 'Card A: babysitting and allowance', who: 'You babysit 3 times a month ($30 each) and get $40 allowance.', income: [13000, 13000, 13000, 13000, 13000, 13000], needs: [],
          floor: 3000, goal: 36000, goalName: 'a bike', goalIcon: '🚲', surprise: 6000, surpriseText: 'Your earbuds break. New ones cost' },
  noah: { name: 'Noah', age: 13, card: 'B', label: 'Card B: your own yard and snow business', who: 'You shovel snow and rake yards. Busy months pay $180; slow months pay $90.', income: [18000, 18000, 9000, 9000, 18000, 18000], needs: [['gas', 'Gas for the snowblower and mower', 1000]],
          floor: 2500, goal: 42000, goalName: 'a camera drone', goalIcon: '🛸', surprise: 9000, surpriseText: 'Your shovel and rake both break. New ones cost' },
  ty:   { name: 'Ty', age: 16, card: 'C', label: 'Card C: a part-time job at 16', who: 'You work 10 hours a week at $13 an hour. After EI, that’s about $511.52 a month.', income: [51152, 51152, 51152, 51152, 51152, 51152], needs: [['phone', 'Phone bill', 3500], ['bus', 'Bus pass', 4000]],
          floor: 6000, goal: 160000, goalName: 'a down payment on a used car', goalIcon: '🚗', surprise: 18000, surpriseText: 'Your phone screen cracks. Fixing it costs' }
};
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function needsOf(ck) { return CARDS[ck].needs.reduce(function (t, n) { return t + n[2]; }, 0); }
function surpriseOf(ck, seed) { var r = RNG(seed * 11 + 7); r(); return Math.round(CARDS[ck].surprise * (0.85 + 0.3 * r()) / 500) * 500; }
function surpriseMonthOf(seed) { var r = RNG(seed * 5 + 1); r(); return r() < 0.5 ? 5 : 6; } // the surprise card comes in month 5 or 6
function newRun(ck, seed) { return { card: ck, seed: seed, m: 0, jar: 0, ef: 0, debt: 0, log: [], trial: false, trialOff: 0, bonus: {}, surprise: surpriseOf(ck, seed), sm: surpriseMonthOf(seed) }; }
/* Money to plan with in month m: income (plus a Smart Shopper coupon), minus needs, minus debt, which is paid back first.
   A debt bigger than what is left carries on to the next month. */
function repayOf(run, m) { return Math.max(0, Math.min(run.debt, CARDS[run.card].income[m - 1] + (run.bonus[m] || 0) - needsOf(run.card))); }
function availableOf(run, m) { return CARDS[run.card].income[m - 1] + (run.bonus[m] || 0) - repayOf(run, m); }
function freeOf(run, m) { return availableOf(run, m) - needsOf(run.card); } // after needs and debt
/* A month runs: the plan's transfers, then anything that has to be paid: an impulse buy when the budget left too little fun
   (budget burnout: 1.5 × the fun floor, minus what was planned), the SnackBox Club charge (from month 3 if you took the free
   sample, until you dispute it), and the surprise (month 5 or 6, fixed by the seed). Each is paid from the emergency fund first; the rest is borrowed,
   and borrowing costs 20% extra. The goal jar is locked until the end. */
function runMonth(run, plan) {
  var m = run.m + 1, c = CARDS[run.card], ev = [], repaid = repayOf(run, m);
  run.debt -= repaid; run.ef += plan.ef; run.jar += plan.jar;
  function pay(amt, kind, text) { var fromEf = Math.min(run.ef, amt), short = amt - fromEf, owe = Math.round(short * (1 + FEE_RATE)); run.ef -= fromEf; run.debt += owe; ev.push({ kind: kind, text: text, amt: amt, fromEf: fromEf, borrowed: short, owe: owe }); }
  if (plan.fun < c.floor) pay(Math.round(c.floor * 1.5) - plan.fun, 'impulse', 'Budget burnout: after weeks of saying no to everything, you spent on impulse.');
  if (run.trial && m >= TRIAL_FROM && !(run.trialOff && m > run.trialOff)) pay(TRIAL, 'trial', 'SnackBox Club');
  if (m === run.sm) pay(run.surprise, 'surprise', c.surpriseText);
  run.m = m;
  var l = { m: m, income: c.income[m - 1], bonus: run.bonus[m] || 0, repaid: repaid, needs: needsOf(run.card), fun: plan.fun, jarIn: plan.jar, efIn: plan.ef, ev: ev, jar: run.jar, ef: run.ef, debt: run.debt };
  run.log.push(l); return l;
}
/* Disputing the SnackBox charge on this month's statement: the charge comes back into the emergency fund, and it stops */
function disputeTrial(run) { var l = run.log[run.log.length - 1], e = l && l.ev.filter(function (x) { return x.kind === 'trial'; })[0]; if (!e || run.trialOff) return 0; run.trialOff = run.m; var back = e.amt; if (e.owe) { var cut = Math.min(run.debt, e.owe); run.debt -= cut; back -= Math.round(cut / (1 + FEE_RATE)); } run.ef += Math.max(0, back); return e.amt; }
function trialOnStatement(run) { var l = run.log[run.log.length - 1]; return !!(l && l.ev.some(function (x) { return x.kind === 'trial'; })); }
function outcome(run) { if (run.m < MONTHS) return { done: false }; var c = CARDS[run.card]; if (run.jar < c.goal) return { done: true, win: false, why: 'short' }; if (run.debt > 0) return { done: true, win: false, why: 'debt' }; return { done: true, win: true }; }
/* "What would help?" after a month (asked at home next time): burnout, a surprise that became debt, or a jar falling behind while fun is high */
function helpTopic(run) {
  var l = run.log[run.log.length - 1], c = CARDS[run.card]; if (!l || run.m >= MONTHS) return null;
  if (l.ev.some(function (e) { return e.kind === 'impulse'; })) return 'burnout';
  if (l.ev.some(function (e) { return e.kind === 'surprise' && e.borrowed > 0; })) return 'surprise';
  var left = MONTHS - run.m, need = (c.goal - run.jar) / left;
  if (run.jar < c.goal && need > l.jarIn && l.fun > c.floor * 1.5) return 'slow';
  return null;
}
/* Smart Shopper (kit sortRush): a great round earns a $5 Valley Market coupon, added to next month's money. ok and poor change nothing. */
var COUPON = 500;
var GAME_CFGS = {
  shopper: { kind: 'sortRush', cfg: { id: 'shopper', name: 'Smart Shopper', scoreWord: 'Sorted', win: [6500, 4800], think: 1100, th: [[15, 6], [15, 6]],
    how: '<p><b>Smart Shopper.</b> Items roll down the belt at Valley Market. Is each one a <b>need</b> or a <b>want</b>?</p><p class="ct-small">A wrong answer costs 2 points. So does an item that rolls past.</p>',
    bins: [{ id: 'need', label: 'Need', icon: '🧺' }, { id: 'want', label: 'Want', icon: '🎁' }],
    items: [['Milk and bread for the week', 'need', '🥛'], ['Toothpaste', 'need', '🪥'], ['Winter boots (yours have holes)', 'need', '🥾'], ['Bus fare to school', 'need', '🚌'], ['Medicine your doctor prescribed', 'need', '💊'],
      ['A notebook your teacher asked for', 'need', '📓'], ['Soap', 'need', '🧼'], ['Rice and beans', 'need', '🍚'], ['Shampoo', 'need', '🧴'], ['Fixing your glasses (you can’t see the board)', 'need', '👓'],
      ['A candy bar', 'want', '🍫'], ['A new video game', 'want', '🎮'], ['A concert ticket', 'want', '🎫'], ['A second hoodie in a new colour', 'want', '👕'], ['Movie snacks', 'want', '🍿'],
      ['A sparkly phone case', 'want', '📱'], ['Bubble tea', 'want', '🧋'], ['Trading cards', 'want', '🃏'], ['A fancy water bottle (yours works fine)', 'want', '🥤'], ['A new skin for your game character', 'want', '🧙']
    ].map(function (x) { return { t: x[0], bin: x[1], icon: x[2], why: x[1] === 'need' ? 'You need it to live, stay healthy, or go to school.' : 'Nice to have, but you’d be okay without it.' }; }) } }
};
/* MODEL END */

/* HELP START ── between lessons, on fresh seeds. Nothing here touches the run. No DOM. Money in cents. ── */
function pickN(r, a, n) { var b = a.slice(), out = []; while (out.length < n && b.length) out.push(b.splice(Math.floor(r() * b.length), 1)[0]); return out; }
function stepR(r, lo, hi, st) { return lo + Math.floor(r() * (Math.floor((hi - lo) / st) + 1)) * st; }
function leftTask(seed) { // a trade-off in numbers: money left after a buy, and how much more the goal needs
  var r = RNG(seed * 13 + 1); r();
  var have = stepR(r, 4000, 9000, 500), buy = stepR(r, 1500, have - 1000, 500), saved = stepR(r, 5000, 15000, 1000), goal = stepR(r, saved + have + 5000, saved + have + 30000, 1000);
  return { have: have, buy: buy, saved: saved, goal: goal, left: have - buy, more: goal - saved - (have - buy) };
}
function budgetTask(seed) { // Leo's budget: what he saves now, and what he must save each month for a goal
  var r = RNG(seed * 17 + 3); r();
  var inc = stepR(r, 8000, 16000, 1000), a = stepR(r, 2000, 4000, 500), b = stepR(r, 1500, 3500, 500), c = Math.max(0, inc - a - b - stepR(r, 0, 3000, 500)), goal = stepR(r, 10000, 30000, 1000), months = [3, 4, 5, 6][Math.floor(r() * 4)];
  return { inc: inc, spend: [['Snacks', a], ['Gaming', b], ['Movies', c]], saving: inc - a - b - c, goal: goal, months: months, need: Math.ceil(goal / months) };
}
function monthsTask(seed) { var r = RNG(seed * 19 + 5); r(); var per = stepR(r, 2000, 9000, 500), goal = stepR(r, 15000, 60000, 1000); return { per: per, goal: goal, exact: goal / per, months: Math.ceil(goal / per) }; }
function fundTask(seed) { var r = RNG(seed * 23 + 7); r(); var fund = stepR(r, 20000, 50000, 5000), per = stepR(r, 2500, 6000, 500), used = stepR(r, 5000, fund - 5000, 1000); return { fund: fund, per: per, months: Math.ceil(fund / per), used: used, left: fund - used, refill: Math.ceil(used / per) }; }
var NEEDWANT = GAME_CFGS.shopper.cfg.items;
function needWantTask(seed) { var r = RNG(seed * 29 + 11); r(); var n = pickN(r, NEEDWANT.filter(function (x) { return x.bin === 'need'; }), 2), w = pickN(r, NEEDWANT.filter(function (x) { return x.bin === 'want'; }), 2); return pickN(r, n.concat(w), 4); }
var TERMS = [['A $40 video game next month', 'short'], ['Saving for college', 'long'], ['Saving for retirement', 'long'], ['A $120 concert ticket in 2 months', 'short'], ['A used car in 2 years', 'long'], ['A birthday gift for a friend next week', 'short'], ['A down payment on a home someday', 'long'], ['New running shoes this month', 'short']];
function termTask(seed) { var r = RNG(seed * 31 + 13); r(); var s = pickN(r, TERMS.filter(function (x) { return x[1] === 'short'; }), 2), l = pickN(r, TERMS.filter(function (x) { return x[1] === 'long'; }), 2); return pickN(r, s.concat(l), 4); }
function statementTask(seed) { // a townsperson's statement: a hidden charge one time in three … or none
  var r = RNG(seed * 37 + 17); r();
  var tricks = [['trial', 'SnackBox Club', 999, 'A free trial that turned into a monthly charge'], ['upgrade', 'SnackBox Club PLUS', 1499, 'An upgrade nobody asked for'], ['twice', 'Arcade card top-up (again)', 2000, 'Charged twice for one thing']];
  var t = r() < 0.75 ? tricks[Math.floor(r() * tricks.length)] : null;
  return { income: stepR(r, 9000, 30000, 1000), fun: stepR(r, 2000, 6000, 500), jar: stepR(r, 2000, 8000, 500), trick: t };
}
var TRADE_QS = [
  { id: 'snacks', label: 'The trade-off in a choice', text: 'Leo has $20. He can buy snacks for the week, or put it toward headphones. What’s the trade-off if he buys snacks?', opts: [
    ['He gives up $20 toward the headphones, so they take longer.', 1, 'Right. Every dollar is a choice.'], ['There’s no trade-off. Snacks are cheap.', 0, 'Even $20 is $20 not saved.'], ['He loses the headphones forever.', 0, 'Not forever. Just later.']] },
  { id: 'saving', label: 'Saving is a trade-off too', text: 'If I save my money instead of spending it, is that still a trade-off?', opts: [
    ['Yes. You give up something you could enjoy now, for something later.', 1, 'Right. Choosing on purpose is the point.'], ['No. Saving is always free.', 0, 'You give up spending it now.'], ['Only if the bank charges a fee.', 0, 'The trade-off is what you don’t buy now.']] },
  { id: 'nofun', label: 'Does a budget mean no fun?', text: 'My friend says a budget means you can’t have any fun. Is that true?', opts: [
    ['No. A budget plans some fun money too. Budgets with no fun often break.', 1, 'Right. Choose your fun on purpose.'], ['Yes. Budgets are only for needs.', 0, 'Most budgets include fun. That’s why they work.'], ['Yes, until you’re an adult.', 0, 'Budgets work at any age, with fun in them.']] },
  { id: 'security', label: 'Why savings reduce stress', text: 'Why do people with savings feel less stressed?', opts: [
    ['A surprise won’t wreck their plans or put them in debt.', 1, 'Right. That’s financial security.'], ['Because money is fun to look at.', 0, 'It’s about being ready, not looking.'], ['Because they never have surprises.', 0, 'Everyone has surprises. Savings help handle them.']] }
];
function mailKind(seed, last) { var k = ['left']; if (last >= 1) k.push('budget', 'needwant'); if (last >= 2) k.push('months'); if (last >= 3) k.push('fund'); return k[RNG(seed * 7 + 3)() * k.length | 0]; }
/* HELP END */

  var T = window.CEFLTown, K = T.kit, esc = T.esc;
  var fmt = K.fmt, fmtW = K.fmtW, step = K.step;
  function mFmt(c) { var v = Math.round(c) / 100; return v + (v === 1 ? ' month' : ' months'); }
  var SHOP = T.gameKit.sortRush(GAME_CFGS.shopper.cfg), SHOP_PAY = 800;
  var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June'];

  /* ── State ── */
  function init() { return { v: 1, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), ans: {}, typed: {}, story: {}, run: null, plan: null, shops: {}, asks: {}, lastAsk: -9, pendingAsk: null, stmts: {}, finished: false }; }
  function validate(S) { return !!S && S.v === 1 && !!S.typed && !!S.story && !!S.shops && !!S.stmts && (!S.run || (!!CARDS[S.run.card] && Array.isArray(S.run.log))); }
  function C(S) { return CARDS[S.run.card]; }

  /* ── Panels ── */
  function careful(run) { // the plan the test player makes: fun at the floor, an emergency fund built early, the rest to the goal
    var m = run.m + 1, c = CARDS[run.card], free = freeOf(run, m), target = Math.round(c.surprise * 1.2 / 500) * 500 + 1000, fun = Math.min(free, c.floor);
    var ef = Math.max(0, Math.min(free - fun, target - run.ef)); if (m <= 3) ef = Math.min(ef, Math.ceil(target / 3 / 500) * 500);
    return { fun: fun, ef: Math.max(0, ef), jar: free - fun - Math.max(0, ef) };
  }
  function planPanel(api, S) {
    var run = S.run, m = run.m + 1, c = C(S), free = freeOf(run, m), rep = repayOf(run, m), p = S.plan && S.plan.m === m ? S.plan : { m: m, fun: Math.min(free, c.floor), ef: 0, jar: 0 };
    return api.panel({ title: MONTH_NAMES[m - 1] + ' (month ' + m + ' of 6): plan your budget', name: 'plan', wide: true, data: {}, render: function (body, done, ui) {
      function left() { return free - p.fun - p.ef - p.jar; }
      function row(k, label, sub, icon) { return '<div class="ct-line"><span class="what">' + icon + ' ' + label + '<small>' + sub + '</small></span><span class="ct-row"><button class="ct-btn ck-mv" type="button" data-d="-500" data-k="' + k + '" aria-label="' + label + ': 5 dollars less">−5</button><input class="ct-inp" style="width:6.5em" id="pl-' + k + '" inputmode="decimal" autocomplete="off" value="' + (p[k] / 100).toFixed(2) + '" aria-label="' + label + '"><button class="ct-btn ck-mv" type="button" data-d="500" data-k="' + k + '" aria-label="' + label + ': 5 dollars more">+5</button></span><span></span></div>'; }
      function draw() {
        var L = left(), jarAfter = run.jar + p.jar, pace = run.jar + p.jar * (6 - run.m);
        body.innerHTML = '<div class="ct-doc"><div class="ct-doc-h"><b>Money in this month</b><span>' + esc(c.label) + '</span></div>' +
          K.doc(null, [['Income', MONTH_NAMES[m - 1], fmt(c.income[m - 1]), '']].concat(run.bonus[m] ? [['Smart Shopper coupon', 'from Valley Market', '+' + fmt(run.bonus[m]), '']] : []).concat(rep ? [['Paying back your cousin', 'debt from last month, with the 20% extra', '−' + fmt(rep), 'ded']] : [])
            .concat(c.needs.map(function (n) { return [n[1], 'a need', '−' + fmt(n[2]), 'ded']; })).concat([['Left to plan', 'every dollar gets a job', fmt(free), 'net']])).replace('<div class="ct-doc">', '<div>') + '</div>' +
          '<h3>Give every dollar a job</h3><div class="ct-doc">' + row('fun', 'Fun', 'snacks, games, outings: wants', '🎈') + row('ef', 'Emergency fund', 'for surprises (now ' + fmt(run.ef) + ')', '🛟') + row('jar', 'Goal jar', 'locked until month 6 (now ' + fmt(run.jar) + ' of ' + fmtW(c.goal) + ')', c.goalIcon) +
          '<div class="ct-line ' + (L === 0 ? 'net' : 'ded') + '"><span class="what">Left to place</span><span class="amt" id="plLeft">' + fmt(L) + '</span><span></span></div></div>' +
          (api.mode === 'gentle' ? '<div class="ct-note">' + [p.fun < c.floor ? '⚠ Fun is under ' + fmt(c.floor) + '. Budgets with almost no fun often break: you end up spending on impulse.' : '✓ Some fun money: good.',
            run.ef + p.ef < Math.round(c.surprise * 0.8) ? '⚠ Your emergency fund is ' + fmt(run.ef + p.ef) + '. Will that cover a surprise?' : '✓ Emergency fund: ' + fmt(run.ef + p.ef) + '.',
            'At this pace, your goal jar ends near ' + fmt(pace) + ' (goal ' + fmtW(c.goal) + ').'].join('<br>') + '</div>' : '') +
          '<p class="ct-small">Your bank statement comes at the end of the month. Tip: your Income card is in your Bag.</p>' +
          '<div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="plGo"' + (L === 0 ? '' : ' disabled') + '>' + (L === 0 ? 'Save my budget' : L > 0 ? 'Place ' + fmt(L) + ' more' : 'Over by ' + fmt(-L)) + '</button></div>';
        Array.prototype.forEach.call(body.querySelectorAll('[data-d]'), function (b) { b.addEventListener('click', function () { var k = b.dataset.k; p[k] = Math.max(0, p[k] + Number(b.dataset.d)); draw(); var n = body.querySelector('[data-k="' + k + '"][data-d="' + b.dataset.d + '"]'); if (n) n.focus(); }); });
        Array.prototype.forEach.call(body.querySelectorAll('input'), function (i) { i.addEventListener('change', function () { var v = api.parseMoney(i.value); if (!isNaN(v)) p[i.id.slice(3)] = Math.max(0, v); draw(); var n = body.querySelector('#' + i.id); if (n) n.focus(); }); });
        body.querySelector('#plGo').addEventListener('click', function () { if (left() !== 0) return; S.plan = p; api.save(); done(p); });
      }
      ui.data.solve = function (how) { var q = how === 'wrong' ? (function () { var fun = Math.round(free * 0.55); return { fun: fun, ef: 0, jar: free - fun }; })() : careful(run); p.fun = q.fun; p.ef = q.ef; p.jar = q.jar; draw(); body.querySelector('#plGo').click(); };
      draw();
    } });
  }
  function monthPanel(api, S, l) {
    var c = C(S), rows = [['💵 Income in', fmt(l.income + l.bonus), '']];
    if (l.repaid) rows.push(['↩️ Paid back to your cousin', '−' + fmt(l.repaid), 'bad']);
    c.needs.forEach(function (n) { rows.push(['🧾 ' + n[1], '−' + fmt(n[2]), '']); });
    rows.push(['🎈 Fun', '−' + fmt(l.fun), ''], ['🛟 To your emergency fund', fmt(l.efIn), ''], [c.goalIcon + ' To your goal jar', fmt(l.jarIn), 'good']);
    l.ev.forEach(function (e) {
      var how = e.fromEf && e.borrowed ? fmt(e.fromEf) + ' from your emergency fund, and ' + fmt(e.borrowed) + ' borrowed (you owe ' + fmt(e.owe) + ')' : e.borrowed ? 'borrowed from your cousin: you owe ' + fmt(e.owe) + ' (20% extra)' : 'paid from your emergency fund';
      rows.push([e.kind === 'surprise' ? '⚡ Surprise!' : e.kind === 'impulse' ? '🛍️ Impulse buy' : '📦 SnackBox Club', '<b>' + esc(e.kind === 'surprise' ? e.text + ' ' + fmt(e.amt) + '.' : e.kind === 'impulse' ? e.text + ' ' + fmt(e.amt) + '.' : fmt(e.amt) + ' came out.') + '</b> ' + esc(how) + '.', e.borrowed ? 'bad' : '']);
    });
    return K.timeline(api, { title: MONTH_NAMES[l.m - 1] + ': how the month went', name: 'month', rows: rows.map(function (r) { return { label: r[0], html: r[1], tone: r[2] }; }),
      total: { label: 'Goal jar:', from: l.jar - l.jarIn, to: l.jar, fmt: fmt }, outro: '<p>Emergency fund: <b>' + fmt(l.ef) + '</b>.' + (l.debt ? ' You owe your cousin <b>' + fmt(l.debt) + '</b>. It comes out of next month first.' : ' No debt.') + '</p>', doneText: 'Get my statement at the bank' });
  }
  /* The bank statement: one line may be a charge you never meant to pay (the SnackBox Club) */
  function statementRows(lines) { return lines.map(function (x) { return { k: x[0], name: x[1], sub: x[2] || '', val: x[3], tone: x[4] || '' }; }); }
  function myStatement(api, S) {
    var l = S.run.log[S.run.log.length - 1], c = C(S), L = [['in', 'Deposit: ' + (S.run.card === 'ty' ? 'pay from your job' : S.run.card === 'noah' ? 'snow and yard customers' : 'babysitting and allowance'), MONTH_NAMES[l.m - 1], fmt(l.income + l.bonus)]];
    if (l.repaid) L.push(['back', 'Transfer to your cousin', 'paying back', '−' + fmt(l.repaid), 'ded']);
    c.needs.forEach(function (n) { L.push([n[0], n[1], 'a need', '−' + fmt(n[2]), 'ded']); });
    L.push(['fun', 'Card purchases: snacks and fun', 'your fun money', '−' + fmt(l.fun), 'ded'], ['ef', 'Transfer to emergency fund', 'savings', '−' + fmt(l.efIn), 'ded'], ['jar', 'Transfer to goal jar', 'savings', '−' + fmt(l.jarIn), 'ded']);
    l.ev.forEach(function (e) { L.push([e.kind, e.kind === 'trial' ? 'SNACKBOX CLUB monthly' : e.kind === 'impulse' ? 'Impulse purchase' : 'Surprise: ' + c.surpriseText.replace(/\.? ?(New ones cost|Fixing it costs)$/, ''), e.kind === 'trial' ? 'auto-payment' : 'paid', '−' + fmt(e.amt), 'ded']); });
    var root = l.ev.some(function (e) { return e.kind === 'trial'; }) ? 'trial' : null;
    var ex = { in: 'That’s your money coming in. It matches.', back: 'You did borrow last month. That’s the payback.', fun: 'That’s the fun money you planned.', ef: 'That matches your plan.', jar: 'That matches your plan.', impulse: 'That one is yours, sadly. The impulse buy.', surprise: 'That one is real. The surprise.', gas: 'That’s your business gas. A need.', phone: 'That’s your phone bill.', bus: 'That’s your bus pass.' };
    var o = { title: MONTH_NAMES[l.m - 1] + ': your bank statement', name: 'statement', story: true, intro: 'Sam hands you your statement. Check every line against your budget.', tapLine: 'Is there a charge you didn’t plan? Tap it, then dispute it.',
      head: '<b>Riverbend Bank</b><span>' + esc(api.profile.name) + ' · month ' + l.m + '</span>', rows: statementRows(L), root: root, explain: ex,
      signLabel: 'It’s all right', disputeLabel: 'Dispute this charge', okLine: 'Every line matches your budget.', rightLine: function () { return 'Caught it! You never planned a SnackBox Club charge. Sam cancels it and gets your $9.99 back.'; },
      badLine: 'You okayed a charge you never planned. The SnackBox Club will keep charging $9.99 a month.', gentleHint: 'Compare each line with your budget. Did you plan every charge?', stampBad: 'Disputed', stampOk: 'Checked',
      key: 'stmt-m' + l.m, label: 'Month ' + l.m + ' statement' + (root ? ' (it had a charge you never planned)' : ' (all correct)'), ch: api.ch };
    return K.check(api, o).then(function () { return o.out; });
  }
  function storyStatement(api, who, name, rows, rootK, title) {
    return K.check(api, { title: title, name: 'story-stmt', story: true, intro: name + ' shows you a bank statement.', tapLine: 'Is a line wrong? Tap it, then dispute it.', head: '<b>Riverbend Bank</b><span>' + esc(name) + '</span>', rows: statementRows(rows), root: rootK,
      explain: function (k) { return { in: 'That’s pay coming in.', fun: 'That’s spending ' + name + ' planned.', jar: 'That’s ' + name + '’s own savings transfer.', bus: 'That’s the bus pass.', phone: 'That’s the phone bill.' }[k] || 'That line checks out.'; },
      signLabel: 'It’s all right', disputeLabel: 'Dispute this charge', rightLine: function () { return 'Caught it! ' + name + ' never planned that charge.'; }, badLine: 'That one charge was never planned. It will keep coming every month.', stampBad: 'Found it' });
  }
  function shopOpts(api, seed, help) {
    return { title: 'Smart Shopper' + (help ? ': an extra round' : ' at Valley Market'), name: 'minigame', game: SHOP, seed: seed, seconds: 60, leave: !!help, skipNote: 'Skipping is okay. You just won’t win a coupon.',
      tierText: help ? K.payTiers(SHOP_PAY)
        : { great: 'Mr. Huang gives you a ' + fmt(COUPON) + ' coupon. It adds to next month’s money.', ok: 'Good sorting! No coupon this time.', poor: 'Needs and wants can be tricky. Try again next time.' } };
  }
  async function shopRound(api, S, key, n) {
    if (!S.shops[key]) { var r = await api.minigame(shopOpts(api, S.seed * 47 + n, false)); S.shops[key] = { tier: r.tier, score: r.score }; if (r.tier === 'great') S.run.bonus[S.run.m + 1] = (S.run.bonus[S.run.m + 1] || 0) + COUPON; api.save(); api.hud(); }
    var t = S.shops[key].tier;
    await api.say('huang', t === 'great' ? 'A sharp shopper! Here’s your coupon. Spend it wisely. Or save it!' : t === 'ok' ? 'Nicely done. Most shoppers mix those up.' : t === 'skip' ? 'Maybe next time!' : 'Needs keep you going. Wants are nice to have. You’ll get it.');
  }

  /* ── Between lessons ── */
  var HELPS = [
    { id: 'mm-left', who: 'worker', after: 0, pay: 600, label: 'A trade-off in numbers', ask: 'My kid wants to buy something. Can you help with the math?', run: async function (api, seed) {
      var t = leftTask(seed);
      var g = await api.calc({ title: 'Help Mo: a trade-off', name: 'help-left', intro: '<p>Mo: “My kid has <b>' + fmtW(t.have) + '</b> and wants to spend <b>' + fmtW(t.buy) + '</b> on a game. She already saved <b>' + fmtW(t.saved) + '</b> toward a <b>' + fmtW(t.goal) + '</b> bike.”</p>',
        fields: [{ k: 'l', name: 'Money left after the game', ans: t.left, hint: fmtW(t.have) + ' − ' + fmtW(t.buy) + '.' }, { k: 'm', name: 'How much more the bike still needs, if she saves what’s left', ans: t.more, hint: fmtW(t.goal) + ' − ' + fmtW(t.saved) + ' − what’s left.' }] });
      if (g) await api.say('worker', 'So the game costs her ' + fmtW(t.buy) + ' of bike. I’ll let her decide. On purpose.'); return g; } },
    { id: 'mm-trade', who: 'rosa', after: 0, pay: 500, label: 'Trade-offs', ask: 'Can I ask you a money question?', run: async function (api, seed) { return K.askGrade(await api.ask('rosa', TRADE_QS[seed % TRADE_QS.length], null)); } },
    { id: 'mm-budget', who: 'dev', after: 1, pay: 1000, label: 'Fix a budget', ask: 'My little cousin’s budget saves nothing. Can you help?', run: async function (api, seed) {
      var t = budgetTask(seed);
      var g = await api.calc({ title: 'Help Dev: fix a budget', name: 'help-budget', intro: '<p>Dev’s cousin earns <b>' + fmtW(t.inc) + '</b> a month and spends: ' + t.spend.map(function (s) { return s[0].toLowerCase() + ' ' + fmtW(s[1]); }).join(', ') + '. The goal: <b>' + fmtW(t.goal) + '</b> in <b>' + t.months + ' months</b>.</p>',
        fields: [{ k: 's', name: 'Saving now, each month', ans: t.saving, hint: fmtW(t.inc) + ' minus all the spending.' }, { k: 'n', name: 'Savings needed each month for the goal', sub: 'round up to the cent', ans: t.need, alts: [Math.floor(t.goal / t.months)], hint: fmtW(t.goal) + ' ÷ ' + t.months + '.' }] });
      if (g) await api.say('dev', 'So he cuts a little from gaming and movies, keeps some fun, and saves. Easy. Kind of.'); return g; } },
    { id: 'mm-needwant', who: 'avery', after: 1, pay: 600, label: 'Needs or wants', ask: 'I’m making a shopping list. Can you help me sort it?', run: async function (api, seed) {
      var t = needWantTask(seed); var g = await K.sort(api, { title: 'Help Avery: needs or wants?', name: 'help-sort', leave: true, intro: 'A <b>need</b> is something you need to live, stay healthy or go to school. A <b>want</b> is nice to have.', bins: GAME_CFGS.shopper.cfg.bins, items: t.map(function (x, i) { return { id: 'i' + i, text: x.t, icon: x.icon, bin: x.bin, why: x.why }; }) });
      if (g) await api.say('avery', 'Needs first, then a little fun. Got it.'); return g; } },
    { id: 'mm-months', who: 'jas', after: 2, pay: 800, label: 'How long to a goal', ask: 'How long will it take me to save up? Can you work it out?', run: async function (api, seed) {
      var t = monthsTask(seed);
      var g = await api.calc({ title: 'Help Jas: how many months?', name: 'help-months', intro: '<p>Jas saves <b>' + fmtW(t.per) + '</b> a month for a <b>' + fmtW(t.goal) + '</b> goal.</p>', fields: [{ k: 'm', name: 'Months to reach the goal', sub: 'round up to a whole month', fmt: mFmt, ans: t.months * 100, alts: [Math.round(t.exact * 100)], hint: fmtW(t.goal) + ' ÷ ' + fmtW(t.per) + ', then round up.' }] });
      if (g) await api.say('jas', t.months + ' months. I’m writing it on my calendar.'); return g; } },
    { id: 'mm-term', who: 'librarian', after: 2, pay: 600, label: 'Short-term or long-term', ask: 'I’m making a display about money goals. Can you sort these?', run: async function (api, seed) {
      var t = termTask(seed); var g = await K.sort(api, { title: 'Help Mx. Lin: short-term or long-term?', name: 'help-sort', leave: true, intro: '<b>Short-term</b> goals take weeks or months. <b>Long-term</b> goals take a year or more.', bins: [{ id: 'short', label: 'Short-term', icon: '⏱️' }, { id: 'long', label: 'Long-term', icon: '🗓️' }], items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[1] === 'short' ? 'Weeks or months away.' : 'A year or more away.' }; }) });
      if (g) await api.say('librarian', 'Lovely. The display goes up tomorrow.'); return g; } },
    { id: 'mm-fund', who: 'okafor', after: 3, pay: 800, label: 'Build an emergency fund', ask: 'A client of mine wants to build an emergency fund. Can you work out the months?', run: async function (api, seed) {
      var t = fundTask(seed);
      var g = await api.calc({ title: 'Help Ms. Okafor: an emergency fund', name: 'help-fund', intro: '<p>A client wants a <b>' + fmtW(t.fund) + '</b> emergency fund and saves <b>' + fmtW(t.per) + '</b> a month. Later, a surprise uses <b>' + fmtW(t.used) + '</b> of it.</p>',
        fields: [{ k: 'm', name: 'Months to build the fund', sub: 'round up', fmt: mFmt, ans: t.months * 100, alts: [Math.round(t.fund / t.per * 100)], hint: fmtW(t.fund) + ' ÷ ' + fmtW(t.per) + ', then round up.' }, { k: 'l', name: 'Left in the fund after the surprise', ans: t.left, hint: fmtW(t.fund) + ' − ' + fmtW(t.used) + '.' }] });
      if (g) await api.say('okafor', 'An emergency fund: the most boring thing that ever saved someone’s day. Big play!'); return g; } },
    { id: 'mm-stmt', who: 'grandpa', after: 3, pay: 1000, label: 'Check a bank statement', ask: 'Can you look at my statement? These things confuse me.', run: async function (api, seed) {
      var t = statementTask(seed), rows = [['in', 'Pension deposit', '', fmt(t.income)], ['fun', 'Card purchases', 'groceries and coffee', '−' + fmt(t.fun), 'ded'], ['jar', 'Transfer to savings', '', '−' + fmt(t.jar), 'ded']];
      if (t.trick) rows.splice(2, 0, ['trick', t.trick[1], 'auto-payment', '−' + fmt(t.trick[2]), 'ded']);
      var g = await K.check(api, { title: 'Help Grandpa: check his statement', name: 'help-stmt', leave: true, intro: 'Grandpa only planned his groceries, coffee and savings.', head: '<b>Riverbend Bank</b><span>Grandpa</span>', rows: statementRows(rows), root: t.trick ? 'trick' : null,
        explain: { in: 'That’s his pension.', fun: 'He planned that.', jar: 'His own savings.' }, signLabel: 'It’s all right', disputeLabel: 'Dispute this charge', rightLine: function () { return 'Caught it! ' + t.trick[3] + '.'; }, badLine: 'That charge was never planned.' });
      if (g) await api.say('grandpa', t.trick ? 'Sneaky. I never signed up for that. Thank you!' : 'All mine? Good. I do like my coffee.'); return g; } },
    { id: 'mm-shop', who: 'huang', after: 1, pay: SHOP_PAY, label: 'An extra Smart Shopper round', game: true, ask: 'The Smart Shopper belt is running! Want a round?', run: async function (api, seed) {
      var r = await api.minigame(shopOpts(api, seed, true)); return K.gameGrade(r); } }
  ];
  var GOSSIP = [
    { id: 'g-pat-0', who: 'vendor', after: -1, lines: ['There’s a new kiosk at Valley Market. SnackBox Club. Free snacks!', 'Nothing is free. I sell plants. I would know.'] },
    { id: 'g-gp-0', who: 'grandpa', after: -1, lines: ['In my day, we kept money in a jar under the bed.', 'Your grandma had a jar for everything. Even a jar for jars.'] },
    { id: 'g-avery-0', who: 'avery', after: -1, lines: ['I babysit three times a month. I should have lots saved.', 'Where does it all go? It’s a mystery.'] },
    { id: 'g-dev-1', who: 'dev', after: 0, lines: ['I tried the SnackBox free sample. The cookies were great.', 'You just tap your card to “confirm your free box.” Easy.'] },
    { id: 'g-sam-1', who: 'sam', after: 0, lines: ['People ask me where their money went. I hand them their statement.', 'The answer is almost always on page one.'] },
    { id: 'g-huang-2', who: 'huang', after: 1, lines: ['That SnackBox kiosk pays me rent. But people complain to ME about it.', 'I just sell groceries!'] },
    { id: 'g-mo-2', who: 'worker', after: 1, lines: ['I keep a fun budget now. Twenty bucks for coffee and treats.', 'Funny thing: I spend less than before I had a budget.'] },
    { id: 'g-skip-3', who: 'skip', after: 2, lines: ['SnackBox Club! First box free! Tap here!', 'The fine print? It’s... very fine. Very, very small.'] },
    { id: 'g-mayor-3', who: 'mayor', after: 2, lines: ['Twenty-two complaints about SnackBox charges this month.', 'People keep saying “I never signed up.” They did. Without knowing it.'] },
    { id: 'g-avery-4', who: 'avery', after: 3, lines: ['I got my SnackBox money back! All of it!', 'Now I read my statement every month. With a highlighter.'] },
    { id: 'g-sam-4', who: 'sam', after: 3, lines: ['The {name} Check is on every statement now: “Did you plan every line?”', 'Complaints are down. Smiles are up. My puns are the same.'] },
    { id: 'g-skip-4', who: 'skip', after: 3, lines: ['New rule at SnackBox: we ask out loud before a monthly plan starts.', 'Sales are down a bit. Honesty is up a lot. My boss is... adjusting.'] }
  ];
  function gossip(S, api) { return K.gossip(GOSSIP, api); }
  function mailTask(seed, last) {
    var k = mailKind(seed, last), from = 'Sam';
    if (k === 'left') { var t = leftTask(seed); return { label: 'Town Mail: a trade-off', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Sam:</p><p>“You have ' + fmtW(t.have) + ' and buy something for ' + fmtW(t.buy) + '. How much is left?”</p>', fields: [{ k: 'l', name: 'Money left', ans: t.left, hint: fmtW(t.have) + ' − ' + fmtW(t.buy) + '.' }] }); } }; }
    if (k === 'budget') { var b = budgetTask(seed); return { label: 'Town Mail: savings needed', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Sam:</p><p>“A ' + fmtW(b.goal) + ' goal in ' + b.months + ' months. How much each month?”</p>', fields: [{ k: 'n', name: 'Savings each month', ans: b.need, alts: [Math.floor(b.goal / b.months)], hint: fmtW(b.goal) + ' ÷ ' + b.months + '.' }] }); } }; }
    if (k === 'needwant') { var n = needWantTask(seed); return { label: 'Town Mail: needs or wants', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, intro: 'A letter from Sam: “Needs or wants?”', bins: GAME_CFGS.shopper.cfg.bins, items: n.map(function (x, i) { return { id: 'i' + i, text: x.t, icon: x.icon, bin: x.bin, why: x.why }; }) }); } }; }
    if (k === 'months') { var mt = monthsTask(seed); return { label: 'Town Mail: months to a goal', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Sam:</p><p>“' + fmtW(mt.per) + ' a month toward ' + fmtW(mt.goal) + '. How many months?”</p>', fields: [{ k: 'm', name: 'Months (round up)', fmt: mFmt, ans: mt.months * 100, alts: [Math.round(mt.exact * 100)], hint: fmtW(mt.goal) + ' ÷ ' + fmtW(mt.per) + ', then round up.' }] }); } }; }
    var f = fundTask(seed);
    return { label: 'Town Mail: an emergency fund', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Sam:</p><p>“A ' + fmtW(f.fund) + ' emergency fund, saving ' + fmtW(f.per) + ' a month. How many months?”</p>', fields: [{ k: 'm', name: 'Months (round up)', fmt: mFmt, ans: f.months * 100, alts: [Math.round(f.fund / f.per * 100)], hint: fmtW(f.fund) + ' ÷ ' + fmtW(f.per) + ', then round up.' }] }); } };
  }

  /* ── Steps ── */
  var ASKS = {
    burnout: { text: 'Last month you spent almost nothing on fun, and then you spent on impulse. What would help?', opts: [['Plan some fun money on purpose, so I don’t break the budget.', 1, 'Right. A budget isn’t about no fun. It’s about choosing your fun.'], ['Plan even less fun next time.', 0, 'That’s what led to the impulse buy.'], ['Stop making a budget.', 0, 'Without a plan, the money disappears faster.']] },
    surprise: { text: 'The surprise put you in debt, and borrowing cost 20% extra. What would help?', opts: [['Keep money in an emergency fund, so a surprise doesn’t become debt.', 1, 'Yes. That’s financial security.'], ['Put everything in the goal jar.', 0, 'The jar is locked. You still need money for surprises.'], ['Hope there are no more surprises.', 0, 'Surprises always come. Be ready.']] },
    slow: { text: 'Your goal jar is falling behind, and a lot went to fun. What would help?', opts: [['Move some fun money to the goal jar, and keep a little fun.', 1, 'Right. Less fun, not no fun.'], ['Move all the fun money to the jar.', 0, 'No-fun budgets often break. Keep a little.'], ['Do the same thing again.', 0, 'Same plan, same pace.']] }
  };
  function wantAsk(S) { var t = helpTopic(S.run), a; if (!t) return null; a = S.asks[t]; if (a && (a.first >= 2 || a.seen >= 4)) return null; if (S.run.m - S.lastAsk < 2) return null; return t; }
  function month(m) {
    return [
      step('plan' + m, async function (api, S) {
        await api.quest(m === 1 ? 'Go home and plan your first month at the kitchen table' : 'Go home and plan ' + MONTH_NAMES[m - 1] + ' at the kitchen table', 'table');
        if (S.pendingAsk) {
          var t = S.pendingAsk; S.asks[t] = S.asks[t] || { seen: 0, first: 0 }; S.asks[t].seen++; S.lastAsk = S.run.m;
          var key = 'ask-' + t + '-m' + S.run.m, before = S.ans[key];
          await api.ask('rosa', ASKS[t], key, 'What would help? (' + { burnout: 'budget burnout', surprise: 'a surprise became debt', slow: 'jar behind' }[t] + ')', api.ch);
          if (!before && S.ans[key].first) S.asks[t].first++;
          S.pendingAsk = null;
        }
        if (S.run.m < m) { await planPanel(api, S); var l = runMonth(S.run, S.plan); api.save(); api.hud(); await monthPanel(api, S, l); }
      }),
      step('stmt' + m, async function (api, S) {
        await api.quest('Get your ' + MONTH_NAMES[m - 1] + ' statement from Sam at the bank', 'sam');
        if (!S.stmts[m]) {
          if (m === 1) await api.say('sam', ['Statement time! Every month I print one. It lists every dollar in and out.', 'Check it against your budget. If a line surprises you, ask.']);
          var out = await myStatement(api, S);
          if (out && out.result === 'caught') { disputeTrial(S.run); api.hud(); }
          S.stmts[m] = out ? out.result : 'ok'; api.save();
        }
        S.pendingAsk = wantAsk(S); api.hud();
      })
    ];
  }
  function chapterSteps(ch, S, api) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the bank and say hi to Sam', 'sam');
        await api.say('sam', ['Hi! I’m Sam. I work at the bank, and I tell the town’s worst money jokes.', 'Here’s a puzzle. Maya and Jake each earn $100 a month. After 6 months, Maya has $300 saved. Jake has $0.']);
        await api.ask('sam', { text: 'They earned the same money. What did Maya do differently?', opts: [['She made a plan for her money, and saved part of it every month.', 1, 'Yes! A plan, made on purpose. That’s a budget.'], ['She earned more than Jake.', 0, 'They earned exactly the same: $100 a month.'], ['She never spent anything at all.', 0, 'She had $300 of $600. She spent some too!']] }, 'q-maya', 'Maya and Jake: what made the difference', 0);
        await api.say('sam', ['Every dollar is a choice. Choosing one thing means giving up another. That’s a trade-off.', 'Let me show you Ava.']);
      }));
      a.push(step('ava', async function (api, S) {
        await api.say('sam', ['Ava is 13. She earned $60 babysitting. Her favourite band is playing, and a ticket costs $45.', 'She’s also saving for a $360 bike.']);
        var g = await api.calc({ title: 'Ava’s choice', name: 'ava', noPay: true, intro: '<p>Ava has <b>$60</b>. The concert ticket is <b>$45</b>. She is saving for a <b>$360</b> bike.</p>', fields: [{ k: 'l', name: 'Money left to save if she buys the ticket', ans: 1500, hint: '$60 − $45.' }] });
        api.record('q-ava', 'Ava’s trade-off: money left after the ticket', 0, g === 'first');
        await K.pick(api, { id: 'avaTicket', title: 'Should Ava buy the ticket?', name: 'pickava', intro: 'Neither choice is wrong. A good choice means knowing what you give up.', options: [{ k: 'buy', title: 'Buy the ticket', icon: '🎫', lines: [['She gets', 'The concert'], ['She gives up', '$45 toward the bike']] }, { k: 'save', title: 'Save it all', icon: '🚲', lines: [['She gets', '$60 closer to the bike'], ['She gives up', 'The concert']] }],
          reasonPrompt: 'Why? Name what she gives up.' });
      }));
      a.push(step('card', async function (api, S) {
        await api.say('sam', ['Now you. Pick an income card. You don’t have to use your own money.', 'You’ll save for a goal for six months. Every month, I’ll give you a statement.']);
        var keys = ['ava', 'noah', 'ty'], i = await api.choose('sam', 'Which income card will you play?', keys.map(function (k) { return CARDS[k].label + ': ' + CARDS[k].goalName + ', ' + fmtW(CARDS[k].goal); }));
        S.run = newRun(keys[i], S.seed); api.give('Income card ' + C(S).card, '🪪', 'sam'); api.hud();
        await api.say('sam', [C(S).who, 'Your goal: ' + C(S).goalName + ' (' + fmtW(C(S).goal) + ') in six months. Your goal jar is locked until then, so you can’t take money back out.', 'And keep some money for surprises. Trust me.']);
      }));
      a.push(step('sample', async function (api, S) { // your own choice: the free sample
        S.story.kiosk = 1; api.refresh();
        await api.quest('Valley Market is giving out free samples. Go have a look.', 'skip');
        await api.say('skip', ['Hi hi! I’m Skip, from SnackBox Club! Want a FREE box of snacks?', 'Just tap your card to confirm your free box. It’s free! Totally free!']);
        var i = await api.choose('skip', 'Tap your card for a free box?', ['Sure, free snacks!', 'No thanks']);
        if (S.run.m === 0) S.run.trial = i === 0;
        await api.say('skip', i === 0 ? 'Enjoy! The cookies are the best part.' : 'Your loss! More cookies for everyone else.');
      }));
      a.push(step('hunch', async function (api, S) { // the side story starts
        await api.quest('Avery is outside the bank, counting coins', 'avery');
        await api.say('avery', ['I babysit three times a month. I put money in my savings jar.', 'But my bank account keeps shrinking. A little bit, every month. I can’t figure out why.']);
        await api.say('you', ['I don’t know how to read a bank statement yet. But Sam says I’ll learn.', 'I’ll keep notes.']);
        S.story.avery1 = 1; api.give('Money notes', '🔍', 'avery'); api.refresh();
      }));
      a.push(step('end1', async function (api, S) {
        await api.quest('Tell Sam about Avery', 'sam');
        await K.typed(api, { id: 'goalTrade', title: 'Your goal', prompt: 'You are saving for ' + C(S).goalName + '. What will you give up to save for it? (What is the trade-off?)' });
        await api.say('sam', ['Good. Now do Step 1 of your project: pick a real goal and look up its real price.', 'Next time: a budget. A plan where every dollar gets a job.']);
      }));
    }
    if (ch === 1) {
      a.push(step('leo', async function (api, S) {
        await api.quest('Sam wants to show you a budget', 'sam');
        await api.say('sam', ['A budget is a written plan for how you’ll use your money. Here’s Leo’s.', 'He earns $100 a month mowing lawns. He spends $40 on snacks, $35 on gaming and $25 on movies. He wants $150 headphones.']);
        var g = await api.calc({ title: 'Leo’s budget', name: 'leo', noPay: true, intro: '<p>Leo earns <b>$100</b> a month. Snacks $40, gaming $35, movies $25. Headphones cost <b>$150</b>.</p>',
          fields: [{ k: 's', name: 'What Leo saves now, each month', ans: 0, hint: '$100 − $40 − $35 − $25.' }, { k: 'n', name: 'What he must save each month to buy them in 5 months', ans: 3000, hint: '$150 ÷ 5.' }] });
        api.record('q-leo', 'Leo’s budget: saving now, and savings needed', 1, g === 'first');
        await api.ask('sam', TRADE_QS[2], 'q-nofun', 'Does a budget mean no fun?', 1);
      }));
      a = a.concat(month(1));
      a.push(step('shop1', async function (api, S) {
        await api.quest('Mr. Huang is running the Smart Shopper challenge at Valley Market', 'huang');
        if (!S.shops.ch2) await api.say('huang', ['Smart Shopper! One minute. Sort what rolls by: need or want.', 'Do great, and I’ll give you a $5 coupon.']);
        await shopRound(api, S, 'ch2', 2);
      }));
      a = a.concat(month(2));
      a.push(step('avery2', async function (api, S) { // clue 1: Avery's statement
        await api.quest('You can read a statement now. Go help Avery.', 'avery');
        await api.say('avery', ['Here’s my statement from last month. Can you see where my money went?', 'I planned babysitting money in, snacks, and my savings transfer. That’s it.']);
        await storyStatement(api, 'avery', 'Avery', [['in', 'Deposit: babysitting', '', fmt(9000)], ['fun', 'Card purchases: snacks', '', '−' + fmt(2000), 'ded'], ['snack', 'SNACKBOX CLUB monthly', 'auto-payment', '−' + fmt(999), 'ded'], ['jar', 'Transfer to savings', '', '−' + fmt(5000), 'ded']], 'snack', 'Avery’s statement').then(function (g) { api.record('story-avery', 'Avery’s statement: find the charge she never planned', 1, g === 'first'); });
        await api.say('avery', ['SnackBox Club? I took a free sample! I never joined anything!', 'That’s $9.99 every month. For months!']);
        await api.say('you', 'The free sample started a monthly plan. I’m writing this down.');
        S.story.avery2 = 1; api.toast('Added to your Money notes: Avery’s statement'); api.save();
      }));
      a.push(step('end2', async function (api, S) {
        await api.quest('Tell Sam what you found', 'sam');
        await api.say('sam', ['A free sample that charges every month. Sneaky. Check your own statements too!', 'Now do Step 2 of your project: your income, and the start of your budget.', 'Next time: setting goals, and how long they take.']);
      }));
    }
    if (ch === 2) {
      a.push(step('ty', async function (api, S) {
        await api.quest('Sam has a goal-setting example', 'sam');
        await api.say('sam', ['Ty is 17. He earns about $1,023 a month. He has two goals: a $120 concert in 2 months, and a $4,000 used car.', 'A good goal says what, how much, and by when.']);
        var g = await api.calc({ title: 'Ty’s car', name: 'tycar', noPay: true, intro: '<p>Ty’s car costs <b>$4,000</b>.</p>', fields: [{ k: 'a', name: 'Months to save it at $250 a month', fmt: mFmt, ans: 1600, hint: '$4,000 ÷ $250.' }, { k: 'b', name: 'Savings each month to have it in 12 months', ans: 33334, alts: [33333], hint: '$4,000 ÷ 12.' }] });
        api.record('q-ty', 'Ty’s car: months to a goal, and savings for a date', 2, g === 'first');
        await K.sort(api, { title: 'Short-term or long-term?', name: 'terms', story: true, key: 'q-terms', label: 'Short-term or long-term goals', ch: 2, intro: '<b>Short-term</b> goals take weeks or months. <b>Long-term</b> goals take a year or more.', bins: [{ id: 'short', label: 'Short-term', icon: '⏱️' }, { id: 'long', label: 'Long-term', icon: '🗓️' }], items: TERMS.slice(0, 6).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[1] === 'short' ? 'Weeks or months away.' : 'A year or more away.' }; }) });
      }));
      a = a.concat(month(3));
      a.push(step('dev3', async function (api, S) { // clue 2: Dev's upgrade, then the source
        await api.quest('Dev is upset about his statement', 'dev');
        await api.say('dev', ['Look at this! SnackBox Club PLUS? $14.99?', 'I took ONE free box. Now they “upgraded” me. I never said yes to anything.']);
        await storyStatement(api, 'dev', 'Dev', [['in', 'Deposit: pay', '', fmt(42000)], ['phone', 'Phone bill', '', '−' + fmt(3500), 'ded'], ['fun', 'Card purchases', '', '−' + fmt(6000), 'ded'], ['snack', 'SNACKBOX CLUB PLUS monthly', 'auto-payment', '−' + fmt(1499), 'ded'], ['jar', 'Transfer to savings', '', '−' + fmt(10000), 'ded']], 'snack', 'Dev’s statement').then(function (g) { api.record('story-dev', 'Dev’s statement: find the upgrade nobody asked for', 2, g === 'first'); });
        S.story.dev = 1; api.save();
        await api.quest('Ask Skip at the SnackBox kiosk to see the sign-up card', 'skip');
        await api.say('skip', ['The sign-up card? Sure. It’s all in there. Somewhere.']);
        await K.inspect(api, { title: 'The SnackBox sign-up card', name: 'card', story: true, key: 'story-card', label: 'The SnackBox card: find the tricks', ch: 2, find: 'Find the 3 tricks in the fine print', cols: 3,
          intro: 'Tap every line that could take money without people knowing.',
          spots: [{ id: 'auto', icon: '🔁', label: '*Your free box starts a monthly plan at $9.99', bad: true, why: 'A “free” sample that becomes a monthly charge.', hint: 'What happens after the free box?' }, { id: 'up', icon: '⬆️', label: '*Plans upgrade to PLUS ($14.99) after 2 months', bad: true, why: 'An upgrade nobody asked for.' },
            { id: 'mail', icon: '✉️', label: '*To cancel, mail a letter to our head office', bad: true, why: 'Hard to cancel on purpose.' }, { id: 'free', icon: '🍪', label: 'FREE box of snacks!', fine: 'The box really was free. The trick is in the fine print.' },
            { id: 'tap', icon: '💳', label: 'Tap your card to confirm', fine: 'Tapping isn’t a trick by itself. What it signs you up for is.' }, { id: 'flavour', icon: '🧁', label: 'Pick your flavours online', fine: 'That’s just a menu.' }] });
        await api.say('skip', ['Okay, okay. The fine print is... strategic. My boss wrote it.', 'Most people never read it. They just want cookies.']);
        S.story.card = 1; api.toast('Added to your Money notes: the sign-up card'); api.save();
      }));
      a.push(step('shop2', async function (api, S) {
        await api.quest('Mr. Huang is running Smart Shopper again', 'huang');
        await shopRound(api, S, 'ch3', 3);
      }));
      a = a.concat(month(4));
      a.push(step('end3', async function (api, S) {
        await api.quest('Check in with Sam', 'sam');
        await api.say('sam', ['The fine print! I’ll take it to the bank manager. Bring your notes next time.', 'Now do Step 3 of your project: finish your budget so it reaches your goal by a date.', 'Next time: surprises. Are you ready for one?']);
      }));
    }
    if (ch === 3) {
      a.push(step('ready', async function (api, S) {
        await api.quest('Sam has a story about surprises', 'sam');
        await api.say('sam', ['Ty drops his phone. The screen cracks. Fixing it costs $180.', 'Path A: he has an emergency fund, money saved for surprises. Path B: he doesn’t.']);
        await api.ask('sam', { text: 'Which path gives Ty more financial security?', opts: [['Path A. The surprise is paid, and his car goal is safe.', 1, 'Yes. An emergency fund protects your other goals.'], ['Path B. He can just borrow.', 0, 'Borrowing often costs extra, and it delays his goals.'], ['They’re the same.', 0, 'On Path B, he delays his goal or goes into debt.']] }, 'q-paths', 'Path A or B: the emergency fund', 3);
        var g = await api.calc({ title: 'Ty’s emergency fund', name: 'tyfund', noPay: true, intro: '<p>Ty wants a <b>$300</b> emergency fund. He saves <b>$40</b> a month.</p>', fields: [{ k: 'm', name: 'Months to build it', sub: 'round up to a whole month', fmt: mFmt, ans: 800, alts: [750], hint: '$300 ÷ $40, then round up.' }] });
        api.record('q-tyfund', 'Months to build an emergency fund', 3, g === 'first');
      }));
      a = a.concat(month(5));
      a.push(step('proof', async function (api, S) { // the hero beat: you name each trick at the bank
        S.scene = 'bank'; api.refresh();
        await api.quest('Sam called a meeting at the bank. Bring your Money notes.', 'sam');
        api.fx.face('all');
        await api.say('sam', ['Thanks for coming, everyone. People keep losing money and can’t say why.', api.profile.name + ' has been keeping notes. Show us what’s going on.']);
        await K.proof(api, { title: 'The disappearing dollars', name: 'proof', intro: 'For each statement, show the bank <b>what trick took the money</b>.', keyPrefix: 'proof-', labelPrefix: 'At the bank: ', ch: 3, stamp: 'Found',
          choices: [{ k: 'trial', label: 'A free sample that turned into a monthly charge' }, { k: 'upgrade', label: 'An upgrade nobody asked for' }, { k: 'cancel', label: 'Charged after cancelling' }, { k: 'twice', label: 'Charged twice for one thing' }],
          hint: { trial: 'Did they ever mean to join?', upgrade: 'Look at the name and the price.', cancel: 'Look at the dates.', twice: 'Look for the same thing twice.' },
          items: [{ id: 'avery', title: 'Avery’s statement', facts: 'Took a free box in the fall.', html: K.doc(null, [['SNACKBOX CLUB monthly', 'auto-payment', '−$9.99', 'ded']]), ans: 'trial' },
            { id: 'dev', title: 'Dev’s statement', facts: 'Was on the $9.99 plan.', html: K.doc(null, [['SNACKBOX CLUB PLUS monthly', 'auto-payment', '−$14.99', 'ded']]), ans: 'upgrade' },
            { id: 'gp', title: 'Grandpa’s statement', facts: 'Mailed a cancel letter on March 3.', html: K.doc(null, [['SNACKBOX CLUB monthly', 'April 1', '−$9.99', 'ded']]), ans: 'cancel' }] });
        await api.say('skip', ['...Every one of those is real. I’m sorry.', 'I called my boss. SnackBox will refund everyone, and from now on we ask out loud before any monthly plan starts.']);
        await K.hero(api, { who: 'sam', lines: ['From today, every Riverbend statement gets a line at the top: “Did you plan every line? If not, ask us.”', 'It started with ' + api.profile.name + ', so it’s called the ' + api.profile.name + ' Check.'],
          medal: 'Money Detective medal', icon: '🏅', kicker: 'Riverbend Bank', title: 'The ' + api.profile.name + ' Check', thanks: [['avery', 'My money’s back! Every penny!'], ['dev', 'No more PLUS. Just regular me.']], reply: ['Thanks, everyone! Check your statement every month. It takes two minutes.'] });
        S.story.hero = 1; S.scene = null; api.refresh();
      }));
      a = a.concat(month(6));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and open your goal jar', 'table');
        var o = outcome(S.run), c = C(S), firstTime = !S.finished;
        S.finished = true; S.win = !!o.win;
        if (o.win) { api.place('goal', 'home', 6, 4, { draw: 'key', label: c.goalName }); api.fx.confetti(30); await api.say('you', ['The jar has ' + fmt(S.run.jar) + '! That’s enough for ' + c.goalName + '!', 'And I still have ' + fmt(S.run.ef) + ' in my emergency fund. No debt.']); }
        else if (o.why === 'debt') await api.say('you', ['The jar has ' + fmt(S.run.jar) + '. But I still owe my cousin ' + fmt(S.run.debt) + '.', 'So it doesn’t count yet. Next time: an emergency fund first.']);
        else await api.say('you', ['The jar has ' + fmt(S.run.jar) + '. I needed ' + fmtW(c.goal) + '. I’m ' + fmt(c.goal - S.run.jar) + ' short.', 'Too much went to fun, or to paying back debt.']);
        if (firstTime) api.profileAdd('closet', 'saver');
        api.profileAdd('plan', { mission: '7-money-management', title: 'Saving for Something Real', text: 'Saving for ' + c.goalName + ' (' + fmtW(c.goal) + '): ' + (o.win ? 'reached in 6 months' : 'not reached yet') + '. Emergency fund: ' + fmt(S.run.ef) + '.' });
        api.profileAdd('finished', '7-money-management'); api.refresh();
        await api.say('sam', [o.win ? 'Goal reached AND ready for surprises! That’s financial security.' : 'So close. You learned how a plan holds up. Replay the chapter from the Menu to try again.', 'Your closet has a new Saver’s cardigan, and your My Plan wall has a new page.', 'Now do Step 4 of your project: draw a surprise card and compare two ways of spending.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }

  /* ── Register ── */
  T.mission({
    id: '7-money-management', unitLabel: 'CEFL Grade 7 · Money Management · Project: Saving for Something Real', title: 'Saving Up: Every Dollar Has a Job',
    iCan: 'I can explain trade-offs, build a budget that reaches a goal, and keep an emergency fund for surprises.',
    foot: 'This is a model. Prices are samples; your project uses real prices. The people and businesses are made up.',
    bagTip: 'Your Bag holds what you collect: your Income card, your budget, your statements and your Money notes.',
    realRule: 'Real gives no hints while you plan', afterLine: 'Mission complete. Check your statement every month! Open Menu → Report to show your teacher.',
    chapters: [
      { name: 'Every dollar is a choice', step: 'Step 1', moment: 'Moment 1: trade-offs' },
      { name: 'A plan for your money', step: 'Step 2', moment: 'Moment 2: budgets' },
      { name: 'Setting a money goal', step: 'Step 3', moment: 'Moment 3: money goals' },
      { name: 'Ready for surprises', step: 'Step 4', moment: 'Moment 4: emergency funds' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps, guide: 'sam',
    helpers: function () { return HELPS; }, gossip: gossip, mail: function (S, seed, last) { return mailTask(seed, last); },
    outfit: function (S) { return S.finished ? 'saver' : 'none'; },
    placeObjects: function (api, S) { api.place('table', 'home', 4, 3, { label: 'Kitchen table' }); api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true }); if (S.finished && S.win) api.place('goal', 'home', 6, 4, { draw: 'key', label: 'Your goal' }); },
    people: function (S) {
      var out = {}, s = S.story;
      out.huang = { name: 'Mr. Huang', role: 'Valley Market', map: 'grocer', x: 4, y: 3, dir: 'down', look: { base: 2, skin: 's2', hair: 'black', shirt: 'green', pants: '#3b3f5c' } };
      out.skip = { name: 'Skip', role: 'SnackBox Club', map: 'grocer', x: 6, y: 4, dir: 'left', look: { base: 0, skin: 's4', hair: 'blue', shirt: 'yellow', pants: '#2f2f38' }, hidden: !s.kiosk };
      if (S.scene === 'bank') { out.avery = { map: 'bank', x: 1, y: 4, dir: 'right' }; out.dev = { map: 'bank', x: 2, y: 4, dir: 'right' }; out.grandpa = { map: 'bank', x: 6, y: 4, dir: 'left' }; out.skip = { name: 'Skip', role: 'SnackBox Club', map: 'bank', x: 6, y: 5, dir: 'up', look: { base: 0, skin: 's4', hair: 'blue', shirt: 'yellow', pants: '#2f2f38' } }; }
      return out;
    },
    doorOpen: function (id) { return !!{ home: 1, grandpa: 1, bank: 1, grocer: 1, library: 1, townhall: 1, jobcentre: 1, servicecanada: 1 }[id]; },
    lockedLine: function (id) { return T.world.building(id).name + ' is closed right now. Try the bank or Valley Market.'; },
    talk: function (id, S, api) {
      var s = S.story, r = S.run, done = S.finished;
      var lines = {
        sam: !r ? 'Welcome to the bank! I’d tell you a joke about money, but it’s not worth it.' : 'Goal jar: ' + fmt(r.jar) + '. Emergency fund: ' + fmt(r.ef) + (r.debt ? '. You owe ' + fmt(r.debt) + '.' : '.') + (done ? ' Nice saving!' : ''),
        huang: 'Fresh bananas! Green, but fresh.', skip: s.hero ? 'We ask out loud now. “Do you want a monthly plan?” Most people say no. Fair.' : s.card ? 'The fine print is... strategic.' : 'Free snacks! Free! Just tap!',
        avery: s.hero ? 'I read my statement with a highlighter now.' : s.avery2 ? 'SnackBox! I never meant to join anything!' : s.avery1 ? 'My account keeps shrinking. Where does it go?' : 'I babysit three times a month!',
        dev: s.dev ? 'PLUS. I never said PLUS.' : 'Payday is the best day. Pizza day is second.', rosa: 'A budget isn’t about no fun. It’s about choosing your fun.',
        grandpa: 'In my day, we had a jar for everything.', worker: 'Twenty bucks a month for coffee. Planned. On purpose.',
        table: 'The kitchen table. This is where you plan your month.', goal: 'You did it!',
        myplan: K.planLine(api)
      };
      return lines[id] || null;
    },
    hud: function (S) {
      if (!S.run) return [{ label: 'Goal', value: 'Talk to Sam' }];
      var c = C(S), out = [{ label: 'Goal jar', value: fmt(S.run.jar) + ' / ' + fmtW(c.goal), title: 'Locked until month 6: ' + c.goalName }, { label: 'Emergency fund', value: fmt(S.run.ef) }, { label: 'Month', value: Math.min(6, S.run.m + (S.run.m < 6 ? 1 : 0)) + ' of 6' }];
      if (S.run.debt) out.push({ label: 'Debt', value: fmt(S.run.debt), warn: true, tag: 'owed' });
      return out;
    },
    items: function (S) {
      var it = [];
      if (!S.run) return it;
      var c = C(S);
      it.push({ name: 'Income card ' + c.card, icon: '🪪', note: c.goalName, view: function () { return '<p><b>' + esc(c.label) + '</b></p><p>' + esc(c.who) + '</p><p>Goal: <b>' + esc(c.goalName) + '</b>, ' + fmtW(c.goal) + ', in 6 months.</p>' + K.table(MONTH_NAMES.map(function (n, i) { return [n, fmt(c.income[i])]; }), ['Month', 'Income']) + (c.needs.length ? '<p>Needs every month: ' + c.needs.map(function (n) { return esc(n[1]) + ' ' + fmt(n[2]); }).join(', ') + '.</p>' : '<p>Your family pays your needs. Your money is for fun and saving.</p>'); } });
      if (S.run.log.length) it.push({ name: 'Statements', icon: '🧾', note: S.run.log.length + ' month' + (S.run.log.length === 1 ? '' : 's'), view: function () { return K.table(S.run.log.map(function (l) { return [MONTH_NAMES[l.m - 1], fmt(l.income + l.bonus), fmt(l.fun), fmt(l.efIn), fmt(l.jarIn), l.ev.map(function (e) { return e.kind === 'trial' ? 'SnackBox ' + fmt(e.amt) : e.kind === 'impulse' ? 'Impulse ' + fmt(e.amt) : 'Surprise ' + fmt(e.amt); }).join(', ') || '—', fmt(l.debt)]; }), ['Month', 'In', 'Fun', 'To fund', 'To jar', 'Events', 'Owed']); } });
      if (S.story.avery1) it.push({ name: 'Money notes', icon: '🔍', note: 'The disappearing dollars', view: function () { return K.notes(notes(S)); } });
      if (S.story.hero) it.push({ name: 'Money Detective medal', icon: '🏅', note: 'The ' + T.api.profile.name + ' Check', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🏅</p><p style="text-align:center"><b>Money Detective</b><br>For reading the statements nobody read, and getting the town its money back.</p>'; } });
      return it;
    },
    report: function (S) {
      if (!S.run) return '<p>Not started yet.</p>';
      var c = C(S), h = '<p>Income card: <b>' + esc(c.label) + '</b> · Goal: ' + esc(c.goalName) + ' (' + fmtW(c.goal) + ')' + (S.finished ? ' · <b>' + (S.win ? 'Goal reached' : 'Goal not reached') + '</b>' : '') + '</p>';
      if (S.run.log.length) h += '<h3>Months</h3>' + K.table(S.run.log.map(function (l) { return [MONTH_NAMES[l.m - 1], fmt(l.income + l.bonus - l.repaid), fmt(l.fun), fmt(l.efIn), fmt(l.jarIn), l.ev.map(function (e) { return e.kind + ' ' + fmt(e.amt) + (e.borrowed ? ' (borrowed ' + fmt(e.borrowed) + ')' : ''); }).join(', ') || '—', fmt(l.jar), fmt(l.debt)]; }), ['Month', 'To plan', 'Fun', 'To fund', 'To jar', 'Events', 'Jar', 'Owed']) +
        '<p class="ct-small">SnackBox free sample: ' + (S.run.trial ? 'taken' + (S.run.trialOff ? ', disputed in month ' + S.run.trialOff : ', never disputed') : 'said no') + '.</p>';
      var sh = Object.keys(S.shops);
      if (sh.length) h += '<h3>Smart Shopper</h3>' + K.table(sh.map(function (k) { var x = S.shops[k]; return [k === 'ch2' ? 'Chapter 2' : 'Chapter 3', String(x.score), { great: 'great ✓ (a $5 coupon)', ok: 'steady', poor: 'rough', skip: 'skipped' }[x.tier]]; }), ['When', 'Score', 'Result']);
      h += K.wrote(S, [['avaTicket', 'Should Ava buy the ticket?', function (k) { return k === 'buy' ? 'Buy it' : 'Save it'; }], ['goalTrade', 'What I give up for my goal']]);
      h += '<h3>The disappearing dollars</h3><p>' + (S.story.hero ? 'Solved: named every trick at the bank; the town got refunds, and the statement check was named after them.' : S.story.card ? 'Found the fine print.' : S.story.avery1 ? 'Collecting clues.' : 'Not started.') + '</p>';
      return h;
    },
    groupAnswer: function (k, a) { var m = /^stmt-m(\d)$/.exec(k); return m ? { id: 'stmts', label: 'Monthly bank statements (checked)', part: 'month ' + m[1] } : null; },
    test: { scenes: [null, { story: { kiosk: 1 } }, { scene: 'bank', story: { kiosk: 1 } }], CARDS: CARDS, newRun: newRun, runMonth: runMonth, outcome: outcome, freeOf: freeOf, repayOf: repayOf, disputeTrial: disputeTrial, helpTopic: helpTopic, careful: careful, GAME_CFGS: GAME_CFGS,
      leftTask: leftTask, budgetTask: budgetTask, monthsTask: monthsTask, fundTask: fundTask, needWantTask: needWantTask, termTask: termTask, statementTask: statementTask, mailTask: mailTask, HELPS: HELPS, GOSSIP: GOSSIP }
  });
  function notes(S) {
    var s = S.story, li = [];
    if (s.avery1) li.push('<b>Avery:</b> babysits and saves, but her account keeps shrinking a little every month. She can’t say why.');
    if (s.avery2) li.push('<b>Avery’s statement:</b> SNACKBOX CLUB, $9.99 a month. She took a free sample and never meant to join.');
    if (S.run && S.run.trial) li.push('<b>My own statement:</b> I took the free sample too. ' + (S.run.trialOff ? 'I disputed the charge in month ' + S.run.trialOff + ' and got it back.' : 'Check for SnackBox charges from month 3!'));
    if (s.dev) li.push('<b>Dev’s statement:</b> SNACKBOX CLUB PLUS, $14.99. Upgraded without asking.');
    if (s.card) li.push('<b>The sign-up card:</b> the free box starts a $9.99 monthly plan, plans upgrade after 2 months, and you can only cancel by mail.');
    if (s.hero) li.push('<b>The ' + esc(T.api.profile.name) + ' Check:</b> “Did you plan every line?” on every statement. SnackBox refunded everyone.');
    return li;
  }
})();
