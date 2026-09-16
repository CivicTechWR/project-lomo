# 0005: Modular Domain Architecture and Custom Data Hooks Layer

## Status
Accepted

## Date
2026-09-02

## Context
As the LoMo codebase grows, placing all Convex queries and mutations in flat files (`helpRequests.ts`, `users.ts`, `requestMessages.ts`, etc.) and invoking raw `useQuery`/`useMutation` hooks directly inside Next.js presentation components blurred domain boundaries and coupled UI markup closely to backend function schemas.

## Decision
1. **Convex Backend Domain Modularization (`@repo/convex-backend`):** Reorganize Convex functions into domain-bound module directories under `convex/`:
   - `convex/users/` — User accounts, auth sync, volunteer availability, helper preferences
   - `convex/requests/` — Task/help request management, status state machine, geocoding, filters
   - `convex/messaging/` — In-app message threads & masked email relay
   - `convex/notifications/` — Recipient notifications & CTA routing
   - `convex/admin/` — Admin dashboard metrics, attention thresholds, redactions
   Top-level API entry files (`convex/users.ts`, `convex/helpRequests.ts`, etc.) re-export queries and mutations from domain submodules to preserve 100% API contract compatibility.

2. **Frontend Custom Data Hooks Layer (`@repo/lomoweb`):** Extract domain-bound React hooks under `apps/lomoweb/lib/hooks/` (`use-user-profile.ts`, `use-help-requests.ts`, `use-request-messages.ts`, `use-notifications.ts`, `use-admin.ts`). Presentation UI components consume these custom hooks instead of executing raw `useQuery(api...)` calls directly in UI render functions.

## Alternatives Considered

### Direct Workspace Component Packages for Convex
- Pros: Strict isolation at the package boundary.
- Cons: Unnecessary build and package configuration overhead for a single backend deployment at beta stage.
- Rejected: Convex module folders within the app provide sufficient domain isolation.

### Inline Queries in Components
- Pros: Zero abstraction overhead.
- Cons: UI presentation markup is coupled directly to backend schemas and query invocations, making refactoring and testing harder.
- Rejected: Custom feature hooks cleanly encapsulate Convex reactivity while keeping UI components focused on presentation.

## Consequences
- Clean separation between presentation components and Convex data subscriptions while preserving real-time reactivity.
- Modular domain structure makes adding or updating domain logic straightforward and isolated.
- Backward compatibility with client `api.*` imports is fully preserved.
