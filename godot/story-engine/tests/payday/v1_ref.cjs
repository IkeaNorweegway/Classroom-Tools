// Runs v1 Payday's own model (MODEL, SIGN-OFF and STORY blocks of public/materials/cefl/town/missions/7-income-tax.js)
// on a grid of runs and prints them as JSON. tests/payday/compare.sh checks the Godot port against it.
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '../../../../public/materials/cefl/town/missions/7-income-tax.js'), 'utf8');
const body = src.slice(src.indexOf('/* MODEL START'), src.indexOf('/* STORY END */'));
const M = new Function(body + '; return { WORKERS, JOBS, newRun, setJob, scheduleOf, actualOf, safeTakeHome, billsOf, paydaySigned, startChapter, outcome, helpTopic, errorPlan, errorKindFor, stubAsPrinted, storyStub, perfOf, taxFormula, PAY_CARD };')();
const TIERS = ['great', 'ok', 'poor', 'skip', 'great', 'great', 'ok', 'poor'];
const out = { runs: [], story: {}, card: M.PAY_CARD.map(r => M.taxFormula(r[0])) };
for (const wk of Object.keys(M.WORKERS)) for (const jk of M.WORKERS[wk].jobs) for (let seed = 1; seed <= 60; seed++) {
  const s = M.newRun(wk, null, seed * 101); M.setJob(s, jk); s.extra = seed % 2 === 0;
  const plan = M.errorPlan(seed * 101), real = seed % 3 === 0, rec = { wk, jk, seed, steps: [] };
  for (let p = 1; p <= 8; p++) {
    if (p === 3) M.startChapter(s, 2);
    if (seed % 4) s.shifts[p - 1] = TIERS[(seed + p) % 8]; else delete s.shifts[p - 1];
    const sp = s.bank + M.safeTakeHome(s, p) - M.billsOf(wk), jar = seed % 5 === 0 ? 30000 : Math.max(0, Math.floor(sp / 2500) * 2500);
    const kind = M.errorKindFor(s, p, plan), pr = kind ? M.stubAsPrinted(s, p, kind) : null, right = M.stubAsPrinted(s, p, null);
    const short = kind && (seed + p) % 3 === 0 ? right.net - pr.net : 0;
    const l = M.paydaySigned(s, jar, real, short);
    rec.steps.push({ p, safe: M.safeTakeHome(s, Math.min(8, p + 1)), sched: M.scheduleOf(s, Math.min(8, p + 1)).hours, kind: kind || '', printed: pr ? pr.net : 0, gross: l.stub.gross, ei: l.stub.ei, cpp: l.stub.cpp, tax: l.stub.tax, net: l.stub.net, tips: l.tips, bank: l.bank, jar: s.jar, bounced: l.bounced, help: M.helpTopic(s) || '' });
  }
  rec.out = M.outcome(s); rec.strikes = s.strikes; rec.covered = s.covered;
  out.runs.push(rec);
}
for (const id of ['mo', 'avery', 'dev', 'nurse']) { const t = M.storyStub(id); out.story[id] = { right: t.right.net, printed: t.printed.net, root: t.printed.root }; }
console.log(JSON.stringify(out));
