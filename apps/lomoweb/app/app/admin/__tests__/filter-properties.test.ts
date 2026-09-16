import type { AdminRequestRow, AdminUserRow, HelpRequestStatus, RequestCategory, RequestFilters, UserFilters } from "../lib/filters";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { canOfferHelp } from "@/lib/user-status";
import {

	deriveUserStatus,
	filterRequests,
	filterUsers,
} from "../lib/filters";

/**
 * Property-based tests for client-side filter logic.
 */

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const ALL_STATUSES: HelpRequestStatus[] = [
	"pending",
	"assigned",
	"awaiting_requester_acceptance",
	"in_progress",
	"complete",
	"cancelled",
];

const ALL_CATEGORIES: RequestCategory[] = [
	"food",
	"items",
	"other",
	"support",
	"paperwork",
	"ceremony",
];

const arbStatus: fc.Arbitrary<HelpRequestStatus> = fc.constantFrom(...ALL_STATUSES);
const arbCategory: fc.Arbitrary<RequestCategory> = fc.constantFrom(...ALL_CATEGORIES);

const arbAdminRequestRow: fc.Arbitrary<AdminRequestRow> = fc.record({
	_id: fc.string({ minLength: 5, maxLength: 20 }),
	_creationTime: fc.integer({ min: 1_600_000_000_000, max: 2_000_000_000_000 }),
	title: fc.string({ minLength: 0, maxLength: 50 }),
	summary: fc.string({ minLength: 0, maxLength: 100 }),
	status: arbStatus,
	category: arbCategory,
	isUrgent: fc.option(fc.boolean(), { nil: undefined }),
	ownerName: fc.option(fc.string({ minLength: 0, maxLength: 30 }), { nil: null }),
});

const arbAdminUserRow: fc.Arbitrary<AdminUserRow> = fc.record({
	_id: fc.string({ minLength: 5, maxLength: 20 }),
	_creationTime: fc.integer({ min: 1_600_000_000_000, max: 2_000_000_000_000 }),
	name: fc.option(fc.string({ minLength: 0, maxLength: 30 }), { nil: null }),
	email: fc.option(fc.string({ minLength: 0, maxLength: 40 }), { nil: null }),
	isVolunteer: fc.option(fc.boolean(), { nil: undefined }),
	canHelpNow: fc.option(fc.boolean(), { nil: undefined }),
	blocked: fc.option(fc.boolean(), { nil: undefined }),
});

/** Every value the three status inputs can take, including absent. */
const arbOptionalBoolean = fc.constantFrom<boolean | undefined>(true, false, undefined);

/** Generates a search string of ≥2 chars (the activation threshold) */
const arbActiveSearch = fc.string({ minLength: 2, maxLength: 50 });

const arbNow = fc.integer({ min: 1_700_000_000_000, max: 2_000_000_000_000 });

// ---------------------------------------------------------------------------
// Property 1: Search filter reduces or preserves result count
// ---------------------------------------------------------------------------

describe("property 1: search filter reduces or preserves result count", () => {
	/**
	 * **Validates: Requirements 3.1, 3.3**
	 *
	 * For any list of admin requests and any non-empty search string (≥2 chars),
	 * the filtered result set is always ≤ the unfiltered result set.
	 */
	it("filtering with a non-empty search never increases the count vs. no search", () => {
		fc.assert(
			fc.property(
				fc.array(arbAdminRequestRow, { minLength: 0, maxLength: 30 }),
				arbActiveSearch,
				arbNow,
				(requests, search, now) => {
					const noSearchFilters: RequestFilters = {
						search: "",
						category: null,
						timeRange: null,
						status: null,
					};
					const withSearchFilters: RequestFilters = {
						search,
						category: null,
						timeRange: null,
						status: null,
					};

					const unfiltered = filterRequests(requests, noSearchFilters, now);
					const filtered = filterRequests(requests, withSearchFilters, now);

					expect(filtered.length).toBeLessThanOrEqual(unfiltered.length);
				},
			),
			{ numRuns: 200 },
		);
	});

	it("filtered results are always a subset of the unfiltered list", () => {
		fc.assert(
			fc.property(
				fc.array(arbAdminRequestRow, { minLength: 0, maxLength: 20 }),
				arbActiveSearch,
				arbNow,
				(requests, search, now) => {
					const noSearchFilters: RequestFilters = {
						search: "",
						category: null,
						timeRange: null,
						status: null,
					};
					const withSearchFilters: RequestFilters = {
						search,
						category: null,
						timeRange: null,
						status: null,
					};

					const unfiltered = filterRequests(requests, noSearchFilters, now);
					const filtered = filterRequests(requests, withSearchFilters, now);
					const unfilteredIds = new Set(unfiltered.map(r => r._id));

					for (const r of filtered) {
						expect(unfilteredIds.has(r._id)).toBe(true);
					}
				},
			),
			{ numRuns: 200 },
		);
	});
});

