// Word-problem practice engine: topic grid → level picker → problem view → summary, plus print.
import { shuffle } from './helpers.js';

export const LEVELS = {
  1: { label: 'Level 1', name: 'Warm-up', steps: 'One step' },
  2: { label: 'Level 2', name: 'Build', steps: 'Two steps' },
  3: { label: 'Level 3', name: 'Challenge', steps: 'Three or more steps' },
};
const SET_SIZE = 5;

// ─── Answer parsing ───
function cleanInput(s) {
  return s.replace(/[−–—]/g, '-').replace(/(\d),(?=\d{3}\b)/g, '$1').replace(/\$/g, '').trim();
}

export function parseNumber(raw, prob = false) {
  const s = cleanInput(raw).split('=').pop();   // "5³ = 125" → "125"
  let v = null, pct = false;
  let m;
  if ((m = s.match(/(-?\d+)\s+(\d+)\s*\/\s*(\d+)/))) {            // mixed number 1 3/8
    const w = parseFloat(m[1]);
    v = Math.sign(w || 1) * (Math.abs(w) + parseFloat(m[2]) / parseFloat(m[3]));
  } else if ((m = s.match(/(-?\d*\.?\d+)\s*\/\s*(-?\d*\.?\d+)/))) {  // fraction 3/8
    v = parseFloat(m[1]) / parseFloat(m[2]);
  } else if ((m = s.match(/(-?\d*\.?\d+)\s*\^\s*(-?\d+)/))) {        // power 2^10
    v = Math.pow(parseFloat(m[1]), parseFloat(m[2]));
  } else if ((m = s.match(/-?\d*\.?\d+(e-?\d+)?/i))) {
    v = parseFloat(m[0]);
    pct = /^\s*%/.test(s.slice(m.index + m[0].length));   // "37.5%" — only a plain number can be a percent
  }
  if (v === null || !isFinite(v)) return null;
  if (prob && pct) v /= 100;
  return v;
}

export function parsePoly(raw) {
  let s = cleanInput(raw).toLowerCase()
    .replace(/^[^=]*=/, '')                  // drop "A =", "P(x) =", etc.
    .replace(/[a-wyz]+(\^?\d|²|³)?/g, '')     // drop units like cm, m², dollars (x is the only variable)
    .replace(/²/g, '^2').replace(/\*/g, '').replace(/\s+/g, '');
  if (!s) return null;
  const terms = s.match(/[+-]?[^+-]+/g);
  if (!terms) return null;
  const out = { 2: 0, 1: 0, 0: 0 };
  for (const t of terms) {
    const m = t.match(/^([+-]?)(\d*\.?\d*)(x(\^(\d))?)?$/);
    if (!m || (m[2] === '' && !m[3])) return null;
    const sign = m[1] === '-' ? -1 : 1;
    const c = m[2] === '' ? 1 : parseFloat(m[2]);
    const deg = m[3] ? (m[5] ? parseInt(m[5], 10) : 1) : 0;
    if (deg > 2) return null;
    out[deg] += sign * c;
  }
  return out;
}

export function isCorrect(p, input) {
  if (p.poly) {
    const got = parsePoly(input);
    if (!got) return false;
    return [2, 1, 0].every(d => Math.abs((got[d] || 0) - (p.poly[d] || 0)) < 1e-6);
  }
  const v = parseNumber(input, p.prob);
  if (v === null) return false;
  const targets = Array.isArray(p.num) ? p.num : [p.num];
  return targets.some(t => {
    const tol = p.tol ?? (p.prob ? 0.0051 : 0.011);
    return Math.abs(v - t) <= tol;
  });
}

// ─── Small DOM helpers ───
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const nl = s => esc(s).replace(/\n/g, '<br>');

function makeProblem(gen, level) {
  for (let i = 0; i < 25; i++) {
    try { const p = gen(); if (p) { p.level = level; return p; } } catch { /* retry */ }
  }
  throw new Error('Generator failed');
}

/** Build n problems from a level's templates, cycling through them so each template appears. */
function buildSet(topic, level, n) {
  const gens = topic.levels[level];
  const order = [];
  while (order.length < n) order.push(...shuffle(gens));
  return order.slice(0, n).map(g => makeProblem(g, level));
}

