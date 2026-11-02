import { LIQUID } from '@/4_components/lab';
import type { Experiment } from '../types';

export const nonReducingSugar: Experiment = {
  id: 'non-reducing-sugar',
  title: 'Test for non-reducing sugars',
  outcomeLabels: {
    present: 'Positive test',
    absent: 'Negative test',
  },

  steps: [
    {
      id: 'sample',
      procedure: '2 ml of the sample solution was measured into a clean test tube.',
      run: (lab) => lab.addReagent('sample', 2),
      observation: { present: 'A colourless solution.', absent: 'A colourless solution.' },
    },
    {
      id: 'acid',
      procedure: '2 ml of dilute hydrochloric acid was added.',
      run: (lab) => lab.addReagent('hcl', 2),
      observation: {
        present: 'No visible change. The solution stayed colourless.',
        absent: 'No visible change. The solution stayed colourless.',
      },
    },
    {
      id: 'heat',
      procedure: 'The mixture was heated in a Bunsen flame, held with a test tube holder.',
      run: async (lab) => {
        await lab.setFlame(true);
        await lab.pickUpTube();
        await lab.moveTube('flame');
        lab.say('Heating the mixture');
        lab.patchTube({ temp: 'hot', bubbling: true });
        await lab.wait(3200);
        lab.patchTube({ bubbling: false });
        await lab.setFlame(false);
      },
      observation: {
        present: 'The solution stayed colourless and began to boil gently.',
        absent: 'The solution stayed colourless and began to boil gently.',
      },
    },
    {
      id: 'cool',
      procedure: 'The tube was cooled under running tap water.',
      run: async (lab) => {
        await lab.moveTube('tap');
        await lab.setTap(true);
        lab.say('Cooling the tube under running water');
        lab.patchTube({ temp: 'cold' });
        await lab.wait(2600);
        lab.patchTube({ temp: 'normal' });
        await lab.setTap(false);
        await lab.moveTube('rack');
        await lab.releaseTube();
      },
      observation: {
        present: 'The tube cooled to room temperature. The solution was still colourless.',
        absent: 'The tube cooled to room temperature. The solution was still colourless.',
      },
    },
    {
      id: 'base',
      procedure: '2 ml of sodium hydroxide solution was added to neutralise the acid.',
      run: (lab) => lab.addReagent('naoh', 2),
      observation: {
        present: 'No visible change. The solution stayed colourless.',
        absent: 'No visible change. The solution stayed colourless.',
      },
    },
    {
      id: 'benedict',
      procedure: "2 ml of Benedict's solution was added.",
      run: (lab) => lab.addReagent('benedict', 2),
      observation: {
        present: 'The colourless solution turned blue solution,',
        absent: 'The colourless solution turned blue solution;',
      },
    },
    {
      id: 'boil',
      procedure: 'The mixture was boiled.',
      run: async (lab, outcome) => {
        await lab.setFlame(true);
        await lab.pickUpTube();
        await lab.moveTube('flame');
        lab.say('Boiling the mixture');
        lab.patchTube({ temp: 'hot', bubbling: true });
        if (outcome === 'present') {
          await lab.wait(1200);
          lab.patchTube({ color: LIQUID.green });
          await lab.wait(1300);
          lab.patchTube({ color: LIQUID.orange });
          await lab.wait(1300);
          lab.patchTube({ color: LIQUID.brick, precipitate: 1 });
          await lab.wait(1500);
        } else {
          await lab.wait(5200);
        }
        lab.patchTube({ bubbling: false });
        await lab.setFlame(false);
        await lab.moveTube('rack');
        lab.patchTube({ temp: 'normal' });
        await lab.releaseTube();
      },
      observation: {
        present: 'to green solution, to orange precipitate, to brown precipitate.',
        absent: 'The solution stayed blue. No precipitate formed.',
      },
    },
  ],

  deduction: {
    present: {
      result: 'Non-reducing sugars present.',
    },
    absent: {
      result: 'Non-reducing sugars absent.',
    },
  },
};
