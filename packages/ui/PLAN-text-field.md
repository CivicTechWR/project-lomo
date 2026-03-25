# TextField Implementation Plan

> Delete this file after implementation is complete.

## Overview

Implement a **composed text field system** for `@repo/ui`. Rather than a single monolithic TextField component, this is a set of 8 composable primitives that wrap React Aria Components (RAC) and follow the existing design system conventions.

The end-user API looks like:

```tsx
<TextField variant="surface" size={2} color="sage">
	<Label>Email address</Label>
	<Description>We'll never share your email</Description>
	<Group>
		<InputSlot side="start"><MailIcon /></InputSlot>
		<Input placeholder="you@example.com" />
	</Group>
	<FieldError />
</TextField>;
```

---

## Decision Log

| #   | Decision                | Answer                                                                                     |
| --- | ----------------------- | ------------------------------------------------------------------------------------------ |
| 1   | Decomposition           | Full composition — each part is an independent styled component                            |
| 2   | Components              | 8 total: TextField, Label, Description, Group, InputSlot, Input, TextArea, FieldError      |
| 3   | Group wraps RAC `Group` | Yes — it exposes `data-focus-within`, `data-hovered`, `data-invalid`, `data-disabled`      |
| 4   | InputSlot               | Included from day one for forward-compatible interface                                     |
| 5   | Group variants          | `surface` (default), `classic`, `soft`                                                     |
| 6   | Size scale              | New `fieldSizes` fragment, 1–3, matching button heights (h-8, h-10, h-12)                  |
| 7   | Color semantics         | Surface/classic: neutral borders, accent on focus ring. Soft: accent-tinted bg             |
| 8   | Prop location           | TextField owns `variant`/`size`/`color`, propagates via React context                      |
| 9   | Label                   | Always `text-gray-12 font-medium`, text size scales with field size. No color/weight props |
| 10  | FieldError              | Scales with size, always `text-red-11`, renders `<ul>` if multiple errors                  |
| 11  | InputSlot               | `side="start"\|"end"`, auto-sizes icons from context, className override wins              |
| 12  | TextField styling       | Thin — flex container, gap scales with size, `orientation` prop                            |
| 13  | TextArea                | Ships together, goes inside Group, `resize` prop                                           |
| 14  | Description             | Thin wrapper around existing `Text` with `slot="description"` pre-set                      |
| 15  | Focus ring              | On Group via `data-focus-within`, new `fieldFocusRings` fragment                           |
| 16  | Context                 | Single `FieldContext` with `useFieldContext()` hook (React 19 `use()`)                     |
| 17  | File structure          | `field/` for shared parts, `text-field/` for TextField-specific parts                      |
| 18  | Variant fragments       | New `field-styles.ts` in `variants/`                                                       |
| 19  | Invalid state           | Red overrides accent across all variants — higher specificity via `data-invalid:` prefix   |
| 20  | Disabled state          | `opacity-50 cursor-not-allowed` (same pattern as `interactiveBase`)                        |
| 21  | TextArea inside Group   | Yes — consistent composition, Group always owns visual treatment                           |

---

## File Structure

```
packages/ui/src/
  variants/
    field-styles.ts            # NEW — field-specific variant fragments
    index.ts                   # UPDATED — re-export field-styles

  field/                       # NEW — shared field primitives
    field.context.ts           # FieldContext + useFieldContext hook
    label.component.tsx
    description.component.tsx
    field-error.component.tsx
    input-slot.component.tsx
    group.variants.ts          # tv() — variant/size/color dimensions
    group.component.tsx
    index.ts                   # barrel export

  text-field/                  # NEW — TextField + Input + TextArea
    text-field.variants.ts     # tv() — orientation/size dimensions
    text-field.component.tsx
    input.component.tsx
    text-area.variants.ts      # tv() — resize dimension
    text-area.component.tsx
    index.ts                   # barrel export

  index.ts                     # UPDATED — add new exports
```

