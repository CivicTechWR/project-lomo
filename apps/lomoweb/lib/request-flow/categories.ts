import type { RequestCategoryId } from "./types.ts";

export interface RequestCategoryMeta {
	id: RequestCategoryId;
	title: string;
	description: string;
	/** If false, show as disabled until the flow is implemented. */
	implemented: boolean;
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
