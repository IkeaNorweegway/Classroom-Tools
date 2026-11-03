<script>
window.EXTRA = ok => {
  const M = MODEL;
  SOC_CHECKS(ok, { CAUSE: M.CAUSE, TOOL: M.TOOL, SECT: M.SECT, FT: M.FT, ORDER: M.ORDER },
    [M.CAUSE_CUES, M.TOOL_CUES, M.SECT_CUES, M.FT_CUES], 7);
  let d = true, kinds = new Set();
  for (let i = 0; i < 400; i++) { const it = M.genDef(); kinds.add(it.sp > it.rev ? '>' : it.sp < it.rev ? '<' : '='); if ((it.sp > it.rev) !== (it.a === 'def') || it.sp > 80 || it.sp < 5) d = false; }
  ok(d && kinds.size === 3, 'deficit: 400 items, answer is "spends more", all three cases appear, bars fit');
  ok(M.checkDef({ rev: 60, sp: 55, a: 'no', big: true }, { v: 'def' }).code === 'big', 'deficit: big spending without a deficit named');
  const spiral = S.chainTab({ id: 'x', steps: M.SPIRAL, loop: true });
  let c = true; for (let i = 0; i < 200; i++) { const it = spiral.gen(); if (it.opts.length !== 3 || !it.opts.includes(it.k) || new Set(it.opts).size !== 3) c = false; }
  ok(c, 'spiral: three different choices including the missing step');
  ok(M.CUES === undefined && Object.values(M.CAUSE_CUES).every(c => c.split(' ').length <= 6), 'cause cues short');
};
</script>
