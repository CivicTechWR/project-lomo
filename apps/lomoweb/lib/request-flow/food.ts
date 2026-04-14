import type { FoodKindId, GroceryTypeId, RequestUrgencyId } from "./types.ts";

export interface FoodKindOption {
	id: FoodKindId;
	title: string;
	description: string;
}

export const GROCERY_TYPE_OPTIONS: { id: GroceryTypeId; label: string }[] = [
	{ id: "fresh", label: "Fresh" },
	{ id: "frozen", label: "Frozen" },
	{ id: "shelf_stable", label: "Shelf-stable" },
	{ id: "snacks", label: "Snacks" },
];

export const FOOD_KIND_OPTIONS: FoodKindOption[] = [
	{
		id: "meal",
		title: "A meal",
		description: "Ready to eat: warm, refrigerated, or frozen",
	},
	{
		id: "groceries",
		title: "Groceries",
		description: "Fresh ingredients, shelf-stable, or school snacks",
	},
];

export const URGENCY_OPTIONS: {
	id: RequestUrgencyId;
	title: string;
	description: string;
}[] = [
	{
		id: "when_possible",
		title: "When possible",
		description: "No rush",
	},
	{
		id: "few_days",
		title: "The next few days",
		description: "Soon would be good",
	},
	{
		id: "urgent",
		title: "Urgent",
		description: "As soon as possible",
	},
];
