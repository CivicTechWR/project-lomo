"use client";

import type { api } from "@repo/convex-backend/convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

import type { ReactNode } from "react";
import type { HelpRequestStatus } from "@/lib/help-request-status";
import { Badge } from "@repo/ui/badge";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Heading } from "@repo/ui/heading";
import { Text } from "@repo/ui/text";

import Link from "next/link";
import { useEffect, useReducer } from "react";
import {
	HELP_REQUEST_STATUS_LABEL,
	statusBadgeColor,
} from "@/lib/help-request-status";
import { isRequestUrgent } from "@/lib/request-urgency";

export type HomeDashboard = NonNullable<
	FunctionReturnType<typeof api.helpRequests.homeDashboard>
>;

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
				className="flex w-full items-center gap-2 rounded-2 px-1 py-2 text-left outline-none ring-gray-8 transition-colors hover:bg-terracotta-1 focus-visible:ring-2"
				aria-expanded={expanded}
				aria-controls={panelId}
				onClick={() => onExpandedChange(!expanded)}
			>
				<ChevronIcon expanded={expanded} className="shrink-0 text-gray-11" />
				<Heading level={2} size={5} className="min-w-0 flex-1">
					{title}
				</Heading>
				<span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-darkred-9 text-(length:--text-2) font-semibold text-darkred-9">
					{count}
				</span>
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

export function RequestCardLink(props: {
	href: string;
	title: string;
	summary: string;
	badges?: ReactNode;
}) {
	const { href, title, summary, badges } = props;
	return (
		<Link
			href={href}
			className="block rounded-[max(var(--radius-4),12px)] border-2 border-terracotta-9 bg-white shadow-brand outline-none transition-transform duration-150 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gray-8 focus-visible:ring-offset-2"
		>
			<Card
				size={2}
				variant="ghost"
				color="gray"
				className="bg-white p-4 transition-colors hover:bg-terracotta-1"
			>
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0 flex-1">
						<Text size={3} weight="medium" className="line-clamp-2 text-gray-12">
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

interface DashboardSectionState {
	activeOpen: boolean;
	pendingOpen: boolean;
	openRequestsOpen: boolean;
}

type DashboardSectionAction
	= | { type: "hydrate"; dashboard: HomeDashboard }
		| { type: "toggleActive" }
		| { type: "togglePending" }
		| { type: "toggleOpenRequests" };

function dashboardSectionReducer(
	state: DashboardSectionState,
	action: DashboardSectionAction,
): DashboardSectionState {
	switch (action.type) {
		case "hydrate":
			return {
				activeOpen: action.dashboard.active.length > 0,
				pendingOpen: action.dashboard.pendingMine.length > 0,
				openRequestsOpen: action.dashboard.canHelpNow && action.dashboard.openPreview.length > 0,
			};
		case "toggleActive":
			return { ...state, activeOpen: !state.activeOpen };
		case "togglePending":
			return { ...state, pendingOpen: !state.pendingOpen };
		case "toggleOpenRequests":
			return { ...state, openRequestsOpen: !state.openRequestsOpen };
		default:
			return state;
	}
}

export function HomeDashboardPanel(props: {
	dashboard: HomeDashboard | undefined;
	onViewAllMine: () => void;
	onViewAllOpen: () => void;
	onNewRequest: () => void;
}) {
	const { dashboard, onViewAllMine, onViewAllOpen, onNewRequest } = props;
	const [sectionState, dispatch] = useReducer(dashboardSectionReducer, {
		activeOpen: true,
		pendingOpen: true,
		openRequestsOpen: true,
	});

	useEffect(() => {
		if (dashboard) {
			dispatch({ type: "hydrate", dashboard });
		}
	}, [dashboard]);

	const { activeOpen, pendingOpen, openRequestsOpen } = sectionState;
	const showActive = dashboard !== undefined && dashboard.active.length > 0;
	const showPending = dashboard !== undefined && dashboard.pendingMineTotal > 0;
	const showOpenRequests = dashboard !== undefined && dashboard.canHelpNow && dashboard.openTotal > 0;

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
						color="yellow"
						size={2}
						border="large"
						borderColor="terracotta"
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
					{showActive && (
						<HomeSection
							id="active-matches"
							title="Support in progress"
							count={dashboard.active.length}
							expanded={activeOpen}
							onExpandedChange={() => dispatch({ type: "toggleActive" })}
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
					)}

					{showPending && (
						<HomeSection
							id="pending-requests"
							title="My requests for support"
							count={dashboard.pendingMineTotal}
							expanded={pendingOpen}
							onExpandedChange={() => dispatch({ type: "togglePending" })}
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
																	{isRequestUrgent(item)
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
												variant="outline"
												color="terracotta"
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
							onExpandedChange={() => dispatch({ type: "toggleOpenRequests" })}
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
																	{isRequestUrgent(item)
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
												variant="solid"
												color="terracotta"
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
