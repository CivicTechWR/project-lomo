"use client";

import type { Doc } from "@repo/convex-backend/convex/_generated/dataModel";
import type { Preloaded } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import type { ReactNode } from "react";
import type { HelpRequestStatus, HelpRequestStatusFilter } from "@/lib/help-request-status";
import type { OpenRequestFilters } from "@/lib/open-request-filters";
import type { RequestCategoryId } from "@/lib/request-flow/types";
import { usePreloadedAuthQuery } from "@convex-dev/better-auth/nextjs/client";
import { api } from "@repo/convex-backend/convex/_generated/api";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Checkbox, CheckboxGroup } from "@repo/ui/checkbox";
import { Heading } from "@repo/ui/heading";
import { Modal, ModalOverlay } from "@repo/ui/modal";
import { Text } from "@repo/ui/text";
import { useQuery } from "convex/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	DEFAULT_HELP_AREA_CENTER,
	DEFAULT_HELP_AREA_RADIUS_KM,
	HELP_AREA_RADIUS_MAX_KM,
	HELP_AREA_RADIUS_MIN_KM,
} from "@/lib/help-area";
import {
	HELP_REQUEST_FILTER_CHIPS,
	HELP_REQUEST_STATUS_LABEL,
	statusBadgeColor,
} from "@/lib/help-request-status";
import { useHomeMode } from "@/lib/home-mode-context";
import {
	EMPTY_OPEN_REQUEST_FILTERS,
	filterOpenRequests,
	hasActiveOpenRequestFilters,

} from "@/lib/open-request-filters";
import { REQUEST_CATEGORIES } from "@/lib/request-flow/categories";
import { StatusFilterChips } from "./status-filter-chips";

const HelpAreaMap = dynamic(
	() => import("./help-area-map").then(m => m.HelpAreaMap),
	{
		ssr: false,
		loading: () => (
			<div className="h-64 w-full animate-pulse rounded-[max(var(--radius-3),12px)] border border-gray-6 bg-gray-3 lg:h-80" />
		),
	},
);

type OpenRequestListItem = FunctionReturnType<
	typeof api.helpRequests.listPendingFromOthers
>[number];

type HomeDashboard = NonNullable<
	FunctionReturnType<typeof api.helpRequests.homeDashboard>
>;

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

function ChevronIcon({ expanded, className }: { expanded: boolean; className?: string }) {
	return (
		<svg
			className={className}
			width={16}
			height={16}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
			style={{
				transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
				transition: "transform 150ms ease",
			}}
		>
			<polyline points="9 18 15 12 9 6" />
		</svg>
	);
}

function HomeSection(props: {
	id: string;
	title: string;
	count: number;
	expanded: boolean;
	onExpandedChange: (expanded: boolean) => void;
	children: ReactNode;
}) {
	const { id, title, count, expanded, onExpandedChange, children } = props;
	const panelId = `${id}-panel`;

	return (
		<section className="flex flex-col gap-3">
			<button
				type="button"
				className="flex w-full items-center gap-2 rounded-[var(--radius-2)] text-left outline-none ring-gray-8 focus-visible:ring-2"
				aria-expanded={expanded}
				aria-controls={panelId}
				onClick={() => onExpandedChange(!expanded)}
			>
				<ChevronIcon expanded={expanded} className="shrink-0 text-gray-11" />
				<Heading level={2} size={5} className="min-w-0 flex-1">
					{title}
				</Heading>
				<Badge variant="soft" size={1} color="gray">
					{count}
				</Badge>
			</button>
			{expanded
				? (
						<div id={panelId} className="flex flex-col gap-3">
							{children}
						</div>
					)
				: null}
		</section>
	);
}

