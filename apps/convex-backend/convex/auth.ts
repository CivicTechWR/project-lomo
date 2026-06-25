import type { GenericCtx } from "@convex-dev/better-auth";
import type { DataModel } from "./_generated/dataModel";
import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";
import { components } from "./_generated/api";
import { query } from "./_generated/server";
import authConfig from "./auth.config";
import { getResendConfig, postResendEmail } from "./lib/resendEmail";
import { getSiteEnv } from "./lib/siteEnv";

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

const LOCAL_DEV_ORIGINS = [
	"http://localhost:3000",
	"http://127.0.0.1:3000",
] as const;

export function createAuth(ctx: GenericCtx<DataModel>) {
	const { SITE_URL } = getSiteEnv();
	const extraOrigins =
		process.env.TRUSTED_ORIGINS?.split(",")
			.map(origin => origin.trim())
			.filter(Boolean) ?? [];

	return betterAuth({
		baseURL: SITE_URL,
		// Dashboard SITE_URL may point at preview/prod while you develop on localhost.
		trustedOrigins: [...LOCAL_DEV_ORIGINS, ...extraOrigins],
		database: authComponent.adapter(ctx),
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
			revokeSessionsOnPasswordReset: true,
			sendResetPassword: async ({ user, url }) => {
				const resend = getResendConfig();
				if (!resend) {
					throw new Error(
						"Password reset email is not configured (RESEND_API_KEY or NOTIFICATIONS_FROM_EMAIL missing).",
					);
				}
				const greeting = user.name ? `Hi ${user.name},` : "Hi,";
				const text = [
					greeting,
					"",
					"We received a request to reset your LoMo password.",
					"If this was you, open the link below to choose a new password:",
					"",
					url,
					"",
					"This link expires in one hour. If you did not request a reset, you can ignore this email.",
					"",
					"— LoMo",
				].join("\n");
				await postResendEmail({
					apiKey: resend.apiKey,
					from: resend.from,
					to: user.email,
					subject: "Reset your LoMo password",
					text,
					html: [
						`<p>${greeting}</p>`,
						"<p>We received a request to reset your LoMo password.</p>",
						"<p>If this was you, use the button below to choose a new password:</p>",
						`<p><a href="${url}">Reset password</a></p>`,
						"<p>This link expires in one hour. If you did not request a reset, you can ignore this email.</p>",
						"<p>— LoMo</p>",
					].join(""),
				});
			},
		},
		plugins: [
			// The Convex plugin is required for Convex compatibility
			convex({ authConfig }),
		],
	});
}

export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		const user = await ctx.auth.getUserIdentity();

		return user ?? null;
	},
});
