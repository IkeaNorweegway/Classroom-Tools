/* CEFL Town — art.
   Tiles and characters come from Kenney's "RPG Urban Pack" 1.0 (CC0), saved in public/vendor/kenney-rpg-urban/
   (no outside server, games rule 2). Sheet: 27 × 18 tiles of 16 px, no spacing (tilemap_packed.png).
   Characters: 6 bases in columns 23–26 (left, down, up, right), 3 rows each (stand, walk 1, walk 2).
   Avatars and townspeople are recoloured bases; job outfits are recoloured shirts plus small code-drawn layers. */
(function () {
  'use strict';
  var T = window.CEFLTown = window.CEFLTown || {};
  var SHEET_COLS = 27, TS = 16;
  var img = null;

  function load(src) {
    return new Promise(function (res, rej) {
      var i = new Image();
      i.onload = function () { img = i; res(i); };
      i.onerror = function () { rej(new Error('Could not load the town art: ' + src)); };
      i.src = src;
    });
  }
  function drawTile(ctx, id, dx, dy) {
    if (id == null || id < 0 || !img) return;
    ctx.drawImage(img, (id % SHEET_COLS) * TS, Math.floor(id / SHEET_COLS) * TS, TS, TS, dx, dy, TS, TS);
  }

  /* ── Colours ── */
  function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function shade(c, f) { var h = hex(c); return '#' + h.map(function (v) { return ('0' + Math.max(0, Math.min(255, Math.round(v * f))).toString(16)).slice(-2); }).join(''); }
  var SKIN = { // light, mid, shadow
    s1: ['#ffd9b3', '#f3bf96', '#e2a37c'],
    s2: ['#ffc999', '#f1b089', '#e29779'],
    s3: ['#d9a06c', '#c08455', '#a86f45'],
    s4: ['#b4734a', '#955f3e', '#874d27'],
    s5: ['#7d4a2c', '#663b22', '#55301b']
  };
  var HAIR = { black: '#2f2f33', brown: '#6b4428', auburn: '#a5482f', ginger: '#dc8652', blond: '#e6c35c', grey: '#a09cca', blue: '#4f6fd1', pink: '#e07aa8' };
  var SHIRT = { green: '#42a379', red: '#c2504d', blue: '#4f78c9', yellow: '#e2b13c', purple: '#8a5cc2', teal: '#2e9c9c', grey: '#8d8ca6', orange: '#e07b39' };

  /* The colours in each base, by part. Outline #8d5243 and eye/mouth #654140 are never changed. */
  var BASES = [
    { name: 'Spiky hair', row: 0, skin: ['#ffc999', '#f1b089', '#e29779', '#ffc8a1'], hair: ['#dc8652', '#c57652'], shirt: ['#42a379', '#369069'], pants: ['#d6d4aa', '#c5b993'] },
    { name: 'Long hair', row: 3, skin: ['#ffc999', '#f1b089', null, '#ffc8a1'], hair: ['#dc8652', '#c57652'], shirt: ['#c2504d', '#a54240'], pants: ['#a09cca', '#7a77a4'] },
    { name: 'Short hair', row: 12, skin: ['#ffc999', '#f1b089', null, '#ffc8a1'], hair: ['#dc8652'], shirt: ['#aaa8bd', '#898ca6'], pants: ['#60605a', '#54544e'] },
    { name: 'Headband', row: 15, skin: ['#ffc999', '#f1b089', null, '#ffc8a1'], hair: ['#373733', '#60605a', '#50504a'], shirt: ['#c77b47', '#a9673b'], pants: ['#aaa8bd', '#898ca6'], band: ['#ff7143'] },
    { name: 'Grey beard', row: 6, npcOnly: true },
    { name: 'Hard hat', row: 9, npcOnly: true }
  ];
  /* Base 5 (row 9) is the hard-hat worker: its hat pixels become the hard-hat and cap layers */
  var HAT_COLS = ['#f5a94c', '#da923e', '#bc7d36'];

  /* Job outfits: a shirt colour, an optional second colour for an apron or vest, and a layer */
  var OUTFITS = {
    none:      { label: 'Your clothes' },
    apron:     { label: 'Grocery apron', shirt: '#4f78c9', layer: 'apron', layerCol: '#3f9a5a' },
    busser:    { label: 'Diner vest', shirt: '#f2f0e8', layer: 'vest', layerCol: '#2f2f38' },
    polo:      { label: 'Sports polo', shirt: '#d8453e', layer: 'collar', layerCol: '#f2f0e8' },
    hivis:     { label: 'Hi-vis vest', shirt: '#e6d43a', layer: 'stripe', layerCol: '#c9c9cf' },
    cap:       { label: 'Bike shop cap', shirt: '#4f6fd1', layer: 'cap', layerCol: '#2f3f8f' },
    lanyard:   { label: 'Phone store lanyard', shirt: '#2e9c9c', layer: 'lanyard', layerCol: '#e2b13c' },
    blazer:    { label: 'Office blazer', shirt: '#2f3a5c', layer: 'blazer', layerCol: '#f2f0e8' },
    hardhat:   { label: 'Hard hat and vest', shirt: '#f08a2c', layer: 'hardhat', layerCol: '#c9c9cf' },
    nametag:   { label: 'Store name tag', shirt: '#8a2f45', layer: 'nametag', layerCol: '#f2f0e8' }
  };

  var cache = {};
  function frameData(col, row) {
    var c = document.createElement('canvas'); c.width = TS; c.height = TS;
    var x = c.getContext('2d'); x.drawImage(img, col * TS, row * TS, TS, TS, 0, 0, TS, TS);
    return x.getImageData(0, 0, TS, TS);
  }
  function key(r, g, b) { return '#' + [r, g, b].map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join(''); }

  /* spec: { base: 0–5, skin: 's1'…'s5', hair: name or hex, shirt: name or hex, pants: hex, outfit: key of OUTFITS }
     Returns a canvas of 4 × 3 frames (64 × 48): columns left, down, up, right; rows stand, walk 1, walk 2. */
  function sprite(spec) {
    var k = JSON.stringify(spec);
    if (cache[k]) return cache[k];
    var b = BASES[spec.base] || BASES[0], out = document.createElement('canvas'), ctx, map = {}, i, of = OUTFITS[spec.outfit || 'none'] || OUTFITS.none,
        skin = SKIN[spec.skin] || null, hair = HAIR[spec.hair] || spec.hair, shirt = of.shirt || SHIRT[spec.shirt] || spec.shirt, pants = spec.pants;
    out.width = TS * 4; out.height = TS * 3; ctx = out.getContext('2d');
    if (b.skin && skin) for (i = 0; i < b.skin.length; i++) if (b.skin[i]) map[b.skin[i]] = i === 3 ? skin[0] : skin[Math.min(i, 2)];
    if (b.hair && hair) { map[b.hair[0]] = hair; if (b.hair[1]) map[b.hair[1]] = shade(hair, 0.85); if (b.hair[2]) map[b.hair[2]] = shade(hair, 0.75); }
    if (b.shirt && shirt) { map[b.shirt[0]] = shirt; map[b.shirt[1]] = shade(shirt, 0.82); }
    if (b.pants && pants) { map[b.pants[0]] = pants; map[b.pants[1]] = shade(pants, 0.85); }
    var shirtSet = {}; if (b.shirt) { shirtSet[(shirt || b.shirt[0])] = 1; shirtSet[shade(shirt || b.shirt[0], 0.82)] = 1; shirtSet[b.shirt[0]] = 1; shirtSet[b.shirt[1]] = 1; }
    for (var col = 0; col < 4; col++) for (var row = 0; row < 3; row++) {
      var d = frameData(23 + col, b.row + row), p = d.data, j, c, m, shirtPx = [];
      for (j = 0; j < p.length; j += 4) {
        if (!p[j + 3]) continue;
        c = key(p[j], p[j + 1], p[j + 2]);
        if (b.shirt && (c === b.shirt[0] || c === b.shirt[1])) shirtPx.push(j / 4);
        m = map[c];
        if (m) { var h = hex(m); p[j] = h[0]; p[j + 1] = h[1]; p[j + 2] = h[2]; }
      }
      if (of.layer) layer(d, of, col, row, shirtPx, b);
      ctx.putImageData(d, col * TS, row * TS);
    }
    cache[k] = out;
    return out;
  }
  function setPx(d, x, y, colour) {
    if (x < 0 || y < 0 || x >= TS || y >= TS) return;
    var h = hex(colour), j = (y * TS + x) * 4; d.data[j] = h[0]; d.data[j + 1] = h[1]; d.data[j + 2] = h[2]; d.data[j + 3] = 255;
  }
  /* Small outfit layers drawn on the shirt pixels (front, back and side frames) */
  function layer(d, of, col, row, shirtPx, b) {
    var ys = shirtPx.map(function (i) { return Math.floor(i / TS); }), top = Math.min.apply(null, ys), bottom = Math.max.apply(null, ys), mid = 7.5;
    if (!shirtPx.length) return;
    shirtPx.forEach(function (i) {
      var x = i % TS, y = Math.floor(i / TS), front = col === 1, back = col === 2;
      if (of.layer === 'apron' && front && y > top) setPx(d, x, y, of.layerCol);
      if (of.layer === 'apron' && !front && !back && y > top + 1 && Math.abs(x - mid) < 2.5) setPx(d, x, y, of.layerCol);
      if (of.layer === 'vest' && (front ? Math.abs(x - mid) > 1.5 : true) && y >= top) setPx(d, x, y, of.layerCol);
      if (of.layer === 'collar' && y === top && !back) setPx(d, x, y, of.layerCol);
      if ((of.layer === 'stripe' || of.layer === 'hardhat') && y === top + 2) setPx(d, x, y, of.layerCol);
      if (of.layer === 'lanyard' && front && Math.abs(x - mid) < 1 && y < bottom) setPx(d, x, y, of.layerCol);
      if (of.layer === 'blazer' && front && Math.abs(x - mid) < 1 && y >= top) setPx(d, x, y, of.layerCol);
      if (of.layer === 'nametag' && front && y === top + 1 && x > mid && x < mid + 3) setPx(d, x, y, of.layerCol);
    });
    if (of.layer === 'hardhat' || of.layer === 'cap') hat(d, col, row, of.layer === 'cap' ? of.layerCol : null);
  }
  /* Copy the hard-hat pixels from the worker base (row 9), recoloured for a cap */
  function hat(d, col, row, recol) {
    var w = frameData(23 + col, 9 + row).data, j, c, x, y;
    for (j = 0; j < w.length; j += 4) {
      if (!w[j + 3]) continue;
      c = key(w[j], w[j + 1], w[j + 2]); x = (j / 4) % TS; y = Math.floor(j / 4 / TS);
      if (y > 6) continue;
      if (HAT_COLS.indexOf(c) >= 0) setPx(d, x, y, recol ? (c === HAT_COLS[0] ? recol : shade(recol, 0.8)) : c);
      else if (c === '#8d5243' && y <= 4) setPx(d, x, y, c);
    }
  }

  T.art = { load: load, drawTile: drawTile, sprite: sprite, TS: TS, SKIN: SKIN, HAIR: HAIR, SHIRT: SHIRT, BASES: BASES, OUTFITS: OUTFITS, shade: shade,
            image: function () { return img; } };
})();
