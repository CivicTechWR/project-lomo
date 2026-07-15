"use client";

import type { FunctionReturnType } from "convex/server";
import { api } from "@repo/convex-backend/convex/_generated/api";
import type { Doc } from "@repo/convex-backend/convex/_generated/dataModel";
import type { Preloaded } from "convex/react";
import { useQuery } from "convex/react";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Checkbox, CheckboxGroup } from "@repo/ui/checkbox";
import { Heading } from "@repo/ui/heading";
import { Modal, ModalOverlay } from "@repo/ui/modal";
import { Text } from "@repo/ui/text";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	EMPTY_OPEN_REQUEST_FILTERS,
	filterOpenRequests,
	hasActiveOpenRequestFilters,
	type OpenRequestFilters,
} from "@/lib/open-request-filters";
import { useHomeMode } from "@/lib/home-mode-context";
import { REQUEST_CATEGORIES } from "@/lib/request-flow/categories";
import type { RequestCategoryId } from "@/lib/request-flow/types";
import {
	HELP_REQUEST_FILTER_CHIPS,
	HELP_REQUEST_STATUS_LABEL,
	type HelpRequestStatus,
	type HelpRequestStatusFilter,
	statusBadgeColor,
} from "@/lib/help-request-status";

type OpenRequestListItem = FunctionReturnType<
	typeof api.helpRequests.listPendingFromOthers
>[number];

function FilterIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={14}
			height={14}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
		</svg>
	);
}

function ExclamationIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			width={14}
			height={14}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="8" x2="12" y2="12" />
			<line x1="12" y1="16" x2="12.01" y2="16" />
		</svg>
	);
}

export function RequestsHome({
	preloadedUser,
}: {
	preloadedUser: Preloaded<typeof api.auth.getCurrentUser>;
}) {
	const router = useRouter();
	const user = usePreloadedAuthQuery(preloadedUser);
	const { mode } = useHomeMode();
	const [statusFilter, setStatusFilter] = useState<HelpRequestStatusFilter>(null);

	const listArgs
		= statusFilter === null ? {} : { statusFilter };

	const myRequests = useQuery(api.helpRequests.listMine, listArgs);
	const isAdmin = useQuery(api.helpRequests.isAdmin, {});
	const openForOthers = useQuery(
		api.helpRequests.listPendingFromOthers,
		mode === "offer_help" ? {} : "skip",
	);

	if (!user) {
		return null;
	}

	return (
		<div className="flex w-full max-w-lg flex-col gap-6 lg:max-w-none">
			{isAdmin && (
				<Button
					variant="soft"
					color="terracotta"
					size={2}
					className="self-start"
					onPress={() => router.push("/app/admin")}
				>
					Admin dashboard
				</Button>
			)}
			<div
				className="flex rounded-[max(var(--radius-3),12px)] border border-gray-6 bg-gray-2 p-1"
				role="tablist"
				aria-label="How you are using LoMo"
			>
				<button
					type="button"
					role="tab"
					aria-selected={mode === "request_help"}
					className={
						mode === "request_help"
							? "min-h-10 flex-1 rounded-[var(--radius-2)] bg-gray-1 px-3 text-[length:var(--text-2)] font-medium text-gray-12 shadow-sm"
							: "min-h-10 flex-1 rounded-[var(--radius-2)] px-3 text-[length:var(--text-2)] font-medium text-gray-11 transition-colors hover:text-gray-12"
					}
					onClick={() => setMode("request_help")}
				>
					Requesting help
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={mode === "offer_help"}
					className={
						mode === "offer_help"
							? "min-h-10 flex-1 rounded-[var(--radius-2)] bg-gray-1 px-3 text-[length:var(--text-2)] font-medium text-gray-12 shadow-sm"
							: "min-h-10 flex-1 rounded-[var(--radius-2)] px-3 text-[length:var(--text-2)] font-medium text-gray-11 transition-colors hover:text-gray-12"
					}
					onClick={() => setMode("offer_help")}
				>
					Offering help
				</button>
			</div>

			{mode === "request_help" ? (
				<RequestingHelpPanel
					router={router}
					statusFilter={statusFilter}
					setStatusFilter={setStatusFilter}
					requests={myRequests}
				/>
			) : (
				<OfferingHelpPanel openForOthers={openForOthers} />
			)}
		</div>
	);
}

