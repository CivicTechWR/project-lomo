import type { NeededBy, NeededByPresetId } from "./types";

/**
 * Resolving deadline presets to timestamps.
 *
 * Every preset resolves to the *end* of the period it names, because the stored
 * value is a deadline — "today" means help is still useful until today is over,
 * not until this instant. Resolving at end-of-day also means a request is never
 * born already overdue.
 *
 * All arithmetic goes through `Date`'s local-time accessors (`setHours`,
 * `getDay`, `setDate`), so a deadline lands at the end of the requester's own
 * day. Note this deliberately avoids `new Date("2026-08-26")`, which parses as
 * UTC midnight and resolves to the previous day for anyone west of Greenwich —
 * that is the bug this module exists to not have.
 */

/** Saturday. Weeks are treated as Sunday-start, matching en-CA. */
const LAST_DAY_OF_WEEK = 6;

export interface NeededByPreset {
	id: NeededByPresetId;
	label: string;
	/** Whether this preset names a window rather than one specific day. */
	flexible: boolean;
}

/**
 * Chips offered alongside the exact-date picker, ordered nearest first.
 *
 * `exact` is absent on purpose: it is not a chip but the calendar itself, and its
 * deadline comes from whichever day the requester picks.
 */
export const NEEDED_BY_PRESETS: readonly NeededByPreset[] = [
	{ id: "today", label: "Today", flexible: false },
	{ id: "tomorrow", label: "Tomorrow", flexible: false },
	{ id: "this_week", label: "This week", flexible: true },
	{ id: "next_week", label: "Next week", flexible: true },
] as const;

/**
 * A calendar day without a time or zone.
 *
 * Structural so it accepts `@internationalized/date`'s `CalendarDate` (what the
 * design system's `DatePicker` emits) without this module depending on that
 * package. `month` is 1-based, as `CalendarDate` uses.
 */
export interface PlainDate {
	year: number;
	/** 1-based, so January is 1. */
	month: number;
	day: number;
}

/** The final millisecond of the given local day. */
function endOfLocalDay(date: Date): number {
	const copy = new Date(date);
	copy.setHours(23, 59, 59, 999);
	return copy.getTime();
}

/** The local day a preset resolves to, before being pushed to end-of-day. */
function presetDay(preset: NeededByPresetId, now: Date): Date | null {
	const day = new Date(now);

	switch (preset) {
		case "today":
			return day;
		case "tomorrow":
			day.setDate(day.getDate() + 1);
			return day;
		case "this_week":
			day.setDate(day.getDate() + (LAST_DAY_OF_WEEK - day.getDay()));
			return day;
		case "next_week":
			day.setDate(day.getDate() + (LAST_DAY_OF_WEEK - day.getDay()) + 7);
			return day;
		case "exact":
			// The caller supplies the date; there is nothing to derive.
			return null;
	}
}

/**
 * Turns a preset chip into a stored deadline.
 *
 * Returns `null` for `exact`, which must go through {@link neededByFromDate}.
 * `now` is injectable so the behaviour can be tested on a fixed clock.
 */
export function neededByFromPreset(
	preset: NeededByPresetId,
	now: Date = new Date(),
): NeededBy | null {
	const day = presetDay(preset, now);
	if (day == null) {
		return null;
	}

	return {
		at: endOfLocalDay(day),
		flexible: NEEDED_BY_PRESETS.find(p => p.id === preset)?.flexible ?? false,
		preset,
	};
}

/** Turns an exact day chosen in the calendar into a stored deadline. */
export function neededByFromDate(date: PlainDate): NeededBy {
	// Month is 1-based on the way in, 0-based for the Date constructor.
	return {
		at: endOfLocalDay(new Date(date.year, date.month - 1, date.day)),
		flexible: false,
		preset: "exact",
	};
}

/** The stored deadline as a calendar day, for seeding the picker on revisit. */
export function neededByToPlainDate(neededBy: NeededBy): PlainDate {
	const date = new Date(neededBy.at);
	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
	};
}

/**
 * Human-readable deadline for summaries and request cards.
 *
 * A flexible deadline is phrased as a window ("by end of Sat, Aug 29") so the
 * copy never implies the requester named a precise time when they did not.
 */
export function formatNeededBy(
	neededBy: NeededBy | null,
	locale = "en-CA",
): string | null {
	if (neededBy == null) {
		return null;
	}

	const formatted = new Intl.DateTimeFormat(locale, {
		weekday: "short",
		month: "short",
		day: "numeric",
	}).format(new Date(neededBy.at));

	return neededBy.flexible ? `by end of ${formatted}` : formatted;
}
