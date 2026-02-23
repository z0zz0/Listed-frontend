# AGENTS.md - Listed Frontend

## Scope
These instructions apply to the `Listed-frontend` repository.

## Core Goal
Build frontend code that is modular, testable, and easy to evolve feature-by-feature.

## Tech Stack (authoritative)
- React + TypeScript + Vite
- React Router (feature route modules)
- TanStack Query (server state)
- React Hook Form + Zod (forms + validation)
- CSS Modules + SCSS
- Zustand (only for complex client workflow state)

## Project Structure Rules
- `src/app`: app composition only (providers, router wiring, guards).
- `src/features/<feature>`: feature-owned code (`api`, `hooks`, `model`, `ui`, `pages`, `routes.tsx`).
- `src/shared`: reusable cross-feature code (API client, config, shared UI, global styles).
- `src/pages`: app-level pages only (for example home/not found).
- `src/test`: all test files; tests must not live next to source components.

## Routing Rules
- Keep routes modular per feature (`src/features/*/routes.tsx`).
- Compose route modules in `src/app/router/route-registry.ts`.
- Do not use loose hardcoded path strings in components/routes.
- Use `src/app/router/paths.ts` as the single source of truth:
  - `routePaths` for absolute URLs (navigation and links).
  - `routeSegments` for nested child route `path` values.
  - `apiPaths` for backend endpoint paths.
- Keep auth guards in `src/app/router/guards`.

## API / Data / State Boundaries
- `api/` files: pure HTTP functions only (no React hooks/components).
- `hooks/` files: React integration only (`useQuery`, `useMutation`, UX behavior).
- Components/pages should call hooks, not raw `fetch`.
- Use `src/shared/api/httpClient.ts` for requests and unified error mapping.
- TanStack Query cache owns server data; do not duplicate server collections in context/store.
- Context is for cross-cutting app/session state.
- Zustand is reserved for client workflow state (cart/checkout/multi-step), not default state storage.

## Auth Rules
- Use backend auth endpoints (`/api/auth/login`, `/api/auth/refresh`, `/api/auth/logout`, `/api/auth/logout-all`, `/api/auth/me`).
- Refresh token and device id are cookie-based; they are not frontend-managed auth proof.
- Do not treat localStorage/sessionStorage values as proof of authentication.
- Avoid placeholder auth logic in production paths (for example hardcoded user ids).
- Access token must be memory-only and managed by `src/shared/api/httpClient.ts`.
- Do not store access token in localStorage/sessionStorage.
- Keep one centralized `401 -> refresh -> retry` flow in `httpClient`; do not duplicate this logic inside feature API calls.
- `AuthProvider` is responsible for startup session hydration via `hydrateSession`.

## Types, Validation, and Errors
- Keep strict typing end-to-end.
- Define/maintain DTOs, domain types, Zod schemas, and mappers in `model/`.
- Normalize backend errors to `ApiError` shape (`status`, `code`, `message`).
- Prefer explicit constants for comparison values (status enums/constants over magic strings).
- Assume backend API response keys are camelCase. Do not add PascalCase fallback parsing unless explicitly required.
- Mapper functions may throw on invalid response shape (contract guard).
- UI must not show raw internal/mapper errors to users. Only backend `ApiError.message` may be surfaced; otherwise show safe fallback text.
- Prefer Zod v4 format style (for example `.pipe(z.email(...))`) over deprecated chained format APIs.

## Styling and UI
- Use CSS Modules + SCSS for component/page styles.
- Reuse shared UI primitives from `src/shared/ui` before creating feature-specific duplicates.
- Keep styling scoped; avoid global leaks except in `shared/styles`.

## Testing Rules
- Test files must be under `src/test/**` only.
- Mirror source layout under `src/test` for discoverability.
- Keep `npm run lint:test-locations` passing.
- For behavior changes, add/update tests in the same change.
- Tests should use shared path constants from `src/app/router/paths.ts` instead of hardcoded endpoint literals.

## Environment and Config
- `VITE_API_BASE_URL` is required and must be a valid absolute URL.
- Do not hardcode environment URLs in source code.
- Use mode-specific env files: `.env.local`, `.env.development`, `.env.qa`, `.env.production`.

## Change Workflow
- Prefer small, focused diffs.
- Preserve existing architecture conventions; do not move files across boundaries without reason.
- When adding a feature, implement in this order unless task says otherwise:
  1. `model` (types/schemas/mappers)
  2. `api` (HTTP functions)
  3. `hooks` (query/mutation wrappers)
  4. `ui` and `pages`
  5. route module + route registry wiring
  6. tests + docs
- For multi-phase work requested by the user, provide the phase plan and wait for approval before implementing the next phase.
