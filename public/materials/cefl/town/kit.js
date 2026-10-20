/* CEFL Town — the kit: shared work verbs for the missions after Payday (_games-context.md → CEFL Town → The kit).
   Built only on the engine's public api (api.panel, api.record, api.fx, api.mode …), so the engine and Payday are unchanged.
   Every graded verb is a panel that resolves a grade: 'first' (all right on the first try), 'second' (by the second try) or 'later'
   (after that, or when an answer was shown), or null when a help request is left for now. Tries before an answer shows: 2 in Real, 3 in
   Gentle; Gentle gives a hint after a wrong try. o.story: a chapter task (no pay wording, cannot be left). o.leave: a help request (it can
   be left before the first check). o.key / o.label / o.ch: record the first try in the report.
   Test hook: every panel puts solve(how) on its data, how = 'right' | 'second' | 'wrong', so a scripted player can finish any panel.
   Motion (api.fx) plays only after a check or a choice, never before it. */
(function () {
  'use strict';
  var T = window.CEFLTown = window.CEFLTown || {}, K = T.kit = {};
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(s, r) { return r.querySelector(s); }
  function each(s, r, fn) { Array.prototype.forEach.call(r.querySelectorAll(s), fn); }
  function maxTries(api) { return api.mode === 'real' ? 2 : 3; }
  function gradeOf(xs) { var w = 1; xs.forEach(function (x) { w = Math.max(w, x.shown ? 9 : (x.tries || 1)); }); return w === 1 ? 'first' : w === 2 ? 'second' : 'later'; }
  function doneWords(g, o) {
    if (o.story) return g === 'first' ? 'All right on the first try!' : g === 'second' ? 'All right by the second try.' : 'Done. Some answers were shown.';
    return g === 'first' ? 'All right on the first try! Full pay.' : g === 'second' ? 'Right by the second try. Half pay.' : 'Done. Some answers were shown, so no pay this time. Try again tomorrow.';
  }
  function mark(x) { return '<span class="ck-mark" aria-label="' + (x.ok ? 'right' : x.shown ? 'shown' : x.no ? 'not yet' : '') + '">' + (x.ok ? '<b class="ck-yes">✓</b>' : x.shown ? '•' : x.no ? '<b class="ck-no">✗</b>' : '') + '</span>'; }
  function recorder(api, o) { // the first try is recorded once; later tries add to it
    var done = false;
    return function (right) { if (!o.key) return; if (!done) { api.record(o.key, o.label || o.title, o.ch, !!right); done = true; } else if (api.S.ans[o.key]) api.S.ans[o.key].tries++; };
  }
  function refBox(o) { return o.ref ? '<details class="ct-ref"><summary>' + esc(o.refLabel || 'Show the facts') + '</summary>' + o.ref + '</details>' : ''; }
  function actions(o, fin, ids, checked) {
    return '<div class="ct-row ct-actions">' + (fin ? '<button class="ct-btn primary" type="button" id="' + ids[0] + '">' + esc(o.doneText || 'Done') + '</button>'
      : '<button class="ct-btn primary" type="button" id="' + ids[1] + '">' + esc(o.checkText || 'Check') + '</button>' + (o.leave && !checked ? '<button class="ct-btn" type="button" id="' + ids[2] + '">Leave it for now</button>' : '')) + '</div>';
  }
  K.esc = esc; K.gradeOf = gradeOf;
  /* A grade from api.ask's result (a help request asked as a question) */
  K.askGrade = function (r) { return r.first ? 'first' : r.picks === 2 ? 'second' : 'later'; };

  /* doc(head, lines): a small document. lines: [[name, sub, amount, tone ('ded' | 'net' | '')]] */
  K.doc = function (head, lines, foot) {
    return '<div class="ct-doc">' + (head ? '<div class="ct-doc-h">' + head + '</div>' : '') + lines.map(function (l) {
      return '<div class="ct-line' + (l[3] ? ' ' + l[3] : '') + '"><span class="what">' + l[0] + (l[1] ? '<small>' + l[1] + '</small>' : '') + '</span><span class="amt">' + (l[2] == null ? '' : l[2]) + '</span><span></span></div>'; }).join('') + (foot || '') + '</div>';
  };

  /* typed(api, o): typed reasoning, saved in S.typed[o.id]. o: { id, title, prompt, sub, min (8), rows } → the text */
  K.typed = function (api, o) {
    var S = api.S; S.typed = S.typed || {};
    return api.panel({ title: o.title || 'In your own words', name: o.name || 'typed', data: {}, render: function (body, done, ui) {
      body.innerHTML = (o.intro || '') + '<label class="ct-lab" for="kTp">' + esc(o.prompt) + '</label><textarea class="ct-inp" id="kTp" rows="' + (o.rows || 3) + '">' + esc(S.typed[o.id] || '') + '</textarea><p class="ct-small">' + esc(o.sub || 'Your teacher sees this in the report.') + '</p><div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="kTpGo" disabled>Save</button></div>';
      var t = $('#kTp', body), b = $('#kTpGo', body), min = o.min || 8;
      function upd() { b.disabled = t.value.trim().length < min; } t.addEventListener('input', upd); upd();
      b.addEventListener('click', function () { S.typed[o.id] = t.value.trim(); done(S.typed[o.id]); });
      ui.data.solve = function (text) { t.value = typeof text === 'string' && text.length >= min ? text : 'Test answer: ' + (o.prompt || '').slice(0, 40); upd(); b.click(); };
    } });
  };

  /* check(api, o): the "sign or dispute" verb for any document with at most one root mistake.
     o: { title, name, intro, facts, ref, refLabel, head, rows: [{ k, name, sub, val, tone }], root (the wrong line's k, or null),
          follows: { k: true } (lines wrong only because of the root), explain: fn(k) or { k: text } (why a flagged line checks out),
          signLabel, disputeLabel, gentleHint, warnLine, rightLine (fn(root) → text), okLine, badLine, stampOk, stampBad, story, leave, key, label, ch }
     After it resolves, o.out = { result: 'caught' | 'ok' | 'signed', misses }. Signing a wrong document always grades 'later'. */
  K.check = function (api, o) {
    var flagged = null, misses = 0, msg = '', msgOk = false, warned = false, acted = false, rec = recorder(api, o), rows = o.rows, root = o.root || null, follows = o.follows || {};
    function nameOf(k) { var r = rows.filter(function (x) { return x.k === k; })[0]; return r ? r.name : k; }
    function explain(k) { var e = typeof o.explain === 'function' ? o.explain(k) : (o.explain || {})[k]; return e || 'That line checks out.'; }
    return api.panel({ title: o.title, name: o.name || 'check', wide: true, data: { root: root }, render: function (body, done, ui) {
      function draw() {
        body.innerHTML = (o.intro ? '<p>' + o.intro + ' ' + esc(o.tapLine || 'Is a line wrong? Tap it, then dispute it.') + '</p>' : '') + (o.facts ? '<div class="ct-note">' + o.facts + '</div>' : '') + refBox(o) +
          '<div class="ct-doc">' + (o.head ? '<div class="ct-doc-h">' + o.head + '</div>' : '') + rows.map(function (r) {
            return '<button class="ct-flag" type="button" data-k="' + r.k + '" aria-pressed="' + (flagged === r.k) + '"><span class="what" style="font-weight:700">' + r.name + (r.sub ? '<small style="display:block;font-weight:400;color:#6b665d">' + r.sub + '</small>' : '') + '</span><span class="amt" style="font-weight:800;' + (r.tone === 'ded' ? 'color:#b42318' : r.tone === 'net' ? 'color:#2c7a4b' : '') + '">' + r.val + '</span><span class="flagmark">flagged</span></button>'; }).join('') + '</div>' +
          (msg ? '<p class="ct-fb ' + (msgOk ? 'yes' : 'no') + '">' + esc(msg) + '</p>' : '') +
          (api.mode === 'gentle' && o.gentleHint ? '<p class="ct-small">Gentle hint: ' + esc(o.gentleHint) + '</p>' : '') +
          '<div class="ct-row ct-actions"><button class="ct-btn" type="button" id="kcDispute"' + (flagged ? '' : ' disabled') + '>' + esc(o.disputeLabel || 'Dispute the flagged line') + '</button><button class="ct-btn primary" type="button" id="kcSign">' + esc(o.signLabel || 'Sign it') + '</button>' +
          (o.leave && !acted ? '<button class="ct-btn" type="button" id="kcLeave">Leave it for now</button>' : '') + '</div>';
        each('.ct-flag', body, function (b) { b.addEventListener('click', function () { flagged = flagged === b.dataset.k ? null : b.dataset.k; draw(); $('[data-k="' + b.dataset.k + '"]', body).focus(); }); });
        $('#kcDispute', body).addEventListener('click', dispute); $('#kcSign', body).addEventListener('click', sign);
        if ($('#kcLeave', body)) $('#kcLeave', body).addEventListener('click', function () { done(null); });
      }
      function dispute() {
        if (!flagged) return;
        if (!acted) rec(root && flagged === root); else rec(false);
        acted = true;
        if (root && flagged === root) { finish(true, 'caught', o.rightLine ? o.rightLine(root) : 'Caught it! The ' + nameOf(root) + ' line was wrong.'); return; }
        misses++; msgOk = false; msg = root && follows[flagged] ? (o.followLine || 'That line is wrong because a line above it is wrong. Where does the mistake start?') : explain(flagged);
        flagged = null; draw();
      }
      function sign() {
        if (!root) { if (!acted) rec(true); acted = true; finish(true, 'ok', o.okLine || 'Every line checks out.'); return; }
        if (!acted) rec(false); acted = true;
        if (api.mode === 'gentle' && !warned) { warned = true; misses++; msgOk = false; msg = o.warnLine || 'Wait! One line does not match the facts. Check again, or sign anyway.'; draw(); return; }
        misses = 9; finish(false, 'signed', o.badLine || 'Signed with a mistake. The ' + nameOf(root) + ' line was wrong.');
      }
      function finish(ok, result, line) {
        var g = !ok ? 'later' : misses === 0 ? 'first' : misses === 1 ? 'second' : 'later';
        o.out = { result: result, misses: misses };
        body.innerHTML = '<div class="ct-banner ' + (ok ? 'good' : 'bad') + '">' + esc(line) + '</div><div class="ck-after">' + (o.after ? o.after(result) : '') + '</div><p class="ct-small">' +
          (o.story ? (g === 'first' ? 'Right on the first try.' : g === 'second' ? 'Right on the second try.' : 'Next time, check every line first.') : g === 'first' ? 'Right on the first try. Full pay.' : g === 'second' ? 'Right on the second try. Half pay.' : 'No pay this time. Try another one tomorrow.') + '</p>' +
          '<div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="kcDone">' + esc(o.doneText || 'Done') + '</button></div>';
        $('#kcDone', body).addEventListener('click', function () { done(g); }); $('#kcDone', body).focus();
        var b = $('.ct-banner', body);
        if (result === 'caught') api.fx.stamp(b, o.stampBad || 'Disputed', 'bad'); else if (result === 'ok') api.fx.stamp(b, o.stampOk || 'Approved', 'good');
      }
      ui.data.solve = function (how) {
        if (how === 'wrong') { if (!root) { flagged = rows[0].k; dispute(); flagged = rows[rows.length - 1].k; dispute(); sign(); } else { sign(); if (!o.out) sign(); } }
        else {
          if (how === 'second') { var other = rows.filter(function (r) { return r.k !== root && !follows[r.k]; })[0]; if (other) { flagged = other.k; dispute(); } }
          if (root) { flagged = root; dispute(); } else sign();
        }
        var d = $('#kcDone', body); if (d) d.click();
      };
      draw();
    } });
  };

  /* proof(api, o): for each item, choose what went wrong (Payday's Town Hall case, for any mission).
     o: { title, name, intro, ref, refLabel, items: [{ id, title, facts, html, ans }], choices: [{ k, label }], hint: { k: text }, keyPrefix, labelPrefix, ch, stamp, doneLine } */
  K.proof = function (api, o) {
    var u = {}, max = maxTries(api), wasFin = false, items = o.items;
    return api.panel({ title: o.title, name: o.name || 'proof', wide: true, data: { rows: items.map(function (r) { return { id: r.id, ans: r.ans }; }) }, render: function (body, done, ui) {
      function fin() { return items.every(function (r) { return u[r.id] && (u[r.id].ok || u[r.id].shown); }); }
      function label(k) { return (o.choices.filter(function (c) { return c.k === k; })[0] || {}).label || k; }
      function draw() {
        var f = fin(), now = f && !wasFin; wasFin = f;
        body.innerHTML = (o.intro ? '<p>' + o.intro + '</p>' : '') + refBox(o) + '<div class="ct-items ck-cards">' + items.map(function (r) {
          var x = u[r.id] || {}, dn = x.ok || x.shown;
          return '<div class="ck-card"><b>' + esc(r.title) + '</b>' + (r.facts ? '<p class="ct-small" style="margin:2px 0 4px">' + r.facts + '</p>' : '') + (r.html || '') +
            '<label class="ct-small" for="kp-' + r.id + '"><b>' + esc(o.ask || 'What went wrong?') + '</b></label><select class="ct-inp ck-sel' + (x.ok ? ' ok' : x.no ? ' no' : '') + '" id="kp-' + r.id + '"' + (dn ? ' disabled' : '') + '><option value="">Choose one…</option>' +
            o.choices.map(function (c) { return '<option value="' + c.k + '"' + (x.v === c.k ? ' selected' : '') + '>' + esc(c.label) + '</option>'; }).join('') + '</select>' +
            '<p class="ct-fb ' + (x.ok ? 'yes' : x.no ? 'no' : '') + '">' + esc(x.ok ? (o.okWord || 'Proved.') + ' ✓' : x.shown ? 'It was this one: ' + label(r.ans) + '.' : x.hint || '') + '</p></div>';
        }).join('') + '</div>' + (f ? '<div class="ct-banner good">' + esc(o.doneLine || doneWords(gradeOf(items.map(function (r) { return u[r.id]; })), { story: true })) + '</div>' : '') +
          actions(o, f, ['kpDone', 'kpGo'], true);
        each('select', body, function (el) { el.addEventListener('change', function () { (u[el.id.slice(3)] = u[el.id.slice(3)] || {}).v = el.value; }); });
        if (f) $('#kpDone', body).addEventListener('click', function () { done(gradeOf(items.map(function (r) { return u[r.id]; }))); }); else $('#kpGo', body).addEventListener('click', check);
        if (now) { var cards = body.querySelectorAll('.ck-card'); items.forEach(function (r, i) { if (u[r.id].ok) setTimeout(function () { api.fx.stamp(cards[i], o.stamp || 'Proved', 'good'); }, i * 150); }); }
      }
      function check() {
        var first = null;
        items.forEach(function (r) {
          var x = u[r.id] || (u[r.id] = {}), right;
          if (x.ok || x.shown) return;
          if (!x.v) { x.no = 1; x.hint = 'Choose one.'; if (!first) first = r.id; return; }
          right = x.v === r.ans; x.tries = (x.tries || 0) + 1;
          if (o.keyPrefix) api.record(o.keyPrefix + r.id, (o.labelPrefix || '') + r.title, o.ch, right);
          if (right) { x.ok = 1; x.no = 0; x.hint = ''; } else if (x.tries >= max) { x.shown = 1; x.no = 0; x.v = r.ans; } else { x.no = 1; x.hint = api.mode === 'gentle' && o.hint && o.hint[r.ans] ? 'Not that one. ' + o.hint[r.ans] : 'Not that one. Look again.'; if (!first) first = r.id; }
        });
        draw(); api.save();
        var el = first && $('#kp-' + first, body); if (el) el.focus(); else { el = $('#kpDone', body); if (el) el.focus(); }
      }
      ui.data.solve = function (how) {
        var wrongK = function (r) { return o.choices.filter(function (c) { return c.k !== r.ans; })[0].k; };
        var rounds = how === 'right' ? ['r'] : how === 'second' ? ['w', 'r'] : ['w', 'w', 'w'];
        rounds.forEach(function (rd) { if (fin()) return; items.forEach(function (r) { var x = u[r.id] || (u[r.id] = {}); if (!x.ok && !x.shown) x.v = rd === 'r' ? r.ans : wrongK(r); }); check(); });
        var d = $('#kpDone', body); if (d) d.click();
      };
      draw();
    } });
  };

  /* fix(api, o): set each setting to the right option (Payday's Pay-O-Matic fix, for any mission).
     o: { title, name, intro, ref, refLabel, docTitle, docSub, settings: [{ k, name, opts, right, start, hint }], keyPrefix, labelPrefix, ch, doneHtml, stamp } */
  K.fix = function (api, o) {
    var u = {}, max = maxTries(api), wasFin = false, S = o.settings;
    S.forEach(function (st) { u[st.k] = { v: st.start == null ? -1 : st.start }; });
    return api.panel({ title: o.title, name: o.name || 'fix', wide: true, data: { rows: S.map(function (st) { return { k: st.k, ans: st.right }; }) }, render: function (body, done, ui) {
      function fin() { return S.every(function (st) { return u[st.k].ok || u[st.k].shown; }); }
      function draw() {
        var f = fin(), now = f && !wasFin; wasFin = f;
        body.innerHTML = (o.intro ? '<p>' + o.intro + '</p>' : '') + refBox(o) + '<div class="ct-doc"><div class="ct-doc-h"><b>' + esc(o.docTitle || 'Settings') + '</b><span>' + esc(o.docSub || '') + '</span></div>' + S.map(function (st) {
          var x = u[st.k], dn = x.ok || x.shown;
          return '<div class="ct-line ck-set"><label class="what" for="kf-' + st.k + '">' + esc(st.name) + '</label><select class="ct-inp ck-sel' + (x.ok ? ' ok' : x.no ? ' no' : '') + '" id="kf-' + st.k + '"' + (dn ? ' disabled' : '') + '>' + (x.v < 0 ? '<option value="-1">Choose…</option>' : '') +
            st.opts.map(function (op, i) { return '<option value="' + i + '"' + (x.v === i ? ' selected' : '') + '>' + esc(op) + '</option>'; }).join('') + '</select>' + mark(x) + (x.hint && !dn ? '<span class="hint">' + esc(x.hint) + '</span>' : '') + '</div>';
        }).join('') + '</div>' + (f ? '<div class="ck-after">' + (o.doneHtml || '') + '</div>' : '') + actions(o, f, ['kfDone', 'kfGo'], true);
        each('select', body, function (el) { el.addEventListener('change', function () { u[el.id.slice(3)].v = +el.value; }); });
        if (f) $('#kfDone', body).addEventListener('click', function () { done(gradeOf(S.map(function (st) { return u[st.k]; }))); }); else $('#kfGo', body).addEventListener('click', check);
        if (now) { api.fx.stamp($('.ct-doc', body), o.stamp || 'Fixed', 'good'); api.fx.pop($('.ck-after', body), 200); }
      }
      function check() {
        var first = null;
        S.forEach(function (st) {
          var x = u[st.k], right; if (x.ok || x.shown) return;
          right = x.v === st.right; x.tries = (x.tries || 0) + 1;
          if (o.keyPrefix) api.record(o.keyPrefix + st.k, (o.labelPrefix || '') + st.name, o.ch, right);
          if (right) { x.ok = 1; x.no = 0; x.hint = ''; } else if (x.tries >= max) { x.shown = 1; x.no = 0; x.v = st.right; x.hint = ''; } else { x.no = 1; x.hint = api.mode === 'gentle' && st.hint ? st.hint : 'Not yet.'; if (!first) first = st.k; }
        });
        draw(); api.save();
        var el = first && $('#kf-' + first, body); if (el) el.focus(); else { el = $('#kfDone', body); if (el) el.focus(); }
      }
      ui.data.solve = function (how) {
        var rounds = how === 'right' ? ['r'] : how === 'second' ? ['w', 'r'] : ['w', 'w', 'w'];
        rounds.forEach(function (rd) { if (fin()) return; S.forEach(function (st) { var x = u[st.k]; if (!x.ok && !x.shown) x.v = rd === 'r' ? st.right : (st.right + 1) % st.opts.length; }); check(); });
        var d = $('#kfDone', body); if (d) d.click();
      };
      draw();
    } });
  };

  /* sort(api, o): put each item in the right group (needs or wants, fixed or variable, growing or declining …).
     o: { title, name, intro, ref, refLabel, bins: [{ id, label, icon }], items: [{ id, text, icon, bin, why }], story, leave, key, label, ch, doneLine } */
  K.sort = function (api, o) {
    var u = {}, max = maxTries(api), wasFin = false, checked = false, rec = recorder(api, o), B = o.bins, I = o.items;
    return api.panel({ title: o.title, name: o.name || 'sort', wide: !!o.wide || B.length > 2, data: { rows: I.map(function (it) { return { id: it.id, ans: it.bin }; }) }, render: function (body, done, ui) {
      function fin() { return I.every(function (it) { return u[it.id] && (u[it.id].ok || u[it.id].shown); }); }
      function binOf(id) { return B.filter(function (b) { return b.id === id; })[0] || {}; }
      function draw() {
        var f = fin(), now = f && !wasFin, g = f ? gradeOf(I.map(function (it) { return u[it.id]; })) : null; wasFin = f;
        body.innerHTML = (o.intro ? '<p>' + o.intro + '</p>' : '') + refBox(o) + '<div class="ck-sort">' + I.map(function (it) {
          var x = u[it.id] || {}, dn = x.ok || x.shown;
          return '<div class="ck-sitem' + (x.ok ? ' ok' : x.no ? ' no' : '') + '"><span class="ck-stext">' + (it.icon ? '<span class="ck-ic" aria-hidden="true">' + it.icon + '</span>' : '') + '<span>' + it.text + '</span></span>' +
            '<span class="ck-bins" role="group" aria-label="' + esc(String(it.text).replace(/<[^>]+>/g, '')) + '">' + B.map(function (b) { return '<button class="ct-btn ck-bin" type="button" data-i="' + it.id + '" data-b="' + b.id + '" aria-pressed="' + (x.v === b.id) + '"' + (dn ? ' disabled' : '') + '>' + (b.icon ? '<span aria-hidden="true">' + b.icon + '</span> ' : '') + esc(b.label) + '</button>'; }).join('') + '</span>' + mark(x) +
            (x.hint && !dn ? '<span class="hint">' + esc(x.hint) + '</span>' : x.shown ? '<span class="hint">It goes in: ' + esc(binOf(it.bin).label) + (it.why ? '. ' + esc(it.why) : '') + '</span>' : '') + '</div>';
        }).join('') + '</div>' + (f ? '<div class="ct-banner ' + (g === 'later' ? 'bad' : 'good') + '">' + esc(o.doneLine && g !== 'later' ? o.doneLine : doneWords(g, o)) + '</div>' : '') + actions(o, f, ['ksDone', 'ksGo', 'ksLeave'], checked);
        each('.ck-bin', body, function (b) { b.addEventListener('click', function () { (u[b.dataset.i] = u[b.dataset.i] || {}).v = b.dataset.b; draw(); var n = $('[data-i="' + b.dataset.i + '"][data-b="' + b.dataset.b + '"]', body); if (n) n.focus(); }); });
        if (f) $('#ksDone', body).addEventListener('click', function () { done(g); });
        else { $('#ksGo', body).addEventListener('click', check); if ($('#ksLeave', body)) $('#ksLeave', body).addEventListener('click', function () { done(null); }); }
        if (now) api.fx.pop($('.ct-banner', body));
      }
      function check() {
        var first = null, allRight = true;
        I.forEach(function (it) {
          var x = u[it.id] || (u[it.id] = {}); if (x.ok || x.shown) return;
          if (!x.v) { x.no = 1; x.hint = 'Choose a group.'; allRight = false; if (!first) first = it.id; return; }
          checked = true; x.tries = (x.tries || 0) + 1;
          if (x.v === it.bin) { x.ok = 1; x.no = 0; x.hint = ''; } else { allRight = false; if (x.tries >= max) { x.shown = 1; x.no = 0; x.v = it.bin; } else { x.no = 1; x.hint = api.mode === 'gentle' && it.why ? 'Not yet. ' + it.why : 'Not yet.'; if (!first) first = it.id; } }
        });
        if (checked) rec(allRight);
        draw(); api.save();
        var el = first && $('[data-i="' + first + '"]', body); if (el) el.focus(); else { el = $('#ksDone', body); if (el) el.focus(); }
      }
      ui.data.solve = function (how) {
        var rounds = how === 'right' ? ['r'] : how === 'second' ? ['w', 'r'] : ['w', 'w', 'w'];
        rounds.forEach(function (rd) { if (fin()) return; I.forEach(function (it) { var x = u[it.id] || (u[it.id] = {}); if (!x.ok && !x.shown) x.v = rd === 'r' ? it.bin : B.filter(function (b) { return b.id !== it.bin; })[0].id; }); check(); });
        var d = $('#ksDone', body); if (d) d.click();
      };
      draw();
    } });
  };

  /* inspect(api, o): tap everything that is wrong in a scene (safety hazards, résumé problems, red flags), then report it.
     o: { title, name, intro, ref, refLabel, find (e.g. 'Find the 4 hazards'), spots: [{ id, label, icon, bad, why, fine }], cols, story, leave, key, label, ch, reportText, doneLine }
     A spot that is fine and flagged gets its "fine" line in Gentle; Real only says how many flags are wrong and how many were missed. */
  K.inspect = function (api, o) {
    var on = {}, tries = 0, max = maxTries(api), msg = '', fin = false, shown = false, rec = recorder(api, o), P = o.spots, nBad = P.filter(function (p) { return p.bad; }).length;
    return api.panel({ title: o.title, name: o.name || 'inspect', wide: true, data: { bad: P.filter(function (p) { return p.bad; }).map(function (p) { return p.id; }) }, render: function (body, done, ui) {
      function grade() { return shown ? 'later' : tries <= 1 ? 'first' : tries === 2 ? 'second' : 'later'; }
      function draw() {
        var g = fin ? grade() : null;
        body.innerHTML = (o.intro ? '<p>' + o.intro + '</p>' : '') + refBox(o) + '<p class="ck-find"><b>' + esc(o.find || ('Find the ' + nBad + ' problems')) + '</b> <span class="ct-small">Flagged: ' + Object.keys(on).length + '</span></p>' +
          '<div class="ck-scene" style="grid-template-columns:repeat(' + (o.cols || 3) + ',minmax(0,1fr))">' + P.map(function (p) {
            var cls = fin ? (p.bad ? ' bad' : '') + (on[p.id] && !p.bad ? ' wrongflag' : '') : on[p.id] ? ' on' : '';
            return '<button class="ck-spot' + cls + '" type="button" data-s="' + p.id + '" aria-pressed="' + !!on[p.id] + '"' + (fin ? ' disabled' : '') + '><span class="ck-sic" aria-hidden="true">' + (p.icon || '•') + '</span><span>' + p.label + '</span>' +
              (fin && p.bad ? '<span class="ck-why">' + esc(p.why || '') + '</span>' : '') + '<span class="ck-flagmark">' + (fin ? (p.bad ? (on[p.id] || shown ? '⚠ found' : '⚠') : '') : 'flagged') + '</span></button>';
          }).join('') + '</div>' + (msg ? '<p class="ct-fb ' + (fin ? 'yes' : 'no') + '" role="status">' + esc(msg) + '</p>' : '') +
          (fin ? '<div class="ct-banner ' + (g === 'later' ? 'bad' : 'good') + '">' + esc(o.doneLine && g !== 'later' ? o.doneLine : doneWords(g, o)) + '</div>' : '') +
          '<div class="ct-row ct-actions">' + (fin ? '<button class="ct-btn primary" type="button" id="kiDone">' + esc(o.doneText || 'Done') + '</button>' : '<button class="ct-btn primary" type="button" id="kiGo">' + esc(o.reportText || 'Report what I found') + '</button>' + (o.leave && !tries ? '<button class="ct-btn" type="button" id="kiLeave">Leave it for now</button>' : '')) + '</div>';
        each('.ck-spot', body, function (b) { b.addEventListener('click', function () { var id = b.dataset.s; if (on[id]) delete on[id]; else on[id] = 1; draw(); $('[data-s="' + id + '"]', body).focus(); }); });
        if (fin) $('#kiDone', body).addEventListener('click', function () { done(grade()); });
        else { $('#kiGo', body).addEventListener('click', check); if ($('#kiLeave', body)) $('#kiLeave', body).addEventListener('click', function () { done(null); }); }
      }
      function check() {
        if (!Object.keys(on).length) { msg = 'Tap what you think is a problem first.'; draw(); return; }
        tries++;
        var wrongs = P.filter(function (p) { return on[p.id] && !p.bad; }), missed = P.filter(function (p) { return p.bad && !on[p.id]; });
        rec(!wrongs.length && !missed.length);
        if (!wrongs.length && !missed.length) { fin = true; msg = o.foundLine || 'You found every one.'; }
        else if (tries >= max) { fin = true; shown = true; msg = 'Here is everything that was wrong.'; }
        else {
          wrongs.forEach(function (p) { delete on[p.id]; });
          msg = (wrongs.length ? (api.mode === 'gentle' ? wrongs.map(function (p) { return p.fine || (String(p.label).replace(/<[^>]+>/g, '') + ' is fine.'); }).join(' ') + ' ' : wrongs.length + (wrongs.length === 1 ? ' flag was' : ' flags were') + ' not a problem. ') : '') +
            (missed.length ? 'You missed ' + missed.length + '.' + (api.mode === 'gentle' && missed[0].hint ? ' Hint: ' + missed[0].hint : '') : '');
        }
        draw(); api.save();
        if (fin) { var b = $('.ct-banner', body); api.fx.pop(b); b && api.fx.stamp(b, o.stamp || (shown ? 'Shown' : 'Inspected'), shown ? 'bad' : 'good'); $('#kiDone', body).focus(); } else $('#kiGo', body).focus();
      }
      ui.data.solve = function (how) {
        var bad = P.filter(function (p) { return p.bad; }), good = P.filter(function (p) { return !p.bad; });
        if (how !== 'right') { var n = how === 'second' ? 1 : max; for (var i = 0; i < n && !fin; i++) { on = {}; on[good[0] ? good[0].id : bad[0].id] = 1; check(); } }
        if (!fin) { on = {}; bad.forEach(function (p) { on[p.id] = 1; }); check(); }
        var d = $('#kiDone', body); if (d) d.click();
      };
      draw();
    } });
  };

  /* pick(api, o): compare and decide. Not marked right or wrong; the choice and the reason are saved in S.typed[o.id].
     o: { id, title, name, intro, options: [{ k, title, icon, lines: [[label, value]], note }], prompt, reasonPrompt, min (8), tradeoff (a second box) } → { pick, reason, tradeoff } */
  K.pick = function (api, o) {
    var S = api.S; S.typed = S.typed || {};
    var cur = S.typed[o.id] && typeof S.typed[o.id] === 'object' ? S.typed[o.id] : { pick: null, reason: '', tradeoff: '' };
    return api.panel({ title: o.title, name: o.name || 'pick', wide: true, data: { options: o.options.map(function (x) { return x.k; }) }, render: function (body, done, ui) {
      function ok() { return cur.pick && (o.noReason || String(cur.reason).trim().length >= (o.min || 8)) && (!o.tradeoff || String(cur.tradeoff).trim().length >= (o.min || 8)); }
      function draw() {
        body.innerHTML = (o.intro ? '<p>' + o.intro + '</p>' : '') + '<div class="ct-items ck-cards">' + o.options.map(function (x) {
          return '<div class="ck-card ck-opt' + (cur.pick === x.k ? ' on' : '') + '">' + (x.icon ? '<span class="ck-big" aria-hidden="true">' + x.icon + '</span>' : '') + '<b>' + esc(x.title) + '</b>' + (x.lines ? '<div class="ck-kv">' + x.lines.map(function (l) { return '<span>' + l[0] + '</span><b>' + l[1] + '</b>'; }).join('') + '</div>' : '') + (x.note ? '<p class="ct-small">' + x.note + '</p>' : '') +
            '<button class="ct-btn" type="button" data-p="' + x.k + '" aria-pressed="' + (cur.pick === x.k) + '">' + esc(o.pickText || 'Choose this') + '</button></div>'; }).join('') + '</div>' +
          (o.noReason ? '' : '<label class="ct-lab" for="kkR">' + esc(o.reasonPrompt || 'Why? Give one reason.') + '</label><textarea class="ct-inp" id="kkR" rows="2">' + esc(cur.reason || '') + '</textarea>') +
          (o.tradeoff ? '<label class="ct-lab" for="kkT">' + esc(o.tradeoff) + '</label><textarea class="ct-inp" id="kkT" rows="2">' + esc(cur.tradeoff || '') + '</textarea>' : '') +
          (o.footNote ? '<p class="ct-small">' + o.footNote + '</p>' : '') + '<div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="kkGo"' + (ok() ? '' : ' disabled') + '>' + esc(o.saveText || 'Save my choice') + '</button></div>';
        each('[data-p]', body, function (b) { b.addEventListener('click', function () { cur.pick = b.dataset.p; draw(); $('[data-p="' + cur.pick + '"]', body).focus(); }); });
        var r = $('#kkR', body), t = $('#kkT', body), go = $('#kkGo', body);
        function upd() { if (r) cur.reason = r.value; if (t) cur.tradeoff = t.value; go.disabled = !ok(); }
        if (r) r.addEventListener('input', upd); if (t) t.addEventListener('input', upd);
        go.addEventListener('click', function () { S.typed[o.id] = { pick: cur.pick, reason: String(cur.reason || '').trim(), tradeoff: String(cur.tradeoff || '').trim() }; done(S.typed[o.id]); });
      }
      ui.data.solve = function (k) { cur.pick = k && o.options.some(function (x) { return x.k === k; }) ? k : o.options[0].k; cur.reason = 'Because it fits my goal best.'; cur.tradeoff = 'It takes more time.'; draw(); $('#kkGo', body).click(); };
      draw();
    } });
  };

  /* order(api, o): put items in order with ▲ ▼ (a pathway, steps, a ranking). o.answer (ids in order) makes it graded; without it, the
     order is saved as a ranking in S.typed[o.id]. o: { id, title, name, intro, items: [{ id, text, icon }], answer, story, leave, key, label, ch, doneLine, topLabel, bottomLabel } */
  K.order = function (api, o) {
    var S = api.S; S.typed = S.typed || {};
    var cur = o.start ? o.start.slice() : o.items.map(function (x) { return x.id; }), tries = 0, max = maxTries(api), fin = false, shown = false, msg = '', rec = recorder(api, o);
    function byId(id) { return o.items.filter(function (x) { return x.id === id; })[0]; }
    return api.panel({ title: o.title, name: o.name || 'order', wide: !!o.wide, data: { answer: o.answer || null }, render: function (body, done, ui) {
      function grade() { return !o.answer ? 'first' : shown ? 'later' : tries <= 1 ? 'first' : tries === 2 ? 'second' : 'later'; }
      function draw() {
        body.innerHTML = (o.intro ? '<p>' + o.intro + '</p>' : '') + (o.topLabel ? '<p class="ct-small"><b>▲ ' + esc(o.topLabel) + '</b></p>' : '') + '<ol class="ck-order">' + cur.map(function (id, i) {
          var it = byId(id), place = fin && o.answer ? (o.answer[i] === id ? ' ok' : ' no') : '';
          return '<li class="ck-oitem' + place + '"><span class="ck-onum">' + (i + 1) + '</span><span class="ck-otext">' + (it.icon ? '<span aria-hidden="true">' + it.icon + '</span> ' : '') + it.text + '</span>' +
            (fin ? '' : '<button class="ct-btn ck-mv" type="button" data-up="' + i + '" aria-label="Move ' + esc(String(it.text).replace(/<[^>]+>/g, '')) + ' up"' + (i ? '' : ' disabled') + '>▲</button><button class="ct-btn ck-mv" type="button" data-dn="' + i + '" aria-label="Move ' + esc(String(it.text).replace(/<[^>]+>/g, '')) + ' down"' + (i < cur.length - 1 ? '' : ' disabled') + '>▼</button>') + '</li>';
        }).join('') + '</ol>' + (o.bottomLabel ? '<p class="ct-small"><b>▼ ' + esc(o.bottomLabel) + '</b></p>' : '') + (msg ? '<p class="ct-fb ' + (fin ? 'yes' : 'no') + '" role="status">' + esc(msg) + '</p>' : '') +
          (fin && o.answer ? '<div class="ct-banner ' + (grade() === 'later' ? 'bad' : 'good') + '">' + esc(o.doneLine && grade() !== 'later' ? o.doneLine : doneWords(grade(), o)) + '</div>' : '') +
          '<div class="ct-row ct-actions">' + (fin ? '<button class="ct-btn primary" type="button" id="koDone">Done</button>' : '<button class="ct-btn primary" type="button" id="koGo">' + esc(o.answer ? 'Check the order' : (o.saveText || 'Save my order')) + '</button>' + (o.leave && !tries ? '<button class="ct-btn" type="button" id="koLeave">Leave it for now</button>' : '')) + '</div>';
        each('[data-up]', body, function (b) { b.addEventListener('click', function () { var i = +b.dataset.up, t = cur[i - 1]; cur[i - 1] = cur[i]; cur[i] = t; draw(); var n = $('[data-up="' + (i - 1) + '"]', body) || $('[data-dn="' + (i - 1) + '"]', body); if (n) n.focus(); }); });
        each('[data-dn]', body, function (b) { b.addEventListener('click', function () { var i = +b.dataset.dn, t = cur[i + 1]; cur[i + 1] = cur[i]; cur[i] = t; draw(); var n = $('[data-dn="' + (i + 1) + '"]', body) || $('[data-up="' + (i + 1) + '"]', body); if (n) n.focus(); }); });
        if (fin) $('#koDone', body).addEventListener('click', function () { done(grade()); });
        else { $('#koGo', body).addEventListener('click', check); if ($('#koLeave', body)) $('#koLeave', body).addEventListener('click', function () { done(null); }); }
      }
      function check() {
        if (!o.answer) { S.typed[o.id] = cur.slice(); done(cur.slice()); return; }
        tries++;
        var right = cur.every(function (id, i) { return o.answer[i] === id; }), n = cur.filter(function (id, i) { return o.answer[i] === id; }).length;
        rec(right);
        if (right) { fin = true; msg = ''; } else if (tries >= max) { fin = true; shown = true; cur = o.answer.slice(); msg = 'Here is the right order.'; }
        else msg = api.mode === 'gentle' ? n + ' of ' + cur.length + ' are in the right place.' + (o.hint ? ' ' + o.hint : '') : 'Not yet.';
        draw(); api.save(); if (fin) { api.fx.pop($('.ct-banner', body)); $('#koDone', body).focus(); }
      }
      ui.data.solve = function (how) {
        if (!o.answer) { check(); return; }
        if (how !== 'right') { var n = how === 'second' ? 1 : max; for (var i = 0; i < n && !fin; i++) { cur = o.answer.slice().reverse(); check(); } }
        if (!fin) { cur = o.answer.slice(); check(); }
        var d = $('#koDone', body); if (d) d.click();
      };
      draw();
    } });
  };

  /* chips(api, o): pick up to N from each group (interests, values, work preferences). Not marked. Saved in S.typed[o.id] =
     { group k: [chip k, …], text k: '…' }. o: { id, title, name, intro, groups: [{ k, label, min, max, opts: [{ k, label, icon }] }], texts: [{ k, label, min }] } */
  K.chips = function (api, o) {
    var S = api.S; S.typed = S.typed || {};
    var cur = S.typed[o.id] && typeof S.typed[o.id] === 'object' ? JSON.parse(JSON.stringify(S.typed[o.id])) : {};
    o.groups.forEach(function (g) { if (!Array.isArray(cur[g.k])) cur[g.k] = []; });
    return api.panel({ title: o.title, name: o.name || 'chips', wide: true, data: {}, render: function (body, done, ui) {
      function ok() { return o.groups.every(function (g) { return cur[g.k].length >= (g.min || 1); }) && (o.texts || []).every(function (t) { return String(cur[t.k] || '').trim().length >= (t.min || 3); }); }
      function draw(focus) {
        body.innerHTML = (o.intro ? '<p>' + o.intro + '</p>' : '') + o.groups.map(function (g) {
          return '<fieldset class="ct-sw"><legend>' + esc(g.label) + ' <span class="ct-small">(pick ' + (g.min && g.min !== g.max ? g.min + '–' : 'up to ') + g.max + ')</span></legend><div class="ct-row ct-wrap">' + g.opts.map(function (c) {
            var on = cur[g.k].indexOf(c.k) >= 0; return '<button class="ct-btn" type="button" data-g="' + g.k + '" data-c="' + c.k + '" aria-pressed="' + on + '"' + (!on && cur[g.k].length >= g.max ? ' disabled' : '') + '>' + (c.icon ? '<span aria-hidden="true">' + c.icon + '</span> ' : '') + esc(c.label) + '</button>'; }).join('') + '</div></fieldset>';
        }).join('') + (o.texts || []).map(function (t) { return '<label class="ct-lab" for="kc-' + t.k + '">' + esc(t.label) + '</label><input class="ct-inp ct-wide" id="kc-' + t.k + '" maxlength="80" autocomplete="off" value="' + esc(cur[t.k] || '') + '">'; }).join('') +
          '<div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="kcGo"' + (ok() ? '' : ' disabled') + '>' + esc(o.saveText || 'Save') + '</button></div>';
        each('[data-c]', body, function (b) { b.addEventListener('click', function () { var a = cur[b.dataset.g], i = a.indexOf(b.dataset.c); if (i >= 0) a.splice(i, 1); else a.push(b.dataset.c); draw('[data-g="' + b.dataset.g + '"][data-c="' + b.dataset.c + '"]'); }); });
        (o.texts || []).forEach(function (t) { $('#kc-' + t.k, body).addEventListener('input', function (e) { cur[t.k] = e.target.value; $('#kcGo', body).disabled = !ok(); }); });
        $('#kcGo', body).addEventListener('click', function () { S.typed[o.id] = cur; done(cur); });
        if (focus) { var f = $(focus, body); if (f) f.focus(); }
      }
      ui.data.solve = function (pick) { o.groups.forEach(function (g) { cur[g.k] = (pick && pick[g.k]) || g.opts.slice(0, g.min || 1).map(function (c) { return c.k; }); }); (o.texts || []).forEach(function (t) { cur[t.k] = 'Soccer and art club'; }); draw(); $('#kcGo', body).click(); };
      draw();
    } });
  };

  /* timeline(api, o): "run it". Time passes: rows pop in one after another and a total counts. Nothing to answer; the numbers are
     already decided by the model. o: { title, name, intro, rows: [{ label, html, tone }], total: { label, from, to, fmt }, outro, doneText } */
  K.timeline = function (api, o) {
    return api.panel({ title: o.title, name: o.name || 'timeline', wide: !!o.wide, data: {}, render: function (body, done, ui) {
      body.innerHTML = (o.intro ? '<p>' + o.intro + '</p>' : '') + '<ol class="ck-time">' + o.rows.map(function (r) { return '<li class="' + (r.tone || '') + '"><span class="ck-tl">' + r.label + '</span><span>' + r.html + '</span></li>'; }).join('') + '</ol>' +
        (o.total ? '<p class="ck-total">' + esc(o.total.label) + ' <b class="ck-tv">' + (o.total.fmt || api.money)(o.total.to) + '</b></p>' : '') + (o.outro || '') +
        '<div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="ktGo">' + esc(o.doneText || 'OK') + '</button></div>';
      $('#ktGo', body).addEventListener('click', function () { done(); });
      each('.ck-time li', body, function (li, i) { api.fx.pop(li, Math.min(i, 12) * 110); });
      if (o.total) api.fx.count($('.ck-tv', body), o.total.from || 0, o.total.to, o.total.fmt || api.money);
      ui.data.solve = function () { $('#ktGo', body).click(); };
    } });
  };

  /* hero(api, o): the side story's last scene. o: { who, lines, medal, icon, kicker, title, thanks: [[who, line]] } */
  K.hero = async function (api, o) {
    api.fx.face('all');
    await api.say(o.who, o.lines);
    for (var i = 0; i < (o.thanks || []).length; i++) await api.say(o.thanks[i][0], o.thanks[i][1]);
    api.give(o.medal, o.icon || '🏅', o.who);
    api.fx.confetti(40); api.fx.banner(o.kicker || 'Town Hero', o.title);
    if (o.reply) await api.say('you', o.reply);
  };

  /* notes(list): a numbered list for a Case notes item. list: [html, …] */
  K.notes = function (list) { return list.length ? '<ol class="ck-notes">' + list.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>' : '<p>No notes yet.</p>'; };
  /* table(rows, head): a small report table. rows: [[cell, …]] */
  K.table = function (rows, head) { return '<div class="ct-tablewrap"><table class="ct-rep">' + (head ? '<thead><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead>' : '') + '<tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; };
  /* wrote(S, labels): "What I wrote" for the report. labels: [[typed id, label]] */
  K.wrote = function (S, labels) {
    var rows = [], t = S.typed || {};
    labels.forEach(function (l) { var v = t[l[0]]; if (v == null || v === '') return; if (typeof v === 'object' && !Array.isArray(v)) { rows.push([esc(l[1]) + (v.pick ? ': <b>' + esc(l[2] ? l[2](v.pick) : v.pick) + '</b>' : ''), esc(v.reason || '') + (v.tradeoff ? '<br><i>Trade-off:</i> ' + esc(v.tradeoff) : '')]); } else if (Array.isArray(v)) rows.push([esc(l[1]), esc(v.map(function (x) { return l[2] ? l[2](x) : x; }).join(' → '))]); else rows.push([esc(l[1]), esc(v)]); });
    return '<h3>What I wrote</h3>' + (rows.length ? K.table(rows) : '<p>Nothing yet.</p>');
  };

  /* Mission helpers every kit mission needs, so a mission does not carry its own copy. */
  K.fmt = function (c) { return T.api.money(c); }; // cents → "$1,234.56"
  K.fmtW = function (c) { return Math.round(c) % 100 === 0 ? K.fmt(c).replace(/\.00$/, '') : K.fmt(c); }; // whole dollars drop ".00"
  K.step = function (id, run) { return { id: id, run: run }; };
  /* gossip(list, api): a mission's news lines with {name} filled in */
  K.gossip = function (list, api) { var nm = api && api.profile ? api.profile.name : 'you'; return list.map(function (g) { return { id: g.id, who: g.who, after: g.after, lines: g.lines.map(function (l) { return l.replace(/\{name\}/g, nm); }) }; }); };
  /* A one-minute game played as a help request: its result → the pay rule's grade (null = left for now) */
  K.gameGrade = function (r) { return !r ? null : r.tier === 'great' ? 'first' : r.tier === 'ok' ? 'second' : 'later'; };
  K.payTiers = function (pay) { return { great: 'Full pay: ' + K.fmt(pay) + '.', ok: 'Half pay: ' + K.fmt(pay / 2) + '.', poor: 'No pay this time. Try again tomorrow.' }; };
  K.TIER_WORD = { great: 'great ✓', ok: 'steady', poor: 'rough', skip: 'skipped' }; // a game result in the report
  K.planLine = function (api) { return api.profile.plan.length ? 'My Plan wall: ' + api.profile.plan.map(function (x) { return x.title + ': ' + x.text; }).join(' ') : 'My Plan wall. Finish a mission to pin a page here.'; };
})();
