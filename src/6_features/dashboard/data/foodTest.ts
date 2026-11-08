import type { DashboardUser } from '../types';

export type Access = 'free' | 'paid';

export interface FoodTest {
  id: string;
  name: string;
  access: Access;
  /** Route of the test page. Leave it out while the test is not built yet. */
  href?: string;
}

export const FOOD_TESTS: FoodTest[] = [
  {
    id: 'reducing-sugar',
    name: 'Benedict\'s test.',
    access: 'free',
    href: '/food-test/reducing-sugar',
  },
  {
    id: 'non-reducing-sugar',
    name: 'Non-reducing sugars test.',
    access: 'paid',
    href: '/food-test/non-reducing-sugar',
  },
  { 
    id: 'starch', 
    name: 'Iodine test.', 
    access: 'paid' 
  },
  { 
    id: 'protein', 
    name: 'Buiret test.', 
    access: 'paid' 
  },
  { 
    id: 'lipids', 
    name: 'Emulsion test.',  
    access: 'paid' 
  },
  {
    id: 'vitamin-c',
    name: 'DCPIP test.',
    access: 'paid'
  },
];

/** Flip this to true when payments go live. */
const GATING_ENABLED = false;

/** The one place access rules live. */
export function canAccess(test: FoodTest, user: DashboardUser): boolean {
  return !GATING_ENABLED || test.access === 'free' || user.isPaid === true;
}