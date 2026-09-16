/** Whether a help request should be treated as urgent (badge, filter, sort). */
const URGENT_REQUEST_PATTERN = /\burgency:\s*urgent\b/i;

export function isRequestUrgent(request: {
	isUrgent?: boolean;
	payload?: string;
	details?: string;
	summary?: string;
}): boolean {
	if (request.isUrgent === true) {
		return true;
	}

	if (request.payload) {
		try {
			const parsed = JSON.parse(request.payload) as {
				draft?: { urgency?: string };
			};
			if (parsed.draft?.urgency === "urgent") {
				return true;
			}
		}
		catch {
			// Ignore malformed payload snapshots.
		}
	}

	const text = [request.details, request.summary].filter(Boolean).join("\n");
	return URGENT_REQUEST_PATTERN.test(text);
}
