/* CEFL Town mission: Grade 8 Experiences and Employment — "Open Doors" (companion to the project Open Doors). LO 8-EX.
   Four chapters, one after each project step: Who is in the job? (representation, with data) · Seeing yourself (role models and
   motivation; a picture-a-worker survey) · Growth mindset (employability skills) · Skills for entrepreneurs (risk) and the campaign.
   Model (MODEL START … END, no DOM): the workbook's dated data (women 4.8% of electrical apprentices and 13.6% of all apprentice
   registrations, Statistics Canada 2018 via CLAC; women 17.4% of newly licensed engineers, Engineers Canada 2018, goal 30% by 2030;
   men about 9% of regulated nurses, CNA 2019), a survey of 10 Grade 6 students, Kai's T-shirt business. Goal: the Grade 6 class
   is convinced at the campaign launch (at least 3 of 4 first-try answers). The Mindset Flip game (kit quickPick) counts right
   answers; it never changes the goal.
   Side story, "The Career Corner posters": Grade 6 Mia says electrician "isn't for girls" after the Career Corner (Ch 1) → the
   survey: most kids picture the same kind of person for each job; three real role models tell their stories (Ch 2) → the posters
   are from 1985 and show only one kind of person per job (Ch 3) → your campaign replaces them with townspeople, and the job-shadow
   day is named after you (Ch 4).
   Between lessons (HELP START … HELP END): townspeople's own questions, an extra Mindset Flip round, and Town Mail.
   Simplification: representation is shown for one group per career; the data are several years old (newer data may differ). */
