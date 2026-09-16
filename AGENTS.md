# AGENTS.md

AI agent instructions for the LoMo project. This is the single source of truth — `CLAUDE.md` symlinks here. Each app has its own `AGENTS.md` for app-specific conventions.

## Project Overview

LoMo is a calm, consent-based community help platform (CivicTechWR Season 7). Bun monorepo orchestrated by Turborepo. Early stage — most features are not yet built.

## Working Contract / Staleness Rule

These agent files are a working contract for the current repo, not a historical archive. If a rule in this file conflicts with the implementation, the current app code, tests, or package README wins.

When you find drift between the guidance and reality:
- prefer the code that is actually shipped,
- update the agent guidance in the same change,
- avoid preserving rules that only describe an earlier prototype or a design direction that was never adopted.

This keeps agent instructions useful without turning them into a lock on old decisions.

## Monorepo Layout

```
project-lomo/
  apps/lomoweb/                  @repo/lomoweb                Next.js 16 + Convex + Better Auth
  apps/convex-backend/           @repo/convex-backend         Convex backend-as-a-service
  packages/ui/                   @repo/ui                     Design system: Tailwind v4 + react-aria-components
  packages/eslint-config/        @repo/eslint-config          Shared ESLint config (antfu)
```

See `packages/ui/AGENTS.md` for package-specific design system instructions.

## Code Quality Standards

- When you run lint/typecheck/tests and they fail, fix ALL failures — even in files you didn't touch. You own the build, not just your diff.
- After creating or modifying any rule, config, or behavior — VERIFY it works. Write a test, create a mock, or run a concrete example. Never assume correctness.
- If you can't verify something in the current environment, say so explicitly and explain what verification is needed — don't just say "should be fine."
- Treat every change as if the person won't revisit it later. If something related is broken or unverified, handle it now.
- When a UI copy or layout change is intentional, do not keep tests pinned to the old contract. Prefer assertions for current user-facing behavior, accessibility, and semantics over brittle exact-text or legacy DOM structure assumptions. Stale tests are a common false failure when product wording or markup evolves.

## UI Design Standards

These are the product-level design rules that apply to all user-facing interfaces unless a page is explicitly designated as a different admin context:

- Buttons should have visible borders and clear focus treatment.
- Links should have a clear link affordance, typically underline or another strong textual cue, rather than relying on color alone.
- Primary actions should follow the strongest approved brand action for the product, not a generic default color rule. Current product direction favors the warm brand emphasis already used in the homepage and app shell.
- Clickable objects may use subtle elevation, but shadows should be selective and restrained so they do not overwhelm hierarchy or create visual noise.
- Every user-facing page should share the same spacing, card, button, and typography language.
- The product must be mobile-first, touch-friendly, and responsive across breakpoints.
- Navigation should use a unified design grammar, even when the homepage and app shell differ in structure.
- The admin interface may have a different operational context, but it should still follow the same spacing, hierarchy, and interaction principles.
- Design should feel calm, trustworthy, and community-centered rather than performance-driven, transactional, or overly glossy.
- Use accessible color and contrast decisions; never rely on color alone to communicate state.

These rules should guide all implementation work in the repo and are intended to be the long-term design contract for LoMo UI.

### Test contract drift rule

A failing UI test is not always a product regression. Sometimes the app is correct and the test is stale.

Common examples:
- exact text assertions that no longer match the current marketing copy
- `data-testid` expectations for a layout that has intentionally changed (for example from cards to list items)
- legacy heading names or section labels after a UX refinement

When this happens:
- verify whether the change is intentional
- update the test to the current contract
- assert the current behavior in user-visible terms (roles, labels, order, semantics), not legacy implementation details

This keeps tests stable as the product evolves without turning them into a lock on old wording or older component structure.

## Commands

Run all commands from the repo root. **Always target specific packages** using `bun --filter=<package_name>` instead of running monorepo-wide commands or cd-ing into directories.

### Targeting a specific package

```bash
bun --filter=@repo/lomoweb run lint
bun --filter=@repo/lomoweb run test
bun --filter=@repo/convex-backend run build
bun --filter=@repo/ui run lint:fix
```

### Monorepo-wide commands (via Turbo)

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps in Turbo TUI |
| `bun run build` | Build all packages |
| `bun run typecheck` | Run type checking across all packages |
| `bun run test` | Run test suites across all packages |
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

## Local Dev Setup

When a user asks you to set up their local environment, run these steps in order:

**Step 1 — Copy the frontend env file** (skip if `apps/lomoweb/.env.local` already exists):
```bash
cp apps/lomoweb/.env.local.example apps/lomoweb/.env.local
```

**Step 2 — Set the required Convex environment variables** (run from repo root):
```bash
bunx convex env set SITE_URL http://localhost:3000 --project-dir apps/convex-backend
bunx convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32) --project-dir apps/convex-backend
bunx convex env set ADMIN_EMAILS "your@email.com" --project-dir apps/convex-backend
```

These are stored in Convex's deployment config, not in a local file. They only need to be set once per deployment; rerunning them is safe and simply replaces the existing values.

**Step 3 — Start the app stack**:
```bash
bun run dev
```

This launches the monorepo apps, including the Convex backend.

**Step 4 — Seed the local database** (after the backend has started successfully):
```bash
cd apps/convex-backend
bunx convex run seed:run
```

This populates the local database with the built-in demo users, help requests, and notifications for local development. Rerunning it resets the seeded data to the default fixtures.

If you want to remove only the seed data without reinserting it:
```bash
cd apps/convex-backend
bunx convex run seed:clear
```

## Do NOT

- Do NOT commit `.env` files
- Do NOT run `bun install` — prompt and wait for the user to review and install dependencies themselves

## Architecture Decision Records (ADRs)

Architectural decisions are formally recorded in `docs/decisions/`. Before introducing major dependencies, layout overhauls, or API changes, consult existing ADRs and document new significant decisions in `docs/decisions/`.

## Pending Decisions

These are not yet decided. Do not introduce them without explicit instruction:

- Frontend hosting: Vercel vs Cloudflare vs Railway
