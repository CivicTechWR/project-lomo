import type { Doc, Id } from "../_generated/dataModel";
import { internalMutation } from "../_generated/server";

type LegacyRequestMessage = Doc<"requestMessages"> & {
	authorSubject?: string;
};

function stripSystemFields(doc: LegacyRequestMessage) {
	const { _id: _idIgnored, _creationTime: _creationTimeIgnored, ...fields } = doc;
	return fields;
}

/**
 * One-shot repair for requestMessages that predate authorUserId.
 *
 * Maps `authorSubject` → `authorUserId` and strips the legacy field.
 * If the subject no longer resolves, the message is kept with no author.
 *
 * If schemaValidation is blocking deploys, temporarily set it to false in
 * `schema.ts`, push, run this, then turn validation back on:
 *   cd apps/convex-backend && bunx convex run migrations/migrateRequestMessageAuthorIds:run
 */
export const run = internalMutation({
	args: {},
	handler: async (ctx) => {
		const usersBySubject = new Map<string, Id<"users">>();
		for (const user of await ctx.db.query("users").collect()) {
			usersBySubject.set(user.subject, user._id);
		}

		let migrated = 0;

		for (const message of await ctx.db.query("requestMessages").collect()) {
			const legacy = message as LegacyRequestMessage;
			if (legacy.authorSubject == null) {
				continue;
			}

			const fields = stripSystemFields(legacy);
			const { authorSubject, ...rest } = fields;

			const authorUserId = legacy.authorUserId
				?? (authorSubject != null && authorSubject.length > 0
					? usersBySubject.get(authorSubject)
					: undefined);

			await ctx.db.replace("requestMessages", message._id, {
				...rest,
				...(authorUserId != null ? { authorUserId } : {}),
			});
			migrated += 1;
		}

		return { migrated };
	},
});
