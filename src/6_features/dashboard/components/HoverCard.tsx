import { useEffect, useRef, type ReactNode } from 'react';
import { focusRing } from './cards/parts';

interface HoverCardProps {
  id: string;
  label: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  children: ReactNode;
}

const OPEN_DELAY = 120;
const CLOSE_DELAY = 220;

/** A bar button with a card. Opens on mouse hover, and on click, tap or Enter. */
export function HoverCard({ id, label, open, onOpen, onClose, children }: HoverCardProps) {
  const timer = useRef<number | undefined>(undefined);
  const cancel = () => window.clearTimeout(timer.current);
  const later = (fn: () => void, ms: number) => {
    cancel();
    timer.current = window.setTimeout(fn, ms);
  };
  useEffect(() => cancel, []);

  return (
    <div
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') later(onOpen, OPEN_DELAY);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') later(onClose, CLOSE_DELAY);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-card`}
        onClick={() => {
          cancel();
          if (open) onClose();
          else onOpen();
        }}
        className={`border border-border px-2 py-2 text-lg font-medium ${focusRing} ${
          open ? 'border-border bg-[#1c1c1c] text-white' : 'border-transparent text-white/80 hover:bg-[#1c1c1c] hover:text-white'
        }`}
      >
        {label}
      </button>

      {open && (
        <div
          id={`${id}-card`}
          role="region"
          aria-label={label}
          className="fixed inset-x-4 top-16 z-50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:w-[24rem] sm:pt-2"
        >
          <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto border border-border bg-[#111111] shadow-2xl shadow-black">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}