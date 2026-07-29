import type { RequestCategoryId } from "./request-flow/types.ts";
import { REQUEST_CATEGORIES } from "./request-flow/categories.ts";

/** Category ids in the order they appear in the request flow. */
export const HELP_REQUEST_CATEGORY_IDS: RequestCategoryId[]
	= REQUEST_CATEGORIES.map(c => c.id);

const CATEGORY_LABEL: Record<RequestCategoryId, string> = Object.fromEntries(
	REQUEST_CATEGORIES.map(c => [c.id, c.title]),
) as Record<RequestCategoryId, string>;

/** Human-readable label for a category id (falls back to the raw id). */
export function helpRequestCategoryLabel(category: string): string {
	return CATEGORY_LABEL[category as RequestCategoryId] ?? category;
}
