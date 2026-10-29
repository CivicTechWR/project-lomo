import type { Doc, Id } from "../_generated/dataModel";
import { internalMutation } from "../_generated/server";

interface UserRefFields {
	ownerUserId?: Id<"users">;
	helperUserId?: Id<"users">;
	assignedHelperUserId?: Id<"users">;
}

function scoreUser(user: Doc<"users">): number {
	let score = 0;
	if (user.onboardingCompletedAt != null)
		score += 100;
	if (user.firstName != null && user.firstName.length > 0)
		score += 10;
	if (user.helpAreaCenterLat != null)
		score += 10;
	if (user.phone != null && user.phone.length > 0)
		score += 5;
	if (user.bio != null && user.bio.length > 0)
		score += 5;
	// Prefer the most recently created row when scores tie.
	score += user._creationTime / 1e15;
	return score;
}

/**
 * Merge users that share the same tokenIdentifier (or subject).
 *
 * Caused by: legacy rows missing tokenIdentifier, a fresh login creating a
 * second row, then the token backfill giving both the same identifier.
 *
 * Keeps the highest-scoring profile, re-points FKs, deletes losers.
 *   cd apps/convex-backend && bunx convex run migrations/dedupeUsersByTokenIdentifier:run
 */
export const run = internalMutation({
	args: {},
	handler: async (ctx) => {
		const users = await ctx.db.query("users").collect();
		const byToken = new Map<string, Doc<"users">[]>();

		for (const user of users) {
			const key = user.tokenIdentifier;
			const group = byToken.get(key) ?? [];
			group.push(user);
			byToken.set(key, group);
		}

		let groupsMerged = 0;
		let usersDeleted = 0;
		let refsRepointed = 0;

		for (const group of byToken.values()) {
			if (group.length < 2) {
				continue;
			}

			const ranked = group.toSorted((a, b) => scoreUser(b) - scoreUser(a));
			const keeper = ranked[0];
			const losers = ranked.slice(1);
			groupsMerged += 1;

			for (const loser of losers) {
				const patch: Partial<Doc<"users">> = {};
				for (const key of [
					"email",
					"name",
					"firstName",
					"pronouns",
					"phone",
					"image",
					"bio",
					"isVolunteer",
					"canHelpNow",
					"helpPreferences",
					"helpLocation",
					"helpAreaCenterLat",
					"helpAreaCenterLng",
					"helpAreaRadiusKm",
					"onboardingCompletedAt",
					"safetyAcknowledgedAt",
					"blocked",
				] as const) {
					if (keeper[key] == null && loser[key] != null) {
						(patch as Record<string, unknown>)[key] = loser[key];
					}
				}
				if (Object.keys(patch).length > 0) {
					await ctx.db.patch("users", keeper._id, patch);
				}

				const owned = await ctx.db
					.query("helpRequests")
					.withIndex("by_owner_user_id", q => q.eq("ownerUserId", loser._id))
					.collect();
				for (const request of owned) {
					await ctx.db.patch("helpRequests", request._id, {
						ownerUserId: keeper._id,
					});
					refsRepointed += 1;
				}

				const helping = await ctx.db
					.query("helpRequests")
					.withIndex("by_helper", q => q.eq("helperUserId", loser._id))
					.collect();
				for (const request of helping) {
					await ctx.db.patch("helpRequests", request._id, {
						helperUserId: keeper._id,
					});
					refsRepointed += 1;
				}

				const assigned = await ctx.db
					.query("helpRequests")
					.withIndex("by_assigned_helper", q =>
						q.eq("assignedHelperUserId", loser._id))
					.collect();
				for (const request of assigned) {
					await ctx.db.patch("helpRequests", request._id, {
						assignedHelperUserId: keeper._id,
					});
					refsRepointed += 1;
				}

				const notifications = await ctx.db
					.query("notifications")
					.withIndex("by_recipient", q => q.eq("recipientUserId", loser._id))
					.collect();
				for (const notification of notifications) {
					await ctx.db.patch("notifications", notification._id, {
						recipientUserId: keeper._id,
					});
					refsRepointed += 1;
				}

				const messages = await ctx.db.query("requestMessages").collect();
				for (const message of messages) {
					if (message.authorUserId === loser._id) {
						await ctx.db.patch("requestMessages", message._id, {
							authorUserId: keeper._id,
						});
						refsRepointed += 1;
					}
				}

				// Safety: any remaining helpRequest fields that still point at loser.
				for (const request of await ctx.db.query("helpRequests").collect()) {
					const update: UserRefFields = {};
					if (request.ownerUserId === loser._id) {
						update.ownerUserId = keeper._id;
					}
					if (request.helperUserId === loser._id) {
						update.helperUserId = keeper._id;
					}
					if (request.assignedHelperUserId === loser._id) {
						update.assignedHelperUserId = keeper._id;
					}
					if (Object.keys(update).length > 0) {
						await ctx.db.patch("helpRequests", request._id, update);
						refsRepointed += 1;
					}
				}

				await ctx.db.delete("users", loser._id);
				usersDeleted += 1;
			}
		}

		return { groupsMerged, usersDeleted, refsRepointed };
	},
});
