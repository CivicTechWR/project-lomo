/* eslint-disable node/prefer-global/process */
import type { Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { mutation } from "../_generated/server";
import { getOrCreateCurrentUser } from "../lib/currentUser";
import {
	conversationLink,
	formatMessageEmailBody,
	messageEmailSubject,
} from "../lib/messageEmail";
import { assertNotBlocked } from "../lib/userStatus";
import { assertCanMessage } from "./queries";

const MAX_BODY_LEN = 8000;
const MAX_MESSAGES_PER_HOUR = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const MAX_MESSAGES_PER_REQUEST = 100;
const TRAILING_SLASH_RE = /\/$/;

function relayMailbox(token: string | undefined): string | null {
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

function siteBaseUrl(): string {
	return process.env.SITE_URL?.trim().replace(TRAILING_SLASH_RE, "") ?? "";
}

async function countRecentFromAuthor(
	ctx: Pick<QueryCtx, "db">,
	requestId: Id<"helpRequests">,
	authorUserId: Id<"users">,
): Promise<number> {
	const since = Date.now() - RATE_WINDOW_MS;
	const rows = await ctx.db
		.query("requestMessages")
		.withIndex("by_request", q => q.eq("requestId", requestId))
		.order("desc")
		.take(MAX_MESSAGES_PER_REQUEST);
	return rows.filter(
		m =>
			m.authorUserId === authorUserId
			&& m._creationTime >= since
			&& m.source === "web",
	).length;
}

export const post = mutation({
	args: {
		requestId: v.id("helpRequests"),
		body: v.string(),
	},
	handler: async (ctx, { requestId, body }) => {
		const { user } = await getOrCreateCurrentUser(ctx);
		assertNotBlocked(user);
		const trimmed = body.trim();
		if (trimmed.length === 0) {
			throw new Error("Message cannot be empty.");
		}
		if (trimmed.length > MAX_BODY_LEN) {
			throw new Error(`Message is too long (max ${MAX_BODY_LEN} characters).`);
		}
		const doc = await assertCanMessage(ctx, requestId, user._id);
		const recent = await countRecentFromAuthor(ctx, requestId, user._id);
		if (recent >= MAX_MESSAGES_PER_HOUR) {
			throw new Error("Too many messages. Try again later.");
		}

		await ctx.db.insert("requestMessages", {
			requestId,
			authorUserId: user._id,
			body: trimmed,
			source: "web",
		});

		const helperUserId = doc.helperUserId!;
		const otherUserId
			= doc.ownerUserId === user._id ? helperUserId : doc.ownerUserId;

		await ctx.db.insert("notifications", {
			recipientUserId: otherUserId,
			type: "request_new_message",
			title: "New message on your LoMo request",
			body: `Someone messaged you about "${doc.title}".`,
			requestId,
			isRead: false,
			ctaLabel: "Open conversation",
			ctaAction:
				otherUserId === doc.ownerUserId
					? "open_request_thread"
					: "open_offer_thread",
		});

		const otherUser = await ctx.db.get("users", otherUserId);
		const replyTo = relayMailbox(doc.emailRelayToken);
		if (otherUser?.email != null && otherUser.email.length > 0 && replyTo != null && replyTo.length > 0) {
			const link = conversationLink(
				siteBaseUrl(),
				requestId,
				otherUserId === doc.ownerUserId,
			);
			await ctx.scheduler.runAfter(0, internal.notifications.sendEmail, {
				to: otherUser.email,
				subject: messageEmailSubject(doc.title),
				text: formatMessageEmailBody(trimmed, link),
				replyTo,
			});
		}
	},
});
