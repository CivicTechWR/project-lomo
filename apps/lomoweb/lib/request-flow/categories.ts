import type { RequestCategoryId } from "./types.ts";

export interface RequestCategoryMeta {
	id: RequestCategoryId;
	title: string;
	description: string;
	/** If false, show as disabled until the flow is implemented. */
	implemented: boolean;
}

export const REQUEST_CATEGORY_ROUTE_MAP: Record<RequestCategoryId, string> = {
	food: "/app/request/food/kind",
	items: "/app/request/items/details",
	other: "/app/request/other/details",
	support: "/app/request/support/details",
	paperwork: "/app/request/paperwork/details",
	ceremony: "/app/request/ceremony/role",
};

export function getCategoryRoute(id: RequestCategoryId): string {
	return REQUEST_CATEGORY_ROUTE_MAP[id];
}

export const REQUEST_CATEGORIES: RequestCategoryMeta[] = [
	{
		id: "food",
		title: "Food",
		description: "Meals or groceries",
		implemented: true,
	},
	{
		id: "items",
		title: "Items",
		description: "Clothing, equipment, tools, or cultural medicines",
		implemented: true,
	},
	{
		id: "other",
		title: "Other",
		description: "Anything else — describe what you need in your own words.",
		implemented: true,
	},
	{
		id: "support",
		title: "Public walks",
		description: "Walk together in a public place",
		implemented: true,
	},
	{
		id: "paperwork",
		title: "Microgrants",
		description: "Small, one-time financial help",
		implemented: true,
	},
	{
		id: "ceremony",
		title: "Ceremony",
		description: "Firekeeping and cultural supports",
		implemented: true,
	},
];
