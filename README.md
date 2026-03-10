# Listed Frontend

React SPA frontend for Listed with modular feature structure.

## Stack
- React + TypeScript + Vite
- React Router (modular route modules)
- TanStack Query for server-state
- React Hook Form + Zod for forms and validation
- CSS Modules + SCSS
- Zustand included for upcoming workflow state (checkout/cart/multi-step forms)

## Setup
1. Run `npm install`.
2. Configure environment in one of:
   - `.env.local`
   - `.env.development`
   - `.env.qa`
   - `.env.production`
3. Run `npm run dev` for local development.

## Scripts
- `npm run dev` starts local development mode (`.env.development`) and proxies `/api` to `http://localhost:5000`.
- `npm run dev:sandbox` starts sandbox mode (`.env.sandbox`) if your team uses that file.
- `npm run build` builds production assets (`.env.production`).
- `npm run build:development` builds using `.env.development`.
- `npm run build:sandbox` builds using `.env.sandbox`.
- `npm run build:qa` builds using `.env.qa`.
- `npm run build:prod` builds using `.env.production`.
- `npm run preview` previews production build.
- `npm run lint:test-locations` fails if test files exist outside `src/test`.
- `npm run test` checks test locations, then starts test runner in watch mode.
- `npm run test:run` checks test locations, then runs tests once.

## Environment
- `VITE_API_BASE_URL` is required and validated at startup.
- Preferred value is `/` (same-origin mode).
- In local development, Vite proxy routes `/api` to `http://localhost:5000`.
- In QA/production, ingress/reverse-proxy must route `/api` to backend on the same origin as the SPA.
- Absolute API base URLs are optional fallback only for explicit cross-origin scenarios.

## Structure
- `src/app`: app bootstrap, providers, and router composition.
- `src/app/router/paths.ts`: centralized route and API path constants.
- `src/shared`: reusable infra, UI primitives, and app-wide styles.
- `src/features/auth`: auth session context, API, hooks, model, and UI.
- `src/features/users`: users routes, pages, hooks, API, and model.
- `src/pages`: app-level pages (home, not found).
- `src/test`: centralized test files plus shared setup and test utilities.

## Code Conventions
- Use `@/` import aliases for internal imports.
- Do not use loose path strings in features/components.
- Use `src/app/router/paths.ts`:
  - `routePaths` for absolute app routes.
  - `routeSegments` for nested route segment values.
  - `apiPaths` for backend endpoint paths.
- Keep strict feature boundaries:
  - `api/` = HTTP only, no React hooks/components.
  - `hooks/` = React integration (query/mutation/ui state behavior).
  - `model/` = DTOs, schemas, mappers, feature types.
- Use `httpClient` for all HTTP calls. Do not call `fetch` directly in feature files.
- Auth/session rules:
  - Access token is memory-only (managed by `httpClient`).
  - Refresh token stays in browser `HttpOnly` cookie (never in JS storage).
  - `httpClient` handles one-time `401 -> refresh -> retry` centrally.
  - `AuthProvider` handles startup session hydration via `hydrateSession`.
- Error-handling rules:
  - Do not hardcode user-facing error copy in components/hooks.
  - Prefer backend `ApiError.code` -> frontend message-key mapping.
  - If no known code mapping exists, show a safe fallback key/message.
  - Internal/mapper/contract errors must use safe fallback user messages.
  - Mappers may throw for invalid response shape (contract guard).
- i18n rules:
  - Do not hardcode user-facing strings in TS/TSX.
  - Use message keys and resolve with `t(...)` from `src/shared/i18n`.
  - For optional values that may already be plain text, use `tMaybeKey(...)`.
  - Keep translation values in `src/shared/i18n/messages/en-US.ts`.
  - Start with `en-US`; add other locales later without changing call sites.
- Backend contract assumption:
  - API JSON response keys are camelCase.
  - Frontend parsing should not rely on PascalCase fallbacks.
- Zod conventions:
  - Prefer Zod v4 style for formats (for example `.pipe(z.email(...))`).
  - Avoid deprecated chained format APIs when equivalents exist.
- Styling:
  - Use CSS Modules + SCSS.
  - Prefer shared UI primitives under `src/shared/ui` before creating duplicates.

## Testing Convention
- Keep all `*.test.ts` and `*.test.tsx` files under `src/test`.
- `vitest` is configured to discover tests only from `src/test`.
- Use shared path constants in tests as well (avoid hardcoded endpoint literals).
