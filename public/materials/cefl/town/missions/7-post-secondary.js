/* CEFL Town mission: Grade 7 Post-Secondary Pathways — "Two Roads" (companion to the project Two Roads). LO 7-PS.
   Four chapters, one after each project step: Four kinds of pathways (campus tours) · The true cost · Shortages and surpluses ·
   Making the choice. You advise one family whose teen has two roads, and present at Pathways Night.
   Model (MODEL START … END, no DOM): three families, each with two roads; true cost = total tuition + lost earnings ($2,400 a month in
   school full-time, the project's figure; an apprentice loses only the weeks in class). Goal: the family takes your advice, meaning
   at least 3 of 4 first-try answers to their questions at Pathways Night. The Campus Fair game (kit sortRush) counts the visitors you
   help; it never changes the goal.
   Side story, "The road Tyler didn't take": Mo's nephew Tyler quit his electrician apprenticeship for a university program he dislikes.
   Mo's worry (Ch 1) → Tyler's true cost (Ch 2) → the electrician shortage, and who told Tyler "university is the only real choice": Mo
   himself (Ch 3) → at Pathways Night you show both roads fairly; Tyler goes back to his apprenticeship, and the night is named after you (Ch 4).
   Between lessons (HELP START … HELP END): townspeople's own pathway questions, an extra Campus Fair shift, and Town Mail.
   Figures: U of A 2026–27 tuition $729.36 per course (10 a year); Portage College electrician apprenticeship $1,044 (periods 1–3) and
   $1,524 (period 4); Alberta's 2023–2033 forecast (shortages of more than 4,000 nurses and electricians); ALIS 2023 wages. The polytechnic
   and early-learning tuitions are labelled samples. Simplifications: 8 months of school a year; an apprentice spends about 2 months a
   year in class, unpaid (some get EI then); no books, fees, travel or living costs unless the task says so. */
