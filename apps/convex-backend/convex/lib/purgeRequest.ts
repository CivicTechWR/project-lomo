import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

/**
 * Hard-delete a request and everything that references it.
 *
 * To switch to a soft delete later: add `deletedAt: v.optional(v.number())`
 * to helpRequests in schema.ts, filter `deletedAt` rows out of the user/
 * volunteer queries, and change this helper to patch `deletedAt` instead.
 */
export async function purgeRequest(
	ctx: MutationCtx,
	requestId: Id<"helpRequests">,
) {
	const messages = await ctx.db
		.query("requestMessages")
		.withIndex("by_request", q => q.eq("requestId", requestId))
		.collect();
	for (const message of messages) {
		await ctx.db.delete("requestMessages", message._id);
	}

	const notifications = await ctx.db
		.query("notifications")
		.withIndex("by_request", q => q.eq("requestId", requestId))
		.collect();
	for (const notification of notifications) {
		await ctx.db.delete("notifications", notification._id);
	}

	await ctx.db.delete("helpRequests", requestId);
}
