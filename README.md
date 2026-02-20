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
1. Copy `.env.example` to `.env`.
2. Run `npm install`.
3. Run `npm run dev`.

## Scripts
- `npm run dev` starts the Vite dev server.
- `npm run build` builds production assets.
- `npm run preview` previews production build.
- `npm run lint:test-locations` fails if test files exist outside `src/test`.
- `npm run test` checks test locations, then starts test runner in watch mode.
- `npm run test:run` checks test locations, then runs tests once.

## Environment
- `VITE_API_BASE_URL` defaults to `http://localhost:5000`.

## Current Feature Scope
- `POST /api/users` via Create User page.
- `GET /api/users/by-email` via Find User page.

## Structure
- `src/app`: app bootstrap, providers, and router composition.
- `src/shared`: reusable infra, UI primitives, and app-wide styles.
- `src/features/auth`: auth session context and hooks scaffold.
- `src/features/users`: users routes, pages, UI, hooks, API, and models.
- `src/pages`: app-level pages (home, not found).
- `src/test`: centralized test files plus shared setup and test utilities.

## Testing Convention
- Keep all `*.test.ts` and `*.test.tsx` files under `src/test`.
- `vitest` is configured to discover tests only from `src/test`.
"# Listed-frontend" 
