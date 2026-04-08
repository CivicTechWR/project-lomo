import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
	{
		countsTable: defineTable({
			value: v.number(),
		}),
	},
	{ schemaValidation: true },
);
