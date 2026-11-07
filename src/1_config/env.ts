
export const env = {
  appName: import.meta.env.VITE_APP_NAME?.trim() || 'The Living Science',
  apiUrl: (import.meta.env.VITE_API_URL?.trim() || '/api').replace(/\/+$/, ''),
} as const;
