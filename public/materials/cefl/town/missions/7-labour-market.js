/* CEFL Town mission: Grade 7 Careers and the Labour Market — "Career Day" (companion to the project Career Pathway Map). LO 7-LM.
   Four chapters, one after each project step: Me, now (job or career) · Skills that travel · Pick a career (interests and values) ·
   Research and talk (pay, training, fit; a real conversation). The town holds a Career Café, and you build a path map to bring to it.
   Model (MODEL START … END, no DOM): five real Alberta careers (ALIS 2023 wages, from the workbook), how well a career fits a person's
   interests and values, the path steps for each career, and the job-shadow game's cards. Goal: earn at least 4 of 5 stickers at the
   Career Café (visitors' questions about your map, first try). The job-shadow game (kit sortRush) earns skill stars for your growth
   plan; it never changes the stickers.
   Side story, "The One True Career quiz" (STORY in the steps): Coach Max's $5 quiz at Town Square tells people their one career,
   forever. Jas's hunch (Ch 1) → Jas's skills travel (Ch 2) → Dev's result ignores his interests; the quiz card itself (Ch 3) → Avery's
   "pay is all that matters"; the Career Café, where Coach Max tells his own winding path and the Path Wall is named after you (Ch 4).
   Between lessons (HELP START … HELP END): townspeople's own career questions, an extra job shadow, and Town Mail, on fresh seeds.
   Simplifications: the five careers' wages are averages for all experience levels (ALIS 2023); training paths are typical routes;
   fit is counted from shared interests and values, which real career tools weigh in more ways. */