function RequestCardLink(props: {
	href: string;
	title: string;
	summary: string;
	badges?: ReactNode;
}) {
	const { href, title, summary, badges } = props;
	return (
		<Link
			href={href}
			className="block rounded-[max(var(--radius-3),12px)] outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2"
		>
			<Card
				size={2}
				variant="surface"
				className="p-4 transition-colors hover:bg-gray-2"
			>
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0 flex-1">
						<Text size={3} weight="medium" className="line-clamp-2">
							{title}
						</Text>
						<Text size={2} color="gray" className="mt-1 line-clamp-2">
							{summary}
						</Text>
					</div>
					{badges
						? (
								<div className="flex shrink-0 flex-col items-end gap-1">
									{badges}
								</div>
							)
						: null}
				</div>
			</Card>
		</Link>
	);
}

function activeRoleLabel(item: HomeDashboard["active"][number]): string {
	if (item.status === "awaiting_requester_acceptance") {
		return item.role === "requester" ? "Accept offer" : "Awaiting acceptance";
	}
	return item.role === "requester" ? "Receiving help" : "Offering help";
}

export function RequestsHome({
	preloadedUser,
}: {
	preloadedUser: Preloaded<typeof api.auth.getCurrentUser>;
}) {
	const router = useRouter();
	const user = usePreloadedAuthQuery(preloadedUser);
	const { mode, setMode } = useHomeMode();
	const [statusFilter, setStatusFilter] = useState<HelpRequestStatusFilter>(null);

	const listArgs
		= statusFilter === null ? {} : { statusFilter };

	const myRequests = useQuery(
		api.helpRequests.listMine,
		mode === "request_help" ? listArgs : "skip",
	);
	const isAdmin = useQuery(api.helpRequests.isAdmin, {});
	const dashboard = useQuery(
		api.helpRequests.homeDashboard,
		mode === "home" ? {} : "skip",
	);

	if (!user) {
		return null;
	}

	return (
		<div className="flex w-full flex-col gap-6">
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

			{mode === "home" && (
				<HomeDashboardPanel
					dashboard={dashboard}
					onViewAllMine={() => setMode("request_help")}
					onViewAllOpen={() => setMode("offer_help")}
					onNewRequest={() => router.push("/app/request?fresh=1")}
				/>
			)}
			{mode === "request_help" && (
				<RequestingHelpPanel
					router={router}
					statusFilter={statusFilter}
					setStatusFilter={setStatusFilter}
					requests={myRequests}
				/>
			)}
			{mode === "offer_help" && (
				<OfferingHelpPanel />
			)}
		</div>
	);
}

