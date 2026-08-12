"use client";

import { ONBOARDING_STEP_COUNT } from "@/lib/helper-preferences";

export function OnboardingProgress({ filledCount }: { filledCount: number }) {
	const n = Math.min(ONBOARDING_STEP_COUNT, Math.max(0, filledCount));

	return (
		<div
			aria-hidden
			className="flex w-full max-w-[min(100%,320px)] gap-1"
		>
			{Array.from({ length: ONBOARDING_STEP_COUNT }, (_, i) => (
				<div
					key={i}
					className={
						i < n
							? "h-2 min-h-2 flex-1 rounded-sm bg-gray-9"
							: "h-2 min-h-2 flex-1 rounded-sm bg-gray-4"
					}
				/>
			))}
		</div>
	);
}
