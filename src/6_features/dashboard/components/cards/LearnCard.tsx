import { FOOD_TESTS, canAccess } from '../../data/foodTest';
import type { DashboardUser } from '../../types';
import { CardHeader, Tag, focusRing } from './parts';

interface LearnCardProps {
  user: DashboardUser;
  /** Called when a locked test is clicked. */
  onLocked: () => void;
}

const row = '-mt-px flex w-full items-center justify-between gap-4 border border-border px-4 py-3 text-left first:mt-0';

export function LearnCard({ user, onLocked }: LearnCardProps) {
  return (
    <div>
      <CardHeader title="Food tests" note="Choose a test to run." />
      <ul>
        {FOOD_TESTS.map((test) => {
          const body = (
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{test.name}</span>
              <span className="mt-0.5 block text-sm text-white/65">{test.description}</span>
            </span>
          );

          if (!test.href) {
            return (
              <li key={test.id}>
                <div className={`${row} text-white/55`}>
                  {body}
                  <Tag>Coming soon</Tag>
                </div>
              </li>
            );
          }
          if (!canAccess(test, user)) {
            return (
              <li key={test.id}>
                <button type="button" onClick={onLocked} className={`${row} hover:bg-[#1c1c1c] ${focusRing}`}>
                  {body}
                  <Tag>Pay to access</Tag>
                </button>
              </li>
            );
          }
          return (
            <li key={test.id}>
              <a href={test.href} className={`${row} hover:bg-[#1c1c1c] ${focusRing}`}>
                {body}
                <Tag>Open</Tag>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}