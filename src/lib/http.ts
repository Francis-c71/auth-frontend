/**
 * This is a reusable http client, it sends requests to the backend,
 * attaches the accessToken, handles expired sessions,
 * and manages network errors and timeouts.
 * "THE RECEPTIONIST BETWEEN THE FRONTEND AND THE BACKEND SERVER."
 * The React components focus on using data,
 * while this HTTP client handles the details of communicating with the backend and 
 * recovering from the expired accessTokens.
 */

import { endpoints } from '@/config/endpoints';
import { env } from '@/config/env';
import { ApiError } from './errors';
import { tokenStore } from './tokenStore';

// TS union type
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * `unknown` means the body can contains any type of data 
 * but TS require you to first check it's type before directly using it as a specific type
 * this is safer than `any` because any disable many type checks.
 * `AbortSignal` is a browser provided object used to communicate that an operation needs to be cancelled.
 */

export interface RequestOptions {
  method?: Method;
  body?: unknown;
  // Wether to attach the access token and refresh once on 401. Default true.
  auth?: boolean;
  // Allows a caller to cancel a request.
  signal?: AbortSignal;
  // Wether to refresh a token and retry after a 401 response.
  retryOnUnauthorized?: boolean;
}

// Set the timeout of 15,000 milliseconds or 15 seconds, 
// the underscore is just a visual representation, it does not change the value
const TIMEOUT_MS = 15_000;

/* ------------------------------ session expiry ----------------------------- */
/**
 * The handler is a function that your application can register to respond when its session expires,
 * e.g., a function that redirect a user to the sign in page.
 */
let sessionExpiredHandler: (() => void) | null = null;


// REGISTERING THE HANDLER
/* The session expired handler is called when a refresh fails, 
 * meaning the user must sign in again. 
 * It is set by the app, and can be cleared by calling the returned function. 
 * When you call `onSessionExpired`, it saves that function provided.
 */

export function onSessionExpired(handler: () => void) {
  sessionExpiredHandler = handler;
  // A function returning another function
  // Clears the registered handler, 
  // but only if it is the same handler that was rejected by that call.
  return () => {
    if (sessionExpiredHandler === handler) sessionExpiredHandler = null;
  };
}

/* --------------------------------- refresh --------------------------------- */

/**
 * `refreshInFlight` variable tracks wether a token refresh request variable is already running.
 * `Promise<string>` means a promise that will eventually produce a string.
 * `| null` means no token refresh request is currently being tracked.
 */
let refreshInFlight: Promise<string> | null = null;

/**
 * If no refresh request is running,
 * start one,
 * runs its callback when the promise settles, wether it succeed or fails,
 * i.e., clears the tracking variable so a future request can start.
 * Later, returns the existing promise,
 * other requests can wait for that same operation instead of starting another one.
 */
export function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

/**
 * `async` allows function to use `await`
 * `Promose<string>` caller receive a promise that resolve to a string.
 */
async function doRefresh(): Promise<string> {
  try {
    const data = await send<{ accessToken: string }>(endpoints.refresh, {
      method: 'POST',
      // The request must not enter the usual authentication-and-retry process,
      // otherwise, if refreshing itself return 401, it could try refreshing again, and create an infinite loop.
      auth: false,
      retryOnUnauthorized: false,
    });
    // Save the new accessToken and return it to the caller.
    tokenStore.set(data.accessToken);
    return data.accessToken;
  } catch (err) {
    // Clear the stored accessToken and pass the error back to the caller.
    tokenStore.clear();
    throw err;
  }
}

/* --------------------------------- request --------------------------------- */
/**
 * `<T>` the generic type parameter allows the different requests to return different expected data types,
 * `path` the endpoint must be a string,
 * `options` are optional, and if ommited, an empty object is used.
 * `Promise<T>` the method returns a promise of whatever type T represents.
 */
