
import { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import { Button } from '@/3_components/ui/Button';
import { MiniSpinner } from '@/3_components/ui/Spinner';
import { TextLink } from '@/3_components/ui/TextLink';
import { getErrorMessage } from '@/2_lib/errors';
import { paths } from '@/6_routes/paths';

import { authApi } from '../api/auth.api';
import { AuthHeading } from '../components/AuthHeading';
import { useAuth } from '../context/useAuth';
import { ErrorToast, SuccessToast } from '@/3_components/ui/Toast';

const RESEND_COOLDOWN_SECONDS = 30;

/** With ?token=... it confirms the address. Without one it tells the user to check their inbox. */
export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token');

  return token ? <ConfirmToken token={token} /> : <CheckInbox />;
}

function ConfirmToken({ token }: { token: string }) {
  const { status, refreshUser } = useAuth();

  const [state, setState] = useState<'verifying' | 'success' | 'error'>(
    'verifying',
  );
  const [message, setMessage] = useState<string | null>(null);

  // Verification tokens are single-use, so guard against React StrictMode's double effect.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    authApi.verifyEmail(token)
      .then(async () => {
        await refreshUser();
        setMessage('Thanks. Your email address is confirmed.');
        setState('success');
      })
      .catch((err: unknown) => {
        setMessage(
          getErrorMessage(
            err,
            'This verification link is invalid or has expired.',
          )
        );
        setState('error');
      });
  }, [token, refreshUser]);

  if (state === 'verifying') {
    return (
      <div className="flex items-center gap-3 text-slate" role="status">
        <MiniSpinner className="h-5 w-5 text-blue" />
        <span>Verifying your email...</span>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <>
        {message && (<SuccessToast message={message} onDismiss={() => setMessage('')}/> )}

        <AuthHeading title="Email verified" />

        <p className="mt-8 text-center">
          <TextLink
            to={
              status === 'authenticated'
                ? paths.dashboard
                : paths.login
            }
          >
            {status === 'authenticated' ? 'Go to your dashboard' : 'Sign In'}
          </TextLink>
        </p>
      </>
    );
  }

  return (
    <>
      {message && (<ErrorToast message={message} onDismiss={() => setMessage('')}/> )}

      <AuthHeading title="Couldn’t verify your email" />

      <p className="mt-8 text-center">
        <TextLink to={paths.login}>
          Sign in to request a new link
        </TextLink>
      </p>
    </>
  );
}

function CheckInbox() {
  const location = useLocation();

  const email = (location.state as { email?: string } | null)?.email;
  const notice = (location.state as { notice?: string } | null)?.notice;

  const [successMessage, setSuccessMessage] = useState<string | null>(
    notice ?? null,
  );
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{
    kind: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;

    const id = window.setTimeout(
      () => setCooldown((seconds) => seconds - 1),
      1000,
    );

    return () => window.clearTimeout(id);
  }, [cooldown]);

  async function resend() {
    if (!email) return;

    setSending(true);
    setResult(null);

    try {
      await authApi.resendVerification(email);
      setResult({ kind: 'success', text: 'We sent you a new link.' });
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setResult({
        kind: 'error',
        text: getErrorMessage(err, 'Couldn’t send the email. Try again.'),
      });
    } finally {
      setSending(false);
    }
  }

  function sentMessageInformation() {
    return email ? (
      <>
        We sent a verification link to{' '}
        <strong className="font-semibold text-white">{email}</strong>. Open it
        to finish setting up your account.
      </>
    ) : (
      'We sent you a verification link. Open it to finish setting up your account.'
    );
  }

  return (
    <>
      <AuthHeading
        title="Check your inbox"
        description={sentMessageInformation()}
      />

      {successMessage && (
        <SuccessToast
          message={successMessage}
          onDismiss={() => setSuccessMessage(null)}
        />
      )}

      {result?.kind === 'success' && (
        <SuccessToast
          message={result.text}
          onDismiss={() => setResult(null)}
        />
      )}

      {result?.kind === 'error' && (
        <ErrorToast
          message={result.text}
          onDismiss={() => setResult(null)}
        />
      )}

      {email && (
        <Button
          fullWidth
          loading={sending}
          disabled={cooldown > 0}
          onClick={resend}
        >
          {cooldown > 0
            ? `Resend email in ${cooldown}s`
            : 'Resend email'}
        </Button>
      )}

      <p className="mt-8 text-center">
        <TextLink to={paths.login}>Back to sign in</TextLink>
      </p>
    </>
  );
};