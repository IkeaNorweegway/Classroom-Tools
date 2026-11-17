// Science 7 word problems: 5 units × 3 levels.
// Level 1 = one step, Level 2 = two steps, Level 3 = three or more steps.
import { randInt, pick, round, fmt, money, P } from './helpers.js';

const G = 9.8; // N/kg on Earth
const C_WATER = 4.18; // J/(g·°C)

// ══════════ 1. INTERACTIONS & ECOSYSTEMS ══════════
const ecosystems = {
  1: [
    () => {
      const E = pick([10000, 20000, 25000, 40000, 50000, 80000]);
      return P({
        q: `The grass in a prairie meadow stores ${E.toLocaleString()} kJ of energy. Using the 10% rule, how much energy is passed on to the grasshoppers that eat it?`,
        num: E / 10, display: `${(E / 10).toLocaleString()} kJ`, unit: 'kJ',
        hint: 'About 10% of the energy moves up to the next level. The rest is lost as heat.',
        steps: [`10% of ${E.toLocaleString()} = 0.10 × ${E.toLocaleString()} = ${(E / 10).toLocaleString()} kJ`],
      });
    },
    () => {
      const counts = Array.from({ length: 4 }, () => randInt(3, 20)), s = counts.reduce((a, b) => a + b, 0);
      if (s % 4) throw 0;
      return P({
        q: `Students placed four 1 m² quadrats in a schoolyard and counted dandelions: ${counts.join(', ')}. What is the average number of dandelions per square metre?`,
        num: s / 4, display: `${s / 4} dandelions per m²`, unit: 'per m²',
        hint: 'Add the counts and divide by the number of quadrats.',
        steps: [`(${counts.join(' + ')}) ÷ 4 = ${s} ÷ 4 = ${s / 4} per m²`],
      });
    },
    () => {
      const start = randInt(40, 120), born = randInt(10, 40);
      return P({
        q: `A pond has ${start} frogs. In spring, ${born} more frogs hatch and grow into adults, and none die or leave. How many frogs are in the population now?`,
        num: start + born, display: `${start + born} frogs`, unit: 'frogs',
        hint: 'Births add to a population.',
        steps: [`${start} + ${born} = ${start + born} frogs`],
      });
    },
  ],
  2: [
    () => {
      const E = pick([100000, 200000, 500000, 250000, 400000]);
      return P({
        q: `In the food chain grass → mouse → owl, the grass stores ${E.toLocaleString()} kJ of energy. Using the 10% rule, how much energy reaches the owl?`,
        num: E / 100, display: `${(E / 100).toLocaleString()} kJ`, unit: 'kJ',
        hint: 'Apply the 10% rule once for each step up the chain.',
        steps: [`Mouse: 10% of ${E.toLocaleString()} = ${(E / 10).toLocaleString()} kJ`, `Owl: 10% of ${(E / 10).toLocaleString()} = ${(E / 100).toLocaleString()} kJ`],
      });
    },
    () => {
      const counts = Array.from({ length: 5 }, () => randInt(2, 14)), s = counts.reduce((a, b) => a + b, 0), area = pick([200, 500, 800, 1200, 2500]);
      if (s % 5) throw 0;
      const est = (s / 5) * area;
      return P({
        q: `To estimate a population of wild crocuses, students counted plants in five 1 m² quadrats: ${counts.join(', ')}. The whole field is ${area.toLocaleString()} m². Estimate the number of crocuses in the field.`,
        num: est, display: `about ${est.toLocaleString()} crocuses`, unit: 'crocuses',
        hint: 'Find the average per square metre, then multiply by the area of the field.',
        steps: [`Average = (${counts.join(' + ')}) ÷ 5 = ${s / 5} per m²`, `Estimate = ${s / 5} × ${area.toLocaleString()} = ${est.toLocaleString()}`],
      });
    },
    () => {
      const owl = pick([50, 80, 120, 200, 300]);
      return P({
        q: `An owl needs ${owl} kJ of energy from the mice it eats. In the chain grass → mouse → owl, about how much energy must the grass store to support it? (Use the 10% rule.)`,
        num: owl * 100, display: `${(owl * 100).toLocaleString()} kJ`, unit: 'kJ',
        hint: 'Work backward: each level below must have 10 times as much energy.',
        steps: [`Mice must have ${owl} × 10 = ${(owl * 10).toLocaleString()} kJ`, `Grass must have ${(owl * 10).toLocaleString()} × 10 = ${(owl * 100).toLocaleString()} kJ`],
      });
    },
  ],
  3: [
    () => {
      const N = randInt(200, 600), B = randInt(40, 150), D = randInt(30, 120), I = randInt(5, 40), Em = randInt(5, 40);
      const end = N + B + I - D - Em, pct = round((end - N) / N * 100, 1);
      return P({
        q: `A herd of ${N} elk lives in a park. In one year, ${B} calves are born, ${D} elk die, ${I} move in, and ${Em} move out. By what percent did the population change? (Use a negative for a decrease. Round to one decimal.)`,
        num: pct, tol: 0.11, display: `${fmt(pct, 1)}%`, unit: '%',
        hint: 'Population change = births + immigration − deaths − emigration. Then divide by the starting population.',
        steps: [`Change = ${B} + ${I} − ${D} − ${Em} = ${end - N}`, `New population = ${N} + (${end - N}) = ${end}`, `Percent change = ${end - N} ÷ ${N} × 100 = ${fmt(pct, 1)}%`],
      });
    },
    () => {
      for (;;) {
        const M = pick([40, 50, 60, 80, 100]), C = pick([40, 50, 60, 75, 80]), R = randInt(4, 20), N = M * C / R, ha = pick([2, 4, 5, 8, 10]);
        if (!Number.isInteger(N) || N % ha) continue;
        return P({
          q: `Biologists catch and tag ${M} trout in a lake, then release them. A week later they catch ${C} trout, and ${R} of them have tags. The lake covers ${ha} hectares. Estimate the trout population density (trout per hectare).`,
          num: N / ha, display: `${N / ha} trout per hectare`, unit: 'per ha',
          hint: 'Mark–recapture: total ≈ (tagged first × caught second) ÷ tagged in second catch. Then divide by area.',
          steps: [`Fraction tagged in 2nd catch = ${R}/${C}`, `Population ≈ ${M} × ${C} ÷ ${R} = ${N} trout`, `Density = ${N} ÷ ${ha} = ${N / ha} trout per hectare`],
        });
      }
    },
    () => {
      const E = pick([1000000, 2000000, 5000000]), hawk = E / 1000;
      return P({
        q: `Sunlight energy captured by producers in a field is ${E.toLocaleString()} kJ. The food chain is grass → grasshopper → snake → hawk. Using the 10% rule, how much energy is LOST (not passed on) between the grass and the hawk in total?`,
        num: E - hawk, display: `${(E - hawk).toLocaleString()} kJ`, unit: 'kJ',
        hint: 'Find the energy that reaches the hawk, then subtract from what the grass stored.',
        steps: [`Grasshopper: ${(E / 10).toLocaleString()} kJ; snake: ${(E / 100).toLocaleString()} kJ`, `Hawk: ${hawk.toLocaleString()} kJ`, `Lost = ${E.toLocaleString()} − ${hawk.toLocaleString()} = ${(E - hawk).toLocaleString()} kJ`],
      });
    },
  ],
};

