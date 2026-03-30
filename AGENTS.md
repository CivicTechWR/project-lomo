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

Two reference repos are cloned locally. Always prefer reading these over fetching from the internet.

### Radix UI Themes — design reference

- **Repo:** [radix-ui/themes](https://github.com/radix-ui/themes)
- **Local path:** `~/refs/themes`
- **Role:** Visual design patterns only — we do not depend on Radix at runtime.

What we reference:

- **Color scale semantics** — which of the 12 steps to use for backgrounds, borders, solid fills, text
- **Component variant naming** — e.g., solid/soft/outline/ghost styles
- **Token scales** — the structure of radius, typography, and spacing ramps
- **Prop conventions** — numeric size scales, color-as-prop pattern

Consult when adding new components or extending the design token system.

### React Spectrum — component reference

- **Repo:** [adobe/react-spectrum](https://github.com/adobe/react-spectrum) (includes React Aria, React Stately, and React Aria Components)
- **Local path:** `~/refs/react-spectrum`
- **Role:** We depend on the `react-aria-components` npm package at runtime for accessible primitives. The repo is a reference for understanding internals, composition patterns, and context architecture.

What we reference:

- **Component composition** — how primitives are composed (slots, render props, context providers)
- **Context patterns** — how group components pass state and style to children
- **Accessibility** — ARIA roles, keyboard navigation, focus management
- **Architecture patterns** — separation of concerns (e.g., layout vs semantics, hooks vs components)

For how our components are built (props, styling, variants), follow `@repo/ui`'s own conventions in `packages/ui/AGENTS.md`. React Aria Components provides the accessible foundation; Radix Themes informs the visual design language.
