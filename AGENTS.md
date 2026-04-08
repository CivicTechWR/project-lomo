# AGENTS.md

AI agent instructions for the LoMo project. This is the single source of truth — `CLAUDE.md` symlinks here. Each app has its own `AGENTS.md` for app-specific conventions.

## Project Overview

LoMo is a calm, consent-based community help platform (CivicTechWR Season 7). Bun monorepo orchestrated by Turborepo. Early stage — most features are not yet built.

## Monorepo Layout

```
project-lomo/
  apps/lomoweb/                  @repo/lomoweb                Next.js 16 + Convex + Better Auth
  apps/convex-backend/           @repo/convex-backend         Convex backend-as-a-service
  packages/ui/                   @repo/ui                     Design system: Tailwind v4 + react-aria-components
  packages/eslint-config/        @repo/eslint-config          Shared ESLint config (antfu)
```

See `apps/lomoweb/AGENTS.md` and `packages/ui/AGENTS.md` for app-specific instructions.

## Code Quality Standards

- When you run lint/typecheck/tests and they fail, fix ALL failures — even in files you didn't touch. You own the build, not just your diff.
- After creating or modifying any rule, config, or behavior — VERIFY it works. Write a test, create a mock, or run a concrete example. Never assume correctness.
- If you can't verify something in the current environment, say so explicitly and explain what verification is needed — don't just say "should be fine."
- Treat every change as if the person won't revisit it later. If something related is broken or unverified, handle it now.

## Commands

Run all commands from the repo root. **Always target specific packages** using `bun --filter=<package_name>` instead of running monorepo-wide commands or cd-ing into directories.

### Targeting a specific package

```bash
bun --filter=@repo/lomoweb run lint
bun --filter=@repo/convex-backend run build
bun --filter=@repo/ui run lint:fix
```

### Monorepo-wide commands (via Turbo)

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps in Turbo TUI |
| `bun run build` | Build all packages |
| `bun run lint` | Lint all packages |
| `bun run lint:fix` | Auto-fix lint issues |

### Fixing lint errors

1. **Always run `lint:fix` first** — most issues (formatting, import order, quotes, semicolons) are auto-fixable:
   ```bash
   bun --filter=@repo/<package> run lint:fix
   ```
2. **Then run `lint`** to see what remains:
   ```bash
   bun --filter=@repo/<package> run lint
   ```
3. Only manually resolve errors that survive auto-fix.

### Installing dependencies

**Do NOT run `bun install` directly.** Ask the user to review dependency changes and run it themselves.

## Do NOT

- Do NOT commit `.env` files
- Do NOT run `bun install` — the user reviews and installs dependencies themselves

## Pending Decisions

These are not yet decided. Do not introduce them without explicit instruction:

- Frontend hosting: Vercel vs Cloudflare vs Railway


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
