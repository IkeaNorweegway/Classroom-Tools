<pre id="results"></pre>
<script>
(function(){
  const out = [], ok = (c, m) => out.push((c ? 'PASS ' : 'FAIL ') + m);
  const D = window.DRILL;
  try {
    ok(!!D, 'debug hook present');
    ok((window.__errs||[]).length === 0, 'no load errors ' + (window.__errs||[]).join(' | '));
    // 1. Model: the right answer passes for 400 items in every tab
    D.PAGE.tabs.forEach(t => {
      let bad = 0, n = 0, err = '';
      const asQ = (a, it) => { const o = {}; for (const k in a) o[k] = typeof a[k] === 'string' && DRILL.kindOf(t, it) === 'slots' ? Q.parse(a[k]) : a[k]; return o; };
      for (let i = 0; i < 400; i++) { const it = t.gen(); n++; try { const r = t.check(it, asQ(t.answer(it), it)); if (!r.ok) { bad++; err = JSON.stringify(it); } } catch (e) { bad++; err = e.message; } }
      ok(bad === 0, t.id + ': right answer passes ' + n + ' items ' + err.slice(0, 200));
    });
    // 2. UI flow per tab: right first try, wrong then right, wrong twice, Show; draw every phase
    D.PAGE.tabs.forEach(t => {
      D.setTab(t.id);
      let errs = 0, msg = '';
      for (let i = 0; i < 10; i++) {
        try {
          const st = D.state(), it = st.item, ans = t.answer(it), path = i % 4;
          const give = right => {
            if (DRILL.kindOf(t, it) === 'slots') { const v = {}; for (const k in ans) { const a = ans[k], s = typeof a === 'string' ? a : Q.str(a).replace('−', '-'); v[k] = right ? s : ((window.WRONG && WRONG(t, it)) || {})[k] ?? String(Q.val(Q.parse(s)) * 1.5 + 7.3); } D.fill(v); D.check(); }
            else if (DRILL.kindOf(t, it) === 'choice') { const ch = t.choices(it); const w = ch.find(c => c.v !== ans.v); D.pickChoice(right ? ans.v : w.v); }
            else { D.setResp(right ? ans : WRONG(t, it)); D.check(); }
          };
          if (path === 0) give(true);
          else if (path === 1) { give(false); if (!D.state().resolved) give(true); }
          else if (path === 2) { give(false); if (!D.state().resolved) give(false); }
          else D.show();
          const s2 = D.state();
          if (!s2.resolved) { errs++; msg = 'not resolved path ' + path + ' ' + JSON.stringify(it); }
          const want = path === 0 ? 'g' : path === 1 ? (DRILL.kindOf(t, it) === 'choice' ? 'r' : 'y') : 'r';
          if (s2.marks[s2.marks.length - 1] !== want) { errs++; msg = 'mark ' + s2.marks.join('') + ' want ' + want + ' path ' + path + ' fb ' + s2.fb + ' ' + JSON.stringify(it); }
          D.check(); // next
        } catch (e) { errs++; msg = e.message + ' ' + (e.stack||'').split('\n')[1]; }
      }
      ok(errs === 0, t.id + ': 10 items through the UI ' + msg.slice(0, 300));
      ok(!document.getElementById('done').hidden, t.id + ': round ends after 10 with a score');
    });
    ok((window.__errs||[]).length === 0, 'no runtime errors ' + (window.__errs||[]).join(' | '));
    // 3. Weighting: a missed question type comes back more often; a type answered right still comes, less often
    if (D.keyOf) {
      const t = D.PAGE.tabs.find(t => { const ks = new Set(); for (let i = 0; i < 60; i++) ks.add(D.keyOf(t.gen(), t)); return ks.size >= 2; });
      if (!t) ok(true, 'weighting: no tab has more than one question type');
      else {
        D.setTab(t.id);
        const share = k => { let n = 0; for (let i = 0; i < 600; i++) { D.newItem(); if (D.keyOf(D.state().item) === k) n++; } return n / 600; };
        D.resetWeights(); const counts = {}; for (let i = 0; i < 200; i++) { const k = D.keyOf(t.gen()); counts[k] = (counts[k] || 0) + 1; }
        const k = Object.keys(counts).sort((a, b) => Math.abs(counts[a] / 200 - .3) - Math.abs(counts[b] / 200 - .3))[0];
        const base = share(k); D.setScore(k, 1.3); const missed = share(k); D.setScore(k, -1); const right = share(k); D.resetWeights();
        ok(missed > base * 1.4 && right < base && right > 0, 'weighting on ' + t.id + ' (' + k + '): base ' + base.toFixed(2) + ', missed ' + missed.toFixed(2) + ', right ' + right.toFixed(2));
      }
    }
    if (window.EXTRA) EXTRA(ok);
  } catch (e) { ok(false, 'harness crashed: ' + e.message + ' ' + e.stack); }
  document.getElementById('results').textContent = out.join('\n');
})();
</script>
