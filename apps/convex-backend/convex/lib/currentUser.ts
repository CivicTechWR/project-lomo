/* eslint-disable node/prefer-global/process */
import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export interface AuthIdentity {
	subject: string;
	tokenIdentifier: string;
	email?: string;
	name?: string;
	pictureUrl?: string;
}

type ReadCtx = Pick<QueryCtx, "auth" | "db">;

function csvSet(raw: string | undefined): Set<string> {
	return new Set(
		(raw ?? "")
			.split(",")
			.map(v => v.trim())
			.filter(Boolean),
	);
}

export function isAdminIdentity(identity: AuthIdentity): boolean {
	const adminTokenIdentifiers = csvSet(process.env.ADMIN_TOKEN_IDENTIFIERS);
	const adminSubjects = csvSet(process.env.ADMIN_SUBJECTS);
	const adminEmails = csvSet(process.env.ADMIN_EMAILS);
	return adminTokenIdentifiers.has(identity.tokenIdentifier)
		|| adminSubjects.has(identity.subject)
		|| (
			identity.email !== undefined
			&& identity.email.length > 0
			&& adminEmails.has(identity.email)
		);
}

export async function getIdentity(ctx: ReadCtx): Promise<AuthIdentity | null> {
	const identity = await ctx.auth.getUserIdentity();
	return identity ? (identity as AuthIdentity) : null;
}

export async function requireIdentity(ctx: ReadCtx): Promise<AuthIdentity> {
	const identity = await getIdentity(ctx);
	if (!identity) {
		throw new Error("Unauthenticated");
	}
	return identity;
}

export async function getUserByTokenIdentifier(
	ctx: Pick<QueryCtx, "db">,
	tokenIdentifier: string,
): Promise<Doc<"users"> | null> {
	return ctx.db
		.query("users")
		.withIndex("by_token_identifier", q =>
			q.eq("tokenIdentifier", tokenIdentifier))
		.unique();
}

export async function getCurrentUserRow(
	ctx: ReadCtx,
): Promise<Doc<"users"> | null> {
	const identity = await getIdentity(ctx);
	if (!identity) {
		return null;
	}
	return getUserByTokenIdentifier(ctx, identity.tokenIdentifier);
}

export async function getOrCreateCurrentUser(
	ctx: MutationCtx,
): Promise<{ identity: AuthIdentity; user: Doc<"users"> }> {
	const identity = await requireIdentity(ctx);
	const existing = await getUserByTokenIdentifier(ctx, identity.tokenIdentifier);
	const patch = {
		subject: identity.subject,
		email: identity.email,
		name: identity.name,
		image: identity.pictureUrl,
		isVolunteer: existing?.isVolunteer ?? true,
	};

	if (!existing) {
		const userId = await ctx.db.insert("users", {
			tokenIdentifier: identity.tokenIdentifier,
			...patch,
		});
		const user = await ctx.db.get("users", userId);
		if (!user) {
			throw new Error("User row missing after insert");
		}
		return { identity, user };
	}

	await ctx.db.patch("users", existing._id, patch);
	return {
		identity,
		user: {
			...existing,
			...patch,
		},
	};
}
