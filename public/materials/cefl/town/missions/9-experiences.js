/* CEFL Town mission: Grade 9 Experiences and Employment — "Pitch It" (companion to the project Pitch It). LO 9-EX1, 9-EX2.
   Four chapters, one after each project step: Experiences that open doors (volunteering, work-integrated learning, entrepreneurship)
   · A simple business plan (costs, profit, break-even, risk) · Skills (formal and informal; job-specific and employability;
   bilingualism) · Getting hired (cover letters, digital identity). You run a small stall at the Saturday Market in Town Square.
   Model (MODEL START … END, no DOM): three ventures (sample prices): bike tune-ups, custom buttons, plant starts, each with a fixed
   cost, a cost per item, three prices and the customers each price brings on a market day (a higher price brings fewer). Two market
   days. The Stall Rush game (kit quickPick: making change) changes how many customers you serve that day: great +20%, ok none,
   poor −20%, skipped −30%. Win = after both days, profit (sales − variable costs − fixed costs) reaches the stall's target. In Node:
   the middle price wins in every venture even with both rounds poor; the highest and lowest prices can lose.
   Side story, "Theo's Rules": Theo's market table always loses money (Ch 1) → he never counted his fixed costs, and priced below
   break-even (Ch 2) → his helpers quit, and his notebook of "rules" is the source: no costs if you own it, cheapest wins, everyone
   does every job, posts are private (Ch 3) → his public posts cost him the summer market spot; at the pitch panel he presents a
   real plan with you, and the market's new-stall plan template is named after you (Ch 4).
   Data: about 18% of Canadians can hold a conversation in English and French (2021 Census); Alberta's Registered Apprenticeship
   Program (RAP). Between lessons (HELP START … HELP END): townspeople's own questions, an extra Stall Rush, and Town Mail. */
