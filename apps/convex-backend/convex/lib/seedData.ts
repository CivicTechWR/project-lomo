/**
 * DEV-ONLY seed data for the admin dashboard.
 *
 * Pure data — no Convex APIs. The seeder in `convex/seed.ts` imports these
 * lists and inserts them. Every seeded user carries the `seed:` subject/token
 * prefix so the seeder can clear and re-run idempotently without touching real
 * users or requests created through the app.
 *
 * Requests and notifications reference users by a stable local `handle` (e.g.
 * `vol-amara`), NOT by document id — the seeder resolves handles to the
 * `Id<"users">` values produced at insert time.
 */

import type { Infer } from "convex/values";
import type { notificationCtaAction, notificationType, requestCategory, requestMessageSource, requestStatus } from "../schema";

export const SEED_PREFIX = "seed:";

type Status = Infer<typeof requestStatus>;
type Category = Infer<typeof requestCategory>;
type MessageSource = Infer<typeof requestMessageSource>;
type NotificationType = Infer<typeof notificationType>;
type CtaAction = Infer<typeof notificationCtaAction>;

export interface SeedUser {
	/** Stable local id used to wire up requests/notifications. */
	handle: string;
	name: string;
	firstName: string;
	email: string;
	pronouns: string;
	/**
	 * The "I can offer support" toggle from helper preferences. Omitted or false
	 * puts a volunteer in the **Resting** status.
	 *
	 * Only meaningful for users in `VOLUNTEERS` — a requester is a **Member**
	 * regardless, because status derivation checks `isVolunteer` first.
	 */
	canHelpNow?: boolean;
	/**
	 * Admin-set restriction. Derives the **Blocked** status, which overrides
	 * Volunteer/Resting/Member. There is no self-service path to this field, so
	 * seeding it is the only way to see that status without using the admin UI.
	 */
	blocked?: boolean;
}

export interface SeedRequest {
	ownerHandle: string;
	category: Category;
	title: string;
	summary: string;
	details: string;
	status: Status;
	assignedHelperHandle?: string;
	helperHandle?: string;
	emailRelayToken?: string;
	/**
	 * Whether the request carries the Urgent flag.
	 *
	 * Set explicitly here rather than inferred: in the app `isUrgent` is
	 * denormalized out of the request payload by `extractIsUrgent`, but seeded
	 * requests have no payload, so without this field every fixture would be
	 * non-urgent and the Urgent badge would never appear.
	 */
	isUrgent?: boolean;
	/**
	 * Days from seed time until the deadline; the seeder resolves it to an
	 * end-of-day timestamp. Relative rather than absolute so the fixtures stay
	 * meaningful whenever the seed is run.
	 *
	 * Negative values are already overdue. Omit entirely for "no fixed date",
	 * which is a valid answer and must stay represented in the fixtures.
	 */
	neededByInDays?: number;
	/** Whether the deadline came from a window ("this week") rather than an exact date. */
	neededByFlexible?: boolean;
}

export interface SeedNotification {
	recipientHandle: string;
	type: NotificationType;
	title: string;
	body: string;
	/** Title of the seeded request this notification points at, if any. */
	requestTitle?: string;
	isRead: boolean;
	ctaLabel?: string;
	ctaAction?: CtaAction;
}

export interface SeedMessage {
	/** Title of the request this message belongs to. */
	requestTitle: string;
	/** Handle of the author (omit for system/anonymous messages). */
	authorHandle?: string;
	body: string;
	source: MessageSource;
}

export interface SeedAdminSettings {
	key: string;
	attentionThresholdDays: number;
	notifyOnNewPending: boolean;
	notifyOnConcernReport: boolean;
	notifyOnCancellation: boolean;
}

// Volunteer profiles. `handle` doubles as a stable id so re-runs are clean.
//
// Between these and REQUESTERS every derived user status is represented, so the
// admin user list has something in each filter bucket:
//   Volunteer → vol-amara, vol-devin   (isVolunteer + canHelpNow)
//   Resting   → vol-rosa               (isVolunteer, canHelpNow off)
//   Member    → req-jordan, req-sam    (not volunteers)
//   Blocked   → req-morgan             (blocked overrides everything else)
export const VOLUNTEERS: SeedUser[] = [
	{ handle: "vol-amara", name: "Amara Okafor", firstName: "Amara", email: "amara@example.test", pronouns: "she/her", canHelpNow: true },
	{ handle: "vol-devin", name: "Devin Park", firstName: "Devin", email: "devin@example.test", pronouns: "they/them", canHelpNow: true },
	// Taking a break: still matched to a seeded in-progress request, which is the
	// realistic case — resting stops new offers, it does not abandon commitments.
	{ handle: "vol-rosa", name: "Rosa Mendez", firstName: "Rosa", email: "rosa@example.test", pronouns: "she/her", canHelpNow: false },
];