// ══════════ 2. PLANTS FOR FOOD & FIBRE ══════════
const plants = {
  1: [
    () => {
      const A = randInt(40, 300), y = pick([2.5, 3, 3.5, 4, 2.8]), t = round(A * y, 1);
      return P({
        q: `A farmer near Lacombe grows wheat on ${A} hectares. The field yields ${fmt(y, 1)} tonnes per hectare. How many tonnes of wheat are harvested?`,
        num: t, display: `${fmt(t, 1)} t`, unit: 't',
        hint: 'Total = area × yield per hectare.',
        steps: [`${A} × ${fmt(y, 1)} = ${fmt(t, 1)} tonnes`],
      });
    },
    () => {
      const n = pick([20, 25, 40, 50, 80, 100]), g = randInt(Math.floor(n * 0.5), n - 1), pct = round(g / n * 100, 1);
      return P({
        q: `A class planted ${n} canola seeds. ${g} of them sprouted. What is the germination rate as a percent?`,
        num: pct, tol: 0.11, display: `${fmt(pct, 1)}%`, unit: '%',
        hint: 'Germination rate = sprouted ÷ planted × 100.',
        steps: [`${g} ÷ ${n} × 100 = ${fmt(pct, 1)}%`],
      });
    },
    () => {
      const h1 = randInt(2, 8), h2 = h1 + randInt(10, 40);
      return P({
        q: `A bean seedling was ${h1} cm tall on Monday. Three weeks later it is ${h2} cm tall. How much did it grow?`,
        num: h2 - h1, display: `${h2 - h1} cm`, unit: 'cm',
        hint: 'Growth = final height − starting height.',
        steps: [`${h2} − ${h1} = ${h2 - h1} cm`],
      });
    },
  ],
  2: [
    () => {
      const d = pick([7, 10, 14, 20]), rate = pick([0.5, 0.8, 1.2, 1.5, 2]), h1 = randInt(2, 6), h2 = round(h1 + rate * d, 1);
      return P({
        q: `A sunflower was ${h1} cm tall. After ${d} days of good light it was ${fmt(h2, 1)} cm tall. What was its average growth rate in cm per day?`,
        num: rate, display: `${fmt(rate, 1)} cm per day`, unit: 'cm/day',
        hint: 'Find the total growth, then divide by the number of days.',
        steps: [`Growth = ${fmt(h2, 1)} − ${h1} = ${fmt(h2 - h1, 1)} cm`, `Rate = ${fmt(h2 - h1, 1)} ÷ ${d} = ${fmt(rate, 1)} cm/day`],
      });
    },
    () => {
      const [L, W] = pick([[200, 500], [400, 250], [100, 300], [500, 600], [250, 800]]), ha = L * W / 10000, k = pick([80, 100, 120, 150]);
      return P({
        q: `A barley field is ${L} m long and ${W} m wide. The farmer applies ${k} kg of fertilizer per hectare (1 ha = 10 000 m²). How much fertilizer is needed?`,
        num: ha * k, display: `${(ha * k).toLocaleString()} kg`, unit: 'kg',
        hint: 'Find the area in m², convert to hectares, then multiply.',
        steps: [`Area = ${L} × ${W} = ${(L * W).toLocaleString()} m² = ${ha} ha`, `Fertilizer = ${ha} × ${k} = ${(ha * k).toLocaleString()} kg`],
      });
    },
    () => {
      const plantsPerRow = randInt(12, 30), rows = randInt(6, 15), peas = randInt(8, 20);
      return P({
        q: `A community garden has ${rows} rows of pea plants with ${plantsPerRow} plants in each row. Each plant produces about ${peas} pea pods. About how many pods will the garden produce?`,
        num: rows * plantsPerRow * peas, display: `${(rows * plantsPerRow * peas).toLocaleString()} pods`, unit: 'pods',
        hint: 'Find the number of plants first.',
        steps: [`Plants = ${rows} × ${plantsPerRow} = ${rows * plantsPerRow}`, `Pods = ${rows * plantsPerRow} × ${peas} = ${(rows * plantsPerRow * peas).toLocaleString()}`],
      });
    },
  ],
  3: [
    () => {
      const A = randInt(50, 200), y = pick([2.5, 3, 3.2, 4]), price = pick([220, 250, 280, 300]), cost = pick([450, 500, 550, 600]);
      const t = round(A * y, 1), rev = round(t * price, 2), costs = A * cost, profit = round(rev - costs, 2);
      return P({
        q: `A farmer grows canola on ${A} ha. The yield is ${fmt(y, 1)} t/ha, and canola sells for $${price} per tonne. Growing costs are $${cost} per hectare (seed, fertilizer, fuel). What is the farmer's profit? (Negative means a loss.)`,
        num: profit, display: money(profit), unit: '$',
        hint: 'Harvest → revenue → subtract total costs.',
        steps: [`Harvest = ${A} × ${fmt(y, 1)} = ${fmt(t, 1)} t`, `Revenue = ${fmt(t, 1)} × $${price} = ${money(rev)}`, `Costs = ${A} × $${cost} = ${money(costs)}`, `Profit = ${money(rev)} − ${money(costs)} = ${money(profit)}`],
      });
    },
    () => {
      for (;;) {
        const g = pick([60, 75, 80, 85, 90]), want = pick([150, 200, 240, 300, 360]), per = pick([25, 50]);
        const seeds = Math.ceil(want / (g / 100) - 1e-9), packs = Math.ceil(seeds / per);
        if (Number.isInteger(want / (g / 100)) && seeds % per === 0) continue;
        return P({
          q: `A greenhouse needs ${want} tomato seedlings. The seeds have a ${g}% germination rate and come in packets of ${per}. What is the fewest number of packets to buy?`,
          num: packs, display: `${packs} packets`, unit: 'packets',
          hint: 'Only some seeds sprout, so you need more seeds than seedlings. Then round up to whole packets.',
          steps: [`Seeds needed = ${want} ÷ ${g / 100} = ${fmt(want / (g / 100), 1)} → round up to ${seeds}`, `Packets = ${seeds} ÷ ${per} = ${fmt(seeds / per, 2)}`, `Round up: ${packs} packets`],
        });
      }
    },
    () => {
      const bales = randInt(400, 1200), kg = pick([20, 25, 30]), cowKg = pick([10, 12, 15]), cows = randInt(20, 60);
      const total = bales * kg, perDay = cowKg * cows, days = Math.floor(total / perDay);
      return P({
        q: `A rancher stores ${bales} hay bales, each with a mass of ${kg} kg. Each of her ${cows} cows eats ${cowKg} kg of hay per day. For how many full days will the hay last?`,
        num: days, display: `${days} days`, unit: 'days',
        hint: 'Find the total hay, the hay eaten per day, then divide and round down.',
        steps: [`Total hay = ${bales} × ${kg} = ${total.toLocaleString()} kg`, `Eaten per day = ${cows} × ${cowKg} = ${perDay} kg`, `${total.toLocaleString()} ÷ ${perDay} = ${fmt(total / perDay, 2)} → ${days} full days`],
      });
    },
  ],
};

