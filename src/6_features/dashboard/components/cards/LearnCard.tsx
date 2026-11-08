import { Link } from 'react-router-dom';
import { FOOD_TESTS, canAccess } from '../../data/foodTest';
import type { DashboardUser } from '../../types';
import { CardHeader, Tag, focusRing } from './parts';

interface LearnCardProps {
  user: DashboardUser;
  /** Called when a locked test is clicked. */
  onLocked: () => void;
}

const row = '-mt-px flex w-full items-center bg-background text-backgroundtext justify-between gap-4 border border-border px-4 py-3 text-left first:mt-0';

export function LearnCard({ user, onLocked }: LearnCardProps) {
  return (
    <div>
      <CardHeader chapter="Physiology." topic="Food tests." />
      <ul>
        {FOOD_TESTS.map((test) => {
          const body = (
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{test.name}</span>
            </span>
          );

          if (!test.href) {
            return (
              <li key={test.id}>
                <div className={`${row}`}>
                  {body}
                  <Tag>Coming soon</Tag>
                </div>
              </li>
            );
          }
          if (!canAccess(test, user)) {
            return (
              <li key={test.id}>
                <button type="button" onClick={onLocked} className={`${row} hover:bg-panel ${focusRing}`}>
                  {body}
                  <Tag>Pay to access</Tag>
                </button>
              </li>
            );
          }
          return (
            <li key={test.id}>
              <Link to={test.href} className={`${row} hover:bg-panel ${focusRing}`}>
                  {body}
                  <Tag>Open</Tag>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}