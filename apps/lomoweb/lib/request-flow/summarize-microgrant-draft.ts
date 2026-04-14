import type { RequestDraft } from "./types";

const NEED_LABEL: Record<
	| "education_career"
	| "food_groceries"
	| "transportation"
	| "medication_health"
	| "phone_internet"
	| "utilities_bills"
	| "clothing_essentials"
	| "something_else",
	string
> = {
	education_career: "Education or career",
	food_groceries: "Food or groceries",
	transportation: "Transportation",
	medication_health: "Medication or health costs",
	phone_internet: "Phone or internet",
	utilities_bills: "Utilities or bills",
	clothing_essentials: "Clothing or essentials",
	something_else: "Something else",
};

const AMOUNT_LABEL: Record<"under_25" | "25_50" | "50_100" | "100_plus", string> = {
	under_25: "Under $25",
	"25_50": "$25-$50",
	"50_100": "$50-$100",
	"100_plus": "$100+",
};

export function summarizeMicrograntDraftBody(draft: RequestDraft): string {
	const lines: string[] = [];
	const d = draft.micrograntDetails;
	if (d.needType) {
		lines.push(`Help with: ${NEED_LABEL[d.needType]}`);
	}
	if (d.needType === "something_else" && d.needOtherText.trim()) {
		lines.push(`Other need: ${d.needOtherText.trim()}`);
	}
	if (d.amountRange) {
		lines.push(`Amount: ${AMOUNT_LABEL[d.amountRange]}`);
	}
	if (d.amountRange === "100_plus" && d.amountOver100Text.trim()) {
		lines.push(`Amount detail: ${d.amountOver100Text.trim()}`);
	}
	if (d.needByText.trim()) {
		lines.push(`Needed by: ${d.needByText.trim()}`);
	}
	if (d.optionalDetails.trim()) {
		lines.push(d.optionalDetails.trim());
	}
	if (d.methods.length > 0) {
		lines.push(`Delivery method: ${d.methods.join(", ")}`);
	}
	return lines.length > 0
		? lines.join("\n")
		: "No microgrant details yet — you can go back to add more.";
}

export function micrograntRequestTitle(_draft: RequestDraft): string {
	return "Microgrant support";
}

export function micrograntRequestListSummary(draft: RequestDraft): string {
	const body = summarizeMicrograntDraftBody(draft);
	const first = body.split("\n")[0] ?? body;
	return first.length > 140 ? `${first.slice(0, 137)}…` : first;
}
