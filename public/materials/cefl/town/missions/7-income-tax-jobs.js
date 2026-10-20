/* CEFL Town — Payday's job games: one minute of the job, played at every shift (and as an extra shift between lessons).
   One game per job in 7-income-tax.js. Some are quick action games, and some use light money math the job really needs.
   The mission turns the result into hours or a raise on the next paycheque (see perfOf in the mission's model).
   Model (JOBGAMES MODEL START … END, no DOM): every game is make(seed, mode) → st, update(st, dt ms), act(st, a), best(st) (what a
   careful worker does next), actions(st) (every target on screen), tier(st). Node runs it with bots to set the thresholds:
   a careful worker reaches great, and nobody reaches ok by doing nothing or tapping at random.
   The view (after the model) draws st as HTML; every target carries data-act. Registers CEFLTown.jobGames for the mission. */
(function () {
  'use strict';
  var T = window.CEFLTown = window.CEFLTown || {};

/* JOBGAMES MODEL START ── no DOM. Money is in cents; time in ms. ── */
function RNG(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function pickR(r, a) { return a[Math.floor(r() * a.length)]; }
function intR(r, lo, hi) { return lo + Math.floor(r() * (hi - lo + 1)); }
function shuffleR(r, a) { var i, j, t; a = a.slice(); for (i = a.length - 1; i > 0; i--) { j = Math.floor(r() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function cash(c) { var d = Math.floor(c / 100), r = c % 100; return '$' + d.toLocaleString('en-CA') + '.' + (r < 10 ? '0' : '') + r; }
function cashW(c) { return c % 100 ? cash(c) : '$' + (c / 100).toLocaleString('en-CA'); }
function startState(seed, mode) { return { r: RNG(seed), mode: mode, real: mode === 'real', t: 0, score: 0, right: 0, wrong: 0, ver: 0, pops: [], msg: '', over: false }; }
function gain(st, at, n) { n = n || 1; st.score += n; st.right++; st.pops.push({ pts: n, at: at }); st.ver++; }
function lose(st, at, n) { n = n || 1; st.score -= n; st.wrong++; st.pops.push({ pts: -n, at: at }); st.ver++; }
function tierOf(th) { return function (st) { var t = th[st.real ? 1 : 0]; return st.score >= t[0] ? 'great' : st.score >= t[1] ? 'ok' : 'poor'; }; }
var GAMES = {};

/* Valley Market (grocery clerk): Till rush. Give the right change. Cash totals round to 5¢ (Canada has no pennies).
   Gentle: totals in quarters and the change due is shown. Real: any 5¢ total, and you work out the change yourself. */
var DENOMS = [2000, 1000, 500, 200, 100, 25, 10, 5];
GAMES.grocer = {
  id: 'grocer', name: 'Till rush', th: [[7, 3], [6, 3]], pace: { think: 1800, tap: 650 },
  make: function (seed, mode) { var st = startState(seed, mode); st.served = 0; tillNext(st); return st; },
  update: function (st, dt) { st.t += dt; },
  act: function (st, a) {
    var m = /^d(\d+)$/.exec(a);
    if (m) { if (st.given >= 10000) return false; st.tray.push(+m[1]); st.given += +m[1]; st.msg = st.given > st.change && !st.real ? 'That’s too much. Tap Start over.' : ''; st.ver++; return true; }
    if (a === 'clear') { if (!st.tray.length) return false; st.tray = []; st.given = 0; st.msg = 'Tray cleared.'; st.ver++; return true; }
    if (a === 'give') {
      if (!st.tray.length) return false;
      if (st.given === st.change) { gain(st, 'give'); st.served++; st.msg = 'Right change! Next customer.'; }
      else { lose(st, 'give'); st.msg = 'Not right: the change was ' + cash(st.change) + ', and you gave ' + cash(st.given) + '.'; }
      tillNext(st); return true;
    }
    return false;
  },
  best: function (st) {
    if (st.given === st.change) return 'give';
    if (st.given > st.change) return 'clear';
    var left = st.change - st.given, i; for (i = 0; i < DENOMS.length; i++) if (DENOMS[i] <= left) return 'd' + DENOMS[i];
    return 'clear';
  },
  actions: function () { return DENOMS.map(function (d) { return 'd' + d; }).concat(['clear', 'give']); }
};
function tillNext(st) {
  var r = st.r, total, bills;
  if (st.real) { total = intR(r, 41, 379) * 5; bills = [500, 1000, 2000]; } else { total = intR(r, 5, 39) * 25; bills = [500, 1000]; }
  bills = bills.filter(function (b) { return b > total; });
  st.total = total; st.paid = bills.length > 1 && r() < 0.3 ? bills[1] : bills[0]; st.change = st.paid - total; st.tray = []; st.given = 0; st.ver++;
}

/* The Lantern Diner (busser): Table turn. Diners leave a mess; clear the table, then set it, and the next group sits.
   A group that waits too long leaves. Tapping a table where people are still eating costs a point. */
GAMES.busser = {
  id: 'busser', name: 'Table turn', th: [[14, 7], [16, 7]], pace: { think: 700, tap: 600 },
  make: function (seed, mode) {
    var st = startState(seed, mode), r = st.r;
    st.P = st.real ? { every: 2400, eat: [5000, 8000], wait: 8000 } : { every: 3000, eat: [6000, 9000], wait: 11000 };
    st.tables = ['eat', 'eat', 'eat', 'dirty', 'dirty', 'set'].map(function (s) { return { s: s, until: s === 'eat' ? intR(r, 2500, 9000) : 0 }; });
    st.tables = shuffleR(r, st.tables); st.queue = []; st.next = 1200; st.turned = 0; st.lost = 0; st.oops = 0;
    return st;
  },
  update: function (st, dt) {
    var r = st.r, P = st.P;
    st.t += dt;
    st.tables.forEach(function (tb, i) { if (tb.s === 'eat') { tb.until -= dt; if (tb.until <= 0) { tb.s = 'dirty'; st.ver++; } } });
    st.next -= dt;
    if (st.next <= 0) { st.queue.push({ w: 0, n: intR(r, 2, 4) }); st.next = P.every * (0.8 + 0.4 * r()); st.ver++; }
    st.queue.forEach(function (q) { q.w += dt; });
    while (st.queue.length && st.queue[0].w >= P.wait) { st.queue.shift(); st.lost++; lose(st, 'door'); st.msg = 'A group waited too long and left.'; }
    busserSeat(st);
  },
  act: function (st, a) {
    var m = /^t(\d)$/.exec(a), tb = m && st.tables[+m[1]];
    if (!tb) return false;
    if (tb.s === 'dirty') { tb.s = 'clean'; st.msg = 'Cleared. Now set it.'; st.ver++; return true; }
    if (tb.s === 'clean') { tb.s = 'set'; st.turned++; gain(st, a); st.msg = 'Table ready!'; busserSeat(st); return true; }
    if (tb.s === 'eat') { st.oops++; lose(st, a); st.msg = 'Those diners weren’t finished yet!'; return true; }
    return false;
  },
  best: function (st) {
    var i, c = -1, d = -1;
    for (i = 0; i < st.tables.length; i++) { if (st.tables[i].s === 'clean' && c < 0) c = i; if (st.tables[i].s === 'dirty' && d < 0) d = i; }
    return c >= 0 ? 't' + c : d >= 0 ? 't' + d : null;
  },
  actions: function (st) { return st.tables.map(function (t, i) { return 't' + i; }); }
};
function busserSeat(st) {
  st.tables.forEach(function (tb) {
    if (tb.s === 'set' && st.queue.length) { st.queue.shift(); tb.s = 'eat'; tb.until = intR(st.r, st.P.eat[0], st.P.eat[1]); st.ver++; }
  });
}

/* Northside Sports (sales helper, 2% commission): Gear match. Find the item and size the customer asks for. */
var GEAR = [['Hockey skates', '⛸️', 12000], ['Soccer cleats', '⚽', 8000], ['Basketball shoes', '🏀', 11000], ['Running shoes', '👟', 9500], ['Ski boots', '🎿', 18000], ['Bike helmet', '🚲', 6000]];
GAMES.sports = {
  id: 'sports', name: 'Gear match', th: [[12, 6], [13, 6]], pace: { think: 2200, tap: 500 },
  make: function (seed, mode) { var st = startState(seed, mode); st.sales = 0; gearNext(st); return st; },
  update: function (st, dt) { st.t += dt; },
  act: function (st, a) {
    var m = /^b(\d)$/.exec(a), b = m && st.shelf[+m[1]];
    if (!b) return false;
    if (b.g === st.want.g && b.size === st.want.size) { var g = GEAR[b.g]; st.sales += g[2]; gain(st, a); st.msg = 'Sold: ' + g[0].toLowerCase() + ', ' + cashW(g[2]) + '. Your 2% commission: ' + cash(Math.round(g[2] * 0.02)) + '.'; gearNext(st); }
    else { lose(st, a); st.msg = b.g === st.want.g ? 'Wrong size. They bring it back.' : 'That’s not what they asked for.'; }
    return true;
  },
  best: function (st) { var i; for (i = 0; i < st.shelf.length; i++) if (st.shelf[i].g === st.want.g && st.shelf[i].size === st.want.size) return 'b' + i; return null; },
  actions: function (st) { return st.shelf.map(function (b, i) { return 'b' + i; }); }
};
function gearNext(st) {
  var r = st.r, n = st.real ? 6 : 4, want = { g: intR(r, 0, GEAR.length - 1), size: intR(r, 5, 11) }, shelf = [want], key = {}, b, tries = 0;
  key[want.g + ':' + want.size] = 1;
  while (shelf.length < n && tries++ < 200) {
    var k = shelf.length % 3; // same item another size, the same size another item, or anything
    b = k === 1 ? { g: want.g, size: intR(r, 5, 11) } : k === 2 ? { g: intR(r, 0, GEAR.length - 1), size: want.size } : { g: intR(r, 0, GEAR.length - 1), size: intR(r, 5, 11) };
    if (st.real && k === 1 && r() < 0.6) b.size = want.size + (r() < 0.5 ? -1 : 1); // Real: a size next to the right one
    if (b.size < 5 || b.size > 11 || key[b.g + ':' + b.size]) continue;
    key[b.g + ':' + b.size] = 1; shelf.push(b);
  }
  st.want = want; st.shelf = shuffleR(r, shelf); st.ver++;
}

/* Prairie Parcel (warehouse): Sort the belt. Send the front parcel down the chute for its zone before it falls off the end. */
var ZONES = ['N', 'E', 'S', 'W'];
GAMES.warehouse = {
  id: 'warehouse', name: 'Sort the belt', th: [[15, 8], [20, 10]], pace: { think: 700, tap: 300 },
  make: function (seed, mode) { var st = startState(seed, mode); st.P = st.real ? { speed: 1 / 6500, every: 2000 } : { speed: 1 / 8500, every: 2600 }; st.belt = []; st.next = 400; st.n = 0; st.sorted = 0; st.dropped = 0; return st; },
  update: function (st, dt) {
    var r = st.r;
    st.t += dt; st.next -= dt;
    if (st.next <= 0) { st.belt.push({ id: st.n++, z: pickR(r, ZONES), x: 0 }); st.next = st.P.every * (0.8 + 0.4 * r()); st.ver++; }
    st.belt.forEach(function (p) { p.x += st.P.speed * dt; });
    while (st.belt.length && st.belt[0].x >= 1) { st.belt.shift(); st.dropped++; lose(st, 'end'); st.msg = 'A parcel fell off the end of the belt!'; }
  },
  act: function (st, a) {
    var m = /^z([NESW])$/.exec(a), p = st.belt[0];
    if (!m || !p) return false;
    st.belt.shift();
    if (p.z === m[1]) { st.sorted++; gain(st, a); st.msg = ''; } else { lose(st, a); st.msg = 'Wrong chute! That parcel was for zone ' + p.z + '.'; }
    st.ver++; return true;
  },
  best: function (st) { return st.belt.length ? 'z' + st.belt[0].z : null; },
  actions: function () { return ZONES.map(function (z) { return 'z' + z; }); }
};

/* Spoke & Chain Bikes (service writer): Repair desk. Read the bike, pick the repair ticket, take off the old part, put on the new one,
   hand the bike back. A wrong ticket fixes the wrong thing, and the rider comes back with the problem still there (−2: you fix it for free). */
var REPAIRS = {
  flat:   { ticket: 'Flat tire', zone: 'tire', part: 'tube', partName: 'Inner tube', zoneName: 'Back tire', said: 'flat tire' },
  chain:  { ticket: 'Rusty chain', zone: 'chain', part: 'chain', partName: 'Chain', zoneName: 'Chain', said: 'rusty chain' },
  wheel:  { ticket: 'Bent wheel', zone: 'wheel', part: 'wheel', partName: 'Front wheel', zoneName: 'Front wheel', said: 'bent wheel' },
  brakes: { ticket: 'Worn brake pads', zone: 'brakes', part: 'pads', partName: 'Brake pads', zoneName: 'Brakes', said: 'worn brakes' },
  seat:   { ticket: 'Loose seat', zone: 'seat', part: 'bolt', partName: 'Seat bolt', zoneName: 'Seat', said: 'loose seat' }
};
var REPAIR_KEYS = ['flat', 'chain', 'wheel', 'brakes', 'seat'], BIKE_ZONES = ['tire', 'chain', 'wheel', 'brakes', 'seat'], BIKE_PARTS = ['tube', 'chain', 'wheel', 'pads', 'bolt'];
GAMES.bikeshop = {
  id: 'bikeshop', name: 'Repair desk', th: [[5, 2], [6, 3]], pace: { think: 1500, tap: 700 },
  make: function (seed, mode) { var st = startState(seed, mode); st.fixed = 0; st.parts = shuffleR(st.r, BIKE_PARTS); bikeNext(st); return st; },
  update: function (st, dt) { st.t += dt; },
  act: function (st, a) {
    var m = /^(k|z|p):(\w+)$/.exec(a), R;
    if (a === 'give' && st.stage === 'return') {
      if (st.ticket === st.problem) { st.fixed++; gain(st, a); st.msg = 'Fixed! The rider pedals away happy.'; }
      else { lose(st, a, 2); st.msg = 'The rider is back. The ' + REPAIRS[st.problem].said + ' is still there! You fix it for free.'; }
      bikeNext(st); return true;
    }
    if (!m) return false;
    if (m[1] === 'k' && st.stage === 'ticket' && st.tickets.indexOf(m[2]) >= 0) { st.ticket = m[2]; st.stage = 'remove'; st.msg = 'Ticket: ' + REPAIRS[m[2]].ticket.toLowerCase() + '. Tap that part on the bike.'; st.ver++; return true; }
    R = st.ticket && REPAIRS[st.ticket];
    if (m[1] === 'z' && st.stage === 'remove') {
      if (m[2] === R.zone) { st.stage = 'install'; st.msg = 'Off it comes. Now grab the new part.'; st.ver++; } else { lose(st, a); st.msg = 'That part wasn’t on your ticket. Now you have to put it back on.'; }
      return true;
    }
    if (m[1] === 'p' && st.stage === 'install') {
      if (m[2] === R.part) { st.stage = 'return'; st.msg = 'Done. Hand the bike back.'; st.ver++; } else { lose(st, a); st.msg = 'That part doesn’t go there.'; }
      return true;
    }
    return false;
  },
  best: function (st) { return st.stage === 'ticket' ? 'k:' + st.problem : st.stage === 'remove' ? 'z:' + REPAIRS[st.ticket].zone : st.stage === 'install' ? 'p:' + REPAIRS[st.ticket].part : 'give'; },
  actions: function (st) {
    if (st.stage === 'ticket') return st.tickets.map(function (k) { return 'k:' + k; });
    if (st.stage === 'remove') return BIKE_ZONES.map(function (z) { return 'z:' + z; });
    if (st.stage === 'install') return st.parts.map(function (p) { return 'p:' + p; });
    return ['give'];
  }
};
function bikeNext(st) {
  var r = st.r, last = st.problem, pr;
  do pr = pickR(r, REPAIR_KEYS); while (pr === last);
  st.problem = pr; st.ticket = null; st.stage = 'ticket';
  st.tickets = shuffleR(r, [pr].concat(shuffleR(r, REPAIR_KEYS.filter(function (k) { return k !== pr; })).slice(0, st.real ? 4 : 3)));
  st.rider = intR(r, 0, 5); st.ver++;
}

/* CellPoint (sales associate, 4% commission): Best plan. Sell the cheapest plan that covers what the customer needs.
   Too small, and they run out; bigger than they need, and they pay for nothing. Real adds calling minutes. */
var PLAN_GB = [2, 4, 6, 10, 15, 25, 50], PLAN_PRICE = [2500, 3000, 3500, 4500, 5500, 6500, 8000], UNLIMITED_CALLS = 1000;
GAMES.phones = {
  id: 'phones', name: 'Best plan', th: [[10, 5], [9, 4]], pace: { think: 3000, tap: 500 },
  make: function (seed, mode) { var st = startState(seed, mode); planNext(st); return st; },
  update: function (st, dt) { st.t += dt; },
  act: function (st, a) {
    var m = /^o(\d)$/.exec(a), o = m && st.opts[+m[1]];
    if (!o) return false;
    if (o.kind === 'right') { gain(st, a); st.msg = 'Happy customer: ' + cashW(o.price) + ' a month, and it covers everything.'; }
    else if (o.kind === 'small') { lose(st, a); st.msg = o.gb < st.need.gb ? 'They ran out of data in a week. They’re back, and they’re not happy.' : 'They ran out of calling minutes. They’re back, and they’re not happy.'; }
    else { lose(st, a); st.msg = 'They’re paying for more than they need. They switch stores next month.'; }
    planNext(st); return true;
  },
  best: function (st) { var i; for (i = 0; i < st.opts.length; i++) if (st.opts[i].kind === 'right') return 'o' + i; return null; },
  actions: function (st) { return st.opts.map(function (o, i) { return 'o' + i; }); }
};
function planOf(i, calls) { return { gb: PLAN_GB[i], calls: calls, price: PLAN_PRICE[i] + (calls ? UNLIMITED_CALLS : 0) }; }
function planNext(st) {
  var r = st.r, i = intR(r, 1, 5), lo = PLAN_GB[i - 1] + 1, calls = st.real && r() < 0.5, need = { gb: intR(r, lo, PLAN_GB[i]), calls: calls }, right = planOf(i, calls), small, big;
  // Real, with calls: the "too small" plan may have the data but not the minutes
  small = calls && r() < 0.5 ? planOf(i, false) : planOf(i - 1, calls);
  big = planOf(Math.min(PLAN_GB.length - 1, i + intR(r, 1, 2)), calls || (st.real && r() < 0.5));
  right.kind = 'right'; small.kind = 'small'; big.kind = 'big';
  st.need = need; st.opts = shuffleR(r, [right, small, big]); st.ver++;
}

/* Riverbend Clinic (office coordinator): Front desk. Book each caller into the time they ask for. Never double-book.
   Gentle: mornings and afternoons. Real: four times a day, and some callers give a second choice. */
var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
GAMES.office = {
  id: 'office', name: 'Front desk', th: [[12, 6], [11, 5]], pace: { think: 2400, tap: 500 },
  make: function (seed, mode) { var st = startState(seed, mode); st.times = st.real ? ['9:00', '11:00', '2:00', '4:00'] : ['Morning', 'Afternoon']; st.week = 0; deskWeek(st); deskNext(st); return st; },
  update: function (st, dt) { st.t += dt; },
  act: function (st, a) {
    var m = /^s(\d)_(\d)$/.exec(a), d, t;
    if (!m) return false;
    d = +m[1]; t = +m[2];
    if (st.booked[d][t]) { lose(st, a); st.msg = 'Double-booked! ' + DAY_NAMES[d] + ' ' + slotName(st, t) + ' was already taken.'; return true; }
    if (d !== st.want.d || t !== st.want.t) { lose(st, a); st.msg = 'That’s not the time they asked for. They repeat it.'; return true; }
    st.booked[d][t] = 2; gain(st, a); st.msg = 'Booked: ' + DAY_NAMES[d] + ' ' + slotName(st, t) + '.';
    if (deskOpen(st).length < 4) { deskWeek(st); st.msg += ' New week!'; }
    deskNext(st); return true;
  },
  best: function (st) { return 's' + st.want.d + '_' + st.want.t; },
  actions: function (st) { var a = [], d, t; for (d = 0; d < 5; d++) for (t = 0; t < st.times.length; t++) a.push('s' + d + '_' + t); return a; }
};
function slotName(st, t) { return st.real ? 'at ' + st.times[t] : st.times[t].toLowerCase(); }
function deskOpen(st) { var a = [], d, t; for (d = 0; d < 5; d++) for (t = 0; t < st.times.length; t++) if (!st.booked[d][t]) a.push([d, t]); return a; }
function deskWeek(st) { // a new week, about 40% booked already, with at least 5 open slots
  var r = st.r; st.week++;
  do st.booked = DAYS.map(function () { return st.times.map(function () { return r() < 0.4 ? 1 : 0; }); }); while (deskOpen(st).length < 5);
  st.ver++;
}
function deskNext(st) {
  var r = st.r, open = deskOpen(st), w = pickR(r, open), full = [], d, t;
  for (d = 0; d < 5; d++) for (t = 0; t < st.times.length; t++) if (st.booked[d][t]) full.push([d, t]);
  st.want = { d: w[0], t: w[1] }; st.first = null;
  if (full.length && r() < (st.real ? 0.5 : 0.25)) { var f = pickR(r, full); st.first = { d: f[0], t: f[1] }; } // "or if that's taken…"
  st.caller = intR(r, 0, 5); st.ver++;
}

/* Bright Spark Electric (apprentice electrician): Wire it right. Breaker off first. Black to brass, white to silver, bare copper to green.
   Breaker back on to test the light. Touching a wire with the power on is a shock. */
var WIRES = { black: 'brass', white: 'silver', bare: 'green' };
GAMES.apprentice = {
  id: 'apprentice', name: 'Wire it right', th: [[4, 2], [5, 2]], pace: { think: 600, tap: 600 },
  make: function (seed, mode) { var st = startState(seed, mode); st.circuits = 0; st.shocks = 0; wireNext(st); return st; },
  update: function (st, dt) { st.t += dt; },
  act: function (st, a) {
    var m = /^(w|s):(\w+)$/.exec(a), all = wireAll(st);
    if (a === 'brk') {
      if (st.power) { st.power = false; st.msg = 'Breaker off. Now it’s safe to touch the wires.'; st.ver++; return true; }
      if (!all) { st.msg = 'Finish the wiring before you turn the power back on.'; st.ver++; return true; }
      st.circuits++; gain(st, a); st.msg = 'Power on… the light works!'; wireNext(st); return true;
    }
    if (!m) return false;
    if (m[1] === 'w') {
      if (st.done[m[2]]) return false;
      if (st.power) { st.shocks++; lose(st, a, 2); st.sel = null; st.msg = 'ZAP! The power was on. Always turn the breaker off first.'; return true; }
      st.sel = m[2]; st.msg = (m[2] === 'bare' ? 'Bare copper' : m[2][0].toUpperCase() + m[2].slice(1) + ' wire') + ' in hand. Which screw?'; st.ver++; return true;
    }
    if (m[1] === 's') {
      if (!st.sel) { st.msg = 'Pick up a wire first.'; st.ver++; return true; }
      if (WIRES[st.sel] === m[2]) { st.done[st.sel] = 1; st.sel = null; st.msg = wireAll(st) ? 'All three wires on. Turn the breaker on to test it.' : 'Tight. Next wire.'; st.ver++; }
      else { lose(st, a); st.sel = null; st.msg = 'Wrong screw. Black to brass, white to silver, bare copper to green.'; }
      return true;
    }
    return false;
  },
  best: function (st) {
    var w;
    if (st.power) return wireAll(st) ? null : 'brk';
    if (wireAll(st)) return 'brk';
    if (st.sel) return 's:' + WIRES[st.sel];
    for (w in WIRES) if (!st.done[w]) return 'w:' + w;
    return null;
  },
  actions: function (st) { return ['brk'].concat(st.wires.filter(function (w) { return !st.done[w]; }).map(function (w) { return 'w:' + w; }), st.screws.map(function (s) { return 's:' + s; })); }
};
function wireAll(st) { return !!(st.done.black && st.done.white && st.done.bare); }
function wireNext(st) { var r = st.r; st.power = true; st.done = {}; st.sel = null; st.wires = shuffleR(r, ['black', 'white', 'bare']); st.screws = shuffleR(r, ['brass', 'silver', 'green']); st.box = intR(r, 0, 2); st.ver++; }

/* Home & Hearth (furniture sales, 6% commission): Will it fit? Find the couch that fits the wall and the budget. */
var COUCHES = ['Cloud sofa', 'Prairie loveseat', 'Maple sofa', 'Comfy-Max couch', 'Riverside sofa', 'Snuggle sectional', 'Classic three-seater', 'Lake House sofa'];
GAMES.furniture = {
  id: 'furniture', name: 'Will it fit?', th: [[9, 4], [8, 4]], pace: { think: 3200, tap: 500 },
  make: function (seed, mode) { var st = startState(seed, mode); st.sales = 0; couchNext(st); return st; },
  update: function (st, dt) { st.t += dt; },
  act: function (st, a) {
    var m = /^c(\d)$/.exec(a), c = m && st.opts[+m[1]];
    if (!c) return false;
    if (c.w <= st.wall && c.price <= st.budget) { st.sales += c.price; gain(st, a); st.msg = 'Sold: the ' + c.name + ' for ' + cash(c.price) + '. Your 6% commission: ' + cash(Math.round(c.price * 0.06)) + '.'; }
    else { lose(st, a); st.msg = c.w > st.wall ? 'It doesn’t fit! ' + c.w + ' cm is wider than the ' + st.wall + ' cm wall. It comes back.' : 'That’s over their budget. They walk out.'; }
    couchNext(st); return true;
  },
  best: function (st) { var i; for (i = 0; i < st.opts.length; i++) if (st.opts[i].w <= st.wall && st.opts[i].price <= st.budget) return 'c' + i; return null; },
  actions: function (st) { return st.opts.map(function (o, i) { return 'c' + i; }); }
};
function couchNext(st) {
  var r = st.r, wall = intR(r, 16, 28) * 10, budget = intR(r, 12, 30) * 5000, near = st.real ? [5, 15] : [15, 40], pn = st.real ? [1, 4] : [5, 15],
    names = shuffleR(r, COUCHES), o = [], i;
  function price(lo, hi) { return Math.round(intR(r, lo, hi) / 10) * 1000 - 100; } // prices like $849
  o.push({ w: wall - intR(r, 0, 2) * 10, price: Math.min(budget - 100, price(budget / 100 - 300, budget / 100 - 20)) }); // the one that fits
  o.push({ w: wall + intR(r, near[0], near[1]), price: price(budget / 100 - 400, budget / 100 - 60) });                 // in budget, too wide
  o.push({ w: wall - intR(r, 1, 4) * 10, price: budget + intR(r, pn[0], pn[1]) * 1000 + 900 });                     // fits, over budget
  if (st.real) o.push({ w: wall + intR(r, 10, 40), price: budget + intR(r, 1, 6) * 1000 + 900 });               // neither
  for (i = 0; i < o.length; i++) { o[i].name = names[i]; o[i].price = Math.max(29900, o[i].price); }
  if (o[0].price > budget) o[0].price = budget - 100;
  st.wall = wall; st.budget = budget; st.opts = shuffleR(r, o); st.ver++;
}

Object.keys(GAMES).forEach(function (k) { GAMES[k].tier = tierOf(GAMES[k].th); });
/* JOBGAMES MODEL END */

  /* ── The view: each game's arena as HTML from its state. Every target is a button (or SVG part) with data-act. ── */
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function btn(a, html, cls, extra) { return '<button class="ct-btn ct-mg-t' + (cls ? ' ' + cls : '') + '" type="button" data-act="' + a + '"' + (extra || '') + '>' + html + '</button>'; }
  var PEOPLE = ['🧑', '👩', '👨', '🧓', '👧', '👵'];
  function digitKey(e, st, g) { var n = /^[1-9]$/.test(e.key) ? +e.key : 0, a = n ? g.actions(st) : null; return a && a[n - 1] ? a[n - 1] : null; }

  var V = {};
  V.grocer = {
    how: '<p><b>Till rush.</b> A customer pays cash. Tap bills and coins to make their <b>change</b>, then tap <b>Give change</b>.</p><p class="ct-small">Cash totals round to the nearest 5¢. There are no pennies in Canada. A wrong amount costs a point.</p>',
    keys: '1–8 bills and coins, Enter gives change, Backspace starts over',
    render: function (st) {
      var lbl = { 2000: '$20', 1000: '$10', 500: '$5', 200: '$2', 100: '$1', 25: '25¢', 10: '10¢', 5: '5¢' };
      return '<div class="ct-mg-card"><span class="ct-mg-who" aria-hidden="true">' + PEOPLE[st.served % PEOPLE.length] + '</span><div><div>Total: <b>' + cash(st.total) + '</b></div><div>Paid with: <b>' + cashW(st.paid) + ' bill</b></div>' +
        (st.real ? '' : '<div class="ct-small">Change due: <b>' + cash(st.change) + '</b></div>') + '</div></div>' +
        '<div class="ct-mg-tray" aria-label="Change in your hand">' + (st.tray.length ? st.tray.map(function (d) { return '<span class="ct-mg-coin' + (d >= 500 ? ' bill' : '') + '">' + lbl[d] + '</span>'; }).join('') : '<span class="ct-small">Your hand is empty.</span>') +
        '<span class="ct-mg-given' + (!st.real && st.given > st.change ? ' over' : '') + '">In your hand: <b>' + cash(st.given) + '</b></span></div>' +
        '<div class="ct-mg-row">' + DENOMS.map(function (d) { return btn('d' + d, lbl[d], d >= 500 ? 'bill' : 'coin'); }).join('') + '</div>' +
        '<div class="ct-mg-row">' + btn('clear', 'Start over') + btn('give', 'Give change ▶', 'primary') + '</div>';
    },
    key: function (e, st) { if (e.key === 'Enter') return 'give'; if (e.key === 'Backspace') return 'clear'; var n = /^[1-8]$/.test(e.key) ? +e.key : 0; return n ? 'd' + DENOMS[n - 1] : null; },
    scoreText: function (st) { return 'Customers served: ' + st.served; },
    stats: function (st) { return 'Right change: <b>' + st.right + '</b>. Wrong change: <b>' + st.wrong + '</b>.'; }
  };
  V.busser = {
    how: '<p><b>Table turn.</b> When diners leave, tap their table to <b>clear</b> it, then tap again to <b>set</b> it. The next group at the door sits down.</p><p class="ct-small">A group that waits too long leaves (−1). Don’t tap a table where people are still eating (−1).</p>',
    keys: '1–6 tables',
    render: function (st) {
      var L = { eat: ['🍽️', 'Eating'], dirty: ['🧺', 'Dirty: clear it'], clean: ['🧽', 'Clean: set it'], set: ['✨', 'Ready'] };
      return '<div class="ct-mg-door" data-act="door" aria-label="Waiting at the door: ' + st.queue.length + '">Door: ' + (st.queue.length ? st.queue.map(function (q, i) { return '<span class="ct-mg-group">' + '👥' + '<span class="ct-mg-wait"><span data-q="' + i + '"></span></span></span>'; }).join('') : '<span class="ct-small">nobody waiting</span>') + '</div>' +
        '<div class="ct-mg-grid three">' + st.tables.map(function (tb, i) { return btn('t' + i, '<span class="ct-mg-ic" aria-hidden="true">' + L[tb.s][0] + '</span><span>Table ' + (i + 1) + '</span><span class="ct-small">' + L[tb.s][1] + '</span>', 'table ' + tb.s); }).join('') + '</div>';
    },
    frame: function (arena, st) { // how long each group has waited: a bar that empties (transform only)
      st.queue.forEach(function (q, i) { var e = arena.querySelector('[data-q="' + i + '"]'); if (!e) return; var k = Math.max(0, 1 - q.w / st.P.wait).toFixed(2); if (e.dataset.k !== k) { e.dataset.k = k; e.style.transform = 'scaleX(' + k + ')'; } });
    },
    key: function (e, st) { return /^[1-6]$/.test(e.key) ? 't' + (+e.key - 1) : null; },
    scoreText: function (st) { return 'Tables turned: ' + st.turned; },
    stats: function (st) { return 'Tables turned: <b>' + st.turned + '</b>. Groups who left: <b>' + st.lost + '</b>. Diners interrupted: <b>' + st.oops + '</b>.'; }
  };
  V.sports = {
    how: '<p><b>Gear match.</b> Read what the customer wants, then tap the box with the <b>right item in the right size</b>.</p><p class="ct-small">You earn 2% commission on every sale. A wrong box costs a point.</p>',
    keys: '1–6 boxes',
    render: function (st) {
      var w = GEAR[st.want.g];
      return '<div class="ct-mg-card"><span class="ct-mg-who" aria-hidden="true">' + PEOPLE[st.right % PEOPLE.length] + '</span><div>“I need <b>' + w[0].toLowerCase() + '</b>, size <b>' + st.want.size + '</b>, please.”</div></div>' +
        '<div class="ct-mg-grid ' + (st.shelf.length === 4 ? 'four' : 'three') + '">' + st.shelf.map(function (b, i) { var g = GEAR[b.g]; return btn('b' + i, '<span class="ct-mg-ic" aria-hidden="true">' + g[1] + '</span><span>' + esc(g[0]) + '</span><span class="ct-mg-size">Size ' + b.size + '</span>', 'box'); }).join('') + '</div>';
    },
    key: function (e, st) { return digitKey(e, st, GAMES.sports); },
    scoreText: function (st) { return 'Sales: ' + st.right + ' · ' + cashW(st.sales); },
    stats: function (st) { return 'Sales: <b>' + st.right + '</b> (' + cashW(st.sales) + ', so ' + cash(Math.round(st.sales * 0.02)) + ' in commission). Wrong boxes: <b>' + st.wrong + '</b>.'; }
  };
  var ZCOL = { N: 'n', E: 'e', S: 's', W: 'w' }, ZNAME = { N: 'North', E: 'East', S: 'South', W: 'West' }, ZARROW = { N: '↑', E: '→', S: '↓', W: '←' };
  V.warehouse = {
    how: '<p><b>Sort the belt.</b> Parcels ride the belt to the right. Send the <b>front parcel</b> (the one with the gold outline) down the chute for its zone: N, E, S or W.</p><p class="ct-small">A wrong chute costs a point. So does a parcel that falls off the end.</p>',
    keys: 'arrow keys (↑ North, → East, ↓ South, ← West)',
    render: function (st) {
      return '<div class="ct-mg-belt" aria-label="' + st.belt.length + ' parcels on the belt' + (st.belt.length ? '. Front parcel: zone ' + st.belt[0].z : '') + '">' +
        st.belt.map(function (p, i) { return '<span class="ct-mg-lane" data-p="' + p.id + '"><span class="ct-mg-parcel' + (st.real ? '' : ' z-' + ZCOL[p.z]) + (i === 0 ? ' front' : '') + '">' + p.z + '</span></span>'; }).join('') + '<span class="ct-mg-end" data-act="end" aria-hidden="true"></span></div>' +
        '<div class="ct-mg-row chutes">' + ZONES.map(function (z) { return btn('z' + z, '<b>' + ZARROW[z] + ' ' + z + '</b><span class="ct-small">' + ZNAME[z] + '</span>', 'chute z-' + ZCOL[z]); }).join('') + '</div>';
    },
    frame: function (arena, st) { st.belt.forEach(function (p) { var e = arena.querySelector('[data-p="' + p.id + '"]'); if (!e) return; var v = (p.x * 88).toFixed(1); if (e.dataset.v !== v) { e.dataset.v = v; e.style.transform = 'translateX(' + v + '%)'; } }); },
    key: function (e) { var k = { ArrowUp: 'N', ArrowRight: 'E', ArrowDown: 'S', ArrowLeft: 'W', w: 'N', d: 'E', s: 'S', a: 'W' }[e.key]; return k ? 'z' + k : null; },
    scoreText: function (st) { return 'Parcels sorted: ' + st.sorted; },
    stats: function (st) { return 'Sorted: <b>' + st.sorted + '</b>. Wrong chute: <b>' + (st.wrong - st.dropped) + '</b>. Fell off: <b>' + st.dropped + '</b>.'; }
  };
  function bikeSVG(st) { // the bike on the stand: the problem shows until its part comes off, and the new part shows once it is on
    var pr = st.problem, R = REPAIRS[st.ticket] || {}, off = st.stage === 'install' ? R.zone : null, fixedZone = st.stage === 'return' ? R.zone : null;
    function bad(z) { return REPAIRS[pr].zone === z && fixedZone !== z && off !== z; }
    function zone(z, inner) { var cls = 'ct-mg-zone' + (off === z ? ' off' : '') + (fixedZone === z ? ' new' : '') + (!st.real && (st.stage === 'remove' ? R.zone === z : st.stage === 'ticket' && bad(z)) ? ' hint' : ''); // Gentle: the problem glows
      return '<g data-act="z:' + z + '" class="' + cls + '"><title>' + REPAIRS[REPAIR_KEYS[BIKE_ZONES.indexOf(z)]].zoneName + '</title>' + inner + '</g>'; }
    var tire = bad('tire') ? '<ellipse cx="50" cy="91" rx="30" ry="22" class="tire flat"/><text x="20" y="118" class="ct-mg-sfx">pssst…</text>' : '<circle cx="50" cy="85" r="28" class="tire"/>';
    var wheel = bad('wheel') ? '<ellipse cx="150" cy="85" rx="28" ry="23" transform="rotate(18 150 85)" class="tire"/><ellipse cx="150" cy="85" rx="20" ry="15" transform="rotate(-14 150 85)" class="rim"/>' : '<circle cx="150" cy="85" r="28" class="tire"/><circle cx="150" cy="85" r="20" class="rim"/>';
    var chain = '<path d="M50 80 L95 76 A9 9 0 0 1 95 94 L50 90 A5 5 0 0 1 50 80 Z" class="chain' + (bad('chain') ? ' rust' : '') + '"/><circle cx="95" cy="85" r="8" class="ring"/>' +
      (bad('chain') ? '<text x="62" y="108" class="ct-mg-sfx">creak…</text>' : '');
    var brakes = '<rect x="141" y="54" width="7" height="' + (bad('brakes') ? 3 : 8) + '" class="pad"/><rect x="153" y="54" width="7" height="' + (bad('brakes') ? 3 : 8) + '" class="pad"/>' + (bad('brakes') ? '<text x="160" y="48" class="ct-mg-sfx">squeal!</text>' : '');
    var seat = '<g transform="rotate(' + (bad('seat') ? 28 : 0) + ' 74 36)"><rect x="62" y="31" width="26" height="7" rx="3" class="seat"/></g><line x1="74" y1="38" x2="76" y2="46" class="frame"/>';
    return '<svg class="ct-mg-bike" viewBox="0 0 200 122" role="img" aria-label="A bike with a ' + REPAIRS[pr].said + '">' +
      '<g class="frame-g"><line x1="50" y1="85" x2="95" y2="85" class="frame"/><line x1="95" y1="85" x2="76" y2="46" class="frame"/><line x1="76" y1="46" x2="50" y2="85" class="frame"/>' +
      '<line x1="76" y1="46" x2="140" y2="46" class="frame"/><line x1="95" y1="85" x2="140" y2="46" class="frame"/><line x1="140" y1="46" x2="150" y2="85" class="frame"/><line x1="136" y1="38" x2="152" y2="36" class="frame"/></g>' +
      zone('tire', tire) + zone('wheel', wheel) + zone('chain', chain) + zone('brakes', brakes) + zone('seat', seat) + '</svg>';
  }
  V.bikeshop = {
    how: '<p><b>Repair desk.</b> Look at the bike. <b>1</b> Pick the repair ticket. <b>2</b> Tap the old part on the bike to take it off. <b>3</b> Tap the new part. <b>4</b> Hand the bike back.</p><p class="ct-small">The wrong part costs a point. A wrong ticket fixes the wrong thing: the rider comes back, and you fix it for free (−2).</p>',
    keys: '1–5 pick from the choices shown',
    render: function (st) {
      var R = REPAIRS[st.ticket] || {}, step = { ticket: 1, remove: 2, install: 3, 'return': 4 }[st.stage], out;
      out = '<div class="ct-mg-card"><span class="ct-mg-who" aria-hidden="true">' + PEOPLE[st.rider] + '</span><div>“' + ['Something’s wrong with my bike.', 'It just doesn’t ride right.', 'Can you take a look?', 'It was fine yesterday!'][st.rider % 4] + '”' +
        (st.ticket ? '<div class="ct-small">Ticket: <b>' + esc(R.ticket) + '</b></div>' : '') + '</div></div>' +
        '<div class="ct-mg-bikebox">' + bikeSVG(st) + '</div><p class="ct-mg-step">Step ' + step + ' of 4: ' + ['', 'Pick the repair ticket.', 'Tap the old part on the bike (or a button below).', 'Tap the new part.', 'Hand the bike back.'][step] + '</p>';
      if (st.stage === 'ticket') out += '<div class="ct-mg-row">' + st.tickets.map(function (k) { return btn('k:' + k, '🎫 ' + esc(REPAIRS[k].ticket), 'ticket'); }).join('') + '</div>';
      if (st.stage === 'remove') out += '<div class="ct-mg-row">' + BIKE_ZONES.map(function (z, i) { return btn('z:' + z, esc(REPAIRS[REPAIR_KEYS[i]].zoneName)); }).join('') + '</div>';
      if (st.stage === 'install') out += '<div class="ct-mg-row">' + st.parts.map(function (p) { var k = REPAIR_KEYS[BIKE_PARTS.indexOf(p)]; return btn('p:' + p, '🔧 ' + esc(REPAIRS[k].partName), 'part'); }).join('') + '</div>';
      if (st.stage === 'return') out += '<div class="ct-mg-row">' + btn('give', 'Hand the bike back ▶', 'primary') + '</div>';
      return out;
    },
    key: function (e, st) { return digitKey(e, st, GAMES.bikeshop); },
    scoreText: function (st) { return 'Bikes fixed: ' + st.fixed; },
    stats: function (st) { return 'Fixed: <b>' + st.fixed + '</b>. Came back still broken: <b>' + st.wrong + '</b>.'; }
  };
  V.phones = {
    how: '<p><b>Best plan.</b> Read what the customer needs. Tap the <b>cheapest plan that covers it</b>.</p><p class="ct-small">Too small, and they run out (−1). Bigger than they need, and they pay for nothing (−1). Happy customers come back.</p>',
    keys: '1–3 plans',
    render: function (st) {
      var n = st.need;
      return '<div class="ct-mg-card"><span class="ct-mg-who" aria-hidden="true">' + PEOPLE[(st.right + st.wrong) % PEOPLE.length] + '</span><div>“I use about <b>' + n.gb + ' GB</b> of data a month' + (st.real ? (n.calls ? ', and I talk on the phone <b>a lot</b>.”' : '. I hardly ever call anyone.”') : '.”') + '</div></div>' +
        '<div class="ct-mg-grid three">' + st.opts.map(function (o, i) { return btn('o' + i, '<span class="ct-mg-ic" aria-hidden="true">📱</span><b>' + o.gb + ' GB</b><span class="ct-small">' + (o.calls ? 'Unlimited calls' : '300 minutes of calls') + '</span><span class="ct-mg-price">' + cashW(o.price) + '/month</span>', 'plan'); }).join('') + '</div>';
    },
    key: function (e, st) { return digitKey(e, st, GAMES.phones); },
    scoreText: function (st) { return 'Happy customers: ' + st.right; },
    stats: function (st) { return 'Happy customers: <b>' + st.right + '</b>. Wrong plans: <b>' + st.wrong + '</b>.'; }
  };
  V.office = {
    how: '<p><b>Front desk.</b> A patient calls for an appointment. Tap the <b>open slot</b> they ask for.</p><p class="ct-small">Grey slots are already booked. Double-booking costs a point, and so does the wrong time.</p>',
    keys: 'Tab to a slot, then Enter',
    render: function (st) {
      var w = st.want, ask = st.first ? '“Can I come ' + DAY_NAMES[st.first.d] + ' ' + slotName(st, st.first.t) + '? If that’s taken, ' + DAY_NAMES[w.d] + ' ' + slotName(st, w.t) + '.”' : '“Can I come in ' + DAY_NAMES[w.d] + ' ' + slotName(st, w.t) + '?”';
      return '<div class="ct-mg-card"><span class="ct-mg-who" aria-hidden="true">☎️</span><div>' + ask + '</div></div>' +
        '<div class="ct-mg-sched" style="grid-template-columns:auto repeat(5,minmax(0,1fr))"><span></span>' + DAYS.map(function (d) { return '<b>' + d + '</b>'; }).join('') +
        st.times.map(function (tm, t) { return '<span class="ct-small">' + tm + '</span>' + DAYS.map(function (d, di) { var b = st.booked[di][t]; return btn('s' + di + '_' + t, b ? (b === 2 ? 'You booked' : 'Booked') : 'Open', b ? 'slot full' : 'slot', ' aria-label="' + DAY_NAMES[di] + ' ' + tm + (b ? ', booked' : ', open') + '"'); }).join(''); }).join('') + '</div>';
    },
    scoreText: function (st) { return 'Booked: ' + st.right; },
    stats: function (st) { return 'Appointments booked: <b>' + st.right + '</b>. Mistakes: <b>' + st.wrong + '</b>.'; }
  };
  var WNAME = { black: 'Black wire', white: 'White wire', bare: 'Bare copper' }, SNAME = { brass: 'Brass screw', silver: 'Silver screw', green: 'Green screw' };
  V.apprentice = {
    how: '<p><b>Wire it right.</b> <b>1</b> Turn the breaker <b>off</b>. <b>2</b> Tap a wire, then its screw: <b>black → brass</b>, <b>white → silver</b>, <b>bare copper → green</b>. <b>3</b> Turn the breaker back <b>on</b> to test the light.</p><p class="ct-small">Touching a wire with the power on is a shock (−2). A wrong screw costs a point.</p>',
    keys: 'B breaker, 1–3 wires, 4–6 screws',
    render: function (st) {
      var cg = st.real ? '' : ' hint';
      return '<div class="ct-mg-wiring"><div class="ct-mg-panel">' + btn('brk', '<span class="ct-mg-ic" aria-hidden="true">' + (st.power ? '⚡' : '⭘') + '</span>Breaker: <b>' + (st.power ? 'ON' : 'OFF') + '</b>', 'breaker ' + (st.power ? 'on' : 'off')) +
        '<span class="ct-mg-bulb' + (st.power && !Object.keys(st.done).length ? ' lit' : '') + '" aria-hidden="true">💡</span><span class="ct-small">' + ['Outlet', 'Light switch', 'Ceiling light'][st.box] + '</span></div>' +
        '<div class="ct-mg-col"><h4>Wires</h4>' + st.wires.map(function (w) { return btn('w:' + w, '<span class="ct-mg-wire ' + w + '"></span>' + WNAME[w] + (st.done[w] ? ' ✓' : ''), 'wire' + (st.sel === w ? ' sel' : ''), st.done[w] ? ' disabled' : ''); }).join('') + '</div>' +
        '<div class="ct-mg-col"><h4>Screws</h4>' + st.screws.map(function (s) { var on = null, w; for (w in st.done) if (WIRES[w] === s) on = w;
          return btn('s:' + s, '<span class="ct-mg-screw ' + s + '"></span>' + SNAME[s] + (on ? ' ✓' : ''), 'screw' + (st.sel && WIRES[st.sel] === s ? cg : ''), on ? ' disabled' : ''); }).join('') + '</div></div>';
    },
    key: function (e, st) {
      if (e.key === 'b' || e.key === 'B') return 'brk';
      var n = /^[1-6]$/.test(e.key) ? +e.key : 0; if (!n) return null;
      return n <= 3 ? 'w:' + st.wires[n - 1] : 's:' + st.screws[n - 4];
    },
    scoreText: function (st) { return 'Circuits done: ' + st.circuits; },
    stats: function (st) { return 'Circuits wired and tested: <b>' + st.circuits + '</b>. Shocks: <b>' + st.shocks + '</b>. Wrong screws: <b>' + (st.wrong - st.shocks) + '</b>.'; }
  };
  V.furniture = {
    how: '<p><b>Will it fit?</b> The customer tells you their wall and their budget. Tap the couch that <b>fits the wall</b> and is <b>in the budget</b>.</p><p class="ct-small">Too wide, and it comes back (−1). Over budget, and they walk out (−1). You earn 6% on every sale.</p>',
    keys: '1–4 couches',
    render: function (st) {
      return '<div class="ct-mg-card"><span class="ct-mg-who" aria-hidden="true">' + PEOPLE[(st.right + st.wrong) % PEOPLE.length] + '</span><div>“My wall is <b>' + st.wall + ' cm</b> wide. I can spend up to <b>' + cashW(st.budget) + '</b>.”</div></div>' +
        '<div class="ct-mg-grid' + (st.opts.length > 3 ? ' four' : ' three') + '">' + st.opts.map(function (o, i) { return btn('c' + i, '<span class="ct-mg-ic" aria-hidden="true">🛋️</span><span>' + esc(o.name) + '</span><span class="ct-small">' + o.w + ' cm wide</span><span class="ct-mg-price">' + cash(o.price) + '</span>', 'couch'); }).join('') + '</div>';
    },
    key: function (e, st) { return digitKey(e, st, GAMES.furniture); },
    scoreText: function (st) { return 'Sales: ' + st.right + ' · ' + cashW(st.sales); },
    stats: function (st) { return 'Sales: <b>' + st.right + '</b> (' + cash(st.sales) + ', so ' + cash(Math.round(st.sales * 0.06)) + ' in commission). Wrong couches: <b>' + st.wrong + '</b>.'; }
  };

  Object.keys(GAMES).forEach(function (k) { var g = GAMES[k], v = V[k]; Object.keys(v).forEach(function (f) { g[f] = v[f]; }); });
  T.jobGames = GAMES;
})();
