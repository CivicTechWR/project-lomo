import type { RequestDraft } from "./types";

export function summarizeOtherDraftBody(draft: RequestDraft): string {
	const o = draft.otherDetails;
	const lines: string[] = [];
	if (o.whatNeed.trim()) {
		lines.push(o.whatNeed.trim());
	}
	if (o.whenText.trim()) {
		lines.push(`When: ${o.whenText.trim()}`);
	}
	if (o.location.trim()) {
		lines.push(`Location: ${o.location.trim()}`);
	}
	return lines.length > 0
		? lines.join("\n")
		: "No details yet — go back to add what you need.";
}

export function otherRequestTitle(draft: RequestDraft): string {
	const first = draft.otherDetails.whatNeed.trim().split("\n")[0] ?? "";
	if (first.length > 0) {
		return first.length > 52 ? `${first.slice(0, 49)}…` : first;
	}
	return "Other request";
}

export function otherRequestListSummary(draft: RequestDraft): string {
	const body = summarizeOtherDraftBody(draft);
	const first = body.split("\n")[0] ?? body;
	return first.length > 140 ? `${first.slice(0, 137)}…` : first;
}
