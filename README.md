# Auth frontend

React 18 + TypeScript + Vite + Tailwind CSS 3. Talks to your existing auth backend; nothing is mocked.

## Run it

```bash
npm install
cp .env.example .env     # then edit the values
npm run dev              # http://localhost:5173
npm run build            # type-checks, then builds to dist/
```

## Connect it to your backend

1. **Base URL**: set `VITE_API_URL` in `.env`.
   - In dev, keep `/api` and set `DEV_PROXY_TARGET` to your backend origin. Vite proxies `/api/*` there, so cookies work without CORS setup. If your backend isn't mounted under `/api`, uncomment the `rewrite` line in `vite.config.ts`.
   - In production, either serve frontend and API from the same site, or set `VITE_API_URL` to the API origin and enable CORS with credentials (`Access-Control-Allow-Credentials: true` and an explicit origin, not `*`).
2. **Routes**: `src/config/endpoints.ts` lists every path the app calls.
3. **Response shapes**: `src/features/auth/api/auth.api.ts` is the only file that knows them. The expected contract is at the top of that file.

### Expected contract

| Action | Request | Response |
| --- | --- | --- |
| Login | `POST /auth/login` `{ email, password }` | `{ user, accessToken }` + refresh cookie |
| Register | `POST /auth/register` `{ name, email, password }` | `{ user, accessToken }`, or any 2xx without a token if the email must be verified first |
| Refresh | `POST /auth/refresh` (cookie) | `{ accessToken }` |
| Current user | `GET /users/me` | `User` or `{ user }` |
| Logout | `POST /auth/logout` | 204, clears the refresh cookie |
| Forgot password | `POST /auth/forgot-password` `{ email }` | 2xx |
| Reset password | `POST /auth/reset-password` `{ token, password }` | 2xx |
| Verify email | `POST /auth/verify-email` `{ token }` | 2xx |
| Resend verification | `POST /auth/resend-verification` `{ email }` | 2xx |

`User` = `{ id, name, email, isEmailVerified, createdAt? }`.

Errors: any JSON body with `message` (or `error`), optional `code`, and optional `errors` as `{ field: "msg" }`, `{ field: ["msg"] }` or `[{ field, message }]`. Field errors are shown under the matching input. Return `code: "EMAIL_NOT_VERIFIED"` on login to send the user to the verify screen.

Email links should point to `/reset-password?token=…` and `/verify-email?token=…`.

## How it works

- **Tokens**: the access token lives in memory only (`lib/tokenStore.ts`). The refresh token is an httpOnly cookie your backend sets. Nothing sensitive goes in localStorage.
- **Session restore**: on load, `AuthProvider` calls refresh, then `/users/me`.
- **Automatic refresh**: `lib/http.ts` retries a 401 once after refreshing. Concurrent refreshes share one request (needed for rotating refresh tokens). If refresh fails, the user is signed out.
- **Route guards**: `ProtectedRoute` and `GuestRoute`. After sign-in the user returns to the page they wanted; the redirect target is validated as same-origin.
- **Cross-tab sync**: signing out in one tab signs out the others (`BroadcastChannel`).
- **Forms**: react-hook-form + zod. Accessible labels, `aria-invalid`, `aria-describedby`, correct `autocomplete` values, show/hide password.
- **Security details**: login shows one generic message on 401; forgot-password never reveals whether an email exists; requests time out after 15 s; 429 responses show the wait time.

## Structure

```
src/
  config/        env + endpoint paths
  lib/           http client, errors, token store, helpers
  components/ui/ Button, TextField, PasswordField, Alert, ...
  features/
    auth/        api, context, schemas, route guards, layout, pages
    dashboard/   signed-in placeholder
  routes/        paths + router (lazy-loaded pages)
  styles/        Tailwind entry + brand tokens
```

## Theme

Brand colours are CSS variables in `src/styles/index.css`, mapped in `tailwind.config.ts` (`bg-navy`, `text-gold-ink`, `bg-cta`, `bg-hero`, ...). Four derived tints were added to your palette: `mist-soft`, `mist-strong` (3:1 input borders), `gold-tint`, `wine-tint`. Tailwind can't apply `/opacity` to CSS-variable colours, so use these tokens instead of `bg-wine/10`.

## Not included

2FA/passkeys, social login, and tests. The structure leaves room for each: add an endpoint, an API method, and a page.
