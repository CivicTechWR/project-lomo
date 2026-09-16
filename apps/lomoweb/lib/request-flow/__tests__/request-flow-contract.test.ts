import { describe, expect, it } from "vitest";
import { requestDraftReducer } from "../../../app/app/request/request-draft-context";
import {
	getCategoryRoute,
	REQUEST_CATEGORIES,
	REQUEST_CATEGORY_ROUTE_MAP,
} from "../categories";
import { emptyDraft } from "../types";

describe("request flow contract", () => {
	it("keeps draft defaults centralized in the shared request model", () => {
		const draft = emptyDraft();

		expect(draft.category).toBeNull();
		expect(draft.foodKind).toBeNull();
		expect(draft.urgency).toBeNull();
		expect(draft.foodDetails.groceryNoPreference).toBe(false);
		expect(draft.itemsDetails.itemDescription).toBe("");
		expect(draft.otherDetails.whatNeed).toBe("");
		expect(draft.micrograntDetails.needType).toBeNull();
		expect(draft.ceremonyDetails.role).toBeNull();
	});

	it("merges nested category updates without wiping unrelated draft fields", () => {
		const draft = {
			...emptyDraft(),
			category: "food" as const,
			foodKind: "meal" as const,
			urgency: "when_possible" as const,
			foodDetails: {
				...emptyDraft().foodDetails,
				helpfulNote: "Initial note",
				allergies: "Peanuts",
			},
		};

		const next = requestDraftReducer(draft, {
			type: "setFoodDetails",
			patch: { helpfulNote: "Updated note", peopleCount: "3" },
		});

		expect(next.category).toBe("food");
		expect(next.foodKind).toBe("meal");
		expect(next.urgency).toBe("when_possible");
		expect(next.foodDetails).toMatchObject({
			helpfulNote: "Updated note",
			peopleCount: "3",
			allergies: "Peanuts",
		});
		expect(next.foodDetails.groceryNoPreference).toBe(false);
	});

	it("resets the request draft to the shared empty defaults", () => {
		const draft = {
			...emptyDraft(),
			category: "support" as const,
			foodKind: "groceries" as const,
			urgency: "urgent" as const,
			publicWalkDetails: {
				...emptyDraft().publicWalkDetails,
				location: "Central park",
			},
		};

		const next = requestDraftReducer(draft, { type: "reset" });

		expect(next).toEqual(emptyDraft());
		expect(next.category).toBeNull();
		expect(next.foodKind).toBeNull();
		expect(next.urgency).toBeNull();
	});

	it("creates a clean reset draft for a new request flow", () => {
		const filledDraft = emptyDraft();
		filledDraft.category = "food";
		filledDraft.foodKind = "groceries";
		filledDraft.urgency = "urgent";
		filledDraft.foodDetails.helpfulNote = "Need groceries";

		const resetDraft = emptyDraft();

		expect(resetDraft).toEqual(emptyDraft());
		expect(resetDraft).not.toEqual(filledDraft);
		expect(resetDraft.category).toBeNull();
		expect(resetDraft.foodKind).toBeNull();
		expect(resetDraft.urgency).toBeNull();
	});

	it("keeps category metadata aligned with the shared route registry", () => {
		expect(REQUEST_CATEGORIES.map(category => category.id)).toEqual(
			Object.keys(REQUEST_CATEGORY_ROUTE_MAP),
		);
		expect(REQUEST_CATEGORIES).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: "food",
					title: "Food",
					description: "Meals or groceries",
					implemented: true,
				}),
				expect.objectContaining({
					id: "ceremony",
					title: "Ceremony",
					description: "Firekeeping and cultural supports",
					implemented: true,
				}),
			]),
		);
	});

	it("uses a single shared route registry for each request category", () => {
		expect(REQUEST_CATEGORIES.map(category => category.id)).toEqual(
			Object.keys(REQUEST_CATEGORY_ROUTE_MAP),
		);
		expect(getCategoryRoute("food")).toBe("/app/request/food/kind");
		expect(getCategoryRoute("items")).toBe("/app/request/items/details");
		expect(getCategoryRoute("other")).toBe("/app/request/other/details");
		expect(getCategoryRoute("support")).toBe("/app/request/support/details");
		expect(getCategoryRoute("paperwork")).toBe("/app/request/paperwork/details");
		expect(getCategoryRoute("ceremony")).toBe("/app/request/ceremony/role");
	});
});
