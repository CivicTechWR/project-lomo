# Getting Started with LoMo

This guide walks you through setting up the LoMo project for local development.

## Prerequisites

- **[Bun](https://bun.sh) 1.3.8+** — package manager and runtime
- **[Node.js](https://nodejs.org) >=22** — required runtime
- **[Git](https://git-scm.com) 2.30+**

To verify:

```bash
bun --version
node --version
git --version
```

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/CivicTechWR/project-lomo.git
cd project-lomo
```

### 2. Run setup

```bash
bun run setup
```

That one command does everything a new contributor needs:

1. Installs dependencies (`bun install`)
2. Creates `apps/lomoweb/.env.local` from the example (if it doesn't exist)
3. Starts Convex and creates a local deployment — no Convex account or login needed on first run
4. Sets any missing Convex environment variables: `SITE_URL`, a generated `BETTER_AUTH_SECRET`, and `ADMIN_EMAILS` (your `git config user.email`)
5. Pushes the backend and seeds demo users, requests, messages, and notifications
6. Copies the Convex URLs into `apps/lomoweb/.env.local`
7. Starts the app stack with `bun run dev` — open http://localhost:3000

It's safe to rerun at any time (for example after pulling, or if something gets out of sync). Existing Convex env vars are never overwritten, and seeding only resets the seeded demo rows — data you created through the app is left alone.

Options:

| Flag | Description |
|------|-------------|
| `--admin-email you@example.com` | Grant admin access to a different email than your git email (comma-separate multiple) |
| `--no-dev` | Stop after setup instead of starting `bun run dev` |
| `--no-seed` | Skip seeding demo data |

Pass flags directly, e.g. `bun run setup --admin-email you@example.com`.

Signing up with the admin email gives you access to the admin panel at `/app/admin`.

Seeded requests carry a spread of deadlines (`neededByInDays` in `apps/convex-backend/convex/lib/seedData.ts`, resolved relative to seed time) — including one already overdue and unmatched, and one no-deadline request — so the admin dashboard has something to show under every "needs attention" case without waiting for real data to accumulate.

### Day-to-day

After the first setup, just run:

```bash
bun run dev
```

### Manual Convex commands

You rarely need these, but they're available from `apps/convex-backend`:

```bash
cd apps/convex-backend
bunx convex env set ADMIN_EMAILS "alice@example.com,bob@example.com"  # change admins
bunx convex run seed:run    # reset seeded demo data
bunx convex run seed:clear  # remove seeded demo data
```

`convex env set` and `convex run` need the Convex backend running (`bun run dev` in another terminal).

## What `bun run dev` starts

Turborepo starts all apps in the monorepo and opens a terminal UI for managing log views. Each process gets its own log panel instead of a single interleaved stream, making it easy to monitor individual apps.

## Project Structure

```
project-lomo/
├── apps/
│   ├── lomoweb/              # Next.js 16 + Convex + Better Auth
│   └── convex-backend/       # Convex backend-as-a-service
├── packages/
│   ├── ui/                   # Component library (Tailwind v4 + react-aria-components)
│   └── eslint-config/        # Shared ESLint configuration
└── package.json              # Root workspace config (Bun + Turborepo)
```

## Common Commands

| Command | Description |
|---------|-------------|
| `bun run setup` | One-time (and rerunnable) local setup, then starts the app |
| `bun run dev` | Start all apps in Turbo's terminal UI |
| `bun run build` | Build all packages |
| `bun run typecheck` | Run type checking across all packages |
| `bun run test` | Run test suites across all monorepo packages |
| `bun run lint` | Lint all packages |
| `bun run lint:fix` | Auto-fix lint issues |
| `bun --filter=@repo/lomoweb run test` | Run the Next.js app test suite |

## Convex Backend

The backend uses [Convex](https://docs.convex.dev), a backend-as-a-service platform. See the [Convex documentation](https://docs.convex.dev) for details on deployment and configuration beyond local dev.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming conventions, commit message format, and the pull request workflow.

## Getting Help

- Join the **CTWR Slack** and find the LoMo channel
- Attend **weekly Wednesday CTWR meetings**
- Open a [GitHub Issue](https://github.com/CivicTechWR/project-lomo/issues) for bugs or questions
