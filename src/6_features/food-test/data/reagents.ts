import { LIQUID } from '@/4_components/lab';

export type ReagentKey = 'sample' | 'hcl' | 'naoh' | 'benedict';

export interface Reagent {
  key: ReagentKey;
  /** Short text printed on the bottle. */
  label: string;
  /** Full name, used in captions. */
  name: string;
  /** Colour of the liquid in the bottle and cylinder. */
  color: string;
  /** Colour the test tube takes on when this is added, or null if it changes nothing. */
  tint: string | null;
}

export const REAGENTS: Record<ReagentKey, Reagent> = {
  sample: { key: 'sample', label: 'Sample', name: 'the sample solution', color: LIQUID.clear, tint: null },
  hcl: { key: 'hcl', label: 'dil. HCl', name: 'dilute hydrochloric acid', color: LIQUID.clear, tint: null },
  naoh: { key: 'naoh', label: 'NaOH', name: 'sodium hydroxide solution', color: LIQUID.clear, tint: null },
  benedict: { key: 'benedict', label: "Benedict's", name: "Benedict's solution", color: LIQUID.blue, tint: LIQUID.blue },
};

/** Left-to-right order of the bottles on the bench. */
export const BOTTLE_ORDER: ReagentKey[] = ['sample', 'hcl', 'naoh', 'benedict'];
