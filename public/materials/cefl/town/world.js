/* CEFL Town — the world: one town map shared by every CEFL mission, building interiors, and the base townspeople.
   Tile ids are positions in Kenney's RPG Urban Pack sheet (27 tiles a row). No DOM in this file. */
(function () {
  'use strict';
  var T = window.CEFLTown = window.CEFLTown || {};

  /* ── Tiles ── */
  var K = {
    walk: 36,                                            // sidewalk
    grass: [0, 1, 2, 27, 28, 29, 54, 55, 56],            // 9-slice: tl t tr / l c r / bl b br
    water: [170, 171, 172, 197, 198, 199, 224, 225, 226],
    plaza: [81, 82, 83, 108, 109, 110, 135, 136, 137],
    roof: [89, 90, 91, 116, 117, 118, 143, 144, 145],
    road: 468, roadDash: 433, cross: 435,
    redUp: [71, 72, 73], redLow: [98, 99, 100], orUp: [179, 180, 181], orLow: [206, 207, 208],
    win: 335, winGrey: 416, shop: [359, 360, 361], shopStripe: [386, 387, 388],
    doorGlass: 256, doorOrange: 284, doorDouble: 285, doorWood: 338, doorOpen: 311,
    tree: [291, 292, 265], bigTreeTop: 232, bigTreeLow: 259, planter: 286,
    hedge: [328, 329, 330], bench: 381, lampTop: 162, lampLow: 189, bin: 279, mail: 305, hydrant: 278, cone: 307,
    fence: [382, 383, 384, 385], sign: 166, streetSign: 167, barrier: 221,
    counter: [270, 271], shelf: [300, 301, 302, 303, 304], crate: [276, 277], box: 273, desk: 275, chair: [327, 354],
    vending: 334, washer: 333, plant: 287
  };
  var W = 56, H = 40;

  function grid(w, h, v) { var a = [], i; for (i = 0; i < w * h; i++) a.push(v); return a; }
  function Map(id, w, h, fill) {
    return { id: id, w: w, h: h, ground: grid(w, h, fill), over: grid(w, h, -1), over2: grid(w, h, -1), solid: grid(w, h, 0), doors: {}, labels: [], exits: {}, spots: {} };
  }
  function at(m, x, y) { return y * m.w + x; }
  function inb(m, x, y) { return x >= 0 && y >= 0 && x < m.w && y < m.h; }
  function setG(m, x, y, t) { if (inb(m, x, y)) m.ground[at(m, x, y)] = t; }
  function setO(m, x, y, t, solid) { if (!inb(m, x, y)) return; var i = at(m, x, y); if (m.over[i] < 0) m.over[i] = t; else m.over2[i] = t; if (solid) m.solid[i] = 1; }
  function block(m, x, y) { if (inb(m, x, y)) m.solid[at(m, x, y)] = 1; }
  function slice(m, x0, y0, w, h, s, layer, solid) { // 9-slice fill
    var x, y, t;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      t = s[(y === 0 ? 0 : y === h - 1 ? 6 : 3) + (x === 0 ? 0 : x === w - 1 ? 2 : 1)];
      if (layer === 'o') setO(m, x0 + x, y0 + y, t, solid); else { setG(m, x0 + x, y0 + y, t); if (solid) block(m, x0 + x, y0 + y); }
    }
  }

  /* ── Buildings ── every building is 4 tiles tall: 2 roof rows, 2 façade rows; the door is on the bottom row */
  var BUILDINGS = [
    // north-west: homes and civic
    { id: 'home', name: 'Home', x: 2, y: 2, w: 5, style: 'red', door: 2, kind: 'home', icon: 'home' },
    { id: 'grandpa', name: 'Grandpa’s house', x: 8, y: 2, w: 5, style: 'orange', door: 2, kind: 'home', icon: 'home' },
    { id: 'neighbour', name: 'Neighbours', x: 14, y: 2, w: 5, style: 'red', door: 2, kind: 'home', icon: 'home' },
    { id: 'community', name: 'Community Centre', x: 20, y: 2, w: 6, style: 'orange', door: 3, kind: 'hall', icon: 'heart', double: true },
    { id: 'townhall', name: 'Town Hall', x: 2, y: 8, w: 8, style: 'orange', door: 4, kind: 'hall', icon: 'hall', double: true },
    { id: 'library', name: 'Library', x: 11, y: 8, w: 6, style: 'red', door: 3, kind: 'library', icon: 'book' },
    { id: 'school', name: 'School', x: 18, y: 8, w: 8, style: 'red', door: 4, kind: 'library', icon: 'school', double: true },
    { id: 'jobcentre', name: 'Job Centre', x: 2, y: 14, w: 6, style: 'red', door: 3, kind: 'office', icon: 'job', shop: true },
    { id: 'bank', name: 'Bank', x: 9, y: 14, w: 5, style: 'orange', door: 2, kind: 'bank', icon: 'bank', double: true },
    { id: 'servicecanada', name: 'Service Canada', x: 15, y: 14, w: 6, style: 'red', door: 3, kind: 'office', icon: 'leaf' },
    { id: 'news', name: 'News', x: 22, y: 14, w: 4, style: 'orange', door: 1, kind: 'shop', icon: 'news', shop: true },
    // north-east: campus, health, services, shops
    { id: 'university', name: 'University', x: 31, y: 2, w: 8, style: 'red', door: 4, kind: 'library', icon: 'grad', double: true },
    { id: 'polytechnic', name: 'Polytechnic', x: 40, y: 2, w: 7, style: 'orange', door: 3, kind: 'library', icon: 'gear', double: true },
    { id: 'trades', name: 'Trades Centre', x: 48, y: 2, w: 6, style: 'orange', door: 3, kind: 'yard', icon: 'tool' },
    { id: 'hospital', name: 'Hospital', x: 31, y: 8, w: 8, style: 'red', door: 4, kind: 'hospital', icon: 'cross', double: true },
    { id: 'clinic', name: 'Riverbend Clinic', x: 40, y: 8, w: 7, style: 'red', door: 3, kind: 'office', icon: 'cross' },
    { id: 'taxclinic', name: 'Tax Clinic', x: 48, y: 8, w: 6, style: 'orange', door: 3, kind: 'office', icon: 'doc' },
    { id: 'quickcash', name: 'Quick Cash', x: 31, y: 14, w: 4, style: 'orange', door: 1, kind: 'office', icon: 'cash', shop: true },
    { id: 'phones', name: 'CellPoint', x: 36, y: 14, w: 5, style: 'red', door: 2, kind: 'shop', icon: 'phone', shop: true },
    { id: 'bikeshop', name: 'Spoke & Chain Bikes', x: 42, y: 14, w: 6, style: 'orange', door: 3, kind: 'shop', icon: 'bike', shop: true },
    { id: 'sports', name: 'Northside Sports', x: 49, y: 14, w: 6, style: 'red', door: 3, kind: 'shop', icon: 'ball', shop: true },
    // south-west: shops and industry
    { id: 'grocer', name: 'Valley Market', x: 2, y: 23, w: 7, style: 'red', door: 3, kind: 'grocery', icon: 'apple', shop: true },
    { id: 'diner', name: 'The Lantern Diner', x: 10, y: 23, w: 6, style: 'orange', door: 3, kind: 'diner', icon: 'cup', shop: true },
    { id: 'furniture', name: 'Home & Hearth', x: 17, y: 23, w: 8, style: 'red', door: 4, kind: 'shop', icon: 'chair', shop: true },
    { id: 'warehouse', name: 'Prairie Parcel', x: 2, y: 30, w: 9, style: 'orange', door: 4, kind: 'yard', icon: 'box', double: true },
    { id: 'electric', name: 'Bright Spark Electric', x: 13, y: 30, w: 7, style: 'orange', door: 3, kind: 'yard', icon: 'bolt' }
  ];
  var BY_ID = {}; BUILDINGS.forEach(function (b) { BY_ID[b.id] = b; });

  function building(m, b) {
    var up = b.style === 'orange' ? K.orUp : K.redUp, low = b.style === 'orange' ? K.orLow : K.redLow, x, fy = b.y + 2, dx = b.x + b.door;
    slice(m, b.x, b.y, b.w, 2, [K.roof[0], K.roof[1], K.roof[2], K.roof[6], K.roof[7], K.roof[8], K.roof[6], K.roof[7], K.roof[8]], 'o', true);
    for (x = 0; x < b.w; x++) {
      var e = x === 0 ? 0 : x === b.w - 1 ? 2 : 1;
      setO(m, b.x + x, fy, up[e], true); setO(m, b.x + x, fy + 1, low[e], true);
      if (x !== b.door && (x % 2 === (b.door % 2 ? 1 : 0) || b.w <= 4) && x > 0 && x < b.w - 1) setO(m, b.x + x, fy, b.style === 'orange' ? K.winGrey : K.win);
    }
    if (b.shop && b.w >= 5) { // shop windows beside the door
      var sx = b.door >= 3 ? b.x + 1 : b.x + b.door + 1;
      if (sx + 2 < b.x + b.w - 0 && (sx + 2 < dx || sx > dx)) { setO(m, sx, fy + 1, K.shop[0]); setO(m, sx + 1, fy + 1, K.shop[1]); setO(m, sx + 2, fy + 1, K.shop[2]); }
    }
    setO(m, dx, fy + 1, b.double ? K.doorDouble : b.style === 'orange' ? K.doorOrange : K.doorGlass, true);
    m.doors[dx + ',' + (fy + 1)] = b.id;
    m.spots[b.id] = { x: dx, y: fy + 2, dir: 'up' };            // where you stand outside the door
    m.labels.push({ id: b.id, text: b.name, icon: b.icon, x: b.x, y: b.y + 1, w: b.w });
  }
  function tree(m, x, y, k) { setO(m, x, y, K.tree[k % 3], true); }
  function bigTree(m, x, y) { setO(m, x, y - 1, K.bigTreeTop, true); setO(m, x, y, K.bigTreeLow, true); }
  function lamp(m, x, y) { setO(m, x, y - 1, K.lampTop, false); setO(m, x, y, K.lampLow, true); }

  function buildTown() {
    var m = Map('town', W, H, K.walk), x, y, k = 0;
    // roads: main street y 19–21 (dashes on 20), avenue x 27–29
    for (x = 0; x < W; x++) { setG(m, x, 19, K.road); setG(m, x, 20, K.roadDash); setG(m, x, 21, K.road); }
    for (y = 1; y < H - 1; y++) for (x = 27; x <= 29; x++) setG(m, x, y, K.road);
    for (x = 27; x <= 29; x++) for (y = 19; y <= 21; y++) setG(m, x, y, K.road);
    [8, 18, 38].forEach(function (cx) { for (y = 19; y <= 21; y++) setG(m, cx, y, K.cross); });
    // the market square and the park
    slice(m, 31, 23, 11, 8, K.plaza);
    slice(m, 43, 23, 12, 15, K.grass);
    slice(m, 46, 27, 6, 5, K.water, 'g', true);
    // grass verges in the residential row
    slice(m, 1, 6, 25, 2, K.grass);
    // border of trees
    for (x = 0; x < W; x++) { tree(m, x, 0, k++); tree(m, x, H - 1, k++); }
    for (y = 1; y < H - 1; y++) { tree(m, 0, y, k++); tree(m, W - 1, y, k++); }
    BUILDINGS.forEach(function (b) { building(m, b); });
    // decor: trees and lamps along the sidewalks, benches, a few hedges
    [4, 10, 16, 22].forEach(function (cx) { tree(m, cx + 3, 7, cx); });
    [3, 13, 23, 33, 45].forEach(function (cx) { lamp(m, cx, 18); lamp(m, cx + 2, 22); });
    [35, 39].forEach(function (cx) { lamp(m, cx, 7); });
    [12, 24].forEach(function (cy) { lamp(m, 26, cy); lamp(m, 30, cy); });
    bigTree(m, 44, 25); bigTree(m, 53, 25); bigTree(m, 44, 35); bigTree(m, 53, 35); bigTree(m, 49, 35);
    tree(m, 45, 33, 1); tree(m, 52, 33, 2); tree(m, 48, 24, 0);
    setO(m, 46, 33, K.bench, true); setO(m, 50, 33, K.bench, true); setO(m, 47, 25, K.bench, true);
    for (x = 22; x <= 25; x++) setO(m, x, 34, K.hedge[x === 22 ? 0 : x === 25 ? 2 : 1], true);
    for (x = 2; x <= 9; x++) setO(m, x, 36, K.fence[x === 2 ? 0 : 1 + (x % 2)], true);
    setO(m, 12, 35, K.cone, true); setO(m, 13, 35, K.cone, true); setO(m, 20, 35, K.barrier, true);
    // market stalls (crates) and the square's sign
    [[33, 25], [36, 25], [39, 25], [33, 28], [36, 28], [39, 28]].forEach(function (p, i) { setO(m, p[0], p[1], K.crate[i % 2], true); });
    m.spots.market = { x: 36, y: 27, dir: 'up' };
    setO(m, 11, 18, K.bin, true); setO(m, 21, 18, K.mail, true); setO(m, 41, 18, K.hydrant, true); setO(m, 30, 18, K.streetSign, true);
    // keep every doorstep clear: nothing may stand where you wait outside a door, or just below it
    Object.keys(m.spots).forEach(function (id) {
      var s = m.spots[id];
      [[s.x, s.y], [s.x, s.y + 1]].forEach(function (c) { if (!inb(m, c[0], c[1])) return; var i = at(m, c[0], c[1]); m.over[i] = -1; m.over2[i] = -1; m.solid[i] = 0; if (inb(m, c[0], c[1] - 1) && (m.over[at(m, c[0], c[1] - 1)] === K.lampTop)) m.over[at(m, c[0], c[1] - 1)] = -1; });
    });
    m.spawn = { x: 4, y: 7, dir: 'down' };
    return m;
  }

  /* ── Interiors: one room per building, built from a template by kind ── */
  var ROOM = {
    home:     { w: 11, h: 8, furn: [[2, 2, 'counter0'], [3, 2, 'counter1'], [4, 2, 'vending'], [6, 4, 'desk'], [5, 4, 'chair0'], [7, 4, 'chair1'], [9, 2, 'shelf3'], [1, 6, 'plant'], [9, 6, 'plant']], board: [7, 1] },
    bank:     { w: 11, h: 8, furn: [[2, 3, 'counter0'], [3, 3, 'counter1'], [4, 3, 'counter0'], [6, 3, 'counter1'], [7, 3, 'counter0'], [8, 3, 'counter1'], [9, 2, 'vending'], [1, 6, 'plant'], [9, 6, 'plant']] },
    office:   { w: 11, h: 8, furn: [[3, 3, 'desk'], [4, 3, 'box'], [7, 3, 'desk'], [3, 4, 'chair0'], [7, 4, 'chair0'], [1, 2, 'shelf3'], [9, 2, 'shelf3'], [1, 6, 'plant'], [9, 6, 'plant']] },
    shop:     { w: 11, h: 8, furn: [[2, 2, 'shelf3'], [3, 2, 'shelf4'], [7, 2, 'shelf0'], [8, 2, 'shelf3'], [2, 5, 'shelf1'], [8, 5, 'shelf2'], [5, 3, 'counter0'], [6, 3, 'counter1']] },
    grocery:  { w: 11, h: 8, furn: [[1, 2, 'shelf1'], [2, 2, 'shelf2'], [3, 2, 'shelf4'], [7, 2, 'shelf1'], [8, 2, 'shelf2'], [9, 2, 'shelf4'], [2, 5, 'crate0'], [3, 5, 'crate1'], [8, 5, 'crate0'], [5, 3, 'counter0'], [6, 3, 'counter1']] },
    diner:    { w: 11, h: 8, furn: [[2, 2, 'counter0'], [3, 2, 'counter1'], [4, 2, 'counter0'], [2, 5, 'desk'], [3, 5, 'chair1'], [1, 5, 'chair0'], [7, 5, 'desk'], [8, 5, 'chair1'], [6, 5, 'chair0'], [8, 2, 'vending']] },
    yard:     { w: 11, h: 8, furn: [[1, 2, 'box'], [2, 2, 'box'], [1, 3, 'box'], [8, 2, 'box'], [9, 2, 'box'], [9, 3, 'box'], [2, 5, 'cone'], [8, 5, 'cone'], [5, 3, 'desk']] },
    hospital: { w: 11, h: 8, furn: [[4, 2, 'counter0'], [5, 2, 'counter1'], [6, 2, 'counter0'], [1, 4, 'bench'], [1, 5, 'bench'], [9, 4, 'bench'], [9, 5, 'bench'], [1, 2, 'plant']] },
    hall:     { w: 11, h: 8, furn: [[3, 2, 'desk'], [5, 2, 'desk'], [7, 2, 'desk'], [3, 5, 'chair1'], [5, 5, 'chair1'], [7, 5, 'chair1'], [1, 6, 'plant'], [9, 6, 'plant']] },
    library:  { w: 11, h: 8, furn: [[1, 2, 'shelf3'], [2, 2, 'shelf0'], [3, 2, 'shelf3'], [7, 2, 'shelf3'], [8, 2, 'shelf0'], [9, 2, 'shelf3'], [5, 4, 'desk'], [4, 4, 'chair0'], [6, 4, 'chair1'], [8, 5, 'vending']] }
  };
  function furnTile(name) {
    var m = /^([a-z]+)(\d)?$/.exec(name), n = m[1], i = m[2] ? +m[2] : 0;
    return { counter: K.counter, shelf: K.shelf, crate: K.crate, chair: K.chair }[n] ? { counter: K.counter, shelf: K.shelf, crate: K.crate, chair: K.chair }[n][i] : K[n];
  }
  function buildRoom(b) {
    var t = ROOM[b.kind] || ROOM.office, m = Map(b.id, t.w, t.h, K.plaza[4]), ex = Math.floor(t.w / 2);
    slice(m, 0, 0, t.w, t.h, K.plaza, 'g', false);
    for (var bx = 0; bx < t.w; bx++) { block(m, bx, 0); block(m, bx, t.h - 1); }      // only the border is wall
    for (var by = 0; by < t.h; by++) { block(m, 0, by); block(m, t.w - 1, by); }
    t.furn.forEach(function (f) { setO(m, f[0], f[1], furnTile(f[2]), true); });
    for (var wx = 1; wx < t.w - 1; wx++) m.solid[at(m, wx, 1)] = 1;              // the back wall (drawn by the engine)
    m.wall = { y: 1, windows: [2, 5, 8].filter(function (wx) { return !(t.board && t.board[0] === wx); }) };
    m.ground[at(m, ex, t.h - 1)] = K.plaza[4]; m.solid[at(m, ex, t.h - 1)] = 0;   // the exit gap in the bottom wall
    m.exits[ex + ',' + (t.h - 1)] = 'town';
    m.spawn = { x: ex, y: t.h - 2, dir: 'up' };
    m.mat = { x: ex, y: t.h - 1 };
    m.board = t.board ? { x: t.board[0], y: t.board[1] } : null;
    m.title = b.name;
    return m;
  }

  /* ── Base townspeople. look = art.sprite spec. A mission chooses who is out and what they say. ── */
  var PEOPLE = {
    okafor:  { name: 'Ms. Okafor', role: 'Career counsellor', map: 'jobcentre', x: 5, y: 2, dir: 'down', look: { base: 3, skin: 's4', hair: 'black', shirt: 'purple', pants: '#3b3f5c' } },
    sam:     { name: 'Sam', role: 'Bank teller', map: 'bank', x: 5, y: 2, dir: 'down', look: { base: 2, skin: 's3', hair: 'black', shirt: 'blue', pants: '#2f3a5c' } },
    jas:     { name: 'Jas', role: 'Looking for work', map: 'servicecanada', x: 6, y: 5, dir: 'up', look: { base: 0, skin: 's2', hair: 'brown', shirt: 'grey', pants: '#3b3f5c' } },
    agent:   { name: 'Mr. Benoit', role: 'Service Canada', map: 'servicecanada', x: 7, y: 2, dir: 'down', look: { base: 2, skin: 's1', hair: 'grey', shirt: 'teal', pants: '#2f3a5c' } },
    grandpa: { name: 'Grandpa', role: 'Retired', map: 'grandpa', x: 6, y: 5, dir: 'down', look: { base: 4 } },
    nurse:   { name: 'Nurse Kaur', role: 'Nurse', map: 'hospital', x: 5, y: 1, dir: 'down', look: { base: 1, skin: 's3', hair: 'black', shirt: 'teal', pants: '#2e7d7d' } },
    mayor:   { name: 'Councillor Wright', role: 'Town council', map: 'townhall', x: 5, y: 1, dir: 'down', look: { base: 2, skin: 's5', hair: 'black', shirt: 'grey', pants: '#2f2f38' } },
    librarian: { name: 'Mx. Lin', role: 'Librarian', map: 'library', x: 5, y: 3, dir: 'down', look: { base: 3, skin: 's2', hair: 'pink', shirt: 'green', pants: '#3b3f5c' } },
    avery:   { name: 'Avery', role: 'Neighbour', map: 'town', x: 16, y: 7, dir: 'down', look: { base: 1, skin: 's1', hair: 'ginger', shirt: 'red', pants: '#3d4a6b' } },
    dev:     { name: 'Dev', role: 'Neighbour', map: 'town', x: 25, y: 13, dir: 'left', look: { base: 0, skin: 's4', hair: 'black', shirt: 'green', pants: '#3d4a6b' } },
    rosa:    { name: 'Rosa', role: 'Neighbour', map: 'town', x: 34, y: 26, dir: 'down', look: { base: 3, skin: 's3', hair: 'brown', shirt: 'orange', pants: '#3d4a6b' } },
    worker:  { name: 'Mo', role: 'Builder', map: 'town', x: 15, y: 35, dir: 'left', look: { base: 5 } }
  };

  T.world = {
    K: K, BUILDINGS: BUILDINGS, building: function (id) { return BY_ID[id]; }, PEOPLE: PEOPLE,
    town: buildTown, room: function (id) { return buildRoom(BY_ID[id]); },
    solidAt: function (m, x, y) { return !inb(m, x, y) || !!m.solid[at(m, x, y)]; }, inb: inb, at: at
  };
})();
