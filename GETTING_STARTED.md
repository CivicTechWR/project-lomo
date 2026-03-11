# Getting Started with LoMo

This guide walks you through setting up the LoMo project for local development.

## Prerequisites

- **[Bun](https://bun.sh) 1.0+** — used as the package manager and runtime
- **[Docker](https://www.docker.com)** — used to run PostgreSQL and the Django backend locally
- **Git 2.30+**

To verify:

```bash
bun --version
docker --version
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

This installs dependencies for all workspaces (`apps/webapp`, `packages/eslint-config`).

### 3. Start everything

```bash
bun run dev
```

This starts:

- **PostgreSQL 17** on port `5432` (User: `postgres`, Password: `postgres`, Database: `lomo`)
- **Django backend** on port `8000`
- **Vite dev server** (webapp) on port `5173`

> **Note:** The first run will be slower because Docker needs to build the backend image. Subsequent runs will be fast.

## Project Structure

```
project-lomo/
├── apps/
│   ├── webapp/               # React 19 + TypeScript + Vite frontend
│   └── backend/              # Django 5 + DRF backend (Docker)
├── packages/
│   └── eslint-config/        # Shared ESLint configuration
└── package.json              # Root workspace config (Bun)
```

## Common Commands

| Command              | Description                                |
| -------------------- | ------------------------------------------ |
| `bun run dev`        | Start all apps in dev mode                 |
| `bun run dev:web`    | Start only the webapp                      |
| `bun run dev:stop`   | Stop Docker services (postgres + backend)  |
| `bun run dev:logs`   | Tail Docker service logs                   |
| `bun run dev:reset`  | Stop Docker services and wipe DB volumes   |
| `bun run build`      | Build all packages                         |
| `bun run lint`       | Lint all packages                          |
| `bun run lint:fix`   | Auto-fix lint issues                       |

## Contributing

1. Create a branch: `git checkout -b your-feature`
2. Make your changes
3. Run `bun run lint` to check for issues
4. Open a pull request against `main`

## Getting Help

- Join the **CTWR Slack** and find the LoMo channel
- Attend **weekly Wednesday CTWR meetings**
- Open a [GitHub Issue](https://github.com/CivicTechWR/project-lomo/issues) for bugs or questions
