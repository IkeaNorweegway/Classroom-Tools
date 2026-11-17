// Math 9 word problems: 11 units × 3 levels.
// Level 1 = one step, Level 2 = two steps, Level 3 = three or more steps.
import { randInt, pick, round, fmt, money, frac, mixed, polyStr, binom, paren, P, PI, piTol } from './helpers.js';

const NAMES = ['Ava', 'Liam', 'Noah', 'Maya', 'Ethan', 'Zoe', 'Owen', 'Priya', 'Jayden', 'Hana', 'Lucas', 'Amara', 'Kai', 'Sofia', 'Mateo', 'Leah'];
const TOWNS = ['Edmonton', 'Calgary', 'Red Deer', 'Grande Prairie', 'Fort McMurray', 'Lethbridge', 'St. Albert', 'Medicine Hat'];

// ══════════ 1. RATIONAL NUMBERS ══════════
const rational = {
  1: [
    () => {
      const t1 = -randInt(8, 28), t2 = randInt(-3, 9), town = pick(TOWNS);
      const d = t2 - t1;
      return P({
        q: `At 7 a.m. the temperature in ${town} was ${fmt(t1)}°C. By 3 p.m. it was ${fmt(t2)}°C. By how many degrees did the temperature rise?`,
        num: d, display: `${d}°C`, unit: '°C',
        hint: 'Change = final − initial. Subtracting a negative is the same as adding.',
        steps: [`Change = final − initial = ${fmt(t2)} − ${paren(t1)} = ${fmt(t2)} + ${-t1} = ${d}°C`],
      });
    },
    () => {
      const owe = round(randInt(500, 4500) / 100, 2), dep = round(randInt(2000, 9000) / 100, 2), n = pick(NAMES);
      const bal = round(-owe + dep, 2);
      return P({
        q: `${n}'s school lunch account has a balance of ${money(-owe)}. ${n} deposits ${money(dep)}. What is the new balance?`,
        num: bal, display: money(bal), unit: '$',
        hint: 'Start at the negative balance and add the deposit.',
        steps: [`New balance = ${fmt(-owe)} + ${fmt(dep)} = ${fmt(bal)}, so ${money(bal)}`],
      });
    },
    () => {
      const depth = round(randInt(30, 90) / 10, 1), times = randInt(3, 6);
      const total = round(-depth * times, 1);
      return P({
        q: `A submarine drone dives ${fmt(depth, 1)} m every minute. Write its change in depth after ${times} minutes as a rational number (use a negative for going down).`,
        num: total, display: `${fmt(total, 1)} m`, unit: 'm',
        hint: 'Going down is negative. Multiply the change per minute by the number of minutes.',
        steps: [`${times} × (−${fmt(depth, 1)}) = ${fmt(total, 1)} m`],
      });
    },
  ],
  2: [
    () => {
      const start = round(randInt(-20, 60) / 10, 1), rate = pick([0.5, 1.5, 2.5, 1.2, 0.8]), h = randInt(3, 8);
      const drop = round(rate * h, 1), end = round(start - drop, 1);
      return P({
        q: `At 6 p.m. it is ${fmt(start, 1)}°C. The temperature falls ${fmt(rate, 1)}°C every hour for ${h} hours. What is the temperature at the end?`,
        num: end, display: `${fmt(end, 1)}°C`, unit: '°C',
        hint: 'First find the total drop, then subtract it from the starting temperature.',
        steps: [`Total drop = ${fmt(rate, 1)} × ${h} = ${fmt(drop, 1)}°C`, `Final = ${fmt(start, 1)} − ${fmt(drop, 1)} = ${fmt(end, 1)}°C`],
      });
    },
    () => {
      // Rope in eighths: total = W + q/4, two pieces of p + s/8
      for (;;) {
        const W = randInt(5, 9), q = randInt(1, 3), p = randInt(1, 3), s = pick([1, 3, 5, 7]);
        const total8 = W * 8 + q * 2, piece8 = p * 8 + s, rem8 = total8 - 2 * piece8;
        if (rem8 <= 0) continue;
        return P({
          q: `A rope is ${mixed(total8, 8)} m long. Two pieces, each ${mixed(piece8, 8)} m long, are cut from it. How much rope is left?`,
          num: rem8 / 8, display: `${mixed(rem8, 8)} m (${fmt(rem8 / 8, 3)} m)`, unit: 'm',
          hint: 'Find the total length cut off, then subtract. Use a common denominator of 8.',
          steps: [
            `Cut off: 2 × ${mixed(piece8, 8)} = ${mixed(2 * piece8, 8)} m`,
            `Left: ${mixed(total8, 8)} − ${mixed(2 * piece8, 8)} = ${total8}/8 − ${2 * piece8}/8 = ${rem8}/8 = ${mixed(rem8, 8)} m`,
          ],
        });
      }
    },
    () => {
      const price = pick([2.75, 3.25, 4.5, 1.75, 5.25]), n = randInt(3, 6), paid = 20 * Math.ceil((price * n + 1) / 20);
      const cost = round(price * n, 2), change = round(paid - cost, 2);
      return P({
        q: `Hot chocolate at the rink costs ${money(price)} a cup. You buy ${n} cups and pay with ${money(paid)}. How much change do you get?`,
        num: change, display: money(change), unit: '$',
        hint: 'Multiply to find the cost, then subtract from what you paid.',
        steps: [`Cost = ${n} × ${money(price)} = ${money(cost)}`, `Change = ${money(paid)} − ${money(cost)} = ${money(change)}`],
      });
    },
  ],
  3: [
    () => {
      for (;;) {
        const temps = Array.from({ length: 5 }, () => round(randInt(-250, 40) / 10, 1));
        const sum = round(temps.reduce((a, b) => a + b, 0), 1);
        if (Math.round(sum * 10) % 5 !== 0) continue; // mean to 2 decimals cleanly
        const mean = round(sum / 5, 2), min = Math.min(...temps), diff = round(mean - min, 2);
        return P({
          q: `The daily low temperatures for five school days in Grande Prairie were ${temps.map(t => fmt(t, 1) + '°C').join(', ')}. How many degrees warmer than the coldest day was the mean low temperature?`,
          num: diff, display: `${fmt(diff, 2)}°C`, unit: '°C',
          hint: 'Find the mean (add, then divide by 5). Then subtract the coldest temperature.',
          steps: [
            `Sum = ${temps.map(t => paren(t)).join(' + ')} = ${fmt(sum, 1)}`,
            `Mean = ${fmt(sum, 1)} ÷ 5 = ${fmt(mean, 2)}°C`,
            `Coldest = ${fmt(min, 1)}°C`,
            `Difference = ${fmt(mean, 2)} − ${paren(min)} = ${fmt(diff, 2)}°C`,
          ],
        });
      }
    },
    () => {
      const d = pick([12.4, 16.8, 20.4, 8.8, 14.4, 18.8]), down = round(randInt(15, 60) / 10, 1);
      const rise = round(d * 0.75, 2), after = round(-d + rise, 2), end = round(after - down, 2);
      return P({
        q: `A diver is at ${fmt(-d, 1)} m (below the surface). She rises 3/4 of the way to the surface, then dives down another ${fmt(down, 1)} m. What is her final position?`,
        num: end, display: `${fmt(end, 2)} m`, unit: 'm',
        hint: '3/4 of the way to the surface means she rises 3/4 of her depth. Then go down again.',
        steps: [
          `Rise = 3/4 × ${fmt(d, 1)} = ${fmt(rise, 2)} m`,
          `Position = ${fmt(-d, 1)} + ${fmt(rise, 2)} = ${fmt(after, 2)} m`,
          `Final = ${fmt(after, 2)} − ${fmt(down, 1)} = ${fmt(end, 2)} m`,
        ],
      });
    },
    () => {
      const shares = randInt(20, 60), buy = round(randInt(1200, 3000) / 100, 2), chg = [round(-randInt(50, 250) / 100, 2), round(randInt(20, 300) / 100, 2), round(-randInt(20, 150) / 100, 2)];
      const finalP = round(buy + chg[0] + chg[1] + chg[2], 2), gain = round((finalP - buy) * shares, 2);
      return P({
        q: `You buy ${shares} shares at ${money(buy)} each. Over three days the price changes by ${chg.map(c => (c < 0 ? '−' : '+') + money(Math.abs(c))).join(', ')}. What is your total gain or loss? (Use a negative for a loss.)`,
        num: gain, display: money(gain), unit: '$',
        hint: 'Add the daily changes to get the change per share, then multiply by the number of shares.',
        steps: [
          `Change per share = ${chg.map(paren).join(' + ')} = ${fmt(round(chg[0] + chg[1] + chg[2], 2))}`,
          `Final price = ${money(buy)} + ${paren(round(chg[0] + chg[1] + chg[2], 2))} = ${money(finalP)}`,
          `Total = ${shares} × ${paren(round(finalP - buy, 2))} = ${money(gain)}`,
        ],
      });
    },
  ],
};

