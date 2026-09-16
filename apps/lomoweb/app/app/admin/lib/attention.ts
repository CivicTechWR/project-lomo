/**
 * Pure logic for attention threshold calculations and settings validation.
 * Extracted from Convex backend logic for testability.
 */

export interface AttentionCandidate {
	status: string;
	assignedHelperUserId?: string | null;
	_creationTime: number;
}

/**
 * Determines whether a request qualifies as needing attention.
 *
 * A request needs attention if and only if:
 * - status is "pending"
 * - no helper is assigned (assignedHelperUserId is falsy)
 * - it has been pending longer than thresholdDays * 86400000 ms
 */
export function isAttentionNeeded(
	request: AttentionCandidate,
	thresholdDays: number,
	now: number,
): boolean {
	const thresholdMs = thresholdDays * 86_400_000;
	return (
		request.status === "pending"
		&& !request.assignedHelperUserId
		&& (now - request._creationTime) > thresholdMs
	);
}

/**
 * Validates an attention threshold value for the admin settings.
 *
 * A valid threshold must be:
 * - An integer (Number.isInteger)
 * - At least 1
 * - At most 30
 */
export function isValidThreshold(value: number): boolean {
	return Number.isInteger(value) && value >= 1 && value <= 30;
}
