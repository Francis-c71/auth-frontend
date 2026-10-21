
import { Outlet } from 'react-router-dom';
import { Logo } from '@/3_components/ui/Logo';
import { env } from '@/1_config/env';

export function AuthLayout() {
  return (
    <div className="grid min-h-dvh bg-navy lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">

      {/* Left section: visible on large screens */}
      <aside className="relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Logo tone="light" />

        <div className="relative z-10 max-w-md">
          <h2 className="text-5xl font-bold leading-[1.05] tracking-tight">
            The Living Science.
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-mist">
            Practical Biology to Lower Secondary Curriculum.
          </p>
        </div>

        <p className="relative z-10 text-sm text-mist">
          © {new Date().getFullYear()} {env.appName}
        </p>
      </aside>

      {/* Right section: sign-in page */}
      <main className="flex min-h-dvh flex-col">

        {/* Mobile header and science text */}
        <header className="flex flex-col items-center p-6 text-white lg:hidden">

          <div className="mt-4 mb-8">
            <div className='pl-9 '>
              <Logo tone='light' />
            </div>
            <p className="mt-3 text-sm leading-relaxed font-semibold text-mist">
              Practical Biology to Lower Secondary Curriculum.
            </p>
          </div>
        </header>


        {/* Current child route, such as the sign-in page */}
        <div className="flex flex-1 items-center justify-center px-6 pb-12 pt-4 lg:py-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

      </main>
    </div>
  );
}
