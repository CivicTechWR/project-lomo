import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { internalMutation } from "./_generated/server";
import { REQUESTERS, REQUESTS, SEED_PREFIX, VOLUNTEERS } from "./lib/seedData";

/**
 * DEV-ONLY data seeder for the admin dashboard.
 *
 * Internal mutation — not exposed on the public API, so it can only be invoked
 * from the CLI (`npx convex run seed:run`) or another Convex function, never
 * from the client.
 *
 * Idempotent: clears the seeded rows (users/helpRequests/notifications matched
 * by the `seed:` subject prefix) before reinserting, so you can re-run it
 * freely. It does NOT touch real auth users or requests you create through the
 * app.
 *
 * Seed data lives in `convex/lib/seedData.ts`.
 */

function isSeeded(value: string | undefined): boolean {
	return value !== undefined && value.startsWith(SEED_PREFIX);
}

async function clearSeeded(ctx: MutationCtx) {
	for (const user of await ctx.db.query("users").collect()) {
		if (isSeeded(user.subject)) {
			await ctx.db.delete("users", user._id);
		}
	}
	for (const request of await ctx.db.query("helpRequests").collect()) {
		if (isSeeded(request.ownerSubject)) {
			await ctx.db.delete("helpRequests", request._id);
		}
	}
	for (const notification of await ctx.db.query("notifications").collect()) {
		if (isSeeded(notification.recipientSubject)) {
			await ctx.db.delete("notifications", notification._id);
		}
	}
}

export const run = internalMutation({
	args: {},
	handler: async (ctx) => {
		await clearSeeded(ctx);

		for (const u of [...VOLUNTEERS, ...REQUESTERS]) {
			await ctx.db.insert("users", {
				subject: u.subject,
				name: u.name,
				firstName: u.firstName,
				email: u.email,
				pronouns: u.pronouns,
				isVolunteer: VOLUNTEERS.some(v => v.subject === u.subject),
			});
		}

		// Insert requests, keyed by title so notifications can reference them
		// without relying on array positions.
		const requestIdByTitle = new Map<string, Id<"helpRequests">>();
		for (const r of REQUESTS) {
			const id = await ctx.db.insert("helpRequests", r);
			requestIdByTitle.set(r.title, id);
		}

		// A couple of notifications targeting seeded volunteers, so the
		// notifications table isn't empty for matched accounts.
		await ctx.db.insert("notifications", {
			recipientSubject: `${SEED_PREFIX}vol-amara`,
			type: "volunteer_assigned",
			title: "You were matched to a request",
			body: "Open LoMo to accept or decline this request.",
			requestId: requestIdByTitle.get("Walk to the clinic"),
			isRead: false,
			ctaLabel: "Review assignment",
			ctaAction: "open_offer_request",
		});
		await ctx.db.insert("notifications", {
			recipientSubject: `${SEED_PREFIX}vol-devin`,
			type: "requester_accept_match_prompt",
			title: "Waiting on the requester",
			body: "The requester is reviewing your offer.",
			requestId: requestIdByTitle.get("Microgrant application review"),
			isRead: false,
		});

		return {
			volunteers: VOLUNTEERS.length,
			requesters: REQUESTERS.length,
			requests: REQUESTS.length,
		};
	},
});

/** Removes all seeded rows without reinserting. */
export const clear = internalMutation({
	args: {},
	handler: async (ctx) => {
		await clearSeeded(ctx);
		return { cleared: true };
	},
});