// Requester accounts (not volunteers) so requests have realistic owners.
export const REQUESTERS: SeedUser[] = [
	{ handle: "req-jordan", name: "Jordan Lee", firstName: "Jordan", email: "jordan@example.test", pronouns: "he/him" },
	{ handle: "req-sam", name: "Sam Carter", firstName: "Sam", email: "sam@example.test", pronouns: "they/them" },
	// Blocked account. Owns no seeded requests: blocking cancels a user's active
	// requests, so a blocked owner with live requests would be an impossible state.
	{ handle: "req-morgan", name: "Morgan Ellis", firstName: "Morgan", email: "morgan@example.test", pronouns: "she/her", blocked: true },
];

// Requests spread across categories and statuses so every part of the
// admin dashboard renders (pending → assignable, plus later states).
//
// Deadlines deliberately cover every case the deadline alert has to distinguish:
// overdue-and-unmatched, due-imminently-and-unmatched, comfortably far off,
// flexible windows, and no deadline at all.
export const REQUESTS: SeedRequest[] = [
	{
		ownerHandle: "req-jordan",
		category: "food",
		title: "Groceries for the week",
		summary: "Need help picking up a grocery order",
		details: "Recovering from surgery and can't carry bags up the stairs. A pickup from the corner store would be a huge help.",
		status: "pending",
		// Unmatched and due tomorrow — the case the deadline alert exists to catch.
		neededByInDays: 1,
		// Urgent + unmatched: the combination that should surface most loudly.
		isUrgent: true,
	},
	{
		ownerHandle: "req-sam",
		category: "items",
		title: "Borrow a folding table",
		summary: "Folding table for a weekend event",
		details: "Hosting a small community potluck and need one folding table for Saturday afternoon.",
		status: "pending",
		// Flexible window, comfortably far out — should not alert.
		neededByInDays: 6,
		neededByFlexible: true,
		// Explicitly not urgent, so the pending list shows both kinds side by side.
		isUrgent: false,
	},
	{
		ownerHandle: "req-jordan",
		category: "support",
		title: "Walk to the clinic",
		summary: "Company for a daytime walk to an appointment",
		details: "Would appreciate someone to walk with me to a 10am clinic appointment on Tuesday.",
		status: "assigned",
		assignedHelperHandle: "vol-amara",
		// Imminent but already matched — proves the alert checks for a helper, not
		// just the date.
		neededByInDays: 2,
	},
	{
		ownerHandle: "req-sam",
		category: "paperwork",
		title: "Microgrant application review",
		summary: "Second pair of eyes on a grant form",
		details: "I've filled out a microgrant application and would like someone to review it before I submit.",
		status: "awaiting_requester_acceptance",
		assignedHelperHandle: "vol-devin",
		helperHandle: "vol-devin",
		neededByInDays: 9,
	},
	{
		ownerHandle: "req-jordan",
		category: "ceremony",
		title: "Help setting up a small ceremony",
		summary: "Setup help for a family ceremony",
		details: "Need a couple of helping hands to set up chairs and a small table for a family ceremony this weekend.",
		status: "in_progress",
		assignedHelperHandle: "vol-rosa",
		helperHandle: "vol-rosa",
		emailRelayToken: "seedrelaytoken01",
		neededByInDays: 3,
		neededByFlexible: true,
		// Urgent and already in progress — proves the badge is about the request,
		// not about whether anyone has picked it up.
		isUrgent: true,
	},
	{
		ownerHandle: "req-sam",
		category: "other",
		title: "Move a couch across town",
		summary: "Help moving a couch",
		details: "Moving a couch from one apartment to another about 2km away. Already have a vehicle, just need an extra set of hands.",
		status: "complete",
		assignedHelperHandle: "vol-amara",
		helperHandle: "vol-amara",
	},
	{
		ownerHandle: "req-jordan",
		category: "food",
		title: "Meal prep assistance",
		summary: "Help preparing meals for the week",
		details: "Dealing with a wrist injury and could use help chopping vegetables and prepping meals for the week.",
		status: "pending",
		// Already overdue and still unmatched — the most urgent combination.
		//
		// This request previously carried an `isOld` flag intended to backdate
		// `_creationTime` and trigger the age-based attention list, but Convex owns
		// `_creationTime` and the seeder never read the flag, so it did nothing.
		// A past deadline is seedable and expresses the same "needs attention now"
		// intent honestly.
		neededByInDays: -2,
		isUrgent: true,
	},
	{
		ownerHandle: "req-sam",
		category: "support",
		title: "Practice English conversation",
		summary: "Looking for conversation practice",
		details: "Would love to practice everyday English with someone over coffee once a week.",
		status: "cancelled",
		// No deadline at all: an ongoing, open-ended ask. Must never be alertable.
	},
];

