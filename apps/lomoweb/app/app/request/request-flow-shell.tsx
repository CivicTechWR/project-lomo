"use client";

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
		<div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-8 pt-4 lg:max-w-none">
			<div className="mb-6 flex justify-center">
				<RequestProgress filledCount={filled} />
			</div>
			<div className="flex min-h-0 flex-1 flex-col">
				{children}
			</div>
		</div>
	);
}