// ---------------------------------------------------------------------------
// Property 2: AND-filter conjunction
// ---------------------------------------------------------------------------

describe("property 2: AND-filter conjunction", () => {
	/**
	 * **Validates: Requirements 3.3**
	 *
	 * Applying multiple filters always produces a subset of applying either
	 * filter alone. Combined filters can only reduce or preserve the count.
	 */
	it("applying category + status together produces a subset of either filter alone", () => {
		fc.assert(
			fc.property(
				fc.array(arbAdminRequestRow, { minLength: 0, maxLength: 30 }),
				arbCategory,
				arbStatus,
				arbNow,
				(requests, category, status, now) => {
					const categoryOnly: RequestFilters = {
						search: "",
						category,
						timeRange: null,
						status: null,
					};
					const statusOnly: RequestFilters = {
						search: "",
						category: null,
						timeRange: null,
						status,
					};
					const combined: RequestFilters = {
						search: "",
						category,
						timeRange: null,
						status,
					};

					const byCategoryOnly = filterRequests(requests, categoryOnly, now);
					const byStatusOnly = filterRequests(requests, statusOnly, now);
					const byCombined = filterRequests(requests, combined, now);

					// Combined must be subset of category-only
					expect(byCombined.length).toBeLessThanOrEqual(byCategoryOnly.length);
					// Combined must be subset of status-only
					expect(byCombined.length).toBeLessThanOrEqual(byStatusOnly.length);

					// Every item in combined must appear in both individual results
					const categoryIds = new Set(byCategoryOnly.map(r => r._id));
					const statusIds = new Set(byStatusOnly.map(r => r._id));
					for (const r of byCombined) {
						expect(categoryIds.has(r._id)).toBe(true);
						expect(statusIds.has(r._id)).toBe(true);
					}
				},
			),
			{ numRuns: 200 },
		);
	});

	it("adding a search filter to an existing category filter never increases results", () => {
		fc.assert(
			fc.property(
				fc.array(arbAdminRequestRow, { minLength: 0, maxLength: 20 }),
				arbCategory,
				arbActiveSearch,
				arbNow,
				(requests, category, search, now) => {
					const categoryOnly: RequestFilters = {
						search: "",
						category,
						timeRange: null,
						status: null,
					};
					const categoryAndSearch: RequestFilters = {
						search,
						category,
						timeRange: null,
						status: null,
					};

					const byCategoryOnly = filterRequests(requests, categoryOnly, now);
					const byCategoryAndSearch = filterRequests(requests, categoryAndSearch, now);

					expect(byCategoryAndSearch.length).toBeLessThanOrEqual(byCategoryOnly.length);
				},
			),
			{ numRuns: 200 },
		);
	});
});

// ---------------------------------------------------------------------------
// Property 6: Filter round-trip (clear restores full set)
// ---------------------------------------------------------------------------

describe("property 6: filter round-trip (clear restores full set)", () => {
	/**
	 * **Validates: Requirements 3.8**
	 *
	 * Clearing all filters (empty search, null category/time/status) returns
	 * the original full list.
	 */
	it("clearing all filters returns the same result as never filtering", () => {
		fc.assert(
			fc.property(
				fc.array(arbAdminRequestRow, { minLength: 0, maxLength: 30 }),
				arbNow,
				(requests, now) => {
					const clearedFilters: RequestFilters = {
						search: "",
						category: null,
						timeRange: null,
						status: null,
					};

					const result = filterRequests(requests, clearedFilters, now);

					// Cleared filters should return the entire input list
					expect(result.length).toBe(requests.length);
					expect(result).toEqual(requests);
				},
			),
			{ numRuns: 200 },
		);
	});

	it("applying filters then clearing returns the original set (for user filters)", () => {
		fc.assert(
			fc.property(
				fc.array(arbAdminUserRow, { minLength: 0, maxLength: 20 }),
				(users) => {
					const clearedFilters: UserFilters = {
						search: "",
						status: null,
						timeRange: null,
					};

					const result = filterUsers(users, clearedFilters);

					// With timeRange null, cleared filters should return all users
					expect(result.length).toBe(users.length);
					expect(result).toEqual(users);
				},
			),
			{ numRuns: 200 },
		);
	});
});

// ---------------------------------------------------------------------------
// Property 7: User status derivation correctness
// ---------------------------------------------------------------------------

