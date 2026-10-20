/* CEFL Town mission: Grade 9 Income and Tax — "Tax Clinic" (companion to the project Tax Clinic). LO 9-IT.
   Four chapters, one after each project step: The T4 and the tax return · Credits and deductions · RRSP or TFSA? · Gigs, tips and
   self-employment. You volunteer at the town's free Tax Clinic and do the brief's client case (Priya) step by step.
   Model (MODEL START … END, no DOM): the workbook's simplified 2026 method: federal tax = 14% × taxable income − $2,303.28 − tuition
   credit (14% × tuition), not below $0; Alberta tax = 8% × taxable income − $1,821.52, not below $0 (no Alberta tuition credit since
   2020); an RRSP deduction lowers taxable income; self-employed CPP = 11.9% of earnings above $3,500 (or of all gig earnings when a
   job already used the exemption); refund = tax already paid (T4 box 22) − tax and CPP owed. TFSA limit $7,000; RRSP limit 18% of
   last year's earned income, up to $33,810. Goal: Tax Clinic Night: every client leaves with an answer (at least 3 of 4 first-try).
   The Report It? game (kit sortRush) counts sorted income; it never changes the goal.
   Side story, "The instant refund": Mo gets a text: "CRA: pay $1,200 in gift cards today or be arrested" (Ch 1; his T4 shows a
   refund, and the CRA never asks for gift cards) → QuickRefund filed Jas's return for a fee and skipped the tuition credit (Ch 2) →
   its owner, Mr. Lark, sells a "Tax-Free Super Account" that isn't a TFSA (Ch 3) → at Tax Clinic Night the town files for free,
   Jas re-files and gets the credit, and the clinic's free-filing night is named after you (Ch 4).
   Between lessons (HELP START … HELP END): townspeople's own tax questions, an extra Report It? round, and Town Mail.
   Simplifications (the workbook's): CPP and EI credits and other details are left out; non-refundable credits stop at $0. */