Only Group, TextField, and TextArea get `.variants.ts` files because they have actual variant dimensions to compose via `tv()`. Label, Description, FieldError, InputSlot, and Input are simple enough to style inline using shared fragments from `field-styles.ts`.

---

## Implementation Order

### Phase 1: Variant Fragments

**File: `src/variants/field-styles.ts`**

All field-specific size scales, color maps, and focus rings. Every downstream component imports from here.

```ts
import type { Colors } from "../theme/types.ts";
import { tw } from "../utils/tw.ts";

type ColorMap = Record<Colors, string>;

// ── Field Group sizes (applied to Group component) ──
// Heights match interactiveSizes (h-8, h-10, h-12) for inline alignment with Button

export const fieldGroupSizes = {
	1: tw(
		"min-h-8 px-2 py-1.5 gap-1.5",
		"text-[length:var(--text-1)]",
		"leading-[var(--text-1--line-height)]",
		"rounded-[var(--radius-1)]",
	),
	2: tw(
		"min-h-10 px-3 py-2 gap-2",
		"text-[length:var(--text-2)]",
		"leading-[var(--text-2--line-height)]",
		"rounded-[var(--radius-2)]",
	),
	3: tw(
		"min-h-12 px-3.5 py-2.5 gap-2.5",
		"text-[length:var(--text-3)]",
		"leading-[var(--text-3--line-height)]",
		"rounded-[var(--radius-3)]",
	),
} as const;

// ── TextField wrapper gaps (between Label, Group, FieldError) ──

export const fieldGaps = {
	1: tw("gap-1"),
	2: tw("gap-1.5"),
	3: tw("gap-2"),
} as const;

// ── Label text sizes (keyed by field size) ──

export const fieldLabelSizes = {
	1: tw(
		"text-[length:var(--text-1)]",
		"leading-[var(--text-1--line-height)]",
	),
	2: tw(
		"text-[length:var(--text-2)]",
		"leading-[var(--text-2--line-height)]",
	),
	3: tw(
		"text-[length:var(--text-3)]",
		"leading-[var(--text-3--line-height)]",
	),
} as const;

// ── Description + FieldError text sizes (smaller than label) ──

export const fieldSmallSizes = {
	1: tw(
		"text-[length:var(--text-1)]",
		"leading-[var(--text-1--line-height)]",
	),
	2: tw(
		"text-[length:var(--text-1)]",
		"leading-[var(--text-1--line-height)]",
	),
	3: tw(
		"text-[length:var(--text-2)]",
		"leading-[var(--text-2--line-height)]",
	),
} as const;

// ── InputSlot icon auto-sizing ──

export const fieldSlotSizes = {
	1: tw("[&>svg]:size-3.5"),
	2: tw("[&>svg]:size-4"),
	3: tw("[&>svg]:size-4.5"),
} as const;

// ── Field focus rings (triggered on data-focus-within, not data-focus-visible) ──
// No ring-offset — ring hugs the container

export const fieldFocusRings: ColorMap = {
	terracotta: tw(
		"data-focus-within:ring-2",
		"data-focus-within:ring-terracotta-8",
	),
	sage: tw(
		"data-focus-within:ring-2",
		"data-focus-within:ring-sage-8",
	),
	yellow: tw(
		"data-focus-within:ring-2",
		"data-focus-within:ring-yellow-8",
	),
	gray: tw(
		"data-focus-within:ring-2",
		"data-focus-within:ring-gray-8",
	),
	red: tw(
		"data-focus-within:ring-2",
		"data-focus-within:ring-red-8",
	),
	amber: tw(
		"data-focus-within:ring-2",
		"data-focus-within:ring-amber-8",
	),
};

// ── Field soft colors (accent-tinted background for Group soft variant) ──
// Text stays gray-12 (user content), unlike button softColors which use accent-11

export const fieldSoftColors: ColorMap = {
	terracotta: tw(
		"bg-terracotta-3 text-gray-12",
		"data-hovered:bg-terracotta-4",
	),
	sage: tw(
		"bg-sage-3 text-gray-12",
		"data-hovered:bg-sage-4",
	),
	yellow: tw(
		"bg-yellow-3 text-gray-12",
		"data-hovered:bg-yellow-4",
	),
	gray: tw(
		"bg-gray-3 text-gray-12",
		"data-hovered:bg-gray-4",
	),
	red: tw(
		"bg-red-3 text-gray-12",
		"data-hovered:bg-red-4",
	),
	amber: tw(
		"bg-amber-3 text-gray-12",
		"data-hovered:bg-amber-4",
	),
};
```

