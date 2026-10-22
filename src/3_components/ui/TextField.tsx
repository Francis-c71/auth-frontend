import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/2_lib/cn';

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** Rendered inside the input on the right (e.g. a show/hide button). */
  trailing?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, trailing, id, className, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-navy">{label}</label>

      <div className="relative">
        <input ref={ref} id={inputId} aria-invalid={error ? true : undefined} aria-describedby={describedBy} className={cn('block w-full rounded-lg border bg-app-bg px-3.5 py-2.5 text-white transition-colors','focus:outline-none focus:ring-1', error ? 'border-error focus:border-error focus:ring-error bg-app-bg': 'border-border-app focus:border-gradient3 focus:ring-gradient3 bg-app-bg', trailing && 'pr-12',className, )} {...rest}/>
        {trailing && <div className="absolute inset-y-0 right-1 flex items-center">{trailing}</div>}
      </div>

      {error ? (<p id={errorId} className="mt-1.5 text-sm font-medium text-wine">{error}</p>) : hint ? (<p id={hintId} className="mt-1.5 text-sm text-slate-600">{hint}</p>) : null}

    </div>
  );

});
