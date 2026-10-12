import { cn } from '@/lib/cn';
import { passwordLabels, scorePassword, type PasswordScore } from '@/lib/password';

const segmentColor: Record<Exclude<PasswordScore, 0>, string> = {
  1: 'bg-wine',
  2: 'bg-amber',
  3: 'bg-gold',
  4: 'bg-blue',
};

export function PasswordStrength({ password }: { password: string }) {
  const score = scorePassword(password);
  if (score === 0) return null;

  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="flex flex-1 gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((segment) => (
          <span
            key={segment}
            className={cn('h-1.5 flex-1 rounded-full', segment <= score ? segmentColor[score] : 'bg-mist')}
          />
        ))}
      </div>
      <p className="w-14 text-right text-sm font-medium text-slate" aria-live="polite">
        {passwordLabels[score]}
      </p>
    </div>
  );
}
