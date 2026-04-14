import type { RequestDraft } from "./types";

const ROLE_LABEL: Record<"firekeeping" | "ceremony_support", string> = {
	firekeeping: "Firekeeping",
	ceremony_support: "Ceremony support",
};

export function summarizeCeremonyDraftBody(draft: RequestDraft): string {
	const lines: string[] = [];
	const d = draft.ceremonyDetails;
	if (d.role) {
		lines.push(`Role: ${ROLE_LABEL[d.role]}`);
	}
	if (d.whatNeed.trim()) {
		lines.push(`Need: ${d.whatNeed.trim()}`);
	}
	if (d.ceremonyType.trim()) {
		lines.push(`Ceremony type: ${d.ceremonyType.trim()}`);
	}
	if (d.durationApprox.trim()) {
		lines.push(`Duration: ${d.durationApprox.trim()}`);
	}
	if (d.helperNotes.trim()) {
		lines.push(`Notes: ${d.helperNotes.trim()}`);
	}
	if (d.whenText.trim()) {
		lines.push(`When: ${d.whenText.trim()}`);
	}
	if (d.locationAddress.trim()) {
		lines.push(`Location: ${d.locationAddress.trim()}`);
	}
	if (d.locationDirections.trim()) {
		lines.push(`Directions: ${d.locationDirections.trim()}`);
	}
	return lines.length > 0
		? lines.join("\n")
		: "No ceremony details yet — you can go back to add more.";
}

export function ceremonyRequestTitle(draft: RequestDraft): string {
	if (draft.ceremonyDetails.role) {
		return ROLE_LABEL[draft.ceremonyDetails.role];
	}
	return "Ceremony support";
}

export function ceremonyRequestListSummary(draft: RequestDraft): string {
	const body = summarizeCeremonyDraftBody(draft);
	const first = body.split("\n")[0] ?? body;
	return first.length > 140 ? `${first.slice(0, 137)}…` : first;
}
