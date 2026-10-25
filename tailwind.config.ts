
import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'border-red-300',
    'bg-red-100',
    'text-red-700',
    'border-green-300',
    'bg-green-100',
    'text-green-700',
    'border-amber-300',
    'bg-amber-100',
    'text-amber-700',
  ],

  theme: {
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      border: "#343343",
      error: "#FF5252",
      navyBrand: '#0a0a23',
      background: '#181832', 
      cards: '#252540',  
      hover: '#66667D',
       gold: '#ffc300',
       coffee: '#4d3800',
       amber: '#feac32',
       soft: '#fecb4b',
       amberdeep: '#ffac33',

      slate: {
        DEFAULT: 'var(--color-slate)',
        600: 'var(--color-slate-600)',
      },

      mist: {
        DEFAULT: 'var(--color-mist)',
        soft: 'var(--color-mist-soft)',
        strong: 'var(--color-mist-strong)',
      },

      red: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        200: '#FECACA',
        300: '#FCA5A5',
        700: '#B91C1C',
      },

      green: {
        50: '#F0FDF4',
        100: '#DCFCE7',
        200: '#BBF7D0',
        300: '#86EFAC',
        700: '#15803D',
      },
    },

    extend: {
      fontFamily: {
        sans: [
          '"Hanken Grotesk"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '"Bricolage Grotesque"',
          '"Hanken Grotesk"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
} satisfies Config;
