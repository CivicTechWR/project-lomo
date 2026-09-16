"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ONBOARDING_STEP_PATHS } from "@/lib/helper-preferences";
import { OnboardingProgress } from "./onboarding-progress";

function filledSegmentsForPath(pathname: string): number {
	const index = ONBOARDING_STEP_PATHS.findIndex(path => pathname === path);
	return index === -1 ? 0 : index + 1;
}

export function OnboardingFlowShell({ children }: { children: ReactNode }) {
	const pathname = usePathname() ?? "";
	const filled = filledSegmentsForPath(pathname);

	return (
		// `w-full flex-1` is load-bearing: the parent `/app` layout is a flex *row*,
		// so without it this panel shrinks to its content width and hugs the left
		// edge on wide screens instead of centring.
		<div className="flex w-full flex-1 flex-col bg-surface-warm px-4 py-6 sm:px-6 sm:py-10">
			{/*
			  `m-auto` centres the panel on both axes and, unlike `justify-center`,
			  lets it overflow downward instead of clipping when a step is tall.
			  `min-h-152` keeps the footer actions at a natural bottom edge rather
			  than stretching to the full height of a laptop screen.
			*/}
			<div className="m-auto flex w-full max-w-lg flex-col gap-5 min-h-152">
				<OnboardingProgress filledCount={filled} />
				<div className="flex min-h-0 flex-1 flex-col">
					{children}
				</div>
			</div>
		</div>
	);
}
