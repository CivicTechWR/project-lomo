import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { internalMutation } from "./_generated/server";
import { NOTIFICATIONS, REQUESTERS, REQUESTS, SEED_PREFIX, VOLUNTEERS } from "./lib/seedData";

/**
 * DEV-ONLY data seeder for the admin dashboard.
 *
 * Internal mutation — not exposed on the public API, so it can only be invoked
 * from the CLI (`npx convex run seed:run`) or another Convex function, never
 * from the client.
 *
 * Idempotent: clears the seeded rows before reinserting, so you can re-run it
 * freely. Seeded users are matched by the `seed:` subject prefix; the requests
 * and notifications they own are cleared by walking back to those user ids. It
 * does NOT touch real auth users or requests you create through the app.
 *
 * Seed data lives in `convex/lib/seedData.ts`.
 */

function isSeeded(value: string | undefined): boolean {
	return value !== undefined && value.startsWith(SEED_PREFIX);
}

async function clearSeeded(ctx: MutationCtx) {
	// Collect seeded user ids first so we can find the rows that reference them.
	const seededUserIds = new Set<string>();
	for (const user of await ctx.db.query("users").collect()) {
		if (isSeeded(user.subject)) {
			seededUserIds.add(user._id);
		}
	}

	for (const notification of await ctx.db.query("notifications").collect()) {
		if (seededUserIds.has(notification.recipientUserId)) {
			await ctx.db.delete("notifications", notification._id);
		}
	}

	for (const request of await ctx.db.query("helpRequests").collect()) {
		if (seededUserIds.has(request.ownerUserId)) {
			await ctx.db.delete("helpRequests", request._id);
		}
	}

	for (const userId of seededUserIds) {
		await ctx.db.delete("users", userId as Id<"users">);
	}
}

export const run = internalMutation({
	args: {},
	handler: async (ctx) => {
		await clearSeeded(ctx);

		// Insert users, keyed by handle so requests/notifications can resolve the
		// generated document ids.
		const userIdByHandle = new Map<string, Id<"users">>();
		for (const u of [...VOLUNTEERS, ...REQUESTERS]) {
			const id = await ctx.db.insert("users", {
				tokenIdentifier: `${SEED_PREFIX}${u.handle}`,
				subject: `${SEED_PREFIX}${u.handle}`,
				name: u.name,
				firstName: u.firstName,
				email: u.email,
				pronouns: u.pronouns,
				isVolunteer: VOLUNTEERS.some(v => v.handle === u.handle),
			});
			userIdByHandle.set(u.handle, id);
		}

		function requireUser(handle: string): Id<"users"> {
			const id = userIdByHandle.get(handle);
			if (!id) {
				throw new Error(`Seed data references unknown user handle: ${handle}`);
			}
			return id;
		}

		// Insert requests, keyed by title so notifications can reference them
		// without relying on array positions.
		const requestIdByTitle = new Map<string, Id<"helpRequests">>();
		for (const r of REQUESTS) {
			const id = await ctx.db.insert("helpRequests", {
				ownerUserId: requireUser(r.ownerHandle),
				assignedHelperUserId: r.assignedHelperHandle !== undefined
					? requireUser(r.assignedHelperHandle)
					: undefined,
				helperUserId: r.helperHandle !== undefined
					? requireUser(r.helperHandle)
					: undefined,
				category: r.category,
				title: r.title,
				summary: r.summary,
				details: r.details,
				status: r.status,
				emailRelayToken: r.emailRelayToken,
			});
			requestIdByTitle.set(r.title, id);
		}

		for (const n of NOTIFICATIONS) {
			await ctx.db.insert("notifications", {
				recipientUserId: requireUser(n.recipientHandle),
				type: n.type,
				title: n.title,
				body: n.body,
				requestId: n.requestTitle !== undefined
					? requestIdByTitle.get(n.requestTitle)
					: undefined,
				isRead: n.isRead,
				ctaLabel: n.ctaLabel,
				ctaAction: n.ctaAction,
			});
		}

		return {
			volunteers: VOLUNTEERS.length,
			requesters: REQUESTERS.length,
			requests: REQUESTS.length,
			notifications: NOTIFICATIONS.length,
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
