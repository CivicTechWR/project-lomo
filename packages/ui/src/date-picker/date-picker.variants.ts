import { tv } from "tailwind-variants";
import { tw } from "../utils/tw.ts";

/**
 * A single editable part of the date (day, month, year).
 *
 * Segments are focusable siblings inside one field, so focus is shown as a
 * filled block rather than a ring — a ring per segment would read as several
 * separate inputs.
 */
export const dateSegmentVariants = tv({
	base: tw(
		"rounded-1 px-0.5 tabular-nums caret-transparent outline-none",
		"focus:bg-terracotta-9 focus:text-white",
		"data-placeholder:text-gray-10",
		"data-disabled:cursor-not-allowed data-disabled:text-gray-8",
		/* Literal separators ("/") are not editable and must not look focusable. */
		"data-[type=literal]:px-0 data-[type=literal]:text-gray-10",
	),
});

/** The popover panel holding the calendar. */
export const calendarPopoverVariants = tv({
	base: tw(
		"rounded-4 border border-gray-6 bg-gray-1 p-3 shadow-brand",
		"entering:animate-in entering:fade-in entering:zoom-in-95",
		"exiting:animate-out exiting:fade-out exiting:zoom-out-95",
	),
});

/** A day cell in the calendar grid. */
export const calendarCellVariants = tv({
	base: tw(
		"flex size-9 cursor-pointer items-center justify-center rounded-2",
		"text-[length:var(--text-2)] tabular-nums outline-none",
		"data-hovered:bg-terracotta-3",
		"data-focus-visible:ring-2 data-focus-visible:ring-terracotta-8",
		"data-selected:bg-terracotta-9 data-selected:text-white",
		"data-selected:data-hovered:bg-terracotta-10",
		"data-unavailable:cursor-not-allowed data-unavailable:text-gray-8 data-unavailable:line-through",
		"data-disabled:cursor-not-allowed data-disabled:text-gray-8",
		/* Days spilling in from adjacent months stay in the grid but read as inert. */
		"data-outside-month:invisible",
	),
});

/** Month navigation button either side of the calendar heading. */
export const calendarNavButtonVariants = tv({
	base: tw(
		"flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-2",
		"text-gray-11 outline-none",
		"data-hovered:bg-gray-3 data-hovered:text-gray-12",
		"data-focus-visible:ring-2 data-focus-visible:ring-gray-8",
		"data-disabled:cursor-not-allowed data-disabled:text-gray-8",
	),
});

/** The button inside the field that opens the calendar. */
export const calendarTriggerVariants = tv({
	base: tw(
		"flex shrink-0 cursor-pointer items-center justify-center rounded-1",
		"text-gray-11 outline-none",
		"data-hovered:text-gray-12",
		"data-focus-visible:ring-2 data-focus-visible:ring-gray-8",
		"data-disabled:cursor-not-allowed data-disabled:text-gray-8",
	),
});
