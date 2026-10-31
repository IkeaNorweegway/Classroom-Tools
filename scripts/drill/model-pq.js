
/* ===================== MODEL START (no DOM) ===================== */
/* PAT questions: the released PAT items (2013, 2015, 2019) from the PAT Prep page, plus PAT-style generated items.
   An item: { id, s (strand), yr, code, topic, sec, fmt: 'mc' | 'nr', ask, stem (HTML), story (true for a word problem),
   opts + a (index) + cues (per option) for mc, a (number) + pre/unit + miss ([[value, cue]]) for nr, cue, steps, pic }. */
const MODEL = (() => {
  const { rnd, pick, chance, shuffle } = Q;
  const near = (g, x, t) => g != null && Math.abs(g - x) <= (t == null ? .001 : t) + 1e-9;
  const B = s => '<b>' + s + '</b>';
  const SUP = n => String(n).split('').map(d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('');
  const r2 = x => Math.round(x * 100) / 100;
  const money = x => '$' + (Number.isInteger(x) ? String(x) : x.toFixed(2));
  const sgn = n => n < 0 ? '− ' + -n : '+ ' + n;
  const LET = ['A', 'B', 'C', 'D'];

  /* ---------- the released items ---------- */
  const BANK = [
    /* Number */
    { id: 'n1', s: 'num', yr: '2019', code: 'PE2', topic: 'pe', sec: 2, fmt: 'nr', ask: 'Evaluate', stem: '2³ × 2⁰', a: 8,
      miss: [[0, 'Any power to 0 is 1'], [6, '2³ means 2 × 2 × 2'], [2, 'Any power to 0 is 1']], cue: 'Any power to 0 is 1', steps: ['2³ × 2⁰', '= 8 × 1', '= 8'] },
    { id: 'n2', s: 'num', yr: '2019', code: 'PE5', topic: 'pe', sec: 5, fmt: 'nr', ask: 'Simplify, then evaluate', stem: '(3²)⁴ ÷ [3(3)(3⁴)]', a: 9,
      miss: [[1, 'Power of a power: multiply'], [81, '3(3)(3⁴) is 3⁶']], cue: 'Write both as powers of 3', steps: ['(3²)⁴ ÷ [3(3)(3⁴)]', '= 3⁸ ÷ 3⁶', '= 3²', '= 9'] },
    { id: 'n3', s: 'num', yr: '2019', code: 'RN2', topic: 'rn', sec: 2, fmt: 'nr', ask: 'Simplest form', stem: '1/6 + 1/3 + 2½', a: 3,
      miss: [[2.5, 'Add the fractions too']], cue: 'Common denominator: 6', steps: ['1/6 + 1/3 + 2½', '= 1/6 + 2/6 + 15/6', '= 18/6', '= 3'] },
    { id: 'n4', s: 'num', yr: '2019', code: 'RN3', topic: 'rn', sec: 3, fmt: 'nr', ask: 'Simplest form', stem: '−½ × (−⅓) × 12', a: 2,
      miss: [[-2, 'Negative × negative is positive']], cue: 'Multiply the fractions first', steps: ['−½ × (−⅓) × 12', '= ⅙ × 12', '= 2'] },
    { id: 'n5', s: 'num', yr: '2019', code: 'RN2', topic: 'rn', sec: 2, fmt: 'nr', ask: 'Evaluate', stem: '13.2 + 0.05 − 5.45', a: 7.8,
      miss: [[8.25, 'Line up the decimal points'], [7.75, 'Line up the decimal points']], cue: 'Line up the decimal points', steps: ['13.2 + 0.05 − 5.45', '= 13.25 − 5.45', '= 7.8'] },
    { id: 'n6', s: 'num', yr: '2019', code: 'RN5', topic: 'rn', sec: 5, fmt: 'nr', ask: 'As a decimal', stem: '(2 + 2 × 5)² ÷ [2(4 × 5)]', a: 3.6,
      miss: [[10, 'Multiply before you add'], [0.6, 'Square the bracket']], cue: 'Brackets, then the square', steps: ['(2 + 2 × 5)² ÷ [2(4 × 5)]', '= (2 + 10)² ÷ [2(20)]', '= 12² ÷ 40', '= 144 ÷ 40', '= 3.6'] },
    { id: 'n7', s: 'num', yr: '2019', code: 'SR4', topic: 'sr', sec: 4, fmt: 'nr', ask: 'Evaluate', stem: '√(100/25) + √(36/9)', a: 4,
      miss: [[8, '√4 is 2, not 4']], cue: 'Simplify inside each root', steps: ['√(100/25) + √(36/9)', '= √4 + √4', '= 2 + 2', '= 4'] },
    { id: 'n8', s: 'num', yr: '2019', code: 'SR1', topic: 'sr', sec: 1, fmt: 'nr', ask: 'How many?', stem: 'How many whole numbers between ' + B(39) + ' and ' + B(160) + ' are perfect squares?', story: true,
      a: 6, unit: 'squares', miss: [[7, 'Check the ends: 39 and 160']], cue: 'List 7², 8², … to 160', pic: 'squares', lo: 39, hi: 160 },
    { id: 'n9', s: 'num', yr: '2019', code: 'RN5', topic: 'rn', sec: 5, fmt: 'nr', ask: 'Evaluate', stem: '6 ÷ (2 − 3)³', a: -6,
      miss: [[6, '(−1)³ is −1'], [2, 'Brackets first: 2 − 3']], cue: 'Brackets first: 2 − 3', steps: ['6 ÷ (2 − 3)³', '= 6 ÷ (−1)³', '= 6 ÷ (−1)', '= −6'] },
    { id: 'n10', s: 'num', yr: '2019', code: 'PE3', topic: 'pe', sec: 3, fmt: 'nr', ask: 'Simplify, then evaluate', stem: '(3⁴ × 3³) − (3⁷ × 3⁰)', a: 0,
      miss: [[2187, '3⁷ × 3⁰ is 3⁷ too'], [-2187, '3⁴ × 3³ is 3⁷']], cue: 'Add exponents when multiplying', steps: ['(3⁴ × 3³) − (3⁷ × 3⁰)', '= 3⁷ − 3⁷', '= 0'] },
    { id: 'n11', s: 'num', yr: '2013', code: 'SR2', topic: 'sr', sec: 2, fmt: 'mc', ask: 'How many?', story: true,
      stem: 'How many of these are between ' + B('7.8') + ' and ' + B('8.8') + '?<br><span class="mrow">√51, √55, √61, √66, √71, √77, √81, √88</span>',
      opts: ['2', '3', '4', '5'], a: 2, om: true, cue: 'Square 7.8 and 8.8 first', pic: 'between', vals: [51, 55, 61, 66, 71, 77, 81, 88], lo: 7.8, hi: 8.8 },
    { id: 'n12', s: 'num', yr: '2013', code: 'PE1', topic: 'pe', sec: 1, fmt: 'mc', ask: 'Which means the same?', stem: '7² + 7³',
      opts: ['(7 + 7)²⁺³', '(7 + 7)²ˣ³', '(7 × 7) + (7 × 7 × 7)', '(7 + 7) × (7 + 7 + 7)'], a: 2, om: true, cue: 'Write each power out',
      steps: ['7² = 7 × 7', '7³ = 7 × 7 × 7', '7² + 7³ = (7 × 7) + (7 × 7 × 7)'] },
    { id: 'n13', s: 'num', yr: '2013', code: 'PE5', topic: 'pe', sec: 5, fmt: 'nr', ask: 'Whole number x', stem: '(x³)² ÷ x⁴ = 144', pre: 'x =', a: 12,
      miss: [[72, 'x² = 144: take √'], [144, 'x² = 144: take √']], cue: 'Simplify the left side first', steps: ['(x³)² ÷ x⁴ = 144', 'x⁶ ÷ x⁴ = 144', 'x² = 144', 'x = 12'] },
    { id: 'n14', s: 'num', yr: '2013', code: 'PE1', topic: 'pe', sec: 1, fmt: 'mc', ask: 'Least to greatest', stem: 'Which list goes from least to greatest?', story: true,
      opts: ['−2², −1², (−1)², (−2)²', '(−2)², (−1)², −1², −2²', '−1², (−1)², −2², (−2)²', '(−1)², −1², −2², (−2)²'], a: 0, om: true,
      cue: '−2² is −4, not 4', pic: 'order4' },
    { id: 'n15', s: 'num', yr: '2013', code: 'RN3', topic: 'rn', sec: 3, fmt: 'mc', ask: 'Emily’s bill', story: true,
      stem: 'A phone plan is ' + B('$5.00') + ' a month, plus ' + B('$0.05') + ' a text and ' + B('$0.06') + ' a minute. Emily sends ' + B(33) + ' texts and talks ' + B(47) + ' minutes.',
      opts: ['$5.11', '$6.65', '$7.82', '$9.47'], a: 3, cues: ['Multiply each rate first', 'Add the minutes too', 'Add the texts too'], cue: 'fee + texts + minutes', pic: 'phone' },
    { id: 'n16', s: 'num', yr: '2015', code: 'PE1', topic: 'pe', sec: 1, fmt: 'mc', ask: 'Another way to write it', stem: '(2/3)⁴',
      opts: ['(2 + 4)/(3 + 4)', '(2 × 4)/(3 × 4)', '(2 + 2 + 2 + 2)/(3 + 3 + 3 + 3)', '(2 × 2 × 2 × 2)/(3 × 3 × 3 × 3)'], a: 3, om: true,
      cue: 'The exponent counts the factors', steps: ['(2/3)⁴ = 2/3 × 2/3 × 2/3 × 2/3', '= (2 × 2 × 2 × 2)/(3 × 3 × 3 × 3)'] },
    { id: 'n17', s: 'num', yr: '2015', code: 'RN3', topic: 'rn', sec: 3, fmt: 'mc', ask: 'How far in all?', story: true,
      stem: 'Patrick bikes at ' + B('14.4 km/h') + ' for ' + B('¾ h') + ', then at ' + B('13.2 km/h') + ' for ' + B('⅓ h') + '.',
      opts: ['15.2 km', '15.0 km', '14.7 km', '14.3 km'], a: 0, cue: 'speed × time for each part', pic: 'trip', sp: [14.4, 13.2], tt: ['¾ h', '⅓ h'], d: [10.8, 4.4], icon: '🚲' },
    { id: 'n18', s: 'num', yr: '2015', code: 'RN5', topic: 'rn', sec: 5, fmt: 'mc', ask: 'Evaluate', stem: '6 − 1/4 ÷ 1/2 − 2³ × 0.75',
      opts: ['−1/2', '−1/8', '1/8', '1/2'], a: 0, om: true, cue: '÷ and × before −', steps: ['6 − 1/4 ÷ 1/2 − 2³ × 0.75', '= 6 − 1/2 − 8 × 0.75', '= 6 − 1/2 − 6', '= −1/2'] },

    /* Patterns and relations */
    { id: 'p1', s: 'pat', yr: '2019', code: 'LE2', topic: 'le', sec: 2, fmt: 'nr', ask: 'Solve', stem: 'x + 1 = 2x + 2', pre: 'x =', a: -1,
      miss: [[1, 'Check the sign: 1 − 2']], cue: 'Get x on one side', steps: ['x + 1 = 2x + 2', '1 − 2 = 2x − x', '−1 = x'] },
    { id: 'p2', s: 'pat', yr: '2019', code: 'LE2', topic: 'le', sec: 2, fmt: 'nr', ask: 'Solve (nearest tenth)', stem: '2(x − 2) = 4x − 13', pre: 'x =', a: 4.5,
      miss: [[5.5, 'Multiply both terms by 2'], [-4.5, '9 = 2x: x is positive']], cue: 'Expand the bracket first', steps: ['2(x − 2) = 4x − 13', '2x − 4 = 4x − 13', '9 = 2x', 'x = 4.5'] },
    { id: 'p3', s: 'pat', yr: '2019', code: 'LE3', topic: 'le', sec: 3, fmt: 'nr', ask: 'Solve', stem: '2x = −4(1/4 − 3/4x) + 4', pre: 'x =', a: -3,
      miss: [[3, '−x = 3, so x = −3']], cue: '−4 times both terms', steps: ['2x = −4(1/4 − 3/4x) + 4', '2x = −1 + 3x + 4', '2x = 3x + 3', '−x = 3', 'x = −3'] },
    { id: 'p4', s: 'pat', yr: '2019', code: 'LE3', topic: 'le', sec: 3, fmt: 'nr', ask: 'Solve', stem: 'x/3 + 7 = −2', pre: 'x =', a: -27,
      miss: [[15, '−2 − 7 = −9'], [-3, 'Multiply by 3, don’t divide'], [27, '−9 × 3 = −27']], cue: 'Subtract 7, then × 3', steps: ['x/3 + 7 = −2', 'x/3 = −9', 'x = −27'] },
    { id: 'p5', s: 'pat', yr: '2019', code: 'LE4', topic: 'le', sec: 4, fmt: 'mc', ask: 'Solve', stem: '−3x + 7 > −17',
      opts: ['x < 8', 'x > 8', 'x < −8', 'x > −8'], a: 0, om: true, cues: [null, 'Dividing by −3 flips the sign', '−24 ÷ (−3) = 8', '−24 ÷ (−3) = 8'], cue: 'Dividing by −3 flips the sign', pic: 'ineq' },
    { id: 'p6', s: 'pat', yr: '2013', code: 'LR4', topic: 'lr', sec: 4, fmt: 'nr', ask: 'One-time fee', story: true,
      stem: 'A club charges a one-time fee plus ' + B('$15') + ' a month. The total is ' + B('$135') + ' after ' + B(4) + ' months, ' + B('$165') + ' after ' + B(6) + ', and ' + B('$255') + ' after ' + B(12) + '.',
      pre: '$', a: 75, miss: [[135, 'That’s the 4-month total'], [60, 'That’s 4 months of $15'], [15, 'That’s the monthly rate']], cue: 'Total − months × $15', pic: 'member' },
    { id: 'p7', s: 'pat', yr: '2013', code: 'LE2', topic: 'le', sec: 2, fmt: 'mc', ask: 'Solve', stem: '2(x + 5) − 12 = 50',
      opts: ['24', '26', '32', '36'], a: 1, om: true, cue: 'Add 12, then ÷ 2', steps: ['2(x + 5) − 12 = 50', '2(x + 5) = 62', 'x + 5 = 31', 'x = 26'] },
    { id: 'p8', s: 'pat', yr: '2013', code: 'LE2', topic: 'le', sec: 2, fmt: 'mc', ask: 'Tara’s amount', story: true,
      stem: 'Jennifer gave ' + B('twice') + ' what Tara gave. Mindy gave ' + B('$10 less') + ' than Jennifer. Together they gave ' + B('$50') + '.',
      opts: ['$6', '$8', '$12', '$24'], a: 2, cues: ['Tara is one block', 'Add the $10 back first', null, 'That’s Jennifer’s share'], cue: 'Count the blocks: 5',
      pic: 'bars', rows: [['Tara', 1, 0], ['Jennifer', 2, 0], ['Mindy', 2, -10]], t: 12, total: 50, unit: '$' },
    { id: 'p9', s: 'pat', yr: '2013', code: 'LE2', topic: 'le', sec: 2, fmt: 'mc', ask: 'Fewer payments, Plan 2', story: true,
      stem: 'Connie buys a ' + B('$750') + ' horse. Plan 1: ' + B('$150') + ' down, then ' + B('$25') + ' a month. Plan 2: ' + B('$200') + ' down, then ' + B('$55') + ' a month.',
      opts: ['10', '14', '20', '24'], a: 1, om: true, cues: ['That’s Plan 2 alone', null, 'Take off each down payment', 'That’s Plan 1 alone'], cue: 'Payments on each plan, then subtract', pic: 'plans2' },
    { id: 'p10', s: 'pat', yr: '2013', code: 'PO5', topic: 'po', sec: 5, fmt: 'nr', ask: 'Find ■', stem: '(−12x² − 9x) ÷ ■x = −4x − 3', pre: '■ =', a: 3,
      miss: [[-3, 'Signs: −12 ÷ ■ = −4'], [4, '−12x² ÷ ■x = −4x']], cue: '−12x² ÷ ■x = −4x', steps: ['−12x² ÷ ■x = −4x', '■ = 12 ÷ 4 = 3', 'check: −9x ÷ 3x = −3'] },
    { id: 'p11', s: 'pat', yr: '2015', code: 'LE2', topic: 'le', sec: 2, fmt: 'mc', ask: 'Weeks to the goal', story: true,
      stem: 'Jennifer earns ' + B('$576') + ' a week and saves ' + B('20%') + ' of it. Her goal is ' + B('$1200') + '.',
      opts: ['10', '11', '24', '29'], a: 1, om: true, cues: ['Not enough yet: round up', null, 'Find 20% of $576 first', 'Find 20% of $576 first'], cue: 'Find 20% of $576 first', pic: 'save20' },
    { id: 'p12', s: 'pat', yr: '2015', code: 'LR3', topic: 'lr', sec: 3, fmt: 'mc', ask: 'Monthly profit', story: true,
      stem: 'Catherine sells cupcakes for ' + B('$1.50') + ' each. Each one costs ' + B('$0.30') + ' to make, and other costs are ' + B('$20') + ' a month. She sells <i>c</i> cupcakes.',
      opts: ['1.5c − (20 + 0.3c)', '20c − (1.5 + 0.3c)', '(20 + 0.3c) − 1.5c', '(1.5 + 0.3c) − 20c'], a: 0, om: true,
      cues: [null, '$20 is once, not per cupcake', 'Profit = money in − costs', '$20 is once, not per cupcake'], cue: 'Profit = money in − costs', pic: 'profit' },
    { id: 'p13', s: 'pat', yr: '2015', code: 'LE3', topic: 'le', sec: 3, fmt: 'mc', ask: 'Solve', stem: '3(2x − 1) = 1/2(x + 6)',
      opts: ['8/11', '12/11', '14/11', '18/11'], a: 1, om: true, cue: 'Expand both sides first', steps: ['3(2x − 1) = 1/2(x + 6)', '6x − 3 = 1/2x + 3', '11/2x = 6', 'x = 12/11'] },
    { id: 'p14', s: 'pat', yr: '2015', code: 'PO4', topic: 'po', sec: 4, fmt: 'mc', ask: 'Simplify', stem: '(x² − 5x + 4) − (3x² + 8x − 20)',
      opts: ['−2x² − 13x + 24', '−2x² − 3x + 16', '2x² + 13x − 24', '2x² + 3x − 16'], a: 0, om: true,
      cues: [null, 'Subtract every term in the bracket', 'x² − 3x² = −2x²', 'Subtract every term in the bracket'], cue: 'Subtract every term in the bracket',
      steps: ['(x² − 5x + 4) − (3x² + 8x − 20)', '= x² − 5x + 4 − 3x² − 8x + 20', '= −2x² − 13x + 24'] },
    { id: 'p15', s: 'pat', yr: '2015', code: 'LE1', topic: 'le', sec: 1, fmt: 'nr', ask: 'How many lawns?', story: true,
      stem: 'Dale earned ' + B('$180') + '. ' + B('$45') + ' came from washing cars. The rest came from mowing lawns at ' + B('$9') + ' each.',
      unit: 'lawns', a: 15, miss: [[135, 'That’s dollars: ÷ $9'], [20, 'Take off the $45 first'], [25, 'Subtract the $45, don’t add']], cue: '(180 − 45) ÷ 9', pic: 'dale' },
    { id: 'p16', s: 'pat', yr: '2015', code: 'LE1', topic: 'le', sec: 1, fmt: 'nr', ask: 'Fewest whole hours', story: true,
      stem: 'Patricia wants ' + B('$250') + ' skates. She has ' + B('$86') + ' and earns ' + B('$10.25') + ' an hour.',
      unit: 'hours', a: 16, miss: [[164, 'That’s dollars: ÷ $10.25'], [24.39, 'Take off the $86 first'], [24, 'Take off the $86 first'], [25, 'Take off the $86 first']], cue: '(goal − have) ÷ rate',
      pic: 'save', have: 86, goal: 250, rate: 10.25, n: 16, icon: '⛸️', each: 'hour' },
    { id: 'p17', s: 'pat', yr: '2013', code: 'PO4', topic: 'po', sec: 4, fmt: 'mc', ask: 'First error', story: true,
      stem: 'Robert and Jacob both simplify ' + B('3(x² + 4x − 1) − (2x + 5)') + '. Their steps are in the picture.',
      opts: ['Robert, Step 1', 'Jacob, Step 1', 'Robert, Step 2', 'Jacob, Step 2'], a: 1, cues: ['Robert’s Step 1 is right', null, 'Someone went wrong before that', 'Jacob’s Step 1 is already wrong'], cue: 'Check each Step 1 first', pic: 'error' },

    /* Shape and space */
    { id: 's1', s: 'ss', yr: '2013', code: 'SR1', topic: 'sr', sec: 1, fmt: 'mc', ask: 'Carpet side length', story: true,
      stem: 'A square carpet covers ' + B('37.5%') + ' of a ' + B('12 m') + ' by ' + B('8 m') + ' room.',
      opts: ['7 m', '6 m', '5 m', '4 m'], a: 1, cue: 'Area first: 37.5% of 96', pic: 'rug', L: 12, W: 8, p: 37.5, area: 36, side: 6 },
    { id: 's2', s: 'ss', yr: '2013', code: 'ME2', topic: 'me', sec: 2, fmt: 'mc', ask: 'Surface area', story: true,
      stem: B(7) + ' identical cubes make a 3-D cross: one cube with a cube on each of its ' + B(6) + ' faces. The volume is ' + B('56 cm³') + '.',
      opts: ['30 cm²', '60 cm²', '120 cm²', '144 cm²'], a: 2, cues: ['That’s faces: × 4 cm²', 'A face is 4 cm²', null, 'Each join hides 2 faces'], cue: 'Count the faces you can see',
      pic: 'cubes', shape: 'cross', V: 56 },
    { id: 's3', s: 'ss', yr: '2013', code: 'CG3', topic: 'cg', sec: 3, fmt: 'mc', ask: 'Find ∠ACB', story: true,
      stem: 'O is the centre. A, B and C are on the circle. ' + B('∠AOB + ∠ACB = 75°') + '.',
      opts: ['30°', '25°', '20°', '15°'], a: 1, cue: '∠AOB is twice ∠ACB', pic: 'angles', ins: 25, sum: 75 },
    { id: 's4', s: 'ss', yr: '2013', code: 'CG4', topic: 'cg', sec: 4, fmt: 'mc', ask: 'Nail above the gong', story: true,
      stem: 'A gong ' + B('30 cm') + ' across hangs from a nail on an ' + B('18 cm') + ' chain. Each half of the chain is tangent to the gong.',
      opts: ['2.3 cm', '2.5 cm', '12.0 cm', '17.5 cm'], a: 1, cues: ['√306 ≈ 17.49, then − 15', null, 'Use the 15 cm radius', 'That’s nail to centre: − 15'], cue: 'Radius ⟂ tangent: a right triangle', pic: 'gong' },
    { id: 's5', s: 'ss', yr: '2015', code: 'ME2', topic: 'me', sec: 2, fmt: 'mc', ask: 'Surface area', story: true,
      stem: B(7) + ' cubes of ' + B('8 cm³') + ' each make an L: a row of ' + B(4) + ', with ' + B(3) + ' more stacked on the end cube.',
      opts: ['120 cm²', '100 cm²', '88 cm²', '72 cm²'], a: 0, cue: 'Count the faces you can see', pic: 'cubes', shape: 'L', V: 56 },
    { id: 's6', s: 'ss', yr: '2015', code: 'SI4', topic: 'si', sec: 4, fmt: 'nr', ask: 'Small sail height', story: true,
      stem: 'A sail is enlarged by a scale factor of ' + B('2.50') + '. The large sail is ' + B('280 cm') + ' tall.',
      unit: 'cm', a: 112, miss: [[700, 'Smaller sail: divide'], [277.5, 'Scale factor multiplies'], [282.5, 'Scale factor multiplies']], cue: '280 ÷ 2.5', pic: 'sail' },
    { id: 's7', s: 'ss', yr: '2015', code: 'SI2', topic: 'si', sec: 2, fmt: 'mc', ask: 'Length of BC', story: true,
      stem: '△ABC ~ △DEF. ' + B('AC = 18') + ', ' + B('BC = 2<i>y</i> + 5') + ', ' + B('DF = 6') + ', ' + B('EF = <i>y</i>') + '.',
      opts: ['11', '13', '15', '17'], a: 2, om: true, cue: 'Scale factor: 18 ÷ 6', pic: 'similar' },

    /* Statistics and probability */
    { id: 't1', s: 'sp', yr: '2013', code: 'PR1', topic: 'pr', sec: 1, fmt: 'mc', ask: 'His choice is based on', story: true,
      stem: 'A student picks the red envelope because red is his favourite colour.',
      opts: ['subjective judgment', 'theoretical probability', 'experimental probability', 'a calculation'], a: 0, cue: 'A feeling, not a calculation', pic: 'envelope' },
    { id: 't2', s: 'sp', yr: '2013', code: 'ST1', topic: 'st', sec: 1, fmt: 'mc', ask: 'Why is Nina wrong?', story: true,
      stem: 'Nina finds ' + B(6) + ' of the ' + B(10) + ' girls in her class are under 160 cm. She predicts ' + B(246) + ' of the ' + B(410) + ' students in her school are.',
      opts: ['Her sample is only girls', 'Her math is wrong', 'She used no questionnaire', 'She surveyed too quickly'], a: 0,
      cues: [null, '6/10 of 410 is 246', 'Who is in her sample?', 'Who is in her sample?'], cue: 'Who is in her sample?', pic: 'nina' },
    { id: 't3', s: 'sp', yr: '2013', code: 'ST1', topic: 'st', sec: 1, fmt: 'mc', ask: 'The bias', story: true,
      stem: 'A school is choosing a new mascot. It surveys ' + B(120) + ' of its ' + B(250) + ' Grade 10 students.',
      opts: ['The question is confusing', 'The survey takes too long', 'Grade 10s don’t represent the school', 'Cultural beliefs are ignored'], a: 2, cue: 'Who is the mascot for?', pic: 'mascot' },
    { id: 't4', s: 'sp', yr: '2013', code: 'ST1', topic: 'st', sec: 1, fmt: 'mc', ask: 'Least biased sample', story: true,
      stem: 'Ethan surveys his town about building a new skating rink.',
      opts: ['People of different ages', 'People in different cities', 'Only figure skaters', 'People at the rink each day'], a: 0,
      cues: [null, 'The rink is for his town', 'Not just people who skate', 'Not just people who skate'], cue: 'Who would use the rink?', pic: 'rink' },
    { id: 't5', s: 'sp', yr: '2015', code: 'PR1', topic: 'pr', sec: 1, fmt: 'mc', ask: 'His assumption', story: true,
      stem: 'A manager tests ' + B(25) + ' of ' + B(750) + ' watches and finds ' + B(3) + ' faulty. He says ' + B('12%') + ' of all the watches are faulty.',
      opts: ['The testing was unreliable', 'Parts are rarely faulty', 'The sample is like all 750', 'One worker made them all'], a: 2, cue: 'He used 3/25 for all 750',
      pic: 'predict', n: 25, h: 3, m: 30, N: 750, icon: '⌚', hit: 'bad' }
  ];
  BANK.forEach(it => { it.src = it.yr + ' PAT'; });

  /* ---------- generated items (PAT style) ---------- */
  function gExp() {
    for (;;) {
      const b = rnd(2, 5), m1 = rnd(2, 4), m2 = rnd(2, 3), d = rnd(1, 3), e = m1 * m2 - d, v = Math.pow(b, e);
      if (v > 10000) continue;
      const st = '(' + b + SUP(m1) + ')' + SUP(m2) + ' ÷ ' + b + (d === 1 ? '' : SUP(d));
      return { id: 'g:exp', s: 'num', code: 'PE5', topic: 'pe', sec: 5, fmt: 'nr', ask: 'Simplify, then evaluate', stem: st, a: v,
        miss: [[Math.pow(b, m1 + m2 - d), 'Power of a power: multiply']], cue: 'Power of a power: multiply',
        steps: [st, '= ' + b + SUP(m1 * m2) + ' ÷ ' + b + SUP(d), '= ' + b + SUP(e), '= ' + v] };
    }
  }
  function gBed() {
    const a = rnd(2, 8), b = rnd(2, 5), c = rnd(2, 4), d = rnd(2, 4), p = Math.pow(c, d), v = a + b * p;
    const st = a + ' + ' + b + ' × ' + c + SUP(d);
    return { id: 'g:bed', s: 'num', code: 'RN5', topic: 'rn', sec: 5, fmt: 'nr', ask: 'Evaluate', stem: st, a: v,
      miss: [[(a + b) * p, 'Multiply before you add'], [a + Math.pow(b * c, d), 'The exponent is on ' + c + ' only'], [a + b * c * d, c + SUP(d) + ' is not ' + c + ' × ' + d]], cue: 'Exponent, then ×, then +',
      steps: [st, '= ' + a + ' + ' + b + ' × ' + p, '= ' + a + ' + ' + b * p, '= ' + v] };
  }
  function gSq() {
    for (;;) {
      const lo = rnd(10, 80), hi = rnd(lo + 30, 200), sq = x => Number.isInteger(Math.sqrt(x));
      if (sq(lo) || sq(hi)) continue;
      const first = Math.floor(Math.sqrt(lo)) + 1, last = Math.floor(Math.sqrt(hi)), n = last - first + 1;
      return { id: 'g:sq', s: 'num', code: 'SR1', topic: 'sr', sec: 1, fmt: 'nr', ask: 'How many?', story: true,
        stem: 'How many whole numbers between ' + B(lo) + ' and ' + B(hi) + ' are perfect squares?', a: n, unit: 'squares',
        miss: [[n + 1, 'Check the ends: ' + lo + ' and ' + hi]], cue: 'List the squares from ' + first + '²', pic: 'squares', lo, hi };
    }
  }
  function gEq() {
    for (;;) {
      const x = rnd(-8, 8), a = rnd(2, 5), c = rnd(2, 5), b = rnd(-10, 10);
      if (a === c || b === 0) continue;
      const d = (a - c) * x + b; if (d === 0) continue;
      const st = a + 'x ' + sgn(b) + ' = ' + c + 'x ' + sgn(d);
      return { id: 'g:eq', s: 'pat', code: 'LE2', topic: 'le', sec: 2, fmt: 'nr', ask: 'Solve', stem: st, pre: 'x =', a: x,
        miss: [[-x, 'Check the signs'], [(d + b) / (a - c), 'Subtract ' + b + ' from both sides']], cue: 'x terms left, numbers right',
        steps: [st, (a - c) + 'x = ' + (d - b), 'x = ' + x] };
    }
  }
  /* two plans: A has the bigger fee and the smaller rate */
  const PLANS = [['Company A', 'Company B', 'a load', 'loads'], ['Gym A', 'Gym B', 'a visit', 'visits'], ['Rental A', 'Rental B', 'a day', 'days']];
  function gPlans() {
    const c = pick(PLANS), n = rnd(4, 20), r1 = rnd(5, 20), r2 = r1 + rnd(2, 12), b2 = rnd(5, 20) * 5, b1 = b2 + (r2 - r1) * n;
    return { id: 'g:plans', s: 'pat', code: 'LE2', topic: 'le', sec: 2, fmt: 'nr', ask: 'Same cost at', story: true,
      stem: c[0] + ' charges ' + B('$' + b1) + ' plus ' + B('$' + r1) + ' ' + c[2] + '. ' + c[1] + ' charges ' + B('$' + b2) + ' plus ' + B('$' + r2) + ' ' + c[2] + '.',
      a: n, unit: c[3], miss: [[b1 - b2, 'Now ÷ the rate gap'], [r2 - r1, 'Fee gap ÷ rate gap'], [b1 + r1 * n, 'That’s the cost: find n']], cue: 'Fee gap ÷ rate gap',
      pic: 'lines', b1, b2, r1, r2, n, names: c };
  }
  const BUYS = [['bike', '🚲'], ['guitar', '🎸'], ['tent', '⛺'], ['game console', '🎮'], ['set of headphones', '🎧'], ['pair of skates', '⛸️']];
  const NAMES = ['Maya', 'Liam', 'Aiyana', 'Noah', 'Priya', 'Owen', 'Sofia', 'Kai', 'Amara', 'Ethan', 'Zoe', 'Jonah'];
  function gHours() {
    for (;;) {
      const rate = pick([10, 12, 15, 16, 18, 20]), goal = rnd(20, 60) * 10, have = rnd(2, 12) * 5, need = goal - have, n = Math.ceil(need / rate);
      if (n < 4 || n > 30 || (need % rate === 0 && chance(.8))) continue;
      const [thing, icon] = pick(BUYS), who = pick(NAMES);
      return { id: 'g:hours', s: 'pat', code: 'LE1', topic: 'le', sec: 1, fmt: 'nr', ask: 'Fewest whole hours', story: true,
        stem: who + ' wants a ' + B('$' + goal) + ' ' + thing + '. ' + who + ' has ' + B('$' + have) + ' and earns ' + B('$' + rate) + ' an hour.',
        a: n, unit: 'hours', miss: [[Math.floor(need / rate), 'Not enough yet: round up'], [r2(need / rate), 'Whole hours: round up'], [Math.ceil(goal / rate), 'Take off the $' + have + ' first'], [need, 'That’s dollars: ÷ $' + rate]],
        cue: 'Take off what you have, round up', pic: 'save', have, goal, rate, n, icon, each: 'hour' };
    }
  }
  function gAge() {
    const mia = rnd(5, 15), n = rnd(2, 10), sum = 3 * mia + 2 * n, pair = pick([['Jordan', 'Mia'], ['Ravi', 'Asha'], ['Leo', 'Nora']]);
    return { id: 'g:age', s: 'pat', code: 'LE2', topic: 'le', sec: 2, fmt: 'nr', ask: pair[1] + '’s age now', story: true,
      stem: pair[0] + ' is ' + B('twice') + ' as old as ' + pair[1] + '. In ' + B(n) + ' years, their ages will add to ' + B(sum) + '.',
      a: mia, unit: 'years', miss: [[mia + n, 'That’s her age in ' + n + ' years'], [2 * mia, 'That’s ' + pair[0] + '’s age'], [r2((sum - n) / 3), 'Both of them age ' + n + ' years'], [r2(sum / 3), 'Take off the ' + 2 * n + ' years first']],
      cue: '3 blocks + ' + 2 * n + ' = ' + sum, pic: 'bars', rows: [[pair[1], 1, n], [pair[0], 2, n]], t: mia, total: sum, unit: '' };
  }
  function gGarden() {
    const w = rnd(4, 20), x = rnd(2, 15), P = 2 * (2 * w + x);
    return { id: 'g:garden', s: 'pat', code: 'LE2', topic: 'le', sec: 2, fmt: 'nr', ask: 'Width of the garden', story: true,
      stem: 'A rectangular garden has a perimeter of ' + B(P + ' m') + '. Its length is ' + B(x + ' m') + ' more than its width.',
      a: w, unit: 'm', miss: [[w + x, 'That’s the length'], [r2((P - x) / 4), 'Two lengths: take off 2 × ' + x], [r2(P / 4), 'Take off the extra first'], [r2((P - x) / 2), 'Four sides, not two']],
      cue: '2 widths + 2 lengths = ' + P, pic: 'garden', w, x, P };
  }
  function gTix() {
    const sp = rnd(5, 10), ap = sp + rnd(3, 10), st = rnd(20, 80), ad = rnd(10, 40), T = sp * st + ap * ad;
    return { id: 'g:tix', s: 'pat', code: 'LE1', topic: 'le', sec: 1, fmt: 'nr', ask: 'Student tickets sold', story: true,
      stem: 'Play tickets cost ' + B('$' + sp) + ' for students and ' + B('$' + ap) + ' for adults. ' + B(ad) + ' adult tickets sold, and sales were ' + B('$' + T) + ' in all.',
      a: st, unit: 'tickets', miss: [[T - ap * ad, 'That’s dollars: ÷ $' + sp], [r2(T / sp), 'Take off the adult sales first']], cue: '(total − adult sales) ÷ ' + sp,
      pic: 'tix', sp, ap, st, ad, T };
  }
  function gInsc() {
    const ins = rnd(15, 80), mode = pick(['toIns', 'toCen']), ctx = pick(['track', 'window']);
    const st = ctx === 'track'
      ? (mode === 'toIns' ? 'A round track has centre O. Lines from O to A and B on the track make ' + B('∠AOB = ' + 2 * ins + '°') + '. A coach stands at C on the track.'
        : 'A coach stands at C on a round track with centre O. The coach sees A and B on the track at ' + B('∠ACB = ' + ins + '°') + '.')
      : (mode === 'toIns' ? 'A round window has centre O. Two spokes from O to A and B on the rim make ' + B('∠AOB = ' + 2 * ins + '°') + '. C is on the rim.'
        : 'A round window has centre O. From C on the rim, A and B on the rim make ' + B('∠ACB = ' + ins + '°') + '.');
    return { id: 'g:insc', s: 'ss', code: 'CG3', topic: 'cg', sec: 3, fmt: 'nr', ask: mode === 'toIns' ? 'Find ∠ACB' : 'Find ∠AOB', story: true, stem: st,
      a: mode === 'toIns' ? ins : 2 * ins, unit: '°', miss: mode === 'toIns' ? [[4 * ins, 'Inscribed is half of central'], [2 * ins, 'Inscribed is half of central']] : [[ins / 2, 'Central is twice inscribed'], [ins, 'Central is twice inscribed']],
      cue: 'Central = 2 × inscribed', pic: 'angles', ins, mode, ctx };
  }
  function gScale() {
    const sf = rnd(2, 5), o = rnd(10, 50), big = o * sf, mode = pick(['sf', 'orig']);
    return mode === 'sf'
      ? { id: 'g:scale', s: 'ss', code: 'SI4', topic: 'si', sec: 4, fmt: 'nr', ask: 'Scale factor', story: true,
        stem: 'A model of a building is ' + B(o + ' cm') + ' tall. The real building is ' + B(big + ' cm') + ' tall.', a: sf,
        miss: [[r2(o / big), 'Real ÷ model'], [big - o, 'A scale factor multiplies']], cue: 'real height ÷ model height', pic: 'scale', mode, o, big, sf }
      : { id: 'g:scale', s: 'ss', code: 'SI4', topic: 'si', sec: 4, fmt: 'nr', ask: 'Photo height', story: true,
        stem: 'A photo is enlarged by a scale factor of ' + B(sf) + ' to make a poster ' + B(big + ' cm') + ' tall.', a: o, unit: 'cm',
        miss: [[big * sf, 'The photo is smaller: divide'], [big - sf, 'A scale factor multiplies']], cue: 'poster ÷ scale factor', pic: 'scale', mode, o, big, sf };
  }
  const PRED = [
    { id: 'watch', icon: '⌚', hit: 'bad', s: (n, h) => 'A worker tests ' + B(n) + ' watches and finds ' + B(h) + ' faulty.', w: N => 'About how many of ' + B(N) + ' watches are faulty?' },
    { id: 'walk', icon: '🚶', hit: 'good', s: (n, h) => 'In a survey, ' + B(h) + ' of ' + B(n) + ' students walk to school.', w: N => 'About how many of the ' + B(N) + ' students walk?' },
    { id: 'seed', icon: '🌱', hit: 'good', s: (n, h) => 'Of ' + B(n) + ' seeds planted, ' + B(h) + ' sprouted.', w: N => 'How many of ' + B(N) + ' seeds should sprout?' }
  ];
  function gPred() {
    for (;;) {
      const n = pick([10, 20, 25, 40, 50]), h = rnd(1, n - 1), m = rnd(4, 40), c = pick(PRED);
      if (h * 2 > n && c.id === 'watch') continue;
      return { id: 'g:pred', s: 'sp', code: 'PR1', topic: 'pr', sec: 1, fmt: 'nr', ask: 'Predict', story: true, stem: c.s(n, h) + ' ' + c.w(n * m),
        a: h * m, miss: [[r2(h / n * 100), 'That’s the percent: of ' + n * m + '?'], [h, 'Scale up to ' + n * m]], tol: .5, cue: h + '/' + n + ' of ' + n * m,
        pic: 'predict', n, h, m, N: n * m, icon: c.icon, hit: c.hit, ctx: c.id };
    }
  }
  /* a fair sample: random students from every grade, against three narrow groups */
  const TOPICS = ['a new lunch menu', 'the school start time', 'a theme for the dance', 'where to go on a field trip', 'a name for the school team', 'new games for the gym'];
  const NARROW = [['g9', 'Only the Grade 9s'], ['team', 'Only the basketball team'], ['band', 'Only students in the band'], ['friends', 'Only your friends'], ['lib', 'Students in the library at lunch'], ['class', 'Only your own class']];
  function gBias() {
    const topic = pick(TOPICS), wrong = shuffle(NARROW).slice(0, 3), all = shuffle([['fair', 'Random students from every grade']].concat(wrong));
    return { id: 'g:bias', s: 'sp', code: 'ST1', topic: 'st', sec: 1, fmt: 'mc', ask: 'Best sample', story: true,
      stem: 'A Grade 7–9 school wants to know what students think about ' + B(topic) + '.',
      opts: all.map(o => o[1]), groups: all.map(o => o[0]), a: all.findIndex(o => o[0] === 'fair'), cue: 'Every student needs a chance', pic: 'bias' };
  }
  // A generated mistake can land on the right answer (x = 0, say): drop it.
  const clean = f => () => { const it = f(); if (it.miss) it.miss = it.miss.filter(m => !near(m[0], it.a, it.tol)); return it; };
  const GENS = { num: [gExp, gBed, gSq], pat: [gEq, gPlans, gHours, gAge, gGarden, gTix], ss: [gInsc, gScale], sp: [gPred, gBias] };
  for (const k in GENS) GENS[k] = GENS[k].map(clean);

  /* ---------- checking ---------- */
  function check(it, r) {
    if (it.fmt === 'mc') {
      const i = LET.indexOf(String(r.v)); if (i === it.a) return { ok: true };
      return { code: 'o' + i, cue: (it.cues && it.cues[i]) || it.cue };
    }
    const g = Q.val(r.v), tol = it.tol || .001;
    if (near(g, it.a, tol)) return { ok: true };
    const m = (it.miss || []).find(x => near(g, x[0], tol));
    return m ? { code: 'm' + it.miss.indexOf(m), cue: m[1] } : { code: 'other', cue: it.cue };
  }
  const answer = it => ({ v: it.fmt === 'mc' ? LET[it.a] : String(it.a) });

  return { BANK, GENS, LET, check, answer, near, money, r2, SUP };
})();
/* ===================== MODEL END ===================== */
