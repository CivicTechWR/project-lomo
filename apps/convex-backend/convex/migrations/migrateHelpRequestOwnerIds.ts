import type { Doc, Id } from "../_generated/dataModel";
import { internalMutation } from "../_generated/server";

type LegacyHelpRequest = Doc<"helpRequests"> & {
	ownerSubject?: string;
	helperSubject?: string;
	category: Doc<"helpRequests">["category"] | "ride";
};

const VALID_CATEGORIES = new Set([
	"food",
	"items",
	"other",
	"support",
	"paperwork",
	"ceremony",
]);

function stripSystemFields(doc: LegacyHelpRequest) {
	const { _id: _idIgnored, _creationTime: _creationTimeIgnored, ...fields } = doc;
	return fields;
}

function normalizeCategory(
	category: string,
): Doc<"helpRequests">["category"] {
	if (category === "ride") {
		return "other";
	}
	if (VALID_CATEGORIES.has(category)) {
		return category as Doc<"helpRequests">["category"];
	}
	return "other";
}

/**
 * One-shot repair for helpRequests that predate the current schema.
 *
 * Fixes:
 * - `ownerSubject` / `helperSubject` → `ownerUserId` / `helperUserId`
 * - legacy `category: "ride"` → `"other"`
 *
 * If schemaValidation is blocking deploys, temporarily set it to false in
 * `schema.ts`, push, run this, then turn validation back on:
 *   cd apps/convex-backend && bunx convex run migrations/migrateHelpRequestOwnerIds:run
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

		for (const request of await ctx.db.query("helpRequests").collect()) {
			const legacy = request as LegacyHelpRequest;
			const fields = stripSystemFields(legacy);
			const {
				ownerSubject,
				helperSubject,
				...rest
			} = fields;

			const needsOwnerMigration = legacy.ownerUserId == null;
			const needsCategoryMigration = !VALID_CATEGORIES.has(legacy.category);
			const needsSubjectCleanup
				= ownerSubject !== undefined || helperSubject !== undefined;

			if (!needsOwnerMigration && !needsCategoryMigration && !needsSubjectCleanup) {
				continue;
			}

			let ownerUserId = legacy.ownerUserId;
			if (ownerUserId == null) {
				if (ownerSubject == null || ownerSubject.length === 0) {
					await ctx.db.delete("helpRequests", request._id);
					deleted += 1;
					continue;
				}
				const resolvedOwnerId = usersBySubject.get(ownerSubject);
				if (resolvedOwnerId == null) {
					await ctx.db.delete("helpRequests", request._id);
					deleted += 1;
					continue;
				}
				ownerUserId = resolvedOwnerId;
			}

			const helperUserId = legacy.helperUserId
				?? (helperSubject != null && helperSubject.length > 0
					? usersBySubject.get(helperSubject)
					: undefined);

			await ctx.db.replace("helpRequests", request._id, {
				...rest,
				category: normalizeCategory(legacy.category),
				ownerUserId,
				...(helperUserId != null ? { helperUserId } : {}),
			});
			migrated += 1;
		}

		return { migrated, deleted };
	},
});
