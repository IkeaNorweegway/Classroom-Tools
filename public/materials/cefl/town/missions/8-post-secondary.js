/* CEFL Town mission: Grade 8 Post-Secondary Pathways — "The Course Map" (companion to the project My High School Map). LO 8-PS.
   Four chapters, one after each project step: Admission requirements (two programs) · Planning high school (a Grade 10–12 course
   plan) · Paying for it (scholarships, bursaries, grants, loans) · Networking (ask someone). You build a course plan that keeps two
   programs open, and bring it to a plan conference.
   Model (MODEL START … END, no DOM): courses by stream (ELA and Social -1/-2; math 10C → 20-1 → 30-1 (+ Math 31), 10C → 20-2 → 30-2,
   or 10-3 → 20-3 → 30-3; each science to 20 or 30, where 30 needs 20); the Alberta High School Diploma rules (from the workbook:
   ELA 30, Social 30, a 20-level math, a 20-level science, PE 10, CALM, 10 credits of options, 10 more 30-level credits; 100 credits);
   six programs with TYPICAL requirements (check each school). Goal: the plan conference is convinced (at least 3 of 4 first-try
   answers). The Prereq Quiz game (kit quickPick) counts right answers; it never changes the goal.
   Side story, "The old course guide": Avery's brother Marcus (Grade 12) is missing courses for nursing (Ch 1) → checking his plan
   against the requirements (Ch 2) → he thinks he can't afford it either; the guide in the school library is from 2009 (Ch 3) → at
   the plan conference he plans upgrading, and your course map replaces the old guide, named after you (Ch 4).
   Figures: Rutherford Scholarship up to $2,500 (Alberta Student Aid); U of A 2026–27 $729.36 per course. Other tuition is a sample.
   Between lessons (HELP START … HELP END): townspeople's own questions, an extra Prereq Quiz, and Town Mail. */