// ══════════ 2. SQUARE ROOTS ══════════
const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]];
const squareRoots = {
  1: [
    () => {
      const s = randInt(6, 25), A = s * s;
      return P({
        q: `A square vegetable garden has an area of ${A} m². How long is each side?`,
        num: s, display: `${s} m`, unit: 'm',
        hint: 'Area of a square = side². Undo the square with a square root.',
        steps: [`side = √${A} = ${s} m`],
      });
    },
    () => {
      const s = pick([0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.2, 1.1]), A = round(s * s, 2);
      return P({
        q: `A square floor tile has an area of ${fmt(A, 2)} m². What is the side length of the tile?`,
        num: s, display: `${fmt(s, 1)} m`, unit: 'm',
        hint: 'Think: what decimal times itself gives this area?',
        steps: [`side = √${fmt(A, 2)} = ${fmt(s, 1)} m, because ${fmt(s, 1)} × ${fmt(s, 1)} = ${fmt(A, 2)}`],
      });
    },
    () => {
      const n = pick([20, 30, 40, 50, 60, 70, 80, 90]), est = round(Math.sqrt(n), 1);
      return P({
        q: `A square poster has an area of ${n} dm². Estimate its side length to one decimal place.`,
        num: est, tol: 0.11, display: `about ${fmt(est, 1)} dm`, unit: 'dm',
        hint: `Find the perfect squares on either side of ${n}.`,
        steps: [`√${Math.floor(Math.sqrt(n)) ** 2} = ${Math.floor(Math.sqrt(n))} and √${Math.ceil(Math.sqrt(n)) ** 2} = ${Math.ceil(Math.sqrt(n))}, so the side is between them`, `√${n} ≈ ${fmt(est, 1)} dm`],
      });
    },
  ],
  2: [
    () => {
      const s = randInt(8, 30), A = s * s;
      return P({
        q: `A square horse paddock has an area of ${A} m². How many metres of fencing are needed to go all the way around it?`,
        num: 4 * s, display: `${4 * s} m`, unit: 'm',
        hint: 'Find the side length first, then the perimeter.',
        steps: [`side = √${A} = ${s} m`, `perimeter = 4 × ${s} = ${4 * s} m`],
      });
    },
    () => {
      const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [9, 12, 15], [12, 16, 20]]), k = pick([4, 3]);
      const w = b * k, h = a * k, d = c * k;
      return P({
        q: `A TV screen is ${w} inches wide and ${h} inches tall. TVs are sold by their diagonal size. What size is this TV?`,
        num: d, display: `${d} inches`, unit: 'in',
        hint: 'The diagonal is the hypotenuse: d² = w² + h².',
        steps: [`d² = ${w}² + ${h}² = ${w * w} + ${h * h} = ${d * d}`, `d = √${d * d} = ${d} inches`],
      });
    },
    () => {
      const [a, b, c] = pick(triples), k = pick([2, 3, 4]);
      const run = a * k, rise = b * k, ramp = c * k;
      return P({
        q: `A guy wire runs from the top of a ${fmt(rise)} m radio mast to a stake in the ground ${fmt(run)} m from the base of the mast. How long is the wire?`,
        num: ramp, display: `${fmt(ramp)} m`, unit: 'm',
        hint: 'The wire is the hypotenuse of a right triangle.',
        steps: [`wire² = ${fmt(rise)}² + ${fmt(run)}² = ${fmt(rise * rise)} + ${fmt(run * run)} = ${fmt(ramp * ramp)}`, `wire = √${fmt(ramp * ramp)} = ${fmt(ramp)} m`],
      });
    },
  ],
  3: [
    () => {
      const [[a, b, c], k] = pick([[[7, 24, 25], 0.2], [[3, 4, 5], 1], [[5, 12, 13], 0.5], [[8, 15, 17], 0.5], [[3, 4, 5], 1.5]]);
      const base = round(a * k, 2), height = round(b * k, 2), lad = round(c * k, 2);
      const sill = round(height - randInt(3, 12) / 10, 1), above = round(height - sill, 2);
      return P({
        q: `A ${fmt(lad)} m ladder leans against a wall. Its foot is ${fmt(base)} m from the wall. A window sill is ${fmt(sill, 1)} m above the ground. How far above the sill does the top of the ladder reach?`,
        num: above, display: `${fmt(above)} m`, unit: 'm',
        hint: 'Use the Pythagorean theorem to find how high the ladder reaches, then compare with the sill.',
        steps: [
          `h² + ${fmt(base)}² = ${fmt(lad)}², so h² = ${fmt(lad * lad)} − ${fmt(base * base)} = ${fmt(round(height * height, 4), 4)}`,
          `h = √${fmt(round(height * height, 4), 4)} = ${fmt(height)} m`,
          `Above the sill: ${fmt(height)} − ${fmt(sill, 1)} = ${fmt(above)} m`,
        ],
      });
    },
    () => {
      const s1 = randInt(9, 16), s2 = randInt(4, s1 - 2), A1 = s1 * s1, A2 = s2 * s2, per = 4 * s1 + 2 * s2;
      return P({
        q: `A square patio (${A1} m²) and a smaller square garden (${A2} m²) sit side by side, sharing part of one edge, with their bottom edges lined up. What is the perimeter of the combined shape?`,
        num: per, display: `${per} m`, unit: 'm',
        hint: 'Find each side length. When the squares touch, the shared edge is no longer on the outside.',
        steps: [
          `Patio side = √${A1} = ${s1} m; garden side = √${A2} = ${s2} m`,
          `Separate perimeters: 4(${s1}) + 4(${s2}) = ${4 * s1 + 4 * s2} m`,
          `The shared ${s2} m edge is counted twice and is inside the shape: ${4 * s1 + 4 * s2} − 2(${s2}) = ${per} m`,
        ],
      });
    },
    () => {
      const [a, b, c] = pick([[5, 12, 13], [8, 15, 17], [20, 21, 29], [7, 24, 25]]), k = pick([10, 20]);
      const w = a * k, l = b * k, d = c * k, saved = w + l - d;
      return P({
        q: `A rectangular park is ${w} m wide and ${l} m long. Instead of walking along two sides to the opposite corner, you cut across the diagonal. How many metres do you save?`,
        num: saved, display: `${saved} m`, unit: 'm',
        hint: 'Find the walk along the sides, find the diagonal, then subtract.',
        steps: [`Along the sides: ${w} + ${l} = ${w + l} m`, `Diagonal: √(${w}² + ${l}²) = √${d * d} = ${d} m`, `Saved: ${w + l} − ${d} = ${saved} m`],
      });
    },
  ],
};

