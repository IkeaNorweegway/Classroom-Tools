<script>
window.EXTRA = ok => {
  const M = MODEL;
  SOC_CHECKS(ok, { WAR: M.WAR, ORDER: M.ORDER, WHO: M.WHO, EVID: M.EVID, WORDS: M.WORDS }, [M.WAR_CUES, M.WHO_CUES, M.EVID_CUES], 5);
  const y = t => M.ORDER.find(x => x.t === t).y;
  ok(y('Britain declares war') < y('Canada declares war'), 'order: Britain (Sept 3) before Canada (Sept 10)');
  ok(['Defence of Hong Kong', 'Dieppe Raid', 'Italian Campaign begins', 'D-Day, Normandy', 'Liberation of the Netherlands'].map(y).every((v, i, a) => !i || a[i - 1] < v), 'order: campaigns in the notes order');
};
</script>
