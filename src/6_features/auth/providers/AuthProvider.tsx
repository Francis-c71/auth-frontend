
import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { broadcastAuth, subscribeAuth } from '@/2_lib/authChannel';
import { onSessionExpired } from '@/2_lib/http';
import { tokenStore } from '@/2_lib/tokenStore';
import { authApi } from '../services/auth.service'
import type { User } from '../models/User';
import type { AuthStatus } from '../models/Auth';
import { AuthContext, type AuthContextValue } from '../contexts/AuthContext';


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
  
  
  useEffect(() => {
    void restore();
  }, [restore]);

  
  useEffect(
    () =>
      onSessionExpired(() => {
        tokenStore.clear();
        dispatch({ type: 'SIGNED_OUT' });
      }),
    [],
  );

  
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


/**
 * AUTHENTICATION FLOW
 *
 * 1. APP STARTS
 *       |
 *       v
 * 2. INITIAL STATE
 *    status: 'loading'
 *    user: null
 *       |
 *       v
 * 3. RESTORE SESSION
 *    authApi.restoreSession()
 *       |
 *       +---- Success ----> SIGNED_IN
 *       |                       |
 *       |                       v
 *       |                Store user in state
 *       |
 *       +---- Failure ----> SIGNED_OUT
 *                               |
 *                               v
 *                        Clear user from state
 *
 * 4. USER ACTIONS
 *       |
 *       +---- login() --------> SIGNED_IN
 *       |
 *       +---- register() -----> SIGNED_IN (if user returned)
 *       |
 *       +---- logout() -------> SIGNED_OUT
 *       |
 *       +---- refreshUser() --> USER_UPDATED
 *
 * 5. EXTERNAL EVENTS
 *       |
 *       +---- Session expires --> Clear tokens + SIGNED_OUT
 *       |
 *       +---- Another tab signs out --> SIGNED_OUT
 *       |
 *       +---- Another tab signs in --> Restore session
 *
 * 6. REDUCER UPDATES STATE
 *       |
 *       v
 * 7. useMemo BUILDS CONTEXT VALUE
 *       |
 *       v
 * 8. AuthContext.Provider SHARES VALUE
 *       |
 *       v
 * 9. CHILD COMPONENTS ACCESS AUTH DATA
 *    user / status / login / register / logout / refreshUser
 */