// import { forwardRef, type ButtonHTMLAttributes } from 'react';
// import { cn } from '@/lib/cn';
// import { MiniSpinner } from './Spinner';

// type Variant = 'primary' | 'secondary' | 'ghost';

// export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: Variant;
//   loading?: boolean;
//   fullWidth?: boolean;
// }

// //const base =
// //  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
// const base = 'justtify-center inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gradient2 to-gradient3 px-4 py-2 font-medium text-white text-center';

// const variants: Record<Variant, string> = {
//   primary: 'border border-amber-deep bg-cta text-navy hover:brightness-95 active:brightness-90',
//   secondary: 'border border-mist-strong bg-white text-navy hover:bg-mist-soft',
//   ghost: 'border border-transparent text-slate hover:bg-mist-soft',
// };

// export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
//   { variant = 'primary', loading = false, fullWidth = false, className, disabled, type = 'button', children, ...rest },
//   ref,
// ) {
//   return (
//     <button
//       ref={ref}
//       type={type}
//       disabled={disabled || loading}
//       aria-busy={loading || undefined}
//       className={cn(base, variants[variant], fullWidth && 'w-full', className)}
//       {...rest}
//     >
//       {loading && <MiniSpinner className="size-4" />}
//       <span className=" flex items-center justify-center">
//         {children}

//       </span>
//     </button>
//   );
// });


import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { MiniSpinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
}

const base =
  'relative inline-flex items-center justify-center rounded-lg px-4 py-2 text-base font-medium text-center transition ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gradient3 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
  primary: 'bg-gradient-to-r  from-gradient2 to-gradient3 text-white hover:brightness-110 active:brightness-95',
  secondary: 'border border-border-app bg-transparent text-white hover:bg-white/10',
  ghost: 'border border-transparent text-grey hover:bg-white/10',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', loading = false, fullWidth = false, className, disabled, type = 'button', children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(base, variants[variant], fullWidth && 'w-full', className)}
      {...rest}
    >
      {/* Spinner is overlaid so the button never changes size or shifts the label */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <MiniSpinner className="size-4" />
        </span>
      )}
      <span className={cn('inline-flex items-center justify-center gap-2', loading && 'invisible')}>
        {children}
      </span>
    </button>
  );
});