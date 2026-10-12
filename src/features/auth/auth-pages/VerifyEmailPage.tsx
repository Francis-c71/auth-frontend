import { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { MiniSpinner } from '@/components/ui/Spinner';
import { TextLink } from '@/components/ui/TextLink';
import { getErrorMessage } from '@/lib/errors';
import { paths } from '@/routes/paths';
import { authApi } from '../auth-api/auth.api';
import { AuthHeading } from '../auth-components/AuthHeading';
import { useAuth } from '../auth-context/useAuth';

const RESEND_COOLDOWN_SECONDS = 30;

/** With ?token=… it confirms the address. Without one it tells the user to check their inbox. */
export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token');
  return token ? <ConfirmToken token={token} /> : <CheckInbox />;
}

function ConfirmToken({ token }: { token: string }) {
  const { status, refreshUser } = useAuth();
  const [state, setState] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  // Verification tokens are single-use, so guard against React StrictMode's double effect.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    authApi
      .verifyEmail(token)
      .then(async () => {
        await refreshUser();
        setState('success');
      })
      .catch((err: unknown) => {
        setMessage(getErrorMessage(err, 'This verification link is invalid or has expired.'));
        setState('error');
      });
  }, [token, refreshUser]);

  if (state === 'verifying') {
    return (
      <div className="flex items-center gap-3 text-slate" role="status">
        <MiniSpinner className="h-5 w-5 text-blue" />
        <span>Verifying your email…</span>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <>
        <AuthHeading title="Email verified" />
        <Alert variant="success">Thanks. Your email address is confirmed.</Alert>
        <p className="mt-8 text-center">
          <TextLink to={status === 'authenticated' ? paths.dashboard : paths.login} className='text-gradient3 no-underline'>
            {status === 'authenticated' ? 'Go to your dashboard' : 'Sign in'}
          </TextLink>
        </p>
      </>
    );
  }

  return (
    <>
      <AuthHeading title="Couldn’t verify your email" />
      <Alert variant="error">{message}</Alert>
      <p className="mt-8 text-center">
        <TextLink to={paths.login} className='text-gradient3 no-underline'>
          Sign in to request a new link
        </TextLink>
      </p>
    </>
  );
}

function CheckInbox() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
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
      setResult({ kind: 'error', text: getErrorMessage(err, 'Couldn’t send the email. Try again.') });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <AuthHeading
        title="Check your inbox"
        description={
          email ? (
            <>
              We sent a verification link to <strong className="font-semibold text-white">{email}</strong>. Open it to
              finish setting up your account.
            </>
          ) : (
            'We sent you a verification link. Open it to finish setting up your account.'
          )
        }
      />

      {result && (
        <Alert variant={result.kind} className="mb-5">
          {result.text}
        </Alert>
      )}

      {email && (
        <Button fullWidth loading={sending} disabled={cooldown > 0} onClick={resend} className='text-white'>
          {cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend email'}
        </Button>
      )}

      <p className="mt-8 text-center text-slate">
        <TextLink to={paths.login} className='text-gradient3 no-underline'>Back to sign in</TextLink>
      </p>
    </>
  );
}
