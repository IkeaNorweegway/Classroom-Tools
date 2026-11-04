<script>
window.EXTRA = ok => {
  const M = MODEL;
  SOC_CHECKS(ok, { WHY: M.WHY, PROG: M.PROG, WORLD: M.WORLD, PTS: M.PTS, REG: M.REG, CON: M.CON, ORDER: M.ORDER },
    [M.WHY_CUES, M.PROG_CUES, M.WORLD_CUES, M.PTS_CUES, M.REG_CUES, M.CON_CUES], 7);
  const flag = /[\u{1F1E6}-\u{1F1FF}]/u;
  ok(![M.WORLD, M.CON, M.ORDER].flat().some(x => flag.test(x.i)), 'no flag emoji (Windows shows letters)');
  ok(M.WORLD.find(x => /peacekeepers/.test(x.t)).a === 'suez', 'world: peacekeeping is Suez, not NATO');
  ok(!JSON.stringify(M).match(/residential|Sixties Scoop/i), 'residential schools and the Sixties Scoop stay on paper');
};
</script>
