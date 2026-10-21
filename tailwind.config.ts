
 // Think of tailwind.config.ts as the rulebook for Tailwind CSS.
 // It tells Tailwind which files to inspect,
 // which CSS classes to keep,
 // which colors your project can use,
 // and which fonts and gradients are available.

 // Only a TS type, not a runtime value.
 // Config describes the expected structure of a Tailwind configuration.
import type { Config } from 'tailwindcss';

export default {
  // `content` tells Tailwind which files to scan for class names.
  // Tailwind will only generate CSS for the classes it finds in these files.
  // This is important for performance and file size.
  // The glob pattern `./src/**/*.{ts,tsx}` means "all .ts and .tsx files in the src directory and its subdirectories".
  // The glob pattern `./index.html` means "the index.html file in the root directory".
  content: ['./index.html', './src/**/*.{ts,tsx}'],

  // `safelist` is a list of class names that Tailwind should always include in the generated CSS,
  // even if it doesn't find them in the scanned files.
  // This is useful for classes that are generated dynamically or used conditionally.
  // For example, if you have a component that conditionally applies a class based on some state,
  // you might want to add that class to the safelist to ensure it's always available.
  // The classes in this safelist are related to different color states (red, green, amber) and their corresponding background and text colors.
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

  // `theme` is where you define your project's design tokens, such as colors, fonts, and gradients.
  // By defining these tokens in the Tailwind configuration, you can use them throughout your project with Tailwind's utility classes.
  // In this configuration, the `colors` property is defined directly under `theme`, which means that only the specified colors will be available in the project.
  theme: {
    // `colors` not `extend.colors` so only your brand palette exists.
    colors: {
      transparent: 'transparent',
      white: 'var(--color-white)',
      navy: 'var(--color-navy)',

      'app-bg': '#181820',
      gradient1: '#BB3FDD',
      gradient2: '#FB6DA9',
      gradient3: '#FF9F7C',
      'border-app': '#343343',
      grey: '#9E9E9E',
      error: '#FF5252',

      slate: {
        DEFAULT: 'var(--color-slate)',
        600: 'var(--color-slate-600)',
      },

      // soft + strong are derived tints for surfaces and accessible input borders.
      mist: {
        DEFAULT: 'var(--color-mist)',
        soft: 'var(--color-mist-soft)',
        strong: 'var(--color-mist-strong)',
      },

      gold: {
        DEFAULT: 'var(--color-gold)',
        ink: 'var(--color-gold-ink)',
        tint: 'var(--color-gold-tint)',
      },

      amber: {
        DEFAULT: 'var(--color-amber)',
        soft: 'var(--color-amber-soft)',
        deep: 'var(--color-amber-deep)',
        100: '#FEF3C7',
        300: '#FCD34D',
        700: '#B45309',
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

      backgroundImage: {
        cta: 'var(--gradient-cta)',
        hero: 'var(--gradient-hero)',
      },
    },
  },
} satisfies Config;
