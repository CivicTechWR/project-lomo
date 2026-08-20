import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/adminAuth";
import {
	getCurrentUserRow,
	getIdentity,
	getOrCreateCurrentUser,
	isAdminIdentity,
	requireIdentity,
} from "./lib/currentUser";
import { haversineDistanceKm } from "./lib/geo";
import { markNotificationsReadForRequest } from "./lib/notificationHelpers";
import { purgeRequest } from "./lib/purgeRequest";
import { extractGeocodableAddress, extractPayloadCoordinates } from "./lib/requestLocation";
import { extractIsUrgent, extractNeedsDelivery } from "./lib/requestMetadata";
import { redactHelpRequestForVolunteer } from "./redactHelpRequest";
import { requestCategory, requestStatus } from "./schema";

interface Identity {
	subject: string;
	email?: string;
	name?: string;
	pictureUrl?: string;
}

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
		| "volunteer_withdrew_offer"
		| "help_request_completed"
		| "request_cancelled"
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

interface HelpArea {
	centerLat: number;
	centerLng: number;
	radiusKm: number;
}

function helpAreaFromUser(userRow: {
	helpAreaCenterLat?: number;
	helpAreaCenterLng?: number;
	helpAreaRadiusKm?: number;
} | null): HelpArea | null {
	if (
		userRow?.helpAreaCenterLat == null
		|| userRow?.helpAreaCenterLng == null
		|| userRow?.helpAreaRadiusKm == null
	) {
		return null;
	}
	return {
		centerLat: userRow.helpAreaCenterLat,
		centerLng: userRow.helpAreaCenterLng,
		radiusKm: userRow.helpAreaRadiusKm,
	};
}

function enrichOpenRequestForHelper(
	r: {
		_id: any;
		_creationTime: number;
		category: string;
		title: string;
		summary: string;
		details: string;
		payload?: string;
		locationLat?: number;
		locationLng?: number;
		needsDelivery?: boolean;
		isUrgent?: boolean;
		ownerUserId: Id<"users">;
		status: string;
	},
	/** Profile help area — drives the "In your area" badge. */
	profileHelpArea: HelpArea | null,
	/** Area used for distance sorting (usually the list location filter). */
	distanceArea: HelpArea | null = profileHelpArea,
) {
	const needsDelivery = r.needsDelivery ?? extractNeedsDelivery(r.category, r.payload);
	const isUrgent = r.isUrgent ?? extractIsUrgent(r.payload);
	let distanceKm: number | null = null;
	if (
		distanceArea != null
		&& r.locationLat != null
		&& r.locationLng != null
	) {
		distanceKm = haversineDistanceKm(
			distanceArea.centerLat,
			distanceArea.centerLng,
			r.locationLat,
			r.locationLng,
		);
	}
	let inYourArea = false;
	if (
		profileHelpArea != null
		&& r.locationLat != null
		&& r.locationLng != null
	) {
		const profileDistanceKm = haversineDistanceKm(
			profileHelpArea.centerLat,
			profileHelpArea.centerLng,
			r.locationLat,
			r.locationLng,
		);
		inYourArea = profileDistanceKm <= profileHelpArea.radiusKm;
	}
	const {
		locationLat: _lat,
		locationLng: _lng,
		...redacted
	} = redactHelpRequestForVolunteer(r);
	return {
		...redacted,
		needsDelivery,
		isUrgent,
		inYourArea,
		distanceKm,
	};
}

function matchesLocationFilter(
	r: { locationLat?: number; locationLng?: number },
	filter: HelpArea,
): boolean {
	// Requests with no geocoded location stay visible.
	if (r.locationLat == null || r.locationLng == null) {
		return true;
	}
	return haversineDistanceKm(
		filter.centerLat,
		filter.centerLng,
		r.locationLat,
		r.locationLng,
	) <= filter.radiusKm;
}

/** Urgent first, then nearer (unknown distance last), then newest. */
function compareOpenRequestsForHelper(
	a: { isUrgent: boolean; distanceKm: number | null; _creationTime: number },
	b: { isUrgent: boolean; distanceKm: number | null; _creationTime: number },
): number {
	if (a.isUrgent !== b.isUrgent) {
		return a.isUrgent ? -1 : 1;
	}
	const distA = a.distanceKm ?? Number.POSITIVE_INFINITY;
	const distB = b.distanceKm ?? Number.POSITIVE_INFINITY;
	if (distA !== distB) {
		return distA - distB;
	}
	return b._creationTime - a._creationTime;
}

