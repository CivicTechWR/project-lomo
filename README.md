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

- Frontend: React 19 + TypeScript + Vite + TanStack Router (`apps/webapp`)
- Backend: Django 5 + Django REST Framework (`apps/backend`)
- Database: PostgreSQL 17 (Docker)
- Package Manager: Bun (monorepo workspaces)

## Project Timeline

- **Week 1-3**: Problem validation and user research
- **Week 4-6**: User research and prototype development
- **Week 7-9**: Core feature development
- **Week 10-11**: Testing and refinement
- **Week 12**: Demo Day presentation

## Setup

### Prerequisites

- [Bun](https://bun.sh) 1.0+
- [Docker](https://www.docker.com) (for the database and backend)

### Getting started

```bash
bun install
bun run dev
```

This starts the database, backend, and webapp all at once. See [GETTING_STARTED.md](GETTING_STARTED.md) for a full walkthrough, or [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
Turbo's TUI keeps each long-running process in its own log view.

### Other commands

```bash
bun run dev:web    # Start only the webapp
bun run dev:stop   # Stop Docker services
bun run dev:reset  # Stop Docker services and wipe DB
bun run build      # Build all packages
bun run lint       # Lint all packages
bun run lint:fix   # Auto-fix lint issues
```

## Community Impact

**How this strengthens Waterloo Region's civic fabric:**
By lowering the barrier to asking for and offering help, LoMo helps build the trust networks and mutual aid capacity that communities need to be resilient.

## AI Agents

See [AGENTS.md](AGENTS.md) for AI agent instructions (code style, conventions, project structure).

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- CivicTechWR community and Season 7 participants

---

**CivicTechWR Season 7** • [CTWR Website](https://civictechwr.org)
