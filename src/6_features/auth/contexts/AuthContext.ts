
import { createContext } from 'react';
import { useContext } from 'react';
import { User } from '../models/User';
import { AuthStatus, LoginInput, RegisterInput } from '../models/Auth';

export interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<{ verificationRequired: boolean }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}




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
