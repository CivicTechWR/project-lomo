# 0006: Integrate Reusable Custom UI Primitives into `@repo/ui`

## Status
Accepted

## Date
2026-09-04

## Context
As `apps/lomoweb` evolved, several presentational UI patterns were created locally within the application (e.g. `SelectionCard`, multi-segment progress bars, and step navigation footers). Having UI components duplicated or isolated inside application routes creates visual inconsistency, duplicates code maintenance, and deviates from `@repo/ui` as the single source of truth for design tokens and component primitives.

## Decision
Extract and integrate general-purpose UI primitives from `apps/lomoweb` into `@repo/ui`:
- **`SelectionCard`**: General-purpose selectable option card component with title, description, icon/leading slot, and active/disabled states.
- **`SegmentedProgress`**: Multi-segment progress indicator supporting step counts, filled states, and variant sizes/color schemes for wizard flows.
- **`StepFooter`**: Multi-step flow navigation footer supporting standard request wizard navigation and onboarding action buttons.

Domain-bound components with API dependencies (such as address search) remain within `apps/lomoweb`. All newly extracted components in `@repo/ui` adhere strictly to `@repo/ui` architecture conventions (`index.ts`, `<name>.component.tsx`, `<name>.variants.ts`, `<name>.test.ts`, subpath exports in `package.json`).

## Alternatives Considered

### Keep Components in Application Directory (`apps/lomoweb`)
- Pros: Simple to iterate on locally without modifying shared package structure.
- Cons: Leads to duplicate implementations (e.g. `RequestProgress` vs `OnboardingProgress`), inconsistent styling, and lacks unit test coverage in the design system.
- Rejected: Extracting shared components keeps design contracts unified and testable across the monorepo.

## Consequences
- `@repo/ui` now exports `./selection-card`, `./progress`, and `./step-footer` subpaths.
- Reduced duplication across wizard and onboarding flows in `apps/lomoweb`.
- Enhanced unit test coverage for progress bars, selection cards, and step footers in `@repo/ui`.