function HomeDashboardPanel(props: {
	dashboard: HomeDashboard | undefined;
	onViewAllMine: () => void;
	onViewAllOpen: () => void;
	onNewRequest: () => void;
}) {
	const { dashboard, onViewAllMine, onViewAllOpen, onNewRequest } = props;
	const [activeOpen, setActiveOpen] = useState(true);
	const [pendingOpen, setPendingOpen] = useState(true);
	const [openRequestsOpen, setOpenRequestsOpen] = useState(true);
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		if (!dashboard || initialized) {
			return;
		}
		setActiveOpen(dashboard.active.length > 0);
		setPendingOpen(dashboard.pendingMine.length > 0);
		setOpenRequestsOpen(dashboard.canHelpNow && dashboard.openPreview.length > 0);
		setInitialized(true);
	}, [dashboard, initialized]);

	const showPending = dashboard === undefined || dashboard.pendingMineTotal > 0;
	const showOpenRequests = dashboard !== undefined && dashboard.canHelpNow;

	return (
		<>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<Heading level={1} size={7}>
						Home
					</Heading>
					<Text size={2} color="gray" className="mt-1">
						Your active matches, pending requests for support, and nearby open requests.
					</Text>
				</div>
				<div className="flex shrink-0 flex-wrap items-center gap-2">
					<Button
						variant="solid"
						color="sage"
						size={2}
						onPress={onNewRequest}
					>
						New request
					</Button>
				</div>
			</div>

			{dashboard === undefined && (
				<Text size={2} color="gray">
					Loading…
				</Text>
			)}

			{dashboard !== undefined && (
				<div className="flex flex-col gap-8">
					<HomeSection
						id="active-matches"
						title="Support in progress"
						count={dashboard.active.length}
						expanded={activeOpen}
						onExpandedChange={setActiveOpen}
					>
						{dashboard.active.length === 0
							? (
									<Card size={2} variant="surface" className="p-6">
										<Text size={3} color="gray" className="text-center">
											No active matches right now. When someone offers help — or
											you&apos;re helping someone — it will show up here.
										</Text>
									</Card>
								)
							: (
									<ul className="flex flex-col gap-3">
										{dashboard.active.map(item => (
											<li key={`${item.role}-${item._id}`}>
												<RequestCardLink
													href={
														item.role === "requester"
															? `/app/requests/${item._id}`
															: `/app/offer/${item._id}`
													}
													title={item.title}
													summary={item.summary}
													badges={(
														<>
															<Badge
																variant="soft"
																size={1}
																color={
																	item.status === "awaiting_requester_acceptance"
																		? "terracotta"
																		: "sage"
																}
															>
																{activeRoleLabel(item)}
															</Badge>
															<Badge
																variant="soft"
																size={1}
																color={statusBadgeColor(item.status as HelpRequestStatus)}
															>
																{HELP_REQUEST_STATUS_LABEL[item.status as HelpRequestStatus]}
															</Badge>
														</>
													)}
												/>
											</li>
										))}
									</ul>
								)}
					</HomeSection>

					{showPending && (
						<HomeSection
							id="pending-requests"
							title="My requests for support"
							count={dashboard.pendingMineTotal}
							expanded={pendingOpen}
							onExpandedChange={setPendingOpen}
						>
							{dashboard.pendingMine.length === 0
								? (
										<Card size={2} variant="surface" className="p-6">
											<Text size={3} color="gray" className="text-center">
												You don&apos;t have any pending requests.
											</Text>
										</Card>
									)
								: (
										<>
											<ul className="flex flex-col gap-3">
												{dashboard.pendingMine.map(item => (
													<li key={item._id}>
														<RequestCardLink
															href={`/app/requests/${item._id}`}
															title={item.title}
															summary={item.summary}
															badges={(
																<>
																	{item.isUrgent
																		? (
																				<Badge variant="soft" size={1} color="red">
																					Urgent
																				</Badge>
																			)
																		: null}
																	<Badge variant="soft" size={1} color="amber">
																		Pending
																	</Badge>
																</>
															)}
														/>
													</li>
												))}
											</ul>
											<Button
												variant="soft"
												color="gray"
												size={2}
												className="self-start"
												onPress={onViewAllMine}
											>
												View all my requests
											</Button>
										</>
									)}
						</HomeSection>
					)}

					{showOpenRequests && (
						<HomeSection
							id="open-requests"
							title="Open requests"
							count={dashboard.openTotal}
							expanded={openRequestsOpen}
							onExpandedChange={setOpenRequestsOpen}
						>
							{dashboard.openPreview.length === 0
								? (
										<Card size={2} variant="surface" className="p-6">
											<Text size={3} color="gray" className="text-center">
												No open requests right now. Check back again soon.
											</Text>
										</Card>
									)
								: (
										<>
											<ul className="flex flex-col gap-3">
												{dashboard.openPreview.map(item => (
													<li key={item._id}>
														<RequestCardLink
															href={`/app/offer/${item._id}`}
															title={item.title}
															summary={item.summary}
															badges={(
																<>
																	{item.inYourArea
																		? (
																				<Badge variant="soft" size={1} color="sage">
																					In your area
																				</Badge>
																			)
																		: null}
																	{item.isUrgent
																		? (
																				<Badge variant="soft" size={1} color="red">
																					Urgent
																				</Badge>
																			)
																		: null}
																</>
															)}
														/>
													</li>
												))}
											</ul>
											<Button
												variant="soft"
												color="gray"
												size={2}
												className="self-start"
												onPress={onViewAllOpen}
											>
												View all open requests
											</Button>
										</>
									)}
						</HomeSection>
					)}
				</div>
			)}
		</>
	);
}

