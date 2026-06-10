/* eslint-disable node/prefer-global/process */
import { v } from "convex/values";
import { internalAction, mutation, query } from "./_generated/server";
import { getCurrentUserRow, getOrCreateCurrentUser } from "./lib/currentUser";

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
	if (opts.replyTo !== undefined && opts.replyTo.length > 0) {
		body.reply_to = [opts.replyTo];
	}
	if (opts.html !== undefined && opts.html.length > 0) {
		body.html = opts.html;
	}
	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${opts.apiKey}`,
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
	args: {},
	handler: async (ctx) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
			return [];
		}
		return ctx.db
			.query("notifications")
			.withIndex("by_recipient_user_id_and_is_read", q =>
				q.eq("recipientUserId", user._id).eq("isRead", false))
			.order("desc")
			.take(50);
	},
});

export const markRead = mutation({
	args: { notificationId: v.id("notifications") },
	handler: async (ctx, { notificationId }) => {
		const { user } = await getOrCreateCurrentUser(ctx);
		const doc = await ctx.db.get("notifications", notificationId);
		if (!doc || doc.recipientUserId !== user._id) {
			throw new Error("Not found");
		}
		await ctx.db.patch("notifications", notificationId, { isRead: true });
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
		if (
			apiKey === undefined
			|| apiKey.length === 0
			|| from === undefined
			|| from.length === 0
		) {
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
		if (
			apiKey === undefined
			|| apiKey.length === 0
			|| from === undefined
			|| from.length === 0
		) {
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
