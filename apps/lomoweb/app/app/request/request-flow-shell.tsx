"use client";

import { LomoLogo } from "@repo/ui/icons";
import { Text } from "@repo/ui/text";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { RequestProgress } from "./request-progress";

function filledSegmentsForPath(pathname: string): number {
	if (pathname === "/app/request") {
		return 0;
	}
	if (pathname.endsWith("/food/kind")) {
		return 1;
	}
	if (pathname.endsWith("/food/details")) {
		return 2;
	}
	if (
		pathname.endsWith("/food/urgency")
		|| pathname.endsWith("/food/preview")
	) {
		return 3;
	}
	/** Items skips a “kind” step; details aligns with food/details progress (2 of 3). */
	if (pathname.endsWith("/items/details")) {
		return 2;
	}
	if (
		pathname.endsWith("/items/urgency")
		|| pathname.endsWith("/items/preview")
	) {
		return 3;
	}
	if (pathname.endsWith("/other/details")) {
		return 2;
	}
	if (pathname.endsWith("/other/preview")) {
		return 3;
	}
	if (pathname.endsWith("/support/details")) {
		return 2;
	}
	if (pathname.endsWith("/support/preview")) {
		return 3;
	}
	if (pathname.endsWith("/paperwork/details")) {
		return 1;
	}
	if (pathname.endsWith("/paperwork/delivery")) {
		return 2;
	}
	if (pathname.endsWith("/paperwork/preview")) {
		return 3;
	}
	if (pathname.endsWith("/ceremony/role")) {
		return 1;
	}
	if (pathname.endsWith("/ceremony/details")) {
		return 2;
	}
	if (pathname.endsWith("/ceremony/preview")) {
		return 3;
	}
	return 0;
}

export function RequestFlowShell({ children }: { children: ReactNode }) {
	const pathname = usePathname() ?? "";
	const filled = filledSegmentsForPath(pathname);

	return (
		<div className="flex min-h-screen flex-col bg-gray-1 lg:min-h-0">
			<header className="border-b border-gray-5 bg-gray-1 px-4 py-3">
				<div className="mx-auto flex w-full max-w-lg items-center justify-between lg:max-w-none">
					<div className="flex items-center gap-2">
						<LomoLogo className="size-8 shrink-0" aria-hidden />
						<Text size={4} weight="medium">
							LoMo
						</Text>
					</div>
					<button
						type="button"
						className="rounded-md p-2 text-gray-11 transition-colors hover:bg-gray-3 hover:text-gray-12"
						aria-label="Notifications (coming soon)"
					>
						<BellIcon />
					</button>
				</div>
			</header>

			<div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-8 pt-4 lg:max-w-none lg:flex-none">
				<div className="mb-6 flex justify-center">
					<RequestProgress filledCount={filled} />
				</div>
				<div className="flex min-h-[calc(100vh-12rem)] flex-col lg:min-h-0">
					{children}
				</div>
			</div>
		</div>
	);
}

function BellIcon() {
	return (
		<svg
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
			<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
		</svg>
	);
}