// ══════════ 3. HEAT & TEMPERATURE ══════════
const heat = {
  1: [
    () => {
      const c = randInt(-40, 100);
      return P({
        q: `A thermometer reads ${fmt(c)}°C. What is this temperature in kelvins? (K = °C + 273)`,
        num: c + 273, display: `${c + 273} K`, unit: 'K',
        hint: 'Add 273 to the Celsius temperature.',
        steps: [`${fmt(c)} + 273 = ${c + 273} K`],
      });
    },
    () => {
      const k = randInt(200, 380);
      return P({
        q: `A lab sample is at ${k} K. What is its temperature in degrees Celsius? (°C = K − 273)`,
        num: k - 273, display: `${fmt(k - 273)}°C`, unit: '°C',
        hint: 'Subtract 273 from the kelvin temperature.',
        steps: [`${k} − 273 = ${fmt(k - 273)}°C`],
      });
    },
    () => {
      const m = pick([100, 200, 250, 500]), dT = randInt(5, 40), Q = round(m * C_WATER * dT, 1);
      return P({
        q: `How much heat energy is needed to warm ${m} g of water by ${dT}°C? (Q = m × c × ΔT, where c for water = 4.18 J/g·°C)`,
        num: Q, tol: 0.5, display: `${fmt(Q, 1)} J`, unit: 'J',
        hint: 'Multiply mass × specific heat × temperature change.',
        steps: [`Q = ${m} × 4.18 × ${dT} = ${fmt(Q, 1)} J`],
      });
    },
  ],
  2: [
    () => {
      const T1 = randInt(5, 25), r = pick([4, 5, 8, 10]);
      const t = round((100 - T1) / r, 1);
      return P({
        q: `Water starts at ${T1}°C on a hot plate and its temperature rises ${r}°C every minute. How many minutes until it reaches its boiling point (100°C)? Round to one decimal.`,
        num: t, tol: 0.06, display: `${fmt(t, 1)} minutes`, unit: 'min',
        hint: 'How many degrees must it rise? Then divide by the rise per minute.',
        steps: [`Rise needed = 100 − ${T1} = ${100 - T1}°C`, `Time = ${100 - T1} ÷ ${r} = ${fmt(t, 1)} min`],
      });
    },
    () => {
      const m = pick([150, 200, 300, 400, 500]), T1 = randInt(10, 25), T2 = randInt(50, 90), dT = T2 - T1, Q = round(m * C_WATER * dT, 1);
      return P({
        q: `A ${m} g mug of water is heated from ${T1}°C to ${T2}°C. How much heat energy did it absorb? (c for water = 4.18 J/g·°C)`,
        num: Q, tol: 0.5, display: `${fmt(Q, 1)} J`, unit: 'J',
        hint: 'Find ΔT first, then use Q = m × c × ΔT.',
        steps: [`ΔT = ${T2} − ${T1} = ${dT}°C`, `Q = ${m} × 4.18 × ${dT} = ${fmt(Q, 1)} J`],
      });
    },
    () => {
      const T1 = -randInt(5, 30), T2 = randInt(2, 25);
      return P({
        q: `A chinook wind arrives in Calgary. The temperature rises from ${fmt(T1)}°C to ${T2}°C. What is the temperature change in kelvins?`,
        num: T2 - T1, display: `${T2 - T1} K`, unit: 'K',
        hint: 'A change of 1°C is the same size as a change of 1 K. Find the change in °C first.',
        steps: [`Change = ${T2} − (${fmt(T1)}) = ${T2 - T1}°C`, `A change of 1°C = a change of 1 K, so ${T2 - T1} K`],
      });
    },
  ],
  3: [
    () => {
      const m = pick([100, 200, 250, 500]), Q = pick([4500, 9000, 18000, 22500]);
      const dW = Q / (m * C_WATER), dA = Q / (m * 0.90), diff = round(dA - dW, 1);
      return P({
        q: `${Q.toLocaleString()} J of heat is added to ${m} g of water and also to ${m} g of aluminum. Water's specific heat is 4.18 J/g·°C; aluminum's is 0.90 J/g·°C. How many more degrees does the aluminum's temperature rise? Round to one decimal.`,
        num: diff, tol: 0.15, display: `${fmt(diff, 1)}°C more`, unit: '°C',
        hint: 'Rearrange Q = mcΔT to ΔT = Q ÷ (m × c) for each material, then subtract.',
        steps: [`Water: ΔT = ${Q} ÷ (${m} × 4.18) ≈ ${fmt(dW, 1)}°C`, `Aluminum: ΔT = ${Q} ÷ (${m} × 0.90) ≈ ${fmt(dA, 1)}°C`, `Difference ≈ ${fmt(dA, 1)} − ${fmt(dW, 1)} = ${fmt(diff, 1)}°C`],
      });
    },
    () => {
      const m = pick([100, 200, 250, 400, 500]), T1 = randInt(10, 25), dT = randInt(10, 50), Q = round(m * C_WATER * dT, 1);
      return P({
        q: `${fmt(Q, 1)} J of heat is added to ${m} g of water that starts at ${T1}°C. What is the final temperature? (c for water = 4.18 J/g·°C)`,
        num: T1 + dT, tol: 0.06, display: `${T1 + dT}°C`, unit: '°C',
        hint: 'ΔT = Q ÷ (m × c). Then add the change to the starting temperature.',
        steps: [`m × c = ${m} × 4.18 = ${fmt(m * C_WATER, 1)}`, `ΔT = ${fmt(Q, 1)} ÷ ${fmt(m * C_WATER, 1)} = ${dT}°C`, `Final = ${T1} + ${dT} = ${T1 + dT}°C`],
      });
    },
    () => {
      const L = pick([50, 80, 100, 150, 200]), lo = -randInt(25, 40), hi = randInt(25, 35), k = 0.012, dT = hi - lo, ex = round(L * k * dT, 1);
      return P({
        q: `A steel bridge in Alberta is ${L} m long. Steel expands about 0.012 mm for every metre of length for every 1°C rise. How many millimetres longer is the bridge on a ${hi}°C summer day than on a ${fmt(lo)}°C winter day?`,
        num: ex, tol: 0.06, display: `${fmt(ex, 1)} mm`, unit: 'mm',
        hint: 'Find the temperature change. Then multiply: length × 0.012 × ΔT.',
        steps: [`ΔT = ${hi} − (${fmt(lo)}) = ${dT}°C`, `Expansion per °C = ${L} × 0.012 = ${fmt(L * k, 2)} mm`, `Total = ${fmt(L * k, 2)} × ${dT} = ${fmt(ex, 1)} mm`],
      });
    },
  ],
};

