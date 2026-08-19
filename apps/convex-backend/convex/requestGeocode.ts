import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalMutation } from "./_generated/server";

export const patchRequestLocation = internalMutation({
	args: {
		requestId: v.id("helpRequests"),
		locationLat: v.number(),
		locationLng: v.number(),
	},
	handler: async (ctx, { requestId, locationLat, locationLng }) => {
		await ctx.db.patch("helpRequests", requestId, { locationLat, locationLng });
	},
});

export const geocodeRequest = internalAction({
	args: {
		requestId: v.id("helpRequests"),
		address: v.string(),
	},
	handler: async (ctx, { requestId, address }) => {
		const url = new URL("https://nominatim.openstreetmap.org/search");
		url.searchParams.set("format", "json");
		url.searchParams.set("limit", "1");
		url.searchParams.set("q", address);

		const response = await fetch(url, {
			headers: {
				"User-Agent": "LoMo/1.0 (community help platform)",
			},
		});
		if (!response.ok) {
			return;
		}

		const results = (await response.json()) as Array<{
			lat: string;
			lon: string;
		}>;
		const hit = results[0] as { lat: string; lon: string } | undefined;
		if (hit == null) {
			return;
		}

		await ctx.runMutation(internal.requestGeocode.patchRequestLocation, {
			requestId,
			locationLat: Number.parseFloat(hit.lat),
			locationLng: Number.parseFloat(hit.lon),
		});
	},
});