// ══════════ 3. POWERS & EXPONENTS ══════════
const powers = {
  1: [
    () => {
      const n = randInt(5, 12), v = 2 ** n;
      return P({
        q: `A single bacterium splits into 2 every hour. Write the number after ${n} hours as a power, then evaluate it.`,
        num: v, display: `2^${n} = ${v.toLocaleString()} bacteria`, unit: 'bacteria',
        hint: 'Each hour multiplies the count by 2.',
        steps: [`After ${n} hours: 2 × 2 × … (${n} times) = 2^${n} = ${v.toLocaleString()}`],
      });
    },
    () => {
      const s = randInt(3, 12), v = s ** 3;
      return P({
        q: `A cube-shaped storage box has edges ${s} dm long. What is its volume?`,
        num: v, display: `${s}³ = ${v} dm³`, unit: 'dm³',
        hint: 'Volume of a cube = edge³.',
        steps: [`V = ${s}³ = ${s} × ${s} × ${s} = ${v} dm³`],
      });
    },
    () => {
      const a = randInt(4, 9), b = randInt(2, 5);
      return P({
        q: `A science article says a cell is 10^${-a} m across, and a grain of sand is 10^${-a + b} m across. How many times wider is the grain of sand? (Hint: divide the powers.)`,
        num: 10 ** b, display: `10^${b} = ${(10 ** b).toLocaleString()} times`, unit: 'times',
        hint: 'When dividing powers with the same base, subtract the exponents.',
        steps: [`10^${-a + b} ÷ 10^${-a} = 10^(${-a + b} − (${-a})) = 10^${b} = ${(10 ** b).toLocaleString()}`],
      });
    },
  ],
  2: [
    () => {
      const P0 = pick([50, 100, 200, 250, 500]), h = pick([2, 3, 4]), k = randInt(3, 6), t = h * k, v = P0 * 2 ** k;
      return P({
        q: `A culture starts with ${P0} bacteria and doubles every ${h} hours. How many bacteria are there after ${t} hours?`,
        num: v, display: `${v.toLocaleString()} bacteria`, unit: 'bacteria',
        hint: 'How many doubling periods fit into the time? Then multiply by 2 that many times.',
        steps: [`Doublings: ${t} ÷ ${h} = ${k}`, `${P0} × 2^${k} = ${P0} × ${2 ** k} = ${v.toLocaleString()}`],
      });
    },
    () => {
      const a = pick([30, 32, 34, 36]), b = pick([18, 20, 22, 24]), d = a - b, v = 2 ** d;
      return P({
        q: `A USB drive holds 2^${a} bytes. Each photo uses 2^${b} bytes. How many photos fit on the drive? Give the answer as a power and as a number.`,
        num: v, display: `2^${d} = ${v.toLocaleString()} photos`, unit: 'photos',
        hint: 'Divide the drive size by the photo size. Same base → subtract exponents.',
        steps: [`2^${a} ÷ 2^${b} = 2^(${a} − ${b}) = 2^${d}`, `2^${d} = ${v.toLocaleString()}`],
      });
    },
    () => {
      const [b, m] = pick([[2, 3], [2, 4], [3, 2], [3, 3], [5, 2], [2, 5]]), e = 2 * m, v = b ** e;
      return P({
        q: `A square solar-panel field is ${b}^${m} m on each side. Write its area as a single power of ${b}, then evaluate it.`,
        num: v, display: `${b}^${e} = ${v.toLocaleString()} m²`, unit: 'm²',
        hint: 'Area of a square = side². A power of a power: multiply the exponents.',
        steps: [`Area = (${b}^${m})² = ${b}^(${m} × 2) = ${b}^${e}`, `${b}^${e} = ${v.toLocaleString()} m²`],
      });
    },
  ],
  3: [
    () => {
      const a = randInt(3, 5), b = randInt(1, a - 1), e = 3 * (a - b), v = 2 ** e;
      return P({
        q: `A large cube has edges 2^${a} cm long. Small cubes with edges 2^${b} cm are packed inside with no gaps. How many small cubes fit?`,
        num: v, display: `2^${e} = ${v.toLocaleString()} cubes`, unit: 'cubes',
        hint: 'Find how many small edges fit along one big edge, then cube that number.',
        steps: [`Along one edge: 2^${a} ÷ 2^${b} = 2^${a - b}`, `Cubes = (2^${a - b})³ = 2^(${a - b} × 3) = 2^${e}`, `2^${e} = ${v.toLocaleString()}`],
      });
    },
    () => {
      const halfs = randInt(3, 6), start = 25 * 2 ** halfs * pick([1, 2, 4]), hl = pick([2, 3, 5, 8]), t = hl * halfs;
      const left = start / 2 ** halfs, decayed = start - left;
      return P({
        q: `A medical tracer has a half-life of ${hl} days. A hospital receives ${start.toLocaleString()} mg. How many milligrams have decayed after ${t} days?`,
        num: decayed, display: `${decayed.toLocaleString()} mg`, unit: 'mg',
        hint: 'Count half-lives, find what is left using (1/2)^n, then subtract from the start.',
        steps: [`Half-lives: ${t} ÷ ${hl} = ${halfs}`, `Left = ${start.toLocaleString()} × (1/2)^${halfs} = ${start.toLocaleString()} ÷ ${2 ** halfs} = ${left.toLocaleString()} mg`, `Decayed = ${start.toLocaleString()} − ${left.toLocaleString()} = ${decayed.toLocaleString()} mg`],
      });
    },
    () => {
      const r = randInt(4, 7), total = (3 ** (r + 1) - 3) / 2;
      return P({
        q: `A chain message starts when you send it to 3 friends (round 1). In each round, every new person sends it to 3 new people. How many people in total have received it after ${r} rounds?`,
        num: total, display: `${total.toLocaleString()} people`, unit: 'people',
        hint: 'Round n reaches 3^n people. Add up the rounds.',
        steps: [`Round 1 = 3¹, round 2 = 3², …, round ${r} = 3^${r}`, `Values: ${Array.from({ length: r }, (_, i) => 3 ** (i + 1)).join(' + ')}`, `Total = ${total.toLocaleString()} people`],
      });
    },
  ],
};
// ══════════ 4. LINEAR RELATIONS ══════════
const linRel = {
  1: [
    () => {
      const base = pick([15, 20, 25, 30]), rate = pick([0.05, 0.1, 0.15, 0.25]), n = randInt(4, 30) * 10, C = round(base + rate * n, 2);
      return P({
        q: `A phone plan costs C = ${base} + ${rate}n dollars, where n is the number of minutes over the limit. What is the bill if you go ${n} minutes over?`,
        num: C, display: money(C), unit: '$',
        hint: 'Substitute n into the equation.',
        steps: [`C = ${base} + ${rate}(${n}) = ${base} + ${fmt(rate * n)} = ${money(C)}`],
      });
    },
    () => {
      const h = randInt(18, 30), r = pick([1.5, 2, 2.5, 1.2]), t = randInt(2, Math.floor(h / r) - 1), left = round(h - r * t, 1);
      return P({
        q: `A candle is ${h} cm tall and burns down ${fmt(r, 1)} cm every hour. The relation is h = ${h} − ${fmt(r, 1)}t. How tall is it after ${t} hours?`,
        num: left, display: `${fmt(left, 1)} cm`, unit: 'cm',
        hint: 'Substitute t into the equation.',
        steps: [`h = ${h} − ${fmt(r, 1)}(${t}) = ${h} − ${fmt(r * t, 1)} = ${fmt(left, 1)} cm`],
      });
    },
    () => {
      const fee = pick([3.5, 4, 4.25, 3.75]), perKm = pick([1.5, 2, 2.25, 1.75]);
      return P({
        q: `A taxi charges a flat fee of ${money(fee)} plus ${money(perKm)} per kilometre. In the equation C = ${perKm}d + ${fee}, what does the slope represent? Type the slope's value.`,
        num: perKm, display: `${money(perKm)} per km (the rate of change)`, unit: '$/km',
        hint: 'The slope is the number multiplied by the variable.',
        steps: [`In C = ${perKm}d + ${fee}, the slope is ${perKm}: the cost goes up ${money(perKm)} for each extra km. The ${money(fee)} is the starting value (y-intercept).`],
      });
    },
  ],
  2: [
    () => {
      const rate = pick([45, 55, 60, 75, 85]), call = pick([40, 50, 60, 80]), h1 = randInt(1, 3), h2 = h1 + randInt(2, 4);
      const c1 = call + rate * h1, c2 = call + rate * h2;
      return P({
        q: `A plumber charges ${money(c1)} for a ${h1}-hour job and ${money(c2)} for a ${h2}-hour job. The cost is a linear relation. What is the hourly rate (the slope)?`,
        num: rate, display: `${money(rate)} per hour`, unit: '$/h',
        hint: 'Slope = change in cost ÷ change in hours.',
        steps: [`Change in cost = ${c2} − ${c1} = ${c2 - c1}`, `Change in hours = ${h2} − ${h1} = ${h2 - h1}`, `Slope = ${c2 - c1} ÷ ${h2 - h1} = ${money(rate)}/h`].slice(0, 3),
      });
    },
    () => {
      const base = pick([12, 15, 18, 20]), rate = pick([2.5, 3, 3.5, 4]), n = randInt(5, 20), B = round(base + rate * n, 2);
      return P({
        q: `Bowling costs C = ${rate}g + ${base}, where g is the number of games and ${money(base)} is shoe rental and entry. You spent ${money(B)}. How many games did you play?`,
        num: n, display: `${n} games`, unit: 'games',
        hint: 'Substitute C, then undo the steps: subtract, then divide.',
        steps: [`${B} = ${rate}g + ${base} → ${rate}g = ${fmt(B - base)}`, `g = ${fmt(B - base)} ÷ ${rate} = ${n}`],
      });
    },
    () => {
      const m = pick([3, 4, 5, 6]), b = pick([10, 12, 20, 25]), x = randInt(8, 15);
      const pts = [0, 2, 4].map(t => [t, b + m * t]);
      return P({
        q: `A table of values shows a plant's height (cm) over time (weeks): ${pts.map(([t, h]) => `week ${t}: ${h} cm`).join(', ')}. If the pattern continues, how tall will it be in week ${x}?`,
        num: b + m * x, display: `${b + m * x} cm`, unit: 'cm',
        hint: 'Find how much it grows each week, then use h = (growth per week)t + (starting height).',
        steps: [`Growth per week = (${pts[1][1]} − ${pts[0][1]}) ÷ 2 = ${m} cm`, `h = ${m}(${x}) + ${b} = ${b + m * x} cm`],
      });
    },
  ],
  3: [
    () => {
      const rate = pick([45, 55, 60, 75, 85]), call = pick([40, 50, 60, 80]), h1 = randInt(1, 3), h2 = h1 + randInt(2, 4), h3 = h2 + randInt(2, 4);
      const c1 = call + rate * h1, c2 = call + rate * h2, c3 = call + rate * h3;
      return P({
        q: `An electrician charges ${money(c1)} for ${h1} hours and ${money(c2)} for ${h2} hours. The cost is linear. How much will a ${h3}-hour job cost?`,
        num: c3, display: money(c3), unit: '$',
        hint: 'Find the slope (rate), then the starting fee, then write the equation and substitute.',
        steps: [
          `Slope = (${c2} − ${c1}) ÷ (${h2} − ${h1}) = ${rate} per hour`,
          `Call-out fee: ${c1} − ${rate}(${h1}) = ${call}, so C = ${rate}h + ${call}`,
          `C = ${rate}(${h3}) + ${call} = ${money(c3)}`,
        ],
      });
    },
    () => {
      const r = pick([20, 25, 30, 40]), T = randInt(12, 25), H = r * T, t1 = randInt(3, 6), h1 = H - r * t1;
      return P({
        q: `A hot-air balloon starts at ${H} m and descends at a constant rate. After ${t1} minutes it is at ${h1} m. How many minutes after it started will it land?`,
        num: T, display: `${T} minutes`, unit: 'min',
        hint: 'Find the descent per minute, write the equation, then find when height = 0.',
        steps: [`Drop in ${t1} min: ${H} − ${h1} = ${H - h1} m`, `Rate = ${H - h1} ÷ ${t1} = ${r} m/min, so h = ${H} − ${r}t`, `0 = ${H} − ${r}t → t = ${H} ÷ ${r} = ${T} min`],
      });
    },
    () => {
      const x1 = randInt(1, 4), m = pick([-3, -2, 2, 3, 4, 5]), b = randInt(-6, 10), x2 = x1 + randInt(2, 5), y1 = m * x1 + b, y2 = m * x2 + b;
      return P({
        q: `A line on a graph of a linear relation passes through (${x1}, ${y1}) and (${x2}, ${y2}). Where does it cross the y-axis? (Give the y-intercept.)`,
        num: b, display: `${b}`, unit: '',
        hint: 'Find the slope, then use y = mx + b with one point to solve for b.',
        steps: [`m = (${y2} − ${paren(y1)}) ÷ (${x2} − ${x1}) = ${y2 - y1} ÷ ${x2 - x1} = ${m}`, `${y1} = ${m}(${x1}) + b`, `b = ${y1} − ${paren(m * x1)} = ${b}`],
      });
    },
  ],
};

