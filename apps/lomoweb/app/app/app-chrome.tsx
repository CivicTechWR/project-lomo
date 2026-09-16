"use client";

import type { ReactNode } from "react";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { HomeModeProvider } from "@/lib/home-mode-context";
import { AppSidebar } from "./app-sidebar";

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
			{/* min-h-screen lets the white background grow with long content */}
			<div className="flex min-h-screen w-full bg-white">
				<AppSidebar />
				{/* Removed overflow-auto so the main window handles page scrolling */}
				<main className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
					{children}
				</main>
			</div>
		</HomeModeProvider>
	);
}
