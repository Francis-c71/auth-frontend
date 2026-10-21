
import { useContext } from 'react';

// The AuthContext gives the contract of the shape of an abject that can be in it. 
import { AuthContext } from './context';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}
