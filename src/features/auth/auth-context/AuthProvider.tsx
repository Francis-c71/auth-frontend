import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { broadcastAuth, subscribeAuth } from '@/lib/authChannel';
import { onSessionExpired } from '@/lib/http';
import { tokenStore } from '@/lib/tokenStore';
import { authApi } from '../auth-api/auth.api';
import type { AuthStatus, User } from '../auth-types';
import { AuthContext, type AuthContextValue } from './auth-context';

interface State {
  status: AuthStatus;
  user: User | null;
}

type Action =
  | { type: 'SIGNED_IN'; user: User }
  | { type: 'USER_UPDATED'; user: User }
  | { type: 'SIGNED_OUT' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SIGNED_IN':
      return { status: 'authenticated', user: action.user };
    case 'USER_UPDATED':
      return { ...state, user: action.user };
    case 'SIGNED_OUT':
      return { status: 'unauthenticated', user: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { status: 'loading', user: null });

  const restore = useCallback(async () => {
    try {
      dispatch({ type: 'SIGNED_IN', user: await authApi.restoreSession() });
    } catch {
      dispatch({ type: 'SIGNED_OUT' });
    }
  }, []);

  // Silent sign-in on first load, using the refresh cookie.
  useEffect(() => {
    void restore();
  }, [restore]);

  // The HTTP layer reports when a refresh fails, which ends the session.
  useEffect(
    () =>
      onSessionExpired(() => {
        tokenStore.clear();
        dispatch({ type: 'SIGNED_OUT' });
      }),
    [],
  );

  // Other tabs signing in or out.
  useEffect(
    () =>
      subscribeAuth((message) => {
        if (message === 'signed-out') {
          tokenStore.clear();
          dispatch({ type: 'SIGNED_OUT' });
        } else {
          void restore();
        }
      }),
    [restore],
  );

  const login = useCallback<AuthContextValue['login']>(async (input) => {
    const user = await authApi.login(input);
    dispatch({ type: 'SIGNED_IN', user });
    broadcastAuth('signed-in');
  }, []);

  const register = useCallback<AuthContextValue['register']>(async (input) => {
    const { user, verificationRequired } = await authApi.register(input);
    if (user) {
      dispatch({ type: 'SIGNED_IN', user });
      broadcastAuth('signed-in');
    }
    return { verificationRequired };
  }, []);

  const logout = useCallback<AuthContextValue['logout']>(async () => {
    try {
      await authApi.logout();
    } catch {
      // Even if the server call fails, end the session locally.
    }
    tokenStore.clear();
    dispatch({ type: 'SIGNED_OUT' });
    broadcastAuth('signed-out');
  }, []);

  const refreshUser = useCallback<AuthContextValue['refreshUser']>(async () => {
    if (!tokenStore.get()) return;
    try {
      dispatch({ type: 'USER_UPDATED', user: await authApi.me() });
    } catch {
      // A failed refresh of the profile shouldn't sign anyone out.
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, register, logout, refreshUser }),
    [state, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
