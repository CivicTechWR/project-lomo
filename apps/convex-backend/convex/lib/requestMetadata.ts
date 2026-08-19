function parseDraft(payloadJson: string | undefined): Record<string, unknown> | null {
	if (payloadJson == null || payloadJson.length === 0) {
		return null;
	}
	try {
		const parsed = JSON.parse(payloadJson) as { draft?: Record<string, unknown> };
		return parsed.draft ?? null;
	}
	catch {
		return null;
	}
}

function nestedRecord(value: unknown): Record<string, unknown> | null {
	if (typeof value === "object" && value !== null && !Array.isArray(value)) {
		return value as Record<string, unknown>;
	}
	return null;
}

/** Whether the requester asked for delivery (food/items flows). */
export function extractNeedsDelivery(
	category: string,
	payloadJson: string | undefined,
): boolean {
	const draft = parseDraft(payloadJson);
	if (!draft) {
		return false;
	}

	switch (category) {
		case "food":
			return nestedRecord(draft.foodDetails)?.needsDelivery === true;
		case "items":
			return nestedRecord(draft.itemsDetails)?.needsDelivery === true;
		default:
			return false;
	}
}

/** Whether the request was marked as urgent when posted. */
export function extractIsUrgent(payloadJson: string | undefined): boolean {
	const draft = parseDraft(payloadJson);
	return draft?.urgency === "urgent";
}
