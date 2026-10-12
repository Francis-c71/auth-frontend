/**
 * Where to send the user after signing in. Only same-origin paths are accepted,
 * which prevents open-redirect abuse.
 */
export function resolveRedirect(state: unknown, fallback: string): string {
  const from = (state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from;
  if (!from?.pathname) return fallback;

  const target = `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`;
  return target.startsWith('/') && !target.startsWith('//') ? target : fallback;
}
