import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from './errors';

/**
 * Maps server validation errors onto form fields.
 * Returns a form-level message when nothing matched a field, otherwise null.
 */
export function applyApiError<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
  fallback: string,
): string | null {
  if (!(err instanceof ApiError)) return fallback;

  let matched = false;
  for (const field of fields) {
    const message = err.fieldErrors[field];
    if (message) {
      setError(field, { type: 'server', message });
      matched = true;
    }
  }
  return matched ? null : err.message || fallback;
}
