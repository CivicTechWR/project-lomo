import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { requireAdmin } from "../lib/adminAuth";
import {
	DEFAULT_PHONE_NUMBER_ALLOWED_COUNTRIES,
	normalizeAllowedCountries,
	PHONE_NUMBER_COUNTRY_LABELS,
} from "../lib/phoneNumber";

const DEFAULT_SETTINGS = {
	attentionThresholdDays: 5,
	notifyOnNewPending: true,
	notifyOnConcernReport: true,
	notifyOnCancellation: true,
	phoneNumberAllowedCountries: [...DEFAULT_PHONE_NUMBER_ALLOWED_COUNTRIES],
} as const;

export const getSettings = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const doc = await ctx.db
			.query("adminSettings")
			.withIndex("by_key", q => q.eq("key", "global"))
			.unique();
		const phoneNumberAllowedCountries = normalizeAllowedCountries(
			doc?.phoneNumberAllowedCountries ?? [...DEFAULT_SETTINGS.phoneNumberAllowedCountries],
		) ?? [...DEFAULT_SETTINGS.phoneNumberAllowedCountries];
		return {
			...DEFAULT_SETTINGS,
			...doc,
			phoneNumberAllowedCountries,
		};
	},
});

export const getPublicPhoneNumberSettings = query({
	args: {},
	handler: async (ctx) => {
		const doc = await ctx.db
			.query("adminSettings")
			.withIndex("by_key", q => q.eq("key", "global"))
			.unique();
		const allowedCountries = normalizeAllowedCountries(
			doc?.phoneNumberAllowedCountries ?? [...DEFAULT_SETTINGS.phoneNumberAllowedCountries],
		) ?? [...DEFAULT_SETTINGS.phoneNumberAllowedCountries];
		return allowedCountries.map(country => ({
			country,
			label: PHONE_NUMBER_COUNTRY_LABELS[country] ?? country,
		}));
	},
});

export const updateSettings = mutation({
	args: {
		attentionThresholdDays: v.optional(v.number()),
		notifyOnNewPending: v.optional(v.boolean()),
		notifyOnConcernReport: v.optional(v.boolean()),
		notifyOnCancellation: v.optional(v.boolean()),
		phoneNumberAllowedCountries: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		if (args.attentionThresholdDays !== undefined) {
			const t = args.attentionThresholdDays;
			if (!Number.isInteger(t) || t < 1 || t > 30) {
				throw new Error("Threshold must be an integer between 1 and 30.");
			}
		}

		const normalizedCountries = args.phoneNumberAllowedCountries === undefined
			? undefined
			: normalizeAllowedCountries(args.phoneNumberAllowedCountries);
		if (args.phoneNumberAllowedCountries !== undefined && normalizedCountries === null) {
			throw new Error("Phone number countries must be non-empty, unique, and supported.");
		}

		const existing = await ctx.db
			.query("adminSettings")
			.withIndex("by_key", q => q.eq("key", "global"))
			.unique();

		const patch = {
			...(args.attentionThresholdDays !== undefined && { attentionThresholdDays: args.attentionThresholdDays }),
			...(args.notifyOnNewPending !== undefined && { notifyOnNewPending: args.notifyOnNewPending }),
			...(args.notifyOnConcernReport !== undefined && { notifyOnConcernReport: args.notifyOnConcernReport }),
			...(args.notifyOnCancellation !== undefined && { notifyOnCancellation: args.notifyOnCancellation }),
			...(normalizedCountries !== null && normalizedCountries !== undefined && {
				phoneNumberAllowedCountries: normalizedCountries,
			}),
		};

		if (existing) {
			await ctx.db.patch("adminSettings", existing._id, patch);
		}
		else {
			await ctx.db.insert("adminSettings", {
				key: "global",
				attentionThresholdDays: args.attentionThresholdDays ?? 5,
				notifyOnNewPending: args.notifyOnNewPending ?? true,
				notifyOnConcernReport: args.notifyOnConcernReport ?? true,
				notifyOnCancellation: args.notifyOnCancellation ?? true,
				phoneNumberAllowedCountries: normalizedCountries ?? [...DEFAULT_SETTINGS.phoneNumberAllowedCountries],
			});
		}
	},
});
