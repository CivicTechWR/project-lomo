import { DatePicker } from "@repo/ui/date-picker";
import { Label } from "@repo/ui/field";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/**
 * The design system's `DatePicker` speaks in plain `{year, month, day}` objects
 * rather than `@internationalized/date` values, so consuming apps don't need that
 * package and can't leak a zone-bearing `Date` into a field that only means "a
 * day". These tests pin that boundary — it is the part most likely to be
 * "simplified" back into a raw `Date` later.
 */
/* Asserted loosely: segment order and formatting are locale-driven. */
const YEAR_2026 = /2026/;
const DAY_1 = /\b1\b/;

describe("datePicker", () => {
	it("renders a labelled group of editable date segments", () => {
		render(
			<DatePicker aria-label="Needed by">
				<Label>Needed by</Label>
			</DatePicker>,
		);

		// react-aria exposes the field as a group of spinbuttons, one per segment.
		expect(screen.getAllByRole("spinbutton").length).toBeGreaterThanOrEqual(3);
	});

	it("displays a supplied plain date across its segments", () => {
		render(<DatePicker aria-label="Needed by" value={{ year: 2026, month: 3, day: 1 }} />);

		const values = screen.getAllByRole("spinbutton").map(el => el.getAttribute("aria-valuetext"));

		expect(values.join(" ")).toMatch(YEAR_2026);
		expect(values.join(" ")).toMatch(DAY_1);
	});

	it("exposes a trigger that opens the calendar", () => {
		render(<DatePicker aria-label="Needed by" />);

		expect(screen.getByRole("button")).toBeTruthy();
	});

	it("does not call onChange while merely rendering a value", () => {
		const onChange = vi.fn();
		render(
			<DatePicker
				aria-label="Needed by"
				value={{ year: 2026, month: 3, day: 1 }}
				onChange={onChange}
			/>,
		);

		expect(onChange).not.toHaveBeenCalled();
	});

	it("accepts null for an empty field", () => {
		render(<DatePicker aria-label="Needed by" value={null} />);

		const values = screen.getAllByRole("spinbutton").map(el => el.getAttribute("aria-valuetext"));

		expect(values.every(v => v === "Empty" || v == null || v === "")).toBe(true);
	});
});
