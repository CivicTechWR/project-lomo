"use client";

import { SegmentedProgress } from "@repo/ui/progress";

/** Total segments in the request flow (matches the meal-request mockups). */
const REQUEST_STEP_COUNT = 3;

/**
 * Three-segment progress for the request flow.
 *
 * Wraps `@repo/ui/progress` SegmentedProgress: carries the `progressbar` role so
 * the step position is announced, and the individual segments are decorative.
 */
export function RequestProgress({ filledCount }: { filledCount: number }) {
	return (
		<SegmentedProgress
			stepCount={REQUEST_STEP_COUNT}
			filledCount={filledCount}
			label="Request progress"
			size="sm"
			color="sage"
		/>
	);
}
