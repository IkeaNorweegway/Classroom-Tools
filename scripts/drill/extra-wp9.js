<script>
// Screenshots: #gen=<story type> forces one story type; a wrong try uses the item's first named mistake.
(() => {
  const g = new URLSearchParams(location.hash.slice(1)).get('gen');
  if (g) { const all = []; for (const t in MODEL.TOPICS) for (const l in MODEL.TOPICS[t]) all.push(...MODEL.TOPICS[t][l]); const f = all.find(x => x.name === g); if (f) MODEL.gen = () => f(); }
  window.WRONG = (t, it) => !it.errs || !it.errs.length ? null : it.poly ? MODEL.resp(it, it.errs[0].v) : { v: String(Math.round(it.errs[0].v * 1e6) / 1e6) };
})();
</script>
<script>
// Word problems: every story type, 300 items each.
window.EXTRA = ok => {
  const M = MODEL, words = s => String(s).replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  const text = s => String(s).replace(/<[^>]*>/g, '');
  for (const tp in M.TOPICS) for (const lv in M.TOPICS[tp]) M.TOPICS[tp][lv].forEach(g => {
    const bad = []; let it;
    for (let i = 0; i < 300 && bad.length < 3; i++) {
      try { it = g(); } catch (e) { bad.push('gen ' + e.message); continue; }
      const fail = m => bad.push(m + ' ' + JSON.stringify(it).slice(0, 160));
      if (it.poly ? ![0, 1, 2].every(e => isFinite(it.poly[e] || 0)) : !isFinite(it.v)) fail('answer not a number');
      if (it.lvl !== +lv) fail('level');
      if (!M.check(it, it.poly ? M.resp(it, it.poly) : { v: Q.parse(it.ans) }).ok) fail('Show me answer fails');
      if (it.poly && it.deg === 1 && it.poly[2]) fail('x² answer with no x² box');
      if (it.steps.length < +lv) fail('fewer steps than its level');
      if (text(it.story).length > 175) fail('story ' + text(it.story).length + ' chars');
      if (words(it.q) > 4) fail('label over 4 words');
      if (words(it.cue) > 6) fail('cue over 6 words');
      it.steps.forEach(s => { if (s.l.length > 19) fail('step label long: ' + s.l); if (s.m.length > 50) fail('step working long: ' + s.m); });
      it.errs.forEach((e, k) => {
        if (words(e.cue) > 6) fail('mistake cue over 6 words: ' + e.cue);
        if (!(e.s >= 0 && e.s < it.steps.length)) fail('mistake step out of range');
        const r = M.check(it, it.poly ? M.resp(it, e.v) : { v: Q.parse(String(Math.round(e.v * 1e6) / 1e6)) });
        if (r.ok) fail('mistake accepted: ' + e.cue);
        else if (r.code !== 'e' + k && !it.errs.slice(0, k).some(p => it.poly ? M.sameP(p.v, e.v) : Math.abs(p.v - e.v) < .06)) fail('mistake not named: ' + e.cue + ' got ' + r.code);
      });
    }
    ok(bad.length === 0, tp + ' L' + lv + ' ' + g.name + ': answers, mistakes and lengths ' + bad.join(' | ').slice(0, 300));
  });
  // A round ramps: items 1–3 one step, 4–7 two steps, 8–10 three.
  const lv = [...Array(10)].map((_, n) => M.gen('rn', n).lvl).join('');
  ok(lv === '1112222333', 'round ramps 1-1-1-2-2-2-2-3-3-3: ' + lv);
  ok(M.check(M.gen('rn', 0), { v: null }).code === 'other', 'empty answer is not accepted');
  // Every story type has at least one named mistake.
  for (const tp in M.TOPICS) for (const l in M.TOPICS[tp]) M.TOPICS[tp][l].forEach(g => { let n = 0; for (let i = 0; i < 40; i++) n = Math.max(n, g().errs.length); ok(n > 0, g.name + ' has a named mistake'); });
};
</script>
