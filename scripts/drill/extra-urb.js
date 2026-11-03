<script>
window.EXTRA = ok => {
  const M = MODEL;
  SOC_CHECKS(ok, { PUSH: M.PUSH, DP: M.DP, IND: M.IND, LOOP: M.LOOP, IMP: M.IMP, AREA: M.AREA },
    [M.PUSH_CUES, M.DP_CUES, M.IND_CUES, M.LOOP_CUES, M.IMP_CUES, M.AREA_CUES], 6);
  ok(S.sortCheck({ a: 'push' }, { v: 'pull' }, M.PUSH_CUES).cue === M.PUSH_CUES.push, 'push: a push card gets the push cue');
  ok(M.IMP.find(x => /highway splits/.test(x.t)).a === 'div' && M.IMP.find(x => /Elk/.test(x.t)).a === 'route', 'impact: the highway pair is split between division and route');
};
</script>