// ══════════ 5. LINEAR EQUATIONS & INEQUALITIES ══════════
const linEq = {
  1: [
    () => {
      const n = randInt(3, 9), price = pick([6.5, 8.25, 12, 14.75, 9.5]), T = round(n * price, 2), who = pick(NAMES);
      return P({
        q: `${who} bought ${n} identical graphic novels for a total of ${money(T)}. Solve ${n}p = ${T} to find the price of one.`,
        num: price, display: money(price), unit: '$',
        hint: 'Divide both sides by the number of books.',
        steps: [`p = ${T} ÷ ${n} = ${money(price)}`],
      });
    },
    () => {
      const spent = randInt(15, 80), left = randInt(5, 60), who = pick(NAMES);
      return P({
        q: `After spending $${spent} at the mall, ${who} has $${left} left. Solve m − ${spent} = ${left} to find how much money ${who} started with.`,
        num: spent + left, display: `$${spent + left}`, unit: '$',
        hint: 'Add the amount spent to both sides.',
        steps: [`m = ${left} + ${spent} = $${spent + left}`],
      });
    },
    () => {
      const max = randInt(6, 14), per = pick([4, 5, 6, 8]), B = max * per + randInt(0, per - 1);
      return P({
        q: `Each pack of hockey cards costs $${per}. You have $${B}. Solve ${per}n ≤ ${B} to find the greatest number of packs you can buy.`,
        num: max, display: `${max} packs`, unit: 'packs',
        hint: 'Divide, then round down: you cannot buy part of a pack.',
        steps: [`n ≤ ${B} ÷ ${per} = ${fmt(B / per, 2)}, so the most is ${max} packs`],
      });
    },
  ],
  2: [
    () => {
      const p = pick([18, 22, 25, 35, 42]), f = pick([4.5, 6, 7.5, 9]), n = randInt(2, 8), T = round(p * n + f, 2);
      return P({
        q: `Concert tickets cost $${p} each, plus a one-time booking fee of ${money(f)}. Your total was ${money(T)}. How many tickets did you buy?`,
        num: n, display: `${n} tickets`, unit: 'tickets',
        hint: `Write ${p}t + ${f} = ${T}. Subtract the fee, then divide.`,
        steps: [`${p}t + ${f} = ${T}`, `${p}t = ${fmt(T - f)}`, `t = ${fmt(T - f)} ÷ ${p} = ${n}`].slice(0, 3),
      });
    },
    () => {
      const f = pick([10, 12, 15]), r = pick([3, 4, 5]), B = randInt(30, 60), max = Math.floor((B - f) / r);
      if ((B - f) % r === 0) throw 0;
      return P({
        q: `A fair charges $${f} to get in and $${r} per ride. You have $${B}. What is the greatest number of rides you can go on?`,
        num: max, display: `${max} rides`, unit: 'rides',
        hint: `Solve ${f} + ${r}x ≤ ${B}. Round down at the end.`,
        steps: [`${f} + ${r}x ≤ ${B} → ${r}x ≤ ${B - f}`, `x ≤ ${fmt((B - f) / r, 2)}, so the most is ${max} rides`],
      });
    },
    () => {
      const x = randInt(2, 9), a = randInt(2, 5), b = randInt(1, 12), c = a * (x + b);
      return P({
        q: `${pick(NAMES)} thinks of a number, adds ${b}, then multiplies the result by ${a}. The answer is ${c}. Solve ${a}(n + ${b}) = ${c} to find the number.`,
        num: x, display: `${x}`, unit: '',
        hint: 'Undo in reverse order: divide first, then subtract.',
        steps: [`n + ${b} = ${c} ÷ ${a} = ${c / a}`, `n = ${c / a} − ${b} = ${x}`],
      });
    },
  ],
  3: [
    () => {
      for (;;) {
        const r1 = randInt(25, 45), r2 = r1 - randInt(5, 15), m = randInt(4, 14), a = randInt(0, 50), b = a + (r1 - r2) * m;
        if (b > 200) continue;
        return P({
          q: `Gym A charges $${a} to join plus $${r1} per month. Gym B charges $${b} to join plus $${r2} per month. After how many months will the total cost be the same?`,
          num: m, display: `${m} months`, unit: 'months',
          hint: `Set ${a} + ${r1}m = ${b} + ${r2}m. Collect the m-terms on one side.`,
          steps: [`${a} + ${r1}m = ${b} + ${r2}m`, `${r1}m − ${r2}m = ${b} − ${a} → ${r1 - r2}m = ${b - a}`, `m = ${b - a} ÷ ${r1 - r2} = ${m}`],
        });
      }
    },
    () => {
      const w = randInt(3, 14), k = randInt(1, 6), L = 2 * w + k, Per = 2 * (L + w), A = L * w;
      return P({
        q: `A rectangular dog run is ${k} m longer than twice its width. Its perimeter is ${Per} m. What is its area?`,
        num: A, display: `${A} m²`, unit: 'm²',
        hint: `Let width = w, so length = 2w + ${k}. Use P = 2(l + w) to find w, then find the area.`,
        steps: [`2(w + 2w + ${k}) = ${Per} → 6w + ${2 * k} = ${Per}`, `6w = ${Per - 2 * k} → w = ${w} m, length = 2(${w}) + ${k} = ${L} m`, `Area = ${L} × ${w} = ${A} m²`],
      });
    },
    () => {
      for (;;) {
        const booth = pick([60, 75, 90, 120]), price = pick([6, 7, 8, 9]), cost = pick([2, 2.5, 3, 3.5]), goal = pick([100, 150, 200]);
        const prof = price - cost, need = (booth + goal) / prof, n = Math.ceil(need - 1e-9);
        if (Number.isInteger(need)) continue;
        return P({
          q: `A farmer pays $${booth} for a market booth. Each bag of vegetables sells for $${price} and costs ${money(cost)} to grow. What is the fewest bags she must sell to make a profit of at least $${goal}?`,
          num: n, display: `${n} bags`, unit: 'bags',
          hint: 'Profit per bag = price − cost. Then profit per bag × bags − booth ≥ goal. Round up.',
          steps: [`Profit per bag = ${price} − ${cost} = ${fmt(prof)}`, `${fmt(prof)}b − ${booth} ≥ ${goal} → ${fmt(prof)}b ≥ ${booth + goal}`, `b ≥ ${fmt(need, 2)}, so round up: ${n} bags`],
        });
      }
    },
  ],
};

