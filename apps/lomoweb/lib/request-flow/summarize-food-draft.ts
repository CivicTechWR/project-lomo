import type { RequestDraft } from "./types";
import {
	FOOD_KIND_OPTIONS,
	GROCERY_TYPE_OPTIONS,
	URGENCY_OPTIONS,
} from "./food";

export function summarizeFoodDraftBody(draft: RequestDraft): string {
	const lines: string[] = [];
	const k = FOOD_KIND_OPTIONS.find(o => o.id === draft.foodKind);
	if (k) {
		lines.push(`Food type: ${k.title}`);
	}
	if (draft.foodKind === "groceries") {
		const { groceryNoPreference, groceryTypes } = draft.foodDetails;
		if (groceryNoPreference) {
			lines.push("Groceries: no preference");
		}
		else if (groceryTypes.length > 0) {
			const labels = groceryTypes
				.map(
					id =>
						GROCERY_TYPE_OPTIONS.find(o => o.id === id)?.label ?? id,
				)
				.join(", ");
			lines.push(`Groceries: ${labels}`);
		}
	}
	if (draft.foodDetails.helpfulNote.trim()) {
		lines.push(draft.foodDetails.helpfulNote.trim());
	}
	if (draft.foodDetails.allergies.trim()) {
		lines.push(`Allergies: ${draft.foodDetails.allergies.trim()}`);
	}
	if (draft.foodDetails.dietary.trim()) {
		lines.push(`Dietary: ${draft.foodDetails.dietary.trim()}`);
	}
	if (draft.foodDetails.peopleCount.trim()) {
		lines.push(`People: ${draft.foodDetails.peopleCount.trim()}`);
	}
	if (draft.foodDetails.needsDelivery) {
		lines.push("Delivery requested");
		if (draft.foodDetails.address.trim()) {
			lines.push(`Address: ${draft.foodDetails.address.trim()}`);
		}
		if (draft.foodDetails.deliveryInstructions.trim()) {
			lines.push(
				`Instructions: ${draft.foodDetails.deliveryInstructions.trim()}`,
			);
		}
	}
	const u = URGENCY_OPTIONS.find(o => o.id === draft.urgency);
	if (u) {
		lines.push(`Urgency: ${u.title}`);
	}
	return lines.length > 0
		? lines.join("\n")
		: "No extra details yet — you can go back to add more.";
}

export function foodRequestTitle(draft: RequestDraft): string {
	if (draft.foodKind === "groceries") {
		return "Groceries request";
	}
	if (draft.foodKind === "meal") {
		return "Meal request";
	}
	return "Food request";
}

export function foodRequestListSummary(draft: RequestDraft): string {
	const body = summarizeFoodDraftBody(draft);
	const first = body.split("\n")[0] ?? body;
	return first.length > 140 ? `${first.slice(0, 137)}…` : first;
}
