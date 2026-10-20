/* CEFL Town mission: Grade 9 Careers and the Labour Market — "Get Hired" (companion to the project Get Hired). LO 9-LM.
   Four chapters, one after each project step: Automation and globalization (pick a posting) · Where is the market moving? (growing,
   stable, declining) · Your résumé and brand · Interviews and self-advocacy (STAR). The Job Fair is coming; you apply for a posting.
   Model (MODEL START … END, no DOM): four town postings with requirements, assets and skills; sorting facts; the workbook's dated
   data (Alberta health care employment up about 15% from 2022 to 2025, Canada 9%; construction −3.1% and wholesale/retail +1.5% from
   May 2025 to May 2026; Government of Canada Job Bank, May 2026). Goal: the employer offers you the job at the mock interview (at
   least 3 of 4 first-try answers). The Résumé Rush game (kit spotRush) counts weak lines caught; it never changes the goal.
   Side story, "The copy-paste résumés": Jas has sent 30 applications and heard nothing (Ch 1) → employers' stacks are all the same
   words (Ch 2) → Jas's résumé came from the ResumeRocket kiosk: generic, no evidence, not tailored (Ch 3) → at the Job Fair you run a
   résumé clinic; Jas gets hired, and the fair's clinic table is named after you (Ch 4).
   Between lessons (HELP START … HELP END): townspeople's own job-search questions, an extra Résumé Rush, and Town Mail. */
