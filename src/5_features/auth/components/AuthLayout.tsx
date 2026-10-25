
import { Outlet } from 'react-router-dom';
import { Logo } from '@/3_components/ui/Logo';
import { env } from '@/1_config/env';
import { ThemeToggle } from '@/3_components/ui/ThemeToggle';

export function AuthLayout() {
  return (
    <div className="min-h-dvh bg-white text-navyBrand dark:bg-background dark:text-white grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">

      {/* Left section: visible on large screens */}
      <aside className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
        <Logo tone="light" />

        <div className="relative z-10 max-w-md">
          <h2 className="text-5xl font-bold leading-[1.05] tracking-tight">
            The Living Science.
          </h2>
          <p className="mt-5 text-lg leading-relaxed">
            Practical Biology to Lower Secondary Curriculum.
          </p>
        </div>

        <ThemeToggle />
          <div className="bg-white text-navyBrand dark:bg-background dark:text-white">
                  Theme test
          </div>

        <p className="relative z-10 text-sm text-mist">
          © {new Date().getFullYear()} {env.appName}
        </p>
      </aside>

      {/* Right section: sign-in page */}
      <main className="flex flex-col min-h-dvh">

        {/* Mobile header and science text */}
        <header className="flex justify-center items-center flex-col p-6 text-white lg:hidden">

          <div className="flex justify-center items-center flex-col mt-4 mb-8">
            
              <Logo tone='light' />
            
            <p className="text-center mt-3 text-sm leading-relaxed font-semibold text-mist">
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
