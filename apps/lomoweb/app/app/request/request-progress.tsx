"use client";

/** Total segments in the request flow (matches the meal-request mockups). */
const REQUEST_STEP_COUNT = 3;

/**
 * Three-segment progress for the request flow.
 *
 * Mirrors `OnboardingProgress`: the wrapper carries the `progressbar` role so
 * the step position is announced, and the individual segments are decorative.
 */
export function RequestProgress({ filledCount }: { filledCount: number }) {
	const n = Math.min(REQUEST_STEP_COUNT, Math.max(0, filledCount));

	return (
		<div
			role="progressbar"
			aria-label="Request progress"
			aria-valuemin={0}
			aria-valuemax={REQUEST_STEP_COUNT}
			aria-valuenow={n}
			aria-valuetext={`Step ${n} of ${REQUEST_STEP_COUNT}`}
			className="flex w-full max-w-[min(100%,320px)] gap-1"
		>
			{Array.from({ length: REQUEST_STEP_COUNT }, (_, i) => (
				<div
					key={i}
					aria-hidden
					className={`h-2 min-h-2 flex-1 rounded-full ${
						i < n ? "bg-sage-9" : "bg-sage-4"
					}`}
				/>
			))}
		</div>
	);
}
