
import { env } from '@/config/env';
import { cn } from '@/lib/cn';

export function LogoMark({ className }: { className?: string }) {
  return ( <img src="/fcc-logo.png" alt="" aria-hidden="true" className={cn('object-contain', className)} /> );
}

export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <span className="inline-flex items-center gap-2.5">

      <LogoMark className="h-10 w-10" />

      <span className={cn('font-display text-xl font-bold tracking-tight', tone === 'light' ? 'text-white' : 'text-navy')} >{env.appName}</span>
      
    </span>
  );
}
