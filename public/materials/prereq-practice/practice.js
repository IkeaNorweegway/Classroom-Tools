// Prereq practice engine, shared by every *-prereq-practice-v1.html page.
//
// A page holds <div id="practice" data-course="Grade 6 Science"
// data-storage="sci6" data-unit="matter">, loads this file, then its course's
// question bank (<course>-bank.js, which sets window.PracticeBank). The engine
// starts on DOMContentLoaded.
//
// A bank is { units: [{ id, name, num, skills: [...] }], toggle? }.
// Each skill is { name, hint?, visual?, items } (written questions) or { name, gen }
// (a function that makes a new question each call).
//   Item:  { q, a, why, choices?, accept?, n?, hint?, visual? }   q and why are text
//   gen(): { question, answer, solution, hint?, accept?(input), image?, visual? }
//          question may hold HTML (diagrams); solution is text
// visual is an SVG string shown under the question (the science banks draw them with
// sci-visuals.js). An item's own visual wins over its skill's.
// A toggle, e.g. Math 9's visual mode, is { label, get(), set(on) }.
// A bank with plain: true has generated questions in plain text, not HTML.
//
// Progress stays in this browser under <storage>-practice-progress and
// <storage>-practice-skills, the keys the old site pages used.

(function () {
  'use strict';

  // ─── Helpers for banks ───
  /** A two-way sort question, e.g. "Is a mushroom living or non-living?" */
  function sortQ(thing, options, a, why) {
    return { q: 'Is ' + thing + ' ' + options[0] + ' or ' + options[1] + '?', a: a, choices: options.slice(), why: why };
  }
  window.PrereqPractice = { sortQ: sortQ };

  // ─── Random ───
  function randInt(n) { return Math.floor(Math.random() * n); }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = randInt(i + 1); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  // ─── Checking typed answers ───
  // Written questions ignore case, accents, punctuation, a leading article and a trailing "s".
  function norm(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/^\s*(a|an|the)\s+/, '').replace(/[^a-z0-9]/g, '').replace(/s$/, '');
  }
  // The first number in an answer; spaces and commas inside it are ignored.
  function firstNumber(s) {
    var m = s.replace(/[−–]/g, '-').replace(/(\d)[\s,]+(?=\d{3}\b)/g, '$1').match(/-?\d+(\.\d+)?/);
    return m ? Number(m[0]) : NaN;
  }
  // Generated questions without their own check: case and spacing only, so "-3" stays different from "3".
  function loose(s) { return s.toLowerCase().replace(/\s+/g, ' ').trim(); }

  // ─── Turning a bank entry into a problem ───
  function fromItem(item, skill) {
    var shown = item.choices && (item.choices.length > 2 ? shuffle(item.choices) : item.choices.slice());
    return {
      skill: skill.name, html: false, q: item.q, a: item.a, why: item.why,
      hint: item.hint || skill.hint, choices: shown, visual: item.visual || skill.visual,
      check: function (given) {
        if (shown) return given === item.a;
        if (item.n !== undefined) return firstNumber(given) === item.n;
        var g = norm(given);
        return [item.a].concat(item.accept || []).some(function (ok) { return norm(ok) === g; });
      },
    };
  }
  var plainGen = false; // set from the bank
  function fromGen(skill) {
    var p;
    for (var i = 0; i < 10 && !p; i++) { try { p = skill.gen(); } catch (e) { /* try again */ } }
    if (!p) p = skill.gen();
    return {
      skill: skill.name, html: !plainGen, q: p.question, a: String(p.answer), why: p.solution || '',
      hint: p.hint || skill.hint, image: p.image, visual: p.visual || skill.visual,
      check: p.accept || function (given) { return loose(given) === loose(String(p.answer)); },
    };
  }
  function makeProblem(skill, pool) {
    if (skill.gen) return fromGen(skill);
    var item = pool ? pool.pop() : skill.items[randInt(skill.items.length)];
    return item && fromItem(item, skill);
  }

  // ─── Saved progress ───
  function load(key) { try { return JSON.parse(localStorage.getItem(key) || '') || {}; } catch (e) { return {}; } }
  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private window */ } }

  var DOT = { mastered: '🟢', developing: '🟡', 'needs-work': '🔴', 'new': '⚪' };
  var STATUS = { mastered: 'Mastered', developing: 'Developing', 'needs-work': 'Needs work', 'new': 'Not tried yet' };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function textHtml(s) { return esc(s).replace(/\n/g, '<br>'); }
  function visualHtml(p) { return p.visual ? '<figure class="pp-visual">' + p.visual + '</figure>' : ''; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }

  function start() {
    var root = document.getElementById('practice');
    var bank = window.PracticeBank;
    var unit = bank && bank.units.filter(function (u) { return u.id === root.dataset.unit; })[0];
    if (!unit) { root.textContent = 'This practice set could not be loaded.'; return; }

    plainGen = !!bank.plain;
    var courseName = root.dataset.course;
    var PROGRESS = root.dataset.storage + '-practice-progress';
    var SKILLS = root.dataset.storage + '-practice-skills';
    var skillId = function (name) { return unit.id + '::' + name; };
    var perRun = Math.min(unit.skills.length, 5);

    function status(name) {
      var s = load(SKILLS)[skillId(name)];
      if (!s || !s.total) return 'new';
      var rate = s.correct / s.total;
      if (rate >= 0.8 && s.total >= 2) return 'mastered';
      return rate >= 0.5 ? 'developing' : 'needs-work';
    }
    function record(name, correct) {
      var all = load(SKILLS);
      var s = all[skillId(name)] || { correct: 0, total: 0 };
      s.total++;
      if (correct) s.correct++;
      all[skillId(name)] = s;
      save(SKILLS, all);
    }

    // ─── Layout ───
    root.innerHTML =
      '<header class="pp-head">' +
        '<p class="pp-eyebrow">' + esc(courseName) + ' · ' + (unit.num ? 'Unit ' + unit.num + ' · ' : '') + 'Prereq practice</p>' +
        '<h1>Get ready: ' + esc(unit.name) + '</h1>' +
        '<p class="pp-lead">Check the skills you need before this unit starts. Each question has a hint, and every answer is explained.</p>' +
        (bank.toggle ? '<button type="button" class="pp-chip" id="pp-toggle" aria-pressed="false"></button>' : '') +
      '</header>' +
      '<section id="pp-home" class="pp-card">' +
        '<h2>Skills you need</h2>' +
        '<ul class="pp-skills" id="pp-skill-list"></ul>' +
        '<p class="pp-best" id="pp-best"></p>' +
        '<div class="pp-actions">' +
          '<button type="button" class="pp-btn pp-primary" id="pp-start">Start · ' + perRun + ' questions</button>' +
          '<button type="button" class="pp-btn" id="pp-print-btn">Print a practice sheet</button>' +
        '</div>' +
      '</section>' +
      '<section id="pp-problem" hidden>' +
        '<div class="pp-row"><button type="button" class="pp-link" id="pp-back">← Skills</button><span class="pp-progress" id="pp-progress"></span></div>' +
        '<div class="pp-card">' +
          '<p class="pp-skill" id="pp-skill"></p>' +
          '<div class="pp-question" id="pp-question"></div>' +
          '<button type="button" class="pp-link pp-hint-toggle" id="pp-hint-toggle">Show hint</button>' +
          '<p class="pp-hint" id="pp-hint" hidden></p>' +
          '<div class="pp-choices" id="pp-choices"></div>' +
          '<form class="pp-typed" id="pp-typed" autocomplete="off">' +
            '<input id="pp-input" type="text" spellcheck="false" aria-label="Your answer" placeholder="Your answer…">' +
            '<button type="submit" class="pp-btn pp-primary" id="pp-check">Check</button>' +
          '</form>' +
        '</div>' +
        '<div class="pp-feedback" id="pp-feedback" aria-live="polite" hidden><p class="pp-verdict" id="pp-verdict"></p><p class="pp-why" id="pp-why"></p></div>' +
        '<button type="button" class="pp-btn pp-next" id="pp-next" hidden>Next →</button>' +
      '</section>' +
      '<section id="pp-summary" class="pp-card pp-center" hidden>' +
        '<p class="pp-score" id="pp-score"></p>' +
        '<p class="pp-score-label" id="pp-score-label"></p>' +
        '<div class="pp-bar"><div id="pp-bar"></div></div>' +
        '<div class="pp-actions pp-actions-center">' +
          '<button type="button" class="pp-btn pp-primary" id="pp-retry">Try again</button>' +
          '<button type="button" class="pp-btn" id="pp-home-btn">See my skills</button>' +
        '</div>' +
      '</section>' +
      '<section id="pp-sheet" class="pp-sheet"></section>';

    var $ = function (id) { return document.getElementById(id); };
    var problems = [], index = 0, score = 0, answered = false, current;

    function show(view) {
      ['pp-home', 'pp-problem', 'pp-summary'].forEach(function (id) { $(id).hidden = id !== view; });
      window.scrollTo(0, 0);
    }

    function renderHome() {
      var all = load(SKILLS);
      $('pp-skill-list').innerHTML = unit.skills.map(function (s) {
        var st = status(s.name), d = all[skillId(s.name)];
        return '<li><span class="pp-dot" aria-hidden="true">' + DOT[st] + '</span>' +
          '<span class="pp-skill-name">' + esc(s.name) + '</span>' +
          '<span class="pp-skill-status">' + STATUS[st] + (d ? ' · ' + d.correct + '/' + d.total : '') + '</span></li>';
      }).join('');
      var p = load(PROGRESS)[unit.id];
      $('pp-best').textContent = p ? 'Best score: ' + p.best + '/' + (p.total || perRun) + ' · tried ' + p.attempts + (p.attempts === 1 ? ' time' : ' times') : '';
    }

    // One question per skill; units with more than five skills get five at random.
    function begin() {
      var skills = unit.skills.length > 5 ? shuffle(unit.skills).slice(0, 5) : unit.skills;
      problems = skills.map(function (s) { return makeProblem(s); });
      index = 0;
      score = 0;
      show('pp-problem');
      showProblem();
    }

    function progressText() {
      $('pp-progress').textContent = 'Question ' + (index + 1) + ' of ' + problems.length + ' · ' + score + ' correct';
    }

    function showProblem() {
      answered = false;
      current = problems[index];
      progressText();
      $('pp-skill').textContent = current.skill;
      $('pp-question').innerHTML = (current.html ? current.q.replace(/\n/g, '<br>') : textHtml(current.q)) +
        (current.image ? '<img class="pp-image" src="' + esc(current.image) + '" alt="Diagram for this question">' : '') +
        visualHtml(current);
      $('pp-feedback').hidden = true;
      $('pp-next').hidden = true;
      $('pp-hint').hidden = true;
      $('pp-hint').textContent = current.hint || '';
      $('pp-hint-toggle').hidden = !current.hint;
      $('pp-hint-toggle').textContent = 'Show hint';

      var choices = $('pp-choices'), input = $('pp-input');
      choices.hidden = !current.choices;
      $('pp-typed').hidden = !!current.choices;
      if (current.choices) {
        choices.innerHTML = current.choices.map(function (c, i) {
          return '<button type="button" class="pp-choice" data-choice="' + i + '">' + esc(c) + '</button>';
        }).join('');
        choices.firstChild.focus();
      } else {
        input.value = '';
        input.disabled = false;
        $('pp-check').disabled = false;
        setTimeout(function () { input.focus(); }, 30);
      }
    }

    function answer(given) {
      if (answered) return;
      answered = true;
      var correct = !!current.check(given);
      record(current.skill, correct);
      if (correct) score++;
      progressText();

      if (current.choices) {
        Array.prototype.forEach.call($('pp-choices').children, function (b) {
          var text = current.choices[Number(b.dataset.choice)];
          b.disabled = true;
          if (text === current.a) b.classList.add('is-right');
          else if (text === given) b.classList.add('is-wrong');
          else b.classList.add('is-dim');
        });
      } else {
        $('pp-input').disabled = true;
        $('pp-check').disabled = true;
      }
      var fb = $('pp-feedback');
      fb.className = 'pp-feedback ' + (correct ? 'is-right' : 'is-wrong');
      $('pp-verdict').textContent = correct ? 'Correct!' : 'Not quite. The answer is: ' + current.a;
      $('pp-why').textContent = current.why;
      fb.hidden = false;
      $('pp-next').hidden = false;
      $('pp-next').focus();
    }

    function next() {
      index++;
      if (index < problems.length) return showProblem();
      var all = load(PROGRESS);
      var prev = all[unit.id] || { best: 0, attempts: 0 };
      all[unit.id] = { best: Math.max(prev.best, score), total: problems.length, attempts: prev.attempts + 1, lastDate: new Date().toISOString().slice(0, 10) };
      save(PROGRESS, all);
      var pct = score / problems.length * 100;
      $('pp-score').textContent = score + ' / ' + problems.length;
      $('pp-score-label').textContent = score === problems.length ? 'Perfect! You’re ready for this unit.'
        : pct >= 60 ? 'Good work. Look back at the ones you missed.' : 'Keep practising. Try again and read each explanation.';
      $('pp-bar').style.width = pct + '%';
      $('pp-bar').className = pct >= 80 ? 'is-high' : pct >= 60 ? 'is-mid' : 'is-low';
      show('pp-summary');
    }

    // ─── Printed sheet: 10 questions round the skills, never the same written question twice ───
    function buildSheet() {
      var pools = unit.skills.map(function (s) { return { s: s, items: s.items ? shuffle(s.items) : null }; });
      var sheet = [];
      for (var round = 0; round < 10 && sheet.length < 10; round++) {
        pools.forEach(function (p) {
          if (sheet.length >= 10 || (p.items && !p.items.length)) return;
          var prob = makeProblem(p.s, p.items);
          if (prob) sheet.push(prob);
        });
      }
      var letter = function (i) { return String.fromCharCode(97 + i); };
      $('pp-sheet').innerHTML =
        '<div class="pp-sheet-head"><h1>Get ready: ' + esc(unit.name) + '</h1><p>' + esc(courseName) + ' · Prereq practice</p>' +
        '<div class="pp-name"><span>Name: ______________________________</span><span>Date: ______________</span></div></div>' +
        '<ol class="pp-sheet-qs">' + sheet.map(function (p) {
          return '<li><div>' + (p.html ? p.q.replace(/\n/g, '<br>') : textHtml(p.q)) + '</div>' +
            (p.image ? '<img class="pp-image" src="' + esc(p.image) + '" alt="">' : '') + visualHtml(p) +
            (p.choices ? '<p class="pp-sheet-choices">' + p.choices.map(function (c, j) { return letter(j) + ') ' + esc(c); }).join('<br>') + '</p>' : '<div class="pp-box"></div>') +
            '</li>';
        }).join('') + '</ol>' +
        '<div class="pp-key"><h2>Answer key</h2><ol>' + sheet.map(function (p) {
          var a = p.choices ? letter(p.choices.indexOf(p.a)) + ') ' + esc(p.a) : esc(p.a);
          return '<li><strong>' + a + '</strong><br><span>' + textHtml(p.why) + '</span></li>';
        }).join('') + '</ol></div>';
    }

    // ─── Events ───
    $('pp-start').addEventListener('click', begin);
    $('pp-retry').addEventListener('click', begin);
    $('pp-back').addEventListener('click', function () { renderHome(); show('pp-home'); });
    $('pp-home-btn').addEventListener('click', function () { renderHome(); show('pp-home'); });
    // Any print (this button, the viewer's Print button, Ctrl+P) gets a fresh sheet.
    window.addEventListener('beforeprint', buildSheet);
    $('pp-print-btn').addEventListener('click', function () { window.print(); });
    $('pp-choices').addEventListener('click', function (e) {
      var b = e.target.closest('[data-choice]');
      if (b) answer(current.choices[Number(b.dataset.choice)]);
    });
    $('pp-typed').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('pp-input').value.trim();
      if (v) answer(v);
    });
    $('pp-next').addEventListener('click', next);
    $('pp-hint-toggle').addEventListener('click', function () {
      var hidden = $('pp-hint').hidden = !$('pp-hint').hidden;
      $('pp-hint-toggle').textContent = hidden ? 'Show hint' : 'Hide hint';
    });
    if (bank.toggle) {
      var paint = function () {
        var on = bank.toggle.get();
        $('pp-toggle').textContent = bank.toggle.label + ': ' + (on ? 'on' : 'off');
        $('pp-toggle').setAttribute('aria-pressed', String(on));
      };
      $('pp-toggle').addEventListener('click', function () { bank.toggle.set(!bank.toggle.get()); paint(); });
      paint();
    }

    renderHome();
    show('pp-home');
  }

  document.addEventListener('DOMContentLoaded', start);
})();
