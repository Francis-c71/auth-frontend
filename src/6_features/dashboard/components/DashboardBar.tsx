import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/4_components/ui/Logo';
import type { DashboardUser } from '../types';
import { LearnCard } from './cards/LearnCard';
import { PaymentsCard } from './cards/PaymentsCard';
import { ProfileCard } from './cards/ProfileCard';
import { HoverCard } from './HoverCard';

type MenuId = 'learn' | 'payments' | 'profile';

interface DashboardBarProps {
  user: DashboardUser;
  signingOut: boolean;
  onSignOut: () => void;
}

export function DashboardBar({ user, signingOut, onSignOut }: DashboardBarProps) {
  const [openId, setOpenId] = useState<MenuId | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Escape and clicks outside close whichever card is open.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null);
    };
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenId(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [openId]);

  // Only one card is open at a time, and one button leaving never closes another's card.
  const menu = (id: MenuId) => ({
    id,
    open: openId === id,
    onOpen: () => setOpenId(id),
    onClose: () => setOpenId((current) => (current === id ? null : current)),
  });

  const showPayments = () => setOpenId('payments');

  return (
    <header className="relative z-40 border border-border bg-[#111111]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
        <Logo />
        <nav ref={navRef} aria-label="Main" className="flex items-center gap-1">
          <HoverCard {...menu('learn')} label="Learn">
            <LearnCard user={user} onLocked={showPayments} />
          </HoverCard>
          <HoverCard {...menu('payments')} label="Payments">
            <PaymentsCard isPaid={user.isPaid === true} />
          </HoverCard>
          <HoverCard {...menu('profile')} label="Profile">
            <ProfileCard user={user} signingOut={signingOut} onSignOut={onSignOut} onPay={showPayments} />
          </HoverCard>
        </nav>
      </div>
    </header>
  );
}