/**
 * Where to send the user after signing in. Only same-origin paths are accepted,
 * which prevents open-redirect abuse.
 */


export function resolveRedirect(state: unknown, fallback: string): string {
  /**
   * Treat state as an object that may contain a from property or as null
   * pathname -> the route path e.g., /dashboard
   * search -> the query string e.g., ?tab=profile
   * hasd -> the url fragment e.g., #settings
   * ?? nullish coalescing
   */
  const from = (state as { 
    from?: { 
      pathname?: string; 
      search?: string; 
      hash?: string 
    } 
  } | null)?.from;

  if (!from?.pathname) return fallback;

  const target = `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`;
  /**
   * e.g., target = '/dashboard?tab=profile#settings'
   * A url starting with //evil.com can direct a browswer to another website,
   * rejecting it prevents "open-redirect-attacks" where you attacker abuses your app
   * to send users to malicious destination.
   */ 
  return target.startsWith('/') && !target.startsWith('//') ? target : fallback;
}
