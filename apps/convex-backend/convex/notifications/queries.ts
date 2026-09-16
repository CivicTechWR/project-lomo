import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireAdmin } from "../lib/adminAuth";
import { getCurrentUserRow } from "../lib/currentUser";
import { enrichNotification } from "../lib/notificationHelpers";

export const listMine = query({
	args: { unreadOnly: v.optional(v.boolean()) },
	handler: async (ctx, { unreadOnly }) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
			return [];
		}
		const rows = unreadOnly
			? await ctx.db
					.query("notifications")
					.withIndex("by_recipient_read", q =>
						q.eq("recipientUserId", user._id).eq("isRead", false))
					.collect()
			: await ctx.db
					.query("notifications")
					.withIndex("by_recipient", q => q.eq("recipientUserId", user._id))
					.collect();
		rows.sort((a, b) => b._creationTime - a._creationTime);

		const enriched = await Promise.all(
			rows.map(async (n) => {
				const req = n.requestId ? await ctx.db.get("helpRequests", n.requestId) : null;
				return enrichNotification(n, req, user._id);
			}),
		);
		return enriched;
	},
});

export const listForAdmin = query({
	args: { unreadOnly: v.optional(v.boolean()) },
	handler: async (ctx, { unreadOnly }) => {
		const identity = await requireAdmin(ctx);
		const adminUser = await ctx.db
			.query("users")
			.withIndex("by_token_identifier", q =>
				q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();
		if (!adminUser)
			return [];

		const rows = unreadOnly
			? await ctx.db
					.query("notifications")
					.withIndex("by_recipient_read", q =>
						q.eq("recipientUserId", adminUser._id).eq("isRead", false))
					.order("desc")
					.take(50)
			: await ctx.db
					.query("notifications")
					.withIndex("by_recipient", q =>
						q.eq("recipientUserId", adminUser._id))
					.order("desc")
					.take(50);

		return rows;
	},
});
