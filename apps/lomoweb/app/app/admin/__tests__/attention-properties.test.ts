import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { isAttentionNeeded, isValidThreshold } from "../lib/attention";

/**
 * Property-based tests for attention threshold correctness and settings validation.
 */

/** All valid help request statuses in the system */
const ALL_STATUSES = [
	"pending",
	"assigned",
	"awaiting_requester_acceptance",
	"in_progress",
	"complete",
	"cancelled",
] as const;

/** Arbitrary for a valid threshold in days (1-30) */
const arbThresholdDays = fc.integer({ min: 1, max: 30 });

/** Arbitrary for a timestamp representing "now" */
const arbNow = fc.integer({ min: 1_000_000_000_000, max: 2_000_000_000_000 });

/** Arbitrary for a help request status */
const arbStatus = fc.constantFrom(...ALL_STATUSES);

/** Arbitrary for an optional assigned helper user ID */
const arbAssignedHelper = fc.oneof(
	fc.constant(null),
	fc.constant(undefined),
	fc.string({ minLength: 10, maxLength: 30 }),
);

describe("property 3: attention threshold correctness", () => {
	/**
	 * **Validates: Requirements 2.4, 11.2**
	 *
	 * For any help request with status "pending", no assignedHelperUserId,
	 * and a creation time, that request qualifies as needing attention
	 * if and only if (now - _creationTime) > thresholdDays * 86400000.
	 * Requests with any other status, or with an assigned helper, never qualify.
	 */
	it("requests in the attention list have been pending longer than the configured threshold", () => {
		fc.assert(
			fc.property(
				arbStatus,
				arbAssignedHelper,
				arbThresholdDays,
				arbNow,
				// Age in ms (0 to 60 days)
				fc.integer({ min: 0, max: 60 * 86_400_000 }),
				(status, assignedHelperUserId, thresholdDays, now, ageMs) => {
					const creationTime = now - ageMs;
					const request = {
						status,
						assignedHelperUserId,
						_creationTime: creationTime,
					};

					const result = isAttentionNeeded(request, thresholdDays, now);
					const thresholdMs = thresholdDays * 86_400_000;

					if (status !== "pending") {
						// Non-pending requests never need attention
						expect(result).toBe(false);
					}
					else if (assignedHelperUserId) {
						// Requests with an assigned helper never need attention
						expect(result).toBe(false);
					}
					else if (ageMs > thresholdMs) {
						// Pending, unassigned, older than threshold → needs attention
						expect(result).toBe(true);
					}
					else {
						// Pending, unassigned, but not old enough → no attention
						expect(result).toBe(false);
					}
				},
			),
			{ numRuns: 200 },
		);
	});

	it("only pending requests without an assigned helper can qualify for attention", () => {
		fc.assert(
			fc.property(
				fc.constantFrom("assigned", "awaiting_requester_acceptance", "in_progress", "complete", "cancelled"),
				arbThresholdDays,
				arbNow,
				(status, thresholdDays, now) => {
					// Make it very old so only status/assignment matters
					const request = {
						status,
						assignedHelperUserId: null,
						_creationTime: now - 365 * 86_400_000,
					};
					expect(isAttentionNeeded(request, thresholdDays, now)).toBe(false);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("pending requests with an assigned helper never need attention regardless of age", () => {
		fc.assert(
			fc.property(
				arbThresholdDays,
				arbNow,
				fc.string({ minLength: 10, maxLength: 30 }),
				(thresholdDays, now, helperId) => {
					const request = {
						status: "pending",
						assignedHelperUserId: helperId,
						_creationTime: now - 365 * 86_400_000,
					};
					expect(isAttentionNeeded(request, thresholdDays, now)).toBe(false);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("boundary: request exactly at threshold does not qualify (must be strictly greater)", () => {
		fc.assert(
			fc.property(
				arbThresholdDays,
				arbNow,
				(thresholdDays, now) => {
					const thresholdMs = thresholdDays * 86_400_000;
					const request = {
						status: "pending",
						assignedHelperUserId: null,
						_creationTime: now - thresholdMs, // exactly at threshold
					};
					// (now - _creationTime) === thresholdMs, which is NOT > thresholdMs
					expect(isAttentionNeeded(request, thresholdDays, now)).toBe(false);
				},
			),
			{ numRuns: 100 },
		);
	});
});

describe("property 8: attention threshold validation", () => {
	/**
	 * **Validates: Requirements 11.2, 11.6**
	 *
	 * For any threshold value provided to the settings mutation,
	 * the system shall accept it if and only if it is an integer in [1, 30].
	 * Values outside this range shall be rejected.
	 */
	it("accepts all integers in [1, 30]", () => {
		fc.assert(
			fc.property(
				fc.integer({ min: 1, max: 30 }),
				(value) => {
					expect(isValidThreshold(value)).toBe(true);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("rejects integers below 1", () => {
		fc.assert(
			fc.property(
				fc.integer({ min: -1000, max: 0 }),
				(value) => {
					expect(isValidThreshold(value)).toBe(false);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("rejects integers above 30", () => {
		fc.assert(
			fc.property(
				fc.integer({ min: 31, max: 10000 }),
				(value) => {
					expect(isValidThreshold(value)).toBe(false);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("rejects non-integer floats", () => {
		fc.assert(
			fc.property(
				fc.double({ min: 0.01, max: 30.99, noNaN: true, noDefaultInfinity: true })
					.filter(v => !Number.isInteger(v)),
				(value) => {
					expect(isValidThreshold(value)).toBe(false);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("rejects NaN and Infinity", () => {
		expect(isValidThreshold(Number.NaN)).toBe(false);
		expect(isValidThreshold(Number.POSITIVE_INFINITY)).toBe(false);
		expect(isValidThreshold(Number.NEGATIVE_INFINITY)).toBe(false);
	});

	it("validation matches the updateSettings mutation logic for any number", () => {
		fc.assert(
			fc.property(
				fc.oneof(
					fc.integer({ min: -100, max: 100 }),
					fc.double({ min: -100, max: 100, noNaN: true, noDefaultInfinity: true }),
				),
				(value) => {
					const expected = Number.isInteger(value) && value >= 1 && value <= 30;
					expect(isValidThreshold(value)).toBe(expected);
				},
			),
			{ numRuns: 200 },
		);
	});
});
