import { endpoints } from '@/config/endpoints';
import { env } from '@/config/env';
import { ApiError } from './errors';
import { tokenStore } from './tokenStore';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  method?: Method;
  body?: unknown;
  /** Attach the access token and refresh once on 401. Default true. */
  auth?: boolean;
  signal?: AbortSignal;
  /** Internal: prevents infinite refresh loops. */
  retryOnUnauthorized?: boolean;
}

const TIMEOUT_MS = 15_000;

/* ------------------------------ session expiry ----------------------------- */

let sessionExpiredHandler: (() => void) | null = null;

/** Called when a refresh fails, meaning the user must sign in again. */
export function onSessionExpired(handler: () => void) {
  sessionExpiredHandler = handler;
  return () => {
    if (sessionExpiredHandler === handler) sessionExpiredHandler = null;
  };
}

/* --------------------------------- refresh --------------------------------- */

let refreshInFlight: Promise<string> | null = null;

/**
 * Exchanges the httpOnly refresh cookie for a new access token.
 * Concurrent callers share one request, which matters for backends that
 * rotate refresh tokens (a second parallel call would be rejected).
 */
export function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function doRefresh(): Promise<string> {
  try {
    const data = await send<{ accessToken: string }>(endpoints.refresh, {
      method: 'POST',
      auth: false,
      retryOnUnauthorized: false,
    });
    tokenStore.set(data.accessToken);
    return data.accessToken;
  } catch (err) {
    tokenStore.clear();
    throw err;
  }
}

/* --------------------------------- request --------------------------------- */

async function send<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, signal, retryOnUnauthorized = true } = options;

  const headers = new Headers({ Accept: 'application/json' });
  if (body !== undefined) headers.set('Content-Type', 'application/json');
  const token = tokenStore.get();
  if (auth && token) headers.set('Authorization', `Bearer ${token}`);

  const controller = new AbortController();
  let timedOut = false;
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);
  signal?.addEventListener('abort', () => controller.abort(), { once: true });

  let res: Response;
  try {
    res = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: 'include', // sends the httpOnly refresh cookie
      signal: controller.signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err; // the caller cancelled on purpose
    throw ApiError.network(timedOut);
  } finally {
    window.clearTimeout(timer);
  }

  if (res.status === 401 && auth && retryOnUnauthorized) {
    try {
      await refreshAccessToken();
    } catch {
      sessionExpiredHandler?.();
      throw await ApiError.fromResponse(res);
    }
    return send<T>(path, { ...options, retryOnUnauthorized: false });
  }

  if (!res.ok) throw await ApiError.fromResponse(res);
  if (res.status === 204) return undefined as T;

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

type BodylessOptions = Omit<RequestOptions, 'method' | 'body'>;

export const http = {
  get: <T>(path: string, options?: BodylessOptions) => send<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: BodylessOptions) =>
    send<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: BodylessOptions) =>
    send<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: BodylessOptions) =>
    send<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: BodylessOptions) => send<T>(path, { ...options, method: 'DELETE' }),
};
