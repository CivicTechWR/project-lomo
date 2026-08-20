import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/adminAuth";

export const getSettings = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const doc = await ctx.db
			.query("adminSettings")
			.withIndex("by_key", q => q.eq("key", "global"))
			.unique();
		return doc ?? {
			attentionThresholdDays: 5,
			notifyOnNewPending: true,
			notifyOnConcernReport: true,
			notifyOnCancellation: true,
		};
	},
});

export const updateSettings = mutation({
	args: {
		attentionThresholdDays: v.optional(v.number()),
		notifyOnNewPending: v.optional(v.boolean()),
		notifyOnConcernReport: v.optional(v.boolean()),
		notifyOnCancellation: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		if (args.attentionThresholdDays !== undefined) {
			const t = args.attentionThresholdDays;
			if (!Number.isInteger(t) || t < 1 || t > 30) {
				throw new Error("Threshold must be an integer between 1 and 30.");
			}
		}
		const existing = await ctx.db
			.query("adminSettings")
			.withIndex("by_key", q => q.eq("key", "global"))
			.unique();

		const patch = {
			...(args.attentionThresholdDays !== undefined && { attentionThresholdDays: args.attentionThresholdDays }),
			...(args.notifyOnNewPending !== undefined && { notifyOnNewPending: args.notifyOnNewPending }),
			...(args.notifyOnConcernReport !== undefined && { notifyOnConcernReport: args.notifyOnConcernReport }),
			...(args.notifyOnCancellation !== undefined && { notifyOnCancellation: args.notifyOnCancellation }),
		};

		if (existing) {
			await ctx.db.patch("adminSettings", existing._id, patch);
		}
		else {
			await ctx.db.insert("adminSettings", {
				key: "global",
				attentionThresholdDays: args.attentionThresholdDays ?? 5,
				notifyOnNewPending: args.notifyOnNewPending ?? true,
				notifyOnConcernReport: args.notifyOnConcernReport ?? true,
				notifyOnCancellation: args.notifyOnCancellation ?? true,
			});
		}
	},
});
