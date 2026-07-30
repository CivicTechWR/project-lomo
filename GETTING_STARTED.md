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

### 3. Start everything

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

The backend uses [Convex](https://docs.convex.dev), a backend-as-a-service platform. After initial setup, you need to configure environment variables from the `apps/convex-backend` directory:

```bash
cd apps/convex-backend
bunx convex env set SITE_URL http://localhost:3000
bunx convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)
```

See the [Convex documentation](https://docs.convex.dev) for additional details on deployment and configuration.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming conventions, commit message format, and the pull request workflow.

## Getting Help

- Join the **CTWR Slack** and find the LoMo channel
- Attend **weekly Wednesday CTWR meetings**
- Open a [GitHub Issue](https://github.com/CivicTechWR/project-lomo/issues) for bugs or questions
