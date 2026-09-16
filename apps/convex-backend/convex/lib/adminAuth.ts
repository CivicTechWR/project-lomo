import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { AuthIdentity } from "./currentUser";
import { isAdminIdentity, requireIdentity } from "./currentUser";

/**
 * Asserts the caller is an authenticated admin. Throws "Unauthenticated" if
 * no identity, throws "Forbidden" if the identity is not an admin.
 * Returns the verified identity for downstream use.
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<AuthIdentity> {
	const identity = await requireIdentity(ctx);
	if (!isAdminIdentity(identity)) {
		throw new Error("Forbidden");
	}
	return identity;
}
