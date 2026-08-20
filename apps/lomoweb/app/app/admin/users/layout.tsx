"use client";

import type { ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { AdminErrorBoundary } from "../components/AdminErrorBoundary";

export default function UsersLayout({ children }: { children: ReactNode }) {
	const segment = useSelectedLayoutSegment();
	return (
		<div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[1fr_1fr]">
			{/* On desktop (lg+): list page is always visible in left column,
          detail panel shows in right column when a user is selected.
          On mobile: children (either list or detail) renders full-page. */}
			{segment && (
				<aside
					aria-label="User detail"
					className="hidden lg:block lg:overflow-y-auto lg:border-l lg:border-terracotta-6"
				>
					<AdminErrorBoundary level="panel">
						{children}
					</AdminErrorBoundary>
				</aside>
			)}
			{!segment && children}
		</div>
	);
}
