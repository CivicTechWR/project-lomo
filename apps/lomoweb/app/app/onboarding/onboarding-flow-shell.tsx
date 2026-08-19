"use client";

import type { ReactNode } from "react";
import { LomoLogo } from "@repo/ui/icons";
import { Text } from "@repo/ui/text";
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
		<div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-gray-1">
			<header className="border-b border-gray-5 bg-gray-1 px-4 py-3 sm:px-6">
				<div className="mx-auto flex w-full max-w-lg items-center justify-between">
					<div className="flex items-center gap-2">
						<LomoLogo className="size-8 shrink-0" aria-hidden />
						<Text size={4} weight="medium">
							LoMo
						</Text>
					</div>
					<Text size={1} color="gray">
						Helper setup
					</Text>
				</div>
			</header>

			<div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-10 pt-6 sm:px-6">
				<div className="mb-8 flex justify-center">
					<OnboardingProgress filledCount={filled} />
				</div>
				<div className="flex min-h-0 flex-1 flex-col">
					{children}
				</div>
			</div>
		</div>
	);
}
