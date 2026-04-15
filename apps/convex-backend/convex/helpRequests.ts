/* eslint-disable node/prefer-global/process */
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { requestStatus } from "./schema";

type Identity = {
	subject: string;
	email?: string;
	name?: string;
	pictureUrl?: string;
};

function csvSet(raw: string | undefined): Set<string> {
	return new Set(
		(raw ?? "")
			.split(",")
			.map(v => v.trim())
			.filter(Boolean),
	);
}

function isAdminIdentity(identity: Identity): boolean {
	const adminSubjects = csvSet(process.env.ADMIN_SUBJECTS);
	const adminEmails = csvSet(process.env.ADMIN_EMAILS);
	return adminSubjects.has(identity.subject)
		|| (!!identity.email && adminEmails.has(identity.email));
}

async function requireIdentity(ctx: any) {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		throw new Error("Unauthenticated");
	}
	return identity as Identity;
}

async function upsertCurrentUser(ctx: any, identity: Identity) {
	// Queries run with a read-only db API (no insert/patch). In that case, skip.
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

async function createNotification(ctx: any, args: {
	recipientSubject: string;
	type:
		| "volunteer_assigned"
		| "volunteer_assignment_declined"
		| "volunteer_accepted_match"
		| "requester_accept_match_prompt"
		| "requester_declined_match";
	title: string;
	body: string;
	requestId?: any;
	ctaLabel?: string;
	ctaAction?: string;
}) {
	await ctx.db.insert("notifications", {
		recipientSubject: args.recipientSubject,
		type: args.type,
		title: args.title,
		body: args.body,
		requestId: args.requestId,
		isRead: false,
		ctaLabel: args.ctaLabel,
		ctaAction: args.ctaAction,
	});
}

export const listMine = query({
	args: {
		statusFilter: v.optional(requestStatus),
	},
	handler: async (ctx, { statusFilter }) => {
		const identity = await ctx.auth.getUserIdentity() as Identity | null;
		if (!identity) {
			return [];
		}
		await upsertCurrentUser(ctx, identity);

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
		const identity = await ctx.auth.getUserIdentity() as Identity | null;
		if (!identity) {
			return null;
		}
		await upsertCurrentUser(ctx, identity);
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
		const identity = await ctx.auth.getUserIdentity() as Identity | null;
		if (!identity) {
			return [];
		}
		await upsertCurrentUser(ctx, identity);

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
		const identity = await ctx.auth.getUserIdentity() as Identity | null;
		if (!identity) {
			return null;
		}
		await upsertCurrentUser(ctx, identity);
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
		const identity = await requireIdentity(ctx);
		await upsertCurrentUser(ctx, identity);
		const doc = await ctx.db.get(requestId);
		if (!doc || doc.ownerSubject === identity.subject) {
			throw new Error("Not found");
		}
		if (doc.status !== "assigned" || doc.assignedHelperSubject !== identity.subject) {
			throw new Error("This request is not currently assigned to you.");
		}
		await ctx.db.patch(requestId, {
			status: "awaiting_requester_acceptance",
			helperSubject: identity.subject,
		});
		await createNotification(ctx, {
			recipientSubject: doc.ownerSubject,
			type: "requester_accept_match_prompt",
			title: "A volunteer accepted your request",
			body: "Review and accept the match to move this request in progress.",
			requestId,
			ctaLabel: "Review match",
			ctaAction: "open_request",
		});
		const owner = await ctx.db
			.query("users")
			.withIndex("by_subject", (q: any) => q.eq("subject", doc.ownerSubject))
			.unique();
		if (owner?.email) {
			await ctx.scheduler.runAfter(0, internal.notifications.sendEmail, {
				to: owner.email,
				subject: "Your LoMo match is ready to accept",
				text: `A volunteer accepted your request "${doc.title}". Open LoMo to accept the match.`,
			});
		}
	},
});

export const declineAssigned = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const identity = await requireIdentity(ctx);
		await upsertCurrentUser(ctx, identity);
		const doc = await ctx.db.get(requestId);
		if (!doc || doc.assignedHelperSubject !== identity.subject) {
			throw new Error("Not found");
		}
		if (doc.status !== "assigned") {
			throw new Error("Request is not pending your assignment.");
		}
		await ctx.db.patch(requestId, {
			status: "pending",
			assignedHelperSubject: undefined,
		});
		await createNotification(ctx, {
			recipientSubject: doc.ownerSubject,
			type: "volunteer_assignment_declined",
			title: "A volunteer declined the match",
			body: "An admin will assign another helper shortly.",
			requestId,
		});
	},
});