// ══════════ 6. POLYNOMIALS ══════════
const coef = () => randInt(1, 6);
const konst = () => randInt(-6, 9) || 3;
const polynomials = {
  1: [
    () => {
      const s = [[coef(), konst()], [coef(), konst()], [coef(), konst()]];
      const p = { 1: s[0][0] + s[1][0] + s[2][0], 0: s[0][1] + s[1][1] + s[2][1] };
      return P({
        q: `A triangular garden has sides ${s.map(([a, b]) => binom(a, b)).join(', ')} metres. Write a simplified expression for its perimeter.`,
        poly: p, display: polyStr(p), unit: 'm',
        hint: 'Add like terms: x-terms together, numbers together.',
        steps: [`x-terms: ${s.map(t => t[0] + 'x').join(' + ')} = ${p[1]}x`, `Constants: ${s.map(t => paren(t[1])).join(' + ')} = ${p[0]}`, `Perimeter = ${polyStr(p)}`],
      });
    },
    () => {
      const a = randInt(5, 9), b = randInt(10, 40), c = randInt(1, a - 1), d = randInt(2, 15), who = pick(NAMES);
      const p = { 1: a - c, 0: b - d };
      return P({
        q: `${who} earns ${polyStr({ 1: a, 0: b })} dollars mowing lawns, where x is hours worked, and spends ${polyStr({ 1: c, 0: d })} dollars on gas. Write a simplified expression for what ${who} keeps.`,
        poly: p, display: polyStr(p), unit: '$',
        hint: 'Subtract the whole second polynomial: change the sign of every term in it.',
        steps: [`(${polyStr({ 1: a, 0: b })}) − (${polyStr({ 1: c, 0: d })}) = ${a}x + ${b} − ${c}x − ${d}`, `= ${polyStr(p)}`],
      });
    },
    () => {
      const a = randInt(2, 6), b = randInt(1, 9), c = randInt(2, 6);
      const p = { 1: a * c, 0: b * c };
      return P({
        q: `A row of ${c} identical lockers is built. Each locker is ${binom(a, b)} cm wide. Write a simplified expression for the total width.`,
        poly: p, display: `${polyStr(p)} cm`, unit: 'cm',
        hint: 'Multiply the monomial by each term in the brackets.',
        steps: [`${c}${binom(a, b)} = ${c}(${a}x) + ${c}(${b}) = ${polyStr(p)}`],
      });
    },
  ],
  2: [
    () => {
      const a = randInt(1, 8), b = randInt(1, 8);
      const p = { 2: 1, 1: a + b, 0: a * b };
      return P({
        q: `A rectangular deck is (x + ${a}) m long and (x + ${b}) m wide. Write a simplified expression for its area.`,
        poly: p, display: `${polyStr(p)} m²`, unit: 'm²',
        hint: 'Multiply each term in the first binomial by each term in the second, then collect like terms.',
        steps: [`(x + ${a})(x + ${b}) = x² + ${b}x + ${a}x + ${a * b}`, `= ${polyStr(p)}`],
      });
    },
    () => {
      const a = randInt(2, 5), b = randInt(1, 9), c = randInt(1, 4), d = randInt(-4, 6) || 2;
      const p = { 1: 2 * (a + c), 0: 2 * (b + d) };
      return P({
        q: `A rectangular hockey poster is ${binom(a, b)} cm long and ${binom(c, d)} cm wide. Write a simplified expression for its perimeter.`,
        poly: p, display: `${polyStr(p)} cm`, unit: 'cm',
        hint: 'Perimeter = 2(length + width). Add first, then multiply by 2.',
        steps: [`length + width = ${polyStr({ 1: a + c, 0: b + d })}`, `2(${polyStr({ 1: a + c, 0: b + d })}) = ${polyStr(p)}`],
      });
    },
    () => {
      const a = randInt(2, 4), b = randInt(1, 6), c = randInt(2, 5);
      const p = { 2: a * c, 1: b * c };
      return P({
        q: `A rectangular flower bed is ${c}x m wide and ${binom(a, b)} m long. Write a simplified expression for its area.`,
        poly: p, display: `${polyStr(p)} m²`, unit: 'm²',
        hint: 'Multiply the monomial by each term of the binomial. x · x = x².',
        steps: [`${c}x${binom(a, b)} = ${c}x(${a}x) + ${c}x(${b})`, `= ${polyStr(p)}`],
      });
    },
  ],
  3: [
    () => {
      const a = randInt(2, 8), b = randInt(1, 6);
      const p = { 1: a + b, 0: a * b };
      return P({
        q: `A square shed of side x m sits on a rectangular lot that is (x + ${a}) m by (x + ${b}) m. Write a simplified expression for the area of the lot NOT covered by the shed.`,
        poly: p, display: `${polyStr(p)} m²`, unit: 'm²',
        hint: 'Expand the lot area, subtract the shed area x², then simplify.',
        steps: [`Lot: (x + ${a})(x + ${b}) = x² + ${a + b}x + ${a * b}`, `Shed: x · x = x²`, `Uncovered: x² + ${a + b}x + ${a * b} − x² = ${polyStr(p)}`],
      });
    },
    () => {
      const k = randInt(2, 3), a = randInt(1, 6), b = randInt(1, 5), x = randInt(2, 8);
      const p = { 2: k - 1, 1: k * b + a, 0: a * b }, val = p[2] * x * x + p[1] * x + p[0];
      return P({
        q: `A rectangle measures ${binom(k, a)} cm by (x + ${b}) cm. A square with side x cm is cut out of it. If x = ${x}, what area is left?`,
        num: val, display: `${val} cm²`, unit: 'cm²',
        hint: 'Expand, subtract x², simplify, then substitute x.',
        steps: [`${binom(k, a)}(x + ${b}) = ${polyStr({ 2: k, 1: k * b + a, 0: a * b })}`, `Subtract x²: ${polyStr(p)}`, `x = ${x}: ${p[2]}(${x * x}) + ${p[1]}(${x}) + ${p[0]} = ${val} cm²`],
      });
    },
    () => {
      const a = randInt(2, 6), b = randInt(1, 4);
      const outer = { 2: 1, 1: 2 * a + 2 * b, 0: (2 * a) * (2 * b) };
      const p = { 1: 2 * a + 2 * b, 0: 4 * a * b };
      // photo x by x... frame adds a on left/right and b on top/bottom: outer (x+2a)(x+2b)
      return P({
        q: `A square photo is x cm on each side. A frame adds ${a} cm on the left and right and ${b} cm on the top and bottom. Write a simplified expression for the area of the frame only.`,
        poly: p, display: `${polyStr(p)} cm²`, unit: 'cm²',
        hint: 'Outer size is (x + 2·left) by (x + 2·top). Frame area = outer area − photo area.',
        steps: [`Outer: (x + ${2 * a})(x + ${2 * b}) = ${polyStr(outer)}`, `Photo: x²`, `Frame = ${polyStr(outer)} − x² = ${polyStr(p)}`],
      });
    },
  ],
};

// ══════════ 7. CIRCLE GEOMETRY ══════════
const chordSets = [[5, 3, 4], [13, 5, 12], [10, 6, 8], [17, 8, 15], [25, 7, 24], [15, 9, 12], [26, 10, 24]]; // r, d, half-chord
const circleGeo = {
  1: [
    () => {
      const c = 2 * randInt(20, 85);
      return P({
        q: `A camera at the centre of a circular arena sees an arc of the wall with a central angle of ${c}°. A second camera on the wall (on the circle) sees exactly the same arc. What angle does the second camera see?`,
        num: c / 2, display: `${c / 2}°`, unit: '°',
        hint: 'An inscribed angle is half the central angle on the same arc.',
        steps: [`Inscribed angle = ½ × ${c}° = ${c / 2}°`],
      });
    },
    () => {
      const a = randInt(20, 70);
      return P({
        q: `A triangle is drawn inside a circle so that one side is a diameter. One of the other angles is ${a}°. What is the third angle? (The angle opposite the diameter is a special angle.)`,
        num: 90 - a, display: `${90 - a}°`, unit: '°',
        hint: 'An angle inscribed in a semicircle is 90°. Angles in a triangle add to 180°.',
        steps: [`The angle opposite the diameter is 90°, so the third angle = 180° − 90° − ${a}° = ${90 - a}°`],
      });
    },
    () => {
      const a = randInt(25, 75);
      return P({
        q: `Two inscribed angles in a circular stained-glass window stand on the same arc. One measures ${a}°. What does the other measure?`,
        num: a, display: `${a}°`, unit: '°',
        hint: 'Inscribed angles on the same arc are equal.',
        steps: [`Inscribed angles on the same arc are equal, so the other angle = ${a}°`],
      });
    },
  ],
  2: [
    () => {
      const [r, d, h] = pick(chordSets);
      return P({
        q: `A circular table has a radius of ${r} dm. A straight crack (a chord) is ${d} dm from the centre. How long is the crack?`,
        num: 2 * h, display: `${2 * h} dm`, unit: 'dm',
        hint: 'The perpendicular from the centre bisects the chord. Use Pythagoras with the radius as the hypotenuse.',
        steps: [`Half-chord² = ${r}² − ${d}² = ${r * r} − ${d * d} = ${h * h} → half = ${h} dm`, `Chord = 2 × ${h} = ${2 * h} dm`],
      });
    },
    () => {
      const [r, t, d] = pick([[5, 12, 13], [3, 4, 5], [8, 15, 17], [7, 24, 25], [6, 8, 10], [20, 21, 29]]);
      return P({
        q: `A bike chain runs straight from point P to touch a circular gear of radius ${r} cm (it is tangent to the gear). P is ${d} cm from the centre of the gear. How long is the straight piece of chain?`,
        num: t, display: `${t} cm`, unit: 'cm',
        hint: 'A tangent meets the radius at 90°. The line from P to the centre is the hypotenuse.',
        steps: [`tangent² = ${d}² − ${r}² = ${d * d} − ${r * r} = ${t * t}`, `tangent = √${t * t} = ${t} cm`],
      });
    },
    () => {
      const x = randInt(25, 70), c = 2 * x;
      return P({
        q: `Points A, B, C lie on a circle with centre O. Inscribed angle ACB = ${x}°. Triangle AOB is formed by joining A and B to the centre. What is angle OAB?`,
        num: (180 - c) / 2, display: `${(180 - c) / 2}°`, unit: '°',
        hint: 'Find the central angle AOB first. Triangle AOB is isosceles because OA and OB are radii.',
        steps: [`Central angle AOB = 2 × ${x}° = ${c}°`, `OA = OB, so the base angles are equal: (180° − ${c}°) ÷ 2 = ${(180 - c) / 2}°`],
      });
    },
  ],
  3: [
    () => {
      const [r, d, h] = pick(chordSets);
      return P({
        q: `A tunnel has a circular cross-section with radius ${r} dm. The flat floor is a chord ${2 * h} dm wide, below the centre. How high is the tunnel from the floor to the very top?`,
        num: r + d, display: `${r + d} dm`, unit: 'dm',
        hint: 'Halve the floor width. Find the distance from the centre to the floor, then add the radius above the centre.',
        steps: [`Half the floor = ${2 * h} ÷ 2 = ${h} dm`, `Centre to floor: √(${r}² − ${h}²) = √${d * d} = ${d} dm`, `Height = ${d} + ${r} = ${r + d} dm`],
      });
    },
    () => {
      const a = 2 * randInt(15, 55), aob = 180 - a, acb = aob / 2;
      return P({
        q: `Two tangents from an external point P touch a circle (centre O) at A and B. Angle APB = ${a}°. Point C is on the major arc. Find inscribed angle ACB.`,
        num: acb, display: `${acb}°`, unit: '°',
        hint: 'Tangent ⟂ radius gives two 90° angles in quadrilateral PAOB. Then use the inscribed-angle property.',
        steps: [`∠OAP = ∠OBP = 90° (tangent ⟂ radius)`, `∠AOB = 360° − 90° − 90° − ${a}° = ${aob}°`, `∠ACB = ½ × ${aob}° = ${acb}°`],
      });
    },
    () => {
      const [r, t, d] = pick([[5, 12, 13], [3, 4, 5], [8, 15, 17], [6, 8, 10], [9, 12, 15]]);
      const per = 2 * t + 2 * r;
      return P({
        q: `From a point P, ${d} cm from the centre O of a circle with radius ${r} cm, two tangents touch the circle at A and B. What is the perimeter of the kite PAOB?`,
        num: per, display: `${per} cm`, unit: 'cm',
        hint: 'The kite has two radii and two tangent segments. Tangent segments from the same point are equal.',
        steps: [`PA = √(${d}² − ${r}²) = √${t * t} = ${t} cm`, `PB = PA = ${t} cm; OA = OB = ${r} cm`, `Perimeter = 2(${t}) + 2(${r}) = ${per} cm`],
      });
    },
  ],
};