// A couple of notifications targeting seeded volunteers, so the notifications
// table isn't empty for matched accounts.
export const NOTIFICATIONS: SeedNotification[] = [
	{
		recipientHandle: "vol-amara",
		type: "volunteer_assigned",
		title: "You were matched to a request",
		body: "Open LoMo to accept or decline this request.",
		requestTitle: "Walk to the clinic",
		isRead: false,
		ctaLabel: "Review assignment",
		ctaAction: "open_offer_request",
	},
	{
		recipientHandle: "vol-devin",
		type: "requester_accept_match_prompt",
		title: "Waiting on the requester",
		body: "The requester is reviewing your offer.",
		requestTitle: "Microgrant application review",
		isRead: false,
	},
	{
		recipientHandle: "vol-rosa",
		type: "volunteer_assigned",
		title: "You were matched to a request",
		body: "You've been assigned to help with a ceremony setup.",
		requestTitle: "Help setting up a small ceremony",
		isRead: true,
		ctaLabel: "View request",
		ctaAction: "open_offer_request",
	},
	{
		recipientHandle: "vol-amara",
		type: "help_request_completed",
		title: "Request completed!",
		body: "The couch move has been marked as complete. Thank you for helping!",
		requestTitle: "Move a couch across town",
		isRead: true,
	},
];

// Request messages so the admin detail view has conversation history to display.
// Includes both regular web messages and admin_note entries.
export const MESSAGES: SeedMessage[] = [
	// Conversation on the in_progress ceremony request
	{
		requestTitle: "Help setting up a small ceremony",
		authorHandle: "req-jordan",
		body: "Hi! The ceremony is this Saturday at 2pm in Victoria Park. Does that work for you?",
		source: "web",
	},
	{
		requestTitle: "Help setting up a small ceremony",
		authorHandle: "vol-rosa",
		body: "Saturday at 2 works perfectly. How many chairs do you need set up?",
		source: "web",
	},
	{
		requestTitle: "Help setting up a small ceremony",
		authorHandle: "req-jordan",
		body: "About 20 chairs in a semicircle, plus a small table for the front. I'll have everything in my car.",
		source: "web",
	},
	// Admin note on the ceremony request
	{
		requestTitle: "Help setting up a small ceremony",
		body: "Confirmed with requester that park permit is in order. No follow-up needed.",
		source: "admin_note",
	},
	// Conversation on the assigned clinic walk
	{
		requestTitle: "Walk to the clinic",
		authorHandle: "req-jordan",
		body: "The appointment is at 10am Tuesday at the King St clinic. Can we meet at my place at 9:30?",
		source: "web",
	},
	// Admin note on pending grocery request
	{
		requestTitle: "Groceries for the week",
		body: "Requester mentioned mobility issues — may need delivery rather than just pickup. Flag for careful matching.",
		source: "admin_note",
	},
	// Message on the completed couch request
	{
		requestTitle: "Move a couch across town",
		authorHandle: "vol-amara",
		body: "All done! The couch is in place. Let me know if you need anything else.",
		source: "web",
	},
	{
		requestTitle: "Move a couch across town",
		authorHandle: "req-sam",
		body: "Thank you so much Amara! You're amazing 🙏",
		source: "web",
	},
	// Admin note on the old attention-triggering request
	{
		requestTitle: "Meal prep assistance",
		body: "This request has been pending for over a week. Reaching out to volunteers with food category preference.",
		source: "admin_note",
	},
];

// Default admin settings so the settings page renders with values immediately.
export const ADMIN_SETTINGS: SeedAdminSettings = {
	key: "global",
	attentionThresholdDays: 5,
	notifyOnNewPending: true,
	notifyOnConcernReport: true,
	notifyOnCancellation: true,
};
