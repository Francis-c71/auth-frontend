import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { resolveRedirect } from '@/lib/redirect';
import { paths } from '@/routes/paths';
import { useAuth } from '../auth-context/useAuth';

/** Requires a signed-in user; remembers where they were headed. */
export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <FullPageSpinner label="Checking your session" />;
  if (status === 'unauthenticated') {
    return <Navigate to={paths.login} replace state={{ from: location }} />;
  }
  return <Outlet />;
}

/** For sign-in and sign-up pages: signed-in users are sent on to the app. */
export function GuestRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <FullPageSpinner label="Checking your session" />;
  if (status === 'authenticated') {
    return <Navigate to={resolveRedirect(location.state, paths.dashboard)} replace />;
  }
  return <Outlet />;
}
