/* CEFL Town mission: Grade 8 Careers and the Labour Market — "Future-Proof" (companion to the project Future-Proof Me). LO 8-LM.
   Four chapters, one after each project step: The market keeps moving (economic cycles, technology, social change) · Tech check
   (tasks that shrink and grow) · Career resilience (job vs. career security, human capital, networks) · Goals with milestones (and
   a backup). You pick a career to future-proof, and present at Future Day.
   Model (MODEL START … END, no DOM): six careers, each with the three forces and the tasks technology might shrink or grow; sorting
   facts for every chapter. Goal: the Grade 7 class is convinced at Future Day (at least 3 of 4 first-try answers). The Robot or
   Human? game (kit sortRush) counts the tasks you sort on the warehouse floor; it never changes the goal.
   Side story, "Robots at the warehouse": Prairie Parcel is getting robots, and a News headline says "ROBOTS TAKE ALL JOBS BY
   FRIDAY." Greta's fear (Ch 1) → the robots take some tasks and add new ones (Ch 2) → Greta has job security, but her coworker Bo has
   career security (Ch 3) → the reporter admits the headline was for clicks; Greta signs up for robot-tech training, and the
   warehouse's training path is named after you (Ch 4).
   Data: Alberta unemployment 4.4% (Nov 2014) and 9.0% (Nov 2016), Statistics Canada Labour Force Survey. Task examples are general.
   Between lessons (HELP START … HELP END): townspeople's own questions, an extra warehouse shift, and Town Mail. */
