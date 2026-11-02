import type { Outcome } from '../types';

interface OutcomeSelectorProps {
  value: Outcome;
  labels: Record<Outcome, string>;
  onChange: (outcome: Outcome) => void;
}

export function OutcomeSelector({ value, labels, onChange }: OutcomeSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Sample to test" className="inline-flex flex-wrap">
      {(Object.keys(labels) as Outcome[]).map((key) => {
        const selected = value === key;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(key)}
            className={`-ml-px px-4 py-2.5 text-sm first:ml-0 focus-visible:relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              selected ? 'bg-white font-bold text-[#000000]' : 'bg-[#111111] font-bold text-white/80 hover:bg-[#1c1c1c] hover:text-white' }`}
          >
            {labels[key]}
          </button>
        );
      })}
    </div>
  );
}
