import { useState } from 'react';
import { CardHeader, focusRing } from './parts';
import mtnMobileMoneyLogo from '../../assets/mtnMoMoLogo.png';
import airtelMoneyLogo from '../../assets/airtelMoneyLogo.png';

type Method = 'mtn' | 'airtel';

const METHODS: { id: Method; name: string; mark: string }[] = [
  { id: 'mtn', name: 'MTN MobileMoney', mark: mtnMobileMoneyLogo },
  { id: 'airtel', name: 'Airtel Money', mark: airtelMoneyLogo },
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
              className={`-mt-px flex w-full items-center gap-4 border border-border bg-background text-backgroundtext px-4 py-2 text-left hover:bg-hover hover:text-hovertext first:mt-0 ${focusRing}`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center border border-border bg-background">
                <img src={m.mark } alt="" className="max-h-full max-w-full object-contain" />
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