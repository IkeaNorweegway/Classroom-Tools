<script>
/* Shared checks for the Social 9 trainers (added before each page's extra tests by test.sh). */
window.SOC_CHECKS = (ok, banks, cueSets, tabs) => {
  // Emoji added in Unicode 14 or later do not show on older Chromebooks and iPads.
  const NEW = /[\u{1F6DD}-\u{1F6DF}\u{1F7F0}\u{1F979}\u{1F9CC}\u{1FA75}-\u{1FA77}\u{1FA7B}-\u{1FA7C}\u{1FA87}-\u{1FA88}\u{1FAA9}-\u{1FAAF}\u{1FAB7}-\u{1FABF}\u{1FAC3}-\u{1FAC5}\u{1FACE}-\u{1FACF}\u{1FAD7}-\u{1FADB}\u{1FAE0}-\u{1FAE8}\u{1FAF0}-\u{1FAF8}]/u;
  for (const k in banks) {
    const b = banks[k], ts = b.map(x => x.t);
    ok(new Set(ts).size === ts.length, k + ': no repeated cards');
    ok(b.length >= (b[0] && b[0].y != null ? 7 : 10), k + ': enough cards (' + b.length + ')');
    ok(b.every(x => x.t.length <= 60), k + ': card text 60 characters or fewer ' + (b.find(x => x.t.length > 60) || {}).t);
    ok(b.every(x => !NEW.test(x.i || '')), k + ': no Unicode 14+ emoji ' + (b.find(x => NEW.test(x.i || '')) || {}).t);
    const per = {}; b.forEach(x => { if (x.a != null) per[x.a] = (per[x.a] || 0) + 1; });
    ok(Object.values(per).every(n => n >= 2), k + ': at least two cards per answer');
  }
  const cues = cueSets.flatMap(c => Object.values(c));
  ok(cues.every(c => c.split(' ').length <= 6), 'every cue is six words or fewer ' + (cues.find(c => c.split(' ').length > 6) || ''));
  ok(document.querySelectorAll('.tab').length === tabs, tabs + ' tabs');
  // Order tabs: the right answer is always the earlier event.
  window.DRILL.PAGE.tabs.filter(t => t.order).forEach(t => {
    let good = true; for (let i = 0; i < 300; i++) { const it = t.gen(), B = t.order; if (B[it.first].y >= B[it.first === it.L ? it.R : it.L].y || (it.a === 'L') !== (it.first === it.L)) good = false; }
    ok(good, t.id + ': 300 pairs, the answer is the earlier event');
  });
  // Pick tabs: three different choices, one of them the answer.
  window.DRILL.PAGE.tabs.filter(t => t.pick).forEach(t => {
    let good = true; for (let i = 0; i < 300; i++) { const it = t.gen(); if (new Set(it.opts).size !== it.opts.length || !it.opts.includes(it.a)) good = false; }
    ok(good, t.id + ': 300 items, distinct choices including the answer');
  });
};
</script>
