# @repo/ui — Design System

## Architecture

This is the LoMo design system package. It provides themed, accessible UI components built on:

- **Tailwind CSS v4** — utility-first styling via CSS-first configuration
- **Tailwind Variants (tv)** — variant composition with tailwind-merge built in
- **React Aria Components (RAC)** — accessible primitives from Adobe
- **Custom Radix color palettes** — 12-step scales generated via the Radix color tool

## Directory Structure

```
src/
  theme/
    colors/        # Custom color palette CSS files (Radix format, renamed)
    theme.css      # Main theme: imports, @theme tokens, radius/typography
    types.ts       # Shared type definitions (Colors)
  variants/        # Shared variant fragments (reusable across components)
  utils/           # Utility functions (cn, etc.)
  button/          # Reference component
  index.ts         # Package barrel export
```

## Key Conventions

1. **Component structure:** Each component has `index.ts`, `name.variants.ts`, `name.component.tsx`
2. **Props pattern:** Component props are typed via `VariantProps<typeof xVariants>` intersected with RAC/HTML base props. Do not manually define type aliases for variant props — the `tv()` call is the single source of truth.
3. **State selectors:** Use RAC `data-hovered`, `data-pressed`, `data-focus-visible`, `data-disabled` (Tailwind v4 shorthand for `data-[attr]`)
4. **Color scale:** 12 steps per color — 1-2 backgrounds, 3-5 interactive, 6-8 borders, 9-10 solid, 11 text, 12 high-contrast text
5. **No accent indirection:** Colors are passed directly, no `--accent-*` CSS variables or ThemeProvider
6. **Focus rings:** Color-matched step 8, 2px width, 2px offset
7. **className merging:** Consumer `className` always wins via tv()'s built-in tailwind-merge
8. **`tw()` for IntelliSense:** Wrap Tailwind class strings in `tw()` when they appear outside of `tv()` or `cn()` calls (e.g., in variant fragment files). It's an identity function that enables Tailwind IntelliSense via `classRegex`. See `.vscode/README.md` for details.
9. **No inline styles for layout:** Components must not accept props that apply inline styles for layout (e.g., `columns`, `gridTemplateColumns`). Layout is the consumer's responsibility via `className` and Tailwind utilities. Inline styles are a last resort, reserved for truly dynamic values that cannot be expressed as utility classes.

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

## Adding a Component to the Showcase

The showcase lives at `apps/webapp/src/routes/showcase/` and serves as a
development-only documentation site for the design system. When you add a
new component to `@repo/ui`, add a corresponding showcase page:

1. **Create the component** in `packages/ui/src/<name>/` following the
   existing structure (`index.ts`, `<name>.variants.ts`, `<name>.component.tsx`).

2. **Export from the barrel** — add the component and its props type to
   `packages/ui/src/index.ts`.

3. **Create a showcase route** at `apps/webapp/src/routes/showcase/<name>.tsx`.
   Follow the existing pages as a template. Each page should include:
   - `PageHeader` — component name + one-line description
   - `PropTable` — all public props with type and default value
   - `DemoSection` blocks — one per prop dimension (variant, size, color, etc.),
     each wrapped in a bordered card container

   Import the shared helpers from `./-components`:

   ```tsx
   import { DemoSection, PageHeader, PropTable } from "./-components";
   ```

4. **Add to the sidebar** — in `showcase/route.tsx`, add an entry to the
   appropriate group in the `NAV_GROUPS` array (either "Components" or
   "Typography"). Keep items alphabetically sorted within each group.

5. **Add to the overview grid** — in `showcase/index.tsx`, add a card to
   the `COMPONENT_CARDS` array with a name, description, link, and a small
   visual preview using the component.
