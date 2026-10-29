import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

type UserId = Id<"users">;

type NotificationRow = Doc<"notifications">;
type HelpRequestRow = Doc<"helpRequests">;

export type EnrichedNotification = NotificationRow & {
	canVolunteerAcceptAssignment: boolean;
	canRequesterReviewOffer: boolean;
	openPath: string | null;
	isStale: boolean;
};

const ACTIONABLE_MATCH_TYPES = new Set<NotificationRow["type"]>([
	"volunteer_assigned",
	"requester_accept_match_prompt",
	"volunteer_offered_help",
]);

export function canVolunteerAcceptAssignment(
	n: NotificationRow,
	req: HelpRequestRow | null,
	viewerUserId: UserId,
): boolean {
	return n.type === "volunteer_assigned"
		&& req !== null
		&& req.status === "assigned"
		&& req.assignedHelperUserId === viewerUserId;
}

export function canRequesterReviewOffer(
	n: NotificationRow,
	req: HelpRequestRow | null,
	viewerUserId: UserId,
): boolean {
	return (n.type === "requester_accept_match_prompt" || n.type === "volunteer_offered_help")
		&& req !== null
		&& req.status === "awaiting_requester_acceptance"
		&& req.ownerUserId === viewerUserId;
}

/** True when a match CTA notification is no longer actionable for the viewer. */
export function isActionableNotificationStale(
	n: NotificationRow,
	req: HelpRequestRow | null,
	viewerUserId: UserId,
): boolean {
	if (!ACTIONABLE_MATCH_TYPES.has(n.type)) {
		return false;
	}
	return !canVolunteerAcceptAssignment(n, req, viewerUserId)
		&& !canRequesterReviewOffer(n, req, viewerUserId);
}

export function enrichNotification(
	n: NotificationRow,
	req: HelpRequestRow | null,
	viewerUserId: UserId,
): EnrichedNotification {
	const volunteerCanAccept = canVolunteerAcceptAssignment(n, req, viewerUserId);
	const requesterCanReview = canRequesterReviewOffer(n, req, viewerUserId);

	let openPath: string | null = null;
	if (n.requestId) {
		if (n.ctaAction === "open_request_thread" || n.ctaAction === "open_request") {
			openPath = `/app/requests/${n.requestId}`;
		}
		else if (
			n.ctaAction === "open_offer_thread"
			|| n.ctaAction === "open_offer_request"
			|| n.ctaAction === "open_offer"
		) {
			openPath = `/app/offer/${n.requestId}`;
		}
		else if (req) {
			openPath
				= req.ownerUserId === viewerUserId
					? `/app/requests/${n.requestId}`
					: `/app/offer/${n.requestId}`;
		}
	}

	return {
		...n,
		canVolunteerAcceptAssignment: volunteerCanAccept,
		canRequesterReviewOffer: requesterCanReview,
		openPath,
		isStale: isActionableNotificationStale(n, req, viewerUserId),
	};
}

/** Mark unread notifications for a request that match a predicate (e.g. superseded actions). */
export async function markNotificationsReadForRequest(
	ctx: Pick<MutationCtx, "db">,
	requestId: Id<"helpRequests">,
	predicate: (n: NotificationRow) => boolean,
): Promise<number> {
	const rows = await ctx.db
		.query("notifications")
		.withIndex("by_request", q => q.eq("requestId", requestId))
		.collect();
	let marked = 0;
	for (const n of rows) {
		if (n.isRead === false && predicate(n)) {
			await ctx.db.patch("notifications", n._id, { isRead: true });
			marked += 1;
		}
	}
	return marked;
}

/** Clear unread message notifications for a recipient on a request (e.g. after they reply). */
export async function markMessageNotificationsRead(
	ctx: Pick<MutationCtx, "db">,
	requestId: Id<"helpRequests">,
	recipientUserId: UserId,
): Promise<number> {
	return markNotificationsReadForRequest(
		ctx,
		requestId,
		n =>
			n.type === "request_new_message"
			&& n.recipientUserId === recipientUserId,
	);
}

/**
 * Clear unread match-CTA notifications for a request that are no longer
 * actionable given the current request row.
 */
export async function markStaleMatchNotificationsRead(
	ctx: Pick<MutationCtx, "db">,
	request: HelpRequestRow,
): Promise<number> {
	return markNotificationsReadForRequest(
		ctx,
		request._id,
		(n) => {
			if (n.isRead) {
				return false;
			}
			return isActionableNotificationStale(n, request, n.recipientUserId);
		},
	);
}
