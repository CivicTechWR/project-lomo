import { v } from "convex/values";
import { normalizeHelpPreferences } from "./lib/helperPreferences";
import { mutation, query } from "./_generated/server";

type Identity = {
	subject: string;
	email?: string;
	name?: string;
	pictureUrl?: string;
};

async function requireIdentity(ctx: any) {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		throw new Error("Unauthenticated");
	}
	return identity as Identity;
}

async function upsertCurrentUser(ctx: any, identity: Identity) {
	if (
		typeof ctx?.db?.insert !== "function"
		|| typeof ctx?.db?.patch !== "function"
	) {
		return;
	}
	const existing = await ctx.db
		.query("users")
		.withIndex("by_subject", (q: any) => q.eq("subject", identity.subject))
		.unique();
	const patch = {
		email: identity.email,
		name: identity.name,
		image: identity.pictureUrl,
		isVolunteer: existing?.isVolunteer ?? true,
	};
	if (!existing) {
		await ctx.db.insert("users", {
			subject: identity.subject,
			...patch,
		});
		return;
	}
	await ctx.db.patch(existing._id, patch);
}

async function getUserRow(ctx: any, subject: string) {
	return await ctx.db
		.query("users")
		.withIndex("by_subject", (q: any) => q.eq("subject", subject))
		.unique();
}

export const getMyProfileRow = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity() as Identity | null;
		if (!identity) {
			return null;
		}
		await upsertCurrentUser(ctx, identity);
		return await getUserRow(ctx, identity.subject);
	},
});

export const updatePublicProfile = mutation({
	args: {
		firstName: v.optional(v.string()),
		pronouns: v.optional(v.string()),
		phone: v.optional(v.string()),
	},
	handler: async (ctx, { firstName, pronouns, phone }) => {
		const identity = await requireIdentity(ctx);
		await upsertCurrentUser(ctx, identity);
		const row = await getUserRow(ctx, identity.subject);
		if (!row) {
			throw new Error("User row missing");
		}
		const patch: Record<string, string | undefined> = {};
		if (firstName !== undefined) {
			patch.firstName = firstName.trim() || undefined;
		}
		if (pronouns !== undefined) {
			patch.pronouns = pronouns.trim() || undefined;
		}
		if (phone !== undefined) {
			patch.phone = phone.trim() || undefined;
		}
		await ctx.db.patch(row._id, patch);
	},
});

export const updateHelperPreferences = mutation({
	args: {
		canHelpNow: v.optional(v.boolean()),
		helpPreferences: v.optional(v.array(v.string())),
		helpLocation: v.optional(v.string()),
	},
	handler: async (ctx, { canHelpNow, helpPreferences, helpLocation }) => {
		const identity = await requireIdentity(ctx);
		await upsertCurrentUser(ctx, identity);
		const row = await getUserRow(ctx, identity.subject);
		if (!row) {
			throw new Error("User row missing");
		}
		const patch: Record<string, boolean | string | string[] | undefined> = {};
		if (canHelpNow !== undefined) {
			patch.canHelpNow = canHelpNow;
		}
		if (helpPreferences !== undefined) {
			patch.helpPreferences = normalizeHelpPreferences(helpPreferences);
		}
		if (helpLocation !== undefined) {
			patch.helpLocation = helpLocation.trim() || undefined;
		}
		await ctx.db.patch(row._id, patch);
	},
});

export const acknowledgeSafety = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await requireIdentity(ctx);
		await upsertCurrentUser(ctx, identity);
		const row = await getUserRow(ctx, identity.subject);
		if (!row) {
			throw new Error("User row missing");
		}
		await ctx.db.patch(row._id, {
			safetyAcknowledgedAt: Date.now(),
		});
	},
});

export const completeOnboarding = mutation({
	args: {},
	handler: async (ctx) => {
		const identity = await requireIdentity(ctx);
		await upsertCurrentUser(ctx, identity);
		const row = await getUserRow(ctx, identity.subject);
		if (!row) {
			throw new Error("User row missing");
		}
		if (!row.safetyAcknowledgedAt) {
			throw new Error("Complete the safety step before finishing onboarding.");
		}
		await ctx.db.patch(row._id, {
			onboardingCompletedAt: Date.now(),
		});
	},
});
