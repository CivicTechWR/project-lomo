"use client";

import type { Doc } from "@repo/convex-backend/convex/_generated/dataModel";
import type { Preloaded } from "convex/react";
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
import { Icon } from "@repo/ui/icons";
import { Modal, ModalOverlay } from "@repo/ui/modal";
import { Text } from "@repo/ui/text";
import { useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
import { isRequestUrgent } from "@/lib/request-urgency";
import { canOfferHelp } from "@/lib/user-status";
import { HomeDashboardPanel, RequestCardLink } from "./home-dashboard-panel";
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
						color="yellow"
						size={2}
						border="large"
						borderColor="terracotta"
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
					<Icon name="filter" className="size-3.5" />
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
							color="yellow"
							size={2}
							border="large"
							borderColor="terracotta"
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
									<>
										{isRequestUrgent(r)
											? (
													<Badge variant="soft" size={1} color="red">
														Urgent
													</Badge>
												)
											: null}
										<Badge
											variant="soft"
											size={1}
											color={statusBadgeColor(r.status as HelpRequestStatus)}
										>
											{HELP_REQUEST_STATUS_LABEL[r.status as HelpRequestStatus]}
										</Badge>
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

/**
 * Shown instead of the open request list while the user is resting or blocked.
 *
 * The mode is remembered in `sessionStorage`, so someone can switch on resting
 * in their profile and land back here with `offer_help` still selected. Without
 * this the panel would render an empty list and read as a bug rather than as the
 * break they asked for.
 */
function RestingPanel({ blocked }: { blocked: boolean }) {
	const router = useRouter();

	return (
		<>
			<div>
				<Heading level={1} size={7}>
					Open requests
				</Heading>
			</div>
			<Card size={2} variant="surface" className="p-6">
				<div className="flex flex-col items-center gap-4 text-center">
					<Badge variant="soft" size={1} color={blocked ? "red" : "yellow"}>
						{blocked ? "Blocked" : "Resting"}
					</Badge>
					<Text size={3} color="gray">
						{blocked
							? "Your account is currently restricted, so open requests aren't available. Contact a coordinator if you think this is a mistake."
							: "You're taking a break, so open requests are hidden. Nothing is waiting on you."}
					</Text>
					{!blocked && (
						<Button
							variant="solid"
							color="yellow"
							size={2}
							border="large"
							borderColor="terracotta"
							onPress={() => router.push("/app/profile")}
						>
							Update helper preferences
						</Button>
					)}
				</div>
			</Card>
		</>
	);
}

function OfferingHelpPanel() {
	const profileRow = useQuery(api.users.getMyProfileRow);
	const myPending = useQuery(api.helpRequests.listMine, { statusFilter: "pending" });
	const [filters, setFilters] = useState<OpenRequestFilters>(EMPTY_OPEN_REQUEST_FILTERS);
	const [categoriesOpen, setCategoriesOpen] = useState(false);
	const [locationOpen, setLocationOpen] = useState(false);
	const [locationFilter, setLocationFilter] = useState<LocationFilter>(() =>
		locationFilterFromProfile(undefined));
	const [locationDraft, setLocationDraft] = useState<LocationFilter>(locationFilter);
	const [locationReady, setLocationReady] = useState(false);
	const [defaultLocation, setDefaultLocation] = useState<LocationFilter>(() =>
		locationFilterFromProfile(undefined));

	const locationInitRef = useRef(false);
	if (!locationInitRef.current && profileRow !== undefined) {
		locationInitRef.current = true;
		const fromProfile = locationFilterFromProfile(profileRow);
		setDefaultLocation(fromProfile);
		setLocationFilter(fromProfile);
		setLocationDraft(fromProfile);
		setLocationReady(true);
	}

	/*
	 * Treated as "may help" until the profile arrives so the list can start
	 * loading. The backend withholds open requests for resting and blocked users
	 * regardless of what is asked for here.
	 */
	const mayOfferHelp = profileRow === undefined || canOfferHelp(profileRow);

	const openForOthers = useQuery(
		api.helpRequests.listPendingFromOthers,
		locationReady && mayOfferHelp
			? {
					filterCenterLat: locationFilter.centerLat,
					filterCenterLng: locationFilter.centerLng,
					filterRadiusKm: locationFilter.radiusKm,
				}
			: "skip",
	);

	// Placed after every hook above so the hook order stays stable across renders.
	if (profileRow !== undefined && !mayOfferHelp) {
		return <RestingPanel blocked={profileRow?.blocked === true} />;
	}

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
						Your own requests stay under My requests.
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
					<Icon name="filter" className="size-3.5" />
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
					<Icon name="mapPin" className="size-3.5" />
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
					<Icon name="alert" className="size-3.5" />
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
						{/* Named by the dialog's own heading, which is this group's only label. */}
						<CheckboxGroup
							aria-labelledby="open-request-category-filter-title"
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
					{myPending !== undefined && myPending.length > 0 && (
						<Text size={2} color="gray" className="mt-3 text-center">
							You have
							{" "}
							{myPending.length === 1 ? "a pending request" : `${myPending.length} pending requests`}
							{" "}
							under My requests. Helpers will see
							{" "}
							{myPending.length === 1 ? "it" : "them"}
							{" "}
							here — your own posts are not listed on this page.
						</Text>
					)}
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
										{isRequestUrgent(r)
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
