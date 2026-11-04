
import { useState } from 'react';
import { useAuth } from '@/6_features/auth/contexts/AuthContext';
import { DashboardBar } from './components/DashboardBar';
import { HeroPanels } from './components/HeroPanels';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null; // <ProtectedRoute> guarantees a user; this narrows the type.


  async function handleSignOut() {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-brand text-paneltext">
      <DashboardBar user={user} signingOut={signingOut} onSignOut={handleSignOut} />
      <main className="flex flex-1">
        <HeroPanels/>
      </main>
    </div>
  );
}