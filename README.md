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
2. Use the appropriate env mode file (`.env.development`, `.env.sandbox`, `.env.qa`, `.env.production`).
3. For machine-specific local override, copy `.env.local.example` to `.env.local` and edit values.
4. Run `npm run dev` for local development.

## Scripts
- `npm run dev` starts local development mode (`.env.development`).
- `npm run dev:sandbox` starts developer sandbox mode (`.env.sandbox`).
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
- No localhost fallback is used in runtime config.
- `localhost` should be used only for local development/test.
- QA and production modes must point to their actual deployed backend URLs.

## Current Feature Scope
- `POST /api/users` via auth/signup flow (UI integration in next phase).

## Structure
- `src/app`: app bootstrap, providers, and router composition.
- `src/app/router/paths.ts`: centralized absolute paths and nested route segments.
- `src/shared`: reusable infra, UI primitives, and app-wide styles.
- `src/features/auth`: auth session context, hooks, and public auth pages.
- `src/features/users`: users routes, protected pages, UI, hooks, API, and models.
- `src/pages`: app-level pages (home, not found).
- `src/test`: centralized test files plus shared setup and test utilities.

## Testing Convention
- Keep all `*.test.ts` and `*.test.tsx` files under `src/test`.
- `vitest` is configured to discover tests only from `src/test`.
