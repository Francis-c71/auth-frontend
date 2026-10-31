/**
 * Every backend route the frontend calls. If your API uses different paths,
 * this is the only file you need to touch.
 * Paths are appended to VITE_API_URL. 
 */
export const endpoints = {
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  me: '/users/me',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/verify-email',
  resendVerification: '/auth/resend-verification',
} as const;

/** Error `code` your backend returns when a login is blocked by an unverified email. */
export const EMAIL_NOT_VERIFIED_CODE = 'EMAIL_NOT_VERIFIED';
