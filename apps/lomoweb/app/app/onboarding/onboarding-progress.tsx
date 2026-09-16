"use client";

import { ONBOARDING_STEP_COUNT } from "@/lib/helper-preferences";
import {
	progressSegment,
	progressSegmentEmpty,
	progressSegmentFilled,
} from "./styles";

export function OnboardingProgress({ filledCount }: { filledCount: number }) {
	const n = Math.min(ONBOARDING_STEP_COUNT, Math.max(0, filledCount));

	return (
		<div
			role="progressbar"
			aria-label="Onboarding progress"
			aria-valuemin={0}
			aria-valuemax={ONBOARDING_STEP_COUNT}
			aria-valuenow={n}
			aria-valuetext={`Step ${n} of ${ONBOARDING_STEP_COUNT}`}
			className="flex w-full gap-2"
		>
			{Array.from({ length: ONBOARDING_STEP_COUNT }, (_, i) => (
				<div
					key={i}
					aria-hidden
					className={`${progressSegment} ${
						i < n ? progressSegmentFilled : progressSegmentEmpty
					}`}
				/>
			))}
		</div>
	);
}
