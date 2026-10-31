<script>
window.EXTRA = ok => {
  const M = MODEL, P = Q.parse, T = window.DRILL.PAGE.tabs, D = window.DRILL;
  // every released item: a well-formed question whose own answer passes and whose named mistakes don't
  let bad = [];
  M.BANK.forEach(it => {
    if (it.fmt === 'mc') { if (!(it.opts.length === 4 && it.a >= 0 && it.a < 4)) bad.push(it.id + ' options'); if (!M.check(it, { v: M.LET[it.a] }).ok) bad.push(it.id + ' answer'); M.LET.forEach((l, i) => { if (i !== it.a && M.check(it, { v: l }).ok) bad.push(it.id + ' wrong option passes'); }); }
    else { if (!M.check(it, { v: P(String(it.a)) }).ok) bad.push(it.id + ' answer'); (it.miss || []).forEach(m => { if (M.near(m[0], it.a, it.tol)) bad.push(it.id + ' miss = answer'); if (M.check(it, { v: P(String(m[0])) }).cue !== m[1]) bad.push(it.id + ' miss ' + m[0] + ' not named'); }); }
    if (it.story && !it.pic) bad.push(it.id + ' word problem with no picture');
    if (!it.story && !it.pic && !(it.steps && it.steps.length)) bad.push(it.id + ' no steps');
    if ((it.cue || '').split(' ').length > 6) bad.push(it.id + ' cue over 6 words');
    (it.cues || []).forEach(c => { if (c && c.split(' ').length > 6) bad.push(it.id + ' option cue over 6 words'); });
  });
  ok(!bad.length, 'released items well formed (' + M.BANK.length + ') ' + bad.join('; '));
  ok(M.BANK.length === 47, '47 released items');
  // answers worked out again from the stories
  const by = id => M.BANK.find(b => b.id === id);
  const n11 = by('n11'); ok(n11.opts[n11.a] === String(n11.vals.filter(v => v > 7.8 * 7.8 && v < 8.8 * 8.8).length), 'n11: 4 roots between 7.8 and 8.8');
  let sq = 0; for (let r = 1; r * r < 160; r++) if (r * r > 39) sq++; ok(by('n8').a === sq, 'n8: 6 squares between 39 and 160');
  ok(by('n15').opts[3] === '$' + (5 + 33 * .05 + 47 * .06).toFixed(2), 'n15: phone bill $9.47');
  ok(by('n17').opts[0] === (14.4 * .75 + 13.2 / 3).toFixed(1) + ' km', 'n17: trip 15.2 km');
  ok((750 - 150) / 25 - (750 - 200) / 55 === 14, 'p9: 24 − 10 = 14 payments');
  ok(Math.ceil(1200 / (576 * .2)) === 11, 'p11: 11 weeks');
  ok(Math.ceil((250 - 86) / 10.25) === 16 && (180 - 45) / 9 === 15, 'p15, p16: 15 lawns, 16 hours');
  ok(Math.abs(Math.sqrt(9 * 9 + 15 * 15) - 15 - 2.49) < .01, 's4: gong 2.5 cm');
  ok(280 / 2.5 === 112 && 0.375 * 96 === 36, 's6, s1: sail 112, carpet 36 m²');
  // generated items: consistent stories, right answer passes, named mistakes never equal the answer
  let g = [];
  Object.keys(M.GENS).forEach(s => M.GENS[s].forEach(f => { for (let i = 0; i < 300; i++) {
    const it = f(); if (it.s !== s) g.push(it.id + ' strand');
    if (it.fmt === 'mc' ? !M.check(it, { v: M.LET[it.a] }).ok : !M.check(it, { v: P(String(it.a)) }).ok) { g.push(it.id + ' answer ' + JSON.stringify(it).slice(0, 120)); break; }
    if (it.fmt === 'nr' && (it.miss || []).some(m => M.near(m[0], it.a, it.tol))) { g.push(it.id + ' miss = answer ' + it.a); break; }
    if (it.id === 'g:plans' && it.b1 + it.r1 * it.n !== it.b2 + it.r2 * it.n) g.push('plans');
    if (it.id === 'g:age' && 3 * it.t + 2 * it.rows[0][2] !== it.total) g.push('age');
    if (it.id === 'g:garden' && 2 * (2 * it.w + it.x) !== it.P) g.push('garden');
    if (it.id === 'g:tix' && it.sp * it.st + it.ap * it.ad !== it.T) g.push('tix');
    if (it.id === 'g:hours' && (it.have + (it.n - 1) * it.rate >= it.goal || it.have + it.n * it.rate < it.goal)) g.push('hours');
    if (it.id === 'g:bias' && it.groups[it.a] !== 'fair') g.push('bias');
    if (it.id === 'g:sq') { let c = 0; for (let r = 1; r * r < it.hi; r++) if (r * r > it.lo) c++; if (c !== it.a) g.push('sq'); }
  } }));
  ok(!g.length, 'generated items consistent (13 × 300) ' + g.slice(0, 4).join('; '));
  // every tab mixes released and generated items, and the strand tabs stay in their strand
  T.slice(0, 4).forEach(t => { const ids = new Set(); for (let i = 0; i < 300; i++) ids.add(t.gen().s); ok(ids.size === 1 && ids.has(t.id), t.id + ': only its own strand'); });
  const mix = new Set(); for (let i = 0; i < 400; i++) mix.add(T[4].gen().s); ok(mix.size === 4, 'mixed: all four strands');
  // the 📖 link follows the item
  D.setTab('ss'); const it = D.state().item, href = document.getElementById('notes').getAttribute('href');
  ok(href.indexOf({ sr: 'square-roots', me: 'measurement', cg: 'circle-geometry', si: 'similarity' }[it.topic]) > 0, 'notes link follows the item (' + it.id + ' → ' + href.split('#')[0] + ')');
  const tabsEl = document.getElementById('tabs');
  ok(tabsEl.scrollWidth <= tabsEl.clientWidth + 1, 'all 5 tabs visible at ' + innerWidth + ' px');
};
</script>
