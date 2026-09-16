# @repo/convex-backend — Convex Backend Service

## Architecture & Modular Domain Layout

Convex backend functions are organized into domain-bound module subdirectories under `convex/`:

- **`convex/users/`** — User accounts, auth sync, volunteer availability, helper preferences
- **`convex/requests/`** — Task/help request management, status state machine, geocoding, filters
- **`convex/messaging/`** — In-app message threads & masked email relay
- **`convex/notifications/`** — Recipient notifications & CTA routing
- **`convex/admin/`** — Admin metrics, attention thresholds, redactions

Top-level entry files (`users.ts`, `helpRequests.ts`, `requestMessages.ts`, `notifications.ts`, `adminDashboard.ts`, `adminSettings.ts`) re-export queries and mutations from domain submodules to preserve client API contract compatibility.

## Testing & Seeding Commands

Commands are run from `apps/convex-backend` or via workspace filtering:

| Task                | Command                      | Description                                                  |
| ------------------- | ---------------------------- | ------------------------------------------------------------ |
| **Run Unit Tests**  | `bun test`                   | Runs unit test suites (`**/*.test.ts`) using Bun test runner |
| **Typecheck**       | `tsc -p convex`              | Validates TypeScript types across Convex functions           |
| **Seed Database**   | `bunx convex run seed:run`   | Populates local Convex deployment with demo fixtures         |
| **Clear Seed Data** | `bunx convex run seed:clear` | Removes seeded rows from local database                      |

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
