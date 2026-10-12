import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { TextLink } from '@/components/ui/TextLink';
import { ApiError } from '@/lib/errors';
import { paths } from '@/routes/paths';
import { authApi } from '../auth-api/auth.api';
import { AuthHeading } from '../auth-components/AuthHeading';
import { forgotPasswordSchema, type ForgotPasswordValues } from '../auth-schemas';

export function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    setFormError(null);
    try {
      await authApi.forgotPassword(email);
      setSentTo(email);
    } catch (err) {
      // Only surface problems the user can act on (rate limits, network). A 404 must look like success.
      if (err instanceof ApiError && (err.status === 0 || err.status === 429 || err.status >= 500)) {
        setFormError(err.message);
      } else {
        setSentTo(email);
      }
    }
  });

  if (sentTo) {
    return (
      <>
        <AuthHeading title="Check your email" />
        <Alert variant="success">
          An email sent to {sentTo}, click the link in the email to reset your password.
        </Alert>
        <p className="mt-8 text-center text-slate">
          <TextLink to={paths.login}>Sign In</TextLink>
        </p>
      </>
    );
  }

  return (
    <>
      <AuthHeading
        title="Reset your password"
        // description="Enter your email to set new password."
      />

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError && <Alert variant="error">{formError}</Alert>}

        <TextField
          placeholder='Email'
          type="email"
          autoComplete="email"
          inputMode="email"
          autoFocus
          error={errors.email?.message}
          {...register('email')}
        />
        <div></div>
        <Button type="submit" fullWidth loading={isSubmitting}>
          Send reset link
        </Button>
      </form>

      <p className="mt-2 text-center text-white">
        Remembered it? <TextLink to={paths.login} className='text-gradient3 no-underline hover:text-gradient2 hover:text-gradient2'>Sign In</TextLink>
      </p>
    </>
  );
}
