import type { Doc } from "../_generated/dataModel";

/**
 * Server-side rules for blocked and resting accounts.
 *
 * The frontend has its own copy of the same logic in `lib/user-status.ts` to
 * decide what to render. That copy is a convenience, not a control: everything
 * that actually mutates data or returns other people's requests has to check
 * here, because a client can call a Convex function directly regardless of what
 * the UI chose to show.
 */

type StatusFields = Pick<Doc<"users">, "canHelpNow" | "blocked">;

/** Blocked accounts cannot act. Set only by an admin; never self-service. */
export function isBlocked(user: StatusFields | null | undefined): boolean {
	return user?.blocked === true;
}

/**
 * Whether this user may see or act on other people's open requests.
 *
 * Resting (`canHelpNow` not true) is a deliberate opt-out from being shown work,
 * so open requests are withheld entirely rather than returned for the client to
 * hide.
 */
export function canOfferHelp(user: StatusFields | null | undefined): boolean {
	if (user == null || isBlocked(user)) {
		return false;
	}
	return user.canHelpNow === true;
}

/**
 * Guard for mutations a blocked user must not be able to perform: creating
 * requests, offering or accepting help, and messaging.
 *
 * The message is deliberately vague about the reason — it tells the user their
 * account is restricted and who to contact, without spelling out moderation
 * details in an error string.
 */
export function assertNotBlocked(user: StatusFields | null | undefined): void {
	if (isBlocked(user)) {
		throw new Error(
			"Your account is currently restricted. Contact a coordinator if you think this is a mistake.",
		);
	}
}
