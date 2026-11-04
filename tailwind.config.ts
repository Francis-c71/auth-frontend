
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
      background: '#181832', // page, cells, cards
      backgroundtext: '#8C8CA3',

      panel: '#222244',      // panels
      paneltext: '#D9D9E6',

      panelbtnbg: '#26264A', // raised buttonsabove panel
      panelbtntext: '#C2C2D6',

      hover: '#2B2B54',      // raised areas, hover fill
      hovertext: '#FFFFFF',

      card: '#2B2B54',       // cards, raised areas
      cardtext: '#E6E6F2',

      border: '#343343',     // quiet structural lines
      
      brand: '#0a0a23',      // logo only

      transparent: 'transparent',
      white: '#ffffff',
      borderAuth: "#343343",
      error: "#FF5252",
      navyBrand: '#0a0a23',
      backgroundAuth: '#181832', 
      cards: '#252540',  
      gold: '#ffc300',
      coffee: '#4d3800',
      amber: '#feac32',
      ambersoft: '#fecb4b',
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
