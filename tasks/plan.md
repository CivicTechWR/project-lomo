# Implementation Plan: Isolated Local E2E Database

## Objective
Run Playwright account-creation and help-request-creation scenarios against a disposable Convex deployment that runs entirely on the developer's machine. The E2E run must not select, clear, seed, or otherwise mutate the developer's existing database, and must remove only its own temporary state when finished.

## Assumptions
- The normal development database is a local Convex deployment whose data must persist unchanged.
- E2E may stop the normal local Convex process while running because local deployments use fixed default ports; preserving its files/data is required, concurrent operation is not.
- `bun run test:e2e` should become the single entry point that provisions and cleans up the disposable backend as well as running Playwright.
- E2E should use local services only. Account setup must not depend on sending real email or contacting a cloud Convex deployment.
- Scope is the disposable test environment plus the signup and request-creation browser flows, not broader auth or request-product changes.

## Architecture Decisions
- Run Convex from an isolated temporary project directory so its `.convex` state is separate from the development project's state.
- Pass the temporary deployment's Convex URLs and test site configuration only to the E2E Next.js process; do not edit or overwrite the developer's `.env.local`.
- Ensure the E2E runner cannot reuse an already-running Next.js server pointed at another database.
- Use process cleanup in all exit paths, and delete only the exact temporary directory created by the runner.
- The verified local URLs are `http://127.0.0.1:3210` (Convex API) and `http://127.0.0.1:3211` (HTTP actions). The isolated deployment needs `SITE_URL`, `BETTER_AUTH_SECRET`, and `ADMIN_EMAILS` before its functions push successfully.
- Start the unconfigured CLI non-interactively so it provisions an anonymous local backend without account login. Use a temp location on the same filesystem as the Convex CLI's temporary/cache files, or set `CONVEX_TMPDIR` accordingly; the probe under `/tmp` emitted a cross-filesystem warning.

## Task List

### Phase 1: Verify Disposable Local Backend
- [x] Confirm the installed Convex CLI initializes an anonymous local deployment in an isolated project directory.
- [x] Confirm local URLs, required Better Auth environment variables, non-interactive initialization, and successful function sync.
- [x] Verify the normal development deployment remains unchanged after starting and stopping the isolated backend.

### Phase 2: Automate E2E Lifecycle
- [x] Add a runner that creates a temporary backend project, initializes anonymous local Convex state, configures test-only auth variables, and waits for both local endpoints.
- [x] Run Playwright with server reuse disabled; fail closed if invoked outside the isolated runner; clean child processes and temporary state on success, test failure, and SIGINT.
- [x] Keep `bun run test:e2e` as the documented entry point.

### Checkpoint: Isolation
- [x] The runner passes only local Convex API/site URLs to the E2E frontend.
- [x] The existing development Convex data and `.env.local` are unchanged.
- [x] Failed and interrupted runs leave no temporary backend process or directory behind.

### Phase 3: Add Browser Scenarios
- [x] Validate the actual signup flow: Better Auth does not require email verification.
- [x] Add a Playwright test that creates a uniquely named account and verifies the signed-in onboarding state.
- [x] Create a help request through the user-facing request flow and verify it appears in the account's My Requests list.
- [x] Keep test data isolated in the disposable database; do not rely on preexisting development fixtures.

### Checkpoint: User Flows
- [x] Signup and request creation pass on a clean disposable database.
- [x] E2E runs do not depend on previous runs' users or requests.
- [x] Existing unit tests and type checks for touched packages pass.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| Local Convex deployments use ports already occupied by the normal dev stack | E2E startup collision | Detect occupied ports 3000, 3210, and 3211 before provisioning; fail without stopping existing services or changing their data. |
| Better Auth signup requires email verification or deployment environment variables | Account flow cannot complete offline | Verify the existing auth contract first; configure a local-only test path without sending external email or weakening production auth. |
| CLI initialization prompts or changes the source project's deployment selection | Unsafe or non-repeatable setup | Run CLI only from the isolated project directory and test non-interactive startup before wiring Playwright. |
| Cleanup deletes the wrong data or misses child processes | Development data loss or leaked processes | Track a unique temp path and child PIDs; never remove the source project's `.convex` directory; validate failure cleanup. |

## Open Questions
- Does signup require a verification email in the current Better Auth configuration, and is there an existing local test mode for that flow?
