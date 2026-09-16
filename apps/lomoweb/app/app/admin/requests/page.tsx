"use client";

import type { FilterPillConfig } from "../components/FilterPillGroup";
import type {
	HelpRequestStatus,
	RequestCategory,
	RequestFilters,
	TimeRange,
} from "../lib/filters";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Badge } from "@repo/ui/badge";
import { Card } from "@repo/ui/card";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";
import { useQuery } from "convex/react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { FilterPillGroup } from "../components/FilterPillGroup";
import { SearchBar } from "../components/SearchBar";
import { filterRequests, statusBadgeColor } from "../lib/filters";

/* -------------------------------------------------------------------------- */
/*                               Constants                                     */
/* -------------------------------------------------------------------------- */

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
	{ value: "food", label: "Food" },
	{ value: "items", label: "Items" },
	{ value: "other", label: "Other" },
	{ value: "support", label: "Support" },
	{ value: "paperwork", label: "Paperwork" },
	{ value: "ceremony", label: "Ceremony" },
];

const TIME_OPTIONS: { value: string; label: string }[] = [
	{ value: "today", label: "Today" },
	{ value: "last7days", label: "Last 7 days" },
	{ value: "last30days", label: "Last 30 days" },
	{ value: "alltime", label: "All time" },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
	{ value: "pending", label: "Pending" },
	{ value: "assigned", label: "Assigned" },
	{ value: "awaiting_requester_acceptance", label: "Awaiting acceptance" },
	{ value: "in_progress", label: "In progress" },
	{ value: "complete", label: "Complete" },
	{ value: "cancelled", label: "Cancelled" },
];

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
/*                          RequestListSkeleton                                 */
/* -------------------------------------------------------------------------- */

function RequestListSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{/* Search bar skeleton */}
			<div className="h-11 w-full animate-pulse rounded-full bg-gray-3" />

			{/* Filter pills skeleton */}
			<div className="flex gap-2">
				<div className="h-8 w-24 animate-pulse rounded-full bg-gray-3" />
				<div className="h-8 w-20 animate-pulse rounded-full bg-gray-3" />
				<div className="h-8 w-22 animate-pulse rounded-full bg-gray-3" />
			</div>

			{/* Card skeletons */}
			<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Loading requests">
				{Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map(key => (
					<li key={key}>
						<Card size={2} className="rounded-4 border border-gray-6">
							<div className="flex items-start gap-3">
								<div className="h-10 w-10 animate-pulse rounded-full bg-gray-3" />
								<div className="flex-1">
									<div className="h-4 w-40 animate-pulse rounded bg-gray-3" />
									<div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-3" />
									<div className="mt-2 h-3 w-56 animate-pulse rounded bg-gray-3" />
									<div className="mt-2 flex gap-2">
										<div className="h-5 w-16 animate-pulse rounded-full bg-gray-3" />
										<div className="h-5 w-14 animate-pulse rounded-full bg-gray-3" />
									</div>
								</div>
							</div>
						</Card>
					</li>
				))}
			</ul>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                               RequestCard                                   */
/* -------------------------------------------------------------------------- */

interface RequestCardData {
	_id: string;
	_creationTime: number;
	title: string;
	summary: string;
	status: HelpRequestStatus;
	category: RequestCategory;
	isUrgent?: boolean;
	ownerName?: string | null;
	owner?: { name?: string | null; firstName?: string | null } | null;
	assignedHelper?: { name?: string | null } | null;
	messages?: { source: string; body: string }[];
}

function RequestCard({ request }: { request: RequestCardData }) {
	const ownerName = request.owner?.name ?? request.ownerName ?? "Unknown";
	const initial = ownerName.charAt(0).toUpperCase();
	const excerpt = request.summary.length > 80
		? `${request.summary.slice(0, 80)}...`
		: request.summary;

	const badgeToken = statusBadgeColor(request.status);
	const badgeColor = BADGE_COLOR_MAP[badgeToken] ?? "gray";
	const badgeVariant = badgeToken === "sage-9" ? "solid" : "soft";

	// Format status label for display
	const statusLabel = request.status.replace(STATUS_LABEL_REGEX, " ");

	// Latest coordinator note
	const latestNote = request.messages
		?.filter(m => m.source === "admin_note")
		.at(-1);

	// Assigned helper name
	const helperName = request.assignedHelper?.name;

	return (
		<li>
			<Link
				href={`/app/admin/requests/${request._id}`}
				className="block rounded-4 border border-gray-6 bg-white p-4 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2"
			>
				<div className="flex items-start gap-3">
					{/* Owner avatar placeholder */}
					<div
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-3 text-sm font-semibold text-gray-12"
						aria-hidden="true"
					>
						{initial}
					</div>

					<div className="min-w-0 flex-1">
						{/* Title */}
						<p className="truncate font-medium text-gray-12">
							{request.title}
						</p>

						{/* Owner name */}
						<p className="mt-0.5 text-sm text-gray-11">
							{ownerName}
						</p>

						{/* Description excerpt */}
						<p className="mt-1 text-sm text-gray-10">
							{excerpt}
						</p>

						{/* Badges row */}
						<div className="mt-2 flex flex-wrap items-center gap-1.5">
							{/* Status badge */}
							<Badge variant={badgeVariant} color={badgeColor} size={1}>
								{statusLabel}
							</Badge>

							{/* Urgency badge */}
							{request.isUrgent && (
								<Badge variant="soft" color="red" size={1}>
									Urgent
								</Badge>
							)}

							{/* Category */}
							<Badge variant="soft" color="gray" size={1}>
								{request.category}
							</Badge>
						</div>

						{/* Assigned helper */}
						{helperName && (
							<div className="mt-2">
								<Text size={1} color="gray">
									Helper:
									{" "}
									{helperName}
								</Text>
							</div>
						)}

						{/* Latest coordinator note */}
						{latestNote && (
							<div className="mt-1.5 rounded-2 border border-gray-4 bg-gray-2 px-2 py-1">
								<Text size={1} color="gray">
									Note:
									{" "}
									{latestNote.body.length > 60
										? `${latestNote.body.slice(0, 60)}...`
										: latestNote.body}
								</Text>
							</div>
						)}
					</div>
				</div>
			</Link>
		</li>
	);
}