(function () {
  'use strict';

/* MODEL START ── no DOM. ── */
var MATH = { m1: ['Math 10C', 'Math 20-1', 'Math 30-1'], m1x: ['Math 10C', 'Math 20-1', 'Math 30-1', 'Math 31'], m2: ['Math 10C', 'Math 20-2', 'Math 30-2'], m3: ['Math 10-3', 'Math 20-3', 'Math 30-3'] };
var MATH_NAMES = { m1: 'Math 10C → 20-1 → 30-1', m1x: 'Math 10C → 20-1 → 30-1, plus Math 31', m2: 'Math 10C → 20-2 → 30-2', m3: 'Math 10-3 → 20-3 → 30-3' };
var SCIENCES = [['bio', 'Biology'], ['chem', 'Chemistry'], ['phys', 'Physics'], ['sci', 'Science']];
var OPTIONS = [['ctselec', 'CTS: electrical'], ['ctshealth', 'CTS: health care'], ['ctscode', 'CTS: computing'], ['ctsbuild', 'CTS: construction'], ['art', 'Art'], ['music', 'Music'], ['french', 'French']];
function coursesOf(p) { // every course a plan includes (a 30 includes its 20; Science 10, PE 10 and CALM always)
  var c = ['Science 10', 'PE 10', 'CALM'], s;
  ['10', '20', '30'].forEach(function (g) { c.push('ELA ' + g + '-' + p.ela, 'Social ' + g + '-' + p.soc); });
  c = c.concat(MATH[p.math] || []);
  SCIENCES.forEach(function (x) { var lv = (p.sci || {})[x[0]] || 0; if (lv >= 20) c.push(x[1] + ' 20'); if (lv >= 30) c.push(x[1] + ' 30'); });
  return c;
}
function has(c, any) { return any.some(function (x) { return c.indexOf(x) >= 0; }); }
function thirtyExtra(c) { return c.filter(function (x) { return / 3\d|Math 31/.test(x) && !/^ELA|^Social/.test(x); }).length; } // 30-level courses beyond ELA and Social (5 credits each)
var DIPLOMA = [ // the workbook's list
  { t: 'ELA 30-1 or 30-2', ok: function (c) { return has(c, ['ELA 30-1', 'ELA 30-2']); } }, { t: 'Social 30-1 or 30-2', ok: function (c) { return has(c, ['Social 30-1', 'Social 30-2']); } },
  { t: 'A 20-level math', ok: function (c) { return has(c, ['Math 20-1', 'Math 20-2', 'Math 20-3']); } }, { t: 'A 20-level science', ok: function (c) { return has(c, ['Biology 20', 'Chemistry 20', 'Physics 20', 'Science 20']); } },
  { t: 'PE 10 and CALM', ok: function () { return true; } }, { t: '10 credits of options (CTS, arts, languages)', ok: function (c, p) { return (p.opts || []).length >= 2; } },
  { t: '10 more 30-level credits (two 30-level courses besides ELA and Social)', ok: function (c) { return thirtyExtra(c) >= 2; } }
];
var PROGRAMS = { // TYPICAL requirements: check each school's website
  eng:   { name: 'Engineering degree', kind: 'University', icon: '🏗️', competitive: true, req: [['ELA 30-1'], ['Math 30-1'], ['Math 31'], ['Chemistry 30'], ['Physics 30']], contact: 'ames', years: 4, tuition: 729360, sample: false },
  nurse: { name: 'Nursing degree', kind: 'University', icon: '🩺', competitive: true, req: [['ELA 30-1'], ['Math 30-1', 'Math 30-2'], ['Biology 30'], ['Chemistry 30']], contact: 'nurse', years: 4, tuition: 729360, sample: false },
  elec:  { name: 'Electrician apprenticeship', kind: 'Apprenticeship', icon: '⚡', competitive: false, req: [['ELA 20-1', 'ELA 20-2'], ['Math 20-1', 'Math 20-2'], ['Physics 20', 'Science 20']], contact: 'joe', years: 4, tuition: 116400, sample: false },
  tech:  { name: 'Engineering technology diploma', kind: 'Polytechnic', icon: '🔩', competitive: true, req: [['ELA 30-1', 'ELA 30-2'], ['Math 30-1'], ['Physics 30', 'Chemistry 30']], contact: 'cho', years: 2, tuition: 650000, sample: true },
  vet:   { name: 'Vet tech diploma', kind: 'College', icon: '🐾', competitive: true, req: [['ELA 30-1', 'ELA 30-2'], ['Biology 30'], ['Chemistry 20']], contact: 'rosa', years: 2, tuition: 480000, sample: true },
  biz:   { name: 'Business diploma', kind: 'College', icon: '💼', competitive: false, req: [['ELA 30-1', 'ELA 30-2'], ['Math 30-1', 'Math 30-2']], contact: 'sam', years: 2, tuition: 450000, sample: true }
};
var PROGRAM_KEYS = Object.keys(PROGRAMS);
function reqText(r) { return r.join(' or '); }
function checkPlan(p, keys) { // what the plan meets: the diploma and each program
  var c = coursesOf(p), out = { diploma: DIPLOMA.map(function (d) { return { t: d.t, ok: d.ok(c, p) }; }) };
  out.dipOK = out.diploma.every(function (x) { return x.ok; });
  keys.forEach(function (k) { out[k] = PROGRAMS[k].req.map(function (r) { return { t: reqText(r), ok: has(c, r) }; }); out[k + 'OK'] = out[k].every(function (x) { return x.ok; }); });
  out.all = out.dipOK && keys.every(function (k) { return out[k + 'OK']; });
  return out;
}
/* A plan that keeps two programs open: the stronger streams where needed, the sciences the programs name, two options */
function planFor(keys) {
  var p = { ela: '2', soc: '2', math: 'm2', sci: { bio: 0, chem: 0, phys: 0, sci: 0 }, opts: ['ctscode', 'art'] };
  keys.forEach(function (k) { PROGRAMS[k].req.forEach(function (r) { var x = r[0];
    if (/^ELA 30-1/.test(x)) p.ela = '1'; if (x === 'Math 31') p.math = 'm1x'; else if (/^Math 30-1/.test(x) && p.math !== 'm1x' && r.length === 1) p.math = 'm1';
    SCIENCES.forEach(function (s) { if (x === s[1] + ' 30') p.sci[s[0]] = 30; else if (x === s[1] + ' 20' && p.sci[s[0]] < 20) p.sci[s[0]] = 20; }); }); });
  var c = coursesOf(p); if (thirtyExtra(c) < 2) { if (p.sci.bio < 30 && p.sci.chem < 30) p.sci.bio = 30; c = coursesOf(p); if (thirtyExtra(c) < 2) p.sci.chem = 30; }
  if (!has(coursesOf(p), ['Biology 20', 'Chemistry 20', 'Physics 20', 'Science 20'])) p.sci.sci = 20;
  return p;
}
var MARCUS = { ela: '1', soc: '2', math: 'm3', sci: { bio: 0, chem: 30, phys: 0, sci: 20 }, opts: ['art', 'music'] }; // the story: he followed the old guide
var RUTHERFORD = 250000, UA_YEAR = 729360;
var AID = [{ id: 'scholar', label: 'Scholarship', icon: '🏆' }, { id: 'bursary', label: 'Bursary', icon: '🤝' }, { id: 'grant', label: 'Grant', icon: '🎁' }, { id: 'loan', label: 'Loan', icon: '🔁' }];
var AID_ITEMS = [
  ['Money for a student who can’t afford school, from a local group', 'bursary', 'A bursary is based on need.'], ['$1,000 for the top mark in Biology 30', 'scholar', 'A scholarship rewards marks or talents.'], ['Money you must pay back after you finish school', 'loan', 'A loan is paid back.'],
  ['Money from the government, for students who qualify, that you don’t pay back', 'grant', 'A grant is not paid back.'], ['Up to $2,500 for good Grade 10–12 marks (Rutherford)', 'scholar', 'It rewards marks: a scholarship.'], ['The bank lends you money for tuition', 'loan', 'Lent money is paid back.'],
  ['A club helps a student whose family has a hard year', 'bursary', 'Based on need: a bursary.'], ['$500 for the student who volunteers the most', 'scholar', 'It rewards something you did: a scholarship.']
];
var POINTS_TO_WIN = 3;
/* Prereq Quiz (kit quickPick): questions about requirements, prerequisites, credits and awards */
var GAME_CFGS = {
  quiz: { kind: 'quickPick', cfg: { id: 'quiz', name: 'Prereq Quiz', scoreWord: 'Right', think: 2800, th: [[12, 5], [12, 5]],
    how: '<p><b>Prereq Quiz.</b> Ms. Haddad fires questions about high school courses, programs and paying for school. Tap the right answer.</p><p class="ct-small">A wrong answer costs a point.</p>',
    make: function (r, real) {
      function pk(a) { return a[Math.floor(r() * a.length)]; }
      function sh(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
      var Q = [
        function () { var s = pk(['Biology', 'Chemistry', 'Physics']); return { q: 'What do you need before ' + s + ' 30?', r: s + ' 20', w: [pk(['Science 20', 'Science 10 only']), s === 'Biology' ? 'Chemistry 20' : 'Biology 20'] }; },
        function () { return { q: 'Which Grade 11 math keeps Math 30-1 open?', r: 'Math 20-1', w: ['Math 20-2', 'Math 20-3'] }; },
        function () { return { q: 'Math 31 needs which math?', r: 'Math 30-1', w: ['Math 30-2', 'Math 30-3'] }; },
        function () { return { q: 'How many credits for an Alberta High School Diploma?', r: '100', w: ['80', '120'] }; },
        function () { return { q: 'How many 5-credit courses make 100 credits?', r: '20', w: ['10', '25'] }; },
        function () { return { q: 'Which never has to be paid back?', r: pk(['A scholarship', 'A grant', 'A bursary']), w: ['A loan', 'A credit card'] }; },
        function () { return { q: 'The minimum is 75%. You have 76%. The program is competitive. Are you in?', r: 'Not for sure', w: ['Yes, guaranteed', 'No, never'] }; },
        function () { return { q: 'Engineering usually needs Chemistry 30 and…', r: 'Physics 30', w: ['Art 30', 'Biology 20'] }; },
        function () { return { q: 'Nursing usually needs Chemistry 30 and…', r: 'Biology 30', w: ['Physics 20', 'Math 31'] }; },
        function () { return { q: 'Which stream keeps the most programs open?', r: 'The -1 stream', w: ['The -2 stream', 'The -3 stream'] }; },
        function () { return { q: 'Who can help you plan high school courses?', r: 'A school counsellor', w: ['Nobody: you guess', 'Only your friends'] }; },
        function () { return { q: 'A scholarship of $2,500 off $7,293.60 tuition leaves…', r: '$4,793.60', w: ['$9,793.60', '$5,293.60'] }; }
      ];
      var x = pk(Q)(), opts = sh([x.r].concat(x.w));
      return { q: x.q, icon: '🎓', opts: opts, ans: opts.indexOf(x.r) };
    } } }
};
/* MODEL END */

/* HELP START ── between lessons, on fresh seeds. No DOM. ── */
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function pickN(r, a, n) { var b = a.slice(), out = []; while (out.length < n && b.length) out.push(b.splice(Math.floor(r() * b.length), 1)[0]); return out; }
function aidTask(seed) { var r = RNG(seed * 13 + 1); r(); var out = []; ['scholar', 'bursary', 'grant', 'loan'].forEach(function (k) { out = out.concat(pickN(r, AID_ITEMS.filter(function (x) { return x[1] === k; }), 1)); }); return pickN(r, out, 4); }
function leftTask(seed) { // tuition minus awards (workbook Moment 3, Question 2)
  var r = RNG(seed * 17 + 3); r();
  var tuition = (3500 + Math.floor(r() * 9) * 250) * 100, a = (500 + Math.floor(r() * 6) * 100) * 100, b = (200 + Math.floor(r() * 7) * 50) * 100;
  return { tuition: tuition, bursary: a, scholar: b, left: tuition - a - b };
}
function reqTask(seed) { // does a student’s list meet a program? (one requirement missing, or none)
  var r = RNG(seed * 19 + 5); r();
  var k = PROGRAM_KEYS[Math.floor(r() * PROGRAM_KEYS.length)], p = planFor([k]), miss = r() < 0.7 ? Math.floor(r() * PROGRAMS[k].req.length) : -1;
  return { k: k, plan: p, miss: miss };
}
/* A course list without one requirement: the course is gone, and so is anything that needs it (its 30, or Math 31) */
function dropReq(c, r) { var kill = {}; r.forEach(function (x) { kill[x] = 1; kill[x.replace(/ 20(-\d)?$/, function (m, st) { return ' 30' + (st || ''); })] = 1; if (x === 'Math 30-1') kill['Math 31'] = 1; }); return c.filter(function (y) { return !kill[y]; }); }
var ADMIT_QS = [
  { id: 'min', label: 'The minimum is not a guarantee', text: 'I got the minimum average for my program. So I’m in for sure, right?', opts: [
    ['Not if it’s competitive. They take the highest averages first, so plan for higher and have a backup.', 1, 'Okay. Backup plan, here I come.'], ['Yes. The minimum guarantees a seat.', 0, 'The minimum is the lowest they’ll look at.'], ['No. Nobody gets in with the minimum, ever.', 0, 'Some do, when there are enough seats.']] },
  { id: 'stream', label: 'Why the -1 stream keeps options open', text: 'Why would someone take Math 20-1 instead of 20-2 if they’re not sure yet?', opts: [
    ['Math 20-1 leads to Math 30-1, which more programs accept.', 1, 'Right. It keeps more doors open.'], ['Math 20-1 is always easier.', 0, 'It’s usually harder, but it opens more programs.'], ['There’s no difference.', 0, 'Programs often name the stream they need.']] },
  { id: 'cts', label: 'Why take a CTS course', text: 'My son wants to be an electrician. Why take a CTS electrical course in high school?', opts: [
    ['To try the trade and find out if he likes it, before he commits.', 1, 'Smart. Try before you buy.'], ['Because it replaces his math and science.', 0, 'He still needs math and science.'], ['Because CTS is required for every program.', 0, 'It isn’t required. It helps you explore.']] }
];
var NETWORK_QS = [
  { id: 'what', label: 'What networking is', text: 'What does networking mean?', opts: [
    ['Building relationships to share information, ideas and support.', 1, 'Yes. It’s not just about getting a job.'], ['Asking strangers for a job.', 0, 'It starts with people you already know.'], ['Using a computer network.', 0, 'Wrong network!']] },
  { id: 'ask', label: 'A good networking question', text: 'Which is a good question to ask someone in a career you’re curious about?', opts: [
    ['“How did you get started, and what courses helped you?”', 1, 'Great question.'], ['“How much money do you have?”', 0, 'That’s a bit personal.'], ['“Can you get me a job?”', 0, 'Too soon! Learn first.']] },
  { id: 'thanks', label: 'Why say thank you', text: 'Why should you say thank you after someone helps you?', opts: [
    ['It’s kind, and it keeps the relationship going for later.', 1, 'Exactly.'], ['You don’t need to.', 0, 'A thank-you keeps a door open.'], ['So they’ll give you money.', 0, 'It’s about the relationship.']] }
];
function mailKind(seed, last) { var k = ['admit']; if (last >= 1) k.push('req'); if (last >= 2) k.push('aid', 'left'); if (last >= 3) k.push('net'); return k[RNG(seed * 7 + 3)() * k.length | 0]; }
/* HELP END */

  var T = window.CEFLTown, K = T.kit, esc = T.esc;
  var fmt = K.fmt, fmtW = K.fmtW, step = K.step;
  var QUIZ = T.gameKit.quickPick(GAME_CFGS.quiz.cfg), QUIZ_PAY = 800;

  function init() { return { v: 1, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), ans: {}, typed: {}, story: {}, progs: null, plan: null, quizzes: {}, conf: null, scene: null, finished: false }; }
  function validate(S) { return !!S && S.v === 1 && !!S.typed && !!S.story && !!S.quizzes && (!S.progs || S.progs.every(function (k) { return !!PROGRAMS[k]; })); }
  function P(k) { return PROGRAMS[k]; }
  function progHTML(k) { var p = P(k); return '<div class="ck-card"><span class="ck-big" aria-hidden="true">' + p.icon + '</span><b>' + esc(p.name) + '</b><span class="ct-small">' + esc(p.kind) + (p.competitive ? ' · competitive' : '') + '</span><div class="ck-kv">' + p.req.map(function (r, i) { return '<span>Needs</span><b>' + esc(reqText(r)) + '</b>'; }).join('') + '</div></div>'; }
  function checkHTML(ch, keys) {
    function list(title, items, ok) { return '<div class="ck-card"><b>' + (ok ? '✓ ' : '✗ ') + esc(title) + '</b>' + items.map(function (x) { return '<span class="ct-small" style="color:' + (x.ok ? '#2c7a4b' : '#b42318') + '">' + (x.ok ? '✓ ' : '✗ ') + esc(x.t) + '</span>'; }).join('') + '</div>'; }
    return '<div class="ct-items ck-cards">' + list('Diploma', ch.diploma, ch.dipOK) + keys.map(function (k) { return list(P(k).name, ch[k], ch[k + 'OK']); }).join('') + '</div>';
  }
  function planHTML(p) { var c = coursesOf(p); return K.table([['Grade 10', esc(c.filter(function (x) { return / 10/.test(x) || x === 'CALM'; }).join(', '))], ['Grade 11', esc(c.filter(function (x) { return / 20/.test(x); }).join(', '))], ['Grade 12', esc(c.filter(function (x) { return / 3\d|Math 31/.test(x); }).join(', '))], ['Options', esc((p.opts || []).map(function (o) { return (OPTIONS.filter(function (x) { return x[0] === o; })[0] || [o, o])[1]; }).join(', '))]]); }
  /* The course planner: choose streams, sciences and options; the checker shows what the plan meets. Gentle shows it live; Real only after a check. */
  function plannerPanel(api, S, keys, o) {
    o = o || {};
    var p = JSON.parse(JSON.stringify(S.plan || { ela: '2', soc: '2', math: 'm2', sci: { bio: 0, chem: 0, phys: 0, sci: 20 }, opts: [] })), tries = 0, shownCheck = api.mode === 'gentle', rec = false;
    return api.panel({ title: o.title || 'My Grade 10–12 course plan', name: 'planner', wide: true, data: { keys: keys }, render: function (body, done, ui) {
      function seg(label, k, opts, cur, fn) { return '<fieldset class="ct-sw"><legend>' + esc(label) + '</legend><div class="ct-row ct-wrap">' + opts.map(function (x) { return '<button class="ct-btn" type="button" data-' + k + '="' + x[0] + '" aria-pressed="' + (cur === x[0]) + '">' + esc(x[1]) + '</button>'; }).join('') + '</div></fieldset>'; }
      function draw() {
        var ch = checkPlan(p, keys);
        body.innerHTML = (o.intro ? '<p>' + o.intro + '</p>' : '') + '<details class="ct-ref"><summary>Show the two programs</summary><div class="ck-grid2">' + keys.map(progHTML).join('') + '</div><p class="ct-small">Typical requirements. Check each school’s website for your project.</p></details>' +
          seg('English Language Arts', 'ela', [['1', 'ELA 10-1 → 20-1 → 30-1'], ['2', 'ELA 10-2 → 20-2 → 30-2']], p.ela) + seg('Social Studies', 'soc', [['1', 'Social 10-1 → 20-1 → 30-1'], ['2', 'Social 10-2 → 20-2 → 30-2']], p.soc) +
          seg('Math', 'math', Object.keys(MATH_NAMES).map(function (k) { return [k, MATH_NAMES[k]]; }), p.math) +
          '<fieldset class="ct-sw"><legend>Sciences after Science 10 (a 30 needs its 20)</legend>' + SCIENCES.map(function (s) { return '<div class="ct-row ct-wrap"><span style="min-width:6.5em;font-weight:700">' + s[1] + '</span>' + [[0, 'None'], [20, s[1] + ' 20'], [30, s[1] + ' 20 → 30']].map(function (lv) { return '<button class="ct-btn" type="button" data-sci="' + s[0] + ':' + lv[0] + '" aria-pressed="' + ((p.sci[s[0]] || 0) === lv[0]) + '">' + esc(lv[1]) + '</button>'; }).join('') + '</div>'; }).join('') + '</fieldset>' +
          '<fieldset class="ct-sw"><legend>Options (pick 2 or more)</legend><div class="ct-row ct-wrap">' + OPTIONS.map(function (x) { var on = p.opts.indexOf(x[0]) >= 0; return '<button class="ct-btn" type="button" data-opt="' + x[0] + '" aria-pressed="' + on + '">' + esc(x[1]) + '</button>'; }).join('') + '</div></fieldset>' +
          '<p class="ct-small">PE 10 and CALM are in every plan. Other options fill your timetable to 100 credits.</p>' +
          (shownCheck ? '<h3>The checker</h3>' + checkHTML(ch, keys) : '<p class="ct-small">Real mode: press Check to see what your plan meets.</p>') +
          '<div class="ct-row ct-actions">' + (ch.all && (shownCheck || tries) ? '<button class="ct-btn primary" type="button" id="cpDone">Save my plan</button>' : '') + '<button class="ct-btn' + (ch.all && (shownCheck || tries) ? '' : ' primary') + '" type="button" id="cpCheck">Check my plan</button></div><p class="ct-fb" id="cpMsg" role="status"></p>';
        function bind(attr, fn) { Array.prototype.forEach.call(body.querySelectorAll('[data-' + attr + ']'), function (b) { b.addEventListener('click', function () { fn(b.getAttribute('data-' + attr)); draw(); var n = body.querySelector('[data-' + attr + '="' + b.getAttribute('data-' + attr) + '"]'); if (n) n.focus(); }); }); }
        bind('ela', function (v) { p.ela = v; }); bind('soc', function (v) { p.soc = v; }); bind('math', function (v) { p.math = v; });
        bind('sci', function (v) { var a = v.split(':'); p.sci[a[0]] = +a[1]; }); bind('opt', function (v) { var i = p.opts.indexOf(v); if (i >= 0) p.opts.splice(i, 1); else p.opts.push(v); });
        body.querySelector('#cpCheck').addEventListener('click', check);
        var d = body.querySelector('#cpDone'); if (d) d.addEventListener('click', function () { S.plan = p; api.save(); done(p); });
      }
      function check() {
        var ch = checkPlan(p, keys); tries++; shownCheck = true;
        if (o.key && !rec) { api.record(o.key, o.label, o.ch, ch.all); rec = true; } else if (o.key && api.S.ans[o.key]) api.S.ans[o.key].tries++;
        draw(); var m = body.querySelector('#cpMsg');
        m.className = 'ct-fb ' + (ch.all ? 'yes' : 'no'); m.textContent = ch.all ? 'Your plan meets the diploma and both programs. Save it!' : 'Not yet: look for the ✗ lines.';
        if (ch.all) api.fx.stamp(body.querySelector('.ck-cards'), 'Checked', 'good');
      }
      ui.data.solve = function (how) { if (how !== 'right') { p = { ela: '2', soc: '2', math: 'm3', sci: { bio: 0, chem: 0, phys: 0, sci: 20 }, opts: ['art'] }; check(); } p = planFor(keys); check(); var d = body.querySelector('#cpDone'); if (d) d.click(); };
      draw();
    } });
  }
  function quizOpts(api, seed, help) {
    return { title: 'Prereq Quiz' + (help ? ': an extra round' : ' with Ms. Haddad'), name: 'minigame', game: QUIZ, seed: seed, seconds: 60, leave: !!help, skipNote: 'Skipping is okay.',
      tierText: help ? K.payTiers(QUIZ_PAY) : { great: 'Ms. Haddad is impressed. You know your prereqs!', ok: 'Good round.', poor: 'Lots to remember. That’s why people plan early.' } };
  }
  async function quizRound(api, S, key, n) {
    if (!S.quizzes[key]) { var r = await api.minigame(quizOpts(api, S.seed * 59 + n, false)); S.quizzes[key] = { tier: r.tier, score: r.score }; api.save(); api.hud(); }
    var t = S.quizzes[key].tier;
    await api.say('haddad', t === 'great' ? 'Wow. Want my job?' : t === 'ok' ? 'Nice work.' : t === 'skip' ? 'Maybe next time!' : 'Prereqs are tricky. That’s what counsellors are for.');
  }

  var HELPS = [
    { id: 'ps8-admit', who: 'avery', after: 0, pay: 500, label: 'Admission questions', ask: 'Can I ask you about getting into programs?', run: async function (api, seed) { return K.askGrade(await api.ask('avery', ADMIT_QS[seed % ADMIT_QS.length], null)); } },
    { id: 'ps8-req', who: 'dev', after: 1, pay: 800, label: 'Does a plan meet a program?', ask: 'My cousin’s course list: does it meet the program she wants?', run: async function (api, seed) {
      var t = reqTask(seed), pr = P(t.k), shown = t.miss >= 0 ? dropReq(coursesOf(t.plan), pr.req[t.miss]) : coursesOf(t.plan), items = pr.req.map(function (r, i) { var hasIt = has(shown, r); return { id: 'r' + i, text: reqText(r), bin: hasIt ? 'yes' : 'no', why: hasIt ? 'It’s on her list.' : 'It’s not on her list.' }; });
      var g = await K.sort(api, { title: 'Help Dev: check the requirements', name: 'help-sort', leave: true, intro: 'Program: <b>' + esc(pr.name) + '</b>. Dev’s cousin’s courses: ' + esc(shown.join(', ')) + '.', bins: [{ id: 'yes', label: 'She has it', icon: '✅' }, { id: 'no', label: 'Missing', icon: '❌' }], items: items });
      if (g) await api.say('dev', t.miss >= 0 ? 'One missing. Good thing she checked in Grade 10, not Grade 12.' : 'All there! She’s set.'); return g; } },
    { id: 'ps8-aid', who: 'rosa', after: 2, pay: 800, label: 'Ways to pay', ask: 'My niece got a pile of letters about money for school. Which is which?', run: async function (api, seed) {
      var t = aidTask(seed); var g = await K.sort(api, { title: 'Help Rosa: scholarship, bursary, grant or loan?', name: 'help-sort', leave: true, wide: true, intro: 'Which kind of money is each one?', bins: AID, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      if (g) await api.say('rosa', 'Only one of those has to be paid back. Good to know!'); return g; } },
    { id: 'ps8-left', who: 'sam', after: 2, pay: 800, label: 'Tuition after awards', ask: 'A customer got two awards. How much tuition is left?', run: async function (api, seed) {
      var t = leftTask(seed);
      var g = await api.calc({ title: 'Help Sam: tuition after awards', name: 'help-left', intro: '<p>Tuition for one year: <b>' + fmtW(t.tuition) + '</b> (sample). A bursary of <b>' + fmtW(t.bursary) + '</b> and a scholarship of <b>' + fmtW(t.scholar) + '</b>.</p>', fields: [{ k: 'l', name: 'Tuition left to pay', ans: t.left, hint: fmtW(t.tuition) + ' − ' + fmtW(t.bursary) + ' − ' + fmtW(t.scholar) + '.' }] });
      if (g) await api.say('sam', 'And neither award gets paid back. The best kind of money!'); return g; } },
    { id: 'ps8-net', who: 'jas', after: 3, pay: 500, label: 'Networking', ask: 'How do I start talking to people about careers?', run: async function (api, seed) { return K.askGrade(await api.ask('jas', NETWORK_QS[seed % NETWORK_QS.length], null)); } },
    { id: 'ps8-cts', who: 'worker', after: 1, pay: 500, label: 'Course choices that help', ask: 'Can I ask you about high school courses?', run: async function (api, seed) { return K.askGrade(await api.ask('worker', ADMIT_QS[(seed + 1) % ADMIT_QS.length], null)); } },
    { id: 'ps8-quiz', who: 'librarian', after: 1, pay: QUIZ_PAY, label: 'An extra Prereq Quiz', game: true, ask: 'Ms. Haddad left her quiz cards here. Want a round?', run: async function (api, seed) {
      var r = await api.minigame(quizOpts(api, seed, true)); return K.gameGrade(r); } }
  ];
  var GOSSIP = [
    { id: 'g-avery-0', who: 'avery', after: -1, lines: ['My brother Marcus wants to be a nurse.', 'He says he planned his courses “by the book.” Some old book from the library.'] },
    { id: 'g-lin-0', who: 'librarian', after: -1, lines: ['We still have the old course guide on the counter. Students love it. It’s very shiny.', 'It’s also from 2009. I keep meaning to check it.'] },
    { id: 'g-gp-0', who: 'grandpa', after: -1, lines: ['I took shop class because my friends did.', 'Best accident of my life. But plan on purpose, kid. It’s easier.'] },
    { id: 'g-marcus-1', who: 'marcus', after: 0, lines: ['The guide said Math 20-3 works for everything.', 'The nursing website says Math 30-1 or 30-2. Who do I believe?'] },
    { id: 'g-dev-1', who: 'dev', after: 0, lines: ['My cousin took Math 20-1 “just in case.”', 'Now she wants engineering. Just in case paid off!'] },
    { id: 'g-sam-2', who: 'sam', after: 1, lines: ['People think scholarships are only for straight-A students.', 'There are awards for volunteering, sports, trades, even essays.'] },
    { id: 'g-haddad-2', who: 'haddad', after: 1, lines: ['The “-1” or “-2” choice in Grade 10 matters more than students think.', 'But it’s not a locked door. You can upgrade later. It just takes longer.'] },
    { id: 'g-marcus-3', who: 'marcus', after: 2, lines: ['I thought I couldn’t afford nursing anyway.', 'Then I found out the Rutherford Scholarship counts my Grade 10–12 marks. I have some good ones!'] },
    { id: 'g-nurse-3', who: 'nurse', after: 2, lines: ['I upgraded my chemistry as an adult, at night.', 'Hardest year of my life. Worth it.'] },
    { id: 'g-marcus-4', who: 'marcus', after: 3, lines: ['Upgrading: Biology 30 this summer, Math 30-2 in the fall. Then I apply.', 'One year later than I planned. Still a nurse.'] },
    { id: 'g-haddad-4', who: 'haddad', after: 3, lines: ['The {name} Course Map is up in every Grade 9 classroom.', 'The old guide? Recycled. Shiny paper, though.'] },
    { id: 'g-lin-4', who: 'librarian', after: 3, lines: ['A student asked me for “the course map.” Not the guide. The map!', 'Your name is on it, you know.'] }
  ];
  function gossip(S, api) { return K.gossip(GOSSIP, api); }
  function mailTask(seed, last) {
    var k = mailKind(seed, last), from = 'Ms. Haddad';
    if (k === 'admit') { var q = ADMIT_QS[seed % ADMIT_QS.length]; return { label: 'Town Mail: ' + q.label, from: from, pay: 500, run: async function (api) { await api.say(null, 'A letter from Ms. Haddad. She has a question.'); return K.askGrade(await api.ask('haddad', q, null)); } }; }
    if (k === 'aid') { var t = aidTask(seed); return { label: 'Town Mail: ways to pay', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, wide: true, intro: 'A letter from Ms. Haddad: “Which kind of money is each one?”', bins: AID, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) }); } }; }
    if (k === 'left') { var l = leftTask(seed); return { label: 'Town Mail: tuition after awards', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Ms. Haddad:</p><p>“' + fmtW(l.tuition) + ' tuition, a ' + fmtW(l.bursary) + ' bursary and a ' + fmtW(l.scholar) + ' scholarship. What’s left?”</p>', fields: [{ k: 'l', name: 'Tuition left', ans: l.left, hint: 'Subtract both awards.' }] }); } }; }
    if (k === 'net') { var n = NETWORK_QS[seed % NETWORK_QS.length]; return { label: 'Town Mail: ' + n.label, from: from, pay: 500, run: async function (api) { await api.say(null, 'A letter from Ms. Haddad. She has a question.'); return K.askGrade(await api.ask('haddad', n, null)); } }; }
    var rq = ADMIT_QS[(seed + 2) % ADMIT_QS.length];
    return { label: 'Town Mail: ' + rq.label, from: from, pay: 500, run: async function (api) { await api.say(null, 'A letter from Ms. Haddad. She has a question.'); return K.askGrade(await api.ask('haddad', rq, null)); } };
  }

  var CONTACT_LINES = {
    ames: ['Calculus. And physics. Physics 30 saved me in first year.', 'I wish I’d known that the -1 math stream mattered. I almost took the other one.'],
    nurse: ['Biology and chemistry, every day. Even now.', 'I wish I’d known I could upgrade later. I panicked in Grade 12 for nothing.'],
    joe: ['Math 20 and physics. You use fractions every single day.', 'I wish I’d known about CTS electrical. I found out about trades late.'],
    cho: ['Math 30-1 and physics. The diploma moves fast.', 'I wish I’d known how hands-on polytechnic is. I would have started sooner.'],
    rosa: ['Biology 30, and chemistry. Animal medicine is a lot of science.', 'I wish I’d known to volunteer at a shelter. It helped my application.'],
    sam: ['Math 30 and ELA. Writing clearly matters in business.', 'I wish I’d known about scholarships for business students. Free money!']
  };
  function chapterSteps(ch, S, api) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the School and see Ms. Haddad', 'haddad');
        await api.say('haddad', ['Hi! I’m Ms. Haddad. In Grade 9 you’ll choose your Grade 10 courses. Those choices can open or close doors.', 'Meet Jordan, a Grade 12 student who wants to be a nurse. In Grade 10, Jordan skipped Biology 20 and took Math 20-2. Now the nursing program says Jordan is missing courses.']);
        await api.ask('haddad', { text: 'What could Jordan have done in Grade 10?', opts: [['Checked the program’s requirements early, and taken Biology 20 so Biology 30 stayed open.', 1, 'Yes. Plan backwards from the program.'], ['Nothing. Course choices don’t matter.', 0, 'They do. Programs list the courses they need.'], ['Taken more art.', 0, 'Art is great, but nursing needs biology.']] }, 'q-jordan', 'Jordan: what to do in Grade 10', 0);
        await api.ask('haddad', ADMIT_QS[0], 'q-min', 'Is the minimum average a guarantee?', 0);
      }));
      a.push(step('pick', async function (api, S) {
        await api.quest('Go home and pick two programs you might want after high school', 'table');
        var r1 = await K.pick(api, { id: 'progA', title: 'Program A: my first choice', name: 'pickA', intro: 'Pick your first choice. Each card shows its typical requirements.', noReason: true, options: PROGRAM_KEYS.map(function (k) { var p = P(k); return { k: k, title: p.name, icon: p.icon, lines: [['Type', p.kind + (p.competitive ? ', competitive' : '')]].concat(p.req.map(function (r) { return ['Needs', reqText(r)]; })) }; }), footNote: 'Typical requirements. Your real project uses a real school’s website.' });
        var r2 = await K.pick(api, { id: 'progB', title: 'Program B: a different one', name: 'pickB', intro: 'Pick a <b>different</b> program, like a backup or a second interest.', noReason: true, options: PROGRAM_KEYS.filter(function (k) { return k !== r1.pick; }).map(function (k) { var p = P(k); return { k: k, title: p.name, icon: p.icon, lines: [['Type', p.kind]].concat(p.req.map(function (r) { return ['Needs', reqText(r)]; })) }; }) });
        S.progs = [r1.pick, r2.pick]; api.give('Program cards', '🗂️', 'table'); api.hud();
        var both = P(r1.pick).req.filter(function (r) { return P(r2.pick).req.some(function (q) { return q.some(function (x) { return r.indexOf(x) >= 0; }); }); }).map(reqText);
        await api.say('you', both.length ? ['Both programs want: ' + both.join('; ') + '.', 'Those go in my plan for sure.'] : ['These two don’t share many requirements.', 'My plan will need courses for each.']);
      }));
      a.push(step('hunch', async function (api, S) {
        S.story.marcusOut = 1; api.refresh();
        await api.quest('Avery’s brother Marcus is at the School, looking at a letter', 'marcus');
        await api.say('marcus', ['Hey. I’m Marcus, Avery’s brother. Grade 12.', 'The nursing program says I’m missing courses. But I followed the course guide exactly!', 'It said Math 20-3 works for everything, and I could skip Biology. Did I ruin everything?']);
        await api.say('you', ['I don’t know yet. I’m just learning about requirements.', 'But I’ll find out. I’m keeping notes.']);
        S.story.marcus1 = 1; api.give('Course notes', '🔍', 'marcus'); api.refresh();
      }));
      a.push(step('end1', async function (api, S) {
        await api.quest('Tell Ms. Haddad about Marcus', 'haddad');
        await api.say('haddad', ['Hmm. Which course guide? I’ll look into it.', 'Now do Step 1 of your project: two programs, and their requirements.', 'Next time: your own Grade 10 to 12 plan.']);
      }));
    }
    if (ch === 1) {
      a.push(step('credits', async function (api, S) {
        await api.quest('Ms. Haddad wants to talk about planning high school', 'haddad');
        await api.say('haddad', ['To graduate with an Alberta High School Diploma, you need 100 credits and some required courses.', 'Most courses are worth 3 or 5 credits.']);
        var g = await api.calc({ title: 'Credits', name: 'credits', noPay: true, intro: '<p>Most core courses are worth <b>5 credits</b>.</p>', fields: [{ k: 'n', name: 'How many 5-credit courses make 100 credits?', fmt: function (c) { return Math.round(c) / 100 + ' courses'; }, ans: 2000, hint: '100 ÷ 5.' }] });
        api.record('q-credits', '5-credit courses in 100 credits', 1, g === 'first');
        await api.ask('haddad', ADMIT_QS[1], 'q-stream', 'Why the -1 stream keeps options open', 1);
      }));
      a.push(step('plan', async function (api, S) {
        await api.quest('Go home and build your course plan at the kitchen table', 'table');
        await plannerPanel(api, S, S.progs, { intro: 'Build a plan that meets the <b>diploma</b> and <b>both programs</b>: ' + S.progs.map(function (k) { return esc(P(k).name); }).join(' and ') + '.', key: 'q-plan', label: 'Course plan: meets the diploma and both programs (first check)', ch: 1 });
        api.give('My course plan', '🗺️', 'table'); api.hud();
        await K.typed(api, { id: 'openChoice', title: 'In your own words', prompt: 'Name one course choice in your plan that keeps more options open, and why.' });
      }));
      a.push(step('marcus2', async function (api, S) { // clue 1: Marcus's plan against nursing
        await api.quest('Help Marcus check his courses against nursing', 'marcus');
        await api.say('marcus', ['Here’s what I took. Can you check it against the nursing requirements?']);
        var c = coursesOf(MARCUS);
        await K.sort(api, { title: 'Marcus’s courses vs. nursing', name: 'marcuscheck', story: true, key: 'story-marcus', label: 'Marcus vs. nursing requirements', ch: 1, intro: 'Marcus took: ' + esc(c.join(', ')) + '. For each nursing requirement (typical), does he have it?',
          bins: [{ id: 'yes', label: 'He has it', icon: '✅' }, { id: 'no', label: 'Missing', icon: '❌' }], items: PROGRAMS.nurse.req.map(function (r, i) { var hasIt = has(c, r); return { id: 'r' + i, text: reqText(r), bin: hasIt ? 'yes' : 'no', why: hasIt ? 'It’s on his list.' : 'It’s not on his list.' }; }) });
        await api.say('you', ['You have ELA 30-1 and Chemistry 30. But you’re missing two: Biology 30, and Math 30-1 or 30-2. Math 30-3 doesn’t count for nursing.', 'Where did the guide say Math 20-3 works for everything?']);
        await api.say('marcus', 'Page 4. It’s in the library. Everybody uses it.');
        S.story.marcus2 = 1; api.toast('Added to your Course notes: Marcus’s courses'); api.save();
      }));
      a.push(step('quiz1', async function (api, S) {
        await api.quest('Ms. Haddad is running the Prereq Quiz at the School', 'haddad');
        await quizRound(api, S, 'ch2', 2);
      }));
      a.push(step('end2', async function (api, S) {
        await api.say('haddad', ['Now do Step 2 of your project: your course plan for both programs.', 'Next time: paying for it. Some money never has to be paid back.']);
      }));
    }
    if (ch === 2) {
      a.push(step('noor', async function (api, S) {
        await api.quest('Ms. Haddad has a story about paying for school', 'haddad');
        await api.say('haddad', ['Noor earned the Alexander Rutherford Scholarship. It rewards Grade 10–12 marks, up to $2,500.', 'First-year tuition at the University of Alberta (2026–27) is 10 × $729.36 = $7,293.60.']);
        var g = await api.calc({ title: 'Noor’s first year', name: 'noor', noPay: true, intro: '<p>Tuition: <b>$7,293.60</b>. Rutherford Scholarship: <b>$2,500</b>.</p>', fields: [{ k: 'l', name: 'Tuition left to pay', ans: UA_YEAR - RUTHERFORD, hint: '$7,293.60 − $2,500.' }] });
        api.record('q-noor', 'Tuition after the Rutherford Scholarship', 2, g === 'first');
        await K.sort(api, { title: 'Scholarship, bursary, grant or loan?', name: 'aid', story: true, key: 'q-aid', label: 'Scholarship, bursary, grant or loan', ch: 2, wide: true, intro: 'Which kind of money is each one?', bins: AID, items: AID_ITEMS.slice(0, 6).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      }));
      a.push(step('mycost', async function (api, S) {
        await api.quest('Go home and compare the tuition for your two programs', 'table');
        var A = P(S.progs[0]), B = P(S.progs[1]);
        var g = await api.calc({ title: 'Tuition for my two programs', name: 'mycost', noPay: true, intro: '<p><b>' + esc(A.name) + '</b>: ' + fmt(A.tuition) + ' a year' + (A.sample ? ' (sample)' : '') + ', ' + A.years + ' years. <b>' + esc(B.name) + '</b>: ' + fmt(B.tuition) + ' a year' + (B.sample ? ' (sample)' : '') + ', ' + B.years + ' years.</p>',
          fields: [{ k: 'a', name: 'Total tuition: ' + A.name, ans: A.tuition * A.years, hint: A.years + ' × ' + fmt(A.tuition) + '.' }, { k: 'b', name: 'Total tuition: ' + B.name, ans: B.tuition * B.years, hint: B.years + ' × ' + fmt(B.tuition) + '.' }] });
        api.record('q-mycost', 'Total tuition for my two programs', 2, g === 'first');
        await K.typed(api, { id: 'awards', title: 'Getting awards', prompt: 'What can you do in high school to get scholarships or bursaries?' });
      }));
      a.push(step('guide', async function (api, S) { // clue 2 and the source: the old guide
        await api.quest('Find the old course guide at the library', 'librarian');
        await api.say('librarian', ['The course guide? Right here on the counter. Everyone takes one.', 'Let me check the date... 2009?! Oh dear.']);
        await K.inspect(api, { title: 'The old course guide (2009)', name: 'oldguide', story: true, key: 'story-guide', label: 'The old course guide: find what is wrong', ch: 2, find: 'Find the 4 things that are wrong or out of date', cols: 3,
          intro: 'Tap every line that would close doors for a student who believed it.',
          spots: [{ id: 'm3', icon: '➗', label: '“Math 20-3 gets you into any program.”', bad: true, why: 'Many programs need Math 30-1 or 30-2.', hint: 'Check against what programs need.' }, { id: 'never', icon: '🔒', label: '“Once you pick a stream, you can never change.”', bad: true, why: 'You can upgrade or switch. It just takes longer.' },
            { id: 'g10', icon: '🙈', label: '“Grade 10 marks don’t count for anything.”', bad: true, why: 'Scholarships like Rutherford count Grade 10–12 marks.' }, { id: 'rich', icon: '💸', label: '“Scholarships are only for university students.”', bad: true, why: 'There are awards for colleges, trades and more.' },
            { id: 'counsellor', icon: '🧑‍🏫', label: '“Talk to your counsellor every year.”', fine: 'Still great advice.' }, { id: 'cts', icon: '🔧', label: '“CTS courses let you try a trade.”', fine: 'True, and still useful.' }] });
        await api.say('marcus', ['So the guide was wrong. And I thought I couldn’t afford nursing anyway.', 'But my Grade 10–12 marks might still get me a scholarship.']);
        S.story.guide = 1; api.toast('Added to your Course notes: the old guide'); api.save();
      }));
      a.push(step('quiz2', async function (api, S) {
        await api.quest('Another Prereq Quiz round at the School', 'haddad');
        await quizRound(api, S, 'ch3', 3);
        await api.say('haddad', ['A 2009 guide! I’m so sorry. I’ll bring it to the plan conference.', 'Now do Step 3 of your project: tuition, and two ways to help pay.', 'Next time: networking. Then the plan conference!']);
      }));
    }
    if (ch === 3) {
      a.push(step('network', async function (api, S) {
        await api.quest('Ms. Haddad wants to talk about networking', 'haddad');
        await api.say('haddad', ['Sam wanted to know what an electrician’s day is like. His soccer coach’s brother is an electrician.', 'Sam asked his coach to introduce them. They talked for 15 minutes. That’s networking.']);
        await api.ask('haddad', NETWORK_QS[0], 'q-network', 'What networking is', 3);
        var who = P(S.progs[0]).contact;
        S.contact = who; api.save();
        await api.say('haddad', 'Want to try? I know someone in ' + P(S.progs[0]).name.toLowerCase() + '. I’ll introduce you.');
      }));
      a.push(step('talk', async function (api, S) {
        var who = S.contact, L = CONTACT_LINES[who];
        await api.quest('Talk to your new contact about ' + P(S.progs[0]).name.toLowerCase(), who);
        await api.say('you', 'Hi! Ms. Haddad said you might help me. What courses helped you most?');
        await api.say(who, L[0]);
        await api.say('you', 'What do you wish you’d known in Grade 8?');
        await api.say(who, L[1]);
        await api.say('you', 'Thank you so much. Can I ask you more questions later?');
        await api.say(who, 'Anytime. Good luck!');
        await K.typed(api, { id: 'changePlan', title: 'After the conversation', prompt: 'What will you change in your plan because of this conversation?' });
      }));
      a.push(step('conf', async function (api, S) { // the hero beat: the plan conference
        S.scene = 'conf'; api.refresh();
        await api.quest('The plan conference is starting at the School', 'haddad');
        api.fx.face('all');
        await api.say('haddad', ['Welcome to plan conferences! Families, ask anything. ' + api.profile.name + ', you’re first.']);
        if (!S.conf) S.conf = { got: 0, asked: {} };
        var A = P(S.progs[0]), Qs = [
          ['q-conf-math', 'grandpa', { text: 'Why did you pick ' + (S.plan && /m1/.test(S.plan.math) ? 'the Math 30-1 stream' : 'that math stream') + '?', opts: [['Because my programs need it, and the stronger stream keeps more doors open.', 1, 'Sensible!'], ['Because my friends picked it.', 0, 'Friends are great. Plans need reasons.'], ['It doesn’t matter which math.', 0, 'Programs often name the math they need.']] }],
          ['q-conf-min', 'avery', { text: 'If you get the minimum average, are you in?', opts: [['Not for sure. Competitive programs take the highest averages first, so I have a backup.', 1, 'Smart. That’s why you have Program B.'], ['Yes, guaranteed.', 0, 'The minimum is the lowest they’ll look at.'], ['No, you need 100%.', 0, 'Not 100%. But competitive means higher than the minimum.']] }],
          ['q-conf-pay', 'marcus', { text: 'How will you pay for it?', opts: [['Scholarships and bursaries first, because they’re not paid back. Then grants, then loans if I need them.', 1, 'That’s my plan now too.'], ['A loan is the same as a grant.', 0, 'A loan is paid back. A grant isn’t.'], ['I can’t, so why plan?', 0, 'There’s more help than most people know.']] }],
          ['q-conf-late', 'marcus', { text: 'What if someone is missing courses in Grade 12, like me?', opts: [['It’s not too late. You can upgrade the courses, then apply. It just takes a little longer.', 1, 'That’s exactly what I’m doing.'], ['Then they can never go.', 0, 'Upgrading is a real road.'], ['Just apply anyway and hope.', 0, 'Missing requirements means you won’t be admitted. Upgrade first.']] }]
        ];
        for (var i = 0; i < Qs.length; i++) {
          var q = Qs[i]; if (S.conf.asked[q[0]]) continue;
          var r = await api.ask(q[1], q[2], q[0], 'Plan conference: ' + q[2].text, 3);
          S.conf.asked[q[0]] = 1; if (r.first) { S.conf.got++; api.fx.rise(q[1], '+1'); }
          api.save(); api.hud();
        }
        S.win = S.conf.got >= POINTS_TO_WIN; api.save();
        await api.say('haddad', S.win ? 'A plan that keeps doors open, and answers to every question. Excellent.' : 'A good plan! A few answers need work. You can replay this chapter from the Menu.');
        await api.say('marcus', ['I’m upgrading: Biology 30 this summer, Math 30-2 in the fall. Then I apply to nursing.', 'One year later than I planned. Still a nurse.']);
        S.story.conf = 1; api.save();
        await K.hero(api, { who: 'haddad', lines: ['That old 2009 guide is going in the recycling. From now on, every Grade 9 student gets a real course map, built backwards from the programs.', api.profile.name + ' showed us how. So it’s the ' + api.profile.name + ' Course Map.'],
          medal: 'Open Doors medal', icon: '🗝️', kicker: 'Plan conference', title: 'The ' + api.profile.name + ' Course Map', reply: ['Thanks! Check the requirements early. Every door you keep open is a choice later.'] });
        S.story.hero = 1; S.scene = null; api.refresh();
      }));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and pin your course map to your My Plan wall', 'myplan');
        var firstTime = !S.finished; S.finished = true;
        if (firstTime) api.profileAdd('closet', 'letterman');
        api.profileAdd('plan', { mission: '8-post-secondary', title: 'My High School Map', text: 'Programs: ' + S.progs.map(function (k) { return P(k).name; }).join(' and ') + '. Math: ' + (S.plan ? MATH_NAMES[S.plan.math] : '—') + '.' });
        api.profileAdd('finished', '8-post-secondary'); api.refresh();
        await api.say('haddad', [S.win ? 'Doors open, and a course map named after you!' : 'A course map named after you! Next time, ace the conference too.', 'Your closet has a new Letter jacket, and your My Plan wall has a new page.', 'Now do Step 4 of your project: talk to someone about one of your programs.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }

  T.mission({
    id: '8-post-secondary', unitLabel: 'CEFL Grade 8 · Post-Secondary Pathways · Project: My High School Map', title: 'The Course Map: Keep Your Doors Open',
    iCan: 'I can plan high school courses that meet a program’s requirements, explain competitive admission, and name ways to pay for school.',
    foot: 'This is a model. Program requirements are typical, not exact: check each school. Rutherford and U of A figures are real (2026–27). The people are made up.',
    bagTip: 'Your Bag holds what you collect: your program cards, your course plan and your Course notes.',
    realRule: 'Real hides the plan checker until you press Check', afterLine: 'Mission complete. Open Menu → Report to show your teacher.',
    chapters: [
      { name: 'The ticket in', step: 'Step 1', moment: 'Moment 1: admission requirements' },
      { name: 'Planning high school', step: 'Step 2', moment: 'Moment 2: planning high school' },
      { name: 'Paying for it', step: 'Step 3', moment: 'Moment 3: paying for it' },
      { name: 'Who you know', step: 'Step 4', moment: 'Moment 4: networking' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps, guide: 'haddad',
    helpers: function () { return HELPS; }, gossip: gossip, mail: function (S, seed, last) { return mailTask(seed, last); },
    outfit: function (S) { return S.finished ? 'letterman' : 'none'; },
    placeObjects: function (api) { api.place('table', 'home', 4, 3, { label: 'Kitchen table' }); api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true }); },
    people: function (S) {
      var out = {}, s = S.story;
      out.haddad = { name: 'Ms. Haddad', role: 'School counsellor', map: 'school', x: 4, y: 3, dir: 'down', look: { base: 3, skin: 's3', hair: 'black', shirt: 'teal', pants: '#3b3f5c' } };
      out.marcus = { name: 'Marcus', role: 'Grade 12, Avery’s brother', map: 'school', x: 2, y: 4, dir: 'right', look: { base: 2, skin: 's1', hair: 'ginger', shirt: 'blue', pants: '#2f3a5c' }, hidden: !s.marcusOut };
      out.ames = { name: 'Dr. Ames', role: 'University', map: 'university', x: 4, y: 3, dir: 'down', look: { base: 2, skin: 's5', hair: 'grey', shirt: 'blue', pants: '#2f2f38' } };
      out.cho = { name: 'Ms. Cho', role: 'Polytechnic', map: 'polytechnic', x: 4, y: 3, dir: 'down', look: { base: 1, skin: 's2', hair: 'black', shirt: 'red', pants: '#3b3f5c' } };
      out.joe = { name: 'Joe', role: 'Electrician', map: 'electric', x: 4, y: 3, dir: 'down', look: { base: 5 } };
      if (S.contact === 'rosa') out.rosa = { role: 'Vet tech', map: 'town', x: 52, y: 39, dir: 'down', wander: 0 };
      if (S.scene === 'conf') { out.grandpa = { map: 'school', x: 6, y: 4, dir: 'left' }; out.avery = { map: 'school', x: 5, y: 3, dir: 'down' }; out.marcus = { name: 'Marcus', role: 'Grade 12', map: 'school', x: 3, y: 3, dir: 'down', look: out.marcus.look }; }
      return out;
    },
    doorOpen: function (id) { return !!{ home: 1, grandpa: 1, school: 1, library: 1, university: 1, polytechnic: 1, electric: 1, hospital: 1, bank: 1, townhall: 1, jobcentre: 1 }[id]; },
    lockedLine: function (id) { return T.world.building(id).name + ' is closed right now. Try the School or the library.'; },
    talk: function (id, S, api) {
      var s = S.story, done = S.finished;
      var lines = {
        haddad: done ? 'Doors open. That’s the whole idea.' : 'Your next goal is on the gold line at the top.',
        marcus: s.hero ? 'Biology 30 starts in July. Then nursing!' : s.guide ? 'A 2009 guide. Unbelievable.' : s.marcus2 ? 'Two courses missing. Okay. Breathe.' : 'Did I ruin everything?',
        librarian: s.guide ? 'The 2009 guide is gone. Good riddance, shiny paper.' : 'Course guides on the counter! Very popular.',
        ames: CONTACT_LINES.ames[0], cho: CONTACT_LINES.cho[0], joe: CONTACT_LINES.joe[0], nurse: 'Biology and chemistry, every day.',
        avery: 'My brother is going to be a nurse. Eventually!', grandpa: 'Plan on purpose, kid. It’s easier.', sam: 'Scholarships: the best kind of money.',
        table: 'The kitchen table. Good for big plans.',
        myplan: K.planLine(api)
      };
      return lines[id] || null;
    },
    hud: function (S) {
      var out = [{ label: 'Programs', value: S.progs ? S.progs.map(function (k) { return P(k).icon; }).join(' ') : '—', title: S.progs ? S.progs.map(function (k) { return P(k).name; }).join(' and ') : '' }];
      if (S.plan && S.progs) { var c = checkPlan(S.plan, S.progs); out.push({ label: 'Plan', value: c.all ? 'all doors open ✓' : 'gaps ✗', warn: !c.all }); }
      if (S.conf) out.push({ label: 'Conference', value: S.conf.got + ' / 4', title: '3 good answers convince the families' });
      return out;
    },
    items: function (S) {
      var it = [];
      if (S.progs) it.push({ name: 'Program cards', icon: '🗂️', note: S.progs.map(function (k) { return P(k).name; }).join(', '), view: function () { return '<div class="ck-grid2">' + S.progs.map(progHTML).join('') + '</div><p class="ct-small">Typical requirements. Check each school’s website.</p>'; } });
      if (S.plan) it.push({ name: 'My course plan', icon: '🗺️', note: MATH_NAMES[S.plan.math], view: function () { return planHTML(S.plan) + checkHTML(checkPlan(S.plan, S.progs), S.progs); } });
      if (S.story.marcus1) it.push({ name: 'Course notes', icon: '🔍', note: 'The old course guide', view: function () { return K.notes(notes(S)); } });
      if (S.story.hero) it.push({ name: 'Open Doors medal', icon: '🗝️', note: 'The ' + T.api.profile.name + ' Course Map', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🗝️</p><p style="text-align:center"><b>Open Doors</b><br>For replacing an old guide with a real map.</p>'; } });
      return it;
    },
    report: function (S) {
      if (!S.progs) return '<p>Not started yet.</p>';
      var h = '<p>Programs: <b>' + S.progs.map(function (k) { return esc(P(k).name); }).join(' and ') + '</b>' + (S.finished ? ' · Plan conference: <b>' + S.conf.got + ' of 4</b> (' + (S.win ? 'convinced' : 'goal not reached') + ')' : '') + '</p>';
      if (S.plan) h += '<h3>Course plan</h3>' + planHTML(S.plan) + checkHTML(checkPlan(S.plan, S.progs), S.progs);
      var qz = Object.keys(S.quizzes); if (qz.length) h += '<h3>Prereq Quiz</h3>' + K.table(qz.map(function (k) { var x = S.quizzes[k]; return [k === 'ch2' ? 'Chapter 2' : 'Chapter 3', String(x.score), K.TIER_WORD[x.tier]]; }), ['When', 'Score', 'Result']);
      h += K.wrote(S, [['openChoice', 'A choice that keeps options open'], ['awards', 'How I could earn awards'], ['changePlan', 'What I’ll change after my conversation']]);
      h += '<h3>The old course guide</h3><p>' + (S.story.hero ? 'Solved: the 2009 guide was replaced by their course map, named after them.' : S.story.guide ? 'Found the old guide.' : S.story.marcus1 ? 'Collecting clues.' : 'Not started.') + '</p>';
      return h;
    },
    test: { scenes: [null, { story: { marcusOut: 1 } }, { scene: 'conf', story: { marcusOut: 1 } }], PROGRAMS: PROGRAMS, dropReq: dropReq, coursesOf: coursesOf, checkPlan: checkPlan, planFor: planFor, MARCUS: MARCUS, DIPLOMA: DIPLOMA, GAME_CFGS: GAME_CFGS, aidTask: aidTask, leftTask: leftTask, reqTask: reqTask, mailTask: mailTask, HELPS: HELPS, GOSSIP: GOSSIP }
  });
  function notes(S) {
    var s = S.story, li = [];
    if (s.marcus1) li.push('<b>Marcus:</b> Grade 12, wants nursing. The program says he’s missing courses. He followed “the course guide” exactly.');
    if (s.marcus2) li.push('<b>Marcus’s courses:</b> he has ELA 30-1 and Chemistry 30, but he is missing Biology 30, and Math 30-1 or 30-2 (his Math 30-3 doesn’t count for nursing).');
    if (s.guide) li.push('<b>The course guide:</b> from 2009. It says Math 20-3 gets you into anything, streams are forever, Grade 10 marks don’t count, and scholarships are only for university.');
    if (s.conf) li.push('<b>Plan conference:</b> Marcus will upgrade Biology 30 and Math 30-2, then apply.');
    if (s.hero) li.push('<b>The ' + esc(T.api.profile.name) + ' Course Map:</b> built backwards from the programs, for every Grade 9 student.');
    return li;
  }
})();
