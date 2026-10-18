/* CEFL Town mission: Grade 7 Income and Tax — "Payday" (companion to the project First Paycheque). LO 7-IT.
   Four chapters, one after each project step. You play "future you" at 17, 19 or 24 and plan 8 paycheques:
   plan the jar at home, work a shift, check or build the pay stub, deposit at the bank.
   Model: the v1 pay model, copied unchanged (MODEL START … MODEL END; the v1 tests run on it), plus the sign-off block below.
   Win = the goal jar is full after paycheque 8 and the bank is not overdrawn.
   Simplifications: as v1 (Pay Card tax estimate; CPP from the paycheque after the 18th birthday; bills per two weeks; no overtime;
   cash tips not on the stub; EI and CPP benefits as stories; $45 bounce fee; a Chapter 1 overdraft covered once), and a boss's
   payroll mistake is always one root line (the lines after it follow from it). */
(function () {
  'use strict';

/* MODEL START ── Pay model (no DOM in this part). All money is in cents. ── */
var PAY_CARD = [ // gross every 2 weeks → income tax. Copied from the Pay Card (2026) in cefl7-income-tax-project-v1.md
  [600, 0], [700, 941], [800, 2341], [900, 3935], [1000, 6135], [1100, 8335], [1200, 10535], [1300, 12735],
  [1400, 14935], [1500, 17135], [1600, 19335], [1700, 21535], [1800, 23735], [1900, 25935], [2000, 28135],
  [2100, 30335], [2200, 32535]
];
var FEE = 4500, PERIODS = 8, STRIKE_FROM = 3, STRIKES_TO_LOSE = 2;
var FED_FREE = 16452, AB_FREE = 22769, AB_RATE = 0.08, AB_HEALTH = 0.41, AB_EDU = 0.13; // 2026 figures from the workbook
function eiOf(g) { return Math.round(g * 0.0163); }
function cppOf(g, age) { return age >= 18 ? Math.max(0, Math.round((g - 13500) * 0.0595)) : 0; }
function rowOf(g) { // nearest Pay Card row in dollars ($50 rounds up); $600 stands for the "$300 to $600" row
  return Math.max(600, Math.min(2200, Math.floor((g + 5000) / 10000) * 100));
}
function taxAtRow(r) { var i; for (i = 0; i < PAY_CARD.length; i++) if (PAY_CARD[i][0] === r) return PAY_CARD[i][1]; return 0; }
function taxOf(g) { return taxAtRow(rowOf(g)); }
function taxFormula(row) { // how the Pay Card was made (teacher guide): 14 % above $16,452 + 8 % above $22,769, per pay
  var y = row * 26;
  return Math.round((Math.max(0, y - FED_FREE) * 0.14 + Math.max(0, y - AB_FREE) * AB_RATE) / 26 * 100);
}
function stubOf(g, age) {
  var s = { gross: g, ei: eiOf(g), cpp: cppOf(g, age), tax: taxOf(g) };
  s.total = s.ei + s.cpp + s.tax; s.net = g - s.total;
  return s;
}
function abTaxYear(g) { return Math.round(Math.max(0, g / 100 * 26 - AB_FREE) * AB_RATE * 100); } // Alberta income tax for a year of this pay

var WORKERS = {
  avery: { name: 'Avery', age: 17, turns18: 6, goal: 110000, goalLabel: 'a used laptop for school', home: 'Lives at home and goes to high school.', colour: '#2563eb',
    bills: [['phone', 'Phone', 3000], ['bus', 'Bus pass', 2500], ['food', 'Lunches and fun', 7000]],
    jobs: ['grocer', 'busser', 'sports'] },
  dev: { name: 'Dev', age: 19, goal: 220000, goalLabel: 'a damage deposit and first month’s rent', home: 'Shares an apartment with a friend.', colour: '#7c3aed',
    bills: [['rent', 'Rent (shared)', 45000], ['phone', 'Phone', 3500], ['bus', 'Transit pass', 5000], ['food', 'Groceries', 20000], ['fun', 'Fun', 9000]],
    jobs: ['warehouse', 'bikeshop', 'phones'] },
  rosa: { name: 'Rosa', age: 24, goal: 200000, goalLabel: 'an emergency fund', home: 'Shares a house and pays off a student loan.', colour: '#0f766e',
    bills: [['rent', 'Rent (shared)', 55000], ['phone', 'Phone', 4500], ['car', 'Car: insurance and gas', 15000], ['food', 'Groceries', 22000], ['loan', 'Student loan', 8000], ['fun', 'Fun', 8000]],
    jobs: ['office', 'apprentice', 'furniture'] }
};
var JOBS = {
  grocer:    { type: 'wage', title: 'Grocery clerk', biz: 'Valley Market', what: 'Stock shelves and help customers.', rate: 1300, rate18: 1500,
               hours: [24, 24, 20, 24, 24, 24, 16, 28], notes: { 3: 'Fewer shifts this pay.', 7: 'Exam week: fewer shifts.' } },
  busser:    { type: 'tips', title: 'Restaurant busser', biz: 'The Lantern Diner', what: 'Clear and set tables.', rate: 1300, rate18: 1500,
               hours: [20, 20, 20, 20, 20, 20, 16, 24], tips: [5500, 4000, 6000, 4500, 6500, 5000, 4000, 9000], notes: { 7: 'Exam week: fewer shifts.', 8: 'Holiday parties: busy!' } },
  sports:    { type: 'commission', title: 'Sales helper', biz: 'Northside Sports', what: 'Help customers find gear.', rate: 1300, rate18: 1500, pct: 0.02,
               hours: [16, 16, 16, 16, 16, 16, 12, 20], sales: [400000, 450000, 250000, 400000, 450000, 400000, 500000, 700000], notes: { 3: 'January is slow for sales.', 7: 'Exam week: fewer shifts.', 8: 'Holiday shopping: busy!' } },
  warehouse: { type: 'wage', title: 'Warehouse associate', biz: 'Prairie Parcel', what: 'Pack and ship orders.', rate: 1800,
               hours: [80, 80, 72, 80, 80, 72, 80, 80], notes: { 3: 'Statutory holiday: the warehouse is closed one day.', 6: 'One day closed for repairs.' } },
  bikeshop:  { type: 'salary', title: 'Service writer', biz: 'Spoke & Chain Bikes', what: 'Book repairs and talk with customers.', yearly: 3770000,
               hours: [80, 80, 80, 80, 80, 80, 80, 80], notes: {} },
  phones:    { type: 'commission', title: 'Sales associate', biz: 'CellPoint', what: 'Sell phones and phone plans.', rate: 1500, pct: 0.04,
               hours: [80, 80, 80, 80, 80, 80, 80, 80], sales: [500000, 600000, 300000, 550000, 650000, 450000, 900000, 800000], notes: { 3: 'January is slow for sales.', 7: 'Holiday shopping: busy!' } },
  office:    { type: 'salary', title: 'Office coordinator', biz: 'Riverbend Clinic', what: 'Run the front desk and the schedule.', yearly: 4680000,
               hours: [75, 75, 75, 75, 75, 75, 75, 75], notes: {} },
  apprentice:{ type: 'wage', title: 'Apprentice electrician', biz: 'Bright Spark Electric', what: 'Learn the trade on job sites.', rate: 2400,
               hours: [80, 80, 64, 80, 80, 80, 72, 80], notes: { 3: 'Cold snap: two days off the job site.', 7: 'One day off for a holiday.' } },
  furniture: { type: 'commission', title: 'Furniture sales', biz: 'Home & Hearth', what: 'Help people choose furniture.', rate: 1500, pct: 0.06,
               hours: [80, 80, 80, 80, 80, 80, 80, 80], sales: [1000000, 1100000, 600000, 1000000, 1100000, 900000, 1400000, 1300000], notes: { 3: 'January is slow for sales.', 7: 'Holiday shopping: busy!' } }
};

function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
/* The world for one run, fixed by the seed: which of paycheques 5 and 6 has a shift cut, and real sales and tips around the expected amounts */
function makeWorld(jk, seed) {
  var rng = RNG(seed), j = JOBS[jk], w = { cutAt: 5 + Math.floor(rng() * 2), sales: [], tips: [] }, i;
  for (i = 0; i < PERIODS; i++) {
    w.sales.push(j.sales ? Math.round(j.sales[i] * (0.85 + 0.3 * rng()) / 1000) * 1000 : 0);
    w.tips.push(j.tips ? Math.round(j.tips[i] * (0.8 + 0.4 * rng()) / 100) * 100 : 0);
  }
  return w;
}
function ageAt(wk, p) { var W = WORKERS[wk]; return W.turns18 && p >= W.turns18 ? 18 : W.age; }
function rateAt(j, wk, p) { return j.rate18 && ageAt(wk, p) >= 18 ? j.rate18 : j.rate; }
function cutHours(wk) { return wk === 'avery' ? 4 : 8; }
function extraHours(wk) { return wk === 'avery' ? 4 : 8; }
/* What the worker knows when planning paycheque p */
function scheduleOf(s, p) {
  var j = JOBS[s.job];
  return { hours: j.hours[p - 1] + (p === 5 && s.extra ? extraHours(s.worker) : 0), rate: j.type === 'salary' ? 0 : rateAt(j, s.worker, p), age: ageAt(s.worker, p),
           sales: j.sales ? j.sales[p - 1] : 0, tips: j.tips ? j.tips[p - 1] : 0,
           cutRisk: j.type !== 'salary' && (p === 5 || p === 6) ? cutHours(s.worker) : 0, note: j.notes[p] || '' };
}
function grossFrom(j, hours, rate, sales) {
  if (j.type === 'salary') return Math.round(j.yearly / 26);
  return hours * rate + (j.type === 'commission' ? Math.round(sales * j.pct) : 0);
}
/* What really happens in paycheque p */
function actualOf(s, p) {
  var j = JOBS[s.job], sc = scheduleOf(s, p), cut = j.type !== 'salary' && p === s.world.cutAt ? cutHours(s.worker) : 0,
      hours = sc.hours - cut, sales = s.world.sales[p - 1], g = grossFrom(j, hours, sc.rate, sales);
  return { hours: hours, cut: cut, extra: p === 5 && s.extra ? extraHours(s.worker) : 0, rate: sc.rate, age: sc.age, sales: sales, tips: s.world.tips[p - 1],
           stub: stubOf(g, sc.age) };
}
/* A careful estimate of take-home pay before the two weeks happen: planned hours minus any warned cut, 85 % of expected sales,
   80 % of expected tips. When the pay can come in higher, it may land on the next Pay Card row, so that row's extra tax is kept back too.
   (Because tax is read from the nearest row, a raise of a few dollars can cost up to $22; a raise of $50 or more always leaves more take-home pay.) */
function safeTakeHome(s, p) {
  var j = JOBS[s.job], sc = scheduleOf(s, p), g = grossFrom(j, sc.hours - sc.cutRisk, sc.rate, sc.sales * 0.85), r = rowOf(g),
      step = j.type === 'salary' || r >= 2200 ? 0 : taxAtRow(r + 100) - taxAtRow(r);
  return stubOf(g, sc.age).net - step + Math.round(sc.tips * 0.8);
}
function billsOf(wk) { return WORKERS[wk].bills.reduce(function (t, b) { return t + b[2]; }, 0); }
function newRun(wk, jk, seed) {
  return { worker: wk, job: jk, seed: seed, world: jk ? makeWorld(jk, seed) : null, p: 0, bank: 0, jar: 0, bounces: 0, strikes: 0, extra: false, covered: 0, log: [] };
}
function setJob(s, jk) { s.job = jk; s.world = makeWorld(jk, s.seed); }
/* Payday: take-home pay and tips come in; bills and the jar transfer go out. Under $0 means a payment bounced. */
function payday(s, jar, real) { // real: Real mode, where a bounce from paycheque 3 on counts toward losing
  var p = s.p + 1, a = actualOf(s, p), bills = billsOf(s.worker), bank = s.bank + a.stub.net + a.tips - bills - jar, bounced = bank < 0;
  if (bounced) { bank -= FEE; s.bounces++; if (real && p >= STRIKE_FROM) s.strikes++; }
  s.p = p; s.bank = bank; s.jar += jar;
  s.log.push({ p: p, hours: a.hours, cut: a.cut, extra: a.extra, sales: a.sales, tips: a.tips, age: a.age, stub: a.stub, bills: bills, jarIn: jar, bank: bank, bounced: bounced });
  return s.log[s.log.length - 1];
}
/* Chapter 2 starts clean: a family member covers a Chapter 1 overdraft, once, because deductions had not been taught yet */
function startChapter(s, ch) { if (ch === 2 && s.bank < 0) { s.covered = -s.bank; s.bank = 0; } }
function outcome(s) {
  if (s.strikes >= STRIKES_TO_LOSE) return { done: true, win: false, why: 'strikes' };
  if (s.p < PERIODS) return { done: false };
  if (s.jar < WORKERS[s.worker].goal) return { done: true, win: false, why: 'short' };
  if (s.bank < 0) return { done: true, win: false, why: 'overdrawn' };
  return { done: true, win: true };
}
/* "What would help?" after a payday. Choices are the real actions: move less, move more, or keep the jar transfer the same. */
function helpTopic(s) {
  var last = s.log[s.log.length - 1], W = WORKERS[s.worker], left = PERIODS - s.p, need = left ? (W.goal - s.jar) / left : 0;
  if (!last || s.p < STRIKE_FROM || s.p >= PERIODS) return null;
  if (last.bounced) return 'bounce';
  if (s.jar < W.goal && need > last.jarIn && s.bank >= Math.max(4000, need * 0.5)) return 'slow';
  return null;
}
/* MODEL END */

/* SIGN-OFF START ── the boss prepares the stub from Chapter 3; one root line may be wrong. No DOM. ── */
var ERR_CUT = 4, ERR_SALE = 100000; // an "hours" mistake leaves 4 hours off; a "commission" mistake leaves one $1,000 sale off
function errorKinds(s, p) {
  var a = actualOf(s, p), j = JOBS[s.job], k = [];
  if (j.type !== 'salary') k.push('hours');
  if (j.type === 'commission') k.push('commission');
  if (a.age < 18) k.push('cppMinor');
  else { k.push('cppExempt'); if (a.stub.gross >= 50000) k.push('ei'); }
  if (a.stub.gross >= 70000) k.push('taxRow');
  return k.filter(function (x) { return stubAsPrinted(s, p, null).net - stubAsPrinted(s, p, x).net >= 500; }); // every mistake is worth at least $5
}
/* The stub as the boss printed it. root: the first wrong line. */
function stubAsPrinted(s, p, kind) {
  var a = actualOf(s, p), j = JOBS[s.job], hours = a.hours, comm = j.type === 'commission' ? Math.round(a.sales * j.pct) : 0, g, st;
  if (kind === 'hours') hours = a.hours - ERR_CUT;
  if (kind === 'commission') comm = Math.round(Math.max(0, a.sales - ERR_SALE) * j.pct);
  g = j.type === 'salary' ? Math.round(j.yearly / 26) : hours * a.rate + comm;
  st = { hours: hours, rate: a.rate, sales: kind === 'commission' ? Math.max(0, a.sales - ERR_SALE) : a.sales, comm: comm, gross: g, ei: eiOf(g), cpp: cppOf(g, a.age), tax: taxOf(g), age: a.age, kind: kind || null };
  if (kind === 'cppMinor') st.cpp = Math.max(0, Math.round((g - 13500) * 0.0595));
  if (kind === 'cppExempt') st.cpp = Math.round(g * 0.0595);
  if (kind === 'ei') st.ei = Math.round(g * 0.0263);
  if (kind === 'taxRow') st.tax = taxAtRow(Math.min(2200, rowOf(g) + 200));
  st.total = st.ei + st.cpp + st.tax; st.net = st.gross - st.total;
  st.root = { hours: 'hours', commission: 'comm', cppMinor: 'cpp', cppExempt: 'cpp', ei: 'ei', taxRow: 'tax' }[kind] || null;
  return st;
}
/* Which paycheques have a mistake, fixed by the seed: one of 5 and 6, and paycheque 7 three times in five */
function errorPlan(seed) {
  var r = RNG(seed * 7 + 3), e = {}; r();
  e[r() < 0.5 ? 5 : 6] = 1;
  if (r() < 0.6) e[7] = 1;
  e.pick = Math.floor(r() * 1000);
  return e;
}
function errorKindFor(s, p, plan) {
  if (!plan[p]) return null;
  var k = errorKinds(s, p);
  return k[(plan.pick + p) % k.length];
}
/* Payday with a signed stub: the bank gets the printed net, so a mistake you signed costs that money */
function paydaySigned(s, jar, real, short) {
  var p = s.p + 1, a = actualOf(s, p), bills = billsOf(s.worker), net = a.stub.net - (short || 0),
      bank = s.bank + net + a.tips - bills - jar, bounced = bank < 0;
  if (bounced) { bank -= FEE; s.bounces++; if (real && p >= STRIKE_FROM) s.strikes++; }
  s.p = p; s.bank = bank; s.jar += jar;
  s.log.push({ p: p, hours: a.hours, cut: a.cut, extra: a.extra, sales: a.sales, tips: a.tips, age: a.age, stub: a.stub, bills: bills, jarIn: jar, bank: bank, bounced: bounced, short: short || 0 });
  return s.log[s.log.length - 1];
}
/* SIGN-OFF END */

  var T = window.CEFLTown;
  var FMT = { cents: function (c) { var n = Math.abs(Math.round(c)), d = Math.floor(n / 100), r = n % 100; return (c < 0 ? '−' : '') + '$' + String(d).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + (r < 10 ? '0' : '') + r; } };
  function fmt(c) { return FMT.cents(c); }
  function fmtW(c) { return Math.round(c) % 100 === 0 ? fmt(c).replace(/\.00$/, '') : fmt(c); }
  function parseMoney(t) { var s = String(t || '').replace(/[$,\s]/g, '').replace(/−/g, '-'); if (!/^-?\d*\.?\d*$/.test(s) || s === '' || s === '.' || s === '-') return NaN; return Math.round(parseFloat(s) * 100); }
  function close(a, b) { return Math.abs(a - b) <= 2; }
  var esc = T.esc;

  /* ── Situations ("future you") and workplaces ── */
  var SIT = {
    avery: { label: '17, living at home', short: 'You are 17. You live at home and go to high school.', family: 'mom', goalIcon: 'laptop' },
    dev:   { label: '19, sharing an apartment', short: 'You are 19. You share an apartment with your friend Dev.', family: 'dev', goalIcon: 'key' },
    rosa:  { label: '24, paying off a student loan', short: 'You are 24. You share a house with Rosa and pay off a student loan.', family: 'rosa', goalIcon: 'cert' }
  };
  var WORK = {
    grocer: { b: 'grocer', boss: 'Mr. Huang', outfit: 'apron', look: { base: 2, skin: 's2', hair: 'black', shirt: 'green', pants: '#3b3f5c' } },
    busser: { b: 'diner', boss: 'Ms. Pereira', outfit: 'busser', look: { base: 1, skin: 's3', hair: 'brown', shirt: 'red', pants: '#2f2f38' } },
    sports: { b: 'sports', boss: 'Coach Tam', outfit: 'polo', look: { base: 0, skin: 's2', hair: 'black', shirt: 'red', pants: '#2f3a5c' } },
    warehouse: { b: 'warehouse', boss: 'Mr. Kowalski', outfit: 'hivis', look: { base: 4 } },
    bikeshop: { b: 'bikeshop', boss: 'Bea', outfit: 'cap', look: { base: 3, skin: 's1', hair: 'blond', shirt: 'blue', pants: '#3b3f5c' } },
    phones: { b: 'phones', boss: 'Mr. Singh', outfit: 'lanyard', look: { base: 2, skin: 's3', hair: 'black', shirt: 'teal', pants: '#2f2f38' } },
    office: { b: 'clinic', boss: 'Ms. Ahmed', outfit: 'blazer', look: { base: 3, skin: 's3', hair: 'black', shirt: 'purple', pants: '#2f2f38' } },
    apprentice: { b: 'electric', boss: 'Joe', outfit: 'hardhat', look: { base: 5 } },
    furniture: { b: 'furniture', boss: 'Mrs. Novak', outfit: 'nametag', look: { base: 1, skin: 's1', hair: 'grey', shirt: 'purple', pants: '#3b3f5c' } }
  };
  function bossId(jk) { return 'boss_' + jk; }
  function payText(j) {
    if (j.type === 'salary') return fmtW(j.yearly) + ' a year (salary)';
    var s = fmt(j.rate) + ' an hour' + (j.rate18 ? ' (student rate)' : '');
    if (j.type === 'commission') s += ' + ' + Math.round(j.pct * 100) + '% of sales';
    if (j.type === 'tips') s += ' + cash tips';
    return s;
  }
  function offerQ(j) {
    if (j.type === 'salary') return { text: 'Gross pay every two weeks (26 pays a year)', ans: Math.round(j.yearly / 26) };
    if (j.type === 'commission') return { text: 'Gross pay for ' + j.hours[0] + ' hours with ' + fmtW(j.sales[0]) + ' in sales', ans: j.hours[0] * j.rate + Math.round(j.sales[0] * j.pct) };
    if (j.type === 'tips') return { text: 'Pay from the diner for ' + j.hours[0] + ' hours (tips not counted)', ans: j.hours[0] * j.rate };
    return { text: 'Gross pay for ' + j.hours[0] + ' hours', ans: j.hours[0] * j.rate };
  }
  function offerHow(j) {
    if (j.type === 'salary') return 'Yearly salary ÷ 26.';
    if (j.type === 'commission') return j.hours[0] + ' × ' + fmt(j.rate) + ' + ' + Math.round(j.pct * 100) + '% of ' + fmtW(j.sales[0]) + '.';
    return j.hours[0] + ' hours × ' + fmt(j.rate) + '.';
  }

  /* ── Questions (second person). Wrong choices come from the unit's misconception list. ── */
  function Q(id, S) {
    var j = S.run && S.run.job ? JOBS[S.run.job] : null, x = S.run ? extraHours(S.run.worker) : 0, yr;
    switch (id) {
      case 'paytype': return { label: 'Pay type: what is true', ch: 0, text: 'Which is true about how your new job pays?', opts: ({
        wage: [['My pay goes up and down with my hours. A short week means a smaller paycheque.', 1, 'Right. Wage pay is hours × the hourly wage.'], ['A wage pays the same every two weeks, no matter how many hours I work.', 0, 'That is a salary. A wage pays for each hour.'], ['A wage job always pays more than a salary job.', 0, 'Not always. It depends on the rate and the hours.']],
        salary: [['I get the same pay every two weeks, even when I work extra hours.', 1, 'Right. A salary is set for the year and split into 26 pays.'], ['A salary pays more when I work extra hours.', 0, 'A salary stays the same. Extra hours do not add pay.'], ['With a salary, nothing is taken off my pay.', 0, 'Deductions come off every kind of pay.']],
        commission: [['Part of my pay depends on what I sell, so a slow month means a smaller paycheque.', 1, 'Right. Commission is a percent of sales, and sales go up and down.'], ['Commission always pays more than a wage.', 0, 'Only when sales are good. A slow month pays less.'], ['Commission pay is the same every two weeks.', 0, 'Commission changes with sales.']],
        tips: [['Tips change with how busy it is and how much customers give, so they are hard to plan on.', 1, 'Right. Plan on the wage and treat tips as extra.'], ['Tips are the same every shift.', 0, 'Tips change every shift.'], ['Tips are part of my hourly wage, so the boss decides them.', 0, 'Tips come from customers, not from the wage.']]
      })[j.type] };
      case 'whyLess': return { label: 'Why less than the job promised', ch: 0, text: 'Why did less money land in your account than the pay the job promised?', opts: [
        ['Deductions came off first, like EI, CPP and income tax. What is left is the take-home pay.', 1, 'Right. The pay before deductions is gross pay. What lands in the bank is net pay.'],
        ['Your boss kept part of the pay as profit.', 0, 'Look at the stub. Each missing dollar has a name, and none of them is profit.'],
        ['The bank charged a fee for putting the pay in your account.', 0, 'The stub shows the money was gone before it reached the bank.']] };
      case 'extra':
        if (j.type === 'salary') return { label: 'Extra hours on a salary', ch: 2, text: 'If you work ' + x + ' extra hours this pay, what happens to your take-home pay?', opts: [
          ['It stays the same. A salary pays the same however many hours you work.', 1, 'Right. Extra hours on a salary do not add pay here.'],
          ['It goes up by ' + x + ' hours × an hourly rate.', 0, 'A salary has no hourly rate. The pay is set for the year.'],
          ['It goes down, because more hours means more tax.', 0, 'Tax depends on pay, not hours. The pay stays the same.']] };
        return { label: 'Extra hours: more or less take-home?', ch: 2, text: 'If you take ' + x + ' extra hours, what happens to your take-home pay?', opts: [
          ['It goes up. Income tax may go up a little, but you keep most of each extra dollar.', 1, 'Right. Earning more never leaves you with less take-home pay.'],
          ['It goes down, because more pay means a higher tax and you lose money.', 0, 'Only part of each extra dollar is taken off. Take-home pay still goes up.'],
          ['It stays the same, because deductions take all the extra pay.', 0, 'Deductions take a part, not all of it.']] };
      case 'newline': return { label: 'Turning 18: what changes', ch: 2, text: 'You just turned 18. What changes on your next pay stub?', opts: [
        ['CPP starts coming off, and my wage goes up to $15.00 because the student rate ends at 18.', 1, 'Right. CPP starts after a worker turns 18, and Alberta’s $13.00 student rate is only for students under 18.'],
        ['Income tax starts, because adults always pay income tax.', 0, 'Income tax depends on yearly pay, not age. You are still under the tax-free amount.'],
        ['Nothing changes until I finish school.', 0, 'Turning 18 changes two lines: CPP and the wage.']] };
      case 'card-ei': return { label: 'Who EI helps', ch: 2, text: 'Jas was laid off when a store closed. Jas now gets some pay every two weeks while looking for a new job. Which deduction paid into that?', opts: [
        ['EI. Workers pay EI so people who lose their job get some pay while they look for work.', 1, 'Right. EI is Employment Insurance.'],
        ['CPP. CPP pays people who lose their job.', 0, 'CPP is a pension for when you retire.'],
        ['Income tax. Income tax goes straight to workers who lose their job.', 0, 'Income tax pays for services like schools and hospitals. Job-loss pay comes from EI.']] };
      case 'card-cpp': return { label: 'Who CPP helps', ch: 2, text: 'Grandpa gets a payment every month from the Canada Pension Plan. Where did that money come from?', opts: [
        ['CPP that he and his employers paid in while he worked.', 1, 'Right. The CPP on your stub works the same way: it pays you later.'],
        ['EI, because retiring means losing your job.', 0, 'EI is for people who lose a job and look for another. Retirement pay is CPP.'],
        ['A gift from his bank for retiring.', 0, 'It comes from the Canada Pension Plan, paid in from every paycheque.']] };
      case 'card-tax': return { label: 'What income tax pays for', ch: 2, text: 'A patient broke a wrist and was treated here. They did not get a bill. Who paid?', opts: [
        ['Income tax and other taxes. They pay for health care for everyone in Alberta.', 1, 'Right. Health is about 41% of what Alberta spends (2026).'],
        ['EI. It pays for hospital visits.', 0, 'EI pays people who lose a job.'],
        ['CPP. It pays for hospital visits.', 0, 'CPP is a pension for retirement.']] };
      case 'taxfree':
        if (S.run.worker === 'avery') return { label: 'Why $0 income tax', ch: 2, text: 'Your pay stubs show $0 income tax. Why?', opts: [
          ['My yearly pay is under the tax-free amounts ($16,452 for Canada and $22,769 for Alberta in 2026), so no income tax comes off.', 1, 'Right. About 26 × $300 is around $8,000 a year: under both lines.'],
          ['Students don’t have to pay income tax.', 0, 'Students pay income tax if they earn more than the tax-free amount.'],
          ['Workers under 18 don’t pay income tax.', 0, 'Age does not matter for income tax. Yearly pay does.']] };
        yr = Math.round(S.run.log[S.run.log.length - 1].stub.gross * 26 / 10000) * 100;
        return { label: 'Why tax is less than 22%', ch: 2, text: 'You earn about ' + fmtW(yr) + ' a year. The tax rates are 14% (Canada) and 8% (Alberta). Why is your income tax much less than 22% of your pay?', opts: [
          ['The first $16,452 (Canada) and $22,769 (Alberta) of yearly pay are tax-free. Only the part above is taxed.', 1, 'Right. That is why the Pay Card starts at $0 and climbs slowly.'],
          ['Young workers pay a lower tax rate.', 0, 'The rate is the same at any age. The tax-free amount makes the difference.'],
          ['Income tax only comes off some paycheques.', 0, 'It comes off every paycheque above the tax-free amount.']] };
    }
  }
  var ASKS = {
    bounce: { text: 'A payment bounced last payday. What would help this time?', opts: [
      ['Move less to the jar. Plan from take-home pay (after deductions), not from gross pay.', 1, 'Right. Plan with net pay, minus bills, and leave a little cushion.'],
      ['Move more to the jar, so the jar can pay the bills.', 0, 'The jar is locked until goal day. Moving more leaves even less for bills.'],
      ['Keep the same plan.', 0, 'With the same pay, the same plan would bounce again.']] },
    slow: { text: 'Your jar is falling behind, but money was left in the bank after the bills. What would help?', opts: [
      ['Move more to the jar. The money left after bills can go to the goal.', 1, 'Right. Work out take-home pay minus bills, and move most of what is left.'],
      ['Move less to the jar.', 0, 'That makes the jar fall further behind.'],
      ['Keep the same plan.', 0, 'The same plan leaves the jar behind again.']] }
  };
  var LINES = [
    { k: 'gross', name: 'Gross pay', sub: 'pay before deductions' }, { k: 'ei', name: 'EI', sub: 'Employment Insurance' },
    { k: 'cpp', name: 'CPP', sub: 'Canada Pension Plan' }, { k: 'tax', name: 'Income tax', sub: 'Canada and Alberta' }, { k: 'net', name: 'Net pay', sub: 'take-home pay' }
  ];

  /* ── State ── */
  function init() {
    return { v: 1, sit: null, run: null, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), plan: 0, ans: {}, typed: {}, asks: {}, lastAsk: -9, pendingAsk: null,
             checks: [], stamps: {}, letters: [], signs: {}, extra: null, hangout: false, errs: null, offers: {}, finished: false };
  }
  function validate(S) {
    if (!S || S.v !== 1 || typeof S.plan !== 'number' || !S.typed || !S.asks || !S.stamps || !Array.isArray(S.letters) || !S.signs) return false;
    if (S.run && (!WORKERS[S.run.worker] || !Array.isArray(S.run.log) || typeof S.run.bank !== 'number' || (S.run.job && (!JOBS[S.run.job] || !S.run.world)))) return false;
    return true;
  }
  function W(S) { return WORKERS[S.run.worker]; }
  function J(S) { return JOBS[S.run.job]; }
  function bizName(S) { return J(S).biz; }

  /* ── Panels ── */
  function jobBoard(api, S) {
    return api.panel({ title: 'Job board', name: 'offers', wide: true, sub: 'Work out the <b>gross pay</b> for each posting: the pay before anything is taken off. Then pick one.', render: function (body, done) {
      var u = S.offers, jobs = W(S).jobs;
      function draw() {
        var all = jobs.every(function (k) { return u[k] && (u[k].ok || u[k].shown); });
        body.innerHTML = '<div class="ct-items" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">' + jobs.map(function (k) {
          var j = JOBS[k], q = offerQ(j), a = u[k] || {}, dn = a.ok || a.shown;
          return '<div class="ct-doc"><div class="ct-small" style="font-weight:800;color:#94631a;text-transform:uppercase">' + esc(j.biz) + '</div><b>' + esc(j.title) + '</b><p class="ct-small" style="margin:2px 0">' + esc(j.what) + '</p><p style="margin:4px 0;font-weight:800;color:#6b4510">' + payText(j) + '</p>' +
            '<label class="ct-small" for="of-' + k + '"><b>' + esc(q.text) + ':</b></label><div class="ct-row"><input class="ct-inp' + (a.ok ? ' ok' : a.no ? ' no' : '') + '" id="of-' + k + '" inputmode="decimal" autocomplete="off" value="' + esc(a.v || '') + '"' + (dn ? ' disabled' : '') + '>' +
            (dn ? '' : '<button class="ct-btn" type="button" data-check="' + k + '">Check</button>') + '</div><p class="ct-fb ' + (a.ok ? 'yes' : a.no ? 'no' : '') + '">' + esc(a.fb || '') + '</p>' +
            '<button class="ct-btn primary" type="button" data-take="' + k + '"' + (all ? '' : ' disabled') + '>Take this job</button></div>';
        }).join('') + '</div>' + (all ? '' : '<p class="ct-small">Check all three postings to unlock the choice.</p>');
        Array.prototype.forEach.call(body.querySelectorAll('[data-check]'), function (b) { b.addEventListener('click', function () { check(b.dataset.check); }); });
        Array.prototype.forEach.call(body.querySelectorAll('input'), function (i) { i.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(i.id.slice(3)); }); i.addEventListener('input', function () { (u[i.id.slice(3)] = u[i.id.slice(3)] || {}).v = i.value; }); });
        Array.prototype.forEach.call(body.querySelectorAll('[data-take]'), function (b) { b.addEventListener('click', function () { done(b.dataset.take); }); });
      }
      function check(k) {
        var a = u[k] || (u[k] = {}), inp = body.querySelector('#of-' + k), v = parseMoney(inp.value), q = offerQ(JOBS[k]), right = !isNaN(v) && close(v, q.ans);
        a.v = inp.value;
        if (isNaN(v)) { a.fb = 'Type an amount, like 312.00.'; a.no = 1; draw(); return; }
        api.record('offer-' + k, 'Gross pay: ' + JOBS[k].title, 0, right);
        a.tries = (a.tries || 0) + 1;
        if (right) { a.ok = 1; a.no = 0; a.fb = 'Right: ' + fmt(q.ans) + '.'; }
        else if (a.tries >= (api.mode === 'real' ? 2 : 3)) { a.shown = 1; a.no = 0; a.v = (q.ans / 100).toFixed(2); a.fb = 'It is ' + fmt(q.ans) + '. ' + offerHow(JOBS[k]); }
        else { a.no = 1; a.fb = api.mode === 'gentle' ? 'Not yet. ' + offerHow(JOBS[k]) : 'Not yet. Try again.'; }
        draw(); api.save();
        var n = body.querySelector('input:not([disabled])') || body.querySelector('[data-take]:not([disabled])'); if (n) n.focus();
      }
      draw();
    } });
  }
  function planPanel(api, S, p) {
    var r = S.run, j = J(S), sc = scheduleOf(r, p), bills = billsOf(r.worker), Wk = W(S);
    return api.panel({ title: 'Paycheque ' + p + ' of 8: plan payday', name: 'plan', render: function (body, done) {
      var chips = (sc.note ? '<span class="ct-w">' + esc(sc.note) + '</span> ' : '') + (sc.cutRisk ? '<span class="ct-w warn">⚠ Slow season: hours might be cut by up to ' + sc.cutRisk + '</span> ' : '') + (p === 5 && r.extra && j.type !== 'salary' ? '<span class="ct-w">+' + extraHours(r.worker) + ' extra hours</span>' : '');
      body.innerHTML = '<div class="ct-doc"><b>The next two weeks</b>' +
        (j.type === 'salary' ? '<p style="margin:4px 0">Salary: <b>' + fmtW(j.yearly) + '</b> a year, in 26 equal pays.</p>' : '<p style="margin:4px 0">Hours on the schedule: <b>' + sc.hours + ' h</b> × <b>' + fmt(sc.rate) + '</b> an hour' + (j.rate18 && sc.rate !== j.rate ? ' (new: you are 18)' : '') + '</p>') +
        (j.type === 'commission' ? '<p style="margin:4px 0">Expected sales: about <b>' + fmtW(sc.sales) + '</b>. You earn ' + Math.round(j.pct * 100) + '% of what you really sell.</p>' : '') +
        (j.type === 'tips' ? '<p style="margin:4px 0">Expected cash tips: about <b>' + fmtW(sc.tips) + '</b>. Tips go straight to you, not on the stub.</p>' : '') +
        (chips ? '<p style="margin:6px 0 0">' + chips + '</p>' : '') + '</div>' +
        '<h3>Bills on the fridge (every two weeks)</h3><table class="ct-rep"><tbody>' + Wk.bills.map(function (b) { return '<tr><td>' + esc(b[1]) + '</td><td class="ct-n">' + fmtW(b[2]) + '</td></tr>'; }).join('') + '<tr><td><b>Total</b></td><td class="ct-n"><b>' + fmtW(bills) + '</b></td></tr></tbody></table>' +
        (p === 1 ? '<div class="ct-note"><b>No pay stub yet.</b> Plan with what you know about the job.</div>' : '') +
        '<label class="ct-lab" for="jarIn">How much moves to your goal jar on payday?</label><div class="ct-row"><button class="ct-btn" type="button" data-d="-2500" aria-label="25 dollars less">−25</button><input class="ct-inp" id="jarIn" inputmode="decimal" autocomplete="off" value="' + (S.plan / 100).toFixed(2) + '"><button class="ct-btn" type="button" data-d="2500" aria-label="25 dollars more">+25</button></div>' +
        '<p id="planEq" class="ct-small"></p><p id="planChk" class="ct-fb"></p><p class="ct-small">Tip: your Pay Card is in your Bag.</p>' +
        '<div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="planGo">Save the plan</button></div>';
      var inp = body.querySelector('#jarIn');
      function upd() {
        var v = parseMoney(inp.value); if (!isNaN(v)) S.plan = Math.max(0, Math.min(500000, v));
        body.querySelector('#planEq').innerHTML = 'Out on payday: bills ' + fmtW(bills) + ' + jar ' + fmt(S.plan) + ' = <b>' + fmt(bills + S.plan) + '</b>. In the bank now: ' + fmt(r.bank) + '.';
        var c = body.querySelector('#planChk');
        if (api.mode === 'gentle' && api.ch >= 1) { var safe = r.bank + safeTakeHome(r, p) - bills - S.plan >= 0; c.className = 'ct-fb ' + (safe ? 'yes' : 'warn'); c.textContent = safe ? '✓ Looks safe if the pay comes in as planned.' : '⚠ Careful: after deductions, this plan may not leave enough for the bills.'; }
        else c.textContent = '';
      }
      inp.addEventListener('input', upd);
      Array.prototype.forEach.call(body.querySelectorAll('[data-d]'), function (b) { b.addEventListener('click', function () { S.plan = Math.max(0, S.plan + Number(b.dataset.d)); inp.value = (S.plan / 100).toFixed(2); upd(); }); });
      body.querySelector('#planGo').addEventListener('click', function () { upd(); done(S.plan); });
      upd();
    } });
  }
  function calendar(hours, cut, extra) {
    var per = hours >= 60 ? 8 : 4, days = [], i, n, wk = [0, 1, 2, 3, 4, 7, 8, 9, 10, 11, 5, 12], names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], left = hours, cutLeft = cut, out = '<div class="ct-cal" aria-label="Your shifts">';
    for (i = 0; i < 14; i++) days.push(0);
    for (i = 0; i < wk.length && left > 0; i++) { n = Math.min(per, left); days[wk[i]] = n; left -= n; }
    if (extra) { days[5] = extra / 2; days[12] = extra / 2; }
    for (i = 13; i >= 0 && cutLeft > 0; i--) if (days[i] && !(extra && (i === 5 || i === 12))) { cutLeft -= days[i]; days[i] = -days[i]; }
    for (i = 0; i < 14; i++) out += '<div class="ct-day in' + (days[i] < 0 ? ' cut' : '') + (extra && (i === 5 || i === 12) ? ' extra' : '') + '" style="animation-delay:' + (i * 0.05) + 's"><span>' + names[i % 7] + '</span>' + (days[i] ? '<span class="hrs">' + Math.abs(days[i]) + ' h</span>' : '') + '</div>';
    return out + '</div>';
  }
  function shiftPanel(api, S, p) {
    var r = S.run, a = actualOf(r, p), sc = scheduleOf(r, p), j = J(S), ev = [];
    if (a.cut) ev.push(['bad', 'Slow week: your boss cut <b>' + a.cut + ' hours</b>. You worked ' + a.hours + ' hours.']);
    if (a.extra) ev.push([j.type === 'salary' ? '' : 'good', 'You worked <b>' + a.extra + ' extra hours</b> on the weekends' + (j.type === 'salary' ? '. A salary stays the same.' : '.')]);
    if (j.type === 'commission') ev.push([a.sales >= sc.sales ? 'good' : '', 'You sold <b>' + fmtW(a.sales) + '</b> (expected about ' + fmtW(sc.sales) + ').']);
    if (j.type === 'tips') ev.push(['', 'Cash tips: <b>' + fmtW(a.tips) + '</b>, straight into your pocket.']);
    if (!ev.length) ev.push(['', 'A normal two weeks: ' + (j.type === 'salary' ? 'about ' + sc.hours : a.hours) + ' hours.']);
    return api.panel({ title: 'Paycheque ' + p + ' of 8: two weeks at ' + j.biz, name: 'shift', render: function (body, done) {
      body.innerHTML = calendar(sc.hours - a.extra, a.cut, a.extra) + '<ul class="ct-events">' + ev.map(function (e) { return '<li class="' + e[0] + '">' + e[1] + '</li>'; }).join('') + '</ul>' +
        '<p class="ct-small">Your timesheet is saved in your Bag with this paycheque.</p><div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="shiftGo">Payday →</button></div>';
      body.querySelector('#shiftGo').addEventListener('click', function () { done(); });
    } });
  }
  function timesheet(S, p) {
    var a = actualOf(S.run, p), j = J(S);
    return '<div class="ct-note" style="margin:0 0 8px"><b>Your timesheet, paycheque ' + p + ':</b> ' + (j.type === 'salary' ? 'salary, ' + fmtW(j.yearly) + ' a year' : a.hours + ' hours at ' + fmt(a.rate)) +
      (j.type === 'commission' ? ', sales ' + fmtW(a.sales) + ' (' + Math.round(j.pct * 100) + '% commission)' : '') + '. Age ' + a.age + '.</div>';
  }
  function givenText(S, a) {
    var j = J(S);
    if (j.type === 'salary') return 'Salary ' + fmtW(j.yearly) + ' a year ÷ 26 pays' + (a.extra ? ' (you worked ' + a.extra + ' extra hours)' : '');
    return a.hours + ' hours × ' + fmt(a.rate) + (j.type === 'commission' ? ' + ' + Math.round(j.pct * 100) + '% of ' + fmtW(a.sales) + ' in sales' : '');
  }
  function stubHint(S, k, a) {
    var j = J(S);
    if (k === 'gross') return j.type === 'salary' ? 'Yearly salary ÷ 26.' : j.type === 'commission' ? 'Hours × wage, plus ' + Math.round(j.pct * 100) + '% of sales.' : 'Hours × wage: ' + a.hours + ' × ' + fmt(a.rate) + '.';
    if (k === 'ei') return 'EI is 1.63% of gross pay: 0.0163 × gross.';
    if (k === 'cpp') return a.age < 18 ? 'Under 18: no CPP. Type 0.' : 'CPP is 5.95% of (gross pay − $135).';
    if (k === 'tax') { var rw = rowOf(a.stub.gross); return 'Find the Pay Card row nearest the gross pay: the $' + rw.toLocaleString('en-CA') + ' row' + (rw === 600 ? ' ($300 to $600)' : '') + '.'; }
    return 'Gross pay − (EI + CPP + income tax).';
  }
  /* Chapter 1: the stub fills itself in */
  function revealPanel(api, S, p) {
    var a = actualOf(S.run, p), j = J(S);
    return api.panel({ title: 'Paycheque ' + p + ': your pay stub', name: 'reveal', render: function (body, done) {
      body.innerHTML = '<div class="ct-doc"><div class="ct-doc-h"><b>' + esc(j.biz) + '</b><span>Age ' + a.age + ' · paycheque ' + p + '</span></div><p class="ct-small">' + givenText(S, a) + '</p>' +
        LINES.map(function (L, i) { var cls = L.k === 'net' ? ' net' : L.k === 'gross' ? '' : ' ded'; return '<div class="ct-line' + cls + ' ct-day in" style="display:grid;animation-delay:' + (i * 0.3) + 's"><span class="what">' + L.name + '<small>' + L.sub + '</small></span><span class="amt">' + (cls === ' ded' ? '−' : '') + fmt(a.stub[L.k]) + '</span><span></span></div>'; }).join('') + '</div>' +
        '<div class="ct-note">The job promised <b>' + fmt(a.stub.gross) + '</b>' + (a.tips ? ' (plus ' + fmtW(a.tips) + ' in cash tips)' : '') + '. Only <b>' + fmt(a.stub.net) + '</b> goes into your account. Where did <b>' + fmt(a.stub.total) + '</b> go?</div>' +
        '<div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="revGo">Deposit it</button></div>';
      body.querySelector('#revGo').addEventListener('click', function () { done(); });
    } });
  }
  /* Chapters 2 and 4: type every line */
  function stubCalcPanel(api, S, p) {
    var a = actualOf(S.run, p), j = J(S), u = {};
    return api.panel({ title: 'Paycheque ' + p + ': fill in your pay stub', name: 'stubcalc', data: { stub: a.stub }, render: function (body, done) {
      function draw() {
        var all = LINES.every(function (L) { return u[L.k] && (u[L.k].ok || u[L.k].shown); });
        body.innerHTML = '<p class="ct-small">Teller Sam slides the stub across. Use the Pay Card in your Bag.</p><div class="ct-doc"><div class="ct-doc-h"><b>' + esc(j.biz) + '</b><span>Age ' + a.age + ' · paycheque ' + p + '</span></div><p class="ct-small">' + givenText(S, a) + '</p>' +
          LINES.map(function (L) {
            var x = u[L.k] || {}, cls = L.k === 'net' ? ' net' : L.k === 'gross' ? '' : ' ded', amt = x.ok || x.shown ? '<span class="amt">' + (cls === ' ded' ? '−' : '') + fmt(a.stub[L.k]) + '</span>' :
              '<input class="ct-inp' + (x.no ? ' no' : '') + '" id="st-' + L.k + '" inputmode="decimal" autocomplete="off" aria-label="' + L.name + '" value="' + esc(x.v || '') + '">';
            return '<div class="ct-line' + cls + '"><span class="what">' + L.name + '<small>' + L.sub + '</small></span>' + amt + '<span aria-label="' + (x.ok ? 'right' : x.shown ? 'shown' : x.no ? 'not yet' : '') + '">' + (x.ok ? '<b style="color:#2c7a4b">✓</b>' : x.shown ? '•' : x.no ? '<b style="color:#b42318">✗</b>' : '') + '</span>' + (x.hint && !(x.ok || x.shown) ? '<span class="hint">' + esc(x.hint) + '</span>' : '') + '</div>';
          }).join('') + '</div>' + (a.tips ? '<p class="ct-small">Your ' + fmtW(a.tips) + ' in cash tips go in too. They are not on the stub.</p>' : '') +
          '<div class="ct-row ct-actions">' + (all ? '<button class="ct-btn primary" type="button" id="stDone">Deposit it</button>' : '<button class="ct-btn primary" type="button" id="stCheck">Check my stub</button>') + '</div>';
        Array.prototype.forEach.call(body.querySelectorAll('input'), function (i) { i.addEventListener('input', function () { (u[i.id.slice(3)] = u[i.id.slice(3)] || {}).v = i.value; }); i.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); }); });
        if (all) body.querySelector('#stDone').addEventListener('click', function () { done(); }); else body.querySelector('#stCheck').addEventListener('click', check);
      }
      function check() {
        var max = api.mode === 'real' ? 2 : 3, first = null;
        LINES.forEach(function (L) {
          var x = u[L.k] || (u[L.k] = {}), inp = body.querySelector('#st-' + L.k), v, right;
          if (!inp || x.ok || x.shown) return;
          x.v = inp.value; v = parseMoney(inp.value);
          if (isNaN(v)) { if (!first) first = L.k; return; }
          right = close(v, a.stub[L.k]) || (L.k === 'tax' && a.stub.gross % 10000 === 5000 && close(v, taxAtRow(rowOf(a.stub.gross) - 100)));
          api.record('stub-p' + p + '-' + L.k, 'Paycheque ' + p + ': ' + L.name, api.ch, right);
          x.tries = (x.tries || 0) + 1;
          if (right) { x.ok = 1; x.no = 0; x.hint = ''; } else if (x.tries >= max) { x.shown = 1; x.no = 0; x.hint = ''; } else { x.no = 1; x.hint = api.mode === 'gentle' ? stubHint(S, L.k, a) : 'Not yet.'; if (!first) first = L.k; }
        });
        draw(); api.save();
        var f = first && body.querySelector('#st-' + first); if (f) f.focus(); else { f = body.querySelector('#stDone'); if (f) f.focus(); }
      }
      draw();
    } });
  }
  /* Chapters 3 and 4: the boss's stub. Tap a line you think is wrong, then sign or dispute. */
  function signPanel(api, S, p, kind) {
    var st = stubAsPrinted(S.run, p, kind), right = stubAsPrinted(S.run, p, null), j = J(S), boss = WORK[S.run.job].boss, flagged = null, tries = 0, recorded = false, msg = '', msgOk = false, gentleWarned = false;
    var rows = [];
    if (j.type === 'salary') rows.push({ k: 'salary', name: 'Salary', sub: fmtW(j.yearly) + ' ÷ 26', val: fmt(st.gross) });
    else { rows.push({ k: 'hours', name: 'Hours worked', sub: 'at ' + fmt(st.rate) + ' an hour', val: st.hours + ' h' }); if (j.type === 'commission') rows.push({ k: 'comm', name: 'Commission', sub: Math.round(j.pct * 100) + '% of ' + fmtW(st.sales) + ' in sales', val: fmt(st.comm) }); }
    rows.push({ k: 'gross', name: 'Gross pay', sub: 'pay before deductions', val: fmt(st.gross) }, { k: 'ei', name: 'EI', sub: '1.63% of gross', val: '−' + fmt(st.ei), ded: 1 },
      { k: 'cpp', name: 'CPP', sub: st.age < 18 ? 'none under 18' : '5.95% of (gross − $135)', val: '−' + fmt(st.cpp), ded: 1 }, { k: 'tax', name: 'Income tax', sub: 'Pay Card row', val: '−' + fmt(st.tax), ded: 1 },
      { k: 'net', name: 'Net pay', sub: 'take-home pay', val: fmt(st.net), net: 1 });
    var follows = { gross: 1, net: 1, ei: st.root === 'hours' || st.root === 'comm', cpp: st.root === 'hours' || st.root === 'comm', tax: st.root === 'hours' || st.root === 'comm' };
    function explain(k) { // why a line you flagged checks out
      var m = { hours: 'Your timesheet says ' + right.hours + ' hours. That matches.', comm: 'Your timesheet says ' + fmtW(right.sales) + ' in sales, and ' + Math.round(j.pct * 100) + '% of that is ' + fmt(right.comm) + '. That matches.', salary: fmtW(j.yearly) + ' ÷ 26 = ' + fmt(right.gross) + '. That matches.',
        gross: 'Gross pay adds up from the lines above it.', ei: '1.63% of ' + fmt(st.gross) + ' is ' + fmt(eiOf(st.gross)) + '. That matches.', cpp: st.age < 18 ? 'No CPP under 18, and none was taken.' : '5.95% of (' + fmt(st.gross) + ' − $135) is ' + fmt(cppOf(st.gross, st.age)) + '. That matches.',
        tax: 'The Pay Card row for ' + fmt(st.gross) + ' is ' + fmt(taxOf(st.gross)) + '. That matches.', net: 'Net pay is gross minus the deductions. That subtraction is right.' };
      return m[k];
    }
    return api.panel({ title: 'Paycheque ' + p + ': check it before you sign', name: 'sign', wide: true, data: { kind: kind, root: st.root }, render: function (body, done) {
      function draw() {
        body.innerHTML = '<p>' + esc(boss) + ' prepared your stub. <b>Check every line</b> against your timesheet and the Pay Card (in your Bag). If a line is wrong, tap it and dispute it. Once you sign, the bank pays what the stub says.</p>' + timesheet(S, p) +
          '<div class="ct-doc"><div class="ct-doc-h"><b>' + esc(j.biz) + '</b><span>Age ' + st.age + ' · paycheque ' + p + '</span></div>' +
          rows.map(function (r) { return '<button class="ct-flag" type="button" data-k="' + r.k + '" aria-pressed="' + (flagged === r.k) + '"><span class="what" style="font-weight:700">' + r.name + '<small style="display:block;font-weight:400;color:#6b665d">' + r.sub + '</small></span><span class="amt" style="font-weight:800;' + (r.ded ? 'color:#b42318' : r.net ? 'color:#2c7a4b' : '') + '">' + r.val + '</span><span class="flagmark">flagged</span></button>'; }).join('') + '</div>' +
          (msg ? '<p class="ct-fb ' + (msgOk ? 'yes' : 'no') + '">' + esc(msg) + '</p>' : '') +
          (api.mode === 'gentle' ? '<p class="ct-small">Gentle hint: start at the top. Compare the hours (or salary) with your timesheet, then work out each deduction.</p>' : '') +
          '<div class="ct-row ct-actions"><button class="ct-btn" type="button" id="sgDispute"' + (flagged ? '' : ' disabled') + '>Dispute the flagged line</button><button class="ct-btn primary" type="button" id="sgSign">Sign it</button></div>';
        Array.prototype.forEach.call(body.querySelectorAll('.ct-flag'), function (b) { b.addEventListener('click', function () { flagged = flagged === b.dataset.k ? null : b.dataset.k; draw(); body.querySelector('[data-k="' + b.dataset.k + '"]').focus(); }); });
        body.querySelector('#sgDispute').addEventListener('click', dispute);
        body.querySelector('#sgSign').addEventListener('click', sign);
      }
      function rec(ok) { if (!recorded) { api.record('sign-p' + p, 'Paycheque ' + p + ': check the boss’s stub' + (st.root ? ' (it had a mistake)' : ' (it was right)'), api.ch, ok); recorded = true; } else if (S.ans['sign-p' + p]) S.ans['sign-p' + p].tries++; }
      function dispute() {
        tries++;
        if (st.root && flagged === st.root) { rec(true); S.signs[p] = { kind: kind, result: 'caught', short: 0 }; msgOk = true; msg = boss + ': You’re right. I fixed it. The stub now pays ' + fmt(right.net) + '.'; finish(0, true); return; }
        rec(false);
        if (st.root && follows[flagged]) msg = boss + ': That line is off only because an earlier line is wrong. Which line starts the mistake?';
        else msg = boss + ': ' + explain(flagged);
        msgOk = false; flagged = null; draw();
      }
      function sign() {
        if (st.root && api.mode === 'gentle' && !gentleWarned) { gentleWarned = true; rec(false); msgOk = false; msg = 'Hold on: one line does not match your timesheet or the Pay Card. Check again, or sign anyway.'; draw(); return; }
        if (!st.root) { rec(true); S.signs[p] = { kind: null, result: 'ok', short: 0 }; finish(0, false); return; }
        rec(false); S.signs[p] = { kind: kind, result: 'signed', short: right.net - st.net }; finish(right.net - st.net, false);
      }
      function finish(short, fixed) {
        body.innerHTML = (fixed ? '<div class="ct-banner good">Fixed before you signed. You will be paid the right amount.</div>' : short ? '<div class="ct-banner bad">You signed it. The bank will pay what the stub says.</div>' : '<div class="ct-banner good">Every line checks out. Signed.</div>') +
          '<p>' + esc(msg || '') + '</p><div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="sgGo">Take it to the bank</button></div>';
        body.querySelector('#sgGo').addEventListener('click', function () { done(short); });
        body.querySelector('#sgGo').focus();
      }
      draw();
    } });
  }
  function resultPanel(api, S, l) {
    var inn = l.stub.net - (l.short || 0) + l.tips, max = Math.max(inn, l.bills + l.jarIn, 1), Wk = W(S);
    function row(label, v, col) { return '<span>' + label + '</span><span class="ct-track"><span class="ct-fill" style="width:' + Math.max(1, Math.round(v / max * 100)) + '%;background:' + col + '"></span></span><span class="v">' + fmt(v) + '</span>'; }
    return api.panel({ title: 'Paycheque ' + l.p + ': deposited', name: 'result', render: function (body, done) {
      body.innerHTML = '<div class="ct-flow">' + row('Take-home in', inn, '#2c7a4b') + row('Bills out', l.bills, '#b42318') + row('To the jar', l.jarIn, '#d9a55a') + '</div>' +
        (l.short ? '<div class="ct-banner bad">The stub you signed paid you ' + fmt(l.short) + ' less than you earned.</div>' : '') +
        (l.bounced ? '<div class="ct-banner bad">Not enough money for everything. A payment bounced, and the bank charged a ' + fmtW(FEE) + ' fee. Your bank is at ' + fmt(l.bank) + '.' + (l.p < STRIKE_FROM ? ' This one does not count against you yet.' : api.mode === 'real' ? ' Bounces this game: ' + S.run.strikes + ' of ' + STRIKES_TO_LOSE + '.' : '') + '</div>'
          : '<div class="ct-banner good">Every bill was paid. ' + fmt(l.bank) + ' is left in your account.</div>') +
        '<p>Goal jar: <b>' + fmt(S.run.jar) + '</b> of ' + fmtW(Wk.goal) + '.</p><div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="resGo">OK</button></div>';
      body.querySelector('#resGo').addEventListener('click', function () { done(); });
    } });
  }
  function typedPanel(api, S, id, title, prompt) {
    return api.panel({ title: title, name: 'typed', render: function (body, done) {
      body.innerHTML = '<label class="ct-lab" for="tp">' + esc(prompt) + '</label><textarea class="ct-inp" id="tp" rows="3">' + esc(S.typed[id] || '') + '</textarea><p class="ct-small">Your teacher sees this in the report.</p><div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="tpGo" disabled>Save</button></div>';
      var t = body.querySelector('#tp'), b = body.querySelector('#tpGo');
      function upd() { b.disabled = t.value.trim().length < 8; } t.addEventListener('input', upd); upd();
      b.addEventListener('click', function () { S.typed[id] = t.value.trim(); done(); });
    } });
  }
  function dialPanel(api, S) {
    var g = 0, l = S.run.log, i; for (i = 0; i < l.length; i++) g += l[i].stub.gross; g = l.length ? Math.round(g / l.length) : 0;
    var base = abTaxYear(g), k = 0;
    return api.panel({ title: 'Town Hall: the tax dial', name: 'dial', wide: true, render: function (body, done) {
      function draw() {
        var now = Math.round(base * (1 + k)), per = Math.round((now - base) / 26), t = S.typed;
        body.innerHTML = '<p>Councillor Wright: Alberta takes <b>8%</b> income tax on yearly pay above <b>$22,769</b> (2026). What if we changed the rate?</p><div class="ct-row ct-wrap" role="group" aria-label="Alberta income tax rate">' +
          [-0.5, -0.25, 0, 0.25, 0.5].map(function (x) { return '<button class="ct-btn" type="button" data-k="' + x + '" aria-pressed="' + (x === k) + '">' + (8 * (1 + x)) + '%' + (x === 0 ? ' (now)' : '') + '</button>'; }).join('') + '</div>' +
          (!base ? '<div class="ct-note"><b>You pay no Alberta income tax.</b> Your yearly pay (about ' + fmtW(Math.round(g * 26 / 10000) * 10000) + ') is under $22,769, so the dial does not change your pay. You still use schools, roads and hospitals that taxes pay for.</div>'
            : '<p>Your Alberta income tax: about <b>' + fmtW(Math.round(now / 100) * 100) + '</b> a year' + (k ? ' (now ' + fmtW(Math.round(base / 100) * 100) + '). Your take-home pay would go <b>' + (per < 0 ? 'up by ' + fmt(-per) : 'down by ' + fmt(per)) + '</b> every two weeks.' : '.') + '</p>' +
              '<table class="ct-rep"><tbody><tr><td>Health (41%)</td><td class="ct-n">' + fmtW(Math.round(now * AB_HEALTH / 100) * 100) + '</td></tr><tr><td>Education (13%)</td><td class="ct-n">' + fmtW(Math.round(now * AB_EDU / 100) * 100) + '</td></tr><tr><td>Everything else (46%)</td><td class="ct-n">' + fmtW(Math.round(now * (1 - AB_HEALTH - AB_EDU) / 100) * 100) + '</td></tr></tbody></table><p class="ct-small">If your tax were split the way Alberta spends (Budget 2026–27). Tax really goes into one big pot.</p>') +
          '<div class="ct-items" style="margin-top:8px"><div class="ct-doc"><b>Less tax</b><br>More take-home pay for every worker. Less money for hospitals, schools and roads, or the province borrows.</div><div class="ct-doc"><b>More tax</b><br>More money for services, like shorter hospital waits or smaller classes. Less take-home pay for every worker.</div></div>' +
          '<p class="ct-lab">Your claim: should more or less tax come off pay?</p><div class="ct-row ct-wrap">' + ['Less tax', 'Keep it the same', 'More tax'].map(function (c) { return '<button class="ct-btn" type="button" data-c="' + c + '" aria-pressed="' + (t.claim === c) + '">' + c + '</button>'; }).join('') + '</div>' +
          '<label class="ct-lab" for="dReason">One reason:</label><textarea class="ct-inp" id="dReason" rows="2">' + esc(t.reason || '') + '</textarea>' +
          '<label class="ct-lab" for="dTrade">One trade-off (what would be lost):</label><textarea class="ct-inp" id="dTrade" rows="2">' + esc(t.tradeoff || '') + '</textarea>' +
          '<p class="ct-small">There is no wrong side, but you need a reason and a trade-off. Use it as a first draft for Path B of your project.</p><div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="dGo">Save my opinion</button></div>';
        Array.prototype.forEach.call(body.querySelectorAll('[data-k]'), function (b) { b.addEventListener('click', function () { k = Number(b.dataset.k); draw(); }); });
        Array.prototype.forEach.call(body.querySelectorAll('[data-c]'), function (b) { b.addEventListener('click', function () { S.typed.claim = b.dataset.c; draw(); }); });
        var r = body.querySelector('#dReason'), tr = body.querySelector('#dTrade'), go = body.querySelector('#dGo');
        function upd() { S.typed.reason = r.value; S.typed.tradeoff = tr.value; go.disabled = !(S.typed.claim && r.value.trim().length >= 8 && tr.value.trim().length >= 8); }
        r.addEventListener('input', upd); tr.addEventListener('input', upd); upd();
        go.addEventListener('click', function () { done(); });
      }
      draw();
    } });
  }

  /* ── Items in the Bag ── */
  function payCardHTML() {
    var h = '<table class="ct-rep"><thead><tr><th>Deduction</th><th>Who pays it</th><th>How much</th></tr></thead><tbody><tr><td><b>EI</b></td><td>Every worker, any age</td><td>1.63% of gross pay</td></tr><tr><td><b>CPP</b></td><td>Workers 18 and older</td><td>5.95% of (gross pay − $135)</td></tr><tr><td><b>Income tax</b></td><td>Above the tax-free amount</td><td>The row nearest your gross pay</td></tr></tbody></table>' +
      '<h3>Income tax every two weeks</h3><table class="ct-rep"><thead><tr><th>Gross pay</th><th>Income tax</th><th>Gross pay</th><th>Income tax</th></tr></thead><tbody>', i, a, b;
    for (i = 0; i < 9; i++) { a = PAY_CARD[i]; b = PAY_CARD[i + 9]; h += '<tr><td class="ct-n">' + (i === 0 ? '$300 to $600' : fmtW(a[0] * 100)) + '</td><td class="ct-n">' + fmt(a[1]) + '</td><td class="ct-n">' + (b ? fmtW(b[0] * 100) : '–') + '</td><td class="ct-n">' + (b ? fmt(b[1]) : '–') + '</td></tr>'; }
    return h + '</tbody></table><p class="ct-small">Estimates using 2026 tax rates. Tax-free amounts: Canada $16,452, Alberta $22,769 a year.</p>';
  }
  function checkerHTML(S) {
    var p = S.checks.length ? S.checks[S.checks.length - 1].input : { type: 'wage' };
    function f(id, label, v) { return '<label class="ct-small" style="display:block"><b>' + label + '</b><input class="ct-inp" id="' + id + '" inputmode="decimal" autocomplete="off" value="' + esc(v == null ? '' : v) + '" style="width:100%"></label>'; }
    return '<p>Type the facts from <b>your project’s</b> job, then <b>your own</b> stub lines. This marks each line ✓ or ✗. It does not give answers.</p>' +
      '<div class="ct-row"><button class="ct-btn" type="button" data-ck="wage" aria-pressed="' + (p.type === 'wage') + '">Wage</button><button class="ct-btn" type="button" data-ck="salary" aria-pressed="' + (p.type === 'salary') + '">Salary</button></div>' +
      '<div class="ct-items" style="margin-top:6px">' + (p.type === 'wage' ? f('ckRate', 'Wage per hour ($)', p.rate) + f('ckHours', 'Hours in two weeks', p.hours) : f('ckYear', 'Salary per year ($)', p.year)) + f('ckAge', 'Worker’s age', p.age) + '</div>' +
      '<div class="ct-items" style="margin-top:6px">' + LINES.map(function (L) { return f('ck-' + L.k, L.name + ' ($)', p[L.k]); }).join('') + '</div>' +
      '<div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="ckGo">Check</button></div><div id="ckOut" aria-live="polite"></div><p class="ct-small">Commission or tips? Ask your team’s Checker or your teacher.</p>';
  }
  function bindChecker(S, el) {
    Array.prototype.forEach.call(el.querySelectorAll('[data-ck]'), function (b) { b.addEventListener('click', function () { var o = readCheck(el); o.type = b.dataset.ck; S.checks.push({ t: '', marks: {}, input: o, draft: true }); el.innerHTML = '<div class="ct-itemview">' + checkerHTML(S) + '</div>'; S.checks.pop(); bindChecker(S, el); }); });
    el.querySelector('#ckGo').addEventListener('click', function () {
      var o = readCheck(el), age = parseInt(o.age, 10), g, s, out = [], marks = {};
      g = o.type === 'wage' ? (function () { var r = parseMoney(o.rate), h = parseFloat(o.hours); return isNaN(r) || isNaN(h) ? NaN : Math.round(r * h); })() : (function () { var y = parseMoney(o.year); return isNaN(y) ? NaN : Math.round(y / 26); })();
      if (isNaN(g) || isNaN(age)) { el.querySelector('#ckOut').innerHTML = '<p class="ct-fb no">Fill in the job facts and the age first.</p>'; return; }
      s = stubOf(g, age);
      LINES.forEach(function (L) {
        var v = parseMoney(o[L.k]), ok = !isNaN(v) && (close(v, s[L.k]) || (L.k === 'tax' && g % 10000 === 5000 && close(v, taxAtRow(rowOf(g) - 100))));
        if (L.k === 'net' && !ok && !isNaN(v)) { var own = parseMoney(o.gross) - (parseMoney(o.ei) || 0) - (parseMoney(o.cpp) || 0) - (parseMoney(o.tax) || 0); if (!isNaN(own) && close(v, own)) { marks.net = 'follows'; out.push('<li>→ Net pay: your subtraction is right. Fix the lines above and it will be right too.</li>'); return; } }
        marks[L.k] = isNaN(v) ? 'blank' : ok ? 'ok' : 'no';
        out.push('<li>' + (isNaN(v) ? '— ' + L.name + ': blank' : ok ? '<b style="color:#2c7a4b">✓</b> ' + L.name : '<b style="color:#b42318">✗</b> ' + L.name + ': not yet') + '</li>');
      });
      el.querySelector('#ckOut').innerHTML = '<ul style="list-style:none;padding:0">' + out.join('') + '</ul>';
      S.checks.push({ t: new Date().toISOString().slice(0, 16).replace('T', ' '), job: o.type === 'wage' ? o.rate + '/h × ' + o.hours + ' h' : o.year + '/yr', age: age, marks: marks, input: o });
      if (S.checks.length > 10) S.checks.shift();
      T.save();
    });
  }
  function readCheck(el) {
    var g = function (id) { var e = el.querySelector('#' + id); return e ? e.value : ''; }, pressed = el.querySelector('[data-ck][aria-pressed="true"]');
    var o = { type: pressed ? pressed.dataset.ck : 'wage', rate: g('ckRate'), hours: g('ckHours'), year: g('ckYear'), age: g('ckAge') };
    LINES.forEach(function (L) { o[L.k] = g('ck-' + L.k); });
    return o;
  }
  function stubView(S, l) {
    return '<div class="ct-doc"><div class="ct-doc-h"><b>' + esc(J(S).biz) + '</b><span>Paycheque ' + l.p + ' · age ' + l.age + '</span></div><p class="ct-small">Timesheet: ' + (J(S).type === 'salary' ? 'salary' : l.hours + ' hours') + (l.sales ? ', sales ' + fmtW(l.sales) : '') + (l.tips ? ', cash tips ' + fmtW(l.tips) : '') + '</p>' +
      LINES.map(function (L) { var cls = L.k === 'net' ? ' net' : L.k === 'gross' ? '' : ' ded'; return '<div class="ct-line' + cls + '"><span class="what">' + L.name + '</span><span class="amt">' + (cls === ' ded' ? '−' : '') + fmt(l.stub[L.k]) + '</span><span></span></div>'; }).join('') +
      (l.short ? '<p class="ct-fb no">You signed a stub that paid ' + fmt(l.short) + ' less.</p>' : '') + '</div>';
  }

  /* ── Steps ── */
  function step(id, run) { return { id: id, run: run }; }
  function wantAsk(S) { // "What would help?": never two paycheques running; a topic stops after 2 first-try answers or 4 showings
    var t = helpTopic(S.run), a;
    if (!t) return null; a = S.asks[t];
    if (a && (a.first >= 2 || a.seen >= 4)) return null;
    if (S.run.p - S.lastAsk < 2) return null;
    return t;
  }
  function familyId(S) { return S.sit ? SIT[S.sit].family : 'mom'; }
  function period(p) {
    return [
      step('plan' + p, async function (api, S) {
        await api.quest('Go home and plan paycheque ' + p + ' at the kitchen table', 'table');
        if (S.letters.length) { await api.say(familyId(S), ['A letter came for you.', S.letters.join(' ')]); S.letters = []; api.unplace('letter'); }
        if (S.pendingAsk) {
          var t = S.pendingAsk; S.asks[t] = S.asks[t] || { seen: 0, first: 0 }; S.asks[t].seen++; S.lastAsk = S.run.p;
          var before = S.ans['ask-' + t + '-p' + S.run.p];
          await api.ask(familyId(S), ASKS[t], 'ask-' + t + '-p' + S.run.p, 'What would help? (' + (t === 'bounce' ? 'a payment bounced' : 'jar behind') + ')', api.ch);
          if (!before && S.ans['ask-' + t + '-p' + S.run.p].first) S.asks[t].first++;
          S.pendingAsk = null;
        }
        await planPanel(api, S, p);
      }),
      step('shift' + p, async function (api, S) {
        var b = bossId(S.run.job);
        await api.quest('Go to work at ' + bizName(S) + ' and see ' + WORK[S.run.job].boss, b);
        await shiftPanel(api, S, p);
        if (p >= 5 && p <= 7) {
          if (!S.errs) S.errs = errorPlan(S.seed);
          await api.say(b, 'Here’s your pay stub. I did the payroll myself this time, so please check it and sign before you bank it.');
          var short = await signPanel(api, S, p, errorKindFor(S.run, p, S.errs));
          S.signs[p] = S.signs[p] || { result: 'ok', short: short || 0 }; S.signs[p].short = short || 0;
        } else await api.say(b, p === 1 ? 'Payday! Here’s your first paycheque. Take it to the bank.' : 'Here’s your paycheque. See you next shift.');
        api.give('Pay stub ' + p); api.hud();
      }),
      step('bank' + p, async function (api, S) {
        await api.quest('Take paycheque ' + p + ' to Teller Sam at the bank', 'sam');
        var signed = S.signs[p];
        if (api.ch === 0) { await api.say('sam', 'Let’s look at your pay stub together.'); await revealPanel(api, S, p); }
        else if (!signed) await stubCalcPanel(api, S, p);
        else await api.say('sam', signed.short ? 'Hmm. This stub pays you ' + fmt(signed.short) + ' less than your timesheet says. You signed it, so getting that back will be hard.' : 'Signed and checked. Let’s deposit it.');
        var fresh = S.run.p < p, l = fresh ? paydaySigned(S.run, S.plan, api.mode === 'real', signed ? signed.short : 0) : S.run.log[p - 1]; // a reload never pays twice
        api.hud();
        await resultPanel(api, S, l);
        if (l.bounced && fresh) { S.letters.push('From your ' + (S.run.worker === 'avery' ? 'phone company' : 'landlord') + ': "Your payment bounced. A ' + fmtW(FEE) + ' bank fee was charged. Please make sure there is enough money next time."'); api.place('letter', 'home', 3, 5, { draw: 'letter', solid: false, label: 'A letter' }); }
        if (p === 1) await api.ask('sam', Q('whyLess', S), 'q-whyLess', Q('whyLess', S).label, 0);
        S.pendingAsk = wantAsk(S);
        if (api.mode === 'real' && S.run.strikes >= STRIKES_TO_LOSE) return 'lost';
      })
    ];
  }
  function chapterSteps(ch, S) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the Job Centre and talk to Ms. Okafor', 'okafor');
        await api.say('okafor', ['Hi ' + api.profile.name + '! I help people plan their work.', 'Let’s jump ahead a few years and see where a paycheque really goes. Which future you should we try?']);
        var keys = ['avery', 'dev', 'rosa'], i = await api.choose('okafor', 'Pick your future:', keys.map(function (k) { return SIT[k].label; }));
        S.sit = keys[i]; S.run = newRun(S.sit, null, S.seed);
        await api.say('okafor', [SIT[S.sit].short, 'Your goal: save ' + fmtW(W(S).goal) + ' for ' + W(S).goalLabel + ' in 8 paycheques. That’s about four months.', 'First you need a job. Check the job board by the window.']);
        api.give('Pay Card'); api.hud(); api.refresh();
      }));
      a.push(step('board', async function (api, S) {
        await api.quest('Read the job board at the Job Centre', 'jobboard');
        var jk = await jobBoard(api, S);
        setJob(S.run, jk); api.give('Job ad: ' + JOBS[jk].title); api.outfit(); api.refresh();
        await api.say('you', 'New job at ' + JOBS[jk].biz + '! New ' + T.art.OUTFITS[WORK[jk].outfit].label.toLowerCase() + ', too.');
      }));
      a.push(step('paytype', async function (api, S) {
        await api.quest('Tell Ms. Okafor about your new job', 'okafor');
        var q = Q('paytype', S); await api.ask('okafor', q, 'q-paytype', q.label, 0);
        await typedPanel(api, S, 'downside', 'One downside', 'Write one downside of this pay type for you. (Your project asks for this too.)');
        await api.say('okafor', 'Good. Now go home and plan your first payday.');
      }));
      a = a.concat(period(1), period(2));
      a.push(step('end1', async function (api, S) {
        await api.quest('Tell Ms. Okafor how your first month went', 'okafor');
        await api.say('okafor', ['Your jar has ' + fmt(S.run.jar) + ' of ' + fmtW(W(S).goal) + '.', 'Now do Step 1 of your project with your team: pick a real job ad and work out its gross pay.', 'Come back after your next lesson for Chapter 2.']);
      }));
    }
    if (ch === 1) {
      a.push(step('start2', async function (api, S) {
        startChapter(S.run, 2); api.hud();
        if (S.run.covered) { await api.quest('Go home. Someone wants to talk about money.', familyId(S)); await api.say(familyId(S), ['Your account was overdrawn by ' + fmt(S.run.covered) + '. I covered it, just this once.', 'From now on, plan from your take-home pay, not your gross pay.']); }
      }));
      a = a.concat(period(3), period(4));
      a.push(step('why', async function (api, S) {
        await api.quest('Tell Ms. Okafor what you learned', 'okafor');
        await typedPanel(api, S, 'why', 'In your own words', 'Why didn’t your gross pay land in your bank account? Name the deductions.');
        await api.say('okafor', ['Now do Step 2 of your project: build your pay stub. Use the Project Checker in your Bag to check your lines.', 'Come back after your next lesson for Chapter 3.']);
      }));
    }
    if (ch === 2) {
      a.push(step('extra', async function (api, S) {
        var b = bossId(S.run.job);
        await api.quest('Your boss at ' + bizName(S) + ' wants to see you', b);
        await api.say(b, 'We’re busy. Can you take ' + extraHours(S.run.worker) + ' extra hours on the weekends next pay?');
        var q = Q('extra', S); await api.ask(b, q, 'q-extra', q.label, 2);
        var i = await api.choose(b, 'So, will you take the extra hours?', ['Yes, I’ll take them', 'No thanks']);
        S.run.extra = i === 0; S.extra = S.run.extra; S.hangout = S.run.extra;
        if (S.run.extra) await api.say('you', 'That means missing the movie with my friends on Saturday. Oh well.');
      }));
      a = a.concat(period(5));
      if (S.sit === 'avery') a.push(step('bday', async function (api, S) {
        await api.quest('Go home. Someone is waiting for you.', 'mom');
        await api.say('mom', 'Happy 18th birthday! There’s cake.');
        var q = Q('newline', S); await api.ask('mom', q, 'q-newline', q.label, 2);
      }));
      a.push(step('stamps', async function (api, S) {
        var order = [['jas', 'Jas at Service Canada'], ['grandpa', 'Grandpa'], ['nurse', 'Nurse Kaur at the hospital']];
        api.give('Deduction Map'); S.mapGiven = true; S.stampPhase = true;
        while (true) {
          var left = order.filter(function (o) { return !S.stamps[o[0]]; });
          if (!left.length) break;
          await api.quest('Where do your deductions go? Visit ' + left.map(function (o) { return o[1]; }).join(', ') + ' (' + (3 - left.length) + ' of 3)', left[0][0]);
          await stampVisit(api, S, left[0][0]);
        }
        S.stampPhase = false;
      }));
      a = a.concat(period(6));
      a.push(step('end3', async function (api, S) {
        await api.quest('Show Ms. Okafor your Deduction Map', 'okafor');
        var q = Q('taxfree', S); await api.ask('okafor', q, 'q-taxfree', q.label, 2);
        await api.say('okafor', ['Now do Step 3 of your project: for each deduction, write where it goes and who it helps. Your Deduction Map can help.', 'Come back after your next lesson for Chapter 4.']);
      }));
    }
    if (ch === 3) {
      a.push(step('hall', async function (api, S) {
        await api.quest('Go to the Town Hall meeting about taxes', 'mayor');
        await api.say('mayor', 'Welcome! Tonight the town is talking about one question: should more tax come off pay, or less?');
        await dialPanel(api, S); api.give('Tax Opinion card');
        await api.say('mayor', 'Thank you. Every opinion needs a reason and a trade-off. Yours has both.');
      }));
      a = a.concat(period(7), period(8));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and count your jar', 'table');
        var o = outcome(S.run), Wk = W(S);
        if (o.win) { api.place('goal', 'home', 8, 5, { draw: SIT[S.sit].goalIcon, label: Wk.goalLabel }); await api.say('you', ['The jar has ' + fmt(S.run.jar) + '. That’s enough for ' + Wk.goalLabel + '!', 'Every bill is paid, with ' + fmt(S.run.bank) + ' left in the bank.']); }
        else if (o.why === 'overdrawn') await api.say('you', ['The jar has ' + fmt(S.run.jar) + ', but my account is overdrawn (' + fmt(S.run.bank) + ').', 'Some bills are unpaid, so it does not count yet.']);
        else await api.say('you', ['The jar has ' + fmt(S.run.jar) + ' of ' + fmtW(Wk.goal) + '. ' + fmt(Wk.goal - S.run.jar) + ' short.'].concat(S.run.jar + S.run.bank >= Wk.goal ? ['So close: ' + fmt(S.run.bank) + ' was sitting in the bank. Moving more of my take-home pay would have done it.'] : []));
        var firstTime = !S.finished; S.finished = true; S.win = !!o.win;
        if (firstTime) api.profileAdd('closet', WORK[S.run.job].outfit); api.profileAdd('plan', { mission: '7-income-tax', title: 'First Paycheque', text: 'My take-home pay as a ' + J(S).title + ': ' + fmt(S.run.log[S.run.log.length - 1].stub.net) + ' from ' + fmt(S.run.log[S.run.log.length - 1].stub.gross) + ' gross.' });
        api.profileAdd('finished', '7-income-tax'); api.refresh();
        await api.say('okafor', ['Well done, ' + api.profile.name + '. Your My Plan wall at home has a new page.', 'Now do Step 4 of your project: pick your path and plan your product.', 'Show your teacher the report: Menu → Report for my teacher.']);
      }));
    }
    return a;
  }
  async function stampVisit(api, S, id) {
    var key = { jas: 'card-ei', grandpa: 'card-cpp', nurse: 'card-tax' }[id], q = Q(key, S);
    if (id === 'jas') await api.say('jas', 'The store I worked at closed. I’m looking for a new job, and money still comes in every two weeks.');
    if (id === 'grandpa') await api.say('grandpa', 'I worked for 40 years. Now I’m retired, and a payment comes every month.');
    if (id === 'nurse') await api.say('nurse', 'We treat everyone who comes in, and nobody gets a bill at the door.');
    await api.ask(id, q, 'q-' + key, q.label, 2);
    S.stamps[id] = 1; api.toast('Stamp added to your Deduction Map (' + Object.keys(S.stamps).length + ' of 3)'); api.save();
  }

  /* ── Register the mission ── */
  T.mission({
    id: '7-income-tax', unitLabel: 'CEFL Grade 7 · Income and Tax · Project: First Paycheque', title: 'Payday: Where Does the Paycheque Go?',
    iCan: 'I can work out where a paycheque goes, from gross pay to take-home pay, and check a pay stub for mistakes.',
    foot: 'This is a model. The pay rules are the real 2026 rates from your Pay Card. The people, jobs and businesses are made up. Bills are counted every two weeks.',
    realRule: 'two bounced payments from Chapter 2 on end the chapter', lostLine: 'Two payments bounced. In Real mode that ends the chapter. Plan the jar from take-home pay minus bills, and keep a small cushion.',
    chapters: [
      { name: 'Pick a job', step: 'Step 1', moment: 'Moment 1: four ways to get paid' },
      { name: 'The pay stub', step: 'Step 2', moment: 'Moment 2: gross pay and net pay' },
      { name: 'Where it goes', step: 'Step 3', moment: 'Moment 3: where deductions go' },
      { name: 'Your call', step: 'Step 4', moment: 'Moment 4: what taxes pay for' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps,
    outfit: function (S) { return S.run && S.run.job ? WORK[S.run.job].outfit : 'none'; },
    placeObjects: function (api, S) {
      api.place('jobboard', 'jobcentre', 8, 5, { draw: 'cork', label: 'Job board' });
      api.place('table', 'home', 6, 4, { label: 'Kitchen table' });
      api.place('fridge', 'home', 4, 2, { label: 'The fridge' });
      api.place('myplan', 'home', 7, 1, { label: 'My Plan wall' });
      if (S.letters && S.letters.length) api.place('letter', 'home', 3, 5, { draw: 'letter', solid: false, label: 'A letter' });
      if (S.finished && S.win) api.place('goal', 'home', 8, 5, { draw: SIT[S.sit].goalIcon, label: 'Your goal' });
    },
    people: function (S) {
      var out = {}, prof = T.api.profile, skin = prof && prof.look ? prof.look.skin : 's3';
      Object.keys(WORK).forEach(function (jk) { var w = WORK[jk]; out[bossId(jk)] = { name: w.boss, role: JOBS[jk].biz, map: w.b, x: 5, y: 4, dir: 'down', look: w.look }; });
      out.mom = { name: 'Mom', role: 'Family', map: 'home', x: 3, y: 4, dir: 'right', look: { base: 1, skin: skin, hair: 'brown', shirt: 'purple', pants: '#3b3f5c' }, hidden: S.sit === 'dev' || S.sit === 'rosa' };
      if (S.sit === 'dev') out.dev = { map: 'home', x: 3, y: 4, dir: 'right', role: 'Roommate' };
      if (S.sit === 'rosa') out.rosa = { map: 'home', x: 3, y: 4, dir: 'right', role: 'Housemate' };
      out.nurse = { x: 5, y: 3 }; out.mayor = { x: 5, y: 3 }; out.librarian = { x: 5, y: 3 };
      return out;
    },
    doorOpen: function (id, S) {
      var open = { home: 1, grandpa: 1, jobcentre: 1, bank: 1, servicecanada: 1, hospital: 1, townhall: 1, library: 1 };
      if (S.run && S.run.job) open[WORK[S.run.job].b] = 1;
      return !!open[id];
    },
    lockedLine: function (id, S) {
      var b = T.world.building(id), work = null;
      Object.keys(WORK).forEach(function (jk) { if (WORK[jk].b === id) work = jk; });
      if (work) return S.run && S.run.job ? b.name + ': staff only. You work at ' + JOBS[S.run.job].biz + '.' : b.name + ' is hiring. Check the job board at the Job Centre first.';
      if (/university|polytechnic|trades|school/.test(id)) return b.name + ': tours start in another mission.';
      return b.name + ' is closed right now.';
    },
    talk: function (id, S, api) {
      if (S.stampPhase && (id === 'jas' || id === 'grandpa' || id === 'nurse') && !S.stamps[id]) { // a stamp visit out of order still counts
        stampVisit(api, S, id).then(function () { var left = ['jas', 'grandpa', 'nurse'].filter(function (k) { return !S.stamps[k]; }); api.questText('Where do your deductions go? ' + (3 - left.length) + ' of 3 stamps. Keep going.'); });
        return true;
      }
      var j = S.run && S.run.job, lines = {
        okafor: 'Keep going! Your goal is on the gold line at the top.', sam: S.run && S.run.p ? 'Your balance is ' + fmt(S.run.bank) + '. The jar has ' + fmt(S.run.jar) + '.' : 'Welcome to the bank! Bring your paycheque here on payday.',
        jas: S.stamps.jas ? 'Thanks for listening. EI keeps me going while I look.' : 'Job hunting is hard work.', agent: 'Service Canada helps with EI, CPP and more.',
        grandpa: S.stamps.grandpa ? 'Every paycheque you get pays a little into your own pension.' : 'Come visit more often!', nurse: 'Wash your hands!', mayor: 'Town council meets here.',
        librarian: 'The library has free computers and books about careers.', avery: 'Hi! Have you seen the new job postings?', dev: 'Payday is the best day.', rosa: 'Budgets are not about cutting the fun. They are about choosing.',
        worker: 'Hard hats on! This site is busy.', mom: 'Dinner’s at six.',
        fridge: S.run ? 'The bills on the fridge: ' + W(S).bills.map(function (b) { return b[1] + ' ' + fmtW(b[2]); }).join(', ') + '.' : 'Leftovers again.',
        table: 'The kitchen table. This is where you plan payday.', jobboard: j ? 'You already have a job at ' + JOBS[j].biz + '.' : 'Job postings.',
        myplan: api.profile.plan.length ? 'My Plan wall: ' + api.profile.plan.map(function (x) { return x.title + ' — ' + x.text; }).join(' ') : 'My Plan wall. Finish a mission to pin a page here.',
        letter: S.letters.length ? S.letters.join(' ') : 'An old letter.', goal: 'You did it. ' + (S.run ? W(S).goalLabel : '') + '!'
      };
      if (/^boss_/.test(id)) return j && bossId(j) === id ? 'Good to see you. Your next shift is on the schedule.' : 'We’re a busy shop. Good luck with the job hunt!';
      return lines[id] || null;
    },
    hud: function (S) {
      if (!S.run) return [{ label: 'Goal', value: 'Talk to Ms. Okafor' }];
      var Wk = W(S), out = [{ label: 'Jar', value: fmt(S.run.jar) + ' / ' + fmtW(Wk.goal), title: 'Goal jar: ' + Wk.goalLabel }, { label: 'Bank', value: fmt(S.run.bank), warn: S.run.bank < 0, tag: S.run.bank < 0 ? 'overdrawn' : '' },
        { label: 'Paycheque', value: Math.min(PERIODS, S.run.p + (S.run.p < PERIODS ? 1 : 0)) + ' of ' + PERIODS }];
      if (S.run.bounces) out.push({ label: 'Bounced', value: String(S.run.bounces), warn: true });
      return out;
    },
    items: function (S) {
      var it = [{ name: 'Pay Card (2026)', icon: '📇', note: 'EI, CPP and the income tax table', view: payCardHTML },
        { name: 'Project Checker', icon: '✔️', note: 'Check your own project’s pay stub', view: function () { return checkerHTML(S); }, bind: function (el) { bindChecker(S, el); } }];
      if (!S.run) return it;
      if (S.run.job) it.push({ name: 'Job ad: ' + J(S).title, icon: '📰', note: J(S).biz, view: function () { var j = J(S); return '<div class="ct-doc"><b>' + esc(j.title) + '</b> · ' + esc(j.biz) + '<p>' + esc(j.what) + '</p><p><b>' + payText(j) + '</b></p></div>'; } });
      S.run.log.forEach(function (l) { it.push({ name: 'Pay stub ' + l.p, icon: '🧾', note: 'Net ' + fmt(l.stub.net - (l.short || 0)), view: function () { return stubView(S, l); } }); });
      if (S.mapGiven) {
        it.push({ name: 'Deduction Map', icon: '🗺️', note: Object.keys(S.stamps).length + ' of 3 stamps', view: function () {
          return '<table class="ct-rep"><tbody><tr><td>EI</td><td>' + (S.stamps.jas ? '✅ Jas: pay while looking for a new job' : '— visit Jas at Service Canada') + '</td></tr><tr><td>CPP</td><td>' + (S.stamps.grandpa ? '✅ Grandpa: a pension after retiring' : '— visit Grandpa') + '</td></tr><tr><td>Income tax</td><td>' + (S.stamps.nurse ? '✅ The hospital: health care for everyone' : '— visit the hospital') + '</td></tr></tbody></table>'; } });
      }
      if (S.typed.claim) it.push({ name: 'Tax Opinion card', icon: '🗳️', note: S.typed.claim, view: function () { return '<p><b>Claim:</b> ' + esc(S.typed.claim) + '</p><p><b>Reason:</b> ' + esc(S.typed.reason || '') + '</p><p><b>Trade-off:</b> ' + esc(S.typed.tradeoff || '') + '</p>'; } });
      return it;
    },
    groupAnswer: function (k, a) { var m = /^stub-p(\d)-(\w+)$/.exec(k); return m ? { id: 'stub-p' + m[1], label: 'Paycheque ' + m[1] + ' pay stub (typed)', part: a.label.replace(/^Paycheque \d: /, '') } : null; },
    report: function (S) {
      if (!S.run) return '<p>Not started yet.</p>';
      var h = '<p>Future you: <b>' + esc(SIT[S.sit].label) + '</b>' + (S.run.job ? ' · ' + esc(J(S).title) + ' (' + J(S).type + ')' : '') + (S.finished ? ' · <b>' + (S.win ? 'Goal reached' : 'Goal not reached') + '</b>' : '') + '</p>';
      if (S.run.log.length) h += '<h3>Paycheques</h3><div class="ct-tablewrap"><table class="ct-rep"><thead><tr><th>#</th><th>Hours</th><th>Gross</th><th>Deductions</th><th>Take-home</th><th>Stub check</th><th>To jar</th><th>Bank</th></tr></thead><tbody>' +
        S.run.log.map(function (l) { var sg = S.signs[l.p]; return '<tr><td>' + l.p + (l.bounced ? ' <b style="color:#b42318">bounced</b>' : '') + '</td><td class="ct-n">' + l.hours + '</td><td class="ct-n">' + fmt(l.stub.gross) + '</td><td class="ct-n">' + fmt(l.stub.total) + '</td><td class="ct-n">' + fmt(l.stub.net - (l.short || 0) + l.tips) + '</td><td>' +
          (sg ? (sg.result === 'caught' ? 'mistake caught ✓' : sg.result === 'signed' ? 'signed a mistake (−' + fmt(sg.short) + ')' : 'checked, correct ✓') : l.p <= 2 ? 'shown' : 'typed') + '</td><td class="ct-n">' + fmt(l.jarIn) + '</td><td class="ct-n">' + fmt(l.bank) + '</td></tr>'; }).join('') +
        '</tbody></table></div><p class="ct-small">Jar: ' + fmt(S.run.jar) + ' of ' + fmtW(W(S).goal) + '. Bounced payments: ' + S.run.bounces + '.</p>';
      var rows = [];
      if (S.typed.downside) rows.push(['One downside of this pay type', S.typed.downside]);
      if (S.typed.why) rows.push(['Why gross pay is not what lands in the bank', S.typed.why]);
      if (S.typed.claim) rows.push(['Tax claim', S.typed.claim], ['Reason', S.typed.reason || ''], ['Trade-off', S.typed.tradeoff || '']);
      h += '<h3>What I wrote</h3>' + (rows.length ? '<table class="ct-rep"><tbody>' + rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</tbody></table>' : '<p>Nothing yet.</p>');
      h += '<h3>Deduction Map</h3><p>' + Object.keys(S.stamps).length + ' of 3 stamps.</p>';
      h += '<h3>Project Checker</h3>' + (S.checks.length ? '<table class="ct-rep"><thead><tr><th>When</th><th>Job</th><th>Age</th>' + LINES.map(function (L) { return '<th>' + L.name + '</th>'; }).join('') + '</tr></thead><tbody>' + S.checks.map(function (c) { return '<tr><td>' + esc(c.t) + '</td><td>' + esc(c.job) + '</td><td>' + c.age + '</td>' + LINES.map(function (L) { var m = c.marks[L.k]; return '<td>' + (m === 'ok' ? '✓' : m === 'no' ? '✗' : m === 'follows' ? '→' : '—') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>' : '<p>Not used yet.</p>');
      return h;
    },
    test: { // for the debug harness only: the model, and the right answer to every panel
      PAY_CARD: PAY_CARD, eiOf: eiOf, cppOf: cppOf, rowOf: rowOf, taxOf: taxOf, taxAtRow: taxAtRow, stubOf: stubOf, WORKERS: WORKERS, JOBS: JOBS, newRun: newRun, setJob: setJob,
      scheduleOf: scheduleOf, actualOf: actualOf, safeTakeHome: safeTakeHome, billsOf: billsOf, outcome: outcome, helpTopic: helpTopic, Q: Q, ASKS: ASKS, offerQ: offerQ,
      errorKinds: errorKinds, stubAsPrinted: stubAsPrinted, errorPlan: errorPlan, errorKindFor: errorKindFor, paydaySigned: paydaySigned, WORK: WORK
    }
  });
})();
