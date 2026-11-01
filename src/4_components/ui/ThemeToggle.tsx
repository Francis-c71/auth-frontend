
import { useTheme } from '@/3_utils/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="rounded-md border border-mist px-4 py-2 text-slate hover:bg-mist-soft"
    >
      {theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
    </button>
  );
}
