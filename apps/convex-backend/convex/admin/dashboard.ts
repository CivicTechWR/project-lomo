import { query } from "../_generated/server";
import { requireAdmin } from "../lib/adminAuth";

const MAX_ADMIN_ROWS = 200;

export const adminStats = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);

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

export const adminAttentionList = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);

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
