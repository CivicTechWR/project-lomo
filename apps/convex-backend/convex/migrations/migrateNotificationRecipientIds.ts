import type { Doc, Id } from "../_generated/dataModel";
import { internalMutation } from "../_generated/server";

type LegacyNotification = Doc<"notifications"> & {
	recipientSubject?: string;
	recipientUserId?: Id<"users">;
};

function stripSystemFields(doc: LegacyNotification) {
	const { _id: _idIgnored, _creationTime: _creationTimeIgnored, ...fields } = doc;
	return fields;
}

/**
 * One-shot repair for notifications that predate recipientUserId.
 *
 * Maps `recipientSubject` → `recipientUserId`. Deletes rows whose subject
 * no longer resolves to a user.
 *
 * If schemaValidation is blocking deploys, temporarily set it to false in
 * `schema.ts`, push, run this, then turn validation back on:
 *   cd apps/convex-backend && bunx convex run migrations/migrateNotificationRecipientIds:run
 */
export const run = internalMutation({
	args: {},
	handler: async (ctx) => {
		const usersBySubject = new Map<string, Id<"users">>();
		for (const user of await ctx.db.query("users").collect()) {
			usersBySubject.set(user.subject, user._id);
		}

		let migrated = 0;
		let deleted = 0;

		for (const notification of await ctx.db.query("notifications").collect()) {
			const legacy = notification as LegacyNotification;
			if (legacy.recipientUserId != null && legacy.recipientSubject == null) {
				continue;
			}

			const fields = stripSystemFields(legacy);
			const { recipientSubject, ...rest } = fields;

			let recipientUserId = legacy.recipientUserId;
			if (recipientUserId == null) {
				if (recipientSubject == null || recipientSubject.length === 0) {
					await ctx.db.delete("notifications", notification._id);
					deleted += 1;
					continue;
				}
				const resolved = usersBySubject.get(recipientSubject);
				if (resolved == null) {
					await ctx.db.delete("notifications", notification._id);
					deleted += 1;
					continue;
				}
				recipientUserId = resolved;
			}

			await ctx.db.replace("notifications", notification._id, {
				...rest,
				recipientUserId,
			});
			migrated += 1;
		}

		return { migrated, deleted };
	},
});
