import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/features/auth/auth-components/AuthLayout';
import { GuestRoute, ProtectedRoute } from '@/features/auth/auth-components/RouteGuards';
import { paths } from './paths';

/**
 * Pages are lazy-loaded so the sign-in screen doesn't ship the dashboard
 * (and vice versa).
 */
export const router = createBrowserRouter([
  { path: paths.home, element: <Navigate to={paths.dashboard} replace /> },

  {
    // Only for signed-out users
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: paths.login,
            lazy: async () => ({ Component: (await import('@/features/auth/auth-pages/LoginPage')).LoginPage }),
          },
          {
            path: paths.register,
            lazy: async () => ({ Component: (await import('@/features/auth/auth-pages/RegisterPage')).RegisterPage }),
          },
          {
            path: paths.forgotPassword,
            lazy: async () => ({
              Component: (await import('@/features/auth/auth-pages/ForgotPasswordPage')).ForgotPasswordPage,
            }),
          },
        ],
      },
    ],
  },

  {
    // Reachable from email links, whatever the auth state
    element: <AuthLayout />,
    children: [
      {
        path: paths.resetPassword,
        lazy: async () => ({
          Component: (await import('@/features/auth/auth-pages/ResetPasswordPage')).ResetPasswordPage,
        }),
      },
      {
        path: paths.verifyEmail,
        lazy: async () => ({
          Component: (await import('@/features/auth/auth-pages/VerifyEmailPage')).VerifyEmailPage,
        }),
      },
    ],
  },

  {
    // Only for signed-in users
    element: <ProtectedRoute />,
    children: [
      {
        path: paths.dashboard,
        lazy: async () => ({
          Component: (await import('@/features/dashboard/DashboardPage')).DashboardPage,
        }),
      },
    ],
  },

  {
    path: '*',
    lazy: async () => ({ Component: (await import('@/pages/NotFoundPage')).NotFoundPage }),
  },
]);
