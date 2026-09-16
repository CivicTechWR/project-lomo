import type { Doc, Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { getCurrentUserRow } from "../lib/currentUser";

const MAX_MESSAGES_PER_REQUEST = 100;

function relayMailbox(token: string | undefined): string | null {
	/* eslint-disable node/prefer-global/process */
	const domain = process.env.EMAIL_RELAY_DOMAIN?.trim();
	if (
		domain === undefined
		|| domain.length === 0
		|| token === undefined
		|| token.length === 0
	) {
		return null;
	}
	return `${token}@${domain}`;
}

export async function assertCanMessage(
	ctx: Pick<QueryCtx, "db">,
	requestId: Id<"helpRequests">,
	userId: Id<"users">,
): Promise<Doc<"helpRequests">> {
	const doc = await ctx.db.get("helpRequests", requestId);
	if (!doc || doc.status !== "in_progress") {
		throw new Error("Messaging is only available for requests in progress.");
	}
	if (doc.ownerUserId !== userId && doc.helperUserId !== userId) {
		throw new Error("Forbidden");
	}
	if (!doc.helperUserId) {
		throw new Error("No helper on this request.");
	}
	return doc;
}

export const listForRequest = query({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
			return [];
		}
		await assertCanMessage(ctx, requestId, user._id);
		const rows = await ctx.db
			.query("requestMessages")
			.withIndex("by_request", q => q.eq("requestId", requestId))
			.order("desc")
			.take(MAX_MESSAGES_PER_REQUEST);

		const visible = rows.filter(m => m.source !== "admin_note");
		return visible.sort((a, b) => a._creationTime - b._creationTime);
	},
});

export const getRelayAddressForRequest = query({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
			return { relayAddress: null as string | null };
		}
		let doc: Doc<"helpRequests">;
		try {
			doc = await assertCanMessage(ctx, requestId, user._id);
		}
		catch {
			return { relayAddress: null as string | null };
		}
		return { relayAddress: relayMailbox(doc.emailRelayToken) };
	},
});
