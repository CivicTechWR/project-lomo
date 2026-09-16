"use client";

import type { StepFooterProps } from "@repo/ui/step-footer";
import { StepFooter } from "@repo/ui/step-footer";

export function OnboardingStepFooter(props: StepFooterProps) {
	return <StepFooter variant="onboarding" {...props} />;
}
