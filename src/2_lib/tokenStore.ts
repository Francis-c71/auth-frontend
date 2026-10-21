/**
 * Access token lives in memory only. It is never written to localStorage or
 * sessionStorage, so an XSS bug can't read it back later. The long-lived
 * refresh token belongs in an httpOnly cookie managed by your backend.
 */


let accessToken: string | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string) => {
    accessToken = token;
  },
  clear: () => {
    accessToken = null;
  },
};
