
// Imports ReactNode for typing React content and cn for combining CSS classes.
// Defines three alert variants: error, success, and info.
// Maps each variant to its corresponding Tailwind CSS styles.
// Defines AlertProps with an optional variant, required children, and optional className.
// variant defaults to info when not provided.
// Uses role="alert" for errors and role="status" for success/info messages for accessibility.
// Combines common styles, variant styles, and optional custom styles using cn().
// Renders children as the alert's content.
// Overall, it is a reusable, type-safe, and accessible component for displaying application messages.
 
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'error' | 'success' | 'info';

const styles: Record<Variant, string> = {
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-green-200 bg-green-50 text-green-800',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
};

interface AlertProps {
  variant: Variant;
  children: ReactNode;
  className?: string;
}

export function Alert({ variant, children, className }: AlertProps) {
 return( <div
  role={variant === 'error' ? 'alert' : 'status'}
  className={cn(
    'flex items-center gap-4 rounded-md border-2 border-l-4 p-4 mt-4 font-medium md:mx-auto ',
    styles[variant],
    className
  )}
>
  <p className="min-w-0 break-all flex-1 text-xl">
    <strong>
      {variant === 'error'
        ? 'Error'
        : variant === 'success'
          ? 'Success'
          : 'Info'}!
    </strong>{' '}
    {children}
  </p>

  <button
    aria-label="Dismiss"
    className="shrink-0 text-2xl"
  >
    <span aria-hidden>&times;</span>
  </button>
</div>
)
}