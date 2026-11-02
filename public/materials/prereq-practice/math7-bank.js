// Math 7 prereq practice questions, used by math-7/practice/math7-<topic>-prereq-practice-v1.html.
// Every skill makes a new question each time (gen). Question fields are described at the top of
// practice.js; questions are plain text (bank.plain). Diagrams come from sci-visuals.js.
// The skills are the Grade 6 (and earlier) ideas each Math 7 topic leans on:
// see "assumed" in src/content/parent-guides/math7/.
(function () {
'use strict';

const V = window.SciVisuals;

// ─── helpers ───
const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[ri(0, arr.length - 1)];
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
const neg = (n) => (n < 0 ? '−' + Math.abs(n) : String(n));
const par = (n) => (n < 0 ? '(' + neg(n) + ')' : String(n));
const round = (x, d) => Math.round(x * 10 ** d) / 10 ** d;
const fmt = (x) => neg(round(x, 2));

// Read a typed answer as a number: allows −, commas, "3/4", "1 1/2", "$", "%" and units.
function readNum(s) {
  s = String(s).replace(/[−–]/g, '-').replace(/[$,%]/g, '').trim();
  let m = s.match(/^(-?)(\d+)\s+(\d+)\s*\/\s*(\d+)/);
  if (m) return (m[1] ? -1 : 1) * (Number(m[2]) + Number(m[3]) / Number(m[4]));
  m = s.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
  if (m) return Number(m[1]) / Number(m[2]);
  m = s.match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : NaN;
}
const near = (want, tol) => (given) => Math.abs(readNum(given) - want) <= (tol || 1e-6);
// Fractions: any equal fraction counts unless simplest form is asked for.
const fracEq = (n, d) => (given) => {
  const m = String(given).replace(/\s/g, '').match(/^(-?\d+)\/(\d+)$/);
  return m ? Number(m[1]) * d === n * Number(m[2]) : near(n / d)(given);
};
const fracSimplest = (n, d) => (given) => {
  const m = String(given).replace(/\s/g, '').match(/^(\d+)\/(\d+)$/);
  if (!m) return d === 1 && near(n)(given);
  return Number(m[1]) === n && Number(m[2]) === d;
};
const word = (...ok) => (given) => ok.some((w) => String(given).toLowerCase().replace(/[^a-z0-9]/g, '') === w.toLowerCase().replace(/[^a-z0-9]/g, ''));

// ─── generators (shared with the Math 8 bank) ───
function genTimes() {
  const a = ri(3, 12), b = ri(3, 12);
  return { question: `${a} × ${b} = ?`, answer: a * b, solution: `${a} × ${b} = ${a * b}.`, hint: 'Use a fact you know. 7 × 8 is 7 × 4 doubled.', accept: near(a * b) };
}
function genDivide() {
  const a = ri(3, 12), b = ri(3, 12);
  return { question: `${a * b} ÷ ${a} = ?`, answer: b, solution: `${a} × ${b} = ${a * b}, so ${a * b} ÷ ${a} = ${b}.`, hint: 'Think: what times the divisor gives the number?', accept: near(b) };
}
function genAreaRect() {
  const l = ri(3, 15), w = ri(2, 12);
  return { question: `A rectangle is ${l} cm long and ${w} cm wide. What is its area in cm²?`, answer: `${l * w} cm²`, solution: `Area = length × width = ${l} × ${w} = ${l * w} cm².`, hint: 'Area of a rectangle = length × width.', accept: near(l * w) };
}
function genAreaSquare() {
  const s = ri(2, 15);
  return { question: `A square has sides of ${s} m. What is its area in m²?`, answer: `${s * s} m²`, solution: `${s} × ${s} = ${s * s} m².`, hint: 'All four sides are equal. Area = side × side.', accept: near(s * s) };
}
function genFracToDec() {
  const [n, d] = pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [7, 10], [3, 20], [9, 20], [1, 8], [3, 8]]);
  const dec = n / d;
  return { question: `Write ${n}/${d} as a decimal.`, answer: String(dec), solution: `${n} ÷ ${d} = ${dec}.`, hint: 'A fraction is a division: top ÷ bottom.', accept: near(dec) };
}
function genDecToPercent() {
  const v = pick([0.25, 0.4, 0.05, 0.75, 0.6, 0.08, 0.125, 1.2, 0.33]);
  const p = round(v * 100, 1);
  return { question: `Write ${v} as a percent.`, answer: `${p}%`, solution: `Multiply by 100: ${v} × 100 = ${p}%.`, hint: 'Percent means out of 100. Multiply the decimal by 100.', accept: near(p) };
}
function genTimes10() {
  const x = ri(12, 999) / 10, k = pick([10, 100]), op = pick(['×', '÷']);
  const ans = op === '×' ? x * k : x / k;
  return { question: `${x} ${op} ${k} = ?`, answer: neg(round(ans, 4)), solution: op === '×' ? `Move the decimal point ${k === 10 ? 1 : 2} place${k === 10 ? '' : 's'} right: ${neg(round(ans, 4))}.` : `Move the decimal point ${k === 10 ? 1 : 2} place${k === 10 ? '' : 's'} left: ${neg(round(ans, 4))}.`, hint: '× 10 moves the decimal one place right; ÷ 10 moves it one place left.', accept: near(ans, 1e-6) };
}
function genPercentOf100() {
  const p = pick([10, 20, 25, 50, 75, 5]), w = pick([20, 40, 60, 80, 100, 200]);
  const ans = p / 100 * w;
  return { question: `What is ${p}% of ${w}?`, answer: fmt(ans), solution: `${p}% = ${p / 100}. ${p / 100} × ${w} = ${fmt(ans)}.`, hint: '10% is one tenth. 50% is half. 25% is a quarter.', accept: near(ans) };
}
function genEquivFrac() {
  const d = pick([2, 3, 4, 5, 6, 8]), n = ri(1, d - 1), k = ri(2, 5);
  return { question: `${n}/${d} = ?/${d * k}`, answer: n * k, solution: `${d} × ${k} = ${d * k}, so multiply the top by ${k} too: ${n} × ${k} = ${n * k}.`, hint: 'Multiply the top and bottom by the same number.', accept: near(n * k) };
}
function genSimplify() {
  const d0 = pick([3, 4, 5, 6, 7, 8, 9]), n0 = ri(1, d0 - 1);
  const g = gcd(n0, d0), n = n0 / g, d = d0 / g, k = ri(2, 6);
  return { question: `Simplify ${n * k}/${d * k}.`, answer: `${n}/${d}`, solution: `Divide the top and bottom by ${k}: ${n}/${d}.`, hint: 'Find a number that divides both the top and the bottom.', accept: fracSimplest(n, d) };
}
function genAddFrac() {
  const pairs = [[2, 3], [2, 4], [3, 4], [2, 6], [3, 6], [4, 8], [2, 5], [3, 5]];
  const [d1, d2] = pick(pairs), n1 = ri(1, d1 - 1), n2 = ri(1, d2 - 1);
  const D = d1 * d2 / gcd(d1, d2), N = n1 * (D / d1) + n2 * (D / d2);
  return { question: `${n1}/${d1} + ${n2}/${d2} = ? (Write a fraction.)`, answer: `${N}/${D}`, solution: `Common denominator ${D}: ${n1 * (D / d1)}/${D} + ${n2 * (D / d2)}/${D} = ${N}/${D}.`, hint: 'Make the bottoms the same first. Then add the tops.', accept: fracEq(N, D) };
}
function genMixedToImproper() {
  const w = ri(1, 4), d = pick([2, 3, 4, 5, 8]), n = ri(1, d - 1);
  return { question: `Write ${w} ${n}/${d} as an improper fraction.`, answer: `${w * d + n}/${d}`, solution: `${w} wholes = ${w * d}/${d}. Add ${n}/${d}: ${w * d + n}/${d}.`, hint: 'Each whole has as many pieces as the bottom number.', accept: fracEq(w * d + n, d) };
}
function genAddInt() {
  const a = ri(-12, 12), b = ri(-12, 12);
  return { question: `${neg(a)} + ${par(b)} = ?`, answer: neg(a + b), solution: `Start at ${neg(a)} and move ${b >= 0 ? b + ' right' : Math.abs(b) + ' left'}: ${neg(a + b)}.`, hint: 'Adding a negative means moving left on the number line.', accept: near(a + b), visual: V.numberLine({ min: -15, max: 15, step: 1, every: 5, points: [[a, neg(a)]] }) };
}
function genSubInt() {
  const a = ri(-10, 10), b = ri(-10, 10);
  return { question: `${neg(a)} − ${par(b)} = ?`, answer: neg(a - b), solution: `Subtracting ${par(b)} is the same as adding ${par(-b)}: ${neg(a)} + ${par(-b)} = ${neg(a - b)}.`, hint: 'Subtract a number = add its opposite.', accept: near(a - b) };
}
function genOrderInt() {
  const a = ri(-15, 15); let b = ri(-15, 15); if (b === a) b = a - 3;
  const big = Math.max(a, b);
  return { question: `Which is greater: ${neg(a)} or ${neg(b)}?`, answer: neg(big), solution: `${neg(big)} is farther right on the number line.`, hint: 'On a number line, numbers get bigger to the right.', accept: near(big), visual: V.numberLine({ min: -15, max: 15, step: 1, every: 5, points: [[a, neg(a)], [b, neg(b)]] }) };
}
function genPattern() {
  const s = ri(1, 9), d = ri(2, 6);
  const seq = [0, 1, 2, 3].map((i) => s + d * i);
  return { question: `What comes next? ${seq.join(', ')}, ?`, answer: s + 4 * d, solution: `It goes up by ${d} each time: ${seq[3]} + ${d} = ${s + 4 * d}.`, hint: 'Find how much it goes up each time.', accept: near(s + 4 * d) };
}
function genEvalExpr() {
  const a = ri(2, 6), b = ri(-5, 9), n = ri(1, 8);
  const expr = `${a}n ${b < 0 ? '− ' + Math.abs(b) : '+ ' + b}`;
  return { question: `Find the value of ${expr} when n = ${n}.`, answer: neg(a * n + b), solution: `${a} × ${n} ${b < 0 ? '− ' + Math.abs(b) : '+ ' + b} = ${neg(a * n + b)}.`, hint: `${a}n means ${a} times n. Multiply first.`, accept: near(a * n + b) };
}
function genOneStep() {
  const x = ri(2, 12), a = ri(2, 9), kind = pick(['+', '×', '−']);
  let q, s;
  if (kind === '+') { q = `x + ${a} = ${x + a}`; s = `Subtract ${a} from both sides: x = ${x}.`; }
  else if (kind === '−') { q = `x − ${a} = ${x - a}`; s = `Add ${a} to both sides: x = ${x}.`; }
  else { q = `${a}x = ${a * x}`; s = `Divide both sides by ${a}: x = ${x}.`; }
  return { question: `Solve: ${q}`, answer: `x = ${x}`, solution: s, hint: 'Do the opposite (inverse) operation to both sides.', accept: near(x) };
}
function genInverse() {
  const [op, inv] = pick([['add 7', 'subtract 7'], ['multiply by 3', 'divide by 3'], ['subtract 5', 'add 5'], ['divide by 4', 'multiply by 4']]);
  const others = ['add 7', 'subtract 7', 'multiply by 3', 'divide by 3', 'subtract 5', 'add 5', 'divide by 4', 'multiply by 4'].filter((o) => o !== inv && o !== op);
  const choices = [inv, others[0], others[3], op].sort(() => Math.random() - 0.5);
  return { question: `What undoes "${op}"? (Choices: ${choices.join(' · ')})`, answer: inv, solution: `The inverse of "${op}" is "${inv}".`, hint: '+ and − undo each other. × and ÷ undo each other.', accept: word(inv) };
}
function genPlot() {
  const x = ri(-6, 6), y = ri(-6, 6);
  const q = x > 0 && y > 0 ? 'I' : x < 0 && y > 0 ? 'II' : x < 0 && y < 0 ? 'III' : x > 0 && y < 0 ? 'IV' : 'on an axis';
  return { question: `In which quadrant is the point (${neg(x)}, ${neg(y)})? (I, II, III, IV, or "on an axis")`, answer: q, solution: `x is ${x > 0 ? 'positive' : x < 0 ? 'negative' : 'zero'} and y is ${y > 0 ? 'positive' : y < 0 ? 'negative' : 'zero'}, so the point is ${q === 'on an axis' ? 'on an axis' : 'in quadrant ' + q}.`, hint: 'Quadrant I is top right (+, +). Go counterclockwise: II top left, III bottom left, IV bottom right.', accept: word(q, q === 'on an axis' ? 'axis' : q) };
}
function genAreaTri() {
  const b = ri(2, 14), h = ri(2, 12);
  return { question: `A triangle has a base of ${b} cm and a height of ${h} cm. What is its area in cm²?`, answer: `${fmt(b * h / 2)} cm²`, solution: `Area = ½ × base × height = ½ × ${b} × ${h} = ${fmt(b * h / 2)} cm².`, hint: 'A triangle is half of a rectangle.', accept: near(b * h / 2) };
}
function genFaces() {
  const [obj, f] = pick([['cube', 6], ['rectangular prism', 6], ['triangular prism', 5], ['square-based pyramid', 5], ['cylinder (count the flat circles)', 2]]);
  return { question: `How many faces does a ${obj} have?`, answer: f, solution: obj === 'triangular prism' ? '2 triangles + 3 rectangles = 5 faces.' : obj.startsWith('cylinder') ? 'A cylinder has 2 flat circles (and one curved surface).' : obj === 'square-based pyramid' ? '1 square + 4 triangles = 5 faces.' : '6 faces (3 matching pairs).', hint: 'Picture the object. Count the flat surfaces.', accept: near(f) };
}
function genMean() {
  const n = ri(4, 6), vals = Array.from({ length: n }, () => ri(1, 20));
  const sum = vals.reduce((a, b) => a + b, 0), m = sum / n;
  return { question: `Find the mean of ${vals.join(', ')}. (Round to one decimal place if needed.)`, answer: fmt(round(m, 1)), solution: `Add: ${sum}. Divide by ${n}: ${round(m, 2)}.`, hint: 'Mean = add them all, then divide by how many there are.', accept: near(m, 0.06) };
}
function genReadBar() {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu'], vals = labels.map(() => ri(1, 9) * 2);
  const i = ri(0, 3);
  return { question: `How many cans were collected on ${labels[i]}?`, answer: vals[i], solution: `The ${labels[i]} bar reaches ${vals[i]}.`, hint: 'Find the top of the bar and read across to the scale.', accept: near(vals[i]), visual: V.barChart({ min: 0, max: 20, grid: 5, unit: 'cans', bars: labels.map((l, k) => [l, vals[k]]) }) };
}
function genProbFrac() {
  const red = ri(1, 6), blue = ri(1, 6), green = ri(1, 4), t = red + blue + green;
  const [c, n] = pick([['red', red], ['blue', blue], ['green', green]]);
  return { question: `A bag has ${red} red, ${blue} blue and ${green} green marbles. What is P(${c})? Write a fraction.`, answer: `${n}/${t}`, solution: `${n} ${c} out of ${t} marbles: ${n}/${t}.`, hint: 'Probability = favourable outcomes ÷ all outcomes.', accept: fracEq(n, t) };
}
function genSquareNum() {
  const n = ri(2, 15);
  return { question: `${n} × ${n} = ?`, answer: n * n, solution: `${n} × ${n} = ${n * n}.`, hint: 'A number times itself.', accept: near(n * n) };
}
function genRatioWrite() {
  const a = ri(2, 9), b = ri(2, 9);
  return { question: `A box has ${a} red pens and ${b} blue pens. Write the ratio of red to blue as a:b.`, answer: `${a}:${b}`, solution: `Red first, then blue: ${a}:${b}.`, hint: 'The order matters. The first thing named comes first.', accept: (g) => { const m = String(g).match(/(\d+)\s*[:to/]+\s*(\d+)/); return !!m && Number(m[1]) * b === Number(m[2]) * a; } };
}
function genUnitPrice() {
  const n = pick([2, 4, 5, 8]), each = pick([1.25, 0.75, 2.5, 1.5, 0.5]);
  return { question: `${n} muffins cost $${(n * each).toFixed(2)}. What does one muffin cost?`, answer: `$${each.toFixed(2)}`, solution: `$${(n * each).toFixed(2)} ÷ ${n} = $${each.toFixed(2)}.`, hint: 'Divide the total price by the number of items.', accept: near(each, 0.005) };
}

