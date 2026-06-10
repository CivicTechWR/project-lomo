import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUserRow, getOrCreateCurrentUser } from "./lib/currentUser";

export const getMyProfileRow = query({
	args: {},
	handler: async (ctx) => {
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
