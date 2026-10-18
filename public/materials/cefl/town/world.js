/* CEFL Town — the world: one town map shared by every CEFL mission, building interiors, and the base townspeople.
   Tile ids are positions in Kenney's RPG Urban Pack sheet (27 tiles a row). No DOM in this file.
   Layout (78 × 58): College Hill and the Schoolyard (north) · College Walk · Main Street (civic buildings, the bank, Town Hall)
   · Town Square and Market Lane (shops) · the Industrial Yard and Riverside Homes · the river and Riverside Park (south).
   Every door faces south onto a path, a sidewalk or a lane. */
(function () {
  'use strict';
  var T = window.CEFLTown = window.CEFLTown || {};

  /* ── Tiles ── */
  var K = {
    grass: 28, walk: 36, path: 109,
    lawn: [0, 1, 2, 27, 28, 29, 54, 55, 56],             // 9-slice: tl t tr / l c r / bl b br
    water: [170, 171, 172, 197, 198, 199, 224, 225, 226],
    plaza: [81, 82, 83, 108, 109, 110, 135, 136, 137],
    roofCivic: [89, 90, 91, 116, 117, 118, 143, 144, 145], roofHouse: [8, 9, 10, 35, 36, 37, 62, 63, 64], roofCampus: [81, 82, 83, 108, 109, 110, 135, 136, 137],
    road: 468, roadDash: 433, crossH: 435, crossV: 432,
    redUp: [71, 72, 73], redLow: [98, 99, 100], orUp: [179, 180, 181], orLow: [206, 207, 208], glassUp: [359, 360, 361], glassLow: [386, 387, 388],
    win: 335, winGrey: 416, winTall: 336,
    doorGlass: 256, doorOrange: 284, doorDouble: 285, doorWood: 338, doorOpen: 311, doorGrey: 339,
    tree: [291, 292, 265], bigTreeTop: 232, bigTreeLow: 259, planter: 286, plant: 287,
    hedge: [328, 329, 330], bench: 381, benchMetal: 223, lampTop: 162, lampLow: 189, bin: 279, mail: 305, hydrant: 278, cone: 307,
    fence: [382, 383, 384, 385], sign: 166, busStop: 195, barrier: 221,
    counter: [270, 271], shelf: [300, 301, 302, 303, 304], crate: [276, 277], box: 273, desk: 275, chair: [327, 354], vending: 334
  };
  var W = 78, H = 58;

  function grid(w, h, v) { var a = [], i; for (i = 0; i < w * h; i++) a.push(v); return a; }
  function Map(id, w, h, fill) {
    return { id: id, w: w, h: h, ground: grid(w, h, fill), over: grid(w, h, -1), over2: grid(w, h, -1), solid: grid(w, h, 0), doors: {}, labels: [], exits: {}, spots: {}, draws: [], signs: [], districts: [], keep: {} };
  }
  function at(m, x, y) { return y * m.w + x; }
  function inb(m, x, y) { return x >= 0 && y >= 0 && x < m.w && y < m.h; }
  function setG(m, x, y, t) { if (inb(m, x, y)) m.ground[at(m, x, y)] = t; }
  function setO(m, x, y, t, solid) { if (!inb(m, x, y)) return; var i = at(m, x, y); if (m.over[i] < 0) m.over[i] = t; else m.over2[i] = t; if (solid) m.solid[i] = 1; }
  function block(m, x, y) { if (inb(m, x, y)) m.solid[at(m, x, y)] = 1; }
  function rect(m, x0, y0, w, h, t) { for (var y = y0; y < y0 + h; y++) for (var x = x0; x < x0 + w; x++) setG(m, x, y, t); }
  function slice(m, x0, y0, w, h, s, layer, solid) { // 9-slice fill
    var x, y, t;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      t = s[(y === 0 ? 0 : y === h - 1 ? 6 : 3) + (x === 0 ? 0 : x === w - 1 ? 2 : 1)];
      if (layer === 'o') setO(m, x0 + x, y0 + y, t, solid); else { setG(m, x0 + x, y0 + y, t); if (solid) block(m, x0 + x, y0 + y); }
    }
  }
  function free(m, x, y) { return inb(m, x, y) && m.over[at(m, x, y)] < 0 && !m.solid[at(m, x, y)] && !m.keep[x + ',' + y]; }

  /* ── Buildings ── rh roof rows, fh façade rows (the door is on the bottom row). style: house, shop, civic, glass, industry, campus */
  var BUILDINGS = [
    // College Hill and the Schoolyard (north of College Walk)
    { id: 'school', name: 'School', x: 2, y: 3, w: 11, rh: 3, fh: 4, style: 'civic', brick: 'red', door: 5, kind: 'library', icon: 'school' },
    { id: 'community', name: 'Community Centre', x: 29, y: 4, w: 7, rh: 2, fh: 4, style: 'civic', brick: 'orange', door: 3, kind: 'hall', icon: 'heart' },
    { id: 'university', name: 'University', x: 41, y: 2, w: 13, rh: 3, fh: 5, style: 'campus', brick: 'red', door: 6, kind: 'library', icon: 'grad' },
    { id: 'polytechnic', name: 'Polytechnic', x: 56, y: 3, w: 10, rh: 2, fh: 5, style: 'glass', brick: 'orange', door: 5, kind: 'library', icon: 'gear' },
    { id: 'trades', name: 'Trades Centre', x: 68, y: 4, w: 8, rh: 2, fh: 4, style: 'industry', brick: 'orange', door: 3, kind: 'yard', icon: 'tool' },
    // Main Street (north side, doors on the sidewalk)
    { id: 'library', name: 'Library', x: 2, y: 16, w: 7, rh: 2, fh: 5, style: 'civic', brick: 'red', door: 3, kind: 'library', icon: 'book' },
    { id: 'jobcentre', name: 'Job Centre', x: 10, y: 17, w: 8, rh: 2, fh: 4, style: 'glass', brick: 'red', door: 3, kind: 'office', icon: 'job' },
    { id: 'bank', name: 'Bank', x: 19, y: 15, w: 8, rh: 3, fh: 5, style: 'civic', brick: 'orange', door: 3, kind: 'bank', icon: 'bank', emblem: 'coin' },
    { id: 'servicecanada', name: 'Service Canada', x: 28, y: 17, w: 6, rh: 2, fh: 4, style: 'shop', brick: 'red', door: 2, kind: 'office', icon: 'leaf' },
    { id: 'news', name: 'News', x: 34, y: 19, w: 3, rh: 2, fh: 2, style: 'shop', brick: 'orange', door: 1, kind: 'shop', icon: 'news' },
    { id: 'townhall', name: 'Town Hall', x: 41, y: 13, w: 14, rh: 4, fh: 6, style: 'civic', brick: 'orange', door: 7, kind: 'hall', icon: 'hall', emblem: 'clock' },
    { id: 'hospital', name: 'Hospital', x: 57, y: 14, w: 12, rh: 3, fh: 6, style: 'glass', brick: 'red', door: 6, kind: 'hospital', icon: 'cross', emblem: 'cross' },
    { id: 'clinic', name: 'Riverbend Clinic', x: 70, y: 16, w: 7, rh: 2, fh: 5, style: 'shop', brick: 'red', door: 3, kind: 'office', icon: 'cross' },
    // Market Lane (shops, doors on the lane)
    { id: 'grocer', name: 'Valley Market', x: 2, y: 31, w: 8, rh: 2, fh: 5, style: 'shop', brick: 'red', door: 3, kind: 'grocery', icon: 'apple' },
    { id: 'diner', name: 'The Lantern Diner', x: 11, y: 32, w: 7, rh: 2, fh: 4, style: 'shop', brick: 'orange', door: 3, kind: 'diner', icon: 'cup' },
    { id: 'sports', name: 'Northside Sports', x: 19, y: 31, w: 8, rh: 2, fh: 5, style: 'glass', brick: 'red', door: 4, kind: 'shop', icon: 'ball' },
    { id: 'phones', name: 'CellPoint', x: 28, y: 32, w: 8, rh: 2, fh: 4, style: 'glass', brick: 'orange', door: 3, kind: 'shop', icon: 'phone' },
    { id: 'bikeshop', name: 'Spoke & Chain Bikes', x: 58, y: 31, w: 7, rh: 2, fh: 5, style: 'shop', brick: 'orange', door: 3, kind: 'shop', icon: 'bike' },
    { id: 'quickcash', name: 'Quick Cash', x: 66, y: 32, w: 5, rh: 2, fh: 4, style: 'shop', brick: 'red', door: 2, kind: 'office', icon: 'cash' },
    { id: 'taxclinic', name: 'Tax Clinic', x: 72, y: 31, w: 5, rh: 2, fh: 5, style: 'shop', brick: 'orange', door: 2, kind: 'office', icon: 'doc' },
    // the Industrial Yard and Riverside Homes (doors on River Walk)
    { id: 'warehouse', name: 'Prairie Parcel', x: 2, y: 40, w: 12, rh: 2, fh: 5, style: 'industry', brick: 'orange', door: 6, kind: 'yard', icon: 'box' },
    { id: 'electric', name: 'Bright Spark Electric', x: 16, y: 41, w: 8, rh: 2, fh: 4, style: 'industry', brick: 'orange', door: 3, kind: 'yard', icon: 'bolt' },
    { id: 'furniture', name: 'Home & Hearth', x: 26, y: 40, w: 10, rh: 2, fh: 5, style: 'glass', brick: 'red', door: 4, kind: 'shop', icon: 'chair' },
    { id: 'home', name: 'Home', x: 41, y: 42, w: 6, rh: 2, fh: 3, style: 'house', brick: 'red', door: 2, kind: 'home', icon: 'home' },
    { id: 'neighbour', name: 'Neighbours', x: 49, y: 42, w: 6, rh: 2, fh: 3, style: 'house', brick: 'orange', door: 3, kind: 'home', icon: 'home' },
    { id: 'grandpa', name: 'Grandpa’s house', x: 57, y: 42, w: 6, rh: 2, fh: 3, style: 'house', brick: 'orange', door: 2, kind: 'home', icon: 'home' }
  ];
  var BY_ID = {}; BUILDINGS.forEach(function (b) { BY_ID[b.id] = b; });

  function building(m, b) {
    var red = b.brick !== 'orange', up = red ? K.redUp : K.orUp, low = red ? K.redLow : K.orLow, roof = b.style === 'house' ? K.roofHouse : b.style === 'campus' ? K.roofCampus : K.roofCivic,
        fy = b.y + b.rh, by = fy + b.fh - 1, dx = b.x + b.door, x, y, e, glass = b.style === 'glass';
    slice(m, b.x, b.y, b.w, b.rh, roof, 'o', true);
    for (y = fy; y <= by; y++) for (x = 0; x < b.w; x++) {
      e = x === 0 ? 0 : x === b.w - 1 ? 2 : 1;
      if (glass) setO(m, b.x + x, y, y < by ? K.glassUp[e] : K.glassLow[e], true);
      else setO(m, b.x + x, y, y === by ? low[e] : up[e], true);
      if (!glass && y < by && x > 0 && x < b.w - 1 && (x + y) % 2 === 0)
        setO(m, b.x + x, y, b.style === 'campus' || (b.style === 'civic' && b.fh >= 5) ? K.winTall : red ? K.win : K.winGrey);
    }
    if (b.style === 'shop' && b.w >= 6) { var sx = b.door >= 3 ? b.x + 1 : dx + 1; if (sx + 2 < b.x + b.w && (sx + 2 < dx || sx > dx)) { setO(m, sx, by, 359); setO(m, sx + 1, by, 360); setO(m, sx + 2, by, 361); } }
    var door = b.style === 'house' ? K.doorWood : b.style === 'industry' ? K.doorOpen : b.style === 'civic' || b.style === 'campus' ? K.doorDouble : glass ? K.doorGrey : red ? K.doorGlass : K.doorOrange;
    setO(m, dx, by, door, true);
    m.doors[dx + ',' + by] = b.id;
    m.spots[b.id] = { x: dx, y: by + 1, dir: 'up' };            // where you stand outside the door
    m.keep[dx + ',' + (by + 1)] = 1;
    if (m.ground[at(m, dx, by + 1)] === K.grass) setG(m, dx, by + 1, K.path);
    m.labels.push({ id: b.id, text: b.name, icon: b.icon, x: b.x, y: b.y + b.rh - 1, w: b.w });
    if (b.emblem) m.draws.push({ kind: b.emblem, x: b.x + Math.floor(b.w / 2), y: b.y });
  }
  function tree(m, x, y, k) { if (free(m, x, y)) setO(m, x, y, K.tree[k % 3], true); }
  function bigTree(m, x, y) { if (free(m, x, y) && free(m, x, y - 1)) { setO(m, x, y - 1, K.bigTreeTop, true); setO(m, x, y, K.bigTreeLow, true); } }
  function lamp(m, x, y) { if (free(m, x, y)) { setO(m, x, y - 1, K.lampTop, false); setO(m, x, y, K.lampLow, true); } }
  function put(m, x, y, t, solid) { if (free(m, x, y)) setO(m, x, y, t, solid !== false); }
  function path(m, x0, y0, x1, y1) {
    for (var y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) for (var x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) {
      if (m.solid[at(m, x, y)] || m.over[at(m, x, y)] >= 0) continue;             // paths never run through a building
      setG(m, x, y, K.path); m.keep[x + ',' + y] = 1;
    }
  }
  function sign(m, x, y, text) { if (!free(m, x, y)) return; setO(m, x, y, K.sign, true); m.signs.push({ x: x, y: y, text: text }); }

  function buildTown() {
    var m = Map('town', W, H, K.grass), x, y, k = 0;
    // ── roads and walks ──
    for (x = 0; x < W; x++) { setG(m, x, 23, K.walk); setG(m, x, 24, K.road); setG(m, x, 25, K.roadDash); setG(m, x, 26, K.road); setG(m, x, 27, K.walk); }   // Main Street
    rect(m, 0, 38, W, 2, K.walk);                                                                                                                    // Market Lane
    for (y = 1; y < H - 1; y++) for (x = 37; x <= 39; x++) setG(m, x, y, K.road);                                                                   // the Avenue
    // ── the river and Riverside Park ──
    for (x = 0; x < W; x++) { setG(m, x, 48, K.water[1]); setG(m, x, 49, K.water[4]); setG(m, x, 50, K.water[7]); block(m, x, 48); block(m, x, 49); block(m, x, 50); }
    [[37, 3, K.road], [14, 2, K.path], [64, 2, K.path]].forEach(function (br) {
      for (x = br[0]; x < br[0] + br[1]; x++) for (y = 48; y <= 50; y++) { setG(m, x, y, br[2]); m.solid[at(m, x, y)] = 0; m.keep[x + ',' + y] = 1; }
      m.draws.push({ kind: 'bridge', x: br[0], y: 48, w: br[1], h: 3 });
    });
    // ── Town Square (fountain), the sports field, the community garden ──
    slice(m, 41, 28, 16, 10, K.plaza);
    slice(m, 47, 31, 4, 4, K.water, 'g', true); m.draws.push({ kind: 'fountain', x: 47, y: 31 });
    slice(m, 15, 2, 13, 8, K.lawn); m.draws.push({ kind: 'field', x: 15, y: 2, w: 13, h: 8 });
    for (x = 64; x <= 75; x++) setO(m, x, 41, K.fence[x === 64 ? 0 : x === 75 ? 3 : 1 + (x % 2)], true);
    [[66, 43], [68, 43], [70, 43], [72, 43], [66, 45], [68, 45], [72, 45]].forEach(function (p, i) { setO(m, p[0], p[1], [K.crate[0], K.crate[1], 302, 301][i % 4], true); });
    // ── buildings ──
    BUILDINGS.forEach(function (b) { building(m, b); });
    // ── paths: College Walk, River Walk, the park trail, and a path between every block ──
    path(m, 1, 11, W - 2, 12); path(m, 1, 47, W - 2, 47); path(m, 1, 54, W - 2, 54); path(m, 14, 51, 15, 53); path(m, 64, 51, 65, 53);
    for (x = 37; x <= 39; x++) { setG(m, x, 11, K.crossV); setG(m, x, 12, K.crossV); setG(m, x, 38, K.crossV); setG(m, x, 39, K.crossV); setG(m, x, 47, K.crossV); setG(m, x, 54, K.crossV); }
    [8, 18, 48, 69].forEach(function (cx) { for (y = 24; y <= 26; y++) setG(m, cx, y, K.crossH); });
    [1, 9, 18, 27, 36, 40, 55, 56, 69].forEach(function (px) { path(m, px, 13, px, 22); });
    [1, 10, 18, 27, 36, 40, 57, 65, 71].forEach(function (px) { path(m, px, 28, px, 37); });
    [1, 14, 15, 24, 25, 36, 40, 47, 48, 55, 56, 63].forEach(function (px) { path(m, px, 40, px, 46); });
    // ── districts: a name banner shows when you walk into one, and the Town Map labels them ──
    m.districts = [
      { name: 'Town Square', x: 41, y: 28, w: 16, h: 10 }, { name: 'Riverside Park', x: 0, y: 48, w: W, h: 10 }, { name: 'Sports Field', x: 15, y: 2, w: 13, h: 8 },
      { name: 'Community Garden', x: 64, y: 40, w: 13, h: 7 }, { name: 'College Hill', x: 40, y: 0, w: 38, h: 11, lx: 66 }, { name: 'Schoolyard', x: 0, y: 0, w: 40, h: 11 },
      { name: 'College Walk', x: 0, y: 11, w: W, h: 2 }, { name: 'Main Street', x: 0, y: 13, w: W, h: 15, lx: 20 }, { name: 'Market Lane', x: 0, y: 28, w: W, h: 12, lx: 20, ly: 38.6 },
      { name: 'Riverside Homes', x: 40, y: 40, w: 38, h: 8, lx: 52 }, { name: 'Industrial Yard', x: 0, y: 40, w: 40, h: 8, lx: 20 }
    ];
    // ── decor. Nothing goes on a path or a doorstep. ──
    for (x = 0; x < W; x++) { tree(m, x, 0, k++); tree(m, x, H - 1, k++); }
    for (y = 1; y < H - 1; y++) { tree(m, 0, y, k++); tree(m, W - 1, y, k++); }
    [4, 13, 30, 44, 52, 61, 73].forEach(function (lx) { lamp(m, lx, 23); lamp(m, lx + 2, 27); });
    [[3, 13], [6, 13], [12, 14], [15, 14], [22, 13], [31, 14], [34, 15], [42, 10], [62, 10], [74, 10], [14, 10]].forEach(function (p, i) { tree(m, p[0], p[1], i); });
    [[7, 29], [16, 29], [24, 29], [33, 29], [62, 29], [75, 29], [44, 41], [52, 41], [60, 41], [3, 28], [29, 28]].forEach(function (p, i) { tree(m, p[0], p[1], i); });
    [[44, 29], [53, 29], [44, 36], [53, 36]].forEach(function (p) { put(m, p[0], p[1], K.planter); });
    [[46, 30], [51, 30], [46, 35], [51, 35]].forEach(function (p) { put(m, p[0], p[1], K.bench); });
    [[42, 30], [55, 30], [42, 34], [55, 34]].forEach(function (p, i) { put(m, p[0], p[1], K.crate[i % 2]); });   // market stalls
    for (x = 16; x <= 26; x += 2) put(m, x, 10, K.benchMetal);                                                  // bleachers by the field
    put(m, 7, 23, K.busStop); put(m, 6, 23, K.benchMetal);                                                           // the bus stop by the Job Centre
    put(m, 25, 23, K.bin); put(m, 35, 23, K.mail); put(m, 60, 27, K.hydrant);
    [[5, 46], [6, 46], [21, 46], [34, 46]].forEach(function (p, i) { put(m, p[0], p[1], i < 3 ? K.cone : K.barrier); });
    [[4, 53], [10, 53], [22, 53], [30, 53], [45, 53], [52, 53], [70, 53], [74, 53], [58, 53]].forEach(function (p) { bigTree(m, p[0], p[1]); });
    [[18, 52], [26, 52], [42, 52], [50, 52], [60, 52], [68, 52]].forEach(function (p, i) { put(m, p[0], p[1], i % 2 ? K.desk : K.bench); });
    // street signs at the corners (talk to read them)
    sign(m, 35, 14, '← Library · Job Centre · Bank · Service Canada.   Town Hall · Hospital →');
    sign(m, 41, 28, '↓ Town Square · Market Lane · River Walk · Riverside Homes');
    sign(m, 36, 10, '↑ Schoolyard · Sports Field.   University · Polytechnic · Trades Centre →');
    sign(m, 41, 41, '← Industrial Yard · Home & Hearth.   Home · Grandpa · Community Garden →');
    sign(m, 13, 51, 'Riverside Park. The footbridge goes back to town ↑');
    sign(m, 50, 36, 'Town Square. The fountain was built in 1912. Please do not swim in it.');
    // a scatter of trees on open grass: fixed (the same every time), never beside a path, a walk or a doorstep, never where a person stands
    var stand = {}; Object.keys(PEOPLE).forEach(function (id) { var pp = PEOPLE[id]; if (pp.map === 'town') stand[pp.x + ',' + pp.y] = 1; });
    [[44, 32], [15, 23]].forEach(function (c) { stand[c[0] + ',' + c[1]] = 1; });   // where missions may put people
    function hash(x, y) { var h = Math.imul(x, 374761393) + Math.imul(y, 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) % 100; }
    function open(x, y) { var g = m.ground[at(m, x, y)]; return g === K.grass && !m.keep[x + ',' + y]; }
    for (y = 2; y < H - 2; y++) for (x = 2; x < W - 2; x++) {
      if (!free(m, x, y) || !open(x, y) || stand[x + ',' + y] || hash(x, y) > 8) continue;
      if (x >= 15 && x <= 27 && y >= 2 && y <= 9) continue;                         // keep the sports field clear
      if (!open(x - 1, y) || !open(x + 1, y) || !open(x, y - 1) || !open(x, y + 1)) continue;
      tree(m, x, y, x + y);
    }
    m.spawn = { x: m.spots.home.x, y: m.spots.home.y, dir: 'down' };
    return m;
  }

  /* ── Interiors: small rooms (9 × 7) with a back wall, one or two props, and the key person or thing on a rug ── */
  var ROOM = {
    home:     { furn: [[1, 2, 'vending'], [4, 3, 'desk'], [3, 3, 'chair0'], [5, 3, 'chair1'], [7, 2, 'plant']], board: [6, 1] },
    office:   { furn: [[2, 2, 'desk'], [7, 2, 'plant']] },
    bank:     { furn: [[1, 3, 'counter0'], [2, 3, 'counter1'], [3, 3, 'counter0'], [5, 3, 'counter1'], [6, 3, 'counter0'], [7, 3, 'counter1'], [7, 5, 'plant']] },
    shop:     { furn: [[1, 2, 'shelf3'], [7, 2, 'shelf4'], [3, 2, 'counter0'], [4, 2, 'counter1'], [5, 2, 'counter0']] },
    grocery:  { furn: [[1, 2, 'shelf1'], [2, 2, 'shelf2'], [6, 2, 'shelf4'], [7, 2, 'shelf1'], [3, 2, 'counter0'], [4, 2, 'counter1']] },
    diner:    { furn: [[1, 2, 'counter0'], [2, 2, 'counter1'], [6, 4, 'desk'], [5, 4, 'chair0'], [7, 4, 'chair1'], [7, 2, 'vending']] },
    yard:     { furn: [[1, 2, 'box'], [2, 2, 'box'], [7, 2, 'box'], [7, 3, 'box'], [1, 5, 'cone']] },
    hospital: { furn: [[3, 2, 'counter0'], [4, 2, 'counter1'], [5, 2, 'counter0'], [1, 4, 'bench'], [7, 4, 'bench']] },
    hall:     { furn: [[2, 2, 'desk'], [6, 2, 'desk'], [3, 5, 'chair1'], [5, 5, 'chair1']] },
    library:  { furn: [[1, 2, 'shelf3'], [2, 2, 'shelf0'], [6, 2, 'shelf0'], [7, 2, 'shelf3'], [7, 5, 'vending']] }
  };
  function furnTile(name) {
    var m = /^([a-z]+)(\d)?$/.exec(name), n = m[1], i = m[2] ? +m[2] : 0, arr = { counter: K.counter, shelf: K.shelf, crate: K.crate, chair: K.chair }[n];
    return arr ? arr[i] : K[n];
  }
  function buildRoom(b) {
    var t = ROOM[b.kind] || ROOM.office, w = 9, h = 7, m = Map(b.id, w, h, K.plaza[4]), ex = 4, bx, by;
    slice(m, 0, 0, w, h, K.plaza, 'g', false);
    for (bx = 0; bx < w; bx++) { block(m, bx, 0); block(m, bx, h - 1); }
    for (by = 0; by < h; by++) { block(m, 0, by); block(m, w - 1, by); }
    for (bx = 1; bx < w - 1; bx++) block(m, bx, 1);                                          // the back wall (drawn by the engine)
    m.wall = { y: 1, windows: [2, 6].filter(function (wx) { return !(t.board && t.board[0] === wx); }) };
    t.furn.forEach(function (f) { setO(m, f[0], f[1], furnTile(f[2]), true); });
    m.ground[at(m, ex, h - 1)] = K.plaza[4]; m.solid[at(m, ex, h - 1)] = 0;   // the exit gap in the bottom wall
    m.exits[ex + ',' + (h - 1)] = 'town';
    m.spawn = { x: ex, y: h - 2, dir: 'up' };
    m.mat = { x: ex, y: h - 1 };
    m.board = t.board ? { x: t.board[0], y: t.board[1] } : null;
    m.title = b.name; m.rugs = true;
    return m;
  }

  /* ── Base townspeople. look = art.sprite spec. A mission chooses who is out and what they say. ── */
  var PEOPLE = {
    okafor:  { name: 'Ms. Okafor', role: 'Career counsellor', map: 'jobcentre', x: 4, y: 3, dir: 'down', look: { base: 3, skin: 's4', hair: 'black', shirt: 'purple', pants: '#3b3f5c' } },
    sam:     { name: 'Sam', role: 'Bank teller', map: 'bank', x: 4, y: 2, dir: 'down', look: { base: 2, skin: 's3', hair: 'black', shirt: 'blue', pants: '#2f3a5c' } },
    jas:     { name: 'Jas', role: 'Looking for work', map: 'servicecanada', x: 6, y: 4, dir: 'left', look: { base: 0, skin: 's2', hair: 'brown', shirt: 'grey', pants: '#3b3f5c' } },
    agent:   { name: 'Mr. Benoit', role: 'Service Canada', map: 'servicecanada', x: 2, y: 3, dir: 'down', look: { base: 2, skin: 's1', hair: 'grey', shirt: 'teal', pants: '#2f3a5c' } },
    grandpa: { name: 'Grandpa', role: 'Retired', map: 'grandpa', x: 2, y: 4, dir: 'right', look: { base: 4 } },
    nurse:   { name: 'Nurse Kaur', role: 'Nurse', map: 'hospital', x: 4, y: 3, dir: 'down', look: { base: 1, skin: 's3', hair: 'black', shirt: 'teal', pants: '#2e7d7d' } },
    mayor:   { name: 'Councillor Wright', role: 'Town council', map: 'townhall', x: 4, y: 3, dir: 'down', look: { base: 2, skin: 's5', hair: 'black', shirt: 'grey', pants: '#2f2f38' } },
    librarian: { name: 'Mx. Lin', role: 'Librarian', map: 'library', x: 4, y: 3, dir: 'down', look: { base: 3, skin: 's2', hair: 'pink', shirt: 'green', pants: '#3b3f5c' } },
    avery:   { name: 'Avery', role: 'Neighbour', map: 'town', x: 20, y: 12, dir: 'down', look: { base: 1, skin: 's1', hair: 'ginger', shirt: 'red', pants: '#3d4a6b' } },
    dev:     { name: 'Dev', role: 'Neighbour', map: 'town', x: 33, y: 30, dir: 'down', look: { base: 0, skin: 's4', hair: 'black', shirt: 'green', pants: '#3d4a6b' } },
    rosa:    { name: 'Rosa', role: 'Neighbour', map: 'town', x: 52, y: 39, dir: 'down', look: { base: 3, skin: 's3', hair: 'brown', shirt: 'orange', pants: '#3d4a6b' } },
    worker:  { name: 'Mo', role: 'Builder', map: 'town', x: 15, y: 45, dir: 'left', look: { base: 5 } }
  };

  T.world = {
    K: K, BUILDINGS: BUILDINGS, building: function (id) { return BY_ID[id]; }, PEOPLE: PEOPLE,
    town: buildTown, room: function (id) { return buildRoom(BY_ID[id]); },
    districtAt: function (m, x, y) { var d = m.districts || [], i; for (i = 0; i < d.length; i++) if (x >= d[i].x && y >= d[i].y && x < d[i].x + d[i].w && y < d[i].y + d[i].h) return d[i].name; return ''; },
    solidAt: function (m, x, y) { return !inb(m, x, y) || !!m.solid[at(m, x, y)]; }, inb: inb, at: at
  };
})();
