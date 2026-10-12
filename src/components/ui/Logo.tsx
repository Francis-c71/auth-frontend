import { env } from '@/config/env';
import { cn } from '@/lib/cn';

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="16" className="fill-gold" />
      <circle cx="16" cy="13.5" r="3.5" className="fill-navy" />
      <path d="M16 15v6" className="stroke-navy" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className="h-8 w-8" />
      <span
        className={cn('font-display text-xl font-bold tracking-tight', tone === 'light' ? 'text-white' : 'text-navy')}
      >
        {env.appName}
      </span>
    </span>
  );
}
