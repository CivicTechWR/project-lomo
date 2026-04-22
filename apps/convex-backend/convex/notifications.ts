/* eslint-disable node/prefer-global/process */
import { v } from "convex/values";
import { internalAction, mutation, query } from "./_generated/server";

async function postResendEmail(opts: {
	apiKey: string;
	from: string;
	to: string;
	subject: string;
	text: string;
	replyTo?: string;
	html?: string;
}): Promise<void> {
	const body: Record<string, unknown> = {
		from: opts.from,
		to: [opts.to],
		subject: opts.subject,
		text: opts.text,
	};
	if (opts.replyTo) {
		body.reply_to = [opts.replyTo];
	}
	if (opts.html) {
		body.html = opts.html;
	}
	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${opts.apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
	if (!res.ok) {
		const errBody = await res.text();
		throw new Error(`Resend error (${res.status}): ${errBody}`);
	}
}

export const listMine = query({
	args: { unreadOnly: v.optional(v.boolean()) },
	handler: async (ctx, { unreadOnly }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return [];
		}
		const rows = unreadOnly
			? await ctx.db
				.query("notifications")
				.withIndex("by_recipient_read", q =>
					q.eq("recipientSubject", identity.subject).eq("isRead", false))
				.collect()
			: await ctx.db
				.query("notifications")
				.withIndex("by_recipient", q => q.eq("recipientSubject", identity.subject))
				.collect();
		rows.sort((a, b) => b._creationTime - a._creationTime);
		return rows;
	},
});

export const markRead = mutation({
	args: { notificationId: v.id("notifications") },
	handler: async (ctx, { notificationId }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Unauthenticated");
		}
		const doc = await ctx.db.get(notificationId);
		if (!doc || doc.recipientSubject !== identity.subject) {
			throw new Error("Not found");
		}
		await ctx.db.patch(notificationId, { isRead: true });
	},
});

export const sendEmail = internalAction({
	args: {
		to: v.string(),
		subject: v.string(),
		text: v.string(),
		replyTo: v.optional(v.string()),
		html: v.optional(v.string()),
	},
	handler: async (_ctx, { to, subject, text, replyTo, html }) => {
		const apiKey = process.env.RESEND_API_KEY;
		const from = process.env.NOTIFICATIONS_FROM_EMAIL;
		if (!apiKey || !from) {
			// eslint-disable-next-line no-console
			console.log("Email skipped: missing RESEND_API_KEY or NOTIFICATIONS_FROM_EMAIL");
			return;
		}
		await postResendEmail({
			apiKey,
			from,
			to,
			subject,
			text,
			replyTo: replyTo ?? undefined,
			html: html ?? undefined,
		});
	},
});

/** Outbound leg of the masked relay (always sets Reply-To to the shared relay address). */
export const sendRelayEmail = internalAction({
	args: {
		to: v.string(),
		subject: v.string(),
		text: v.string(),
		replyTo: v.string(),
	},
	handler: async (_ctx, { to, subject, text, replyTo }) => {
		const apiKey = process.env.RESEND_API_KEY;
		const from = process.env.NOTIFICATIONS_FROM_EMAIL;
		if (!apiKey || !from) {
			// eslint-disable-next-line no-console
			console.log("Email skipped: missing RESEND_API_KEY or NOTIFICATIONS_FROM_EMAIL");
			return;
		}
		await postResendEmail({
			apiKey,
			from,
			to,
			subject,
			text,
			replyTo,
		});
	},
});
