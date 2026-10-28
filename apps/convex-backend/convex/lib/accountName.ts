import type { BetterAuthOptions } from "better-auth/types";
import { APIError } from "better-auth/api";
import {
	INVALID_PERSON_NAME_CODE,
	PERSON_NAME_REQUIRED_ERROR,
	validatePersonName,
} from "./personName";

/** Server-side check for the account name set at sign-up or via update-user. */
function requireValidAccountName(name: string): string {
	const validation = validatePersonName(name, { required: true });
	if (validation.error !== null || validation.value === undefined) {
		throw APIError.from("BAD_REQUEST", {
			code: INVALID_PERSON_NAME_CODE,
			message: validation.error ?? PERSON_NAME_REQUIRED_ERROR,
		});
	}
	return validation.value;
}

/** Better Auth database hooks that validate and normalize the account name. */
export const accountNameDatabaseHooks = {
	user: {
		create: {
			before: async user => ({
				data: { ...user, name: requireValidAccountName(user.name) },
			}),
		},
		update: {
			before: async (user) => {
				// Updates without a name (e.g. email verification) pass through unchanged.
				if (typeof user.name !== "string") {
					return true;
				}
				return { data: { ...user, name: requireValidAccountName(user.name) } };
			},
		},
	},
} satisfies NonNullable<BetterAuthOptions["databaseHooks"]>;
