import type { Colors } from "../theme/types.ts";
import { tw } from "../utils/tw.ts";

type ColorMap = Record<Colors, string>;

/* ── Field Group sizes (applied to Group component) ──────────────────────
 * Heights match interactiveSizes (h-8, h-10, h-12) for inline alignment
 * with Button. Uses min-h so Group can grow when containing TextArea.
 */

export const fieldGroupSizes = {
	1: tw(
		"min-h-8 px-2 py-1.5 gap-1.5",
		"text-[length:var(--text-1)]",
		"leading-[var(--text-1--line-height)]",
		"rounded-[max(var(--radius-1),var(--radius-full))]",
		"has-[textarea]:rounded-[var(--radius-1)]",
	),
	2: tw(
		"min-h-10 px-3 py-2 gap-2",
		"text-[length:var(--text-2)]",
		"leading-[var(--text-2--line-height)]",
		"rounded-[max(var(--radius-2),var(--radius-full))]",
		"has-[textarea]:rounded-[var(--radius-2)]",
	),
	3: tw(
		"min-h-12 px-3.5 py-2.5 gap-2.5",
		"text-[length:var(--text-3)]",
		"leading-[var(--text-3--line-height)]",
		"rounded-[max(var(--radius-3),var(--radius-full))]",
		"has-[textarea]:rounded-[var(--radius-3)]",
	),
} as const;

/* ── TextField wrapper gaps (between Label, Group, FieldError) ── */

export const fieldGaps = {
	1: tw("gap-1"),
	2: tw("gap-1"),
	3: tw("gap-1.5"),
} as const;

/* ── Label text sizes (keyed by field size) ── */

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

/* ── Description + FieldError text sizes (smaller than label) ── */

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

/* ── InputSlot icon auto-sizing ── */

export const fieldSlotSizes = {
	1: tw("[&>svg]:size-3.5"),
	2: tw("[&>svg]:size-4"),
	3: tw("[&>svg]:size-4.5"),
} as const;

/* ── Field focus rings ──────────────────────────────────────────────────
 * Triggered on data-focus-within (not data-focus-visible like buttons).
 * No ring-offset — ring hugs the container.
 */

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

/* ── Field soft colors ──────────────────────────────────────────────────
 * Accent-tinted background for Group soft variant.
 * Text stays gray-12 (user content), unlike button softColors which
 * use accent step 11.
 */

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
