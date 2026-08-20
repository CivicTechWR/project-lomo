"use client";

import type { ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { AdminErrorBoundary } from "../components/AdminErrorBoundary";

/**
 * Users layout implementing master-detail pattern.
 *
 * - No segment selected → renders children (list page) full-width
 * - Segment selected (e.g. [id]) → desktop shows master-detail grid,
 *   mobile shows detail full-page
 */
export default function UsersLayout({ children }: { children: ReactNode }) {
	const segment = useSelectedLayoutSegment();
	const hasDetail = segment !== null;

	if (!hasDetail) {
		// No detail selected — render list page full-width (children = page.tsx)
		return <>{children}</>;
	}

	// Detail route is active — master-detail on desktop, detail-only on mobile
	return (
		<div className="lg:grid lg:grid-cols-[1fr_1fr]">
			{/* Detail panel — full-page on mobile, right column on desktop */}
			<aside
				aria-label="User detail"
				className="lg:overflow-y-auto lg:border-l lg:border-gray-6"
			>
				<AdminErrorBoundary level="panel">
					{children}
				</AdminErrorBoundary>
			</aside>
		</div>
	);
}
