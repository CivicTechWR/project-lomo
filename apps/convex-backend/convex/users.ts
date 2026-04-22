import { v } from "convex/values";
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

export const getMyProfileRow = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity() as Identity | null;
		if (!identity) {
			return null;
		}
		await upsertCurrentUser(ctx, identity);
		return await ctx.db
			.query("users")
			.withIndex("by_subject", (q: any) => q.eq("subject", identity.subject))
			.unique();
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
		const row = await ctx.db
			.query("users")
			.withIndex("by_subject", (q: any) => q.eq("subject", identity.subject))
			.unique();
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
