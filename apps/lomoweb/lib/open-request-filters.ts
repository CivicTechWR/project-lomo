import type { FunctionReturnType } from "convex/server";
import type { api } from "@repo/convex-backend/convex/_generated/api";
import type { RequestCategoryId } from "@/lib/request-flow/types";
import { REQUEST_CATEGORIES } from "@/lib/request-flow/categories";

type OpenRequestListItem = FunctionReturnType<
	typeof api.helpRequests.listPendingFromOthers
>[number];

export const OPEN_REQUEST_CATEGORY_IDS: RequestCategoryId[] = REQUEST_CATEGORIES
	.filter(category => category.implemented)
	.map(category => category.id);

export type OpenRequestFilters = {
	categories: RequestCategoryId[];
	urgentOnly: boolean;
};

export const EMPTY_OPEN_REQUEST_FILTERS: OpenRequestFilters = {
	categories: [...OPEN_REQUEST_CATEGORY_IDS],
	urgentOnly: false,
};

export function hasActiveOpenRequestFilters(filters: OpenRequestFilters): boolean {
	if (filters.categories.length !== OPEN_REQUEST_CATEGORY_IDS.length) {
		return true;
	}
	for (const id of OPEN_REQUEST_CATEGORY_IDS) {
		if (!filters.categories.includes(id)) {
			return true;
		}
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
	const selectedCategories = new Set(filters.categories);

	return requests.filter((item) => {
		if (!selectedCategories.has(item.category)) {
			return false;
		}
		if (filters.urgentOnly && !item.isUrgent) {
			return false;
		}
		return true;
	});
}
