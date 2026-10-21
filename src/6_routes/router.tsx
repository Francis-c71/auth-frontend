import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/5_features/auth/components/AuthLayout';
import { GuestRoute, ProtectedRoute } from '@/5_features/auth/components/RouteGuards';
import { paths } from './paths';

/**
 * createBrowerRouter defines all the routes, creates the application routing configuration.
 * lazy loads the page when it is needed.
 * createBrowserRouter() receives an array of route objects,
 * each object describes a route, a layout, a redirect, or a group of child routes,
 * think of createBrowserRouter() as creating a map, and RouterProvider as using that map to navigate the application.
 */

/**
 * path: the URL this route matches,
 * element: the React component to render,
 * <Navigate to={paths.dashboard} />: redirects to the dashboard,
 * replace: replaces the current browser history entry instead of adding another one,
 * children defines routes nested inside another route.
 */

/**
 * Instead of bringing every book into a room before anyone arrives, 
 * the application fetches the required book when someone asks for it.
 * This can reduce the JavaScript needed for the initial page load,
 * the actual benefit depends on your build and how the code is split.
 */
export const router = createBrowserRouter([
  { path: paths.home, 
    element: <Navigate to={paths.dashboard} replace /> 
  },
  {
    // Only for signed-out users
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: paths.login,
            lazy: async () => ({ Component: (await import('@/5_features/auth/pages/LoginPage')).LoginPage }),
          },
          {
            path: paths.register,
            lazy: async () => ({ Component: (await import('@/5_features/auth/pages/RegisterPage')).RegisterPage }),
          },
          {
            path: paths.forgotPassword,
            lazy: async () => ({ Component: (await import('@/5_features/auth/pages/ForgotPasswordPage')).ForgotPasswordPage,}),
          },
        ],
      },
    ],
  },

  {
    /**
     * These routes are outside GuestRoute and ProtectedRoute, making them
     * reachable from email links, whatever the auth state, both signed-in and signed-out users can reach these pages.
     */
    element: <AuthLayout />,
    children: [
      {
        path: paths.resetPassword,
        lazy: async () => ({ Component: (await import('@/5_features/auth/pages/ResetPasswordPage')).ResetPasswordPage,}),
      },
      {
        path: paths.verifyEmail,
        lazy: async () => ({ Component: (await import('@/5_features/auth/pages/VerifyEmailPage')).VerifyEmailPage,}),
      },
    ],
  },

  {
    // Only for signed-in users
    element: <ProtectedRoute />,
    children: [
      {
        path: paths.dashboard,
        lazy: async () => ({ Component: (await import('@/5_features/dashboard/DashboardPage')).DashboardPage,}),
      },
    ],
  },
  // The fallback route,
  // The * is a wildcard. It matches URLs that do not match a more specific route.
  {
    path: '*',
    lazy: async () => ({ Component: (await import('@/3_components/ui/NotFoundPage')).NotFoundPage,}),
  },
]);


/**
 * Why protect the route instead of the dashboard alone?
 * Because access control becomes reusable:
 * If you later add /settings, /profile, or 
 * /reports, you can place those pages inside the same protected parent 
 * rather than duplicating authentication checks in every page.
 * Also, client-side route protection is not a replacement for backend authorization, 
 * the server must still verify permissions for protected API requests.
 */
