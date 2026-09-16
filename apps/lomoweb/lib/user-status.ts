/**
 * Single source of truth for a user's displayed status and for whether they may
 * browse open requests.
 *
 * Status is derived, never stored. It reads three fields on the user row:
 *
 * - `blocked`      — set only by an admin (`users.adminBlockUser`). Never self-service.
 * - `isVolunteer`  — whether the account takes part in helping at all.
 * - `canHelpNow`   — the "I can offer support" / "taking a break" toggle in settings.
 *
 * This lives in `lib/` rather than under `app/app/admin/` because both the admin
 * user views and the signed-in app need it: admin renders it as a badge, the app
 * uses `canOfferHelp` to decide whether to show Open Requests at all.
 */

export type UserStatus = "Blocked" | "Volunteer" | "Resting" | "Member";

/** Fields a status decision depends on. Everything is optional on the row. */
export interface UserStatusFields {
	isVolunteer?: boolean;
	canHelpNow?: boolean;
	blocked?: boolean;
}

/**
 * Badge color per status. Kept next to the derivation so a new status can't be
 * added without also giving it a color — `Record` makes that a type error.
 */
export const USER_STATUS_BADGE_COLOR: Record<UserStatus, "sage" | "yellow" | "gray" | "red"> = {
	Blocked: "red",
	Volunteer: "sage",
	Resting: "yellow",
	Member: "gray",
};

/**
 * Derives the display status for a user.
 *
 * Precedence matters: `Blocked` wins over everything else. A blocked volunteer
 * who left `canHelpNow` on is not available to help, so showing them as
 * "Volunteer" would misrepresent them to a coordinator scanning the list.
 *
 * - "Blocked"   if blocked === true (admin-set, overrides the rest)
 * - "Volunteer" if isVolunteer === true AND canHelpNow === true
 * - "Resting"   if isVolunteer === true AND canHelpNow is not true
 * - "Member"    otherwise (not a volunteer)
 */
export function deriveUserStatus(user: UserStatusFields): UserStatus {
	if (user.blocked === true) {
		return "Blocked";
	}
	if (user.isVolunteer === true) {
		return user.canHelpNow === true ? "Volunteer" : "Resting";
	}
	return "Member";
}

/**
 * Whether this user may see and act on other people's open requests.
 *
 * Resting is a deliberate opt-out, so it hides Open Requests entirely rather
 * than just showing an empty list — the point of taking a break is not being
 * shown things to feel responsible for. Blocked accounts are excluded for the
 * obvious reason.
 *
 * The backend enforces the same rule in `convex/lib/userStatus.ts`; this copy
 * only decides what the UI offers. Never rely on it for access control.
 */
export function canOfferHelp(user: UserStatusFields | null | undefined): boolean {
	if (!user || user.blocked === true) {
		return false;
	}
	return user.canHelpNow === true;
}
