import { describe, expect, it } from "vitest";
import { filterOpenRequests } from "../open-request-filters";
import { isRequestUrgent } from "../request-urgency";

describe("isRequestUrgent", () => {
	it("returns true when isUrgent flag is set", () => {
		expect(isRequestUrgent({ isUrgent: true })).toBe(true);
	});

	it("detects urgency from payload snapshot", () => {
		expect(isRequestUrgent({
			payload: JSON.stringify({ draft: { urgency: "urgent" } }),
		})).toBe(true);
	});

	it("detects urgency from details text", () => {
		expect(isRequestUrgent({
			details: "Food type: Groceries\nUrgency: Urgent",
		})).toBe(true);
	});

	it("detects urgency case-insensitively with flexible spacing", () => {
		expect(isRequestUrgent({
			details: "urgency:  urgent",
		})).toBe(true);
	});

	it("returns false for non-urgent requests", () => {
		expect(isRequestUrgent({
			details: "Food type: Groceries\nUrgency: When possible",
		})).toBe(false);
	});
});

describe("filterOpenRequests urgent filter", () => {
	const urgentRequest = {
		_id: "1",
		category: "food",
		title: "Groceries",
		summary: "Groceries",
		details: "Urgency: Urgent",
		status: "pending",
		isUrgent: false,
		inYourArea: false,
		needsDelivery: false,
	} as const;

	const normalRequest = {
		_id: "2",
		category: "food",
		title: "Meal",
		summary: "Meal",
		details: "Urgency: When possible",
		status: "pending",
		isUrgent: false,
		inYourArea: false,
		needsDelivery: false,
	} as const;

	it("includes legacy urgent requests when urgentOnly is enabled", () => {
		const filtered = filterOpenRequests(
			[
				urgentRequest as unknown as Parameters<typeof filterOpenRequests>[0][number],
				normalRequest as unknown as Parameters<typeof filterOpenRequests>[0][number],
			],
			{ categories: [], urgentOnly: true },
		);
		expect(filtered).toHaveLength(1);
		expect(filtered[0]?._id).toBe("1");
	});
});
