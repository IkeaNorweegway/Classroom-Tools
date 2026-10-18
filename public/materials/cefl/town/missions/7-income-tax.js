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
  var WORK = { // each boss has a voice: hi (first shift), pay (payday), app (when Pay-O-Matic arrives), idle (small talk)
    grocer: { b: 'grocer', boss: 'Mr. Huang', outfit: 'apron', look: { base: 2, skin: 's2', hair: 'black', shirt: 'green', pants: '#3b3f5c' },
      hi: 'Welcome to Valley Market! Stack the apples nicely. People notice.', pay: 'Payday! Nice work this week.', app: 'We use a new app for pay now. Pay-O-Matic 3000. I am... not a computer person.', idle: 'The bananas came in green again. Patience.' },
    busser: { b: 'diner', boss: 'Ms. Pereira', outfit: 'busser', look: { base: 1, skin: 's3', hair: 'brown', shirt: 'red', pants: '#2f2f38' },
      hi: 'Welcome to the Lantern! Grab a tray. Table six needs you.', pay: 'Payday! You earned it. Table six left a mess.', app: 'Head office says we use Pay-O-Matic 3000 now. Fancy, right?', idle: 'Try the pie. Everyone says it’s the best in town.' },
    sports: { b: 'sports', boss: 'Coach Tam', outfit: 'polo', look: { base: 0, skin: 's2', hair: 'black', shirt: 'red', pants: '#2f3a5c' },
      hi: 'Welcome to the team! Big smile. Know your shoes.', pay: 'Payday! Great hustle out there.', app: 'Huddle up. Payroll is on Pay-O-Matic 3000 now. New playbook!', idle: 'Hydrate! That goes for everyone.' },
    warehouse: { b: 'warehouse', boss: 'Mr. Kowalski', outfit: 'hivis', look: { base: 4 },
      hi: 'Vest on. Lift with your legs. We ship by four.', pay: 'Payday. Good work. Don’t spend it all on snacks.', app: 'Head office bought Pay-O-Matic 3000. I don’t trust it. Check your stub.', idle: 'Forty boxes an hour. That’s the goal.' },
    bikeshop: { b: 'bikeshop', boss: 'Bea', outfit: 'cap', look: { base: 3, skin: 's1', hair: 'blond', shirt: 'blue', pants: '#3b3f5c' },
      hi: 'Welcome to Spoke & Chain! Do you know a derailleur from a doorknob? You will.', pay: 'Payday! Ride safe.', app: 'We switched to Pay-O-Matic 3000. It has more settings than my bike.', idle: 'A clean chain is a happy chain.' },
    phones: { b: 'phones', boss: 'Mr. Singh', outfit: 'lanyard', look: { base: 2, skin: 's3', hair: 'black', shirt: 'teal', pants: '#2f2f38' },
      hi: 'Welcome to CellPoint! Smile. Every customer is a sale waiting to happen.', pay: 'Payday! Great numbers this week.', app: 'Great news! Pay-O-Matic 3000! Fully automatic! What could go wrong?', idle: 'Have you seen the new phone? It folds. Twice.' },
    office: { b: 'clinic', boss: 'Ms. Ahmed', outfit: 'blazer', look: { base: 3, skin: 's3', hair: 'black', shirt: 'purple', pants: '#2f2f38' },
      hi: 'Welcome to Riverbend Clinic. Here is your desk. And your very full calendar.', pay: 'Your pay is ready. Thank you for keeping us organized.', app: 'The clinic moved payroll to Pay-O-Matic 3000. Please review your stub carefully.', idle: 'If it isn’t in the calendar, it didn’t happen.' },
    apprentice: { b: 'electric', boss: 'Joe', outfit: 'hardhat', look: { base: 5 },
      hi: 'Welcome aboard! Rule one: hard hat on. Rule two: see rule one.', pay: 'Payday! Safe work, good work.', app: 'Office switched pay to some app. Pay-O-Matic 3000. I just do wires, kid.', idle: 'Measure twice, cut once.' },
    furniture: { b: 'furniture', boss: 'Mrs. Novak', outfit: 'nametag', look: { base: 1, skin: 's1', hair: 'grey', shirt: 'purple', pants: '#3b3f5c' },
      hi: 'Welcome, dear! Help people find the comfiest couch in town.', pay: 'Payday, dear! Treat yourself to something small.', app: 'My nephew set up Pay-O-Matic 3000 for us. He says it’s very clever.', idle: 'Sit on that recliner. Isn’t it lovely?' }
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

  /* ── Questions, asked by the townspeople in their own words. The facts and the misconception-based wrong choices
     are the same as v1; only the voice changed. Reading level: short sentences, everyday words, curriculum terms kept. ── */
  function Q(id, S) {
    var j = S.run && S.run.job ? JOBS[S.run.job] : null, x = S.run ? extraHours(S.run.worker) : 0, yr;
    switch (id) {
      case 'paytype': return { label: 'Pay type: what is true', ch: 0, text: 'Okay, quick check before you start. What’s true about how this job pays?', opts: ({
        wage: [['My pay goes up and down with my hours. Fewer hours means a smaller paycheque.', 1, 'Yes! Hours times your wage. Every hour counts.'], ['I get the same pay every two weeks, even if I work less.', 0, 'That’s a salary. With a wage, every hour counts.'], ['Hourly jobs always pay more than salary jobs.', 0, 'Not always. It depends on the rate and the hours.']],
        salary: [['I get the same pay every two weeks, even if I stay late.', 1, 'Yes! Your salary is split into 26 equal pays.'], ['If I stay late, I get paid more.', 0, 'Not with a salary. Your pay is set for the whole year.'], ['Nothing comes off a salary.', 0, 'Oh, things come off. You’ll see on payday.']],
        commission: [['Part of my pay depends on my sales. A slow month means less money.', 1, 'Yes! Sell more, earn more. Sell less, earn less.'], ['Commission always pays more than an hourly job.', 0, 'Only when sales are good.'], ['My commission is the same every payday.', 0, 'Nope. It goes up and down with your sales.']],
        tips: [['Tips change every shift, so I can’t count on them.', 1, 'Yes! Plan with your wage. Tips are a bonus.'], ['I get the same tips every night.', 0, 'Some nights are busy. Some nights are dead.'], ['My boss decides my tips.', 0, 'Customers decide your tips, not your boss.']]
      })[j.type] };
      case 'whyLess': return { label: 'Why less than the job promised', ch: 0, text: 'So the job said you’d earn more than this. Where did the rest go?', opts: [
        ['Some came off first, for things like EI, CPP and income tax.', 1, 'Bingo! Those are deductions. What’s left is your take-home pay. We call it net pay.'],
        ['My boss kept some of it for the store.', 0, 'Nope. Look at the stub. Every missing dollar has a name.'],
        ['The bank took a fee to put it in my account.', 0, 'Hey! We would never. Well, not for that. The money was gone before it got here.']] };
      case 'extra':
        if (j.type === 'salary') return { label: 'Extra hours on a salary', ch: 2, text: 'If you work those ' + x + ' extra hours, what happens to your pay?', opts: [
          ['Nothing. A salary stays the same, no matter how many hours.', 1, 'Yep. Salary is salary. So it’s up to you.'],
          ['I get paid for every extra hour.', 0, 'Not on a salary. The pay is set for the year.'],
          ['My pay goes down, because more hours means more tax.', 0, 'Tax depends on your pay, not your hours. Your pay stays the same.']] };
        return { label: 'Extra hours: more or less take-home?', ch: 2, text: 'If you take the ' + x + ' extra hours, what happens to your take-home pay?', opts: [
          ['It goes up. A little more tax comes off, but I keep most of it.', 1, 'That’s right. More work, more money in your pocket.'],
          ['It goes down. More pay means more tax, so I lose money.', 0, 'Lots of people think that! But tax only takes part of each extra dollar.'],
          ['It stays the same. Tax takes all the extra pay.', 0, 'Tax takes a bite, not the whole thing.']] };
      case 'newline': return { label: 'Turning 18: what changes', ch: 2, text: 'Something changes on your next pay stub now that you’re 18. Do you know what?', opts: [
        ['CPP starts coming off. And my wage goes up to $15, because the student wage is only for under 18.', 1, 'Look at you! Happy birthday, money expert.'],
        ['Income tax starts, because I’m an adult now.', 0, 'Not yet. Income tax is about how much you earn, not your age.'],
        ['Nothing changes until I finish school.', 0, 'Two things change: your wage, and CPP.']] };
      case 'card-ei': return { label: 'Who EI helps', ch: 2, text: 'Money still comes in every two weeks while I look for work. Where do you think it comes from?', opts: [
        ['From EI. A little came off every paycheque you got. Now it pays you back.', 1, 'Yep. I used to hate that line on my stub. Not anymore.'],
        ['From CPP. CPP is for people who lose their job.', 0, 'Nope, CPP is for when you retire. Ask your grandpa!'],
        ['From income tax. They send it to anyone who asks.', 0, 'Not tax, and not for anyone. You get EI because you worked and paid into it.']] };
      case 'card-cpp': return { label: 'Who CPP helps', ch: 2, text: 'Now a cheque comes for me every month. Can you guess where it comes from?', opts: [
        ['From CPP. You paid into it from every paycheque while you worked.', 1, 'Smart kid! You pay into it now too. Someday it comes back to you.'],
        ['From EI, because you stopped working.', 0, 'Ha! EI is for people looking for a new job. I’m only looking for my glasses.'],
        ['From your bank. It’s a gift for retiring.', 0, 'I wish! No, I paid for this one myself.']] };
      case 'card-tax': return { label: 'What income tax pays for', ch: 2, text: 'Nobody paid us at the door today. So who pays for all this?', opts: [
        ['Everyone does. Income tax and other taxes pay for hospitals.', 1, 'Exactly. About 41% of what Alberta spends goes to health care (2026).'],
        ['EI pays for hospital visits.', 0, 'EI is for people who lost a job. Not for broken wrists.'],
        ['CPP pays for hospital visits.', 0, 'CPP is for retirement. Hospitals run on taxes.']] };
      case 'taxfree':
        if (S.run.worker === 'avery') return { label: 'Why $0 income tax', ch: 2, text: 'Look at your stubs. Income tax: $0.00. Every time! Why?', opts: [
          ['I don’t earn enough in a year. The first $16,452 (Canada) and $22,769 (Alberta) are not taxed.', 1, 'Yes! About $8,000 a year is under both lines. Big brain play!'],
          ['Students don’t pay income tax.', 0, 'Students do pay, if they earn enough. School has nothing to do with it.'],
          ['People under 18 don’t pay income tax.', 0, 'Age doesn’t matter. How much you earn in a year does.']] };
        yr = Math.round(S.run.log[S.run.log.length - 1].stub.gross * 26 / 10000) * 100;
        return { label: 'Why tax is less than 22%', ch: 2, text: 'You earn about ' + fmtW(yr) + ' a year. The tax rates are 14% and 8%. That’s 22%! So why is your tax so much smaller?', opts: [
          ['Part of my pay is not taxed. Only money above $16,452 (Canada) and $22,769 (Alberta) gets taxed.', 1, 'That’s it! That’s why the Pay Card starts at zero.'],
          ['Young workers get a lower tax rate.', 0, 'Same rate at any age. The tax-free part makes the difference.'],
          ['Tax only comes off some paycheques.', 0, 'It comes off every one. Just less than you’d think.']] };
    }
  }
  /* "What would help?" is asked at home by your family or roommate */
  var ASKS = {
    bounce: { text: 'Ouch. A payment bounced last time. What’s your plan this time?', opts: [
      ['Put less in the jar. Plan with my take-home pay, not my gross pay.', 1, 'Good plan. Plan with what lands in the bank, and keep a little extra just in case.'],
      ['Put more in the jar, so the jar can pay my bills.', 0, 'The jar is locked until goal day. More in the jar means less for bills.'],
      ['Do the same thing again.', 0, 'Same plan, same pay... same bounce.']] },
    slow: { text: 'Your jar is falling behind. But you had money left over after bills. What would help?', opts: [
      ['Put more in the jar. Money left after bills can go to my goal.', 1, 'Yes! Take-home pay minus bills. Most of what’s left can go in the jar.'],
      ['Put less in the jar.', 0, 'Then the jar falls even further behind.'],
      ['Do the same thing again.', 0, 'Same plan means the jar stays behind.']] }
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
        body.innerHTML = '<p>Pay-O-Matic 3000 made this stub for ' + esc(boss) + '. <b>Check every line</b> with your timesheet and the Pay Card (in your Bag). Is a line wrong? Tap it, then dispute it. Once you sign, the bank pays what the stub says.</p>' + timesheet(S, p) +
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
        if (st.root && flagged === st.root) { rec(true); S.signs[p] = { kind: kind, result: 'caught', short: 0 }; msgOk = true; msg = boss + ': Huh. You’re right! Pay-O-Matic messed that up. I fixed it. Your stub now pays ' + fmt(right.net) + '.'; finish(0, true); return; }
        rec(false);
        if (st.root && follows[flagged]) msg = boss + ': That line is wrong because a line above it is wrong. Where does the mistake start?';
        else msg = boss + ': ' + explain(flagged);
        msgOk = false; flagged = null; draw();
      }
      function sign() {
        if (st.root && api.mode === 'gentle' && !gentleWarned) { gentleWarned = true; rec(false); msgOk = false; msg = 'Wait! One line does not match your timesheet or the Pay Card. Check again, or sign anyway.'; draw(); return; }
        if (!st.root) { rec(true); S.signs[p] = { kind: null, result: 'ok', short: 0 }; finish(0, false); return; }
        rec(false); S.signs[p] = { kind: kind, result: 'signed', short: right.net - st.net }; finish(right.net - st.net, false);
      }
      function finish(short, fixed) {
        body.innerHTML = (fixed ? '<div class="ct-banner good">Fixed before you signed. You will be paid the right amount.</div>' : short ? '<div class="ct-banner bad">You signed it. The bank will pay what the stub says.</div>' : '<div class="ct-banner good">Every line checks out. Signed!</div>') +
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

  /* ── Steps: the story ──
     Chapter 1: your first job and the first-paycheque shock. Chapter 2: you learn to read a stub; then every shop in town
     switches to the payroll app Pay-O-Matic 3000. Chapter 3: stubs start coming out wrong (yours, and a friend's); Jas is
     laid off; you find out where deductions go. Chapter 4: Town Hall (the app, then taxes), two last paydays, the goal. */
  function step(id, run) { return { id: id, run: run }; }
  function wantAsk(S) { // "What would help?": never two paycheques running; a topic stops after 2 first-try answers or 4 showings
    var t = helpTopic(S.run), a;
    if (!t) return null; a = S.asks[t];
    if (a && (a.first >= 2 || a.seen >= 4)) return null;
    if (S.run.p - S.lastAsk < 2) return null;
    return t;
  }
  function familyId(S) { return S.sit ? SIT[S.sit].family : 'mom'; }
  function friendId(S) { return S.sit === 'avery' ? 'dev' : 'avery'; } // the friend whose stub is wrong too
  var PUNS = ['Why did the penny go to school? To make some cents. ...Sorry.', 'I’d tell you a joke about interest. But you wouldn’t be interested.',
    'Money talks. Mine just says goodbye.', 'I’m saving my best jokes. Compound interest, you know.', 'What do you call a sad dollar? A bummed buck. I’ll stop.',
    'I counted to a million once. Took forever. That’s why I work at a bank.', 'This bank has great security. Even our jokes are locked up.'];
  function pun(S) { S.pun = ((S.pun || 0) + 1) % PUNS.length; return PUNS[S.pun]; }
  function period(p) {
    return [
      step('plan' + p, async function (api, S) {
        await api.quest(p === 1 ? 'Go home and plan your first payday at the kitchen table' : 'Go home and plan payday ' + p + ' at the kitchen table', 'table');
        if (S.letters.length) { await api.say(familyId(S), ['Uh oh. You got a letter.', S.letters.join(' '), 'Maybe plan a little more carefully this time?']); S.letters = []; api.unplace('letter'); }
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
        var b = bossId(S.run.job), w = WORK[S.run.job];
        await api.quest('Go to work at ' + bizName(S) + '. ' + w.boss + ' is waiting.', b);
        if (p === 1) await api.say(b, w.hi);
        await shiftPanel(api, S, p);
        if (p >= 5 && p <= 7) {
          if (!S.errs) S.errs = errorPlan(S.seed);
          await api.say(b, p === 5 ? ['Here’s your stub. Pay-O-Matic made it!', 'The app is new. Please check it before you sign.'] : p === 6 ? 'Stub time. Check it, then sign. You know the drill.' : ['They say Pay-O-Matic got an update.', 'Check your stub anyway, okay?']);
          var short = await signPanel(api, S, p, errorKindFor(S.run, p, S.errs));
          S.signs[p] = S.signs[p] || { result: 'ok', short: short || 0 }; S.signs[p].short = short || 0;
          if (S.signs[p].result === 'caught') S.clues = (S.clues || 0) + 1;
        } else await api.say(b, p === 1 ? [w.pay, 'Here’s your first paycheque. Take it to the bank!'] : w.pay);
        api.give('Pay stub ' + p); api.hud();
      }),
      step('bank' + p, async function (api, S) {
        await api.quest('Take paycheque ' + p + ' to Sam at the bank', 'sam');
        var signed = S.signs[p];
        if (p === 1) { await api.say('sam', ['Welcome to the bank! I’m Sam.', 'I’d tell you a joke about money. But it’s not worth it.', 'Okay! Let’s open your very first pay stub.']); await revealPanel(api, S, p); }
        else if (api.ch === 0) { await api.say('sam', pun(S)); await revealPanel(api, S, p); }
        else if (!signed) { await api.say('sam', p === 3 ? ['This time, you fill in the stub.', 'Grab your Pay Card from your Bag. You’ve got this.'] : [pun(S), 'Same as last time. You fill it in.']); await stubCalcPanel(api, S, p); }
        else await api.say('sam', signed.short ? ['Hmm. This stub pays you ' + fmt(signed.short) + ' less than your timesheet says.', 'You signed it, so it will be hard to get that back.', 'Next time, check every line before you sign.'] : signed.result === 'caught' ? 'Nice catch on that stub! Lots of people just sign.' : 'Checked and signed. Let’s put it in.');
        var fresh = S.run.p < p, l = fresh ? paydaySigned(S.run, S.plan, api.mode === 'real', signed ? signed.short : 0) : S.run.log[p - 1]; // a reload never pays twice
        api.hud();
        await resultPanel(api, S, l);
        if (l.bounced && fresh) { S.letters.push('It’s from your ' + (S.run.worker === 'avery' ? 'phone company' : 'landlord') + ': “Your payment bounced. Your bank charged you a ' + fmtW(FEE) + ' fee. Please make sure there is enough money next time.”'); api.place('letter', 'home', 6, 5, { draw: 'letter', solid: false, label: 'A letter' }); }
        if (p === 1) await api.ask('sam', Q('whyLess', S), 'q-whyLess', Q('whyLess', S).label, 0);
        S.pendingAsk = wantAsk(S);
        if (api.mode === 'real' && S.run.strikes >= STRIKES_TO_LOSE) return 'lost';
      })
    ];
  }
  var FUTURE = {
    avery: ['You’re 17. You live with your mom and go to high school.', 'Your old laptop just died. Right before a big project! You need a new one.'],
    dev: ['You’re 19. You share an apartment with your buddy Dev.', 'Dev snores. Loud. You want your own place someday.'],
    rosa: ['You’re 24. You share a house with Rosa. You’re also paying back a student loan.', 'Last year your car broke down, and you had no money saved. Never again.']
  };
  function chapterSteps(ch, S) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the Job Centre and say hi to Ms. Okafor', 'okafor');
        await api.say('okafor', ['Hey, hey! You must be ' + api.profile.name + '. I’m Ms. Okafor!', 'I help people find work. It’s the best job in town. Don’t tell the mayor.', 'Want to try something fun? Let’s jump ahead a few years. You’ll get a job and a real paycheque.']);
        var keys = ['avery', 'dev', 'rosa'], i = await api.choose('okafor', 'Which future you do you want to play?', keys.map(function (k) { return SIT[k].label; }));
        S.sit = keys[i]; S.run = newRun(S.sit, null, S.seed);
        await api.say('okafor', FUTURE[S.sit].concat(['So here’s your goal: save ' + fmtW(W(S).goal) + ' for ' + W(S).goalLabel + '. You have 8 paydays. That’s about four months.', 'First, you need a job! Check the job board by the window. Let’s go!']));
        api.give('Pay Card'); api.hud(); api.refresh();
      }));
      a.push(step('board', async function (api, S) {
        await api.quest('Find a job on the job board at the Job Centre', 'jobboard');
        var jk = await jobBoard(api, S);
        setJob(S.run, jk); api.give('Job ad: ' + JOBS[jk].title); api.outfit(); api.refresh();
        await api.say('you', ['I got the job at ' + JOBS[jk].biz + '!', 'And I get a ' + T.art.OUTFITS[WORK[jk].outfit].label.toLowerCase() + '. Looking good.']);
      }));
      a.push(step('paytype', async function (api, S) {
        await api.quest('Tell Ms. Okafor about your new job', 'okafor');
        await api.say('okafor', 'You got a job? Big play! I knew it.');
        var q = Q('paytype', S); await api.ask('okafor', q, 'q-paytype', q.label, 0);
        await typedPanel(api, S, 'downside', 'One downside', 'Every way to get paid has a downside. What is one downside of this pay type for you? (Your project asks this too.)');
        await api.say('okafor', ['Nice thinking. Now go home and plan your first payday.', 'Then go get paid!']);
      }));
      a = a.concat(period(1), period(2));
      a.push(step('end1', async function (api, S) {
        await api.quest('Tell Ms. Okafor how your first month went', 'okafor');
        await api.say('okafor', ['First month done! Your jar has ' + fmt(S.run.jar) + '.', 'Did you see how much came off your pay? Wild, right?', 'Time for Step 1 of your project. Find a real job ad and work out the gross pay.', 'See you after your next lesson!']);
      }));
    }
    if (ch === 1) {
      a.push(step('start2', async function (api, S) {
        startChapter(S.run, 2); api.hud();
        if (S.run.covered) {
          var f = familyId(S), lines = f === 'mom' ? ['Hey. Your bank account went below zero.', 'I covered it this time. ' + fmt(S.run.covered) + '.', 'From now on, plan with the money that really lands in your account. Deal?']
            : f === 'dev' ? ['Dude. Your account went below zero.', 'I covered you. ' + fmt(S.run.covered) + '. You owe me pizza.', 'Next time, plan with what lands in the bank. Not the big number.']
            : ['So... your account dipped below zero.', 'I covered it. ' + fmt(S.run.covered) + '. Just this once!', 'Plan with your take-home pay. That’s the money you really get.'];
          await api.quest('Go home. Someone wants to talk about money.', f); await api.say(f, lines);
        }
      }));
      a = a.concat(period(3), period(4));
      a.push(step('why', async function (api, S) {
        await api.quest('Tell Ms. Okafor what you learned', 'okafor');
        await typedPanel(api, S, 'why', 'In your own words', 'Why didn’t all your gross pay land in your bank account? Name the deductions.');
        await api.say('okafor', ['Love it. Now do Step 2 of your project: build a pay stub. The Project Checker in your Bag can check your lines.', 'Oh! Big news. Every shop in town is getting a new payroll app.', 'It’s called Pay-O-Matic 3000. It does all the pay math for the bosses.', 'What could go wrong? ...Right? See you next lesson!']);
      }));
    }
    if (ch === 2) {
      a.push(step('extra', async function (api, S) {
        var b = bossId(S.run.job), w = WORK[S.run.job];
        await api.quest('Your boss at ' + bizName(S) + ' wants to see you', b);
        await api.say(b, [w.app, 'Oh, and we’re busy! Can you work ' + extraHours(S.run.worker) + ' extra hours on the weekends?']);
        var q = Q('extra', S); await api.ask(b, q, 'q-extra', q.label, 2);
        var i = await api.choose(b, 'So, will you take the extra hours?', ['Sure, I’ll take them', 'No thanks']);
        S.run.extra = i === 0; S.extra = S.run.extra; S.hangout = S.run.extra;
        await api.say('you', S.run.extra ? 'That means missing the movie with my friends on Saturday. Oh well.' : 'I need my weekends. Maybe next time.');
      }));
      a = a.concat(period(5));
      if (S.sit === 'avery') a.push(step('bday', async function (api, S) {
        await api.quest('Go home. Someone is waiting for you.', 'mom');
        await api.say('mom', ['Surprise! Happy 18th birthday!', 'There’s cake. Chocolate, obviously.']);
        var q = Q('newline', S); await api.ask('mom', q, 'q-newline', q.label, 2);
      }));
      a.push(step('clue', async function (api, S) {
        var f = friendId(S), name = T.world.PEOPLE[f].name;
        await api.quest(name + ' needs help with something', f);
        await api.say(f, ['Hey! Can you look at this?', 'My pay stub says I worked 36 hours. I worked 40!', 'My boss says it’s the new app. Pay-O-Matic.']);
        await api.say('you', S.clues ? ['Mine had a mistake too! Something is wrong with that app.', 'You should talk to your boss before you sign.'] : ['Mine looked okay. So far.', 'Check every line before you sign, okay? I will too.']);
        S.clueFriend = name; api.give('Pay-O-Matic notes'); api.save();
      }));
      a.push(step('stamps', async function (api, S) {
        var order = [['jas', 'Jas at Service Canada'], ['grandpa', 'Grandpa'], ['nurse', 'Nurse Kaur at the hospital']];
        await api.quest('Ms. Okafor wants to show you something', 'okafor');
        await api.say('okafor', ['You know what comes off your pay. But where does it GO?', 'Let’s find out. Here’s a Deduction Map.', 'Visit Jas, your grandpa and the hospital. Get a stamp from each!']);
        api.give('Deduction Map'); S.mapGiven = true; S.stampPhase = true;
        while (true) {
          var left = order.filter(function (o) { return !S.stamps[o[0]]; });
          if (!left.length) break;
          await api.quest('Where does it go? Visit ' + left.map(function (o) { return o[1]; }).join(', ') + ' (' + (3 - left.length) + ' of 3 stamps)', left[0][0]);
          await stampVisit(api, S, left[0][0]);
        }
        S.stampPhase = false;
      }));
      a = a.concat(period(6));
      a.push(step('end3', async function (api, S) {
        await api.quest('Show Ms. Okafor your Deduction Map', 'okafor');
        await api.say('okafor', 'Three stamps! You’re on fire. One more question.');
        var q = Q('taxfree', S); await api.ask('okafor', q, 'q-taxfree', q.label, 2);
        await api.say('okafor', ['Now do Step 3 of your project. Where does each deduction go? Who does it help? Your Deduction Map can help.', 'And hey, Town Hall is having a big meeting. Everyone is upset about Pay-O-Matic. Bring your stubs!']);
      }));
    }
    if (ch === 3) {
      a.push(step('hall', async function (api, S) {
        await api.quest('Go to the big meeting at Town Hall', 'mayor');
        var caught = Object.keys(S.signs).filter(function (k) { return S.signs[k].result === 'caught'; }).length, signedBad = Object.keys(S.signs).filter(function (k) { return S.signs[k].result === 'signed'; }).length;
        await api.say('mayor', ['Order! Order! Thank you all for coming.', 'First: Pay-O-Matic 3000. People say their stubs are wrong. Does anyone have proof?']);
        await api.say('you', caught ? ['I do! Pay-O-Matic made a mistake on my stub. I caught it before I signed.', (S.clueFriend || 'My friend') + '’s stub was wrong too. Here are my notes.'] : signedBad ? ['I do. I signed a stub that paid me less. The bank noticed.', (S.clueFriend || 'My friend') + '’s stub was wrong too.'] : ['My stubs were okay. But ' + (S.clueFriend || 'my friend') + '’s was wrong.']);
        await api.say('mayor', ['Thank you! This is why we check before we sign.', 'Town council will make every shop check Pay-O-Matic. And every worker should check their stub.', 'Next: taxes. Some people want less tax. Some want more. Let’s hear from you.']);
        await dialPanel(api, S); api.give('Tax Opinion card');
        await api.say('mayor', 'A reason AND a trade-off! You’d make a great councillor. Meeting over!');
      }));
      a = a.concat(period(7), period(8));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and count your jar', 'table');
        var o = outcome(S.run), Wk = W(S);
        if (o.win) { api.place('goal', 'home', 6, 4, { draw: SIT[S.sit].goalIcon, label: Wk.goalLabel }); await api.say('you', ['The jar has ' + fmt(S.run.jar) + '!', 'That’s enough for ' + Wk.goalLabel + '. I did it!', 'Every bill is paid, too. I still have ' + fmt(S.run.bank) + ' in the bank.']); }
        else if (o.why === 'overdrawn') await api.say('you', ['The jar has ' + fmt(S.run.jar) + '. But my bank account is below zero (' + fmt(S.run.bank) + ').', 'Some bills didn’t get paid. So it doesn’t count yet.']);
        else await api.say('you', ['The jar has ' + fmt(S.run.jar) + '. I needed ' + fmtW(Wk.goal) + '.', 'I’m ' + fmt(Wk.goal - S.run.jar) + ' short.'].concat(S.run.jar + S.run.bank >= Wk.goal ? ['Wait. I had ' + fmt(S.run.bank) + ' just sitting in the bank. I could have put more in the jar!'] : []));
        var firstTime = !S.finished; S.finished = true; S.win = !!o.win;
        if (firstTime) api.profileAdd('closet', WORK[S.run.job].outfit); api.profileAdd('plan', { mission: '7-income-tax', title: 'First Paycheque', text: 'My take-home pay as a ' + J(S).title + ': ' + fmt(S.run.log[S.run.log.length - 1].stub.net) + ' from ' + fmt(S.run.log[S.run.log.length - 1].stub.gross) + ' gross.' });
        api.profileAdd('finished', '7-income-tax'); api.refresh();
        await api.say('okafor', [o.win ? 'You did it, ' + api.profile.name + '! Goal reached!' : 'So close, ' + api.profile.name + '! You learned a ton, though.', 'Oh, and guess what? Jas got a new job! And Pay-O-Matic got fixed, thanks to people like you.', 'Your My Plan wall at home has a new page.', 'Now do Step 4 of your project: pick your path.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }
  async function stampVisit(api, S, id) {
    var key = { jas: 'card-ei', grandpa: 'card-cpp', nurse: 'card-tax' }[id], q = Q(key, S);
    if (id === 'jas') await api.say('jas', ['Hey. So... the shoe store closed. I lost my job.', 'It was scary. But I’m okay for now.']);
    if (id === 'grandpa') await api.say('grandpa', ['Come in, come in! Did I ever tell you about my first paycheque?', 'Two dollars an hour! I felt so rich. I bought a milkshake every day.', 'Now I’m retired. I get to nap whenever I want.']);
    if (id === 'nurse') await api.say('nurse', ['Busy day! A kid fell off a skateboard and broke a wrist.', 'We fixed it right up. Cast and all.']);
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
      api.place('jobboard', 'jobcentre', 6, 2, { draw: 'cork', label: 'Job board' });
      api.place('table', 'home', 4, 3, { label: 'Kitchen table' });
      api.place('fridge', 'home', 1, 2, { label: 'The fridge' });
      api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true });
      if (S.letters && S.letters.length) api.place('letter', 'home', 6, 5, { draw: 'letter', solid: false, label: 'A letter' });
      if (S.finished && S.win) api.place('goal', 'home', 6, 4, { draw: SIT[S.sit].goalIcon, label: 'Your goal' });
    },
    people: function (S) {
      var out = {}, prof = T.api.profile, skin = prof && prof.look ? prof.look.skin : 's3';
      Object.keys(WORK).forEach(function (jk) { var w = WORK[jk]; out[bossId(jk)] = { name: w.boss, role: JOBS[jk].biz, map: w.b, x: 4, y: 3, dir: 'down', look: w.look }; });
      out.mom = { name: 'Mom', role: 'Family', map: 'home', x: 2, y: 4, dir: 'right', look: { base: 1, skin: skin, hair: 'brown', shirt: 'purple', pants: '#3b3f5c' }, hidden: S.sit === 'dev' || S.sit === 'rosa' };
      if (S.sit === 'dev') out.dev = { map: 'home', x: 2, y: 4, dir: 'right', role: 'Roommate' };
      if (S.sit === 'rosa') out.rosa = { map: 'home', x: 2, y: 4, dir: 'right', role: 'Housemate' };
      var pp = S.run ? S.run.p : 0;
      if (S.finished) out.jas = { map: 'town', x: 15, y: 23, dir: 'down', role: 'Just hired!' };
      else if (pp < 4) out.jas = { map: 'town', x: 44, y: 32, dir: 'right', role: 'Shoe store' };
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
      var j = S.run && S.run.job, p = S.run ? S.run.p : 0, app = p >= 4, done = S.finished, fr = function (yes, no) { return app ? yes : no; }, lines = {
        okafor: !S.run ? 'Hi there! Come talk to me when you’re ready.' : !j ? 'The job board is by the window!' : done ? 'Come back anytime. There’s always more to learn!' : 'You’re doing great. Your next goal is on the gold line at the top.',
        sam: !S.run || !p ? 'Welcome to the bank! Bring your paycheque here on payday.' : pun(S) + ' Your bank: ' + fmt(S.run.bank) + '. Your jar: ' + fmt(S.run.jar) + '.',
        jas: done ? 'Guess what? I got a new job! I start Monday.' : S.stamps.jas ? 'Thanks for listening. I send out résumés every day.' : app ? 'Hey... rough week. I’ll tell you about it sometime.' : 'Hi! I work at the shoe store. Best discount in town!',
        agent: 'Welcome to Service Canada. We help with EI, CPP and lots more.',
        grandpa: S.stamps.grandpa ? 'Every paycheque you get puts a little into your own pension. Someday you’ll nap too.' : 'Come visit more often! I have stories. So many stories.',
        nurse: 'Wear a helmet. I mean it.', mayor: done ? 'Pay-O-Matic is fixed. Democracy works! Slowly.' : 'Town Hall: where the town decides things. Slowly.',
        librarian: 'Free computers! Free books! Free air conditioning!',
        avery: fr('My stub was wrong AGAIN. Pay-O-Matic strikes again!', 'Hi! I’m saving up for concert tickets. Every shift counts!'),
        dev: fr('Pay-O-Matic says I worked zero hours on Tuesday. I was THERE.', 'Payday is the best day. Pizza day is second.'),
        rosa: fr('I check every stub now. Every. Single. Line.', 'A budget isn’t about no fun. It’s about choosing your fun.'),
        worker: 'Hard hats on! This site is busy.', mom: S.sit === 'avery' && S.run ? 'Dinner’s at six. Don’t be late!' : 'Hi, sweetie! Say hi to your friends for me.',
        fridge: S.run ? 'Bills on the fridge: ' + W(S).bills.map(function (b) { return b[1] + ' ' + fmtW(b[2]); }).join(', ') + '.' : 'Leftovers. Again.',
        table: 'The kitchen table. This is where you plan payday.', jobboard: j ? 'You already work at ' + JOBS[j].biz + '.' : 'Job postings. One of these could be yours!',
        myplan: api.profile.plan.length ? 'My Plan wall: ' + api.profile.plan.map(function (x) { return x.title + ': ' + x.text; }).join(' ') : 'My Plan wall. Finish a mission to pin a page here.',
        letter: S.letters.length ? S.letters.join(' ') : 'An old letter.', goal: 'You did it! ' + (S.run ? W(S).goalLabel : '') + '!'
      };
      if (/^boss_/.test(id)) { var bj = id.slice(5); return j === bj ? WORK[bj].idle : 'We’re busy today. Good luck out there!'; }
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
      if (S.clueFriend) it.push({ name: 'Pay-O-Matic notes', icon: '\ud83d\udd0d', note: 'Mistakes found', view: function () {
        var rows = Object.keys(S.signs).map(function (k) { var g = S.signs[k]; return '<li>Paycheque ' + k + ': ' + (g.result === 'caught' ? 'mistake caught before signing \u2713' : g.result === 'signed' ? 'signed a stub that paid ' + fmt(g.short) + ' less' : 'checked, no mistake') + '</li>'; }).join('');
        return '<ul>' + rows + '<li>' + esc(S.clueFriend) + '\u2019s stub: 36 hours instead of 40</li></ul><p class="ct-small">Every shop in town uses Pay-O-Matic 3000.</p>'; } });
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
