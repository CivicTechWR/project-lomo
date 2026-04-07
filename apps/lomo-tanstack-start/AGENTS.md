# @repo/lomo-tanstack-start — Experimental TanStack Start Frontend

## Overview

Experimental frontend app evaluating TanStack Start as a framework for LoMo. Standardized to use the monorepo's shared configs and design system, but does not yet include auth, Convex, or feature parity with lomoweb.

## Tech Stack

- **Framework:** TanStack Start (React 19 + Vite + SSR)
- **Router:** TanStack Router (file-based routing)
- **Styling:** Tailwind CSS v4 via `@repo/ui/theme.css`
- **Components:** `@repo/ui` design system
- **Lint:** `@repo/eslint-config/react` (antfu, tabs, double quotes, semicolons)

## Directory Structure

```
src/
  routes/            File-based routes (TanStack Router)
    __root.tsx       Root layout — always rendered, contains <html>/<body>
    index.tsx        Home page (/)
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

### Path Alias

`#/*` maps to `./src/*`. Use it for imports:

```ts
import { something } from "#/utils/helpers";
```

## Commands

Run from the app directory or repo root:

| Command            | Description                   |
| ------------------ | ----------------------------- |
| `bun run dev`      | Start dev server on port 3001 |
| `bun run build`    | Production build              |
| `bun run lint`     | Run ESLint                    |
| `bun run lint:fix` | Auto-fix lint issues          |
