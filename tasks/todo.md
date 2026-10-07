# Phone Number Validation Todo

## Phase 1: Foundation

- [x] Add `libphonenumber-js` to the frontend and backend package manifests and the workspace catalog.
- [x] Create a shared frontend utility with parse, format, normalize, and strict-validation functions.
- [x] Create a backend utility with the same strict-validation and normalization rules.
- [x] Write real-library frontend tests for CA/US formatting, normalization, incomplete input, invalid input, and wrong-country input.
- [x] Write real-library backend tests for normalization, strict rejection, allowlist enforcement, and malformed input.
- [x] Run focused frontend and backend tests plus type checks.

## Phase 2: Configuration

- [x] Extend the settings schema and mutation with a validated `phoneNumberAllowedCountries` array, defaulting to `CA` and `US`.
- [x] Add a public settings query for onboarding country codes and labels.
- [x] Add admin settings controls and validation feedback.
- [x] Run frontend and backend tests, type checks, and lint.

## Phase 3: Onboarding

- [ ] Add the country selector and phone field with formatting and checkmark/cross feedback.
- [ ] Disable onboarding Continue for incomplete or invalid input.
- [ ] Enforce strict validation and country allowlisting in the public profile mutation.
- [ ] Submit normalized E.164 values and surface backend errors.
- [ ] Run focused onboarding tests plus package checks.

## Phase 4: Final Verification

- [ ] Run all relevant frontend and backend tests.
- [ ] Run frontend and backend type checks.
- [ ] Run frontend and backend lint.
- [ ] Review the complete diff for accidental changes and dependency lockfile changes.
- [ ] Confirm the user reviewed dependency changes before installation.
