import type { Doc } from "../_generated/dataModel";
import { internalMutation } from "../_generated/server";

type LegacyUser = Doc<"users"> & {
	tokenIdentifier?: string;
};

function stripSystemFields(doc: LegacyUser) {
	const { _id: _idIgnored, _creationTime: _creationTimeIgnored, ...fields } = doc;
	return fields;
}

/**
 * One-shot repair for users missing tokenIdentifier.
 *
 * Better Auth / Convex identities use `{issuer}|{subject}`. Older rows only
 * stored `subject`. This backfills tokenIdentifier from a known issuer prefix
 * on the same deployment (taken from any user that already has one).
 *
 * If schemaValidation is blocking deploys, temporarily set it to false in
 * `schema.ts`, push, run this, then turn validation back on:
 *   cd apps/convex-backend && bunx convex run migrations/migrateUserTokenIdentifiers:run
 */
export const run = internalMutation({
	args: {},
	handler: async (ctx) => {
		const users = await ctx.db.query("users").collect();

		let issuerPrefix: string | null = null;
		for (const user of users) {
			const legacy = user as LegacyUser;
			const token = legacy.tokenIdentifier;
			if (token && token.includes("|")) {
				issuerPrefix = token.slice(0, token.indexOf("|"));
				break;
			}
		}

		if (issuerPrefix == null) {
			throw new Error(
				"No existing tokenIdentifier found to derive issuer prefix. "
				+ "Sign in once with a fresh account, then re-run this migration.",
			);
		}

		const takenTokens = new Set(
			users
				.map(u => (u as LegacyUser).tokenIdentifier)
				.filter((t): t is string => t != null && t.length > 0),
		);

		let migrated = 0;
		let skippedDuplicate = 0;

		for (const user of users) {
			const legacy = user as LegacyUser;
			if (legacy.tokenIdentifier != null && legacy.tokenIdentifier.length > 0) {
				continue;
			}

			const tokenIdentifier = `${issuerPrefix}|${legacy.subject}`;
			if (takenTokens.has(tokenIdentifier)) {
				// Another row already owns this identity (e.g. a fresh login).
				// Leave this row for dedupeUsersByTokenIdentifier rather than
				// creating a second indexed match.
				skippedDuplicate += 1;
				continue;
			}

			const fields = stripSystemFields(legacy);
			await ctx.db.replace("users", user._id, {
				...fields,
				tokenIdentifier,
			});
			takenTokens.add(tokenIdentifier);
			migrated += 1;
		}

		return { migrated, skippedDuplicate, issuerPrefix };
	},
});
