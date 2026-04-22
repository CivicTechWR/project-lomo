import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const requestStatus = v.union(
	v.literal("pending"),
	v.literal("assigned"),
	v.literal("awaiting_requester_acceptance"),
	v.literal("rejected"),
	v.literal("in_progress"),
	v.literal("complete"),
	v.literal("cancelled"),
);

export const notificationType = v.union(
	v.literal("volunteer_assigned"),
	v.literal("volunteer_assignment_declined"),
	v.literal("volunteer_accepted_match"),
	v.literal("requester_accept_match_prompt"),
	v.literal("requester_declined_match"),
	v.literal("volunteer_offered_help"),
	v.literal("help_request_completed"),
	v.literal("request_new_message"),
);

export const requestMessageSource = v.union(
	v.literal("web"),
	v.literal("email"),
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
			/** Set by admin when matching a volunteer helper. */
			assignedHelperSubject: v.optional(v.string()),
			category: v.string(),
			title: v.string(),
			summary: v.string(),
			details: v.string(),
			status: requestStatus,
			/** Optional JSON payload for structured client data (e.g. food draft). */
			payload: v.optional(v.string()),
			/**
			 * Opaque token for masked email relay (local-part only; domain from EMAIL_RELAY_DOMAIN).
			 * Set when the requester accepts the match (in_progress).
			 */
			emailRelayToken: v.optional(v.string()),
		})
			.index("by_owner", ["ownerSubject"])
			.index("by_status", ["status"])
			.index("by_assigned_helper", ["assignedHelperSubject"])
			.index("by_email_relay_token", ["emailRelayToken"]),

		requestMessages: defineTable({
			requestId: v.id("helpRequests"),
			/** Present for web posts and for email relay once sender is matched to a subject. */
			authorSubject: v.optional(v.string()),
			body: v.string(),
			source: requestMessageSource,
		}).index("by_request", ["requestId"]),

		processedInboundEmails: defineTable({
			/** Resend `email_id` from webhook / receiving API — idempotency for retries. */
			resendEmailId: v.string(),
		}).index("by_resend_email_id", ["resendEmailId"]),

		users: defineTable({
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
		}).index("by_subject", ["subject"]),

		notifications: defineTable({
			recipientSubject: v.string(),
			type: notificationType,
			title: v.string(),
			body: v.string(),
			requestId: v.optional(v.id("helpRequests")),
			isRead: v.boolean(),
			ctaLabel: v.optional(v.string()),
			ctaAction: v.optional(v.string()),
		})
			.index("by_recipient", ["recipientSubject"])
			.index("by_recipient_read", ["recipientSubject", "isRead"]),
	},
	{ schemaValidation: true },
);
