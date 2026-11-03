import type { Experiment, Recording } from '../types';

/**
 * Placeholder timings for the preview. After filming, give each outcome its own recording:
 *   { src: '/videos/non-reducing-present.mp4', poster: '...', duration: 61.4, cues: [0, 7.2, ...] }
 * Put the files in /public/videos.
 */
const preview: Recording = {
  duration: 58,
  cues: [0, 6, 12, 22, 30, 36, 42],
};

export const nonReducingSugar: Experiment = {
  id: 'non-reducing-sugar',
  title: 'Test for non-reducing sugars',
  aim: 'To find out whether a food sample contains a non-reducing sugar, such as sucrose.',
  outcomeLabels: {
    present: 'Sample contains a non-reducing sugar',
    absent: 'Sample has no non-reducing sugar',
  },
  recordings: { present: preview, absent: preview },

  steps: [
    {
      id: 'sample',
      procedure: '2 ml of the sample solution was measured into a clean test tube.',
      observation: { present: 'A colourless solution.', absent: 'A colourless solution.' },
    },
    {
      id: 'acid',
      procedure: '2 ml of dilute hydrochloric acid was added.',
      observation: {
        present: 'No visible change. The solution stayed colourless.',
        absent: 'No visible change. The solution stayed colourless.',
      },
    },
    {
      id: 'heat',
      procedure: 'The mixture was heated in a Bunsen flame, held with a test tube holder.',
      observation: {
        present: 'The solution stayed colourless and began to boil gently.',
        absent: 'The solution stayed colourless and began to boil gently.',
      },
    },
    {
      id: 'cool',
      procedure: 'The tube was cooled under running tap water.',
      observation: {
        present: 'The tube cooled to room temperature. The solution was still colourless.',
        absent: 'The tube cooled to room temperature. The solution was still colourless.',
      },
    },
    {
      id: 'base',
      procedure: '2 ml of sodium hydroxide solution was added to neutralise the acid.',
      observation: {
        present: 'No visible change. The solution stayed colourless.',
        absent: 'No visible change. The solution stayed colourless.',
      },
    },
    {
      id: 'benedict',
      procedure: "2 ml of Benedict's solution was added.",
      observation: { present: 'The solution turned blue.', absent: 'The solution turned blue.' },
    },
    {
      id: 'boil',
      procedure: 'The mixture was boiled.',
      observation: {
        present: 'The blue colour changed to green, then orange, and a brick-red precipitate formed.',
        absent: 'The solution stayed blue. No precipitate formed.',
      },
    },
  ],

  deduction: {
    present: {
      result: 'Non-reducing sugar present.',
      explanation:
        'A brick-red precipitate formed only after the sample was heated with acid. The acid broke the non-reducing sugar into reducing sugars, which then reduced Benedict’s solution.',
    },
    absent: {
      result: 'Non-reducing sugar absent.',
      explanation:
        'The solution stayed blue even after heating with acid. No reducing sugars were released, so the sample has no non-reducing sugar.',
    },
  },
};