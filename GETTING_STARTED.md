# Getting Started with LoMo

This guide walks you through setting up the LoMo project for local development.

## Prerequisites

- **[Bun](https://bun.sh) 1.0+** — used as the package manager and runtime
- **[Docker](https://www.docker.com)** — used to run PostgreSQL locally
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

This installs dependencies for all workspaces (`apps/webapp`, `apps/backend-placeholder`, `packages/eslint-config`).

### 3. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL 17 instance on port `5432` with:

- User: `postgres`
- Password: `postgres`
- Database: `lomo`

### 4. Start the webapp

```bash
bun run dev:web
```

The webapp will be available at `http://localhost:5173` (default Vite port).

To run all apps at once:

```bash
bun run dev
```

## Project Structure

```
project-lomo/
├── apps/
│   ├── webapp/               # React 19 + TypeScript + Vite frontend
│   └── backend-placeholder/  # Backend (not yet implemented)
├── packages/
│   └── eslint-config/        # Shared ESLint configuration
├── docker-compose.yaml       # PostgreSQL database
└── package.json              # Root workspace config (Bun)
```

## Common Commands

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `bun run dev`       | Start all apps in dev mode         |
| `bun run dev:web`   | Start only the webapp              |
| `bun run build`     | Build all packages                 |
| `bun run lint`      | Lint all packages                  |
| `bun run lint:fix`  | Auto-fix lint issues               |
| `docker compose up -d`   | Start the database            |
| `docker compose down`    | Stop the database             |

## Contributing

1. Create a branch: `git checkout -b your-feature`
2. Make your changes
3. Run `bun run lint` to check for issues
4. Open a pull request against `main`

## Getting Help

- Join the **CTWR Slack** and find the LoMo channel
- Attend **weekly Wednesday CTWR meetings**
- Open a [GitHub Issue](https://github.com/CivicTechWR/project-lomo/issues) for bugs or questions