(function () {
  'use strict';

/* MODEL START ── no DOM. Percentages as numbers; money in cents. ── */
var DATA = [ // the workbook's figures (dated)
  { k: 'elec', career: 'Electrical apprentices', group: 'women', pct: 4.8, src: 'Statistics Canada 2018 data, reported by CLAC', icon: '⚡' },
  { k: 'eng', career: 'Newly licensed engineers', group: 'women', pct: 17.4, src: 'Engineers Canada, 2018', icon: '🏗️' },
  { k: 'nurse', career: 'Regulated nurses', group: 'men', pct: 9, src: 'Canadian Nurses Association, 2019', icon: '🩺' },
  { k: 'appr', career: 'All apprentice registrations', group: 'women', pct: 13.6, src: 'Statistics Canada 2018 data, reported by CLAC', icon: '🔧' }
];
var POP = 50, ENG_GOAL = 30, ENG_2018 = 17.4;
var SURVEY = { n: 10, elecMan: 9, nurseWoman: 8, engMan: 9 }; // 10 Grade 6 students: who did they picture?
function pct(part, whole) { return Math.round(part / whole * 1000) / 10; }
var KAI = { blank: 800, print: 400, price: 2000 };
function kaiCost() { return KAI.blank + KAI.print; }
function kaiProfitEach() { return KAI.price - kaiCost(); }
function kaiResult(bought, sold) { return sold * KAI.price - bought * kaiCost(); }
var MINDSETS = [ // a fixed thought, its growth rewrite, and two choices that aren't growth thoughts
  ['I’m bad at time management.', 'I’m not good at time management yet.', ['Time management isn’t for people like me.', 'I’ll never be organized.']],
  ['I’m not a team player.', 'I can learn to work well on a team.', ['Teams are just not my thing.', 'Other people should do the teamwork.']],
  ['I can’t solve hard problems.', 'Hard problems take practice. I’m getting better.', ['Some people are just smart.', 'I’ll avoid hard problems.']],
  ['I’m terrible with technology.', 'I can learn new tech one step at a time.', ['Tech is for younger kids.', 'I was born bad at computers.']],
  ['I’m too shy to communicate.', 'Speaking up gets easier every time I try.', ['Shy people can’t talk to others.', 'I’ll let others talk for me.']],
  ['Critical thinking is for geniuses.', 'I can practise asking good questions.', ['I just believe what I’m told.', 'Thinking hard is too tiring.']],
  ['I always mess up group projects.', 'I can try a new role next time.', ['Group work hates me.', 'I’ll do it all myself.']],
  ['I’ll never be good at math.', 'Math gets better with practice.', ['Math is a talent you’re born with.', 'Math isn’t important anyway.']]
];
var SKILLS = [['comm', 'Communication', '💬'], ['collab', 'Collaboration', '🤝'], ['solve', 'Problem solving', '🧩'], ['think', 'Critical thinking', '🔍'], ['tech', 'Technology use', '💻'], ['time', 'Time management', '⏰']];
var POINTS_TO_WIN = 3;
var GAME_CFGS = {
  flip: { kind: 'quickPick', cfg: { id: 'flip', name: 'Mindset Flip', scoreWord: 'Flipped', think: 2600, th: [[12, 5], [12, 5]],
    how: '<p><b>Mindset Flip.</b> A fixed thought pops up. Tap the <b>growth</b> thought that flips it.</p><p class="ct-small">A wrong pick costs a point.</p>',
    make: function (r) {
      var m = MINDSETS[Math.floor(r() * MINDSETS.length)], opts = [m[1], m[2][0], m[2][1]];
      for (var i = opts.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = opts[i]; opts[i] = opts[j]; opts[j] = t; }
      return { q: '“' + m[0] + '”', icon: '🔁', opts: opts, ans: opts.indexOf(m[1]), why: 'A growth thought says the skill can grow with practice.' };
    } } }
};
/* MODEL END */

/* HELP START ── between lessons, on fresh seeds. No DOM. ── */
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function pickN(r, a, n) { var b = a.slice(), out = []; while (out.length < n && b.length) out.push(b.splice(Math.floor(r() * b.length), 1)[0]); return out; }
function surveyTask(seed) { var r = RNG(seed * 13 + 1); r(); var n = [10, 20, 25, 40][Math.floor(r() * 4)], part = 1 + Math.floor(r() * (n - 1)); return { n: n, part: part, pct: pct(part, n) }; }
function gapTask(seed) { var r = RNG(seed * 17 + 3); r(); var d = DATA[Math.floor(r() * 3)]; return { d: d, gap: Math.round((POP - d.pct) * 10) / 10 }; }
function shirtTask(seed) { var r = RNG(seed * 19 + 5); r(); var blank = (5 + Math.floor(r() * 6)) * 100, print = (2 + Math.floor(r() * 4)) * 100, price = blank + print + (4 + Math.floor(r() * 9)) * 100, bought = [20, 30, 40, 50][Math.floor(r() * 4)], sold = Math.floor(bought * (0.4 + r() * 0.6)); return { blank: blank, print: print, price: price, bought: bought, sold: sold, each: price - blank - print, result: sold * price - bought * (blank + print) }; }
function mindsetTask(seed) { var r = RNG(seed * 23 + 7); r(); var fx = pickN(r, MINDSETS, 2), gr = pickN(r, MINDSETS.filter(function (m) { return fx.indexOf(m) < 0; }), 2); return pickN(r, fx.map(function (m) { return [m[0], 'fixed']; }).concat(gr.map(function (m) { return [m[1], 'growth']; })), 4); }
var REP_QS = [
  { id: 'just', label: 'Jobs “for boys” or “for girls”', text: 'My little cousin says some jobs are just for boys and some are just for girls. What should I tell her?', opts: [
    ['Anyone can do them. Big gaps come from things like role models and welcome, not from who can do the job.', 1, 'I’ll tell her about the woman electrician who visited the school.'], ['She’s right. Some jobs just fit boys or girls.', 0, 'The data shows gaps, not who CAN do the job.'], ['It doesn’t matter what she thinks.', 0, 'It matters a lot. Pictures in our heads shape what we try.']] },
  { id: 'community', label: 'Why open careers matter to everyone', text: 'Why does it matter to a whole town that careers are open to everyone?', opts: [
    ['More people can fill shortages, and teams with different people often solve problems better.', 1, 'Good point. Everyone benefits.'], ['It only matters to the workers.', 0, 'Patients, customers and whole towns are affected.'], ['It doesn’t matter.', 0, 'When people are kept out, the community loses their skills.']] },
  { id: 'rolemodel', label: 'What a role model does', text: 'Why do role models matter for career choices?', opts: [
    ['Seeing someone like you in a career shows it’s possible, so you’re more likely to try it.', 1, 'Like Lena and the woman electrician.'], ['They don’t. Everyone already knows what they can do.', 0, 'Many people never picture themselves in a career until they see someone like them.'], ['Role models tell you which career to pick.', 0, 'They show what’s possible. You still choose.']] }
];
var BOSS_QS = [
  { id: 'norisk', label: 'Being your own boss', text: 'Being your own boss means no risk and no rules, right?', opts: [
    ['No. You take the risk of losing money, and you still follow rules and keep customers happy.', 1, 'True. Kai learned that with his shirts.'], ['Right. That’s the best part.', 0, 'If shirts don’t sell, the owner loses the money.'], ['Only the rules part is true.', 0, 'There’s risk AND rules.']] },
  { id: 'start', label: 'Testing demand', text: 'Why might a new business start small, like 15 shirts instead of 50?', opts: [
    ['To test if people want it, with less money at risk.', 1, 'Smart risk management.'], ['Because big orders are illegal.', 0, 'They’re not. They’re just riskier.'], ['It doesn’t matter how many.', 0, 'Unsold stock is lost money.']] },
  { id: 'skills', label: 'Skills entrepreneurs need', text: 'Which skills does a teen running a small business need?', opts: [
    ['Risk management, time management, and decision making.', 1, 'Yes. All three.'], ['Only good drawing skills.', 0, 'Design helps, but running a business takes more.'], ['None. Businesses run themselves.', 0, 'They definitely don’t.']] }
];
function mailKind(seed, last) { var k = ['gap']; if (last >= 1) k.push('survey', 'rep'); if (last >= 2) k.push('mindset'); if (last >= 3) k.push('shirt'); return k[RNG(seed * 7 + 3)() * k.length | 0]; }
/* HELP END */

  var T = window.CEFLTown, K = T.kit, esc = T.esc;
  var fmt = K.fmt, fmtW = K.fmtW, step = K.step;
  function pFmt(c) { return (Math.round(c) / 100) + '%'; }
  var FLIP = T.gameKit.quickPick(GAME_CFGS.flip.cfg), FLIP_PAY = 800;
  function dataHTML() { return K.table(DATA.map(function (d) { return [d.icon + ' ' + esc(d.career), '<b>' + d.pct + '%</b> ' + esc(d.group), esc(d.src)]; }), ['Career', 'Share', 'Source (dated)']) + '<p class="ct-small">Women and men are each about half of Canada’s population. These figures are several years old; newer data may differ.</p>'; }

  function init() { return { v: 1, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), ans: {}, typed: {}, story: {}, focus: null, flips: {}, cards: {}, launch: null, scene: null, finished: false }; }
  function validate(S) { return !!S && S.v === 1 && !!S.typed && !!S.story && !!S.flips && !!S.cards; }
  var FOCUS = { elec: { career: 'Electrician', group: 'girls and women', model: 'priya', icon: '⚡' }, eng: { career: 'Engineer', group: 'girls and women', model: 'cardinal', icon: '🏗️' }, nurse: { career: 'Nurse', group: 'boys and men', model: 'malik', icon: '🩺' } };
  function flipOpts(api, seed, help) {
    return { title: 'Mindset Flip' + (help ? ': an extra round' : ''), name: 'minigame', game: FLIP, seed: seed, seconds: 60, leave: !!help, skipNote: 'Skipping is okay.',
      tierText: help ? K.payTiers(FLIP_PAY) : { great: 'Every thought flipped. A growth mindset is a skill too.', ok: 'Nice flipping.', poor: 'Fixed thoughts are sneaky. They sound true.' } };
  }
  async function flipRound(api, S, key, n) {
    if (!S.flips[key]) { var r = await api.minigame(flipOpts(api, S.seed * 61 + n, false)); S.flips[key] = { tier: r.tier, score: r.score }; api.save(); api.hud(); }
    var t = S.flips[key].tier;
    await api.say('osei', t === 'great' ? 'Yet. The most powerful word in a career.' : t === 'ok' ? 'Good flipping!' : t === 'skip' ? 'Another time!' : 'Fixed thoughts sound true. That’s why we practise flipping them.');
  }
  var STORIES = {
    priya: { name: 'Priya', lines: [['How did you get into this?', 'I fixed every toaster in my house. A woman electrician visited my school, and I thought: wait, I could do that.'], ['What made it hard?', 'Being the only girl in my CTS class. Some people said I’d quit.'], ['What helped?', 'My instructor, and Joe. He treats every apprentice the same. And a group of women in the trades I met online.']], card: 'Priya, apprentice electrician: saw a woman electrician at school; it was hard being the only girl; a mentor and a network helped.' },
    malik: { name: 'Nurse Malik', lines: [['How did you get into this?', 'My grandma was sick, and a male nurse took care of her. I’d never seen one before.'], ['What made it hard?', 'People called me “doctor” all the time. Or asked when I’d become one.'], ['What helped?', 'Other men in nursing. There are more of us every year. And patients who were glad I was there.']], card: 'Nurse Malik: met a male nurse who cared for his grandma; people assumed he was a doctor; other men in nursing helped.' },
    cardinal: { name: 'Ms. Cardinal', lines: [['How did you get into this?', 'I loved building bridges out of sticks by the creek near my home. My aunt showed me engineering was a job.'], ['What made it hard?', 'There were very few Indigenous women in my program. I felt like I had to prove I belonged.'], ['What helped?', 'A mentor program for Indigenous students, and knowing my community was proud of me.']], card: 'Ms. Cardinal, engineer: built stick bridges as a kid; felt she had to prove she belonged; a mentor program helped.' }
  };

  var HELPS = [
    { id: 'ex8-gap', who: 'librarian', after: 0, pay: 800, label: 'How big is the gap?', ask: 'I’m making a chart about careers. Can you work out a gap for me?', run: async function (api, seed) {
      var t = gapTask(seed);
      var g = await api.calc({ title: 'Help Mx. Lin: the gap', name: 'help-gap', ref: dataHTML(), refLabel: 'Show the data', intro: '<p>' + esc(t.d.career) + ': <b>' + t.d.pct + '%</b> are ' + esc(t.d.group) + '. ' + esc(t.d.group.charAt(0).toUpperCase() + t.d.group.slice(1)) + ' are about <b>50%</b> of the population.</p>',
        fields: [{ k: 'g', name: 'How far below 50% (percentage points)', fmt: pFmt, ans: Math.round(t.gap * 100), hint: '50 − ' + t.d.pct + '.' }] });
      if (g) await api.say('librarian', 'A gap that big says something is keeping people out. Not that they can’t do it.'); return g; } },
    { id: 'ex8-rep', who: 'grandpa', after: 0, pay: 500, label: 'Representation', ask: 'Can I ask you about who does what job?', run: async function (api, seed) { return K.askGrade(await api.ask('grandpa', REP_QS[seed % REP_QS.length], null)); } },
    { id: 'ex8-survey', who: 'avery', after: 1, pay: 800, label: 'Survey math', ask: 'I ran a survey at school. Can you turn it into a percent?', run: async function (api, seed) {
      var t = surveyTask(seed);
      var g = await api.calc({ title: 'Help Avery: survey math', name: 'help-survey', intro: '<p>Avery asked <b>' + t.n + '</b> students to picture a pilot. <b>' + t.part + '</b> pictured a man.</p>', fields: [{ k: 'p', name: 'Percent who pictured a man', fmt: pFmt, ans: Math.round(t.pct * 100), hint: t.part + ' ÷ ' + t.n + ' × 100.' }] });
      if (g) await api.say('avery', 'I’m putting that on my poster. With a woman pilot next to it.'); return g; } },
    { id: 'ex8-mind', who: 'jas', after: 2, pay: 800, label: 'Fixed or growth?', ask: 'I keep saying things like “I’m bad at this.” Can you sort my thoughts?', run: async function (api, seed) {
      var t = mindsetTask(seed); var g = await K.sort(api, { title: 'Help Jas: fixed or growth?', name: 'help-sort', leave: true, intro: 'A <b>fixed</b> thought says a skill can’t change. A <b>growth</b> thought says it can grow with practice.', bins: [{ id: 'fixed', label: 'Fixed', icon: '🧱' }, { id: 'growth', label: 'Growth', icon: '🌱' }], items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      if (g) await api.say('jas', 'I’m not good at interviews... yet. That feels better.'); return g; } },
    { id: 'ex8-shirt', who: 'dev', after: 3, pay: 1000, label: 'A small business', ask: 'I want to sell T-shirts like Kai. Can you check my numbers?', run: async function (api, seed) {
      var t = shirtTask(seed);
      var g = await api.calc({ title: 'Help Dev: T-shirt math', name: 'help-shirt', intro: '<p>Blank shirt: <b>' + fmtW(t.blank) + '</b>. Printing: <b>' + fmtW(t.print) + '</b>. Price: <b>' + fmtW(t.price) + '</b>. Dev buys <b>' + t.bought + '</b> and sells <b>' + t.sold + '</b>. (Sample prices.)</p>',
        fields: [{ k: 'e', name: 'Profit on one shirt', ans: t.each, hint: 'Price − (blank + printing).' }, { k: 'r', name: 'Profit (or loss, with a minus) for the whole order', ans: t.result, hint: t.sold + ' × ' + fmtW(t.price) + ' − ' + t.bought + ' × ' + fmtW(t.blank + t.print) + '.' }] });
      if (g) await api.say('dev', t.result >= 0 ? 'A profit! Small, but mine.' : 'A loss. Maybe I’ll start with fewer shirts.'); return g; } },
    { id: 'ex8-boss', who: 'rosa', after: 3, pay: 500, label: 'Being your own boss', ask: 'Can I ask you about running a business?', run: async function (api, seed) { return K.askGrade(await api.ask('rosa', BOSS_QS[seed % BOSS_QS.length], null)); } },
    { id: 'ex8-flip', who: 'worker', after: 2, pay: FLIP_PAY, label: 'An extra Mindset Flip', game: true, ask: 'I keep telling myself I’m “too old to learn.” Help me flip some thoughts?', run: async function (api, seed) {
      var r = await api.minigame(flipOpts(api, seed, true)); return K.gameGrade(r); } }
  ];
  var GOSSIP = [
    { id: 'g-lin-0', who: 'librarian', after: -1, lines: ['The Career Corner posters at the Community Centre are older than me.', 'The electrician has a mullet. A big one.'] },
    { id: 'g-gp-0', who: 'grandpa', after: -1, lines: ['When I was young, nobody had seen a woman electrician.', 'Now there’s one working on my wiring. She’s better than I ever was.'] },
    { id: 'g-avery-0', who: 'avery', after: -1, lines: ['My cousin Mia thinks only boys can be electricians.', 'She also thinks only grown-ups can like dinosaurs. She’s wrong about that too.'] },
    { id: 'g-priya-1', who: 'priya', after: 0, lines: ['I was the only girl in my CTS electrical class.', 'Now Joe’s shop has three of us. Things change when people see it’s possible.'] },
    { id: 'g-malik-1', who: 'malik', after: 0, lines: ['A kid asked me today if I was “the boy nurse.”', 'I said, “I’m the nurse.” He thought about it, and nodded.'] },
    { id: 'g-osei-2', who: 'osei', after: 1, lines: ['The survey results are posted. Nine out of ten pictured a man as an electrician.', 'Pictures in our heads come from somewhere. Maybe from our walls.'] },
    { id: 'g-cardinal-2', who: 'cardinal', after: 1, lines: ['I visit schools every spring. Every year, a few kids stay to ask questions.', 'One of them is an engineering student now.'] },
    { id: 'g-mia-3', who: 'mia', after: 2, lines: ['I fixed my bike chain today. By myself.', 'Is that what electricians do? Fix things? Because I like that.'] },
    { id: 'g-mayor-3', who: 'mayor', after: 2, lines: ['Those Career Corner posters were bought in 1985.', 'I approved the purchase. I was very young. And I had a mullet.'] },
    { id: 'g-mia-4', who: 'mia', after: 3, lines: ['I signed up for the job shadow day! With Priya!', 'I’m going to be an electrician. Or a dinosaur scientist. Or both.'] },
    { id: 'g-osei-4', who: 'osei', after: 3, lines: ['The {name} Open Doors Day is on the calendar for every spring.', 'Twenty-two kids signed up to shadow someone who doesn’t look like the old posters.'] },
    { id: 'g-malik-4', who: 'malik', after: 3, lines: ['Two Grade 7 boys asked to shadow me at the hospital.', 'One of them wants to be a nurse “like Malik.” I might cry.'] }
  ];
  function gossip(S, api) { return K.gossip(GOSSIP, api); }
  function mailTask(seed, last) {
    var k = mailKind(seed, last), from = 'Mr. Osei';
    if (k === 'gap') { var t = gapTask(seed); return { label: 'Town Mail: how big is the gap?', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', ref: dataHTML(), refLabel: 'Show the data', intro: '<p class="ct-small">A letter from Mr. Osei:</p><p>“' + esc(t.d.career) + ': ' + t.d.pct + '% ' + esc(t.d.group) + '. How far below 50% is that?”</p>', fields: [{ k: 'g', name: 'Percentage points below 50%', fmt: pFmt, ans: Math.round(t.gap * 100), hint: '50 − ' + t.d.pct + '.' }] }); } }; }
    if (k === 'survey') { var s = surveyTask(seed); return { label: 'Town Mail: survey math', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Mr. Osei:</p><p>“' + s.part + ' out of ' + s.n + ' students pictured a man as a pilot. What percent is that?”</p>', fields: [{ k: 'p', name: 'Percent', fmt: pFmt, ans: Math.round(s.pct * 100), hint: s.part + ' ÷ ' + s.n + ' × 100.' }] }); } }; }
    if (k === 'rep') { var q = REP_QS[seed % REP_QS.length]; return { label: 'Town Mail: ' + q.label, from: from, pay: 500, run: async function (api) { await api.say(null, 'A letter from Mr. Osei. He has a question.'); return K.askGrade(await api.ask('osei', q, null)); } }; }
    if (k === 'mindset') { var m = mindsetTask(seed); return { label: 'Town Mail: fixed or growth?', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, intro: 'A letter from Mr. Osei: “Fixed or growth?”', bins: [{ id: 'fixed', label: 'Fixed', icon: '🧱' }, { id: 'growth', label: 'Growth', icon: '🌱' }], items: m.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) }); } }; }
    var sh = shirtTask(seed);
    return { label: 'Town Mail: a small business', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Mr. Osei:</p><p>“A shirt costs ' + fmtW(sh.blank) + ' plus ' + fmtW(sh.print) + ' to print, and sells for ' + fmtW(sh.price) + '. What’s the profit on one?”</p>', fields: [{ k: 'e', name: 'Profit on one shirt', ans: sh.each, hint: 'Price − costs.' }] }); } };
  }

  async function interview(api, S, who) {
    var st = STORIES[who];
    for (var i = 0; i < st.lines.length; i++) { await api.say('you', st.lines[i][0]); await api.say(who, st.lines[i][1]); }
    S.cards[who] = st.card; api.toast('Story card added (' + Object.keys(S.cards).length + ' of 3)'); api.save();
  }
  function chapterSteps(ch, S, api) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the Community Centre and see Mr. Osei', 'osei');
        await api.say('osei', ['Welcome back! This term, the Community Centre wants to open doors: help kids see careers they never pictured for themselves.', 'Look at this data. It’s called representation: who is in a career, compared with the whole population.']);
        await api.ask('osei', { text: 'Women are about 50% of the population, and 4.8% of electrical apprentices (2018). What does that tell us?', opts: [['Women are under-represented. A gap that big suggests something is keeping people out.', 1, 'Yes. Not that they couldn’t do the job.'], ['Women don’t like electricity.', 0, 'The gap says something about the career’s welcome, not what people like.'], ['It’s equitable. Close enough.', 0, '4.8% is far below 50%.']] }, 'q-under', 'Reading representation data', 0);
        var g = await api.calc({ title: 'Engineers Canada’s goal', name: 'goal', noPay: true, ref: dataHTML(), refLabel: 'Show the data', intro: '<p>Engineers Canada set a goal: <b>30%</b> of new engineers should be women by 2030. In 2018 it was <b>17.4%</b>.</p>', fields: [{ k: 'g', name: 'How far from the goal (percentage points)', fmt: pFmt, ans: Math.round((ENG_GOAL - ENG_2018) * 100), hint: '30 − 17.4.' }] });
        api.record('q-enggoal', 'How far from the 30 by 30 goal', 0, g === 'first');
      }));
      a.push(step('focus', async function (api, S) {
        await api.say('osei', 'Your team picks one career where a group is under-represented. Which one?');
        var keys = ['elec', 'eng', 'nurse'], i = await api.choose('osei', 'Which career will your campaign open up?', ['Electrician: for girls and women', 'Engineer: for girls and women', 'Nurse: for boys and men']);
        S.focus = keys[i]; api.give('Campaign card', FOCUS[S.focus].icon, 'osei'); api.hud();
        await api.ask('osei', REP_QS[1], 'q-community', 'Why open careers matter to a whole town', 0);
      }));
      a.push(step('hunch', async function (api, S) { // the side story starts
        S.story.miaOut = 1; api.refresh();
        await api.quest('A Grade 6 student named Mia is outside the Community Centre', 'mia');
        await api.say('mia', ['I saw the Career Corner posters inside. Electrician, engineer, nurse.', 'I love fixing stuff. But electricians are boys. It’s on the poster.', 'So that’s not for me, I guess.']);
        await api.say('you', ['Hmm. I don’t think a poster decides that. But I want to find out why it looks that way.', 'I’ll keep notes.']);
        S.story.mia1 = 1; api.give('Campaign notes', '🔍', 'mia'); api.refresh();
      }));
      a.push(step('end1', async function (api, S) {
        await api.quest('Tell Mr. Osei what Mia said', 'osei');
        await api.say('osei', ['“That’s not for me.” I hear that a lot. Let’s find out where it comes from.', 'Now do Step 1 of your project: find the gap, with data.', 'Next time: how seeing someone like you changes what you try.']);
      }));
    }
    if (ch === 1) {
      a.push(step('lena', async function (api, S) {
        await api.quest('Mr. Osei has a story for you', 'osei');
        await api.say('osei', ['Lena loved fixing things, but she’d never met a woman electrician. She assumed it “wasn’t for girls.”', 'Then a woman electrician visited her school. Lena said, “I never knew I could do that.” She signed up for a CTS electrical course the next year.']);
        await api.ask('osei', REP_QS[2], 'q-rolemodel', 'Why role models matter', 1);
        await api.ask('osei', REP_QS[0], 'q-just', 'Jobs “for boys” or “for girls”', 1);
      }));
      a.push(step('survey', async function (api, S) { // clue 1: the picture-a-worker survey
        await api.quest('Run a quick survey with the Grade 6 class at the School', 'patel');
        await api.say('patel', ['Hi! I’m Ms. Patel. My class is ready. Ask away!']);
        await api.say('you', ['Everyone: close your eyes and picture an electrician. Now a nurse.', 'Hands up if you pictured a man as the electrician...']);
        await api.say('patel', ['Nine out of ten pictured a man as the electrician. Eight out of ten pictured a woman as the nurse.']);
        var g = await api.calc({ title: 'Survey results', name: 'survey', noPay: true, intro: '<p>10 Grade 6 students. <b>9</b> pictured a man as the electrician. <b>8</b> pictured a woman as the nurse.</p>', fields: [{ k: 'e', name: 'Percent who pictured a man as the electrician', fmt: pFmt, ans: Math.round(pct(SURVEY.elecMan, SURVEY.n) * 100), hint: '9 ÷ 10 × 100.' }, { k: 'n', name: 'Percent who pictured a woman as the nurse', fmt: pFmt, ans: Math.round(pct(SURVEY.nurseWoman, SURVEY.n) * 100), hint: '8 ÷ 10 × 100.' }] });
        api.record('story-survey', 'The picture-a-worker survey (percent)', 1, g === 'first');
        await api.say('mia', 'See? Everybody pictures the same thing as the posters.');
        S.story.survey = 1; api.toast('Added to your Campaign notes: the survey'); api.save();
      }));
      a.push(step('stories', async function (api, S) {
        await api.say('patel', ['Want real stories? Three people in town don’t look like the old posters. Go ask them how they got there.']);
        S.storyPhase = true; api.save();
        var order = [['priya', 'Priya at Bright Spark Electric'], ['malik', 'Nurse Malik at the hospital'], ['cardinal', 'Ms. Cardinal at Town Hall']];
        while (true) {
          var left = order.filter(function (o) { return !S.cards[o[0]]; }); if (!left.length) break;
          await api.quest('Ask for real stories: ' + left.map(function (o) { return o[1]; }).join(', ') + ' (' + (3 - left.length) + ' of 3)', left[0][0]);
          await interview(api, S, left[0][0]);
        }
        S.storyPhase = false; api.save();
        await K.typed(api, { id: 'reasons', title: 'Why is there a gap?', prompt: 'From the stories, name one reason for the gap in your career, and how it could be changed.' });
      }));
      a.push(step('end2', async function (api, S) {
        await api.quest('Tell Mr. Osei about the stories', 'osei');
        await api.say('osei', ['Role models, mentors, a welcome. That’s what opened the door for each of them.', 'Now do Step 2 of your project: find one real story, and the reasons for the gap.', 'Next time: growth mindset. And maybe a look at those posters.']);
      }));
    }
    if (ch === 2) {
      a.push(step('ben', async function (api, S) {
        await api.quest('Mr. Osei wants to talk about employability skills', 'osei');
        await api.say('osei', ['Employability skills help you in any job: communication, collaboration, problem solving, critical thinking, technology use and time management.', 'Nobody is born with them. They grow with practice. Ben says “I’m bad at time management.” A growth mindset changes that to “not good at it YET.”']);
        await K.sort(api, { title: 'Fixed or growth?', name: 'mindset', story: true, key: 'q-mindset', label: 'Fixed or growth thoughts', ch: 2, intro: 'A <b>fixed</b> thought says a skill can’t change. A <b>growth</b> thought says it can grow with practice.', bins: [{ id: 'fixed', label: 'Fixed', icon: '🧱' }, { id: 'growth', label: 'Growth', icon: '🌱' }],
          items: [[MINDSETS[0][0], 'fixed'], [MINDSETS[0][1], 'growth'], [MINDSETS[1][0], 'fixed'], [MINDSETS[2][1], 'growth'], [MINDSETS[7][0], 'fixed'], [MINDSETS[4][1], 'growth']].map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      }));
      a.push(step('flip1', async function (api, S) { await flipRound(api, S, 'ch3', 3); }));
      a.push(step('plan', async function (api, S) {
        await api.quest('Go home and make your employability skill plan', 'table');
        await K.chips(api, { id: 'skill', title: 'My skill plan', name: 'skillplan', intro: 'Pick <b>one</b> employability skill to build this month.', groups: [{ k: 's', label: 'My skill', min: 1, max: 1, opts: SKILLS.map(function (x) { return { k: x[0], label: x[1], icon: x[2] }; }) }],
          texts: [{ k: 'fixed', label: 'A fixed thought I sometimes have about it', min: 4 }, { k: 'growth', label: 'My growth thought instead', min: 4 }, { k: 'exp', label: 'An experience that builds it (and when)', min: 4 }], saveText: 'Save my skill plan' });
        api.give('Skill plan', '🌱', 'table');
      }));
      a.push(step('posters', async function (api, S) { // clue 2 and the source: the posters
        await api.quest('Look at the Career Corner posters with Mr. Osei', 'osei');
        await api.say('osei', ['Here they are. The Career Corner. Let’s look closely.']);
        await K.inspect(api, { title: 'The Career Corner posters', name: 'posters', story: true, key: 'story-posters', label: 'The Career Corner posters: what keeps doors closed', ch: 2, find: 'Find the 4 things that tell kids a career “isn’t for them”', cols: 3,
          intro: 'Tap everything that could make a kid think a career isn’t for them.',
          spots: [{ id: 'elec', icon: '⚡', label: 'Electrician poster: only men, all smiling the same', bad: true, why: 'Only one kind of person is shown.', hint: 'Who is in each picture?' }, { id: 'nurse', icon: '🩺', label: '“Nursing: a caring career for girls”', bad: true, why: 'It tells boys this isn’t for them.' },
            { id: 'eng', icon: '🏗️', label: '“Engineering: for brilliant young men”', bad: true, why: 'It tells girls and many others this isn’t for them.' }, { id: 'date', icon: '📅', label: 'Printed in 1985, never updated', bad: true, why: 'Careers, and who works in them, have changed.' },
            { id: 'wage', icon: '💵', label: 'What each career does, and where to learn more', fine: 'Information is great. It’s the pictures and words that close doors.' }, { id: 'ask', icon: '🧑‍🏫', label: '“Ask your counsellor about this career”', fine: 'Good advice for everyone.' }] });
        await api.say('osei', ['1985. Every kid who walks in here sees these. Mia did.', 'Your campaign could replace them. With real people from our town.']);
        S.story.posters = 1; api.toast('Added to your Campaign notes: the posters'); api.save();
      }));
      a.push(step('end3', async function (api, S) {
        await api.say('osei', ['Now do Step 3 of your project: your skill plan.', 'Next time: plan the campaign. And the launch, for the Grade 6 class.']);
      }));
    }
    if (ch === 3) {
      a.push(step('kai', async function (api, S) {
        await api.quest('Mr. Osei wants you to meet Kai, a young entrepreneur', 'osei');
        await api.say('osei', ['Running a campaign is a bit like running a business. Kai, 14, sells custom T-shirts.', 'A blank shirt costs $8. Printing costs $4. He sells them for $20. He’s thinking of buying 50.']);
        var g = await api.calc({ title: 'Kai’s T-shirts', name: 'kai', noPay: true, intro: '<p>Blank shirt <b>$8</b>, printing <b>$4</b>, price <b>$20</b>. (Sample prices.)</p>', fields: [{ k: 'c', name: 'Cost per shirt', ans: kaiCost(), hint: '$8 + $4.' }, { k: 'p', name: 'Profit per shirt', ans: kaiProfitEach(), hint: '$20 − $12.' }, { k: 'a', name: 'Profit if he buys 15 and sells all 15', ans: kaiResult(15, 15), hint: '15 × $8.' }, { k: 'b', name: 'Profit or loss if he buys 50 and sells only 20 (a loss gets a minus)', ans: kaiResult(50, 20), hint: '20 × $20 − 50 × $12.' }] });
        api.record('q-kai', 'Kai’s T-shirts: cost, profit and risk', 3, g === 'first');
        await api.ask('osei', BOSS_QS[0], 'q-norisk', 'Being your own boss: no risk?', 3);
      }));
      a.push(step('campaign', async function (api, S) {
        await api.quest('Go home and plan the campaign', 'table');
        var f = FOCUS[S.focus], m = STORIES[f.model];
        await K.pick(api, { id: 'message', title: 'Our campaign message', name: 'pickmsg', intro: 'Campaign: <b>' + esc(f.career) + '</b> for <b>' + esc(f.group) + '</b>. Pick a main message.',
          options: [{ k: 'you', title: '“You can do this.”', icon: '💪', lines: [['Shows', 'a role model like them'], ['Feeling', 'possible']] }, { k: 'try', title: '“Try it first.”', icon: '🧪', lines: [['Shows', 'a CTS course or a job shadow'], ['Feeling', 'low risk']] }, { k: 'need', title: '“We need you.”', icon: '🤝', lines: [['Shows', 'the shortage and the gap'], ['Feeling', 'wanted']] }],
          reasonPrompt: 'Why will this message work for your audience?', tradeoff: 'Risk check: what could go wrong with the campaign, and how will you manage it?' });
        await api.say('you', ['Our role model: ' + m.name + '. One fact: the data, with its year. One action: sign up for the job shadow day.']);
        api.give('Campaign plan', '📣', 'table');
      }));
      a.push(step('launch', async function (api, S) { // the hero beat: the campaign launch
        S.scene = 'launch'; api.refresh();
        await api.quest('The campaign launch is starting at the Community Centre!', 'osei');
        api.fx.face('all');
        await api.say('osei', ['Welcome, Grade 6! Today, new Career Corner posters, made by our students, with real people from our town.', api.profile.name + ', take it away.']);
        if (!S.launch) S.launch = { got: 0, asked: {} };
        var f = FOCUS[S.focus], Qs = [
          ['q-launch-gap', 'kid1', { text: 'Why are there so few ' + f.group.split(' ')[0] + ' in this career?', opts: [['Things like few role models, and not feeling welcome. Not because they can’t do it.', 1, 'Oh. That makes sense.'], ['Because they aren’t good at it.', 0, 'The stories show they are.'], ['Because it’s the rule.', 0, 'There’s no such rule.']] }],
          ['q-launch-try', 'mia', { text: 'What if I try it and I’m not good at it?', opts: [['Skills grow with practice. You’re not good at it yet, and that’s how everyone starts.', 1, 'Yet. Okay. I like yet.'], ['Then it’s not for you. Quit.', 0, 'That’s a fixed thought. Flip it!'], ['Only try things you’re already good at.', 0, 'Then you’d never try anything new.']] }],
          ['q-launch-data', 'kid2', { text: 'Is that data from this year?', opts: [['No, it’s from 2018 and 2019. Newer data may be different, so we’d look for it.', 1, 'Cool. You checked.'], ['Yes, from today.', 0, 'Check the year on the poster.'], ['Data never changes.', 0, 'Data changes every year.']] }],
          ['q-launch-do', 'patel', { text: 'What can my students actually do next?', opts: [['Sign up for the job shadow day, or try a CTS course, to see if they like it.', 1, 'Wonderful. Low risk, real experience.'], ['Decide their career today.', 0, 'Too soon! Try it first.'], ['Nothing until Grade 12.', 0, 'Experiences now build skills and motivation.']] }]
        ];
        for (var i = 0; i < Qs.length; i++) {
          var q = Qs[i]; if (S.launch.asked[q[0]]) continue;
          var r = await api.ask(q[1], q[2], q[0], 'Campaign launch: ' + q[2].text, 3);
          S.launch.asked[q[0]] = 1; if (r.first) { S.launch.got++; api.fx.rise(q[1], '+1'); }
          api.save(); api.hud();
        }
        S.win = S.launch.got >= POINTS_TO_WIN; api.save();
        await api.say('patel', S.win ? 'My whole class wants to sign up for a job shadow!' : 'Thank you! A few kids are still unsure. You can replay this chapter from the Menu.');
        await api.say('mia', ['Priya is on the new poster. She fixes things, like me.', 'I’m signing up to shadow her. Electrician is for me after all.']);
        S.story.launch = 1; api.save();
        await K.hero(api, { who: 'osei', lines: ['From now on, every spring, kids can shadow someone in a career they never pictured for themselves.', 'It started with ' + api.profile.name + '’s campaign. So it’s the ' + api.profile.name + ' Open Doors Day.'],
          medal: 'Open Doors medal', icon: '🚪', kicker: 'Campaign launch', title: 'The ' + api.profile.name + ' Open Doors Day', thanks: [['priya', 'Three more girls asked me about electrical today. Three!']], reply: ['Thanks! If you’ve never seen someone like you in a career, maybe you’ll be the first.'] });
        S.story.hero = 1; S.scene = null; api.refresh();
      }));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and pin your skill plan to your My Plan wall', 'myplan');
        var sk = S.typed.skill && S.typed.skill.s ? S.typed.skill.s[0] : null, firstTime = !S.finished; S.finished = true;
        if (firstTime) api.profileAdd('closet', 'campaign');
        api.profileAdd('plan', { mission: '8-experiences', title: 'Open Doors', text: 'Campaign: ' + FOCUS[S.focus].career + ' for ' + FOCUS[S.focus].group + '. My skill to build: ' + (sk ? SKILLS.filter(function (x) { return x[0] === sk; })[0][1] : '—') + ' (not yet, but growing).' });
        api.profileAdd('finished', '8-experiences'); api.refresh();
        await api.say('osei', [S.win ? 'A convinced class, and a day named after you!' : 'A day named after you! Next time, convince the whole class.', 'Your closet has a new Campaign tee, and your My Plan wall has a new page.', 'Now do Step 4 of your project: plan your team’s campaign.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }

  T.mission({
    id: '8-experiences', unitLabel: 'CEFL Grade 8 · Experiences and Employment · Project: Open Doors', title: 'Open Doors: Who Gets to Picture It?',
    iCan: 'I can use data to describe representation in careers, explain how role models shape choices, and build a skill with a growth mindset.',
    foot: 'This is a model. Data: Statistics Canada 2018 (via CLAC), Engineers Canada 2018, Canadian Nurses Association 2019. Newer data may differ. The people are made up.',
    bagTip: 'Your Bag holds what you collect: your campaign card, story cards, your skill plan and your Campaign notes.',
    realRule: 'Real gives no hints, and the Grade 6 class still needs 3 good answers', afterLine: 'Mission complete. Open Menu → Report to show your teacher.',
    chapters: [
      { name: 'Who is in the job?', step: 'Step 1', moment: 'Moment 1: representation' },
      { name: 'Seeing yourself', step: 'Step 2', moment: 'Moment 2: seeing yourself in a career' },
      { name: 'Growth mindset', step: 'Step 3', moment: 'Moment 3: growth mindset and skills' },
      { name: 'Plan the campaign', step: 'Step 4', moment: 'Moment 4: skills for entrepreneurs' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps, guide: 'osei',
    helpers: function () { return HELPS; }, gossip: gossip, mail: function (S, seed, last) { return mailTask(seed, last); },
    outfit: function (S) { return S.finished ? 'campaign' : 'none'; },
    placeObjects: function (api) { api.place('table', 'home', 4, 3, { label: 'Kitchen table' }); api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true }); api.place('corner', 'community', 1, 5, { draw: 'poster', label: 'The Career Corner' }); },
    people: function (S) {
      var out = {}, s = S.story;
      out.osei = { name: 'Mr. Osei', role: 'Community Centre', map: 'community', x: 4, y: 3, dir: 'down', look: { base: 2, skin: 's5', hair: 'black', shirt: 'green', pants: '#2f3a5c' } };
      out.patel = { name: 'Ms. Patel', role: 'Grade 6 teacher', map: 'school', x: 4, y: 3, dir: 'down', look: { base: 3, skin: 's2', hair: 'brown', shirt: 'purple', pants: '#3b3f5c' } };
      out.mia = { name: 'Mia', role: 'Grade 6', map: 'town', x: 30, y: 12, dir: 'down', look: { base: 1, skin: 's3', hair: 'black', shirt: 'yellow', pants: '#3d4a6b' }, hidden: !s.miaOut };
      out.priya = { name: 'Priya', role: 'Apprentice electrician', map: 'electric', x: 4, y: 3, dir: 'down', look: { base: 1, skin: 's4', hair: 'black', shirt: 'orange', pants: '#2f2f38' } };
      out.malik = { name: 'Nurse Malik', role: 'Nurse', map: 'hospital', x: 2, y: 4, dir: 'right', look: { base: 2, skin: 's4', hair: 'black', shirt: 'teal', pants: '#2e7d7d' } };
      out.cardinal = { name: 'Ms. Cardinal', role: 'Engineer', map: 'townhall', x: 6, y: 4, dir: 'left', look: { base: 3, skin: 's4', hair: 'black', shirt: 'blue', pants: '#2f3a5c' } };
      if (S.scene === 'launch') { // the crowd stands along row 3; row 4 stays open
        out.kid1 = { name: 'Omar', role: 'Grade 6', map: 'community', x: 1, y: 3, dir: 'down', look: { base: 0, skin: 's3', hair: 'black', shirt: 'red', pants: '#3d4a6b' } };
        out.mia = { name: 'Mia', role: 'Grade 6', map: 'community', x: 2, y: 3, dir: 'down', look: out.mia.look };
        out.kid2 = { name: 'Zoe', role: 'Grade 6', map: 'community', x: 3, y: 3, dir: 'down', look: { base: 3, skin: 's1', hair: 'ginger', shirt: 'teal', pants: '#3d4a6b' } };
        out.patel = { name: 'Ms. Patel', role: 'Grade 6 teacher', map: 'community', x: 5, y: 3, dir: 'down', look: out.patel.look };
        out.priya = { name: 'Priya', role: 'Apprentice electrician', map: 'community', x: 7, y: 3, dir: 'down', look: out.priya.look };
      }
      return out;
    },
    doorOpen: function (id) { return !!{ home: 1, grandpa: 1, community: 1, school: 1, electric: 1, hospital: 1, townhall: 1, library: 1, bank: 1 }[id]; },
    lockedLine: function (id) { return T.world.building(id).name + ' is closed right now. Try the Community Centre.'; },
    talk: function (id, S, api) {
      if (S.storyPhase && STORIES[id] && !S.cards[id]) { interview(api, S, id).then(function () { api.questText('Real stories: ' + Object.keys(S.cards).length + ' of 3. Keep going.'); }); return true; }
      var s = S.story, done = S.finished;
      var lines = {
        osei: done ? 'Open doors. Every spring.' : 'Your next goal is on the gold line at the top.',
        mia: s.hero ? 'I’m shadowing Priya! I have my own safety glasses!' : s.posters ? 'The posters are from 1985? That’s ancient.' : s.mia1 ? 'Electricians are boys. It’s on the poster.' : 'I like fixing things.',
        priya: S.cards.priya ? 'Mentors and a network. That’s what kept me going.' : 'Apprentice electrician. Paid to learn!', malik: S.cards.malik ? 'I’m the nurse. Not the boy nurse. The nurse.' : 'Wash your hands. I mean it.',
        cardinal: S.cards.cardinal ? 'Stick bridges by the creek. That’s where it started.' : 'Town engineer. I keep the bridges up.', patel: 'My class is full of future everything.',
        corner: s.hero ? 'The new Career Corner: Priya, Nurse Malik, Ms. Cardinal, and more townspeople.' : 'The Career Corner. The posters are very... 1985.',
        avery: 'My cousin Mia fixed her bike chain! By herself!', grandpa: 'A woman electrician fixed my wiring. Better than I ever did.',
        table: 'The kitchen table. Good for planning a campaign.',
        myplan: K.planLine(api)
      };
      return lines[id] || null;
    },
    hud: function (S) {
      var out = [{ label: 'Campaign', value: S.focus ? FOCUS[S.focus].career : '—' }, { label: 'Stories', value: Object.keys(S.cards).length + ' / 3' }];
      if (S.launch) out.push({ label: 'Grade 6', value: S.launch.got + ' / 4', title: '3 good answers convince the class' });
      return out;
    },
    items: function (S) {
      var it = [{ name: 'Data card', icon: '📊', note: 'Representation (dated)', view: dataHTML }];
      if (S.focus) it.push({ name: 'Campaign card', icon: FOCUS[S.focus].icon, note: FOCUS[S.focus].career + ' for ' + FOCUS[S.focus].group, view: function () { var f = FOCUS[S.focus], d = S.typed.message; return '<p><b>' + esc(f.career) + '</b> for <b>' + esc(f.group) + '</b>.</p>' + (d ? '<p><b>Message:</b> ' + esc({ you: '“You can do this.”', try: '“Try it first.”', need: '“We need you.”' }[d.pick]) + '</p><p><b>Why:</b> ' + esc(d.reason) + '</p><p><b>Risk check:</b> ' + esc(d.tradeoff) + '</p>' : ''); } });
      if (Object.keys(S.cards).length) it.push({ name: 'Story cards', icon: '📇', note: Object.keys(S.cards).length + ' of 3', view: function () { return K.notes(Object.keys(S.cards).map(function (k) { return esc(S.cards[k]); })); } });
      if (S.typed.skill) it.push({ name: 'Skill plan', icon: '🌱', note: 'Not yet, but growing', view: function () { var k = S.typed.skill; return '<p><b>Skill:</b> ' + esc((SKILLS.filter(function (x) { return x[0] === (k.s || [])[0]; })[0] || ['', '—'])[1]) + '</p><p><b>Fixed thought:</b> ' + esc(k.fixed || '') + '</p><p><b>Growth thought:</b> ' + esc(k.growth || '') + '</p><p><b>Experience that builds it:</b> ' + esc(k.exp || '') + '</p>'; } });
      if (S.story.mia1) it.push({ name: 'Campaign notes', icon: '🔍', note: 'The Career Corner posters', view: function () { return K.notes(notes(S)); } });
      if (S.story.hero) it.push({ name: 'Open Doors medal', icon: '🚪', note: 'The ' + T.api.profile.name + ' Open Doors Day', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🚪</p><p style="text-align:center"><b>Open Doors</b><br>For changing the pictures kids see.</p>'; } });
      return it;
    },
    report: function (S) {
      var h = '<p>Campaign: <b>' + (S.focus ? esc(FOCUS[S.focus].career + ' for ' + FOCUS[S.focus].group) : 'not picked yet') + '</b>' + (S.finished ? ' · Launch: <b>' + S.launch.got + ' of 4</b> (' + (S.win ? 'the class was convinced' : 'goal not reached') + ')' : '') + '</p>';
      var fl = Object.keys(S.flips); if (fl.length) h += '<h3>Mindset Flip</h3>' + K.table(fl.map(function (k) { var x = S.flips[k]; return ['Chapter 3', String(x.score), K.TIER_WORD[x.tier]]; }), ['When', 'Score', 'Result']);
      h += K.wrote(S, [['reasons', 'A reason for the gap, and a change'], ['message', 'Campaign message', function (k) { return { you: '“You can do this.”', try: '“Try it first.”', need: '“We need you.”' }[k]; }]]);
      if (S.typed.skill) h += '<p><b>Skill plan:</b> ' + esc(S.typed.skill.fixed || '') + ' → ' + esc(S.typed.skill.growth || '') + '</p>';
      h += '<h3>The Career Corner posters</h3><p>' + (S.story.hero ? 'Solved: the 1985 posters were replaced with townspeople, and the job-shadow day was named after them.' : S.story.posters ? 'Found what was wrong with the posters.' : S.story.mia1 ? 'Collecting clues.' : 'Not started.') + '</p>';
      return h;
    },
    test: { scenes: [null, { story: { miaOut: 1 } }, { scene: 'launch', focus: 'elec', story: { miaOut: 1 } }], DATA: DATA, SURVEY: SURVEY, pct: pct, kaiResult: kaiResult, MINDSETS: MINDSETS, GAME_CFGS: GAME_CFGS, surveyTask: surveyTask, gapTask: gapTask, shirtTask: shirtTask, mindsetTask: mindsetTask, mailTask: mailTask, HELPS: HELPS, GOSSIP: GOSSIP }
  });
  function notes(S) {
    var s = S.story, li = [];
    if (s.mia1) li.push('<b>Mia, Grade 6:</b> loves fixing things, but “electricians are boys. It’s on the poster.”');
    if (s.survey) li.push('<b>The survey:</b> 9 of 10 Grade 6 students pictured a man as the electrician (90%); 8 of 10 pictured a woman as the nurse (80%).');
    if (Object.keys(S.cards).length === 3) li.push('<b>Real stories:</b> Priya, Nurse Malik and Ms. Cardinal each saw someone like them, or had a mentor, and it opened the door.');
    if (s.posters) li.push('<b>The Career Corner:</b> posters from 1985 show one kind of person per career, with words like “for girls” and “for young men.”');
    if (s.launch) li.push('<b>The launch:</b> Mia signed up to shadow Priya.');
    if (s.hero) li.push('<b>The ' + esc(T.api.profile.name) + ' Open Doors Day:</b> every spring, kids shadow someone in a career they never pictured for themselves.');
    return li;
  }
})();