function RequestingHelpPanel(props: {
	router: ReturnType<typeof useRouter>;
	statusFilter: HelpRequestStatusFilter;
	setStatusFilter: (v: HelpRequestStatusFilter) => void;
	requests: Doc<"helpRequests">[] | undefined;
}) {
	const { router, statusFilter, setStatusFilter, requests } = props;
	const [statusOpen, setStatusOpen] = useState(false);
	const statusFilterLabel
		= HELP_REQUEST_FILTER_CHIPS.find(chip => chip.value === statusFilter)?.label
			?? "All";
	const statusFilterActive = statusFilter !== null;

	return (
		<>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<Heading level={1} size={7}>
						My requests
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

			<div className="flex flex-wrap items-center gap-2">
				<Button
					size={1}
					variant="soft"
					color={statusFilterActive ? "sage" : "gray"}
					border="small"
					borderColor={statusFilterActive ? "sage" : "gray"}
					className="gap-1.5 !rounded-full"
					onPress={() => setStatusOpen(true)}
				>
					<FilterIcon />
					Status:
					{" "}
					{statusFilterLabel}
				</Button>
			</div>

			<ModalOverlay
				isOpen={statusOpen}
				onOpenChange={setStatusOpen}
				isDismissable
			>
				<Modal size={2} aria-labelledby="my-request-status-filter-title">
					<div className="flex flex-col gap-4">
						<Heading id="my-request-status-filter-title" level={2} size={4}>
							Status
						</Heading>
						<div className="flex flex-col gap-2" role="listbox" aria-label="Filter by status">
							{HELP_REQUEST_FILTER_CHIPS.map((chip) => {
								const selected = statusFilter === chip.value;
								return (
									<Button
										key={chip.label}
										size={2}
										variant={selected ? "soft" : "outline"}
										color={selected ? "sage" : "gray"}
										className="justify-start"
										onPress={() => setStatusFilter(chip.value)}
									>
										{chip.label}
									</Button>
								);
							})}
						</div>
						<Button
							variant="soft"
							color="gray"
							size={2}
							className="self-end"
							onPress={() => setStatusOpen(false)}
						>
							Done
						</Button>
					</div>
				</Modal>
			</ModalOverlay>
			<StatusFilterChips value={statusFilter} onChange={setStatusFilter} />

			{requests === undefined && (
				<Text size={2} color="gray">
					Loading…
				</Text>
			)}

			{requests !== undefined && requests.length === 0 && (
				<Card size={2} variant="surface" className="p-6">
					<Text size={3} color="gray" className="text-center">
						{statusFilterActive
							? "No requests match this filter. Try another status, or post a new request."
							: "No requests yet. When you post a new request, it'll show up here."}
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
							<RequestCardLink
								href={`/app/requests/${r._id}`}
								title={r.title}
								summary={r.summary}
								badges={(
									<Badge
										variant="soft"
										size={1}
										color={statusBadgeColor(r.status as HelpRequestStatus)}
									>
										{HELP_REQUEST_STATUS_LABEL[r.status as HelpRequestStatus]}
									</Badge>
								)}
							/>
						</li>
					))}
				</ul>
			)}
		</>
	);
}

function MapPinIcon({ className }: { className?: string }) {
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
			<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
			<circle cx="12" cy="10" r="3" />
		</svg>
	);
}

interface LocationFilter {
	centerLat: number;
	centerLng: number;
	radiusKm: number;
}

function locationFilterFromProfile(row: {
	helpAreaCenterLat?: number;
	helpAreaCenterLng?: number;
	helpAreaRadiusKm?: number;
} | null | undefined): LocationFilter {
	return {
		centerLat: row?.helpAreaCenterLat ?? DEFAULT_HELP_AREA_CENTER.lat,
		centerLng: row?.helpAreaCenterLng ?? DEFAULT_HELP_AREA_CENTER.lng,
		radiusKm: row?.helpAreaRadiusKm ?? DEFAULT_HELP_AREA_RADIUS_KM,
	};
}

