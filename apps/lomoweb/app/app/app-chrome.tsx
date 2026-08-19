"use client";

import type { ReactNode } from "react";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { HomeModeProvider } from "@/lib/home-mode-context";
import { AppTopBar } from "./app-top-bar";

export function AppChrome({ children }: { children: ReactNode }) {
	const pathname = usePathname() ?? "";
	const router = useRouter();
	const profileRow = useQuery(api.users.getMyProfileRow);
	const isOnboarding = pathname.startsWith("/app/onboarding");

	useEffect(() => {
		if (profileRow === undefined) {
			return;
		}
		if (!profileRow?.onboardingCompletedAt && !isOnboarding) {
			router.replace("/app/onboarding/basics");
			return;
		}
		if (profileRow?.onboardingCompletedAt && isOnboarding) {
			router.replace("/app");
		}
	}, [profileRow, isOnboarding, router]);

	if (isOnboarding) {
		return <>{children}</>;
	}

	return (
		<HomeModeProvider>
			<AppTopBar />
			<div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto">
				{children}
			</div>
		</HomeModeProvider>
	);
}
