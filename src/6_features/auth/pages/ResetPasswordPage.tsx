
import { useCallback, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/4_components/ui/Button';
import { PasswordField } from '@/4_components/ui/PasswordField';
import { PasswordStrength } from '@/4_components/ui/PasswordStrength';
import { TextLink } from '@/4_components/ui/TextLink';
import { ErrorToast, SuccessToast } from '@/4_components/ui/Toast';
import { applyApiError } from '@/2_lib/forms';
import { paths } from '@/7_routes/paths';

import { authApi } from '../services/auth.service';
import { AuthHeading } from '../components/AuthHeading';
import { resetPasswordSchema, type ResetPasswordValues, } from '../models/Auth';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token');

  const [showInvalidLink, setShowInvalidLink] = useState(true);

  if (!token) {
    return (
      <>
        {showInvalidLink && (
          <ErrorToast
            message="This reset link is incomplete. Request a new one to continue."
            onDismiss={() => setShowInvalidLink(false)}
          />
        )}

        <AuthHeading title="Invalid link" />

        <p className="mt-8 text-center">
          <TextLink to={paths.forgotPassword}>
            Request a new link
          </TextLink>
        </p>
      </>
    );
  }

  return <ResetPasswordForm token={token} />;
}

function ResetPasswordForm({ token }: { token: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  const notice = (
    location.state as { notice?: string } | null
  )?.notice;

  const [successMessage, setSuccessMessage] = useState<string | null>(
    notice ?? 'Enter your new password below.',
  );

  const [formError, setFormError] = useState<string | null>(null);

  const dismissSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  const dismissError = useCallback(() => {
    setFormError(null);
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');

  const onSubmit = handleSubmit(async ({ password }) => {
    setFormError(null);

    try {
      await authApi.resetPassword({ token, password });

      navigate(paths.login, {
        replace: true,
        state: {
          notice: 'Password updated successfully. Please sign in.',
        },
      });
    } catch (err) {
      setFormError(
        applyApiError(
          err,
          setError,
          ['password'],
          'Couldn’t reset your password. Request a new link and try again.',
        ),
      );
    }
  });

  return (
    <>
      {formError && (
        <ErrorToast
          message={formError}
          onDismiss={dismissError}
        />
      )}

      {successMessage && (
        <SuccessToast
          message={successMessage}
          onDismiss={dismissSuccess}
        />
      )}

      <AuthHeading
        title="Choose a new password"
        description="Use something you don’t use anywhere else."
      />

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div>
          <PasswordField
            placeholder="New password"
            autoComplete="new-password"
            autoFocus
            hint="At least 8 characters, with a letter and a number."
            error={errors.password?.message}
            {...register('password')}
          />

          <PasswordStrength password={passwordValue} />
        </div>

        <PasswordField
          placeholder="Confirm new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {formError && (
          <p className="text-center">
            <TextLink to={paths.forgotPassword}>
              Request a new link
            </TextLink>
          </p>
        )}

        <Button type="submit" fullWidth loading={isSubmitting}>
          Update password
        </Button>
      </form>
    </>
  );
}
