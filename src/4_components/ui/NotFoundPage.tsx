import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { paths } from '@/7_routes/paths';

export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
      <p className="max-w-sm text-slate">The page you’re looking for doesn’t exist or has moved.</p>
      <Link
        to={paths.home}
        className="rounded-lg border border-amber-deep bg-cta px-5 py-3 font-semibold text-navy hover:brightness-95"
      >
        Go to the home page
      </Link>
    </div>
  );
}
