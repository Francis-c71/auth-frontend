import { useState } from 'react';
import { CardHeader, focusRing } from './parts';

type Method = 'mtn' | 'airtel';

const METHODS: { id: Method; name: string; mark: string }[] = [
  { id: 'mtn', name: 'MTN MobileMoney', mark: 'MTN' },
  { id: 'airtel', name: 'Airtel Money', mark: 'Airtel' },
];

interface PaymentsCardProps {
  isPaid: boolean;
  /** Wire each method to its payment page here later. */
  onSelect?: (method: Method) => void;
}

export function PaymentsCard({ isPaid, onSelect }: PaymentsCardProps) {
  const [picked, setPicked] = useState<Method | null>(null);

  if (isPaid) {
    return (
      <div>
        <CardHeader title="Payments" />
        <p className="border border-border px-4 py-4 text-sm leading-relaxed text-white/85">
          Payment received. You have full access.
        </p>
      </div>
    );
  }

  return (
    <div>
      <CardHeader title="Payments" note="Choose how you want to pay." />
      <ul>
        {METHODS.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => {
                setPicked(m.id);
                onSelect?.(m.id);
              }}
              className={`-mt-px flex w-full items-center gap-4 border border-border px-4 py-3 text-left hover:bg-[#1c1c1c] first:mt-0 ${focusRing}`}
            >
              <span className="grid h-9 w-14 shrink-0 place-items-center border border-border bg-[#181818] text-xs font-bold">
                {m.mark}
              </span>
              <span className="text-sm font-semibold">{m.name}</span>
            </button>
          </li>
        ))}
      </ul>
      {picked && (
        <p aria-live="polite" className="-mt-px border border-border px-4 py-3 text-sm text-white/70">
          Payment with {METHODS.find((m) => m.id === picked)?.name} is coming soon.
        </p>
      )}
    </div>
  );
}