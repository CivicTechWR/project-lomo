import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { requireAdmin } from "../lib/adminAuth";
import { getCurrentUserRow } from "../lib/currentUser";

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
		const adminUser = await ctx.db
			.query("users")
			.withIndex("by_token_identifier", q =>
				q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();
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
