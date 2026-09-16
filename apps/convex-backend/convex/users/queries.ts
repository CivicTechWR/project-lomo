import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireAdmin } from "../lib/adminAuth";
import { getCurrentUserRow } from "../lib/currentUser";

const MAX_ADMIN_ROWS = 200;

export const getMyProfileRow = query({
	args: {},
	handler: async (ctx) => {
		return getCurrentUserRow(ctx);
	},
});

export const listAllForAdmin = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const users = await ctx.db.query("users").take(MAX_ADMIN_ROWS);
		return users.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
	},
});

export const adminGetUser = query({
	args: { userId: v.id("users") },
	handler: async (ctx, { userId }) => {
		await requireAdmin(ctx);
		const user = await ctx.db.get("users", userId);
		if (!user)
			return null;

		const requests = await ctx.db
			.query("helpRequests")
			.withIndex("by_owner_user_id", q => q.eq("ownerUserId", userId))
			.take(MAX_ADMIN_ROWS);

		return { ...user, requests };
	},
});