export function initWordProblems({ topics, storageKey, courseName }) {
  let topic = null, level = null, problems = [], idx = 0, score = 0, answered = false;

  const grid = $('wp-grid'), pv = $('wp-problem'), sv = $('wp-summary');
  const input = $('wp-input'), checkBtn = $('wp-check'), nextBtn = $('wp-next');
  const fb = $('wp-feedback'), fbText = $('wp-feedback-text'), fbSteps = $('wp-feedback-steps');
  const hintBtn = $('wp-hint-toggle'), hintBox = $('wp-hint');
  const stepsBtn = $('wp-steps-toggle');

  const load = () => { try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { return {}; } };
  const save = (key, s, total) => {
    const d = load();
    const prev = d[key] || { best: 0, total };
    d[key] = { best: Math.max(prev.best, s), total, last: s };
    localStorage.setItem(storageKey, JSON.stringify(d));
  };

  function show(state) {
    grid.classList.toggle('hidden', state !== 'grid');
    pv.classList.toggle('hidden', state !== 'problem');
    sv.classList.toggle('hidden', state !== 'summary');
    window.scrollTo({ top: 0 });
  }

  function renderGrid() {
    const prog = load();
    grid.innerHTML = topics.map(t => {
      const lvlBtns = [1, 2, 3].map(l => {
        const p = prog[`${t.id}:${l}`];
        const done = p && p.best === p.total;
        const badge = p ? `<span class="wp-badge ${done ? 'wp-badge-done' : ''}">${p.best}/${p.total}</span>` : '';
        return `<button type="button" data-topic="${t.id}" data-level="${l}" class="wp-level-btn wp-level-${l}">
          <span class="wp-level-name">${LEVELS[l].label}</span>
          <span class="wp-level-sub">${LEVELS[l].steps}</span>
          ${badge}
        </button>`;
      }).join('');
      return `<div class="wp-card">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-bold wp-accent-text">Unit ${t.num}</span>
          <button type="button" data-print="${t.id}" class="text-xs font-medium text-slate-400 hover:text-slate-700">🖨 Print worksheet</button>
        </div>
        <p class="font-bold text-slate-800 mb-1">${esc(t.name)}</p>
        <p class="text-xs text-slate-500 mb-3 leading-relaxed">${esc(t.summary)}</p>
        <div class="grid grid-cols-3 gap-2 mb-2">${lvlBtns}</div>
        <button type="button" data-topic="${t.id}" data-level="mixed" class="wp-mixed-btn">Mixed set — two from each level →</button>
      </div>`;
    }).join('');
  }

  function start(topicId, lvl) {
    topic = topics.find(t => t.id === topicId);
    level = lvl;
    problems = lvl === 'mixed'
      ? [1, 2, 3].flatMap(l => buildSet(topic, l, 2))
      : buildSet(topic, Number(lvl), SET_SIZE);
    idx = 0; score = 0;
    $('wp-title').textContent = topic.name;
    show('problem');
    showProblem();
  }

  function progressText() {
    return `Problem ${idx + 1} of ${problems.length} · ${score} correct`;
  }

  function showProblem() {
    answered = false;
    const p = problems[idx];
    const L = LEVELS[p.level];
    $('wp-level-tag').textContent = `${L.label} · ${L.name}`;
    $('wp-level-tag').className = `wp-tag wp-tag-${p.level}`;
    $('wp-progress').textContent = progressText();
    $('wp-question').innerHTML = nl(p.q);
    $('wp-unit').textContent = p.unit || '';
    $('wp-unit').classList.toggle('hidden', !p.unit);
    input.value = '';
    input.disabled = false;
    input.placeholder = p.poly ? 'e.g. 3x + 5' : p.prob ? 'Fraction, decimal, or %' : 'Your answer…';
    checkBtn.disabled = false;
    fb.classList.add('hidden');
    nextBtn.classList.add('hidden');
    hintBox.classList.add('hidden');
    hintBtn.textContent = 'Show hint';
    hintBtn.classList.toggle('hidden', !p.hint);
    hintBox.textContent = p.hint || '';
    setTimeout(() => input.focus(), 50);
  }

  function renderSteps(p) {
    return `<ol class="wp-steps">${p.steps.map(s => `<li>${nl(s)}</li>`).join('')}</ol>`;
  }

  function check() {
    if (answered) return;
    const p = problems[idx];
    const val = input.value.trim();
    if (!val) return;
    answered = true;
    input.disabled = true;
    checkBtn.disabled = true;
    const ok = isCorrect(p, val);
    if (ok) score++;
    $('wp-progress').textContent = progressText();
    fb.className = `wp-feedback ${ok ? 'wp-feedback-ok' : 'wp-feedback-bad'}`;
    fbText.textContent = ok ? `Correct! ${p.display}` : `Not quite. The answer is ${p.display}`;
    fbSteps.innerHTML = renderSteps(p);
    // Show worked steps right away when wrong; behind a toggle when right.
    fbSteps.classList.toggle('hidden', ok);
    stepsBtn.classList.toggle('hidden', !ok);
    stepsBtn.textContent = 'Show worked solution';
    nextBtn.textContent = idx + 1 >= problems.length ? 'See results →' : 'Next problem →';
    nextBtn.classList.remove('hidden');
    nextBtn.focus();
  }

  function next() {
    idx++;
    if (idx >= problems.length) summary();
    else showProblem();
  }

  function summary() {
    const key = `${topic.id}:${level}`;
    if (level !== 'mixed') save(key, score, problems.length);
    show('summary');
    const lvlName = level === 'mixed' ? 'Mixed set' : `${LEVELS[level].label} · ${LEVELS[level].name}`;
    $('wp-sum-title').textContent = `${topic.name} — ${lvlName}`;
    $('wp-sum-score').textContent = `${score} / ${problems.length}`;
    const pct = score / problems.length;
    let msg;
    if (pct === 1) msg = level === 3 || level === 'mixed' ? 'Perfect! You\'ve mastered these.' : 'Perfect! Try the next level up.';
    else if (pct >= 0.6) msg = 'Good work. Look over the worked steps for the ones you missed.';
    else msg = level > 1 ? 'Keep at it. Dropping down a level can help you lock in the steps.' : 'Keep practising. Use the hints and read the worked steps.';
    $('wp-sum-label').textContent = msg;
    const bar = $('wp-sum-bar');
    bar.style.width = `${pct * 100}%`;
    bar.className = `h-3 rounded-full transition-all ${pct >= 0.8 ? 'bg-emerald-500' : pct >= 0.6 ? 'bg-amber-400' : 'bg-red-400'}`;
    const up = $('wp-levelup');
    const canUp = level !== 'mixed' && level < 3;
    up.classList.toggle('hidden', !canUp);
    if (canUp) up.textContent = `Try ${LEVELS[Number(level) + 1].label} →`;
  }

  function printTopic(topicId) {
    const t = topics.find(x => x.id === topicId);
    const sets = [1, 2, 3].map(l => ({ l, items: buildSet(t, l, 3) }));
    let n = 0;
    $('wp-print-title').textContent = `Word Problems — ${t.name}`;
    $('wp-print-sub').textContent = `${courseName} · Unit ${t.num}`;
    $('wp-print-problems').innerHTML = sets.map(({ l, items }) => `
      <section class="wp-print-section">
        <h2 class="wp-print-h2">${LEVELS[l].label} · ${LEVELS[l].name} <span>(${LEVELS[l].steps.toLowerCase()})</span></h2>
        ${items.map(p => `<div class="wp-print-problem">
          <p><strong>${++n}.</strong> ${nl(p.q)}</p>
          <div class="wp-print-work"></div>
          <p class="wp-print-answer-line">Answer: ______________________ ${esc(p.unit || '')}</p>
        </div>`).join('')}
      </section>`).join('');
    n = 0;
    $('wp-print-key').innerHTML = sets.map(({ l, items }) => `
      <h3 class="wp-print-h3">${LEVELS[l].label}</h3>
      ${items.map(p => `<div class="wp-print-keyitem">
        <p><strong>${++n}.</strong> ${esc(p.display)}</p>
        <ol>${p.steps.map(s => `<li>${nl(s)}</li>`).join('')}</ol>
      </div>`).join('')}`).join('');
    document.body.classList.add('wp-printing');
    window.print();
    document.body.classList.remove('wp-printing');
  }

  // ─── Events ───
  grid.addEventListener('click', e => {
    const pr = e.target.closest('[data-print]');
    if (pr) { printTopic(pr.dataset.print); return; }
    const b = e.target.closest('[data-level]');
    if (b) start(b.dataset.topic, b.dataset.level === 'mixed' ? 'mixed' : Number(b.dataset.level));
  });
  $('wp-back').addEventListener('click', () => { renderGrid(); show('grid'); });
  checkBtn.addEventListener('click', check);
  nextBtn.addEventListener('click', next);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { answered ? next() : check(); } });
  hintBtn.addEventListener('click', () => {
    const hidden = hintBox.classList.toggle('hidden');
    hintBtn.textContent = hidden ? 'Show hint' : 'Hide hint';
  });
  stepsBtn.addEventListener('click', () => {
    const hidden = fbSteps.classList.toggle('hidden');
    stepsBtn.textContent = hidden ? 'Show worked solution' : 'Hide worked solution';
  });
  $('wp-retry').addEventListener('click', () => start(topic.id, level));
  $('wp-levelup').addEventListener('click', () => start(topic.id, Number(level) + 1));
  $('wp-pick').addEventListener('click', () => { renderGrid(); show('grid'); });

  renderGrid();
}
