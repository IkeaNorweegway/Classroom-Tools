// Matching and ranking for site search (used by Search.astro). Plain JS so it
// runs in the browser as-is. Entries come from /search-index.json.

const STOP = new Set(['the', 'a', 'an', 'of', 'and', 'to', 'in', 'is', 'are', 'what', 'how', 'why', 'for', 'on', 'with', 'my', 'i', 'do', 'does']);

/** Lowercase, no accents, letters and digits only (same rule as the index). */
export const normalize = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const words = (s) => (s ? normalize(s).split(' ').filter(Boolean) : []);

/** Edit distance where swapping two letters counts as one typo. Returns
 *  max + 1 as soon as the distance must be over max. */
export function editDistance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev2 = null;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let low = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let d = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      if (prev2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d = Math.min(d, prev2[j - 2] + 1);
      row.push(d);
      if (d < low) low = d;
    }
    if (low > max) return max + 1;
    prev2 = prev;
    prev = row;
  }
  return prev[b.length];
}

/** Typos allowed for a query word: none up to 4 letters, 1 up to 7, then 2. */
export const allowance = (n) => (n >= 8 ? 2 : n >= 5 ? 1 : 0);

// How well query word q matches word w: 3 exact, 2 prefix, 1 typo, 0 none.
function tier(q, w) {
  if (w === q) return 3;
  if (w.startsWith(q)) return 2;
  // Plurals: "forces" finds "force", "ecosystems" finds "ecosystem".
  if ((q.endsWith('s') && w === q.slice(0, -1)) || (q.endsWith('es') && w === q.slice(0, -2))) return 3;
  const max = allowance(q.length);
  if (!max) return 0;
  if (editDistance(q, w, max) <= max) return 1;
  // A typo inside a word still being typed: "photosint" → "photosynthesis".
  if (q.length >= 6 && w.length > q.length) {
    for (let n = q.length - 1; n <= q.length + 1; n++) {
      if (n < w.length && editDistance(q, w.slice(0, n), max) <= max) return 1;
    }
  }
  return 0;
}

/** Turn the raw index into what search() and suggest() read. */
export function prepare(entries) {
  const all = new Set();
  const vocab = new Map(); // label words → how many entries use them (for "Did you mean")
  const items = entries.map((e) => {
    const it = {
      e,
      norm: normalize(e.label),
      label: words(e.label),
      place: words(`${e.unitLabel} ${e.where ?? ''}`),
      course: words(e.courseName),
      text: e.text ? e.text.split(' ') : [],
    };
    for (const list of [it.label, it.place, it.course, it.text]) for (const w of list) all.add(w);
    for (const w of new Set([...it.label, ...words(e.unitLabel)])) {
      if (w.length >= 3 && !/^\d+$/.test(w)) vocab.set(w, (vocab.get(w) ?? 0) + 1);
    }
    return it;
  });
  return { items, all: [...all], vocab };
}

const queryWords = (query) => {
  const qs = words(query);
  const content = qs.filter((q) => !STOP.has(q));
  return content.length ? content : qs;
};

// Points per field for an exact, prefix and typo match.
const WEIGHTS = { label: [12, 8, 5], place: [4, 3, 2], course: [3, 2, 1], text: [6, 4, 2] };
const CAPS = { unit: 4, concept: 6, activity: 3 };

/** Ranked results for a query. `strong` is false when every result needed a
 *  typo to match (the cue to offer "Did you mean…?"). */
export function search(index, query, { course } = {}) {
  const qs = queryWords(query);
  if (!qs.length) return { results: [], strong: false };
  const qNorm = qs.join(' ');
  // Score each distinct word once per query word, then look entries up.
  const tiers = qs.map((q) => {
    const m = new Map();
    for (const w of index.all) {
      const t = tier(q, w);
      if (t) m.set(w, t);
    }
    return m;
  });

  const scored = [];
  for (const it of index.items) {
    let score = 0;
    let exact = true;
    let ok = true;
    for (const m of tiers) {
      let best = 0;
      let bestTier = 0;
      for (const field of ['label', 'place', 'course', 'text']) {
        for (const w of it[field]) {
          const t = m.get(w);
          if (!t) continue;
          const pts = WEIGHTS[field][3 - t];
          if (pts > best) best = pts;
          if (t > bestTier) bestTier = t;
        }
      }
      if (!best) { ok = false; break; }
      if (bestTier < 2) exact = false;
      score += best;
    }
    if (!ok) continue;
    if (it.norm === qNorm) score += 25;
    else if (it.norm.startsWith(qNorm)) score += 8;
    if (it.e.kind === 'unit') score += 2;
    if (course && it.e.course === course) score += 3;
    score -= it.norm.length * 0.02; // shorter, more direct labels first
    scored.push({ entry: it.e, score, exact });
  }
  scored.sort((a, b) => b.score - a.score);
  // Drop stragglers far below the best match.
  const floor = scored.length ? scored[0].score * 0.15 : 0;

  const counts = { unit: 0, concept: 0, activity: 0 };
  const results = scored.filter((r) => r.score >= floor && counts[r.entry.kind]++ < CAPS[r.entry.kind]);
  return { results, strong: results.some((r) => r.exact) };
}

/** A corrected query ("fotosinthesis" → "photosynthesis"), or null when the
 *  words are already known or nothing is close enough. */
export function suggest(index, query) {
  let changed = false;
  const fixed = words(query).map((q) => {
    if (STOP.has(q) || q.length < 3 || /^\d+$/.test(q) || index.vocab.has(q)) return q;
    for (const w of index.vocab.keys()) if (w.startsWith(q)) return q; // still typing
    const max = Math.max(1, Math.floor(q.length / 3));
    let best = null;
    let bestD = max + 1;
    let bestPrefix = true;
    let bestCount = 0;
    for (const [w, count] of index.vocab) {
      // A word that starts like the query counts too, one step behind a whole-word match.
      const whole = editDistance(q, w, max);
      const start = w.length > q.length ? editDistance(q, w.slice(0, q.length), max) + 1 : Infinity;
      const d = Math.min(whole, start);
      const prefix = start < whole;
      if (d < bestD || (d === bestD && ((bestPrefix && !prefix) || (bestPrefix === prefix && count > bestCount)))) {
        best = w;
        bestD = d;
        bestPrefix = prefix;
        bestCount = count;
      }
    }
    if (!best || bestD > max) return null;
    changed = true;
    return best;
  });
  return changed && !fixed.includes(null) ? fixed.join(' ') : null;
}
