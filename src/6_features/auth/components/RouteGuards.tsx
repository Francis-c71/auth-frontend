/**
 * Navigate redirect users to another route,
 * Outlet display the current child route,
 * useLocated gets information about the current URL anad navigation state,
 * Displays a loading screen while authentication is checked,
 * resolveRedirect safely determines where to sent user after login,
 * paths holds reusable routh paths such as login and dashboard,
 * useAuth reads the authentication state from your auth context.
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { FullPageSpinner } from '@/4_components/ui/Spinner';
import { resolveRedirect } from '@/2_lib/redirect';
import { paths } from '@/7_routes/paths';
import { useAuth } from '../contexts/AuthContext';

/** 
 * Allows signed-in user into a protected routes, 
 * checks wether you are allowed into the app. 
 * The user wanted /dashboard but isn't signed in. We save /dashboard so 
 * they can return there after logging in.
 */
export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <FullPageSpinner label="Checking your session" />;
  if (status === 'unauthenticated') {
    return <Navigate to={paths.login} replace state={{ from: location }} />;
  }
  return <Outlet />;
}

/** 
 * For sign-in and sign-up pages,
 * checks wehter you still needs to sign-in,
 * signed-in users are sent on to the app.
 * It reads the saved destination using location.state and 
 * redirects the signed-in user there. 
 */
export function GuestRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <FullPageSpinner label="Checking your session" />;
  if (status === 'authenticated') {
    return <Navigate to={resolveRedirect(location.state, paths.dashboard)} replace />;
  }
  return <Outlet />;
}
