<script>
// Screenshots: #gen=<story type> forces one story type; a wrong try picks the item's first misconception.
(() => {
  const g = new URLSearchParams(location.hash.slice(1)).get('gen');
  if (g) { const all = []; for (const t in MODEL.TOPICS) for (const l in MODEL.TOPICS[t]) all.push(...MODEL.TOPICS[t][l].map(f => [t, f])); const f = all.find(x => x[1].name === g); if (f) MODEL.gen = () => Object.assign(f[1](), { unit: f[0] }); }
  window.WRONG = (t, it) => ({ v: 'e0' });
})();
</script>
<script>
// Science word problems: every story type, 300 items each.
window.EXTRA = ok => {
  const M = MODEL, words = s => String(s).replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  const text = s => String(s).replace(/<[^>]*>/g, '');
  const SECS = { eco: 6, pla: 6, hea: 6, str: 6, ear: 6 };
  for (const tp in M.TOPICS) for (const lv in M.TOPICS[tp]) M.TOPICS[tp][lv].forEach(g => {
    const bad = []; let it;
    for (let i = 0; i < 300 && bad.length < 3; i++) {
      try { it = g(); } catch (e) { bad.push('gen ' + e.message); continue; }
      const fail = m => bad.push(m + ' ' + JSON.stringify(it).slice(0, 160));
      if (it.lvl !== +lv) fail('level');
      if (!/^7-[1-5]-0[1-6]$/.test(it.code) || it.code[2] !== String(Object.keys(M.TOPICS).indexOf(tp) + 1)) fail('LO code ' + it.code);
      if (!(it.sec >= 1 && it.sec <= SECS[tp])) fail('notes section ' + it.sec);
      if (!M.check(it, { v: 'a' }).ok) fail('Show me answer fails');
      if (it.steps.length !== +lv) fail('steps ≠ level');
      if (text(it.story).length > 175) fail('story ' + text(it.story).length + ' chars');
      if (words(it.q) > 4) fail('label over 4 words: ' + it.q);
      if (it.opts.length < 2 || it.opts.length > 4) fail('choice count');
      const ts = it.opts.map(o => o.t); if (new Set(ts).size !== ts.length) fail('repeated choice');
      ts.forEach(t => { if (t.length > 32) fail('choice long: ' + t); });
      it.steps.forEach(s => { if (s.l.length > 17) fail('step label long: ' + s.l); if (s.m.length > 58) fail('step long: ' + s.m); });
      it.errs.forEach((e, k) => {
        if (words(e.cue) > 6) fail('cue over 6 words: ' + e.cue);
        if (!(e.s >= 0 && e.s < it.steps.length)) fail('mistake step out of range');
        const r = M.check(it, { v: 'e' + k });
        if (r.ok || r.cue !== e.cue) fail('misconception not named: ' + e.t);
      });
    }
    ok(bad.length === 0, tp + ' L' + lv + ' ' + g.name + ': answers, misconceptions and lengths ' + bad.join(' | ').slice(0, 300));
  });
  // A round ramps: items 1–3 one step, 4–7 two steps, 8–10 three.
  const lv = [...Array(10)].map((_, n) => M.gen('eco', n).lvl).join('');
  ok(lv === '1112222333', 'round ramps 1-1-1-2-2-2-2-3-3-3: ' + lv);
  ok(M.check(M.gen('hea', 0), { v: null }).code === 'other', 'no choice is not accepted');
  // Every story type has a named misconception, and the right answer is not always in the same place.
  for (const tp in M.TOPICS) for (const l in M.TOPICS[tp]) M.TOPICS[tp][l].forEach(g => {
    const pos = new Set(); let n = 0;
    for (let i = 0; i < 60; i++) { const it = g(); n = Math.max(n, it.errs.length); pos.add(it.opts.findIndex(o => o.v === 'a')); }
    ok(n > 0 && pos.size > 1, g.name + ' has a misconception and a moving answer');
  });
  // Opposite answers on the same object (rule 27): these story types give both answers.
  [['eco', 'ecoWeb'], ['hea', 'heFlow'], ['hea', 'heExpand'], ['pla', 'plVessel'], ['pla', 'plRepro'], ['pla', 'plPollin'], ['str', 'stBeam'], ['ear', 'erFossil'], ['ear', 'erCrystal']].forEach(([tp, nm]) => {
    const g = [].concat(...Object.values(M.TOPICS[tp])).find(f => f.name === nm), seen = new Set();
    for (let i = 0; i < 200; i++) { const it = g(); seen.add(it.a + '|' + it.q); }
    ok(seen.size > 1, nm + ' gives more than one answer');
  });
  // Mixed draws from every unit; each item's 📖 points at its own unit's notes.
  const units = new Set(); for (let i = 0; i < 200; i++) units.add(M.genMix(i % 10).unit);
  ok(units.size === 5, 'Mixed draws from all five units');
  const T = PAGE.tabs.find(t => t.id === 'mix'), it = M.gen('ear', 8);
  ok(/planet-earth/.test(T.link(it).notes) && T.link(it).sec === it.sec, 'Mixed links an Earth item to the Earth notes');
};
</script>
