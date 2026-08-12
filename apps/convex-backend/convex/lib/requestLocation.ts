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

/**
 * Lat/lng chosen via address autocomplete on food/items delivery.
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

		const fromDetails = (
			details: Record<string, unknown> | undefined,
		): { lat: number; lng: number } | null => {
			if (details == null || details.needsDelivery !== true) {
				return null;
			}
			const lat = readCoord(details.addressLat);
			const lng = readCoord(details.addressLng);
			if (lat == null || lng == null) {
				return null;
			}
			if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
				return null;
			}
			return { lat, lng };
		};

		switch (category) {
			case "food":
				return fromDetails(draft.foodDetails);
			case "items":
				return fromDetails(draft.itemsDetails);
			default:
				return null;
		}
	}
	catch {
		return null;
	}
}
