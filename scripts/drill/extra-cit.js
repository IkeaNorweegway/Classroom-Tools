<script>
window.EXTRA = ok => {
  const M = MODEL;
  SOC_CHECKS(ok, { STAT: M.STAT, EXC: M.EXC, ORDER: M.ORDER, CH: M.CH, CT: M.CT, DUTY: M.DUTY, WORDS: M.WORDS },
    [M.STAT_CUES, M.EXC_CUES, M.CH_CUES, M.CT_CUES, M.DUTY_CUES], 7);
  const y = t => M.ORDER.find(x => x.t === t).y;
  ok(y('Canadian Bill of Rights') < y('Royal Commission on Bilingualism and Biculturalism') && y('Royal Commission on the Status of Women') < y('Official Languages Act')
    && y('Official Languages Act') < y('Multiculturalism Policy'), 'order: 1960, 1963, 1967, 1969, 1971 as in the notes');
  const ex = t => M.EXC.find(x => x.t.indexOf(t) === 0).a;
  ok(ex('Chinese') === 'race' && ex('First Nations people') === 'eth' && ex('Women') === 'gen' && ex('Canadians aged') === 'age', 'exc: matches the notes\' vote timeline');
  ok(Object.keys(M.TERMS).every(k => M.WORDS.filter(w => w.a === k).length >= 2), 'words: two cards per term');
};
</script>
