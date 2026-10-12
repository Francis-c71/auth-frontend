export type FieldErrors = Record<string, string>;

interface ApiErrorInit {
  status: number;
  message: string;
  code?: string;
  fieldErrors?: FieldErrors;
  retryAfter?: number;
}

/** Normalised error thrown by every API call. `status` 0 means the request never reached the server. */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors: FieldErrors;
  /** Seconds, from the Retry-After header (rate limiting). */
  readonly retryAfter?: number;

  constructor({ status, message, code, fieldErrors = {}, retryAfter }: ApiErrorInit) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.retryAfter = retryAfter;
  }

  get isNetworkError() {
    return this.status === 0;
  }

  static network(timedOut: boolean) {
    return new ApiError({
      status: 0,
      code: timedOut ? 'TIMEOUT' : 'NETWORK',
      message: timedOut
        ? 'The server took too long to respond. Try again.'
        : 'Can’t reach the server. Check your connection and try again.',
    });
  }

  static async fromResponse(res: Response) {
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {
      // Body is empty or not JSON; fall back to a status-based message.
    }
    const body = isRecord(payload) ? payload : {};

    const header = Number(res.headers.get('Retry-After'));
    const retryAfter = Number.isFinite(header) && header > 0 ? header : undefined;

    return new ApiError({
      status: res.status,
      message: pickString(body.message) ?? pickString(body.error) ?? defaultMessage(res.status, retryAfter),
      code: pickString(body.code),
      fieldErrors: normalizeFieldErrors(body.errors),
      retryAfter,
    });
  }
}

export function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof ApiError && err.message ? err.message : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pickString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}

/**
 * Accepts the shapes backends commonly use:
 *   { email: "Already taken" }
 *   { email: ["Already taken"] }
 *   [{ field: "email", message: "Already taken" }]  (also `path` instead of `field`)
 */
function normalizeFieldErrors(input: unknown): FieldErrors {
  const out: FieldErrors = {};

  if (Array.isArray(input)) {
    for (const item of input) {
      if (!isRecord(item)) continue;
      const field = pickString(item.field) ?? pickString(item.path);
      const message = pickString(item.message);
      if (field && message && !(field in out)) out[field] = message;
    }
  } else if (isRecord(input)) {
    for (const [field, value] of Object.entries(input)) {
      const message = Array.isArray(value) ? pickString(value[0]) : pickString(value);
      if (message) out[field] = message;
    }
  }

  return out;
}

function defaultMessage(status: number, retryAfter?: number) {
  switch (status) {
    case 400:
    case 422:
      return 'Check the highlighted details and try again.';
    case 401:
      return 'You need to sign in to continue.';
    case 403:
      return 'You don’t have permission to do that.';
    case 404:
      return 'We couldn’t find what you asked for.';
    case 409:
      return 'That already exists. Try signing in instead.';
    case 429: {
      if (!retryAfter) return 'Too many attempts. Wait a moment and try again.';
      const minutes = Math.ceil(retryAfter / 60);
      return `Too many attempts. Try again in ${minutes <= 1 ? 'a minute' : `${minutes} minutes`}.`;
    }
    default:
      return status >= 500
        ? 'Something went wrong on our side. Try again in a moment.'
        : 'Something went wrong. Try again.';
  }
}
