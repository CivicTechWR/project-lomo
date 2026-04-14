import type { RequestDraft } from "./types";

const WALK_LENGTH_LABEL: Record<"10_15" | "20_30" | "45_60", string> = {
	"10_15": "10-15 minutes",
	"20_30": "20-30 minutes",
	"45_60": "45-60 minutes",
};

const WALK_TYPE_LABEL: Record<
	"slow_scenic" | "conversational" | "quiet_presence" | "grounding" | "not_sure_yet",
	string
> = {
	slow_scenic: "Slow & scenic",
	conversational: "Conversational",
	quiet_presence: "Quiet presence",
	grounding: "Grounding",
	not_sure_yet: "Not sure yet",
};

export function summarizeSupportDraftBody(draft: RequestDraft): string {
	const lines: string[] = [];
	const d = draft.publicWalkDetails;
	if (d.preferredTime.trim()) {
		lines.push(`Preferred time: ${d.preferredTime.trim()}`);
	}
	if (d.walkLength) {
		lines.push(`Length: ${WALK_LENGTH_LABEL[d.walkLength]}`);
	}
	if (d.location.trim()) {
		lines.push(`Location: ${d.location.trim()}`);
	}
	if (d.walkTypes.length > 0) {
		lines.push(
			`Walk style: ${d.walkTypes.map(v => WALK_TYPE_LABEL[v]).join(", ")}`,
		);
	}
	return lines.length > 0
		? lines.join("\n")
		: "No walk details yet — you can go back to add more.";
}

export function supportRequestTitle(draft: RequestDraft): string {
	const loc = draft.publicWalkDetails.location.trim();
	if (loc) {
		return loc.length > 48 ? `${loc.slice(0, 45)}…` : `Walk together — ${loc}`;
	}
	return "Walk together";
}

export function supportRequestListSummary(draft: RequestDraft): string {
	const body = summarizeSupportDraftBody(draft);
	const first = body.split("\n")[0] ?? body;
	return first.length > 140 ? `${first.slice(0, 137)}…` : first;
}
