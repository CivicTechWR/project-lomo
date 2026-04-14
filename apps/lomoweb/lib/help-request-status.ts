export type HelpRequestStatus =
	| "pending"
	| "rejected"
	| "in_progress"
	| "complete"
	| "cancelled";

export const HELP_REQUEST_STATUS_LABEL: Record<HelpRequestStatus, string> = {
	pending: "Pending",
	rejected: "Rejected",
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
	{ value: "in_progress", label: "In progress" },
	{ value: "complete", label: "Complete" },
	{ value: "rejected", label: "Rejected" },
	{ value: "cancelled", label: "Cancelled" },
];

export function statusBadgeColor(
	status: HelpRequestStatus,
): "gray" | "amber" | "red" | "sage" | "terracotta" {
	switch (status) {
		case "pending":
			return "amber";
		case "rejected":
			return "red";
		case "in_progress":
			return "terracotta";
		case "complete":
			return "sage";
		case "cancelled":
			return "gray";
	}
}
