# Showcase → Documentation Rewrite Guide

> **Purpose:** This document is a self-contained implementation spec. Drop it into a new Claude Code session with the instruction "implement the next component from SHOWCASE-DOCS-GUIDE.md" to get hands-off execution. Work incrementally — one component per session.

---

## Overview

We are rewriting the component showcase pages at `apps/webapp/src/routes/showcase/` from basic visual demos into comprehensive documentation. The style is a hybrid of [React Aria Components](~/refs/react-spectrum/packages/react-aria-components/docs/) (narrative, specification-heavy) and [Radix UI Themes](~/refs/themes/) (visual matrix, variant exploration).

**Button** (`button.tsx`) is the **completed reference implementation**. Every other component page must follow its exact pattern.

---

## Section Order (every page)

Each component doc page must render these sections in this order, wrapped in a single `<div className="flex flex-col gap-10">`:

1. **PageHeader** — existing, keep as-is
2. **Playground** — existing, keep as-is (custom playgrounds like TextField's are also fine)
3. **Anatomy** — `<Anatomy>` from `-doc-components.tsx`
4. **Features** — `<FeatureList>` from `-doc-components.tsx`
5. **Usage Guidelines** — `<UsageGuidelines>` from `-doc-components.tsx`
6. **Examples** — `<DocSection title="Examples">` wrapping multiple `<CodeExample>` items
7. **Visual Reference** — `<DocSection title="Visual Reference">` wrapping existing `<DemoSection>` items
8. **Context & Composition** — `<DocSection title="Context & Composition">` (only for components with group/context behavior)
9. **API Reference** — `<DocSection title="API Reference">` wrapping existing `<PropTable>`

---

## Imports Pattern

Every updated page needs two import lines for showcase infrastructure:

```tsx
import { DemoSection, PageHeader, Playground, PropTable } from "./-components";
import { Anatomy, CodeExample, DocSection, FeatureList, UsageGuidelines } from "./-doc-components";
```

Import only what the page uses. Simple components won't need `DocSection` for Context & Composition.

---

## Shared Doc Components

Located at `apps/webapp/src/routes/showcase/-doc-components.tsx` (already created). Components:

### `Anatomy`

```tsx
<Anatomy
	parts={[
		{ label: "ComponentName", description: "What it does" },
		{ label: "children", description: "What goes inside" },
	]}
>
	{/* Live rendered component */}
	<Button>Example</Button>
</Anatomy>;
```

### `FeatureList`

```tsx
<FeatureList
	features={[
		"First feature description.",
		"Second feature description.",
	]}
/>;
```

### `UsageGuidelines`

```tsx
<UsageGuidelines
	description="Intro paragraph explaining the overall guidance."
	guidelines={[
		{ type: "do", text: "Do this specific thing." },
		{ type: "dont", text: "Don't do this other thing." },
	]}
/>;
```

### `CodeExample`

```tsx
<CodeExample
	title="Example Title"
	description="Why this pattern matters."
	code={`<Button variant="solid">Save</Button>`}
>
	<Button variant="solid">Save</Button>
</CodeExample>;
```

### `DocSection`

```tsx
<DocSection title="Section Title" description="Optional intro.">
	{/* Content */}
</DocSection>;
```

---

## How to Transform an Existing Page

1. **Read the existing page** to understand its current structure (Playground, PropTable, DemoSections)
2. **Keep all existing content** — don't remove Playground, PropTable, or DemoSections
3. **Add the new imports** from `-doc-components.tsx`
4. **Insert new sections** between Playground and the existing DemoSections:
   - Anatomy (after Playground)
   - FeatureList (after Anatomy)
   - UsageGuidelines (after FeatureList)
   - Examples with CodeExamples (after UsageGuidelines)
5. **Wrap existing DemoSections** in `<DocSection title="Visual Reference">`
6. **Wrap existing PropTable** in `<DocSection title="API Reference">`
7. **Add Context & Composition** section if the component has group/context behavior
8. **Add section comments** like `{/* ── Anatomy ── */}` for readability

---

## Navigation Sidebar Update

Update `NAV_GROUPS` in `apps/webapp/src/routes/showcase/route.tsx` to reorganize by function:

```tsx
const NAV_GROUPS = [
	{
		label: "Inputs",
		items: [
			{ name: "Checkbox", to: "/showcase/checkbox" },
			{ name: "Checkbox Card", to: "/showcase/checkbox-card" },
			{ name: "TextField", to: "/showcase/text-field" },
			{ name: "TextArea", to: "/showcase/text-area" },
		],
	},
	{
		label: "Display",
		items: [
			{ name: "Button", to: "/showcase/button" },
			{ name: "Badge", to: "/showcase/badge" },
			{ name: "Card", to: "/showcase/card" },
			{ name: "Modal", to: "/showcase/modal" },
		],
	},
	{
		label: "Typography",
		items: [
			{ name: "Text", to: "/showcase/text" },
			{ name: "Heading", to: "/showcase/heading" },
			{ name: "Link", to: "/showcase/link" },
		],
	},
] as const;
```

Do this update when creating the TextArea page (since it adds a new route).

---

## Per-Component Content Specs

### Badge (`badge.tsx`)

**Anatomy parts:**

- `Badge` — Inline-flex span container. Uses pill radius (`max()` formula) for automatic rounding.
- `children` — Text content. Keep short — 1-3 words.

**Features:**

- Four visual variants (solid, soft, surface, outline) for different weight levels.
- Three sizes for density control.
- Six palette colors for semantic meaning.
- High-contrast mode for stronger visual emphasis and accessibility.
- Pill radius behavior — always rounds fully regardless of radius preset.

**Usage Guidelines:**

- description: "Select variants by visual weight. Solid for critical statuses, soft as the default label style, surface for subtle annotations, outline for tag-like labels."
- do: "Keep badge text short — 1-3 words maximum."
- do: "Use highContrast for important statuses that need to stand out."
- do: "Use semantic colors — red for errors, yellow for warnings, sage for success, gray for neutral."
- do: "Use Badge for categorical labels, counts, or status indicators."
- dont: "Don't use badges for sentences or long text."
- dont: "Don't put interactive elements inside a badge — it's a display component."
- dont: "Don't mix badge variants in the same context — pick one style and be consistent."

**Examples:**

1. **Status Indicators** — Row of badges: "Active" (sage/soft), "Pending" (yellow/soft), "Error" (red/solid)
2. **Notification Count** — Small solid badge with a number (e.g., `<Badge variant="solid" size={1} color="red">3</Badge>`)
3. **Tag List** — Row of outline badges as category tags ("React", "TypeScript", "Tailwind")
4. **High-Contrast Comparison** — Same badge with and without highContrast side-by-side

---

### Card (`card.tsx`)

**Anatomy parts:**

- `Card` — Block container div. Provides padding, border, radius, and background. No interactivity or ARIA semantics.
- `children` — Any content. Card is layout-agnostic — internal layout is the consumer's responsibility.

**Features:**

- Three visual variants (ghost, surface, classic) for different elevation levels.
- Five sizes controlling the padding scale.
- Six palette colors for accent tinting.
- No pill radius behavior — uses plain `var(--radius-4)`.
- Pure container — no interactivity or ARIA semantics built in.

**Usage Guidelines:**

- description: "Card provides visual grouping — padding, border, radius, and background. All internal layout is yours."
- do: "Use Card to visually group related content."
- do: "Use surface variant as the standard container (border + subtle shadow)."
- do: "Use ghost variant for borderless content grouping."
- dont: "Don't use Card as a button — if clickable, wrap content with an interactive element."
- dont: "Don't rely on Card for semantic grouping — use `<section>` or `<article>` for semantics, Card for visuals."
- dont: "Don't nest cards deeply — one level of nesting at most."

**Examples:**

1. **Content Card** — Card with Heading + Text + Button inside, showing a realistic content layout
2. **Card Grid** — 2x2 grid of surface cards for a dashboard-like layout
3. **Ghost Grouping** — Ghost variant used as a subtle section divider (no border, just padding)
4. **Nested Card** — A classic card inside a surface card, showing one level of nesting

---

### Checkbox (`checkbox.tsx`)

**Page covers:** Checkbox, CheckboxGroup, CheckboxIndicator

**Anatomy parts:**

- `CheckboxIndicator` — The tick/dash box. Can be used standalone for custom layouts.
- `Checkbox` — Root interactive element wrapping indicator + label. Built on react-aria-components.
- `children` — Label text rendered beside the indicator.
- `CheckboxGroup` — Context provider that passes variant/size/color to all child Checkboxes.

**Features:**

- Two visual variants (surface, classic) for different indicator styles.
- Three sizes.
- Six palette colors.
- Indeterminate state with dash indicator for "select all" controls.
- CheckboxGroup provides shared styling context (variant/size/color) to all children.
- Built on react-aria-components for full keyboard and screen reader support.
- Standalone CheckboxIndicator for custom checkbox layouts.

**Usage Guidelines:**

- description: "Use Checkbox for compact multi-select lists. Use CheckboxCard when each option needs more description or visual weight."
- do: "Always wrap related checkboxes in CheckboxGroup for ARIA group semantics."
- do: "Use indeterminate state for 'select all' parent controls."
- do: "Provide meaningful labels — avoid generic 'Option 1' text."
- dont: "Don't use Checkbox for binary toggles that take immediate effect (use Switch when built)."
- dont: "Don't style individual checkboxes differently within a group."
- dont: "Don't use Checkbox without a visible label — if icon-only, use aria-label."

**Examples:**

1. **Single Checkbox** — "I agree to the terms and conditions" acceptance pattern
2. **Checkbox Group** — Notification preferences: Email, SMS, Push notifications with Label and Description
3. **Indeterminate Select All** — Parent checkbox controlling child checkboxes (use existing grouped demo state pattern)
4. **Form Validation** — CheckboxGroup with required validation and FieldError

**Context & Composition:**

- Explain how `CheckboxGroup` provides `CheckboxGroupStyleContext` (variant, size, color) to children
- Show that individual Checkbox can override group context props
- Show standalone `CheckboxIndicator` usage for custom layouts

---

### Checkbox Card (`checkbox-card.tsx`)

**Page covers:** CheckboxCard, CheckboxCardGroup

**Anatomy parts:**

- `CheckboxCard` — Card-style checkbox with border highlight on selection. Wraps CheckboxIndicator + content.
- `CheckboxIndicator` — The tick/dash box rendered inside the card.
- `children` — Card content: typically a title, description, and optional icon.
- `CheckboxCardGroup` — Context provider for card-style checkboxes. Forces "surface" FieldContext.

**Features:**

- Card-style selection with inset border shadow on select.
- Two visual variants inherited from Checkbox (surface, classic).
- Three sizes.
- Six palette colors with selected-state styling.
- CheckboxCardGroup provides shared styling context to all children.

**Usage Guidelines:**

- description: "Use CheckboxCard for multi-select scenarios where each option has a title, description, or icon — like selecting help categories or plan features."
- do: "Give each card a clear title and optional description."
- do: "Use consistent card sizes within a group."
- do: "Use the existing HELP_CATEGORIES pattern as a real-world example."
- dont: "Don't use for simple yes/no lists — use regular Checkbox instead."
- dont: "Don't mix CheckboxCard and regular Checkbox in the same group."
- dont: "Don't make cards too small for their content — size 2 or 3 for cards with descriptions."

**Examples:**

1. **Help Category Selection** — Grid of cards with icons and descriptions using the existing HELP_CATEGORIES data
2. **Feature Toggles** — Cards for enabling/disabling features with explanations (e.g., "Email notifications", "Dark mode")
3. **Compact Card Group** — Size 1 cards for space-constrained layouts

**Context & Composition:**

- How CheckboxCardGroup forces "surface" FieldContext for card children
- Controlled vs uncontrolled group value patterns

---

### TextField (`text-field.tsx`)

**Page covers:** TextField, Input, Label, Description, Group, FieldError, InputSlot

**Anatomy parts (this is the star anatomy section — show ALL parts):**

- `TextField` — Context provider wrapper. Owns variant, size, color. Does not render visual chrome.
- `Label` — Styled label element. Always font-medium. Scales with size via FieldContext.
- `Description` — Helper text. Gray, smaller than label. Pre-sets slot="description" for aria-describedby.
- `Group` — Visual input container: border, background, focus ring, hover/invalid states. Auto-focuses input on click.
- `InputSlot` — Prefix/suffix container for icons or addons. Auto-sizes icons. side="start" | "end".
- `Input` — Styled input element. Transparent, inherits font from Group. flex-1.
- `FieldError` — Validation errors in red. Renders children or auto-renders validation errors as list.

**Features:**

- Fully composable — include only the parts you need.
- Context-driven — set variant/size/color once on TextField, all children inherit via FieldContext.
- Three visual variants (surface, soft, classic).
- Three sizes matching Button sizes for inline alignment.
- Both vertical and horizontal orientation.
- InputSlot for prefix/suffix icons with automatic size scaling.
- Built-in validation display via FieldError with isInvalid.

**Usage Guidelines:**

- description: "TextField is not a monolithic input — it's a context provider. You compose it from independent parts. This is the key concept."
- do: "Always include Label for accessibility."
- do: "Use Description for field expectations that aren't obvious from the label."
- do: "Use FieldError with isInvalid for form validation feedback."
- do: "Use InputSlot for search icons, currency symbols, or action buttons."
- dont: "Don't use Group without a TextField parent — it needs FieldContext."
- dont: "Don't put multiple Input or TextArea inside one Group."
- dont: "Don't skip Label — if no visible label, use aria-label on TextField."

**Examples:**

1. **Simple Text Input** — Just Label + Group + Input (minimal composition)
2. **Search with Icon** — InputSlot with MagnifyingGlassIcon + Input
3. **Email with Validation** — Full composition: Label + Description + Group + Input + FieldError with isInvalid
4. **Horizontal Layout** — orientation="horizontal" for settings-style forms (label beside input)
5. **Inline with Button** — TextField + Button side by side showing size alignment

**Context & Composition:**

- How TextField provides FieldContext to all children
- How Group auto-focuses the input when clicked anywhere on the container
- How InputSlot auto-sizes icons based on the field's size
- How FieldError renders validation (single message vs list of errors)
- Keep the existing "Composition Model" code example and "Component Parts" table content — integrate them into this section

**Note:** Remove TextArea-specific demos from this page (the "TextArea" DemoSection). They move to the new TextArea page.

---

### TextArea (`text-area.tsx`) — NEW PAGE

Create a new route file. Uses the same TextField composition but focused on TextArea.

**Anatomy parts:**

- Same as TextField but with `TextArea` replacing `Input`
- `TextArea` — Multi-line input. Supports `resize` prop. Transparent, inherits font from Group.

**Features:**

- Multi-line text input for longer content.
- Configurable resize behavior (none, vertical, horizontal, both).
- Shares all TextField composition parts (Label, Description, Group, FieldError).
- Automatic pill radius removal — Group uses `has-[textarea]` to strip pill behavior.

**Usage Guidelines:**

- description: "Use TextArea for content that's typically multi-line — descriptions, comments, messages. For single-line data like names or emails, use Input."
- do: "Set a reasonable default rows count (3-5 for most cases)."
- do: "Use Description to communicate length expectations or formatting guidance."
- do: "Use resize='vertical' as the default — it's the most predictable for users."
- dont: "Don't use TextArea for short, single-value fields."
- dont: "Don't set resize='none' without providing enough default height for the expected content."
- dont: "Don't combine TextArea and Input in the same Group."

**Examples:**

1. **Comment Box** — Label + Group + TextArea with placeholder
2. **Description with Guidance** — Label + Description + Group + TextArea
3. **Resize Modes** — Side-by-side comparison of none/vertical/both
4. **With Validation** — TextArea with FieldError showing validation

**Context & Composition:**

- TextArea consumes FieldContext exactly like Input
- How `has-[textarea]` in Group's CSS strips pill radius behavior

**Playground:** Create a custom playground (like TextField's) with controls for variant, size, color, resize, isDisabled, and text inputs for label/description/errorMessage. Follow the TextFieldPlayground pattern.

**Visual Reference DemoSections:** Variant, Size, Color, Resize modes.

**PropTable:** Include TextArea-specific props (resize) and TextField props.

---

### Text (`text.tsx`)

**Anatomy parts:**

- `Text` — Typography component that renders as span by default. Configurable element type.
- `elementType` — Can render as span, p, div, or label depending on semantic context.

**Features:**

- Nine-step type scale (1-9) shared with Heading and Link.
- Three font weights (regular, medium, bold).
- Six palette colors with low-contrast (step 11) and high-contrast (step 12) modes.
- Four trim options for leading trim (normal, start, end, both) for precise vertical alignment.
- Configurable element type (span, p, div, label) for correct semantics.

**Usage Guidelines:**

- description: "Text is the foundational typography component. Use it for body copy, captions, labels, and any non-heading text content."
- do: "Use elementType='p' for paragraphs and elementType='span' for inline text."
- do: "Use trim='both' when Text is inside containers needing precise vertical spacing (badges, buttons)."
- do: "Use highContrast sparingly — for key information that needs to stand out."
- do: "Use sizes 1-2 for captions, 3 for body text, 4-5 for large body or intros."
- dont: "Don't use Text for headings — use the Heading component for semantic heading elements."
- dont: "Don't use sizes 6-9 for body text — those are display sizes and should typically be Headings."
- dont: "Don't set highContrast on every Text — it loses its emphasis effect."

**Examples:**

1. **Body Paragraph** — Text with elementType="p" showing standard prose
2. **Caption Text** — Size 1, gray color for metadata (e.g., "Posted 3 hours ago")
3. **High-Contrast Comparison** — Same text with and without highContrast side-by-side
4. **Trim Demonstration** — Text with trim="both" inside a tight container vs trim="normal", showing the vertical spacing difference

---

### Heading (`heading.tsx`)

**Anatomy parts:**

- `Heading` — Renders semantic heading elements (h1-h6). Automatic size mapping from level.
- `level` — Sets the HTML element (h1-h6) for accessibility/semantics.
- `size` — Overrides visual size independent of semantic level.

**Features:**

- Semantic heading levels (h1-h6) with automatic size mapping (h1→9, h2→8, h3→7, h4→6, h5→5, h6→4).
- Size override independent of semantic level — have an h2 that looks like an h4.
- Nine-step type scale shared with Text.
- Three font weights (default: bold, unlike Text which defaults to regular).
- Six palette colors with high-contrast on by default (unlike Text).
- Four trim options for leading trim.

**Usage Guidelines:**

- description: "Heading sets both visual and semantic hierarchy. Level controls the HTML element, size controls the appearance. They can differ."
- do: "Maintain logical heading order in the DOM (h1 → h2 → h3) for accessibility."
- do: "Use size override when visual hierarchy differs from document hierarchy."
- do: "Use Heading for section titles, page titles, and content structure."
- dont: "Don't skip heading levels in the DOM hierarchy (e.g., h1 → h3 without h2)."
- dont: "Don't use Heading for decorative or non-heading text — use large Text instead."
- dont: "Don't use multiple h1 elements per page."

**Examples:**

1. **Page Title** — `<Heading level={1}>Page Title</Heading>` (auto size 9)
2. **Section Heading with Override** — `<Heading level={2} size={5}>` showing visual/semantic independence
3. **All Levels** — h1 through h6 rendered sequentially showing the auto-size mapping
4. **Level vs Size Independence** — h3 with size={4} next to h3 with default size={7}

---

### Link (`link.tsx`)

**Anatomy parts:**

- `Link` — Interactive anchor element. Built on react-aria-components Link.
- `underline` — Controls underline behavior (auto, always, hover, none). Key distinguishing feature.

**Features:**

- Four underline modes (auto, always, hover, none) for different contexts.
- Nine-step type scale shared with Text and Heading.
- Three font weights.
- Six palette colors (default: terracotta, unlike Text's gray default).
- Truncation support with ellipsis for overflow control.
- Text wrapping control (wrap, nowrap, pretty, balance).
- Built on react-aria-components Link for keyboard and screen reader support.

**Usage Guidelines:**

- description: "Link is for navigation — clicking it takes you somewhere. For actions that don't navigate, use Button."
- do: "Use underline='always' in body text paragraphs for accessibility — users need to see links."
- do: "Use underline='none' only when the link has another clear visual indicator (e.g., nav menus)."
- do: "Use truncate for user-generated content that might overflow containers."
- do: "Use terracotta color for brand links, gray for subdued navigation links."
- dont: "Don't use underline='none' without another visual indicator — links must be discoverable."
- dont: "Don't use Link for actions (submit, open dialog) — use Button."
- dont: "Don't wrap very long content in a link without considering text wrapping behavior."

**Examples:**

1. **Inline Body Link** — Link with underline="always" inside a Text paragraph
2. **Navigation Links** — Row of links with underline="none" for a nav menu
3. **Underline Modes** — Same link rendered 4 times showing all underline modes
4. **Truncated Link** — Long URL truncated with ellipsis

**Note:** The existing link.tsx imports `AppLink` from `../../components/link` for the Router Integration demo. Keep that demo in Visual Reference.

---

### Modal (`modal.tsx`)

**Page covers:** Modal, ModalOverlay, DialogTrigger

**Anatomy parts:**

- `DialogTrigger` — Wraps the trigger button and manages open/close state. Re-exported from react-aria-components.
- `ModalOverlay` — Backdrop overlay with blur effect. Provides animation and backdrop click handling.
- `Modal` — Content container + dialog. Size-aware padding. Built on react-aria-components Modal + Dialog.

**Features:**

- Five sizes (1-5) for different content densities.
- Backdrop overlay with blur effect.
- Built on react-aria-components Modal + Dialog.
- DialogTrigger manages open/close state (controlled or uncontrolled).
- Focus trapping and keyboard dismissal (Escape key) built in.
- Supports dialog and alertdialog roles.

**Usage Guidelines:**

- description: "Use Modal for focused tasks that require attention before proceeding — confirmations, forms, alerts. Don't use for content that could be inline."
- do: "Always provide a clear close mechanism (close button or Escape key)."
- do: "Keep modal content focused on a single task."
- do: "Use size 1-2 for alerts and confirmations, size 3 for forms, size 4-5 for complex content."
- do: "Use role='alertdialog' with isDismissable={false} for destructive action confirmations."
- dont: "Don't nest modals — it's confusing and breaks focus management."
- dont: "Don't use modals for simple information that could be displayed inline."
- dont: "Don't put scrollable lists in small modal sizes (1-2)."

**Examples:**

1. **Confirmation Dialog** — "Are you sure?" with Cancel + Confirm buttons
2. **Form in Modal** — TextField inputs inside a Modal for an edit form
3. **Destructive Action** — Red-styled "Delete account" confirmation with alertdialog role
4. **Size Comparison** — Buttons triggering modals of different sizes (1-4) to show the range
5. **Composition** — Modal using Heading, Text, Button, TextField from @repo/ui together

**Context & Composition:**

- DialogTrigger manages open state (controlled via isOpen/onOpenChange or uncontrolled)
- ModalOverlay provides backdrop + animation layer
- Modal is the content container with size-aware padding
- Render props on Modal can provide a `close` callback function

---

## Implementation Checklist

Work through these one at a time. After each, run `bun run lint:fix` and `bun run build`.

- [x] Create `-doc-components.tsx` (shared doc components)
- [x] Button (reference implementation)
- [x] Badge
- [x] Card
- [x] Text
- [x] Heading
- [ ] Link
- [x] Checkbox
- [x] Checkbox Card
- [ ] TextField (restructure existing, remove TextArea content)
- [ ] TextArea (new page)
- [ ] Modal
- [ ] Update `route.tsx` NAV_GROUPS (do when creating TextArea page)

---

## Code Style Reminders

- **Indentation:** tabs
- **Quotes:** double quotes
- **Semicolons:** always
- **Lint after every file:** `bun run lint:fix`
- **Build to verify:** `bun run build`
- **No unused imports** — TypeScript strict mode enforces this
- Icons come from `@heroicons/react/24/solid` (or `/24/outline`)
- All @repo/ui components are imported from `@repo/ui` (except Modal components from `@repo/ui/modal`)

---

## Reference: Button Implementation

See `apps/webapp/src/routes/showcase/button.tsx` for the complete reference implementation. It demonstrates:

- All section ordering
- How to use each doc component
- CodeExample with live preview + code block
- Wrapping existing DemoSections in DocSection
- Wrapping PropTable in DocSection
- Comment structure (`{/* ── Section Name ── */}`)
