import { v } from "convex/values";
import { internalAction, mutation, query } from "./_generated/server";
import { enrichNotification } from "./lib/notificationHelpers";
import { getResendConfig, postResendEmail } from "./lib/resendEmail";

export const listMine = query({
	args: {},
	handler: async (ctx) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
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

		const enriched = await Promise.all(
			rows.map(async (n) => {
				const req = n.requestId ? await ctx.db.get("helpRequests", n.requestId) : null;
				return enrichNotification(n, req, identity.subject);
			}),
		);
		return enriched;
	},
});

export const markRead = mutation({
	args: { notificationId: v.id("notifications") },
	handler: async (ctx, { notificationId }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Unauthenticated");
		}
		const doc = await ctx.db.get("notifications", notificationId);
		if (!doc || doc.recipientSubject !== identity.subject) {
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
		const resend = getResendConfig();
		if (!resend) {
			// eslint-disable-next-line no-console
			console.log("Email skipped: missing RESEND_API_KEY or NOTIFICATIONS_FROM_EMAIL");
			return;
		}
		await postResendEmail({
			apiKey: resend.apiKey,
			from: resend.from,
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
		const resend = getResendConfig();
		if (!resend) {
			// eslint-disable-next-line no-console
			console.log("Email skipped: missing RESEND_API_KEY or NOTIFICATIONS_FROM_EMAIL");
			return;
		}
		await postResendEmail({
			apiKey: resend.apiKey,
			from: resend.from,
			to,
			subject,
			text,
			replyTo,
		});
	},
});