(function () {
  'use strict';

/* MODEL START ── no DOM. ── */
var FORCES = [{ id: 'econ', label: 'Economic cycle', icon: '📉' }, { id: 'tech', label: 'Technology', icon: '🤖' }, { id: 'social', label: 'Social change', icon: '👥' }];
var CAREERS = {
  trucker:  { name: 'Truck driver', icon: '🚚', forces: [['A recession means fewer goods get shipped', 'econ'], ['Self-driving trucks are being tested', 'tech'], ['More people shop online, so there are more deliveries', 'social']],
              shrink: ['Planning routes by hand', 'Filling in paper logbooks'], grow: ['Checking the truck’s safety computer', 'Last-mile delivery to homes'] },
  teller:   { name: 'Bank teller', icon: '🏦', forces: [['When the economy slows, fewer people take out loans', 'econ'], ['Most people bank on their phones now', 'tech'], ['More newcomers need help opening their first account', 'social']],
              shrink: ['Counting cash deposits', 'Printing passbooks'], grow: ['Helping people use the banking app', 'Explaining savings and loans'] },
  nurse:    { name: 'Nurse', icon: '🩺', forces: [['Hospital budgets are cut in a downturn', 'econ'], ['Monitors send patient data straight to a tablet', 'tech'], ['More seniors means more need for care', 'social']],
              shrink: ['Writing charts by hand', 'Checking every monitor in person'], grow: ['Reading data from home-care devices', 'Video visits with patients'] },
  electric: { name: 'Electrician', icon: '⚡', forces: [['Fewer houses are built in a recession', 'econ'], ['Smart homes need new kinds of wiring', 'tech'], ['More people want solar panels and electric cars', 'social']],
              shrink: ['Wiring old-style switches only', 'Drawing plans on paper'], grow: ['Installing solar panels', 'Installing electric car chargers'] },
  farmer:   { name: 'Farmer', icon: '🚜', forces: [['Crop prices drop when the economy slows', 'econ'], ['GPS tractors and drones do some of the field work', 'tech'], ['More people want to buy local food', 'social']],
              shrink: ['Driving the tractor all day', 'Walking fields to spot problems'], grow: ['Programming GPS routes', 'Flying drones to check crops'] },
  appdev:   { name: 'App developer', icon: '📱', forces: [['Fewer new businesses start in a downturn', 'econ'], ['AI tools can write some code', 'tech'], ['More people want apps in their own language', 'social']],
              shrink: ['Typing out simple, repeated code', 'Testing every screen by hand'], grow: ['Checking and fixing AI-written code', 'Designing apps people with disabilities can use'] }
};
var CAREER_KEYS = Object.keys(CAREERS);
var ENTRY = [ // new, shrinking or still going strong (the project's entry event)
  ['Social media manager', 'new'], ['Video rental clerk', 'shrink'], ['Electrician', 'strong'], ['Drone pilot', 'new'], ['Travel agent', 'shrink'], ['Nurse', 'strong'], ['App developer', 'new'], ['Bank teller', 'shrink'],
  ['Wind turbine technician', 'new'], ['Switchboard operator', 'shrink'], ['Plumber', 'strong'], ['Teacher', 'strong'], ['EV charger installer', 'new'], ['Film photo developer', 'shrink']
];
var AGES = [{ id: 'new', label: 'New', icon: '🆕' }, { id: 'shrink', label: 'Shrinking', icon: '📉' }, { id: 'strong', label: 'Still going strong', icon: '💪' }];
var FORCE_ITEMS = [ // workbook Moment 1, and more
  ['More seniors means more need for home-care workers', 'social'], ['Self-checkout machines mean stores need fewer cashiers', 'tech'], ['A recession means fewer houses are built', 'econ'],
  ['Oil prices fall, and oil companies cut jobs', 'econ'], ['Online shopping means more delivery drivers', 'social'], ['Drones check crops instead of people walking the fields', 'tech'],
  ['More people want electric cars', 'social'], ['A boom means builders can’t hire fast enough', 'econ'], ['Banking apps mean fewer tellers', 'tech']
];
var SECURITY = [ // job security or career security (workbook Moment 3)
  ['“I’ve worked at the same plant for 20 years.”', 'job'], ['“If I lost this job, I could find another in a few weeks.”', 'career'], ['“I don’t need new skills. I’ve always done it this way.”', 'job'],
  ['“I took two courses this year and keep in touch with old coworkers.”', 'career'], ['“My boss promised me this job for life.”', 'job'], ['“My skills work in lots of different companies.”', 'career']
];
var CAPITAL = [{ id: 'edu', label: 'Education', icon: '🎓' }, { id: 'know', label: 'Knowledge', icon: '🧠' }, { id: 'skill', label: 'Skills', icon: '🛠️' }, { id: 'exp', label: 'Experience', icon: '⏳' }];
var CAPITAL_ITEMS = [
  ['A first-aid certificate', 'edu', 'A course you finished is education.'], ['Knowing how the store’s stock system works', 'know', 'What you know about something is knowledge.'], ['Being good at explaining things', 'skill', 'Something you can do well is a skill.'],
  ['Two summers as a camp counsellor', 'exp', 'Time spent doing something is experience.'], ['A high school diploma', 'edu', 'A diploma is education.'], ['Knowing the rules of food safety', 'know', 'What you know is knowledge.'],
  ['Being able to fix a bike', 'skill', 'Something you can do is a skill.'], ['A year working at the warehouse', 'exp', 'Time on the job is experience.']
];
var TERMS = [['Finish a first-aid course this spring', 'short'], ['Become a licensed electrician', 'long'], ['Take Math 10C next year', 'short'], ['Work as a nurse in a hospital', 'long'], ['Join the coding club this fall', 'short'], ['Run your own farm someday', 'long'], ['Volunteer at the animal shelter this summer', 'short'], ['Become a software developer', 'long']];
var POINTS_TO_WIN = 3;
var GAME_CFGS = {
  floor: { kind: 'sortRush', cfg: { id: 'floor', name: 'Robot or human?', scoreWord: 'Tasks sorted', win: [7000, 5200], think: 1400, th: [[15, 6], [15, 6]],
    how: '<p><b>Robot or human?</b> New robots arrive at Prairie Parcel. For each task, decide: can a <b>robot</b> do it (the same steps every time), or does it need a <b>person</b> (judgment, care, or fixing something new)?</p><p class="ct-small">A wrong choice costs 2 points. So does a task that waits too long.</p>',
    bins: [{ id: 'robot', label: 'Robot', icon: '🤖' }, { id: 'human', label: 'Person', icon: '🧑' }],
    items: [['Move boxes along the same route all day', 'robot'], ['Scan barcodes on every parcel', 'robot'], ['Count the boxes on a shelf', 'robot'], ['Lift heavy pallets to the top rack', 'robot'], ['Sort parcels by postal code', 'robot'], ['Wrap pallets in plastic', 'robot'], ['Print shipping labels', 'robot'], ['Carry boxes to the loading dock', 'robot'],
      ['Calm a customer whose parcel is lost', 'human'], ['Fix a robot that stopped working', 'human'], ['Decide what to do when an order is wrong', 'human'], ['Train a new worker', 'human'], ['Plan a better layout for the warehouse', 'human'], ['Check that a damaged parcel is safe to open', 'human'], ['Program the robots’ new route', 'human'], ['Talk to a driver about a late truck', 'human']
    ].map(function (x) { return { t: x[0], bin: x[1], icon: x[1] === 'robot' ? '📦' : '💬', why: x[1] === 'robot' ? 'The same steps every time: robots are good at that.' : 'It needs judgment, care, or fixing something new.' }; }) } }
};
/* MODEL END */

/* HELP START ── between lessons, on fresh seeds. No DOM. ── */
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function pickN(r, a, n) { var b = a.slice(), out = []; while (out.length < n && b.length) out.push(b.splice(Math.floor(r() * b.length), 1)[0]); return out; }
function spread(seed, list, keys, each, total) { var r = RNG(seed); r(); var out = []; keys.forEach(function (k) { out = out.concat(pickN(r, list.filter(function (x) { return x[1] === k; }), each)); }); var rest = list.filter(function (x) { return out.indexOf(x) < 0; }); return pickN(r, out.concat(pickN(r, rest, total - out.length)), total); }
function forceTask(seed) { return spread(seed * 13 + 1, FORCE_ITEMS, ['econ', 'tech', 'social'], 1, 4); }
function entryTask(seed) { return spread(seed * 17 + 3, ENTRY, ['new', 'shrink', 'strong'], 1, 4); }
function securityTask(seed) { return spread(seed * 19 + 5, SECURITY, ['job', 'career'], 2, 4); }
function capitalTask(seed) { return spread(seed * 23 + 7, CAPITAL_ITEMS, ['edu', 'know', 'skill', 'exp'], 1, 4); }
function termTask(seed) { return spread(seed * 29 + 11, TERMS, ['short', 'long'], 2, 4); }
function tasksTask(seed) { var r = RNG(seed * 31 + 13); r(); var it = GAME_CFGS.floor.cfg.items; return pickN(r, pickN(r, it.filter(function (x) { return x.bin === 'robot'; }), 2).concat(pickN(r, it.filter(function (x) { return x.bin === 'human'; }), 2)), 4); }
var ROBOT_QS = [
  { id: 'all', label: 'Will robots take all the jobs?', text: 'Robots will take all the jobs, so why plan a career at all?', opts: [
    ['Robots take some tasks, but new tasks appear. People who learn new skills move into them.', 1, 'Right. Like farms: fewer tractor drivers, more drone pilots and mechanics.'], ['True. There’s no point planning.', 0, 'Technology changes jobs. It doesn’t end work.'], ['Only if you work on a farm.', 0, 'Technology changes every field, and creates tasks in every field too.']] },
  { id: 'both', label: 'Is technology good or bad for workers?', text: 'Is new technology good or bad for workers?', opts: [
    ['Both. Some tasks disappear, new ones appear, and work can get safer.', 1, 'Yes. What matters is whether workers can adapt.'], ['Always bad. It takes jobs.', 0, 'It creates jobs too, and makes some work safer.'], ['Always good. Nobody loses work.', 0, 'Some people do lose tasks or hours.']] },
  { id: 'cashier', label: 'Getting ready for change', text: 'Self-checkouts are coming to my store. What could I do now?', opts: [
    ['Learn a new skill, like fixing the machines or helping customers use them.', 1, 'Good idea. I’ll ask my manager about training.'], ['Nothing. Hope it never happens.', 0, 'Getting ready early is how people stay resilient.'], ['Quit now before it happens.', 0, 'Adapting usually beats quitting.']] }
];
var PLAN_QS = [
  { id: 'rigid', label: 'Why not one job forever?', text: 'Isn’t the safest plan to pick one job and stay in it forever?', opts: [
    ['No. Jobs change. Skills, learning and a network keep you ready.', 1, 'Right. Career security beats job security.'], ['Yes. Changing is always risky.', 0, 'Not changing can be riskier when the job changes.'], ['Yes, if the boss is nice.', 0, 'Even nice bosses can’t stop a recession.']] },
  { id: 'backup', label: 'Why a backup career?', text: 'Why add a backup career to a plan?', opts: [
    ['If plans change, many of the same milestones still help.', 1, 'Yes. A backup keeps you flexible.'], ['Because the first goal will fail.', 0, 'A backup isn’t expecting failure. It’s staying flexible.'], ['You don’t need one.', 0, 'A rigid plan adds stress when things change.']] },
  { id: 'late', label: 'A milestone reached late', text: 'I reached a milestone late. Did my plan fail?', opts: [
    ['No. Adjust the plan and keep going.', 1, 'Plans bend. That’s fine.'], ['Yes. Start over from zero.', 0, 'One late milestone doesn’t erase the others.'], ['Yes. Give up the goal.', 0, 'Late isn’t never.']] }
];
function mailKind(seed, last) { var k = ['force']; if (last >= 1) k.push('tasks'); if (last >= 2) k.push('capital'); if (last >= 3) k.push('terms'); return k[RNG(seed * 7 + 3)() * k.length | 0]; }
/* HELP END */

  var T = window.CEFLTown, K = T.kit, esc = T.esc;
  var fmt = K.fmt, fmtW = K.fmtW, step = K.step;
  var FLOOR = T.gameKit.sortRush(GAME_CFGS.floor.cfg), FLOOR_PAY = 800;
  var SECURITY_BINS = [{ id: 'job', label: 'Job security', icon: '🔒' }, { id: 'career', label: 'Career security', icon: '🧳' }];
  var TERM_BINS = [{ id: 'short', label: 'Short-term', icon: '⏱️' }, { id: 'long', label: 'Long-term', icon: '🗓️' }];
  var SKILL_LIST = [['comm', 'Communication'], ['team', 'Teamwork'], ['solve', 'Problem solving'], ['tech', 'Technology use'], ['time', 'Time management'], ['think', 'Critical thinking']];

  function init() { return { v: 1, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), ans: {}, typed: {}, story: {}, career: null, floors: {}, day: null, scene: null, finished: false }; }
  function validate(S) { return !!S && S.v === 1 && !!S.typed && !!S.story && !!S.floors && (S.career === null || !!CAREERS[S.career]); }
  function C(S) { return CAREERS[S.career]; }
  function floorOpts(api, seed, help) {
    return { title: 'Robot or human?' + (help ? ' An extra shift' : ' The warehouse floor'), name: 'minigame', game: FLOOR, seed: seed, seconds: 60, leave: !!help, skipNote: 'Skipping is okay. Greta will sort the list.',
      tierText: help ? K.payTiers(FLOOR_PAY)
        : { great: 'The robots do the repeat work, and the people do what only people can.', ok: 'Most tasks ended up in the right place.', poor: 'A few tasks went to the wrong side. It’s harder than it looks.' } };
  }
  async function floorShift(api, S, key, n) {
    if (!S.floors[key]) { var r = await api.minigame(floorOpts(api, S.seed * 53 + n, false)); S.floors[key] = { tier: r.tier, score: r.score }; api.save(); api.hud(); }
    var t = S.floors[key].tier;
    await api.say('greta', t === 'great' ? 'Huh. Look at all the tasks still on the people side.' : t === 'ok' ? 'Thanks. That helps me see it.' : t === 'skip' ? 'No problem. I’ll sort it.' : 'It’s confusing, right? Some tasks look simple but need a person.');
  }
  function careerHTML(S) { var c = C(S); return '<p><b>' + c.icon + ' ' + esc(c.name) + '</b></p><h3>How three forces could change it</h3>' + K.table(c.forces.map(function (f) { var F = FORCES.filter(function (x) { return x.id === f[1]; })[0]; return [F.icon + ' ' + F.label, esc(f[0])]; })) + '<h3>Tech check</h3>' + K.table([['Tasks that might shrink', esc(c.shrink.join('; '))], ['Tasks that might grow', esc(c.grow.join('; '))]]); }

  var HELPS = [
    { id: 'lm8-force', who: 'avery', after: 0, pay: 600, label: 'Which force?', ask: 'I’m studying for a test. Which force is each one?', run: async function (api, seed) {
      var t = forceTask(seed); var g = await K.sort(api, { title: 'Help Avery: which force?', name: 'help-sort', leave: true, wide: true, intro: 'Economic cycles, technology, or social change?', bins: FORCES, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      if (g) await api.say('avery', 'Booms and busts, gadgets, and people. Got it!'); return g; } },
    { id: 'lm8-entry', who: 'grandpa', after: 0, pay: 600, label: 'New, shrinking or strong?', ask: 'Which jobs are new these days? I can’t keep up.', run: async function (api, seed) {
      var t = entryTask(seed); var g = await K.sort(api, { title: 'Help Grandpa: new, shrinking, or strong?', name: 'help-sort', leave: true, wide: true, intro: '<b>New</b>: didn’t really exist 25 years ago. <b>Shrinking</b>: fewer of these jobs each year. <b>Still going strong</b>: needed then and now.', bins: AGES, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      if (g) await api.say('grandpa', 'Drone pilot! In my day, the only drone was my uncle at dinner.'); return g; } },
    { id: 'lm8-tasks', who: 'worker', after: 1, pay: 800, label: 'Robot or person?', ask: 'They’re testing robots on my building site. Which tasks could they do?', run: async function (api, seed) {
      var t = tasksTask(seed); var g = await K.sort(api, { title: 'Help Mo: robot or person?', name: 'help-sort', leave: true, intro: 'Which tasks follow the same steps every time (a robot could do them), and which need a person?', bins: GAME_CFGS.floor.cfg.bins, items: t.map(function (x, i) { return { id: 'i' + i, text: x.t, bin: x.bin, why: x.why }; }) });
      if (g) await api.say('worker', 'So the robot lifts, and I fix and decide. I can live with that.'); return g; } },
    { id: 'lm8-robots', who: 'jas', after: 1, pay: 500, label: 'Technology and jobs', ask: 'I keep reading scary things about robots. Can I ask you something?', run: async function (api, seed) { return K.askGrade(await api.ask('jas', ROBOT_QS[seed % ROBOT_QS.length], null)); } },
    { id: 'lm8-security', who: 'rosa', after: 2, pay: 800, label: 'Job or career security?', ask: 'My friends are arguing about security at work. Can you sort what they said?', run: async function (api, seed) {
      var t = securityTask(seed); var g = await K.sort(api, { title: 'Help Rosa: job or career security?', name: 'help-sort', leave: true, intro: '<b>Job security</b>: staying in one role. <b>Career security</b>: being able to find new work quickly.', bins: SECURITY_BINS, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      if (g) await api.say('rosa', 'I’m sending this to the group chat.'); return g; } },
    { id: 'lm8-capital', who: 'librarian', after: 2, pay: 800, label: 'Human capital', ask: 'I’m making a poster about human capital. Can you sort these?', run: async function (api, seed) {
      var t = capitalTask(seed); var g = await K.sort(api, { title: 'Help Mx. Lin: which part of human capital?', name: 'help-sort', leave: true, wide: true, intro: 'Human capital is the value of your education, knowledge, skills and experience together.', bins: CAPITAL, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      if (g) await api.say('librarian', 'Perfect. Four parts, one poster.'); return g; } },
    { id: 'lm8-terms', who: 'dev', after: 3, pay: 600, label: 'Short- or long-term milestones', ask: 'I’m making a plan. Which of these are short-term?', run: async function (api, seed) {
      var t = termTask(seed); var g = await K.sort(api, { title: 'Help Dev: short-term or long-term?', name: 'help-sort', leave: true, intro: 'Short-term: soon, often this year. Long-term: a big goal years away.', bins: TERM_BINS, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      if (g) await api.say('dev', 'Short steps to a long goal. Like stairs. Nice.'); return g; } },
    { id: 'lm8-plan', who: 'sam', after: 3, pay: 500, label: 'Plans that bend', ask: 'Can I ask you about career plans?', run: async function (api, seed) { return K.askGrade(await api.ask('sam', PLAN_QS[seed % PLAN_QS.length], null)); } },
    { id: 'lm8-floor', who: 'greta', after: 1, pay: FLOOR_PAY, label: 'An extra warehouse shift', game: true, ask: 'New tasks came in. Can you help me sort them, robot or person?', run: async function (api, seed) {
      var r = await api.minigame(floorOpts(api, seed, true)); return K.gameGrade(r); } }
  ];
  var GOSSIP = [
    { id: 'g-gp-0', who: 'grandpa', after: -1, lines: ['In 2015, half my street lost work when oil prices fell.', 'The ones who found new work fast had learned new things along the way.'] },
    { id: 'g-lin-0', who: 'librarian', after: -1, lines: ['Have you seen today’s News? “ROBOTS TAKE ALL JOBS BY FRIDAY.”', 'I checked. It’s Wednesday. We’ll see.'] },
    { id: 'g-mo-0', who: 'worker', after: -1, lines: ['There’s a robot on our site that lays bricks.', 'It can’t read a plan or fix a mistake. That’s still me.'] },
    { id: 'g-greta-1', who: 'greta', after: 0, lines: ['Fifteen years I’ve worked here. Same job, every day.', 'If the robots take it, I don’t know what else I can do.'] },
    { id: 'g-chip-1', who: 'chip', after: 0, lines: ['Big story, kid! ROBOTS! Everyone is reading it!', 'Facts? Facts are... a later story.'] },
    { id: 'g-dev-2', who: 'dev', after: 1, lines: ['The warehouse is hiring a robot technician.', 'They fix and program the robots. It pays more than packing!'] },
    { id: 'g-bo-2', who: 'bo', after: 1, lines: ['I took a forklift course and a computer course last year.', 'Now they want me to help run the robots. Funny, right?'] },
    { id: 'g-okafor-3', who: 'okafor', after: 2, lines: ['Three warehouse workers came in this week.', 'The ones with a network found leads in a day. Who you know matters.'] },
    { id: 'g-mayor-3', who: 'mayor', after: 2, lines: ['People are scared about the robots. I get letters every day.', 'Fear is easy to print. A plan is harder.'] },
    { id: 'g-greta-4', who: 'greta', after: 3, lines: ['I start robot-tech training next month. Me! Programming robots!', 'Fifteen years of knowing this warehouse counts for a lot.'] },
    { id: 'g-chip-4', who: 'chip', after: 3, lines: ['The correction ran on page one: “ROBOTS CHANGE SOME TASKS. WORKERS ADAPT.”', 'It got more readers than the scary one. Who knew?'] },
    { id: 'g-dev-4', who: 'dev', after: 3, lines: ['The {name} Path is on the warehouse wall now. Course, then robot tech.', 'Six people signed up the first day.'] }
  ];
  function gossip(S, api) { return K.gossip(GOSSIP, api); }
  function mailTask(seed, last) {
    var k = mailKind(seed, last), from = 'Ms. Okafor', I = function (list) { return list.map(function (x, i) { return { id: 'i' + i, text: x[0] || x.t, bin: x[1] || x.bin, why: x[2] || x.why }; }); };
    if (k === 'force') { var f = forceTask(seed); return { label: 'Town Mail: which force?', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, wide: true, intro: 'A letter from Ms. Okafor: “Which force is it?”', bins: FORCES, items: I(f) }); } }; }
    if (k === 'tasks') { var t = tasksTask(seed); return { label: 'Town Mail: robot or person?', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, intro: 'A letter from Ms. Okafor: “Robot or person?”', bins: GAME_CFGS.floor.cfg.bins, items: I(t) }); } }; }
    if (k === 'capital') { var c = capitalTask(seed); return { label: 'Town Mail: human capital', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, wide: true, intro: 'A letter from Ms. Okafor: “Which part of human capital?”', bins: CAPITAL, items: I(c) }); } }; }
    var m = termTask(seed);
    return { label: 'Town Mail: milestones', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, intro: 'A letter from Ms. Okafor: “Short-term or long-term?”', bins: TERM_BINS, items: I(m) }); } };
  }

  function chapterSteps(ch, S, api) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the Job Centre and see Ms. Okafor', 'okafor');
        await api.say('okafor', ['Hey, hey! Have you seen the News? Everyone’s scared about robots.', 'Here’s the truth: the labour market is always moving. Some jobs are new, some shrink, some stay strong.', 'Try sorting these.']);
        await K.sort(api, { title: 'New, shrinking, or still going strong?', name: 'entry', story: true, key: 'q-entry', label: 'New, shrinking, or still going strong', ch: 0, wide: true,
          intro: '<b>New</b>: didn’t really exist 25 years ago. <b>Shrinking</b>: fewer of these jobs each year. <b>Still going strong</b>: needed then and now.', bins: AGES, items: ENTRY.slice(0, 8).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      }));
      a.push(step('alberta', async function (api, S) {
        await api.say('okafor', ['In November 2014, oil prices were high, and Alberta’s unemployment rate was 4.4%.', 'Then oil prices fell. By November 2016, it was 9.0%. Thousands of people had to find new work.']);
        await api.ask('okafor', { text: 'About how many times bigger is 9.0% than 4.4%?', opts: [['About 2 times. Twice as many people were looking for work.', 1, 'Yes. 9.0 ÷ 4.4 is about 2.'], ['About 4.6 times.', 0, '9.0 − 4.4 = 4.6. That’s a difference, not how many times bigger. Try 9.0 ÷ 4.4.'], ['About half.', 0, '9.0 is bigger than 4.4, so it can’t be half.']] }, 'q-times', 'Unemployment 4.4% → 9.0%: how many times bigger', 0);
        await K.sort(api, { title: 'Which force is it?', name: 'forces', story: true, key: 'q-forces', label: 'Which force: economic cycle, technology, or social change', ch: 0, wide: true, intro: 'Three forces move the labour market: <b>economic cycles</b> (booms and busts), <b>technology</b>, and <b>social change</b> (how people live).', bins: FORCES,
          items: FORCE_ITEMS.slice(0, 6).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      }));
      a.push(step('pick', async function (api, S) {
        await api.quest('Go home and pick a career to future-proof', 'table');
        var r = await K.pick(api, { id: 'career', title: 'Pick a career to future-proof', name: 'pickcareer', intro: 'Pick a career you’re curious about. You’ll check how change could affect it, and make it future-proof.', noReason: true,
          options: CAREER_KEYS.map(function (k) { return { k: k, title: CAREERS[k].name, icon: CAREERS[k].icon }; }), footNote: 'Your real project can use any career on alis.alberta.ca.' });
        S.career = r.pick; api.hud();
        await K.sort(api, { title: 'Three forces and your career', name: 'myforces', story: true, key: 'q-myforces', label: 'Forces that could change my career', ch: 0, wide: true, intro: 'How could each force change being a <b>' + esc(C(S).name.toLowerCase()) + '</b>?', bins: FORCES,
          items: C(S).forces.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
        api.give('Career card: ' + C(S).name, C(S).icon, 'table');
      }));
      a.push(step('hunch', async function (api, S) { // the side story starts
        S.story.gretaOut = 1; api.refresh();
        await api.quest('Greta from Prairie Parcel is outside the News stand, reading the paper', 'greta');
        await api.say('greta', ['“ROBOTS TAKE ALL JOBS BY FRIDAY.” That’s my warehouse they’re talking about.', 'I’ve packed boxes there for fifteen years. Robots arrive next month.', 'Is that it? Am I done?']);
        await api.say('you', ['I don’t know yet. Ms. Okafor says the labour market always moves. But “all jobs”?', 'Let me find out. I’ll keep notes.']);
        S.story.greta1 = 1; api.give('Future notes', '🔍', 'greta'); api.refresh();
      }));
      a.push(step('end1', async function (api, S) {
        await api.quest('Tell Ms. Okafor about Greta', 'okafor');
        await K.typed(api, { id: 'adapt', title: 'In your own words', prompt: 'Why might being able to adapt be a better career plan than counting on one job forever?' });
        await api.say('okafor', ['Exactly. Now do Step 1 of your project: pick a career and how the forces could change it.', 'Next time: technology. Does it take jobs, or change them?']);
      }));
    }
    if (ch === 1) {
      a.push(step('farm', async function (api, S) {
        await api.quest('Ms. Okafor wants to talk about technology', 'okafor');
        await api.say('okafor', ['Farms use GPS tractors and drones now. Fewer people drive tractors all day.', 'But farms need people who can fix, program and fly the machines. Technology takes away some tasks and creates new ones.']);
        await api.ask('okafor', ROBOT_QS[0], 'q-allrobots', 'Will robots take all the jobs?', 1);
        await K.sort(api, { title: 'Tech check: ' + C(S).name, name: 'techcheck', story: true, key: 'q-techcheck', label: 'Tech check: tasks that shrink and grow', ch: 1, intro: 'For a <b>' + esc(C(S).name.toLowerCase()) + '</b>: which tasks might technology <b>shrink</b>, and which might it <b>grow</b>?',
          bins: [{ id: 'shrink', label: 'Might shrink', icon: '📉' }, { id: 'grow', label: 'Might grow', icon: '📈' }], items: C(S).shrink.map(function (t) { return [t, 'shrink']; }).concat(C(S).grow.map(function (t) { return [t, 'grow']; })).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      }));
      a.push(step('floor2', async function (api, S) { // clue 1: the robots take some tasks, and add new ones
        await api.quest('The robots arrived at Prairie Parcel. Greta wants you to see.', 'greta');
        if (!S.floors.ch2) await api.say('greta', ['They’re here. Four robots. My boss gave me a list of tasks and said “sort them: robot or person.”', 'Help me? Quick, before the trucks come.']);
        await floorShift(api, S, 'ch2', 2);
        await api.say('you', ['Look at the list. The robots got the repeat tasks: moving boxes, scanning, wrapping.', 'But fixing the robots, training people, fixing wrong orders? Those still need a person.']);
        await api.say('greta', 'And someone has to program them. That’s... new.');
        S.story.floor = 1; api.toast('Added to your Future notes: what the robots do'); api.save();
      }));
      a.push(step('end2', async function (api, S) {
        await api.quest('Tell Ms. Okafor what you saw', 'okafor');
        await K.typed(api, { id: 'newskill', title: 'In your own words', prompt: 'What new skill would help a ' + C(S).name.toLowerCase() + ' keep up with technology?' });
        await api.say('okafor', ['Now do Step 2 of your project: the tech check.', 'Next time: resilience. Why do some people find new work fast, and others don’t?']);
      }));
    }
    if (ch === 2) {
      a.push(step('rosadev', async function (api, S) {
        await api.quest('Ms. Okafor has a story about two oil workers', 'okafor');
        await api.say('okafor', ['Two oil workers lost their jobs in 2016. Dev had done one job for 15 years and never took training.', 'Rosa took safety and project courses, kept in touch with coworkers, and learned new software. She found work in 2 months. Dev took over a year.']);
        await api.ask('okafor', { text: 'Why did Rosa find work so much faster?', opts: [['She kept building her human capital and her network, so she had career security.', 1, 'Yes. She built resilience before she needed it.'], ['She was luckier than Dev.', 0, 'It wasn’t luck. She prepared.'], ['She had more job security.', 0, 'Dev had job security: one role for years. Rosa had career security.']] }, 'q-rosa', 'Why Rosa found work faster (career security)', 2);
        await K.sort(api, { title: 'Job security or career security?', name: 'security', story: true, key: 'q-security', label: 'Job security or career security', ch: 2, intro: '<b>Job security</b>: staying in one role. <b>Career security</b>: being able to find new work quickly.', bins: SECURITY_BINS, items: SECURITY.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
        await K.sort(api, { title: 'Human capital', name: 'capital', story: true, key: 'q-capital', label: 'The parts of human capital', ch: 2, wide: true, intro: 'Human capital is the value of your <b>education</b>, <b>knowledge</b>, <b>skills</b> and <b>experience</b> together.', bins: CAPITAL, items: CAPITAL_ITEMS.slice(0, 4).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      }));
      a.push(step('bo', async function (api, S) { // clue 2: Greta and Bo
        S.story.boOut = 1; api.refresh();
        await api.quest('Greta’s coworker Bo wants to talk to you', 'bo');
        await api.say('bo', ['Greta and I started at the warehouse the same year.', 'She packed boxes. Me too. But I took a forklift course, then a computer course. I kept in touch with drivers and managers.', 'Now they want me to help run the robots.']);
        await api.ask('bo', { text: 'So why am I okay, and Greta is scared?', opts: [['You built career security: courses, skills and a network. Greta has job security, but only for one job.', 1, 'That’s it. And she can still start now.'], ['You’re just better at your job.', 0, 'Greta is great at packing. That’s not the difference.'], ['The robots like you more.', 0, 'Ha. No. It’s about what I added along the way.']] }, 'story-bo', 'Greta and Bo: job security vs. career security', 2);
        S.story.bo = 1; api.toast('Added to your Future notes: Greta and Bo'); api.save();
      }));
      a.push(step('floor3', async function (api, S) {
        await api.quest('Help Greta at the warehouse again', 'greta');
        await floorShift(api, S, 'ch3', 3);
      }));
      a.push(step('rank', async function (api, S) {
        await api.quest('Go home and rank the skills that would make you most resilient', 'table');
        await K.order(api, { id: 'skills', title: 'Rank six transferable skills', name: 'rankskills', intro: 'For a <b>' + esc(C(S).name.toLowerCase()) + '</b>: most important at the top. There’s no single right order.', items: SKILL_LIST.map(function (x) { return { id: x[0], text: x[1] }; }), topLabel: 'Most important for my career', bottomLabel: 'Least important', saveText: 'Save my ranking' });
        await K.chips(api, { id: 'network', title: 'My network', name: 'network', intro: 'Your network is the people who could help you learn about careers. Who is in yours already?', groups: [{ k: 'who', label: 'People I could ask (by role)', min: 2, max: 4, opts: [{ k: 'family', label: 'A family member' }, { k: 'coach', label: 'A coach' }, { k: 'teacher', label: 'A teacher' }, { k: 'neighbour', label: 'A neighbour' }, { k: 'counsellor', label: 'A counsellor' }, { k: 'friendparent', label: 'A friend’s parent' }, { k: 'boss', label: 'A boss or volunteer leader' }] }], saveText: 'Save my network' });
        api.give('Resilience card', '🧳', 'table');
      }));
      a.push(step('end3', async function (api, S) {
        await api.quest('Show Ms. Okafor your resilience card', 'okafor');
        await api.say('okafor', ['Now do Step 3 of your project: your human capital, your skills ranking, and your network.', 'Next time: a plan with milestones and a backup. And Future Day is coming!']);
      }));
    }
    if (ch === 3) {
      a.push(step('amira', async function (api, S) {
        await api.quest('Ms. Okafor has one more example: Amira’s plan', 'okafor');
        await api.say('okafor', ['Amira wants to be a software developer. She wrote one big goal and smaller steps to get there: milestones.', 'And a backup, in case her goal changes.']);
        await K.sort(api, { title: 'Short-term or long-term?', name: 'terms', story: true, key: 'q-terms', label: 'Short-term or long-term milestones', ch: 3, intro: '<b>Short-term</b>: soon, often this year. <b>Long-term</b>: a big goal years away.', bins: TERM_BINS, items: TERMS.slice(0, 6).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
        await api.ask('okafor', PLAN_QS[0], 'q-rigid', 'Why not one job forever?', 3);
      }));
      a.push(step('myplan', async function (api, S) {
        await api.quest('Go home and build your plan', 'table');
        var c = C(S), others = CAREER_KEYS.filter(function (k) { return k !== S.career; });
        await K.chips(api, { id: 'plan', title: 'My plan: ' + c.name, name: 'planchips', intro: 'Long-term goal: <b>' + esc(c.name) + '</b>. Pick your short-term milestones, and a backup career.',
          groups: [{ k: 'm', label: 'Milestones (short-term steps)', min: 2, max: 4, opts: [{ k: 'course', label: 'A course this year' }, { k: 'club', label: 'Join a club or team' }, { k: 'volunteer', label: 'Volunteer somewhere related' }, { k: 'talk', label: 'Talk to someone in this career' }, { k: 'hs', label: 'Choose the right high school courses' }, { k: 'skill', label: 'Build my top skill' }] },
            { k: 'b', label: 'My backup career', min: 1, max: 1, opts: others.map(function (k) { return { k: k, label: CAREERS[k].name, icon: CAREERS[k].icon }; }) }], saveText: 'Save my plan' });
        await K.typed(api, { id: 'change', title: 'If things change', prompt: 'What could make you change your plan? What would you do then?' });
        api.give('My plan', '🗺️', 'table');
      }));
      a.push(step('day', async function (api, S) { // the hero beat: Future Day
        S.scene = 'day'; api.refresh();
        await api.quest('Future Day is starting at the Community Centre!', 'okafor');
        api.fx.face('all');
        await api.say('okafor', ['Welcome to Future Day! Grade 8s, share your advice. Grade 7s, ask anything.', 'And Prairie Parcel’s workers came too.']);
        if (!S.day) S.day = { got: 0, asked: {} };
        var c = C(S), Qs = [
          ['q-day-change', 'kid1', { text: 'How could your career change in the future?', opts: [['Economic cycles, technology and social change could all change it. Like: ' + c.forces[1][0].toLowerCase() + '.', 1, 'Whoa. Okay.'], ['It won’t change. Careers stay the same.', 0, 'The labour market keeps moving.'], ['Only the pay changes.', 0, 'Tasks, tools and demand change too.']] }],
          ['q-day-robots', 'kid2', { text: 'Will robots take all the jobs?', opts: [['No. They take some tasks and create new ones, so learning new skills matters.', 1, 'Phew.'], ['Yes, by Friday.', 0, 'That’s the headline. Is it true?'], ['Only the hard jobs.', 0, 'Robots take repeat tasks, not “hard” ones.']] }],
          ['q-day-ready', 'kid3', { text: 'How are you getting ready?', opts: [['I’m building my human capital and my network, and I have milestones and a backup.', 1, 'That’s a real plan.'], ['I picked one job, and I’ll stay there forever.', 0, 'That’s job security. What about career security?'], ['I’m waiting to see what happens.', 0, 'Resilience is built before you need it.']] }],
          ['q-day-greta', 'greta', { text: 'I’ve done one job for fifteen years. Is it too late for me?', opts: [['No. Your experience counts. Add one course and reach out to people, and you build career security now.', 1, 'Okay. Okay! I can do that.'], ['Yes. It’s too late.', 0, 'It’s never too late to add to human capital.'], ['Just hope the robots break.', 0, 'Hope isn’t a plan.']] }]
        ];
        for (var i = 0; i < Qs.length; i++) {
          var q = Qs[i]; if (S.day.asked[q[0]]) continue;
          var r = await api.ask(q[1], q[2], q[0], 'Future Day: ' + q[2].text, 3);
          S.day.asked[q[0]] = 1; if (r.first) { S.day.got++; api.fx.rise(q[1], '+1'); }
          api.save(); api.hud();
        }
        S.win = S.day.got >= POINTS_TO_WIN; api.save();
        await api.say('okafor', S.win ? 'The Grade 7s are convinced. Great advice!' : 'Good try! A few Grade 7s are still unsure. You can replay this chapter from the Menu.');
        await api.say('chip', ['Hi. Chip Tanner, the News. I wrote the robot headline.', 'Scary sells papers. But I listened today. I’m running a correction: “ROBOTS CHANGE SOME TASKS. WORKERS ADAPT.”']);
        await api.say('greta', ['And I signed up for robot-tech training. Bo is helping me.', 'Fifteen years of knowing that warehouse? Turns out that’s worth a lot.']);
        S.story.day = 1; api.save();
        await K.hero(api, { who: 'bo', lines: ['Prairie Parcel made a training path: a computer course, then robot tech. For anyone on the floor.', 'Our boss wanted to name it. We picked the ' + api.profile.name + ' Path.'],
          medal: 'Future-Proof medal', icon: '🛡️', kicker: 'Future Day', title: 'The ' + api.profile.name + ' Path', reply: ['Thanks! Keep learning, everyone. That’s the whole secret.'] });
        S.story.hero = 1; S.scene = null; api.refresh();
      }));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and pin your plan to your My Plan wall', 'myplan');
        var c = C(S), p = S.typed.plan || {}, firstTime = !S.finished; S.finished = true;
        if (firstTime) api.profileAdd('closet', 'techsuit');
        api.profileAdd('plan', { mission: '8-labour-market', title: 'Future-Proof Me', text: 'Goal: ' + c.name + '. Backup: ' + ((p.b && CAREERS[p.b[0]]) ? CAREERS[p.b[0]].name : 'to be decided') + '. I’m building career security.' });
        api.profileAdd('finished', '8-labour-market'); api.refresh();
        await api.say('okafor', [S.win ? 'Future-proof AND convincing. Big play!' : 'A path named after you! And next time, convince every Grade 7.', 'Your closet has new Robot tech coveralls, and your My Plan wall has a new page.', 'Now do Step 4 of your project: your plan with milestones and a backup.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }

  T.mission({
    id: '8-labour-market', unitLabel: 'CEFL Grade 8 · Careers and the Labour Market · Project: Future-Proof Me', title: 'Future-Proof: Robots at the Warehouse',
    iCan: 'I can explain how economic cycles, technology and social change move the labour market, and build career resilience with a plan and a backup.',
    foot: 'This is a model. Unemployment figures are from Statistics Canada (2014, 2016). The people and businesses are made up.',
    bagTip: 'Your Bag holds what you collect: your career card, your resilience card, your plan and your Future notes.',
    realRule: 'Real gives no hints, and the Grade 7s still need 3 good answers', afterLine: 'Mission complete. Open Menu → Report to show your teacher.',
    chapters: [
      { name: 'The market keeps moving', step: 'Step 1', moment: 'Moment 1: the labour market keeps moving' },
      { name: 'Tech check', step: 'Step 2', moment: 'Moment 2: technology, jobs lost and gained' },
      { name: 'Career resilience', step: 'Step 3', moment: 'Moment 3: resilience and human capital' },
      { name: 'Goals with milestones', step: 'Step 4', moment: 'Moment 4: goals with milestones' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps, guide: 'okafor',
    helpers: function () { return HELPS; }, gossip: gossip, mail: function (S, seed, last) { return mailTask(seed, last); },
    outfit: function (S) { return S.finished ? 'techsuit' : 'none'; },
    placeObjects: function (api) { api.place('table', 'home', 4, 3, { label: 'Kitchen table' }); api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true }); },
    people: function (S) {
      var out = {}, s = S.story;
      out.greta = { name: 'Greta', role: s.hero ? 'Robot tech trainee' : 'Warehouse worker', map: s.greta1 && !s.floor ? 'town' : 'warehouse', x: s.greta1 && !s.floor ? 33 : 4, y: s.greta1 && !s.floor ? 23 : 3, dir: 'down', look: { base: 1, skin: 's2', hair: 'auburn', shirt: 'orange', pants: '#3b3f5c' }, hidden: !s.gretaOut };
      out.bo = { name: 'Bo', role: 'Warehouse lead', map: 'warehouse', x: 6, y: 4, dir: 'left', look: { base: 0, skin: 's5', hair: 'black', shirt: 'green', pants: '#2f3a5c' }, hidden: !s.boOut };
      out.chip = { name: 'Chip Tanner', role: 'Reporter, the News', map: 'news', x: 4, y: 3, dir: 'down', look: { base: 2, skin: 's1', hair: 'ginger', shirt: 'grey', pants: '#2f2f38' } };
      if (S.scene === 'day') { // the crowd stands along row 3; row 4 stays open
        out.kid1 = { name: 'Lily', role: 'Grade 7', map: 'community', x: 1, y: 3, dir: 'down', look: { base: 1, skin: 's4', hair: 'black', shirt: 'yellow', pants: '#3d4a6b' } };
        out.kid2 = { name: 'Omar', role: 'Grade 7', map: 'community', x: 2, y: 3, dir: 'down', look: { base: 0, skin: 's3', hair: 'black', shirt: 'red', pants: '#3d4a6b' } };
        out.kid3 = { name: 'Zoe', role: 'Grade 7', map: 'community', x: 3, y: 3, dir: 'down', look: { base: 3, skin: 's1', hair: 'ginger', shirt: 'teal', pants: '#3d4a6b' } };
        out.okafor = { map: 'community', x: 4, y: 3, dir: 'down' };
        out.greta = { name: 'Greta', role: 'Warehouse worker', map: 'community', x: 5, y: 3, dir: 'down', look: out.greta.look };
        out.bo = { name: 'Bo', role: 'Warehouse lead', map: 'community', x: 6, y: 3, dir: 'down', look: out.bo.look };
        out.chip = { name: 'Chip Tanner', role: 'Reporter, the News', map: 'community', x: 7, y: 3, dir: 'down', look: out.chip.look };
      }
      return out;
    },
    doorOpen: function (id) { return !!{ home: 1, grandpa: 1, jobcentre: 1, warehouse: 1, community: 1, news: 1, library: 1, bank: 1, townhall: 1 }[id]; },
    lockedLine: function (id) { return T.world.building(id).name + ' is closed today. Everyone is talking about the robots.'; },
    talk: function (id, S, api) {
      var s = S.story, done = S.finished;
      var lines = {
        okafor: done ? 'Keep learning. That’s the whole secret.' : 'Your next goal is on the gold line at the top.',
        greta: s.hero ? 'Robot tech training starts Monday. I bought a new notebook!' : s.bo ? 'Career security. I’m going to look into a course.' : s.floor ? 'So the robots get the boxes. And I get... we’ll see.' : 'Fifteen years. Same job. I don’t know anything else.',
        bo: s.hero ? 'Six people signed up for the training path. Six!' : 'Forklift course, computer course, and lots of coffee with the drivers. That’s my secret.',
        chip: s.hero ? 'Corrections sell papers too. Who knew?' : 'ROBOTS! Read all about it! Facts sold separately.',
        grandpa: 'In my day, we said “learn a trade.” Now it’s “keep learning.” Both are right.', librarian: 'Courses, books and free computers. Career security starts here.',
        worker: 'The bricklaying robot can’t read a plan. Still me.', dev: 'Robot technician! Pays more than packing.', avery: 'Drone pilot sounds cool. Is that a career?',
        kid1: 'I want to be an app developer. With a backup!', kid2: 'Robots take tasks, not jobs. I’ll remember.', kid3: 'Milestones are like levels in a game!',
        table: 'The kitchen table. Good for planning a future.',
        myplan: K.planLine(api)
      };
      return lines[id] || null;
    },
    hud: function (S) {
      var out = [{ label: 'Career', value: S.career ? CAREERS[S.career].name : '—' }], n = 0;
      Object.keys(S.floors).forEach(function (k) { if (S.floors[k].tier !== 'skip') n += Math.max(0, S.floors[k].score); });
      out.push({ label: 'Tasks sorted', value: String(n), title: 'From your warehouse shifts' });
      if (S.day) out.push({ label: 'Future Day', value: S.day.got + ' / 4', title: '3 good answers convince the Grade 7s' });
      return out;
    },
    items: function (S) {
      var it = [];
      if (S.career) it.push({ name: 'Career card: ' + C(S).name, icon: C(S).icon, note: 'Forces and tech check', view: function () { return careerHTML(S); } });
      if (S.typed.skills || S.typed.network) it.push({ name: 'Resilience card', icon: '🧳', note: 'Skills and network', view: function () { var sk = S.typed.skills || [], nw = (S.typed.network || {}).who || []; return '<p><b>My top skills:</b> ' + sk.map(function (k) { return (SKILL_LIST.filter(function (x) { return x[0] === k; })[0] || [k, k])[1]; }).join(' → ') + '</p><p><b>My network:</b> ' + esc(nw.join(', ')) + '</p>'; } });
      if (S.typed.plan) it.push({ name: 'My plan', icon: '🗺️', note: 'Milestones and a backup', view: function () { var p = S.typed.plan; return '<p><b>Long-term goal:</b> ' + esc(C(S).name) + '</p><p><b>Milestones:</b> ' + esc((p.m || []).join(', ')) + '</p><p><b>Backup:</b> ' + esc(p.b && CAREERS[p.b[0]] ? CAREERS[p.b[0]].name : '—') + '</p>' + (S.typed.change ? '<p><b>If things change:</b> ' + esc(S.typed.change) + '</p>' : ''); } });
      if (S.story.greta1) it.push({ name: 'Future notes', icon: '🔍', note: 'Robots at the warehouse', view: function () { return K.notes(notes(S)); } });
      if (S.story.hero) it.push({ name: 'Future-Proof medal', icon: '🛡️', note: 'The ' + T.api.profile.name + ' Path', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🛡️</p><p style="text-align:center"><b>Future-Proof</b><br>For trading a scary headline for a real plan.</p>'; } });
      return it;
    },
    report: function (S) {
      var h = '<p>Career: <b>' + (S.career ? esc(C(S).name) : 'not picked yet') + '</b>' + (S.finished ? ' · Future Day: <b>' + S.day.got + ' of 4</b> (' + (S.win ? 'the Grade 7s were convinced' : 'goal not reached') + ')' : '') + '</p>';
      var fl = Object.keys(S.floors); if (fl.length) h += '<h3>Warehouse shifts</h3>' + K.table(fl.map(function (k) { var x = S.floors[k]; return [k === 'ch2' ? 'Chapter 2' : 'Chapter 3', String(x.score), K.TIER_WORD[x.tier]]; }), ['When', 'Score', 'Result']);
      h += K.wrote(S, [['adapt', 'Why adapting beats one job forever'], ['newskill', 'A new skill to keep up'], ['skills', 'My skills ranking', function (k) { return (SKILL_LIST.filter(function (x) { return x[0] === k; })[0] || [k, k])[1]; }], ['change', 'If my plan changes']]);
      h += '<h3>Robots at the warehouse</h3><p>' + (S.story.hero ? 'Solved: the headline was corrected, Greta started training, and the warehouse’s training path was named after them.' : S.story.bo ? 'Found the difference between Greta and Bo.' : S.story.greta1 ? 'Collecting clues.' : 'Not started.') + '</p>';
      return h;
    },
    test: { scenes: [null, { story: { gretaOut: 1, greta1: 1 } }, { story: { gretaOut: 1, greta1: 1, floor: 1, boOut: 1 } }, { scene: 'day', career: 'nurse', story: { gretaOut: 1, boOut: 1 } }],
      CAREERS: CAREERS, ENTRY: ENTRY, FORCE_ITEMS: FORCE_ITEMS, SECURITY: SECURITY, CAPITAL_ITEMS: CAPITAL_ITEMS, TERMS: TERMS, GAME_CFGS: GAME_CFGS, forceTask: forceTask, entryTask: entryTask, securityTask: securityTask, capitalTask: capitalTask, termTask: termTask, tasksTask: tasksTask, mailTask: mailTask, HELPS: HELPS, GOSSIP: GOSSIP }
  });
  function notes(S) {
    var s = S.story, li = [];
    if (s.greta1) li.push('<b>Greta, at the News stand:</b> “ROBOTS TAKE ALL JOBS BY FRIDAY.” She has packed boxes at Prairie Parcel for 15 years.');
    if (s.floor) li.push('<b>The warehouse floor:</b> robots took the repeat tasks (moving, scanning, wrapping). Fixing robots, training people and solving problems still need a person. Someone has to program them.');
    if (s.bo) li.push('<b>Greta and Bo:</b> same start. Bo took courses and kept in touch with people: career security. Greta has job security, for one job.');
    if (s.day) li.push('<b>Future Day:</b> the reporter is running a correction. Greta signed up for robot-tech training.');
    if (s.hero) li.push('<b>The ' + esc(T.api.profile.name) + ' Path:</b> a course, then robot tech, for anyone on the warehouse floor.');
    return li;
  }
})();
