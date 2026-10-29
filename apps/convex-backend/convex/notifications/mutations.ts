import type { Doc } from "../_generated/dataModel";
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireAdmin } from "../lib/adminAuth";
import { getCurrentUserRow, getUserByTokenIdentifier } from "../lib/currentUser";
import {
	enrichNotification,
	markMessageNotificationsRead,
	markStaleMatchNotificationsRead,
} from "../lib/notificationHelpers";

export const markRead = mutation({
	args: { notificationId: v.id("notifications") },
	handler: async (ctx, { notificationId }) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
			throw new Error("Unauthenticated");
		}
		const doc = await ctx.db.get("notifications", notificationId);
		if (!doc || doc.recipientUserId !== user._id) {
			throw new Error("Not found");
		}
		await ctx.db.patch("notifications", notificationId, { isRead: true });
	},
});

export const markAllRead = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await requireAdmin(ctx);
		const adminUser = await getUserByTokenIdentifier(ctx, identity.tokenIdentifier);
		if (!adminUser)
			return;

		const unread = await ctx.db
			.query("notifications")
			.withIndex("by_recipient_read", q =>
				q.eq("recipientUserId", adminUser._id).eq("isRead", false))
			.take(200);

		for (const notification of unread) {
			await ctx.db.patch("notifications", notification._id, { isRead: true });
		}
	},
});

/**
 * Persist-clear notifications that are no longer actionable for the viewer
 * (e.g. match prompts after the match was accepted via email deep-link).
 */
export const clearStaleMine = mutation({
	args: {},
	handler: async (ctx) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
			return { cleared: 0 };
		}

		const unread = await ctx.db
			.query("notifications")
			.withIndex("by_recipient_read", q =>
				q.eq("recipientUserId", user._id).eq("isRead", false))
			.take(200);

		let cleared = 0;
		const requestCache = new Map<string, Doc<"helpRequests"> | null>();

		for (const n of unread) {
			if (!n.requestId) {
				continue;
			}
			let req = requestCache.get(n.requestId);
			if (req === undefined) {
				req = await ctx.db.get("helpRequests", n.requestId);
				requestCache.set(n.requestId, req);
			}
			const enriched = enrichNotification(n, req, user._id);
			if (enriched.isStale) {
				await ctx.db.patch("notifications", n._id, { isRead: true });
				cleared += 1;
			}
		}

		return { cleared };
	},
});

/**
 * Mark message (and stale match) notifications for a request as read when the
 * viewer opens the conversation / request detail.
 */
export const markRequestThreadRead = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
			return { cleared: 0 };
		}
		const req = await ctx.db.get("helpRequests", requestId);
		if (!req) {
			return { cleared: 0 };
		}
		const isParticipant
			= req.ownerUserId === user._id
				|| req.helperUserId === user._id
				|| req.assignedHelperUserId === user._id;
		if (!isParticipant) {
			return { cleared: 0 };
		}

		const messagesCleared = await markMessageNotificationsRead(
			ctx,
			requestId,
			user._id,
		);
		const staleCleared = await markStaleMatchNotificationsRead(ctx, req);
		return { cleared: messagesCleared + staleCleared };
	},
});