// ══════════ 4. STRUCTURES & FORCES ══════════
const structures = {
  1: [
    () => {
      const m = randInt(5, 120), F = round(m * G, 1);
      return P({
        q: `What is the weight (force of gravity) of a ${m} kg object on Earth? (Weight = mass × 9.8 N/kg)`,
        num: F, tol: 0.06, display: `${fmt(F, 1)} N`, unit: 'N',
        hint: 'Multiply the mass by 9.8 N/kg.',
        steps: [`${m} × 9.8 = ${fmt(F, 1)} N`],
      });
    },
    () => {
      const L = randInt(2, 20) * 1000, k = pick([1.5, 2, 3, 4]);
      return P({
        q: `A crane is expected to lift loads up to ${L.toLocaleString()} N. Engineers build it with a safety factor of ${k}. What load must it be able to hold without failing?`,
        num: L * k, display: `${(L * k).toLocaleString()} N`, unit: 'N',
        hint: 'Design load = expected load × safety factor.',
        steps: [`${L.toLocaleString()} × ${k} = ${(L * k).toLocaleString()} N`],
      });
    },
    () => {
      const F = round(randInt(35, 110) * G, 1), m = round(F / G, 1);
      return P({
        q: `A bathroom scale measures a force of ${fmt(F, 1)} N. What is the mass of the person on it? (mass = weight ÷ 9.8 N/kg)`,
        num: m, tol: 0.06, display: `${fmt(m, 1)} kg`, unit: 'kg',
        hint: 'Divide the weight by 9.8 N/kg.',
        steps: [`${fmt(F, 1)} ÷ 9.8 = ${fmt(m, 1)} kg`],
      });
    },
  ],
  2: [
    () => {
      const n = randInt(4, 20), m = randInt(45, 80), F = round(n * m * G, 1);
      return P({
        q: `${n} students with an average mass of ${m} kg stand on a stage. What total downward force (in newtons) do they put on the stage?`,
        num: F, tol: 0.5, display: `${fmt(F, 1)} N`, unit: 'N',
        hint: 'Find the total mass, then convert to weight.',
        steps: [`Total mass = ${n} × ${m} = ${n * m} kg`, `Weight = ${n * m} × 9.8 = ${fmt(F, 1)} N`],
      });
    },
    () => {
      const M = randInt(400, 1500), k = pick([2, 2.5, 3, 4, 5]), B = Math.round(M * G * k);
      const sf = round(B / (M * G), 1);
      return P({
        q: `An elevator cable breaks at a force of ${B.toLocaleString()} N. The largest load it carries has a mass of ${M} kg. What is the cable's safety factor? Round to one decimal.`,
        num: sf, tol: 0.06, display: `${fmt(sf, 1)}`, unit: '',
        hint: 'Convert the mass to weight, then: safety factor = breaking force ÷ load.',
        steps: [`Load weight = ${M} × 9.8 = ${fmt(M * G, 1)} N`, `Safety factor = ${B.toLocaleString()} ÷ ${fmt(M * G, 1)} ≈ ${fmt(sf, 1)}`],
      });
    },
    () => {
      const W = randInt(400, 1100), moon = round(W / G * 1.6, 1);
      return P({
        q: `An astronaut weighs ${W} N on Earth (9.8 N/kg). What would the astronaut weigh on the Moon, where gravity is 1.6 N/kg? Round to one decimal.`,
        num: moon, tol: 0.15, display: `${fmt(moon, 1)} N`, unit: 'N',
        hint: 'Mass stays the same everywhere. Find the mass first, then use the Moon\'s gravity.',
        steps: [`Mass = ${W} ÷ 9.8 ≈ ${fmt(W / G, 2)} kg`, `Moon weight = ${fmt(W / G, 2)} × 1.6 ≈ ${fmt(moon, 1)} N`],
      });
    },
  ],
  3: [
    () => {
      const F = randInt(8, 30) * 1000, cart = randInt(80, 200), m = pick([70, 75, 80, 85]);
      const left = F - cart * G, n = Math.floor(left / (m * G));
      return P({
        q: `A footbridge can safely hold ${F.toLocaleString()} N. A ${cart} kg maintenance cart is parked on it. If each person has a mass of about ${m} kg, how many people can safely be on the bridge at the same time?`,
        num: n, display: `${n} people`, unit: 'people',
        hint: 'Subtract the cart\'s weight from the limit. Then find how many people\'s weights fit. Round down.',
        steps: [`Cart weight = ${cart} × 9.8 = ${fmt(cart * G, 1)} N`, `Left for people = ${F.toLocaleString()} − ${fmt(cart * G, 1)} = ${fmt(left, 1)} N`, `Each person = ${m} × 9.8 = ${fmt(m * G, 1)} N`, `${fmt(left, 1)} ÷ ${fmt(m * G, 1)} = ${fmt(left / (m * G), 2)} → ${n} people`],
      });
    },
    () => {
      const m = randInt(50, 150), mars = 3.7, diff = round(m * G - m * mars, 1);
      return P({
        q: `A rover has a mass of ${m} kg. Gravity is 9.8 N/kg on Earth and 3.7 N/kg on Mars. How much less does the rover weigh on Mars than on Earth?`,
        num: diff, tol: 0.06, display: `${fmt(diff, 1)} N`, unit: 'N',
        hint: 'Find the weight on each planet, then subtract.',
        steps: [`Earth: ${m} × 9.8 = ${fmt(m * G, 1)} N`, `Mars: ${m} × 3.7 = ${fmt(m * mars, 1)} N`, `Difference = ${fmt(m * G, 1)} − ${fmt(m * mars, 1)} = ${fmt(diff, 1)} N`],
      });
    },
    () => {
      const shelfMax = randInt(300, 900), k = 2, boxM = pick([4, 5, 6, 8]);
      const design = shelfMax / k, n = Math.floor(design / (boxM * G));
      return P({
        q: `A shelf breaks under a force of ${shelfMax} N. For safety, the school only allows loads up to half of that (a safety factor of 2). How many ${boxM} kg boxes of textbooks can be stored on the shelf?`,
        num: n, display: `${n} boxes`, unit: 'boxes',
        hint: 'Find the allowed load, find one box\'s weight, then divide and round down.',
        steps: [`Allowed load = ${shelfMax} ÷ 2 = ${fmt(design, 1)} N`, `One box = ${boxM} × 9.8 = ${fmt(boxM * G, 1)} N`, `${fmt(design, 1)} ÷ ${fmt(boxM * G, 1)} = ${fmt(design / (boxM * G), 2)} → ${n} boxes`],
      });
    },
  ],
};

