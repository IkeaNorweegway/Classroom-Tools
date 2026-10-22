// Math 8 prereq practice questions, used by math-8/practice/math8-<topic>-prereq-practice-v1.html.
// Every skill makes a new question each time (gen). Question fields are described at the top of
// practice.js; questions are plain text (bank.plain). Diagrams come from sci-visuals.js.
// The skills are the Grade 7 (and earlier) ideas each Math 8 topic leans on:
// see "assumed" in src/content/parent-guides/math8/.
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

// ─── generators ───
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
function genFactorPairs() {
  const n = pick([12, 16, 18, 20, 24, 30, 36]);
  const pairs = [];
  for (let i = 1; i * i <= n; i++) if (n % i === 0) pairs.push(`${i} × ${n / i}`);
  return { question: `How many different factor pairs does ${n} have? (Count 2 × 6 and 6 × 2 as the same pair.)`, answer: pairs.length, solution: `${n}: ${pairs.join(', ')}. That is ${pairs.length} pairs.`, hint: 'Start at 1 and test each number in order.', accept: near(pairs.length) };
}
function genRound1() {
  const x = ri(100, 999) / 100;
  return { question: `Round ${x} to one decimal place.`, answer: round(x, 1).toFixed(1), solution: `Look at the hundredths digit. ${x} → ${round(x, 1).toFixed(1)}.`, hint: 'If the hundredths digit is 5 or more, round the tenths up.', accept: near(round(x, 1)) };
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
function genTranslate() {
  const x = ri(-5, 5), y = ri(-5, 5), dx = ri(-4, 4) || 3, dy = ri(-4, 4) || -2;
  const dir = `${Math.abs(dx)} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} ${dy > 0 ? 'up' : 'down'}`;
  return { question: `Move the point (${neg(x)}, ${neg(y)}) ${dir}. What is the new point? Write it as (x, y).`, answer: `(${neg(x + dx)}, ${neg(y + dy)})`, solution: `x: ${neg(x)} ${dx > 0 ? '+' : '−'} ${Math.abs(dx)} = ${neg(x + dx)}. y: ${neg(y)} ${dy > 0 ? '+' : '−'} ${Math.abs(dy)} = ${neg(y + dy)}.`, hint: 'Right and left change x. Up and down change y.', accept: (g) => { const m = String(g).replace(/[−–]/g, '-').match(/(-?\d+)\s*,\s*(-?\d+)/); return !!m && Number(m[1]) === x + dx && Number(m[2]) === y + dy; } };
}
function genAreaTri() {
  const b = ri(2, 14), h = ri(2, 12);
  return { question: `A triangle has a base of ${b} cm and a height of ${h} cm. What is its area in cm²?`, answer: `${fmt(b * h / 2)} cm²`, solution: `Area = ½ × base × height = ½ × ${b} × ${h} = ${fmt(b * h / 2)} cm².`, hint: 'A triangle is half of a rectangle.', accept: near(b * h / 2) };
}
function genCircle() {
  const r = ri(1, 10), kind = pick(['area', 'circumference']);
  const ans = kind === 'area' ? 3.14 * r * r : 2 * 3.14 * r;
  return { question: `A circle has a radius of ${r} cm. Find its ${kind}. Use π ≈ 3.14. (Round to one decimal place.)`, answer: `${round(ans, 1)} cm${kind === 'area' ? '²' : ''}`, solution: kind === 'area' ? `Area = πr² = 3.14 × ${r} × ${r} = ${round(ans, 2)}.` : `Circumference = 2πr = 2 × 3.14 × ${r} = ${round(ans, 2)}.`, hint: kind === 'area' ? 'Area = π × r × r.' : 'Circumference = 2 × π × r (the distance around).', accept: near(ans, 0.06) };
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
function genCirclePercent() {
  const total = pick([20, 25, 40, 50]), part = ri(1, total - 1);
  const p = round(part / total * 100, 1);
  return { question: `In a class of ${total}, ${part} students walk to school. What percent walk?`, answer: `${p}%`, solution: `${part} ÷ ${total} = ${part / total} = ${p}%.`, hint: 'Part ÷ whole, then × 100.', accept: near(p, 0.06) };
}
function genProbFrac() {
  const red = ri(1, 6), blue = ri(1, 6), green = ri(1, 4), t = red + blue + green;
  const [c, n] = pick([['red', red], ['blue', blue], ['green', green]]);
  return { question: `A bag has ${red} red, ${blue} blue and ${green} green marbles. What is P(${c})? Write a fraction.`, answer: `${n}/${t}`, solution: `${n} ${c} out of ${t} marbles: ${n}/${t}.`, hint: 'Probability = favourable outcomes ÷ all outcomes.', accept: fracEq(n, t) };
}
function genSampleSpace() {
  const [a, na, b, nb] = pick([['a coin', 2, 'a die', 6], ['two coins', 2, '', 2], ['a 4-part spinner', 4, 'a coin', 2], ['a die', 6, 'a 3-part spinner', 3], ['two dice', 6, '', 6]]);
  const what = b ? `${a} and ${b}` : a;
  return { question: `How many outcomes are there for ${what}?`, answer: na * nb, solution: `${na} × ${nb} = ${na * nb} outcomes. A tree or a table shows them all.`, hint: 'Multiply the number of outcomes for each part.', accept: near(na * nb) };
}
function genRightAngle() {
  return pick([
    { question: 'A triangle has angles of 90°, 60° and 30°. Is it a right triangle? (yes or no)', answer: 'yes', solution: 'It has a 90° angle, so it is a right triangle.', hint: 'A right triangle has one 90° angle.', accept: word('yes', 'y') },
    { question: 'A triangle has angles of 70°, 60° and 50°. Is it a right triangle? (yes or no)', answer: 'no', solution: 'None of the angles is 90°.', hint: 'A right triangle has one 90° angle.', accept: word('no', 'n') },
    { question: 'In a right triangle, which side is the longest: one of the sides that make the square corner, or the side across from it? (corner or across)', answer: 'across', solution: 'The side across from the right angle is always the longest. It is called the hypotenuse.', hint: 'Draw one. Which side stretches the farthest?', accept: word('across', 'acrossfromit', 'the side across', 'hypotenuse') },
  ]);
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

// ─── units ───
window.PracticeBank = { plain: true, units: [
  { id: 'square-roots', name: 'Squares and Square Roots', num: 1, summary: 'Times tables, area of squares, factor pairs, rounding', skills: [
    { name: 'Multiplication facts', gen: genTimes },
    { name: 'A number times itself', gen: genSquareNum },
    { name: 'Area of a square', gen: genAreaSquare },
    { name: 'Factor pairs', gen: genFactorPairs },
    { name: 'Rounding to one decimal place', gen: genRound1 },
  ] },
  { id: 'percents', name: 'Percents', num: 2, summary: 'Fractions to decimals, decimals to percents, × and ÷ by 10 and 100, easy percents', skills: [
    { name: 'Fractions as decimals', gen: genFracToDec },
    { name: 'Decimals as percents', gen: genDecToPercent },
    { name: 'Multiply and divide by 10 and 100', gen: genTimes10 },
    { name: 'Easy percents', gen: genPercentOf100 },
  ] },
  { id: 'ratios-rates', name: 'Ratios and Rates', num: 3, summary: 'Writing ratios, equivalent fractions, simplifying, dividing to find one', skills: [
    { name: 'Write a ratio', gen: genRatioWrite },
    { name: 'Equivalent fractions', gen: genEquivFrac },
    { name: 'Simplify a fraction', gen: genSimplify },
    { name: 'Price of one item', gen: genUnitPrice },
    { name: 'Division facts', gen: genDivide },
  ] },
  { id: 'fractions', name: 'Multiplying and Dividing Fractions', num: 4, summary: 'Equivalent fractions, simplifying, adding fractions, mixed numbers', skills: [
    { name: 'Equivalent fractions', gen: genEquivFrac },
    { name: 'Simplify a fraction', gen: genSimplify },
    { name: 'Add fractions', gen: genAddFrac },
    { name: 'Mixed numbers to improper fractions', gen: genMixedToImproper },
    { name: 'Multiplication facts', gen: genTimes },
  ] },
  { id: 'integers', name: 'Multiplying and Dividing Integers', num: 5, summary: 'Comparing, adding and subtracting integers; times tables', skills: [
    { name: 'Compare integers', gen: genOrderInt },
    { name: 'Add integers', gen: genAddInt },
    { name: 'Subtract integers', gen: genSubInt },
    { name: 'Multiplication facts', gen: genTimes },
    { name: 'Division facts', gen: genDivide },
  ] },
  { id: 'linear-relations', name: 'Linear Relations', num: 6, summary: 'Number patterns, evaluating expressions, coordinates', skills: [
    { name: 'Continue a pattern', gen: genPattern },
    { name: 'Evaluate an expression', gen: genEvalExpr },
    { name: 'Quadrants', gen: genPlot },
    { name: 'Add integers', gen: genAddInt },
  ] },
  { id: 'linear-equations', name: 'Linear Equations', num: 7, summary: 'Inverse operations, one-step equations, integers, expressions', skills: [
    { name: 'Inverse operations', gen: genInverse },
    { name: 'One-step equations', gen: genOneStep },
    { name: 'Evaluate an expression', gen: genEvalExpr },
    { name: 'Add integers', gen: genAddInt },
    { name: 'Subtract integers', gen: genSubInt },
  ] },
  { id: 'pythagorean', name: 'The Pythagorean Theorem', num: 8, summary: 'Squaring numbers, area of squares, right triangles, rounding', skills: [
    { name: 'A number times itself', gen: genSquareNum },
    { name: 'Area of a square', gen: genAreaSquare },
    { name: 'Right triangles', gen: genRightAngle },
    { name: 'Rounding to one decimal place', gen: genRound1 },
  ] },
  { id: 'surface-area-volume', name: 'Surface Area and Volume', num: 9, summary: 'Area of rectangles, triangles and circles; faces of 3-D objects', skills: [
    { name: 'Area of a rectangle', gen: genAreaRect },
    { name: 'Area of a triangle', gen: genAreaTri },
    { name: 'Circles: area and circumference', gen: genCircle },
    { name: 'Faces of 3-D objects', gen: genFaces },
  ] },
  { id: 'views-transformations', name: '3-D Views and Transformations', num: 10, summary: 'Coordinates and quadrants, moving points, faces of 3-D objects', skills: [
    { name: 'Quadrants', gen: genPlot },
    { name: 'Move a point (translation)', gen: genTranslate },
    { name: 'Faces of 3-D objects', gen: genFaces },
    { name: 'Compare integers', gen: genOrderInt },
  ] },
  { id: 'data-displays', name: 'Data Displays', num: 11, summary: 'Reading bar graphs, mean, percents of a whole', skills: [
    { name: 'Read a bar graph', gen: genReadBar },
    { name: 'Find the mean', gen: genMean },
    { name: 'Part of a whole as a percent', gen: genCirclePercent },
    { name: 'Decimals as percents', gen: genDecToPercent },
  ] },
  { id: 'probability', name: 'Probability', num: 12, summary: 'Probability as a fraction, counting outcomes, fractions to percents', skills: [
    { name: 'Probability as a fraction', gen: genProbFrac },
    { name: 'Count the outcomes', gen: genSampleSpace },
    { name: 'Fractions as decimals', gen: genFracToDec },
    { name: 'Decimals as percents', gen: genDecToPercent },
  ] },
] };
})();
