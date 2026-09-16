"use client";

import type { StepFooterProps } from "@repo/ui/step-footer";
import { StepFooter } from "@repo/ui/step-footer";

export function RequestStepFooter(props: StepFooterProps) {
	return <StepFooter variant="default" {...props} />;
}
