# AGENTS.md

AI agent instructions for the LoMo project. This is the single source of truth — `CLAUDE.md` symlinks here. Each app has its own `AGENTS.md` for app-specific conventions.

## Project Overview

LoMo is a calm, consent-based community help platform (CivicTechWR Season 7). Bun monorepo orchestrated by Turborepo. Early stage — most features are not yet built.

## Monorepo Layout

```
project-lomo/
  apps/webapp/             @repo/webapp         React 19 + Vite + TanStack Router
  apps/backend/            @repo/backend        Django 5 + DRF (Dockerized)
  packages/eslint-config/  @repo/eslint-config  Shared ESLint config (antfu)
```

See `apps/webapp/AGENTS.md` and `apps/backend/AGENTS.md` for app-specific instructions.

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

- Component library: shadcn/ui vs custom React Aria components
- OpenAPI documentation generator: drf-spectacular vs drf-yasg
- Frontend hosting: Vercel vs Cloudflare vs Railway
- Python linter/formatter: not yet chosen
