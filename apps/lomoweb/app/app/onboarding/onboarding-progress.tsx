"use client";

import { SegmentedProgress } from "@repo/ui/progress";
import { ONBOARDING_STEP_COUNT } from "@/lib/helper-preferences";

export function OnboardingProgress({ filledCount }: { filledCount: number }) {
	return (
		<SegmentedProgress
			stepCount={ONBOARDING_STEP_COUNT}
			filledCount={filledCount}
			label="Onboarding progress"
			size="md"
			color="yellow"
		/>
	);
}
