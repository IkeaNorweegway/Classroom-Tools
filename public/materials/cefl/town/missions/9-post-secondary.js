/* CEFL Town mission: Grade 9 Post-Secondary Pathways — "Pathway Pitch" (companion to the project Pathway Pitch). LO 9-PS.
   Four chapters, one after each project step: Student loans (how you'd pay) · Return on investment · Learning while you earn
   (co-op, apprenticeships, credential recognition) · Getting in, and a Plan B. You build a post-secondary plan and pitch it.
   Model (MODEL START … END, no DOM): three pathways from the workbook (RN degree: U of A 2026–27 tuition $729.36 a course, 10 a year;
   electrician apprenticeship: Portage College tuition $4,656 total, paid on the job; vet tech diploma: $6,000 a year, sample), ALIS
   2023 average salaries ($73,823, $81,919, $47,812), lost earnings $2,400 a month in school, the $31,200 minimum-wage baseline,
   payback = true cost ÷ (salary − $31,200). Student loans: the federal part is interest-free; the Alberta part charges prime (4.5% is a
   sample), monthly payments from the standard loan formula over 10 years. Goal: the family panel is convinced by your pitch (at least
   3 of 4 first-try answers). The Pay for School game (kit sortRush) counts sorted cards; it never changes the goal.
   Side story, "The easy loan": Rosa's niece Kira signed up for the Bright Star Game Academy with an "EZ Tuition" loan (Ch 1) → its
   true cost and payback are far worse than the polytechnic's (Ch 2) → no co-op, and its credential isn't recognized by employers or
   other schools; the lender and the academy are partners (Ch 3) → at the Pathway Pitch, Kira switches to a polytechnic program with
   co-op and a student loan, and the counsellor's new check-before-you-sign list is named after you (Ch 4).
   Between lessons (HELP START … HELP END): townspeople's own questions, an extra Pay for School round, and Town Mail.
   Simplifications: no fees, books or living costs unless named; payback ignores taxes and raises; loan totals use the payment you
   can see (rounded to the cent) × the months. */
