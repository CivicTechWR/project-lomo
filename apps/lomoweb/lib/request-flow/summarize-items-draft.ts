import type { RequestDraft } from "./types";
import { URGENCY_OPTIONS } from "./food";

export function summarizeItemsDraftBody(draft: RequestDraft): string {
	const lines: string[] = [];
	const it = draft.itemsDetails;
	if (it.itemDescription.trim()) {
		lines.push(it.itemDescription.trim());
	}
	if (it.sizeOrStyle.trim()) {
		lines.push(`Size or style: ${it.sizeOrStyle.trim()}`);
	}
	if (it.needsDelivery) {
		lines.push("Delivery requested");
		if (it.address.trim()) {
			lines.push(`Address: ${it.address.trim()}`);
		}
		if (it.deliveryInstructions.trim()) {
			lines.push(
				`Instructions: ${it.deliveryInstructions.trim()}`,
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

export function itemsRequestTitle(draft: RequestDraft): string {
	const first = draft.itemsDetails.itemDescription.trim().split("\n")[0] ?? "";
	if (first.length > 0) {
		return first.length > 48 ? `${first.slice(0, 45)}…` : first;
	}
	return "Items request";
}

export function itemsRequestListSummary(draft: RequestDraft): string {
	const body = summarizeItemsDraftBody(draft);
	const first = body.split("\n")[0] ?? body;
	return first.length > 140 ? `${first.slice(0, 137)}…` : first;
}