// ─── Grade 6 skills new to the Math 7 bank ───
function genOpposite() {
  const a = pick([ri(-15, -1), ri(1, 15)]);
  return { question: `What is the opposite of ${neg(a)}?`, answer: neg(-a), solution: `The opposite is the same distance from 0 on the other side: ${neg(-a)}.`, hint: 'Opposites are the same distance from 0, on different sides.', accept: near(-a), visual: V.numberLine({ min: -15, max: 15, step: 1, every: 5, points: [[a, neg(a)]] }) };
}
function genTemp() {
  const t = ri(-25, -2), up = ri(3, 15);
  return { question: `It is ${neg(t)} °C in the morning. It warms up ${up} degrees. What is the new temperature?`, answer: `${neg(t + up)} °C`, solution: `${neg(t)} + ${up} = ${neg(t + up)}. Count up ${up} from ${neg(t)}.`, hint: 'Warming up means moving up (right) on the number line.', accept: near(t + up), visual: V.numberLine({ min: -30, max: 20, step: 5, every: 10, points: [[t, neg(t)]] }) };
}
function genDecCompare() {
  const pairs = [[0.5, 0.45], [0.3, 0.29], [0.125, 0.5], [1.2, 1.15], [0.07, 0.7], [2.05, 2.5], [0.6, 0.06], [3.4, 3.39]];
  const [x, y] = pick(pairs).sort(() => Math.random() - 0.5);
  const big = Math.max(x, y);
  return { question: `Which is greater: ${x} or ${y}?`, answer: String(big), solution: `Line up the place values. ${big} is greater.`, hint: 'Write both with the same number of decimal places, like 0.50 and 0.45.', accept: near(big) };
}
function genDecOnLine() {
  const v = ri(1, 19) / 10;
  return { question: `Which decimal is halfway between ${fmt(v)} and ${fmt(round(v + 0.1, 1))}?`, answer: fmt(round(v + 0.05, 2)), solution: `Think in hundredths: ${Math.round(v * 100)} and ${Math.round(v * 100) + 10}. Halfway is ${Math.round(v * 100) + 5} hundredths = ${fmt(round(v + 0.05, 2))}.`, hint: 'Write them as hundredths first.', accept: near(v + 0.05, 1e-6) };
}
function genPower() {
  const b = ri(2, 6), e = pick([2, 3]);
  const v = b ** e;
  return { question: `${b}${e === 2 ? '²' : '³'} = ?`, answer: v, solution: `${Array(e).fill(b).join(' × ')} = ${v}.`, hint: `The small number says how many times to multiply ${b} by itself.`, accept: near(v) };
}
function genPerimSquare() {
  const s = ri(2, 15);
  return { question: `A square has sides of ${s} cm. What is its perimeter?`, answer: `${4 * s} cm`, solution: `4 sides × ${s} = ${4 * s} cm.`, hint: 'Perimeter is the distance all the way around.', accept: near(4 * s) };
}
function genVolumeBox() {
  const l = ri(2, 8), w = ri(2, 6), h = ri(2, 5);
  return { question: `A box is ${l} cm long, ${w} cm wide and ${h} cm high. What is its volume in cm³?`, answer: `${l * w * h} cm³`, solution: `${l} × ${w} × ${h} = ${l * w * h} cm³.`, hint: 'Volume of a box = length × width × height.', accept: near(l * w * h) };
}
function genFracOfWhole() {
  const d = pick([2, 3, 4, 5, 6, 8, 10]), n = ri(1, d - 1), k = ri(2, 6);
  const w = d * k;
  return { question: `${n}/${d} × ${w} = ?`, answer: n * k, solution: `${w} ÷ ${d} = ${k}. ${k} × ${n} = ${n * k}.`, hint: 'Divide by the bottom, then multiply by the top.', accept: near(n * k) };
}
function genDecTimesWhole() {
  const x = ri(11, 99) / 10, n = ri(2, 12);
  return { question: `${x} × ${n} = ?`, answer: fmt(round(x * n, 2)), solution: `${Math.round(x * 10)} × ${n} = ${Math.round(x * 10) * n}. One decimal place: ${fmt(round(x * n, 2))}.`, hint: 'Multiply without the decimal point, then put it back.', accept: near(x * n, 1e-6) };
}
function genDecDivWhole() {
  const n = ri(2, 9), q = ri(11, 99) / 10;
  const x = round(q * n, 2);
  return { question: `${x} ÷ ${n} = ?`, answer: fmt(q), solution: `${n} × ${fmt(q)} = ${x}, so ${x} ÷ ${n} = ${fmt(q)}.`, hint: 'Divide as usual. Keep the decimal point in line.', accept: near(q, 1e-6) };
}
function genOrderOps() {
  const a = ri(2, 9), b = ri(2, 9), c = ri(2, 6), form = pick([0, 1, 2]);
  const [q, v, s] = form === 0 ? [`${a} + ${b} × ${c}`, a + b * c, `Multiply first: ${b} × ${c} = ${b * c}. Then ${a} + ${b * c} = ${a + b * c}.`]
    : form === 1 ? [`(${a} + ${b}) × ${c}`, (a + b) * c, `Brackets first: ${a} + ${b} = ${a + b}. Then × ${c} = ${(a + b) * c}.`]
    : [`${a * c} ÷ ${c} − ${Math.min(a, b) - 1}`, a - (Math.min(a, b) - 1), `Divide first: ${a * c} ÷ ${c} = ${a}. Then ${a} − ${Math.min(a, b) - 1} = ${a - (Math.min(a, b) - 1)}.`];
  return { question: `${q} = ?`, answer: v, solution: s, hint: 'Brackets first. Then × and ÷. Then + and −.', accept: near(v) };
}
function genRecip() {
  const d = ri(2, 9), n = ri(1, d - 1);
  return { question: `How many ${d === 2 ? 'halves' : '1/' + d + ' pieces'} are in ${n === 1 ? 1 : 2} whole${n === 1 ? '' : 's'}?`, answer: (n === 1 ? 1 : 2) * d, solution: `Each whole has ${d} pieces. ${n === 1 ? 1 : 2} × ${d} = ${(n === 1 ? 1 : 2) * d}.`, hint: 'Count the pieces in one whole first.', accept: near((n === 1 ? 1 : 2) * d) };
}
function genRatioTable() {
  const a = ri(2, 5), b = ri(2, 7), k = ri(2, 6);
  return { question: `A recipe uses ${a} cups of flour for ${b} cups of milk. How much milk for ${a * k} cups of flour?`, answer: `${b * k} cups`, solution: `${a} × ${k} = ${a * k}, so multiply the milk by ${k} too: ${b} × ${k} = ${b * k}.`, hint: 'Find what you multiplied by. Do the same to the other amount.', accept: near(b * k) };
}
function genPercentBench() {
  const w = pick([40, 60, 80, 120, 200, 300, 500]), p = pick([1, 10, 25, 50]);
  const ans = w * p / 100;
  return { question: `What is ${p}% of ${w}?`, answer: fmt(ans), solution: p === 50 ? `50% is half: ${fmt(ans)}.` : p === 25 ? `25% is a quarter: ${w} ÷ 4 = ${fmt(ans)}.` : p === 10 ? `10% is one tenth: ${w} ÷ 10 = ${fmt(ans)}.` : `1% is one hundredth: ${w} ÷ 100 = ${fmt(ans)}.`, hint: '50% = half, 25% = quarter, 10% = ÷ 10, 1% = ÷ 100.', accept: near(ans) };
}
function genLikeTerms() {
  const a = ri(1, 6), b = ri(1, 6);
  return { question: `Simplify: ${a === 1 ? '' : a}x + ${b === 1 ? '' : b}x`, answer: `${a + b}x`, solution: `${a} x's and ${b} x's make ${a + b} x's: ${a + b}x.`, hint: 'Count the x\'s.', accept: (g) => String(g).replace(/\s/g, '').toLowerCase() === `${a + b}x` };
}
function genTwoStep() {
  const x = ri(1, 9), a = ri(2, 6), b = ri(1, 12);
  return { question: `Solve: ${a}x + ${b} = ${a * x + b}`, answer: `x = ${x}`, solution: `Subtract ${b}: ${a}x = ${a * x}. Divide by ${a}: x = ${x}.`, hint: 'Undo + first, then undo ×.', accept: near(x) };
}
function genTableRule() {
  const m = ri(2, 5), c = ri(0, 6), x = ri(5, 9);
  const rows = [1, 2, 3].map((i) => `${i} → ${m * i + c}`).join(', ');
  return { question: `Input → output: ${rows}. What is the output for ${x}?`, answer: m * x + c, solution: `The rule is × ${m}${c ? ' + ' + c : ''}. ${m} × ${x}${c ? ' + ' + c : ''} = ${m * x + c}.`, hint: 'How much does the output go up each time? Then check the start.', accept: near(m * x + c) };
}
function genReadPoint() {
  const x = ri(0, 8), y = ri(0, 8);
  return { question: `A point is ${x} right of the origin and ${y} up. Write it as an ordered pair (x, y).`, answer: `(${x}, ${y})`, solution: `Across first, then up: (${x}, ${y}).`, hint: 'x (across) comes first, then y (up).', accept: (g) => { const m = String(g).match(/(-?\d+)\s*,\s*(-?\d+)/); return !!m && Number(m[1]) === x && Number(m[2]) === y; } };
}
function genAngleType() {
  const a = pick([30, 45, 60, 90, 120, 150, 180, 75, 100]);
  const t = a < 90 ? 'acute' : a === 90 ? 'right' : a < 180 ? 'obtuse' : 'straight';
  return { question: `An angle measures ${a}°. Is it acute, right, obtuse or straight?`, answer: t, solution: `Acute < 90°, right = 90°, obtuse between 90° and 180°, straight = 180°. ${a}° is ${t}.`, hint: 'Compare it with a square corner (90°).', accept: word(t) };
}
function genSupp() {
  const a = ri(20, 160);
  return { question: `Two angles sit side by side on a straight line. One is ${a}°. What is the other?`, answer: `${180 - a}°`, solution: `A straight line is 180°. 180 − ${a} = ${180 - a}°.`, hint: 'A straight line makes 180°.', accept: near(180 - a) };
}
function genCongruentShape() {
  return pick([
    { question: 'Two triangles are exactly the same size and shape. One is turned. Are they congruent? (yes or no)', answer: 'yes', solution: 'Turning does not change size or shape. They are congruent.', hint: 'Congruent means same size and same shape.', accept: word('yes', 'y') },
    { question: 'One square has sides of 4 cm. Another has sides of 6 cm. Are they congruent? (yes or no)', answer: 'no', solution: 'Same shape but not the same size, so not congruent.', hint: 'Congruent means same size and same shape.', accept: word('no', 'n') },
    { question: 'A shape is flipped (reflected). Is the new shape congruent to the first one? (yes or no)', answer: 'yes', solution: 'A flip keeps the size and shape.', hint: 'Does a flip change the size?', accept: word('yes', 'y') },
  ]);
}
function genDiameter() {
  const r = ri(2, 20);
  return pick([
    { question: `A circle has a radius of ${r} cm. What is its diameter?`, answer: `${2 * r} cm`, solution: `The diameter is two radii: 2 × ${r} = ${2 * r} cm.`, hint: 'The diameter goes all the way across, through the centre.', accept: near(2 * r) },
    { question: `A circle has a diameter of ${2 * r} cm. What is its radius?`, answer: `${r} cm`, solution: `The radius is half the diameter: ${2 * r} ÷ 2 = ${r} cm.`, hint: 'The radius goes from the centre to the edge.', accept: near(r) },
  ]);
}
function genAreaPara() {
  const b = ri(3, 14), h = ri(2, 10);
  return { question: `A parallelogram has a base of ${b} m and a height of ${h} m. What is its area?`, answer: `${b * h} m²`, solution: `Area = base × height = ${b} × ${h} = ${b * h} m².`, hint: 'Cut off a triangle and slide it over: it makes a rectangle.', accept: near(b * h) };
}
function genMedian() {
  const n = pick([5, 7]), vals = Array.from({ length: n }, () => ri(1, 30));
  const s = vals.slice().sort((a, b) => a - b), m = s[(n - 1) / 2];
  return { question: `Find the median of ${vals.join(', ')}.`, answer: m, solution: `In order: ${s.join(', ')}. The middle value is ${m}.`, hint: 'Put the numbers in order first. Then find the middle one.', accept: near(m) };
}
function genMode() {
  const m = ri(2, 9), others = [ri(10, 19), ri(20, 29), ri(30, 39)];
  const vals = [m, m, m, ...others, m + 40].sort(() => Math.random() - 0.5);
  return { question: `Find the mode of ${vals.join(', ')}.`, answer: m, solution: `${m} appears 3 times, more than any other value.`, hint: 'The mode is the value that appears most often.', accept: near(m) };
}
function genRange() {
  const vals = Array.from({ length: 6 }, () => ri(2, 40));
  const r = Math.max(...vals) - Math.min(...vals);
  return { question: `Find the range of ${vals.join(', ')}.`, answer: r, solution: `Biggest − smallest = ${Math.max(...vals)} − ${Math.min(...vals)} = ${r}.`, hint: 'Range = biggest value − smallest value.', accept: near(r) };
}
function genRelFreq() {
  const t = pick([10, 20, 25, 50]), h = ri(1, t - 1);
  return { question: `A coin was flipped ${t} times. It landed heads ${h} times. What fraction of the flips were heads?`, answer: `${h}/${t}`, solution: `Heads ÷ flips = ${h}/${t}.`, hint: 'Relative frequency = times it happened ÷ total trials.', accept: fracEq(h, t) };
}
function genLikely() {
  return pick([
    { question: 'Is rolling a 7 on a regular six-sided die certain, likely, unlikely or impossible?', answer: 'impossible', solution: 'A die only has 1 to 6. A 7 cannot happen.', hint: 'Look at the faces of the die.', accept: word('impossible') },
    { question: 'Is rolling a number less than 7 on a six-sided die certain, likely, unlikely or impossible?', answer: 'certain', solution: 'Every face (1 to 6) is less than 7.', hint: 'Check each face.', accept: word('certain') },
    { question: 'A bag has 9 red cubes and 1 blue cube. Is picking red certain, likely, unlikely or impossible?', answer: 'likely', solution: '9 of 10 cubes are red, so red is likely.', hint: 'Compare the counts.', accept: word('likely') },
    { question: 'A spinner has 8 equal parts. Only 1 is green. Is landing on green certain, likely, unlikely or impossible?', answer: 'unlikely', solution: 'Only 1 of 8 parts is green.', hint: 'Compare the parts.', accept: word('unlikely') },
  ]);
}

