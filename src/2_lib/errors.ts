
// An object whose keys and values are strings, 
// used to represent validation errors for specific fields in a form or API request.
export type FieldErrors = Record<string, string>;

// `interface` defines the structure an object must follow.
// An interface is like a blueprint 
// that specifies what properties an object should have and their types.
interface ApiErrorInit {
  status: number;
  message: string;
  code?: string;
  fieldErrors?: FieldErrors;
  retryAfter?: number;
}

// Normalised error thrown by every API call. `status` 0 means the request never reached the server. 
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors: FieldErrors;
  readonly retryAfter?: number;
  // The `constructor` method is a special function that is called when a new instance of the class is created.
  // It initializes the properties of the class based on the provided parameters.
  // The `super` function is called to invoke the constructor of the parent class (Error in this case),
  // allowing the ApiError class to inherit the behavior of the Error class.
  // The `readonly` keyword indicates that the properties cannot be modified after they are set in the constructor.
  // The `?` after a property name indicates that the property is optional and may be undefined.
  // The `FieldErrors` type is used to represent validation errors for specific fields in a form or API request.
  // The `retryAfter` property is used to indicate how long the client should wait before retrying the request, in seconds.
  // The `ApiErrorInit` interface defines the structure of the object that is passed to the constructor,
  // ensuring that the required properties are provided and have the correct types.
  // The `ApiError` class is used to represent errors that occur during API calls,
  // providing a consistent way to handle and communicate errors in the application.
  constructor({ status, message, code, fieldErrors = {}, retryAfter }: ApiErrorInit) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.retryAfter = retryAfter;
  }
  // The `isNetworkError` getter is a computed property that checks if the error is a network error.
  // It returns true if the status is 0, indicating that the request never reached the server.
  // This can happen due to network issues, timeouts, or other reasons that prevent the request from being sent or received.
  // The `get` keyword is used to define a getter method, 
  // allowing the property to be accessed like a regular property without calling it as a function.
  get isNetworkError() {
    return this.status === 0;
  }

  // The `network` static method is a factory method that creates an instance of the `ApiError` class for network errors.
  // It takes a boolean parameter `timedOut` to indicate whether the network error was due to a timeout or a general network issue.
  // The method returns a new `ApiError` instance with the appropriate status, code, and message based on the `timedOut` parameter.
  // The `static` keyword indicates that the method belongs to the class itself rather than an instance of the class,
  // allowing it to be called without creating an instance of the `ApiError` class.
  static network(timedOut: boolean) {
    return new ApiError({
      status: 0,
      code: timedOut ? 'TIMEOUT' : 'NETWORK',
      message: timedOut
        ? 'The server took too long to respond. Try again.'
        : 'Can’t reach the server. Check your connection and try again.',
    });
  }
  // 
  static async fromResponse(res: Response) {
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {
      // Body is empty or not JSON; fall back to a status-based message.
    }

    // Record itself does not exist at runtime. It's only TS,
    // so you can't do `typeof payload === Record ?`. You need a method that 
    // do that check for you and it is `isRecord`
    const body = isRecord(payload) ? payload : {};

    const header = Number(res.headers.get('Retry-After'));
    const retryAfter = Number.isFinite(header) && header > 0 ? header : undefined;

    /**
     * `pickString` safely get a string property out of an unknown object
     * `normalizeFieldErrors` take whatever error shape  the server or validator threw,
     *  and turn it into one consistent shape that the UI can render.
     * `Nullish Coalescing Operator` ??, means use the value on the left, 
     *  but if it's null or undefined, use the value on the right.
     */
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
