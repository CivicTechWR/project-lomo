# 0001: Use Next.js 16, Convex, and Better Auth

## Status
Accepted

## Date
2026-09-01

## Context
LoMo is a calm, consent-based community support platform designed for real-time community interactions (asks and offers for community help). Key architectural requirements:
- Real-time reactivity for help requests, status updates, and notifications.
- Low operational overhead for a non-profit / civic tech community project.
- Secure, accessible authentication with standard phone / email or social sign-in.
- Type safety across full-stack API boundaries without heavy boilerplate.

## Decision
Use Next.js 16 (App Router) as the web application framework, Convex as the serverless backend-as-a-service database and real-time backend, and Better Auth for user authentication.

## Alternatives Considered

### PostgreSQL + Prisma + Custom REST/tRPC API
- Pros: Relational schema, standard SQL database ecosystem.
- Cons: High ops overhead, requires manual WebSocket setup or polling for real-time subscription capabilities.
- Rejected: Community help request updates and notifications require instant state synchronization, which Convex provides out of the box.

### Firebase / Firestore
- Pros: Real-time document store, mature SDKs.
- Cons: Lacks end-to-end TypeScript integration, complex security rules syntax, non-relational query limitations.
- Rejected: Convex offers end-to-end TypeScript safety and function-based queries with native auth integration.

## Consequences
- Instant real-time state updates across web clients without custom WebSocket management.
- Backend functions defined in TypeScript (`apps/convex-backend/convex/`) with automatic type generation.
- Simplified local development setup using `bunx convex dev` / Turborepo.
- Monorepo workspace structure separating web frontend (`apps/lomoweb`) and backend (`apps/convex-backend`).
