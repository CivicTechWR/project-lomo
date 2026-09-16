"use client";

import type { ReactNode } from "react";
import type { HelpRequestStatus } from "../lib/filters";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Badge } from "@repo/ui/badge";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";
import { AdminErrorBoundary } from "../components/AdminErrorBoundary";
import { statusBadgeColor } from "../lib/filters";

/* -------------------------------------------------------------------------- */
/*                               Constants                                     */
/* -------------------------------------------------------------------------- */

/** Regex to replace underscores with spaces in status labels */
const STATUS_LABEL_REGEX = /_/g;

/** Maps statusBadgeColor tokens to Badge component color props */
const BADGE_COLOR_MAP: Record<string, "gray" | "yellow" | "sage"> = {
	"gray-6": "gray",
	"yellow-5": "yellow",
	"sage-4": "sage",
	"sage-9": "sage",
	"darkred-5": "gray",
};

/* -------------------------------------------------------------------------- */
/*                            RequestsLayout                                   */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                           RequestListPanel                                   */
/* -------------------------------------------------------------------------- */

/**
 * Inline list panel rendered in the layout for desktop master-detail.
 * Subscribes to the admin request list and renders compact clickable cards.
 */
function RequestListPanel() {
	const params = useParams();
	const selectedId = typeof params.id === "string" ? params.id : null;
	const requests = useQuery(api.helpRequests.listAllForAdmin, {});

	return (
		<div className="flex h-full flex-col overflow-y-auto p-4">
			<h2 className="text-size-6 font-semibold text-terracotta-9">
				Requests
			</h2>

			{requests === undefined
				? (
						<p className="mt-2 text-sm text-terracotta-8">
							Loading requests…
						</p>
					)
				: (
						<ul className="mt-3 flex flex-col gap-2" role="list" aria-label="Requests list">
							{requests.map((request) => {
								const isSelected = request._id === selectedId;
								const status = request.status as HelpRequestStatus;
								const badgeToken = statusBadgeColor(status);
								const badgeColor = BADGE_COLOR_MAP[badgeToken] ?? "gray";
								const badgeVariant = badgeToken === "sage-9" ? "solid" : "soft";
								const statusLabel = status.replace(STATUS_LABEL_REGEX, " ");

								return (
									<li key={request._id}>
										<Link
											href={`/app/admin/requests/${request._id}`}
											className={`block rounded-2 border p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-8 focus-visible:ring-offset-2 ${
												isSelected
													? "border-terracotta-8 bg-terracotta-3"
													: "border-gray-6 bg-white hover:bg-gray-2"
											}`}
											aria-current={isSelected ? "page" : undefined}
										>
											<p className="truncate text-sm font-medium text-gray-12">
												{request.title}
											</p>
											<div className="mt-1.5 flex flex-wrap items-center gap-1.5">
												<Badge variant={badgeVariant} color={badgeColor} size={1}>
													{statusLabel}
												</Badge>
												<Badge variant="soft" color="gray" size={1}>
													{request.category}
												</Badge>
												{request.isUrgent && (
													<Badge variant="soft" color="red" size={1}>
														Urgent
													</Badge>
												)}
											</div>
										</Link>
									</li>
								);
							})}
						</ul>
					)}
		</div>
	);
}
