# LoMo

## CivicTechWR Season 7 Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A calm, consent-based platform for asking for and offering help in the community — without pressure, rage, or performance.

## Problem Statement

**What is the problem?**
People want to ask for and offer help within their community, but existing tools create social friction — performance anxiety, pressure dynamics, and lack of consent-based interactions make this harder than it needs to be.

**Who is affected?**
Members of the community interested in a sharing economy.

**What exists today?**
Various buy-nothing groups, community Facebook groups, and mutual aid networks exist, but they tend to be informal, high-friction, and lack structure for consent-based matching.

**Why now?**
As climate change affects our food systems and personal security, community resilience depends on thinking in terms of collective wellbeing rather than individual success. We need infrastructure that makes it easy to give and receive help.

## Solution Overview

A platform for people to post asks and offers, matched with others in their community — built on calm, consent-based principles.

## Team

| Name            | Role                      | Skills               |
| --------------- | ------------------------- | -------------------- |
| Rebecca Sargent | Project Owner             | SME                  |
| Mohamed Fouda   | Technical Product Manager | Product Management   |
| Sara Ahmad      | Project Manager           | Project Management   |
| Chen Lu         | Designer                  | Design               |
| Jay             | Software Developer        | Software Development |
| Chris Craig     | Software Developer        | Software Development |

## Technical Approach

**Technology Stack:**

- Main app: Next.js 16 + Convex + Better Auth (`apps/lomoweb`)
- Backend: Convex backend-as-a-service (`apps/convex-backend`)
- Component library: Tailwind v4 + react-aria-components (`packages/ui`)
- Shared lint config: ESLint with antfu preset (`packages/eslint-config`)
- Package manager: Bun 1.3.8+ (monorepo workspaces)
- Orchestration: Turborepo
- Runtime: Node >=22

## Project Timeline

- **Week 1-3**: Problem validation and user research
- **Week 4-6**: User research and prototype development
- **Week 7-9**: Core feature development
- **Week 10-11**: Testing and refinement
- **Week 12**: Demo Day presentation

## Setup

### Prerequisites

- [Bun](https://bun.sh) 1.3.8+
- [Node.js](https://nodejs.org) >=22

### Getting started

```bash
bun install
bun run dev
```

This starts all apps via Turborepo. Turbo's TUI keeps each process in its own log view. See [GETTING_STARTED.md](GETTING_STARTED.md) for a full walkthrough, or [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

### Available commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps in Turbo's terminal UI |
| `bun run build` | Build all packages |
| `bun run typecheck` | Run type checking across all packages |
| `bun run test` | Run test suites across all packages |
| `bun run lint` | Lint all packages |
| `bun run lint:fix` | Auto-fix lint issues |

## Community Impact

**How this strengthens Waterloo Region's civic fabric:**
By lowering the barrier to asking for and offering help, LoMo helps build the trust networks and mutual aid capacity that communities need to be resilient.

## Architecture & Decision Records

Key architectural decisions are recorded as Architecture Decision Records (ADRs) in [`docs/decisions/`](docs/decisions/):
- [ADR-0001: Next.js 16, Convex, and Better Auth Stack](docs/decisions/0001-use-convex-nextjs-better-auth.md)
- [ADR-0002: Tailwind v4 and React Aria Design System (`@repo/ui`)](docs/decisions/0002-tailwind-v4-react-aria-design-system.md)
- [ADR-0003: Yellow CTA Button Treatment](docs/decisions/0003-yellow-cta-button-treatment.md)
- [ADR-0004: Adaptive Three-Tier Responsive Navigation Layout](docs/decisions/0004-adaptive-three-tier-navigation.md)
- [ADR-0005: Modular Domain Architecture and Custom Data Hooks Layer](docs/decisions/0005-modular-domain-architecture-and-data-hooks.md)

## AI Agents

See [AGENTS.md](AGENTS.md) for AI agent instructions (code style, conventions, project structure).

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- CivicTechWR community and Season 7 participants

---

**CivicTechWR Season 7** • [CTWR Website](https://civictechwr.org)
