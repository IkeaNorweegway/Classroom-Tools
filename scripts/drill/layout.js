<pre id="results"></pre>
<script>
(function(){
  const D = window.DRILL, out = [], side = document.getElementById('side');
  D.PAGE.tabs.forEach(t => {
    D.setTab(t.id);
    const st = D.state(), ans = t.answer(st.item);
    const probs = [];
    const chk = when => {
      if (innerWidth > 760) {
        if (document.documentElement.scrollHeight > innerHeight + 1) probs.push(when + ' page scrolls ' + document.documentElement.scrollHeight + '/' + innerHeight);
        if (side.scrollHeight > side.clientHeight + 1) probs.push(when + ' side scrolls ' + side.scrollHeight + '/' + side.clientHeight);
      }
      if (document.documentElement.scrollWidth > innerWidth + 1) probs.push(when + ' sideways ' + document.documentElement.scrollWidth);
      const sl = document.querySelector('.slots'); if (sl && sl.scrollWidth > sl.clientWidth + 1) probs.push(when + ' slots overflow');
      const r = document.querySelector('.slots') && [...document.querySelectorAll('.slot')].map(s => s.getBoundingClientRect().top); if (r && r.length && Math.max(...r) - Math.min(...r) > 4) probs.push(when + ' slots wrap to 2 lines');
    };
    chk('ask');
    if (DRILL.kindOf(t, st.item) === 'slots') { const v = {}; for (const k in ans) v[k] = '-88'; D.fill(v); D.check(); }
    else if (DRILL.kindOf(t, st.item) === 'choice') D.pickChoice(t.choices(st.item).find(c => c.v !== ans.v).v);
    else { D.setResp(window.WRONG ? WRONG(t, st.item) : ans); D.check(); }
    chk('after');
    out.push((probs.length ? 'FAIL ' : 'PASS ') + innerWidth + 'x' + innerHeight + ' ' + t.id + ' ' + probs.join('; '));
  });
  document.getElementById('results').textContent = out.join('\n');
})();
</script>
