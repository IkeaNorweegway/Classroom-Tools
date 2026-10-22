/* CEFL Town mission: Grade 7 Experiences and Employment — "The Garden Crew" (companion to the project Experience Plan). LO 7-EX.
   Four chapters, one after each project step: My experiences · Work preferences · Plan one experience (work-life balance, the rules
   for your age) · Welcome and safety (the three rights, belonging). You plan a volunteer experience and help the Community Garden.
   Model (MODEL START … END, no DOM): kinds of experiences, types of work, a week's hours, Alberta's youth employment rules for ages
   13–14 (with a parent's OK: up to 2 hours on a school day, up to 8 on a non-school day, never 9 pm to 6 am; the rules cover
   employees, not volunteers or the self-employed), and the three rights (know, participate, refuse). Goal: the Grade 6 class signs
   up to volunteer, meaning at least 3 of 4 first-try answers to their questions. The Safety sweep game (kit spotRush) counts the
   hazards you find; it never changes the goal.
   Side story, "The empty garden": every new volunteer quits after one day. Rosa's worry (Ch 1) → Kai worked alone, left out
   (Ch 2) → the sign-up sheet asks too much of a week (Ch 3) → the shed inspection: hazards and no first-day plan; Mr. Pruitt never
   made one. Your Welcome and Safety checklist becomes the garden's first-day plan, named after you (Ch 4).
   Between lessons (HELP START … HELP END): townspeople's own questions about experiences, work, balance and safety, an extra Safety
   sweep, and Town Mail. Simplifications: a week is 168 hours; the age rules are the 13–14 rules only. */