(function () {
  'use strict';

/* MODEL START ── no DOM. Money in cents. ── */
var LOST = 240000, BASE = 3120000, PRIME = 0.045, UA_YEAR = 729360;
function payment(P, rate, months) { if (!rate) return Math.round(P / months); var r = rate / 12; return Math.round(P * r / (1 - Math.pow(1 + r, -months))); }
function repaid(P, rate, months) { return rate ? payment(P, rate, months) * months : P; }
var PATHS = {
  nurse: { name: 'Registered nurse degree', short: 'RN degree', icon: '🩺', school: 'University', years: 4, tuitionYear: UA_YEAR, tuitionTotal: 4 * UA_YEAR, monthsLost: 4 * 8, salary: 7382300, paid: false, coop: 'Paid co-op terms at some schools; clinical placements are part of every program', planB: 'A practical nursing diploma (and bridge to RN later)', planBbad: 'A business diploma', demand: 'Alberta may be short more than 4,000 nurses (2023–2033 forecast).' },
  elec:  { name: 'Electrician apprenticeship', short: 'Electrician', icon: '⚡', school: 'Portage College (classes)', years: 4, tuitionYear: null, tuitionTotal: 465600, monthsLost: 4 * 2, salary: 8191900, paid: true, coop: 'An apprenticeship IS work-integrated learning: paid on the job', planB: 'A different trade, like plumbing or a pre-employment electrical program', planBbad: 'An art history degree', demand: 'Alberta may be short more than 4,000 electricians (2023–2033 forecast).' },
  vet:   { name: 'Vet tech diploma', short: 'Vet tech', icon: '🐾', school: 'College', years: 2, tuitionYear: 600000, tuitionTotal: 1200000, monthsLost: 2 * 8, salary: 4781200, paid: false, coop: 'Practicums at animal clinics', planB: 'An animal care certificate, then bridge later', planBbad: 'A welding apprenticeship', demand: 'Check ALIS for the outlook.' }
};
var PATH_KEYS = Object.keys(PATHS);
function trueCost(k) { var p = PATHS[k]; return p.tuitionTotal + p.monthsLost * LOST; }
function extraPay(k) { return PATHS[k].salary - BASE; }
function payback(k) { return trueCost(k) / extraPay(k); }
var MAYA = { fed: 1200000, ab: 800000 }; // the workbook's $20,000 split
var COOP = { wage: 2000, hours: 40, weeks: 16, terms: 3 }; // $20/hour (sample), three 16-week terms
function coopEarn(c) { return c.wage * c.hours * c.weeks * c.terms; }
var KIRA = { academy: 'Bright Star Game Academy', tuition: 2000000, years: 2, salary: 3900000, loan: 1200000, rate: 0.19, polyTuition: 650000, polyCoop: 1280000 }; // samples: the story’s numbers
function kiraTrue() { return KIRA.tuition * KIRA.years + KIRA.years * 8 * LOST; }
var POINTS_TO_WIN = 3;
var GAME_CFGS = {
  pay: { kind: 'sortRush', cfg: { id: 'pay', name: 'Pay for School', scoreWord: 'Sorted', win: [7000, 5200], think: 1400, th: [[15, 6], [15, 6]],
    how: '<p><b>Pay for School.</b> Ways to pay for school slide in. Is each one money you <b>pay back</b>, money you <b>don’t pay back</b>, or money you <b>earn</b> while you learn?</p><p class="ct-small">A wrong pick costs a point. So does a card that runs out of time.</p>',
    bins: [{ id: 'back', label: 'Paid back', icon: '🔁' }, { id: 'free', label: 'Not paid back', icon: '🎁' }, { id: 'earn', label: 'Earned while learning', icon: '💼' }],
    items: [['Federal student loan', 'back'], ['Alberta student loan', 'back'], ['A bank line of credit', 'back'], ['A private “EZ Tuition” loan', 'back'], ['A credit card', 'back'], ['Borrowing from a relative', 'back'],
      ['A scholarship for your marks', 'free'], ['A government grant', 'free'], ['A bursary from a local club', 'free'], ['The Rutherford Scholarship', 'free'], ['A gift from Grandpa', 'free'], ['An award for volunteering', 'free'],
      ['Pay from a co-op work term', 'earn'], ['An apprentice’s wages', 'earn'], ['A summer job', 'earn'], ['A paid internship', 'earn'], ['A part-time job during school', 'earn'], ['Pay from a work placement', 'earn']
    ].map(function (x) { return { t: x[0], bin: x[1], icon: x[1] === 'back' ? '🔁' : x[1] === 'free' ? '🎁' : '💼', why: { back: 'Loans and credit are paid back, often with interest.', free: 'Grants, scholarships, bursaries and gifts are not paid back.', earn: 'You earn it by working while you learn.' }[x[1]] }; }) } }
};
/* MODEL END */

/* HELP START ── between lessons, on fresh seeds. No DOM. ── */
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function loanTask(seed) { var r = RNG(seed * 13 + 1); r(); var P = (4 + Math.floor(r() * 13)) * 100000, yrs = [5, 10][Math.floor(r() * 2)], pm = payment(P, PRIME, yrs * 12); return { P: P, years: yrs, pay: pm, total: pm * yrs * 12, interest: pm * yrs * 12 - P }; }
function roiTask(seed) { var r = RNG(seed * 17 + 3); r(); var years = [1, 2, 3, 4][Math.floor(r() * 4)], tuition = (4 + Math.floor(r() * 7)) * 100000, salary = (40 + Math.floor(r() * 41)) * 100000, cost = years * tuition + years * 8 * LOST, extra = salary - BASE; return { years: years, tuition: tuition, salary: salary, cost: cost, extra: extra, payback: Math.round(cost / extra * 10) / 10 }; }
function coopTask(seed) { var r = RNG(seed * 19 + 5); r(); var c = { wage: [1600, 1800, 2000, 2200][Math.floor(r() * 4)], hours: [35, 37, 40][Math.floor(r() * 3)], weeks: 16, terms: [1, 2, 3][Math.floor(r() * 3)] }; return { c: c, earn: coopEarn(c) }; }
var LOAN_QS = [
  { id: 'grant', label: 'Loans vs. grants', text: 'What’s the difference between a student loan and a grant?', opts: [['A loan is paid back after school. A grant is not paid back.', 1, 'Right. Grants first, then loans.'], ['They’re the same thing.', 0, 'One is paid back. One isn’t.'], ['A grant is paid back with interest.', 0, 'That’s a loan.']] },
  { id: 'fed', label: 'The federal part', text: 'Which part of an Alberta student loan charges interest?', opts: [['Only the Alberta part, at prime. The federal part is interest-free.', 1, 'Good to know.'], ['Both parts charge 19%.', 0, 'Student loans are much cheaper than that.'], ['Neither. Student loans are free.', 0, 'The Alberta part charges prime.']] },
  { id: 'faster', label: 'Paying a loan faster', text: 'If I pay my loan back in 5 years instead of 10, do I pay more or less interest?', opts: [['Less, because the money is borrowed for less time.', 1, 'Bigger payments, less interest overall.'], ['More, because the payments are bigger.', 0, 'Payments are bigger, but total interest is smaller.'], ['The same.', 0, 'Time changes the total interest.']] }
];
var PLAN_QS = [
  { id: 'related', label: 'A good contingency', text: 'Why should a Plan B usually be related to Plan A?', opts: [['So it still leads toward your goal, and many of the same steps help both.', 1, 'Makes sense.'], ['It shouldn’t. Pick something totally different.', 0, 'A related Plan B keeps you on your path.'], ['Because Plan A will fail.', 0, 'Plan B isn’t expecting failure. It’s staying flexible.']] },
  { id: 'beyond', label: 'Beyond grades', text: 'What can competitive programs look at besides grades?', opts: [['Portfolios, interviews, references and experience.', 1, 'So I should start volunteering now.'], ['Nothing. Only grades count.', 0, 'Many look at more.'], ['How much money your family has.', 0, 'Admission isn’t about family money.']] },
  { id: 'mature', label: 'Going back to school later', text: 'A 30-year-old wants to change careers and go back to school. Is that possible?', opts: [['Yes. Mature students can take different paths in, and their work experience counts.', 1, 'Never too late.'], ['No. School is only for teens.', 0, 'Lots of adults go back.'], ['Only if they never worked before.', 0, 'Work experience often helps.']] },
  { id: 'cred', label: 'Credential recognition', text: 'Why check if a credential is recognized before you enroll?', opts: [['Some credentials aren’t accepted by employers, other schools, or other provinces.', 1, 'Check before you pay.'], ['All credentials are the same.', 0, 'They aren’t.'], ['Only to frame it nicely.', 0, 'It decides where you can work.']] }
];
function mailKind(seed, last) { var k = ['loanq']; if (last >= 0) k.push('loan'); if (last >= 1) k.push('roi'); if (last >= 2) k.push('coop'); if (last >= 3) k.push('plan'); return k[RNG(seed * 7 + 3)() * k.length | 0]; }
/* HELP END */

  var T = window.CEFLTown, K = T.kit, esc = T.esc;
  var fmt = K.fmt, fmtW = K.fmtW, step = K.step;
  function yFmt(c) { return (Math.round(c) / 100) + ' years'; }
  var PAYG = T.gameKit.sortRush(GAME_CFGS.pay.cfg), PAY_PAY = 800;
  function pathHTML(k) { var p = PATHS[k]; return '<div class="ck-card"><span class="ck-big" aria-hidden="true">' + p.icon + '</span><b>' + esc(p.name) + '</b><span class="ct-small">' + esc(p.school) + ', ' + p.years + ' years</span><div class="ck-kv"><span>Tuition</span><b>' + (p.tuitionYear ? fmt(p.tuitionYear) + ' a year' : fmt(p.tuitionTotal) + ' total') + '</b><span>Months in class</span><b>' + p.monthsLost + (p.paid ? ' (paid on the job the rest)' : '') + '</b><span>Average salary</span><b>' + fmtW(p.salary) + ' (ALIS 2023)</b><span>Earn while learning</span><b>' + esc(p.coop) + '</b></div></div>'; }
  function payOpts(api, seed, help) {
    return { title: 'Pay for School' + (help ? ': an extra round' : ''), name: 'minigame', game: PAYG, seed: seed, seconds: 60, leave: !!help, skipNote: 'Skipping is okay.',
      tierText: help ? K.payTiers(PAY_PAY) : { great: 'You know every way to pay. Free money first!', ok: 'Nice sorting.', poor: 'Loans hide in friendly names. Ask: do I pay it back?' } };
  }
  async function payRound(api, S, key, n) {
    if (!S.rounds[key]) { var r = await api.minigame(payOpts(api, S.seed * 79 + n, false)); S.rounds[key] = { tier: r.tier, score: r.score }; api.save(); api.hud(); }
    var t = S.rounds[key].tier;
    await api.say('haddad', t === 'great' ? 'Free money first, earned money next, borrowed money last. You’ve got it.' : t === 'ok' ? 'Good sorting!' : t === 'skip' ? 'Another time!' : 'The question is always: do I pay it back?');
  }

  function init() { return { v: 1, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), ans: {}, typed: {}, story: {}, path: null, rounds: {}, pitch: null, scene: null, finished: false }; }
  function validate(S) { return !!S && S.v === 1 && !!S.typed && !!S.story && !!S.rounds && (S.path === null || !!PATHS[S.path]); }
  function P(S) { return PATHS[S.path]; }

  var HELPS = [
    { id: 'ps9-loan', who: 'sam', after: 0, pay: 1000, label: 'What a loan really costs', ask: 'A customer asked what their student loan will really cost. Can you check?', run: async function (api, seed) {
      var t = loanTask(seed); var g = await api.calc({ title: 'Help Sam: a loan’s real cost', name: 'help-loan', intro: '<p>An Alberta student loan of <b>' + fmtW(t.P) + '</b> at 4.5% (sample) over <b>' + t.years + ' years</b>: the payment is <b>' + fmt(t.pay) + '</b> a month.</p>', fields: [{ k: 't', name: 'Total repaid', sub: t.years * 12 + ' payments', ans: t.total, hint: fmt(t.pay) + ' × ' + t.years * 12 + '.' }, { k: 'i', name: 'Interest paid', ans: t.interest, hint: 'Total repaid − ' + fmtW(t.P) + '.' }] });
      if (g) await api.say('sam', 'And that’s the CHEAP kind of loan. Imagine 19%.'); return g; } },
    { id: 'ps9-loanq', who: 'grandpa', after: 0, pay: 500, label: 'Student loans', ask: 'My granddaughter is starting university. Can I ask you about loans?', run: async function (api, seed) { return K.askGrade(await api.ask('grandpa', LOAN_QS[seed % LOAN_QS.length], null)); } },
    { id: 'ps9-roi', who: 'dev', after: 1, pay: 1000, label: 'True cost and payback', ask: 'I’m looking at a program. Is it worth it? Can you work out the payback?', run: async function (api, seed) {
      var t = roiTask(seed); var g = await api.calc({ title: 'Help Dev: true cost and payback', name: 'help-roi', intro: '<p>A <b>' + t.years + '-year</b> program, <b>' + fmtW(t.tuition) + '</b> a year in tuition (sample), 8 months a year in school. Average salary after: <b>' + fmtW(t.salary) + '</b>.</p><p class="ct-small">Lost earnings: $2,400 a month in school. Baseline: $31,200 a year. Round payback to one decimal.</p>',
        fields: [{ k: 'c', name: 'True cost', ans: t.cost, hint: t.years + ' × ' + fmtW(t.tuition) + ' + ' + t.years + ' × 8 × $2,400.' }, { k: 'e', name: 'Extra pay each year', ans: t.extra, hint: fmtW(t.salary) + ' − $31,200.' }, { k: 'p', name: 'Payback', fmt: yFmt, ans: Math.round(t.payback * 100), alts: [Math.round(t.cost / t.extra * 100)], hint: 'True cost ÷ extra pay.', net: 1 }] });
      if (g) await api.say('dev', t.payback < 3 ? 'Pays back in under 3 years. Not bad!' : 'Hmm. That’s a long payback. Worth thinking about.'); return g; } },
    { id: 'ps9-plan', who: 'jas', after: 1, pay: 500, label: 'Plans and applications', ask: 'Can I ask you about getting into a program?', run: async function (api, seed) { return K.askGrade(await api.ask('jas', PLAN_QS[seed % PLAN_QS.length], null)); } },
    { id: 'ps9-coop', who: 'avery', after: 2, pay: 800, label: 'Co-op earnings', ask: 'My program has co-op terms. How much would I earn?', run: async function (api, seed) {
      var t = coopTask(seed), c = t.c; var g = await api.calc({ title: 'Help Avery: co-op earnings', name: 'help-coop', intro: '<p>' + c.terms + ' co-op term' + (c.terms > 1 ? 's' : '') + ', 16 weeks each, <b>' + c.hours + ' hours</b> a week at <b>' + fmt(c.wage) + '</b> an hour (sample).</p>', fields: [{ k: 'e', name: 'Total co-op earnings', ans: t.earn, hint: fmt(c.wage) + ' × ' + c.hours + ' × 16 × ' + c.terms + '.' }] });
      if (g) await api.say('avery', 'That’s tuition I don’t have to borrow. And experience!'); return g; } },
    { id: 'ps9-cred', who: 'librarian', after: 3, pay: 500, label: 'Credentials and contingencies', ask: 'A patron asked me something about programs. Can you answer?', run: async function (api, seed) { return K.askGrade(await api.ask('librarian', PLAN_QS[3 - (seed % 2) * 3], null)); } },
    { id: 'ps9-pay', who: 'agent', after: 1, pay: PAY_PAY, label: 'An extra Pay for School round', game: true, ask: 'We get so many questions about paying for school. Want to sort some?', run: async function (api, seed) {
      var r = await api.minigame(payOpts(api, seed, true)); return K.gameGrade(r); } }
  ];
  var GOSSIP = [
    { id: 'g-rosa-0', who: 'rosa', after: -1, lines: ['My niece Kira just signed up for a game design academy. Very fancy brochure.', 'She got the loan in ten minutes. Ten minutes! Is that... normal?'] },
    { id: 'g-gp-0', who: 'grandpa', after: -1, lines: ['I paid for trade school by working nights.', 'Didn’t owe a dime when I finished. Tired, though. So tired.'] },
    { id: 'g-sam-0', who: 'sam', after: -1, lines: ['Student loans from the government are some of the cheapest money around.', 'The federal part charges no interest at all. People don’t believe me.'] },
    { id: 'g-kira-1', who: 'kira', after: 0, lines: ['Bright Star Game Academy! Two years, then I make games!', 'The loan is 19% but the man said I’d earn it back in, like, a month.'] },
    { id: 'g-cho-1', who: 'cho', after: 0, lines: ['Our game development diploma has two paid co-op terms.', 'Tuition is a third of that academy’s. Just saying.'] },
    { id: 'g-sterling-2', who: 'sterling', after: 1, lines: ['EZ Tuition Loans! Approved in ten minutes! No questions!', 'Interest rate? Look, it’s on page nine. Somewhere.'] },
    { id: 'g-haddad-2', who: 'haddad', after: 1, lines: ['A good program lists its graduation rate and job rate.', 'If they won’t tell you, that tells you something.'] },
    { id: 'g-dev-3', who: 'dev', after: 2, lines: ['My cousin went to Bright Star. Employers didn’t recognize the diploma.', 'He’s back at the polytechnic now. Paying two loans.'] },
    { id: 'g-mayor-3', who: 'mayor', after: 2, lines: ['Council got a complaint: the EZ loan office and Bright Star share an office manager.', 'Funny how that works.'] },
    { id: 'g-kira-4', who: 'kira', after: 3, lines: ['I switched to the polytechnic! Two co-op terms and a real student loan.', 'Federal part: zero interest. ZERO. Why didn’t anyone tell me?'] },
    { id: 'g-haddad-4', who: 'haddad', after: 3, lines: ['The {name} Check is on my office door now: true cost, payback, credential, co-op, loan rate.', 'Five questions before you sign anything.'] },
    { id: 'g-rosa-4', who: 'rosa', after: 3, lines: ['Kira’s happy. I’m happy. My wallet is happy.', 'Next family dinner, you’re invited.'] }
  ];
  function gossip(S, api) { return K.gossip(GOSSIP, api); }
  function mailTask(seed, last) {
    var k = mailKind(seed, last), from = 'Ms. Haddad';
    if (k === 'loan') { var t = loanTask(seed); return { label: 'Town Mail: a loan’s total', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Ms. Haddad:</p><p>“A payment of ' + fmt(t.pay) + ' a month for ' + t.years * 12 + ' months. Total repaid?”</p>', fields: [{ k: 't', name: 'Total repaid', ans: t.total, hint: fmt(t.pay) + ' × ' + t.years * 12 + '.' }] }); } }; }
    if (k === 'roi') { var r = roiTask(seed); return { label: 'Town Mail: payback', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Ms. Haddad:</p><p>“A true cost of ' + fmt(r.cost) + ', and ' + fmt(r.extra) + ' extra pay a year. Payback, to one decimal?”</p>', fields: [{ k: 'p', name: 'Payback', fmt: yFmt, ans: Math.round(r.payback * 100), alts: [Math.round(r.cost / r.extra * 100)], hint: 'True cost ÷ extra pay.' }] }); } }; }
    if (k === 'coop') { var c = coopTask(seed); return { label: 'Town Mail: co-op earnings', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Ms. Haddad:</p><p>“' + c.c.terms + ' term(s) of 16 weeks, ' + c.c.hours + ' hours a week, at ' + fmt(c.c.wage) + ' an hour. Total?”</p>', fields: [{ k: 'e', name: 'Co-op earnings', ans: c.earn, hint: 'Wage × hours × weeks × terms.' }] }); } }; }
    var q = k === 'plan' ? PLAN_QS[seed % PLAN_QS.length] : LOAN_QS[seed % LOAN_QS.length];
    return { label: 'Town Mail: ' + q.label, from: from, pay: 500, run: async function (api) { await api.say(null, 'A letter from Ms. Haddad. She has a question.'); return K.askGrade(await api.ask('haddad', q, null)); } };
  }

  function chapterSteps(ch, S, api) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the School and see Ms. Haddad', 'haddad');
        await api.say('haddad', ['Grade 9 already! Time to ask a big question: is a pathway worth what it costs?', 'Alex takes a 4-year university degree and borrows $30,000. Riley takes a 2-year polytechnic diploma with a paid co-op term and borrows $6,000. Both want to work with computers.']);
        var i = await api.choose('haddad', 'Five years after high school, who is better off?', ['Alex', 'Riley', 'It depends. I need more facts.']);
        S.typed.entry = ['Alex', 'Riley', 'It depends'][i];
        await api.say('haddad', ['Hold that thought. Pick a pathway for yourself, and we’ll work out what it really costs.']);
        var r = await K.pick(api, { id: 'path', title: 'My primary pathway', name: 'pickpath', intro: 'Pick one pathway to plan and pitch. Each uses real Alberta numbers.', noReason: true, options: PATH_KEYS.map(function (k) { var p = PATHS[k]; return { k: k, title: p.name, icon: p.icon, lines: [['Years', String(p.years)], ['Tuition', p.tuitionYear ? fmt(p.tuitionYear) + '/yr' : fmt(p.tuitionTotal) + ' total'], ['Average salary', fmtW(p.salary)]] }; }) });
        S.path = r.pick; api.give('Pathway card: ' + P(S).short, P(S).icon, 'haddad'); api.hud();
      }));
      a.push(step('hunch', async function (api, S) {
        S.story.kiraOut = 1; api.refresh();
        await api.quest('Rosa’s niece Kira is outside the School, showing off a brochure', 'kira');
        await api.say('kira', ['Look! Bright Star Game Academy! Two years and I make video games!', 'Tuition is $20,000 a year, but the EZ Tuition guy gave me a loan in ten minutes.', 'He said 19% is “basically nothing.” Is it?']);
        await api.say('you', ['I don’t know how loans work yet. Ms. Haddad is about to teach me.', 'Don’t sign anything else. I’ll keep notes.']);
        S.story.kira1 = 1; api.give('Pathway notes', '🔍', 'kira'); api.refresh();
      }));
      a.push(step('loans', async function (api, S) {
        await api.quest('Learn about student loans with Ms. Haddad', 'haddad');
        await api.say('haddad', ['Maya plans a nursing degree and needs to borrow $20,000. An Alberta student loan has two parts.', 'The federal part, $12,000: interest-free. The Alberta part, $8,000: interest at the prime rate. We’ll use 4.5% as a sample.', 'Over 10 years, the Alberta part’s payment is $82.91 a month.']);
        var g = await api.calc({ title: 'Maya’s loan', name: 'maya', noPay: true, intro: '<p>Federal part: <b>$12,000</b>, no interest. Alberta part: <b>$8,000</b>, paid back at <b>$82.91</b> a month for <b>120 months</b>.</p>',
          fields: [{ k: 'a', name: 'Alberta part: total repaid', sub: '$82.91 × 120', ans: repaid(MAYA.ab, PRIME, 120), alts: [994929], hint: '82.91 × 120.' }, { k: 'i', name: 'Interest on the Alberta part', ans: repaid(MAYA.ab, PRIME, 120) - MAYA.ab, alts: [194929], hint: 'Total repaid − $8,000.' }, { k: 't', name: 'Total repaid, both parts', ans: MAYA.fed + repaid(MAYA.ab, PRIME, 120), alts: [2194929], hint: '$12,000 + the Alberta total.', net: 1 }] });
        api.record('q-maya', 'Maya’s student loan: total repaid', 0, g === 'first');
        await api.ask('haddad', LOAN_QS[0], 'q-grant', 'Loans vs. grants', 0);
      }));
      a.push(step('mypay', async function (api, S) {
        await api.quest('Go home and plan how you’d pay', 'table');
        var p = P(S), save = 300000, schol = 250000, work = p.paid ? 0 : (p.years === 4 ? 1200000 : 600000), loan = Math.max(0, p.tuitionTotal - save - schol - work);
        var g = await api.calc({ title: 'How I’d pay: ' + p.short, name: 'mypay', noPay: true, intro: '<p>Total tuition: <b>' + fmt(p.tuitionTotal) + '</b>. Savings and family help: <b>' + fmtW(save) + '</b>. Rutherford Scholarship: <b>' + fmtW(schol) + '</b>. ' + (p.paid ? 'You’re paid on the job, so no summer-work money goes to tuition here.' : 'Summer work: <b>' + fmtW(work) + '</b> (sample).') + '</p>',
          fields: [{ k: 'l', name: 'Student loan needed', sub: 'tuition − everything else (0 if nothing is left)', ans: loan, hint: 'Tuition − savings − scholarship − work.' }] });
        api.record('q-mypay', 'How I’d pay: loan needed', 0, g === 'first');
        S.loan = loan; api.save();
        await api.say('you', loan ? ['I’d borrow ' + fmt(loan) + '. The federal part is interest-free.'] : ['I wouldn’t need a loan at all. Being paid while I learn really helps.']);
      }));
      a.push(step('end1', async function (api, S) {
        await api.quest('Tell Ms. Haddad about Kira’s loan', 'haddad');
        await api.say('haddad', ['19%? On a $12,000 loan over 10 years, that’s about $224 a month: almost $15,000 in interest. A student loan costs a fraction of that.', 'Now do Step 1 of your project: your pathway, and how you’d pay.', 'Next time: return on investment. Is it worth it?']);
      }));
    }
    if (ch === 1) {
      a.push(step('roi', async function (api, S) {
        await api.quest('Ms. Haddad wants to talk about return on investment', 'haddad');
        await api.say('haddad', ['ROI compares what a pathway costs with what it gives back. One simple way: how many years of higher pay does it take to pay back the true cost?', 'Full-time at the $15 minimum wage is about $31,200 a year. That’s our baseline.']);
        var p = P(S);
        var g = await api.calc({ title: 'ROI: ' + p.name, name: 'roi', noPay: true, ref: pathHTML(S.path), refLabel: 'Show my pathway', intro: '<p>True cost = total tuition + lost earnings ($2,400 for each month in class). Round payback to one decimal.</p>',
          fields: [{ k: 'c', name: 'True cost', ans: trueCost(S.path), hint: fmt(p.tuitionTotal) + ' + ' + p.monthsLost + ' × $2,400.' }, { k: 'e', name: 'Extra pay each year', sub: 'salary − $31,200', ans: extraPay(S.path), hint: fmtW(p.salary) + ' − $31,200.' }, { k: 'p', name: 'Payback', sub: 'true cost ÷ extra pay', fmt: yFmt, ans: Math.round(payback(S.path) * 10) * 10, alts: [Math.round(payback(S.path) * 100)], hint: 'True cost ÷ extra pay.', net: 1 }] });
        api.record('q-roi', 'True cost and payback for my pathway', 1, g === 'first');
        await api.ask('haddad', { text: 'What could make the real payback longer than the estimate?', opts: [['Not graduating, not finding work in the field, or a weak job market where you live.', 1, 'Yes. ROI depends on finishing and finding work.'], ['Nothing. The estimate is exact.', 0, 'Real life adds risks.'], ['Getting a scholarship.', 0, 'A scholarship lowers the cost, which shortens payback.']] }, 'q-roirisk', 'What makes ROI worse', 1);
      }));
      a.push(step('kira2', async function (api, S) { // clue 1: Kira's ROI
        await api.quest('Show Kira the numbers', 'kira');
        await api.say('kira', ['Okay, do Bright Star. $20,000 a year, 2 years. Game designers from there earn about $39,000 (that’s what their brochure says).']);
        var g = await api.calc({ title: 'Kira’s Bright Star numbers', name: 'kiraroi', noPay: true, intro: '<p>Tuition <b>$20,000</b> a year for <b>2 years</b>, 8 months a year in class. Salary (the brochure’s): <b>$39,000</b>. (Sample numbers.)</p>',
          fields: [{ k: 'c', name: 'True cost', ans: kiraTrue(), hint: '2 × $20,000 + 2 × 8 × $2,400.' }, { k: 'p', name: 'Payback (to one decimal)', sub: 'true cost ÷ ($39,000 − $31,200)', fmt: yFmt, ans: Math.round(kiraTrue() / (KIRA.salary - BASE) * 10) * 10, alts: [Math.round(kiraTrue() / (KIRA.salary - BASE) * 100)], hint: 'True cost ÷ $7,800.' }] });
        api.record('story-kira', 'Kira’s academy: true cost and payback', 1, g === 'first');
        await api.say('you', ['About ten years to pay back. And that’s before 19% interest on the loan.', 'The polytechnic’s game program is a third of the tuition.']);
        await api.say('kira', 'Ten years?! The man said a month!');
        S.story.roi = 1; api.toast('Added to your Pathway notes: Kira’s payback'); api.save();
      }));
      a.push(step('pay2', async function (api, S) {
        await api.quest('Ms. Haddad is running Pay for School at the School', 'haddad');
        await payRound(api, S, 'ch2', 2);
        await api.say('haddad', ['Now do Step 2 of your project: true cost and payback, with ALIS income data.', 'Next time: earning while you learn.']);
      }));
    }
    if (ch === 2) {
      a.push(step('coop', async function (api, S) {
        await api.quest('Ms. Haddad has a co-op example', 'haddad');
        await api.say('haddad', ['Work-integrated learning mixes school with real work: co-op, internships and apprenticeships.', 'In a co-op, you take turns: school terms and paid work terms. It lowers cost and builds experience.']);
        var g = await api.calc({ title: 'Three co-op terms', name: 'coop', noPay: true, intro: '<p>Three paid co-op terms, <b>16 weeks</b> each, <b>40 hours</b> a week, at <b>$20</b> an hour (sample).</p>', fields: [{ k: 'e', name: 'Total co-op earnings', ans: coopEarn(COOP), hint: '$20 × 40 × 16 × 3.' }] });
        api.record('q-coop', 'Co-op earnings', 2, g === 'first');
        await api.ask('haddad', PLAN_QS[3], 'q-cred', 'Credential recognition', 2);
        await K.typed(api, { id: 'wil', title: 'Earn while I learn', prompt: 'For your pathway (' + P(S).short + '): ' + P(S).coop + '. How would that lower your cost or build experience?' });
      }));
      a.push(step('academy', async function (api, S) { // clue 2 and the source: Bright Star and EZ Tuition
        S.story.sterlingOut = 1; api.refresh();
        await api.quest('Kira wants you to look at the Bright Star contract, at Quick Cash', 'sterling');
        await api.say('sterling', ['Ms. Sterling, EZ Tuition Loans. And the Bright Star office is right... here. Same desk! Convenient!', 'Here’s the contract. Sign at the bottom.']);
        await K.inspect(api, { title: 'The Bright Star and EZ Tuition contract', name: 'contract', story: true, key: 'story-contract', label: 'The academy contract: find the problems', ch: 2, find: 'Find the 4 problems', cols: 3,
          intro: 'Tap every line Kira should worry about before signing.',
          spots: [{ id: 'rate', icon: '💸', label: 'Loan interest: 19% a year', bad: true, why: 'A student loan’s federal part is interest-free. 19% is very expensive.', hint: 'Compare with a student loan.' }, { id: 'cred', icon: '📜', label: '“Diploma recognized by Bright Star”', bad: true, why: 'Only the academy recognizes it. Employers and other schools may not.' },
            { id: 'coop', icon: '🚫', label: 'Work placements: none', bad: true, why: 'No co-op means no paid experience and no references.' }, { id: 'refund', icon: '🔒', label: 'No refunds after day 1', bad: true, why: 'If it’s wrong for her, she can’t get out.' },
            { id: 'length', icon: '🗓️', label: 'Program length: 2 years', fine: 'Two years is a normal diploma length.' }, { id: 'name', icon: '🎮', label: 'Program: Game Design', fine: 'Game design is a real field. The problem isn’t the topic.' }] });
        await api.say('sterling', ['Recognized... by us. Which is a kind of recognition. Excuse me, my phone is ringing. It isn’t, but it might.']);
        S.story.contract = 1; api.toast('Added to your Pathway notes: the contract'); api.save();
      }));
      a.push(step('pay3', async function (api, S) {
        await api.quest('Another Pay for School round', 'haddad');
        await payRound(api, S, 'ch3', 3);
        await api.say('haddad', ['Now do Step 3 of your project: work-integrated learning, and a credential check.', 'Next time: Plan B, and your pitch. Bring Kira.']);
      }));
    }
    if (ch === 3) {
      a.push(step('planb', async function (api, S) {
        await api.quest('Ms. Haddad wants to talk about Plan B', 'haddad');
        await api.say('haddad', ['Competitive programs look at more than grades: portfolios, interviews, references, experience.', 'Because seats are limited, a smart plan has a primary pathway, a contingency, and a rationale.']);
        await api.ask('haddad', PLAN_QS[1], 'q-beyond', 'Beyond grades', 3);
        var p = P(S);
        await api.ask('haddad', { text: 'Which is the best contingency for your ' + p.short.toLowerCase() + ' plan?', opts: [[p.planB, 1, 'Yes: related, so it still leads toward your goal.'], [p.planBbad, 0, 'That’s unrelated. Your steps so far wouldn’t help much.'], ['No Plan B. Just hope.', 0, 'Hope isn’t a plan.']] }, 'q-planb', 'Choosing a related contingency', 3);
        await K.pick(api, { id: 'rationale', title: 'My plan', name: 'pickplan', intro: 'Primary: <b>' + esc(p.name) + '</b>. Contingency: <b>' + esc(p.planB) + '</b>. Give your rationale.', options: [{ k: 'go', title: 'This is my plan', icon: p.icon, lines: [['True cost', fmt(trueCost(S.path))], ['Payback', (Math.round(payback(S.path) * 10) / 10) + ' years'], ['Outlook', p.demand]] }],
          reasonPrompt: 'My rationale (a money reason, a personal reason, and a labour market reason):', tradeoff: 'How I’ll strengthen my application, beyond grades:' });
      }));
      a.push(step('pitch', async function (api, S) { // the hero beat: the Pathway Pitch
        S.scene = 'pitch'; api.refresh();
        await api.quest('The Pathway Pitch is starting at the School', 'haddad');
        api.fx.face('all');
        await api.say('haddad', ['Welcome to the Pathway Pitch! A family panel will hear your plans. Rosa and Kira are on the panel today.']);
        if (!S.pitch) S.pitch = { got: 0, asked: {} };
        var p = P(S), Qs = [
          ['q-pitch-worth', 'rosa', { text: 'Is your pathway worth the cost?', opts: [['The true cost is ' + fmt(trueCost(S.path)) + ', and it pays back in about ' + (Math.round(payback(S.path) * 10) / 10) + ' years at the average salary.', 1, 'Real numbers. I like it.'], ['Yes, every pathway is worth it.', 0, 'Show me the numbers.'], ['I didn’t check.', 0, 'That’s Kira’s mistake. Check!']] }],
          ['q-pitch-pay', 'grandpa', { text: 'How will you pay?', opts: [['Free money first: savings and scholarships. Then work. Then a student loan, where the federal part is interest-free.', 1, 'Sensible!'], ['A 19% loan. It’s fast.', 0, 'Fast isn’t cheap.'], ['I’ll figure it out later.', 0, 'A plan needs a funding plan.']] }],
          ['q-pitch-b', 'rosa', { text: 'What if you don’t get in?', opts: [['My contingency: ' + p.planB.toLowerCase() + '. It’s related, so it keeps me on my path.', 1, 'Good backup.'], ['Then my plan has failed.', 0, 'That’s what a contingency is for.'], ['I’ll pick something random.', 0, 'A related Plan B keeps your steps useful.']] }],
          ['q-pitch-kira', 'kira', { text: 'What should I check before I sign for a program?', opts: [['The true cost, the payback, if the credential is recognized, work placements, and the loan’s interest rate.', 1, 'Okay. I’m checking all five.'], ['Just the brochure.', 0, 'The brochure is an ad.'], ['Nothing. Sign fast before the deal ends.', 0, 'Pressure to sign fast is a red flag.']] }]
        ];
        for (var i = 0; i < Qs.length; i++) {
          var q = Qs[i]; if (S.pitch.asked[q[0]]) continue;
          var r = await api.ask(q[1], q[2], q[0], 'Pathway Pitch: ' + q[2].text, 3);
          S.pitch.asked[q[0]] = 1; if (r.first) { S.pitch.got++; api.fx.rise(q[1], '+1'); }
          api.save(); api.hud();
        }
        S.win = S.pitch.got >= POINTS_TO_WIN; api.save();
        await api.say('rosa', S.win ? 'Convinced. That’s a plan a family can get behind.' : 'Thank you. A few answers need work. You can replay this chapter from the Menu.');
        await api.say('kira', ['I cancelled Bright Star before classes started, so the no-refund rule never kicked in.', 'I’m going to the polytechnic: two paid co-op terms and a real student loan.']);
        S.story.pitch = 1; api.save();
        await K.hero(api, { who: 'haddad', lines: ['From now on, my office door has five questions for every student: true cost, payback, credential, work placements, and the loan’s rate.', 'They’re ' + api.profile.name + '’s questions. So it’s the ' + api.profile.name + ' Check.'],
          medal: 'Pathway Pitch medal', icon: '🎓', kicker: 'Pathway Pitch', title: 'The ' + api.profile.name + ' Check', thanks: [['rosa', 'Family dinner on Sunday. You’re invited.']], reply: ['Thanks! Check before you sign. Every time.'] });
        S.story.hero = 1; S.scene = null; api.refresh();
      }));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and pin your plan to your My Plan wall', 'myplan');
        var p = P(S), firstTime = !S.finished; S.finished = true;
        if (firstTime) api.profileAdd('closet', 'coop');
        api.profileAdd('plan', { mission: '9-post-secondary', title: 'Pathway Pitch', text: 'Primary: ' + p.name + ' (true cost ' + fmt(trueCost(S.path)) + ', payback about ' + (Math.round(payback(S.path) * 10) / 10) + ' years). Plan B: ' + p.planB + '.' });
        api.profileAdd('finished', '9-post-secondary'); api.refresh();
        await api.say('you', ['At the start, I said: ' + (S.typed.entry || '—') + '.', 'Now I’d say: it depends on true cost, payback, co-op, and loans. Riley’s co-op probably helped a lot.']);
        await api.say('haddad', [S.win ? 'A convinced panel, and a check named after you!' : 'A check named after you! Next time, convince the panel too.', 'Your closet has a new Co-op hoodie, and your My Plan wall has a new page.', 'Now do Step 4 of your project: Plan B and your rationale.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }

  T.mission({
    id: '9-post-secondary', unitLabel: 'CEFL Grade 9 · Post-Secondary Pathways · Project: Pathway Pitch', title: 'Pathway Pitch: The Easy Loan',
    iCan: 'I can work out a pathway’s true cost, payback and loan costs, explain work-integrated learning, and build a plan with a contingency.',
    foot: 'This is a model. Tuition (U of A 2026–27, Portage College) and salaries (ALIS 2023) are real; the 4.5% prime rate, the vet tech tuition, co-op wages and Kira’s academy are samples. The people are made up.',
    bagTip: 'Your Bag holds what you collect: your pathway card and your Pathway notes.',
    realRule: 'Real gives no hints, and the panel still needs 3 strong answers', afterLine: 'Mission complete. Open Menu → Report to show your teacher.',
    chapters: [
      { name: 'Student loans', step: 'Step 1', moment: 'Moment 1: student loans' },
      { name: 'Return on investment', step: 'Step 2', moment: 'Moment 2: return on investment' },
      { name: 'Learning while you earn', step: 'Step 3', moment: 'Moment 3: learning while you earn' },
      { name: 'Plan B', step: 'Step 4', moment: 'Moment 4: getting in, and having a Plan B' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps, guide: 'haddad',
    helpers: function () { return HELPS; }, gossip: gossip, mail: function (S, seed, last) { return mailTask(seed, last); },
    outfit: function (S) { return S.finished ? 'coop' : 'none'; },
    placeObjects: function (api) { api.place('table', 'home', 4, 3, { label: 'Kitchen table' }); api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true }); },
    people: function (S) {
      var out = {}, s = S.story;
      out.haddad = { name: 'Ms. Haddad', role: 'School counsellor', map: 'school', x: 4, y: 3, dir: 'down', look: { base: 3, skin: 's3', hair: 'black', shirt: 'teal', pants: '#3b3f5c' } };
      out.cho = { name: 'Ms. Cho', role: 'Polytechnic', map: 'polytechnic', x: 4, y: 3, dir: 'down', look: { base: 1, skin: 's2', hair: 'black', shirt: 'red', pants: '#3b3f5c' } };
      out.kira = { name: 'Kira', role: 'Rosa’s niece', map: s.kira1 ? 'town' : 'town', x: 12, y: 12, dir: 'down', look: { base: 1, skin: 's3', hair: 'pink', shirt: 'purple', pants: '#3d4a6b' }, hidden: !s.kiraOut };
      out.sterling = { name: 'Ms. Sterling', role: 'EZ Tuition Loans', map: 'quickcash', x: 4, y: 3, dir: 'down', look: { base: 3, skin: 's1', hair: 'blond', shirt: 'grey', pants: '#2f2f38' }, hidden: !s.sterlingOut || s.hero };
      if (S.scene === 'pitch') { out.rosa = { map: 'school', x: 2, y: 4, dir: 'right', wander: 0 }; out.kira = { name: 'Kira', role: 'Rosa’s niece', map: 'school', x: 6, y: 4, dir: 'left', look: out.kira.look }; out.grandpa = { map: 'school', x: 5, y: 3, dir: 'down' }; }
      return out;
    },
    doorOpen: function (id) { return !!{ home: 1, grandpa: 1, school: 1, polytechnic: 1, quickcash: 1, bank: 1, library: 1, servicecanada: 1, jobcentre: 1 }[id]; },
    lockedLine: function (id) { return T.world.building(id).name + ' is closed right now. Try the School.'; },
    talk: function (id, S, api) {
      var s = S.story, done = S.finished;
      var lines = {
        haddad: done ? 'Five questions before you sign anything.' : 'Your next goal is on the gold line at the top.',
        kira: s.hero ? 'Polytechnic, here I come! Co-op and a real student loan.' : s.contract ? 'Recognized by Bright Star. Only by Bright Star.' : s.roi ? 'Ten years to pay back? The man said a month.' : 'Bright Star Game Academy! So shiny!',
        sterling: 'EZ Tuition! Approved in ten minutes! Questions are... not encouraged.', cho: 'Game development diploma: two paid co-op terms.',
        rosa: s.hero ? 'Kira’s on a real path now. Thank you.' : 'My niece got a loan in ten minutes. Is that normal?', sam: 'The federal part of a student loan: zero interest. People don’t believe me.',
        agent: 'Service Canada: we can help with student loan questions.', grandpa: 'I paid for trade school by working nights.', table: 'The kitchen table. Good for big plans.',
        myplan: K.planLine(api)
      };
      return lines[id] || null;
    },
    hud: function (S) {
      var out = [{ label: 'Pathway', value: S.path ? P(S).short : '—' }];
      if (S.path && S.ans['q-roi']) out.push({ label: 'Payback', value: (Math.round(payback(S.path) * 10) / 10) + ' yrs' });
      if (S.pitch) out.push({ label: 'Panel', value: S.pitch.got + ' / 4', title: '3 strong answers convince the panel' });
      return out;
    },
    items: function (S) {
      var it = [];
      if (S.path) it.push({ name: 'Pathway card: ' + P(S).short, icon: P(S).icon, note: P(S).name, view: function () { return pathHTML(S.path) + (S.ans['q-roi'] ? '<p>True cost <b>' + fmt(trueCost(S.path)) + '</b>; extra pay <b>' + fmt(extraPay(S.path)) + '</b> a year; payback about <b>' + (Math.round(payback(S.path) * 10) / 10) + ' years</b>.</p>' : '') + (S.loan != null ? '<p>Student loan needed: <b>' + fmt(S.loan) + '</b>.</p>' : ''); } });
      if (S.story.kira1) it.push({ name: 'Pathway notes', icon: '🔍', note: 'The easy loan', view: function () { return K.notes(notes(S)); } });
      if (S.story.hero) it.push({ name: 'Pathway Pitch medal', icon: '🎓', note: 'The ' + T.api.profile.name + ' Check', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🎓</p><p style="text-align:center"><b>Pathway Pitch</b><br>True cost, payback, credential, work placements, loan rate.</p>'; } });
      return it;
    },
    report: function (S) {
      if (!S.path) return '<p>Not started yet.</p>';
      var p = P(S), h = '<p>Pathway: <b>' + esc(p.name) + '</b> · Plan B: ' + esc(p.planB) + (S.finished ? ' · Pitch: <b>' + S.pitch.got + ' of 4</b> (' + (S.win ? 'the panel was convinced' : 'goal not reached') + ')' : '') + '</p>';
      h += '<p>True cost ' + fmt(trueCost(S.path)) + '; payback about ' + (Math.round(payback(S.path) * 10) / 10) + ' years; loan needed ' + fmt(S.loan || 0) + '. First answer about Alex and Riley: ' + esc(S.typed.entry || '—') + '.</p>';
      var rd = Object.keys(S.rounds); if (rd.length) h += '<h3>Pay for School</h3>' + K.table(rd.map(function (k) { var x = S.rounds[k]; return [k === 'ch2' ? 'Chapter 2' : 'Chapter 3', String(x.score), K.TIER_WORD[x.tier]]; }), ['When', 'Score', 'Result']);
      h += K.wrote(S, [['wil', 'Earning while I learn'], ['rationale', 'My plan and rationale', function () { return p.name; }]]);
      h += '<h3>The easy loan</h3><p>' + (S.story.hero ? 'Solved: Kira switched to a polytechnic program with co-op and a student loan, and the counsellor’s check was named after them.' : S.story.contract ? 'Found the contract’s problems.' : S.story.kira1 ? 'Collecting clues.' : 'Not started.') + '</p>';
      return h;
    },
    test: { scenes: [null, { story: { kiraOut: 1, sterlingOut: 1 } }, { scene: 'pitch', story: { kiraOut: 1 } }], PATHS: PATHS, trueCost: trueCost, extraPay: extraPay, payback: payback, payment: payment, repaid: repaid, coopEarn: coopEarn, kiraTrue: kiraTrue, GAME_CFGS: GAME_CFGS, loanTask: loanTask, roiTask: roiTask, coopTask: coopTask, mailTask: mailTask, HELPS: HELPS, GOSSIP: GOSSIP }
  });
  function notes(S) {
    var s = S.story, li = [];
    if (s.kira1) li.push('<b>Kira:</b> signed up for Bright Star Game Academy ($20,000 a year) with an EZ Tuition loan at 19%, approved in ten minutes.');
    if (s.roi) li.push('<b>Kira’s numbers:</b> true cost ' + fmt(kiraTrue()) + '; at the brochure’s $39,000 salary, payback takes about ' + (Math.round(kiraTrue() / (KIRA.salary - BASE) * 10) / 10) + ' years, before 19% interest.');
    if (s.contract) li.push('<b>The contract:</b> 19% interest, a diploma “recognized by Bright Star” only, no work placements, and no refunds. The lender and the academy share a desk.');
    if (s.pitch) li.push('<b>The Pathway Pitch:</b> Kira cancelled and chose a polytechnic program with two paid co-op terms and a student loan.');
    if (s.hero) li.push('<b>The ' + esc(T.api.profile.name) + ' Check:</b> true cost, payback, credential, work placements, and the loan’s rate, before you sign.');
    return li;
  }
})();
