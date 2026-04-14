import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requestStatus } from "./schema";

export const listMine = query({
	args: {
		statusFilter: v.optional(requestStatus),
	},
	handler: async (ctx, { statusFilter }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return [];
		}

		const rows = await ctx.db
			.query("helpRequests")
			.withIndex("by_owner", q => q.eq("ownerSubject", identity.subject))
			.collect();

		rows.sort((a, b) => b._creationTime - a._creationTime);

		if (statusFilter === undefined) {
			return rows;
		}
		return rows.filter(r => r.status === statusFilter);
	},
});

export const get = query({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return null;
		}
		const doc = await ctx.db.get(requestId);
		if (!doc || doc.ownerSubject !== identity.subject) {
			return null;
		}
		return doc;
	},
});

/** Pending requests from other users (offering help). */
export const listPendingFromOthers = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return [];
		}

		const rows = await ctx.db
			.query("helpRequests")
			.withIndex("by_status", q => q.eq("status", "pending"))
			.collect();

		const mine = rows.filter(
			r => r.ownerSubject !== identity.subject,
		);
		mine.sort((a, b) => b._creationTime - a._creationTime);
		return mine;
	},
});

/**
 * Read a request as a potential helper: open pending requests from others,
 * or a request you already accepted (in progress as helper).
 */
export const getAsHelper = query({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			return null;
		}
		const doc = await ctx.db.get(requestId);
		if (!doc) {
			return null;
		}
		if (doc.ownerSubject === identity.subject) {
			return null;
		}
		if (doc.status === "pending") {
			return doc;
		}
		if (
			doc.status === "in_progress"
			&& doc.helperSubject === identity.subject
		) {
			return doc;
		}
		return null;
	},
});

export const accept = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Unauthenticated");
		}
		const doc = await ctx.db.get(requestId);
		if (!doc || doc.ownerSubject === identity.subject) {
			throw new Error("Not found");
		}
		if (doc.status !== "pending") {
			throw new Error("This request is no longer open.");
		}
		await ctx.db.patch(requestId, {
			status: "in_progress",
			helperSubject: identity.subject,
		});
	},
});

export const create = mutation({
	args: {
		category: v.string(),
		title: v.string(),
		summary: v.string(),
		details: v.string(),
		payload: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Unauthenticated");
		}

		return await ctx.db.insert("helpRequests", {
			ownerSubject: identity.subject,
			category: args.category,
			title: args.title,
			summary: args.summary,
			details: args.details,
			status: "pending",
			payload: args.payload,
		});
	},
});

export const cancel = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("Unauthenticated");
		}
		const doc = await ctx.db.get(requestId);
		if (!doc || doc.ownerSubject !== identity.subject) {
			throw new Error("Not found");
		}
		if (
			doc.status === "complete"
			|| doc.status === "rejected"
			|| doc.status === "cancelled"
		) {
			throw new Error("Cannot cancel this request");
		}
		await ctx.db.patch(requestId, { status: "cancelled" });
	},
});
