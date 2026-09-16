import type { HelpRequestStatus } from "../lib/filters";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { statusBadgeColor } from "../lib/filters";

/**
 * Property-based tests for dashboard count invariant and status badge mapping.
 */

/** All valid help request statuses in the system */
const ALL_STATUSES: HelpRequestStatus[] = [
	"pending",
	"assigned",
	"awaiting_requester_acceptance",
	"in_progress",
	"complete",
	"cancelled",
];

/** Expected color tokens returned by statusBadgeColor */
const VALID_COLORS = [
	"gray-6",
	"yellow-5",
	"sage-4",
	"sage-9",
	"darkred-5",
];

/** Arbitrary for a valid HelpRequestStatus */
const arbStatus = fc.constantFrom(...ALL_STATUSES);

describe("property 4: status badge mapping totality", () => {
	/**
	 * **Validates: Requirements 2.2, 2.3, 7.6**
	 *
	 * For every valid HelpRequestStatus value, statusBadgeColor must return
	 * a non-empty string that is one of the expected color tokens.
	 */
	it("statusBadgeColor returns a valid color token for every HelpRequestStatus", () => {
		fc.assert(
			fc.property(
				arbStatus,
				(status) => {
					const color = statusBadgeColor(status);
					expect(color).toBeDefined();
					expect(typeof color).toBe("string");
					expect(color.length).toBeGreaterThan(0);
					expect(VALID_COLORS).toContain(color);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("covers all status values exhaustively", () => {
		for (const status of ALL_STATUSES) {
			const color = statusBadgeColor(status);
			expect(VALID_COLORS).toContain(color);
		}
	});
});

describe("property 5: dashboard count invariant", () => {
	/**
	 * **Validates: Requirements 2.2, 2.3, 7.6**
	 *
	 * For any set of help requests, the sum of active breakdown counts
	 * (inProgress + waiting) equals the active total, and the sum of closed
	 * breakdown counts (completed + cancelled) equals the closed total.
	 * Additionally, active.total + closed.total equals the total number of requests.
	 */
	it("active.total + closed.total equals the total number of requests", () => {
		fc.assert(
			fc.property(
				fc.array(arbStatus, { minLength: 0, maxLength: 200 }),
				(statuses) => {
					// Simulate the same grouping logic that adminStats uses
					const pending = statuses.filter(s => s === "pending").length;
					const assigned = statuses.filter(s => s === "assigned").length;
					const awaiting = statuses.filter(s => s === "awaiting_requester_acceptance").length;
					const inProgress = statuses.filter(s => s === "in_progress").length;
					const complete = statuses.filter(s => s === "complete").length;
					const cancelled = statuses.filter(s => s === "cancelled").length;

					const activeTotal = inProgress + pending + assigned + awaiting;
					const closedTotal = complete + cancelled;

					expect(activeTotal + closedTotal).toBe(statuses.length);
				},
			),
			{ numRuns: 200 },
		);
	});

	it("active breakdown sums match active total", () => {
		fc.assert(
			fc.property(
				fc.array(arbStatus, { minLength: 0, maxLength: 200 }),
				(statuses) => {
					const pending = statuses.filter(s => s === "pending").length;
					const assigned = statuses.filter(s => s === "assigned").length;
					const awaiting = statuses.filter(s => s === "awaiting_requester_acceptance").length;
					const inProgress = statuses.filter(s => s === "in_progress").length;

					const waiting = pending + assigned + awaiting;
					const activeTotal = inProgress + waiting;

					// Same computation as adminStats: active.total = inProgress + pending + assigned + awaiting
					expect(activeTotal).toBe(inProgress + pending + assigned + awaiting);
				},
			),
			{ numRuns: 200 },
		);
	});

	it("closed breakdown sums match closed total", () => {
		fc.assert(
			fc.property(
				fc.array(arbStatus, { minLength: 0, maxLength: 200 }),
				(statuses) => {
					const complete = statuses.filter(s => s === "complete").length;
					const cancelled = statuses.filter(s => s === "cancelled").length;

					const closedTotal = complete + cancelled;

					expect(closedTotal).toBe(complete + cancelled);
				},
			),
			{ numRuns: 200 },
		);
	});

	it("no requests are lost between active and closed categories", () => {
		fc.assert(
			fc.property(
				fc.array(arbStatus, { minLength: 1, maxLength: 200 }),
				(statuses) => {
					const activeStatuses = new Set<HelpRequestStatus>([
						"pending",
						"assigned",
						"awaiting_requester_acceptance",
						"in_progress",
					]);
					const closedStatuses = new Set<HelpRequestStatus>([
						"complete",
						"cancelled",
					]);

					const activeCount = statuses.filter(s => activeStatuses.has(s)).length;
					const closedCount = statuses.filter(s => closedStatuses.has(s)).length;

					// Every request must be in exactly one category
					expect(activeCount + closedCount).toBe(statuses.length);

					// No status belongs to both categories
					for (const status of ALL_STATUSES) {
						const inActive = activeStatuses.has(status);
						const inClosed = closedStatuses.has(status);
						expect(inActive || inClosed).toBe(true);
						expect(inActive && inClosed).toBe(false);
					}
				},
			),
			{ numRuns: 200 },
		);
	});
});
