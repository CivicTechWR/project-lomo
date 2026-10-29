"use client";

import type { ReactNode } from "react";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
	ALREADY_SIGNED_IN_NOTICE,
	pathWithAlreadySignedInNotice,
} from "@/lib/already-signed-in";
import { HomeModeProvider } from "@/lib/home-mode-context";
import { onboardingRedirectPath } from "@/lib/onboarding-gate";
import { RouteSkeleton } from "../route-state";
import { AppSidebar } from "./app-sidebar";

export function AppChrome({ children }: { children: ReactNode }) {
	const pathname = usePathname() ?? "";
	const router = useRouter();
	const searchParams = useSearchParams();
	const profileRow = useQuery(api.users.getMyProfileRow);
	const isOnboarding = pathname.startsWith("/app/onboarding");
	const showAlreadySignedIn
		= searchParams.get("notice") === ALREADY_SIGNED_IN_NOTICE;
	const isProfileLoading = profileRow === undefined;
	const destination = isProfileLoading
		? null
		: onboardingRedirectPath(
				pathname,
				profileRow?.onboardingCompletedAt != null,
			);

	useEffect(() => {
		if (!destination) {
			return;
		}
		router.replace(
			showAlreadySignedIn
				? pathWithAlreadySignedInNotice(destination)
				: destination,
		);
	}, [destination, router, showAlreadySignedIn]);

	// Hold the shell until we know whether this path is allowed. Otherwise a
	// refresh can flash the app before the onboarding redirect runs.
	if (isProfileLoading || destination) {
		return <RouteSkeleton />;
	}

	if (isOnboarding) {
		return children;
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