// ─── units ───
window.PracticeBank = { plain: true, units: [
  { id: 'positive-negative', name: 'Positive and Negative Numbers', num: 1, summary: 'Opposites, temperatures, comparing integers and decimals, fractions as decimals', skills: [
    { name: 'Opposites', gen: genOpposite },
    { name: 'Temperatures', gen: genTemp },
    { name: 'Compare integers', gen: genOrderInt },
    { name: 'Compare decimals', gen: genDecCompare },
    { name: 'Fractions as decimals', gen: genFracToDec },
  ] },
  { id: 'integers', name: 'Integers', num: 2, summary: 'Comparing integers, adding and subtracting integers, times tables', skills: [
    { name: 'Compare integers', gen: genOrderInt },
    { name: 'Add integers', gen: genAddInt },
    { name: 'Subtract integers', gen: genSubInt },
    { name: 'Multiplication facts', gen: genTimes },
    { name: 'Division facts', gen: genDivide },
  ] },
  { id: 'squares-cubes', name: 'Squares and Cubes', num: 3, summary: 'Times tables, powers, area and perimeter of squares, volume of a box', skills: [
    { name: 'Multiplication facts', gen: genTimes },
    { name: 'A number times itself', gen: genSquareNum },
    { name: 'Powers', gen: genPower },
    { name: 'Perimeter of a square', gen: genPerimSquare },
    { name: 'Volume of a box', gen: genVolumeBox },
  ] },
  { id: 'fractions-decimals', name: 'Multiplying and Dividing Fractions and Decimals', num: 4, summary: 'Equivalent fractions, simplifying, fraction of a number, decimals × and ÷ whole numbers, order of operations', skills: [
    { name: 'Equivalent fractions', gen: genEquivFrac },
    { name: 'Simplify a fraction', gen: genSimplify },
    { name: 'Fraction of a whole number', gen: genFracOfWhole },
    { name: 'Decimal × whole number', gen: genDecTimesWhole },
    { name: 'Decimal ÷ whole number', gen: genDecDivWhole },
    { name: 'Order of operations', gen: genOrderOps },
  ] },
  { id: 'ratios-percents', name: 'Ratios and Percents', num: 5, summary: 'Writing ratios, scaling a recipe, price of one, easy percents', skills: [
    { name: 'Write a ratio', gen: genRatioWrite },
    { name: 'Scale a recipe', gen: genRatioTable },
    { name: 'Price of one item', gen: genUnitPrice },
    { name: 'Easy percents', gen: genPercentBench },
    { name: 'Decimals as percents', gen: genDecToPercent },
  ] },
  { id: 'linear-equations', name: 'Linear Equations', num: 6, summary: 'Inverse operations, one- and two-step equations, expressions, integers', skills: [
    { name: 'Inverse operations', gen: genInverse },
    { name: 'One-step equations', gen: genOneStep },
    { name: 'Two-step equations', gen: genTwoStep },
    { name: 'Evaluate an expression', gen: genEvalExpr },
    { name: 'Collect the x\'s', gen: genLikeTerms },
  ] },
  { id: 'functions', name: 'Functions', num: 7, summary: 'Patterns, input-output rules, ordered pairs, evaluating expressions', skills: [
    { name: 'Continue a pattern', gen: genPattern },
    { name: 'Input-output rules', gen: genTableRule },
    { name: 'Ordered pairs', gen: genReadPoint },
    { name: 'Evaluate an expression', gen: genEvalExpr },
  ] },
  { id: 'lines-angles', name: 'Lines, Angles and Congruence', num: 8, summary: 'Kinds of angles, angles on a straight line, congruent shapes, quadrants', skills: [
    { name: 'Kinds of angles', gen: genAngleType },
    { name: 'Angles on a straight line', gen: genSupp },
    { name: 'Congruent shapes', gen: genCongruentShape },
    { name: 'Quadrants', gen: genPlot },
  ] },
  { id: 'circles', name: 'Circles', num: 9, summary: 'Radius and diameter, multiplying decimals, area of parallelograms and triangles', skills: [
    { name: 'Radius and diameter', gen: genDiameter },
    { name: 'Decimal × whole number', gen: genDecTimesWhole },
    { name: 'Area of a parallelogram', gen: genAreaPara },
    { name: 'Area of a triangle', gen: genAreaTri },
    { name: 'A number times itself', gen: genSquareNum },
  ] },
  { id: 'volume', name: 'Volume', num: 10, summary: 'Area of rectangles and triangles, volume of a box, faces of 3-D objects', skills: [
    { name: 'Area of a rectangle', gen: genAreaRect },
    { name: 'Area of a triangle', gen: genAreaTri },
    { name: 'Volume of a box', gen: genVolumeBox },
    { name: 'Faces of 3-D objects', gen: genFaces },
    { name: 'Decimal × whole number', gen: genDecTimesWhole },
  ] },
  { id: 'samples-statistics', name: 'Samples and Statistics', num: 11, summary: 'Reading bar graphs, mean, median, mode and range', skills: [
    { name: 'Read a bar graph', gen: genReadBar },
    { name: 'Find the mean', gen: genMean },
    { name: 'Find the median', gen: genMedian },
    { name: 'Find the mode', gen: genMode },
    { name: 'Find the range', gen: genRange },
  ] },
  { id: 'probability', name: 'Probability', num: 12, summary: 'Likely or unlikely, probability as a fraction, relative frequency, fractions as decimals and percents', skills: [
    { name: 'Likely or unlikely', gen: genLikely },
    { name: 'Probability as a fraction', gen: genProbFrac },
    { name: 'Relative frequency', gen: genRelFreq },
    { name: 'Fractions as decimals', gen: genFracToDec },
    { name: 'Decimals as percents', gen: genDecToPercent },
  ] },
] };
})();
