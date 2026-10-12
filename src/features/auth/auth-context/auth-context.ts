import { createContext } from 'react';
import type { AuthStatus, LoginInput, RegisterInput, User } from '../auth-types';

export interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<{ verificationRequired: boolean }>;
  logout: () => Promise<void>;
  /** Re-fetches the profile, e.g. after the email gets verified. */
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
