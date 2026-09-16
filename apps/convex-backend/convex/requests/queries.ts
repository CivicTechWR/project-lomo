import type { HelpArea } from "./helpers";
import { v } from "convex/values";
import { query } from "../_generated/server";
import { requireAdmin } from "../lib/adminAuth";
import {
	getCurrentUserRow,
	getIdentity,
	isAdminIdentity,
	requireIdentity,
} from "../lib/currentUser";
import { resolveIsUrgent } from "../lib/requestMetadata";
import { canOfferHelp, isBlocked } from "../lib/userStatus";
import { redactHelpRequestForVolunteer } from "../redactHelpRequest";
import { requestStatus } from "../schema";
import {
	compareOpenRequestsForHelper,
	enrichOpenRequestForHelper,
	firstNameForDisplay,

	helpAreaFromUser,
	matchesLocationFilter,
	publicUserSummary,
} from "./helpers";

interface Identity {
	subject: string;
	email?: string;
	name?: string;
	pictureUrl?: string;
}

const MAX_LIST_ROWS = 100;
const MAX_ADMIN_ROWS = 200;

const ACTIVE_HOME_STATUSES = new Set([
	"in_progress",
	"awaiting_requester_acceptance",
]);

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

		return rows.map(r => ({
			...r,
			isUrgent: resolveIsUrgent(r),
		}));
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
		if (!canOfferHelp(user)) {
			return [];
		}
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
			.filter((r) => {
				if (filterArea == null) {
					return true;
				}
				if (resolveIsUrgent(r)) {
					return true;
				}
				return matchesLocationFilter(r, filterArea);
			})
			.map(r => enrichOpenRequestForHelper(
				r,
				profileHelpArea,
				filterArea ?? profileHelpArea,
			));

		open.sort(compareOpenRequestsForHelper);
		return open.map(({ distanceKm: _distanceKm, ...item }) => item);
	},
});

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
				isUrgent: resolveIsUrgent(r),
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
				isUrgent: resolveIsUrgent(r),
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
				isUrgent: resolveIsUrgent(r),
			}));

		const pendingMineTotal = owned.filter(r => r.status === "pending").length;

		const userRow = user;
		const canHelpNow = canOfferHelp(userRow);
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
			return {
				...redactHelpRequestForVolunteer(doc),
				isUrgent: resolveIsUrgent(doc),
			};
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
			.filter(u => u.isVolunteer !== false && !isBlocked(u))
			.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
	},
});
