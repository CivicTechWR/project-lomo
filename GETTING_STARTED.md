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

### 2. Install dependencies

```bash
bun install
```

### 3. Create the frontend environment file

```bash
cp apps/lomoweb/.env.local.example apps/lomoweb/.env.local
```

The defaults work for local development — no edits needed.

### 4. Set Convex environment variables

From the repo root:

```bash
cd apps/convex-backend
bunx convex env set SITE_URL http://localhost:3000
bunx convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)
```

These are stored in Convex's cloud config, not in a local file, so you only need to run this once per deployment.

### 5. Grant yourself admin access

Set your email as an admin in Convex's cloud config:

```bash
bunx convex env set ADMIN_EMAILS "your@email.com"
```

Replace `your@email.com` with the email you'll use to sign up. You can add multiple admins as a comma-separated list (e.g. `"alice@example.com,bob@example.com"`).

After this, signing in with that email gives you access to the admin panel at `/app/admin`.

### 6. (Optional) Seed test data for the admin dashboard

```bash
bunx convex run seed:run
```

This inserts sample users, requests, messages, and notifications so the admin dashboard has content to display. It's idempotent — safe to re-run anytime.

Seeded requests carry a spread of deadlines (`neededByInDays` in `apps/convex-backend/convex/lib/seedData.ts`, resolved relative to seed time) — including one already overdue and unmatched, and one no-deadline request — so the admin dashboard has something to show under every "needs attention" case without waiting for real data to accumulate.

### 7. Start everything

```bash
bun run dev
```

## What `bun run dev` starts

Turborepo starts all apps in the monorepo and opens a terminal UI for managing log views. Each process gets its own log panel instead of a single interleaved stream, making it easy to monitor individual apps.

## Project Structure

```
project-lomo/
├── apps/
│   ├── lomoweb/              # Next.js 16 + Convex + Better Auth
│   ├── convex-backend/       # Convex backend-as-a-service
│   └── documentation/        # Design system showcase (Vite 7 + TanStack Router)
├── packages/
│   ├── ui/                   # Component library (Tailwind v4 + react-aria-components)
│   └── eslint-config/        # Shared ESLint configuration
└── package.json              # Root workspace config (Bun + Turborepo)
```

## Common Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps in Turbo's terminal UI |
| `bun run build` | Build all packages |
| `bun run lint` | Lint all packages |
| `bun run lint:fix` | Auto-fix lint issues |

## Convex Backend

The backend uses [Convex](https://docs.convex.dev), a backend-as-a-service platform. See the [Convex documentation](https://docs.convex.dev) for details on deployment and configuration beyond local dev.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming conventions, commit message format, and the pull request workflow.

## Getting Help

- Join the **CTWR Slack** and find the LoMo channel
- Attend **weekly Wednesday CTWR meetings**
- Open a [GitHub Issue](https://github.com/CivicTechWR/project-lomo/issues) for bugs or questions