function RequestingHelpPanel(props: {
	router: ReturnType<typeof useRouter>;
	statusFilter: HelpRequestStatusFilter;
	setStatusFilter: (v: HelpRequestStatusFilter) => void;
	requests: Doc<"helpRequests">[] | undefined;
}) {
	const { router, statusFilter, setStatusFilter, requests } = props;

	return (
		<>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<Heading level={1} size={7}>
						Your requests
					</Heading>
					<Text size={2} color="gray" className="mt-1">
						Track what you&apos;ve asked for and how it&apos;s going.
					</Text>
				</div>
				<div className="flex shrink-0 flex-wrap items-center gap-2">
					<Button
						variant="solid"
						color="sage"
						size={2}
						onPress={() => router.push("/app/request?fresh=1")}
					>
						New request
					</Button>
				</div>
			</div>

			<div className="flex flex-wrap gap-2">
				{HELP_REQUEST_FILTER_CHIPS.map(chip => {
					const active = statusFilter === chip.value;
					return (
						<Button
							key={chip.label}
							size={1}
							variant={active ? "soft" : "outline"}
							color={active ? "gray" : "gray"}
							className="rounded-full"
							onPress={() => setStatusFilter(chip.value)}
						>
							{chip.label}
						</Button>
					);
				})}
			</div>

			{requests === undefined && (
				<Text size={2} color="gray">
					Loading…
				</Text>
			)}

			{requests !== undefined && requests.length === 0 && (
				<Card size={2} variant="surface" className="p-6">
					<Text size={3} color="gray" className="text-center">
						No requests match this filter yet. When you post a new request,
						it&apos;ll show up here.
					</Text>
					<div className="mt-4 flex justify-center">
						<Button
							variant="solid"
							color="sage"
							size={2}
							onPress={() => router.push("/app/request?fresh=1")}
						>
							Start a request
						</Button>
					</div>
				</Card>
			)}

			{requests !== undefined && requests.length > 0 && (
				<ul className="flex flex-col gap-3">
					{requests.map(r => (
						<li key={r._id}>
							<Link
								href={`/app/requests/${r._id}`}
								className="block rounded-[max(var(--radius-3),12px)] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2"
							>
								<Card
									size={2}
									variant="surface"
									className="p-4 transition-colors hover:bg-gray-2"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0 flex-1">
											<Text
												size={3}
												weight="medium"
												className="line-clamp-2"
											>
												{r.title}
											</Text>
											<Text
												size={2}
												color="gray"
												className="mt-1 line-clamp-2"
											>
												{r.summary}
											</Text>
										</div>
										<Badge
											variant="soft"
											size={1}
											color={statusBadgeColor(r.status as HelpRequestStatus)}
										>
											{HELP_REQUEST_STATUS_LABEL[r.status as HelpRequestStatus]}
										</Badge>
									</div>
								</Card>
							</Link>
						</li>
					))}
				</ul>
			)}
		</>
	);
}

function OfferingHelpPanel(props: {
	openForOthers: OpenRequestListItem[] | undefined;
}) {
	const { openForOthers } = props;
	const [filters, setFilters] = useState<OpenRequestFilters>(EMPTY_OPEN_REQUEST_FILTERS);
	const [categoriesOpen, setCategoriesOpen] = useState(false);

	const filteredRequests = openForOthers === undefined
		? undefined
		: filterOpenRequests(openForOthers, filters);
	const filtersActive = hasActiveOpenRequestFilters(filters);
	const selectedCategoryCount = filters.categories.length;
	const categoriesButtonActive = selectedCategoryCount > 0;
	const openRequestCategories = REQUEST_CATEGORIES.filter(category => category.implemented);

	return (
		<>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<Heading level={1} size={7}>
						Open requests
					</Heading>
					<Text size={2} color="gray" className="mt-1">
						People in the community are looking for support. Open a request
						to read more — if it feels like a fit, you can offer to help.
					</Text>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-2">
				<Button
					size={1}
					variant="soft"
					color={categoriesButtonActive ? "sage" : "gray"}
					border="small"
					borderColor={categoriesButtonActive ? "sage" : "gray"}
					className="gap-1.5 rounded-full"
					onPress={() => setCategoriesOpen(true)}
				>
					<FilterIcon />
					Categories ({selectedCategoryCount})
				</Button>
				<Button
					size={1}
					variant="soft"
					color={filters.urgentOnly ? "red" : "gray"}
					border="small"
					borderColor={filters.urgentOnly ? "red" : "gray"}
					className="gap-1.5 rounded-full"
					onPress={() =>
						setFilters(current => ({
							...current,
							urgentOnly: !current.urgentOnly,
						}))}
				>
					<ExclamationIcon />
					Urgent
				</Button>
			</div>

			<ModalOverlay
				isOpen={categoriesOpen}
				onOpenChange={setCategoriesOpen}
				isDismissable
			>
				<Modal size={2} aria-labelledby="open-request-category-filter-title">
					<div className="flex flex-col gap-4">
						<Heading id="open-request-category-filter-title" level={2} size={4}>
							Categories
						</Heading>
						<CheckboxGroup
							value={filters.categories}
							onChange={(value) => {
								setFilters(current => ({
									...current,
									categories: value as RequestCategoryId[],
								}));
							}}
							className="flex flex-col gap-2"
						>
							{openRequestCategories.map(category => (
								<Checkbox key={category.id} value={category.id}>
									{category.title}
								</Checkbox>
							))}
						</CheckboxGroup>
						<Button
							variant="soft"
							color="gray"
							size={2}
							className="self-end"
							onPress={() => setCategoriesOpen(false)}
						>
							Done
						</Button>
					</div>
				</Modal>
			</ModalOverlay>

			{openForOthers === undefined && (
				<Text size={2} color="gray">
					Loading…
				</Text>
			)}

			{filteredRequests !== undefined && filteredRequests.length === 0 && (
				<Card size={2} variant="surface" className="p-6">
					<Text size={3} color="gray" className="text-center">
						{filtersActive
							? "No open requests match these filters. Try adjusting them or check back again soon."
							: "No open requests match your help area right now. You can widen your radius in Profile, or check back again soon."}
					</Text>
				</Card>
			)}

			{filteredRequests !== undefined && filteredRequests.length > 0 && (
				<ul className="flex flex-col gap-3">
					{filteredRequests.map(r => (
						<li key={r._id}>
							<Link
								href={`/app/offer/${r._id}`}
								className="block rounded-[max(var(--radius-3),12px)] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2"
							>
								<Card
									size={2}
									variant="surface"
									className="p-4 transition-colors hover:bg-gray-2"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0 flex-1">
											<Text
												size={3}
												weight="medium"
												className="line-clamp-2"
											>
												{r.title}
											</Text>
											<Text
												size={2}
												color="gray"
												className="mt-1 line-clamp-2"
											>
												{r.summary}
											</Text>
										</div>
										{r.isUrgent
											? (
													<Badge variant="soft" size={1} color="red">
														Urgent
													</Badge>
												)
											: null}
									</div>
								</Card>
							</Link>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
