import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { getResendConfig, postResendEmail } from "../lib/resendEmail";

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