// ══════════ 8. SURFACE AREA & VOLUME ══════════
const measurement = {
  1: [
    () => {
      const r = randInt(2, 9), h = randInt(5, 20), V = round(PI * r * r * h, 1);
      return P({
        q: `A cylindrical water tank has a radius of ${r} m and a height of ${h} m. What is its volume? Round to one decimal place.`,
        num: V, tol: piTol(V), display: `${fmt(V, 1)} m³`, unit: 'm³',
        hint: 'V = πr²h',
        steps: [`V = π(${r})²(${h}) = π × ${r * r * h} ≈ ${fmt(V, 1)} m³`],
      });
    },
    () => {
      const r = randInt(2, 5), h = randInt(8, 14), V = round(PI * r * r * h / 3, 1);
      return P({
        q: `A paper cone for a snow-cone treat has a radius of ${r} cm and a height of ${h} cm. How much can it hold? Round to one decimal.`,
        num: V, tol: piTol(V), display: `${fmt(V, 1)} cm³`, unit: 'cm³',
        hint: 'V = ⅓πr²h',
        steps: [`V = ⅓π(${r})²(${h}) = ⅓π(${r * r * h}) ≈ ${fmt(V, 1)} cm³`],
      });
    },
    () => {
      const r = randInt(2, 12), SA = round(4 * PI * r * r, 1);
      return P({
        q: `A spherical exercise ball has a radius of ${r} dm. What is its surface area? Round to one decimal.`,
        num: SA, tol: piTol(SA), display: `${fmt(SA, 1)} dm²`, unit: 'dm²',
        hint: 'SA of a sphere = 4πr²',
        steps: [`SA = 4π(${r})² = ${4 * r * r}π ≈ ${fmt(SA, 1)} dm²`],
      });
    },
  ],
  2: [
    () => {
      const d = 2 * randInt(3, 15), r = d / 2, V = round(4 / 3 * PI * r ** 3, 1);
      return P({
        q: `A basketball has a diameter of ${d} cm. What is its volume? Round to one decimal.`,
        num: V, tol: piTol(V), display: `${fmt(V, 1)} cm³`, unit: 'cm³',
        hint: 'Find the radius first, then V = (4/3)πr³.',
        steps: [`r = ${d} ÷ 2 = ${r} cm`, `V = (4/3)π(${r})³ = (4/3)π(${r ** 3}) ≈ ${fmt(V, 1)} cm³`],
      });
    },
    () => {
      const d = randInt(6, 12), h = randInt(9, 16), r = d / 2, A = round(2 * PI * r * h, 1);
      return P({
        q: `A soup can has a diameter of ${d} cm and a height of ${h} cm. The label wraps around the side (not the top or bottom). What is the area of the label? Round to one decimal.`,
        num: A, tol: piTol(A), display: `${fmt(A, 1)} cm²`, unit: 'cm²',
        hint: 'Lateral area = 2πrh. Start by finding the radius.',
        steps: [`r = ${d} ÷ 2 = ${fmt(r, 1)} cm`, `A = 2π(${fmt(r, 1)})(${h}) ≈ ${fmt(A, 1)} cm²`],
      });
    },
    () => {
      const s = randInt(4, 12), h = randInt(5, 15), sl = randInt(Math.ceil(s / 2) + 1, s + 6), SA = s * s + 4 * (s * sl / 2);
      return P({
        q: `A square-based pyramid tent has a base ${s} m by ${s} m. Each triangular face has a slant height of ${sl} m. How much fabric covers the tent, including the floor?`,
        num: SA, display: `${SA} m²`, unit: 'm²',
        hint: 'SA = base area + 4 triangles (½ × base × slant height).',
        steps: [`Base = ${s} × ${s} = ${s * s} m²`, `4 triangles = 4 × ½ × ${s} × ${sl} = ${2 * s * sl} m²`, `SA = ${s * s} + ${2 * s * sl} = ${SA} m²`].slice(0, 3),
      });
    },
  ],
  3: [
    () => {
      const s = randInt(6, 12), h = randInt(15, 30), p = 3 * randInt(1, 4), V = s * s * h + s * s * p / 3;
      return P({
        q: `A model grain elevator is a rectangular prism ${s} m by ${s} m by ${h} m tall, with a square-based pyramid roof ${p} m tall on top. What is the total volume?`,
        num: V, display: `${V} m³`, unit: 'm³',
        hint: 'Find the prism volume, find the pyramid volume (⅓ × base area × height), then add.',
        steps: [`Prism = ${s} × ${s} × ${h} = ${s * s * h} m³`, `Pyramid = ⅓ × ${s * s} × ${p} = ${s * s * p / 3} m³`, `Total = ${s * s * h} + ${s * s * p / 3} = ${V} m³`],
      });
    },
    () => {
      const r = randInt(2, 5), h = randInt(8, 20), Vc = PI * r * r * h, Vh = 2 / 3 * PI * r ** 3, V = round(Vc + Vh, 1);
      return P({
        q: `A farm silo is a cylinder with radius ${r} m and height ${h} m, topped by a hemisphere (half sphere) roof. What is its total volume? Round to one decimal.`,
        num: V, tol: piTol(V), display: `${fmt(V, 1)} m³`, unit: 'm³',
        hint: 'Cylinder: πr²h. Hemisphere: half of (4/3)πr³. Add them.',
        steps: [`Cylinder = π(${r})²(${h}) ≈ ${fmt(Vc, 1)} m³`, `Hemisphere = ½ × (4/3)π(${r})³ ≈ ${fmt(Vh, 1)} m³`, `Total ≈ ${fmt(Vc, 1)} + ${fmt(Vh, 1)} = ${fmt(V, 1)} m³`],
      });
    },
    () => {
      const r = pick([0.5, 1, 1.5, 2]), h = pick([1, 1.5, 2, 2.5]), rate = pick([100, 150, 200, 250]);
      const V = PI * r * r * h, L = V * 1000, t = round(L / rate, 1);
      return P({
        q: `A cylindrical rain barrel tank has a radius of ${fmt(r, 1)} m and a height of ${fmt(h, 1)} m. A hose fills it at ${rate} L per minute. How many minutes will it take to fill? (1 m³ = 1000 L) Round to one decimal.`,
        num: t, tol: piTol(t), display: `${fmt(t, 1)} minutes`, unit: 'min',
        hint: 'Volume in m³ → convert to litres → divide by the fill rate.',
        steps: [`V = π(${fmt(r, 1)})²(${fmt(h, 1)}) ≈ ${fmt(V, 3)} m³`, `${fmt(V, 3)} m³ × 1000 ≈ ${fmt(L, 0)} L`, `Time = ${fmt(L, 0)} ÷ ${rate} ≈ ${fmt(t, 1)} min`],
      });
    },
  ],
};

