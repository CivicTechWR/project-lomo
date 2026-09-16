# 0002: Build Design System Package `@repo/ui` with Tailwind v4 and React Aria Components

## Status
Accepted

## Date
2026-09-01

## Context
LoMo requires a calm, trustworthy, mobile-first, and highly accessible user interface.
Key design system requirements:
- Full WCAG 2.1 AA accessibility out-of-the-box for screen readers, keyboard navigation, and touch interactions.
- A calm, warm, community-first visual identity (earthy tones, rounded containers, clear focus indicators, visible borders).
- Reusable UI component library shared across monorepo applications (`packages/ui`).

## Decision
Build `@repo/ui` as a shared design system package using Tailwind CSS v4 for styling and React Aria Components (`react-aria-components`) for unstyled, accessible UI primitives. Use Radix Themes as a visual design reference while relying on React Aria for accessibility primitives.

## Alternatives Considered

### Radix Primitives + Tailwind v3
- Pros: Popular React component primitives.
- Cons: React Aria Components offers better focus management, mobile touch handling, and integrated form state primitives.
- Rejected: React Aria Components provides superior cross-device accessibility.

### Pre-styled Component Libraries (MUI, Shadcn UI copies)
- Pros: Fast initial setup.
- Cons: Difficult to customize to match LoMo's calm, non-pressured, warm visual identity without heavy overrides or style leaks.
- Rejected: Custom components built on React Aria primitives provide complete control over accessibility and brand aesthetics.

## Consequences
- Accessible components with built-in ARIA roles, keyboard navigation, and screen reader labels.
- Consistent styling tokens (color, spacing, typography, radius scales) defined in `@repo/ui/src/theme/theme.css`.
- Monorepo apps (`apps/lomoweb`) import components directly from `@repo/ui`.
