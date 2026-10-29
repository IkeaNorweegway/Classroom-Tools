const DEBUG = /[?&]debug=1/.test(location.search);

/* ===== DRILL KIT START (no DOM): exact fractions and seeded random ===== */
const Q = (() => {
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
  const q = (n, d) => { d = d == null ? 1 : d; if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g, d: d / g }; };
  const of = v => typeof v === 'number' ? (Number.isInteger(v) ? q(v) : dec(String(v))) : v;
  const add = (a, b) => { a = of(a); b = of(b); return q(a.n * b.d + b.n * a.d, a.d * b.d); };
  const sub = (a, b) => { a = of(a); b = of(b); return q(a.n * b.d - b.n * a.d, a.d * b.d); };
  const mul = (a, b) => { a = of(a); b = of(b); return q(a.n * b.n, a.d * b.d); };
  const div = (a, b) => { a = of(a); b = of(b); return q(a.n * b.d, a.d * b.n); };
  const neg = a => { a = of(a); return q(-a.n, a.d); };
  const eq = (a, b) => { if (a == null || b == null) return false; a = of(a); b = of(b); return a.n === b.n && a.d === b.d; };
  const val = a => { a = of(a); return a.n / a.d; };
  const isInt = a => of(a).d === 1;
  function dec(s) { const m = /^(-?)(\d*)\.?(\d*)$/.exec(s); if (!m) return null; const f = m[3] || ''; return q((m[1] ? -1 : 1) * parseInt((m[2] || '0') + f, 10), Math.pow(10, f.length)); }
  // Text a student typed -> fraction, '' for blank, or null if it is not a number.
  function parse(s) {
    s = String(s == null ? '' : s).replace(/[−–—]/g, '-').replace(/\s+/g, '').replace(/^\+/, '');
    if (s === '') return '';
    if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, '');
    if (/^-?\d+(\.\d+)?$/.test(s) || /^-?\d*\.\d+$/.test(s)) return dec(s);
    const m = /^(-?)\(?(-?\d+)\)?\/\(?(-?\d+)\)?$/.exec(s);
    if (m) { const d = parseInt(m[3], 10); if (d === 0) return null; return q((m[1] ? -1 : 1) * parseInt(m[2], 10), d); }
    return null;
  }
  const str = a => { a = of(a); return (a.n < 0 ? '−' : '') + (a.d === 1 ? Math.abs(a.n) : Math.abs(a.n) + '/' + a.d); };
  let rand = Math.random;
  function seed(n) { let a = n >>> 0; rand = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const rnd = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
  const pick = arr => arr[rnd(0, arr.length - 1)];
  const nz = (lo, hi) => { let k; do { k = rnd(lo, hi); } while (k === 0); return k; };
  const chance = p => rand() < p;
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  return { gcd, lcm, q, of, add, sub, mul, div, neg, eq, val, isInt, parse, str, seed, rnd, pick, nz, chance, shuffle };
})();
/* ===== DRILL KIT END ===== */

