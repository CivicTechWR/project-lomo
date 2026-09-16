import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const requestStatus = v.union(
	v.literal("pending"),
	v.literal("assigned"),
	v.literal("awaiting_requester_acceptance"),
	v.literal("in_progress"),
	v.literal("complete"),
	v.literal("cancelled"),
);

export const requestCategory = v.union(
	v.literal("food"),
	v.literal("items"),
	v.literal("other"),
	v.literal("support"),
	v.literal("paperwork"),
	v.literal("ceremony"),
);

export const notificationType = v.union(
	v.literal("volunteer_assigned"),
	v.literal("volunteer_assignment_declined"),
	v.literal("volunteer_accepted_match"),
	v.literal("requester_accept_match_prompt"),
	v.literal("requester_declined_match"),
	v.literal("volunteer_offered_help"),
	v.literal("volunteer_withdrew_offer"),
	v.literal("help_request_completed"),
	v.literal("request_cancelled"),
	v.literal("request_new_message"),
);

export const notificationCtaAction = v.union(
	v.literal("open_request"),
	v.literal("open_offer_request"),
	v.literal("open_request_thread"),
	v.literal("open_offer_thread"),
);

export const requestMessageSource = v.union(
	v.literal("web"),
	v.literal("email"),
	v.literal("admin_note"),
);

export default defineSchema(
	{
		helpRequests: defineTable({
			ownerUserId: v.id("users"),
			/** Set when someone accepts a pending request (offering help). */
			helperUserId: v.optional(v.id("users")),
			/** Set by admin when matching a volunteer helper. */
			assignedHelperUserId: v.optional(v.id("users")),
			category: requestCategory,
			title: v.string(),
			summary: v.string(),
			details: v.string(),
			status: requestStatus,
			/** Optional JSON payload for structured client data (e.g. food draft). */
			payload: v.optional(v.string()),
			/** Geocoded from address/location in payload when available. */
			locationLat: v.optional(v.number()),
			locationLng: v.optional(v.number()),
			/** Denormalized from payload for volunteer list filters. */
			needsDelivery: v.optional(v.boolean()),
			isUrgent: v.optional(v.boolean()),
			/**
			 * Milliseconds since epoch — the latest moment this help is still useful.
			 *
			 * Denormalized out of `payload` so deadlines are sortable and filterable,
			 * the same reason `locationLat`/`locationLng` are lifted out. Deliberately
			 * a deadline rather than a preferred time: a request answered "flexible
			 * this week" still has a last-useful moment (end of that week), so a
			 * window can be stored without inventing a precise appointment.
			 *
			 * Unset means the requester gave no fixed date, which is a valid answer —
			 * such requests are simply never deadline-urgent.
			 */
			neededBy: v.optional(v.number()),
			/**
			 * True when `neededBy` came from a window ("this week") rather than an
			 * exact date the requester chose. Lets the UI say "sometime this week"
			 * instead of implying false precision.
			 */
			neededByFlexible: v.optional(v.boolean()),
			/**
			 * Opaque token for masked email relay (local-part only; domain from EMAIL_RELAY_DOMAIN).
			 * Set when the requester accepts the match (in_progress).
			 */
			emailRelayToken: v.optional(v.string()),
		})
			.index("by_owner_user_id", ["ownerUserId"])
			.index("by_owner_user_id_and_status", ["ownerUserId", "status"])
			.index("by_status", ["status"])
			/* Finds pending requests whose deadline is approaching. */
			.index("by_status_and_needed_by", ["status", "neededBy"])
			.index("by_helper", ["helperUserId"])
			.index("by_assigned_helper", ["assignedHelperUserId"])
			.index("by_email_relay_token", ["emailRelayToken"]),

		requestMessages: defineTable({
			requestId: v.id("helpRequests"),
			/** Present for web posts and for email relay once sender is matched to a user. */
			authorUserId: v.optional(v.id("users")),
			body: v.string(),
			source: requestMessageSource,
		}).index("by_request", ["requestId"]),

		processedInboundEmails: defineTable({
			/** Resend `email_id` from webhook / receiving API — idempotency for retries. */
			resendEmailId: v.string(),
		}).index("by_resend_email_id", ["resendEmailId"]),

		users: defineTable({
			tokenIdentifier: v.string(),
			subject: v.string(),
			email: v.optional(v.string()),
			name: v.optional(v.string()),
			/** Shown to requesters when you offer to help (falls back to first word of `name`). */
			firstName: v.optional(v.string()),
			pronouns: v.optional(v.string()),
			/** Optional; only shared with someone you are matched with on a request. */
			phone: v.optional(v.string()),
			image: v.optional(v.string()),
			isVolunteer: v.optional(v.boolean()),
			bio: v.optional(v.string()),
			/** Milliseconds since epoch — set when onboarding wizard is finished. */
			onboardingCompletedAt: v.optional(v.number()),
			/** Milliseconds since epoch — safety & boundaries step acknowledged. */
			safetyAcknowledgedAt: v.optional(v.number()),
			/** When false, helper is in "Resting" mode (not available to help right now). */
			canHelpNow: v.optional(v.boolean()),
			helpPreferences: v.optional(v.array(v.string())),
			/** @deprecated Free-text location — use help area coordinates instead. */
			helpLocation: v.optional(v.string()),
			/** Centre of the area where this helper is willing to help. */
			helpAreaCenterLat: v.optional(v.number()),
			helpAreaCenterLng: v.optional(v.number()),
			/** Radius in kilometres (1–30). */
			helpAreaRadiusKm: v.optional(v.number()),
			/** When true, user is blocked from creating requests or sending messages. */
			blocked: v.optional(v.boolean()),
		})
			.index("by_subject", ["subject"])
			.index("by_token_identifier", ["tokenIdentifier"]),

		notifications: defineTable({
			recipientUserId: v.id("users"),
			type: notificationType,
			title: v.string(),
			body: v.string(),
			requestId: v.optional(v.id("helpRequests")),
			isRead: v.boolean(),
			ctaLabel: v.optional(v.string()),
			ctaAction: v.optional(v.string()),
		})
			.index("by_recipient", ["recipientUserId"])
			.index("by_recipient_read", ["recipientUserId", "isRead"])
			.index("by_request", ["requestId"]),

		adminSettings: defineTable({
			/** Well-known key for singleton pattern ("global") */
			key: v.string(),
			/** Days before a pending unmatched request needs attention (1-30) */
			attentionThresholdDays: v.number(),
			/** Notification preferences */
			notifyOnNewPending: v.boolean(),
			notifyOnConcernReport: v.boolean(),
			notifyOnCancellation: v.boolean(),
		}).index("by_key", ["key"]),
	},
	{ schemaValidation: true },
);
