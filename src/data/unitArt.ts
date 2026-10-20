// Spot illustrations for unit, strand and grade cards on the course pages.
// Each is drawn on a 64px grid in two tones of the course accent:
//   .u-s  outline (accent ink)   .u-f  light fill   .u-d  solid accent dot
// The group marked .u-m (and .u-m2) carries the hover motion named by `m`;
// motions are defined in global.css under "Unit art".
//
// Keys are unit slugs (Math 9: strand and topic slugs), which are unique
// across courses.

export type ArtMotion =
  | 'float' | 'push' | 'spin' | 'slide' | 'tilt' | 'tilt-r' | 'pulse'
  | 'orbit' | 'sway' | 'grow' | 'drop' | 'drive' | 'drift';

export interface UnitArt {
  m: ArtMotion;
  svg: string;
}

export const unitArt: Record<string, UnitArt> = {
  // ── Grade 6 Science ──────────────────────────────────────────────────
  matter: {
    m: 'float',
    svg: `<path class="u-s u-f" d="M26 10v15L15 47a5 5 0 0 0 4.5 7h25a5 5 0 0 0 4.5-7L38 25V10"/>
      <path class="u-s" d="M22.5 10h19M19 40h26" />
      <g class="u-m"><circle class="u-d" cx="27" cy="46" r="3.2"/><circle class="u-d" cx="36.5" cy="43.5" r="2.6"/><circle class="u-d" cx="33" cy="50" r="2.2"/><circle class="u-d" cx="31" cy="33" r="1.8"/></g>`,
  },
  forces: {
    m: 'push',
    svg: `<path class="u-s" d="M8 52h50"/>
      <rect class="u-s u-f" x="27" y="28" width="22" height="24" rx="3"/>
      <path class="u-s" d="M33 36h10" opacity=".5"/>
      <g class="u-m"><path class="u-s" d="M6 40h14M15 34.5l5.5 5.5-5.5 5.5"/></g>`,
  },
  'living-systems': {
    m: 'spin',
    svg: `<g class="u-m" style="transform-origin: 46px 18px"><circle class="u-d" cx="46" cy="18" r="5"/><path class="u-s" d="M46 7v3M46 26v3M35 18h3M54 18h3M38.2 10.2l2.1 2.1M51.7 23.7l2.1 2.1M38.2 25.8l2.1-2.1M51.7 12.3l2.1-2.1"/></g>
      <path class="u-s u-f" d="M12 54c0-17 10-27 27-27 0 17-10 27-27 27z"/>
      <path class="u-s" d="M12 54l15-15M20 46h8M26 40v-7"/>`,
  },
  climate: {
    m: 'drift',
    svg: `<rect class="u-s u-f" x="12" y="10" width="9" height="32" rx="4.5"/>
      <circle class="u-s u-f" cx="16.5" cy="47" r="7"/>
      <circle class="u-d" cx="16.5" cy="47" r="3.6"/>
      <path class="u-s" d="M16.5 46V22" style="stroke-width: 3"/>
      <g class="u-m"><path class="u-s u-f" d="M31 42h20a7 7 0 0 0 1-13.9 10 10 0 0 0-19.3-2.6A8 8 0 0 0 31 42z"/><path class="u-s" d="M36 48l-2 4M44 48l-2 4" opacity=".6"/></g>`,
  },
  'energy-resources': {
    m: 'spin',
    svg: `<path class="u-s" d="M16 56h32"/>
      <path class="u-s u-f" d="M30 31l-2.5 25h9L34 31z"/>
      <g class="u-m" style="transform-origin: 32px 27px">
        <path class="u-s u-f" d="M32 27c-2.4-6-2.4-13 0-19 2.4 6 2.4 13 0 19z"/>
        <path class="u-s u-f" d="M32 27c-2.4-6-2.4-13 0-19 2.4 6 2.4 13 0 19z" transform="rotate(120 32 27)"/>
        <path class="u-s u-f" d="M32 27c-2.4-6-2.4-13 0-19 2.4 6 2.4 13 0 19z" transform="rotate(240 32 27)"/>
        <circle class="u-d" cx="32" cy="27" r="2.6"/>
      </g>`,
  },
  space: {
    m: 'orbit',
    svg: `<circle class="u-d" cx="12" cy="14" r="1.3"/><circle class="u-d" cx="54" cy="50" r="1.3"/><circle class="u-d" cx="10" cy="48" r="1"/>
      <circle class="u-s u-f" cx="30" cy="35" r="12"/>
      <path class="u-s" d="M24 30.5c3-1.5 8-1.5 11 1" opacity=".5"/>
      <ellipse class="u-s" cx="30" cy="35" rx="21" ry="6.5" transform="rotate(-16 30 35)"/>
      <g class="u-m" style="transform-origin: 30px 35px"><circle class="u-d" cx="51" cy="15" r="3.6"/></g>`,
  },

  // ── Math 9 strands ───────────────────────────────────────────────────
  number: {
    m: 'slide',
    svg: `<path class="u-s" d="M14 22l4 4 6-14h24"/>
      <rect class="u-s u-f" x="29" y="15.5" width="9" height="9" rx="1.8"/>
      <path class="u-s" d="M8 46h48M14 42v8M24 42v8M34 42v8M44 42v8M54 42v8"/>
      <g class="u-m"><path class="u-d" d="M24 38.5l-4.2-6h8.4z"/></g>`,
  },
  algebra: {
    m: 'tilt',
    svg: `<path class="u-s" d="M14 52V12M14 52h40M10.5 16l3.5-4 3.5 4M50 48.5l4 3.5-4 3.5"/>
      <path class="u-s" d="M22 52v-2M30 52v-2M38 52v-2M46 52v-2" opacity=".5"/>
      <g class="u-m" style="transform-origin: 14px 46px"><path class="u-s" d="M14 46L50 20" style="stroke-width: 2.8"/><circle class="u-d" cx="32" cy="33" r="3.2"/></g>`,
  },
  'measurement-geometry': {
    m: 'spin',
    svg: `<circle class="u-s u-f" cx="30" cy="34" r="19"/>
      <path class="u-s" d="M13 44h34" opacity=".55"/>
      <path class="u-s" d="M49 16v17" opacity=".55"/>
      <g class="u-m" style="transform-origin: 30px 34px"><path class="u-s" d="M30 34L44.5 21.5"/><circle class="u-d" cx="44.5" cy="21.5" r="3"/></g>
      <circle class="u-d" cx="30" cy="34" r="2.4"/>`,
  },
  'statistics-probability': {
    m: 'tilt-r',
    svg: `<path class="u-s" d="M10 54V14M10 54h32"/>
      <path class="u-s" d="M14 49L38 25" style="stroke-dasharray: 3 4" opacity=".6"/>
      <circle class="u-d" cx="16" cy="45" r="2.3"/><circle class="u-d" cx="22" cy="40" r="2.3"/><circle class="u-d" cx="26" cy="43" r="2.3"/><circle class="u-d" cx="30" cy="33" r="2.3"/><circle class="u-d" cx="36" cy="29" r="2.3"/>
      <g class="u-m" style="transform-origin: 51px 43px"><rect class="u-s u-f" x="43" y="35" width="16" height="16" rx="3.5"/><circle class="u-d" cx="47.5" cy="39.5" r="1.5"/><circle class="u-d" cx="51" cy="43" r="1.5"/><circle class="u-d" cx="54.5" cy="46.5" r="1.5"/></g>`,
  },

  // ── Math 9 topics ────────────────────────────────────────────────────
  'rational-numbers': {
    m: 'drop',
    svg: `<rect class="u-f" x="12" y="12" width="30" height="12"/>
      <rect class="u-s" x="12" y="12" width="40" height="12" rx="2"/>
      <path class="u-s" d="M22 12v12M32 12v12M42 12v12"/>
      <path class="u-s" d="M42 27v5" style="stroke-dasharray: 2 3" opacity=".5"/>
      <path class="u-s" d="M6 48h52M12 44v8M22 44v8M32 44v8M42 44v8M52 44v8"/>
      <g class="u-m"><path class="u-d" d="M42 42l-4.2-6h8.4z"/></g>`,
  },
  'powers-exponents': {
    m: 'grow',
    svg: `<path class="u-s" d="M6 54h52"/>
      <g class="u-m" style="transform-origin: 32px 54px">
        <rect class="u-s u-f" x="8" y="49" width="8" height="5" rx="1.5"/>
        <rect class="u-s u-f" x="20" y="44" width="8" height="10" rx="1.5"/>
        <rect class="u-s u-f" x="32" y="34" width="8" height="20" rx="1.5"/>
        <rect class="u-s u-f" x="44" y="14" width="8" height="40" rx="1.5"/>
        <circle class="u-d" cx="48" cy="9" r="2.6"/>
      </g>
      <path class="u-s" d="M12 44c12-2 22-8 30-26" style="stroke-dasharray: 3 4" opacity=".6"/>`,
  },
  'square-roots': {
    m: 'pulse',
    svg: `<g class="u-m" style="transform-origin: 27px 29px">
        <rect class="u-s u-f" x="12" y="14" width="30" height="30" rx="2"/>
        <path class="u-s" d="M22 14v30M32 14v30M12 24h30M12 34h30" opacity=".5"/>
      </g>
      <path class="u-s" d="M12 50v3h30v-3"/>
      <circle class="u-d" cx="27" cy="53" r="2.6"/>
      <path class="u-s" d="M50 14v30" opacity=".55"/>
      <circle class="u-d" cx="50" cy="14" r="2.2"/><circle class="u-d" cx="50" cy="44" r="2.2"/>`,
  },
  'linear-relations': {
    m: 'tilt',
    svg: `<rect class="u-s u-f" x="6" y="14" width="20" height="36" rx="2"/>
      <path class="u-s" d="M16 14v36M6 23h20"/>
      <path class="u-s" d="M9 32h4M19 32h4M9 41h4M19 41h4" opacity=".6"/>
      <g class="u-m" style="transform-origin: 34px 50px">
        <path class="u-s" d="M34 50h8v-8h8v-8h8v-8" style="stroke-dasharray: 2 3" opacity=".5"/>
        <path class="u-s" d="M32 52L58 26"/>
        <circle class="u-d" cx="34" cy="50" r="2.4"/><circle class="u-d" cx="42" cy="42" r="2.4"/><circle class="u-d" cx="50" cy="34" r="2.4"/><circle class="u-d" cx="58" cy="26" r="2.4"/>
      </g>`,
  },
  'linear-equations': {
    m: 'sway',
    svg: `<path class="u-s" d="M32 22v30M22 54h20"/>
      <g class="u-m" style="transform-origin: 32px 22px">
        <path class="u-s" d="M10 22h44"/>
        <path class="u-s" d="M12 22L5 36M12 22l7 14M52 22l-7 14M52 22l7 14" opacity=".6"/>
        <path class="u-s u-f" d="M4 36h16a8 4 0 0 1-16 0z"/>
        <path class="u-s u-f" d="M44 36h16a8 4 0 0 1-16 0z"/>
        <rect class="u-d" x="9" y="30" width="6" height="6" rx="1"/>
        <circle class="u-d" cx="49.5" cy="34" r="2"/><circle class="u-d" cx="54.5" cy="34" r="2"/>
      </g>
      <circle class="u-d" cx="32" cy="22" r="2.6"/>`,
  },
  polynomials: {
    m: 'drop',
    svg: `<rect class="u-s u-f" x="8" y="10" width="24" height="24" rx="2"/>
      <rect class="u-s u-f" x="36" y="10" width="8" height="24" rx="2"/>
      <rect class="u-s u-f" x="48" y="10" width="8" height="24" rx="2"/>
      <g class="u-m">
        <rect class="u-d" x="8" y="40" width="8" height="8" rx="1.5"/>
        <rect class="u-d" x="20" y="40" width="8" height="8" rx="1.5"/>
        <rect class="u-d" x="32" y="40" width="8" height="8" rx="1.5"/>
      </g>`,
  },
  'circle-geometry': {
    m: 'spin',
    svg: `<circle class="u-s u-f" cx="30" cy="34" r="17"/>
      <path class="u-s" d="M15 42h30" opacity=".55"/>
      <g class="u-m" style="transform-origin: 30px 34px">
        <path class="u-s" d="M30 34V17M12 17h36"/>
        <path class="u-s" d="M30 21h4v-4" opacity=".7"/>
        <circle class="u-d" cx="30" cy="17" r="2.6"/>
      </g>
      <circle class="u-d" cx="30" cy="34" r="2.2"/>`,
  },
  measurement: {
    m: 'float',
    svg: `<path class="u-s u-f" d="M10 22v26a10 4 0 0 0 20 0V22a10 4 0 0 1-20 0z"/>
      <ellipse class="u-s" cx="20" cy="22" rx="10" ry="4"/>
      <path class="u-s u-f" d="M36 48l10-28 10 28a10 3.5 0 0 1-20 0z"/>
      <path class="u-s" d="M36 48a10 3.5 0 0 1 20 0" opacity=".5"/>
      <g class="u-m"><ellipse class="u-s u-f" cx="20" cy="16" rx="10" ry="4"/><circle class="u-d" cx="20" cy="16" r="1.8"/></g>`,
  },
  similarity: {
    m: 'pulse',
    svg: `<path class="u-s" d="M8 54L56 22" style="stroke-dasharray: 3 4" opacity=".55"/>
      <path class="u-s" d="M24 54h32V22z"/>
      <g class="u-m" style="transform-origin: 8px 54px"><path class="u-s u-f" d="M16 54h16V38z"/></g>
      <circle class="u-d" cx="8" cy="54" r="2.8"/>`,
  },
  statistics: {
    m: 'drift',
    svg: `<path class="u-s" d="M6 54h50"/>
      <rect class="u-s u-f" x="10" y="38" width="7" height="16" rx="1.5"/>
      <rect class="u-s u-f" x="20" y="28" width="7" height="26" rx="1.5"/>
      <rect class="u-s u-f" x="30" y="34" width="7" height="20" rx="1.5"/>
      <rect class="u-s u-f" x="40" y="44" width="7" height="10" rx="1.5"/>
      <g class="u-m"><circle class="u-s u-f" cx="44" cy="20" r="9"/><path class="u-s" d="M50.5 26.5l6 6" style="stroke-width: 3.4"/><circle class="u-d" cx="44" cy="20" r="2.4"/></g>`,
  },
  probability: {
    m: 'spin',
    svg: `<circle class="u-s u-f" cx="32" cy="32" r="21"/>
      <path class="u-f" d="M32 32V11a21 21 0 0 1 18.2 31.5z"/>
      <path class="u-s" d="M32 32V11M32 32l18.2 10.5M32 32L13.8 42.5" opacity=".6"/>
      <g class="u-m" style="transform-origin: 32px 32px"><path class="u-s" d="M32 32L23 18" style="stroke-width: 2.8"/><path class="u-d" d="M20.6 14.3L26 16.9L21 20.1z"/></g>
      <circle class="u-d" cx="32" cy="32" r="3.2"/>`,
  },

  // ── Grade 7 Science ──────────────────────────────────────────────────
  'interactions-ecosystems': {
    m: 'pulse',
    svg: `<path class="u-s" d="M28 21l-9 18M36 21l9 18M22 47h20" opacity=".6"/>
      <g class="u-m" style="transform-origin: 32px 36px">
        <circle class="u-s u-f" cx="32" cy="15" r="7.5"/><circle class="u-d" cx="32" cy="15" r="2.8"/>
        <circle class="u-s u-f" cx="15" cy="47" r="7.5"/><path class="u-d" d="M11 51c0-5 3-8 8-8 0 5-3 8-8 8z"/>
        <circle class="u-s u-f" cx="49" cy="47" r="7.5"/><path class="u-d" d="M45 47c2.2-3 5.8-3 8 0-2.2 3-5.8 3-8 0zM45.5 47l-3-2.2v4.4z"/>
      </g>`,
  },
  'plants-food-fibre': {
    m: 'sway',
    svg: `<path class="u-s" d="M18 56h28" opacity=".5"/>
      <g class="u-m" style="transform-origin: 32px 56px">
        <path class="u-s" d="M32 56V16"/>
        <path class="u-s u-f" d="M32 46c-7-1-11-5-12-11 7 1 11 5 12 11z"/>
        <ellipse class="u-s u-f" cx="32" cy="13" rx="2.8" ry="5"/>
        <ellipse class="u-s u-f" cx="27.5" cy="21" rx="2.8" ry="5" transform="rotate(-32 27.5 21)"/>
        <ellipse class="u-s u-f" cx="36.5" cy="21" rx="2.8" ry="5" transform="rotate(32 36.5 21)"/>
        <ellipse class="u-s u-f" cx="27.5" cy="29.5" rx="2.8" ry="5" transform="rotate(-32 27.5 29.5)"/>
        <ellipse class="u-s u-f" cx="36.5" cy="29.5" rx="2.8" ry="5" transform="rotate(32 36.5 29.5)"/>
      </g>`,
  },
  'heat-temperature': {
    m: 'float',
    svg: `<path class="u-s u-f" d="M32 56c-8 0-13-6-13-13 0-8 7-12 9-20 4 4 5 8 4 12 3-2 4-5 4-8 5 4 9 10 9 16 0 7-5 13-13 13z"/>
      <path class="u-d" d="M32 56c-4 0-6.5-3-6.5-6.5 0-4 3-6 4-9 2 2 3.5 4.5 3.5 6.5 1-.8 2-2 2-3 2 2 3.5 3.7 3.5 5.5 0 3.5-2.5 6.5-6.5 6.5z"/>
      <g class="u-m"><path class="u-s" d="M14 22c2-2 2-4 0-6s-2-4 0-6M50 22c2-2 2-4 0-6s-2-4 0-6" opacity=".7"/></g>`,
  },
  'structures-forces': {
    m: 'drop',
    svg: `<path class="u-s" d="M6 44h52M10 44v10M54 44v10"/>
      <path class="u-s u-f" d="M10 44l8-14 8 14 8-14 8 14 8-14 4 14z"/>
      <path class="u-s" d="M18 30h32"/>
      <g class="u-m"><rect class="u-s u-f" x="27" y="9" width="10" height="10" rx="2"/><path class="u-s" d="M32 21v4"/></g>`,
  },
  'planet-earth': {
    m: 'float',
    svg: `<circle class="u-s u-f" cx="32" cy="39" r="19"/>
      <circle class="u-s" cx="32" cy="39" r="12" style="fill: rgb(var(--accent) / 0.22)"/>
      <circle class="u-d" cx="32" cy="39" r="5.5"/>
      <path class="u-s u-f" d="M22 22l7-10h6l7 10z"/>
      <g class="u-m"><circle class="u-d" cx="32" cy="7" r="2.2"/><circle class="u-d" cx="37" cy="4.5" r="1.4" opacity=".7"/></g>`,
  },

  // ── Social Studies 9 ─────────────────────────────────────────────────
  'urbanization-industry': {
    m: 'float',
    svg: `<path class="u-s u-f" d="M8 54V34l12 7v-7l12 7v-7l12 7V20h8v34z"/>
      <path class="u-s" d="M14 47h4M26 47h4M38 47h4" opacity=".7"/>
      <g class="u-m"><circle class="u-s u-f" cx="49" cy="13" r="3"/><circle class="u-s u-f" cx="55" cy="7.5" r="3.8"/></g>`,
  },
  'independence-democratic-rights': {
    m: 'tilt',
    svg: `<path class="u-s u-f" d="M12 12h26a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z"/>
      <path class="u-s" d="M18 22h16M18 28h16M18 34h10" opacity=".7"/>
      <circle class="u-d" cx="21" cy="45" r="3.4"/>
      <g class="u-m" style="transform-origin: 41px 48px"><path class="u-s u-f" d="M58 8c-10 2-16 10-16 22l-2 8 6-6c10-2 14-12 12-24z"/><path class="u-s" d="M41 44l10-16"/></g>`,
  },
  'canada-in-wwii': {
    m: 'sway',
    svg: `<g class="u-m" style="transform-origin: 32px 58px">
        <path class="u-s" d="M32 58c0-8-1-16 0-24"/>
        <path class="u-s u-f" d="M32 49c5-1 8-4 9-8-5 1-8 4-9 8z"/>
        <g style="fill: rgb(var(--accent) / 0.42)"><circle cx="26" cy="20" r="7.5"/><circle cx="38" cy="20" r="7.5"/><circle cx="25" cy="30" r="7.5"/><circle cx="39" cy="30" r="7.5"/></g>
        <circle style="fill: rgb(var(--accent) / 0.55)" cx="32" cy="25" r="7"/>
        <circle style="fill: rgb(var(--accent-ink))" cx="32" cy="25" r="3.8"/>
      </g>`,
  },
  'postwar-canada': {
    m: 'sway',
    svg: `<path class="u-s" d="M6 54h52" opacity=".5"/>
      <path class="u-s u-f" d="M10 32L27 19l17 13v22H10z"/>
      <rect class="u-s" x="23" y="40" width="8" height="14" rx="1"/>
      <rect class="u-s" x="14" y="36" width="6" height="6" rx="1"/>
      <path class="u-s" d="M34 23v-8M30 12l4 3 4-3"/>
      <g class="u-m" style="transform-origin: 51px 54px"><path class="u-s" d="M51 54V41"/><circle class="u-s u-f" cx="51" cy="35" r="7.5"/></g>`,
  },
  'modern-economy': {
    m: 'grow',
    svg: `<path class="u-s" d="M8 54h48"/>
      <g class="u-m" style="transform-origin: 32px 54px"><rect class="u-s u-f" x="12" y="40" width="9" height="14" rx="1.5"/><rect class="u-s u-f" x="25" y="31" width="9" height="23" rx="1.5"/><rect class="u-s u-f" x="38" y="22" width="9" height="32" rx="1.5"/></g>
      <path class="u-s" d="M10 28l12-8 8 4 16-13M41 11h5v5"/>`,
  },
  'system-of-government': {
    m: 'tilt',
    svg: `<rect class="u-s u-f" x="7" y="38" width="20" height="16" rx="1"/>
      <rect class="u-s u-f" x="37" y="38" width="20" height="16" rx="1"/>
      <path class="u-s u-f" d="M27 54V24l5-6 5 6v30z"/>
      <circle class="u-d" cx="32" cy="30" r="2.6"/>
      <path class="u-s" d="M12 44v4M17 44v4M22 44v4M42 44v4M47 44v4M52 44v4" opacity=".6"/>
      <path class="u-s" d="M32 18V7"/>
      <g class="u-m" style="transform-origin: 32px 7px"><path class="u-d" d="M32 6h10l-2.5 3 2.5 3H32z"/></g>`,
  },
  'evolving-citizenship': {
    m: 'float',
    svg: `<circle class="u-s u-f" cx="15" cy="27" r="5"/><path class="u-s u-f" d="M6 52c0-8 4-14 9-14s9 6 9 14z"/>
      <circle class="u-s u-f" cx="49" cy="27" r="5"/><path class="u-s u-f" d="M40 52c0-8 4-14 9-14s9 6 9 14z"/>
      <g class="u-m"><circle class="u-s u-f" cx="32" cy="19" r="6"/><path class="u-s u-f" d="M21 52c0-10 5-17 11-17s11 7 11 17z"/><circle class="u-d" cx="32" cy="43" r="2.4"/></g>`,
  },

  // ── Social Studies 8 ─────────────────────────────────────────────────
  ideologies: {
    m: 'tilt-r',
    svg: `<path class="u-s" d="M32 18v34M22 54h20"/>
      <g class="u-m" style="transform-origin: 32px 18px">
        <path class="u-s" d="M10 18h44M10 18l-5 12M10 18l5 12M54 18l-5 12M54 18l5 12"/>
        <path class="u-s u-f" d="M4 30a6 3 0 0 0 12 0z"/><path class="u-s u-f" d="M48 30a6 3 0 0 0 12 0z"/>
        <circle class="u-d" cx="10" cy="26" r="3"/>
        <circle class="u-d" cx="51" cy="27" r="1.8"/><circle class="u-d" cx="57" cy="27" r="1.8"/><circle class="u-d" cx="54" cy="23.5" r="1.8"/>
      </g>
      <circle class="u-d" cx="32" cy="18" r="2.6"/>`,
  },
  'economic-systems': {
    m: 'pulse',
    svg: `<path class="u-s" d="M10 10v44h44"/>
      <path class="u-s" d="M16 16c10 4 22 16 34 30"/>
      <path class="u-s" d="M16 48c12-6 24-20 34-32" opacity=".6"/>
      <path class="u-s" d="M33 33v21M10 33h23" style="stroke-dasharray: 2.5 3.5" opacity=".45"/>
      <g class="u-m" style="transform-origin: 33px 33px"><circle class="u-s u-f" cx="33" cy="33" r="5"/><circle class="u-d" cx="33" cy="33" r="2.2"/></g>`,
  },
  'political-systems': {
    m: 'tilt',
    svg: `<path class="u-s" d="M6 54h52"/>
      <rect class="u-s u-f" x="10" y="40" width="44" height="14" rx="1"/>
      <path class="u-s" d="M17 43v8M24 43v8M31 43v8M38 43v8M45 43v8" opacity=".6"/>
      <path class="u-s u-f" d="M20 40a12 12 0 0 1 24 0z"/>
      <path class="u-s" d="M32 28V16"/>
      <g class="u-m" style="transform-origin: 32px 16px"><path class="u-d" d="M32 15h9l-2.2 2.8 2.2 2.8H32z"/></g>`,
  },
  'civic-engagement': {
    m: 'drop',
    svg: `<path class="u-s u-f" d="M12 30h40v24H12z"/>
      <path class="u-s" d="M24 30h16" style="stroke-width: 3.2"/>
      <path class="u-s" d="M26 42.5l4 4 8-8"/>
      <g class="u-m"><rect class="u-s u-f" x="26" y="6" width="12" height="18" rx="1.5"/><path class="u-s" d="M29 12h6M29 16h4" opacity=".7"/></g>`,
  },

  // ── STEAM grades ─────────────────────────────────────────────────────
  'grade-5': {
    m: 'float',
    svg: `<circle class="u-s u-f" cx="17" cy="50" r="6"/><circle class="u-s u-f" cx="47" cy="50" r="6"/>
      <circle class="u-d" cx="17" cy="50" r="2"/><circle class="u-d" cx="47" cy="50" r="2"/>
      <g class="u-m"><circle class="u-s u-f" cx="32" cy="27" r="16"/><circle class="u-d" cx="32" cy="25" r="5.5"/><circle cx="34" cy="23" r="1.6" fill="white"/><path class="u-s" d="M32 11V5"/><circle class="u-d" cx="32" cy="4.5" r="2"/></g>`,
  },
  'grade-6': {
    m: 'pulse',
    svg: `<path class="u-s u-f" d="M24 35a10 10 0 1 1 16 0c-2 2-3 4-3 7H27c0-3-1-5-3-7z"/>
      <path class="u-s" d="M27 46h10M28.5 50h7"/>
      <path class="u-s" d="M29 50v5H10M35 50v5h19" opacity=".6"/>
      <circle class="u-d" cx="10" cy="55" r="2.2"/><circle class="u-d" cx="54" cy="55" r="2.2"/>
      <g class="u-m" style="transform-origin: 32px 27px"><path class="u-s" d="M32 6v4M16 12l3 3M48 12l-3 3M10 27h4M50 27h4"/></g>`,
  },
  'grade-7': {
    m: 'drive',
    svg: `<path class="u-s" d="M3 27h9M1 35h7" opacity=".45"/>
      <g transform="translate(-4 -7) scale(1.14)"><g class="u-m">
        <path class="u-s u-f" d="M10 44c0-4 4-7 8-7h20l14 4c2.5.8 4 2.5 4 4.5V48H10z"/>
        <path class="u-s" d="M24 37l4-5h8l3 5" />
        <rect class="u-d" x="7" y="38.5" width="7" height="5" rx="1.5"/>
        <circle class="u-s" cx="20" cy="49" r="6" style="fill: white"/><circle class="u-s" cx="48" cy="49" r="5" style="fill: white"/>
        <circle class="u-d" cx="20" cy="49" r="2"/><circle class="u-d" cx="48" cy="49" r="1.8"/>
      </g></g>`,
  },
  'grade-8': {
    m: 'spin',
    svg: `<g class="u-m" style="transform-origin: 24px 28px">
        <circle cx="24" cy="28" r="15" style="fill: none; stroke: rgb(var(--accent)); stroke-width: 4.5; stroke-dasharray: 4.71 4.71"/>
        <circle class="u-s" cx="24" cy="28" r="12.5" style="fill: white"/>
        <circle class="u-s" cx="24" cy="28" r="5" style="fill: rgb(var(--accent) / 0.2)"/>
      </g>
      <g class="u-m2" style="transform-origin: 45px 46px">
        <circle cx="45" cy="46" r="10" style="fill: none; stroke: rgb(var(--accent)); stroke-width: 4; stroke-dasharray: 3.93 3.93"/>
        <circle class="u-s" cx="45" cy="46" r="7.8" style="fill: white"/>
        <circle class="u-d" cx="45" cy="46" r="2.6"/>
      </g>`,
  },
  'grade-9': {
    m: 'pulse',
    svg: `<rect class="u-s u-f" x="7" y="12" width="50" height="38" rx="5"/>
      <path class="u-s" d="M7 20h50" opacity=".6"/>
      <circle class="u-d" cx="12" cy="16" r="1.5"/><circle class="u-d" cx="17" cy="16" r="1.5"/><circle class="u-d" cx="22" cy="16" r="1.5"/>
      <g class="u-m" style="transform-origin: 32px 35px"><path class="u-s" d="M24 29l-6 6 6 6M40 29l6 6-6 6" style="stroke-width: 2.6"/><path class="u-s" d="M35 26l-6 18"/></g>
      <path class="u-s" d="M24 50l-3 6h22l-3-6" opacity=".6"/>`,
  },

  // ── STEAM units (keys: steam-<unit>) ─────────────────────────────────
  'steam-slow-coaster': {
    m: 'drop',
    svg: `<path class="u-s" d="M6 16c8 0 10 26 20 26s10-14 17-14 8 22 15 22"/>
      <path class="u-s" d="M16 33v21M26 42v12M38 31v23M50 44v10" opacity=".45"/>
      <path class="u-s" d="M4 54h56"/>
      <g class="u-m"><circle class="u-s u-f" cx="9" cy="11" r="4.5"/><circle class="u-d" cx="10.5" cy="9.5" r="1.4"/></g>`,
  },
  'steam-water-filter': {
    m: 'drop',
    svg: `<path class="u-s u-f" d="M14 8h36l-6 32H20Z"/>
      <path class="u-s" d="M15.5 16h33M17.5 26h29" opacity=".6"/>
      <circle class="u-d" cx="22" cy="12" r="1.8"/><circle class="u-d" cx="30" cy="12.5" r="1.5"/><circle class="u-d" cx="39" cy="12" r="1.9"/>
      <path class="u-s" d="M24 40l3 5h10l3-5"/>
      <g class="u-m"><path class="u-s u-f" d="M32 49c-3 4-4 6-4 8a4 4 0 0 0 8 0c0-2-1-4-4-8z"/></g>`,
  },
  'steam-scratch-story': {
    m: 'float',
    svg: `<rect class="u-s u-f" x="6" y="22" width="44" height="32" rx="4"/>
      <circle class="u-s" cx="22" cy="38" r="5" style="fill: white"/><path class="u-s" d="M15 54c0-5 3-8 7-8s7 3 7 8"/>
      <path class="u-s" d="M36 46h8M36 41h5" opacity=".6"/>
      <g class="u-m"><path class="u-s" d="M34 6h22a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H44l-6 5v-5h-4a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3z" style="fill: white"/><circle class="u-d" cx="39" cy="13.5" r="1.6"/><circle class="u-d" cx="45" cy="13.5" r="1.6"/><circle class="u-d" cx="51" cy="13.5" r="1.6"/></g>`,
  },
  'steam-bag-tag': {
    m: 'sway',
    svg: `<path class="u-s" d="M32 4v10" opacity=".6"/>
      <g class="u-m" style="transform-origin: 32px 6px">
        <path class="u-s u-f" d="M22 20l10-8 10 8v32a3 3 0 0 1-3 3H25a3 3 0 0 1-3-3Z"/>
        <circle class="u-s" cx="32" cy="20" r="3" style="fill: white"/>
        <path class="u-s" d="M27 32h10M27 38h7" opacity=".6"/>
        <circle class="u-d" cx="32" cy="47" r="2.6"/>
      </g>`,
  },
  'steam-bridges': {
    m: 'drop',
    svg: `<path class="u-s" d="M4 50h56"/>
      <path class="u-s u-f" d="M8 50l8-14h32l8 14Z"/>
      <path class="u-s" d="M16 36l8 14 8-14 8 14 8-14"/>
      <path class="u-s" d="M8 50v6M56 50v6" opacity=".5"/>
      <g class="u-m"><rect class="u-s" x="25" y="18" width="14" height="12" rx="2" style="fill: white"/><path class="u-s" d="M29 24h6" opacity=".6"/></g>`,
  },
  'steam-glider': {
    m: 'slide',
    svg: `<path class="u-s" d="M4 46c6-2 10-6 14-8M6 54c5-1 9-3 12-5" opacity=".4" style="stroke-dasharray: 3 3"/>
      <g class="u-m"><path class="u-s u-f" d="M14 38 54 16 30 46Z"/><path class="u-s" d="M54 16 26 38l4 8"/><path class="u-s" d="M26 38l-12 0" opacity=".6"/></g>`,
  },
  'steam-spike-prime': {
    m: 'pulse',
    svg: `<rect class="u-s u-f" x="10" y="10" width="44" height="44" rx="7"/>
      <path class="u-s" d="M10 46h44" opacity=".5"/>
      <circle class="u-s" cx="32" cy="50" r="1.6"/>
      <g class="u-m" style="transform-origin: 32px 28px">
        <circle class="u-d" cx="24" cy="20" r="2"/><circle class="u-d" cx="40" cy="20" r="2"/>
        <circle class="u-d" cx="32" cy="28" r="2"/>
        <circle class="u-d" cx="22" cy="34" r="2"/><circle class="u-d" cx="27" cy="37" r="2"/><circle class="u-d" cx="32" cy="38" r="2"/><circle class="u-d" cx="37" cy="37" r="2"/><circle class="u-d" cx="42" cy="34" r="2"/>
      </g>`,
  },
  'steam-thermo-box': {
    m: 'grow',
    svg: `<path class="u-s u-f" d="M6 26 22 18l22 6v28L22 58 6 50Z"/>
      <path class="u-s" d="M22 18v40M6 26l16 6 22-8M22 32" opacity=".6"/>
      <rect class="u-s" x="47" y="6" width="8" height="38" rx="4" style="fill: white"/>
      <circle class="u-d" cx="51" cy="48" r="5"/>
      <g class="u-m" style="transform-origin: 51px 46px"><rect class="u-d" x="49.5" y="22" width="3" height="24" rx="1.5"/></g>`,
  },
  'steam-adventure': {
    m: 'sway',
    svg: `<path class="u-s" d="M8 58h48" opacity=".5"/>
      <g class="u-m" style="transform-origin: 32px 58px">
        <path class="u-s" d="M32 58V10"/>
        <path class="u-s u-f" d="M32 14h18l6 5-6 5H32Z"/>
        <path class="u-s u-f" d="M32 30H14l-6 5 6 5h18Z"/>
        <circle class="u-d" cx="32" cy="8" r="2.4"/>
      </g>`,
  },
  'steam-rube-goldberg': {
    m: 'tilt-r',
    svg: `<path class="u-s" d="M4 56h56"/>
      <path class="u-s u-f" d="M4 24l22 14v4H4Z"/>
      <circle class="u-s u-f" cx="9" cy="20" r="4"/><circle class="u-d" cx="10.4" cy="18.6" r="1.2"/>
      <g class="u-m" style="transform-origin: 38px 56px"><rect class="u-s u-f" x="34" y="34" width="6" height="22" rx="1"/></g>
      <rect class="u-s u-f" x="44" y="34" width="6" height="22" rx="1"/>
      <rect class="u-s u-f" x="54" y="34" width="6" height="22" rx="1"/>`,
  },
  'steam-platform-game': {
    m: 'float',
    svg: `<rect class="u-s u-f" x="4" y="50" width="22" height="8" rx="1.5"/>
      <rect class="u-s u-f" x="36" y="36" width="24" height="8" rx="1.5"/>
      <circle class="u-d" cx="48" cy="26" r="3"/>
      <path class="u-s" d="M18 40c4-12 10-16 18-14" opacity=".4" style="stroke-dasharray: 3 3"/>
      <g class="u-m"><rect class="u-s" x="9" y="34" width="11" height="13" rx="2.5" style="fill: white"/><circle class="u-d" cx="16.5" cy="39" r="1.3"/></g>`,
  },
  'steam-motor': {
    m: 'spin',
    svg: `<rect class="u-s u-f" x="6" y="36" width="22" height="18" rx="3"/>
      <path class="u-s" d="M28 45h6M10 54v4M24 54v4" opacity=".6"/>
      <path class="u-s" d="M12 36v-5h10v5" opacity=".6"/>
      <g class="u-m" style="transform-origin: 44px 26px">
        <circle cx="44" cy="26" r="14" style="fill: none; stroke: rgb(var(--accent)); stroke-width: 4.5; stroke-dasharray: 4.4 4.4"/>
        <circle class="u-s" cx="44" cy="26" r="11.5" style="fill: white"/>
        <circle class="u-d" cx="44" cy="26" r="3"/>
      </g>`,
  },
  'steam-challenge-maze': {
    m: 'push',
    svg: `<rect class="u-s u-f" x="6" y="6" width="52" height="52" rx="4"/>
      <path class="u-s" d="M6 22h20M38 6v16M22 22v18M22 40h20M42 30h16M38 40v18M6 48h8"/>
      <circle class="u-d" cx="54" cy="52" r="2.2"/>
      <g class="u-m"><rect class="u-s" x="9" y="28" width="9" height="9" rx="2" style="fill: white"/><circle class="u-d" cx="15.5" cy="32.5" r="1.3"/></g>`,
  },
  'steam-rev-robotics': {
    m: 'tilt',
    svg: `<path class="u-s u-f" d="M8 56v-6a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v6Z"/>
      <path class="u-s" d="M4 56h32"/>
      <path class="u-s" d="M20 46V32"/>
      <circle class="u-s" cx="20" cy="30" r="4" style="fill: white"/>
      <g class="u-m" style="transform-origin: 20px 30px">
        <path class="u-s" d="M23 27l18-14"/>
        <circle class="u-s" cx="43" cy="12" r="3.4" style="fill: white"/>
        <path class="u-s" d="M45 15l7 5M46 9l8-1"/>
      </g>`,
  },
  'steam-miniatures': {
    m: 'pulse',
    svg: `<path class="u-s u-f" d="M10 30 30 14l20 16v26H10Z"/>
      <path class="u-s" d="M6 56h52"/>
      <rect class="u-s" x="16" y="40" width="8" height="16" rx="1" style="fill: white"/>
      <rect class="u-d" x="32" y="34" width="10" height="9" rx="1.5"/>
      <g class="u-m" style="transform-origin: 37px 38px"><path class="u-s" d="M37 26v-4M46 30l3-3M50 38h4M28 30l-3-3" opacity=".8"/></g>`,
  },
  'steam-trebuchet': {
    m: 'tilt',
    svg: `<path class="u-s" d="M4 58h56"/>
      <path class="u-s u-f" d="M14 58 30 26l16 32Z"/>
      <g class="u-m" style="transform-origin: 30px 26px">
        <path class="u-s" d="M30 26 56 10M30 26 18 34"/>
        <rect class="u-d" x="11" y="32" width="10" height="10" rx="2"/>
        <path class="u-s" d="M56 10v8" opacity=".6"/><circle class="u-s" cx="56" cy="21" r="3" style="fill: white"/>
      </g>
      <circle class="u-d" cx="30" cy="26" r="2"/>`,
  },

  // ── CEFL 7 ───────────────────────────────────────────────────────────
  'labour-market': {
    m: 'slide',
    svg: `<path class="u-s" d="M8 52c10 0 10-12 20-12s10-12 20-12 6-8 10-8" style="stroke-dasharray: 4 3"/>
      <circle class="u-d" cx="8" cy="52" r="3.2"/><circle class="u-d" cx="28" cy="40" r="2.6"/><circle class="u-d" cx="48" cy="28" r="2.6"/>
      <g class="u-m"><path class="u-s" d="M50 22V8"/><path class="u-s u-f" d="M50 8h10l-3 4 3 4H50"/></g>`,
  },
  'post-secondary': {
    m: 'float',
    svg: `<g class="u-m"><path class="u-s u-f" d="M32 14 6 26l26 12 26-12Z"/>
      <path class="u-s" d="M18 32v10c0 4 6 8 14 8s14-4 14-8V32"/>
      <path class="u-s" d="M56 27v13"/><circle class="u-d" cx="56" cy="42" r="2.4"/></g>`,
  },
  experiences: {
    m: 'spin',
    svg: `<g class="u-m" style="transform-origin: 32px 32px"><path class="u-s u-f" d="M32 8l6.2 13.6 14.8 1.6-11 10 3.1 14.6L32 40.4 18.9 47.8 22 33.2l-11-10 14.8-1.6Z"/></g>
      <circle class="u-d" cx="32" cy="56" r="2.2"/><circle class="u-d" cx="12" cy="52" r="1.6"/><circle class="u-d" cx="52" cy="52" r="1.6"/>`,
  },
  'income-tax': {
    m: 'drop',
    svg: `<rect class="u-s u-f" x="10" y="10" width="32" height="44" rx="3"/>
      <path class="u-s" d="M16 20h20M16 28h14M16 34h14M16 40h14" opacity=".6"/><path class="u-s" d="M16 47h20"/>
      <g class="u-m"><circle class="u-s" cx="48" cy="22" r="8" style="fill: white"/><path class="u-s" d="M48 18v8M45.5 20.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4" style="stroke-width: 1.6"/></g>`,
  },
  'money-management': {
    m: 'drop',
    svg: `<path class="u-s u-f" d="M16 24h32v26a5 5 0 0 1-5 5H21a5 5 0 0 1-5-5Z"/>
      <path class="u-s" d="M14 24h36"/><path class="u-s" d="M26 24v-5h12v5" opacity=".6"/>
      <circle class="u-d" cx="26" cy="47" r="3.4"/><circle class="u-d" cx="36" cy="48" r="3"/><circle class="u-d" cx="31" cy="41" r="2.8"/>
      <g class="u-m"><circle class="u-s" cx="32" cy="9" r="4.5" style="fill: white"/></g>`,
  },
  // CEFL grade cards
  'cefl-grade-7': {
    m: 'float',
    svg: `<rect class="u-s u-f" x="12" y="10" width="40" height="44" rx="6"/>
      <g class="u-m"><text x="32" y="44" text-anchor="middle" font-size="30" font-weight="700" style="fill: rgb(var(--accent)); font-family: var(--font-display, Georgia, serif)">7</text></g>
      <circle class="u-d" cx="20" cy="18" r="2"/>`,
  },
  'cefl-grade-8': {
    m: 'float',
    svg: `<rect class="u-s u-f" x="12" y="10" width="40" height="44" rx="6"/>
      <g class="u-m"><text x="32" y="44" text-anchor="middle" font-size="30" font-weight="700" style="fill: rgb(var(--accent)); font-family: var(--font-display, Georgia, serif)">8</text></g>
      <circle class="u-d" cx="20" cy="18" r="2"/>`,
  },
  'cefl-grade-9': {
    m: 'float',
    svg: `<rect class="u-s u-f" x="12" y="10" width="40" height="44" rx="6"/>
      <g class="u-m"><text x="32" y="44" text-anchor="middle" font-size="30" font-weight="700" style="fill: rgb(var(--accent)); font-family: var(--font-display, Georgia, serif)">9</text></g>
      <circle class="u-d" cx="20" cy="18" r="2"/>`,
  },
};

// Units whose idea a grade card already draws share its art.
Object.assign(unitArt, {
  'steam-dash-bot': unitArt['grade-5'],
  'steam-littlebits': unitArt['grade-6'],
  'steam-co2-dragster': unitArt['grade-7'],
  'steam-programming': unitArt['grade-9'],
});