// ══════════ 9. SIMILARITY & SCALE ══════════
const similarity = {
  1: [
    () => {
      const k = pick([5, 10, 20, 25, 50]), d = round(randInt(15, 120) / 10, 1);
      return P({
        q: `On a map of Alberta, 1 cm represents ${k} km. Two towns are ${fmt(d, 1)} cm apart on the map. How far apart are they in real life?`,
        num: round(d * k, 1), display: `${fmt(d * k, 1)} km`, unit: 'km',
        hint: 'Multiply the map distance by the scale.',
        steps: [`${fmt(d, 1)} × ${k} = ${fmt(d * k, 1)} km`],
      });
    },
    () => {
      const k = pick([1.5, 2, 2.5, 3, 4]), w = randInt(4, 15);
      return P({
        q: `A ${w} cm wide photo is enlarged by a scale factor of ${k}. How wide is the enlargement?`,
        num: round(w * k, 1), display: `${fmt(w * k, 1)} cm`, unit: 'cm',
        hint: 'New length = scale factor × original length.',
        steps: [`${k} × ${w} = ${fmt(w * k, 1)} cm`],
      });
    },
    () => {
      const real = randInt(3, 12) * 10, model = real / pick([10, 20, 5]);
      const sf = round(model / real, 3);
      return P({
        q: `A real canoe is ${real} dm long. A model of it is ${model} dm long. What is the scale factor from the real canoe to the model? (Give it as a decimal or fraction.)`,
        num: sf, display: `${frac(model, real)} (${fmt(sf, 3)})`, unit: '',
        hint: 'Scale factor = model length ÷ real length.',
        steps: [`${model} ÷ ${real} = ${frac(model, real)} = ${fmt(sf, 3)}`],
      });
    },
  ],
  2: [
    () => {
      const [h, s] = pick([[1, 1.25], [1.6, 2], [1.5, 2.5], [1.8, 1.2], [2, 3]]), k = randInt(4, 12), S = round(s * k, 2), H = round(h * k, 2);
      return P({
        q: `A ${fmt(h)} m tall student casts a ${fmt(s)} m shadow. At the same time, a flagpole casts a ${fmt(S)} m shadow. How tall is the flagpole?`,
        num: H, display: `${fmt(H)} m`, unit: 'm',
        hint: 'Similar triangles: height ÷ shadow is the same for both.',
        steps: [`Scale factor = ${fmt(S)} ÷ ${fmt(s)} = ${k}`, `Flagpole = ${fmt(h)} × ${k} = ${fmt(H)} m`],
      });
    },
    () => {
      const [a, b, c] = pick([[6, 8, 10], [5, 12, 13], [9, 12, 15], [4, 6, 7], [3, 5, 7]]), k = pick([1.5, 2.5, 3, 4]);
      const C = c * k;
      return P({
        q: `A triangle has sides ${a} cm, ${b} cm, and ${c} cm. A similar triangle has a longest side of ${fmt(C)} cm. How long is its shortest side?`,
        num: round(a * k, 2), display: `${fmt(a * k)} cm`, unit: 'cm',
        hint: 'Find the scale factor using the longest sides, then apply it to the shortest side.',
        steps: [`Scale factor = ${fmt(C)} ÷ ${c} = ${k}`, `Shortest = ${a} × ${k} = ${fmt(a * k)} cm`],
      });
    },
    () => {
      const scale = pick([24, 32, 40, 64]), real = randInt(30, 60) / 10, model = round(real * 100 / scale, 2);
      return P({
        q: `A model truck is built at a scale of 1:${scale}. The real truck is ${fmt(real, 1)} m long. How long is the model in centimetres?`,
        num: model, display: `${fmt(model)} cm`, unit: 'cm',
        hint: 'Convert metres to centimetres, then divide by the scale.',
        steps: [`${fmt(real, 1)} m = ${fmt(real * 100, 0)} cm`, `Model = ${fmt(real * 100, 0)} ÷ ${scale} = ${fmt(model)} cm`],
      });
    },
  ],
  3: [
    () => {
      const s = pick([50, 100, 200]), l = randInt(4, 12), w = randInt(3, l), L = l * s / 100, W = w * s / 100, A = round(L * W, 2);
      return P({
        q: `A house plan uses a scale of 1:${s}. A bedroom measures ${l} cm by ${w} cm on the plan. What is the real floor area of the bedroom in square metres?`,
        num: A, display: `${fmt(A)} m²`, unit: 'm²',
        hint: 'Scale each length to real centimetres, convert to metres, then multiply.',
        steps: [`Length: ${l} × ${s} = ${l * s} cm = ${fmt(L)} m`, `Width: ${w} × ${s} = ${w * s} cm = ${fmt(W)} m`, `Area = ${fmt(L)} × ${fmt(W)} = ${fmt(A)} m²`],
      });
    },
    () => {
      const k = pick([2, 3, 4]), a = randInt(6, 20), c = pick([4, 5, 6.5, 8]), A = a * k * k, cost = round(A * c, 2);
      return P({
        q: `Two rectangular gardens are similar. The small one has an area of ${a} m². The large garden's sides are ${k} times as long. Sod costs ${money(c)} per m². How much will it cost to sod the large garden?`,
        num: cost, display: money(cost), unit: '$',
        hint: 'When lengths are multiplied by k, area is multiplied by k².',
        steps: [`Area factor = ${k}² = ${k * k}`, `Large area = ${a} × ${k * k} = ${A} m²`, `Cost = ${A} × ${money(c)} = ${money(cost)}`],
      });
    },
    () => {
      const h = pick([1.5, 1.6, 1.8]), d1 = pick([1.5, 2, 2.5, 3]), H = randInt(6, 20), d2 = round(H * d1 / h, 2), extra = round(H - 4, 2);
      return P({
        q: `To find the height of a grain elevator, a student whose eyes are ${fmt(h, 1)} m above the ground places a mirror on the ground. She stands ${fmt(d1, 1)} m from the mirror and sees the top of the elevator in it. The mirror is ${fmt(d2)} m from the elevator. How much taller is the elevator than a 4 m tall barn?`,
        num: extra, display: `${fmt(extra)} m`, unit: 'm',
        hint: 'The two triangles (student–mirror and elevator–mirror) are similar. Find the elevator height, then compare.',
        steps: [`Scale factor = ${fmt(d2)} ÷ ${fmt(d1, 1)} = ${fmt(d2 / d1, 3)}`, `Elevator = ${fmt(h, 1)} × ${fmt(d2 / d1, 3)} = ${fmt(H)} m`, `Difference = ${fmt(H)} − 4 = ${fmt(extra)} m`],
      });
    },
  ],
};

// ══════════ 10. STATISTICS ══════════
const statistics = {
  1: [
    () => {
      for (;;) {
        const xs = Array.from({ length: 5 }, () => randInt(55, 98)), s = xs.reduce((a, b) => a + b, 0);
        if (s % 5) continue;
        return P({
          q: `${pick(NAMES)}'s five quiz scores are ${xs.join(', ')}. What is the mean score?`,
          num: s / 5, display: `${s / 5}`, unit: '',
          hint: 'Add the scores, then divide by how many there are.',
          steps: [`Mean = (${xs.join(' + ')}) ÷ 5 = ${s} ÷ 5 = ${s / 5}`],
        });
      }
    },
    () => {
      const xs = Array.from({ length: 7 }, () => randInt(8, 40)), sorted = [...xs].sort((a, b) => a - b);
      return P({
        q: `The number of minutes seven students spent on homework last night: ${xs.join(', ')}. What is the median?`,
        num: sorted[3], display: `${sorted[3]} minutes`, unit: 'min',
        hint: 'Put the values in order. The median is the middle one.',
        steps: [`In order: ${sorted.join(', ')} → the middle (4th) value is ${sorted[3]}`],
      });
    },
    () => {
      const m = pick([2, 2.5, 3, 4]), b = pick([10, 15, 20]), x = randInt(15, 32), y = round(m * x + b, 1);
      return P({
        q: `A line of best fit for ice-cream sales is y = ${m}x + ${b}, where x is the temperature in °C and y is cones sold. Predict sales when it is ${x}°C.`,
        num: y, display: `${fmt(y, 1)} cones`, unit: 'cones',
        hint: 'Substitute x into the equation of the line.',
        steps: [`y = ${m}(${x}) + ${b} = ${fmt(y, 1)} cones`],
      });
    },
  ],
  2: [
    () => {
      const cur = randInt(66, 84), target = cur + randInt(2, 4), need = 5 * target - 4 * cur;
      if (need > 100) throw 0;
      return P({
        q: `After 4 tests, ${pick(NAMES)}'s mean mark is ${cur}%. What mark is needed on the 5th test to raise the mean to ${target}%?`,
        num: need, display: `${need}%`, unit: '%',
        hint: 'Total needed for 5 tests = 5 × target. Total so far = 4 × current mean.',
        steps: [`Total so far = 4 × ${cur} = ${4 * cur}`, `Total needed = 5 × ${target} = ${5 * target}`, `5th test = ${5 * target} − ${4 * cur} = ${need}%`],
      });
    },
    () => {
      const m = pick([2, 2.5, 3, 4]), b = pick([10, 15, 20]), x = randInt(15, 32), y = round(m * x + b, 1), actual = Math.round(y) + pick([-14, -9, -6, 7, 11, 15]);
      const res = round(actual - y, 1);
      return P({
        q: `A line of best fit for ice-cream sales is y = ${m}x + ${b} (x = temperature in °C). On a ${x}°C day, the shop actually sold ${actual} cones. How far above (+) or below (−) the prediction was the actual number?`,
        num: res, display: `${fmt(res, 1)} cones`, unit: 'cones',
        hint: 'Find the predicted value, then subtract: actual − predicted.',
        steps: [`Predicted: ${m}(${x}) + ${b} = ${fmt(y, 1)}`, `Actual − predicted = ${actual} − ${fmt(y, 1)} = ${fmt(res, 1)}`],
      });
    },
    () => {
      const xs = Array.from({ length: 6 }, () => randInt(10, 45)).sort((a, b) => a - b), med = (xs[2] + xs[3]) / 2;
      return P({
        q: `Six students recorded how many push-ups they could do: ${[...xs].sort(() => Math.random() - 0.5).join(', ')}. What is the median?`,
        num: med, display: `${fmt(med, 1)}`, unit: 'push-ups',
        hint: 'With an even number of values, the median is the mean of the two middle values.',
        steps: [`In order: ${xs.join(', ')}`, `Median = (${xs[2]} + ${xs[3]}) ÷ 2 = ${fmt(med, 1)}`],
      });
    },
  ],
  3: [
    () => {
      for (;;) {
        const m = pick([2, 3, 4, 5, 1.5, 2.5]), b = randInt(5, 30), x1 = randInt(10, 16), x2 = x1 + randInt(4, 8), x3 = x2 + randInt(3, 8);
        const y1 = m * x1 + b, y2 = m * x2 + b, y3 = m * x3 + b;
        if (!Number.isInteger(y1) || !Number.isInteger(y2)) continue;
        return P({
          q: `A line of best fit for a scatter plot of temperature (x, °C) vs. hot-dog sales (y) passes through (${x1}, ${y1}) and (${x2}, ${y2}). Use the line to predict sales at ${x3}°C.`,
          num: y3, display: `${fmt(y3, 1)} hot dogs`, unit: 'hot dogs',
          hint: 'Find the slope, then the y-intercept, then substitute.',
          steps: [`m = (${y2} − ${y1}) ÷ (${x2} − ${x1}) = ${fmt(m, 2)}`, `b = ${y1} − ${fmt(m, 2)}(${x1}) = ${b}`, `y = ${fmt(m, 2)}(${x3}) + ${b} = ${fmt(y3, 1)}`],
        });
      }
    },
    () => {
      for (;;) {
        const xs = Array.from({ length: 5 }, () => randInt(20, 40)), out = randInt(90, 140), s5 = xs.reduce((a, b) => a + b, 0), s6 = s5 + out;
        if (s5 % 5 || s6 % 6) continue;
        const all = [...xs, out].sort(() => Math.random() - 0.5);
        return P({
          q: `Daily visitors to a small museum: ${all.join(', ')}. One value is an outlier (a school trip). By how much does the mean drop when the outlier is removed?`,
          num: s6 / 6 - s5 / 5, display: `${fmt(s6 / 6 - s5 / 5, 2)} visitors`, unit: 'visitors',
          hint: 'Find the mean with all six values, then without the outlier, then subtract.',
          steps: [`Mean with outlier = ${s6} ÷ 6 = ${s6 / 6}`, `Without ${out}: ${s5} ÷ 5 = ${s5 / 5}`, `Drop = ${s6 / 6} − ${s5 / 5} = ${s6 / 6 - s5 / 5}`],
        });
      }
    },
    () => {
      const n = pick([20, 25, 40, 50]), pct = pick([35, 40, 45, 60]), total = pick([600, 800, 1200, 1500]);
      const yes = Math.round(n * pct / 100), est = round(yes / n * total, 0);
      return P({
        q: `A random sample of ${n} students at a school of ${total} were asked if they want a longer lunch. ${yes} said yes. Based on the sample, about how many students in the whole school want a longer lunch?`,
        num: est, tol: 1, display: `about ${est} students`, unit: 'students',
        hint: 'Find the sample fraction (or percent), then apply it to the whole population.',
        steps: [`Sample fraction = ${yes}/${n} = ${fmt(yes / n * 100, 1)}%`, `Estimate = ${fmt(yes / n, 3)} × ${total}`, `≈ ${est} students`],
      });
    },
  ],
};

