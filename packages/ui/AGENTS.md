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
    types.ts       # Shared type definitions (ScaleColor, Size, etc.)
  variants/        # Shared variant fragments (reusable across components)
  utils/           # Utility functions (cn, etc.)
  button/          # Reference component
  index.ts         # Package barrel export
```

## Key Conventions

1. **Component structure:** Each component has `index.ts`, `name.variants.ts`, `name.component.tsx`
2. **Props pattern:** Components extend RAC props + add `variant`, `size`, `color`
3. **State selectors:** Use RAC `data-hovered`, `data-pressed`, `data-focus-visible`, `data-disabled` (Tailwind v4 shorthand for `data-[attr]`)
4. **Color scale:** 12 steps per color — 1-2 backgrounds, 3-5 interactive, 6-8 borders, 9-10 solid, 11 text, 12 high-contrast text
5. **No accent indirection:** Colors are passed directly, no `--accent-*` CSS variables or ThemeProvider
6. **Focus rings:** Color-matched step 8, 2px width, 2px offset
7. **className merging:** Consumer `className` always wins via tv()'s built-in tailwind-merge
8. **`tw()` for IntelliSense:** Wrap Tailwind class strings in `tw()` when they appear outside of `tv()` or `cn()` calls (e.g., in variant fragment files). It's an identity function that enables Tailwind IntelliSense via `classRegex`. See `.vscode/README.md` for details.

## Color Palette

- **Brand:** terracotta, sage, yellow (custom generated, in `src/theme/colors/`)
- **Semantic:** red, amber (from `@radix-ui/colors`)
- **Neutral:** gray (custom warm-tinted, in `src/theme/colors/`)

## Reference

See [STYLING_API.md](./STYLING_API.md) for the full component authoring contract.

## External References

The [Radix UI Themes](https://github.com/radix-ui/themes) repo is used as a design reference. If cloned locally, place it at `~/refs/themes` — when present, prefer this over fetching from the internet.

This is a **reference, not a source of truth**. Our component behavior and accessibility come from react-aria-components. What we reference from Radix Themes:

- **Color scale semantics** — which of the 12 steps to use for backgrounds, borders, solid fills, text
- **Component variant naming** — e.g., solid/soft/outline/ghost treatments
- **Token scales** — the structure of radius, typography, and spacing ramps
- **Prop conventions** — numeric size scales, color-as-prop pattern

Consult it when adding new components or extending the design token system. For how components are built (props, composition, accessibility), follow react-aria-components and this package's own conventions.
