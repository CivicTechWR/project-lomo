# @repo/ui — Design System

## Architecture

This is the LoMo design system package. It is the default source of design tokens, shared primitives, and product UI patterns for the app. The current codebase should be the ground truth; if a rule here conflicts with actual usage in `apps/lomoweb`, prefer the app and tests unless the design-system change is deliberate and clearly validated.

The package is built on:

- **Tailwind CSS v4** — utility-first styling via CSS-first configuration
- **Tailwind Variants (tv)** — variant composition with tailwind-merge built in
- **React Aria Components (RAC)** — accessible primitives from Adobe
- **Custom Radix color palettes** — 12-step scales generated via the Radix color tool

## Living Guidance Rule

This file should describe current practice, not the initial design phase of the project. Historical notes should only remain if they still matter to shipping or reviewing the product today.

If a convention is outdated, noisy, or not enforced anywhere, remove it or rewrite it to focus on the actual contract the package follows today.

## Directory Structure

```
src/
  theme/
    colors/        # Custom color palette CSS files (Radix format, renamed)
    theme.css      # Main theme: imports, @theme tokens, radius/typography
    types.ts       # Shared type definitions (Colors)
  variants/        # Shared variant fragments (reusable across components)
  utils/           # Utility functions (cn, etc.)
  icons/           # Font Awesome semantic icon registry and component
  date-picker/     # PlainDate DatePicker wrapping RAC DatePicker + Calendar
  button/          # Reference component
  index.ts         # Package barrel export
```

## Key Conventions

1. **`"use client"` directive:** Any `.component.tsx` file that imports from `react-aria-components` or uses React hooks must have `"use client";` as its first line. Variant files, context definitions (`createContext`), barrel `index.ts` files, and utilities must not have it. This keeps pure components usable as React Server Components.
2. **Component structure:** Prefer a small, consistent pattern: `index.ts`, `name.variants.ts`, and `name.component.tsx` for each component.
3. **Props pattern:** Type component props by intersecting RAC/HTML base props with `VariantProps<typeof xVariants>`. Do not manually define type aliases for variant props when the `tv()` call already defines the contract.
4. **State selectors:** Use RAC state selectors such as `data-hovered`, `data-pressed`, `data-focus-visible`, and `data-disabled` (Tailwind v4 shorthand for `data-[attr]`).
5. **Color scale:** Keep colors in 12-step scales: 1-2 backgrounds, 3-5 interactive, 6-8 borders, 9-10 solid, 11 text, 12 high-contrast text.
6. **No accent indirection:** Pass colors directly; avoid `--accent-*` indirection or a global ThemeProvider unless there is a concrete product need.
7. **Focus rings:** Match the component color step 8, with a 2px width and 2px offset.
8. **className merging:** Consumer `className` should win via `tv()`'s built-in `tailwind-merge` behavior.
9. **`tw()` for IntelliSense:** Wrap Tailwind class strings in `tw()` when they appear outside `tv()` or `cn()` calls (for example, variant fragments). This keeps editor suggestions working without creating a second source of truth.
10. **Layout is consumer-owned:** Keep layout decisions in `className` and Tailwind utilities instead of adding prop-based inline layout styles (`columns`, `gridTemplateColumns`, etc.). Inline styles remain a last resort for values that cannot be expressed in classes.

## Best-Practice Addendum

- Prefer small, reusable primitives over a growing list of one-off wrappers.
- Prefer centralized tokens and variant fragments in `@repo/ui` over app-local class duplication.
- Prefer app tests and actual UI behavior over historical wording in older docs.
- When new work needs a design-system change, validate it in the app or a lightweight local example before expanding the API.

## Radius System

The design system uses a 6-step radius scale with named presets, modeled after Radix UI Themes.

### Tokens

| Token           | Base px | Default (factor=2) | Usage                                                               |
| --------------- | ------- | ------------------ | ------------------------------------------------------------------- |
| `--radius-1`    | 3px     | 6px                | Small interactive elements (size 1 buttons, badges, fields)         |
| `--radius-2`    | 4px     | 8px                | Medium interactive elements (size 2 buttons, badges, fields)        |
| `--radius-3`    | 6px     | 12px               | Large interactive / small containers (size 3 buttons, size 1 cards) |
| `--radius-4`    | 8px     | 16px               | XL interactive / medium containers (size 4 buttons, size 2-3 cards) |
| `--radius-5`    | 12px    | 24px               | Large containers (size 4-5 cards, dialogs)                          |
| `--radius-6`    | 16px    | 32px               | Reserved for extra-large containers                                 |
| `--radius-full` | —       | 0px or 9999px      | Pill shape toggle (controlled by preset)                            |

### Presets

Set via `data-radius` attribute on `:root` (default: `medium`):

| Preset   | `--radius-factor` | `--radius-full` | Effect                           |
| -------- | ----------------- | --------------- | -------------------------------- |
| `none`   | 0                 | 0px             | Square corners                   |
| `small`  | 1.5               | 0px             | Subtle rounding                  |
| `medium` | 2                 | 0px             | Default — proportional rounding  |
| `large`  | 2.5               | 0px             | More pronounced rounding         |
| `full`   | 2.5               | 9999px          | Pill-shaped interactive elements |

### Adding Radius to New Components

Determine the component category and apply the correct pattern:

**Compact interactive elements** (buttons, badges, selects, text fields — anything with a fixed height):

```ts
// Use max() to opt in to pill behavior at the "full" preset
"rounded-[max(var(--radius-2),var(--radius-full))]";
```

**Containers and multi-line elements** (cards, dialogs, popovers):

