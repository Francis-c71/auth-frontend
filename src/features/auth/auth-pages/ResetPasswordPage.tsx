import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { PasswordField } from '@/components/ui/PasswordField';
import { PasswordStrength } from '@/components/ui/PasswordStrength';
import { TextLink } from '@/components/ui/TextLink';
import { applyApiError } from '@/lib/forms';
import { paths } from '@/routes/paths';
import { authApi } from '../auth-api/auth.api';
import { AuthHeading } from '../auth-components/AuthHeading';
import { resetPasswordSchema, type ResetPasswordValues } from '../auth-schemas';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token');

  if (!token) {
    return (
      <>
        <AuthHeading title="Link not valid" />
        <Alert variant="error">This reset link is incomplete. Request a new one to continue.</Alert>
        <p className="mt-8 text-center">
          <TextLink to={paths.forgotPassword}>Request a new link</TextLink>
        </p>
      </>
    );
  }

  return <ResetPasswordForm token={token} />;
}

function ResetPasswordForm({ token }: { token: string }) {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const passwordValue = watch('password');

  const onSubmit = handleSubmit(async ({ password }) => {
    setFormError(null);
    try {
      await authApi.resetPassword({ token, password });
      navigate(paths.login, {
        replace: true,
        state: { notice: 'Password updated. Sign in with your new password.' },
      });
    } catch (err) {
      setFormError(applyApiError(err, setError, ['password'], 'Couldn’t reset your password. Request a new link and try again.'));
    }
  });

  return (
    <>
      <AuthHeading title="Choose a new password" description="Use something you don’t use anywhere else." />

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {formError && (
          <Alert variant="error">
            {formError} <TextLink to={paths.forgotPassword}>Request a new link</TextLink>
          </Alert>
        )}

        <div>
          <PasswordField
            placeholder='New password'
            autoComplete="new-password"
            autoFocus
            hint="At least 8 characters, with a letter and a number."
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordStrength password={passwordValue} />
        </div>

        <PasswordField
          placeholder='Confirm new password'
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" fullWidth loading={isSubmitting}>
          Update password
        </Button>
      </form>
    </>
  );
}
