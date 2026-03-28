# UI Package — TODO

## Migrate outline variant from `border` to `box-shadow`

- **What:** Change `outlineColors` and `outlineColorsHighContrast` in `color-styles.ts` from using CSS `border` to `box-shadow: inset 0 0 0 1px`, matching the approach used by `surfaceColors`.
- **Why:** Radix Themes uses `box-shadow` for all border-like styles (outline, surface). This avoids layout shift from border width, and enables advanced patterns like the double-ring high-contrast outline (`accent-a7` + `gray-a11` layered). Our `surfaceColors` already uses `box-shadow`, so `outlineColors` is inconsistent.
- **How:** Replace `border border-{color}-7` with `shadow-[inset_0_0_0_1px_var(--color-{color}-7)]` in `outlineColors`. For `outlineColorsHighContrast`, implement the Radix double-ring pattern: `shadow-[inset_0_0_0_1px_var(--color-{color}-7),inset_0_0_0_1px_var(--color-gray-11)]`. Then audit the Button `outline` variant to ensure it still renders correctly.
- **When:** After Badge component ships — this is a separate cleanup pass that touches Button too.

---

## Component Roadmap

Components needed to implement the LoMo prototype, derived from the Stitch project "LOMO PROJECT [CLAUDE CODE]." Only generic design system primitives — app-level compositions (Navbar, Sidebar, RequestCard, etc.) live in `apps/webapp/`.

### Tier 2 — Forms (unlocks onboarding + request creation)

- **Checkbox** — Single checkbox with label. Wraps RAC `Checkbox`. Used for consent/terms agreement and preference selection.
- **RadioGroup** — Set of mutually exclusive options. Wraps RAC `RadioGroup` + `Radio`. Supports card-style radio items (icon + title + description) for category/sub-category selection.
- **Switch** — Toggle for binary preferences. Wraps RAC `Switch`. Used in account setup and preference screens.
- **Select** — Dropdown selector with popover listbox. Wraps RAC `Select` + `ListBox` + `Popover`. Used for community selector and form dropdowns.
- **ProgressBar** — Determinate progress indicator. Wraps RAC `ProgressBar`. Used for multi-step form flows (e.g., "Step 2 of 4 — 50% complete").

### Tier 3 — Data display (unlocks feed + dashboard)

- **Avatar** — Circular user photo with fallback initials. Plain `img` + fallback `div` — no RAC primitive needed. Sizes for inline (small) and profile (large) use cases.
- **AvatarGroup** — Overlapping stack of Avatars with optional "+N" overflow indicator. Layout wrapper around Avatar. Used in hero social proof and request cards.
- **Callout** — Informational banner with icon and text. Static display (`div`), no RAC primitive — similar pattern to Badge. Used for helper text, tips, and contextual info in forms.
- **Separator** — Visual and semantic section divider. Wraps RAC `Separator`. Styled with our design tokens. Supports horizontal and vertical orientation.

### Tier 4 — Last

- **Tooltip** — Contextual hover/focus hint. Wraps RAC `Tooltip` + `TooltipTrigger`. Low priority — nothing in current screens is blocked by it.
