# Tasks: Isolated Local E2E Database

- [x] **Task 1: Prove local backend isolation**
  - Acceptance: Convex starts from a temporary project directory with its own `.convex` state; no source `.env.local` or development `.convex` data is changed; required local ports and auth environment are known.
  - Verified: Convex CLI 1.45.0 configured an anonymous local deployment in an isolated backend copy. It used `http://127.0.0.1:3210` and `http://127.0.0.1:3211`; a successful `convex dev --once` reported functions ready. The temporary deployment required `SITE_URL`, `BETTER_AUTH_SECRET`, and `ADMIN_EMAILS`.
  - Verify: Immediate pre/post hashes of the source `.convex` tree and `apps/convex-backend/.env.local` matched. The temporary project was removed; no process remained on ports 3210 or 3211.
  - Files: temporary experiment only; no implementation files changed.
  - Dependencies: None.

- [x] **Task 2: Automate E2E backend lifecycle**
  - Acceptance: `bun run test:e2e` provisions an isolated local backend, passes its URLs to Next.js, disables existing web-server reuse, and cleans only its own temp files/processes on every exit path.
  - Verified: `bun run test:e2e` passed the homepage test against fresh local Convex state. A no-tests-matched run returned nonzero and cleaned up. SIGINT via both the direct runner and package script removed the temp project and services. Direct Playwright invocation is blocked unless the isolated-runner marker is present.
  - Verify: After success, failure, and SIGINT runs, no temp project remained and ports 3000, 3210, and 3211 were free. Development `.convex` and backend `.env.local` hashes remained unchanged.
  - Files: `package.json`, `playwright.config.ts`, `scripts/run-e2e.mjs`, and `GETTING_STARTED.md`.
  - Dependencies: Task 1.

- [x] **Task 3: Cover account creation**
  - Acceptance: A clean E2E database can create a unique account through the user-facing signup flow and reach the expected authenticated state without external email delivery.
  - Verified: The signup E2E creates a unique `.test` email account and reaches the protected `/app/onboarding/basics` page; signup succeeds without email verification or external email delivery.
  - Verify: `bun run test:e2e` passed both the signup and homepage specs on a fresh local database. Cleanup left no temp directory or listeners, and development DB/env fingerprints were unchanged. `bun x tsc --noEmit` and `git diff --check` passed.
  - Files: `tests/Signup.spec.ts`.
  - Dependencies: Task 2; confirm signup/verification behavior first.

- [x] **Task 4: Cover request creation**
  - Acceptance: The E2E-created account can create a help request through the user-facing flow and observe it in the expected app view.
  - Verified: The test creates an account, completes onboarding, posts an “Other” request through the preview flow, and finds its unique title under My Requests.
  - Verify: `bun run test:e2e` passed all three specs with three workers. No temp project or service remained, and development DB/env fingerprints were unchanged. Typecheck, focused lint, and `git diff --check` passed.
  - Files: `tests/RequestCreation.spec.ts`.
  - Dependencies: Tasks 2 and 3.

## Final Verification
- [ ] `bun run test:e2e` passes from a clean temporary database.
- [ ] Relevant package tests, typecheck, and lint pass for changed files.
- [ ] Development Convex data and `.env.local` remain untouched.
- [ ] No temporary database directory or child process remains after the run.