**Key differences from existing button/badge color fragments:**

- `fieldFocusRings` triggers on `data-focus-within` (not `data-focus-visible`) — inputs show focus ring on click, not just keyboard
- `fieldFocusRings` has no `ring-offset` — ring hugs the container edge
- `fieldSoftColors` uses `text-gray-12` for user content (not accent step 11 like button's `softColors`)
- No `data-pressed` states — fields aren't pressed, they're focused

**Update: `src/variants/index.ts`** — add re-exports:

```ts
// ... existing exports ...
export {
	fieldFocusRings,
	fieldGaps,
	fieldGroupSizes,
	fieldLabelSizes,
	fieldSlotSizes,
	fieldSmallSizes,
	fieldSoftColors,
} from "./field-styles.ts";
```

---

### Phase 2: Field Context

**File: `src/field/field.context.ts`**

Uses React 19's `use()` API (same as OmniSpot's pattern). Provides sensible defaults so components can be used standalone outside a TextField wrapper (they won't break, just use defaults).

```ts
import type { Colors } from "../theme/types.ts";
import { createContext, use } from "react";

export type FieldVariant = "surface" | "classic" | "soft";
export type FieldSize = 1 | 2 | 3;
export type FieldColor = Colors;

export interface FieldContextValue {
	variant: FieldVariant;
	size: FieldSize;
	color: FieldColor;
}

export const FieldContext = createContext<FieldContextValue>({
	variant: "surface",
	size: 2,
	color: "gray",
});

export function useFieldContext(): FieldContextValue {
	return use(FieldContext);
}
```

---

### Phase 3: Shared Field Components (`field/`)

#### 3a. Label

Wraps RAC `Label`. Always `font-medium text-gray-12`. Text size comes from field context.

```tsx
// src/field/label.component.tsx
import type { LabelProps as AriaLabelProps } from "react-aria-components";
import { Label as AriaLabel } from "react-aria-components";
import { cn } from "../utils/cn.ts";
import { fieldLabelSizes } from "../variants/index.ts";
import { useFieldContext } from "./field.context.ts";

export interface LabelProps extends AriaLabelProps {}

export function Label({ className, ...props }: LabelProps) {
	const { size } = useFieldContext();
	return (
		<AriaLabel
			{...props}
			className={cn(
				"font-medium text-gray-12",
				fieldLabelSizes[size],
				className,
			)}
		/>
	);
}
```

No `.variants.ts` needed — single dimension (size) from context, no variant composition.

#### 3b. Description

Thin wrapper around existing `Text` component with `slot="description"` pre-set. Makes the RAC slot pattern discoverable for team members unfamiliar with it.

```tsx
// src/field/description.component.tsx
import type { TextProps as AriaTextProps } from "react-aria-components";
import { Text as AriaText } from "react-aria-components";
import { cn } from "../utils/cn.ts";
import { fieldSmallSizes } from "../variants/index.ts";
import { useFieldContext } from "./field.context.ts";

export interface DescriptionProps extends Omit<AriaTextProps, "slot"> {}

export function Description({ className, ...props }: DescriptionProps) {
	const { size } = useFieldContext();
	return (
		<AriaText
			{...props}
			slot="description"
			className={cn(
				"text-gray-10",
				fieldSmallSizes[size],
				className,
			)}
		/>
	);
}
```

Note: Omits `slot` from props so consumers can't accidentally override it. The whole point of this component is to pre-set the slot.

#### 3c. FieldError

Wraps RAC `FieldError`. Always `text-red-11`. Renders `<ul>` if multiple validation errors exist.

RAC's `FieldError` uses render props to provide `{ isInvalid, validationErrors, validationDetails }`. It conditionally renders only when validation is invalid.

```tsx
// src/field/field-error.component.tsx
import type { FieldErrorProps as AriaFieldErrorProps } from "react-aria-components";
import { FieldError as AriaFieldError } from "react-aria-components";
import { cn } from "../utils/cn.ts";
import { fieldSmallSizes } from "../variants/index.ts";
import { useFieldContext } from "./field.context.ts";

export interface FieldErrorProps extends AriaFieldErrorProps {}

export function FieldError({ className, children, ...props }: FieldErrorProps) {
	const { size } = useFieldContext();
	return (
		<AriaFieldError
			{...props}
			className={cn(
				"text-red-11",
				fieldSmallSizes[size],
				className,
			)}
		>
			{({ validationErrors }) => {
				// If consumer provided explicit children, render those
				if (children)
					return children;
				// Single error: render as text
				if (validationErrors.length <= 1) {
					return validationErrors[0] ?? null;
				}
				// Multiple errors: render as list
				return (
					<ul className="flex flex-col gap-0.5">
						{validationErrors.map(error => (
							<li key={error}>{error}</li>
						))}
					</ul>
				);
			}}
		</AriaFieldError>
	);
}
```

#### 3d. InputSlot

Container for prefix/suffix content inside Group. Auto-sizes SVG icons based on field size. `side` prop controls order (flexbox).

```tsx
// src/field/input-slot.component.tsx
import { cn } from "../utils/cn.ts";
import { fieldSlotSizes } from "../variants/index.ts";
import { useFieldContext } from "./field.context.ts";

export interface InputSlotProps extends React.ComponentPropsWithoutRef<"div"> {
	side?: "start" | "end";
}

export function InputSlot({
	side = "start",
	className,
	...props
}: InputSlotProps) {
	const { size } = useFieldContext();
	return (
		<div
			{...props}
			data-side={side}
			className={cn(
				"flex shrink-0 items-center text-gray-10",
				fieldSlotSizes[size],
				side === "end" && "order-last",
				className,
			)}
		/>
	);
}
```

Notes:

- Plain `<div>`, not a RAC component — there's no RAC Slot primitive
- `text-gray-10` for muted icon color (step 10 = secondary text)
- `shrink-0` prevents icons from compressing when input text is long
- `order-last` on `side="end"` positions it after Input in flex layout
- Icon sizing via `[&>svg]:size-*` means consumer's `className` can override via tailwind-merge: `className="[&>svg]:size-6"`

#### 3e. Group

The visual container. This is the most complex component — owns border, background, focus ring, hover, invalid, and disabled states. Wraps RAC `Group`.

**File: `src/field/group.variants.ts`**

```ts
import type { Colors } from "../theme/types.ts";
import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";
import {
	fieldFocusRings,
	fieldGroupSizes,
	fieldSoftColors,
} from "../variants/index.ts";

export const groupVariants = tv({
	base: tw(
		"inline-flex items-center w-full",
		"outline-none cursor-text",
		"transition-colors duration-150",
		// Disabled
		"data-disabled:opacity-50 data-disabled:cursor-not-allowed",
		// Invalid: override focus ring to red (higher specificity wins)
		"data-invalid:data-focus-within:ring-red-8",
	),
	variants: {
		variant: {
			surface: tw(
				"bg-gray-2 text-gray-12",
				"shadow-[inset_0_0_0_1px_var(--color-gray-6)]",
				"data-hovered:shadow-[inset_0_0_0_1px_var(--color-gray-7)]",
				// Invalid border
				"data-invalid:shadow-[inset_0_0_0_1px_var(--color-red-7)]",
				"data-invalid:data-hovered:shadow-[inset_0_0_0_1px_var(--color-red-8)]",
			),
			classic: tw(
				"bg-gray-2 text-gray-12",
				"shadow-sm",
				// Invalid border
				"data-invalid:shadow-[inset_0_0_0_1px_var(--color-red-7)]",
				"data-invalid:data-hovered:shadow-[inset_0_0_0_1px_var(--color-red-8)]",
			),
			soft: "",
			// Soft base styling is empty — handled in compoundVariants
			// because soft needs accent-specific backgrounds
		},
		size: fieldGroupSizes,
		color: {
			terracotta: fieldFocusRings.terracotta,
			sage: fieldFocusRings.sage,
			yellow: fieldFocusRings.yellow,
			gray: fieldFocusRings.gray,
			red: fieldFocusRings.red,
			amber: fieldFocusRings.amber,
		},
	},
	compoundVariants: [
		// Soft × color — accent-tinted backgrounds
		{ variant: "soft", color: "terracotta", class: fieldSoftColors.terracotta },
		{ variant: "soft", color: "sage", class: fieldSoftColors.sage },
		{ variant: "soft", color: "yellow", class: fieldSoftColors.yellow },
		{ variant: "soft", color: "gray", class: fieldSoftColors.gray },
		{ variant: "soft", color: "red", class: fieldSoftColors.red },
		{ variant: "soft", color: "amber", class: fieldSoftColors.amber },
		// Soft × invalid — override accent bg with red
		{ variant: "soft", class: tw(
			"data-invalid:bg-red-3",
			"data-invalid:data-hovered:bg-red-4",
		) },
	],
	defaultVariants: {
		variant: "surface",
		size: 2,
		color: "gray",
	},
});

export type GroupVariant = "surface" | "classic" | "soft";
export type GroupColor = Colors;
export type GroupSize = 1 | 2 | 3;
```

**File: `src/field/group.component.tsx`**

```tsx
import type { GroupProps as AriaGroupProps } from "react-aria-components";
import { Group as AriaGroup, composeRenderProps } from "react-aria-components";
import { useFieldContext } from "./field.context.ts";
import { groupVariants } from "./group.variants.ts";

export interface GroupProps extends AriaGroupProps {}

export function Group({ className, ...props }: GroupProps) {
	const { variant, size, color } = useFieldContext();
	return (
		<AriaGroup
			{...props}
			className={composeRenderProps(className, cls =>
				groupVariants({ variant, size, color, class: cls }),)}
		/>
	);
}
```

Notes:

- Group does NOT accept its own variant/size/color props — it reads them from FieldContext
- Uses `composeRenderProps` (not `cn`) because RAC Group supports render-prop className
- RAC's `GroupContext` is provided by TextField automatically — Group picks up `isInvalid`, `isDisabled` for data attributes
- `cursor-text` on Group makes the whole container area feel like a clickable input
- `min-h-*` instead of `h-*` allows Group to grow when containing TextArea

**Interaction between ring and shadow:** In Tailwind v4, `ring-*` and `shadow-*` use separate CSS variables (`--tw-ring-shadow` and `--tw-shadow`) that compose into the final `box-shadow`. So the inset shadow border and the focus ring coexist without conflict.

**Invalid state specificity:** `data-invalid:data-focus-within:ring-red-8` has higher specificity than `data-focus-within:ring-{color}-8`, so red wins when invalid + focused.

#### 3f. Field barrel export

**File: `src/field/index.ts`**

```ts
export { Description } from "./description.component.tsx";
export type { DescriptionProps } from "./description.component.tsx";

export { FieldError } from "./field-error.component.tsx";
export type { FieldErrorProps } from "./field-error.component.tsx";

export { FieldContext, useFieldContext } from "./field.context.ts";
export type { FieldColor, FieldContextValue, FieldSize, FieldVariant } from "./field.context.ts";

export { Group } from "./group.component.tsx";
export type { GroupProps } from "./group.component.tsx";

export { InputSlot } from "./input-slot.component.tsx";
export type { InputSlotProps } from "./input-slot.component.tsx";

export { Label } from "./label.component.tsx";
export type { LabelProps } from "./label.component.tsx";
```

---

### Phase 4: TextField-Specific Components (`text-field/`)

#### 4a. Input

Thin styled wrapper around RAC `Input`. Transparent background, inherits font-size from Group.

```tsx
// src/text-field/input.component.tsx
import type { InputProps as AriaInputProps } from "react-aria-components";
import { Input as AriaInput } from "react-aria-components";
import { cn } from "../utils/cn.ts";

export interface InputProps extends AriaInputProps {}

export function Input({ className, ...props }: InputProps) {
	return (
		<AriaInput
			{...props}
			className={cn(
				"flex-1 min-w-0 bg-transparent outline-none",
				"placeholder:text-gray-10",
				"text-[inherit] leading-[inherit]",
				"disabled:cursor-not-allowed",
				className,
			)}
		/>
	);
}
```

Notes:

- `flex-1 min-w-0` — fills remaining space in Group, allows truncation
- `bg-transparent outline-none` — all visual treatment is on Group
- `text-[inherit] leading-[inherit]` — inherits font-size and line-height from Group
- `placeholder:text-gray-10` — consistent placeholder color
- Does NOT read from FieldContext — no need, everything is inherited via CSS

#### 4b. TextArea

**File: `src/text-field/text-area.variants.ts`**

```ts
import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";

export const textAreaVariants = tv({
	base: tw(
		"flex-1 min-w-0 bg-transparent outline-none",
		"placeholder:text-gray-10",
		"text-[inherit] leading-[inherit]",
		"disabled:cursor-not-allowed",
	),
	variants: {
		resize: {
			none: "resize-none",
			vertical: "resize-y",
			horizontal: "resize-x",
			both: "resize",
		},
	},
	defaultVariants: {
		resize: "vertical",
	},
});

export type TextAreaResize = "none" | "vertical" | "horizontal" | "both";
```

**File: `src/text-field/text-area.component.tsx`**

```tsx
import type { TextAreaProps as AriaTextAreaProps } from "react-aria-components";
import type { TextAreaResize } from "./text-area.variants.ts";
import { TextArea as AriaTextArea } from "react-aria-components";
import { textAreaVariants } from "./text-area.variants.ts";

export interface TextAreaProps extends AriaTextAreaProps {
	resize?: TextAreaResize;
}

export function TextArea({ resize, className, ...props }: TextAreaProps) {
	return (
		<AriaTextArea
			{...props}
			className={textAreaVariants({ resize, class: className })}
		/>
	);
}
```

Notes:

- Same base styling as Input (transparent, inherits from Group)
- `resize` prop maps to CSS resize utilities
- Group's `min-h-*` ensures a reasonable minimum height; TextArea + resize lets it grow
- `rows` prop passes through to the native `<textarea>` via RAC

#### 4c. TextField

**File: `src/text-field/text-field.variants.ts`**

```ts
import { tv } from "tailwind-variants";
import { fieldGaps } from "../variants/index.ts";

export const textFieldVariants = tv({
	base: "flex w-full",
	variants: {
		orientation: {
			vertical: "flex-col",
			horizontal: "flex-row items-center",
		},
		size: fieldGaps,
	},
	defaultVariants: {
		orientation: "vertical",
		size: 2,
	},
});

export type TextFieldOrientation = "vertical" | "horizontal";
```

**File: `src/text-field/text-field.component.tsx`**

```tsx
import type { TextFieldProps as AriaTextFieldProps } from "react-aria-components";
import type { FieldColor, FieldSize, FieldVariant } from "../field/index.ts";
import type { TextFieldOrientation } from "./text-field.variants.ts";
import { TextField as AriaTextField } from "react-aria-components";
import { FieldContext } from "../field/index.ts";
import { textFieldVariants } from "./text-field.variants.ts";

export interface TextFieldProps extends AriaTextFieldProps {
	variant?: FieldVariant;
	size?: FieldSize;
	color?: FieldColor;
	orientation?: TextFieldOrientation;
}

export function TextField({
	variant = "surface",
	size = 2,
	color = "gray",
	orientation = "vertical",
	className,
	...props
}: TextFieldProps) {
	return (
		<FieldContext value={{ variant, size, color }}>
			<AriaTextField
				{...props}
				className={textFieldVariants({
					orientation,
					size,
					class: className,
				})}
			/>
		</FieldContext>
	);
}
```

Notes:

- `FieldContext` wraps `AriaTextField` — context is available to all children
- React 19 syntax: `<FieldContext value={...}>` (no `.Provider`)
- `AriaTextField` provides RAC contexts internally: `LabelContext`, `InputContext`, `TextAreaContext`, `GroupContext`, `TextContext`, `FieldErrorContext`
- The `textFieldVariants` only handles layout (flex direction, gap) — no visual treatment
- RAC auto-detects whether children include `Input` or `TextArea` and provides the right context

#### 4d. TextField barrel export

**File: `src/text-field/index.ts`**

```ts
export { Input } from "./input.component.tsx";
export type { InputProps } from "./input.component.tsx";

export { TextArea } from "./text-area.component.tsx";
export type { TextAreaProps } from "./text-area.component.tsx";

export { TextField } from "./text-field.component.tsx";
export type { TextFieldProps } from "./text-field.component.tsx";
```

---

### Phase 5: Package Barrel Export

**Update: `src/index.ts`**

```ts
// ... existing exports ...

export { Description, FieldError, Group, InputSlot, Label } from "./field/index.ts";
export type { DescriptionProps, FieldErrorProps, GroupProps, InputSlotProps, LabelProps } from "./field/index.ts";

export { Input, TextArea, TextField } from "./text-field/index.ts";
export type { InputProps, TextAreaProps, TextFieldProps } from "./text-field/index.ts";
```

Also export the context hook for advanced use cases (e.g., app-level FormField wrapper):

```ts
export { useFieldContext } from "./field/index.ts";
export type { FieldColor, FieldContextValue, FieldSize, FieldVariant } from "./field/index.ts";
```

---

### Phase 6: Showcase Page

**File: `apps/webapp/src/routes/showcase/text-field.tsx`**

This page is more documentation-heavy than existing showcase pages because it introduces the **composition pattern** — a new concept for the design system.

**Structure:**

1. **PageHeader** — "TextField" + one-line description
2. **Composition Guide** — explains the composition model with a diagram showing what each component does
3. **PropTable** — TextField props (variant, size, color, orientation + RAC props)
4. **Component Reference** — one subsection per composed part (Label, Description, Group, InputSlot, Input, TextArea, FieldError) explaining role and props
5. **DemoSections:**
   - Variants (surface, classic, soft side by side)
   - Sizes (1, 2, 3)
   - Colors (all 6 colors in soft variant to show accent tinting)
   - With InputSlot (prefix icon, suffix icon, both)
   - TextArea (basic, with resize options)
   - Invalid state (with FieldError showing)
   - Disabled state
   - Horizontal orientation
   - With Description helper text
   - Full kitchen sink (all features combined)

**Sidebar update in `showcase/route.tsx`:**

Add to NAV_GROUPS → "Components" group (alphabetically sorted):

```ts
{ name: "TextField", to: "/showcase/text-field" },
```

**Overview card in `showcase/index.tsx`:**

```ts
{
	name: "TextField",
	description: "Composable text input with label, description, and validation.",
	to: "/showcase/text-field",
	preview: (
		<div className="flex flex-col gap-2 w-full max-w-xs">
			<TextField size={1} color="sage">
				<Label>Email</Label>
				<Group>
					<Input placeholder="you@example.com" />
				</Group>
			</TextField>
		</div>
	),
},
```

---

## Usage Examples for the Showcase

These are the compositions to demo on the showcase page:

### Basic Input

```tsx
<TextField>
	<Label>Name</Label>
	<Group>
		<Input placeholder="John Doe" />
	</Group>
</TextField>;
```

### With Description and Validation

```tsx
<TextField isRequired>
	<Label>Email</Label>
	<Description>We'll never share your email</Description>
	<Group>
		<Input type="email" placeholder="you@example.com" />
	</Group>
	<FieldError />
</TextField>;
```

### With Prefix/Suffix Icons

```tsx
<TextField color="sage">
	<Label>Search</Label>
	<Group>
		<InputSlot side="start"><MagnifyingGlassIcon /></InputSlot>
		<Input placeholder="Search requests..." />
		<InputSlot side="end"><XMarkIcon /></InputSlot>
	</Group>
</TextField>;
```

### Soft Variant with Color

```tsx
<TextField variant="soft" color="terracotta">
	<Label>Community</Label>
	<Group>
		<Input placeholder="Enter community name" />
	</Group>
</TextField>;
```

### TextArea

```tsx
<TextField size={2} color="sage">
	<Label>Description</Label>
	<Description>Describe your request in detail</Description>
	<Group>
		<TextArea rows={4} resize="vertical" placeholder="Tell us more..." />
	</Group>
	<FieldError />
</TextField>;
```

### Invalid State

```tsx
<TextField isInvalid color="sage">
	<Label>Email</Label>
	<Group>
		<Input value="not-an-email" />
	</Group>
	<FieldError>Please enter a valid email address</FieldError>
</TextField>;
```

### Horizontal Layout

```tsx
<TextField orientation="horizontal" size={2}>
	<Label>Zip code</Label>
	<Group>
		<Input placeholder="N2L 3G1" className="max-w-32" />
	</Group>
</TextField>;
```

### Inline with Button (demonstrating height alignment)

```tsx
<div className="flex items-end gap-3">
	<TextField size={2} color="sage" className="flex-1">
		<Label>Search</Label>
		<Group>
			<Input placeholder="Search..." />
		</Group>
	</TextField>
	<Button size={2} color="sage">Go</Button>
</div>;
```

---

## Implementation Notes

### Shadow + Ring Coexistence

Tailwind v4 composes `box-shadow` from separate variables: `--tw-inset-shadow`, `--tw-ring-shadow`, and `--tw-shadow`. Our Group uses `shadow-[inset_...]` for borders and `ring-2` for focus. These compose without conflict. Verify during implementation that the shadow doesn't get clobbered on focus.

### Classic Variant Shadow Token

The classic variant uses `shadow-sm` as a starting point. If the design needs a specific elevation shadow (like the card's `--shadow-card-classic`), we may need to define a `--shadow-field-classic` CSS variable in `theme.css`. Evaluate during implementation.

### RAC TextField Auto-Detection

RAC's `TextField` internally checks whether its children include `Input` or `TextArea` (via context consumers) and provides the appropriate context. No special handling needed — just ensure consumers don't place BOTH Input and TextArea inside the same TextField.

### Form Integration (App-Level Concern)

react-hook-form integration is NOT a design system concern. RAC's TextField natively handles `name`, `value`, `onChange`, `isInvalid`, etc. App-level integration in `apps/webapp/` would look like:

```tsx
// This is an APP-LEVEL composition, NOT part of @repo/ui
function FormTextField({ control, name, ...props }) {
	const { field, fieldState } = useController({ control, name });
	return (
		<TextField isInvalid={!!fieldState.error} {...props}>
			<Label>...</Label>
			<Group>
				<Input ref={field.ref} value={field.value} onChange={field.onChange} />
			</Group>
			<FieldError>{fieldState.error?.message}</FieldError>
		</TextField>
	);
}
```

### Future Field Types

The `field/` directory is designed to be reused. When building NumberField, SearchField, Select, etc.:

- Import `Label`, `Group`, `InputSlot`, `FieldError`, `Description` from `field/`
- Import `FieldContext` and provide the same visual context
- Only the wrapper component and field-specific primitives are new

### Lint and Formatting

After all files are created, run `bun run lint:fix` from the repo root. The project uses `@antfu/eslint-config` with tabs, double quotes, and semicolons.
