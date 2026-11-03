<script>
window.EXTRA = ok => {
  const M = MODEL;
  SOC_CHECKS(ok, { BW: M.BW, WHY: M.WHY, SOV: M.SOV, WON: M.WON, PC: M.PC, ORDER: M.ORDER, WORDS: M.WORDS },
    [M.BW_CUES, M.WHY_CUES, M.SOV_CUES, M.WON_CUES, M.PC_CUES], 7);
  const pc = M.WON.find(x => /Persons Case/.test(x.t));
  ok(pc.a === 'office' && S.sortCheck(pc, { v: 'vote' }, M.WON_CUES).cue === 'Persons Case: office, not voting', 'won: the Persons Case misconception is named');
  ok(M.PC.find(x => /right to vote/.test(x.t)).a === 'f', 'persons: "it gave women the vote" is false');
  const y = t => M.ORDER.find(x => x.t === t).y;
  ok(y('Balfour Declaration') < y('Persons Case') && y('Persons Case') < y('Statute of Westminster'), 'order: 1926, 1929, 1931 as in the quiz');
  ok(Object.keys(M.TERMS).every(k => M.WORDS.filter(w => w.a === k).length >= 2), 'words: two cards per term');
};
</script>
