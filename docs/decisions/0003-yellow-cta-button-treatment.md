# 0003: Yellow CTA Button Treatment for Primary Actions

## Status
Accepted (Supersedes prior internal proposal)

## Date
2026-09-01

## Context
Initial design explorations in Figma specified that primary call-to-action (CTA) buttons in app flows should use a high-visibility yellow fill (`--yellow-9` / `#f3c600`) with a thick dark ink border (`border-4 border-terracotta-9` / `#4a352f`).
During development, some primary actions were converted to solid terracotta. A review was conducted comparing the Figma design specification against the implementation.

## Decision
Standardize on `variant="solid" color="yellow" border="large" borderColor="terracotta"` as the universal primary CTA button treatment for in-app primary actions (such as "New request", auth form submissions, and primary admin actions).

Keep solid terracotta (`variant="solid" color="terracotta"`) for marketing and landing page CTAs (e.g., homepage "Sign Up" hero CTA), preserving the established brand carve-out.

## Alternatives Considered

### Converting All CTAs to Solid Terracotta
- Pros: Reduces color variety on main screens.
- Cons: Deviates from the product owner's explicit Figma specification (Frame 12, Node 351:466) for primary interactive buttons.
- Rejected: The yellow fill with thick dark border is the designed signature CTA style for the app.

## Consequences
- Primary in-app action buttons use the signature yellow fill + thick terracotta border pill style.
- Marketing/navigational CTAs retain their solid terracotta treatment.
- Clear visual hierarchy between primary CTAs and secondary outline actions.