(function () {
  'use strict';

/* MODEL START ── no DOM. Money in cents. ── */
var FED_RATE = 0.14, AB_RATE = 0.08, FED_CREDIT = 230328, AB_CREDIT = 182152, TUITION_RATE = 0.14, CPP_SE = 0.119, CPP_EXEMPT = 350000, TFSA_LIMIT = 700000, RRSP_PCT = 0.18, RRSP_MAX = 3381000;
function fedTax(taxable, tuition) { return Math.max(0, Math.round(taxable * FED_RATE) - FED_CREDIT - Math.round((tuition || 0) * TUITION_RATE)); }
function abTax(taxable) { return Math.max(0, Math.round(taxable * AB_RATE) - AB_CREDIT); }
function incomeTax(taxable, tuition) { return fedTax(taxable, tuition) + abTax(taxable); }
function cppSE(gig, exemptionUsed) { return Math.round(Math.max(0, gig - (exemptionUsed ? 0 : CPP_EXEMPT)) * CPP_SE); }
function rrspLimit(lastYear) { return Math.min(RRSP_MAX, Math.round(lastYear * RRSP_PCT)); }
var PRIYA = { t4: 1800000, box22: 70000, tips: 150000, gig: 250000, tuition: 400000, save: 150000 }; // the brief's client (2026, sample)
function priyaIncome() { return PRIYA.t4 + PRIYA.tips + PRIYA.gig; }
function priyaReturn(rrsp) { var taxable = priyaIncome() - (rrsp || 0), f = fedTax(taxable, PRIYA.tuition), a = abTax(taxable), cpp = cppSE(PRIYA.gig, true); return { taxable: taxable, fed: f, ab: a, tax: f + a, cpp: cpp, owed: f + a + cpp, refund: PRIYA.box22 - (f + a + cpp) }; }
var JAMIE = { t4: 2400000, box22: 140000 }, RILEY = { t4: 1500000, box22: 30000 }, MO = { t4: 4200000, box22: 620000 }, JAS = { t4: 2600000, box22: 180000, tuition: 300000, fee: 9900 };
function refundOf(t4, box22, tuition) { return box22 - incomeTax(t4, tuition); }
var DEDCRED = [['Tuition', 'credit', 'It takes a set amount off your tax.'], ['An RRSP contribution', 'deduction', 'It lowers the income that gets taxed.'], ['The basic personal amount', 'credit', 'It takes a set amount off your tax.'], ['Union dues', 'deduction', 'They lower the income that gets taxed.'], ['Charitable donations', 'credit', 'They take an amount off your tax.'], ['Child care expenses', 'deduction', 'They lower the income that gets taxed.']];
var ACCOUNTS = [['Withdrawals are tax-free', 'tfsa'], ['Contributions lower your taxable income', 'rrsp'], ['The 2026 yearly limit is $7,000', 'tfsa'], ['Taxed when you take the money out', 'rrsp'], ['Good for a goal 3 years away, like a car', 'tfsa'], ['Limit: 18% of last year’s earned income, up to $33,810', 'rrsp'], ['Saves more tax when your income is high', 'rrsp'], ['Can hold investments, not just cash', 'both']];
var REPORT = [['Cash tips from a restaurant job', 'yes'], ['Food-delivery gig earnings', 'yes'], ['Babysitting money', 'yes'], ['Freelance design work', 'yes'], ['Pay from a job (on a T4)', 'yes'], ['Interest from a savings account', 'yes'], ['EI benefits', 'yes'], ['Selling crafts you make as a business', 'yes'],
  ['A birthday gift from Grandma', 'no'], ['A lottery win', 'no'], ['A loan from the bank', 'no'], ['A GST/HST credit payment', 'no']];
var POINTS_TO_WIN = 3;
var GAME_CFGS = {
  report: { kind: 'sortRush', cfg: { id: 'report', name: 'Report It?', scoreWord: 'Sorted', win: [6500, 4800], think: 1300, th: [[15, 6], [15, 6]],
    how: '<p><b>Report It?</b> Clients drop money slips in the clinic tray. Must each one be <b>reported</b> as income on a tax return, or is it <b>not income</b>?</p><p class="ct-small">A wrong pick costs 2 points. So does a slip that waits too long.</p>',
    bins: [{ id: 'yes', label: 'Report it', icon: '📝' }, { id: 'no', label: 'Not income', icon: '🚫' }],
    items: REPORT.map(function (x) { return { t: x[0], bin: x[1], icon: x[1] === 'yes' ? '💵' : '🎁', why: x[1] === 'yes' ? 'All income is reportable, including tips, gigs and self-employment.' : 'Gifts, lottery wins, loans and the GST credit are not income in Canada.' }; }) } }
};
/* MODEL END */

/* HELP START ── between lessons, on fresh seeds. No DOM. ── */
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function pickN(r, a, n) { var b = a.slice(), out = []; while (out.length < n && b.length) out.push(b.splice(Math.floor(r() * b.length), 1)[0]); return out; }
function t4Task(seed) { var r = RNG(seed * 13 + 1); r(); var t4 = (20 + Math.floor(r() * 35)) * 100000, tax = incomeTax(t4), box22 = Math.round(tax * (0.7 + r() * 0.6) / 1000) * 1000; return { t4: t4, box22: box22, fed: fedTax(t4), ab: abTax(t4), tax: tax, refund: box22 - tax }; }
function rrspTask(seed) { var r = RNG(seed * 17 + 3); r(); var inc = (28 + Math.floor(r() * 30)) * 100000, amt = (5 + Math.floor(r() * 16)) * 10000; return { inc: inc, amt: amt, saved: incomeTax(inc) - incomeTax(inc - amt) }; }
function limitTask(seed) { var r = RNG(seed * 19 + 5); r(); var last = (30 + Math.floor(r() * 180)) * 100000; return { last: last, limit: rrspLimit(last) }; }
function cppTask(seed) { var r = RNG(seed * 23 + 7); r(); var gig = (5 + Math.floor(r() * 26)) * 50000, used = r() < 0.4; return { gig: gig, used: used, cpp: cppSE(gig, used) }; }
function reportTask(seed) { var r = RNG(seed * 29 + 11); r(); return pickN(r, pickN(r, REPORT.filter(function (x) { return x[1] === 'yes'; }), 2).concat(pickN(r, REPORT.filter(function (x) { return x[1] === 'no'; }), 2)), 4); }
var WHO_QS = [
  { id: 'student', label: 'RRSP or TFSA: a student', text: 'I’m 19, earn $16,000, and might need my savings for school next year. RRSP or TFSA?', opts: [['A TFSA: a low income means little tax to save now, and I can take it out tax-free anytime.', 1, 'TFSA it is.'], ['An RRSP: it always saves the most.', 0, 'At $16,000, an RRSP saves little or nothing this year.'], ['Neither. Keep it under the bed.', 0, 'Both accounts beat a mattress.']] },
  { id: 'high', label: 'RRSP or TFSA: a high earner', text: 'I earn $110,000 and I’m saving for retirement. RRSP or TFSA?', opts: [['An RRSP: at a high income, the deduction saves a lot of tax now.', 1, 'Good point. Higher bracket, bigger saving.'], ['A TFSA: RRSPs never help.', 0, 'At a high income, RRSPs help a lot.'], ['Only a plain bank account.', 0, 'Registered accounts give tax advantages.']] },
  { id: 'refund', label: 'What a refund is', text: 'Isn’t a tax refund a bonus from the government?', opts: [['No. It’s your own money, coming back because too much was taken off your pay.', 1, 'Oh. It was mine all along.'], ['Yes, a reward for filing early.', 0, 'It’s your own over-withheld money.'], ['Yes, everyone gets the same amount.', 0, 'It depends on what was withheld and what you owe.']] },
  { id: 'file', label: 'Why file with low income', text: 'I earn very little. Why should I file a tax return at all?', opts: [['Benefits like the GST/HST credit are paid through the tax system. You only get them if you file.', 1, 'Free money I was missing!'], ['You shouldn’t bother.', 0, 'Not filing can mean missing benefits and refunds.'], ['Only rich people file.', 0, 'Everyone with income should.']] },
  { id: 'gift', label: 'The CRA and gift cards', text: 'A text says the CRA wants me to pay a tax debt with gift cards today. What should I do?', opts: [['Ignore it and don’t pay. The CRA never asks for gift cards. Check your account on the real CRA site or call the CRA.', 1, 'Deleted.'], ['Pay fast so I don’t get arrested.', 0, 'That’s exactly what scammers want.'], ['Reply with your SIN to check.', 0, 'Never send personal information to a text.']] }
];
function mailKind(seed, last) { var k = ['t4']; if (last >= 1) k.push('rrsp'); if (last >= 2) k.push('limit'); if (last >= 3) k.push('cpp', 'report'); var r = RNG(seed * 7 + 3); r(); return k[Math.floor(r() * k.length)]; }
/* HELP END */

  var T = window.CEFLTown, K = T.kit, esc = T.esc;
  var fmt = K.fmt, fmtW = K.fmtW, step = K.step;
  var REP = T.gameKit.sortRush(GAME_CFGS.report.cfg), REP_PAY = 800;
  var TAX_CARD = '<p><b>Simplified 2026 method</b> (from the workbook)</p><ul class="ck-notes"><li>Federal tax = 14% × taxable income − $2,303.28 − tuition credit (14% × tuition). Not below $0.</li><li>Alberta tax = 8% × taxable income − $1,821.52. Not below $0. (No Alberta tuition credit since 2020.)</li><li>An RRSP contribution is a deduction: it lowers taxable income.</li><li>Self-employed CPP: 11.9% of earnings above $3,500.</li><li>Refund = tax already paid (box 22) − what you owe.</li></ul>';
  function priyaHTML() { return '<div class="ct-doc"><div class="ct-doc-h"><b>Priya, 20, college student</b><span>2026 tax year (sample)</span></div>' + K.doc(null, [['T4 box 14: employment income', 'a café', fmt(PRIYA.t4), ''], ['T4 box 22: income tax deducted', '', fmt(PRIYA.box22), ''], ['Cash tips', 'not on the T4', fmt(PRIYA.tips), ''], ['Food-delivery gig (self-employed)', 'after expenses', fmt(PRIYA.gig), ''], ['Tuition (T2202)', '', fmt(PRIYA.tuition), '']]).replace('<div class="ct-doc">', '<div>') + '<p class="ct-small">Priya wants to save $1,500 this year: RRSP or TFSA?</p></div>'; }
  function t4HTML(name, t4, box22) { return '<div class="ct-doc"><div class="ct-doc-h"><b>T4: Statement of Remuneration Paid</b><span>' + esc(name) + ' · 2026</span></div>' + K.doc(null, [['Box 14: employment income', '', fmt(t4), ''], ['Box 22: income tax deducted', '', fmt(box22), '']]).replace('<div class="ct-doc">', '<div>') + '</div>'; }
  function repOpts(api, seed, help) {
    return { title: 'Report It?' + (help ? ': an extra tray' : ''), name: 'minigame', game: REP, seed: seed, seconds: 60, leave: !!help, skipNote: 'Skipping is okay.',
      tierText: help ? K.payTiers(REP_PAY) : { great: 'Every slip in the right pile. Ms. Fournier is impressed.', ok: 'Good sorting.', poor: 'Remember: all income is reportable, even cash and gigs.' } };
  }
  async function repRound(api, S, key, n) {
    if (!S.reports[key]) { var r = await api.minigame(repOpts(api, S.seed * 89 + n, false)); S.reports[key] = { tier: r.tier, score: r.score }; api.save(); api.hud(); }
    var t = S.reports[key].tier;
    await api.say('fournier', t === 'great' ? 'You sort faster than our longest-serving volunteer. Don’t tell him.' : t === 'ok' ? 'Nicely done.' : t === 'skip' ? 'Another time!' : 'All income is reportable. Even the cash kind.');
  }

  function init() { return { v: 1, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), ans: {}, typed: {}, story: {}, reports: {}, priya: {}, night: null, scene: null, finished: false }; }
  function validate(S) { return !!S && S.v === 1 && !!S.typed && !!S.story && !!S.reports && !!S.priya; }

  var HELPS = [
    { id: 'it9-t4', who: 'rosa', after: 0, pay: 1000, label: 'A refund from a T4', ask: 'I got my T4. Will I get a refund? Can you work it out?', run: async function (api, seed) {
      var t = t4Task(seed); var g = await api.calc({ title: 'Help Rosa: refund or balance owing?', name: 'help-t4', ref: TAX_CARD, refLabel: 'Show the tax method', intro: t4HTML('Rosa', t.t4, t.box22), fields: [{ k: 'f', name: 'Federal tax', ans: t.fed, hint: '0.14 × ' + fmtW(t.t4) + ' − $2,303.28.' }, { k: 'a', name: 'Alberta tax', ans: t.ab, hint: '0.08 × ' + fmtW(t.t4) + ' − $1,821.52.' }, { k: 'r', name: 'Refund (or balance owing, with a minus)', ans: t.refund, hint: 'Box 22 − (federal + Alberta).', net: 1 }] });
      if (g) await api.say('rosa', t.refund >= 0 ? 'A refund! My own money, coming home.' : 'I owe a little. Better to know now.'); return g; } },
    { id: 'it9-q', who: 'grandpa', after: 0, pay: 500, label: 'Tax questions', ask: 'Help an old man with a tax question?', run: async function (api, seed) { return K.askGrade(await api.ask('grandpa', WHO_QS[2 + seed % 3], null)); } },
    { id: 'it9-rrsp', who: 'dev', after: 1, pay: 1000, label: 'What an RRSP saves', ask: 'If I put money in an RRSP, how much tax do I save?', run: async function (api, seed) {
      var t = rrspTask(seed); var g = await api.calc({ title: 'Help Dev: an RRSP deduction', name: 'help-rrsp', ref: TAX_CARD, refLabel: 'Show the tax method', intro: '<p>Dev earns <b>' + fmtW(t.inc) + '</b> and puts <b>' + fmtW(t.amt) + '</b> in an RRSP.</p>', fields: [{ k: 's', name: 'Tax saved (federal + Alberta)', ans: t.saved, hint: '14% + 8% of ' + fmtW(t.amt) + ', if both taxes stay above $0.' }] });
      if (g) await api.say('dev', '22 cents on every dollar. Not bad.'); return g; } },
    { id: 'it9-dc', who: 'jas', after: 1, pay: 800, label: 'Deduction or credit', ask: 'Deductions and credits confuse me. Can you sort these?', run: async function (api, seed) {
      var r = RNG(seed * 31 + 9); r(); var t = pickN(r, DEDCRED, 4); var g = await K.sort(api, { title: 'Help Jas: deduction or credit?', name: 'help-sort', leave: true, intro: 'A <b>deduction</b> lowers the income that gets taxed. A <b>credit</b> lowers the tax itself.', bins: [{ id: 'deduction', label: 'Deduction', icon: '➖' }, { id: 'credit', label: 'Credit', icon: '🎟️' }], items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      if (g) await api.say('jas', 'Deduction: smaller income. Credit: smaller tax. Got it.'); return g; } },
    { id: 'it9-limit', who: 'sam', after: 2, pay: 800, label: 'RRSP limit', ask: 'A customer wants to know their RRSP limit. Can you work it out?', run: async function (api, seed) {
      var t = limitTask(seed); var g = await api.calc({ title: 'Help Sam: an RRSP limit', name: 'help-limit', intro: '<p>The customer earned <b>' + fmtW(t.last) + '</b> last year. The limit is 18% of that, up to $33,810 (2026).</p>', fields: [{ k: 'l', name: 'RRSP limit this year', ans: t.limit, hint: '0.18 × ' + fmtW(t.last) + ', but not more than $33,810.' }] });
      if (g) await api.say('sam', 'And the TFSA limit is $7,000 this year. Two accounts, two limits.'); return g; } },
    { id: 'it9-which', who: 'librarian', after: 2, pay: 500, label: 'RRSP or TFSA', ask: 'Two patrons asked me about savings accounts. Can you help?', run: async function (api, seed) { return K.askGrade(await api.ask('librarian', WHO_QS[seed % 2], null)); } },
    { id: 'it9-cpp', who: 'worker', after: 3, pay: 800, label: 'Self-employed CPP', ask: 'I do side jobs on weekends. How much CPP do I owe on them?', run: async function (api, seed) {
      var t = cppTask(seed); var g = await api.calc({ title: 'Help Mo: self-employed CPP', name: 'help-cpp', intro: '<p>Mo earned <b>' + fmtW(t.gig) + '</b> from weekend side jobs. ' + (t.used ? 'His main job already used the $3,500 exemption, so he pays 11.9% on all of it.' : 'This is his only work, so the first $3,500 is exempt.') + '</p>', fields: [{ k: 'c', name: 'CPP owed', ans: t.cpp, hint: t.used ? '0.119 × ' + fmtW(t.gig) + '.' : '0.119 × (' + fmtW(t.gig) + ' − $3,500).' }] });
      if (g) await api.say('worker', 'I’m setting that aside now. No surprise in April.'); return g; } },
    { id: 'it9-report', who: 'avery', after: 3, pay: 600, label: 'Report it or not?', ask: 'Which of these do I have to report on my taxes?', run: async function (api, seed) {
      var t = reportTask(seed); var g = await K.sort(api, { title: 'Help Avery: report it?', name: 'help-sort', leave: true, intro: 'All income must be reported, including tips and gigs. Some money isn’t income at all.', bins: GAME_CFGS.report.cfg.bins, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      if (g) await api.say('avery', 'So my tips go on the return. Okay. Honest Avery.'); return g; } },
    { id: 'it9-game', who: 'agent', after: 1, pay: REP_PAY, label: 'An extra Report It? tray', game: true, ask: 'Our tray is overflowing. Want to sort some slips?', run: async function (api, seed) {
      var r = await api.minigame(repOpts(api, seed, true)); return K.gameGrade(r); } }
  ];
  var GOSSIP = [
    { id: 'g-gp-0', who: 'grandpa', after: -1, lines: ['I got a call last year: “This is the tax office. Pay now or else.”', 'I hung up. The real tax office sends letters. And it never wants gift cards.'] },
    { id: 'g-sam-0', who: 'sam', after: -1, lines: ['People ask me to cash their “instant refund” cheques from QuickRefund.', 'The cheques are always smaller than they should be.'] },
    { id: 'g-avery-0', who: 'avery', after: -1, lines: ['I made $900 in tips last summer.', 'Someone told me cash is “invisible” to taxes. Is that true?'] },
    { id: 'g-jas-1', who: 'jas', after: 0, lines: ['QuickRefund did my taxes in five minutes! I got my refund on the spot.', 'Well, most of it. They kept a fee.'] },
    { id: 'g-lark-1', who: 'lark', after: 0, lines: ['QuickRefund! Your refund, today! Why wait?', 'The fee? Small. Very small. Medium, at most.'] },
    { id: 'g-fournier-2', who: 'fournier', after: 1, lines: ['Free tax clinics file for free. That’s the whole point.', 'We also look for credits people miss. Like tuition.'] },
    { id: 'g-dev-2', who: 'dev', after: 1, lines: ['I opened a TFSA at the bank. Real one.', 'Mr. Lark tried to sell me a “Tax-Free SUPER Account.” Super what?'] },
    { id: 'g-mayor-3', who: 'mayor', after: 2, lines: ['People keep asking if Mr. Lark’s “Super Account” is a real TFSA.', 'A real TFSA is opened at a bank or another financial institution, with your SIN, and a yearly limit.'] },
    { id: 'g-nurse-3', who: 'nurse', after: 2, lines: ['I put money in my RRSP every year.', 'At my income, it saves me a lot of tax now. Retirement me says thanks.'] },
    { id: 'g-jas-4', who: 'jas', after: 3, lines: ['I re-filed at the clinic. Free! And I got my tuition credit.', 'That’s $420 more, and no $99 fee.'] },
    { id: 'g-fournier-4', who: 'fournier', after: 3, lines: ['The {name} Free File Night is on the town calendar every March now.', 'Last year we filed 140 returns. Free.'] },
    { id: 'g-avery-4', who: 'avery', after: 3, lines: ['I reported my tips. All of them.', 'And I still got a refund! Because of the basic personal amount!'] }
  ];
  function gossip(S, api) { return K.gossip(GOSSIP, api); }
  function mailTask(seed, last) {
    var k = mailKind(seed, last), from = 'Ms. Fournier';
    if (k === 't4') { var t = t4Task(seed); return { label: 'Town Mail: refund or owing', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', ref: TAX_CARD, refLabel: 'Show the tax method', intro: '<p class="ct-small">A letter from Ms. Fournier:</p>' + t4HTML('A client', t.t4, t.box22), fields: [{ k: 'r', name: 'Refund (or balance owing, with a minus)', ans: t.refund, hint: 'Box 22 − (federal + Alberta tax).' }] }); } }; }
    if (k === 'rrsp') { var r = rrspTask(seed); return { label: 'Town Mail: an RRSP saving', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Ms. Fournier:</p><p>“Income ' + fmtW(r.inc) + ', RRSP ' + fmtW(r.amt) + '. Tax saved?”</p>', fields: [{ k: 's', name: 'Tax saved', ans: r.saved, hint: '22% of the RRSP amount.' }] }); } }; }
    if (k === 'limit') { var l = limitTask(seed); return { label: 'Town Mail: an RRSP limit', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Ms. Fournier:</p><p>“Earned ' + fmtW(l.last) + ' last year. RRSP limit?”</p>', fields: [{ k: 'l', name: 'RRSP limit', ans: l.limit, hint: '18%, up to $33,810.' }] }); } }; }
    if (k === 'cpp') { var c = cppTask(seed); return { label: 'Town Mail: self-employed CPP', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Ms. Fournier:</p><p>“' + fmtW(c.gig) + ' of self-employment income' + (c.used ? ', exemption already used' : ', no other job') + '. CPP?”</p>', fields: [{ k: 'c', name: 'CPP owed', ans: c.cpp, hint: c.used ? '0.119 × all of it.' : '0.119 × (income − $3,500).' }] }); } }; }
    var rp = reportTask(seed);
    return { label: 'Town Mail: report it?', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, intro: 'A letter from Ms. Fournier: “Report it, or not income?”', bins: GAME_CFGS.report.cfg.bins, items: rp.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) }); } };
  }

  function chapterSteps(ch, S, api) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the Tax Clinic on Market Lane and meet Ms. Fournier', 'fournier');
        await api.say('fournier', ['Welcome! I’m Ms. Fournier. Every spring, our volunteers file taxes for free.', 'Some people miss refunds and benefits because they never file. That’s what we fix.']);
        var i = await api.choose('fournier', 'Quick question: where does a tax refund come from?', ['A bonus from the government', 'Your own money, coming back', 'No idea yet']);
        S.typed.entry = ['A bonus from the government', 'Your own money, coming back', 'No idea yet'][i];
      }));
      a.push(step('hunch', async function (api, S) { // the side story starts, before the skill
        await api.quest('Mo runs into the Tax Clinic, holding his phone', 'worker');
        S.story.moIn = 1; api.refresh();
        await api.say('worker', ['Look at this text! “CRA: you owe $1,200. Pay with gift cards TODAY or be arrested.”', 'I have my T4 right here. Do I really owe them?']);
        await api.say('you', ['I don’t know how to read a T4 yet. Ms. Fournier is about to teach me.', 'Don’t buy any gift cards. Please.']);
        S.story.mo1 = 1; api.give('Clinic notes', '🔍', 'worker'); api.refresh();
      }));
      a.push(step('jamie', async function (api, S) {
        await api.quest('Learn to read a T4 with Ms. Fournier', 'fournier');
        await api.say('fournier', ['A T4 sums up a year of pay. Box 14 is your employment income. Box 22 is the income tax already taken off.', 'The return works out the tax you really owed, and compares it with box 22.']);
        var g = await api.calc({ title: 'Jamie’s return', name: 'jamie', noPay: true, ref: TAX_CARD, refLabel: 'Show the tax method', intro: t4HTML('Jamie, 19', JAMIE.t4, JAMIE.box22),
          fields: [{ k: 'f', name: 'Federal tax', ans: fedTax(JAMIE.t4), hint: '0.14 × $24,000 − $2,303.28.' }, { k: 'a', name: 'Alberta tax', ans: abTax(JAMIE.t4), hint: '0.08 × $24,000 − $1,821.52.' }, { k: 'r', name: 'Refund', ans: refundOf(JAMIE.t4, JAMIE.box22), hint: '$1,400 − (federal + Alberta).', net: 1 }] });
        api.record('q-jamie', 'Jamie’s return: federal, Alberta, refund', 0, g === 'first');
        await api.ask('fournier', WHO_QS[2], 'q-refund', 'What a refund really is', 0);
      }));
      a.push(step('mot4', async function (api, S) { // the hunch, checked with this chapter's skill
        await api.quest('Now check Mo’s T4', 'worker');
        var g = await api.calc({ title: 'Mo’s T4', name: 'mot4', noPay: true, ref: TAX_CARD, refLabel: 'Show the tax method', intro: t4HTML('Mo', MO.t4, MO.box22), fields: [{ k: 'r', name: 'Mo’s refund (or balance owing, with a minus)', ans: refundOf(MO.t4, MO.box22), hint: 'Box 22 − (0.14 × $42,000 − $2,303.28 + 0.08 × $42,000 − $1,821.52).' }] });
        api.record('story-mo', 'Mo’s T4: refund, not a debt', 0, g === 'first');
        await api.say('you', ['Mo, you don’t owe anything. You’re getting ' + fmt(refundOf(MO.t4, MO.box22)) + ' BACK.', 'That text is a scam.']);
        await api.ask('fournier', WHO_QS[4], 'q-scam', 'The CRA and gift cards', 0);
        await api.say('worker', 'Deleting it. And blocking the number. Thank you!');
        S.story.mo2 = 1; api.save();
      }));
      a.push(step('end1', async function (api, S) {
        await api.quest('Check in with Ms. Fournier', 'fournier');
        await api.say('fournier', ['Good catch on Mo’s text. Those scams spike every spring.', 'Now do Step 1 of your project: read your client’s T4 and list all their income.', 'Next time: credits and deductions.']);
      }));
    }
    if (ch === 1) {
      a.push(step('dc', async function (api, S) {
        await api.quest('Ms. Fournier wants to teach credits and deductions', 'fournier');
        await api.say('fournier', ['Jamie pays $3,000 tuition and puts $1,000 in an RRSP. Both lower tax, in different ways.', 'A deduction lowers the income that gets taxed. A credit lowers the tax itself.']);
        await K.sort(api, { title: 'Deduction or credit?', name: 'dedcred', story: true, key: 'q-dedcred', label: 'Deduction or credit', ch: 1, intro: 'Sort each one.', bins: [{ id: 'deduction', label: 'Deduction', icon: '➖' }, { id: 'credit', label: 'Credit', icon: '🎟️' }], items: DEDCRED.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
        var g = await api.calc({ title: 'Jamie’s RRSP and tuition', name: 'jamie2', noPay: true, ref: TAX_CARD, refLabel: 'Show the tax method', intro: '<p>Jamie earns <b>$24,000</b>, puts <b>$1,000</b> in an RRSP, and pays <b>$3,000</b> tuition.</p>',
          fields: [{ k: 's', name: 'Tax saved by the $1,000 RRSP (federal + Alberta)', ans: incomeTax(JAMIE.t4) - incomeTax(JAMIE.t4 - 100000), hint: '14% + 8% of $1,000.' }, { k: 'c', name: 'Federal tuition credit', ans: Math.round(300000 * TUITION_RATE), hint: '14% × $3,000.' }] });
        api.record('q-jamie2', 'An RRSP deduction and a tuition credit', 1, g === 'first');
      }));
      a.push(step('priya1', async function (api, S) {
        await api.quest('Your client case: Priya. Open her file at the Tax Clinic.', 'priyafile');
        await K.sort(api, { title: 'Priya’s income: must she report it?', name: 'priyaincome', story: true, key: 'q-priyaincome', label: 'Priya’s income: what must be reported', ch: 1, ref: priyaHTML(), refLabel: 'Show Priya’s papers', intro: 'Sort each of Priya’s papers.',
          bins: [{ id: 'yes', label: 'Report it', icon: '📝' }, { id: 'no', label: 'Not income', icon: '🚫' }], items: [['T4 employment income, $18,000', 'yes'], ['Cash tips, $1,500 (not on the T4)', 'yes'], ['Food-delivery gig, $2,500', 'yes'], ['A $100 birthday gift from her aunt', 'no']].map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[1] === 'yes' ? 'All income is reportable, even cash and gigs.' : 'A gift isn’t income.' }; }) });
        var R = priyaReturn(0);
        var g = await api.calc({ title: 'Priya’s tax', name: 'priyatax', noPay: true, ref: TAX_CARD + priyaHTML(), refLabel: 'Show the method and Priya’s papers', intro: '<p>Total income first, then tax. No deductions yet.</p>',
          fields: [{ k: 'i', name: 'Total income', ans: priyaIncome(), hint: '$18,000 + $1,500 + $2,500.' }, { k: 'f', name: 'Federal tax', sub: '14% × income − $2,303.28 − 14% × $4,000 tuition', ans: R.fed, hint: '0.14 × $22,000 − $2,303.28 − $560.' }, { k: 'a', name: 'Alberta tax', sub: 'not below $0', ans: R.ab, hint: '0.08 × $22,000 − $1,821.52 is below $0, so…' }, { k: 't', name: 'Total income tax', ans: R.tax, hint: 'Federal + Alberta.', net: 1 }] });
        api.record('q-priyatax', 'Priya’s income and tax', 1, g === 'first'); S.priya.tax = 1; api.save();
      }));
      a.push(step('jas2', async function (api, S) { // clue: QuickRefund kept a fee and skipped the credit
        await api.quest('Jas wants to show you a QuickRefund receipt', 'jas');
        await api.say('jas', ['I worked full-time last year, before school. QuickRefund did my return in five minutes. Look, a cheque! They kept a $99 fee.', 'I’m a student. I paid $3,000 tuition. Does that matter?']);
        var r0 = refundOf(JAS.t4, JAS.box22, 0), r1 = refundOf(JAS.t4, JAS.box22, JAS.tuition);
        var g = await api.calc({ title: 'Jas’s return, done right', name: 'jascalc', noPay: true, ref: TAX_CARD, refLabel: 'Show the tax method', intro: t4HTML('Jas', JAS.t4, JAS.box22) + '<p>Tuition paid: <b>$3,000</b>. QuickRefund’s fee: <b>$99</b>.</p>',
          fields: [{ k: 'n', name: 'Refund without the tuition credit (what QuickRefund filed)', ans: r0, hint: 'Box 22 − (federal + Alberta), no tuition.' }, { k: 'y', name: 'Refund with the tuition credit', ans: r1, hint: 'Federal tax also subtracts 14% × $3,000, but stops at $0.' }] });
        api.record('story-jas', 'Jas’s return: the missed tuition credit', 1, g === 'first');
        await api.say('you', ['QuickRefund skipped your tuition credit and kept $99. Filed right, your refund is ' + fmt(r1) + ', not ' + fmt(r0 - JAS.fee) + '.', 'The clinic here files for free.']);
        S.story.jas = 1; S.story.larkOut = 1; api.toast('Added to your Clinic notes: QuickRefund'); api.save(); api.refresh();
      }));
      a.push(step('end2', async function (api, S) {
        await api.quest('Tell Ms. Fournier about QuickRefund', 'fournier');
        await api.say('fournier', ['Instant refunds, big fees, missed credits. I’ve seen it before.', 'Now do Step 2 of your project: your client’s credits and deductions.', 'Next time: RRSP or TFSA?']);
      }));
    }
    if (ch === 2) {
      a.push(step('accounts', async function (api, S) {
        await api.quest('Ms. Fournier wants to compare RRSPs and TFSAs', 'fournier');
        await api.say('fournier', ['Two registered accounts get special tax treatment. RRSP: contributions lower your taxable income, and you pay tax when you take it out.', 'TFSA: no tax saving now, but growth and withdrawals are tax-free. In 2026: $7,000 a year for a TFSA, and 18% of last year’s earned income for an RRSP, up to $33,810.']);
        await K.sort(api, { title: 'RRSP or TFSA?', name: 'accounts', story: true, key: 'q-accounts', label: 'RRSP or TFSA features', ch: 2, wide: true, intro: 'Which account is each one about?', bins: [{ id: 'rrsp', label: 'RRSP', icon: '🧓' }, { id: 'tfsa', label: 'TFSA', icon: '🆓' }, { id: 'both', label: 'Both', icon: '🤝' }], items: ACCOUNTS.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
        var g = await api.calc({ title: 'An RRSP limit', name: 'limit', noPay: true, intro: '<p>Sam earned <b>$50,000</b> last year.</p>', fields: [{ k: 'l', name: 'Sam’s RRSP limit this year', ans: rrspLimit(5000000), hint: '0.18 × $50,000.' }] });
        api.record('q-limit', 'An RRSP limit (18%)', 2, g === 'first');
      }));
      a.push(step('priya2', async function (api, S) {
        await api.quest('Back to Priya’s file: RRSP or TFSA?', 'priyafile');
        var A = priyaReturn(0), B = priyaReturn(PRIYA.save);
        var g = await api.calc({ title: 'Priya with a $1,500 RRSP', name: 'priyarrsp', noPay: true, ref: TAX_CARD + priyaHTML(), refLabel: 'Show the method and Priya’s papers', intro: '<p>If Priya puts <b>$1,500</b> in an RRSP, her taxable income drops by $1,500.</p>',
          fields: [{ k: 'x', name: 'Taxable income with the RRSP', ans: B.taxable, hint: '$22,000 − $1,500.' }, { k: 'f', name: 'Federal tax with the RRSP', ans: B.fed, hint: '0.14 × $20,500 − $2,303.28 − $560.' }, { k: 's', name: 'Tax saved by the RRSP', ans: A.tax - B.tax, hint: 'Tax without − tax with. (Alberta tax was already $0.)', net: 1 }] });
        api.record('q-priyarrsp', 'Priya: what an RRSP would save', 2, g === 'first');
        await K.pick(api, { id: 'advice', title: 'Our advice for Priya', name: 'pickadvice', intro: 'The RRSP saves Priya ' + fmt(A.tax - B.tax) + ' this year. A TFSA saves nothing now, but she can take it out tax-free anytime.', options: [{ k: 'rrsp', title: 'RRSP', icon: '🧓', lines: [['Saves now', fmt(A.tax - B.tax)], ['Later', 'Taxed when she takes it out']] }, { k: 'tfsa', title: 'TFSA', icon: '🆓', lines: [['Saves now', '$0'], ['Later', 'Tax-free; take it out anytime']] }],
          reasonPrompt: 'Why? Think about her tax rate now, later, and when she might need the money.' });
      }));
      a.push(step('super', async function (api, S) { // the source: Mr. Lark's "Super Account"
        await api.quest('Mr. Lark runs QuickRefund out of the Quick Cash shop. He’s selling a new account. Take a look.', 'lark');
        await api.say('lark', ['QuickRefund presents: the Tax-Free SUPER Account! Better than a TFSA! Ask me how!']);
        await K.inspect(api, { title: 'The Tax-Free SUPER Account', name: 'super', story: true, key: 'story-super', label: 'The Super Account: what is wrong', ch: 2, find: 'Find the 4 problems', cols: 3,
          intro: 'Tap every line that shows this is not a real TFSA, or not a good deal.',
          spots: [{ id: 'limit', icon: '♾️', label: '“No limit! Put in as much as you want!”', bad: true, why: 'A real TFSA has a yearly limit ($7,000 in 2026).', hint: 'What is the TFSA limit?' }, { id: 'fee', icon: '💸', label: '“A small 8% yearly fee”', bad: true, why: '8% a year eats most of any growth.' },
            { id: 'guar', icon: '🛡️', label: '“Guaranteed 20% growth”', bad: true, why: 'No real account guarantees 20%.' }, { id: 'nosin', icon: '🙈', label: '“No SIN needed. No bank. Just cash.”', bad: true, why: 'A real TFSA is opened at a financial institution, with your SIN.' },
            { id: 'withdraw', icon: '🏧', label: '“Take money out when you need it”', fine: 'Real TFSAs allow that too. It isn’t the problem.' }, { id: 'save', icon: '🐷', label: '“Saving is smart!”', fine: 'True! Just not here.' }] });
        await api.say('lark', ['It’s not technically a... TFSA. It’s a SUPER account. Different. Excuse me.']);
        S.story.super = 1; api.toast('Added to your Clinic notes: the Super Account'); api.save();
      }));
      a.push(step('rep3', async function (api, S) {
        await api.quest('The clinic tray is full. Help Ms. Fournier sort.', 'fournier');
        await repRound(api, S, 'ch3', 3);
        await api.say('fournier', ['Now do Step 3 of your project: RRSP or TFSA for your client.', 'Next time: gigs, tips and self-employment. Then Tax Clinic Night!']);
      }));
    }
    if (ch === 3) {
      a.push(step('kai', async function (api, S) {
        await api.quest('Ms. Fournier has a self-employment example', 'fournier');
        await api.say('fournier', ['Kai edits videos and earns $10,000 a year. Self-employed: no T4, no tax taken off.', 'CPP isn’t charged on the first $3,500, and the self-employed pay both halves: 11.9%.']);
        var g = await api.calc({ title: 'Self-employed CPP', name: 'kaicpp', noPay: true, intro: '<p>Kai: <b>$10,000</b>, no other job. A tutor: <b>$8,000</b>, no other job.</p>', fields: [{ k: 'k', name: 'Kai’s CPP', ans: cppSE(1000000, false), hint: '0.119 × ($10,000 − $3,500).' }, { k: 't', name: 'The tutor’s CPP', ans: cppSE(800000, false), hint: '0.119 × ($8,000 − $3,500).' }] });
        api.record('q-kaicpp', 'Self-employed CPP', 3, g === 'first');
        await api.ask('fournier', WHO_QS[3], 'q-file', 'Why file with a low income', 3);
      }));
      a.push(step('priya3', async function (api, S) {
        await api.quest('Finish Priya’s return', 'priyafile');
        var R = S.typed.advice && S.typed.advice.pick === 'rrsp' ? priyaReturn(PRIYA.save) : priyaReturn(0);
        var g = await api.calc({ title: 'Finish Priya’s return', name: 'priyafinal', noPay: true, ref: TAX_CARD + priyaHTML(), refLabel: 'Show the method and Priya’s papers', intro: '<p>Using your advice (' + (S.typed.advice && S.typed.advice.pick === 'rrsp' ? 'RRSP' : 'TFSA') + '). Her café job already used the $3,500 CPP exemption, so she pays 11.9% on all her gig earnings.</p>',
          fields: [{ k: 'c', name: 'Self-employed CPP on the gig', ans: R.cpp, hint: '0.119 × $2,500.' }, { k: 'o', name: 'Total owed', sub: 'income tax + CPP', ans: R.owed, hint: fmt(R.tax) + ' + the CPP.' }, { k: 'r', name: 'Refund (or balance owing, with a minus)', sub: 'box 22 − total owed', ans: R.refund, hint: '$700 − total owed.', net: 1 }] });
        api.record('q-priyafinal', 'Priya’s return: CPP, total owed, refund', 3, g === 'first'); S.priya.done = R.refund; api.save();
        await K.typed(api, { id: 'tip', title: 'A tip for Priya', prompt: 'Write one tip for Priya for next year (receipts, tips, setting money aside, or filing).' });
      }));
      a.push(step('night', async function (api, S) { // the hero beat: Tax Clinic Night
        S.scene = 'night'; api.refresh();
        await api.quest('Tax Clinic Night is starting!', 'fournier');
        api.fx.face('all');
        await api.say('fournier', ['Welcome to Tax Clinic Night! Free returns, all evening. Volunteers, to your tables.', api.profile.name + ', your first clients are waiting.']);
        if (!S.night) S.night = { got: 0, asked: {} };
        var Qs = [
          ['q-night-tips', 'avery', { text: 'I made $900 in cash tips. Do I really have to report them?', opts: [['Yes. All income is reportable, including tips. You may still get a refund.', 1, 'Okay. Honest Avery.'], ['No. Cash is invisible.', 0, 'That’s what someone told her. It isn’t true.'], ['Only if your boss reports them.', 0, 'You report them yourself.']] }],
          ['q-night-quick', 'jas', { text: 'Should I keep using QuickRefund next year?', opts: [['No need. Free clinics file for free, and they look for credits like tuition.', 1, 'Free AND my tuition credit. Easy choice.'], ['Yes. Fast is always better.', 0, 'Fast cost Jas a fee and a missed credit.'], ['Don’t file at all.', 0, 'Not filing means missing refunds and benefits.']] }],
          ['q-night-dc', 'grandpa', { text: 'What’s the difference between a credit and a deduction, in plain words?', opts: [['A deduction makes your taxed income smaller. A credit makes your tax smaller.', 1, 'Plain words. I like it.'], ['They’re the same.', 0, 'They work differently.'], ['A credit is a loan.', 0, 'Not a loan. It lowers the tax itself.']] }],
          ['q-night-gift', 'worker', { text: 'What do I say if that “CRA” text comes back?', opts: [['Nothing. The CRA never asks for gift cards. Check your real CRA account or call the CRA directly.', 1, 'Nothing it is.'], ['Pay a little, to be safe.', 0, 'Never pay a scammer.'], ['Send them my SIN to prove who I am.', 0, 'Never send personal information.']] }]
        ];
        for (var i = 0; i < Qs.length; i++) {
          var q = Qs[i]; if (S.night.asked[q[0]]) continue;
          var r = await api.ask(q[1], q[2], q[0], 'Tax Clinic Night: ' + q[2].text, 3);
          S.night.asked[q[0]] = 1; if (r.first) { S.night.got++; api.fx.rise(q[1], '+1'); }
          api.save(); api.hud();
        }
        S.win = S.night.got >= POINTS_TO_WIN; api.save();
        await api.say('fournier', S.win ? 'Every client left with an answer and a return. Wonderful.' : 'A good night! A few clients need follow-up. You can replay this chapter from the Menu.');
        await api.say('jas', ['I re-filed here, free. With my tuition credit!', 'And QuickRefund put up a “closed” sign. Mr. Lark says he’s “retiring.”']);
        S.story.night = 1; api.save();
        await K.hero(api, { who: 'fournier', lines: ['From now on, the town will hold a free-filing night every March. With scam warnings at the door.', api.profile.name + ' made it happen. So it’s the ' + api.profile.name + ' Free File Night.'],
          medal: 'Tax Clinic medal', icon: '🧾', kicker: 'Tax Clinic Night', title: 'The ' + api.profile.name + ' Free File Night', thanks: [['worker', 'My refund came. My real one. Thank you.']], reply: ['Thanks! File every year. Report everything. Ignore scams.'] });
        S.story.hero = 1; S.scene = null; api.refresh();
      }));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and pin your clinic summary to your My Plan wall', 'myplan');
        var firstTime = !S.finished; S.finished = true;
        if (firstTime) api.profileAdd('closet', 'taxpro');
        api.profileAdd('plan', { mission: '9-income-tax', title: 'Tax Clinic', text: 'Priya’s refund: ' + fmt(S.priya.done || 0) + '. Advice: ' + (S.typed.advice ? S.typed.advice.pick.toUpperCase() : '—') + '. A refund is my own money coming back.' });
        api.profileAdd('finished', '9-income-tax'); api.refresh();
        await api.say('you', ['At the start I said a refund was: ' + (S.typed.entry || '—') + '.', 'Now I know: it’s your own money, coming back.']);
        await api.say('fournier', [S.win ? 'A full night of happy clients, and a night named after you!' : 'A night named after you! Next time, answer every client.', 'Your closet has a new Tax clinic cardigan, and your My Plan wall has a new page.', 'Now do Step 4 of your project: finish your client’s return.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }

  T.mission({
    id: '9-income-tax', unitLabel: 'CEFL Grade 9 · Income and Tax · Project: Tax Clinic', title: 'Tax Clinic: The Instant Refund',
    iCan: 'I can read a T4, work out tax with credits and deductions, compare an RRSP and a TFSA, and handle tips, gigs and self-employed CPP.',
    foot: 'This is a model. Tax rules are the workbook’s simplified 2026 method; client amounts are samples. The people and businesses are made up.',
    bagTip: 'Your Bag holds what you collect: Priya’s file, the tax method card and your Clinic notes.',
    realRule: 'Real gives no hints, and the clinic’s clients still need 3 good answers', afterLine: 'Mission complete. Open Menu → Report to show your teacher.',
    chapters: [
      { name: 'The T4 and the return', step: 'Step 1', moment: 'Moment 1: the T4 and the tax return' },
      { name: 'Credits and deductions', step: 'Step 2', moment: 'Moment 2: credits and deductions' },
      { name: 'RRSP or TFSA?', step: 'Step 3', moment: 'Moment 3: RRSP or TFSA' },
      { name: 'Gigs and tips', step: 'Step 4', moment: 'Moment 4: gigs, tips and self-employment' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps, guide: 'fournier',
    helpers: function () { return HELPS; }, gossip: gossip, mail: function (S, seed, last) { return mailTask(seed, last); },
    outfit: function (S) { return S.finished ? 'taxpro' : 'none'; },
    placeObjects: function (api) { api.place('table', 'home', 4, 3, { label: 'Kitchen table' }); api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true }); api.place('priyafile', 'taxclinic', 2, 4, { draw: 'letter', label: 'Priya’s file' }); },
    people: function (S) {
      var out = {}, s = S.story;
      out.fournier = { name: 'Ms. Fournier', role: 'Tax Clinic volunteer', map: 'taxclinic', x: 4, y: 3, dir: 'down', look: { base: 3, skin: 's2', hair: 'grey', shirt: 'teal', pants: '#3b3f5c' } };
      out.lark = { name: 'Mr. Lark', role: 'QuickRefund', map: 'quickcash', x: 4, y: 3, dir: 'down', look: { base: 2, skin: 's1', hair: 'brown', shirt: 'yellow', pants: '#2f2f38' }, hidden: !s.larkOut || s.night };
      if (s.moIn && !s.mo2) out.worker = { map: 'taxclinic', x: 6, y: 3, dir: 'left' };
      if (S.scene === 'night') { out.avery = { map: 'taxclinic', x: 1, y: 3, dir: 'right' }; out.jas = { map: 'taxclinic', x: 6, y: 3, dir: 'left' }; out.grandpa = { map: 'taxclinic', x: 7, y: 3, dir: 'left' }; out.worker = { map: 'taxclinic', x: 5, y: 3, dir: 'down' }; }
      return out;
    },
    doorOpen: function (id) { return !!{ home: 1, grandpa: 1, taxclinic: 1, quickcash: 1, bank: 1, library: 1, servicecanada: 1, jobcentre: 1 }[id]; },
    lockedLine: function (id) { return T.world.building(id).name + ' is closed right now. It’s tax season!'; },
    talk: function (id, S, api) {
      var s = S.story, done = S.finished;
      var lines = {
        fournier: done ? 'File every year. Report everything. Ignore scams.' : 'Your next goal is on the gold line at the top.',
        lark: 'QuickRefund! Your refund today! Fees... apply.', priyafile: 'Priya’s file: a T4, tips, a delivery gig, and tuition.',
        worker: s.mo2 ? 'A refund! From the real CRA! Not gift cards!' : s.mo1 ? 'Do I really owe $1,200?' : 'Hard hats on!', jas: s.night ? 'Free filing! With my tuition credit!' : s.jas ? '$99 fee and no tuition credit. Ugh.' : 'QuickRefund is so fast!',
        avery: 'Is cash really invisible to taxes? Asking for a friend. The friend is me.', agent: 'Service Canada: benefits, EI, CPP. The CRA handles taxes.',
        grandpa: 'The real tax office sends letters.', sam: 'Instant refund cheques are always smaller than they should be.', table: 'The kitchen table. Good for paperwork.',
        myplan: K.planLine(api)
      };
      return lines[id] || null;
    },
    hud: function (S) {
      var out = [{ label: 'Client', value: 'Priya' }];
      if (S.priya.done != null) out.push({ label: 'Refund', value: fmt(S.priya.done) });
      if (S.night) out.push({ label: 'Clients', value: S.night.got + ' / 4', title: '3 good answers on Tax Clinic Night' });
      return out;
    },
    items: function (S) {
      var it = [{ name: 'Priya’s file', icon: '🗂️', note: 'The client case', view: priyaHTML }, { name: 'Tax method card', icon: '🧾', note: 'Simplified 2026', view: function () { return TAX_CARD; } }];
      if (S.story.mo1) it.push({ name: 'Clinic notes', icon: '🔍', note: 'The instant refund', view: function () { return K.notes(notes(S)); } });
      if (S.story.hero) it.push({ name: 'Tax Clinic medal', icon: '🧾', note: 'The ' + T.api.profile.name + ' Free File Night', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🧾</p><p style="text-align:center"><b>Tax Clinic</b><br>File every year. Report everything. Ignore scams.</p>'; } });
      return it;
    },
    report: function (S) {
      var h = '<p>Client: <b>Priya</b>' + (S.priya.done != null ? ' · Refund: <b>' + fmt(S.priya.done) + '</b>' : '') + (S.typed.advice ? ' · Advice: <b>' + S.typed.advice.pick.toUpperCase() + '</b>' : '') + (S.finished ? ' · Tax Clinic Night: <b>' + S.night.got + ' of 4</b> (' + (S.win ? 'every client helped' : 'goal not reached') + ')' : '') + '</p>';
      h += '<p>First answer about refunds: ' + esc(S.typed.entry || '—') + '.</p>';
      var rp = Object.keys(S.reports); if (rp.length) h += '<h3>Report It?</h3>' + K.table(rp.map(function (k) { var x = S.reports[k]; return ['Chapter 3', String(x.score), K.TIER_WORD[x.tier]]; }), ['When', 'Score', 'Result']);
      h += K.wrote(S, [['advice', 'RRSP or TFSA for Priya', function (k) { return k.toUpperCase(); }], ['tip', 'A tip for next year']]);
      h += '<h3>The instant refund</h3><p>' + (S.story.hero ? 'Solved: the town filed for free at Tax Clinic Night, Jas got the tuition credit, and the night was named after them.' : S.story.super ? 'Found the Super Account’s problems.' : S.story.mo1 ? 'Collecting clues.' : 'Not started.') + '</p>';
      return h;
    },
    test: { scenes: [null, { story: { moIn: 1, larkOut: 1 } }, { scene: 'night', story: { larkOut: 1 } }], fedTax: fedTax, abTax: abTax, incomeTax: incomeTax, cppSE: cppSE, rrspLimit: rrspLimit, PRIYA: PRIYA, priyaIncome: priyaIncome, priyaReturn: priyaReturn, refundOf: refundOf, JAMIE: JAMIE, MO: MO, JAS: JAS, GAME_CFGS: GAME_CFGS, t4Task: t4Task, rrspTask: rrspTask, limitTask: limitTask, cppTask: cppTask, reportTask: reportTask, mailTask: mailTask, HELPS: HELPS, GOSSIP: GOSSIP }
  });
  function notes(S) {
    var s = S.story, li = [];
    if (s.mo1) li.push('<b>Mo:</b> a text says “CRA: pay $1,200 in gift cards today or be arrested.”');
    if (s.mo2) li.push('<b>Mo’s T4:</b> he’s getting ' + fmt(refundOf(MO.t4, MO.box22)) + ' back. The CRA never asks for gift cards. It was a scam.');
    if (s.jas) li.push('<b>Jas and QuickRefund:</b> a $99 fee, and the tuition credit was skipped. Filed right, Jas gets ' + fmt(refundOf(JAS.t4, JAS.box22, JAS.tuition)) + ' back.');
    if (s.super) li.push('<b>The Super Account:</b> no limit, an 8% fee, “guaranteed 20%,” and no SIN or bank. Not a TFSA.');
    if (s.night) li.push('<b>Tax Clinic Night:</b> free returns; Jas re-filed and got the credit; QuickRefund closed.');
    if (s.hero) li.push('<b>The ' + esc(T.api.profile.name) + ' Free File Night:</b> every March, with scam warnings at the door.');
    return li;
  }
})();
