<script>
window.EXTRA = ok => {
  const M = MODEL, q = Q.q;
  ok(M.checkCmp({ a: q(-3, 4), b: q(-2, 3), ans: '<' }, { v: '>' }).code === 'abs', 'compare: negatives by size named');
  ok(M.checkCmp({ a: q(-3, 4), b: q(-3, 4), ans: '=' }, { v: '<' }).code === 'same', 'compare: same number named');
  let badF = 0; for (let i = 0; i < 300; i++) { const it = M.genCmp(); if (Q.eq(it.a, it.b) && it.fa === it.fb && it.a.d > 1 && !(it.a.n > 0 && !M.terminates(it.a.d))) badF++; }
  ok(badF === 0, 'compare: equal pairs use two forms where a second form exists');
  const af = { a: 1, b: 2, c: 1, d: 3, op: '+', L: 6, v: q(5, 6) };
  ok(M.checkAddF(af, { v: q(2, 5) }).code === 'adddenoms', 'add fractions: 1/2 + 1/3 = 2/5 named');
  ok(M.checkAddF(af, { v: q(2, 6) }).code === 'rename', 'add fractions: tops not renamed named');
  ok(M.checkAddF(af, { v: Q.parse('10/12') }).ok, 'add fractions: unsimplified accepted');
  ok(M.checkSigns({ a: q(-25, 10), b: q(-41, 10), op: '−', v: q(16, 10) }, { v: q(-66, 10) }).code === 'minusneg', 'signs: minus a negative named');
  ok(M.checkMul({ x: q(-2, 3), y: q(-3, 4), v: q(1, 2) }, { v: q(-1, 2) }).code === 'sign', 'multiply: sign named');
  ok(M.checkMul({ x: q(2, 3), y: q(3, 5), v: q(2, 5) }, { v: q(10, 9) }).code === 'cross', 'multiply: cross-multiplied named');
  ok(M.checkDiv({ x: q(1, 2), y: q(1, 3), v: q(3, 2) }, { v: q(1, 6) }).code === 'noflip', 'divide: no flip named');
  ok(M.checkDiv({ x: q(1, 2), y: q(1, 3), v: q(3, 2) }, { v: q(2, 3) }).code === 'flipfirst', 'divide: flipped the first named');
  ok(M.checkBig({ n: 6, op: '÷', f: q(1, 2), v: q(12), ans: 'bigger' }, { v: 'smaller' }).cue.indexOf('more fit') > 0, 'bigger: ÷ by less than 1 cue');
  let badO = 0; const kinds = {};
  for (let i = 0; i < 500; i++) {
    const it = M.genOrder(), ts = it.ts; kinds[ts.map(t => t.t === 'op' ? t.o : t.t).join('')] = 1;
    if (!it.opts.includes(+it.ans)) badO++;
    if (it.steps[it.steps.length - 1].length !== 1) badO++;
  }
  ok(badO === 0 && Object.keys(kinds).length >= 8, 'first step: right step is always an option, every item reduces to one number (' + Object.keys(kinds).length + ' shapes)');
  const t1 = [{ t: 'n', v: q(2) }, { t: 'op', o: '+' }, { t: 'n', v: q(3) }, { t: 'op', o: '×' }, { t: 'n', v: q(4) }];
  ok(M.firstOp(t1) === 3, 'first step: 2 + 3 × 4 starts with ×');
  ok(Q.eq(M.apply(M.apply(t1, 3), 1)[0].v, 14), 'first step: 2 + 3 × 4 = 14');
  const t2 = [{ t: 'n', v: q(8) }, { t: 'op', o: '÷' }, { t: 'n', v: q(2) }, { t: 'op', o: '×' }, { t: 'n', v: q(4) }];
  ok(M.firstOp(t2) === 1 && M.checkOrder({ ts: t2, ans: '1' }, { v: '3' }).code === 'ltr', 'first step: 8 ÷ 2 × 4 left to right named');
  ok(document.querySelectorAll('.tab').length === 7, 'seven tabs');
};
</script>
