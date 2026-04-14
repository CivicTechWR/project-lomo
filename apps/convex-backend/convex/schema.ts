import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const requestStatus = v.union(
	v.literal("pending"),
	v.literal("rejected"),
	v.literal("in_progress"),
	v.literal("complete"),
	v.literal("cancelled"),
);

export default defineSchema(
	{
		countsTable: defineTable({
			value: v.number(),
		}),

		helpRequests: defineTable({
			ownerSubject: v.string(),
			/** Set when someone accepts a pending request (offering help). */
			helperSubject: v.optional(v.string()),
			category: v.string(),
			title: v.string(),
			summary: v.string(),
			details: v.string(),
			status: requestStatus,
			/** Optional JSON payload for structured client data (e.g. food draft). */
			payload: v.optional(v.string()),
		})
			.index("by_owner", ["ownerSubject"])
			.index("by_status", ["status"]),
	},
	{ schemaValidation: true },
);
