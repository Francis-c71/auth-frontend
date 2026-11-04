import type { ReactNode } from 'react';

export const focusRing = 'bg-background text-backgroundtext hover:bg-hover hover: hovertext focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white';

export function CardHeader({ title, note }: { title: string; note?: string }) {
  return (
    <div className="bg-brand px-4 py-3">
      <h2 className="text-base font-bold">{title}</h2>
      {note && <p className="mt-0.5 text-sm text-foreground">{note}</p>}
    </div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="shrink-0 border border-border px-2 py-0.5 text-xs text-foreground">{children}</span>;
}

export function StatusBadge({ ok, yes, no }: { ok: boolean; yes: string; no: string }) {
  return (
    <span
      className={`border border-border px-2.5 py-0.5 text-xs font-semibold ${
        ok ? 'bg-backround text-background-text' : 'bg-panel text-soft'
      }`}
    >
      {ok ? yes : no}
    </span>
  );
}