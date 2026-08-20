"use client";

import type { ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import { AdminErrorBoundary } from "../components/AdminErrorBoundary";

/**
 * Requests layout implementing master-detail pattern.
 *
 * - Desktop (lg+): two-panel grid with list always visible on left,
 *   detail in an <aside> on the right when a request is selected.
 * - Mobile/tablet: full-page rendering — list page or detail page
 *   shown one at a time via normal route navigation.
 *
 * In Next.js App Router:
 * - No segment selected → children = requests/page.tsx (list view)
 * - Segment selected (e.g. [id]) → children = requests/[id]/page.tsx (detail)
 *
 * On desktop when a detail segment is active, the list is rendered directly
 * by this layout (via RequestListPanel) alongside the detail in children.
 * On mobile, only children (the active segment) is shown full-page.
 */
export default function RequestsLayout({
	children,
}: {
	children: ReactNode;
}) {
	const segment = useSelectedLayoutSegment();
	const hasDetail = segment !== null;

	if (!hasDetail) {
		// No detail selected — render list page full-width (children = page.tsx)
		return <>{children}</>;
	}

	// Detail route is active — master-detail on desktop, detail-only on mobile
	return (
		<div className="lg:grid lg:grid-cols-[1fr_1fr]">
			{/* List panel — visible only on desktop alongside detail */}
			<div className="hidden lg:block">
				<RequestListPanel />
			</div>

			{/* Detail panel — full-page on mobile, right column on desktop */}
			<aside
				aria-label="Request detail"
				className="border-terracotta-6 lg:border-l"
			>
				<AdminErrorBoundary level="panel">
					{children}
				</AdminErrorBoundary>
			</aside>
		</div>
	);
}

/**
 * Inline list panel rendered in the layout for desktop master-detail.
 * This is a placeholder that will render the full RequestListView once
 * that component is built (task 10.2+). For now it renders a loading-state
 * skeleton so the layout structure is functional.
 */
function RequestListPanel() {
	return (
		<div className="flex h-full flex-col overflow-y-auto p-4">
			<h2 className="text-size-6 font-semibold text-terracotta-9">
				Requests
			</h2>
			<p className="mt-2 text-sm text-terracotta-8">
				Request list loading…
			</p>
		</div>
	);
}
