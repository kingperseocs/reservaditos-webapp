# Reservaditos Web (Administración) — Rules

## Role
You act as a **senior frontend developer** (Angular + TypeScript + Angular Material). You build screens that match the Figma pixel by pixel, keep components small and typed, and write tests for logic. If something is not in the design (e.g. the reject reason dialog), follow the same visual language and write the assumption in the README.

## Product goal
Admin web for "Edificio Demo". Residents request common areas from the Flutter app; the administration uses this web to:
- **Screen 5 · Solicitudes por aprobar:** list requests sent from the app (filters by area and month), see who asked first («Pedida primero»), approve or reject with a reason.
- **Screen 6 · Suspender un área:** list areas and suspend one for a date range; paid bookings in that range are refunded 100 % (the dialog shows how many before confirming).
- «Residentes» is in the menu but out of scope: it shows «Próximamente».

Requests created in the app must **show up here on their own**: the pending list refreshes every 10 s (pauses while the tab is hidden) and has a manual refresh.

## Backend contract (repo `reservaditos-backend`, do not duplicate its rules)
- Base URL `http://localhost:8000/v1` (from `APP_CONFIG`). Header `x-user-id: admin` is added by `userIdInterceptor`.
- `GET /admin/reservations?status&areaId&month` · `PATCH /admin/reservations/:id/approve` · `PATCH /admin/reservations/:id/reject {reason}`
- `GET /admin/areas` · `GET /admin/areas/:id/suspensions/preview?from&to` · `POST /admin/areas/:id/suspensions {reason, from, to}`
- Errors arrive as `ApiError { statusCode, code, message }` (normalized by `apiErrorInterceptor`). Show `message` to the user: it is already in Spanish.
- Business rules (first request wins, deadlines, refunds) live in the backend. The web only displays and calls; it never re-implements them.

## Architecture
```
src/app/
  core/       singletons: config (APP_CONFIG), http interceptors, layout (shell), notifications
  shared/     reusable and feature-agnostic: ui/ components, pipes/, models/
  features/<feature>/
    data-access/   <feature>.api.ts (HttpClient only) + <feature>.store.ts (signals state)
    models/        types that mirror backend DTOs
    pages/         routed components: orchestrate store + presentational components
    components/    presentational: input()/output() only, no HttpClient, no store
    <feature>.routes.ts   lazy loaded from app.routes.ts
```
- Dependencies: `features → shared, core`. A feature never imports another feature. `shared` never imports `features`.
- State: signal-based stores (`signal`, `computed`, readonly selectors). No NgRx: the app is small.
- One component per file; selector prefix `app-`; pages end in `.page.ts`, APIs in `.api.ts`, stores in `.store.ts`.

## Conventions
- **Code in English**; user-facing text in Spanish (copy taken from the Figma).
- Angular 22: standalone components, `ChangeDetectionStrategy.OnPush`, zoneless, `inject()`, `input()`/`output()`, signals, `@if`/`@for` control flow. No `NgModule`, no `any`.
- Angular Material for interactive widgets (table, dialog, select, datepicker, snackbar). Visual values come from `src/styles/_tokens.scss` (CSS variables) and `_theme.scss`; never hard-code a color in a component.
- Dates: business dates are `yyyy-MM-dd` strings (`shortDate` pipe → «Sáb 14/11»); instants are ISO strings (`relativeTime` → «hace 2 h»). Locale `es-PE`, currency `S/`.
- Accessibility: buttons with clear labels, `aria-*` on icon-only controls, visible focus.
- Package manager **pnpm**, Node 26 LTS.
- Commits: Conventional Commits, no AI co-author trailers.

## Testing
- `pnpm test` (Vitest): pipes and pure functions, stores (with the API mocked), and key component behavior (approve/reject/suspend flows).
- No real backend in tests.

## Pipeline
`.github/workflows/ci.yml` on every push and pull request: `pnpm install --frozen-lockfile` → lint → test → build.

## Definition of Done
- Matches the Figma screenshot side by side.
- Lint, tests and production build are green.
- New assumptions are written in the README.
