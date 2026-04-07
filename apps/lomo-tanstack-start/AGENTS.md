# @repo/lomo-tanstack-start — Experimental TanStack Start Frontend

## Overview

Experimental frontend app evaluating TanStack Start as a framework for LoMo. Standardized to use the monorepo's shared configs and design system. Includes Convex integration and Better Auth, but does not yet have feature parity with lomoweb.

## Tech Stack

- **Framework:** TanStack Start (React 19 + Vite + SSR)
- **Router:** TanStack Router (file-based routing)
- **Styling:** Tailwind CSS v4 via `@repo/ui/theme.css`
- **Components:** `@repo/ui` design system
- **Lint:** `@repo/eslint-config/react` (antfu, tabs, double quotes, semicolons)

## Directory Structure

```
src/
  env.d.ts           TypeScript augmentation for ImportMetaEnv
  routes/            File-based routes (TanStack Router)
    __root.tsx       Root layout — always rendered, contains <html>/<body>
    index.tsx        Home page (/)
    api/auth/$.ts    Auth API catch-all route
  lib/
    env-client.ts    Zod-validated client env vars (safe for browser)
    env-server.ts    Zod-validated server env vars (SSR-only, extends client)
    auth-server.ts   Convex Better Auth server config
    auth-client.ts   Auth client helpers
  router.tsx         Router config (scroll restoration, preloading)
  routeTree.gen.ts   AUTO-GENERATED — do not edit
  styles.css         Global styles — imports @repo/ui/theme.css
```

## Key Conventions

### Routing

- Routes live in `src/routes/` and map to URLs by filename
- `__root.tsx` is the root layout, always rendered
- `routeTree.gen.ts` is auto-generated when the dev server runs — never edit it manually
- Dynamic params: `$paramName.tsx` → `:paramName`
- Pathless layouts: `_layoutName.tsx` wraps children without adding a URL segment

### Server Functions

Place server functions in `src/utils/*.functions.ts`:

```ts
import { createServerFn } from "@tanstack/react-start";

export const myServerFn = createServerFn()
	.handler(async () => { /* server-only code */ });
```

### Environment Variables

Env vars are validated at startup with Zod, split into client and server schemas:

- **`src/lib/env-client.ts`** — client-safe vars (exposed to browser via `VITE_` prefix). Import `clientEnv` in client/shared code.
- **`src/lib/env-server.ts`** — server-only vars (extends client schema). Import `serverEnv` in server functions. Guarded by `import.meta.env.SSR` — throws if imported in client code.
- **`src/env.d.ts`** — augments `ImportMetaEnv` for TypeScript autocomplete.
- **`.env.example`** — documents all required vars with placeholder values.
- **`.env.local`** — actual values (gitignored).

When adding a new env var:

1. Add it to the appropriate Zod schema (`env-client.ts` or `env-server.ts`)
2. Add it to `ImportMetaEnv` in `env.d.ts`
3. Add a placeholder to `.env.example`
4. Add the actual value to `.env.local`

```ts
// Client code (routes, components)
import { clientEnv } from "#/lib/env-client";

// Server code (server functions, API routes)
import { serverEnv } from "#/lib/env-server";

clientEnv.VITE_CONVEX_URL;
serverEnv.VITE_CONVEX_SITE_URL;
```

### Path Alias

`#/*` maps to `./src/*`. Use it for imports:

```ts
import { something } from "#/utils/helpers";
```

## Commands

Run from the app directory or repo root:

| Command             | Description                   |
| ------------------- | ----------------------------- |
| `bun run dev`       | Start dev server on port 3001 |
| `bun run build`     | Production build              |
| `bun run lint`      | Run ESLint                    |
| `bun run lint:fix`  | Auto-fix lint issues          |
| `bun run typecheck` | Run TypeScript type check     |