function locationFiltersEqual(a: LocationFilter, b: LocationFilter): boolean {
	return Math.abs(a.centerLat - b.centerLat) < 0.0001
		&& Math.abs(a.centerLng - b.centerLng) < 0.0001
		&& a.radiusKm === b.radiusKm;
}

function OfferingHelpPanel() {
	const profileRow = useQuery(api.users.getMyProfileRow);
	const [filters, setFilters] = useState<OpenRequestFilters>(EMPTY_OPEN_REQUEST_FILTERS);
	const [categoriesOpen, setCategoriesOpen] = useState(false);
	const [locationOpen, setLocationOpen] = useState(false);
	const [locationFilter, setLocationFilter] = useState<LocationFilter>(() =>
		locationFilterFromProfile(undefined));
	const [locationDraft, setLocationDraft] = useState<LocationFilter>(locationFilter);
	const [locationReady, setLocationReady] = useState(false);
	const [defaultLocation, setDefaultLocation] = useState<LocationFilter>(() =>
		locationFilterFromProfile(undefined));

	useEffect(() => {
		if (locationReady || profileRow === undefined) {
			return;
		}
		const fromProfile = locationFilterFromProfile(profileRow);
		setDefaultLocation(fromProfile);
		setLocationFilter(fromProfile);
		setLocationDraft(fromProfile);
		setLocationReady(true);
	}, [profileRow, locationReady]);

	const openForOthers = useQuery(
		api.helpRequests.listPendingFromOthers,
		locationReady
			? {
					filterCenterLat: locationFilter.centerLat,
					filterCenterLng: locationFilter.centerLng,
					filterRadiusKm: locationFilter.radiusKm,
				}
			: "skip",
	);

	const filteredRequests = openForOthers === undefined
		? undefined
		: filterOpenRequests(openForOthers, filters);
	const filtersActive = hasActiveOpenRequestFilters(filters)
		|| !locationFiltersEqual(locationFilter, defaultLocation);
	const selectedCategoryCount = filters.categories.length;
	const categoriesButtonActive = selectedCategoryCount > 0;
	const locationButtonActive = !locationFiltersEqual(locationFilter, defaultLocation);
	const openRequestCategories = REQUEST_CATEGORIES.filter(category => category.implemented);

	function openLocationModal() {
		setLocationDraft(locationFilter);
		setLocationOpen(true);
	}

	function applyLocationFilter() {
		setLocationFilter(locationDraft);
		setLocationOpen(false);
	}

	function resetLocationToDefault() {
		setLocationDraft(defaultLocation);
	}

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
					className="gap-1.5 !rounded-full"
					onPress={() => setCategoriesOpen(true)}
				>
					<FilterIcon />
					Categories (
					{selectedCategoryCount}
					)
				</Button>
				<Button
					size={1}
					variant="soft"
					color={locationButtonActive ? "sage" : "gray"}
					border="small"
					borderColor={locationButtonActive ? "sage" : "gray"}
					className="gap-1.5 !rounded-full"
					onPress={openLocationModal}
				>
					<MapPinIcon />
					Area ·
					{" "}
					{locationFilter.radiusKm}
					{" "}
					km
				</Button>
				<Button
					size={1}
					variant="soft"
					color={filters.urgentOnly ? "red" : "gray"}
					border="small"
					borderColor={filters.urgentOnly ? "red" : "gray"}
					className="gap-1.5 !rounded-full"
					onPress={() =>
						setFilters(current => ({
							...current,
							urgentOnly: !current.urgentOnly,
						}))}
				>
					<ExclamationIcon />
					Urgent
				</Button>
				{filtersActive && (
					<button
						type="button"
						className="px-1 text-[length:var(--text-1)] text-gray-11 underline-offset-2 outline-none hover:text-gray-12 hover:underline focus-visible:ring-2 focus-visible:ring-gray-8"
						onClick={() => {
							setFilters(EMPTY_OPEN_REQUEST_FILTERS);
							setLocationFilter(defaultLocation);
						}}
					>
						Clear filters
					</button>
				)}
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

			<ModalOverlay
				isOpen={locationOpen}
				onOpenChange={setLocationOpen}
				isDismissable
			>
				<Modal size={3} aria-labelledby="open-request-location-filter-title">
					<div className="flex flex-col gap-4">
						<div>
							<Heading id="open-request-location-filter-title" level={2} size={4}>
								Area
							</Heading>
							<Text size={2} color="gray" className="mt-1">
								Show requests in this area, plus any without a set location.
								Drag the map and adjust the radius to expand or narrow results.
							</Text>
						</div>
						{locationOpen
							? (
									<HelpAreaMap
										centerLat={locationDraft.centerLat}
										centerLng={locationDraft.centerLng}
										radiusKm={locationDraft.radiusKm}
										onCenterChange={(centerLat, centerLng) =>
											setLocationDraft(current => ({
												...current,
												centerLat,
												centerLng,
											}))}
									/>
								)
							: null}
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between gap-3">
								<Text size={2} color="gray">
									Radius
								</Text>
								<Text size={2} weight="medium">
									{locationDraft.radiusKm}
									{" "}
									km
								</Text>
							</div>
							<input
								type="range"
								min={HELP_AREA_RADIUS_MIN_KM}
								max={HELP_AREA_RADIUS_MAX_KM}
								step={1}
								value={locationDraft.radiusKm}
								onChange={event =>
									setLocationDraft(current => ({
										...current,
										radiusKm: Number(event.target.value),
									}))}
								className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-4 accent-sage-9"
								aria-label="Filter radius in kilometres"
							/>
							<div className="flex justify-between">
								<Text size={1} color="gray">
									{HELP_AREA_RADIUS_MIN_KM}
									{" "}
									km
								</Text>
								<Text size={1} color="gray">
									{HELP_AREA_RADIUS_MAX_KM}
									{" "}
									km
								</Text>
							</div>
						</div>
						<div className="flex flex-wrap items-center justify-between gap-2">
							<Button
								variant="ghost"
								color="gray"
								size={2}
								isDisabled={locationFiltersEqual(locationDraft, defaultLocation)}
								onPress={resetLocationToDefault}
							>
								Reset to my area
							</Button>
							<Button
								variant="solid"
								color="sage"
								size={2}
								onPress={applyLocationFilter}
							>
								Apply
							</Button>
						</div>
					</div>
				</Modal>
			</ModalOverlay>

			{(!locationReady || openForOthers === undefined) && (
				<Text size={2} color="gray">
					Loading…
				</Text>
			)}

			{filteredRequests !== undefined && filteredRequests.length === 0 && (
				<Card size={2} variant="surface" className="p-6">
					<Text size={3} color="gray" className="text-center">
						{filtersActive
							? "No open requests match these filters. Try adjusting them or check back again soon."
							: "No open requests right now. Check back again soon."}
					</Text>
				</Card>
			)}

			{filteredRequests !== undefined && filteredRequests.length > 0 && (
				<ul className="flex flex-col gap-3">
					{filteredRequests.map(r => (
						<li key={r._id}>
							<RequestCardLink
								href={`/app/offer/${r._id}`}
								title={r.title}
								summary={r.summary}
								badges={(
									<>
										{r.inYourArea
											? (
													<Badge variant="soft" size={1} color="sage">
														In your area
													</Badge>
												)
											: null}
										{r.isUrgent
											? (
													<Badge variant="soft" size={1} color="red">
														Urgent
													</Badge>
												)
											: null}
									</>
								)}
							/>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
