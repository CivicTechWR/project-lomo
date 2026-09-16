import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { haversineDistanceKm } from "../lib/geo";
import { extractNeedsDelivery, resolveIsUrgent } from "../lib/requestMetadata";
import { redactHelpRequestForVolunteer } from "../redactHelpRequest";

const NAME_SPLIT_RE = /\s+/;

export type NotificationType
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

export type NotificationCtaAction
	= | "open_request"
		| "open_offer_request"
		| "open_request_thread"
		| "open_offer_thread";

export function randomRelayToken(): string {
	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

export async function createNotification(ctx: MutationCtx, args: {
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

export function volunteerLabelForNotification(helper: {
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

export function firstNameForDisplay(user: {
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

export function publicUserSummary(user: Doc<"users"> | null) {
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

export interface HelpArea {
	centerLat: number;
	centerLng: number;
	radiusKm: number;
}

export function helpAreaFromUser(userRow: {
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

export function enrichOpenRequestForHelper(
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
	profileHelpArea: HelpArea | null,
	distanceArea: HelpArea | null = profileHelpArea,
) {
	const needsDelivery = r.needsDelivery ?? extractNeedsDelivery(r.category, r.payload);
	const isUrgent = resolveIsUrgent(r);
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

export function matchesLocationFilter(
	r: { locationLat?: number; locationLng?: number },
	filter: HelpArea,
): boolean {
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

export function compareOpenRequestsForHelper(
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
