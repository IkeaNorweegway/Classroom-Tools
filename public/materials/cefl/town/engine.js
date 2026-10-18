/* CEFL Town — engine. Shared by every CEFL mission (see _games-context.md → CEFL Town).
   A mission file calls CEFLTown.mission({...}); the entry page calls CEFLTown.start(missionId).
   Loop rule (_games-context.md rule 9): frames run only while something moves or animates; the static map is cached. */
(function () {
  'use strict';
  var T = window.CEFLTown = window.CEFLTown || {};
  var A, Wd;                       // art, world (set in start)
  var missions = {};
  T.mission = function (def) { missions[def.id] = def; };

  /* ── Small helpers ── */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function h(tag, cls, html, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function copy(o) { return JSON.parse(JSON.stringify(o)); }
  function shuffle(a) { var i, j, t; for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var debug = /[?&]debug=1/.test(location.search), debugSave = /[?&]save=1/.test(location.search); // save=1: tests keep saving on
  var reduceMotion = !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DIRS = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }, DIRCOL = { left: 0, down: 1, up: 2, right: 3 };
  T.esc = esc;

  /* ── State ── */
  var M = null;                    // mission def
  var G = null;                    // saved game: { v, mode, map, x, y, dir, ch, si, S, done, tut, snap }
  var P = null;                    // profile: { v, name, look, closet, met, finished, plan }
  var app, cv, ctx, stage, scale = 3, maps = {}, map = null, cache = null, frames = 0;
  var me = { x: 0, y: 0, dir: 'down', px: 0, py: 0, moving: null, frame: 0 };
  var held = null, path = [], busy = 0, fade = 0, questT = null, bobUntil = 0, onArrive = null;
  var objects = {};                // mission-placed things you can interact with: id → { map, x, y, tile, label }
  var waiters = [];                // quest promises: { id, resolve }
  var ui = null;                   // the open prompt, for the test hook

  /* ── Saves ── */
  var PROFILE_KEY = 'cefl-town-profile-v1';
  function saveKey() { return 'cefl-town-' + M.id + '-v1'; }
  function loadJSON(k) { if (debug && !debugSave) return null; try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function storeJSON(k, v) { if (debug && !debugSave) return; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function validProfile(p) { return p && p.v === 1 && typeof p.name === 'string' && p.look && typeof p.look.base === 'number' && Array.isArray(p.closet) && Array.isArray(p.plan) && p.met && Array.isArray(p.finished); }
  function validGame(g) { return g && g.v === 1 && (g.mode === 'gentle' || g.mode === 'real') && typeof g.ch === 'number' && typeof g.si === 'number' && typeof g.x === 'number' && g.S && (!M.validate || M.validate(g.S)); }
  function save() { if (G) { G.map = map ? map.id : 'town'; G.x = me.x; G.y = me.y; G.dir = me.dir; storeJSON(saveKey(), G); } if (P) storeJSON(PROFILE_KEY, P); }
  T.save = save;

  /* ── DOM ── */
  function buildDOM(root) {
    root.innerHTML = '';
    app = h('div', 'ct-app', null, root);
    var top = h('header', 'ct-top', '<div class="ct-unit">' + esc(M.unitLabel) + '</div><h1>' + esc(M.title) + '</h1><div class="ct-ican">' + esc(M.iCan) + '</div>', app);
    var hud = h('div', 'ct-hud', null, app);
    h('div', 'ct-widgets', null, hud).id = 'ctWidgets';
    h('span', 'ct-spacer', null, hud);
    var chap = h('span', 'ct-chap', null, hud); chap.id = 'ctChap';
    var mapb = h('button', 'ct-btn', 'Map', hud); mapb.id = 'ctMapBtn'; mapb.type = 'button'; mapb.title = 'Town map (M)';
    var bag = h('button', 'ct-btn', 'Bag', hud); bag.id = 'ctBag'; bag.type = 'button';
    var menu = h('button', 'ct-btn', 'Menu', hud); menu.id = 'ctMenu'; menu.type = 'button';
    var q = h('button', 'ct-quest', '', app); q.id = 'ctQuest'; q.type = 'button';
    stage = h('div', 'ct-stage', null, app);
    cv = h('canvas', 'ct-canvas', null, stage); cv.tabIndex = 0; cv.setAttribute('role', 'application');
    cv.setAttribute('aria-label', 'The town. Use the arrow keys to walk and Enter to talk, or tap where you want to go.');
    h('div', 'ct-where', '', stage).id = 'ctWhere';
    var dlg = h('div', 'ct-dialog', null, stage); dlg.id = 'ctDialog'; dlg.hidden = true; dlg.setAttribute('aria-live', 'polite');
    h('div', 'ct-toast', '', stage).id = 'ctToast';
    var area = h('div', 'ct-area', '', stage); area.id = 'ctArea'; area.setAttribute('aria-live', 'polite');
    var modal = h('div', 'ct-modal', null, app); modal.id = 'ctModal'; modal.hidden = true;
    h('div', 'ct-box', null, modal).id = 'ctBox';
    var coach = h('div', 'ct-coach', '<p id="ctCoachTxt"></p><div class="ct-row"><span id="ctCoachN" class="ct-small"></span><span class="ct-spacer"></span><button class="ct-btn" type="button" id="ctCoachSkip">Skip</button><button class="ct-btn primary" type="button" id="ctCoachNext">Next</button></div>', app);
    coach.id = 'ctCoach'; coach.hidden = true; coach.setAttribute('role', 'dialog');
    h('p', 'ct-foot', esc(M.foot || 'This is a model. The people and businesses are made up.'), app);
    ctx = cv.getContext('2d');
    mapb.addEventListener('click', openTownMap); bag.addEventListener('click', openBag); menu.addEventListener('click', openMenu); q.addEventListener('click', autoWalkQuest);
    $('#ctCoachNext').addEventListener('click', coachNext); $('#ctCoachSkip').addEventListener('click', coachEnd);
    modal.addEventListener('click', function (e) { if (e.target === modal && modal.dataset.closable) closeModal(); });
    bindInput();
    window.addEventListener('resize', resize);
    window.addEventListener('pagehide', save);
  }

  /* ── Sizing: integer scale, ×3 on wide screens, ×2 when narrow ── */
  var baseScale = 3;
  function resize() {
    var w = Math.min(960, stage.clientWidth || 600);
    baseScale = w >= 700 ? 3 : 2;
    var rows = baseScale === 3 ? 11 : 12, hgt = Math.min(rows * 16 * baseScale, Math.round(w * (baseScale === 3 ? 0.62 : 0.9)));
    cv.width = w; cv.height = hgt; cv.style.height = hgt + 'px';
    ctx.imageSmoothingEnabled = false;
    fitScale(); kick();
  }
  /* The town uses the base scale; a room zooms in to fill the view (up to ×5), so its few key things stand out */
  function fitScale() {
    scale = baseScale;
    if (map && map.id !== 'town') scale = Math.max(baseScale, Math.min(5, Math.floor(cv.width / (map.w * 16)), Math.floor(cv.height / (map.h * 16))));
  }

  /* ── Maps ── */
  function getMap(id) {
    if (!maps[id]) maps[id] = id === 'town' ? Wd.town() : Wd.room(id);
    return maps[id];
  }
  function prerender(m) {
    var c = document.createElement('canvas'), x = c.getContext('2d'), i, tx, ty;
    c.width = m.w * 16; c.height = m.h * 16;
    for (i = 0; i < m.w * m.h; i++) { tx = (i % m.w) * 16; ty = Math.floor(i / m.w) * 16; A.drawTile(x, m.ground[i], tx, ty); A.drawTile(x, m.over[i], tx, ty); A.drawTile(x, m.over2[i], tx, ty); }
    if (m.wall) { // back wall: plaster, a baseboard, windows
      x.fillStyle = '#efe4cf'; x.fillRect(16, m.wall.y * 16, (m.w - 2) * 16, 16); x.fillStyle = '#d9c9a8'; x.fillRect(16, m.wall.y * 16 + 12, (m.w - 2) * 16, 4); x.fillStyle = '#b39b74'; x.fillRect(16, m.wall.y * 16 + 15, (m.w - 2) * 16, 1);
      m.wall.windows.forEach(function (wx) { A.drawTile(x, 335, wx * 16, m.wall.y * 16 - 2); });
    }
    if (m.mat) { x.fillStyle = '#7a5a3a'; x.fillRect(m.mat.x * 16 + 2, m.mat.y * 16 + 3, 12, 10); x.fillStyle = '#9c7a52'; x.fillRect(m.mat.x * 16 + 3, m.mat.y * 16 + 4, 10, 8); }
    if (m.board) drawBoard(x, m.board.x * 16, m.board.y * 16);
    (m.draws || []).forEach(function (d) { drawLandmark(x, d); });
    Object.keys(objects).forEach(function (k) { var o = objects[k]; if (o.map !== m.id) return; if (m.rugs && o.label && !o.noRug) rug(x, o.x * 16, o.y * 16); if (o.tile != null) A.drawTile(x, o.tile, o.x * 16, o.y * 16); if (o.draw) drawObject(x, o.draw, o.x * 16, o.y * 16); });
    return c;
  }
  /* Small drawn objects a mission can place: a corkboard, a letter, and goal items */
  function drawObject(x, kind, px, py) {
    function r(c, a, b, w, hh) { x.fillStyle = c; x.fillRect(px + a, py + b, w, hh); }
    if (kind === 'cork') { r('#6b4428', 1, 1, 14, 11); r('#c99a5b', 2, 2, 12, 9); r('#fffdf8', 3, 3, 4, 3); r('#fffdf8', 9, 3, 4, 4); r('#fffdf8', 5, 7, 4, 3); r('#b42318', 4, 3, 1, 1); r('#2c7a4b', 10, 3, 1, 1); r('#4f78c9', 6, 7, 1, 1); r('#6b4428', 3, 12, 2, 4); r('#6b4428', 11, 12, 2, 4); }
    if (kind === 'letter') { r('#8d5243', 3, 6, 10, 7); r('#fffdf8', 4, 7, 8, 5); r('#c9bfae', 4, 7, 4, 2); r('#c9bfae', 8, 7, 4, 2); r('#b42318', 7, 9, 2, 2); }
    if (kind === 'laptop') { r('#2f2f38', 3, 4, 10, 7); r('#7fd0e8', 4, 5, 8, 5); r('#8d8ca6', 2, 11, 12, 2); }
    if (kind === 'key') { r('#e2b13c', 3, 6, 5, 5); r('#fffdf8', 4, 7, 3, 3); r('#e2b13c', 8, 8, 6, 1); r('#e2b13c', 12, 9, 1, 2); r('#e2b13c', 10, 9, 1, 2); }
    if (kind === 'cert') { r('#8d5243', 2, 3, 12, 10); r('#fffdf8', 3, 4, 10, 8); r('#94631a', 5, 6, 6, 1); r('#94631a', 5, 8, 4, 1); r('#e2b13c', 10, 9, 3, 3); }
  }
  /* Landmarks drawn over the tiles: field lines, the fountain, bridge rails, roof emblems */
  function drawLandmark(x, d) {
    var px = d.x * 16, py = d.y * 16, i;
    function r(c, a, b, w, hh) { x.fillStyle = c; x.fillRect(a, b, w, hh); }
    if (d.kind === 'field') {
      var fx = px + 10, fy = py + 10, fw = d.w * 16 - 20, fh = d.h * 16 - 20, cx = fx + fw / 2, cy = fy + fh / 2;
      x.strokeStyle = 'rgba(255,255,255,0.85)'; x.lineWidth = 2; x.strokeRect(fx, fy, fw, fh);
      x.beginPath(); x.moveTo(cx, fy); x.lineTo(cx, fy + fh); x.stroke();
      x.beginPath(); x.arc(cx, cy, 14, 0, Math.PI * 2); x.stroke();
      x.strokeRect(fx, cy - 18, 18, 36); x.strokeRect(fx + fw - 18, cy - 18, 18, 36);
      r('#f2f0e8', fx - 2, cy - 8, 3, 16); r('#f2f0e8', fx + fw - 1, cy - 8, 3, 16);
    }
    if (d.kind === 'fountain') {
      var ox = px + 32, oy = py + 32;
      r('#8d8ca6', ox - 7, oy - 7, 14, 14); r('#c9c9d6', ox - 5, oy - 5, 10, 10); r('#7fd0e8', ox - 3, oy - 3, 6, 6);
      for (i = 0; i < 8; i++) { var a = i * Math.PI / 4; r('#e8f8ff', Math.round(ox + Math.cos(a) * 11) - 1, Math.round(oy + Math.sin(a) * 11) - 1, 2, 2); }
      r('#ffffff', ox - 1, oy - 12, 2, 6);
    }
    if (d.kind === 'bridge') {
      r('#8d8ca6', px - 2, py - 2, 3, d.h * 16 + 4); r('#8d8ca6', px + d.w * 16 - 1, py - 2, 3, d.h * 16 + 4);
      for (i = 0; i <= d.h * 2; i++) { r('#5c6278', px - 3, py - 2 + i * 8, 5, 3); r('#5c6278', px + d.w * 16 - 2, py - 2 + i * 8, 5, 3); }
    }
    if (d.kind === 'clock') { x.fillStyle = '#5c4a32'; x.beginPath(); x.arc(px + 8, py + 13, 11, 0, Math.PI * 2); x.fill(); x.fillStyle = '#fffdf8'; x.beginPath(); x.arc(px + 8, py + 13, 9, 0, Math.PI * 2); x.fill(); r('#1f1d1a', px + 7, py + 6, 2, 8); r('#1f1d1a', px + 8, py + 12, 6, 2); }
    if (d.kind === 'cross') { r('#fffdf8', px - 3, py + 3, 22, 22); r('#b42318', px + 5, py + 6, 6, 16); r('#b42318', px, py + 11, 16, 6); }
    if (d.kind === 'coin') { x.fillStyle = '#b5862a'; x.beginPath(); x.arc(px + 8, py + 13, 10, 0, Math.PI * 2); x.fill(); x.fillStyle = '#e8c35c'; x.beginPath(); x.arc(px + 8, py + 13, 8, 0, Math.PI * 2); x.fill(); x.fillStyle = '#6b4510'; x.font = 'bold 11px system-ui, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('$', px + 8, py + 14); }
  }
  /* A rug marks the people and things that matter in a room */
  function rug(x, px, py) { x.fillStyle = 'rgba(148,99,26,0.28)'; x.fillRect(px - 1, py + 1, 18, 15); x.strokeStyle = 'rgba(148,99,26,0.65)'; x.lineWidth = 1; x.strokeRect(px + 0.5, py + 2.5, 15, 12); }
  function drawBoard(x, px, py) { // the My Plan wall at home: one pinned card per finished mission
    x.fillStyle = '#8d5243'; x.fillRect(px - 6, py + 1, 28, 13); x.fillStyle = '#e8d9b5'; x.fillRect(px - 5, py + 2, 26, 11);
    var n = P ? P.plan.length : 0, i;
    for (i = 0; i < Math.min(n, 6); i++) { x.fillStyle = ['#94631a', '#4f78c9', '#42a379', '#c2504d', '#8a5cc2', '#2e9c9c'][i]; x.fillRect(px - 3 + (i % 3) * 8, py + 3 + Math.floor(i / 3) * 5, 6, 4); }
  }
  function enter(id, x, y, dir) {
    map = getMap(id); cache = prerender(map); fitScale();
    me.x = x; me.y = y; me.dir = dir || me.dir; me.px = x * 16; me.py = y * 16; me.moving = null; path = [];
    where(); questMarker(); kick();
  }
  T.refreshMap = function () { if (map) { cache = prerender(map); kick(); } };

  /* ── People ── */
  function people() { // everyone on the current map: base townspeople merged with the mission's changes
    var base = Wd.PEOPLE, extra = M.people ? M.people(G.S) : {}, out = [], ids = {}, k;
    for (k in base) ids[k] = 1; for (k in extra) ids[k] = 1;
    for (k in ids) {
      var p = Object.assign({}, base[k] || {}, extra[k] || {}, { id: k });
      if (p.hidden || !p.look) continue;
      if (p.map === (map && map.id)) out.push(p);
    }
    return out;
  }
  function personAt(x, y) { var ps = people(), i; for (i = 0; i < ps.length; i++) if (ps[i].x === x && ps[i].y === y) return ps[i]; return null; }
  function person(id) { var base = Wd.PEOPLE[id] || {}, extra = (M.people ? M.people(G.S) : {})[id] || {}; return Object.assign({}, base, extra, { id: id }); }
  function objectAt(x, y) { for (var k in objects) { var o = objects[k]; if (o.map === map.id && o.x === x && o.y === y) return Object.assign({ id: k }, o); } return null; }
  function blocked(x, y) { var o; return Wd.solidAt(map, x, y) || !!personAt(x, y) || (!!(o = objectAt(x, y)) && o.solid !== false); }

  /* ── Loop ── */
  var raf = 0, last = 0;
  function kick() { if (!raf) raf = requestAnimationFrame(tick); }
  function tick(t) {
    raf = 0; frames++;
    var dt = last ? Math.min(50, t - last) : 16; last = t;
    var animating = step(dt);
    if (fade > 0) { fade = Math.max(0, fade - dt / 220); animating = true; }
    if (t < bobUntil) animating = true;
    draw(t);
    if (animating) kick(); else last = 0;
  }
  var STEP_MS = 150;
  function step(dt) {
    if (me.moving) {
      var mv = me.moving; mv.t += dt;
      var f = Math.min(1, mv.t / (reduceMotion ? 60 : STEP_MS));
      me.px = (mv.fx + (mv.tx - mv.fx) * f) * 16; me.py = (mv.fy + (mv.ty - mv.fy) * f) * 16;
      if (f >= 1) { me.moving = null; me.x = mv.tx; me.y = mv.ty; me.frame = (me.frame + 1) % 2; arrived(); }
      return true;
    }
    if (busy || !$('#ctModal').hidden) { held = null; path = []; return false; }
    var d = path.length ? path.shift() : held;
    if (d) { tryMove(d); return !!me.moving || path.length > 0; }
    return false;
  }
  function tryMove(d) {
    me.dir = d;
    var nx = me.x + DIRS[d][0], ny = me.y + DIRS[d][1];
    if (map.doors[nx + ',' + ny]) { path = []; held = null; useDoor(map.doors[nx + ',' + ny]); return; }
    if (blocked(nx, ny)) { path = []; return; }
    me.moving = { fx: me.x, fy: me.y, tx: nx, ty: ny, t: 0 };
    sfx('step');
  }
  function arrived() {
    var k = me.x + ',' + me.y;
    if (map.exits && map.exits[k]) { var b = map.id, sp = getMap('town').spots[b]; fadeIn(); enter('town', sp.x, sp.y, 'down'); save(); fire('door:town'); return; }
    if (coach && coach.waitMove) coachNext();
    if (!path.length && onArrive) { var fn = onArrive; onArrive = null; fn(); }
    where();
  }
  function fadeIn() { if (!reduceMotion) { fade = 1; kick(); } }
  function useDoor(id) {
    var b = Wd.building(id);
    if (M.doorOpen && !M.doorOpen(id, G.S)) {
      var line = (M.lockedLine && M.lockedLine(id, G.S)) || (b.name + ' is closed right now.');
      say(null, line); return;
    }
    var m = getMap(id); fadeIn(); enter(id, m.spawn.x, m.spawn.y, 'up'); save();
    fire('door:' + id);
  }

  /* ── Drawing ── */
  function camera() {
    var vw = cv.width / scale, vh = cv.height / scale, mw = map.w * 16, mh = map.h * 16, cx, cy;
    cx = mw <= vw ? (mw - vw) / 2 : Math.max(0, Math.min(mw - vw, me.px + 8 - vw / 2));
    cy = mh <= vh ? (mh - vh) / 2 : Math.max(0, Math.min(mh - vh, me.py + 8 - vh / 2));
    return { x: Math.round(cx * scale) / scale, y: Math.round(cy * scale) / scale, vw: vw, vh: vh };
  }
  function draw(t) {
    if (!map || !cache) return;
    var cam = camera(), s = scale;
    ctx.fillStyle = map.id === 'town' ? '#2f4a3a' : '#1f1d1a'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.imageSmoothingEnabled = false;
    var sx = Math.max(0, cam.x), sy = Math.max(0, cam.y), sw = Math.min(cache.width - sx, cam.vw), sh = Math.min(cache.height - sy, cam.vh);
    ctx.drawImage(cache, sx, sy, sw, sh, (sx - cam.x) * s, (sy - cam.y) * s, sw * s, sh * s);
    // labels on the buildings, drawn at screen resolution so they stay sharp
    if (map.labels) {
      ctx.font = '700 ' + (s === 3 ? 13 : 10) + 'px "Atkinson Hyperlegible Next", system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      map.labels.forEach(function (l) {
        var lx = ((l.x + l.w / 2) * 16 - cam.x) * s, ly = (l.y * 16 + 8 - cam.y) * s;
        if (lx < -200 || lx > cv.width + 200 || ly < -20 || ly > cv.height + 20) return;
        var tw = Math.min(ctx.measureText(l.text).width + 12, (l.w * 16 - 4) * s);
        ctx.fillStyle = 'rgba(31,29,26,0.78)'; ctx.fillRect(lx - tw / 2, ly - 9 * s / 3 - 3, tw, 18 * s / 3 + 6);
        ctx.fillStyle = '#fff8e8'; ctx.fillText(l.text, lx, ly + 1, tw - 8);
      });
    }
    // people and you, back to front
    var ps = people();
    if (map.rugs) ps.forEach(function (p) { ctx.fillStyle = 'rgba(148,99,26,0.28)'; ctx.fillRect(Math.round((p.x * 16 - 1 - cam.x) * s), Math.round((p.y * 16 + 1 - cam.y) * s), 18 * s, 15 * s); });
    var list = ps.map(function (p) { return { y: p.y * 16, draw: function () { drawPerson(p.look, p.dir || 'down', 0, p.x * 16, p.y * 16, cam); } }; });
    list.push({ y: me.py, draw: function () { drawPerson(myLook(), me.dir, me.moving ? 1 + me.frame : 0, me.px, me.py, cam); } });
    list.sort(function (a, b) { return a.y - b.y; }).forEach(function (o) { o.draw(); });
    // quest marker and "!" bubbles
    var tgt = questTarget();
    if (tgt && tgt.map === map.id) {
      var bob = t < bobUntil && !reduceMotion ? Math.round(Math.sin(t / 120) * 2) : 0;
      marker((tgt.x * 16 + 8 - cam.x) * s, (tgt.y * 16 - 6 + bob - cam.y) * s, tgt.person);
    }
    if (fade > 0) { ctx.fillStyle = 'rgba(0,0,0,' + fade.toFixed(2) + ')'; ctx.fillRect(0, 0, cv.width, cv.height); }
  }
  function myLook() { var l = Object.assign({}, P ? P.look : { base: 0, skin: 's3', hair: 'black', shirt: 'teal', pants: '#3d4a6b' }); if (G && G.S && M.outfit) l.outfit = M.outfit(G.S) || 'none'; return l; }
  function drawPerson(look, dir, fr, px, py, cam) {
    var sp = A.sprite(look);
    ctx.fillStyle = 'rgba(31,29,26,0.22)'; ctx.beginPath(); ctx.ellipse(Math.round((px + 8 - cam.x) * scale), Math.round((py + 15 - cam.y) * scale), 5 * scale, 1.6 * scale, 0, 0, Math.PI * 2); ctx.fill();
    ctx.drawImage(sp, DIRCOL[dir] * 16, fr * 16, 16, 16, Math.round((px - cam.x) * scale), Math.round((py - cam.y) * scale), 16 * scale, 16 * scale);
  }
  function marker(x, y, isPerson) {
    var s = scale;
    if (isPerson) {
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#1f1d1a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.rect(x - 5 * s, y - 13 * s, 10 * s, 10 * s); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#b42318'; ctx.font = '800 ' + (8 * s) + 'px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('!', x, y - 7.5 * s);
    } else {
      ctx.fillStyle = '#f5b82e'; ctx.strokeStyle = '#1f1d1a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x - 5 * s, y - 10 * s); ctx.lineTo(x + 5 * s, y - 10 * s); ctx.lineTo(x, y - 3 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  }

  /* ── Where you are (text, for everyone, and for screen readers) ── */
  var lastArea = '';
  function showArea(name) {
    var el = $('#ctArea'); if (!el || !name || name === lastArea) return;
    lastArea = name; el.textContent = name; el.classList.add('on');
    clearTimeout(showArea.tm); showArea.tm = setTimeout(function () { el.classList.remove('on'); }, 2200);
  }
  /* The Town Map: the whole town, building names, districts, where you are and where your goal is */
  var townCache = null;
  function openTownMap() {
    if (!$('#ctModal').hidden) { closeModal(); return; }
    openModal('Town map', '<div class="ct-mapwrap"><canvas id="ctMapCv" role="img" aria-label="Map of the town"></canvas></div><p class="ct-small">\u25cf You are here. \u2605 Your goal. Press M or Close to go back.</p>');
    $('#ctBox').classList.add('wide');
    var tm = getMap('town'); townCache = townCache || prerender(tm);
    var c = $('#ctMapCv'), wrapW = Math.min(c.parentNode.clientWidth || 600, 900), k = wrapW / townCache.width, x = c.getContext('2d');
    c.width = Math.round(townCache.width * k); c.height = Math.round(townCache.height * k);
    x.imageSmoothingEnabled = true; x.drawImage(townCache, 0, 0, c.width, c.height);
    x.fillStyle = 'rgba(31,29,26,0.18)'; x.fillRect(0, 0, c.width, c.height);
    x.textAlign = 'center'; x.textBaseline = 'middle';
    (tm.districts || []).forEach(function (d) {
      if (d.name === 'College Walk') return;
      x.font = 'italic 700 ' + Math.max(10, Math.round(13 * k * 1.6)) + 'px "Atkinson Hyperlegible Next", system-ui, sans-serif';
      x.fillStyle = 'rgba(255,248,232,0.9)'; x.strokeStyle = 'rgba(31,29,26,0.8)'; x.lineWidth = 3;
      var dy = d.ly != null ? d.ly : d.name === 'Riverside Park' ? d.y + 6.5 : d.y + 0.9, dx = d.lx != null ? d.lx : d.x + d.w / 2; // label spot
      x.strokeText(d.name, dx * 16 * k, dy * 16 * k); x.fillText(d.name, dx * 16 * k, dy * 16 * k);
    });
    x.font = '700 ' + Math.max(9, Math.round(11 * k * 1.5)) + 'px "Atkinson Hyperlegible Next", system-ui, sans-serif';
    tm.labels.forEach(function (l) {
      var lx = (l.x + l.w / 2) * 16 * k, ly = (l.y + 1.6) * 16 * k, tw = x.measureText(l.text).width + 8;
      x.fillStyle = 'rgba(31,29,26,0.85)'; x.fillRect(lx - tw / 2, ly - 8, tw, 16); x.fillStyle = '#fff8e8'; x.fillText(l.text, lx, ly + 1);
    });
    var meX, meY;
    if (map.id === 'town') { meX = me.x; meY = me.y; } else { var sp = tm.spots[map.id]; meX = sp.x; meY = sp.y; }
    var goal = quest && quest.id ? locate(quest.id) : null;
    if (goal && goal.map !== 'town') { var gs = tm.spots[goal.map]; goal = gs ? { x: gs.x, y: gs.y - 1 } : null; }
    if (goal) { x.font = '900 ' + Math.max(18, Math.round(30 * k)) + 'px system-ui, sans-serif'; x.fillStyle = '#f5b82e'; x.strokeStyle = '#1f1d1a'; x.lineWidth = 3; x.strokeText('\u2605', (goal.x + 0.5) * 16 * k, (goal.y + 0.5) * 16 * k); x.fillText('\u2605', (goal.x + 0.5) * 16 * k, (goal.y + 0.5) * 16 * k); }
    x.fillStyle = '#b42318'; x.strokeStyle = '#fff'; x.lineWidth = 3; x.beginPath(); x.arc((meX + 0.5) * 16 * k, (meY + 0.5) * 16 * k, Math.max(5, 9 * k), 0, Math.PI * 2); x.fill(); x.stroke();
  }
  function where() {
    var w = $('#ctWhere'), txt = '';
    if (!map) return;
    if (map.id !== 'town') txt = 'Inside: ' + Wd.building(map.id).name;
    else {
      var near = null, best = 3, k;
      for (k in map.spots) { var s = map.spots[k], d = Math.abs(s.x - me.x) + Math.abs(s.y - me.y); if (d < best && Wd.building(k)) { best = d; near = k; } }
      txt = near ? 'Outside: ' + Wd.building(near).name : '';
    }
    w.textContent = txt; w.hidden = !txt;
    showArea(map.id === 'town' ? Wd.districtAt(map, me.x, me.y) : Wd.building(map.id).name);
  }

  /* ── Input ── */
  var KEYS = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', a: 'left', d: 'right', w: 'up', s: 'down', A: 'left', D: 'right', W: 'up', S: 'down' };
  function bindInput() {
    document.addEventListener('keydown', function (e) {
      if (!$('#ctModal').hidden) { if (e.key === 'Escape' && $('#ctModal').dataset.closable) closeModal(); return; }
      if (!$('#ctDialog').hidden) { if ((e.key === 'Enter' || e.key === ' ') && dlgAdvance && document.activeElement && !/BUTTON|INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); dlgAdvance(); } return; }
      if (/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '')) return;
      if (KEYS[e.key]) { e.preventDefault(); held = KEYS[e.key]; path = []; kick(); }
      else if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === cv) { e.preventDefault(); interactFront(); }
      else if ((e.key === 'm' || e.key === 'M') && !busy) { e.preventDefault(); openTownMap(); }
    });
    document.addEventListener('keyup', function (e) { if (KEYS[e.key] && held === KEYS[e.key]) held = null; });
    cv.addEventListener('click', function (e) {
      if (busy || !map) return;
      cv.focus({ preventScroll: true });
      var r = cv.getBoundingClientRect(), cam = camera(), tx = Math.floor(((e.clientX - r.left) * (cv.width / r.width) / scale + cam.x) / 16), ty = Math.floor(((e.clientY - r.top) * (cv.height / r.height) / scale + cam.y) / 16);
      tapTile(tx, ty);
    });
  }
  function tapTile(tx, ty) {
    var p = personAt(tx, ty), o = objectAt(tx, ty), door = map.doors[tx + ',' + ty];
    if (p || o || door) { // walk next to it, then use it
      if (Math.abs(tx - me.x) + Math.abs(ty - me.y) === 1) { faceTo(tx, ty); door ? useDoor(door) : interactAt(tx, ty); return; }
      var goal = door ? [tx, ty + 1] : nearestFree(tx, ty);
      if (!goal) return;
      walkPath(goal[0], goal[1], function () { faceTo(tx, ty); if (door) useDoor(door); else interactAt(tx, ty); });
      return;
    }
    walkPath(tx, ty, null);
  }
  function faceTo(tx, ty) { var dx = tx - me.x, dy = ty - me.y; me.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); kick(); }
  function nearestFree(tx, ty) {
    var opts = [[tx, ty + 1], [tx - 1, ty], [tx + 1, ty], [tx, ty - 1]].filter(function (c) { return !blocked(c[0], c[1]); });
    opts.sort(function (a, b) { return (Math.abs(a[0] - me.x) + Math.abs(a[1] - me.y)) - (Math.abs(b[0] - me.x) + Math.abs(b[1] - me.y)); });
    return opts[0] || null;
  }
  /* Breadth-first path on the current map */
  function bfs(tx, ty) {
    if (tx === me.x && ty === me.y) return [];
    if (!Wd.inb(map, tx, ty) || blocked(tx, ty)) return null;
    var w = map.w, prev = {}, q = [me.x + me.y * w], seen = {}, i, c, cx, cy;
    seen[q[0]] = 1;
    while (q.length) {
      c = q.shift(); cx = c % w; cy = Math.floor(c / w);
      if (cx === tx && cy === ty) break;
      for (var d in DIRS) {
        var nx = cx + DIRS[d][0], ny = cy + DIRS[d][1], n = nx + ny * w;
        if (seen[n] || !Wd.inb(map, nx, ny) || blocked(nx, ny)) continue;
        seen[n] = 1; prev[n] = [c, d]; q.push(n);
      }
    }
    if (!seen[tx + ty * w]) return null;
    var out = []; c = tx + ty * w;
    while (prev[c]) { out.unshift(prev[c][1]); c = prev[c][0]; }
    return out;
  }
  function walkPath(tx, ty, then) {
    var p = bfs(tx, ty);
    if (!p) return false;
    path = p; onArrive = then || null; held = null;
    if (!p.length && then) { onArrive = null; then(); }
    kick();
    return true;
  }
  function interactFront() { interactAt(me.x + DIRS[me.dir][0], me.y + DIRS[me.dir][1]); }
  function interactAt(x, y) {
    if (busy) return;
    var door = map.doors[x + ',' + y];
    if (door) { useDoor(door); return; }
    var p = personAt(x, y), o = objectAt(x, y);
    if (p) { p.dir = { left: 'right', right: 'left', up: 'down', down: 'up' }[me.dir]; facing[p.id] = p.dir; talk(p.id); return; }
    if (o) talk(o.id);
  }
  var facing = {};
  function talk(id) {
    if (fire(id)) return;
    var lines = M.talk ? M.talk(id, G.S, api) : null;
    if (lines === true) return; // the mission handled it
    if (!lines) { var p = Wd.PEOPLE[id] || (M.people && M.people(G.S)[id]) || objects[id]; lines = p ? (p.name ? p.name + ' waves.' : (p.label || '...')) : null; }
    if (lines) say(Wd.PEOPLE[id] || (M.people && M.people(G.S)[id]) ? id : null, lines);
  }
  /* A quest waits for an id: a person, an object, or 'door:<building>' */
  function fire(id) {
    for (var i = 0; i < waiters.length; i++) if (waiters[i].id === id) { var w = waiters.splice(i, 1)[0]; w.resolve(id); return true; }
    return false;
  }

  /* ── Quest line and auto-walk ── */
  var quest = null; // { text, id }
  function setQuest(text, id) {
    quest = text ? { text: text, id: id } : null;
    var b = $('#ctQuest');
    b.innerHTML = quest ? '<span class="ct-star" aria-hidden="true">★</span><span class="ct-qt">' + esc(text) + '</span><span class="ct-go">Walk there →</span>' : '<span class="ct-qt">Explore the town.</span>';
    b.disabled = !quest || !id;
    questMarker();
  }
  function questMarker() { bobUntil = performance.now() + 1600; kick(); }
  /* Where the current quest target is: { map, x, y, person } on the current map, or the door that leads toward it */
  function questTarget() {
    if (!quest || !quest.id || !map) return null;
    var id = quest.id, loc = locate(id);
    if (!loc) return null;
    if (loc.map === map.id) return loc;
    if (map.id !== 'town') return { map: map.id, x: map.mat.x, y: map.mat.y - 1, person: false, exit: true };
    var sp = getMap('town').spots[loc.map];
    return sp ? { map: 'town', x: sp.x, y: sp.y - 1, person: false, door: loc.map } : null;
  }
  function locate(id) {
    if (/^door:/.test(id)) { var b = id.slice(5); if (b === 'town') return null; var sp = getMap('town').spots[b]; return sp ? { map: 'town', x: sp.x, y: sp.y - 1, person: false, door: b } : null; }
    var p = person(id);
    if (p && p.look && !p.hidden) return { map: p.map, x: p.x, y: p.y, person: true };
    var o = objects[id];
    if (o) return { map: o.map, x: o.x, y: o.y, person: true };
    return null;
  }
  function autoWalkQuest() {
    var t = questTarget();
    if (!t || busy) return;
    cv.focus({ preventScroll: true });
    if (t.exit) { walkPath(map.mat.x, map.mat.y, null); return; }
    if (t.door) { walkPath(t.x, t.y + 1, function () { me.dir = 'up'; useDoor(t.door); }); return; }
    tapTile(t.x, t.y);
  }

  /* ── Dialogue ── */
  var dlgAdvance = null;
  function portrait(id) {
    var p = id === 'you' ? { look: myLook(), name: P.name } : person(id);
    if (!p || !p.look) return '';
    var c = document.createElement('canvas'); c.width = 48; c.height = 48; var x = c.getContext('2d'); x.imageSmoothingEnabled = false;
    x.drawImage(A.sprite(p.look), 16, 0, 16, 11, 0, 0, 48, 33);
    return '<img class="ct-face" alt="" src="' + c.toDataURL() + '">';
  }
  function nameOf(id) { if (!id) return ''; if (id === 'you') return P.name; var p = person(id); return p.name || ''; }
  function type(el, text, done) {
    var full = text, i = 0, timer;
    if (reduceMotion || debug) { el.innerHTML = full; done(); return function () {}; }
    var plain = full.replace(/<[^>]+>/g, '');
    function stepT() { i += 2; if (i >= plain.length) { el.innerHTML = full; done(); return; } el.textContent = plain.slice(0, i); timer = setTimeout(stepT, 18); }
    stepT();
    return function () { clearTimeout(timer); el.innerHTML = full; done(); };
  }
  /* say(who, lines): who is a person id, 'you', or null for the narrator. Resolves when the last line is closed. */
  function say(who, lines) {
    lines = [].concat(lines);
    return new Promise(function (res) {
      var d = $('#ctDialog'), i = 0;
      busy++;
      function show() {
        var txtDone = false;
        d.innerHTML = (who ? portrait(who) : '') + '<div class="ct-dbody">' + (who ? '<div class="ct-dname">' + esc(nameOf(who)) + '</div>' : '') + '<p class="ct-dtext"></p><button class="ct-btn ct-next" type="button">' + (i < lines.length - 1 ? 'Next ▶' : 'OK ▶') + '</button></div>';
        d.hidden = false;
        var finish = type($('.ct-dtext', d), lines[i], function () { txtDone = true; });
        var btn = $('.ct-next', d);
        dlgAdvance = function () { if (!txtDone) { finish(); return; } sfx('blip'); i++; if (i < lines.length) show(); else close(); };
        btn.addEventListener('click', function (e) { e.stopPropagation(); dlgAdvance(); });
        d.onclick = function () { dlgAdvance(); };
        btn.focus({ preventScroll: true });
        ui = { type: 'say', who: who, text: lines[i], advance: function () { finish(); dlgAdvance(); } };
      }
      function close() { d.hidden = true; d.innerHTML = ''; d.onclick = null; dlgAdvance = null; busy--; ui = null; cv.focus({ preventScroll: true }); res(); }
      show();
    });
  }
  /* ask(who, q, key, label, ch): q = { text, opts: [[text, right, feedback], …] }. A wrong pick explains and lets you try again.
     The first pick is recorded once under key. */
  function ask(who, q, key, label, ch) {
    return new Promise(function (res) {
      var d = $('#ctDialog'), order = shuffle(q.opts.map(function (o, i) { return i; })), tried = false, picked = [];
      busy++;
      function render(fb, ok) {
        d.innerHTML = (who ? portrait(who) : '') + '<div class="ct-dbody">' + (who ? '<div class="ct-dname">' + esc(nameOf(who)) + '</div>' : '') + '<p class="ct-dtext">' + esc(q.text) + '</p><div class="ct-opts">' +
          order.map(function (i) { var cls = picked.indexOf(i) >= 0 ? (q.opts[i][1] ? ' yes' : ' no') : ''; return '<button class="ct-btn ct-opt' + cls + '" type="button" data-i="' + i + '"' + (cls || ok ? ' disabled' : '') + '>' + esc(q.opts[i][0]) + '</button>'; }).join('') +
          '</div>' + (fb ? '<p class="ct-fb ' + (ok ? 'yes' : 'no') + '">' + esc(fb) + '</p>' : '') + (ok ? '<button class="ct-btn ct-next primary" type="button">OK ▶</button>' : '') + '</div>';
        d.hidden = false;
        Array.prototype.forEach.call(d.querySelectorAll('.ct-opt'), function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); pick(+b.dataset.i); }); });
        var nx = $('.ct-next', d); if (nx) { nx.addEventListener('click', function (e) { e.stopPropagation(); close(); }); nx.focus({ preventScroll: true }); }
        else { var f = d.querySelector('.ct-opt:not([disabled])'); if (f) f.focus({ preventScroll: true }); }
        d.onclick = null; dlgAdvance = null;
        ui = { type: 'ask', who: who, q: q, key: key, pick: pick, close: ok ? close : null, right: q.opts.map(function (o) { return !!o[1]; }) };
      }
      function pick(i) {
        var o = q.opts[i]; if (!o || picked.indexOf(i) >= 0) return;
        picked.push(i);
        if (!tried && key) record(key, label, ch, !!o[1]); else if (key && G.S.ans[key]) G.S.ans[key].tries++;
        tried = true; sfx(o[1] ? 'good' : 'bad');
        render(o[2], !!o[1]);
      }
      function close() { d.hidden = true; d.innerHTML = ''; busy--; ui = null; save(); cv.focus({ preventScroll: true }); res(); }
      render('', false);
    });
  }
  /* choose(who, text, labels) → index. Not marked right or wrong. */
  function choose(who, text, labels) {
    return new Promise(function (res) {
      var d = $('#ctDialog'); busy++;
      d.innerHTML = (who ? portrait(who) : '') + '<div class="ct-dbody">' + (who ? '<div class="ct-dname">' + esc(nameOf(who)) + '</div>' : '') + '<p class="ct-dtext">' + esc(text) + '</p><div class="ct-opts">' +
        labels.map(function (l, i) { return '<button class="ct-btn ct-opt" type="button" data-i="' + i + '">' + esc(l) + '</button>'; }).join('') + '</div></div>';
      d.hidden = false; d.onclick = null; dlgAdvance = null;
      function pick(i) { d.hidden = true; d.innerHTML = ''; busy--; ui = null; sfx('blip'); cv.focus({ preventScroll: true }); res(i); }
      Array.prototype.forEach.call(d.querySelectorAll('.ct-opt'), function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); pick(+b.dataset.i); }); });
      d.querySelector('.ct-opt').focus({ preventScroll: true });
      ui = { type: 'choose', text: text, labels: labels, pick: pick };
    });
  }
  function record(key, label, ch, right) {
    var a = G.S.ans || (G.S.ans = {});
    if (!a[key]) a[key] = { label: label, ch: ch == null ? G.ch : ch, first: right ? 1 : 0, tries: 0 };
    a[key].tries++;
    return a[key];
  }

  /* ── Panels (modal cards): the mission fills the body and calls done(result) ── */
  function panel(opts) {
    return new Promise(function (res) {
      var m = $('#ctModal'), box = $('#ctBox'); busy++;
      box.className = 'ct-box' + (opts.wide ? ' wide' : '');
      box.innerHTML = '<h2 id="ctBoxTitle" tabindex="-1">' + esc(opts.title || '') + '</h2>' + (opts.sub ? '<p class="ct-small">' + opts.sub + '</p>' : '') + '<div class="ct-pbody"></div>';
      box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'ctBoxTitle');
      m.hidden = false; delete m.dataset.closable;
      var body = $('.ct-pbody', box), finished = false;
      function done(r) { if (finished) return; finished = true; m.hidden = true; box.innerHTML = ''; busy--; ui = null; save(); cv.focus({ preventScroll: true }); res(r); }
      ui = { type: 'panel', name: opts.name || opts.title, body: body, done: done, data: opts.data || null };
      opts.render(body, done, ui);
      var f = body.querySelector('input, textarea, button:not([disabled])') || $('#ctBoxTitle');
      f.focus({ preventScroll: true });
    });
  }
  function openModal(title, html, onBind) {
    var m = $('#ctModal'), box = $('#ctBox');
    box.className = 'ct-box';
    box.innerHTML = '<h2 id="ctBoxTitle" tabindex="-1">' + esc(title) + '</h2>' + html + '<div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="ctClose">Close</button></div>';
    m.hidden = false; m.dataset.closable = '1';
    $('#ctClose').addEventListener('click', closeModal);
    if (onBind) onBind(box);
    $('#ctBoxTitle').focus({ preventScroll: true });
  }
  function closeModal() { $('#ctModal').hidden = true; $('#ctBox').innerHTML = ''; cv.focus({ preventScroll: true }); }

  /* ── HUD, Bag, Menu, toast ── */
  function hud() {
    var w = M.hud ? M.hud(G.S) : [];
    $('#ctWidgets').innerHTML = w.map(function (x) { return '<span class="ct-w' + (x.warn ? ' warn' : '') + '" title="' + esc(x.title || x.label) + '"><span class="ct-wl">' + esc(x.label) + '</span><b>' + esc(x.value) + '</b>' + (x.tag ? '<span class="ct-tag">' + esc(x.tag) + '</span>' : '') + '</span>'; }).join('');
    $('#ctChap').textContent = M.chapters[G.ch] ? 'Chapter ' + (G.ch + 1) + ' of ' + M.chapters.length + ': ' + M.chapters[G.ch].name : 'Mission complete';
  }
  function toast(text) {
    var t = $('#ctToast'); t.textContent = text; t.classList.add('on');
    clearTimeout(toast.tm); toast.tm = setTimeout(function () { t.classList.remove('on'); }, 2600);
  }
  function openBag() {
    var items = M.items ? M.items(G.S) : [];
    openModal('Bag', items.length ? '<div class="ct-items">' + items.map(function (it, i) { return '<button class="ct-item" type="button" data-i="' + i + '"><span class="ct-iic">' + (it.icon || '▣') + '</span><span><b>' + esc(it.name) + '</b><span class="ct-small">' + esc(it.note || '') + '</span></span></button>'; }).join('') + '</div><div id="ctItemView"></div>' : '<p>Your bag is empty.</p>',
      function (box) {
        Array.prototype.forEach.call(box.querySelectorAll('.ct-item'), function (b) {
          b.addEventListener('click', function () { var it = items[+b.dataset.i], v = $('#ctItemView'); v.innerHTML = '<div class="ct-itemview">' + it.view() + '</div>'; if (it.bind) it.bind(v); v.scrollIntoView({ block: 'nearest' }); });
        });
      });
  }
  function openMenu() {
    var html = '<h3>Mode</h3><div class="ct-row"><button class="ct-btn" type="button" data-mode="gentle" aria-pressed="' + (G.mode === 'gentle') + '">Gentle</button><button class="ct-btn" type="button" data-mode="real" aria-pressed="' + (G.mode === 'real') + '">Real</button></div>' +
      '<p class="ct-small">Gentle gives hints. Real gives none' + (M.realRule ? ', and ' + esc(M.realRule) : '') + '.</p>' +
      '<h3>Chapters</h3><ol class="ct-chapters">' + M.chapters.map(function (c, i) { return '<li' + (i === G.ch ? ' class="now"' : '') + '><b>' + esc(c.name) + '</b> <span class="ct-small">play after ' + esc(c.step) + '’s lesson' + (G.done[i] ? ' · done ✓' : i === G.ch ? ' · now' : '') + '</span></li>'; }).join('') + '</ol>' +
      '<div class="ct-row ct-wrap"><button class="ct-btn" type="button" id="ctHow">How to play</button><button class="ct-btn" type="button" id="ctReport">Report for my teacher</button><button class="ct-btn" type="button" id="ctLook">Change my look</button>' +
      '<button class="ct-btn" type="button" id="ctSound" aria-pressed="' + !!P.sound + '">Sound: ' + (P.sound ? 'on' : 'off') + '</button>' + (G.snap ? '<button class="ct-btn" type="button" id="ctReplay">Replay this chapter</button>' : '') + '<button class="ct-btn" type="button" id="ctRestart">Start the mission over</button></div>';
    openModal('Menu', html, function (box) {
      Array.prototype.forEach.call(box.querySelectorAll('[data-mode]'), function (b) { b.addEventListener('click', function () { G.mode = b.dataset.mode; save(); openMenu(); }); });
      $('#ctHow').addEventListener('click', function () { closeModal(); coachStart(); });
      $('#ctReport').addEventListener('click', openReport);
      $('#ctLook').addEventListener('click', function () { closeModal(); avatarEditor(false); });
      $('#ctSound').addEventListener('click', function () { P.sound = !P.sound; save(); openMenu(); });
      if ($('#ctReplay')) $('#ctReplay').addEventListener('click', function () { if (debug || confirm('Replay this chapter from its start?')) { closeModal(); replayChapter(); } });
      $('#ctRestart').addEventListener('click', function () { if (debug || confirm('Start this mission over? Your report for it will be cleared.')) { closeModal(); restartMission(); } });
    });
  }
  function openReport() {
    var body = M.report ? M.report(G.S, api) : '';
    var html = '<p><b>' + esc(P.name) + '</b> · ' + esc(M.title) + ' · Mode: ' + (G.mode === 'real' ? 'Real' : 'Gentle') + ' · ' +
      (G.ch >= M.chapters.length ? '<b>Mission complete</b>' : 'Chapter ' + (G.ch + 1) + ' of ' + M.chapters.length) + '</p>' + body + reportAnswers() +
      '<div class="ct-row"><button class="ct-btn" type="button" id="ctPrint">Print</button></div>';
    openModal('Report', html, function () { $('#ctPrint').addEventListener('click', function () { window.print(); }); });
    document.body.classList.add('ct-printing-report');
  }
  /* First-try answers, with groups (keys like "stub-p3-ei" → group "stub-p3") folded into one row each */
  function reportAnswers() {
    var a = G.S.ans || {}, rows = [], groups = {}, nQ = 0, okQ = 0, k;
    for (k in a) {
      var g = M.groupAnswer ? M.groupAnswer(k, a[k]) : null;
      if (g) {
        if (!groups[g.id]) { groups[g.id] = { label: g.label, ch: a[k].ch, n: 0, ok: 0, tries: 0, missed: [] }; rows.push(groups[g.id]); }
        var G2 = groups[g.id]; G2.n++; G2.ok += a[k].first; G2.tries += a[k].tries; if (!a[k].first) G2.missed.push(g.part);
      } else { rows.push(a[k]); nQ++; okQ += a[k].first; }
    }
    if (!rows.length) return '<h3>First-try answers</h3><p>None yet.</p>';
    rows.sort(function (x, y) { return x.ch - y.ch; });
    return '<h3>First-try answers</h3><p class="ct-small">Questions right on the first try: ' + okQ + ' of ' + nQ + '.</p><div class="ct-tablewrap"><table class="ct-rep"><thead><tr><th>Ch.</th><th>Question</th><th>First try</th><th>Tries</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><td>' + (r.ch + 1) + '</td><td>' + esc(r.label) + '</td><td>' + (r.n != null ? r.ok + ' of ' + r.n + (r.missed.length ? ' (missed: ' + esc(r.missed.join(', ')) + ')' : ' ✓') : r.first ? '✓ right' : '✗ not yet') + '</td><td class="ct-n">' + r.tries + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }

  /* ── Avatar editor (first start, or Menu → Change my look) ── */
  function avatarEditor(first) {
    return new Promise(function (res) {
      var look = P && P.look ? copy(P.look) : { base: 0, skin: 's3', hair: 'black', shirt: 'teal', pants: '#3d4a6b' }, name = P && P.name || '';
      var bases = A.BASES.filter(function (b) { return !b.npcOnly; });
      panel({ title: first ? 'Make your character' : 'Change your look', name: 'avatar', render: function (body, done) {
        function preview() {
          var c = document.createElement('canvas'); c.width = 64 * 3; c.height = 16 * 3; var x = c.getContext('2d'); x.imageSmoothingEnabled = false;
          x.drawImage(A.sprite(look), 0, 0, 64, 16, 0, 0, 192, 48); return c.toDataURL();
        }
        function sw(group, vals, cur, label) {
          return '<fieldset class="ct-sw"><legend>' + label + '</legend>' + vals.map(function (v) {
            return '<button type="button" class="ct-swatch" data-g="' + group + '" data-v="' + v.v + '" aria-pressed="' + (String(cur) === String(v.v)) + '" aria-label="' + esc(v.label) + '" style="background:' + v.c + '">' + (v.t || '') + '</button>'; }).join('') + '</fieldset>';
        }
        function draw() {
          body.innerHTML = '<div class="ct-avatar"><img alt="Your character, facing four ways" src="' + preview() + '"></div>' +
            '<label class="ct-lab" for="ctName">First name (or a nickname)</label><input class="ct-inp ct-wide" id="ctName" maxlength="14" autocomplete="off" value="' + esc(name) + '">' +
            sw('base', bases.map(function (b, i) { return { v: A.BASES.indexOf(b), label: b.name, c: '#f1ede5', t: String(i + 1) }; }), look.base, 'Style') +
            sw('skin', Object.keys(A.SKIN).map(function (k, i) { return { v: k, label: 'Skin tone ' + (i + 1), c: A.SKIN[k][0] }; }), look.skin, 'Skin tone') +
            sw('hair', Object.keys(A.HAIR).map(function (k) { return { v: k, label: k + ' hair', c: A.HAIR[k] }; }), look.hair, 'Hair') +
            sw('shirt', Object.keys(A.SHIRT).map(function (k) { return { v: k, label: k + ' shirt', c: A.SHIRT[k] }; }), look.shirt, 'Shirt') +
            '<p class="ct-small">Only your first name is saved, in this browser. Your teacher sees it on the report.</p>' +
            '<div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="ctLookDone"' + (name.trim() ? '' : ' disabled') + '>' + (first ? 'Start' : 'Done') + '</button></div>';
          Array.prototype.forEach.call(body.querySelectorAll('.ct-swatch'), function (b) { b.addEventListener('click', function () { var g = b.dataset.g; look[g] = g === 'base' ? +b.dataset.v : b.dataset.v; draw(); body.querySelector('[data-g="' + g + '"][aria-pressed="true"]').focus(); }); });
          $('#ctName', body).addEventListener('input', function (e) { name = e.target.value; $('#ctLookDone', body).disabled = !name.trim(); });
          $('#ctLookDone', body).addEventListener('click', function () {
            P = P || { v: 1, closet: [], plan: [], met: {}, finished: [], sound: false };
            P.name = name.trim().slice(0, 14); P.look = look; save(); hud(); kick(); done(); res();
          });
        }
        draw();
      } });
    });
  }

  /* ── Tutorial: pointers at the real controls; step 1 waits for one real step ── */
  var coach = null;
  function coachSteps() {
    return [
      { sel: '.ct-canvas', t: 'Walk with the arrow keys (or W A S D). On a touch screen, tap where you want to go. Try one step now.', waitMove: true },
      { sel: '.ct-canvas', t: 'Talk to people and open doors: face them and press Enter, or just tap them.' },
      { sel: '#ctQuest', t: 'Your goal is always here. Tap it and you walk there by yourself.' },
      { sel: '#ctBag', t: 'Your Bag holds the things you collect, like your Pay Card and pay stubs.' },
      { sel: '#ctMenu', t: 'Menu: Gentle or Real mode, help, and the report for your teacher.' }
    ];
  }
  function coachStart() { coach = { steps: coachSteps(), i: -1 }; $('#ctCoach').hidden = false; coachNext(); }
  function coachNext() {
    if (!coach) return;
    Array.prototype.forEach.call(document.querySelectorAll('.ct-spot'), function (n) { n.classList.remove('ct-spot'); });
    coach.i++; var s = coach.steps[coach.i];
    if (!s) { coachEnd(); return; }
    coach.waitMove = !!s.waitMove;
    var n = $(s.sel); n.classList.add('ct-spot');
    $('#ctCoachTxt').textContent = s.t; $('#ctCoachN').textContent = (coach.i + 1) + ' of ' + coach.steps.length;
    $('#ctCoachNext').hidden = !!s.waitMove; $('#ctCoachNext').textContent = coach.i === coach.steps.length - 1 ? 'Play' : 'Next';
    var c = $('#ctCoach'), r = n.getBoundingClientRect(), ar = app.getBoundingClientRect();
    c.style.top = Math.max(0, (s.sel === '.ct-canvas' ? r.top + 12 : r.bottom + 8) - ar.top) + 'px';
    if (s.waitMove) cv.focus({ preventScroll: true }); else $('#ctCoachNext').focus({ preventScroll: true });
  }
  function coachEnd() { Array.prototype.forEach.call(document.querySelectorAll('.ct-spot'), function (n) { n.classList.remove('ct-spot'); }); coach = null; $('#ctCoach').hidden = true; G.tut = true; save(); cv.focus({ preventScroll: true }); }

  /* ── Sound: tiny beeps, off by default ── */
  var actx = null;
  function sfx(kind) {
    if (!P || !P.sound || debug) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var o = actx.createOscillator(), g = actx.createGain(), f = { step: 0, blip: 660, good: 880, bad: 220, item: 990 }[kind];
      if (!f) return;
      o.type = 'square'; o.frequency.value = f; g.gain.value = 0.04; o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + (kind === 'item' ? 0.18 : 0.06));
    } catch (e) {}
  }

  /* ── The mission runner: chapters are lists of steps; the save holds (chapter, step) ── */
  function chapterSteps(ch) { return M.chapterSteps(ch, G.S, api); }
  async function run() {
    while (G.ch < M.chapters.length) {
      var steps = chapterSteps(G.ch);
      while (G.si < steps.length) {
        var st = steps[G.si];
        var r = await st.run(api, G.S);
        if (r === 'lost') { await lost(); return run(); }
        G.si++; hud(); save();
      }
      G.done[G.ch] = true; G.ch++; G.si = 0;
      if (G.ch < M.chapters.length) { G.snap = { S: copy(G.S), map: map.id, x: me.x, y: me.y }; hud(); save(); await chapterBreak(); }
    }
    hud(); setQuest(M.afterLine || 'Mission complete. Open Menu → Report to show your teacher.', null); save();
  }
  function chapterBreak() {
    var c = M.chapters[G.ch];
    return panel({ title: 'Chapter ' + (G.ch + 1) + ': ' + c.name, name: 'chapter', render: function (body, done) {
      body.innerHTML = '<p>Play this after <b>' + esc(c.step) + '</b>’s lesson in class' + (c.moment ? ' (' + esc(c.moment) + ')' : '') + '.</p><p class="ct-small">Your game is saved. You can stop here and come back next class.</p>' +
        '<div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="ctGo">Start Chapter ' + (G.ch + 1) + '</button></div>';
      $('#ctGo', body).addEventListener('click', function () { done(); });
    } });
  }
  async function lost() {
    await panel({ title: 'Game over', name: 'lost', render: function (body, done) {
      body.innerHTML = '<p>' + esc(M.lostLine || 'That chapter did not work out.') + '</p><div class="ct-row ct-actions"><button class="ct-btn primary" type="button" id="ctAgain">Replay this chapter</button><button class="ct-btn" type="button" id="ctGentle">Switch to Gentle and replay</button></div>';
      $('#ctAgain', body).addEventListener('click', function () { done(); });
      $('#ctGentle', body).addEventListener('click', function () { G.mode = 'gentle'; done(); });
    } });
    restoreSnap();
  }
  function restoreSnap() {
    if (!G.snap) { G.S = M.init(api); G.ch = 0; G.si = 0; return; }
    G.S = copy(G.snap.S); G.si = 0; enter(G.snap.map, G.snap.x, G.snap.y); hud(); save();
  }
  var runner = null;
  function replayChapter() { restoreSnap(); location.reload(); }
  function restartMission() { G = null; storeJSON(saveKey(), null); if (!debug) location.reload(); else T.start(M.id, true); }

  /* ── The API a mission script uses ── */
  var api = {
    get S() { return G.S; }, get mode() { return G.mode; }, get ch() { return G.ch; }, get profile() { return P; },
    say: say, ask: ask, choose: choose, panel: panel, toast: toast, record: record, esc: esc,
    quest: function (text, id) { setQuest(text, id); return new Promise(function (res) { waiters = waiters.filter(function (w) { return w.id !== id; }); waiters.push({ id: id, resolve: function () { res(); } }); }); },
    clearQuest: function () { setQuest(null, null); },
    questText: function (text) { if (quest) { quest.text = text; var q = $('#ctQuest .ct-qt'); if (q) q.textContent = text; } },
    place: function (id, mapId, x, y, o) { objects[id] = Object.assign({ map: mapId, x: x, y: y }, o || {}); if (map && map.id === mapId) T.refreshMap(); },
    unplace: function (id) { var o = objects[id]; delete objects[id]; if (o && map && map.id === o.map) T.refreshMap(); },
    hud: function () { hud(); kick(); },
    give: function (name, icon) { sfx('item'); toast('Added to your Bag: ' + name); hud(); },
    outfit: function () { kick(); hud(); },
    teleport: function (mapId, x, y, dir) { enter(mapId, x, y, dir); },
    where: function () { return { map: map.id, x: me.x, y: me.y }; },
    profileAdd: function (kind, value) { if (kind === 'closet' && P.closet.indexOf(value) < 0) P.closet.push(value); if (kind === 'plan') P.plan.push(value); if (kind === 'met') P.met[value] = (P.met[value] || 0) + 1; if (kind === 'finished' && P.finished.indexOf(value) < 0) P.finished.push(value); save(); },
    refresh: function () { T.refreshMap(); hud(); },
    save: save
  };
  T.api = api;

  /* ── Start ── */
  T.start = async function (id, fresh) {
    A = T.art; Wd = T.world; M = missions[id];
    var root = document.getElementById('town');
    if (!M) { root.textContent = 'This mission could not be found: ' + id; return; }
    buildDOM(root);
    try { await A.load(root.dataset.art || '../../vendor/kenney-rpg-urban/tilemap_packed.png'); }
    catch (e) { stage.innerHTML = '<p class="ct-err">' + esc(e.message) + '</p>'; return; }
    resize();
    P = loadJSON(PROFILE_KEY); if (!validProfile(P)) P = null;
    G = fresh ? null : loadJSON(saveKey()); if (!validGame(G)) G = null;
    if (!G) G = { v: 1, mode: 'gentle', map: 'town', x: 0, y: 0, dir: 'down', ch: 0, si: 0, S: M.init(api), done: {}, tut: false, snap: null };
    G.S.ans = G.S.ans || {};
    (getMap('town').signs || []).forEach(function (sg, i) { objects['sign' + i] = { map: 'town', x: sg.x, y: sg.y, label: sg.text, noRug: true }; });
    if (M.placeObjects) M.placeObjects(api, G.S);
    var town = getMap('town'), m0 = G.x ? G.map : 'town';
    enter(m0, G.x || town.spawn.x, G.y || town.spawn.y, G.dir);
    if (!G.snap) G.snap = { S: copy(G.S), map: map.id, x: me.x, y: me.y };
    hud(); setQuest(null, null);
    if (debug) exposeDebug();
    if (!P) await avatarEditor(true);
    if (!G.tut && !debug) coachStart();
    cv.focus({ preventScroll: true });
    runner = run();
  };

  /* ── Test hook: ?debug=1 ── */
  function exposeDebug() {
    window.CEFLTownDebug = {
      api: api, M: M, world: Wd, art: A,
      state: function () { return G; }, profile: function () { return P; }, prompt: function () { return ui; }, quest: function () { return quest; },
      me: function () { return { map: map.id, x: me.x, y: me.y, dir: me.dir }; }, frames: function () { return frames; },
      fire: fire, interact: function (id) { if (!fire(id)) talk(id); }, teleport: function (m, x, y) { enter(m, x, y); },
      walkTo: walkPath, bfs: bfs, map: function () { return map; }, getMap: getMap, people: people, locate: locate, questTarget: questTarget,
      tap: tapTile, step: function (d) { tryMove(d); kick(); }, tickNow: function (ms) { var n = 0; do { step(ms || 1000); n++; } while ((me.moving || path.length) && n < 500); draw(performance.now()); }, autoWalk: autoWalkQuest, openBag: openBag, openMenu: openMenu, openReport: openReport, closeModal: closeModal,
      setProfile: function (p) { P = p; save(); }, coachStart: coachStart, coach: function () { return coach; }, coachNext: coachNext, coachEnd: coachEnd
    };
  }
})();
