export type HelpRequestStatus
	= | "pending"
		| "assigned"
		| "awaiting_requester_acceptance"
		| "in_progress"
		| "complete"
		| "cancelled";

export const HELP_REQUEST_STATUS_LABEL: Record<HelpRequestStatus, string> = {
	pending: "Pending",
	assigned: "Assigned",
	awaiting_requester_acceptance: "Awaiting your confirmation",
	in_progress: "In progress",
	complete: "Complete",
	cancelled: "Cancelled",
};

/** Filter chips: `null` = all requests */
export type HelpRequestStatusFilter = HelpRequestStatus | null;

export const HELP_REQUEST_FILTER_CHIPS: {
	value: HelpRequestStatusFilter;
	label: string;
}[] = [
	{ value: null, label: "All" },
	{ value: "pending", label: "Pending" },
	{ value: "assigned", label: "Assigned" },
	{ value: "awaiting_requester_acceptance", label: "Awaiting acceptance" },
	{ value: "in_progress", label: "In progress" },
	{ value: "complete", label: "Complete" },
	{ value: "cancelled", label: "Cancelled" },
];

export type StatusBadgeColor
	= | "gray"
		| "amber"
		| "red"
		| "sage"
		| "terracotta"
		| "yellow"
		| "darkred";

export interface StatusBadgeProps {
	color: StatusBadgeColor;
	variant: "soft" | "solid";
	/** Optional override (e.g. blue complete — not a Badge color token yet). */
	className?: string;
}

/**
 * Visual treatment for request status pills.
 *
 * pending → grey, in progress → green, awaiting → orange, cancelled → black,
 * complete → blue. Urgent is handled separately (bright red solid).
 */
export function statusBadgeProps(status: HelpRequestStatus): StatusBadgeProps {
	switch (status) {
		case "pending":
			return { color: "gray", variant: "soft" };
		case "assigned":
		case "awaiting_requester_acceptance":
			return { color: "amber", variant: "soft" };
		case "in_progress":
			return { color: "sage", variant: "soft" };
		case "complete":
			return {
				color: "gray",
				variant: "soft",
				className: "!bg-blue-3 !text-blue-11",
			};
		case "cancelled":
			return { color: "gray", variant: "solid" };
	}
}

/** @deprecated Prefer `statusBadgeProps` when variant/className matter. */
export function statusBadgeColor(
	status: HelpRequestStatus,
): StatusBadgeColor {
	return statusBadgeProps(status).color;
}
