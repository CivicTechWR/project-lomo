import type { api } from "@repo/convex-backend/convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { RequestCategoryId } from "@/lib/request-flow/types";
import { REQUEST_CATEGORIES } from "@/lib/request-flow/categories";
import { isRequestUrgent } from "@/lib/request-urgency";

type OpenRequestListItem = FunctionReturnType<
	typeof api.helpRequests.listPendingFromOthers
>[number];

export const OPEN_REQUEST_CATEGORY_IDS: RequestCategoryId[] = REQUEST_CATEGORIES
	.filter(category => category.implemented)
	.map(category => category.id);

export interface OpenRequestFilters {
	categories: RequestCategoryId[];
	urgentOnly: boolean;
}

export const EMPTY_OPEN_REQUEST_FILTERS: OpenRequestFilters = {
	categories: [],
	urgentOnly: false,
};

export function hasActiveOpenRequestFilters(filters: OpenRequestFilters): boolean {
	// Empty categories means "all categories" — not an active filter.
	if (filters.categories.length > 0) {
		return true;
	}
	if (filters.urgentOnly) {
		return true;
	}
	return false;
}

export function filterOpenRequests(
	requests: OpenRequestListItem[],
	filters: OpenRequestFilters,
): OpenRequestListItem[] {
	const selectedCategories = new Set<string>(filters.categories);
	const filterByCategory = selectedCategories.size > 0;

	return requests.filter((item) => {
		if (filterByCategory && !selectedCategories.has(item.category)) {
			return false;
		}
		if (filters.urgentOnly && !isRequestUrgent(item)) {
			return false;
		}
		return true;
	});
}
