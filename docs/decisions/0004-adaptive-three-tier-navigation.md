# 0004: Adaptive Three-Tier Responsive Navigation Layout

## Status
Accepted

## Date
2026-09-01

## Context
LoMo must support devices ranging from small mobile screens (320px minimum) to large desktop monitors (`≥1024px`), while maintaining a calm, accessible navigation experience.

## Decision
Adopt Material Design 3's adaptive navigation layout pattern, implementing three responsive navigation tiers sharing a unified visual grammar:
1. **Phone (<768px):** Floating bottom pill navigation bar fixed at the bottom of the viewport.
2. **Tablet (768px - 1023px):** Floating navigation rail fixed on the left margin (`md:flex lg:hidden`).
3. **Laptop/PC (≥1024px):** Navigation sidebar attached directly to the left viewport edge (`lg:flex`).

When in admin routes (`/app/admin/*`), all three responsive tiers render admin navigation controls and provide a prominent, keyboard-accessible "Back to app" exit control to return to `/app`.

## Alternatives Considered

### Standard Fixed Sidebar Across All Screen Sizes
- Pros: Simple single-layout implementation.
- Cons: Unusable or cramped on mobile and tablet touchscreens.
- Rejected: Mobile-first responsive accessibility requires adaptive navigation structures.

## Consequences
- Single navigation component (`AppSidebar`) manages responsive tiers using Tailwind responsive utility classes (`md:hidden`, `md:flex lg:hidden`, `lg:flex`).
- Tablet rail and laptop sidebar share inner navigation content (`RailContent`) to guarantee feature parity.
- Admin exit control ("Back to app") is consistently present across all screen sizes.
