import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { purgeRequest } from "../lib/purgeRequest";

/**
 * Remove app-owned rows for a Better Auth user id (`users.subject`).
 * Called from the Better Auth user `onDelete` trigger so auth + app data stay in sync.
 */
export async function purgeUserAppData(
	ctx: MutationCtx,
	authUserId: string,
): Promise<void> {
	const user = await ctx.db
		.query("users")
		.withIndex("by_subject", q => q.eq("subject", authUserId))
		.unique();
	if (!user) {
		return;
	}

	const userId = user._id;

	const notifications = await ctx.db
		.query("notifications")
		.withIndex("by_recipient", q => q.eq("recipientUserId", userId))
		.collect();
	for (const notification of notifications) {
		await ctx.db.delete("notifications", notification._id);
	}

	const ownedRequests = await ctx.db
		.query("helpRequests")
		.withIndex("by_owner_user_id", q => q.eq("ownerUserId", userId))
		.collect();
	for (const request of ownedRequests) {
		await purgeRequest(ctx, request._id);
	}

	const helperRequests = await ctx.db
		.query("helpRequests")
		.withIndex("by_helper", q => q.eq("helperUserId", userId))
		.collect();
	for (const request of helperRequests) {
		await detachHelper(ctx, request._id, userId);
	}

	const assignedRequests = await ctx.db
		.query("helpRequests")
		.withIndex("by_assigned_helper", q => q.eq("assignedHelperUserId", userId))
		.collect();
	for (const request of assignedRequests) {
		await detachHelper(ctx, request._id, userId);
	}

	// Messages on other people's requests that this user authored.
	const remainingMessages = await ctx.db.query("requestMessages").collect();
	for (const message of remainingMessages) {
		if (message.authorUserId === userId) {
			await ctx.db.delete("requestMessages", message._id);
		}
	}

	await ctx.db.delete("users", userId);
}

async function detachHelper(
	ctx: MutationCtx,
	requestId: Id<"helpRequests">,
	userId: Id<"users">,
) {
	const request = await ctx.db.get("helpRequests", requestId);
	if (!request) {
		return;
	}

	const patch: {
		helperUserId?: undefined;
		assignedHelperUserId?: undefined;
		status?: typeof request.status;
		emailRelayToken?: undefined;
	} = {};

	if (request.helperUserId === userId) {
		patch.helperUserId = undefined;
	}
	if (request.assignedHelperUserId === userId) {
		patch.assignedHelperUserId = undefined;
	}

	const lostActiveHelper
		= request.helperUserId === userId
			&& (
				request.status === "awaiting_requester_acceptance"
				|| request.status === "in_progress"
				|| request.status === "assigned"
			);
	if (lostActiveHelper) {
		patch.status = "pending";
		patch.emailRelayToken = undefined;
	}

	if (Object.keys(patch).length > 0) {
		await ctx.db.patch("helpRequests", requestId, patch);
	}
}