(function () {
  'use strict';

/* MODEL START ── no DOM. Wages in cents an hour. ── */
var INTERESTS = [['helping', 'Helping people', '🤝'], ['build', 'Building and fixing', '🔧'], ['animals', 'Animals', '🐾'], ['tech', 'Computers and tech', '💻'], ['science', 'Science', '🔬'],
  ['kids', 'Kids', '🧸'], ['outside', 'Being outside', '🌲'], ['art', 'Art and making things', '🎨'], ['puzzles', 'Puzzles', '🧩'], ['sports', 'Sports', '🏀']];
var VALUES = [['help', 'Helping people', '💗'], ['outdoors', 'Working outside', '☀️'], ['make', 'Making things', '🛠️'], ['team', 'Working with a team', '👥'], ['money', 'Earning a lot', '💰']];
var CAREERS = { // ALIS 2023 Alberta Wage and Salary Survey averages (workbook Moment 4)
  nurse:       { name: 'Registered nurse', icon: '🩺', wage: 4738, train: 'A 4-year university degree in nursing', years: 4, paid: false, where: 'Hospitals, clinics and care homes',
                 I: ['helping', 'science'], V: ['help', 'team', 'money'], who: 'nurse',
                 path: [['Biology and chemistry in high school', 'learning', '15–17'], ['Volunteer at a care home', 'experience', '16'], ['4-year nursing degree', 'learning', '18–22'], ['Registered nurse at a hospital', 'job', '22+']] },
  software:    { name: 'Software developer', icon: '💻', wage: 4455, train: 'A university degree or a 2-year college diploma in computing', years: 2, paid: false, where: 'Offices, or from home',
                 I: ['tech', 'puzzles'], V: ['make', 'money'], who: 'milo',
                 path: [['Coding club at school', 'experience', '13'], ['Math and computing in high school', 'learning', '15–17'], ['Computing degree or 2-year diploma', 'learning', '18–21'], ['Junior developer at a tech company', 'job', '21+']] },
  electrician: { name: 'Electrician', icon: '⚡', wage: 3841, train: 'A 4-year apprenticeship: paid work on job sites, plus short classes', years: 4, paid: true, where: 'Homes, stores and job sites',
                 I: ['build', 'outside', 'puzzles'], V: ['outdoors', 'make', 'money'], who: 'joe',
                 path: [['Shop class and math in high school', 'learning', '15–17'], ['Summer job helping a contractor', 'job', '17'], ['Apprentice on job sites (paid)', 'job', '18–22'], ['Trades classes at the Polytechnic', 'learning', '18–22']] },
  vettech:     { name: 'Veterinary technician', icon: '🐾', wage: 2557, train: 'A 2-year college diploma', years: 2, paid: false, where: 'Animal clinics, shelters and farms',
                 I: ['animals', 'science', 'helping'], V: ['help', 'team'], who: 'vet',
                 path: [['Help out at a pet shelter', 'experience', '14'], ['Biology in high school', 'learning', '15–17'], ['2-year vet tech diploma', 'learning', '18–20'], ['Vet tech at an animal clinic', 'job', '20+']] },
  ece:         { name: 'Early childhood educator', icon: '🧸', wage: 1905, train: 'A 1-year certificate or a 2-year college diploma', years: 1, paid: false, where: 'Daycares, preschools and day homes',
                 I: ['kids', 'helping', 'art'], V: ['help', 'team'], who: 'rivera',
                 path: [['Babysitting course', 'learning', '13'], ['Volunteer helper at a day camp', 'experience', '16'], ['Early learning certificate or diploma', 'learning', '18–19'], ['Educator at a daycare', 'job', '19+']] }
};
var CAREER_KEYS = ['nurse', 'software', 'electrician', 'vettech', 'ece'];
/* Fit: one point for each of the person's interests and values the career shares */
function fitOf(ck, me) { var c = CAREERS[ck], n = 0; (me.I || []).forEach(function (k) { if (c.I.indexOf(k) >= 0) n++; }); (me.V || []).forEach(function (k) { if (c.V.indexOf(k) >= 0) n++; }); return n; }
function fitWord(n) { return n >= 3 ? 'A good fit' : n >= 1 ? 'Some fit' : 'Not much fit'; }
function bestFit(me) { var best = null, bn = -1, second = -1; CAREER_KEYS.forEach(function (k) { var n = fitOf(k, me); if (n > bn) { second = bn; bn = n; best = k; } else if (n > second) second = n; }); return { k: best, n: bn, margin: bn - second }; }
var JAYDEN = { I: ['build', 'outside'], V: ['outdoors', 'help'] }; // workbook Moment 3: building, fixing bikes, being outside; values working outside and helping his town
var DEV = { I: ['animals', 'helping'], V: ['help', 'team'] };     // the story: the quiz told Dev "astronaut"
function wageDiff(a, b) { return CAREERS[a].wage - CAREERS[b].wage; }
function weekPay(k, h) { return CAREERS[k].wage * h; }
var STICKERS_TO_WIN = 4;

/* Sorting tasks (graded). The wrong choices come from the unit's misconceptions: a career is chosen once; skills only count where you
   learned them; the career that pays most is always best. */
var JOB_OR_CAREER = [
  ['Working at a grocery store checkout this summer', 'job', 'One role, for one summer.'], ['Thirty years with animals: farm helper, vet tech, then clinic manager', 'career', 'A path of many roles over many years.'],
  ['Coaching a kids’ soccer team', 'job', 'One role you do now.'], ['Babysitter, then college, then daycare director', 'career', 'Learning and jobs, one step after another.'],
  ['One shift at a store', 'job', 'One role, even shorter than a summer.'], ['Lifeguard this summer', 'job', 'One role, for now.'],
  ['Dishwasher, then cook, then chef, then restaurant owner', 'career', 'Each job led to the next one.'], ['Paper route at age 12', 'job', 'One role, often a first one.'],
  ['Camp counsellor, then teacher, then principal', 'career', 'A path that grew over many years.'], ['Selling shoes on Saturdays', 'job', 'One role. It could be a step in a career.']
];
var SKILLS = [['comm', 'Communication', '💬'], ['team', 'Teamwork', '🤝'], ['time', 'Time management', '⏰'], ['solve', 'Problem solving', '🧩']];
/* Job-shadow cards: a task from one of the five careers, and the transferable skill it uses most. */
var TASKS = [
  ['Explain a cast to a nervous kid', 'comm', '🩺'], ['Write clear notes for the next nurse', 'comm', '🩺'], ['Tell a pet owner how to give the medicine', 'comm', '🐾'], ['Answer a customer’s question about their wiring', 'comm', '⚡'], ['Read the daily plan out loud to the class', 'comm', '🧸'], ['Explain a bug to your team in plain words', 'comm', '💻'], ['Call a family to tell them pickup is early', 'comm', '🧸'],
  ['Lift a patient with another nurse', 'team', '🩺'], ['Hold the ladder while your partner wires the light', 'team', '⚡'], ['Split lunch duty with the other educators', 'team', '🧸'], ['Help the vet hold a wiggly dog still', 'team', '🐾'], ['Check a teammate’s code before it ships', 'team', '💻'], ['Pass tools to the crew on the job site', 'team', '⚡'],
  ['Give 6 patients their medicine on time', 'time', '🩺'], ['Finish the wiring before the drywall crew comes', 'time', '⚡'], ['Fit snack, nap and pickup into the afternoon', 'time', '🧸'], ['Get the app update done by Friday', 'time', '💻'], ['Clean every kennel before the clinic opens', 'time', '🐾'], ['Plan your shifts around your classes', 'time', '📅'],
  ['Find out why the breaker keeps tripping', 'solve', '⚡'], ['Figure out why the app crashes', 'solve', '💻'], ['Find out why a dog won’t eat', 'solve', '🐾'], ['A patient’s alarm beeps: find the cause', 'solve', '🩺'], ['The playground gate won’t latch: work out why', 'solve', '🧸'], ['The printer jams every time: find what is stuck', 'solve', '🖨️']
];
var GAME_CFGS = {
  shadow: { kind: 'sortRush', cfg: { id: 'shadow', name: 'Job shadow', scoreWord: 'Tasks matched', win: [7000, 5200], think: 1500, th: [[15, 6], [15, 6]],
    bins: SKILLS.map(function (s) { return { id: s[0], label: s[1], icon: s[2] }; }),
    items: TASKS.map(function (t) { return { t: t[0], bin: t[1], icon: t[2], why: { comm: 'It is about talking, explaining or writing clearly.', team: 'You do it together with someone.', time: 'It is about getting things done on schedule.', solve: 'You have to find out what is wrong and fix it.' }[t[1]] }; }) } }
};
/* MODEL END */

/* HELP START ── between lessons: townspeople's own career questions, on fresh seeds. Nothing here touches the mission. No DOM. ── */
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function pickN(r, a, n) { var b = a.slice(), out = []; while (out.length < n && b.length) out.push(b.splice(Math.floor(r() * b.length), 1)[0]); return out; }
function jobCareerTask(seed) { var r = RNG(seed * 13 + 1); r(); var j = pickN(r, JOB_OR_CAREER.filter(function (x) { return x[1] === 'job'; }), 2), c = pickN(r, JOB_OR_CAREER.filter(function (x) { return x[1] === 'career'; }), 2); return pickN(r, j.concat(c), 4); }
var FIRST_JOBS = [ // where a first job led (the entry event, and Grandpa's guessing game)
  ['Babysitter', 'Daycare director', 'Babysitting showed her she loved working with kids.'], ['Dishwasher', 'Chef', 'He watched the cooks every night, then trained as one.'], ['Farm helper', 'Vet clinic manager', 'Caring for farm animals led to animal care.'],
  ['Paper carrier', 'Bus driver', 'Knowing every street in town helped.'], ['Pool lifeguard', 'Paramedic', 'First aid training was the first step.'], ['Library page', 'Librarian', 'Shelving books led to running the library.'],
  ['Grocery stocker', 'Store manager', 'She learned every part of the store.'], ['Bike repair helper', 'Mechanic', 'Fixing bikes led to fixing cars.']
];
function firstJobTask(seed) { var r = RNG(seed * 17 + 3); r(); return pickN(r, FIRST_JOBS, 3); }
function skillAdTask(seed) { var r = RNG(seed * 19 + 5); r(); var out = []; SKILLS.forEach(function (s) { var pool = TASKS.filter(function (t) { return t[1] === s[0]; }); out.push(pool[Math.floor(r() * pool.length)]); }); return pickN(r, out, 4); }
var TRAVEL = [ // a skill that travels to other jobs, or one that is mostly for this job
  ['Helping a customer who is upset', 'yes'], ['Knowing every shoe size of every brand', 'no'], ['Showing up on time for every shift', 'yes'], ['Working with the team on a busy Saturday', 'yes'],
  ['Lacing up display shoes the store’s way', 'no'], ['Counting the till at closing', 'yes'], ['Knowing where the mop is kept at this store', 'no'], ['Explaining a return policy clearly', 'yes'],
  ['Using this restaurant’s ordering screen', 'no'], ['Solving a problem when a delivery is late', 'yes'], ['Remembering this clinic’s door code', 'no'], ['Keeping calm when it gets busy', 'yes']
];
function travelTask(seed) { var r = RNG(seed * 23 + 7); r(); var y = pickN(r, TRAVEL.filter(function (t) { return t[1] === 'yes'; }), 2), n = pickN(r, TRAVEL.filter(function (t) { return t[1] === 'no'; }), 2); return pickN(r, y.concat(n), 4); }
/* A fit check with one clear best career among the three offered: it shares 3 or more interests and values, and each other choice
   shares at least 2 fewer (so a nearly-as-good career is never marked wrong) */
function fitTask(seed) {
  var r = RNG(seed * 29 + 11), tries; r();
  for (tries = 0; tries < 300; tries++) {
    var ck = CAREER_KEYS[Math.floor(r() * CAREER_KEYS.length)], c = CAREERS[ck], other = INTERESTS.map(function (x) { return x[0]; }).filter(function (k) { return c.I.indexOf(k) < 0; });
    var me = { I: pickN(r, c.I, 2).concat(r() < 0.5 ? pickN(r, other, 1) : []), V: pickN(r, c.V, r() < 0.5 ? 1 : 2) }, n = fitOf(ck, me);
    var low = CAREER_KEYS.filter(function (k) { return k !== ck && fitOf(k, me) <= n - 2; });
    if (n >= 3 && low.length >= 2) return { me: me, ans: ck, opts: pickN(r, [ck].concat(pickN(r, low, 2)), 3) };
  }
  return { me: JAYDEN, ans: 'electrician', opts: ['electrician', 'nurse', 'ece'] };
}
function wageTask(seed) {
  var r = RNG(seed * 31 + 13); r();
  var two = pickN(r, CAREER_KEYS, 2).sort(function (a, b) { return CAREERS[b].wage - CAREERS[a].wage; }), hrs = [20, 30, 35, 37, 40][Math.floor(r() * 5)], wk = two[Math.floor(r() * 2)];
  return { a: two[0], b: two[1], diff: wageDiff(two[0], two[1]), wk: wk, hours: hrs, pay: weekPay(wk, hrs) };
}
var CHANGE_QS = [
  { id: 'wasted', label: 'Changing your mind: wasted time?', text: 'I studied to be a cook, and now I want to be a teacher. Did I waste my time?', opts: [
    ['No. My skills, like time management and teamwork, come with me.', 1, 'Right. Skills travel to the next step.'], ['Yes. You have to start over from zero.', 0, 'You keep your skills and experience. They travel.'], ['Yes. You can only pick a career once.', 0, 'Most people change direction more than once.']] },
  { id: 'eight', label: 'Interests change over time', text: 'At 8 I wanted to be a hockey player. Now I love fixing bikes. Is something wrong with me?', opts: [
    ['No. Interests change as you try new things. That’s normal.', 1, 'Yes. Checking again each year is part of a good plan.'], ['Yes. You should pick one dream and stick to it.', 0, 'Interests change, and that’s okay.'], ['Yes. Changing means you are not serious.', 0, 'Changing often means you are learning about yourself.']] },
  { id: 'once', label: 'When you choose a career', text: 'My cousin says you choose your career once, at the end of high school. True?', opts: [
    ['No. A career grows one step at a time, and it can change.', 1, 'Yes. Most careers are paths with turns.'], ['Yes. You pick at 17 and that’s it.', 0, 'A career is a path, not one pick.'], ['Yes, unless you fail school.', 0, 'People change careers for lots of reasons. It’s normal.']] }
];
var BESIDES_QS = [
  { id: 'pay', label: 'Besides pay', text: 'The best career is just the one that pays the most, right?', opts: [
    ['Not always. Training, your interests and values, and getting there matter too.', 1, 'Right. Pay is one thing to weigh, not the only one.'], ['Yes. Pay is all that matters.', 0, 'A high-paying career you hate is a long, hard road.'], ['Yes, as long as the training is short.', 0, 'Fit and access matter too.']] },
  { id: 'train', label: 'Training and access', text: 'Both careers interest me. One needs 4 years of school far away. What should I think about?', opts: [
    ['How long the training is, what it costs, and whether I can get there.', 1, 'Yes. That’s called access.'], ['Nothing. Training doesn’t matter.', 0, 'Training takes time and money. It matters.'], ['Only the pay at the end.', 0, 'Pay matters, but so do time, cost and access.']] },
  { id: 'paid', label: 'Paid while you learn', text: 'Which of these lets you earn money while you train?', opts: [
    ['An apprenticeship, like an electrician’s.', 1, 'Yes. Apprentices are paid on the job site.'], ['A 4-year university degree.', 0, 'You can work part-time, but the degree itself doesn’t pay you.'], ['A college diploma.', 0, 'Most diplomas don’t pay you to learn.']] }
];
function mailKind(seed, last) { var k = ['jobcareer']; if (last >= 1) k.push('skills'); if (last >= 2) k.push('fit'); if (last >= 3) k.push('wage'); return k[RNG(seed * 7 + 3)() * k.length | 0]; }
/* HELP END */

  var T = window.CEFLTown, K = T.kit, esc = T.esc;
  var fmt = K.fmt, fmtW = K.fmtW, step = K.step;
  function lab(list, k) { for (var i = 0; i < list.length; i++) if (list[i][0] === k) return list[i][1]; return k; }
  function icon(list, k) { for (var i = 0; i < list.length; i++) if (list[i][0] === k) return list[i][2]; return ''; }
  var SHADOW = T.gameKit.sortRush(GAME_CFGS.shadow.cfg);
  var SHADOW_PAY = 800;

  /* ── State ── */
  function init() { return { v: 1, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), ans: {}, typed: {}, story: {}, career: null, stars: 0, shadows: {}, cards: {}, stickers: null, scene: null, finished: false }; }
  function validate(S) { return !!S && S.v === 1 && !!S.typed && !!S.story && typeof S.stars === 'number' && !!S.shadows && !!S.cards && (S.career === null || !!CAREERS[S.career]); }
  function me(S) { var m = S.typed.me || {}; return { I: m.I || [], V: m.V || [] }; }
  function story(S) { return S.story; }
  function C(S) { return S.career ? CAREERS[S.career] : null; }

  /* ── Panels and tasks ── */
  function meCard(api) {
    return K.chips(api, { id: 'me', title: 'Me, now', name: 'me', intro: 'Your map starts with you. Pick what is true for you <b>right now</b>. It can change later. That’s normal.',
      groups: [{ k: 'I', label: 'Things I like doing', min: 2, max: 3, opts: INTERESTS.map(function (x) { return { k: x[0], label: x[1], icon: x[2] }; }) },
        { k: 'V', label: 'What matters to me in work', min: 1, max: 2, opts: VALUES.map(function (x) { return { k: x[0], label: x[1], icon: x[2] }; }) }],
      texts: [{ k: 'act', label: 'A club, sport, activity or chore I do', min: 3 }], saveText: 'Save my Me card' });
  }
  function meHTML(S) {
    var m = S.typed.me; if (!m) return '<p>Not filled in yet.</p>';
    return '<p><b>Things I like doing:</b> ' + m.I.map(function (k) { return icon(INTERESTS, k) + ' ' + esc(lab(INTERESTS, k)); }).join(', ') + '</p><p><b>What matters to me in work:</b> ' + m.V.map(function (k) { return icon(VALUES, k) + ' ' + esc(lab(VALUES, k)); }).join(', ') + '</p>' + (m.act ? '<p><b>An activity:</b> ' + esc(m.act) + '</p>' : '');
  }
  function careerTable() {
    return K.table(CAREER_KEYS.map(function (k) { var c = CAREERS[k]; return [c.icon + ' <b>' + esc(c.name) + '</b>', fmt(c.wage) + ' an hour', esc(c.train)]; }), ['Career', 'Average wage (Alberta, 2023)', 'Training']) + '<p class="ct-small">ALIS 2023 Alberta Wage and Salary Survey, average for all experience levels.</p>';
  }
  function fitLine(ck, m) {
    var c = CAREERS[ck], hits = m.I.filter(function (k) { return c.I.indexOf(k) >= 0; }).map(function (k) { return lab(INTERESTS, k); }).concat(m.V.filter(function (k) { return c.V.indexOf(k) >= 0; }).map(function (k) { return lab(VALUES, k); }));
    hits = hits.filter(function (x, i) { return hits.indexOf(x) === i; });
    return hits.length ? '✓ ' + hits.map(esc).join(', ') : 'none of your picks';
  }
  function personHTML(name, p) { return '<p><b>' + esc(name) + ' likes:</b> ' + p.I.map(function (k) { return lab(INTERESTS, k); }).join(', ') + '. <b>Values:</b> ' + p.V.map(function (k) { return lab(VALUES, k); }).join(', ') + '.</p>'; }
  function fitQ(name, p, opts, ans) {
    return { text: name + '’s lists: likes ' + p.I.map(function (k) { return lab(INTERESTS, k).toLowerCase(); }).join(', ') + '; values ' + p.V.map(function (k) { return lab(VALUES, k).toLowerCase(); }).join(', ') + '. Which career fits best right now?',
      opts: opts.map(function (k) { var n = fitOf(k, p); return [CAREERS[k].name, k === ans, k === ans ? 'Yes. It shares ' + n + ' of ' + name + '’s interests and values: ' + fitLine(k, p).replace('✓ ', '') + '.' : 'It shares ' + (n ? 'only ' + n : 'none') + ' of ' + name + '’s interests and values.']; }) };
  }
  function shadowOpts(api, S, who, seed, help) {
    var p = who === 'joe' ? 'Joe' : who === 'rivera' ? 'Ms. Rivera' : who === 'vet' ? 'Kit at the animal clinic' : 'Nurse Kaur';
    return { title: 'Job shadow: ' + (help ? 'an extra hour with ' : 'a busy minute with ') + p, name: 'minigame', game: SHADOW, seed: seed, seconds: 60, leave: !!help,
      how: '<p><b>Job shadow.</b> You follow ' + esc(p) + ' for one busy minute. Each card is a task from a real job. Tap the <b>transferable skill</b> it uses most.</p><p class="ct-small">A wrong skill costs a point. So does a card that runs out of time.</p>',
      skipNote: 'Skipping is okay. You just won’t earn a skill star this time.',
      tierText: help ? K.payTiers(SHADOW_PAY)
        : { great: 'You earn a skill star for your growth plan.', ok: 'Good watching. No star this time, but you saw the skills at work.', poor: 'Lots of skills flew by. Watch for them next time.' } };
  }
  async function shadow(api, S, key, who, chIdx) {
    if (!S.shadows[key]) {
      var r = await api.minigame(shadowOpts(api, S, who, S.seed * 37 + chIdx, false));
      S.shadows[key] = { tier: r.tier, score: r.score }; if (r.tier === 'great') S.stars++; api.save(); api.hud();
    }
    var t = S.shadows[key].tier;
    await api.say(who, t === 'great' ? ['You spotted the skills fast. That’s how a pro thinks.', 'Here’s a skill star for your growth plan.'] : t === 'ok' ? 'Nice work. Every job uses those four skills, you know.' : t === 'skip' ? 'No problem. Come shadow me another time.' : 'It’s a lot to watch at once. You’ll get faster.');
  }
  function pathOf(ck) { var c = CAREERS[ck]; return [['Me, now', 'start', '12']].concat(c.path); }
  function pathHTML(ck) {
    return '<ol class="ck-notes">' + pathOf(ck).map(function (s) { return '<li><b>' + esc(s[0]) + '</b> <span class="ck-tag' + (s[1] === 'job' ? ' good' : s[1] === 'learning' ? '' : s[1] === 'experience' ? ' bad' : '') + '">' + (s[1] === 'start' ? 'start' : s[1]) + '</span> <span class="ct-small">age ' + esc(s[2]) + '</span></li>'; }).join('') + '</ol>';
  }
  var TYPES = [{ id: 'job', label: 'Job', icon: '💼' }, { id: 'learning', label: 'Learning', icon: '📚' }, { id: 'experience', label: 'Experience', icon: '🌱' }];
  var TYPE_WHY = { job: 'A paid role.', learning: 'School, a course or training.', experience: 'A club, volunteering or an activity you try.' };

  /* ── Between lessons ── */
  var HELPS = [
    { id: 'lm-jobcareer', who: 'avery', after: 0, pay: 600, label: 'Job or career?', ask: 'My little brother’s homework asks “job or career?” Can you help him?', run: async function (api, seed) {
      var t = jobCareerTask(seed), g = await K.sort(api, { title: 'Help Avery’s brother: job or career?', name: 'help-sort', leave: true, intro: 'Sort each one. A <b>job</b> is one role. A <b>career</b> is a whole path of learning, work and experiences.',
        bins: [{ id: 'job', label: 'Job', icon: '💼' }, { id: 'career', label: 'Career', icon: '🛤️' }], items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      if (g) await api.say('avery', 'He says thanks. He also says you’re “basically a teacher”.'); return g; } },
    { id: 'lm-firstjob', who: 'grandpa', after: 0, pay: 600, label: 'Where a first job led', ask: 'I have a guessing game about first jobs. Want to play?', run: async function (api, seed) {
      var t = firstJobTask(seed), g = await K.sort(api, { title: 'Grandpa’s game: where did the first job lead?', name: 'help-sort', leave: true, wide: true, intro: 'Three townspeople, three first jobs. Match each first job to the career it led to.',
        bins: t.map(function (x, i) { return { id: 'c' + i, label: x[1] }; }), items: t.map(function (x, i) { return { id: 'j' + i, text: 'First job: ' + x[0], bin: 'c' + i, why: x[2] }; }) });
      if (g) await api.say('grandpa', 'See? Every first job is a little door. Some open onto big rooms.'); return g; } },
    { id: 'lm-ad', who: 'worker', after: 1, pay: 800, label: 'Find the skills in a job', ask: 'My nephew has a job ad and doesn’t know what skills it wants. Can you look?', run: async function (api, seed) {
      var t = skillAdTask(seed), g = await K.sort(api, { title: 'Help Mo: which skill is it?', name: 'help-sort', leave: true, intro: 'Each line is a task from a job ad. Which <b>transferable skill</b> does it use most?',
        bins: SKILLS.map(function (s) { return { id: s[0], label: s[1], icon: s[2] }; }), items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], icon: x[2], bin: x[1], why: GAME_CFGS.shadow.cfg.items.filter(function (y) { return y.t === x[0]; })[0].why }; }) });
      if (g) await api.say('worker', 'Four skills. Every job. Huh. I use all four on the building site too.'); return g; } },
    { id: 'lm-travel', who: 'rosa', after: 1, pay: 800, label: 'Skills that travel', ask: 'I’m changing jobs. Which of my skills come with me?', run: async function (api, seed) {
      var t = travelTask(seed), g = await K.sort(api, { title: 'Help Rosa: which skills travel?', name: 'help-sort', leave: true, intro: 'Rosa is leaving her job. Which skills will travel to her next job, and which are mostly for this one?',
        bins: [{ id: 'yes', label: 'Travels to other jobs', icon: '🧳' }, { id: 'no', label: 'Mostly for this job', icon: '📍' }], items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[1] === 'yes' ? 'Every job needs this.' : 'Only this workplace does it this way.' }; }) });
      if (g) await api.say('rosa', 'Most of my skills come with me. That makes this a lot less scary.'); return g; } },
    { id: 'lm-fit', who: 'dev', after: 2, pay: 800, label: 'Check a career’s fit', ask: 'My cousin wants to know which career fits her. Can you check?', run: async function (api, seed) {
      var t = fitTask(seed), q = fitQ('Dev’s cousin', t.me, t.opts, t.ans); return K.askGrade(await api.ask('dev', q, null)); } },
    { id: 'lm-change', who: 'jas', after: 2, pay: 500, label: 'Interests that change', ask: 'Can I ask you something about changing your mind?', run: async function (api, seed) { var q = CHANGE_QS[seed % CHANGE_QS.length]; return K.askGrade(await api.ask('jas', q, null)); } },
    { id: 'lm-wage', who: 'sam', after: 3, pay: 1000, label: 'Compare two wages', ask: 'Two customers asked me about wages. Can you work them out?', run: async function (api, seed) {
      var t = wageTask(seed), A = CAREERS[t.a], B = CAREERS[t.b], W = CAREERS[t.wk];
      var g = await api.calc({ title: 'Help Sam: compare two wages', name: 'help-wage', ref: careerTable(), refLabel: 'Show the career cards', intro: '<p>Sam: “How much more an hour does a ' + esc(A.name.toLowerCase()) + ' earn than a ' + esc(B.name.toLowerCase()) + '? And what is ' + t.hours + ' hours of pay for a ' + esc(W.name.toLowerCase()) + '?”</p>',
        fields: [{ k: 'd', name: 'Difference per hour', sub: A.name + ' − ' + B.name, ans: t.diff, hint: fmt(A.wage) + ' − ' + fmt(B.wage) + '.' }, { k: 'w', name: t.hours + ' hours of pay', sub: W.name + ' at ' + fmt(W.wage), ans: t.pay, hint: t.hours + ' × ' + fmt(W.wage) + '.' }] });
      if (g) await api.say('sam', 'Thanks! I’d tell you a joke about wages, but it’s not worth it. Ha.'); return g; } },
    { id: 'lm-besides', who: 'avery', after: 3, pay: 500, label: 'More than pay', ask: 'Quick question about picking a career?', run: async function (api, seed) { var q = BESIDES_QS[seed % BESIDES_QS.length]; return K.askGrade(await api.ask('avery', q, null)); } },
    { id: 'lm-shadow', who: 'nurse', after: 1, pay: SHADOW_PAY, label: 'An extra job shadow', game: true, ask: 'The hospital is busy today. Want to shadow me for a bit?', run: async function (api, seed) {
      var r = await api.minigame(shadowOpts(api, api.S, 'nurse', seed, true)); return K.gameGrade(r); } }
  ];
  var GOSSIP = [
    { id: 'g-pat-0', who: 'vendor', after: -1, lines: ['That new booth next to my stall? Coach Max. He sells a $5 quiz.', 'He says it tells you your one true career. Forever. Sounds like a lot for $5.'] },
    { id: 'g-lin-0', who: 'librarian', after: -1, lines: ['Before I was a librarian, I shelved books here as a teenager.', 'Then I drove a book bus. Then I went back to school. Paths wiggle.'] },
    { id: 'g-avery-0', who: 'avery', after: -1, lines: ['Everybody is taking Coach Max’s quiz.', 'My result said “dentist, forever.” I don’t even like teeth.'] },
    { id: 'g-mo-1', who: 'worker', after: 0, lines: ['I was a cook before I was a builder.', 'Turns out timing a kitchen and timing a crew are the same skill.'] },
    { id: 'g-dev-1', who: 'dev', after: 0, lines: ['Coach Max’s quiz asked my favourite colour.', 'Then it said I should be an astronaut. I’m scared of heights.'] },
    { id: 'g-gp-1', who: 'grandpa', after: 0, lines: ['I fixed cars for twenty years. Then I taught auto shop.', 'Same skills. Different room. More teenagers.'] },
    { id: 'g-jas-2', who: 'jas', after: 1, lines: ['I made a list of my skills from the shoe store.', 'It’s longer than I thought. Talking to people counts!'] },
    { id: 'g-okafor-2', who: 'okafor', after: 1, lines: ['Three people came in this week saying a quiz told them their future.', 'A quiz can be fun. But it can’t know your path. You walk it.'] },
    { id: 'g-pat-2', who: 'vendor', after: 1, lines: ['Coach Max is selling “Forever Career” T-shirts now.', 'I sell plants. Plants grow. Careers too, I think.'] },
    { id: 'g-nurse-3', who: 'nurse', after: 2, lines: ['Before nursing, I was a cashier for six years.', 'Talking with upset customers? Great practice for talking with upset patients.'] },
    { id: 'g-mayor-3', who: 'mayor', after: 2, lines: ['Coach Max asked council if his quiz can be at the Career Café.', 'I said only if it tells the truth. He went very quiet.'] },
    { id: 'g-dev-3', who: 'dev', after: 2, lines: ['I’m volunteering at the animal shelter on Saturdays now.', 'Astronaut? Nah. Vet tech, maybe. For now.'] },
    { id: 'g-max-4', who: 'coachmax', after: 3, lines: ['I renamed my booth. “Path Finder: questions, not answers.”', 'Your questions, {name}. I gave you credit on the sign.'] },
    { id: 'g-lin-4', who: 'librarian', after: 3, lines: ['The {name} Path Wall is the busiest wall in the library.', 'People keep adding their own winding paths. Even the mayor!'] },
    { id: 'g-jas-4', who: 'jas', after: 3, lines: ['I start a new job next week. Customer service at the bank!', 'Same skills as the shoe store. New shoes, though.'] }
  ];
  function gossip(S, api) { return K.gossip(GOSSIP, api); }
  function mailTask(seed, last) {
    var k = mailKind(seed, last), from = 'Ms. Okafor';
    if (k === 'jobcareer') { var t = jobCareerTask(seed); return { label: 'Town Mail: job or career', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, intro: 'A letter from Ms. Okafor: “Sort these for my Career Day poster. Job or career?”', bins: [{ id: 'job', label: 'Job', icon: '💼' }, { id: 'career', label: 'Career', icon: '🛤️' }], items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) }); } }; }
    if (k === 'skills') { var s = skillAdTask(seed); return { label: 'Town Mail: name the skill', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, intro: 'A letter from Ms. Okafor: “Which transferable skill does each task use most?”', bins: SKILLS.map(function (x) { return { id: x[0], label: x[1], icon: x[2] }; }), items: s.map(function (x, i) { return { id: 'i' + i, text: x[0], icon: x[2], bin: x[1] }; }) }); } }; }
    if (k === 'fit') { var f = fitTask(seed); return { label: 'Town Mail: a fit check', from: from, pay: 500, run: async function (api) { await api.say(null, 'A letter from Ms. Okafor. She has a question.'); return K.askGrade(await api.ask('okafor', fitQ('A Grade 7 student', f.me, f.opts, f.ans), null)); } }; }
    var w = wageTask(seed), A = CAREERS[w.a], B = CAREERS[w.b];
    return { label: 'Town Mail: compare wages', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', ref: careerTable(), refLabel: 'Show the career cards', intro: '<p class="ct-small">A letter from Ms. Okafor:</p><p>“How much more an hour does a ' + esc(A.name.toLowerCase()) + ' earn than a ' + esc(B.name.toLowerCase()) + '?”</p>', fields: [{ k: 'd', name: 'Difference per hour', ans: w.diff, hint: fmt(A.wage) + ' − ' + fmt(B.wage) + '.' }] }); } };
  }

  /* ── Steps ── */
  function chapterSteps(ch, S, api) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the Job Centre and say hi to Ms. Okafor', 'okafor');
        await api.say('okafor', ['Hey, hey! You must be ' + api.profile.name + '. I’m Ms. Okafor!', 'Big news: the town is having a Career Café at the Community Centre. Families come, ask questions, leave sticky notes.', 'And you’re going to bring a map. A map of a path, from you now to a career you’d want.']);
        await api.say('okafor', ['First, a warm-up. Three people in town. Three first jobs. Three careers today.', 'Can you match them?']);
        var t = FIRST_JOBS.slice(0, 3);
        await K.sort(api, { title: 'Three first jobs, three careers', name: 'entry', story: true, key: 'q-entry', label: 'Match first jobs to careers', ch: 0, wide: true,
          intro: 'Match each <b>first job</b> to the <b>career today</b> it led to. Think: what might each first job have taught them?',
          bins: t.map(function (x, i) { return { id: 'c' + i, label: x[1] }; }), items: t.map(function (x, i) { return { id: 'j' + i, text: 'First job: ' + x[0], bin: 'c' + i, why: x[2] }; }) });
        await api.say('okafor', ['None of them planned it all at 13. One step led to the next.', 'That’s the difference between a job and a career. Let’s start your map with you.']);
      }));
      a.push(step('me', async function (api, S) {
        await api.quest('Go home and fill in your Me card at the kitchen table', 'table');
        await meCard(api); api.give('Me card', '🪪', 'table'); api.hud();
        await api.say('you', ['There. That’s me, right now.', 'Ms. Okafor said it can change. I guess that’s the point.']);
      }));
      a.push(step('jobcareer', async function (api, S) {
        await api.quest('Ms. Okafor has a sorting job for you at the Job Centre', 'okafor');
        await api.say('okafor', 'A job is one role. A career is your whole path: learning, work and experiences, over many years. Try these.');
        var pool = JOB_OR_CAREER.slice(0, 7);
        await K.sort(api, { title: 'Job or career?', name: 'jobcareer', story: true, key: 'q-jobcareer', label: 'Job or career?', ch: 0,
          intro: 'Sort each one. A <b>job</b> is one role or position. A <b>career</b> is the whole path of learning, work and experiences.',
          bins: [{ id: 'job', label: 'Job', icon: '💼' }, { id: 'career', label: 'Career', icon: '🛤️' }], items: pool.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
        await api.say('okafor', 'Nice. Now go check out Town Square. Something there has the whole town talking.');
      }));
      a.push(step('hunch', async function (api, S) { // the side story starts: a hunch you cannot answer yet
        story(S).booth = 1; api.refresh();
        await api.quest('Something is going on in Town Square. Jas looks upset.', 'jas');
        await api.say('jas', ['Oh, hi. I just took Coach Max’s quiz. The “One True Career” quiz.', 'It says I’ll sell shoes for the rest of my life. Forever.', 'I like the shoe store. But forever? Is that how careers work?']);
        await api.say('coachmax', ['The quiz is never wrong! Pick once, stay forever. That’s the secret.', 'Only five dollars. Next!']);
        await api.say('you', ['Selling shoes is a job, Jas. A career is more than one job...', 'But I don’t know enough yet to say what comes next for you.']);
        await api.say('jas', 'Will you tell me if you figure it out?');
        await api.say('you', 'I’ll keep notes. Promise.');
        story(S).jas1 = 1; api.give('Path notes', '🔍', 'jas'); api.refresh();
      }));
      a.push(step('end1', async function (api, S) {
        await api.quest('Tell Ms. Okafor about Coach Max’s quiz', 'okafor');
        await api.say('okafor', ['A quiz that picks your career forever? Hmm.', 'Here’s something to think about. Write it in your own words.']);
        await K.typed(api, { id: 'whyPath', title: 'In your own words', prompt: 'Why is a career more than one job? Use an example, like Mia the daycare director or someone you know.', key: null });
        await api.say('okafor', ['Love it. Now do Step 1 of your project: Me, now.', 'Next time: skills. Some skills travel with you from job to job. That might help Jas.']);
      }));
    }
    if (ch === 1) {
      a.push(step('ad', async function (api, S) {
        await api.quest('Ms. Okafor has a job ad to show you', 'okafor');
        await api.say('okafor', ['A camp counsellor and a nurse have very different jobs.', 'But both stay calm, talk clearly and work with a team. Those are transferable skills: skills you carry from job to job.', 'Here’s a lifeguard ad. Which skill is each line asking for?']);
        await K.sort(api, { title: 'Pool lifeguard wanted', name: 'adskills', story: true, key: 'q-adskills', label: 'Name the skills in a job ad', ch: 1,
          intro: '<i>“Pool lifeguard wanted. Must talk clearly with swimmers and parents, show up on time, work well with other guards, and figure out what to do when something goes wrong.”</i>',
          bins: SKILLS.map(function (s) { return { id: s[0], label: s[1], icon: s[2] }; }),
          items: [{ id: 'a', text: 'Talk clearly with swimmers and parents', bin: 'comm', why: 'Talking clearly is communication.' }, { id: 'b', text: 'Show up on time', bin: 'time', why: 'Being on time is time management.' },
            { id: 'c', text: 'Work well with other guards', bin: 'team', why: 'Working with others is teamwork.' }, { id: 'd', text: 'Figure out what to do when something goes wrong', bin: 'solve', why: 'Working out what to do is problem solving.' }] });
        await api.say('okafor', ['Four skills. And here’s the thing: every job in town uses all four.', 'Want to see? Nurse Kaur said you can shadow her at the hospital.']);
      }));
      a.push(step('shadow2', async function (api, S) {
        await api.quest('Shadow Nurse Kaur at the hospital for one busy minute', 'nurse');
        if (!S.shadows.ch2) await api.say('nurse', ['Welcome! Stay close. It gets busy.', 'Every task I do uses a skill. Watch for which one.']);
        await shadow(api, S, 'ch2', 'nurse', 2);
      }));
      a.push(step('jas2', async function (api, S) { // clue 1, checked with this chapter's skill: Jas's skills travel
        await api.quest('Go find Jas. You know something about skills now.', 'jas');
        await api.say('jas', ['You’re back! Coach Max says skills only count in the job where you learned them.', 'So my shoe store skills are... shoe store skills. Right?']);
        await api.say('you', 'Let’s check. Tell me what you do at the store.');
        await K.sort(api, { title: 'Jas’s skills: which ones travel?', name: 'jasskills', story: true, key: 'story-jas', label: 'Jas’s skills: which travel to other jobs', ch: 1,
          intro: 'Here is what Jas does at the shoe store. Which skills would <b>travel</b> to another job, and which are <b>mostly for this store</b>?',
          bins: [{ id: 'yes', label: 'Travels to other jobs', icon: '🧳' }, { id: 'no', label: 'Mostly for this job', icon: '📍' }],
          items: [{ id: 'a', text: 'Helping a customer who is upset', bin: 'yes', why: 'Communication. Every job with people needs it.' }, { id: 'b', text: 'Knowing every shoe size of every brand', bin: 'no', why: 'That’s handy at a shoe store, and not many other places.' },
            { id: 'c', text: 'Showing up on time for every shift', bin: 'yes', why: 'Time management. Every job needs it.' }, { id: 'd', text: 'Working with the team on a busy Saturday', bin: 'yes', why: 'Teamwork travels everywhere.' },
            { id: 'e', text: 'Lacing up display shoes the store’s way', bin: 'no', why: 'That’s this store’s way of doing things.' }] });
        await api.say('you', ['Look. Three of your skills travel to almost any job. Talking with upset customers. Being on time. Teamwork.', 'Coach Max is wrong about that part. Skills come with you.']);
        await api.say('jas', ['So I’m not stuck. I’m... carrying stuff.', 'That’s the best news I’ve had all week.']);
        story(S).jas2 = 1; api.toast('Added to your Path notes: Jas’s skills travel'); api.save();
      }));
      a.push(step('myskills', async function (api, S) {
        await api.quest('Go home and make your skill plan at the kitchen table', 'table');
        await K.chips(api, { id: 'skills', title: 'My skills', name: 'skills', intro: 'Pick <b>two</b> transferable skills you already have, and <b>two</b> you want to build.',
          groups: [{ k: 'have', label: 'Skills I already have', min: 2, max: 2, opts: SKILLS.map(function (s) { return { k: s[0], label: s[1], icon: s[2] }; }) },
            { k: 'build', label: 'Skills I want to build', min: 1, max: 2, opts: SKILLS.map(function (s) { return { k: s[0], label: s[1], icon: s[2] }; }) }],
          texts: [{ k: 'where', label: 'Where I showed one of my skills (a sport, a club, a chore…)', min: 3 }, { k: 'how', label: 'One thing I could do this month to practise a skill I want to build', min: 3 }], saveText: 'Save my skill plan' });
        api.give('Skill plan', '⭐', 'table'); api.hud();
      }));
      a.push(step('end2', async function (api, S) {
        await api.quest('Show Ms. Okafor your skill plan', 'okafor');
        await api.say('okafor', ['Great plan. Now do Step 2 of your project: My skills.', 'Next time, you pick a career for your map. It has to fit you: your interests and your values.', 'Oh, and I heard Dev took Coach Max’s quiz too. He didn’t look happy.']);
      }));
    }
    if (ch === 2) {
      a.push(step('jayden', async function (api, S) {
        await api.quest('Ms. Okafor wants you to meet Jayden', 'okafor');
        await api.say('okafor', ['Jayden is 13. At 8, he wanted to play hockey. Now he loves building things in shop class and fixing bikes.', 'He cares about working outside and helping his town. Which career fits him right now?']);
        await api.ask('okafor', fitQ('Jayden', JAYDEN, ['nurse', 'electrician', 'software'], 'electrician'), 'q-jayden', 'Check a career against interests and values (Jayden)', 2);
        await api.say('okafor', ['Right now, yes. And if he changes, he checks again. Checking is part of a good plan.']);
      }));
      a.push(step('dev3', async function (api, S) { // clue 2: the quiz ignores interests
        await api.quest('Dev is waiting for you in Town Square', 'dev');
        await api.say('dev', ['Coach Max’s quiz says I should be an astronaut.', 'I love animals. I like helping. I want to stay near my family. And I’m scared of heights.']);
        await api.ask('dev', fitQ('Dev', DEV, ['vettech', 'software', 'electrician'], 'vettech'), 'story-dev', 'Dev’s quiz result: check the fit', 2);
        await api.say('you', ['A vet tech fits your lists. Astronaut doesn’t match one thing you said.', 'That quiz didn’t even look at what you like.']);
        await api.say('dev', 'Then what DID it look at?');
        story(S).dev = 1; api.toast('Added to your Path notes: Dev’s result'); api.save();
      }));
      a.push(step('quiz', async function (api, S) { // the source: the quiz card itself
        await api.quest('Ask Coach Max to see the quiz card', 'coachmax');
        await api.say('coachmax', ['Want to see the questions? Sure! Nothing to hide. Mostly.']);
        await K.inspect(api, { title: 'The One True Career quiz', name: 'quiz', story: true, key: 'story-quiz', label: 'Find what is wrong with the quiz', ch: 2, find: 'Find the 4 things that are wrong with this quiz', cols: 3,
          intro: 'Coach Max’s quiz card. Tap every part that is <b>wrong about how careers work</b>. Leave the fair parts alone.',
          spots: [{ id: 'colour', icon: '🎨', label: 'Q1: What is your favourite colour?', bad: true, why: 'A colour tells you nothing about a career.', hint: 'Which question has nothing to do with work?' },
            { id: 'forever', icon: '🔒', label: '“Your result is your career. Forever.”', bad: true, why: 'Careers change. Most people change direction more than once.' },
            { id: 'skills', icon: '🚫', label: '“Skills only count in the job where you learned them.”', bad: true, why: 'Transferable skills travel to other jobs.' },
            { id: 'pay', icon: '💰', label: '“Always pick the career that pays the most.”', bad: true, why: 'Pay is one thing. Training, fit and access matter too.' },
            { id: 'like', icon: '🙂', label: 'Q2: What do you like doing?', fine: 'Asking what you like is fair. Interests matter.' },
            { id: 'value', icon: '💗', label: 'Q3: What matters to you in work?', fine: 'Asking about values is fair too.' }] });
        await api.say('coachmax', ['Okay. Okay! The colour question decides most of it. It’s a FUN quiz.', 'People seemed so happy to just... know.']);
        await api.say('you', 'Knowing feels good. But it has to be true.');
        story(S).quiz = 1; api.toast('Added to your Path notes: the quiz card'); api.save();
      }));
      a.push(step('shadow3', async function (api, S) {
        await api.quest('Joe the electrician said you can shadow him at Bright Spark Electric', 'joe');
        if (!S.shadows.ch3) await api.say('joe', ['Hard hat on! Just kidding, you’re only watching. Stay behind the tape.', 'Electricians use every one of those four skills. Watch.']);
        await shadow(api, S, 'ch3', 'joe', 3);
      }));
      a.push(step('rank', async function (api, S) {
        await api.quest('Go home and pick a career for your map', 'table');
        var m = me(S);
        await K.order(api, { id: 'rank', title: 'Rank five careers', name: 'rank', intro: 'Put them in order: most like you at the top. There is no right answer. It’s about you, right now.',
          items: CAREER_KEYS.map(function (k) { return { id: k, text: CAREERS[k].name, icon: CAREERS[k].icon }; }), topLabel: 'Most like me', bottomLabel: 'Least like me', saveText: 'Save my ranking' });
        var r = await K.pick(api, { id: 'pick', title: 'The career for my map', name: 'pickcareer', intro: 'Pick the career for your map. Each card shows which of <b>your</b> interests and values it shares.',
          options: CAREER_KEYS.map(function (k) { var c = CAREERS[k]; return { k: k, title: c.name, icon: c.icon, lines: [['Fits me', fitLine(k, m)], ['Wage', fmt(c.wage) + '/h'], ['Training', c.years + (c.years === 1 ? ' year' : ' years')]] }; }),
          reasonPrompt: 'Why does it fit you right now? Use your interests and values.', footNote: 'Don’t see your dream career here? Pick the closest one. Your real project can use any career.' });
        S.career = r.pick; api.give('Career card: ' + CAREERS[S.career].name, CAREERS[S.career].icon, 'table'); api.hud();
      }));
      a.push(step('end3', async function (api, S) {
        await api.quest('Tell Ms. Okafor which career you picked', 'okafor');
        await api.say('okafor', [C(S).name + '! Good choice, for now.']);
        await api.ask('okafor', CHANGE_QS[0], 'q-wasted', 'Changing your mind: wasted time?', 2);
        await api.say('okafor', ['Now do Step 3 of your project: Pick a career.', 'Next time: research and a real conversation. And the Career Café is coming up.', 'Coach Max asked to set up his quiz at the Café. Hmm. Bring your Path notes.']);
      }));
    }
    if (ch === 3) {
      a.push(step('cards', async function (api, S) {
        await api.quest('Mx. Lin has career cards at the library', 'librarian');
        await api.say('librarian', ['Career cards! Real Alberta wages, real training. Careers need different training, and they pay differently.', 'Let’s compare two, the way you’d compare any two.']);
        await api.calc({ title: 'Compare two careers', name: 'wagecalc', noPay: true, ref: careerTable(), refLabel: 'Show the career cards',
          intro: '<p>Use the career cards.</p>', fields: [{ k: 'd', name: 'How much more an hour a nurse earns than an early childhood educator', sub: '$47.38 − $19.05', ans: wageDiff('nurse', 'ece'), hint: 'Subtract: 47.38 − 19.05.' },
            { k: 'w', name: 'A software developer’s pay for a 40-hour week', sub: '40 × $44.55', ans: weekPay('software', 40), hint: 'Multiply: 40 × 44.55.' }] }).then(function (g) { api.record('q-wages', 'Compare wages (subtract and multiply)', 3, g === 'first'); });
        await api.say('librarian', ['Pay is one thing. But a nurse needs a 4-year degree. An electrician is paid while learning. A vet tech needs 2 years.', 'A good choice weighs all of it: pay, training, your interests, and whether you can get there.']);
        api.give('Career cards', '🗂️', 'librarian');
      }));
      a.push(step('avery4', async function (api, S) { // clue 3: pay is all that matters
        await api.quest('Avery is at the library too, looking stressed', 'avery');
        await api.say('avery', ['Coach Max says: always pick the career that pays the most. Done.', 'So I should be a nurse, because $47.38 is the biggest number. But I faint when I see blood.']);
        await api.ask('avery', BESIDES_QS[0], 'story-avery', 'Avery: what is missing besides pay', 3);
        await api.say('you', ['Pay is one thing to weigh. Training, what you like, what matters to you, and getting there count too.', 'A career you hate is a long road, even if it pays well.']);
        await api.say('avery', 'So no blood for me. Phew.');
        story(S).avery = 1; api.toast('Added to your Path notes: Avery and pay'); api.save();
      }));
      a.push(step('talk', async function (api, S) { // the interview verb: three people, three real paths
        await api.quest('Ms. Okafor has one more job: talk to people about their paths', 'okafor');
        await api.say('okafor', ['Your project asks you to talk with a real adult about their career. Practise here first.', 'Ask Grandpa, Nurse Kaur and Joe three questions: their first job, how they got into this work, and the skills they use every day.']);
        S.talkPhase = true; api.save();
        var order = [['grandpa', 'Grandpa'], ['nurse', 'Nurse Kaur'], ['joe', 'Joe at Bright Spark Electric']];
        while (true) {
          var left = order.filter(function (o) { return !S.cards[o[0]]; });
          if (!left.length) break;
          await api.quest('Ask about their paths: ' + left.map(function (o) { return o[1]; }).join(', ') + ' (' + (3 - left.length) + ' of 3 path cards)', left[0][0]);
          await interview(api, S, left[0][0]);
        }
        S.talkPhase = false; api.save();
      }));
      a.push(step('mypath', async function (api, S) {
        await api.quest('Go home and lay out your path map at the kitchen table', 'table');
        var c = C(S);
        await api.say('you', ['Here’s a typical path to ' + c.name.toLowerCase() + '. Some steps are jobs, some are learning, some are experiences.', 'My map has to say which is which.']);
        await K.sort(api, { title: 'My path to ' + c.name.toLowerCase(), name: 'pathtypes', story: true, key: 'q-pathtypes', label: 'Label each path step: job, learning or experience', ch: 3,
          intro: 'Label each step on your path. A <b>job</b> is a paid role. <b>Learning</b> is school, a course or training. An <b>experience</b> is something you try, like a club or volunteering.',
          bins: TYPES, items: c.path.map(function (s, i) { return { id: 's' + i, text: s[0] + ' <span class="ct-small">(age ' + s[2] + ')</span>', bin: s[1], why: TYPE_WHY[s[1]] }; }) });
        await K.typed(api, { id: 'first', title: 'My first step', prompt: 'What is one first step you could take this year toward ' + c.name.toLowerCase() + '?' });
        api.give('My path map', '🗺️', 'table'); api.hud();
      }));
      a.push(step('cafe', async function (api, S) { // the hero beat: the Career Café, in public
        S.scene = 'cafe'; api.refresh();
        await api.quest('The Career Café is open at the Community Centre!', 'rivera');
        api.fx.face('all');
        await api.say('rivera', ['Welcome to the Career Café! Stand by your map. Visitors will ask you questions.', 'Answer well, and they leave you a sticker. Four stickers earns a gold ribbon.']);
        if (!S.stickers) S.stickers = { got: 0, asked: {} };
        var c = C(S), others = CAREER_KEYS.filter(function (k) { return k !== S.career; });
        var Qs = [
          ['avery', 'q-cafe-path', { text: 'Is being a ' + c.name.toLowerCase() + ' a job or a career?', opts: [['It can be a whole career: a path of learning, jobs and experiences over many years.', 1, 'Sticker! That’s a career, all right.'], ['It’s one job you pick once.', 0, 'A career is a path, not one pick.'], ['It’s just a fancy word for a job that pays a lot.', 0, 'A career is about the path, not the pay.']] }],
          ['grandpa', 'q-cafe-wage', { text: 'What does a ' + c.name.toLowerCase() + ' earn in Alberta, on average?', opts: [[fmt(c.wage) + ' an hour', 1, 'Sticker! Right off the career card.'], [fmt(CAREERS[others[0]].wage) + ' an hour', 0, 'That’s a ' + CAREERS[others[0]].name.toLowerCase() + '’s wage.'], [fmt(CAREERS[others[2]].wage) + ' an hour', 0, 'That’s a ' + CAREERS[others[2]].name.toLowerCase() + '’s wage.']] }],
          ['dev', 'q-cafe-train', { text: 'What training do you need to become a ' + c.name.toLowerCase() + '?', opts: [[c.train, 1, 'Sticker! Good research.'], [CAREERS[others[1]].train, 0, 'That’s the training for a ' + CAREERS[others[1]].name.toLowerCase() + '.'], [CAREERS[others[3]].train, 0, 'That’s the training for a ' + CAREERS[others[3]].name.toLowerCase() + '.']] }],
          ['jas', 'q-cafe-skill', { text: 'What’s a transferable skill? I keep hearing that.', opts: [['A skill you can use in many jobs, like communication or teamwork.', 1, 'Sticker! That’s exactly what helped me.'], ['A skill that only works in one job.', 0, 'That’s the opposite. Transferable skills travel.'], ['A skill you get when you switch schools.', 0, 'Transferable means it moves with you to other jobs.']] }],
          ['coachmax', 'q-cafe-change', { text: 'So what if you change your mind later? Wasn’t all that time wasted?', opts: [['No. My skills and experiences come with me to the next step.', 1, 'Huh. Sticker. You might be right.'], ['Yes. So you should pick once and never change.', 0, 'That’s what the quiz says. Is it true?'], ['Yes. You start from zero every time.', 0, 'You keep your skills. They travel.']] }]
        ];
        for (var i = 0; i < Qs.length; i++) {
          var q = Qs[i]; if (S.stickers.asked[q[1]]) continue;
          var r = await api.ask(q[0], q[2], q[1], 'Career Café: ' + q[2].text, 3);
          S.stickers.asked[q[1]] = 1; if (r.first) { S.stickers.got++; api.fx.rise(q[0], '+1 sticker'); }
          api.save(); api.hud();
        }
        var won = S.stickers.got >= STICKERS_TO_WIN;
        await api.say('rivera', won ? 'You earned ' + S.stickers.got + ' stickers. That’s a gold ribbon! People loved your map.' : 'You earned ' + S.stickers.got + ' stickers. Four makes a gold ribbon. You can replay this chapter from the Menu and try again.');
        if (won) { api.give('Gold ribbon', '🎗️', 'rivera'); api.fx.confetti(24); }
        await api.say('coachmax', ['Can I say something? I had a $5 quiz that said “forever.”', 'Truth is, my first job was washing dishes. Then I cooked. Then I trained people at a gym. Now I coach.', 'My own path was never one thing. I’m sorry, everybody.']);
        await api.say('jas', 'It’s okay. Somebody here checked.');
        story(S).cafe = 1; S.win = won; api.save();
        await K.hero(api, { who: 'librarian', lines: ['May I add one more thing? The library is putting up a wall of real career paths. Winding ones. Like Coach Max’s.', 'It started with ' + api.profile.name + '’s Path notes. So we’re calling it the ' + api.profile.name + ' Path Wall.'],
          medal: 'Pathfinder medal', icon: '🧭', kicker: 'Career Café', title: 'The ' + api.profile.name + ' Path Wall', reply: ['Thank you! Now everybody add your path. The wiggly parts too.'] });
        story(S).hero = 1; S.scene = null; api.refresh();
      }));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and pin your map to your My Plan wall', 'myplan');
        var c = C(S), firstTime = !S.finished;
        S.finished = true;
        if (firstTime) api.profileAdd('closet', 'pathfinder');
        api.profileAdd('plan', { mission: '7-labour-market', title: 'Career Pathway Map', text: 'A career I’m curious about: ' + c.name + '. My first step: ' + (S.typed.first || 'to be decided') + '.' });
        api.profileAdd('finished', '7-labour-market'); api.refresh();
        await api.say('you', ['My map is on the wall. Me, now, all the way to ' + c.name.toLowerCase() + '.', 'And if it changes, I’ll draw a new one. That’s allowed.']);
        await api.say('okafor', [S.win ? 'A gold ribbon AND a wall named after you? Big play, ' + api.profile.name + '!' : 'A wall named after you! And next time, go for the gold ribbon.', 'Your closet has a new Pathfinder vest. Your My Plan wall has a new page.', 'Now do Step 4 of your project: research your career and talk to a real adult.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }
  async function interview(api, S, who) {
    var P = {
      grandpa: { lines: [['First job?', 'Pumping gas at 15. I loved the cars more than the gas.'], ['How did you get into this work?', 'I fixed cars for twenty years. Then the school needed someone to teach auto shop. I said, why not?'], ['Skills every day?', 'Problem solving, and a lot of patience. Teenagers and engines both make strange noises.']], card: 'Gas station → mechanic → auto shop teacher' },
      nurse: { lines: [['First job?', 'Cashier at Valley Market. Six years!'], ['How did you get into this work?', 'I liked helping people at the till. I took biology, then a 4-year nursing degree. Here I am.'], ['Skills every day?', 'Communication, all day long. And teamwork. Nobody nurses alone.']], card: 'Cashier → nursing degree → registered nurse' },
      joe: { lines: [['First job?', 'Delivering flyers on my bike.'], ['How did you get into this work?', 'A summer job helping a contractor. Then a 4-year apprenticeship. Paid while I learned!'], ['Skills every day?', 'Problem solving and time management. And safety. Always safety.']], card: 'Flyer delivery → contractor’s helper → apprentice → electrician' }
    }[who];
    for (var i = 0; i < P.lines.length; i++) { await api.say('you', P.lines[i][0]); await api.say(who, P.lines[i][1]); }
    S.cards[who] = P.card; api.toast('Path card added (' + Object.keys(S.cards).length + ' of 3)'); api.save();
  }

  /* ── Register ── */
  T.mission({
    id: '7-labour-market', unitLabel: 'CEFL Grade 7 · Careers and the Labour Market · Project: Career Pathway Map', title: 'Career Day: Find Your Path',
    iCan: 'I can explain how a career is a path, name transferable skills, and check a career against my interests, values, pay and training.',
    foot: 'This is a model. Wages are Alberta averages from ALIS (2023 survey). The people and businesses are made up.',
    bagTip: 'Your Bag holds what you collect: your Me card, your skill plan, career cards and your Path notes.',
    realRule: 'Real gives no hints, and the Career Café still needs 4 stickers',
    afterLine: 'Mission complete. Add your path to the Path Wall anytime. Open Menu → Report to show your teacher.',
    chapters: [
      { name: 'Me, now', step: 'Step 1', moment: 'Moment 1: a job or a career?' },
      { name: 'Skills that travel', step: 'Step 2', moment: 'Moment 2: transferable skills' },
      { name: 'Pick a career', step: 'Step 3', moment: 'Moment 3: interests and values' },
      { name: 'Research and talk', step: 'Step 4', moment: 'Moment 4: pay, training and fit' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps, guide: 'okafor',
    helpers: function () { return HELPS; }, gossip: gossip, mail: function (S, seed, last) { return mailTask(seed, last); },
    outfit: function (S) { return S.finished ? 'pathfinder' : 'none'; },
    placeObjects: function (api, S) {
      api.place('table', 'home', 4, 3, { label: 'Kitchen table' });
      api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true });
      api.place('wall', 'library', 6, 4, { draw: 'cork', label: 'The Path Wall' });
    },
    people: function (S) {
      var s = S.story, out = {};
      out.coachmax = { name: 'Coach Max', role: 'Life coach', map: 'town', x: 44, y: 32, dir: 'down', look: { base: 0, skin: 's2', hair: 'blond', shirt: 'orange', pants: '#2f2f38' } };
      out.joe = { name: 'Joe', role: 'Electrician', map: 'electric', x: 4, y: 3, dir: 'down', look: { base: 5 } };
      out.rivera = { name: 'Ms. Rivera', role: 'Early childhood educator', map: 'community', x: 4, y: 3, dir: 'down', look: { base: 1, skin: 's4', hair: 'black', shirt: 'yellow', pants: '#3b3f5c' } };
      if (s.booth && !s.hero) out.jas = { map: 'town', x: 45, y: 33, dir: 'left', role: 'Shoe store' };
      if (S.scene === 'cafe') { // the visitors stand along row 3; row 4 stays open, so you can reach everyone
        out.avery = { map: 'community', x: 1, y: 3, dir: 'down' }; out.grandpa = { map: 'community', x: 2, y: 3, dir: 'down' }; out.librarian = { map: 'community', x: 3, y: 3, dir: 'down' };
        out.coachmax = { name: 'Coach Max', role: 'Life coach', map: 'community', x: 5, y: 3, dir: 'down', look: { base: 0, skin: 's2', hair: 'blond', shirt: 'orange', pants: '#2f2f38' } };
        out.dev = { map: 'community', x: 6, y: 3, dir: 'down' }; out.jas = { map: 'community', x: 7, y: 3, dir: 'down' };
      }
      return out;
    },
    doorOpen: function (id) { return !!{ home: 1, grandpa: 1, jobcentre: 1, hospital: 1, electric: 1, community: 1, library: 1, townhall: 1, servicecanada: 1, bank: 1 }[id]; },
    lockedLine: function (id) { var b = T.world.building(id); return /university|polytechnic|trades|school/.test(id) ? b.name + ': campus tours are in another mission.' : b.name + ' is closed today. Everyone is getting ready for the Career Café.'; },
    talk: function (id, S, api) {
      if (S.talkPhase && (id === 'grandpa' || id === 'nurse' || id === 'joe') && !S.cards[id]) {
        interview(api, S, id).then(function () { var left = ['grandpa', 'nurse', 'joe'].filter(function (k) { return !S.cards[k]; }); api.questText('Ask about their paths: ' + (3 - left.length) + ' of 3 path cards. Keep going.'); });
        return true;
      }
      var s = S.story, c = C(S), done = S.finished;
      var lines = {
        okafor: done ? 'Come back anytime. Paths keep going!' : 'You’re doing great. Your next goal is on the gold line at the top.',
        coachmax: s.hero ? 'Path Finder: questions, not answers. Want to try? It’s free now.' : s.quiz ? 'Fine. Maybe the colour question was a bit much.' : 'One True Career quiz! Only five dollars! Forever is a long time, so get it right!',
        jas: s.hero ? 'I start at the bank next week. My skills came with me!' : s.jas2 ? 'I keep reading my skills list. It makes me smile.' : s.jas1 ? 'Forever is a long time to sell shoes.' : 'Hi! I work at the shoe store. Best discount in town!',
        dev: s.dev ? 'Vet tech, for now. And I’ll check again next year.' : 'Have you taken Coach Max’s quiz? Don’t.',
        avery: s.avery ? 'No blood for me. I’m looking at careers with kids. Or computers. For now!' : 'Everyone is talking about Career Café.',
        nurse: S.cards.nurse ? 'Six years at a cash register taught me more than you’d think.' : 'Wear a helmet. I mean it.',
        joe: S.cards.joe ? 'Paid while I learned. Best deal in town.' : 'Measure twice, cut once.',
        rivera: s.hero ? 'Your map is still up at the Café. Kids keep asking about it.' : 'The Career Café is coming. Bring a map and a smile!',
        grandpa: S.cards.grandpa ? 'Gas, cars, then classrooms. Who knew?' : 'Come visit more often! I have stories. So many stories.',
        librarian: s.hero ? 'The ' + api.profile.name + ' Path Wall has 41 paths on it now. Forty-one!' : 'Free computers! Free books! Career cards on the second shelf!',
        mayor: 'Town Hall: where the town decides things. Slowly.', sam: 'Welcome to the bank! I’d tell you a joke about careers, but I’m still working on it.',
        table: 'The kitchen table. Good for planning a future.', wall: s.hero ? 'The ' + api.profile.name + ' Path Wall. Your map is pinned in the middle.' : 'A corkboard. Empty, for now.',
        myplan: K.planLine(api),
        mom: 'Hi, sweetie!'
      };
      return lines[id] || null;
    },
    hud: function (S) {
      var out = [{ label: 'Career', value: S.career ? CAREERS[S.career].name : '—' }];
      var stars = ''; for (var i = 0; i < 3; i++) stars += i < S.stars ? '★' : '☆';
      out.push({ label: 'Skill stars', value: stars, title: 'Earned on job shadows. A great shadow earns a star for your growth plan.' });
      if (S.stickers) out.push({ label: 'Stickers', value: S.stickers.got + ' / 5', title: '4 stickers earns the gold ribbon' });
      return out;
    },
    items: function (S) {
      var it = [];
      if (S.typed.me) it.push({ name: 'Me card', icon: '🪪', note: 'My interests and values, now', view: function () { return meHTML(S); } });
      if (S.typed.skills) it.push({ name: 'Skill plan', icon: '⭐', note: S.stars + ' skill star' + (S.stars === 1 ? '' : 's'), view: function () { var k = S.typed.skills; return '<p><b>Skills I have:</b> ' + k.have.map(function (x) { return lab(SKILLS, x); }).join(', ') + '</p><p><b>Skills I’m building:</b> ' + k.build.map(function (x) { return lab(SKILLS, x); }).join(', ') + '</p><p><b>Where I showed one:</b> ' + esc(k.where || '') + '</p><p><b>How I’ll practise:</b> ' + esc(k.how || '') + '</p><p>Skill stars from job shadows: ' + S.stars + '</p>'; } });
      if (S.story.cards || S.ans['q-wages']) it.push({ name: 'Career cards', icon: '🗂️', note: 'Five Alberta careers', view: careerTable });
      if (S.career) it.push({ name: 'Career card: ' + CAREERS[S.career].name, icon: CAREERS[S.career].icon, note: fmt(CAREERS[S.career].wage) + ' an hour', view: function () { var c = C(S); return '<p><b>' + esc(c.name) + '</b></p><p>What they do: work in ' + esc(c.where.toLowerCase()) + '.</p><p>Training: ' + esc(c.train) + '.</p><p>Average wage in Alberta: ' + fmt(c.wage) + ' an hour (2023).</p>' + (S.typed.pick && S.typed.pick.reason ? '<p><b>Why it fits me:</b> ' + esc(S.typed.pick.reason) + '</p>' : ''); } });
      if (Object.keys(S.cards).length) it.push({ name: 'Path cards', icon: '📇', note: Object.keys(S.cards).length + ' of 3 people', view: function () { return K.notes(Object.keys(S.cards).map(function (k) { return '<b>' + { grandpa: 'Grandpa', nurse: 'Nurse Kaur', joe: 'Joe' }[k] + ':</b> ' + esc(S.cards[k]); })); } });
      if (S.typed.first) it.push({ name: 'My path map', icon: '🗺️', note: 'Me, now → ' + CAREERS[S.career].name, view: function () { return pathHTML(S.career) + '<p><b>My first step:</b> ' + esc(S.typed.first) + '</p>'; } });
      if (S.story.jas1) it.push({ name: 'Path notes', icon: '🔍', note: 'The One True Career quiz', view: function () { return K.notes(notesList(S)); } });
      if (S.win) it.push({ name: 'Gold ribbon', icon: '🎗️', note: 'Career Café: ' + S.stickers.got + ' stickers', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🎗️</p><p style="text-align:center"><b>Career Café gold ribbon</b><br>' + S.stickers.got + ' of 5 stickers from visitors.</p>'; } });
      if (S.story.hero) it.push({ name: 'Pathfinder medal', icon: '🧭', note: 'The ' + T.api.profile.name + ' Path Wall', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🧭</p><p style="text-align:center"><b>Pathfinder</b><br>For showing the town that careers are paths, skills travel, and fit matters.</p>'; } });
      return it;
    },
    report: function (S) {
      var h = '<p>Career for my map: <b>' + (S.career ? esc(CAREERS[S.career].name) : 'not picked yet') + '</b>' + (S.finished ? ' · Career Café: <b>' + S.stickers.got + ' of 5 stickers</b> (' + (S.win ? 'gold ribbon' : 'goal not reached') + ')' : '') + '</p>';
      h += '<h3>Me card</h3>' + meHTML(S);
      if (S.typed.skills) h += '<h3>Skill plan</h3><p>Have: ' + S.typed.skills.have.map(function (x) { return lab(SKILLS, x); }).join(', ') + '. Building: ' + S.typed.skills.build.map(function (x) { return lab(SKILLS, x); }).join(', ') + '. Skill stars: ' + S.stars + '.</p>';
      var sh = Object.keys(S.shadows);
      if (sh.length) h += '<h3>Job shadows</h3>' + K.table(sh.map(function (k) { var x = S.shadows[k]; return [{ ch2: 'Nurse Kaur', ch3: 'Joe (electrician)' }[k] || k, String(x.score), { great: 'great ✓ (a skill star)', ok: 'steady', poor: 'rough', skip: 'skipped' }[x.tier]]; }), ['With', 'Score', 'Result']);
      h += K.wrote(S, [['whyPath', 'Why a career is more than one job'], ['rank', 'My ranking (most like me first)', function (k) { return CAREERS[k] ? CAREERS[k].name : k; }], ['pick', 'Career for my map', function (k) { return CAREERS[k].name; }], ['first', 'My first step']]);
      h += '<h3>The One True Career quiz</h3><p>' + (S.story.hero ? 'Solved: showed the town that careers are paths, and the Path Wall was named after them.' : S.story.quiz ? 'Found what was wrong with the quiz.' : S.story.jas1 ? 'Collecting clues.' : 'Not started.') + ' Story answers are in the First-try answers table.</p>';
      return h;
    },
    test: { scenes: [null, { story: { booth: 1, jas1: 1 } }, { scene: 'cafe', story: { booth: 1 } }], CAREERS: CAREERS, CAREER_KEYS: CAREER_KEYS, fitOf: fitOf, bestFit: bestFit, JAYDEN: JAYDEN, DEV: DEV, GAME_CFGS: GAME_CFGS, jobCareerTask: jobCareerTask, firstJobTask: firstJobTask, skillAdTask: skillAdTask, travelTask: travelTask, fitTask: fitTask, wageTask: wageTask, mailKind: mailKind, mailTask: mailTask, HELPS: HELPS, GOSSIP: GOSSIP }
  });
  function notesList(S) {
    var s = S.story, li = [];
    if (s.jas1) li.push('<b>Jas, at Town Square:</b> Coach Max’s $5 “One True Career” quiz says Jas will sell shoes forever. <i>Is that how careers work?</i>');
    if (s.jas2) li.push('<b>Jas’s skills:</b> talking with upset customers, being on time and teamwork all travel to other jobs. The quiz says skills only count where you learned them. <b>Not true.</b>');
    if (s.dev) li.push('<b>Dev’s result:</b> “astronaut.” Dev likes animals and helping, and values helping and a team. A vet tech fits. The quiz ignored his interests.');
    if (s.quiz) li.push('<b>The quiz card:</b> it asks your favourite colour, says your result is forever, says skills don’t travel, and says always pick the highest pay.');
    if (s.avery) li.push('<b>Avery:</b> was told to pick the highest-paying career. Pay is one thing; training, interests, values and access matter too.');
    if (s.cafe) li.push('<b>Career Café:</b> Coach Max told his own path: dishwasher → cook → gym trainer → coach. Never one thing.');
    if (s.hero) li.push('<b>The ' + esc(T.api.profile.name) + ' Path Wall:</b> real, winding career paths at the library.');
    return li;
  }
})();
