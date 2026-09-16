import { describe, expect, it } from "vitest";
import {
	formatNeededBy,
	NEEDED_BY_PRESETS,
	neededByFromDate,
	neededByFromPreset,
	neededByToPlainDate,
} from "../request-flow/needed-by";

/**
 * `neededBy` is a deadline, not an appointment. These tests pin the properties
 * the admin deadline alert depends on: a deadline always falls at the END of the
 * period it names (so a request is never born overdue), it is computed in the
 * requester's own local day, and window presets are flagged flexible so the UI
 * never implies false precision.
 */

/** A Wednesday, to make week-boundary maths non-trivial. */
const WEDNESDAY = new Date(2026, 7, 26, 14, 30);

/** Flexible deadlines are phrased as a window rather than an instant. */
const WINDOW_PHRASING = /^by end of /;

function localParts(ms: number) {
	const d = new Date(ms);
	return {
		date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
		hours: d.getHours(),
		minutes: d.getMinutes(),
		seconds: d.getSeconds(),
	};
}

describe("neededByFromPreset", () => {
	it("resolves every chip to the last moment of its local day", () => {
		for (const preset of NEEDED_BY_PRESETS) {
			const result = neededByFromPreset(preset.id, WEDNESDAY);

			expect(result, `${preset.id} produced no deadline`).not.toBeNull();

			const { hours, minutes, seconds } = localParts(result!.at);
			expect(hours, `${preset.id} should end at 23:59:59 local`).toBe(23);
			expect(minutes).toBe(59);
			expect(seconds).toBe(59);
		}
	});

	it("never produces a deadline before the moment it was created", () => {
		for (const preset of NEEDED_BY_PRESETS) {
			const result = neededByFromPreset(preset.id, WEDNESDAY);
			expect(result!.at, `${preset.id} is already overdue`).toBeGreaterThan(WEDNESDAY.getTime());
		}
	});

	it("orders the chips from soonest to latest", () => {
		const deadlines = NEEDED_BY_PRESETS.map(p => neededByFromPreset(p.id, WEDNESDAY)!.at);

		expect(deadlines).toEqual(deadlines.toSorted((a, b) => a - b));
	});

	it("marks only the window presets as flexible", () => {
		expect(neededByFromPreset("today", WEDNESDAY)!.flexible).toBe(false);
		expect(neededByFromPreset("tomorrow", WEDNESDAY)!.flexible).toBe(false);
		expect(neededByFromPreset("this_week", WEDNESDAY)!.flexible).toBe(true);
		expect(neededByFromPreset("next_week", WEDNESDAY)!.flexible).toBe(true);
	});

	it("resolves today to the same local date it was given", () => {
		const result = neededByFromPreset("today", WEDNESDAY)!;

		expect(localParts(result.at).date).toBe("2026-08-26");
	});

	it("resolves tomorrow to the next local date", () => {
		const result = neededByFromPreset("tomorrow", WEDNESDAY)!;

		expect(localParts(result.at).date).toBe("2026-08-27");
	});

	it("resolves this week to the coming Saturday", () => {
		const result = neededByFromPreset("this_week", WEDNESDAY)!;

		// 2026-08-26 is a Wednesday, so the week ends Saturday the 29th.
		expect(localParts(result.at).date).toBe("2026-08-29");
		expect(new Date(result.at).getDay()).toBe(6);
	});

	it("resolves next week to the Saturday after that", () => {
		const result = neededByFromPreset("next_week", WEDNESDAY)!;

		expect(localParts(result.at).date).toBe("2026-09-05");
		expect(new Date(result.at).getDay()).toBe(6);
	});

	it("still lands on Saturday when today already is Saturday", () => {
		const saturday = new Date(2026, 7, 29, 9, 0);
		const result = neededByFromPreset("this_week", saturday)!;

		expect(localParts(result.at).date).toBe("2026-08-29");
		expect(result.at).toBeGreaterThan(saturday.getTime());
	});

	it("rolls over month and year boundaries", () => {
		const newYearsEve = new Date(2026, 11, 31, 10, 0);
		const result = neededByFromPreset("tomorrow", newYearsEve)!;

		expect(localParts(result.at).date).toBe("2027-01-01");
	});

	it("returns null for exact, which needs a date from the calendar", () => {
		expect(neededByFromPreset("exact", WEDNESDAY)).toBeNull();
	});
});

describe("neededByFromDate", () => {
	it("keeps the chosen day instead of shifting it a day backwards", () => {
		// The failure mode being guarded: new Date("2026-03-01") is UTC midnight,
		// which is 2026-02-28 anywhere west of Greenwich.
		const result = neededByFromDate({ year: 2026, month: 3, day: 1 });

		expect(localParts(result.at).date).toBe("2026-03-01");
		expect(result.flexible).toBe(false);
		expect(result.preset).toBe("exact");
	});

	it("round-trips through neededByToPlainDate", () => {
		const original = { year: 2026, month: 3, day: 1 };

		expect(neededByToPlainDate(neededByFromDate(original))).toEqual(original);
	});
});

describe("formatNeededBy", () => {
	it("phrases a flexible deadline as a window", () => {
		const flexible = neededByFromPreset("this_week", WEDNESDAY)!;

		expect(formatNeededBy(flexible)).toMatch(WINDOW_PHRASING);
	});

	it("states an exact deadline plainly", () => {
		const exact = neededByFromDate({ year: 2026, month: 3, day: 1 });

		expect(formatNeededBy(exact)).not.toMatch(WINDOW_PHRASING);
		expect(formatNeededBy(exact)).toContain("Mar");
	});

	it("returns null when there is no deadline", () => {
		expect(formatNeededBy(null)).toBeNull();
	});
});
