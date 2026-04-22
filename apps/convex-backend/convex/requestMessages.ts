/* eslint-disable node/prefer-global/process */
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";

const MAX_BODY_LEN = 8000;
const MAX_MESSAGES_PER_HOUR = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;

type Identity = { subject: string; email?: string; name?: string };

function normalizeEmail(raw: string): string {
	const trimmed = raw.trim().toLowerCase();
	const angle = trimmed.match(/<([^>]+)>/);
	return (angle?.[1] ?? trimmed).trim().toLowerCase();
}

function relayMailbox(token: string | undefined): string | null {
	const domain = process.env.EMAIL_RELAY_DOMAIN?.trim();
	if (!domain || !token) {
		return null;
	}
	return `${token}@${domain}`;
}

function siteBaseUrl(): string {
	const u = process.env.SITE_URL?.trim().replace(/\/$/, "") ?? "";
	return u;
}

async function assertCanMessage(
	ctx: { db: any },
	requestId: Id<"helpRequests">,
	subject: string,
): Promise<Doc<"helpRequests">> {
	const doc = await ctx.db.get(requestId);
	if (!doc || doc.status !== "in_progress") {
		throw new Error("Messaging is only available for requests in progress.");
	}
	if (doc.ownerSubject !== subject && doc.helperSubject !== subject) {
		throw new Error("Forbidden");
	}
	if (!doc.helperSubject) {
		throw new Error("No helper on this request.");
	}
	return doc;
}

async function countRecentFromAuthor(
	ctx: { db: any },
	requestId: Id<"helpRequests">,
	authorSubject: string,
): Promise<number> {
	const since = Date.now() - RATE_WINDOW_MS;
	const rows = await ctx.db
		.query("requestMessages")
		.withIndex("by_request", (q: any) => q.eq("requestId", requestId))
		.collect();
	return rows.filter(
		(m: Doc<"requestMessages">) =>
			m.authorSubject === authorSubject
			&& m._creationTime >= since
			&& m.source === "web",
	).length;
}

export const listForRequest = query({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const identity = await ctx.auth.getUserIdentity() as Identity | null;
		if (!identity) {
			return [];
		}
		await assertCanMessage(ctx, requestId, identity.subject);
		const rows = await ctx.db
			.query("requestMessages")
			.withIndex("by_request", q => q.eq("requestId", requestId))
			.collect();
		rows.sort((a, b) => a._creationTime - b._creationTime);
		return rows;
	},
});