(function () {
  'use strict';

/* MODEL START ── no DOM. ── */
var POSTINGS = {
  camp:    { title: 'Junior day-camp leader', biz: 'Community Centre', boss: 'osei', icon: '⛺', must: ['Age 15 or older', 'Available weekdays in July and August'], assets: ['First Aid certificate', 'Experience with children'], skills: ['Works well with children', 'Energetic', 'Reliable'] },
  grocer:  { title: 'Grocery clerk', biz: 'Valley Market', boss: 'huang', icon: '🛒', must: ['Age 15 or older', 'Available weekends'], assets: ['Customer service experience'], skills: ['Friendly', 'Counts change accurately', 'Team player'] },
  library: { title: 'Library page', biz: 'Riverbend Library', boss: 'librarian', icon: '📚', must: ['Age 14 or older', 'Two evenings a week'], assets: ['A love of reading'], skills: ['Organized', 'Detail-oriented', 'Works quietly'] },
  bike:    { title: 'Bike shop helper', biz: 'Spoke & Chain Bikes', boss: 'bea', icon: '🚲', must: ['Age 15 or older', 'Available Saturdays'], assets: ['Basic bike repair'], skills: ['Problem solving', 'Customer service'] }
};
var POSTING_KEYS = Object.keys(POSTINGS);
var FORCES = [{ id: 'auto', label: 'Automation', icon: '🤖' }, { id: 'glob', label: 'Globalization', icon: '🌍' }];
var FORCE_ITEMS = [['A store uses self-checkout machines', 'auto'], ['An Alberta company hires a programmer who lives in another country', 'glob'], ['A factory uses robots to weld car parts', 'auto'], ['Haul trucks at a mine drive themselves', 'auto'], ['An Alberta farm sells its grain around the world', 'glob'], ['A call centre in another country answers a bank’s calls', 'glob'], ['Software sorts job applications', 'auto'], ['A Calgary designer works for a client in Japan', 'glob']];
var TRENDS = [{ id: 'grow', label: 'Growing', icon: '📈' }, { id: 'stable', label: 'Stable', icon: '➖' }, { id: 'decl', label: 'Declining', icon: '📉' }, { id: 'more', label: 'Need more years of data', icon: '❓' }];
var TREND_ITEMS = [ // workbook Moment 2, and generic patterns (made-up industries, no real numbers)
  ['Alberta health care: jobs up about 15% from 2022 to 2025', 'grow', 'Three years of growth is a trend.'], ['Alberta construction: jobs down 3.1% in one year (2025–2026)', 'more', 'One year isn’t enough to call it declining. Check more years and the forecast.'],
  ['Industry X: openings rose every year for 5 years', 'grow', 'Rising year after year is a trend.'], ['Industry Y: openings fell every year for 6 years', 'decl', 'Falling year after year is a trend.'],
  ['Industry Z: openings went up and down a little for 5 years', 'stable', 'Small ups and downs, no trend.'], ['Industry W: openings dropped one month', 'more', 'One month is a blip, not a trend.']
];
var REQ_LINE = ['Must be 15+', 'Available weekends', 'Customer service experience an asset', 'First Aid an asset', 'Must have a valid email'];
var REQ_ITEMS = [['Must be 15 or older', 'must'], ['Available weekends', 'must'], ['Customer service experience an asset', 'asset'], ['First Aid an asset', 'asset'], ['Must be able to lift 10 kg', 'must'], ['Bilingual (English and French) an asset', 'asset']];
var STAR = [['S', 'Situation: “At soccer practice, two kids kept arguing over who got to be goalie.”'], ['T', 'Task: “As assistant coach, I needed to keep practice fun and fair.”'], ['A', 'Action: “I made a rotation chart so everyone got a turn, and explained it to the team.”'], ['R', 'Result: “The arguing stopped, and more kids tried new positions.”']];
var POINTS_TO_WIN = 3;
var GAME_CFGS = {
  rush: { kind: 'spotRush', cfg: { id: 'rush', name: 'Résumé Rush', scoreWord: 'Weak lines caught', every: [1500, 1200], life: [5200, 4000], think: 1300, th: [[10, 4], [10, 4]],
    how: '<p><b>Résumé Rush.</b> Résumé lines pop up from the Job Fair stack. Tap the <b>weak</b> ones: vague, unprofessional, or not about the job. Leave the strong ones.</p><p class="ct-small">Tapping a strong line costs 2 points. A weak line you miss costs 1.</p>',
    cards: [
      ['I did stuff at the food bank', 1, 'Vague. What did you do?'], ['Responsable and hard worker', 1, 'A spelling mistake.'], ['Favourite food: pizza', 1, 'Not about the job.'], ['Email: partyanimal99@mail.com', 1, 'Unprofessional email.'],
      ['Skills: Microsoft Word, probably', 1, 'Not confident or specific.'], ['Hobbies: sleeping', 1, 'Doesn’t help your case.'], ['Team player, hard worker, detail-oriented (no examples)', 1, 'Buzzwords with no evidence.'], ['References: my mom', 1, 'Family isn’t a reference.'],
      ['Led warm-ups for 12 players each week', 0, '', 'Specific and active.'], ['First Aid certificate (2026)', 0, '', 'A real credential.'], ['Volunteer, Riverbend Library, 2025–2026', 0, '', 'Clear experience.'], ['Sorted and shelved 200 donated cans each Saturday', 0, '', 'Specific evidence.'],
      ['Never missed a practice in two seasons', 0, '', 'Shows reliability.'], ['Bilingual: English and French', 0, '', 'A useful skill.'], ['Email: firstname.lastname@mail.com', 0, '', 'Professional.'], ['Trained 3 new volunteers at the garden', 0, '', 'Shows leadership.']
    ].map(function (c) { return { t: c[0], icon: c[1] ? '📄' : '📄', bad: !!c[1], why: c[2], fine: c[3] }; }) } }
};
/* MODEL END */

/* HELP START ── between lessons, on fresh seeds. No DOM. ── */
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function pickN(r, a, n) { var b = a.slice(), out = []; while (out.length < n && b.length) out.push(b.splice(Math.floor(r() * b.length), 1)[0]); return out; }
function spread(seed, list, keys, each, total) { var r = RNG(seed); r(); var out = []; keys.forEach(function (k) { out = out.concat(pickN(r, list.filter(function (x) { return x[1] === k; }), each)); }); var rest = list.filter(function (x) { return out.indexOf(x) < 0; }); return pickN(r, out.concat(pickN(r, rest, total - out.length)), total); }
function forceTask(seed) { return spread(seed * 13 + 1, FORCE_ITEMS, ['auto', 'glob'], 2, 4); }
function reqTask(seed) { return spread(seed * 17 + 3, REQ_ITEMS, ['must', 'asset'], 2, 4); }
function trendTask(seed) { return spread(seed * 19 + 5, TREND_ITEMS, ['grow', 'more'], 1, 4); }
var REWRITES = [
  { weak: 'I did stuff at the food bank.', best: 'Sorted and shelved donated food every Saturday for a year.', w: ['Did lots of stuff at the food bank.', 'Food bank: yes.'] },
  { weak: 'I helped at camp.', best: 'Led crafts for 15 campers, ages 6 to 8, for two summers.', w: ['Camp helper (helped).', 'I was at camp a lot.'] },
  { weak: 'Good with computers.', best: 'Built a website for my school’s chess club.', w: ['Very very good with computers.', 'I use computers.'] },
  { weak: 'I babysat sometimes.', best: 'Babysat two kids, ages 4 and 7, every Friday for a year.', w: ['Babysitting (sometimes).', 'I like kids I guess.'] }
];
function rewriteQ(seed) { var x = REWRITES[seed % REWRITES.length], o = [x.best].concat(x.w); var r = RNG(seed * 23 + 7); r(); for (var i = o.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = o[i]; o[i] = o[j]; o[j] = t; } return { id: 'rw' + (seed % REWRITES.length), label: 'Rewrite a weak résumé line', text: 'Weak line: “' + x.weak + '” Which rewrite is strongest?', opts: o.map(function (t) { return [t, t === x.best, t === x.best ? 'Yes: an action verb and a specific detail.' : 'Still vague. Add what you did, and a number or detail.']; }) }; }
var JOBQS = [
  { id: 'noexp', label: '“No experience, no point applying”', text: 'I have no job experience. Is there any point applying?', opts: [['Yes. Volunteering, coaching, clubs and certificates all count as human capital.', 1, 'Huh. I do have some of those.'], ['No. Only paid jobs count.', 0, 'Unpaid experience counts too.'], ['Only if you lie a little.', 0, 'Never. Show what you really did.']] },
  { id: 'tailor', label: 'Why tailor a résumé', text: 'Why should I change my résumé for each job?', opts: [['Each posting asks for different things. Match your evidence to what they want.', 1, 'More work, but it makes sense.'], ['You shouldn’t. One résumé fits all.', 0, 'That’s why stacks of résumés look the same.'], ['To make it longer.', 0, 'Keep it to one page.']] },
  { id: 'advocate', label: 'Self-advocacy', text: 'What does self-advocacy look like in an interview?', opts: [['Saying clearly and politely what you need, like “I have hockey Thursdays. Could I work other days?”', 1, 'Polite and clear. Got it.'], ['Saying nothing and hoping they figure it out.', 0, 'They can’t read your mind.'], ['Demanding the best shifts.', 0, 'Clear and polite works better than demanding.']] },
  { id: 'lmi', label: 'Where to find labour market info', text: 'Where can I find out if an industry is growing?', opts: [['Government databases like Job Bank and ALIS, industry reports, and professional associations.', 1, 'Bookmarked.'], ['Ask one friend.', 0, 'One opinion isn’t data.'], ['Count the help-wanted signs on one street.', 0, 'Interesting, but use real data too.']] }
];
function mailKind(seed, last) { var k = ['force']; if (last >= 1) k.push('trend'); if (last >= 2) k.push('rewrite'); if (last >= 3) k.push('req'); return k[RNG(seed * 7 + 3)() * k.length | 0]; }
/* HELP END */

  var T = window.CEFLTown, K = T.kit, esc = T.esc;
  var fmt = K.fmt, fmtW = K.fmtW, step = K.step;
  var RUSH = T.gameKit.spotRush(GAME_CFGS.rush.cfg), RUSH_PAY = 800;
  function postingHTML(k) { var p = POSTINGS[k]; return '<div class="ck-card"><span class="ck-big" aria-hidden="true">' + p.icon + '</span><b>' + esc(p.title) + '</b><span class="ct-small">' + esc(p.biz) + '</span><div class="ck-kv"><span>Must have</span><b>' + esc(p.must.join('; ')) + '</b><span>Assets</span><b>' + esc(p.assets.join('; ')) + '</b><span>Skills</span><b>' + esc(p.skills.join(', ')) + '</b></div></div>'; }
  function rushOpts(api, seed, help) {
    return { title: 'Résumé Rush' + (help ? ': an extra stack' : ' at the Job Fair'), name: 'minigame', game: RUSH, seed: seed, seconds: 60, leave: !!help, skipNote: 'Skipping is okay.',
      tierText: help ? K.payTiers(RUSH_PAY) : { great: 'Sharp eye! You’d make a great hiring manager.', ok: 'Nice sorting.', poor: 'Weak lines can look fine at first. Ask: is it specific?' } };
  }
  async function rush(api, S, key, n) {
    if (!S.rushes[key]) { var r = await api.minigame(rushOpts(api, S.seed * 73 + n, false)); S.rushes[key] = { tier: r.tier, score: r.score }; api.save(); api.hud(); }
    var t = S.rushes[key].tier;
    await api.say('okafor', t === 'great' ? 'Now you know what a manager sees in 10 minutes. Big play!' : t === 'ok' ? 'Good eye.' : t === 'skip' ? 'Another time!' : 'Specific beats vague. Every time.');
  }

  function init() { return { v: 1, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), ans: {}, typed: {}, story: {}, post: null, rushes: {}, mock: null, scene: null, finished: false }; }
  function validate(S) { return !!S && S.v === 1 && !!S.typed && !!S.story && !!S.rushes && (S.post === null || !!POSTINGS[S.post]); }
  function P(S) { return POSTINGS[S.post]; }

  var HELPS = [
    { id: 'lm9-force', who: 'avery', after: 0, pay: 600, label: 'Automation or globalization', ask: 'I’m writing a report. Is each one automation or globalization?', run: async function (api, seed) {
      var t = forceTask(seed); var g = await K.sort(api, { title: 'Help Avery: automation or globalization?', name: 'help-sort', leave: true, intro: '<b>Automation</b>: technology doing tasks people did. <b>Globalization</b>: work and trade crossing borders.', bins: FORCES, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      if (g) await api.say('avery', 'Both change jobs, and both create new ones. Report done!'); return g; } },
    { id: 'lm9-noexp', who: 'grandpa', after: 0, pay: 500, label: 'Job search questions', ask: 'My grandson is looking for his first job. Can I ask you something?', run: async function (api, seed) { return K.askGrade(await api.ask('grandpa', JOBQS[seed % JOBQS.length], null)); } },
    { id: 'lm9-trend', who: 'dev', after: 1, pay: 800, label: 'Growing, stable or declining?', ask: 'Which of these industries are really growing? I’m job hunting.', run: async function (api, seed) {
      var t = trendTask(seed); var g = await K.sort(api, { title: 'Help Dev: which way is it moving?', name: 'help-sort', leave: true, wide: true, intro: 'Look at how long the data covers before you decide.', bins: TRENDS, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      if (g) await api.say('dev', 'One month isn’t a trend. I’ll remember that.'); return g; } },
    { id: 'lm9-lmi', who: 'librarian', after: 1, pay: 500, label: 'Labour market information', ask: 'A patron asked me something. Can you answer it?', run: async function (api, seed) { return K.askGrade(await api.ask('librarian', JOBQS[3 - (seed % 2) * 2], null)); } },
    { id: 'lm9-rewrite', who: 'rosa', after: 2, pay: 800, label: 'Rewrite a weak line', ask: 'My résumé sounds so blah. Can you help me fix a line?', run: async function (api, seed) { return K.askGrade(await api.ask('rosa', rewriteQ(seed), null)); } },
    { id: 'lm9-req', who: 'worker', after: 3, pay: 800, label: 'Requirements or assets', ask: 'This posting confuses me. What do they need, and what’s just nice to have?', run: async function (api, seed) {
      var t = reqTask(seed); var g = await K.sort(api, { title: 'Help Mo: requirement or asset?', name: 'help-sort', leave: true, intro: 'A <b>requirement</b> is a must. An <b>asset</b> is nice to have.', bins: [{ id: 'must', label: 'Requirement', icon: '✅' }, { id: 'asset', label: 'Asset', icon: '⭐' }], items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      if (g) await api.say('worker', 'So I can still apply without the assets. Good.'); return g; } },
    { id: 'lm9-adv', who: 'sam', after: 3, pay: 500, label: 'Self-advocacy', ask: 'I have an interview tomorrow. Can I ask you something?', run: async function (api, seed) { return K.askGrade(await api.ask('sam', JOBQS[(seed % 2) ? 2 : 1], null)); } },
    { id: 'lm9-rush', who: 'nurse', after: 1, pay: RUSH_PAY, label: 'An extra Résumé Rush', game: true, ask: 'We’re hiring nurse aides. Want to help me sort the résumés?', run: async function (api, seed) {
      var r = await api.minigame(rushOpts(api, seed, true)); return K.gameGrade(r); } }
  ];
  var GOSSIP = [
    { id: 'g-huang-0', who: 'huang', after: -1, lines: ['I posted one job. I got fifty résumés.', 'Forty of them say “hard worker, team player, detail-oriented.” Exactly that.'] },
    { id: 'g-lin-0', who: 'librarian', after: -1, lines: ['We have a new kiosk by the door. ResumeRocket.', 'It prints a résumé in 30 seconds. The line is very long.'] },
    { id: 'g-gp-0', who: 'grandpa', after: -1, lines: ['I got my first job by walking in and asking.', 'Then I worked so hard they never let me leave. For 20 years.'] },
    { id: 'g-jas-1', who: 'jas', after: 0, lines: ['Thirty applications. Thirty! Not one call back.', 'My résumé looks so professional, too.'] },
    { id: 'g-bea-1', who: 'bea', after: 0, lines: ['I need a helper who can fix a flat. One applicant said “problem solver.”', 'I asked how. They said, “It’s on my résumé.”'] },
    { id: 'g-osei-2', who: 'osei', after: 1, lines: ['The day camp got twenty résumés. Eighteen were the same words.', 'The two I called? They told me what they actually did with kids.'] },
    { id: 'g-dev-2', who: 'dev', after: 1, lines: ['Health care jobs grew about 15% in three years in Alberta.', 'My cousin’s applying to be a nurse aide. Smart move.'] },
    { id: 'g-rocket-3', who: 'rocketguy', after: 2, lines: ['ResumeRocket: one résumé for every job! Why write more?', 'What’s a “posting”? Never mind. Next!'] },
    { id: 'g-jas-3', who: 'jas', after: 2, lines: ['I rewrote one line: “Helped 40 customers a day find the right shoe size.”', 'It feels like ME now.'] },
    { id: 'g-jas-4', who: 'jas', after: 3, lines: ['I got hired! Customer service at the bank!', 'They said my résumé was the only one that told them something real.'] },
    { id: 'g-okafor-4', who: 'okafor', after: 3, lines: ['The {name} Résumé Clinic table was the busiest spot at the fair.', 'Employers are asking if we can do it every month.'] },
    { id: 'g-lin-4', who: 'librarian', after: 3, lines: ['The ResumeRocket kiosk is gone. A “Tailor It” worksheet is there now.', 'People line up for that instead.'] }
  ];
  function gossip(S, api) { return K.gossip(GOSSIP, api); }
  function mailTask(seed, last) {
    var k = mailKind(seed, last), from = 'Ms. Okafor';
    if (k === 'force') { var t = forceTask(seed); return { label: 'Town Mail: automation or globalization', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, intro: 'A letter from Ms. Okafor: “Automation or globalization?”', bins: FORCES, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) }); } }; }
    if (k === 'trend') { var tr = trendTask(seed); return { label: 'Town Mail: which way is it moving?', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, wide: true, intro: 'A letter from Ms. Okafor: “Growing, stable, declining, or not enough data?”', bins: TRENDS, items: tr.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) }); } }; }
    if (k === 'rewrite') { var q = rewriteQ(seed); return { label: 'Town Mail: a weak résumé line', from: from, pay: 500, run: async function (api) { await api.say(null, 'A letter from Ms. Okafor. She has a question.'); return K.askGrade(await api.ask('okafor', q, null)); } }; }
    var rq = reqTask(seed);
    return { label: 'Town Mail: requirement or asset', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, intro: 'A letter from Ms. Okafor: “Requirement or asset?”', bins: [{ id: 'must', label: 'Requirement', icon: '✅' }, { id: 'asset', label: 'Asset', icon: '⭐' }], items: rq.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) }); } };
  }

  function chapterSteps(ch, S, api) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the Job Centre and see Ms. Okafor', 'okafor');
        await api.say('okafor', ['Hey, hey! The Job Fair is in a few weeks. Real employers, real summer jobs.', 'Picture this: a manager has 50 applications and 10 minutes. What makes them call you?', 'First, the big picture. Automation is technology doing tasks people did. Globalization is work and trade crossing borders.']);
        await K.sort(api, { title: 'Automation or globalization?', name: 'forces', story: true, key: 'q-forces', label: 'Automation or globalization', ch: 0, intro: 'Sort each one.', bins: FORCES, items: FORCE_ITEMS.slice(0, 6).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
        await api.ask('okafor', { text: 'At some oil sands mines, haul trucks drive themselves. What happened to the jobs?', opts: [['Fewer people drive trucks, but more people monitor, program and repair them.', 1, 'Yes. Automation disrupts and creates.'], ['All the jobs disappeared.', 0, 'New tasks appeared: monitoring, programming, repair.'], ['Nothing changed.', 0, 'The driving jobs changed a lot.']] }, 'q-trucks', 'Automation: disrupts and creates', 0);
      }));
      a.push(step('posting', async function (api, S) {
        await api.say('okafor', 'Pick a posting from the Job Fair board. You’ll apply for it, for practice.');
        var r = await K.pick(api, { id: 'posting', title: 'Job Fair postings', name: 'pickposting', intro: 'Pick one. Read what each one must have, and what is only an asset.', noReason: true, options: POSTING_KEYS.map(function (k) { var p = POSTINGS[k]; return { k: k, title: p.title, icon: p.icon, lines: [['Where', p.biz], ['Must have', p.must.join('; ')], ['Assets', p.assets.join('; ')]] }; }) });
        S.post = r.pick; api.give('Posting: ' + P(S).title, P(S).icon, 'okafor'); api.hud();
        await K.typed(api, { id: 'future', title: 'In 10 years', prompt: 'How could automation or globalization change the ' + P(S).title.toLowerCase() + ' job in 10 years?' });
      }));
      a.push(step('hunch', async function (api, S) {
        S.story.jasOut = 1; api.refresh();
        await api.quest('Jas is at the Job Centre, looking down', 'jas');
        await api.say('jas', ['Thirty applications. Not one call back.', 'I don’t get it. My résumé looks so professional. I made it at the library in 30 seconds.', 'Am I just... not hireable?']);
        await api.say('you', ['I don’t know what managers look for yet. But I’m about to find out.', 'I’ll keep notes. Don’t give up.']);
        S.story.jas1 = 1; api.give('Job notes', '🔍', 'jas'); api.refresh();
      }));
      a.push(step('end1', async function (api, S) {
        await api.quest('Tell Ms. Okafor about Jas', 'okafor');
        await api.say('okafor', ['Thirty applications, no calls. That usually means the résumé isn’t telling them anything.', 'Now do Step 1 of your project: a real posting, and how it could change.', 'Next time: where the labour market is moving.']);
      }));
    }
    if (ch === 1) {
      a.push(step('trends', async function (api, S) {
        await api.quest('Ms. Okafor has some labour market data', 'okafor');
        await api.say('okafor', ['Smart job seekers ask: where are the jobs GOING? Industries can be growing, stable or declining.', 'In Alberta, health care jobs grew about 15% from 2022 to 2025. Across Canada, 9%.', 'Construction dropped 3.1% in one year. But is one year enough to call it declining?']);
        await K.sort(api, { title: 'Which way is it moving?', name: 'trends', story: true, key: 'q-trends', label: 'Growing, stable, declining, or not enough data', ch: 1, wide: true, intro: 'Look at how long the data covers before you decide.', bins: TRENDS, items: TREND_ITEMS.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
        await api.ask('okafor', JOBQS[3], 'q-lmi', 'Where to find labour market information', 1);
      }));
      a.push(step('stack', async function (api, S) { // clue 1: the employers' stacks are all the same words
        await api.quest('Mr. Huang at Valley Market wants to show you something', 'huang');
        await api.say('huang', ['Look at this stack. Fifty résumés for one clerk job.', 'Forty say the same thing: “Hard worker. Team player. Detail-oriented.” No examples. Same font, even.', 'Want to see what my 10 minutes feel like?']);
        await rush(api, S, 'ch2', 2);
        await api.say('huang', ['The ones I call tell me what they DID. “Counted the till for the school store.” Now that’s a clerk.']);
        S.story.stack = 1; api.toast('Added to your Job notes: the stack'); api.save();
      }));
      a.push(step('end2', async function (api, S) {
        await api.quest('Tell Ms. Okafor about the stack', 'okafor');
        await K.typed(api, { id: 'industry', title: 'Your posting’s industry', prompt: 'Is your posting’s industry growing, stable or declining? What evidence would you look for, and where?' });
        await api.say('okafor', ['Now do Step 2 of your project: your industry, with evidence: a number, a source and the years.', 'Next time: your résumé and your personal brand.']);
      }));
    }
    if (ch === 2) {
      a.push(step('leo', async function (api, S) {
        await api.quest('Ms. Okafor wants you to meet Leo’s résumé', 'okafor');
        await api.say('okafor', ['Leo is 15. No “real” job yet. But he coached his brother’s soccer team, volunteered at the library and has his First Aid.', 'That’s human capital. A résumé shows it on one page, tailored to the posting.']);
        await api.ask('okafor', rewriteQ(0), 'q-rewrite', 'Rewrite a weak résumé line', 2);
        await api.ask('okafor', JOBQS[1], 'q-tailor', 'Why tailor a résumé', 2);
      }));
      a.push(step('jasres', async function (api, S) { // clue 2 and the source: Jas's résumé, from ResumeRocket
        await api.quest('Look at Jas’s résumé with Jas', 'jas');
        await api.say('jas', ['Here it is. The ResumeRocket kiosk made it. Be honest.']);
        await K.inspect(api, { title: 'Jas’s résumé (ResumeRocket)', name: 'jasres', story: true, key: 'story-jasres', label: 'Jas’s résumé: find what keeps it from getting calls', ch: 2, find: 'Find the 4 problems', cols: 3,
          intro: 'Tap everything that would make a manager skip this résumé.',
          spots: [{ id: 'buzz', icon: '🗯️', label: '“Hard worker, team player, detail-oriented.”', bad: true, why: 'The same buzzwords as 40 other résumés, with no examples.', hint: 'What did 40 other résumés say?' }, { id: 'obj', icon: '🎯', label: 'Objective: “To get a job.”', bad: true, why: 'Not tailored to any posting.' },
            { id: 'duties', icon: '📋', label: 'Shoe store: “Did duties as needed.”', bad: true, why: 'Vague. What did Jas actually do?' }, { id: 'email', icon: '📧', label: 'Email: shoeking2000@mail.com', bad: true, why: 'Unprofessional email.' },
            { id: 'name', icon: '🪪', label: 'Name and phone number at the top', fine: 'That’s exactly where they go.' }, { id: 'onepage', icon: '📄', label: 'Fits on one page', fine: 'One page is right.' }] });
        await api.say('jas', ['So it says nothing about me. Every job, the same nothing.', 'Where did the kiosk get “To get a job”?!']);
        S.story.rocketOut = 1; api.refresh();
        await api.quest('Visit the ResumeRocket kiosk at the library', 'rocketguy');
        await api.say('rocketguy', ['ResumeRocket! One résumé for every job! Thirty seconds! No thinking required!', 'Tailoring? What’s that, like pants?']);
        S.story.rocket = 1; api.toast('Added to your Job notes: ResumeRocket'); api.save();
      }));
      a.push(step('brand', async function (api, S) {
        await api.quest('Go home and work on your own résumé and brand', 'table');
        await K.typed(api, { id: 'brand', title: 'My personal brand statement', prompt: 'Write one or two sentences that tell an employer who you are and what you bring, for the ' + P(S).title.toLowerCase() + ' posting.', min: 15 });
        await K.chips(api, { id: 'evidence', title: 'Match my evidence to the posting', name: 'evidence', intro: 'The posting wants: <b>' + esc(P(S).skills.join(', ')) + '</b>. Which of your experiences show it?', groups: [{ k: 'x', label: 'My evidence', min: 2, max: 4, opts: [{ k: 'vol', label: 'Volunteering' }, { k: 'coach', label: 'Coaching or helping younger kids' }, { k: 'club', label: 'A club or team' }, { k: 'cert', label: 'A certificate (like First Aid)' }, { k: 'job', label: 'A small job (babysitting, yard work)' }, { k: 'school', label: 'A school project or role' }] }], texts: [{ k: 'line', label: 'One strong résumé line (an action verb and a detail)', min: 10 }], saveText: 'Save' });
        api.give('My résumé draft', '📄', 'table');
      }));
      a.push(step('end3', async function (api, S) {
        await api.quest('Tell Ms. Okafor about ResumeRocket', 'okafor');
        await api.say('okafor', ['One résumé for every job? That explains the stacks.', 'Now do Step 3 of your project: your résumé and brand, tailored to your posting.', 'Next time: interviews. And the Job Fair!']);
      }));
    }
    if (ch === 3) {
      a.push(step('star', async function (api, S) {
        await api.quest('Ms. Okafor wants to teach you STAR', 'okafor');
        await api.say('okafor', ['Leo got an interview. “Tell me about a time you solved a problem.” He froze. Then he remembered STAR: Situation, Task, Action, Result.']);
        await K.order(api, { title: 'Put Leo’s STAR answer in order', name: 'star', story: true, key: 'q-star', label: 'STAR: put the answer in order', ch: 3, intro: 'Use the arrows to put the four parts in STAR order.', items: STAR.map(function (x) { return { id: x[0], text: x[1] }; }), start: ['A', 'S', 'R', 'T'], answer: ['S', 'T', 'A', 'R'], hint: 'Situation, Task, Action, Result.' });
        await K.sort(api, { title: 'Requirement or asset?', name: 'req', story: true, key: 'q-req', label: 'Requirements and assets in a posting', ch: 3, intro: 'A <b>requirement</b> is a must. An <b>asset</b> is nice to have.', bins: [{ id: 'must', label: 'Requirement', icon: '✅' }, { id: 'asset', label: 'Asset', icon: '⭐' }], items: REQ_ITEMS.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
        await api.ask('okafor', JOBQS[2], 'q-adv', 'What self-advocacy looks like', 3);
      }));
      a.push(step('interview', async function (api, S) { // the Job Fair: your mock interview (the goal)
        S.scene = 'fair'; api.refresh();
        var p = P(S), boss = p.boss;
        await api.quest('The Job Fair is open at the Community Centre! Find ' + p.biz + '’s table.', boss);
        api.fx.face('all');
        await api.say(boss, ['Hello! You’re here for the ' + p.title.toLowerCase() + ' job? Have a seat. Let’s talk.']);
        if (!S.mock) S.mock = { got: 0, asked: {} };
        var Qs = [
          ['q-mock-you', { text: 'Tell me about yourself.', opts: [['My brand statement: who I am, what I bring, and why it fits this job, in a few sentences.', 1, 'Clear and confident. Good start.'], ['Um, I’m 15. I like pizza.', 0, 'Tell them what you bring to the job.'], ['Everything, from when I was born.', 0, 'Keep it short and about the job.']] }],
          ['q-mock-star', { text: 'Tell me about a time you solved a problem.', opts: [['A STAR answer: the situation, my task, what I did, and how it turned out.', 1, 'I can picture it. That’s what I need.'], ['“I’m a good problem solver.”', 0, 'That’s a claim. Show me with a story.'], ['“I don’t really have problems.”', 0, 'Everyone has. Pick a real one.']] }],
          ['q-mock-why', { text: 'Why do you want this job?', opts: [['Something specific about this job and this place, and how my skills fit what the posting asks for.', 1, 'You read the posting. I like that.'], ['“I need money.”', 0, 'True, but tell them why THIS job.'], ['“My mom made me apply.”', 0, 'Tell them what draws you to it.']] }],
          ['q-mock-adv', { text: 'Anything we should know about your availability?', opts: [['“I have hockey on Thursday evenings. Could I be scheduled on other days?”', 1, 'Thanks for telling me. Easy to plan around.'], ['“No.” Then miss Thursdays without saying.', 0, 'Speak up early. That’s self-advocacy.'], ['“I only work when I feel like it.”', 0, 'Be clear and polite about real needs.']] }]
        ];
        for (var i = 0; i < Qs.length; i++) {
          var q = Qs[i]; if (S.mock.asked[q[0]]) continue;
          var r = await api.ask(boss, q[1], q[0], 'Mock interview: ' + q[1].text, 3);
          S.mock.asked[q[0]] = 1; if (r.first) { S.mock.got++; api.fx.rise(boss, '+1'); }
          api.save(); api.hud();
        }
        S.win = S.mock.got >= POINTS_TO_WIN; api.save();
        await api.say(boss, S.win ? ['I’d hire you. That was one of the best interviews today.', 'Do you have a question for me?'] : ['Thank you. You’re not quite ready yet. Practise your STAR answers.', 'You can replay this chapter from the Menu and try again.']);
        if (S.win) { await api.say('you', 'Yes: what does a great first week look like here?'); await api.say(boss, 'Now THAT is a good question.'); api.give('Job offer', '🤝', boss); api.fx.confetti(24); }
      }));
      a.push(step('clinic', async function (api, S) { // the hero beat: the résumé clinic
        await api.quest('Ms. Okafor wants you at the résumé clinic table', 'okafor');
        await api.say('okafor', ['People keep showing up with ResumeRocket résumés. Want to help them tailor? Start with Jas.']);
        await api.ask('jas', rewriteQ(1), 'q-clinic', 'Résumé clinic: help Jas rewrite a line', 3);
        await api.say('jas', ['“Helped 40 customers a day find the right shoe size.” That’s me! That’s what I did!', 'I’m sending it to the bank’s customer service posting. Right now.']);
        await api.say('huang', 'Three people from your clinic just handed me real résumés. I’m calling all three.');
        S.story.clinic = 1; api.save();
        await K.hero(api, { who: 'okafor', lines: ['Employers want this table at every Job Fair from now on.', 'A table where people learn to show what they can really do. We’re calling it the ' + api.profile.name + ' Résumé Clinic.'],
          medal: 'Get Hired medal', icon: '🤝', kicker: 'Job Fair', title: 'The ' + api.profile.name + ' Résumé Clinic', thanks: [['jas', 'The bank called me back! Interview Monday!']], reply: ['Thanks! Show, don’t just tell. Every line.'] });
        S.story.hero = 1; S.scene = null; api.refresh();
      }));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and pin your brand statement to your My Plan wall', 'myplan');
        var firstTime = !S.finished; S.finished = true;
        if (firstTime) api.profileAdd('closet', 'interview');
        api.profileAdd('plan', { mission: '9-labour-market', title: 'Get Hired', text: 'Posting: ' + P(S).title + '. My brand: ' + (S.typed.brand || '—') });
        api.profileAdd('finished', '9-labour-market'); api.refresh();
        await api.say('okafor', [S.win ? 'A job offer AND a clinic named after you. Big play!' : 'A clinic named after you! Next time, ace the interview too.', 'Your closet has a new Interview blazer, and your My Plan wall has a new page.', 'Now do Step 4 of your project: STAR notes for your mock interview.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }

  T.mission({
    id: '9-labour-market', unitLabel: 'CEFL Grade 9 · Careers and the Labour Market · Project: Get Hired', title: 'Get Hired: The Copy-Paste Résumés',
    iCan: 'I can explain how automation and globalization change jobs, read labour market trends, and show an employer my human capital with a tailored résumé and STAR answers.',
    foot: 'This is a model. Labour market figures are from the Government of Canada Job Bank (May 2026). The people, postings and businesses are made up.',
    bagTip: 'Your Bag holds what you collect: your posting, your résumé draft and your Job notes.',
    realRule: 'Real gives no hints, and the interview still needs 3 strong answers', afterLine: 'Mission complete. Open Menu → Report to show your teacher.',
    chapters: [
      { name: 'Automation and globalization', step: 'Step 1', moment: 'Moment 1: automation and globalization' },
      { name: 'Where is the market moving?', step: 'Step 2', moment: 'Moment 2: where the labour market is moving' },
      { name: 'Résumé and brand', step: 'Step 3', moment: 'Moment 3: your résumé and personal brand' },
      { name: 'The interview', step: 'Step 4', moment: 'Moment 4: interviews and self-advocacy' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps, guide: 'okafor',
    helpers: function () { return HELPS; }, gossip: gossip, mail: function (S, seed, last) { return mailTask(seed, last); },
    outfit: function (S) { return S.finished ? 'interview' : 'none'; },
    placeObjects: function (api) { api.place('table', 'home', 4, 3, { label: 'Kitchen table' }); api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true }); },
    people: function (S) {
      var out = {}, s = S.story;
      out.osei = { name: 'Mr. Osei', role: 'Community Centre', map: 'community', x: 4, y: 3, dir: 'down', look: { base: 2, skin: 's5', hair: 'black', shirt: 'green', pants: '#2f3a5c' } };
      out.huang = { name: 'Mr. Huang', role: 'Valley Market', map: 'grocer', x: 4, y: 3, dir: 'down', look: { base: 2, skin: 's2', hair: 'black', shirt: 'green', pants: '#3b3f5c' } };
      out.bea = { name: 'Bea', role: 'Spoke & Chain Bikes', map: 'bikeshop', x: 4, y: 3, dir: 'down', look: { base: 3, skin: 's1', hair: 'blond', shirt: 'blue', pants: '#3b3f5c' } };
      out.rocketguy = { name: 'Rocket Rick', role: 'ResumeRocket kiosk', map: 'library', x: 6, y: 4, dir: 'left', look: { base: 0, skin: 's3', hair: 'black', shirt: 'red', pants: '#2f2f38' }, hidden: !s.rocketOut || s.hero };
      if ((s.jasOut || s.jas1) && !s.hero) out.jas = { map: 'jobcentre', x: 2, y: 4, dir: 'right' };
      if (S.scene === 'fair' && S.post) { // the employers' tables at the Community Centre, along row 3
        var b = POSTINGS[S.post].boss;
        out.okafor = { map: 'community', x: 1, y: 3, dir: 'down' }; out.jas = { map: 'community', x: 2, y: 3, dir: 'down' };
        out.huang = Object.assign({}, out.huang, { map: 'community', x: b === 'huang' ? 4 : 6, y: 3 });
        if (b !== 'huang') { var B = b === 'librarian' ? { map: 'community', x: 4, y: 3, dir: 'down' } : Object.assign({}, out[b], { map: 'community', x: 4, y: 3 }); out[b] = B; }
        if (b !== 'osei') out.osei = Object.assign({}, out.osei, { x: 7, y: 3 });
      }
      return out;
    },
    doorOpen: function (id) { return !!{ home: 1, grandpa: 1, jobcentre: 1, community: 1, grocer: 1, library: 1, bikeshop: 1, bank: 1, hospital: 1 }[id]; },
    lockedLine: function (id) { return T.world.building(id).name + ' is closed right now. Everyone is getting ready for the Job Fair.'; },
    talk: function (id, S, api) {
      var s = S.story, done = S.finished;
      var lines = {
        okafor: done ? 'Show, don’t just tell. Every line.' : 'Your next goal is on the gold line at the top.',
        jas: s.hero ? 'Interview at the bank on Monday! My résumé finally sounds like me.' : s.rocket ? 'One résumé for every job. That was my problem.' : s.jas1 ? 'Thirty applications. Not one call.' : 'Hi!',
        huang: s.stack ? 'Fifty résumés. Forty the same. Tell me what you DID.' : 'Fresh bananas! Green, but fresh.', bea: 'A clean chain is a happy chain. A tailored résumé is a hired helper.',
        rocketguy: 'ResumeRocket! One résumé for every job! Thirty seconds!', osei: 'Day camp leaders wanted! Tell me what you did with kids.',
        librarian: s.hero ? 'The kiosk is gone. The “Tailor It” worksheet is a hit.' : 'Free computers! Résumé templates on the second shelf. The kiosk is... popular.',
        grandpa: 'I got my first job by walking in and asking.', table: 'The kitchen table. Good for writing résumés.',
        myplan: K.planLine(api)
      };
      return lines[id] || null;
    },
    hud: function (S) {
      var out = [{ label: 'Posting', value: S.post ? P(S).title : '—' }];
      if (S.mock) out.push({ label: 'Interview', value: S.mock.got + ' / 4', title: '3 strong answers and you get the job' });
      return out;
    },
    items: function (S) {
      var it = [];
      if (S.post) it.push({ name: 'Posting: ' + P(S).title, icon: P(S).icon, note: P(S).biz, view: function () { return postingHTML(S.post); } });
      if (S.typed.brand) it.push({ name: 'My résumé draft', icon: '📄', note: 'Brand and evidence', view: function () { var e = S.typed.evidence || {}; return '<p><b>Brand statement:</b> ' + esc(S.typed.brand) + '</p><p><b>Evidence:</b> ' + esc((e.x || []).join(', ')) + '</p><p><b>A strong line:</b> ' + esc(e.line || '') + '</p>'; } });
      if (S.story.jas1) it.push({ name: 'Job notes', icon: '🔍', note: 'The copy-paste résumés', view: function () { return K.notes(notes(S)); } });
      if (S.win) it.push({ name: 'Job offer', icon: '🤝', note: P(S).biz, view: function () { return '<p><b>Job offer:</b> ' + esc(P(S).title) + ' at ' + esc(P(S).biz) + ' (practice).</p>'; } });
      if (S.story.hero) it.push({ name: 'Get Hired medal', icon: '🤝', note: 'The ' + T.api.profile.name + ' Résumé Clinic', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🤝</p><p style="text-align:center"><b>Get Hired</b><br>Show, don’t just tell.</p>'; } });
      return it;
    },
    report: function (S) {
      var h = '<p>Posting: <b>' + (S.post ? esc(P(S).title + ' at ' + P(S).biz) : 'not picked yet') + '</b>' + (S.finished ? ' · Mock interview: <b>' + S.mock.got + ' of 4</b> (' + (S.win ? 'job offered' : 'goal not reached') + ')' : '') + '</p>';
      var rs = Object.keys(S.rushes); if (rs.length) h += '<h3>Résumé Rush</h3>' + K.table(rs.map(function (k) { var x = S.rushes[k]; return ['Chapter 2', String(x.score), K.TIER_WORD[x.tier]]; }), ['When', 'Score', 'Result']);
      h += K.wrote(S, [['future', 'How my posting could change'], ['industry', 'My industry’s direction, and evidence'], ['brand', 'My brand statement']]);
      if (S.typed.evidence && S.typed.evidence.line) h += '<p><b>A strong résumé line:</b> ' + esc(S.typed.evidence.line) + '</p>';
      h += '<h3>The copy-paste résumés</h3><p>' + (S.story.hero ? 'Solved: ran the résumé clinic at the Job Fair; Jas got a call back, and the clinic was named after them.' : S.story.rocket ? 'Found ResumeRocket.' : S.story.jas1 ? 'Collecting clues.' : 'Not started.') + '</p>';
      return h;
    },
    test: { scenes: [null, { story: { jas1: 1, rocketOut: 1 } }, { scene: 'fair', post: 'camp', story: { jas1: 1 } }, { scene: 'fair', post: 'grocer', story: { jas1: 1 } }, { scene: 'fair', post: 'library', story: { jas1: 1 } }, { scene: 'fair', post: 'bike', story: { jas1: 1 } }],
      POSTINGS: POSTINGS, FORCE_ITEMS: FORCE_ITEMS, TREND_ITEMS: TREND_ITEMS, REQ_ITEMS: REQ_ITEMS, GAME_CFGS: GAME_CFGS, forceTask: forceTask, reqTask: reqTask, trendTask: trendTask, rewriteQ: rewriteQ, mailTask: mailTask, HELPS: HELPS, GOSSIP: GOSSIP }
  });
  function notes(S) {
    var s = S.story, li = [];
    if (s.jas1) li.push('<b>Jas:</b> 30 applications, no calls. The résumé “looks so professional.” Made at the library in 30 seconds.');
    if (s.stack) li.push('<b>Mr. Huang’s stack:</b> 50 résumés, 40 with the same words: “hard worker, team player, detail-oriented.” No examples.');
    if (s.rocket) li.push('<b>Jas’s résumé:</b> buzzwords, “To get a job,” “did duties as needed,” and an unprofessional email. It came from the ResumeRocket kiosk: one résumé for every job.');
    if (s.clinic) li.push('<b>The clinic:</b> Jas rewrote a line to show what they really did, and applied to the bank.');
    if (s.hero) li.push('<b>The ' + esc(T.api.profile.name) + ' Résumé Clinic:</b> at every Job Fair. Show, don’t just tell.');
    return li;
  }
})();
