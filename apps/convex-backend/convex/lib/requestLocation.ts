/** Extract a geocodable address/location string from a request payload snapshot. */
export function extractGeocodableAddress(
	category: string,
	payloadJson: string | undefined,
): string | null {
	if (payloadJson == null || payloadJson === "") {
		return null;
	}
	try {
		const parsed = JSON.parse(payloadJson) as {
			draft?: Record<string, Record<string, unknown>>;
		};
		const draft = parsed.draft;
		if (draft == null) {
			return null;
		}

		const text = (value: unknown): string | null => {
			if (typeof value !== "string") {
				return null;
			}
			const trimmed = value.trim();
			return trimmed.length > 0 ? trimmed : null;
		};

		switch (category) {
			case "food": {
				const details = draft.foodDetails;
				if (details?.needsDelivery === true) {
					return text(details.address);
				}
				return null;
			}
			case "items": {
				const details = draft.itemsDetails;
				if (details?.needsDelivery === true) {
					return text(details.address);
				}
				return null;
			}
			case "other":
				return text(draft.otherDetails?.location);
			case "support":
				return text(draft.publicWalkDetails?.location);
			case "ceremony":
				return text(draft.ceremonyDetails?.locationAddress);
			default:
				return null;
		}
	}
	catch {
		return null;
	}
}

function readCoord(value: unknown): number | null {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		return null;
	}
	return value;
}

function readLatLng(
	details: Record<string, unknown> | undefined,
	latKey: string,
	lngKey: string,
): { lat: number; lng: number } | null {
	if (details == null) {
		return null;
	}
	const lat = readCoord(details[latKey]);
	const lng = readCoord(details[lngKey]);
	if (lat == null || lng == null) {
		return null;
	}
	if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
		return null;
	}
	return { lat, lng };
}

/**
 * Lat/lng chosen from address suggestions.
 * Food and items only count when delivery was requested.
 * Prefer this over async geocoding when present.
 */
export function extractPayloadCoordinates(
	category: string,
	payloadJson: string | undefined,
): { lat: number; lng: number } | null {
	if (payloadJson == null || payloadJson === "") {
		return null;
	}
	try {
		const parsed = JSON.parse(payloadJson) as {
			draft?: Record<string, Record<string, unknown>>;
		};
		const draft = parsed.draft;
		if (draft == null) {
			return null;
		}

		const fromDelivery = (
			details: Record<string, unknown> | undefined,
		): { lat: number; lng: number } | null => {
			if (details == null || details.needsDelivery !== true) {
				return null;
			}
			return readLatLng(details, "addressLat", "addressLng");
		};

		switch (category) {
			case "food":
				return fromDelivery(draft.foodDetails);
			case "items":
				return fromDelivery(draft.itemsDetails);
			case "other":
				return readLatLng(draft.otherDetails, "locationLat", "locationLng");
			case "support":
				return readLatLng(draft.publicWalkDetails, "locationLat", "locationLng");
			case "ceremony":
				return readLatLng(draft.ceremonyDetails, "locationLat", "locationLng");
			default:
				return null;
		}
	}
	catch {
		return null;
	}
}
