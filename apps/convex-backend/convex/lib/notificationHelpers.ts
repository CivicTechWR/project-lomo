import type { Doc, Id } from "../_generated/dataModel";

type UserId = Id<"users">;

type NotificationRow = Doc<"notifications">;
type HelpRequestRow = Doc<"helpRequests">;

export type EnrichedNotification = NotificationRow & {
	canVolunteerAcceptAssignment: boolean;
	canRequesterReviewOffer: boolean;
	openPath: string | null;
	isStale: boolean;
};

export function enrichNotification(
	n: NotificationRow,
	req: HelpRequestRow | null,
	viewerUserId: UserId,
): EnrichedNotification {
	const canVolunteerAcceptAssignment
		= n.type === "volunteer_assigned"
			&& req !== null
			&& req.status === "assigned"
			&& req.assignedHelperUserId === viewerUserId;

	const canRequesterReviewOffer
		= (n.type === "requester_accept_match_prompt" || n.type === "volunteer_offered_help")
			&& req !== null
			&& req.status === "awaiting_requester_acceptance"
			&& req.ownerUserId === viewerUserId;

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

	const hadActionableCta
		= n.type === "volunteer_assigned"
			|| n.type === "requester_accept_match_prompt"
			|| n.type === "volunteer_offered_help";

	const isStale = hadActionableCta
		&& !canVolunteerAcceptAssignment
		&& !canRequesterReviewOffer;

	return {
		...n,
		canVolunteerAcceptAssignment,
		canRequesterReviewOffer,
		openPath,
		isStale,
	};
}

/** Mark unread notifications for a request that match a predicate (e.g. superseded actions). */
export async function markNotificationsReadForRequest(
	ctx: { db: { query: any; patch: any } },
	requestId: Id<"helpRequests">,
	predicate: (n: NotificationRow) => boolean,
): Promise<void> {
	const rows = await ctx.db
		.query("notifications")
		.withIndex("by_request", (q: any) => q.eq("requestId", requestId))
		.collect();
	for (const n of rows) {
		if (n.isRead === false && predicate(n)) {
			await ctx.db.patch("notifications", n._id, { isRead: true });
		}
	}
}
