import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { internalMutation } from "./_generated/server";
import { ADMIN_SETTINGS, MESSAGES, NOTIFICATIONS, REQUESTERS, REQUESTS, SEED_PREFIX, VOLUNTEERS } from "./lib/seedData";

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
 *
 * Note: Convex's `_creationTime` is system-managed and cannot be backdated, so the
 * age-based "attention needed" list cannot be seeded — to see that one, lower the
 * threshold to 1 day in admin settings and wait ~24 hours.
 *
 * Deadlines are different. `neededBy` is an ordinary field, so `neededByInDays`
 * on a seed request can put a deadline in the past and exercise deadline
 * scenarios immediately. See `SeedRequest.neededByInDays`.
 */

function isSeeded(value: string | undefined): boolean {
	return value !== undefined && value.startsWith(SEED_PREFIX);
}

/**
 * A deadline `days` from now, at the end of that local day.
 *
 * Negative values produce an already-overdue deadline. Unlike `_creationTime`,
 * `neededBy` is an ordinary field, so deadline scenarios — including overdue
 * ones — can be seeded directly and demoed straight away.
 */
function endOfDayFromNow(days: number): number {
	const date = new Date();
	date.setDate(date.getDate() + days);
	date.setHours(23, 59, 59, 999);
	return date.getTime();
}

async function clearSeeded(ctx: MutationCtx) {
	// Collect seeded user ids first so we can find the rows that reference them.
	const seededUserIds = new Set<string>();
	for (const user of await ctx.db.query("users").collect()) {
		if (isSeeded(user.subject)) {
			seededUserIds.add(user._id);
		}
	}

	// Clear request messages that belong to seeded requests
	const seededRequestIds = new Set<string>();
	for (const request of await ctx.db.query("helpRequests").collect()) {
		if (seededUserIds.has(request.ownerUserId)) {
			seededRequestIds.add(request._id);
		}
	}

	for (const message of await ctx.db.query("requestMessages").collect()) {
		if (seededRequestIds.has(message.requestId)) {
			await ctx.db.delete("requestMessages", message._id);
		}
	}

	for (const notification of await ctx.db.query("notifications").collect()) {
		if (seededUserIds.has(notification.recipientUserId)) {
			await ctx.db.delete("notifications", notification._id);
		}
	}

	for (const requestId of seededRequestIds) {
		await ctx.db.delete("helpRequests", requestId as Id<"helpRequests">);
	}

	for (const userId of seededUserIds) {
		await ctx.db.delete("users", userId as Id<"users">);
	}

	// Clear seeded admin settings (the singleton with key "global" inserted by seed)
	const settingsDoc = await ctx.db
		.query("adminSettings")
		.withIndex("by_key", q => q.eq("key", "global"))
		.unique();
	if (settingsDoc) {
		await ctx.db.delete("adminSettings", settingsDoc._id);
	}
}

export const run = internalMutation({
	args: {},
	handler: async (ctx) => {
		await clearSeeded(ctx);

		// --- Users ---
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
				/*
				 * Both drive the derived user status shown in admin
				 * (Blocked > Volunteer > Resting > Member). Defaulted rather than left
				 * undefined so a seeded row reads the same as one written by the app.
				 */
				canHelpNow: u.canHelpNow ?? false,
				blocked: u.blocked ?? false,
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

		// --- Requests ---
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
				// Seeded requests carry no payload, so this cannot be derived the way
				// `helpRequests.create` does — it has to be written directly.
				isUrgent: r.isUrgent ?? false,
				...(r.neededByInDays !== undefined
					? {
							neededBy: endOfDayFromNow(r.neededByInDays),
							neededByFlexible: r.neededByFlexible ?? false,
						}
					: {}),
			});
			requestIdByTitle.set(r.title, id);
		}

		// --- Request Messages ---
		let messagesInserted = 0;
		for (const m of MESSAGES) {
			const requestId = requestIdByTitle.get(m.requestTitle);
			if (!requestId) {
				throw new Error(`Seed message references unknown request title: ${m.requestTitle}`);
			}
			await ctx.db.insert("requestMessages", {
				requestId,
				authorUserId: m.authorHandle !== undefined
					? requireUser(m.authorHandle)
					: undefined,
				body: m.body,
				source: m.source,
			});
			messagesInserted++;
		}

		// --- Notifications ---
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

		// --- Admin Settings ---
		await ctx.db.insert("adminSettings", {
			key: ADMIN_SETTINGS.key,
			attentionThresholdDays: ADMIN_SETTINGS.attentionThresholdDays,
			notifyOnNewPending: ADMIN_SETTINGS.notifyOnNewPending,
			notifyOnConcernReport: ADMIN_SETTINGS.notifyOnConcernReport,
			notifyOnCancellation: ADMIN_SETTINGS.notifyOnCancellation,
		});

		return {
			volunteers: VOLUNTEERS.length,
			requesters: REQUESTERS.length,
			requests: REQUESTS.length,
			messages: messagesInserted,
			notifications: NOTIFICATIONS.length,
			adminSettings: 1,
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
