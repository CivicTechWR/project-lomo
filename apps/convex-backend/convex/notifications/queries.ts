import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireAdmin } from "../lib/adminAuth";
import {
	getCurrentUserRow,
	getUserByTokenIdentifier,
} from "../lib/currentUser";
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

		// Unread list should not surface match CTAs that are no longer actionable;
		// clearStaleMine persists the same rule when the panel loads.
		if (unreadOnly) {
			return enriched.filter(n => !n.isStale);
		}
		return enriched;
	},
});

export const listForAdmin = query({
	args: { unreadOnly: v.optional(v.boolean()) },
	handler: async (ctx, { unreadOnly }) => {
		const identity = await requireAdmin(ctx);
		const adminUser = await getUserByTokenIdentifier(ctx, identity.tokenIdentifier);
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