async function send<T>(path: string, options: RequestOptions = {}): Promise<T> {

  // object destructuring; extracts properties from options into individual variables.
  const { method = 'GET', body, auth = true, signal, retryOnUnauthorized = true } = options;

  // Headers is a browser API for managing HTTP headers.
  // Accept tells the server the client expects JSON responses.
  // Content-Type tells the server that the request body is JSON.
  const headers = new Headers({ Accept: 'application/json' });
  if (body !== undefined) headers.set('Content-Type', 'application/json');

  const token = tokenStore.get();

  // We set the `Authorization` token only when auth is true, 
  // meaning authorization check needed.
  if (auth && token) headers.set('Authorization', `Bearer ${token}`);

  // `AbortController` is a browser API that lets the application cancel the fetch() request
  const controller = new AbortController();
  let timedOut = false;

  // The timer waits for 15 seconds, if it fires, and run the callback function if the timer expires:
  // timeout becomes true,
  // the request is cancel
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT_MS);

  // The code listens for the cancellation from the caller and forwards it to the internal controller.
  // `{ once: true }` means the listener runs at most once.
  signal?.addEventListener('abort', () => controller.abort(), { once: true });

  /**
   * Tells the browser to include application cookies with request,
   * including the HTTP-only request cookie when the cookie security and the domain rules permit it.
   * An HTTP-only cookie can not be read directly by JS, the browser handles it.
   * Connects the request to the browser controller so that timeout or caller cancellation can abort it.
   */
  let res: Response;
  try {
    res = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: 'include', 
      signal: controller.signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err; // the caller cancelled on purpose
    throw ApiError.network(timedOut); // Convert the failure into standardize network failure
  } finally {
    window.clearTimeout(timer); // The timeout only covers waiting for fetch() respose, not all subsequent response-body processings.
  }
  /**
   * If the server says the request is unauthorized
   * and authentication is enabled
   * and retrying is permited,
   * Try to refresh the accessToken, and if it fails,
   * call the registered session-expiration handler, if one is registered,
   * it might redirect the user to the sign in page.
   * And then convert the unauthorised respose to an application error and throws it.
   * If refreshing succeeds, 
   * send the original request again, now with the newly stored accessToken,
   * if the retry also returns 401, the client must not repeatedly refresh and retry forever.
   */
  if (res.status === 401 && auth && retryOnUnauthorized) {
    try {
      await refreshAccessToken();
    } catch {
      sessionExpiredHandler?.();
      throw await ApiError.fromResponse(res);
    }
    return send<T>(path, { ...options, retryOnUnauthorized: false });
  }

  // If res.ok is true for HTTP status codes from 200 to 299 is unsuccessful, 
  // convert it into ApiError and throw it.
  if (!res.ok) throw await ApiError.fromResponse(res);

  // If `204 No Content` response, return undefined and type assert it or treat it as the generic T, what the caller expects
  if (res.status === 204) return undefined as T;

  // Read the respose body as text,
  // and if present, return the decoded json version of it, else return undefined treated as the generic T, wat the caller expects.
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/**
 * Omit is a built-in TS utility type, it creates type by removing specified properties from another type,
 * here, it removes `method` and `body` from the RequestOptions.
 * Because the helper method, the `http` already decide the HTTP methods, and the method such as 
 * get() and Delete() do not accept body in this API desgin
 * The <T> let the caller specify the expected response type, and
 * the the arrow function forwards the request to send<T>() with the method fixed to GET.
 */

type BodylessOptions = Omit<RequestOptions, 'method' | 'body'>;

export const http = {
  get: <T>(path: string, options?: BodylessOptions) => 
    send<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: BodylessOptions) =>
    send<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body?: unknown, options?: BodylessOptions) =>
    send<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(path: string, body?: unknown, options?: BodylessOptions) =>
    send<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: BodylessOptions) => 
    send<T>(path, { ...options, method: 'DELETE' }),
};
