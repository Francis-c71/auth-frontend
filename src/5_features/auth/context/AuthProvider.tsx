/**
 * The manager of the app authenticatio system, keeping track of who is logged in,
 * responds to login logout events, restores sessions, and shares the 
 * current authentication state with the rest of the app components.
 */

// useCallback is for caching functions i.e memoized functions so they don't get recreated on every render,
// as long as their dependencies don't change. This is useful for performance optimization,
// and preventing unnecessary re-renders of child components that depend on these functions.

// useEffect is for running side effects after rendering (dependencies changed), such as fetching data, subscribing to events, or manually changing the DOM. 
// It can also be used for cleanup when a component unmounts or before re-running the effect.
// 3 TYPES OF DEPENDENCIES: 1. No dependencies/array: runs after every render. 2. Empty array: runs only once after the first render/mount. 3. Array with dependencies: runs after the first render and whenever any dependency changes.
// CLEANUP: 1. Before the effect runs again (if dependencies changed). 2. When the component unmounts (removed from the DOM).
// If you don't clean up, you get memory leaks, duplicate event listeners, duplicate times, duplicate API calls, and other unexpected behaviors.

// useMemo is for caching values i.e memoized values so they don't get recalculated on every render, as long as their dependencies don't change. 
// This is useful for performance optimization, especially for expensive calculations or objects that are used in dependency arrays of other hooks.
// Use it for expensive calculations, filtering or sorting large arrays, creating objects or arrays that are used in dependency arrays of other hooks, 
// and preventing unnecessary re-renders of child components that depend on these values.

// useReducer is for managing complex state logic in function components
// It is an alternative to useState, for state with multiple sub-values and many actions or depends on previous state.


// ReactNode is a TypeScript type that represents any valid React child, 
// such as a string, number, element, JSX, array, fragment or nothing, that you can render in a component. 
// It is used for typing the children prop of a component, which can accept any valid React content.

import { useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { broadcastAuth, subscribeAuth } from '@/2_lib/authChannel';
import { onSessionExpired } from '@/2_lib/http';
import { tokenStore } from '@/2_lib/tokenStore';
import { authApi } from '../api/auth.api';
import type { AuthStatus, User } from '../types';
import { AuthContext, type AuthContextValue } from './context';

/**
 * The current record of authentication, 
 * loading, authenticated, unauthenticated,
 * and logged-in user informations, 
 * or null if there's no user.
 */
interface State {
  status: AuthStatus;
  user: User | null;
}

/**
 * What happened?, signals are sent to the state manager to register a new state,
 * so that it can share the new state with other functions.
 * e.g., user's new session created, user's information changed, user's session ended.
 * Each action has a type that identifies the event.
 */
type Action =
  | { type: 'SIGNED_IN'; user: User }
  | { type: 'USER_UPDATED'; user: User }
  | { type: 'SIGNED_OUT' };


/**
 * How the state should change, "the contract".
 * Receives the current state, an action and return a new state,
 * it doesn't perform an API request, it only decides how the state should change.
 */
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

/**
 * AuthProvider is a react component.
 * children is whatever component placed inside of it.
 * ReactNode is a type that allows react contents such as components, text or fragments.
 * state is the current authentication information,
 * dispatch(action) sends action to the reducer.
 * useReducer connects your state to the reducer.
 * Initially, the app id 'loading' because it hasn't yet checked wether a session can be restored.
 * For example `dispatch({ type: 'SIGNED-OUT' })` tells the reducer to clear the user and mark the app unautheticated.
 * 
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { status: 'loading', user: null });

  /** Restore an existing session:
   *  Attempt to restore the existing session using refresh cookie,
   * if successfull, the returned user is stored in the state,
   * else, the app switches to the SIGNED OUT state.
   */
  const restore = useCallback(async () => {
    try {
      dispatch({ type: 'SIGNED_IN', user: await authApi.restoreSession() });
    } catch {
      dispatch({ type: 'SIGNED_OUT' });
    }
  }, []);
  
  /**
   * Run restoration when the app starts, when provider first loads:
   * Silent sign-in on first load, using the refresh cookie;
   * useEffect runs after the mounts starts.
   * The returned Promise is intentionally not awaited.
   * The effect re-runs if the function reference changes.
   */
  useEffect(() => {
    void restore();
  }, [restore]);

  /**
   * The HTTP layer reports when a refresh fails, which ends the session.
   */
  useEffect(
    () =>
      onSessionExpired(() => {
        tokenStore.clear();
        dispatch({ type: 'SIGNED_OUT' });
      }),
    [],
  );

  /** 
   * Other tabs signing in or out.
   */
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

  /**
   * The AuthContextValue['login'] retrieves the type of the login property from the interface,
   * this ensures that the function matches that contract.
   */
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

  /**
   * Creates the package of information and controls that other app components receives,
   * useMemo uses the same objetc until one of its dependencies changes,
   * this prevents unnecessary context updates caused by creating a new object on every render.
   */
  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, register, logout, refreshUser }),
    [state, login, register, logout, refreshUser],
  );

  /** 
   * Share everything to the rest of the app components:
   * This is where context becomes available to the rest of the decendants components,
   * usually through a custom authentication hook -- to access the user and authentication functions.
  */
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