/**
 * Pure client-side filter logic for admin request and user lists.
 * No React, no Convex client imports — just data in, data out.
 */

import type { UserStatus } from "@/lib/user-status";
import { deriveUserStatus } from "@/lib/user-status";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RequestCategory
	= | "food"
		| "items"
		| "other"
		| "support"
		| "paperwork"
		| "ceremony";

export type HelpRequestStatus
	= | "pending"
		| "assigned"
		| "awaiting_requester_acceptance"
		| "in_progress"
		| "complete"
		| "cancelled";

export type TimeRange = "today" | "last7days" | "last30days" | "alltime";

/*
 * User status derivation lives in `@/lib/user-status` because the signed-in app
 * needs it too (to hide Open Requests while resting), not just admin. Re-exported
 * here so existing admin imports keep working through one path.
 */
export type { UserStatus };
export { deriveUserStatus, USER_STATUS_BADGE_COLOR } from "@/lib/user-status";

export interface AdminRequestRow {
	_id: string;
	_creationTime: number;
	title: string;
	summary: string;
	status: HelpRequestStatus;
	category: RequestCategory;
	isUrgent?: boolean;
	ownerName?: string | null;
}

export interface RequestFilters {
	search: string;
	category: RequestCategory | null;
	timeRange: TimeRange | null;
	status: HelpRequestStatus | null;
}

export interface AdminUserRow {
	_id: string;
	_creationTime: number;
	name?: string | null;
	email?: string | null;
	isVolunteer?: boolean;
	canHelpNow?: boolean;
	/** Admin-set. Derives the "Blocked" status, which overrides the others. */
	blocked?: boolean;
}

export interface UserFilters {
	search: string;
	status: UserStatus | null;
	timeRange: TimeRange | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MAX_SEARCH_LENGTH = 100;

function normalizeSearch(raw: string): string {
	return raw.slice(0, MAX_SEARCH_LENGTH).toLowerCase();
}

function isWithinTimeRange(
	creationTime: number,
	range: TimeRange,
	now: number,
): boolean {
	switch (range) {
		case "alltime":
			return true;
		case "today": {
			const startOfDay = now - (now % 86_400_000);
			return creationTime >= startOfDay;
		}
		case "last7days":
			return creationTime >= now - 7 * 86_400_000;
		case "last30days":
			return creationTime >= now - 30 * 86_400_000;
		default:
			return true;
	}
}

// ---------------------------------------------------------------------------
// filterRequests
// ---------------------------------------------------------------------------

/**
 * Filters admin request rows using AND logic across all active filters.
 *
 * - Search activates at ≥2 characters (case-insensitive substring on
 *   title, summary, ownerName). Max 100 characters.
 * - Category: exact match.
 * - Time range: _creationTime within range relative to `now`.
 * - Status: exact match.
 */
export function filterRequests(
	requests: AdminRequestRow[],
	filters: RequestFilters,
	now: number,
): AdminRequestRow[] {
	const search = normalizeSearch(filters.search);
	const searchActive = search.length >= 2;

	return requests.filter((r) => {
		// Search filter
		if (searchActive) {
			const title = r.title.toLowerCase();
			const summary = r.summary.toLowerCase();
			const owner = (r.ownerName ?? "").toLowerCase();
			if (
				!title.includes(search)
				&& !summary.includes(search)
				&& !owner.includes(search)
			) {
				return false;
			}
		}

		// Category filter
		if (filters.category !== null && r.category !== filters.category) {
			return false;
		}

		// Time range filter
		if (
			filters.timeRange !== null
			&& !isWithinTimeRange(r._creationTime, filters.timeRange, now)
		) {
			return false;
		}

		// Status filter
		if (filters.status !== null && r.status !== filters.status) {
			return false;
		}

		return true;
	});
}

// ---------------------------------------------------------------------------
// filterUsers
// ---------------------------------------------------------------------------

/**
 * Filters admin user rows using AND logic across all active filters.
 *
 * - Search activates at ≥2 characters (case-insensitive substring on
 *   name, email). Max 100 characters.
 * - Status: derived user status must match.
 * - Time range: _creationTime within range relative to now (uses
 *   Date.now() internally since user filtering is UI-driven).
 */
export function filterUsers(
	users: AdminUserRow[],
	filters: UserFilters,
): AdminUserRow[] {
	const now = Date.now();
	const search = normalizeSearch(filters.search);
	const searchActive = search.length >= 2;

	return users.filter((u) => {
		// Search filter
		if (searchActive) {
			const name = (u.name ?? "").toLowerCase();
			const email = (u.email ?? "").toLowerCase();
			if (!name.includes(search) && !email.includes(search)) {
				return false;
			}
		}

		// Status filter
		if (filters.status !== null && deriveUserStatus(u) !== filters.status) {
			return false;
		}

		// Time range filter
		if (
			filters.timeRange !== null
			&& !isWithinTimeRange(u._creationTime, filters.timeRange, now)
		) {
			return false;
		}

		return true;
	});
}

// ---------------------------------------------------------------------------
// statusBadgeColor
// ---------------------------------------------------------------------------

/**
 * Maps a request status to its badge color token for admin UI styling.
 *
 * - pending      → "gray-6"
 * - assigned     → "yellow-5"
 * - awaiting_requester_acceptance → "yellow-5"
 * - in_progress  → "sage-4"
 * - complete     → "sage-9"
 * - cancelled    → "darkred-5"
 */
export function statusBadgeColor(status: HelpRequestStatus): string {
	switch (status) {
		case "pending":
			return "gray-6";
		case "assigned":
		case "awaiting_requester_acceptance":
			return "yellow-5";
		case "in_progress":
			return "sage-4";
		case "complete":
			return "sage-9";
		case "cancelled":
			return "darkred-5";
	}
}