export const getRelayAddressForRequest = query({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const identity = await ctx.auth.getUserIdentity() as Identity | null;
		if (!identity) {
			return { relayAddress: null as string | null };
		}
		let doc: Doc<"helpRequests">;
		try {
			doc = await assertCanMessage(ctx, requestId, identity.subject);
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
		const identity = await ctx.auth.getUserIdentity() as Identity | null;
		if (!identity) {
			throw new Error("Unauthenticated");
		}
		const trimmed = body.trim();
		if (trimmed.length === 0) {
			throw new Error("Message cannot be empty.");
		}
		if (trimmed.length > MAX_BODY_LEN) {
			throw new Error(`Message is too long (max ${MAX_BODY_LEN} characters).`);
		}
		const doc = await assertCanMessage(ctx, requestId, identity.subject);
		const recent = await countRecentFromAuthor(ctx, requestId, identity.subject);
		if (recent >= MAX_MESSAGES_PER_HOUR) {
			throw new Error("Too many messages. Try again later.");
		}

		await ctx.db.insert("requestMessages", {
			requestId,
			authorSubject: identity.subject,
			body: trimmed,
			source: "web",
		});

		const helperSubject = doc.helperSubject!;
		const otherSubject
			= doc.ownerSubject === identity.subject ? helperSubject : doc.ownerSubject;

		await ctx.db.insert("notifications", {
			recipientSubject: otherSubject,
			type: "request_new_message",
			title: "New message on your LoMo request",
			body: `Someone messaged you about "${doc.title}".`,
			requestId,
			isRead: false,
			ctaLabel: "Open conversation",
			ctaAction:
				otherSubject === doc.ownerSubject
					? "open_request_thread"
					: "open_offer_thread",
		});

		const otherUser = await ctx.db
			.query("users")
			.withIndex("by_subject", (q: any) => q.eq("subject", otherSubject))
			.unique();
		const replyTo = relayMailbox(doc.emailRelayToken);
		if (otherUser?.email && replyTo) {
			const base = siteBaseUrl();
			const path
				= otherSubject === doc.ownerSubject
					? `/app/requests/${requestId}`
					: `/app/offer/${requestId}`;
			const link = base ? `${base}${path}` : path;
			await ctx.scheduler.runAfter(0, internal.notifications.sendEmail, {
				to: otherUser.email,
				subject: `New LoMo message: ${doc.title}`,
				text:
					`You have a new message about "${doc.title}".\n\n`
					+ `Open the conversation: ${link}\n\n`
					+ "You can also reply to this email (plain text) to message your match. "
					+ "Your email address stays private.",
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
			.withIndex("by_resend_email_id", (q: any) =>
				q.eq("resendEmailId", args.resendEmailId))
			.unique();
		if (existing) {
			return { ok: true as const, duplicate: true as const };
		}

		const relayDomain = process.env.EMAIL_RELAY_DOMAIN?.trim().toLowerCase();
		if (!relayDomain) {
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
			.withIndex("by_email_relay_token", (q: any) => q.eq("emailRelayToken", local))
			.unique();
		if (!req || req.status !== "in_progress" || !req.helperSubject) {
			return { ok: false as const, reason: "no_request" as const };
		}

		const fromEmail = normalizeEmail(args.fromHeader);
		const ownerUser = await ctx.db
			.query("users")
			.withIndex("by_subject", (q: any) => q.eq("subject", req.ownerSubject))
			.unique();
		const helperUser = await ctx.db
			.query("users")
			.withIndex("by_subject", (q: any) => q.eq("subject", req.helperSubject))
			.unique();
		const ownerEmail = ownerUser?.email?.trim().toLowerCase();
		const helperEmail = helperUser?.email?.trim().toLowerCase();

		let authorSubject: string | undefined;
		if (ownerEmail && fromEmail === ownerEmail) {
			authorSubject = req.ownerSubject;
		}
		else if (helperEmail && fromEmail === helperEmail) {
			authorSubject = req.helperSubject;
		}
		else {
			return { ok: false as const, reason: "sender_not_participant" as const };
		}

		const body = args.bodyText.trim().slice(0, MAX_BODY_LEN);
		if (body.length === 0) {
			return { ok: false as const, reason: "empty_body" as const };
		}

		await ctx.db.insert("requestMessages", {
			requestId: req._id,
			authorSubject,
			body,
			source: "email",
		});

		await ctx.db.insert("processedInboundEmails", {
			resendEmailId: args.resendEmailId,
		});

		const otherSubject
			= authorSubject === req.ownerSubject ? req.helperSubject : req.ownerSubject;

		await ctx.db.insert("notifications", {
			recipientSubject: otherSubject,
			type: "request_new_message",
			title: "New email on your LoMo request",
			body: `Someone emailed about "${req.title}".`,
			requestId: req._id,
			isRead: false,
			ctaLabel: "Open conversation",
			ctaAction:
				otherSubject === req.ownerSubject
					? "open_request_thread"
					: "open_offer_thread",
		});

		const otherUser = await ctx.db
			.query("users")
			.withIndex("by_subject", (q: any) => q.eq("subject", otherSubject))
			.unique();
		const replyTo = relayMailbox(req.emailRelayToken);

		if (otherUser?.email && replyTo) {
			const subjectLine
				= args.subject.trim().startsWith("Re:")
					? args.subject.trim()
					: `Re: ${args.subject.trim() || req.title}`;
			await ctx.scheduler.runAfter(0, internal.notifications.sendRelayEmail, {
				to: otherUser.email,
				subject: `[LoMo] ${subjectLine}`,
				text:
					`${body}\n\n`
					+ "---\n"
					+ "You’re receiving this through LoMo’s masked relay. "
					+ "Reply to this email to continue the conversation.",
				replyTo,
			});
		}

		return { ok: true as const, duplicate: false as const };
	},
});
