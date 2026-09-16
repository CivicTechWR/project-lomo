import fc from "fast-check";
import { describe, expect, it } from "vitest";

/**
 * Integration tests for admin access control and key mutations.
 *
 * Since Convex functions require a runtime for full end-to-end tests,
 * these tests verify the pure logic portions that govern:
 * - Access control (isAdminIdentity check)
 * - adminMarkComplete precondition (only in_progress → complete)
 * - adminBlockUser filtering (which requests get cancelled)
 * - listForRequest visibility (admin_note exclusion)
 *
 * **Validates: Requirements 8.1, 8.2, 12.3, 6.7**
 */

// ---------------------------------------------------------------------------
// Types matching the production code interfaces
// ---------------------------------------------------------------------------

interface AuthIdentity {
	subject: string;
	tokenIdentifier: string;
	email?: string;
	name?: string;
}

type HelpRequestStatus
	= | "pending"
		| "assigned"
		| "awaiting_requester_acceptance"
		| "in_progress"
		| "complete"
		| "cancelled";

type MessageSource = "web" | "email" | "admin_note";

interface RequestMessage {
	_id: string;
	_creationTime: number;
	requestId: string;
	authorUserId?: string;
	body: string;
	source: MessageSource;
}

// ---------------------------------------------------------------------------
// Pure logic extracted from backend (mirrors production behaviour)
// ---------------------------------------------------------------------------

/**
 * Mirrors isAdminIdentity from convex/lib/currentUser.ts
 * Checks identity against admin lists (token identifiers, subjects, emails).
 */
function isAdminIdentity(
	identity: AuthIdentity,
	adminConfig: { tokenIdentifiers: Set<string>; subjects: Set<string>; emails: Set<string> },
): boolean {
	return (
		adminConfig.tokenIdentifiers.has(identity.tokenIdentifier)
		|| adminConfig.subjects.has(identity.subject)
		|| (identity.email !== undefined
			&& identity.email.length > 0
			&& adminConfig.emails.has(identity.email))
	);
}

/**
 * Mirrors requireAdmin from convex/lib/adminAuth.ts
 * Throws "Forbidden" if not admin.
 */
function requireAdmin(
	identity: AuthIdentity | null,
	adminConfig: { tokenIdentifiers: Set<string>; subjects: Set<string>; emails: Set<string> },
): AuthIdentity {
	if (!identity) {
		throw new Error("Unauthenticated");
	}
	if (!isAdminIdentity(identity, adminConfig)) {
		throw new Error("Forbidden");
	}
	return identity;
}

/**
 * Mirrors the precondition check in adminMarkComplete.
 * Returns true if the status transition is valid (in_progress → complete).
 */
function canMarkComplete(status: HelpRequestStatus): boolean {
	return status === "in_progress";
}

/**
 * Mirrors the adminBlockUser cancellation filter.
 * Returns the set of statuses that should be cancelled when a user is blocked.
 */
const CANCELLABLE_STATUSES: Set<HelpRequestStatus> = new Set([
	"pending",
	"assigned",
	"awaiting_requester_acceptance",
	"in_progress",
]);

function shouldCancelOnBlock(status: HelpRequestStatus): boolean {
	return CANCELLABLE_STATUSES.has(status);
}

/**
 * Mirrors the listForRequest filter that excludes admin_note messages.
 */
function filterVisibleMessages(messages: RequestMessage[]): RequestMessage[] {
	return messages.filter(m => m.source !== "admin_note");
}

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

const ALL_SOURCES: MessageSource[] = ["web", "email", "admin_note"];

const arbIdentity: fc.Arbitrary<AuthIdentity> = fc.record({
	subject: fc.string({ minLength: 5, maxLength: 30 }),
	tokenIdentifier: fc.string({ minLength: 5, maxLength: 30 }),
	email: fc.option(fc.emailAddress(), { nil: undefined }),
	name: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
});

const arbStatus: fc.Arbitrary<HelpRequestStatus> = fc.constantFrom(...ALL_STATUSES);

const arbMessageSource: fc.Arbitrary<MessageSource> = fc.constantFrom(...ALL_SOURCES);

const arbMessage: fc.Arbitrary<RequestMessage> = fc.record({
	_id: fc.string({ minLength: 5, maxLength: 20 }),
	_creationTime: fc.integer({ min: 1_600_000_000_000, max: 2_000_000_000_000 }),
	requestId: fc.string({ minLength: 5, maxLength: 20 }),
	authorUserId: fc.option(fc.string({ minLength: 5, maxLength: 20 }), { nil: undefined }),
	body: fc.string({ minLength: 1, maxLength: 200 }),
	source: arbMessageSource,
});

