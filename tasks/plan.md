# Implementation Plan: Configurable Phone Number Validation

## Overview

Add configurable, strict phone-number validation and automatic formatting to onboarding, while preserving the optional profile field and enforcing the same rules in Convex.

## Architecture Decisions

- Use `libphonenumber-js` with its `max` metadata set for strict validation in both client and server code.
- Keep the allowed-country list in the existing singleton admin settings document.
- Expose only the public country list to onboarding users; keep the full settings document admin-only.
- Normalize valid numbers to E.164 before saving.
- Use a country selector because `+1` numbers can belong to Canada or the United States.
- Show a checkmark for complete valid input and a cross for incomplete or invalid input; blank input remains unmarked.

## Task List

### Phase 1: Foundation

- [x] Task 1: Add the frontend dependency and shared phone-number utility.
  - Acceptance: The frontend can parse, format, normalize, and validate real phone numbers with the selected country; empty input is handled explicitly.
  - Verification: Run the focused frontend unit test and `typecheck`.
  - Dependencies: None.
  - Files likely touched: `apps/lomoweb/package.json`, `apps/lomoweb/lib/phone-number.ts`, `apps/lomoweb/lib/__tests__/phone-number.test.ts`.
  - Estimated scope: Small.
  - Status: Implementation complete; runtime verification blocked because `libphonenumber-js` is not installed.

- [x] Task 2: Add backend phone-number validation utility and tests.
  - Acceptance: The Convex backend can normalize a valid number, reject incomplete or invalid values, and enforce the selected country against the configured allowlist.
  - Verification: Run the focused backend test and `typecheck`.
  - Dependencies: Task 1.
  - Files likely touched: `apps/convex-backend/package.json`, `apps/convex-backend/convex/lib/phoneNumber.ts`, `apps/convex-backend/convex/lib/phoneNumber.test.ts`.
  - Estimated scope: Small.
  - Status: Implementation complete; runtime verification blocked because `libphonenumber-js` is not installed.

### Checkpoint: Foundation

- [ ] Real-library tests pass for both frontend and backend.
- [ ] Type checking passes for both packages.
- [ ] Dependency changes are reviewed before installation.

### Phase 2: Configuration

- [ ] Task 3: Extend admin settings with configurable country codes.
  - Acceptance: The existing settings document defaults to `CA` and `US`, validates the list, rejects duplicates and unsupported codes, and preserves existing settings when the field is omitted.
  - Verification: Run backend tests and typecheck.
  - Dependencies: Task 2.
  - Files likely touched: `apps/convex-backend/convex/schema.ts`, `apps/convex-backend/convex/admin/settings.ts`, `apps/convex-backend/convex/lib/seedData.ts`, `apps/convex-backend/convex/lib/phoneNumber.ts`.
  - Estimated scope: Small.

- [ ] Task 4: Add the public onboarding country configuration query.
  - Acceptance: Onboarding can retrieve the configured country codes and labels without requiring admin access.
  - Verification: Run backend tests and typecheck.
  - Dependencies: Task 3.
  - Files likely touched: `apps/convex-backend/convex/admin/settings.ts`, `apps/convex-backend/convex/adminSettings.ts`, `apps/lomoweb/lib/hooks/use-admin.ts`.
  - Estimated scope: Small.

- [ ] Task 5: Add admin settings controls for country selection.
  - Acceptance: An administrator can replace the default allowlist with supported country codes and receives validation feedback.
  - Verification: Run frontend test, typecheck, and lint.
  - Dependencies: Task 4.
  - Files likely touched: `apps/lomoweb/app/app/admin/settings/page.tsx`, `apps/lomoweb/app/app/admin/__tests__/phone-number-settings.test.tsx`.
  - Estimated scope: Medium.

### Checkpoint: Configuration

- [ ] Admin can configure CA and US by default.
- [ ] Public onboarding settings return the same allowlist.
- [ ] Invalid country lists are rejected.
- [ ] Frontend and backend type checks pass.

### Phase 3: Onboarding

- [ ] Task 6: Add the country selector and phone input behavior.
  - Acceptance: The onboarding field selects a configured country, formats while typing, shows checkmark/cross feedback, and disables Continue for incomplete or invalid input.
  - Verification: Run focused component tests, frontend typecheck, and lint.
  - Dependencies: Task 4.
  - Files likely touched: `apps/lomoweb/app/app/onboarding/contact-step.tsx`, `apps/lomoweb/app/app/onboarding/__tests__/contact-step.test.tsx`.
  - Estimated scope: Medium.

- [ ] Task 7: Enforce validation in the profile mutation.
  - Acceptance: The backend rejects invalid, unconfigured, or mismatched country numbers before updating the user profile.
  - Verification: Run focused backend tests, backend typecheck, and lint.
  - Dependencies: Task 2 and Task 3.
  - Files likely touched: `apps/convex-backend/convex/users/mutations.ts`, `apps/convex-backend/convex/users/mutations.test.ts`.
  - Estimated scope: Small.

- [ ] Task 8: Connect the onboarding form to the public configuration and profile mutation.
  - Acceptance: The form loads the allowlist, submits normalized E.164, and handles server validation errors without changing the existing optional behavior.
  - Verification: Run focused component tests, frontend typecheck, lint, and backend typecheck.
  - Dependencies: Task 4, Task 6, and Task 7.
  - Files likely touched: `apps/lomoweb/app/app/onboarding/contact-step.tsx`, `apps/lomoweb/lib/hooks/use-admin.ts`.
  - Estimated scope: Small.

### Checkpoint: Core Feature

- [ ] Valid Canadian and US numbers can be saved.
- [ ] Invalid, incomplete, and unconfigured numbers cannot be saved.
- [ ] Stored phone values are normalized to E.164.
- [ ] The UI provides checkmark, cross, and text feedback.
- [ ] Backend and frontend tests pass.

### Phase 4: Verification

- [ ] Task 9: Run the complete package verification suite.
  - Acceptance: All frontend and backend tests, type checks, and lint checks pass without regressions.
  - Verification: Run the commands listed in the specification.
  - Dependencies: Task 8.
  - Files likely touched: None.
  - Estimated scope: Small.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| `libphonenumber-js` is not available in the backend runtime | Backend validation cannot run | Add the package to the frontend and backend manifests, then verify package resolution before implementation |
| Maximum metadata increases bundle size | Onboarding page may load more code | Use the package's documented metadata selection and measure the production bundle |
| Country code ambiguity | Users may enter a number that is valid but belongs to the wrong country | Require an explicit country selector and validate parsed country against it |
| Config changes are not reflected immediately | Onboarding may show stale countries | Use Convex reactive queries so the selected list updates on the next read |
| Browser validation can be bypassed | Invalid data can still be stored | Revalidate in the profile mutation |

## Open Questions

- Should the country selector display only names or also codes?
- Should the admin allow any supported country, or only CA and US initially?
- Should the phone input preserve the user’s selected country when the onboarding profile reloads?
- Should the settings page expose a compact country-code list or a searchable country picker?