(function () {
  'use strict';

/* MODEL START ── no DOM. Money in cents. ── */
var LOST_PER_MONTH = 240000;                  // full-time work at $15 an hour: 40 h × 4 weeks × $15 (the project's figure)
var UA_COURSE = 72936, UA_YEAR = 10 * UA_COURSE; // U of A 2026–27, a 3-credit course; about 10 a year
var ROADS = {
  uni:      { name: 'University degree', icon: '🎓', school: 'University of Alberta', kind: 'university', years: 4, months: 8, tuition: [UA_YEAR, UA_YEAR, UA_YEAR, UA_YEAR], paid: false, learn: 'Lectures, labs and essays: theory first', sample: false },
  appr:     { name: 'Electrician apprenticeship', icon: '🔧', school: 'Portage College (classes)', kind: 'apprenticeship', years: 4, months: 2, tuition: [104400, 104400, 104400, 152400], paid: true, learn: 'On the job, plus a few weeks of classes a year', sample: false },
  poly:     { name: 'Polytechnic diploma', icon: '🏫', school: 'A polytechnic', kind: 'polytechnic', years: 2, months: 8, tuition: [650000, 650000], paid: false, learn: 'Hands-on labs and projects', sample: true },
  cert:     { name: 'Early learning certificate', icon: '📜', school: 'A college', kind: 'college', years: 1, months: 8, tuition: [450000], paid: false, learn: 'Classes and a practicum in a daycare', sample: true },
  dip:      { name: 'Early learning diploma', icon: '📘', school: 'A college', kind: 'college', years: 2, months: 8, tuition: [450000, 450000], paid: false, learn: 'Classes and two practicums in daycares', sample: true }
};
var FAMILIES = {
  liam:  { teen: 'Liam', who: 'liamdad', parent: 'Liam’s dad', age: 17, wants: 'Liam likes building things and is good at math. He could go to university or become an electrician.',
           roads: ['uni', 'appr'], career: { uni: 'A university career (many options)', appr: 'Electrician' }, wage: { appr: 3841 }, outlook: { appr: 'Shortage: Alberta may be short more than 4,000 electricians (2023–2033 forecast).' } },
  mira:  { teen: 'Mira', who: 'dev', parent: 'Dev (Mira’s big brother)', age: 17, wants: 'Mira, Dev’s sister, wants to build apps. Both roads lead to software developer.',
           roads: ['uni', 'poly'], career: { uni: 'Software developer', poly: 'Software developer' }, wage: { uni: 4455, poly: 4455 }, outlook: {} },
  avery: { teen: 'Avery', who: 'avery', parent: 'Avery', age: 17, wants: 'Avery wants to work with young kids. Both roads lead to early childhood educator.',
           roads: ['cert', 'dip'], career: { cert: 'Early childhood educator', dip: 'Early childhood educator' }, wage: { cert: 1905, dip: 1905 }, outlook: {} }
};
function tuitionOf(rk) { return ROADS[rk].tuition.reduce(function (a, b) { return a + b; }, 0); }
function lostOf(rk) { var r = ROADS[rk]; return r.years * r.months * LOST_PER_MONTH; }
function trueCost(rk) { return tuitionOf(rk) + lostOf(rk); }
var LIAM_YEAR = { tuition: UA_YEAR, lost: 8 * LOST_PER_MONTH, total: UA_YEAR + 8 * LOST_PER_MONTH }; // the workbook's worked example: one year at the U of A, living at home
var TYLER = { uni: trueCost('uni'), appr: trueCost('appr') };
var POINTS_TO_WIN = 3;
/* Sorting tasks. Wrong choices come from the misconceptions: university is the only real choice; tuition is the whole cost. */
var USUAL = [ // a career and its usual pathway (workbook Moment 1)
  ['Registered nurse', 'university', 'A 4-year nursing degree.'], ['Electrician', 'apprenticeship', 'A trade: paid on the job, with classes each year.'], ['Vet tech', 'college', 'A 2-year college diploma.'],
  ['Teacher', 'university', 'A university degree in education.'], ['Plumber', 'apprenticeship', 'A trade, learned on the job.'], ['Early childhood educator', 'college', 'A college certificate or diploma.'],
  ['Carpenter', 'apprenticeship', 'A trade, learned on the job.'], ['Pharmacist', 'university', 'Years of university.'], ['Dental assistant', 'college', 'A short college program.']
];
var BOOTHS = [{ id: 'university', label: 'University', icon: '🎓' }, { id: 'college', label: 'College or polytechnic', icon: '🏫' }, { id: 'apprenticeship', label: 'Apprenticeship', icon: '🔧' }];
var MARKET = [ // shortage or surplus (workbook Moment 3)
  ['300 people apply for 5 jobs at a new store', 'surplus', 'More workers than jobs.'], ['A hospital can’t find enough nurses to fill its shifts', 'shortage', 'More jobs than workers.'],
  ['Builders wait months to hire an electrician', 'shortage', 'More jobs than workers.'], ['80 graduates apply for 2 museum jobs', 'surplus', 'More workers than jobs.'],
  ['Daycares close rooms because they can’t hire staff', 'shortage', 'More jobs than workers.'], ['A store gets 200 résumés for one cashier job', 'surplus', 'More workers than jobs.'],
  ['Farms can’t find enough truck drivers at harvest', 'shortage', 'More jobs than workers.'], ['Every film school grad applies for the same 3 jobs', 'surplus', 'More workers than jobs.']
];
var GAME_CFGS = {
  fair: { kind: 'sortRush', cfg: { id: 'fair', name: 'Campus Fair', scoreWord: 'Visitors helped', win: [7500, 5500], think: 1500, th: [[15, 6], [15, 6]],
    how: '<p><b>Campus Fair.</b> Visitors tell you what they want. Send each one to the right booth: <b>University</b>, <b>College or polytechnic</b>, or <b>Apprenticeship</b>.</p><p class="ct-small">A wrong booth costs a point. So does a visitor who gives up waiting.</p>',
    bins: BOOTHS,
    items: [
      ['I want a 4-year degree', 'university'], ['I want to study theory and do research', 'university'], ['I want to become a teacher', 'university'], ['I want to become a registered nurse', 'university'], ['Lectures, essays and a bachelor’s degree, please', 'university'], ['I want to be a pharmacist someday', 'university'],
      ['I want a 2-year hands-on diploma', 'college'], ['I want to be a vet tech', 'college'], ['I want to be an early childhood educator', 'college'], ['Small classes and labs, about 2 years', 'college'], ['I want a 1-year certificate', 'college'], ['I want a hands-on computing diploma', 'college'],
      ['I want to get paid while I learn', 'apprenticeship'], ['I want to be an electrician', 'apprenticeship'], ['I want to be a plumber', 'apprenticeship'], ['Work on job sites, plus a few weeks of classes a year', 'apprenticeship'], ['I want to become a certified journeyperson', 'apprenticeship'], ['I want to learn a trade from a boss on the job', 'apprenticeship']
    ].map(function (x) { return { t: '“' + x[0] + '”', bin: x[1], icon: ['🧑', '👩', '👨', '🧒', '👧', '🧑‍🦱'][x[0].length % 6], why: { university: 'Degrees, theory and research happen at a university.', college: 'Diplomas and certificates, hands-on and shorter, happen at a college or polytechnic.', apprenticeship: 'Trades are learned on the job, paid, with classes each year.' }[x[1]] }; }) } }
};
/* MODEL END */

/* HELP START ── between lessons, on fresh seeds. Nothing here touches the mission. No DOM. ── */
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function pickN(r, a, n) { var b = a.slice(), out = []; while (out.length < n && b.length) out.push(b.splice(Math.floor(r() * b.length), 1)[0]); return out; }
function usualTask(seed) { var r = RNG(seed * 13 + 1); r(); var out = []; ['university', 'college', 'apprenticeship'].forEach(function (k) { out = out.concat(pickN(r, USUAL.filter(function (x) { return x[1] === k; }), 1)); }); return pickN(r, out.concat(pickN(r, USUAL.filter(function (x) { return out.indexOf(x) < 0; }), 1)), 4); }
function marketTask(seed) { var r = RNG(seed * 17 + 3); r(); var s = pickN(r, MARKET.filter(function (x) { return x[1] === 'shortage'; }), 2), u = pickN(r, MARKET.filter(function (x) { return x[1] === 'surplus'; }), 2); return pickN(r, s.concat(u), 4); }
/* A true-cost task: a program's yearly tuition, years and months in school (sample amounts), and lost earnings at $2,400 a month */
function costTask(seed) {
  var r = RNG(seed * 19 + 5); r();
  var years = [1, 2, 3, 4][Math.floor(r() * 4)], months = 8, tuition = (3000 + Math.floor(r() * 9) * 500) * 100;
  return { years: years, months: months, tuition: tuition, totalTuition: years * tuition, lost: years * months * LOST_PER_MONTH, trueCost: years * tuition + years * months * LOST_PER_MONTH };
}
function periodsTask(seed) { // an apprenticeship's total tuition over its periods (sample amounts)
  var r = RNG(seed * 23 + 7); r();
  var n = [3, 4][Math.floor(r() * 2)], a = (900 + Math.floor(r() * 7) * 50) * 100, last = a + (Math.floor(r() * 6) + 2) * 5000;
  var list = []; for (var i = 0; i < n - 1; i++) list.push(a); list.push(last);
  return { periods: list, total: list.reduce(function (x, y) { return x + y; }, 0) };
}
var MYTHS = [
  { id: 'onlyuni', label: 'Is university the only real choice?', text: 'My neighbour says university is the only real choice. Everything else is second best. True?', opts: [
    ['No. University, college, polytechnic and apprenticeship can all lead to a good career.', 1, 'Right. Different roads, different ways to learn.'], ['Yes. Only university leads to a real career.', 0, 'Electricians, vet techs and many more have great careers without a degree.'], ['Yes, unless you can’t get in.', 0, 'Other roads aren’t backups. They’re roads.']] },
  { id: 'paidlearn', label: 'What an apprenticeship offers', text: 'What does an apprenticeship give you that a university degree doesn’t?', opts: [
    ['Pay while you learn, on a real job site.', 1, 'Yes. Apprentices earn while they train.'], ['A bachelor’s degree.', 0, 'That’s a university thing.'], ['Free tuition forever.', 0, 'Apprentices still pay some tuition for their classes.']] },
  { id: 'change', label: 'Can you change pathways?', text: 'If my grandson starts at college, is he stuck there?', opts: [
    ['No. Pathways are flexible. He could move to a university later, or go back to school after working.', 1, 'Good. I worried for nothing.'], ['Yes. You can never switch.', 0, 'Lots of people switch roads. Credits can even transfer.'], ['Yes, unless he starts over from Grade 10.', 0, 'No need to start over.']] }
];
var CHECK_QS = [
  { id: 'again', label: 'Why check the forecast again', text: 'The job forecast is for 2023 to 2033. Why should a Grade 7 student check it again later?', opts: [
    ['The labour market changes. A shortage now could be a surplus by the time you finish school.', 1, 'Right. Check close to when you choose.'], ['There’s no need. Forecasts never change.', 0, 'They change all the time.'], ['Only adults need to check forecasts.', 0, 'Anyone choosing a pathway should check.']] },
  { id: 'why', label: 'Why check the labour market', text: 'Why look at the labour market before choosing a pathway?', opts: [
    ['To see if there are likely to be jobs when you finish.', 1, 'Yes. It helps, along with what you enjoy.'], ['To find out which school is the most fun.', 0, 'The labour market is about jobs and workers.'], ['So you can skip thinking about your interests.', 0, 'Interests still matter most. The market is one more thing to weigh.']] }
];
var TRADE_QS = [
  { id: 'priya', label: 'A trade-off: vet tech or vet', text: 'Priya chose to be a vet tech, not a vet. What is she giving up?', opts: [
    ['Higher pay and the chance to do surgery. She gains years and much less cost.', 1, 'Right. A trade-off, and it fits her goal.'], ['Nothing at all.', 0, 'Every choice gives something up.'], ['Working with animals.', 0, 'Both roads work with animals every day.']] },
  { id: 'grades', label: 'Why Grades 10–12 matter', text: 'Why do my high school courses and grades matter for post-secondary?', opts: [
    ['Most programs choose students using their high school courses and grades.', 1, 'Yes. Choices in Grades 10–12 open doors.'], ['They don’t. Everyone gets in.', 0, 'Many programs are competitive.'], ['Only for university, never for college or trades.', 0, 'Many college and trade programs have course requirements too.']] },
  { id: 'longer', label: 'What a longer pathway costs', text: 'What might someone give up by choosing a longer pathway?', opts: [
    ['Years of earnings, and more tuition.', 1, 'Yes: time and money.'], ['Nothing. Longer is always better.', 0, 'Longer means more time and money. Sometimes it’s worth it, sometimes not.'], ['Their high school diploma.', 0, 'You keep your diploma.']] }
];
function mailKind(seed, last) { var k = ['usual']; if (last >= 1) k.push('cost'); if (last >= 2) k.push('market'); if (last >= 3) k.push('trade'); return k[RNG(seed * 7 + 3)() * k.length | 0]; }
/* HELP END */

  var T = window.CEFLTown, K = T.kit, esc = T.esc;
  var fmt = K.fmt, fmtW = K.fmtW, step = K.step;
  var FAIR = T.gameKit.sortRush(GAME_CFGS.fair.cfg), FAIR_PAY = 800;

  /* ── State ── */
  function init() { return { v: 1, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), ans: {}, typed: {}, story: {}, fam: null, stamps: {}, fair: {}, costs: {}, night: null, scene: null, finished: false }; }
  function validate(S) { return !!S && S.v === 1 && !!S.typed && !!S.story && !!S.stamps && !!S.fair && !!S.costs && (S.fam === null || !!FAMILIES[S.fam]); }
  function F(S) { return FAMILIES[S.fam]; }
  function roadLines(rk) {
    var r = ROADS[rk];
    return [['Years', r.years + (r.years === 1 ? ' year' : ' years')], ['Months in class a year', r.months + (r.paid ? ' (paid on the job the rest)' : '')], ['Tuition', r.tuition.length > 1 && r.tuition[0] !== r.tuition[r.tuition.length - 1] ? r.tuition.map(fmtW).join(' + ') : fmtW(r.tuition[0]) + (r.years > 1 ? ' a year' : '') + (r.sample ? ' (sample)' : '')], ['How you learn', r.learn]];
  }
  function roadHTML(rk) { var r = ROADS[rk]; return '<div class="ck-card"><span class="ck-big" aria-hidden="true">' + r.icon + '</span><b>' + esc(r.name) + '</b><span class="ct-small">' + esc(r.school) + '</span><div class="ck-kv">' + roadLines(rk).map(function (l) { return '<span>' + l[0] + '</span><b>' + esc(l[1]) + '</b>'; }).join('') + '</div></div>'; }
  function famHTML(S) { var f = F(S); return '<p>' + esc(f.wants) + '</p><div class="ck-grid2">' + f.roads.map(roadHTML).join('') + '</div><p class="ct-small">Lost earnings: $2,400 for each month in school full-time (full-time work at $15 an hour). Amounts marked “sample” are examples; look up real ones for your project.</p>'; }
  function costTable(S) {
    var f = F(S); return K.table(f.roads.map(function (rk) { var c = S.costs[rk]; return [ROADS[rk].icon + ' ' + esc(ROADS[rk].name), c ? fmt(tuitionOf(rk)) : '?', c ? fmt(lostOf(rk)) : '?', c ? '<b>' + fmt(trueCost(rk)) + '</b>' : '?']; }), ['Road', 'Total tuition', 'Lost earnings', 'True cost']);
  }
  function fairOpts(api, seed, help) {
    return { title: 'Campus Fair: ' + (help ? 'an extra shift at the info table' : 'the info table'), name: 'minigame', game: FAIR, seed: seed, seconds: 60, leave: !!help,
      skipNote: 'Skipping is okay. Ms. Haddad will cover the table.',
      tierText: help ? K.payTiers(FAIR_PAY)
        : { great: 'Visitors found their booths fast. Ms. Haddad is impressed.', ok: 'Good shift. Most visitors found their way.', poor: 'Some visitors wandered off. The booths can be confusing!' } };
  }
  async function fairShift(api, S, key, n) {
    if (!S.fair[key]) { var r = await api.minigame(fairOpts(api, S.seed * 41 + n, false)); S.fair[key] = { tier: r.tier, score: r.score }; api.save(); api.hud(); }
    var t = S.fair[key].tier;
    await api.say('haddad', t === 'great' ? 'You know your roads! Every visitor found the right booth.' : t === 'ok' ? 'Thanks for the help. Most people found the right booth.' : t === 'skip' ? 'No problem. I’ve got the table.' : 'It gets busy, doesn’t it? Next time, think: degree, diploma, or paid on the job?');
  }
  function costCalc(api, S, rk, story) {
    var r = ROADS[rk], tl = r.tuition;
    var tuitionHint = tl.length > 1 && tl[0] !== tl[tl.length - 1] ? tl.map(fmt).join(' + ') + '.' : r.years + ' × ' + fmt(tl[0]) + '.';
    return api.calc({ title: 'True cost: ' + r.name, name: 'truecost', noPay: !!story, ref: famHTML(S), refLabel: 'Show both roads',
      intro: '<p>' + esc(r.name) + ' at ' + esc(r.school) + ': ' + r.years + (r.years === 1 ? ' year' : ' years') + ', about <b>' + r.months + ' months a year in class</b>' + (r.paid ? ', <b>paid on the job</b> the rest of the year' : '') + '. Lost earnings: <b>$2,400 a month</b> in class.</p>',
      fields: [{ k: 't', name: 'Total tuition', sub: tl.length > 1 && tl[0] !== tl[tl.length - 1] ? 'add the periods' : r.years + ' × ' + fmtW(tl[0]), ans: tuitionOf(rk), hint: tuitionHint },
        { k: 'l', name: 'Lost earnings', sub: r.years + ' × ' + r.months + ' months × $2,400', ans: lostOf(rk), hint: r.years + ' × ' + r.months + ' × $2,400.' },
        { k: 'c', name: 'True cost', sub: 'total tuition + lost earnings', ans: trueCost(rk), hint: 'Add the total tuition and the lost earnings.', net: 1 }] });
  }

  /* ── Between lessons ── */
  var HELPS = [
    { id: 'ps-usual', who: 'jas', after: 0, pay: 600, label: 'Match careers to pathways', ask: 'My cousin is making a poster about pathways. Can you sort these?', run: async function (api, seed) {
      var t = usualTask(seed); var g = await K.sort(api, { title: 'Help Jas: which pathway?', name: 'help-sort', leave: true, wide: true, intro: 'Each career has a usual pathway. Sort them.', bins: BOOTHS, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      if (g) await api.say('jas', 'Three kinds of roads. My cousin says thanks!'); return g; } },
    { id: 'ps-myth', who: 'grandpa', after: 0, pay: 500, label: 'Pathway myths', ask: 'Help an old man with a question about schools?', run: async function (api, seed) { return K.askGrade(await api.ask('grandpa', MYTHS[seed % MYTHS.length], null)); } },
    { id: 'ps-cost', who: 'sam', after: 1, pay: 1000, label: 'Work out a true cost', ask: 'A customer asked me about the true cost of a program. Can you work it out?', run: async function (api, seed) {
      var t = costTask(seed);
      var g = await api.calc({ title: 'Help Sam: a true cost', name: 'help-cost', intro: '<p>Sam: “A program takes <b>' + t.years + (t.years === 1 ? ' year' : ' years') + '</b>, with <b>' + t.months + ' months</b> of school a year. Tuition is <b>' + fmtW(t.tuition) + '</b> a year (sample). Lost earnings are $2,400 a month in school.”</p>',
        fields: [{ k: 't', name: 'Total tuition', ans: t.totalTuition, hint: t.years + ' × ' + fmtW(t.tuition) + '.' }, { k: 'l', name: 'Lost earnings', ans: t.lost, hint: t.years + ' × ' + t.months + ' × $2,400.' }, { k: 'c', name: 'True cost', ans: t.trueCost, hint: 'Tuition + lost earnings.', net: 1 }] });
      if (g) await api.say('sam', 'Most of it is lost earnings! Who knew? You did.'); return g; } },
    { id: 'ps-periods', who: 'worker', after: 1, pay: 800, label: 'Add up apprenticeship tuition', ask: 'My buddy’s kid is starting an apprenticeship. What’s the tuition in total?', run: async function (api, seed) {
      var t = periodsTask(seed);
      var g = await api.calc({ title: 'Help Mo: apprenticeship tuition', name: 'help-periods', intro: '<p>Mo: “Tuition for each period of the apprenticeship (sample): ' + t.periods.map(fmtW).join(', ') + '. What’s the total? And remember, the kid gets paid on the job.”</p>',
        fields: [{ k: 't', name: 'Total tuition', sub: t.periods.length + ' periods', ans: t.total, hint: 'Add the periods: ' + t.periods.map(fmtW).join(' + ') + '.' }] });
      if (g) await api.say('worker', 'Way less than I thought. And paid the whole time on the job site!'); return g; } },
    { id: 'ps-market', who: 'librarian', after: 2, pay: 800, label: 'Shortage or surplus', ask: 'I’m making a display about jobs. Shortage or surplus? Can you sort these?', run: async function (api, seed) {
      var t = marketTask(seed); var g = await K.sort(api, { title: 'Help Mx. Lin: shortage or surplus?', name: 'help-sort', leave: true, intro: 'A <b>shortage</b> means more jobs than workers. A <b>surplus</b> means more workers than jobs.', bins: [{ id: 'shortage', label: 'Shortage', icon: '📉' }, { id: 'surplus', label: 'Surplus', icon: '📈' }], items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      if (g) await api.say('librarian', 'Perfect for the display. I’ll put your name on it. Small font.'); return g; } },
    { id: 'ps-check', who: 'dev', after: 2, pay: 500, label: 'Why check the job outlook', ask: 'Quick question about job forecasts?', run: async function (api, seed) { return K.askGrade(await api.ask('dev', CHECK_QS[seed % CHECK_QS.length], null)); } },
    { id: 'ps-trade', who: 'avery', after: 3, pay: 500, label: 'Trade-offs', ask: 'Can you help me think about a trade-off?', run: async function (api, seed) { return K.askGrade(await api.ask('avery', TRADE_QS[seed % TRADE_QS.length], null)); } },
    { id: 'ps-fair', who: 'cho', after: 0, pay: FAIR_PAY, label: 'An extra Campus Fair shift', game: true, ask: 'The Campus Fair is busy again, and I’m stuck at the Polytechnic booth. Can you take the info table?', run: async function (api, seed) {
      var r = await api.minigame(fairOpts(api, seed, true)); return K.gameGrade(r); } }
  ];
  var GOSSIP = [
    { id: 'g-lin-0', who: 'librarian', after: -1, lines: ['Pathways Night is coming. Families ask students for advice.', 'Last year someone said “just go to university.” That’s not advice. That’s a slogan.'] },
    { id: 'g-gp-0', who: 'grandpa', after: -1, lines: ['I apprenticed as a mechanic at 17.', 'Got paid to learn. Best deal I ever made. Well, that and your grandma.'] },
    { id: 'g-mo-0', who: 'worker', after: -1, lines: ['My nephew Tyler started a university program this fall.', 'I told him: get a degree, don’t end up like me. He doesn’t call much.'] },
    { id: 'g-sam-1', who: 'sam', after: 0, lines: ['People ask me about student loans for tuition.', 'Nobody asks about lost earnings. That’s the big one.'] },
    { id: 'g-avery-1', who: 'avery', after: 0, lines: ['I toured the college. Tiny classes! Real daycares for practice!', 'The teacher knew everyone’s name by lunch.'] },
    { id: 'g-dev-1', who: 'dev', after: 0, lines: ['Mira wants to build apps. University or polytechnic?', 'Same job at the end. Different roads. My brain hurts.'] },
    { id: 'g-tyler-2', who: 'tyler', after: 1, lines: ['I miss the job site. I was good at it.', 'Now I sit in a lecture hall and think about wiring.'] },
    { id: 'g-haddad-2', who: 'haddad', after: 1, lines: ['A student asked me if college is “for people who can’t get into university.”', 'I said no. It’s for people who want what college offers.'] },
    { id: 'g-joe-3', who: 'banks', after: 2, lines: ['We can’t train electricians fast enough.', 'Every shop in town is asking me for apprentices.'] },
    { id: 'g-mayor-3', who: 'mayor', after: 2, lines: ['The province says Alberta may be short more than 4,000 electricians.', 'And more than 4,000 nurses. Both roads are wide open.'] },
    { id: 'g-mo-3', who: 'worker', after: 2, lines: ['Tyler’s doing badly in his classes. He says he misses the job site.', 'Did I push him the wrong way?'] },
    { id: 'g-tyler-4', who: 'tyler', after: 3, lines: ['Back on the job site! Third-year apprentice now.', 'And no, the university year wasn’t wasted. I learned how to study. Kind of.'] },
    { id: 'g-haddad-4', who: 'haddad', after: 3, lines: ['The {name} Two Roads Night is on the school calendar for every year now.', 'Every road, side by side. Fair.'] },
    { id: 'g-mo-4', who: 'worker', after: 3, lines: ['I told Tyler I’m proud of him. Both roads.', 'And I signed up for a night course. Never too late, right?'] }
  ];
  function gossip(S, api) { return K.gossip(GOSSIP, api); }
  function mailTask(seed, last) {
    var k = mailKind(seed, last), from = 'Ms. Haddad';
    if (k === 'usual') { var t = usualTask(seed); return { label: 'Town Mail: careers and pathways', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, wide: true, intro: 'A letter from Ms. Haddad: “Which pathway is usual for each career?”', bins: BOOTHS, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) }); } }; }
    if (k === 'cost') { var c = costTask(seed); return { label: 'Town Mail: a true cost', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Ms. Haddad:</p><p>“A ' + c.years + '-year program, ' + c.months + ' months a year, ' + fmtW(c.tuition) + ' a year in tuition (sample). Lost earnings: $2,400 a month. What is the true cost?”</p>', fields: [{ k: 'c', name: 'True cost', ans: c.trueCost, hint: c.years + ' × ' + fmtW(c.tuition) + ' + ' + c.years + ' × ' + c.months + ' × $2,400.' }] }); } }; }
    if (k === 'market') { var m = marketTask(seed); return { label: 'Town Mail: shortage or surplus', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, intro: 'A letter from Ms. Haddad: “Shortage or surplus?”', bins: [{ id: 'shortage', label: 'Shortage', icon: '📉' }, { id: 'surplus', label: 'Surplus', icon: '📈' }], items: m.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) }); } }; }
    var q = TRADE_QS[seed % TRADE_QS.length];
    return { label: 'Town Mail: ' + q.label, from: from, pay: 500, run: async function (api) { await api.say(null, 'A letter from Ms. Haddad. She has a question.'); return K.askGrade(await api.ask('haddad', q, null)); } };
  }

  /* ── Steps ── */
  var TOURS = [['ames', 'Dr. Ames at the University'], ['cho', 'Ms. Cho at the Polytechnic'], ['banks', 'Instructor Banks at the Trades Centre']];
  async function tour(api, S, who) {
    var L = {
      ames: [['Welcome to the University! Degrees take about 4 years here.', 'You learn a lot of theory: lectures, labs, essays, research.', 'Nurses, teachers, engineers and many more start here.'], 'University: about 4 years, theory first. A degree.'],
      cho: [['Welcome to the Polytechnic! Most of our diplomas take 2 years.', 'It’s hands-on: labs, projects, real equipment. Colleges are a lot like this too.', 'And our apprentices come here for a few weeks of classes each year.'], 'Polytechnic or college: 1–2 years, hands-on. A diploma or certificate.'],
      banks: [['Welcome to the Trades Centre! An apprenticeship is a job and a school in one.', 'You work for an employer and get paid while you learn. Then a few weeks of classes each year.', 'An electrician apprenticeship takes about 4 years. Then you write an exam to become a certified journeyperson.'], 'Apprenticeship: about 4 years, paid on the job, short classes each year.']
    }[who];
    await api.say(who, L[0]); S.stamps[who] = L[1]; api.toast('Campus stamp (' + Object.keys(S.stamps).length + ' of 3)'); api.save(); api.hud();
  }
  function chapterSteps(ch, S, api) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the School and meet Ms. Haddad, the counsellor', 'haddad');
        await api.say('haddad', ['Hi! You must be ' + api.profile.name + '. I’m Ms. Haddad, the school counsellor.', 'Pathways Night is coming. Families come to get advice about school after high school. That’s called post-secondary.', 'This year, students give the advice. Including you!']);
        await api.say('haddad', ['First, a puzzle. Sam and Jess are both software developers in Calgary.', 'Sam went to university for 4 years. Jess went to a polytechnic for 2 years. They do the same job today.']);
        var i = await api.choose('haddad', 'Who made the better choice?', ['Sam: university is better', 'Jess: shorter is better', 'Maybe both, for different people']);
        S.typed.entry = ['Sam', 'Jess', 'Both, for different people'][i];
        await api.say('haddad', ['Keep that answer. We’ll check it at the end.', 'Now, here’s who needs your advice. Pick one family.']);
        var keys = ['liam', 'mira', 'avery'], j = await api.choose('haddad', 'Which family will you help?', ['Liam: university or an electrician apprenticeship?', 'Mira: university or polytechnic, to build apps?', 'Avery: a 1-year certificate or a 2-year diploma, to work with kids?']);
        S.fam = keys[j]; api.give('Family card: ' + F(S).teen, '🪪', 'haddad'); api.hud();
        await api.say('haddad', ['Great. Before you can compare roads, you need to see them. Tour all three campuses on College Hill.']);
      }));
      a.push(step('tours', async function (api, S) {
        S.tourPhase = true; api.save();
        while (true) {
          var left = TOURS.filter(function (t) { return !S.stamps[t[0]]; }); if (!left.length) break;
          await api.quest('Tour the campuses: ' + left.map(function (t) { return t[1]; }).join(', ') + ' (' + (3 - left.length) + ' of 3 stamps)', left[0][0]);
          await tour(api, S, left[0][0]);
        }
        S.tourPhase = false; api.save();
      }));
      a.push(step('usual', async function (api, S) {
        await api.quest('Show Ms. Haddad your campus stamps', 'haddad');
        await api.say('haddad', 'Three stamps! So which road usually leads where? Try these.');
        await K.sort(api, { title: 'Careers and their usual pathways', name: 'usual', story: true, key: 'q-usual', label: 'Match careers to their usual pathway', ch: 0, wide: true, intro: 'Sort each career by its usual pathway.', bins: BOOTHS,
          items: USUAL.slice(0, 6).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      }));
      a.push(step('fair1', async function (api, S) {
        await api.say('haddad', ['The Campus Fair is today, in the gym. Visitors don’t know which booth to go to.', 'Can you work the info table for a minute?']);
        await fairShift(api, S, 'ch1', 1);
      }));
      a.push(step('hunch', async function (api, S) { // the side story starts
        await api.quest('Mo is at the building site. He looks worried.', 'worker');
        await api.say('worker', ['Hey. You were on College Hill today? Did you see my nephew Tyler?', 'He was an electrician apprentice. Good at it, too. Then he quit and started university.', 'Now he says he’s miserable. And it’s costing a fortune. But university is the best road. Right?']);
        await api.say('you', ['I just learned there are four kinds of roads. I don’t know which one is right for Tyler.', 'But I’ll find out more. I’ll keep notes.']);
        await api.say('worker', 'Thanks, kid. He won’t talk to me about it.');
        S.story.mo1 = 1; api.give('Road notes', '🔍', 'worker'); api.refresh();
      }));
      a.push(step('end1', async function (api, S) {
        await api.quest('Tell Ms. Haddad about Tyler', 'haddad');
        await api.ask('haddad', MYTHS[0], 'q-onlyuni', 'Is university the only real choice?', 0);
        await K.typed(api, { id: 'apprOffers', title: 'In your own words', prompt: 'Name one thing an apprenticeship offers that university does not. Why might that matter to someone?' });
        await api.say('haddad', ['Good thinking. Now do Step 1 of your project: pick a career and two roads.', 'Next time: the true cost. It’s bigger than tuition. A lot bigger.']);
      }));
    }
    if (ch === 1) {
      a.push(step('liamyear', async function (api, S) {
        await api.quest('Sam at the bank wants to show you something about cost', 'sam');
        await api.say('sam', ['Here’s a secret. Tuition is only part of what school costs.', 'While you’re in school full-time, you’re not earning. That’s called lost earnings. Add it to tuition and you get the true cost.', 'Try one year at the University of Alberta, living at home.']);
        var g = await api.calc({ title: 'One year at the U of A (2026–27)', name: 'liamyear', noPay: true, intro: '<p>A full year is about <b>10 courses</b> at <b>$729.36</b> each. School runs about <b>8 months</b>. Full-time work at $15 an hour is about <b>$2,400 a month</b>.</p>',
          fields: [{ k: 't', name: 'Tuition for one year', sub: '10 × $729.36', ans: LIAM_YEAR.tuition, hint: '10 × 729.36.' }, { k: 'l', name: 'Lost earnings', sub: '8 months × $2,400', ans: LIAM_YEAR.lost, hint: '8 × 2,400.' }, { k: 'c', name: 'True cost for one year', sub: 'tuition + lost earnings', ans: LIAM_YEAR.total, hint: 'Add them.', net: 1 }] });
        api.record('q-liamyear', 'True cost of one year at university', 1, g === 'first');
        await api.say('sam', ['$26,493.60 for one year, before books and bus fare! And look: the lost earnings are bigger than the tuition.', 'Most of the true cost is hidden.']);
      }));
      a.push(step('famcost', async function (api, S) {
        var f = F(S);
        await api.quest('Go to the kitchen table and work out the true cost of both roads for ' + f.teen, 'table');
        for (var i = 0; i < f.roads.length; i++) {
          var rk = f.roads[i]; if (S.costs[rk]) continue;
          var g = await costCalc(api, S, rk, true);
          api.record('q-cost-' + rk, 'True cost: ' + ROADS[rk].name, 1, g === 'first');
          S.costs[rk] = g; api.save();
        }
        var A = f.roads[0], B = f.roads[1], lo = trueCost(A) <= trueCost(B) ? A : B, hi = lo === A ? B : A;
        var g2 = await api.calc({ title: 'Which road costs less?', name: 'costdiff', noPay: true, ref: costTable(S), refLabel: 'Show your true costs', intro: '<p>' + esc(ROADS[lo].name) + ' has the lower true cost. By how much?</p>',
          fields: [{ k: 'd', name: 'Difference in true cost', sub: ROADS[hi].name + ' − ' + ROADS[lo].name, ans: trueCost(hi) - trueCost(lo), hint: fmt(trueCost(hi)) + ' − ' + fmt(trueCost(lo)) + '.' }] });
        api.record('q-costdiff', 'Which road costs less, and by how much', 1, g2 === 'first');
        api.give('True cost table', '🧮', 'table'); api.hud();
      }));
      a.push(step('tyler2', async function (api, S) { // clue 1, checked with this chapter's skill
        S.story.tylerOut = 1; api.refresh();
        await api.quest('Find Tyler at the University', 'tyler');
        await api.say('tyler', ['You’re the one my uncle sent? Fine. Sit.', 'Everyone said university was the only real choice. So I quit my apprenticeship. Now I’m paying tuition AND I don’t get paid.']);
        await api.say('you', ['Let me show you something. One year here costs about $26,493.60 in true cost. Four years is ' + fmt(TYLER.uni) + '.', 'Your apprenticeship’s true cost was about ' + fmt(TYLER.appr) + '. For all four years.']);
        await api.ask('tyler', { text: 'Wait. The apprenticeship had tuition too. Why is its true cost so much lower?', opts: [['You’re paid while you learn, so you only lose earnings during the weeks in class.', 1, 'Huh. I never thought of it that way.'], ['Because apprenticeships are worse, so they cost less.', 0, 'Cost isn’t the same as worth. It’s about lost earnings.'], ['Because tuition is the whole cost.', 0, 'Tuition is only part. Lost earnings are the hidden part.']] }, 'story-tyler', 'Why an apprenticeship’s true cost is lower', 1);
        await api.say('tyler', 'So I gave up getting paid... to pay. Huh.');
        S.story.tyler = 1; api.toast('Added to your Road notes: Tyler’s true cost'); api.save();
      }));
      a.push(step('end2', async function (api, S) {
        await api.quest('Tell Ms. Haddad what you found', 'haddad');
        await K.typed(api, { id: 'hidden', title: 'In your own words', prompt: 'Most of the true cost is hidden. What is the hidden part, and why can it be bigger than tuition?' });
        await api.say('haddad', ['Exactly. Now do Step 2 of your project: the true cost of both roads.', 'Next time: jobs. Will there be work when you finish? That’s the labour market.']);
      }));
    }
    if (ch === 2) {
      a.push(step('market', async function (api, S) {
        await api.quest('Mx. Lin at the library has the job forecast', 'librarian');
        await api.say('librarian', ['The labour market is all the people looking for work and all the employers looking for workers.', 'A shortage means more jobs than workers. A surplus means more workers than jobs.', 'Alberta’s forecast for 2023 to 2033 says we may be short more than 4,000 nurses and more than 4,000 electricians.']);
        await K.sort(api, { title: 'Shortage or surplus?', name: 'market', story: true, key: 'q-market', label: 'Shortage or surplus', ch: 2, intro: 'Sort each one.', bins: [{ id: 'shortage', label: 'Shortage', icon: '📉' }, { id: 'surplus', label: 'Surplus', icon: '📈' }],
          items: MARKET.slice(0, 6).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
        await api.ask('librarian', CHECK_QS[0], 'q-again', 'Why check the forecast again later', 2);
      }));
      a.push(step('fair2', async function (api, S) {
        await api.quest('The Campus Fair is back at the School. Ms. Haddad needs you.', 'haddad');
        await fairShift(api, S, 'ch3', 3);
      }));
      a.push(step('tyler3', async function (api, S) { // clue 2 (the shortage) and the source (Mo)
        await api.quest('Tell Tyler what the forecast says', 'tyler');
        await api.say('you', ['Tyler, the forecast says Alberta may be short more than 4,000 electricians.', 'That means jobs waiting for people like you.']);
        await api.say('tyler', ['I knew the shop was busy. I didn’t know it was that busy.', 'You want to know who told me university was the only real choice? My uncle. Mo.', 'He said, “Don’t end up like me.” He meant well. But I liked ending up like him.']);
        S.story.shortage = 1; S.story.source = 1; api.toast('Added to your Road notes: who told Tyler'); api.save();
        await api.quest('Go talk to Mo at the building site', 'worker');
        await api.say('worker', ['He told you? Yeah. It was me.', 'I never went past high school. I thought university was the only way to do better than me.', 'But I love building. Why did I tell him to run from it?']);
        await api.say('you', ['Both roads can lead to a good career. You just have to look at both fairly.', 'Come to Pathways Night. Bring Tyler.']);
        await api.say('worker', 'I’ll be there. Front row.');
      }));
      a.push(step('end3', async function (api, S) {
        await api.quest('Check in with Ms. Haddad', 'haddad');
        await api.say('haddad', ['Now do Step 3 of your project: the job outlook for your career.', 'Next time: Pathways Night! You’ll make a choice and defend it. Bring your true cost table.']);
      }));
    }
    if (ch === 3) {
      a.push(step('priya', async function (api, S) {
        await api.quest('Ms. Haddad has one last example before Pathways Night', 'haddad');
        await api.say('haddad', ['Priya loves animals. She could be a vet (many years of university, very hard to get in) or a vet tech (a 2-year diploma).', 'Both work with animals every day.']);
        await api.ask('haddad', TRADE_QS[0], 'q-priya', 'A trade-off: vet tech or vet', 3);
        await api.ask('haddad', TRADE_QS[1], 'q-grades', 'Why Grades 10–12 matter', 3);
      }));
      a.push(step('decide', async function (api, S) {
        var f = F(S);
        await api.quest('Go home and decide which road to recommend for ' + f.teen, 'table');
        await K.pick(api, { id: 'decide', title: 'Our recommendation for ' + f.teen, name: 'pickroad', intro: esc(f.wants) + ' Weigh everything, then pick one road to recommend.',
          options: f.roads.map(function (rk) { var r = ROADS[rk]; return { k: rk, title: r.name, icon: r.icon, lines: [['Time', r.years + (r.years === 1 ? ' year' : ' years')], ['True cost', fmt(trueCost(rk))], ['How you learn', r.learn], ['Paid while learning?', r.paid ? 'Yes' : 'No'], ['Leads to', f.career[rk]]].concat(f.wage[rk] ? [['Average wage', fmt(f.wage[rk]) + '/h (2023)']] : []).concat(f.outlook[rk] ? [['Outlook', f.outlook[rk]]] : []) }; }),
          pickText: 'Recommend this', reasonPrompt: 'Our main reason:', tradeoff: 'The trade-off (what ' + f.teen + ' gives up on this road), and why it’s OK:', footNote: 'There’s no wrong road here. You need a reason and a trade-off.' });
        api.give('Recommendation card', '📝', 'table'); api.hud();
      }));
      a.push(step('night', async function (api, S) { // the hero beat: Pathways Night
        var f = F(S); S.scene = 'night'; api.refresh();
        await api.quest('Pathways Night is starting at the Community Centre!', 'haddad');
        api.fx.face('all');
        await api.say('haddad', ['Welcome to Pathways Night! Families, ask our students anything.', api.profile.name + ' is advising ' + (S.fam === 'avery' ? 'Avery' : f.parent) + '.']);
        if (!S.night) S.night = { got: 0, asked: {} };
        var pick = S.typed.decide.pick, other = f.roads.filter(function (k) { return k !== pick; })[0], who = FAMILIES[S.fam].who;
        var Qs = [
          ['q-night-worth', who, { text: 'Why is ' + ROADS[pick].name.toLowerCase() + ' worth the cost?', opts: [['We compared the true cost, the time, how you learn and the jobs, and this road fits ' + f.teen + ' best.', 1, 'That’s a real reason. Thank you.'], ['Because it has the lowest tuition.', 0, 'Tuition is only part of the cost. And cost isn’t everything.'], ['Because university is always best.', 0, 'Is it? Both roads can lead to a good career.']] }],
          ['q-night-change', who, { text: 'What if ' + f.teen + ' changes their mind later?', opts: [['Pathways are flexible. They can switch roads or go back to school later.', 1, 'That takes some pressure off.'], ['Then the money is wasted and they’re stuck.', 0, 'People switch roads all the time. Skills and some credits carry over.'], ['They can never change once they start.', 0, 'Pathways are flexible.']] }],
          ['q-night-in', who, { text: 'What if ' + f.teen + ' doesn’t get in?', opts: [['Grades 10–12 courses and grades matter. And there’s another good road, or they can upgrade and apply again.', 1, 'Good to know there’s a plan B.'], ['Then they can’t have any career.', 0, 'There’s always another road.'], ['Everyone who applies gets in.', 0, 'Many programs are competitive.']] }],
          ['q-night-other', 'worker', { text: 'Is ' + ROADS[other].name.toLowerCase() + ' a bad choice, then?', opts: [['No. Both roads can lead to a good career. They have different trade-offs.', 1, 'Huh. Both roads. I wish I’d heard that sooner.'], ['Yes. It’s second best.', 0, 'That’s the myth Tyler heard. Is it true?'], ['Yes. Only the cheaper road is good.', 0, 'Cheaper isn’t the same as better. It’s about fit and trade-offs.']] }]
        ];
        for (var i = 0; i < Qs.length; i++) {
          var q = Qs[i]; if (S.night.asked[q[0]]) continue;
          var r = await api.ask(q[1], q[2], q[0], 'Pathways Night: ' + q[2].text, 3);
          S.night.asked[q[0]] = 1; if (r.first) { S.night.got++; api.fx.rise(q[1], '+1 convinced'); }
          api.save(); api.hud();
        }
        var won = S.night.got >= POINTS_TO_WIN;
        await api.say(who, won ? ['You convinced us. We’re going with ' + ROADS[pick].name.toLowerCase() + '.', 'And we know what we’re giving up, and why it’s okay.'] : ['Thank you. We’re not sure yet. We need a few more answers.', 'You can replay this chapter from the Menu and try again.']);
        S.win = won; api.save();
        await api.say('tyler', ['Can I say something? I quit my apprenticeship because I thought university was the only real road.', api.profile.name + ' showed me the true cost of both. And the shortage. And that switching back isn’t failing.', 'I’m going back to the job site.']);
        await api.say('worker', ['That’s my nephew. I’m proud of you, Tyler. Either road. I mean it.', 'And I owe this kid a thank-you.']);
        S.story.night = 1; api.save();
        await K.hero(api, { who: 'haddad', lines: ['Every road side by side, fairly. That’s what tonight should always be.', 'So from now on, the school will hold this every year. The ' + api.profile.name + ' Two Roads Night.'],
          medal: 'Two Roads medal', icon: '🛣️', kicker: 'Pathways Night', title: 'The ' + api.profile.name + ' Two Roads Night', reply: ['Thanks, everyone! Check both roads. Every time.'] });
        S.story.hero = 1; S.scene = null; api.refresh();
      }));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and pin your plan to your My Plan wall', 'myplan');
        var f = F(S), pick = S.typed.decide.pick, firstTime = !S.finished; S.finished = true;
        if (firstTime) api.profileAdd('closet', 'campus');
        api.profileAdd('plan', { mission: '7-post-secondary', title: 'Two Roads', text: 'For ' + f.teen + ', I recommended ' + ROADS[pick].name.toLowerCase() + ' (true cost ' + fmt(trueCost(pick)) + ').' });
        api.profileAdd('finished', '7-post-secondary'); api.refresh();
        await api.say('you', ['Remember Sam and Jess, the two software developers? I said: ' + (S.typed.entry || 'I wasn’t sure') + '.', 'Now I think both made a good choice, for different reasons.']);
        await api.say('haddad', [S.win ? 'Your family took your advice. And a night named after you!' : 'A night named after you! And next time, go for a convinced family.', 'Your closet has a new Campus hoodie, and your My Plan wall has a new page.', 'Now do Step 4 of your project: decide, and name the trade-off.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }

  /* ── Register ── */
  T.mission({
    id: '7-post-secondary', unitLabel: 'CEFL Grade 7 · Post-Secondary Pathways · Project: Two Roads', title: 'Two Roads: Pathways Night',
    iCan: 'I can compare two post-secondary pathways by true cost, time, how you learn and jobs, and name the trade-off.',
    foot: 'This is a model. U of A and Portage College tuition are real (2026–27); amounts marked “sample” are examples. Lost earnings use $2,400 a month. The people are made up.',
    bagTip: 'Your Bag holds what you collect: your family card, campus stamps, your true cost table and your Road notes.',
    realRule: 'Real gives no hints, and the family still needs 3 convincing answers',
    afterLine: 'Mission complete. Open Menu → Report to show your teacher.',
    chapters: [
      { name: 'Four kinds of pathways', step: 'Step 1', moment: 'Moment 1: four kinds of pathways' },
      { name: 'The true cost', step: 'Step 2', moment: 'Moment 2: the true cost' },
      { name: 'Shortages and surpluses', step: 'Step 3', moment: 'Moment 3: shortages and surpluses' },
      { name: 'Making the choice', step: 'Step 4', moment: 'Moment 4: making the choice' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps, guide: 'haddad',
    helpers: function () { return HELPS; }, gossip: gossip, mail: function (S, seed, last) { return mailTask(seed, last); },
    outfit: function (S) { return S.finished ? 'campus' : 'none'; },
    placeObjects: function (api) { api.place('table', 'home', 4, 3, { label: 'Kitchen table' }); api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true }); },
    people: function (S) {
      var out = {};
      out.haddad = { name: 'Ms. Haddad', role: 'School counsellor', map: 'school', x: 4, y: 3, dir: 'down', look: { base: 3, skin: 's3', hair: 'black', shirt: 'teal', pants: '#3b3f5c' } };
      out.ames = { name: 'Dr. Ames', role: 'University', map: 'university', x: 4, y: 3, dir: 'down', look: { base: 2, skin: 's5', hair: 'grey', shirt: 'blue', pants: '#2f2f38' } };
      out.cho = { name: 'Ms. Cho', role: 'Polytechnic', map: 'polytechnic', x: 4, y: 3, dir: 'down', look: { base: 1, skin: 's2', hair: 'black', shirt: 'red', pants: '#3b3f5c' } };
      out.banks = { name: 'Instructor Banks', role: 'Trades Centre', map: 'trades', x: 4, y: 3, dir: 'down', look: { base: 5 } };
      out.tyler = { name: 'Tyler', role: 'Mo’s nephew', map: S.story.hero ? 'trades' : 'university', x: S.story.hero ? 6 : 2, y: 4, dir: S.story.hero ? 'left' : 'right', look: { base: 0, skin: 's4', hair: 'brown', shirt: 'grey', pants: '#2f3a5c' }, hidden: !S.story.tylerOut };
      out.liamdad = { name: 'Liam’s dad', role: 'Parent', map: 'community', x: 6, y: 3, dir: 'down', look: { base: 2, skin: 's1', hair: 'brown', shirt: 'green', pants: '#3b3f5c' }, hidden: S.scene !== 'night' || S.fam !== 'liam' };
      if (S.scene === 'night') { // the families stand along row 3; row 4 stays open
        out.haddad = { name: 'Ms. Haddad', role: 'School counsellor', map: 'community', x: 4, y: 3, dir: 'down', look: out.haddad.look };
        out.tyler = { name: 'Tyler', role: 'Mo’s nephew', map: 'community', x: 1, y: 3, dir: 'down', look: out.tyler.look };
        out.worker = { map: 'community', x: 2, y: 3, dir: 'down' };
        if (S.fam === 'mira') out.dev = { map: 'community', x: 6, y: 3, dir: 'down' };
        if (S.fam === 'avery') out.avery = { map: 'community', x: 6, y: 3, dir: 'down' };
        out.grandpa = { map: 'community', x: 7, y: 3, dir: 'down' };
      }
      return out;
    },
    doorOpen: function (id) { return !!{ home: 1, grandpa: 1, school: 1, university: 1, polytechnic: 1, trades: 1, community: 1, library: 1, bank: 1, townhall: 1, jobcentre: 1 }[id]; },
    lockedLine: function (id) { return T.world.building(id).name + ' is closed tonight. Everyone is on College Hill.'; },
    talk: function (id, S, api) {
      if (S.tourPhase && (id === 'ames' || id === 'cho' || id === 'banks') && !S.stamps[id]) {
        tour(api, S, id).then(function () { var left = TOURS.filter(function (t) { return !S.stamps[t[0]]; }); api.questText('Tour the campuses: ' + (3 - left.length) + ' of 3 stamps. Keep going.'); });
        return true;
      }
      var s = S.story, done = S.finished;
      var lines = {
        haddad: done ? 'Every road, side by side. Come back anytime.' : 'Your next goal is on the gold line at the top.',
        ames: 'Theory, research and a lot of reading. Some people love it. Is it you?', cho: 'Hands-on, two years, real equipment. Want to see the robot arm? It waves.',
        banks: 'Paid to learn. Best deal in town. We need more apprentices, too.',
        tyler: s.hero ? 'Third-year apprentice! Back where I belong.' : s.source ? 'Uncle Mo meant well. I know that.' : s.tyler ? 'Paying to not get paid. Still thinking about that.' : 'Lecture in ten minutes. Yay.',
        worker: s.hero ? 'Night course starts Monday. Wish me luck!' : s.source ? 'I’ll be at Pathways Night. Front row.' : s.mo1 ? 'Did you see Tyler? Tell him to call his uncle.' : 'Hard hats on! This site is busy.',
        sam: 'Tuition is the price tag. True cost is the real bill.', librarian: 'The job forecast is on the second shelf. It’s a page-turner. Sort of.',
        grandpa: 'Paid to learn! Back in my day, that was called an apprenticeship. Still is.',
        avery: S.fam === 'avery' ? 'Certificate or diploma? You tell me!' : 'Kids are the best. They tell you exactly what they think.',
        dev: S.fam === 'mira' ? 'Mira says hi. She’s already building an app. It’s a calculator. For cats.' : 'Payday is the best day. Pizza day is second.',
        rosa: 'I paid off my student loan last year. Cake was eaten.',
        table: 'The kitchen table. Good for big decisions.',
        myplan: K.planLine(api)
      };
      return lines[id] || null;
    },
    hud: function (S) {
      var out = [{ label: 'Advising', value: S.fam ? F(S).teen : '—' }];
      out.push({ label: 'Stamps', value: Object.keys(S.stamps).length + ' / 3', title: 'Campus tour stamps' });
      if (S.night) out.push({ label: 'Convinced', value: S.night.got + ' / 4', title: '3 convincing answers and the family takes your advice' });
      return out;
    },
    items: function (S) {
      var it = [];
      if (S.fam) it.push({ name: 'Family card: ' + F(S).teen, icon: '🪪', note: 'Two roads', view: function () { return famHTML(S); } });
      if (Object.keys(S.stamps).length) it.push({ name: 'Campus stamps', icon: '🏛️', note: Object.keys(S.stamps).length + ' of 3', view: function () { return K.notes(Object.keys(S.stamps).map(function (k) { return esc(S.stamps[k]); })); } });
      if (Object.keys(S.costs).length) it.push({ name: 'True cost table', icon: '🧮', note: 'Both roads', view: function () { return costTable(S); } });
      if (S.typed.decide) it.push({ name: 'Recommendation card', icon: '📝', note: ROADS[S.typed.decide.pick].name, view: function () { var d = S.typed.decide; return '<p><b>We recommend:</b> ' + esc(ROADS[d.pick].name) + '</p><p><b>Main reason:</b> ' + esc(d.reason) + '</p><p><b>The trade-off, and why it’s OK:</b> ' + esc(d.tradeoff) + '</p>'; } });
      if (S.story.mo1) it.push({ name: 'Road notes', icon: '🔍', note: 'The road Tyler didn’t take', view: function () { return K.notes(notes(S)); } });
      if (S.story.hero) it.push({ name: 'Two Roads medal', icon: '🛣️', note: 'The ' + T.api.profile.name + ' Two Roads Night', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🛣️</p><p style="text-align:center"><b>Two Roads</b><br>For showing every road fairly: true cost, time, how you learn, and jobs.</p>'; } });
      return it;
    },
    report: function (S) {
      if (!S.fam) return '<p>Not started yet.</p>';
      var f = F(S), h = '<p>Advised: <b>' + esc(f.teen) + '</b> (' + f.roads.map(function (k) { return esc(ROADS[k].name); }).join(' or ') + ')' + (S.finished ? ' · Pathways Night: <b>' + S.night.got + ' of 4</b> convincing answers (' + (S.win ? 'the family took the advice' : 'goal not reached') + ')' : '') + '</p>';
      h += '<p>First answer about Sam and Jess: ' + esc(S.typed.entry || '—') + '.</p>';
      if (Object.keys(S.costs).length) h += '<h3>True cost</h3>' + costTable(S);
      var fr = Object.keys(S.fair);
      if (fr.length) h += '<h3>Campus Fair</h3>' + K.table(fr.map(function (k) { var x = S.fair[k]; return [k === 'ch1' ? 'Chapter 1' : 'Chapter 3', String(x.score), K.TIER_WORD[x.tier]]; }), ['When', 'Visitors helped', 'Result']);
      h += K.wrote(S, [['apprOffers', 'What an apprenticeship offers'], ['hidden', 'The hidden part of the true cost'], ['decide', 'Recommendation for ' + f.teen, function (k) { return ROADS[k].name; }]]);
      h += '<h3>The road Tyler didn’t take</h3><p>' + (S.story.hero ? 'Solved: showed both roads fairly; Tyler went back to his apprenticeship, and the night was named after them.' : S.story.source ? 'Found out who told Tyler university was the only road.' : S.story.mo1 ? 'Collecting clues.' : 'Not started.') + '</p>';
      return h;
    },
    test: { scenes: [null, { story: { tylerOut: 1 } }, { scene: 'night', fam: 'liam', story: { tylerOut: 1 } }, { scene: 'night', fam: 'avery', story: { tylerOut: 1 } }, { story: { tylerOut: 1, hero: 1 } }],
      ROADS: ROADS, FAMILIES: FAMILIES, tuitionOf: tuitionOf, lostOf: lostOf, trueCost: trueCost, LIAM_YEAR: LIAM_YEAR, TYLER: TYLER, GAME_CFGS: GAME_CFGS, usualTask: usualTask, marketTask: marketTask, costTask: costTask, periodsTask: periodsTask, mailTask: mailTask, HELPS: HELPS, GOSSIP: GOSSIP }
  });
  function notes(S) {
    var s = S.story, li = [];
    if (s.mo1) li.push('<b>Mo:</b> his nephew Tyler quit an electrician apprenticeship for university, and is miserable. “University is the best road. Right?”');
    if (s.tyler) li.push('<b>Tyler’s true cost:</b> university, 4 years: ' + fmt(TYLER.uni) + '. The apprenticeship, all 4 years: ' + fmt(TYLER.appr) + ', because apprentices are paid while they learn.');
    if (s.shortage) li.push('<b>The forecast:</b> Alberta may be short more than 4,000 electricians (2023–2033). Tyler’s road had jobs waiting.');
    if (s.source) li.push('<b>Who told him:</b> Mo. “Don’t end up like me.” He meant well, but he only looked at one road.');
    if (s.night) li.push('<b>Pathways Night:</b> both roads, side by side. Tyler is going back to the job site.');
    if (s.hero) li.push('<b>The ' + esc(T.api.profile.name) + ' Two Roads Night:</b> every year, every road, fairly.');
    return li;
  }
})();
