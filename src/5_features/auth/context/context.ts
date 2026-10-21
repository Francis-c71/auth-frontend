/**
 * This file defines the structure of the authentication context, 
 * it specifies what authentication data and function a react components can access,
 * but does not implement the login and or registration logic.
 */

/** 
 * `createContext` creates a shred container for data that multiple components can access, 
 * like a central box that holds authentication informations
 * `import types` means that the imports are inly for type checking, not as JS runtime values.
*/
import { createContext } from 'react';
import type { AuthStatus, LoginInput, RegisterInput, User } from '../types';

/** 
 * An interface defines the structure of an object, here it defines what an authentication context must have 
 * The current authentication status.
 * Logged in user or null if no user is available.
 * Accept login details and complete login aynchronously.
 * Accepts a regitration details and returns weather the verification is required.
 * Signs the user out asynchronously.
 * Re-fetches the profile, e.g. after the email gets verified.
 */
export interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<{ verificationRequired: boolean }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

/**
 * Create a context that other files can import,
 * tells TS what value the Context, the AuthContext can hold,
 * i.e the context can hold an authentication object or null.
 * Sets the default value to null, meaning no authentication context value has been provided.
 */
export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * This file defines the authentication contract, not the actual authentication behaviour.
 * The AuthProvider suplies the values and implement those functions described by that contract, "Signs the contract".
 * The components uses the context to access the user, login, logout and other functions.
 */


/**
 * AUTH CONTEXT FLOW
 *
 * 1. IMPORT DEPENDENCIES
 *    createContext + authentication types
 *              |
 *              v
 * 2. DEFINE AuthContextValue
 *    Describes what authentication provides:
 *    - status
 *    - user
 *    - login()
 *    - register()
 *    - logout()
 *    - refreshUser()
 *              |
 *              v
 * 3. CREATE AuthContext
 *    createContext<AuthContextValue | null>(null)
 *              |
 *              v
 * 4. AuthProvider (defined in another file)
 *    Supplies the actual data and function implementations
 *              |
 *              v
 * 5. CHILD COMPONENTS
 *    Access authentication through useContext(AuthContext)
 *              |
 *              v
 * 6. USE AUTH FUNCTIONS
 *    login() / register() / logout() / refreshUser()
 */
