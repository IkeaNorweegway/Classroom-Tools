/** @type {import('tailwindcss').Config} */

// Course accents come from CSS custom properties set per course in
// src/styles/global.css ([data-course="..."]). Values are space-separated RGB
// channels so Tailwind's opacity modifiers (bg-accent/10) keep working.
const channel = (name) => `rgb(var(${name}) / <alpha-value>)`;

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Atkinson Hyperlegible Next Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
      },
      colors: {
        // Warm, calm neutral. Replaces Tailwind's cool slate everywhere so every
        // existing page picks up the new palette without markup changes.
        slate: {
          50:  '#f9f8f5',
          100: '#f2f0eb',
          200: '#e6e3dc',
          300: '#d2cec4',
          400: '#8f8a80',
          500: '#6b665d',
          600: '#544f47',
          700: '#3f3b35',
          800: '#2b2824',
          900: '#1f1d1a',
          950: '#141311',
        },
        paper: '#f6f4ef',
        accent: {
          DEFAULT: channel('--accent'),
          ink:     channel('--accent-ink'),
          soft:    channel('--accent-soft'),
        },
        // Legacy course tokens, retuned to the calmer v2 accents.
        science: {
          50:  '#eef6f7',
          100: '#d8ebee',
          200: '#b5d8de',
          300: '#86bdc7',
          400: '#4f9aa8',
          500: '#2b8193',
          600: '#1d7486',
          700: '#175d6c',
          800: '#154c58',
          900: '#123f49',
        },
        teacher: {
          50:  '#fdf7ec',
          100: '#f9ead0',
          400: '#e3a54a',
          500: '#d18e2c',
          600: '#b5761c',
          700: '#925d17',
        },
        math9: {
          50:  '#f0f2fa',
          100: '#dfe4f4',
          200: '#c3cbea',
          500: '#5470c4',
          600: '#3f5bb0',
          700: '#33498f',
          800: '#2b3c74',
          900: '#24315d',
        },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#1f1d1a',
            lineHeight: '1.75',
          },
        },
      },
    },
  },
  plugins: [],
};
