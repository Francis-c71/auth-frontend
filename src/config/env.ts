/** Single place that reads environment variables, with safe defaults. */
export const env = {
  appName: import.meta.env.VITE_APP_NAME?.trim() || 'Acme',
  apiUrl: (import.meta.env.VITE_API_URL?.trim() || '/api').replace(/\/+$/, ''),
} as const;