// ══════════ 5. PLANET EARTH ══════════
const planetEarth = {
  1: [
    () => {
      const r = pick([2, 2.5, 3, 4, 5]), t = pick([10, 20, 50, 100]);
      return P({
        q: `The North American plate moves about ${fmt(r, 1)} cm per year. How far does it move in ${t} years?`,
        num: r * t, display: `${fmt(r * t, 1)} cm`, unit: 'cm',
        hint: 'Distance = rate × time.',
        steps: [`${fmt(r, 1)} × ${t} = ${fmt(r * t, 1)} cm`],
      });
    },
    () => {
      const r = pick([1, 2, 3, 5]), y = pick([100, 250, 500, 1000]);
      return P({
        q: `Mud settles at the bottom of a lake at about ${r} mm per year. How thick will the new layer of sediment be after ${y} years?`,
        num: r * y, display: `${(r * y).toLocaleString()} mm`, unit: 'mm',
        hint: 'Thickness = rate × time.',
        steps: [`${r} × ${y} = ${(r * y).toLocaleString()} mm`],
      });
    },
    () => {
      const m1 = randInt(3, 6);
      return P({
        q: `On the Richter scale, each increase of 1 means about 10 times more ground shaking. How many times more shaking does a magnitude ${m1 + 1} earthquake cause than a magnitude ${m1}?`,
        num: 10, display: '10 times', unit: 'times',
        hint: 'A difference of one magnitude = 10 times.',
        steps: [`${m1 + 1} − ${m1} = 1 step → 10 times more shaking`],
      });
    },
  ],
  2: [
    () => {
      const r = pick([2, 2.5, 4, 5]), t = pick([10000, 100000, 1000000]), km = r * t / 100000;
      return P({
        q: `A tectonic plate moves ${fmt(r, 1)} cm per year. How many kilometres will it move in ${t.toLocaleString()} years? (1 km = 100 000 cm)`,
        num: km, tol: km * 0.005, display: `${fmt(km, 3)} km`, unit: 'km',
        hint: 'Find the distance in cm, then convert to km.',
        steps: [`Distance = ${fmt(r, 1)} × ${t.toLocaleString()} = ${(r * t).toLocaleString()} cm`, `${(r * t).toLocaleString()} ÷ 100 000 = ${fmt(km, 3)} km`],
      });
    },
    () => {
      const m1 = randInt(3, 5), d = randInt(2, 3), f = 10 ** d;
      return P({
        q: `Each step up on the Richter scale means 10 times more ground shaking. How many times more shaking does a magnitude ${m1 + d} earthquake cause than a magnitude ${m1}?`,
        num: f, display: `${f.toLocaleString()} times`, unit: 'times',
        hint: 'Find the difference in magnitudes, then multiply by 10 that many times.',
        steps: [`Difference = ${m1 + d} − ${m1} = ${d}`, `10${d === 2 ? '²' : '³'} = ${f.toLocaleString()} times`],
      });
    },
    () => {
      const r = pick([2, 2.5, 4, 5]), km = pick([1, 2, 5, 10]), yrs = km * 100000 / r;
      return P({
        q: `The Atlantic Ocean widens by about ${fmt(r, 1)} cm per year. How many years will it take to widen by ${km} km? (1 km = 100 000 cm)`,
        num: yrs, display: `${yrs.toLocaleString()} years`, unit: 'years',
        hint: 'Convert km to cm, then divide by the rate.',
        steps: [`${km} km = ${(km * 100000).toLocaleString()} cm`, `${(km * 100000).toLocaleString()} ÷ ${fmt(r, 1)} = ${yrs.toLocaleString()} years`],
      });
    },
  ],
  3: [
    () => {
      const d1 = randInt(2, 6), d2 = d1 + randInt(2, 8), r = pick([0.5, 1, 2, 4]), yrs = (d2 - d1) * 1000 / r;
      return P({
        q: `A rock face in the Drumheller badlands shows a sandstone layer from ${d1} m to ${d2} m below the top of the cliff. If the sediment was deposited at about ${fmt(r, 1)} mm per year, how many years did this layer take to form?`,
        num: yrs, display: `${yrs.toLocaleString()} years`, unit: 'years',
        hint: 'Find the thickness, convert metres to millimetres, then divide by the rate.',
        steps: [`Thickness = ${d2} − ${d1} = ${d2 - d1} m`, `${d2 - d1} m = ${((d2 - d1) * 1000).toLocaleString()} mm`, `Time = ${((d2 - d1) * 1000).toLocaleString()} ÷ ${fmt(r, 1)} = ${yrs.toLocaleString()} years`],
      });
    },
    () => {
      const D = 12 * randInt(5, 40), tp = D / 6, ts = D / 4;
      return P({
        q: `An earthquake happens ${D} km from a seismograph station. P-waves travel about 6 km/s and S-waves about 4 km/s. How many seconds after the P-waves do the S-waves arrive?`,
        num: ts - tp, display: `${ts - tp} s`, unit: 's',
        hint: 'Time = distance ÷ speed for each wave, then subtract.',
        steps: [`P-wave time = ${D} ÷ 6 = ${tp} s`, `S-wave time = ${D} ÷ 4 = ${ts} s`, `Lag = ${ts} − ${tp} = ${ts - tp} s`],
      });
    },
    () => {
      const r = pick([2, 3, 4, 5]), myr = pick([10, 20, 50]), km = r * myr * 1000000 / 100000;
      return P({
        q: `Two continents are moving apart at ${r} cm per year. How many kilometres farther apart will they be in ${myr} million years? (1 km = 100 000 cm)`,
        num: km, display: `${km.toLocaleString()} km`, unit: 'km',
        hint: 'Write the time in years, find the distance in cm, then convert to km.',
        steps: [`Time = ${myr} × 1 000 000 = ${(myr * 1000000).toLocaleString()} years`, `Distance = ${r} × ${(myr * 1000000).toLocaleString()} = ${(r * myr * 1000000).toLocaleString()} cm`, `${(r * myr * 1000000).toLocaleString()} ÷ 100 000 = ${km.toLocaleString()} km`],
      });
    },
  ],
};

export const SCIENCE7_TOPICS = [
  { id: 'interactions-ecosystems', num: 1, name: 'Interactions & Ecosystems', summary: 'Energy pyramids and the 10% rule, quadrat sampling, and population change.', levels: ecosystems },
  { id: 'plants-food-fibre', num: 2, name: 'Plants for Food & Fibre', summary: 'Crop yields, germination rates, growth rates, and farm profit.', levels: plants },
  { id: 'heat-temperature', num: 3, name: 'Heat & Temperature', summary: 'Celsius and kelvin, heating rates, Q = mcΔT, and thermal expansion.', levels: heat },
  { id: 'structures-forces', num: 4, name: 'Structures & Forces', summary: 'Mass vs. weight in newtons, loads, and safety factors.', levels: structures },
  { id: 'planet-earth', num: 5, name: 'Planet Earth', summary: 'Plate movement, sediment layers, earthquake magnitude, and seismic waves.', levels: planetEarth },
];