/* -------------------------------------------------------------------------- */
/*                               EmptyState                                    */
/* -------------------------------------------------------------------------- */

function EmptyState() {
	return (
		<Card size={2} className="rounded-4 border border-gray-6">
			<div className="flex flex-col items-center gap-2 py-6 text-center">
				<Text size={3} weight="medium" color="gray">
					No requests match your criteria
				</Text>
				<Text size={2} color="gray">
					Try adjusting your search or filters to see more results.
				</Text>
			</div>
		</Card>
	);
}

/* -------------------------------------------------------------------------- */
/*                         RequestListView (page)                               */
/* -------------------------------------------------------------------------- */

export default function RequestsPage() {
	const requests = useQuery(api.helpRequests.listAllForAdmin, {});
	const isLoading = requests === undefined;

	// Filter state
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
	const [timeFilter, setTimeFilter] = useState<string[]>([]);
	const [statusFilter, setStatusFilter] = useState<string[]>([]);

	// Build filters object for filterRequests
	const filters: RequestFilters = {
		search,
		category: (categoryFilter[0] as RequestCategory) ?? null,
		timeRange: (timeFilter[0] as TimeRange) ?? null,
		status: (statusFilter[0] as HelpRequestStatus) ?? null,
	};

	// Apply client-side filtering
	const now = Date.now();
	const filteredRequests = isLoading
		? []
		: filterRequests(
				requests.map(r => ({
					_id: r._id,
					_creationTime: r._creationTime,
					title: r.title,
					summary: r.summary,
					status: r.status as HelpRequestStatus,
					category: r.category as RequestCategory,
					isUrgent: r.isUrgent,
					ownerName: r.owner?.name ?? null,
				})),
				filters,
				now,
			);

	// Build a lookup from filtered _id back to original enriched data for rendering
	const filteredIds = new Set(filteredRequests.map(r => r._id));
	const displayRequests = isLoading
		? []
		: requests.filter(r => filteredIds.has(r._id));

	const resultCount = displayRequests.length;

	// FilterPillGroup configs
	const handleClearAll = useCallback(() => {
		setCategoryFilter([]);
		setTimeFilter([]);
		setStatusFilter([]);
	}, []);

	const filterConfigs: FilterPillConfig[] = [
		{
			id: "category",
			label: "Category",
			options: CATEGORY_OPTIONS,
			selected: categoryFilter,
			onSelect: setCategoryFilter,
		},
		{
			id: "time",
			label: "Time",
			options: TIME_OPTIONS,
			selected: timeFilter,
			onSelect: setTimeFilter,
		},
		{
			id: "status",
			label: "Status",
			options: STATUS_OPTIONS,
			selected: statusFilter,
			onSelect: setStatusFilter,
		},
	];

	return (
		<div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:py-10">
			<Heading level={1} size={6} weight="bold" className="mb-6">
				Requests
				{!isLoading && (
					<span className="ml-2 text-lg font-normal text-gray-11">
						(
						{resultCount}
						)
					</span>
				)}
			</Heading>

			{/* aria-live for loading state */}
			<div aria-live="polite" aria-atomic="true" className="sr-only">
				{isLoading ? "Loading requests" : `${resultCount} requests displayed`}
			</div>

			{isLoading
				? <RequestListSkeleton />
				: (
						<div className="flex flex-col gap-4">
							{/* Search */}
							<SearchBar
								value={search}
								onChange={setSearch}
								placeholder="Search requests..."
							/>

							{/* Filter pills */}
							<FilterPillGroup
								filters={filterConfigs}
								onClearAll={handleClearAll}
							/>

							{/* Request list or empty state */}
							{displayRequests.length === 0
								? <EmptyState />
								: (
										<ul
											className="grid grid-cols-1 gap-4 sm:grid-cols-2"
											role="list"
											aria-label={`Requests list, ${resultCount} results`}
										>
											{displayRequests.map(request => (
												<RequestCard key={request._id} request={request} />
											))}
										</ul>
									)}
						</div>
					)}
		</div>
	);
}
