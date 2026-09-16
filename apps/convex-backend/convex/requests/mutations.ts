import type { Doc, Id } from "../_generated/dataModel";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { mutation } from "../_generated/server";
import { requireAdmin } from "../lib/adminAuth";
import {
	getOrCreateCurrentUser,
	isAdminIdentity,
	requireIdentity,
} from "../lib/currentUser";
import { markNotificationsReadForRequest } from "../lib/notificationHelpers";
import { purgeRequest } from "../lib/purgeRequest";
import { extractGeocodableAddress, extractPayloadCoordinates } from "../lib/requestLocation";
import { extractNeededBy, extractNeedsDelivery, resolveIsUrgent } from "../lib/requestMetadata";
import { assertNotBlocked, canOfferHelp, isBlocked } from "../lib/userStatus";
import { requestCategory } from "../schema";
import {
	createNotification,
	randomRelayToken,
	volunteerLabelForNotification,
} from "./helpers";

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
		assertNotBlocked(user);

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
			isUrgent: resolveIsUrgent({
				payload: args.payload,
				details: args.details,
				summary: args.summary,
			}),
			...extractNeededBy(args.payload),
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

export const accept = mutation({
	args: { requestId: v.id("helpRequests") },
	handler: async (ctx, { requestId }) => {
		const { user } = await getOrCreateCurrentUser(ctx);
		assertNotBlocked(user);
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
		assertNotBlocked(user);
		if (!canOfferHelp(user)) {
			throw new Error(
				"You're currently resting. Turn \"I can offer support\" back on in your profile to help again.",
			);
		}
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
		if (isBlocked(volunteer)) {
			throw new Error("This account is blocked and cannot be assigned.");
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

		await createNotification(ctx, {
			recipientUserId: doc.ownerUserId,
			type: "help_request_completed",
			title: "Request marked complete",
			body: `A coordinator marked "${doc.title}" complete.`,
			requestId,
		});
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

		await createNotification(ctx, {
			recipientUserId: doc.ownerUserId,
			type: "request_cancelled",
			title: "Request cancelled by coordinator",
			body: `A coordinator cancelled "${doc.title}".`,
			requestId,
		});
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
