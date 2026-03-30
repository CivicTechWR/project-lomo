# AGENTS.md

AI agent instructions for the LoMo project. This is the single source of truth — `CLAUDE.md` symlinks here. Each app has its own `AGENTS.md` for app-specific conventions.

## Project Overview

LoMo is a calm, consent-based community help platform (CivicTechWR Season 7). Bun monorepo orchestrated by Turborepo. Early stage — most features are not yet built.

## Monorepo Layout

```
project-lomo/
  apps/webapp/             @repo/webapp         React 19 + Vite + TanStack Router
  apps/backend/            @repo/backend        Django 5 + DRF (Dockerized)
  packages/ui/             @repo/ui             Design system: Tailwind v4 + react-aria-components
  packages/eslint-config/  @repo/eslint-config  Shared ESLint config (antfu)
```

See `apps/webapp/AGENTS.md`, `apps/backend/AGENTS.md`, and `packages/ui/AGENTS.md` for app-specific instructions.

## Commands

Run all commands from the repo root.

| Command | Description |
|---------|-------------|
| `bun install` | Install all workspace dependencies |
| `bun run dev` | Start everything (Postgres, Django, Vite) in Turbo TUI |
| `bun run dev:web` | Start only the webapp |
| `bun run build` | Build all packages |
| `bun run lint` | Lint all packages |
| `bun run lint:fix` | Auto-fix lint issues |

## Do NOT

- Do NOT commit `.env` files

## Pending Decisions

These are not yet decided. Do not introduce them without explicit instruction:

- OpenAPI documentation generator: drf-spectacular vs drf-yasg
- Frontend hosting: Vercel vs Cloudflare vs Railway
- Python linter/formatter: not yet chosen


## External References

The [Radix UI Themes](https://github.com/radix-ui/themes) repo is used as a design reference. If cloned locally, place it at `~/refs/themes` — when present, prefer this over fetching from the internet.

The [React Aria components](https://github.com/adobe/react-spectrum) repo is used as building blocks for our shared UI for web. If cloned locally, place it at `~/refs/react-spectrum` — when present, prefer this over fetching from the internet.

This is a **reference, not a source of truth**. Our component behavior and accessibility come from react-aria-components. What we reference from Radix Themes:

- **Color scale semantics** — which of the 12 steps to use for backgrounds, borders, solid fills, text
- **Component variant naming** — e.g., solid/soft/outline/ghost styles
- **Token scales** — the structure of radius, typography, and spacing ramps
- **Prop conventions** — numeric size scales, color-as-prop pattern

Consult it when adding new components or extending the design token system. For how components are built (props, composition, accessibility), follow react-aria-components and this package's own conventions.
