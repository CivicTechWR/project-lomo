import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listNumbers = query({
	args: {},
	async handler(ctx) {
		const userIdentity = await ctx.auth.getUserIdentity();

		if (!userIdentity) {
			throw new Error("Unauthorized");
		}

		const numbers = await ctx
			.db
			.query("countsTable")
			.order("desc")
			.take(20);

		return numbers;
	},
});

export const addRandomNumber = mutation({
	args: { value: v.number() },
	async handler(ctx, { value }) {
		const userIdentity = await ctx.auth.getUserIdentity();

		if (!userIdentity) {
			throw new Error("Unauthorized");
		}

		await ctx.db.insert("countsTable", { value });

		return {
			ok: true,
			value,
		};
	},
});
