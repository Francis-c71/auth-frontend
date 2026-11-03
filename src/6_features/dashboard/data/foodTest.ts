import type { DashboardUser } from '../types';

export type Access = 'free' | 'paid';

export interface FoodTest {
  id: string;
  name: string;
  description: string;
  access: Access;
  /** Route of the test page. Leave it out while the test is not built yet. */
  href?: string;
}

export const FOOD_TESTS: FoodTest[] = [
  {
    id: 'non-reducing-sugar',
    name: 'Non-reducing sugars',
    description: 'Hydrolyse with acid, then test with Benedict’s solution.',
    access: 'free',
    href: '/food-test',
  },
  { id: 'reducing-sugar', name: 'Reducing sugars', description: 'Benedict’s test.', access: 'free' },
  { id: 'starch', name: 'Starch', description: 'Iodine test.', access: 'free' },
  { id: 'protein', name: 'Proteins', description: 'Biuret test.', access: 'free' },
  { id: 'fats', name: 'Fats and oils', description: 'Emulsion test.', access: 'free' },
];

/** Flip this to true when payments go live. */
const GATING_ENABLED = false;

/** The one place access rules live. */
export function canAccess(test: FoodTest, user: DashboardUser): boolean {
  return !GATING_ENABLED || test.access === 'free' || user.isPaid === true;
}