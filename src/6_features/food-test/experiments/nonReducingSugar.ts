import type { Experiment, Recording } from '../types';

/**
 * Placeholder timings for the preview. After filming, give each outcome its own recording:
 *   { src: '/videos/non-reducing-present.mp4', poster: '...', duration: 61.4, cues: [0, 7.2, ...] }
 * Put the files in /public/videos.
 */
const present: Recording = {
  src: '/videos/non-reducing-present.mp4',
  poster: '/videos/non-reducing-present.jpg', // optional, remove this line if you have no poster
  duration: 61, // approximate; the real length is read from the file once it loads
  cues: [0, 6.5, 13, 24, 32, 39, 46], // the second each of the 7 steps begins
};

const absent: Recording = {
  src: '/videos/non-reducing-absent.mp4',
  poster: '/videos/non-reducing-absent.jpg',
  duration: 58,
  cues: [0, 6.5, 13, 24, 32, 39, 46],
};


export const nonReducingSugar: Experiment = {
  id: 'non-reducing-sugar',
  title: 'Test for non-reducing sugars',
  aim: 'To find out whether a food sample contains a non-reducing sugar, such as sucrose.',
  outcomeLabels: {
    present: 'Positive test',
    absent: 'Negative test',
  },
  recordings: { present, absent },

  steps: [
    {
      id: 'sample',
      procedure: 'To 2 cm³ of the sample solution in a clean test tube.',
      observation: { 
        present: '', 
        absent: '' },
    },
    {
      id: 'acid',
      procedure: '2 cm³ of dilute hydrochloric acid was added.',
      observation: {
        present: '',
        absent: '',
      },
    },
    {
      id: 'heat',
      procedure: 'Boiled.',
      observation: {
        present: '',
        absent: '',
      },
    },
    {
      id: 'cool',
      procedure: 'Cooled.',
      observation: {
        present: '',
        absent: '',
      },
    },
    {
      id: 'base',
      procedure: '2 cm³ of sodium hydroxide solution was added.',
      observation: {
        present: '',
        absent: '',
      },
    },
    {
      id: 'benedict',
      procedure: "2 cm³ of Benedict's solution was added.",
      observation: { 
        present: '', 
        absent: '' 
      },
    },
    {
      id: 'boil',
      procedure: 'And the mixture was boiled.',
      observation: {
        present: 'The blue solution turned to green solution, to yellow precipitate, to orange precipitate, and finally brown precipitate.',
        absent: 'The solution stayed blue. No precipitate formed.',
      },
    },
  ],

  deduction: {
    present: {
      result: 'Non-reducing sugars present.',
      explanation:
        'A brick-red precipitate formed only after the sample was heated with acid. The acid broke the non-reducing sugar into reducing sugars, which then reduced Benedict’s solution.',
    },
    absent: {
      result: 'Non-reducing sugars absent.',
      explanation:
        'The solution stayed blue even after heating with acid. No reducing sugars were released, so the sample has no non-reducing sugar.',
    },
  },
};