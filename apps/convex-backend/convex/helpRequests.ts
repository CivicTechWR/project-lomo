import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import {
	getCurrentUserRow,
	getIdentity,
	getOrCreateCurrentUser,
	isAdminIdentity,
	requireIdentity,
} from "./lib/currentUser";
import { redactHelpRequestForVolunteer } from "./redactHelpRequest";
import { requestCategory, requestStatus } from "./schema";

const MAX_LIST_ROWS = 100;
const MAX_ADMIN_ROWS = 200;
const NAME_SPLIT_RE = /\s+/;

type NotificationType
	= | "volunteer_assigned"
		| "volunteer_assignment_declined"
		| "volunteer_accepted_match"
		| "requester_accept_match_prompt"
		| "requester_declined_match"
		| "volunteer_offered_help"
		| "help_request_completed"
		| "request_new_message";

type NotificationCtaAction
	= | "open_request"
		| "open_offer_request"
		| "open_request_thread"
		| "open_offer_thread";

function randomRelayToken(): string {
	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

async function createNotification(ctx: MutationCtx, args: {
	recipientUserId: Id<"users">;
	type: NotificationType;
	title: string;
	body: string;
	requestId?: Id<"helpRequests">;
	ctaLabel?: string;
	ctaAction?: NotificationCtaAction;
}) {
	await ctx.db.insert("notifications", {
		recipientUserId: args.recipientUserId,
		type: args.type,
		title: args.title,
		body: args.body,
		requestId: args.requestId,
		isRead: false,
		ctaLabel: args.ctaLabel,
		ctaAction: args.ctaAction,
	});
}

function volunteerLabelForNotification(helper: {
	firstName?: string;
	name?: string;
	pronouns?: string;
} | null): string {
	const first = firstNameForDisplay(helper);
	const pron = helper?.pronouns?.trim();
	if (first !== null && pron !== undefined && pron.length > 0) {
		return `${first} (${pron})`;
	}
	if (first !== null) {
		return first;
	}
	return "A community member";
}

function firstNameForDisplay(user: {
	firstName?: string;
	name?: string;
} | null): string | null {
	const firstName = user?.firstName?.trim();
	if (firstName !== undefined && firstName.length > 0) {
		return firstName;
	}
	const name = user?.name?.trim();
	if (name !== undefined && name.length > 0) {
		return name.split(NAME_SPLIT_RE)[0] ?? null;
	}
	return null;
}

function publicUserSummary(user: Doc<"users"> | null) {
	if (!user) {
		return null;
	}
	return {
		_id: user._id,
		name: user.name ?? null,
		email: user.email ?? null,
		firstName: user.firstName ?? null,
		pronouns: user.pronouns ?? null,
	};
}

export const listMine = query({
	args: {
		statusFilter: v.optional(requestStatus),
	},
	handler: async (ctx, { statusFilter }) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
			return [];
		}

		const rows = statusFilter === undefined
			? await ctx.db
					.query("helpRequests")
					.withIndex("by_owner_user_id", q => q.eq("ownerUserId", user._id))
					.order("desc")
					.take(MAX_LIST_ROWS)
			: await ctx.db
					.query("helpRequests")
					.withIndex("by_owner_user_id_and_status", q =>
						q.eq("ownerUserId", user._id).eq("status", statusFilter))
					.order("desc")
					.take(MAX_LIST_ROWS);

		return rows;
	},
});

export const get = query({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
			return null;
		}
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc || doc.ownerUserId !== user._id) {
			return null;
		}
		return doc;
	},
});

/** Pending requests from other users (offering help). */
export const listPendingFromOthers = query({
	args: {},
	handler: async (ctx) => {
		const identity = await getIdentity(ctx);
		if (!identity) {
			return [];
		}
		const user = await getCurrentUserRow(ctx);
		const rows = await ctx.db
			.query("helpRequests")
			.withIndex("by_status", q => q.eq("status", "pending"))
			.order("desc")
			.take(MAX_LIST_ROWS);

		return rows
			.filter(r => !user || r.ownerUserId !== user._id)
			.map(r => redactHelpRequestForVolunteer(r));
	},
});

/**
 * Read a request as a potential helper: open pending requests from others,
 * or a request you already accepted (in progress as helper).
 */
export const getAsHelper = query({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const identity = await getIdentity(ctx);
		if (!identity) {
			return null;
		}
		const user = await getCurrentUserRow(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc) {
			return null;
		}
		if (user && doc.ownerUserId === user._id) {
			return null;
		}
		if (doc.status === "pending") {
			return redactHelpRequestForVolunteer(doc);
		}
		if (!user) {
			return null;
		}

		const isAssignedVolunteer
			= doc.status === "assigned" && doc.assignedHelperUserId === user._id;
		const isOfferingVolunteer
			= doc.status === "awaiting_requester_acceptance"
				&& doc.helperUserId === user._id;
		const isHelperInProgress
			= doc.status === "in_progress" && doc.helperUserId === user._id;

		if (isAssignedVolunteer || isOfferingVolunteer) {
			return redactHelpRequestForVolunteer(doc);
		}
		if (isHelperInProgress) {
			return doc;
		}
		return null;
	},
});

