/**
 * DEV-ONLY seed data for the admin dashboard.
 *
 * Pure data — no Convex APIs. The seeder in `convex/seed.ts` imports these
 * lists and inserts them. Every owned row uses the `seed:` subject prefix so
 * the seeder can clear and re-run idempotently without touching real users or
 * requests created through the app.
 */

import type { Infer } from "convex/values";
import type { requestStatus } from "../schema";

export const SEED_PREFIX = "seed:";

type Status = Infer<typeof requestStatus>;

export interface SeedUser {
	subject: string;
	name: string;
	firstName: string;
	email: string;
	pronouns: string;
}

export interface SeedRequest {
	ownerSubject: string;
	category: string;
	title: string;
	summary: string;
	details: string;
	status: Status;
	assignedHelperSubject?: string;
	helperSubject?: string;
	emailRelayToken?: string;
}

// Volunteer profiles. `subject` doubles as a stable id so re-runs are clean.
export const VOLUNTEERS: SeedUser[] = [
	{ subject: `${SEED_PREFIX}vol-amara`, name: "Amara Okafor", firstName: "Amara", email: "amara@example.test", pronouns: "she/her" },
	{ subject: `${SEED_PREFIX}vol-devin`, name: "Devin Park", firstName: "Devin", email: "devin@example.test", pronouns: "they/them" },
	{ subject: `${SEED_PREFIX}vol-rosa`, name: "Rosa Mendez", firstName: "Rosa", email: "rosa@example.test", pronouns: "she/her" },
];

// Requester accounts (not volunteers) so requests have realistic owners.
export const REQUESTERS: SeedUser[] = [
	{ subject: `${SEED_PREFIX}req-jordan`, name: "Jordan Lee", firstName: "Jordan", email: "jordan@example.test", pronouns: "he/him" },
	{ subject: `${SEED_PREFIX}req-sam`, name: "Sam Carter", firstName: "Sam", email: "sam@example.test", pronouns: "they/them" },
];

// Requests spread across categories and statuses so every part of the
// admin dashboard renders (pending → assignable, plus later states).
export const REQUESTS: SeedRequest[] = [
	{
		ownerSubject: `${SEED_PREFIX}req-jordan`,
		category: "food",
		title: "Groceries for the week",
		summary: "Need help picking up a grocery order",
		details: "Recovering from surgery and can't carry bags up the stairs. A pickup from the corner store would be a huge help.",
		status: "pending",
	},
	{
		ownerSubject: `${SEED_PREFIX}req-sam`,
		category: "items",
		title: "Borrow a folding table",
		summary: "Folding table for a weekend event",
		details: "Hosting a small community potluck and need one folding table for Saturday afternoon.",
		status: "pending",
	},
	{
		ownerSubject: `${SEED_PREFIX}req-jordan`,
		category: "support",
		title: "Walk to the clinic",
		summary: "Company for a daytime walk to an appointment",
		details: "Would appreciate someone to walk with me to a 10am clinic appointment on Tuesday.",
		status: "assigned",
		assignedHelperSubject: `${SEED_PREFIX}vol-amara`,
	},
	{
		ownerSubject: `${SEED_PREFIX}req-sam`,
		category: "paperwork",
		title: "Microgrant application review",
		summary: "Second pair of eyes on a grant form",
		details: "I've filled out a microgrant application and would like someone to review it before I submit.",
		status: "awaiting_requester_acceptance",
		assignedHelperSubject: `${SEED_PREFIX}vol-devin`,
	},
	{
		ownerSubject: `${SEED_PREFIX}req-jordan`,
		category: "ceremony",
		title: "Help setting up a small ceremony",
		summary: "Setup help for a family ceremony",
		details: "Need a couple of helping hands to set up chairs and a small table for a family ceremony this weekend.",
		status: "in_progress",
		assignedHelperSubject: `${SEED_PREFIX}vol-rosa`,
		helperSubject: `${SEED_PREFIX}vol-rosa`,
		emailRelayToken: "seedrelaytoken01",
	},
	{
		ownerSubject: `${SEED_PREFIX}req-sam`,
		category: "other",
		title: "Move a couch across town",
		summary: "Help moving a couch",
		details: "Moving a couch from one apartment to another about 2km away. Already have a vehicle, just need an extra set of hands.",
		status: "complete",
		assignedHelperSubject: `${SEED_PREFIX}vol-amara`,
		helperSubject: `${SEED_PREFIX}vol-amara`,
	},
];