/** Pending requests from other users (offering help). */
export const listPendingFromOthers = query({
	args: {
		filterCenterLat: v.optional(v.number()),
		filterCenterLng: v.optional(v.number()),
		filterRadiusKm: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity() as Identity | null;
		if (!identity) {
			return [];
		}
		const user = await getCurrentUserRow(ctx);
		const rows = await ctx.db
			.query("helpRequests")
			.withIndex("by_status", q => q.eq("status", "pending"))
			.order("desc")
			.take(MAX_LIST_ROWS);

		const userRow = await ctx.db
			.query("users")
			.withIndex("by_subject", q => q.eq("subject", identity.subject))
			.unique();
		const profileHelpArea = helpAreaFromUser(userRow);

		let filterArea: HelpArea | null = null;
		if (
			args.filterCenterLat != null
			&& args.filterCenterLng != null
			&& args.filterRadiusKm != null
		) {
			const radiusKm = Math.round(args.filterRadiusKm);
			if (
				args.filterCenterLat >= -90
				&& args.filterCenterLat <= 90
				&& args.filterCenterLng >= -180
				&& args.filterCenterLng <= 180
				&& radiusKm >= 1
				&& radiusKm <= 30
			) {
				filterArea = {
					centerLat: args.filterCenterLat,
					centerLng: args.filterCenterLng,
					radiusKm,
				};
			}
		}

		const open = rows
			.filter(r => user == null || r.ownerUserId !== user._id)
			.filter(r => filterArea == null || matchesLocationFilter(r, filterArea))
			.map(r => enrichOpenRequestForHelper(
				r,
				profileHelpArea,
				filterArea ?? profileHelpArea,
			));

		open.sort(compareOpenRequestsForHelper);
		return open.map(({ distanceKm: _distanceKm, ...item }) => item);
	},
});

const ACTIVE_HOME_STATUSES = new Set([
	"in_progress",
	"awaiting_requester_acceptance",
]);

/** Dashboard summary for the home screen. */
export const homeDashboard = query({
	args: {},
	handler: async (ctx) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
			return {
				active: [],
				pendingMine: [],
				pendingMineTotal: 0,
				openPreview: [],
				openTotal: 0,
				canHelpNow: false,
			};
		}

		const owned = await ctx.db
			.query("helpRequests")
			.withIndex("by_owner_user_id", q => q.eq("ownerUserId", user._id))
			.collect();

		const asHelper = await ctx.db
			.query("helpRequests")
			.withIndex("by_helper", q => q.eq("helperUserId", user._id))
			.collect();

		const activeOwned = owned
			.filter(r => ACTIVE_HOME_STATUSES.has(r.status))
			.map(r => ({
				_id: r._id,
				_creationTime: r._creationTime,
				title: r.title,
				summary: r.summary,
				status: r.status,
				category: r.category,
				role: "requester" as const,
				isUrgent: r.isUrgent ?? extractIsUrgent(r.payload),
			}));

		const activeHelping = asHelper
			.filter(r => ACTIVE_HOME_STATUSES.has(r.status))
			.map(r => ({
				_id: r._id,
				_creationTime: r._creationTime,
				title: r.title,
				summary: r.summary,
				status: r.status,
				category: r.category,
				role: "helper" as const,
				isUrgent: r.isUrgent ?? extractIsUrgent(r.payload),
			}));

		const active = [...activeOwned, ...activeHelping];
		active.sort((a, b) => b._creationTime - a._creationTime);

		const pendingMine = owned
			.filter(r => r.status === "pending")
			.sort((a, b) => b._creationTime - a._creationTime)
			.slice(0, 5)
			.map(r => ({
				_id: r._id,
				_creationTime: r._creationTime,
				title: r.title,
				summary: r.summary,
				status: r.status,
				category: r.category,
				isUrgent: r.isUrgent ?? extractIsUrgent(r.payload),
			}));

		const pendingMineTotal = owned.filter(r => r.status === "pending").length;

		const userRow = user;
		const canHelpNow = userRow.canHelpNow === true;
		const helpArea = helpAreaFromUser(userRow);

		if (!canHelpNow) {
			return {
				active,
				pendingMine,
				pendingMineTotal,
				openPreview: [],
				openTotal: 0,
				canHelpNow: false,
			};
		}

		const openRows = await ctx.db
			.query("helpRequests")
			.withIndex("by_status", q => q.eq("status", "pending"))
			.collect();

		const openEnriched = openRows
			.filter(r => r.ownerUserId !== user._id)
			.map(r => enrichOpenRequestForHelper(r, helpArea))
			.sort(compareOpenRequestsForHelper);

		const openPreview = openEnriched
			.slice(0, 5)
			.map(({ distanceKm: _distanceKm, ...item }) => item);

		return {
			active,
			pendingMine,
			pendingMineTotal,
			openPreview,
			openTotal: openEnriched.length,
			canHelpNow: true,
		};
	},
});

/**
 * Read a request as a potential helper: open pending requests from others,
 * or a request you already accepted (in progress as helper).
 */
