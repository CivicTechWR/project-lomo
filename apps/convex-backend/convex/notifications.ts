/* eslint-disable node/prefer-global/process */
import { v } from "convex/values";
import { internalAction, mutation, query } from "./_generated/server";

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
	},
	handler: async (_ctx, { to, subject, text }) => {
		const apiKey = process.env.RESEND_API_KEY;
		const from = process.env.NOTIFICATIONS_FROM_EMAIL;
		if (!apiKey || !from) {
			// eslint-disable-next-line no-console
			console.log("Email skipped: missing RESEND_API_KEY or NOTIFICATIONS_FROM_EMAIL");
			return;
		}
		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				from,
				to: [to],
				subject,
				text,
			}),
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(`Resend error (${res.status}): ${body}`);
		}
	},
});
