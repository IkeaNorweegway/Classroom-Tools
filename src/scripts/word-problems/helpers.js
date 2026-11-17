// Shared helpers for word-problem generators.

export const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const pick = arr => arr[randInt(0, arr.length - 1)];
export const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = randInt(0, i); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

/** Round to d decimal places and strip float noise. */
export const round = (x, d = 2) => {
  const f = 10 ** d;
  return Math.round((x + Number.EPSILON) * f) / f;
};

/** Format a number for display: thousands separators, up to d decimals, real minus sign. */
export const fmt = (x, d = 2) => {
  const r = round(x, d);
  const s = Math.abs(r).toLocaleString('en-CA', { maximumFractionDigits: d });
  return (r < 0 ? '−' : '') + s;
};

/** Money: always two decimals. */
export const money = x => {
  const r = round(x, 2);
  return (r < 0 ? '−$' : '$') + Math.abs(r).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };

/** Simplified fraction string, e.g. frac(6, 8) → "3/4". */
export const frac = (n, d) => {
  const g = gcd(n, d);
  n /= g; d /= g;
  if (d < 0) { n = -n; d = -d; }
  return d === 1 ? `${n}` : `${n}/${d}`;
};

/** Mixed number string from a numerator over a denominator, e.g. mixed(11, 8) → "1 3/8". */
export const mixed = (n, d) => {
  const g = gcd(n, d);
  n /= g; d /= g;
  const sign = n < 0 ? '−' : '';
  n = Math.abs(n);
  const w = Math.floor(n / d), r = n % d;
  if (r === 0) return `${sign}${w}`;
  return w === 0 ? `${sign}${r}/${d}` : `${sign}${w} ${r}/${d}`;
};

/** Signed term for building expressions: term(3,'x') → "+ 3x", term(-1,'x') → "− x". */
const coefStr = (c, v) => {
  const a = Math.abs(c);
  if (v === '') return `${a}`;
  return (a === 1 ? '' : `${a}`) + v;
};

/** Polynomial to string from {2: a, 1: b, 0: c}. */
export const polyStr = p => {
  const parts = [];
  for (const deg of [2, 1, 0]) {
    const c = p[deg] || 0;
    if (c === 0) continue;
    const v = deg === 2 ? 'x²' : deg === 1 ? 'x' : '';
    const body = coefStr(c, v);
    if (parts.length === 0) parts.push((c < 0 ? '−' : '') + body);
    else parts.push((c < 0 ? '− ' : '+ ') + body);
  }
  return parts.length ? parts.join(' ') : '0';
};

/** Binomial like (2x + 3) or (x − 4). */
export const binom = (a, b) => `(${polyStr({ 1: a, 0: b })})`;

/** Signed number in an expression, e.g. signed(-3) → "(−3)". */
export const paren = x => (x < 0 ? `(${fmt(x)})` : fmt(x));

/** Build a problem object. ans = number | {poly} ; display = answer text. */
export const P = ({ q, num, poly, display, unit = '', tol, steps, hint, prob = false }) =>
  ({ q, num, poly, display, unit, tol, steps, hint, prob });

export const PI = Math.PI;

/** Tolerance for answers that depend on π or rounded intermediate values (allows 3.14 and rounding). */
export const piTol = v => Math.max(0.06, Math.abs(v) * 0.003);
