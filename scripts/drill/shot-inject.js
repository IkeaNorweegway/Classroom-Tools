<script>
(function(){
  const h = new URLSearchParams(location.hash.slice(1)), D = window.DRILL;
  Q.seed(+(h.get('seed') || 7));
  D.setTab(h.get('tab'));
  const t = D.PAGE.tabs.find(x => x.id === h.get('tab')), it = D.state().item, ans = t.answer(it), a = h.get('do');
  const wrong = () => {
    if (t.kind === 'slots') { const v = {}; const w = (window.WRONG && WRONG(t, it)) || {}; for (const k in ans) { const a = ans[k], s = typeof a === 'string' ? a : Q.str(a).replace('−', '-'); v[k] = w[k] ?? String(Q.val(Q.parse(s)) * 1.5 + 7); } D.fill(v); D.check(); }
    else if (t.kind === 'choice') { D.pickChoice(t.choices(it).find(c => c.v !== ans.v).v); }
    else { D.setResp(WRONG(t, it)); D.check(); }
  };
  if (a === 'wrong') wrong();
  if (a === 'wrong2') { wrong(); wrong(); }
  if (a === 'right') { if (t.kind === 'slots') { const v = {}; for (const k in ans) v[k] = typeof ans[k] === 'string' ? ans[k] : Q.str(ans[k]).replace('−','-'); D.fill(v); D.check(); } else if (t.kind === 'choice') D.pickChoice(ans.v); else { D.setResp(ans); D.check(); } }
  if (a === 'show') D.show();
  if (a === 'pts') D.setResp(WRONG(t, it));
})();
</script>