export const requesterAcceptMatch = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const identity = await requireIdentity(ctx);
		await upsertCurrentUser(ctx, identity);
		const doc = await ctx.db.get(requestId);
		if (!doc || doc.ownerSubject !== identity.subject) {
			throw new Error("Not found");
		}
		if (doc.status !== "awaiting_requester_acceptance" || !doc.helperSubject) {
			throw new Error("No match to accept.");
		}
		await ctx.db.patch(requestId, { status: "in_progress" });
		await createNotification(ctx, {
			recipientSubject: doc.helperSubject,
			type: "volunteer_accepted_match",
			title: "Requester accepted your match",
			body: "You're now in progress on this request.",
			requestId,
			ctaLabel: "Open request",
			ctaAction: "open_offer_request",
		});
		const helper = await ctx.db
			.query("users")
			.withIndex("by_subject", (q: any) => q.eq("subject", doc.helperSubject))
			.unique();
		if (helper?.email) {
			await ctx.scheduler.runAfter(0, internal.notifications.sendEmail, {
				to: helper.email,
				subject: "Your LoMo match was accepted",
				text: `The requester accepted your help for "${doc.title}".`,
			});
		}
	},
});

export const requesterDeclineMatch = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const identity = await requireIdentity(ctx);
		await upsertCurrentUser(ctx, identity);
		const doc = await ctx.db.get(requestId);
		if (!doc || doc.ownerSubject !== identity.subject) {
			throw new Error("Not found");
		}
		if (doc.status !== "awaiting_requester_acceptance") {
			throw new Error("No match to decline.");
		}
		const helper = doc.helperSubject;
		await ctx.db.patch(requestId, {
			status: "pending",
			helperSubject: undefined,
			assignedHelperSubject: undefined,
		});
		if (helper) {
			await createNotification(ctx, {
				recipientSubject: helper,
				type: "requester_declined_match",
				title: "Requester declined the match",
				body: "The request is back in the pending pool.",
				requestId,
			});
		}
	},
});

export const isAdmin = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity() as Identity | null;
		if (!identity) {
			return false;
		}
		return isAdminIdentity(identity);
	},
});

export const listAllForAdmin = query({
	args: { statusFilter: v.optional(requestStatus) },
	handler: async (ctx, { statusFilter }) => {
		const identity = await requireIdentity(ctx);
		if (!isAdminIdentity(identity)) {
			throw new Error("Forbidden");
		}
		const rows = await ctx.db.query("helpRequests").collect();
		rows.sort((a, b) => b._creationTime - a._creationTime);
		return statusFilter ? rows.filter(r => r.status === statusFilter) : rows;
	},
});

export const listVolunteersForAdmin = query({
	args: {},
	handler: async (ctx) => {
		const identity = await requireIdentity(ctx);
		if (!isAdminIdentity(identity)) {
			throw new Error("Forbidden");
		}
		const users = await ctx.db.query("users").collect();
		return users
			.filter(u => u.isVolunteer !== false)
			.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
	},
});

export const assignVolunteer = mutation({
	args: {
		requestId: v.id("helpRequests"),
		volunteerSubject: v.string(),
	},
	handler: async (ctx, { requestId, volunteerSubject }) => {
		const identity = await requireIdentity(ctx);
		if (!isAdminIdentity(identity)) {
			throw new Error("Forbidden");
		}
		const doc = await ctx.db.get(requestId);
		if (!doc) {
			throw new Error("Request not found.");
		}
		if (doc.status !== "pending") {
			throw new Error("Only pending requests can be assigned.");
		}
		if (doc.ownerSubject === volunteerSubject) {
			throw new Error("Requester cannot be assigned as helper.");
		}
		await ctx.db.patch(requestId, {
			status: "assigned",
			assignedHelperSubject: volunteerSubject,
			helperSubject: undefined,
		});
		await createNotification(ctx, {
			recipientSubject: volunteerSubject,
			type: "volunteer_assigned",
			title: "You were matched to a request",
			body: "Open LoMo to accept or decline this request.",
			requestId,
			ctaLabel: "Review assignment",
			ctaAction: "open_offer_request",
		});
		const volunteer = await ctx.db
			.query("users")
			.withIndex("by_subject", (q: any) => q.eq("subject", volunteerSubject))
			.unique();
		if (volunteer?.email) {
			await ctx.scheduler.runAfter(0, internal.notifications.sendEmail, {
				to: volunteer.email,
				subject: "You were assigned a LoMo request",
				text: `You've been assigned to "${doc.title}". Open LoMo to accept or decline.`,
			});
		}
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
		const identity = await requireIdentity(ctx);
		await upsertCurrentUser(ctx, identity);

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
		const identity = await requireIdentity(ctx);
		await upsertCurrentUser(ctx, identity);
		const doc = await ctx.db.get(requestId);
		if (!doc || doc.ownerSubject !== identity.subject) {
			throw new Error("Not found");
		}
		if (
			doc.status === "assigned"
			|| doc.status === "awaiting_requester_acceptance"
			|| doc.status === "pending"
			|| doc.status === "in_progress"
		) {
			await ctx.db.patch(requestId, { status: "cancelled" });
			return;
		}
		if (
			doc.status === "complete"
			|| doc.status === "rejected"
			|| doc.status === "cancelled"
		) {
			throw new Error("Cannot cancel this request");
		}
	},
});