/** Public helper fields for the requester while reviewing an offer. */
export const getOfferHelperPreview = query({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
			return null;
		}
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc || doc.ownerUserId !== user._id) {
			return null;
		}
		if (doc.status !== "awaiting_requester_acceptance" || !doc.helperUserId) {
			return null;
		}
		const helper = await ctx.db.get("users", doc.helperUserId);
		const firstName = firstNameForDisplay(helper);
		const pronouns = helper?.pronouns?.trim() ?? null;
		return { firstName, pronouns };
	},
});

export const accept = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const { user } = await getOrCreateCurrentUser(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc || doc.ownerUserId === user._id) {
			throw new Error("Not found");
		}
		if (doc.status !== "assigned" || doc.assignedHelperUserId !== user._id) {
			throw new Error("This request is not currently assigned to you.");
		}
		await ctx.db.patch("helpRequests", requestId, {
			status: "awaiting_requester_acceptance",
			helperUserId: user._id,
		});
		await createNotification(ctx, {
			recipientUserId: doc.ownerUserId,
			type: "requester_accept_match_prompt",
			title: "A volunteer accepted your request",
			body: "Review and accept the match to move this request in progress.",
			requestId,
			ctaLabel: "Review match",
			ctaAction: "open_request",
		});
		const owner = await ctx.db.get("users", doc.ownerUserId);
		if (owner?.email !== undefined && owner.email.length > 0) {
			await ctx.scheduler.runAfter(0, internal.notifications.sendEmail, {
				to: owner.email,
				subject: "Your LoMo match is ready to accept",
				text: `A volunteer accepted your request "${doc.title}". Open LoMo to accept the match.`,
			});
		}
	},
});

export const volunteerOfferHelp = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const { user } = await getOrCreateCurrentUser(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc || doc.ownerUserId === user._id) {
			throw new Error("Not found");
		}
		if (doc.status !== "pending") {
			throw new Error("This request is not open for offers right now.");
		}
		if (doc.assignedHelperUserId) {
			throw new Error("This request is being matched by a coordinator.");
		}
		await ctx.db.patch("helpRequests", requestId, {
			status: "awaiting_requester_acceptance",
			helperUserId: user._id,
		});
		const label = volunteerLabelForNotification(user);
		await createNotification(ctx, {
			recipientUserId: doc.ownerUserId,
			type: "volunteer_offered_help",
			title: "Someone offered to help",
			body: `${label} offered to help with "${doc.title}". Open your request to accept or decline.`,
			requestId,
			ctaLabel: "Review offer",
			ctaAction: "open_request",
		});
		const owner = await ctx.db.get("users", doc.ownerUserId);
		if (owner?.email !== undefined && owner.email.length > 0) {
			await ctx.scheduler.runAfter(0, internal.notifications.sendEmail, {
				to: owner.email,
				subject: "Someone offered to help on LoMo",
				text: `${label} offered to help with "${doc.title}". Open LoMo to review the offer.`,
			});
		}
	},
});