(function () {
  'use strict';

/* MODEL START ── no DOM. Money in cents. ── */
var VENTURES = {
  bike:    { name: 'Bike tune-ups', icon: '🚲', fixedName: 'Tools', fixed: 15000, varName: 'Parts per tune-up', v: 500, unit: 'tune-up', prices: [2000, 2500, 3000], demand: [10, 8, 5], target: 8000, careers: 'mechanic, engineer, small business owner' },
  buttons: { name: 'Custom buttons', icon: '🔘', fixedName: 'A button maker', fixed: 6000, varName: 'Supplies per button', v: 50, unit: 'button', prices: [150, 200, 300], demand: [60, 45, 20], target: 4000, careers: 'graphic designer, artist, marketing' },
  plants:  { name: 'Plant starts', icon: '🌱', fixedName: 'Trays and soil', fixed: 4000, varName: 'Seeds and pot per plant', v: 100, unit: 'plant', prices: [300, 400, 600], demand: [25, 20, 10], target: 5000, careers: 'horticulture, farming, landscaping' }
};
var VENTURE_KEYS = Object.keys(VENTURES);
var EFFECT = { great: 0.2, ok: 0, poor: -0.2, skip: -0.3 };
function profitEach(k, pi) { var x = VENTURES[k]; return x.prices[pi] - x.v; }
function breakEven(k, pi) { return Math.ceil(VENTURES[k].fixed / profitEach(k, pi)); }
function servedOf(k, pi, tier) { return Math.max(0, Math.round(VENTURES[k].demand[pi] * (1 + (EFFECT[tier] || 0)))); }
function dayResult(k, pi, tier) { var n = servedOf(k, pi, tier), x = VENTURES[k]; return { pi: pi, tier: tier, served: n, sales: n * x.prices[pi], costs: n * x.v, profit: n * profitEach(k, pi) }; }
function totalProfit(k, days) { return days.reduce(function (t, d) { return t + d.profit; }, 0) - VENTURES[k].fixed; }
function outcome(k, days) { var p = totalProfit(k, days); return { profit: p, brokeEven: p >= 0, win: p >= VENTURES[k].target }; }
var ZOE = { fixed: 15000, v: 500, price: 2500 };
var THEO = { fixed: 9000, v: 300, price: 250, sold: 40 }; // stickers: a $90 printer, 3 dollars of vinyl each... sold at $2.50
var KINDS = [{ id: 'vol', label: 'Volunteering', icon: '🙌' }, { id: 'wil', label: 'Work-integrated learning', icon: '🏫' }, { id: 'ent', label: 'Entrepreneurship', icon: '💡' }];
var KIND_ITEMS = [['A student earns credits working at a veterinary clinic', 'wil', 'School credit for real work.'], ['A student starts a lawn-care business', 'ent', 'Running your own business.'], ['A student helps coach a Special Olympics team', 'vol', 'Giving time, unpaid.'],
  ['Sofia joins RAP and works in a cabinet shop for credit and pay', 'wil', 'An apprenticeship in high school.'], ['Zoe starts a bike repair service', 'ent', 'Her own business.'], ['Aiden volunteers at a seniors’ centre', 'vol', 'Unpaid, to help and to learn.'],
  ['A student sells stickers at the market', 'ent', 'A small business.'], ['A student does a co-op placement at an architect’s office', 'wil', 'Work as part of school.']];
var LEARN = [['A first-aid certificate', 'formal'], ['Learning to cook from a parent', 'informal'], ['Teaching yourself video editing online', 'informal'], ['A safety course in a RAP placement', 'formal'], ['Learning to fix furniture from Grandpa', 'informal'], ['A babysitting course with a certificate', 'formal'], ['Practising guitar on your own', 'informal'], ['A food safety course', 'formal']];
var SKILLKIND = [['Measuring and cutting wood', 'job'], ['Teamwork', 'emp'], ['Shop safety rules', 'job'], ['Time management', 'emp'], ['Speaking English and French', 'emp'], ['Fixing a bike chain', 'job'], ['Problem solving', 'emp'], ['Running a cash register', 'job']];
var GAME_CFGS = {
  rush: { kind: 'quickPick', cfg: { id: 'rush', name: 'Stall Rush', scoreWord: 'Customers served', think: 3200, th: [[10, 4], [10, 4]],
    how: '<p><b>Stall Rush.</b> Customers line up at your stall. Work out the total or the change, and tap the right amount.</p><p class="ct-small">A wrong amount costs a point. Cash rounds to the nearest 5 cents.</p>',
    make: function (r) {
      function pk(a) { return a[Math.floor(r() * a.length)]; }
      function sh(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
      function d(c) { return '$' + (c / 100).toFixed(2); }
      var it = pk([['button', 200], ['plant', 400], ['tune-up', 2500], ['button', 150], ['plant', 300]]), n = 1 + Math.floor(r() * (it[1] >= 2000 ? 2 : 4)), total = n * it[1], q;
      if (r() < 0.5) { q = { q: n + ' ' + it[0] + (n > 1 ? 's' : '') + ' at ' + d(it[1]) + ' each. Total?', r: d(total), w: [d(total + it[1]), d(Math.max(it[1], total - it[1]))] }; if (n === 1) q.w = [d(total * 2), d(total + 100)]; }
      else { var paid = [500, 1000, 2000, 5000, 10000].filter(function (b) { return b > total; })[0], ch = paid - total; q = { q: n + ' ' + it[0] + (n > 1 ? 's' : '') + ' at ' + d(it[1]) + '. Paid with ' + d(paid) + '. Change?', r: d(ch), w: [d(ch + 100), d(Math.abs(ch - 50) || 25)] }; }
      var opts = sh([q.r].concat(q.w.filter(function (x) { return x !== q.r; }).slice(0, 2)));
      while (opts.length < 3) opts.push('$0.00');
      return { q: q.q, icon: '🧾', opts: opts, ans: opts.indexOf(q.r) };
    } } }
};
/* MODEL END */

/* HELP START ── between lessons, on fresh seeds. No DOM. ── */
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function pickN(r, a, n) { var b = a.slice(), out = []; while (out.length < n && b.length) out.push(b.splice(Math.floor(r() * b.length), 1)[0]); return out; }
function spread(seed, list, keys, each, total) { var r = RNG(seed); r(); var out = []; keys.forEach(function (k) { out = out.concat(pickN(r, list.filter(function (x) { return x[1] === k; }), each)); }); var rest = list.filter(function (x) { return out.indexOf(x) < 0; }); return pickN(r, out.concat(pickN(r, rest, total - out.length)), total); }
function beTask(seed) { var r = RNG(seed * 13 + 1); r(); var fixed = (4 + Math.floor(r() * 17)) * 1000, v = [25, 50, 100, 200, 300][Math.floor(r() * 5)], price = v + [100, 150, 200, 300, 500][Math.floor(r() * 5)]; return { fixed: fixed, v: v, price: price, each: price - v, be: Math.ceil(fixed / (price - v)) }; }
function kindTask(seed) { return spread(seed * 17 + 3, KIND_ITEMS, ['vol', 'wil', 'ent'], 1, 4); }
function learnTask(seed) { return spread(seed * 19 + 5, LEARN, ['formal', 'informal'], 2, 4); }
var ID_QS = [
  { id: 'private', label: '“My posts are private”', text: 'What I post online is private. It won’t affect getting a job, right?', opts: [['Wrong. Employers often search your name. Public posts can help or hurt.', 1, 'Yikes. I’m checking my settings.'], ['Right. Employers never look.', 0, 'Many do. Aiden’s manager did.'], ['Right, if you delete them later.', 0, 'Screenshots and old copies can stay around.']] },
  { id: 'email', label: 'A professional email', text: 'Which email should go on a job application?', opts: [['firstname.lastname@mail.com', 1, 'Clear and professional.'], ['xXgamerkingXx@mail.com', 0, 'Fun for friends, not for employers.'], ['partytime99@mail.com', 0, 'Not the first impression you want.']] },
  { id: 'cover', label: 'Why change a cover letter', text: 'Why should a cover letter be different for each employer?', opts: [['Each job asks for different things. Show why you fit THIS one.', 1, 'Got it.'], ['It shouldn’t. Copy and paste is fine.', 0, 'Employers can tell.'], ['To make it longer.', 0, 'Short and specific is better.']] },
  { id: 'resources', label: 'Where to find a job', text: 'Where can a teenager find job postings?', opts: [['Job Bank, school counsellors, personal networks, and employment services.', 1, 'Lots of places!'], ['Only newspapers.', 0, 'Most postings are online now.'], ['Nowhere until you’re 18.', 0, 'Teens can work in Alberta, with some rules.']] }
];
var BIZ_QS = [
  { id: 'small', label: 'Why start small', text: 'Why should a new business start small?', opts: [['To test if people will buy, with less money at risk.', 1, 'Smart.'], ['Small businesses never grow.', 0, 'Many start small and grow.'], ['It doesn’t matter.', 0, 'Unsold stock is lost money.']] },
  { id: 'price', label: 'Raising the price', text: 'If I raise my price, what happens?', opts: [['Break-even comes sooner, but fewer people may buy.', 1, 'A trade-off.'], ['More people buy.', 0, 'Usually fewer.'], ['Nothing changes.', 0, 'Price changes profit and customers.']] },
  { id: 'try', label: 'Trying before choosing', text: 'Why try an experience before choosing a program after high school?', opts: [['You find out if you like the work before spending years and money on training.', 1, 'Cheap way to learn about yourself.'], ['There’s no point.', 0, 'It can save time and money.'], ['Only for people who already know.', 0, 'It helps most when you’re unsure.']] }
];
function mailKind(seed, last) { var k = ['kind']; if (last >= 1) k.push('be'); if (last >= 2) k.push('learn'); if (last >= 3) k.push('id'); return k[RNG(seed * 7 + 3)() * k.length | 0]; }
/* HELP END */

  var T = window.CEFLTown, K = T.kit, esc = T.esc;
  var fmt = K.fmt, fmtW = K.fmtW, step = K.step;
  function nFmt(u) { return function (c) { var v = Math.round(c) / 100; return v + ' ' + u + (v === 1 ? '' : 's'); }; }
  var RUSH = T.gameKit.quickPick(GAME_CFGS.rush.cfg), RUSH_PAY = 800;

  function init() { return { v: 1, seed: (window.__seed || 1 + Math.floor(Math.random() * 1e6)), ans: {}, typed: {}, story: {}, venture: null, days: [], rushes: {}, scene: null, finished: false }; }
  function validate(S) { return !!S && S.v === 1 && !!S.typed && !!S.story && !!S.rushes && Array.isArray(S.days) && (S.venture === null || !!VENTURES[S.venture]); }
  function V(S) { return VENTURES[S.venture]; }
  function ventureHTML(k) { var x = VENTURES[k]; return '<div class="ck-card"><span class="ck-big" aria-hidden="true">' + x.icon + '</span><b>' + esc(x.name) + '</b><div class="ck-kv"><span>' + esc(x.fixedName) + ' (fixed, once)</span><b>' + fmt(x.fixed) + '</b><span>' + esc(x.varName) + '</span><b>' + fmt(x.v) + '</b><span>Price choices</span><b>' + x.prices.map(fmt).join(' · ') + '</b><span>Stall goal</span><b>' + fmtW(x.target) + ' profit after costs</b><span>Careers</span><b>' + esc(x.careers) + '</b></div></div>'; }
  function rushOpts(api, seed, help) {
    return { title: 'Stall Rush' + (help ? ': an extra market hour' : ''), name: 'minigame', game: RUSH, seed: seed, seconds: 60, leave: !!help, skipNote: 'Skipping means you serve fewer customers today.',
      tierText: help ? K.payTiers(RUSH_PAY) : { great: 'A fast, friendly stall: 20% more customers today.', ok: 'A steady stall: customers as expected.', poor: 'Slow change, long line: 20% fewer customers today.' } };
  }
  async function marketDay(api, S, n) {
    var x = V(S);
    if (!S.days[n - 1]) {
      var pick = await K.pick(api, { id: 'price' + n, title: 'Market Day ' + n + ': set your price', name: 'pickprice', intro: 'A higher price earns more on each ' + x.unit + ', but fewer people buy. Customers on a usual market day:', noReason: true,
        options: x.prices.map(function (p, i) { return { k: String(i), title: fmt(p) + ' a ' + x.unit, icon: x.icon, lines: [['Customers (usual day)', String(x.demand[i])], ['Profit each', fmt(profitEach(S.venture, i))], ['Break-even', breakEven(S.venture, i) + ' ' + x.unit + 's']] }; }) });
      var pi = +pick.pick, r = await api.minigame(rushOpts(api, S.seed * 83 + n, false)), d = dayResult(S.venture, pi, r.tier);
      S.days[n - 1] = d; S.rushes['day' + n] = { tier: r.tier, score: r.score }; api.save(); api.hud();
    }
    var dd = S.days[n - 1], before = n > 1 ? totalProfit(S.venture, S.days.slice(0, n - 1)) : -x.fixed;
    await K.timeline(api, { title: 'Market Day ' + n + ': how it went', name: 'day', rows: [{ label: 'Price', html: fmt(x.prices[dd.pi]) + ' a ' + x.unit }, { label: 'Served', html: dd.served + ' customers' + (dd.tier === 'great' ? ' (a fast stall brought more)' : dd.tier === 'poor' || dd.tier === 'skip' ? ' (a slow stall lost some)' : '') }, { label: 'Sales', html: fmt(dd.sales) }, { label: 'Costs', html: '−' + fmt(dd.costs) + ' (' + esc(x.varName.toLowerCase()) + ')', tone: 'bad' }, { label: 'Day’s profit', html: '<b>' + fmt(dd.profit) + '</b>', tone: 'good' }],
      total: { label: 'Profit so far, after the ' + x.fixedName.toLowerCase() + ':', from: before, to: totalProfit(S.venture, S.days.slice(0, n)), fmt: fmt } });
  }

  var HELPS = [
    { id: 'ex9-kind', who: 'avery', after: 0, pay: 600, label: 'Kinds of experiences', ask: 'I’m filling in a form about experiences. Can you sort these?', run: async function (api, seed) {
      var t = kindTask(seed); var g = await K.sort(api, { title: 'Help Avery: what kind of experience?', name: 'help-sort', leave: true, wide: true, intro: 'Volunteering, work-integrated learning, or entrepreneurship?', bins: KINDS, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
      if (g) await api.say('avery', 'RAP sounds amazing. Credits AND pay?'); return g; } },
    { id: 'ex9-try', who: 'grandpa', after: 0, pay: 500, label: 'Experiences and choices', ask: 'Can I ask you something about trying things out?', run: async function (api, seed) { return K.askGrade(await api.ask('grandpa', BIZ_QS[2 - seed % 2 * 2], null)); } },
    { id: 'ex9-be', who: 'dev', after: 1, pay: 1000, label: 'Break-even', ask: 'I want to sell something at the market. When do I break even?', run: async function (api, seed) {
      var t = beTask(seed); var g = await api.calc({ title: 'Help Dev: break-even', name: 'help-be', intro: '<p>Fixed cost: <b>' + fmt(t.fixed) + '</b> (once). Cost per item: <b>' + fmt(t.v) + '</b>. Price: <b>' + fmt(t.price) + '</b>. (Sample.)</p>',
        fields: [{ k: 'e', name: 'Profit per item', ans: t.each, hint: 'Price − cost per item.' }, { k: 'b', name: 'Break-even (items, round up)', fmt: nFmt('item'), ans: t.be * 100, alts: [Math.round(t.fixed / t.each * 100)], hint: 'Fixed cost ÷ profit per item, then round up.' }] });
      if (g) await api.say('dev', t.be + ' sales to break even. Then it’s profit. Okay!'); return g; } },
    { id: 'ex9-biz', who: 'sam', after: 1, pay: 500, label: 'Small business questions', ask: 'Customer question about a small business. Can you answer?', run: async function (api, seed) { return K.askGrade(await api.ask('sam', BIZ_QS[seed % 2], null)); } },
    { id: 'ex9-learn', who: 'rosa', after: 2, pay: 800, label: 'Formal or informal learning', ask: 'I’m updating my résumé. Where did I learn these, formally or informally?', run: async function (api, seed) {
      var t = learnTask(seed); var g = await K.sort(api, { title: 'Help Rosa: formal or informal?', name: 'help-sort', leave: true, intro: '<b>Formal</b>: courses, training, certificates. <b>Informal</b>: teaching yourself, learning from family, practice.', bins: [{ id: 'formal', label: 'Formal', icon: '📜' }, { id: 'informal', label: 'Informal', icon: '🏡' }], items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
      if (g) await api.say('rosa', 'Both kinds count on a résumé. Good.'); return g; } },
    { id: 'ex9-id', who: 'jas', after: 3, pay: 500, label: 'Applications and digital identity', ask: 'Can I ask you about applying for jobs?', run: async function (api, seed) { return K.askGrade(await api.ask('jas', ID_QS[seed % ID_QS.length], null)); } },
    { id: 'ex9-rush', who: 'worker', after: 1, pay: RUSH_PAY, label: 'An extra Stall Rush', game: true, ask: 'My niece’s stall is swamped. Can you work the cash box for an hour?', run: async function (api, seed) {
      var r = await api.minigame(rushOpts(api, seed, true)); return K.gameGrade(r); } }
  ];
  var GOSSIP = [
    { id: 'g-pat-0', who: 'vendor', after: -1, lines: ['The teen tables at the Saturday Market are my favourite.', 'Some do great. Some... learn things.'] },
    { id: 'g-avery-0', who: 'avery', after: -1, lines: ['Theo runs a sticker table every Saturday.', 'He says business is easy money. He looks tired, though.'] },
    { id: 'g-gp-0', who: 'grandpa', after: -1, lines: ['I sold worms to fishermen when I was 12.', 'Worms were free. My time wasn’t. Took me a while to figure that out.'] },
    { id: 'g-theo-1', who: 'theo', after: 0, lines: ['Sold 40 stickers today! I’m crushing it.', 'Why is my bank account empty though?'] },
    { id: 'g-sam-1', who: 'sam', after: 0, lines: ['A business plan has three parts people forget: customers, risks and roles.', 'And a fourth they forget even more: fixed costs.'] },
    { id: 'g-theo-2', who: 'theo', after: 1, lines: ['My two helpers quit. They said nobody knew what their job was.', 'I said: everyone does everything! They said: exactly.'] },
    { id: 'g-osei-2', who: 'osei', after: 1, lines: ['RAP lets high school students start an apprenticeship for credits and pay.', 'Sofia from the cabinet shop started that way.'] },
    { id: 'g-lin-3', who: 'librarian', after: 2, lines: ['About 18% of Canadians can hold a conversation in English and French (2021).', 'Our bilingual story time is always full.'] },
    { id: 'g-pat-3', who: 'vendor', after: 2, lines: ['The market manager almost banned Theo from the summer market.', 'Something about his posts online. Ouch.'] },
    { id: 'g-theo-4', who: 'theo', after: 3, lines: ['New rules: count every cost, price for break-even, give everyone a real job, and think before I post.', 'Also, stickers are $4 now. People still buy them!'] },
    { id: 'g-osei-4', who: 'osei', after: 3, lines: ['Every new market stall fills in the {name} Plan now. Costs, break-even, risks, roles.', 'Three new teen stalls opened this month. All in the black!'] }
  ];
  function gossip(S, api) { return K.gossip(GOSSIP, api); }
  function mailTask(seed, last) {
    var k = mailKind(seed, last), from = 'Mr. Osei';
    if (k === 'kind') { var t = kindTask(seed); return { label: 'Town Mail: kinds of experiences', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, wide: true, intro: 'A letter from Mr. Osei: “What kind of experience is each one?”', bins: KINDS, items: t.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) }); } }; }
    if (k === 'be') { var b = beTask(seed); return { label: 'Town Mail: break-even', from: from, pay: 500, run: function (api) { return api.calc({ title: 'Town Mail', name: 'mail', intro: '<p class="ct-small">A letter from Mr. Osei:</p><p>“Fixed cost ' + fmt(b.fixed) + ', cost per item ' + fmt(b.v) + ', price ' + fmt(b.price) + '. Break-even?”</p>', fields: [{ k: 'b', name: 'Break-even (round up)', fmt: nFmt('item'), ans: b.be * 100, alts: [Math.round(b.fixed / b.each * 100)], hint: 'Fixed ÷ (price − cost per item).' }] }); } }; }
    if (k === 'learn') { var l = learnTask(seed); return { label: 'Town Mail: formal or informal', from: from, pay: 500, run: function (api) { return K.sort(api, { title: 'Town Mail', name: 'mail', leave: true, intro: 'A letter from Mr. Osei: “Formal or informal learning?”', bins: [{ id: 'formal', label: 'Formal', icon: '📜' }, { id: 'informal', label: 'Informal', icon: '🏡' }], items: l.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) }); } }; }
    var q = ID_QS[seed % ID_QS.length];
    return { label: 'Town Mail: ' + q.label, from: from, pay: 500, run: async function (api) { await api.say(null, 'A letter from Mr. Osei. He has a question.'); return K.askGrade(await api.ask('osei', q, null)); } };
  }

  function chapterSteps(ch, S, api) {
    var a = [];
    if (ch === 0) {
      a.push(step('meet', async function (api, S) {
        await api.quest('Go to the Community Centre and see Mr. Osei', 'osei');
        await api.say('osei', ['Welcome! This term, the Community Centre runs Youth Ventures: you plan a small stall for the Saturday Market in Town Square.', 'By Grade 9, you can create real experiences. Aiden volunteers at a seniors’ centre. Sofia joined RAP and works in a cabinet shop for credit and pay. Zoe runs a bike repair service.']);
        await K.sort(api, { title: 'What kind of experience?', name: 'kinds', story: true, key: 'q-kinds', label: 'Volunteering, work-integrated learning, or entrepreneurship', ch: 0, wide: true, intro: 'Sort each one.', bins: KINDS, items: KIND_ITEMS.slice(0, 6).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1], why: x[2] }; }) });
        await api.ask('osei', BIZ_QS[2], 'q-try', 'Why try an experience before choosing a program', 0);
      }));
      a.push(step('venture', async function (api, S) {
        await api.say('osei', 'Now your venture. Pick one that connects to careers you’re curious about.');
        var r = await K.pick(api, { id: 'venture', title: 'Our venture', name: 'pickventure', intro: 'Each venture is small, safe and real. (Prices are samples.)', options: VENTURE_KEYS.map(function (k) { var x = VENTURES[k]; return { k: k, title: x.name, icon: x.icon, lines: [['Start-up cost', fmt(x.fixed)], ['Careers it connects to', x.careers]] }; }), reasonPrompt: 'Which career interests does it connect to, and what problem does it solve for customers?' });
        S.venture = r.pick; api.give('Venture card: ' + V(S).name, V(S).icon, 'osei'); api.hud();
      }));
      a.push(step('hunch', async function (api, S) {
        S.story.theoOut = 1; api.refresh();
        await api.quest('Theo is packing up his sticker table in Town Square', 'theo');
        await api.say('theo', ['Hey! Theo. I sell stickers here every Saturday. Business is easy money!', 'Sold 40 today. But my bank account is empty. Every week. Weird, right?']);
        await api.say('you', ['That is weird. I don’t know enough about business numbers yet.', 'Let me learn, and I’ll take a look. I’ll keep notes.']);
        S.story.theo1 = 1; api.give('Venture notes', '🔍', 'theo'); api.refresh();
      }));
      a.push(step('end1', async function (api, S) {
        await api.quest('Tell Mr. Osei about Theo', 'osei');
        await api.say('osei', ['“Easy money” and an empty account. I’ve heard that before.', 'Now do Step 1 of your project: your team’s venture idea.', 'Next time: the numbers. Costs, profit, and break-even.']);
      }));
    }
    if (ch === 1) {
      a.push(step('zoe', async function (api, S) {
        await api.quest('Mr. Osei wants to show you Zoe’s numbers', 'osei');
        await api.say('osei', ['Zoe buys $150 of tools once: a fixed cost. Each tune-up uses $5 of parts: a variable cost. She charges $25.']);
        var g = await api.calc({ title: 'Zoe’s bike business', name: 'zoe', noPay: true, intro: '<p>Fixed: <b>$150</b>. Per tune-up: <b>$5</b>. Price: <b>$25</b>.</p>',
          fields: [{ k: 'e', name: 'Profit per tune-up', ans: ZOE.price - ZOE.v, hint: '$25 − $5.' }, { k: 'b', name: 'Break-even (tune-ups, round up)', fmt: nFmt('tune-up'), ans: 800, alts: [750], hint: '$150 ÷ $20 = 7.5, so…' }, { k: 'p', name: 'Profit after 20 tune-ups', ans: 20 * (ZOE.price - ZOE.v) - ZOE.fixed, hint: '20 × $20 − $150.' }] });
        api.record('q-zoe', 'Zoe’s break-even and profit', 1, g === 'first');
      }));
      a.push(step('mine', async function (api, S) {
        await api.quest('Go home and work out your venture’s numbers', 'table');
        var x = V(S), mid = 1;
        var g = await api.calc({ title: 'My venture: ' + x.name, name: 'mynumbers', noPay: true, ref: ventureHTML(S.venture), refLabel: 'Show my venture', intro: '<p>At the middle price, <b>' + fmt(x.prices[mid]) + '</b> a ' + x.unit + '.</p>',
          fields: [{ k: 'e', name: 'Profit per ' + x.unit, ans: profitEach(S.venture, mid), hint: fmt(x.prices[mid]) + ' − ' + fmt(x.v) + '.' }, { k: 'b', name: 'Break-even (round up)', fmt: nFmt(x.unit), ans: breakEven(S.venture, mid) * 100, alts: [Math.round(x.fixed / profitEach(S.venture, mid) * 100)], hint: fmt(x.fixed) + ' ÷ ' + fmt(profitEach(S.venture, mid)) + ', then round up.' }] });
        api.record('q-mine', 'Break-even for my venture', 1, g === 'first');
        await K.chips(api, { id: 'risks', title: 'Risks', name: 'risks', intro: 'What could go wrong at the market? Pick the risks you’ll plan for.', groups: [{ k: 'r', label: 'Risks', min: 2, max: 4, opts: [{ k: 'rain', label: 'Rain on market day' }, { k: 'unsold', label: 'Not selling enough' }, { k: 'break', label: 'Tools or stock break' }, { k: 'rival', label: 'Another stall sells the same thing' }, { k: 'sick', label: 'A team member is sick' }, { k: 'cash', label: 'Running out of change' }] }], texts: [{ k: 'manage', label: 'How you’ll manage one of them', min: 6 }], saveText: 'Save' });
      }));
      a.push(step('day1', async function (api, S) {
        await api.quest('It’s Market Day! Set up your stall in Town Square.', 'stall');
        await marketDay(api, S, 1);
      }));
      a.push(step('theo2', async function (api, S) { // clue 1: Theo's numbers
        await api.quest('Theo wants you to look at his numbers', 'theo');
        await api.say('theo', ['Okay. I bought a sticker printer for $90. Each sticker costs me $3 in vinyl. I sell them for $2.50. Sold 40 this week!']);
        var g = await api.calc({ title: 'Theo’s sticker table', name: 'theocalc', noPay: true, intro: '<p>Printer: <b>$90</b> (fixed). Vinyl: <b>$3.00</b> a sticker. Price: <b>$2.50</b>. Sold: <b>40</b>.</p>',
          fields: [{ k: 'e', name: 'Profit per sticker (a loss gets a minus)', ans: THEO.price - THEO.v, hint: '$2.50 − $3.00.' }, { k: 't', name: 'Profit or loss for the week, after the printer', ans: THEO.sold * (THEO.price - THEO.v) - THEO.fixed, hint: '40 × (−$0.50) − $90.' }] });
        api.record('story-theo', 'Theo’s numbers: profit per sticker and for the week', 1, g === 'first');
        await api.say('you', ['Theo, every sticker loses 50 cents. And you never counted the printer.', 'The more you sell, the more you lose. You can never break even at $2.50.']);
        await api.say('theo', 'I priced them cheap so everyone would buy. Everyone did. Oh no.');
        S.story.theo2 = 1; api.toast('Added to your Venture notes: Theo’s numbers'); api.save();
      }));
      a.push(step('end2', async function (api, S) {
        await api.quest('Check in with Mr. Osei', 'osei');
        await api.say('osei', ['Now do Step 2 of your project: costs, price, break-even and risks.', 'Next time: skills. Who does what in a venture?']);
      }));
    }
    if (ch === 2) {
      a.push(step('skills', async function (api, S) {
        await api.quest('Mr. Osei wants to talk about skills', 'osei');
        await api.say('osei', ['Skills come from formal learning (courses, training, certificates) and informal learning (teaching yourself, family, practice).', 'Sofia learned measuring and safety in RAP (formal) and fixing furniture from her grandfather (informal). She also speaks English and French.']);
        await K.sort(api, { title: 'Formal or informal?', name: 'learn', story: true, key: 'q-learn', label: 'Formal or informal learning', ch: 2, intro: 'Where was each skill learned?', bins: [{ id: 'formal', label: 'Formal', icon: '📜' }, { id: 'informal', label: 'Informal', icon: '🏡' }], items: LEARN.slice(0, 6).map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
        await K.sort(api, { title: 'Job-specific or employability?', name: 'skillkind', story: true, key: 'q-skillkind', label: 'Job-specific or employability skills', ch: 2, intro: '<b>Job-specific</b>: mostly for one kind of job. <b>Employability</b>: helps in almost any job.', bins: [{ id: 'job', label: 'Job-specific', icon: '🔧' }, { id: 'emp', label: 'Employability', icon: '🧳' }], items: SKILLKIND.map(function (x, i) { return { id: 'i' + i, text: x[0], bin: x[1] }; }) });
        await api.ask('osei', { text: 'About 18% of Canadians can hold a conversation in English and French (2021 Census). In a class of 30, about how many is that?', opts: [['About 5 students (18% of 30 is 5.4).', 1, 'Right: 0.18 × 30 = 5.4.'], ['About 18 students.', 0, '18% isn’t 18 people. It’s 18 out of every 100.'], ['About 2 students.', 0, '0.18 × 30 = 5.4.']] }, 'q-bilingual', 'Bilingualism: 18% of 30', 2);
      }));
      a.push(step('roles', async function (api, S) {
        await api.quest('Go home and plan the roles for your venture', 'table');
        await K.chips(api, { id: 'roles', title: 'Roles for our venture', name: 'roles', intro: 'Every venture needs clear roles. Pick the ones yours needs.', groups: [{ k: 'r', label: 'Roles', min: 3, max: 5, opts: [{ k: 'lead', label: 'Leader' }, { k: 'money', label: 'Money person (cash box and records)' }, { k: 'maker', label: 'Maker (builds or grows the product)' }, { k: 'sales', label: 'Salesperson (talks to customers)' }, { k: 'design', label: 'Designer (signs and posts)' }, { k: 'safety', label: 'Safety and rules checker' }] }], texts: [{ k: 'lang', label: 'Would another language help your venture? Why?', min: 6 }], saveText: 'Save our roles' });
      }));
      a.push(step('rules', async function (api, S) { // clue 2 and the source: Theo's Rules
        await api.quest('Theo’s helpers quit. Go see him in Town Square.', 'theo');
        await api.say('theo', ['My helpers quit. They said nobody knew whose job anything was.', 'I run everything by my rules. Here, look. I wrote them down.']);
        await K.inspect(api, { title: 'Theo’s Rules', name: 'theorules', story: true, key: 'story-rules', label: 'Theo’s Rules: find the ones that sink a venture', ch: 2, find: 'Find the 4 rules that sink his business', cols: 3,
          intro: 'Tap every rule that would make a venture fail.',
          spots: [{ id: 'cost', icon: '🖨️', label: 'Rule 1: “If I already bought it, it doesn’t count as a cost.”', bad: true, why: 'Fixed costs count. You have to earn them back.', hint: 'What about the printer?' }, { id: 'cheap', icon: '🏷️', label: 'Rule 2: “Cheapest price wins.”', bad: true, why: 'A price below cost loses money on every sale.' },
            { id: 'roles', icon: '🤷', label: 'Rule 3: “Everyone does every job.”', bad: true, why: 'Without clear roles, things get missed and helpers quit.' }, { id: 'posts', icon: '📱', label: 'Rule 4: “My posts are private. Nobody checks.”', bad: true, why: 'Employers and organizers often search your name.' },
            { id: 'smile', icon: '🙂', label: 'Rule 5: “Smile at every customer.”', fine: 'Great rule, honestly.' }, { id: 'count', icon: '🧮', label: 'Rule 6: “Count the cash box at the end of the day.”', fine: 'A good habit.' }] });
        await api.say('theo', ['Rule 4... The market manager emailed me. She found my posts. I might lose my summer spot.']);
        S.story.rules = 1; api.toast('Added to your Venture notes: Theo’s Rules'); api.save();
      }));
      a.push(step('end3', async function (api, S) {
        await api.quest('Tell Mr. Osei about Theo’s Rules', 'osei');
        await api.say('osei', ['Four rules that sink a venture. Theo isn’t alone. Lots of new businesses think that way.', 'Now do Step 3 of your project: the roles and skills your venture needs.', 'Next time: applying for a role, and your digital identity. Then the pitch panel.']);
      }));
    }
    if (ch === 3) {
      a.push(step('apply', async function (api, S) {
        await api.quest('Mr. Osei wants to talk about applying for a role', 'osei');
        await api.say('osei', ['Aiden applied for a summer job at a care home: a résumé, a cover letter, and an online application.', 'Before the interview, the manager searched his name. That’s his digital identity.']);
        await api.ask('osei', ID_QS[0], 'q-private', '“My posts are private”', 3);
        await K.typed(api, { id: 'cover', title: 'My short cover letter', prompt: 'Apply for a role in your venture. 3 to 5 sentences: the role, why you fit, and thank you.', min: 40, rows: 5 });
      }));
      a.push(step('profile', async function (api, S) { // clue 3: Theo's digital identity
        await api.quest('Help Theo clean up his online profile', 'theo');
        await K.inspect(api, { title: 'Theo’s public profile', name: 'profile', story: true, key: 'story-profile', label: 'Theo’s profile: what an organizer would see', ch: 3, find: 'Find the 4 things to fix', cols: 3,
          intro: 'The market manager searched Theo’s name. Tap everything he should fix.',
          spots: [{ id: 'rude', icon: '😬', label: 'Post: “The Saturday Market is for losers lol”', bad: true, why: 'Rude about the very market he wants a spot at.' }, { id: 'email', icon: '📧', label: 'Contact: stickerlord420@mail.com', bad: true, why: 'Unprofessional email.' },
            { id: 'home', icon: '🏠', label: 'His home address, posted publicly', bad: true, why: 'Personal information should stay private, for safety.' }, { id: 'setting', icon: '🔓', label: 'Account setting: everything public', bad: true, why: 'Set accounts to private.' },
            { id: 'stickers', icon: '🎨', label: 'Photos of his sticker designs', fine: 'That’s a portfolio! Keep it.' }, { id: 'vol', icon: '🙌', label: 'A post about helping at the food bank', fine: 'That helps his digital identity.' }] });
        await api.say('theo', ['Private account. New email. Deleted the market post, and my address.', 'And I wrote the manager an apology. A real one.']);
        S.story.profile = 1; api.save();
      }));
      a.push(step('day2', async function (api, S) {
        await api.quest('Market Day 2! Your stall is ready in Town Square.', 'stall');
        await marketDay(api, S, 2);
        var o = outcome(S.venture, S.days); S.win = o.win; api.save(); api.hud();
        await api.say('you', o.win ? ['After both days: ' + fmt(o.profit) + ' profit, after every cost. We beat our goal of ' + fmtW(V(S).target) + '!'] : o.brokeEven ? ['After both days: ' + fmt(o.profit) + ' profit. We broke even, but missed our goal of ' + fmtW(V(S).target) + '.'] : ['After both days, we’re at ' + fmt(o.profit) + '. We didn’t break even yet.']);
      }));
      a.push(step('panel', async function (api, S) { // the hero beat: the pitch panel
        S.scene = 'panel'; api.refresh();
        await api.quest('The pitch panel is meeting at the Community Centre', 'osei');
        api.fx.face('all');
        await api.say('osei', ['Welcome to the Youth Ventures pitch panel! Today: a venture with real numbers, and a comeback.']);
        await api.ask('mgr', { text: 'Your break-even. How did you work it out?', opts: [['Fixed costs divided by profit per item: price minus the cost of each one.', 1, 'Exactly how I’d do it.'], ['Price times customers.', 0, 'That’s sales. Break-even needs costs.'], ['We guessed.', 0, 'Guessing is how stalls close.']] }, 'q-panel-be', 'Pitch panel: break-even', 3);
        await api.ask('sam', { text: 'Why not just charge the lowest price, so everyone buys?', opts: [['If the price is below cost, every sale loses money. We picked a price that breaks even sooner and still brings customers.', 1, 'That’s a trade-off, well made.'], ['Lowest price always wins.', 0, 'That was Theo’s Rule 2.'], ['Price doesn’t matter.', 0, 'It changes profit and customers.']] }, 'q-panel-price', 'Pitch panel: pricing', 3);
        await api.say('theo', ['Can I pitch too? New prices: $4 a sticker. I count the printer. Two helpers, two real jobs. And my profile is fixed.', 'I learned all of that from ' + api.profile.name + '.']);
        await api.say('mgr', ['Theo, your spot at the summer market is yours again. And I want every new stall to plan like this.']);
        S.story.panel = 1; api.save();
        await K.hero(api, { who: 'osei', lines: ['From now on, every new market stall fills in one page before opening day: costs, break-even, risks and roles.', 'It’s ' + api.profile.name + '’s plan. So it’s the ' + api.profile.name + ' Plan.'],
          medal: 'Pitch It medal', icon: '🏪', kicker: 'Pitch panel', title: 'The ' + api.profile.name + ' Plan', thanks: [['theo', 'First week with real prices: I made money! Actual money!']], reply: ['Thanks! Count every cost. Then go sell.'] });
        S.story.hero = 1; S.scene = null; api.refresh();
      }));
      a.push(step('finale', async function (api, S) {
        await api.quest('Go home and pin your venture to your My Plan wall', 'myplan');
        var x = V(S), o = outcome(S.venture, S.days), firstTime = !S.finished; S.finished = true;
        if (firstTime) api.profileAdd('closet', 'stall');
        api.profileAdd('plan', { mission: '9-experiences', title: 'Pitch It', text: x.name + ': ' + fmt(o.profit) + ' profit after costs over two market days. Careers it connects to: ' + x.careers + '.' });
        api.profileAdd('finished', '9-experiences'); api.refresh();
        await api.say('osei', [S.win ? 'Goal reached, and a plan named after you!' : 'A plan named after you! Next time, reach your stall’s goal too. You can replay this chapter from the Menu.', 'Your closet has a new Market stall apron, and your My Plan wall has a new page.', 'Now do Step 4 of your project: apply for a role, and check your digital identity.', 'Show your teacher your report: Menu, then Report for my teacher.']);
      }));
    }
    return a;
  }

  T.mission({
    id: '9-experiences', unitLabel: 'CEFL Grade 9 · Experiences and Employment · Project: Pitch It', title: 'Pitch It: Theo’s Rules',
    iCan: 'I can plan a small venture with costs, break-even and risks, name the skills it needs, and prepare an application and my digital identity.',
    foot: 'This is a model. Venture prices and customers are samples. Bilingualism (2021 Census) and RAP are real. The people are made up.',
    bagTip: 'Your Bag holds what you collect: your venture card and your Venture notes.',
    realRule: 'Real gives no hints while you work the numbers', afterLine: 'Mission complete. Open Menu → Report to show your teacher.',
    chapters: [
      { name: 'Experiences that open doors', step: 'Step 1', moment: 'Moment 1: experiences that open doors' },
      { name: 'The numbers', step: 'Step 2', moment: 'Moment 2: a simple business plan' },
      { name: 'Skills and roles', step: 'Step 3', moment: 'Moment 3: formal, informal and transferable skills' },
      { name: 'Apply for a role', step: 'Step 4', moment: 'Moment 4: cover letters and digital identity' }
    ],
    init: init, validate: validate, chapterSteps: chapterSteps, guide: 'osei',
    helpers: function () { return HELPS; }, gossip: gossip, mail: function (S, seed, last) { return mailTask(seed, last); },
    outfit: function (S) { return S.finished ? 'stall' : 'none'; },
    placeObjects: function (api, S) { api.place('table', 'home', 4, 3, { label: 'Kitchen table' }); api.place('myplan', 'home', 6, 1, { label: 'My Plan wall', noRug: true }); api.place('stall', 'town', 54, 32, { tile: T.world.K.crate[1], label: 'Your market stall' }); },
    people: function (S) {
      var out = {}, s = S.story;
      out.osei = { name: 'Mr. Osei', role: 'Youth Ventures', map: 'community', x: 4, y: 3, dir: 'down', look: { base: 2, skin: 's5', hair: 'black', shirt: 'green', pants: '#2f3a5c' } };
      out.theo = { name: 'Theo', role: 'Sticker seller', map: 'town', x: 54, y: 34, dir: 'up', look: { base: 0, skin: 's2', hair: 'blue', shirt: 'orange', pants: '#2f2f38' }, hidden: !s.theoOut };
      out.mgr = { name: 'Ms. Dubois', role: 'Market manager', map: 'community', x: 6, y: 3, dir: 'down', look: { base: 3, skin: 's4', hair: 'grey', shirt: 'purple', pants: '#3b3f5c' }, hidden: S.scene !== 'panel' };
      if (S.scene === 'panel') { out.theo = { name: 'Theo', role: 'Sticker seller', map: 'community', x: 2, y: 3, dir: 'down', look: out.theo.look }; out.sam = { map: 'community', x: 7, y: 3, dir: 'down' }; }
      return out;
    },
    doorOpen: function (id) { return !!{ home: 1, grandpa: 1, community: 1, bank: 1, library: 1, jobcentre: 1, servicecanada: 1 }[id]; },
    lockedLine: function (id) { return T.world.building(id).name + ' is closed today. It’s market day!'; },
    talk: function (id, S, api) {
      var s = S.story, done = S.finished;
      var lines = {
        osei: done ? 'Count every cost. Then go sell.' : 'Your next goal is on the gold line at the top.',
        theo: s.hero ? 'Stickers are $4 now. I count the printer. I MAKE money!' : s.profile ? 'Profile fixed. Apology sent. Fingers crossed.' : s.rules ? 'My rules sank me. All four of them.' : s.theo2 ? 'Every sticker loses 50 cents. The more I sell, the more I lose.' : 'Business is easy money!',
        stall: S.venture ? 'Your ' + V(S).name.toLowerCase() + ' stall. ' + (S.days.length ? 'Profit so far: ' + fmt(totalProfit(S.venture, S.days)) + '.' : 'Ready for market day.') : 'An empty market table.',
        mgr: 'Every stall needs a plan. Every one.', sam: 'Fixed costs: the part of the plan everyone forgets.',
        avery: 'Theo’s stickers are cool. Are they $4 now? Worth it.', grandpa: 'Worms were free. My time wasn’t.', table: 'The kitchen table. Good for business plans.',
        myplan: K.planLine(api)
      };
      return lines[id] || null;
    },
    hud: function (S) {
      if (!S.venture) return [{ label: 'Venture', value: '—' }];
      var x = V(S), out = [{ label: 'Venture', value: x.name }];
      if (S.days.length) out.push({ label: 'Profit', value: fmt(totalProfit(S.venture, S.days)) + ' / ' + fmtW(x.target), warn: totalProfit(S.venture, S.days) < 0, title: 'After the start-up cost. Goal: ' + fmtW(x.target) });
      return out;
    },
    items: function (S) {
      var it = [];
      if (S.venture) it.push({ name: 'Venture card: ' + V(S).name, icon: V(S).icon, note: 'Costs, prices and goal', view: function () { return ventureHTML(S.venture) + (S.days.length ? K.table(S.days.map(function (d, i) { return ['Market Day ' + (i + 1), fmt(V(S).prices[d.pi]), String(d.served), fmt(d.profit)]; }), ['Day', 'Price', 'Served', 'Profit']) + '<p>After the ' + esc(V(S).fixedName.toLowerCase()) + ': <b>' + fmt(totalProfit(S.venture, S.days)) + '</b>.</p>' : ''); } });
      if (S.story.theo1) it.push({ name: 'Venture notes', icon: '🔍', note: 'Theo’s Rules', view: function () { return K.notes(notes(S)); } });
      if (S.story.hero) it.push({ name: 'Pitch It medal', icon: '🏪', note: 'The ' + T.api.profile.name + ' Plan', view: function () { return '<p style="font-size:2.4rem;margin:0;text-align:center" aria-hidden="true">🏪</p><p style="text-align:center"><b>Pitch It</b><br>Costs, break-even, risks and roles.</p>'; } });
      return it;
    },
    report: function (S) {
      if (!S.venture) return '<p>Not started yet.</p>';
      var x = V(S), h = '<p>Venture: <b>' + esc(x.name) + '</b>' + (S.days.length === 2 ? ' · Profit after costs: <b>' + fmt(totalProfit(S.venture, S.days)) + '</b> (' + (S.win ? 'goal reached' : 'goal not reached') + ')' : '') + '</p>';
      if (S.days.length) h += K.table(S.days.map(function (d, i) { return ['Market Day ' + (i + 1), fmt(x.prices[d.pi]), String(d.served), K.TIER_WORD[d.tier], fmt(d.profit)]; }), ['Day', 'Price', 'Served', 'Stall Rush', 'Profit']);
      h += K.wrote(S, [['venture', 'Our venture', function (k) { return VENTURES[k].name; }], ['cover', 'My cover letter']]);
      if (S.typed.risks) h += '<p><b>Risks:</b> ' + esc((S.typed.risks.r || []).join(', ')) + '. <b>Managing one:</b> ' + esc(S.typed.risks.manage || '') + '</p>';
      h += '<h3>Theo’s Rules</h3><p>' + (S.story.hero ? 'Solved: Theo pitched a real plan and got his market spot back, and the new-stall plan was named after them.' : S.story.rules ? 'Found Theo’s Rules.' : S.story.theo1 ? 'Collecting clues.' : 'Not started.') + '</p>';
      return h;
    },
    test: { scenes: [null, { story: { theoOut: 1 } }, { scene: 'panel', story: { theoOut: 1 } }], VENTURES: VENTURES, profitEach: profitEach, breakEven: breakEven, servedOf: servedOf, dayResult: dayResult, totalProfit: totalProfit, outcome: outcome, THEO: THEO, GAME_CFGS: GAME_CFGS, beTask: beTask, kindTask: kindTask, learnTask: learnTask, mailTask: mailTask, HELPS: HELPS, GOSSIP: GOSSIP }
  });
  function notes(S) {
    var s = S.story, li = [];
    if (s.theo1) li.push('<b>Theo:</b> sells 40 stickers a week, but his bank account is always empty. “Business is easy money!”');
    if (s.theo2) li.push('<b>Theo’s numbers:</b> a $90 printer, $3.00 of vinyl per sticker, sold at $2.50. Every sale loses 50 cents, and the printer was never counted.');
    if (s.rules) li.push('<b>Theo’s Rules:</b> own it = no cost; cheapest wins; everyone does every job; posts are private. His helpers quit.');
    if (s.profile) li.push('<b>Theo’s profile:</b> a rude post about the market, an unprofessional email, his home address in public. Fixed, with an apology.');
    if (s.hero) li.push('<b>The ' + esc(T.api.profile.name) + ' Plan:</b> costs, break-even, risks and roles, for every new stall.');
    return li;
  }
})();
