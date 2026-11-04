import type { ReactNode } from 'react';
import { Button } from '@/4_components/ui/Button';
import type { DashboardUser } from '../../types';
import { CardHeader, StatusBadge, focusRing } from './parts'

interface ProfileCardProps {
  user: DashboardUser;
  signingOut: boolean;
  onSignOut: () => void;
  /** Opens the Payments card. */
  onPay: () => void;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="-mt-px flex items-center justify-between gap-4 border border-border px-4 py-3 first:mt-0">
      <dt className="text-sm text-white/70">{label}</dt>
      <dd className="min-w-0 break-all text-right text-sm font-semibold">{children}</dd>
    </div>
  );
}

export function ProfileCard({ user, signingOut, onSignOut, onPay }: ProfileCardProps) {
  const isPaid = user.isPaid === true;
  const memberSince = user.createdAt
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(user.createdAt))
    : null;

  return (
    <div className='bg-panel text-paneltext border border-border'>
      <CardHeader title="Profile" />
      <dl>
        <Row label="Name">{user.name}</Row>
        <Row label="Email">{user.email}</Row>
        <Row label="Email status">
          <StatusBadge ok={user.isEmailVerified} yes="Verified" no="Not verified" />
        </Row>
        <Row label="Payment status">
          <StatusBadge ok={isPaid} yes="Paid" no="Not paid" />
        </Row>
        {memberSince && <Row label="Member since">{memberSince}</Row>}
      </dl>

      {!user.isEmailVerified && (
        <p className="-mt-px border border-border bg-[#181818] px-4 py-3 text-sm leading-relaxed text-white">
          Your email is not verified yet. Open the verification link we sent to your inbox.
        </p>
      )}
      {!isPaid && (
        <p className="-mt-px flex items-center justify-between gap-4 border border-border px-4 py-3 text-sm text-white/80">
          You have not paid yet.
          <button type="button" onClick={onPay} className={`font-semibold text-white underline underline-offset-4 ${focusRing}`}>
            Pay now
          </button>
        </p>
      )}

      <div className="-mt-px border border-border p-4">
        <Button variant="primary" className="w-full px-4 py-2 text-sm" loading={signingOut} onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}