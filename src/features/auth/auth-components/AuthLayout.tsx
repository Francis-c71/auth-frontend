import { Outlet } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { env } from '@/config/env';

export function AuthLayout() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">

      <aside className="relative hidden overflow-hidden bg-hero p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo tone="light" />
        <div className="relative z-10 max-w-md">
          <h2 className="text-5xl font-bold leading-[1.05] tracking-tight">The Living Science.</h2>
          <p className="mt-5 text-lg leading-relaxed text-mist">
            Practical Biology to Lower Secondary Curriculum.
          </p>
        </div>
        <p className="relative z-10 text-sm text-mist">
          © {new Date().getFullYear()} {env.appName}
        </p>

      </aside>

      <main className="flex flex-col">
        <header className="p-6 lg:hidden">
          <Logo />
        </header>
        <div className="flex flex-1 items-center justify-center px-6 pb-12 pt-4 lg:py-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
}