```ts
// Use plain var() — containers never pill-ify
"rounded-[var(--radius-4)]";
```

**Multi-line field elements** (TextArea inside a shared Group):

The `Group` component is shared between single-line inputs (should pill) and TextArea (should not). Use CSS `has-[textarea]` to strip pill behavior:

```ts
// In fieldGroupSizes — pill for inputs, plain radius for textareas
"rounded-[max(var(--radius-2),var(--radius-full))]";
"has-[textarea]:rounded-[var(--radius-2)]";
```

Extend this pattern for any future multi-line field types that share the Group wrapper.

**Never hardcode a pixel radius** (`rounded-[20px]`), even to match a design
mock exactly — it ignores `--radius-factor` and drifts from every other
surface the moment the preset changes. If a design genuinely needs a pixel
floor alongside a token, compose it: `rounded-[max(var(--radius-3),12px)]`.
`apps/lomoweb`'s `app/__tests__/radius-scale.test.ts` enforces this across
the app; there is currently no equivalent guard inside this package.

**Token selection by component size:**

- Size 1 → `--radius-1` (interactive) or `--radius-3` (container)
- Size 2 → `--radius-2` (interactive) or `--radius-4` (container)
- Size 3 → `--radius-3` (interactive) or `--radius-4` (container)
- Size 4 → `--radius-4` (interactive) or `--radius-5` (container)

## Color Palette

- **Brand:** terracotta, sage, yellow (custom generated, in `src/theme/colors/`)
- **Semantic:** red, amber (from `@radix-ui/colors`)
- **Neutral:** gray (custom warm-tinted, in `src/theme/colors/`)

## Reference

See [STYLING_API.md](./STYLING_API.md) for the full component authoring contract.

## Icons

Icons are Font Awesome 7 glyphs (`@fortawesome/free-solid-svg-icons` +
`@fortawesome/react-fontawesome`), accessed through a semantic registry —
never import `@fortawesome/*` or render an inline `<svg>` outside of
`src/icons/`.

```tsx
import { Icon } from "@repo/ui/icons";

function Example() {
	return (
		<>
			<Icon name="openRequests" className="size-5" />
			{/* labelled = accessible name, not hidden */}
			<Icon name="close" label="Close" />
		</>
	);
}
```

- **`src/icons/icon-registry.ts`** — maps semantic names (`openRequests`,
  `calendar`, `chevronLeft`, …) to Font Awesome glyphs. Add new icons here;
  call sites should never reference an `fa*` import directly. This is what
  lets an icon be re-picked, or the whole package swapped out, in one file.
- **`src/icons/icon.component.tsx`** — sets `config.autoAddCss = false` and
  reproduces Font Awesome's `.svg-inline--fa` layout rules as Tailwind
  classes instead. This avoids importing CSS from `node_modules` across the
  workspace boundary, and — because `autoAddCss` is off — nothing injects a
  `<style>` tag at runtime.
- **`label` vs decorative:** pass `label` only when the icon is the sole
  carrier of meaning (an icon-only button). It renders as `aria-label`, not
  react-fontawesome's `title` prop — as of `react-fontawesome` 3.x, `title`
  renders no `<title>` element, so an icon "titled" that way has no
  accessible name at all. Omit `label` when the icon sits beside visible
  text; it's then `aria-hidden` so the label isn't announced twice.
- **Dependency alignment:** `@fortawesome/fontawesome-svg-core`,
  `@fortawesome/free-solid-svg-icons`, and `@fortawesome/react-fontawesome`
  must stay on compatible majors (currently 7.x core/icons, 3.x react
  wrapper — react-fontawesome 3 supports Font Awesome "~6 || ~7").

## Date Picker

`src/date-picker/` wraps React Aria's `DatePicker` + `Calendar`.

The public API speaks in plain `{ year, month, day }` objects
(`PlainDate`), not `@internationalized/date` values:

```tsx
import { DatePicker } from "@repo/ui/date-picker";

function Example() {
	return (
		<DatePicker value={{ year: 2026, month: 3, day: 1 }} onChange={setDate}>
			<Label>Needed by</Label>
		</DatePicker>
	);
}
```

This is deliberate — apps consuming `@repo/ui` don't need
`@internationalized/date` or `react-aria-components` as their own
dependencies (they're `@repo/ui`-only), and a plain object can't carry a
timezone into a field that only ever means "a calendar day".

**`@internationalized/date` must stay pinned to the exact version
`react-aria-components` resolves** (currently `3.12.0`, from
`react-aria-components`'s `^3.12.0`). A caret range like `^3.12.3` will
install a _second_ copy; the two copies' `CalendarDate` classes have
different private field brands, and TypeScript rejects one as not
assignable to the other's `DateValue`. Check with:

```bash
readlink -f node_modules/@internationalized/date
```

If more than one version shows up under
`node_modules/.bun/@internationalized+date@*`, re-pin and reinstall.

## Component Review Workflow

Validate new components in the app or a lightweight local example before shipping.

1. **Create the component** in `packages/ui/src/<name>/` following the existing structure (`index.ts`, `<name>.variants.ts`, `<name>.component.tsx`).
2. **Export from the barrel** — add the component and its props type to `packages/ui/src/index.ts`.
3. **Review it in context** — use the active app or a temporary example to verify behavior, accessibility, and visual polish.
4. **Document the contract** — for any component with multiple variants or behaviors, describe the intended API, sizing, and accessibility notes in the relevant app or design notes instead of relying on a standalone showcase app.
5. **If the product needs a new pattern, make it reusable** — avoid app-local copies of shared UI logic when the same structure belongs in the design system.
