<script>
// Screenshots: #gen=<scenario>&part=<0..2> puts that part on screen; #step=<n> walks it to step n
// (0 facts, 1 idea, 2 assume or answer …), with #slip=1 taking a wrong pick on step 1. A wrong try picks e0.
(() => {
  const h = new URLSearchParams(location.hash.slice(1));
  window.WRONG = () => ({ v: 'e0', done: true });
  const findF = g => { for (const u in MODEL.UNITS) { const f = MODEL.UNITS[u].find(f => f.name === g); if (f) return [u, f]; } };
  window.SHOWPART = (g, part) => { const [u, f] = findF(g); const its = MODEL.build(u, f); window.DRILL.newItem(its[part || 0]); return its[part || 0]; };
  window.WALK = () => {
    const D = window.DRILL, ans = document.getElementById('ans');
    if (h.get('gen')) SHOWPART(h.get('gen'), +(h.get('part') || 0));
    const n = +(h.get('step') || 0), it = D.state().item, r = D.state().resp;
    if (h.get('pick')) { r.sel = it.read.p.map((c, k) => c.k !== 'opt' && k % 2 ? k : -1).filter(k => k >= 0); D.setResp({}); }
    for (let i = 0; i < n; i++) {
      if (i === 0) { r.sel = it.read.p.map((c, k) => c.k === 'must' ? k : -1).filter(k => k >= 0); ans.querySelector('.factsBtn').click(); }
      else { const v = h.get('slip') && i === 1 ? 'e0' : 'a'; const b = ans.querySelector('.choice[data-v="' + v + '"]'); if (b) b.click(); }
    }
    if (h.get('end') === 'show') D.show();
  };
  if (h.get('gen') || h.get('step') || h.get('pick')) addEventListener('load', () => setTimeout(WALK, 0));
})();
</script>
<script>
// Science 7 word problems v3: every scenario, 300 builds each; the reading fits the stage; rounds; walks.
window.EXTRA = ok => {
  const M = MODEL, D = window.DRILL, ans = document.getElementById('ans');
  const words = s => String(s).trim().split(/\s+/).filter(Boolean).length;
  const LET = 'abc';
  for (const u in M.UNITS) M.UNITS[u].forEach(f => {
    const bad = []; let its;
    for (let i = 0; i < 300 && bad.length < 3; i++) {
      try { its = M.build(u, f); } catch (e) { bad.push('build ' + e.message); continue; }
      const fail = m => bad.push(m);
      if (its.length < 2 || its.length > 3) fail('parts ' + its.length);
      const P0 = its[0].read.p, txt = P0.map(c => c.t || c.cells.join(' ')).join(' ');
      const nW = words(txt);
      if (nW < 55 || nW > 135) fail('passage ' + nW + ' words');
      if (/<|>/.test(txt)) fail('markup in passage');
      if (new Set(P0.map(c => c.t || c.cells.join('|'))).size !== P0.length) fail('repeated chunk');
      if (/NaN|undefined/.test(txt)) fail('NaN in passage: ' + txt.slice(0, 80));
      its.forEach((it, j) => {
        const R = it.read, P = R.p, F = m => fail(LET[j] + ') ' + m);
        if (it.part !== j || it.of !== its.length || it.all !== its) F('part bookkeeping');
        if (it.prev.length !== j) F('earlier parts');
        if (it.lvl !== (j ? 'an' : 'ap')) F('level ' + it.lvl);
        if (!/^7-[1-5]-0[1-6]$/.test(it.code) || it.code[2] !== String(['eco', 'pla', 'hea', 'str', 'ear'].indexOf(u) + 1)) F('LO code ' + it.code);
        if (!(it.sec >= 1 && it.sec <= 6)) F('notes section ' + it.sec);
        if (!/\?$/.test(R.ask) || R.ask.length > 70) F('question: ' + R.ask);
        // key facts
        const must = P.map((c, k) => c.k === 'must' ? k : -1).filter(k => k >= 0), no = P.map((c, k) => c.k === 'no' ? k : -1).filter(k => k >= 0), opt = P.map((c, k) => c.k === 'opt' ? k : -1).filter(k => k >= 0);
        if (!must.length) F('no key fact');
        if (no.length < 2) F('fewer than two details to skip');
        if (!M.checkFacts(it, must).ok) F('key facts fail');
        if (!M.checkFacts(it, must.concat(opt)).ok) F('optional chunk counted wrong');
        if (no.length && M.checkFacts(it, must.concat([no[0]])).ok) F('detail to skip accepted');
        if (M.checkFacts(it, must.slice(1)).ok) F('missing key fact accepted');
        // idea, assume, explain
        if (j === 0 && !R.idea) F('part a has no key idea');
        if (j > 0 && !R.assume && !R.explain) F('analyze part with no assume or explain');
        if (!!R.explain !== (j === its.length - 1)) F('best explanation not on the last part only');
        [['idea', R.idea, 40], ['assume', R.assume, 44], ['explain', R.explain, 175]].forEach(([nm, s, mx]) => {
          if (!s) return;
          if (s.opts.length !== 3 || new Set(s.opts.map(o => o.t)).size !== 3) F(nm + ' choices');
          if (!M.checkPick(s, 'a').ok) F(nm + ' right pick fails');
          s.errs.forEach((e, k) => { const r = M.checkPick(s, 'e' + k); if (r.ok || words(r.cue) > 6) F(nm + ' wrong pick or cue: ' + r.cue); });
          s.opts.forEach(o => { if (o.t.length > mx) F(nm + ' choice long (' + o.t.length + '): ' + o.t.slice(0, 50)); });
        });
        if (R.explain) {
          const best = R.explain.a.length, mis = R.explain.errs[1].t.length;
          if (mis < best * .6) F('misconception much shorter than the best answer (' + mis + ' vs ' + best + ')');
        }
        if (R.idea) { const nr = (a, b) => M.NEAR.some(([x, y]) => (x === a && y === b) || (x === b && y === a)); const key = t => Object.keys(M.IDEAS[u]).find(k => M.IDEAS[u][k][0] === t);
          R.idea.errs.forEach(e => { if (nr(key(e.t), R.ideaKey)) F('close idea offered: ' + e.t); }); }
        // the answer
        if (!M.check(it, { v: 'a', done: true }).ok || M.check(it, { v: 'a', done: true }).partial) F('Show me answer fails');
        if (!M.check(it, { v: 'a', miss: 1 }).partial) F('slip not partial');
        if (R.explain && !M.check(it, { v: 'a', local: true, explain: 'e0' }).partial) F('weak explanation not partial');
        if (R.explain && !M.check(it, { v: 'a', local: true, explain: 'a', tried: ['e1'] }).partial) F('retry not partial');
        const ts = it.opts.map(o => o.t); if (new Set(ts).size !== ts.length || ts.length !== 3) F('answer choices');
        ts.forEach(t => { if (t.length > 40) F('choice long: ' + t); });
        if (it.steps.length < 2 || it.steps.length > 3) F('reasoning chain ' + it.steps.length);
        it.steps.forEach(s => { if (s.l.length > 17) F('step label long: ' + s.l); if (s.m.length > 60) F('step long (' + s.m.length + '): ' + s.m); });
        it.errs.forEach((e, k) => {
          if (words(e.cue) > 6) F('cue over 6 words: ' + e.cue);
          if (!(e.s >= 0 && e.s < it.steps.length)) F('mistake step out of range');
          const r = M.check(it, { v: 'e' + k }); if (r.ok || r.cue !== e.cue) F('misconception not named: ' + e.t);
        });
        if (!SW.PIC[it.pic.k]) F('picture type ' + it.pic.k);
        if (it.pic.k === 'chart' && it.pic.series.some(s => s.v.some(v => typeof v !== 'number' || isNaN(v)))) F('chart value');
      });
    }
    ok(bad.length === 0, u + ' ' + f.name + ': passage, parts, steps and answers ' + bad.join(' | ').slice(0, 400));
  });
  // The reading fits above the tracker at every step count, and every picture draws (one build per part).
  for (const u in M.UNITS) M.UNITS[u].forEach(f => {
    const its = M.build(u, f), over = [];
    its.forEach(it => {
      D.newItem(it);
      const fo = document.querySelector('#svg foreignObject'), dv = fo && fo.firstChild;
      if (!dv || dv.scrollHeight > +fo.getAttribute('height') + 1) over.push(LET[it.part] + ' ' + (dv ? dv.scrollHeight : '?') + '>' + (fo ? fo.getAttribute('height') : '?'));
      try { D.show(); } catch (e) { over.push('picture: ' + e.message); }
    });
    ok(over.length === 0, u + ' ' + f.name + ': the reading fits the stage and the pictures draw ' + over.join(', '));
  });
  // A round: parts come in order, every scenario is finished, and the round ends at 10.
  const tabs = D.PAGE.tabs.map(t => t.id);
  for (let k = 0; k < 6; k++) {
    D.setTab(tabs[k % tabs.length]); const seq = [];
    for (let i = 0; i < 10; i++) { const it = D.state().item; seq.push(it.t + ':' + it.part + '/' + it.of); D.show(); D.check(); }
    let good = true; for (let i = 0; i < 10; i++) { const [t, p] = seq[i].split(':'), pa = +p.split('/')[0], of = +p.split('/')[1]; const prev = i ? seq[i - 1].split(':') : null;
      if (pa > 0 && (!prev || prev[0] !== t || +prev[1].split('/')[0] !== pa - 1)) good = false;
      if (i === 9 && pa !== of - 1) good = false; }
    ok(good && !document.getElementById('done').hidden, 'round of 10 keeps whole scenarios in order: ' + seq.join(' '));
  }
  // The steps through the UI.
  const tapMust = it => { D.state().resp.sel = it.read.p.map((c, k) => c.k === 'must' ? k : -1).filter(k => k >= 0); ans.querySelector('.factsBtn').click(); };
  const pickV = v => ans.querySelector('.choice[data-v="' + v + '"]').click();
  const toAnswer = (it, slip) => { tapMust(it); if (it.read.idea) pickV(slip ? 'e0' : 'a'); if (it.read.assume) pickV('a'); };
  const two = M.UNITS.eco.find(f => f.name === 'ecoBeaver');
  let its = M.build('eco', two), s;
  D.setTab('eco');
  D.newItem(its[0]); toAnswer(its[0]); pickV('a'); s = D.state();
  ok(s.resolved && s.marks.slice(-1)[0] === 'g', 'part a, clean: green');
  D.check(); D.newItem(its[1]); toAnswer(its[1]); pickV('a'); s = D.state();
  ok(!s.resolved && ans.querySelector('.expl'), 'last part: a right answer opens the Best explanation step');
  pickV('a'); s = D.state();
  ok(s.resolved && s.marks.slice(-1)[0] === 'g', 'last part, clean with the best explanation: green');
  D.check(); its = M.build('eco', two); D.newItem(its[1]); toAnswer(its[1]); pickV('a'); pickV('e1'); s = D.state();
  ok(s.resolved && s.marks.slice(-1)[0] === 'y', 'a weak explanation: yellow (' + s.fb + ')');
  D.check(); its = M.build('eco', two); D.newItem(its[1]); toAnswer(its[1]); pickV('e0'); s = D.state();
  ok(!s.resolved && /try again/.test(s.fb), 'last part, a wrong answer: try again');
  pickV('a'); pickV('a'); s = D.state();
  ok(s.resolved && s.marks.slice(-1)[0] === 'y', 'last part, right on the second try: yellow');
  D.check(); its = M.build('eco', two); D.newItem(its[1]); toAnswer(its[1]); pickV('e0'); pickV('e1'); s = D.state();
  ok(s.resolved && s.marks.slice(-1)[0] === 'r' && ans.querySelector('.choice.ok'), 'last part, two wrong answers: red, answer shown');
  D.check(); its = M.build('eco', two); D.newItem(its[0]); toAnswer(its[0], true); pickV('a'); s = D.state();
  ok(s.resolved && s.marks.slice(-1)[0] === 'y', 'a wrong key idea, then right: yellow');
  D.check(); its = M.build('eco', two); D.newItem(its[0]); D.state().resp.sel = [its[0].read.p.findIndex(c => c.k === 'no')]; ans.querySelector('.factsBtn').click(); s = D.state();
  ok(/try again/.test(s.fb) && D.state().resp.flag.length === 1, 'a detail to skip is flagged: try again');
  ans.querySelector('.factsBtn').click(); s = D.state();
  ok(s.resp.facts === 'shown' && s.resp.step === 1, 'key facts missed twice: shown in green, on to the next step');
  D.check(); D.show(); s = D.state();
  ok(s.resolved && s.marks.slice(-1)[0] === 'r', 'Show me: red');
};
</script>