export const getAsHelper = query({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const user = await getCurrentUserRow(ctx);
		if (!user) {
			return null;
		}
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc) {
			return null;
		}
		if (doc.ownerUserId === user._id) {
			return null;
		}
		if (doc.status === "pending") {
			return redactHelpRequestForVolunteer(doc);
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
		await markNotificationsReadForRequest(
			ctx,
			requestId,
			n =>
				n.type === "volunteer_assigned"
				&& n.recipientUserId === user._id,
		);
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
		await markNotificationsReadForRequest(
			ctx,
			requestId,
			n =>
				n.type === "volunteer_assigned"
				&& n.recipientUserId === user._id,
		);
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
		await markNotificationsReadForRequest(
			ctx,
			requestId,
			n =>
				(n.type === "requester_accept_match_prompt"
					|| n.type === "volunteer_offered_help")
				&& n.recipientUserId === doc.ownerUserId,
		);
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
		await markNotificationsReadForRequest(
			ctx,
			requestId,
			n =>
				(n.type === "requester_accept_match_prompt"
					|| n.type === "volunteer_offered_help")
				&& n.recipientUserId === doc.ownerUserId,
		);
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

/** Helper withdraws their offer while waiting for requester confirmation. */
export const withdrawOffer = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const { user } = await getOrCreateCurrentUser(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc || doc.helperUserId !== user._id) {
			throw new Error("Not found");
		}
		if (doc.status !== "awaiting_requester_acceptance") {
			throw new Error("There is no pending offer to withdraw.");
		}
		await ctx.db.patch("helpRequests", requestId, {
			status: "pending",
			helperUserId: undefined,
			assignedHelperUserId: undefined,
		});
		await markNotificationsReadForRequest(
			ctx,
			requestId,
			n =>
				(n.type === "requester_accept_match_prompt"
					|| n.type === "volunteer_offered_help")
				&& n.recipientUserId === doc.ownerUserId,
		);
		await createNotification(ctx, {
			recipientUserId: doc.ownerUserId,
			type: "volunteer_withdrew_offer",
			title: "A volunteer withdrew their offer",
			body: `"${doc.title}" is open for help again.`,
			requestId,
			ctaLabel: "Open request",
			ctaAction: "open_request",
		});
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
		await requireAdmin(ctx);
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

export const adminGetRequest = query({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		await requireAdmin(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc)
			return null;

		const owner = await ctx.db.get("users", doc.ownerUserId);
		const helper = doc.helperUserId ? await ctx.db.get("users", doc.helperUserId) : null;
		const assignedHelper = doc.assignedHelperUserId
			? await ctx.db.get("users", doc.assignedHelperUserId)
			: null;

		// Messages including admin_note (admin can see all)
		const messages = await ctx.db
			.query("requestMessages")
			.withIndex("by_request", q => q.eq("requestId", requestId))
			.order("asc")
			.take(100);

		return {
			...doc,
			owner: publicUserSummary(owner),
			helper: publicUserSummary(helper),
			assignedHelper: publicUserSummary(assignedHelper),
			messages,
		};
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

export const adminUpdateRequest = mutation({
	args: {
		requestId: v.id("helpRequests"),
		title: v.optional(v.string()),
		summary: v.optional(v.string()),
		details: v.optional(v.string()),
		category: v.optional(requestCategory),
	},
	handler: async (ctx, { requestId, title, summary, details, category }) => {
		const identity = await requireIdentity(ctx);
		if (!isAdminIdentity(identity)) {
			throw new Error("Forbidden");
		}
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc) {
			throw new Error("Request not found.");
		}
		const patch: {
			title?: string;
			summary?: string;
			details?: string;
			category?: Doc<"helpRequests">["category"];
		} = {};
		if (title !== undefined) {
			patch.title = title;
		}
		if (summary !== undefined) {
			patch.summary = summary;
		}
		if (details !== undefined) {
			patch.details = details;
		}
		if (category !== undefined) {
			patch.category = category;
		}
		await ctx.db.patch("helpRequests", requestId, patch);
	},
});

export const adminDeleteRequest = mutation({
	args: { requestId: v.id("helpRequests") },
	// Hard delete chosen for the initial version: the row and its dependents
	// (messages, notifications) are removed via purgeRequest. This can be
	// swapped for a soft delete later without changing this signature — see
	// the note on purgeRequest.
	handler: async (ctx, { requestId }) => {
		const identity = await requireIdentity(ctx);
		if (!isAdminIdentity(identity)) {
			throw new Error("Forbidden");
		}
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc) {
			throw new Error("Request not found.");
		}
		await purgeRequest(ctx, requestId);
	},
});

export const create = mutation({
	args: {
		category: requestCategory,
		title: v.string(),
		summary: v.string(),
		details: v.string(),
		payload: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { user } = await getOrCreateCurrentUser(ctx);

		const coords = extractPayloadCoordinates(args.category, args.payload);
		const requestId = await ctx.db.insert("helpRequests", {
			ownerUserId: user._id,
			category: args.category,
			title: args.title,
			summary: args.summary,
			details: args.details,
			status: "pending",
			payload: args.payload,
			needsDelivery: extractNeedsDelivery(args.category, args.payload),
			isUrgent: extractIsUrgent(args.payload),
			...(coords != null
				? { locationLat: coords.lat, locationLng: coords.lng }
				: {}),
		});

		if (coords == null) {
			const address = extractGeocodableAddress(args.category, args.payload);
			if (address != null) {
				await ctx.scheduler.runAfter(0, internal.requestGeocode.geocodeRequest, {
					requestId,
					address,
				});
			}
		}

		return requestId;
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
			const previousStatus = doc.status;
			const helperUserId = doc.helperUserId;
			const assignedHelperUserId = doc.assignedHelperUserId;
			await ctx.db.patch("helpRequests", requestId, { status: "cancelled" });
			await markNotificationsReadForRequest(
				ctx,
				requestId,
				n =>
					n.type === "volunteer_assigned"
					|| n.type === "requester_accept_match_prompt"
					|| n.type === "volunteer_offered_help",
			);
			const notifyHelperIds = new Set<Id<"users">>();
			if (
				previousStatus === "awaiting_requester_acceptance"
				|| previousStatus === "in_progress"
			) {
				if (helperUserId) {
					notifyHelperIds.add(helperUserId);
				}
			}
			if (previousStatus === "assigned" && assignedHelperUserId) {
				notifyHelperIds.add(assignedHelperUserId);
			}
			for (const recipientUserId of notifyHelperIds) {
				await createNotification(ctx, {
					recipientUserId,
					type: "request_cancelled",
					title: "Request cancelled",
					body: `The requester cancelled "${doc.title}".`,
					requestId,
				});
			}
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

export const adminMarkComplete = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		await requireAdmin(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc)
			throw new Error("Request not found.");
		if (doc.status !== "in_progress") {
			throw new Error("Only in-progress requests can be marked complete.");
		}
		await ctx.db.patch("helpRequests", requestId, { status: "complete" });

		// Notify the request owner
		await createNotification(ctx, {
			recipientUserId: doc.ownerUserId,
			type: "help_request_completed",
			title: "Request marked complete",
			body: `A coordinator marked "${doc.title}" complete.`,
			requestId,
		});
		// Notify the helper if one is assigned
		if (doc.helperUserId) {
			await createNotification(ctx, {
				recipientUserId: doc.helperUserId,
				type: "help_request_completed",
				title: "Request marked complete",
				body: `A coordinator marked "${doc.title}" complete.`,
				requestId,
			});
		}
	},
});

export const adminCancelRequest = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		await requireAdmin(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc)
			throw new Error("Request not found.");
		if (doc.status === "complete" || doc.status === "cancelled") {
			throw new Error("Cannot cancel a completed or already-cancelled request.");
		}
		await ctx.db.patch("helpRequests", requestId, { status: "cancelled" });

		// Notify the request owner
		await createNotification(ctx, {
			recipientUserId: doc.ownerUserId,
			type: "request_cancelled",
			title: "Request cancelled by coordinator",
			body: `A coordinator cancelled "${doc.title}".`,
			requestId,
		});
		// Notify the helper if one is assigned
		if (doc.helperUserId) {
			await createNotification(ctx, {
				recipientUserId: doc.helperUserId,
				type: "request_cancelled",
				title: "Request cancelled by coordinator",
				body: `A coordinator cancelled "${doc.title}".`,
				requestId,
			});
		}
	},
});

export const adminAddNote = mutation({
	args: { requestId: v.id("helpRequests"), body: v.string() },
	handler: async (ctx, { requestId, body }) => {
		await requireAdmin(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc)
			throw new Error("Request not found.");
		const trimmed = body.trim();
		if (trimmed.length === 0)
			throw new Error("Note cannot be empty.");
		await ctx.db.insert("requestMessages", {
			requestId,
			body: trimmed,
			source: "admin_note",
		});
	},
});

export const adminToggleUrgent = mutation({
	args: { requestId: v.id("helpRequests"), isUrgent: v.boolean() },
	handler: async (ctx, { requestId, isUrgent }) => {
		await requireAdmin(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc)
			throw new Error("Request not found.");
		await ctx.db.patch("helpRequests", requestId, { isUrgent });
	},
});

export const adminUpdatePayload = mutation({
	args: { requestId: v.id("helpRequests"), payload: v.string() },
	handler: async (ctx, { requestId, payload }) => {
		await requireAdmin(ctx);
		const doc = await ctx.db.get("helpRequests", requestId);
		if (!doc)
			throw new Error("Request not found.");
		await ctx.db.patch("helpRequests", requestId, { payload });
	},
});
