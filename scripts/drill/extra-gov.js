<script>
window.EXTRA = ok => {
  const M = MODEL;
  SOC_CHECKS(ok, { PARL: M.PARL, RG: M.RG, SHORT: M.SHORT, FED: M.FED, COURT: M.COURT, WORDS: M.WORDS },
    [M.PARL_CUES, M.RG_CUES, M.SHORT_CUES, M.FED_CUES, M.COURT_CUES], 7);
  ok(M.BILL.length === 7 && /drafting/.test(M.BILL[0].t) && /Royal assent/.test(M.BILL[6].t), 'bill: seven steps, drafting to royal assent');
  const bill = window.DRILL.PAGE.tabs.find(t => t.id === 'bill');
  ok(bill.check({ k: 2, a: '2' }, { v: '4' }).code === 'later' && bill.check({ k: 4, a: '4' }, { v: '1' }).code === 'earlier', 'bill: a later or earlier step is named');
  ['Healthcare', 'Natural resources', 'Education'].forEach(t => ok(M.FED.find(x => x.t === t).a === 'prov', 'fed: ' + t + ' is provincial, as in the notes'));
};
</script>
