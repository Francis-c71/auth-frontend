import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '@/3_components/ui/Alert';
import { Button } from '@/3_components/ui/Button';
import { Logo } from '@/3_components/ui/Logo';
import { useAuth } from '@/5_features/auth/context/useAuth';
import { paths } from '@/6_routes/paths';

/** Placeholder for the signed-in area. Replace the content, keep the shell. */
export function DashboardPage() {
  const { user, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null; // <ProtectedRoute> guarantees a user; this narrows the type.

  const firstName = user.name.split(' ')[0];
  const memberSince = user.createdAt
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(user.createdAt))
    : null;

  async function handleSignOut() {
    setSigningOut(true);
    await logout();
  }

  return (
    <div className="min-h-dvh bg-mist-soft">
      <header className="border-b border-mist bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate sm:inline">{user.email}</span>
            <Button variant="secondary" className="px-4 py-2 text-sm" loading={signingOut} onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight">Hi, {firstName}</h1>
        <p className="mt-2 text-lg text-slate">You’re signed in. This is where your app begins.</p>

        {!user.emailVerified && (
          <Alert variant="info" className="mt-8">
            Your email isn’t verified yet.{' '}
            <Link
              to={paths.verifyEmail}
              state={{ email: user.email }}
              className="font-semibold text-blue underline underline-offset-4"
            >
              Verify your email
            </Link>
          </Alert>
        )}

        <section aria-labelledby="account-heading" className="mt-10 rounded-xl border border-mist bg-white p-6 sm:p-8">
          <h2 id="account-heading" className="text-xl font-bold">
            Your account
          </h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <Detail label="Name" value={user.name} />
            <Detail label="Email" value={user.email} />
            <Detail label="Email status" value={user.emailVerified ? 'Verified' : 'Not verified'} />
            {memberSince && <Detail label="Member since" value={memberSince} />}
          </dl>
        </section>
      </main>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-slate-600">{label}</dt>
      <dd className="mt-1 break-words text-base font-semibold text-navy">{value}</dd>
    </div>
  );
}
