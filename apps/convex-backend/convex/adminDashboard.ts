import { query } from "./_generated/server";
import { requireAdmin } from "./lib/adminAuth";

const MAX_ADMIN_ROWS = 200;

/**
 * Returns counts by status using the by_status index.
 * Each status is a separate indexed query (6 queries, each bounded by .take(MAX_ADMIN_ROWS)).
 * This avoids scanning the entire helpRequests table in a single transaction.
 */
export const adminStats = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);

		// Count requests by status using the by_status index (bounded reads)
		const pending = await ctx.db.query("helpRequests")
			.withIndex("by_status", q => q.eq("status", "pending"))
			.take(MAX_ADMIN_ROWS);
		const assigned = await ctx.db.query("helpRequests")
			.withIndex("by_status", q => q.eq("status", "assigned"))
			.take(MAX_ADMIN_ROWS);
		const awaiting = await ctx.db.query("helpRequests")
			.withIndex("by_status", q => q.eq("status", "awaiting_requester_acceptance"))
			.take(MAX_ADMIN_ROWS);
		const inProgress = await ctx.db.query("helpRequests")
			.withIndex("by_status", q => q.eq("status", "in_progress"))
			.take(MAX_ADMIN_ROWS);
		const complete = await ctx.db.query("helpRequests")
			.withIndex("by_status", q => q.eq("status", "complete"))
			.take(MAX_ADMIN_ROWS);
		const cancelled = await ctx.db.query("helpRequests")
			.withIndex("by_status", q => q.eq("status", "cancelled"))
			.take(MAX_ADMIN_ROWS);

		// User counts
		const allUsers = await ctx.db.query("users").take(MAX_ADMIN_ROWS);
		const helpers = allUsers.filter(u => u.isVolunteer === true);

		return {
			totalUsers: allUsers.length,
			helpers: helpers.length,
			active: {
				inProgress: inProgress.length,
				waiting: pending.length + assigned.length + awaiting.length,
				total: inProgress.length + pending.length + assigned.length + awaiting.length,
			},
			closed: {
				completed: complete.length,
				cancelled: cancelled.length,
				total: complete.length + cancelled.length,
			},
		};
	},
});

/**
 * Returns pending requests without an assigned helper that exceed the
 * attention threshold. Separate subscription from stats so updates are
 * granular and don't trigger full dashboard re-renders.
 */
export const adminAttentionList = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);

		// Get threshold from settings (default 5 days)
		const settings = await ctx.db
			.query("adminSettings")
			.withIndex("by_key", q => q.eq("key", "global"))
			.unique();
		const thresholdDays = settings?.attentionThresholdDays ?? 5;
		const thresholdMs = thresholdDays * 86_400_000;

		const pending = await ctx.db
			.query("helpRequests")
			.withIndex("by_status", q => q.eq("status", "pending"))
			.take(MAX_ADMIN_ROWS);

		const now = Date.now();
		const attention = pending
			.filter(r =>
				!r.assignedHelperUserId
				&& (now - r._creationTime) > thresholdMs,
			)
			.slice(0, 20);

		return attention.map(r => ({
			_id: r._id,
			_creationTime: r._creationTime,
			title: r.title,
			summary: r.summary,
			category: r.category,
			isUrgent: r.isUrgent ?? false,
		}));
	},
});
