/* eslint-disable node/prefer-global/process */
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";
import { getCurrentUserRow, getOrCreateCurrentUser } from "./lib/currentUser";
import {
	conversationLink,
	formatMessageEmailBody,
	messageEmailReplySubject,
	messageEmailSubject,
} from "./lib/messageEmail";
import { extractNewReplyText } from "./lib/stripEmailReply";
import { assertNotBlocked } from "./lib/userStatus";

const MAX_BODY_LEN = 8000;
const MAX_MESSAGES_PER_HOUR = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const MAX_MESSAGES_PER_REQUEST = 100;
const ANGLE_EMAIL_RE = /<([^>]+)>/;
const TRAILING_SLASH_RE = /\/$/;

function normalizeEmail(raw: string): string {
	const trimmed = raw.trim().toLowerCase();
	const angle = trimmed.match(ANGLE_EMAIL_RE);
	return (angle?.[1] ?? trimmed).trim().toLowerCase();
}

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

async function assertCanMessage(
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

		// Filter out admin notes — these are only visible in admin views
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

export const ingestInboundEmail = internalMutation({
	args: {
		resendEmailId: v.string(),
		fromHeader: v.string(),
		toAddresses: v.array(v.string()),
		subject: v.string(),
		bodyText: v.string(),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("processedInboundEmails")
			.withIndex("by_resend_email_id", q =>
				q.eq("resendEmailId", args.resendEmailId))
			.unique();
		if (existing) {
			return { ok: true as const, duplicate: true as const };
		}

		const relayDomain = process.env.EMAIL_RELAY_DOMAIN?.trim().toLowerCase();
		if (relayDomain === undefined || relayDomain.length === 0) {
			return { ok: false as const, reason: "no_relay_domain" as const };
		}

		const primaryTo = args.toAddresses[0]?.trim().toLowerCase() ?? "";
		const at = primaryTo.lastIndexOf("@");
		if (at === -1) {
			return { ok: false as const, reason: "bad_to" as const };
		}
		const local = primaryTo.slice(0, at);
		const domain = primaryTo.slice(at + 1);
		if (domain !== relayDomain) {
			return { ok: false as const, reason: "wrong_domain" as const };
		}

		const req = await ctx.db
			.query("helpRequests")
			.withIndex("by_email_relay_token", q => q.eq("emailRelayToken", local))
			.unique();
		if (!req || req.status !== "in_progress" || !req.helperUserId) {
			return { ok: false as const, reason: "no_request" as const };
		}

		const fromEmail = normalizeEmail(args.fromHeader);
		const ownerUser = await ctx.db.get("users", req.ownerUserId);
		const helperUser = await ctx.db.get("users", req.helperUserId);
		const ownerEmail = ownerUser?.email?.trim().toLowerCase();
		const helperEmail = helperUser?.email?.trim().toLowerCase();

		let authorUserId: Id<"users"> | undefined;
		if (
			ownerEmail !== undefined
			&& ownerEmail.length > 0
			&& fromEmail === ownerEmail
		) {
			authorUserId = req.ownerUserId;
		}
		else if (
			helperEmail !== undefined
			&& helperEmail.length > 0
			&& fromEmail === helperEmail
		) {
			authorUserId = req.helperUserId;
		}
		else {
			return { ok: false as const, reason: "sender_not_participant" as const };
		}

		const body = extractNewReplyText(args.bodyText).trim().slice(0, MAX_BODY_LEN);
		if (body.length === 0) {
			return { ok: false as const, reason: "empty_body" as const };
		}

		await ctx.db.insert("requestMessages", {
			requestId: req._id,
			authorUserId,
			body,
			source: "email",
		});

		await ctx.db.insert("processedInboundEmails", {
			resendEmailId: args.resendEmailId,
		});

		const otherUserId
			= authorUserId === req.ownerUserId ? req.helperUserId : req.ownerUserId;

		await ctx.db.insert("notifications", {
			recipientUserId: otherUserId,
			type: "request_new_message",
			title: "New email on your LoMo request",
			body: `Someone emailed about "${req.title}".`,
			requestId: req._id,
			isRead: false,
			ctaLabel: "Open conversation",
			ctaAction:
				otherUserId === req.ownerUserId
					? "open_request_thread"
					: "open_offer_thread",
		});

		const otherUser = await ctx.db.get("users", otherUserId);
		const replyTo = relayMailbox(req.emailRelayToken);

		if (otherUser?.email != null && otherUser.email.length > 0 && replyTo != null && replyTo.length > 0) {
			const link = conversationLink(
				siteBaseUrl(),
				req._id,
				otherUserId === req.ownerUserId,
			);
			await ctx.scheduler.runAfter(0, internal.notifications.sendRelayEmail, {
				to: otherUser.email,
				subject: messageEmailReplySubject(req.title),
				text: formatMessageEmailBody(body, link),
				replyTo,
			});
		}

		return { ok: true as const, duplicate: false as const };
	},
});
