import type { Doc, Id } from "../_generated/dataModel";
import { describe, expect, it } from "bun:test";
import {
	enrichNotification,
	isActionableNotificationStale,
} from "./notificationHelpers";

function notification(
	overrides: Partial<Doc<"notifications">> & Pick<Doc<"notifications">, "type">,
): Doc<"notifications"> {
	return {
		_id: "jn0" as Id<"notifications">,
		_creationTime: 1,
		recipientUserId: "jh_viewer" as Id<"users">,
		title: "t",
		body: "b",
		isRead: false,
		requestId: "jr0" as Id<"helpRequests">,
		...overrides,
	};
}

function request(
	overrides: Partial<Doc<"helpRequests">>,
): Doc<"helpRequests"> {
	return {
		_id: "jr0" as Id<"helpRequests">,
		_creationTime: 1,
		ownerUserId: "jh_owner" as Id<"users">,
		category: "other",
		title: "Need help",
		summary: "s",
		details: "d",
		status: "pending",
		...overrides,
	};
}

const viewer = "jh_viewer" as Id<"users">;
const owner = "jh_owner" as Id<"users">;

describe("isActionableNotificationStale", () => {
	it("marks match-prompt stale after the request leaves awaiting acceptance", () => {
		const n = notification({
			type: "requester_accept_match_prompt",
			recipientUserId: owner,
		});
		const req = request({
			ownerUserId: owner,
			status: "in_progress",
			helperUserId: viewer,
		});
		expect(isActionableNotificationStale(n, req, owner)).toBe(true);
	});

	it("keeps match-prompt actionable while awaiting requester acceptance", () => {
		const n = notification({
			type: "volunteer_offered_help",
			recipientUserId: owner,
		});
		const req = request({
			ownerUserId: owner,
			status: "awaiting_requester_acceptance",
			helperUserId: viewer,
		});
		expect(isActionableNotificationStale(n, req, owner)).toBe(false);
	});

	it("marks volunteer_assigned stale once assignment is no longer pending", () => {
		const n = notification({
			type: "volunteer_assigned",
			recipientUserId: viewer,
		});
		const req = request({
			status: "awaiting_requester_acceptance",
			assignedHelperUserId: viewer,
			helperUserId: viewer,
		});
		expect(isActionableNotificationStale(n, req, viewer)).toBe(true);
	});

	it("does not treat message notifications as actionable-stale", () => {
		const n = notification({ type: "request_new_message" });
		const req = request({ status: "in_progress", helperUserId: viewer, ownerUserId: owner });
		expect(isActionableNotificationStale(n, req, owner)).toBe(false);
	});
});

describe("enrichNotification", () => {
	it("exposes isStale for superseded match prompts", () => {
		const n = notification({
			type: "requester_accept_match_prompt",
			recipientUserId: owner,
			ctaAction: "open_request",
		});
		const req = request({
			ownerUserId: owner,
			status: "in_progress",
			helperUserId: viewer,
		});
		const enriched = enrichNotification(n, req, owner);
		expect(enriched.isStale).toBe(true);
		expect(enriched.canRequesterReviewOffer).toBe(false);
	});
});