// ══════════ 11. PROBABILITY ══════════
const probAns = (n, d) => ({ num: n / d, display: `${frac(n, d)} (${fmt(n / d * 100, 1)}%)`, prob: true });
const probability = {
  1: [
    () => {
      const r = randInt(2, 8), b = randInt(2, 8), g = randInt(1, 6), t = r + b + g;
      return P({
        q: `A bag holds ${r} red, ${b} blue, and ${g} green marbles. You pick one without looking. What is the probability it is red?`,
        ...probAns(r, t),
        hint: 'P = favourable outcomes ÷ total outcomes.',
        steps: [`Total = ${r} + ${b} + ${g} = ${t}`, `P(red) = ${r}/${t}${frac(r, t) !== `${r}/${t}` ? ` = ${frac(r, t)}` : ''}`],
      });
    },
    () => {
      const n = pick([5, 6, 8, 10, 12]), k = randInt(1, n - 1);
      return P({
        q: `A game spinner has ${n} equal sections. ${k} of them say "WIN". What is the probability of spinning WIN?`,
        ...probAns(k, n),
        hint: 'Count winning sections out of all sections.',
        steps: [`P(WIN) = ${k}/${n} = ${frac(k, n)}`],
      });
    },
    () => {
      const N = pick([20, 30, 40, 50]), s = randInt(2, N / 3);
      return P({
        q: `${pick(NAMES)} rolled a die ${N} times and got a 6 on ${s} rolls. What is the experimental probability of rolling a 6?`,
        ...probAns(s, N),
        hint: 'Experimental probability = times it happened ÷ number of trials.',
        steps: [`P = ${s}/${N} = ${frac(s, N)}`],
      });
    },
  ],
  2: [
    () => {
      const k = randInt(1, 4), good = 6 - k;
      return P({
        q: `You flip a coin and roll a standard die. What is the probability of getting heads AND a number greater than ${k}?`,
        ...probAns(good, 12),
        hint: 'The events are independent, so multiply their probabilities.',
        steps: [`P(heads) = 1/2; P(> ${k}) = ${good}/6 = ${frac(good, 6)}`, `P(both) = 1/2 × ${frac(good, 6)} = ${frac(good, 12)}`],
      });
    },
    () => {
      const n = 8, k = randInt(1, 5), spins = pick([16, 24, 40, 48, 80]), exp = spins * k / n;
      return P({
        q: `A spinner has 8 equal sections, ${k} of which are blue. If you spin it ${spins} times, how many times would you expect to land on blue?`,
        num: exp, display: `${fmt(exp, 1)} times`, unit: 'times',
        hint: 'Expected count = probability × number of trials.',
        steps: [`P(blue) = ${k}/8`, `Expected = ${k}/8 × ${spins} = ${fmt(exp, 1)}`],
      });
    },
    () => {
      const N = pick([60, 120, 180, 240]), obs = N / 6 + pick([-6, -4, -3, 3, 4, 7]), exp = N / 6, diff = obs - exp;
      return P({
        q: `A die is rolled ${N} times and lands on 4 a total of ${obs} times. How many more (+) or fewer (−) 4s were rolled than the theoretical probability predicts?`,
        num: diff, display: `${diff > 0 ? '+' : ''}${diff}`, unit: '',
        hint: 'Expected number = (1/6) × rolls. Then compare: actual − expected.',
        steps: [`Expected = 1/6 × ${N} = ${exp}`, `Difference = ${obs} − ${exp} = ${diff}`],
      });
    },
  ],
  3: [
    () => {
      const r = randInt(3, 7), b = randInt(3, 8), t = r + b;
      return P({
        q: `A bag has ${r} red and ${b} blue tokens. You draw one, keep it, then draw another. What is the probability that both are red?`,
        ...probAns(r * (r - 1), t * (t - 1)),
        hint: 'Dependent events: after the first red is taken, there is one fewer red and one fewer token.',
        steps: [`P(1st red) = ${r}/${t}`, `P(2nd red | 1st red) = ${r - 1}/${t - 1}`, `P(both) = ${r}/${t} × ${r - 1}/${t - 1} = ${frac(r * (r - 1), t * (t - 1))}`],
      });
    },
    () => {
      const a = pick([20, 30, 40, 50, 60]), b = pick([10, 20, 30, 40, 70]), none = (100 - a) * (100 - b) / 10000;
      const atLeast = pick([true, false]);
      const ans = atLeast ? 1 - none : none;
      return P({
        q: `The forecast gives a ${a}% chance of rain on Saturday and a ${b}% chance on Sunday (independent). What is the probability that it rains on ${atLeast ? 'at least one of the days' : 'neither day'}?`,
        num: ans, display: `${fmt(ans, 2)} (${fmt(ans * 100, 0)}%)`, prob: true,
        hint: atLeast ? 'Find P(no rain both days) first, then subtract from 1.' : 'Find P(no rain) for each day, then multiply.',
        steps: [`P(no rain Sat) = ${fmt(1 - a / 100, 2)}; P(no rain Sun) = ${fmt(1 - b / 100, 2)}`, `P(neither) = ${fmt(1 - a / 100, 2)} × ${fmt(1 - b / 100, 2)} = ${fmt(none, 2)}`, ...(atLeast ? [`P(at least one) = 1 − ${fmt(none, 2)} = ${fmt(ans, 2)}`] : [])],
      });
    },
    () => {
      const g = randInt(2, 5), t = g + randInt(3, 6), games = pick([30, 40, 60, 90]);
      const p = g / t * g / t, exp = round(p * games, 1);
      return P({
        q: `In a card game, you draw a card from a pile of ${t} (${g} are aces), put it back, shuffle, and draw again. You win a round only if both draws are aces. About how many rounds would you expect to win out of ${games}?`,
        num: exp, tol: 0.15, display: `about ${fmt(exp, 1)} rounds`, unit: 'rounds',
        hint: 'With replacement, the draws are independent. Find P(both aces), then multiply by the number of rounds.',
        steps: [`P(ace) = ${g}/${t} each draw`, `P(both) = ${g}/${t} × ${g}/${t} = ${frac(g * g, t * t)}`, `Expected wins = ${frac(g * g, t * t)} × ${games} ≈ ${fmt(exp, 1)}`],
      });
    },
  ],
};

export const MATH9_TOPICS = [
  { id: 'rational-numbers', num: 1, name: 'Rational Numbers', summary: 'Temperatures, money, and measurements with negative fractions and decimals.', levels: rational },
  { id: 'square-roots', num: 2, name: 'Square Roots', summary: 'Side lengths from area, estimating roots, and the Pythagorean theorem.', levels: squareRoots },
  { id: 'powers-exponents', num: 3, name: 'Powers & Exponents', summary: 'Doubling, half-life, storage, and exponent laws in context.', levels: powers },
  { id: 'linear-relations', num: 4, name: 'Linear Relations', summary: 'Rates, starting values, tables, and predicting from a linear pattern.', levels: linRel },
  { id: 'linear-equations', num: 5, name: 'Linear Equations & Inequalities', summary: 'Tickets, gyms, budgets, and break-even problems.', levels: linEq },
  { id: 'polynomials', num: 6, name: 'Polynomials', summary: 'Perimeter and area expressions: add, subtract, and multiply polynomials.', levels: polynomials },
  { id: 'circle-geometry', num: 7, name: 'Circle Geometry', summary: 'Chords, tangents, and inscribed angles in real objects.', levels: circleGeo },
  { id: 'measurement', num: 8, name: 'Surface Area & Volume', summary: 'Tanks, silos, grain elevators, and composite 3-D objects.', levels: measurement },
  { id: 'similarity', num: 9, name: 'Similarity & Scale', summary: 'Maps, models, shadows, and scale factors for length and area.', levels: similarity },
  { id: 'statistics', num: 10, name: 'Statistics & Scatter Plots', summary: 'Mean, median, outliers, lines of best fit, and sampling.', levels: statistics },
  { id: 'probability', num: 11, name: 'Probability', summary: 'Independent and dependent events, expected outcomes, and complements.', levels: probability },
];