(function () {
  'use strict';

/* MODEL START ── no DOM. Time in hours. ── */
var KINDS = [{ id: 'cur', label: 'Curricular', icon: '📚' }, { id: 'extra', label: 'Extracurricular', icon: '🎺' }, { id: 'work', label: 'Work-related', icon: '🧰' }];
var EXPERIENCES = [ // workbook Moment 1 (curricular = part of your classes; extracurricular = outside class, by choice; work-related = volunteering, a job or a small business)
  ['Being on the school volleyball team', 'extra', 'Outside class, by choice.'], ['Selling bracelets you make at a craft fair', 'work', 'A small business: entrepreneurship.'], ['Building a bridge model in science class', 'cur', 'Part of a class.'],
  ['Shovelling snow for neighbours, $10 a driveway', 'work', 'A small business.'], ['Sorting food at the food bank', 'work', 'Volunteering is work-related.'], ['Art club at lunch', 'extra', 'Outside class, by choice.'],
  ['Writing a book report for ELA', 'cur', 'Part of a class.'], ['Walking a neighbour’s dog for pay', 'work', 'A small business.'], ['Chess club after school', 'extra', 'Outside class, by choice.'], ['A wind-power project for the science fair', 'cur', 'Part of science class.']
];
var NOAH_WEEK = { total: 168, sleep: 63, school: 32.5, band: 3, other: 4 }; // workbook Moment 3
function hoursLeft(w) { return w.total - (w.sleep + w.school + w.band + w.other); }
/* Alberta youth employment rules, ages 13–14, with a parent's OK (employees only) */
function shiftOK(sh) { // sh: { school: bool, start: hour (24h), end: hour }
  var len = sh.end - sh.start, no = [];
  if (sh.school && len > 2) no.push('It is ' + len + ' hours, and only 2 are allowed on a school day.');
  if (!sh.school && len > 8) no.push('It is ' + len + ' hours, and only 8 are allowed on a non-school day.');
  if (sh.start < 6 || sh.end > 21) no.push('No work between 9 pm and 6 am.');
  if (no.length) return { ok: false, why: no.join(' ') };
  return { ok: true, why: sh.school ? 'Up to 2 hours on a school day, before 9 pm.' : 'Up to 8 hours on a non-school day, between 6 am and 9 pm.' };
}
var SHIFTS = [
  { t: 'Tuesday (a school day), 4 pm to 6 pm', school: true, start: 16, end: 18 }, { t: 'Friday (a school day), 6 pm to 10 pm', school: true, start: 18, end: 22 },
  { t: 'Saturday, 9 am to 5 pm', school: false, start: 9, end: 17 }, { t: 'Sunday, 8 am to 6 pm', school: false, start: 8, end: 18 },
  { t: 'Wednesday (a school day), 7 pm to 8:30 pm', school: true, start: 19, end: 20.5 }, { t: 'Saturday, 5 am to 9 am', school: false, start: 5, end: 9 },
  { t: 'Thursday (a school day), 3:30 pm to 6:30 pm', school: true, start: 15.5, end: 18.5 }, { t: 'Sunday, 10 am to 4 pm', school: false, start: 10, end: 16 },
  { t: 'Monday (a school day), 3:30 pm to 5 pm', school: true, start: 15.5, end: 17 }, { t: 'Saturday, 1 pm to 9:30 pm', school: false, start: 13, end: 21.5 }
];
var RIGHTS = [{ id: 'know', label: 'Right to know', icon: '📢' }, { id: 'part', label: 'Right to participate', icon: '🙋' }, { id: 'refuse', label: 'Right to refuse', icon: '✋' }];
var RIGHT_ITEMS = [ // workbook Moment 4
  ['Sam joins the store’s safety meeting and suggests a non-slip mat', 'part', 'Taking part in keeping work safe.'], ['On the first day, Lee is shown where the fire exits are', 'know', 'Being told about safety.'],
  ['Jo says no to climbing a broken ladder', 'refuse', 'Saying no to dangerous work.'], ['Mia is trained on the cash register before she uses it', 'know', 'Being trained first.'],
  ['Raj tells the manager the freezer door sticks, so it gets fixed', 'part', 'Speaking up about safety.'], ['Kim refuses to lift a box that is far too heavy', 'refuse', 'Saying no to dangerous work.'],
  ['Ana is told which cleaner is poisonous before she starts', 'know', 'Being told about dangers.'], ['Ty joins the team that writes the new safety rules', 'part', 'Helping make work safer.']
];
var POINTS_TO_WIN = 3;
var GAME_CFGS = {
  sweep: { kind: 'spotRush', cfg: { id: 'sweep', name: 'Safety sweep', scoreWord: 'Hazards found', every: [1500, 1200], life: [5200, 3900], think: 1000, th: [[12, 5], [12, 5]],
    how: '<p><b>Safety sweep.</b> Volunteers arrive soon. Things pop up around the garden. Tap every <b>hazard</b>. Leave the safe things alone.</p><p class="ct-small">Tapping a safe thing costs 2 points. A hazard you miss costs 1.</p>',
    cards: [
      ['Rake lying teeth-up', '🧹', 1, 'Someone could step on it.'], ['Hose stretched across the path', '🪢', 1, 'A tripping hazard.'], ['Broken ladder', '🪜', 1, 'It could collapse.'], ['Water spilled by the outlet', '🔌', 1, 'Water and electricity don’t mix.'],
      ['Wasp nest by the shed door', '🐝', 1, 'People could get stung.'], ['Broken glass on the ground', '🍾', 1, 'It could cut someone.'], ['Frayed extension cord', '⚡', 1, 'It could shock someone.'], ['Open fertilizer bag by the kids’ bed', '🧪', 1, 'Kids could touch it.'],
      ['Gloves in the bin', '🧤', 0, '', 'Gloves keep hands safe.'], ['Tools on the wall hooks', '🔧', 0, '', 'Put away is safe.'], ['First-aid kit on the shelf', '🩹', 0, '', 'Exactly where it should be.'], ['Water jug in the shade', '💧', 0, '', 'Staying cool is good.'],
      ['Hose coiled up', '🌀', 0, '', 'Coiled and out of the way.'], ['Sign-in sheet at the gate', '📋', 0, '', 'Good for knowing who is here.'], ['Fire extinguisher by the door', '🧯', 0, '', 'Right where you need it.'], ['Seed packets in a box', '🌱', 0, '', 'Nothing dangerous there.']
    ].map(function (c) { return { t: c[0], icon: c[1], bad: !!c[2], why: c[3], fine: c[4] }; }) } }
};
/* MODEL END */

/* HELP START ── between lessons, on fresh seeds. Nothing here touches the mission. No DOM. ── */
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function pickN(r, a, n) { var b = a.slice(), out = []; while (out.length < n && b.length) out.push(b.splice(Math.floor(r() * b.length), 1)[0]); return out; }
function kindsTask(seed) { var r = RNG(seed * 13 + 1); r(); var out = []; ['cur', 'extra', 'work'].forEach(function (k) { out = out.concat(pickN(r, EXPERIENCES.filter(function (x) { return x[1] === k; }), 1)); }); return pickN(r, out.concat(pickN(r, EXPERIENCES.filter(function (x) { return out.indexOf(x) < 0; }), 1)), 4); }
function shiftsTask(seed) { var r = RNG(seed * 17 + 3); r(); var ok = pickN(r, SHIFTS.filter(function (s) { return shiftOK(s).ok; }), 2), no = pickN(r, SHIFTS.filter(function (s) { return !shiftOK(s).ok; }), 2); return pickN(r, ok.concat(no), 4); }
function rightsTask(seed) { var r = RNG(seed * 19 + 5); r(); var out = []; ['know', 'part', 'refuse'].forEach(function (k) { out = out.concat(pickN(r, RIGHT_ITEMS.filter(function (x) { return x[1] === k; }), 1)); }); return out; }
function balanceTask(seed) {
  var r = RNG(seed * 23 + 7); r();
  var w = { total: 168, sleep: [8, 9, 10][Math.floor(r() * 3)] * 7, school: 32.5, band: [2, 3, 4, 5][Math.floor(r() * 4)], other: [2, 4, 6, 8][Math.floor(r() * 4)] };
  return { w: w, busy: w.sleep + w.school + w.band + w.other, left: hoursLeft(w) };
}
var JOBS = [ // types of work: describe a job (workbook Moment 2)
  { who: 'A town lifeguard, about 20 hours a week, summer only', a: { emp: 0, ft: 1, perm: 1 } }, { who: 'A nurse at the hospital, 40 hours a week, all year', a: { emp: 0, ft: 0, perm: 0 } },
  { who: 'Noah, shovelling snow for neighbours each winter', a: { emp: 1, ft: 1, perm: 1 } }, { who: 'A grocery cashier, 15 hours a week, all year', a: { emp: 0, ft: 1, perm: 0 } },
  { who: 'A farm helper hired for harvest only, full-time for 6 weeks', a: { emp: 0, ft: 0, perm: 1 } }, { who: 'A dog walker who runs her own business, all year', a: { emp: 1, ft: 1, perm: 0 } }
];
var TYPE_SETTINGS = [{ k: 'emp', name: 'Employee or self-employed?', opts: ['Employee', 'Self-employed'], hint: 'Who pays them? A boss, or their own customers?' }, { k: 'ft', name: 'Full-time or part-time?', opts: ['Full-time', 'Part-time'], hint: 'About 40 hours a week is full-time. Less is part-time.' }, { k: 'perm', name: 'Permanent or temporary?', opts: ['Permanent (all year)', 'Temporary (seasonal)'], hint: 'Does it last all year, or only part of it?' }];
function jobTask(seed) { var r = RNG(seed * 29 + 11); r(); return JOBS[Math.floor(r() * JOBS.length)]; }
var PAID_QS = [
  { id: 'paid', label: 'Does unpaid work count?', text: 'My grandson says volunteering doesn’t count as experience because there’s no pay. True?', opts: [
    ['No. Volunteering is work-related experience. It builds skills and shows what you like.', 1, 'Good. He volunteers every Saturday!'], ['Yes. Only paid jobs count.', 0, 'Volunteering builds real skills. It counts.'], ['Only if he gets a certificate.', 0, 'It counts with or without one.']] },
  { id: 'business', label: 'Is a small business experience?', text: 'My neighbour’s kid sells lemonade every summer. Is that real experience?', opts: [
    ['Yes. Running a small business is work-related experience: entrepreneurship.', 1, 'Ha! I’ll tell her she’s an entrepreneur.'], ['No. Kids’ businesses don’t count.', 0, 'Planning, selling and handling money all count.'], ['Only if she makes over $100.', 0, 'It’s the experience that counts, not the amount.']] },
  { id: 'pattern', label: 'What experiences show you', text: 'I loved running the school store and planning the science fair. What might that tell me?', opts: [
    ['You might like work where you plan things and make decisions.', 1, 'Huh. I do like being in charge of things.'], ['Nothing. Experiences don’t tell you anything.', 0, 'They show what you enjoy and what you’re good at.'], ['That you must become a teacher.', 0, 'Experiences point to patterns, not one job.']] }
];
var PREF_QS = [
  { id: 'outteam', label: 'A job that fits my preferences', text: 'I love being outside and working with a team. Which job fits me best?', opts: [
    ['Landscaping crew member', 1, 'Outside and a team. Perfect.'], ['Data entry from home, alone', 0, 'That’s inside and alone.'], ['Night security guard, alone', 0, 'That’s mostly alone.']] },
  { id: 'virtual', label: 'Virtual or in person', text: 'Which of these jobs can only be done in person?', opts: [
    ['Hairstylist', 1, 'Yes. You can’t cut hair over video!'], ['Website designer', 0, 'That can be done from anywhere.'], ['Online tutor', 0, 'That one is virtual.']] },
  { id: 'part', label: 'Why choose part-time', text: 'Why might someone choose part-time work instead of full-time?', opts: [
    ['To have time for school, family or other things.', 1, 'Right. It can help with balance.'], ['Because part-time always pays more per hour.', 0, 'Not always. Usually the hourly pay is similar.'], ['Because part-time jobs have no rules.', 0, 'Part-time workers have the same rights.']] }
];
var UNSAFE_QS = [
  { id: 'slicer', label: 'What to say about unsafe work', text: 'My boss wants me to use a machine I’ve never been trained on. What should I say?', opts: [
    ['“I haven’t been trained on that. I’m not comfortable using it until someone shows me.”', 1, 'That’s your right to refuse, and your right to know.'], ['Nothing. Just try it so you don’t get in trouble.', 0, 'You can’t be punished for refusing dangerous work in Alberta.'], ['“Fine, but if I get hurt, it’s your fault.”', 0, 'Better to say no clearly and ask to be trained.']] },
  { id: 'belong', label: 'Making someone feel they belong', text: 'A new volunteer is left out and others joke about his accent. What could someone do?', opts: [
    ['Include him, stop the jokes, and tell a supervisor if it keeps happening.', 1, 'Yes. Everyone should feel they belong.'], ['Nothing. He’ll toughen up.', 0, 'Being left out makes people quit, and it isn’t fair.'], ['Tell him to change his accent.', 0, 'The jokes are the problem, not his accent.']] },
  { id: 'speak', label: 'Why young workers stay quiet', text: 'Why might a young worker not speak up about something unsafe?', opts: [
    ['They might be new, nervous, or worried about getting in trouble.', 1, 'Right. A good workplace makes speaking up easy.'], ['Young workers never see anything unsafe.', 0, 'Young workers get hurt more often than older ones.'], ['Because speaking up is against the rules.', 0, 'Speaking up is your right to participate.']] }
];
function mailKind(seed, last) { var k = ['kinds']; if (last >= 1) k.push('job'); if (last >= 2) k.push('shifts'); if (last >= 3) k.push('rights'); return k[RNG(seed * 7 + 3)() * k.length | 0]; }
/* HELP END */

  var T = window.CEFLTown, K = T.kit, esc = T.esc;
  var fmt = K.fmt, fmtW = K.fmtW, step = K.step;
  function hrs(h) { return (Math.round(h * 10) / 10) + (h === 1 ? ' hour' : ' hours'); }
  function hFmt(c) { return (Math.round(c) / 100) + ' h'; }
  var SWEEP = T.gameKit.spotRush(GAME_CFGS.sweep.cfg), SWEEP_PAY = 800;
  var RULES_HTML = '<p><b>Alberta’s rules for employees aged 13 and 14</b> (alberta.ca): a parent’s OK; up to <b>2 hours on a school day</b>; up to <b>8 hours on a non-school day</b>; <b>never between 9 pm and 6 am</b>. The rules cover employees, not volunteers or people running their own small business.</p>';
  var RIGHTS_HTML = '<p><b>Every worker’s three rights</b> (Alberta’s Occupational Health and Safety Act): the <b>right to know</b> about dangers and be trained; the <b>right to participate</b> in keeping work safe; the <b>right to refuse</b> dangerous work.</p>';

  /* ── State ── */
  function init() { return { v: 1, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), ans: {}, typed: {}, story: {}, sweeps: {}, share: null, scene: null, finished: false }; }
  function validate(S) { return !!S && S.v === 1 && !!S.typed && !!S.story && !!S.sweeps; }
  var PREFS = [['inout', 'Indoor', 'Outdoor', '🏠', '🌳'], ['place', 'In person', 'Virtual', '🤝', '💻'], ['team', 'Alone', 'Team', '🧍', '👥'], ['near', 'Near home', 'Far away', '📍', '🧭'], ['tasks', 'Same tasks each day', 'Something new each day', '🔁', '✨']];
  var MY_EXP = [['band', 'Band or choir', '🎺'], ['sport', 'A sports team', '⚽'], ['club', 'A club', '♟️'], ['chores', 'Chores at home', '🧺'], ['sibling', 'Looking after a sibling', '🧸'], ['babysit', 'Babysitting', '🍼'], ['fair', 'A science fair or school project', '🔬'], ['sell', 'Selling something I made', '🎨'], ['volunteer', 'Volunteering', '🙌'], ['pet', 'Caring for a pet', '🐾'], ['coach', 'Helping coach younger kids', '🏅'], ['game', 'Making games, videos or art', '🎮']];
  var PLANS = {
    garden: { name: 'Garden crew volunteer', icon: '🌱', where: 'Community Garden', when: 'Saturdays, 9 to 11', hours: 2, kind: 'Volunteering', ok: 'A parent’s OK, and a sign-in at the gate' },
    reading: { name: 'Reading buddy', icon: '📖', where: 'The library', when: 'Tuesdays after school, 1 hour', hours: 1, kind: 'Volunteering', ok: 'A parent’s OK, and Mx. Lin' },
    dogs: { name: 'Dog-walking business', icon: '🐕', where: 'Riverside Homes', when: 'Three walks a week, 1 hour each', hours: 3, kind: 'A small business (self-employed)', ok: 'A parent’s OK, and each dog owner' },
    food: { name: 'Food bank sorter', icon: '🥫', where: 'The Community Centre', when: 'One Saturday a month, 3 hours', hours: 0.75, kind: 'Volunteering', ok: 'A parent’s OK, and Mr. Osei' }
  };
  function prefHTML(S) { var p = S.typed.prefs; if (!p) return '<p>Not filled in yet.</p>'; return K.table(PREFS.map(function (x) { var v = (p[x[0]] || [])[0]; return [x[1] + ' or ' + x[2].toLowerCase(), '<b>' + esc(v === 'a' ? x[1] : v === 'b' ? x[2] : 'Either') + '</b>']; }).concat([['Someday I’d rather be', '<b>' + esc({ emp: 'An employee', self: 'Self-employed', ns: 'Not sure yet' }[(p.self || [])[0]] || '—') + '</b>']])); }
  function sweepOpts(api, seed, help) {
    return { title: 'Safety sweep: ' + (help ? 'an extra sweep' : 'the Community Garden'), name: 'minigame', game: SWEEP, seed: seed, seconds: 60, leave: !!help,
      skipNote: 'Skipping is okay. Mr. Pruitt will do a quick check himself.',
      tierText: help ? K.payTiers(SWEEP_PAY)
        : { great: 'The garden is safe and ready for volunteers.', ok: 'Most hazards found. Good work.', poor: 'A few hazards got past you. Spotting them takes practice.' } };
  }
  async function sweep(api, S, key, n) {
    if (!S.sweeps[key]) { var r = await api.minigame(sweepOpts(api, S.seed * 43 + n, false)); S.sweeps[key] = { tier: r.tier, score: r.score }; api.save(); api.hud(); }
    var t = S.sweeps[key].tier;
    await api.say('pruitt', t === 'great' ? 'You have sharp eyes! I walked past that rake all week.' : t === 'ok' ? 'Thanks. Fewer things to trip on.' : t === 'skip' ? 'No problem. I’ll have a look.' : 'Hazards hide in plain sight. You’ll get faster.');
  }

  /* ── Between lessons ── */
  var HELPS = [
    { id: 'ex-kinds', who: 'avery', after: 0, pay: 600, label: 'Kinds of experiences', ask: 'I’m filling in an experience list for a volunteer form. Can you help me sort it?', run: async function (api, seed) {
      var t = kindsTask(seed); var g = await K.sort(api, { title: 'Help Avery: what kind of experience?', name: 'help-sort', leave: true, wide: true, intro: '<b>Curricular</b>: part of your classes. <b>Extracurricular</b>: outside class, by choice. <b>Work-related</b>: volunteering, a job, or a small business.', bins: KINDS, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      if (g) await api.say('avery', 'My form looks way more impressive now. Thanks!'); return g; } },
    { id: 'ex-paid', who: 'grandpa', after: 0, pay: 500, label: 'What counts as experience', ask: 'Can I ask you about experience?', run: async function (api, seed) { return K.askGrade(await api.ask('grandpa', PAID_QS[seed % PAID_QS.length], null)); } },
    { id: 'ex-type', who: 'dev', after: 1, pay: 800, label: 'Describe a job', ask: 'My cousin got a job and I’m filling in a form for her. Can you describe it?', run: async function (api, seed) {
      var j = jobTask(seed); var g = await K.fix(api, { title: 'Help Dev: describe the job', name: 'help-type', intro: 'Describe this job: <b>' + esc(j.who) + '</b>.', docTitle: 'Type of work', settings: TYPE_SETTINGS.map(function (st) { return { k: st.k, name: st.name, opts: st.opts, right: j.a[st.k], hint: st.hint }; }), doneHtml: '<p class="ct-small">Every job can be described with these words.</p>' });
      if (g) await api.say('dev', 'Done! The form is filled in. My cousin owes you a cookie.'); return g; } },
    { id: 'ex-pref', who: 'jas', after: 1, pay: 500, label: 'Work that fits', ask: 'Can you help me think about what work fits me?', run: async function (api, seed) { return K.askGrade(await api.ask('jas', PREF_QS[seed % PREF_QS.length], null)); } },
    { id: 'ex-rules', who: 'worker', after: 2, pay: 800, label: 'The rules for a 13-year-old', ask: 'My niece is 13 and got shift offers. Which ones are allowed?', run: async function (api, seed) {
      var t = shiftsTask(seed); var g = await K.sort(api, { title: 'Help Mo: which shifts are allowed?', name: 'help-sort', leave: true, intro: 'Mo’s niece is 13 and has a parent’s OK for a job.', ref: RULES_HTML, refLabel: 'Show the rules', bins: [{ id: 'yes', label: 'Allowed', icon: '✅' }, { id: 'no', label: 'Not allowed', icon: '⛔' }], items: t.map(function (s, i) { var c = shiftOK(s); return { id: 'i' + i, text: s.t, bin: c.ok ? 'yes' : 'no', why: c.why }; }) });
      if (g) await api.say('worker', 'I’ll tell her which ones to say no to. Thanks.'); return g; } },
    { id: 'ex-balance', who: 'sam', after: 2, pay: 800, label: 'Hours left in a week', ask: 'My kid wants to join another club. Is there time left in her week?', run: async function (api, seed) {
      var t = balanceTask(seed), w = t.w;
      var g = await api.calc({ title: 'Help Sam: hours left in a week', name: 'help-balance', intro: '<p>Sam’s kid sleeps <b>' + (w.sleep / 7) + ' hours</b> a night, spends <b>32.5 hours</b> a week at school, <b>' + w.band + ' hours</b> at band, and <b>' + w.other + ' hours</b> on other activities.</p><p class="ct-small">Type hours as numbers, like 65.5.</p>',
        fields: [{ fmt: hFmt, k: 'b', name: 'Hours that are busy', sub: 'sleep + school + band + other', ans: Math.round(t.busy * 100), hint: (w.sleep / 7) + ' × 7 + 32.5 + ' + w.band + ' + ' + w.other + '.' }, { fmt: hFmt, k: 'l', name: 'Hours left', sub: '168 − busy hours', ans: Math.round(t.left * 100), hint: '168 − ' + t.busy + '.' }] });
      if (g) await api.say('sam', t.left >= 50 ? 'Plenty of time. She can join!' : 'Hmm. Tight. We’ll talk.'); return g; } },
    { id: 'ex-rights', who: 'nurse', after: 3, pay: 800, label: 'The three rights', ask: 'I’m teaching new nurses about their rights. Can you sort these for me?', run: async function (api, seed) {
      var t = rightsTask(seed); var g = await K.sort(api, { title: 'Help Nurse Kaur: which right?', name: 'help-sort', leave: true, wide: true, intro: 'Which right is each one?', ref: RIGHTS_HTML, refLabel: 'Show the three rights', bins: RIGHTS, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      if (g) await api.say('nurse', 'Perfect. Know, participate, refuse. I’ll put it on the break room wall.'); return g; } },
    { id: 'ex-unsafe', who: 'rosa', after: 3, pay: 500, label: 'Safety and belonging', ask: 'Can I ask you something about work?', run: async function (api, seed) { return K.askGrade(await api.ask('rosa', UNSAFE_QS[seed % UNSAFE_QS.length], null)); } },
    { id: 'ex-sweep', who: 'pruitt', after: 1, pay: SWEEP_PAY, label: 'An extra Safety sweep', game: true, ask: 'Volunteers are coming. Can you sweep the garden for hazards?', run: async function (api, seed) {
      var r = await api.minigame(sweepOpts(api, seed, true)); return K.gameGrade(r); } }
  ];
  var GOSSIP = [
    { id: 'g-pat-0', who: 'vendor', after: -1, lines: ['The Community Garden used to supply half my stall.', 'Now the tomatoes are lonely. Nobody stays to pick them.'] },
    { id: 'g-lin-0', who: 'librarian', after: -1, lines: ['Our reading buddies are volunteers too. Grade 7s, mostly.', 'Best readers in town. Best listeners, too.'] },
    { id: 'g-gp-0', who: 'grandpa', after: -1, lines: ['I volunteered at the garden for years.', 'The old coordinator knew everyone’s name. That made all the difference.'] },
    { id: 'g-avery-1', who: 'avery', after: 0, lines: ['I tried one day at the garden. Nobody told me where anything was.', 'I stood there holding a shovel for an hour.'] },
    { id: 'g-dev-1', who: 'dev', after: 0, lines: ['I run a tiny business: I fix bike chains for $5.', 'Turns out I love being my own boss. Except doing the math.'] },
    { id: 'g-kai-2', who: 'kai', after: 1, lines: ['I like working with people. That’s why I volunteered.', 'But they put me alone in the far corner. All day.'] },
    { id: 'g-mo-2', who: 'worker', after: 1, lines: ['My niece is 13 and wants a job.', 'She asked me the rules. I said, “Ask the kid who knows everything.” That’s you.'] },
    { id: 'g-osei-3', who: 'osei', after: 2, lines: ['The garden’s sign-up sheet asks for 6 hours on school nights?', 'For volunteers who are 12 and 13? That’s a lot of a week.'] },
    { id: 'g-nurse-3', who: 'nurse', after: 2, lines: ['Young workers get hurt more often in their first months on a job.', 'Usually because nobody showed them how. Training is a right.'] },
    { id: 'g-pruitt-4', who: 'pruitt', after: 3, lines: ['Every new volunteer gets the {name} Welcome now. A tour, a buddy, and the three rights.', 'Nobody has quit in three weeks.'] },
    { id: 'g-kai-4', who: 'kai', after: 3, lines: ['I came back! I’m a buddy for new volunteers now.', 'I tell them where the gloves are. And that they can always ask.'] },
    { id: 'g-pat-4', who: 'vendor', after: 3, lines: ['Garden tomatoes are back at my stall!', 'Fresh, local, and picked by a crew that stays.'] }
  ];
  function gossip(S, api) { return K.gossip(GOSSIP, api); }
  function mailTask(seed, last) {
    var k = mailKind(seed, last), from = 'Mr. Osei';
    if (k === 'kinds') { var t = kindsTask(seed); return { label: 'Town Mail: kinds of experiences', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, wide: true, intro: 'A letter from Mr. Osei: “What kind of experience is each one?”', bins: KINDS, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) }); } }; }
    if (k === 'job') { var j = jobTask(seed); return { label: 'Town Mail: describe a job', from: from, pay: 500, run: function (api) { return K.fix(api, { title: 'Town Mail', name: 'mail', intro: 'A letter from Mr. Osei: “Describe this job: <b>' + esc(j.who) + '</b>.”', docTitle: 'Type of work', settings: TYPE_SETTINGS.map(function (st) { return { k: st.k, name: st.name, opts: st.opts, right: j.a[st.k], hint: st.hint }; }) }); } }; }
    if (k === 'shifts') { var s = shiftsTask(seed); return { label: 'Town Mail: the rules for a 13-year-old', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, intro: 'A letter from Mr. Osei: “A 13-year-old with a parent’s OK. Which shifts are allowed?”', ref: RULES_HTML, refLabel: 'Show the rules', bins: [{ id: 'yes', label: 'Allowed', icon: '✅' }, { id: 'no', label: 'Not allowed', icon: '⛔' }], items: s.map(function (x, i) { var c = shiftOK(x); return { id: 'i' + i, text: x.t, bin: c.ok ? 'yes' : 'no', why: c.why }; }) }); } }; }
    var rt = rightsTask(seed);
    return { label: 'Town Mail: the three rights', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, wide: true, intro: 'A letter from Mr. Osei: “Which right is each one?”', bins: RIGHTS, items: rt.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) }); } };
  }

  /* ── Steps ── */
  function chapterSteps(ch, S, api) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the Community Centre and meet Mr. Osei, the volunteer coordinator', 'osei');
        await api.say('osei', ['Welcome! I’m Mr. Osei. I match people with volunteer jobs all over town.', 'Every experience you have tells you something about the work you’d like. Paid or not.', 'Quick warm-up. For each one, tell me: would you love it, or not?']);
        var L = [['Running a lemonade stand', '🍋'], ['Coaching kids’ soccer', '⚽'], ['Helping at an animal shelter', '🐾'], ['Fixing computers for seniors', '💻']], loved = [];
        for (var i = 0; i < L.length; i++) { var c = await api.choose('osei', L[i][1] + ' ' + L[i][0] + '?', ['I’d love this', 'Not for me']); if (c === 0) loved.push(L[i][0]); }
        S.typed.loved = loved.join(', ') || 'none of these';
        await api.say('osei', [loved.length ? 'You picked: ' + loved.join(', ') + '. Interesting!' : 'None of those? That’s useful to know too!', 'Let’s look at the kinds of experiences people have.']);
      }));
      a.push(step('noah', async function (api, S) {
        await api.say('osei', ['This is Noah, 13. He plays in the school band, did a wind-power project for the science fair, shovels snow for neighbours, and helps at the food bank.', 'Experiences come in three kinds. Can you sort these?']);
        await K.sort(api, { title: 'Kinds of experiences', name: 'kinds', story: true, key: 'q-kinds', label: 'Sort experiences: curricular, extracurricular or work-related', ch: 0, wide: true,
          intro: '<b>Curricular</b>: part of your classes. <b>Extracurricular</b>: outside class, by choice. <b>Work-related</b>: volunteering, a job, or a small business.', bins: KINDS,
          items: [EXPERIENCES[0], EXPERIENCES[1], EXPERIENCES[2], EXPERIENCES[3], EXPERIENCES[4], EXPERIENCES[6]].map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
        await api.ask('osei', PAID_QS[0], 'q-paid', 'Does unpaid work count as experience?', 0);
      }));
      a.push(step('audit', async function (api, S) {
        await api.quest('Go home and fill in your experience list at the kitchen table', 'table');
        await K.chips(api, { id: 'audit', title: 'My experiences', name: 'audit', intro: 'Pick the experiences you have had: at school, outside school, paid and unpaid.',
          groups: [{ k: 'x', label: 'Experiences I’ve had', min: 2, max: 6, opts: MY_EXP.map(function (x) { return { k: x[0], label: x[1], icon: x[2] }; }) }], texts: [{ k: 'taught', label: 'What did one of them teach you about yourself?', min: 6 }], saveText: 'Save my list' });
        await K.typed(api, { id: 'pattern', title: 'A pattern', prompt: 'Look at your list. What pattern do you notice? What kind of work might you like?' });
        api.give('Experience list', '📝', 'table'); api.hud();
      }));
      a.push(step('hunch', async function (api, S) { // the side story starts
        await api.quest('Rosa is at the Community Garden. She looks puzzled.', 'rosa');
        await api.say('rosa', ['Hi! I help run the Community Garden. Well, I try.', 'Every new volunteer quits after one day. Every single one.', 'The work is fun! Tomatoes! Sunshine! I don’t get it.']);
        await api.say('you', ['I don’t know why yet. Maybe something about the experience?', 'I’ll keep notes and figure it out.']);
        S.story.rosa = 1; api.give('Garden notes', '🔍', 'rosa'); api.refresh();
      }));
      a.push(step('end1', async function (api, S) {
        await api.quest('Tell Mr. Osei about the garden', 'osei');
        await api.say('osei', ['Volunteers quitting after one day? Something about that first day, maybe.', 'Now do Step 1 of your project: list your own experiences.', 'Next time: where and how people work. Inside, outside, alone, with a team.']);
      }));
    }
    if (ch === 1) {
      a.push(step('types', async function (api, S) {
        await api.quest('Mr. Osei wants to show you the words for types of work', 'osei');
        await api.say('osei', ['A town lifeguard: the town pays them, so they’re an employee. About 20 hours a week: part-time.', 'Shifts change each week: casual. Summer only: temporary, or seasonal.', 'Now you try. Describe Noah’s snow-shovelling.']);
        await K.fix(api, { title: 'Describe Noah’s snow business', name: 'noahtype', story: true, keyPrefix: 'q-type-', labelPrefix: 'Noah’s work: ', ch: 1, intro: 'Noah shovels snow for three neighbours, who pay him $10 a driveway.', docTitle: 'Type of work', docSub: 'Noah, 13',
          settings: [{ k: 'emp', name: 'Employee or self-employed?', opts: ['Employee', 'Self-employed'], right: 1, hint: 'Who pays Noah? His neighbours pay him directly. He runs his own business.' },
            { k: 'perm', name: 'All year or seasonal?', opts: ['All year', 'Seasonal'], right: 1, hint: 'When does it snow?' }, { k: 'io', name: 'Indoor or outdoor?', opts: ['Indoor', 'Outdoor'], right: 1, hint: 'Where is the snow?' },
            { k: 'ft', name: 'Full-time or part-time?', opts: ['Full-time', 'Part-time'], right: 1, hint: 'A few driveways after school is not 40 hours a week.' }] });
      }));
      a.push(step('prefs', async function (api, S) {
        await api.quest('Go home and fill in your work preferences', 'table');
        await K.chips(api, { id: 'prefs', title: 'My work preferences', name: 'prefs', intro: 'Where and how would you like to work? There are no wrong answers.',
          groups: PREFS.map(function (x) { return { k: x[0], label: x[1] + ' or ' + x[2].toLowerCase() + '?', min: 1, max: 1, opts: [{ k: 'a', label: x[1], icon: x[3] }, { k: 'e', label: 'Either' }, { k: 'b', label: x[2], icon: x[4] }] }; }).concat([{ k: 'self', label: 'Someday I’d rather be…', min: 1, max: 1, opts: [{ k: 'emp', label: 'An employee' }, { k: 'self', label: 'Self-employed' }, { k: 'ns', label: 'Not sure yet' }] }]), saveText: 'Save my preferences' });
        api.give('Preferences card', '🧭', 'table'); api.hud();
      }));
      a.push(step('sweep2', async function (api, S) {
        S.story.pruittOut = 1; api.refresh();
        await api.quest('Mr. Pruitt runs the Community Garden. He needs a hand.', 'pruitt');
        if (!S.sweeps.ch2) await api.say('pruitt', ['Hello! I’m Mr. Pruitt. I took over the garden this spring.', 'New volunteers come Saturday. Can you sweep for hazards first? Quick, before they arrive.']);
        await sweep(api, S, 'ch2', 2);
      }));
      a.push(step('kai', async function (api, S) { // clue 1: preferences and belonging
        S.story.kaiOut = 1; api.refresh();
        await api.quest('Kai used to volunteer at the garden. Ask him what happened.', 'kai');
        await api.say('kai', ['Yeah, I quit after one day.', 'I like working with people. I signed up to be part of a crew.', 'They put me alone in the far corner pulling weeds for five hours. When I came in for water, two volunteers made jokes about my accent.']);
        await api.ask('kai', { text: 'So why do you think I quit?', opts: [['You like working on a team, but they put you alone. And people left you out, so you didn’t feel you belonged.', 1, 'Yeah. That’s exactly it.'], ['You must not like gardening.', 0, 'I love gardening! That wasn’t it.'], ['Volunteering doesn’t count, so why stay?', 0, 'It does count. That wasn’t it either.']] }, 'story-kai', 'Why Kai quit (preferences and belonging)', 1);
        await api.say('you', 'The work didn’t fit how you like to work, and nobody made you feel welcome. That’s two problems.');
        S.story.kai = 1; api.toast('Added to your Garden notes: Kai'); api.save();
      }));
      a.push(step('end2', async function (api, S) {
        await api.quest('Tell Mr. Osei what Kai said', 'osei');
        await api.say('osei', ['A volunteer who loves teams, working alone and left out. No wonder.', 'Now do Step 2 of your project: your work preferences.', 'Next time: planning an experience that fits your week. And the rules for your age.']);
      }));
    }
    if (ch === 2) {
      a.push(step('noahweek', async function (api, S) {
        await api.quest('Mr. Osei has a question about Noah’s week', 'osei');
        await api.say('osei', ['Noah’s mom asked: with school, band, snow and the food bank, does he still have time to sleep, do homework and have fun?', 'That’s work-life balance. Let’s check his week.']);
        var g = await api.calc({ title: 'Noah’s week', name: 'noahweek', noPay: true, intro: '<p>Noah sleeps <b>9 hours</b> a night. School is <b>6.5 hours</b> a day, 5 days a week. Band is <b>3 hours</b> a week. Snow and the food bank: about <b>4 hours</b>.</p><p class="ct-small">Type hours as numbers, like 102.5.</p>',
          fields: [{ fmt: hFmt, k: 'w', name: 'Hours in a week', sub: '7 × 24', ans: 16800, hint: '7 × 24.' }, { fmt: hFmt, k: 'b', name: 'Hours that are busy', sub: 'sleep + school + band + snow and food bank', ans: Math.round((NOAH_WEEK.total - hoursLeft(NOAH_WEEK)) * 100), hint: '9 × 7 + 6.5 × 5 + 3 + 4.' }, { fmt: hFmt, k: 'l', name: 'Hours left', sub: 'for meals, homework, family, friends and fun', ans: Math.round(hoursLeft(NOAH_WEEK) * 100), hint: '168 − 102.5.' }] });
        api.record('q-noahweek', 'Hours left in Noah’s week (balance)', 2, g === 'first');
        await api.say('osei', '65.5 hours left. His week looks balanced. Now, the rules.');
      }));
      a.push(step('rules', async function (api, S) {
        await api.say('osei', ['If a 13-year-old takes a job as an employee, Alberta has rules.', 'A parent’s OK. Up to 2 hours on a school day, up to 8 on a non-school day. Never between 9 pm and 6 am.']);
        await K.sort(api, { title: 'Is this shift allowed?', name: 'rules', story: true, key: 'q-rules', label: 'Youth employment rules: allowed or not (age 13)', ch: 2, intro: 'A 13-year-old employee, with a parent’s OK. Is each shift allowed?', ref: RULES_HTML, refLabel: 'Show the rules',
          bins: [{ id: 'yes', label: 'Allowed', icon: '✅' }, { id: 'no', label: 'Not allowed', icon: '⛔' }], items: SHIFTS.slice(0, 6).map(function (s, i) { var c = shiftOK(s); return { id: 'i' + i, text: s.t, bin: c.ok ? 'yes' : 'no', why: c.why }; }) });
        await api.ask('osei', { text: 'One more. Do these job rules cover a 13-year-old who volunteers at the garden?', opts: [['No. The rules cover employees, not volunteers. But balance still matters.', 1, 'Right. And a good volunteer place still keeps it reasonable.'], ['Yes. Volunteers follow exactly the same rules.', 0, 'The rules are for employees.'], ['No, so volunteers can work any hours at all.', 0, 'Not covered by the rules, but balance still matters!']] }, 'q-volrules', 'Do job rules cover volunteers?', 2);
      }));
      a.push(step('plan', async function (api, S) {
        await api.quest('Go home and plan one new experience', 'table');
        var r = await K.pick(api, { id: 'plan', title: 'Plan one experience', name: 'pickplan', intro: 'Pick one experience to try. Look at the hours: will it fit a balanced week?',
          options: Object.keys(PLANS).map(function (k) { var p = PLANS[k]; return { k: k, title: p.name, icon: p.icon, lines: [['Where', p.where], ['When', p.when], ['Kind', p.kind], ['Who says OK', p.ok]] }; }),
          reasonPrompt: 'What do you hope to learn from it?', tradeoff: 'What might be hard about it? How will you handle that?' });
        var p = PLANS[r.pick];
        await api.say('you', ['I picked: ' + p.name.toLowerCase() + '. About ' + hrs(p.hours) + ' a week.', 'Noah had 65.5 hours left. ' + hrs(p.hours) + ' fits easily into a week like that.']);
        api.give('Experience plan', p.icon, 'table'); api.hud();
      }));
      a.push(step('sheet', async function (api, S) { // clue 2: the sign-up sheet asks too much of a week
        await api.quest('Mr. Pruitt wants you to look at the garden’s sign-up sheet', 'pruitt');
        await api.say('pruitt', ['Here’s my sign-up sheet. I wrote it myself. Why won’t anyone sign it?']);
        await K.inspect(api, { title: 'The garden sign-up sheet', name: 'sheet', story: true, key: 'story-sheet', label: 'The sign-up sheet: what asks too much of a week', ch: 2, find: 'Find the 3 things that don’t fit a balanced week', cols: 3,
          intro: 'Tap every line that asks too much of a young volunteer’s week.',
          spots: [{ id: 'six', icon: '⏰', label: 'New volunteers: 6 hours every school night', bad: true, why: 'Six hours after school, every night, leaves no time for homework, family or sleep.', hint: 'How many hours, and how often?' },
            { id: 'late', icon: '🌙', label: 'Shifts end at 10:30 pm', bad: true, why: 'Too late on a school night. Sleep matters.' }, { id: 'skip', icon: '🚫', label: 'Miss school events if the garden needs you', bad: true, why: 'Balance means school and life come first.' },
            { id: 'sat', icon: '☀️', label: 'Saturday mornings, 9 to 11', fine: 'Two hours on a Saturday fits a balanced week.' }, { id: 'water', icon: '💧', label: 'Water and sunscreen provided', fine: 'That’s thoughtful.' }, { id: 'friend', icon: '🧑‍🤝‍🧑', label: 'Bring a friend!', fine: 'That makes it more welcoming.' }] });
        await api.say('pruitt', ['Six hours every school night... I was thinking of myself at 40, not a 13-year-old.', 'I’ll fix the sheet. Saturdays only.']);
        S.story.sheet = 1; api.toast('Added to your Garden notes: the sign-up sheet'); api.save();
      }));
      a.push(step('sweep3', async function (api, S) {
        await api.say('pruitt', 'While you’re here, could you sweep the garden again? Things keep popping up.');
        await sweep(api, S, 'ch3', 3);
      }));
      a.push(step('end3', async function (api, S) {
        await api.quest('Check in with Mr. Osei', 'osei');
        await api.say('osei', ['Fixing the sheet helps. But something still happens on day one.', 'Now do Step 3 of your project: plan your experience and check your week.', 'Next time: belonging and safety at work. Your three rights.']);
      }));
    }
    if (ch === 3) {
      a.push(step('rights', async function (api, S) {
        await api.quest('Mr. Osei wants to teach you the three rights', 'osei');
        await api.say('osei', ['Every worker in Alberta has three rights. The right to know: about dangers, and to be trained.', 'The right to participate: in keeping work safe. The right to refuse: dangerous work.']);
        await K.sort(api, { title: 'Which right is it?', name: 'rights', story: true, key: 'q-rights', label: 'The three rights: know, participate, refuse', ch: 3, wide: true, intro: 'Sort each one.', ref: RIGHTS_HTML, refLabel: 'Show the three rights', bins: RIGHTS,
          items: RIGHT_ITEMS.slice(0, 6).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
        await api.say('osei', ['Ava is 15. On day two at a café, her supervisor says, “We’re busy. Can you use the meat slicer? It’s easy.” She’s never been trained.']);
        await api.ask('osei', UNSAFE_QS[0], 'q-ava', 'What Ava should say about the meat slicer', 3);
      }));
      a.push(step('shed', async function (api, S) { // the source: the shed, and day one
        await api.quest('Inspect the garden with Mr. Pruitt', 'pruitt');
        await api.say('pruitt', ['Be honest. Look at the shed and at what new volunteers get on day one.']);
        await K.inspect(api, { title: 'Inspect the garden shed', name: 'shed', story: true, key: 'story-shed', label: 'Garden shed inspection: hazards and day one', ch: 3, find: 'Find the 5 problems', cols: 3,
          intro: 'Tap every hazard, and anything that leaves a new volunteer unsafe or unwelcome on day one.',
          spots: [{ id: 'rake', icon: '🧹', label: 'Rake lying teeth-up on the path', bad: true, why: 'Someone could step on it.', hint: 'Look at the floor.' }, { id: 'cord', icon: '⚡', label: 'Extension cord across the doorway', bad: true, why: 'A tripping hazard.' },
            { id: 'ladder', icon: '🪜', label: 'Broken ladder with no warning sign', bad: true, why: 'Someone could use it and fall.' }, { id: 'kit', icon: '❓', label: 'No first-aid kit anywhere', bad: true, why: 'Accidents happen. A kit must be easy to find.' },
            { id: 'dayone', icon: '🪧', label: 'Sign: “First day? Grab a shovel and go.”', bad: true, why: 'No tour, no training, no introductions. That breaks the right to know, and nobody feels welcome.' },
            { id: 'gloves', icon: '🧤', label: 'Gloves in a bin by the door', fine: 'Gloves keep hands safe. Good.' }, { id: 'hooks', icon: '🔧', label: 'Tools hung on wall hooks', fine: 'Put away is safe.' },
            { id: 'ext', icon: '🧯', label: 'Fire extinguisher by the door', fine: 'Right where it should be.' }, { id: 'buddy', icon: '👥', label: 'A buddy board with names on it', fine: 'A buddy helps new people belong.' }] });
        await api.say('pruitt', ['“Grab a shovel and go.” That was my whole plan for day one.', 'Nobody showed me around when I started either. I didn’t think it mattered.', 'Will you help me make a real first-day plan?']);
        S.story.shed = 1; api.toast('Added to your Garden notes: the shed'); api.save();
      }));
      a.push(step('checklist', async function (api, S) {
        await api.quest('Go home and build the Welcome and Safety checklist', 'table');
        await K.sort(api, { title: 'Welcome and Safety checklist', name: 'checklist', story: true, key: 'q-checklist', label: 'Build a Welcome and Safety checklist', ch: 3, wide: true, intro: 'Which items belong on a checklist for any young worker or volunteer’s <b>first day</b>?',
          bins: [{ id: 'on', label: 'On the checklist', icon: '✅' }, { id: 'off', label: 'Leave it off', icon: '✖️' }],
          items: [['Show new people the fire exits and first-aid kit', 'on', 'The right to know.'], ['Train people before they use tools or machines', 'on', 'The right to know.'], ['Introduce new people to the crew', 'on', 'Belonging starts with names.'],
            ['Pair each new person with a buddy', 'on', 'A buddy helps people belong and ask questions.'], ['Tell them they can say no to unsafe work', 'on', 'The right to refuse.'], ['Invite them to the safety meeting', 'on', 'The right to participate.'],
            ['Make new people work alone so they learn faster', 'off', 'Alone, with no one to ask, is how people get hurt or feel left out.'], ['Tell them not to ask questions on day one', 'off', 'Questions keep people safe.']].map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
        await K.typed(api, { id: 'say', title: 'In your own words', prompt: 'What should a young worker say if asked to do something unsafe?' });
        api.give('Welcome and Safety checklist', '✅', 'table'); api.hud();
      }));
      a.push(step('share', async function (api, S) { // the hero beat: the Grade 6 class visits the garden
        S.scene = 'share'; api.refresh();
        await api.quest('The Grade 6 class is visiting the Community Garden!', 'patel');
        api.fx.face('all');
        await api.say('patel', ['Hello! I’m Ms. Patel, and this is my Grade 6 class.', 'We heard you know about volunteering and staying safe. The kids have questions!']);
        if (!S.share) S.share = { got: 0, asked: {} };
        var Qs = [
          ['q-share-count', 'kid1', { text: 'Does volunteering count as experience, even with no pay?', opts: [['Yes. It’s work-related experience. It builds skills and shows what you like.', 1, 'Cool! I want to try it.'], ['No. Only paid jobs count.', 0, 'Volunteering counts!'], ['Only if you do it for a whole year.', 0, 'Even a short experience counts.']] }],
          ['q-share-unsafe', 'kid2', { text: 'What if a boss tells me to use a machine I haven’t learned yet?', opts: [['Say you haven’t been trained, and you won’t use it until someone shows you. That’s your right.', 1, 'Okay. I can say that.'], ['Just try it, so you don’t get in trouble.', 0, 'You can’t be punished for refusing dangerous work.'], ['Use it, but slowly.', 0, 'Slowly isn’t safe if you don’t know how.']] }],
          ['q-share-week', 'kid3', { text: 'How do I know if volunteering fits my week?', opts: [['Add up sleep, school and activities, and see how many hours are left.', 1, 'Like math, but for my week!'], ['Just say yes to everything.', 0, 'Then you might run out of time for sleep and homework.'], ['Ask your friends how busy they are.', 0, 'It’s about your own week.']] }],
          ['q-share-welcome', 'patel', { text: 'What makes a place welcoming for a new volunteer?', opts: [['Introduce them, give them a buddy, and include everyone.', 1, 'That’s what I want for my students.'], ['Let them figure it out alone.', 0, 'That’s how volunteers ended up quitting here.'], ['Only talk to them if they talk first.', 0, 'New people are often shy. Reach out first.']] }]
        ];
        for (var i = 0; i < Qs.length; i++) {
          var q = Qs[i]; if (S.share.asked[q[0]]) continue;
          var r = await api.ask(q[1], q[2], q[0], 'Share with Grade 6: ' + q[2].text, 3);
          S.share.asked[q[0]] = 1; if (r.first) { S.share.got++; api.fx.rise(q[1], '+1'); }
          api.save(); api.hud();
        }
        var won = S.share.got >= POINTS_TO_WIN; S.win = won; api.save();
        await api.say('patel', won ? ['The whole class wants to sign up for Saturday mornings!', 'Thank you. You made it sound safe AND fun.'] : ['Thank you! A few kids are still unsure.', 'You can replay this chapter from the Menu and try again.']);
        await api.say('kai', ['I’m back too. Mr. Pruitt asked me to be a buddy for new volunteers.', 'I’ll be the one who says hi first. Every time.']);
        S.story.share = 1; api.save();
        await K.hero(api, { who: 'pruitt', lines: ['Everyone, listen up! From now on, every new volunteer here gets a tour, a buddy, training, and their three rights on day one.', 'It’s ' + api.profile.name + '’s checklist. So we’re calling it the ' + api.profile.name + ' Welcome.'],
          medal: 'Garden Crew medal', icon: '🌻', kicker: 'Community Garden', title: 'The ' + api.profile.name + ' Welcome', reply: ['Welcome, everyone! Ask questions. Always.'] });
        S.story.hero = 1; S.scene = null; api.refresh();
      }));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and pin your plan to your My Plan wall', 'myplan');
        var p = PLANS[S.typed.plan.pick], firstTime = !S.finished; S.finished = true;
        if (firstTime) api.profileAdd('closet', 'volunteer');
        api.profileAdd('plan', { mission: '7-experiences', title: 'Experience Plan', text: 'My next experience: ' + p.name.toLowerCase() + ' (' + p.when.toLowerCase() + '). A safety right I’ll remember: the right to refuse dangerous work.' });
        api.profileAdd('finished', '7-experiences'); api.refresh();
        await api.say('osei', [S.win ? 'A whole class of new volunteers, and a garden full of people again. Wonderful!' : 'A full garden again! And next time, win over the Grade 6 class too.', 'Your closet has a new Volunteer vest, and your My Plan wall has a new page.', 'Now do Step 4 of your project: your team’s Welcome and Safety checklist.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }

  /* ── Register ── */
  T.mission({
    id: '7-experiences', unitLabel: 'CEFL Grade 7 · Experiences and Employment · Project: Experience Plan', title: 'The Garden Crew',
    iCan: 'I can explain what my experiences tell me about work, check that work fits a balanced week and the rules, and name my three safety rights.',
    foot: 'This is a model. The age rules and the three rights are Alberta’s (alberta.ca). The people and places are made up.',
    bagTip: 'Your Bag holds what you collect: your experience list, preferences, your plan, the checklist and your Garden notes.',
    realRule: 'Real gives no hints, and the Grade 6 class still needs 3 good answers',
    afterLine: 'Mission complete. The garden is open every Saturday. Open Menu → Report to show your teacher.',
    chapters: [
      { name: 'My experiences', step: 'Step 1', moment: 'Moment 1: kinds of experiences' },
      { name: 'Work preferences', step: 'Step 2', moment: 'Moment 2: where and how people work' },
      { name: 'Plan one experience', step: 'Step 3', moment: 'Moment 3: work-life balance' },
      { name: 'Welcome and safety', step: 'Step 4', moment: 'Moment 4: belonging and safety at work' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps, guide: 'osei',
    helpers: function () { return HELPS; }, gossip: gossip, mail: function (S, seed, last) { return mailTask(seed, last); },
    outfit: function (S) { return S.finished ? 'volunteer' : 'none'; },
    placeObjects: function (api) { api.place('table', 'home', 4, 3, { label: 'Kitchen table' }); api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true }); },
    people: function (S) {
      var out = {}, s = S.story;
      out.osei = { name: 'Mr. Osei', role: 'Volunteer coordinator', map: 'community', x: 4, y: 3, dir: 'down', look: { base: 2, skin: 's5', hair: 'black', shirt: 'green', pants: '#2f3a5c' } };
      out.pruitt = { name: 'Mr. Pruitt', role: 'Garden coordinator', map: 'town', x: 69, y: 42, dir: 'down', look: { base: 4 }, hidden: !s.pruittOut };
      out.kai = { name: 'Kai', role: s.hero ? 'Garden buddy' : 'Used to volunteer', map: 'town', x: s.hero ? 71 : 58, y: s.hero ? 44 : 39, dir: 'down', look: { base: 0, skin: 's3', hair: 'black', shirt: 'blue', pants: '#3b3f5c' }, hidden: !s.kaiOut };
      if (s.rosa || S.scene) out.rosa = { map: 'town', x: 65, y: 44, dir: 'down', role: 'Garden volunteer', wander: 0 };
      if (S.scene === 'share') { // the class stands on row 46; rows 42 and 44 stay open
        out.patel = { name: 'Ms. Patel', role: 'Grade 6 teacher', map: 'town', x: 69, y: 46, dir: 'up', look: { base: 3, skin: 's2', hair: 'brown', shirt: 'purple', pants: '#3b3f5c' } };
        out.kid1 = { name: 'Lily', role: 'Grade 6', map: 'town', x: 65, y: 46, dir: 'up', look: { base: 1, skin: 's4', hair: 'black', shirt: 'yellow', pants: '#3d4a6b' } };
        out.kid2 = { name: 'Omar', role: 'Grade 6', map: 'town', x: 67, y: 46, dir: 'up', look: { base: 0, skin: 's3', hair: 'black', shirt: 'red', pants: '#3d4a6b' } };
        out.kid3 = { name: 'Zoe', role: 'Grade 6', map: 'town', x: 71, y: 46, dir: 'up', look: { base: 3, skin: 's1', hair: 'ginger', shirt: 'teal', pants: '#3d4a6b' } };
        out.kai = { name: 'Kai', role: 'Garden buddy', map: 'town', x: 74, y: 44, dir: 'left', look: out.kai.look };
        out.pruitt = { name: 'Mr. Pruitt', role: 'Garden coordinator', map: 'town', x: 69, y: 42, dir: 'down', look: { base: 4 } };
      }
      return out;
    },
    doorOpen: function (id) { return !!{ home: 1, grandpa: 1, community: 1, library: 1, bank: 1, hospital: 1, townhall: 1, jobcentre: 1 }[id]; },
    lockedLine: function (id) { return T.world.building(id).name + ' is closed today. Try the Community Centre or the garden.'; },
    talk: function (id, S, api) {
      var s = S.story, done = S.finished;
      var lines = {
        osei: done ? 'Need a volunteer job? I have a list a mile long.' : 'Your next goal is on the gold line at the top.',
        pruitt: s.hero ? 'Tour, buddy, training, rights. The ' + api.profile.name + ' Welcome. Works every time.' : s.shed ? 'A real first-day plan. I should have had one from the start.' : s.sheet ? 'Saturdays only now. Two hours. Much better.' : 'Hello! Watch out for the rake. I keep meaning to move it.',
        kai: s.hero ? 'Hi! I’m a buddy now. Need gloves? They’re in the bin by the door.' : s.kai ? 'Thanks for listening. Most people just said “toughen up.”' : 'I don’t really want to talk about the garden.',
        rosa: s.hero ? 'Fourteen volunteers this Saturday! FOURTEEN!' : s.rosa ? 'Every new volunteer quits after one day. I keep thinking about it.' : 'A budget isn’t about no fun. It’s about choosing your fun.',
        grandpa: 'The old garden coordinator knew everyone’s name. Little things matter.', librarian: 'Reading buddies wanted! Tuesdays after school.',
        nurse: 'Young workers: ask to be trained. Every time.', sam: 'Volunteering builds skills. Skills build careers. Careers build... savings. I’ll stop.',
        avery: 'I’m trying the reading buddy program. I get to read picture books out loud!', dev: 'My bike chain business made $15 this week. Empire.',
        patel: 'My class can’t stop talking about the garden.', kid1: 'I’m going to be a garden buddy someday!', kid2: 'Right to refuse. I’ll remember.', kid3: 'Is it Saturday yet?',
        table: 'The kitchen table. Good for planning your week.',
        myplan: K.planLine(api)
      };
      return lines[id] || null;
    },
    hud: function (S) {
      var out = [{ label: 'My plan', value: S.typed.plan ? PLANS[S.typed.plan.pick].name : '—' }];
      var n = 0; Object.keys(S.sweeps).forEach(function (k) { if (S.sweeps[k].tier !== 'skip') n += Math.max(0, S.sweeps[k].score); });
      out.push({ label: 'Hazards found', value: String(n), title: 'From your Safety sweeps' });
      if (S.share) out.push({ label: 'Grade 6', value: S.share.got + ' / 4', title: '3 good answers and the class signs up' });
      return out;
    },
    items: function (S) {
      var it = [];
      if (S.typed.audit) it.push({ name: 'Experience list', icon: '📝', note: (S.typed.audit.x || []).length + ' experiences', view: function () { var a = S.typed.audit; return '<p>' + (a.x || []).map(function (k) { var e = MY_EXP.filter(function (x) { return x[0] === k; })[0]; return e ? e[2] + ' ' + esc(e[1]) : ''; }).join(', ') + '</p><p><b>What one taught me:</b> ' + esc(a.taught || '') + '</p>' + (S.typed.pattern ? '<p><b>A pattern:</b> ' + esc(S.typed.pattern) + '</p>' : ''); } });
      if (S.typed.prefs) it.push({ name: 'Preferences card', icon: '🧭', note: 'Where and how I’d like to work', view: function () { return prefHTML(S); } });
      if (S.typed.plan) it.push({ name: 'Experience plan', icon: PLANS[S.typed.plan.pick].icon, note: PLANS[S.typed.plan.pick].name, view: function () { var p = PLANS[S.typed.plan.pick]; return '<p><b>' + esc(p.name) + '</b> (' + esc(p.kind.toLowerCase()) + ')</p><div class="ck-kv"><span>Where</span><b>' + esc(p.where) + '</b><span>When</span><b>' + esc(p.when) + '</b><span>Who says OK</span><b>' + esc(p.ok) + '</b></div><p><b>What I hope to learn:</b> ' + esc(S.typed.plan.reason) + '</p><p><b>What might be hard:</b> ' + esc(S.typed.plan.tradeoff) + '</p>'; } });
      it.push({ name: 'Rules and rights card', icon: '📇', note: 'Ages 13–14, and the three rights', view: function () { return RULES_HTML + RIGHTS_HTML; } });
      if (S.ans['q-checklist']) it.push({ name: 'Welcome and Safety checklist', icon: '✅', note: 'For any first day', view: function () { return K.notes(['Show new people the fire exits and first-aid kit.', 'Train people before they use tools or machines.', 'Introduce new people to the crew.', 'Pair each new person with a buddy.', 'Tell them they can say no to unsafe work.', 'Invite them to the safety meeting.']) + (S.typed.say ? '<p><b>If asked to do something unsafe, I’d say:</b> ' + esc(S.typed.say) + '</p>' : ''); } });
      if (S.story.rosa) it.push({ name: 'Garden notes', icon: '🔍', note: 'The empty garden', view: function () { return K.notes(notes(S)); } });
      if (S.story.hero) it.push({ name: 'Garden Crew medal', icon: '🌻', note: 'The ' + T.api.profile.name + ' Welcome', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🌻</p><p style="text-align:center"><b>Garden Crew</b><br>For a first day where everyone is safe and everyone belongs.</p>'; } });
      return it;
    },
    report: function (S) {
      var h = '<p>Planned experience: <b>' + (S.typed.plan ? esc(PLANS[S.typed.plan.pick].name) : 'not picked yet') + '</b>' + (S.finished ? ' · Grade 6 share: <b>' + S.share.got + ' of 4</b> (' + (S.win ? 'the class signed up' : 'goal not reached') + ')' : '') + '</p>';
      h += '<p>Warm-up, experiences I’d love: ' + esc(S.typed.loved || '—') + '.</p><h3>Work preferences</h3>' + prefHTML(S);
      var sw = Object.keys(S.sweeps);
      if (sw.length) h += '<h3>Safety sweeps</h3>' + K.table(sw.map(function (k) { var x = S.sweeps[k]; return [k === 'ch2' ? 'Chapter 2' : 'Chapter 3', String(x.score), K.TIER_WORD[x.tier]]; }), ['When', 'Score', 'Result']);
      h += K.wrote(S, [['pattern', 'A pattern in my experiences'], ['plan', 'My planned experience', function (k) { return PLANS[k].name; }], ['say', 'What I’d say about unsafe work']]);
      h += '<h3>The empty garden</h3><p>' + (S.story.hero ? 'Solved: the checklist became the garden’s first-day plan, named after them.' : S.story.shed ? 'Inspected the shed and found the day-one problem.' : S.story.rosa ? 'Collecting clues.' : 'Not started.') + '</p>';
      return h;
    },
    test: { scenes: [null, { story: { rosa: 1, pruittOut: 1, kaiOut: 1 } }, { scene: 'share', story: { rosa: 1, pruittOut: 1, kaiOut: 1 } }, { story: { rosa: 1, pruittOut: 1, kaiOut: 1, hero: 1 } }],
      shiftOK: shiftOK, SHIFTS: SHIFTS, hoursLeft: hoursLeft, NOAH_WEEK: NOAH_WEEK, GAME_CFGS: GAME_CFGS, kindsTask: kindsTask, shiftsTask: shiftsTask, rightsTask: rightsTask, balanceTask: balanceTask, jobTask: jobTask, mailTask: mailTask, HELPS: HELPS, GOSSIP: GOSSIP }
  });
  function notes(S) {
    var s = S.story, li = [];
    if (s.rosa) li.push('<b>Rosa:</b> every new volunteer at the Community Garden quits after one day. “The work is fun!”');
    if (s.kai) li.push('<b>Kai:</b> likes working on a team, but was put alone for five hours, and two volunteers joked about his accent. The work didn’t fit him, and he didn’t belong.');
    if (s.sheet) li.push('<b>The sign-up sheet:</b> 6 hours every school night, shifts to 10:30 pm, and “miss school events.” Too much for a balanced week.');
    if (s.shed) li.push('<b>The shed:</b> a rake teeth-up, a cord across the door, a broken ladder, no first-aid kit, and “First day? Grab a shovel and go.” No training, no welcome.');
    if (s.share) li.push('<b>The Grade 6 visit:</b> Kai is back, as a buddy for new volunteers.');
    if (s.hero) li.push('<b>The ' + esc(T.api.profile.name) + ' Welcome:</b> a tour, a buddy, training, and the three rights for every new volunteer.');
    return li;
  }
})();