export const declineAssigned = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const { user } = await getOrCreateCurrentUser(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc || doc.assignedHelperUserId !== user._id) {
			throw new Error("Not found");
		}
		if (doc.status !== "assigned") {
			throw new Error("Request is not pending your assignment.");
		}
		await ctx.db.patch("helpRequests", requestId, {
			status: "pending",
			assignedHelperUserId: undefined,
		});
		await createNotification(ctx, {
			recipientUserId: doc.ownerUserId,
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
		const { user } = await getOrCreateCurrentUser(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc || doc.ownerUserId !== user._id) {
			throw new Error("Not found");
		}
		if (doc.status !== "awaiting_requester_acceptance" || !doc.helperUserId) {
			throw new Error("No match to accept.");
		}
		await ctx.db.patch("helpRequests", requestId, {
			status: "in_progress",
			emailRelayToken: randomRelayToken(),
		});
		await createNotification(ctx, {
			recipientUserId: doc.helperUserId,
			type: "volunteer_accepted_match",
			title: "Requester accepted your match",
			body: "You're now in progress on this request.",
			requestId,
			ctaLabel: "Open request",
			ctaAction: "open_offer_request",
		});
		const helper = await ctx.db.get("users", doc.helperUserId);
		if (helper?.email !== undefined && helper.email.length > 0) {
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
		const { user } = await getOrCreateCurrentUser(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc || doc.ownerUserId !== user._id) {
			throw new Error("Not found");
		}
		if (doc.status !== "awaiting_requester_acceptance") {
			throw new Error("No match to decline.");
		}
		const helperUserId = doc.helperUserId;
		await ctx.db.patch("helpRequests", requestId, {
			status: "pending",
			helperUserId: undefined,
			assignedHelperUserId: undefined,
		});
		if (helperUserId) {
			await createNotification(ctx, {
				recipientUserId: helperUserId,
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
		const identity = await getIdentity(ctx);
		return identity ? isAdminIdentity(identity) : false;
	},
});

export const listAllForAdmin = query({
	args: { statusFilter: v.optional(requestStatus) },
	handler: async (ctx, { statusFilter }) => {
		const identity = await requireIdentity(ctx);
		if (!isAdminIdentity(identity)) {
			throw new Error("Forbidden");
		}
		const rows = statusFilter
			? await ctx.db
					.query("helpRequests")
					.withIndex("by_status", q => q.eq("status", statusFilter))
					.order("desc")
					.take(MAX_ADMIN_ROWS)
			: await ctx.db.query("helpRequests").order("desc").take(MAX_ADMIN_ROWS);

		return Promise.all(rows.map(async (row) => {
			const owner = await ctx.db.get("users", row.ownerUserId);
			const assignedHelper = row.assignedHelperUserId
				? await ctx.db.get("users", row.assignedHelperUserId)
				: null;
			const helper = row.helperUserId ? await ctx.db.get("users", row.helperUserId) : null;
			return {
				...row,
				owner: publicUserSummary(owner),
				assignedHelper: publicUserSummary(assignedHelper),
				helper: publicUserSummary(helper),
			};
		}));
	},
});

export const listVolunteersForAdmin = query({
	args: {},
	handler: async (ctx) => {
		const identity = await requireIdentity(ctx);
		if (!isAdminIdentity(identity)) {
			throw new Error("Forbidden");
		}
		const users = await ctx.db.query("users").take(MAX_ADMIN_ROWS);
		return users
			.filter(u => u.isVolunteer !== false)
			.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
	},
});

export const assignVolunteer = mutation({
	args: {
		requestId: v.id("helpRequests"),
		volunteerUserId: v.id("users"),
	},
	handler: async (ctx, { requestId, volunteerUserId }) => {
		const identity = await requireIdentity(ctx);
		if (!isAdminIdentity(identity)) {
			throw new Error("Forbidden");
		}
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc) {
			throw new Error("Request not found.");
		}
		const volunteer = await ctx.db.get("users", volunteerUserId);
		if (!volunteer) {
			throw new Error("Volunteer not found.");
		}
		if (doc.status !== "pending") {
			throw new Error("Only pending requests can be assigned.");
		}
		if (doc.ownerUserId === volunteerUserId) {
			throw new Error("Requester cannot be assigned as helper.");
		}
		await ctx.db.patch("helpRequests", requestId, {
			status: "assigned",
			assignedHelperUserId: volunteerUserId,
			helperUserId: undefined,
		});
		await createNotification(ctx, {
			recipientUserId: volunteerUserId,
			type: "volunteer_assigned",
			title: "You were matched to a request",
			body: "Open LoMo to accept or decline this request.",
			requestId,
			ctaLabel: "Review assignment",
			ctaAction: "open_offer_request",
		});
		if (volunteer.email !== undefined && volunteer.email.length > 0) {
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
		category: requestCategory,
		title: v.string(),
		summary: v.string(),
		details: v.string(),
	},
	handler: async (ctx, args) => {
		const { user } = await getOrCreateCurrentUser(ctx);

		return ctx.db.insert("helpRequests", {
			ownerUserId: user._id,
			category: args.category,
			title: args.title,
			summary: args.summary,
			details: args.details,
			status: "pending",
		});
	},
});

export const cancel = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const { user } = await getOrCreateCurrentUser(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc || doc.ownerUserId !== user._id) {
			throw new Error("Not found");
		}
		if (
			doc.status === "assigned"
			|| doc.status === "awaiting_requester_acceptance"
			|| doc.status === "pending"
			|| doc.status === "in_progress"
		) {
			await ctx.db.patch("helpRequests", requestId, { status: "cancelled" });
			return;
		}
		if (doc.status === "complete" || doc.status === "cancelled") {
			throw new Error("Cannot cancel this request");
		}
	},
});

export const markComplete = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const { user } = await getOrCreateCurrentUser(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc) {
			throw new Error("Not found");
		}
		if (doc.status !== "in_progress") {
			throw new Error("Only in-progress requests can be marked complete.");
		}
		const isOwner = doc.ownerUserId === user._id;
		const isHelper = doc.helperUserId === user._id;
		if (!isOwner && !isHelper) {
			throw new Error("Forbidden");
		}
		await ctx.db.patch("helpRequests", requestId, { status: "complete" });
		const snippet = `"${doc.title}"`;
		if (isOwner && doc.helperUserId) {
			await createNotification(ctx, {
				recipientUserId: doc.helperUserId,
				type: "help_request_completed",
				title: "Request marked complete",
				body: `The requester marked ${snippet} complete.`,
				requestId,
			});
		}
		if (isHelper) {
			await createNotification(ctx, {
				recipientUserId: doc.ownerUserId,
				type: "help_request_completed",
				title: "Request marked complete",
				body: `Your helper marked ${snippet} complete.`,
				requestId,
			});
		}
	},
});
