import { endpoints } from '@/1_config/endpoints';
import { http, refreshAccessToken } from '@/2_lib/http';
import { tokenStore } from '@/2_lib/tokenStore';
import type { LoginInput, RegisterInput, ResetPasswordInput, User } from '../types';

/**
 * The only place that knows the shape of your backend's responses.
 * If your API differs, adapt it here and the rest of the app stays untouched.
 *
 * Expected contract/transaction/CRUD operation:
 *   POST login               { email, password }        -> { user, accessToken }  (+ refresh cookie)
 *   POST register            { name, email, password }  -> { user, accessToken } or 2xx without a token
 *   POST refresh             (cookie)                   -> { accessToken }
 *   GET  me                                             -> User or { user }
 *   POST logout                                         -> 204 (clears refresh cookie)
 *   POST forgot-password     { email }                  -> 2xx always
 *   POST reset-password      { token, password }        -> 2xx
 *   POST verify-email        { token }                  -> 2xx
 *   POST resend-verification { email }                  -> 2xx
 */
interface SessionResponse {
  user: User;
  accessToken: string;
}

/**
 * All the API calls are saved in an object, such that you can do `authApi.login()`
 */
export const authApi = {
  async login(input: LoginInput): Promise<User> {
    const data = await http.post<SessionResponse>(endpoints.login, input, { auth: false });
    tokenStore.set(data.accessToken);
    return data.user;
  },

  /** `user` is null when the backend wants the email verified before signing in. */
  async register(input: RegisterInput): Promise<{ user: User | null; verificationRequired: boolean }> {
    const data = await http.post<Partial<SessionResponse> | undefined>(endpoints.register, input, {
      auth: false,
    });
    if (data?.accessToken && data.user) {
      tokenStore.set(data.accessToken);
      return { user: data.user, verificationRequired: false };
    }
    return { user: null, verificationRequired: true };
  },

  async logout(): Promise<void> {
    try {
      await http.post<void>(endpoints.logout);
    } finally {
      tokenStore.clear();
    }
  },

  async me(): Promise<User> {
    const data = await http.get<User | { user: User }>(endpoints.me);
    return 'user' in data ? data.user : data;
  },

  /** On page load: trade the refresh cookie for an access token, then load the profile. */
  async restoreSession(): Promise<User> {
    await refreshAccessToken();
    return authApi.me();
  },

  forgotPassword(email: string) {
    return http.post<void>(endpoints.forgotPassword, { email }, { auth: false });
  },

  resetPassword(input: ResetPasswordInput) {
    return http.post<void>(endpoints.resetPassword, input, { auth: false });
  },

  verifyEmail(token: string) {
    return http.post<void>(endpoints.verifyEmail, { token }, { auth: false });
  },

  resendVerification(email: string) {
    return http.post<void>(endpoints.resendVerification, { email }, { auth: false });
  },
};