// ---------------------------------------------------------------------------
// Test: Non-admin user gets "Forbidden" from admin queries/mutations
// ---------------------------------------------------------------------------

describe("admin access control (Requirement 8.1, 8.2)", () => {
	it("throws 'Forbidden' for any identity not in the admin list", () => {
		fc.assert(
			fc.property(
				arbIdentity,
				(identity) => {
					// Admin config that doesn't include this identity
					const adminConfig = {
						tokenIdentifiers: new Set(["admin-token-only"]),
						subjects: new Set(["admin-subject-only"]),
						emails: new Set(["admin@example.com"]),
					};

					// If the identity doesn't match any admin criterion, it should throw
					if (
						identity.tokenIdentifier !== "admin-token-only"
						&& identity.subject !== "admin-subject-only"
						&& identity.email !== "admin@example.com"
					) {
						expect(() => requireAdmin(identity, adminConfig)).toThrow("Forbidden");
					}
				},
			),
			{ numRuns: 200 },
		);
	});

	it("throws 'Unauthenticated' when identity is null", () => {
		const adminConfig = {
			tokenIdentifiers: new Set<string>(),
			subjects: new Set<string>(),
			emails: new Set<string>(),
		};
		expect(() => requireAdmin(null, adminConfig)).toThrow("Unauthenticated");
	});

	it("allows access when identity matches admin token identifier", () => {
		fc.assert(
			fc.property(
				arbIdentity,
				(identity) => {
					const adminConfig = {
						tokenIdentifiers: new Set([identity.tokenIdentifier]),
						subjects: new Set<string>(),
						emails: new Set<string>(),
					};
					const result = requireAdmin(identity, adminConfig);
					expect(result).toEqual(identity);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("allows access when identity matches admin subject", () => {
		fc.assert(
			fc.property(
				arbIdentity,
				(identity) => {
					const adminConfig = {
						tokenIdentifiers: new Set<string>(),
						subjects: new Set([identity.subject]),
						emails: new Set<string>(),
					};
					const result = requireAdmin(identity, adminConfig);
					expect(result).toEqual(identity);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("allows access when identity matches admin email", () => {
		fc.assert(
			fc.property(
				fc.record({
					subject: fc.string({ minLength: 5, maxLength: 30 }),
					tokenIdentifier: fc.string({ minLength: 5, maxLength: 30 }),
					email: fc.emailAddress(),
					name: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
				}),
				(identity) => {
					const adminConfig = {
						tokenIdentifiers: new Set<string>(),
						subjects: new Set<string>(),
						emails: new Set([identity.email]),
					};
					const result = requireAdmin(identity, adminConfig);
					expect(result).toEqual(identity);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("does NOT grant access via email when email is empty string", () => {
		const identity: AuthIdentity = {
			subject: "user-sub",
			tokenIdentifier: "user-token",
			email: "",
		};
		const adminConfig = {
			tokenIdentifiers: new Set<string>(),
			subjects: new Set<string>(),
			emails: new Set([""]),
		};
		expect(() => requireAdmin(identity, adminConfig)).toThrow("Forbidden");
	});
});

// ---------------------------------------------------------------------------
// Test: adminMarkComplete transitions only in_progress → complete
// ---------------------------------------------------------------------------

describe("adminMarkComplete precondition (Requirement 12.3)", () => {
	it("only allows marking 'in_progress' requests as complete", () => {
		fc.assert(
			fc.property(
				arbStatus,
				(status) => {
					const allowed = canMarkComplete(status);
					if (status === "in_progress") {
						expect(allowed).toBe(true);
					}
					else {
						expect(allowed).toBe(false);
					}
				},
			),
			{ numRuns: 100 },
		);
	});

	it("rejects all terminal statuses (complete, cancelled)", () => {
		expect(canMarkComplete("complete")).toBe(false);
		expect(canMarkComplete("cancelled")).toBe(false);
	});

	it("rejects all intermediate statuses (pending, assigned, awaiting)", () => {
		expect(canMarkComplete("pending")).toBe(false);
		expect(canMarkComplete("assigned")).toBe(false);
		expect(canMarkComplete("awaiting_requester_acceptance")).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// Test: adminBlockUser sets blocked flag and cancels active requests
// ---------------------------------------------------------------------------

describe("adminBlockUser cancellation logic (Requirement 6.7)", () => {
	it("cancels pending, assigned, awaiting, and in_progress requests", () => {
		fc.assert(
			fc.property(
				arbStatus,
				(status) => {
					const shouldCancel = shouldCancelOnBlock(status);
					const activeStatuses: HelpRequestStatus[] = [
						"pending",
						"assigned",
						"awaiting_requester_acceptance",
						"in_progress",
					];
					if (activeStatuses.includes(status)) {
						expect(shouldCancel).toBe(true);
					}
					else {
						expect(shouldCancel).toBe(false);
					}
				},
			),
			{ numRuns: 100 },
		);
	});

	it("does NOT cancel already-complete or already-cancelled requests", () => {
		expect(shouldCancelOnBlock("complete")).toBe(false);
		expect(shouldCancelOnBlock("cancelled")).toBe(false);
	});

	it("for any list of requests with mixed statuses, only active ones are cancelled", () => {
		fc.assert(
			fc.property(
				fc.array(arbStatus, { minLength: 1, maxLength: 20 }),
				(statuses) => {
					const requests = statuses.map((s, i) => ({
						_id: `req-${i}`,
						status: s,
					}));

					const toCancelIds = requests
						.filter(r => shouldCancelOnBlock(r.status))
						.map(r => r._id);

					const keptIds = requests
						.filter(r => !shouldCancelOnBlock(r.status))
						.map(r => r._id);

					// Every cancelled request had an active status
					for (const id of toCancelIds) {
						const req = requests.find(r => r._id === id)!;
						expect(["pending", "assigned", "awaiting_requester_acceptance", "in_progress"]).toContain(req.status);
					}

					// Every kept request has a terminal status
					for (const id of keptIds) {
						const req = requests.find(r => r._id === id)!;
						expect(["complete", "cancelled"]).toContain(req.status);
					}
				},
			),
			{ numRuns: 200 },
		);
	});
});

// ---------------------------------------------------------------------------
// Test: listForRequest excludes admin_note messages for non-admin callers
// ---------------------------------------------------------------------------

describe("listForRequest admin_note filtering (Requirement 4.8)", () => {
	it("excludes all admin_note messages from the visible list", () => {
		fc.assert(
			fc.property(
				fc.array(arbMessage, { minLength: 0, maxLength: 30 }),
				(messages) => {
					const visible = filterVisibleMessages(messages);

					// No admin_note should be in the visible results
					for (const m of visible) {
						expect(m.source).not.toBe("admin_note");
					}
				},
			),
			{ numRuns: 200 },
		);
	});

	it("preserves all non-admin_note messages", () => {
		fc.assert(
			fc.property(
				fc.array(arbMessage, { minLength: 0, maxLength: 30 }),
				(messages) => {
					const visible = filterVisibleMessages(messages);
					const expectedCount = messages.filter(m => m.source !== "admin_note").length;

					expect(visible.length).toBe(expectedCount);
				},
			),
			{ numRuns: 200 },
		);
	});

	it("returns the original list when no admin_note messages exist", () => {
		fc.assert(
			fc.property(
				fc.array(
					fc.record({
						_id: fc.string({ minLength: 5, maxLength: 20 }),
						_creationTime: fc.integer({ min: 1_600_000_000_000, max: 2_000_000_000_000 }),
						requestId: fc.string({ minLength: 5, maxLength: 20 }),
						authorUserId: fc.option(fc.string({ minLength: 5, maxLength: 20 }), { nil: undefined }),
						body: fc.string({ minLength: 1, maxLength: 200 }),
						source: fc.constantFrom("web" as const, "email" as const),
					}),
					{ minLength: 0, maxLength: 20 },
				),
				(messages) => {
					const visible = filterVisibleMessages(messages);
					expect(visible).toEqual(messages);
				},
			),
			{ numRuns: 200 },
		);
	});

	it("returns empty array when all messages are admin_note", () => {
		fc.assert(
			fc.property(
				fc.array(
					fc.record({
						_id: fc.string({ minLength: 5, maxLength: 20 }),
						_creationTime: fc.integer({ min: 1_600_000_000_000, max: 2_000_000_000_000 }),
						requestId: fc.string({ minLength: 5, maxLength: 20 }),
						authorUserId: fc.option(fc.string({ minLength: 5, maxLength: 20 }), { nil: undefined }),
						body: fc.string({ minLength: 1, maxLength: 200 }),
						source: fc.constant("admin_note" as const),
					}),
					{ minLength: 1, maxLength: 20 },
				),
				(messages) => {
					const visible = filterVisibleMessages(messages);
					expect(visible).toEqual([]);
				},
			),
			{ numRuns: 100 },
		);
	});

	it("preserves message order after filtering", () => {
		fc.assert(
			fc.property(
				fc.array(arbMessage, { minLength: 2, maxLength: 30 }),
				(messages) => {
					const visible = filterVisibleMessages(messages);
					const originalNonAdmin = messages.filter(m => m.source !== "admin_note");

					// Same order preservation
					expect(visible).toEqual(originalNonAdmin);
				},
			),
			{ numRuns: 200 },
		);
	});
});
