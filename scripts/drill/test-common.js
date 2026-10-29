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
      const asQ = a => { const o = {}; for (const k in a) o[k] = typeof a[k] === 'string' && t.kind === 'slots' ? Q.parse(a[k]) : a[k]; return o; };
      for (let i = 0; i < 400; i++) { const it = t.gen(); n++; try { const r = t.check(it, asQ(t.answer(it))); if (!r.ok) { bad++; err = JSON.stringify(it); } } catch (e) { bad++; err = e.message; } }
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
            if (t.kind === 'slots') { const v = {}; for (const k in ans) { const a = ans[k], s = typeof a === 'string' ? a : Q.str(a).replace('−', '-'); v[k] = right ? s : ((window.WRONG && WRONG(t, it)) || {})[k] ?? String(Q.val(Q.parse(s)) * 1.5 + 7); } D.fill(v); D.check(); }
            else if (t.kind === 'choice') { const ch = t.choices(it); const w = ch.find(c => c.v !== ans.v); D.pickChoice(right ? ans.v : w.v); }
            else { D.setResp(right ? ans : WRONG(t, it)); D.check(); }
          };
          if (path === 0) give(true);
          else if (path === 1) { give(false); if (!D.state().resolved) give(true); }
          else if (path === 2) { give(false); if (!D.state().resolved) give(false); }
          else D.show();
          const s2 = D.state();
          if (!s2.resolved) { errs++; msg = 'not resolved path ' + path + ' ' + JSON.stringify(it); }
          const want = path === 0 ? 'g' : path === 1 ? (t.kind === 'choice' ? 'r' : 'y') : 'r';
          if (s2.marks[s2.marks.length - 1] !== want) { errs++; msg = 'mark ' + s2.marks.join('') + ' want ' + want + ' path ' + path + ' fb ' + s2.fb + ' ' + JSON.stringify(it); }
          D.check(); // next
        } catch (e) { errs++; msg = e.message + ' ' + (e.stack||'').split('\n')[1]; }
      }
      ok(errs === 0, t.id + ': 10 items through the UI ' + msg.slice(0, 300));
      ok(!document.getElementById('done').hidden, t.id + ': round ends after 10 with a score');
    });
    ok((window.__errs||[]).length === 0, 'no runtime errors ' + (window.__errs||[]).join(' | '));
    if (window.EXTRA) EXTRA(ok);
  } catch (e) { ok(false, 'harness crashed: ' + e.message + ' ' + e.stack); }
  document.getElementById('results').textContent = out.join('\n');
})();
</script>
