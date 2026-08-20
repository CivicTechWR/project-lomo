import { v } from "convex/values";
import { internalAction, mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/adminAuth";
import { getCurrentUserRow } from "./lib/currentUser";
import { enrichNotification } from "./lib/notificationHelpers";
import { getResendConfig, postResendEmail } from "./lib/resendEmail";

export const listMine = query({
	args: { unreadOnly: v.optional(v.boolean()) },
	handler: async (ctx, { unreadOnly }) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
			return [];
		}
		const rows = unreadOnly
			? await ctx.db
					.query("notifications")
					.withIndex("by_recipient_read", q =>
						q.eq("recipientUserId", user._id).eq("isRead", false))
					.collect()
			: await ctx.db
					.query("notifications")
					.withIndex("by_recipient", q => q.eq("recipientUserId", user._id))
					.collect();
		rows.sort((a, b) => b._creationTime - a._creationTime);

		const enriched = await Promise.all(
			rows.map(async (n) => {
				const req = n.requestId ? await ctx.db.get("helpRequests", n.requestId) : null;
				return enrichNotification(n, req, user._id);
			}),
		);
		return enriched;
	},
});

export const markRead = mutation({
	args: { notificationId: v.id("notifications") },
	handler: async (ctx, { notificationId }) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
			throw new Error("Unauthenticated");
		}
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

export const markAllRead = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await requireAdmin(ctx);
		const adminUser = await ctx.db
			.query("users")
			.withIndex("by_token_identifier", q =>
				q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();
		if (!adminUser)
			return;

		const unread = await ctx.db
			.query("notifications")
			.withIndex("by_recipient_read", q =>
				q.eq("recipientUserId", adminUser._id).eq("isRead", false))
			.take(200);

		for (const notification of unread) {
			await ctx.db.patch("notifications", notification._id, { isRead: true });
		}
	},
});

export const listForAdmin = query({
	args: { unreadOnly: v.optional(v.boolean()) },
	handler: async (ctx, { unreadOnly }) => {
		const identity = await requireAdmin(ctx);
		// Find the admin's user row to query their notifications
		const adminUser = await ctx.db
			.query("users")
			.withIndex("by_token_identifier", q =>
				q.eq("tokenIdentifier", identity.tokenIdentifier))
			.unique();
		if (!adminUser)
			return [];

		const rows = unreadOnly
			? await ctx.db
					.query("notifications")
					.withIndex("by_recipient_read", q =>
						q.eq("recipientUserId", adminUser._id).eq("isRead", false))
					.order("desc")
					.take(50)
			: await ctx.db
					.query("notifications")
					.withIndex("by_recipient", q =>
						q.eq("recipientUserId", adminUser._id))
					.order("desc")
					.take(50);

		return rows;
	},
});
