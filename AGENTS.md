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
| `bun run setup` | One-command local onboarding (see Local Dev Setup) |
| `bun run dev` | Start all apps in Turbo TUI |
| `bun run build` | Build all packages |
| `bun run typecheck` | Run type checking across all packages |
| `bun run test` | Run test suites across all packages |
| `bun run test:e2e` | Run Playwright end-to-end tests |
| `bun run lint` | Lint all packages |
| `bun run lint:fix` | Auto-fix lint issues |

### Browser testing with playwright-cli

For interactive or agent-driven browser automation and UI verification, `@playwright/cli` is configured in the root:

```bash
bunx playwright-cli open http://localhost:3000/   # Open page
bunx playwright-cli snapshot                      # View accessibility snapshot & element refs
bunx playwright-cli click <ref>                   # Click element (e.g. e9)
bunx playwright-cli find "<text>"                 # Search snapshot for text
bunx playwright-cli eval "<code>"                 # Run JS expression in page
bunx playwright-cli screenshot                    # Capture page screenshot
bunx playwright-cli close                         # Terminate browser session
```

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

`bun.lock` must only be generated or updated by Bun. Never edit it manually.

## Local Dev Setup

Local setup is a single command, implemented in `scripts/setup.ts`:

```bash
bun run setup
```

It installs dependencies, creates `apps/lomoweb/.env.local`, creates a local Convex deployment (anonymous on first run — no login), sets any missing Convex env vars (`SITE_URL`, generated `BETTER_AUTH_SECRET`, `ADMIN_EMAILS` from `git config user.email`), pushes the backend, seeds demo data, syncs the Convex URLs into the web env file, and then starts `bun run dev`. It is idempotent: existing env vars are never overwritten and seeding only resets seeded rows. Flags: `--admin-email <email>`, `--no-dev`, `--no-seed`.

Because it runs `bun install`, **ask the user to run `bun run setup` themselves** rather than running it for them (see "Do NOT" below).

If you change what the backend needs at startup (a new required Convex env var, a new bootstrap step), update `scripts/setup.ts` and `GETTING_STARTED.md` in the same change so onboarding stays one command.

Manual Convex commands (from `apps/convex-backend`, with the backend running): `bunx convex env set NAME value`, `bunx convex run seed:run`, `bunx convex run seed:clear`.

## Do NOT

- Do NOT commit `.env` files
- Do NOT run `bun install` — prompt and wait for the user to review and install dependencies themselves

## Architecture Decision Records (ADRs)

Architectural decisions are formally recorded in `docs/decisions/`. Before introducing major dependencies, layout overhauls, or API changes, consult existing ADRs and document new significant decisions in `docs/decisions/`.

## Pending Decisions

These are not yet decided. Do not introduce them without explicit instruction:

- Frontend hosting: Vercel vs Cloudflare vs Railway

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
