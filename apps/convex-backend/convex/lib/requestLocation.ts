/** Extract a geocodable address/location string from a request payload snapshot. */
export function extractGeocodableAddress(
	category: string,
	payloadJson: string | undefined,
): string | null {
	if (!payloadJson) {
		return null;
	}
	try {
		const parsed = JSON.parse(payloadJson) as {
			draft?: Record<string, Record<string, unknown>>;
		};
		const draft = parsed.draft;
		if (!draft) {
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
