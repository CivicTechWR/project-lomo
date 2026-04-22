/**
 * Strip address / location lines from stored request `details` for volunteers
 * who are not yet matched in progress. Keeps Convex responses from leaking
 * structured locations via `details` text (payload is cleared separately).
 */
const REJECT_LINE_PREFIXES = [
	"Address:",
	"Instructions:",
	"Pickup:",
	"Drop-off:",
	"Location:",
	"Directions:",
] as const;

function lineLooksSensitive(line: string): boolean {
	const t = line.trimStart();
	return REJECT_LINE_PREFIXES.some(p => t.startsWith(p));
}

export function redactRequestDetailsText(details: string): string {
	const lines = details.split("\n").filter(l => !lineLooksSensitive(l));
	const out = lines.join("\n").trim();
	return out.length > 0 ? out : "Location and address details are hidden until you are matched.";
}

function firstSummaryLine(details: string, maxLen: number): string {
	const first = details.split("\n")[0]?.trim() ?? details.trim();
	if (first.length <= maxLen) {
		return first;
	}
	return `${first.slice(0, Math.max(0, maxLen - 1))}…`;
}

/** Generic titles when the stored title may embed locations or long free text. */
export function redactRequestTitleForVolunteer(
	category: string,
	title: string,
): string {
	if (category === "ride") {
		return "Ride request";
	}
	if (category === "other") {
		return "Other request";
	}
	if (category === "support" && title.includes(" — ")) {
		return "Walk together";
	}
	return title;
}

export function redactHelpRequestForVolunteer<T extends {
	category: string;
	title: string;
	summary: string;
	details: string;
	payload?: string;
}>(doc: T): T {
	const details = redactRequestDetailsText(doc.details);
	const summary = firstSummaryLine(details, 140);
	const title = redactRequestTitleForVolunteer(doc.category, doc.title);
	return {
		...doc,
		title,
		summary,
		details,
		payload: undefined,
	};
}
