# @repo/ui Styling API

This document defines the contract for building components in the design system.

## Component File Structure

Each component lives in its own directory under `src/`:

```
src/
  button/
    index.ts              # Barrel export
    button.variants.ts    # tv() definition (prop types inferred via VariantProps)
    button.component.tsx  # React component wrapping RAC primitive
```

## Props Contract

Every interactive component exposes:

| Prop        | Type                       | Default        | Description               |
| ----------- | -------------------------- | -------------- | ------------------------- |
| `variant`   | Component-specific union   | `"solid"`      | Visual style              |
| `size`      | `"1" \| "2" \| "3" \| "4"` | `"2"`          | Size scale                |
| `color`     | `ScaleColor`               | `"terracotta"` | Color from the palette    |
| `className` | `string`                   | —              | Merged via tailwind-merge |

All other props from the underlying React Aria Components primitive are forwarded, including `style`, event handlers, and accessibility props.

## Composing tv() with Shared Fragments

Variant fragments live in `src/variants/`:

- **`interactiveBase`** — shared base classes for all interactive components
- **`interactiveSizes`** — size scale object (`"1"` through `"4"`)
- **`solidColors` / `softColors` / `outlineColors` / `ghostColors`** — color maps keyed by `ScaleColor`
- **`focusRings`** — focus ring styles keyed by `ScaleColor`
- **`typographySizes`** — typography scale (`"1"` through `"9"`)

Use them in your `tv()` call:

```ts
import { tv } from "tailwind-variants";
import { focusRings, interactiveBase, interactiveSizes, solidColors } from "../variants/index.ts";

export const myComponentVariants = tv({
	base: interactiveBase,
	variants: {
		size: interactiveSizes,
		// ...
	},
	compoundVariants: [
		{ variant: "solid", color: "terracotta", class: `${solidColors.terracotta} ${focusRings.terracotta}` },
		// ... repeat for each variant × color combination
	],
});
```

## Props Typing via VariantProps

Variant prop types are inferred from the `tv()` definition using `VariantProps` from tailwind-variants. Do **not** manually define type aliases for variant props — the `tv()` call is the single source of truth.

```tsx
import type { VariantProps } from "tailwind-variants";
import { myComponentVariants } from "./my-component.variants.ts";

// Intersect RAC/HTML base props with VariantProps
export type MyComponentProps = AriaButtonProps & VariantProps<typeof myComponentVariants>;
```

For components with non-variant props (e.g., `elementType`, `level`), add them manually:

```tsx
export type TextProps = Omit<AriaTextProps, "elementType"> & VariantProps<typeof textVariants> & {
	elementType?: TextElementType;
};
```

## React Aria Integration

Components wrap React Aria Components (RAC) primitives. Use `composeRenderProps` for className:

```tsx
import { Button as AriaButton, composeRenderProps } from "react-aria-components";

export function Button({ variant, size, color, className, ...props }: ButtonProps) {
	return (
		<AriaButton
			{...props}
			className={composeRenderProps(className, cls =>
				buttonVariants({ variant, size, color, class: cls }),)}
		/>
	);
}
```

RAC uses `data-*` attributes for states. Our variant fragments target:

- `data-[hovered]` — hover state
- `data-[pressed]` — active/pressed state
- `data-[focus-visible]` — keyboard focus
- `data-[disabled]` — disabled state

## className Override Protocol

Consumer `className` is passed through `tv()`'s `class` option, which uses `tailwind-merge` under the hood. This means consumer classes win over component defaults:

```tsx
<Button className="w-full">Full Width</Button>;
```

## Focus Ring Convention

All interactive components use color-matched focus rings:

- Width: `ring-2`
- Offset: `ring-offset-2`
- Color: step 8 of the component's color scale

## Transition Defaults

All interactive components use `transition-colors duration-150`.

## Adding a New Color Scale

1. Generate the color CSS file using the Radix color tool
2. Rename CSS variables to match the scale name (e.g., `--mycolor-1` through `--mycolor-12`)
3. Place in `src/theme/colors/mycolor.css`
4. Import in `theme.css` and add `--color-mycolor-*` mappings in `@theme`
5. Add the color name to `ScaleColor` union in `src/theme/types.ts`
6. Add entries to each color style map in `src/variants/color-styles.ts`
7. Add compound variants in each component's `.variants.ts` file

## Adding a New Component

1. Create directory: `src/mycomponent/`
2. Create `mycomponent.variants.ts` — import shared fragments, define `tv()` (variant prop types are inferred via `VariantProps`, no manual type aliases needed)
3. Create `my-component.component.tsx` — wrap RAC primitive, forward all RAC props
4. Create `index.ts` — barrel export component and types
5. Add export to `src/index.ts`
6. Add export path to `package.json` exports map
