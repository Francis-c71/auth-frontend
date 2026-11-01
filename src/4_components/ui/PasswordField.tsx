import { forwardRef, useState } from 'react';
import { TextField, type TextFieldProps } from './TextField';

type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'trailing'>;

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(props, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      ref={ref}
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="flex h-9 w-9 items-center justify-center rounded-md text-border hover:text-hover focus-visible:outline-1"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
    />
  );
});

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.6 5.1A9.9 9.9 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6C3.7 8.5 2 12 2 12s3.6 7 10 7a9.6 9.6 0 0 0 4-.9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" strokeLinecap="round" />
    </svg>
  );
}
