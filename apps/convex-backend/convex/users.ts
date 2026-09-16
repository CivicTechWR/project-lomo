import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent, createAuth } from "./auth";
import { requireAdmin } from "./lib/adminAuth";
import { getCurrentUserRow, getOrCreateCurrentUser, requireIdentity } from "./lib/currentUser";
import { normalizeHelpPreferences } from "./lib/helperPreferences";
import { purgeUserAppData } from "./lib/purgeUserAppData";

const MAX_ADMIN_ROWS = 200;

const INVALID_PASSWORD_RE = /invalid.?password/i;
const SESSION_EXPIRED_RE = /session.?expired/i;

export const getMyProfileRow = query({
	args: {},
	handler: async (ctx) => {
		return getCurrentUserRow(ctx);
	},
});

export const updatePublicProfile = mutation({
	args: {
		firstName: v.optional(v.string()),
		pronouns: v.optional(v.string()),
		phone: v.optional(v.string()),
	},
	handler: async (ctx, { firstName, pronouns, phone }) => {
		const { user } = await getOrCreateCurrentUser(ctx);
		const patch: Record<string, string | undefined> = {};
		if (firstName !== undefined) {
			patch.firstName = firstName.trim() || undefined;
		}
		if (pronouns !== undefined) {
			patch.pronouns = pronouns.trim() || undefined;
		}
		if (phone !== undefined) {
			patch.phone = phone.trim() || undefined;
		}
		await ctx.db.patch("users", user._id, patch);
	},
});

export const updateHelperPreferences = mutation({
	args: {
		canHelpNow: v.optional(v.boolean()),
		helpPreferences: v.optional(v.array(v.string())),
		helpAreaCenterLat: v.optional(v.number()),
		helpAreaCenterLng: v.optional(v.number()),
		helpAreaRadiusKm: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const { user } = await getOrCreateCurrentUser(ctx);
		const patch: Record<string, boolean | number | string[] | undefined> = {};
		if (args.canHelpNow !== undefined) {
			patch.canHelpNow = args.canHelpNow;
		}
		if (args.helpPreferences !== undefined) {
			patch.helpPreferences = normalizeHelpPreferences(args.helpPreferences);
		}
		if (args.helpAreaCenterLat !== undefined) {
			if (args.helpAreaCenterLat < -90 || args.helpAreaCenterLat > 90) {
				throw new Error("Invalid latitude");
			}
			patch.helpAreaCenterLat = args.helpAreaCenterLat;
		}
		if (args.helpAreaCenterLng !== undefined) {
			if (args.helpAreaCenterLng < -180 || args.helpAreaCenterLng > 180) {
				throw new Error("Invalid longitude");
			}
			patch.helpAreaCenterLng = args.helpAreaCenterLng;
		}
		if (args.helpAreaRadiusKm !== undefined) {
			const radiusKm = Math.round(args.helpAreaRadiusKm);
			if (radiusKm < 1 || radiusKm > 30) {
				throw new Error("Radius must be between 1 and 30 km");
			}
			patch.helpAreaRadiusKm = radiusKm;
		}
		await ctx.db.patch("users", user._id, patch);
	},
});

export const acknowledgeSafety = mutation({
	args: {},
	handler: async (ctx) => {
		const { user } = await getOrCreateCurrentUser(ctx);
		await ctx.db.patch("users", user._id, {
			safetyAcknowledgedAt: Date.now(),
		});
	},
});

export const completeOnboarding = mutation({
	args: {},
	handler: async (ctx) => {
		const { user } = await getOrCreateCurrentUser(ctx);
		if (user.safetyAcknowledgedAt == null) {
			throw new Error("Complete the safety step before finishing onboarding.");
		}
		await ctx.db.patch("users", user._id, {
			onboardingCompletedAt: Date.now(),
		});
	},
});

/**
 * Permanently delete the signed-in account: verifies password, removes the
 * Better Auth user, then purges app data (profile, owned requests, messages,
 * notifications, helper links).
 */
export const deleteMyAccount = mutation({
	args: {
		password: v.string(),
	},
	handler: async (ctx, { password }) => {
		if (password.trim().length === 0) {
			throw new Error("Password is required");
		}
		const identity = await requireIdentity(ctx);
		const subject = identity.subject;
		const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
		try {
			await auth.api.deleteUser({
				body: { password },
				headers,
			});
		}
		catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			if (INVALID_PASSWORD_RE.test(message)) {
				throw new Error("Incorrect password.");
			}
			if (SESSION_EXPIRED_RE.test(message)) {
				throw new Error(
					"Your session is too old to delete your account. Sign out, sign back in, and try again.",
				);
			}
			throw new Error(
				message.length > 0 ? message : "Could not delete your account.",
			);
		}
		await purgeUserAppData(ctx, subject);
	},
});

export const listAllForAdmin = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const users = await ctx.db.query("users").take(MAX_ADMIN_ROWS);
		return users.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
	},
});

export const adminGetUser = query({
	args: { userId: v.id("users") },
	handler: async (ctx, { userId }) => {
		await requireAdmin(ctx);
		const user = await ctx.db.get("users", userId);
		if (!user)
			return null;

		const requests = await ctx.db
			.query("helpRequests")
			.withIndex("by_owner_user_id", q => q.eq("ownerUserId", userId))
			.take(MAX_ADMIN_ROWS);

		return { ...user, requests };
	},
});

export const adminBlockUser = mutation({
	args: { userId: v.id("users") },
	handler: async (ctx, { userId }) => {
		await requireAdmin(ctx);
		const user = await ctx.db.get("users", userId);
		if (!user)
			throw new Error("User not found.");
		await ctx.db.patch("users", userId, { blocked: true });

		// Cancel any active requests owned by this user
		const activeRequests = await ctx.db
			.query("helpRequests")
			.withIndex("by_owner_user_id", q => q.eq("ownerUserId", userId))
			.take(MAX_ADMIN_ROWS);

		const cancellableStatuses = new Set(["pending", "assigned", "awaiting_requester_acceptance", "in_progress"]);
		for (const req of activeRequests) {
			if (cancellableStatuses.has(req.status)) {
				await ctx.db.patch("helpRequests", req._id, { status: "cancelled" });
			}
		}
	},
});

/**
 * Lifts a block. Admin-only, like blocking — there is no self-service path to
 * either direction.
 *
 * Only the `blocked` flag is cleared. The user's own settings (`isVolunteer`,
 * `canHelpNow`) were never touched by blocking, so their derived status returns
 * to whatever they had chosen. Requests cancelled when they were blocked stay
 * cancelled; reviving them would resurrect matches the other party has already
 * moved on from.
 */
export const adminUnblockUser = mutation({
	args: { userId: v.id("users") },
	handler: async (ctx, { userId }) => {
		await requireAdmin(ctx);
		const user = await ctx.db.get("users", userId);
		if (!user)
			throw new Error("User not found.");
		await ctx.db.patch("users", userId, { blocked: false });
	},
});
