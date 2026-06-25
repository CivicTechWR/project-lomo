import type { ReactNode } from "react";
import { OnboardingFlowShell } from "./onboarding-flow-shell";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
	return <OnboardingFlowShell>{children}</OnboardingFlowShell>;
}
