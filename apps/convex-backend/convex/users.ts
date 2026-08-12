import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { normalizeHelpPreferences } from "./lib/helperPreferences";
import { getCurrentUserRow, getOrCreateCurrentUser } from "./lib/currentUser";

interface Identity {
	subject: string;
	email?: string;
	name?: string;
	pictureUrl?: string;
}

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
		return getCurrentUserRow(ctx);
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
		const { user } = await getOrCreateCurrentUser(ctx);
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
		await ctx.db.patch("users", user._id, patch);
	},
});

export const updateHelperPreferences = mutation({
	args: {
		canHelpNow: v.optional(v.boolean()),
		helpPreferences: v.optional(v.array(v.string())),
		helpAreaCenterLat: v.optional(v.number()),
		helpAreaCenterLng: v.optional(v.number()),
		helpAreaRadiusKm: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const identity = await requireIdentity(ctx);
		await upsertCurrentUser(ctx, identity);
		const row = await getUserRow(ctx, identity.subject);
		if (!row) {
			throw new Error("User row missing");
		}
		const patch: Record<string, boolean | number | string[] | undefined> = {};
		if (args.canHelpNow !== undefined) {
			patch.canHelpNow = args.canHelpNow;
		}
		if (args.helpPreferences !== undefined) {
			patch.helpPreferences = normalizeHelpPreferences(args.helpPreferences);
		}
		if (args.helpAreaCenterLat !== undefined) {
			if (args.helpAreaCenterLat < -90 || args.helpAreaCenterLat > 90) {
				throw new Error("Invalid latitude");
			}
			patch.helpAreaCenterLat = args.helpAreaCenterLat;
		}
		if (args.helpAreaCenterLng !== undefined) {
			if (args.helpAreaCenterLng < -180 || args.helpAreaCenterLng > 180) {
				throw new Error("Invalid longitude");
			}
			patch.helpAreaCenterLng = args.helpAreaCenterLng;
		}
		if (args.helpAreaRadiusKm !== undefined) {
			const radiusKm = Math.round(args.helpAreaRadiusKm);
			if (radiusKm < 1 || radiusKm > 30) {
				throw new Error("Radius must be between 1 and 30 km");
			}
			patch.helpAreaRadiusKm = radiusKm;
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
