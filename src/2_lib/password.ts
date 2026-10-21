export type PasswordScore = 0 | 1 | 2 | 3 | 4;

export const passwordLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'] as const;

/** Rough, client-side guidance only. The backend remains the source of truth. */
export function scorePassword(password: string): PasswordScore {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  if (password.length < 8) return Math.min(score, 1) as PasswordScore;
  return Math.min(score, 4) as PasswordScore;
}