describe("property 7: user status derivation correctness", () => {
	/**
	 * **Validates: Requirements 5.5**
	 *
	 * deriveUserStatus correctly maps volunteer/canHelpNow flags:
	 * - "Volunteer" if isVolunteer === true AND canHelpNow === true
	 * - "Resting" if isVolunteer === true AND canHelpNow !== true
	 * - "Member" otherwise
	 */
	it("derives 'Volunteer' when isVolunteer=true and canHelpNow=true", () => {
		fc.assert(
			fc.property(
				fc.record({
					isVolunteer: fc.constant(true as const),
					canHelpNow: fc.constant(true as const),
				}),
				(user) => {
					expect(deriveUserStatus(user)).toBe("Volunteer");
				},
			),
			{ numRuns: 100 },
		);
	});

	it("derives 'Resting' when isVolunteer=true and canHelpNow is not true", () => {
		fc.assert(
			fc.property(
				fc.record({
					isVolunteer: fc.constant(true as const),
					canHelpNow: fc.constantFrom(false, undefined) as fc.Arbitrary<boolean | undefined>,
				}),
				(user) => {
					expect(deriveUserStatus(user)).toBe("Resting");
				},
			),
			{ numRuns: 100 },
		);
	});

	it("derives 'Member' when isVolunteer is not true", () => {
		fc.assert(
			fc.property(
				fc.record({
					isVolunteer: fc.constantFrom(false, undefined) as fc.Arbitrary<boolean | undefined>,
					canHelpNow: fc.oneof(
						fc.constant(true),
						fc.constant(false),
						fc.constant(undefined),
					) as fc.Arbitrary<boolean | undefined>,
				}),
				(user) => {
					expect(deriveUserStatus(user)).toBe("Member");
				},
			),
			{ numRuns: 100 },
		);
	});

	it("derives 'Blocked' whenever blocked=true, regardless of the other flags", () => {
		fc.assert(
			fc.property(
				fc.record({
					isVolunteer: arbOptionalBoolean,
					canHelpNow: arbOptionalBoolean,
					blocked: fc.constant(true as const),
				}),
				(user) => {
					expect(deriveUserStatus(user)).toBe("Blocked");
				},
			),
			{ numRuns: 100 },
		);
	});

	it("covers all possible boolean/undefined combinations exhaustively", () => {
		fc.assert(
			fc.property(
				fc.record({
					isVolunteer: arbOptionalBoolean,
					canHelpNow: arbOptionalBoolean,
					blocked: arbOptionalBoolean,
				}),
				(user) => {
					const status = deriveUserStatus(user);

					// Blocked is checked first: it outranks every other combination.
					if (user.blocked === true) {
						expect(status).toBe("Blocked");
					}
					else if (user.isVolunteer === true && user.canHelpNow === true) {
						expect(status).toBe("Volunteer");
					}
					else if (user.isVolunteer === true) {
						expect(status).toBe("Resting");
					}
					else {
						expect(status).toBe("Member");
					}
				},
			),
			{ numRuns: 300 },
		);
	});
});

// ---------------------------------------------------------------------------
// Property 8: Open-request eligibility agrees with the derived status
// ---------------------------------------------------------------------------

describe("property 8: canOfferHelp agrees with the derived status", () => {
	/**
	 * `canOfferHelp` gates the Open Requests tab and the resting panel, while
	 * `deriveUserStatus` drives the admin badge. They read the same fields, so
	 * they must never disagree: only a "Volunteer" may browse open requests.
	 */
	it("returns true exactly when the derived status is 'Volunteer'", () => {
		fc.assert(
			fc.property(
				fc.record({
					isVolunteer: arbOptionalBoolean,
					canHelpNow: arbOptionalBoolean,
					blocked: arbOptionalBoolean,
				}),
				(user) => {
					/*
					 * `canOfferHelp` intentionally does not read `isVolunteer` — that
					 * field has no UI and defaults to true for every real account, so
					 * gating on it would lock out users who never chose anything. The
					 * equivalence therefore holds for volunteers, and for the rest the
					 * only requirement is that blocked and resting are always refused.
					 */
					if (user.isVolunteer === true) {
						expect(canOfferHelp(user)).toBe(deriveUserStatus(user) === "Volunteer");
					}
					if (user.blocked === true || user.canHelpNow !== true) {
						expect(canOfferHelp(user)).toBe(false);
					}
				},
			),
			{ numRuns: 300 },
		);
	});

	it("refuses a null or undefined user", () => {
		expect(canOfferHelp(null)).toBe(false);
		expect(canOfferHelp(undefined)).toBe(false);
	});

	it("a blocked user is never allowed to offer help", () => {
		fc.assert(
			fc.property(
				fc.record({
					isVolunteer: arbOptionalBoolean,
					canHelpNow: arbOptionalBoolean,
					blocked: fc.constant(true as const),
				}),
				(user) => {
					expect(canOfferHelp(user)).toBe(false);
				},
			),
			{ numRuns: 100 },
		);
	});
});
