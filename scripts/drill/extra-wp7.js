<script>
// Screenshots: #gen=<story type> forces one story type; #step=<n> walks the item to step n (0 facts, 1 idea, 2 assume…),
// with #slip=1 taking a wrong pick on the way. A wrong try picks the item's first misconception.
(() => {
  const h = new URLSearchParams(location.hash.slice(1)), g = h.get('gen');
  if (g) { const all = []; for (const t in MODEL.TOPICS) for (const l in MODEL.TOPICS[t]) all.push(...MODEL.TOPICS[t][l].map(f => [t, f])); const f = all.find(x => x[1].name === g); if (f) MODEL.gen = () => { const it = f[1](); it.unit = f[0]; return MODEL.reading(it); }; }
  window.WRONG = () => ({ v: 'e0', done: true });
  window.WALK = () => {
    const n = +(h.get('step') || 0), D = window.DRILL, it = D.state().item, r = D.state().resp, ans = document.getElementById('ans');
    if (h.get('pick')) { r.sel = it.read.p.map((c, k) => c.k !== 'opt' && k % 2 ? k : -1).filter(k => k >= 0); D.setResp({}); }
    for (let i = 0; i < n; i++) {
      if (i === 0) { r.sel = it.read.p.map((c, k) => c.k === 'must' ? k : -1).filter(k => k >= 0); ans.querySelector('.factsBtn').click(); }
      else { const v = h.get('slip') && i === 1 ? 'e0' : 'a'; ans.querySelector('.choice[data-v="' + v + '"]').click(); }
    }
  };
  if (h.get('step') || h.get('pick')) addEventListener('load', () => setTimeout(WALK, 0));
})();
</script>
<script>
// Science word problems, v2 reading: every story type, 300 items each.
window.EXTRA = ok => {
  const M = MODEL, words = s => String(s).replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  const text = s => String(s).replace(/<[^>]*>/g, '');
  const NEAR = [['flow', 'ten'], ['web', 'change'], ['div', 'recover'], ['chain', 'photo'], ['photo', 'mass'], ['poll', 'repro'], ['cond', 'mode'], ['cond', 'flow'], ['cond', 'insul'], ['flow', 'insul'], ['amount', 'cap'], ['stab', 'design'], ['design', 'mat'], ['design', 'beam'], ['beam', 'force'], ['mat', 'force'], ['cycle', 'rock'], ['cycle', 'surf'], ['crys', 'rock'], ['uplift', 'bound'], ['form', 'surf'], ['quake', 'bound']];
  for (const tp in M.TOPICS) for (const lv in M.TOPICS[tp]) M.TOPICS[tp][lv].forEach(g => {
    const bad = []; let it;
    for (let i = 0; i < 300 && bad.length < 3; i++) {
      try { it = g(); it.unit = tp; M.reading(it); } catch (e) { bad.push('gen ' + e.message); continue; }
      const fail = m => bad.push(m + ' ' + JSON.stringify(it.read || it).slice(0, 160));
      const R = it.read, P = R.p;
      if (it.lvl !== +lv) fail('level');
      if (!/^7-[1-5]-0[1-6]$/.test(it.code) || it.code[2] !== String(Object.keys(M.TOPICS).indexOf(tp) + 1)) fail('LO code ' + it.code);
      if (!(it.sec >= 1 && it.sec <= 6)) fail('notes section ' + it.sec);
      if (it.steps.length !== +lv) fail('reasoning chain ≠ level');
      // the reading
      const len = P.reduce((a, c) => a + c.t.length + 1, 0) + R.ask.length, nWords = words(P.map(c => c.t).join(' ') + ' ' + R.ask);
      if (len > 700) fail('passage ' + len + ' chars');
      if (nWords < 45) fail('passage only ' + nWords + ' words');
      if (!P.some(c => c.k === 'must')) fail('no key fact');
      if (P.filter(c => c.k === 'no').length < 2) fail('fewer than two details to skip');
      if (P.some(c => /<|>/.test(c.t))) fail('markup in passage');
      if (new Set(P.map(c => c.t)).size !== P.length) fail('repeated sentence');
      if (!/\?$/.test(R.ask)) fail('question has no ?');
      // key facts: the musts pass; a red herring or a missing must fails
      const must = P.map((c, k) => c.k === 'must' ? k : -1).filter(k => k >= 0), no = P.findIndex(c => c.k === 'no');
      if (!M.checkFacts(it, must).ok) fail('key facts fail');
      if (!M.checkFacts(it, must.concat(P.map((c, k) => c.k === 'opt' ? k : -1).filter(k => k >= 0))).ok) fail('optional sentence counted wrong');
      if (M.checkFacts(it, must.concat([no])).ok) fail('red herring accepted');
      if (M.checkFacts(it, must.slice(1)).ok) fail('missing key fact accepted');
      // idea and assume
      const steps = [['idea', R.idea]].concat(R.assume ? [['assume', R.assume]] : []);
      if (+lv > 1 && !R.assume) fail('no assumption step');
      if (+lv === 1 && R.assume) fail('Level 1 has an assumption');
      steps.forEach(([nm, s]) => {
        if (s.opts.length !== 3 || new Set(s.opts.map(o => o.t)).size !== 3) fail(nm + ' choices');
        if (!M.checkPick(s, 'a').ok) fail(nm + ' right pick fails');
        s.errs.forEach((e, k) => { const r = M.checkPick(s, 'e' + k); if (r.ok || words(r.cue) > 6) fail(nm + ' wrong pick or cue: ' + r.cue); });
        s.opts.forEach(o => { if (o.t.length > 40) fail(nm + ' choice long: ' + o.t); });
      });
      const ideaKey = k => { for (const u in M.IDEAS) for (const id in M.IDEAS[u]) if (M.IDEAS[u][id][0] === k) return id; };
      const ri = M.READ[it.t].idea; R.idea.errs.forEach(e => { const w = ideaKey(e.t); if (NEAR.some(([x, y]) => (x === ri && y === w) || (x === w && y === ri))) fail('close idea offered: ' + e.t); });
      // the answer
      if (!M.check(it, { v: 'a', done: true }).ok || M.check(it, { v: 'a', done: true }).partial) fail('Show me answer fails');
      if (!M.check(it, { v: 'a', done: true, miss: 1 }).partial) fail('slip not partial');
      if (words(it.q) > 4) fail('label over 4 words: ' + it.q);
      const ts = it.opts.map(o => o.t); if (new Set(ts).size !== ts.length) fail('repeated choice');
      ts.forEach(t => { if (t.length > 32) fail('choice long: ' + t); });
      it.steps.forEach(s => { if (s.l.length > 17) fail('step label long: ' + s.l); if (s.m.length > 58) fail('step long: ' + s.m); });
      it.errs.forEach((e, k) => {
        if (words(e.cue) > 6) fail('cue over 6 words: ' + e.cue);
        if (!(e.s >= 0 && e.s < it.steps.length)) fail('mistake step out of range');
        const r = M.check(it, { v: 'e' + k, done: true });
        if (r.ok || r.cue !== e.cue) fail('misconception not named: ' + e.t);
      });
    }
    ok(bad.length === 0, tp + ' L' + lv + ' ' + g.name + ': reading, steps and answer ' + bad.join(' | ').slice(0, 300));
  });
  ok(Object.keys(M.READ).length === [].concat(...Object.values(M.TOPICS).map(t => [].concat(...Object.values(t)))).length, 'every story type has reading data');
  const lv = [...Array(10)].map((_, n) => M.gen('eco', n).lvl).join('');
  ok(lv === '1112222333', 'round ramps 1-1-1-2-2-2-2-3-3-3: ' + lv);
  // The steps through the UI: tap the key facts, pick the idea (and assumption), answer.
  const D = window.DRILL, ans = document.getElementById('ans'), walk = (slip, factsWrong) => {
    const it = D.state().item, r = D.state().resp, P = it.read.p, must = P.map((c, k) => c.k === 'must' ? k : -1).filter(k => k >= 0);
    if (factsWrong) { r.sel = [P.findIndex(c => c.k === 'no')]; ans.querySelector('.factsBtn').click(); ans.querySelector('.factsBtn').click(); }
    else { r.sel = must; ans.querySelector('.factsBtn').click(); }
    const n = it.read.assume ? 2 : 1;
    for (let i = 0; i < n; i++) ans.querySelector('.choice[data-v="' + (slip && i === 0 ? 'e0' : 'a') + '"]').click();
    ans.querySelector('.choice[data-v="a"]').click();
    return D.state();
  };
  D.setTab('hea'); let s = walk(false);
  ok(s.resolved && s.marks.slice(-1)[0] === 'g', 'clean walk through the steps: green ' + s.marks.join(''));
  D.check(); s = walk(true);
  ok(s.resolved && s.marks.slice(-1)[0] === 'y', 'a wrong idea, then the right answer: yellow ' + s.marks.join(''));
  D.check(); s = walk(false, true);
  ok(s.resolved && s.marks.slice(-1)[0] === 'y' && s.resp.facts === 'shown', 'key facts missed twice, shown, then right: yellow');
  D.check(); { const it = D.state().item; D.state().resp.sel = it.read.p.map((c, k) => c.k === 'must' ? k : -1).filter(k => k >= 0); ans.querySelector('.factsBtn').click();
    for (let i = 0; i < (it.read.assume ? 2 : 1); i++) ans.querySelector('.choice[data-v="a"]').click();
    ans.querySelector('.choice[data-v="e0"]').click(); const a = D.state(); ans.querySelector('.choice[data-v="a"]').click(); const b = D.state();
    ok(!a.resolved && a.phase === 'wrong' && b.resolved && b.marks.slice(-1)[0] === 'y', 'a wrong answer, then right: yellow'); }
  D.check(); D.show(); s = D.state();
  ok(s.resolved && s.marks.slice(-1)[0] === 'r' && ans.querySelector('.choice.ok'), 'Show me on the first step: red, answer shown');
  // Mixed draws from every unit; each item's 📖 points at its own unit's notes.
  const units = new Set(); for (let i = 0; i < 200; i++) units.add(M.genMix(i % 10).unit);
  ok(units.size === 5, 'Mixed draws from all five units');
  const T = PAGE.tabs.find(t => t.id === 'mix'), it = M.gen('ear', 8);
  ok(/planet-earth/.test(T.link(it).notes) && T.link(it).sec === it.sec, 'Mixed links an Earth item to the Earth notes');
};
</script>
